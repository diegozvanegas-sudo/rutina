// 🎙️ Audio a texto: dictar en vivo (reconocimiento de voz del navegador) y pasar un audio a texto (una nota de voz de
// WhatsApp, un mp3, una grabación) con Whisper dentro del equipo: gratis, privado y sin internet después de bajar el modelo.
// Se guarda solo el texto (en e().voz.notas, que va a la nube como lo demás); el audio nunca sale del equipo.
import { e, guardar } from './estado.js';

export const notasVoz = () => ((e().voz ??= {}).notas ??= []);
export function nuevaNota(texto, origen, extra = {}) {
  const t = String(texto || '').trim();
  if (!t) return null;
  const n = { id: 'v' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), fecha: Date.now(), texto: t, origen, ...extra };
  notasVoz().unshift(n);
  guardar();
  return n;
}
export function cambiarNota(id, cambios) {
  const n = notasVoz().find((x) => x.id === id);
  if (!n) return;
  for (const [k, v] of Object.entries(cambios)) { if (v === '' || v == null) delete n[k]; else n[k] = v; }
  guardar();
}
export function borrarNota(id) {
  const l = notasVoz(), i = l.findIndex((x) => x.id === id);
  if (i < 0) return null;
  const [n] = l.splice(i, 1);
  guardar();
  return () => { notasVoz().splice(i, 0, n); guardar(); };
}
// La primera línea, para la lista de una fila
export const tituloNota = (n) => { const t = n.texto.replace(/\s+/g, ' ').trim(); return t.length > 70 ? t.slice(0, 70).trimEnd() + '…' : t; };
export const palabras = (t) => (String(t).trim().match(/\S+/g) || []).length;
export const ORIGEN = { dictado: '🎤', audio: '🎧', grabacion: '⏺' };

// ---------- Modelos de Whisper (se bajan una vez y quedan guardados en el navegador) ----------
export const MODELOS = {
  base: { id: 'Xenova/whisper-base', nombre: '⚡ Rápido', peso: '≈ 80 MB', nota: 'Bueno para notas de voz claras' },
  small: { id: 'Xenova/whisper-small', nombre: '🎯 Preciso', peso: '≈ 250 MB', nota: 'Mejor con ruido, acentos o audios largos; más lento' },
};
const CLAVE_MODELO = 'rutina_voz_modelo';
export function modeloElegido() { try { return MODELOS[localStorage.getItem(CLAVE_MODELO)] ? localStorage.getItem(CLAVE_MODELO) : 'base'; } catch (err) { return 'base'; } }
export function elegirModelo(k) { try { localStorage.setItem(CLAVE_MODELO, k); } catch (err) { /* sin almacenamiento */ } }

// ---------- Dictado en vivo ----------
export const Reconocedor = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition || null : null;

// ---------- Audio → muestras de 16 kHz en mono (lo que lee Whisper) ----------
export async function aMuestras(blob) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx({ sampleRate: 16000 });
  try {
    const a = await ctx.decodeAudioData(await blob.arrayBuffer());
    const n = a.length, mono = new Float32Array(n);
    for (let c = 0; c < a.numberOfChannels; c++) { const d = a.getChannelData(c); for (let i = 0; i < n; i++) mono[i] += d[i] / a.numberOfChannels; }
    return { muestras: mono, seg: Math.round(a.duration) };
  } catch (err) {
    throw new Error('No pude leer ese audio. Prueba con otro formato (mp3, ogg, m4a, wav) o grábalo aquí.');
  } finally { ctx.close(); }
}

// ---------- Whisper en un trabajador (no congela la pantalla) ----------
let trabajador = null, turno = 0;
const esperando = new Map();
function elTrabajador() {
  if (trabajador) return trabajador;
  trabajador = new Worker(new URL('./voz-trabajador.js', import.meta.url), { type: 'module' });
  trabajador.onmessage = ({ data }) => {
    const p = esperando.get(data.id);
    if (!p) return;
    if (data.tipo === 'progreso' || data.tipo === 'escuchando') p.avance(data);
    else { esperando.delete(data.id); if (data.tipo === 'listo') p.ok(data.texto); else p.mal(new Error(data.error)); }
  };
  trabajador.onerror = (ev) => { for (const p of esperando.values()) p.mal(new Error(ev.message || 'Falló el motor de voz')); esperando.clear(); trabajador = null; };
  return trabajador;
}
/** @param {(d: any) => void} [avance] recibe { tipo: 'progreso', p: { status, file, progress } } o { tipo: 'escuchando' } */
export function transcribir(muestras, modelo, avance = (d) => {}) {
  // Solo en desarrollo: las pruebas reemplazan Whisper (tests/e2e/voz.mjs)
  if (import.meta.env.DEV && window.__vozPrueba) return window.__vozPrueba(muestras, modelo, avance);
  if (typeof navigator !== 'undefined' && navigator.onLine === false && !modeloListo(modelo)) {
    return Promise.reject(new Error('La primera vez se necesita internet para bajar el modelo. Después funciona sin señal.'));
  }
  return new Promise((ok, mal) => {
    const id = ++turno;
    esperando.set(id, { ok: (t) => { marcarListo(modelo); ok(t); }, mal, avance });
    elTrabajador().postMessage({ id, audio: muestras, modelo: MODELOS[modelo].id }, [muestras.buffer]);
  });
}
// Qué modelos ya se bajaron en este equipo (para decirlo y para saber si sirve sin internet)
const CLAVE_LISTOS = 'rutina_voz_listos';
export function modeloListo(k) { try { return (JSON.parse(localStorage.getItem(CLAVE_LISTOS) || '[]')).includes(k); } catch (err) { return false; } }
function marcarListo(k) { try { const l = JSON.parse(localStorage.getItem(CLAVE_LISTOS) || '[]'); if (!l.includes(k)) localStorage.setItem(CLAVE_LISTOS, JSON.stringify([...l, k])); } catch (err) { /* sin almacenamiento */ } }
