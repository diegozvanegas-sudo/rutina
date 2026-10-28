// Reglas de Finanzas y Recordatorios (sin pantalla, para poder probarlas)
import { desdeIso, iso, sumarDias, diasEntre } from './fechas.js';

export const mesDe = (fecha) => fecha.slice(0, 7);
export function diasDelMes(mes) {
  const [a, m] = mes.split('-').map(Number);
  return new Date(a, m, 0).getDate();
}
export function sumarMeses(fecha, n) {
  const d = desdeIso(fecha), dia = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  d.setDate(Math.min(dia, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  return iso(d);
}
export const pesos = (n) => '$ ' + Math.round(n || 0).toLocaleString('es-CO');
// "25.000", "25000", "25k", "1,5M" → número
export function leerMonto(texto) {
  let s = String(texto || '').trim().toLowerCase().replace(/\$|\s/g, '');
  const mult = /m$/.test(s) ? 1e6 : /k$/.test(s) ? 1e3 : 1;
  s = s.replace(/[km]$/, '');
  // Con multiplicador la coma o el punto son decimales (1,5M); sin él, separadores de miles
  s = mult > 1 ? s.replace(',', '.') : s.replace(/[.,]/g, '');
  const n = Number(s) * mult;
  return isFinite(n) && n > 0 ? Math.round(n) : 0;
}

// ---------- Movimientos ----------
// Lo que un movimiento cuenta como gasto: el pago de una tarjeta vinculada solo cuenta los intereses (las compras ya se contaron)
export const gastoDe = (m) => (m.tipo === 'gasto' ? m.monto : m.tipo === 'pago-tarjeta' ? m.interes || 0 : 0);
// Deuda vinculada a un método de pago (la tarjeta de crédito con la que se compra)
export const tarjetaDe = (fin, metodoId) => fin.deudas.find((d) => d.metodo && d.metodo === metodoId) || null;
export const esCredito = (fin, metodoId) => metodoId === 'credito' || !!tarjetaDe(fin, metodoId);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

// Efecto en el saldo de las deudas: una compra con tarjeta lo sube (cargo); una cuota lo baja (abono). signo −1 deshace.
// Sin tope en 0 para que deshacer deje todo igual: un saldo negativo es plata a favor en la tarjeta.
function aplicar(fin, m, signo) {
  const d = fin.deudas.find((x) => x.id === (m.cargo || m.deuda));
  if (!d) return;
  if (m.cargo) d.saldo = Math.round((d.saldo || 0) + signo * m.monto);
  else if (m.abono) d.saldo = Math.round((d.saldo || 0) - signo * m.abono);
}
function vincular(fin, m) {
  delete m.cargo;
  const t = m.tipo === 'gasto' && tarjetaDe(fin, m.metodo);
  if (t) m.cargo = t.id;
}
export function agregarMovimiento(fin, m, hoy = iso()) {
  const mov = { id: 'm' + uid(), fecha: hoy, metodo: 'efectivo', nota: '', creado: Date.now(), ...m, monto: Math.round(m.monto) };
  vincular(fin, mov);
  fin.movimientos.push(mov);
  aplicar(fin, mov, 1);
  return mov;
}
export function quitarMovimiento(fin, id) {
  const i = fin.movimientos.findIndex((m) => m.id === id);
  if (i < 0) return null;
  aplicar(fin, fin.movimientos[i], -1);
  return fin.movimientos.splice(i, 1)[0];
}
// Corregir monto, categoría, método, nota o fecha; el saldo de la tarjeta se ajusta solo
export function cambiarMovimiento(fin, id, cambios) {
  const m = fin.movimientos.find((x) => x.id === id);
  if (!m) return null;
  aplicar(fin, m, -1);
  Object.assign(m, cambios, cambios.monto != null ? { monto: Math.round(cambios.monto) } : {});
  vincular(fin, m);
  aplicar(fin, m, 1);
  return m;
}
// Cuota de una deuda: primero paga el interés del mes y lo demás baja el saldo
export function pagoDeuda(fin, d, monto = d.cuota, hoy = iso()) {
  const saldo = Math.max(0, d.saldo || 0), interes = Math.min(monto, Math.round(saldo * ((d.tasa || 0) / 100)));
  const abono = Math.min(saldo, Math.max(0, monto - interes));
  // Tarjeta vinculada: las compras ya se contaron como gasto, así que el pago solo suma los intereses
  const tipo = d.metodo ? 'pago-tarjeta' : 'gasto';
  return agregarMovimiento(fin, { tipo, monto, interes, abono, categoria: 'deudas', metodo: 'transferencia', nota: 'Cuota ' + d.nombre, fijo: 'deuda:' + d.id, deuda: d.id }, hoy);
}

// ---------- Resumen del mes ----------
export function resumenMes(fin, mes, hoy = iso()) {
  const movs = fin.movimientos.filter((m) => mesDe(m.fecha) === mes);
  const grupo = Object.fromEntries(fin.categorias.gasto.map((c) => [c.id, c.grupo]));
  const r = { ingresos: 0, gastos: 0, ahorro: 0, gastosFijos: 0, pagosTarjeta: 0, porCategoria: {}, porMetodo: {}, porGrupo: { necesidad: 0, deseo: 0 }, movs };
  for (const m of movs) {
    if (m.tipo === 'ingreso') { r.ingresos += m.monto; continue; }
    if (m.tipo === 'ahorro') r.ahorro += m.monto;
    else if (m.tipo === 'retiro') { r.ahorro -= m.monto; continue; } // sacar plata de una meta de ahorro
    else {
      const g = gastoDe(m);
      if (m.tipo === 'pago-tarjeta') r.pagosTarjeta += m.monto - g;
      if (!g) continue;
      r.gastos += g;
      if (m.fijo) r.gastosFijos += g;
      r.porCategoria[m.categoria] = (r.porCategoria[m.categoria] || 0) + g;
      r.porGrupo[grupo[m.categoria] || 'deseo'] += g;
      r.porMetodo[m.metodo] = (r.porMetodo[m.metodo] || 0) + g;
      continue;
    }
    r.porMetodo[m.metodo] = (r.porMetodo[m.metodo] || 0) + m.monto;
  }
  r.balance = r.ingresos - r.gastos - r.ahorro;
  // Lo que no se gastó (incluye lo que se pasó a ahorro) sobre lo que entró
  r.tasaAhorro = r.ingresos ? (r.ingresos - r.gastos) / r.ingresos : null;
  r.ingresoEsperado = r.ingresos;
  if (mesDe(hoy) === mes) {
    // Lo que falta por pagar o recibir este mes (pagos fijos, ingresos fijos y cuotas de préstamos)
    r.pendientes = 0;
    for (const f of fin.fijos) {
      if (estadoFijo(fin, f, hoy).estado === 'pagado') continue;
      if (f.tipo === 'ingreso') r.ingresoEsperado += f.monto || 0;
      else r.pendientes += f.monto || 0;
    }
    for (const d of fin.deudas) if (d.saldo > 0 && d.dia && !d.metodo && estadoDeuda(fin, d, hoy).estado !== 'pagado') r.pendientes += d.cuota || 0;
    // A este ritmo: los pagos fijos completos más el gasto del día a día llevado a todo el mes
    const pasados = Number(hoy.slice(8, 10)), variable = r.gastos - r.gastosFijos;
    r.proyeccion = r.gastosFijos + r.pendientes + (variable / pasados) * diasDelMes(mes);
  }
  return r;
}

// Promedio de gasto de los últimos meses completos con datos (para el fondo de emergencia)
export function gastoPromedio(fin, hoy = iso(), meses = 3) {
  const totales = [];
  for (let i = 1; i <= 12 && totales.length < meses; i++) {
    const mes = mesDe(sumarMeses(hoy.slice(0, 8) + '01', -i));
    const g = fin.movimientos.filter((m) => mesDe(m.fecha) === mes).reduce((s, m) => s + gastoDe(m), 0);
    if (g > 0) totales.push(g);
  }
  if (!totales.length) {
    // Sin meses completos: el mes actual hasta hoy, proyectado
    const r = resumenMes(fin, mesDe(hoy), hoy);
    return r.proyeccion || 0;
  }
  return totales.reduce((a, b) => a + b, 0) / totales.length;
}

export function aportado(fin, metaId) {
  return fin.movimientos.filter((m) => m.tipo === 'ahorro' && m.meta === metaId).reduce((s, m) => s + m.monto, 0)
    - fin.movimientos.filter((m) => m.tipo === 'retiro' && m.meta === metaId).reduce((s, m) => s + m.monto, 0);
}
export function objetivoMeta(fin, meta, hoy = iso()) {
  return meta.objetivo || (meta.meses ? Math.round(gastoPromedio(fin, hoy) * meta.meses) : 0);
}
// Meta con fecha: cuánto falta y cuánto aportar cada mes para llegar (los meses que quedan después del actual, mínimo 1)
export function planMeta(fin, meta, hoy = iso()) {
  if (!meta.fecha) return null;
  const obj = objetivoMeta(fin, meta, hoy), falta = Math.max(0, obj - aportado(fin, meta.id));
  const [a1, m1] = hoy.split('-').map(Number), [a2, m2] = meta.fecha.split('-').map(Number);
  const meses = Math.max(0, (a2 - a1) * 12 + (m2 - m1));
  return { falta, meses, vencida: meta.fecha < hoy && falta > 0, porMes: falta ? Math.ceil(falta / Math.max(1, meses)) : 0 };
}

// ---------- Pagos fijos y deudas ----------
// Fecha de pago de un mes (día 31 en un mes de 30 → día 30)
export function fechaPago(dia, mes) {
  return mes + '-' + String(Math.min(Number(dia) || 1, diasDelMes(mes))).padStart(2, '0');
}
export function estadoFijo(fin, fijo, hoy = iso()) {
  const mes = mesDe(hoy), fecha = fechaPago(fijo.dia, mes);
  const pago = fin.movimientos.find((m) => m.fijo === fijo.id && mesDe(m.fecha) === mes);
  if (pago) return { estado: 'pagado', fecha, pago };
  const faltan = diasEntre(hoy, fecha);
  return { estado: faltan < 0 ? 'vencido' : faltan <= 5 ? 'pronto' : 'pendiente', fecha, faltan };
}
// Meses para terminar de pagar con una cuota fija (tasa mensual en %). Infinity si la cuota no alcanza ni para el interés.
export function mesesParaPagar(saldo, tasa, cuota) {
  const r = (Number(tasa) || 0) / 100;
  if (saldo <= 0) return 0;
  if (cuota <= 0 || cuota <= saldo * r) return Infinity;
  if (!r) return Math.ceil(saldo / cuota);
  return Math.ceil(-Math.log(1 - (r * saldo) / cuota) / Math.log(1 + r));
}
// Mes a mes con la cuota fija: cuántos meses y cuánto se paga en intereses en total
export function planPago(saldo, tasa, cuota) {
  const r = (Number(tasa) || 0) / 100;
  let s = saldo || 0, meses = 0, intereses = 0;
  if (s <= 0) return { meses: 0, intereses: 0 };
  if (cuota <= 0 || cuota <= s * r) return { meses: Infinity, intereses: Infinity };
  while (s > 0 && meses < 1200) {
    const i = s * r;
    intereses += i;
    s = s + i - cuota;
    meses++;
  }
  return { meses, intereses: Math.round(intereses) };
}
export function estadoDeuda(fin, deuda, hoy = iso()) {
  return estadoFijo(fin, { id: 'deuda:' + deuda.id, dia: deuda.dia }, hoy);
}

// ---------- Cuentas y patrimonio ----------
// Saldo de una cuenta (efectivo, Nequi, débito…): el que se anotó al ajustarla más lo que entró y salió por ella después.
// Lo anotado con fecha anterior al ajuste ya estaba en ese saldo.
export function saldoCuenta(fin, metodo) {
  const a = metodo.ajuste;
  if (!a) return null;
  const despues = (m) => m.fecha > a.fecha || (m.fecha === a.fecha && (m.creado || 0) > a.ts);
  return fin.movimientos.filter((m) => m.metodo === metodo.id && despues(m)).reduce((s, m) =>
    s + (m.tipo === 'ingreso' || m.tipo === 'retiro' ? m.monto : -m.monto), a.monto);
}
export function patrimonio(fin) {
  const ahorro = fin.metas.reduce((s, m) => s + aportado(fin, m.id), 0);
  const cuentas = fin.metodos.filter((m) => !esCredito(fin, m.id)).reduce((s, m) => s + (saldoCuenta(fin, m) || 0), 0);
  const deudas = fin.deudas.reduce((s, d) => s + Math.max(0, d.saldo || 0), 0);
  return { ahorro, cuentas, deudas, neto: ahorro + cuentas - deudas };
}
// Foto del patrimonio del mes (la última del mes queda como su cierre), para ver cómo cambia
export function anotarPatrimonio(fin, hoy = iso()) {
  const { neto, ...resto } = patrimonio(fin);
  (fin.historial ??= {})[mesDe(hoy)] = resto;
}

// Plata para deseos que queda este mes: el presupuesto de deseos (o el 30 % del ingreso) menos lo gastado en deseos
export function deseosDelMes(fin, hoy = iso()) {
  const r = resumenMes(fin, mesDe(hoy), hoy);
  const presupuestado = fin.categorias.gasto.filter((c) => c.grupo === 'deseo').reduce((s, c) => s + (c.presupuesto || 0), 0);
  const tope = presupuestado || Math.round(r.ingresoEsperado * 0.3);
  if (!tope) return null;
  const quedan = tope - r.porGrupo.deseo, dias = diasDelMes(mesDe(hoy)) - Number(hoy.slice(8, 10)) + 1;
  return { tope, gastado: r.porGrupo.deseo, quedan, porDia: quedan > 0 ? quedan / dias : 0, dias, presupuestado: !!presupuestado };
}

// Pagos fijos de deseos (suscripciones, gym…) para revisar cada 90 días si se siguen usando
export const DIAS_REVISION = 90;
export function fijosPorRevisar(fin, hoy = iso()) {
  const grupo = Object.fromEntries(fin.categorias.gasto.map((c) => [c.id, c.grupo]));
  return fin.fijos.filter((f) => f.tipo !== 'ingreso' && grupo[f.categoria] === 'deseo' && f.monto > 0 && (!f.revisado || diasEntre(f.revisado, hoy) >= DIAS_REVISION));
}

// ---------- Recordatorios ----------
// km por día según las lecturas del odómetro de los últimos 90 días (para estimar la fecha de un cambio por km)
export function ritmoKm(lecturas, hoy = iso()) {
  const desde = sumarDias(hoy, -90), l = lecturas.filter((x) => x.fecha >= desde).sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (l.length < 2) return null;
  const dias = diasEntre(l[0].fecha, l[l.length - 1].fecha);
  return dias > 0 ? (l[l.length - 1].km - l[0].km) / dias : null;
}
export const kmActual = (lecturas) => (lecturas.length ? Math.max(...lecturas.map((x) => x.km)) : null);

// Lo que pase primero: los km o los meses
export function estadoRecordatorio(rec, vehiculo, hoy = iso()) {
  const ultimo = rec.hechos.length ? rec.hechos[rec.hechos.length - 1] : null;
  if (!ultimo) return { estado: 'sin-dato' };
  const km = vehiculo ? kmActual(vehiculo.km) : null, ritmo = vehiculo ? ritmoKm(vehiculo.km, hoy) : null;
  const res = { estado: 'al-dia', ultimo };
  let urgencia = Infinity;
  if (rec.cadaKm && ultimo.km != null) {
    res.proxKm = ultimo.km + rec.cadaKm;
    if (km != null) {
      res.faltaKm = res.proxKm - km;
      if (ritmo > 0) res.fechaKm = sumarDias(hoy, Math.max(0, Math.round(res.faltaKm / ritmo)));
      urgencia = Math.min(urgencia, res.faltaKm <= 0 ? -1 : res.faltaKm <= Math.max(200, rec.cadaKm * 0.1) ? 0 : 1);
    }
  }
  if (rec.cadaMeses) {
    res.proxFecha = sumarMeses(ultimo.fecha, rec.cadaMeses);
    res.faltaDias = diasEntre(hoy, res.proxFecha);
    urgencia = Math.min(urgencia, res.faltaDias < 0 ? -1 : res.faltaDias <= 14 ? 0 : 1);
  }
  res.estado = urgencia < 0 ? 'vencido' : urgencia === 0 ? 'pronto' : 'al-dia';
  return res;
}

// Recordatorios que salen solos de Finanzas: pagos fijos y cuotas de deudas sin pagar este mes
export function recordatoriosAutomaticos(fin, hoy = iso()) {
  const lista = [];
  for (const f of fin.fijos) {
    if (f.tipo === 'ingreso') continue; // el salario no es un pago
    const s = estadoFijo(fin, f, hoy);
    if (s.estado !== 'pagado') lista.push({ tipo: 'fijo', id: f.id, nombre: f.nombre, monto: f.monto, ...s });
  }
  for (const d of fin.deudas) {
    if (!(d.saldo > 0) || !d.dia) continue;
    const s = estadoDeuda(fin, d, hoy);
    if (s.estado !== 'pagado') lista.push({ tipo: 'deuda', id: d.id, nombre: 'Cuota ' + d.nombre, monto: d.cuota, ...s });
  }
  return lista.sort((a, b) => a.fecha.localeCompare(b.fecha));
}
