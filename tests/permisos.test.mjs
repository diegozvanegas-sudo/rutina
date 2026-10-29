import { test } from 'node:test';
import assert from 'node:assert/strict';

const guardado = new Map();
globalThis.localStorage = { getItem: (k) => (guardado.has(k) ? guardado.get(k) : null), setItem: (k, v) => guardado.set(k, String(v)), removeItem: (k) => guardado.delete(k) };
const { puedeVer, puedeVerRuta, permisosDe, reglaDe, catalogo, registrarCatalogo, tiposCatalogo, ponerPermisos, permisosGuardados, quitarPermisos,
  esAdmin, ve, ponerVerComo, viendoComo } = await import('../src/permisos.js');

const estudiante = { rol: 'estudiante', reglas: [{ tipo: 'seccion', id: 'finanzas', visible: false }, { tipo: 'seccion', id: 'gym', visible: false },
  { tipo: 'seccion', id: 'gym', visible: true, usuario: true }] };

test('usuario > rol > visible; el admin y sin nube ven todo', () => {
  assert.equal(puedeVer(estudiante, 'seccion', 'finanzas'), false); // regla del rol
  assert.equal(puedeVer(estudiante, 'seccion', 'gym'), true); // la del usuario gana
  assert.equal(puedeVer(estudiante, 'seccion', 'dieta'), true); // sin regla: visible
  assert.equal(puedeVer(null, 'seccion', 'finanzas'), true); // sin nube
  assert.equal(puedeVer({ rol: 'admin', reglas: estudiante.reglas }, 'seccion', 'finanzas'), true);
  // Hoy y Ajustes no se pueden esconder
  assert.equal(puedeVer({ rol: 'x', reglas: [{ tipo: 'seccion', id: 'ajustes', visible: false }] }, 'seccion', 'ajustes'), true);
});

test('esconder lo de afuera esconde lo de adentro', () => {
  const p = { rol: 'familia', reglas: [{ tipo: 'seccion', id: 'estudiar', visible: false }] };
  assert.equal(puedeVerRuta(p, [['seccion', 'estudiar'], ['area', 'mente'], ['curso', 'aprender']]), false);
  assert.equal(puedeVerRuta(estudiante, [['seccion', 'dieta'], ['area', 'mente']]), true);
});

test('catálogo: las secciones del menú, y otros tipos se suman después', () => {
  assert.equal(catalogo('seccion').gym, '🏋️ Gym');
  assert.deepEqual(tiposCatalogo(), ['seccion']);
  registrarCatalogo('area', () => ({ mente: '🧠 Aprender y pensar' }));
  assert.deepEqual(tiposCatalogo(), ['seccion', 'area']);
});

test('"Ver como" un rol o un usuario, y las reglas de la tabla del admin', () => {
  const datos = { usuarios: [{ id: 'u1', rol: 'familia' }], reglas: [
    { tipo: 'seccion', id: 'finanzas', rol: 'familia', usuario: null, visible: false },
    { tipo: 'seccion', id: 'finanzas', rol: null, usuario: 'u1', visible: true },
    { tipo: 'seccion', id: 'gym', rol: 'estudiante', usuario: null, visible: false }] };
  assert.equal(puedeVer(permisosDe(datos, { rol: 'familia' }), 'seccion', 'finanzas'), false);
  assert.equal(puedeVer(permisosDe(datos, { usuario: 'u1' }), 'seccion', 'finanzas'), true);
  assert.equal(puedeVer(permisosDe(datos, { usuario: 'u1' }), 'seccion', 'gym'), true); // la de estudiante no le aplica
  assert.equal(reglaDe(datos, 'seccion', 'finanzas', { rol: 'familia' }), false);
  assert.equal(reglaDe(datos, 'seccion', 'finanzas', { usuario: 'u1' }), true);
  assert.equal(reglaDe(datos, 'seccion', 'dieta', { rol: 'familia' }), null);
});

test('se guardan en el celular por usuario, y la vista previa no cambia los propios', () => {
  ponerPermisos('A', { rol: 'admin', reglas: [] });
  quitarPermisos();
  assert.equal(esAdmin(), false);
  permisosGuardados('A');
  assert.equal(esAdmin(), true);
  ponerVerComo('Familia', { rol: 'familia', reglas: [{ tipo: 'seccion', id: 'gym', visible: false }] });
  assert.equal(viendoComo(), 'Familia');
  assert.equal(ve('seccion', 'gym'), false);
  assert.equal(esAdmin(), true);
  ponerVerComo(null);
  assert.equal(ve('seccion', 'gym'), true);
  permisosGuardados('B'); // nada guardado para B: sin restricciones
  assert.equal(ve('seccion', 'finanzas'), true);
});
