import { test } from 'node:test';
import assert from 'node:assert/strict';
import { statSync } from 'node:fs';
import antioquia from '../src/mapas/antioquia.js';
import colombia from '../src/mapas/colombia.js';
import brasil from '../src/mapas/brasil.js';
import mundo from '../src/mapas/mundo.js';
import { MAPAS } from '../src/mapas/index.js';
import { LUGARES_INICIALES, LUGARES_ANTIOQUIA, TIPOS_LUGAR } from '../src/datos_lugares.js';
import { proyectar, desproyectar, piezaEn, dentroDePieza, cajaDe, piezaDelLugar, lugaresDePieza, estadoPieza, resumenMapa, avanceGrupos, lineaTiempo,
  viajesDelAnio, paisesVisitados, ultimoVisitado, filtrar, ordenar, agregarVisita, sorprender, distanciaKm, mapaHijo, migas, enlaceSeguro, quitarVisita, marcarPieza, desmarcarPieza } from '../src/lugares.js';

const TODOS = { mundo, colombia, brasil, antioquia };
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
  assert.deepEqual(Object.keys(MAPAS).sort(), Object.keys(TODOS).sort());
  for (const [id, info] of Object.entries(MAPAS)) {
    const m = TODOS[id];
    assert.equal(info.id, id);
    assert.equal(m.id, id);
    assert.equal(m.padre, info.padre);
    assert.ok(statSync(new URL('../src/mapas/' + id + '.js', import.meta.url)).size < 300 * 1024, id + ' pesa demasiado');
    if (info.padre) assert.ok(TODOS[info.padre].piezas.some((p) => p.id === info.piezaPadre), id + ': su pieza existe en el mapa de arriba');
    assert.ok(m.nombre && m.ancho > 0 && m.alto > 0 && m.proyeccion.tipo === 'equirectangular');
    assert.equal(new Set(m.piezas.map((p) => p.id)).size, m.piezas.length);
    for (const p of m.piezas) {
      assert.ok(p.id && p.nombre && p.grupo, id + ' ' + p.id);
      assert.match(p.d, /^M[\d. L]+Z(M[\d. L]+Z)*$/, p.nombre);
      assert.equal(p.centro.length, 2);
      assert.ok(m.grupos.includes(p.grupo), p.nombre + ': ' + p.grupo);
    }
  }
  assert.equal(colombia.piezas.length, 33);
  assert.equal(colombia.piezas.filter((p) => p.grupo === 'Andina').length, 11);
  assert.equal(brasil.piezas.length, 27);
  assert.ok(mundo.piezas.length > 200);
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

test('lista inicial: Antioquia, resto de Colombia y Brasil, cada lugar dentro de su pieza y con tipo válido', () => {
  const lista = LUGARES_INICIALES();
  const de = (m) => lista.filter((l) => l.mapa === m).length;
  assert.equal(LUGARES_ANTIOQUIA().length, de('antioquia'));
  assert.ok(de('antioquia') >= 35 && de('antioquia') <= 45);
  assert.ok(de('colombia') >= 13 && de('colombia') <= 18);
  assert.equal(de('brasil'), 10);
  assert.equal(new Set(lista.map((l) => l.id)).size, lista.length);
  for (const l of lista) {
    const m = TODOS[l.mapa], p = m.piezas.find((x) => x.id === l.pieza);
    assert.ok(p, l.nombre + ': su pieza existe');
    assert.ok(dentroDePieza(p, ...proyectar(m, l.lat, l.lon)), l.nombre + ' cae dentro de ' + p.nombre);
    assert.ok(TIPOS_LUGAR[l.tipo], l.nombre);
    assert.equal(l.estado, 'quiero');
    assert.ok(!mapaHijo(MAPAS, l.mapa, l.pieza), l.nombre + ' debe estar en el mapa más específico');
  }
});

