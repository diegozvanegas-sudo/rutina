// Calendario gregoriano con lo que sí marca la naturaleza: fases de la luna y equinoccios/solsticios (algoritmos de
// Jean Meeus, "Astronomical Algorithms", cap. 27 y 49: error de minutos), más los festivos de Colombia (Ley 51 de 1983).
// Todo se calcula en el celular, sin internet. Los instantes salen en milisegundos y se pasan a la fecha local.
import { iso, desdeIso, sumarDias, diaSemana, diasEntre } from './fechas.js';

const RAD = Math.PI / 180;
const sen = (g) => Math.sin(g * RAD), cos = (g) => Math.cos(g * RAD);
export const MES_SINODICO = 29.530588853; // días de luna nueva a luna nueva
export const ANO_TROPICO = 365.24219; // días de equinoccio a equinoccio
const msDeJD = (jd) => (jd - 2440587.5) * 86400000;
export const diaJuliano = (ms) => ms / 86400000 + 2440587.5;
// El tiempo de los astrónomos (TT) va ~70 s adelante del reloj civil (UTC)
const DELTA_T = 70 / 86400;

export const esBisiesto = (a) => (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0;
export const diasDelAno = (a) => (esBisiesto(a) ? 366 : 365);
export const diaDelAno = (s) => diasEntre(s.slice(0, 4) + '-01-01', s) + 1;
// Semana ISO 8601: la que tiene el jueves manda el año; la semana 1 es la del primer jueves de enero
export function semanaIso(s) {
  const jueves = sumarDias(s, 4 - diaSemana(s));
  return { ano: Number(jueves.slice(0, 4)), semana: Math.floor((diaDelAno(jueves) - 1) / 7) + 1 };
}

// ---------- Luna ----------
// Fase número k (k entero = luna nueva; +0,25 cuarto creciente; +0,5 llena; +0,75 cuarto menguante)
const TERMINOS_NUEVA = [[-0.4072, 0, 0, 1, 0], [0.17241, 1, 1, 0, 0], [0.01608, 0, 0, 2, 0], [0.01039, 0, 0, 0, 2], [0.00739, 1, -1, 1, 0],
  [-0.00514, 1, 1, 1, 0], [0.00208, 2, 2, 0, 0], [-0.00111, 0, 0, 1, -2], [-0.00057, 0, 0, 1, 2], [0.00056, 1, 1, 2, 0], [-0.00042, 0, 0, 3, 0],
  [0.00042, 1, 1, 0, 2], [0.00038, 1, 1, 0, -2], [-0.00024, 1, -1, 2, 0]];
const TERMINOS_LLENA = [[-0.40614, 0, 0, 1, 0], [0.17302, 1, 1, 0, 0], [0.01614, 0, 0, 2, 0], [0.01043, 0, 0, 0, 2], [0.00734, 1, -1, 1, 0],
  [-0.00515, 1, 1, 1, 0], [0.00209, 2, 2, 0, 0], [-0.00111, 0, 0, 1, -2], [-0.00057, 0, 0, 1, 2], [0.00056, 1, 1, 2, 0], [-0.00042, 0, 0, 3, 0],
  [0.00042, 1, 1, 0, 2], [0.00038, 1, 1, 0, -2], [-0.00024, 1, -1, 2, 0]];
const TERMINOS_CUARTO = [[-0.62801, 0, 0, 1, 0], [0.17172, 1, 1, 0, 0], [-0.01183, 1, 1, 1, 0], [0.00862, 0, 0, 2, 0], [0.00804, 0, 0, 0, 2],
  [0.00454, 1, -1, 1, 0], [0.00204, 2, 2, 0, 0], [-0.0018, 0, 0, 1, -2], [-0.0007, 0, 0, 1, 2], [-0.0004, 0, 0, 3, 0], [-0.00034, 1, -1, 2, 0],
  [0.00032, 1, 1, 0, 2], [0.00032, 1, 1, 0, -2], [-0.00028, 2, 2, 1, 0], [0.00027, 1, 1, 2, 0]];
// Cada término: [coeficiente, potencia de E, veces M (Sol), veces M' (Luna), veces F]
export function instanteFase(k) {
  const T = k / 1236.85, f = ((k % 1) + 1) % 1;
  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T * T - 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = 2.5534 + 29.1053567 * k - 0.0000014 * T * T - 0.00000011 * T ** 3;
  const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T * T + 0.00001238 * T ** 3 - 0.000000058 * T ** 4;
  const F = 160.7108 + 390.67050284 * k - 0.0016118 * T * T - 0.00000227 * T ** 3 + 0.000000011 * T ** 4;
  const om = 124.7746 - 1.56375588 * k + 0.0020672 * T * T + 0.00000215 * T ** 3;
  const terminos = f < 0.1 ? TERMINOS_NUEVA : Math.abs(f - 0.5) < 0.1 ? TERMINOS_LLENA : TERMINOS_CUARTO;
  for (const [c, pe, m, mp, ff] of terminos) jde += c * E ** pe * sen(m * M + mp * Mp + ff * F);
  jde -= 0.00017 * sen(om);
  if (terminos === TERMINOS_CUARTO) {
    const W = 0.00306 - 0.00038 * E * cos(M) + 0.00026 * cos(Mp) - 0.00002 * cos(Mp - M) + 0.00002 * cos(Mp + M) + 0.00002 * cos(2 * F);
    jde += f < 0.5 ? W : -W;
  }
  return msDeJD(jde - DELTA_T);
}

export const FASES = [
  { nombre: 'Luna nueva', icono: '🌑' }, { nombre: 'Cuarto creciente', icono: '🌓' },
  { nombre: 'Luna llena', icono: '🌕' }, { nombre: 'Cuarto menguante', icono: '🌗' },
];
// Fases principales entre dos fechas (incluidas): [{ fecha, ms, nombre, icono }]
export function fasesEntre(desde, hasta) {
  const ini = desdeIso(desde).getTime(), fin = desdeIso(sumarDias(hasta, 1)).getTime();
  const k0 = Math.floor(((ini / 86400000 + 2440587.5) - 2451550.09766) / MES_SINODICO) - 1, lista = [];
  for (let k = k0; ; k += 0.25) {
    const ms = instanteFase(k);
    if (ms >= fin) break;
    if (ms >= ini) lista.push({ fecha: iso(new Date(ms)), ms, ...FASES[Math.round((k - Math.floor(k)) * 4) % 4] });
  }
  return lista;
}

const ICONOS_INTERMEDIOS = ['🌒', '🌔', '🌖', '🌘']; // después de nueva, de creciente, de llena y de menguante
// Cómo está la luna ese día (al mediodía): edad en días, % iluminado y su ícono. El día de una fase principal lleva esa fase
export function lunaDelDia(s) {
  const medio = desdeIso(s).setHours(12), k = Math.floor((diaJuliano(medio) - 2451550.09766) / MES_SINODICO);
  let nueva = instanteFase(k), siguiente = instanteFase(k + 1);
  if (nueva > medio) { siguiente = nueva; nueva = instanteFase(k - 1); }
  else if (siguiente <= medio) { nueva = siguiente; siguiente = instanteFase(k + 2); }
  const fraccion = (medio - nueva) / (siguiente - nueva), edad = (medio - nueva) / 86400000;
  const luz = Math.round(((1 - Math.cos(2 * Math.PI * fraccion)) / 2) * 100);
  const hoy = fasesEntre(s, s)[0];
  if (hoy) return { edad, fraccion, luz, nombre: hoy.nombre, icono: hoy.icono, principal: hoy };
  const tramo = Math.min(3, Math.floor(fraccion * 4));
  const nombre = ['Creciente (cada noche más luz)', 'Gibosa creciente', 'Gibosa menguante', 'Menguante (cada noche menos luz)'][tramo];
  return { edad, fraccion, luz, nombre, icono: ICONOS_INTERMEDIOS[tramo], principal: null };
}

// ---------- Equinoccios y solsticios ----------
const MEDIOS = [ // años 2000 a 3000
  [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003],
  [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
];
const MEDIOS_1000 = [ // años 1000 a 2000
  [1721139.29189, 365242.1374, 0.06134, 0.00111, -0.00071],
  [1721233.25401, 365241.72562, -0.05323, 0.00907, 0.00025],
  [1721325.70455, 365242.49558, -0.11677, -0.00297, 0.00074],
  [1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006],
];
const PERIODICOS = [[485, 324.96, 1934.136], [203, 337.23, 32964.467], [199, 342.08, 20.186], [182, 27.85, 445267.112], [156, 73.14, 45036.886],
  [136, 171.52, 22518.443], [77, 222.54, 65928.934], [74, 296.72, 3034.906], [70, 243.58, 9037.513], [58, 119.81, 33718.147], [52, 297.17, 150.678],
  [50, 21.02, 2281.226], [45, 247.54, 29929.562], [44, 325.15, 31555.956], [29, 60.93, 4443.417], [18, 155.12, 67555.328], [17, 288.79, 4562.452],
  [16, 198.04, 62894.029], [14, 199.76, 31436.921], [12, 95.39, 14577.848], [12, 287.11, 31931.756], [12, 320.81, 34777.259], [9, 227.73, 1222.114],
  [8, 15.45, 16859.074]];
export const ESTACIONES = [
  { nombre: 'Equinoccio de marzo', icono: '🌱', nota: 'Día y noche casi iguales en todo el planeta. Empieza la primavera en el norte y el otoño en el sur.' },
  { nombre: 'Solsticio de junio', icono: '☀️', nota: 'El Sol llega a su punto más al norte: día más largo en el norte, más corto en el sur.' },
  { nombre: 'Equinoccio de septiembre', icono: '🍂', nota: 'Día y noche casi iguales otra vez. Otoño en el norte, primavera en el sur.' },
  { nombre: 'Solsticio de diciembre', icono: '❄️', nota: 'El Sol llega a su punto más al sur: noche más larga en el norte, día más largo en el sur.' },
];
export function instanteEstacion(ano, i) {
  const [a, b, c, d, f] = ano >= 2000 ? MEDIOS[i] : MEDIOS_1000[i], Y = ano >= 2000 ? (ano - 2000) / 1000 : ano / 1000;
  const jde0 = a + b * Y + c * Y * Y + d * Y ** 3 + f * Y ** 4, T = (jde0 - 2451545) / 36525;
  const W = 35999.373 * T - 2.47, dl = 1 + 0.0334 * cos(W) + 0.0007 * cos(2 * W);
  const S = PERIODICOS.reduce((s, [A, B, C]) => s + A * cos(B + C * T), 0);
  return msDeJD(jde0 + (0.00001 * S) / dl - DELTA_T);
}
export const estacionesDe = (ano) => ESTACIONES.map((x, i) => { const ms = instanteEstacion(ano, i); return { ...x, ms, fecha: iso(new Date(ms)) }; });

// ---------- Festivos de Colombia ----------
// Domingo de Pascua (algoritmo anónimo gregoriano, "Meeus/Jones/Butcher")
export function pascua(a) {
  const b = a % 19, c = Math.floor(a / 100), d = a % 100, e = Math.floor(c / 4), f = c % 4, g = Math.floor((c + 8) / 25), h = Math.floor((c - g + 1) / 3);
  const i = (19 * b + c - e - h + 15) % 30, k = Math.floor(d / 4), l = d % 4, m = (32 + 2 * f + 2 * k - i - l) % 7, n = Math.floor((b + 11 * i + 22 * m) / 451);
  const mes = Math.floor((i + m - 7 * n + 114) / 31), dia = ((i + m - 7 * n + 114) % 31) + 1;
  return a + '-' + String(mes).padStart(2, '0') + '-' + String(dia).padStart(2, '0');
}
// Ley Emiliani: estos se pasan al lunes siguiente si no caen en lunes
const alLunes = (s) => sumarDias(s, (8 - diaSemana(s)) % 7);
const FIJOS = [['01-01', 'Año Nuevo'], ['05-01', 'Día del Trabajo'], ['07-20', 'Día de la Independencia'], ['08-07', 'Batalla de Boyacá'],
  ['12-08', 'Inmaculada Concepción'], ['12-25', 'Navidad']];
const TRASLADABLES = [['01-06', 'Reyes Magos'], ['03-19', 'San José'], ['06-29', 'San Pedro y San Pablo'], ['08-15', 'Asunción de la Virgen'],
  ['10-12', 'Día de la Diversidad Étnica y Cultural'], ['11-01', 'Todos los Santos'], ['11-11', 'Independencia de Cartagena']];
// Días después de Pascua; los que van con "true" se pasan al lunes
const DE_PASCUA = [[-3, 'Jueves Santo', false], [-2, 'Viernes Santo', false], [39, 'Ascensión del Señor', true], [60, 'Corpus Christi', true],
  [68, 'Sagrado Corazón', true]];
const cacheFestivos = {};
// { "AAAA-MM-DD": nombre }
export function festivosColombia(a) {
  if (cacheFestivos[a]) return cacheFestivos[a];
  const lista = {}, p = pascua(a);
  for (const [md, n] of FIJOS) lista[a + '-' + md] = n;
  for (const [md, n] of TRASLADABLES) lista[alLunes(a + '-' + md)] = n;
  for (const [dias, n, mover] of DE_PASCUA) { const f = sumarDias(p, dias); lista[mover ? alLunes(f) : f] = n; }
  return (cacheFestivos[a] = lista);
}
export const festivo = (s) => festivosColombia(Number(s.slice(0, 4)))[s] || null;
export function proximosFestivos(desde, n = 5) {
  const a = Number(desde.slice(0, 4));
  return [a, a + 1].flatMap((x) => Object.entries(festivosColombia(x))).filter(([f]) => f >= desde).sort(([x], [y]) => x.localeCompare(y)).slice(0, n)
    .map(([fecha, nombre]) => ({ fecha, nombre }));
}

// ---------- Cuadrícula del mes ----------
// Semanas de lunes a domingo que cubren el mes "AAAA-MM": fechas (las de otros meses también, para completar la fila)
export function cuadricula(mes) {
  const primero = mes + '-01', inicio = sumarDias(primero, 1 - diaSemana(primero));
  const [a, m] = mes.split('-').map(Number), ultimo = iso(new Date(a, m, 0));
  const semanas = [];
  for (let f = inicio; f <= ultimo; f = sumarDias(f, 7)) semanas.push(Array.from({ length: 7 }, (_, i) => sumarDias(f, i)));
  return semanas;
}
export function otroMes(mes, n) {
  const [a, m] = mes.split('-').map(Number), d = new Date(a, m - 1 + n, 1);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
