import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resumenDieta, textoDieta } from '../src/imagen-dieta.js';

const alimentos = [
  { id: 'huevo', nombre: 'Huevos enteros', por: 'u', p: 6, c: 0.5, g: 5, kcal: 70 },
  { id: 'avena', nombre: 'Avena', por: 'g', p: 13, c: 66, g: 7, kcal: 380 },
  { id: 'ensalada', nombre: 'Ensalada', por: 'libre', p: 1, c: 5, g: 0, kcal: 30 },
];
const plan = { comidas: [
  { nombre: 'Desayuno', items: [{ alimento: 'huevo', cant: 6 }, { alimento: 'avena', cant: 70 }] },
  { nombre: 'Almuerzo', items: [{ alimento: 'ensalada', cant: 1 }, { alimento: 'avena', cant: 50.5 }] },
] };

test('dieta para WhatsApp: totales, alimentos con su cantidad y lo comido', () => {
  const r = resumenDieta({ plan, alimentos, tipo: 'inferior', titulo: '🦵 Entreno inferior', fecha: '2026-11-18',
    hechas: { 'inferior:0': { ts: new Date(2026, 10, 18, 7, 5).getTime(), kcal: 686, p: 45 } } });
  assert.equal(r.fecha, 'miércoles 18 de nov');
  assert.deepEqual([r.kcal, r.p, r.hechas, r.comido.kcal, r.comido.p], [908, 53, 1, 686, 45]);
  assert.deepEqual(r.comidas[0].items, ['Huevos enteros 6 u', 'Avena 70 g']);
  assert.deepEqual(r.comidas[1].items, ['Ensalada', 'Avena 50,5 g']);
  assert.deepEqual([r.comidas[0].hecha, r.comidas[1].hecha], ['07:05', null]);
  const t = textoDieta(r);
  assert.match(t, /^🍽️ \*Mi plan de comida · miércoles 18 de nov\*/);
  assert.match(t, /🦵 Entreno inferior — \*908 kcal\*/);
  assert.match(t, /Llevo 1 de 2 comidas: 686 kcal y 45 g de proteína/);
  assert.match(t, /✅ \*Desayuno\* \(686 kcal · P 45 g\) · 07:05\n {3}Huevos enteros 6 u, Avena 70 g/);
  assert.match(t, /⬜ \*Almuerzo\*/);
});

test('dieta para WhatsApp: sin nada comido no dice "Llevo"', () => {
  const t = textoDieta(resumenDieta({ plan, alimentos, tipo: 'inferior', titulo: 'X', fecha: '2026-11-18' }));
  assert.ok(!t.includes('Llevo'));
  assert.ok(!t.includes('✅'));
});
