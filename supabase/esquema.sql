-- Rutina diaria: esquema propio dentro del proyecto de Supabase de microrrutas.
-- El esquema "rutina" no se expone a la API: la app entra solo por las funciones rutina_* de public,
-- y cada usuario ve únicamente su fila (auth.uid()). Se puede correr varias veces.

create schema if not exists rutina;
revoke all on schema rutina from public, anon, authenticated;

-- Todo el estado de la app de un usuario (lo mismo que se guarda en el celular)
create table if not exists rutina.estado (
  usuario     uuid primary key references auth.users(id) on delete cascade,
  datos       jsonb not null,
  version     bigint not null,               -- milisegundos del último cambio hecho en el celular
  actualizado timestamptz not null default now()
);
alter table rutina.estado enable row level security;

create or replace function public.rutina_leer()
returns table (datos jsonb, version bigint)
language sql stable security definer set search_path = ''
as $$
  select e.datos, e.version from rutina.estado e where e.usuario = auth.uid();
$$;

-- Guarda solo si lo que llega es igual o más nuevo que lo de la nube; devuelve la versión que quedó.
-- Si devuelve una versión mayor a la enviada, otro equipo guardó algo más reciente: la app la descarga.
create or replace function public.rutina_guardar(p_datos jsonb, p_version bigint)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare v bigint;
begin
  if auth.uid() is null then raise exception 'Inicia sesión para guardar en la nube'; end if;
  insert into rutina.estado (usuario, datos, version) values (auth.uid(), p_datos, p_version)
  on conflict (usuario) do update set datos = excluded.datos, version = excluded.version, actualizado = now()
    where rutina.estado.version <= excluded.version;
  select e.version into v from rutina.estado e where e.usuario = auth.uid();
  return v;
end;
$$;

revoke execute on function public.rutina_leer() from public, anon;
revoke execute on function public.rutina_guardar(jsonb, bigint) from public, anon;
grant execute on function public.rutina_leer() to authenticated;
grant execute on function public.rutina_guardar(jsonb, bigint) to authenticated;

-- ---------- Roles y permisos: quién ve qué (⚙️ Administrar) ----------
-- Solo esconden partes de la app: cada usuario sigue viendo y guardando únicamente sus propios datos, y el admin
-- nunca puede leer los datos de otro (ninguna función de aquí toca rutina.estado).

create table if not exists rutina.roles (
  id     text primary key,                 -- admin · estudiante · familia · los que cree el admin
  nombre text not null
);
insert into rutina.roles (id, nombre) values ('admin', 'Administrador'), ('estudiante', 'Estudiante'), ('familia', 'Familia')
on conflict (id) do nothing;
alter table rutina.roles enable row level security;

-- Un perfil por usuario de Rutina (el proyecto de Supabase es compartido con microrrutas: solo cuenta quien entró aquí)
create table if not exists rutina.perfiles (
  usuario uuid primary key references auth.users(id) on delete cascade,
  rol     text not null default 'estudiante' references rutina.roles(id) on update cascade,
  creado  timestamptz not null default now()
);
alter table rutina.perfiles enable row level security;

-- Cada regla es para un rol o para un usuario. tipo: seccion · area · curso; elemento: su id en la app
create table if not exists rutina.permisos (
  id       bigint generated always as identity primary key,
  tipo     text not null,
  elemento text not null,
  rol      text references rutina.roles(id) on update cascade on delete cascade,
  usuario  uuid references auth.users(id) on delete cascade,
  visible  boolean not null,
  check ((rol is null) <> (usuario is null))
);
create unique index if not exists permisos_por_rol on rutina.permisos (tipo, elemento, rol) where rol is not null;
create unique index if not exists permisos_por_usuario on rutina.permisos (tipo, elemento, usuario) where usuario is not null;
alter table rutina.permisos enable row level security;

create or replace function rutina.es_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from rutina.perfiles p where p.usuario = auth.uid() and p.rol = 'admin');
$$;

create or replace function rutina.solo_admin()
returns void
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not rutina.es_admin() then raise exception 'Solo el administrador puede hacer esto'; end if;
end;
$$;

-- Lo que le aplica a quien entra: su rol, las reglas de su rol y las suyas. La primera vez queda como estudiante.
create or replace function public.rutina_mis_permisos()
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare r text;
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  insert into rutina.perfiles (usuario) values (auth.uid()) on conflict (usuario) do nothing;
  select p.rol into r from rutina.perfiles p where p.usuario = auth.uid();
  return jsonb_build_object('rol', r, 'reglas', coalesce((
    select jsonb_agg(jsonb_build_object('tipo', x.tipo, 'id', x.elemento, 'visible', x.visible, 'usuario', x.usuario is not null))
    from rutina.permisos x where x.rol = r or x.usuario = auth.uid()), '[]'::jsonb));
