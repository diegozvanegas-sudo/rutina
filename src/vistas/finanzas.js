// Finanzas: registrar y corregir gastos e ingresos (con método de pago), resumen del mes, patrimonio y cuentas, presupuesto 50/30/20,
// pagos e ingresos fijos, metas de ahorro (fondo de emergencia) y deudas (las tarjetas vinculadas suben con cada compra)
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta, fechaLarga, sumarDias } from '../fechas.js';
import {
  mesDe, sumarMeses, pesos, leerMonto, resumenMes, gastoPromedio, aportado, objetivoMeta, estadoFijo, estadoDeuda, planPago, planMeta,
  agregarMovimiento, quitarMovimiento, cambiarMovimiento, pagoDeuda, esCredito, tarjetaDe, saldoCuenta, patrimonio, anotarPatrimonio,
  deseosDelMes, fijosPorRevisar, DIAS_REVISION,
} from '../finanzas.js';
import { barrasAgrupadas, linea, tablaDatos } from '../graficos.js';
import { esc, barra, registrar, toast, subirBajar, miles } from '../ui.js';
import { vistaEsperas } from './vida.js';

let pestana = 'registrar', mesVista = null;
const form = { tipo: 'gasto', categoria: null, metodo: null, monto: '', nota: '', fecha: null, editando: null };
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

// Campo de dinero: acepta "25.000", "25000", "25k", "1,5M"
const campoPesos = (titulo, ruta, valor) =>
  '<label class="campo">' + titulo + '<input type="text" inputmode="numeric" data-cambio="fin-pesos" data-ruta="' + ruta + '" value="' + (valor ? Math.round(valor).toLocaleString('es-CO') : '') + '" placeholder="$ 0" autocomplete="off"></label>';
const campoTexto = (titulo, ruta, valor, extra = '') =>
  '<label class="campo">' + titulo + '<input type="text" data-cambio="ed" data-ruta="' + ruta + '" value="' + esc(valor ?? '') + '"' + extra + '></label>';
const campoNumero = (titulo, ruta, valor, paso = '1') =>
  '<label class="campo">' + titulo + '<input type="number" inputmode="decimal" min="0" step="' + paso + '" data-cambio="ed" data-tipo="num" data-ruta="' + ruta + '" value="' + esc(valor ?? '') + '"></label>';
const selector = (titulo, ruta, valor, opciones) =>
  '<label class="campo">' + titulo + '<select data-cambio="ed" data-ruta="' + ruta + '">' + opciones.map((o) => '<option value="' + esc(o.id) + '"' + (o.id === (valor || '') ? ' selected' : '') + '>' + esc((o.icono ? o.icono + ' ' : '') + o.nombre) + '</option>').join('') + '</select></label>';
const borrar = (lista, i, nombre) => '<span class="ed-controles">' + subirBajar(lista, i) + '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="' + lista + '" data-i="' + i + '" data-nombre="' + esc(nombre) + '" aria-label="Borrar">🗑</button></span>';

export function nuevoMovimiento(m) { agregarMovimiento(f(), m); }

// ---------- Registrar ----------
// Se pueden corregir gastos, ingresos y aportes; las cuotas de deudas y los retiros se borran y se registran de nuevo
const editable = (m) => ['gasto', 'ingreso', 'ahorro'].includes(m.tipo) && !m.deuda;
function filaMovimiento(m) {
  const c = m.tipo === 'ahorro' || m.tipo === 'retiro' ? { icono: '🐷', nombre: (f().metas.find((x) => x.id === m.meta) || {}).nombre || 'Ahorro' } : cat(m.tipo, m.categoria);
  const signo = m.tipo === 'ingreso' || m.tipo === 'retiro' ? '+' : '−';
  const detalle = [m.nota, metodo(m.metodo).nombre, m.tipo === 'pago-tarjeta' && m.interes ? 'intereses ' + pesos(m.interes) : ''].filter(Boolean).join(' · ');
  return '<li class="mov t-' + m.tipo + (editable(m) ? ' editable" data-accion="fin-editar-mov" data-id="' + m.id + '" title="Tocar para corregir' : '') + '"><span class="mov-ic">' + c.icono + '</span><span class="mov-txt"><b>' + esc(c.nombre) + '</b><small>' +
    esc(detalle) + '</small></span><span class="mov-monto">' + signo + ' ' + pesos(m.monto) + '</span>' +
    '<button type="button" class="icono borrar" data-accion="fin-borrar-mov" data-id="' + m.id + '" aria-label="Borrar movimiento">✕</button></li>';
}
function listaMovimientos(movs) {
  const porDia = {};
  for (const m of [...movs].sort((a, b) => b.fecha.localeCompare(a.fecha) || (b.id > a.id ? 1 : -1))) (porDia[m.fecha] ??= []).push(m);
  return Object.entries(porDia).map(([fecha, lista]) => '<h3 class="dia-mov">' + (fecha === iso() ? 'Hoy' : fecha === sumarDias(iso(), -1) ? 'Ayer' : fechaLarga(fecha)) + '</h3><ul class="movs">' + lista.map(filaMovimiento).join('') + '</ul>').join('')
    || '<p class="nota-corta">Todavía no hay movimientos este mes.</p>';
}

