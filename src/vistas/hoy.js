// "Hoy": tablero con la mañana, las metas, el entrenamiento que toca y la semana
import { e, avanceMetas, hayFutbol, elegirPlantilla, guardar, repintar } from '../estado.js';
import { iso, fechaLarga } from '../fechas.js';
import { esc, barra, pct, botonSesion, registrar } from '../ui.js';
import { visibles, SECCION_TARJETA } from '../orden.js';
import { ve } from '../permisos.js';
import { configurada, nube } from '../nube.js';
import { cabeceraManana, listaManana } from './manana.js';
import { tarjetaMeta } from './metas.js';
import { diaDeHoy, tarjetaCalentamiento, tarjetaSemana, semanaActual, proximoEntreno } from './gym.js';
import { disposicion, unicoMejorar, textoCarga } from '../entrenador.js';
import { estadoFila } from '../gym.js';
import { tarjetaComidasHoy } from './dieta.js';
import { alertas } from './recordatorios.js';
import { puntajeDia } from '../progreso.js';
import { tarjetaEstudioHoy } from './estudiar.js';
import { tarjetaEstandares } from './vida.js';
import { tarjetaSuenoPeso, tarjetaPartido, fechaPartidoPendiente, tarjetaFoco } from './registro.js';
import { tarjetaPlataHoy } from './finanzas.js';
import { tarjetaCierreHoy } from './sesiones.js';

