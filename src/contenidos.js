// Los cursos (src/cursos) y los libros (src/libros) son más de la mitad del peso de la app: se descargan aparte, sin frenar el
// arranque (main.js llama cargarContenidos() al abrir y repinta cuando llegan). Mientras tanto todo responde como si no
// hubiera cursos ni libros (listas vacías, curso() y libro() dan null). 🎓 Estudiar y 📚 Libros esperan a que lleguen antes
// de abrirse. Sin internet funciona igual: el service worker ya los tiene guardados.
// CURSOS y LIBROS se exportan con let: quien los importa ve la lista llena en cuanto llega
export let CURSOS = [];
export let LIBROS = [];
let mc = null, ml = null, promesa = null;
const oyentes = [];

export const contenidosListos = () => !!(mc && ml);
export const curso = (id) => (mc ? mc.curso(id) : null);
export const libro = (id) => (ml ? ml.libro(id) : null);
export const areas = () => (mc ? mc.areas() : []);
export const area = (id) => (mc ? mc.area(id) : null);
export const areaDeCurso = (id) => (mc ? mc.areaDeCurso(id) : null);
// Catálogo de los permisos (⚙️ Administrar): vacío hasta que lleguen
export const catalogoAreas = () => (mc ? mc.catalogoAreas() : {});
export const catalogoCursos = () => (mc ? mc.catalogoCursos() : {});

/** f corre cuando estén los cursos y los libros (ya mismo si ya están) */
export function alCargarContenidos(f) { if (contenidosListos()) f(); else oyentes.push(f); }

export function cargarContenidos() {
  promesa ??= Promise.all([import('./cursos/index.js'), import('./libros/index.js')]).then(([c, l]) => {
    mc = c; ml = l; CURSOS = c.CURSOS; LIBROS = l.LIBROS;
    for (const f of oyentes.splice(0)) { try { f(); } catch (err) { console.error(err); } }
  }).catch((err) => { promesa = null; throw err; });
  return promesa;
}
