import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FINANZAS } from '../src/datos_finanzas.js';
import { loQueViene, gastoVariableDia, saldoHoy, sinDatos } from '../src/flujo.js';

const HOY = '2026-11-22';
// Diego de ejemplo: 1.000.000 en débito, salario el 30, arriendo el 1, celular el 25, tarjeta el 5 y un préstamo que cobra el 10
function ejemplo() {
  const fin = FINANZAS();
  fin.metodos.find((m) => m.id === 'debito').ajuste = { monto: 1000000, fecha: '2026-11-20', ts: 0 };
  fin.metodos.push({ id: 'visa', nombre: 'Visa', icono: '💳' });
  fin.fijos = [
    { id: 'sal', tipo: 'ingreso', nombre: 'Salario', monto: 3000000, categoria: 'salario', metodo: 'debito', dia: 30 },
    { id: 'arr', nombre: 'Arriendo', monto: 1200000, categoria: 'vivienda', metodo: 'debito', dia: 1 },
    { id: 'cel', nombre: 'Celular', monto: 60000, categoria: 'servicios', metodo: 'debito', dia: 25 },
  ];
  fin.deudas = [{ id: 'tc', nombre: 'Visa', saldo: 2000000, tasa: 2, cuota: 400000, dia: 5, metodo: 'visa' }];
  fin.prestamos = [{ id: 'p1', nombre: 'Juan', monto: 1000000, tasa: 3, dia: 10 }];
  // Lo de noviembre que ya se pagó con su botón (antes de ajustar el saldo el 20)
  fin.movimientos = [
    { id: 'n1', fecha: '2026-11-01', tipo: 'gasto', monto: 1200000, metodo: 'debito', categoria: 'vivienda', fijo: 'arr' },
    { id: 'n2', fecha: '2026-11-05', tipo: 'pago-tarjeta', monto: 400000, interes: 40000, metodo: 'debito', categoria: 'deudas', fijo: 'deuda:tc', deuda: 'tc' },
    { id: 'n3', fecha: '2026-11-10', tipo: 'cobro', monto: 30000, interes: 30000, metodo: 'debito', fijo: 'prestamo:p1', prestamo: 'p1' },
  ];
  return fin;
}

test('lista de los próximos 30 días: fijos, cuotas, salario y lo que te deben, en orden', () => {
  const r = loQueViene(ejemplo(), HOY);
  assert.equal(r.hasta, '2026-12-22');
  assert.deepEqual(r.eventos.map((x) => x.fecha + ' ' + x.nombre), [
    '2026-11-25 Celular', '2026-11-30 Salario', '2026-12-01 Arriendo', '2026-12-05 Cuota Visa', '2026-12-10 Juan',
  ]);
  assert.equal(r.inicial, 1000000);
  // Antes del salario solo sale el celular
  assert.equal(r.pago.fecha, '2026-11-30');
  assert.equal(r.libres, 940000);
  assert.equal(r.diasHasta, 8);
  assert.equal(r.porDiaLibre, 117500);
  // Lo que te deben (30.000 de interés de Juan) se ve pero no entra en el saldo
  assert.equal(r.teDeben, 30000);
  assert.equal(r.porDia.at(-1).saldo, 1000000 - 60000 + 3000000 - 1200000 - 400000);
  assert.equal(r.negativo, null);
});

test('lo ya pagado este mes no sale; un pago vencido cuenta hoy y el salario que no llegó no se cuenta', () => {
  const fin = ejemplo();
  fin.fijos.push({ id: 'gym', nombre: 'Gimnasio', monto: 100000, categoria: 'salud', metodo: 'debito', dia: 15 });
  fin.fijos[0].dia = 20; // el salario debía llegar el 20 y no se registró
  fin.movimientos.push({ id: 'x', fecha: '2026-11-24', tipo: 'gasto', monto: 60000, metodo: 'debito', categoria: 'servicios', fijo: 'cel', creado: 1 });
  const r = loQueViene(fin, HOY);
  const nombres = r.eventos.map((x) => x.fecha + ' ' + x.nombre + (x.vencido ? ' (vencido)' : ''));
  assert.ok(!nombres.some((x) => x.includes('Celular')), 'el celular ya se pagó en noviembre');
  assert.ok(nombres.includes('2026-11-22 Gimnasio (vencido)'));
  assert.ok(nombres.includes('2026-11-22 Salario (vencido)'));
  assert.ok(nombres.includes('2026-12-20 Salario'));
  const salarioVencido = r.eventos.find((x) => x.nombre === 'Salario' && x.vencido);
  assert.equal(salarioVencido.cuenta, false);
  assert.equal(r.pago.fecha, '2026-12-20');
  // Antes del pago: el gimnasio vencido, el arriendo, la tarjeta y el gimnasio de diciembre (el celular registrado el 24 ya bajó el saldo)
  assert.equal(r.inicial, 940000);
  assert.equal(r.libres, 940000 - 100000 - 1200000 - 400000 - 100000);
});

