import { test } from 'node:test';
import assert from 'node:assert/strict';
import { semanaPlan, faseDe, gastoEstimado, pesoEsperado, tocaSubir, casaHecha, proximoLunes, avancePruebas, CASA, plan12, nivelDe } from '../src/plan12.js';
import { estadoGym } from '../src/entrenador.js';
import { e } from '../src/estado.js';

test('semana del plan y su fase: base, progresión, descarga en la 9, intensificación', () => {
  const p = { inicio: '2026-11-16' };
  assert.equal(semanaPlan(p, '2026-11-15'), null);
  assert.equal(semanaPlan(p, '2026-11-16'), 1);
  assert.equal(semanaPlan(p, '2026-11-22'), 1);
  assert.equal(semanaPlan(p, '2026-11-23'), 2);
  assert.deepEqual([1, 4, 5, 8, 9, 10, 12].map((s) => faseDe(s).id), ['base', 'base', 'progresion', 'progresion', 'descarga', 'intensificacion', 'intensificacion']);
  assert.equal(semanaPlan({ inicio: '' }, '2026-11-16'), null);
});

test('el plan empieza el próximo lunes (hoy si ya es lunes)', () => {
  assert.equal(proximoLunes('2026-11-12'), '2026-11-16'); // jueves
  assert.equal(proximoLunes('2026-11-16'), '2026-11-16');
  assert.equal(proximoLunes('2026-11-15'), '2026-11-16'); // domingo
});

test('gasto estimado: Mifflin-St Jeor × 1,6', () => {
  assert.deepEqual(gastoEstimado({ peso: 87, estatura: 168, edad: 31, sexo: 'H' }), { basal: 1770, total: 2832 });
  assert.equal(gastoEstimado({ peso: 87, estatura: 168, edad: 31, sexo: 'M' }).basal, 1604);
  assert.equal(gastoEstimado({ peso: null, estatura: 168, edad: 31 }), null);
});

test('peso esperado: 0,4 a 0,75 kg por semana y la descarga no cuenta', () => {
  const r = pesoEsperado(87, 12);
  assert.equal(Math.round(r.max * 10) / 10, 82.6);
  assert.equal(Math.round(r.min * 10) / 10, 78.8);
  assert.equal(pesoEsperado(null, 4), null);
});

test('en casa: subir de variante cuando todas las series llegan al tope', () => {
  const dom = CASA.tiron.ejercicios[0]; // 4 × 5-10
  assert.equal(tocaSubir(dom, '10 10 10 10'), true);
  assert.equal(tocaSubir(dom, '10 10 9 10'), false);
  assert.equal(tocaSubir(dom, '10 10 10'), false);
  assert.equal(tocaSubir(dom, ''), false);
  assert.equal(nivelDe(dom, { nivel: {} }), 1);
  assert.equal(nivelDe(dom, { nivel: { dom: 3 } }), 3);
});

test('sesión en casa: cuenta con una reps anotada y el día del gym queda hecho', () => {
  assert.equal(casaHecha('2026-11-10', { casa: { '2026-11-10': { tipo: 'tiron', 'v:dom': 1 } } }), false);
  assert.equal(casaHecha('2026-11-10', { casa: { '2026-11-10': { tipo: 'tiron', dom: '8 7 6 6' } } }), true);
  // Martes 10 nov: toca Tirón en el gym. Sin nada anotado faltó; con la sesión en casa, hecho
  assert.equal(estadoGym('2026-11-10', '2026-11-12'), 'falto');
  plan12().casa['2026-11-10'] = { tipo: 'tiron', dom: '8 7 6 6' };
  assert.equal(estadoGym('2026-11-10', '2026-11-12'), 'hecho');
  delete e().plan12.casa['2026-11-10'];
});

test('avance de las revisiones: primera contra última', () => {
  const av = avancePruebas({ pruebas: [{ semana: 4, dominadas: 8, cintura: 94 }, { semana: 1, dominadas: 5, cintura: 97, plancha: 40 }] });
  assert.deepEqual(av.map((x) => [x.k, x.dif]), [['dominadas', 3], ['cintura', -3]]);
  assert.deepEqual(avancePruebas({ pruebas: [{ semana: 1, dominadas: 5 }] }), []);
});
