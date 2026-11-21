// Recorrido de 🌱 Mi vida y de sus tarjetas de Hoy: ánimo y energía, trabajo e ingresos (con clics reales), la sección en el
// menú, la rueda de la vida y su experimento, una decisión nueva y su revisión, la fecha de nacimiento, tu año con el
// ánimo, y la revisión con IA (sin clave: no llama a internet; con una clave mala avisa). En computador y celular.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/mivida.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Mi vida'), { paso, falla, tocarTexto } = a;
  const hoyIso = await p.ev(`(()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)})()`);
  const dia = async () => ((await p.estado()) || { dias: {} }).dias[hoyIso] || {};
  // Abre una tarjeta plegada por su título
  const abrir = (titulo) => p.ev(`(()=>{const t=[...document.querySelectorAll('#vista [data-t=tarjeta]')].find(x=>x.dataset.plegable&&x.dataset.plegable.includes(${JSON.stringify(titulo)}));const b=t&&t.querySelector('[data-t=plegar][aria-expanded=false]');if(b)b.click();return !!t})()`);

  await p.computador();
  await p.ir('hoy');
  await a.esperar('#vista h1');
  await abrir('Ánimo y energía'); await abrir('Trabajo e ingresos');
  await a.dormir(300);

  // 😊 Ánimo 4, energía 3 y una nota
  await tocarTexto('🙂 4', 'button, [role=button], .MuiChip-root');
  await p.tocar('[aria-label="Energía de hoy"] [data-v="3"]');
  await a.escribirCampo('¿Qué marcó el día? (opcional)', 'Buen partido');
  let d = await dia();
  falla(d.animo && d.animo.animo === 4 && d.animo.energia === 3 && d.animo.nota === 'Buen partido', 'no guardó el ánimo: ' + JSON.stringify(d.animo));

  // 💼 Trabajo: la ficha de 90 min y dos postulaciones
  await tocarTexto('90 min', 'button, [role=button], .MuiChip-root');
  await tocarTexto('Sumar una: Postulación');
  await tocarTexto('Sumar una: Postulación');
  d = await dia();
  falla(d.trabajo && d.trabajo.minutos === 90 && d.trabajo.acciones.postulacion === 2, 'no guardó el trabajo: ' + JSON.stringify(d.trabajo));
  await tocarTexto('Quitar una: Postulación');
  falla((await dia()).trabajo.acciones.postulacion === 1, 'no quitó una postulación');
  falla(await p.sinDesborde(), 'Hoy se desborda en el computador');
  await paso('hoy con ánimo y trabajo');
  await p.foto('mivida-hoy-pc');

  // La sección en el menú (dentro de 🌱 Mente y crecimiento, que arranca cerrado)
  await p.ev(`(()=>{const b=document.querySelector('#lateral [data-accion=barra-grupo][data-g=mente]');if(b&&b.getAttribute('aria-expanded')!=='true')b.click()})()`); await a.dormir(300);
  falla(await a.marcar('🌱 Mi vida', 'a, button', false) || await p.cuantos('#lateral a[href="#vida"]'), 'Mi vida no está en el menú');
  await p.ir('vida');
  await a.esperar('#vista h1');
  let t = await a.texto();
  falla(t.includes('Ánimo 7 días') && t.includes('4/5'), 'el vistazo no muestra el ánimo: ' + t.slice(0, 300));
  falla(t.includes('1,5 h'), 'el vistazo no muestra las horas de trabajo');

  // 🎡 Rueda: las 8 áreas, una baja (Amigos 3) → experimento
  for (const [n, v] of [['Salud y cuerpo', 8], ['Dinero', 5], ['Trabajo y carrera', 6], ['Pareja', 7], ['Amigos', 3], ['Familia', 8], ['Aprender y crecer', 9], ['Diversión y descanso', 6]]) {
    await p.tocar(`[aria-label="Rueda: ${n}"] [data-v="${v}"]`);
  }
  const est = await p.estado();
  falla(est.rueda && est.rueda.length === 1 && est.rueda[0].notas.amigos === 3, 'no guardó la rueda: ' + JSON.stringify(est.rueda));
  t = await a.texto();
  falla(t.includes('Tu área más baja: 🫂 Amigos (3/10)'), 'no dice el área más baja');
  const conExperimento = !!(await p.estado()).experimentos?.find((x) => !x.decision);
  if (!conExperimento) {
    await tocarTexto('🧪 Empezar este experimento');
    falla((await p.estado()).experimentos.some((x) => !x.decision && x.cambio.includes('amigo')), 'no empezó el experimento de la rueda');
  }

  // ⚖️ Una decisión nueva, revisarla y la nota
  await a.escribirCampo('¿Qué decidí?', 'Aceptar el trabajo de medio tiempo');
  await a.escribirCampo('¿Qué espero que pase?', 'Ganar más y tener tiempo para estudiar');
  await tocarTexto('Guardar decisión');
  let dec = (await p.estado()).decisiones;
  falla(dec && dec.length === 1 && dec[0].texto === 'Aceptar el trabajo de medio tiempo' && dec[0].confianza === 70, 'no guardó la decisión: ' + JSON.stringify(dec));
  falla((await a.valorCampo('¿Qué decidí?')) === '', 'el formulario no quedó vacío');
  await tocarTexto('Aceptar el trabajo de medio tiempo', 'button, summary, [role=button]', false);
  await tocarTexto('✅ Como esperaba', 'button, [role=button], .MuiChip-root');
  dec = (await p.estado()).decisiones;
  falla(dec[0].salio === 'si', 'no marcó cómo salió');
  falla((await a.texto()).includes('salieron como esperabas el 100 %'), 'no muestra el criterio');

  // ⏳ Fecha de nacimiento
  await a.escribir(await a.campo('Fecha de nacimiento'), '');
  await p.ev(`(()=>{const i=[...document.querySelectorAll('#vista input[type=date]')][0];const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(i,'1996-05-10');i.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  await a.dormir(400);
  falla((await p.estado()).vida?.nacimiento === '1996-05-10', 'no guardó la fecha de nacimiento');
  falla(await p.cuantos('[data-vida-semanas] rect') === 90 * 52, 'no dibuja las 4.680 semanas');

  // 🗓️ Tu año con el ánimo
  await tocarTexto('😊 Ánimo', 'button, [role=button], .MuiChip-root');
  falla((await a.texto()).includes('día anotado en el año · promedio 4/5'), 'el año con ánimo no dice el promedio: ' + (await a.texto()).slice(0, 600));

  // 🤖 IA sin clave: pide conectarla; una clave que no lo parece se rechaza sin llamar a nadie
  t = await a.texto();
  falla(t.includes('Conectar tu clave de Anthropic') && !t.includes('Pedir la revisión de esta semana'), 'sin clave no pide conectarla');
  await a.escribirCampo('Clave de la API', 'hola');
  falla((await a.aviso()).includes('no parece una clave'), 'aceptó una clave rara: ' + await a.aviso());
  falla(!(await p.ev(`localStorage.getItem('rutina_ia_clave')`)), 'guardó una clave rara');
  falla(!JSON.stringify(await p.estado()).includes('sk-ant'), 'la clave quedó en los datos de la app');
  await paso('mi vida lleno');
  falla(await p.sinDesborde(), 'Mi vida se desborda en el computador');
  await p.foto('mivida-pc');

  // Recargar: todo sigue
  await p.recargar();
  await a.esperar('#vista h1');
  t = await a.texto();
  falla(t.includes('Aceptar el trabajo de medio tiempo') && t.includes('Rueda de la vida'), 'tras recargar no está lo guardado');

  // Celular
  await p.celular();
  await p.ir('vida');
  await a.esperar('#vista h1');
  falla(await p.sinDesborde(), 'Mi vida se desborda en el celular');
  await p.foto('mivida-cel');
  await p.ir('hoy');
  await a.esperar('#vista h1');
  await abrir('Ánimo y energía'); await abrir('Trabajo e ingresos');
  falla(await p.sinDesborde(), 'Hoy se desborda en el celular');
  await a.marcar('😊 Ánimo y energía', 'button, h2, [data-t=plegar]', false);
  await p.ev(`document.querySelector('[data-e2e]')?.scrollIntoView({block:'start'})`);
  await p.foto('mivida-hoy-cel');
  await paso('celular');

  // Deja los datos como estaban (sin lo de Mi vida)
  await p.ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1')),s=JSON.parse(localStorage[k]);delete s.rueda;delete s.decisiones;delete s.vida;for(const d of Object.values(s.dias)){delete d.animo;delete d.trabajo}s.experimentos=(s.experimentos||[]).filter(x=>!(x.cambio||'').includes('amigo'));localStorage[k]=JSON.stringify(s)})()`);
  await p.recargar();
  await p.computador();
};
