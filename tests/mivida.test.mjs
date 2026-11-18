import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e } from '../src/estado.js';
import { sumarDias } from '../src/fechas.js';
import {
  resumenAnimo, resumenTrabajo, accionesDe, ruedaToca, ruedaDeHoy, areaMasBaja, promedioRueda, AREAS, nuevaDecision, porRevisar, criterio,
  vidaEnSemanas, curvaUno, anio, queTeSube, lineasVida, brujula, mejorasUno,
} from '../src/mivida.js';
import { promptSemanal } from '../src/prediccion.js';
import { comparativa } from '../src/mejora.js';

// Cada prueba trabaja sobre un estado limpio y deja el de antes
function conEstado(fn) {
  const est = e(), antes = JSON.stringify({ dias: est.dias, rueda: est.rueda, decisiones: est.decisiones, vida: est.vida });
  est.dias = {}; est.rueda = []; est.decisiones = []; delete est.vida;
  try { fn(est); } finally { Object.assign(est, JSON.parse(antes)); }
}
const dia = (est, f, extra) => { est.dias[f] = { habitos: {}, metas: { agua: 0, pasos: 0, calorias: 0, lectura: 0 }, crono: {}, ...extra }; };

test('ánimo: promedio solo de los días anotados', () => conEstado((est) => {
  dia(est, '2026-11-01', { animo: { animo: 4, energia: 3 } });
  dia(est, '2026-11-02', { animo: { animo: 2 } });
  dia(est, '2026-11-03', {});
  const r = resumenAnimo(['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'], est);
  assert.deepEqual([r.animo, r.energia, r.dias], [3, 3, 2]);
}));

test('trabajo: suma minutos y acciones por tipo', () => conEstado((est) => {
  dia(est, '2026-11-01', { trabajo: { minutos: 90, acciones: { postulacion: 2, venta: 1 } } });
  dia(est, '2026-11-02', { trabajo: { minutos: 30 } });
  const t = resumenTrabajo(['2026-11-01', '2026-11-02'], est);
  assert.equal(t.minutos, 120); assert.equal(t.horas, 2); assert.equal(t.acciones, 3); assert.equal(t.porTipo.postulacion, 2); assert.equal(t.dias, 2);
  assert.equal(accionesDe({ acciones: { a: 1, b: 4 } }), 5);
}));

test('rueda: toca sin rueda o a los 90 días; el área más baja solo con la rueda completa', () => conEstado((est) => {
  assert.equal(ruedaToca('2026-11-01', est), true);
  const r = ruedaDeHoy('2026-11-01', est);
  assert.equal(ruedaDeHoy('2026-11-01', est), r, 'el mismo día corrige la misma rueda');
  AREAS.forEach(([k], i) => { r.notas[k] = 8; if (i === 3) r.notas[k] = 3; });
  assert.equal(areaMasBaja(r), AREAS[3][0]);
  delete r.notas.salud;
  assert.equal(areaMasBaja(r), null);
  r.notas.salud = 8;
  assert.equal(Math.round(promedioRueda(r) * 100) / 100, Math.round(((8 * 7 + 3) / 8) * 100) / 100);
  assert.equal(ruedaToca(sumarDias('2026-11-01', 89), est), false);
  assert.equal(ruedaToca(sumarDias('2026-11-01', 90), est), true);
  assert.equal(ruedaDeHoy(sumarDias('2026-11-01', 90), est) === r, false, 'otro día es una rueda nueva');
}));

test('decisiones: se revisan cuando toca y el criterio compara aciertos con confianza', () => conEstado((est) => {
  const a = nuevaDecision({ texto: 'A', confianza: 90, dias: 30 }, '2026-10-01', est);
  const b = nuevaDecision({ texto: 'B', confianza: 90, dias: 90 }, '2026-10-01', est);
  assert.deepEqual(porRevisar('2026-11-01', est).map((d) => d.texto), ['A']);
  assert.equal(criterio(est), null);
  a.salio = 'no'; b.salio = 'parcial';
  const c = criterio(est);
  assert.equal(c.revisadas, 2); assert.equal(c.aciertos, 0.25); assert.equal(c.sobre, true);
  assert.deepEqual(porRevisar('2027-01-01', est), []);
}));

test('vida en semanas y curva del 1 %', () => {
  assert.equal(vidaEnSemanas('', '2026-11-18'), null);
  assert.equal(vidaEnSemanas('2030-01-01', '2026-11-18'), null);
  const v = vidaEnSemanas('1996-11-18', '2026-11-18');
  assert.equal(v.edad, 30); assert.equal(v.total, 90 * 52); assert.equal(v.vividas, Math.floor(10957 / 7)); assert.equal(v.vividas + v.quedan, v.total);
  assert.equal(Math.round(curvaUno(365) * 10) / 10, 37.8);
  assert.equal(Math.round(curvaUno(365, -0.01) * 100) / 100, 0.03);
});

