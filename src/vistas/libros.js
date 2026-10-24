// Libros: biblioteca de libros convertidos desde PDF (src/libros). Cada uno con lectura del día, práctica, diario,
// buscador, consejos por situación, conceptos clave, rutina y herramientas. Funciona sin internet.
import { e, guardar, repintar } from '../estado.js';
import { iso, sumarDias, fechaCorta } from '../fechas.js';
import { esc, barra, registrar, toast } from '../ui.js';
import { LIBROS, libro } from '../libros/index.js';
import { progresoInicial, delDia, lecturaQueToca, leidas, racha, afirmacionDelDia, buscar, resultadoEvaluacion } from '../biblioteca.js';

let actual = null, pestana = 'hoy', abierto = null, consulta = '', consejo = null;
// Herramientas y fichas desplegadas: siguen abiertas después de repintar (al guardar un campo)
const desplegados = new Set();
const desplegable = (clave, clase, resumen) => '<details class="' + clase + '"' + (desplegados.has(clave) ? ' open' : '') + '><summary data-accion="libro-desplegar" data-clave="' + clave + '">' + resumen + '</summary>';

const L = () => libro(actual);
// Al mostrar no se escribe nada: el progreso se crea con la primera acción
const VACIO = progresoInicial();
const progreso = (id) => e().libros[id] || VACIO;
const P = () => (e().libros[actual] ??= progresoInicial());
const hoyDe = (id, fecha = iso()) => (((e().dias[fecha] ??= {}).libros ??= {})[id] ??= {});
const total = (l) => l.lecturas.length;
const sesion = (id, texto) => '<button type="button" class="boton secundario" data-accion="sesion" data-sesion="' + id + '">' + texto + '</button>';
const botonesSesiones = () => '<div class="botones-rapidos">' + (L().sesiones || []).map((s) => sesion(s.id, '▶ ' + esc(s.nombre))).join('') + '</div>';
const enlace = (n) => '<button type="button" class="chip" data-accion="libro-abrir" data-n="' + n + '">' + esc(L().unidad) + ' ' + n + ' · ' + esc(L().lecturas[n - 1].titulo) + '</button>';
const campoTexto = (valor, datos, etiqueta, filas = 2) => '<label class="campo">' + esc(etiqueta) +
  '<textarea rows="' + filas + '" ' + datos + '>' + esc(valor || '') + '</textarea></label>';

// ---------- Hoy: la lectura ----------
function cabecera() {
  const l = L(), n = leidas(l, P()), r = racha(l.id, P(), e().dias), meta = l.racha;
  return '<section class="tarjeta"><div class="fila-resumen"><b>📖 ' + n + ' de ' + total(l) + ' lecturas' + (P().vuelta > 1 ? ' · vuelta ' + P().vuelta : '') + '</b>' +
    '<span>🔥 ' + r + (r === 1 ? ' día' : ' días') + ' seguidos</span></div>' + barra(n / total(l)) +
    (meta ? '<p class="nota-corta">' + esc(meta.texto) + ': ' + (r >= meta.meta ? '¡cumplida! Sigue hasta volverlo automático.' : 'te faltan ' + (meta.meta - r) + ' días seguidos. Si fallas uno, vuelve al camino al otro día.') + '</p>' : '') + '</section>';
}

