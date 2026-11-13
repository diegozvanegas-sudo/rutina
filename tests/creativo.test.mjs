import { test } from 'node:test';
import assert from 'node:assert/strict';
import { creativoDe, avanceReto, avanceCreativo, textoCreativo, IDEAS_RETO } from '../src/creativo.js';

test('creativo: se crea con 3 días de reto y 3 soluciones, sin borrar lo que ya hay', () => {
  const p = {};
  const c = creativoDe(p);
  assert.equal(c.reto.length, 3);
  assert.equal(c.soluciones.length, 3);
  c.textos.seguido = 'Casi siempre';
  c.soluciones.push('cuarta');
  assert.equal(creativoDe(p).textos.seguido, 'Casi siempre');
  assert.equal(creativoDe(p).soluciones.length, 4);
  assert.ok(IDEAS_RETO.length >= 3);
});

test('creativo: el reto de 3 días avisa si dos quedaron el mismo día', () => {
  const c = creativoDe({});
  c.reto[0] = { actividad: 'Otra ruta', fecha: '2026-11-13' };
  assert.deepEqual(avanceReto(c), { hechos: 1, mismoDia: false, completo: false });
  c.reto[1] = { actividad: 'Pódcast', fecha: '2026-11-13' };
  assert.equal(avanceReto(c).mismoDia, true);
  c.reto[1].fecha = '2026-11-14'; c.reto[2] = { actividad: 'Helado', fecha: '2026-11-15' };
  assert.deepEqual(avanceReto(c), { hechos: 3, mismoDia: false, completo: true });
});

test('creativo: el avance cuenta cada punto solo cuando está completo, y el texto lo resume', () => {
  const c = creativoDe({});
  assert.equal(avanceCreativo(c).hechos, 0);
  Object.assign(c.textos, { plato: 'Sí', reto: 'Noté más cosas', magico: 'Dinosaurio', sentir: 'Fácil', norma: 'Banco', perspectiva: 'Abrí la mente',
    problema: 'Tiempo', porque: 'Es simple', aprendi: 'Que sí soy creativo', cambios: 'Probar algo nuevo', aplicar: 'En el trabajo' });
  assert.equal(avanceCreativo(c).hechos, 5); // faltan el reto y las soluciones
  c.reto = [1, 2, 3].map((n) => ({ actividad: 'A' + n, fecha: '2026-11-1' + n }));
  c.soluciones = ['Horario', 'Lista', 'Delegar']; c.elegida = 1;
  const a = avanceCreativo(c);
  assert.equal(a.hechos, a.total);
  const t = textoCreativo(c);
  assert.match(t, /Despertar creativo/);
  assert.match(t, /✅ Día 1: A1/);
  assert.match(t, /⭐ Lista/);
  assert.match(t, /Conclusiones/);
});
