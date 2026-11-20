import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pesosCopiados, claveCopiado, consejoFutbol, loEsencial, esCompuesto, corePendiente, volumenPlan, hoyVsUltima, queTeHaceRendir, alternativas } from '../src/gym-extra.js';
import { sumarDias } from '../src/fechas.js';

const fila = (id, series = 3, extra = {}) => ({ id, series, min: 8, max: 12, unidad: 'reps', tipo: 'Series', esquema: series + '×8-12', descanso: 90, ...extra });
const ej = (id, nombre, musculo, filas, extra = {}) => ({ id, nombre, musculo, filas, ...extra });
const torso = { id: 'vie', nombre: 'Torso A', diaSemana: 5, cardio: 'Cinta', ejercicios: [
  ej('dom', 'Dominadas (calentamiento)', 'Espalda', [fila('f0', 2)], { calentamiento: true }),
  ej('pi', 'Press inclinado mancuernas', 'Pecho', [fila('f1', 1, { tipo: 'Top' }), fila('f2', 2)]),
  ej('jal', 'Jalón al pecho', 'Espalda', [fila('f3')]),
  ej('lat', 'Laterales máquina', 'Hombro', [fila('f4', 4)]),
  ej('tri', 'Tríceps extensión', 'Tríceps', [fila('f5')]),
] };

test('pesos que parecen copiados: el mismo peso en ejercicios distintos, hoy o la última vez', () => {
  const ultimos = { f3: { peso: '91', reps: '12 12', unidad: 'kg' }, f4: { peso: '91', reps: '12 10', unidad: 'kg' }, f5: { peso: '91', reps: '9', unidad: 'kg' }, f1: { peso: '40', reps: '10', unidad: 'kg' } };
  const ultimoDe = (f) => ultimos[f.id] || null;
  const l = pesosCopiados(torso, {}, ultimoDe);
  assert.equal(l.length, 1);
  assert.deepEqual([l[0].peso, l[0].ejercicios, l[0].hoy], [91, ['Jalón al pecho', 'Laterales máquina', 'Tríceps extensión'], false]);
  // Hoy ya anotó otro peso en laterales: quedan 2
  const hoy = pesosCopiados(torso, { f4: { peso: '30', reps: '10' } }, ultimoDe);
  assert.deepEqual(hoy[0].ejercicios, ['Jalón al pecho', 'Tríceps extensión']);
  // "Está bien, es real": no vuelve a salir
  assert.deepEqual(pesosCopiados(torso, {}, ultimoDe, { [claveCopiado(l[0])]: true }), []);
  // Pesos chicos (menos de 15) no avisan, ni el calentamiento
  assert.deepEqual(pesosCopiados(torso, {}, () => ({ peso: '10', unidad: 'kg' })), []);
});

test('fútbol: hoy (sin cinta y sin fallo), mañana con pierna, ayer, o nada', () => {
  const hoy = consejoFutbol({ hoy: true }, false, true);
  assert.equal(hoy.cuando, 'hoy');
  assert.ok(hoy.consejos.some((x) => /cinta/.test(x)));
  assert.ok(hoy.consejos.some((x) => /fallo/.test(x)));
  assert.match(consejoFutbol({ hoy: true }, true).consejos.join(' '), /2 primeros ejercicios/);
  assert.match(consejoFutbol({ manana: true }, true).consejos[0], /pierna sin fallo/);
  assert.equal(consejoFutbol({ ayer: true }).cuando, 'ayer');
  assert.equal(consejoFutbol({}), null);
});

test('lo esencial: los compuestos primero, el resto si queda tiempo', () => {
  assert.equal(esCompuesto(torso.ejercicios[1]), true);
  assert.equal(esCompuesto(torso.ejercicios[3]), false);
  assert.equal(esCompuesto(torso.ejercicios[0]), false); // el calentamiento no cuenta
  const { esencial, extra } = loEsencial(torso);
  assert.deepEqual(esencial.map((x) => x.id), ['pi', 'jal']);
  assert.deepEqual(extra.map((x) => x.id), ['lat', 'tri']);
});

test('core pendiente de la semana (también lo anotado en otro día con @día)', () => {
  const rutina = [torso, { id: 'core', ejercicios: [ej('pl', 'Plancha', 'Core', [fila('c1', 3)]), ej('ab', 'Rueda', 'Core', [fila('c2', 3)])] }];
  const p = corePendiente(rutina, { 'c1@lun': { reps: '30 30 30' } });
  assert.equal(p.ej.id, 'ab');
  assert.equal(p.faltan, 3);
  assert.equal(corePendiente(rutina, { 'c1@lun': { reps: '30 30 30' }, 'c2@mar': { reps: '10 10 10' } }), null);
  assert.equal(corePendiente([torso], {}), null);
});

test('volumen que planea la rutina por músculo contra el rango', () => {
  const rutina = [torso, { ...torso, id: 'x', ejercicios: [ej('lat2', 'Laterales polea', 'Hombro', [fila('g1', 4)]), ej('lat3', 'Laterales mancuerna', 'Hombro', [fila('g2', 4)]), ej('lat4', 'Posterior', 'Hombro', [fila('g3', 10)])] }];
  const v = volumenPlan(rutina, { _: [10, 20] });
  const hombro = v.find((x) => x.musculo === 'Hombro'), pecho = v.find((x) => x.musculo === 'Pecho');
  assert.deepEqual([hombro.series, hombro.estado], [22, 'alto']);
  assert.deepEqual([pecho.series, pecho.estado], [3, 'bajo']);
  assert.equal(v[0].estado, 'alto'); // lo alto primero
  assert.ok(!v.some((x) => x.musculo === 'Espalda' && x.ejercicios > 1)); // el calentamiento no suma
});

test('hoy contra la última vez (1RM estimado de la mejor serie)', () => {
  const l = hoyVsUltima(torso, { f1: { peso: '42,5', reps: '8', unidad: 'kg' }, f3: { peso: '80', reps: '10 9', unidad: 'kg' } },
    (f) => ({ f1: { peso: '40', reps: '8', unidad: 'kg' }, f3: { peso: '85', reps: '10', unidad: 'kg' } })[f.id]);
  const pi = l.find((x) => x.nombre.startsWith('Press')), jal = l.find((x) => x.nombre.startsWith('Jalón'));
  assert.ok(pi.cambio > 0.05);
  assert.ok(jal.cambio < -0.05);
  assert.equal(l.length, 2);
});

test('qué te hace rendir: con 3 entrenos o más de cada lado compara el sueño', () => {
  const hoy = '2026-11-20', dias = {};
  const d = (i, n, acoste, levante) => { dias[sumarDias(hoy, -i)] = { gymSensacion: { n }, sueno: { acoste, levante } }; };
  d(1, 5, '22:00', '06:00'); d(2, 4, '22:30', '06:00'); d(3, 5, '23:00', '06:30');
  d(4, 2, '01:00', '06:00'); d(5, 3, '01:30', '06:30');
  assert.equal(queTeHaceRendir(dias, hoy).listo, false);
  d(6, 2, '00:30', '06:00');
  const r = queTeHaceRendir(dias, hoy);
  assert.equal(r.listo, true);
  assert.ok(r.dif > 1.5);
});

test('alternativas si la máquina está ocupada: del mismo músculo', () => {
  const a = alternativas(ej('ap', 'Apertura pecho máquina', 'Pecho', [fila('z')]));
  assert.equal(a.length, 3);
  assert.ok(a.some((x) => /polea|Flexiones|mancuernas/.test(x)));
  assert.deepEqual(alternativas(ej('z', 'Raro', 'Otro', [])), []);
});
