import { test } from 'node:test';
import assert from 'node:assert/strict';
import { armarIndice, buscar, llano } from '../src/buscar.js';

const est = {
  recordatorios: { lista: [{ id: 'uñas', icono: '✂️', nombre: 'Cortar las uñas', nota: 'cada 15 días' }], eventos: [{ id: 'e1', nombre: 'Concierto', fecha: '2026-12-01' }] },
  notas: { n1: { id: 'n1', titulo: 'Ideas de negocio', html: '<p>Vender <b>planes</b> de gym</p>' }, n2: { id: 'n2', titulo: 'Vieja', html: 'x', borrada: 1 } },
  rutina: [{ nombre: 'Lunes', ejercicios: [{ nombre: 'Press inclinado', musculo: 'Pecho' }] }, { nombre: 'Jueves', ejercicios: [{ nombre: 'Press Inclinado' }] }],
  finanzas: { categorias: { gasto: [{ id: 'comida', icono: '🍔', nombre: 'Comida' }], ingreso: [] }, movimientos: [{ id: 'm1', tipo: 'gasto', fecha: '2026-11-20', monto: 25000, categoria: 'comida', nota: 'Almuerzo' }] },
  compras: { lista: [{ id: 'c1', tipo: 'mercado', nombre: 'Huevos' }, { id: 'c2', tipo: 'mercado', nombre: 'Leche', comprado: 1 }] },
};
const secciones = [{ k: 'recordatorios', icono: '🔔', nombre: 'Recordatorios' }, { k: 'notas', icono: '📝', nombre: 'Notas' }, { k: 'gym', icono: '🏋️', nombre: 'Gym' }, { k: 'finanzas', icono: '💰', nombre: 'Finanzas' }, { k: 'compras', icono: '🛒', nombre: 'Compras' }, { k: 'manana', icono: '☀️', nombre: 'Mañana' }];
const indice = armarIndice(est, { secciones, subs: { finanzas: [['deudas', '💳 Deudas']] }, habitos: [{ id: 'h', nombre: 'Tomar agua', icono: '💧' }] });

test('sin tildes ni mayúsculas', () => {
  assert.equal(llano(' Cuádriceps '), 'cuadriceps');
  assert.equal(buscar(indice, 'UNAS')[0].titulo, 'Cortar las uñas');
});
test('cada cosa lleva a su lugar', () => {
  const r = buscar(indice, 'uñas')[0];
  assert.deepEqual([r.ir, r.accion, r.id], ['#recordatorios', 'rec-abrir', 'uñas']);
  assert.equal(buscar(indice, 'planes')[0].ir, '#notas/n1'); // busca dentro del texto de la nota
  assert.equal(buscar(indice, 'deudas')[0].ir, '#finanzas/deudas');
  assert.equal(buscar(indice, 'almuerzo')[0].ir, '#finanzas/mes');
  assert.equal(buscar(indice, 'comida')[0].tipo, 'Gasto'); // por la categoría
  assert.equal(buscar(indice, 'agua')[0].ir, '#manana');
});
test('sin repetidos, sin la papelera ni lo ya comprado', () => {
  assert.equal(buscar(indice, 'press').length, 1);
  assert.equal(buscar(indice, 'vieja').length, 0);
  assert.equal(buscar(indice, 'leche').length, 0);
  assert.equal(buscar(indice, 'huevos').length, 1);
});
test('solo de las secciones que puede abrir', () => {
  const solo = armarIndice(est, { secciones: [{ k: 'gym', icono: '🏋️', nombre: 'Gym' }] });
  assert.equal(buscar(solo, 'uñas').length, 0);
  assert.equal(buscar(solo, 'almuerzo').length, 0);
  assert.equal(buscar(solo, 'press').length, 1);
});
test('varias palabras en cualquier orden; vacío no da nada', () => {
  assert.equal(buscar(indice, 'uñas cortar').length, 1);
  assert.deepEqual(buscar(indice, '   '), []);
  assert.equal(buscar(indice, 'gym')[0].tipo, 'Sección');
});
