import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e } from '../src/estado.js';
import { CURSOS, curso, areas, area, areaDeCurso, catalogoAreas, catalogoCursos } from '../src/cursos/index.js';
import { LIBROS } from '../src/libros/index.js';
import { progresoCurso, lecciones, leccionQueToca, hechas, sumarTarjetas, repasar, dominada, pendientes, tarjeta, planDelDia, siguientes,
  anotar, rachaEstudio, INTERVALOS } from '../src/estudio.js';
import { sumarDias } from '../src/fechas.js';
import { enOrden, oculto, alternar, SECCIONES } from '../src/orden.js';

const texto = (s) => typeof s === 'string' && s.trim().length > 0;

// Formato de src/cursos (lo que /agregar-curso debe producir): cada curso nuevo tiene que pasar esta prueba
for (const c of CURSOS) {
  test('curso "' + c.id + '": formato completo', () => {
    for (const k of ['id', 'nombre', 'area', 'icono', 'nivel', 'paraQue']) assert.ok(texto(c[k]), 'falta ' + k);
    assert.match(c.id, /^[a-z0-9-]+$/);
    assert.equal(areaDeCurso(c.id) && areaDeCurso(c.id).id, c.area, 'el curso va en el catálogo de su área');
    assert.ok(c.modulos.length >= 1);
    for (const m of c.modulos) {
      assert.ok(texto(m.titulo) && texto(m.objetivo), 'módulo sin título u objetivo');
      assert.ok(m.fuentes.length >= 2 && m.fuentes.every(([cita, para]) => texto(cita) && texto(para) && /\d{4}/.test(cita)), m.titulo + ': fuentes con año');
      assert.ok(m.lecciones.length >= 1);
    }
    for (const l of lecciones(c)) {
      const donde = 'lección ' + l.n + ' (' + l.titulo + ')';
      for (const k of ['titulo', 'idea', 'pregunta', 'nota']) assert.ok(texto(l[k]), donde + ' sin ' + k);
      assert.ok(Number.isInteger(l.minutos) && l.minutos >= 5 && l.minutos <= 15, donde + ': unos 10 minutos');
      assert.ok(l.bloques.length && l.bloques.every(([t, ps]) => texto(t) && ps.length && ps.every(texto)), donde + ' con bloques vacíos');
      assert.ok(l.ejemplos.length >= 1 && l.ejemplos.every(texto), donde + ' sin ejemplos');
      assert.equal(l.practica.length, 3, donde + ': la práctica son 3 acciones');
      assert.ok(l.recordar.length >= 3 && l.recordar.length <= 5, donde + ': 3-5 preguntas de recordar sin mirar');
      assert.ok(l.recordar.every(([p, r]) => texto(p) && texto(r)), donde + ': recordar sin respuesta');
      assert.ok(l.tarjetas.length >= 1 && l.tarjetas.every(([f, r]) => texto(f) && texto(r)), donde + ': tarjetas');
    }
    assert.ok(texto(c.proyecto.titulo) && texto(c.proyecto.intro) && c.proyecto.pasos.length >= 3 && c.proyecto.pasos.every(texto), 'proyecto final');
  });
}

