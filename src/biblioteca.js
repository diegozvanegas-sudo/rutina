// Libros (src/libros): qué lectura toca, racha de días con práctica y buscador sobre todo el contenido de un libro
import { iso, sumarDias, diasEntre } from './fechas.js';

// Progreso de un libro en e().libros[id]
export const progresoInicial = () => ({
  leidos: {},    // número de lectura: fecha en que se leyó
  practica: {},  // número de lectura: { índice de la práctica: fecha }
  notas: {},     // número de lectura: respuesta a la pregunta del diario
  perfil: {},    // campos del perfil del libro
  fichas: {},    // tipo de ficha: [{ id, fecha, ...campos }]
  evaluaciones: {}, // id: { marcados: { índice: true }, historial: [{ fecha, principal, pct }] }
  vuelta: 1,
});

// Lo de cada día va en e().dias[fecha].libros[id] (diario y afirmaciones dichas)
export const delDia = (dias, fecha, id) => (dias[fecha] && dias[fecha].libros && dias[fecha].libros[id]) || {};

// La que toca es la primera sin leer: si un día no se lee, al otro se sigue donde quedó
export function lecturaQueToca(libro, p) {
  const l = libro.lecturas.find((x) => !p.leidos[x.n]);
  return l ? l.n : null;
}
export const leidas = (libro, p) => libro.lecturas.filter((x) => p.leidos[x.n]).length;

// Días con algo del libro: una lectura, una práctica o algo escrito ese día
export function fechasActivas(id, p, dias = {}) {
  const s = new Set(Object.values(p.leidos));
  for (const x of Object.values(p.practica)) for (const fecha of Object.values(x)) s.add(fecha);
  for (const fecha of Object.keys(dias)) {
    const x = delDia(dias, fecha, id);
    if (x.afirmaciones || Object.entries(x).some(([k, v]) => k !== 'afirmaciones' && String(v || '').trim())) s.add(fecha);
  }
  return s;
}
// Días seguidos con el libro. Si hoy aún no hay nada, cuenta hasta ayer (como la racha de la mañana)
export function racha(id, p, dias, hoy = iso()) {
  const s = fechasActivas(id, p, dias);
  let n = 0, fecha = s.has(hoy) ? hoy : sumarDias(hoy, -1);
  while (s.has(fecha)) { n++; fecha = sumarDias(fecha, -1); }
  return n;
}

// Una afirmación distinta cada día, rotando las del libro
export function afirmacionDelDia(libro, fecha = iso()) {
  const lista = [...new Set(libro.lecturas.map((x) => x.afirmacion).filter(Boolean))];
  if (!lista.length) return null;
  return lista[((diasEntre('2026-01-01', fecha) % lista.length) + lista.length) % lista.length];
}

// ---------- Evaluaciones ----------
// Porcentaje marcado de cada categoría; la principal es la de mayor porcentaje (si empatan, la que va primero)
export function resultadoEvaluacion(ev, marcados = {}) {
  const pct = {};
  for (const cat of Object.keys(ev.categorias)) {
    const idx = ev.items.map((it, i) => (it[1] === cat ? i : -1)).filter((i) => i >= 0);
    pct[cat] = idx.length ? idx.filter((i) => marcados[i]).length / idx.length : 0;
  }
  const principal = Object.keys(pct).reduce((a, b) => (pct[b] > pct[a] ? b : a), Object.keys(pct)[0]);
  return { pct, principal: pct[principal] > 0 ? principal : null };
}

// ---------- Buscador ----------
export const normalizar = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9%/ ]+/g, ' ');
const VACIAS = new Set('que como para por con los las del una uno unos unas mas muy pero sin sobre esto esta este estoy tengo tener hacer hago quiero puedo mis mi me te se lo la el en de y o a al es son no si ya hay su sus tu tus cuando donde porque cual'.split(' '));
// Raíz corta para que "preocupado" encuentre "preocupación" y "estresado" encuentre "estrés"
const raiz = (p) => (p.length > 6 ? p.slice(0, 6) : p.length > 4 ? p.slice(0, p.length - 1) : p);
export function palabras(texto) {
  return normalizar(texto).split(/\s+/).filter((p) => p.length > 2 && !VACIAS.has(p)).map(raiz);
}
const cuenta = (texto, raices) => raices.reduce((s, r) => s + (texto.includes(r) ? 1 : 0), 0);

const puntosDe = (l) => [l.idea, l.intro, ...l.bloques.flatMap(([t, ps]) => ps.map((p) => t + ': ' + p)), ...(l.formulas || []), l.afirmacion, ...l.practica, l.pregunta, l.nota].filter(Boolean);

export function buscar(libro, texto) {
  const raices = palabras(texto);
  if (!raices.length) return { consejos: [], lecturas: [], conceptos: [] };
  const consejos = libro.consejos.map((c) => ({ c, s: cuenta(normalizar(c.texto + ' ' + c.claves.join(' ')), raices) }))
    .filter((x) => x.s).sort((a, b) => b.s - a.s).slice(0, 2).map((x) => x.c);
  const lecturas = libro.lecturas.map((l) => {
    const cab = normalizar(l.titulo + ' ' + l.temas.join(' '));
    const puntos = puntosDe(l).map((p) => ({ p, s: cuenta(normalizar(p), raices) })).filter((x) => x.s);
    const s = cuenta(cab, raices) * 3 + puntos.reduce((t, x) => t + x.s, 0);
    return { n: l.n, titulo: l.titulo, s, puntos: puntos.sort((a, b) => b.s - a.s).slice(0, 3).map((x) => x.p) };
  }).filter((x) => x.s).sort((a, b) => b.s - a.s || a.n - b.n).slice(0, 6);
  const conceptos = (libro.conceptos ? libro.conceptos.lista : []).filter((c) => cuenta(normalizar(c.nombre + ' ' + c.texto), raices)).slice(0, 6);
  return { consejos, lecturas, conceptos };
}
