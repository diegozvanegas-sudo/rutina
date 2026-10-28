// Finanzas: registrar gastos e ingresos (con método de pago), resumen del mes, presupuesto 50/30/20,
// pagos fijos, metas de ahorro (fondo de emergencia) y deudas
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta, fechaLarga, sumarDias } from '../fechas.js';
import { mesDe, sumarMeses, pesos, leerMonto, resumenMes, gastoPromedio, aportado, objetivoMeta, estadoFijo, estadoDeuda, mesesParaPagar } from '../finanzas.js';
import { esc, barra, registrar, toast, subirBajar } from '../ui.js';
import { vistaEsperas } from './vida.js';

let pestana = 'registrar', mesVista = null;
const form = { tipo: 'gasto', categoria: null, metodo: null, monto: '', nota: '', fecha: null };
const f = () => e().finanzas;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const NOMBRE_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const nombreMes = (mes) => NOMBRE_MES[Number(mes.slice(5, 7)) - 1] + ' ' + mes.slice(0, 4);
const pct = (x) => (x == null ? '—' : Math.round(x * 100) + ' %');
const cat = (tipo, id) => (f().categorias[tipo === 'ingreso' ? 'ingreso' : 'gasto'].find((c) => c.id === id) || { nombre: id || '—', icono: '🏷️' });
const metodo = (id) => f().metodos.find((m) => m.id === id) || { nombre: id || '', icono: '' };

// Campo de dinero: acepta "25.000", "25000", "25k", "1,5M"
const campoPesos = (titulo, ruta, valor) =>
  '<label class="campo">' + titulo + '<input type="text" inputmode="numeric" data-cambio="fin-pesos" data-ruta="' + ruta + '" value="' + (valor ? Math.round(valor).toLocaleString('es-CO') : '') + '" placeholder="$ 0" autocomplete="off"></label>';
const campoTexto = (titulo, ruta, valor, extra = '') =>
  '<label class="campo">' + titulo + '<input type="text" data-cambio="ed" data-ruta="' + ruta + '" value="' + esc(valor ?? '') + '"' + extra + '></label>';
const campoNumero = (titulo, ruta, valor, paso = '1') =>
  '<label class="campo">' + titulo + '<input type="number" inputmode="decimal" min="0" step="' + paso + '" data-cambio="ed" data-tipo="num" data-ruta="' + ruta + '" value="' + esc(valor ?? '') + '"></label>';
const selector = (titulo, ruta, valor, opciones) =>
  '<label class="campo">' + titulo + '<select data-cambio="ed" data-ruta="' + ruta + '">' + opciones.map((o) => '<option value="' + esc(o.id) + '"' + (o.id === valor ? ' selected' : '') + '>' + esc((o.icono ? o.icono + ' ' : '') + o.nombre) + '</option>').join('') + '</select></label>';
const borrar = (lista, i, nombre) => '<span class="ed-controles">' + subirBajar(lista, i) + '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="' + lista + '" data-i="' + i + '" data-nombre="' + esc(nombre) + '" aria-label="Borrar">🗑</button></span>';

export function nuevoMovimiento(m) {
  f().movimientos.push({ id: 'm' + uid(), fecha: iso(), metodo: 'efectivo', nota: '', ...m, monto: Math.round(m.monto) });
}

