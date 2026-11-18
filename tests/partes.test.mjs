// Subir a la nube solo lo que cambió (combinar.js → cambiosParaNube; en la nube, rutina_guardar_partes): aplicar los
// cambios a la última copia sincronizada tiene que dar exactamente lo de ahora, y lo que no cambió no viaja
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cambiosParaNube, aplicarCambios } from '../src/combinar.js';
import { e, empezarDePrueba, datosParaNube } from '../src/estado.js';

const json = (x) => JSON.parse(JSON.stringify(x));
const base = {
  version: 1, cambio: 100,
  config: { sonido: true, metas: { agua: 8 } },
  dias: { '2026-11-15': { peso: 78 }, '2026-11-16': { peso: 77.8, sueno: { acoste: '23:00' } } },
  semanas: { 5: { 'd1-1-1': { peso: '40', reps: '8 8' } }, 6: {} },
  rutina: [{ id: 'd1', ejercicios: [] }],
};

test('un día anotado: solo viaja ese día y la hora del cambio', () => {
  const ahora = json(base);
  ahora.cambio = 200;
  ahora.dias['2026-11-17'] = { peso: 77.6 };
  const c = cambiosParaNube(base, ahora);
  assert.deepEqual(c.quitar, []);
  assert.deepEqual(c.partes.map((p) => p.ruta), [['cambio'], ['dias', '2026-11-17']]);
  assert.deepEqual(aplicarCambios(base, c), json(ahora));
});

test('una serie del gym: viaja solo su semana; un día borrado se quita', () => {
  const ahora = json(base);
  ahora.semanas[6]['d1-1-1'] = { peso: '42', reps: '8' };
  delete ahora.dias['2026-11-15'];
  const c = cambiosParaNube(base, ahora);
  assert.deepEqual(c.partes.map((p) => p.ruta), [['semanas', '6']]);
  assert.deepEqual(c.quitar, [['dias', '2026-11-15']]);
  assert.deepEqual(aplicarCambios(base, c), json(ahora));
});

test('el orden de las llaves no cuenta como cambio; una parte nueva o quitada sí', () => {
  const ahora = { rutina: base.rutina, semanas: base.semanas, dias: { '2026-11-16': { sueno: { acoste: '23:00' }, peso: 77.8 }, '2026-11-15': { peso: 78 } },
    config: { metas: { agua: 8 }, sonido: true }, cambio: 100, version: 1, clientes: [] };
  const c = cambiosParaNube(base, ahora);
  assert.deepEqual(c, { partes: [{ ruta: ['clientes'], valor: [] }], quitar: [] });
  const sinRutina = json(base); delete sinRutina.rutina; sinRutina.config = undefined;
  assert.deepEqual(cambiosParaNube(base, sinRutina).quitar, [['config'], ['rutina']]);
  assert.deepEqual(aplicarCambios(base, cambiosParaNube(base, sinRutina)), json(sinRutina));
});

test('con los datos de la app: varios cambios a la vez dan lo mismo y pesan mucho menos que todo', () => {
  empezarDePrueba(true);
  const antes = json(datosParaNube());
  const est = e();
  est.cambio = (est.cambio || 0) + 1;
  (est.dias['2026-11-17'] ??= {}).peso = 77.4;
  est.config.sonido = !est.config.sonido;
  (est.semanas[6] ??= {}).nota = 'probando';
  const ahora = json(datosParaNube());
  const c = cambiosParaNube(antes, ahora);
  assert.deepEqual(aplicarCambios(antes, c), ahora);
  const peso = JSON.stringify(c).length, todo = JSON.stringify(ahora).length;
  assert.ok(peso * 5 < todo, 'los cambios pesan ' + peso + ' de ' + todo + ' bytes');
  assert.ok(!c.partes.some((p) => p.ruta[0] === 'sesiones' || p.ruta[0] === 'rutina'), 'subió partes que no cambiaron');
});

test('cambios al azar: aplicar siempre da lo de ahora', () => {
  let semilla = 11; const az = () => { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; };
  for (let i = 0; i < 300; i++) {
    const a = json(base), b = json(base);
    for (let k = 0; k < 4; k++) {
      const r = az();
      const f = '2026-11-' + (10 + Math.floor(az() * 9));
      if (typeof b.dias !== 'object') b.dias = {};
      if (r < 0.2) b.dias[f] = { peso: Math.round(az() * 100) };
      else if (r < 0.35) delete b.dias[f];
      else if (r < 0.5) b.semanas[Math.ceil(az() * 7)] = { x: { peso: String(az()) } };
      else if (r < 0.6) delete b.semanas[5];
      else if (r < 0.7) b.config.metas.agua = Math.floor(az() * 10);
      else if (r < 0.8) b['nueva' + Math.floor(az() * 3)] = { n: az() };
      else if (r < 0.9) delete b.rutina;
      else b.dias = az() < 0.5 ? {} : 'raro';
    }
    assert.deepEqual(aplicarCambios(a, cambiosParaNube(a, b)), json(b), 'caso ' + i);
  }
});
