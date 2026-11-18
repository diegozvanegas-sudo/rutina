// Recorrido de una cuenta nueva (rutinaPrueba.nuevo: lo que tiene alguien que acaba de entrar por primera vez):
// nada del usuario principal (ni su rutina, ni sus hábitos, ni su moto, ni su peso), la semana 1 es la de hoy (sin
// semanas pasadas), todo en cero y en cada sección un mensaje de cómo empezar. Luego "Cargar el ejemplo".
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/nuevo.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Cuenta nueva'), { paso, falla, tocarTexto } = a;
  const est = async () => (await p.estado()) || {};
  const ajenos = ['levotiroxina', 'Chía', 'Aceite de la moto', 'Press plano', 'Pierna A', 'Torso A', '87 kg', 'Semana 6'];
  const sinAjenos = async (donde) => { const t = await a.texto(); const hay = ajenos.filter((x) => t.includes(x)); falla(!hay.length, donde + ': se ve algo del usuario principal: ' + hay.join(', ')); };

  await p.computador();
  await p.ir('hoy');
  await a.esperar('#vista h1');
  await p.ev('window.rutinaPrueba.nuevo()');
  await a.dormir(800);
  const s = await est();
  falla(!s.habitos.length && !s.rutina.length && !s.config.futbol.length, 'la cuenta nueva trae hábitos, rutina o fútbol');
  falla(!s.recordatorios.lista.length && !s.recordatorios.vehiculos.length, 'la cuenta nueva trae recordatorios o vehículos');
  falla(!Object.keys(s.semanas).length && !Object.keys(s.dias).length, 'la cuenta nueva trae registros');

  // Hoy: bienvenida con los pasos, semana 1, puntaje en cero
  await p.ir('hoy');
  await a.esperar('#vista h1');
  falla((await a.texto()).includes('semana 1'), 'Hoy no dice semana 1');
  falla((await a.texto()).includes('Bienvenido'), 'no saluda a la cuenta nueva');
  await sinAjenos('Hoy');
  await paso('hoy');
  await p.foto('nuevo-hoy-pc');

  // Cada sección: sin nada ajeno y con un mensaje de cómo empezar
  for (const [ruta, pista] of [['gym', 'rutina'], ['manana', 'hábito'], ['dieta', 'peso'], ['metas', ''], ['progreso', ''], ['recordatorios', 'Agregar'], ['editar/rutina', 'día'], ['ajustes', 'semana 1']]) {
    await p.ir(ruta);
    await a.dormir(900);
    await sinAjenos(ruta);
    if (pista) falla((await a.texto()).toLowerCase().includes(pista.toLowerCase()), ruta + ': no explica cómo empezar (' + pista + ')');
    await paso(ruta);
    falla(await p.sinDesborde(), ruta + ': se sale de la pantalla');
  }
  // Gym: solo la semana 1, nada de semanas pasadas
  await p.ir('gym');
  await a.dormir(600);
  const semanas = await p.ev(`[...document.querySelectorAll('#vista select option')].map(o=>o.textContent).filter(t=>/^Semana/.test(t))`);
  falla(!semanas.some((t) => /^Semana ([2-9]|\d\d)/.test(t)), 'el Gym ofrece semanas pasadas: ' + semanas.join(', '));
  await p.celular();
  for (const ruta of ['hoy', 'gym', 'dieta']) { await p.ir(ruta); await a.dormir(700); falla(await p.sinDesborde(), ruta + ': se sale en el celular'); await p.foto('nuevo-' + ruta + '-cel'); }
  await p.computador();

  // Dieta: el primer peso es el de inicio y calcula los planes con él
  await p.ir('dieta');
  await a.esperar('#vista h1');
  await tocarTexto('Anotar mi peso →');
  const kcalAntes = (await est()).dieta.planes.descanso.comidas.flatMap((c) => c.items).length;
  await a.escribirCampo('Peso de hoy', '64,5');
  const dt = (await est()).dieta;
  falla(dt.config.pesoInicio === 64.5 && dt.config.pesoBase === 64.5, 'el primer peso no quedó como el de inicio: ' + JSON.stringify(dt.config));
  falla((await a.aviso()).includes('64,5 kg'), 'no avisó que calculó los planes: ' + await a.aviso());
  falla(kcalAntes > 0, 'los planes quedaron vacíos');
  falla(!(await a.texto()).includes('Empieza por tu peso'), 'sigue el aviso de empezar por el peso');
  await paso('dieta con peso');

  // Cargar el ejemplo desde la bienvenida
  await p.ir('hoy');
  await a.esperar('#vista h1');
  await tocarTexto('📋 Cargar el ejemplo (rutina, hábitos y fútbol)');
  const s2 = await est();
  falla(s2.rutina.length && s2.habitos.length && !s2.bienvenida, 'no cargó el ejemplo');
  falla(!(await a.texto()).includes('Bienvenido'), 'la bienvenida sigue después de elegir');
  await paso('con ejemplo');

  // De vuelta a como empiezan los demás recorridos
  await p.ev('window.rutinaPrueba.ejemplo()');
  console.log('✓ Cuenta nueva');
};
