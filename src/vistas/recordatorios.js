// Recordatorios: mantenimiento de la moto por km o por tiempo (lo que pase primero), los que se agreguen desde plantillas
// y los que salen solos de Finanzas (pagos fijos y cuotas de deudas).
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta, diasEntre } from '../fechas.js';
import { estadoRecordatorio, proximoRecordatorio, recordatoriosAutomaticos, ritmoKm, kmActual, pesos, leerMonto } from '../finanzas.js';
import { PLANTILLAS_RECORDATORIO, GRUPOS_PLANTILLA } from '../datos_finanzas.js';
import { esc, barra, registrar, toast } from '../ui.js';
import { nuevoMovimiento } from './finanzas.js';
import { seccionCirculo } from './vida.js';
import { pendientesCirculo } from '../vida.js';

const r = () => e().recordatorios;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
// A qué categoría de Finanzas va el costo (lo de la moto, a transporte)
const categoriaDe = (x) => x.categoria || (x.vehiculo ? 'transporte' : 'otros');
const vehiculo = (id) => r().vehiculos.find((v) => v.id === id) || null;
const km = (n) => Math.round(n).toLocaleString('es-CO') + ' km';
const ESTADOS = { vencido: 'Vencido', pronto: 'Pronto', 'al-dia': 'Al día', 'sin-dato': 'Sin registro', programado: 'Programado', pendiente: 'Pendiente', pagado: 'Pagado' };

// Lo que necesita atención: para el menú y para el tablero de Hoy
export function alertas(hoy = iso()) {
  const propios = r().lista.map((x) => ({ x, s: estadoRecordatorio(x, vehiculo(x.vehiculo), hoy) })).filter(({ s }) => s.estado === 'vencido' || s.estado === 'pronto')
    .map(({ x, s }) => ({ nombre: x.nombre, icono: x.icono, estado: s.estado }));
  const auto = recordatoriosAutomaticos(e().finanzas, hoy).filter((a) => a.estado === 'vencido' || a.estado === 'pronto')
    .map((a) => ({ nombre: a.nombre, icono: '💸', estado: a.estado, monto: a.monto }));
  const personas = pendientesCirculo(e().circulo, hoy).map(({ p, s }) => ({ nombre: 'Hablar con ' + p.nombre, icono: '👥', estado: s.estado }));
  return [...propios, ...auto, ...personas];
}

function regla(x) {
  const partes = [];
  if (x.cadaKm) partes.push('cada ' + km(x.cadaKm));
  if (x.cadaMeses) partes.push('cada ' + x.cadaMeses + (x.cadaMeses === 1 ? ' mes' : ' meses'));
  if (x.cadaDias) partes.push('cada ' + x.cadaDias + (x.cadaDias === 1 ? ' día' : ' días'));
  if (!partes.length) return 'Sin fecha fija: solo guarda cuándo fue cada vez';
  return partes.join(' o ') + (partes.length > 1 ? ' (lo que pase primero)' : '');
}

const hace = (n) => (n <= 0 ? 'hoy' : n === 1 ? 'ayer' : 'hace ' + n + ' días');

// Solo un panel abierto por tarjeta; vive fuera del HTML para que no se cierre al guardar un campo y repintar
let abierto = { id: null, que: null }, filtroEstado = '';

