// Recorrido de 💊 Suplementos con clics y teclado reales: agregar de un toque y escribiendo uno, editarlo (dosis, días,
// solo días de entreno, tomas que quedan, hora del aviso), marcarlo hoy y ayer, mandarlo a Compras cuando se acaba, el
// calendario de avisos, pausarlo y quitarlo.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/suplementos.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso, sumarDias } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Suplementos'), { paso, falla, tocarTexto, escribirCampo } = a;
  const lista = async () => (((await p.estado()) || {}).suplementos || {}).lista || [];
  const mag = async () => (await lista()).find((s) => s.nombre === 'Magnesio');
  const tomado = async (f, id) => !!(((((await p.estado()) || {}).dias || {})[f] || {}).suplementos || {})[id];

  await p.computador();
  await p.ir('suplementos');
  await a.esperar('#vista h1');
  await paso('inicio');

  // De un toque y escribiendo uno
  await p.tocar('#vista [data-accion=sup-plantilla][data-i="0"]');
  falla((await lista()).length === 1, 'no agregó la plantilla');
  await paso('plantilla');
  await a.escribir('#sup-nuevo', 'Magnesio');
  await tocarTexto('Agregar');
  falla(await mag(), 'no agregó el Magnesio');
  await paso('editando');

  // Editar
  await escribirCampo('Dosis', '400 mg');
  const id = (await mag()).id;
  await p.tocar('#vista [data-accion=sup-dia][data-id="' + id + '"][data-n="1"]');
  falla(JSON.stringify((await mag()).dias) === '[1]', 'no marcó el lunes: ' + JSON.stringify((await mag()).dias));
  await p.tocar('#vista [data-accion=sup-dia][data-id="' + id + '"][data-n="1"]');
  falla(!(await mag()).dias.length, 'no desmarcó el lunes');
  await p.tocar(await a.campo('Solo los días de gym'));
  falla((await mag()).soloEntreno === true, 'no marcó solo días de entreno');
  await p.tocar(await a.campo('Solo los días de gym'));
  falla((await mag()).soloEntreno === false, 'no desmarcó solo días de entreno');
  await escribirCampo('Tomas que quedan', '0');
  falla((await mag()).quedan === 0, 'no guardó las tomas que quedan');
  await p.poner('#vista [data-cambio=sup-campo][data-k=hora]', '08:00');
  falla((await mag()).hora === '08:00', 'no guardó la hora');
  falla((await mag()).dosis === '400 mg', 'no guardó la dosis');
  await paso('editado');
  await p.tocar('#vista [data-accion=sup-editar][data-id=""]');
  await paso('listo');

  // Marcar hoy, a Compras, y ayer
  await p.tocar('#vista [data-accion=sup-marcar][data-id="' + id + '"]');
  falla(await tomado(iso(), id), 'no marcó el Magnesio hoy');
  await paso('marcado');
  await p.tocar('#vista [data-accion=sup-marcar][data-id="' + id + '"]');
  falla(!(await tomado(iso(), id)), 'no desmarcó');
  await tocarTexto('🛒 A Compras', 'button', false);
  falla((await p.estado()).compras.lista.some((c) => c.nombre === 'Magnesio'), 'no llegó a Compras');
  await p.tocar('#vista [data-accion=sup-cual][data-k=ayer]');
  await paso('ayer');
  await p.tocar('#vista [data-accion=sup-marcar][data-id="' + id + '"]');
  falla(await tomado(sumarDias(iso(), -1), id), 'no marcó ayer');
  await p.tocar('#vista [data-accion=sup-cual][data-k=hoy]');

  // Calendario de avisos
  await tocarTexto('📅 Agregar al calendario');
  falla((await a.aviso()).includes('Agregar todo'), 'no ofreció el calendario');
  await paso('avisos');

  // Pausar y quitar
  await p.tocar('#vista [data-accion=sup-editar][data-id="' + id + '"]');
  await p.tocar(await a.campo('Lo estoy tomando'));
  falla((await mag()).activo === false, 'no lo pausó');
  await paso('pausado');
  await tocarTexto('🗑 Quitar');
  falla(!(await mag()), 'no lo quitó');
  await paso('quitado');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('suplementos-pc');
  await p.celular();
  await p.ir('suplementos');
  await a.esperar('#vista h1');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.foto('suplementos-cel');
  await p.computador();
  console.log('✓ Suplementos');
};