// Cuánto lleva la categoría elegida este mes contra su presupuesto
function pistaPresupuesto(r) {
  if (form.tipo !== 'gasto' || !form.categoria) return '';
  const c = cat('gasto', form.categoria), lleva = r.porCategoria[c.id] || 0, tope = c.presupuesto;
  if (!tope) return '<p class="nota-corta pista">' + c.icono + ' ' + esc(c.nombre) + ': llevas <b>' + pesos(lleva) + '</b> este mes.</p>';
  const quedan = tope - lleva;
  return '<div class="pista"><div class="fila-resumen nota-corta"><span>' + c.icono + ' ' + esc(c.nombre) + ': ' + pesos(lleva) + ' de ' + pesos(tope) + '</span><b class="' + (quedan < 0 ? 'rojo' : quedan < tope * 0.2 ? 'amarillo' : 'verde') + '">' +
    (quedan < 0 ? 'te pasaste ' + pesos(-quedan) : 'quedan ' + pesos(quedan)) + '</b></div>' + barra(lleva / tope, quedan < 0 ? 'excedido' : '') + '</div>';
}

function vistaRegistrar() {
  const tipos = { gasto: '💸 Gasto', ingreso: '💰 Ingreso', ahorro: '🐷 Ahorro' };
  const cats = form.tipo === 'ahorro' ? f().metas.map((m) => ({ id: m.id, nombre: m.nombre, icono: m.icono || '🐷' })) : f().categorias[form.tipo === 'ingreso' ? 'ingreso' : 'gasto'];
  if (!cats.some((c) => c.id === form.categoria)) form.categoria = null;
  // Lo que entra o pasa a ahorro sale de una cuenta, no de la tarjeta de crédito
  const metodos = form.tipo === 'gasto' ? f().metodos : cuentas();
  const ultimoMetodo = [...f().movimientos].reverse().find((m) => metodos.some((x) => x.id === m.metodo));
  if (!metodos.some((m) => m.id === form.metodo)) form.metodo = ultimoMetodo ? ultimoMetodo.metodo : (metodos[0] || {}).id;
  const r = resumenMes(f(), mesDe(iso()));
  // Ingresos fijos que ya deberían haber llegado: un toque para registrarlos
  const porLlegar = form.editando ? [] : f().fijos.filter((x) => x.tipo === 'ingreso' && ['pronto', 'vencido'].includes(estadoFijo(f(), x).estado));
  const tarjeta = form.tipo === 'gasto' && tarjetaDe(f(), form.metodo);
  return porLlegar.map((x) => '<button type="button" class="tarjeta avisos-hoy ancho" data-accion="fin-pagar-fijo" data-id="' + x.id + '"><b>' + cat('ingreso', x.categoria).icono + ' ¿Llegó ' + esc(x.nombre) + '?</b><span>Toca para registrar ' + pesos(x.monto) + '</span></button>').join('') +
    '<section class="tarjeta registrar' + (form.editando ? ' editando' : '') + '">' +
    (form.editando ? '<div class="fila-resumen"><h2>✏️ Corrigiendo movimiento</h2><button type="button" class="boton secundario" data-accion="fin-cancelar-edicion">Cancelar</button></div>' : '') +
    '<nav class="chips">' + Object.entries(tipos).map(([k, t]) =>
      '<button type="button" class="chip' + (k === form.tipo ? ' activo' : '') + '" data-accion="fin-tipo" data-tipo="' + k + '">' + t + '</button>').join('') + '</nav>' +
    '<input id="fin-monto" class="monto-grande" type="text" inputmode="numeric" data-cambio="fin-form" data-k="monto" value="' + esc(form.monto) + '" placeholder="$ 0" aria-label="Monto" autocomplete="off">' +
    '<div class="rejilla-cats">' + cats.map((c) => '<button type="button" class="cat' + (c.id === form.categoria ? ' activo' : '') + '" data-accion="fin-cat" data-id="' + esc(c.id) + '"><span>' + c.icono + '</span>' + esc(c.nombre) + '</button>').join('') + '</div>' +
    pistaPresupuesto(r) +
    '<div class="chips metodos">' + metodos.map((m) => '<button type="button" class="chip' + (m.id === form.metodo ? ' activo' : '') + '" data-accion="fin-metodo" data-id="' + m.id + '">' + m.icono + ' ' + esc(m.nombre) + '</button>').join('') + '</div>' +
    (tarjeta ? '<p class="nota-corta">💳 Suma al saldo de <b>' + esc(tarjeta.nombre) + '</b> (' + pesos(Math.max(0, tarjeta.saldo)) + ' hoy).</p>' : '') +
    '<div class="dos"><label class="campo">Nota<input type="text" data-cambio="fin-form" data-k="nota" value="' + esc(form.nota) + '" placeholder="Opcional"></label>' +
    '<label class="campo">Fecha<input type="date" data-cambio="fin-form" data-k="fecha" value="' + (form.fecha || iso()) + '" max="' + iso() + '"></label></div>' +
    '<button type="button" class="boton primario grande ancho" data-accion="fin-guardar">' + (form.editando ? 'Guardar cambios' : 'Guardar ' + tipos[form.tipo].split(' ')[1].toLowerCase()) + '</button></section>' +
    '<section class="tarjeta"><div class="fila-resumen"><h2>' + nombreMes(mesDe(iso())) + '</h2><span>Gastado <b>' + pesos(r.gastos) + '</b></span></div>' +
    '<p class="nota-corta">Toca un movimiento para corregirlo.</p>' + listaMovimientos(r.movs) + '</section>';
}

