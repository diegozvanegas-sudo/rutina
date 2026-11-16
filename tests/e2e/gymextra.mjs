// Recorrido de las ayudas del entreno en 🏋️ Gym: días y vistas en filas separadas (con el de hoy marcado), «máquina
// ocupada», aviso de bajón entre series, molestias por ejercicio, el contador que se cierra solo si se olvida Terminar
// y el plan de 12 semanas plegado que dice cuánto falta.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/gymextra.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { sembrar } from './gym.mjs';
import { iso } from '../../src/fechas.js';

const masDias = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

export default async (p) => {
  const a = ayudas(p, 'Gym ayudas'), { paso, falla, tocarTexto } = a;
  const abrirGym = async (dia) => { await p.ir('gym'); await a.esperar('#vista h1'); await a.dormir(400); if (dia) { await tocarTexto(dia); await a.dormir(700); } };
  const sem = await sembrar(p, a, abrirGym);
  const hoy = iso(), dia = async () => (((await p.estado()).dias || {})[hoy] || {});
  const actual = () => p.ev(`document.querySelector('#vista [data-actual] h3')?.textContent`);

  // Días y vistas en filas separadas
  await abrirGym();
  falla(await p.cuantos('#vista [role=group][aria-label=Vista] [data-accion=ir-dia]') === 3, 'las vistas no están en su propia fila');
  falla(!(await p.ev(`document.querySelector('#vista [role=group][aria-label=Día]').textContent.includes('Resumen')`)), 'el Resumen sigue en la fila de los días');
  await paso('cabecera');

  // ⏭ Máquina ocupada: pasa al siguiente sin cambiar el orden
  await abrirGym('Lun · Empuje + Bíceps');
  const primero = await actual(), orden = (await p.estado()).rutina.find((d) => d.id === 'd3').ejercicios.map((x) => x.id).join();
  await tocarTexto('⏭ Máquina ocupada: hago otro primero');
  const segundo = await actual();
  falla(segundo && segundo !== primero, 'no pasó a otro ejercicio: ' + primero + ' → ' + segundo);
  falla((await a.aviso()).includes('Sigue con ' + segundo), 'no avisó con cuál seguir: ' + await a.aviso());
  falla((await p.estado()).rutina.find((d) => d.id === 'd3').ejercicios.map((x) => x.id).join() === orden, 'cambió el orden de la rutina');
  await paso('máquina ocupada');

  // 📉 Bajón: en una fila de 3 o más series, 12 y luego 8
  const fila = (await p.estado()).rutina.find((d) => d.id === 'd3').ejercicios.flatMap((ej) => ej.filas.map((f) => ({ ej, f }))).find(({ ej, f }) => f.series >= 3 && f.unidad !== 's' && ej.nombre === segundo);
  falla(fila, 'el ejercicio ' + segundo + ' no tiene una fila de 3 series');
  await a.escribir('#vista [data-cambio=reps][data-fila="' + fila.f.id + '"]', '12 8');
  await a.salir();
  falla(await p.cuantos('#vista [data-t=bajon]') === 1, 'no avisó del bajón');
  falla((await a.texto()).includes('Bajaste de 12 a 8 reps'), 'el aviso del bajón no dice las reps');
  await paso('bajón');

  // 🤕 Molestia fuerte, y quitarla
  const grupo = '#vista [role=group][aria-label="¿Molestia en ' + segundo + '?"]';
  falla(await p.cuantos(grupo) === 1, 'no salieron los chips de molestia');
  await tocarTexto('Fuerte', grupo + ' [role=button], ' + grupo + ' button');
  falla(((await dia()).molestias || {})[segundo] === 2, 'no guardó la molestia: ' + JSON.stringify(await dia()));
  falla(await p.cuantos('#vista [data-t=molestia-fuerte]') === 1, 'no aconsejó parar');
  await paso('molestia fuerte');
  await p.ev("document.querySelector('#vista [data-t=bajon]').scrollIntoView({block:'start'})");
  await p.foto('gymextra-ayudas');
  await tocarTexto('Fuerte', grupo + ' [role=button], ' + grupo + ' button');
  falla(!((await dia()).molestias || {})[segundo], 'no quitó la molestia');

  // ⏱ Contador olvidado: 2 h sin series → se cierra solo 5 min después de la última
  falla((await dia()).entreno && !(await dia()).entreno.fin, 'el contador no estaba corriendo');
  const hace2h = Date.now() - 2 * 3600000;
  await p.ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1')),s=JSON.parse(localStorage[k]),x=s.dias[${JSON.stringify(hoy)}].entreno;x.inicio=${hace2h}-1800000;x.ultimo=${hace2h};localStorage[k]=JSON.stringify(s)})()`);
  await p.recargar();
  await abrirGym('Lun · Empuje + Bíceps');
  await a.dormir(500);
  const e = (await dia()).entreno;
  falla(e.fin === hace2h + 5 * 60000, 'el contador no se cerró solo: ' + JSON.stringify(e));
  falla((await a.texto()).includes('Entreno de hoy: 35 min'), 'no muestra el entreno cerrado');
  await paso('contador cerrado solo');

  // 📆 Plan que empieza en unos días: plegado, igual dice cuánto falta
  await tocarTexto('📆 12 semanas');
  await a.escribirCampo('Edad', '31');
  await p.poner('[name=inicio]', masDias(3));
  await tocarTexto('Empezar el plan');
  falla((await a.texto()).includes('Empieza en 3 días'), 'no dice cuánto falta');
  await tocarTexto('📆 Plan de 12 semanas', '[data-t=plegar]');
  falla(await p.ev(`document.querySelector('#vista [data-t=tarjeta]').dataset.estado`) === 'cerrada', 'no se plegó');
  falla(await p.ev(`document.querySelector('#vista [data-t=tarjeta]').checkVisibility() && document.querySelector('#vista [data-t=tarjeta]').textContent.includes('Empieza en 3 días')`), 'plegado ya no dice cuánto falta');
  await paso('plan plegado');
  await p.foto('gymextra-pc');
  await tocarTexto('📆 Plan de 12 semanas', '[data-t=plegar]');
  await tocarTexto('Cambiar la fecha', 'button', false);

  await p.celular();
  await abrirGym('Lun · Empuje + Bíceps');
  falla(await p.sinDesborde(), 'se desborda en el celular');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('gymextra-cel');
  await p.computador();
  console.log('✓ Gym ayudas (sem ' + sem + ')');
};
