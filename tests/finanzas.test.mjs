import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FINANZAS, PLANTILLAS_RECORDATORIO } from '../src/datos_finanzas.js';
import {
  leerMonto, pesos, resumenMes, gastoPromedio, aportado, objetivoMeta, estadoFijo, mesesParaPagar, sumarMeses,
  estadoRecordatorio, ritmoKm, recordatoriosAutomaticos, agregarMovimiento, quitarMovimiento, cambiarMovimiento, pagoDeuda,
  planMeta, planPago, saldoCuenta, patrimonio, anotarPatrimonio, deseosDelMes, fijosPorRevisar, cobroPrestamo, interesPrestamo, estadoCobro,
} from '../src/finanzas.js';

const mov = (fecha, tipo, monto, extra = {}) => ({ id: fecha + tipo + monto, fecha, tipo, monto, metodo: 'efectivo', ...extra });

test('montos como se escriben en el celular', () => {
  assert.equal(leerMonto('25.000'), 25000);
  assert.equal(leerMonto('$ 1.250.000'), 1250000);
  assert.equal(leerMonto('25k'), 25000);
  assert.equal(leerMonto('1,5M'), 1500000);
  assert.equal(leerMonto('abc'), 0);
  assert.equal(pesos(1250000), '$ 1.250.000');
});

test('resumen del mes: ingresos, gastos por categoría y grupo, ahorro y 50/30/20', () => {
  const fin = FINANZAS();
  fin.movimientos = [
    mov('2026-10-01', 'ingreso', 4000000, { categoria: 'salario' }),
    mov('2026-10-02', 'gasto', 1200000, { categoria: 'vivienda' }),
    mov('2026-10-05', 'gasto', 300000, { categoria: 'comida', metodo: 'credito' }),
    mov('2026-10-06', 'ahorro', 500000, { meta: 'emergencia' }),
    mov('2026-10-07', 'retiro', 100000, { meta: 'emergencia' }),
    mov('2026-09-30', 'gasto', 999, { categoria: 'otros' }),
  ];
  const r = resumenMes(fin, '2026-10', '2026-10-10');
  assert.deepEqual([r.ingresos, r.gastos, r.ahorro, r.balance], [4000000, 1500000, 400000, 2100000]);
  assert.deepEqual(r.porGrupo, { necesidad: 1200000, deseo: 300000 });
  assert.equal(r.porMetodo.credito, 300000);
  assert.equal(r.tasaAhorro, 0.625);
  assert.equal(r.proyeccion, 1500000 / 10 * 31);
  assert.equal(aportado(fin, 'emergencia'), 400000);
});

test('fondo de emergencia: 6 meses del gasto promedio de los meses anteriores', () => {
  const fin = FINANZAS();
  fin.movimientos = [mov('2026-08-10', 'gasto', 2000000, { categoria: 'vivienda' }), mov('2026-09-10', 'gasto', 3000000, { categoria: 'vivienda' })];
  assert.equal(gastoPromedio(fin, '2026-10-22'), 2500000);
  assert.equal(objetivoMeta(fin, fin.metas[0], '2026-10-22'), 15000000);
});

test('pagos fijos: pendiente, pronto, vencido y pagado', () => {
  const fin = FINANZAS(), arriendo = { id: 'arr', dia: 5, monto: 1000000 }, luz = { id: 'luz', dia: 31 };
  assert.equal(estadoFijo(fin, arriendo, '2026-10-01').estado, 'pronto');
  assert.equal(estadoFijo(fin, arriendo, '2026-10-06').estado, 'vencido');
  assert.equal(estadoFijo(fin, luz, '2026-11-02').fecha, '2026-11-30'); // noviembre tiene 30 días
  fin.movimientos.push(mov('2026-10-04', 'gasto', 1000000, { fijo: 'arr' }));
  assert.equal(estadoFijo(fin, arriendo, '2026-10-06').estado, 'pagado');
  fin.fijos.push({ ...arriendo, nombre: 'Arriendo' }, { ...luz, nombre: 'Luz', monto: 80000 });
  assert.deepEqual(recordatoriosAutomaticos(fin, '2026-10-06').map((a) => a.nombre), ['Luz']);
});

test('deudas: meses para pagar', () => {
  assert.equal(mesesParaPagar(1000000, 0, 100000), 10);
  assert.equal(mesesParaPagar(1000000, 2, 100000), 12);
  assert.equal(mesesParaPagar(1000000, 2, 20000), Infinity); // la cuota no cubre el interés
  assert.equal(sumarMeses('2026-01-31', 1), '2026-02-28');
});

