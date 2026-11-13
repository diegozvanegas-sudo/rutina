import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinarEstado, limpiarRepetidos } from '../src/combinar.js';
import { PLANES, ALIMENTOS } from '../src/datos_dieta.js';
import { quitarComidasRepetidas } from '../src/dieta.js';
import { SESIONES, RUTINA, HABITOS } from '../src/datos_iniciales.js';
import { FINANZAS, RECORDATORIOS } from '../src/datos_finanzas.js';
import { LIBROS } from '../src/libros/index.js';

const base = {
  dias: { '2026-11-01': { habitos: {}, metas: { agua: 1 } } },
  finanzas: { movimientos: [{ id: 'm1', monto: 10 }, { id: 'm2', monto: 20 }] },
  recordatorios: { lista: [{ id: 'r1', nombre: 'Aceite', hechos: [{ fecha: '2026-10-01' }] }], vehiculos: [] },
  config: { nombre: 'Ana', sonido: true }, cambio: 5,
};
const copia = () => JSON.parse(JSON.stringify(base));

test('el caso que antes perdía datos: un hábito aquí y un gasto allá quedan los dos', () => {
  const l = copia(), r = copia();
  l.dias['2026-11-01'].habitos.chia = { ts: 1 };
  r.finanzas.movimientos.push({ id: 'm3', monto: 30 });
  const u = combinarEstado(base, l, r, false);
  assert.ok(u.dias['2026-11-01'].habitos.chia);
  assert.deepEqual(u.finanzas.movimientos.map((m) => m.id), ['m1', 'm2', 'm3']);
});

test('lo borrado en un lado no revive, salvo que el otro lado lo haya editado', () => {
  const l = copia(), r = copia();
  l.finanzas.movimientos = l.finanzas.movimientos.filter((m) => m.id !== 'm1');
  r.finanzas.movimientos.find((m) => m.id === 'm2').monto = 99;
  r.config.sonido = false;
  let u = combinarEstado(base, l, r, true);
  assert.deepEqual(u.finanzas.movimientos.map((m) => [m.id, m.monto]), [['m2', 99]]);
  const l2 = copia(), r2 = copia();
  l2.finanzas.movimientos.find((m) => m.id === 'm1').monto = 77;
  r2.finanzas.movimientos = r2.finanzas.movimientos.filter((m) => m.id !== 'm1');
  u = combinarEstado(base, l2, r2, false);
  assert.ok(u.finanzas.movimientos.some((m) => m.id === 'm1' && m.monto === 77));
  const l3 = copia(), r3 = copia();
  delete l3.dias['2026-11-01'];
  r3.config.nombre = 'Otra';
  u = combinarEstado(base, l3, r3, false);
  assert.equal(u.dias['2026-11-01'], undefined);
  assert.equal(u.config.nombre, 'Otra');
});

test('si los dos cambian lo mismo, gana el último en guardar', () => {
  const l = copia(), r = copia();
  l.config.nombre = 'Aquí'; r.config.nombre = 'Allá';
  assert.equal(combinarEstado(base, l, r, true).config.nombre, 'Aquí');
  assert.equal(combinarEstado(base, l, r, false).config.nombre, 'Allá');
});

test('registros sin id se unen sin repetir y quedan en orden de fecha', () => {
  const l = copia(), r = copia();
  l.recordatorios.lista[0].hechos.push({ fecha: '2026-11-05' });
  r.recordatorios.lista[0].hechos.push({ fecha: '2026-10-20' });
  const u = combinarEstado(base, l, r, false);
  assert.deepEqual(u.recordatorios.lista[0].hechos.map((h) => h.fecha), ['2026-10-01', '2026-10-20', '2026-11-05']);
});

test('sin copia base no se pierde nada: se unen los dos lados', () => {
  const l = copia(), r = copia();
  l.finanzas.movimientos.push({ id: 'a', monto: 1 });
  r.finanzas.movimientos = [{ id: 'b', monto: 2 }];
  const u = combinarEstado(null, l, r, true);
  assert.deepEqual(u.finanzas.movimientos.map((m) => m.id).sort(), ['a', 'b', 'm1', 'm2']);
  assert.equal(u.cambio, undefined);
});

// Como la devuelve la nube (jsonb): las llaves en otro orden
const enOtroOrden = (x) => {
  if (Array.isArray(x)) return x.map(enOtroOrden);
  if (!x || typeof x !== 'object') return x;
  return Object.fromEntries(Object.keys(x).reverse().map((k) => [k, enOtroOrden(x[k])]));
};

test('el orden de las llaves de la nube no duplica las comidas', () => {
  const comidas = [{ nombre: 'Desayuno', items: [{ alimento: 'huevo', cant: 6 }] }, { nombre: 'Cena', items: [{ alimento: 'pollo', cant: 200 }] }];
  const u = combinarEstado(null, { comidas, a: 1 }, { comidas: enOtroOrden(comidas), a: 2 }, true);
  assert.equal(u.comidas.length, 2);
});

test('una lista sin id ni fecha va entera: el plan recalculado en dos equipos no suma comidas', () => {
  const comida = (g) => ({ nombre: 'Cena', items: [{ alimento: 'pollo', cant: g }] });
  const b = { comidas: [comida(200)] }, l = { comidas: [comida(205)] }, r = { comidas: [comida(210)] };
  assert.deepEqual(combinarEstado(b, l, r, true).comidas, l.comidas);
  assert.deepEqual(combinarEstado(null, l, r, false).comidas, r.comidas);
  assert.deepEqual(combinarEstado({ rango: [10, 20] }, { rango: [12, 20] }, { rango: [10, 22] }, true).rango, [12, 20]);
});

