import { test } from 'node:test';
import assert from 'node:assert/strict';
import { e } from '../src/estado.js';
import { LIBROS, libro } from '../src/libros/index.js';
import { SESIONES } from '../src/datos_iniciales.js';
import { progresoInicial, lecturaQueToca, leidas, racha, buscar, afirmacionDelDia, resultadoEvaluacion } from '../src/biblioteca.js';

// Formato de src/libros (lo que /agregar-libro debe producir): cada libro nuevo tiene que pasar esta prueba
for (const l of LIBROS) {
  test('libro "' + l.id + '": formato completo', () => {
    for (const k of ['id', 'titulo', 'autor', 'icono', 'descripcion', 'unidad']) assert.ok(l[k], 'falta ' + k);
    assert.match(l.id, /^[a-z0-9-]+$/);
    assert.ok(l.lecturas.length >= 1);
    const enRango = (n, donde) => assert.ok(Number.isInteger(n) && n >= 1 && n <= l.lecturas.length, donde + ': lectura ' + n + ' no existe');
    l.lecturas.forEach((d, i) => {
      const donde = 'lectura ' + (i + 1);
      assert.equal(d.n, i + 1, donde + ' fuera de orden');
      for (const k of ['titulo', 'idea', 'intro', 'pregunta']) assert.ok(typeof d[k] === 'string' && d[k].trim(), donde + ' sin ' + k);
      assert.ok(Array.isArray(d.temas) && d.temas.length, donde + ' sin temas');
      assert.ok(d.bloques.length && d.bloques.every(([t, ps]) => t && ps.length && ps.every((p) => typeof p === 'string' && p.trim())), donde + ' con bloques vacíos');
      assert.equal(d.practica.length, 3, donde + ': la práctica son 3 acciones');
      assert.ok(Array.isArray(d.formulas || []));
    });
    const ids = new Set();
    for (const c of l.consejos) {
      assert.ok(!ids.has(c.id), 'consejo repetido ' + c.id); ids.add(c.id);
      assert.ok(c.icono && c.texto && c.claves.length && c.ahora.length === 3, 'consejo ' + c.id + ' incompleto');
      c.dias.forEach((n) => enRango(n, 'consejo ' + c.id));
      if (c.herramienta) assert.ok(c.herramienta === 'diario' || c.herramienta === 'perfil' || (l.fichas && l.fichas[c.herramienta]) || (l.evaluaciones && l.evaluaciones[c.herramienta]), 'consejo ' + c.id + ': herramienta ' + c.herramienta);
      if (c.sesion) assert.ok((l.sesiones || []).some((s) => s.id === c.sesion) || SESIONES.some((s) => s.id === c.sesion), 'consejo ' + c.id + ': sesión ' + c.sesion);
    }
    assert.ok(l.consejos.length >= 10, 'al menos 10 situaciones en Preguntar');
    if (l.grupos) {
      const enGrupos = l.grupos.flatMap(([, x]) => x);
      assert.equal(new Set(enGrupos).size, enGrupos.length, 'un consejo en dos grupos');
      assert.deepEqual([...enGrupos].sort(), [...ids].sort(), 'cada consejo va en un grupo');
    }
    if (l.conceptos) for (const c of l.conceptos.lista) { assert.ok(c.nombre && c.texto); c.dias.forEach((n) => enRango(n, c.nombre)); }
    assert.ok(l.rutina.length && l.rutina.every(([t, ps]) => t && ps.length));
    for (const f of Object.values(l.fichas || {})) { assert.ok(f.titulo && f.nueva && f.campos.length); if (f.lectura) enRango(f.lectura, f.titulo); }
    if (l.diario) assert.ok(l.diario.campos.length);
    for (const [k, ev] of Object.entries(l.evaluaciones || {})) {
      assert.ok(ev.titulo && ev.intro && ev.items.length >= 4, 'evaluación ' + k);
      for (const [texto, cat] of ev.items) assert.ok(texto && ev.categorias[cat], 'evaluación ' + k + ': categoría ' + cat);
      for (const c of Object.values(ev.categorias)) assert.ok(c.nombre && c.consejo);
      if (ev.lectura) enRango(ev.lectura, ev.titulo);
    }
    // Las herramientas se abren por su clave: no pueden repetirse
    const claves = [...Object.keys(l.fichas || {}), ...Object.keys(l.evaluaciones || {}), 'diario', 'perfil', 'sesiones'];
    assert.equal(new Set(claves).size, claves.length, 'herramientas con la misma clave');
    for (const s of l.sesiones || []) assert.ok(s.id && s.nombre && s.tipo && s.pasos.every((p) => p.nombre && p.seg > 0), 'sesión ' + s.id);
  });
}

test('los libros no repiten id ni sesiones', () => {
  assert.equal(new Set(LIBROS.map((l) => l.id)).size, LIBROS.length);
  const sesiones = [...SESIONES, ...LIBROS.flatMap((l) => l.sesiones || [])].map((s) => s.id);
  assert.equal(new Set(sesiones).size, sesiones.length);
});

const fenix = libro('fenix');

