// Reglas del registro del gym (sin pantalla, para poder probarlas): series hechas, colores, peso sugerido y resúmenes.
import { OBJETIVOS } from './datos_iniciales.js';

// "10 9 8" -> [10, 9, 8]. Las reps se guardan siempre como texto; aquí solo se cuentan.
export function repsDe(texto) {
  return (String(texto || '').match(/\d+(?:[.,]\d+)?/g) || []).map((n) => Number(n.replace(',', '.')));
}

// vacio (gris) · falta (amarillo) · completo (verde) · sube (azul: tope del rango en todas las series)
export function estadoFila(fila, reg) {
  const reps = repsDe(reg && reg.reps), hechas = reps.length;
  let color = 'vacio';
  if (hechas) color = hechas < fila.series ? 'falta' : reps.slice(0, fila.series).every((n) => n >= fila.max) ? 'sube' : 'completo';
  return { hechas, plan: fila.series, color };
}

export function numero(v) {
  const n = Number(String(v ?? '').replace(',', '.'));
  return isFinite(n) && String(v ?? '').trim() !== '' ? n : null;
}
const redondear = (n, paso) => Math.round(n / paso) * paso;
export const formatoPeso = (n) => (Math.round(n * 100) / 100).toLocaleString('es-CO');

// Registros de una fila en la semana. El core se anota en el día en que se hace: claves "idFila@idDía".
export function registrosDeFila(registros, fila) {
  return Object.keys(registros || {}).filter((k) => k === fila.id || k.startsWith(fila.id + '@')).sort().map((k) => registros[k]);
}
const conDatos = (r) => r && (repsDe(r.reps).length || String(r.peso || '').trim());

// Último registro de una fila antes de la semana indicada (la semana que se cerró pasa a ser "el último")
export function ultimoRegistro(semanas, fila, semana) {
  const previas = Object.keys(semanas || {}).map(Number).filter((n) => n < semana).sort((a, b) => b - a);
  for (const n of previas) {
    const reg = registrosDeFila(semanas[n], fila).filter(conDatos).pop();
    if (reg) return { ...reg, semana: n };
  }
  return fila.ultimo && (fila.ultimo.reps || fila.ultimo.peso) ? { ...fila.ultimo, semana: null } : null;
}

// Peso para hoy: si la última vez hizo el tope en todas las series, sube 2,5–5 %; si no, el mismo
export function sugerencia(fila, ultimo) {
  if (!ultimo) return null;
  const peso = numero(ultimo.peso), unidad = ultimo.unidad || 'kg';
  if (peso == null) return null;
  if (estadoFila(fila, ultimo).color !== 'sube') return { sube: false, peso, unidad, texto: formatoPeso(peso) + ' ' + unidad };
  if (unidad === 'discos') return { sube: true, peso: peso + 0.5, unidad, texto: formatoPeso(peso + 0.5) + '–' + formatoPeso(peso + 1) + ' discos' };
  const bajo = Math.max(redondear(peso * 1.025, 0.5), peso + 0.5), alto = Math.max(redondear(peso * 1.05, 0.5), bajo);
  return { sube: true, peso: bajo, unidad, texto: formatoPeso(bajo) + (alto > bajo ? '–' + formatoPeso(alto) : '') + ' kg' };
}

// Series de aproximación antes del primer top set
export function aproximacion(peso, unidad = 'kg') {
  if (!peso) return [];
  const paso = unidad === 'discos' ? 0.5 : 2.5;
  return [[0.5, 8], [0.7, 5], [0.85, 2]].map(([p, reps]) => ({ pct: p * 100, peso: Math.max(paso, redondear(peso * p, paso)), reps, unidad }));
}

// Series hechas (sin pasar de las planificadas) por día, total y por músculo en una semana
export function resumenSemana(rutina, registros = {}) {
  const dias = [], musculos = {};
  let hechas = 0, plan = 0;
  for (const d of rutina) {
    let dh = 0, dp = 0;
    for (const ej of d.ejercicios) {
      for (const f of ej.filas) {
        const plan = f.series, h = Math.min(registrosDeFila(registros, f).reduce((s, r) => s + repsDe(r.reps).length, 0), plan);
        dh += h; dp += plan;
        const m = (musculos[ej.musculo] ??= { hechas: 0, plan: 0 });
        m.hechas += h; m.plan += plan;
      }
    }
    dias.push({ id: d.id, nombre: d.nombre, hechas: dh, plan: dp });
    hechas += dh; plan += dp;
  }
  for (const [nombre, m] of Object.entries(musculos)) {
    const [min, max] = OBJETIVOS[nombre] || OBJETIVOS._;
    Object.assign(m, { min, max, estado: m.hechas < min ? 'Bajo' : m.hechas > max ? 'Alto' : 'En rango' });
  }
  return { dias, hechas, plan, musculos };
}
