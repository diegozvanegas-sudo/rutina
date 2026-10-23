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

test('nueva semana antes de tiempo: se vuelve la actual y se puede quitar si está vacía', async () => {
  const est = await import('../src/estado.js');
  const { semanaDe } = await import('../src/fechas.js');
  const cal = Math.max(1, semanaDe());
  assert.equal(est.semanaActual(), cal);
  assert.equal(est.abrirSemana(), cal + 1);
  assert.equal(est.semanaActual(), cal + 1);
  assert.equal(est.semanaQuitable(), cal + 1);
  est.e().semanas[cal + 1] = { 'd1-1-1': { reps: '6' } };
  assert.equal(est.semanaQuitable(), null); // con algo anotado ya no se quita
  est.e().semanas[cal + 1] = {};
  est.quitarSemana();
  assert.equal(est.semanaActual(), cal);
});

test('orden nuevo de días: lun empuje, mar tirón, mié pierna A, vie torso A, sáb pierna B', () => {
  const dia = (id) => RUTINA.find((d) => d.id === id).diaSemana;
  assert.deepEqual(['d3', 'd5', 'd2', 'd1', 'd6'].map(dia), [1, 2, 3, 5, 6]);
});

test('resumen del día en texto: peso × reps, marcas de estado, core del día y cardio', async () => {
  const { textoDia } = await import('../src/vistas/gym.js');
  const rutina = JSON.parse(JSON.stringify(RUTINA)), d3 = rutina.find((d) => d.id === 'd3');
  const estado = { rutina, semanas: { 2: {
    'd3-1-1': { peso: '100', unidad: 'kg', reps: '12' },          // tope del rango (4-7) → sube peso
    'd3-1-2': { peso: '100', unidad: 'kg', reps: '10 10' },       // completo
    'd3-2-1': { peso: '50', unidad: 'kg', reps: '12' },           // faltan series
    'core-1-1@d3': { reps: '15 15' },
  } } };
  const t = textoDia(d3, 2, estado);
  assert.match(t, /^🏋️ Lun · Empuje \+ Bíceps — Semana 2 \(19 oct – 25 oct\)\nSeries: 4\/25/);
  assert.match(t, /Press plano \(barra\/máquina\) · Pecho\n  Top 1×4-7: 100 kg × 12 ⬆ sube peso\n  Back-off 2×8-12: 100 kg × 10 · 10 ✅/);
  assert.match(t, /  3×10-15: 50 kg × 12 ⏳ 1\/3/);
  assert.match(t, /Máquina laterales · Hombro\n  4×10-15: —/);
  assert.match(t, /💪 Core\nCrunch · Core\n  2×15: 15 · 15 ⬆ sube peso/); // reps fijas: hacer las 15 cuenta como el tope
  assert.match(t, /🏃 Cardio cinta 30 min: —$/); // sin cardio anotado
});

test('cardio: texto con lo anotado, en el resumen del día y en el envío a la hoja', async () => {
  const { textoCardio } = await import('../src/gym.js');
  const { textoDia } = await import('../src/vistas/gym.js');
  const { datosGym } = await import('../src/hoja.js');
  assert.equal(textoCardio({ min: 32, vel: 3.5, incl: 15, fc: 128, fcMax: 141, km: 2.1 }), '32 min · vel 3,5 · incl 15 · FC 128 (máx 141) · 2,1 km');
  assert.equal(textoCardio({}), '');
  const rutina = JSON.parse(JSON.stringify(RUTINA)), d2 = rutina.find((d) => d.id === 'd2');
  const estado = { rutina, semanas: { 2: { 'cardio@d2': { min: 35, vel: 3.5, incl: 15, nota: 'cinta 4' } } } };
  assert.match(textoDia(d2, 2, estado), /🏃 Cardio cinta 30-35 min: 35 min · vel 3,5 · incl 15 \(cinta 4\)$/);
  assert.equal(datosGym(estado, 2).bloques.find((b) => b.nombre === 'Pierna A').cardio, '35 min · vel 3,5 · incl 15');
});

test('objetivos por músculo editables: cambian el estado Bajo / En rango / Alto', () => {
  const regs = {};
  for (const d of RUTINA) for (const ej of d.ejercicios) if (ej.musculo === 'Pecho') for (const f of ej.filas) regs[f.id] = { reps: Array(f.series).fill(10).join(' ') };
  const pecho = (obj) => resumenSemana(RUTINA, regs, obj).musculos.Pecho;
  assert.equal(pecho(undefined).hechas, 15);
  assert.equal(pecho(undefined).estado, 'En rango');
  assert.equal(pecho({ _: [10, 20], Pecho: [16, 22] }).estado, 'Bajo');
  assert.equal(pecho({ _: [10, 20], Pecho: [6, 12] }).estado, 'Alto');
  assert.deepEqual([pecho({ _: [8, 14] }).min, pecho({ _: [8, 14] }).max], [8, 14]); // los demás usan el general
});

test('cada campo tiene su propia clave al repintar (el mínimo de Pecho no es el de Core)', async () => {
  const { claveDeDatos } = await import('../src/ui.js');
  const pecho = claveDeDatos({ cambio: 'gym-objetivo', m: 'Pecho', k: '1' }), core = claveDeDatos({ cambio: 'gym-objetivo', m: 'Core', k: '1' });
  assert.notEqual(pecho, core);
  assert.notEqual(claveDeDatos({ cambio: 'gym-objetivo', m: 'Pecho', k: '0' }), pecho);
  assert.equal(claveDeDatos({ cambio: 'ed', ruta: 'a.b', tipo: 'num' }), claveDeDatos({ cambio: 'ed', ruta: 'a.b' }));
  assert.equal(claveDeDatos({ serie: 'd1-1-1' }), 'serie:d1-1-1');
  assert.equal(claveDeDatos({ accion: 'x' }), null);
});