test('Fénix: 27 lecturas y toca la primera sin leer', () => {
  assert.equal(fenix.lecturas.length, 27);
  const p = progresoInicial();
  assert.equal(lecturaQueToca(fenix, p), 1);
  p.leidos = { 1: '2026-10-20', 2: '2026-10-21', 4: '2026-10-23' };
  assert.equal(lecturaQueToca(fenix, p), 3); // si se salta una, vuelve a ella
  assert.equal(leidas(fenix, p), 3);
  p.leidos = Object.fromEntries(fenix.lecturas.map((d) => [d.n, '2026-10-01']));
  assert.equal(lecturaQueToca(fenix, p), null);
});

test('racha: lecturas, práctica y lo escrito en el día cuentan', () => {
  const p = progresoInicial();
  p.leidos = { 1: '2026-10-20', 2: '2026-10-21', 4: '2026-10-23' };
  p.practica = { 3: { 0: '2026-10-22' } };
  assert.equal(racha('fenix', p, {}, '2026-10-24'), 4); // hoy sin nada: cuenta hasta ayer
  assert.equal(racha('fenix', p, { '2026-10-24': { libros: { fenix: { buenas: 'algo' } } } }, '2026-10-24'), 5);
  assert.equal(racha('otro', p, { '2026-10-24': { libros: { fenix: { buenas: 'algo' } } } }, '2026-10-24'), 4); // lo de otro libro no cuenta
  assert.equal(racha('fenix', p, {}, '2026-10-26'), 0);
});

test('el buscador encuentra la lectura y el consejo que corresponde', () => {
  const r = buscar(fenix, 'estoy muy preocupado por el dinero');
  assert.equal(r.lecturas[0].n, 8);
  assert.equal(r.consejos[0].id, 'preocupado');
  assert.equal(buscar(fenix, 'estrés').consejos[0].id, 'estres');
  assert.equal(buscar(fenix, 'cómo perdonar').lecturas[0].n, 6);
  assert.ok(buscar(fenix, '80/20').conceptos.some((l) => l.nombre.includes('80/20')));
  assert.ok(buscar(fenix, 'procrastino').lecturas.some((d) => d.n === 17));
  assert.equal(buscar(fenix, 'no puedo dormir, insomnio').consejos[0].id, 'dormir');
  assert.equal(buscar(fenix, 'me siento vacío').consejos[0].id, 'vacio');
  assert.equal(buscar(fenix, 'tengo deudas').consejos[0].id, 'dinero');
  assert.deepEqual(buscar(fenix, 'de la'), { consejos: [], lecturas: [], conceptos: [] });
});

test('el estado trae los libros, sus sesiones y una afirmación por día', () => {
  assert.deepEqual(e().libros, {});
  assert.ok(e().sesiones.some((s) => s.id === 'respiracion-448'));
  assert.notEqual(afirmacionDelDia(fenix, '2026-10-24'), afirmacionDelDia(fenix, '2026-10-25'));
});

const crecimiento = libro('crecimiento');

test('Crecimiento: 10 lecturas con las 5 infografías completas', () => {
  assert.equal(crecimiento.lecturas.length, 10);
  const texto = JSON.stringify(crecimiento.lecturas);
  for (const x of ['Regalías de libros', 'Terrenos para antenas', 'Cultivar bonsáis', 'Cálculo mental', 'Culpa (con tacto)', 'Frustración', 'Meta a 5 años', 'Ahora mismo', 'Progreso antes que comodidad', 'Alcanzar tu potencial'])
    assert.ok(texto.includes(x), 'falta ' + x);
});

test('Crecimiento: el buscador lleva a la lectura y al consejo correctos', () => {
  assert.equal(buscar(crecimiento, 'publico y nadie me compra').consejos[0].id, 'nadie-compra');
  assert.ok(buscar(crecimiento, 'quiero ganar con una app').consejos.some((c) => c.id === 'app-curso'));
  assert.equal(buscar(crecimiento, 'zona de confort').consejos[0].id, 'comodo');
  assert.equal(buscar(crecimiento, 'ajedrez sudoku').lecturas[0].n, 10);
  assert.equal(buscar(crecimiento, 'embudo meta a 5 años').lecturas[0].n, 4);
});

test('evaluación de zonas: la zona principal es la de mayor porcentaje', () => {
  const ev = crecimiento.evaluaciones.zonas, marcar = (cat, n) => Object.fromEntries(ev.items.map((it, i) => [i, it]).filter(([, it]) => it[1] === cat).slice(0, n).map(([i]) => [i, true]));
  assert.equal(resultadoEvaluacion(ev, {}).principal, null);
  assert.equal(resultadoEvaluacion(ev, marcar('comodidad', 3)).principal, 'comodidad');
  const r = resultadoEvaluacion(ev, { ...marcar('comodidad', 1), ...marcar('aprendizaje', 4) });
  assert.equal(r.principal, 'aprendizaje');
  assert.equal(r.pct.comodidad, 0.25);
  assert.ok(Math.abs(r.pct.aprendizaje - 4 / 6) < 1e-9);
});