// ---------- Mes ----------
function vistaMes() {
  const mes = mesVista || mesDe(iso()), r = resumenMes(f(), mes), ing = r.ingresos;
  const antes = resumenMes(f(), mesDe(sumarMeses(mes + '-01', -1)));
  // La regla 50/30/20 se mide contra lo que entra en el mes, contando el ingreso fijo que aún no llega
  const base = Math.max(ing, r.ingresoEsperado || 0), esperado = base > ing;
  const cats = f().categorias.gasto.filter((c) => r.porCategoria[c.id] || c.presupuesto).sort((a, b) => (r.porCategoria[b.id] || 0) - (r.porCategoria[a.id] || 0));
  const reglas = [['necesidad', 'Necesidades', r.porGrupo.necesidad, 0.5, 'máx.'], ['deseo', 'Deseos', r.porGrupo.deseo, 0.3, 'máx.'], ['ahorro', 'Ahorro', Math.max(0, base - r.gastos), 0.2, 'mín.']];
  // Comparación con el mes anterior (solo si ese mes tuvo gasto en la categoría)
  const vs = (id, v) => {
    const a = antes.porCategoria[id];
    if (!a) return '';
    const d = Math.round(((v - a) / a) * 100);
    return d ? ' <small class="' + (d > 0 ? 'rojo' : 'verde') + '">' + (d > 0 ? '↑ ' : '↓ ') + Math.abs(d) + ' %</small>' : '';
  };
  return '<div class="cab-vista"><button type="button" class="icono" data-accion="fin-mes" data-n="-1" aria-label="Mes anterior">‹</button><h2>' + nombreMes(mes) + '</h2>' +
    '<button type="button" class="icono" data-accion="fin-mes" data-n="1" aria-label="Mes siguiente"' + (mes >= mesDe(iso()) ? ' disabled' : '') + '>›</button></div>' +
    '<section class="tarjeta"><div class="datos-peso">' +
    '<div><small>Ingresos</small><b class="verde">' + pesos(ing) + '</b>' + (esperado ? '<small>+ ' + pesos(base - ing) + ' por llegar</small>' : '') + '</div><div><small>Gastos</small><b class="rojo">' + pesos(r.gastos) + '</b></div>' +
    '<div><small>A ahorro</small><b class="azul">' + pesos(r.ahorro) + '</b></div><div><small>Disponible</small><b>' + pesos(r.balance) + '</b></div></div>' +
    '<div class="fila-resumen"><span>Tasa de ahorro</span><b class="' + (r.tasaAhorro >= 0.2 ? 'verde' : r.tasaAhorro > 0 ? 'amarillo' : 'rojo') + '">' + pct(r.tasaAhorro) + '</b></div>' +
    (r.proyeccion ? '<p class="nota-corta">A este ritmo terminarías el mes gastando <b>' + pesos(r.proyeccion) + '</b>' + (base ? ' (' + pct(r.proyeccion / base) + ' de lo que entra)' : '') +
      (r.pendientes ? '. Faltan ' + pesos(r.pendientes) + ' de pagos fijos y cuotas' : '') + '.</p>' : '') +
    (r.pagosTarjeta ? '<p class="nota-corta">💳 Abonaste ' + pesos(r.pagosTarjeta) + ' a tarjetas: no cuenta como gasto porque las compras ya se contaron.</p>' : '') + '</section>' +
    (base ? '<section class="tarjeta"><h2>Regla 50 / 30 / 20</h2>' + (esperado ? '<p class="nota-corta">Cuenta el ingreso fijo que aún no llega.</p>' : '') + reglas.map(([k, t, v, obj, tope]) => {
      const p = v / base, mal = k === 'ahorro' ? p < obj : p > obj;
      return '<div class="fila-resumen"><span>' + t + ' <small>(' + tope + ' ' + obj * 100 + ' %)</small></span><span><b class="' + (mal ? 'rojo' : 'verde') + '">' + pct(p) + '</b> · ' + pesos(v) + '</span></div>' + barra(p / obj, mal ? 'excedido' : '');
    }).join('') + '</section>' : '<p class="aviso">Registra tus ingresos del mes (o tu salario en 🔁 Fijos) para ver la regla 50/30/20 y la tasa de ahorro.</p>') +
    '<section class="tarjeta"><h2>Por categoría</h2>' + (cats.length ? '<p class="nota-corta">Las flechas comparan con ' + nombreMes(mesDe(sumarMeses(mes + '-01', -1))) + '.</p>' + cats.map((c) => {
      const v = r.porCategoria[c.id] || 0, tope = c.presupuesto, pasado = tope && v > tope;
      return '<div class="fila-resumen"><span>' + c.icono + ' ' + esc(c.nombre) + vs(c.id, v) + '</span><span><b class="' + (pasado ? 'rojo' : '') + '">' + pesos(v) + '</b>' + (tope ? ' / ' + pesos(tope) : '') + '</span></div>' +
        barra(tope ? v / tope : r.gastos ? v / r.gastos : 0, pasado ? 'excedido' : '');
    }).join('') : '<p class="nota-corta">Sin gastos este mes.</p>') + '</section>' +
    (Object.keys(r.porMetodo).length ? '<section class="tarjeta"><h2>Por método de pago</h2>' + Object.entries(r.porMetodo).sort((a, b) => b[1] - a[1]).map(([id, v]) =>
      '<div class="fila-resumen"><span>' + metodo(id).icono + ' ' + esc(metodo(id).nombre) + '</span><b>' + pesos(v) + '</b></div>').join('') +
      (r.porMetodo.credito ? '<p class="nota-corta">💳 Con tarjeta de crédito: ' + pesos(r.porMetodo.credito) + '. Págala completa antes de la fecha límite para no pagar intereses.</p>' : '') + '</section>' : '') +
    '<section class="tarjeta"><h2>Movimientos</h2>' + listaMovimientos(r.movs) + '</section>';
}

