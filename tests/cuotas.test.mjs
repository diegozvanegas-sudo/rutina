import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerCuotas, leerTasa, planCuotas, detalleCompra, tasaDeCargo, porPersona, quienDe, textoPersona, comprasDe, claveCompra } from '../src/cuotas.js';
import { leerExtracto } from '../src/extracto.js';

test('cuotas y tasa dentro de una línea', () => {
  assert.deepEqual(leerCuotas('CARNES 3/12 600.000'), { k: 3, n: 12, texto: '3/12' });
  assert.equal(leerCuotas('cuota 2 de 6').n, 6);
  assert.equal(leerCuotas('NETFLIX 44.900'), null);
  assert.equal(leerCuotas('13/12'), null); // la cuota no puede pasar del total
  assert.equal(leerTasa('1,89 %').mensual, 1.89);
  assert.ok(Math.abs(leerTasa('25,34 % EA').mensual - 1.9) < 0.01); // E.A. → mensual
  assert.ok(Math.abs(leerTasa('25,34').mensual - 1.9) < 0.01);      // más de 6 sin decir: E.A.
  assert.equal(leerTasa('0,00').mensual, 0);                         // sin intereses
  const [rappi] = leerExtracto('08/11/2026 RAPPI 1/3 0,00 90.000,00 30.000,00 60.000,00', { hoy: '2026-11-20', tarjeta: true });
  assert.deepEqual([rappi.desc, rappi.cuotas.tasa, rappi.cuotas.original], ['RAPPI', 0, 90000]);
});

test('plan de una compra: capital igual cada mes e interés sobre lo que falta', () => {
  const p = planCuotas(600000, 12, 2);
  assert.equal(p.length, 12);
  assert.equal(p[0].capital, 50000);
  assert.equal(p[0].interes, 12000);   // 2 % de 600.000
  assert.equal(p[11].interes, 1000);   // 2 % de los últimos 50.000
  assert.equal(p[11].saldo, 0);
  assert.equal(planCuotas(100000, 1, 2)[0].interes, 0); // a una cuota no hay interés
});

test('detalle de la cuota del mes: lo que se paga, lo que falta y lo que cuesta al final', () => {
  const d = detalleCompra({ original: 600000, n: 12, k: 3, tasa: 2 });
  assert.equal(d.capital, 50000);
  assert.equal(d.interes, 10000);      // 2 % de 500.000
  assert.equal(d.mes, 60000);
  assert.equal(d.saldo, 450000);
  assert.equal(d.cuotasFaltan, 9);
  assert.equal(Math.round(d.interesesFaltan), 45000); // 2 % de 450k + 400k + … + 50k
  assert.equal(Math.round(d.interesesTotal), 78000);
  assert.equal(Math.round(d.totalCompra), 678000);
});

test('con el cargo del extracto: manda el del banco y la tasa sale de ahí', () => {
  const c = { original: 600000, n: 12, k: 3, tasa: 0, cargo: 61000 };
  assert.equal(Math.round(tasaDeCargo(c) * 100) / 100, 2.2); // 11.000 de 500.000
  const d = detalleCompra(c);
  assert.equal(d.mes, 61000);
  assert.equal(d.interes, 11000);
  assert.equal(d.tasaDe, 'cargo');
  assert.equal(d.delExtracto, true);
});

test('quién paga: una persona, o dividida por partes iguales', () => {
  const lista = ['Yo', 'Mamá'];
  assert.deepEqual(quienDe({}, lista), ['Yo']);
  assert.deepEqual(quienDe({ quien: ['Mamá', 'Otro'] }, lista), ['Mamá']);
  const compras = [
    { id: 'a', desc: 'CARNES', original: 600000, n: 12, k: 3, tasa: 2, quien: ['Yo', 'Mamá'] },
    { id: 'b', desc: 'NETFLIX', original: 44900, n: 1, k: 1, tasa: 0 },
  ];
  const [yo, mama] = porPersona(compras, lista);
  assert.equal(yo.mes, 30000 + 44900);
  assert.equal(mama.mes, 30000);
  assert.equal(mama.interes, 5000);
  assert.equal(mama.saldo, 225000);
  const t = textoPersona(mama, { tarjeta: 'Visa' });
  assert.match(t, /Mamá\* · Visa/);
  assert.match(t, /Este mes: \*\$ 30\.000\*/);
  assert.match(t, /tu parte: 50 %, con Yo/);
  assert.match(t, /Cuota 3 de 12/);
});

test('del extracto de la tarjeta a las compras, recordando quién paga y lo corregido', () => {
  const t = '02/11/2026 CARNES EL NOVILLO 3/12 1,89 600.000,00 61.340,00 450.000,00\n05/11/2026 NETFLIX 44.900,00\n06/11/2026 PAGO RECIBIDO 500.000,00';
  const movs = leerExtracto(t, { hoy: '2026-11-20', tarjeta: true });
  const carne = movs.find((m) => /CARNES/.test(m.desc));
  assert.deepEqual(carne.cuotas, { k: 3, n: 12, tasa: 1.89, original: 600000 });
  assert.equal(carne.desc, 'CARNES EL NOVILLO');
  const base = comprasDe(movs);
  assert.equal(base.length, 2); // el pago de la tarjeta no es una compra
  const c = base.find((x) => /CARNES/.test(x.desc));
  assert.equal(c.cargo, 61340);
  // Lo guardado para esa compra (quién y la corrección) vuelve en el próximo extracto
  const otra = comprasDe(movs, { guardadas: { [claveCompra(c)]: { quien: ['Mamá'], n: 6 } }, reglas: { netflix: ['Yo', 'Mamá'] } });
  assert.deepEqual(otra.find((x) => /CARNES/.test(x.desc)).quien, ['Mamá']);
  assert.equal(otra.find((x) => /CARNES/.test(x.desc)).n, 6);
  assert.deepEqual(otra.find((x) => /NETFLIX/.test(x.desc)).quien, ['Yo', 'Mamá']);
});
