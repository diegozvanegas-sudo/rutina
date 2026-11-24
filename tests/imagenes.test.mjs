import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nuevaImagen, todas, enOrden, albumes, agregarAlbum, etiquetasEnUso, filtrar, porMes, editar, leerEtiquetas, limpiarNombre, descripcionDrive, leerDescripcion, juntarConDrive, porSubir, porActualizar } from '../src/imagenes.js';

const T = Date.UTC(2026, 10, 24, 15);

test('agregar: nombre limpio, fecha de hoy, sin subir y el álbum queda creado', () => {
  const est = {};
  const x = nuevaImagen(est, { nombre: 'Cuello y rostro.PNG', album: 'Movilidad', etiquetas: ['cuello'] }, T);
  assert.equal(x.nombre, 'Cuello y rostro');
  assert.equal(x.fecha, '2026-11-24');
  assert.equal(x.driveId, null);
  assert.deepEqual(albumes(est), ['Movilidad']);
  assert.equal(porSubir(est).length, 1);
  assert.equal(limpiarNombre('   '), 'Imagen');
});
test('etiquetas: separadas por coma o #, sin repetir, en minúscula', () => {
  assert.deepEqual(leerEtiquetas('Cuello, #rostro ,cuello\nmovilidad'), ['cuello', 'rostro', 'movilidad']);
  assert.deepEqual(leerEtiquetas(''), []);
});
test('álbumes sin repetir (sin importar tildes ni mayúsculas) y vacíos también', () => {
  const est = {};
  agregarAlbum(est, 'Técnica');
  assert.equal(agregarAlbum(est, 'tecnica'), 'Técnica');
  agregarAlbum(est, 'Comidas');
  assert.deepEqual(albumes(est), ['Comidas', 'Técnica']);
});
function ejemplo() {
  const est = {};
  nuevaImagen(est, { nombre: 'Cuello', album: 'Movilidad', etiquetas: ['cuello', 'rostro'], fecha: '2026-11-20' }, T - 3000);
  nuevaImagen(est, { nombre: 'Hombro', album: 'Movilidad', etiquetas: ['hombro'], fecha: '2026-11-24' }, T - 2000);
  nuevaImagen(est, { nombre: 'Almuerzo', album: '', etiquetas: ['comida'], nota: 'pollo con arroz', fecha: '2026-10-05' }, T - 1000);
  return est;
}
test('filtrar por álbum, sin álbum, etiqueta y texto (también en la nota)', () => {
  const est = ejemplo(), l = todas(est);
  assert.equal(filtrar(l, { album: 'Movilidad' }).length, 2);
  assert.deepEqual(filtrar(l, { album: '-' }).map((x) => x.nombre), ['Almuerzo']);
  assert.deepEqual(filtrar(l, { etiqueta: 'rostro' }).map((x) => x.nombre), ['Cuello']);
  assert.deepEqual(filtrar(l, { buscar: 'POLLO' }).map((x) => x.nombre), ['Almuerzo']);
  assert.deepEqual(etiquetasEnUso(l)[0], ['comida', 1]);
});
test('orden y línea de tiempo: lo más nuevo primero, por mes', () => {
  const est = ejemplo();
  assert.deepEqual(enOrden(todas(est)).map((x) => x.nombre), ['Hombro', 'Cuello', 'Almuerzo']);
  assert.deepEqual(porMes(todas(est)).map(([m, xs]) => [m, xs.length]), [['2026-11', 2], ['2026-10', 1]]);
});
test('editar: lo subido queda marcado para contárselo a Drive', () => {
  const est = ejemplo(), x = todas(est)[0];
  editar(est, x.id, { nombre: 'Cuello 2' });
  assert.equal(x.cambio, undefined); // aún no está en Drive
  x.driveId = 'd1';
  editar(est, x.id, { album: 'Rehabilitación', etiquetas: 'cuello, dolor', fecha: 'mal' });
  assert.equal(x.cambio, true);
  assert.equal(x.album, 'Rehabilitación');
  assert.deepEqual(x.etiquetas, ['cuello', 'dolor']);
  assert.equal(x.fecha, '2026-11-20');
  assert.equal(porActualizar(est).length, 1);
});
test('la descripción de Drive guarda etiquetas y nota, y se puede leer de vuelta', () => {
  const d = descripcionDrive({ etiquetas: ['cuello', 'rostro y cara'], nota: 'Hacer 2 veces al día' });
  assert.equal(d, '#cuello #rostro-y-cara\nHacer 2 veces al día');
  assert.deepEqual(leerDescripcion(d), { etiquetas: ['cuello', 'rostro y cara'], nota: 'Hacer 2 veces al día' });
  assert.deepEqual(leerDescripcion('Solo una nota'), { etiquetas: [], nota: 'Solo una nota' });
});
test('juntar con Drive: entra lo que no conoce y toma el álbum de Drive si lo moviste allá', () => {
  const est = ejemplo(), x = todas(est)[0];
  x.driveId = 'd1';
  const n = juntarConDrive(est, [
    { id: 'd1', nombre: 'Cuello.jpg', album: 'Cuello', mime: 'image/jpeg' },
    { id: 'd9', nombre: 'Espalda.png', album: 'Movilidad', mime: 'image/png', creado: T, descripcion: '#espalda\nde la carpeta' },
  ]);
  assert.equal(n, 2);
  assert.equal(x.album, 'Cuello');
  const nueva = todas(est).find((y) => y.driveId === 'd9');
  assert.deepEqual([nueva.nombre, nueva.album, nueva.etiquetas, nueva.nota], ['Espalda', 'Movilidad', ['espalda'], 'de la carpeta']);
  assert.equal(juntarConDrive(est, [{ id: 'd9', nombre: 'Espalda.png', album: 'Movilidad' }]), 0); // sin repetir
});

import { urlDrive, idDeUrl, claveNueva, scriptConClave, problemaDrive, explicarError } from '../src/imagenes.js';
const ID = 'AKfycbycBvfWpgv5mt1Q-YSAKZCmGoCdVhl1vWuOtCQowBMCBlW0N2jrBscaMmIO36VQdXoq1Q';
test('conectar Drive: la dirección queda la /exec aunque peguen el ID o la /dev', () => {
  const ok = 'https://script.google.com/macros/s/' + ID + '/exec';
  assert.equal(urlDrive(ID), ok);
  assert.equal(urlDrive(' ' + ok + ' '), ok);
  assert.equal(urlDrive('https://script.google.com/macros/s/' + ID + '/dev'), ok);
  assert.equal(urlDrive('https://script.google.com/macros/s/' + ID), ok);
  assert.equal(idDeUrl(ok), ID);
  assert.equal(urlDrive('hola'), 'hola');
});
test('conectar Drive: avisa si la clave es el ID, y el script sale con la clave puesta', () => {
  const url = urlDrive(ID);
  assert.match(problemaDrive({ url, clave: ID }), /ID de implementación/);
  assert.match(problemaDrive({ url: 'https://google.com', clave: 'x' }), /termina en \/exec/);
  assert.equal(problemaDrive({ url, clave: 'rutina-abc' }), '');
  const c = claveNueva(() => 0.5);
  assert.match(c, /^rutina-[\w]{24}$/);
  assert.equal(scriptConClave("x\nconst CLAVE = 'CAMBIA-ESTA-CLAVE';\ny", c), "x\nconst CLAVE = '" + c + "';\ny");
  assert.match(explicarError('Clave incorrecta'), /Nueva versión/);
  assert.match(explicarError('Unexpected token < in JSON'), /Cualquier usuario/);
});
