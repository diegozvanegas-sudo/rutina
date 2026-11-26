import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALIMENTOS_ETIQUETA } from '../src/datos_etiquetas.js';
import { fichaEtiqueta, nivelSodio, sellos, kcalCalculadas } from '../src/etiqueta-info.js';

const arepa = ALIMENTOS_ETIQUETA.find((a) => a.id === 'arepa-el-carbon');

test('niveles de sodio por 100 g', () => {
  assert.equal(nivelSodio(2).k, 'sin');
  assert.equal(nivelSodio(7.4).k, 'muy-bajo');
  assert.equal(nivelSodio(100).k, 'bajo');
  assert.equal(nivelSodio(250).k, 'moderado');
  assert.equal(nivelSodio(400).k, 'alto');
  assert.equal(nivelSodio(null), null);
});

test('sellos de Colombia: sodio por kcal o por 100 g, azúcar y grasa por % de calorías', () => {
  assert.deepEqual(sellos(arepa), []);
  assert.deepEqual(sellos({ kcal: 100, sodio: 150 }), ['EXCESO EN SODIO']); // 1,5 mg por kcal
  assert.deepEqual(sellos({ kcal: 500, sodio: 320 }), ['EXCESO EN SODIO']); // ≥ 300 mg en 100 g
  assert.deepEqual(sellos({ kcal: 400, azucaresAnadidos: 10 }), ['EXCESO EN AZÚCARES']); // 40 kcal = 10 %
  assert.deepEqual(sellos({ kcal: 400, grasaSat: 3 }), []); // 27 kcal < 10 %
});

test('ficha de la arepa: carbo, sodio muy bajo, sin azúcar añadida, sin sellos, y avisa que la etiqueta no cuadra', () => {
  const f = fichaEtiqueta(arepa);
  const k = (x) => f.puntos.find((p) => p.k === x);
  assert.match(k('plan').titulo, /carbohidrato/);
  assert.match(k('plan').texto, /134 kcal/);
  assert.match(k('plan').texto, /casi no trae proteína/);
  assert.equal(k('sodio').nivel, 'muy-bajo');
  assert.match(k('sodio').texto, /6,5 mg en cada unidad \(88 g\)/);
  assert.match(k('sodio').texto, /menos del 1 %/);
  assert.ok(k('sudor'));
  assert.match(k('azucar').titulo, /sin azúcar añadida/);
  assert.match(k('fibra').titulo, /3,5 g/);
  assert.match(k('sellos').titulo, /No lleva sellos/);
  assert.ok(kcalCalculadas(arepa) > arepa.kcal);
  assert.match(k('cuadra').texto, /152/);
  assert.ok(f.puntos.some((p) => p.titulo === 'Ingredientes'));
  assert.match(f.resumen, /134 kcal · 35,2 g carbos · 6,5 mg sodio en cada unidad/);
});

test('sin marca no hay ficha', () => {
  assert.equal(fichaEtiqueta({ nombre: 'Arroz', kcal: 130 }), null);
  assert.equal(fichaEtiqueta(null), null);
});
