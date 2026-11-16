// Recorrido de 🏋️ Gym con clics y teclado reales. Por ahora las pestañas 📊 Resumen (semana, objetivos por músculo,
// fuerza, registros raros, un ejercicio en el tiempo, progreso de peso, semana pasada), 📆 12 semanas (empezar, revisión,
// reiniciar) y 🏠 En casa (tipo de día, anotar reps, variante, abrir y cerrar). El día de entreno va después.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/gym.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { PRUEBAS, CASA } from '../../src/plan12.js';
import { iso } from '../../src/fechas.js';

const lunesDe = (f) => { const d = new Date(f + 'T12:00:00'); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); };
const menos = (f, n) => { const d = new Date(f + 'T12:00:00'); d.setDate(d.getDate() - n); return iso(d); };

// Datos de 4 semanas para que la fuerza y el historial tengan qué mostrar (se escriben en el equipo y se recarga).
// Devuelve el número de la semana actual. También lo usa el recorrido del día (gymdia.mjs)
export async function sembrar(p, a, abrirGym) {
  const { falla, tocarTexto } = a;
  await abrirGym();
  const sem = Number(await p.ev(`document.querySelector('[aria-label=Semana]').value`));
  falla(sem >= 4, 'la semana actual es ' + sem);
  // Con el perfil nuevo la app todavía no ha guardado: un objetivo cualquiera hace que guarde
  await tocarTexto('📊 Resumen');
  await tocarTexto('✏️ Editar objetivos');
  await a.escribir('[aria-label^="Mínimo de "]', '11');
  await a.salir();
  await tocarTexto('✓ Listo');
  await p.ev(`(()=>{
    const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1')), s=JSON.parse(localStorage[k]), S=${sem};
    const r=(peso,reps)=>({peso:String(peso),unidad:'kg',reps});
    for(let i=1;i<=3;i++){
      const w=(s.semanas[S-4+i] ??= {});
      w['d1-1-1']=r(40+2.5*i,'6'); w['d1-1-2']=r(35,'10 10');
      w['pa-2-1']=r(80,'7'); w['pa-2-2']=r(70,'10 9');
      w['d3-1-1']=r(60,'7'); w['d3-1-2']=r(50,'12 12');
    }
    s.semanas[S-1]['d3-1-2']=r(50,'12 2');
    s.dias ??= {}; (s.dias[${JSON.stringify(iso())}] ??= {}).peso=72; (s.dias[${JSON.stringify(menos(iso(), 28))}] ??= {}).peso=74;
    localStorage[k]=JSON.stringify(s)})()`);
  await p.recargar();
  return sem;
}

