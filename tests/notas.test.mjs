// 📝 Notas (src/notas.js): HTML limpio, texto para WhatsApp, título, filtros, carpetas, etiquetas, papelera y nube por nota
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { limpiarHtml, textoPlano, textoWhatsApp, tituloDe, resumenDe, vacia, filtrar, crear, editar, aPapelera, recuperar, purgar, diasEnPapelera,
  nuevaCarpeta, renombrarCarpeta, borrarCarpeta, moverCarpeta, carpetasEnOrden, rutaCarpeta, nuevaEtiqueta, borrarEtiqueta, cambiarEtiqueta, DIAS_PAPELERA } from '../src/notas.js';
import { cambiosParaNube, aplicarCambios, combinarEstado } from '../src/combinar.js';

const DIA = 86400000, T0 = Date.UTC(2026, 10, 21, 15);

test('el HTML que se guarda solo tiene las marcas permitidas', () => {
  assert.equal(limpiarHtml('<p>Hola <b>mundo</b> <i>bien</i> <u>sub</u></p>'), '<p>Hola <b>mundo</b> <i>bien</i> <u>sub</u></p>');
  // Lo pegado de una página o de Word: estilos, clases, spans y scripts fuera
  assert.equal(limpiarHtml('<div class="x" style="color:red"><span style="font-weight:700">Negrita</span> y <font face="Arial">normal</font></div><script>alert(1)</script>'),
    '<p><b>Negrita</b> y normal</p>');
  assert.equal(limpiarHtml('<p><strong>a</strong><em>b</em></p><h1>T</h1><h4>t</h4>'), '<p><b>a</b><i>b</i></p><h2>T</h2><h3>t</h3>');
  assert.equal(limpiarHtml('<p><span style="background-color: rgb(255, 245, 157);">ojo</span></p>'), '<p><mark>ojo</mark></p>');
  assert.equal(limpiarHtml('<p onclick="x()"><img src=x onerror=alert(1)>texto</p>'), '<p>texto</p>');
  // Enlaces: solo http, https, mailto y tel
  assert.equal(limpiarHtml('<a href="javascript:alert(1)">mal</a> <a href="https://x.co/a?b=1&amp;c=2" target="_blank" style="x">bien</a>'), 'mal <a href="https://x.co/a?b=1&amp;c=2">bien</a>');
  // Listas y casillas
  assert.equal(limpiarHtml('<ul data-tipo="checks"><li data-hecho="1">listo</li><li style="x">falta</li></ul><ol><li>uno</li></ol>'),
    '<ul data-tipo="checks"><li data-hecho="1">listo</li><li>falta</li></ul><ol><li>uno</li></ol>');
  // Lo escrito con < y & queda como texto
  assert.equal(limpiarHtml('<p>2 &lt; 3 &amp; 4 &gt; 1</p>'), '<p>2 &lt; 3 &amp; 4 &gt; 1</p>');
  assert.equal(limpiarHtml('<p>a</p><p><br></p><br>'), '<p>a</p>');
  assert.equal(limpiarHtml('<!-- comentario --><p>x</p>'), '<p>x</p>');
  // Lo que arma el navegador al poner una lista: queda fuera del párrafo, sin casillas vacías de más
  assert.equal(limpiarHtml('<p>x</p><p><ul data-tipo="checks"><li data-hecho="1">a</li><li></li></ul></p><p>y</p>'), '<p>x</p><ul data-tipo="checks"><li data-hecho="1">a</li></ul><p>y</p>');
  assert.equal(limpiarHtml('<p>hola<ul><li>a</li></ul>chao</p>'), '<p>hola</p><ul><li>a</li></ul><p>chao</p>');
  assert.equal(limpiarHtml('<ul><li><br></li></ul>'), '');
  // Limpiar dos veces da lo mismo
  const sucio = '<div><b>x</b><ul class="checks"><li>a<div>b</div></li></ul></div>';
  assert.equal(limpiarHtml(limpiarHtml(sucio)), limpiarHtml(sucio));
});

test('texto plano y para WhatsApp', () => {
  const html = '<h2>Mercado</h2><p>Comprar <b>huevos</b> y <i>pan</i></p><ul><li>leche</li><li>café</li></ul><ol><li>uno</li><li>dos</li></ol><ul data-tipo="checks"><li data-hecho="1">pagar</li><li>llamar</li></ul><p><a href="https://x.co">la tienda</a></p>';
  assert.equal(textoPlano(html), 'Mercado\nComprar huevos y pan\n• leche\n• café\n1. uno\n2. dos\n☑ pagar\n☐ llamar\nla tienda (https://x.co)');
  assert.equal(textoWhatsApp({ html }), '*Mercado*\nComprar *huevos* y _pan_\n• leche\n• café\n1. uno\n2. dos\n☑ pagar\n☐ llamar\nla tienda (https://x.co)');
  // La marca va pegada a las letras (WhatsApp no la reconoce con espacios adentro)
  assert.equal(textoWhatsApp({ html: '<p>es <b>muy </b>bueno</p>' }), 'es *muy* bueno');
  assert.equal(textoWhatsApp({ titulo: 'Ideas', html: '<p>una</p>' }), '*Ideas*\nuna');
  assert.equal(textoPlano('<p>línea 1<br>línea 2</p>'), 'línea 1\nlínea 2');
});

