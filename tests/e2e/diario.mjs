// Diario del Seminario Fénix en el día: el propósito y la meta al despertar (Primera hora), las 3 prioridades que se
// marcan una por una (y se vuelven a editar), la mejora del 1 % en el Cierre de la noche y su lista en 🌱 Mi vida → curva
// del 1 %. Con clics reales, en computador y celular.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/diario.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Diario'), { paso, falla, tocarTexto } = a;
  const hoyIso = await p.ev(`(()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)})()`);
  const dia = async () => ((await p.estado()) || { dias: {} }).dias[hoyIso] || {};
  const abrir = (titulo) => p.ev(`(()=>{const t=[...document.querySelectorAll('#vista [data-t=tarjeta]')].find(x=>x.dataset.plegable&&x.dataset.plegable.includes(${JSON.stringify(titulo)}));const b=t&&t.querySelector('[data-t=plegar][aria-expanded=false]');if(b)b.click();return !!t})()`);

  // Datos: prioridades escritas "anoche", propósito y dos metas en Fénix (la de fecha más cercana es la que sale)
  await p.ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1'));const s=JSON.parse(localStorage[k]);
    const d=(s.dias[${JSON.stringify(hoyIso)}] ??= {habitos:{},metas:{agua:0,pasos:0,calorias:0,lectura:0},crono:{}});
    d.prioridades='1. Llamar a Ana\\n2. Enviar la propuesta\\n3. Gym de pierna';
    s.libros ??= {}; s.libros.fenix={leidos:{},practica:{},notas:{},perfil:{proposito:'Vivir con energía y darle a mi familia libertad'},fichas:{metas:[
      {id:'a',fecha:'2030-01-01',meta:'Meta lejana'},{id:'b',fecha:'2029-06-30',meta:'Ganar 5 millones al mes'}]},evaluaciones:{},vuelta:1};
    localStorage[k]=JSON.stringify(s);})()`);
  await p.recargar();

  // ☀️ Primera hora
  await p.computador();
  await p.ir('manana');
  await a.esperar('#vista h1');
  let t = await a.texto();
  falla(t.includes('Vivir con energía') && t.includes('Ganar 5 millones al mes') && !t.includes('Meta lejana'), 'no muestra el propósito y la meta cercana: ' + t.slice(0, 400));
  falla(t.includes('0/3') && t.includes('Llamar a Ana'), 'no muestra las prioridades para marcar');
  await p.foto('diario-proposito-pc');
  await tocarTexto('Lo leí y me vi lográndolo (1 min)');
  falla(typeof (await dia()).vision === 'number', 'no guardó que leyó el propósito');
  falla((await a.texto()).includes('Leí mi propósito y mi meta'), 'no quedó en una fila');
  await tocarTexto('2Enviar la propuesta', 'button, [role=button]', false);
  let d = await dia();
  falla(d.prioridadesHechas && d.prioridadesHechas['Enviar la propuesta'] && Object.keys(d.prioridadesHechas).length === 1, 'no marcó la prioridad: ' + JSON.stringify(d.prioridadesHechas));
  falla((await a.texto()).includes('1/3'), 'no dice 1/3');
  await paso('primera hora');
  falla(await p.sinDesborde(), 'Primera hora se desborda en el computador');
  await p.foto('diario-manana-pc');

  // ✏️ Cambiar las prioridades: vuelve el texto y la marca se queda en la que no cambió
  await p.tocar('#vista [aria-label="Cambiar las prioridades"]');
  await a.escribirCampo('🎯 Mis 3 prioridades de hoy', '1. Llamar a Ana\n2. Enviar la propuesta\n3. Leer 10 min');
  await tocarTexto('✓ Listo');
  t = await a.texto();
  falla(t.includes('Leer 10 min') && t.includes('1/3') && !t.includes('Gym de pierna'), 'no cambió las prioridades: ' + t.slice(0, 400));

  await p.celular();
  await p.ir('manana');
  falla(await p.sinDesborde(), 'Primera hora se desborda en el celular');
  await p.foto('diario-manana-cel');

  // 🌙 Cierre de la noche (sale desde las 7 p. m.: se adelanta el reloj del navegador)
  await p.ev('window.__horas=Date.prototype.getHours;Date.prototype.getHours=function(){return 21}');
  await p.computador();
  await p.ir('hoy');
  await a.esperar('#vista h1');
  await abrir('Cierre');
  await a.dormir(300);
  t = await a.texto();
  falla(t.includes('Prioridades de hoy cumplidas') && t.includes('1/3'), 'el cierre no dice las prioridades cumplidas');
  await a.escribirCampo('📈 Mi mejora del 1 % de hoy', 'Una llamada más a clientes');
  falla((await dia()).mejoraUno === 'Una llamada más a clientes', 'no guardó la mejora del 1 %');
  falla(await p.sinDesborde(), 'Hoy se desborda en el computador');
  await p.ev(`[...document.querySelectorAll('#vista label')].find(l=>l.textContent.includes('Mi mejora del 1'))?.scrollIntoView({block:'center'})`);
  await p.foto('diario-cierre-pc');
  await p.celular();
  await p.ir('hoy');
  await abrir('Cierre');
  await a.dormir(300);
  falla(await p.sinDesborde(), 'Hoy se desborda en el celular');
  await p.ev(`[...document.querySelectorAll('#vista label')].find(l=>l.textContent.includes('Mi mejora del 1'))?.scrollIntoView({block:'center'})`);
  await p.foto('diario-cierre-cel');

  // 🌱 Mi vida → curva del 1 %
  await p.computador();
  await p.ir('vida');
  await a.esperar('#vista h1');
  await abrir('La curva del 1 %');
  await a.dormir(300);
  t = await a.texto();
  falla(t.includes('Tus mejoras del 1 %') && t.includes('Una llamada más a clientes') && t.includes('1 de 30 días'), 'Mi vida no muestra la mejora: ' + t.slice(0, 300));
  await p.ev(`[...document.querySelectorAll('#vista b')].find(b=>b.textContent.includes('Tus mejoras del 1'))?.scrollIntoView({block:'center'})`);
  await p.foto('diario-vida-pc');
  await p.celular();
  await p.ir('vida');
  await abrir('La curva del 1 %');
  await a.dormir(300);
  falla(await p.sinDesborde(), 'Mi vida se desborda en el celular');
  await p.ev(`[...document.querySelectorAll('#vista b')].find(b=>b.textContent.includes('Tus mejoras del 1'))?.scrollIntoView({block:'center'})`);
  await p.foto('diario-vida-cel');
  await p.computador();
  await p.ev('Date.prototype.getHours=window.__horas');
  console.log('✓ Diario');
};