// ---------- Resumen: patrimonio, cuentas y los últimos 6 meses ----------
function vistaResumen() {
  const p = patrimonio(f()), hoy = iso(), historial = f().historial || {};
  const meses = Array.from({ length: 6 }, (_, i) => mesDe(sumarMeses(hoy.slice(0, 8) + '01', i - 5)));
  // Neto de cada mes: la foto guardada (la del mes en curso, en vivo)
  const puntos = meses.map((m) => {
    const h = m === mesDe(hoy) ? p : historial[m];
    const v = h ? h.ahorro + h.cuentas - h.deudas : null;
    return { etiqueta: corto(m), v, tip: corto(m) + ': ' + (v == null ? 'sin datos' : pesos(v)) };
  });
  const res = meses.map((m) => [m, resumenMes(f(), m)]);
  const hayMeses = res.some(([, r]) => r.ingresos || r.gastos);
  return '<section class="tarjeta"><div class="fila-resumen"><h2>Patrimonio neto</h2><b class="' + (p.neto >= 0 ? 'verde' : 'rojo') + '">' + pesos(p.neto) + '</b></div>' +
    '<p class="nota-corta">Lo que tienes (ahorros y cuentas) menos lo que debes. Que suba mes a mes es la señal de que vas bien.</p>' +
    '<div class="datos-peso"><div><small>Ahorrado</small><b class="azul">' + pesos(p.ahorro) + '</b></div><div><small>En cuentas</small><b>' + pesos(p.cuentas) + '</b></div>' +
    '<div><small>Deudas</small><b class="rojo">' + pesos(p.deudas) + '</b></div></div>' +
    (puntos.filter((x) => x.v != null).length > 1 ? linea(puntos, { formato: millones, margenEje: Math.max(1, Math.abs(p.neto) * 0.05) }) : '<p class="nota-corta">El gráfico aparece desde el segundo mes.</p>') + '</section>' +
    '<section class="tarjeta"><h2>Cuentas</h2><p class="nota-corta">Anota cuánto hay hoy en cada una (míralo en el banco o la billetera). Desde ahí la app suma y resta lo que registres con ese método. Si no cuadra, vuelve a ajustar.</p>' +
    cuentas().map((m) => {
      const s = saldoCuenta(f(), m);
      return '<div class="cuenta"><div class="fila-resumen"><span>' + m.icono + ' ' + esc(m.nombre) + (m.ajuste ? ' <small>ajustada el ' + fechaCorta(m.ajuste.fecha) + '</small>' : '') + '</span><b class="' + (s < 0 ? 'rojo' : '') + '">' + (s == null ? '—' : pesos(s)) + '</b></div>' +
        '<div class="aportar"><input type="text" inputmode="numeric" placeholder="Saldo real hoy" aria-label="Saldo de ' + esc(m.nombre) + '" data-saldo="' + m.id + '">' +
        '<button type="button" class="boton secundario" data-accion="fin-ajustar" data-id="' + m.id + '">Ajustar</button></div></div>';
    }).join('') + '</section>' +
    (hayMeses ? '<section class="tarjeta"><h2>Últimos 6 meses</h2><div class="leyenda"><span><i class="serie-1"></i>Ingresos</span><span><i class="serie-2"></i>Gastos</span><span><i class="serie-3"></i>Ahorro</span></div>' +
      barrasAgrupadas(res.map(([m, r]) => ({ etiqueta: corto(m), valores: [r.ingresos, r.gastos, Math.max(0, r.ahorro)],
        tips: [corto(m) + ': ingresos ' + pesos(r.ingresos), corto(m) + ': gastos ' + pesos(r.gastos), corto(m) + ': ahorro ' + pesos(r.ahorro)] })),
      [{ nombre: 'Ingresos', clase: 'serie-1' }, { nombre: 'Gastos', clase: 'serie-2' }, { nombre: 'Ahorro', clase: 'serie-3' }], { formato: millones }) +
      tablaDatos(['Mes', 'Ingresos', 'Gastos', 'Ahorro', 'Tasa de ahorro'], res.map(([m, r]) => [nombreMes(m), pesos(r.ingresos), pesos(r.gastos), pesos(r.ahorro), pct(r.tasaAhorro)])) + '</section>' : '');
}