test('el título es la primera línea si no se le pone uno', () => {
  assert.equal(tituloDe({ titulo: '', html: '<p></p><p>Comprar pan</p><p>y leche</p>' }), 'Comprar pan');
  assert.equal(resumenDe({ titulo: '', html: '<p>Comprar pan</p><p>y leche</p>' }), 'y leche');
  assert.equal(tituloDe({ titulo: 'Mercado', html: '<p>Comprar pan</p>' }), 'Mercado');
  assert.equal(resumenDe({ titulo: 'Mercado', html: '<p>Comprar pan</p>' }), 'Comprar pan');
  assert.equal(tituloDe({ titulo: '', html: '<ul><li>leche</li></ul>' }), 'leche');
  assert.equal(tituloDe({ titulo: '', html: '' }), 'Nota sin título');
  assert.ok(vacia({ titulo: '', html: '<p><br></p>' }));
  assert.ok(!vacia({ titulo: 'x', html: '' }));
});

test('filtrar: fijadas arriba, carpeta (con sus subcarpetas), etiquetas y buscador', () => {
  const est = {};
  const trabajo = nuevaCarpeta(est, 'Trabajo'), clientes = nuevaCarpeta(est, 'Clientes', trabajo.id), casa = nuevaCarpeta(est, 'Casa');
  const urg = nuevaEtiqueta(est, 'urgente'), idea = nuevaEtiqueta(est, '#idea');
  assert.equal(idea.nombre, 'idea');
  assert.equal(nuevaEtiqueta(est, 'Urgente').id, urg.id, 'la misma etiqueta no se repite');
  const a = crear(est, { html: '<p>Llamar a Pedro</p>', carpeta: clientes.id, etiquetas: [urg.id] }, T0);
  const b = crear(est, { html: '<p>Lista de mercado</p>', carpeta: casa.id }, T0 + 1000);
  const c = crear(est, { html: '<p>Proyecto canción</p>', etiquetas: [idea.id, urg.id] }, T0 + 2000);
  editar(est, a.id, { fijada: true }, T0 + 3000);
  assert.deepEqual(filtrar(est).map((n) => n.id), [a.id, c.id, b.id]);
  assert.equal(est.notas[a.id].editada, T0, 'fijar no cuenta como editar');
  assert.deepEqual(filtrar(est, { carpeta: trabajo.id }).map((n) => n.id), [a.id]);
  assert.deepEqual(filtrar(est, { carpeta: 'sin' }).map((n) => n.id), [c.id]);
  assert.deepEqual(filtrar(est, { etiquetas: [urg.id] }).map((n) => n.id), [a.id, c.id]);
  assert.deepEqual(filtrar(est, { etiquetas: [urg.id, idea.id] }).map((n) => n.id), [c.id]);
  assert.deepEqual(filtrar(est, { buscar: 'cancion' }).map((n) => n.id), [c.id], 'sin tildes');
  assert.deepEqual(filtrar(est, { buscar: 'clientes' }).map((n) => n.id), [a.id], 'por carpeta');
  assert.deepEqual(filtrar(est, { buscar: 'idea' }).map((n) => n.id), [c.id], 'por etiqueta');
  assert.deepEqual(filtrar(est, { buscar: 'trabajo pedro' }).map((n) => n.id), [a.id], 'por la carpeta de arriba');
  assert.equal(rutaCarpeta(est, clientes.id), 'Trabajo › Clientes');
  assert.deepEqual(carpetasEnOrden(est).map((x) => x.nombre + x.nivel), ['Casa0', 'Trabajo0', 'Clientes1']);
});

test('carpetas: anidar un nivel, renombrar y borrar (sus notas pasan a Sin carpeta)', () => {
  const est = {};
  const a = nuevaCarpeta(est, 'A'), b = nuevaCarpeta(est, 'B', a.id);
  assert.equal(nuevaCarpeta(est, 'C', b.id).padre, undefined, 'una subcarpeta no tiene otras adentro');
  assert.ok(!moverCarpeta(est, a.id, b.id), 'no se mete una carpeta con subcarpetas');
  assert.ok(renombrarCarpeta(est, a.id, ' Alfa '));
  assert.equal(rutaCarpeta(est, b.id), 'Alfa › B');
  const n = crear(est, { html: '<p>x</p>', carpeta: a.id });
  assert.ok(borrarCarpeta(est, a.id));
  assert.equal(est.notas[n.id].carpeta, undefined);
  assert.equal(est.notasMeta.carpetas.find((c) => c.id === b.id).padre, undefined, 'la subcarpeta queda arriba');
  assert.ok(nuevaCarpeta(est, '   ') === null);
});

