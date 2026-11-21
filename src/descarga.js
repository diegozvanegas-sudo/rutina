// 🔻 Semana de descarga: la mitad de las series con el mismo peso y 3-4 reps en reserva, para que la fatiga baje y el cuerpo
// asimile lo entrenado. Sin pantalla, para poder probarlo (la pantalla está en src/react/pantallas/Gym.tsx y GymDia.tsx).
// est.descargas = { [semana]: true | false }  true = descarga puesta a mano; false = "esta semana no" (también apaga la
// del plan de 12 semanas y la sugerencia). Sin nada: es descarga si el 📆 plan de 12 semanas la pone esa semana.
import { lunesDe, sumarDias, diasEntre } from './fechas.js';
import { progresoMes, numero, formatoPeso, repsDe } from './gym.js';
import { faseDe } from './plan12.js';

export const RIR_DESCARGA = '3-4';
// Cada 4-8 semanas de entreno duro, una de descarga: desde 6 seguidas se sugiere; con 3 o más estancados, desde 4
export const SEMANAS_SUGERIR = 6, SEMANAS_CON_ESTANCADOS = 4, ESTANCADOS_SUGERIR = 3;

// ¿La semana del gym cae en la fase de descarga del plan de 12 semanas? (se mira el jueves: el plan empieza un lunes)
function delPlan(sem, est) {
  const p = est.plan12, fase = p && p.inicio && (() => {
    const dia = sumarDias(lunesDe(sem), 3);
    if (dia < p.inicio) return null;
    return Math.floor(diasEntre(p.inicio, dia) / 7) + 1;
  })();
  return !!fase && (faseDe(fase) || {}).id === 'descarga';
}

// De dónde viene la descarga de esa semana: 'manual', 'plan', 'descanso' (descarga sin ir al gym) o null (no es descarga).
// est.descargas[sem] = 'descanso': la semana no se va al gym; cuenta igual que una descarga para las metas y el estancamiento
export function origenDescarga(sem, est) {
  const m = (est.descargas || {})[sem];
  if (m === true) return 'manual';
  if (m === 'descanso') return 'descanso';
  if (m === false) return null;
  return delPlan(sem, est) ? 'plan' : null;
}
export const esDescarga = (sem, est) => !!origenDescarga(sem, est);

// La mitad de las series (redondeando hacia arriba, nunca menos de 1): 4 → 2, 3 → 2, 2 → 1
export const seriesDescarga = (n) => (Number(n) >= 2 ? Math.ceil(Number(n) / 2) : n);
export const filaDescarga = (f) => ({ ...f, series: seriesDescarga(f.series) });
// La fila como toca esa semana (en descarga, con la mitad de las series)
export const filaDe = (f, sem, est) => (f && esDescarga(sem, est) ? filaDescarga(f) : f);
export const ejDe = (ej, sem, est) => (esDescarga(sem, est) ? { ...ej, filas: ej.filas.map(filaDescarga) } : ej);
// Los días como tocan esa semana (para contar series hechas / planeadas)
// 🛌 Descanso total: no hay series por hacer esa semana (0 de 0, no "te faltan"); si igual vas, se anotan con la mitad
export const esDescanso = (sem, est) => origenDescarga(sem, est) === 'descanso';
// 🛌 Un día de descanso suelto (dias[fecha].descanso) tampoco tiene series por hacer, salvo que su sesión se haya pasado a
// otro día de la semana (dias[fecha].movido): esa sigue contando, porque se hace allá
const descansaSinMover = (d, sem, est) => {
  if (!d.diaSemana) return false;
  const x = ((est.dias || {})[sumarDias(lunesDe(sem), d.diaSemana - 1)]) || {};
  return !!x.descanso && !x.movido;
};
export const rutinaDe = (rutina, sem, est) => (esDescarga(sem, est) || rutina.some((d) => descansaSinMover(d, sem, est))
  ? rutina.map((d) => ({ ...d, ejercicios: d.ejercicios.map((ej) => ({ ...ej, filas: ej.filas.map((f) => (esDescanso(sem, est) || descansaSinMover(d, sem, est) ? { ...f, series: 0 } : esDescarga(sem, est) ? filaDescarga(f) : f)) })) }))
  : rutina);

// Las semanas sin las de descarga: así la meta de la semana siguiente sale de la última semana normal y el estancamiento
// no cuenta la descarga como una semana sin mejorar
export function sinDescargas(semanas, est) {
  const out = {};
  for (const k of Object.keys(semanas || {})) if (!esDescarga(Number(k), est)) out[k] = semanas[k];
  return out;
}

