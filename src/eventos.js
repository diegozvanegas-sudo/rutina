// Eventos que se quieren ver o no perderse (concierto, partido, estreno, cumpleaños), sin pantalla para poder probarlos.
// est.recordatorios.eventos = [{ id, nombre, icono, fecha, hora, lugar, enlace, nota, avisarDias, anual }]
// Sin fecha = "por confirmar": se guarda para averiguar cuándo es.
import { iso, diasEntre } from './fechas.js';

export const AVISAR_DIAS = [1, 3, 7, 14, 30];
const avisar = (x) => (x.avisarDias != null && x.avisarDias !== '' ? Number(x.avisarDias) : 7);

// La próxima vez que pasa: la fecha anotada o, si es cada año, la de este año o la del siguiente
export function proximaFecha(x, hoy = iso()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(x.fecha || '')) return null;
  if (!x.anual || x.fecha >= hoy) return x.fecha;
  const mmdd = x.fecha.slice(5), anio = Number(hoy.slice(0, 4));
  // El 29 de febrero, en los años que no lo tienen, cae el 28
  const en = (a) => a + '-' + (mmdd === '02-29' && !(a % 4 === 0 && (a % 100 !== 0 || a % 400 === 0)) ? '02-28' : mmdd);
  return en(anio) >= hoy ? en(anio) : en(anio + 1);
}

// por-confirmar · hoy · pronto (dentro de los días de aviso) · programado · pasado
export function estadoEvento(x, hoy = iso()) {
  const fecha = proximaFecha(x, hoy);
  if (!fecha) return { estado: 'por-confirmar', fecha: null, faltan: null };
  const faltan = diasEntre(hoy, fecha);
  const estado = faltan < 0 ? 'pasado' : faltan === 0 ? 'hoy' : faltan <= avisar(x) ? 'pronto' : 'programado';
  return { estado, fecha, faltan };
}

export const cuandoFalta = (n) => (n === 0 ? 'hoy' : n === 1 ? 'mañana' : n < 0 ? 'hace ' + -n + (n === -1 ? ' día' : ' días') : 'en ' + n + ' días');

// Los que vienen, del más cercano al más lejano; los por confirmar al final y los pasados aparte
export function ordenarEventos(lista = [], hoy = iso()) {
  const con = lista.map((x, i) => ({ x, i, s: estadoEvento(x, hoy) }));
  const proximos = con.filter(({ s }) => s.fecha && s.estado !== 'pasado').sort((a, b) => a.s.fecha.localeCompare(b.s.fecha) || String(a.x.hora || '').localeCompare(String(b.x.hora || '')));
  return {
    proximos,
    porConfirmar: con.filter(({ s }) => s.estado === 'por-confirmar'),
    pasados: con.filter(({ s }) => s.estado === 'pasado').sort((a, b) => b.s.fecha.localeCompare(a.s.fecha)),
  };
}

// Para el menú y Hoy: los de hoy y los que entraron en su aviso
export const eventosCerca = (lista = [], hoy = iso()) => ordenarEventos(lista, hoy).proximos.filter(({ s }) => s.estado === 'hoy' || s.estado === 'pronto');
