// 🎓 Estudiar (src/cursos): lección que toca, tarjetas con repaso espaciado, plan del día según los minutos y racha.
// Sin pantalla ni estado: todo recibe lo guardado en e().estudio = { actual, cursos, tarjetas, dias }.
import { iso, sumarDias } from './fechas.js';

// Las tarjetas vuelven a 1, 3, 7, 16 y 35 días; acertar la de 35 días la deja dominada. Fallar la manda al principio
export const INTERVALOS = [1, 3, 7, 16, 35];
export const SEG_TARJETA = 30; // lo que se calcula por repaso en el plan del día

// Progreso de un curso en e().estudio.cursos[id]
export const progresoCurso = () => ({
  hechas: {},     // número de lección: fecha en que se terminó
  practica: {},   // número de lección: { índice: fecha }
  recordar: {},   // número de lección: { índice: true si la sabía, false si no }
  diario: {},     // número de lección: respuesta a la pregunta del diario
  proyecto: {},   // índice del paso: fecha
});

// Las lecciones del curso en una sola lista, numeradas desde 1, con su módulo
export function lecciones(curso) {
  let n = 0;
  return curso.modulos.flatMap((m, im) => m.lecciones.map((l) => ({ ...l, n: ++n, modulo: im + 1 })));
}
export const leccion = (curso, n) => lecciones(curso)[n - 1] || null;
// La que toca es la primera sin terminar: si un día no se estudia, al otro se sigue donde quedó
export function leccionQueToca(curso, p) {
  const l = lecciones(curso).find((x) => !p.hechas[x.n]);
  return l ? l.n : null;
}
export const hechas = (curso, p) => lecciones(curso).filter((x) => p.hechas[x.n]).length;
export const avance = (curso, p) => hechas(curso, p) / lecciones(curso).length;

// ---------- Tarjetas ----------
export const idTarjeta = (curso, n, i) => curso + ':' + n + ':' + i;
// Al terminar una lección sus tarjetas entran al mazo y se repasan por primera vez al otro día
export function sumarTarjetas(tarjetas, curso, l, hoy = iso()) {
  (l.tarjetas || []).forEach((_, i) => { tarjetas[idTarjeta(curso.id, l.n, i)] ??= { paso: 0, proxima: sumarDias(hoy, INTERVALOS[0]) }; });
}
// Acertar sube un paso (vuelve en 3, 7, 16 o 35 días); fallar vuelve al paso 0 (mañana)
export function repasar(t, acerto, hoy = iso()) {
  t.ultima = hoy;
  if (!acerto) { t.paso = 0; t.proxima = sumarDias(hoy, INTERVALOS[0]); t.fallos = (t.fallos || 0) + 1; return t; }
  t.paso++;
  t.proxima = t.paso >= INTERVALOS.length ? null : sumarDias(hoy, INTERVALOS[t.paso]);
  return t;
}
export const dominada = (t) => t.proxima == null;
// Las que tocan hoy (o se atrasaron), las más atrasadas primero
export function pendientes(tarjetas, hoy = iso()) {
  return Object.entries(tarjetas).filter(([, t]) => t.proxima && t.proxima <= hoy)
    .sort(([a, x], [b, y]) => x.proxima.localeCompare(y.proxima) || a.localeCompare(b)).map(([id]) => id);
}
// Frente y reverso de una tarjeta por su id, buscando en los cursos que hay
export function tarjeta(cursos, id) {
  const [c, n, i] = id.split(':'), curso = cursos.find((x) => x.id === c), l = curso && leccion(curso, Number(n)), t = l && (l.tarjetas || [])[Number(i)];
  return t ? { curso, leccion: l, frente: t[0], reverso: t[1] } : null;
}

// ---------- Plan del día ----------
// Primero los repasos que tocan (30 s cada uno) y luego tantas lecciones como quepan. Si sobra poco tiempo, solo repaso;
// si no hay nada que repasar y ninguna lección cabe, igual se propone la siguiente (marcada como "excede").
// siguientes: [{ curso, n, minutos }] en el orden en que tocan. hecho: lo que ya se hizo hoy { minutos, repasos }
export function planDelDia({ minutos, repasos, siguientes, hecho = { minutos: 0, repasos: 0 } }) {
  let libres = Math.max(0, minutos - hecho.minutos - (hecho.repasos * SEG_TARJETA) / 60);
  const cuantos = Math.min(repasos, Math.floor((libres * 60) / SEG_TARJETA));
  libres -= (cuantos * SEG_TARJETA) / 60;
  const plan = { repasos: cuantos, quedanRepasos: repasos - cuantos, lecciones: [], excede: false };
  for (const s of siguientes) {
    if (s.minutos > libres + 1e-9) break;
    plan.lecciones.push(s);
    libres -= s.minutos;
  }
  if (!plan.repasos && !plan.lecciones.length && !hecho.minutos && !hecho.repasos && siguientes.length) { plan.lecciones.push(siguientes[0]); plan.excede = true; }
  plan.minutos = Math.round((plan.repasos * SEG_TARJETA) / 60 + plan.lecciones.reduce((s, l) => s + l.minutos, 0));
  plan.listo = !plan.repasos && !plan.lecciones.length && !plan.quedanRepasos;
  return plan;
}
// Las lecciones siguientes de los cursos en orden: primero el curso actual, luego los empezados y luego los demás
export function siguientes(cursos, est) {
  const p = (c) => est.cursos[c.id] || progresoCurso();
  const orden = [...cursos].sort((a, b) => (b.id === est.actual) - (a.id === est.actual) || (hechas(b, p(b)) > 0) - (hechas(a, p(a)) > 0));
  return orden.flatMap((c) => lecciones(c).filter((l) => !p(c).hechas[l.n]).map((l) => ({ curso: c.id, n: l.n, minutos: l.minutos })));
}

// ---------- Lo de cada día y la racha ----------
// e().estudio.dias[fecha] = { minutos (de lecciones terminadas), lecciones, repasos }
export function anotar(dias, que, cuanto = 1, fecha = iso()) {
  const d = (dias[fecha] ??= { minutos: 0, lecciones: 0, repasos: 0 });
  d[que] = Math.max(0, (d[que] || 0) + cuanto);
  return d;
}
const activo = (d) => !!d && (d.lecciones > 0 || d.repasos > 0);
// Días seguidos estudiando (una lección o un repaso). Si hoy aún no hay nada, cuenta hasta ayer
export function rachaEstudio(dias, hoy = iso()) {
  let n = 0, fecha = activo(dias[hoy]) ? hoy : sumarDias(hoy, -1);
  while (activo(dias[fecha])) { n++; fecha = sumarDias(fecha, -1); }
  return n;
}
