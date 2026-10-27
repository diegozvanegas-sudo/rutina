import './estilos.css';
import { registerSW } from 'virtual:pwa-register';
import { e, cargar, alCambiar, hechosManana, fraccionManana, avanceMetas, segundosCrono } from './estado.js';
import { reloj } from './fechas.js';
import { ejecutar, registrar, prepararAudio, pct, barra, esc, claveDeDatos } from './ui.js';
import { revisar, restante, sumar, detener } from './temporizador.js';
import { resumenSemana } from './gym.js';
import { vistaHoy } from './vistas/hoy.js';
import { vistaManana, textoEspera, revisarCronos } from './vistas/manana.js';
import { vistaMetas } from './vistas/metas.js';
import { vistaGym, semanaActual } from './vistas/gym.js';
import { vistaSesiones } from './vistas/sesiones.js';
import { vistaAjustes, pantallaEntrar } from './vistas/ajustes.js';
import { vistaEditar } from './vistas/editar.js';
import { vistaDieta } from './vistas/dieta.js';
import { vistaFinanzas } from './vistas/finanzas.js';
import { vistaRecordatorios, alertas } from './vistas/recordatorios.js';
import { vistaProgreso } from './vistas/progreso.js';
import { vistaLibros } from './vistas/libros.js';
import { iniciarNube, nube, textoNube, configurada } from './nube.js';
import { iniciarHoja } from './hoja.js';

registerSW({ immediate: true });
cargar();
iniciarNube();
iniciarHoja();

const VISTAS = {
  hoy: ['🏠', 'Hoy', vistaHoy],
  progreso: ['📈', 'Progreso', vistaProgreso],
  manana: ['☀️', 'Mañana', vistaManana],
  metas: ['🎯', 'Metas', vistaMetas],
  libros: ['📚', 'Libros', vistaLibros],
  dieta: ['🥗', 'Dieta', vistaDieta],
  finanzas: ['💰', 'Finanzas', vistaFinanzas],
  recordatorios: ['🔔', 'Recordatorios', vistaRecordatorios],
  gym: ['🏋️', 'Gym', vistaGym],
  sesiones: ['🧘', 'Sesiones', vistaSesiones],
  editar: ['✏️', 'Editar', vistaEditar],
  ajustes: ['⚙️', 'Ajustes', vistaAjustes],
};
const $ = (id) => document.getElementById(id);
// "#dieta/peso": sección y pestaña. La pestaña se le pasa a la sección ("abrir-dieta") y queda "#dieta"
const actual = () => { const v = location.hash.slice(1).split('/')[0]; return VISTAS[v] ? v : 'hoy'; };
function abrirPestana() {
  const [v, sub] = location.hash.slice(1).split('/');
  if (!sub || !VISTAS[v]) return;
  ejecutar('abrir-' + v, { dataset: { p: decodeURIComponent(sub) } });
  history.replaceState(null, '', '#' + v);
}

function enlaces() {
  const avisos = alertas().length;
  return Object.entries(VISTAS).map(([k, [icono, nombre]]) =>
    '<a href="#' + k + '"' + (k === actual() ? ' aria-current="page"' : '') + '><span class="ic" aria-hidden="true">' + icono + '</span><span>' + nombre + '</span>' +
    (k === 'recordatorios' && avisos ? '<span class="insignia" aria-label="' + avisos + ' pendientes">' + avisos + '</span>' : '') + '</a>').join('');
}

// Barra lateral: fija a la derecha en el computador; en el celular se abre con ☰ desde la derecha
function lateral() {
  const total = e().habitos.length, m = avanceMetas(), r = resumenSemana(e().rutina, e().semanas[semanaActual()] || {});
  return '<div class="marca"><span class="logo" aria-hidden="true">🏋️</span><b>Rutina</b></div>' +
    '<nav class="nav-lateral" aria-label="Secciones">' + enlaces() + '</nav>' +
    '<div class="resumen-lateral">' +
    '<div><div class="fila-resumen"><span>☀️ Mañana</span><b>' + hechosManana() + '/' + total + '</b></div>' + barra(fraccionManana()) + '</div>' +
    '<div><div class="fila-resumen"><span>🎯 Metas</span><b>' + pct(m.total) + '</b></div>' + barra(m.total) + '</div>' +
    '<div><div class="fila-resumen"><span>🏋️ Semana ' + semanaActual() + '</span><b>' + r.hechas + '/' + r.plan + '</b></div>' + barra(r.plan ? r.hechas / r.plan : 0) + '</div>' +
    '</div>' +
    '<a class="estado-nube n-' + nube.estado + '" href="#ajustes" title="' + esc(nube.error || '') + '">☁️ ' + textoNube() + '</a>';
}

