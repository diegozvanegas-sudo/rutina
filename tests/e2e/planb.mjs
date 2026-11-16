// Recorrido de 💰 Finanzas → 🛟 Plan B, módulos 3, 4 y 5, con clics y teclado reales:
// 💡 Módulo 3 (preguntas, reto de 3 días, ideas, los 7 segundos, soluciones simples y la elegida, conclusiones),
// 🚀 Módulo 4 (problemas con puntaje, elegir, borrar y deshacer, conversaciones, SCAMPER, ideas en la matriz,
// propuesta de valor, prototipo y experimento, veredicto, conclusiones) y 🎤 Módulo 5 (sugerencias del módulo 4,
// bloques, preguntas difíciles, ensayo con cronómetro).
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/planb.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { PREGUNTAS_RUTINA, IDEAS_RETO, CONCLUSIONES } from '../../src/creativo.js';
import { CRITERIOS, PROTOTIPOS, VEREDICTOS } from '../../src/innovacion.js';
import { BLOQUES_PITCH, PREGUNTAS_DIFICILES } from '../../src/pitch.js';

export default async (p) => {
  const a = ayudas(p, 'Plan B 3-5'), { paso, falla, tocarTexto, escribirCampo } = a;
  const pb = async () => { const f = (await p.estado())?.finanzas || {}; return f.desempleo || f.planB || {}; };
  const json = async () => JSON.stringify(await pb());
  // El n-ésimo botón visible con ese texto (o aria-label), opcionalmente dentro del n-ésimo grupo con ese nombre
  // Si todavía no está (la pantalla se está repintando o descargando), se reintenta hasta 3 s
  const tocarN = async (txt, n = 0, grupo = null, g = 0) => {
    let ok = false;
    for (let intento = 0; intento < 15 && !ok; intento++) {
      if (intento) await a.dormir(200);
      ok = await p.ev(`(()=>{
      document.querySelectorAll('[data-e2e]').forEach(x=>x.removeAttribute('data-e2e'));
      const norm=s=>(s||'').replace(/[▾▸▼▶\\u200b]/g,'').replace(/\\s+/g,' ').trim(), t=${JSON.stringify(txt)}, gr=${JSON.stringify(grupo)};
      let raiz=document.getElementById('vista');
      if(gr){ raiz=[...raiz.querySelectorAll('[role=group]')].filter(x=>x.getAttribute('aria-label')===gr)[${g}]; if(!raiz) return false; }
      const el=[...raiz.querySelectorAll('button,[role=button]')].filter(x=>x.checkVisibility({visibilityProperty:true})).filter(x=>norm(x.textContent)===t||norm(x.getAttribute('aria-label'))===t)[${n}];
      if(!el) return false; el.setAttribute('data-e2e','1'); el.scrollIntoView({block:'center'}); return true})()`);
    }
    if (!ok) throw new Error('Plan B 3-5: no encontré "' + txt + '" (' + n + (grupo ? ', en ' + grupo + ' ' + g : '') + ')');
    await p.tocar('[data-e2e]');
  };
  const escribirEn = async (selector, valor) => { await a.escribir(selector, valor); await a.salir(); };
  const textoBoton = (selector) => p.ev(`(document.querySelector(${JSON.stringify(selector)})||{}).textContent||''`);

  await p.ir('finanzas/planb');
  await a.esperar('#vista h1');
  await a.dormir(500);

  // ---------- Módulo 3: Despertar creativo ----------
  await tocarTexto('💡 Módulo 3 · Despertar creativo');
  await a.dormir(400);
  falla((await a.texto()).includes('Módulo 3: Despertar creativo'), 'no abrió el módulo 3');
  await paso('creativo');
  await escribirCampo(PREGUNTAS_RUTINA[0][1], 'Casi siempre igual');
  falla((await json()).includes('Casi siempre igual'), 'no guardó la respuesta de la rutina');
  // Reto: una idea para el día 1, escrita a mano para el día 2, y el día 3 vacío no se deja marcar
  await tocarN(IDEAS_RETO[0]);
  falla((await pb()).creativo.reto[0].actividad === IDEAS_RETO[0], 'la idea no quedó en el día 1');
  await escribirEn('[aria-label="Actividad del día 2"]', 'Desayunar en el parque');
  await tocarN('Lo hice', 0);
  await paso('reto día 1 hecho');
  await tocarN('Lo hice', 0);
  await tocarN('Lo hice', 0);
  falla((await a.aviso()).includes('Escribe primero qué hiciste distinto'), 'no avisó del día sin actividad');
  let c = (await pb()).creativo;
  falla(!!c.reto[0].fecha && !!c.reto[1].fecha && !c.reto[2].fecha, 'el reto no quedó con los días 1 y 2 hechos: ' + JSON.stringify(c.reto));
  falla((await a.texto()).includes('dos quedaron el mismo día'), 'no avisó de dos días el mismo día');
  // Desmarcar el día 2 y volver a marcarlo
  await tocarN('✓Lo hice', 1);
  falla(!(await pb()).creativo.reto[1].fecha, 'no desmarcó el día 2');
  await tocarN('Lo hice', 0);
  await paso('reto');
  await escribirCampo('🦄 Lo que imaginé', 'Volar en una cometa');
  await escribirCampo('🧩 Un problema cotidiano', 'Se me va el tiempo en la casa');
  await escribirEn('[aria-label="Solución 1"]', 'Un horario semanal');
  await escribirEn('[aria-label="Solución 2"]', 'Cocinar el domingo');
  await tocarTexto('Elegir la solución 2');
  await tocarTexto('＋ Otra solución');
  await a.dormir(200);
  c = (await pb()).creativo;
  falla(c.elegida === 1 && c.soluciones.length === 4 && c.soluciones[0] === 'Un horario semanal', 'no guardó las soluciones o la elegida: ' + JSON.stringify(c.soluciones) + ' ' + c.elegida);
  await a.salir();
  await escribirCampo(CONCLUSIONES[0][1], 'Que sí soy creativo');
  falla((await json()).includes('Que sí soy creativo'), 'no guardó la conclusión');
  await tocarTexto('📋 Copiar texto');
  falla((await a.aviso()).includes('Copiado'), 'no copió el texto del módulo 3');
  await paso('creativo lleno');
  // Los 7 segundos: el botón cuenta y avisa al terminar
  await tocarTexto('⏱️ Empezar los 7 segundos');
  await a.dormir(1300);
  falla((await textoBoton('[data-t=siete]')).startsWith('✏️ ¡Dibuja!'), 'el botón de los 7 segundos no cuenta: ' + await textoBoton('[data-t=siete]'));
  await a.dormir(7000);
  falla((await a.aviso()).includes('¡Tiempo!'), 'no avisó al terminar los 7 segundos');

  // ---------- Módulo 4: Innovación ----------
  await tocarTexto('🚀 Módulo 4 · Innovación');
  await a.dormir(400);
  falla((await a.texto()).includes('Módulo 4: Innovación'), 'no abrió el módulo 4');
  await paso('innovación');
  await tocarTexto('＋ Problema');
  await a.dormir(200);
  await a.salir();
  await escribirEn('[aria-label="Problema 1"]', 'No tengo tiempo para buscar empleo');
  for (let k = 0; k < CRITERIOS.length; k++) await tocarN('4', 0, CRITERIOS[k][1], 0);
  await tocarTexto('Elegir este');
  falla((await a.aviso()).includes('Problema elegido'), 'no avisó del problema elegido');
  await tocarTexto('＋ Problema');
  await a.dormir(200);
  await a.salir();
  await escribirEn('[aria-label="Problema 2"]', 'Los vecinos no tienen dónde dejar a los perros');
  for (let k = 0; k < CRITERIOS.length; k++) await tocarN('5', 0, CRITERIOS[k][1], 1);
  let x = (await pb()).innovacion;
  falla(x.problemas.length === 2 && x.problemas[0].notas.frecuencia === 4 && x.problemas[1].notas.puedo === 5 && x.elegido === x.problemas[0].id, 'no guardó los problemas: ' + JSON.stringify(x.problemas));
  await paso('problemas');
  // Quitar una nota tocándola otra vez, borrar el segundo problema y deshacer
  await tocarN('5', 0, CRITERIOS[0][1], 1);
  falla((await pb()).innovacion.problemas[1].notas.frecuencia == null, 'no quitó la nota');
  await tocarN('Borrar el problema', 1);
  falla((await pb()).innovacion.problemas.length === 1, 'no borró el problema');
  await tocarTexto('Deshacer', '#toast button');
  falla((await pb()).innovacion.problemas.length === 2, 'deshacer no devolvió el problema');
  // Conversaciones
  await tocarTexto('＋ Conversación');
  await a.dormir(200);
  await a.salir();
  await escribirEn('[aria-label="Persona 1"]', 'Mi prima');
  await escribirEn('[aria-label="Lo que aprendiste de la persona 1"]', 'Le preocupa más el tiempo que la plata');
  x = (await pb()).innovacion;
  falla(x.entrevistas[0].quien === 'Mi prima' && !!x.entrevistas[0].fecha, 'no guardó la conversación: ' + JSON.stringify(x.entrevistas));
  await escribirCampo('🔁 ¿Qué se repitió', 'El tiempo');
  // SCAMPER e ideas
  await escribirEn('[data-cambio=in-scamper][data-k=s]', 'Cambiar la hoja de vida por un video');
  await tocarTexto('＋ Idea');
  await a.dormir(200);
  await a.salir();
  await escribirEn('[aria-label="Idea 1"]', 'Un CV hecho con IA');
  await tocarN('alto', 0, 'Impacto', 0);
  await tocarN('bajo', 0, 'Esfuerzo', 0);
  await tocarTexto('Elegir la idea 1');
  await tocarTexto('＋ Idea');
  await a.dormir(200);
  await a.salir();
  await escribirEn('[aria-label="Idea 2"]', 'Ferias de empleo en el barrio');
  await tocarN('alto', 0, 'Impacto', 1);
  await tocarN('alto', 0, 'Esfuerzo', 1);
  x = (await pb()).innovacion;
  falla(x.scamper.s && x.ideas.length === 2 && x.ideas[0].impacto === 'alto' && x.ideas[0].esfuerzo === 'bajo' && x.idea === x.ideas[0].id, 'no guardó las ideas: ' + JSON.stringify(x.ideas));
  await paso('ideas');
  // Propuesta de valor
  await escribirCampo('Para (¿quién?)', 'personas sin empleo');
  await escribirCampo('mi solución', 'un CV en video hecho con IA');
  await escribirCampo('le permite', 'destacar en 10 segundos');
  falla((await a.texto()).includes('💬'), 'no salió la frase de valor');
  // Prototipo y experimento
  await tocarTexto(PROTOTIPOS[4][1]);
  await escribirCampo('🔬 Creo que', 'de 10 personas, 3 lo pagan');
  await escribirCampo('Le mostré a', '10');
  await escribirCampo('Dijeron que sí', '4');
  await escribirCampo('Mi meta era', '3');
  await tocarTexto(VEREDICTOS[0][1]);
  x = (await pb()).innovacion;
  falla(x.prototipo === PROTOTIPOS[4][0] && x.experimento.personas === 10 && x.experimento.si === 4 && x.experimento.meta === 3 && x.experimento.veredicto === VEREDICTOS[0][0], 'no guardó el experimento: ' + JSON.stringify(x.experimento));
  falla((await a.texto()).includes('Lograste la meta'), 'no mostró el resultado del experimento');
  await escribirCampo('Le mostré a', '');
  falla((await pb()).innovacion.experimento.personas == null, 'vaciar el número no lo quitó');
  await escribirCampo('Le mostré a', '10');
  await escribirCampo('¿Qué aprendiste de innovar', 'Que hay que preguntar antes');
  await paso('innovación llena');

  // ---------- Módulo 5: Pitch ----------
  await tocarTexto('🎤 Módulo 5 · Pitch');
  await a.dormir(400);
  falla((await a.texto()).includes('Módulo 5: Pitch'), 'no abrió el módulo 5');
  await paso('pitch');
  await tocarTexto('✨ Usar del módulo 4', 'button, a, [role=button]', false);
  let pi = (await pb()).pitch;
  falla(Object.values(pi.bloques).some(Boolean), 'la sugerencia no llenó un bloque');
  await escribirEn('[data-cambio=pi-bloque][data-k=gancho]', '¿Sabías que un reclutador mira una hoja de vida 7 segundos?');
  await escribirEn('[data-cambio=pi-bloque][data-k=pedido]', 'Pruébalo gratis esta semana');
  await escribirCampo(PREGUNTAS_DIFICILES[0][1], '50.000 por video');
  pi = (await pb()).pitch;
  falla(pi.bloques.gancho.startsWith('¿Sabías') && pi.respuestas.precio === '50.000 por video', 'no guardó el pitch: ' + JSON.stringify(pi));
  await paso('pitch escrito');
  await tocarTexto('Ensayar (60 s)');
  await a.dormir(2300);
  const corriendo = await textoBoton('[data-t=ensayar]');
  falla(corriendo.startsWith('⏹ Terminé · quedan'), 'el cronómetro no corre: ' + corriendo);
  await tocarTexto('⏹ Terminé', 'button', false);
  falla((await a.aviso()).includes('✓ Ensayo de'), 'no guardó el ensayo');
  pi = (await pb()).pitch;
  falla(pi.ensayos.length === 1 && pi.ensayos[0].segundos >= 1, 'el ensayo no quedó: ' + JSON.stringify(pi.ensayos));
  falla((await textoBoton('[data-t=ensayar]')).includes('▶ Ensayar'), 'el botón no volvió a "Ensayar"');
  await paso('pitch ensayado');

  // Volver al módulo 1, recargar y ver los tres en el celular
  await tocarTexto('🛟 Módulo 1 · Afrontar el desempleo');
  falla((await a.texto()).includes('Plan B: si te quedas sin empleo'), 'no volvió al módulo 1');
  await p.recargar();
  await p.ir('finanzas/planb');
  await a.esperar('#vista h1');
  await a.dormir(500);
  for (const [chip, titulo, foto] of [['💡 Módulo 3 · Despertar creativo', 'Módulo 3: Despertar creativo', 'creativo'], ['🚀 Módulo 4 · Innovación', 'Módulo 4: Innovación', 'innovacion'], ['🎤 Módulo 5 · Pitch', 'Módulo 5: Pitch', 'pitch']]) {
    await tocarTexto(chip);
    await a.dormir(400);
    falla((await a.texto()).includes(titulo), 'no abrió ' + titulo + ' después de recargar');
    await paso(foto + ' al final');
    await p.foto('planb-' + foto + '-pc');
  }
  await p.celular();
  for (const [chip, foto] of [['💡 Módulo 3 · Despertar creativo', 'creativo'], ['🚀 Módulo 4 · Innovación', 'innovacion'], ['🎤 Módulo 5 · Pitch', 'pitch']]) {
    await tocarTexto(chip);
    await a.dormir(400);
    falla(await p.sinDesborde(), foto + ' se desborda en el celular');
    await p.foto('planb-' + foto + '-cel');
  }
  await tocarTexto('🛟 Módulo 1 · Afrontar el desempleo');
  await p.computador();
  console.log('✓ Plan B módulos 3, 4 y 5');
};
