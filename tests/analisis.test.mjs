import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e } from '../src/estado.js';
import { resumenEjercicios, promptEntreno, fechaDelDia } from '../src/analisis.js';

test('análisis del entreno: récord, igual y prompt con historial y contexto', () => {
  const est = e(), d = est.rutina.find((x) => x.id !== 'core' && x.ejercicios.length >= 2), [a, b] = d.ejercicios;
  est.semanas[1] = { [a.filas[0].id]: { peso: '50', reps: '10 9 8' }, [b.filas[0].id]: { peso: '20', reps: '10 10' } };
  est.semanas[2] = { [a.filas[0].id]: { peso: '52,5', reps: '10 9 9', rir: 1 }, [b.filas[0].id]: { peso: '20', reps: '10 10' } };
  const lista = resumenEjercicios(d, 2, est), x = lista.find((y) => y.nombre === a.nombre), y = lista.find((z) => z.nombre === b.nombre);
  assert.equal(x.estado, 'record');
  assert.equal(x.rir, 1);
  assert.ok(x.cambio > 0);
  assert.ok(['igual', 'estancado'].includes(y.estado));
  const texto = promptEntreno(d, 2, 'SESIÓN', est);
  assert.match(texto, /Eres mi entrenador personal/);
  assert.match(texto, /SESIÓN/);
  assert.match(texto, new RegExp(a.nombre + '.*Récord.*52,5 kg × 10'));
  assert.match(texto, /semana de descarga/);
  assert.match(texto, /## Recuperación y contexto/);
  assert.equal(fechaDelDia({ diaSemana: 3 }, 2).length, 10);
});
