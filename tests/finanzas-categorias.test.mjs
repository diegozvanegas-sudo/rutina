import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FINANZAS, SUBCATEGORIAS } from '../src/datos_finanzas.js';
import { resumenMes, saldoCuenta, patrimonio, agregarMovimiento, subsDe, subDe, buscarCategorias, frecuentes, posibleDuplicado, valorMeta, aportado } from '../src/finanzas.js';

test('catálogo: cada subcategoría es de una categoría que existe y no se repite', () => {
  const fin = FINANZAS(), ids = new Set([...fin.categorias.gasto, ...fin.categorias.ingreso].map((c) => c.id));
  let total = 0;
  for (const [cat, subs] of Object.entries(SUBCATEGORIAS)) {
    assert.ok(ids.has(cat), cat);
    assert.equal(new Set(subs.map((x) => x.id)).size, subs.length, cat);
    total += subs.length;
  }
  assert.ok(total > 200);
});

test('buscar sin tildes: categoría y subcategoría de un toque', () => {
  const fin = FINANZAS();
  const r = buscarCategorias(fin, 'gasto', 'barberia');
  assert.deepEqual([r[0].categoria, r[0].sub], ['cuidado', 'barberia']);
  assert.ok(buscarCategorias(fin, 'gasto', 'gasolina').some((x) => x.categoria === 'gasolina' && !x.sub));
  assert.ok(buscarCategorias(fin, 'ingreso', 'cesant').some((x) => x.sub === 'cesantias'));
  assert.deepEqual(buscarCategorias(fin, 'gasto', '  '), []);
});

test('subcategorías propias y nombre de una que ya no está', () => {
  const fin = FINANZAS();
  fin.subs.push({ id: 'casco-nuevo', cat: 'transporte', nombre: 'Casco nuevo', icono: '🏷️' });
  assert.ok(subsDe(fin, 'transporte').some((x) => x.id === 'casco-nuevo'));
  assert.equal(subDe(fin, 'transporte', 'algo-viejo').nombre, 'algo viejo');
  assert.equal(subDe(fin, 'transporte', null), null);
});

test('resumen por subcategoría sin cambiar el total de la categoría', () => {
  const fin = FINANZAS();
  agregarMovimiento(fin, { tipo: 'gasto', monto: 30000, categoria: 'transporte', sub: 'peajes' }, '2026-11-02');
  agregarMovimiento(fin, { tipo: 'gasto', monto: 20000, categoria: 'transporte' }, '2026-11-03');
  const r = resumenMes(fin, '2026-11', '2026-11-05');
  assert.equal(r.porCategoria.transporte, 50000);
  assert.deepEqual(r.porSub.transporte, { peajes: 30000 });
});

test('transferencia: mueve el saldo entre cuentas y no es gasto ni ingreso', () => {
  const fin = FINANZAS();
  const nequi = fin.metodos.find((m) => m.id === 'nequi'), debito = fin.metodos.find((m) => m.id === 'debito');
  nequi.ajuste = { monto: 500000, fecha: '2026-11-01', ts: 0 };
  debito.ajuste = { monto: 100000, fecha: '2026-11-01', ts: 0 };
  agregarMovimiento(fin, { tipo: 'transferencia', monto: 200000, metodo: 'nequi', destino: 'debito' }, '2026-11-02');
  assert.equal(saldoCuenta(fin, nequi), 300000);
  assert.equal(saldoCuenta(fin, debito), 300000);
  const r = resumenMes(fin, '2026-11', '2026-11-05');
  assert.deepEqual([r.ingresos, r.gastos, r.ahorro], [0, 0, 0]);
  assert.equal(patrimonio(fin).cuentas, 600000);
});

test('lo que más anotas: lo repetido de los últimos 90 días', () => {
  const fin = FINANZAS();
  for (const d of ['2026-10-01', '2026-10-10', '2026-11-01']) agregarMovimiento(fin, { tipo: 'gasto', monto: 20000, categoria: 'gasolina', sub: 'corriente' }, d);
  agregarMovimiento(fin, { tipo: 'gasto', monto: 9000, categoria: 'comida' }, '2026-11-01');
  agregarMovimiento(fin, { tipo: 'gasto', monto: 9000, categoria: 'ocio' }, '2026-01-01');
  agregarMovimiento(fin, { tipo: 'gasto', monto: 9000, categoria: 'ocio' }, '2026-01-02');
  assert.deepEqual(frecuentes(fin, 'gasto', '2026-11-05'), [{ categoria: 'gasolina', sub: 'corriente' }]);
});

test('posible duplicado: mismo monto, categoría y día', () => {
  const fin = FINANZAS();
  agregarMovimiento(fin, { tipo: 'gasto', monto: 15000, categoria: 'comida' }, '2026-11-05');
  assert.ok(posibleDuplicado(fin, { tipo: 'gasto', monto: 15000, categoria: 'comida', fecha: '2026-11-05' }));
  assert.equal(posibleDuplicado(fin, { tipo: 'gasto', monto: 15000, categoria: 'comida', fecha: '2026-11-04' }), null);
  assert.equal(posibleDuplicado(fin, { tipo: 'gasto', monto: 15000, categoria: 'ocio', fecha: '2026-11-05' }), null);
});

test('inversión: el valor anotado más lo que se aporta después entra al patrimonio', () => {
  const fin = FINANZAS();
  const cdt = { id: 'cdt', nombre: 'CDT', icono: '🏦', objetivo: 0, inversion: 'si' };
  fin.metas.push(cdt);
  agregarMovimiento(fin, { tipo: 'ahorro', monto: 1000000, meta: 'cdt' }, '2026-10-01');
  assert.equal(valorMeta(fin, cdt), 1000000);
  cdt.valor = { monto: 1050000, fecha: '2026-11-01', ts: Date.now() };
  const m = agregarMovimiento(fin, { tipo: 'ahorro', monto: 100000, meta: 'cdt' }, '2026-11-03');
  assert.ok(m);
  assert.equal(valorMeta(fin, cdt), 1150000);
  assert.equal(aportado(fin, 'cdt'), 1100000);
  assert.equal(patrimonio(fin).ahorro, 1150000);
});
