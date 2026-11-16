// Pierna A y B: el mismo ejercicio en dos días cuenta como la misma sesión; y la meta de varias series sube la más floja
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ultimoRegistro, metaSesion, bajonReps } from '../src/gym.js';

const fila = (id) => ({ id, tipo: 'Series', series: 3, min: 10, max: 15, unidad: 'reps' });
const a = fila('pa-1'), b = fila('pb-1'), otro = fila('x-1');
const rutina = [
  { id: 'lun', ejercicios: [{ id: 'x', nombre: 'Press', filas: [otro] }] },
  { id: 'mie', ejercicios: [{ id: 'pa', nombre: 'Pantorrilla', filas: [a] }] },
  { id: 'sab', ejercicios: [{ id: 'pb', nombre: 'Pantorrilla', filas: [b] }] },
];

test('pierna B toma lo de pierna A de la misma semana', () => {
  const semanas = { 4: { 'pb-1': { peso: '130', reps: '15 15 15' } }, 5: { 'pa-1': { peso: '134', reps: '15 15 15' } } };
  assert.equal(ultimoRegistro(semanas, b, 5, null, rutina).peso, '134');
  // Pierna A no mira lo de pierna B de la misma semana (es después), sino la semana pasada
  assert.equal(ultimoRegistro(semanas, a, 5, null, rutina).peso, '130');
  // Sin rutina, como siempre: solo su propia fila
  assert.equal(ultimoRegistro(semanas, b, 5).peso, '130');
  assert.equal(ultimoRegistro(semanas, a, 5), null);
});

test('en semanas pasadas vale el día más reciente', () => {
  const semanas = { 3: { 'pa-1': { peso: '120', reps: '12 12 12' }, 'pb-1': { peso: '125', reps: '12 12 12' } } };
  assert.equal(ultimoRegistro(semanas, a, 5, null, rutina).peso, '125');
  assert.equal(ultimoRegistro(semanas, otro, 5, null, rutina), null);
});

test('meta de varias series: sube la serie más floja', () => {
  const m = metaSesion(fila('y'), { peso: '91', reps: '13 13 12' });
  assert.equal(m.texto, '91 kg × 13 13 13');
  assert.match(m.motivo, /12 → 13/);
  assert.equal(metaSesion(fila('y'), { peso: '91', reps: '13 13 12', rir: 3 }).texto, '91 kg × 13 13 14');
  // Si faltó una serie, se completa con la última
  assert.equal(metaSesion(fila('y'), { peso: '91', reps: '14 13' }).texto, '91 kg × 14 13 14');
  // Nunca pasa del tope ni queda debajo del mínimo
  assert.equal(metaSesion(fila('y'), { peso: '91', reps: '15 15 14' }).texto, '91 kg × 15 15 15');
  assert.equal(metaSesion(fila('y'), { peso: '91', reps: '8 8 8' }).texto, '91 kg × 10 10 11');
});

test('bajón: la serie cae 30 % o más y aún faltan series', () => {
  const f = { series: 4, min: 8, max: 12 };
  assert.deepEqual(bajonReps(f, { reps: '12 8' }) && [bajonReps(f, { reps: '12 8' }).de, bajonReps(f, { reps: '12 8' }).a], [12, 8]);
  assert.equal(bajonReps(f, { reps: '12 9' }), null);
  assert.equal(bajonReps(f, { reps: '12' }), null);
  // Ya terminó: no hay nada que decidir
  assert.equal(bajonReps(f, { reps: '12 10 8 6' }), null);
});