test('tu año: 53 semanas que terminan hoy, con el ánimo de 0 a 1', () => conEstado((est) => {
  dia(est, '2026-11-18', { animo: { animo: 5 } });
  dia(est, '2026-11-17', { animo: { animo: 1 } });
  const A = anio('animo', '2026-11-18', est), todos = A.semanas.flat().filter(Boolean);
  assert.equal(A.semanas.length, 53);
  assert.equal(todos[todos.length - 1].f, '2026-11-18');
  assert.equal(todos.find((x) => x.f === '2026-11-18').v, 1);
  assert.equal(todos.find((x) => x.f === '2026-11-17').v, 0);
  assert.equal(A.dias, 2);
}));

test('qué te sube el ánimo: con 5 días de cada lado compara el sueño', () => conEstado((est) => {
  for (let i = 0; i < 12; i++) {
    const f = sumarDias('2026-11-18', -i), bien = i % 2 === 0;
    dia(est, f, { sueno: { acoste: '23:00', levante: bien ? '07:00' : '04:00' }, animo: { animo: bien ? 5 : 3 } });
  }
  const r = queTeSube('2026-11-18', est), s = r.frases.find((x) => x.titulo.startsWith('Dormir') && x.medida === 'ánimo');
  assert.ok(s, JSON.stringify(r));
  assert.deepEqual([s.r.si, s.r.no, s.r.nota, s.escala], [5, 3, true, 5]);
}));

test('la revisión para la IA trae la sección de vida y la comparativa el ánimo', () => conEstado((est) => {
  dia(est, '2026-11-18', { animo: { animo: 4, nota: 'buen partido' }, trabajo: { minutos: 60, acciones: { venta: 1 } } });
  const l = lineasVida('2026-11-18', est).join('\n');
  assert.match(l, /## Ánimo, trabajo y vida/);
  assert.match(l, /buen partido/);
  assert.match(l, /venta o cobro 1/);
  assert.match(promptSemanal('2026-11-18', est), /## Ánimo, trabajo y vida/);
  assert.ok(comparativa('2026-11-18').some((x) => x.id === 'animo'));
}));

// ---------- Diario Fénix: prioridades marcables, propósito al despertar y mejora del 1 % ----------
test('prioridades: cada línea sin su número; las marcas van por texto', async () => {
  const { listaPrioridades, avancePrioridades } = await import('../src/estado.js');
  assert.deepEqual(listaPrioridades('1. Llamar a Ana\n2) Enviar propuesta\n\n- Gym\n• Leer'), ['Llamar a Ana', 'Enviar propuesta', 'Gym', 'Leer']);
  const p = avancePrioridades({ prioridades: '1. A\n2. B\n3. C', prioridadesHechas: { B: 1, Z: 2 } });
  assert.deepEqual([p.hechas, p.total, p.lista[1].hecha], [1, 3, 1]);
  assert.deepEqual(avancePrioridades(undefined), { lista: [], hechas: 0, total: 0 });
});

test('brújula: propósito y la meta con la fecha más cercana por delante', () => conEstado((est) => {
  const antes = est.libros;
  est.libros = { fenix: { perfil: { proposito: ' Servir ' }, fichas: { metas: [
    { id: 'a', fecha: '2026-11-18', meta: 'Recién creada' }, { id: 'b', fecha: '2027-06-01', meta: 'Lejana' }, { id: 'c', fecha: '2026-12-31', meta: 'Cercana' }, { id: 'd', fecha: '2027-01-01', meta: '' },
  ] } } };
  dia(est, '2026-11-18', { vision: 123 });
  try {
    const b = brujula('2026-11-18', est);
    assert.deepEqual([b.proposito, b.meta, b.limite, b.leido], ['Servir', 'Cercana', '2026-12-31', 123]);
    est.libros.fenix.fichas.metas = [{ id: 'x', fecha: '2026-01-01', meta: 'Vieja' }];
    assert.deepEqual([brujula('2026-11-18', est).meta, brujula('2026-11-18', est).limite], ['Vieja', '']);
    est.libros = {};
    assert.deepEqual([brujula('2026-11-18', est).proposito, brujula('2026-11-18', est).meta], ['', '']);
  } finally { est.libros = antes; }
}));

test('mejora del 1 %: las últimas primero y entran en la revisión y en la comparativa', () => conEstado((est) => {
  dia(est, '2026-11-16', { mejoraUno: 'Me acosté antes', prioridades: '1. A\n2. B', prioridadesHechas: { A: 1 } });
  dia(est, '2026-11-18', { mejoraUno: ' Una llamada más ' });
  dia(est, '2026-11-17', { mejoraUno: '   ' });
  const m = mejorasUno('2026-11-18', est);
  assert.deepEqual([m.dias, m.lista[0].texto, m.lista[1].fecha], [2, 'Una llamada más', '2026-11-16']);
  const texto = lineasVida('2026-11-18', est).join('\n');
  assert.match(texto, /Prioridades del día cumplidas: 1 de 2/);
  assert.match(texto, /Mi mejora del 1 % \(2 de 7 días\)/);
  assert.ok(comparativa('2026-11-18').some((x) => x.id === 'prioridades'));
}));
