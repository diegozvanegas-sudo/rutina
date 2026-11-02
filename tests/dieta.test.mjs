import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALIMENTOS, PLANES, CONFIG_DIETA } from '../src/datos_dieta.js';
import { totalPlan, totalComida, tipoDeDia, objetivo, recalcular, pesos, tendencia, sugerenciaPeso, revisionDieta, ajusteCarbos, cambioCintura, medidasDe, promedioSenal, fuerzaDelMes } from '../src/dieta.js';

const kcal = (tipo) => Math.round(totalPlan(PLANES[tipo], ALIMENTOS).kcal);
const prot = (tipo) => Math.round(totalPlan(PLANES[tipo], ALIMENTOS).p);

// Descanso: la hoja decía ~1.985 de total, pero sus filas suman 1.785
test('los planes suman lo mismo que las filas de la hoja (±15 kcal, ±2 g de proteína)', () => {
  for (const [tipo, k, p] of [['inferior', 2430, 189], ['superior', 2120, 182], ['descanso', 1785, 179]]) {
    assert.ok(Math.abs(kcal(tipo) - k) <= 15, tipo + ': ' + kcal(tipo) + ' kcal');
    assert.ok(Math.abs(prot(tipo) - p) <= 2, tipo + ': ' + prot(tipo) + ' g');
  }
  assert.equal(Math.round(totalComida(PLANES.inferior.comidas[0], ALIMENTOS).kcal), 713); // huevos + avena + café
});

test('plan según el día del gym', () => {
  assert.equal(tipoDeDia({ calentamiento: 'pierna' }), 'inferior');
  assert.equal(tipoDeDia({ calentamiento: 'empuje' }), 'superior');
  assert.equal(tipoDeDia(null), 'descanso');
  assert.equal(tipoDeDia(null, true), 'futbol');                       // viernes: solo partido
  assert.equal(tipoDeDia({ calentamiento: 'torso' }, true), 'futbol');  // miércoles: torso y partido en la noche
});

test('el día de fútbol tiene más carbos que el de pierna y la misma proteína', () => {
  const t = (tipo) => totalPlan(PLANES[tipo], ALIMENTOS);
  assert.ok(t('futbol').c > t('inferior').c);
  assert.ok(Math.abs(t('futbol').p - t('inferior').p) <= 5);
  assert.ok(Math.abs(t('futbol').kcal / 87 - CONFIG_DIETA.kcalKg.futbol) < 0.1);
  assert.ok(Math.abs(t('futbol').p / 87 - CONFIG_DIETA.protKg.futbol) < 0.02);
});

test('el objetivo con 87 kg es el del plan de partida', () => {
  assert.deepEqual(objetivo(CONFIG_DIETA, 'inferior', 87), { kcal: 2427, p: 189 });
});

test('recalcular con menos peso: menos calorías, proteína según el peso y cantidades redondeadas', () => {
  const obj = objetivo(CONFIG_DIETA, 'inferior', 80);
  const r = recalcular(PLANES.inferior, ALIMENTOS, obj);
  assert.ok(Math.abs(r.despues.kcal - obj.kcal) <= 60, 'kcal ' + Math.round(r.despues.kcal) + ' vs ' + obj.kcal);
  assert.ok(Math.abs(r.despues.p - obj.p) <= 8, 'proteína ' + Math.round(r.despues.p) + ' vs ' + obj.p);
  const items = r.plan.comidas.flatMap((c) => c.items);
  const cant = (id) => items.filter((i) => i.alimento === id).map((i) => i.cant);
  assert.ok(cant('huevo').every(Number.isInteger));                         // huevos enteros
  assert.ok(cant('arroz').every((n) => n % 5 === 0));                       // gramos de 5 en 5
  assert.deepEqual(cant('almendras'), [10]);                                // la grasa no se toca
  assert.equal(PLANES.inferior.comidas[1].items[0].cant, 250);              // el plan original no cambia
});

test('peso: lista ordenada y promedio de los últimos 7', () => {
  const dias = { '2026-10-20': { peso: 87 }, '2026-10-21': {}, '2026-10-22': { peso: 86 }, '2026-10-19': { peso: 88 } };
  assert.deepEqual(pesos(dias).map((x) => x.peso), [88, 87, 86]);
  assert.equal(tendencia(pesos(dias)), 87);
});

