// Recorrido de 🏋️ Gym → un día de entreno, con clics y teclado reales: el ejercicio en el que vas (abierto y con el
// cursor listo), anotar una serie con Enter, reps en reserva, peso, unidad, reps escritas a mano, plegar y abrir,
// mover un ejercicio, historial, notas, core, cardio, copiar el resumen y el análisis, separar en biserie y anotar
// una ronda, y ver la semana pasada.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/gymdia.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { sembrar } from './gym.mjs';
import { iso } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Gym día'), { paso, falla, tocarTexto, escribirCampo } = a;
  const abrirGym = async (dia) => { await p.ir('gym'); await a.esperar('#vista h1'); await a.dormir(400); if (dia) { await tocarTexto(dia); await a.dormir(700); } };
  const sem = await sembrar(p, a, abrirGym);
  const reg = async (clave, s = sem) => ((await p.estado()).semanas[s] || {})[clave] || {};
  const rutina = async () => (await p.estado()).rutina;
  // El n-ésimo campo visible con ese selector
  const marcarN = (sel, n = 0) => p.ev(`(()=>{document.querySelectorAll('[data-e2e-n]').forEach(x=>x.removeAttribute('data-e2e-n'));const c=[...document.querySelectorAll(${JSON.stringify(sel)})].filter(x=>x.checkVisibility({visibilityProperty:true}))[${n}];if(!c)return false;c.setAttribute('data-e2e-n','1');return true})()`);
  const escribirN = async (sel, n, valor) => { falla(await marcarN(sel, n), 'no encontré ' + sel + ' (' + n + ')'); await a.escribir('[data-e2e-n]', valor); await a.salir(); };

  // ---------- Empuje + Bíceps: el primer ejercicio queda abierto y con el cursor en la serie ----------
  await abrirGym('Lun · Empuje + Bíceps');
  falla((await a.texto()).includes('Press plano (barra/máquina)'), 'no abrió el día');
  falla(await p.ev(`document.activeElement && document.activeElement.getAttribute('aria-label')==='Repeticiones de esta serie'`), 'el cursor no quedó en la serie del ejercicio en el que vas');
  await paso('día');
  // Serie con el teclado: escribir y Enter
  await p.cdp('Input.insertText', { text: '7' });
  await a.tecla('Enter', 13);
  await a.dormir(300);
  falla((await reg('d3-1-1')).reps === '7', 'Enter no anotó la serie: ' + JSON.stringify(await reg('d3-1-1')));
  await paso('serie con enter');
  // El contador del entreno arrancó solo con la primera serie
  const hoy = iso();
  const entreno = async () => (((await p.estado()).dias || {})[hoy] || {}).entreno;
  falla((await entreno())?.inicio > 0, 'el contador del entreno no arrancó con la primera serie');
  falla(await p.cuantos('[data-t=entreno] [role=timer]') === 1, 'no se ve el contador del entreno');
  // Reps en reserva y peso
  await tocarTexto('2', '[role=group][aria-label^="¿Cuántas reps"] button, [role=group][aria-label^="¿Cuántas reps"] [role=button]');
  falla((await reg('d3-1-1')).rir === 2, 'no guardó las reps en reserva');
  await escribirN('[aria-label=Peso]', 0, '62,5');
  falla((await reg('d3-1-1')).peso === '62,5', 'no guardó el peso: ' + JSON.stringify(await reg('d3-1-1')));
  await p.poner('[aria-label=Unidad]', 'discos');
  falla((await reg('d3-1-1')).unidad === 'discos', 'no guardó la unidad');
  await p.poner('[aria-label=Unidad]', 'kg');
  // Las reps del back-off escritas a mano
  await escribirN('[aria-label^="Repeticiones de cada serie"]', 1, '12');
  falla((await reg('d3-1-2')).reps === '12', 'no guardó las reps escritas a mano: ' + JSON.stringify(await reg('d3-1-2')));
  await paso('peso y reps');
  // Una serie con el botón, en la fila que sigue
  falla(await marcarN('[aria-label="Repeticiones de esta serie"]', 0), 'no hay campo de serie');
  await a.escribir('[data-e2e-n]', '10');
  await tocarTexto('＋ Serie 2 y descanso', 'button', false);
  falla((await reg('d3-1-2')).reps === '12 10', 'el botón no anotó la serie: ' + JSON.stringify(await reg('d3-1-2')));
  await paso('ejercicio completo');
  // Historial y notas
  await tocarTexto('📈 Historial', 'summary, button, [role=button]', false);
  await a.dormir(300);
  falla((await a.texto()).includes('1RM estimado de la mejor serie'), 'no abrió el historial');
  await paso('historial');
  await tocarTexto('Notas', '[data-ancla="ej-d3-1"] summary, [data-ancla="ej-d3-1"] button, [data-ancla="ej-d3-1"] [role=button]');
  await escribirN('[data-cambio=nota]', 0, 'Agarre medio');
  falla((await rutina()).find((d) => d.id === 'd3').ejercicios[0].nota === 'Agarre medio', 'no guardó la nota');
  // Plegar el ejercicio y volver a abrirlo
  await tocarTexto('Plegar Press plano (barra/máquina)');
  falla(!(await p.cuantos('[aria-label="Plegar Press plano (barra/máquina)"]')), 'no se plegó');
  await paso('plegado');
  await tocarTexto('Press plano (barra/máquina)', 'button, [role=button]', false);
  falla(await p.cuantos('[aria-label="Plegar Press plano (barra/máquina)"]'), 'no se volvió a abrir');
  // Mover el ejercicio abajo y arriba
  await tocarTexto('Bajar Press plano (barra/máquina)');
  falla((await rutina()).find((d) => d.id === 'd3').ejercicios[1].id === 'd3-1', 'no bajó el ejercicio');
  await tocarTexto('Subir Press plano (barra/máquina)');
  falla((await rutina()).find((d) => d.id === 'd3').ejercicios[0].id === 'd3-1', 'no volvió a subir el ejercicio');
  await paso('movido');
  // Core al final del día
  await tocarTexto('💪 Core', 'summary, button, [role=button]', false);
  await tocarTexto('Crunch', 'button, [role=button]', false);
  // La versión vieja cierra la sección Core al repintar: se vuelve a abrir si hace falta
  if (!(await marcarN('[data-ancla="ej-core-1@d3"] [aria-label^="Repeticiones de cada serie"]'))) await tocarTexto('💪 Core', 'summary, button, [role=button]', false);
  await escribirN('[data-ancla="ej-core-1@d3"] [aria-label^="Repeticiones de cada serie"]', 0, '15 15');
  const core = Object.entries((await p.estado()).semanas[sem]).find(([k]) => k.endsWith('@d3'));
  falla(core && core[1].reps === '15 15', 'no guardó el core: ' + JSON.stringify(core));
  await paso('core');
  // Cardio
  await escribirCampo('Minutos', '30');
  const cardio = Object.entries((await p.estado()).semanas[sem]).find(([k]) => k.startsWith('cardio'));
  falla(cardio && cardio[1].min === 30, 'no guardó el cardio: ' + JSON.stringify(cardio));
  await paso('cardio');
  // Copiar
  await tocarTexto('📋 Copiar resumen del día');
  falla((await a.aviso()).includes('copiado'), 'no copió el resumen');
  await tocarTexto('📋 Copiar análisis completo para Claude');
  falla((await a.aviso()).includes('Análisis copiado'), 'no copió el análisis');
  await paso('copiado');

  // ---------- Torso A: separar en biserie y anotar una ronda ----------
  await tocarTexto('Vie · Torso A');
  await a.dormir(500);
  await tocarTexto('Remo T / hammer abierto', 'button, [role=button]', false);
  await tocarTexto('🔁 Separar en biserie: Remo T + Hammer abierto');
  let t = (await rutina()).find((d) => d.id === 'd1');
  falla(t.ejercicios[1].nombre === 'Remo T' && t.ejercicios[1].biserie && t.ejercicios[2].nombre === 'Hammer abierto', 'no separó la biserie');
  await paso('biserie');
  await tocarTexto('🔁 Remo T + Hammer abierto', 'button, [role=button]', false);
  const otro = t.ejercicios[2];
  await escribirCampo('A1 · Remo T', '8');
  await escribirCampo('A2 · Hammer abierto', '10');
  await tocarTexto('＋ Ronda 1 de', 'button', false);
  falla((await reg('d1-2-1')).reps === '8' && (await reg(otro.filas[0].id)).reps === '10', 'la ronda no anotó los dos: ' + JSON.stringify([await reg('d1-2-1'), await reg(otro.filas[0].id)]));
  await paso('ronda');
  await tocarTexto('Ya no es biserie (separar las tarjetas)');
  falla(!(await rutina()).find((d) => d.id === 'd1').ejercicios[1].biserie, 'no quitó la biserie');
  await paso('sin biserie');

  // Varias series de una vez en el cuadro de la serie: «10 9»
  await abrirGym('Lun · Empuje + Bíceps');
  falla(await marcarN('[aria-label="Repeticiones de esta serie"]', 0), 'no hay campo de serie');
  const clave = await p.ev(`document.querySelector('[data-e2e-n]').dataset.serie`), antes = (await reg(clave)).reps || '';
  await a.escribir('[data-e2e-n]', '10 9');
  await p.ev(`document.querySelectorAll('[data-e2e]').forEach(x=>x.removeAttribute('data-e2e'))`);
  await p.ev(`document.querySelector('[data-e2e-n]').parentNode.querySelector('[data-accion=serie]').setAttribute('data-e2e','1')`);
  await p.tocar('[data-e2e]');
  falla((await reg(clave)).reps === (antes + ' 10 9').trim(), 'no anotó las dos series: ' + JSON.stringify([clave, antes, await reg(clave), await a.aviso(), await p.ev('document.activeElement && document.activeElement.outerHTML.slice(0,200)')]));
  await paso('dos series de una vez');
  // Terminar el entreno y seguir
  await tocarTexto('⏹ Terminar');
  falla((await entreno()).fin > 0 && (await a.texto()).includes('Entreno de hoy'), 'no terminó el entreno');
  await tocarTexto('↺ Seguir');
  falla(!(await entreno()).fin && await p.cuantos('[data-t=entreno] [role=timer]') === 1, 'no siguió el entreno');

  // ---------- La semana pasada ----------
  await tocarTexto('Lun · Empuje + Bíceps');
  await p.poner('[aria-label=Semana]', String(sem - 1));
  await a.dormir(500);
  falla((await a.texto()).includes('semana pasada'), 'no cambió a la semana pasada');
  await paso('semana pasada');
  await p.poner('[aria-label=Semana]', String(sem));
  await a.dormir(500);

  await p.foto('gymdia-pc');
  await p.celular();
  await abrirGym('Lun · Empuje + Bíceps');
  falla(await p.sinDesborde(), 'el día se desborda en el celular');
  await p.foto('gymdia-cel');
  await p.computador();
  console.log('✓ Gym día');
};
