import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SESIONES } from '../src/datos_iniciales.js';
import { LIBROS } from '../src/libros/index.js';
import { POSES, figura, tieneFigura, esFisico, urlVideo } from '../src/figuras.js';

const pasos = [...SESIONES, ...LIBROS.flatMap((l) => l.sesiones || [])].flatMap((s) => s.pasos);

test('cada ejercicio de las sesiones tiene su figura', () => {
  const faltan = [...new Set(pasos.map((p) => p.nombre))].filter((n) => !tieneFigura(n));
  assert.deepEqual(faltan, []);
});

test('las figuras se dibujan sin números inválidos y se animan', () => {
  for (const k of Object.keys(POSES)) {
    const svg = figura(k), quieta = figura(k, { animar: false });
    assert.ok(svg.startsWith('<svg'), k);
    assert.ok(!/NaN|undefined|Infinity/.test(svg + quieta), k + ' tiene valores inválidos');
    if (POSES[k].poses && POSES[k].poses.length > 1) assert.ok(svg.includes('<animate'), k + ' no se mueve');
    assert.ok(!quieta.includes('<animate') || POSES[k].respira, k + ' en lista debe quedar quieta');
  }
  assert.equal(figura('Ejercicio inventado'), '');
});

test('video solo para ejercicios físicos', () => {
  assert.ok(esFisico('Gato-vaca'));
  assert.ok(esFisico('Ejercicio inventado')); // uno agregado a mano: sin figura pero con video
  assert.ok(!esFisico('Respiración 4-4-8'));
  assert.ok(!esFisico('Cuello'));
  assert.match(urlVideo('Gato-vaca'), /^https:\/\/www\.youtube\.com\/results\?search_query=Gato-vaca/);
});
