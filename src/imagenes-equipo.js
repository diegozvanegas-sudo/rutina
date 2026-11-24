// 🖼️ Imágenes en este equipo y en Google Drive (las reglas están en src/imagenes.js):
// - Cada imagen se reduce al agregarla (máx. 2048 px, sin perder la letra de una infografía) y se guarda aquí
//   (IndexedDB "rutina-imagenes": la imagen y una miniatura para la cuadrícula), así se ve al instante y sin señal.
// - Después sube a tu Drive por el Apps Script (apps_script/Imagenes.gs; dirección y clave en Ajustes → 🖼️ Google Drive).
// - En otro equipo, la lista llega con la nube y cada imagen se baja de Drive la primera vez que se mira.
import { e, guardar, repintar } from './estado.js';
import { todas, nuevaImagen, juntarConDrive, porSubir, porActualizar, descripcionDrive, explicarError } from './imagenes.js';

export const drive = { estado: 'inactivo', mensaje: '', ultima: null }; // inactivo · trabajando · ok · error
const config = () => e().config.drive || {};
export const driveListo = () => !!(config().url && config().clave);

// ---------- Guardado en el equipo ----------
let base = null;
function abrir() {
  base ??= new Promise((ok, mal) => {
    const r = indexedDB.open('rutina-imagenes', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('img');
    r.onsuccess = () => ok(r.result);
    r.onerror = () => { base = null; mal(r.error); };
  });
  return base;
}
async function pedir(modo, f) {
  const db = await abrir();
  return new Promise((ok, mal) => { const t = db.transaction('img', modo), r = f(t.objectStore('img')); t.oncomplete = () => ok(r && r.result); t.onerror = () => mal(t.error); });
}
const leerLocal = (id) => pedir('readonly', (s) => s.get(id));
const ponerLocal = (id, v) => pedir('readwrite', (s) => s.put(v, id));
const quitarLocal = (id) => pedir('readwrite', (s) => s.delete(id));

// ---------- Reducir ----------
const LADO = 2048, MINI = 420;
async function dibujar(origen, lado, calidad) {
  const w = origen.width, h = origen.height, k = Math.min(1, lado / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); // un PNG transparente no queda negro en JPEG
  x.imageSmoothingQuality = 'high';
  x.drawImage(origen, 0, 0, c.width, c.height);
  return new Promise((ok) => c.toBlob((b) => ok(b), 'image/jpeg', calidad));
}
export async function reducir(archivo) {
  const bmp = await createImageBitmap(archivo);
  const chico = archivo.size < 700 * 1024 && Math.max(bmp.width, bmp.height) <= LADO && /^image\/(jpeg|png|webp)$/.test(archivo.type);
  const full = chico ? archivo : await dibujar(bmp, LADO, 0.9);
  const mini = await dibujar(bmp, MINI, 0.78);
  const k = Math.min(1, LADO / Math.max(bmp.width, bmp.height));
  const r = { full, mini, ancho: Math.round(bmp.width * (chico ? 1 : k)), alto: Math.round(bmp.height * (chico ? 1 : k)), mime: full.type || 'image/jpeg' };
  if (bmp.close) bmp.close();
  return r;
}

// ---------- Agregar, ver y borrar ----------
// archivos: File[] (elegidos, pegados o arrastrados). datos: { album, etiquetas } para todas. Devuelve las nuevas
export async function agregar(archivos, datos = {}) {
  const nuevas = [];
  for (const a of archivos) {
    if (!a || !/^image\//.test(a.type)) continue;
    const r = await reducir(a);
    const x = nuevaImagen(e(), { nombre: a.name || 'Imagen', album: datos.album || '', etiquetas: datos.etiquetas || [], mime: r.mime, ancho: r.ancho, alto: r.alto, tam: r.full.size });
    await ponerLocal(x.id, { full: r.full, mini: r.mini });
    nuevas.push(x);
  }
  if (nuevas.length) { guardar(); sincronizar(); }
  return nuevas;
}

// Direcciones (blob:) ya armadas: no se rehacen en cada repintado
const urls = new Map(), enCamino = new Map();
const clave = (id, mini) => id + (mini ? ':m' : ':f');
export const urlLista = (id, mini) => urls.get(clave(id, mini)) || null;
// La dirección para un <img>: de este equipo o, si no está, de Drive (y queda guardada aquí)
export function url(id, mini = false) {
  const k = clave(id, mini);
  if (urls.has(k)) return Promise.resolve(urls.get(k));
  if (enCamino.has(k)) return enCamino.get(k);
  const p = (async () => {
    let v = await leerLocal(id).catch(() => null);
    if (!v || !v.full) v = await bajar(id);
    if (!v) return null;
    const b = mini ? v.mini || v.full : v.full;
    const u = URL.createObjectURL(b);
    urls.set(k, u);
    return u;
  })().finally(() => enCamino.delete(k));
  enCamino.set(k, p);
  return p;
}
export async function archivoDe(id) {
  let v = await leerLocal(id).catch(() => null);
  if (!v || !v.full) v = await bajar(id);
  return v ? v.full : null;
}
async function bajar(id) {
  const x = e().imagenes && e().imagenes[id];
  if (!x || !x.driveId || !driveListo()) return null;
  const r = await llamar('leer', { id: x.driveId });
  const full = new Blob([Uint8Array.from(atob(r.datos), (c) => c.charCodeAt(0))], { type: r.mime || 'image/jpeg' });
  const mini = await dibujar(await createImageBitmap(full), MINI, 0.78);
  const v = { full, mini };
  await ponerLocal(id, v).catch(() => {});
  return v;
}

// Borrar: sale de la lista, de este equipo y va a la papelera de Drive. Devuelve con qué deshacer
export function borrar(id) {
  const x = e().imagenes && e().imagenes[id];
  if (!x) return null;
  delete e().imagenes[id];
  guardar();
  const quitar = setTimeout(() => {
    quitarLocal(id).catch(() => {});
    for (const m of [true, false]) { const u = urls.get(clave(id, m)); if (u) { URL.revokeObjectURL(u); urls.delete(clave(id, m)); } }
    if (x.driveId && driveListo()) llamar('borrar', { id: x.driveId }).catch(() => {});
  }, 6000); // lo que dura el aviso con "Deshacer"
  return () => { clearTimeout(quitar); e().imagenes[id] = x; guardar(); };
}

// ---------- Google Drive (apps_script/Imagenes.gs) ----------
async function llamar(accion, datos = {}) {
  const c = config();
  if (!driveListo()) throw new Error('Falta la dirección del Apps Script o la clave (Ajustes → 🖼️ Google Drive)');
  // text/plain: el navegador no hace la consulta previa (CORS) que Apps Script no responde
  const r = await fetch(c.url, { method: 'POST', body: JSON.stringify({ clave: c.clave, accion, ...datos }), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
  const res = await r.json();
  if (!res.ok) throw new Error(res.mensaje || 'Drive respondió con un error');
  return res;
}
const enBase64 = (blob) => new Promise((ok, mal) => { const f = new FileReader(); f.onload = () => ok(String(f.result).split(',')[1]); f.onerror = () => mal(f.error); f.readAsDataURL(blob); });
const extension = (mime) => ({ 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' })[mime] || '.jpg';

export async function probarDrive() {
  const r = await llamar('probar');
  drive.estado = 'ok'; drive.mensaje = 'Conectado: carpeta «' + r.carpeta + '» en tu Drive'; drive.enlace = r.enlace; drive.ultima = Date.now();
  repintar();
  return r;
}

let corriendo = null;
// Sube lo nuevo, cuenta a Drive lo que cambió y trae lo que esté en la carpeta y la app no conozca
export function sincronizar({ traer = false } = {}) {
  if (!driveListo() || !navigator.onLine) return Promise.resolve();
  if (corriendo) return corriendo;
  corriendo = (async () => {
    drive.estado = 'trabajando'; drive.mensaje = ''; repintar();
    try {
      let n = 0;
      for (const x of porSubir(e())) {
        const v = await leerLocal(x.id).catch(() => null);
        if (!v || !v.full) continue; // agregada en otro equipo que aún no la sube
        const r = await llamar('subir', { nombre: x.nombre + extension(v.full.type), album: x.album, mime: v.full.type || 'image/jpeg', datos: await enBase64(v.full), descripcion: descripcionDrive(x) });
        const y = e().imagenes[x.id];
        if (y) { y.driveId = r.id; guardar(); } else llamar('borrar', { id: r.id }).catch(() => {}); // la borraron mientras subía
        n++;
      }
      for (const x of porActualizar(e())) {
        await llamar('renombrar', { id: x.driveId, nombre: x.nombre + extension(x.mime) });
        await llamar('mover', { id: x.driveId, album: x.album });
        await llamar('describir', { id: x.driveId, descripcion: descripcionDrive(x) });
        const y = e().imagenes[x.id];
        if (y) { delete y.cambio; guardar(); }
      }
      if (traer) { const r = await llamar('listar'); if (juntarConDrive(e(), r.archivos)) guardar(); }
      drive.estado = 'ok'; drive.ultima = Date.now(); drive.mensaje = n ? '☁️ ' + n + (n === 1 ? ' imagen subida' : ' imágenes subidas') + ' a Drive' : '';
    } catch (err) {
      drive.estado = 'error'; drive.mensaje = explicarError(err.message || String(err));
    } finally { corriendo = null; repintar(); }
  })();
  return corriendo;
}
// Al volver la señal, lo pendiente sube solo
if (typeof window !== 'undefined') window.addEventListener('online', () => { if (porSubir(e()).length || porActualizar(e()).length) sincronizar(); });
export const pendientesDrive = () => porSubir(e()).length + porActualizar(e()).length;
export const hayImagenes = () => todas(e()).length > 0;
