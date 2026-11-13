// 📆 Ciclo del cliente, la parte de entrenador experto (sin pantalla, para poder probarlo):
// - tipos de ciclo listos (fuerza + hipertrofia, hipertrofia, fuerza, principiante, poco tiempo)
// - carga de cada semana (series × esfuerzo) y la curva de fatiga y rendimiento (modelo fitness-fatiga de Banister):
//   en la descarga la fatiga baja más rápido que la forma, y el rendimiento sube por encima de antes (supercompensación)
// - el tiempo que tiene (días y minutos) contra lo que dura su rutina
// - las series por músculo a la semana contra el rango que sirve (10-20 para hipertrofia)
// - las señales de sus check-ins para adelantar la descarga
// fase = { id, nombre, semanas, rir: '2-1', objetivo, reps?: '8-12', volumen?: % de las series de su rutina }
import { OBJETIVOS } from './datos_iniciales.js';
import { iso, sumarDias } from './fechas.js';

const uid = () => 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
// [nombre, semanas, rir (de la primera a la última semana), reps, volumen %, objetivo]
const F = (nombre, semanas, rir, reps, volumen, objetivo) => ({ nombre, semanas, rir, reps, volumen, objetivo });
const DESCARGA = (semanas = 1) => F('Descarga', semanas, '4', 'las de siempre', 50,
  'La mitad de las series, con el mismo peso y lejos del fallo. Aquí se cobra el trabajo: la fatiga baja y el cuerpo sube su nivel (supercompensación).');

export const TIPOS_CICLO = {
  mixto: { nombre: '💪 Fuerza + músculo', corto: 'Lo mejor para la mayoría: sube la fuerza y el músculo a la vez.', fases: [
    F('Base', 4, '3-2', 'Top 4-7 · back-off 8-12', 90, 'Técnica limpia y pesos controlados. Estas semanas marcan su punto de partida.'),
    F('Progresión', 4, '2-1', 'Top 4-7 · back-off 8-12', 110, 'Cada semana más peso o más reps en el ejercicio principal. Suma 1 serie por músculo si recupera bien.'),
    DESCARGA(),
    F('Intensificación', 3, '1-0', 'Top 3-6 · back-off 6-10', 90, 'Menos series y más pesadas: la última serie de cada ejercicio cerca del fallo.'),
  ] },
  hipertrofia: { nombre: '🏗️ Hipertrofia', corto: 'Prioridad músculo: más series en el rango de 8-15 reps.', fases: [
    F('Acumulación 1', 4, '3-2', '8-15', 100, 'Volumen moderado, conexión con el músculo y rango completo de movimiento.'),
    F('Acumulación 2', 3, '2-1', '8-12', 115, 'Suma 1-2 series por músculo a la semana mientras duerma y rinda bien.'),
    DESCARGA(),
    F('Intensificación', 3, '1-0', '6-10', 100, 'Un poco más de peso y la última serie al fallo técnico en aislados.'),
    DESCARGA(),
  ] },
  fuerza: { nombre: '🏋️ Fuerza', corto: 'Prioridad levantar más en los básicos (sentadilla, press, peso muerto).', fases: [
    F('Base técnica', 3, '3-2', '6-8', 100, 'Mucho trabajo técnico en los básicos con peso que se mueve rápido.'),
    F('Fuerza', 4, '2-1', '4-6', 90, 'Sube el peso cada semana en los básicos; los accesorios en 8-12.'),
    DESCARGA(),
    F('Pico', 3, '1-0', '2-4', 70, 'Pocas series muy pesadas en los básicos. Menos accesorios para llegar fresco.'),
    F('Prueba', 1, '1', '1-3', 40, 'Pocas series y una prueba de fuerza (1RM estimada) en cada básico. Anótala en Valoración.'),
  ] },
  principiante: { nombre: '🌱 Principiante', corto: 'Primer año: aprender los movimientos y subir de a poco.', fases: [
    F('Aprender', 4, '3', '8-12', 80, 'Técnica antes que peso. Lejos del fallo: el progreso llega solo al principio.'),
    F('Progresión', 6, '3-2', '8-12', 100, 'Doble progresión: cuando llegue al tope de reps en todas las series, sube el peso 2,5-5 %.'),
    DESCARGA(),
    F('Prueba', 1, '2', '6-10', 70, 'Repite las pruebas del inicio para ver cuánto mejoró.'),
  ] },
  pocotiempo: { nombre: '⏱️ Poco tiempo', corto: 'Sesiones cortas: básicos, biseries y nada de relleno.', fases: [
    F('Base', 4, '2', '6-10', 80, 'Básicos primero. Biseries de músculos opuestos (pecho + espalda) para ahorrar descanso.'),
    F('Progresión', 4, '2-1', '6-10', 90, 'Más peso o reps cada semana con las mismas series: el tiempo no da para más.'),
    DESCARGA(),
    F('Intensificación', 3, '1-0', '5-8', 80, 'Última serie de cada ejercicio cerca del fallo: cada serie cuenta más.'),
  ] },
};
export const fasesDeTipo = (tipo) => TIPOS_CICLO[tipo].fases.map((x) => ({ id: uid(), ...x }));

