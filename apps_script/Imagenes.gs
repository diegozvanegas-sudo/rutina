/**
 * 🖼️ Imágenes de la app "Rutina" en tu Google Drive: una carpeta "Rutina · Imágenes" (se crea sola) con una
 * subcarpeta por álbum. Los archivos quedan privados, en tu Drive: la app los sube, los lista y los lee por aquí.
 *
 * Instalación (una vez), en script.google.com > Nuevo proyecto > pegar este archivo > cambiar CLAVE >
 * Implementar > Nueva implementación > Aplicación web > Ejecutar como: yo · Quién tiene acceso: cualquier usuario >
 * Implementar y autorizar. La URL que termina en /exec y la CLAVE van en la app: Ajustes > 🖼️ Google Drive.
 *
 * Pedidos (POST, JSON en texto): { clave, accion, ... }
 *   probar                                  → { ok, carpeta, enlace }
 *   listar                                  → { ok, archivos: [{ id, nombre, album, mime, creado, tam }] }
 *   subir  { nombre, album, mime, datos, descripcion } (datos en base64) → { ok, id }
 *   leer   { id }                           → { ok, mime, datos }
 *   mover  { id, album }                    · renombrar { id, nombre } · describir { id, descripcion } · borrar { id } (papelera)
 */
const CLAVE = 'CAMBIA-ESTA-CLAVE';
const NOMBRE_CARPETA = 'Rutina · Imágenes';
const SIN_ALBUM = 'Sin álbum';

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    if (p.clave !== CLAVE) return salida({ ok: false, mensaje: 'Clave incorrecta' });
    const raiz = carpetaRaiz();
    switch (p.accion) {
      case 'probar': return salida({ ok: true, carpeta: raiz.getName(), enlace: raiz.getUrl() });
      case 'listar': return salida({ ok: true, archivos: listar(raiz) });
      case 'subir': {
        const blob = Utilities.newBlob(Utilities.base64Decode(p.datos), p.mime || 'image/jpeg', p.nombre || 'imagen');
        const f = album(raiz, p.album).createFile(blob);
        if (p.descripcion) f.setDescription(String(p.descripcion).slice(0, 2000));
        return salida({ ok: true, id: f.getId() });
      }
      case 'leer': {
        const f = propio(raiz, p.id), b = f.getBlob();
        return salida({ ok: true, mime: b.getContentType(), datos: Utilities.base64Encode(b.getBytes()) });
      }
      case 'mover': { const f = propio(raiz, p.id); f.moveTo(album(raiz, p.album)); return salida({ ok: true }); }
      case 'renombrar': { propio(raiz, p.id).setName(String(p.nombre || 'imagen')); return salida({ ok: true }); }
      case 'describir': { propio(raiz, p.id).setDescription(String(p.descripcion || '').slice(0, 2000)); return salida({ ok: true }); }
      case 'borrar': { propio(raiz, p.id).setTrashed(true); return salida({ ok: true }); }
      default: return salida({ ok: false, mensaje: 'Pedido desconocido: ' + p.accion });
    }
  } catch (err) {
    return salida({ ok: false, mensaje: String(err && err.message || err) });
  }
}

function carpetaRaiz() {
  const props = PropertiesService.getScriptProperties(), id = props.getProperty('raiz');
  if (id) { try { const c = DriveApp.getFolderById(id); if (!c.isTrashed()) return c; } catch (err) {} }
  const hay = DriveApp.getFoldersByName(NOMBRE_CARPETA), c = hay.hasNext() ? hay.next() : DriveApp.createFolder(NOMBRE_CARPETA);
  props.setProperty('raiz', c.getId());
  return c;
}
// La subcarpeta del álbum (se crea si no existe); sin álbum, la carpeta raíz
function album(raiz, nombre) {
  const n = String(nombre || '').trim();
  if (!n || n === SIN_ALBUM) return raiz;
  const hay = raiz.getFoldersByName(n);
  return hay.hasNext() ? hay.next() : raiz.createFolder(n);
}
// Solo archivos de la carpeta de la app (nunca otros de tu Drive)
function propio(raiz, id) {
  const f = DriveApp.getFileById(id), padres = f.getParents();
  while (padres.hasNext()) { const c = padres.next(); if (c.getId() === raiz.getId()) return f; const arriba = c.getParents(); if (arriba.hasNext() && arriba.next().getId() === raiz.getId()) return f; }
  throw new Error('Ese archivo no es de la carpeta de imágenes');
}
function listar(raiz) {
  const salida = [], poner = (f, nombreAlbum) => {
    if (!/^image\//.test(f.getMimeType()) || f.isTrashed()) return;
    salida.push({ id: f.getId(), nombre: f.getName(), album: nombreAlbum, mime: f.getMimeType(), creado: f.getDateCreated().getTime(), tam: f.getSize(), descripcion: f.getDescription() || '' });
  };
  for (const fs = raiz.getFiles(); fs.hasNext();) poner(fs.next(), '');
  for (const cs = raiz.getFolders(); cs.hasNext();) { const c = cs.next(); for (const fs = c.getFiles(); fs.hasNext();) poner(fs.next(), c.getName()); }
  return salida;
}
function salida(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
