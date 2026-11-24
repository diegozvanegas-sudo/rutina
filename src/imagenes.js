// 🖼️ Imágenes: reglas sin pantalla (para poder probarlas). Lo que se guarda de cada imagen viaja con la nube; la imagen
// misma vive en tu Google Drive (apps_script/Imagenes.gs, una subcarpeta por álbum) y se guarda en cada equipo para verla
// sin señal (src/imagenes-equipo.js).
//   est.imagenes = { id: { id, nombre, album, etiquetas: [texto], nota, fecha, creada, driveId, mime, ancho, alto, tam, cambio } }
//     album: el nombre de la subcarpeta ('' = sin álbum) · driveId: null hasta que sube · cambio: hay que contarle a Drive
//     un cambio de nombre, álbum, etiquetas o nota
//   est.imagenesMeta = { albumes: [nombre] }  (álbumes creados aunque estén vacíos)
const uid = () => 'im' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const llano = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export const todas = (est) => Object.values(est.imagenes || {}).filter((x) => x && typeof x === 'object');
// Lo más nuevo primero (por la fecha de la imagen y, el mismo día, la hora en que se agregó)
export const enOrden = (lista) => [...lista].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)) || (b.creada || 0) - (a.creada || 0));

export function nuevaImagen(est, datos, ahora = Date.now()) {
  const x = { id: uid(), nombre: 'Imagen', album: '', etiquetas: [], nota: '', fecha: new Date(ahora).toISOString().slice(0, 10), creada: ahora, driveId: null, ...datos };
  x.nombre = limpiarNombre(x.nombre);
  (est.imagenes ??= {})[x.id] = x;
  if (x.album) agregarAlbum(est, x.album);
  return x;
}
// "IMG_2026.JPG" → "IMG_2026"; sin nombre, "Imagen"
export const limpiarNombre = (n) => String(n || '').replace(/\.(jpe?g|png|webp|gif|heic|heif|avif|bmp)$/i, '').replace(/\s+/g, ' ').trim().slice(0, 120) || 'Imagen';
// "pecho, cuello , Rostro" → ['pecho', 'cuello', 'rostro'] (sin repetir; # opcional)
export const leerEtiquetas = (texto) => [...new Set(String(texto || '').split(/[,#\n]/).map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 20);

export function albumes(est) {
  const propios = (est.imagenesMeta && est.imagenesMeta.albumes) || [];
  return [...new Set([...propios, ...todas(est).map((x) => x.album).filter(Boolean)])].sort((a, b) => a.localeCompare(b, 'es'));
}
export function agregarAlbum(est, nombre) {
  const n = String(nombre || '').trim().slice(0, 60);
  if (!n) return '';
  const m = (est.imagenesMeta ??= { albumes: [] });
  m.albumes ??= [];
  if (!m.albumes.some((a) => llano(a) === llano(n))) m.albumes.push(n);
  return m.albumes.find((a) => llano(a) === llano(n));
}
// Las etiquetas en uso, de la más usada a la menos: [[etiqueta, cuántas]]
export function etiquetasEnUso(lista) {
  const n = {};
  for (const x of lista) for (const t of x.etiquetas || []) n[t] = (n[t] || 0) + 1;
  return Object.entries(n).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'));
}
// filtro: { album ('' = todas, '-' = sin álbum), etiqueta, buscar }
export function filtrar(lista, f = {}) {
  const q = llano(f.buscar), palabras = q ? q.split(/\s+/) : [];
  return lista.filter((x) => (!f.album || (f.album === '-' ? !x.album : x.album === f.album))
    && (!f.etiqueta || (x.etiquetas || []).includes(f.etiqueta))
    && palabras.every((p) => llano([x.nombre, x.album, x.nota, ...(x.etiquetas || [])].join(' ')).includes(p)));
}
// Línea de tiempo: [['2026-11', [imágenes]], …] de lo más nuevo a lo más viejo
export function porMes(lista) {
  const g = {};
  for (const x of enOrden(lista)) (g[String(x.fecha).slice(0, 7)] ??= []).push(x);
  return Object.entries(g);
}

// Cambiar nombre, álbum, etiquetas, nota o fecha: queda marcado para contárselo a Drive
export function editar(est, id, cambios) {
  const x = est.imagenes && est.imagenes[id];
  if (!x) return false;
  if ('nombre' in cambios) x.nombre = limpiarNombre(cambios.nombre);
  if ('album' in cambios) x.album = cambios.album ? agregarAlbum(est, cambios.album) : '';
  if ('etiquetas' in cambios) x.etiquetas = Array.isArray(cambios.etiquetas) ? cambios.etiquetas : leerEtiquetas(cambios.etiquetas);
  if ('nota' in cambios) x.nota = String(cambios.nota || '').slice(0, 2000);
  if ('fecha' in cambios && /^\d{4}-\d{2}-\d{2}$/.test(cambios.fecha)) x.fecha = cambios.fecha;
  if (x.driveId) x.cambio = true;
  return true;
}
// En la descripción del archivo de Drive van las etiquetas y la nota: así se recuperan si se pierde la lista
export const descripcionDrive = (x) => [(x.etiquetas || []).map((t) => '#' + t.replace(/\s+/g, '-')).join(' '), x.nota || ''].filter(Boolean).join('\n');
export function leerDescripcion(texto) {
  const lineas = String(texto || '').split('\n'), primera = lineas[0] || '';
  if (/^(#\S+\s*)+$/.test(primera.trim())) return { etiquetas: leerEtiquetas(primera.replace(/-/g, ' ')), nota: lineas.slice(1).join('\n').trim() };
  return { etiquetas: [], nota: String(texto || '').trim() };
}

// Lo que hay en la carpeta de Drive y la app no conoce (subido desde el computador, o la lista se perdió) entra a la lista.
// Las que la app conoce toman el álbum en que estén en Drive (si las moviste allá). Devuelve cuántas cambió
export function juntarConDrive(est, archivos) {
  const porDrive = new Map(todas(est).filter((x) => x.driveId).map((x) => [x.driveId, x]));
  let n = 0;
  for (const a of archivos || []) {
    const x = porDrive.get(a.id);
    if (x) { if (!x.cambio && (x.album || '') !== (a.album || '')) { x.album = a.album || ''; if (a.album) agregarAlbum(est, a.album); n++; } continue; }
    const { etiquetas, nota } = leerDescripcion(a.descripcion);
    nuevaImagen(est, { nombre: a.nombre, album: a.album || '', etiquetas, nota, driveId: a.id, mime: a.mime, tam: a.tam, fecha: new Date(a.creado || Date.now()).toISOString().slice(0, 10), creada: a.creado || Date.now() });
    n++;
  }
  return n;
}
export const porSubir = (est) => todas(est).filter((x) => !x.driveId);
export const porActualizar = (est) => todas(est).filter((x) => x.driveId && x.cambio);

// ---------- Conectar Google Drive (Ajustes → 🖼️ Google Drive) ----------
// La dirección de la aplicación web: si pegan solo el ID de implementación ("AKfycb…") o la de prueba (/dev), queda la /exec
export function urlDrive(texto) {
  const t = String(texto || '').trim();
  if (/^AKfyc[\w-]{20,}$/.test(t)) return 'https://script.google.com/macros/s/' + t + '/exec';
  const m = t.match(/^https:\/\/script\.google\.com\/(?:a\/[^/]+\/)?macros\/s\/([\w-]{20,})(?:\/(?:exec|dev))?\/?(?:\?.*)?$/);
  return m ? t.replace(/\/macros\/s\/[\w-]+.*$/, '/macros/s/' + m[1] + '/exec') : t;
}
export const idDeUrl = (u) => { const m = String(u || '').match(/\/macros\/s\/([\w-]+)/); return m ? m[1] : ''; };
// Una clave para el script: 24 letras y números al azar
export function claveNueva(azar = Math.random) {
  const letras = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'rutina-' + Array.from({ length: 24 }, () => letras[Math.floor(azar() * letras.length)]).join('');
}
// El script listo para pegar, con la clave ya puesta
export const scriptConClave = (script, clave) => String(script).replace(/const CLAVE = '[^']*';/, "const CLAVE = '" + String(clave).replace(/[^\w-]/g, '') + "';");
// Qué está mal, dicho para arreglarlo
export function problemaDrive({ url, clave }) {
  if (!url) return 'Falta la dirección de la aplicación web (paso 3).';
  if (!/^https:\/\/script\.google\.com\/.*\/macros\/s\/[\w-]+\/exec$|^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)) return 'La dirección debe ser la de la aplicación web: empieza con https://script.google.com/macros/s/ y termina en /exec.';
  if (!clave) return 'Falta la clave (paso 1).';
  if (clave === idDeUrl(url)) return 'Pusiste el ID de implementación como clave. La clave es la que va en const CLAVE dentro del script: toca «Crear mi clave» (paso 1).';
  return '';
}
export function explicarError(mensaje) {
  const m = String(mensaje || '');
  if (/clave incorrecta/i.test(m)) return 'La clave no coincide con la del script. Copia el script con tu clave (paso 1), pégalo en tu proyecto reemplazando todo, guarda y en Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar (la dirección no cambia).';
  if (/failed to fetch|networkerror|load failed/i.test(m)) return 'No se pudo llegar al script. Revisa que la dirección termine en /exec, que tengas internet y que en la implementación diga Acceso: «Cualquier usuario».';
  if (/json|unexpected token|<!doctype/i.test(m)) return 'Google pidió iniciar sesión en vez de responder: en la implementación, Acceso debe ser «Cualquier usuario» (no «Solo yo»).';
  if (/autoriza|authoriz|permission|permiso/i.test(m)) return 'Falta autorizar el script: en el editor, ejecuta una vez «doPost» o vuelve a Implementar y acepta los permisos de Drive.';
  return m;
}