function lectura(n) {
  const l = L(), d = l.lecturas[n - 1], p = P().practica[n] || {}, leida = P().leidos[n];
  return '<article class="tarjeta lectura-libro">' +
    '<div class="fila-resumen"><span class="dia-libro">' + esc(l.unidad.toUpperCase()) + ' ' + String(n).padStart(2, '0') + ' DE ' + total(l) + '</span>' +
    (leida ? '<span class="nota-corta">✓ leída el ' + fechaCorta(leida) + '</span>' : '') + '</div>' +
    '<h2 class="titulo-libro">' + esc(d.titulo) + '</h2>' +
    '<p class="idea-libro">' + esc(d.idea) + '</p><p>' + esc(d.intro) + '</p>' +
    d.bloques.map(([t, puntos]) => '<h3 class="sub-libro">' + esc(t) + '</h3><ul class="puntos-libro">' + puntos.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>').join('') +
    ((d.formulas || []).length ? '<div class="formula-libro"><b>Fórmulas</b>' + d.formulas.map((x) => '<div>' + esc(x) + '</div>').join('') + '</div>' : '') +
    (d.nota ? '<div class="nota-libro"><b>💡 Para tener en cuenta</b><div>' + esc(d.nota) + '</div></div>' : '') +
    (d.afirmacion ? '<div class="afirmacion-libro">“' + esc(d.afirmacion) + '”</div>' : '') +
    '<h3 class="sub-libro">✅ Práctica</h3><div class="practica-libro">' + d.practica.map((x, i) =>
      '<button type="button" class="paso-libro' + (p[i] ? ' hecho' : '') + '" data-accion="libro-practica" data-n="' + n + '" data-i="' + i + '" aria-pressed="' + !!p[i] + '">' +
      '<span class="check-libro">' + (p[i] ? '✓' : '') + '</span><span>' + esc(x) + '</span></button>').join('') + '</div>' +
    '<h3 class="sub-libro">✍️ Diario</h3>' + campoTexto(P().notas[n], 'data-cambio="libro-nota" data-n="' + n + '"', d.pregunta, 3) +
    '<button type="button" class="boton ' + (leida ? 'secundario' : 'primario') + ' grande ancho" data-accion="libro-leida" data-n="' + n + '">' + (leida ? '↩ Marcar como no leída' : '✓ Terminé la lectura de hoy') + '</button>' +
    '<div class="botones-rapidos">' +
    (n > 1 ? '<button type="button" class="boton secundario grande" data-accion="libro-abrir" data-n="' + (n - 1) + '">← ' + esc(l.unidad) + ' ' + (n - 1) + '</button>' : '') +
    (n < total(l) ? '<button type="button" class="boton secundario grande" data-accion="libro-abrir" data-n="' + (n + 1) + '">' + esc(l.unidad) + ' ' + (n + 1) + ' →</button>' : '') + '</div>' +
    '</article>';
}

function tarjetaAfirmacion() {
  const a = afirmacionDelDia(L());
  if (!a) return '';
  const veces = delDia(e().dias, iso(), actual).afirmaciones || 0;
  return '<section class="tarjeta"><div class="fila-resumen"><b>🗣 Afirmación de hoy</b><span class="nota-corta">' + veces + (veces === 1 ? ' vez' : ' veces') + '</span></div>' +
    '<p class="afirmacion-libro">“' + esc(a) + '”</p>' +
    '<p class="nota-corta">Dila en voz alta, con emoción y viéndote así (palabras + imágenes + emoción).</p>' +
    '<button type="button" class="boton secundario ancho" data-accion="libro-afirmar">🔁 La dije (+1)</button></section>';
}

function pestanaHoy() {
  const toca = lecturaQueToca(L(), P()), n = abierto || toca;
  if (!n) {
    return cabecera() + '<section class="tarjeta"><h2>🎉 ¡Completaste las ' + total(L()) + ' lecturas!</h2>' +
      '<p>Repetirlo es como un hábito: cada vuelta lo graba más hondo. Tus notas, fichas y perfil se quedan.</p>' +
      '<button type="button" class="boton primario grande ancho" data-accion="libro-vuelta">🔁 Empezar la vuelta ' + (P().vuelta + 1) + '</button></section>' +
      tarjetaAfirmacion();
  }
  return cabecera() + (abierto && abierto !== toca && toca ? '<p class="nota-corta">Estás viendo ' + esc(L().unidad.toLowerCase()) + ' ' + abierto + '. <a href="#libros" data-accion="libro-abrir" data-n="0">Volver a la de hoy (' + toca + ')</a></p>' : '') +
    tarjetaAfirmacion() + lectura(n);
}

// ---------- Todas las lecturas ----------
function pestanaLecturas() {
  const toca = lecturaQueToca(L(), P());
  return '<section class="tarjeta"><ol class="lista-libro">' + L().lecturas.map((d) => {
    const leida = P().leidos[d.n], p = Object.keys(P().practica[d.n] || {}).length;
    return '<li class="' + (leida ? 'leida' : d.n === toca ? 'toca' : '') + '"><button type="button" data-accion="libro-abrir" data-n="' + d.n + '">' +
      '<span class="num-libro">' + (leida ? '✓' : d.n) + '</span><span><b>' + esc(d.titulo) + '</b><small>' + esc(d.idea) + '</small>' +
      (p ? '<small>Práctica ' + p + '/' + d.practica.length + (P().notas[d.n] ? ' · con nota' : '') + '</small>' : '') + '</span></button></li>';
  }).join('') + '</ol></section>';
}

// ---------- Preguntar ----------
function tarjetaConsejo(c) {
  return '<section class="tarjeta"><h2>' + c.icono + ' ' + esc(c.texto) + '</h2>' +
    '<h3 class="sub-libro">Haz esto ahora</h3><ol class="puntos-libro">' + c.ahora.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol>' +
    (c.pregunta ? '<div class="nota-libro"><b>🤔 Para reflexionar</b><div>' + esc(c.pregunta) + '</div></div>' : '') +
    (c.afirmacion ? '<p class="afirmacion-libro">“' + esc(c.afirmacion) + '”</p>' : '') +
    (c.herramienta ? '<button type="button" class="boton primario ancho" data-accion="libro-herramienta" data-h="' + c.herramienta + '">Abrir la herramienta →</button>' : '') +
    (c.sesion ? '<div class="botones-rapidos">' + sesion(c.sesion, '▶ Sesión guiada') + '</div>' : '') +
    '<h3 class="sub-libro">Relee</h3><div class="chips envolver">' + c.dias.map(enlace).join('') + '</div></section>';
}

function pestanaPreguntar() {
  const l = L(), r = consulta ? buscar(l, consulta) : null, sel = l.consejos.find((c) => c.id === consejo);
  const boton = (c) => '<button type="button" class="chip' + (c.id === consejo ? ' activo' : '') + '" data-accion="libro-consejo" data-c="' + c.id + '">' + c.icono + ' ' + esc(c.texto) + '</button>';
  return '<section class="tarjeta"><label class="campo">Pregúntale al libro (una palabra o una frase)' +
    '<input type="search" enterkeyhint="search" data-cambio="libro-buscar" value="' + esc(consulta) + '" placeholder="Ej.: ' + esc(l.consejos.slice(0, 3).map((c) => c.texto.toLowerCase()).join(', ')) + '"></label>' +
    (consulta ? '<button type="button" class="boton secundario ancho" data-accion="libro-limpiar">Borrar búsqueda</button>' : '') + '</section>' +
    (r ? resultados(r) : '') + (sel ? tarjetaConsejo(sel) : '') +
    '<h2 class="titulo-grupo">¿Qué te pasa hoy?</h2>' + (l.grupos
      ? l.grupos.map(([titulo, ids]) => '<h3 class="sub-libro">' + titulo + '</h3><div class="consejos-libro">' + ids.map((id) => boton(l.consejos.find((c) => c.id === id))).join('') + '</div>').join('')
      : '<div class="consejos-libro">' + l.consejos.map(boton).join('') + '</div>');
}

function resultados(r) {
  if (!r.consejos.length && !r.lecturas.length && !r.conceptos.length) return '<section class="tarjeta"><p>No encontré eso en el libro. Prueba con otra palabra o elige una situación abajo.</p></section>';
  return r.consejos.map(tarjetaConsejo).join('') +
    (r.lecturas.length ? '<h2 class="titulo-grupo">En las lecturas</h2>' + r.lecturas.map((d) =>
      '<section class="tarjeta"><div class="fila-resumen"><b>' + esc(L().unidad) + ' ' + d.n + ' · ' + esc(d.titulo) + '</b>' +
      '<button type="button" class="boton secundario" data-accion="libro-abrir" data-n="' + d.n + '">Leer →</button></div>' +
      '<ul class="puntos-libro">' + d.puntos.map((p) => '<li>' + esc(p) + '</li>').join('') + '</ul></section>').join('') : '') +
    (r.conceptos.length ? '<h2 class="titulo-grupo">' + esc(L().conceptos.titulo) + '</h2><section class="tarjeta">' + r.conceptos.map(concepto).join('') + '</section>' : '');
}

// ---------- Conceptos (leyes, principios, reglas…) ----------
const concepto = (c) => '<div class="concepto-libro"><b>' + esc(c.nombre) + '</b><div>' + esc(c.texto) + '</div>' +
  '<div class="chips envolver">' + c.dias.map((n) => '<button type="button" class="chip mini" data-accion="libro-abrir" data-n="' + n + '">' + esc(L().unidad) + ' ' + n + '</button>').join('') + '</div></div>';
const pestanaConceptos = () => '<p class="nota-corta">' + L().conceptos.lista.length + ' ' + esc(L().conceptos.titulo.toLowerCase()) + ' del libro, con dónde aparece cada una.</p>' +
  '<section class="tarjeta">' + L().conceptos.lista.map(concepto).join('') + '</section>';

// ---------- Rutina ----------
const pestanaRutina = () => '<p class="nota-corta">Todo el libro convertido en un día. Síguela mientras lo lees (y después).</p>' +
  L().rutina.map(([t, pasos]) => '<section class="tarjeta"><h2>' + t + '</h2><ul class="puntos-libro">' + pasos.map((p) => '<li>' + esc(p) + '</li>').join('') + '</ul></section>').join('') +
  ((L().sesiones || []).length ? '<section class="tarjeta"><h2>🧘 Sesiones guiadas</h2>' + botonesSesiones() + '</section>' : '');

// ---------- Herramientas ----------
function diario() {
  const def = L().diario, hoy = delDia(e().dias, iso(), actual), ayer = def.ayer && delDia(e().dias, sumarDias(iso(), -1), actual)[def.ayer[0]];
  return (ayer ? '<div class="nota-libro"><b>' + esc(def.ayer[1]) + '</b><div class="pre">' + esc(ayer) + '</div></div>' : '') +
    def.campos.map(([k, t]) => campoTexto(hoy[k], 'data-cambio="libro-dia" data-k="' + k + '"', t, 3)).join('');
}

function fichas(tipo) {
  const def = L().fichas[tipo], lista = P().fichas[tipo] || [];
  return (def.lectura ? '<p class="nota-corta">De ' + esc(L().unidad.toLowerCase()) + ' ' + def.lectura + '. <a href="#libros" data-accion="libro-abrir" data-n="' + def.lectura + '">Releer</a></p>' : '') +
    '<button type="button" class="boton primario ancho" data-accion="libro-nueva" data-t="' + tipo + '">' + esc(def.nueva) + '</button>' +
    lista.map((x) => desplegable(x.id, 'ficha-libro', '<b>' + esc(x[def.campos[0][0]] || '(sin escribir)') + '</b> <small>' + fechaCorta(x.fecha) + '</small>') +
      def.campos.map(([k, etiqueta, tipoCampo]) => tipoCampo === 'date'
        ? '<label class="campo">' + esc(etiqueta) + '<input type="date" data-cambio="libro-ficha" data-t="' + tipo + '" data-id="' + x.id + '" data-k="' + k + '" value="' + esc(x[k] || '') + '"></label>'
        : campoTexto(x[k], 'data-cambio="libro-ficha" data-t="' + tipo + '" data-id="' + x.id + '" data-k="' + k + '"', etiqueta)).join('') +
      '<button type="button" class="boton peligro ancho" data-accion="libro-borrar" data-t="' + tipo + '" data-id="' + x.id + '">Borrar</button></details>').join('');
}

// Evaluación: frases mezcladas (para no ver de qué categoría es cada una), resultado por categoría y la evolución
function evaluacion(id) {
  const ev = L().evaluaciones[id], est = (P().evaluaciones || {})[id] || {}, marcados = est.marcados || {}, r = resultadoEvaluacion(ev, marcados);
  const n = ev.items.length, orden = ev.items.map((_, i) => i);
  if (n % 7) orden.sort((a, b) => ((a * 7) % n) - ((b * 7) % n));
  const historial = (est.historial || []).slice(-6).reverse(), cat = ev.categorias;
  return (ev.lectura ? '<p class="nota-corta">De ' + esc(L().unidad.toLowerCase()) + ' ' + ev.lectura + '. <a href="#libros" data-accion="libro-abrir" data-n="' + ev.lectura + '">Releer</a></p>' : '') +
    '<p>' + esc(ev.intro) + '</p><div class="practica-libro">' + orden.map((i) =>
      '<button type="button" class="paso-libro' + (marcados[i] ? ' hecho' : '') + '" data-accion="libro-eval" data-ev="' + id + '" data-i="' + i + '" aria-pressed="' + !!marcados[i] + '">' +
      '<span class="check-libro">' + (marcados[i] ? '✓' : '') + '</span><span>' + esc(ev.items[i][0]) + '</span></button>').join('') + '</div>' +
    (r.principal
      ? '<div class="resultado-eval"><h3 class="sub-libro">Tu resultado</h3>' + Object.entries(r.pct).map(([k, v]) =>
        '<div class="fila-resumen"><span>' + esc(cat[k].nombre) + '</span><b>' + Math.round(v * 100) + ' %</b></div>' + barra(v, k === r.principal ? '' : 'tenue')).join('') +
        '<div class="nota-libro"><b>Estás sobre todo en: ' + esc(cat[r.principal].nombre) + '</b><div>' + esc(cat[r.principal].consejo) + '</div></div>' +
        '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="libro-eval-guardar" data-ev="' + id + '">💾 Guardar resultado de hoy</button>' +
        '<button type="button" class="boton secundario" data-accion="libro-eval-limpiar" data-ev="' + id + '">Empezar de nuevo</button></div></div>'
      : '<p class="nota-corta">Marca las frases para ver tu resultado.</p>') +
    (historial.length ? '<h3 class="sub-libro">Tu evolución</h3><ul class="puntos-libro">' + historial.map((h) =>
      '<li>' + fechaCorta(h.fecha) + ': ' + esc((cat[h.principal] || {}).nombre || h.principal) + '</li>').join('') + '</ul>' : '');
}

function pestanaHerramientas() {
  const l = L(), bloque = (id, titulo, contenido) => desplegable(id, 'tarjeta herramienta-libro', '<h2>' + titulo + '</h2>') + contenido + '</details>';
  return Object.entries(l.evaluaciones || {}).map(([k, ev]) => bloque(k, ev.icono + ' ' + esc(ev.titulo), evaluacion(k))).join('') +
    (l.diario ? bloque('diario', esc(l.diario.titulo), diario()) : '') +
    Object.entries(l.fichas || {}).map(([k, def]) => {
      const n = (P().fichas[k] || []).length;
      return bloque(k, def.icono + ' ' + esc(def.titulo) + (n ? ' (' + n + ')' : ''), fichas(k));
    }).join('') +
    (l.perfil ? bloque('perfil', esc(l.perfil.titulo), l.perfil.campos.map(([k, t]) => campoTexto(P().perfil[k], 'data-cambio="libro-perfil" data-k="' + k + '"', t, 3)).join('')) : '') +
    ((l.sesiones || []).length ? bloque('sesiones', '🧘 Sesiones guiadas', botonesSesiones()) : '');
}

// ---------- Biblioteca y tarjeta para "Hoy" ----------
function biblioteca() {
  return '<h1>Libros</h1><p class="sub">Cada libro, una lectura por día. Para sumar uno, pásale el PDF a Claude con /agregar-libro.</p>' +
    LIBROS.map((l) => {
      const n = leidas(l, progreso(l.id)), toca = lecturaQueToca(l, progreso(l.id));
      return '<button type="button" class="tarjeta libro-tarjeta" data-accion="libro-elegir" data-id="' + l.id + '">' +
        '<span class="libro-icono">' + l.icono + '</span><span><b>' + esc(l.titulo) + '</b><small>' + esc(l.autor) + ' · ' + esc(l.descripcion) + '</small>' +
        '<small>' + (toca ? 'Toca: ' + esc(l.unidad.toLowerCase()) + ' ' + toca + ' · ' : '¡Completo! · ') + n + '/' + total(l) + '</small>' + barra(n / total(l)) + '</span></button>';
    }).join('');
}

export function tarjetasLibrosHoy() {
  // Los libros con lecturas pendientes; si ya se terminaron todos, el primero (para empezar otra vuelta)
  const pendientes = LIBROS.filter((l) => lecturaQueToca(l, progreso(l.id)));
  return (pendientes.length ? pendientes : LIBROS.slice(0, 1)).map((l) => {
    const n = lecturaQueToca(l, progreso(l.id)), a = afirmacionDelDia(l);
    return '<a class="tarjeta libro-hoy" href="#libros/' + l.id + '"><b>' + l.icono + ' ' + esc(l.titulo) + ' · ' +
      (n ? esc(l.unidad) + ' ' + n + ': ' + esc(l.lecturas[n - 1].titulo) : '¡' + total(l) + ' de ' + total(l) + ' lecturas!') + '</b>' +
      (a ? '<span>“' + esc(a) + '”</span>' : '') + '</a>';
  }).join('');
}

export function vistaLibros() {
  if (!L()) return biblioteca();
  const l = L(), tabs = { hoy: '📖 Hoy', lecturas: '📚 ' + total(l) + ' lecturas', preguntar: '💬 Preguntar', herramientas: '🛠 Herramientas', rutina: '🗓 Rutina' };
  if (l.conceptos) tabs.conceptos = l.conceptos.icono + ' ' + l.conceptos.titulo;
  const vistas = { hoy: pestanaHoy, lecturas: pestanaLecturas, preguntar: pestanaPreguntar, herramientas: pestanaHerramientas, rutina: pestanaRutina, conceptos: pestanaConceptos };
  return (LIBROS.length > 1 ? '<button type="button" class="boton secundario" data-accion="libro-elegir" data-id="">← Biblioteca</button>' : '') +
    '<h1>' + l.icono + ' ' + esc(l.titulo) + '</h1><p class="sub">' + esc(l.autor) + ' · ' + esc(l.descripcion) + '</p><nav class="chips pestanas">' +
    Object.entries(tabs).map(([k, t]) => '<button type="button" class="chip' + (k === pestana ? ' activo' : '') + '" data-accion="libro-pestana" data-p="' + k + '">' + esc(t) + '</button>').join('') +
    '</nav>' + (vistas[pestana] || pestanaHoy)();
}

// Con un solo libro, la sección lo abre directo
if (LIBROS.length === 1) actual = LIBROS[0].id;

const irArriba = () => window.scrollTo(0, 0);
function elegir(id) { actual = id || null; pestana = 'hoy'; abierto = null; consulta = ''; consejo = null; desplegados.clear(); }
registrar({
  // "#libros/fenix" abre ese libro
  'abrir-libros'({ p }) { if (libro(p)) elegir(p); },
  'libro-elegir'({ id }) { elegir(id); repintar(); irArriba(); },
  'libro-pestana'({ p }) { pestana = p; repintar(); },
  // El clic llega antes de que el navegador abra o cierre el desplegable
  'libro-desplegar'({ clave }, el) { if (el.parentNode.open) desplegados.delete(clave); else desplegados.add(clave); },
  'libro-abrir'({ n }, el, ev) { if (ev) ev.preventDefault(); abierto = Number(n) || null; pestana = 'hoy'; repintar(); irArriba(); },
  'libro-leida'({ n }) {
    const l = P().leidos;
    if (l[n]) { delete l[n]; guardar(); return; }
    l[n] = iso();
    abierto = null;
    guardar();
    const sig = lecturaQueToca(L(), P());
    toast(sig ? '✓ ' + L().unidad + ' ' + n + ' listo. Sigue: ' + L().unidad.toLowerCase() + ' ' + sig : '🎉 ¡Libro completo!');
    irArriba();
  },
  'libro-practica'({ n, i }) {
    const p = (P().practica[n] ??= {});
    if (p[i]) delete p[i]; else p[i] = iso();
    guardar();
  },
  'libro-nota'({ n }, el) { P().notas[n] = el.value; guardar(); },
  'libro-afirmar'() { const d = hoyDe(actual); d.afirmaciones = (d.afirmaciones || 0) + 1; guardar(); },
  'libro-vuelta'() { const p = P(); p.leidos = {}; p.practica = {}; p.vuelta = (p.vuelta || 1) + 1; abierto = null; guardar(); irArriba(); },
  'libro-buscar'(ds, el) { consulta = el.value.trim(); consejo = null; repintar(); },
  'libro-limpiar'() { consulta = ''; repintar(); },
  'libro-consejo'({ c }) { consejo = consejo === c ? null : c; consulta = ''; repintar(); },
  'libro-herramienta'({ h }) { desplegados.add(h); pestana = 'herramientas'; repintar(); irArriba(); },
  'libro-dia'({ k }, el) { hoyDe(actual)[k] = el.value; guardar(); },
  'libro-perfil'({ k }, el) { P().perfil[k] = el.value; guardar(); },
  'libro-nueva'({ t }) {
    const id = Date.now().toString(36);
    (P().fichas[t] ??= []).unshift({ id, fecha: iso() });
    desplegados.add(t).add(id);
    guardar();
  },
  'libro-eval'({ ev, i }) {
    const x = ((P().evaluaciones ??= {})[ev] ??= {}), m = (x.marcados ??= {});
    if (m[i]) delete m[i]; else m[i] = true;
    guardar();
  },
  'libro-eval-guardar'({ ev }) {
    const x = P().evaluaciones[ev], r = resultadoEvaluacion(L().evaluaciones[ev], x.marcados);
    if (!r.principal) return;
    // Un resultado por día: si ya había uno hoy, se reemplaza
    x.historial = (x.historial || []).filter((h) => h.fecha !== iso());
    x.historial.push({ fecha: iso(), principal: r.principal, pct: r.pct });
    guardar();
    toast('💾 Resultado guardado: ' + L().evaluaciones[ev].categorias[r.principal].nombre);
  },
  'libro-eval-limpiar'({ ev }) { P().evaluaciones[ev].marcados = {}; guardar(); },
  'libro-ficha'({ t, id, k }, el) { const x = (P().fichas[t] || []).find((y) => y.id === id); if (x) { x[k] = el.value; guardar(); } },
  'libro-borrar'({ t, id }) {
    if (!confirm('¿Borrar esta ficha?')) return;
    P().fichas[t] = P().fichas[t].filter((y) => y.id !== id);
    guardar();
  },
});
