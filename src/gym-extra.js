// 🏋️ Más para el día de gym (se agrega sin cambiar lo de antes). Sin pantalla, para poder probarlo; la pantalla está en
// src/react/pantallas/GymExtras.tsx. Lo que hace:
//  1. ⚠️ Pesos que parecen copiados: el mismo peso en ejercicios distintos del día (91 kg en jalón, laterales y tríceps)
//  2. ⚽ Día de fútbol: qué cambia hoy si juegas hoy o mañana
//  3. ⏱ Lo esencial: los ejercicios que no se saltan si vas corto de tiempo (los compuestos), y lo que es "si te queda tiempo"
//  4. 💪 Core en los descansos: la serie de core que falta esta semana, para hacerla mientras descansas
//  5. 📊 Volumen que planea tu rutina por músculo (series por semana) contra el rango recomendado
//  6. 🏆 Hoy contra la última vez: lo que mejoraste y lo que bajó
//  7. ⭐ Cómo te fue: 1 a 5 al terminar, y qué te hace rendir mejor (el sueño)
//  8. 🔥 Aproximación de cada ejercicio grande (no solo del primero)
//  9. 🎯 La pista de técnica de la próxima serie, en el cronómetro del descanso
// 10. 🔁 Alternativas cuando la máquina está ocupada
// Guardado: config.gymPesoOk = { clave: true } (pesos revisados) · dias[fecha].gymSensacion = { n: 1-5, dolor?: true }
import { e, guardar, dia } from './estado.js';
import { iso, sumarDias } from './fechas.js';
import { registrosDeFila, repsDe, numero, mejorSerie } from './gym.js';
import { OBJETIVOS } from './datos_iniciales.js';
import { horasSueno } from './registro.js';

const conDatos = (r) => r && (repsDe(r.reps).length || String(r.peso || '').trim());
const ultimo = (lista) => lista.filter(conDatos).pop() || null;

// ---------- 1. ⚠️ Pesos que parecen copiados ----------
// Por cada ejercicio (sin calentamiento) del día, su peso de hoy o, si aún no anotó, el de la última vez (ultimoDe(fila)).
// Mismo número y unidad en 2 o más ejercicios distintos (de 15 en adelante): parece copiado. Se descarta con "Está bien"
export function pesosCopiados(d, regs, ultimoDe, revisados = {}) {
  const grupos = {};
  for (const ej of (d && d.ejercicios) || []) {
    if (ej.calentamiento || !ej.filas || !ej.filas.length) continue;
    const f = ej.filas[0], hoy = ultimo(registrosDeFila(regs || {}, f)), r = hoy && numero(hoy.peso) != null ? hoy : ultimoDe(f);
    const p = r && numero(r.peso);
    if (p == null || p < 15) continue;
    const k = p + ' ' + (r.unidad || 'kg');
    ((grupos[k] ??= { peso: p, unidad: r.unidad || 'kg', ejercicios: [], hoy: false }).ejercicios).push(ej.nombre);
    if (hoy && numero(hoy.peso) != null) grupos[k].hoy = true;
  }
  return Object.values(grupos).filter((g) => new Set(g.ejercicios).size >= 2).map((g) => ({ ...g, clave: claveCopiado(g) })).filter((g) => !revisados[g.clave]);
}
export const claveCopiado = (g) => g.peso + '|' + g.unidad + '|' + [...new Set(g.ejercicios)].sort().join('+');
export function pesoRevisado(clave) { (e().config.gymPesoOk ??= {})[clave] = true; guardar(); }

