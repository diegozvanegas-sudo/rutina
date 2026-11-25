import { test } from 'node:test';
import assert from 'node:assert/strict';
import { momento, repartirAhora } from '../src/hoy-ahora.js';

const base = { hora: 15, dia: 3, hecho: {}, gymHoy: false, invita: {} };
test('lo hecho va en fichas ✓', () => {
  assert.equal(momento('manana', { ...base, hora: 8, hecho: { manana: true } }), 'hecho');
});
test('la primera hora solo se ve en la mañana', () => {
  assert.equal(momento('manana', { ...base, hora: 8 }), 'ahora');
  assert.equal(momento('manana', { ...base, hora: 15 }), 'luego');
});
test('el gym se ve si toca gym o fútbol hoy', () => {
  assert.equal(momento('gym', base), 'luego');
  assert.equal(momento('gym', { ...base, gymHoy: true }), 'ahora');
});
test('el trabajo, entre semana en horas de trabajo', () => {
  assert.equal(momento('trabajo', { ...base, dia: 3, hora: 10 }), 'ahora');
  assert.equal(momento('trabajo', { ...base, dia: 0, hora: 10 }), 'luego');
  assert.equal(momento('trabajo', { ...base, dia: 3, hora: 20 }), 'luego');
});
test('una tarjeta que solo invita a empezar va detrás de Ver todo', () => {
  assert.equal(momento('experimento', { ...base, invita: { experimento: true } }), 'luego');
  assert.equal(momento('experimento', base), 'ahora');
});
test('una tarjeta nueva que no conoce se ve', () => {
  assert.equal(momento('nueva', base), 'ahora');
});
test('reparte en el orden del usuario', () => {
  const r = repartirAhora(['plata', 'control', 'manana', 'gym'], { ...base, hora: 9, hecho: { manana: true }, gymHoy: true });
  assert.deepEqual(r, { ahora: ['control', 'gym'], hecho: ['manana'], luego: ['plata'] });
});
