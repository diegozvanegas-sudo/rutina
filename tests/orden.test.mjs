import { test } from 'node:test';
import assert from 'node:assert/strict';
import { colocar, enOrden, visibles, alternar, restablecer } from '../src/orden.js';

test('colocar: pone la sección antes de otra o al final, sin perder ninguna', () => {
  const c = {}, total = enOrden(c, 'menu').length;
  assert.ok(colocar(c, 'menu', 'gym', 'hoy'));
  assert.equal(enOrden(c, 'menu')[0], 'gym');
  assert.ok(colocar(c, 'menu', 'gym'));
  assert.equal(enOrden(c, 'menu').at(-1), 'gym');
  assert.equal(enOrden(c, 'menu').length, total);
  assert.equal(new Set(enOrden(c, 'menu')).size, total);
});

test('colocar: un id que no existe no cambia nada', () => {
  const c = {};
  assert.equal(colocar(c, 'menu', 'no-existe', 'hoy'), false);
  assert.equal(c.orden, undefined);
});

test('colocar respeta lo escondido, y restablecer vuelve a como venía', () => {
  const c = {}, antes = enOrden(c, 'menu');
  alternar(c, 'menu', 'lugares');
  colocar(c, 'menu', 'lugares', 'hoy');
  assert.equal(enOrden(c, 'menu')[0], 'lugares');
  assert.ok(!visibles(c, 'menu').includes('lugares'));
  restablecer(c, 'menu');
  assert.deepEqual(enOrden(c, 'menu'), antes);
});

test('una sección nueva aparece debajo de su vecina en un menú ya ordenado, no al final', () => {
  const c = { orden: { menu: ['hoy', 'manana', 'finanzas', 'dieta', 'gym', 'editar', 'ajustes'] } };
  const ids = enOrden(c, 'menu');
  assert.equal(ids[ids.indexOf('finanzas') + 1], 'compras');
  assert.equal(new Set(ids).size, ids.length);
  // Si la moviste a otro lado, se respeta
  const c2 = { orden: { menu: ['compras', 'hoy', 'finanzas'] } };
  assert.equal(enOrden(c2, 'menu')[0], 'compras');
  assert.equal(enOrden(c2, 'menu').filter((x) => x === 'compras').length, 1);
});
