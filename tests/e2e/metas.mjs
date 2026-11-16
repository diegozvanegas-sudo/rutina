// Recorrido de 🎯 Metas del día con clics y teclado reales: agua (+250, +500, −), pasos, calorías fuera del plan y
// sumar una comida, minutos de pantalla, lectura (cronómetro y +5 min) y el historial de 7 y 30 días.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/metas.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Metas'), { paso, falla, tocarTexto, escribirCampo } = a;
  const metas = async () => ((((await p.estado()) || {}).dias || {})[iso()] || {}).metas || {};
  const hay = (t) => a.marcar(t, 'label, button', false);

  await p.computador();
  await p.ir('metas');
  await a.esperar('#vista h1');
  await paso('metas');

  await tocarTexto('+250 ml');
  await tocarTexto('+500 ml');
  await tocarTexto('Quitar 250 ml');
  falla((await metas()).agua === 500, 'el agua quedó mal: ' + (await metas()).agua);
  await paso('agua');

  await escribirCampo('Pasos de hoy', '8000');
  falla((await metas()).pasos === 8000, 'no guardó los pasos');
  if (await hay('Fuera del plan')) {
    await escribirCampo('Fuera del plan', '300');
    await escribirCampo('Sumar comida', '200');
    falla((await metas()).calorias === 500, 'las calorías quedaron mal: ' + (await metas()).calorias);
    await paso('calorías');
  }
  if (await hay('Minutos de redes')) {
    await escribirCampo('Minutos de redes', '90');
    falla((await metas()).pantalla === 90, 'no guardó la pantalla');
    await paso('pantalla');
  }
  if (await hay('+5 min')) {
    await tocarTexto('+5 min');
    falla((await metas()).lectura === 5, 'no sumó la lectura');
    await tocarTexto('Leer', 'button', false);
    await a.dormir(1300);
    await tocarTexto('⏸ Pausa', 'button', false);
    const c = ((((await p.estado()).dias || {})[iso()] || {}).crono || {}).lectura;
    falla(c && !c.inicio && c.acumulado >= 1, 'el cronómetro de lectura no contó: ' + JSON.stringify(c));
  }

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('metas-pc');
  await p.celular();
  await p.ir('metas');
  await a.esperar('#vista h1');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.foto('metas-cel');
  await p.ev('window.scrollBy(0, 800)');
  await p.foto('metas-cel-2');
  await p.computador();
  console.log('✓ Metas');
};
