import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RUTINA } from '../src/datos_iniciales.js';
import { PLANES, CONFIG_DIETA, ALIMENTOS } from '../src/datos_dieta.js';
import { totalPlan } from '../src/dieta.js';

// Celular con la semana vieja (pierna A mié con 7 ejercicios, pierna B sáb con 8) y la pierna B de hoy ya anotada
const copia = (o) => JSON.parse(JSON.stringify(o));
const fila = (id, tipo = 'Series') => ({ id, tipo, series: 1, min: 8, max: 10, unidad: 'reps', esquema: '1×8-10', descanso: 120 });
const pierna = (id, nombre, diaSemana, n) => ({ id, nombre, diaSemana, calentamiento: 'pierna', cardio: 'Cardio cinta 30 min',
  ejercicios: Array.from({ length: n }, (_, i) => ({ id: id + '-' + (i + 1), nombre: 'Ej ' + (i + 1), musculo: 'X', filas: [fila(id + '-' + (i + 1) + '-1', 'Top')] })) });
const rutina = copia(RUTINA).filter((d) => !['pa', 'pb'].includes(d.id));
rutina.splice(1, 0, pierna('d2', 'Pierna A', 3, 7));
rutina.splice(4, 0, pierna('d6', 'Pierna B', 6, 8));
rutina.find((d) => d.id === 'd6').ejercicios[0].filas[0].ultimo = { peso: '4', unidad: 'discos', reps: '12' }; // de la hoja
const { futbol, ...planes } = copia(PLANES);
const viejo = {
  version: 1, hojaAplicada: true, diasV2: true, rutina,
  config: { metas: {}, espera: {}, objetivos: { _: [10, 20], Core: [6, 10] } },
  dieta: { config: { ...copia(CONFIG_DIETA), pesoBase: 80, carbKg: { inferior: 2.7 }, grasaKg: { inferior: 0.6 } }, alimentos: copia(ALIMENTOS), planes, anterior: null },
  semanas: {
    1: { 'd2-3-1': { peso: '100', unidad: 'kg', reps: '8 8' } },
    2: { 'd2-3-1': { peso: '105', unidad: 'kg', reps: '9' }, 'd6-1-1': { peso: '4', unidad: 'discos', reps: '15 14 13 12' },
      'd6-2-1': { peso: '90', reps: '8' }, 'd6-3-1': { peso: '120', reps: '9' }, 'cardio@d6': { min: 30 } },
  },
  dias: {},
};
globalThis.localStorage = { getItem: () => JSON.stringify(viejo), setItem() {} };
const est = await import('../src/estado.js');

test('la semana queda como antes y las dos piernas son la de Cbum', () => {
  const r = est.e().rutina, dia = (id) => r.find((d) => d.id === id);
  assert.deepEqual(r.map((d) => d.id), ['d1', 'pa', 'd3', 'd5', 'pb', 'core']); // mismo lugar que en la hoja de Google
  assert.deepEqual(['d3', 'd5', 'pa', 'd1', 'pb'].map((id) => dia(id).diaSemana), [1, 2, 3, 5, 6]);
  assert.equal(dia('d1').cardio, 'Cardio cinta 25-35 min');
  assert.deepEqual(est.e().config.futbol, [3, 5]);
  assert.deepEqual(est.e().config.objetivos.Aductores, [4, 8]);
});

test('lo anotado pasa al ejercicio equivalente, en su día y en todas las semanas', () => {
  const s = est.e().semanas;
  assert.equal(s[1]['pa-2-1'].peso, '100');              // sentadilla → patrón de sentadilla (pierna A)
  assert.equal(s[2]['pa-2-1'].peso, '105');
  assert.equal(s[2]['pb-7-1'].reps, '15 14 13 12');      // pantorrilla de hoy → elevaciones de pantorrilla (pierna B)
  assert.equal(s[2]['pb-4-1'].peso, '120');              // peso muerto rumano → rodilla extendida
  assert.equal(s[2]['pb-2-1'], undefined);               // el abductor no tiene equivalente: queda en su registro viejo
  assert.equal(s[2]['d6-2-1'].peso, '90');
  assert.deepEqual(s[2]['cardio@pb'], { min: 30 });
  const pantorrilla = est.e().rutina.find((d) => d.id === 'pb').ejercicios[6].filas[0];
  assert.deepEqual(pantorrilla.ultimo, { peso: '4', unidad: 'discos', reps: '12' });
});

test('miércoles y viernes el plan de comida es fútbol, puesto al peso de los otros planes', () => {
  assert.equal(est.tipoDieta('2026-10-21'), 'futbol');  // miércoles: pierna A + partido
  assert.equal(est.tipoDieta('2026-10-23'), 'futbol');  // viernes: solo partido
  assert.equal(est.tipoDieta('2026-10-24'), 'inferior'); // sábado: pierna B
  assert.equal(est.tipoDieta('2026-10-19'), 'superior'); // lunes: empuje
  assert.equal(est.tipoDieta('2026-10-25'), 'descanso');
  const d = est.e().dieta, kcal80 = totalPlan(d.planes.futbol, d.alimentos).kcal;
  assert.ok(kcal80 < totalPlan(PLANES.futbol, ALIMENTOS).kcal, 'con 80 kg el plan baja: ' + Math.round(kcal80));
  assert.ok(d.config.carbKg.futbol > d.config.carbKg.inferior);
});
