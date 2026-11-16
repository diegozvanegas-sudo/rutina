// Sesiones guiadas (calentamiento, estiramiento, rodilla): un ejercicio a la vez con cuenta regresiva.
// Las de tipo checklist (antes de salir, maletín del partido) no tienen tiempo: cada punto se marca con ✓.
import { e, dia, guardar, repintar } from '../estado.js';
import { reloj, iso } from '../fechas.js';
import { esc, registrar, pitido, barra, toast } from '../ui.js';
import { figuraPaso, videoPaso } from '../figuras.js';
import { BANCO, ZONAS, pasoDeBanco } from '../banco.js';

const PREPARAR = 5, CAMBIO_LADO = 5;
const TIPOS = { checklist: '✅ Checklists', calentamiento: '🔥 Calentamiento', estiramiento: '🧘 Estiramiento', fortalecimiento: '🦵 Fortalecimiento', mente: '🧠 Mente' };

// ---------- Checklists: las marcas son del día (dias[fecha].checklists[sesión] = { paso: ts }), así mañana empieza limpia ----------
export const idPaso = (p, i) => p.id || String(i);
export function avanceChecklist(sesion, marcas = {}) {
  const hechos = sesion.pasos.filter((p, i) => marcas[idPaso(p, i)]).length;
  return { hechos, total: sesion.pasos.length, completa: sesion.pasos.length > 0 && hechos === sesion.pasos.length };
}
const marcasDe = (id, fecha = iso()) => ((e().dias[fecha] || {}).checklists || {})[id] || {};
function puntosChecklist(s) {
  const marcas = marcasDe(s.id);
  return '<div class="practica-libro">' + s.pasos.map((p, i) => {
    const hecho = !!marcas[idPaso(p, i)];
    return '<button type="button" class="paso-libro' + (hecho ? ' hecho' : '') + '" data-accion="check-paso" data-sesion="' + esc(s.id) + '" data-paso="' + esc(idPaso(p, i)) + '" aria-pressed="' + hecho + '">' +
      '<span class="check-libro">' + (hecho ? '✓' : '') + '</span><span>' + esc(p.nombre) + (p.desc ? '<small class="nota-corta"> · ' + esc(p.desc) + '</small>' : '') + '</span></button>';
  }).join('') + '</div>';
}
// Hoy, desde las 7 p. m.: el cierre de la noche para ir marcando
export const HORA_CIERRE = 19;
// La sesión "Cierre de la noche" si ya es hora de mostrarla en Hoy (la tarjeta está en src/react/pantallas/HoyTarjetas.tsx)
export const cierreDeHoy = (ahora = new Date()) => { const s = e().sesiones.find((x) => x.id === 'cierre-noche'); return s && ahora.getHours() >= HORA_CIERRE ? s : null; };

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

// Todas las imágenes de la sesión en una fila: la actual resaltada, las hechas con ✓. En el reproductor se tocan para saltar
function tiraFiguras(pasos, actual = -1, accion = '') {
  return '<div class="tira-figuras" role="list">' + pasos.map((p, i) => {
    const clase = i === actual ? ' actual' : actual > i ? ' hecho' : '';
    const dentro = (figuraPaso(p, { animar: false }) || '<span class="tira-num">' + (i + 1) + '</span>') +
      '<small>' + (actual > i ? '✓ ' : (i + 1) + '. ') + esc(p.nombre) + '</small>';
    return accion
      ? '<button type="button" role="listitem" class="tira-item' + clase + '" data-accion="' + accion + '" data-i="' + i + '"' + (i === actual ? ' aria-current="step"' : '') + ' aria-label="' + esc((i + 1) + '. ' + p.nombre) + '">' + dentro + '</button>'
      : '<div role="listitem" class="tira-item">' + dentro + '</div>';
  }).join('') + '</div>';
}
function centrarTira(caja) {
  const tira = caja.querySelector('.tira-figuras'), el = tira && tira.querySelector('.actual');
  if (el) tira.scrollLeft = el.offsetLeft - (tira.clientWidth - el.offsetWidth) / 2;
}

