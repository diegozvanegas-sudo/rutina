// ⚽ Fútbol en pausa (lesión, viaje, temporada sin jugar): los días de fútbol se conservan y se vuelven a activar al regresar.
// config.futbolPausas = [{ desde: 'AAAA-MM-DD', hasta?: 'AAAA-MM-DD' }]: en pausa desde `desde` hasta el día antes de `hasta`
// (sin `hasta`, hasta que digas que volviste). Se guarda por fechas para que los partidos de antes sigan contando
// en la dieta, el calendario y el historial.
import { diaSemana } from './fechas.js';

const lista = (config) => (config && Array.isArray(config.futbolPausas) ? config.futbolPausas : []);
const cubre = (p, fecha) => p.desde <= fecha && (!p.hasta || fecha < p.hasta);
export const pausaEn = (config, fecha) => lista(config).find((p) => cubre(p, fecha)) || null;
export const futbolEnPausa = (config, fecha) => !!pausaEn(config, fecha);
// ¿Hay partido ese día? Es día de fútbol y no está en pausa
export const juegaEl = (config, fecha) => !futbolEnPausa(config, fecha) && ((config && config.futbol) || []).includes(diaSemana(fecha));

// Pausar desde una fecha (hoy, o ayer si el partido de ayer no se jugó). Si ya hay pausa, solo cambia la vuelta
export function pausarFutbol(config, desde, hasta = null) {
  const actual = pausaEn(config, desde);
  if (actual) { if (hasta) actual.hasta = hasta; else delete actual.hasta; return actual; }
  const p = { desde, ...(hasta && hasta > desde ? { hasta } : {}) };
  (config.futbolPausas ??= []).push(p);
  return p;
}
// Volví a jugar: la pausa termina hoy (si empezó hoy mismo, se borra)
export function reanudarFutbol(config, hoy) {
  const p = pausaEn(config, hoy);
  if (!p) return;
  if (p.desde >= hoy) config.futbolPausas = lista(config).filter((x) => x !== p);
  else p.hasta = hoy;
}
