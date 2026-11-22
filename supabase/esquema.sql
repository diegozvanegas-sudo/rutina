-- Rutina diaria: esquema propio dentro del proyecto de Supabase de microrrutas.
-- El esquema "rutina" no se expone a la API: la app entra solo por las funciones rutina_* de public,
-- y cada usuario ve únicamente su fila (auth.uid()). Se puede correr varias veces.

create schema if not exists rutina;
revoke all on schema rutina from public, anon, authenticated;

-- Acceso a la app: las cuentas son las del proyecto de microrrutas y a cuál app entra cada una lo decide su administrador
-- en 👥 Usuarios (public.accesos y public.tiene_app, migración 0025 de microrrutas: aplicarla antes de correr este archivo).
-- Sin acceso, cada función de aquí responde «Sin acceso a Rutina…» y la app cierra la sesión (nube.js)
create or replace function rutina.exigir_acceso()
returns void
language plpgsql stable security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Inicia sesión'; end if;
  if not public.tiene_app('rutina') then
    raise exception 'Sin acceso a Rutina: esta cuenta no tiene acceso a la app. Pídele al administrador que te la active.';
  end if;
end;
$$;
revoke execute on function rutina.exigir_acceso() from public, anon, authenticated;

-- Todo el estado de la app de un usuario (lo mismo que se guarda en el celular)
create table if not exists rutina.estado (
  usuario     uuid primary key references auth.users(id) on delete cascade,
  datos       jsonb not null,
  version     bigint not null,               -- milisegundos del último cambio hecho en el celular
  actualizado timestamptz not null default now()
);
alter table rutina.estado enable row level security;
-- Desde el paso 2 de guardar por partes (abajo) los datos viven en rutina.partes y aquí quedan en null
alter table rutina.estado alter column datos drop not null;
-- public.rutina_leer() está más abajo, en «Guardar por partes · paso 2»

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
-- Desde el paso 2 una copia nueva es solo una marca (paso, abajo) y datos queda en null; las viejas siguen completas
alter table rutina.historial alter column datos drop not null;

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

-- rutina.respaldar, public.rutina_guardar, public.rutina_historial y public.rutina_restaurar están más abajo, en
-- «Guardar por partes · paso 2»

revoke all on function rutina.cuanto(jsonb) from public;
revoke all on function rutina.conteo(jsonb) from public;
revoke all on function rutina.parte_perdida(jsonb, jsonb) from public;

-- ---------- Sincronizar sin mover todo (17 nov 2026) ----------
-- Antes, con la app abierta se bajaba el estado entero cada 20 s y cada cambio subía el estado entero (~140 kB).
-- Ahora la app pregunta primero la versión (unos bytes) y baja todo solo si cambió; y sube solo las partes que cambiaron.

-- Versión de lo que hay en la nube (null si el usuario todavía no ha subido nada)
create or replace function public.rutina_version()
returns bigint
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform rutina.exigir_acceso();
  return (select e.version from rutina.estado e where e.usuario = auth.uid());
end;
$$;

-- public.rutina_guardar_partes está más abajo, en «Guardar por partes · paso 2»

revoke execute on function public.rutina_version() from public, anon;
grant execute on function public.rutina_version() to authenticated;