end;
$$;

-- Lo de la pantalla Administrar: usuarios de Rutina (correo, rol, última entrada), roles y reglas. Nada de sus datos.
create or replace function public.rutina_admin_datos()
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform rutina.solo_admin();
  return jsonb_build_object(
    'usuarios', coalesce((select jsonb_agg(jsonb_build_object('id', p.usuario, 'correo', u.email, 'rol', p.rol, 'ultima', u.last_sign_in_at, 'creado', p.creado) order by u.email)
      from rutina.perfiles p join auth.users u on u.id = p.usuario), '[]'::jsonb),
    'roles', coalesce((select jsonb_agg(jsonb_build_object('id', r.id, 'nombre', r.nombre) order by r.id <> 'admin', r.nombre) from rutina.roles r), '[]'::jsonb),
    'reglas', coalesce((select jsonb_agg(jsonb_build_object('tipo', x.tipo, 'id', x.elemento, 'rol', x.rol, 'usuario', x.usuario, 'visible', x.visible))
      from rutina.permisos x), '[]'::jsonb));
end;
$$;

-- Cambiar el rol de un usuario (siempre queda al menos un admin)
create or replace function public.rutina_admin_rol(p_usuario uuid, p_rol text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform rutina.solo_admin();
  if p_rol <> 'admin' and (select p.rol from rutina.perfiles p where p.usuario = p_usuario) = 'admin'
     and (select count(*) from rutina.perfiles p where p.rol = 'admin') <= 1 then
    raise exception 'Tiene que quedar al menos un administrador';
  end if;
  update rutina.perfiles set rol = p_rol where usuario = p_usuario;
end;
$$;

-- Guardar la regla de un rol o de un usuario; p_visible null la quita (vuelve a lo de su rol, o a visible)
create or replace function public.rutina_admin_permiso(p_tipo text, p_elemento text, p_rol text, p_usuario uuid, p_visible boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform rutina.solo_admin();
  if p_rol = 'admin' then raise exception 'El administrador siempre ve todo'; end if;
  delete from rutina.permisos x where x.tipo = p_tipo and x.elemento = p_elemento
    and x.rol is not distinct from p_rol and x.usuario is not distinct from p_usuario;
  if p_visible is not null then
    insert into rutina.permisos (tipo, elemento, rol, usuario, visible) values (p_tipo, p_elemento, p_rol, p_usuario, p_visible);
  end if;
end;
$$;

-- Crear o renombrar un rol
create or replace function public.rutina_admin_guardar_rol(p_id text, p_nombre text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform rutina.solo_admin();
  if coalesce(trim(p_id), '') = '' or coalesce(trim(p_nombre), '') = '' then raise exception 'El rol necesita un nombre'; end if;
  insert into rutina.roles (id, nombre) values (p_id, trim(p_nombre)) on conflict (id) do update set nombre = excluded.nombre;
end;
$$;

-- Borrar un rol: sus usuarios pasan a estudiante y sus reglas se borran. Admin y estudiante no se borran.
create or replace function public.rutina_admin_borrar_rol(p_id text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform rutina.solo_admin();
  if p_id in ('admin', 'estudiante') then raise exception 'Ese rol no se puede borrar'; end if;
  update rutina.perfiles set rol = 'estudiante' where rol = p_id;
  delete from rutina.roles where id = p_id;
end;
$$;

revoke execute on function rutina.es_admin() from public, anon, authenticated;
revoke execute on function rutina.solo_admin() from public, anon, authenticated;
revoke execute on function public.rutina_mis_permisos() from public, anon;
revoke execute on function public.rutina_admin_datos() from public, anon;
revoke execute on function public.rutina_admin_rol(uuid, text) from public, anon;
revoke execute on function public.rutina_admin_permiso(text, text, text, uuid, boolean) from public, anon;
revoke execute on function public.rutina_admin_guardar_rol(text, text) from public, anon;
revoke execute on function public.rutina_admin_borrar_rol(text) from public, anon;
grant execute on function public.rutina_mis_permisos() to authenticated;
grant execute on function public.rutina_admin_datos() to authenticated;
grant execute on function public.rutina_admin_rol(uuid, text) to authenticated;
grant execute on function public.rutina_admin_permiso(text, text, text, uuid, boolean) to authenticated;
grant execute on function public.rutina_admin_guardar_rol(text, text) to authenticated;
grant execute on function public.rutina_admin_borrar_rol(text) to authenticated;

-- Que la API vea las funciones nuevas sin esperar
notify pgrst, 'reload schema';

-- Primer administrador: cambia el correo por el tuyo y corre esta línea una vez (en el SQL Editor de Supabase).
-- insert into rutina.perfiles (usuario, rol) select id, 'admin' from auth.users where email = 'tu-correo@ejemplo.com' on conflict (usuario) do update set rol = 'admin';
