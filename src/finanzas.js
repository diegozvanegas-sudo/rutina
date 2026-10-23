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

// ---------- Resumen del mes ----------
export function resumenMes(fin, mes, hoy = iso()) {
  const movs = fin.movimientos.filter((m) => mesDe(m.fecha) === mes);
  const grupo = Object.fromEntries(fin.categorias.gasto.map((c) => [c.id, c.grupo]));
  const r = { ingresos: 0, gastos: 0, ahorro: 0, porCategoria: {}, porMetodo: {}, porGrupo: { necesidad: 0, deseo: 0 }, movs };
  for (const m of movs) {
    if (m.tipo === 'ingreso') r.ingresos += m.monto;
    else if (m.tipo === 'ahorro') r.ahorro += m.monto;
    else if (m.tipo === 'retiro') { r.ahorro -= m.monto; continue; } // sacar plata de una meta de ahorro
    else {
      r.gastos += m.monto;
      r.porCategoria[m.categoria] = (r.porCategoria[m.categoria] || 0) + m.monto;
      r.porGrupo[grupo[m.categoria] || 'deseo'] += m.monto;
    }
    if (m.tipo !== 'ingreso') r.porMetodo[m.metodo] = (r.porMetodo[m.metodo] || 0) + m.monto;
  }
  r.balance = r.ingresos - r.gastos - r.ahorro;
  // Lo que no se gastó (incluye lo que se pasó a ahorro) sobre lo que entró
  r.tasaAhorro = r.ingresos ? (r.ingresos - r.gastos) / r.ingresos : null;
  // Mes en curso: a este ritmo, cuánto se gastaría al final
  const dias = diasDelMes(mes);
  if (mesDe(hoy) === mes) {
    const pasados = Number(hoy.slice(8, 10));
    r.proyeccion = (r.gastos / pasados) * dias;
  }
  return r;
}

// Promedio de gasto de los últimos meses completos con datos (para el fondo de emergencia)
export function gastoPromedio(fin, hoy = iso(), meses = 3) {
  const totales = [];
  for (let i = 1; i <= 12 && totales.length < meses; i++) {
    const mes = mesDe(sumarMeses(hoy.slice(0, 8) + '01', -i));
    const g = fin.movimientos.filter((m) => m.tipo === 'gasto' && mesDe(m.fecha) === mes).reduce((s, m) => s + m.monto, 0);
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
export function estadoDeuda(fin, deuda, hoy = iso()) {
  return estadoFijo(fin, { id: 'deuda:' + deuda.id, dia: deuda.dia }, hoy);
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
