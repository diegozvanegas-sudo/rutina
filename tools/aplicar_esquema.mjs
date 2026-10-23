// Crea el esquema "rutina" (supabase/esquema.sql) en la base de Supabase.
// Usa DATABASE_URL de .env; si esta carpeta no tiene .env, toma el de microrrutas (mismo proyecto).
import fs from 'node:fs';
import dotenv from 'dotenv';
import pg from 'pg';

const propio = new URL('../.env', import.meta.url);
dotenv.config({ path: fs.existsSync(propio) ? propio : new URL('../../microrutas/.env', import.meta.url) });
const url = process.env.DATABASE_URL;
if (!url) throw new Error('Falta DATABASE_URL (en .env de esta carpeta o en el de microrutas)');

const db = new pg.Client({ connectionString: url.replace(/[?&]sslmode=[^&]*/, ''), ssl: { rejectUnauthorized: false } });
await db.connect();
try {
  await db.query(fs.readFileSync(new URL('../supabase/esquema.sql', import.meta.url), 'utf8'));
  const { rows } = await db.query("select count(*)::int n from rutina.estado");
  console.log('Esquema rutina listo (' + rows[0].n + ' usuario(s) con datos guardados).');
} finally {
  await db.end();
}
