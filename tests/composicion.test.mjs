import { test } from 'node:test';
import assert from 'node:assert/strict';
import { limpiarControl, guardarControl, borrarControl, controlesDe, completar, comparar, conclusion, textoComparacion } from '../src/composicion.js';

// El registro de evolución de una nutricionista (30 jul → 19 nov 2026, 112 días)
const A = { fecha: '2026-07-30', peso: 75.8, imc: 25.1, grasa: 24.2, musculo: 37, visceral: 9, cintura: 81.2 };
const B = { fecha: '2026-11-19', peso: 74.2, imc: 24.6, grasa: 21.7, musculo: 38.4, visceral: 8, cintura: 79.4 };

test('limpiar: coma o punto, fuera de rango no se guarda, sin fecha o sin datos es null', () => {
  assert.deepEqual(limpiarControl({ fecha: '2026-07-30', peso: '75,8', grasa: '24.2', musculo: '', visceral: '9', cintura: '900', quien: '  Nutri ' }),
    { fecha: '2026-07-30', peso: 75.8, grasa: 24.2, visceral: 9, quien: 'Nutri' });
  assert.equal(limpiarControl({ fecha: '', peso: 70 }), null);
  assert.equal(limpiarControl({ fecha: '2026-07-30' }), null);
});

test('guardar, editar, ordenar y borrar en dieta.controles', () => {
  const d = {};
  const b = guardarControl(d, B), a = guardarControl(d, A);
  assert.deepEqual(controlesDe(d).map((c) => c.fecha), ['2026-07-30', '2026-11-19']);
  guardarControl(d, { ...A, peso: 76 }, a.id);
  assert.equal(d.controles.length, 2);
  assert.equal(d.controles.find((c) => c.id === a.id).peso, 76);
  assert.ok(borrarControl(d, b.id));
  assert.equal(d.controles.length, 1);
  assert.equal(borrarControl(d, 'no'), false);
});

test('completar: kg de grasa y músculo; IMC con la estatura solo si no lo anotaron', () => {
  const x = completar(A, 170);
  assert.equal(x.grasaKg, 18.34);
  assert.equal(x.musculoKg, 28.05);
  assert.equal(x.imc, 25.1);
  assert.equal(completar({ fecha: '2026-07-30', peso: 72.25 }, 170).imc, 25);
});

test('comparar: las mismas variaciones del registro, con el sentido de cada una', () => {
  const c = comparar(A, B, { bajar: true });
  assert.equal(c.dias, 112);
  const dif = Object.fromEntries(c.filas.map((f) => [f.k, [f.dif, f.bien]]));
  assert.deepEqual(dif, { peso: [-1.6, true], imc: [-0.5, true], grasa: [-2.5, true], musculo: [1.4, true], visceral: [-1, true], cintura: [-1.8, true] });
  const kg = Object.fromEntries(c.derivados.map((f) => [f.k, f.dif]));
  assert.equal(kg.grasaKg, -2.24);
  assert.equal(kg.musculoKg, 0.44);
  // Si la meta es subir, bajar de peso no es "bien"
  assert.equal(comparar(A, B, { bajar: false }).filas[0].bien, false);
});

test('conclusión: recomposición, lo que el % esconde y ritmos realistas', () => {
  const cmp = comparar(A, B), out = conclusion(cmp, { estatura: 170 });
  const tipos = out.map((x) => x.tipo);
  assert.equal(tipos[0], 'recomposicion');
  const pct = out.find((x) => x.tipo === 'porcentaje');
  assert.match(pct.d, /0,8 salen solo de pesar menos/);
  assert.match(pct.d, /0,44 kg/);
  assert.match(out.find((x) => x.tipo === 'ritmo-grasa').t, /0,14 kg por semana/);
  assert.match(out.find((x) => x.tipo === 'ritmo-musculo').d, /Realista/);
  assert.match(out.find((x) => x.tipo === 'cintura').d, /menos de 85 cm \(ya estás\)/);
  assert.ok(tipos.includes('visceral') && tipos.includes('medicion'));
  const t = textoComparacion(cmp, out);
  assert.match(t, /112 días/);
  assert.match(t, /Músculo en kg: 28,1 kg → 28,5 kg \(\+0,44\) ✅/);
  assert.doesNotMatch(t, /bioimpedancia/);
});

test('conclusión: músculo que sube demasiado rápido se marca como dudoso; pérdida de músculo avisa', () => {
  const rapido = conclusion(comparar({ fecha: '2026-01-01', peso: 80, grasa: 20, musculo: 35 }, { fecha: '2026-02-01', peso: 80, grasa: 18, musculo: 37.5 }));
  assert.match(rapido.find((x) => x.tipo === 'ritmo-musculo').d, /agua/);
  const pierde = conclusion(comparar({ fecha: '2026-01-01', peso: 80, grasa: 20, musculo: 40 }, { fecha: '2026-03-01', peso: 76, grasa: 19, musculo: 39 }));
  assert.equal(pierde[0].tipo, 'perdida-musculo');
  const soloPeso = conclusion(comparar({ fecha: '2026-01-01', peso: 80 }, { fecha: '2026-03-01', peso: 78 }));
  assert.equal(soloPeso[0].tipo, 'solo-peso');
  assert.equal(conclusion(comparar(A, { ...B, fecha: A.fecha }))[0].t, 'Son del mismo día');
});