// ---------- Cada fase: volumen y esfuerzo ----------
const esDescarga = (fase) => /descarga/i.test(fase.id + ' ' + fase.nombre);
// Los ciclos de antes no tienen volumen: descarga a la mitad, intensificación un poco menos, el resto igual
export function volumenFase(fase) {
  const v = Number(fase.volumen);
  if (v > 0) return v;
  return esDescarga(fase) ? 50 : /intensif/i.test(fase.id + ' ' + fase.nombre) ? 90 : 100;
}
// "2-1" → 2 la primera semana y 1 la última (el esfuerzo sube dentro de la fase); "3-4" en descarga también vale
export function rirSemana(fase, enFase) {
  const n = String(fase.rir || '').match(/\d+(?:[.,]\d+)?/g)?.map((x) => Number(x.replace(',', '.'))) || [2];
  const sem = Number(fase.semanas) || 1, [a, b = a] = n;
  if (esDescarga(fase)) return Math.max(a, b);
  return sem > 1 ? Math.round((a + (b - a) * (enFase - 1) / (sem - 1)) * 10) / 10 : (a + b) / 2;
}
// Color de cada fase: la descarga siempre morada (2); las demás azul, verde y amarillo por turno
export function colorFase(fases, k) {
  if (esDescarga(fases[k])) return 2;
  const otras = fases.slice(0, k).filter((x) => !esDescarga(x)).length;
  return [0, 1, 3][otras % 3];
}

// ---------- La semana a semana: series, esfuerzo, carga, fatiga y rendimiento ----------
// series: las series a la semana de su rutina (el 100 %). Constantes por semana: la forma dura (≈ 6 semanas), la fatiga
// se va rápido (≈ 1 semana) y pesa más en el día a día. Es un modelo para ver la idea, no una medición
const FORMA = 0.85, FATIGA = 0.4, PESO_FATIGA = 1.6;
export function semanasCarga(ciclo, series, hoy = iso()) {
  if (!ciclo) return [];
  const out = [];
  let n = 0, forma = 0, fatiga = 0;
  ciclo.fases.forEach((fase, k) => {
    const sem = Number(fase.semanas) || 0;
    for (let i = 1; i <= sem; i++) {
      n++;
      const desde = sumarDias(ciclo.inicio, (n - 1) * 7), hasta = sumarDias(desde, 6);
      const vol = volumenFase(fase), rir = rirSemana(fase, i), carga = vol / 100 * (1 + 0.15 * (3 - rir));
      forma = forma * FORMA + carga; fatiga = fatiga * FATIGA + carga;
      out.push({ n, k, fase, enFase: i, desde, hasta, actual: hoy >= desde && hoy <= hasta, pasada: hoy > hasta,
        series: Math.round(series * vol / 100), volumen: vol, rir, carga, fatiga, rendimiento: forma - PESO_FATIGA * fatiga, descarga: esDescarga(fase) });
    }
  });
  return out;
}
// La semana de descarga con más subida de rendimiento: la que se marca en el gráfico
export function supercompensacion(semanas) {
  let mejor = null;
  semanas.forEach((w, i) => { if (w.descarga && i > 0) { const sube = w.rendimiento - semanas[i - 1].rendimiento; if (!mejor || sube > mejor.sube) mejor = { n: w.n, sube }; } });
  return mejor;
}

// ---------- Series por músculo a la semana (de su rutina, sin el calentamiento) ----------
export function volumenMusculos(rutina, objetivos = OBJETIVOS, factor = 1) {
  const m = {};
  for (const d of rutina || []) {
    const delDia = {};
    for (const ej of d.ejercicios) {
      if (ej.calentamiento) continue;
      const s = ej.filas.reduce((t, f) => t + (Number(f.series) || 0), 0), k = ej.musculo || 'Otro';
      delDia[k] = (delDia[k] || 0) + s;
    }
    for (const [k, s] of Object.entries(delDia)) { const x = (m[k] ??= { musculo: k, series: 0, maxDia: 0 }); x.series += s; x.maxDia = Math.max(x.maxDia, s); }
  }
  return Object.values(m).map((x) => {
    const [min, max] = objetivos[x.musculo] || objetivos._ || OBJETIVOS._, series = Math.round(x.series * factor);
    return { ...x, series, min, max, estado: series < min ? 'bajo' : series > max ? 'alto' : 'ok', muchoEnUnDia: x.maxDia * factor > 10 };
  }).sort((a, b) => b.series - a.series);
}
export const seriesRutina = (rutina) => (rutina || []).reduce((s, d) => s + d.ejercicios.filter((ej) => !ej.calentamiento).reduce((t, ej) => t + ej.filas.reduce((u, f) => u + (Number(f.series) || 0), 0), 0), 0);

