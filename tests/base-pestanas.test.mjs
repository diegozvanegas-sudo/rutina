// La copia base de la nube va con su versión: si otra pestaña o ventana guardó otra copia, esta no la usa para combinar
// (23 nov 2026: una pestaña con recordatorios viejos en memoria los subió encima de los nuevos). Y la fecha del aviso de
// arriba (Gestionar / ✓ Listo) nunca queda después de hoy.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const guardado = new Map();
globalThis.localStorage = {
  getItem: (k) => (guardado.has(k) ? guardado.get(k) : null),
  setItem: (k, v) => guardado.set(k, String(v)),
  removeItem: (k) => guardado.delete(k),
};
const est = await import('../src/estado.js');
const { fechaDelAviso } = await import('../src/vistas/recordatorios.js');

test('la base se usa solo si es de la versión que este equipo cree tener', () => {
  est.usarUsuario('U');
  est.marcarNube({ usuario: 'U', base: 100 });
  est.guardarBase({ recordatorios: { lista: ['nuevo'] } });
  assert.deepEqual(est.leerBase(), { recordatorios: { lista: ['nuevo'] } });
  // Otra pestaña guardó la base de la versión 200; esta sigue creyendo que está en la 100
  const b = JSON.parse(guardado.get('rutina_v1:U:base'));
  guardado.set('rutina_v1:U:base', JSON.stringify({ ...b, version: 200 }));
  assert.equal(est.leerBase(), null);
});

test('una base guardada antes de este cambio (sin versión) se sigue usando', () => {
  est.marcarNube({ usuario: 'U', base: 100 });
  guardado.set('rutina_v1:U:base', JSON.stringify({ dias: {} }));
  assert.deepEqual(est.leerBase(), { dias: {} });
});

test('sin sincronizar nunca (sin versión) la base no se usa', () => {
  est.marcarNube(null);
  est.guardarBase({ dias: {} });
  assert.equal(est.leerBase(), null);
});

const aviso = (valor) => ({ closest: () => ({ querySelector: () => ({ value: valor }) }) });
test('la fecha del aviso: la elegida, o hoy si falta o es futura', () => {
  assert.equal(fechaDelAviso(aviso('2026-11-20'), '2026-11-23'), '2026-11-20');
  assert.equal(fechaDelAviso(aviso('2026-11-25'), '2026-11-23'), '2026-11-23');
  assert.equal(fechaDelAviso(aviso(''), '2026-11-23'), '2026-11-23');
  assert.equal(fechaDelAviso(null, '2026-11-23'), '2026-11-23');
});
