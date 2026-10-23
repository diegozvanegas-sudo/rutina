import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repsDe, estadoFila, sugerencia, ultimoRegistro, aproximacion, resumenSemana } from '../src/gym.js';
import { filasDeEsquema, RUTINA } from '../src/datos_iniciales.js';
import { semanaDe, lunesDe, diaSemana } from '../src/fechas.js';
import { fases } from '../src/vistas/sesiones.js';

const top = { id: 'x', series: 1, min: 4, max: 7 }, back = { id: 'y', series: 2, min: 8, max: 12 };

test('las reps se cuentan desde el texto', () => {
  assert.deepEqual(repsDe('10 9 8'), [10, 9, 8]);
  assert.deepEqual(repsDe('  12   11 '), [12, 11]);
  assert.deepEqual(repsDe(''), []);
});

test('colores: vacío, faltan, completo y sube peso', () => {
  assert.equal(estadoFila(back, {}).color, 'vacio');
  assert.equal(estadoFila(back, { reps: '10' }).color, 'falta');
  assert.equal(estadoFila(back, { reps: '12 10' }).color, 'completo');
  assert.equal(estadoFila(back, { reps: '12 12' }).color, 'sube');
  assert.deepEqual([estadoFila(back, { reps: '12 10' }).hechas, estadoFila(back, { reps: '12 10' }).plan], [2, 2]);
});

test('peso sugerido: sube 2,5–5 % solo si hizo el tope', () => {
  assert.equal(sugerencia(top, { peso: '40', unidad: 'kg', reps: '7' }).texto, '41–42 kg');
  assert.equal(sugerencia(top, { peso: '40', unidad: 'kg', reps: '6' }).texto, '40 kg');
  assert.equal(sugerencia(top, { peso: '3', unidad: 'discos', reps: '7' }).sube, true);
  assert.equal(sugerencia(top, null), null);
});

test('el último registro es el de la semana anterior con datos', () => {
  const semanas = { 1: { x: { peso: '40', reps: '6' } }, 2: { x: { peso: '', reps: '' } }, 3: { x: { peso: '45', reps: '7' } } };
  assert.equal(ultimoRegistro(semanas, top, 3).peso, '40');
  assert.equal(ultimoRegistro(semanas, top, 4).peso, '45');
  assert.equal(ultimoRegistro(semanas, top, 1), null);
});

test('esquemas de la hoja', () => {
  const [t, b] = filasDeEsquema('Top 1×4-7 · Back-off 2×8-12');
  assert.deepEqual([t.tipo, t.series, t.min, t.max, b.tipo, b.series], ['Top', 1, 4, 7, 'Back-off', 2]);
  const [f] = filasDeEsquema('4×10 + fallo');
  assert.deepEqual([f.series, f.min, f.max, f.fallo], [4, 10, 10, true]);
  const [p] = filasDeEsquema('1×1 min');
  assert.deepEqual([p.max, p.unidad], [60, 's']);
});

test('la rutina suma 25 series el día 1 y 131 en la semana', () => {
  const r = resumenSemana(RUTINA, {});
  assert.equal(r.dias.find((d) => d.id === 'd1').plan, 25);
  assert.equal(r.plan, 131);
});

test('semanas desde el lunes 12 oct 2026', () => {
  assert.equal(semanaDe('2026-10-12'), 1);
  assert.equal(semanaDe('2026-10-18'), 1);
  assert.equal(semanaDe('2026-10-19'), 2);
  assert.equal(lunesDe(2), '2026-10-19');
  assert.equal(diaSemana('2026-10-18'), 7);
});

test('aproximación 50/70/85 %', () => {
  assert.deepEqual(aproximacion(100).map((a) => [a.peso, a.reps]), [[50, 8], [70, 5], [85, 2]]);
});

test('sesión guiada: lados, series y descansos', () => {
  const f = fases({ pasos: [{ nombre: 'A', seg: 30, lados: true }, { nombre: 'B', reps: '10', series: 2, descanso: 30 }] });
  assert.deepEqual(f.map((x) => x.fase), ['prep', 'tiempo', 'cambio', 'tiempo', 'prep', 'reps', 'descanso', 'reps']);
});

test('core anotado en varios días suma para la semana sin pasar de lo planificado', async () => {
  const { RUTINA } = await import('../src/datos_iniciales.js');
  const core = RUTINA.find((d) => d.id === 'core'), crunch = core.ejercicios[0].filas[0];
  const regs = { [crunch.id + '@d1']: { reps: '15' }, [crunch.id + '@d3']: { reps: '15 15' } };
  const r = resumenSemana([core], regs);
  assert.equal(r.hechas, 2); // 3 hechas, 2 planificadas
  assert.equal(ultimoRegistro({ 1: regs }, crunch, 2).reps, '15 15');
});

test('datos de la hoja: último registro, descanso y semana 1', async () => {
  const { aplicarHoja } = await import('../src/datos_hoja.js');
  const estado = { rutina: JSON.parse(JSON.stringify(RUTINA)), semanas: {} };
  aplicarHoja(estado);
  const remo = estado.rutina[0].ejercicios[1].filas;
  assert.deepEqual([remo[0].ultimo.peso, remo[0].ultimo.reps, remo[0].descanso], ['90', '6', 240]);
  assert.deepEqual([remo[1].ultimo.unidad, remo[1].ultimo.reps], ['discos', '10 9']);
  assert.equal(estado.semanas[1]['d3-1-2'].reps, '10 10');
});

test('CSV del gym: reps con "·" y core con su día', async () => {
  const { csvGym } = await import('../src/csv.js');
  const estado = { rutina: RUTINA, semanas: { 2: { 'd1-1-2': { peso: '46', unidad: 'kg', reps: '10 9' }, 'core-1-1@d3': { reps: '15' } } } };
  const csv = csvGym(estado);
  assert.match(csv, /2;2026-10-19;Torso A;Press inclinado mancuernas;Pecho;Back-off;2×8-12;46;kg;10 · 9;2;2;Completo/);
  assert.match(csv, /Empuje \+ Bíceps \(core\);Crunch/);
});
