// Recorrido de 🏠 Hoy con clics y teclado reales: la bienvenida (empezar con el ejemplo), la mañana, las metas, sueño y
// peso, las comidas, suplementos, mis estándares, el experimento de la semana, el gym de hoy, plegar una tarjeta y
// organizar el tablero. No se prueba arrastrar las tarjetas (el arrastre nativo no se puede simular aquí).
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/hoy.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Hoy'), { paso, falla, tocarTexto, escribirCampo } = a;
  const d = async () => ((((await p.estado()) || {}).dias || {})[iso()]) || {};
  const hay = (s) => p.cuantos('#vista ' + s);

  await p.computador();
  await p.ir('hoy');
  await a.esperar('#vista h1');
  await paso('inicio');

  // Bienvenida: empezar con el ejemplo
  if (await a.marcar('📋 Cargar el ejemplo (rutina, hábitos y fútbol)')) {
    await tocarTexto('📋 Cargar el ejemplo (rutina, hábitos y fútbol)');
    await a.dormir(500);
    falla(!(await p.estado()).bienvenida, 'no cerró la bienvenida');
    await paso('con el ejemplo');
  }

  // La mañana: marcar el primer hábito
  if (await hay('[data-accion=marcar]')) {
    const id = await p.ev(`document.querySelector('#vista [data-accion=marcar]').dataset.id`);
    await p.tocar('#vista [data-accion=marcar][data-id="' + id + '"]');
    falla(((await d()).habitos || {})[id], 'no marcó el hábito');
    await paso('hábito');
  }
  // Metas: agua
  if (await hay('[data-accion=agua][data-ml="250"]')) {
    const antes = ((await d()).metas || {}).agua || 0;
    await p.tocar('#vista [data-accion=agua][data-ml="250"]');
    falla(((await d()).metas || {}).agua === antes + 250, 'no sumó el agua');
  }
  // Sueño y peso
  await p.poner('#vista [data-cambio=sueno][data-k=acoste]', '23:00');
  await p.poner('#vista [data-cambio=sueno][data-k=levante]', '07:00');
  await p.tocar('#vista [data-accion=sueno-calidad][data-v="4"]');
  let x = (await d()).sueno || {};
  falla(x.acoste === '23:00' && x.levante === '07:00' && x.calidad === 4, 'no guardó el sueño: ' + JSON.stringify(x));
  await escribirCampo('Peso en ayunas (kg)', '80');
  falla((await d()).peso === 80, 'no guardó el peso');
  await paso('sueño y peso');
  // Comidas
  if (await hay('[data-accion=dieta-comer]')) {
    await p.tocar('#vista [data-accion=dieta-comer]');
    falla(Object.keys((await d()).comidas || {}).length === 1, 'no marcó la comida');
  }
  // Suplementos: de un toque
  if (await hay('[data-accion=sup-plantilla]')) {
    await p.tocar('#vista [data-accion=sup-plantilla]');
    falla(((await p.estado()).suplementos || {}).lista?.length === 1, 'no agregó el suplemento');
  }
  await paso('comidas y suplementos');
  // Mis estándares: una idea y marcarla
  if (await a.marcar('✏️ Editar estándares')) await tocarTexto('✏️ Editar estándares');
  if (await hay('[data-accion=estandar-agregar][data-t]')) {
    await p.tocar('#vista [data-accion=estandar-agregar][data-t]');
    const est = (await p.estado()).estandares || [];
    falla(est.length === 1, 'no agregó el estándar');
    await tocarTexto('✓ Listo', 'button', false).catch(() => {});
    await p.tocar('#vista [data-accion=estandar][data-id="' + est[0].id + '"]');
    falla(((await d()).estandares || {})[est[0].id], 'no marcó el estándar');
    await paso('estándares');
  }
  // Experimento de la semana
  if (await hay('[data-accion=exp-empezar]')) {
    await escribirCampo('¿Qué vas a probar?', 'Acostarme 30 min antes');
    await tocarTexto('Empezar hoy');
    falla((await a.aviso()).includes('7 días'), 'no empezó el experimento');
    await tocarTexto('✓ Hoy lo cumplí');
    await paso('experimento');
  }
  // Plegar una tarjeta plegable: queda guardado cómo la dejó
  if (await hay('[data-plegar]')) {
    const k = await p.ev(`document.querySelector('#vista [data-plegar]').dataset.plegar`);
    const antes = ((await p.estado()).config.hoyAbiertas || {})[k];
    await p.tocar('#vista [data-plegar="' + k + '"] > summary, #vista [data-plegar="' + k + '"] [aria-expanded]');
    await a.dormir(300);
    const ahora = ((await p.estado()).config.hoyAbiertas || {})[k];
    falla(ahora !== undefined && ahora !== antes, 'no guardó la tarjeta plegada: ' + k + ' ' + antes + ' → ' + ahora);
    await paso('plegada');
  }
  // Organizar el tablero
  await p.tocar('#vista [data-accion=hoy-organizar]');
  falla((await a.texto()).includes('Arrastra cada tarjeta'), 'no entró a organizar');
  await paso('organizando');
  await p.tocar('#vista [data-accion=hoy-organizar]');
  falla(!(await a.texto()).includes('Arrastra cada tarjeta'), 'no salió de organizar');

  // El gym de hoy
  if (await a.marcar('Abrir registro →')) {
    await tocarTexto('Abrir registro →');
    await a.esperar('#vista [data-accion=ir-dia]');
    falla((await a.texto()).includes('series'), 'no abrió el registro del gym');
    await p.ir('hoy');
    await a.esperar('#vista h1');
  }

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('hoy-pc');
  await p.celular();
  await p.ir('hoy');
  await a.esperar('#vista h1');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.foto('hoy-cel');
  await p.ev('window.scrollBy(0, 800)');
  await p.foto('hoy-cel-2');
  await p.computador();
  console.log('✓ Hoy');
};
