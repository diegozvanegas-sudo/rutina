import { test } from 'node:test';
import assert from 'node:assert/strict';
import { innovacionDe, nuevoProblema, nuevaIdea, puntaje, ranking, cuadrante, fraseValor, resultadoExperimento, avanceInnovacion, textoInnovacion } from '../src/innovacion.js';
import { pitchDe, sugerencias, segundosDe, duracionPitch, avancePitch, textoCompartirPitch, BLOQUES_PITCH, PREGUNTAS_DIFICILES } from '../src/pitch.js';

test('innovación: puntaje de los problemas y el mejor primero', () => {
  const x = innovacionDe({});
  const a = nuevoProblema('A'), b = nuevoProblema('B'), c = nuevoProblema('C');
  a.notas = { frecuencia: 3, dolor: 3, pagar: 3, puedo: 3 };
  b.notas = { frecuencia: 5, dolor: 4, pagar: 4, puedo: 5 };
  c.notas = { frecuencia: 5 }; // sin terminar
  x.problemas.push(a, b, c);
  assert.equal(puntaje(a), 12);
  assert.equal(puntaje(c), null);
  assert.deepEqual(ranking(x).map((p) => p.texto), ['B', 'A']);
});

test('innovación: matriz impacto / esfuerzo, propuesta de valor y resultado de la prueba', () => {
  assert.equal(cuadrante({ impacto: 'alto', esfuerzo: 'bajo' })[0], 'ya');
  assert.equal(cuadrante({ impacto: 'bajo', esfuerzo: 'alto' })[0], 'no');
  assert.equal(cuadrante({ impacto: 'alto', esfuerzo: '' }), null);
  assert.equal(fraseValor({ cliente: 'mamás que trabajan', solucion: 'un menú congelado' }), 'Para mamás que trabajan, un menú congelado.');
  assert.equal(fraseValor({ cliente: 'mamás', problema: 'no tienen tiempo', solucion: 'un menú', beneficio: 'comer en 5 min', alternativa: 'los domicilios' }),
    'Para mamás que no tienen tiempo, un menú le permite comer en 5 min, a diferencia de los domicilios.');
  assert.equal(fraseValor({ cliente: 'x' }), '');
  assert.deepEqual(resultadoExperimento({ personas: 10, si: 4, meta: 3 }), { personas: 10, si: 4, meta: 3, pct: 40, logrado: true });
  assert.equal(resultadoExperimento({}), null);
});

test('innovación: avance completo y el texto para compartir', () => {
  const x = innovacionDe({});
  const p = nuevoProblema('No hay quién arregle celulares'); x.problemas.push(p); x.elegido = p.id;
  x.entrevistas = [1, 2, 3].map((n) => ({ id: 'e' + n, quien: 'P' + n, fecha: '2026-11-13', aprendi: 'Algo ' + n }));
  x.ideas = ['Taller móvil', 'Curso', 'App'].map((t) => ({ ...nuevaIdea(t), impacto: 'alto', esfuerzo: 'bajo' })); x.idea = x.ideas[0].id;
  x.valor = { cliente: 'vecinos', solucion: 'un taller móvil' };
  x.prototipo = 'whatsapp'; x.experimento = { personas: 10, si: 3, veredicto: 'seguir' };
  x.textos = { tipo: 'Rappi', aprendi: 'Mucho', siguiente: 'El sábado' };
  const a = avanceInnovacion(x);
  assert.equal(a.hechos, a.total);
  const t = textoInnovacion(x);
  assert.match(t, /No hay quién arregle celulares/);
  assert.match(t, /Para vecinos, un taller móvil\./);
  assert.match(t, /3 de 10 dijeron que sí \(30 %\)/);
});

test('pitch: sugerencias del módulo 4, duración y avance', () => {
  const inn = innovacionDe({});
  assert.deepEqual(sugerencias(inn), {});
  const p = nuevoProblema('no tienen tiempo de cocinar'); inn.problemas.push(p); inn.elegido = p.id;
  inn.valor = { cliente: 'mamás que trabajan', solucion: 'un menú congelado' };
  inn.experimento = { personas: 10, si: 4 };
  const s = sugerencias(inn);
  assert.equal(s.gancho, '¿Conoces a mamás que trabajan que no tienen tiempo de cocinar?');
  assert.equal(s.problema, 'Mamás que trabajan no tienen tiempo de cocinar.');
  assert.match(s.solucion, /^Para mamás/);
  assert.match(s.prueba, /de 10 personas, 4 dijeron que sí/);
  assert.equal(segundosDe('uno dos tres cuatro cinco'), 2);
  const x = pitchDe({});
  for (const [k] of BLOQUES_PITCH) x.bloques[k] = 'palabra '.repeat(20);
  assert.equal(duracionPitch(x), 48); // 120 palabras ≈ 48 s
  x.ensayos = [{}, {}, {}];
  for (const [k] of PREGUNTAS_DIFICILES) x.respuestas[k] = 'sí';
  assert.equal(avancePitch(x).hechos, 4);
  assert.match(textoCompartirPitch(x), /Mi pitch de 1 minuto/);
});
