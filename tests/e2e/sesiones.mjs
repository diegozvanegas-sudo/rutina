// Recorrido de 🧘 Sesiones con clics reales: las checklists (marcar un punto y desmarcar todo), cada categoría con sus
// ejercicios, iniciar una sesión guiada (el reproductor) y cerrarla, el banco de ejercicios (zona, abrir uno, agregarlo
// a una sesión) y el enlace #sesiones/banco-rodilla.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/sesiones.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Sesiones'), { paso, falla, tocarTexto } = a;
  const marcas = async () => (((((await p.estado()) || {}).dias || {})[iso()] || {}).checklists) || {};
  const tipos = () => p.ev(`[...document.querySelectorAll('#vista [data-accion=ses-tipo]')].map(b=>b.dataset.t)`);

  await p.computador();
  await p.ir('sesiones');
  await a.esperar('#vista [data-accion=ses-tipo]');
  await paso('inicio');

  // Checklist: marcar un punto y desmarcar todo
  const ses = await p.ev(`document.querySelector('#vista [data-accion=check-paso]').dataset.sesion`);
  await p.tocar('#vista [data-accion=check-paso]');
  falla(Object.keys((await marcas())[ses] || {}).length === 1, 'no marcó el punto');
  await paso('punto marcado');
  await tocarTexto('↺ Desmarcar todo');
  falla(!(await marcas())[ses], 'no desmarcó todo');

  // Cada categoría
  for (const t of (await tipos()).filter((x) => x !== 'banco' && x !== 'checklist')) {
    await p.tocar('#vista [data-accion=ses-tipo][data-t="' + t + '"]');
    await paso('categoría ' + t);
  }
  // Ver ejercicios e iniciar la sesión guiada
  await tocarTexto('Ver ejercicios', 'summary, button, [role=button]');
  await paso('ejercicios');
  await tocarTexto('Iniciar', 'button', false);
  falla(await p.ev(`!document.getElementById('reproductor').hidden && document.getElementById('reproductor').textContent.includes('Prepárate')`), 'no abrió el reproductor');
  await p.tocar('#reproductor [data-accion=rep-cerrar]');
  falla(await p.ev(`document.getElementById('reproductor').hidden`), 'no cerró el reproductor');

  // Banco de ejercicios
  await p.tocar('#vista [data-accion=ses-tipo][data-t=banco]');
  await paso('banco');
  const zona = await p.ev(`[...document.querySelectorAll('#vista [data-accion=banco-zona]')].map(b=>b.dataset.z).find(z=>z!=='todas')`);
  await p.tocar('#vista [data-accion=banco-zona][data-z="' + zona + '"]');
  await paso('zona');
  await p.ev(`document.querySelectorAll('[data-e2e]').forEach(x=>x.removeAttribute('data-e2e'));(document.querySelector('#vista details > summary') || document.querySelector('#vista [data-banco] [aria-expanded]')).setAttribute('data-e2e','1')`);
  await p.tocar('[data-e2e]');
  await paso('ejercicio abierto');
  const destino = await p.ev(`document.querySelector('#vista [data-cambio=banco-agregar] option[value]:not([value=""])').value`);
  const antes = (await p.estado())?.sesiones?.find((s) => s.id === destino)?.pasos.length ?? null;
  await p.poner('#vista [data-cambio=banco-agregar]', destino);
  falla((await a.aviso()).includes('agregado a'), 'no agregó el ejercicio a la sesión');
  if (antes != null) falla((await p.estado()).sesiones.find((s) => s.id === destino).pasos.length === antes + 1, 'la sesión no tiene el ejercicio');

  // Enlace directo al banco en una zona
  await p.ir('hoy');
  await p.ir('sesiones/banco-rodilla');
  await a.esperar('#vista [data-accion=banco-zona]');
  await paso('enlace banco');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('sesiones-pc');
  await p.celular();
  await p.tocar('#vista [data-accion=ses-tipo][data-t=checklist]');
  await p.ev('window.scrollTo(0,0)');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.foto('sesiones-cel');
  await p.tocar('#vista [data-accion=ses-tipo][data-t=banco]');
  await p.foto('sesiones-cel-banco');
  await p.computador();
  console.log('✓ Sesiones');
};