// ---------- Registrar ----------
function filaMovimiento(m) {
  const c = m.tipo === 'ahorro' || m.tipo === 'retiro' ? { icono: '🐷', nombre: (f().metas.find((x) => x.id === m.meta) || {}).nombre || 'Ahorro' } : cat(m.tipo, m.categoria);
  const signo = m.tipo === 'ingreso' || m.tipo === 'retiro' ? '+' : '−';
  return '<li class="mov t-' + m.tipo + '"><span class="mov-ic">' + c.icono + '</span><span class="mov-txt"><b>' + esc(c.nombre) + '</b><small>' +
    esc([m.nota, metodo(m.metodo).nombre].filter(Boolean).join(' · ')) + '</small></span><span class="mov-monto">' + signo + ' ' + pesos(m.monto) + '</span>' +
    '<button type="button" class="icono borrar" data-accion="fin-borrar-mov" data-id="' + m.id + '" aria-label="Borrar movimiento">✕</button></li>';
}
function listaMovimientos(movs) {
  const porDia = {};
  for (const m of [...movs].sort((a, b) => b.fecha.localeCompare(a.fecha) || (b.id > a.id ? 1 : -1))) (porDia[m.fecha] ??= []).push(m);
  return Object.entries(porDia).map(([fecha, lista]) => '<h3 class="dia-mov">' + (fecha === iso() ? 'Hoy' : fecha === sumarDias(iso(), -1) ? 'Ayer' : fechaLarga(fecha)) + '</h3><ul class="movs">' + lista.map(filaMovimiento).join('') + '</ul>').join('')
    || '<p class="nota-corta">Todavía no hay movimientos este mes.</p>';
}

function vistaRegistrar() {
  const tipos = { gasto: '💸 Gasto', ingreso: '💰 Ingreso', ahorro: '🐷 Ahorro' };
  const cats = form.tipo === 'ahorro' ? f().metas.map((m) => ({ id: m.id, nombre: m.nombre, icono: m.icono || '🐷' })) : f().categorias[form.tipo === 'ingreso' ? 'ingreso' : 'gasto'];
  if (!cats.some((c) => c.id === form.categoria)) form.categoria = null;
  const ultimoMetodo = [...f().movimientos].reverse().find((m) => m.metodo);
  form.metodo ??= ultimoMetodo ? ultimoMetodo.metodo : 'efectivo';
  const r = resumenMes(f(), mesDe(iso()));
  return '<section class="tarjeta registrar"><nav class="chips">' + Object.entries(tipos).map(([k, t]) =>
    '<button type="button" class="chip' + (k === form.tipo ? ' activo' : '') + '" data-accion="fin-tipo" data-tipo="' + k + '">' + t + '</button>').join('') + '</nav>' +
    '<input id="fin-monto" class="monto-grande" type="text" inputmode="numeric" data-cambio="fin-form" data-k="monto" value="' + esc(form.monto) + '" placeholder="$ 0" aria-label="Monto" autocomplete="off">' +
    '<div class="rejilla-cats">' + cats.map((c) => '<button type="button" class="cat' + (c.id === form.categoria ? ' activo' : '') + '" data-accion="fin-cat" data-id="' + esc(c.id) + '"><span>' + c.icono + '</span>' + esc(c.nombre) + '</button>').join('') + '</div>' +
    (form.tipo === 'ingreso' ? '' : '<div class="chips metodos">' + f().metodos.map((m) => '<button type="button" class="chip' + (m.id === form.metodo ? ' activo' : '') + '" data-accion="fin-metodo" data-id="' + m.id + '">' + m.icono + ' ' + esc(m.nombre) + '</button>').join('') + '</div>') +
    '<div class="dos"><label class="campo">Nota<input type="text" data-cambio="fin-form" data-k="nota" value="' + esc(form.nota) + '" placeholder="Opcional"></label>' +
    '<label class="campo">Fecha<input type="date" data-cambio="fin-form" data-k="fecha" value="' + (form.fecha || iso()) + '" max="' + iso() + '"></label></div>' +
    '<button type="button" class="boton primario grande ancho" data-accion="fin-guardar">Guardar ' + tipos[form.tipo].split(' ')[1].toLowerCase() + '</button></section>' +
    '<section class="tarjeta"><div class="fila-resumen"><h2>' + nombreMes(mesDe(iso())) + '</h2><span>Gastado <b>' + pesos(r.gastos) + '</b></span></div>' + listaMovimientos(r.movs) + '</section>';
}

