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

import { estadoCobro, resumenNegocio, nuevoCiclo, semanasCiclo, tablaCiclo, semanaDeCiclo, preguntasCheckin, comparacionValoraciones, pesosCliente, plantillaDe, clienteDePlantilla, htmlPlan } from '../src/clientes.js';

test('clientes: estado del cobro (mensual, quincenal, único, pausa) y el tablero del negocio', () => {
  const c = nuevoCliente('Ana');
  assert.equal(estadoCobro(c, '2026-11-13').estado, 'sin-plan');
  c.cobro = { precio: 150000, cada: 'mes', inicio: '2026-11-10', pagos: [] };
  assert.equal(estadoCobro(c, '2026-11-13').estado, 'vencido'); // nunca ha pagado y ya pasó el primer cobro
  assert.equal(estadoCobro(c, '2026-11-10').estado, 'pronto'); // el día del primer cobro aún no está vencido
  c.cobro.pagos.push({ fecha: '2026-11-10', monto: 150000 });
  let s = estadoCobro(c, '2026-11-13');
  assert.deepEqual([s.estado, s.proximo, s.faltan], ['al-dia', '2026-12-10', 27]);
  assert.equal(estadoCobro(c, '2026-12-06').estado, 'pronto');
  assert.equal(estadoCobro(c, '2026-12-11').estado, 'vencido');
  c.cobro.pausa = true;
  assert.equal(estadoCobro(c, '2026-12-11').estado, 'pausa');
  const q = { ...nuevoCliente('Q'), cobro: { precio: 80000, cada: 'quincena', inicio: '2026-11-01', pagos: [{ fecha: '2026-11-01', monto: 80000 }] } };
  assert.equal(estadoCobro(q, '2026-11-13').proximo, '2026-11-16');
  const u = { ...nuevoCliente('U'), cobro: { precio: 300000, cada: 'unico', inicio: '2026-11-01', pagos: [{ fecha: '2026-11-02', monto: 300000 }] } };
  assert.equal(estadoCobro(u, '2027-03-01').estado, 'al-dia');
  c.cobro.pausa = false;
  const r = resumenNegocio([c, q, u, nuevoCliente('Sin plan')], '2026-11-13');
  assert.equal(r.clientes, 4);
  assert.equal(r.activos, 3);
  assert.equal(r.cobradoMes, 530000);
  assert.equal(r.pronto, 1); // la quincena vence el 16 (en 3 días)
  assert.equal(r.porCobrar, 80000);
  assert.equal(resumenNegocio([c, q], '2026-11-14').porCobrar, 80000); // la quincena vence en 2 días
});

test('clientes: el ciclo de 12 semanas con fases, semana actual y revisiones', () => {
  const ci = nuevoCiclo('2026-11-16');
  assert.equal(semanasCiclo(ci), 12);
  assert.deepEqual(ci.fases.map((x) => x.nombre + ' ' + x.semanas), ['Base 4', 'Progresión 4', 'Descarga 1', 'Intensificación 3']);
  const t = tablaCiclo(ci, '2026-12-01');
  assert.equal(t.length, 12);
  assert.equal(t[2].actual, true); // 30 nov – 6 dic es la semana 3
  assert.deepEqual(t.filter((x) => x.revision).map((x) => x.n), [1, 4, 8, 9, 12]);
  assert.equal(semanaDeCiclo(ci, '2026-12-01').fase.nombre, 'Base');
  assert.equal(semanaDeCiclo(ci, '2027-01-12').fase.nombre, 'Descarga');
  assert.deepEqual(semanaDeCiclo(ci, '2026-11-13'), { antes: true, faltan: 3 });
  assert.equal(semanaDeCiclo(ci, '2027-03-01').terminado, true);
  ci.fases[0].semanas = 2; // al cambiar las semanas, todo se recorre
  assert.equal(semanasCiclo(ci), 10);
  assert.equal(semanaDeCiclo(ci, '2026-12-01').fase.nombre, 'Progresión');
});

test('clientes: check-in, valoraciones, peso y plantillas', () => {
  const c = nuevoCliente('Juan Pérez');
  c.ciclo = nuevoCiclo('2026-11-09');
  const t = preguntasCheckin(c, '2026-11-13');
  assert.match(t, /^Hola Juan 👋 Check-in de la semana 1 \(Base\)/);
  assert.match(t, /1\. ⚖️/);
  c.valoraciones = [{ fecha: '2026-11-01', peso: 80, cintura: 90, sentadilla: 100 }, { fecha: '2026-12-01', peso: 77.5, cintura: 86, sentadilla: 110, brazo: 35 }];
  assert.deepEqual(comparacionValoraciones(c.valoraciones).map((x) => [x.k, x.cambio]), [['peso', -2.5], ['cintura', -4], ['sentadilla', 10]]);
  c.checkins = [{ fecha: '2026-11-15', peso: 79 }, { fecha: '2026-11-22' }];
  assert.deepEqual(pesosCliente(c).map((x) => x.peso), [80, 79, 77.5]);
  // Plantilla: lleva rutina, comidas y fases; el cliente nuevo empieza su ciclo el próximo lunes, sin pagos ni check-ins
  c.rutina = copiarRutina(RUTINA, [RUTINA[0].id]);
  const pl = plantillaDe(c, 'Hipertrofia');
  const n = clienteDePlantilla(pl, 'Ana', '2026-11-13');
  assert.equal(n.nombre, 'Ana');
  assert.equal(n.rutina[0].ejercicios.length, c.rutina[0].ejercicios.length);
  assert.notEqual(n.rutina[0].id, c.rutina[0].id);
  assert.equal(n.ciclo.inicio, '2026-11-16');
  assert.equal(n.checkins, undefined);
  // El PDF escapa lo que escribiste
  c.nota = '<script>x</script>';
  const html = htmlPlan(c, { alimentos: [], planes: {} }, '2026-11-13');
  assert.ok(html.includes('&lt;script&gt;') && !html.includes('<script>'));
  assert.match(html, /Ciclo de 12 semanas/);
});
