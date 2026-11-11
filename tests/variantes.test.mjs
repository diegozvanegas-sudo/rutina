import { test } from 'node:test';
import assert from 'node:assert/strict';
import { historial, ultimoRegistro, progresoMes, estancamiento, varianteEn, varianteDe, nombreConVariante, lineasFuerza } from '../src/gym.js';

const fila = (id) => ({ id, tipo: 'Top', series: 1, min: 4, max: 7 });
const press = (extra = {}) => ({ id: 'e1', nombre: 'Press plano', musculo: 'Pecho', filas: [fila('e1-1')], ...extra });
const reg = (peso, reps, variante) => ({ peso: String(peso), reps, unidad: 'kg', ...(variante ? { variante } : {}) });

test('sin variantes todo se junta como antes', () => {
  const ej = press(), rutina = [{ id: 'd', ejercicios: [ej] }];
  const semanas = { 1: { 'e1-1': reg(100, '12') }, 2: { 'e1-1': reg(30, '7') } };
  assert.equal(historial(semanas, rutina, ej).length, 2);
  assert.equal(varianteEn(ej, semanas[1]), null);
  assert.equal(ultimoRegistro(semanas, ej.filas[0], 3).peso, '30');
});

test('cada variante tiene su historial, su último registro y su estancamiento', () => {
  const ej = press({ variantes: ['Máquina plano', 'Paralelas'], variante: 'Máquina plano' }), rutina = [{ id: 'd', ejercicios: [ej] }];
  const semanas = {
    1: { 'e1-1': reg(100, '12', 'Paralelas') },
    2: { 'e1-1': reg(30, '7') }, // anotado antes de las variantes: es de la principal
    3: { 'e1-1': reg(100, '12', 'Paralelas') },
    4: { 'e1-1': reg(30, '7', 'Máquina plano') },
  };
  assert.deepEqual(historial(semanas, rutina, ej, 0, 9, 'Máquina plano').map((p) => p.semana), [2, 4]);
  assert.deepEqual(historial(semanas, rutina, ej, 0, 9, 'Paralelas').map((p) => p.semana), [1, 3]);
  assert.equal(ultimoRegistro(semanas, ej.filas[0], 5, { ej, v: 'Paralelas' }).semana, 3);
  assert.equal(ultimoRegistro(semanas, ej.filas[0], 5, { ej, v: 'Máquina plano' }).semana, 4);
  // El 100 × 12 de paralelas ya no hace ver estancada la máquina
  assert.equal(estancamiento(historial(semanas, rutina, ej, 0, 9, 'Máquina plano')).mejor.peso, 30);
  assert.equal(varianteDe(semanas[2]['e1-1'], ej), 'Máquina plano');
  assert.equal(varianteEn(ej, semanas[3]), 'Paralelas');
  assert.equal(varianteEn(ej, {}), 'Máquina plano');
});

test('el registro de la hoja cuenta solo para la principal', () => {
  const ej = press({ variantes: ['Press plano', 'Paralelas'] });
  ej.filas[0].ultimo = { peso: '60', reps: '6' };
  assert.equal(ultimoRegistro({}, ej.filas[0], 1, { ej, v: 'Paralelas' }), null);
  assert.equal(ultimoRegistro({}, ej.filas[0], 1, { ej, v: 'Press plano' }).peso, '60');
});

test('progreso del mes y nombres: una línea por variante', () => {
  const ej = press({ variantes: ['Press plano', 'Paralelas'] }), rutina = [{ id: 'd', ejercicios: [ej] }];
  assert.equal(nombreConVariante(ej, 'Paralelas'), 'Press plano · Paralelas');
  assert.equal(nombreConVariante(ej, 'Press plano'), 'Press plano');
  assert.deepEqual(lineasFuerza(rutina).map((x) => x.nombre), ['Press plano', 'Press plano · Paralelas']);
  const semanas = { 1: { 'e1-1': reg(60, '6') }, 2: { 'e1-1': reg(20, '6', 'Paralelas') }, 3: { 'e1-1': reg(65, '6') }, 4: { 'e1-1': reg(25, '6', 'Paralelas') } };
  const mes = progresoMes(semanas, rutina, 4, 2);
  const de = (n) => mes.find((x) => x.nombre === n);
  assert.deepEqual([de('Press plano').de.peso, de('Press plano').a.peso], [60, 65]);
  assert.deepEqual([de('Press plano · Paralelas').de.peso, de('Press plano · Paralelas').a.peso], [20, 25]);
});
