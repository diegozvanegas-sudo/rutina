import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { RUTINA } from '../src/datos_iniciales.js';
import { datosGym } from '../src/hoja.js';
import { esquemaDe } from '../src/vistas/editar.js';

test('la app manda los días en orden de la semana, el core junto y las reps con "·"', () => {
  const estado = { rutina: RUTINA, semanas: { 2: { 'd1-2-1': { peso: '92,5', unidad: 'kg', reps: '7' }, 'd1-2-2': { peso: '3.5', unidad: 'discos', reps: '10 9' },
    'core-1-1@d1': { reps: '15' }, 'core-1-1@d3': { reps: '15' } } } };
  const g = datosGym(estado, 2);
  assert.deepEqual(g.bloques.map((b) => b.nombre), ['Torso A', 'Pierna A', 'Empuje + Bíceps', 'Tirón + Tríceps', 'Pierna B']);
  assert.equal(g.bloques[0].filas.length, 12);
  assert.deepEqual(g.bloques[0].filas[2], { ejercicio: 'Remo T / hammer abierto', tipo: 'Top', peso: '92,5', reps: '7' });
  assert.equal(g.bloques[0].filas[3].peso, '3.5 discos');
  assert.equal(g.bloques[0].filas[3].reps, '10 · 9');
  assert.equal(g.core.filas[0].reps, '15 · 15');
});

test('el editor muestra el esquema como se escribe', () => {
  assert.equal(esquemaDe(RUTINA[0].ejercicios[0]), 'Top 1×4-7 · Back-off 2×8-12');
  assert.equal(esquemaDe(RUTINA[0].ejercicios[4]), '4×10 + fallo');
});

// Hoja simulada con la forma de "Rutina 2.0": fila 4 con las semanas, bloques DÍA/CORE, filas de cardio en medio
function hojaFalsa() {
  const fila = (a, c) => { const r = Array(14).fill(''); r[0] = a; r[2] = c; return r; };
  const filas = [fila('RUTINA'), fila('nota'), fila('SEMANA 2'), Object.assign(fila(''), { 9: 'Sem 3 · 26 oct', 11: 'Sem 2 · 19 oct' }), fila('Ejercicio', 'Tipo'),
    fila('DÍA 1 · TORSO A'), fila('Press', 'Top set'), fila('', 'Back-off'), fila('Cardio', 'Cinta'), fila(''),
    fila('DÍA 2 · PIERNA A'), fila('Movilidad previa', 'Calentamiento'), fila('Sentadilla', 'Series'),
    fila('CORE · AL FINAL DE CUALQUIER DÍA'), fila('Crunch', 'Series'), fila('SERIES SEMANALES POR MÚSCULO'), fila('Pecho', '')];
  const escritos = {};
  const rango = (r, c) => ({ setValue(v) { escritos[r + ',' + c] = v; return this; }, setNumberFormat() { return this; } });
  const hoja = { getDataRange: () => ({ getDisplayValues: () => filas }), getRange: rango };
  return { escritos, SpreadsheetApp: { getActive: () => ({ getSheetByName: () => hoja }) } };
}

test('Apps Script: escribe en la columna de la semana, por orden dentro de cada bloque', () => {
  const { escritos, SpreadsheetApp } = hojaFalsa();
  const ctx = vm.createContext({ SpreadsheetApp, ContentService: {}, LockService: {} });
  vm.runInContext(fs.readFileSync(new URL('../apps_script/Codigo.gs', import.meta.url), 'utf8'), ctx);
  const msj = ctx.escribirGym({ semana: 2,
    bloques: [{ filas: [{ peso: '50', reps: '7' }, { peso: '3.5 discos', reps: '10 · 9' }] }, { filas: [{ peso: '', reps: '' }] }],
    core: { filas: [{ peso: '', reps: '15 · 15' }] } });
  // "Sem 2" está en la columna 12 (L): peso en L, reps en M
  assert.deepEqual(escritos, { '7,12': 50, '7,13': '7', '8,12': '3.5 discos', '8,13': '10 · 9', '15,13': '15 · 15' });
  assert.match(msj, /^Semana 2: 3 filas$/);
  assert.throws(() => ctx.escribirGym({ semana: 9, bloques: [] }), /Sem 9/);
});

test('Apps Script: ubica cada día por su nombre aunque llegue en otro orden', () => {
  const { escritos, SpreadsheetApp } = hojaFalsa();
  const ctx = vm.createContext({ SpreadsheetApp, ContentService: {}, LockService: {} });
  vm.runInContext(fs.readFileSync(new URL('../apps_script/Codigo.gs', import.meta.url), 'utf8'), ctx);
  // "Pierna A" primero: debe ir al bloque "DÍA 2 · PIERNA A" (fila 13), no al de torso
  ctx.escribirGym({ semana: 2, bloques: [{ nombre: 'Pierna A', filas: [{ peso: '100', reps: '8' }] }, { nombre: 'Torso A', filas: [{ peso: '50', reps: '6' }] }] });
  assert.deepEqual(escritos, { '13,12': 100, '13,13': '8', '7,12': 50, '7,13': '6' });
});
