import { test } from 'node:test';
import assert from 'node:assert/strict';
import { origenDescarga, esDescarga, seriesDescarga, filaDe, rutinaDe, sinDescargas, semanasSinDescarga, sugerirDescarga, metaDescarga, pesoLiviano, metaLiviana } from '../src/descarga.js';
import { lunesDe } from '../src/fechas.js';
import { estadoFila, resumenSemana, ultimoRegistro } from '../src/gym.js';

// Una rutina mínima: un día con press (3 series de 8-12) y sentadilla (4 series de 6-8)
const press = { id: 'f1', series: 3, min: 8, max: 12, unidad: 'reps' }, sent = { id: 'f2', series: 4, min: 6, max: 8, unidad: 'reps' };
const rutina = [{ id: 'd1', ejercicios: [{ id: 'e1', nombre: 'Press', musculo: 'Pecho', filas: [press] }, { id: 'e2', nombre: 'Sentadilla', musculo: 'Cuádriceps', filas: [sent] }] }];
const semanaCon = (peso, reps) => ({ f1: { peso: String(peso), reps, unidad: 'kg' }, f2: { peso: '80', reps: '6 6 6 6', unidad: 'kg' } });
const base = (extra = {}) => ({ rutina, semanas: {}, descargas: {}, ...extra });

test('la mitad de las series, redondeando hacia arriba y nunca menos de 1', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(seriesDescarga), [1, 1, 2, 2, 3, 3]);
});

test('descarga a mano, apagada a mano y la del plan de 12 semanas (semana 9)', () => {
  const est = base({ descargas: { 5: true, 7: false } });
  assert.equal(origenDescarga(5, est), 'manual');
  assert.equal(origenDescarga(6, est), null);
  assert.equal(origenDescarga(7, est), null);
  // El plan empieza el lunes de la semana 3 del gym: su semana 9 es la 11 del gym
  const conPlan = base({ plan12: { inicio: lunesDe(3) } });
  assert.equal(origenDescarga(10, conPlan), null);
  assert.equal(origenDescarga(11, conPlan), 'plan');
  assert.equal(origenDescarga(12, conPlan), null);
  // "Esta semana no" también apaga la del plan
  assert.equal(esDescarga(11, { ...conPlan, descargas: { 11: false } }), false);
  // Sin plan empezado no hay descarga del plan
  assert.equal(origenDescarga(11, base({ plan12: { inicio: '' } })), null);
});

test('en descarga la fila se completa con la mitad de las series y la semana cuenta esas', () => {
  const est = base({ descargas: { 2: true } });
  assert.equal(filaDe(press, 2, est).series, 2);
  assert.equal(filaDe(press, 1, est), press);
  assert.equal(estadoFila(filaDe(press, 2, est), { reps: '10 10' }).color, 'completo');
  assert.equal(estadoFila(press, { reps: '10 10' }).color, 'falta');
  const r = resumenSemana(rutinaDe(rutina, 2, est), {});
  assert.equal(r.plan, 2 + 2);
  assert.equal(resumenSemana(rutinaDe(rutina, 1, est), {}).plan, 3 + 4);
  // La rutina guardada no cambia
  assert.equal(rutina[0].ejercicios[0].filas[0].series, 3);
});

test('la semana siguiente a la descarga toma la meta de la última semana normal', () => {
  const est = base({ descargas: { 2: true }, semanas: { 1: semanaCon(60, '10 9 9'), 2: semanaCon(60, '8 8') } });
  const ult = ultimoRegistro(sinDescargas(est.semanas, est), press, 3);
  assert.equal(ult.semana, 1);
  assert.equal(ult.reps, '10 9 9');
  assert.deepEqual(Object.keys(sinDescargas(est.semanas, est)), ['1']);
});

test('meta en descarga: mismo peso, las mismas reps y la mitad de las series, sin subir', () => {
  const m = metaDescarga(press, { peso: '60', reps: '12 12 12', unidad: 'kg' });
  assert.equal(m.sube, false);
  assert.equal(m.peso, 60);
  assert.equal(m.texto, '60 kg × 12 12');
  assert.match(m.motivo, /3-4 reps en reserva/);
  assert.equal(metaDescarga(press, null), null);
  assert.equal(metaDescarga({ ...press, unidad: 's' }, { peso: '0', reps: '30' }), null);
});

test('semanas seguidas sin descarga: cuentan las que tienen entreno y paran en la última descarga', () => {
  const semanas = {};
  for (let s = 1; s <= 8; s++) semanas[s] = semanaCon(60, '10 10 10');
  semanas[5] = {}; // una semana sin entrenar no suma ni corta
  assert.equal(semanasSinDescarga(9, base({ semanas })), 7);
  assert.equal(semanasSinDescarga(9, base({ semanas, descargas: { 3: true } })), 4);
});

test('sugerencia: desde 6 semanas seguidas, o desde 4 con 3 ejercicios estancados; nunca si ya hay o se dijo que no', () => {
  const semanas = {};
  for (let s = 1; s <= 6; s++) semanas[s] = semanaCon(60, '10 10 10');
  assert.equal(sugerirDescarga(6, base({ semanas })), null); // 5 semanas antes de la 6
  const s7 = sugerirDescarga(7, base({ semanas }));
  assert.equal(s7.semanas, 6);
  assert.match(s7.texto, /6 semanas seguidas/);
  assert.equal(sugerirDescarga(7, base({ semanas, descargas: { 7: false } })), null);
  assert.equal(sugerirDescarga(7, base({ semanas, descargas: { 7: true } })), null);
  // El plan ya la pone la semana siguiente: no se sugiere
  assert.equal(sugerirDescarga(7, base({ semanas, plan12: { inicio: lunesDe(8 - 8) } })), null);
  // Recién salido de una descarga: no
  assert.equal(sugerirDescarga(7, base({ semanas, descargas: { 4: true } })), null);
});

test('descargar hoy: 15 % menos de peso, redondeado a 0,5 y siempre más liviano', () => {
  assert.equal(pesoLiviano(60), 51);
  assert.equal(pesoLiviano(100), 85);
  assert.equal(pesoLiviano(22.5), 19);
  assert.equal(pesoLiviano(2), 1.5);   // poco peso: al menos 0,5 menos
  assert.equal(pesoLiviano(0.5), 0.5); // nunca baja de 0,5
  assert.equal(pesoLiviano(4, 'discos'), 3.5);
  assert.equal(pesoLiviano(null), null);
});

test('meta liviana: mismas series y reps con el peso bajado, sin subir', () => {
  const m = metaLiviana(press, { peso: '60', reps: '12 11', unidad: 'kg' });
  assert.equal(m.liviano, true);
  assert.equal(m.sube, false);
  assert.equal(m.texto, '51 kg × 12 11 11');
  assert.match(m.motivo, /15 % menos que 60 kg/);
  assert.equal(metaLiviana(press, { reps: '10' }), null);
});
