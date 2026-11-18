import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tiemposDia, lineaTiempos, duracion } from '../src/gym.js';
import { lunesDe, sumarDias } from '../src/fechas.js';

const h = (f, hh, mm) => new Date(f + 'T' + String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':00').getTime();
const lunes = lunesDe(6), miercoles = sumarDias(lunes, 2);
const d = { id: 'd1', cardio: 'Cinta 30 min' };

test('tiempos: la fuerza del día se encuentra en su fecha de esa semana, no hoy', () => {
  const estado = { dias: { [lunes]: { entreno: { dia: 'd1', inicio: h(lunes, 6, 10), fin: h(lunes, 7, 22) } }, [miercoles]: { entreno: { dia: 'd3', inicio: h(miercoles, 6, 0) } } }, semanas: {} };
  const t = tiemposDia(d, 6, estado, h(miercoles, 9, 0));
  assert.deepEqual([t.fuerza.fecha, t.fuerza.min, t.fuerza.enCurso, t.cardio, t.total], [lunes, 72, false, null, 72]);
  assert.equal(lineaTiempos(t), '⏱ Fuerza 1 h 12 min');
  assert.equal(tiemposDia({ id: 'otro' }, 6, estado, h(miercoles, 9, 0)).fuerza, null);
});

test('tiempos: abierto en un día pasado se cierra 5 min después de la última serie; hoy sigue en curso', () => {
  const estado = { dias: { [lunes]: { entreno: { dia: 'd1', inicio: h(lunes, 6, 0), ultimo: h(lunes, 7, 0) } } }, semanas: {} };
  assert.deepEqual([tiemposDia(d, 6, estado, h(miercoles, 9, 0)).fuerza.min, tiemposDia(d, 6, estado, h(miercoles, 9, 0)).fuerza.enCurso], [65, false]);
  const hoy = tiemposDia(d, 6, estado, h(lunes, 6, 40));
  assert.deepEqual([hoy.fuerza.min, hoy.fuerza.enCurso], [40, true]);
  assert.match(lineaTiempos(hoy), /\(en curso\)/);
});

test('tiempos: el cardio va aparte (minutos anotados o su cronómetro) y suma al total', () => {
  const estado = { dias: { [lunes]: { entreno: { dia: 'd1', inicio: h(lunes, 6, 0), fin: h(lunes, 7, 12) } } }, semanas: { 6: { 'cardio@d1': { inicio: h(lunes, 7, 12), fin: h(lunes, 7, 42), min: 30 } } } };
  const t = tiemposDia(d, 6, estado, h(miercoles, 9, 0));
  assert.deepEqual([t.fuerza.min, t.cardio.min, t.total], [72, 30, 102]);
  assert.equal(lineaTiempos(t), '⏱ Fuerza 1 h 12 min · 🏃 Cardio 30 min · Total 1 h 42 min');
  // Cardio corriendo, sin minutos todavía
  estado.semanas[6]['cardio@d1'] = { inicio: h(lunes, 7, 12) };
  const c = tiemposDia(d, 6, estado, h(lunes, 7, 22)).cardio;
  assert.deepEqual([c.min, c.enCurso], [10, true]);
  // Solo minutos anotados a mano (sin cronómetro)
  estado.semanas[6]['cardio@d1'] = { min: 25, vel: 6 };
  assert.equal(tiemposDia(d, 6, estado, h(miercoles, 9, 0)).cardio.min, 25);
  assert.deepEqual([duracion(45), duracion(60), duracion(102)], ['45 min', '1 h', '1 h 42 min']);
  assert.equal(lineaTiempos(tiemposDia({ id: 'x' }, 6, { dias: {}, semanas: {} })), '');
});
