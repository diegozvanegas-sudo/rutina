import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unoRM, mejorSerie, historial, records, ultimaSubida, estancamiento, consejoEstancado, progresoMes } from '../src/gym.js';

const fila = (id) => ({ id, series: 1, min: 6, max: 8 });
const ej = (id, nombre = 'Sentadilla', musculo = 'Cuádriceps') => ({ id, nombre, musculo, filas: [fila(id + '-f')] });
const rutina = [{ id: 'pa', ejercicios: [ej('pa-1')] }, { id: 'pb', ejercicios: [ej('pb-1')] }];
const reg = (peso, reps) => ({ peso: String(peso), reps, unidad: 'kg' });

test('1RM estimado (Epley) y mejor serie', () => {
  assert.equal(unoRM(100, 1), 100);
  assert.equal(Math.round(unoRM(60, 10)), 80);
  assert.equal(unoRM(0, 5), null);
  assert.deepEqual(mejorSerie(reg(60, '10 8')), { peso: 60, reps: 10, unidad: 'kg', rm: 80 });
  assert.equal(mejorSerie({ peso: '', reps: '10' }), null);
});

test('el historial junta el mismo ejercicio de pierna A y B y toma lo mejor de la semana', () => {
  const semanas = { 1: { 'pa-1-f': reg(60, '8'), 'pb-1-f': reg(62.5, '8') }, 2: { 'pa-1-f': reg(65, '6') } };
  const h = historial(semanas, rutina, rutina[0].ejercicios[0]);
  assert.deepEqual(h.map((p) => [p.semana, p.peso]), [[1, 62.5], [2, 65]]);
  assert.equal(historial(semanas, rutina, rutina[0].ejercicios[0], 0, 1).length, 1);
  assert.deepEqual(historial({}, [{ ejercicios: [{ nombre: 'Plancha', filas: [{ id: 'p', unidad: 's' }] }] }], { nombre: 'Plancha' }), []);
});

test('récords, última subida y estancamiento', () => {
  const h = [60, 62.5, 62.5, 62.5, 62.5].map((peso, k) => ({ semana: k + 1, peso, reps: 8, unidad: 'kg', rm: unoRM(peso, 8) }));
  assert.deepEqual(records(h).map((p) => p.semana), [2]);
  assert.deepEqual(ultimaSubida(h), { de: 60, a: 62.5, semana: 2, unidad: 'kg' });
  assert.deepEqual([estancamiento(h).semanas, estancamiento(h).estancado], [3, true]);
  assert.equal(estancamiento(h.slice(0, 3)).estancado, false);
  assert.equal(ultimaSubida(h.slice(0, 1)), null);
});

test('consejo: pierna con fútbol, descarga a las 5 semanas, si no cambiar reps', () => {
  assert.match(consejoEstancado(3, { pierna: true, partidosSemana: 2 }), /partidos/);
  assert.match(consejoEstancado(5), /descarga/);
  assert.match(consejoEstancado(3), /rango de reps/);
});

test('progreso del mes: lo más reciente contra hace 4 semanas, ordenado por cambio', () => {
  const r = [{ id: 'd', ejercicios: [ej('a', 'Press'), ej('b', 'Remo', 'Espalda')] }];
  const semanas = { 1: { 'a-f': reg(60, '8'), 'b-f': reg(50, '8') }, 5: { 'a-f': reg(65, '8'), 'b-f': reg(50, '7') } };
  const p = progresoMes(semanas, r, 5);
  assert.deepEqual(p.map((x) => x.nombre), ['Press', 'Remo']);
  assert.ok(p[0].cambio > 0.07 && p[1].cambio < 0);
  assert.equal(progresoMes({ 5: { 'a-f': reg(60, '8') } }, r, 5).length, 0);
});
