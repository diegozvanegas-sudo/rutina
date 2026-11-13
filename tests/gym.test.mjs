import { test } from 'node:test';
import assert from 'node:assert/strict';
import { repsDe, estadoFila, sugerencia, ultimoRegistro, aproximacion, resumenSemana } from '../src/gym.js';
import { filasDeEsquema, RUTINA, PIERNA } from '../src/datos_iniciales.js';
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

test('la rutina suma 25 series en torso A, 19 en cada pierna y 121 en la semana', () => {
  const r = resumenSemana(RUTINA, {});
  assert.equal(r.dias.find((d) => d.id === 'd1').plan, 25);
  assert.deepEqual(['pa', 'pb'].map((id) => r.dias.find((d) => d.id === id).plan), [19, 19]);
  assert.equal(r.plan, 121);
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

test('orden de días: lun empuje, mar tirón, mié pierna A, vie torso A, sáb pierna B', () => {
  const dia = (id) => RUTINA.find((d) => d.id === id).diaSemana;
  assert.deepEqual(['d3', 'd5', 'pa', 'd1', 'pb'].map(dia), [1, 2, 3, 5, 6]);
});

test('las dos piernas son la de Cbum: mismos ejercicios y series 2-3 (hip thrust 2, pantorrilla 3)', () => {
  const nombres = (id) => RUTINA.find((d) => d.id === id).ejercicios.map((ej) => ej.nombre);
  assert.deepEqual(nombres('pa'), ['Extensión de cuádriceps', 'Patrón de sentadilla', 'Curl femoral sentado', 'Peso muerto rodilla extendida', 'Aductores', 'Hip thrust (opcional)', 'Elevaciones de pantorrilla']);
  assert.deepEqual(nombres('pb'), nombres('pa'));
  assert.deepEqual(PIERNA.map(([, , esquema]) => filasDeEsquema(esquema).reduce((s, f) => s + f.series, 0)), [3, 3, 3, 2, 3, 2, 3]);
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
  const rutina = JSON.parse(JSON.stringify(RUTINA)), pa = rutina.find((d) => d.id === 'pa');
  const estado = { rutina, semanas: { 2: { 'cardio@pa': { min: 35, vel: 3.5, incl: 15, nota: 'cinta 4' } } } };
  assert.match(textoDia(pa, 2, estado), /🏃 Cardio cinta 30-35 min: 35 min · vel 3,5 · incl 15 \(cinta 4\)$/);
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

test('imagen del resumen: mismos datos que el texto, con el color de cada fila', async () => {
  const { resumenDia } = await import('../src/imagen.js');
  const rutina = JSON.parse(JSON.stringify(RUTINA)), d3 = rutina.find((d) => d.id === 'd3');
  const r = resumenDia(d3, 2, { rutina, semanas: { 2: { 'd3-1-1': { peso: '100.5', unidad: 'kg', reps: '12' }, 'd3-2-1': { peso: '50', reps: '12' }, 'core-1-1@d3': { reps: '15 15' } } } });
  assert.equal(r.titulo, 'Lun · Empuje + Bíceps');
  assert.equal(r.semana, 'Semana 2 · 19 oct – 25 oct');
  assert.deepEqual([r.hechas, r.plan], [2, 25]);
  assert.deepEqual(r.ejercicios[0].filas[0], { esquema: 'Top 1×4-7', color: 'sube', hechas: 1, plan: 1, datos: '100,5 kg × 12' });
  assert.equal(r.ejercicios[1].filas[0].color, 'falta');
  assert.equal(r.ejercicios[2].filas[0].datos, '—');
  assert.deepEqual(r.core.map((ej) => ej.nombre), ['Crunch']);
  assert.equal(r.cardio, 'Cardio cinta 30 min: —');
});

test('biseries: el ejercicio marcado va con el siguiente, y el nombre "A / b" se separa en dos', async () => {
  const { gruposDia, enBiserie, nombresBiserie } = await import('../src/gym.js');
  const ejs = [{ id: 1, biserie: true }, { id: 2 }, { id: 3 }, { id: 4, biserie: true }];
  assert.deepEqual(gruposDia(ejs).map((g) => g.map((x) => x.id)), [[1, 2], [3], [4]]);
  assert.ok(enBiserie(ejs, ejs[1]));
  assert.ok(!enBiserie(ejs, ejs[3])); // marcado pero sin siguiente: queda solo
  assert.deepEqual(nombresBiserie('Laterales máquina / posterior'), ['Laterales máquina', 'Posterior máquina']);
  assert.deepEqual(nombresBiserie('Curl bíceps / tríceps polea'), ['Curl bíceps', 'Tríceps polea']);
  assert.equal(nombresBiserie('Press plano'), null);
});

test('imagen de la rutina semanal: los 7 días, fútbol, descanso, metas y balance por músculo', async () => {
  const { resumenRutina } = await import('../src/imagen-rutina.js');
  const rutina = JSON.parse(JSON.stringify(RUTINA)), d3 = rutina.find((d) => d.id === 'd3'), f = d3.ejercicios[0].filas[0];
  const estado = { rutina, sesiones: [{ id: 'rodilla', nombre: 'Rodilla' }, { id: 'calentamiento-futbol', nombre: 'Calentar fútbol' }], config: { futbol: [3, 5], sesionesDescanso: ['rodilla'], sesionesPartido: ['calentamiento-futbol', 'no-existe'] },
    semanas: { 1: { [f.id]: { peso: '100', unidad: 'kg', reps: '7' } } } };
  const r = resumenRutina(2, estado);
  assert.equal(r.semana, 'Semana 2 · 19 oct – 25 oct');
  assert.deepEqual(r.dias.map((d) => d.nombre), ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']);
  assert.equal(r.dias[0].fecha, '19 oct');
  const lunes = r.dias[0].entrenos[0];
  assert.equal(lunes.nombre, 'Empuje + Bíceps');
  assert.equal(lunes.series, lunes.ejercicios.reduce((s, ej) => s + ej.series, 0));
  assert.equal(lunes.ejercicios[0].esquema, 'Top 1×4-7 · Back-off 2×8-12');
  assert.ok(lunes.ejercicios[0].meta && lunes.ejercicios[0].sube); // llegó al tope: toca subir
  assert.equal(lunes.ejercicios[1].meta, '');
  assert.deepEqual(r.dias[2].sesiones, ['Calentar fútbol']); // la sesión que no existe no sale
  assert.ok(r.dias[2].futbol && r.dias[2].entrenos.length);
  assert.ok(!r.dias[3].entrenos.length && !r.dias[3].futbol);
  assert.deepEqual(r.dias[3].sesiones, ['Rodilla']);
  assert.equal(r.totales.partidos, 2);
  assert.equal(r.totales.dias, 5);
  assert.ok(r.core.length);
  const pecho = r.musculos.find((m) => m.nombre === 'Pecho');
  assert.ok(pecho.plan > 0 && pecho.max >= pecho.min && ['Bajo', 'Alto', 'En rango'].includes(pecho.estado));
  assert.equal(r.totales.series, r.dias.reduce((s, d) => s + d.entrenos.reduce((t, x) => t + x.series, 0), 0) + r.core.reduce((s, ej) => s + ej.series, 0));
});

test('calentamiento con peso corporal: paralelas en empuje, dominadas en tirón y 2 + 2 en torso, una sola vez', async () => {
  const { calentamientoPeso } = await import('../src/estado.js');
  const est = { rutina: JSON.parse(JSON.stringify(RUTINA)) };
  calentamientoPeso(est);
  const primeros = (id) => est.rutina.find((d) => d.id === id).ejercicios.filter((x) => x.calentamiento).map((x) => x.nombre + ' ' + x.musculo + ' ' + x.filas[0].series);
  assert.deepEqual(primeros('d1'), ['Dominadas (calentamiento) Espalda 2', 'Paralelas (calentamiento) Pecho 2']); // torso
  assert.deepEqual(primeros('d3'), ['Paralelas (calentamiento) Pecho 2']); // empuje
  assert.deepEqual(primeros('d5'), ['Dominadas (calentamiento) Espalda 2']); // tirón
  assert.deepEqual(primeros('pa'), []); // pierna no cambia
  // Van de primeros y lo que ya había sigue con su id (los registros no se mueven)
  const torso = est.rutina.find((d) => d.id === 'd1');
  assert.equal(torso.ejercicios[2].id, 'd1-1');
  assert.equal(torso.ejercicios.length, RUTINA.find((d) => d.id === 'd1').ejercicios.length + 2);
  // Cuentan en las series de la semana
  const antes = resumenSemana(RUTINA, {}).musculos, ahora = resumenSemana(est.rutina, {}).musculos;
  assert.equal(ahora.Pecho.plan, antes.Pecho.plan + 4);
  assert.equal(ahora.Espalda.plan, antes.Espalda.plan + 4);
  // No se repite, ni se agrega si el día ya tiene ese ejercicio
  const n = torso.ejercicios.length;
  delete est.calentamientoPesoV1; calentamientoPeso(est);
  assert.equal(torso.ejercicios.length, n);
  const propio = { rutina: [{ id: 'x', calentamiento: 'empuje', ejercicios: [{ id: 'x-1', nombre: 'Fondos en paralelas', musculo: 'Pecho', filas: [] }] }] };
  calentamientoPeso(propio);
  assert.equal(propio.rutina[0].ejercicios.length, 1);
});
