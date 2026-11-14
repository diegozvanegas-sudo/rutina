import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { BANCO, ZONAS, NIVELES, pasoDeBanco, fotosDe } from '../src/banco.js';
import { figura, figuraPaso } from '../src/figuras.js';

test('cada ejercicio del banco está completo y en una zona', () => {
  const nombres = new Set();
  for (const x of BANCO) {
    assert.ok(ZONAS[x.z], x.n + ': zona');
    assert.ok(NIVELES[x.nv], x.n + ': nivel');
    for (const k of ['m', 'para', 'como', 'ojo', 'facil', 'dificil']) assert.ok(x[k], x.n + ': falta ' + k);
    assert.ok(x.d.reps || x.d.seg, x.n + ': dosis');
    assert.ok(!nombres.has(x.n), x.n + ' repetido'); nombres.add(x.n);
  }
  assert.ok(BANCO.length >= 40);
});

test('cada ejercicio del banco tiene dibujo o foto, y las fotos existen', () => {
  for (const x of BANCO) {
    const dibujo = x.figura === '-' ? '' : figura(x.figura || x.n);
    assert.ok(dibujo || x.foto, x.n + ' sin imagen');
    for (const f of fotosDe(x)) assert.ok(existsSync(new URL('../public/' + f, import.meta.url)), 'falta ' + f);
  }
});

test('del banco a una sesión: el paso guiado trae dosis e imagen', () => {
  const nordico = pasoDeBanco(BANCO.find((x) => x.n === 'Curl nórdico'));
  assert.equal(nordico.series, 3); assert.equal(nordico.reps, '4-6');
  assert.ok(figuraPaso(nordico).startsWith('<svg')); // tiene dibujo: se usa el dibujo
  const plancha = pasoDeBanco(BANCO.find((x) => x.n === 'Plancha lateral'));
  assert.equal(plancha.seg, 25); assert.ok(plancha.lados);
  assert.match(figuraPaso(plancha), /^<img class="figura foto-paso" src="banco\/side-bridge-0\.webp"/); // sin dibujo: la foto
  assert.equal(figuraPaso({ nombre: 'X', figura: '-', imagen: 'https://malo.com/a.webp' }), ''); // solo fotos del banco
});
