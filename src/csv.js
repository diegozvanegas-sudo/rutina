// Exportar a CSV (separado por ";" para que Excel en español lo abra en columnas; Google Sheets también lo detecta).
// Las reps van con "·" como en la hoja: así nunca se convierten en fecha.
import { estadoFila, repsDe } from './gym.js';
import { lunesDe, hora } from './fechas.js';

const celda = (v) => {
  const s = String(v ?? '');
  return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const tabla = (filas) => '﻿' + filas.map((f) => f.map(celda).join(';')).join('\r\n') + '\r\n';
const repsTexto = (r) => repsDe(r).join(' · ');

export function csvGym(estado) {
  const filas = [['Semana', 'Lunes', 'Día', 'Ejercicio', 'Músculo', 'Tipo', 'Esquema', 'Peso', 'Unidad', 'Reps', 'Hechas', 'Series', 'Estado']];
  const porId = {}, nombreDia = {};
  for (const d of estado.rutina) {
    nombreDia[d.id] = d.nombre;
    for (const ej of d.ejercicios) for (const f of ej.filas) porId[f.id] = { d, ej, f };
  }
  const ESTADO = { vacio: '', falta: 'Faltan series', completo: 'Completo', sube: 'Sube peso' };
  for (const sem of Object.keys(estado.semanas).map(Number).sort((a, b) => a - b)) {
    const regs = estado.semanas[sem];
    // En el orden de la rutina; el core lleva el día en que se hizo ("core-1-1@d3")
    const claves = Object.keys(regs).filter((k) => porId[k.split('@')[0]])
      .sort((a, b) => Object.keys(porId).indexOf(a.split('@')[0]) - Object.keys(porId).indexOf(b.split('@')[0]) || a.localeCompare(b));
    for (const k of claves) {
      const r = regs[k], { d, ej, f } = porId[k.split('@')[0]], est = estadoFila(f, r);
      if (!est.hechas && !String(r.peso || '').trim()) continue;
      const dia = k.includes('@') ? nombreDia[k.split('@')[1]] + ' (core)' : d.nombre;
      filas.push([sem, lunesDe(sem), dia, ej.nombre, ej.musculo, f.tipo, f.esquema, r.peso || '', r.unidad || 'kg', repsTexto(r.reps), est.hechas, est.plan, ESTADO[est.color]]);
    }
  }
  return tabla(filas);
}

export function csvDias(estado, avance) {
  const habitos = estado.habitos;
  const filas = [['Fecha', ...habitos.map((h) => h.nombre), 'Gratitud', 'Agua (ml)', 'Pasos', 'Calorías', 'Lectura (min)', 'Metas cumplidas']];
  for (const fecha of Object.keys(estado.dias).sort()) {
    const d = estado.dias[fecha], a = avance(fecha);
    filas.push([fecha, ...habitos.map((h) => (d.habitos && d.habitos[h.id] ? hora(d.habitos[h.id].ts) : '')), d.gratitud || '',
      a.valores.agua, a.valores.pasos, a.valores.calorias, a.valores.lectura, Math.round(a.total * 100) + ' %']);
  }
  return tabla(filas);
}
