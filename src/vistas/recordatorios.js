// Recordatorios: mantenimiento de la moto por km o por tiempo (lo que pase primero), los que se agreguen desde plantillas
// y los que salen solos de Finanzas (pagos fijos y cuotas de deudas).
import { e, guardar } from '../estado.js';
import { iso, fechaCorta, diasEntre } from '../fechas.js';
import { estadoRecordatorio, recordatoriosAutomaticos, ritmoKm, kmActual, pesos, leerMonto } from '../finanzas.js';
import { PLANTILLAS_RECORDATORIO } from '../datos_finanzas.js';
import { esc, registrar, toast } from '../ui.js';
import { nuevoMovimiento } from './finanzas.js';
import { seccionCirculo } from './vida.js';
import { pendientesCirculo } from '../vida.js';

const r = () => e().recordatorios;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
// A qué categoría de Finanzas va el costo (lo de la moto, a transporte)
const categoriaDe = (x) => x.categoria || (x.vehiculo ? 'transporte' : 'otros');
const vehiculo = (id) => r().vehiculos.find((v) => v.id === id) || null;
const km = (n) => Math.round(n).toLocaleString('es-CO') + ' km';
const ESTADOS = { vencido: 'Vencido', pronto: 'Pronto', 'al-dia': 'Al día', 'sin-dato': 'Falta el último', pendiente: 'Pendiente', pagado: 'Pagado' };

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
function detalle(x, s) {
  if (s.estado === 'sin-dato') return '<p class="nota-corta">Registra cuándo fue el último' + (x.cadaKm ? ' y con cuántos km' : '') + ' para calcular el próximo.</p>';
  const partes = [];
  if (s.proxKm != null) {
    partes.push('A los <b>' + km(s.proxKm) + '</b>' + (s.faltaKm != null ? (s.faltaKm > 0 ? ' · faltan ' + km(s.faltaKm) : ' · <b>te pasaste ' + km(-s.faltaKm) + '</b>') : '') +
      (s.fechaKm && s.faltaKm > 0 ? ' (≈ ' + fechaCorta(s.fechaKm) + ')' : ''));
  }
  if (s.proxFecha) partes.push('El <b>' + fechaCorta(s.proxFecha) + '</b>' + (s.faltaDias >= 0 ? ' · faltan ' + s.faltaDias + ' días' : ' · <b>hace ' + -s.faltaDias + ' días</b>'));
  return '<p>' + partes.join('<br>') + '</p><p class="nota-corta">Último: ' + fechaCorta(s.ultimo.fecha) + ' (' + hace(diasEntre(s.ultimo.fecha, iso())) + ')' + (s.ultimo.km != null ? ' · ' + km(s.ultimo.km) : '') + (s.ultimo.costo ? ' · ' + pesos(s.ultimo.costo) : '') + '</p>';
}

function tarjeta(x, i) {
  const v = vehiculo(x.vehiculo), s = estadoRecordatorio(x, v), ruta = 'recordatorios.lista.' + i, actual = v ? kmActual(v.km) : null;
  return '<section class="tarjeta ed-item rec e-borde-' + s.estado + '"><div class="ed-cab"><b>' + (x.icono || '🔔') + ' ' + esc(x.nombre) + (v ? ' <small>· ' + esc(v.nombre) + '</small>' : '') + '</b>' +
    '<span class="estado e-' + s.estado + '">' + ESTADOS[s.estado] + '</span></div>' +
    '<p class="nota-corta">' + regla(x) + '</p>' + detalle(x, s) +
    (!x.cadaKm && (s.ultimo || {}).fecha !== iso() ? '<button type="button" class="boton primario ancho" data-accion="rec-hoy" data-id="' + x.id + '">✓ Lo hice hoy</button>' : '') +
    '<details' + (s.estado === 'sin-dato' && x.cadaKm ? ' open' : '') + '><summary>' + (x.cadaKm ? (s.estado === 'sin-dato' ? 'Registrar el último' : '✓ Marcar como hecho') : 'Otra fecha o con costo') + '</summary>' +
    '<div class="hecho" data-rec="' + x.id + '"><div class="dos">' +
    '<label class="campo">Fecha<input type="date" name="fecha" value="' + iso() + '" max="' + iso() + '"></label>' +
    (x.cadaKm ? '<label class="campo">Km de la moto<input type="number" inputmode="numeric" name="km" value="' + (actual ?? '') + '" placeholder="km"></label>' : '') +
    '<label class="campo">Costo (opcional)<input type="text" inputmode="numeric" data-pesos name="costo" placeholder="$ 0"></label></div>' +
    '<button type="button" class="boton primario ancho" data-accion="rec-hecho" data-id="' + x.id + '">Guardar</button>' +
    '<p class="nota-corta">Si pones el costo, queda también como gasto en Finanzas.</p></div></details>' +
    // Historial con 🗑 para quitar lo anotado por error (el próximo se calcula con el último que quede)
    (x.hechos.length ? '<details><summary>Historial (' + x.hechos.length + ')</summary><ul class="lista-pesos">' + x.hechos.map((h, k) => [h, k]).reverse().map(([h, k]) =>
      '<li><span>' + fechaCorta(h.fecha) + '</span><span>' + (h.km != null ? km(h.km) : '') + (h.costo ? ' · ' + pesos(h.costo) : '') +
      ' <button type="button" class="icono borrar" data-accion="rec-borrar-hecho" data-id="' + x.id + '" data-k="' + k + '" aria-label="Borrar registro del ' + fechaCorta(h.fecha) + '">🗑</button></span></li>').join('') + '</ul></details>' : '') +
    '<details><summary>Editar</summary><div class="dos">' +
    '<label class="campo">Nombre<input type="text" data-cambio="ed" data-ruta="' + ruta + '.nombre" value="' + esc(x.nombre) + '"></label>' +
    '<label class="campo">Ícono<input type="text" maxlength="4" data-cambio="ed" data-ruta="' + ruta + '.icono" value="' + esc(x.icono || '') + '"></label>' +
    '<label class="campo">Cada cuántos días (0 = no)<input type="number" inputmode="numeric" min="0" data-cambio="ed" data-tipo="num" data-ruta="' + ruta + '.cadaDias" value="' + (x.cadaDias || 0) + '"></label>' +
    '<label class="campo">Cada cuántos meses (0 = no)<input type="number" inputmode="numeric" min="0" data-cambio="ed" data-tipo="num" data-ruta="' + ruta + '.cadaMeses" value="' + (x.cadaMeses || 0) + '"></label>' +
    '<label class="campo">El costo va a<select data-cambio="ed" data-ruta="' + ruta + '.categoria">' + e().finanzas.categorias.gasto.map((c) =>
      '<option value="' + c.id + '"' + (c.id === categoriaDe(x) ? ' selected' : '') + '>' + c.icono + ' ' + esc(c.nombre) + '</option>').join('') + '</select></label>' +
    // Km y vehículo solo para lo de la moto
    (x.vehiculo || x.cadaKm ? '<label class="campo">Cada cuántos km (0 = no)<input type="number" inputmode="numeric" min="0" data-cambio="ed" data-tipo="num" data-ruta="' + ruta + '.cadaKm" value="' + (x.cadaKm || 0) + '"></label>' +
    '<label class="campo">Vehículo<select data-cambio="ed" data-ruta="' + ruta + '.vehiculo"><option value="">Ninguno</option>' +
    r().vehiculos.map((w) => '<option value="' + w.id + '"' + (w.id === x.vehiculo ? ' selected' : '') + '>' + esc(w.nombre) + '</option>').join('') + '</select></label>' : '') + '</div>' +
    (x.nota ? '<p class="nota-corta">' + esc(x.nota) + '</p>' : '') +
    '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="recordatorios.lista" data-i="' + i + '" data-nombre="' + esc(x.nombre) + '" aria-label="Borrar">🗑</button></details></section>';
}