export default async (p) => {
  const a = ayudas(p, 'Gym'), { paso, falla, tocarTexto, escribirCampo } = a;
  const abrirGym = async (dia) => { await p.ir('gym'); await a.esperar('#vista h1'); await a.dormir(400); if (dia) { await tocarTexto(dia); await a.dormir(500); } };

  const sem = await sembrar(p, a, abrirGym);

  // ---------- 📊 Resumen ----------
  await abrirGym('📊 Resumen');
  falla((await a.texto()).includes('Series por músculo'), 'no abrió el resumen');
  await paso('resumen');
  await tocarTexto('✏️ Editar objetivos');
  const musculo = await p.ev(`(document.querySelector('[aria-label^="Mínimo de "]')||{}).getAttribute?.('aria-label')`);
  falla(!!musculo, 'no salieron los campos de los objetivos');
  await a.escribir('[aria-label="' + musculo + '"]', '12');
  await a.salir();
  const m = musculo.replace('Mínimo de ', '');
  falla(((await p.estado()).config.objetivos[m] || [])[0] === 12, 'no guardó el objetivo de ' + m);
  await paso('objetivos');
  await tocarTexto('✓ Listo');
  // Registro raro: no cuenta, deshacer, está bien
  await tocarTexto('Sí, que no cuente');
  falla((await a.aviso()).includes('no cuenta en la comparación'), 'no avisó del registro incompleto');
  falla(JSON.stringify((await p.estado()).semanas[sem - 1]['d3-1-2'].incompletas) === '[1]', 'no marcó la serie incompleta');
  falla(!(await a.texto()).includes('Revisa estos registros'), 'el registro respondido sigue en la lista');
  await paso('raro marcado');
  // Un ejercicio en el tiempo
  const opciones = await p.ev(`[...document.querySelectorAll('[data-cambio=fuerza-ej] option')].map(o=>o.value)`);
  falla(opciones.length >= 2, 'el selector de ejercicio tiene ' + opciones.length + ' opciones');
  await p.poner('[data-cambio=fuerza-ej]', opciones[1]);
  await a.dormir(300);
  await paso('otro ejercicio');
  // La semana pasada y volver
  await p.poner('[aria-label=Semana]', String(sem - 1));
  await a.dormir(400);
  falla((await a.texto()).includes('semana pasada'), 'no cambió a la semana pasada');
  await paso('semana pasada');
  await p.poner('[aria-label=Semana]', String(sem));
  await a.dormir(400);
  // Tocar un día de la semana lleva a ese día
  await tocarTexto('Vie · Torso A', 'button', false);
  await a.dormir(500);
  falla(!(await a.texto()).includes('Series por músculo'), 'tocar el día no salió del resumen');
  await tocarTexto('📊 Resumen');

  // ---------- 📆 12 semanas ----------
  await tocarTexto('📆 12 semanas');
  falla((await a.texto()).includes('Plan de 12 semanas'), 'no abrió el plan de 12 semanas');
  await paso('12 semanas');
  await escribirCampo('Edad', '31');
  await p.poner('[name=sexo]', 'H');
  await p.poner('[name=inicio]', lunesDe(iso()));
  await tocarTexto('Empezar el plan');
  falla((await a.aviso()).includes('Plan listo'), 'no empezó el plan');
  await paso('plan empezado');
  await p.poner('[name=' + PRUEBAS[0][0] + ']', '8');
  await p.poner('[name=' + PRUEBAS[2][0] + ']', '25');
  await tocarTexto('Guardar revisión');
  falla((await a.aviso()).includes('Revisión de la semana 1 guardada'), 'no guardó la revisión');
  await paso('revisión guardada');
  await tocarTexto('Reiniciar el plan', 'button', false);
  falla((await a.texto()).includes('Empezar el plan'), 'no reinició el plan');
  await paso('plan reiniciado');

  // ---------- 🏠 En casa ----------
  await tocarTexto('🏠 En casa');
  falla((await a.texto()).includes('Entreno en casa'), 'no abrió el entreno en casa');
  await paso('en casa');
  const tipos = Object.entries(CASA);
  await tocarTexto(tipos[0][1].nombre.split(' (')[0]);
  await paso('tipo elegido');
  await escribirCampo('Reps de cada serie', '10 9 8');
  const hoy = iso(), casa = () => p.estado().then((s) => ((s.plan12 || {}).casa || {})[hoy] || {});
  falla((await casa())[tipos[0][1].ejercicios[0].id] === '10 9 8', 'no guardó las reps en casa: ' + JSON.stringify(await casa()));
  await paso('reps anotadas');
  await p.poner('[data-cambio=casa-nivel]', '1');
  falla(((await p.estado()).plan12.nivel || {})[tipos[0][1].ejercicios[1].id] === 1, 'no guardó la variante');
  await p.tocar('[data-accion=casa-abrir][aria-expanded=false]');
  await paso('abierto a mano');
  await p.tocar('[data-accion=casa-abrir][aria-expanded=true]');
  await paso('cerrado a mano');

  // Celular y computador
  await p.foto('gym-casa-pc');
  await tocarTexto('📊 Resumen');
  await p.foto('gym-resumen-pc');
  await p.celular();
  for (const [chip, foto] of [['📊 Resumen', 'resumen'], ['📆 12 semanas', 'plan12'], ['🏠 En casa', 'casa']]) {
    await tocarTexto(chip);
    await a.dormir(400);
    falla(await p.sinDesborde(), foto + ' se desborda en el celular');
    await p.foto('gym-' + foto + '-cel');
  }
  await p.computador();
  console.log('✓ Gym');
};
