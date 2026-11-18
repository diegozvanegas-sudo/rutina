// 🌱 Mi vida: leer tu vida completa y mejorar 1 % al día (sin pantalla, para poder probarlo). La pantalla está en
// react/pantallas/MiVida.tsx y las acciones en vistas/mivida.js.
//   · Ánimo y energía del día (1 a 5) y una nota: est.dias[f].animo = { animo, energia, nota }
//   · Trabajo e ingresos: est.dias[f].trabajo = { minutos, acciones: { postulacion: n, … } }
//   · Rueda de la vida cada 3 meses: est.rueda = [{ fecha, notas: { salud: 1-10, … } }]
//   · Diario de decisiones: est.decisiones = [{ id, fecha, texto, espero, confianza, revisar, resultado, salio }]
//   · Tu año en cuadritos, tu vida en semanas (est.vida.nacimiento) y la curva del 1 %
import { e, mananaCompleta, habitosDe, avanceMetas } from './estado.js';
import { iso, sumarDias, diasEntre, diaSemana, fechaCorta } from './fechas.js';
import { horasSueno } from './registro.js';
import { puntajeDia, rango } from './progreso.js';
import { compararGrupos } from './mejora.js';

const promedio = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const f1 = (n) => String(Math.round(n * 10) / 10).replace('.', ',');

// ---------- 😊 Ánimo y energía ----------
export const animoDe = (f, est = e()) => ((est.dias[f] || {}).animo) || {};
export const CARAS = ['', '😞', '😕', '😐', '🙂', '😄'];
export function resumenAnimo(fechas, est = e()) {
  const a = fechas.map((f) => animoDe(f, est).animo).filter((x) => x > 0), en = fechas.map((f) => animoDe(f, est).energia).filter((x) => x > 0);
  return { animo: promedio(a), energia: promedio(en), dias: a.length };
}

// ---------- 💼 Trabajo e ingresos ----------
export const ACCIONES_INGRESO = [
  ['postulacion', '📨', 'Postulación'], ['contacto', '🤝', 'Contacto o cliente nuevo'], ['propuesta', '📄', 'Propuesta o cotización'],
  ['venta', '💵', 'Venta o cobro'], ['entrevista', '🎤', 'Entrevista o reunión'], ['aprender', '🛠️', 'Habilidad que paga'],
];
export const META_TRABAJO = 120; // minutos de trabajo profundo al día
export const trabajoDe = (f, est = e()) => ((est.dias[f] || {}).trabajo) || {};
export const accionesDe = (t) => Object.values(t.acciones || {}).reduce((s, n) => s + (Number(n) || 0), 0);
export function resumenTrabajo(fechas, est = e()) {
  const ts = fechas.map((f) => trabajoDe(f, est)), minutos = ts.reduce((s, t) => s + (Number(t.minutos) || 0), 0);
  const porTipo = Object.fromEntries(ACCIONES_INGRESO.map(([k]) => [k, ts.reduce((s, t) => s + (Number((t.acciones || {})[k]) || 0), 0)]));
  return { minutos, horas: minutos / 60, acciones: Object.values(porTipo).reduce((a, b) => a + b, 0), porTipo, dias: ts.filter((t) => t.minutos > 0 || accionesDe(t) > 0).length };
}

