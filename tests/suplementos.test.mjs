import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tocaEl, deHoy, marcar, tomado, racha, constancia, avisoPastilla, seAcaba, PLANTILLAS } from '../src/suplementos.js';
import { enOrden } from '../src/orden.js';

const creatina = () => ({ id: 'cr', nombre: 'Creatina', dosis: '5 g', momento: 'cualquiera', dias: [], soloEntreno: false, quedan: null, activo: true });
// 10 a 16 nov 2026: martes a lunes. Entreno lun, mar, mié, vie, sáb
const ENTRENA = [1, 2, 3, 5, 6];
const diaSem = (f) => ((new Date(f + 'T12:00:00').getDay() + 6) % 7) + 1;
const info = (f) => ({ diaSemana: diaSem(f), entrena: ENTRENA.includes(diaSem(f)) });
const atras = (desde, n) => Array.from({ length: n }, (_, i) => { const d = new Date(desde + 'T12:00:00'); d.setDate(d.getDate() - i); return d.toISOString().slice(0, 10); });

test('la creatina toca todos los días, también los de descanso', () => {
  for (let n = 1; n <= 7; n++) assert.equal(tocaEl(creatina(), n, false), true);
});

test('días elegidos, solo entreno y en pausa', () => {
  const s = { ...creatina(), dias: [1, 3] };
  assert.equal(tocaEl(s, 1, false), true);
  assert.equal(tocaEl(s, 2, true), false);
  const e = { ...creatina(), soloEntreno: true };
  assert.equal(tocaEl(e, 4, false), false);
  assert.equal(tocaEl(e, 4, true), true);
  assert.equal(tocaEl({ ...creatina(), activo: false }, 1, true), false);
});

test('los de hoy van en el orden del día', () => {
  const l = [{ ...creatina(), id: 'a', momento: 'noche' }, { ...creatina(), id: 'b', momento: 'manana' }, { ...creatina(), id: 'c', momento: 'post' }];
  assert.deepEqual(deHoy(l, 1, true).map((s) => s.id), ['b', 'c', 'a']);
});

test('marcar guarda la hora y la dosis; desmarcar lo quita; el frasco cuenta', () => {
  const s = { ...creatina(), quedan: 8 }, d = {};
  assert.equal(marcar(d, s, 123), true);
  assert.deepEqual(d.suplementos.cr, { ts: 123, dosis: '5 g' });
  assert.equal(s.quedan, 7);
  assert.equal(seAcaba(s), true);
  assert.equal(marcar(d, s), false);
  assert.equal(d.suplementos.cr, undefined);
  assert.equal(s.quedan, 8);
  assert.equal(seAcaba(s), false);
});

test('racha: hoy sin tomar no corta; un día fallado sí; un día que no tocaba no', () => {
  const s = creatina(), dias = {};
  for (const f of ['2026-11-10', '2026-11-09', '2026-11-08']) dias[f] = { suplementos: { cr: { ts: 1 } } };
  assert.equal(racha(s, dias, atras('2026-11-11', 30), info), 3); // hoy (11) todavía no
  dias['2026-11-11'] = { suplementos: { cr: { ts: 1 } } };
  assert.equal(racha(s, dias, atras('2026-11-11', 30), info), 4);
  const e = { ...creatina(), soloEntreno: true }; // el jueves 12 no se entrena: no corta
  const de = { '2026-11-13': { suplementos: { cr: { ts: 1 } } }, '2026-11-11': { suplementos: { cr: { ts: 1 } } } };
  assert.equal(racha(e, de, atras('2026-11-13', 30), info), 2);
});

test('constancia del mes: cuenta solo desde que se agregó', () => {
  const s = { ...creatina(), creado: '2026-11-07' }, dias = {};
  for (const f of ['2026-11-07', '2026-11-08', '2026-11-10']) dias[f] = { suplementos: { cr: { ts: 1 } } };
  const c = constancia(s, dias, atras('2026-11-10', 30), info);
  assert.deepEqual([c.tomados, c.tocaban], [3, 4]);
  assert.equal(tomado(dias, '2026-11-09', 'cr'), false);
});

test('aviso de la levotiroxina solo para lo que le quita absorción', () => {
  const habitos = [{ tipo: 'pastilla', nombre: 'Pastilla de levotiroxina' }];
  assert.match(avisoPastilla({ nombre: 'Magnesio' }, habitos), /4 horas.*levotiroxina/);
  assert.match(avisoPastilla({ nombre: 'Multivitamínico' }, habitos), /levotiroxina/);
  assert.equal(avisoPastilla({ nombre: 'Creatina' }, habitos), '');
  assert.equal(avisoPastilla({ nombre: 'Magnesio' }, []), '');
});

test('plantillas: la creatina primero, sin nombres repetidos', () => {
  assert.equal(PLANTILLAS[0].nombre, 'Creatina');
  assert.equal(new Set(PLANTILLAS.map((p) => p.nombre)).size, PLANTILLAS.length);
});

test('menú ya ordenado: Suplementos aparece debajo de Dieta; en Hoy, debajo de Comidas', () => {
  const config = { orden: { menu: ['hoy', 'gym', 'dieta', 'finanzas'], hoy: ['manana', 'dieta', 'gym'] } };
  const m = enOrden(config, 'menu'), h = enOrden(config, 'hoy');
  assert.equal(m[m.indexOf('dieta') + 1], 'suplementos');
  assert.equal(h[h.indexOf('dieta') + 1], 'suplementos');
});
