// 🛒 Compras: lista del próximo mercado (por categoría, con lo que más compras a un toque) y deseos (con prioridad y la regla de esperar 30 días)
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { esc, registrar, toast, copiarTexto } from '../ui.js';
import { CATEGORIAS, PRIORIDADES, adivinarCategoria, precioDe, pendientes, comprados, total, sinPrecio, porCategoria, frecuentes, consejoDeseo, marcarComprado, textoLista, claveCompra } from '../compras.js';

let tab = 'mercado', editando = null;
const datos = () => (e().compras ??= { lista: [], veces: {} });
const uid = () => 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const pesos = (n) => '$' + Math.round(n).toLocaleString('es-CO');
const NOMBRE_CAT = Object.fromEntries(CATEGORIAS), NOMBRE_PRI = Object.fromEntries(PRIORIDADES);
const opciones = (pares, actual) => pares.map(([id, t]) => '<option value="' + id + '"' + (id === actual ? ' selected' : '') + '>' + t + '</option>').join('');

// Alimentos de la dieta que no están pendientes: para armar el mercado con lo que comes
function deLaDieta() {
  const enLista = new Set(pendientes(datos().lista, 'mercado').map((x) => claveCompra(x.nombre)));
  return ((e().dieta || {}).alimentos || []).filter((a) => a.nombre && a.id !== 'cafe' && !enLista.has(claveCompra(a.nombre))).map((a) => a.nombre);
}

function formulario() {
  const mercado = tab === 'mercado';
  return '<section class="tarjeta compra-nueva"><h2>' + (mercado ? '＋ Agregar al mercado' : '＋ Agregar un deseo') + '</h2>' +
    '<label class="campo">' + (mercado ? 'Producto' : '¿Qué quieres comprar?') + '<input type="text" id="compra-nombre" autocomplete="off" data-enter="compra-agregar" placeholder="' + (mercado ? 'Ej.: pechuga, avena, bananos' : 'Ej.: tenis de fútbol, audífonos') + '"></label>' +
    '<div class="dos">' +
    (mercado ? '<label class="campo">Cantidad<input type="text" id="compra-cant" autocomplete="off" data-enter="compra-agregar" placeholder="Ej.: 2 kg, 30 u"></label>'
      : '<label class="campo">Prioridad<select id="compra-pri">' + opciones(PRIORIDADES, 'quiero') + '</select></label>') +
    '<label class="campo">Precio aprox. (opcional)<input type="text" id="compra-precio" inputmode="numeric" data-pesos autocomplete="off" data-enter="compra-agregar" placeholder="$"></label></div>' +
    (mercado ? '' : '<label class="campo">Enlace o tienda (opcional)<input type="text" id="compra-enlace" autocomplete="off" data-enter="compra-agregar" placeholder="https://… o el nombre de la tienda"></label>') +
    '<button type="button" class="boton primario ancho" data-accion="compra-agregar">Agregar</button>' +
    (mercado ? rapidos() : '') + '</section>';
}

function rapidos() {
  const fr = frecuentes(datos()), dieta = deLaDieta().slice(0, 12);
  const chip = (nombre, cat) => '<button type="button" class="chip mini" data-accion="compra-rapida" data-nombre="' + esc(nombre) + '"' + (cat ? ' data-cat="' + cat + '"' : '') + '>＋ ' + esc(nombre) + '</button>';
  return (fr.length ? '<p class="nota-corta">Lo que más compras:</p><div class="chips-compra">' + fr.map((x) => chip(x.nombre, x.cat)).join('') + '</div>' : '') +
    (dieta.length ? '<details class="nota"><summary>🥗 De tu dieta</summary><div class="chips-compra">' + dieta.map((n) => chip(n)).join('') + '</div></details>' : '');
}

