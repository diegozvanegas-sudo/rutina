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
// Ideas para elegir, por tema (las que ya están en la lista no se vuelven a ofrecer)
export const IDEAS_POR_TEMA = {
  '💪 Cuerpo': [
    'Entreno aunque no tenga ganas',
    'Duermo 7 horas o más',
    'No como basura entre semana',
    'Tomo mis litros de agua',
    'Cero alcohol la noche antes de entrenar o jugar',
    'Me muevo todos los días, aunque sea caminar',
  ],
  '🧠 Mente y foco': [
    'Hago primero lo más importante',
    'Nada de redes la primera hora del día',
    'Termino lo que empiezo',
    'Leo todos los días, aunque sea una página',
    'Celular lejos cuando trabajo o estudio',
    'Me acuesto sin pantallas',
  ],
  '🗣️ Palabra y carácter': [
    'Cumplo lo que prometo, también a mí',
    'Digo la verdad aunque incomode',
    'Llego a tiempo',
    'No hablo mal de nadie a sus espaldas',
    'Cero quejas: si algo no me gusta, lo cambio',
    'Pido perdón rápido cuando me equivoco',
  ],
  '🤝 Relaciones': [
    'Trato con respeto a todos, y exijo respeto',
    'Digo no sin dar explicaciones de más',
    'Escucho sin mirar el celular',
    'Le escribo o llamo a alguien de mi círculo',
    'Agradezco en voz alta',
  ],
  '💰 Plata': [
    'No tomo decisiones de plata con prisa',
    'Anoto todo lo que gasto',
    'Ahorro primero, gasto lo que queda',
    'No compro a crédito lo que no necesito',
  ],
  '🔒 Disciplina': [
    'No cuento mis planes antes de hacerlos',
    'Hago lo difícil cuando no tengo ganas',
    'No negocio conmigo mismo',
    'Reviso el día antes de dormir',
    'Cumplo cada día una promesa que me hago',
    'Hago algo que mi yo de hace un año admiraría',
  ],
};
export const IDEAS_ESTANDARES = Object.values(IDEAS_POR_TEMA).flat();
export function cumplimientoEstandares(est, fechas) {
  const lista = est.estandares || [];
  if (!lista.length) return null;
  const dias = fechas.filter((f) => est.dias[f] && est.dias[f].estandares);
  const hechos = dias.reduce((t, f) => t + lista.filter((s) => est.dias[f].estandares[s.id]).length, 0);
  return { dias: dias.length, fraccion: dias.length ? hechos / (dias.length * lista.length) : 0 };
}
