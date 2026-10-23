// Sesiones guiadas (calentamiento, estiramiento, rodilla): un ejercicio a la vez con cuenta regresiva
import { e } from '../estado.js';
import { reloj } from '../fechas.js';
import { esc, registrar, pitido } from '../ui.js';

const PREPARAR = 5, CAMBIO_LADO = 5;
const TIPOS = { calentamiento: '🔥 Calentamiento', estiramiento: '🧘 Estiramiento', fortalecimiento: '🦵 Fortalecimiento' };

// La sesión se convierte en una lista de fases: preparar, tiempo, reps (espera "Hecho"), cambio de lado y descanso
export function fases(sesion) {
  const lista = [];
  sesion.pasos.forEach((p, i) => {
    lista.push({ fase: 'prep', seg: PREPARAR, p, i });
    const series = p.series || 1, lados = p.lados ? ['Lado izquierdo', 'Lado derecho'] : [null];
    for (let s = 1; s <= series; s++) {
      lados.forEach((lado, j) => {
        if (j > 0) lista.push({ fase: 'cambio', seg: CAMBIO_LADO, p, i });
        lista.push(p.reps ? { fase: 'reps', p, i, lado, serie: s, series } : { fase: 'tiempo', seg: p.seg, p, i, lado, serie: s, series });
      });
      if (s < series) lista.push({ fase: 'descanso', seg: p.descanso || 30, p, i });
    }
  });
  return lista;
}
export function duracion(sesion) {
  return fases(sesion).reduce((t, f) => t + (f.seg || (f.p.reps ? 40 : 0)), 0);
}

let rep = null; // { sesion, lista, k, fin, pausa, alTerminar, reloj, bloqueo }
const $ = (id) => document.getElementById(id);

function pintar() {
  const caja = $('reproductor');
  if (!rep) { caja.hidden = true; caja.innerHTML = ''; return; }
  const f = rep.lista[rep.k];
  caja.hidden = false;
  if (!f) {
    caja.innerHTML = '<div class="rep-centro"><div class="rep-grande">🎉</div><h2>¡Sesión completa!</h2><p>' + esc(rep.sesion.nombre) + '</p>' +
      '<button type="button" class="boton primario grande" data-accion="rep-cerrar">Listo</button></div>';
    return;
  }
  const total = rep.sesion.pasos.length, sig = rep.sesion.pasos[f.i + 1];
  const titulo = f.fase === 'prep' ? 'Prepárate' : f.fase === 'cambio' ? '↔ Cambia de lado' : f.fase === 'descanso' ? 'Descanso' : f.lado || '';
  caja.innerHTML =
    '<div class="rep-cab"><span>' + esc(rep.sesion.nombre) + ' · ' + (f.i + 1) + ' / ' + total + '</span>' +
    '<button type="button" class="icono" data-accion="rep-cerrar" aria-label="Cerrar">✕</button></div>' +
    '<div class="rep-barra"><span style="width:' + Math.round((rep.k / rep.lista.length) * 100) + '%"></span></div>' +
    '<div class="rep-centro fase-' + f.fase + '">' +
    '<div class="rep-fase">' + esc([titulo, f.series > 1 && (f.fase === 'tiempo' || f.fase === 'reps') ? 'serie ' + f.serie + ' de ' + f.series : ''].filter(Boolean).join(' · ')) + '&nbsp;</div>' +
    '<h2>' + esc(f.p.nombre) + '</h2><div class="rep-musculo">' + esc(f.p.musculo || '') + '</div>' +
    (f.fase === 'reps' ? '<div class="rep-grande">' + esc(f.p.reps) + '<small>reps</small></div>'
      : '<div class="rep-grande" id="rep-reloj">' + reloj(segRestantes()) + '</div>') +
    '<p class="rep-desc">' + esc(f.p.desc || '') + '</p>' +
    (sig && f.fase !== 'prep' ? '<p class="rep-sig">Siguiente: ' + esc(sig.nombre) + '</p>' : '') + '</div>' +
    '<div class="rep-controles">' +
    '<button type="button" class="boton secundario" data-accion="rep-mover" data-n="-1" aria-label="Anterior">⏮</button>' +
    (f.fase === 'reps' ? '<button type="button" class="boton primario grande" data-accion="rep-mover" data-n="1">✓ Hecho</button>'
      : '<button type="button" class="boton primario grande" data-accion="rep-pausa">' + (rep.pausa != null ? '▶ Seguir' : '⏸ Pausa') + '</button>') +
    '<button type="button" class="boton secundario" data-accion="rep-mover" data-n="1" aria-label="Saltar">⏭</button></div>';
}

