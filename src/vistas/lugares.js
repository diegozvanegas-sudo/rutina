// 🗺️ Lugares: los lugares que visité y los que quiero visitar, en mapas SVG propios (sin internet): Mundo › Colombia o Brasil › Antioquia.
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { esc, barra, pct, registrar, toast } from '../ui.js';
import { leerMonto, pesos } from '../finanzas.js';
import { nuevoMovimiento } from './finanzas.js';
import { ve } from '../permisos.js';
import { MAPAS, MAPA_INICIAL, cargarMapa } from '../mapas/index.js';
import { TIPOS_LUGAR } from '../datos_lugares.js';
import { proyectar, desproyectar, piezaEn, cajaDe, piezaDelLugar, lugaresDePieza, estadoPieza, resumenMapa, avanceGrupos, lineaTiempo, filtrar, ordenar, agregarVisita, sorprender, mapaHijo, migas, enlaceSeguro, quitarVisita, marcarPieza, desmarcarPieza } from '../lugares.js';

const lista = () => e().lugares.lista;
const buscar = (id) => lista().find((l) => l.id === id);
const nuevoId = () => 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

let mapa = null, errorMapa = false, animar = '', caja = null;
let piezaSel = null, abierto = null, borrador = null, ubicando = false, plan = null;
const filtro = { estado: '', pais: '', grupo: '', tipo: '', texto: '' };

function abrirMapa(id, sentido = 'mapa-entra') {
  errorMapa = false;
  return cargarMapa(id).then((m) => { mapa = m; caja = entero(); animar = sentido; repintar(); }).catch(() => { errorMapa = true; repintar(); });
}
function cambiarMapa(id, sentido) {
  piezaSel = null; abierto = null; borrador = null; ubicando = false; filtro.grupo = '';
  const tip = document.getElementById('tip');
  if (tip) tip.hidden = true;
  return abrirMapa(id, sentido);
}
const enElMapa = (l) => piezaDelLugar(l, mapa.id, MAPAS) != null;
const una = () => MAPAS[mapa.id].una;
const entero = () => ({ x: 0, y: 0, w: mapa.ancho, h: mapa.alto });
const piezaDe = (l) => (mapa ? mapa.piezas.find((p) => p.id === piezaDelLugar(l, mapa.id, MAPAS)) : null);
const grupoDe = (l) => { const p = piezaDe(l); return p ? p.grupo : ''; };
const dondeEs = (l) => { const p = piezaDe(l); return [l.municipio || (p && p.nombre), p && p.grupo].filter(Boolean).join(' · ') || [l.region, l.pais].filter(Boolean).join(' · '); };
const plural = (n, s, p = s + 's') => n + ' ' + (n === 1 ? s : p);
const horas = (n) => '≈ ' + String(n).replace('.', ',') + ' h desde Medellín';
const estrellas = (n) => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '');

// ---------- Mapa ----------
function dibujo() {
  const indice = MAPAS, porPieza = {};
  for (const l of lista()) { const p = piezaDelLugar(l, mapa.id, indice); if (p != null) (porPieza[p] ??= []).push(l); }
  const piezas = mapa.piezas.map((p) => {
    const ls = porPieza[p.id] || [], { estado, tono } = estadoPieza(ls);
    const hijo = mapaHijo(MAPAS, mapa.id, p.id);
    const clase = 'pz' + (estado === 'visitado' ? ' v' + tono : estado === 'quiero' ? ' q' : '') + (p.id === piezaSel ? ' sel' : '') + (hijo ? ' hijo' : '');
    const tip = p.nombre + ' · ' + p.grupo + ' · ' + (ls.length ? plural(ls.length, 'lugar', 'lugares') : 'sin lugares') + (hijo ? ' · toca para entrar' : '');
    return '<path class="' + clase + '" d="' + p.d + '" data-pieza="' + p.id + '" data-tip="' + esc(tip) + '"/>';
  }).join('');
  // Los lugares de los mapas de abajo solo salen si ya se visitaron: los demás se ven por el color de la pieza, y no tapan el mapa
  const puntos = lista().filter((l) => l.lat != null && enElMapa(l) && (l.mapa === mapa.id || l.estado === 'visitado')).map((l) => {
    const [x, y] = proyectar(mapa, l.lat, l.lon), v = l.estado === 'visitado';
    return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"><g class="pt ' + (v ? 'pt-v' : 'pt-q') + (l.id === abierto ? ' abierto' : '') + '" data-lugar="' + l.id + '" data-tip="' + esc((v ? '● ' : '☆ ') + l.nombre) + '">' +
      '<circle class="pt-toque" r="14"/>' + (v ? '<circle r="6"/>' : '<polygon points="0,-8 2.2,-2.5 8,-2.5 3.4,1.2 5,7 0,3.6 -5,7 -3.4,1.2 -8,-2.5 -2.2,-2.5"/>') + '</g></g>';
  }).join('');
  // --z encoge los puntos al acercarse: así miden lo mismo en pantalla en cualquier mapa
  const z = 1000 / caja.w, c = animar;
  animar = '';
  return '<div class="mapa-caja ' + c + (ubicando ? ' ubicando' : '') + '">' +
    '<svg class="mapa-svg' + (caja.w < mapa.ancho - 1 ? ' con-zoom' : '') + '" viewBox="' + [caja.x, caja.y, caja.w, caja.h].join(' ') + '" style="--z:' + z + ';aspect-ratio:' + mapa.ancho + '/' + mapa.alto + '" role="img" aria-label="Mapa de ' + esc(mapa.nombre) + '">' + piezas + puntos + '</svg>' +
    '<div class="mapa-zoom"><button type="button" class="icono" data-accion="lug-zoom" data-f="1.5" aria-label="Acercar">＋</button><button type="button" class="icono" data-accion="lug-zoom" data-f="0.66" aria-label="Alejar">－</button><button type="button" class="icono" data-accion="lug-grupo" data-g="" aria-label="Ver todo">⤢</button></div>' +
    '<div class="mapa-leyenda"><span><i class="ley v2"></i>Visitado</span><span><i class="ley q"></i>Quiero ir</span><span><i class="ley"></i>Sin marcar</span></div></div>';
}

