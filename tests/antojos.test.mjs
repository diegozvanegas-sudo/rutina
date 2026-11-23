import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ANTOJOS, MOTIVOS, DECISIONES, antojoDe, motivoDe, anotarAntojo, borrarAntojo, patronesAntojos, pesoDelAntojo } from '../src/antojos.js';

test('cada antojo y cada motivo tiene lo que la pantalla muestra; la versión que encaja pesa menos', () => {
  const ids = new Set();
  for (const a of ANTOJOS) {
    assert.ok(a.id && a.nombre && a.icono && a.version && a.truco, a.id);
    assert.ok(!ids.has(a.id)); ids.add(a.id);
    if (a.kcal) assert.ok(a.kcalVersion < a.kcal, a.id);
  }
  for (const m of MOTIVOS) assert.ok(m.id && m.nombre && m.porque && m.hacer, m.id);
  assert.equal(antojoDe('salchipapa').nombre, 'Salchipapas');
  assert.equal(antojoDe('no-existe').id, 'otro');
  assert.equal(motivoDe('estres').icono, '😤');
  assert.equal(motivoDe('x'), null);
});

test('anotar y borrar: queda en dieta.antojos con fecha, hora, motivos y decisión', () => {
  const dieta = {};
  const x = anotarAntojo(dieta, { antojo: 'otro', otro: '  Obleas  ', motivos: ['vi'], decision: 'paso', nota: ' ' }, '2026-11-22', '21:30');
  assert.equal(dieta.antojos.length, 1);
  assert.equal(x.otro, 'Obleas');
  assert.equal(x.nota, undefined);
  assert.deepEqual(x.motivos, ['vi']);
  assert.ok(DECISIONES[x.decision]);
  assert.equal(borrarAntojo(dieta, x.id), true);
  assert.equal(borrarAntojo(dieta, x.id), false);
  assert.equal(dieta.antojos.length, 0);
});

test('patrones: el motivo, el día, la franja y el antojo que más se repiten, y cuántos controlaste', () => {
  const dieta = {};
  // 2026-11-20 y 2026-11-13 son viernes
  anotarAntojo(dieta, { antojo: 'salchipapa', motivos: ['estres', 'cansado'], decision: 'comi' }, '2026-11-20', '22:15');
  anotarAntojo(dieta, { antojo: 'salchipapa', motivos: ['estres'], decision: 'paso' }, '2026-11-13', '21:00');
  anotarAntojo(dieta, { antojo: 'dulce', motivos: ['aburrido'], decision: 'version' }, '2026-11-18', '15:40');
  anotarAntojo(dieta, { antojo: 'pizza', motivos: ['social'], decision: 'comi' }, '2026-09-01', '20:00'); // fuera de los 30 días
  const p = patronesAntojos(dieta.antojos, '2026-11-22');
  assert.equal(p.total, 3);
  assert.equal(p.controlados, 2);
  assert.deepEqual(p.motivo, { id: 'estres', veces: 2 });
  assert.deepEqual(p.dia, { nombre: 'viernes', veces: 2 });
  assert.deepEqual(p.antojo, { id: 'salchipapa', veces: 2 });
  assert.equal(p.franja.veces, 1);
  assert.deepEqual(patronesAntojos([], '2026-11-22'), { total: 0 });
});

test('pesoDelAntojo: una salchipapa contra un día de 2.000 kcal y lo que ahorra la versión casera', () => {
  const r = pesoDelAntojo('salchipapa', 2000);
  assert.equal(r.kcal, 1000);
  assert.equal(r.parte, 0.5);
  assert.equal(r.ahorro, 480);
  assert.equal(pesoDelAntojo('otro', 2000), null);
  assert.equal(pesoDelAntojo('pizza', 0), null);
});
