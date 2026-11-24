import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anotarHoras, tiemposEjercicios, minutosTexto, mmss } from '../src/gym.js';

const M = 60000, T0 = Date.UTC(2026, 10, 24, 18, 0);

test('anotar horas: una por serie nueva, se recorta al borrar y sin hora lo escrito después', () => {
  assert.deepEqual(anotarHoras(undefined, 0, 1, 100), [100]);
  assert.deepEqual(anotarHoras([100], 1, 3, 200), [100, 200, 200]); // "12 12" de una vez
  assert.deepEqual(anotarHoras([100, 200, 200], 3, 2, 300), [100, 200]);
  assert.deepEqual(anotarHoras(undefined, 2, 3, 300), [null, null, 300]); // series de antes sin hora
  assert.equal(anotarHoras(undefined, 0, 2, null), null); // semana pasada: no guarda nada
  assert.equal(anotarHoras([100], 1, 0, 300), null);
});

const ej = (id, ...filas) => ({ id, nombre: id, filas: filas.map((f) => ({ id: f })) });
const ejercicios = [ej('jalon', 'f1', 'f2'), ej('remo', 'f3'), ej('curl', 'f4')];

test('cada ejercicio va desde la última serie del anterior hasta su última serie, con su descanso medio', () => {
  const regs = {
    f1: { horas: [T0 + 3 * M] }, f2: { horas: [T0 + 5 * M, T0 + 7 * M] }, // jalón: 3 series, la primera a los 3 min
    f3: { horas: [T0 + 10 * M, T0 + 12 * M, T0 + 14 * M] },
  };
  const t = tiemposEjercicios(ejercicios, regs, T0);
  assert.equal(t.jalon.ms, 7 * M); // desde que empezó el entreno
  assert.equal(t.jalon.series, 3);
  assert.equal(t.jalon.descanso, 120);
  assert.equal(t.remo.ms, 7 * M); // desde la última de jalón (min 7) hasta la 14
  assert.equal(t.remo.aproximado, false);
  assert.equal(t.curl, undefined);
});
test('sin nada cerca antes cuenta desde su primera serie; las pausas largas no cuentan en el descanso', () => {
  const regs = { f3: { horas: [T0 + 60 * M, T0 + 62 * M, T0 + 90 * M] }, 'f4@b': { horas: [T0 + 95 * M] } };
  const t = tiemposEjercicios(ejercicios, regs, T0);
  assert.equal(t.remo.aproximado, true);
  assert.equal(t.remo.ms, 30 * M);
  assert.equal(t.remo.descanso, 120);
  assert.equal(t.curl.ms, 5 * M); // la variante (f4@b) también cuenta
  assert.equal(tiemposEjercicios(ejercicios, {}, T0).jalon, undefined);
});
test('textos', () => {
  assert.equal(minutosTexto(30000), 'menos de 1 min');
  assert.equal(minutosTexto(8.4 * M), '8 min');
  assert.equal(mmss(125), '2:05');
});

import { numerosDia } from '../src/gym.js';
test('números del día: entrenando, descansando (y pasados del plan), cambios, conteos y ritmo', () => {
  const ejs = [{ id: 'a', filas: [{ id: 'fa', descanso: 120 }] }, { id: 'b', filas: [{ id: 'fb', descanso: 90 }] }];
  const regs = {
    fa: { peso: '60', unidad: 'kg', reps: '10 9 8', horas: [T0, T0 + 2 * M, T0 + 5 * M] }, // descansos 2:00 y 3:00 (este pasado)
    fb: { peso: '4', unidad: 'discos', reps: '12 12', horas: [T0 + 8 * M, T0 + 9.5 * M] }, // cambio 3 min, descanso 1:30
  };
  const n = numerosDia(ejs, regs);
  assert.deepEqual([n.series, n.reps, n.kg, n.ejercicios, n.conHora], [5, 51, 1620, 2, 5]); // los discos no suman kg
  assert.equal(n.trabajoMs, 9.5 * M);
  assert.equal(n.descansoMs, 6.5 * M);
  assert.equal(n.descansos, 3);
  assert.equal(n.descansoMedio, 130);
  assert.equal(n.pasados, 1);
  assert.deepEqual([n.cambios, n.cambioMedio], [1, 180]);
  assert.equal(n.seriesHora, null); // menos de 10 min: sin ritmo
  const t = tiemposEjercicios(ejs, regs, T0);
  assert.deepEqual([t.a.descansos, t.a.plan], [[{ seg: 120, plan: 120 }, { seg: 180, plan: 120 }], 120]);
});
test('números del día: sin horas cuenta igual; las pausas largas no son descanso', () => {
  const ejs = [{ id: 'a', filas: [{ id: 'fa', descanso: 120 }] }];
  assert.deepEqual([numerosDia(ejs, { fa: { peso: '50', reps: '10 10' } }).series, numerosDia(ejs, { fa: { peso: '50', reps: '10 10' } }).trabajoMs], [2, 0]);
  const n = numerosDia(ejs, { fa: { peso: '50', reps: '10 10 10', horas: [T0, T0 + 30 * M, T0 + 32 * M] } });
  assert.deepEqual([n.pausas, n.descansos, n.descansoMs], [1, 1, 2 * M]);
  assert.equal(n.seriesHora, 5.6);
});