function saludo() {
  const h = new Date().getHours();
  const nombre = (e().config.nombre || '').trim();
  return (h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches') + (nombre ? ', ' + esc(nombre) : '');
}
// Botones de las sesiones elegidas en Editar > Rutina (la primera resaltada si se pide)
const sesionesDe = (ids, primera = false) => '<div class="botones-rapidos">' + (ids || []).map((id, i) => botonSesion(id, primera && i === 0 ? 'primario' : 'secundario')).join('') + '</div>';

// Partido de noche: qué comer y cuándo, calentar antes y estirar después
function partido() {
  return '<section class="tarjeta futbol"><h2>⚽ Fútbol esta noche</h2><ul class="consejos">' +
    ['Comida pre-partido 2-3 h antes: arroz y pollo, poca grasa y poca fibra.', 'Plátano 1 h antes y agua todo el día; si hace calor o juegas más de 60 min, electrolitos.',
      'Calienta 10-12 min antes de jugar, de suave a rápido.', 'Después: cena con proteína y carbos, y estira suave.'].map((t) => '<li>' + t + '</li>').join('') + '</ul>' +
    sesionesDe(e().config.sesionesPartido, true) + '<div class="botones-rapidos">' + botonSesion('maletin-partido', 'secundario', 'Maletín del partido') + '</div></section>';
}

function entrenamiento() {
  // El partido de hoy (o el de ayer si no se anotó) se registra junto al entreno
  const pendiente = fechaPartidoPendiente(), d = diaDeHoy(), futbol = (hayFutbol() ? partido() : '') + (pendiente ? tarjetaPartido(pendiente) : '');
  if (!d && futbol) return futbol;
  if (!d) {
    return '<section class="tarjeta"><h2>🏋️ Hoy</h2><p class="grande-texto">Día de descanso 😌</p>' +
      (e().rutina.length ? '' : '<p class="nota-corta">Aún no tienes rutina. <a href="#editar/rutina">Arma tus días →</a></p>') +
      sesionesDe(e().config.sesionesDescanso) + '</section>';
  }
  const regs = e().semanas[semanaActual()] || {};
  return '<section class="tarjeta"><div class="fila-resumen"><h2>🏋️ ' + esc(d.nombre) + '</h2>' +
    '<button type="button" class="boton primario" data-accion="ir-dia" data-dia="' + d.id + '">Abrir registro →</button></div>' +
    '<ul class="lista-ej">' + d.ejercicios.map((ej) => {
      const colores = ej.filas.map((f) => estadoFila(f, regs[f.id]));
      const hechas = colores.reduce((s, c) => s + Math.min(c.hechas, c.plan), 0), plan = colores.reduce((s, c) => s + c.plan, 0);
      const color = colores.some((c) => c.color === 'sube') ? 'sube' : hechas >= plan ? 'completo' : hechas ? 'falta' : 'vacio';
      return '<li class="c-' + color + '"><span class="punto-color"></span>' + esc(ej.nombre) + '<b>' + hechas + '/' + plan + '</b></li>';
    }).join('') + '</ul></section>' + futbol + tarjetaCalentamiento(d);
}

// Tu entrenador hoy: cómo llegas (🟢 sube · 🟡 mantén · 🔴 suave), las metas del entreno, lo único que mejorar y la carga del fútbol
function entrenador() {
  const d = disposicion(), u = unicoMejorar(), carga = d.carga && d.carga.ratio != null && d.carga.estado !== 'ok' ? textoCarga(d.carga) : '';
  return '<section class="tarjeta entrenador e-' + d.nivel + '"><h2>🧑‍🏫 Tu entrenador hoy</h2>' +
    '<div class="semaforo"><span class="semaforo-luz" aria-hidden="true">' + d.icono + '</span><div><b>' + d.titulo + '</b><p>' + esc(d.consejo) + '</p>' +
    (d.razones.length ? '<small>' + d.razones.map(esc).join(' · ') + '</small>' : '<small>Sueño bien, sin partido ayer y sin molestias.</small>') + '</div></div>' +
    (d.sinSueno ? '<p class="nota-corta">Anota cómo dormiste en 🌙 Sueño y peso para que esto sea más preciso.</p>' : '') +
    (carga ? '<p class="aviso">⚽ ' + esc(carga) + '</p>' : '') +
    '<a class="unico" href="' + u.ir + '"><small>Lo único que mejorar hoy</small><span>' + u.icono + ' ' + esc(u.texto) + '</span></a>' +
    proximoEntreno(4) + '</section>';
}

// Usuario nuevo: con qué empezar (todo se puede cambiar después en Editar)
function bienvenida() {
  if (!e().bienvenida || (configurada && !nube.ultima)) return '';
  return '<section class="tarjeta bienvenida"><h2>👋 Bienvenido</h2><p>¿Cómo quieres empezar? Todo se puede cambiar, mover o borrar después en ✏️ Editar.</p>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario grande" data-accion="plantilla" data-vacia="">📋 Con el ejemplo (rutina, hábitos y fútbol)</button>' +
    '<button type="button" class="boton secundario grande" data-accion="plantilla" data-vacia="1">🧹 Vacío: armo lo mío</button></div></section>';
}

// Cada tarjeta del tablero; el orden y cuáles se ven los elige el usuario (Editar > Pantallas)
const TARJETAS = {
  entrenador: () => entrenador(),
  foco: () => tarjetaFoco(),
  estudio: () => tarjetaEstudioHoy(),
  manana: () => '<section class="tarjeta col-manana"><h2>☀️ Primera hora</h2>' + cabeceraManana() + listaManana() + '</section>',
  metas: () => {
    const metas = avanceMetas(), ks = metas.activas;
    if (!ks.length) return '';
    return '<section class="tarjeta col-metas"><div class="fila-resumen"><h2>🎯 Metas</h2><span class="grande-num">' + pct(metas.total) + '</span></div>' + barra(metas.total) +
      ks.map((k) => tarjetaMeta(k, iso(), true)).join('') + '<a class="boton secundario ancho" href="#metas">Registrar metas →</a></section>';
  },
  gym: () => '<div class="col-gym">' + entrenamiento() + '</div>',
  suenoPeso: () => tarjetaSuenoPeso(),
  estandares: () => tarjetaEstandares(),
  dieta: () => '<section class="tarjeta col-dieta"><div class="fila-resumen"><h2>🥗 Comidas</h2><a href="#dieta" class="nota-corta">Ver plan →</a></div>' + tarjetaComidasHoy(true) + '</section>',
  plata: () => tarjetaPlataHoy(),
  cierre: () => tarjetaCierreHoy(),
  semana: () => '<section class="tarjeta col-semana"><h2>📅 Semana</h2>' + tarjetaSemana() + '</section>',
};
// Entrenador, foco y estudio van arriba, a lo ancho; las demás en el tablero de dos columnas
const ANCHAS = ['entrenador', 'foco', 'estudio'];

export function vistaHoy() {
  // Las tarjetas de una sección que el admin escondió tampoco se ven
  const avisos = ve('seccion', 'recordatorios') ? alertas() : [], p = puntajeDia();
  const ids = visibles(e().config, 'hoy').filter((k) => !SECCION_TARJETA[k] || ve('seccion', SECCION_TARJETA[k]));
  return '<div class="cab-hoy"><div><h1>' + saludo() + '</h1><p class="sub">' + fechaLarga(iso()) + ' · semana ' + semanaActual() + '</p></div>' +
    '<a class="puntaje-hoy" href="#progreso" title="Puntaje del día: mañana, metas, gym y dieta"><b>' + (p ? p.total : 0) + '</b><small>/100 hoy</small></a></div>' +
    bienvenida() +
    // Avisos, entrenador, foco y estudio: en el computador se acomodan lado a lado
    '<div class="arriba">' +
    (avisos.length ? '<a class="tarjeta avisos-hoy" href="#recordatorios"><b>🔔 ' + avisos.length + (avisos.length === 1 ? ' recordatorio' : ' recordatorios') + '</b><span>' +
      avisos.slice(0, 3).map((a) => esc(a.icono + ' ' + a.nombre) + (a.estado === 'vencido' ? ' (vencido)' : '')).join(' · ') + '</span></a>' : '') +
    ids.filter((k) => ANCHAS.includes(k)).map((k) => TARJETAS[k]()).join('') + '</div>' +
    tablero(ids.filter((k) => !ANCHAS.includes(k))) +
    '<div class="organizar-hoy"><button type="button" class="boton secundario" data-accion="hoy-organizar">' + (organizando ? '✓ Listo' : '✋ Organizar tarjetas') + '</button>' +
    (organizando && guardadas()[columnas()] ? '<button type="button" class="boton secundario" data-accion="hoy-reordenar">↺ Acomodar solas</button>' : '') + '</div>' +
    (organizando ? '<p class="nota-corta centro">Arrastra cada tarjeta a la columna y el lugar que quieras. Se guarda para este ancho de pantalla.</p>' : '') +
    '<p class="nota-corta centro"><a href="#editar/pantallas">↕ Ordenar o esconder tarjetas</a></p>';
}

// ---------- Tablero en columnas ----------
// En el computador las tarjetas van en columnas independientes (sin huecos). Si el usuario las organizó arrastrando, se
// respeta su orden (guardado por número de columnas); si no, se reparten solas según un tamaño aproximado. El tamaño sale
// de los datos (cuántos hábitos, cuántas metas) y no de medir la pantalla, para que una tarjeta no salte de columna al crecer.
let organizando = false;
const columnas = () => (typeof window === 'undefined' ? 1 : innerWidth >= 2000 ? 4 : innerWidth >= 1400 ? 3 : innerWidth >= 900 ? 2 : 1);
const guardadas = () => e().config.tablero || {};
function altoAprox(k) {
  if (k === 'manana') return 110 + 64 * e().habitos.length;
  if (k === 'metas') return 100 + 44 * avanceMetas().activas.length;
  if (k === 'gym') return diaDeHoy() ? 700 : 220;
  return { dieta: 260, semana: 220, suenoPeso: 170, estandares: 160, plata: 110, cierre: 200 }[k] || 180;
}
function repartir(ids, n) {
  const cols = Array.from({ length: n }, () => []), alto = Array(n).fill(0);
  const guardado = (guardadas()[n] || []).map((c) => c.filter((k) => ids.includes(k)));
  guardado.slice(0, n).forEach((c, i) => { cols[i] = c; alto[i] = c.reduce((s, k) => s + altoAprox(k), 0); });
  // Las que no estaban en el orden guardado (nuevas o recién mostradas) van a la columna más corta
  for (const k of ids) {
    if (cols.some((c) => c.includes(k))) continue;
    const i = alto.indexOf(Math.min(...alto));
    cols[i].push(k);
    alto[i] += altoAprox(k);
  }
  return cols;
}
function tablero(ids) {
  const html = Object.fromEntries(ids.map((k) => [k, TARJETAS[k]()]));
  const n = columnas(), conContenido = ids.filter((k) => html[k]), moviendo = organizando && n > 1;
  return '<div class="tablero' + (moviendo ? ' organizando' : '') + '" style="--cols:' + n + '">' + repartir(conContenido, n).map((c, i) =>
    '<div class="tablero-col" data-col="' + i + '">' + c.map((k) => '<div class="carta" data-carta="' + k + '"' + (moviendo ? ' draggable="true"' : '') + '>' + html[k] + '</div>').join('') + '</div>').join('') + '</div>';
}
// Guarda cómo quedaron las columnas después de arrastrar
function guardarOrden() {
  const t = document.querySelector('.tablero');
  if (!t) return;
  const cols = [...t.querySelectorAll('.tablero-col')].map((c) => [...c.querySelectorAll(':scope > .carta')].map((x) => x.dataset.carta));
  e().config.tablero = { ...guardadas(), [cols.length]: cols };
  guardar(false);
}
if (typeof window !== 'undefined') {
  let ultimas = columnas();
  // Al cambiar el ancho de la ventana, se rearma con el número de columnas que toca
  addEventListener('resize', () => {
    const n = columnas();
    if (n !== ultimas) { ultimas = n; if (document.querySelector('.tablero')) repintar(); }
  });
  let arrastrada = null;
  document.addEventListener('dragstart', (ev) => {
    const c = ev.target.closest && ev.target.closest('.tablero.organizando .carta');
    if (!c) return;
    arrastrada = c;
    c.classList.add('arrastrando');
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/plain', c.dataset.carta);
  });
  document.addEventListener('dragover', (ev) => {
    const col = arrastrada && ev.target.closest && ev.target.closest('.tablero.organizando .tablero-col');
    if (!col) return;
    ev.preventDefault();
    // Se mueve en vivo: queda antes de la primera tarjeta cuyo centro está debajo del cursor
    const antes = [...col.querySelectorAll(':scope > .carta:not(.arrastrando)')].find((x) => { const r = x.getBoundingClientRect(); return ev.clientY < r.top + r.height / 2; });
    if (antes) { if (antes.previousElementSibling !== arrastrada) col.insertBefore(arrastrada, antes); }
    else if (col.lastElementChild !== arrastrada) col.appendChild(arrastrada);
  });
  document.addEventListener('drop', (ev) => { if (arrastrada) ev.preventDefault(); });
  document.addEventListener('dragend', () => {
    if (!arrastrada) return;
    arrastrada.classList.remove('arrastrando');
    arrastrada = null;
    guardarOrden();
  });
}

registrar({
  plantilla({ vacia }) { elegirPlantilla(!!vacia); },
  'hoy-organizar'() { organizando = !organizando; repintar(); },
  'hoy-reordenar'() {
    const t = { ...guardadas() };
    delete t[columnas()];
    e().config.tablero = t;
    guardar();
  },
});