test('aceite de la moto: lo que pase primero, km o meses', () => {
  const aceite = { ...PLANTILLAS_RECORDATORIO[0], cadaKm: 3000, hechos: [] };
  const moto = { km: [{ fecha: '2026-10-01', km: 10000 }, { fecha: '2026-10-21', km: 10600 }] };
  assert.equal(estadoRecordatorio(aceite, moto, '2026-10-22').estado, 'sin-dato');
  aceite.hechos.push({ fecha: '2026-09-15', km: 8000 });
  const s = estadoRecordatorio(aceite, moto, '2026-10-22');
  assert.equal(ritmoKm(moto.km, '2026-10-22'), 30);
  assert.deepEqual([s.proxKm, s.faltaKm, s.proxFecha, s.estado], [11000, 400, '2026-12-15', 'al-dia']);
  assert.equal(s.fechaKm, '2026-11-04'); // 400 km a 30 km/día ≈ 13 días
  moto.km.push({ fecha: '2026-10-28', km: 10850 });
  assert.equal(estadoRecordatorio(aceite, moto, '2026-10-28').estado, 'pronto'); // faltan 150 km
  moto.km.push({ fecha: '2026-11-02', km: 11100 });
  assert.equal(estadoRecordatorio(aceite, moto, '2026-11-02').estado, 'vencido');
  assert.equal(estadoRecordatorio(aceite, { km: [] }, '2026-12-20').estado, 'vencido'); // pasaron los 3 meses
});

test('motilada: cada N días, avisa un cuarto del intervalo antes', () => {
  const corte = { ...PLANTILLAS_RECORDATORIO.find((p) => p.nombre === 'Motilada'), hechos: [{ fecha: '2026-10-01', km: null }] };
  const s = estadoRecordatorio(corte, null, '2026-10-10');
  assert.deepEqual([s.proxFecha, s.faltaDias, s.estado], ['2026-10-22', 12, 'al-dia']);
  assert.equal(estadoRecordatorio(corte, null, '2026-10-17').estado, 'pronto'); // faltan 5 días (21 / 4)
  assert.equal(estadoRecordatorio(corte, null, '2026-10-23').estado, 'vencido');
  // Sin intervalo: solo guarda cuándo fue
  assert.equal(estadoRecordatorio({ hechos: [{ fecha: '2026-01-01' }] }, null, '2026-10-23').estado, 'al-dia');
});

test('tarjeta vinculada: la compra sube el saldo y el pago no se cuenta dos veces', () => {
  const fin = FINANZAS();
  fin.deudas.push({ id: 'visa', nombre: 'Visa', saldo: 0, tasa: 2, cuota: 0, dia: 10, metodo: 'credito' });
  const compra = agregarMovimiento(fin, { tipo: 'gasto', monto: 500000, categoria: 'ropa', metodo: 'credito' }, '2026-10-03');
  assert.equal(fin.deudas[0].saldo, 500000);
  pagoDeuda(fin, fin.deudas[0], 510000, '2026-10-10'); // 10.000 de interés (2 %) + 500.000 de abono
  assert.equal(fin.deudas[0].saldo, 0);
  const r = resumenMes(fin, '2026-10', '2026-10-20');
  assert.equal(r.gastos, 510000); // la compra + los intereses, no la compra dos veces
  assert.equal(r.pagosTarjeta, 500000);
  // Corregir la compra ajusta el saldo; borrar el pago lo devuelve
  cambiarMovimiento(fin, compra.id, { monto: 400000 });
  assert.equal(fin.deudas[0].saldo, -100000); // 400.000 de compra − 500.000 de abono: 100.000 a favor
  quitarMovimiento(fin, fin.movimientos[1].id);
  assert.equal(fin.deudas[0].saldo, 400000);
  cambiarMovimiento(fin, compra.id, { metodo: 'efectivo' });
  assert.equal(fin.deudas[0].saldo, 0);
});

test('préstamo sin tarjeta: la cuota cuenta entera como gasto y baja el saldo por el abono', () => {
  const fin = FINANZAS(), d = { id: 'moto', nombre: 'Moto', saldo: 1000000, tasa: 2, cuota: 100000, dia: 5 };
  fin.deudas.push(d);
  const m = pagoDeuda(fin, d, undefined, '2026-10-05');
  assert.deepEqual([m.tipo, m.interes, m.abono, d.saldo], ['gasto', 20000, 80000, 920000]);
  assert.equal(resumenMes(fin, '2026-10', '2026-10-06').gastos, 100000);
});

test('proyección: los pagos fijos no se multiplican por los días del mes', () => {
  const fin = FINANZAS();
  fin.fijos.push({ id: 'arr', nombre: 'Arriendo', monto: 1000000, dia: 1, categoria: 'vivienda' }, { id: 'luz', nombre: 'Luz', monto: 100000, dia: 20, categoria: 'servicios' },
    { id: 'sal', tipo: 'ingreso', nombre: 'Salario', monto: 4000000, dia: 30, categoria: 'salario' });
  fin.movimientos = [mov('2026-10-01', 'gasto', 1000000, { categoria: 'vivienda', fijo: 'arr' }), mov('2026-10-02', 'gasto', 62000, { categoria: 'mercado' })];
  const r = resumenMes(fin, '2026-10', '2026-10-02');
  assert.equal(r.proyeccion, 1000000 + 100000 + 31000 * 31);
  assert.equal(r.ingresoEsperado, 4000000);
  assert.deepEqual(recordatoriosAutomaticos(fin, '2026-10-02').map((a) => a.nombre), ['Luz']); // el salario no es un pago
});