test('las 7 áreas: Libros primero con los libros de siempre, y ningún id repetido', () => {
  const as = areas();
  assert.equal(as.length, 7);
  assert.equal(as[0].id, 'libros');
  assert.deepEqual(as[0].cursos.map((x) => x.id), LIBROS.map((x) => x.id));
  assert.ok(as[0].cursos.every((x) => x.libro));
  const ids = as.flatMap((a) => a.cursos.map((x) => x.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 23); // 4 libros y 19 cursos
  assert.equal(area('esoterico').cursos.length, 6);
  assert.equal(curso('aprender-a-aprender').modulos.length, 3);
  assert.equal(curso('sesgos-cognitivos'), null); // Próximamente
  assert.ok(catalogoAreas().libros.includes('Libros'));
  assert.ok(catalogoCursos()['aprender-a-aprender'].includes('Aprender y pensar'));
});

const aa = curso('aprender-a-aprender');

test('Aprender a aprender: 9 lecciones con los temas del plan', () => {
  assert.equal(lecciones(aa).length, 9);
  const todo = JSON.stringify(aa);
  for (const x of ['Roediger', 'Karpicke', 'Ebbinghaus', 'Cepeda', 'Rohrer', 'Chi', 'Sweller', 'Cowan', 'Born', 'Pashler', 'Dunlosky'])
    assert.ok(todo.includes(x), 'falta ' + x);
});

test('Metacognición: 9 lecciones con los temas y autores clave', () => {
  const m = curso('metacognicion');
  assert.equal(lecciones(m).length, 9);
  const todo = JSON.stringify(m);
  for (const x of ['Flavell', 'Nelson', 'Dunlosky', 'Kruger', 'Rozenblit', 'Zimmerman', 'Buehler', 'Gollwitzer', 'Tannenbaum', 'Metcalfe', 'Kahneman', 'premortem', 'calibra'])
    assert.ok(todo.includes(x), 'falta ' + x);
});

test('la lección que toca es la primera sin terminar', () => {
  const p = progresoCurso();
  assert.equal(leccionQueToca(aa, p), 1);
  p.hechas = { 1: '2026-10-20', 2: '2026-10-21', 4: '2026-10-23' };
  assert.equal(leccionQueToca(aa, p), 3); // si se salta una, vuelve a ella
  assert.equal(hechas(aa, p), 3);
  p.hechas = Object.fromEntries(lecciones(aa).map((l) => [l.n, '2026-10-01']));
  assert.equal(leccionQueToca(aa, p), null);
});

test('tarjetas: 1, 3, 7, 16 y 35 días; fallar vuelve a empezar', () => {
  const t = {}, l1 = lecciones(aa)[0];
  sumarTarjetas(t, aa, l1, '2026-10-29');
  assert.equal(Object.keys(t).length, l1.tarjetas.length);
  const id = 'aprender-a-aprender:1:0', x = t[id];
  assert.equal(x.proxima, '2026-10-30');
  assert.deepEqual(pendientes(t, '2026-10-29'), []);
  assert.equal(pendientes(t, '2026-10-30').length, l1.tarjetas.length);
  let hoy = '2026-10-30';
  for (const dias of INTERVALOS.slice(1)) { repasar(x, true, hoy); assert.equal(x.proxima, sumarDias(hoy, dias)); hoy = x.proxima; }
  repasar(x, true, hoy);
  assert.ok(dominada(x));
  assert.ok(!pendientes(t, '2030-01-01').includes(id));
  const y = t['aprender-a-aprender:1:1'];
  repasar(y, true, '2026-10-30'); repasar(y, false, '2026-11-02');
  assert.equal(y.paso, 0);
  assert.equal(y.proxima, '2026-11-03');
  // Sumar la lección otra vez no reinicia las que ya estaban
  sumarTarjetas(t, aa, l1, '2026-11-05');
  assert.ok(dominada(t[id]));
  assert.equal(tarjeta(CURSOS, id).frente, l1.tarjetas[0][0]);
  assert.equal(tarjeta(CURSOS, 'no:1:0'), null);
});

test('pendientes: las más atrasadas primero', () => {
  const t = { 'a:1:0': { paso: 1, proxima: '2026-10-28' }, 'a:1:1': { paso: 0, proxima: '2026-10-20' }, 'a:2:0': { paso: 2, proxima: '2026-11-10' } };
  assert.deepEqual(pendientes(t, '2026-10-29'), ['a:1:1', 'a:1:0']);
});

test('plan del día: primero repasos y luego las lecciones que quepan', () => {
  const sig = [{ curso: 'x', n: 1, minutos: 10 }, { curso: 'x', n: 2, minutos: 10 }];
  let p = planDelDia({ minutos: 15, repasos: 6, siguientes: sig });
  assert.equal(p.repasos, 6); // 3 min
  assert.deepEqual(p.lecciones.map((l) => l.n), [1]);
  p = planDelDia({ minutos: 25, repasos: 0, siguientes: sig });
  assert.equal(p.lecciones.length, 2);
  // Mucho repaso: no cabe la lección, solo repaso (y lo que no cupo queda para después)
  p = planDelDia({ minutos: 15, repasos: 40, siguientes: sig });
  assert.equal(p.repasos, 30);
  assert.equal(p.quedanRepasos, 10);
  assert.equal(p.lecciones.length, 0);
  // Si sobra poco tiempo, solo repaso
  p = planDelDia({ minutos: 15, repasos: 14, siguientes: sig });
  assert.equal(p.lecciones.length, 0);
  // Pocos minutos y nada que repasar: igual se propone la siguiente
  p = planDelDia({ minutos: 5, repasos: 0, siguientes: sig });
  assert.deepEqual(p.lecciones.map((l) => l.n), [1]);
  assert.ok(p.excede);
  // Lo hecho hoy descuenta: con la lección de 10 ya hecha y 15 minutos, no cabe otra
  p = planDelDia({ minutos: 15, repasos: 0, siguientes: sig, hecho: { minutos: 10, repasos: 0 } });
  assert.ok(p.listo);
  assert.ok(planDelDia({ minutos: 15, repasos: 0, siguientes: [] }).listo);
});

test('siguientes: primero el curso actual, luego los empezados', () => {
  const a = { id: 'a', modulos: [{ lecciones: [{ minutos: 10 }, { minutos: 8 }] }] }, b = { id: 'b', modulos: [{ lecciones: [{ minutos: 12 }] }] };
  const est = { cursos: { a: { ...progresoCurso(), hechas: { 1: '2026-10-28' } } } };
  assert.deepEqual(siguientes([b, a], est).map((x) => x.curso + x.n), ['a2', 'b1']);
  assert.deepEqual(siguientes([a, b], { ...est, actual: 'b' }).map((x) => x.curso + x.n), ['b1', 'a2']);
});

test('racha de estudio: lecciones o repasos; si hoy no hay nada cuenta hasta ayer', () => {
  const dias = {};
  anotar(dias, 'lecciones', 1, '2026-10-26');
  anotar(dias, 'repasos', 5, '2026-10-27');
  anotar(dias, 'lecciones', 1, '2026-10-28');
  assert.equal(rachaEstudio(dias, '2026-10-29'), 3);
  anotar(dias, 'repasos', 1, '2026-10-29');
  assert.equal(rachaEstudio(dias, '2026-10-29'), 4);
  assert.equal(rachaEstudio(dias, '2026-10-31'), 0);
  anotar(dias, 'lecciones', -1, '2026-10-28'); // desmarcar
  assert.equal(rachaEstudio(dias, '2026-10-29'), 1);
});

test('quien tenía Libros movido o escondido ve igual a Estudiar y su tarjeta de Hoy', () => {
  const config = { orden: { menu: ['libros', 'hoy'], hoy: ['libros', 'metas'] }, ocultos: { hoy: ['libros'] } };
  assert.deepEqual(enOrden(config, 'menu').slice(0, 2), ['estudiar', 'hoy']);
  assert.equal(enOrden(config, 'hoy')[0], 'estudio');
  assert.ok(oculto(config, 'hoy', 'estudio'));
  alternar(config, 'hoy', 'estudio');
  assert.ok(!oculto(config, 'hoy', 'estudio'));
  assert.ok(!('libros' in SECCIONES));
});

test('el estado trae el estudio vacío y 15 minutos al día', () => {
  assert.deepEqual(e().estudio, { cursos: {}, tarjetas: {}, dias: {} });
  assert.equal(e().config.estudio.minutos, 15);
});
