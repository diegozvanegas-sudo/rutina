import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e } from '../src/estado.js';
import { sumarDias, lunesDe } from '../src/fechas.js';
import { horasSueno, promedioSueno, cargaPartido, hayPartido, piernaAntes, partidos, energiaSegunPierna, semanaObjetivo, avisosDelDia, avisosPendientes, calendarioIcs } from '../src/registro.js';

test('sueño: horas aunque pase la medianoche, y promedio solo de las noches anotadas', () => {
  assert.equal(horasSueno({ acoste: '23:30', levante: '06:15' }), 6.8);
  assert.equal(horasSueno({ acoste: '01:00', levante: '08:00' }), 7);
  assert.equal(horasSueno({ acoste: '23:00' }), null);
  const dias = { '2026-10-20': { sueno: { acoste: '22:00', levante: '06:00' } }, '2026-10-21': { sueno: { acoste: '00:00', levante: '06:00' } }, '2026-10-22': {} };
  assert.deepEqual(promedioSueno(dias, ['2026-10-20', '2026-10-21', '2026-10-22']), { horas: 7, noches: 2 });
  assert.equal(promedioSueno(dias, ['2026-10-22']), null);
});

test('partidos: carga = minutos × esfuerzo y pierna el día antes', () => {
  assert.equal(cargaPartido({ minutos: 70, rpe: 7 }), 490);
  assert.equal(hayPartido({ nota: 'x' }), false);
  const est = e(), pierna = est.rutina.find((d) => d.calentamiento === 'pierna');
  // Partido el día después de la pierna de la semana 1; el otro, en la semana 3 (sin nada anotado)
  const partido = sumarDias(lunesDe(1), pierna.diaSemana), otro = sumarDias(lunesDe(3), 2);
  assert.equal(piernaAntes(est, partido), false); // sin series anotadas no cuenta
  const fila = pierna.ejercicios[0].filas[0];
  est.semanas[1] = { ...(est.semanas[1] || {}), [fila.id]: { peso: '100', reps: '8' } };
  assert.equal(piernaAntes(est, partido), true);
  est.dias[partido] = { partido: { minutos: 60, rpe: 8, energia: 2 } };
  est.dias[otro] = { partido: { minutos: 80, rpe: 6, energia: 4 } };
  const lista = partidos(est);
  assert.ok(lista.some((p) => p.fecha === partido && p.pierna && p.carga === 480));
  const comp = energiaSegunPierna(lista);
  assert.ok(comp && comp.con < comp.sin);
  delete est.dias[partido]; delete est.dias[otro]; delete est.semanas[1][fila.id];
});

test('cierre: el fin de semana se planea la siguiente', () => {
  assert.equal(semanaObjetivo('2026-10-21'), 2); // miércoles de la semana 2
  assert.equal(semanaObjetivo('2026-10-25'), 3); // domingo → la que viene
});

test('avisos: los del fútbol solo los días de partido y la revisión el domingo', () => {
  const config = { futbol: [3, 5], avisos: { horas: { partido: '20:00', pastilla: '06:00' } } };
  const mie = avisosDelDia(config, '2026-10-21').map((a) => a.id + ' ' + a.hora);
  assert.ok(mie.includes('pre-partido 17:00') && mie.includes('platano 19:00') && mie.includes('como-fue 22:00'));
  assert.ok(!avisosDelDia(config, '2026-10-20').some((a) => a.id === 'platano'));
  assert.ok(avisosDelDia(config, '2026-10-25').some((a) => a.id === 'revision'));
  assert.ok(!avisosDelDia({ ...config, avisos: { apagados: { pastilla: true } } }, '2026-10-20').some((a) => a.id === 'pastilla'));
  // Pendientes: dentro de los 30 min siguientes y una sola vez
  const ahora = new Date(2026, 9, 21, 17, 10);
  assert.deepEqual(avisosPendientes(config, ahora).map((a) => a.id), ['pre-partido']);
  assert.deepEqual(avisosPendientes(config, ahora, { '2026-10-21:pre-partido': true }), []);
  assert.deepEqual(avisosPendientes(config, new Date(2026, 9, 21, 17, 45)), []);
});

test('calendario .ics: eventos que se repiten con alarma', () => {
  const ics = calendarioIcs({ futbol: [3, 5] }, '2026-10-26');
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.ok(ics.includes('RRULE:FREQ=DAILY') && ics.includes('RRULE:FREQ=WEEKLY;BYDAY=WE,FR') && ics.includes('RRULE:FREQ=WEEKLY;BYDAY=SU'));
  assert.ok(ics.includes('DTSTART:20261028T170000')); // primer miércoles desde el lunes 26: comida pre-partido
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 6);
  assert.equal((ics.match(/BEGIN:VALARM/g) || []).length, 6);
});
