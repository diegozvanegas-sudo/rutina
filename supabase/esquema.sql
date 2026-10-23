-- Rutina diaria: esquema propio dentro del proyecto de Supabase de microrrutas.
-- El esquema "rutina" no se expone a la API: la app entra solo por las dos funciones de public,
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

-- Que la API vea las funciones nuevas sin esperar
notify pgrst, 'reload schema';
