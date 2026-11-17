// Finanzas: registrar y corregir gastos e ingresos (con método de pago), resumen del mes, patrimonio y cuentas, presupuesto 50/30/20,
// pagos e ingresos fijos, metas de ahorro (fondo de emergencia), deudas (las tarjetas vinculadas suben con cada compra) y plata prestada
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { mesDe, sumarMeses, pesos, leerMonto, resumenMes, aportado, agregarMovimiento, quitarMovimiento, cambiarMovimiento, pagoDeuda, esCredito, patrimonio, anotarPatrimonio, interesPrestamo, cobroPrestamo, prestarMas, subsDe, subDe, posibleDuplicado, valorMeta, convertirEnPagoDeuda } from '../finanzas.js';
import { PLANTILLAS_META, slug } from '../datos_finanzas.js';
import { registrar, toast, miles } from '../ui.js';
import './vida.js'; // las acciones de ⏳ 72 h
import { valorCalculadora } from './calculadora.js';
import { moduloPlanB } from './desempleo.js';

let pestana = 'registrar', mesVista = null, filtroCat = null;
const form = { tipo: 'gasto', categoria: null, sub: null, metodo: null, destino: null, monto: '', nota: '', fecha: null, editando: null, deuda: null };
const simula = {}; // deuda id → abono extra al mes que se está probando
const f = () => e().finanzas;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const NOMBRE_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const nombreMes = (mes) => NOMBRE_MES[Number(mes.slice(5, 7)) - 1] + ' ' + mes.slice(0, 4);
const corto = (mes) => NOMBRE_MES[Number(mes.slice(5, 7)) - 1].slice(0, 3);
const millones = (n) => (!Math.round(n / 1e3) ? '0' : Math.abs(n) >= 1e6 ? (n / 1e6).toFixed(1).replace('.0', '') + 'M' : Math.round(n / 1e3) + 'k');
const pct = (x) => (x == null ? '—' : Math.round(x * 100) + ' %');
const cat = (tipo, id) => (f().categorias[tipo === 'ingreso' ? 'ingreso' : 'gasto'].find((c) => c.id === id) || { nombre: id || '—', icono: '🏷️' });
const metodo = (id) => f().metodos.find((m) => m.id === id) || { nombre: id || '', icono: '' };
const cuentas = () => f().metodos.filter((m) => !esCredito(f(), m.id));
// Cada cambio guarda también la foto del patrimonio del mes
const listo = () => { anotarPatrimonio(f()); guardar(); };

export function nuevoMovimiento(m) { agregarMovimiento(f(), m); }

// ➕ Registrar y 📊 Mes están en src/react/pantallas/FinanzasMovimientos.tsx. Aquí siguen el formulario (form), sus acciones
// (💳 Deudas y 🤝 Me deben están en FinanzasDeudas.tsx)

// En "Cuotas y deudas": ¿a cuál deuda va? Así solo el interés cuenta como gasto y el saldo baja
const deudasAbiertas = () => f().deudas.filter((d) => d.saldo > 0);
// Se pueden corregir gastos, ingresos y aportes; las cuotas de deudas y los retiros se borran y se registran de nuevo
const editable = (m) => ['gasto', 'ingreso', 'ahorro', 'transferencia'].includes(m.tipo) && !m.deuda;

const TIPOS = { gasto: '💸 Gasto', ingreso: '💰 Ingreso', ahorro: '🐷 Ahorro', transferencia: '🔄 Transferir' };
const BOTON = { gasto: 'Guardar gasto', ingreso: 'Guardar ingreso', ahorro: 'Guardar ahorro', transferencia: 'Guardar transferencia' };

// ---------- Resumen: patrimonio, cuentas y los últimos 6 meses ----------
// 📈 Resumen, 🎯 Presupuesto, 🔁 Fijos y 🐷 Ahorro están en src/react/pantallas/Finanzas.tsx (sus acciones siguen aquí abajo)

