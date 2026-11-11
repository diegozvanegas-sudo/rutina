import { test } from 'node:test';
import assert from 'node:assert/strict';
import { juegaEl, futbolEnPausa, pausarFutbol, reanudarFutbol, pausaEn } from '../src/futbol.js';
import { avisosDelDia, calendarioIcs } from '../src/registro.js';

// 2026-11-11 es miércoles, 2026-11-13 viernes; juega miércoles y viernes
const config = () => ({ futbol: [3, 5] });

test('sin pausa juega sus días, como siempre', () => {
  const c = config();
  assert.ok(juegaEl(c, '2026-11-11'));
  assert.ok(!juegaEl(c, '2026-11-12'));
});

test('en pausa no hay partido, pero los días quedan guardados y lo de antes sigue contando', () => {
  const c = config();
  pausarFutbol(c, '2026-11-11');
  assert.ok(!juegaEl(c, '2026-11-11'));
  assert.ok(!juegaEl(c, '2026-12-30'));
  assert.ok(juegaEl(c, '2026-11-06')); // viernes de antes de la pausa
  assert.deepEqual(c.futbol, [3, 5]);
  // Volví a jugar el 20: desde ese día vuelve a contar
  reanudarFutbol(c, '2026-11-20');
  assert.ok(!juegaEl(c, '2026-11-18'));
  assert.ok(juegaEl(c, '2026-11-25'));
  assert.ok(juegaEl(c, '2026-11-11') === false); // la pausa queda en el historial
});

test('con fecha de regreso se reactiva solo', () => {
  const c = config();
  pausarFutbol(c, '2026-11-11', '2026-11-27');
  assert.ok(futbolEnPausa(c, '2026-11-26'));
  assert.ok(juegaEl(c, '2026-11-27'));
  // Pausar de nuevo dentro de la misma pausa solo cambia la vuelta
  pausarFutbol(c, '2026-11-15', '2026-12-04');
  assert.equal(c.futbolPausas.length, 1);
  assert.equal(pausaEn(c, '2026-11-15').hasta, '2026-12-04');
});

test('reanudar el mismo día que se pausó la borra', () => {
  const c = config();
  pausarFutbol(c, '2026-11-11');
  reanudarFutbol(c, '2026-11-11');
  assert.deepEqual(c.futbolPausas, []);
  assert.ok(juegaEl(c, '2026-11-11'));
});

test('en pausa no salen los avisos del partido', () => {
  const c = config();
  const conPartido = avisosDelDia(c, '2026-11-11').length;
  pausarFutbol(c, '2026-11-11');
  assert.ok(avisosDelDia(c, '2026-11-11').length <= conPartido);
  assert.equal(avisosDelDia(c, '2026-11-11').length, avisosDelDia(config(), '2026-11-12').length);
  assert.ok(!/BYDAY=WE,FR/.test(calendarioIcs(c, '2026-11-11')));
});