test('ninguna lista de los datos de la app crece al combinar sus planes recalculados', () => {
  const datos = { PLANES, SESIONES, RUTINA, HABITOS, finanzas: FINANZAS(), recordatorios: RECORDATORIOS() };
  const l = JSON.parse(JSON.stringify(datos)), r = enOtroOrden(datos);
  for (const p of Object.values(l.PLANES)) p.comidas[0].items[0].cant += 5;
  for (const p of Object.values(r.PLANES)) p.comidas[0].items[0].cant += 10;
  const u = combinarEstado(null, l, r, true);
  assert.equal(JSON.stringify(u.PLANES), JSON.stringify(l.PLANES));
  assert.equal(u.SESIONES.length, SESIONES.length);
  assert.equal(u.RUTINA.length, RUTINA.length);
});

test('la limpieza arregla listas repetidas enteras y registros con fecha iguales', () => {
  const a = { nombre: 'A', items: [] }, b = { nombre: 'B', items: [] };
  const est = limpiarRepetidos({ planes: { x: { comidas: [a, b, enOtroOrden(a), enOtroOrden(b)] } }, km: [{ fecha: '1', km: 5 }, { km: 5, fecha: '1' }, { fecha: '2', km: 9 }] });
  assert.deepEqual(est.planes.x.comidas.map((c) => c.nombre), ['A', 'B']);
  assert.equal(est.km.length, 2);
});

test('la limpieza no toca lo que no está repetido, ni ids ni comidas distintas', () => {
  const con = [{ id: 1, n: 'x' }, { id: 1, n: 'x' }], parcial = [{ n: 1 }, { n: 2 }, { n: 1 }];
  const est = limpiarRepetidos({ con, parcial });
  assert.equal(est.con.length, 2);
  assert.equal(est.parcial.length, 3);
});

test('comidas repetidas con cantidades distintas: queda una de cada una, la más cercana a la meta', () => {
  const alimentos = [{ id: 'pollo', por: 'g', p: 26, g: 3, c: 0, kcal: 100 }, { id: 'huevo', por: 'u', p: 6, g: 5, c: 0, kcal: 75 }];
  const c = (nombre, alimento, cant) => ({ nombre, items: [{ alimento, cant }] });
  const lista = () => ({ comidas: [c('Desayuno', 'huevo', 6), c('Cena', 'pollo', 200), c('Desayuno', 'huevo', 6), c('Cena', 'pollo', 200), c('Cena', 'pollo', 300)] });
  assert.deepEqual(quitarComidasRepetidas(lista(), alimentos, { kcal: 650 }).comidas, [c('Desayuno', 'huevo', 6), c('Cena', 'pollo', 200)]);
  assert.deepEqual(quitarComidasRepetidas(lista(), alimentos, { kcal: 750 }).comidas, [c('Desayuno', 'huevo', 6), c('Cena', 'pollo', 300)]);
});

test('dos comidas con el mismo nombre y alimentos distintos se quedan, y los planes de la app no cambian', () => {
  const alimentos = [{ id: 'a', por: 'u', p: 1, g: 1, c: 1, kcal: 10 }, { id: 'b', por: 'u', p: 1, g: 1, c: 1, kcal: 10 }];
  const plan = { comidas: [{ nombre: 'Merienda', items: [{ alimento: 'a', cant: 1 }] }, { nombre: 'Merienda', items: [{ alimento: 'b', cant: 1 }] }] };
  assert.equal(quitarComidasRepetidas(plan, alimentos, { kcal: 10 }).comidas.length, 2);
  for (const p of Object.values(PLANES)) assert.equal(quitarComidasRepetidas(JSON.parse(JSON.stringify(p)), ALIMENTOS, { kcal: 0 }).comidas.length, p.comidas.length);
});

test('la limpieza no le cambia nada a los datos que trae la app', () => {
  const datos = { PLANES, SESIONES, RUTINA, HABITOS, finanzas: FINANZAS(), recordatorios: RECORDATORIOS(), sesionesLibros: LIBROS.flatMap((l) => l.sesiones || []) };
  const antes = JSON.stringify(datos);
  assert.equal(JSON.stringify(limpiarRepetidos(JSON.parse(antes))), antes);
});

import { tieneDatosPropios } from '../src/combinar.js';

test('celular recién estrenado: los días y semanas vacíos que crea la app no cuentan como datos propios (no se mezcla con la nube)', () => {
  // Lo que queda después de abrir Hoy y el Gym sin anotar nada
  assert.equal(tieneDatosPropios({ dias: { '2026-11-13': { habitos: {}, metas: { agua: 0, pasos: 0, calorias: 0, lectura: 0 }, crono: {} } }, semanas: { 5: {} }, finanzas: { movimientos: [] }, clientes: [] }), false);
  assert.equal(tieneDatosPropios({}), false);
  // Cualquier cosa anotada sí cuenta
  assert.equal(tieneDatosPropios({ dias: { '2026-11-13': { metas: { agua: 500 } } } }), true);
  assert.equal(tieneDatosPropios({ dias: { '2026-11-13': { habitos: { estirar: { ts: 1 } } } } }), true);
  assert.equal(tieneDatosPropios({ semanas: { 5: { 'd1-1-1': { reps: '8' } } } }), true);
  assert.equal(tieneDatosPropios({ dias: { '2026-11-13': { peso: 80 } } }), true);
  assert.equal(tieneDatosPropios({ finanzas: { movimientos: [{ id: 'm1' }] } }), true);
  assert.equal(tieneDatosPropios({ clientes: [{ id: 'c1' }] }), true);
  assert.equal(tieneDatosPropios({ miEntrenador: { checkins: [{ id: 'k1' }] } }), true);
});