function principal(x, s, actual) {
  if (s.estado === 'sin-dato') return '<p class="rec-titulo">Aún sin registro</p><p class="nota-corta">' + regla(x) + '. Márcalo la próxima vez o anota cuándo fue el último.' + (x.cadaKm ? '' : ' ¿Aún no empieza? Pon la fecha en ✏️ Editar.') + '</p>';
  if (s.empieza) return '<p class="rec-titulo">' + proximoRecordatorio(x, s, actual).titulo + ' <small>' + fechaCorta(s.empieza) + '</small></p><p class="nota-corta">Después, ' + regla(x) + '. ' + (s.estado === 'programado' ? 'Te avisa 14 días antes.' : 'Márcalo cuando lo hagas.') + '</p>';
  const p = proximoRecordatorio(x, s, actual);
  const ultimo = 'Último: ' + fechaCorta(s.ultimo.fecha) + ' (' + hace(diasEntre(s.ultimo.fecha, iso())) + ')' + (s.ultimo.km != null ? ' · ' + km(s.ultimo.km) : '') + (s.ultimo.costo ? ' · ' + pesos(s.ultimo.costo) : '');
  if (!p) return '<p class="rec-titulo">Sin fecha fija</p><p class="nota-corta">' + ultimo + '</p>';
  const cuando = [p.km != null ? 'a los ' + km(p.km) : '', p.fecha ? (p.km != null ? '≈ ' : '') + fechaCorta(p.fecha) : ''].filter(Boolean).join(' · ');
  return '<p class="rec-titulo">' + p.titulo + (cuando ? ' <small>' + cuando + '</small>' : '') + '</p>' + barra(p.fraccion, 'e-barra-' + s.estado) +
    '<p class="nota-corta">' + regla(x) + '<br>' + ultimo + '</p>';
}

function panelHecho(x, actual) {
  return '<div class="hecho" data-rec="' + x.id + '"><div class="dos">' +
    '<label class="campo">Fecha<input type="date" name="fecha" value="' + iso() + '" max="' + iso() + '"></label>' +
    (x.cadaKm ? '<label class="campo">Km de la moto<input type="number" inputmode="numeric" name="km" value="' + (actual ?? '') + '" placeholder="km"></label>' : '') +
    '<label class="campo">Costo (opcional)<input type="text" inputmode="numeric" data-pesos name="costo" placeholder="$ 0"></label></div>' +
    '<button type="button" class="boton primario ancho" data-accion="rec-hecho" data-id="' + x.id + '">Guardar</button>' +
    '<p class="nota-corta">Si pones el costo, queda también como gasto en Finanzas.</p></div>';
}
// Historial con 🗑 para quitar lo anotado por error (el próximo se calcula con el último que quede)
function panelHistorial(x) {
  return '<ul class="lista-pesos">' + x.hechos.map((h, k) => [h, k]).reverse().map(([h, k]) =>
    '<li><span>' + fechaCorta(h.fecha) + '</span><span>' + (h.km != null ? km(h.km) : '') + (h.costo ? ' · ' + pesos(h.costo) : '') +
    ' <button type="button" class="icono borrar" data-accion="rec-borrar-hecho" data-id="' + x.id + '" data-k="' + k + '" aria-label="Borrar registro del ' + fechaCorta(h.fecha) + '">🗑</button></span></li>').join('') + '</ul>';
}
function panelEditar(x, i) {
  const ruta = 'recordatorios.lista.' + i, enDias = !!x.cadaDias, cada = x.cadaDias || x.cadaMeses || 0;
  return '<div class="dos rec-editar">' +
    '<label class="campo">Nombre<input type="text" data-cambio="ed" data-ruta="' + ruta + '.nombre" value="' + esc(x.nombre) + '"></label>' +
    '<label class="campo">Ícono<input type="text" maxlength="4" data-cambio="ed" data-ruta="' + ruta + '.icono" value="' + esc(x.icono || '') + '"></label>' +
    '<label class="campo">Se repite cada (0 = sin fecha)<input type="number" inputmode="numeric" min="0" name="cada" data-cambio="rec-frecuencia" data-id="' + x.id + '" value="' + cada + '"></label>' +
    '<label class="campo">Unidad<select name="unidad" data-cambio="rec-frecuencia" data-id="' + x.id + '"><option value="dias"' + (enDias ? ' selected' : '') + '>Días</option><option value="meses"' + (enDias ? '' : ' selected') + '>Meses</option></select></label>' +
    // Fecha del primer pago: solo mientras no haya nada registrado; después manda el historial
    (x.hechos.length ? '' : '<label class="campo">Empieza el (opcional)<input type="date" data-cambio="ed" data-ruta="' + ruta + '.empieza" value="' + esc(x.empieza || '') + '"></label>') +
    // Km y vehículo solo para lo de la moto
    (x.vehiculo || x.cadaKm ? '<label class="campo">Cada cuántos km (0 = no)<input type="number" inputmode="numeric" min="0" data-cambio="ed" data-tipo="num" data-ruta="' + ruta + '.cadaKm" value="' + (x.cadaKm || 0) + '"></label>' +
    '<label class="campo">Vehículo<select data-cambio="ed" data-ruta="' + ruta + '.vehiculo"><option value="">Ninguno</option>' +
    r().vehiculos.map((w) => '<option value="' + w.id + '"' + (w.id === x.vehiculo ? ' selected' : '') + '>' + esc(w.nombre) + '</option>').join('') + '</select></label>' : '') +
    '<label class="campo">El costo va a<select data-cambio="ed" data-ruta="' + ruta + '.categoria">' + e().finanzas.categorias.gasto.map((c) =>
      '<option value="' + c.id + '"' + (c.id === categoriaDe(x) ? ' selected' : '') + '>' + c.icono + ' ' + esc(c.nombre) + '</option>').join('') + '</select></label></div>' +
    '<label class="campo">Nota<textarea rows="2" data-cambio="ed" data-ruta="' + ruta + '.nota">' + esc(x.nota || '') + '</textarea></label>' +
    '<button type="button" class="boton secundario rec-borrar" data-accion="ed-borrar" data-lista="recordatorios.lista" data-i="' + i + '" data-nombre="' + esc(x.nombre) + '">🗑 Borrar recordatorio</button>';
}

