import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compararValores, compararGrupos, estadoExperimento, resumenIngles, comparativa } from '../src/mejora.js';
import { e } from '../src/estado.js';

test('tendencia: mejor, peor, igual y sin datos, también cuando menos es mejor', () => {
  assert.equal(compararValores(80, 70), 'mejor');
  assert.equal(compararValores(60, 70), 'peor');
  assert.equal(compararValores(70.5, 70), 'igual');
  assert.equal(compararValores(null, 70), 'sin-datos');
  assert.equal(compararValores(70, 80, false), 'mejor');
});

test('qué te funciona: no concluye con pocos días', () => {
  const fila = (cond, valor) => ({ cond, valor });
  assert.equal(compararGrupos([fila(true, 90), fila(false, 50)]), null);
  const r = compararGrupos([...Array(5).fill(fila(true, 80)), ...Array(6).fill(fila(false, 60))]);
  assert.deepEqual([r.si, r.no, r.nSi, r.nNo, r.nota], [80, 60, 5, 6, true]);
  assert.equal(compararGrupos([...Array(5).fill(fila(true, 62)), ...Array(5).fill(fila(false, 60))]).nota, false);
});

test('experimento: cuenta 7 días y lo cumplido', () => {
  const x = { inicio: '2026-11-01', dias: { '2026-11-01': true, '2026-11-03': true } };
  assert.deepEqual(estadoExperimento(x, '2026-11-03'), { dia: 3, cumplidos: 2, termino: false, hoyListo: true });
  assert.equal(estadoExperimento(x, '2026-11-07').termino, false);
  assert.equal(estadoExperimento(x, '2026-11-08').termino, true);
});

test('inglés: horas hacia la meta y prueba cada 30 días', () => {
  const i = { minutos: { '2026-11-01': 90, '2026-10-01': 30 }, pruebas: [], meta: 10 };
  const r = resumenIngles(i, '2026-11-02');
  assert.equal(r.horas, 2);
  assert.equal(r.semanaHoras, 1.5);
  assert.equal(r.fraccion, 0.2);
  assert.equal(r.tocaPrueba, true);
  i.pruebas.push({ fecha: '2026-11-01', escucha: 2, habla: 2 });
  assert.equal(resumenIngles(i, '2026-11-20').tocaPrueba, false);
  assert.equal(resumenIngles(i, '2026-12-01').tocaPrueba, true);
});

test('comparativa: sin datos no inventa tendencias y con datos dice si mejoró', () => {
  const est = e(), antes = est.dias;
  est.dias = {};
  assert.ok(comparativa('2026-11-30').every((x) => x.estado === 'sin-datos'));
  const dia = (f, h) => { est.dias[f] = { habitos: {}, metas: {}, crono: {}, sueno: { acoste: '23:00', levante: h } }; };
  for (let d = 1; d <= 20; d++) dia('2026-11-' + String(d).padStart(2, '0'), '05:00');
  for (let d = 24; d <= 30; d++) dia('2026-11-' + d, '07:00');
  const s = comparativa('2026-11-30').find((x) => x.id === 'sueno');
  assert.ok(s.ahora > s.antes, JSON.stringify(s));
  assert.equal(s.estado, 'mejor');
  est.dias = antes;
});
