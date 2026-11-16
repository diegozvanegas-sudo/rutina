// Recorrido del menú lateral con clics reales: secciones y la actual, ir a una, solo íconos, resumen plegado, sus
// atajos, organizar (esconder, arrastrar, cambiar de lado, como venía), el ancho arrastrando el borde y, en el
// celular, abrir con ☰ y cerrar tocando una sección, el velo o Escape.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/menu.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Menú'), { falla, tocarTexto } = a;
  const barra = async () => (((await p.estado()) || {}).config || {}).barra || {};
  const cfg = async () => ((await p.estado()) || {}).config || {};
  // Lo que se ve en el menú (sin flechas ni espacios de más)
  const paso = async (nombre) => console.log('§ ' + nombre + ' :: ' + await p.ev(`document.getElementById('lateral').innerText.replace(/[▾▸▼▶\\u200b]/g,'').replace(/\\s+/g,' ').trim()`));
  const enMenu = (sel) => '#lateral ' + sel;
  const actualEs = () => p.ev(`[...document.querySelectorAll('#lateral nav a[aria-current=page]')].map(x=>x.getAttribute('href')).join(',')`);
  const cuerpo = (c) => p.ev(`document.body.classList.contains(${JSON.stringify(c)})`);
  const orden = () => p.ev(`[...document.querySelectorAll('#lateral [aria-label^="Arrastrar "]')].map(x=>x.getAttribute('aria-label').slice(10).replace(' (o usa las flechas ↑ ↓)','')).join(',')`);

  await p.computador();
  await p.ir('hoy');
  await a.esperar('#lateral nav a[href="#hoy"]');
  falla((await actualEs()) === '#hoy', 'Hoy no está marcada: ' + await actualEs());
  await paso('inicio');

  // Ir a una sección desde el menú
  await p.tocar(enMenu('nav a[href="#metas"]'));
  falla((await p.ev('location.hash')) === '#metas', 'no fue a Metas');
  falla((await actualEs()) === '#metas', 'Metas no quedó marcada');

  // Solo íconos y de vuelta
  await p.tocar(enMenu('[aria-label="Dejar solo los íconos"]'));
  falla((await barra()).compacta === true && await cuerpo('barra-compacta'), 'no dejó solo los íconos');
  falla(await p.sinDesborde(), 'se sale de la pantalla con solo íconos');
  await p.foto('menu-compacto');
  await paso('compacto');
  await p.tocar(enMenu('[aria-label="Expandir el menú"]'));
  falla(!(await barra()).compacta && !(await cuerpo('barra-compacta')), 'no volvió a expandir');

  // Resumen plegado y sus atajos
  await tocarTexto('Resumen');
  falla((await barra()).resumen === false, 'no plegó el resumen');
  await paso('sin resumen');
  await tocarTexto('Resumen');
  falla((await barra()).resumen === true, 'no abrió el resumen');
  await p.tocar(enMenu('a[href="#manana"][title="Ir a Mañana"]'));
  falla((await p.ev('location.hash')) === '#manana', 'el resumen no llevó a Mañana');

  // Organizar: esconder y volver a mostrar, arrastrar, cambiar de lado y como venía
  await tocarTexto('✋ Organizar menú');
  await a.esperar('#lateral [aria-label^="Arrastrar Metas"]');
  await paso('organizar');
  const antes = await orden();
  await p.tocar(enMenu('[aria-label="Mostrar Metas en el menú"]'));
  falla(((await cfg()).ocultos || {}).menu?.includes('metas'), 'no escondió Metas');
  falla((await p.ev(`document.querySelector('#lateral [aria-label="Mostrar Metas en el menú"]').getAttribute('aria-pressed')`)) === 'false', 'el ojo no quedó apagado');
  await paso('metas escondida');
  await p.tocar(enMenu('[aria-label="Mostrar Metas en el menú"]'));
  falla(!((await cfg()).ocultos || {}).menu?.includes('metas'), 'no volvió a mostrar Metas');
  falla(!(await p.cuantos('#lateral [aria-label="Mostrar Hoy en el menú"]')), 'Hoy no debería poder esconderse');
  await p.arrastrar('#lateral [aria-label^="Arrastrar Metas"]', 0, -110);
  const despues = await orden();
  falla(despues !== antes && despues.indexOf('Metas') < antes.indexOf('Metas'), 'el arrastre no subió Metas: ' + despues);
  const guardado = ((await cfg()).orden || {}).menu || [];
  falla(guardado.indexOf('metas') >= 0 && guardado.indexOf('metas') < despues.split(',').length, 'no guardó el orden: ' + guardado);
  await paso('metas arriba');
  // Con el teclado (solo en la versión de React): ↓ sobre el asa la baja un puesto
  if ((await p.ev(`document.querySelector('#lateral [aria-label^="Arrastrar Metas"]').getAttribute('aria-label')`)).includes('flechas')) {
    await p.ev(`document.querySelector('#lateral [aria-label^="Arrastrar Metas"]').focus()`);
    await a.tecla('ArrowDown', 40);
    const conTecla = (await orden()).split(','), d0 = despues.split(',');
    falla(conTecla.indexOf('Metas') === d0.indexOf('Metas') + 1, 'la flecha ↓ no bajó Metas: ' + conTecla);
    falla((await p.ev(`document.activeElement.getAttribute('aria-label')`) || '').startsWith('Arrastrar Metas'), 'el foco no siguió a Metas');
    await a.tecla('ArrowUp', 38);
    falla((await orden()) === despues, 'la flecha ↑ no la devolvió');
  }
  await tocarTexto('⇄ Cambiar de lado');
  falla((await barra()).lado === 'izquierda' && await cuerpo('barra-izquierda'), 'no cambió de lado');
  await p.foto('menu-izquierda');
  await tocarTexto('⇄ Cambiar de lado');
  falla((await barra()).lado === 'derecha', 'no volvió a la derecha');
  await tocarTexto('↺ Como venía');
  falla((await orden()) === antes && !((await cfg()).orden || {}).menu, 'no volvió al orden de siempre: ' + await orden());
  await tocarTexto('✓ Listo');
  falla(await p.cuantos('#lateral nav a[href="#hoy"]'), 'no volvió al menú');
  await paso('listo');

  // El ancho, arrastrando el borde del menú
  await p.arrastrar('[title="Arrastra para cambiar el ancho"]', -60, 0);
  const ancho = (await barra()).ancho;
  falla(ancho >= 300 && ancho <= 340, 'no cambió el ancho: ' + ancho);
  falla(await p.sinDesborde(), 'se sale de la pantalla con el menú ancho');

  // Celular: ☰ abre, una sección, el velo y Escape cierran
  await p.celular();
  await p.ir('hoy');
  await p.tocar('[aria-label="Abrir menú"]');
  falla(await cuerpo('menu-abierto') && !(await p.ev(`document.getElementById('velo').hidden`)), 'no abrió el menú');
  falla((await p.ev(`document.querySelector('[aria-label="Abrir menú"]').getAttribute('aria-expanded')`)) === 'true', 'el botón no dice que está abierto');
  await p.foto('menu-cel');
  await paso('celular');
  await p.tocar(enMenu('nav a[href="#dieta"]'));
  falla(!(await cuerpo('menu-abierto')) && (await p.ev('location.hash')) === '#dieta', 'tocar Dieta no fue ni cerró el menú');
  await p.tocar('[aria-label="Abrir menú"]');
  await a.tecla('Escape', 27);
  falla(!(await cuerpo('menu-abierto')), 'Escape no cerró el menú');
  await p.tocar('[aria-label="Abrir menú"]');
  await p.ev(`document.getElementById('velo').click()`);
  await a.dormir(300);
  falla(!(await cuerpo('menu-abierto')), 'el velo no cerró el menú');
  await p.computador();
  console.log('✓ Menú');
};
