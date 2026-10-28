import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enOrden, visibles, mover, alternar, restablecer } from '../src/orden.js';
import { semanaDe, lunesDe, ponerSemana1, SEMANA_1_INICIAL } from '../src/fechas.js';

// Celular con los datos de antes (una sola clave) que ya sincronizaba el usuario A
const guardado = new Map();
globalThis.localStorage = {
  getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
  setItem: (k, v) => guardado.set(k, String(v)),
  removeItem: (k) => guardado.delete(k),
};
const viejo = { version: 1, hojaAplicada: true, diasV2: true, futbolV1: true, piernasV2: true, nube: { usuario: 'A', base: 1 },
  config: { metas: { agua: 3000, pasos: 8000, calorias: 2000, lectura: 20, pantalla: 90 }, espera: { minimo: 30, ideal: 60 } },
  habitos: [{ id: 'mio', nombre: 'Lo mío', tipo: 'check' }], dias: { '2026-10-20': { habitos: { mio: { ts: 1 } } } } };
guardado.set('rutina_v1', JSON.stringify(viejo));
const est = await import('../src/estado.js');

test('sin saber quién entra no se escribe nada', () => {
  est.esperarUsuario();
  est.guardar(false);
  assert.deepEqual([...guardado.keys()], ['rutina_v1']);
});

test('los datos de antes pasan al usuario que los sincronizaba', () => {
  est.usarUsuario('A');
  assert.equal(est.claveActual(), 'rutina_v1:A');
  assert.equal(est.e().habitos[0].id, 'mio');
  assert.equal(est.e().config.metas.agua, 3000);
  assert.ok(!guardado.has('rutina_v1'));
  // Lo nuevo de la config llega con valores por defecto
  assert.equal(est.e().config.semana1, SEMANA_1_INICIAL);
  assert.deepEqual(est.e().config.sesionesDescanso, ['rodilla', 'estiramiento-post']);
  assert.ok(!est.e().bienvenida);
});

test('otro usuario en el mismo celular arranca aparte y puede empezar vacío', () => {
  est.usarUsuario('B');
  assert.ok(est.e().bienvenida);
  assert.ok(!est.e().habitos.some((h) => h.id === 'mio'));
  est.elegirPlantilla(true);
  assert.deepEqual(est.e().habitos, []);
  assert.deepEqual(est.e().rutina, []);
  assert.deepEqual(est.e().config.futbol, []);
  assert.ok(!('bienvenida' in est.datosParaNube()));
  assert.deepEqual(JSON.parse(guardado.get('rutina_v1:B')).habitos, []);
  // Y A sigue con lo suyo
  est.usarUsuario('A');
  assert.equal(est.e().habitos[0].id, 'mio');
});

test('el total de metas solo cuenta las que están a la vista', () => {
  est.usarUsuario('A');
  const c = est.e().config, fecha = '2026-10-20';
  est.dia(fecha).metas.agua = 3000;
  for (const k of ['pasos', 'calorias', 'lectura', 'pantalla']) alternar(c, 'metas', k);
  const a = est.avanceMetas(fecha);
  assert.deepEqual(a.activas, ['agua']);
  assert.equal(a.total, 1);
  alternar(c, 'metas', 'agua');
  assert.equal(est.avanceMetas(fecha).total, null);
  restablecer(c, 'metas');
});

test('orden: mover, esconder y lo nuevo al final', () => {
  const c = { orden: { menu: ['gym', 'hoy', 'no-existe'] } };
  const ids = enOrden(c, 'menu');
  assert.deepEqual(ids.slice(0, 2), ['gym', 'hoy']);
  assert.ok(!ids.includes('no-existe') && ids.includes('ajustes'));
  assert.ok(mover(c, 'menu', 'hoy', -1));
  assert.deepEqual(enOrden(c, 'menu').slice(0, 2), ['hoy', 'gym']);
  assert.ok(!mover(c, 'menu', 'hoy', -1));
  assert.ok(!alternar(c, 'menu', 'ajustes')); // fija
  assert.ok(alternar(c, 'menu', 'libros'));
  assert.ok(!visibles(c, 'menu').includes('libros'));
});

test('la semana 1 la elige cada usuario (siempre un lunes)', () => {
  ponerSemana1('2026-11-04'); // miércoles → lunes 2 nov
  assert.equal(lunesDe(1), '2026-11-02');
  assert.equal(semanaDe('2026-11-09'), 2);
  ponerSemana1(null);
  assert.equal(lunesDe(1), SEMANA_1_INICIAL);
});
