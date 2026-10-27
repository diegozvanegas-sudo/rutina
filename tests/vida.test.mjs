import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e, avanceMetas } from '../src/estado.js';
import { estadoContacto, pendientesCirculo, estadoEspera, resumenEsperas, cumplimientoEstandares } from '../src/vida.js';

test('círculo cercano: ya toca cuando pasan más días de los acordados', () => {
  const mama = { nombre: 'Mamá', cadaDias: 7, contactos: [{ fecha: '2026-10-10' }, { fecha: '2026-10-18' }] };
  assert.equal(estadoContacto(mama, '2026-10-20').estado, 'al-dia');
  assert.equal(estadoContacto(mama, '2026-10-24').estado, 'pronto');
  assert.equal(estadoContacto(mama, '2026-10-26').estado, 'vencido');
  assert.equal(estadoContacto({ contactos: [] }).estado, 'sin-dato');
  const amigo = { nombre: 'Juan', cadaDias: 14, contactos: [{ fecha: '2026-10-25' }] };
  assert.deepEqual(pendientesCirculo([amigo, mama], '2026-10-26').map((x) => x.p.nombre), ['Mamá']);
});

test('regla de las 72 horas: comprar solo después de 3 días y suma lo ahorrado', () => {
  const ts = Date.UTC(2026, 9, 20, 12);
  const x = { estado: 'esperando', ts, monto: 300000 };
  assert.deepEqual(estadoEspera(x, ts + 24 * 3600000), { lista: false, horas: 48 });
  assert.equal(estadoEspera(x, ts + 72 * 3600000).lista, true);
  const r = resumenEsperas([{ estado: 'descartado', monto: 200000 }, { estado: 'descartado', monto: 50000 }, { estado: 'comprado', monto: 90000 }, x]);
  assert.deepEqual(r, { ahorrado: 250000, comprado: 90000, esperando: 300000, decididas: 3, descartadas: 2 });
});

test('estándares: porcentaje cumplido en los días marcados', () => {
  const est = { estandares: [{ id: 'a' }, { id: 'b' }], dias: { '2026-10-20': { estandares: { a: true, b: true } }, '2026-10-21': { estandares: { a: true } } } };
  assert.deepEqual(cumplimientoEstandares(est, ['2026-10-20', '2026-10-21', '2026-10-22']), { dias: 2, fraccion: 0.75 });
  assert.equal(cumplimientoEstandares({ estandares: [], dias: {} }, []), null);
});

test('meta de pantalla: menos es mejor y sin anotar no cuenta como cumplida', () => {
  const est = e();
  est.dias['2026-10-01'] = { habitos: {}, metas: { agua: 0, pasos: 0, calorias: 0, lectura: 0 }, crono: {} };
  assert.equal(avanceMetas('2026-10-01').partes.pantalla, 0);
  est.dias['2026-10-01'].metas.pantalla = 90;
  assert.equal(avanceMetas('2026-10-01').partes.pantalla, 1);
  est.dias['2026-10-01'].metas.pantalla = 240;
  assert.equal(avanceMetas('2026-10-01').partes.pantalla, 0.5);
  delete est.dias['2026-10-01'];
});
