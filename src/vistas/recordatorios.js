// Recordatorios: mantenimiento de la moto por km o por tiempo (lo que pase primero), los que se agreguen desde plantillas
// los que salen solos de Finanzas (pagos fijos y cuotas de deudas) y los eventos que no hay que perderse.
// La pantalla está en src/react/pantallas/Recordatorios.tsx; aquí quedan lo que está abierto, las acciones, las alertas
// (menú y Hoy) y los pendientes de hoy de la franja de arriba (diariosDeHoy, los pinta react/armazon/Avisos.tsx).
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { eventosCerca, cuandoFalta } from '../eventos.js';
import { estadoRecordatorio, proximoRecordatorio, tocaYa, recordatoriosAutomaticos, kmActual, leerMonto } from '../finanzas.js';
import { PLANTILLAS_RECORDATORIO } from '../datos_finanzas.js';
import { registrar, toast } from '../ui.js';
import { nuevoMovimiento } from './finanzas.js';
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
  const propios = r().lista.map((x) => ({ x, s: estadoRecordatorio(x, vehiculo(x.vehiculo), hoy) })).filter(({ s }) => ['vencido', 'pronto', 'pendiente'].includes(s.estado))
    .map(({ x, s }) => ({ nombre: x.nombre, icono: x.icono, estado: s.estado }));
  const auto = recordatoriosAutomaticos(e().finanzas, hoy).filter((a) => a.estado === 'vencido' || a.estado === 'pronto')
    .map((a) => ({ nombre: a.nombre, icono: '💸', estado: a.estado, monto: a.monto }));
  const personas = pendientesCirculo(e().circulo, hoy).map(({ p, s }) => ({ nombre: 'Hablar con ' + p.nombre, icono: '👥', estado: s.estado }));
  const eventos = eventosCerca(r().eventos, hoy).map(({ x, s }) => ({ nombre: x.nombre + ' · ' + cuandoFalta(s.faltan), icono: x.icono || '🎟️', estado: 'pronto' }));
  return [...eventos, ...propios, ...auto, ...personas];
}

function regla(x) {
  if (x.diario) return 'Todos los días: sale arriba en toda la app hasta que lo marques';
  if (x.diaMes && !x.cadaKm) return 'El día ' + x.diaMes + ' de cada mes';
  const partes = [];
  if (x.cadaKm) partes.push('cada ' + km(x.cadaKm));
  if (x.cadaMeses) partes.push('cada ' + x.cadaMeses + (x.cadaMeses === 1 ? ' mes' : ' meses'));
  if (x.cadaDias) partes.push('cada ' + x.cadaDias + (x.cadaDias === 1 ? ' día' : ' días'));
  if (!partes.length) return 'Sin fecha fija: solo guarda cuándo fue cada vez';
  return partes.join(' o ') + (partes.length > 1 ? ' (lo que pase primero)' : '');
}

const hace = (n) => (n <= 0 ? 'hoy' : n === 1 ? 'ayer' : 'hace ' + n + ' días');

// Una sola fila abierta: que = 'detalle' (solo ver) o el panel abierto dentro ('hecho', 'historial', 'editar').
// Vive fuera del HTML para que no se cierre al guardar un campo y repintar
let abierto = { id: null, que: null }, filtroEstado = '';

// Lo que toca, en una línea, para la fila de la lista
function cuandoCorto(x, s, actual) {
  // Sin registro (ya lo dice la etiqueta): mejor cada cuánto toca
  if (s.estado === 'sin-dato') { const t = x.diario ? 'todos los días' : regla(x); return t[0].toUpperCase() + t.slice(1); }
  const p =proximoRecordatorio(x, s, actual);
  if (s.empieza) return p.titulo + ' · ' + fechaCorta(s.empieza);
  if (!p) return s.ultimo ? 'Último: ' + fechaCorta(s.ultimo.fecha) : 'Sin fecha fija';
  return p.titulo + (p.fecha ? ' · ' + (p.km != null ? '≈ ' : '') + fechaCorta(p.fecha) : '');
}

// ---------- 💡 Posibles para agregar: ideas por frecuencia; ＋ lo agrega (y lo deja abierto en Editar), ✕ lo descarta ----------
let sugVista = null;
const llano = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

