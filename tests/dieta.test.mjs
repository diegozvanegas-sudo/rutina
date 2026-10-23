import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALIMENTOS, PLANES, CONFIG_DIETA } from '../src/datos_dieta.js';
import { totalPlan, totalComida, tipoDeDia, objetivo, recalcular, pesos, tendencia } from '../src/dieta.js';

const kcal = (tipo) => Math.round(totalPlan(PLANES[tipo], ALIMENTOS).kcal);
const prot = (tipo) => Math.round(totalPlan(PLANES[tipo], ALIMENTOS).p);

// Descanso: la hoja decía ~1.985 de total, pero sus filas suman 1.785
test('los planes suman lo mismo que las filas de la hoja (±15 kcal, ±2 g de proteína)', () => {
  for (const [tipo, k, p] of [['inferior', 2430, 189], ['superior', 2120, 182], ['descanso', 1785, 179]]) {
    assert.ok(Math.abs(kcal(tipo) - k) <= 15, tipo + ': ' + kcal(tipo) + ' kcal');
    assert.ok(Math.abs(prot(tipo) - p) <= 2, tipo + ': ' + prot(tipo) + ' g');
  }
  assert.equal(Math.round(totalComida(PLANES.inferior.comidas[0], ALIMENTOS).kcal), 713); // huevos + avena + café
});

test('plan según el día del gym', () => {
  assert.equal(tipoDeDia({ calentamiento: 'pierna' }), 'inferior');
  assert.equal(tipoDeDia({ calentamiento: 'empuje' }), 'superior');
  assert.equal(tipoDeDia(null), 'descanso');
});

test('el objetivo con 87 kg es el del plan de partida', () => {
  assert.deepEqual(objetivo(CONFIG_DIETA, 'inferior', 87), { kcal: 2427, p: 189 });
});

test('recalcular con menos peso: menos calorías, proteína según el peso y cantidades redondeadas', () => {
  const obj = objetivo(CONFIG_DIETA, 'inferior', 80);
  const r = recalcular(PLANES.inferior, ALIMENTOS, obj);
  assert.ok(Math.abs(r.despues.kcal - obj.kcal) <= 60, 'kcal ' + Math.round(r.despues.kcal) + ' vs ' + obj.kcal);
  assert.ok(Math.abs(r.despues.p - obj.p) <= 8, 'proteína ' + Math.round(r.despues.p) + ' vs ' + obj.p);
  const items = r.plan.comidas.flatMap((c) => c.items);
  const cant = (id) => items.filter((i) => i.alimento === id).map((i) => i.cant);
  assert.ok(cant('huevo').every(Number.isInteger));                         // huevos enteros
  assert.ok(cant('arroz').every((n) => n % 5 === 0));                       // gramos de 5 en 5
  assert.deepEqual(cant('almendras'), [10]);                                // la grasa no se toca
  assert.equal(PLANES.inferior.comidas[1].items[0].cant, 250);              // el plan original no cambia
});

test('peso: lista ordenada y promedio de los últimos 7', () => {
  const dias = { '2026-10-20': { peso: 87 }, '2026-10-21': {}, '2026-10-22': { peso: 86 }, '2026-10-19': { peso: 88 } };
  assert.deepEqual(pesos(dias).map((x) => x.peso), [88, 87, 86]);
  assert.equal(tendencia(pesos(dias)), 87);
});