function pintar() {
  const caja = $('reproductor');
  if (!rep) { caja.hidden = true; caja.innerHTML = ''; return; }
  caja.hidden = false;
  if (rep.sesion.tipo === 'checklist') {
    const a = avanceChecklist(rep.sesion, marcasDe(rep.sesion.id));
    caja.innerHTML = '<div class="rep-cab"><span>' + esc(rep.sesion.nombre) + ' · ' + a.hechos + ' / ' + a.total + '</span>' +
      '<button type="button" class="icono" data-accion="rep-cerrar" aria-label="Cerrar">✕</button></div>' +
      '<div class="rep-barra"><span style="width:' + Math.round((a.total ? a.hechos / a.total : 0) * 100) + '%"></span></div>' +
      '<div class="rep-lista">' + (a.completa ? '<div class="rep-centro"><div class="rep-grande">🎉</div><h2>¡Todo listo!</h2></div>' : '') + puntosChecklist(rep.sesion) + '</div>' +
      '<div class="rep-controles uno"><button type="button" class="boton primario grande" data-accion="rep-cerrar">' + (a.completa ? 'Listo' : 'Cerrar') + '</button></div>';
    return;
  }
  const f = rep.lista[rep.k];
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
    (total > 1 ? tiraFiguras(rep.sesion.pasos, f.i, 'rep-paso') : '') +
    '<div class="rep-centro fase-' + f.fase + '">' +
    '<div class="rep-fase">' + esc([titulo, f.series > 1 && (f.fase === 'tiempo' || f.fase === 'reps') ? 'serie ' + f.serie + ' de ' + f.series : ''].filter(Boolean).join(' · ')) + '&nbsp;</div>' +
    figuraPaso(f.p) +
    '<h2>' + esc(f.p.nombre) + '</h2><div class="rep-musculo">' + esc(f.p.musculo || '') + '</div>' +
    (f.fase === 'reps' ? '<div class="rep-grande">' + esc(f.p.reps) + '<small>reps</small></div>'
      : '<div class="rep-grande" id="rep-reloj">' + reloj(segRestantes()) + '</div>') +
    '<p class="rep-desc">' + esc(f.p.desc || '') + '</p>' +
    (videoPaso(f.p) ? '<a class="rep-video" href="' + esc(videoPaso(f.p)) + '" target="_blank" rel="noopener">🎥 Ver video de cómo se hace</a>' : '') +
    (sig && f.fase !== 'prep' ? '<p class="rep-sig">Siguiente: ' + esc(sig.nombre) + '</p>' : '') + '</div>' +
    '<div class="rep-controles">' +
    '<button type="button" class="boton secundario" data-accion="rep-mover" data-n="-1" aria-label="Anterior">⏮</button>' +
    (f.fase === 'reps' ? '<button type="button" class="boton primario grande" data-accion="rep-mover" data-n="1">✓ Hecho</button>'
      : '<button type="button" class="boton primario grande" data-accion="rep-pausa">' + (rep.pausa != null ? '▶ Seguir' : '⏸ Pausa') + '</button>') +
    '<button type="button" class="boton secundario" data-accion="rep-mover" data-n="1" aria-label="Saltar">⏭</button></div>';
  centrarTira(caja);
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
  // Checklist: sin reloj ni fases; termina cuando todo queda marcado
  if (sesion.tipo === 'checklist') {
    rep = { sesion, alTerminar };
    if (avanceChecklist(sesion, marcasDe(id)).completa) terminarChecklist();
    pintar();
    return;
  }
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

function terminarChecklist() {
  if (rep && rep.alTerminar) { rep.alTerminar(); rep.alTerminar = null; }
}

// ---------- Banco de rehabilitación y fortalecimiento: un ejercicio por fila, se abre para ver cómo, dosis y progresión ----------
let zonaVista = 'todas';
const dosisTexto = (d) => (d.reps ? (d.series || 1) + '×' + d.reps : (d.series > 1 ? d.series + '×' : '') + d.seg + ' s') + (d.lados ? ' por lado' : '');

let tipoVisto = null;
// Lo que necesita la pantalla de React (src/react/pantallas/Sesiones.tsx): la categoría y la zona que se ven y las reglas
export const piezasSesiones = {
  ver: () => ({ tipoVisto, zonaVista }),
  ponerTipo: (t) => { tipoVisto = t; },
  ponerZona: (z) => { zonaVista = z; },
  marcasDe, avanceChecklist, duracion, idPaso, dosisTexto, TIPOS,
};

registrar({
  'ses-tipo'({ t }) { tipoVisto = t; repintar(); },
  'banco-zona'({ z }) { zonaVista = z; repintar(); },
  // Enlaces "#sesiones/banco" y "#sesiones/banco-rodilla" (desde las molestias del partido): abren el banco en esa zona
  'abrir-sesiones'({ p }) {
    const [donde, zona] = String(p || '').split('-');
    if (donde !== 'banco') return;
    tipoVisto = 'banco';
    zonaVista = ZONAS[zona] ? zona : 'todas';
  },
  'banco-agregar'({ i }, el) {
    const x = BANCO[Number(i)], s = e().sesiones.find((ses) => ses.id === el.value);
    if (!x || !s) return;
    s.pasos.push(pasoDeBanco(x));
    toast('✓ ' + x.n + ' agregado a ' + s.nombre);
    guardar();
  },
  'check-paso'({ sesion, paso }) {
    const s = e().sesiones.find((x) => x.id === sesion);
    if (!s) return;
    const marcas = ((dia().checklists ??= {})[sesion] ??= {});
    if (marcas[paso]) delete marcas[paso]; else marcas[paso] = Date.now();
    const a = avanceChecklist(s, marcas);
    if (a.completa) { pitido(1); toast('🎉 ' + s.nombre + ': todo listo'); if (rep && rep.sesion.id === sesion) terminarChecklist(); }
    guardar();
    if (rep) pintar();
  },
  'check-limpiar'({ sesion }) {
    const d = dia();
    if (d.checklists) delete d.checklists[sesion];
    guardar();
  },
  'rep-cerrar'() { cerrar(); },
  'rep-mover'({ n }) { if (rep) ir(rep.k + Number(n)); },
  'rep-paso'({ i }) {
    if (!rep || !rep.lista) return;
    const k = rep.lista.findIndex((f) => f.i === Number(i));
    if (k >= 0) ir(k);
  },
  'rep-pausa'() {
    if (!rep) return;
    if (rep.pausa != null) { rep.fin = Date.now() + rep.pausa * 1000; rep.pausa = null; } else rep.pausa = segRestantes();
    pintar();
  },
});