test('navegación: Mundo › Colombia › Antioquia y Brasil, con niveles reales del índice', () => {
  assert.deepEqual(migas(MAPAS, 'antioquia').map((m) => m.id), ['mundo', 'colombia', 'antioquia']);
  assert.deepEqual(migas(MAPAS, 'mundo').map((m) => m.id), ['mundo']);
  assert.equal(mapaHijo(MAPAS, 'mundo', 'COL').id, 'colombia');
  assert.equal(mapaHijo(MAPAS, 'mundo', 'BRA').id, 'brasil');
  assert.equal(mapaHijo(MAPAS, 'colombia', '05').id, 'antioquia');
  assert.equal(mapaHijo(MAPAS, 'colombia', '13'), null);
  const penol = LUGARES_ANTIOQUIA()[0];
  assert.equal(piezaDelLugar(penol, 'colombia', MAPAS), '05');
  assert.equal(piezaDelLugar(penol, 'mundo', MAPAS), 'COL');
  assert.equal(piezaDelLugar(penol, 'brasil', MAPAS), null);
  const visita = { ...penol, estado: 'visitado' };
  assert.equal(resumenMapa(mundo, [visita], MAPAS, 2026).piezas, 1);
  assert.equal(avanceGrupos(colombia, [visita], MAPAS).find((g) => g.grupo === 'Andina').hechas, 1);
});

test('proyección en cada mapa: las ciudades conocidas quedan en su pieza', () => {
  const casos = [[mundo, 'COL', 6.25, -75.56], [mundo, 'BRA', -15.79, -47.88], [mundo, 'ESP', 40.42, -3.7], [colombia, '11', 4.65, -74.1], [colombia, '76', 3.45, -76.53], [brasil, 'RJ', -22.91, -43.2], [brasil, 'DF', -15.79, -47.88]];
  for (const [m, id, lat, lon] of casos) {
    assert.equal(piezaEn(m, ...proyectar(m, lat, lon))?.id, id, m.id + ' ' + id);
    const [la, lo] = desproyectar(m, ...proyectar(m, lat, lon));
    assert.ok(Math.abs(la - lat) < 1e-6 && Math.abs(lo - lon) < 1e-6);
  }
});

test('enlace de fotos: solo http y https', () => {
  assert.equal(enlaceSeguro(' https://drive.google.com/drive/folders/abc '), 'https://drive.google.com/drive/folders/abc');
  assert.equal(enlaceSeguro('javascript:alert(1)'), '');
  assert.equal(enlaceSeguro('data:text/html,x'), '');
  assert.equal(enlaceSeguro('drive.google.com/x'), '');
  assert.equal(enlaceSeguro(''), '');
  assert.equal(enlaceSeguro(undefined), '');
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

test('borrar la última visita devuelve el lugar a quiero ir, y deja de contar en los números', () => {
  const l = lugar({ pieza: '05789' });
  agregarVisita(l, { fecha: '2026-05-02' });
  agregarVisita(l, { fecha: '2026-06-02' });
  quitarVisita(l, 0);
  assert.equal(l.estado, 'visitado');
  quitarVisita(l, 0);
  assert.equal(l.estado, 'quiero');
  assert.equal(resumenMapa(antioquia, [l], SOLO, 2026).piezas, 0);
  assert.equal(estadoPieza([l]).estado, 'quiero');
});

test('un lugar pasado a quiero ir sale de la línea de tiempo y de los viajes', () => {
  const l = lugar({ estado: 'quiero', visitas: [{ fecha: '2026-05-02' }] });
  assert.equal(lineaTiempo([l]).length, 0);
  assert.equal(viajesDelAnio([l], 2026), 0);
  assert.equal(ultimoVisitado([l]), null);
  l.estado = 'visitado';
  assert.equal(lineaTiempo([l]).length, 1);
});

test('marcar y quitar una pieza entera, sin duplicar lugares', () => {
  const tamesis = lugar({ nombre: 'Támesis', pieza: '05789' }), otro = lugar({ nombre: 'Otro', pieza: '05789', estado: 'visitado', visitas: [{ fecha: '2026-01-01' }] });
  const creado = lugar({ nombre: 'Andes', pieza: '05034', estado: 'visitado', marcaEntera: true }), lista = [tamesis, otro, creado];
  assert.equal(marcarPieza(lista, pieza('Támesis')), tamesis);
  assert.equal(tamesis.estado, 'visitado');
  assert.equal(marcarPieza(lista, pieza('Jardín')), null);
  desmarcarPieza(lista, 'antioquia', '05789', SOLO);
  assert.equal(tamesis.estado, 'quiero');
  assert.equal(otro.estado, 'quiero');
  assert.equal(otro.visitas.length, 1); // las visitas no se pierden
  desmarcarPieza(lista, 'antioquia', '05034', SOLO);
  assert.ok(!lista.includes(creado)); // lo creado solo para marcar se borra
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
