// ✅ Control del día, 🗓️ revisión del domingo y 🍽️ la comida que sabe del gym. Sin pantalla, para poder probarlo; la
// pantalla está en src/react/pantallas/Control.tsx (Hoy, Progreso y Dieta).
//  - Control del día: en una tarjeta, lo que más importa para la meta: peso, comida del plan, gym (o descanso) y pasos
//  - Revisión de la semana: peso contra tu ritmo ideal, cintura, fuerza, cumplimiento de comida y gym, pasos y sueño, y UNA
//    recomendación para la semana que viene (la más importante, no diez)
//  - La comida que sabe del gym: si en la noche no entrenaste un día de entreno, ofrece pasar la comida al plan de descanso;
//    si jugaste un partido largo, sumar carbos en la cena
import { e, planDieta, tipoDieta, sesionesDeFecha, descansaEl, hayFutbol, semanaActual } from './estado.js';
import { iso, sumarDias, lunesDe, semanaDe } from './fechas.js';
import { pesos, medidasDe, cambioCintura, fuerzaDelMes } from './dieta.js';
import { resumenSemana, progresoMes } from './gym.js';
import { rutinaDe, sinDescargas, esDescarga } from './descarga.js';
import { horasSueno } from './registro.js';
import { ritmoIdeal, comoVaRitmo } from './meta-peso.js';

const prom = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const diaDe = (f, est) => ((est.dias || {})[f]) || {};

// ---------- ✅ Control del día ----------
// Comidas del plan de ese día marcadas (dias[fecha].comidas = { 'tipo:i': … })
export function comidasDelDia(fecha, est = e()) {
  const tipo = tipoDieta(fecha), plan = (planDieta(fecha) || { comidas: [] }).comidas.length, c = diaDe(fecha, est).comidas || {};
  return { hechas: Object.keys(c).filter((k) => k.startsWith(tipo + ':')).length, plan, tipo };
}
// El gym de ese día: 'hecho' (anotó series), 'descanso' (lo marcó), 'libre' (no le toca), 'pendiente'
export function gymDelDia(fecha, est = e()) {
  const d = diaDe(fecha, est);
  if (d.entreno) return 'hecho';
  if (descansaEl(fecha) && !d.movido) return 'descanso';
  return sesionesDeFecha(fecha).length ? 'pendiente' : 'libre';
}
// Lo de hoy en 4 cosas: { peso, comidas, gym, pasos, listos (0-4) }. metaPasos: la meta del día (Metas)
export function controlDia(fecha = iso(), est = e(), metaPasos = 8000) {
  const d = diaDe(fecha, est), comidas = comidasDelDia(fecha, est), gym = gymDelDia(fecha, est), pasos = Number((d.metas || {}).pasos) || 0;
  const listo = { peso: Number(d.peso) > 0, comidas: comidas.plan > 0 && comidas.hechas >= comidas.plan, gym: gym !== 'pendiente', pasos: pasos >= metaPasos };
  return { peso: Number(d.peso) || null, comidas, gym, pasos, metaPasos, listo, listos: Object.values(listo).filter(Boolean).length };
}

