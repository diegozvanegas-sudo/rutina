// Red de seguridad del guardado en la nube (nube.js → revisarSinSubir): nada cambiado puede quedarse sin subir
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { difiereDeLaNube } from '../src/combinar.js';

const subido = () => ({
  version: 1, cambio: 100,
  dias: { '2026-11-10': { habitos: { pastilla: { ts: 1 } }, metas: { agua: 500 } } },
  semanas: { 5: { 'pa-1': { peso: '80', reps: '10' } } },
  finanzas: { movimientos: [{ id: 'm1', monto: 10 }] },
  config: { nombre: 'Diego', metas: { agua: 3000 } },
});

test('igual a lo subido: no hay nada pendiente', () => {
  assert.equal(difiereDeLaNube(subido(), subido()), false);
});

test('solo cambió la hora del cambio: no cuenta', () => {
  const d = subido(); d.cambio = 999;
  assert.equal(difiereDeLaNube(d, subido()), false);
});

test('la nube devuelve las llaves en otro orden: no cuenta', () => {
  const b = subido(), d = { config: b.config, finanzas: b.finanzas, semanas: b.semanas, dias: b.dias, cambio: 100, version: 1 };
  assert.equal(difiereDeLaNube(d, subido()), false);
});

test('un registro del gym cambiado sin guardar() se detecta', () => {
  const d = subido(); d.semanas[5]['pa-1'].reps = '12';
  assert.equal(difiereDeLaNube(d, subido()), true);
});

test('un día nuevo, un gasto nuevo o un ajuste cambiado se detectan', () => {
  const a = subido(); a.dias['2026-11-11'] = { habitos: {} };
  const b = subido(); b.finanzas.movimientos.push({ id: 'm2', monto: 5 });
  const c = subido(); c.config.metas.agua = 2500;
  for (const d of [a, b, c]) assert.equal(difiereDeLaNube(d, subido()), true);
});

test('algo borrado también se detecta', () => {
  const d = subido(); delete d.dias['2026-11-10'];
  assert.equal(difiereDeLaNube(d, subido()), true);
});

test('sin copia de lo subido no se inventa un cambio', () => {
  assert.equal(difiereDeLaNube(subido(), null), false);
});
