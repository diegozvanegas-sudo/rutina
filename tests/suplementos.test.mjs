import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tocaEl, deHoy, marcar, tomado, racha, constancia, avisoPastilla, seAcaba, PLANTILLAS, avisosSuplementos } from '../src/suplementos.js';
import { calendarioIcs } from '../src/registro.js';
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

test('la creatina de un toque trae aviso a las 10:00 todos los días', () => {
  const av = avisosSuplementos([{ ...creatina(), ...PLANTILLAS[0], id: 'cr' }]);
  assert.equal(av.length, 1);
  assert.equal(av[0].hora, '10:00');
  assert.equal(av[0].dias, null);
  assert.match(av[0].nombre, /Creatina · 5 g/);
});

test('avisos: sin hora o en pausa no suenan; días elegidos y solo entreno', () => {
  const l = [
    { ...creatina(), id: 'a', hora: '' },
    { ...creatina(), id: 'b', hora: '08:00', activo: false },
    { ...creatina(), id: 'c', hora: '21:00', dias: [3, 1] },
    { ...creatina(), id: 'd', hora: '17:00', soloEntreno: true },
    { ...creatina(), id: 'e', hora: '17:00', soloEntreno: true, dias: [4] },
  ];
  const av = avisosSuplementos(l, [1, 2, 3, 5, 6]);
  assert.deepEqual(av.map((a) => a.id), ['sup-c', 'sup-d']);
  assert.deepEqual(av[0].dias, [1, 3]);
  assert.deepEqual(av[1].dias, [1, 2, 3, 5, 6]);
});

test('el calendario lleva la alarma de la creatina a las 10:00, diaria, y no cambia lo demás', () => {
  const config = { futbol: [3, 5], avisos: { apagados: {} } };
  const sin = calendarioIcs(config, '2026-11-12');
  const con = calendarioIcs(config, '2026-11-12', avisosSuplementos([{ ...creatina(), ...PLANTILLAS[0], id: 'cr' }]));
  assert.ok(con.startsWith(sin.replace('END:VCALENDAR\r\n', '')));
  const ev = con.slice(con.indexOf('UID:rutina-sup-cr@rutina'));
  assert.match(ev, /DTSTART:20261112T100000/);
  assert.match(ev, /RRULE:FREQ=DAILY/);
  assert.match(ev, /SUMMARY:⚡ Creatina · 5 g/);
  assert.match(ev, /BEGIN:VALARM[\s\S]*TRIGGER:PT0M/);
  // las comas y puntos y coma van escapados para que el calendario no corte el texto
  const desc = ev.split('BEGIN:VALARM')[0].match(/DESCRIPTION:([^\r]*)/)[1];
  assert.ok(!/(^|[^\\])[,;]/.test(desc), desc);
});