// ---------- Fijos: ingresos y pagos de cada mes ----------
const ESTADOS = { pagado: '✓ Pagado', pronto: 'Pronto', vencido: 'Vencido', pendiente: 'Pendiente' };
const ESTADOS_INGRESO = { pagado: '✓ Recibido', pronto: 'Pronto', vencido: 'No ha llegado', pendiente: 'Pendiente' };
// ---------- Deudas ----------
const plazo = (meses) => (meses === Infinity ? '⚠ nunca' : meses ? meses + (meses === 1 ? ' mes' : ' meses') : '¡Pagada!');

// ---------- Me deben ----------
const ESTADOS_COBRO = { pagado: '✓ Cobrado', pronto: 'Pronto', vencido: 'Sin pagar', pendiente: 'Pendiente' };

// Para las pestañas que ya son de React (src/react/pantallas/Finanzas.tsx): en cuál se está y las ayudas de siempre.
// Las acciones (registrar más abajo) las siguen usando las dos
export const pestanaFinanzas = () => pestana;
// La pestaña con su módulo cuando es Plan B ("planb:lider"): main.js decide con esto si pinta React o la pantalla de antes
export { moduloPlanB };
export const PESTANAS_FINANZAS = { registrar: '➕ Registrar', calcular: '🧮 Calcular', mes: '📊 Mes', resumen: '📈 Resumen', presupuesto: '🎯 Presupuesto', fijos: '🔁 Fijos', ahorro: '🐷 Ahorro', deudas: '💳 Deudas', prestamos: '🤝 Me deben', esperas: '⏳ 72 h', planb: '🛟 Plan B' };
export const piezasFinanzas = {
  cat, metodo, cuentas, pct, corto, nombreMes, millones, ESTADOS, ESTADOS_INGRESO, ESTADOS_COBRO, TIPOS, BOTON, editable, plazo, simula,
  // Lo que la pantalla recuerda mientras está abierta: el formulario de Registrar, el mes que se ve y el filtro de la lista
  form, mesVista: () => mesVista, filtro: () => filtroCat, quitarFiltro: () => { filtroCat = null; },
};

// Pagos que también se usan desde Recordatorios
export function pagarFijo(id) {
  const x = f().fijos.find((y) => y.id === id), ingreso = x && x.tipo === 'ingreso';
  if (!x || !confirm('¿Registrar ' + (ingreso ? 'el ingreso de ' : 'el pago de ') + x.nombre + ' por ' + pesos(x.monto) + '?')) return;
  nuevoMovimiento({ tipo: ingreso ? 'ingreso' : 'gasto', monto: x.monto, categoria: x.categoria, metodo: x.metodo, nota: x.nombre, fijo: x.id });
  listo();
  toast('✓ ' + x.nombre + (ingreso ? ' recibido' : ' pagado'));
}
export function pagarDeuda(id, monto) {
  const d = f().deudas.find((y) => y.id === id);
  monto ||= d && d.cuota;
  if (!d) return;
  if (!monto) { toast('Escribe cuánto pagas'); return; }
  if (!confirm('¿Registrar el pago de ' + d.nombre + ' por ' + pesos(monto) + '?')) return;
  const m = pagoDeuda(f(), d, monto);
  listo();
  toast(d.saldo > 0 ? 'Pago registrado · saldo ' + pesos(d.saldo) + (m.interes ? ' (' + pesos(m.interes) + ' fueron intereses)' : '') : '🎉 ¡' + d.nombre + ' pagada!');
}

