import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RUTINA } from '../src/datos_iniciales.js';

// Celular que alcanzó a recibir la semana de fútbol: pierna 1 (lun) y 2 (sáb), empuje mar, torso A mié sin cardio, tirón jue
const copia = (o) => JSON.parse(JSON.stringify(o));
const fila = (id) => ({ id, tipo: 'Series', series: 2, min: 8, max: 12, unidad: 'reps', esquema: '2×8-12', descanso: 105 });
const pierna = (id, nombre, diaSemana) => ({ id, nombre, diaSemana, calentamiento: 'pierna', cardio: 'Cardio suave 15-20 min',
  ejercicios: Array.from({ length: 7 }, (_, i) => ({ id: id + '-' + (i + 1), nombre: 'Ej ' + (i + 1), musculo: 'X', filas: [fila(id + '-' + (i + 1) + '-1')] })) });
const rutina = copia(RUTINA).filter((d) => !['pa', 'pb'].includes(d.id));
Object.assign(rutina.find((d) => d.id === 'd1'), { diaSemana: 3, cardio: '', previo: 'Hoy hay fútbol en la noche: sin cardio' });
Object.assign(rutina.find((d) => d.id === 'd3'), { diaSemana: 2 });
Object.assign(rutina.find((d) => d.id === 'd5'), { diaSemana: 4, cardio: 'Cardio suave 15-20 min (mañana hay fútbol)' });
rutina.splice(1, 0, pierna('p1', 'Pierna 1 · Fuerza', 1));
rutina.splice(4, 0, pierna('p2', 'Pierna 2 · Volumen y prevención', 6));
const estado = {
  version: 1, hojaAplicada: true, diasV2: true, futbolV1: true, rutina,
  config: { metas: {}, espera: {}, objetivos: { _: [10, 20] }, futbol: [3, 5] },
  semanas: { 2: { 'p2-1-1': { peso: '70', reps: '15 13' }, 'p2-4-1': { reps: '5 5' }, 'p1-1-1': { peso: '120', reps: '6' } } },
  dias: {},
};
globalThis.localStorage = { getItem: () => JSON.stringify(estado), setItem() {} };
const est = await import('../src/estado.js');

test('desde la semana de fútbol: vuelven los días de antes y torso A con su cardio', () => {
  const dia = (id) => est.e().rutina.find((d) => d.id === id);
  assert.deepEqual(est.e().rutina.map((d) => d.id), ['d1', 'pa', 'd3', 'd5', 'pb', 'core']);
  assert.deepEqual(['d3', 'd5', 'pa', 'd1', 'pb'].map((id) => dia(id).diaSemana), [1, 2, 3, 5, 6]);
  assert.equal(dia('d1').cardio, 'Cardio cinta 25-35 min');
  assert.equal(dia('d1').previo, undefined);
  assert.equal(dia('d5').cardio, 'Cardio escaladora 25 min');
});

test('desde la semana de fútbol: la extensión y la sentadilla siguen; el nórdico queda guardado aparte', () => {
  const s = est.e().semanas[2];
  assert.equal(s['pb-1-1'].peso, '70');   // extensión de pierna 2 → pierna B
  assert.equal(s['pa-2-1'].peso, '120');  // sentadilla de pierna 1 → patrón de sentadilla de pierna A
  assert.equal(s['pb-4-1'], undefined);   // el nórdico no es el peso muerto
  assert.deepEqual(s['p2-4-1'], { reps: '5 5' });
});