// ---------- 🎡 Rueda de la vida ----------
export const AREAS = [
  ['salud', '💪', 'Salud y cuerpo'], ['dinero', '💰', 'Dinero'], ['trabajo', '💼', 'Trabajo y carrera'], ['pareja', '❤️', 'Pareja'],
  ['amigos', '🫂', 'Amigos'], ['familia', '🏡', 'Familia'], ['aprender', '🎓', 'Aprender y crecer'], ['diversion', '🎉', 'Diversión y descanso'],
];
// Un experimento de 7 días para subir cada área (uno solo, pequeño y medible)
export const IDEAS_AREA = {
  salud: 'Caminar 20 minutos después de almorzar todos los días',
  dinero: 'Anotar cada gasto el mismo día durante 7 días',
  trabajo: '90 minutos de trabajo profundo antes de mirar el celular',
  pareja: '20 minutos al día sin celular con mi pareja (o salir a conocer gente 2 veces)',
  amigos: 'Escribirle o llamar a un amigo distinto cada día',
  familia: 'Llamar o visitar a alguien de mi familia cada día',
  aprender: '30 minutos de estudio antes de cualquier pantalla',
  diversion: 'Una hora al día de algo que disfruto, sin culpa y sin celular',
};
export const CADA_RUEDA = 90; // días entre una rueda y la siguiente
export const ruedas = (est = e()) => (est.rueda ??= []);
export const ruedaActual = (est = e()) => ruedas(est)[ruedas(est).length - 1] || null;
export const ruedaAnterior = (est = e()) => ruedas(est)[ruedas(est).length - 2] || null;
export function ruedaToca(hoy = iso(), est = e()) {
  const r = ruedaActual(est);
  return !r || diasEntre(r.fecha, hoy) >= CADA_RUEDA;
}
// La rueda de hoy (para llenarla): la de hoy si ya existe, o una nueva con las notas de la anterior
export function ruedaDeHoy(hoy = iso(), est = e()) {
  const r = ruedaActual(est);
  if (r && r.fecha === hoy) return r;
  const nueva = { fecha: hoy, notas: {} };
  ruedas(est).push(nueva);
  return nueva;
}
// El área más baja (en un empate, la primera de la lista); null si la rueda no está completa
export function areaMasBaja(r) {
  if (!r || AREAS.some(([k]) => !(r.notas[k] > 0))) return null;
  return AREAS.map(([k]) => k).reduce((a, b) => (r.notas[b] < r.notas[a] ? b : a));
}
export const promedioRueda = (r) => (r ? promedio(AREAS.map(([k]) => r.notas[k]).filter((x) => x > 0)) : null);

// ---------- ⚖️ Diario de decisiones ----------
export const decisiones = (est = e()) => (est.decisiones ??= []);
export const REVISAR_EN = 90;
export function nuevaDecision({ texto, espero = '', confianza = 70, dias = REVISAR_EN }, hoy = iso(), est = e()) {
  const d = { id: 'd' + Date.now().toString(36), fecha: hoy, texto, espero, confianza: Number(confianza) || 70, revisar: sumarDias(hoy, Number(dias) || REVISAR_EN), resultado: '', salio: '' };
  decisiones(est).push(d);
  return d;
}
export const porRevisar = (hoy = iso(), est = e()) => decisiones(est).filter((d) => !d.salio && d.revisar <= hoy);
// ¿Qué tan bien decides? De las revisadas: cuántas salieron como esperabas y si tu confianza va con tus aciertos
export function criterio(est = e()) {
  const hechas = decisiones(est).filter((d) => d.salio);
  if (!hechas.length) return null;
  const punto = (d) => (d.salio === 'si' ? 1 : d.salio === 'parcial' ? 0.5 : 0);
  const aciertos = promedio(hechas.map(punto)), confianza = promedio(hechas.map((d) => d.confianza / 100));
  return { revisadas: hechas.length, aciertos, confianza, sobre: confianza - aciertos > 0.15, bajo: aciertos - confianza > 0.15 };
}