// ---------- Mes ----------
function vistaMes() {
  const mes = mesVista || mesDe(iso()), r = resumenMes(f(), mes), ing = r.ingresos;
  const cats = f().categorias.gasto.filter((c) => r.porCategoria[c.id] || c.presupuesto).sort((a, b) => (r.porCategoria[b.id] || 0) - (r.porCategoria[a.id] || 0));
  const reglas = [['necesidad', 'Necesidades', r.porGrupo.necesidad, 0.5, 'máx.'], ['deseo', 'Deseos', r.porGrupo.deseo, 0.3, 'máx.'], ['ahorro', 'Ahorro', Math.max(0, ing - r.gastos), 0.2, 'mín.']];
  return '<div class="cab-vista"><button type="button" class="icono" data-accion="fin-mes" data-n="-1" aria-label="Mes anterior">‹</button><h2>' + nombreMes(mes) + '</h2>' +
    '<button type="button" class="icono" data-accion="fin-mes" data-n="1" aria-label="Mes siguiente"' + (mes >= mesDe(iso()) ? ' disabled' : '') + '>›</button></div>' +
    '<section class="tarjeta"><div class="datos-peso">' +
    '<div><small>Ingresos</small><b class="verde">' + pesos(ing) + '</b></div><div><small>Gastos</small><b class="rojo">' + pesos(r.gastos) + '</b></div>' +
    '<div><small>A ahorro</small><b class="azul">' + pesos(r.ahorro) + '</b></div><div><small>Disponible</small><b>' + pesos(r.balance) + '</b></div></div>' +
    '<div class="fila-resumen"><span>Tasa de ahorro</span><b class="' + (r.tasaAhorro >= 0.2 ? 'verde' : r.tasaAhorro > 0 ? 'amarillo' : 'rojo') + '">' + pct(r.tasaAhorro) + '</b></div>' +
    (r.proyeccion ? '<p class="nota-corta">A este ritmo terminarías el mes gastando <b>' + pesos(r.proyeccion) + '</b>' + (ing ? ' (' + pct(r.proyeccion / ing) + ' de lo que entró)' : '') + '.</p>' : '') + '</section>' +
    (ing ? '<section class="tarjeta"><h2>Regla 50 / 30 / 20</h2>' + reglas.map(([k, t, v, obj, tope]) => {
      const p = v / ing, mal = k === 'ahorro' ? p < obj : p > obj;
      return '<div class="fila-resumen"><span>' + t + ' <small>(' + tope + ' ' + obj * 100 + ' %)</small></span><span><b class="' + (mal ? 'rojo' : 'verde') + '">' + pct(p) + '</b> · ' + pesos(v) + '</span></div>' + barra(p / obj, mal ? 'excedido' : '');
    }).join('') + '</section>' : '<p class="aviso">Registra tus ingresos del mes para ver la regla 50/30/20 y la tasa de ahorro.</p>') +
    '<section class="tarjeta"><h2>Por categoría</h2>' + (cats.length ? cats.map((c) => {
      const v = r.porCategoria[c.id] || 0, tope = c.presupuesto, pasado = tope && v > tope;
      return '<div class="fila-resumen"><span>' + c.icono + ' ' + esc(c.nombre) + '</span><span><b class="' + (pasado ? 'rojo' : '') + '">' + pesos(v) + '</b>' + (tope ? ' / ' + pesos(tope) : '') + '</span></div>' +
        barra(tope ? v / tope : r.gastos ? v / r.gastos : 0, pasado ? 'excedido' : '');
    }).join('') : '<p class="nota-corta">Sin gastos este mes.</p>') + '</section>' +
    (Object.keys(r.porMetodo).length ? '<section class="tarjeta"><h2>Por método de pago</h2>' + Object.entries(r.porMetodo).sort((a, b) => b[1] - a[1]).map(([id, v]) =>
      '<div class="fila-resumen"><span>' + metodo(id).icono + ' ' + esc(metodo(id).nombre) + '</span><b>' + pesos(v) + '</b></div>').join('') +
      (r.porMetodo.credito ? '<p class="nota-corta">💳 Con tarjeta de crédito: ' + pesos(r.porMetodo.credito) + '. Págala completa antes de la fecha límite para no pagar intereses.</p>' : '') + '</section>' : '') +
    '<section class="tarjeta"><h2>Movimientos</h2>' + listaMovimientos(r.movs) + '</section>';
}

