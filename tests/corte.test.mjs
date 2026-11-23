import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALIMENTOS, PLANES, CONFIG_DIETA } from '../src/datos_dieta.js';
import { totalPlan, macrosPorKg } from '../src/dieta.js';
import { CORTE, macrosCorte, planCorte, empezarCorte, terminarCorte, estadoCorte, promedioSemana } from '../src/corte.js';

const copia = (o) => JSON.parse(JSON.stringify(o));
// La dieta de partida de una cuenta (como dietaInicial de estado.js)
function dieta() {
  const d = { config: copia(CONFIG_DIETA), alimentos: copia(ALIMENTOS), planes: copia(PLANES), anterior: null };
  Object.assign(d.config, macrosPorKg(d.planes, d.alimentos, d.config.pesoBase));
  d.config.protFija = 185;
  return d;
}

test('con 87 kg: pierna ~2.150, torso ~2.000, descanso ~1.700 y fútbol ~2.400 kcal, 200 g de proteína y 57 g de grasa', () => {
  const m = macrosCorte(87);
  for (const [t, k] of [['inferior', 2150], ['superior', 2000], ['descanso', 1700], ['futbol', 2400]]) assert.ok(Math.abs(m[t].kcal - k) <= 15, t + ': ' + m[t].kcal);
  assert.equal(m.descanso.p, 200);
  assert.equal(m.descanso.g, 57);
  assert.ok(m.futbol.c > m.inferior.c && m.inferior.c > m.superior.c && m.superior.c > m.descanso.c);
});

test('la proteína nunca baja: una proteína fija mayor que 2,3 g/kg se queda; y los carbos tienen un mínimo', () => {
  assert.equal(macrosCorte(70, 185).descanso.p, 185);
  const flaco = macrosCorte(50);
  for (const t of Object.keys(CORTE.kcalKg)) assert.ok(flaco[t].c >= Math.round(CORTE.carbMinKg * 50));
});

test('planCorte recalcula los planes cerca de lo que pide cada día sin tocar la recarga', () => {
  const d = dieta(), r = planCorte(d, 87);
  const tipos = r.resultados.map(([t]) => t);
  assert.ok(!tipos.includes('recarga'));
  for (const [t, x] of r.resultados) {
    assert.ok(Math.abs(x.despues.kcal - r.objetivos[t].kcal) < 120, t + ': ' + Math.round(x.despues.kcal) + ' vs ' + r.objetivos[t].kcal);
    assert.ok(x.despues.p >= x.antes.p - 5, t + ': la proteína no baja');
  }
  assert.deepEqual(d.planes, PLANES, 'planCorte solo calcula: no cambia nada');
});

test('empezar y terminar: guarda tus macros de antes, cambia los planes y al terminar vuelven (con el peso nuevo)', () => {
  const d = dieta(), antes = copia(d.config), semanaAntes = promedioSemana(d.planes, d.alimentos);
  const r = empezarCorte(d, 87, '2026-11-22');
  assert.equal(d.corte.inicio, '2026-11-22');
  assert.equal(d.corte.fin, '2027-01-03');
  assert.deepEqual(d.corte.antes.carbKg, antes.carbKg);
  assert.equal(d.config.recarga, undefined);
  assert.equal(d.config.carbKg.recarga, antes.carbKg.recarga, 'la recarga queda igual');
  assert.equal(d.config.meta, antes.meta, 'lo demás de la configuración no se pierde');
  assert.equal(d.anterior, null);
  assert.ok(r.resultados.length >= 4);
  const semanaCorte = promedioSemana(d.planes, d.alimentos);
  assert.ok(semanaCorte < semanaAntes, semanaCorte + ' < ' + semanaAntes);
  assert.ok(Math.abs(totalPlan(d.planes.descanso, d.alimentos).kcal - 1700) < 120);

  const fin = terminarCorte(d, 84);
  assert.equal(d.corte, undefined);
  assert.equal(fin.fue.inicio, '2026-11-22');
  assert.deepEqual(d.config.carbKg, antes.carbKg);
  assert.equal(d.config.protFija, 185);
  assert.equal(d.config.pesoBase, 84);
  assert.equal(terminarCorte(d, 84), null, 'sin corte no hace nada');
});

test('estadoCorte: semana, días que faltan, kg bajados y cuándo se pasa de las 6 semanas', () => {
  const d = dieta();
  assert.equal(estadoCorte(d, '2026-11-22', 87), null);
  empezarCorte(d, 87, '2026-11-01');
  const e = estadoCorte(d, '2026-11-22', 85.4);
  assert.equal(e.semana, 4);
  assert.equal(e.faltan, 21);
  assert.equal(e.bajado, 1.6);
  assert.equal(e.vencido, false);
  const tarde = estadoCorte(d, '2026-12-20', null);
  assert.equal(tarde.vencido, true);
  assert.equal(tarde.semana, 6);
  assert.equal(tarde.bajado, null);
});
