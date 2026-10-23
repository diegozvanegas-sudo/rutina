// Fechas locales en texto "AAAA-MM-DD" (así se guardan los días) y semanas que empiezan el lunes.

export const SEMANA_1 = '2026-10-12'; // lunes

const dosDig = (n) => String(n).padStart(2, '0');

export function iso(d = new Date()) {
  return d.getFullYear() + '-' + dosDig(d.getMonth() + 1) + '-' + dosDig(d.getDate());
}
export function desdeIso(s) {
  const [a, m, d] = s.split('-').map(Number);
  return new Date(a, m - 1, d);
}
export function sumarDias(s, n) {
  const d = desdeIso(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}
// Días enteros entre dos fechas (mediodía para no tropezar con cambios de hora)
export function diasEntre(a, b) {
  return Math.round((desdeIso(b).setHours(12) - desdeIso(a).setHours(12)) / 86400000);
}
export function semanaDe(s = iso()) {
  return Math.floor(diasEntre(SEMANA_1, s) / 7) + 1;
}
export function lunesDe(semana) {
  return sumarDias(SEMANA_1, (semana - 1) * 7);
}
// 1 = lunes … 7 = domingo
export function diaSemana(s = iso()) {
  return desdeIso(s).getDay() || 7;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
export function fechaCorta(s) {
  const d = desdeIso(s);
  return d.getDate() + ' ' + MESES[d.getMonth()];
}
export function fechaLarga(s) {
  const d = desdeIso(s);
  return DIAS[d.getDay()] + ' ' + d.getDate() + ' de ' + MESES[d.getMonth()];
}
export function hora(ts = Date.now()) {
  const d = new Date(ts);
  return dosDig(d.getHours()) + ':' + dosDig(d.getMinutes());
}
export function reloj(seg) {
  seg = Math.max(0, Math.round(seg));
  const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
  return (h ? h + ':' + dosDig(m) : m) + ':' + dosDig(s);
}
