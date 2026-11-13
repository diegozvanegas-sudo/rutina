// Reglas de Finanzas y Recordatorios (sin pantalla, para poder probarlas)
import { desdeIso, iso, sumarDias, diasEntre } from './fechas.js';
import { SUBCATEGORIAS } from './datos_finanzas.js';

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
// La cuota de un préstamo solo cuenta el interés: el abono baja lo que debes (no es gasto, como el ahorro)
export const gastoDe = (m) => (m.tipo === 'gasto' ? (m.deuda ? m.interes || 0 : m.monto) : m.tipo === 'pago-tarjeta' ? m.interes || 0 : 0);
// Lo que una cuota de préstamo bajó la deuda (no la tarjeta: sus compras ya se contaron como gasto)
export const abonoDe = (m) => (m.tipo === 'gasto' && m.deuda ? m.monto - (m.interes || 0) : 0);
// Deuda vinculada a un método de pago (la tarjeta de crédito con la que se compra)
export const tarjetaDe = (fin, metodoId) => fin.deudas.find((d) => d.metodo && d.metodo === metodoId) || null;
export const esCredito = (fin, metodoId) => metodoId === 'credito' || !!tarjetaDe(fin, metodoId);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

// Efecto en el saldo de las deudas: una compra con tarjeta lo sube (cargo); una cuota lo baja (abono). signo −1 deshace.
// Sin tope en 0 para que deshacer deje todo igual: un saldo negativo es plata a favor en la tarjeta.
function aplicar(fin, m, signo) {
  if (m.prestamo) {
    const p = (fin.prestamos || []).find((x) => x.id === m.prestamo);
    if (p) p.monto = Math.round((p.monto || 0) - signo * (m.abono || 0));
    return;
  }
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
export function pagoDeuda(fin, d, monto = d.cuota, hoy = iso(), extra = {}) {
  const saldo = Math.max(0, d.saldo || 0), interes = Math.min(monto, Math.round(saldo * ((d.tasa || 0) / 100)));
  const abono = Math.min(saldo, Math.max(0, monto - interes));
  // Tarjeta vinculada: las compras ya se contaron como gasto, así que el pago solo suma los intereses
  const tipo = d.metodo ? 'pago-tarjeta' : 'gasto';
  return agregarMovimiento(fin, { tipo, monto, interes, abono, categoria: 'deudas', metodo: 'transferencia', nota: 'Cuota ' + d.nombre, fijo: 'deuda:' + d.id, ...extra, deuda: d.id }, hoy);
}
// Gastos anotados a mano en "Cuotas y deudas" sin decir de cuál deuda: cuentan enteros como gasto y no bajan ningún saldo
export const pagosSinDeuda = (fin, mes) => fin.movimientos.filter((m) => m.tipo === 'gasto' && m.categoria === 'deudas' && !m.deuda && !m.noEsDeuda && mesDe(m.fecha) === mes);
// Pasa uno de esos gastos a pago de la deuda elegida: misma fecha, monto, cuenta y nota; el saldo baja por el abono
export function convertirEnPagoDeuda(fin, movId, deudaId) {
  const m = fin.movimientos.find((x) => x.id === movId), d = fin.deudas.find((x) => x.id === deudaId);
  if (!m || !d) return null;
  quitarMovimiento(fin, movId);
  return pagoDeuda(fin, d, m.monto, m.fecha, { metodo: m.metodo, ...(m.nota ? { nota: m.nota } : {}), ...(m.sub ? { sub: m.sub } : {}) });
}

// ---------- Plata prestada (me deben) ----------
export const interesPrestamo = (p) => Math.round(Math.max(0, p.monto || 0) * ((p.tasa || 0) / 100));
export const estadoCobro = (fin, p, hoy = iso()) => estadoFijo(fin, { id: 'prestamo:' + p.id, dia: p.dia }, hoy);
export const interesesCobrados = (fin, id) => fin.movimientos.filter((m) => m.prestamo === id).reduce((s, m) => s + (m.interes || 0), 0);
// Lo que te pagan: primero el interés del mes que falte (eso es ingreso); lo demás baja lo que te deben (vuelve a tus cuentas, no es ingreso).
// soloCapital: cuando te devuelven lo prestado sin intereses.
export function cobroPrestamo(fin, p, monto, hoy = iso(), soloCapital = false) {
  const yaMes = fin.movimientos.filter((m) => m.prestamo === p.id && mesDe(m.fecha) === mesDe(hoy)).reduce((s, m) => s + (m.interes || 0), 0);
  const falta = soloCapital ? 0 : Math.max(0, interesPrestamo(p) - yaMes);
  const abono = Math.min(Math.max(0, p.monto || 0), Math.max(0, monto - falta)), interes = monto - abono;
  return agregarMovimiento(fin, { tipo: 'cobro', monto, interes, abono, metodo: p.metodo || 'transferencia', nota: p.nombre, fijo: 'prestamo:' + p.id, prestamo: p.id }, hoy);
}
// Le prestas más: sale de tu cuenta y sube lo que te deben (no es gasto, y el patrimonio no cambia). El abono negativo hace que borrarlo lo deshaga
export function prestarMas(fin, p, monto, hoy = iso(), nota = '') {
  return agregarMovimiento(fin, { tipo: 'presto', monto, abono: -Math.round(monto), metodo: p.metodo || 'transferencia', nota: nota || p.nombre, prestamo: p.id }, hoy);
}

// ---------- Resumen del mes ----------
export function resumenMes(fin, mes, hoy = iso()) {
  const movs = fin.movimientos.filter((m) => mesDe(m.fecha) === mes);
  const grupo = Object.fromEntries(fin.categorias.gasto.map((c) => [c.id, c.grupo]));
  const r = { ingresos: 0, gastos: 0, ahorro: 0, gastosFijos: 0, pagosTarjeta: 0, abonoDeudas: 0, porCategoria: {}, porSub: {}, porMetodo: {}, porGrupo: { necesidad: 0, deseo: 0 }, movs };
  for (const m of movs) {
    if (m.tipo === 'ingreso') { r.ingresos += m.monto; continue; }
    if (m.tipo === 'cobro') { r.ingresos += m.interes || 0; continue; } // de lo que te pagan, solo el interés es ingreso
    if (m.tipo === 'ahorro') r.ahorro += m.monto;
    else if (m.tipo === 'retiro') { r.ahorro -= m.monto; continue; } // sacar plata de una meta de ahorro
    else {
      const g = gastoDe(m);
      if (m.tipo === 'pago-tarjeta') r.pagosTarjeta += m.monto - g;
      r.abonoDeudas += abonoDe(m);
      if (!g) continue;
      r.gastos += g;
      if (m.fijo) r.gastosFijos += g;
      r.porCategoria[m.categoria] = (r.porCategoria[m.categoria] || 0) + g;
      if (m.sub) { const s = (r.porSub[m.categoria] ??= {}); s[m.sub] = (s[m.sub] || 0) + g; }
      r.porGrupo[grupo[m.categoria] || 'deseo'] += g;
      r.porMetodo[m.metodo] = (r.porMetodo[m.metodo] || 0) + g;
      continue;
    }
    r.porMetodo[m.metodo] = (r.porMetodo[m.metodo] || 0) + m.monto;
  }
  r.balance = r.ingresos - r.gastos - r.ahorro - r.abonoDeudas;
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
    // Las cuotas que faltan suman enteras a lo que falta pagar, pero a la proyección del gasto solo su interés
    let interesPendiente = 0;
    for (const d of fin.deudas) if (d.saldo > 0 && d.dia && !d.metodo && estadoDeuda(fin, d, hoy).estado !== 'pagado') {
      r.pendientes += d.cuota || 0;
      interesPendiente += Math.min(d.cuota || 0, Math.round(d.saldo * ((d.tasa || 0) / 100))) - (d.cuota || 0);
    }
    // A este ritmo: los pagos fijos completos más el gasto del día a día llevado a todo el mes
    const pasados = Number(hoy.slice(8, 10)), variable = r.gastos - r.gastosFijos;
    r.proyeccion = r.gastosFijos + r.pendientes + interesPendiente + (variable / pasados) * diasDelMes(mes);
  }
  return r;
}

