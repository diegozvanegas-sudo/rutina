// 📅 Lo que viene: los pagos fijos, cuotas de deudas y tarjetas, ingresos fijos y cobros de los próximos días,
// cruzados con lo que hay hoy en las cuentas. Sin pantalla, para poder probarlo (la pantalla es FinanzasViene.tsx).
//
// Criterio: ser prudente. Lo que te deben (🤝 Me deben) se muestra pero no se cuenta en el saldo, porque no depende de ti;
// un ingreso que debía llegar y no se registró tampoco se cuenta; un pago vencido sí se cuenta, como si se pagara hoy.
import { iso, sumarDias, diasEntre } from './fechas.js';
import { mesDe, sumarMeses, fechaPago, saldoCuenta, esCredito, interesPrestamo, diasDelMes } from './finanzas.js';

export const DIAS_VIENE = 30;

const pagadoEn = (fin, clave, mes) => fin.movimientos.some((m) => m.fijo === clave && mesDe(m.fecha) === mes);
// Un pago que ya pasó y no se registró con su botón: si en ese mes hay uno parecido (anotado a mano o traído del extracto:
// misma categoría y casi el mismo monto), se da por pagado, para no contarlo dos veces
const parecido = (fin, s, mes) => fin.movimientos.some((m) => mesDe(m.fecha) === mes && !m.fijo
  && (s.tipo === 'deuda' ? m.deuda === s.id
    : m.tipo === (s.tipo === 'ingreso' ? 'ingreso' : 'gasto') && m.categoria === s.categoria && Math.abs(m.monto - s.monto) <= s.monto * 0.1));

// Todo lo que tiene un día fijo en el mes. clave = el "fijo" que llevan sus movimientos (así se sabe si ya se pagó)
function fuentes(fin) {
  const l = [];
  for (const x of fin.fijos || []) {
    if (!(x.monto > 0) || !x.dia) continue;
    l.push({ tipo: x.tipo === 'ingreso' ? 'ingreso' : 'fijo', id: x.id, clave: x.id, nombre: x.nombre, monto: x.monto, dia: x.dia, categoria: x.categoria });
  }
  for (const d of fin.deudas || []) {
    if (!(d.saldo > 0) || !d.dia || !(d.cuota > 0)) continue;
    l.push({ tipo: 'deuda', id: d.id, clave: 'deuda:' + d.id, nombre: 'Cuota ' + d.nombre, monto: d.cuota, dia: d.dia, tarjeta: !!d.metodo, saldo: d.saldo, tasa: d.tasa || 0 });
  }
  for (const p of fin.prestamos || []) {
    const m = interesPrestamo(p);
    if (p.saldado || !(p.monto > 0) || !p.dia || !(m > 0)) continue;
    l.push({ tipo: 'cobro', id: p.id, clave: 'prestamo:' + p.id, nombre: p.nombre, monto: m, dia: p.dia });
  }
  return l;
}

// Lo que no entra en la cuenta porque le falta un dato: así no parece que no debes nada
export function sinDatos(fin) {
  const l = [];
  for (const x of fin.fijos || []) if (!(x.monto > 0) || !x.dia) l.push({ tipo: x.tipo === 'ingreso' ? 'ingreso' : 'fijo', nombre: x.nombre, falta: !(x.monto > 0) ? 'el monto' : 'el día' });
  for (const d of fin.deudas || []) if (d.saldo > 0 && (!d.dia || !(d.cuota > 0))) l.push({ tipo: 'deuda', nombre: d.nombre, falta: !(d.cuota > 0) ? 'la cuota' : 'el día de pago' });
  return l;
}

// Cuánto hay hoy en las cuentas (efectivo, débito, Nequi…; las tarjetas de crédito no). null si ninguna tiene su saldo anotado
export function saldoHoy(fin) {
  const cuentas = (fin.metodos || []).filter((m) => !esCredito(fin, m.id));
  const anotadas = cuentas.filter((m) => m.ajuste);
  // Las que usas (tienen movimientos) pero nunca ajustaste: su plata no se ve aquí
  const sinAjustar = cuentas.filter((m) => !m.ajuste && fin.movimientos.some((x) => x.metodo === m.id || x.destino === m.id));
  return { saldo: anotadas.length ? anotadas.reduce((s, m) => s + (saldoCuenta(fin, m) || 0), 0) : null, cuentas: anotadas.length, sinAjustar };
}

// Lo que se te va al día en lo que no es fijo (comida, transporte, salidas…), pagado con plata de tus cuentas.
// Las compras con tarjeta no cuentan aquí: salen de tu cuenta cuando pagas la cuota de la tarjeta, que ya está en la lista
export function gastoVariableDia(fin, hoy = iso(), meses = 3) {
  const variable = (m) => m.tipo === 'gasto' && !m.fijo && !m.deuda && !esCredito(fin, m.metodo);
  let total = 0, dias = 0;
  for (let i = 1; i <= 12 && dias < meses * 28; i++) {
    const mes = mesDe(sumarMeses(hoy.slice(0, 8) + '01', -i));
    const g = fin.movimientos.filter((m) => mesDe(m.fecha) === mes && variable(m)).reduce((s, m) => s + m.monto, 0);
    if (g > 0) { total += g; dias += diasDelMes(mes); }
  }
  if (dias) return Math.round(total / dias);
  // Sin meses completos: lo que va de este mes
  const pasados = Number(hoy.slice(8, 10)), g = fin.movimientos.filter((m) => mesDe(m.fecha) === mesDe(hoy) && m.fecha <= hoy && variable(m)).reduce((s, m) => s + m.monto, 0);
  return g > 0 ? Math.round(g / pasados) : null;
}

