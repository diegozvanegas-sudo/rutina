import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e, racha, mananaCompleta, fraccionManana, celdaHabito, ponerTextoHabito, textoHabito, pastillaDe } from '../src/estado.js';
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
