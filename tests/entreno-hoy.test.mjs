import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lecturaHoy, suenoDeHoras, esDiaPierna, planCorto, chequeoMensual, videoValido, buscarVideo } from '../src/entreno-hoy.js';

test('sueño en horas → poco, normal o bien', () => {
  assert.equal(suenoDeHoras(null), null);
  assert.equal(suenoDeHoras(5.5), 1);
  assert.equal(suenoDeHoras(6.5), 2);
  assert.equal(suenoDeHoras(7.5), 3);
});

test('día de pierna: la mayoría de los ejercicios son de pierna (sin el calentamiento)', () => {
  assert.equal(esDiaPierna({ ejercicios: [{ musculo: 'Cuádriceps' }, { musculo: 'Isquios' }, { musculo: 'Espalda', calentamiento: true }] }), true);
  assert.equal(esDiaPierna({ ejercicios: [{ musculo: 'Espalda' }, { musculo: 'Pecho' }, { musculo: 'Glúteo' }] }), false);
  assert.equal(esDiaPierna({ ejercicios: [] }), false);
});

test('lectura: full, normal y suave', () => {
  assert.equal(lecturaHoy({}), null);
  assert.equal(lecturaHoy({ sueno: 3, energia: 3 }).nivel, 'full');
  assert.equal(lecturaHoy({ sueno: 2, energia: 2 }).nivel, 'normal');
  assert.equal(lecturaHoy({ sueno: 3, energia: 1 }).nivel, 'suave');
  assert.equal(lecturaHoy({ sueno: 1, energia: 2 }).nivel, 'suave');
  assert.equal(lecturaHoy({ sueno: 1, energia: 3 }).nivel, 'normal');
});

test('fútbol: pierna después o antes de un partido va suave; el tren superior no', () => {
  assert.equal(lecturaHoy({ sueno: 3, energia: 3, pierna: true, futbol: { ayer: true } }).nivel, 'suave');
  assert.equal(lecturaHoy({ sueno: 3, energia: 3, pierna: true, futbol: { manana: true } }).nivel, 'suave');
  assert.equal(lecturaHoy({ sueno: 3, energia: 3, pierna: false, futbol: { ayer: true } }).nivel, 'full');
  // Sin responder nada, la pierna del día después del partido ya sale suave
  assert.equal(lecturaHoy({ pierna: true, futbol: { ayer: true } }).nivel, 'suave');
  assert.equal(lecturaHoy({ pierna: false, futbol: { ayer: true } }), null);
});

const ej = (id, musculo, series, descanso = 90, extra = {}) => ({ id, musculo, filas: [{ id: id + '-1', series, descanso }], ...extra });

test('versión corta: entra lo principal de cada músculo y lo demás queda fuera', () => {
  // Cada serie ≈ 40 s + descanso. 3 series × 130 s = 6,5 min por ejercicio
  const grupos = [[ej('a', 'Espalda', 3)], [ej('b', 'Espalda', 3)], [ej('c', 'Bíceps', 3)], [ej('d', 'Tríceps', 3)], [ej('e', 'Espalda', 3)]];
  const todo = planCorto(grupos, 999);
  assert.deepEqual(todo.fuera, []);
  assert.equal(todo.total, 38);
  // 25 min: 5 de calentar + 20 → 3 ejercicios; primero uno de cada músculo (a, c, d), no el segundo de espalda
  assert.deepEqual(planCorto(grupos, 25).fuera, ['b', 'e']);
});

test('versión corta: lo ya empezado siempre se queda y cuenta solo lo que le falta', () => {
  const grupos = [[ej('a', 'Espalda', 3)], [ej('b', 'Pecho', 3)], [ej('c', 'Bíceps', 3)]];
  const regs = { 'c-1': { reps: '10 10' } };
  const r = planCorto(grupos, 14, regs);
  assert.ok(!r.fuera.includes('c'));
  assert.deepEqual(r.fuera, []); assert.equal(r.menos, 1); // con una serie menos entra todo
});

test('versión corta: el calentamiento entra solo si sobra tiempo y la biserie va junta', () => {
  const grupos = [[ej('w', 'Espalda', 2, 60, { calentamiento: true })], [ej('a', 'Espalda', 3), ej('b', 'Pecho', 3)]];
  assert.deepEqual(planCorto(grupos, 15).fuera, ['w']);
  assert.deepEqual(planCorto(grupos, 9).fuera, ['w']); // la biserie entra con series de menos; el calentamiento no
});

test('cada 4 semanas: medidas y foto', () => {
  const hoy = '2026-11-19';
  const nada = chequeoMensual({}, hoy);
  assert.equal(nada.medida.toca, true); assert.equal(nada.medida.dias, null);
  const dias = { '2026-11-01': { medidas: { cintura: 82 } }, '2026-10-10': { foto: true }, '2026-11-18': { medidas: {} } };
  const c = chequeoMensual(dias, hoy);
  assert.equal(c.medida.fecha, '2026-11-01'); assert.equal(c.medida.dias, 18); assert.equal(c.medida.toca, false);
  assert.equal(c.foto.dias, 40); assert.equal(c.foto.toca, true);
  assert.equal(chequeoMensual({ [hoy]: { foto: true } }, hoy).foto.hoy, true);
});

test('video: solo enlaces http(s); buscar arma la búsqueda', () => {
  assert.equal(videoValido('https://youtu.be/x'), true);
  assert.equal(videoValido('javascript:alert(1)'), false);
  assert.equal(videoValido(''), false);
  assert.match(buscarVideo('Jalón polea alta'), /^https:\/\/www\.youtube\.com\/results\?search_query=.*Jal%C3%B3n/);
});

test('versión corta: quita series antes que dejar un músculo sin nada', () => {
  // 4 ejercicios de 3 series (6,5 min cada uno). Con 25 min (20 útiles) sin recortar entran 3 y bíceps queda fuera
  const grupos = [[ej('a', 'Pecho', 3)], [ej('b', 'Hombro', 3)], [ej('c', 'Tríceps', 3)], [ej('d', 'Bíceps', 3)]];
  const r = planCorto(grupos, 25);
  assert.equal(r.menos, 1);
  assert.deepEqual(r.fuera, []);
  // Con tiempo de sobra no se recorta nada
  assert.equal(planCorto(grupos, 60).menos, 0);
});