// ---------- 2. ⚽ Día de fútbol ----------
// futbol: { hoy, manana, ayer } · pierna: si el día es de pierna. null si no juega cerca
export function consejoFutbol({ hoy = false, manana = false, ayer = false } = {}, pierna = false, conCardio = false) {
  if (!hoy && !manana && !ayer) return null;
  const l = [];
  if (hoy) {
    l.push('Hoy juegas: entrena temprano o mínimo 4 horas antes del partido.');
    if (conCardio) l.push('Sáltate la cinta: el partido es tu cardio de hoy.');
    l.push(pierna ? 'Día de pierna y partido: haz solo los 2 primeros ejercicios, sin llegar al fallo, o cambia el día.' : 'Sin llegar al fallo (deja 2-3 reps): llegas fresco a la cancha.');
    l.push('Come carbos 2-3 horas antes del partido y toma agua desde ya.');
  } else if (manana) {
    if (pierna) l.push('Mañana juegas: pierna sin fallo y con menos series, para llegar con piernas.');
    else l.push('Mañana juegas: el tren superior va normal, pero no te quedes hasta tarde.');
    if (conCardio) l.push('La cinta, suave o corta.');
  } else if (ayer) {
    l.push(pierna ? 'Jugaste ayer: la pierna todavía está cansada, empieza con más calentamiento y baja un poco el peso si hace falta.' : 'Jugaste ayer: hidrátate bien; el tren superior puede ir normal.');
  }
  return { cuando: hoy ? 'hoy' : manana ? 'mañana' : 'ayer', consejos: l };
}

// ---------- 3. ⏱ Lo esencial ----------
const COMPUESTO = /press|remo|jal[oó]n|dominada|sentadilla|peso muerto|hip thrust|fondo|paralela|zancada|prensa|militar|b[uú]lgara|pull ?over|t-?bar|hack/i;
export const esCompuesto = (ej) => !!ej && !ej.calentamiento && (COMPUESTO.test(ej.nombre || '') || (ej.filas || []).some((f) => /top/i.test(f.tipo || '')));
// { esencial: [ejercicios], extra: [ejercicios] } sin el calentamiento. Sin compuestos, los 3 primeros son lo esencial
export function loEsencial(d) {
  const ejs = ((d && d.ejercicios) || []).filter((ej) => !ej.calentamiento);
  let esencial = ejs.filter(esCompuesto);
  if (!esencial.length) esencial = ejs.slice(0, 3);
  return { esencial, extra: ejs.filter((x) => !esencial.includes(x)) };
}

// ---------- 4. 💪 Core en los descansos ----------
// La primera fila de core con series pendientes esta semana: { ej, faltan, hechas, plan } o null
export function corePendiente(rutina, regs) {
  const c = (rutina || []).find((x) => x.id === 'core');
  if (!c) return null;
  let hechas = 0, plan = 0, primero = null;
  for (const ej of c.ejercicios) for (const f of ej.filas) {
    const h = Math.min(registrosDeFila(regs || {}, f).reduce((s, r) => s + repsDe(r.reps).length, 0), f.series);
    hechas += h; plan += f.series;
    if (!primero && h < f.series) primero = { ej, fila: f };
  }
  return primero ? { ...primero, hechas, plan, faltan: plan - hechas } : null;
}

// ---------- 5. 📊 Volumen que planea tu rutina ----------
// Series por semana de cada músculo según la rutina (sin calentamiento ni core) contra el rango de config.objetivos
export function volumenPlan(rutina, objetivos = OBJETIVOS) {
  const m = {};
  for (const d of rutina || []) {
    if (d.id === 'core') continue;
    for (const ej of d.ejercicios) {
      if (ej.calentamiento) continue;
      const x = (m[ej.musculo] ??= { musculo: ej.musculo, series: 0, ejercicios: 0 });
      x.series += ej.filas.reduce((s, f) => s + (Number(f.series) || 0), 0);
      x.ejercicios++;
    }
  }
  return Object.values(m).map((x) => {
    const [min, max] = objetivos[x.musculo] || objetivos._ || OBJETIVOS._;
    return { ...x, min, max, estado: x.series < min ? 'bajo' : x.series > max ? 'alto' : 'bien' };
  }).sort((a, b) => (a.estado === b.estado ? b.series - a.series : a.estado === 'alto' ? -1 : b.estado === 'alto' ? 1 : a.estado === 'bajo' ? -1 : 1));
}

