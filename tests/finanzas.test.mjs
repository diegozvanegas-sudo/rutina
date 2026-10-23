import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FINANZAS, PLANTILLAS_RECORDATORIO } from '../src/datos_finanzas.js';
import {
  leerMonto, pesos, resumenMes, gastoPromedio, aportado, objetivoMeta, estadoFijo, mesesParaPagar, sumarMeses,
  estadoRecordatorio, ritmoKm, recordatoriosAutomaticos,
} from '../src/finanzas.js';

const mov = (fecha, tipo, monto, extra = {}) => ({ id: fecha + tipo + monto, fecha, tipo, monto, metodo: 'efectivo', ...extra });

test('montos como se escriben en el celular', () => {
  assert.equal(leerMonto('25.000'), 25000);
  assert.equal(leerMonto('$ 1.250.000'), 1250000);
  assert.equal(leerMonto('25k'), 25000);
  assert.equal(leerMonto('1,5M'), 1500000);
  assert.equal(leerMonto('abc'), 0);
  assert.equal(pesos(1250000), '$ 1.250.000');
});

test('resumen del mes: ingresos, gastos por categoría y grupo, ahorro y 50/30/20', () => {
  const fin = FINANZAS();
  fin.movimientos = [
    mov('2026-10-01', 'ingreso', 4000000, { categoria: 'salario' }),
    mov('2026-10-02', 'gasto', 1200000, { categoria: 'vivienda' }),
    mov('2026-10-05', 'gasto', 300000, { categoria: 'comida', metodo: 'credito' }),
    mov('2026-10-06', 'ahorro', 500000, { meta: 'emergencia' }),
    mov('2026-10-07', 'retiro', 100000, { meta: 'emergencia' }),
    mov('2026-09-30', 'gasto', 999, { categoria: 'otros' }),
  ];
  const r = resumenMes(fin, '2026-10', '2026-10-10');
  assert.deepEqual([r.ingresos, r.gastos, r.ahorro, r.balance], [4000000, 1500000, 400000, 2100000]);
  assert.deepEqual(r.porGrupo, { necesidad: 1200000, deseo: 300000 });
  assert.equal(r.porMetodo.credito, 300000);
  assert.equal(r.tasaAhorro, 0.625);
  assert.equal(r.proyeccion, 1500000 / 10 * 31);
  assert.equal(aportado(fin, 'emergencia'), 400000);
});

test('fondo de emergencia: 6 meses del gasto promedio de los meses anteriores', () => {
  const fin = FINANZAS();
  fin.movimientos = [mov('2026-08-10', 'gasto', 2000000, { categoria: 'vivienda' }), mov('2026-09-10', 'gasto', 3000000, { categoria: 'vivienda' })];
  assert.equal(gastoPromedio(fin, '2026-10-22'), 2500000);
  assert.equal(objetivoMeta(fin, fin.metas[0], '2026-10-22'), 15000000);
});

test('pagos fijos: pendiente, pronto, vencido y pagado', () => {
  const fin = FINANZAS(), arriendo = { id: 'arr', dia: 5, monto: 1000000 }, luz = { id: 'luz', dia: 31 };
  assert.equal(estadoFijo(fin, arriendo, '2026-10-01').estado, 'pronto');
  assert.equal(estadoFijo(fin, arriendo, '2026-10-06').estado, 'vencido');
  assert.equal(estadoFijo(fin, luz, '2026-11-02').fecha, '2026-11-30'); // noviembre tiene 30 días
  fin.movimientos.push(mov('2026-10-04', 'gasto', 1000000, { fijo: 'arr' }));
  assert.equal(estadoFijo(fin, arriendo, '2026-10-06').estado, 'pagado');
  fin.fijos.push({ ...arriendo, nombre: 'Arriendo' }, { ...luz, nombre: 'Luz', monto: 80000 });
  assert.deepEqual(recordatoriosAutomaticos(fin, '2026-10-06').map((a) => a.nombre), ['Luz']);
});

test('deudas: meses para pagar', () => {
  assert.equal(mesesParaPagar(1000000, 0, 100000), 10);
  assert.equal(mesesParaPagar(1000000, 2, 100000), 12);
  assert.equal(mesesParaPagar(1000000, 2, 20000), Infinity); // la cuota no cubre el interés
  assert.equal(sumarMeses('2026-01-31', 1), '2026-02-28');
});

test('aceite de la moto: lo que pase primero, km o meses', () => {
  const aceite = { ...PLANTILLAS_RECORDATORIO[0], hechos: [] };
  const moto = { km: [{ fecha: '2026-10-01', km: 10000 }, { fecha: '2026-10-21', km: 10600 }] };
  assert.equal(estadoRecordatorio(aceite, moto, '2026-10-22').estado, 'sin-dato');
  aceite.hechos.push({ fecha: '2026-09-15', km: 8000 });
  const s = estadoRecordatorio(aceite, moto, '2026-10-22');
  assert.equal(ritmoKm(moto.km, '2026-10-22'), 30);
  assert.deepEqual([s.proxKm, s.faltaKm, s.proxFecha, s.estado], [11000, 400, '2026-12-15', 'al-dia']);
  assert.equal(s.fechaKm, '2026-11-04'); // 400 km a 30 km/día ≈ 13 días
  moto.km.push({ fecha: '2026-10-28', km: 10850 });
  assert.equal(estadoRecordatorio(aceite, moto, '2026-10-28').estado, 'pronto'); // faltan 150 km
  moto.km.push({ fecha: '2026-11-02', km: 11100 });
  assert.equal(estadoRecordatorio(aceite, moto, '2026-11-02').estado, 'vencido');
  assert.equal(estadoRecordatorio(aceite, { km: [] }, '2026-12-20').estado, 'vencido'); // pasaron los 3 meses
});
