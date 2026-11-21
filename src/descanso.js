// 🛌 Días de descanso en el gym: marcar un día suelto, pasar su entreno a otro día de la semana, ver los descansos de la
// semana y avisar cuando llevas muchos días seguidos sin uno. Sin pantalla, para poder probarlo; lo de cada fecha
// (sesionesDeFecha, descansaEl, movidoDe) está en estado.js porque lo usan también la comida y el día de hoy.
// Guardado: dias[fecha].descanso = true · dias[fecha].movido = 'AAAA-MM-DD' (la sesión de ese día se hace allá)
import { e, guardar, dia, descansaEl, movidoDe, sesionesDeFecha } from './estado.js';
import { iso, sumarDias, lunesDe, diaSemana } from './fechas.js';
import { juegaEl } from './futbol.js';
import { hayPartido } from './registro.js';

export const fechaDeSesion = (d, sem) => (d && d.diaSemana ? sumarDias(lunesDe(sem), d.diaSemana - 1) : null);

// Marcar o quitar el descanso de una fecha (al quitarlo, la sesión vuelve a su día)
export function alternarDescanso(fecha) {
  const d = dia(fecha);
  if (d.descanso) { delete d.descanso; delete d.movido; } else d.descanso = true;
  guardar();
  return !!d.descanso;
}
// Pasar la sesión de una fecha a otra de la misma semana (ese día queda de descanso). a = '' la deja sin mover
export function moverSesion(fecha, a) {
  const d = dia(fecha);
  d.descanso = true;
  if (a && a !== fecha) d.movido = a; else delete d.movido;
  guardar();
}
// A dónde se puede pasar: los días que quedan de esa semana (desde hoy), menos el mismo
export function destinosPosibles(fecha, hoy = iso()) {
  const lunes = sumarDias(fecha, 1 - diaSemana(fecha)), out = [];
  for (let i = 0; i < 7; i++) { const f = sumarDias(lunes, i); if (f !== fecha && f >= hoy) out.push(f); }
  return out;
}

// Los días de la semana sin gym (ni sesión movida para allá) y los días de fútbol
export function descansosSemana(sem, est = e()) {
  const lunes = lunesDe(sem), out = { descanso: [], futbol: [], marcados: [] };
  for (let i = 0; i < 7; i++) {
    const f = sumarDias(lunes, i);
    if (juegaEl(est.config, f)) out.futbol.push(f);
    if (descansaEl(f)) out.marcados.push(f);
    if (!sesionesDeFecha(f).length && !juegaEl(est.config, f)) out.descanso.push(f);
  }
  return out;
}

// ¿Ese día hubo (o hay) gym o fútbol? Pasado: se anotó entreno o partido, o era día de fútbol. Hoy y adelante: lo que toca
export function diaActivo(f, hoy = iso(), est = e()) {
  const d = (est.dias || {})[f] || {};
  if (d.descanso && !d.movido) return f <= hoy ? !!(d.entreno || hayPartido(d.partido)) : false;
  if (d.entreno || hayPartido(d.partido)) return true;
  if (f < hoy) return !!juegaEl(est.config, f);
  return !!(sesionesDeFecha(f).length || juegaEl(est.config, f));
}
// Días seguidos con gym o fútbol hasta hoy (incluido lo que toca hoy)
export function diasSeguidos(hoy = iso(), est = e()) {
  let n = 0;
  for (let f = hoy; n < 30 && diaActivo(f, hoy, est); f = sumarDias(f, -1)) n++;
  return n;
}
// Aviso: desde 6 días seguidos, sugiere descansar hoy (si aún no entrenas) o mañana
export const SEGUIDOS_AVISO = 6;
export function sugerirDescanso(hoy = iso(), est = e()) {
  const n = diasSeguidos(hoy, est), manana = sumarDias(hoy, 1);
  if (n < SEGUIDOS_AVISO) return null;
  const hoyEntreno = !!((est.dias || {})[hoy] || {}).entreno;
  const cuando = !hoyEntreno && sesionesDeFecha(hoy).length ? hoy : diaActivo(manana, hoy, est) ? manana : null;
  return cuando ? { dias: n, cuando, juegaEse: juegaEl(est.config, cuando) } : null;
}