-- ---------- Guardar por partes (paso 1 de 3, 2026-11-18) ----------
-- Hasta aquí todo el estado de un usuario vive en una sola fila (rutina.estado.datos, ~140 kB): cuando otro equipo cambia
-- algo, este baja la fila entera. Para crecer a muchos usuarios el estado pasa a guardarse por partes: cada día, cada
-- semana del gym y cada parte de arriba (config, rutina, finanzas…) en su propia fila de rutina.partes.
-- Paso 1 (este): rutina.estado sigue siendo lo que manda y nada de lo anterior cambia (protección, historial, restaurar).
--   Un disparador copia a rutina.partes solo lo que cambió en cada guardado, con la versión de ese guardado, y lo que se
--   borra queda con valor null (para que los otros equipos sepan que se borró). La app baja solo lo que cambió desde su
--   última versión (rutina_cambios). rutina.partes_revisar() dice si las partes arman exactamente lo mismo que la fila.
-- Paso 2 (hecho, más abajo): guardar escribe solo en rutina.partes, rutina.estado.datos queda en null y el historial
--   guarda solo las partes cambiadas (no copias completas).
create table if not exists rutina.partes (
  usuario uuid not null references auth.users(id) on delete cascade,
  grupo   text not null,               -- la llave de arriba: dias, semanas, config, rutina, finanzas…
  clave   text not null default '',    -- en dias y semanas, el día o la semana; '' para la parte entera
  valor   jsonb,                       -- null: se borró
  version bigint not null,             -- la versión del guardado que la cambió por última vez
  primary key (usuario, grupo, clave)
);
create index if not exists partes_por_version on rutina.partes (usuario, version);
alter table rutina.partes enable row level security;
-- Desde qué versión las partes de un usuario están completas (antes de eso no hay registro de lo borrado)
alter table rutina.estado add column if not exists partes_desde bigint;

-- Los días, las semanas del gym y las notas (📝 Notas, desde 2026-11-21) van uno por uno; lo demás, cada parte de arriba
-- entera (como cambiosParaNube en combinar.js). Si alguien ya tenía notas guardadas enteras, se leen igual (armar) y en su
-- siguiente guardado quedan por nota
create or replace function rutina.en_partes(d jsonb)
returns table (grupo text, clave text, valor jsonb)
language sql immutable set search_path = ''
as $$
  -- dias, semanas y notas dejan en clave '' un {} que dice que existen (aunque estén vacíos); lo de adentro va aparte
  select t.key, '', case when t.key in ('dias', 'semanas', 'notas') and jsonb_typeof(t.value) = 'object' then '{}'::jsonb else t.value end
    from jsonb_each(case when jsonb_typeof(d) = 'object' then d else '{}'::jsonb end) t
  union all
  select t.key, s.key, s.value from jsonb_each(case when jsonb_typeof(d) = 'object' then d else '{}'::jsonb end) t
    cross join lateral jsonb_each(t.value) s
    where t.key in ('dias', 'semanas', 'notas') and jsonb_typeof(t.value) = 'object';
$$;

-- Lo que cambió entre dos estados se escribe en rutina.partes (null en lo que ya no está)
create or replace function rutina.anotar_partes(p_usuario uuid, antes jsonb, ahora jsonb, p_version bigint)
returns void
language sql set search_path = ''
as $$
  insert into rutina.partes (usuario, grupo, clave, valor, version)
  select p_usuario, coalesce(n.grupo, v.grupo), coalesce(n.clave, v.clave), n.valor, p_version
  from rutina.en_partes(ahora) n full join rutina.en_partes(antes) v on v.grupo = n.grupo and v.clave = n.clave
  where n.valor is distinct from v.valor
  on conflict (usuario, grupo, clave) do update set valor = excluded.valor, version = excluded.version;
$$;

-- En el paso 1 un disparador (a_partes, rutina.estado_a_partes) copiaba cada escritura de rutina.estado a las partes.
-- Desde el paso 2 se guarda directo en las partes y datos queda en null: el disparador se quita (con datos en null
-- marcaría todo como borrado). Para volver a ponerlo, ver «Volver atrás» al final del paso 2
-- Un usuario nuevo empieza con partes completas desde su primera versión
create or replace function rutina.estado_partes_desde()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  if new.partes_desde is null then new.partes_desde := new.version; end if;
  return new;
end;
$$;
drop trigger if exists partes_desde on rutina.estado;
create trigger partes_desde before insert on rutina.estado for each row execute function rutina.estado_partes_desde();
drop trigger if exists a_partes on rutina.estado;
drop function if exists rutina.estado_a_partes();
revoke all on function rutina.estado_partes_desde() from public, anon, authenticated;
revoke all on function rutina.anotar_partes(uuid, jsonb, jsonb, bigint) from public, anon, authenticated;