// ---------- Presupuesto ----------
function vistaPresupuesto() {
  const lista = f().categorias.gasto, hoy = iso();
  const ingresos = [1, 2, 3].map((i) => resumenMes(f(), mesDe(sumarMeses(hoy.slice(0, 8) + '01', -i))).ingresos).filter(Boolean);
  const ingreso = ingresos.length ? ingresos.reduce((a, b) => a + b, 0) / ingresos.length : resumenMes(f(), mesDe(hoy)).ingresos;
  const suma = (g) => lista.filter((c) => c.grupo === g).reduce((s, c) => s + (c.presupuesto || 0), 0);
  return '<section class="tarjeta"><h2>Cómo repartir</h2><p class="nota-corta">Regla 50/30/20: hasta 50 % del ingreso en necesidades, hasta 30 % en deseos y al menos 20 % a ahorro o a pagar deudas.</p>' +
    (ingreso ? '<div class="datos-peso"><div><small>Ingreso de referencia</small><b>' + pesos(ingreso) + '</b></div>' +
      '<div><small>Necesidades (50 %)</small><b>' + pesos(ingreso * 0.5) + '</b><small>presupuestado ' + pesos(suma('necesidad')) + '</small></div>' +
      '<div><small>Deseos (30 %)</small><b>' + pesos(ingreso * 0.3) + '</b><small>presupuestado ' + pesos(suma('deseo')) + '</small></div>' +
      '<div><small>Ahorro (20 %)</small><b>' + pesos(ingreso * 0.2) + '</b></div></div>' : '<p class="aviso">Cuando registres ingresos, aquí aparece cuánto te toca por grupo.</p>') + '</section>' +
    lista.map((c, i) => {
      const r = 'finanzas.categorias.gasto.' + i;
      return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + c.icono + ' ' + esc(c.nombre) + '</b>' + borrar('finanzas.categorias.gasto', i, c.nombre) + '</div>' +
        '<div class="dos">' + campoPesos('Presupuesto del mes', r + '.presupuesto', c.presupuesto) +
        selector('Grupo', r + '.grupo', c.grupo, [{ id: 'necesidad', nombre: 'Necesidad' }, { id: 'deseo', nombre: 'Deseo' }]) + '</div>' +
        '<details><summary>Nombre e ícono</summary><div class="dos">' + campoTexto('Nombre', r + '.nombre', c.nombre) + campoTexto('Ícono', r + '.icono', c.icono, ' maxlength="4"') + '</div></details></section>';
    }).join('') +
    '<button type="button" class="boton secundario grande ancho" data-accion="ed-agregar" data-lista="finanzas.categorias.gasto">＋ Categoría</button>';
}

// ---------- Pagos fijos ----------
const ESTADOS = { pagado: '✓ Pagado', pronto: 'Pronto', vencido: 'Vencido', pendiente: 'Pendiente' };
function vistaFijos() {
  const total = f().fijos.reduce((s, x) => s + (x.monto || 0), 0);
  return '<section class="tarjeta"><div class="fila-resumen"><h2>Pagos de cada mes</h2><b>' + pesos(total) + '</b></div>' +
    '<p class="nota-corta">Arriendo, servicios, celular, suscripciones, cuotas… Aparecen solos en 🔔 Recordatorios cuando se acerca el día.</p></section>' +
    f().fijos.map((x, i) => {
      const s = estadoFijo(f(), x), r = 'finanzas.fijos.' + i;
      return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + cat('gasto', x.categoria).icono + ' ' + esc(x.nombre) + '</b><span class="estado e-' + s.estado + '">' + ESTADOS[s.estado] + '</span></div>' +
        '<div class="fila-resumen nota-corta"><span>Día ' + x.dia + ' de cada mes · ' + fechaCorta(s.fecha) + '</span><b>' + pesos(x.monto) + '</b></div>' +
        (s.estado === 'pagado' ? '' : '<button type="button" class="boton primario ancho" data-accion="fin-pagar-fijo" data-id="' + x.id + '">Registrar pago de ' + pesos(x.monto) + '</button>') +
        '<details><summary>Editar</summary><div class="dos">' + campoTexto('Nombre', r + '.nombre', x.nombre) + campoPesos('Monto', r + '.monto', x.monto) +
        campoNumero('Día de pago', r + '.dia', x.dia) + selector('Categoría', r + '.categoria', x.categoria, f().categorias.gasto) +
        selector('Método', r + '.metodo', x.metodo, f().metodos) + '</div>' + borrar('finanzas.fijos', i, x.nombre) + '</details></section>';
    }).join('') +
    '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="finanzas.fijos">＋ Pago fijo</button>';
}

