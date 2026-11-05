import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proximaFecha, estadoEvento, ordenarEventos, eventosCerca, cuandoFalta } from '../src/eventos.js';

test('eventos: avisa dentro de los días elegidos, hoy y después pasa a pasados', () => {
  const x = { nombre: 'Concierto', fecha: '2026-11-20', avisarDias: 7 };
  assert.equal(estadoEvento(x, '2026-11-04').estado, 'programado');
  assert.deepEqual(estadoEvento(x, '2026-11-13'), { estado: 'pronto', fecha: '2026-11-20', faltan: 7 });
  assert.equal(estadoEvento(x, '2026-11-20').estado, 'hoy');
  assert.equal(estadoEvento(x, '2026-11-21').estado, 'pasado');
  assert.equal(estadoEvento({ nombre: 'Estreno' }).estado, 'por-confirmar');
  assert.equal(estadoEvento({ fecha: '2026-11-10' }, '2026-11-04').estado, 'pronto'); // 7 días por defecto
});

test('eventos: los de cada año vuelven a la fecha de este año o del siguiente', () => {
  assert.equal(proximaFecha({ fecha: '2020-12-24', anual: true }, '2026-11-04'), '2026-12-24');
  assert.equal(proximaFecha({ fecha: '2020-03-15', anual: true }, '2026-11-04'), '2027-03-15');
  assert.equal(proximaFecha({ fecha: '2024-02-29', anual: true }, '2026-11-04'), '2027-02-28');
  assert.equal(proximaFecha({ fecha: '2020-03-15' }, '2026-11-04'), '2020-03-15');
});

test('eventos: orden por cercanía y los que ya están cerca', () => {
  const lista = [{ id: 'a', fecha: '2026-12-01' }, { id: 'b', fecha: '2026-11-05', hora: '20:00' }, { id: 'c' }, { id: 'd', fecha: '2026-10-01' }, { id: 'e', fecha: '2026-11-05', hora: '08:00' }];
  const o = ordenarEventos(lista, '2026-11-04');
  assert.deepEqual(o.proximos.map((y) => y.x.id), ['e', 'b', 'a']);
  assert.deepEqual(o.porConfirmar.map((y) => y.x.id), ['c']);
  assert.deepEqual(o.pasados.map((y) => y.x.id), ['d']);
  assert.deepEqual(eventosCerca(lista, '2026-11-04').map((y) => y.x.id), ['e', 'b']);
  assert.equal(cuandoFalta(1), 'mañana');
});