-- Los usuarios que ya tenían datos: sus partes de hoy, completas desde su versión de ahora (se puede correr varias veces).
-- Desde el paso 2 todos tienen partes_desde (lo pone el disparador partes_desde al crear la fila), así que no hace nada
do $$
declare r record;
begin
  for r in select e.usuario, e.datos, e.version from rutina.estado e where e.partes_desde is null and e.datos is not null loop
    delete from rutina.partes p where p.usuario = r.usuario;
    perform rutina.anotar_partes(r.usuario, null, r.datos, r.version);
    update rutina.estado set partes_desde = r.version where usuario = r.usuario;
  end loop;
end;
$$;

-- El estado completo armado desde las partes (desde el paso 2, lo que manda: rutina.estado.datos queda en null)
create or replace function rutina.armar(p_usuario uuid)
returns jsonb
language sql stable set search_path = ''
as $$
  select coalesce(jsonb_object_agg(g.grupo, g.valor), '{}'::jsonb) from (
    select a.grupo, case when a.grupo in ('dias', 'semanas', 'notas') and a.valor = '{}'::jsonb
      then coalesce((select jsonb_object_agg(p.clave, p.valor) from rutina.partes p
                     where p.usuario = p_usuario and p.grupo = a.grupo and p.clave <> '' and p.valor is not null), '{}'::jsonb)
      else a.valor end as valor
    from rutina.partes a where a.usuario = p_usuario and a.clave = '' and a.valor is not null
  ) g;
$$;
revoke all on function rutina.armar(uuid) from public, anon, authenticated;

-- Lo que cambió en la nube desde la versión p_desde (la última que este equipo sincronizó), con la misma forma que sube la
-- app: { version, partes: [{ ruta, valor }], quitar: [ruta] }. null si con eso no alcanza (el equipo quedó de antes de
-- que existieran las partes): entonces la app baja todo con rutina_leer. Las partes enteras van primero: si dias o
-- semanas aparecen como {} es que se crearon después de p_desde, y todos sus días y semanas vienen detrás
create or replace function public.rutina_cambios(p_desde bigint)
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare v bigint; desde bigint;
begin
  perform rutina.exigir_acceso();
  select e.version, e.partes_desde into v, desde from rutina.estado e where e.usuario = auth.uid();
  if v is null or desde is null or p_desde is null or p_desde < desde then return null; end if;
  return jsonb_build_object(
    'version', v,
    'partes', coalesce((select jsonb_agg(jsonb_build_object('ruta', case when p.clave = '' then jsonb_build_array(p.grupo) else jsonb_build_array(p.grupo, p.clave) end, 'valor', p.valor)
                                  order by p.clave <> '', p.grupo, p.clave)
                        from rutina.partes p where p.usuario = auth.uid() and p.version >= p_desde and p.valor is not null), '[]'::jsonb),
    'quitar', coalesce((select jsonb_agg(case when p.clave = '' then jsonb_build_array(p.grupo) else jsonb_build_array(p.grupo, p.clave) end)
                        from rutina.partes p where p.usuario = auth.uid() and p.version >= p_desde and p.valor is null), '[]'::jsonb));
end;
$$;
revoke execute on function public.rutina_cambios(bigint) from public, anon;
grant execute on function public.rutina_cambios(bigint) to authenticated;

-- rutina.partes_revisar() está más abajo, en «Guardar por partes · paso 2»

-- ---------- Guardar por partes · paso 2 (2026-11-21) ----------
-- rutina.partes es lo que manda. rutina.estado queda con la versión, partes_desde y el paso (abajo); datos queda en null.
-- Guardar ya no reescribe la fila entera (~150 kB): compara lo que llega con lo armado y escribe solo las partes que
-- cambiaron. El historial deja de copiar todo: cuando una parte se reemplaza, su valor anterior pasa a
-- rutina.partes_historial con desde y hasta, y una copia es solo una marca (rutina.historial.paso).
-- Las funciones de la app tienen el mismo nombre y la misma forma que antes (sirve hasta la versión vieja de la app).

