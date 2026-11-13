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

-- Historial: copias anteriores del estado, para volver atrás si un equipo sube algo malo (11 nov 2026 se perdió todo
-- por una subida casi vacía). Se guarda una cada 10 minutos de uso, y siempre antes de una subida que quite datos.
create table if not exists rutina.historial (
  id       bigint generated always as identity primary key,
  usuario  uuid not null references auth.users(id) on delete cascade,
  datos    jsonb not null,
  version  bigint not null,
  guardado timestamptz not null default now(),
  motivo   text not null default 'automatica'
);
create index if not exists historial_usuario on rutina.historial (usuario, guardado desc);
alter table rutina.historial enable row level security;

-- Cuánto hay anotado en cada parte (lo que no se puede volver a sacar de la app)
create or replace function rutina.n_llaves(x jsonb)
returns int language sql immutable set search_path = ''
as $$ select case when jsonb_typeof(x) = 'object' then (select count(*) from jsonb_object_keys(x))::int else 0 end; $$;
create or replace function rutina.n_lista(x jsonb)
returns int language sql immutable set search_path = ''
as $$ select case when jsonb_typeof(x) = 'array' then jsonb_array_length(x) else 0 end; $$;

create or replace function rutina.conteo(d jsonb)
returns jsonb
language sql immutable set search_path = ''
as $$
  select jsonb_build_object(
    'dias', rutina.n_llaves(d->'dias'),
    'gym', coalesce((select sum(rutina.n_llaves(s.value)) from jsonb_each(case when jsonb_typeof(d->'semanas') = 'object' then d->'semanas' else '{}'::jsonb end) s), 0),
    'finanzas', rutina.n_lista(d->'finanzas'->'movimientos'),
    'estudio', rutina.n_llaves(d->'estudio'->'cursos') + rutina.n_llaves(d->'estudio'->'tarjetas') + rutina.n_llaves(d->'estudio'->'dias'),
    'libros', rutina.n_llaves(d->'libros'),
    'habitos', rutina.n_lista(d->'habitos'),
    'rutina', rutina.n_lista(d->'rutina'),
    'recordatorios', rutina.n_lista(d->'recordatorios'->'lista') + rutina.n_lista(d->'recordatorios'->'eventos'),
    'visitas', coalesce((select sum(rutina.n_lista(l->'visitas')) from jsonb_array_elements(case when jsonb_typeof(d->'lugares'->'lista') = 'array' then d->'lugares'->'lista' else '[]'::jsonb end) l), 0)
  );
$$;

-- Total de todo lo anotado
create or replace function rutina.cuanto(d jsonb)
returns int
language sql immutable set search_path = ''
as $$ select coalesce(sum(v::int), 0)::int from jsonb_each_text(rutina.conteo(d)) as t(k, v); $$;

-- La primera parte que una subida dejaría con menos de la mitad (solo partes con 6 o más cosas); null si ninguna.
-- Solo lo que nunca se borra de golpe a propósito: hábitos, rutina, libros y recordatorios sí se pueden limpiar
create or replace function rutina.parte_perdida(antes jsonb, ahora jsonb)
returns text
language sql immutable set search_path = ''
as $$
  select a.k || ': ' || a.v || ' → ' || coalesce(b.v, '0')
  from jsonb_each_text(rutina.conteo(antes)) a(k, v)
  left join jsonb_each_text(rutina.conteo(ahora)) b(k, v) on b.k = a.k
  where a.k in ('dias', 'gym', 'finanzas', 'estudio', 'visitas') and a.v::int >= 6 and coalesce(b.v::int, 0) * 2 < a.v::int
  order by a.k limit 1;
$$;