// ---------- 🗓️ Revisión de la semana ----------
// De lunes a domingo de la semana `sem` del gym (por defecto la actual), comparada con la anterior
export function revisionSemana(sem = semanaActual(), est = e()) {
  const lunes = lunesDe(sem), fechas = Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i)), hoy = iso();
  const hasta = fechas.filter((f) => f <= hoy), lista = pesos(est.dias);
  const esta = lista.filter((x) => x.fecha >= lunes && x.fecha <= fechas[6]), antes = lista.filter((x) => x.fecha >= sumarDias(lunes, -7) && x.fecha < lunes);
  const pEsta = prom(esta.map((x) => x.peso)), pAntes = prom(antes.map((x) => x.peso));
  const cambio = pEsta != null && pAntes != null ? pEsta - pAntes : null;
  const meta = (est.dieta && est.dieta.config && est.dieta.config.meta) || null, bajar = meta != null && pEsta != null ? meta < pEsta : true;
  const r = pEsta ? ritmoIdeal(pEsta) : null, va = bajar && cambio != null && pEsta ? comoVaRitmo(cambio, pEsta) : null;
  const cintura = cambioCintura(medidasDe(est.dias));
  const fuerza = fuerzaDelMes(progresoMes(sinDescargas(est.semanas || {}, est), est.rutina || [], sem));
  // Comida: comidas marcadas de las del plan, en los días que ya pasaron
  let hechas = 0, plan = 0;
  for (const f of hasta) { const c = comidasDelDia(f, est); hechas += Math.min(c.hechas, c.plan); plan += c.plan; }
  const gym = resumenSemana(rutinaDe((est.rutina || []).filter((d) => d.id !== 'core'), sem, est), (est.semanas || {})[sem] || {});
  const pasosL = hasta.map((f) => Number((diaDe(f, est).metas || {}).pasos) || 0).filter((x) => x > 0);
  const suenoL = hasta.map((f) => horasSueno(diaDe(f, est).sueno)).filter((x) => x != null);
  const datos = {
    sem, lunes, domingo: fechas[6], pesajes: esta.length, peso: pEsta, cambio, bajar, ritmo: r, va, cintura, fuerza,
    comida: plan ? hechas / plan : null, comidas: { hechas, plan }, gym: { hechas: gym.hechas, plan: gym.plan, parte: gym.plan ? gym.hechas / gym.plan : null },
    descarga: esDescarga(sem, est), pasos: prom(pasosL), sueno: prom(suenoL),
  };
  return { ...datos, recomendacion: recomendar(datos) };
}
// UNA cosa para la semana que viene, la que más mueve la aguja. Sin adornos
export function recomendar(x) {
  const pct = (v) => Math.round(v * 100) + ' %';
  if (x.pesajes < 4) return { ic: '⚖️', t: 'Pésate 4 mañanas o más', d: 'Esta semana fueron ' + x.pesajes + '. Sin eso no se sabe si el plan funciona, y todo lo demás es adivinar.' };
  if (x.bajar && x.cambio != null && x.cambio > 0.1) {
    if (x.comida != null && x.comida < 0.7) return { ic: '🍽️', t: 'Cumple el plan de comida', d: 'Subiste ' + f1(x.cambio) + ' kg y marcaste el ' + pct(x.comida) + ' de las comidas del plan. Esa es la palanca: llega al 85 % esta semana, sobre todo el fin de semana.' };
    return { ic: '🔍', t: 'Busca lo que no se anota', d: 'Subiste ' + f1(x.cambio) + ' kg aunque marcaste el ' + (x.comida != null ? pct(x.comida) : '—') + ' del plan. Suele ser lo que no está en el plan: bebidas, salsas, picadas y el fin de semana. Si sigue igual, quita 150 kcal de carbos los días de descanso.' };
  }
  if (x.fuerza != null && x.fuerza < -0.03 && x.cambio != null && x.cambio < 0) return { ic: '📉', t: 'Estás perdiendo fuerza', d: 'Baja el déficit 150-200 kcal (carbos antes del gym) y duerme más. Bajar de peso no debería quitarte fuerza.' };
  if (x.va === 'muy-rapido') return { ic: '🐇', t: 'Bajas demasiado rápido', d: 'Más del 1 % por semana se lleva músculo. Come unas 200 kcal más, en carbos alrededor del entreno.' };
  if (!x.descarga && x.gym.parte != null && x.gym.plan && x.gym.parte < 0.7) return { ic: '🏋️', t: 'Cumple los entrenos', d: 'Hiciste ' + x.gym.hechas + ' de ' + x.gym.plan + ' series. Si no te da el tiempo, usa la versión corta: mejor 45 minutos todos los días que 90 algunos.' };
  if (x.sueno != null && x.sueno < 6.5) return { ic: '😴', t: 'Duerme más', d: 'Promedio de ' + f1(x.sueno) + ' h. Con menos de 7 h da más hambre, rindes menos y se pierde más músculo al bajar.' };
  if (x.pasos != null && x.pasos < 7000) return { ic: '🚶', t: 'Camina más', d: 'Promedio de ' + Math.round(x.pasos).toLocaleString('es-CO') + ' pasos. Llegar a 8.000 suma unas 150-200 kcal al día sin cansar las piernas.' };
  if (x.va === 'lento' || x.va === 'quieto') return { ic: '🐢', t: 'Un empujón pequeño', d: 'Vas lento. Antes de recortar comida: 1.500 pasos más al día. Si en 2 semanas sigue igual, quita 150 kcal de carbos los días de descanso.' };
  if (x.va === 'ideal') return { ic: '✅', t: 'Sigue igual', d: 'Bajas a tu ritmo ideal y cumples el plan. No cambies nada: lo difícil es repetirlo.' };
  return { ic: '🎯', t: 'Mantén lo que funciona', d: 'Sigue pesándote, cumpliendo el plan y entrenando. Con una semana más de datos te digo qué ajustar.' };
}
const f1 = (n) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
// ¿Toca mostrar la revisión en Hoy? Domingo y lunes
export const tocaRevision = (hoy = iso()) => [0, 1].includes(new Date(hoy + 'T12:00:00').getDay());
// La semana a revisar: el domingo, la que termina; el lunes, la que acaba de terminar
export const semanaARevisar = (hoy = iso()) => (new Date(hoy + 'T12:00:00').getDay() === 1 ? semanaDe(hoy) - 1 : semanaDe(hoy));

// ---------- 🍽️ La comida que sabe del gym ----------
// hora: la hora del día (0-23). null si no hay nada que sugerir
export function sugerenciaComida(fecha = iso(), hora = new Date().getHours(), est = e()) {
  const d = diaDe(fecha, est), tipo = tipoDieta(fecha), manual = !!d.dieta, p = d.partido || {};
  if (hayFutbol(fecha) && Number(p.minutos) >= 75) return { tipo: 'partido-largo', minutos: Number(p.minutos), texto: 'Jugaste ' + p.minutos + ' minutos: suma 40-60 g de carbos en la cena (una taza de arroz o 2 papas medianas) para recuperar las piernas.' };
  if (!manual && hora >= 19 && !d.entreno && sesionesDeFecha(fecha).length && !hayFutbol(fecha) && !['descanso', 'recarga'].includes(tipo)) {
    return { tipo: 'sin-gym', texto: 'Hoy no entrenaste: si ya no vas a ir, pasa la comida al plan de descanso (menos carbos en la cena).', a: 'descanso' };
  }
  return null;
}
