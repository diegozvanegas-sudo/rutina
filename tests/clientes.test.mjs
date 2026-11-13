import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RUTINA } from '../src/datos_iniciales.js';
import { ALIMENTOS, PLANES, CONFIG_DIETA } from '../src/datos_dieta.js';
import { totalPlan } from '../src/dieta.js';
import { nuevoCliente, copiarRutina, copiarDieta, recalcularCliente, formulaCliente, objetivoCliente, textoCliente, OBJETIVOS_CLIENTE } from '../src/clientes.js';
import { enOrden } from '../src/orden.js';

const dieta = () => ({ alimentos: JSON.parse(JSON.stringify(ALIMENTOS)), planes: JSON.parse(JSON.stringify(PLANES)), config: { ...JSON.parse(JSON.stringify(CONFIG_DIETA)), carbKg: { superior: 2.2, inferior: 3, descanso: 1.2, futbol: 3.3, recarga: 3.5 }, grasaKg: { superior: 0.8, inferior: 0.7, descanso: 1, futbol: 0.7, recarga: 0.6 }, protFija: 180 } });

test('clientes: copiar tu rutina sin registros, con ids nuevos y sin tocar la tuya', () => {
  const mia = JSON.parse(JSON.stringify(RUTINA));
  mia[0].ejercicios[0].filas[0].ultimo = { peso: '40', reps: '10' };
  mia[0].ejercicios[0].nota = 'Mi nota';
  mia[0].ejercicios[0].variantes = ['A', 'B'];
  const antes = JSON.stringify(mia);
  const copia = copiarRutina(mia);
  assert.equal(JSON.stringify(mia), antes); // la tuya no cambia
  assert.ok(!copia.some((d) => d.id === 'core' && !d.ejercicios.length));
  const ej = copia[0].ejercicios[0];
  assert.equal(ej.nombre, mia[0].ejercicios[0].nombre);
  assert.equal(ej.nota, '');
  assert.equal(ej.variantes, undefined);
  assert.equal(ej.filas[0].ultimo, undefined);
  // Ningún id se repite con los tuyos
  const mios = new Set(mia.flatMap((d) => [d.id, ...d.ejercicios.flatMap((x) => [x.id, ...x.filas.map((f) => f.id)])]));
  assert.ok(copia.flatMap((d) => [d.id, ...d.ejercicios.flatMap((x) => [x.id, ...x.filas.map((f) => f.id)])]).every((id) => !mios.has(id)));
  // Solo los días elegidos; duplicar un cliente conserva sus notas
  assert.equal(copiarRutina(mia, [mia[1].id]).length, 1);
  assert.equal(copiarRutina(mia, null, { notas: true })[0].ejercicios[0].nota, 'Mi nota');
});

test('clientes: el plan de comida se ajusta a su peso y a su objetivo', () => {
  const dt = dieta(), c = nuevoCliente('Ana');
  // Sin peso: se copia tal cual
  assert.equal(copiarDieta(dt, c), false);
  assert.deepEqual(Object.keys(c.dieta.planes), ['superior', 'inferior', 'descanso']);
  assert.equal(JSON.stringify(c.dieta.planes.superior), JSON.stringify(dt.planes.superior));
  // Con 60 kg: la proteína sale de su peso (no de tu proteína fija) y las cantidades bajan
  c.peso = 60;
  assert.equal(formulaCliente(dt.config, c).protFija, undefined);
  const obj = objetivoCliente(dt.config, c, 'superior');
  assert.equal(obj.p, Math.round(dt.config.protKg.superior * 60));
  assert.ok(recalcularCliente(dt, c));
  const tot = totalPlan(c.dieta.planes.superior, dt.alimentos);
  assert.ok(Math.abs(tot.p - obj.p) / obj.p < 0.15, 'proteína cerca del objetivo: ' + tot.p + ' vs ' + obj.p);
  assert.ok(tot.kcal < totalPlan(dt.planes.superior, dt.alimentos).kcal);
  // Ganar músculo da más calorías que bajar grasa, con la misma proteína, y queda en un rango de superávit (no de déficit)
  const g = objetivoCliente(dt.config, { ...c, ajuste: OBJETIVOS_CLIENTE.grasa[1] }, 'superior'), m = objetivoCliente(dt.config, { ...c, ajuste: OBJETIVOS_CLIENTE.musculo[1] }, 'superior');
  assert.ok(m.kcal > g.kcal && m.p === g.p);
  assert.ok(m.kcal / 60 > 33 && m.kcal / 60 < 40, 'ganar músculo: ' + Math.round(m.kcal / 60) + ' kcal/kg');
  // Tus planes no cambian
  assert.equal(JSON.stringify(dt.planes.superior), JSON.stringify(PLANES.superior));
});

test('clientes: el texto para WhatsApp lleva la rutina por día y las comidas con cantidades', () => {
  const dt = dieta(), c = nuevoCliente('Juan');
  c.objetivo = 'musculo'; c.nota = 'Rodilla izquierda sensible';
  c.rutina = copiarRutina(RUTINA, [RUTINA[0].id]);
  copiarDieta(dt, c, ['superior']);
  const t = textoCliente(c, dt);
  assert.match(t, /^\*Plan de Juan\*/);
  assert.match(t, /Ganar músculo/);
  assert.match(t, new RegExp(RUTINA[0].ejercicios[0].nombre.replace(/[()/]/g, '.')));
  assert.match(t, /Top 1×4-7/);
  assert.match(t, /ALIMENTACIÓN/);
  assert.match(t, /\d+ g /);
  assert.match(t, /Rodilla izquierda sensible/);
});

test('clientes: la sección sale en el menú, también en uno ya ordenado', () => {
  assert.ok(enOrden({}, 'menu').includes('clientes'));
  // Un menú guardado antes de que existiera Clientes (al ordenar se guardan todas las secciones)
  const guardado = enOrden({}, 'menu').filter((x) => x !== 'clientes').reverse();
  const ids = enOrden({ orden: { menu: guardado } }, 'menu');
  assert.equal(ids[ids.indexOf('suplementos') + 1], 'clientes');
});
