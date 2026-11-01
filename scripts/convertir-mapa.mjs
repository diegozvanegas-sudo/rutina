// Convierte un GeoJSON o shapefile público en un mapa de 🗺️ Lugares (src/mapas/<id>.js).
//   node scripts/convertir-mapa.mjs scripts/mapas/antioquia.mjs <archivo .shp o .geojson>
// La configuración de cada mapa (filtro, campos, grupos, fuente) está en scripts/mapas/. El archivo de origen no se guarda en el repo.
//
// De dónde sacar los límites:
//   Colombia: MGN del DANE       https://geoportal.dane.gov.co/descargas/mgn_2023/MGN2023_MPIO_POLITICO.zip
//   Brasil:   malhas del IBGE    https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais.html
//   Mundo:    Natural Earth      https://www.naturalearthdata.com/downloads/
//
// Simplifica con mapshaper, que comparte los bordes entre vecinos: así no quedan huecos entre piezas.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import mapshaper from 'mapshaper';

const LIMITE_KB = 300, ANCHO = 1000;
const [, , rutaConfig, entrada] = process.argv;
if (!rutaConfig || !entrada) {
  console.error('Uso: node scripts/convertir-mapa.mjs scripts/mapas/<mapa>.mjs <archivo .shp o .geojson>');
  process.exit(1);
}
const cfg = (await import(pathToFileURL(resolve(rutaConfig)).href)).default;

const dir = mkdtempSync(join(tmpdir(), 'mapa-')), salidaGeo = join(dir, 'salida.geojson');
try {
  await mapshaper.runCommands('-i "' + entrada + '" encoding=utf8 -filter "' + cfg.filtro + '" -simplify ' + cfg.simplificar + ' keep-shapes -clean -o format=geojson precision=0.00001 "' + salidaGeo + '"');
  const geo = JSON.parse(readFileSync(salidaGeo, 'utf8'));
  const piezas = geo.features || geo.geometries;
  const anillos = (g) => (g.type === 'Polygon' ? g.coordinates : g.coordinates.flat());

  // Proyección equirectangular corregida por la latitud media: en mapas pequeños conserva bien la forma
  const pts = piezas.flatMap((f) => anillos(f.geometry).flat());
  const lons = pts.map((p) => p[0]), lats = pts.map((p) => p[1]);
  const oeste = Math.min(...lons), este = Math.max(...lons), sur = Math.min(...lats), norte = Math.max(...lats);
  const k = Math.cos(((sur + norte) / 2) * Math.PI / 180), margen = 10, escala = (ANCHO - 2 * margen) / ((este - oeste) * k);
  const proyeccion = { tipo: 'equirectangular', lon0: oeste, lat0: norte, k: +k.toFixed(6), escala: +escala.toFixed(4), margen };
  const x = (lon) => margen + (lon - oeste) * k * proyeccion.escala, y = (lat) => margen + (norte - lat) * proyeccion.escala;
  const alto = Math.ceil(y(sur) + margen);

  const n1 = (v) => +v.toFixed(1);
  const lista = piezas.map((f) => {
    const p = f.properties, id = String(p[cfg.campoId]);
    const rings = anillos(f.geometry).map((a) => a.map(([lon, lat]) => [n1(x(lon)), n1(y(lat))]));
    const principal = rings.reduce((m, a) => (area(a) > area(m) ? a : m));
    const d = rings.map((a) => 'M' + a.slice(0, -1).map((q) => q.join(' ')).join('L') + 'Z').join('');
    const nombre = cfg.nombres?.[id] || bonito(String(p[cfg.campoNombre]));
    const grupo = cfg.grupos ? cfg.grupos[id] : '';
    if (cfg.grupos && !grupo) throw new Error('Sin grupo: ' + id + ' ' + nombre);
    return { id, nombre, grupo, d, centro: centroide(principal) };
  }).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  const mapa = { id: cfg.id, nombre: cfg.nombre, padre: cfg.padre ?? null, pieza: cfg.pieza, ancho: ANCHO, alto, proyeccion, grupos: cfg.ordenGrupos || [], piezas: lista };
  const texto = '// Generado con scripts/convertir-mapa.mjs: no se edita a mano. Fuente: ' + cfg.fuente + '\nexport default ' + JSON.stringify(mapa) + ';\n';
  const salida = resolve('src/mapas/' + cfg.id + '.js');
  writeFileSync(salida, texto);
  const kb = Buffer.byteLength(texto) / 1024;
  console.log(cfg.id + ': ' + lista.length + ' piezas, ' + kb.toFixed(0) + ' KB (' + (pts.length) + ' puntos)');
  if (kb > LIMITE_KB) { console.error('⚠️ Pasa de ' + LIMITE_KB + ' KB: baja "simplificar" en ' + rutaConfig); process.exitCode = 1; }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

function area(a) {
  let s = 0;
  for (let i = 0; i < a.length - 1; i++) s += a[i][0] * a[i + 1][1] - a[i + 1][0] * a[i][1];
  return Math.abs(s / 2);
}
function centroide(a) {
  let s = 0, cx = 0, cy = 0;
  for (let i = 0; i < a.length - 1; i++) {
    const c = a[i][0] * a[i + 1][1] - a[i + 1][0] * a[i][1];
    s += c; cx += (a[i][0] + a[i + 1][0]) * c; cy += (a[i][1] + a[i + 1][1]) * c;
  }
  return s ? [n(cx / (3 * s)), n(cy / (3 * s))] : a[0];
}
function n(v) { return +v.toFixed(1); }
// "SAN PEDRO DE LOS MILAGROS" → "San Pedro de los Milagros"
function bonito(t) {
  return t.toLocaleLowerCase('es').replace(/(^|\s)\S/g, (c) => c.toLocaleUpperCase('es')).replace(/ (De|Del|La|Las|Los|El)(?= )/g, (m) => m.toLowerCase());
}
