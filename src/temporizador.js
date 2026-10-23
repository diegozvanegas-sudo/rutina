// Un temporizador a la vez (descanso del gym, colgarse 60 s). Se guarda la hora de fin: sigue bien aunque se cierre la app.
import { e, guardar, guardarAqui, dia } from './estado.js';
import { pitido } from './ui.js';
import { iso } from './fechas.js';

export function iniciar(tipo, segundos, nombre, datos = {}) {
  e().activo = { tipo, nombre, total: segundos, fin: Date.now() + segundos * 1000, ...datos };
  guardarAqui();
}
export function detener() { e().activo = null; guardarAqui(); }
export function sumar(seg) {
  const a = e().activo;
  if (!a) return;
  a.fin = Math.max(Date.now(), a.fin) + seg * 1000;
  a.total += seg;
  guardarAqui();
}
export function restante() {
  const a = e().activo;
  return a ? (a.fin - Date.now()) / 1000 : 0;
}

// Se llama cada medio segundo desde main.js
export function revisar() {
  const a = e().activo;
  if (!a || Date.now() < a.fin) return;
  e().activo = null;
  if (a.tipo === 'habito') {
    const h = dia(a.fecha || iso()).habitos;
    h[a.habito] ??= { ts: Date.now() };
  }
  pitido(3);
  guardar();
}