function numeros() {
  const r = resumenMapa(mapa, lista(), MAPAS, Number(iso().slice(0, 4))), info = MAPAS[mapa.id];
  const kpi = (n, texto) => '<div class="kpi"><b>' + esc(n) + '</b><span>' + esc(texto) + '</span></div>';
  return '<div class="kpis">' + kpi(r.piezas + ' / ' + r.total, info.unidad + ' · ' + pct(r.fraccion)) + kpi(r.visitados, r.visitados === 1 ? 'lugar visitado' : 'lugares visitados') + kpi(r.porVisitar, 'por visitar') +
    kpi(r.viajes, r.viajes === 1 ? 'viaje este año' : 'viajes este año') + kpi(r.paises, r.paises === 1 ? 'país' : 'países') + kpi(r.ultimo ? r.ultimo.nombre : '—', 'último lugar') + '</div>';
}

function grupos() {
  const filas = avanceGrupos(mapa, lista(), MAPAS);
  return '<section class="tarjeta"><h2>Avance por ' + esc(MAPAS[mapa.id].grupo) + '</h2><p class="nota-corta">Toca una para acercarte en el mapa.</p><div class="grupos-lugar">' + filas.map((g) =>
    '<button type="button" class="grupo-lugar" data-accion="lug-grupo" data-g="' + esc(g.grupo) + '"><span class="fila-resumen"><span>' + esc(g.grupo) + '</span><b>' + g.hechas + '/' + g.total + '</b></span>' + barra(g.fraccion) + '</button>').join('') + '</div></section>';
}

// ---------- Panel de la pieza tocada ----------
function panelPieza() {
  const p = piezaSel && mapa.piezas.find((x) => x.id === piezaSel);
  if (!p) return '';
  const ls = lugaresDePieza(lista(), mapa.id, p.id, MAPAS);
  return '<section class="tarjeta panel-pieza"><div class="fila-resumen"><h2>' + esc(p.nombre) + '</h2><button type="button" class="icono" data-accion="lug-cerrar-pieza" aria-label="Cerrar">✕</button></div>' +
    '<p class="nota-corta">' + esc(p.grupo) + ' · ' + plural(ls.length, 'lugar', 'lugares') + '</p>' +
    (ls.length ? '<ul class="lista-lugares">' + ls.map(fila).join('') + '</ul>' : '') +
    '<div class="botones-rapidos">' + (ls.some((l) => l.estado === 'visitado') ? '<button type="button" class="boton secundario" data-accion="lug-quitar-pieza" data-p="' + p.id + '">↩ Quitar de visitados</button>' : '<button type="button" class="boton primario" data-accion="lug-ya-estuve" data-p="' + p.id + '">✓ Ya estuve aquí</button>') + '<button type="button" class="boton secundario" data-accion="lug-nuevo" data-p="' + p.id + '">＋ Agregar lugar aquí</button></div></section>';
}

