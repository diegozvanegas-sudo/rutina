import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ventasDe, nuevaVenta, faltantes, resumenVentas, avanceLista, paginaVenta, PRODUCTOS_EJEMPLO, LISTA_LANZAMIENTO } from '../src/ventas.js';
import { pdfMusculo } from '../src/ventas-pdf.js';

test('ventas: arranca con los productos de ejemplo, sin tocar los de antes', () => {
  const est = {};
  const v = ventasDe(est);
  assert.equal(v.productos.length, PRODUCTOS_EJEMPLO.length);
  v.productos[0].precio = 1;
  assert.notEqual(PRODUCTOS_EJEMPLO[0].precio, 1); // es una copia
  assert.equal(ventasDe(est).productos[0].precio, 1);
  assert.ok(v.productos.every((p) => !('precioAntes' in p))); // nada de precio tachado inventado
});

test('ventas: lo que falta para vender un producto', () => {
  const p = { ...PRODUCTOS_EJEMPLO[0] };
  assert.deepEqual(faltantes(p, {}), ['el link de pago', 'quién eres (Autor)']);
  assert.deepEqual(faltantes({ ...p, link: 'https://pay.x', precio: 0 }, { nombre: 'Diego' }), ['el precio']);
});

test('ventas: resumen del mes, por producto y de los últimos 6 meses', () => {
  const v = ventasDe({});
  v.registro.push(nuevaVenta('musculo', 49900, '2026-11-02'), nuevaVenta('musculo', 45000, '2026-11-10'), nuevaVenta('coach', 150000, '2026-10-20'), nuevaVenta('casa', 30000, '2026-03-01'));
  const r = resumenVentas(v, '2026-11-13');
  assert.equal(r.esteMes.monto, 94900);
  assert.equal(r.esteMes.n, 2);
  assert.equal(r.total, 274900);
  assert.equal(r.meses.length, 6);
  assert.equal(r.meses[0].mes, '2026-06');
  assert.equal(r.meses[4].monto, 150000);
  assert.equal(r.porProducto[0].producto, 'coach');
  assert.equal(r.ticket, Math.round(274900 / 4));
  // En enero, los meses pasan de año
  assert.equal(resumenVentas(v, '2027-01-05').meses[0].mes, '2026-08');
});

test('ventas: la página de venta y el PDF', () => {
  const p = PRODUCTOS_EJEMPLO[0];
  const html = paginaVenta(p, { nombre: 'Diego <Coach>' });
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /Vista previa de ejemplo/);
  assert.match(html, /\$ 49\.900/);
  assert.match(html, /Diego &lt;Coach&gt;/); // escapa el texto
  assert.match(html, /No reemplaza el consejo de un médico/);
  assert.match(html, /cta sin-link/); // sin link, el botón no lleva a ningún lado
  const real = paginaVenta({ ...p, link: 'https://pay.hotmart.com/abc' }, {}, { ejemplo: false });
  assert.ok(!/Vista previa de ejemplo/.test(real));
  assert.match(real, /href="https:\/\/pay\.hotmart\.com\/abc"/);
  const pdf = pdfMusculo({ nombre: 'Diego' });
  assert.match(pdf, /Ganar músculo desde cero/);
  assert.match(pdf, /Descarga/);
  assert.equal((pdf.match(/<h2>/g) || []).length, 10);
});

test('ventas: lista de lanzamiento', () => {
  const v = ventasDe({});
  const total = LISTA_LANZAMIENTO.reduce((s, [, xs]) => s + xs.length, 0);
  assert.deepEqual(avanceLista(v), { hechos: 0, total });
  v.lista.pdf = true;
  assert.equal(avanceLista(v).hechos, 1);
});
