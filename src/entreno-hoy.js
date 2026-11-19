// 🚦 Antes de entrenar: cómo llegas hoy (sueño, energía, fútbol) y cuánto tiempo tienes. Sin pantalla, para poder probarlo.
// dias[fecha].listo = { sueno: 1-3, energia: 1-3, min?: minutos disponibles }  (1 mal / poco, 2 normal, 3 bien / mucho)
// La pantalla está en src/react/pantallas/GymDia.tsx (AntesDeEntrenar) y las acciones en src/vistas/gym.js
import { PIERNAS, repsDe } from './gym.js';

// Horas dormidas → 1, 2 o 3 (para proponer el sueño si ya lo anotaste en Hoy)
export const suenoDeHoras = (h) => (h == null ? null : h < 6 ? 1 : h < 7 ? 2 : 3);

// ¿Es un día de pierna? La mayoría de sus ejercicios (sin el calentamiento) son de pierna
export function esDiaPierna(dia) {
  const ejs = ((dia && dia.ejercicios) || []).filter((ej) => !ej.calentamiento);
  return ejs.length > 0 && ejs.filter((ej) => PIERNAS.includes(ej.musculo)).length * 2 >= ejs.length;
}

// Lectura del día: full (a buscar récords), normal o suave (mismo peso, sin fallo, una serie menos en lo largo)
// futbol: { ayer, manana } partidos; pierna: si el día es de pierna
export function lecturaHoy({ sueno = null, energia = null, futbol = {}, pierna = false } = {}) {
  const consejos = [];
  if (pierna && futbol.ayer) consejos.push('Jugaste ayer: la pierna todavía está cansada.');
  if (pierna && futbol.manana) consejos.push('Mañana juegas: pierna sin llegar al fallo (deja 2–3 reps) para llegar fresco.');
  if (!pierna && futbol.ayer) consejos.push('Jugaste ayer: el tren superior está bien, pero hidrátate y calienta más.');
  if (sueno == null && energia == null) return consejos.length && pierna ? suave(consejos) : null;
  const s = sueno ?? 2, en = energia ?? 2;
  if (en === 1 || (s === 1 && en <= 2) || (pierna && (futbol.ayer || futbol.manana))) {
    if (s === 1) consejos.unshift('Dormiste poco: la fuerza baja y el riesgo de lesión sube.');
    if (en === 1) consejos.unshift('Llegas sin energía.');
    return suave(consejos);
  }
  if (s === 3 && en === 3) return { nivel: 'full', icono: '🟢', titulo: 'Hoy a full', texto: 'Dormiste bien y tienes energía: es el día para buscar la meta ⬆ y los récords.', consejos };
  return { nivel: 'normal', icono: '🔵', titulo: 'Día normal', texto: 'Sigue la meta de cada ejercicio, con 1–2 reps en reserva.', consejos };
}
const suave = (consejos) => ({ nivel: 'suave', icono: '🟡', titulo: 'Hoy suave', consejos,
  texto: 'Mismo peso de la última vez (no subas), deja 2–3 reps en reserva y, en lo que tenga 3 o más series, haz una menos. Hoy se suma sin romperse.' });

