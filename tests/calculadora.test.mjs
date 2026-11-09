import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leerNumero, evaluar, numero, porcentajeDe, queTanto, conAumento, conDescuento, sinIncluido, dividir, cuotaCredito, mensualDeAnual, anualDeMensual, cuatroPorMil } from '../src/calculadora.js';

const cerca = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) < tol, a + ' ≠ ' + b);

test('números como se escriben en Colombia', () => {
  assert.equal(leerNumero('1.234.567'), 1234567);
  assert.equal(leerNumero('1.234.567,5'), 1234567.5);
  assert.equal(leerNumero('25.000'), 25000);
  assert.equal(leerNumero('1.5'), 1.5);
  assert.equal(leerNumero('2,75'), 2.75);
  assert.equal(leerNumero('25k'), 25000);
  assert.equal(leerNumero('1,5M'), 1500000);
  assert.ok(Number.isNaN(leerNumero('abc')));
  assert.ok(Number.isNaN(leerNumero('')));
});

test('cuentas con prioridad, paréntesis y porcentajes', () => {
  assert.equal(evaluar('2 + 3 × 4'), 14);
  assert.equal(evaluar('(2 + 3) × 4'), 20);
  assert.equal(evaluar('100.000 ÷ 4'), 25000);
  assert.equal(evaluar('-5 + 2'), -3);
  assert.equal(evaluar('200.000 + 19 %'), 238000);
  assert.equal(evaluar('80.000 − 10%'), 72000);
  assert.equal(evaluar('50 % × 80'), 40);
  assert.equal(evaluar('80 × 50%'), 40);
  assert.equal(evaluar('1,5M - 300k'), 1200000);
  assert.ok(Number.isNaN(evaluar('2 +')));
  assert.ok(Number.isNaN(evaluar('5 ÷ 0')));
  assert.ok(Number.isNaN(evaluar('')));
  assert.equal(numero(1234567.891), '1.234.567,89');
});

test('porcentajes, dividir, crédito y 4x1000', () => {
  assert.equal(porcentajeDe(15, 200000), 30000);
  assert.equal(queTanto(50, 200), 25);
  cerca(conAumento(100000, 19), 119000);
  assert.equal(conDescuento(100000, 20), 80000);
  cerca(sinIncluido(119000, 19), 100000);
  const d = dividir(120000, 4, 10);
  cerca(d.total, 132000); cerca(d.porPersona, 33000); cerca(d.propina, 12000);
  const c = cuotaCredito(1000000, 2, 12);
  cerca(c.cuota, 94559.6, 0.1);
  cerca(c.intereses, 134715.2, 1);
  assert.equal(cuotaCredito(1200000, 0, 12).cuota, 100000);
  assert.equal(cuotaCredito(0, 2, 12), null);
  cerca(anualDeMensual(mensualDeAnual(26.8)), 26.8);
  cerca(mensualDeAnual(26.82), 2, 0.01);
  assert.equal(cuatroPorMil(1000000), 4000);
});
