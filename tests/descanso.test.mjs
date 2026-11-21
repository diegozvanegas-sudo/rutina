import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e, empezarDePrueba, sesionesDeFecha, descansaEl, tipoDietaAuto } from '../src/estado.js';
import { alternarDescanso, moverSesion, destinosPosibles, descansosSemana, diasSeguidos, sugerirDescanso, fechaDeSesion } from '../src/descanso.js';
import { rutinaDe } from '../src/descarga.js';
import { resumenSemana } from '../src/gym.js';
import { lunesDe, sumarDias, semanaDe, diaSemana } from '../src/fechas.js';
empezarDePrueba(true);

const sem = 40, lunes = lunesDe(sem), f = (i) => sumarDias(lunes, i); // f(0) lunes … f(6) domingo
const sesion = (n) => e().rutina.find((x) => x.id !== 'core' && x.diaSemana === n);

test('descansar un día: sin sesión, la comida de descanso y la semana no lo cuenta como pendiente', () => {
  const lun = sesion(1);
  assert.ok(lun, 'la rutina de ejemplo tiene lunes');
  assert.deepEqual(sesionesDeFecha(f(0)), [lun]);
  const plan = resumenSemana(rutinaDe(e().rutina, sem, e()), {}).plan;
  assert.equal(alternarDescanso(f(0)), true);
  assert.equal(descansaEl(f(0)), true);
  assert.deepEqual(sesionesDeFecha(f(0)), []);
  if (!e().config.futbol.includes(1)) assert.equal(tipoDietaAuto(f(0)), 'descanso');
  const lunSeries = lun.ejercicios.reduce((s, ej) => s + ej.filas.reduce((t, x) => t + x.series, 0), 0);
  assert.equal(resumenSemana(rutinaDe(e().rutina, sem, e()), {}).plan, plan - lunSeries);
  assert.equal(alternarDescanso(f(0)), false); // quitarlo vuelve todo
  assert.deepEqual(sesionesDeFecha(f(0)), [lun]);
});

test('pasar el entreno a otro día: allá se hace y sigue contando en la semana', () => {
  const lun = sesion(1), plan = resumenSemana(rutinaDe(e().rutina, sem, e()), {}).plan;
  // El jueves de la rutina de ejemplo no tiene gym: ahí se pasa el lunes
  const jueves = f(3);
  moverSesion(f(0), jueves);
  assert.equal(descansaEl(f(0)), true);
  assert.ok(sesionesDeFecha(jueves).includes(lun));
  assert.deepEqual(sesionesDeFecha(f(0)), []);
  assert.equal(resumenSemana(rutinaDe(e().rutina, sem, e()), {}).plan, plan);
  moverSesion(f(0), ''); // sin mover: descansa y ya
  assert.ok(!sesionesDeFecha(jueves).includes(lun));
  alternarDescanso(f(0));
});

test('a dónde se puede pasar: los días que quedan de esa semana', () => {
  assert.deepEqual(destinosPosibles(f(2), f(1)), [f(1), f(3), f(4), f(5), f(6)]);
  assert.deepEqual(destinosPosibles(f(6), f(6)), []);
  assert.equal(fechaDeSesion({ diaSemana: 3 }, sem), f(2));
  assert.equal(fechaDeSesion({}, sem), null);
});

test('descansos de la semana: los días sin gym ni fútbol', () => {
  const x = descansosSemana(sem);
  for (const d of x.descanso) assert.ok(!sesionesDeFecha(d).length && !e().config.futbol.includes(diaSemana(d)));
  assert.equal(x.futbol.length, e().config.futbol.length);
  alternarDescanso(f(0));
  const y = descansosSemana(sem);
  assert.ok(y.marcados.includes(f(0)));
  assert.ok(y.descanso.includes(f(0)) || e().config.futbol.includes(1));
  alternarDescanso(f(0));
});

test('días seguidos con gym o fútbol y el aviso para descansar', () => {
  const est = { config: { futbol: [] }, dias: {}, rutina: e().rutina };
  const hoy = '2026-11-20';
  for (let i = 1; i <= 7; i++) est.dias[sumarDias(hoy, -i)] = { entreno: { inicio: 1 } };
  // En la función se miran las sesiones de hoy con el estado de la app: sin entreno hoy, cuenta lo que ya pasó
  assert.ok(diasSeguidos(sumarDias(hoy, -1), est) >= 7);
  const s = sugerirDescanso(sumarDias(hoy, -1), est);
  assert.ok(s && s.dias >= 6);
  est.dias[sumarDias(hoy, -4)] = {};
  assert.equal(diasSeguidos(sumarDias(hoy, -1), est), 3);
  assert.equal(sugerirDescanso(sumarDias(hoy, -1), est), null);
  void semanaDe;
});
