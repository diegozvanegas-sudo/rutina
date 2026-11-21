import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promedioMovil, semanas, ritmoReal, imc, pesoSaludable, caminoMeta, proteinaDia, consejosMeta } from '../src/meta-peso.js';
import { sumarDias } from '../src/fechas.js';

const HOY = '2026-11-20';
// Un pesaje al día durante `dias` días hasta hoy, con un cambio lineal por semana
const serie = (dias, desde, porSemana) => Array.from({ length: dias }, (_, i) => ({ fecha: sumarDias(HOY, i - dias + 1), peso: Math.round((desde + (porSemana / 7) * i) * 10) / 10 }));

test('promedio de 7 días y semana a semana', () => {
  const l = [{ fecha: '2026-11-16', peso: 90 }, { fecha: '2026-11-17', peso: 88 }, { fecha: '2026-11-24', peso: 87 }];
  const pm = promedioMovil(l);
  assert.equal(pm[1].prom, 89);
  assert.equal(pm[2].prom, 87); // el de hace 8 días ya no cuenta
  const s = semanas(l);
  assert.deepEqual(s.map((x) => [x.lunes, x.prom, x.veces]), [['2026-11-16', 89, 2], ['2026-11-23', 87, 1]]);
  assert.equal(s[1].cambio, -2);
});

test('ritmo real por semana', () => {
  assert.ok(Math.abs(ritmoReal(serie(35, 90, -0.5), HOY) + 0.5) < 0.1);
  assert.ok(Math.abs(ritmoReal(serie(35, 87, 0.4), HOY) - 0.4) < 0.1);
  assert.equal(ritmoReal(serie(3, 90, 0), HOY), null); // muy pocos datos
});

test('IMC, peso saludable y proteína', () => {
  assert.equal(Math.round(imc(89, 168).v * 10) / 10, 31.5);
  assert.equal(imc(89, 168).cat, 'Obesidad grado 1');
  assert.equal(imc(70, 168).cat, 'Saludable');
  assert.equal(imc(89, 0), null);
  const s = pesoSaludable(168);
  assert.equal(Math.round(s.min), 52);
  assert.equal(Math.round(s.max), 70);
  assert.deepEqual(proteinaDia(80), { min: 144, max: 176 });
  assert.deepEqual(proteinaDia(110, 80), { min: 158, max: 194 }); // muy por encima de la meta: con la meta como base
});

test('camino a la meta: falta, avance, escenarios y llegada al ritmo real', () => {
  const c = caminoMeta({ lista: serie(35, 92, -0.5), meta: 76, inicio: 92, estatura: 168, hoy: HOY });
  assert.ok(c.falta > 13 && c.falta < 14);
  assert.ok(c.avance > 0.1 && c.avance < 0.2);
  assert.deepEqual(c.escenarios.map((s) => s.kcalDia), [275, 550, 825]);
  assert.ok(Math.abs(c.escenarios[1].semanas - c.falta / 0.5) < 0.01);
  assert.ok(c.real && c.real.semanas > 25 && c.real.semanas < 33);
  assert.equal(c.llego, false);
  // Subiendo: no hay llegada al ritmo real
  const mal = caminoMeta({ lista: serie(35, 87, 0.4), meta: 76, inicio: 87, estatura: 168, hoy: HOY });
  assert.equal(mal.real, null);
  assert.ok(mal.ritmo > 0.3);
  assert.equal(mal.avance, 0);
});

test('consejos: vas al revés, cintura, meta con IMC alto y fútbol', () => {
  const lista = serie(35, 87, 0.4);
  const c = caminoMeta({ lista, meta: 76, inicio: 87, estatura: 168, hoy: HOY });
  const t = consejosMeta(c, { lista, hoy: HOY, cintura: null, estatura: 168, partidos: 2, pasos: 5000 }).map((x) => x.t);
  assert.match(t[0], /Vas al revés/);
  assert.ok(t.some((x) => /Mide tu cintura/.test(x)));
  assert.ok(t.some((x) => /IMC/.test(x)));
  assert.ok(t.some((x) => /fútbol/.test(x)));
  assert.ok(t.some((x) => /Pasos/.test(x)));
  // Llegó a la meta
  const lleg = caminoMeta({ lista: serie(35, 79, -0.8), meta: 76, inicio: 90, estatura: 168, hoy: HOY });
  assert.equal(lleg.llego, true);
  assert.match(consejosMeta(lleg, { lista: serie(35, 79, -0.8), hoy: HOY, cintura: 80, estatura: 168 })[0].t, /Llegaste/);
});

test('ritmo ideal según tu peso: 0,5 % a 0,75 % por semana, tope 1 %', async () => {
  const { ritmoIdeal, comoVaRitmo } = await import('../src/meta-peso.js');
  const r = ritmoIdeal(90);
  assert.equal(r.min, 0.45);
  assert.equal(Math.round(r.max * 100) / 100, 0.68);
  assert.equal(r.tope, 0.9);
  assert.equal(r.kcalMin, 495);
  assert.equal(ritmoIdeal(0), null);
  assert.equal(comoVaRitmo(0.8, 90), 'reves');
  assert.equal(comoVaRitmo(-0.05, 90), 'quieto');
  assert.equal(comoVaRitmo(-0.25, 90), 'lento');
  assert.equal(comoVaRitmo(-0.55, 90), 'ideal');
  assert.equal(comoVaRitmo(-0.85, 90), 'rapido');
  assert.equal(comoVaRitmo(-1.2, 90), 'muy-rapido');
  assert.equal(comoVaRitmo(null, 90), null);
});

test('consejos con la fuerza: bajar sin perderla, o avisar si se pierde', () => {
  const lista = serie(35, 92, -0.55), c = caminoMeta({ lista, meta: 76, inicio: 92, estatura: 168, hoy: HOY });
  const bien = consejosMeta(c, { lista, hoy: HOY, cintura: 90, estatura: 168, fuerza: 0.02 }).map((x) => x.t).join(' | ');
  assert.match(bien, /Bajas sin perder fuerza/);
  assert.match(bien, /ritmo ideal/);
  const mal = consejosMeta(c, { lista, hoy: HOY, cintura: 90, estatura: 168, fuerza: -0.06 }).map((x) => x.t).join(' | ');
  assert.match(mal, /perdiendo fuerza/);
  assert.doesNotMatch(mal, /ritmo ideal/);
  const rapido = serie(35, 95, -1.5), cr = caminoMeta({ lista: rapido, meta: 76, inicio: 95, estatura: 168, hoy: HOY });
  assert.match(consejosMeta(cr, { lista: rapido, hoy: HOY, cintura: 90, estatura: 168 }).map((x) => x.t).join(' | '), /muy rápido/);
});