-- Contador propio de la base: cada escritura de un usuario es un paso nuevo. No se usa la versión del celular porque se
-- puede repetir (dos guardados con la misma versión) y porque restaurar la cambia
create sequence if not exists rutina.pasos;
revoke all on sequence rutina.pasos from public, anon, authenticated;
alter table rutina.partes add column if not exists paso bigint;      -- el paso en que la parte quedó con este valor
alter table rutina.estado add column if not exists paso bigint;      -- el último paso del usuario: lo que hay ahora
alter table rutina.historial add column if not exists paso bigint;   -- una marca: el estado de ese paso (datos en null)
alter table rutina.historial add column if not exists cuenta jsonb;  -- rutina.conteo() de esa marca, para la lista
create index if not exists historial_paso on rutina.historial (usuario, paso) where paso is not null;

-- Lo que tenía una parte antes de reemplazarse, de un paso a otro: estuvo vigente en los pasos desde ≤ p < hasta
create table if not exists rutina.partes_historial (
  usuario uuid not null references auth.users(id) on delete cascade,
  grupo   text not null,
  clave   text not null,
  valor   jsonb not null,
  desde   bigint not null,
  hasta   bigint not null
);
create index if not exists partes_historial_paso on rutina.partes_historial (usuario, hasta, desde);
alter table rutina.partes_historial enable row level security;

-- El estado completo como estaba en el paso p_paso (lo mismo que rutina.armar, pero mirando atrás)
create or replace function rutina.armar_en(p_usuario uuid, p_paso bigint)
returns jsonb
language sql stable set search_path = ''
as $$
  with f as (
    select p.grupo, p.clave, p.valor from rutina.partes p
      where p.usuario = p_usuario and p.paso <= p_paso and p.valor is not null
    union all
    select h.grupo, h.clave, h.valor from rutina.partes_historial h
      where h.usuario = p_usuario and h.hasta > p_paso and h.desde <= p_paso
  )
  select coalesce(jsonb_object_agg(a.grupo, case when a.grupo in ('dias', 'semanas', 'notas') and a.valor = '{}'::jsonb
      then coalesce((select jsonb_object_agg(x.clave, x.valor) from f x where x.grupo = a.grupo and x.clave <> ''), '{}'::jsonb)
      else a.valor end), '{}'::jsonb)
  from f a where a.clave = '';
$$;

-- Escribe un estado nuevo: solo las partes que cambiaron contra lo que hay (lo borrado queda en null, para rutina_cambios);
-- lo que tenían antes pasa a rutina.partes_historial. La fila de rutina.estado queda con la versión y el paso nuevos
create or replace function rutina.escribir(p_usuario uuid, ahora jsonb, p_version bigint)
returns void
language plpgsql security definer set search_path = ''
as $$
declare p bigint := nextval('rutina.pasos');
begin
  with v as (select x.grupo, x.clave, x.valor, x.paso from rutina.partes x where x.usuario = p_usuario and x.valor is not null),
  n as (select * from rutina.en_partes(ahora)),
  c as (select coalesce(n.grupo, v.grupo) grupo, coalesce(n.clave, v.clave) clave, n.valor nuevo, v.valor viejo, coalesce(v.paso, 0) desde
        from n full join v on v.grupo = n.grupo and v.clave = n.clave
        where n.valor is distinct from v.valor),
  h as (insert into rutina.partes_historial (usuario, grupo, clave, valor, desde, hasta)
        select p_usuario, c.grupo, c.clave, c.viejo, c.desde, p from c where c.viejo is not null)
  insert into rutina.partes (usuario, grupo, clave, valor, version, paso)
  select p_usuario, c.grupo, c.clave, c.nuevo, p_version, p from c
  on conflict (usuario, grupo, clave) do update set valor = excluded.valor, version = excluded.version, paso = excluded.paso;
  insert into rutina.estado (usuario, datos, version, paso) values (p_usuario, null, p_version, p)
  on conflict (usuario) do update set datos = null, version = excluded.version, paso = excluded.paso, actualizado = now();
