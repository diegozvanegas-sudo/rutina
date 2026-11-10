import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e, mananaCorta, prioridadesDe } from '../src/estado.js';
import { horaCama, minutosTarde } from '../src/registro.js';

test('hora de acostarse: aviso de dormir + 30 min, y cuánto tarde fue anoche', () => {
  assert.equal(horaCama({}), '23:00');
  assert.equal(horaCama({ avisos: { horas: { dormir: '21:15' } } }), '21:45');
  assert.equal(horaCama({ avisos: { horas: { dormir: '23:45' } } }), '00:15');
  assert.equal(minutosTarde('23:40', '23:00'), 40);
  assert.equal(minutosTarde('00:30', '23:00'), 90); // pasada la medianoche
  assert.equal(minutosTarde('22:30', '23:00'), -30);
  assert.equal(minutosTarde('', '23:00'), null);
});

test('mañana corta el día del partido y el siguiente; prioridades por fecha', () => {
  const est = e(), antes = est.config.futbol;
  est.config.futbol = [3, 5]; // miércoles y viernes
  assert.equal(mananaCorta('2026-11-11'), 'hoy');  // miércoles
  assert.equal(mananaCorta('2026-11-12'), 'ayer'); // jueves
  assert.equal(mananaCorta('2026-11-10'), null);   // martes
  assert.equal(mananaCorta('2026-11-14'), 'ayer'); // sábado
  est.config.futbol = antes;
  est.dias['2026-11-12'] = { prioridades: '1. Curso' };
  assert.equal(prioridadesDe('2026-11-12'), '1. Curso');
  assert.equal(prioridadesDe('2026-11-13'), '');
  delete est.dias['2026-11-12'];
});
