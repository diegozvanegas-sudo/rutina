import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALIMENTOS_USDA, CATEGORIAS_EQUIV } from '../src/datos_equivalencias.js';
import { ALIMENTOS } from '../src/datos_dieta.js';
import {
  todos, equivalente, comparar, sugerir, buscar, practica, redondear, cantidadValida, paraDieta, sustituirEnComida, fotoComida, valoresDe,
} from '../src/equivalencias.js';

const LISTA = todos(ALIMENTOS_USDA, ALIMENTOS);
const al = (id) => LISTA.find((a) => a.id === id);
const casi = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, a + ' ≠ ' + b);

test('los datos de USDA están completos y cada alimento tiene su fuente', () => {
  assert.ok(ALIMENTOS_USDA.length >= 100);
  const cats = new Set(CATEGORIAS_EQUIV.map(([k]) => k));
  for (const a of ALIMENTOS_USDA) {
    for (const k of ['kcal', 'p', 'c', 'g']) assert.equal(typeof a[k], 'number', a.id + ' sin ' + k);
    assert.ok(a.fdc > 0 && a.usda, a.id + ' sin fuente');
    assert.ok(cats.has(a.categoria), a.id + ' con categoría rara: ' + a.categoria);
  }
  assert.equal(new Set(ALIMENTOS_USDA.map((a) => a.id)).size, ALIMENTOS_USDA.length);
});

test('1. por calorías: 210 g de arroz cocido ≈ 72 g de avena cruda (el ejemplo del prompt)', () => {
  const r = equivalente(al('usda:arroz-cocido'), 210, al('usda:avena-cruda'), 'kcal');
  casi(r.objetivo, 210 * 130 / 100);
  casi(r.exacta, (210 * 130) / 379);
  assert.equal(r.cantidad, 72);
  assert.equal(r.unidad, 'g');
  // Igualar calorías no iguala lo demás: la avena trae más proteína y grasa
  const prote = r.tabla.find((x) => x.k === 'p');
  assert.ok(prote.sustituto > prote.original);
  assert.ok(r.practica.ok);
});

test('2. por carbohidratos', () => {
  const r = equivalente(al('usda:arroz-cocido'), 200, al('usda:papa-cocida'), 'c');
  casi(r.exacta, (200 * al('usda:arroz-cocido').c) / al('usda:papa-cocida').c);
  casi(valoresDe(al('usda:papa-cocida'), r.exacta).c, valoresDe(al('usda:arroz-cocido'), 200).c);
});

test('3. por proteína, y con un alimento tuyo por unidad (huevos)', () => {
  const r = equivalente(al('usda:pechuga-cruda'), 150, al('usda:tilapia-cruda'), 'p');
  casi(r.exacta, (150 * 22.5) / al('usda:tilapia-cruda').p);
  // Tus huevos van por unidad (6 g de proteína cada uno): 150 g de pechuga cruda = 33,75 g → 5,6 huevos → 5,5
  const h = equivalente(al('usda:pechuga-cruda'), 150, al('tu:huevo'), 'p');
  assert.equal(h.unidad, 'u');
  casi(h.exacta, 33.75 / 6);
  assert.equal(h.cantidad, 5.5);
});

test('4. por grasa', () => {
  const r = equivalente(al('usda:aceite-oliva'), 10, al('usda:aguacate'), 'g');
  casi(r.exacta, (10 * al('usda:aceite-oliva').g) / al('usda:aguacate').g);
});

test('5. un sustituto sin ese nutriente no se puede usar (no se divide por cero)', () => {
  const r = equivalente(al('usda:arroz-cocido'), 200, al('usda:pechuga-cruda'), 'c');
  assert.match(r.error, /no tiene carbohidratos/);
  const r2 = equivalente(al('usda:pechuga-cruda'), 200, al('usda:arroz-cocido'), 'c');
  assert.match(r2.error, /no tiene carbohidratos/);
});

test('6. cantidades inválidas', () => {
  for (const x of [0, -50, NaN, Infinity, 'abc', '', null, undefined, 1e9]) {
    assert.match(equivalente(al('usda:arroz-cocido'), x, al('usda:avena-cruda')).error, /mayor que cero/, String(x));
  }
  assert.equal(cantidadValida('70,5'), 70.5);
  assert.match(equivalente(null, 100, al('usda:avena-cruda')).error, /Elige/);
});

