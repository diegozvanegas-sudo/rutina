import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e } from '../src/estado.js';
import { lunesDe, sumarDias } from '../src/fechas.js';
import { seriesRaras, registrosRaros, mejorSerie, metaSesion, consejoRir, progresoMes } from '../src/gym.js';
import { cargaFutbol, disposicion, sesionesGym, queTeHaceRendir, unicoMejorar, estadoGym, constanciaGym, proteinaSemana, pesoCorporalEn } from '../src/entrenador.js';

const top = { id: 'x', tipo: 'Top', series: 1, min: 4, max: 7, unidad: 'reps' };

test('registro raro: 1 rep cuando el plan es 4-7, o un peso que salta más de 40 %', () => {
  const r = seriesRaras(top, { peso: '91', reps: '8 1', unidad: 'kg' }, { peso: '77', unidad: 'kg' });
  assert.deepEqual(r.map((x) => [x.i, x.estado]), [[1, 'pendiente']]);
  assert.match(r[0].texto, /1 rep en la serie 2 y el plan es 4-7/);
  assert.deepEqual(seriesRaras(top, { peso: '3,5', reps: '6' }, { peso: '91' }).map((x) => x.i), ['p']);
  assert.deepEqual(seriesRaras({ ...top, unidad: 's' }, { reps: '1' }), []);
  // Revisada: ya no se pregunta
  assert.equal(seriesRaras(top, { peso: '91', reps: '1', revisadas: [0] })[0].estado, 'ok');
});

test('una serie incompleta no cuenta en la fuerza; un peso mal anotado saca todo el registro', () => {
  assert.equal(mejorSerie({ peso: '91', reps: '1 6', incompletas: [1] }).reps, 1);
  assert.equal(mejorSerie({ peso: '91', reps: '6 1', incompletas: [1] }).reps, 6);
  assert.equal(mejorSerie({ peso: '91', reps: '1', incompletas: [0] }), null);
  assert.equal(mejorSerie({ peso: '91', reps: '8', incompletas: ['p'] }), null);
  // En la comparación de 4 semanas: 77 × 8 → 91 × 1 dejaba de bajar −6,7 % cuando el 91 × 1 se marca incompleto
  const rutina = [{ id: 'd', ejercicios: [{ id: 'e', nombre: 'Posterior máquina', musculo: 'Hombro', filas: [{ ...top, id: 'f' }] }] }];
  const semanas = { 1: { f: { peso: '77', reps: '8', unidad: 'kg' } }, 3: { f: { peso: '91', reps: '1', unidad: 'kg' } } };
  assert.ok(progresoMes(semanas, rutina, 3)[0].cambio < 0);
  assert.equal(registrosRaros(semanas, rutina, 1, 3).length, 1);
  semanas[3].f.incompletas = [0];
  assert.equal(progresoMes(semanas, rutina, 3).length, 0);
  assert.equal(registrosRaros(semanas, rutina, 1, 3).length, 0);
});

test('meta de la próxima sesión: doble progresión y la reserva', () => {
  assert.equal(metaSesion(top, { peso: '100', reps: '5' }).texto, '100 kg × 6');
  assert.equal(metaSesion(top, { peso: '100', reps: '5', rir: 3 }).texto, '100 kg × 7');
  const sube = metaSesion(top, { peso: '100', reps: '7' });
  assert.deepEqual([sube.sube, sube.peso, sube.reps], [true, 102.5, 4]);
  assert.equal(metaSesion(top, null), null);
  assert.match(consejoRir(0, true), /descarga/);
  assert.match(consejoRir(4), /4 o más/);
  assert.equal(consejoRir(2), '');
});

test('carga del fútbol: 7 días contra el promedio de 28', () => {
  const est = e();
  for (let s = 0; s < 3; s++) for (const d of [0, 2]) est.dias[sumarDias('2026-09-07', s * 7 + d)] = { partido: { minutos: 60, rpe: 6 } };
  for (const d of [0, 2]) est.dias[sumarDias('2026-09-28', d)] = { partido: { minutos: 90, rpe: 9 } };
  const c = cargaFutbol('2026-10-03');
  assert.equal(c.aguda, 1620);
  assert.equal(c.estado, 'peligro');
  assert.equal(cargaFutbol('2026-09-10').ratio, null); // menos de 3 semanas de datos
  // Día después del partido duro, con mal sueño: rojo
  est.dias['2026-10-01'] = { sueno: { acoste: '01:00', levante: '06:00', calidad: 2 } };
  const d = disposicion('2026-10-01');
  assert.equal(d.nivel, 'rojo');
  assert.ok(d.razones.some((r) => /Dormiste 5 h/.test(r)) && d.razones.some((r) => /Jugaste ayer a tope/.test(r)));
  for (const f of Object.keys(est.dias)) delete est.dias[f];
  assert.equal(disposicion('2026-10-01').nivel, 'verde');
});

test('qué te hace rendir: las sesiones con buen sueño contra las de poco sueño', () => {
  const est = e(), d = est.rutina.find((x) => x.diaSemana === 1), f = d.ejercicios[0].filas[0];
  // 6 semanas: las pares con 8 h de sueño y 5 kg más
  for (let n = 1; n <= 6; n++) {
    (est.semanas[n] ??= {})[f.id] = { peso: String(n % 2 ? 100 : 105), reps: String(f.min), unidad: 'kg' };
    est.dias[lunesDe(n)] = { sueno: n % 2 ? { acoste: '01:00', levante: '06:00' } : { acoste: '22:00', levante: '06:00' } };
  }
  const hasta = sumarDias(lunesDe(6), 1);
  assert.ok(sesionesGym(hasta).length >= 6);
  const sueno = queTeHaceRendir(hasta).factores.find((x) => x.id === 'sueno');
  assert.ok(sueno.dif > 0.03, sueno.texto);
  assert.match(sueno.texto, /Con 7 h o más de sueño rindes [\d,]+ % más/);
  // Constancia: el lunes con series anotadas está hecho; el martes sin nada, faltó
  assert.equal(estadoGym(lunesDe(6), hasta), 'hecho');
  const martes = est.rutina.find((x) => x.diaSemana === 2);
  if (martes) assert.equal(estadoGym(sumarDias(lunesDe(6), 1), sumarDias(lunesDe(6), 2)), 'falto');
  assert.ok(constanciaGym(lunesDe(6).slice(0, 7), hasta).hechos >= 1);
});

test('lo único que mejorar, proteína de la semana y peso para la fuerza relativa', () => {
  const est = e();
  for (const f of Object.keys(est.dias)) delete est.dias[f];
  assert.equal(unicoMejorar('2026-10-29').icono, '📝');
  est.dias['2026-10-29'] = { sueno: { acoste: '01:30', levante: '06:30' } };
  assert.match(unicoMejorar('2026-10-29').texto, /dormiste 5 h/);
  est.dias['2026-10-28'] = { comidas: { a: { kcal: 600, p: 60 } }, peso: 86 };
  const p = proteinaSemana('2026-10-29');
  assert.equal(p.dias.length, 7);
  assert.equal(p.dias[5].comido, 60);
  assert.ok(p.dias[5].meta > 100);
  assert.equal(pesoCorporalEn('2026-10-29'), 86);
  assert.equal(pesoCorporalEn('2026-10-01'), null);
});