export function cobrarPrestamo(id, monto, fecha = iso(), nota = '') {
  const p = f().prestamos.find((y) => y.id === id);
  if (!p) return;
  monto ||= interesPrestamo(p);
  if (!monto) { toast('Escribe cuánto te pagó'); return; }
  if (!confirm('¿' + p.nombre + ' te pagó ' + pesos(monto) + '?')) return;
  const m = cobroPrestamo(f(), p, monto, fecha);
  if (nota) m.nota = nota;
  if (!(p.monto > 0) && m.abono) p.saldado = iso();
  listo();
  toast(p.saldado ? '🎉 ' + p.nombre + ': ¡saldado!' : '✓ Cobrado' + (m.interes ? ' · ' + pesos(m.interes) + ' de intereses' : '') + (m.abono ? ' · te debe ' + pesos(p.monto) : ''));
}

function moverAhorro(id, tipo) {
  const campo = document.querySelector('[data-aporte="' + id + '"]'), monto = leerMonto(campo && campo.value);
  if (!monto) { toast('Escribe el monto'); if (campo) campo.focus(); return; }
  const meta = f().metas.find((m) => m.id === id);
  if (tipo === 'retiro' && monto > (meta ? valorMeta(f(), meta) : aportado(f(), id))) { toast('No hay tanto ahorrado en esa meta'); return; }
  nuevoMovimiento({ tipo, monto, meta: id, metodo: 'transferencia', nota: tipo === 'retiro' ? 'Retiro' : '' });
  campo.value = '';
  listo();
  toast((tipo === 'retiro' ? 'Sacaste ' : '🐷 Ahorraste ') + pesos(monto));
}

// Lo escrito en el formulario se recuerda letra a letra: así da igual el orden (monto, categoría, nota…) y nada se pierde al repintar
if (typeof document !== 'undefined') {
  document.addEventListener('input', (ev) => { const el = ev.target; if (el.matches && el.matches('[data-cambio="fin-form"]')) form[el.dataset.k] = el.value; });
}
// En el computador, al abrir Registrar el cursor queda en el monto (en el celular no, para que no salte el teclado)
const enfocarMonto = () => { if (matchMedia('(min-width: 900px)').matches) setTimeout(() => document.getElementById('fin-monto')?.focus({ preventScroll: true }), 50); };
const datoPrestamo = (k, id) => (document.querySelector('[data-cobro-' + k + '="' + id + '"]') || { value: '' }).value.trim();
// Tras elegir o cambiar la categoría, que quede a la vista lo que sigue (en el celular la cuadrícula es larga)
const verElegida = () => setTimeout(() => document.querySelector('.subcats, .fin-buscar, [data-t=elegida], [aria-label="Buscar categoría"]')?.scrollIntoView({ block: 'nearest' }), 30);
const limpiar = () => Object.assign(form, { monto: '', nota: '', fecha: null, categoria: null, sub: null, editando: null, deuda: null });

