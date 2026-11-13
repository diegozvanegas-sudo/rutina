// Prueba de la parte entrenador ↔ cliente del esquema (supabase/esquema.sql) contra la base real, sin dejar rastro:
// todo pasa dentro de una transacción con dos usuarios inventados y al final se deshace (ROLLBACK).
//   node tools/probar_entrenador.mjs
import fs from 'node:fs';
import dotenv from 'dotenv';
import pg from 'pg';

const propio = new URL('../.env', import.meta.url);
dotenv.config({ path: fs.existsSync(propio) ? propio : new URL('../../microrutas/.env', import.meta.url) });
const db = new pg.Client({ connectionString: process.env.DATABASE_URL.replace(/[?&]sslmode=[^&]*/, ''), ssl: { rejectUnauthorized: false } });
const ENT = '00000000-0000-4000-a000-00000000e001', CLI = '00000000-0000-4000-a000-00000000c001', OTRO = '00000000-0000-4000-a000-00000000f001';
let fallas = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✗ ') + t); if (!c) fallas++; };

await db.connect();
try {
  await db.query('begin');
  await db.query(fs.readFileSync(new URL('../supabase/esquema.sql', import.meta.url), 'utf8'));
  for (const [id, correo] of [[ENT, 'entrenador@prueba.local'], [CLI, 'cliente@prueba.local'], [OTRO, 'otro@prueba.local']]) {
    await db.query(`insert into auth.users (id, email, aud, role) values ($1, $2, 'authenticated', 'authenticated')`, [id, correo]);
  }
  await db.query(`insert into rutina.perfiles (usuario, rol) values ($1, 'entrenador'), ($2, 'estudiante'), ($3, 'estudiante')`, [ENT, CLI, OTRO]);
  // Como en la API: rol authenticated y el usuario en las claims del token
  const como = async (id) => { await db.query(`set local role authenticated`); await db.query(`select set_config('request.jwt.claims', $1, true), set_config('request.jwt.claim.sub', $2, true)`, [JSON.stringify({ sub: id, role: 'authenticated' }), id]); };
  const sql = async (id, q, args = []) => { await db.query('savepoint s'); try { await como(id); const r = await db.query(q, args); await db.query('release savepoint s'); return r.rows[0] ? Object.values(r.rows[0])[0] : null; } catch (err) { await db.query('rollback to savepoint s'); return { error: err.message }; } finally { await db.query('reset role'); } };

  // Las tablas no se ven desde la API
  ok((await sql(CLI, 'select count(*) from rutina.asignaciones')).error, 'un usuario no puede leer la tabla de asignaciones directo');
  // Invitar
  const inv = await sql(ENT, `select public.rutina_coach_invitar('cl1')`);
  ok(inv && /^[0-9A-F]{6}$/.test(inv.codigo) && inv.estado === 'invitado', 'el entrenador invita y recibe un código de 6 caracteres: ' + JSON.stringify(inv));
  ok((await sql(ENT, `select public.rutina_coach_invitar('cl1')`)).codigo === inv.codigo, 'invitar otra vez al mismo cliente devuelve el mismo código');
  ok(/rol de entrenador/.test((await sql(CLI, `select public.rutina_coach_invitar('x')`)).error || ''), 'quien no es entrenador no puede invitar');
  ok(/Primero invita/.test((await sql(ENT, `select public.rutina_coach_publicar('nadie', '{}'::jsonb)`)).error || ''), 'no se publica a un cliente sin invitar');
  // Publicar
  const v = await sql(ENT, `select public.rutina_coach_publicar('cl1', $1::jsonb)`, [JSON.stringify({ nombre: 'Ana', rutina: [{ id: 'd1', nombre: 'Torso', ejercicios: [] }] })]);
  ok(typeof v === 'string' || typeof v === 'number', 'el entrenador publica el plan (versión ' + v + ')');
  // Aceptar
  ok(/es tuyo/.test((await sql(ENT, `select public.rutina_cliente_aceptar($1)`, [inv.codigo])).error || ''), 'el entrenador no puede aceptar su propio código');
  ok(/no existe/.test((await sql(CLI, `select public.rutina_cliente_aceptar('ZZZZZZ')`)).error || ''), 'un código inventado no sirve');
  const acepto = await sql(CLI, `select public.rutina_cliente_aceptar($1)`, [inv.codigo.toLowerCase() + ' ']);
  ok(acepto && acepto.entrenador === 'entrenador@prueba.local', 'el cliente acepta el código (en minúsculas y con espacio) y ve el correo del entrenador');
  ok((await sql(CLI, `select rol from rutina.perfiles where usuario = $1`, [CLI])).error, '(el perfil no se lee desde la API)');
  const rol = (await db.query(`select rol from rutina.perfiles where usuario = $1`, [CLI])).rows[0].rol;
  ok(rol === 'cliente', 'quien era estudiante queda con el rol cliente');
  const reglas = (await sql(CLI, 'select public.rutina_mis_permisos()')).reglas;
  ok(reglas.some((x) => x.tipo === 'seccion' && x.id === 'clientes' && x.visible === false), 'el cliente no ve la sección Clientes (cada quien ve lo suyo)');
  ok(!(await sql(ENT, 'select public.rutina_mis_permisos()')).reglas.some((x) => x.id === 'clientes'), 'el entrenador sí la ve');
  ok(/otra persona/.test((await sql(OTRO, `select public.rutina_cliente_aceptar($1)`, [inv.codigo])).error || ''), 'otra persona no puede usar un código ya aceptado');
  // El cliente recibe el plan
  const planes = await sql(CLI, `select public.rutina_cliente_planes()`);
  ok(planes.length === 1 && planes[0].plan.nombre === 'Ana' && planes[0].entrenador === 'entrenador@prueba.local', 'el cliente recibe el plan publicado');
  ok((await sql(OTRO, `select public.rutina_cliente_planes()`)).length === 0, 'otro usuario no recibe nada');
  // El cliente comparte su resumen; el entrenador lo ve
  ok((await sql(CLI, `select public.rutina_cliente_compartir($1::jsonb)`, [JSON.stringify({ semanas: [{ n: 1, hechas: 20, plan: 25 }] })])) === 1, 'el cliente comparte su resumen');
  const mis = await sql(ENT, `select public.rutina_coach_clientes()`);
  ok(mis.length === 1 && mis[0].correo === 'cliente@prueba.local' && mis[0].resumen.semanas[0].hechas === 20, 'el entrenador ve el correo y el resumen de su cliente');
  ok((await sql(OTRO, `select public.rutina_coach_clientes()`)).length === 0, 'otro usuario no ve clientes ajenos');
  ok(/no es válido/.test((await sql(CLI, `select public.rutina_cliente_compartir('[1]'::jsonb)`)).error || ''), 'un resumen que no es un objeto se rechaza');
  // El administrador ve quién es cliente de quién, sin planes ni avance; los demás no
  await db.query(`update rutina.perfiles set rol = 'admin' where usuario = $1`, [OTRO]);
  const vista = await sql(OTRO, `select public.rutina_admin_entrenadores()`);
  const fila = (vista || []).find((x) => x.entrenador === 'entrenador@prueba.local');
  ok(fila && fila.clientes.length === 1 && fila.clientes[0].correo === 'cliente@prueba.local' && fila.clientes[0].estado === 'activo', 'el administrador ve que cliente@ es cliente activo de entrenador@');
  ok(fila && fila.clientes[0].resumen && fila.clientes[0].resumen.semanas[0].hechas === 20 && fila.clientes[0].plan.nombre === 'Ana', 'y, como superadmin, ve su plan y su avance');
  ok(/Solo el administrador/.test((await sql(ENT, `select public.rutina_admin_entrenadores()`)).error || ''), 'un entrenador no puede ver la lista de todos');
  await db.query(`update rutina.perfiles set rol = 'estudiante' where usuario = $1`, [OTRO]);
  // Nadie toca el estado completo de otro
  ok((await sql(ENT, `select count(*) from rutina.estado`)).error, 'el entrenador no puede leer los datos completos del cliente');
  // El cliente se sale: el entrenador deja de ver su resumen
  await sql(CLI, `select public.rutina_cliente_salir($1)`, [planes[0].id]);
  ok((await sql(ENT, `select public.rutina_coach_clientes()`)).length === 0, 'cuando el cliente se sale, el entrenador ya no lo ve');
  ok((await sql(CLI, `select public.rutina_cliente_planes()`)).length === 0, 'y el cliente deja de recibir el plan');
  const inv2 = await sql(ENT, `select public.rutina_coach_invitar('cl1')`);
  ok(inv2.codigo !== inv.codigo, 'se puede volver a invitar con un código nuevo');
  await sql(ENT, `select public.rutina_coach_terminar('cl1')`);
  ok(/no existe/.test((await sql(CLI, `select public.rutina_cliente_aceptar($1)`, [inv2.codigo])).error || ''), 'una invitación cancelada ya no sirve');
} finally {
  await db.query('rollback');
  const quedo = (await db.query(`select count(*)::int n from auth.users where id in ($1, $2, $3)`, [ENT, CLI, OTRO])).rows[0].n;
  console.log(quedo === 0 ? '✓ Todo deshecho: la base quedó igual' : '✗ ¡Quedaron usuarios de prueba!');
  await db.end();
}
console.log(fallas ? '✗ ' + fallas + ' falla(s)' : '✓ Todo bien');
process.exit(fallas ? 1 : 0);
