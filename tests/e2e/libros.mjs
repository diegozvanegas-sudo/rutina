// Recorrido de 📚 Libros con clics y teclado reales: la biblioteca, un libro (Fénix): afirmación, práctica, diario,
// terminar la lectura y deshacer, ir a otra lectura y volver a la de hoy, la lista de lecturas, preguntar (buscar y
// una situación), herramientas (diario, fichas: nueva, escribir y borrar; perfil), rutina y conceptos; otro libro
// (Leyes) con su evaluación (marcar, guardar y empezar de nuevo), y el enlace #libros/fenix.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/libros.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Libros'), { paso, falla, tocarTexto } = a;
  const progreso = async (id) => (((await p.estado()) || {}).libros || {})[id] || {};
  const hoyLibro = async (id) => ((((await p.estado()) || {}).dias || {})[iso()] || {}).libros?.[id] || {};
  const pestana = async (k) => { await p.tocar('#vista [data-accion=libro-pestana][data-p=' + k + ']'); await a.dormir(300); };
  const abrir = async (clave) => { await p.tocar('#vista [data-accion=libro-desplegar][data-clave="' + clave + '"]'); await a.dormir(300); };

  await p.computador();
  await p.ir('libros');
  await a.esperar('#vista h1');
  await paso('biblioteca');

  // 🔥 Fénix
  await p.tocar('#vista [data-accion=libro-elegir][data-id=fenix]');
  await a.esperar('#vista [data-accion=libro-pestana]');
  await paso('fenix hoy');
  await tocarTexto('🔁 La dije (+1)');
  falla((await hoyLibro('fenix')).afirmaciones === 1, 'no contó la afirmación');
  await p.tocar('#vista [data-accion=libro-practica][data-i="0"]');
  falla(Object.keys((await progreso('fenix')).practica?.[1] || {}).length === 1, 'no marcó la práctica');
  await a.escribir('#vista [data-cambio=libro-nota]', 'Lo que aprendí hoy');
  await a.salir();
  falla((await progreso('fenix')).notas?.[1] === 'Lo que aprendí hoy', 'no guardó el diario de la lectura');
  await paso('lectura con práctica');
  await tocarTexto('✓ Terminé la lectura de hoy');
  falla((await progreso('fenix')).leidos?.[1] === iso(), 'no marcó la lectura');
  falla((await a.aviso()).includes('Sigue'), 'no avisó la siguiente');
  await paso('lectura terminada');
  await p.tocar('#vista [data-accion=libro-abrir][data-n="1"]');
  await paso('otra lectura');
  await tocarTexto('↩ Marcar como no leída');
  falla(!(await progreso('fenix')).leidos?.[1], 'no desmarcó');
  await p.tocar('#vista [data-accion=libro-abrir][data-n="2"]');
  await tocarTexto('Volver a la de hoy (1)', 'a, button');
  await paso('de vuelta a hoy');

  await pestana('lecturas');
  await paso('lecturas');
  await p.tocar('#vista [data-accion=libro-abrir][data-n="3"]');
  falla((await a.texto()).includes('Estás viendo'), 'no abrió la lectura 3');

  await pestana('preguntar');
  await paso('preguntar');
  await a.escribir('#vista [data-cambio=libro-buscar]', 'miedo');
  await a.salir();
  await paso('búsqueda');
  await tocarTexto('Borrar búsqueda');
  await p.tocar('#vista [data-accion=libro-consejo]');
  await paso('consejo');

  await pestana('herramientas');
  await paso('herramientas');
  await abrir('diario');
  const campoDiario = await p.ev(`document.querySelector('#vista [data-cambio=libro-dia]').dataset.k`);
  await a.escribir('#vista [data-cambio=libro-dia]', 'Hoy di lo mejor');
  await a.salir();
  falla((await hoyLibro('fenix'))[campoDiario] === 'Hoy di lo mejor', 'no guardó el diario');
  const tipo = await p.ev(`document.querySelector('#vista [data-accion=libro-nueva]')?.dataset.t || ''`);
  if (!(await p.ev(`!!document.querySelector('#vista [data-accion=libro-nueva]')?.checkVisibility({visibilityProperty:true})`))) await abrir(tipo);
  await p.tocar('#vista [data-accion=libro-nueva][data-t=' + tipo + ']');
  let f = (await progreso('fenix')).fichas[tipo];
  falla(f.length === 1, 'no creó la ficha');
  await a.escribir('#vista [data-cambio=libro-ficha][data-id="' + f[0].id + '"]:not([type=date])', 'Mi primera ficha');
  await a.salir();
  f = (await progreso('fenix')).fichas[tipo];
  falla(Object.values(f[0]).includes('Mi primera ficha'), 'no guardó la ficha: ' + JSON.stringify(f[0]));
  await paso('ficha escrita');
  await p.tocar('#vista [data-accion=libro-borrar][data-id="' + f[0].id + '"]');
  falla(!(await progreso('fenix')).fichas[tipo].length, 'no borró la ficha');
  await abrir('perfil');
  await a.escribir('#vista [data-cambio=libro-perfil]', 'Ser mi mejor versión');
  await a.salir();
  falla(Object.values((await progreso('fenix')).perfil || {}).includes('Ser mi mejor versión'), 'no guardó el perfil');
  await paso('herramientas usadas');

  await pestana('rutina');
  await paso('rutina');
  await pestana('conceptos');
  await paso('conceptos');

  // ⚖️ Leyes: la evaluación
  await tocarTexto('← Biblioteca');
  await p.tocar('#vista [data-accion=libro-elegir][data-id=leyes]');
  await pestana('herramientas');
  await abrir('rompiendo');
  for (const i of ['0', '1', '2']) await p.tocar('#vista [data-accion=libro-eval][data-i="' + i + '"]');
  falla(Object.keys((await progreso('leyes')).evaluaciones?.rompiendo?.marcados || {}).length === 3, 'no marcó las frases');
  await paso('evaluación marcada');
  await tocarTexto('💾 Guardar resultado de hoy');
  falla(((await progreso('leyes')).evaluaciones.rompiendo.historial || []).length === 1, 'no guardó el resultado');
  await paso('evaluación guardada');
  await tocarTexto('Empezar de nuevo');
  falla(!Object.keys((await progreso('leyes')).evaluaciones.rompiendo.marcados).length, 'no limpió la evaluación');

  // Enlace directo
  await p.ir('hoy');
  await p.ir('libros/fenix');
  await a.esperar('#vista [data-accion=libro-pestana]');
  falla((await a.texto()).includes('Fénix') || (await a.texto()).includes('Fenix'), 'el enlace no abrió Fénix');
  await paso('enlace fenix');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('libros-pc');
  await p.celular();
  for (const k of ['hoy', 'lecturas', 'preguntar', 'herramientas']) { await pestana(k); falla(await p.sinDesborde(), 'se sale en el celular (' + k + ')'); await p.ev('window.scrollTo(0,0)'); await p.foto('libros-cel-' + k); }
  await tocarTexto('← Biblioteca');
  await p.foto('libros-cel-biblioteca');
  await p.computador();
  console.log('✓ Libros');
};
