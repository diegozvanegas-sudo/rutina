// Recorrido de 📈 Progreso con clics y teclado reales: los indicadores, el rango de días (7, 30, 90), la revisión y el
// cierre de la semana (qué funcionó, qué frenó, la ley y el foco), los retos (empezar uno de racha, marcar hoy, dejarlo,
// hacer uno de una vez con su nota y deshacerlo) y que los gráficos estén.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/progreso.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Progreso'), { paso, falla, tocarTexto, escribirCampo } = a;
  const est = async () => (await p.estado()) || {};
  // Abre el tema plegado donde está el botón (details en la versión de antes, [data-reto-tema] en la de React)
  const abrirTema = async (sel) => {
    await p.ev(`(()=>{const el=document.querySelector(${JSON.stringify(sel)}); if(!el||el.checkVisibility({visibilityProperty:true})) return; const d=el.closest('details'); if(d){d.open=true;return} const t=el.closest('[data-reto-tema]'); const b=t&&t.querySelector('[aria-expanded=false]'); if(b) b.click()})()`);
    await a.dormir(400);
  };

  await p.computador();
  await p.ir('progreso');
  await a.esperar('#vista h1');
  // Progreso empieza con las tarjetas cerradas (una fila por tema): se abren todas para recorrerlas
  await p.ev(`document.querySelectorAll('#vista [data-plegable][data-estado=cerrada] [data-t=plegar]').forEach((b) => b.click())`);
  await a.dormir(400);
  await paso('inicio');

  for (const n of ['7', '90', '30']) {
    await p.tocar('#vista [aria-label=Rango] [data-n="' + n + '"]');
    await a.dormir(300);
    await paso('rango ' + n);
  }

  // Cierre de la semana
  await escribirCampo('✅ ¿Qué 20 % me dio el 80 % del avance?', 'Entrenar temprano');
  await escribirCampo('🧱 ¿Qué me frenó?', 'Acostarme tarde');
  const ley = await p.ev(`document.querySelector('#vista [data-cambio=cierre][data-k=ley] option:not([value=""])')?.value || ''`);
  if (ley) await p.poner('#vista [data-cambio=cierre][data-k=ley]', ley);
  await escribirCampo('🎯 Mi foco de la semana', 'Dormir antes de las 11');
  const rev = Object.values((await est()).revisiones || {})[0] || {};
  falla(rev.funciono === 'Entrenar temprano' && rev.freno === 'Acostarme tarde' && rev.foco === 'Dormir antes de las 11', 'no guardó el cierre: ' + JSON.stringify(rev));
  falla((await a.aviso()).includes('Foco de la semana'), 'no avisó el foco');
  await paso('cierre');

  // Retos: uno de racha
  const racha = await p.ev(`document.querySelector('#vista [data-accion=reto-empezar]')?.dataset.id`);
  if (racha) {
    await abrirTema('#vista [data-accion=reto-empezar][data-id="' + racha + '"]');
    await p.tocar('#vista [data-accion=reto-empezar][data-id="' + racha + '"]');
    falla(((await est()).retos || {}).activo || JSON.stringify((await est()).retos || {}).includes(racha), 'no empezó el reto');
    await paso('reto empezado');
    await tocarTexto('✓ Hoy lo cumplí');
    await paso('reto hoy');
    await tocarTexto('Dejar este reto');
    await paso('reto dejado');
  }
  // Uno de una vez, con nota, y deshacer
  const una = await p.ev(`document.querySelector('#vista [data-accion=reto-una]')?.dataset.id`);
  if (una) {
    await abrirTema('#vista [data-accion=reto-una][data-id="' + una + '"]');
    await p.tocar('#vista [data-accion=reto-una][data-id="' + una + '"]');
    await a.dormir(300);
    await abrirTema('#vista [data-cambio=reto-nota]');
    await a.escribir('#vista [data-cambio=reto-nota]', 'Me dio miedo pero lo hice');
    await a.salir();
    falla(JSON.stringify((await est()).retos || {}).includes('Me dio miedo pero lo hice'), 'no guardó la nota del reto');
    await paso('reto hecho');
    await abrirTema('#vista [data-accion=reto-quitar]');
    await tocarTexto('↩ No lo hice');
    await paso('reto deshecho');
  }

  falla(await p.cuantos('#vista svg') >= 4, 'faltan gráficos');
  // Los gráficos los dibuja React (ui/Graficos.tsx): sin números inválidos, y cada barra o punto con su zona y su texto de ayuda
  const svgs = await p.ev(`[...document.querySelectorAll('#vista .grafico')].map((x) => x.outerHTML).join('')`);
  falla(!/NaN|undefined|Infinity/.test(svgs), 'un gráfico tiene números inválidos');
  falla(await p.ev(`[...document.querySelectorAll('#vista .grafico:not(.calendario)')].every((g) => g.querySelectorAll('.zona[data-tip]').length > 0)`), 'un gráfico no tiene zonas para tocar');
  await p.tocar('#vista .grafico .zona');
  falla(await p.ev(`(() => { const t = document.getElementById('tip'); return !!t && !t.hidden && t.textContent.trim().length > 0 })()`), 'tocar una barra no muestra su texto');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('progreso-pc');
  await p.celular();
  await p.ir('progreso');
  await a.esperar('#vista h1');
  // Progreso empieza con las tarjetas cerradas (una fila por tema): se abren todas para recorrerlas
  await p.ev(`document.querySelectorAll('#vista [data-plegable][data-estado=cerrada] [data-t=plegar]').forEach((b) => b.click())`);
  await a.dormir(400);
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.foto('progreso-cel');
  await p.ev('window.scrollBy(0, 1400)');
  await p.foto('progreso-cel-2');
  await p.computador();
  console.log('✓ Progreso');
};