test('7. crudo y cocido son alimentos distintos (sin factores de cocción inventados)', () => {
  const crudo = al('usda:arroz-crudo'), cocido = al('usda:arroz-cocido');
  assert.ok(crudo.kcal > 2.5 * cocido.kcal);
  // 200 g de arroz cocido equivalen a bastante menos de 200 g de arroz crudo
  const r = equivalente(cocido, 200, crudo, 'kcal');
  assert.ok(r.cantidad < 80 && r.cantidad > 60, String(r.cantidad));
  // El buscador muestra los dos con su estado
  const res = buscar(LISTA, 'arroz blanco');
  assert.ok(res.some((a) => a.estado === 'crudo') && res.some((a) => a.estado === 'cocido'));
});

test('8. redondeo y precisión: se calcula exacto y se muestra redondeado', () => {
  assert.equal(redondear(71.6, 'g'), 72);
  assert.equal(redondear(7.3, 'g'), 7.5);
  assert.equal(redondear(5.62, 'u'), 5.5);
  assert.equal(redondear(0.1, 'u'), 0.5);
  const r = equivalente(al('usda:arroz-cocido'), 210, al('usda:avena-cruda'));
  assert.notEqual(r.exacta, r.cantidad);
  // La tabla usa la cantidad redondeada (la que de verdad vas a servir)
  casi(r.tabla[0].sustituto, 72 * 379 / 100);
  const t = comparar(al('usda:arroz-cocido'), 100, al('usda:arroz-cocido'), 100);
  assert.ok(t.every((x) => x.diferencia === 0 && x.variacion === 0));
});

test('porciones poco prácticas', () => {
  // Igualar la proteína del arroz con lechuga: kilos de lechuga
  const r = equivalente(al('usda:arroz-cocido'), 200, al('usda:lechuga'), 'p');
  assert.equal(r.practica.ok, false);
  assert.equal(practica(al('usda:aceite-oliva'), 3, null, 0).ok, false);
  assert.equal(practica(al('usda:papa-cocida'), 300, al('usda:arroz-cocido'), 50).ok, false); // 6 veces
  assert.equal(practica(al('tu:huevo'), 12, null, 0).ok, false);
});

test('sugerencias: los parecidos en lo demás primero, los poco prácticos al final, y filtro por categoría', () => {
  const lista = sugerir(al('usda:arroz-cocido'), 200, LISTA, { criterio: 'kcal', max: 200 });
  assert.ok(lista.length > 50);
  assert.ok(!lista.some((x) => x.alimento.id === 'usda:arroz-cocido'));
  const primeros = lista.slice(0, 8).map((x) => x.alimento.categoria);
  assert.ok(primeros.every((c) => ['cereales', 'tuberculos', 'legumbres', 'frutas'].includes(c)), primeros.join(','));
  const iPrimerMalo = lista.findIndex((x) => !x.practica.ok);
  assert.ok(iPrimerMalo > 0 && lista.slice(iPrimerMalo).every((x) => !x.practica.ok));
  const tuberculos = sugerir(al('usda:arroz-cocido'), 200, LISTA, { categoria: 'tuberculos' });
  assert.ok(tuberculos.length && tuberculos.every((x) => x.alimento.categoria === 'tuberculos'));
});

test('buscar sin tildes y con palabras sueltas', () => {
  assert.equal(buscar(LISTA, 'platano verde frito')[0].id, 'usda:platano-verde-frito');
  assert.ok(buscar(LISTA, 'NAME').some((a) => a.id === 'usda:name-cocido'));
  assert.ok(buscar(LISTA, 'chicken').some((a) => a.id === 'usda:pechuga-cruda'));
  assert.equal(buscar(LISTA, 'zzz').length, 0);
});

test('9. sustituir en una comida: copia nueva con el cambio, sin tocar la original', () => {
  const comida = { nombre: 'Almuerzo', items: [{ alimento: 'arroz', cant: 250 }, { alimento: 'carne', cant: 180 }] };
  const papa = paraDieta(al('usda:papa-cocida'));
  assert.equal(papa.id, 'usda-papa-cocida');
  assert.equal(papa.grupo, 'carbo');
  assert.match(papa.fuente, /USDA/);
  const nueva = sustituirEnComida(comida, 0, papa.id, 300);
  assert.deepEqual(nueva.items[0], { alimento: 'usda-papa-cocida', cant: 300 });
  assert.equal(comida.items[0].alimento, 'arroz');
  assert.equal(sustituirEnComida(comida, 5, 'x', 1), null);
});

