// Registros del día que no son de una sección (sin pantalla, para poder probarlos):
// sueño, partidos de fútbol, cierre de la semana con su foco y los avisos del día (y su archivo de calendario).
import { iso, sumarDias, semanaDe, diaSemana } from './fechas.js';
import { resumenSemana } from './gym.js';

// ---------- Sueño: dias[fecha].sueno = { acoste: 'HH:MM', levante: 'HH:MM', calidad: 1-5 } (fecha = la mañana en que te levantas) ----------
const minutos = (t) => { const m = /^(\d{1,2}):(\d{2})$/.exec(t || ''); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };
export function horasSueno(s) {
  const a = minutos(s && s.acoste), l = minutos(s && s.levante);
  if (a == null || l == null) return null;
  const min = (l - a + 1440) % 1440;
  return min ? Math.round((min / 60) * 10) / 10 : null;
}
export function promedioSueno(dias, fechas) {
  const hs = fechas.map((f) => horasSueno(dias[f] && dias[f].sueno)).filter((h) => h != null);
  return hs.length ? { horas: Math.round((hs.reduce((a, b) => a + b, 0) / hs.length) * 10) / 10, noches: hs.length } : null;
}

// ---------- Fútbol: dias[fecha].partido = { minutos, rpe 1-10, energia 1-5, molestias: [], nota } ----------
export const MOLESTIAS = ['Rodilla', 'Isquios', 'Aductor', 'Cuádriceps', 'Pantorrilla', 'Tobillo', 'Espalda'];
export const hayPartido = (p) => !!p && (Number(p.minutos) > 0 || Number(p.rpe) > 0 || Number(p.energia) > 0);
// Carga de la sesión (Foster): minutos × esfuerzo percibido
export const cargaPartido = (p) => (Number(p.minutos) || 0) * (Number(p.rpe) || 0);

// Pierna hecha el mismo día o el día anterior al partido (días con calentamiento de pierna y al menos una serie anotada)
export function piernaAntes(est, fecha) {
  return [sumarDias(fecha, -1), fecha].some((f) => {
    const d = est.rutina.find((x) => x.diaSemana === diaSemana(f) && x.calentamiento === 'pierna');
    return !!d && resumenSemana([d], est.semanas[semanaDe(f)] || {}).hechas > 0;
  });
}
export function partidos(est) {
  return Object.keys(est.dias || {}).sort().filter((f) => hayPartido(est.dias[f].partido))
    .map((f) => ({ fecha: f, ...est.dias[f].partido, carga: cargaPartido(est.dias[f].partido), pierna: piernaAntes(est, f) }));
}
// Energía promedio con y sin pierna el día antes (solo si hay datos de los dos lados)
export function energiaSegunPierna(lista) {
  const prom = (xs) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);
  const con = lista.filter((p) => p.pierna && p.energia).map((p) => Number(p.energia)), sin = lista.filter((p) => !p.pierna && p.energia).map((p) => Number(p.energia));
  return con.length && sin.length ? { con: prom(con), sin: prom(sin), n: con.length + sin.length } : null;
}

// ---------- Cierre de la semana: est.revisiones[semana] = { fecha, funciono, freno, ley, foco } ----------
// El fin de semana se planea la que viene; de lunes a viernes, la actual
export const semanaObjetivo = (hoy = iso()) => semanaDe(hoy) + (diaSemana(hoy) >= 6 ? 1 : 0);
export const focoDe = (est, semana = semanaDe()) => (est.revisiones && est.revisiones[semana]) || null;