// ---------- 6. 🏆 Hoy contra la última vez ----------
// Por ejercicio (primera fila con datos hoy): la mejor serie de hoy contra la de la última vez (1RM estimado)
export function hoyVsUltima(d, regs, ultimoDe) {
  const out = [];
  for (const ej of (d && d.ejercicios) || []) {
    if (ej.calentamiento) continue;
    const f = ej.filas.find((x) => ultimo(registrosDeFila(regs || {}, x)));
    if (!f) continue;
    const hoy = mejorSerie(ultimo(registrosDeFila(regs, f))), antes = ultimoDe(f) && mejorSerie(ultimoDe(f));
    if (!hoy) continue;
    out.push({ nombre: ej.nombre, hoy, antes, cambio: antes && antes.rm ? (hoy.rm - antes.rm) / antes.rm : null });
  }
  return out;
}

// ---------- 7. ⭐ Cómo te fue ----------
export const sensacionDe = (fecha = iso(), est = e()) => ((est.dias || {})[fecha] || {}).gymSensacion || null;
export function anotarSensacion(k, v, fecha = iso()) {
  const d = dia(fecha), s = (d.gymSensacion ??= {});
  if (k === 'n') { if (s.n === v) delete s.n; else s.n = v; }
  if (k === 'dolor') { if (s.dolor) delete s.dolor; else s.dolor = true; }
  if (!Object.keys(s).length) delete d.gymSensacion;
  guardar();
}
// ¿Rindes mejor cuando duermes 7 h o más? Con 3 entrenos o más de cada lado, la diferencia en el 1 a 5
export function queTeHaceRendir(dias, hoy = iso(), ventana = 90) {
  const con = [], sin = [];
  for (let i = 0; i < ventana; i++) {
    const f = sumarDias(hoy, -i), d = (dias || {})[f], s = d && d.gymSensacion, h = d && horasSueno(d.sueno);
    if (!s || !s.n || h == null) continue;
    (h >= 7 ? con : sin).push(s.n);
  }
  const prom = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  if (con.length < 3 || sin.length < 3) return { listo: false, faltan: Math.max(0, 3 - con.length) + Math.max(0, 3 - sin.length), con: con.length, sin: sin.length };
  return { listo: true, conSueno: prom(con), sinSueno: prom(sin), dif: prom(con) - prom(sin), con: con.length, sin: sin.length };
}

// ---------- 10. 🔁 Alternativas si la máquina está ocupada ----------
const ALT = {
  Pecho: ['Press con mancuernas (plano o inclinado)', 'Cruce en polea', 'Flexiones (con los pies elevados si es fácil)', 'Press en máquina convergente'],
  Espalda: ['Remo con mancuerna a una mano', 'Remo en polea baja', 'Jalón con agarre neutro', 'Dominadas asistidas'],
  Hombro: ['Laterales con mancuernas', 'Laterales en polea', 'Face pull en polea', 'Press militar con mancuernas'],
  Bíceps: ['Curl con mancuernas', 'Curl en polea', 'Curl martillo', 'Curl con barra Z'],
  Tríceps: ['Extensión en polea con cuerda', 'Press francés con mancuerna', 'Fondos en banco', 'Patada de tríceps en polea'],
  Cuádriceps: ['Sentadilla goblet', 'Prensa', 'Zancadas con mancuernas', 'Sentadilla búlgara'],
  Isquios: ['Peso muerto rumano con mancuernas', 'Curl femoral sentado o acostado', 'Puente de isquios en el piso'],
  Glúteo: ['Hip thrust con barra o en máquina', 'Puente de glúteo a una pierna', 'Patada de glúteo en polea'],
  Pantorrilla: ['Elevación de talones de pie en un escalón', 'Elevación de talones sentado', 'Elevación en la prensa'],
  Abdomen: ['Plancha', 'Dead bug', 'Rueda abdominal', 'Elevación de piernas colgado'],
};
// Palabras que dicen qué ejercicio es (sin "con", "de", "en"…), sin tildes y en singular
const palabras = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z]+/).filter((w) => w.length > 3).map((w) => w.replace(/s$/, ''));
// Del mismo músculo y que no sean casi el mismo ejercicio (2 o más palabras en común: "press inclinado mancuernas" ≈ "press con mancuernas")
export function alternativas(ej) {
  if (!ej) return [];
  const propias = new Set(palabras(ej.nombre));
  return (ALT[ej.musculo] || []).filter((x) => palabras(x).filter((w) => propias.has(w)).length < 2).slice(0, 3);
}
