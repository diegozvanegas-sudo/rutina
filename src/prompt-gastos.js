// 🤖 Analizar gastos: arma el prompt completo para la IA con los datos de Finanzas de un mes (lo gastado por categoría contra el
// tope del 🎯 Presupuesto, la regla 50/30/20, los fijos, las deudas, las metas y los movimientos uno por uno) más las
// instrucciones, que se pueden editar desde la pestaña (fin.analisis.instrucciones; vacío = las de siempre). Sin nombre ni correo.
import { iso } from './fechas.js';
import { mesDe, sumarMeses, pesos, resumenMes, gastoDe, abonoDe, estadoFijo, estadoDeuda, mesesParaPagar, valorMeta, objetivoMeta, subDe } from './finanzas.js';

export const INSTRUCCIONES_GASTOS = `Eres mi asesor financiero personal, directo y sin rodeos. Vivo en Colombia; los montos están en pesos colombianos (COP).

Con los datos de abajo haz esto, en orden:
1. Resumen: cuánto entró, cuánto gasté, qué % del ingreso se fue y cuánto me queda libre hasta el próximo pago.
2. Plan vs. real por categoría: tope, gastado, diferencia y %. Marca con 🔴 lo que se pasó y con 🟢 lo que va bien.
3. Fugas: gastos pequeños que se repiten (domicilios, comida fuera, apps, "otros"): cuánto suman en el mes y cuánto serían en un año.
4. Deudas: qué parte de mi ingreso se va en cuotas e intereses, y qué deuda pagar primero (avalancha o bola de nieve) con números.
5. Patrones: días de la semana o momentos en que más gasto, gastos impulsivos o emocionales, y lo que no cuadra con mis metas.
6. Lo que falta: datos que no te pasé y necesitas para un análisis mejor (pregúntamelos).
7. Plan de acción: 5 cambios concretos ordenados por cuánta plata liberan, con el monto al mes de cada uno, y un tope nuevo por categoría para el próximo mes.

Reglas: no me felicites ni suavices; si algo está mal, dilo claro. Haz las cuentas exactas con estos datos y no inventes ninguno: si falta algo, dilo.`;

const NOMBRE_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const nombreMesLargo = (mes) => NOMBRE_MES[Number(mes.slice(5, 7)) - 1] + ' ' + mes.slice(0, 4);
const SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const diaSemana = (fecha) => { const [a, m, d] = fecha.split('-').map(Number); return SEMANA[new Date(a, m - 1, d).getDay()]; };
const pct = (x) => Math.round(x * 100) + ' %';
const TIPO = { gasto: 'gasto', ingreso: 'ingreso', ahorro: 'ahorro', retiro: 'retiro de ahorro', transferencia: 'transferencia', 'pago-tarjeta': 'pago de tarjeta', cobro: 'me pagaron' };

export const instruccionesGastos = (fin) => (fin.analisis && fin.analisis.instrucciones && fin.analisis.instrucciones.trim()) || INSTRUCCIONES_GASTOS;

// Lo que se puede elegir en la pestaña: el mes, si van los movimientos uno por uno y sus notas
export function opcionesGastos(fin) {
  const a = fin.analisis || {};
  return { detalle: a.detalle !== false, notas: a.notas !== false, metas: a.metas || '' };
}

// Promedio por categoría de los meses completos anteriores con datos (hasta 3), para comparar
function promedioAnterior(fin, mes) {
  const suma = {}, usados = [];
  for (let i = 1; i <= 6 && usados.length < 3; i++) {
    const m = mesDe(sumarMeses(mes + '-01', -i)), r = resumenMes(fin, m);
    if (!r.gastos) continue;
    usados.push(m);
    for (const [c, v] of Object.entries(r.porCategoria)) suma[c] = (suma[c] || 0) + v;
  }
  return { meses: usados.length, porCategoria: Object.fromEntries(Object.entries(suma).map(([c, v]) => [c, v / (usados.length || 1)])) };
}

