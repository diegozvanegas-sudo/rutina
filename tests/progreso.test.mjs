import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e } from '../src/estado.js';
import { puntajeDia, revisionSemanal, rango } from '../src/progreso.js';
import { barras, linea, calendario } from '../src/graficos.js';

test('puntaje del día: promedio de mañana, metas, gym (si toca) y dieta', () => {
  const est = e();
  assert.equal(puntajeDia('2026-10-18'), null); // sin datos
  // Domingo 25 oct: descanso → sin gym. Mañana 3/6, dieta 2/4 comidas, metas en 0
  est.dias['2026-10-25'] = { habitos: { pastilla: { ts: 1 }, chia: { ts: 1 }, colgarse: { ts: 1 } }, metas: { agua: 0, pasos: 0, calorias: 0, lectura: 0 }, crono: {},
    comidas: { 'descanso:0': { kcal: 540, p: 39 }, 'descanso:1': { kcal: 535, p: 52 } } };
  const p = puntajeDia('2026-10-25');
  assert.equal(p.partes.gym, undefined);
  assert.equal(p.partes.manana, 0.5);
  assert.equal(p.partes.dieta, 0.5);
  assert.ok(p.total > 30 && p.total < 50, 'total ' + p.total);
  // Lunes 19 oct (empuje): el gym cuenta
  est.dias['2026-10-19'] = { habitos: {}, metas: {}, crono: {} };
  assert.equal(puntajeDia('2026-10-19').partes.gym, 0);
});

test('revisión semanal: frases de mañana y gym siempre; peso cuando hay registros', () => {
  const est = e();
  est.dias['2026-10-14'] = { peso: 87 };
  est.dias['2026-10-15'] = { peso: 86.8 };
  est.dias['2026-10-21'] = { peso: 86.2 };
  est.dias['2026-10-22'] = { peso: 86 };
  const frases = revisionSemanal('2026-10-22').map((f) => f.texto).join(' | ');
  assert.match(frases, /Mañana completa \d de 7 días/);
  assert.match(frases, /Semana 2 del gym/);
  assert.match(frases, /Peso: bajaste/);
  assert.match(frases, /llegas a 76 kg en unas \d+ semanas/);
  assert.deepEqual(rango(3, '2026-10-22'), ['2026-10-20', '2026-10-21', '2026-10-22']);
});

test('gráficos: una zona sensible por dato y sin números inválidos', () => {
  const svg = barras([{ etiqueta: 'a', v: 10, tip: 'A' }, { etiqueta: 'b', v: null, tip: 'B' }], { ref: { v: 8, texto: 'meta' } });
  assert.equal((svg.match(/class="zona"/g) || []).length, 2);
  assert.doesNotMatch(svg + linea([{ v: 1 }, { v: null }, { v: 3 }]) + calendario([[{ v: 0.5, tip: 'x' }, null]]), /NaN|undefined/);
});
