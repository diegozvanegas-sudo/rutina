// Recorrido de 🥗 Dieta con clics y teclado reales: 🍽 Hoy (marcar una comida, elegir otro plan a mano y volver),
// 📋 Planes (cambiar de plan, nombre de una comida, cantidad, agregar y quitar un alimento, mover, agregar y borrar
// una comida, recalcular y deshacer), ⚖️ Peso (peso de hoy, energía y hambre, medidas, datos de la fórmula) y
// 🥚 Alimentos (nombre, medida, kcal, agregar y borrar), y el enlace #dieta/peso.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/dieta.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Dieta'), { paso, falla, tocarTexto, escribirCampo } = a;
  const hoy = iso(), dia = async () => (((await p.estado()) || {}).dias || {})[hoy] || {}, dieta = async () => (await p.estado()).dieta;
  const pestana = async (k) => { await p.tocar('#vista [data-accion=dieta-pestana][data-p=' + k + ']'); await a.dormir(300); };
  // El n-ésimo visible de un selector, marcado con data-e2e-n
  const marcarN = (sel, n = 0) => p.ev(`(()=>{document.querySelectorAll('[data-e2e-n]').forEach(x=>x.removeAttribute('data-e2e-n'));const l=[...document.querySelectorAll(${JSON.stringify(sel)})].filter(x=>x.checkVisibility({visibilityProperty:true}));const n=${n},c=n<0?l[l.length+n]:l[n];if(!c)return false;c.setAttribute('data-e2e-n','1');return true})()`);
  const tocarN = async (sel, n = 0) => { falla(await marcarN(sel, n), 'no encontré ' + sel + ' (' + n + ')'); await p.tocar('[data-e2e-n]'); };
  const escribirN = async (sel, n, valor) => { falla(await marcarN(sel, n), 'no encontré ' + sel + ' (' + n + ')'); await a.escribir('[data-e2e-n]', valor); await a.salir(); };

  await p.computador();
  await p.ir('dieta');
  await a.esperar('#vista h1');
  await paso('hoy');

  // 🍽 Hoy: marcar y desmarcar la primera comida
  await tocarN('#vista [data-accion=dieta-comer]', 0);
  let d = await dia();
  falla(Object.keys(d.comidas || {}).length === 1, 'no marcó la comida: ' + JSON.stringify(d.comidas));
  await paso('comida marcada');
  // 📲 Para WhatsApp: el texto copiado y la imagen (se guarda junto a las capturas para revisarla)
  await p.ev(`navigator.clipboard.writeText=(t)=>{window.__copiado=t;return Promise.resolve()};
    navigator.canShare=()=>true; navigator.share=(d)=>{window.__compartido=d.files.map(f=>f.name+' '+f.type).join(',');return Promise.resolve()};
    window.__toBlob ??= HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob=function(...x){window.__imagen=this.toDataURL('image/png');window.__alto=this.height;return window.__toBlob.apply(this,x)}`);
  await tocarTexto('📋 Copiar texto');
  const copiado = await p.ev('window.__copiado') || '';
  falla(copiado.startsWith('🍽️ *Mi plan de comida') && copiado.includes('kcal*') && copiado.includes('✅ *') && copiado.includes('⬜ *'), 'no copió el plan: ' + copiado.slice(0, 200));
  falla((await a.aviso()).includes('Plan de comida copiado'), 'no avisó que copió');
  console.log('texto para WhatsApp:\n' + copiado);
  await tocarTexto('🖼️ Imagen');
  await a.dormir(600);
  const imagen = await p.ev('window.__imagen') || '';
  falla(imagen.startsWith('data:image/png') && (await p.ev('window.__alto')) > 600, 'no creó la imagen');
  const compartido = await p.ev('window.__compartido') || '';
  falla(/^plan-de-comida-\d{4}-\d\d-\d\d\.png image\/png$/.test(compartido), 'no compartió la imagen: ' + compartido);
  const { writeFileSync } = await import('node:fs'), { join } = await import('node:path');
  if (process.argv[3]) { writeFileSync(join(process.argv[3], 'dieta-imagen.png'), Buffer.from(imagen.split(',')[1], 'base64')); console.log('📷', join(process.argv[3], 'dieta-imagen.png')); }
  await p.celular();
  falla(await p.sinDesborde(), 'Dieta se sale de la pantalla en el celular');
  await p.ev(`document.querySelector('#vista [data-accion=dieta-imagen]').scrollIntoView({block:'center'})`);
  await a.dormir(2600);
  await p.foto('dieta-whatsapp-cel');
  await p.computador();
  await tocarN('#vista [data-accion=dieta-comer]', 0);
  falla(!Object.keys((await dia()).comidas || {}).length, 'no desmarcó la comida');
  // ✓ Comí como el plan: con una ya marcada, marca solo las que faltan (la primera conserva su hora)
  await tocarN('#vista [data-accion=dieta-comer]', 0);
  const primera = Object.values((await dia()).comidas)[0].ts, nComidas = await p.cuantos('#vista [data-accion=dieta-comer]');
  falla((await a.texto()).includes('Comí como el plan (faltan ' + (nComidas - 1) + ')'), 'el botón no dice cuántas faltan');
  await p.celular();
  await p.ev(`document.querySelector('#vista [data-accion=dieta-comer-todo]').scrollIntoView({block:'center'})`);
  await p.foto('dieta-comi-todo-cel');
  await p.computador();
  await p.tocar('#vista [data-accion=dieta-comer-todo]');
  d = await dia();
  falla(Object.keys(d.comidas).length === nComidas && Object.values(d.comidas)[0].ts === primera, 'no marcó todas como el plan: ' + JSON.stringify(d.comidas));
  falla((await a.aviso()).includes((nComidas - 1) + ' comidas marcadas como el plan'), 'no avisó: ' + await a.aviso());
  falla(!(await p.cuantos('#vista [data-accion=dieta-comer-todo]')), 'el botón sigue con todo marcado');
  await paso('comí como el plan');
  for (let i = 0; i < nComidas; i++) await tocarN('#vista [data-accion=dieta-comer]', i);
  falla(!Object.keys((await dia()).comidas || {}).length, 'no desmarcó las comidas');
  // Otro plan a mano y volver al que toca
  const auto = await p.ev(`[...document.querySelectorAll('#vista [data-accion=dieta-tipo-hoy]')].find(b=>b.textContent.includes('· hoy'))?.dataset.tipo`);
  const otro = ['descanso', 'superior', 'inferior', 'futbol', 'recarga'].find((t) => t !== auto);
  await p.tocar('#vista [data-accion=dieta-tipo-hoy][data-tipo=' + otro + ']');
  falla((await dia()).dieta === otro, 'no eligió el plan a mano');
  await paso('plan a mano');
  await tocarTexto('Volver al que toca hoy', 'a, button');
  falla(!(await dia()).dieta, 'no volvió al plan de hoy');
  await paso('plan de hoy');

  // 📋 Planes
  await pestana('planes');
  await paso('planes');
  await p.tocar('#vista [data-accion=dieta-plan][data-tipo=futbol]');
  await paso('plan fútbol');
  const plan = async () => (await dieta()).planes.futbol;
  const nombre0 = (await plan()).comidas[0].nombre;
  await escribirN('#vista [aria-label="Nombre de la comida"]', 0, nombre0 + ' fuerte');
  falla((await plan()).comidas[0].nombre === nombre0 + ' fuerte', 'no guardó el nombre de la comida');
  const item0 = (await plan()).comidas[0].items[0];
  if (await marcarN('#vista [aria-label=Cantidad]', 0)) {
    await escribirN('#vista [aria-label=Cantidad]', 0, '3');
    const c = (await plan()).comidas.flatMap((x) => x.items).find((x) => x.cant === 3);
    falla(c, 'no guardó la cantidad');
  }
  const items = (await plan()).comidas[0].items.length;
  await tocarN('#vista [data-accion=dieta-item]', 0);
  falla((await plan()).comidas[0].items.length === items + 1, 'no agregó el alimento');
  await paso('alimento agregado');
  // El último alimento de la primera comida (el recién agregado)
  await p.ev(`(()=>{document.querySelectorAll('[data-e2e-n]').forEach(x=>x.removeAttribute('data-e2e-n'));const c=document.querySelector('#vista [data-accion=dieta-item]').closest('section');[...c.querySelectorAll('[aria-label=Quitar]')].pop().setAttribute('data-e2e-n','1')})()`);
  await p.tocar('[data-e2e-n]');
  falla((await plan()).comidas[0].items.length === items, 'no quitó el alimento');
  falla((await plan()).comidas[0].items[0].alimento === item0.alimento, 'quitó otro alimento');
  // Mover la primera comida abajo y volver
  await tocarN('#vista [data-accion=ed-mover][aria-label=Bajar]', 0);
  falla((await plan()).comidas[1].nombre === nombre0 + ' fuerte', 'no bajó la comida');
  await tocarN('#vista [data-accion=ed-mover][aria-label=Subir]', 1);
  falla((await plan()).comidas[0].nombre === nombre0 + ' fuerte', 'no subió la comida');
  // Agregar una comida y borrarla
  const comidas = (await plan()).comidas.length;
  await tocarTexto('＋ Comida');
  falla((await plan()).comidas.length === comidas + 1, 'no agregó la comida');
  await paso('comida agregada');
  await tocarN('#vista [aria-label="Borrar comida"]', -1);
  falla((await plan()).comidas.length === comidas, 'no borró la comida');
  // Recalcular y deshacer
  await tocarTexto('⚖️ Recalcular este plan');
  falla((await a.aviso()).includes('Planes recalculados'), 'no recalculó');
  await paso('recalculado');
  await tocarTexto('↶ Deshacer recálculo');
  falla((await a.aviso()).includes('planes anteriores'), 'no deshizo');
  await paso('deshecho');

  // ⚖️ Peso
  await pestana('peso');
  await paso('peso');
  await escribirCampo('Peso de hoy', '80,5');
  falla((await dia()).peso === 80.5, 'no guardó el peso: ' + (await dia()).peso);
  await p.tocar('#vista [data-accion=dieta-senal][data-k=energia][data-n="4"]');
  await p.tocar('#vista [data-accion=dieta-senal][data-k=hambre][data-n="2"]');
  d = await dia();
  falla(d.energia === 4 && d.hambre === 2, 'no guardó energía y hambre');
  await escribirCampo('Cintura', '85');
  falla(((await dia()).medidas || {}).cintura === 85, 'no guardó la cintura');
  await escribirCampo('Meta (kg)', '75');
  falla((await dieta()).config.meta === 75, 'no guardó la meta');
  await paso('peso completo');

  // 🥚 Alimentos
  await pestana('alimentos');
  await paso('alimentos');
  const al = async () => (await dieta()).alimentos;
  const n0 = (await al())[0].nombre;
  await escribirN('#vista [aria-label=Nombre]', 0, n0 + ' x');
  falla((await al())[0].nombre === n0 + ' x', 'no guardó el nombre del alimento');
  await escribirCampo('kcal', '150');
  falla((await al())[0].kcal === 150, 'no guardó las kcal');
  await p.poner(await a.campo('Medida'), 'u');
  falla((await al())[0].por === 'u', 'no guardó la medida');
  await paso('alimento editado');
  const total = (await al()).length;
  await tocarTexto('＋ Alimento');
  falla((await al()).length === total + 1, 'no agregó el alimento');
  await tocarN('#vista [data-accion=ed-borrar][aria-label=Borrar]', -1);
  falla((await al()).length === total, 'no borró el alimento');
  await paso('alimentos al final');

  // Enlace directo a la pestaña de peso
  await p.ir('hoy');
  await p.ir('dieta/peso');
  await a.esperar('#vista h1');
  falla((await a.texto()).includes('Peso de hoy'), 'el enlace no abrió la pestaña de peso');
  await paso('enlace peso');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('dieta-pc');
  await p.celular();
  for (const k of ['hoy', 'planes', 'peso', 'alimentos']) {
    await pestana(k);
    falla(await p.sinDesborde(), 'se sale de la pantalla en el celular (' + k + ')');
    await p.ev('window.scrollTo(0,0)');
    await p.foto('dieta-cel-' + k);
  }
  await p.computador();
  console.log('✓ Dieta');
};
