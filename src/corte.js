// 🔥 Corte agresivo: unas 6 semanas con ~25 % menos que el mantenimiento (0,8-1 % del peso por semana). Recalcula todos los planes
// de comida: la proteína sube a 2,3 g/kg (protege el músculo), la grasa queda en 0,65 g/kg (hormonas) y los carbos son lo que
// sobra de las calorías de cada día. El fútbol come más (el partido gasta 600-900 kcal) y la recarga no se toca.
// Al terminarlo vuelven tus macros de antes y los planes se recalculan con tu peso de ese momento. Sin pantalla.
import { objetivo, recalcular, totalPlan, kcalDeMacros, macrosPorKg } from './dieta.js';
import { sumarDias, diasEntre } from './fechas.js';

// kcal por kg de cada día (con 87 kg: pierna 2.150, torso 2.000, descanso 1.700, fútbol 2.400)
export const CORTE = { kcalKg: { inferior: 24.7, superior: 23, descanso: 19.5, futbol: 27.6 }, protKg: 2.3, grasaKg: 0.65, carbMinKg: 0.7, semanas: 6 };
export const TIPOS_CORTE = Object.keys(CORTE.kcalKg);

// Lo que pide cada día con un peso: { p, c, g, kcal } y los factores por kg para la configuración
// protFija: si tu proteína fija ya es más que 2,3 g/kg, se queda la tuya (nunca baja la proteína)
export function macrosCorte(peso, protFija = 0) {
  const r2 = (n) => Math.round(n * 100) / 100, out = {};
  for (const t of TIPOS_CORTE) {
    const p = Math.max(Math.round(CORTE.protKg * peso), Math.round(protFija || 0)), g = Math.round(CORTE.grasaKg * peso);
    const c = Math.max(Math.round(CORTE.carbMinKg * peso), Math.round((CORTE.kcalKg[t] * peso - 4 * p - 9 * g) / 4));
    out[t] = { p, c, g, kcal: Math.round(kcalDeMacros(p, c, g)), kg: { prot: r2(p / peso), carb: r2(c / peso), grasa: CORTE.grasaKg } };
  }
  return out;
}

// La configuración del corte sobre la de ahora (la recarga y los tipos que no son de corte quedan como están)
function configCorte(config, peso) {
  const m = macrosCorte(peso, config.protFija), c = { ...config, protKg: { ...config.protKg }, carbKg: { ...(config.carbKg || {}) }, grasaKg: { ...(config.grasaKg || {}) } };
  if (!(config.protFija > CORTE.protKg * peso)) delete c.protFija;
  for (const t of TIPOS_CORTE) { c.protKg[t] = m[t].kg.prot; c.carbKg[t] = m[t].kg.carb; c.grasaKg[t] = m[t].kg.grasa; }
  return c;
}

/** Lo que cambiaría: [tipo, { plan, antes, despues }] para los planes que existen y lo que pide cada día.
 *  La grasa de los huevos y la carne no siempre deja llegar a 0,65 g/kg: lo que sobre de calorías se quita de los carbos
 *  (una segunda pasada, sin bajar del mínimo), así cada día queda lo más cerca posible de sus calorías */
export function planCorte(dt, peso) {
  const base = dt.config.carbKg ? dt.config : { ...dt.config, ...macrosPorKg(dt.planes, dt.alimentos, dt.config.pesoBase || peso) };
  const c = configCorte(base, peso), objetivos = macrosCorte(peso, base.protFija), minimo = Math.round(CORTE.carbMinKg * peso);
  const resultados = TIPOS_CORTE.filter((t) => dt.planes[t]).map((t) => {
    let r = recalcular(dt.planes[t], dt.alimentos, objetivo(c, t, peso));
    for (let i = 0; i < 3; i++) {
      const sobra = r.despues.kcal - objetivos[t].kcal, ahora = objetivo(c, t, peso).c;
      if (Math.abs(sobra) <= 40 || (sobra > 0 && ahora <= minimo)) break;
      c.carbKg[t] = Math.round((Math.max(minimo, Math.round(ahora - sobra / 4)) / peso) * 100) / 100;
      r = recalcular(dt.planes[t], dt.alimentos, objetivo(c, t, peso));
    }
    return [t, r];
  });
  return { config: c, resultados, objetivos };
}

/** Empieza el corte: guarda tus macros de antes, cambia la configuración y recalcula los planes. Devuelve lo que cambió */
export function empezarCorte(dt, peso, hoy) {
  const r = planCorte(dt, peso), cfg = dt.config;
  dt.corte = { inicio: hoy, fin: sumarDias(hoy, CORTE.semanas * 7), peso, antes: { protKg: cfg.protKg, carbKg: cfg.carbKg, grasaKg: cfg.grasaKg, protFija: cfg.protFija ?? null } };
  dt.anterior = null; // "Deshacer" de 📋 Planes no aplica: el corte se deshace con "Terminar el corte"
  delete dt.carbAnterior;
  dt.config = { ...r.config, pesoBase: peso };
  for (const [t, x] of r.resultados) dt.planes[t] = x.plan;
  return r;
}

/** Termina el corte: vuelven tus macros de antes y los planes se recalculan con el peso de hoy */
export function terminarCorte(dt, peso) {
  if (!dt.corte) return null;
  const a = dt.corte.antes, c = { ...dt.config, protKg: a.protKg, carbKg: a.carbKg, grasaKg: a.grasaKg };
  if (a.protFija) c.protFija = a.protFija; else delete c.protFija;
  if (!c.carbKg) delete c.carbKg;
  if (!c.grasaKg) delete c.grasaKg;
  dt.anterior = null;
  const resultados = TIPOS_CORTE.filter((t) => dt.planes[t]).map((t) => [t, recalcular(dt.planes[t], dt.alimentos, objetivo(c, t, peso))]);
  for (const [t, x] of resultados) dt.planes[t] = x.plan;
  dt.config = { ...c, pesoBase: peso };
  const fue = dt.corte;
  delete dt.corte;
  return { resultados, fue };
}

/** Cómo va: semana, días que faltan, kg bajados desde el inicio y si ya se pasó de las 6 semanas */
export function estadoCorte(dt, hoy, pesoHoy) {
  const k = dt.corte;
  if (!k) return null;
  const dias = diasEntre(k.inicio, hoy), total = CORTE.semanas * 7;
  return {
    semana: Math.min(CORTE.semanas, Math.floor(dias / 7) + 1), semanas: CORTE.semanas, faltan: Math.max(0, diasEntre(hoy, k.fin)),
    vencido: hoy >= k.fin, parte: Math.min(1, dias / total), bajado: pesoHoy ? Math.round((k.peso - pesoHoy) * 10) / 10 : null,
  };
}

// Promedio de kcal de una semana tipo (2 de pierna, 2 de torso, 2 de fútbol, 1 de descanso) con los planes que haya
export function promedioSemana(planes, alimentos) {
  const cuantos = { inferior: 2, superior: 2, futbol: 2, descanso: 1 };
  let kcal = 0, dias = 0;
  for (const [t, n] of Object.entries(cuantos)) if (planes[t]) { kcal += totalPlan(planes[t], alimentos).kcal * n; dias += n; }
  return dias ? Math.round(kcal / dias) : 0;
}