test('10. la foto de la comida (lo que suma al día) cambia con el reemplazo', () => {
  const alimentos = [...ALIMENTOS, paraDieta(al('usda:papa-cocida'))];
  const comida = { nombre: 'Almuerzo', items: [{ alimento: 'arroz', cant: 250 }, { alimento: 'carne', cant: 180 }] };
  const antes = fotoComida(comida, alimentos, 1);
  const despues = fotoComida(sustituirEnComida(comida, 0, 'usda-papa-cocida', 350), alimentos, 1);
  // Tu arroz: 120 kcal/100 g → 300 kcal; la papa cocida: 87 kcal/100 g → 305 kcal; la carne igual
  const carne = ALIMENTOS.find((a) => a.id === 'carne');
  assert.equal(antes.kcal, Math.round(300 + 1.8 * carne.kcal));
  assert.equal(despues.kcal, Math.round(350 * al('usda:papa-cocida').kcal / 100 + 1.8 * carne.kcal));
  // El día suma las fotos de sus comidas: cambia solo lo de esta
  const otra = { ts: 1, nombre: 'Cena', kcal: 500, p: 40, c: 50, g: 10 };
  const dia = (fotos) => fotos.reduce((s, x) => s + x.kcal, 0);
  assert.equal(dia([despues, otra]) - dia([antes, otra]), despues.kcal - antes.kcal);
});

test('solo hoy: el día usa la comida cambiada y el plan queda igual', async () => {
  const { conCambiosDelDia } = await import('../src/dieta.js');
  const plan = { nombre: 'X', comidas: [{ nombre: 'Desayuno', items: [{ alimento: 'huevo', cant: 6 }] }, { nombre: 'Almuerzo', items: [{ alimento: 'arroz', cant: 250 }] }] };
  assert.equal(conCambiosDelDia(plan, 'inferior', null), plan);
  assert.equal(conCambiosDelDia(plan, 'inferior', { 'descanso:1': [{ alimento: 'papa', cant: 1 }] }), plan, 'un cambio de otro plan no aplica');
  const dia = conCambiosDelDia(plan, 'inferior', { 'inferior:1': [{ alimento: 'usda-papa-cocida', cant: 350 }] });
  assert.deepEqual(dia.comidas[1].items, [{ alimento: 'usda-papa-cocida', cant: 350 }]);
  assert.equal(dia.comidas[1].cambiada, true);
  assert.equal(dia.comidas[0], plan.comidas[0]);
  assert.equal(plan.comidas[1].items[0].alimento, 'arroz');
  assert.equal(dia.comidas.length, plan.comidas.length);
});

test('un alimento de USDA que ya pasó a tus alimentos sale una sola vez (el tuyo)', () => {
  const papa = paraDieta(todos(ALIMENTOS_USDA, []).find((a) => a.id === 'usda:papa-cocida'));
  const l = todos(ALIMENTOS_USDA, [...ALIMENTOS, papa]);
  assert.ok(l.some((a) => a.id === 'tu:usda-papa-cocida'));
  assert.ok(!l.some((a) => a.id === 'usda:papa-cocida'));
  assert.equal(l.length, todos(ALIMENTOS_USDA, ALIMENTOS).length);
});

test('alimentos de etiqueta: la arepa El Carbón sale con sus valores del empaque y se encuentra por nombre o marca', async () => {
  const { ALIMENTOS_ETIQUETA } = await import('../src/datos_etiquetas.js');
  const cats = new Set(CATEGORIAS_EQUIV.map(([k]) => k));
  for (const a of ALIMENTOS_ETIQUETA) {
    for (const k of ['kcal', 'p', 'c', 'g']) assert.equal(typeof a[k], 'number', a.id + ' sin ' + k);
    assert.ok(a.marca && cats.has(a.categoria), a.id);
    assert.ok(!ALIMENTOS_USDA.some((u) => u.id === a.id), a.id + ' repetido con USDA');
  }
  const lista = todos([...ALIMENTOS_USDA, ...ALIMENTOS_ETIQUETA], ALIMENTOS);
  const arepa = lista.find((a) => a.id === 'usda:arepa-el-carbon');
  assert.equal(arepa.kcal, 152);
  assert.ok(arepa.deEtiqueta && /Etiqueta/.test(arepa.fuente));
  // Una unidad (88 g) da lo de la etiqueta por porción: 134 kcal y 35 g de carbos
  casi(valoresDe(arepa, 88).kcal, 134, 0.5);
  casi(valoresDe(arepa, 88).c, 35.2, 0.01);
  assert.ok(buscar(lista, 'carbon').some((a) => a.id === arepa.id));
  assert.ok(buscar(lista, 'abundancia').some((a) => a.id === arepa.id));
  // Al pasarla a 🥚 Alimentos guarda de dónde salió
  assert.match(paraDieta(arepa).fuente, /Etiqueta/);
});