export function loQueViene(fin, hoy = iso(), dias = DIAS_VIENE) {
  const hasta = sumarDias(hoy, dias), meses = [];
  for (let m = mesDe(hoy); m <= mesDe(hasta); m = mesDe(sumarMeses(m + '-01', 1))) meses.push(m);
  const eventos = [];
  for (const s of fuentes(fin)) {
    let saldoDeuda = s.saldo;
    for (const mes of meses) {
      const fecha = fechaPago(s.dia, mes);
      if (fecha > hasta || pagadoEn(fin, s.clave, mes) || (fecha < hoy && s.tipo !== 'cobro' && parecido(fin, s, mes))) continue;
      let monto = s.monto;
      // Una deuda casi pagada: la última cuota es lo que queda (con el interés del mes)
      if (s.tipo === 'deuda') {
        const conInteres = Math.round(saldoDeuda * (1 + s.tasa / 100));
        if (conInteres <= 0) break;
        monto = Math.min(s.monto, conInteres);
        saldoDeuda = conInteres - monto;
      }
      const vencido = fecha < hoy;
      eventos.push({ tipo: s.tipo, id: s.id, nombre: s.nombre, categoria: s.categoria, tarjeta: s.tarjeta, monto, fecha: vencido ? hoy : fecha, dia: fecha, vencido,
        // Entra: el salario que no ha llegado y lo que te deben no se cuentan (no depende de ti)
        cuenta: s.tipo === 'cobro' ? false : s.tipo === 'ingreso' ? !vencido : true,
        signo: s.tipo === 'ingreso' || s.tipo === 'cobro' ? 1 : -1 });
    }
  }
  // En un mismo día primero lo que entra (el salario llega y con eso pagas), luego lo vencido y luego lo demás
  const orden = (x) => (x.signo > 0 ? 0 : x.vencido ? 1 : 2);
  eventos.sort((a, b) => a.fecha.localeCompare(b.fecha) || orden(a) - orden(b) || b.monto - a.monto);

  const { saldo: inicial, cuentas, sinAjustar } = saldoHoy(fin);
  const porDia = [];
  let saldo = inicial ?? 0;
  for (const ev of eventos) {
    let d = porDia[porDia.length - 1];
    if (!d || d.fecha !== ev.fecha) porDia.push((d = { fecha: ev.fecha, eventos: [], entra: 0, sale: 0, teDeben: 0, saldo }));
    d.eventos.push(ev);
    if (!ev.cuenta) { if (ev.tipo === 'cobro') d.teDeben += ev.monto; continue; }
    if (ev.signo > 0) d.entra += ev.monto; else d.sale += ev.monto;
    saldo += ev.signo * ev.monto;
    d.saldo = saldo;
  }

  // El día de pago: el próximo ingreso fijo que se espera (hoy cuenta si no se ha registrado)
  const pago = eventos.find((x) => x.tipo === 'ingreso' && x.cuenta) || null;
  const antesDelPago = eventos.filter((x) => x.cuenta && x.signo < 0 && (!pago || x.fecha < pago.fecha || (x.vencido && pago.fecha === hoy)));
  const salePrevio = antesDelPago.reduce((s, x) => s + x.monto, 0);
  // Sin ingreso fijo: lo que quedaría al final de los días que se miran, con lo que entre y salga
  const libres = inicial == null ? null : pago ? inicial - salePrevio : saldo;
  const diasHasta = Math.max(1, pago ? diasEntre(hoy, pago.fecha) : dias);
  const variable = gastoVariableDia(fin, hoy);

  // Sin contar el día a día: el primer día que el saldo queda en negativo
  const negativo = inicial == null ? null : inicial < 0 ? { fecha: hoy, saldo: inicial } : (porDia.find((d) => d.saldo < 0) || null);
  // Gastando lo de siempre en el día a día: hasta qué día alcanza (se cuenta desde mañana; lo de hoy ya se fue registrando)
  let seAcaba = null;
  if (inicial != null && variable && !negativo) {
    let s = inicial, i = 0;
    for (let n = 0; n <= dias && !seAcaba; n++) {
      const fecha = sumarDias(hoy, n);
      if (n > 0) s -= variable;
      for (; i < eventos.length && eventos[i].fecha === fecha; i++) if (eventos[i].cuenta) s += eventos[i].signo * eventos[i].monto;
      if (s < 0) seAcaba = { fecha, saldo: s };
    }
  }

  return {
    hoy, hasta, inicial, cuentas, sinAjustar, eventos, porDia, pago, libres, diasHasta, variable,
    porDiaLibre: libres == null ? null : Math.round(libres / diasHasta),
    sale: eventos.filter((x) => x.cuenta && x.signo < 0).reduce((s, x) => s + x.monto, 0),
    entra: eventos.filter((x) => x.cuenta && x.signo > 0).reduce((s, x) => s + x.monto, 0),
    teDeben: eventos.filter((x) => x.tipo === 'cobro').reduce((s, x) => s + x.monto, 0),
    vencidos: eventos.filter((x) => x.vencido),
    negativo, seAcaba, faltan: sinDatos(fin),
  };
}