-- Copia lo que hay ahora en la nube al historial; deja las últimas 60 y una por día de los últimos 90 días
create or replace function rutina.respaldar(p_usuario uuid, p_motivo text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  insert into rutina.historial (usuario, datos, version, motivo)
    select e.usuario, e.datos, e.version, p_motivo from rutina.estado e where e.usuario = p_usuario;
  delete from rutina.historial h where h.usuario = p_usuario
    and h.id not in (select x.id from rutina.historial x where x.usuario = p_usuario order by x.guardado desc limit 60)
    and h.id not in (select distinct on (x.guardado::date) x.id from rutina.historial x
                     where x.usuario = p_usuario and x.guardado > now() - interval '90 days' order by x.guardado::date, x.guardado desc);
end;
$$;

-- Guarda solo si lo que llega es igual o más nuevo que lo de la nube; devuelve la versión que quedó.
-- Si devuelve una versión mayor a la enviada, otro equipo guardó algo más reciente: la app la descarga.
-- Protección: no deja subir algo que deje cualquier parte (días, gym, finanzas, estudio…) con menos de la mitad, ni
-- datos que no son de la app. Para volver atrás está rutina_restaurar; para empezar de cero, borrar la fila a mano.
create or replace function public.rutina_guardar(p_datos jsonb, p_version bigint)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare v bigint; viejo jsonb; antes int; ahora int; perdida text; ultima timestamptz;
begin
  if auth.uid() is null then raise exception 'Inicia sesión para guardar en la nube'; end if;
  if jsonb_typeof(p_datos) is distinct from 'object' or (p_datos->>'version') is distinct from '1'
     or jsonb_typeof(p_datos->'rutina') is distinct from 'array' then
    raise exception 'Protección: lo que llegó no son datos completos de la app. No se subió; la nube sigue igual.';
  end if;
  select e.datos, e.version into viejo, v from rutina.estado e where e.usuario = auth.uid();
  if viejo is not null and v <= p_version then
    antes := rutina.cuanto(viejo); ahora := rutina.cuanto(p_datos);
    perdida := rutina.parte_perdida(viejo, p_datos);
    if perdida is not null then
      raise exception 'Protección: esta subida borraría más de la mitad de una parte (%). No se subió; la nube sigue igual.', perdida;
    end if;
    select max(h.guardado) into ultima from rutina.historial h where h.usuario = auth.uid();
    if ahora < antes then perform rutina.respaldar(auth.uid(), 'quita datos');
    elsif ultima is null or ultima < now() - interval '10 minutes' then perform rutina.respaldar(auth.uid(), 'automatica');
    end if;
  end if;
  insert into rutina.estado (usuario, datos, version) values (auth.uid(), p_datos, p_version)
  on conflict (usuario) do update set datos = excluded.datos, version = excluded.version, actualizado = now()
    where rutina.estado.version <= excluded.version;
  select e.version into v from rutina.estado e where e.usuario = auth.uid();
  return v;
end;
$$;

-- Copias guardadas del usuario (las más nuevas primero), con cuánto tenía cada una
create or replace function public.rutina_historial()
returns table (id bigint, guardado timestamptz, motivo text, dias int, registros int)
language sql stable security definer set search_path = ''
as $$
  select h.id, h.guardado, h.motivo, (rutina.conteo(h.datos)->>'dias')::int, (rutina.conteo(h.datos)->>'gym')::int
  from rutina.historial h where h.usuario = auth.uid() order by h.guardado desc;
$$;

-- Vuelve a una copia: lo de ahora pasa al historial y la copia queda como lo más nuevo (los equipos la bajan solos)
create or replace function public.rutina_restaurar(p_id bigint)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare d jsonb; v bigint;
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  select h.datos into d from rutina.historial h where h.id = p_id and h.usuario = auth.uid();
  if d is null then raise exception 'Esa copia no existe'; end if;
  perform rutina.respaldar(auth.uid(), 'antes de restaurar');
  select greatest((extract(epoch from now()) * 1000)::bigint, coalesce(max(e.version), 0) + 1) into v from rutina.estado e where e.usuario = auth.uid();
  update rutina.estado set datos = jsonb_set(d, '{cambio}', to_jsonb(v)), version = v, actualizado = now() where usuario = auth.uid();
  return v;
end;
$$;

revoke all on function rutina.cuanto(jsonb) from public;
revoke all on function rutina.conteo(jsonb) from public;
revoke all on function rutina.parte_perdida(jsonb, jsonb) from public;
revoke all on function rutina.respaldar(uuid, text) from public, anon, authenticated;
revoke execute on function public.rutina_historial() from public, anon;
revoke execute on function public.rutina_restaurar(bigint) from public, anon;
grant execute on function public.rutina_historial() to authenticated;
grant execute on function public.rutina_restaurar(bigint) to authenticated;

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

-- ---------- Entrenador y clientes (👥 Clientes ↔ 🧑‍🏫 Mi entrenador) ----------
-- El entrenador invita con un código; quien lo acepta pasa a ser su cliente y, desde ese momento y hasta que lo corte:
--   · recibe el plan que el entrenador publica (rutina, comidas y ciclo)  → plan
--   · le comparte un resumen de su avance (series por semana, peso, fuerza y check-ins)  → resumen
-- Nadie lee el estado completo de otro (rutina.estado no se toca aquí): solo lo que cada uno decide mandar.
insert into rutina.roles (id, nombre) values ('entrenador', 'Entrenador'), ('cliente', 'Cliente') on conflict (id) do nothing;

create table if not exists rutina.asignaciones (
  id                  uuid primary key default gen_random_uuid(),
  entrenador          uuid not null references auth.users(id) on delete cascade,
  cliente_local       text not null,                 -- id del cliente en los datos del entrenador (estado.clientes)
  codigo              text not null unique,
  cliente             uuid references auth.users(id) on delete set null,
  estado              text not null default 'invitado' check (estado in ('invitado', 'activo', 'terminado')),
  plan                jsonb,
  plan_version        bigint,
  resumen             jsonb,
  resumen_actualizado timestamptz,
  creado              timestamptz not null default now(),
  aceptado            timestamptz,
  terminado           timestamptz
);
create unique index if not exists asignacion_viva on rutina.asignaciones (entrenador, cliente_local) where estado <> 'terminado';
create index if not exists asignaciones_cliente on rutina.asignaciones (cliente) where estado = 'activo';
alter table rutina.asignaciones enable row level security;

-- Pueden invitar el admin y quien tenga el rol entrenador
create or replace function rutina.puede_entrenar()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from rutina.perfiles p where p.usuario = auth.uid() and p.rol in ('admin', 'entrenador'));
$$;

