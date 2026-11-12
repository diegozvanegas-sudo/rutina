// 📆 Plan de 12 semanas: perder grasa y ganar músculo, con gym o sin gym (sin pantalla, para poder probarlo).
// No reemplaza la rutina ni la dieta: les pone fases (base, progresión, descarga, intensificación), revisiones en las
// semanas 1, 4, 8 y 12, y una versión en casa de cada día del gym con peso corporal (barra, paralelas y piso).
// est.plan12 = { inicio, edad, sexo, pesoInicio, pruebas: [{ id, fecha, semana, ...PRUEBAS }], casa: { fecha: { ejId: 'reps' } }, nivel: { ejId: escalón } }
import { e, planDieta } from './estado.js';
import { iso, sumarDias, diasEntre, diaSemana } from './fechas.js';
import { totalPlan, pesos, tendencia, medidasDe } from './dieta.js';

export const SEMANAS_PLAN = 12;
export const plan12 = () => (e().plan12 ??= { inicio: '', edad: 31, sexo: 'H', pesoInicio: null, pruebas: [], casa: {}, nivel: {} });

// ---------- Fases ----------
// rir: repeticiones que te guardas en la última serie (2 = paras cuando te quedan 2 limpias)
export const FASES = [
  { id: 'base', desde: 1, hasta: 4, nombre: 'Base', rir: '2-3',
    gym: 'Técnica limpia y pesos que puedas controlar. Anota todo: estas semanas son tu punto de partida.',
    casa: 'Encuentra tu variante: la más difícil con la que haces el mínimo de reps en todas las series.',
    dieta: 'Come el plan tal cual. Pésate al menos 4 mañanas por semana y mide la cintura cada 2 semanas.' },
  { id: 'progresion', desde: 5, hasta: 8, nombre: 'Progresión', rir: '1-2',
    gym: 'Cada semana, más peso o más reps que la anterior en el ejercicio principal de cada día.',
    casa: 'Cuando llegues al tope de reps en todas las series, pasa a la variante más difícil o ponte la mochila con peso.',
    dieta: 'Haz caso a la revisión de Dieta → Peso cada 2 semanas: es la que decide si mover los carbos.' },
  { id: 'descarga', desde: 9, hasta: 9, nombre: 'Descarga', rir: '3-4',
    gym: 'La mitad de las series, con el mismo peso. No es flojera: es lo que deja que el cuerpo asimile 8 semanas.',
    casa: 'La mitad de las series, variantes más fáciles. Si juegas fútbol, juégalo suave.',
    dieta: 'No bajes comida esta semana ni hagas ajustes: el peso puede subir por agua y es normal.' },
  { id: 'intensificacion', desde: 10, hasta: 12, nombre: 'Intensificación', rir: '0-1',
    gym: 'La última serie de cada ejercicio cerca del fallo (RIR 0-1). Las demás, como siempre.',
    casa: 'Última serie al fallo técnico. Prueba la variante siguiente aunque salgan pocas reps.',
    dieta: 'Los carbos antes y después del entreno no se recortan. Si hay que bajar, máximo 40 g al día y solo en descanso.' },
];
export const FIJO = [
  'Proteína: la de tus planes (unos 2 g por kg). Es lo que protege el músculo mientras bajas de grasa.',
  'Dormir 7 horas o más: sin sueño no hay músculo, por buena que sea la rutina.',
  '8.000 a 10.000 pasos al día. Caminar quema grasa sin quitarle fuerza a las piernas para el fútbol.',
  'Creatina 3-5 g todos los días (está en 💊 Suplementos).',
];

export function semanaPlan(p = plan12(), hoy = iso()) {
  if (!p.inicio || hoy < p.inicio) return null;
  return Math.floor(diasEntre(p.inicio, hoy) / 7) + 1;
}
export const faseDe = (semana) => (semana == null ? null : FASES.find((f) => semana >= f.desde && semana <= f.hasta) || null);
export const proximoLunes = (hoy = iso()) => sumarDias(hoy, diaSemana(hoy) === 1 ? 0 : 8 - diaSemana(hoy));

// ---------- Revisiones: semanas 1, 4, 8 y 12 ----------
export const REVISIONES = [1, 4, 8, 12];
export const PRUEBAS = [
  ['dominadas', 'Dominadas seguidas', 'reps'],
  ['paralelas', 'Fondos en paralelas seguidos', 'reps'],
  ['flexiones', 'Flexiones seguidas', 'reps'],
  ['bulgara', 'Sentadilla búlgara por pierna', 'reps'],
  ['plancha', 'Plancha', 's'],
  ['cintura', 'Cintura (a la altura del ombligo)', 'cm'],
];
export const tocaRevision = (semana) => REVISIONES.includes(semana);
export const pruebaDeSemana = (semana, p = plan12()) => (p.pruebas || []).find((x) => x.semana === semana) || null;
// Diferencia entre la primera prueba y la última, prueba por prueba
export function avancePruebas(p = plan12()) {
  const l = [...(p.pruebas || [])].sort((a, b) => a.semana - b.semana);
  if (l.length < 2) return [];
  const a = l[0], b = l[l.length - 1];
  return PRUEBAS.filter(([k]) => a[k] > 0 && b[k] > 0).map(([k, nombre, unidad]) => ({ k, nombre, unidad, antes: a[k], ahora: b[k], dif: b[k] - a[k] }));
}