end;
$$;

-- Una copia: una marca con el paso de ahora. Deja las últimas 60 y una por día de los últimos 90 días, y borra los
-- valores viejos de partes que ya ninguna copia usa
create or replace function rutina.respaldar(p_usuario uuid, p_motivo text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  insert into rutina.historial (usuario, datos, version, motivo, paso, cuenta)
    select e.usuario, null, e.version, p_motivo, e.paso, rutina.conteo(rutina.armar(e.usuario))
    from rutina.estado e where e.usuario = p_usuario and e.paso is not null;
  delete from rutina.historial h where h.usuario = p_usuario
    and h.id not in (select x.id from rutina.historial x where x.usuario = p_usuario order by x.guardado desc limit 60)
    and h.id not in (select distinct on (x.guardado::date) x.id from rutina.historial x
                     where x.usuario = p_usuario and x.guardado > now() - interval '90 days' order by x.guardado::date, x.guardado desc);
  delete from rutina.partes_historial ph where ph.usuario = p_usuario
    and not exists (select 1 from rutina.historial h where h.usuario = p_usuario and h.paso >= ph.desde and h.paso < ph.hasta);
end;
$$;

-- Guarda solo si lo que llega es igual o más nuevo que lo de la nube; devuelve la versión que quedó.
-- Si devuelve una versión mayor a la enviada, otro equipo guardó algo más reciente: la app la descarga.
-- Protección: no deja subir algo que deje cualquier parte (días, gym, finanzas, estudio…) con menos de la mitad, ni
-- datos que no son de la app. Para volver atrás está rutina_restaurar. p_viejo: lo armado, si ya se tiene
create or replace function rutina.guardar_en(p_usuario uuid, p_datos jsonb, p_version bigint, p_viejo jsonb default null)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare v bigint; viejo jsonb := p_viejo; antes int; ahora int; perdida text; ultima timestamptz;
begin
  if jsonb_typeof(p_datos) is distinct from 'object' or (p_datos->>'version') is distinct from '1'
     or jsonb_typeof(p_datos->'rutina') is distinct from 'array' then
    raise exception 'Protección: lo que llegó no son datos completos de la app. No se subió; la nube sigue igual.';
  end if;
  -- La fila del usuario queda bloqueada hasta terminar: dos equipos guardando a la vez van uno detrás del otro
  select e.version into v from rutina.estado e where e.usuario = p_usuario for update;
  if found then
    if v > p_version then return v; end if;
    viejo := coalesce(viejo, rutina.armar(p_usuario));
    antes := rutina.cuanto(viejo); ahora := rutina.cuanto(p_datos);
    perdida := rutina.parte_perdida(viejo, p_datos);
    if perdida is not null then
      raise exception 'Protección: esta subida borraría más de la mitad de una parte (%). No se subió; la nube sigue igual.', perdida;
    end if;
    select max(h.guardado) into ultima from rutina.historial h where h.usuario = p_usuario;
    if ahora < antes then perform rutina.respaldar(p_usuario, 'quita datos');
    elsif ultima is null or ultima < now() - interval '10 minutes' then perform rutina.respaldar(p_usuario, 'automatica');
    end if;
  end if;
  perform rutina.escribir(p_usuario, p_datos, p_version);
  return p_version;
end;
$$;

create or replace function public.rutina_leer()
returns table (datos jsonb, version bigint)
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform rutina.exigir_acceso();
  return query select rutina.armar(e.usuario), e.version from rutina.estado e where e.usuario = auth.uid();
end;
$$;

create or replace function public.rutina_guardar(p_datos jsonb, p_version bigint)
returns bigint
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Inicia sesión para guardar en la nube'; end if;
  perform rutina.exigir_acceso();
  return rutina.guardar_en(auth.uid(), p_datos, p_version);
end;
$$;

-- Sube solo lo que cambió desde la versión p_base, la última que este equipo sincronizó.
-- p_partes: [{ "ruta": ["dias", "2026-11-17"], "valor": {...} }, { "ruta": ["config"], "valor": {...} }]: cada una
-- reemplaza esa parte (una llave de arriba, o una de segundo nivel como un día o una semana del gym).
-- p_quitar: rutas que se borran, con la misma forma.
-- Si la nube ya no está en p_base (otro equipo guardó en el medio) no cambia nada y devuelve la versión de la nube: la app
-- baja lo que cambió y combina como siempre. Lo armado pasa por las mismas protecciones y el mismo historial.
create or replace function public.rutina_guardar_partes(p_partes jsonb, p_quitar jsonb, p_base bigint, p_version bigint)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare d jsonb; viejo jsonb; v bigint; parte jsonb; ruta text[];
begin
  if auth.uid() is null then raise exception 'Inicia sesión para guardar en la nube'; end if;
  perform rutina.exigir_acceso();
  if jsonb_typeof(p_partes) is distinct from 'array' or jsonb_typeof(p_quitar) is distinct from 'array' then
    raise exception 'Protección: lo que llegó no son cambios de la app. No se subió; la nube sigue igual.';
  end if;
  select e.version into v from rutina.estado e where e.usuario = auth.uid() for update;
  if not found or v is distinct from p_base then return coalesce(v, 0); end if;
  viejo := rutina.armar(auth.uid()); d := viejo;
  for parte in select x from jsonb_array_elements(p_quitar) x loop
    ruta := array(select jsonb_array_elements_text(parte));
    if cardinality(ruta) not between 1 and 2 then raise exception 'Protección: ruta no válida. No se subió; la nube sigue igual.'; end if;
    d := d #- ruta;
  end loop;
  for parte in select x from jsonb_array_elements(p_partes) x loop
    ruta := array(select jsonb_array_elements_text(parte->'ruta'));
    if cardinality(ruta) not between 1 and 2 or not (parte ? 'valor') then
      raise exception 'Protección: ruta no válida. No se subió; la nube sigue igual.';
    end if;
    if cardinality(ruta) = 2 and jsonb_typeof(d->ruta[1]) is distinct from 'object' then d := jsonb_set(d, array[ruta[1]], '{}'::jsonb); end if;
    d := jsonb_set(d, ruta, parte->'valor', true);
  end loop;
  return rutina.guardar_en(auth.uid(), d, p_version, viejo);
end;
$$;

-- Copias guardadas del usuario (las más nuevas primero), con cuánto tenía cada una (las marcas y las copias completas viejas)
create or replace function public.rutina_historial()
returns table (id bigint, guardado timestamptz, motivo text, dias int, registros int)
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform rutina.exigir_acceso();
  return query
  select h.id, h.guardado, h.motivo, (c.n->>'dias')::int, (c.n->>'gym')::int
  from rutina.historial h cross join lateral (select coalesce(h.cuenta, rutina.conteo(h.datos)) n) c
  where h.usuario = auth.uid() order by h.guardado desc;
end;
$$;

-- Vuelve a una copia (una marca, o una copia completa de antes del paso 2): lo de ahora queda como copia y la copia queda
-- como lo más nuevo (los equipos la bajan solos). Solo se escriben las partes que difieren
create or replace function public.rutina_restaurar(p_id bigint)
returns bigint
language plpgsql security definer set search_path = ''
as $$
declare d jsonb; m bigint; v bigint;
begin
  perform rutina.exigir_acceso();
  select e.version into v from rutina.estado e where e.usuario = auth.uid() for update;
  if not found then raise exception 'Esa copia no existe'; end if;
  select h.datos, h.paso into d, m from rutina.historial h where h.id = p_id and h.usuario = auth.uid();
  if d is null and m is null then raise exception 'Esa copia no existe'; end if;
  -- Se arma antes de respaldar: la copia nueva puede sacar de las 60 a la que se está restaurando
  if d is null then d := rutina.armar_en(auth.uid(), m); end if;
  perform rutina.respaldar(auth.uid(), 'antes de restaurar');
  v := greatest((extract(epoch from now()) * 1000)::bigint, v + 1);
  perform rutina.escribir(auth.uid(), jsonb_set(d, '{cambio}', to_jsonb(v)), v);
  return v;
end;
$$;

-- Revisión desde la base de datos (no desde la app): por usuario, si lo armado desde las partes es lo mismo que la fila
-- (antes del paso 2) o que lo armado por el paso de ahora con el historial de partes (desde el paso 2). Debe ser siempre sí
create or replace function rutina.partes_revisar()
returns table (usuario uuid, igual boolean, kb_fila int, filas_partes int)
language sql stable set search_path = ''
as $$
  select e.usuario,
    case when e.datos is not null then rutina.armar(e.usuario) = e.datos else rutina.armar(e.usuario) = rutina.armar_en(e.usuario, e.paso) end,
    (octet_length(rutina.armar(e.usuario)::text) / 1024)::int,
    (select count(*)::int from rutina.partes p where p.usuario = e.usuario)
  from rutina.estado e;
$$;

revoke all on function rutina.armar_en(uuid, bigint) from public, anon, authenticated;
revoke all on function rutina.escribir(uuid, jsonb, bigint) from public, anon, authenticated;
revoke all on function rutina.respaldar(uuid, text) from public, anon, authenticated;
revoke all on function rutina.guardar_en(uuid, jsonb, bigint, jsonb) from public, anon, authenticated;
revoke all on function rutina.partes_revisar() from public, anon, authenticated;
revoke execute on function public.rutina_leer() from public, anon;
revoke execute on function public.rutina_guardar(jsonb, bigint) from public, anon;
revoke execute on function public.rutina_guardar_partes(jsonb, jsonb, bigint, bigint) from public, anon;
revoke execute on function public.rutina_historial() from public, anon;
revoke execute on function public.rutina_restaurar(bigint) from public, anon;
grant execute on function public.rutina_leer() to authenticated;
grant execute on function public.rutina_guardar(jsonb, bigint) to authenticated;
grant execute on function public.rutina_guardar_partes(jsonb, jsonb, bigint, bigint) to authenticated;
grant execute on function public.rutina_historial() to authenticated;
grant execute on function public.rutina_restaurar(bigint) to authenticated;

-- El cambio (se puede correr varias veces): a quien todavía tiene datos en la fila se le revisa que sus partes armen
-- exactamente lo mismo (si no, se cancela todo y no cambia nada), sus partes quedan con un paso y datos pasa a null
do $$
declare r record; p bigint;
begin
  for r in select e.usuario, e.datos from rutina.estado e where e.datos is not null for update loop
    if rutina.armar(r.usuario) is distinct from r.datos then
      raise exception 'Paso 2: las partes de % no arman lo mismo que su fila. No se cambió nada.', r.usuario;
    end if;
    p := nextval('rutina.pasos');
    update rutina.partes set paso = p where usuario = r.usuario;
    update rutina.estado set datos = null, paso = p where usuario = r.usuario;
  end loop;
end;
$$;

-- Volver atrás (al paso 1), en una sola transacción, desde la base de datos:
--   begin;
--   -- 1. la fila vuelve a tener todo, y las marcas del historial pasan a copias completas
--   update rutina.estado e set datos = rutina.armar(e.usuario);
--   update rutina.historial h set datos = rutina.armar_en(h.usuario, h.paso) where h.datos is null and h.paso is not null;
--   delete from rutina.historial where datos is null;
--   alter table rutina.estado alter column datos set not null;
--   alter table rutina.historial alter column datos set not null;
--   -- 2. las funciones de antes y el disparador a_partes: el esquema.sql anterior a este cambio, de git
--   --    (git show b0a1cff:supabase/esquema.sql > paso1.sql) y correrlo aquí mismo, antes del commit
--   commit;
-- rutina.partes, partes_historial y las columnas paso y cuenta pueden quedarse: el paso 1 no las mira.

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
  select public.tiene_app('rutina') and exists (select 1 from rutina.perfiles p where p.usuario = auth.uid() and p.rol = 'admin');
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
  perform rutina.exigir_acceso();
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
-- Cada quien ve lo suyo: la sección 👥 Clientes (los clientes de un entrenador) es solo del admin y de los entrenadores.
-- Es una regla de partida: si el admin la cambia en Administrar, aquí no se vuelve a poner (on conflict do nothing)
insert into rutina.permisos (tipo, elemento, rol, visible)
select 'seccion', 'clientes', r, false from unnest(array['cliente', 'estudiante', 'familia']) r
where exists (select 1 from rutina.roles x where x.id = r)
on conflict (tipo, elemento, rol) where rol is not null do nothing;

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
  select public.tiene_app('rutina') and exists (select 1 from rutina.perfiles p where p.usuario = auth.uid() and p.rol in ('admin', 'entrenador'));
$$;

-- Invitar (o volver a ver el código de) un cliente. Devuelve { codigo, estado }
create or replace function public.rutina_coach_invitar(p_local text)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare r rutina.asignaciones; c text;
begin
  perform rutina.exigir_acceso();
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
  perform rutina.exigir_acceso();
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
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform rutina.exigir_acceso();
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'local', a.cliente_local, 'codigo', a.codigo, 'estado', a.estado, 'correo', case when a.estado = 'activo' then u.email end,
      'aceptado', a.aceptado, 'plan_version', a.plan_version, 'resumen', a.resumen, 'resumen_actualizado', a.resumen_actualizado) order by a.creado), '[]'::jsonb)
    from rutina.asignaciones a left join auth.users u on u.id = a.cliente
    where a.entrenador = auth.uid() and a.estado <> 'terminado');