registrar({
  'abrir-finanzas'({ p }) { if (PESTANAS_FINANZAS[p]) pestana = p; },
  'fin-pestana'({ p }) { pestana = p; repintar(); window.scrollTo(0, 0); if (p === 'registrar') enfocarMonto(); },
  // Lo que dio la calculadora pasa como monto al formulario de Registrar
  'calc-usar'() {
    const v = valorCalculadora();
    if (!v) { toast('Primero haz una cuenta con resultado mayor que cero'); return; }
    form.monto = miles(v);
    pestana = 'registrar';
    repintar();
    window.scrollTo(0, 0);
    toast('Monto ' + pesos(v) + ': elige categoría y guarda');
  },
  'fin-tipo'({ tipo }) { form.tipo = tipo; form.categoria = null; form.sub = null; repintar(); },
  'fin-cat'({ id }) { if (form.categoria !== id) { form.sub = null; form.deuda = null; } form.categoria = id || null; repintar(); verElegida(); },
  'fin-sub'({ id }) { form.sub = form.sub === id ? null : id; repintar(); },
  'fin-elegir'({ cat: c, sub }) { form.categoria = c; form.sub = sub || null; repintar(); verElegida(); },
  'fin-destino'({ id }) { form.destino = id; repintar(); },
  'fin-sub-nueva'() {
    const nombre = (prompt('Nombre de la subcategoría en ' + cat(form.tipo, form.categoria).nombre + ':') || '').trim(), id = slug(nombre);
    if (!id || !form.categoria) return;
    if (!subsDe(f(), form.categoria).some((x) => x.id === id)) (f().subs ||= []).push({ id, cat: form.categoria, nombre, icono: '🏷️' });
    form.sub = id;
    guardar();
  },
  'fin-meta-plantilla'({ nombre }) {
    const x = PLANTILLAS_META.find((y) => y.nombre === nombre);
    if (!x) return;
    f().metas.push({ id: 'meta' + uid(), nombre: x.nombre, icono: x.icono, objetivo: 0, ...(x.inversion ? { inversion: 'si' } : {}) });
    guardar();
    toast('✓ ' + x.icono + ' ' + x.nombre + ' agregada');
  },
  'fin-valor-meta'({ id }) {
    const campo = document.querySelector('[data-valor-meta="' + id + '"]'), monto = leerMonto(campo && campo.value), m = f().metas.find((x) => x.id === id);
    if (!m) return;
    if (!monto) { toast('Escribe cuánto vale hoy'); if (campo) campo.focus(); return; }
    m.valor = { monto, fecha: iso(), ts: Date.now() };
    listo();
    toast('✓ ' + m.nombre + ' vale ' + pesos(monto));
  },
  'fin-metodo'({ id }) { form.metodo = id; repintar(); },
  'fin-deuda'({ id }) { form.deuda = id; repintar(); },
  'fin-nota'({ nota, sub, monto }) {
    form.nota = nota;
    if (sub) form.sub = sub;
    const campo = document.getElementById('fin-monto');
    if (!leerMonto(campo ? campo.value : form.monto)) form.monto = miles(Number(monto));
    else if (campo) form.monto = campo.value;
    repintar();
  },
  // Pagos ya anotados como gasto en "Cuotas y deudas": pasarlos a su deuda o dejarlos como gasto
  'fin-convertir'({ id, deuda }) {
    const m = f().movimientos.find((x) => x.id === id), d = f().deudas.find((x) => x.id === deuda);
    if (!m || !d || !confirm('¿Los ' + pesos(m.monto) + ' del ' + fechaCorta(m.fecha) + ' fueron un pago a ' + d.nombre + '?\nEl saldo baja de ' + pesos(d.saldo) + ' y solo el interés cuenta como gasto. Si ya bajaste el saldo a mano, corrígelo después en 💳 Deudas.')) return;
    const p = convertirEnPagoDeuda(f(), id, deuda);
    listo();
    toast('✓ ' + d.nombre + ': saldo ' + pesos(d.saldo) + (p.interes ? ' · ' + pesos(p.interes) + ' de interés' : ''));
  },
  'fin-no-es-deuda'({ id }) {
    const m = f().movimientos.find((x) => x.id === id);
    if (m) { m.noEsDeuda = true; guardar(); }
  },
  'fin-filtro-cat'({ id }, el, ev) { if (ev) ev.preventDefault(); filtroCat = id && id !== filtroCat ? id : null; repintar(); },
  'fin-form'({ k }, el) { form[k] = el.value; },
  'fin-mes'({ n }) { mesVista = mesDe(sumarMeses((mesVista || mesDe(iso())) + '-01', Number(n))); if (mesVista >= mesDe(iso())) mesVista = null; repintar(); },
  'fin-guardar'() {
    const campo = document.getElementById('fin-monto'), monto = leerMonto(campo ? campo.value : form.monto);
    if (!monto) { toast('Escribe el monto'); if (campo) campo.focus(); return; }
    const transf = form.tipo === 'transferencia';
    if (transf && (!form.destino || form.destino === form.metodo)) { toast('Elige de qué cuenta sale y a cuál llega'); return; }
    if (!transf && !form.categoria) { toast(form.tipo === 'ahorro' ? 'Elige la meta de ahorro' : 'Elige la categoría'); return; }
    const base = { tipo: form.tipo, monto, metodo: form.metodo, nota: form.nota.trim(), fecha: form.fecha || iso() };
    const datos = transf ? { ...base, destino: form.destino, categoria: undefined, sub: undefined, meta: undefined }
      : form.tipo === 'ahorro' ? { ...base, meta: form.categoria, categoria: undefined, sub: undefined } : { ...base, categoria: form.categoria, sub: form.sub || undefined, meta: undefined };
    const nombre = transf ? 'De ' + metodo(form.metodo).nombre + ' a ' + metodo(form.destino).nombre
      : form.tipo === 'ahorro' ? (f().metas.find((m) => m.id === form.categoria) || {}).nombre : (subDe(f(), form.categoria, form.sub) || cat(form.tipo, form.categoria)).nombre;
    const editando = form.editando;
    const deuda = !editando && form.tipo === 'gasto' && form.categoria === 'deudas' && deudasAbiertas().find((d) => d.id === form.deuda);
    if (deuda) {
      const m = pagoDeuda(f(), deuda, monto, base.fecha, { metodo: base.metodo, ...(base.nota ? { nota: base.nota } : {}), ...(form.sub ? { sub: form.sub } : {}) });
      limpiar();
      listo();
      toast('✓ Pago a ' + deuda.nombre + (m.interes ? ' · ' + pesos(m.interes) + ' de interés' : '') + ' · saldo ' + pesos(deuda.saldo));
      return;
    }
    // Mismo monto, misma categoría y mismo día: puede que ya lo hayas anotado
    const igual = !editando && posibleDuplicado(f(), datos);
    if (igual && !confirm('Ya anotaste ' + pesos(monto) + ' en ' + nombre + ' ese día. ¿Guardar otro igual?')) return;
    if (editando) cambiarMovimiento(f(), editando, datos); else nuevoMovimiento(datos);
    // Aviso si con este gasto la categoría pasa su presupuesto
    const c = form.tipo === 'gasto' && cat('gasto', form.categoria), lleva = c && c.presupuesto ? resumenMes(f(), mesDe(base.fecha)).porCategoria[c.id] || 0 : 0;
    limpiar();
    listo();
    toast(lleva > c.presupuesto ? '⚠ ' + c.nombre + ': te pasaste del presupuesto por ' + pesos(lleva - c.presupuesto) : (editando ? '✓ Corregido · ' : '✓ ') + pesos(monto) + ' · ' + nombre);
  },
  'fin-editar-mov'({ id }) {
    const m = f().movimientos.find((x) => x.id === id);
    if (!m) return;
    Object.assign(form, { tipo: m.tipo, categoria: m.tipo === 'ahorro' ? m.meta : m.categoria, sub: m.sub || null, metodo: m.metodo, destino: m.destino || null, monto: miles(m.monto), nota: m.nota || '', fecha: m.fecha, editando: id });
    pestana = 'registrar';
    repintar();
    window.scrollTo(0, 0);
  },
  'fin-cancelar-edicion'() { limpiar(); repintar(); },
  'fin-borrar-mov'({ id }) {
    const m = f().movimientos.find((x) => x.id === id);
    if (!m || !confirm('¿Borrar este movimiento de ' + pesos(m.monto) + '?' + (m.cargo || m.abono ? '\nEl saldo de la deuda vuelve a como estaba.' : ''))) return;
    quitarMovimiento(f(), id);
    if (form.editando === id) limpiar();
    listo();
  },
  'fin-pesos'({ ruta }, el) {
    const partes = ruta.split('.'), ultima = partes.pop(), obj = partes.reduce((o, k) => o[k], e());
    obj[ultima] = leerMonto(el.value);
    listo();
  },
  'fin-pagar-fijo'({ id }) { pagarFijo(id); },
  'fin-pagar-deuda'({ id }) {
    const campo = document.querySelector('[data-pago="' + id + '"]');
    pagarDeuda(id, campo ? leerMonto(campo.value) : 0);
  },
  'fin-cobrar'({ id }) {
    const campo = document.querySelector('[data-cobro="' + id + '"]');
    cobrarPrestamo(id, campo ? leerMonto(campo.value) : 0, datoPrestamo('fecha', id) || iso(), datoPrestamo('nota', id));
  },
  'fin-prestar'({ id }) {
    const p = f().prestamos.find((y) => y.id === id), campo = document.querySelector('[data-cobro="' + id + '"]'), monto = leerMonto(campo && campo.value);
    if (!p) return;
    if (!monto) { toast('Escribe cuánto le prestaste'); if (campo) campo.focus(); return; }
    prestarMas(f(), p, monto, datoPrestamo('fecha', id) || iso(), datoPrestamo('nota', id));
    listo();
    toast('🤝 Anotado · te debe ' + pesos(p.monto));
  },
  'fin-saldar'({ id }) {
    const p = f().prestamos.find((y) => y.id === id), monto = Math.max(0, (p && p.monto) || 0);
    if (!p || !confirm(monto ? '¿' + p.nombre + ' te devolvió los ' + pesos(monto) + ' que faltaban?' : '¿Ya quedó saldado ' + p.nombre + '?')) return;
    if (monto) cobroPrestamo(f(), p, monto, iso(), true);
    p.saldado = iso();
    listo();
    toast('🎉 ' + p.nombre + ': ¡saldado!');
  },
  'fin-reabrir'({ id }) {
    const p = f().prestamos.find((y) => y.id === id);
    if (p) { delete p.saldado; guardar(); }
  },
  'fin-simular'({ id }, el) { simula[id] = leerMonto(el.value); repintar(); },
  'fin-aportar'({ id }) { moverAhorro(id, 'ahorro'); },
  'fin-retirar'({ id }) { moverAhorro(id, 'retiro'); },
  'fin-ajustar'({ id }) {
    const campo = document.querySelector('[data-saldo="' + id + '"]'), texto = (campo && campo.value.trim()) || '';
    if (!texto) { toast('Escribe cuánto hay hoy'); if (campo) campo.focus(); return; }
    const m = f().metodos.find((x) => x.id === id), monto = /^[-−]/.test(texto) ? -leerMonto(texto.slice(1)) : leerMonto(texto);
    m.ajuste = { monto, fecha: iso(), ts: Date.now() };
    listo();
    toast('✓ ' + m.nombre + ': ' + pesos(monto));
  },
  'fin-agregar-ingreso-fijo'() {
    const c = cuentas().find((m) => m.id === 'debito') || cuentas()[0];
    f().fijos.push({ id: 'f' + uid(), tipo: 'ingreso', nombre: 'Salario', monto: 0, categoria: 'salario', metodo: c ? c.id : 'transferencia', dia: 30 });
    guardar();
  },
  'fin-revisar-fijo'({ id }) {
    const x = f().fijos.find((y) => y.id === id);
    if (x) { x.revisado = iso(); guardar(); }
  },
  'fin-cancelar-fijo'({ id }) {
    const i = f().fijos.findIndex((y) => y.id === id), x = f().fijos[i];
    if (!x || !confirm('¿Cancelaste ' + x.nombre + '? Se quita de los pagos fijos y los ' + pesos(x.monto * 12) + ' del año cuentan como ahorro en ⏳ 72 h.')) return;
    f().fijos.splice(i, 1);
    (f().esperas ||= []).push({ id: 'e' + uid(), tipo: 'compra', nombre: 'Cancelé ' + x.nombre + ' (1 año)', monto: x.monto * 12, motivo: 'Revisión de deseos fijos', fecha: iso(), ts: Date.now(), estado: 'descartado', decidido: iso() });
    guardar();
    toast('✂️ ' + x.nombre + ' cancelada · ' + pesos(x.monto * 12) + ' al año');
  },
});