test('macros por kg: con el mismo peso el plan no cambia; con menos peso se acerca a P, C y G', async () => {
  const { macrosPorKg, kcalDeMacros } = await import('../src/dieta.js');
  const config = { ...CONFIG_DIETA, ...macrosPorKg(PLANES, ALIMENTOS, 87) };
  assert.deepEqual(macrosPorKg(PLANES, ALIMENTOS, 87).carbKg, { inferior: 2.74, superior: 2.06, futbol: 3.47, recarga: 2.21, descanso: 1.16 });
  const obj87 = objetivo(config, 'inferior', 87);
  assert.equal(obj87.kcal, Math.round(kcalDeMacros(obj87.p, obj87.c, obj87.g)));
  const igual = recalcular(PLANES.inferior, ALIMENTOS, obj87).plan;
  assert.deepEqual(igual.comidas.flatMap((c) => c.items.map((i) => i.cant)), PLANES.inferior.comidas.flatMap((c) => c.items.map((i) => i.cant)));
  const obj80 = objetivo(config, 'inferior', 80), r = recalcular(PLANES.inferior, ALIMENTOS, obj80);
  assert.ok(Math.abs(r.despues.p - obj80.p) <= 8, 'P ' + Math.round(r.despues.p) + ' vs ' + obj80.p);
  assert.ok(Math.abs(r.despues.c - obj80.c) <= 8, 'C ' + Math.round(r.despues.c) + ' vs ' + obj80.c);
  assert.ok(Math.abs(r.despues.g - obj80.g) <= 6, 'G ' + Math.round(r.despues.g) + ' vs ' + obj80.g);
});

test('recarga: descanso con partido mañana; si ese día hay gym o partido, manda eso', () => {
  assert.equal(tipoDeDia(null, false, true), 'recarga');
  assert.equal(tipoDeDia(null, false, false), 'descanso');
  assert.equal(tipoDeDia(null, true, true), 'futbol');
  assert.equal(tipoDeDia({ calentamiento: 'empuje' }, false, true), 'superior');
});

test('la carne ya no se contradice: sus macros dan sus calorías', () => {
  const c = ALIMENTOS.find((a) => a.id === 'carne');
  assert.ok(Math.abs(4 * c.p + 9 * c.g + 4 * c.c - c.kcal) < 5);
});

test('sugerencia de la semana según el ritmo, y sin datos no concluye', () => {
  const fecha = (n) => '2026-11-' + String(22 - n).padStart(2, '0');
  const semanas = (antes, ahora) => [8, 9, 10, 11].map((n) => ({ fecha: fecha(n), peso: antes })).concat([0, 1, 2, 3].map((n) => ({ fecha: fecha(n), peso: ahora })));
  const hoy = '2026-11-22';
  assert.equal(sugerenciaPeso([{ fecha: hoy, peso: 88 }], hoy).tipo, 'faltan');
  assert.equal(sugerenciaPeso(semanas(88, 86.8), hoy).tipo, 'rapido');
  assert.equal(sugerenciaPeso(semanas(88, 87.3), hoy).tipo, 'bien');
  assert.equal(sugerenciaPeso(semanas(88, 87.7), hoy).tipo, 'lento');
  assert.equal(sugerenciaPeso(semanas(88, 88), hoy).tipo, 'quieto');
});

test('proteína fija: no baja al bajar de peso; sin ella sigue al peso', () => {
  assert.equal(objetivo({ ...CONFIG_DIETA, protFija: 185 }, 'inferior', 76).p, 185);
  assert.equal(objetivo(CONFIG_DIETA, 'inferior', 76).p, Math.round(2.17 * 76));
});

// Dos semanas de peso: la anterior y la de ahora
const fechaAtras = (n) => '2026-11-' + String(22 - n).padStart(2, '0');
const pesosDe = (antes, ahora) => [8, 9, 10, 11].map((n) => ({ fecha: fechaAtras(n), peso: antes })).concat([0, 1, 2, 3].map((n) => ({ fecha: fechaAtras(n), peso: ahora })));
const HOY = '2026-11-22';
const conCintura = (antes, ahora) => ({ [fechaAtras(14)]: { medidas: { cintura: antes } }, [fechaAtras(0)]: { medidas: { cintura: ahora } } });
const revision = (a, b, extra = {}) => revisionDieta({ lista: pesosDe(a, b), dias: {}, ...extra }, HOY);
const progresoDe = (c) => [{ cambio: c }, { cambio: c }, { cambio: c }];

test('revisión: al ritmo ideal no cambia nada', () => {
  const r = revision(88, 87.3);
  assert.deepEqual([r.tipo, r.gramos], ['bien', 0]);
});