// ---------- Eventos ----------
const ESTADO_EVENTO = { hoy: ['pronto', 'Hoy'], pronto: ['pronto', ''], programado: ['programado', ''], 'por-confirmar': ['sin-dato', 'Por confirmar'] };
const buscar = (x) => 'https://www.google.com/search?q=' + encodeURIComponent(x.nombre + ' fecha');
const enlaceSeguro = (u) => (/^https?:\/\//i.test(u || '') ? u : '');

let agregarAbierto = false;
// La fecha elegida en el aviso de arriba (react/armazon/Avisos.tsx): nunca después de hoy
export function fechaDelAviso(el, hoy = iso()) {
  const c = el && el.closest && el.closest('[data-aviso-rec]'), campo = c && c.querySelector('[name="fecha"]'), v = campo ? campo.value : '';
  return /^\d{4}-\d{2}-\d{2}$/.test(v || '') && v <= hoy ? v : hoy;
}
let fechaPanel = null;
function gestionar(id, fecha) {
  abierto = { id, que: 'hecho' };
  fechaPanel = fecha && fecha !== iso() ? fecha : null;
  if (location.hash.split('/')[0] !== '#recordatorios') location.hash = '#recordatorios'; else repintar();
  // La fila queda a la vista con su panel abierto
  setTimeout(() => {
    const f = document.querySelector('[data-rec-id="' + id + '"]');
    if (f && f.scrollIntoView) f.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, 150);
}
// Guarda un hecho y ofrece deshacerlo. Devuelve la función que lo quita
function anotarHecho(x, h) {
  x.hechos.push(h);
  x.hechos.sort((a, b) => a.fecha.localeCompare(b.fecha));
  return () => { x.hechos.splice(x.hechos.indexOf(h), 1); guardar(); };
}
if (typeof document !== 'undefined') {
  // El panel abierto se cierra al tocar fuera de su tarjeta o con Escape. Lo editado ya se guardó al salir del campo;
  // "Otra fecha" se guarda con su botón, así que no se cierra si ya tiene algo escrito
  const cerrarPanel = () => {
    const caja = document.querySelector('[data-rec-id="' + abierto.id + '"] [data-rec]');
    if (caja && [...caja.querySelectorAll('input')].some((c) => c.value !== c.defaultValue)) return;
    abierto = { id: null, que: null };
    repintar();
  };
  document.addEventListener('click', (ev) => {
    if (!abierto.id || (ev.target.closest && ev.target.closest('[data-rec-id]'))?.dataset.recId === abierto.id) return;
    cerrarPanel();
  });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && abierto.id) cerrarPanel(); });
}

// Lo que necesita la pantalla de React (src/react/pantallas/Recordatorios.tsx): lo que está abierto y las reglas de texto
export const piezasRecordatorios = {
  ver: () => ({ abierto, filtro: filtroEstado, sug: sugVista, agregar: agregarAbierto, fechaPanel }),
  ponerSug: (v) => { sugVista = v; },
  regla, hace, km, vehiculo, categoriaDe, llano, cuandoCorto, buscar, enlaceSeguro, ESTADOS, ESTADO_EVENTO,
};

// Franja arriba de toda la app (main.js) hasta que se toque ✓: lo de todos los días que aún no se marcó
// y cualquier recordatorio desde el día en que le toca (o cuando ya se cumplieron los km)
// Los recordatorios que tocan ya, para el aviso de arriba de cada pantalla (react/armazon/Avisos.tsx)
export function diariosDeHoy() {
  return r().lista.flatMap((x) => {
    const v = vehiculo(x.vehiculo), s = estadoRecordatorio(x, v);
    if (!tocaYa(x, s)) return [];
    const p = x.diario ? null : proximoRecordatorio(x, s, v ? kmActual(v.km) : null);
    const cuando = p ? (p.titulo === 'Hoy' ? 'Toca hoy' : p.titulo.startsWith('Hace ') ? 'Tocaba h' + p.titulo.slice(1) : p.titulo) : '';
    return [{ id: x.id, icono: x.icono || '📌', nombre: x.nombre, detalle: [cuando, x.nota || ''].filter(Boolean).join(' · ') }];
  });
}

