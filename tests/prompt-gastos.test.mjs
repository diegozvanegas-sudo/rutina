import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FINANZAS } from '../src/datos_finanzas.js';
import { promptGastos, INSTRUCCIONES_GASTOS, instruccionesGastos, opcionesGastos } from '../src/prompt-gastos.js';

const HOY = '2026-11-22';
function ejemplo() {
  const fin = FINANZAS();
  fin.categorias.gasto.find((c) => c.id === 'comida').presupuesto = 400000;
  fin.categorias.gasto.find((c) => c.id === 'mercado').presupuesto = 600000;
  fin.fijos = [{ id: 'sal', tipo: 'ingreso', nombre: 'Salario', monto: 3000000, categoria: 'salario', metodo: 'debito', dia: 30 }];
  fin.deudas = [{ id: 'lb', nombre: 'Libre inversión', saldo: 5000000, tasa: 2, cuota: 500000, dia: 15 }];
  fin.movimientos = [
    { id: 'a', fecha: '2026-11-03', tipo: 'gasto', monto: 250000, categoria: 'comida', sub: 'domicilio', metodo: 'nequi', nota: 'Salchipapas  viernes' },
    { id: 'b', fecha: '2026-11-04', tipo: 'gasto', monto: 300000, categoria: 'comida', metodo: 'debito', nota: '' },
    { id: 'c', fecha: '2026-11-10', tipo: 'gasto', monto: 356000, categoria: 'mercado', metodo: 'debito' },
    { id: 'd', fecha: '2026-11-01', tipo: 'ingreso', monto: 3000000, categoria: 'salario', metodo: 'debito', fijo: 'sal' },
    { id: 'e', fecha: '2026-10-08', tipo: 'gasto', monto: 200000, categoria: 'comida', metodo: 'debito' },
  ];
  return fin;
}

test('el prompt trae las instrucciones de siempre y los datos del mes', () => {
  const r = promptGastos(ejemplo(), '2026-11', HOY);
  assert.ok(r.texto.startsWith(INSTRUCCIONES_GASTOS));
  assert.match(r.texto, /# Mis datos de noviembre 2026 \(va hasta el 22/);
  assert.match(r.texto, /Ingresos: \$ 3\.000\.000/);
  assert.match(r.texto, /Gastos: \$ 906\.000 \(30 % de lo que entró\)/);
  assert.equal(r.movimientos, 4);
  assert.equal(r.sinDatos, false);
});

test('plan vs. real: tope, gastado, diferencia y % por categoría, la que más gasta primero, con el promedio anterior', () => {
  const t = promptGastos(ejemplo(), '2026-11', HOY).texto;
  const comida = t.split('\n').find((l) => l.includes('Comida fuera'));
  assert.match(comida, /\$ 400\.000 \| \$ 550\.000 \| \+\$150\.000 \| 138 % \| \$ 200\.000/);
  assert.match(comida, /Domicilio \$ 250\.000/);
  const mercado = t.split('\n').find((l) => l.includes('Mercado |') || l.startsWith('🛒 Mercado'));
  assert.match(mercado, /−\$244\.000 \| 59 %/);
  assert.ok(t.indexOf('Comida fuera') < t.indexOf('🛒 Mercado'));
});

test('deudas, fijos y movimientos uno por uno con día de la semana y nota', () => {
  const t = promptGastos(ejemplo(), '2026-11', HOY).texto;
  assert.match(t, /Libre inversión: saldo \$ 5\.000\.000, tasa 2 % al mes, cuota \$ 500\.000 el día 15, faltan 12 meses/);
  assert.match(t, /Ingreso: Salario \$ 3\.000\.000, el día 30 \(recibido\)/);
  assert.match(t, /2026-11-03 \| martes \| gasto \| Comida fuera › Domicilio \| \$ 250\.000 \| Nequi \| Salchipapas viernes/);
});

test('se puede quitar el detalle o las notas, y las instrucciones y metas son las tuyas', () => {
  const fin = ejemplo();
  fin.analisis = { instrucciones: 'Solo dime en qué recortar.', detalle: true, notas: false, metas: 'Salir de la libre inversión en 2027' };
  const t = promptGastos(fin, '2026-11', HOY).texto;
  assert.ok(t.startsWith('Solo dime en qué recortar.'));
  assert.ok(!t.includes(INSTRUCCIONES_GASTOS));
  assert.match(t, /## Mis metas con la plata\nSalir de la libre inversión en 2027/);
  assert.ok(!t.includes('Salchipapas'));
  fin.analisis.detalle = false;
  assert.ok(!promptGastos(fin, '2026-11', HOY).texto.includes('## Movimientos'));
  fin.analisis.instrucciones = '   ';
  assert.equal(instruccionesGastos(fin), INSTRUCCIONES_GASTOS);
  assert.deepEqual(opcionesGastos(FINANZAS()), { detalle: true, notas: true, metas: '' });
});

test('un mes sin movimientos lo dice y un mes cerrado no habla de proyección', () => {
  const vacio = promptGastos(FINANZAS(), '2026-11', HOY);
  assert.equal(vacio.sinDatos, true);
  assert.match(vacio.texto, /No tengo topes por categoría/);
  const oct = promptGastos(ejemplo(), '2026-10', HOY).texto;
  assert.match(oct, /# Mis datos de octubre 2026\n/);
  assert.ok(!oct.includes('proyectado'));
});