// ---------- 🗓️ Tu año en cuadritos ----------
// 53 columnas de lunes a domingo hasta hoy; medida 'puntaje' (0-100) o 'animo' (1-5)
export function anio(medida = 'puntaje', hoy = iso(), est = e()) {
  const lunesHoy = sumarDias(hoy, 1 - diaSemana(hoy)), semanas = [];
  const valor = (f) => {
    if (medida === 'animo') { const a = animoDe(f, est).animo; return a > 0 ? (a - 1) / 4 : null; }
    const p = est.dias[f] ? puntajeDia(f) : null;
    return p ? p.total / 100 : null;
  };
  const texto = (f) => {
    if (medida === 'animo') { const a = animoDe(f, est); return a.animo ? 'ánimo ' + a.animo + '/5' + (a.nota ? ' · ' + a.nota : '') : 'sin datos'; }
    const p = est.dias[f] ? puntajeDia(f) : null;
    return p ? p.total + '/100' : 'sin datos';
  };
  for (let s = 52; s >= 0; s--) {
    const lunes = sumarDias(lunesHoy, -7 * s);
    semanas.push(Array.from({ length: 7 }, (_, k) => {
      const f = sumarDias(lunes, k);
      return f > hoy ? null : { f, v: valor(f), tip: fechaCorta(f) + ': ' + texto(f) };
    }));
  }
  const conDatos = semanas.flat().filter((x) => x && x.v != null);
  return { semanas, dias: conDatos.length, promedio: promedio(conDatos.map((x) => x.v)) };
}
// Los mejores y los peores meses (por puntaje promedio, con al menos 7 días anotados)
export function meses(hoy = iso(), est = e()) {
  const por = {};
  for (const f of Object.keys(est.dias)) {
    if (f > hoy || diasEntre(f, hoy) > 365) continue;
    const p = puntajeDia(f);
    if (p) (por[f.slice(0, 7)] ??= []).push(p.total);
  }
  return Object.entries(por).filter(([, xs]) => xs.length >= 7).map(([m, xs]) => ({ mes: m, puntaje: promedio(xs), dias: xs.length })).sort((a, b) => a.mes.localeCompare(b.mes));
}

// ---------- ⏳ Tu vida en semanas ----------
export const ANIOS_VIDA = 90;
export function vidaEnSemanas(nacimiento, hoy = iso(), anios = ANIOS_VIDA) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nacimiento || '') || nacimiento > hoy) return null;
  const total = anios * 52, vividas = Math.min(total, Math.floor(diasEntre(nacimiento, hoy) / 7));
  // Años cumplidos: se suma uno el día del cumpleaños
  const edad = Number(hoy.slice(0, 4)) - Number(nacimiento.slice(0, 4)) - (hoy.slice(5) < nacimiento.slice(5) ? 1 : 0);
  return { total, vividas, quedan: total - vividas, edad, fraccion: vividas / total };
}

// ---------- 📈 La curva del 1 % ----------
export const curvaUno = (dias, pct = 0.01) => (1 + pct) ** dias;
// Tu avance real: el puntaje de tus primeros 30 días anotados frente a los últimos 30
export function tuCurva(hoy = iso(), est = e()) {
  const fs = Object.keys(est.dias).filter((f) => f <= hoy).sort(), con = fs.map((f) => [f, puntajeDia(f)]).filter(([, p]) => p);
  if (con.length < 20) return { listo: false, dias: con.length };
  const n = Math.min(30, Math.floor(con.length / 2)), inicio = promedio(con.slice(0, n).map(([, p]) => p.total)), ahora = promedio(con.slice(-n).map(([, p]) => p.total));
  const dias = Math.max(1, diasEntre(con[0][0], con[con.length - 1][0]));
  // El ritmo diario compuesto que te llevó de un promedio al otro
  const diario = inicio > 0 ? (ahora / inicio) ** (1 / dias) - 1 : null;
  return { listo: true, dias: con.length, desde: con[0][0], inicio, ahora, n, diario, cambio: inicio > 0 ? ahora / inicio - 1 : null };
}