// ---------- Ahorro ----------
function vistaAhorro() {
  const prom = gastoPromedio(f());
  return f().metas.map((m, i) => {
    const r = 'finanzas.metas.' + i, obj = objetivoMeta(f(), m), lleva = aportado(f(), m.id);
    return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + (m.icono || '🐷') + ' ' + esc(m.nombre) + '</b>' + (m.id === 'emergencia' ? '' : borrar('finanzas.metas', i, m.nombre)) + '</div>' +
      '<div class="fila-resumen"><span><b>' + pesos(lleva) + '</b> de ' + (obj ? pesos(obj) : '—') + '</span><b>' + (obj ? pct(lleva / obj) : '') + '</b></div>' + barra(obj ? lleva / obj : 0) +
      (m.id === 'emergencia' ? '<p class="nota-corta">Para imprevistos (salud, moto, quedarte sin ingreso). La meta es ' + (m.meses || 6) + ' meses de gastos' +
        (prom ? ' (gastas en promedio ' + pesos(prom) + ' al mes)' : '; registra tus gastos y se calcula sola') + '. Guárdalo aparte, en una cuenta que puedas sacar rápido.</p>' : '') +
      '<div class="aportar"><input type="text" inputmode="numeric" placeholder="$ 0" aria-label="Monto" data-aporte="' + m.id + '">' +
      '<button type="button" class="boton primario" data-accion="fin-aportar" data-id="' + m.id + '">＋ Aportar</button>' +
      '<button type="button" class="boton secundario" data-accion="fin-retirar" data-id="' + m.id + '">Sacar</button></div>' +
      '<details><summary>Editar meta</summary><div class="dos">' + campoTexto('Nombre', r + '.nombre', m.nombre) + campoTexto('Ícono', r + '.icono', m.icono, ' maxlength="4"') +
      (m.id === 'emergencia' ? campoNumero('Meses de gastos', r + '.meses', m.meses || 6) : '') + campoPesos(m.id === 'emergencia' ? 'Meta fija (opcional)' : 'Meta', r + '.objetivo', m.objetivo) + '</div></details></section>';
  }).join('') + '<button type="button" class="boton secundario grande ancho" data-accion="ed-agregar" data-lista="finanzas.metas">＋ Meta de ahorro</button>';
}

