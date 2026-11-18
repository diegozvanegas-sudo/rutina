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

test('tiempos: "↺ Seguir" en fuerza después del cardio no le suma el cardio a la fuerza; completo = en el gym', () => {
  // Fuerza 6:00–7:00, cardio 7:00–7:30, Seguir fuerza 7:35–7:55 → fuerza 6:00–7:55 menos el cardio = 85 min
  const estado = { dias: { [lunes]: { entreno: { dia: 'd1', inicio: h(lunes, 6, 0), fin: h(lunes, 7, 55) } } }, semanas: { 6: { 'cardio@d1': { inicio: h(lunes, 7, 0), fin: h(lunes, 7, 30), min: 30 } } } };
  const t = tiemposDia(d, 6, estado, h(miercoles, 9, 0));
  assert.deepEqual([t.fuerza.min, t.cardio.min, t.total, t.gym.min], [85, 30, 115, 115]);
  assert.equal(lineaTiempos(t), '⏱ Fuerza 1 h 25 min · 🏃 Cardio 30 min · Total 1 h 55 min');
  // En curso: el contador de fuerza tampoco cuenta el cardio
  estado.dias[lunes].entreno = { dia: 'd1', inicio: h(lunes, 6, 0) };
  const ahora = tiemposDia(d, 6, estado, h(lunes, 7, 40));
  assert.deepEqual([ahora.fuerza.min, ahora.fuerza.enCurso, ahora.fuerza.ms], [70, true, 70 * 60000]);
  // Un rato entre la fuerza y el cardio: el total es la suma y "en el gym" lo dice aparte
  estado.dias[lunes].entreno = { dia: 'd1', inicio: h(lunes, 6, 0), fin: h(lunes, 7, 0) };
  estado.semanas[6]['cardio@d1'] = { inicio: h(lunes, 7, 15), fin: h(lunes, 7, 45), min: 30 };
  const r = tiemposDia(d, 6, estado, h(miercoles, 9, 0));
  assert.deepEqual([r.fuerza.min, r.total, r.gym.min], [60, 90, 105]);
  assert.equal(lineaTiempos(r), '⏱ Fuerza 1 h · 🏃 Cardio 30 min · Total 1 h 30 min (en el gym 1 h 45 min)');
});

test('contador: una anotación suelta de madrugada no estira el entreno de la noche', async () => {
  const { anotarEnEntreno } = await import('../src/gym.js');
  const f = '2026-11-16';
  let x = anotarEnEntreno(null, 'd1', h(f, 2, 28));
  x = anotarEnEntreno(x, 'd1', h(f, 2, 29));
  // 18 horas después empieza el entreno de verdad: vuelve a empezar
  x = anotarEnEntreno(x, 'd1', h(f, 20, 30));
  assert.deepEqual([x.inicio, x.n], [h(f, 20, 30), 1]);
  for (let m = 35; m <= 59; m += 3) x = anotarEnEntreno(x, 'd1', h(f, 20, m));
  x = anotarEnEntreno(x, 'd1', h(f, 21, 40));
  assert.deepEqual([x.ultimo, x.fin], [h(f, 21, 40), undefined]);
  // Una corrección 3 horas después: el entreno queda cerrado en su última serie + 5 min, no se alarga
  const y = anotarEnEntreno(x, 'd1', h(f, 23, 55));
  assert.equal(y.fin, h(f, 21, 45));
  assert.equal(anotarEnEntreno(y, 'd1', h(f, 23, 58)), y);
  // Si lo suelto se cerró solo (fin) y llega el entreno real horas después, también vuelve a empezar
  const z = anotarEnEntreno({ dia: 'd1', inicio: h(f, 2, 28), ultimo: h(f, 2, 28), fin: h(f, 2, 33), n: 1 }, 'd1', h(f, 19, 0));
  assert.equal(z.inicio, h(f, 19, 0));
  // Los contadores viejos (sin n) se toman como entreno de verdad
  assert.equal(anotarEnEntreno({ dia: 'd1', inicio: h(f, 6, 0), ultimo: h(f, 7, 0) }, 'd1', h(f, 22, 0)).fin, h(f, 7, 5));
});
