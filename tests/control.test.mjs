import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e, empezarDePrueba, tipoDieta, planDieta } from '../src/estado.js';
import { controlDia, comidasDelDia, gymDelDia, revisionSemana, recomendar, sugerenciaComida, tocaRevision, semanaARevisar } from '../src/control.js';
import { alternarDescanso } from '../src/descanso.js';
import { estadoGym } from '../src/entrenador.js';
import { iso, sumarDias, lunesDe, semanaDe, diaSemana } from '../src/fechas.js';
empezarDePrueba(true);

// Un martes de la rutina de ejemplo (tiene gym) en la semana 40
const lunes = lunesDe(40), martes = sumarDias(lunes, 1);

test('control del día: peso, comida del plan, gym y pasos', () => {
  const c0 = controlDia(martes, e(), 8000);
  assert.equal(c0.listos, 0);
  assert.equal(c0.gym, 'pendiente');
  const d = (e().dias[martes] ??= {});
  d.peso = 89.5; d.metas = { pasos: 9000 };
  const tipo = tipoDieta(martes);
  d.comidas = Object.fromEntries(planDieta(martes).comidas.map((_, i) => [tipo + ':' + i, {}]));
  d.entreno = { dia: 'x', inicio: 1 };
  const c = controlDia(martes, e(), 8000);
  assert.equal(c.listos, 4);
  assert.deepEqual([c.peso, c.gym, c.pasos], [89.5, 'hecho', 9000]);
  assert.equal(comidasDelDia(martes).hechas, comidasDelDia(martes).plan);
  delete d.entreno;
  alternarDescanso(martes);
  assert.equal(gymDelDia(martes), 'descanso');
  assert.equal(controlDia(martes, e(), 8000).listo.gym, true); // descansar también cierra el gym del día
  alternarDescanso(martes);
});

test('seguimiento: un día de descanso no cuenta como que faltó', () => {
  const ayer = sumarDias(martes, 7); // martes de la semana 41
  assert.equal(estadoGym(ayer, sumarDias(ayer, 1)), 'falto');
  alternarDescanso(ayer);
  assert.equal(estadoGym(ayer, sumarDias(ayer, 1)), null);
  alternarDescanso(ayer);
});

test('revisión de la semana: los números y UNA recomendación', () => {
  const pasada = semanaDe(iso()) - 1, r = revisionSemana(pasada, e());
  assert.equal(r.lunes, lunesDe(pasada));
  assert.ok('recomendacion' in r && r.recomendacion.t);
  assert.equal(r.comidas.plan > 0, true);
});

test('la recomendación elige lo que más mueve la meta', () => {
  const base = { pesajes: 6, bajar: true, cambio: -0.5, comida: 0.9, fuerza: 0.01, va: 'ideal', gym: { hechas: 40, plan: 44, parte: 0.9 }, descarga: false, sueno: 7.2, pasos: 9000 };
  assert.match(recomendar(base).t, /Sigue igual/);
  assert.match(recomendar({ ...base, pesajes: 2 }).t, /Pésate/);
  assert.match(recomendar({ ...base, cambio: 0.6, va: 'reves', comida: 0.5 }).t, /plan de comida/);
  assert.match(recomendar({ ...base, cambio: 0.6, va: 'reves', comida: 0.9 }).t, /no se anota/);
  assert.match(recomendar({ ...base, fuerza: -0.06 }).t, /perdiendo fuerza/);
  assert.match(recomendar({ ...base, gym: { hechas: 10, plan: 44, parte: 0.23 } }).t, /entrenos/);
  assert.match(recomendar({ ...base, gym: { hechas: 10, plan: 44, parte: 0.23 }, descarga: true }).t, /Sigue igual/); // en descarga no pide series
  assert.match(recomendar({ ...base, sueno: 5.5 }).t, /Duerme/);
  assert.match(recomendar({ ...base, va: 'lento' }).t, /empujón/);
});

test('domingo y lunes toca la revisión; el lunes es de la semana que terminó', () => {
  assert.equal(tocaRevision('2026-11-22'), true);  // domingo
  assert.equal(tocaRevision('2026-11-23'), true);  // lunes
  assert.equal(tocaRevision('2026-11-20'), false); // viernes
  assert.equal(semanaARevisar('2026-11-23'), semanaDe('2026-11-23') - 1);
  assert.equal(semanaARevisar('2026-11-22'), semanaDe('2026-11-22'));
});

test('la comida que sabe del gym: sin entreno en la noche, y partido largo', () => {
  // Un día con gym, sin partido, de noche y sin entreno: sugiere el plan de descanso
  let f = martes; while (e().config.futbol.includes(diaSemana(f))) f = sumarDias(f, 1);
  const s = sugerenciaComida(f, 20);
  if (!['descanso', 'recarga'].includes(tipoDieta(f))) assert.equal(s && s.tipo, 'sin-gym');
  assert.equal(sugerenciaComida(f, 10), null); // en la mañana todavía puede ir
  // Partido largo un día de fútbol
  const n = e().config.futbol[0];
  if (n) {
    const juego = sumarDias(lunes, n - 1);
    (e().dias[juego] ??= {}).partido = { minutos: 90 };
    assert.equal(sugerenciaComida(juego, 22).tipo, 'partido-largo');
  }
  void iso;
});