// ---------- Presupuesto ----------
function vistaPresupuesto() {
  const lista = f().categorias.gasto, hoy = iso();
  const ingresos = [1, 2, 3].map((i) => resumenMes(f(), mesDe(sumarMeses(hoy.slice(0, 8) + '01', -i))).ingresos).filter(Boolean);
  const ingreso = ingresos.length ? ingresos.reduce((a, b) => a + b, 0) / ingresos.length : resumenMes(f(), mesDe(hoy)).ingresoEsperado;
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

// ---------- Fijos: ingresos y pagos de cada mes ----------
const ESTADOS = { pagado: '✓ Pagado', pronto: 'Pronto', vencido: 'Vencido', pendiente: 'Pendiente' };
const ESTADOS_INGRESO = { pagado: '✓ Recibido', pronto: 'Pronto', vencido: 'No ha llegado', pendiente: 'Pendiente' };
function tarjetaFijo(x, i) {
  const s = estadoFijo(f(), x), r = 'finanzas.fijos.' + i, ingreso = x.tipo === 'ingreso';
  return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + cat(ingreso ? 'ingreso' : 'gasto', x.categoria).icono + ' ' + esc(x.nombre) + '</b><span class="estado e-' + s.estado + '">' + (ingreso ? ESTADOS_INGRESO : ESTADOS)[s.estado] + '</span></div>' +
    '<div class="fila-resumen nota-corta"><span>Día ' + x.dia + ' de cada mes · ' + fechaCorta(s.fecha) + '</span><b class="' + (ingreso ? 'verde' : '') + '">' + pesos(x.monto) + '</b></div>' +
    (s.estado === 'pagado' ? '' : '<button type="button" class="boton primario ancho" data-accion="fin-pagar-fijo" data-id="' + x.id + '">' + (ingreso ? 'Registrar ingreso de ' : 'Registrar pago de ') + pesos(x.monto) + '</button>') +
    '<details><summary>Editar</summary><div class="dos">' + campoTexto('Nombre', r + '.nombre', x.nombre) + campoPesos('Monto', r + '.monto', x.monto) +
    campoNumero('Día ' + (ingreso ? 'en que llega' : 'de pago'), r + '.dia', x.dia) + selector('Categoría', r + '.categoria', x.categoria, f().categorias[ingreso ? 'ingreso' : 'gasto']) +
    selector(ingreso ? 'Llega a' : 'Método', r + '.metodo', x.metodo, ingreso ? cuentas() : f().metodos) + '</div>' + borrar('finanzas.fijos', i, x.nombre) + '</details></section>';
}
function vistaFijos() {
  const todos = f().fijos.map((x, i) => [x, i]), ingresos = todos.filter(([x]) => x.tipo === 'ingreso'), pagos = todos.filter(([x]) => x.tipo !== 'ingreso');
  const total = (l) => l.reduce((s, [x]) => s + (x.monto || 0), 0);
  // Suscripciones y demás deseos fijos: cuánto suman al año y cuáles toca revisar
  const grupo = Object.fromEntries(f().categorias.gasto.map((c) => [c.id, c.grupo]));
  const deseos = pagos.filter(([x]) => grupo[x.categoria] === 'deseo'), revisar = fijosPorRevisar(f());
  return '<section class="tarjeta"><div class="fila-resumen"><h2>Ingresos de cada mes</h2><b class="verde">' + pesos(total(ingresos)) + '</b></div>' +
    '<p class="nota-corta">Salario, arriendos que cobras… Cuentan para la regla 50/30/20 desde el día 1, y cuando llega el día te pregunta si ya llegó.</p></section>' +
    ingresos.map(([x, i]) => tarjetaFijo(x, i)).join('') +
    '<button type="button" class="boton secundario grande ancho" data-accion="fin-agregar-ingreso-fijo">＋ Ingreso fijo</button>' +
    '<section class="tarjeta"><div class="fila-resumen"><h2>Pagos de cada mes</h2><b>' + pesos(total(pagos)) + '</b></div>' +
    '<p class="nota-corta">Arriendo, servicios, celular, suscripciones, cuotas… Aparecen solos en 🔔 Recordatorios cuando se acerca el día.</p></section>' +
    (deseos.length ? '<section class="tarjeta"><div class="fila-resumen"><h2>🔍 Deseos fijos</h2><b>' + pesos(total(deseos) * 12) + ' al año</b></div>' +
      (revisar.length ? '<p class="nota-corta">Cada ' + DIAS_REVISION + ' días pregúntate si los sigues usando. Lo que cancelas cuenta como ahorro en ⏳ 72 h.</p>' + revisar.map((x) =>
        '<div class="revisar"><div class="fila-resumen"><span>' + cat('gasto', x.categoria).icono + ' ' + esc(x.nombre) + '</span><span>' + pesos(x.monto) + ' <small>· ' + pesos(x.monto * 12) + '/año</small></span></div>' +
        '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="fin-cancelar-fijo" data-id="' + x.id + '">✕ La cancelo</button>' +
        '<button type="button" class="boton primario" data-accion="fin-revisar-fijo" data-id="' + x.id + '">✓ La sigo usando</button></div></div>').join('')
        : '<p class="nota-corta">✓ Todos revisados. Te vuelve a preguntar en ' + DIAS_REVISION + ' días.</p>') + '</section>' : '') +
    pagos.map(([x, i]) => tarjetaFijo(x, i)).join('') +
    '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="finanzas.fijos">＋ Pago fijo</button>';
}

// ---------- Ahorro ----------
function vistaAhorro() {
  const prom = gastoPromedio(f());
  return f().metas.map((m, i) => {
    const r = 'finanzas.metas.' + i, obj = objetivoMeta(f(), m), lleva = aportado(f(), m.id), plan = obj ? planMeta(f(), m) : null;
    return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + (m.icono || '🐷') + ' ' + esc(m.nombre) + '</b>' + (m.id === 'emergencia' ? '' : borrar('finanzas.metas', i, m.nombre)) + '</div>' +
      '<div class="fila-resumen"><span><b>' + pesos(lleva) + '</b> de ' + (obj ? pesos(obj) : '—') + '</span><b>' + (obj ? pct(lleva / obj) : '') + '</b></div>' + barra(obj ? lleva / obj : 0) +
      (plan ? (plan.falta ? '<p class="' + (plan.vencida ? 'aviso' : 'nota-corta') + '">' + (plan.vencida ? 'La fecha (' + fechaCorta(m.fecha) + ') ya pasó y faltan ' + pesos(plan.falta) + '. Pon una fecha nueva.'
        : 'Para el ' + fechaCorta(m.fecha) + ' te faltan ' + pesos(plan.falta) + ': aparta <b>' + pesos(plan.porMes) + ' al mes</b>' + (plan.meses > 1 ? ' durante ' + plan.meses + ' meses' : '') + '.') + '</p>'
        : '<p class="nota-corta verde">🎉 ¡Meta cumplida!</p>') : '') +
      (m.id === 'emergencia' ? '<p class="nota-corta">Para imprevistos (salud, moto, quedarte sin ingreso). La meta es ' + (m.meses || 6) + ' meses de gastos' +
        (prom ? ' (gastas en promedio ' + pesos(prom) + ' al mes)' : '; registra tus gastos y se calcula sola') + '. Guárdalo aparte, en una cuenta que puedas sacar rápido.</p>' : '') +
      '<div class="aportar"><input type="text" inputmode="numeric" placeholder="$ 0" aria-label="Monto" data-aporte="' + m.id + '">' +
      '<button type="button" class="boton primario" data-accion="fin-aportar" data-id="' + m.id + '">＋ Aportar</button>' +
      '<button type="button" class="boton secundario" data-accion="fin-retirar" data-id="' + m.id + '">Sacar</button></div>' +
      '<details><summary>Editar meta</summary><div class="dos">' + campoTexto('Nombre', r + '.nombre', m.nombre) + campoTexto('Ícono', r + '.icono', m.icono, ' maxlength="4"') +
      (m.id === 'emergencia' ? campoNumero('Meses de gastos', r + '.meses', m.meses || 6) : '') + campoPesos(m.id === 'emergencia' ? 'Meta fija (opcional)' : 'Meta', r + '.objetivo', m.objetivo) +
      '<label class="campo">Para cuándo (opcional)<input type="date" data-cambio="ed" data-ruta="' + r + '.fecha" value="' + esc(m.fecha || '') + '" min="' + iso() + '"></label></div></details></section>';
  }).join('') + '<button type="button" class="boton secundario grande ancho" data-accion="ed-agregar" data-lista="finanzas.metas">＋ Meta de ahorro</button>';
}

// ---------- Deudas ----------
const plazo = (meses) => (meses === Infinity ? '⚠ nunca' : meses ? meses + (meses === 1 ? ' mes' : ' meses') : '¡Pagada!');
function simulador(d, actual) {
  const extra = simula[d.id] || 0, otro = extra ? planPago(d.saldo, d.tasa, (d.cuota || 0) + extra) : null;
  return '<div class="simulador"><label class="campo">¿Y si pagas más cada mes?<input type="text" inputmode="numeric" placeholder="$ extra al mes" data-cambio="fin-simular" data-id="' + d.id + '" value="' + (extra ? miles(extra) : '') + '"></label>' +
    (otro ? (otro.meses === Infinity ? '<p class="nota-corta">Aun así no alcanza para el interés.</p>'
      : '<p class="nota-corta">Con ' + pesos(extra) + ' más (' + pesos((d.cuota || 0) + extra) + ' al mes) terminas en <b>' + plazo(otro.meses) + '</b>' +
        (actual.meses !== Infinity ? ', <b>' + (actual.meses - otro.meses) + ' meses antes</b>, y te ahorras <b class="verde">' + pesos(actual.intereses - otro.intereses) + '</b> en intereses' : '') + '.</p>') : '') + '</div>';
}
function vistaDeudas() {
  const lista = f().deudas, total = lista.reduce((s, d) => s + Math.max(0, d.saldo || 0), 0);
  const orden = [...lista].filter((d) => d.saldo > 0).sort((a, b) => (b.tasa || 0) - (a.tasa || 0));
  // Compras con crédito sin tarjeta vinculada: el saldo no sube solo y la cuota se contaría como gasto otra vez
  const sinVincular = f().metodos.filter((m) => esCredito(f(), m.id) && !tarjetaDe(f(), m.id) && f().movimientos.some((x) => x.metodo === m.id));
  return '<section class="tarjeta"><div class="fila-resumen"><h2>Lo que debes</h2><b class="' + (total ? 'rojo' : 'verde') + '">' + pesos(total) + '</b></div>' +
    (orden.length > 1 ? '<p class="nota-corta">Estrategia avalancha: paga el mínimo en todas y lo que sobre a la de mayor interés: <b>' + esc(orden[0].nombre) + '</b> (' + orden[0].tasa + ' % mensual).</p>' : '') +
    (sinVincular.length ? '<p class="aviso">Tienes compras con ' + sinVincular.map((m) => esc(m.nombre)).join(', ') + '. Agrega la tarjeta aquí y en "Compras con" elige ese método: cada compra subirá su saldo y al pagarla solo contarán los intereses.</p>' : '') + '</section>' +
    lista.map((d, i) => {
      const r = 'finanzas.deudas.' + i, s = d.dia ? estadoDeuda(f(), d) : null, saldo = d.saldo || 0;
      const actual = planPago(saldo, d.tasa, d.cuota), interes = Math.max(0, saldo) * ((d.tasa || 0) / 100);
      return '<section class="tarjeta ed-item"><div class="ed-cab"><b>💳 ' + esc(d.nombre) + '</b>' + (s && saldo > 0 ? '<span class="estado e-' + s.estado + '">' + ESTADOS[s.estado] + '</span>' : '') + '</div>' +
        (d.metodo ? '<p class="nota-corta">Suben su saldo las compras con ' + metodo(d.metodo).icono + ' ' + esc(metodo(d.metodo).nombre) + '.</p>' : '') +
        '<div class="datos-peso"><div><small>Saldo</small><b>' + (saldo < 0 ? pesos(-saldo) + ' a favor' : pesos(saldo)) + '</b></div><div><small>Cuota</small><b>' + pesos(d.cuota) + '</b></div>' +
        '<div><small>Interés del mes</small><b>' + pesos(interes) + '</b></div><div><small>Terminas en</small><b>' + (saldo > 0 && !d.cuota ? '—' : plazo(actual.meses)) + '</b>' +
        (actual.intereses && actual.intereses !== Infinity ? '<small>pagando ' + pesos(actual.intereses) + ' de intereses</small>' : '') + '</div></div>' +
        (actual.meses === Infinity && saldo > 0 && d.cuota ? '<p class="aviso">La cuota no alcanza ni para el interés: sube la cuota o refinancia.</p>' : '') +
        (saldo > 0 && d.cuota && actual.meses !== Infinity ? simulador(d, actual) : '') +
        (saldo > 0 ? '<div class="aportar dos-col"><input type="text" inputmode="numeric" placeholder="' + (d.cuota ? miles(d.cuota) : '$ 0') + '" aria-label="Monto a pagar" data-pago="' + d.id + '">' +
          '<button type="button" class="boton primario" data-accion="fin-pagar-deuda" data-id="' + d.id + '">Pagar</button></div>' +
          '<p class="nota-corta">Vacío = la cuota de ' + pesos(d.cuota) + '. Primero paga el interés del mes; lo demás baja el saldo.</p>' : '') +
        '<details><summary>Editar</summary><div class="dos">' + campoTexto('Nombre', r + '.nombre', d.nombre) + campoPesos('Saldo', r + '.saldo', d.saldo) +
        campoPesos('Cuota', r + '.cuota', d.cuota) + campoNumero('Interés % mensual', r + '.tasa', d.tasa, '0.01') + campoNumero('Día de pago', r + '.dia', d.dia) +
        selector('Compras con', r + '.metodo', d.metodo, [{ id: '', nombre: 'Ninguno (es un préstamo)' }, ...f().metodos.filter((m) => !tarjetaDe(f(), m.id) || m.id === d.metodo)]) + '</div>' +
        borrar('finanzas.deudas', i, d.nombre) + '</details></section>';
    }).join('') + '<button type="button" class="boton secundario grande ancho" data-accion="ed-agregar" data-lista="finanzas.deudas">＋ Deuda o tarjeta</button>';
}

export function vistaFinanzas() {
  const tabs = { registrar: '➕ Registrar', mes: '📊 Mes', resumen: '📈 Resumen', presupuesto: '🎯 Presupuesto', fijos: '🔁 Fijos', ahorro: '🐷 Ahorro', deudas: '💳 Deudas', esperas: '⏳ 72 h' };
  return '<h1>Finanzas</h1><nav class="chips pestanas">' + Object.entries(tabs).map(([k, t]) =>
    '<button type="button" class="chip' + (k === pestana ? ' activo' : '') + '" data-accion="fin-pestana" data-p="' + k + '">' + t + '</button>').join('') + '</nav>' +
    ({ mes: vistaMes, resumen: vistaResumen, presupuesto: vistaPresupuesto, fijos: vistaFijos, ahorro: vistaAhorro, deudas: vistaDeudas, esperas: vistaEsperas }[pestana] || vistaRegistrar)();
}

// ---------- Hoy: lo que queda para deseos ----------
export function tarjetaPlataHoy() {
  if (!e().finanzas) return '';
  const d = deseosDelMes(f());
  return '<section class="tarjeta col-plata"><div class="fila-resumen"><h2>💰 Plata del mes</h2><a href="#finanzas/registrar" class="nota-corta">＋ Gasto</a></div>' +
    (d ? (d.quedan >= 0 ? '<p>Te quedan <b class="verde">' + pesos(d.quedan) + '</b> para deseos este mes: unos <b>' + pesos(d.porDia) + ' por día</b> (' + d.dias + (d.dias === 1 ? ' día' : ' días') + ').</p>'
      : '<p>Te pasaste <b class="rojo">' + pesos(-d.quedan) + '</b> en deseos este mes. Lo que queda, solo necesidades.</p>') +
      barra(d.gastado / d.tope, d.quedan < 0 ? 'excedido' : '') + '<p class="nota-corta">' + pesos(d.gastado) + ' de ' + pesos(d.tope) + (d.presupuestado ? ' presupuestados' : ' (30 % de lo que entra)') + '</p>'
      : '<p class="nota-corta"><a href="#finanzas/fijos">Agrega tu salario</a> o registra un ingreso y aquí verás cuánto te queda para deseos.</p>') + '</section>';
}

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

function moverAhorro(id, tipo) {
  const campo = document.querySelector('[data-aporte="' + id + '"]'), monto = leerMonto(campo && campo.value);
  if (!monto) { toast('Escribe el monto'); if (campo) campo.focus(); return; }
  if (tipo === 'retiro' && monto > aportado(f(), id)) { toast('No hay tanto ahorrado en esa meta'); return; }
  nuevoMovimiento({ tipo, monto, meta: id, metodo: 'transferencia', nota: tipo === 'retiro' ? 'Retiro' : '' });
  campo.value = '';
  listo();
  toast((tipo === 'retiro' ? 'Sacaste ' : '🐷 Ahorraste ') + pesos(monto));
}

const limpiar = () => Object.assign(form, { monto: '', nota: '', fecha: null, categoria: null, editando: null });

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
    const base = { tipo: form.tipo, monto, metodo: form.metodo, nota: form.nota.trim(), fecha: form.fecha || iso() };
    const datos = form.tipo === 'ahorro' ? { ...base, meta: form.categoria, categoria: undefined } : { ...base, categoria: form.categoria, meta: undefined };
    const nombre = form.tipo === 'ahorro' ? (f().metas.find((m) => m.id === form.categoria) || {}).nombre : cat(form.tipo, form.categoria).nombre;
    const editando = form.editando;
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
    Object.assign(form, { tipo: m.tipo, categoria: m.tipo === 'ahorro' ? m.meta : m.categoria, metodo: m.metodo, monto: miles(m.monto), nota: m.nota || '', fecha: m.fecha, editando: id });
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