registrar({
  'evento-agregar'() {
    const val = (id) => document.getElementById(id), nombre = val('evento-nombre').value.trim();
    if (!nombre) { toast('Escribe qué evento es'); return; }
    const x = { id: 'ev' + uid(), nombre, icono: '🎟️', fecha: val('evento-fecha').value, hora: val('evento-hora').value, avisarDias: Number(val('evento-aviso').value) || 7, anual: val('evento-anual').checked };
    r().eventos.push(x);
    guardar();
    toast('🎟️ ' + nombre + ' agregado', () => { r().eventos.splice(r().eventos.indexOf(x), 1); guardar(); });
  },
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
  // Desde el aviso de arriba (o la fila): con la fecha que se eligió en el aviso; sin ella, hoy
  'rec-hoy'({ id }, el) {
    const x = r().lista.find((y) => y.id === id);
    if (!x) return;
    const fecha = fechaDelAviso(el), actual = x.cadaKm ? kmActual((vehiculo(x.vehiculo) || { km: [] }).km) : null;
    // Lo de km necesita saber con cuántos km fue (y si fue otro día, los km de hoy no sirven)
    // (desde la franja de otra pantalla: lleva a Recordatorios, donde queda abierto para escribirlos)
    if (x.cadaKm && (actual == null || fecha !== iso())) {
      gestionar(x.id, fecha);
      toast('Escribe los km de la moto');
      return;
    }
    if (x.hechos.some((h) => h.fecha === fecha)) { toast(x.nombre + ': ya estaba anotado el ' + fechaCorta(fecha)); return; }
    const deshacer = anotarHecho(x, { fecha, km: actual, costo: 0 });
    guardar();
    toast('✓ ' + x.nombre + ' · ' + (fecha === iso() ? 'hoy' : fechaCorta(fecha)), deshacer);
  },
  // Gestionar: abre ese recordatorio en Recordatorios con su panel de hecho (fecha, km, costo) a la vista
  'rec-gestionar'({ id }, el) { gestionar(id, fechaDelAviso(el)); },
  // Tocar la fila abre o cierra su detalle
  'rec-abrir'({ id }) {
    abierto = abierto.id === id ? { id: null, que: null } : { id, que: 'detalle' };
    repintar();
  },
  // Dentro del detalle: tocar otra vez la misma pestaña la cierra y deja el detalle
  'rec-panel'({ id, q }) {
    abierto = { id, que: abierto.id === id && abierto.que === q ? 'detalle' : q };
    repintar();
  },
  'rec-filtro'({ v }) { filtroEstado = v; repintar(); },
  'rec-sug-vista'({ v }) { sugVista = v; repintar(); },
  'rec-sug-quitar'({ n }) {
    const lista = (r().descartados ??= []);
    if (!lista.includes(n)) lista.push(n);
    guardar();
    toast('Listo: ya no sale «' + n + '»', () => { r().descartados = r().descartados.filter((x) => x !== n); guardar(); });
  },
  'rec-sug-volver'() { delete r().descartados; guardar(); },
  'rec-abrir-agregar'() {
    agregarAbierto = true;
    repintar();
    setTimeout(() => {
      document.querySelector('[data-plantillas]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('rec-buscar')?.focus({ preventScroll: true });
    }, 60);
  },
  'rec-agregar-alternar'() { agregarAbierto = !agregarAbierto; repintar(); },
  // Una sola frecuencia: días o meses
  'rec-frecuencia'({ id }, el) {
    const x = r().lista.find((y) => y.id === id), caja = el.closest('[data-rec-editar]');
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
    // Lleva a la fila nueva, abierta y lista para editar
    abierto = { id: nuevo.id, que: 'editar' };
    agregarAbierto = false;
    guardar();
    setTimeout(() => document.querySelector('[data-rec-id="' + nuevo.id + '"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
    toast(p.icono + ' ' + p.nombre + ' agregado', () => { r().lista.splice(r().lista.indexOf(nuevo), 1); abierto = { id: null, que: null }; guardar(); });
  },
});