-- Invitar (o volver a ver el código de) un cliente. Devuelve { codigo, estado }
create or replace function public.rutina_coach_invitar(p_local text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare r rutina.asignaciones; c text;
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  if not rutina.puede_entrenar() then raise exception 'Para invitar clientes necesitas el rol de entrenador'; end if;
  if coalesce(trim(p_local), '') = '' then raise exception 'Falta el cliente'; end if;
  select * into r from rutina.asignaciones a where a.entrenador = auth.uid() and a.cliente_local = p_local and a.estado <> 'terminado';
  if r.id is null then
    loop
      c := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
      exit when not exists (select 1 from rutina.asignaciones a where a.codigo = c);
    end loop;
    insert into rutina.asignaciones (entrenador, cliente_local, codigo) values (auth.uid(), p_local, c) returning * into r;
  end if;
  return jsonb_build_object('codigo', r.codigo, 'estado', r.estado);
end;
$$;

-- Publicar el plan del cliente (lo recibe en su app). Devuelve la versión publicada
create or replace function public.rutina_coach_publicar(p_local text, p_plan jsonb)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare v bigint := (extract(epoch from now()) * 1000)::bigint; n int;
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  if jsonb_typeof(p_plan) is distinct from 'object' then raise exception 'El plan no es válido'; end if;
  if octet_length(p_plan::text) > 500000 then raise exception 'El plan es demasiado grande'; end if;
  update rutina.asignaciones a set plan = p_plan, plan_version = v
    where a.entrenador = auth.uid() and a.cliente_local = p_local and a.estado <> 'terminado';
  get diagnostics n = row_count;
  if n = 0 then raise exception 'Primero invita a este cliente a la app'; end if;
  return v;
end;
$$;

-- Los clientes del entrenador con su estado y lo que cada uno le comparte (el correo, solo de quien aceptó)
create or replace function public.rutina_coach_clientes()
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'local', a.cliente_local, 'codigo', a.codigo, 'estado', a.estado, 'correo', case when a.estado = 'activo' then u.email end,
    'aceptado', a.aceptado, 'plan_version', a.plan_version, 'resumen', a.resumen, 'resumen_actualizado', a.resumen_actualizado) order by a.creado), '[]'::jsonb)
  from rutina.asignaciones a left join auth.users u on u.id = a.cliente
  where a.entrenador = auth.uid() and a.estado <> 'terminado';
$$;

-- El entrenador termina la relación (o cancela una invitación que nadie usó)
create or replace function public.rutina_coach_terminar(p_local text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  update rutina.asignaciones a set estado = 'terminado', terminado = now()
    where a.entrenador = auth.uid() and a.cliente_local = p_local and a.estado <> 'terminado';
end;
$$;

-- El cliente acepta un código: desde ahora recibe el plan y comparte su resumen. Quien era "estudiante" pasa a "cliente"
create or replace function public.rutina_cliente_aceptar(p_codigo text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare r rutina.asignaciones; correo text;
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  select * into r from rutina.asignaciones a where a.codigo = upper(trim(p_codigo));
  if r.id is null or r.estado = 'terminado' then raise exception 'Ese código no existe o ya no sirve. Pídele uno nuevo a tu entrenador.'; end if;
  if r.entrenador = auth.uid() then raise exception 'Ese código es tuyo: mándaselo a tu cliente'; end if;
  if r.estado = 'activo' and r.cliente is distinct from auth.uid() then raise exception 'Ese código ya lo usó otra persona'; end if;
  update rutina.asignaciones set cliente = auth.uid(), estado = 'activo', aceptado = coalesce(aceptado, now()) where id = r.id;
  insert into rutina.perfiles (usuario, rol) values (auth.uid(), 'cliente') on conflict (usuario) do update set rol = 'cliente' where rutina.perfiles.rol = 'estudiante';
  select u.email into correo from auth.users u where u.id = r.entrenador;
  return jsonb_build_object('id', r.id, 'entrenador', correo);
end;
$$;

-- Lo que el cliente recibe de sus entrenadores: el plan publicado
create or replace function public.rutina_cliente_planes()
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'entrenador', u.email, 'aceptado', a.aceptado, 'plan', a.plan, 'plan_version', a.plan_version) order by a.aceptado), '[]'::jsonb)
  from rutina.asignaciones a join auth.users u on u.id = a.entrenador
  where a.cliente = auth.uid() and a.estado = 'activo';