// ---------- ⏱ Versión corta: qué ejercicios caben en los minutos que tienes ----------
// Cada serie ≈ 40 s haciéndola + su descanso (como src/ciclo.js minutosDia); en biserie el descanso se comparte
const HACER = 40, CALENTAR = 5;
// menos: series de menos en cada fila de 2 o más series (nunca baja de 1)
export const seriesCortas = (series, menos) => (series >= 2 ? Math.max(1, series - menos) : series);
function segundosQueFaltan(ej, juntos, regs, menos = 0) {
  let seg = 0;
  for (const f of ej.filas) {
    const faltan = Math.max(0, seriesCortas(Number(f.series) || 0, menos) - repsDe((regs[f.id] || {}).reps).length);
    seg += faltan * (HACER + (juntos ? (Number(f.descanso) || 0) / 2 : Number(f.descanso) || 0));
  }
  return seg;
}
// grupos: [[ej] | [a, b]] en el orden del día (gym.js gruposDia). Devuelve los ids que quedan fuera, los minutos del plan y
// `menos`: cuántas series quitar en cada ejercicio. Un buen recorte quita series antes que músculos: si con el plan
// completo algún músculo del día se queda sin nada, se prueba con 1 serie menos en cada ejercicio (y luego con 2)
export function planCorto(grupos, minutos, regs = {}) {
  const musculosDia = new Set(grupos.flatMap((g) => g.filter((ej) => !ej.calentamiento).map((ej) => ej.musculo)));
  const cubre = (r) => { const fuera = new Set(r.fuera); return new Set(grupos.flatMap((g) => g.filter((ej) => !ej.calentamiento && !fuera.has(ej.id)).map((ej) => ej.musculo))).size; };
  let mejor = null;
  for (const menos of [0, 1, 2]) {
    const r = { ...elegir(grupos, minutos, regs, menos), menos };
    if (!mejor || cubre(r) > cubre(mejor)) mejor = r;
    if (cubre(mejor) >= musculosDia.size) break;
  }
  return { ...mejor, total: elegir(grupos, 9999, regs, 0).total };
}
function elegir(grupos, minutos, regs, menos) {
  const info = grupos.map((g, k) => {
    const juntos = g.length === 2, seg = g.reduce((s, ej) => s + segundosQueFaltan(ej, juntos, regs, menos), 0);
    const empezado = g.some((ej) => ej.filas.some((f) => repsDe((regs[f.id] || {}).reps).length > 0));
    return { g, k, seg, empezado, calent: g.every((ej) => ej.calentamiento), musculos: g.map((ej) => ej.musculo) };
  });
  let libre = Math.max(0, minutos - CALENTAR) * 60;
  const dentro = new Set(), vistos = new Set();
  const tomar = (x) => { dentro.add(x.k); libre -= x.seg; x.musculos.forEach((m) => vistos.add(m)); };
  info.filter((x) => x.empezado).forEach(tomar);
  for (const x of info) if (!dentro.has(x.k) && !x.calent && x.musculos.some((m) => !vistos.has(m)) && x.seg <= libre) tomar(x);
  for (const x of info) if (!dentro.has(x.k) && !x.calent && x.seg <= libre) tomar(x);
  for (const x of info) if (!dentro.has(x.k) && x.seg <= libre) tomar(x);
  const fuera = info.filter((x) => !dentro.has(x.k)).flatMap((x) => x.g.map((ej) => ej.id));
  const usados = info.filter((x) => dentro.has(x.k)).reduce((s, x) => s + x.seg, 0);
  return { fuera, minutos: Math.round(usados / 60) + CALENTAR, total: Math.round(info.reduce((s, x) => s + x.seg, 0) / 60) + CALENTAR };
}

// ---------- 📏 Cada 4 semanas: medidas y foto ----------
export const CADA = 28;
const diasEntre = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000);
// Última fecha con medidas y con foto marcada (dias[fecha].foto = true), y si ya toca
export function chequeoMensual(dias, hoy) {
  const fechas = Object.keys(dias || {}).filter((f) => f <= hoy).sort();
  const ultima = (pred) => { for (let k = fechas.length - 1; k >= 0; k--) if (pred(dias[fechas[k]])) return fechas[k]; return null; };
  const medida = ultima((d) => d && d.medidas && Object.values(d.medidas).some((v) => Number(v) > 0)), foto = ultima((d) => d && d.foto);
  const hace = (f) => (f ? diasEntre(f, hoy) : null);
  const m = hace(medida), ft = hace(foto);
  return { medida: { fecha: medida, dias: m, toca: m == null || m >= CADA }, foto: { fecha: foto, dias: ft, toca: ft == null || ft >= CADA, hoy: ft === 0 } };
}

// ---------- 🎯 Técnica: enlace de video seguro ----------
export const videoValido = (u) => /^https?:\/\/\S+$/i.test(String(u || '').trim());
export const buscarVideo = (nombre) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent('cómo hacer ' + nombre + ' técnica');
