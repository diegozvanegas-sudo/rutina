// Le dice a la nube desde qué nivel de la app se deja guardar (rutina.ajustes_app, supabase/esquema.sql): las versiones de
// nivel menor reciben «Versión vieja de la app» y se actualizan solas. Toma NIVEL_APP de src/version.js.
// Correr SOLO después de publicar y de que GitHub Pages ya sirva la versión nueva (si no, nadie podría guardar):
//   npm run db:nivel            → pone el nivel de src/version.js
//   npm run db:nivel -- 0       → lo quita (todas las versiones pueden guardar)
import fs from 'node:fs';
import dotenv from 'dotenv';
import pg from 'pg';
import { NIVEL_APP } from '../src/version.js';

const propio = new URL('../.env', import.meta.url);
dotenv.config({ path: fs.existsSync(propio) ? propio : new URL('../../microrutas/.env', import.meta.url) });
const url = process.env.DATABASE_URL;
if (!url) throw new Error('Falta DATABASE_URL (en .env de esta carpeta o en el de microrutas)');
const nivel = process.argv[2] != null ? Number(process.argv[2]) : NIVEL_APP;
if (!Number.isInteger(nivel) || nivel < 0) throw new Error('Nivel no válido: ' + process.argv[2]);

const db = new pg.Client({ connectionString: url.replace(/[?&]sslmode=[^&]*/, ''), ssl: { rejectUnauthorized: false } });
await db.connect();
try {
  const { rows } = await db.query('update rutina.ajustes_app set nivel_minimo = $1 where id returning nivel_minimo', [nivel]);
  if (!rows.length) throw new Error('No existe rutina.ajustes_app: aplica antes el esquema (npm run db:esquema)');
  console.log('Nivel mínimo de la app en la nube: ' + rows[0].nivel_minimo);
} finally {
  await db.end();
}
