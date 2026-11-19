import { test } from 'node:test';
import assert from 'node:assert/strict';
import { limpiarMarca, tintaSobre, iniciales, modoPortal, repartirMenu, firmaPlan, LOGO_MAX } from '../src/marca.js';
import { planParaPublicar, pagosParaCliente, valoracionesParaCliente, marcaDeMiEntrenador } from '../src/coach.js';
import { nuevoCliente } from '../src/clientes.js';

const LOGO = 'data:image/png;base64,iVBORw0KGgo=';

test('marca: solo nombre, color #RRGGBB y logo de imagen; lo demás se descarta', () => {
  assert.equal(limpiarMarca(null), null);
  assert.equal(limpiarMarca({}), null);
  assert.deepEqual(limpiarMarca({ negocio: '  Fit Lab  ', color: '#3DDC84', logo: LOGO, otro: 'x' }), { negocio: 'Fit Lab', color: '#3ddc84', logo: LOGO });
  assert.deepEqual(limpiarMarca({ negocio: 'A', color: 'red', logo: 'javascript:alert(1)' }), { negocio: 'A', color: null, logo: null });
  assert.equal(limpiarMarca({ logo: 'data:image/svg+xml;base64,AAAA' }), null); // un SVG puede traer código
  assert.equal(limpiarMarca({ logo: 'data:image/png;base64,' + 'A'.repeat(LOGO_MAX) }), null);
  assert.equal(limpiarMarca({ negocio: 'x'.repeat(80) }).negocio.length, 40);
});

test('marca: texto legible sobre el color e iniciales', () => {
  assert.equal(tintaSobre('#111111'), '#ffffff');
  assert.equal(tintaSobre('#f2c94c'), '#111111');
  assert.equal(tintaSobre('nada'), null);
  assert.equal(iniciales('Fit Lab Studio'), 'FL');
  assert.equal(iniciales(''), '🏋️');
});

test('portal: el cliente ve primero lo suyo; el entrenador y el admin, como siempre', () => {
  assert.equal(modoPortal({ rol: 'cliente', tieneEntrenador: true }), 'cliente');
  assert.equal(modoPortal({ rol: 'estudiante', tieneEntrenador: true }), 'cliente');
  assert.equal(modoPortal({ rol: 'cliente', tieneEntrenador: false }), null);
  assert.equal(modoPortal({ rol: 'entrenador', tieneEntrenador: true }), 'entrenador');
  assert.equal(modoPortal({ rol: 'admin', tieneEntrenador: true }), null);
  const enlaces = ['hoy', 'calendario', 'gym', 'finanzas', 'dieta', 'entrenador', 'ajustes'].map((k) => ({ k, nombre: k }));
  const r = repartirMenu(enlaces, 'cliente');
  assert.deepEqual(r.principales.map((x) => x.k), ['hoy', 'entrenador', 'gym', 'dieta', 'ajustes']);
  assert.equal(r.principales[0].nombre, 'Inicio');
  assert.deepEqual(r.mas.map((x) => x.k), ['calendario', 'finanzas']);
  assert.deepEqual(repartirMenu(enlaces, null), { principales: enlaces, mas: [] });
});

const cliente = () => {
  const c = nuevoCliente('Ana');
  c.cobro = { precio: 150000, cada: 'mes', inicio: '2026-10-01', pagos: [{ fecha: '2026-10-01', monto: 150000 }, { fecha: '2026-11-01', monto: 150000 }] };
  c.valoraciones = [{ id: 'v1', fecha: '2026-10-01', peso: 70, cintura: 82, nota: 'privada' }, { id: 'v2', fecha: '2026-11-01', peso: 69, cintura: 80, sentadilla: 90 }];
  return c;
};

test('el cliente recibe sus pagos y valoraciones, sin notas ni campos de más', () => {
  const p = pagosParaCliente(cliente(), '2026-11-19');
  assert.equal(p.estado, 'al-dia');
  assert.equal(p.proximo, '2026-12-01');
  assert.deepEqual(p.pagos.map((x) => x.fecha), ['2026-11-01', '2026-10-01']);
  assert.equal(pagosParaCliente(nuevoCliente('B')), null);
  const v = valoracionesParaCliente(cliente());
  assert.deepEqual(v[0], { fecha: '2026-10-01', peso: 70, cintura: 82 });
  assert.equal(v[1].sentadilla, 90);
});

test('firma: cambia con la rutina o las comidas, no con un pago, la marca o la fecha', () => {
  const dt = { alimentos: [] }, c = cliente();
  const a = planParaPublicar(c, dt, '2026-11-19', { negocio: 'Fit Lab', color: '#2f80ed' });
  assert.equal(a.marca.negocio, 'Fit Lab');
  assert.equal(a.pagos.estado, 'al-dia');
  c.cobro.pagos.push({ fecha: '2026-11-19', monto: 150000 });
  const b = planParaPublicar(c, dt, '2026-11-20', { negocio: 'Otro' });
  assert.equal(a.firma, b.firma);
  c.rutina.push({ id: 'd9', nombre: 'Nuevo', ejercicios: [] });
  assert.notEqual(planParaPublicar(c, dt).firma, a.firma);
  assert.equal(firmaPlan({}), firmaPlan({ marca: { negocio: 'x' } }));
});

test('la marca del entrenador del cliente sale de su plan, limpia', () => {
  assert.equal(marcaDeMiEntrenador({}), null);
  const est = { miEntrenador: { lista: [{ id: 'a', entrenador: 'coach@x.com', plan: { marca: { negocio: 'Fit Lab', color: '#2F80ED', logo: 'http://malo' } } }] } };
  assert.deepEqual(marcaDeMiEntrenador(est), { negocio: 'Fit Lab', color: '#2f80ed', logo: null, correo: 'coach@x.com' });
  assert.deepEqual(marcaDeMiEntrenador({ miEntrenador: { lista: [{ id: 'a', entrenador: 'c@x.com', plan: null }] } }), { negocio: '', color: null, logo: null, correo: 'c@x.com' });
});