// ---------- Deudas ----------
function vistaDeudas() {
  const lista = f().deudas, total = lista.reduce((s, d) => s + (d.saldo || 0), 0);
  const orden = [...lista].filter((d) => d.saldo > 0).sort((a, b) => (b.tasa || 0) - (a.tasa || 0));
  return '<section class="tarjeta"><div class="fila-resumen"><h2>Lo que debes</h2><b class="' + (total ? 'rojo' : 'verde') + '">' + pesos(total) + '</b></div>' +
    (orden.length > 1 ? '<p class="nota-corta">Estrategia avalancha: paga el mínimo en todas y lo que sobre a la de mayor interés: <b>' + esc(orden[0].nombre) + '</b> (' + orden[0].tasa + ' % mensual).</p>' : '') + '</section>' +
    lista.map((d, i) => {
      const r = 'finanzas.deudas.' + i, meses = mesesParaPagar(d.saldo, d.tasa, d.cuota), s = d.dia ? estadoDeuda(f(), d) : null;
      const interes = (d.saldo || 0) * ((d.tasa || 0) / 100);
      return '<section class="tarjeta ed-item"><div class="ed-cab"><b>💳 ' + esc(d.nombre) + '</b>' + (s ? '<span class="estado e-' + s.estado + '">' + ESTADOS[s.estado] + '</span>' : '') + '</div>' +
        '<div class="datos-peso"><div><small>Saldo</small><b>' + pesos(d.saldo) + '</b></div><div><small>Cuota</small><b>' + pesos(d.cuota) + '</b></div>' +
        '<div><small>Interés del mes</small><b>' + pesos(interes) + '</b></div><div><small>Terminas en</small><b>' + (meses === Infinity ? '⚠ nunca' : meses ? meses + ' meses' : '¡Pagada!') + '</b></div></div>' +
        (meses === Infinity && d.saldo > 0 ? '<p class="aviso">La cuota no alcanza ni para el interés: sube la cuota o refinancia.</p>' : '') +
        (d.saldo > 0 && (!s || s.estado !== 'pagado') ? '<button type="button" class="boton primario ancho" data-accion="fin-pagar-deuda" data-id="' + d.id + '">Registrar cuota de ' + pesos(d.cuota) + '</button>' : '') +
        '<details><summary>Editar</summary><div class="dos">' + campoTexto('Nombre', r + '.nombre', d.nombre) + campoPesos('Saldo', r + '.saldo', d.saldo) +
        campoPesos('Cuota', r + '.cuota', d.cuota) + campoNumero('Interés % mensual', r + '.tasa', d.tasa, '0.01') + campoNumero('Día de pago', r + '.dia', d.dia) + '</div>' +
        borrar('finanzas.deudas', i, d.nombre) + '</details></section>';
    }).join('') + '<button type="button" class="boton secundario grande ancho" data-accion="ed-agregar" data-lista="finanzas.deudas">＋ Deuda o tarjeta</button>';
}

export function vistaFinanzas() {
  const tabs = { registrar: '➕ Registrar', mes: '📊 Mes', presupuesto: '🎯 Presupuesto', fijos: '🔁 Fijos', ahorro: '🐷 Ahorro', deudas: '💳 Deudas', esperas: '⏳ 72 h' };
  return '<h1>Finanzas</h1><nav class="chips pestanas">' + Object.entries(tabs).map(([k, t]) =>
    '<button type="button" class="chip' + (k === pestana ? ' activo' : '') + '" data-accion="fin-pestana" data-p="' + k + '">' + t + '</button>').join('') + '</nav>' +
    ({ mes: vistaMes, presupuesto: vistaPresupuesto, fijos: vistaFijos, ahorro: vistaAhorro, deudas: vistaDeudas, esperas: vistaEsperas }[pestana] || vistaRegistrar)();
}

// Pagos que también se usan desde Recordatorios
export function pagarFijo(id) {
  const x = f().fijos.find((y) => y.id === id);
  if (!x || !confirm('¿Registrar el pago de ' + x.nombre + ' por ' + pesos(x.monto) + '?')) return;
  nuevoMovimiento({ tipo: 'gasto', monto: x.monto, categoria: x.categoria, metodo: x.metodo, nota: x.nombre, fijo: x.id });
  guardar();
  toast('✓ ' + x.nombre + ' pagado');
}
export function pagarDeuda(id) {
  const d = f().deudas.find((y) => y.id === id);
  if (!d || !confirm('¿Registrar la cuota de ' + d.nombre + ' por ' + pesos(d.cuota) + '?')) return;
  // La cuota paga primero el interés del mes; lo demás baja el saldo
  const interes = Math.round((d.saldo || 0) * ((d.tasa || 0) / 100));
  d.saldo = Math.max(0, Math.round((d.saldo || 0) - Math.max(0, d.cuota - interes)));
  nuevoMovimiento({ tipo: 'gasto', monto: d.cuota, categoria: 'deudas', metodo: 'transferencia', nota: 'Cuota ' + d.nombre, fijo: 'deuda:' + d.id, deuda: d.id });
  guardar();
  toast(d.saldo ? 'Cuota registrada · saldo ' + pesos(d.saldo) : '🎉 ¡' + d.nombre + ' pagada!');
}