$$;

-- El cliente manda su resumen (a todos sus entrenadores activos)
create or replace function public.rutina_cliente_compartir(p_resumen jsonb)
returns int
language plpgsql security definer set search_path = ''
as $$
declare n int;
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  if jsonb_typeof(p_resumen) is distinct from 'object' or octet_length(p_resumen::text) > 200000 then raise exception 'El resumen no es válido'; end if;
  update rutina.asignaciones a set resumen = p_resumen, resumen_actualizado = now() where a.cliente = auth.uid() and a.estado = 'activo';
  get diagnostics n = row_count;
  return n;
end;
$$;

-- El cliente deja de compartir con un entrenador (y deja de recibir su plan)
create or replace function public.rutina_cliente_salir(p_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  update rutina.asignaciones a set estado = 'terminado', terminado = now(), resumen = null where a.id = p_id and a.cliente = auth.uid();
end;
$$;

-- Para el administrador: cada entrenador con sus clientes (quién es cliente de quién y si está activo). Sin planes ni avance
create or replace function public.rutina_admin_entrenadores()
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform rutina.solo_admin();
  return coalesce((
    select jsonb_agg(jsonb_build_object('entrenador', u.email, 'rol', p.rol, 'clientes', coalesce((
      select jsonb_agg(jsonb_build_object('correo', c.email, 'estado', a.estado, 'creado', a.creado, 'aceptado', a.aceptado) order by a.creado)
      from rutina.asignaciones a left join auth.users c on c.id = a.cliente
      where a.entrenador = p.usuario and a.estado <> 'terminado'), '[]'::jsonb)) order by u.email)
    from rutina.perfiles p join auth.users u on u.id = p.usuario
    where p.rol in ('admin', 'entrenador') or exists (select 1 from rutina.asignaciones a where a.entrenador = p.usuario and a.estado <> 'terminado')), '[]'::jsonb);
end;
$$;
revoke execute on function public.rutina_admin_entrenadores() from public, anon;
grant execute on function public.rutina_admin_entrenadores() to authenticated;

revoke execute on function rutina.puede_entrenar() from public, anon, authenticated;
revoke execute on function public.rutina_coach_invitar(text) from public, anon;
revoke execute on function public.rutina_coach_publicar(text, jsonb) from public, anon;
revoke execute on function public.rutina_coach_clientes() from public, anon;
revoke execute on function public.rutina_coach_terminar(text) from public, anon;
revoke execute on function public.rutina_cliente_aceptar(text) from public, anon;
revoke execute on function public.rutina_cliente_planes() from public, anon;
revoke execute on function public.rutina_cliente_compartir(jsonb) from public, anon;
revoke execute on function public.rutina_cliente_salir(uuid) from public, anon;
grant execute on function public.rutina_coach_invitar(text) to authenticated;
grant execute on function public.rutina_coach_publicar(text, jsonb) to authenticated;
grant execute on function public.rutina_coach_clientes() to authenticated;
grant execute on function public.rutina_coach_terminar(text) to authenticated;
grant execute on function public.rutina_cliente_aceptar(text) to authenticated;
grant execute on function public.rutina_cliente_planes() to authenticated;
grant execute on function public.rutina_cliente_compartir(jsonb) to authenticated;
grant execute on function public.rutina_cliente_salir(uuid) to authenticated;

-- Que la API vea las funciones nuevas sin esperar
notify pgrst, 'reload schema';

-- Primer administrador: cambia el correo por el tuyo y corre esta línea una vez (en el SQL Editor de Supabase).
-- insert into rutina.perfiles (usuario, rol) select id, 'admin' from auth.users where email = 'tu-correo@ejemplo.com' on conflict (usuario) do update set rol = 'admin';