test('un pago vencido anotado a mano o traído del extracto (sin su botón) no se cuenta dos veces', () => {
  const fin = ejemplo();
  fin.movimientos = fin.movimientos.filter((m) => m.id !== 'n1');
  assert.ok(loQueViene(fin, HOY).vencidos.some((x) => x.nombre === 'Arriendo'));
  fin.movimientos.push({ id: 'ex', fecha: '2026-11-02', tipo: 'gasto', monto: 1190000, metodo: 'debito', categoria: 'vivienda', importado: 'extracto' });
  assert.equal(loQueViene(fin, HOY).vencidos.length, 0);
});

test('aviso del primer día en negativo', () => {
  const fin = ejemplo();
  fin.fijos[0].dia = 15; // el salario llega después del arriendo y la tarjeta
  const r = loQueViene(fin, HOY);
  assert.equal(r.negativo.fecha, '2026-12-01');
  assert.equal(r.negativo.saldo, 1000000 - 60000 - 1200000);
});

test('sin cuentas ajustadas no hay saldo, pero la lista sale igual', () => {
  const fin = ejemplo();
  delete fin.metodos.find((m) => m.id === 'debito').ajuste;
  fin.movimientos.push({ id: 'y', fecha: '2026-11-10', tipo: 'gasto', monto: 1000, metodo: 'nequi', categoria: 'comida' });
  const r = loQueViene(fin, HOY);
  assert.equal(r.inicial, null);
  assert.equal(r.libres, null);
  assert.equal(r.negativo, null);
  assert.equal(r.eventos.length, 5);
  assert.deepEqual(saldoHoy(fin).sinAjustar.map((m) => m.id), ['debito', 'nequi']);
});

test('la última cuota de una deuda es lo que queda, y no se repite cuando ya está pagada', () => {
  const fin = ejemplo();
  fin.deudas = [{ id: 'mo', nombre: 'Moto', saldo: 150000, tasa: 0, cuota: 100000, dia: 23 }];
  const r = loQueViene(fin, HOY, 31);
  assert.deepEqual(r.eventos.filter((x) => x.tipo === 'deuda').map((x) => x.fecha + ' ' + x.monto), ['2026-11-23 100000', '2026-12-23 50000']);
});

test('gasto del día a día: solo lo variable pagado con tus cuentas', () => {
  const fin = ejemplo();
  fin.movimientos.push(
    { id: 'a', fecha: '2026-10-03', tipo: 'gasto', monto: 310000, metodo: 'debito', categoria: 'comida' },
    { id: 'b', fecha: '2026-10-04', tipo: 'gasto', monto: 999999, metodo: 'visa', categoria: 'comida' }, // con tarjeta: sale con la cuota
    { id: 'c', fecha: '2026-10-05', tipo: 'gasto', monto: 1200000, metodo: 'debito', categoria: 'vivienda', fijo: 'arr' },
  );
  assert.equal(gastoVariableDia(fin, HOY), 10000);
  // Con 1.000.000 y 10.000 al día de gasto, más los pagos, no se acaba antes del salario
  const r = loQueViene(fin, HOY);
  assert.equal(r.variable, 10000);
  assert.equal(r.seAcaba, null);
  // Con 150.000 al día sí: se acaba antes de que llegue el salario
  fin.movimientos.find((m) => m.id === 'a').monto = 4650000;
  const r2 = loQueViene(fin, HOY);
  assert.ok(r2.seAcaba && r2.seAcaba.fecha < '2026-11-30', JSON.stringify(r2.seAcaba));
});

test('lo que falta por llenar se avisa', () => {
  const fin = FINANZAS();
  fin.fijos = [{ id: 's', tipo: 'ingreso', nombre: 'Salario', monto: 0, dia: 30 }];
  fin.deudas = [{ id: 'd', nombre: 'Tarjeta', saldo: 500000, tasa: 2, cuota: 0, dia: 5 }];
  assert.deepEqual(sinDatos(fin).map((x) => x.nombre + ': ' + x.falta), ['Salario: el monto', 'Tarjeta: la cuota']);
});