function tarjeta(x, i) {
  const v = vehiculo(x.vehiculo), s = estadoRecordatorio(x, v), actual = v ? kmActual(v.km) : null;
  const que = abierto.id === x.id ? abierto.que : null, hoyYa = (s.ultimo || {}).fecha === iso(), urge = s.estado !== 'al-dia';
  const pest = (k, t) => '<button type="button" class="chip' + (que === k ? ' activo' : '') + '" data-accion="rec-panel" data-id="' + x.id + '" data-q="' + k + '" aria-expanded="' + (que === k) + '">' + t + '</button>';
  // Hecho hoy, con un toque. Lo de km usa el odómetro; si no hay lectura, pide los km
  const hecho = s.estado === 'programado' ? '' : hoyYa ? '<p class="rec-hecho-hoy">✓ Hecho hoy</p>'
    : '<button type="button" class="boton ' + (urge ? 'primario' : 'secundario') + ' ancho" data-accion="rec-hoy" data-id="' + x.id + '">' +
      (x.cadaKm && actual != null ? '✓ Hecho hoy, a los ' + km(actual) : '✓ Hecho hoy') + '</button>';
  return '<section class="tarjeta rec e-borde-' + s.estado + '"><div class="ed-cab"><b>' + (x.icono || '🔔') + ' ' + esc(x.nombre) + (v ? ' <small>· ' + esc(v.nombre) + '</small>' : '') + '</b>' +
    '<span class="estado e-' + s.estado + '">' + ESTADOS[s.estado] + '</span></div>' +
    principal(x, s, actual) + hecho +
    '<div class="chips rec-pestanas">' + (s.estado === 'programado' ? '' : pest('hecho', '📅 Otra fecha')) + (x.hechos.length ? pest('historial', '🕘 Historial (' + x.hechos.length + ')') : '') + pest('editar', '✏️ Editar') + '</div>' +
    (que === 'hecho' ? panelHecho(x, actual) : que === 'historial' && x.hechos.length ? panelHistorial(x) : que === 'editar' ? panelEditar(x, i) : '') + '</section>';
}

let agregarAbierto = false;
// Guarda un hecho y ofrece deshacerlo. Devuelve la función que lo quita
function anotarHecho(x, h) {
  x.hechos.push(h);
  x.hechos.sort((a, b) => a.fecha.localeCompare(b.fecha));
  return () => { x.hechos.splice(x.hechos.indexOf(h), 1); guardar(); };
}
// El buscador de plantillas filtra sin repintar, para no perder el cursor
if (typeof document !== 'undefined') {
  document.addEventListener('input', (ev) => {
    if (!ev.target.matches || !ev.target.matches('.rec-buscar')) return;
    const q = ev.target.value.trim().toLowerCase(), caja = ev.target.closest('.rec-agregar');
    caja.querySelectorAll('.cat').forEach((c) => { c.hidden = !!q && !c.textContent.toLowerCase().includes(q); });
    caja.querySelectorAll('.grupos-plantilla > div').forEach((g) => { g.hidden = !g.querySelector('.cat:not([hidden])'); });
  });
  document.addEventListener('toggle', (ev) => { if (ev.target.id === 'rec-agregar') agregarAbierto = ev.target.open; }, true);
}