end;
$$;

-- El entrenador termina la relación (o cancela una invitación que nadie usó)
create or replace function public.rutina_coach_terminar(p_local text)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  perform rutina.exigir_acceso();
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
  perform rutina.exigir_acceso();
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
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform rutina.exigir_acceso();
  return (
    select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'entrenador', u.email, 'aceptado', a.aceptado, 'plan', a.plan, 'plan_version', a.plan_version) order by a.aceptado), '[]'::jsonb)
    from rutina.asignaciones a join auth.users u on u.id = a.entrenador
    where a.cliente = auth.uid() and a.estado = 'activo');
end;
$$;

-- El cliente manda su resumen (a todos sus entrenadores activos)
create or replace function public.rutina_cliente_compartir(p_resumen jsonb)
returns int
language plpgsql security definer set search_path = ''
as $$
declare n int;
begin
  perform rutina.exigir_acceso();
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
  perform rutina.exigir_acceso();
  update rutina.asignaciones a set estado = 'terminado', terminado = now(), resumen = null where a.id = p_id and a.cliente = auth.uid();
end;
$$;

-- Para el superadmin (el único que ve todo): cada entrenador con sus clientes, el plan que les publicó y el avance que
-- le comparten. Cada entrenador sigue viendo solo los suyos (rutina_coach_clientes) y cada cliente solo lo suyo
create or replace function public.rutina_admin_entrenadores()
returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform rutina.solo_admin();
  return coalesce((
    select jsonb_agg(jsonb_build_object('entrenador', u.email, 'rol', p.rol, 'clientes', coalesce((
      select jsonb_agg(jsonb_build_object('correo', c.email, 'estado', a.estado, 'creado', a.creado, 'aceptado', a.aceptado,
        'plan', a.plan, 'plan_version', a.plan_version, 'resumen', a.resumen, 'resumen_actualizado', a.resumen_actualizado) order by a.creado)
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
