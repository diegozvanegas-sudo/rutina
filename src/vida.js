// Círculo cercano, regla de las 72 horas y estándares personales (sin pantalla, para poder probarlos).
import { iso, diasEntre } from './fechas.js';

// ---------- Círculo cercano: est.circulo = [{ id, nombre, relacion, cadaDias, contactos: [{ fecha, nota }] }] ----------
// Ideas de cada cuánto hablar según la relación (se puede cambiar en cada persona)
export const RELACIONES = { Familia: 7, Pareja: 1, Amigo: 14, Mentor: 30, Trabajo: 21, Otro: 30 };
export function estadoContacto(p, hoy = iso()) {
  const ultimo = (p.contactos || []).reduce((m, c) => (c.fecha > m ? c.fecha : m), '');
  if (!ultimo) return { estado: 'sin-dato', dias: null, ultimo: null };
  const dias = diasEntre(ultimo, hoy), cada = Number(p.cadaDias) || 14;
  return { estado: dias > cada ? 'vencido' : dias >= cada - 1 ? 'pronto' : 'al-dia', dias, ultimo, falta: cada - dias };
}
// Para Recordatorios y Hoy: las personas con quien ya toca hablar
export const pendientesCirculo = (lista = [], hoy = iso()) =>
  lista.map((p) => ({ p, s: estadoContacto(p, hoy) })).filter(({ s }) => s.estado === 'vencido' || s.estado === 'pronto')
    .sort((a, b) => (b.s.dias - (Number(b.p.cadaDias) || 14)) - (a.s.dias - (Number(a.p.cadaDias) || 14)));

// ---------- Regla de las 72 horas: est.finanzas.esperas = [{ id, nombre, monto, motivo, fecha, ts, estado, decidido }] ----------
// estado: 'esperando' | 'comprado' | 'descartado'. Se puede decidir comprar solo después de 72 horas; descartar, siempre.
export const HORAS_ESPERA = 72;
export function estadoEspera(x, ahora = Date.now()) {
  if (x.estado !== 'esperando') return { lista: true, horas: 0 };
  const horas = Math.max(0, HORAS_ESPERA - (ahora - x.ts) / 3600000);
  return { lista: horas <= 0, horas: Math.ceil(horas) };
}
export function resumenEsperas(lista = []) {
  const suma = (estado) => lista.filter((x) => x.estado === estado).reduce((s, x) => s + (Number(x.monto) || 0), 0);
  const decididas = lista.filter((x) => x.estado !== 'esperando').length;
  return { ahorrado: suma('descartado'), comprado: suma('comprado'), esperando: suma('esperando'), decididas,
    descartadas: lista.filter((x) => x.estado === 'descartado').length };
}

// ---------- Estándares: est.estandares = [{ id, texto }], cumplidos en dias[fecha].estandares = { id: true } ----------
export const IDEAS_ESTANDARES = [
  'Entreno aunque no tenga ganas',
  'Hago primero lo más importante',
  'No cuento mis planes antes de hacerlos',
  'Digo no sin dar explicaciones de más',
  'Cero quejas: si algo no me gusta, lo cambio',
  'Cumplo lo que prometo, también a mí',
  'Trato con respeto a todos, y exijo respeto',
  'No tomo decisiones de plata con prisa',
  'Nada de redes la primera hora del día',
];
export function cumplimientoEstandares(est, fechas) {
  const lista = est.estandares || [];
  if (!lista.length) return null;
  const dias = fechas.filter((f) => est.dias[f] && est.dias[f].estandares);
  const hechos = dias.reduce((t, f) => t + lista.filter((s) => est.dias[f].estandares[s.id]).length, 0);
  return { dias: dias.length, fraccion: dias.length ? hechos / (dias.length * lista.length) : 0 };
}