test('etiquetas: color, cambiar y borrar (sale de las notas)', () => {
  const est = {};
  const t = nuevaEtiqueta(est, 'gym');
  assert.match(t.color, /^#/);
  cambiarEtiqueta(est, t.id, { color: '#000000', nombre: 'Gimnasio' });
  assert.deepEqual([est.notasMeta.etiquetas[0].nombre, est.notasMeta.etiquetas[0].color], ['Gimnasio', '#000000']);
  const n = crear(est, { etiquetas: [t.id], html: '<p>x</p>' });
  borrarEtiqueta(est, t.id);
  assert.deepEqual(est.notas[n.id].etiquetas, []);
});

test('papelera de 30 días', () => {
  const est = {};
  const n = crear(est, { html: '<p>x</p>', fijada: true }, T0);
  aPapelera(est, n.id, T0);
  assert.equal(filtrar(est).length, 0);
  assert.equal(filtrar(est, {}, true).length, 1);
  assert.equal(est.notas[n.id].fijada, undefined);
  assert.equal(diasEnPapelera(est.notas[n.id], T0 + 10 * DIA), 20);
  assert.equal(purgar(est, T0 + 29 * DIA), 0);
  assert.ok(recuperar(est, n.id));
  assert.equal(filtrar(est).length, 1);
  aPapelera(est, n.id, T0);
  assert.equal(purgar(est, T0 + DIAS_PAPELERA * DIA), 1);
  assert.deepEqual(est.notas, {});
  // Una nota nueva que quedó vacía se va sola (si no está abierta)
  const v = crear(est, {}, T0);
  assert.equal(purgar(est, T0 + 120000, v.id), 0);
  assert.equal(purgar(est, T0 + 120000), 1);
  // Al recuperar, si su carpeta ya no existe, queda sin carpeta
  const c = nuevaCarpeta(est, 'x'), m = crear(est, { html: '<p>y</p>', carpeta: c.id });
  aPapelera(est, m.id); borrarCarpeta(est, c.id); recuperar(est, m.id);
  assert.equal(est.notas[m.id].carpeta, undefined);
});

test('editar limpia el HTML y solo marca cambio si algo cambió', () => {
  const est = {};
  const n = crear(est, {}, T0);
  assert.ok(editar(est, n.id, { html: '<div style="x">hola</div>' }, T0 + 5));
  assert.equal(est.notas[n.id].html, '<p>hola</p>');
  assert.equal(est.notas[n.id].editada, T0 + 5);
  assert.ok(!editar(est, n.id, { html: '<p>hola</p>' }, T0 + 9));
  assert.equal(est.notas[n.id].editada, T0 + 5);
  assert.ok(editar(est, n.id, { titulo: '  Mi   nota ' }));
  assert.equal(est.notas[n.id].titulo, 'Mi nota');
});

test('nube: editar una nota sube solo esa nota, y dos equipos se combinan por nota', () => {
  const base = { version: 1, rutina: [], notas: {} };
  const n1 = crear(base, { html: '<p>uno</p>' }, T0), n2 = crear(base, { html: '<p>dos</p>' }, T0);
  const ahora = JSON.parse(JSON.stringify(base));
  editar(ahora, n1.id, { html: '<p>uno editado</p>' }, T0 + 1);
  const c = cambiosParaNube(base, ahora);
  assert.deepEqual(c.partes.map((p) => p.ruta), [['notas', n1.id]]);
  assert.deepEqual(aplicarCambios(base, c), ahora);
  const sinDos = JSON.parse(JSON.stringify(ahora));
  delete sinDos.notas[n2.id];
  assert.deepEqual(cambiosParaNube(ahora, sinDos).quitar, [['notas', n2.id]]);
  // Equipo A edita la nota 1 y equipo B la 2: quedan las dos
  const a = JSON.parse(JSON.stringify(base)), b = JSON.parse(JSON.stringify(base));
  editar(a, n1.id, { html: '<p>de A</p>' }); editar(b, n2.id, { html: '<p>de B</p>' });
  const r = combinarEstado(base, a, b, true);
  assert.equal(r.notas[n1.id].html, '<p>de A</p>');
  assert.equal(r.notas[n2.id].html, '<p>de B</p>');
});
