import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adivinarCategoria, precioDe, marcarComprado, frecuentes, porCategoria, textoLista, consejoDeseo, total, sinPrecio } from '../src/compras.js';

test('categoría según el nombre, sin confundir palabras', () => {
  assert.equal(adivinarCategoria('Pechuga de pollo'), 'proteina');
  assert.equal(adivinarCategoria('Fresas'), 'frutas');
  assert.equal(adivinarCategoria('Aguacate'), 'frutas');
  assert.equal(adivinarCategoria('Mantequilla de maní'), 'despensa');
  assert.equal(adivinarCategoria('Proteína en polvo'), 'suplementos');
  assert.equal(adivinarCategoria('Huevos'), 'lacteos');
  assert.equal(adivinarCategoria('Papel higiénico'), 'aseo');
  assert.equal(adivinarCategoria('Pilas AA'), 'otros');
});

test('precios como se escriben en Colombia', () => {
  assert.equal(precioDe('12.500'), 12500);
  assert.equal(precioDe('$ 8000'), 8000);
  assert.equal(precioDe('12,5k'), 12500);
  assert.equal(precioDe(''), null);
  assert.equal(precioDe('abc'), null);
});

test('lo comprado alimenta los botones rápidos y se puede deshacer', () => {
  const c = { lista: [{ id: 'a', tipo: 'mercado', nombre: 'Avena', cat: 'despensa' }, { id: 'b', tipo: 'mercado', nombre: 'Bananos', cat: 'frutas' }], veces: {} };
  marcarComprado(c, c.lista[0], '2026-11-11');
  assert.equal(c.lista[0].hecho, true);
  assert.equal(c.lista[0].comprado, '2026-11-11');
  assert.deepEqual(frecuentes(c).map((x) => x.nombre), ['Avena']);
  // Si vuelve a estar pendiente no se ofrece como botón
  c.lista.push({ id: 'c', tipo: 'mercado', nombre: 'avena', cat: 'despensa' });
  assert.deepEqual(frecuentes(c), []);
  marcarComprado(c, c.lista[0], '2026-11-11', false);
  assert.equal(c.veces.avena, undefined);
  assert.equal(c.lista[0].comprado, undefined);
});

test('lista por categoría, total y texto para WhatsApp', () => {
  const c = { lista: [
    { id: 'a', tipo: 'mercado', nombre: 'Pechuga', cat: 'proteina', cant: '2 kg', precio: 30000 },
    { id: 'b', tipo: 'mercado', nombre: 'Avena', cat: 'despensa' },
    { id: 'd', tipo: 'deseo', nombre: 'Tenis', prioridad: 'quiero', precio: 250000 },
  ] };
  const m = c.lista.filter((x) => x.tipo === 'mercado');
  assert.deepEqual(porCategoria(m).map((g) => g.id), ['proteina', 'despensa']);
  assert.equal(total(m), 30000);
  assert.equal(sinPrecio(m), 1);
  const t = textoLista(c);
  assert.match(t, /🛒 Mercado \(2\)/);
  assert.match(t, /☐ Pechuga \(2 kg\) · \$30\.000/);
  assert.doesNotMatch(t, /Tenis/);
  assert.match(textoLista(c, 'deseo'), /Tenis/);
});

test('regla de los 30 días para los deseos', () => {
  assert.match(consejoDeseo({ prioridad: 'quiero', creado: '2026-11-01' }, '2026-11-11'), /Espera 20 días/);
  assert.match(consejoDeseo({ prioridad: 'quiero', creado: '2026-10-01' }, '2026-11-11'), /41 días/);
  assert.equal(consejoDeseo({ prioridad: 'necesito', creado: '2026-11-10' }, '2026-11-11'), '');
});