function flotante() {
  const a = e().activo, caja = $('flotante');
  caja.hidden = !a;
  if (!a) return;
  caja.innerHTML = '<div class="flot-texto"><small>' + (a.tipo === 'descanso' ? 'Descanso' : 'En curso') + '</small><b>' + esc(a.nombre) + '</b></div>' +
    '<span class="flot-reloj" id="flot-reloj">' + reloj(restante()) + '</span>' +
    (a.tipo === 'descanso' ? '<button type="button" class="boton secundario" data-accion="t-sumar">+30 s</button>' : '') +
    '<button type="button" class="boton secundario" data-accion="t-parar" aria-label="Terminar">✕</button>' +
    '<span class="flot-barra" id="flot-barra"></span>';
}

// Identidad de un campo para encontrarlo de nuevo después de repintar
function claveCampo(el) {
  return claveDeDatos(el.dataset || {});
}
// Lo escrito y aún no guardado (reps de la serie, el campo donde está el cursor) sobrevive al repintado
function recordarCampos() {
  const activo = document.activeElement, valores = {};
  document.querySelectorAll('#vista [data-serie]').forEach((el) => { if (el.value) valores[claveCampo(el)] = el.value; });
  // Un campo de archivo no se puede volver a llenar por código
  const clave = activo && $('vista').contains(activo) && activo.type !== 'file' ? claveCampo(activo) : null;
  if (clave) valores[clave] = activo.value;
  return { clave, valores, cursor: clave && activo.selectionStart != null ? [activo.selectionStart, activo.selectionEnd] : null };
}
function restaurarCampos({ clave, valores, cursor }) {
  document.querySelectorAll('#vista input:not([type=file]), #vista textarea').forEach((el) => {
    const k = claveCampo(el);
    if (k && k in valores) el.value = valores[k];
    if (k && k === clave) {
      el.focus({ preventScroll: true });
      try { if (cursor) el.setSelectionRange(cursor[0], cursor[1]); } catch (err) {}
    }
  });
}

let ultimaVista = null;
function pintar() {
  // Sin sesión iniciada solo se ve la pantalla para entrar (lo escrito en correo/contraseña se conserva)
  const sinSesion = configurada && !nube.usuario;
  document.body.classList.toggle('sin-sesion', sinSesion);
  if (sinSesion) {
    const correo = $('nube-correo'), clave = $('nube-clave');
    const antes = correo && { correo: correo.value, clave: clave.value, foco: document.activeElement && document.activeElement.id };
    menu(false);
    $('vista').innerHTML = pantallaEntrar();
    $('lateral').innerHTML = '';
    flotante();
    document.title = 'Entrar · Rutina';
    if (antes && $('nube-correo')) {
      $('nube-correo').value = antes.correo; $('nube-clave').value = antes.clave;
      if (antes.foco && $(antes.foco)) $(antes.foco).focus();
    }
    ultimaVista = null;
    return;
  }
  const v = actual(), y = window.scrollY, campos = v === ultimaVista ? recordarCampos() : null;
  $('vista').innerHTML = VISTAS[v][2]();
  if (campos) restaurarCampos(campos);
  $('lateral').innerHTML = lateral();
  flotante();
  document.title = VISTAS[v][1] + ' · Rutina';
  if (v === ultimaVista) window.scrollTo(0, y); else window.scrollTo(0, 0);
  ultimaVista = v;
}

