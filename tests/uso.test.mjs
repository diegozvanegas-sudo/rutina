import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sumar, pocoUsadas, masUsadas, diasContando } from '../src/uso.js';
import { agrupar, alternarGrupo, gruposAbiertos } from '../src/orden.js';

test('suma secciones y pestañas con la fecha', () => {
  let u = { desde: '2026-11-01', s: {}, p: {} };
  u = sumar(u, 'finanzas', 'mes', '2026-11-02');
  u = sumar(u, 'finanzas', undefined, '2026-11-03');
  assert.deepEqual(u.s.finanzas, { n: 2, ultima: '2026-11-03' });
  assert.deepEqual(u.p['finanzas/mes'], { n: 1, ultima: '2026-11-02' });
  assert.deepEqual(masUsadas(u)[0], ['finanzas', 2, '2026-11-03']);
});
test('poco usado: nada antes de 14 días contando', () => {
  const u = { desde: '2026-11-20', s: {}, p: {} };
  assert.deepEqual(pocoUsadas(['lugares'], u, '2026-11-25'), []);
  assert.equal(diasContando(u, '2026-11-25'), 5);
});
test('poco usado: lo que no se abre hace 30 días, nunca Hoy, Editar ni Ajustes', () => {
  const u = { desde: '2026-09-01', s: { gym: { n: 9, ultima: '2026-11-24' }, lugares: { n: 1, ultima: '2026-10-01' } }, p: {} };
  assert.deepEqual(pocoUsadas(['hoy', 'gym', 'lugares', 'voz', 'ajustes'], u, '2026-11-25'), ['lugares', 'voz']);
});
test('el menú manda lo poco usado al grupo 💤, menos la sección abierta', () => {
  const items = [{ k: 'hoy' }, { k: 'lugares' }, { k: 'voz', actual: true }];
  const g = agrupar({}, items, ['lugares', 'voz']);
  assert.deepEqual(g.map((x) => [x.g, x.items.map((i) => i.k)]), [['dia', ['hoy']], ['mente', ['voz']], ['poco', ['lugares']]]);
});
test('el grupo 💤 se abre y se cierra', () => {
  const b = {};
  assert.equal(alternarGrupo(b, 'poco'), true);
  assert.ok(gruposAbiertos(b).includes('poco'));
});