export function vistaRecordatorios() {
  const auto = recordatoriosAutomaticos(e().finanzas);
  const orden = { vencido: 0, pronto: 1, 'sin-dato': 2, 'al-dia': 3 };
  const lista = r().lista.map((x, i) => ({ x, i, s: estadoRecordatorio(x, vehiculo(x.vehiculo)) })).sort((a, b) => orden[a.s.estado] - orden[b.s.estado]);
  return '<h1>Recordatorios</h1>' +
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
    lista.map(({ x, i }) => tarjeta(x, i)).join('') +
    (auto.length ? '<h2 class="titulo-grupo">💸 Pagos de Finanzas</h2>' + auto.map((a) =>
      '<section class="tarjeta"><div class="ed-cab"><b>' + esc(a.nombre) + '</b><span class="estado e-' + a.estado + '">' + ESTADOS[a.estado] + '</span></div>' +
      '<div class="fila-resumen nota-corta"><span>' + fechaCorta(a.fecha) + (a.faltan > 0 ? ' · en ' + a.faltan + ' días' : a.faltan === 0 ? ' · hoy' : '') + '</span><b>' + pesos(a.monto) + '</b></div>' +
      '<button type="button" class="boton secundario ancho" data-accion="' + ({ fijo: 'fin-pagar-fijo', cobro: 'fin-cobrar' }[a.tipo] || 'fin-pagar-deuda') + '" data-id="' + a.id + '">' + (a.tipo === 'cobro' ? 'Registrar cobro' : 'Registrar pago') + '</button></section>').join('') : '') +
    seccionCirculo() +
    '<section class="tarjeta"><h2>＋ Agregar recordatorio</h2><div class="rejilla-cats">' + PLANTILLAS_RECORDATORIO.map((p, k) =>
      '<button type="button" class="cat" data-accion="rec-agregar" data-k="' + k + '"><span>' + p.icono + '</span>' + esc(p.nombre) + '</button>').join('') + '</div>' +
    '<p class="nota-corta">Los pagos fijos, las cuotas y los intereses por cobrar de Finanzas aparecen aquí solos cuando se acerca el día.</p></section>';
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
    x.hechos.push({ fecha, km: kmHecho, costo: costo || 0 });
    x.hechos.sort((a, b) => a.fecha.localeCompare(b.fecha));
    // El km del cambio también sirve como lectura del odómetro
    const w = vehiculo(x.vehiculo);
    if (w && kmHecho && !w.km.some((k) => k.fecha === fecha)) w.km.push({ fecha, km: kmHecho });
    if (costo) nuevoMovimiento({ tipo: 'gasto', monto: costo, categoria: categoriaDe(x), metodo: 'efectivo', nota: x.nombre, fecha });
    guardar();
    toast('✓ ' + x.nombre + ' registrado');
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
    x.hechos.push({ fecha: iso(), km: null, costo: 0 });
    x.hechos.sort((a, b) => a.fecha.localeCompare(b.fecha));
    guardar();
    toast('✓ ' + x.nombre + ' · hoy');
  },
  'rec-agregar'({ k }) {
    const p = PLANTILLAS_RECORDATORIO[Number(k)];
    r().lista.push({ id: 'r' + uid(), ...p, vehiculo: p.vehiculo && vehiculo(p.vehiculo) ? p.vehiculo : '', hechos: [] });
    guardar();
    toast(p.icono + ' ' + p.nombre + ' agregado');
  },
});
