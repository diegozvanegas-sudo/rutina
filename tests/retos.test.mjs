import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RETOS, estadoRacha, empezarRacha, marcarHoy, hacerUna, retoActivo, cuantosHechos, dejarActivo, avisoFutbol, retoPorId } from '../src/retos.js';

test('catálogo: 28 retos con id único; los diarios para siempre no están', () => {
  assert.equal(RETOS.length, 28);
  assert.equal(new Set(RETOS.map((x) => x.id)).size, 28);
  assert.equal(retoPorId('quejas').dias, 7);
  assert.equal(retoPorId('cinco').dias, 30);
});

test('racha: cuenta días seguidos y vuelve a 0 si fallas uno', () => {
  const x = { reto: 'quejas', inicio: '2026-11-01', dias: { '2026-11-01': true, '2026-11-02': true, '2026-11-03': true } };
  assert.equal(estadoRacha(x, '2026-11-03').racha, 3);
  assert.equal(estadoRacha(x, '2026-11-04').racha, 3); // hoy todavía no se marca: cuenta hasta ayer
  const s = estadoRacha(x, '2026-11-05');
  assert.deepEqual([s.racha, s.rota], [0, true]);
  assert.equal(estadoRacha({ reto: 'quejas', inicio: '2026-11-05', dias: {} }, '2026-11-05').rota, false);
});

test('una racha activa a la vez; al llegar a la meta queda hecha', () => {
  const l = [];
  assert.ok(empezarRacha('quejas', '2026-11-01', l));
  assert.equal(empezarRacha('alcohol', '2026-11-01', l), null);
  for (let d = 1; d <= 7; d++) marcarHoy('2026-11-0' + d, l);
  assert.equal(retoActivo(l), null);
  assert.equal(cuantosHechos(l), 1);
  assert.ok(empezarRacha('alcohol', '2026-11-08', l));
  dejarActivo(l);
  assert.equal(retoActivo(l), null);
  assert.equal(cuantosHechos(l), 1);
});

test('retos de una vez: no se pueden empezar como racha; repetir no cuenta doble', () => {
  const l = [];
  assert.equal(empezarRacha('solo', '2026-11-01', l), null);
  hacerUna('solo', '2026-11-01', l); hacerUna('solo', '2026-11-02', l);
  assert.equal(cuantosHechos(l), 1);
  assert.equal(hacerUna('quejas', '2026-11-01', l), null);
});

test('ayuno y correr avisan el día del partido y el anterior', () => {
  const config = { futbol: [3, 5] }; // miércoles y viernes
  const ayuno = retoPorId('ayuno');
  assert.match(avisoFutbol(ayuno, config, '2026-11-11'), /Hoy/);    // miércoles
  assert.match(avisoFutbol(ayuno, config, '2026-11-10'), /Mañana/); // martes
  assert.equal(avisoFutbol(ayuno, config, '2026-11-08'), '');        // domingo
  assert.equal(avisoFutbol(retoPorId('solo'), config, '2026-11-11'), '');
});
