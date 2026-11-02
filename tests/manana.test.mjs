import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e, racha, habitosDe, mananaCompleta, fraccionManana, celdaHabito, ponerTextoHabito, textoHabito, pastillaDe } from '../src/estado.js';
import { puntajeDia } from '../src/progreso.js';

test('hábitos propios: texto de cada uno, pastilla por tipo y lista vacía sin romper la racha', () => {
  const est = e(), guardados = est.habitos;
  est.habitos = [{ id: 'hx', nombre: 'Leer 10 min', tipo: 'texto' }, { id: 'hp', nombre: 'Vitamina', tipo: 'pastilla' }, { id: 'agradecer', nombre: 'Agradecer', tipo: 'texto' }];
  const d = { habitos: { hp: { ts: 5 } }, metas: {}, crono: {} };
  ponerTextoHabito(d, est.habitos[0], 'Fénix cap. 2');
  ponerTextoHabito(d, est.habitos[2], 'familia');
  assert.equal(textoHabito(d, est.habitos[0]), 'Fénix cap. 2');
  assert.equal(d.gratitud, 'familia'); // agradecer sigue en la columna Gratitud
  assert.equal(celdaHabito(d, est.habitos[0]), 'Fénix cap. 2');
  assert.equal(celdaHabito(d, est.habitos[2]), '');
  assert.equal(pastillaDe(d).ts, 5);

  est.habitos = [];
  est.dias['2026-10-24'] = { habitos: {}, metas: { agua: 0, pasos: 0, calorias: 0, lectura: 0 }, crono: {} };
  assert.equal(mananaCompleta('2026-10-24'), false);
  assert.equal(racha('2026-10-24'), 0);
  assert.equal(fraccionManana('2026-10-24'), 0);
  assert.equal(puntajeDia('2026-10-24').partes.manana, undefined);
  est.habitos = guardados;
});

test('hábitos flexibles: días programados, versión mínima y racha que perdona un solo fallo', () => {
  const est = e(), guardados = est.habitos, diasAntes = est.dias;
  est.habitos = [{ id: 'a', nombre: 'Siempre', tipo: 'check' }, { id: 'b', nombre: 'Solo lunes', tipo: 'check', dias: [1] }];
  est.dias = {};
  const marcar = (f, ...ids) => { est.dias[f] = { habitos: Object.fromEntries(ids.map((x) => [x, { ts: 1 }])), metas: {}, crono: {} }; };
  // 2 nov 2026 es lunes
  assert.deepEqual(habitosDe('2026-11-02').map((h) => h.id), ['a', 'b']);
  assert.deepEqual(habitosDe('2026-11-03').map((h) => h.id), ['a']);
  marcar('2026-11-03', 'a');
  assert.equal(mananaCompleta('2026-11-03'), true);
  assert.equal(fraccionManana('2026-11-03'), 1);
  marcar('2026-11-02', 'a');
  assert.equal(mananaCompleta('2026-11-02'), false); // el lunes también toca b
  assert.equal(fraccionManana('2026-11-02'), 0.5);
  // Un fallo (lunes) no corta: martes y domingo suman. Dos fallos seguidos, sí
  marcar('2026-11-01', 'a');
  assert.equal(racha('2026-11-03'), 2);
  marcar('2026-10-29', 'a'); // 30 y 31 oct sin marcar: dos fallos seguidos cortan antes de llegar aquí
  assert.equal(racha('2026-11-03'), 2);
  est.habitos = [{ id: 'c', nombre: 'Lun y mié', tipo: 'check', dias: [1, 3] }];
  est.dias = {};
  marcar('2026-11-02', 'c'); marcar('2026-10-28', 'c');
  assert.equal(racha('2026-11-02'), 2); // los días que no toca no cuentan como fallo
  est.habitos = guardados; est.dias = diasAntes;
});