export function vistaRecordatorios() {
  const auto = recordatoriosAutomaticos(e().finanzas);
  const orden = { vencido: 0, pronto: 1, 'sin-dato': 2, 'al-dia': 3, programado: 4 };
  const lista = r().lista.map((x, i) => ({ x, i, s: estadoRecordatorio(x, vehiculo(x.vehiculo)) })).sort((a, b) => orden[a.s.estado] - orden[b.s.estado]);
  const cuenta = (est) => lista.filter(({ s }) => s.estado === est).length, visibles = lista.filter(({ s }) => !filtroEstado || s.estado === filtroEstado), porLlamar = pendientesCirculo(e().circulo || []).length;
  // En el computador: arriba la moto y un resumen; abajo cada grupo en una rejilla de tarjetas
  return '<h1>Recordatorios</h1><div class="rec-arriba">' +
    r().vehiculos.map((v, i) => {
      const actual = kmActual(v.km), ritmo = ritmoKm(v.km);
      return '<section class="tarjeta"><div class="fila-resumen"><h2>' + v.icono + ' ' + esc(v.nombre) + '</h2><b>' + (actual != null ? km(actual) : 'sin km') + '</b></div>' +
        '<label class="campo">Km del odómetro hoy<input type="number" inputmode="numeric" min="0" class="peso-grande" data-cambio="rec-km" data-v="' + v.id + '" placeholder="' + (actual ?? 'km') + '"></label>' +
        '<p class="nota-corta">' + (ritmo ? 'Andas unos ' + Math.round(ritmo) + ' km por día: con eso se calcula la fecha del próximo cambio.' : 'Anota los km de vez en cuando (por ejemplo cada semana) para estimar cuándo toca el próximo cambio.') + '</p>' +
        '<details><summary>Editar vehículo</summary><label class="campo">Nombre<input type="text" data-cambio="ed" data-ruta="recordatorios.vehiculos.' + i + '.nombre" value="' + esc(v.nombre) + '"></label>' +
        // Lecturas del odómetro: una mal anotada daña el cálculo de km por día; aquí se quita
        (v.km.length ? '<p class="nota-corta">Lecturas del odómetro (borra las que estén mal):</p><ul class="lista-pesos">' + v.km.map((l, k) => [l, k]).sort((a, b) => b[0].fecha.localeCompare(a[0].fecha)).map(([l, k]) =>
          '<li><span>' + fechaCorta(l.fecha) + '</span><span>' + km(l.km) + ' <button type="button" class="icono borrar" data-accion="rec-borrar-km" data-v="' + v.id + '" data-k="' + k + '" aria-label="Borrar lectura del ' + fechaCorta(l.fecha) + '">🗑</button></span></li>').join('') + '</ul>' : '') +
        '</details></section>';
    }).join('') +
    '<section class="tarjeta rec-resumen"><h2>🔔 Resumen</h2><div class="datos-peso">' +
    [['vencido', 'Vencidos'], ['pronto', 'Pronto'], ['sin-dato', 'Sin registro'], ['al-dia', 'Al día']].map(([k, t]) => '<div><small>' + t + '</small><b class="' + (cuenta(k) && k !== 'al-dia' ? 'e-txt-' + k : '') + '">' + cuenta(k) + '</b></div>').join('') + '</div>' +
    '<p class="nota-corta">' + (auto.length ? auto.length + (auto.length === 1 ? ' pago' : ' pagos') + ' de Finanzas cerca · ' : '') + porLlamar + (porLlamar === 1 ? ' persona' : ' personas') + ' por llamar</p></section></div>' +
    '<div class="rec-cabeza"><h2 class="titulo-grupo">🔧 Mis recordatorios</h2><button type="button" class="boton primario" data-accion="rec-abrir-agregar">＋ Agregar</button></div>' +
    (lista.length > 1 ? '<div class="chips rec-filtros"><button type="button" class="chip' + (filtroEstado ? '' : ' activo') + '" data-accion="rec-filtro" data-v="">Todos (' + lista.length + ')</button>' +
      [['vencido', 'Vencidos'], ['pronto', 'Pronto'], ['sin-dato', 'Sin registro'], ['al-dia', 'Al día'], ['programado', 'Programados']].filter(([k]) => cuenta(k)).map(([k, t]) =>
        '<button type="button" class="chip' + (filtroEstado === k ? ' activo' : '') + '" data-accion="rec-filtro" data-v="' + k + '">' + t + ' (' + cuenta(k) + ')</button>').join('') + '</div>' : '') +
    (lista.length ? '<div class="rejilla-rec">' + visibles.map(({ x, i }) => tarjeta(x, i)).join('') + '</div>' : '<section class="tarjeta"><p class="nota-corta">Aún no tienes recordatorios. Toca ＋ Agregar y escoge uno.</p></section>') +
    (auto.length ? '<h2 class="titulo-grupo">💸 Pagos de Finanzas</h2><div class="rejilla-rec">' + auto.map((a) =>
      '<section class="tarjeta"><div class="ed-cab"><b>' + esc(a.nombre) + '</b><span class="estado e-' + a.estado + '">' + ESTADOS[a.estado] + '</span></div>' +
      '<div class="fila-resumen nota-corta"><span>' + fechaCorta(a.fecha) + (a.faltan > 0 ? ' · en ' + a.faltan + ' días' : a.faltan === 0 ? ' · hoy' : '') + '</span><b>' + pesos(a.monto) + '</b></div>' +
      '<button type="button" class="boton secundario ancho" data-accion="' + ({ fijo: 'fin-pagar-fijo', cobro: 'fin-cobrar' }[a.tipo] || 'fin-pagar-deuda') + '" data-id="' + a.id + '">' + (a.tipo === 'cobro' ? 'Registrar cobro' : 'Registrar pago') + '</button></section>').join('') + '</div>' : '') +
    seccionCirculo() +
    '<details class="tarjeta rec-agregar" id="rec-agregar"' + (agregarAbierto ? ' open' : '') + '><summary><h2>＋ Agregar recordatorio</h2></summary>' +
    '<input type="search" class="rec-buscar" placeholder="Buscar: hipoteca, SOAT, aceite…" aria-label="Buscar plantilla"><div class="grupos-plantilla">' + Object.entries(GRUPOS_PLANTILLA).map(([g, titulo]) =>
      '<div><h3>' + titulo + '</h3><div class="rejilla-cats">' + PLANTILLAS_RECORDATORIO.map((p, k) => [p, k]).filter(([p]) => p.grupo === g).map(([p, k]) =>
        '<button type="button" class="cat" data-accion="rec-agregar" data-k="' + k + '"><span>' + p.icono + '</span>' + esc(p.nombre) + '</button>').join('') + '</div></div>').join('') + '</div>' +
    '<p class="nota-corta">Los pagos fijos, las cuotas y los intereses por cobrar de Finanzas aparecen aquí solos cuando se acerca el día.</p></details>';
}

