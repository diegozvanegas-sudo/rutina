import { test } from 'node:test';
import assert from 'node:assert/strict';
import { idsAbajo, alternarAbajo } from '../src/barra-abajo.js';

const todas = ['hoy', 'calendario', 'gym', 'dieta', 'finanzas', 'notas'];

test('sin elegir: Hoy, Gym, Dieta y Finanzas', () => {
  assert.deepEqual(idsAbajo({}, todas), ['hoy', 'gym', 'dieta', 'finanzas']);
});
test('si no puede abrir alguna, completa con las de su menú', () => {
  assert.deepEqual(idsAbajo({}, ['hoy', 'calendario', 'notas', 'gym']), ['hoy', 'gym', 'calendario', 'notas']);
  assert.deepEqual(idsAbajo(undefined, ['hoy']), ['hoy']);
});
test('las elegidas, en su orden y sin las que ya no puede abrir', () => {
  assert.deepEqual(idsAbajo({ abajo: ['notas', 'ventas', 'hoy'] }, todas), ['notas', 'hoy']);
  assert.deepEqual(idsAbajo({ abajo: [] }, todas), []);
});
test('poner y quitar: nunca más de 4', () => {
  const b = {};
  assert.deepEqual(alternarAbajo(b, todas, 'gym'), ['hoy', 'dieta', 'finanzas']);
  assert.deepEqual(alternarAbajo(b, todas, 'notas'), ['hoy', 'dieta', 'finanzas', 'notas']);
  assert.deepEqual(alternarAbajo(b, todas, 'calendario'), ['hoy', 'dieta', 'finanzas', 'calendario']);
  assert.deepEqual(b.abajo, ['hoy', 'dieta', 'finanzas', 'calendario']);
});
