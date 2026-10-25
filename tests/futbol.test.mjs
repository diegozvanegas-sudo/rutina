import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RUTINA } from '../src/datos_iniciales.js';
import { PLANES, CONFIG_DIETA, ALIMENTOS } from '../src/datos_dieta.js';
import { totalPlan } from '../src/dieta.js';

// Celular con la semana de antes del fútbol: pierna A el miércoles, pierna B el sábado, empuje lun, tirón mar, torso A vie
const copia = (o) => JSON.parse(JSON.stringify(o));
const fila = (id, tipo = 'Series') => ({ id, tipo, series: 1, min: 8, max: 10, unidad: 'reps', esquema: '1×8-10', descanso: 120 });
const pierna = (id, nombre, diaSemana, n) => ({ id, nombre, diaSemana, calentamiento: 'pierna', cardio: 'Cardio cinta 30 min',
  ejercicios: Array.from({ length: n }, (_, i) => ({ id: id + '-' + (i + 1), nombre: 'Ej ' + (i + 1), musculo: 'X', filas: [fila(id + '-' + (i + 1) + '-1', 'Top')] })) });
const rutina = copia(RUTINA).filter((d) => !['p1', 'p2'].includes(d.id));
Object.assign(rutina.find((d) => d.id === 'd1'), { diaSemana: 5, cardio: 'Cardio cinta 25-35 min', previo: undefined });
Object.assign(rutina.find((d) => d.id === 'd3'), { diaSemana: 1 });
Object.assign(rutina.find((d) => d.id === 'd5'), { diaSemana: 2, cardio: 'Cardio escaladora 25 min' });
rutina.splice(1, 0, pierna('d2', 'Pierna A', 3, 7));
rutina.splice(4, 0, pierna('d6', 'Pierna B', 6, 8));
const { futbol, ...planes } = copia(PLANES);
const viejo = {
  version: 1, hojaAplicada: true, diasV2: true, rutina,
  config: { metas: {}, espera: {}, objetivos: { _: [10, 20], Core: [6, 10] } },
  dieta: { config: { ...copia(CONFIG_DIETA), pesoBase: 80, carbKg: { inferior: 2.7 }, grasaKg: { inferior: 0.6 } }, alimentos: copia(ALIMENTOS), planes, anterior: null },
  semanas: { 1: { 'd2-3-1': { peso: '100', unidad: 'kg', reps: '8 8' } }, 2: { 'd2-3-1': { peso: '105', unidad: 'kg', reps: '9' } } },
  dias: {},
};
globalThis.localStorage = { getItem: () => JSON.stringify(viejo), setItem() {} };
const est = await import('../src/estado.js');

test('al abrir la app la semana pasa a la de fútbol: pierna 1 lun, empuje mar, torso A mié, tirón jue, pierna 2 sáb', () => {
  const r = est.e().rutina, dia = (id) => r.find((d) => d.id === id);
  assert.deepEqual(r.map((d) => d.id), ['d1', 'p1', 'd3', 'd5', 'p2', 'core']); // mismo lugar que en la hoja de Google
  assert.deepEqual(['p1', 'd3', 'd1', 'd5', 'p2'].map((id) => dia(id).diaSemana), [1, 2, 3, 4, 6]);
  assert.equal(dia('d1').cardio, '');                      // miércoles: hay partido en la noche
  assert.match(dia('d1').previo, /fútbol/);
  assert.match(dia('d5').cardio, /mañana hay fútbol/);
  assert.deepEqual(est.e().config.futbol, [3, 5]);
  assert.deepEqual(est.e().config.objetivos.Aductores, [4, 8]);
});

test('la sentadilla nueva arranca con el último peso de la de pierna A', () => {
  const sentadilla = est.e().rutina.find((d) => d.id === 'p1').ejercicios[0];
  assert.deepEqual(sentadilla.filas[0].ultimo, { peso: '105', unidad: 'kg', reps: '9' });
  assert.deepEqual(sentadilla.filas[1].ultimo, { peso: '105', unidad: 'kg', reps: '9' }); // el back-off toma la única fila que había
});

test('miércoles y viernes el plan de comida es fútbol, puesto al peso de los otros planes', () => {
  assert.equal(est.tipoDieta('2026-10-21'), 'futbol');  // miércoles: torso A + partido
  assert.equal(est.tipoDieta('2026-10-23'), 'futbol');  // viernes: solo partido
  assert.equal(est.tipoDieta('2026-10-19'), 'inferior'); // lunes: pierna 1
  assert.equal(est.tipoDieta('2026-10-25'), 'descanso');
  const d = est.e().dieta, kcal80 = totalPlan(d.planes.futbol, d.alimentos).kcal;
  assert.ok(kcal80 < totalPlan(PLANES.futbol, ALIMENTOS).kcal, 'con 80 kg el plan baja: ' + Math.round(kcal80));
  assert.ok(d.config.carbKg.futbol > d.config.carbKg.inferior);
});