// Al salir de un campo (change) se repinta; si en ese momento el dedo está sobre un botón,
// se espera a que termine el toque para que el botón no desaparezca debajo del dedo.
let dedoAbajo = false, pendiente = false, soltar = null;
// Se repinta un instante después: al pasar con Tab (o "siguiente" en el teclado del celular) el cursor ya está
// en el campo nuevo, y así se puede dejar ahí después de repintar
let programado = false;
function pedirPintar() {
  if (dedoAbajo) { pendiente = true; return; }
  if (programado) return;
  programado = true;
  setTimeout(() => { programado = false; pintar(); }, 0);
}
function vaciar() { dedoAbajo = false; if (pendiente) { pendiente = false; pintar(); } }
document.addEventListener('pointerdown', () => { dedoAbajo = true; clearTimeout(soltar); prepararAudio(); }, true);
document.addEventListener('pointerup', () => { clearTimeout(soltar); soltar = setTimeout(vaciar, 400); }, true);
document.addEventListener('pointercancel', () => { clearTimeout(soltar); soltar = setTimeout(vaciar, 400); }, true);

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-accion]');
  if (el) ejecutar(el.dataset.accion, el, ev);
  if (ev.target.closest('#lateral a')) menu(false); // tocar la sección en la que ya está también cierra el menú
  clearTimeout(soltar);
  vaciar();
});
document.addEventListener('change', (ev) => {
  const el = ev.target.closest('[data-cambio]');
  if (el) ejecutar(el.dataset.cambio, el, ev);
});
// "Enter"/"Ir" en el teclado del celular guarda el campo
document.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Enter' || ev.target.tagName !== 'INPUT') return;
  const serie = ev.target.dataset.serie;
  if (serie) { ev.preventDefault(); const b = ev.target.parentNode.querySelector('[data-accion="serie"]'); if (b) b.click(); return; }
  if (ev.target.id === 'nube-clave') { ev.preventDefault(); ejecutar('nube-entrar', ev.target, ev); return; }
  ev.target.blur();
});

function menu(abrir) {
  document.body.classList.toggle('menu-abierto', abrir);
  $('velo').hidden = !abrir;
  document.querySelectorAll('[aria-controls="lateral"]').forEach((b) => b.setAttribute('aria-expanded', abrir));
}
registrar({
  't-sumar'() { sumar(30); },
  't-parar'() { detener(); },
  menu() { menu(!document.body.classList.contains('menu-abierto')); },
  'menu-cerrar'() { menu(false); },
});
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') menu(false); });

// Cuadro de los gráficos: al pasar el mouse, tocar o enfocar una marca con data-tip
function mostrarTip(el, x, y) {
  const t = $('tip'), texto = el && el.dataset.tip;
  if (!texto) { t.hidden = true; return; }
  t.textContent = texto;
  t.hidden = false;
  const r = t.getBoundingClientRect();
  t.style.left = Math.max(8, Math.min(window.innerWidth - r.width - 8, x - r.width / 2)) + 'px';
  t.style.top = Math.max(8, y - r.height - 14) + 'px';
}
document.addEventListener('pointermove', (ev) => {
  const el = ev.target.closest && ev.target.closest('[data-tip]');
  if (el) mostrarTip(el, ev.clientX, ev.clientY); else if (!$('tip').hidden) $('tip').hidden = true;
});
document.addEventListener('pointerdown', (ev) => {
  const el = ev.target.closest && ev.target.closest('[data-tip]');
  if (el) mostrarTip(el, ev.clientX, ev.clientY);
});
document.addEventListener('focusin', (ev) => {
  const el = ev.target.closest && ev.target.closest('[data-tip]');
  if (el) { const r = el.getBoundingClientRect(); mostrarTip(el, r.left + r.width / 2, r.top); }
});
window.addEventListener('scroll', () => { $('tip').hidden = true; }, { passive: true });

alCambiar(pedirPintar);
window.addEventListener('hashchange', () => { menu(false); abrirPestana(); pintar(); window.scrollTo(0, 0); });

// Reloj: temporizadores, cronómetros y la espera de la pastilla, sin repintar toda la pantalla
setInterval(() => {
  revisar();
  revisarCronos();
  const fr = $('flot-reloj');
  if (fr && e().activo) {
    fr.textContent = reloj(restante());
    $('flot-barra').style.width = Math.max(0, Math.min(100, 100 - (restante() / e().activo.total) * 100)) + '%';
  }
  document.querySelectorAll('[data-crono]').forEach((el) => {
    const [fecha, id] = el.dataset.crono.split('|'), d = e().dias[fecha];
    el.textContent = reloj(segundosCrono(d && d.crono[id]));
  });
  document.querySelectorAll('[data-espera]').forEach((el) => {
    const t = textoEspera(Number(el.dataset.espera));
    el.textContent = t.texto;
    el.className = 'espera ' + t.clase;
  });
}, 500);

// Al volver a la app después de medianoche, "Hoy" debe ser el día nuevo
let fechaPintada = new Date().toDateString();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && new Date().toDateString() !== fechaPintada) { fechaPintada = new Date().toDateString(); pintar(); }
});

abrirPestana();
pintar();
