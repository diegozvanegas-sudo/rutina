import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e, empezarDePrueba } from '../src/estado.js';
empezarDePrueba(true);
import { sumarDias } from '../src/fechas.js';
import { recta, pronosticoPeso, probarPeso, gastoReal, probarFuerza, pronosticoFuerza, carga, probarCarga, cargasDiarias, promptSemanal, predicciones } from '../src/prediccion.js';

const HOY = '2026-11-16';
// Pesos diarios que bajan 0,5 kg por semana, con un ruido fijo de ± 0,3 kg (como el agua del día a día)
const RUIDO = [0.3, -0.2, 0.1, -0.3, 0.2, 0, -0.1];
const bajando = (dias, porSemana = -0.5, desde = 80) => Array.from({ length: dias }, (_, i) => ({ fecha: sumarDias(HOY, i - dias + 1), peso: Math.round((desde + (porSemana / 7) * i + RUIDO[i % 7]) * 10) / 10 }));

test('recta: pendiente exacta y margen que crece lejos de los datos', () => {
  const r = recta([0, 1, 2, 3, 4].map((x) => ({ x, y: 2 * x + 1 + (x % 2 ? 0.1 : -0.1) })));
  assert.ok(Math.abs(r.b - 2) < 0.05);
  assert.ok(r.predecir(20).margen > r.predecir(2).margen);
  assert.equal(recta([{ x: 1, y: 1 }, { x: 2, y: 2 }]), null);
  assert.equal(recta([{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }]), null);
});

test('peso: con pocos registros pide más; con 4 semanas dice el ritmo, el peso en 4 semanas y cuándo llega a la meta', () => {
  assert.equal(pronosticoPeso(bajando(5), HOY).listo, false);
  assert.match(pronosticoPeso(bajando(5), HOY).texto, /al menos 8 veces/);
  const p = pronosticoPeso(bajando(60), HOY, 75);
  assert.ok(p.listo);
  assert.ok(Math.abs(p.semana + 0.5) < 0.1, 'ritmo ' + p.semana);
  assert.ok(Math.abs(p.en4 - (p.ahora - 2)) < 0.3);
  assert.ok(p.margen > 0 && p.margen < 1.5);
  // De ~75,7 a 75 bajando 0,5/semana: unas 10 semanas... la fecha cae en el futuro y antes de un año
  assert.ok(p.llegada && p.llegada.dias > 0 && p.llegada.dias < 120, JSON.stringify(p.llegada));
  // Meta para el otro lado (subir) mientras baja: no llega
  assert.equal(pronosticoPeso(bajando(60), HOY, 90).llegada, null);
});

test('peso: la prueba contra el pasado gana a "seguirás igual" cuando hay una tendencia de verdad', () => {
  const p = probarPeso(bajando(90));
  assert.ok(p.n >= 3);
  assert.ok(p.modelo < p.sinModelo, JSON.stringify(p));
  // Peso quieto con ruido: la recta no tiene ventaja (y lo dice)
  const quieto = Array.from({ length: 90 }, (_, i) => ({ fecha: sumarDias(HOY, i - 89), peso: 80 + RUIDO[i % 7] }));
  const q = pronosticoPeso(quieto, HOY);
  assert.ok(Math.abs(q.semana) < 0.15);
});

test('gasto real: comiendo 2.000 y bajando 0,5 kg/semana gastas unas 2.550 kcal', () => {
  const lista = bajando(40), comidas = Array.from({ length: 20 }, (_, i) => ({ fecha: sumarDias(HOY, -i - 1), kcal: 2000 }));
  const g = gastoReal(lista, comidas, HOY);
  assert.ok(g.listo);
  assert.ok(Math.abs(g.gasto - 2550) < 120, 'gasto ' + g.gasto);
  assert.ok(g.balance < 0);
  assert.equal(gastoReal(lista, comidas.slice(0, 5), HOY).listo, false);
  assert.match(gastoReal(lista, comidas.slice(0, 5), HOY).texto, /llevas 5/);
  // Datos que no cuadran (comidas sin marcar casi todo): no inventa un gasto
  assert.equal(gastoReal(lista, comidas.map((x) => ({ ...x, kcal: 300 })), HOY).listo, false);
});

test('fuerza: a 4 semanas con margen; avisa cuando se frena', () => {
  const sube = [1, 2, 3, 4, 5, 6].map((s) => ({ semana: s, rm: 100 + 2 * s + (s % 2 ? 0.5 : -0.5), unidad: 'kg' }));
  const f = pronosticoFuerza(sube, 6);
  assert.ok(Math.abs(f.en4 - 120) < 2, 'en 4 semanas ' + f.en4);
  assert.equal(f.aviso, null);
  const quieto = [1, 2, 3, 4, 5].map((s) => ({ semana: s, rm: 100, unidad: 'kg' }));
  assert.ok(pronosticoFuerza(quieto, 5).aviso);
  assert.equal(pronosticoFuerza(sube.slice(0, 3), 3), null);
  const p = probarFuerza([[...sube, { semana: 7, rm: 114, unidad: 'kg' }, { semana: 8, rm: 116, unidad: 'kg' }]]);
  assert.ok(p.n >= 3 && p.modelo < p.sinModelo, JSON.stringify(p));
});

test('carga: 7 días contra 6 semanas; una semana el doble de lo normal es alta', () => {
  const c = {};
  for (let i = 0; i < 42; i += 2) c[sumarDias(HOY, -i)] = 400;
  assert.equal(carga(c, HOY).nivel, 'ok');
  for (let i = 0; i < 7; i++) c[sumarDias(HOY, -i)] = 900;
  assert.equal(carga(c, HOY).nivel, 'alta');
  assert.equal(carga({ [HOY]: 500 }, HOY).listo, false);
  const p = probarCarga(c, [{ fecha: HOY, rend: -0.05 }]);
  assert.equal(p.diferencia, undefined);
});

test('con los datos de ejemplo: no se rompe, y el texto para la IA trae lo que necesita sin datos personales', () => {
  const est = e();
  for (const x of bajando(30)) (est.dias[x.fecha] ??= {}).peso = x.peso;
  const P = predicciones(HOY, est);
  assert.ok(P.peso.listo);
  assert.equal(typeof cargasDiarias(est, HOY), 'object');
  const t = promptSemanal(HOY, est);
  for (const s of ['## Lo que necesito', '## Peso', '## Comida y gasto real', '## Fuerza', '## Carga', '## Recuperación']) assert.ok(t.includes(s), 'falta ' + s);
  assert.ok(!/@|levotiroxina/i.test(t), 'el texto lleva datos personales');
});
