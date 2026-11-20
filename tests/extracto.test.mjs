import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerValor, leerFecha, claveDe, categorizar, leerExtracto, analizar, consejos, yaAnotado } from '../src/extracto.js';

test('montos en formato colombiano y gringo, con signo', () => {
  assert.equal(leerValor('25.000'), 25000);
  assert.equal(leerValor('$ 1.234.567'), 1234567);
  assert.equal(leerValor('25.000,50'), 25000.5);
  assert.equal(leerValor('25,000.50'), 25000.5);
  assert.equal(leerValor('-45.900,00'), -45900);
  assert.equal(leerValor('(12.000)'), -12000);
  assert.equal(leerValor('12.000-'), -12000);
  assert.equal(leerValor('1500,5'), 1500.5);
  assert.equal(leerValor('hola'), null);
  assert.equal(leerValor(''), null);
});

test('fechas: completas, con mes en letras y sin año', () => {
  assert.equal(leerFecha('12/11/2026 COMPRA').fecha, '2026-11-12');
  assert.equal(leerFecha('2026-11-03 x').fecha, '2026-11-03');
  assert.equal(leerFecha('05-11-26 x').fecha, '2026-11-05');
  assert.equal(leerFecha('3 nov 2026 x').fecha, '2026-11-03');
  assert.equal(leerFecha('03 NOV. DE 2026').fecha, '2026-11-03');
  assert.equal(leerFecha('12/11 COMPRA', { anioBase: 2026 }).fecha, '2026-11-12');
  // Sin año y en el futuro: es del año anterior
  assert.equal(leerFecha('28/12 COMPRA', { anioBase: 2026, hoy: '2026-11-20' }).fecha, '2025-12-28');
  assert.equal(leerFecha('sin fecha'), null);
});

test('clave del comercio y categorías', () => {
  assert.equal(claveDe('COMPRA EN D1 SUC 234 BOGOTA'), 'd1 suc');
  assert.equal(claveDe('PAGO PSE NETFLIX.COM'), 'netflix com');
  assert.equal(categorizar('COMPRA EN TERPEL CALLE 80', 'gasto').categoria, 'gasolina');
  assert.equal(categorizar('RAPPI COLOMBIA', 'gasto').categoria, 'comida');
  assert.deepEqual(categorizar('CUOTA DE MANEJO TARJETA', 'gasto'), { categoria: 'deudas', sub: 'cuota-de-manejo' });
  assert.equal(categorizar('GMF 4X1000', 'gasto').categoria, 'impuestos');
  assert.equal(categorizar('PAGO NOMINA EMPRESA', 'ingreso').categoria, 'salario');
  assert.equal(categorizar('XYZ RARO', 'gasto').categoria, 'otros');
  // Lo aprendido gana
  assert.deepEqual(categorizar('XYZ RARO', 'gasto', { 'xyz raro': 'ocio' }), { categoria: 'ocio', sub: undefined });
});

const BANCOLOMBIA = `EXTRACTO CUENTA DE AHORROS
Página 1 de 2
FECHA DESCRIPCIÓN SUCURSAL DCTO. VALOR SALDO
SALDO ANTERIOR 1.500.000,00
01/11 PAGO NOMINA ACME SAS 3.000.000,00 4.500.000,00
02/11 COMPRA EN D1 SUC 234 -85.400,00 4.414.600,00
03/11 COMPRA EN TERPEL CALLE 80 -120.000,00 4.294.600,00
03/11 PAGO PSE NETFLIX.COM -44.900,00 4.249.700,00
05/11 CUOTA DE MANEJO -18.500,00 4.231.200,00
05/11 GMF 4X1000 -1.200,00 4.230.000,00
07/11 COMPRA EN RAPPI -32.000,00 4.198.000,00
07/11 COMPRA EN RAPPI -32.000,00 4.166.000,00
10/11 PAGO TARJETA CREDITO VISA -900.000,00 3.266.000,00
15/11 COMPRA EN ALKOSTO -1.200.000,00 2.066.000,00
SALDO FINAL 2.066.000,00
Página 2 de 2`;

test('extracto en texto (Bancolombia): valor y saldo, internos y ya anotados', () => {
  const movs = leerExtracto(BANCOLOMBIA, { hoy: '2026-11-20', movimientos: [{ id: 'm1', tipo: 'gasto', monto: 120000, fecha: '2026-11-04' }] });
  assert.equal(movs.length, 10);
  const [nomina, d1] = movs;
  assert.deepEqual([nomina.fecha, nomina.tipo, nomina.monto, nomina.categoria], ['2026-11-01', 'ingreso', 3000000, 'salario']);
  assert.deepEqual([d1.tipo, d1.monto, d1.categoria, d1.desc], ['gasto', 85400, 'mercado', 'COMPRA EN D1 SUC 234']);
  const terpel = movs.find((m) => /TERPEL/.test(m.desc));
  assert.equal(terpel.ya, 'm1');
  assert.equal(terpel.pasar, false);
  const tarjeta = movs.find((m) => /TARJETA/.test(m.desc));
  assert.equal(tarjeta.interno, true);
  assert.equal(tarjeta.pasar, false);
  assert.equal(movs.find((m) => /MANEJO/.test(m.desc)).banco, true);
});