// ---------- Avisos ----------
export const AVISOS = {
  pastilla: { icono: '💊', nombre: 'Pastilla en ayunas', hora: 'pastilla', texto: 'Pastilla de levotiroxina en ayunas. Después empieza la espera del desayuno.' },
  'pre-partido': { icono: '🍚', nombre: 'Comida pre-partido (3 h antes)', hora: 'partido', menos: 180, futbol: true, texto: 'Comida pre-partido: arroz y pollo, poca grasa y poca fibra. Agua todo el día.' },
  platano: { icono: '🍌', nombre: 'Plátano y calentar (1 h antes)', hora: 'partido', menos: 60, futbol: true, texto: 'Plátano y agua. Calienta 10-12 min antes de jugar.' },
  'como-fue': { icono: '⚽', nombre: '¿Cómo te fue? (2 h después)', hora: 'partido', menos: -120, futbol: true, texto: 'Anota cómo te fue en el partido: minutos, esfuerzo, energía y molestias.' },
  dormir: { icono: '🌙', nombre: 'Prepararte para dormir', hora: 'dormir', texto: 'Pantallas fuera y luz baja: en 30 minutos a dormir.' },
  revision: { icono: '📝', nombre: 'Cierre de la semana (domingo)', hora: 'revision', dia: 7, texto: 'Cierra tu semana en Progreso y elige el foco de la próxima.' },
};
export const HORAS_AVISOS = { pastilla: '06:00', partido: '20:00', dormir: '22:30', revision: '19:00' };
const aHora = (min) => { const m = ((min % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
const horaAviso = (a, horas) => aHora(minutos(horas[a.hora] || HORAS_AVISOS[a.hora]) - (a.menos || 0));

// Avisos que tocan una fecha: [{ id, hora, icono, texto }] ordenados por hora
export function avisosDelDia(config, fecha = iso()) {
  const c = config.avisos || {}, horas = { ...HORAS_AVISOS, ...(c.horas || {}) }, apagados = c.apagados || {};
  const futbol = (config.futbol || []).includes(diaSemana(fecha));
  return Object.entries(AVISOS).filter(([id, a]) => !apagados[id] && (!a.futbol || futbol) && (!a.dia || a.dia === diaSemana(fecha)))
    .map(([id, a]) => ({ id, hora: horaAviso(a, horas), icono: a.icono, texto: a.texto })).sort((x, y) => x.hora.localeCompare(y.hora));
}
// Los que hay que mostrar ahora: ya pasó su hora, hace menos de 30 minutos, y no se mostraron hoy
export function avisosPendientes(config, ahora = new Date(), mostrados = {}) {
  const fecha = iso(ahora), min = ahora.getHours() * 60 + ahora.getMinutes();
  return avisosDelDia(config, fecha).filter((a) => { const m = minutos(a.hora); return min >= m && min - m < 30 && !mostrados[fecha + ':' + a.id]; });
}

// Archivo .ics con eventos que se repiten y alarma: el calendario del celular avisa aunque la app esté cerrada
const DIAS_ICS = ['', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
export function calendarioIcs(config, desde = iso()) {
  const c = config.avisos || {}, horas = { ...HORAS_AVISOS, ...(c.horas || {}) }, apagados = c.apagados || {};
  const futbol = (config.futbol || []).filter((n) => n >= 1 && n <= 7);
  const lineas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Rutina//Avisos//ES', 'CALSCALE:GREGORIAN'];
  for (const [id, a] of Object.entries(AVISOS)) {
    if (apagados[id] || (a.futbol && !futbol.length)) continue;
    const dias = a.dia ? [a.dia] : a.futbol ? futbol : null;
    // Primer día que toca desde hoy (para que la primera alarma no quede en el pasado de otra semana)
    let inicio = desde;
    if (dias) while (!dias.includes(diaSemana(inicio))) inicio = sumarDias(inicio, 1);
    const [hh, mm] = horaAviso(a, horas).split(':');
    lineas.push('BEGIN:VEVENT', 'UID:rutina-' + id + '@rutina', 'DTSTAMP:' + inicio.replace(/-/g, '') + 'T000000Z',
      'DTSTART:' + inicio.replace(/-/g, '') + 'T' + hh + mm + '00', 'DURATION:PT10M',
      'RRULE:FREQ=' + (dias ? 'WEEKLY;BYDAY=' + dias.map((n) => DIAS_ICS[n]).join(',') : 'DAILY'),
      'SUMMARY:' + a.icono + ' ' + a.nombre.replace(/ \(.*\)$/, ''), 'DESCRIPTION:' + a.texto.replace(/,/g, '\\,'),
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + a.nombre.replace(/,/g, '\\,'), 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
  }
  lineas.push('END:VCALENDAR');
  return lineas.join('\r\n') + '\r\n';
}
