import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import antioquia from '../src/mapas/antioquia.js';
import { LUGARES_INICIALES, TIPOS_LUGAR } from '../src/datos_lugares.js';
import { proyectar, desproyectar, piezaEn, dentroDePieza, cajaDe, piezaDelLugar, lugaresDePieza, estadoPieza, resumenMapa, avanceGrupos, lineaTiempo,
  viajesDelAnio, paisesVisitados, ultimoVisitado, filtrar, ordenar, agregarVisita, sorprender, distanciaKm } from '../src/lugares.js';

// El índice real importa los mapas con import(), que no hace falta aquí: estos datos cubren un nivel de arriba
const INDICE = { antioquia: { padre: 'colombia', piezaPadre: '05' }, colombia: { padre: 'mundo', piezaPadre: 'CO' }, mundo: { padre: null } };
const SOLO = { antioquia: { padre: null } };
const pieza = (nombre) => antioquia.piezas.find((p) => p.nombre === nombre);
const lugar = (datos) => ({ id: datos.nombre || 'x', nombre: 'x', mapa: 'antioquia', pieza: '05001', pais: 'Colombia', estado: 'quiero', visitas: [], ...datos });

test('Antioquia: 125 municipios en sus 9 subregiones', () => {
  assert.equal(antioquia.piezas.length, 125);
  assert.equal(new Set(antioquia.piezas.map((p) => p.id)).size, 125);
  const cuenta = {};
  for (const p of antioquia.piezas) cuenta[p.grupo] = (cuenta[p.grupo] || 0) + 1;
  assert.deepEqual(cuenta, { 'Valle de Aburrá': 10, Oriente: 23, Suroeste: 23, Occidente: 19, Norte: 17, Nordeste: 10, 'Magdalena Medio': 6, 'Bajo Cauca': 6, Urabá: 11 });
  assert.equal(pieza('Medellín').grupo, 'Valle de Aburrá');
  assert.equal(pieza('Guatapé').grupo, 'Oriente');
  assert.equal(pieza('Caicedo').grupo, 'Occidente');
  assert.equal(pieza('Turbo').grupo, 'Urabá');
});