// ---------- Números: gasto, comida del plan y peso esperado ----------
// Gasto estimado (Mifflin-St Jeor × 1,6 por 5 días de gym y 2 de fútbol). Es una estimación: la verdad la dice la báscula
export function gastoEstimado({ peso, estatura, edad, sexo }) {
  if (!(peso > 0 && estatura > 0 && edad > 0)) return null;
  const basal = 10 * peso + 6.25 * estatura - 5 * edad + (sexo === 'M' ? -161 : 5);
  return { basal: Math.round(basal), total: Math.round(basal * 1.6) };
}
// Calorías promedio de tus planes en los próximos 7 días (con el gym y el fútbol que tocan cada día)
export function kcalPromedioPlan(hoy = iso()) {
  const al = e().dieta.alimentos, ks = Array.from({ length: 7 }, (_, i) => totalPlan(planDieta(sumarDias(hoy, i)), al).kcal);
  return Math.round(ks.reduce((a, b) => a + b, 0) / 7);
}
// Ritmo sano para bajar grasa sin perder músculo: 0,4 a 0,75 kg por semana (la descarga no cuenta)
export const RITMO = [0.4, 0.75];
export function pesoEsperado(pesoInicio, semana) {
  if (!(pesoInicio > 0) || semana == null) return null;
  const n = Math.min(semana, SEMANAS_PLAN) - (semana > 9 ? 1 : 0); // semanas con déficit hasta hoy
  return { max: pesoInicio - RITMO[0] * n, min: pesoInicio - RITMO[1] * n };
}
export function comoVaPeso(p = plan12(), hoy = iso()) {
  const s = semanaPlan(p, hoy), ahora = tendencia(pesos(e().dias)), esperado = pesoEsperado(p.pesoInicio, s - 1);
  if (!esperado || ahora == null || s < 3) return { estado: 'pronto', ahora, esperado };
  return { estado: ahora > esperado.max + 0.5 ? 'lento' : ahora < esperado.min - 0.5 ? 'rapido' : 'bien', ahora, esperado };
}
export const ultimaCintura = () => { const m = medidasDe(e().dias).filter((x) => x.cintura > 0); return m.length ? m[m.length - 1].cintura : null; };

export function empezarPlan(inicio, p = plan12()) {
  p.inicio = inicio;
  p.pesoInicio = tendencia(pesos(e().dias)) ?? e().dieta?.config?.pesoBase ?? null;
  p.pesoInicio = p.pesoInicio == null ? null : Math.round(p.pesoInicio * 10) / 10;
  return p;
}