// ---------- Lista ----------
function fila(l) {
  const v = l.estado === 'visitado', detalle = [dondeEs(l), v ? ((l.visitas || []).length ? plural(l.visitas.length, 'visita') : '') : l.horas ? horas(l.horas) : ''].filter(Boolean).join(' · ');
  return '<li><button type="button" class="fila-lugar' + (l.id === abierto ? ' activa' : '') + '" data-accion="lug-abrir" data-id="' + l.id + '"><span class="lug-emoji" aria-hidden="true">' + esc(l.emoji || '📍') + '</span>' +
    '<span class="lug-txt"><b>' + esc(l.nombre) + '</b><small>' + esc(detalle) + '</small></span><span class="lug-estado ' + (v ? 'v' : 'q') + '">' + (v ? '●' : '☆') + '</span></button></li>';
}
const opciones = (valores, actual, todas) => '<option value="">' + todas + '</option>' + valores.map(([v, t]) => '<option value="' + esc(v) + '"' + (v === actual ? ' selected' : '') + '>' + esc(t) + '</option>').join('');

function listaLugares() {
  const delMapa = lista().filter(enElMapa), ls = ordenar(filtrar(delMapa, filtro, grupoDe)), paises = [...new Set(delMapa.map((l) => l.pais).filter(Boolean))].sort();
  const chip = (v, t) => '<button type="button" class="chip' + (filtro.estado === v ? ' activo' : '') + '" data-accion="lug-estado" data-v="' + v + '">' + t + '</button>';
  return '<section class="tarjeta"><div class="fila-resumen"><h2>Lugares (' + ls.length + ')</h2><button type="button" class="boton primario" data-accion="lug-nuevo">＋ Agregar lugar</button></div>' +
    '<div class="chips">' + chip('', 'Todos') + chip('visitado', '● Visitados') + chip('quiero', '☆ Por visitar') + '</div>' +
    '<div class="filtros-lugar"><input type="search" data-cambio="lug-filtro" data-k="texto" placeholder="Buscar" aria-label="Buscar lugar" value="' + esc(filtro.texto) + '">' +
    '<select data-cambio="lug-filtro" data-k="pais" aria-label="País">' + opciones(paises.map((p) => [p, p]), filtro.pais, 'Todos los países') + '</select>' +
    '<select data-cambio="lug-filtro" data-k="grupo" aria-label="Región">' + opciones(mapa.grupos.map((g) => [g, g]), filtro.grupo, 'Todas las regiones') + '</select>' +
    '<select data-cambio="lug-filtro" data-k="tipo" aria-label="Tipo">' + opciones(Object.entries(TIPOS_LUGAR), filtro.tipo, 'Todos los tipos') + '</select></div>' +
    (ls.length ? '<ul class="lista-lugares">' + ls.map(fila).join('') + '</ul>' : '<p class="nota-corta">Nada con estos filtros.</p>') + '</section>';
}