test('todos los mapas del índice tienen el mismo formato, su padre existe y pesan menos de 300 KB', () => {
  const fuente = readFileSync(new URL('../src/mapas/index.js', import.meta.url), 'utf8');
  const ids = [...fuente.matchAll(/^\s+(\w+): \{ id: '(\w+)'.*padre: (null|'\w+'), piezaPadre: (null|'\w+')/gm)];
  assert.ok(ids.length >= 1);
  for (const [, clave, id, padre] of ids) {
    assert.equal(clave, id);
    if (padre !== 'null') assert.ok(ids.some((x) => x[2] === padre.replaceAll("'", '')), 'el padre de ' + id + ' existe');
    assert.ok(statSync(new URL('../src/mapas/' + id + '.js', import.meta.url)).size < 300 * 1024, id + ' pesa demasiado');
  }
  const m = antioquia;
  assert.ok(m.id && m.nombre && m.ancho > 0 && m.alto > 0 && m.proyeccion.tipo === 'equirectangular');
  for (const p of m.piezas) {
    assert.ok(p.id && p.nombre && p.grupo, p.id);
    assert.match(p.d, /^M[\d. L]+Z(M[\d. L]+Z)*$/, p.nombre);
    assert.equal(p.centro.length, 2);
    assert.ok(m.grupos.includes(p.grupo));
  }
});

test('proyección: los lugares conocidos quedan en su sitio y se puede volver a lat/lon', () => {
  const [mx, my] = proyectar(antioquia, 6.2518, -75.5636); // Medellín
  assert.equal(piezaEn(antioquia, mx, my).nombre, 'Medellín');
  const [tx, ty] = proyectar(antioquia, 8.095, -76.7286); // Turbo
  assert.ok(ty < my && tx < mx, 'Turbo queda al norte y al occidente de Medellín');
  const [lat, lon] = desproyectar(antioquia, mx, my);
  assert.ok(Math.abs(lat - 6.2518) < 1e-6 && Math.abs(lon + 75.5636) < 1e-6);
  assert.equal(piezaEn(antioquia, ...proyectar(antioquia, 4.7, -74.1)), null); // Bogotá está fuera
});

test('lista inicial: unos 40 de Antioquia, cada uno dentro de su municipio y con tipo válido', () => {
  const lista = LUGARES_INICIALES();
  assert.ok(lista.length >= 35 && lista.length <= 45);
  assert.equal(new Set(lista.map((l) => l.id)).size, lista.length);
  for (const l of lista) {
    const p = antioquia.piezas.find((x) => x.id === l.pieza);
    assert.ok(p, l.nombre + ': su pieza existe');
    assert.ok(dentroDePieza(p, ...proyectar(antioquia, l.lat, l.lon)), l.nombre + ' cae dentro de ' + p.nombre);
    assert.ok(TIPOS_LUGAR[l.tipo], l.nombre);
    assert.equal(l.estado, 'quiero');
  }
});

test('niveles: un lugar sube a las piezas de los mapas de arriba', () => {
  const l = lugar({ pieza: '05321' });
  assert.equal(piezaDelLugar(l, 'antioquia', INDICE), '05321');
  assert.equal(piezaDelLugar(l, 'colombia', INDICE), '05');
  assert.equal(piezaDelLugar(l, 'mundo', INDICE), 'CO');
  assert.equal(piezaDelLugar(lugar({ mapa: 'brasil', pieza: 'RJ' }), 'antioquia', INDICE), null);
  assert.equal(lugaresDePieza([l], 'colombia', '05', INDICE).length, 1);
});

test('estado de la pieza: visitado gana, y el tono sube con lo recorrido', () => {
  assert.deepEqual(estadoPieza([]), { estado: 'nada', tono: 0 });
  assert.deepEqual(estadoPieza([lugar({})]), { estado: 'quiero', tono: 0 });
  const v = lugar({ estado: 'visitado' });
  assert.deepEqual(estadoPieza([lugar({}), v]), { estado: 'visitado', tono: 1 });
  assert.deepEqual(estadoPieza([v, v]).tono, 2);
  assert.deepEqual(estadoPieza([v, v, v, v, v]).tono, 3);
});

test('números: porcentajes, grupos, viajes, países y último lugar', () => {
  const lista = [
    lugar({ nombre: 'a', pieza: '05321', estado: 'visitado', visitas: [{ fecha: '2026-03-01' }] }),
    lugar({ nombre: 'b', pieza: '05321', estado: 'visitado', visitas: [{ fecha: '2026-03-01' }] }),
    lugar({ nombre: 'c', pieza: '05001', estado: 'visitado', visitas: [{ fecha: '2025-01-10' }, { fecha: '2026-08-05' }] }),
    lugar({ nombre: 'd', pieza: '05837' }),
    lugar({ nombre: 'e', mapa: 'brasil', pieza: 'RJ', pais: 'Brasil', estado: 'visitado', visitas: [] }),
  ];
  const r = resumenMapa(antioquia, lista, SOLO, 2026);
  assert.equal(r.piezas, 2);
  assert.equal(r.total, 125);
  assert.ok(Math.abs(r.fraccion - 2 / 125) < 1e-9);
  assert.equal(r.visitados, 3);
  assert.equal(r.porVisitar, 1);
  assert.equal(r.viajes, 2); // dos lugares el mismo día son un viaje
  assert.equal(r.paises, 2);
  assert.equal(r.ultimo.nombre, 'c');
  const g = avanceGrupos(antioquia, lista, SOLO);
  assert.equal(g.length, 9);
  assert.deepEqual(g.find((x) => x.grupo === 'Oriente'), { grupo: 'Oriente', hechas: 1, total: 23, fraccion: 1 / 23 });
  assert.equal(g.find((x) => x.grupo === 'Urabá').hechas, 0);
  assert.equal(lineaTiempo(lista)[0].visita.fecha, '2026-08-05');
  assert.equal(viajesDelAnio(lista, 2025), 1);
  assert.equal(paisesVisitados([]), 0);
  assert.equal(ultimoVisitado([]), null);
  const sinMapa = { ...antioquia, piezas: [], grupos: [] };
  assert.equal(resumenMapa(sinMapa, [], SOLO, 2026).fraccion, 0);
});

test('agregar una visita marca el lugar como visitado y deja las visitas en orden', () => {
  const l = lugar({});
  agregarVisita(l, { fecha: '2026-05-02' });
  agregarVisita(l, { fecha: '2026-01-02' });
  assert.equal(l.estado, 'visitado');
  assert.deepEqual(l.visitas.map((v) => v.fecha), ['2026-01-02', '2026-05-02']);
});

test('filtrar y ordenar', () => {
  const a = lugar({ nombre: 'Jardín', tipo: 'pueblo', prioridad: 2 }), b = lugar({ nombre: 'Río', tipo: 'agua', prioridad: 1 }), c = lugar({ nombre: 'Ya', estado: 'visitado', prioridad: 1 });
  assert.deepEqual(filtrar([a, b, c], { estado: 'quiero', tipo: 'agua' }), [b]);
  assert.deepEqual(filtrar([a, b, c], { texto: 'jard' }), [a]);
  assert.deepEqual(filtrar([a, b], { grupo: 'Oriente' }, (l) => (l === a ? 'Oriente' : 'Norte')), [a]);
  assert.deepEqual(ordenar([c, a, b]), [b, a, c]);
});

test('Sorpréndeme: respeta la distancia, sigue la prioridad y propone lugares cercanos', () => {
  const lista = LUGARES_INICIALES();
  for (const tiro of [0, 0.25, 0.5, 0.75, 0.999]) {
    const plan = sorprender(lista, { azar: () => tiro });
    assert.ok(plan.principal.horas <= 4 && plan.principal.estado === 'quiero');
    assert.ok(!plan.cercanos.includes(plan.principal));
    for (const x of plan.cercanos) assert.ok(distanciaKm(x, plan.principal) <= 30);
  }
  const cerca = lugar({ nombre: 'alta', prioridad: 1, horas: 1, lat: 6, lon: -75 }), lejos = lugar({ nombre: 'baja', prioridad: 3, horas: 4, lat: 6, lon: -75 });
  assert.equal(sorprender([cerca, lejos], { azar: () => 0.5 }).principal, cerca);
  assert.equal(sorprender([lugar({ horas: 9, lat: 8, lon: -76 })]), null);
  assert.equal(sorprender([]), null);
  assert.equal(sorprender([lugar({ estado: 'visitado', horas: 1, lat: 6, lon: -75 })]), null);
});

test('cajaDe encierra la subregión', () => {
  const c = cajaDe(antioquia.piezas.filter((p) => p.grupo === 'Valle de Aburrá'));
  const [x, y] = pieza('Medellín').centro;
  assert.ok(x > c.x && x < c.x + c.w && y > c.y && y < c.y + c.h);
  assert.ok(c.w < antioquia.ancho / 2);
});