test('sin signo: el saldo dice si entró o salió plata', () => {
  const t = 'SALDO ANTERIOR 100.000,00\n01/11/2026 MOVIMIENTO UNO 20.000,00 80.000,00\n02/11/2026 MOVIMIENTO DOS 50.000,00 130.000,00';
  const movs = leerExtracto(t, { hoy: '2026-11-20' });
  // El primero no tiene saldo anterior leído en una línea con fecha: sin signo ni palabra de ingreso, gasto
  assert.deepEqual(movs.map((m) => m.tipo), ['gasto', 'ingreso']);
});

test('análisis: cobros del banco, repetidos, cobro doble, gastos grandes y consejos', () => {
  const a = analizar(leerExtracto(BANCOLOMBIA, { hoy: '2026-11-20' }));
  assert.equal(a.ingresos, 3000000);
  assert.equal(a.gastos, 85400 + 120000 + 44900 + 18500 + 1200 + 32000 * 2 + 1200000); // sin el pago de la tarjeta
  assert.equal(a.banco.total, 19700);
  assert.equal(a.dobles.length, 1);
  assert.equal(a.repetidos[0].veces, 2);
  assert.equal(a.grandes[0].monto, 1200000);
  assert.equal(a.internos, 1);
  const c = consejos(a);
  assert.match(c[0], /cobro doble/);
  assert.match(c.join(' '), /4x1000/);
});

test('extracto en CSV con débito y crédito (Nequi, Davivienda)', () => {
  const csv = 'Fecha;Descripción;Débito;Crédito;Saldo\n2026-11-02;Recibiste de Juan;;50.000;150.000\n2026-11-03;Pago en Cinemark;24.000;;126.000\n2026-11-04;Claro hogar;89.900;;36.100';
  const movs = leerExtracto(csv, { hoy: '2026-11-20' });
  assert.deepEqual(movs.map((m) => [m.tipo, m.monto, m.categoria]), [['ingreso', 50000, 'otro-ingreso'], ['gasto', 24000, 'ocio'], ['gasto', 89900, 'celular']]);
});

test('CSV con una sola columna de valor con signo', () => {
  const csv = 'fecha,descripcion,valor\n03/11/2026,"UBER TRIP",-15.300\n04/11/2026,"Transferencia recibida",200.000';
  const movs = leerExtracto(csv, { hoy: '2026-11-20' });
  assert.deepEqual(movs.map((m) => [m.fecha, m.tipo, m.monto, m.categoria]), [['2026-11-03', 'gasto', 15300, 'transporte'], ['2026-11-04', 'ingreso', 200000, 'otro-ingreso']]);
});

test('extracto de tarjeta de crédito: compras sin signo son gastos, el pago no se pasa', () => {
  const t = '05/11/2026 AMAZON PRIME 14.900,00\n08/11/2026 SMART FIT 99.900,00\n10/11/2026 PAGO RECIBIDO GRACIAS 900.000,00';
  const movs = leerExtracto(t, { hoy: '2026-11-20', tarjeta: true });
  assert.deepEqual(movs.map((m) => [m.tipo, m.categoria, m.pasar]), [['gasto', 'suscripciones', true], ['gasto', 'gym', true], ['ingreso', 'otro-ingreso', false]]);
});

test('ya anotado: mismo tipo y monto a 3 días o menos', () => {
  const ya = [{ id: 'a', tipo: 'gasto', monto: 1000, fecha: '2026-11-01' }];
  assert.equal(yaAnotado({ tipo: 'gasto', monto: 1000, fecha: '2026-11-04' }, ya), 'a');
  assert.equal(yaAnotado({ tipo: 'gasto', monto: 1000, fecha: '2026-11-05' }, ya), null);
  assert.equal(yaAnotado({ tipo: 'ingreso', monto: 1000, fecha: '2026-11-01' }, ya), null);
});

test('lo que se repite cada mes con el mismo valor parece suscripción; dos el mismo día no', () => {
  const t = '05/09/2026 SPOTIFY -16.900\n05/10/2026 SPOTIFY -16.900\n05/11/2026 SPOTIFY -16.900\n07/11/2026 COMPRA EN RAPPI -32.000\n07/11/2026 COMPRA EN RAPPI -32.000';
  const c = consejos(analizar(leerExtracto(t, { hoy: '2026-11-20' }))).join(' ');
  assert.match(c, /Se repite cada mes un cobro casi igual \(SPOTIFY\)/);
  assert.doesNotMatch(c, /RAPPI\)/);
  assert.match(c, /cobro doble/);
});
