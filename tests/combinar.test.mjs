import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinarEstado, limpiarRepetidos } from '../src/combinar.js';
import { PLANES } from '../src/datos_dieta.js';
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

test('dos series idénticas siguen siendo dos al combinar', () => {
  const s = [{ peso: 80, reps: 10 }, { peso: 80, reps: 10 }];
  const u = combinarEstado({ s: [] }, { s }, { s: [...s, { peso: 70, reps: 5 }] }, true);
  assert.equal(u.s.length, 3);
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

test('la limpieza no le cambia nada a los datos que trae la app', () => {
  const datos = { PLANES, SESIONES, RUTINA, HABITOS, finanzas: FINANZAS(), recordatorios: RECORDATORIOS(), sesionesLibros: LIBROS.flatMap((l) => l.sesiones || []) };
  const antes = JSON.stringify(datos);
  assert.equal(JSON.stringify(limpiarRepetidos(JSON.parse(antes))), antes);
});