/** El prompt completo (instrucciones + datos). Devuelve { texto, movimientos, sinDatos } */
export function promptGastos(fin, mes = mesDe(iso()), hoy = iso(), opciones = opcionesGastos(fin)) {
  const r = resumenMes(fin, mes, hoy), actual = mes === mesDe(hoy);
  const cats = fin.categorias.gasto, catDe = (id) => cats.find((c) => c.id === id) || fin.categorias.ingreso.find((c) => c.id === id) || { nombre: id || 'Sin categoría', icono: '' };
  const metodo = (id) => (fin.metodos.find((m) => m.id === id) || { nombre: id || '' }).nombre;
  const L = [];
  L.push(instruccionesGastos(fin), '', '---', '', '# Mis datos de ' + nombreMesLargo(mes) + (actual ? ' (va hasta el ' + Number(hoy.slice(8, 10)) + ', el mes no ha terminado)' : ''));
  if (opciones.metas && opciones.metas.trim()) L.push('', '## Mis metas con la plata', opciones.metas.trim());

  L.push('', '## Resumen del mes');
  L.push('- Ingresos: ' + pesos(r.ingresos) + (actual && r.ingresoEsperado > r.ingresos ? ' (con los ingresos fijos que faltan: ' + pesos(r.ingresoEsperado) + ')' : ''));
  L.push('- Gastos: ' + pesos(r.gastos) + (r.ingresos ? ' (' + pct(r.gastos / r.ingresos) + ' de lo que entró)' : ''));
  if (r.abonoDeudas) L.push('- Abonos a capital de deudas: ' + pesos(r.abonoDeudas));
  if (r.pagosTarjeta) L.push('- Pagos a tarjetas de crédito: ' + pesos(r.pagosTarjeta));
  if (r.ahorro) L.push('- Pasado a ahorro: ' + pesos(r.ahorro));
  L.push('- Balance (ingresos − gastos − ahorro − abonos): ' + pesos(r.balance));
  if (actual && r.proyeccion) L.push('- Gasto proyectado al cierre del mes a este ritmo: ' + pesos(r.proyeccion));
  if (actual && r.pendientes) L.push('- Pagos fijos y cuotas que faltan este mes: ' + pesos(r.pendientes));
  const base = r.ingresoEsperado || r.ingresos;
  if (base) L.push('- Regla 50/30/20: necesidades ' + pct(r.porGrupo.necesidad / base) + ' (tope 50 %), deseos ' + pct(r.porGrupo.deseo / base) + ' (tope 30 %)');

  // Plan vs. real: todas las categorías con tope o con gasto
  const ant = promedioAnterior(fin, mes);
  const filas = cats.filter((c) => (c.presupuesto || 0) > 0 || r.porCategoria[c.id]);
  if (filas.length) {
    L.push('', '## Plan (🎯 Presupuesto) vs. real por categoría', 'Categoría | Tipo | Tope | Gastado | Diferencia | % del tope' + (ant.meses ? ' | Promedio de los ' + ant.meses + ' meses anteriores' : ''));
    for (const c of filas.sort((a, b) => (r.porCategoria[b.id] || 0) - (r.porCategoria[a.id] || 0))) {
      const g = r.porCategoria[c.id] || 0, tope = c.presupuesto || 0;
      const subs = Object.entries((r.porSub || {})[c.id] || {}).sort((a, b) => b[1] - a[1]).map(([s, v]) => (subDe(fin, c.id, s) || { nombre: s }).nombre + ' ' + pesos(v));
      L.push([c.icono + ' ' + c.nombre + (subs.length ? ' (' + subs.join(', ') + ')' : ''), c.grupo === 'necesidad' ? 'necesidad' : 'deseo', tope ? pesos(tope) : 'sin tope',
        pesos(g), tope ? (g > tope ? '+' : '−') + pesos(Math.abs(g - tope)).replace('$ ', '$') : '—', tope ? pct(g / tope) : '—', ...(ant.meses ? [pesos(ant.porCategoria[c.id] || 0)] : [])].join(' | '));
    }
  } else L.push('', '## Plan (🎯 Presupuesto)', 'No tengo topes por categoría todavía.');

  const fijos = fin.fijos || [];
  if (fijos.length) {
    L.push('', '## Ingresos y pagos fijos de cada mes');
    for (const f of fijos) L.push('- ' + (f.tipo === 'ingreso' ? 'Ingreso' : 'Pago') + ': ' + f.nombre + ' ' + pesos(f.monto) + (f.dia ? ', el día ' + f.dia : '') + (actual ? ' (' + ({ pagado: f.tipo === 'ingreso' ? 'recibido' : 'pagado', vencido: f.tipo === 'ingreso' ? 'no ha llegado' : 'vencido', pronto: 'pronto', pendiente: 'pendiente' }[estadoFijo(fin, f, hoy).estado] || '') + ')' : ''));
  }
  const deudas = (fin.deudas || []).filter((d) => d.saldo > 0);
  if (deudas.length) {
    L.push('', '## Deudas');
    for (const d of deudas) {
      const meses = mesesParaPagar(d.saldo, d.tasa || 0, d.cuota || 0);
      L.push('- ' + d.nombre + ': saldo ' + pesos(d.saldo) + ', tasa ' + (d.tasa || 0) + ' % al mes, cuota ' + pesos(d.cuota || 0) + (d.dia ? ' el día ' + d.dia : '') +
        ', ' + (meses === Infinity ? 'con esa cuota no se paga nunca' : meses ? 'faltan ' + meses + ' meses' : 'pagada') + (actual ? ' (' + estadoDeuda(fin, d, hoy).estado + ' este mes)' : ''));
    }
  }
  const metas = (fin.metas || []).map((m) => ({ ...m, lleva: valorMeta(fin, m), meta: objetivoMeta(fin, m, hoy) })).filter((m) => m.lleva || m.objetivo);
  if (metas.length) {
    L.push('', '## Metas de ahorro');
    for (const m of metas) L.push('- ' + m.nombre + ': llevo ' + pesos(m.lleva) + (m.meta ? ' de ' + pesos(m.meta) : ''));
  }

  const movs = r.movs.slice().sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (opciones.detalle && movs.length) {
    L.push('', '## Movimientos del mes (' + movs.length + ')', 'Fecha | Día | Tipo | Categoría | Monto | Cuenta' + (opciones.notas ? ' | Nota' : ''));
    for (const m of movs) {
      const c = catDe(m.categoria), sub = m.sub ? (subDe(fin, m.categoria, m.sub) || { nombre: m.sub }).nombre : '';
      const extra = m.deuda || m.tipo === 'pago-tarjeta' ? ' (interés ' + pesos(gastoDe(m)) + ', capital ' + pesos(m.tipo === 'pago-tarjeta' ? m.monto - gastoDe(m) : abonoDe(m)) + ')' : '';
      L.push([m.fecha, diaSemana(m.fecha), TIPO[m.tipo] || m.tipo, m.tipo === 'ingreso' || m.tipo === 'gasto' ? c.nombre + (sub ? ' › ' + sub : '') : m.tipo === 'transferencia' ? 'a ' + metodo(m.destino) : '',
        pesos(m.monto) + extra, metodo(m.metodo), ...(opciones.notas ? [(m.nota || '').replace(/\s+/g, ' ').trim()] : [])].join(' | '));
    }
  }
  return { texto: L.join('\n'), movimientos: movs.length, sinDatos: !movs.length };
}
