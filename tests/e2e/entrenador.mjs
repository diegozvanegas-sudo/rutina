// Recorrido de 🧑‍🏫 Mi entrenador (lado del cliente) con clics y teclado reales: sin entrenador (unirse, enlace con
// el código), con un plan nuevo de su entrenador (guardado en este equipo: la nube no se prueba aquí), usarlo,
// check-in (con sus avisos de error), compartir ahora y volver a lo de antes.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/entrenador.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso, sumarDias } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Entrenador'), { paso, falla, tocarTexto, escribirCampo } = a;
  const est = async () => (await p.estado()) || {};

  await p.computador();
  // Sin entrenador: solo la tarjeta para unirse (Unirme apagado sin sesión)
  await p.ir('entrenador');
  await a.esperar('#vista #ent-codigo');
  await paso('sin entrenador');
  falla(await p.ev(`document.querySelector('#vista [data-accion=ent-unirme]').disabled`), 'Unirme debería estar apagado sin sesión');
  // Enlace con el código: queda escrito en el campo
  await p.ir('hoy');
  await p.ir('entrenador/f9110e');
  await a.esperar('#vista #ent-codigo');
  falla((await a.valor('#vista #ent-codigo')) === 'F9110E', 'el enlace no dejó el código: ' + await a.valor('#vista #ent-codigo'));
  await paso('enlace con código');

  // Un entrenador con un plan nuevo (como lo deja cargarMiEntrenador)
  const plan = {
    nombre: 'Prueba', objetivo: 'musculo', nota: 'Sube el peso cuando hagas todas las reps', publicado: iso(),
    rutina: [], // dos días de la rutina de este equipo, con otro id (el formato de verdad)
    dieta: { planes: { normal: { comidas: [] } } }, alimentos: [],
    ciclo: { inicio: sumarDias(iso(), -8), fases: [{ id: 'f1', nombre: 'Base', semanas: 4, rir: '2-3', objetivo: 'Técnica y volumen' }] },
  };
  const lista = [{ id: 'r1', entrenador: 'coach@prueba.com', aceptado: '2026-10-01T10:00:00Z', plan, plan_version: String(Date.parse('2026-11-10T12:00:00Z')) }];
  // En un equipo nuevo aún no hay nada guardado: se guarda algo antes (el sonido de Ajustes, dos veces)
  await p.ir('ajustes');
  await a.esperar('#vista [data-cambio=conf-sonido]');
  await p.tocar('#vista [data-cambio=conf-sonido]');
  await p.tocar('#vista [data-cambio=conf-sonido]');
  await p.ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1')),s=JSON.parse(localStorage[k]);const l=${JSON.stringify(lista)};l[0].plan.rutina=s.rutina.filter(d=>d.id!=='core').slice(0,2).map((d,i)=>({...d,id:'e'+(i+1)}));s.miEntrenador={lista:l,aplicado:{},checkins:[]};localStorage[k]=JSON.stringify(s)})()`);
  await p.recargar();
  await p.ir('entrenador');
  await a.esperar('#vista [data-accion=ent-usar]');
  await paso('plan nuevo');

  // Usar el plan (el "¿Seguro?" se acepta solo)
  const rutinaAntes = JSON.stringify((await est()).rutina);
  await tocarTexto('✓ Usar este plan');
  let s = await est();
  falla(s.rutina.some((d) => d.id === 'e1') && s.miEntrenador.aplicado.r1 === lista[0].plan_version && s.miEntrenador.antes, 'no usó el plan');
  falla(s.rutina.some((d) => d.id === 'core') === JSON.parse(rutinaAntes).some((d) => d.id === 'core'), 'el core no se quedó');
  await paso('plan usado');

  // Check-in: primero con errores, luego bien
  await tocarTexto('📤 Mandar check-in');
  falla((await a.aviso()).includes('Responde al menos una pregunta'), 'no avisó que falta responder: ' + await a.aviso());
  await escribirCampo('Peso en ayunas (kg)', '10');
  await tocarTexto('📤 Mandar check-in');
  falla((await a.aviso()).includes('Revisa el peso'), 'no avisó el peso raro');
  await escribirCampo('Peso en ayunas (kg)', '72,5');
  await escribirCampo('Sueño (1-5)', '7');
  await tocarTexto('📤 Mandar check-in');
  falla((await a.aviso()).includes('Sueño y energía'), 'no avisó el sueño fuera de rango');
  await escribirCampo('Sueño (1-5)', '4');
  await escribirCampo('Energía (1-5)', '3');
  await escribirCampo('Entrenos hechos', '4');
  await escribirCampo('Plan de comida (%)', '80');
  await escribirCampo('¿Molestias, dudas o algo que quieras contarme?', 'Todo bien');
  await tocarTexto('📤 Mandar check-in');
  s = await est();
  const ck = s.miEntrenador.checkins.slice(-1)[0];
  falla(ck && ck.peso === 72.5 && ck.sueno === 4 && ck.energia === 3 && ck.entreno === 4 && ck.comida === 80 && ck.nota === 'Todo bien', 'el check-in no quedó: ' + JSON.stringify(ck));
  falla((s.dias[iso()] || {}).peso === 72.5, 'el peso del check-in no quedó como el de hoy');
  await a.dormir(300);
  await paso('check-in');
  console.log('§ peso tras el check-in :: ' + await a.valor('#vista #mck-peso'));

  // Compartir ahora (sin sesión no manda nada ni falla)
  await tocarTexto('🔄 Compartir ahora');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('entrenador-pc');
  await p.celular();
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('entrenador-cel');
  await p.ev('window.scrollBy(0, 700)');
  await p.foto('entrenador-cel-2');
  await p.computador();

  // Volver a lo de antes
  await tocarTexto('↶ Volver a mi rutina y mis comidas de antes', undefined, false);
  s = await est();
  falla(JSON.stringify(s.rutina) === rutinaAntes && !s.miEntrenador.antes, 'no volvió a la rutina de antes');
  await paso('volvió');
  console.log('✓ Entrenador');
};
