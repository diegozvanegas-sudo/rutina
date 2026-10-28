import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SESIONES } from '../src/datos_iniciales.js';
import { avanceChecklist, idPaso } from '../src/vistas/sesiones.js';

const checklists = SESIONES.filter((s) => s.tipo === 'checklist');

test('checklists de partida: antes de salir, maletín del partido y cierre de la noche, con ids únicos por punto', () => {
  assert.deepEqual(checklists.map((s) => s.id), ['antes-de-salir', 'maletin-partido', 'cierre-noche']);
  for (const s of checklists) {
    const ids = s.pasos.map(idPaso);
    assert.ok(s.pasos.every((p) => p.id && p.nombre), s.id);
    assert.equal(new Set(ids).size, ids.length, s.id);
  }
});

test('avance de una checklist: cuenta lo marcado y se completa con todo', () => {
  const s = checklists[0];
  assert.deepEqual(avanceChecklist(s, {}), { hechos: 0, total: s.pasos.length, completa: false });
  const marcas = Object.fromEntries(s.pasos.map((p) => [p.id, 1]));
  assert.equal(avanceChecklist(s, marcas).completa, true);
  delete marcas.llaves;
  assert.equal(avanceChecklist(s, { ...marcas, otro: 1 }).hechos, s.pasos.length - 1); // marcas de puntos borrados no cuentan
  // Sin id (sesión que cambió de tipo), la marca va por posición
  assert.equal(avanceChecklist({ pasos: [{ nombre: 'A' }, { nombre: 'B' }] }, { 1: 1 }).hechos, 1);
  assert.equal(avanceChecklist({ pasos: [] }, {}).completa, false);
});

test('el cierre de la noche sale en Hoy solo desde las 7 p. m.', async () => {
  const { tarjetaCierreHoy } = await import('../src/vistas/sesiones.js');
  assert.equal(tarjetaCierreHoy(new Date(2026, 9, 28, 18, 59)), '');
  assert.match(tarjetaCierreHoy(new Date(2026, 9, 28, 19, 0)), /Cierre de la noche/);
});
