// Pequeñas piezas de pantalla compartidas por las vistas
import { e } from './estado.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function barra(fraccion, clase = '') {
  const pct = Math.round(Math.max(0, Math.min(1, fraccion || 0)) * 100);
  return '<div class="barra ' + clase + '" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + pct + '%"></span></div>';
}

export const pct = (f) => Math.round((f || 0) * 100) + ' %';
export const miles = (n) => Math.round(n || 0).toLocaleString('es-CO');

// Acciones de los botones: data-accion="nombre" y los demás data-* como argumentos
const acciones = {};
export function registrar(mapa) { Object.assign(acciones, mapa); }
export function ejecutar(nombre, el, ev) {
  const f = acciones[nombre];
  if (f) f(el.dataset, el, ev);
}

// ---------- Avisos: sonido y vibración (al terminar un descanso, cambio de lado, etc.) ----------
let audio = null;
export function pitido(veces = 1) {
  if (navigator.vibrate) navigator.vibrate(veces > 1 ? [200, 120, 200, 120, 400] : [250]);
  if (!e().config.sonido) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < veces; i++) {
      const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime + i * 0.28;
      o.frequency.value = i === veces - 1 ? 1040 : 880;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      o.connect(g).connect(audio.destination);
      o.start(t0); o.stop(t0 + 0.24);
    }
  } catch (err) {}
}
// El navegador solo deja sonar después de un toque: se "despierta" el audio con el primer toque
export function prepararAudio() {
  try { audio ??= new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume(); } catch (err) {}
}

// Copiar al portapapeles; en navegadores sin permiso (http, celulares viejos) usa el método antiguo
export function copiarTexto(texto, aviso = 'Copiado') {
  const listo = () => toast('📋 ' + aviso);
  const viejo = () => {
    const a = document.createElement('textarea');
    a.value = texto; a.setAttribute('readonly', ''); a.style.position = 'fixed'; a.style.opacity = '0';
    document.body.appendChild(a); a.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err) {}
    a.remove();
    if (ok) listo(); else toast('No se pudo copiar: abre "Ver texto" y cópialo a mano');
  };
  if (!(navigator.clipboard && window.isSecureContext)) { viejo(); return; }
  // Si el permiso del portapapeles se queda esperando, a los 1,5 s se copia con el método antiguo
  let hecho = false;
  const una = (f) => () => { if (!hecho) { hecho = true; f(); } };
  setTimeout(una(viejo), 1500);
  navigator.clipboard.writeText(texto).then(una(listo), una(viejo));
}

export function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { t.hidden = true; }, 2600);
}