// ---------- Sin gym: la misma semana con peso corporal ----------
// Cada ejercicio tiene una escalera de variantes: cuando haces el tope de reps en todas las series, subes un escalón.
// La mochila con libros o botellas sirve de peso cuando la variante más difícil ya se queda corta.
const ej = (id, nombre, series, reps, escalera, nota = '') => ({ id, nombre, series, reps, escalera, nota });
export const CASA = {
  empuje: { nombre: 'Empuje (pecho, hombro, tríceps)', ejercicios: [
    ej('par', 'Fondos en paralelas', 4, '6-12', ['Negativos de 5 s', 'Fondos', 'Fondos con mochila'], 'Baja hasta que el hombro quede a la altura del codo.'),
    ej('flexdec', 'Flexiones', 4, '8-20', ['Inclinadas (manos en silla)', 'Normales', 'Pies en silla', 'Arquero']),
    ej('pike', 'Flexión pica (hombro)', 3, '6-12', ['Pica en el piso', 'Pica con pies en silla', 'Parada de manos contra la pared']),
    ej('diam', 'Flexiones diamante (tríceps)', 3, '8-15', ['Con rodillas', 'Diamante', 'Diamante con pies en silla']),
    ej('abd1', 'Abdomen: elevación de piernas', 3, '10-15', ['Acostado', 'Colgado, rodillas al pecho', 'Colgado, piernas rectas']),
  ] },
  tiron: { nombre: 'Tirón (espalda, bíceps)', ejercicios: [
    ej('dom', 'Dominadas agarre ancho', 4, '5-10', ['Negativas de 5 s', 'Con pie apoyado', 'Dominadas', 'Con mochila']),
    ej('chin', 'Dominadas supinas (bíceps)', 3, '6-12', ['Negativas de 5 s', 'Supinas', 'Supinas con mochila']),
    ej('remo', 'Remo invertido bajo las paralelas', 3, '8-15', ['Cuerpo inclinado, rodillas dobladas', 'Cuerpo recto', 'Pies en silla'], 'Acuéstate bajo las paralelas y lleva el pecho a la barra.'),
    ej('isom', 'Colgado activo', 3, '20-40 s', ['Colgado quieto', 'Hombros abajo y atrás', 'Con una pausa arriba de 10 s']),
    ej('abd2', 'Abdomen: crunch con piernas arriba', 3, '12-20', ['Crunch', 'Crunch con piernas a 90°', 'Bicicleta lenta']),
  ] },
  pierna: { nombre: 'Pierna', ejercicios: [
    ej('bul', 'Sentadilla búlgara', 4, '8-15 por pierna', ['Zancada fija', 'Búlgara (pie atrás en silla)', 'Búlgara con mochila'], 'La rodilla de adelante va en la línea del pie.'),
    ej('sent', 'Sentadilla con pausa de 2 s abajo', 3, '15-25', ['Sentadilla', 'Con pausa', 'Con mochila']),
    ej('zan', 'Zancada hacia atrás', 3, '10-12 por pierna', ['Zancada atrás', 'Con mochila', 'Con pausa abajo']),
    ej('puente', 'Puente de glúteo a una pierna', 3, '10-15 por pierna', ['Dos piernas', 'Una pierna', 'Una pierna, espalda en silla']),
    ej('pant', 'Pantorrilla a una pierna en escalón', 3, '12-20', ['Dos piernas', 'Una pierna', 'Una pierna con mochila']),
    ej('abd3', 'Abdomen: plancha', 3, '30-60 s', ['Rodillas', 'Plancha', 'Plancha con un brazo adelante']),
  ] },
  torso: { nombre: 'Torso completo', ejercicios: [
    ej('dom2', 'Dominadas', 3, '5-10', ['Negativas de 5 s', 'Con pie apoyado', 'Dominadas', 'Con mochila']),
    ej('par2', 'Fondos en paralelas', 3, '6-12', ['Negativos de 5 s', 'Fondos', 'Fondos con mochila']),
    ej('remo2', 'Remo invertido bajo las paralelas', 3, '8-15', ['Rodillas dobladas', 'Cuerpo recto', 'Pies en silla']),
    ej('flex2', 'Flexiones', 3, '8-20', ['Inclinadas', 'Normales', 'Pies en silla', 'Arquero']),
    ej('abd4', 'Abdomen: elevación de piernas colgado', 3, '8-15', ['Rodillas al pecho', 'Piernas rectas a 90°', 'Pies a la barra']),
  ] },
};
// El día del gym que toca y su versión en casa ('calentamiento' de la rutina dice el tipo: torso, pierna, empuje, tiron)
export function tipoCasaDe(fecha = iso()) {
  const d = e().rutina.find((x) => x.id !== 'core' && x.diaSemana === diaSemana(fecha));
  return d && CASA[d.calentamiento] ? d.calentamiento : null;
}
export const sesionCasa = (fecha, p = plan12()) => (p.casa || {})[fecha] || {};
// En la sesión: 'tipo' (empuje, tirón…), las reps de cada ejercicio por su id y 'v:id' = variante con que se hizo
export const casaHecha = (fecha, p = plan12()) => Object.entries(sesionCasa(fecha, p)).some(([k, v]) => k !== 'tipo' && !k.startsWith('v:') && String(v || '').trim());
// Escalón actual de cada ejercicio (p.nivel[id] = índice en la escalera); sin elegir, el segundo si hay, que es la variante "normal"
export const nivelDe = (ejercicio, p = plan12()) => Math.min(ejercicio.escalera.length - 1, (p.nivel ??= {})[ejercicio.id] ?? Math.min(1, ejercicio.escalera.length - 1));
// Lo último anotado de un ejercicio antes de esa fecha
export function ultimoCasa(ejId, fecha = iso(), p = plan12()) {
  const f = Object.keys(p.casa || {}).filter((x) => x < fecha && String(p.casa[x][ejId] || '').trim()).sort().pop();
  return f ? { fecha: f, reps: p.casa[f][ejId] } : null;
}
// ¿Subir de escalón? Si todas las series llegan al tope del rango (ej. "12 12 12 12" en 6-12)
export function tocaSubir(ejercicio, reps) {
  const tope = Number((String(ejercicio.reps).match(/-(\d+)/) || [])[1]), ns = String(reps || '').match(/\d+/g) || [];
  return !!tope && ns.length >= ejercicio.series && ns.slice(0, ejercicio.series).every((n) => Number(n) >= tope);
}