// ---------- Detalle de un lugar ----------
// Las fotos no se guardan en la app: cada visita puede llevar un enlace a su carpeta de Drive
const verFotos = (v) => (enlaceSeguro(v.enlace) ? '<a class="ver-fotos" href="' + esc(enlaceSeguro(v.enlace)) + '" target="_blank" rel="noopener noreferrer">📷 Ver fotos</a>' : '');
function detalle() {
  const l = abierto && buscar(abierto);
  if (!l) return '';
  const v = l.estado === 'visitado', finanzas = ve('seccion', 'finanzas');
  const datos = [TIPOS_LUGAR[l.tipo], dondeEs(l), !v && l.prioridad ? 'Prioridad ' + ['alta', 'media', 'baja'][l.prioridad - 1] : '', !v && l.epoca ? 'Mejor época: ' + l.epoca : '',
    !v && l.horas ? horas(l.horas) : '', !v && l.presupuesto ? 'Presupuesto ≈ ' + pesos(l.presupuesto) : ''].filter(Boolean);
  return '<section class="tarjeta detalle-lugar"><div class="fila-resumen"><h2>' + esc((l.emoji || '📍') + ' ' + l.nombre) + '</h2><button type="button" class="icono" data-accion="lug-cerrar" aria-label="Cerrar">✕</button></div>' +
    '<p class="nota-corta">' + datos.map(esc).join(' · ') + '</p>' +
    '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="lug-cambiar-estado" data-id="' + l.id + '">' + (v ? '☆ Pasar a quiero ir' : '✓ Ya estuve') + '</button>' +
    '<button type="button" class="boton secundario" data-accion="lug-editar" data-id="' + l.id + '">✏️ Editar</button><button type="button" class="boton secundario" data-accion="lug-borrar" data-id="' + l.id + '">🗑️ Borrar</button></div>' +
    ((l.visitas || []).length ? '<h3>Visitas</h3><ul class="visitas-lugar">' + l.visitas.map((x, i) => '<li><div><b>' + esc(x.fecha ? fechaCorta(x.fecha) : 'Sin fecha') + '</b> <span class="lug-cal">' + estrellas(x.calificacion) + '</span>' +
      '<small>' + [x.con ? 'Con ' + x.con : '', x.gasto ? pesos(x.gasto) : ''].filter(Boolean).map(esc).join(' · ') + '</small>' + (x.nota ? '<p>' + esc(x.nota) + '</p>' : '') + verFotos(x) +
      '<details class="editar-enlace"><summary>🔗 ' + (x.enlace ? 'Cambiar enlace' : 'Agregar enlace de fotos') + '</summary><input type="url" inputmode="url" data-cambio="lug-enlace" data-id="' + l.id + '" data-i="' + i + '" placeholder="https://drive.google.com/…" aria-label="Enlace de las fotos" value="' + esc(x.enlace || '') + '"></details></div>' +
      '<button type="button" class="icono" data-accion="lug-borrar-visita" data-id="' + l.id + '" data-i="' + i + '" aria-label="Borrar visita">🗑️</button></li>').join('') + '</ul>' : '') +
    '<details class="form-visita"' + (v && !(l.visitas || []).length ? ' open' : '') + '><summary>＋ Agregar visita</summary><div data-visita="' + l.id + '">' +
    '<label class="campo">Fecha<input type="date" name="fecha" value="' + iso() + '"></label><label class="campo">Con quién<input type="text" name="con"></label>' +
    '<label class="campo">Calificación<select name="calificacion"><option value="0">Sin calificar</option>' + [5, 4, 3, 2, 1].map((n) => '<option value="' + n + '">' + estrellas(n) + '</option>').join('') + '</select></label>' +
    '<label class="campo">Nota<textarea name="nota" rows="2"></textarea></label><label class="campo">Enlace de las fotos (Drive, opcional)<input type="url" inputmode="url" name="enlace" placeholder="https://drive.google.com/…"></label><label class="campo">Gasto<input type="text" inputmode="numeric" data-pesos name="gasto" placeholder="0"></label>' +
    (finanzas ? '<label class="interruptor"><input type="checkbox" name="finanzas" checked> Guardar el gasto en Finanzas (Salidas y ocio)</label>' : '') +
    '<button type="button" class="boton primario ancho" data-accion="lug-guardar-visita" data-id="' + l.id + '">Guardar visita</button></div></details></section>';
}

