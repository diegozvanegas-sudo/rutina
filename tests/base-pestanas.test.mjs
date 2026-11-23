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

test('una base guardada antes de este arreglo (sin versión) ya no se usa: se junta sin ella', () => {
  est.marcarNube({ usuario: 'U', base: 100 });
  guardado.set('rutina_v1:U:base', JSON.stringify({ dias: {} }));
  assert.equal(est.leerBase(), null);
});

test('freno: cuenta lo que una copia vieja borraría de la nube', async () => {
  const { registrosQuitados, LIMITE_QUITAR, combinarEstado } = await import('../src/combinar.js');
  const nube = {
    dias: { '2026-11-20': { habitos: { a: { ts: 1 } } }, '2026-11-21': { habitos: { a: { ts: 2 } } }, '2026-11-22': { habitos: {} } },
    finanzas: { movimientos: [{ id: 'm1' }, { id: 'm2' }, { id: 'm3' }] },
    recordatorios: { lista: [{ id: 'r1', hechos: [{ fecha: '2026-11-21' }, { fecha: '2026-11-22' }] }, { id: 'r2', hechos: [] }] },
    notas: { n1: {} }, semanas: { 7: { f1: {}, f2: {} } },
  };
  const vieja = { dias: {}, finanzas: { movimientos: [{ id: 'm1' }] }, recordatorios: { lista: [{ id: 'r1', hechos: [] }] }, notas: {}, semanas: { 7: {} } };
  const q = registrosQuitados(nube, vieja);
  // el día vacío (22 nov) no cuenta: la app lo crea sola al pintar
  assert.deepEqual(q, { total: 2 + 2 + 3 + 1 + 2, dias: 2, movimientos: 2, recordatorios: 3, notas: 1, gym: 2 });
  assert.ok(q.total > LIMITE_QUITAR);
  // Borrar uno a mano no frena
  assert.equal(registrosQuitados(nube, { ...nube, finanzas: { movimientos: [{ id: 'm1' }, { id: 'm2' }] } }).total, 1);
  // Lo que hace el freno: juntar los dos lados, sin perder nada
  const junto = combinarEstado({}, vieja, nube, true);
  assert.equal(registrosQuitados(nube, junto).total, 0);
});

test('borrar todo desde Ajustes sí puede quitar de la nube (una sola vez)', () => {
  est.reiniciar();
  assert.equal(est.tomarBorradoAProposito(), true);
  assert.equal(est.tomarBorradoAProposito(), false);
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