function segRestantes() {
  if (!rep) return 0;
  return rep.pausa != null ? rep.pausa : Math.max(0, (rep.fin - Date.now()) / 1000);
}

function ir(k) {
  rep.k = Math.max(0, Math.min(k, rep.lista.length));
  const f = rep.lista[rep.k];
  rep.pausa = null;
  rep.fin = f && f.seg ? Date.now() + f.seg * 1000 : null;
  if (!f) { pitido(3); if (rep.alTerminar) { rep.alTerminar(); rep.alTerminar = null; } }
  else if (f.fase === 'cambio') pitido(2);
  else pitido(1);
  pintar();
}

function tic() {
  if (!rep || rep.pausa != null || !rep.fin) return;
  const r = segRestantes(), el = $('rep-reloj');
  if (el) el.textContent = reloj(r);
  if (r <= 0) ir(rep.k + 1);
}

export function abrirSesion(id, alTerminar = null) {
  const sesion = e().sesiones.find((s) => s.id === id);
  if (!sesion) return;
  cerrar();
  rep = { sesion, lista: fases(sesion), k: 0, alTerminar, reloj: setInterval(tic, 250) };
  // Que la pantalla no se apague durante la sesión
  try { navigator.wakeLock && navigator.wakeLock.request('screen').then((b) => { if (rep) rep.bloqueo = b; }, () => {}); } catch (err) {}
  ir(0);
}
function cerrar() {
  if (!rep) return;
  clearInterval(rep.reloj);
  try { rep.bloqueo && rep.bloqueo.release(); } catch (err) {}
  rep = null;
  pintar();
}

export function vistaSesiones() {
  const grupos = {};
  for (const s of e().sesiones) (grupos[s.tipo] ??= []).push(s);
  return '<h1>Sesiones</h1>' + Object.entries(grupos).map(([tipo, lista]) =>
    '<h2 class="titulo-grupo">' + (TIPOS[tipo] || esc(tipo)) + '</h2>' + lista.map((s) =>
      '<section class="tarjeta sesion"><div class="fila-resumen"><b>' + esc(s.nombre) + '</b><span>~' + Math.round(duracion(s) / 60) + ' min · ' + s.pasos.length + ' ejercicios</span></div>' +
      '<details><summary>Ver ejercicios</summary><ol class="pasos">' + s.pasos.map((p) =>
        '<li><b>' + esc(p.nombre) + '</b> <span class="nota-corta">' + esc(p.musculo || '') + ' · ' +
        (p.reps ? (p.series || 1) + '×' + esc(p.reps) : (p.series > 1 ? p.series + '×' : '') + p.seg + ' s') + (p.lados ? ' por lado' : '') + '</span>' +
        '<div class="nota-corta">' + esc(p.desc || '') + '</div></li>').join('') + '</ol></details>' +
      '<button type="button" class="boton primario grande ancho" data-accion="sesion" data-sesion="' + s.id + '">▶ Iniciar</button></section>').join('')).join('');
}

registrar({
  'rep-cerrar'() { cerrar(); },
  'rep-mover'({ n }) { if (rep) ir(rep.k + Number(n)); },
  'rep-pausa'() {
    if (!rep) return;
    if (rep.pausa != null) { rep.fin = Date.now() + rep.pausa * 1000; rep.pausa = null; } else rep.pausa = segRestantes();
    pintar();
  },
});