test('meta con fecha, simulador de deuda, cuentas, patrimonio, deseos y suscripciones', () => {
  const fin = FINANZAS();
  fin.metas.push({ id: 'viaje', nombre: 'Viaje', objetivo: 3000000, fecha: '2027-04-01' });
  fin.movimientos.push(mov('2026-10-05', 'ahorro', 600000, { meta: 'viaje' }));
  assert.deepEqual(planMeta(fin, fin.metas[1], '2026-10-28'), { falta: 2400000, meses: 6, vencida: false, porMes: 400000 });
  assert.equal(planMeta(fin, fin.metas[1], '2027-05-01').vencida, true);
  assert.deepEqual(planPago(1000000, 0, 100000), { meses: 10, intereses: 0 });
  assert.equal(planPago(1000000, 2, 100000).meses, mesesParaPagar(1000000, 2, 100000));
  assert.ok(planPago(1000000, 2, 150000).intereses < planPago(1000000, 2, 100000).intereses);
  assert.equal(planPago(1000000, 2, 20000).meses, Infinity);

  const nequi = fin.metodos.find((m) => m.id === 'nequi');
  assert.equal(saldoCuenta(fin, nequi), null);
  nequi.ajuste = { monto: 300000, fecha: '2026-10-10', ts: 1000 };
  fin.movimientos.push(mov('2026-10-09', 'gasto', 50000, { metodo: 'nequi', categoria: 'comida' }), // antes del ajuste: ya estaba en el saldo
    mov('2026-10-12', 'gasto', 40000, { metodo: 'nequi', categoria: 'comida' }), mov('2026-10-15', 'ingreso', 100000, { metodo: 'nequi', categoria: 'extra' }));
  assert.equal(saldoCuenta(fin, nequi), 360000);
  fin.deudas.push({ id: 'd', nombre: 'Préstamo', saldo: 200000 });
  assert.deepEqual(patrimonio(fin), { ahorro: 600000, cuentas: 360000, porCobrar: 0, deudas: 200000, neto: 760000 });
  anotarPatrimonio(fin, '2026-10-28');
  assert.deepEqual(fin.historial['2026-10'], { ahorro: 600000, cuentas: 360000, porCobrar: 0, deudas: 200000 });

  const d = deseosDelMes(fin, '2026-10-28');
  assert.deepEqual([d.tope, d.gastado, d.quedan, d.dias], [30000, 90000, -60000, 4]); // 30 % de 100.000 menos 90.000 en comida fuera
  fin.categorias.gasto.find((c) => c.id === 'comida').presupuesto = 200000;
  assert.equal(deseosDelMes(fin, '2026-10-28').quedan, 110000);

  fin.fijos.push({ id: 'net', nombre: 'Netflix', monto: 30000, categoria: 'suscripciones', dia: 3 }, { id: 'arr', nombre: 'Arriendo', monto: 1000000, categoria: 'vivienda', dia: 1 });
  assert.deepEqual(fijosPorRevisar(fin, '2026-10-28').map((f) => f.id), ['net']);
  fin.fijos[0].revisado = '2026-10-01';
  assert.equal(fijosPorRevisar(fin, '2026-10-28').length, 0);
  assert.equal(fijosPorRevisar(fin, '2027-01-02').length, 1);
});

test('plata prestada: el interés es ingreso, el abono baja lo que te deben y vuelve a la cuenta', () => {
  const fin = FINANZAS();
  const p = { id: 'a', nombre: 'Andrés', monto: 3500000, tasa: 5, dia: 5, metodo: 'nequi' };
  fin.prestamos.push(p);
  assert.equal(interesPrestamo(p), 175000);
  assert.equal(patrimonio(fin).porCobrar, 3500000);
  assert.deepEqual(recordatoriosAutomaticos(fin, '2026-11-03').map((r) => [r.tipo, r.monto, r.estado]), [['cobro', 175000, 'pronto']]);

  // Paga el interés y abona 500.000
  const m = cobroPrestamo(fin, p, 675000, '2026-11-05');
  assert.deepEqual([m.interes, m.abono, p.monto], [175000, 500000, 3000000]);
  assert.equal(resumenMes(fin, '2026-11', '2026-11-05').ingresos, 175000);
  assert.equal(estadoCobro(fin, p, '2026-11-06').estado, 'pagado');
  assert.equal(recordatoriosAutomaticos(fin, '2026-11-06').length, 0);
  // El mismo mes ya no se cobra interés otra vez: todo es abono
  assert.equal(cobroPrestamo(fin, p, 100000, '2026-11-20').abono, 100000);
  const nequi = fin.metodos.find((x) => x.id === 'nequi');
  nequi.ajuste = { monto: 0, fecha: '2026-11-01', ts: 0 };
  assert.equal(saldoCuenta(fin, nequi), 775000);
  // Borrar el cobro devuelve lo que te debía
  quitarMovimiento(fin, m.id);
  assert.equal(p.monto, 3400000);
  // Devolución sin intereses
  assert.deepEqual([cobroPrestamo(fin, p, 3400000, '2026-12-01', true).interes, p.monto], [0, 0]);
});