function moverAhorro(id, tipo) {
  const campo = document.querySelector('[data-aporte="' + id + '"]'), monto = leerMonto(campo && campo.value);
  if (!monto) { toast('Escribe el monto'); if (campo) campo.focus(); return; }
  if (tipo === 'retiro' && monto > aportado(f(), id)) { toast('No hay tanto ahorrado en esa meta'); return; }
  nuevoMovimiento({ tipo, monto, meta: id, metodo: 'transferencia', nota: tipo === 'retiro' ? 'Retiro' : '' });
  campo.value = '';
  guardar();
  toast((tipo === 'retiro' ? 'Sacaste ' : '🐷 Ahorraste ') + pesos(monto));
}

registrar({
  'abrir-finanzas'({ p }) { pestana = p; },
  'fin-pestana'({ p }) { pestana = p; repintar(); window.scrollTo(0, 0); },
  'fin-tipo'({ tipo }) { form.tipo = tipo; form.categoria = null; repintar(); },
  'fin-cat'({ id }) { form.categoria = id; repintar(); },
  'fin-metodo'({ id }) { form.metodo = id; repintar(); },
  'fin-form'({ k }, el) { form[k] = el.value; },
  'fin-mes'({ n }) { mesVista = mesDe(sumarMeses((mesVista || mesDe(iso())) + '-01', Number(n))); if (mesVista >= mesDe(iso())) mesVista = null; repintar(); },
  'fin-guardar'() {
    const campo = document.getElementById('fin-monto'), monto = leerMonto(campo ? campo.value : form.monto);
    if (!monto) { toast('Escribe el monto'); if (campo) campo.focus(); return; }
    if (!form.categoria) { toast(form.tipo === 'ahorro' ? 'Elige la meta de ahorro' : 'Elige la categoría'); return; }
    const base = { tipo: form.tipo, monto, metodo: form.tipo === 'ingreso' ? 'transferencia' : form.metodo, nota: form.nota.trim(), fecha: form.fecha || iso() };
    nuevoMovimiento(form.tipo === 'ahorro' ? { ...base, meta: form.categoria } : { ...base, categoria: form.categoria });
    const nombre = form.tipo === 'ahorro' ? (f().metas.find((m) => m.id === form.categoria) || {}).nombre : cat(form.tipo, form.categoria).nombre;
    Object.assign(form, { monto: '', nota: '', fecha: null, categoria: null });
    guardar();
    toast('✓ ' + pesos(monto) + ' · ' + nombre);
  },
  'fin-borrar-mov'({ id }) {
    const i = f().movimientos.findIndex((m) => m.id === id);
    if (i < 0 || !confirm('¿Borrar este movimiento de ' + pesos(f().movimientos[i].monto) + '?')) return;
    f().movimientos.splice(i, 1);
    guardar();
  },
  'fin-pesos'({ ruta }, el) {
    const partes = ruta.split('.'), ultima = partes.pop(), obj = partes.reduce((o, k) => o[k], e());
    obj[ultima] = leerMonto(el.value);
    guardar();
  },
  'fin-pagar-fijo'({ id }) { pagarFijo(id); },
  'fin-pagar-deuda'({ id }) { pagarDeuda(id); },
  'fin-aportar'({ id }) { moverAhorro(id, 'ahorro'); },
  'fin-retirar'({ id }) { moverAhorro(id, 'retiro'); },
});