function fila(x) {
  const hoy = iso(), mercado = x.tipo === 'mercado';
  if (editando === x.id) {
    return '<li class="compra editando"><div class="compra-editar">' +
      '<label class="campo">Nombre<input type="text" data-cambio="compra-campo" data-id="' + x.id + '" data-k="nombre" value="' + esc(x.nombre) + '"></label>' +
      '<div class="dos">' + (mercado
        ? '<label class="campo">Cantidad<input type="text" data-cambio="compra-campo" data-id="' + x.id + '" data-k="cant" value="' + esc(x.cant || '') + '"></label>' +
          '<label class="campo">Categoría<select data-cambio="compra-campo" data-id="' + x.id + '" data-k="cat">' + opciones(CATEGORIAS, x.cat || 'otros') + '</select></label>'
        : '<label class="campo">Prioridad<select data-cambio="compra-campo" data-id="' + x.id + '" data-k="prioridad">' + opciones(PRIORIDADES, x.prioridad || 'quiero') + '</select></label>' +
          '<label class="campo">Enlace o tienda<input type="text" data-cambio="compra-campo" data-id="' + x.id + '" data-k="enlace" value="' + esc(x.enlace || '') + '"></label>') + '</div>' +
      '<div class="dos"><label class="campo">Precio aprox.<input type="text" inputmode="numeric" data-pesos data-cambio="compra-campo" data-id="' + x.id + '" data-k="precio" value="' + (Number(x.precio) > 0 ? Math.round(x.precio).toLocaleString('es-CO') : '') + '"></label>' +
      '<label class="campo">Nota<input type="text" data-cambio="compra-campo" data-id="' + x.id + '" data-k="nota" value="' + esc(x.nota || '') + '"></label></div>' +
      '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="compra-editar" data-id="">✓ Listo</button>' +
      '<button type="button" class="boton secundario" data-accion="compra-borrar" data-id="' + x.id + '">🗑 Quitar</button></div></div></li>';
  }
  const enlace = x.enlace && /^https?:\/\//i.test(x.enlace) ? '<a href="' + esc(x.enlace) + '" target="_blank" rel="noopener">Ver ↗</a>' : esc(x.enlace || '');
  const extra = [x.cant && esc(x.cant), Number(x.precio) > 0 && pesos(x.precio), !mercado && enlace, x.nota && esc(x.nota)].filter(Boolean).join(' · ');
  const consejo = !mercado && !x.hecho ? consejoDeseo(x, hoy) : '';
  return '<li class="compra' + (x.hecho ? ' hecha' : '') + '">' +
    '<button type="button" class="compra-check" data-accion="compra-marcar" data-id="' + x.id + '" aria-pressed="' + !!x.hecho + '" aria-label="' + (x.hecho ? 'Desmarcar ' : 'Comprado: ') + esc(x.nombre) + '">' + (x.hecho ? '✓' : '') + '</button>' +
    '<span class="compra-texto"><b>' + esc(x.nombre) + '</b>' + (extra ? '<small>' + extra + '</small>' : '') +
    (x.hecho && x.comprado ? '<small>Comprado el ' + fechaCorta(x.comprado) + '</small>' : '') + (consejo ? '<small class="compra-consejo">⏳ ' + esc(consejo) + '</small>' : '') + '</span>' +
    (x.hecho ? '' : '<button type="button" class="icono" data-accion="compra-editar" data-id="' + x.id + '" aria-label="Editar ' + esc(x.nombre) + '">✏️</button>') + '</li>';
}

function resumen(items) {
  const t = total(items), sp = sinPrecio(items);
  return '<div class="fila-resumen compra-total"><span>' + items.length + (items.length === 1 ? ' cosa' : ' cosas') + (sp && t ? ' · ' + sp + ' sin precio' : '') + '</span>' +
    (t ? '<b>Total aprox. ' + pesos(t) + '</b>' : '') + '</div>';
}

function listaMercado() {
  const items = pendientes(datos().lista, 'mercado');
  if (!items.length) return '<section class="tarjeta"><p class="nota-corta centro">🛒 La lista del mercado está vacía. Agrega lo que te falta o toca lo que más compras.</p></section>';
  return '<section class="tarjeta">' + resumen(items) +
    porCategoria(items).map((g) => '<h3 class="compra-cat">' + g.nombre + '</h3><ul class="compras">' + g.items.map(fila).join('') + '</ul>').join('') +
    '<button type="button" class="boton secundario ancho" data-accion="compra-copiar">📋 Copiar la lista (WhatsApp)</button></section>';
}

function listaDeseos() {
  const items = pendientes(datos().lista, 'deseo');
  if (!items.length) return '<section class="tarjeta"><p class="nota-corta centro">✨ Anota aquí lo que quieres comprar. Si no lo necesitas, espera 30 días: si lo sigues queriendo, no es un impulso.</p></section>';
  const grupos = PRIORIDADES.map(([id, nombre]) => ({ id, nombre, xs: items.filter((x) => (x.prioridad || 'quiero') === id) })).filter((g) => g.xs.length);
  return '<section class="tarjeta">' + resumen(items) +
    grupos.map((g) => '<h3 class="compra-cat">' + g.nombre + (total(g.xs) ? ' <small>' + pesos(total(g.xs)) + '</small>' : '') + '</h3><ul class="compras">' + g.xs.map(fila).join('') + '</ul>').join('') +
    '<p class="nota-corta">Antes de comprar un deseo, revisa en 💰 Finanzas que te alcance sin tocar el ahorro.</p>' +
    '<button type="button" class="boton secundario ancho" data-accion="compra-copiar">📋 Copiar la lista</button></section>';
}