test('revisión: bajar muy rápido, perder fuerza o tener poca energía suma carbos, aunque el peso vaya bien', () => {
  assert.deepEqual([revision(88, 86.8).tipo, revision(88, 86.8).gramos], ['subir', 40]);
  assert.equal(revision(88, 87.3, { progreso: progresoDe(-0.05) }).gramos, 40);
  const energia = { [fechaAtras(0)]: { energia: 2 }, [fechaAtras(1)]: { energia: 2 }, [fechaAtras(2)]: { energia: 3 } };
  assert.equal(revision(88, 87.3, { dias: energia }).gramos, 40);
  // Una sola señal suelta o pocos días no alcanzan
  assert.equal(revision(88, 87.3, { dias: { [fechaAtras(0)]: { energia: 1 } } }).gramos, 0);
  assert.equal(revision(88, 87.3, { progreso: [{ cambio: -0.5 }] }).gramos, 0);
});

test('revisión: estancado solo quita comida si la cintura tampoco baja y no hay mucha hambre', () => {
  assert.deepEqual([revision(88, 88).tipo, revision(88, 88).gramos], ['medir', 0]);
  const baja = revision(88, 88, { dias: conCintura(98, 97) });
  assert.deepEqual([baja.tipo, baja.gramos], ['recomposicion', 0]);
  const igual = revision(88, 88, { dias: conCintura(98, 98) });
  assert.deepEqual([igual.tipo, igual.gramos], ['bajar', -40]);
  const hambre = { ...conCintura(98, 98) };
  hambre[fechaAtras(0)].hambre = 5; hambre[fechaAtras(1)] = { hambre: 4 }; hambre[fechaAtras(2)] = { hambre: 4 };
  assert.deepEqual([revision(88, 88, { dias: hambre }).tipo, revision(88, 88, { dias: hambre }).gramos], ['hambre', 0]);
});

test('revisión: después de un ajuste espera 14 días; sin datos de peso no concluye', () => {
  assert.equal(revision(88, 86.8, { ultimoAjuste: { fecha: fechaAtras(5) } }).tipo, 'espera');
  assert.equal(revision(88, 86.8, { ultimoAjuste: { fecha: fechaAtras(14) } }).tipo, 'subir');
  assert.equal(revisionDieta({ lista: [], dias: {} }, HOY).tipo, 'faltan');
});

test('señales: cintura contra hace al menos 12 días, y promedios con mínimo de datos', () => {
  assert.equal(cambioCintura(medidasDe(conCintura(98, 96.5))), -1.5);
  assert.equal(cambioCintura(medidasDe({ [fechaAtras(5)]: { medidas: { cintura: 98 } }, [fechaAtras(0)]: { medidas: { cintura: 90 } } })), null);
  assert.equal(promedioSenal({ [fechaAtras(0)]: { energia: 4 }, [fechaAtras(1)]: { energia: 4 } }, 'energia', HOY), null);
  assert.equal(promedioSenal({ [fechaAtras(0)]: { energia: 4 }, [fechaAtras(1)]: { energia: 3 }, [fechaAtras(2)]: { energia: 2 }, [fechaAtras(9)]: { energia: 1 } }, 'energia', HOY), 3);
  assert.equal(fuerzaDelMes([{ cambio: 0.1 }, { cambio: 0.2 }]), null);
});

test('ajuste de carbos: mueve los carbos sin bajar la proteína, y protege partido y recarga al bajar', async () => {
  const { macrosPorKg } = await import('../src/dieta.js');
  const dt = { alimentos: ALIMENTOS, planes: JSON.parse(JSON.stringify(PLANES)), config: { ...CONFIG_DIETA, protFija: 185, ...macrosPorKg(PLANES, ALIMENTOS, 87) } };
  const sube = ajusteCarbos(dt, 40);
  assert.deepEqual(sube.resultados.map(([t]) => t), ['inferior', 'superior', 'recarga', 'futbol']);
  for (const [t, r] of sube.resultados) {
    assert.ok(Math.abs(r.despues.c - (r.antes.c + 40)) <= 12, t + ' C ' + r.antes.c + ' → ' + r.despues.c);
    assert.ok(Math.abs(r.despues.p - 185) <= 12, t + ' P ' + r.despues.p);
  }
  const baja = ajusteCarbos(dt, -40);
  assert.deepEqual(baja.resultados.map(([t]) => t), ['inferior', 'superior', 'descanso']);
  assert.equal(baja.carbKg.futbol, dt.config.carbKg.futbol);
  assert.ok(baja.carbKg.descanso >= 0.8);
  assert.equal(dt.planes.inferior.comidas[0].items[0].cant, PLANES.inferior.comidas[0].items[0].cant);
});
