import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FINANZAS } from '../src/datos_finanzas.js';
import { planDe, diaPlan, gastosPorGrupo, colchon, avanceBusqueda, diarioEmociones } from '../src/desempleo.js';

const mov = (fecha, monto, categoria, extra = {}) => ({ id: fecha + categoria + monto, fecha, tipo: 'gasto', monto, categoria, metodo: 'efectivo', ...extra });

test('plan B: el plan se crea con sus metas por defecto y no pisa lo guardado', () => {
  const fin = FINANZAS();
  const p = planDe(fin);
  assert.deepEqual(p.metas, { hojasDia: 3, contactosSemana: 2 });
  p.metas.hojasDia = 5; p.recursos.liquidacion = 1000;
  assert.equal(planDe(fin).metas.hojasDia, 5);
  assert.equal(planDe(fin).recursos.liquidacion, 1000);
  assert.deepEqual(diaPlan(p, '2026-11-13'), { emociones: [], bloques: {} });
});

test('plan B: gastos esenciales y no esenciales, promedio de los meses completos', () => {
  const fin = FINANZAS();
  // octubre y septiembre: vivienda y mercado son necesidad; comida fuera es deseo. El mes actual no cuenta
  fin.movimientos.push(mov('2026-10-05', 1000000, 'vivienda'), mov('2026-10-09', 200000, 'mercado'), mov('2026-10-10', 300000, 'comida'),
    mov('2026-09-05', 1000000, 'vivienda'), mov('2026-09-20', 100000, 'comida'), mov('2026-11-02', 999999, 'comida'));
  const g = gastosPorGrupo(fin, '2026-11-13');
  assert.equal(g.meses, 2);
  assert.equal(g.esenciales, 1100000); // (1.200.000 + 1.000.000) / 2
  assert.equal(g.noEsenciales, 200000); // (300.000 + 100.000) / 2
  // Sin movimientos: lo esencial sale de los pagos fijos y las cuotas
  const vacio = FINANZAS();
  vacio.fijos.push({ id: 'f1', tipo: 'gasto', nombre: 'Arriendo', monto: 900000 }, { id: 'f2', tipo: 'ingreso', nombre: 'Salario', monto: 3000000 });
  vacio.deudas.push({ id: 'd1', saldo: 500000, cuota: 100000 });
  assert.deepEqual(gastosPorGrupo(vacio, '2026-11-13'), { esenciales: 1000000, noEsenciales: 0, meses: 0, desde: 'fijos' });
});

test('plan B: para cuántos meses alcanza, como la tabla de la guía', () => {
  const fin = FINANZAS(), p = planDe(fin);
  p.esenciales = 1200000; p.noEsenciales = 300000; p.recursos.liquidacion = 2000000;
  let c = colchon(fin, p, '2026-11-13');
  assert.equal(c.disponible, 2000000);
  assert.equal(c.diferencia, 500000); // 2.000.000 − 1.200.000 − 300.000
  assert.equal(Math.round(c.mesesNormal * 100) / 100, 1.33);
  assert.equal(Math.round(c.mesesAustero * 100) / 100, 1.67);
  // Un ingreso alternativo baja lo que sale cada mes
  p.ingresosAlt.habitacion = 400000;
  c = colchon(fin, p, '2026-11-13');
  assert.equal(c.mesesAustero, 2.5); // 2.000.000 / (1.200.000 − 400.000)
  // Si el ingreso cubre todo lo esencial, no se acaba
  p.ingresosAlt.habitacion = 1500000;
  assert.equal(colchon(fin, p, '2026-11-13').mesesAustero, Infinity);
  // Sin gastos no se inventa un número
  const otro = FINANZAS(), q = planDe(otro);
  q.recursos.cesantias = 1000;
  assert.equal(colchon(otro, q, '2026-11-13').mesesNormal, null);
});

test('plan B: hojas de vida del día y contactos de la semana (lunes a domingo)', () => {
  const p = planDe(FINANZAS());
  // 13 nov 2026 es viernes: la semana empieza el lunes 9
  diaPlan(p, '2026-11-08').contactos = 5; // domingo anterior: no cuenta
  diaPlan(p, '2026-11-09').hojas = 3; diaPlan(p, '2026-11-09').contactos = 1;
  diaPlan(p, '2026-11-12').hojas = 1;
  diaPlan(p, '2026-11-13').hojas = 4; diaPlan(p, '2026-11-13').contactos = 1;
  const b = avanceBusqueda(p, '2026-11-13');
  assert.equal(b.hojasHoy, 4);
  assert.equal(b.hojasSemana, 8);
  assert.equal(b.contactosSemana, 2);
  assert.equal(b.diasConMeta, 2); // lunes (3) y viernes (4)
  assert.equal(b.diasSemana, 5);
});

test('plan B: diario de emociones, lo más nuevo primero y sin días vacíos', () => {
  const p = planDe(FINANZAS());
  diaPlan(p, '2026-11-10').siento = 'Con miedo';
  diaPlan(p, '2026-11-11');
  diaPlan(p, '2026-11-12').emociones.push('🌱 Esperanza');
  diaPlan(p, '2026-11-20').siento = 'futuro';
  assert.deepEqual(diarioEmociones(p, '2026-11-13').map((x) => x.fecha), ['2026-11-12', '2026-11-10']);
});