// ---------- 🔬 Qué te funciona para el ánimo ----------
// Igual que "Qué te funciona" (mejora.js), pero lo que se mide es cómo te sientes. Con 5 días de cada lado; 0,3 puntos ya se notan
export function queTeSube(hoy = iso(), est = e()) {
  const dias = est.dias, fs = rango(90, hoy).filter((f) => dias[f] && animoDe(f, est).animo > 0);
  const animo = (f) => animoDe(f, est).animo, energia = (f) => animoDe(f, est).energia || null;
  const grupo = (selec, cond, valor) => compararGrupos(fs.filter(selec).map((f) => ({ cond: cond(f), valor: valor(f) })).filter((x) => x.valor != null), 5, 0.3);
  const durmio = (f) => horasSueno(dias[f].sueno), conSueno = (f) => durmio(f) != null;
  const entreno = (f) => !!(dias[f].entreno && dias[f].entreno.inicio) || Number((dias[f].partido || {}).minutos) > 0;
  const meta = est.config.metas || {}, pantalla = (f) => (dias[f].metas || {}).pantalla, conPantalla = (f) => pantalla(f) != null && meta.pantalla > 0;
  const trabajo = (f) => Number(trabajoDe(f, est).minutos) || 0;
  const filas = [
    { titulo: 'Dormir 7 horas o más', medida: 'ánimo', r: grupo(conSueno, (f) => durmio(f) >= 7, animo) },
    { titulo: 'Dormir 7 horas o más', medida: 'energía', r: grupo(conSueno, (f) => durmio(f) >= 7, energia) },
    { titulo: 'Entrenar o jugar ese día', medida: 'ánimo', r: grupo(() => true, entreno, animo) },
    { titulo: 'Completar la mañana', medida: 'ánimo', r: grupo((f) => habitosDe(f).length > 0, mananaCompleta, animo) },
    { titulo: 'Quedarte dentro de tu meta de pantalla', medida: 'ánimo', r: grupo(conPantalla, (f) => pantalla(f) <= meta.pantalla, animo) },
    { titulo: META_TRABAJO / 60 + ' h o más de trabajo profundo', medida: 'ánimo', r: grupo(() => true, (f) => trabajo(f) >= META_TRABAJO, animo) },
    { titulo: 'Cumplir 80 % o más de tus metas', medida: 'ánimo', r: grupo((f) => avanceMetas(f).total != null, (f) => avanceMetas(f).total >= 0.8, animo) },
  ];
  return { frases: filas.filter((x) => x.r).map((x) => ({ ...x, escala: 5 })), dias: fs.length };
}

// ---------- 🤖 Lo de Mi vida para la revisión con IA (va al final de promptSemanal) ----------
export function lineasVida(hoy = iso(), est = e()) {
  const sem = rango(7, hoy), antes = rango(28, sumarDias(hoy, -7)), a = resumenAnimo(sem, est), b = resumenAnimo(antes, est);
  const t = resumenTrabajo(sem, est), r = ruedaActual(est), baja = areaMasBaja(r), c = criterio(est), pend = porRevisar(hoy, est);
  const notas = sem.map((f) => [f, animoDe(f, est).nota]).filter(([, n]) => n);
  const lineas = ['', '## Ánimo, trabajo y vida'];
  lineas.push(a.dias ? '- Ánimo esta semana: ' + f1(a.animo) + '/5' + (a.energia ? ', energía ' + f1(a.energia) + '/5' : '') + ' (' + a.dias + ' días)' + (b.dias ? ' · las 4 semanas anteriores: ' + f1(b.animo) + '/5' : '') : '- Ánimo: no lo anoté esta semana');
  if (notas.length) lineas.push('- Lo que marcó mis días: ' + notas.map(([f, n]) => fechaCorta(f) + ': ' + n).join(' · '));
  lineas.push('- Trabajo profundo: ' + f1(t.horas) + ' h en 7 días · acciones hacia el ingreso: ' + t.acciones + (t.acciones ? ' (' + ACCIONES_INGRESO.filter(([k]) => t.porTipo[k]).map(([k, , n]) => n.toLowerCase() + ' ' + t.porTipo[k]).join(', ') + ')' : ''));
  if (r) lineas.push('- Rueda de la vida (' + r.fecha + '): ' + AREAS.filter(([k]) => r.notas[k] > 0).map(([k, , n]) => n + ' ' + r.notas[k]).join(', ') + (baja ? ' · la más baja: ' + AREAS.find(([k]) => k === baja)[2] : ''));
  if (c) lineas.push('- Decisiones revisadas: ' + c.revisadas + ', salieron como esperaba el ' + Math.round(c.aciertos * 100) + ' % con una confianza promedio del ' + Math.round(c.confianza * 100) + ' %');
  if (pend.length) lineas.push('- Decisiones por revisar: ' + pend.map((d) => d.texto).join(' · '));
  lineas.push('', 'Además de lo de arriba: 7. Mira mi ánimo, mi trabajo y el área más baja de mi rueda. ¿Qué es lo que más me está frenando en la vida y cuál es el 1 % que haría esta semana para mejorarlo?');
  return lineas;
}
