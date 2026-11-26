// 🗂️ Copias de cada día en este equipo: una por día, de los últimos DIAS días, aparte de la nube (si algo sale mal allá o
// aquí, se vuelve a cómo estaba ese día desde Ajustes → Copia de seguridad). Se toma con el primer cambio de cada día, así
// queda cómo empezó el día y nunca se pisa: si hoy se borra algo, las copias de los días anteriores siguen intactas.
// Una copia sin nada propio (una cuenta vacía o recién borrada) no se guarda, para no sacar a una buena.
// Van en IndexedDB (no en localStorage, que tiene unos 5 MB y ya guarda los datos y la copia de la nube).
// También: cuánto espacio usa la app en este equipo, para avisar antes de que se llene.
import { alGuardarse, datosParaNube, claveActual, guardandoAqui, importar, guardarAntes } from './estado.js';
import { tieneDatosPropios } from './combinar.js';
import { iso } from './fechas.js';

export const DIAS = 7;
const BD = 'rutina-copias', TABLA = 'copias';
let bd = null, hechas = new Set();

function abrir() {
  if (bd) return bd;
  bd = new Promise((listo, falla) => {
    if (typeof indexedDB === 'undefined') { falla(new Error('Este navegador no guarda copias')); return; }
    const r = indexedDB.open(BD, 1);
    r.onupgradeneeded = () => { const t = r.result.createObjectStore(TABLA, { keyPath: 'id' }); t.createIndex('clave', 'clave'); };
    r.onsuccess = () => listo(r.result);
    r.onerror = () => falla(r.error);
  });
  bd.catch(() => { bd = null; });
  return bd;
}
const pedido = (r) => new Promise((listo, falla) => { r.onsuccess = () => listo(r.result); r.onerror = () => falla(r.error); });

// Las copias de quien está usando la app, la más nueva primero: { id, fecha, ts, tam, dias }
export async function copiasLocales(clave = claveActual()) {
  const t = (await abrir()).transaction(TABLA).objectStore(TABLA);
  const todas = await pedido(t.index('clave').getAll(clave));
  return todas.map(({ datos, ...resto }) => resto).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

// Guarda la copia de hoy si todavía no hay (y deja solo las de los últimos DIAS días). Devuelve true si guardó
export async function copiarHoy(ahora = Date.now()) {
  if (!guardandoAqui()) return false;
  const clave = claveActual(), fecha = iso(new Date(ahora)), id = clave + '|' + fecha;
  if (hechas.has(id)) return false;
  hechas.add(id);
  try {
    const datos = datosParaNube();
    if (!tieneDatosPropios(datos)) { hechas.delete(id); return false; }
    const t = (await abrir()).transaction(TABLA, 'readwrite').objectStore(TABLA);
    if (await pedido(t.get(id))) return false;
    const texto = JSON.stringify(datos);
    t.put({ id, clave, fecha, ts: ahora, tam: texto.length, dias: Object.keys(datos.dias || {}).length, datos: texto });
    const todas = (await pedido(t.index('clave').getAllKeys(clave))).sort().reverse();
    for (const viejo of todas.slice(DIAS)) t.delete(viejo);
    return true;
  } catch (err) { hechas.delete(id); return false; }
}

// Vuelve a cómo estaba ese día (como importar una copia: lo de ahora queda en «:antes», por si acaso)
export async function volverACopia(id) {
  const t = (await abrir()).transaction(TABLA).objectStore(TABLA);
  const c = await pedido(t.get(id));
  if (!c || c.clave !== claveActual()) throw new Error('Esa copia ya no está en este equipo');
  guardarAntes(datosParaNube());
  importar(c.datos);
}

// Descarga una copia como archivo .json (la misma forma que ⬇ Exportar)
export async function textoDeCopia(id) {
  const c = await pedido((await abrir()).transaction(TABLA).objectStore(TABLA).get(id));
  return c ? c.datos : null;
}

// ---------- Espacio ----------
// localStorage (los datos, la copia de la nube y la de «antes»): los navegadores dejan unos 5 MB por página y, si se
// llena, la app ya no puede guardar. usado/total: todo lo de la app en este equipo (incluye imágenes y audios guardados)
export const LIMITE_LOCAL = 5 * 1024 * 1024;
export function usoLocal() {
  let n = 0;
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); n += (k.length + (localStorage.getItem(k) || '').length) * 2; } } catch (err) {}
  return n;
}
export async function espacio() {
  const local = usoLocal();
  let usado = null, total = null;
  try { if (navigator.storage && navigator.storage.estimate) ({ usage: usado, quota: total } = await navigator.storage.estimate()); } catch (err) {}
  // Aviso: localStorage por encima del 70 % de lo que deja el navegador, o el equipo casi lleno
  const aviso = local > LIMITE_LOCAL * 0.7 ? 'local' : usado && total && usado / total > 0.85 ? 'equipo' : null;
  return { local, usado, total, aviso };
}
export const mb = (b) => (b / 1024 / 1024).toLocaleString('es-CO', { maximumFractionDigits: b < 10 * 1024 * 1024 ? 1 : 0 }) + ' MB';

export function iniciarCopias() {
  alGuardarse(() => { copiarHoy(); });
  // Al abrir la app también (si ya hay datos de quien entra), sin frenar el arranque
  setTimeout(() => copiarHoy(), 4000);
}
