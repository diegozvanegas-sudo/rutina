import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRACTICAS, MOMENTOS, hechosHoy, marcar, favoritos, alternarFavorito, racha, masHechas, momentoDe, unaParaAhora } from '../src/energia.js';
import { e, empezarDePrueba } from '../src/estado.js';
import { sumarDias, iso } from '../src/fechas.js';
empezarDePrueba(true);

test('catálogo: las 8 del video y más de 30 nuevas, completas y sin repetir', () => {
  const video = PRACTICAS.filter((x) => x.video), nuevas = PRACTICAS.filter((x) => !x.video);
  assert.equal(video.length, 8);
  assert.deepEqual(video.map((x) => x.video), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.ok(nuevas.length > 30, nuevas.length + ' nuevas');
  assert.equal(new Set(PRACTICAS.map((x) => x.id)).size, PRACTICAS.length);
  for (const x of PRACTICAS) {
    assert.ok(x.t && x.ic && x.porque && x.pasos.length && x.min > 0, x.id);
    assert.ok(x.m.length && x.m.every((m) => m in MOMENTOS), x.id);
  }
  // Cada momento del día tiene de dónde elegir
  for (const m of Object.keys(MOMENTOS)) assert.ok(PRACTICAS.filter((x) => x.m.includes(m)).length >= 5, m);
});

test('lo que el video dice mal lleva su "Ojo" (la ira con la almohada y la pineal)', () => {
  const ira = PRACTICAS.find((x) => x.id === 'ira'), sol = PRACTICAS.find((x) => x.id === 'sol');
  assert.match(ira.ojo, /almohada/);
  assert.match(ira.ojo, /al revés/);
  assert.match(sol.ojo, /pineal/);
  assert.ok(!/golpea/i.test(ira.pasos.join(' ')));
});

test('marcar, favoritas y racha', () => {
  const hoy = iso();
  assert.deepEqual(hechosHoy(hoy), []);
  assert.equal(marcar('tararear', hoy), true);
  assert.equal(marcar('suspiro', sumarDias(hoy, -1)), true);
  assert.equal(marcar('suspiro', sumarDias(hoy, -2)), true);
  assert.deepEqual(hechosHoy(hoy), ['tararear']);
  assert.equal(racha(hoy), 3);
  assert.equal(marcar('tararear', hoy), false); // tocar de nuevo la desmarca
  assert.equal(racha(hoy), 2);                 // sin nada hoy cuenta hasta ayer
  assert.equal(masHechas(hoy)[0].id, 'suspiro');
  assert.equal(masHechas(hoy)[0].veces, 2);
  assert.equal(alternarFavorito('sol'), true);
  assert.deepEqual(favoritos(), ['sol']);
  assert.equal(alternarFavorito('sol'), false);
  assert.ok(e().dias[sumarDias(hoy, -1)].energia.suspiro);
});

test('una para ahora: según la hora y sin repetir lo que ya hiciste', () => {
  assert.equal(momentoDe(6), 'despertar');
  assert.equal(momentoDe(9), 'manana');
  assert.equal(momentoDe(15), 'tarde');
  assert.equal(momentoDe(18), 'entreno');
  assert.equal(momentoDe(23), 'noche');
  assert.equal(momentoDe(2), 'noche');
  const noche = PRACTICAS.filter((x) => x.m.includes('noche')).map((x) => x.id);
  for (const azar of [0, 0.3, 0.99]) {
    const x = unaParaAhora(22, ['478'], azar);
    assert.ok(noche.includes(x.id));
    assert.notEqual(x.id, '478');
  }
});