const conDatos = (regs) => Object.values(regs || {}).some((r) => r && String(r.reps || '').trim() !== '');
// Semanas seguidas con entreno anotado antes de `sem`, hasta la última descarga (las semanas vacías no cortan ni suman)
export function semanasSinDescarga(sem, est) {
  let n = 0;
  for (let s = sem - 1; s >= 1; s--) {
    if (esDescarga(s, est)) break;
    if (conDatos((est.semanas || {})[s])) n++;
  }
  return n;
}

// ¿Conviene una descarga esta semana? null si no, o { semanas, estancados, texto }
export function sugerirDescarga(sem, est) {
  if (origenDescarga(sem, est) || (est.descargas || {})[sem] === false) return null;
  if (esDescarga(sem + 1, est)) return null; // el plan ya la pone la próxima
  const semanas = semanasSinDescarga(sem, est);
  if (semanas < SEMANAS_CON_ESTANCADOS) return null;
  const estancados = progresoMes(sinDescargas(est.semanas, est), est.rutina || [], sem - 1).filter((x) => x.est && x.est.estancado).length;
  if (semanas >= SEMANAS_SUGERIR) return { semanas, estancados, texto: 'Llevas ' + semanas + ' semanas seguidas entrenando sin descarga' + (estancados ? ' y ' + estancados + ' ejercicio' + (estancados > 1 ? 's' : '') + ' estancado' + (estancados > 1 ? 's' : '') : '') + '.' };
  if (estancados >= ESTANCADOS_SUGERIR) return { semanas, estancados, texto: estancados + ' ejercicios llevan 3 semanas o más sin subir: es fatiga acumulada, no falta de ganas.' };
  return null;
}

// 🎯 La meta de una fila en descarga: el peso de la última semana normal, sus mismas reps y la mitad de las series
export function metaDescarga(fila, ultimo) {
  if (!fila || fila.unidad === 's' || !ultimo) return null;
  const peso = numero(ultimo.peso), u = ultimo.unidad || 'kg', n = seriesDescarga(fila.series || 1);
  if (peso == null) return null;
  const reps = repsDe(ultimo.reps).filter((x) => x > 0).slice(0, n);
  while (reps.length && reps.length < n) reps.push(reps[reps.length - 1]);
  return { peso, unidad: u, sube: false, descarga: true, series: reps, reps: reps.length ? Math.max(...reps) : fila.min,
    texto: formatoPeso(peso) + ' ' + u + ' × ' + (reps.length ? reps.join(' ') : fila.min),
    motivo: 'Descarga: mismo peso, ' + n + (n === 1 ? ' serie' : ' series') + ' y deja ' + RIR_DESCARGA + ' reps en reserva. La próxima semana vuelves a tu meta normal.' };
}

// ---------- 🔻 Descargar hoy: un día suelto más liviano (dias[fecha].listo.descarga = 1, en 🚦 Cómo llegas hoy) ----------
// Mismas series y reps, 15 % menos de peso y 3-4 reps en reserva. Solo ese día: la meta de la próxima vez no cambia
export const MENOS_HOY = 0.15;
const redondear = (n, paso) => Math.round(n / paso) * paso;
// El peso liviano: 15 % menos, redondeado a 0,5 (kg o discos) y siempre al menos 0,5 menos que el de antes
export function pesoLiviano(peso, unidad = 'kg') {
  if (!(peso > 0)) return null;
  return Math.max(0.5, Math.min(redondear(peso * (1 - MENOS_HOY), 0.5), peso - 0.5));
}
export function metaLiviana(fila, ultimo) {
  if (!fila || fila.unidad === 's' || !ultimo) return null;
  const antes = numero(ultimo.peso), u = ultimo.unidad || 'kg', peso = pesoLiviano(antes, u);
  if (peso == null) return null;
  const n = fila.series || 1, reps = repsDe(ultimo.reps).filter((x) => x > 0).slice(0, n);
  while (reps.length && reps.length < n) reps.push(reps[reps.length - 1]);
  return { peso, unidad: u, sube: false, liviano: true, series: reps, reps: reps.length ? Math.max(...reps) : fila.min,
    texto: formatoPeso(peso) + ' ' + u + ' × ' + (reps.length ? reps.join(' ') : fila.min),
    motivo: 'Hoy liviano: ' + Math.round(MENOS_HOY * 100) + ' % menos que ' + formatoPeso(antes) + ' ' + u + ', mismas reps y deja ' + RIR_DESCARGA + ' en reserva. La próxima vez vuelves a tu meta.' };
}