// ---------- Formulario de lugar ----------
function formulario() {
  if (!borrador) return '';
  const b = borrador, grupos = mapa.grupos.map((g) => '<optgroup label="' + esc(g) + '">' + mapa.piezas.filter((p) => p.grupo === g && !mapaHijo(MAPAS, mapa.id, p.id)).map((p) => '<option value="' + p.id + '"' + (p.id === b.pieza ? ' selected' : '') + '>' + esc(p.nombre) + '</option>').join('') + '</optgroup>').join('');
  return '<section class="tarjeta" data-form-lugar><h2>' + (b.id ? 'Editar lugar' : 'Nuevo lugar') + '</h2>' +
    '<label class="campo">Nombre<input type="text" name="nombre" value="' + esc(b.nombre || '') + '"></label><label class="campo">Emoji<input type="text" maxlength="4" name="emoji" value="' + esc(b.emoji || '📍') + '"></label>' +
    '<label class="campo">Tipo<select name="tipo">' + Object.entries(TIPOS_LUGAR).map(([k, t]) => '<option value="' + k + '"' + (k === b.tipo ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></label>' +
    '<label class="campo">Estado<select name="estado"><option value="quiero"' + (b.estado !== 'visitado' ? ' selected' : '') + '>☆ Quiero ir</option><option value="visitado"' + (b.estado === 'visitado' ? ' selected' : '') + '>● Visitado</option></select></label>' +
    '<label class="campo">' + esc(una()) + '<select name="pieza"><option value="">Escoge…</option>' + grupos + '</select></label>' +
    '<button type="button" class="boton secundario ancho" data-accion="lug-ubicar">📍 Tocar el mapa para ubicarlo</button>' +
    '<p class="nota-corta">' + (b.lat != null ? 'Punto: ' + b.lat.toFixed(4) + ', ' + b.lon.toFixed(4) : 'Sin tocar el mapa, el punto queda en el centro.') + '</p>' +
    '<label class="campo">Prioridad<select name="prioridad">' + [[1, 'Alta'], [2, 'Media'], [3, 'Baja']].map(([n, t]) => '<option value="' + n + '"' + (n === (b.prioridad || 2) ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></label>' +
    '<label class="campo">Mejor época<input type="text" name="epoca" value="' + esc(b.epoca || '') + '"></label>' +
    '<label class="campo">Horas desde Medellín<input type="number" inputmode="decimal" min="0" step="0.5" name="horas" value="' + esc(b.horas ?? '') + '"></label>' +
    '<label class="campo">Presupuesto aproximado<input type="text" inputmode="numeric" data-pesos name="presupuesto" value="' + esc(b.presupuesto || '') + '"></label>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="lug-guardar">Guardar</button><button type="button" class="boton secundario" data-accion="lug-cancelar">Cancelar</button></div></section>';
}
function leerForm() {
  const caja = document.querySelector('[data-form-lugar]'), val = (n) => caja.querySelector('[name="' + n + '"]').value.trim();
  return { ...borrador, nombre: val('nombre'), emoji: val('emoji'), tipo: val('tipo'), estado: val('estado'), pieza: val('pieza'), prioridad: Number(val('prioridad')), epoca: val('epoca'), horas: Number(val('horas')) || 0, presupuesto: leerMonto(val('presupuesto')) || 0 };
}

// ---------- Línea de tiempo y Sorpréndeme ----------
function tiempo() {
  const t = lineaTiempo(lista());
  return '<section class="tarjeta"><h2>Línea de tiempo</h2>' + (t.length ? '<ol class="tiempo-lugar">' + t.map(({ lugar: l, visita: v }) =>
    '<li><button type="button" data-accion="lug-abrir" data-id="' + l.id + '"><small>' + esc(fechaCorta(v.fecha)) + '</small><b>' + esc((l.emoji || '📍') + ' ' + l.nombre) + '</b><span class="lug-cal">' + estrellas(v.calificacion) + '</span>' +
    (v.con || v.nota ? '<small>' + [v.con ? 'Con ' + v.con : '', v.nota].filter(Boolean).map(esc).join(' · ') + '</small>' : '') + '</button>' + verFotos(v) + '</li>').join('') + '</ol>' : '<p class="nota-corta">Cuando agregues una visita con fecha, tus viajes aparecen aquí.</p>') + '</section>';
}
function sorpresa() {
  const p = plan && buscar(plan.principal);
  const tarjeta = '<section class="tarjeta sorpresa"><div class="fila-resumen"><h2>🎲 Sorpréndeme</h2><button type="button" class="boton primario" data-accion="lug-sorpresa">' + (p ? 'Otro plan' : 'Dame un plan') + '</button></div>';
  if (!plan) return tarjeta + '<p class="nota-corta">Un plan de fin de semana entre los lugares de Antioquia que quieres conocer, según la distancia y la prioridad.</p></section>';
  if (!p) return tarjeta + '<p class="nota-corta">No hay lugares por visitar a menos de 4 horas. Agrega alguno.</p></section>';
  const cerca = plan.cercanos.map(buscar).filter(Boolean);
  return tarjeta + '<p class="plan-titulo">' + esc((p.emoji || '📍') + ' ' + p.nombre) + '</p><p class="nota-corta">' + esc(dondeEs(p)) + ' · ' + horas(p.horas) + ' · ' + (plan.dias === 2 ? 'mejor con noche' : 'da para ir y volver el mismo día') + '</p>' +
    (cerca.length ? '<p class="nota-corta">Cerca: ' + cerca.map((x) => esc(x.nombre)).join(', ') + '</p>' : '') + '<button type="button" class="boton secundario" data-accion="lug-abrir" data-id="' + p.id + '">Ver en el mapa</button></section>';
}

export function vistaLugares() {
  if (!mapa) {
    if (!errorMapa) abrirMapa(MAPA_INICIAL);
    return '<h1>Lugares</h1><section class="tarjeta">' + (errorMapa ? '<p>No se pudo abrir el mapa.</p><button type="button" class="boton primario" data-accion="lug-reintentar">Reintentar</button>' : '<p class="nota-corta">Abriendo el mapa…</p>') + '</section>';
  }
  const ruta = migas(MAPAS, mapa.id);
  return '<h1>Lugares</h1><nav class="migas-mapa" aria-label="Mapa abierto">' + ruta.map((m, i) => (i === ruta.length - 1
    ? '<span aria-current="page">' + m.icono + ' ' + esc(m.nombre) + '</span>'
    : '<button type="button" data-accion="lug-mapa" data-id="' + m.id + '">' + m.icono + ' ' + esc(m.nombre) + '</button><span aria-hidden="true">›</span>')).join('') +
    (mapa.id === 'colombia' ? '<button type="button" class="miga-otro" data-accion="lug-mapa" data-id="brasil">🇧🇷 Brasil</button>' : mapa.id === 'brasil' ? '<button type="button" class="miga-otro" data-accion="lug-mapa" data-id="colombia">🇨🇴 Colombia</button>' : '') + '</nav>' + numeros() +
    (ubicando ? '<p class="aviso">📍 Toca el punto exacto en el mapa. <button type="button" class="boton secundario" data-accion="lug-no-ubicar">Cancelar</button></p>' : '') +
    '<section class="tarjeta tarjeta-mapa">' + dibujo() + '<div class="chips grupos-zoom"><button type="button" class="chip" data-accion="lug-grupo" data-g="">Todo</button>' + mapa.grupos.map((g) => '<button type="button" class="chip" data-accion="lug-grupo" data-g="' + esc(g) + '">' + esc(g) + '</button>').join('') + '</div></section>' +
    formulario() + detalle() + panelPieza() + sorpresa() + grupos() + listaLugares() + tiempo();
}

// ---------- Zoom y arrastre ----------
const svg = () => document.querySelector('.mapa-svg');
function aplicarCaja() {
  const s = svg();
  if (!s) return;
  s.setAttribute('viewBox', [caja.x, caja.y, caja.w, caja.h].join(' '));
  s.style.setProperty('--z', 1000 / caja.w);
  s.classList.toggle('con-zoom', caja.w < mapa.ancho - 1);
}
function limitar(c) {
  const w = Math.max(mapa.ancho / 32, Math.min(mapa.ancho, c.w)), h = w * mapa.alto / mapa.ancho;
  return { x: Math.max(0, Math.min(mapa.ancho - w, c.x)), y: Math.max(0, Math.min(mapa.alto - h, c.y)), w, h };
}
function zoomEn(f, x, y) {
  const w = caja.w / f, r = limitar({ x: x - (x - caja.x) / f, y: y - (y - caja.y) / f, w });
  caja = r;
  aplicarCaja();
}
let animacion = null;
function irA(destino) {
  cancelAnimationFrame(animacion);
  const d = limitar(ajustar(destino)), o = { ...caja }, t0 = performance.now(), quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paso = (t) => {
    const a = quieto ? 1 : Math.min(1, (t - t0) / 400), s = a * (2 - a);
    caja = { x: o.x + (d.x - o.x) * s, y: o.y + (d.y - o.y) * s, w: o.w + (d.w - o.w) * s, h: o.h + (d.h - o.h) * s };
    aplicarCaja();
    if (a < 1) animacion = requestAnimationFrame(paso);
  };
  animacion = requestAnimationFrame(paso);
}
// La caja conserva la forma del mapa y deja adentro todo lo pedido
function ajustar(c) {
  const r = mapa.alto / mapa.ancho, w = Math.max(c.w, c.h / r), h = w * r;
  return { x: c.x + c.w / 2 - w / 2, y: c.y + c.h / 2 - h / 2, w, h };
}
function aMapa(s, cx, cy) {
  const m = s.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
  return [p.x, p.y];
}

const dedos = new Map();
let gesto = null;
function tocar(objetivo, x, y) {
  if (ubicando) {
    const [lat, lon] = desproyectar(mapa, x, y), p = piezaEn(mapa, x, y);
    if (!p) { toast('Ese punto queda fuera de ' + mapa.nombre); return; }
    const adentro = mapaHijo(MAPAS, mapa.id, p.id);
    if (adentro) { toast('Entra primero al mapa de ' + adentro.nombre + ' para ubicarlo'); return; }
    borrador = { ...borrador, lat, lon, pieza: p.id };
    ubicando = false;
    repintar();
    return;
  }
  const pt = objetivo.closest && objetivo.closest('[data-lugar]'), pz = objetivo.closest && objetivo.closest('[data-pieza]');
  if (pt) { abierto = pt.dataset.lugar; piezaSel = null; repintar(); return; }
  if (pz) {
    const hijo = mapaHijo(MAPAS, mapa.id, pz.dataset.pieza);
    if (hijo) { cambiarMapa(hijo.id); return; }
    piezaSel = pz.dataset.pieza === piezaSel ? null : pz.dataset.pieza; abierto = null; repintar();
  }
}
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', (ev) => {
    const s = ev.target.closest && ev.target.closest('.mapa-svg');
    if (!s) return;
    dedos.set(ev.pointerId, [ev.clientX, ev.clientY]);
    gesto = dedos.size === 1 ? { objetivo: ev.target, x0: ev.clientX, y0: ev.clientY, movio: false } : { ...gesto, movio: true };
    cancelAnimationFrame(animacion);
  });
  document.addEventListener('pointermove', (ev) => {
    if (!dedos.has(ev.pointerId)) return;
    const s = svg();
    if (!s) return;
    const antes = dedos.get(ev.pointerId);
    if (dedos.size === 2) {
      const otro = [...dedos.entries()].find(([k]) => k !== ev.pointerId)[1];
      const d0 = Math.hypot(antes[0] - otro[0], antes[1] - otro[1]), d1 = Math.hypot(ev.clientX - otro[0], ev.clientY - otro[1]);
      if (d0 > 0) { const [x, y] = aMapa(s, (ev.clientX + otro[0]) / 2, (ev.clientY + otro[1]) / 2); zoomEn(d1 / d0, x, y); }
    } else if (dedos.size === 1 && gesto) {
      if (Math.hypot(ev.clientX - gesto.x0, ev.clientY - gesto.y0) > 6) gesto.movio = true;
      if (gesto.movio && caja.w < mapa.ancho) {
        const [ax, ay] = aMapa(s, antes[0], antes[1]), [bx, by] = aMapa(s, ev.clientX, ev.clientY);
        caja = limitar({ ...caja, x: caja.x + ax - bx, y: caja.y + ay - by });
        aplicarCaja();
      }
    }
    dedos.set(ev.pointerId, [ev.clientX, ev.clientY]);
  });
  const soltar = (ev) => {
    if (!dedos.delete(ev.pointerId)) return;
    if (ev.type === 'pointerup' && !dedos.size && gesto && !gesto.movio) {
      const s = svg();
      if (s) { const [x, y] = aMapa(s, ev.clientX, ev.clientY); tocar(gesto.objetivo, x, y); }
    }
    if (!dedos.size) gesto = null;
  };
  document.addEventListener('pointerup', soltar);
  document.addEventListener('pointercancel', soltar);
  document.addEventListener('wheel', (ev) => {
    const s = ev.target.closest && ev.target.closest('.mapa-svg');
    if (!s) return;
    ev.preventDefault();
    const [x, y] = aMapa(s, ev.clientX, ev.clientY);
    zoomEn(ev.deltaY < 0 ? 1.25 : 0.8, x, y);
  }, { passive: false });
}

// País, región y municipio de un lugar según la pieza donde queda y el mapa abierto
function lugarDePieza(pz) {
  const info = MAPAS[mapa.id];
  return { pais: info.pais || pz.nombre, region: !info.padre ? '' : info.unidad === 'municipios' ? mapa.nombre : pz.nombre, municipio: info.unidad === 'municipios' ? pz.nombre : '', pieza: pz.id };
}

// ---------- Acciones ----------
registrar({
  'lug-reintentar'() { abrirMapa(MAPA_INICIAL); repintar(); },
  'lug-mapa'({ id }) { cambiarMapa(id, migas(MAPAS, mapa.id).some((m) => m.id === id) ? 'mapa-sale' : 'mapa-entra'); },
  'lug-zoom'({ f }) { zoomEn(Number(f), caja.x + caja.w / 2, caja.y + caja.h / 2); },
  'lug-grupo'({ g }) { irA(g ? cajaDe(mapa.piezas.filter((p) => p.grupo === g)) : entero()); },
  'lug-cerrar-pieza'() { piezaSel = null; repintar(); },
  'lug-cerrar'() { abierto = null; repintar(); },
  'lug-estado'({ v }) { filtro.estado = v; repintar(); },
  'lug-filtro'({ k }, el) { filtro[k] = el.value; repintar(); },
  async 'lug-abrir'({ id }) {
    const l = buscar(id);
    // Si su punto no se ve en este mapa, se abre el mapa donde está
    if (l && l.mapa !== mapa.id && (!enElMapa(l) || l.estado !== 'visitado')) await cambiarMapa(l.mapa);
    abierto = id; piezaSel = null;
    repintar();
    if (l && l.lat != null) {
      const [x, y] = proyectar(mapa, l.lat, l.lon);
      setTimeout(() => { irA({ x: x - mapa.ancho / 8, y: y - mapa.alto / 8, w: mapa.ancho / 4, h: mapa.alto / 4 }); document.querySelector('.tarjeta-mapa')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
    }
  },
  'lug-ya-estuve'({ p }) {
    const pz = mapa.piezas.find((x) => x.id === p);
    const [lat, lon] = desproyectar(mapa, ...pz.centro);
    if (!marcarPieza(lista().filter((l) => l.mapa === mapa.id), pz)) lista().push({ id: nuevoId(), nombre: pz.nombre, ...lugarDePieza(pz), mapa: mapa.id, tipo: 'pueblo', emoji: '📍', lat, lon, estado: 'visitado', visitas: [], marcaEntera: true });
    guardar();
    toast('✓ ' + pz.nombre + ' marcado como visitado');
  },
  'lug-quitar-pieza'({ p }) {
    desmarcarPieza(lista(), mapa.id, p, MAPAS);
    guardar();
    toast('Quitado de visitados');
  },
  'lug-nuevo'({ p }) { borrador = { tipo: 'pueblo', estado: 'quiero', pieza: p || '', prioridad: 2 }; abierto = null; repintar(); setTimeout(() => document.querySelector('[data-form-lugar]')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30); },
  async 'lug-editar'({ id }) {
    const l = buscar(id);
    if (l.mapa !== mapa.id) await cambiarMapa(l.mapa);
    borrador = { ...l };
    repintar(); setTimeout(() => document.querySelector('[data-form-lugar]')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  },
  'lug-cancelar'() { borrador = null; ubicando = false; repintar(); },
  'lug-ubicar'() { borrador = leerForm(); ubicando = true; repintar(); setTimeout(() => document.querySelector('.tarjeta-mapa')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30); },
  'lug-no-ubicar'() { ubicando = false; repintar(); },
  'lug-guardar'() {
    const b = leerForm();
    if (!b.nombre) { toast('Escribe el nombre'); return; }
    const pz = mapa.piezas.find((x) => x.id === b.pieza);
    if (!pz) { toast('Escoge ' + una().toLowerCase() + ' o toca el mapa'); return; }
    // Si cambió de municipio sin tocar el mapa, el punto pasa al centro del municipio nuevo
    const antes = b.id && buscar(b.id), moverCentro = b.lat == null || (antes && antes.pieza !== b.pieza && antes.lat === b.lat);
    if (moverCentro) [b.lat, b.lon] = desproyectar(mapa, ...pz.centro);
    Object.assign(b, lugarDePieza(pz), { mapa: mapa.id, visitas: b.visitas || [] });
    if (antes) Object.assign(antes, b); else { b.id = nuevoId(); lista().push(b); }
    abierto = b.id; borrador = null; piezaSel = null;
    guardar();
    toast('Guardado: ' + b.nombre);
  },
  'lug-cambiar-estado'({ id }) {
    const l = buscar(id);
    l.estado = l.estado === 'visitado' ? 'quiero' : 'visitado';
    guardar();
  },
  'lug-borrar'({ id }) {
    const l = buscar(id);
    if (!l || !confirm('¿Borrar ' + l.nombre + ' y sus visitas? Los gastos que estén en Finanzas se quedan allá.')) return;
    lista().splice(lista().indexOf(l), 1);
    abierto = null;
    guardar();
  },
  'lug-guardar-visita'({ id }) {
    const l = buscar(id), caja = document.querySelector('[data-visita="' + id + '"]');
    const val = (n) => { const c = caja.querySelector('[name="' + n + '"]'); return c ? c.value.trim() : ''; };
    const fecha = val('fecha') || iso(), gasto = leerMonto(val('gasto')) || 0, enFinanzas = caja.querySelector('[name="finanzas"]')?.checked;
    const enlace = enlaceSeguro(val('enlace'));
    if (val('enlace') && !enlace) { toast('Ese enlace no es válido: debe empezar por https://'); return; }
    agregarVisita(l, { fecha, con: val('con'), calificacion: Number(val('calificacion')) || 0, nota: val('nota'), gasto, enlace });
    if (gasto && enFinanzas) nuevoMovimiento({ tipo: 'gasto', monto: gasto, categoria: 'ocio', metodo: 'efectivo', nota: l.nombre, fecha });
    guardar();
    toast('✓ Visita guardada' + (gasto && enFinanzas ? ' y gasto en Finanzas' : ''));
  },
  'lug-enlace'({ id, i }, el) {
    const v = buscar(id).visitas[Number(i)], enlace = enlaceSeguro(el.value);
    if (el.value.trim() && !enlace) { toast('Ese enlace no es válido: debe empezar por https://'); return; }
    v.enlace = enlace;
    guardar();
  },
  'lug-borrar-visita'({ id, i }) {
    const l = buscar(id), v = l && l.visitas[Number(i)];
    const ultima = l && l.visitas.length === 1;
    if (!v || !confirm('¿Borrar esta visita?' + (ultima ? ' Como es la única, el lugar vuelve a "quiero ir".' : '') + (v.gasto ? ' El gasto en Finanzas se queda allá.' : ''))) return;
    quitarVisita(l, Number(i));
    guardar();
  },
  'lug-sorpresa'() {
    const s = sorprender(lista());
    plan = s ? { principal: s.principal.id, cercanos: s.cercanos.map((x) => x.id), dias: s.dias } : { principal: null, cercanos: [] };
    repintar();
  },
});