// ---------- Tiempo: cuánto dura cada día y si le cabe ----------
// Cada serie ≈ 40 s haciendo + su descanso; 8 min de calentamiento general. Con biseries el descanso se comparte
const CALENTAR = 8, HACER = 40;
export function minutosDia(dia) {
  let seg = CALENTAR * 60;
  dia.ejercicios.forEach((ej, i) => {
    const anterior = dia.ejercicios[i - 1], juntos = ej.biserie || (anterior && anterior.biserie);
    for (const f of ej.filas) seg += (Number(f.series) || 0) * (HACER + (juntos ? (Number(f.descanso) || 0) / 2 : Number(f.descanso) || 0));
  });
  return Math.round(seg / 60);
}
// La división que mejor reparte las series según los días que puede ir
export const DIVISIONES = {
  2: 'Cuerpo completo ×2: cada músculo dos veces por semana con pocos días.',
  3: 'Cuerpo completo ×3, o torso / pierna / cuerpo completo.',
  4: 'Torso / pierna ×2: la más equilibrada para fuerza y músculo.',
  5: 'Torso / pierna ×2 + un día para lo que más le falte (brazos, hombro, glúteo).',
  6: 'Empuje / tirón / pierna ×2. Solo si duerme bien y recupera: si no, mejor 4 días.',
};
export function tiempoCliente(c) {
  const t = c.tiempo || {}, dias = Number(t.dias) || (c.rutina || []).length || 3, minutos = Number(t.minutos) || 60;
  const porDia = (c.rutina || []).map((d) => ({ id: d.id, nombre: d.nombre, minutos: minutosDia(d) }));
  const largo = porDia.filter((d) => d.minutos > minutos + 5);
  // Series que caben en una sesión con descansos de ≈ 2 min
  const caben = Math.max(0, Math.floor((minutos - CALENTAR) * 60 / (HACER + 120)));
  return { dias, minutos, porDia, largo, caben, cabenSemana: caben * dias, division: DIVISIONES[Math.min(6, Math.max(2, dias))],
    sobranDias: (c.rutina || []).length > dias };
}

// ---------- Señales para adelantar la descarga (de los últimos check-ins) ----------
export function senalesSobrecarga(c) {
  const ult = (c.checkins || []).slice().sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(-2), out = [];
  if (!ult.length) return out;
  const u = ult[ult.length - 1], dos = ult.length === 2;
  if (u.sueno > 0 && u.sueno <= 2) out.push('Durmió mal (' + u.sueno + '/5)' + (dos && ult[0].sueno > 0 && ult[0].sueno <= 2 ? ' dos semanas seguidas' : ''));
  if (u.energia > 0 && u.energia <= 2) out.push('Energía baja (' + u.energia + '/5)' + (dos && ult[0].energia > 0 && ult[0].energia <= 2 ? ' dos semanas seguidas' : ''));
  if (dos && u.energia > 0 && ult[0].energia > 0 && u.energia <= ult[0].energia - 2) out.push('La energía cayó de ' + ult[0].energia + ' a ' + u.energia);
  if (/dolor|molest|lesi|duele/i.test(u.nota || '')) out.push('Contó una molestia: «' + String(u.nota).slice(0, 60) + '»');
  return out;
}
// Lo que dice el gráfico, en palabras, para la semana actual (o la primera si aún no empieza)
export function lecturaSemana(semanas) {
  const w = semanas.find((x) => x.actual) || (semanas.length && semanas[0].desde > iso() ? semanas[0] : null);
  if (!w) return null;
  const sig = semanas[semanas.indexOf(w) + 1];
  const texto = w.descarga ? 'Semana de descarga: baja la fatiga y sube el rendimiento. No la saltes ni la "aproveche" para entrenar más.'
    : sig && sig.descarga ? 'Última semana antes de la descarga: la fatiga está en lo más alto, es normal que se sienta cansado.'
    : w.enFase === 1 ? 'Empieza la fase ' + w.fase.nombre + ': los primeros días se ajustan los pesos.'
    : 'Va sumando carga: cada semana un poco más que la anterior.';
  return { w, texto };
}
