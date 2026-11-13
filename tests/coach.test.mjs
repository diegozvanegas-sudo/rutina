import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RUTINA } from '../src/datos_iniciales.js';
import { ALIMENTOS, PLANES } from '../src/datos_dieta.js';
import { nuevoCliente, copiarRutina, copiarDieta, nuevoCiclo } from '../src/clientes.js';
import { planParaPublicar, aplicarPlan, volverAntes, planNuevo, resumenAvance, checkinsNuevos } from '../src/coach.js';

const dieta = () => ({ alimentos: JSON.parse(JSON.stringify(ALIMENTOS)), planes: JSON.parse(JSON.stringify(PLANES)), config: { kcalKg: {}, protKg: { superior: 2 } } });

test('coach: el plan publicado lleva rutina, comidas, ciclo y los alimentos que usa (también los tuyos propios)', () => {
  const dt = dieta();
  dt.alimentos.push({ id: 'propio', nombre: 'Arepa de mi casa', por: 'u', p: 3, g: 2, c: 20, kcal: 110, grupo: 'carbo' });
  const c = nuevoCliente('Ana');
  c.rutina = copiarRutina(RUTINA, [RUTINA[0].id]);
  copiarDieta(dt, c, ['superior']);
  c.dieta.planes.superior.comidas[0].items.push({ alimento: 'propio', cant: 2 });
  c.ciclo = nuevoCiclo('2026-11-16');
  const p = planParaPublicar(c, dt, '2026-11-13');
  assert.equal(p.nombre, 'Ana');
  assert.equal(p.rutina.length, 1);
  assert.deepEqual(Object.keys(p.dieta.planes), ['superior']);
  assert.ok(p.alimentos.some((a) => a.id === 'propio'));
  // Solo los que usan sus comidas
  const usados = new Set(Object.values(p.dieta.planes).flatMap((x) => x.comidas.flatMap((m) => m.items.map((i) => i.alimento))));
  assert.ok(p.alimentos.every((x) => usados.has(x.id)) && p.alimentos.length === usados.size);
  assert.equal(p.ciclo.fases.length, 4);
  p.rutina[0].nombre = 'cambiado';
  assert.notEqual(c.rutina[0].nombre, 'cambiado'); // es una copia
});

test('coach: el cliente usa el plan, conserva su core, recibe los alimentos que le faltan y puede volver a lo de antes', () => {
  const dt = dieta(), c = nuevoCliente('Ana');
  c.rutina = copiarRutina(RUTINA, [RUTINA[0].id]);
  copiarDieta(dt, c, ['superior']);
  dt.alimentos.push({ id: 'propio', nombre: 'Arepa', por: 'u', p: 3, g: 2, c: 20, kcal: 110, grupo: 'carbo' });
  c.dieta.planes.superior.comidas[0].items.push({ alimento: 'propio', cant: 2 });
  const a = { id: 'a1', plan: planParaPublicar(c, dt), plan_version: 100 };
  const est = { rutina: JSON.parse(JSON.stringify(RUTINA)), dieta: dieta(), semanas: {}, dias: {} };
  const miaAntes = JSON.stringify(est.rutina);
  assert.equal(planNuevo(est, a), true);
  assert.deepEqual(aplicarPlan(est, a), { dias: 1, planes: 1 }); // el core no cuenta como día de gym
  assert.equal(est.rutina[0].id, c.rutina[0].id);
  assert.ok(est.rutina.some((d) => d.id === 'core')); // su core se queda
  assert.ok(est.dieta.alimentos.some((x) => x.id === 'propio'));
  assert.equal(planNuevo(est, a), false);
  assert.equal(planNuevo(est, { ...a, plan_version: 101 }), true); // el entrenador publicó otra versión
  // Usar otra versión no pisa la copia de lo de antes
  aplicarPlan(est, { ...a, plan_version: 101 });
  assert.ok(volverAntes(est));
  assert.equal(JSON.stringify(est.rutina), miaAntes);
  assert.equal(volverAntes(est), false);
});

test('coach: el resumen que ve el entrenador (series por semana, peso, sueño, check-ins) y los check-ins nuevos', () => {
  const est = { rutina: JSON.parse(JSON.stringify(RUTINA)), semanas: { 3: { 'd1-1-1': { reps: '6', peso: '40', unidad: 'kg' } } }, dias: { '2026-11-10': { peso: 80 }, '2026-11-12': { peso: 79.5, sueno: { acoste: '23:00', levante: '06:30' } } },
    miEntrenador: { checkins: [{ id: 'k1', fecha: '2026-11-12', peso: 79.5 }] } };
  const r = resumenAvance(est, 3, '2026-11-13');
  assert.deepEqual(r.semanas.map((x) => x.n), [1, 2, 3]);
  assert.equal(r.semanas[2].hechas, 1);
  assert.deepEqual(r.pesos.map((x) => x.peso), [80, 79.5]);
  assert.equal(r.sueno, 7.5);
  assert.equal(r.checkins.length, 1);
  assert.equal(r.rutina, undefined); // nada de sus datos completos
  const c = { checkins: [{ id: 'k0' }] };
  assert.deepEqual(checkinsNuevos(c, { checkins: [{ id: 'k0' }, { id: 'k1' }] }).map((x) => x.id), ['k1']);
});