// Promedio de gasto de los últimos meses completos con datos (para el fondo de emergencia)
export function gastoPromedio(fin, hoy = iso(), meses = 3) {
  const totales = [];
  for (let i = 1; i <= 12 && totales.length < meses; i++) {
    const mes = mesDe(sumarMeses(hoy.slice(0, 8) + '01', -i));
    // El fondo de emergencia debe cubrir las cuotas completas de los préstamos, no solo su interés
    const g = fin.movimientos.filter((m) => mesDe(m.fecha) === mes).reduce((s, m) => s + gastoDe(m) + abonoDe(m), 0);
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
// Lo que vale hoy una meta: lo aportado; en una inversión, el valor que anotaste más lo que aportaste o sacaste después
export function valorMeta(fin, meta) {
  const v = meta.inversion && meta.valor;
  if (!v) return aportado(fin, meta.id);
  const despues = (m) => m.fecha > v.fecha || (m.fecha === v.fecha && (m.creado || 0) > v.ts);
  return fin.movimientos.filter((m) => m.meta === meta.id && despues(m)).reduce((s, m) => s + (m.tipo === 'ahorro' ? m.monto : m.tipo === 'retiro' ? -m.monto : 0), v.monto);
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
  // Una transferencia sale de su método y entra a su destino
  return fin.movimientos.filter((m) => (m.metodo === metodo.id || (m.tipo === 'transferencia' && m.destino === metodo.id)) && despues(m)).reduce((s, m) =>
    s + (m.tipo === 'transferencia' ? (m.destino === metodo.id ? m.monto : -m.monto) : ['ingreso', 'retiro', 'cobro'].includes(m.tipo) ? m.monto : -m.monto), a.monto);
}
export function patrimonio(fin) {
  const ahorro = fin.metas.reduce((s, m) => s + valorMeta(fin, m), 0);
  const cuentas = fin.metodos.filter((m) => !esCredito(fin, m.id)).reduce((s, m) => s + (saldoCuenta(fin, m) || 0), 0);
  const deudas = fin.deudas.reduce((s, d) => s + Math.max(0, d.saldo || 0), 0);
  const porCobrar = (fin.prestamos || []).filter((p) => !p.saldado).reduce((s, p) => s + Math.max(0, p.monto || 0), 0);
  return { ahorro, cuentas, porCobrar, deudas, neto: ahorro + cuentas + porCobrar - deudas };
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
  // Todos los días: pendiente hasta que se marque hoy; mañana vuelve a salir
  if (rec.diario) {
    const hecho = !!ultimo && ultimo.fecha === hoy;
    return { estado: hecho ? 'al-dia' : 'pendiente', ultimo, proxFecha: hecho ? sumarDias(hoy, 1) : hoy, faltaDias: hecho ? 1 : 0 };
  }
  if (!ultimo && rec.empieza) {
    // Algo que aún no empieza (una hipoteca a futuro): no pide nada hasta 14 días antes del primer pago
    const faltaDias = diasEntre(hoy, rec.empieza);
    return { estado: faltaDias < 0 ? 'vencido' : faltaDias <= 14 ? 'pronto' : 'programado', empieza: rec.empieza, faltaDias };
  }
  if (rec.diaMes && !rec.cadaKm) {
    // Día fijo: lo pagado hasta 14 días antes o después del vencimiento cuenta para ese mes
    const siguiente = (f) => fechaPago(rec.diaMes, mesDe(sumarMeses(f.slice(0, 7) + '-01', 1)));
    let proxFecha;
    if (ultimo) { proxFecha = fechaPago(rec.diaMes, mesDe(ultimo.fecha)); if (diasEntre(ultimo.fecha, proxFecha) <= 14) proxFecha = siguiente(ultimo.fecha); }
    else { proxFecha = fechaPago(rec.diaMes, mesDe(hoy)); if (proxFecha < hoy) proxFecha = siguiente(hoy); }
    const faltaDias = diasEntre(hoy, proxFecha);
    return { estado: faltaDias < 0 ? 'vencido' : faltaDias <= 7 ? 'pronto' : 'al-dia', ultimo, proxFecha, faltaDias };
  }
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
  // Por tiempo: cada N meses o cada N días (motilada, inyección…); si están los dos, la fecha que llegue primero
  const fechas = [rec.cadaMeses && sumarMeses(ultimo.fecha, rec.cadaMeses), rec.cadaDias && sumarDias(ultimo.fecha, rec.cadaDias)].filter(Boolean).sort();
  if (fechas.length) {
    res.proxFecha = fechas[0];
    res.faltaDias = diasEntre(hoy, res.proxFecha);
    // "Pronto": 14 días antes; en lo que se repite cada pocos días, un cuarto del intervalo (mínimo 1 día)
    const aviso = rec.cadaDias && res.proxFecha === sumarDias(ultimo.fecha, rec.cadaDias) ? Math.min(14, Math.max(1, Math.round(rec.cadaDias / 4))) : 14;
    urgencia = Math.min(urgencia, res.faltaDias < 0 ? -1 : res.faltaDias <= aviso ? 0 : 1);
  }
  res.estado = urgencia < 0 ? 'vencido' : urgencia === 0 ? 'pronto' : 'al-dia';
  return res;
}

// Lo que muestra la tarjeta: la frase del próximo (el límite que llegue primero, km o fecha) y cuánto del ciclo ya pasó (0 a 1)
// ¿Ya llegó el día (o los km)? Desde ese día sale arriba en toda la app hasta que se marque, como lo de todos los días.
// s: lo que devuelve estadoRecordatorio. Sin registro o sin fecha fija no avisa: no hay día que haya llegado
export function tocaYa(rec, s) {
  if (rec.diario) return s.estado === 'pendiente';
  if (s.estado === 'sin-dato') return false;
  return (s.faltaDias != null && s.faltaDias <= 0) || (s.faltaKm != null && s.faltaKm <= 0);
}

export function proximoRecordatorio(rec, s, kmHoy, hoy = iso()) {
  if (s.empieza) {
    const d = s.faltaDias;
    return { titulo: d > 1 ? 'Empieza en ' + d + ' días' : d === 1 ? 'Empieza mañana' : d === 0 ? 'Empieza hoy' : d === -1 ? 'Empezó ayer' : 'Empezó hace ' + -d + ' días', fecha: s.empieza, km: null, fraccion: 0 };
  }
  const nKm = (n) => Math.round(n).toLocaleString('es-CO') + ' km', opciones = [];
  if (s.proxKm != null) {
    const f = s.faltaKm;
    opciones.push({
      titulo: f == null ? 'A los ' + nKm(s.proxKm) : f > 0 ? 'Faltan ' + nKm(f) : f === 0 ? 'Toca ya' : 'Te pasaste ' + nKm(-f),
      fecha: s.fechaKm && f > 0 ? s.fechaKm : null, km: s.proxKm,
      fraccion: kmHoy != null && s.ultimo.km != null ? (kmHoy - s.ultimo.km) / rec.cadaKm : 0,
    });
  }
  if (s.proxFecha) {
    const d = s.faltaDias, total = s.ultimo ? diasEntre(s.ultimo.fecha, s.proxFecha) : 0;
    opciones.push({
      titulo: d > 1 ? 'En ' + d + ' días' : d === 1 ? 'Mañana' : d === 0 ? 'Hoy' : d === -1 ? 'Era ayer' : 'Hace ' + -d + ' días',
      fecha: s.proxFecha, km: null, fraccion: !s.ultimo ? 0 : total > 0 ? diasEntre(s.ultimo.fecha, hoy) / total : 1,
    });
  }
  if (!opciones.length) return null;
  const elegida = opciones.reduce((a, b) => (b.fraccion > a.fraccion ? b : a));
  return { ...elegida, fraccion: Math.max(0, Math.min(1, elegida.fraccion)) };
}

// Recordatorios que salen solos de Finanzas: pagos fijos, cuotas de deudas e intereses por cobrar de este mes
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
  for (const p of fin.prestamos || []) {
    if (p.saldado || !(p.monto > 0) || !p.tasa || !p.dia) continue;
    const s = estadoCobro(fin, p, hoy);
    if (s.estado !== 'pagado') lista.push({ tipo: 'cobro', id: p.id, nombre: 'Cobrar intereses: ' + p.nombre, monto: interesPrestamo(p), ...s });
  }
  return lista.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

// ---------- Categorías y subcategorías ----------
const llanoDe = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const lista = (fin, tipo) => fin.categorias[tipo === 'ingreso' ? 'ingreso' : 'gasto'];
// Las del catálogo más las que agregaste tú
export const subsDe = (fin, catId) => [...(SUBCATEGORIAS[catId] || []), ...(fin.subs || []).filter((x) => x.cat === catId)];
export function subDe(fin, catId, subId) {
  if (!subId) return null;
  return subsDe(fin, catId).find((x) => x.id === subId) || { id: subId, nombre: subId.replace(/-/g, ' '), icono: '🏷️' };
}
// Busca en nombres de categorías y subcategorías, sin importar tildes ni mayúsculas
export function buscarCategorias(fin, tipo, texto, max = 12) {
  const q = llanoDe(texto).trim();
  if (!q) return [];
  const salida = [];
  for (const c of lista(fin, tipo)) {
    if (llanoDe(c.nombre).includes(q)) salida.push({ categoria: c.id, sub: null, nombre: c.nombre, icono: c.icono, cat: c.nombre });
    for (const x of subsDe(fin, c.id)) if (llanoDe(x.nombre).includes(q)) salida.push({ categoria: c.id, sub: x.id, nombre: x.nombre, icono: x.icono, cat: c.nombre });
  }
  // Primero lo que empieza por lo que escribiste
  return salida.sort((a, b) => llanoDe(b.nombre).startsWith(q) - llanoDe(a.nombre).startsWith(q)).slice(0, max);
}
// Lo que más anotas: las combinaciones de categoría y subcategoría de los últimos 90 días que se repiten
export function frecuentes(fin, tipo, hoy = iso(), max = 6) {
  const desde = sumarDias(hoy, -90), cuenta = new Map();
  const existe = new Set(lista(fin, tipo).map((c) => c.id));
  for (const m of fin.movimientos) {
    if (m.tipo !== tipo || m.fecha < desde || !existe.has(m.categoria)) continue;
    const k = m.categoria + '|' + (m.sub || '');
    cuenta.set(k, (cuenta.get(k) || 0) + 1);
  }
  return [...cuenta].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, max).map(([k]) => {
    const [categoria, sub] = k.split('|');
    return { categoria, sub: sub || null };
  });
}
// Dentro de una categoría: las notas que más repites en los últimos 90 días ("Mango", "La negra"), con su subcategoría y el último monto
export function notasFrecuentes(fin, tipo, categoria, hoy = iso(), max = 8) {
  const desde = sumarDias(hoy, -90), grupos = new Map();
  for (const m of [...fin.movimientos].sort((a, b) => a.fecha.localeCompare(b.fecha))) {
    const nota = String(m.nota || '').trim();
    if (m.tipo !== tipo || m.categoria !== categoria || m.fecha < desde || !nota || m.deuda) continue;
    const k = llanoDe(nota), g = grupos.get(k) || { nota, n: 0, subs: {} };
    g.n++; g.monto = m.monto; g.nota = nota;
    if (m.sub) g.subs[m.sub] = (g.subs[m.sub] || 0) + 1;
    grupos.set(k, g);
  }
  return [...grupos.values()].filter((g) => g.n >= 2).sort((a, b) => b.n - a.n).slice(0, max)
    .map(({ nota, n, monto, subs }) => ({ nota, n, monto, sub: Object.entries(subs).sort((a, b) => b[1] - a[1])[0]?.[0] || null }));
}
// ¿Ya anotaste lo mismo ese día? (mismo tipo, monto, categoría y fecha)
export function posibleDuplicado(fin, m) {
  return fin.movimientos.find((x) => x.tipo === m.tipo && x.monto === Math.round(m.monto) && x.fecha === m.fecha && (x.categoria || null) === (m.categoria || null)
    && (x.meta || null) === (m.meta || null) && (x.destino || null) === (m.destino || null)) || null;
}