function hechos() {
  const xs = comprados(datos().lista, tab);
  if (!xs.length) return '';
  return '<details class="tarjeta compra-hechos"><summary>✓ Comprado (' + xs.length + ')</summary><ul class="compras">' + xs.map(fila).join('') + '</ul>' +
    '<button type="button" class="boton secundario ancho" data-accion="compra-limpiar">Quitar lo comprado de la lista</button>' +
    (tab === 'mercado' ? '<p class="nota-corta">Lo que compras queda en "Lo que más compras" para el próximo mercado.</p>' : '') + '</details>';
}

export function vistaCompras() {
  const n = (t) => pendientes(datos().lista, t).length;
  return '<div class="cab-vista"><h1>Compras</h1></div>' +
    '<nav class="chips" aria-label="Lista">' + [['mercado', '🛒 Mercado'], ['deseo', '✨ Deseos']].map(([id, t]) =>
      '<button type="button" class="chip' + (tab === id ? ' activo' : '') + '" data-accion="compra-tab" data-t="' + id + '" aria-pressed="' + (tab === id) + '">' + t + (n(id) ? ' · ' + n(id) : '') + '</button>').join('') + '</nav>' +
    formulario() + (tab === 'mercado' ? listaMercado() : listaDeseos()) + hechos();
}

function agregar(nombre, extra = {}) {
  nombre = String(nombre || '').trim();
  if (!nombre) return false;
  const c = datos(), ya = pendientes(c.lista, tab).find((x) => claveCompra(x.nombre) === claveCompra(nombre));
  if (ya) { toast('"' + ya.nombre + '" ya está en la lista'); return false; }
  const item = { id: uid(), tipo: tab, nombre, creado: iso(), hecho: false, ...extra };
  if (tab === 'mercado') item.cat ??= adivinarCategoria(nombre); else item.prioridad ??= 'quiero';
  for (const k of Object.keys(item)) if (item[k] === '' || item[k] == null) delete item[k];
  c.lista.push(item);
  return true;
}

registrar({
  'abrir-compras'({ p }) { if (p === 'deseos' || p === 'deseo') tab = 'deseo'; else if (p === 'mercado') tab = 'mercado'; },
  'compra-tab'({ t }) { tab = t; editando = null; repintar(); },
  'compra-agregar'() {
    const v = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const nombre = v('compra-nombre');
    if (!nombre) { toast('Escribe qué vas a comprar'); document.getElementById('compra-nombre')?.focus(); return; }
    const extra = { precio: precioDe(v('compra-precio')) || null };
    if (tab === 'mercado') extra.cant = v('compra-cant'); else { extra.prioridad = v('compra-pri') || 'quiero'; extra.enlace = v('compra-enlace'); }
    if (!agregar(nombre, extra)) return;
    guardar();
    toast('＋ ' + nombre);
    setTimeout(() => document.getElementById('compra-nombre')?.focus(), 80);
  },
  'compra-rapida'({ nombre, cat }) {
    if (agregar(nombre, cat ? { cat } : {})) { guardar(); toast('＋ ' + nombre); }
  },
  'compra-marcar'({ id }) {
    const c = datos(), x = c.lista.find((y) => y.id === id);
    if (!x) return;
    marcarComprado(c, x, iso(), !x.hecho);
    guardar();
  },
  'compra-editar'({ id }) { editando = id || null; repintar(); },
  'compra-campo'({ id, k }, el) {
    const x = datos().lista.find((y) => y.id === id);
    if (!x) return;
    const val = el.value.trim();
    if (k === 'nombre' && !val) { repintar(); return; }
    if (k === 'precio') { const n = precioDe(val); if (n) x.precio = n; else delete x.precio; }
    else if (val) x[k] = val; else delete x[k];
    guardar();
  },
  'compra-borrar'({ id }) {
    const c = datos(), i = c.lista.findIndex((y) => y.id === id);
    if (i < 0) return;
    const [x] = c.lista.splice(i, 1);
    editando = null;
    guardar();
    toast('Quitado: ' + x.nombre, () => { c.lista.splice(i, 0, x); guardar(); });
  },
  'compra-limpiar'() {
    const c = datos(), antes = c.lista.slice();
    c.lista = c.lista.filter((x) => !(x.tipo === tab && x.hecho));
    guardar();
    toast('Lista limpia', () => { c.lista = antes; guardar(); });
  },
  'compra-copiar'() {
    const t = textoLista(datos(), tab);
    if (t) copiarTexto(t, '📋 Lista copiada');
  },
});