registrar({
  'rec-km'({ v }, el) {
    const n = Math.round(Number(el.value));
    if (!(n > 0)) return;
    const w = vehiculo(v), anterior = kmActual(w.km);
    if (anterior != null && n < anterior && !confirm('Es menos que lo último anotado (' + km(anterior) + '). ¿Guardar igual?')) return;
    w.km = w.km.filter((x) => x.fecha !== iso());
    w.km.push({ fecha: iso(), km: n });
    guardar();
    toast(w.nombre + ': ' + km(n));
  },
  'rec-hecho'({ id }, el) {
    const caja = el.closest('[data-rec]'), x = r().lista.find((y) => y.id === id);
    const val = (n) => { const c = caja.querySelector('[name="' + n + '"]'); return c ? c.value : ''; };
    const fecha = val('fecha') || iso(), kmHecho = val('km') ? Math.round(Number(val('km'))) : null, costo = leerMonto(val('costo'));
    if (x.cadaKm && !(kmHecho > 0)) { toast('Escribe los km de la moto'); return; }
    const deshacer = anotarHecho(x, { fecha, km: kmHecho, costo: costo || 0 });
    abierto = { id: null, que: null };
    // El km del cambio también sirve como lectura del odómetro
    const w = vehiculo(x.vehiculo);
    if (w && kmHecho && !w.km.some((k) => k.fecha === fecha)) w.km.push({ fecha, km: kmHecho });
    if (costo) nuevoMovimiento({ tipo: 'gasto', monto: costo, categoria: categoriaDe(x), metodo: 'efectivo', nota: x.nombre, fecha });
    guardar();
    // Con costo no se ofrece deshacer: el gasto ya quedó en Finanzas y se corrige allá
    toast('✓ ' + x.nombre + ' registrado', costo ? null : deshacer);
  },
  'rec-borrar-hecho'({ id, k }) {
    const x = r().lista.find((y) => y.id === id), h = x && x.hechos[Number(k)];
    if (!h || !confirm('¿Borrar el registro del ' + fechaCorta(h.fecha) + (h.km != null ? ' (' + km(h.km) + ')' : '') + '?')) return;
    x.hechos.splice(Number(k), 1);
    guardar();
  },
  'rec-borrar-km'({ v, k }) {
    const w = vehiculo(v), l = w && w.km[Number(k)];
    if (!l || !confirm('¿Borrar la lectura de ' + km(l.km) + ' del ' + fechaCorta(l.fecha) + '?')) return;
    w.km.splice(Number(k), 1);
    guardar();
  },
  'rec-hoy'({ id }) {
    const x = r().lista.find((y) => y.id === id);
    if (!x) return;
    const actual = x.cadaKm ? kmActual((vehiculo(x.vehiculo) || { km: [] }).km) : null;
    // Lo de km necesita saber con cuántos km fue
    if (x.cadaKm && actual == null) { abierto = { id: x.id, que: 'hecho' }; repintar(); toast('Escribe los km de la moto'); return; }
    const deshacer = anotarHecho(x, { fecha: iso(), km: actual, costo: 0 });
    guardar();
    toast('✓ ' + x.nombre + ' · hoy', deshacer);
  },
  'rec-panel'({ id, q }) {
    abierto = abierto.id === id && abierto.que === q ? { id: null, que: null } : { id, que: q };
    repintar();
  },
  'rec-filtro'({ v }) { filtroEstado = v; repintar(); },
  'rec-abrir-agregar'() {
    agregarAbierto = true;
    const caja = document.getElementById('rec-agregar');
    if (!caja) return;
    caja.open = true;
    caja.scrollIntoView({ behavior: 'smooth', block: 'start' });
    caja.querySelector('.rec-buscar').focus({ preventScroll: true });
  },
  // Una sola frecuencia: días o meses
  'rec-frecuencia'({ id }, el) {
    const x = r().lista.find((y) => y.id === id), caja = el.closest('.rec-editar');
    const n = Math.max(0, Math.round(Number(caja.querySelector('[name="cada"]').value)) || 0), dias = caja.querySelector('[name="unidad"]').value === 'dias';
    x.cadaDias = dias ? n : 0;
    x.cadaMeses = dias ? 0 : n;
    guardar();
  },
  'rec-agregar'({ k }) {
    const { grupo, ...p } = PLANTILLAS_RECORDATORIO[Number(k)];
    const nuevo = { id: 'r' + uid(), ...p, vehiculo: p.vehiculo && vehiculo(p.vehiculo) ? p.vehiculo : '', hechos: [] };
    r().lista.push(nuevo);
    filtroEstado = '';
    guardar();
    toast(p.icono + ' ' + p.nombre + ' agregado', () => { r().lista.splice(r().lista.indexOf(nuevo), 1); guardar(); });
  },
});
