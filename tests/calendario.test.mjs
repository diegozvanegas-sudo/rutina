import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esBisiesto, diaDelAno, semanaIso, instanteFase, fasesEntre, lunaDelDia, instanteEstacion, pascua, festivosColombia, proximosFestivos, cuadricula, otroMes, MES_SINODICO } from '../src/calendario.js';

const utc = (s) => Date.parse(s + 'Z');
const minutos = (a, b) => Math.abs(a - b) / 60000;
// k de la fase más cercana a un instante (k entero = luna nueva)
const kCerca = (ms, fraccion) => Math.round(((ms / 86400000 + 2440587.5 - 2451550.09766) / MES_SINODICO) - fraccion) + fraccion;

test('bisiestos gregorianos: cada 4 años, menos los siglos que no se dividen por 400', () => {
  assert.deepEqual([1900, 2000, 2024, 2026, 2100].map(esBisiesto), [false, true, true, false, false]);
  assert.equal(diaDelAno('2026-01-01'), 1);
  assert.equal(diaDelAno('2024-12-31'), 366);
  assert.equal(diaDelAno('2026-10-29'), 302);
});

test('semana ISO 8601: la semana 1 es la del primer jueves', () => {
  assert.deepEqual(semanaIso('2026-01-01'), { ano: 2026, semana: 1 });
  assert.deepEqual(semanaIso('2027-01-01'), { ano: 2026, semana: 53 });
  assert.deepEqual(semanaIso('2024-12-30'), { ano: 2025, semana: 1 });
  assert.deepEqual(semanaIso('2026-10-29'), { ano: 2026, semana: 44 });
});

test('fases de la luna: coinciden con los eclipses de 2026 (error de pocos minutos)', () => {
  // Un eclipse de Sol solo pasa en luna nueva y uno de Luna solo en luna llena
  for (const [instante, f] of [['2026-02-17T12:01', 0], ['2026-08-12T17:37', 0], ['2026-03-03T11:38', 0.5], ['2026-08-28T04:18', 0.5]]) {
    const ms = utc(instante);
    assert.ok(minutos(instanteFase(kCerca(ms, f)), ms) < 15, instante + ': ' + new Date(instanteFase(kCerca(ms, f))).toISOString());
  }
  // Ejemplo del libro de Meeus: luna nueva del 18 feb 1977, 3:37 TT
  assert.ok(minutos(instanteFase(-283), utc('1977-02-18T03:37:42')) < 3);
});

test('un mes trae sus fases principales en orden y el día de luna llena está casi todo iluminado', () => {
  const fases = fasesEntre('2026-03-01', '2026-03-31');
  assert.ok(fases.length >= 4 && fases.length <= 5);
  assert.ok(fases.every((x, i) => i === 0 || x.ms > fases[i - 1].ms));
  const llena = fases.find((x) => x.nombre === 'Luna llena');
  const l = lunaDelDia(llena.fecha);
  assert.equal(l.icono, '🌕');
  assert.ok(l.luz >= 95, l.luz);
  const nueva = lunaDelDia(fases.find((x) => x.nombre === 'Luna nueva').fecha);
  assert.ok(nueva.luz <= 5, nueva.luz);
});

test('equinoccios y solsticios: ejemplo de Meeus y fechas de 2026', () => {
  // Solsticio de junio de 1962: 21 jun, 21:25 TT
  assert.ok(minutos(instanteEstacion(1962, 1), utc('1962-06-21T21:24')) < 5);
  for (const [i, instante] of [[0, '2026-03-20T14:46'], [1, '2026-06-21T08:24'], [2, '2026-09-23T00:05'], [3, '2026-12-21T20:50']]) {
    assert.ok(minutos(instanteEstacion(2026, i), utc(instante)) < 10, instante + ': ' + new Date(instanteEstacion(2026, i)).toISOString());
  }
});

test('Pascua y festivos de Colombia con la Ley Emiliani', () => {
  assert.deepEqual([2024, 2025, 2026, 2027].map(pascua), ['2024-03-31', '2025-04-20', '2026-04-05', '2027-03-28']);
  const f = festivosColombia(2026);
  assert.equal(Object.keys(f).length, 18);
  assert.equal(f['2026-01-12'], 'Reyes Magos'); // 6 ene cae martes → lunes 12
  assert.equal(f['2026-04-03'], 'Viernes Santo');
  assert.equal(f['2026-05-18'], 'Ascensión del Señor');
  assert.equal(f['2026-06-08'], 'Corpus Christi');
  assert.equal(f['2026-06-15'], 'Sagrado Corazón');
  assert.equal(f['2026-07-20'], 'Día de la Independencia'); // fijo aunque caiga lunes
  assert.equal(f['2026-11-02'], 'Todos los Santos');
  assert.equal(f['2026-11-16'], 'Independencia de Cartagena');
  assert.deepEqual(proximosFestivos('2026-12-09', 3).map((x) => x.fecha), ['2026-12-25', '2027-01-01', '2027-01-11']);
});

test('la cuadrícula va de lunes a domingo y cubre todo el mes', () => {
  const s = cuadricula('2026-10');
  assert.equal(s[0][0], '2026-09-28');
  assert.ok(s.at(-1).includes('2026-10-31'));
  assert.ok(s.every((fila) => fila.length === 7));
  assert.equal(otroMes('2026-12', 1), '2027-01');
  assert.equal(otroMes('2026-01', -1), '2025-12');
});
