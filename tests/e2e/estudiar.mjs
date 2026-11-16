// Recorrido de 🎓 Estudiar con clics y teclado reales: minutos del día y cronómetro, abrir la lección del plan,
// recordar sin mirar, práctica, diario, terminar la lección, ir a otra y volver, las pestañas del curso (lecciones, mapa,
// proyecto, fuentes), el área y volver, el repaso de tarjetas (voltear y responder), el curso de inglés (horas y meta)
// y el enlace #estudiar/aprender-a-aprender.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/estudiar.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso, sumarDias } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Estudiar'), { paso, falla, tocarTexto, escribirCampo } = a;
  const E = async () => ((await p.estado()) || {}).estudio || {};
  const pestana = async (k) => { await p.tocar('#vista [data-accion=estudio-pestana][data-p=' + k + ']'); await a.dormir(300); };

  await p.computador();
  await p.ir('estudiar');
  await a.esperar('#vista h1');
  await paso('inicio');

  await escribirCampo('Minutos de estudio al día', '20');
  falla((await p.estado()).config.estudio.minutos === 20, 'no guardó los minutos');
  await tocarTexto('Estudiar', 'button', false);
  await a.dormir(1300);
  await tocarTexto('⏸ Pausa', 'button', false);
  const c = (((await p.estado()).dias || {})[iso()] || {}).crono?.estudio;
  falla(c && !c.inicio && c.acumulado >= 1, 'el cronómetro no contó: ' + JSON.stringify(c));
  await paso('plan');

  // La lección del plan
  const curso = await p.ev(`document.querySelector('#vista [data-accion=estudio-leccion]').dataset.c`);
  await p.tocar('#vista [data-accion=estudio-leccion]');
  await a.esperar('#vista [data-accion=estudio-pestana]');
  await paso('lección');
  await tocarTexto('Ver respuesta');
  await tocarTexto('✓ La sabía');
  const pr = async () => ((await E()).cursos || {})[curso] || {};
  falla((await pr()).recordar?.[1]?.[0] === true, 'no guardó el recordar: ' + JSON.stringify((await pr()).recordar));
  await p.tocar('#vista [data-accion=estudio-practica][data-i="0"]');
  falla(Object.keys((await pr()).practica?.[1] || {}).length === 1, 'no marcó la práctica');
  await a.escribir('#vista [data-cambio=estudio-diario][data-n="1"]', 'Lo que entendí');
  await a.salir();
  falla((await pr()).diario?.[1] === 'Lo que entendí', 'no guardó el diario');
  await paso('lección trabajada');
  await tocarTexto('✓ Terminé la lección');
  falla((await pr()).hechas?.[1] === iso(), 'no terminó la lección');
  falla(Object.keys((await E()).tarjetas || {}).some((k) => k.startsWith(curso + ':1:')), 'no sumó las tarjetas');
  await paso('lección terminada');
  await tocarTexto('← Lección 1', 'button', false);
  await paso('otra lección');
  await tocarTexto('Volver a la de hoy (2)', 'a, button');

  // Pestañas del curso
  await pestana('lecciones');
  await paso('lecciones');
  await pestana('mapa');
  await paso('mapa');
  await pestana('proyecto');
  await p.tocar('#vista [data-accion=estudio-proyecto][data-i="0"]');
  falla(Object.keys((await pr()).proyecto || {}).length === 1, 'no marcó el paso del proyecto');
  await escribirCampo('Notas del proyecto', 'Mi plan');
  falla((await pr()).diario?.proyecto === 'Mi plan', 'no guardó las notas del proyecto');
  await paso('proyecto');
  await pestana('fuentes');
  await paso('fuentes');

  // Área y volver
  await tocarTexto('← ', 'button', false);
  await paso('área');
  await tocarTexto('← Estudiar');
  await paso('de vuelta');

  // Repaso: las tarjetas de hoy vuelven mañana; se adelantan a hoy
  await p.ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1')),s=JSON.parse(localStorage[k]);for(const t of Object.values(s.estudio.tarjetas))t.proxima=${JSON.stringify(sumarDias(iso(), -1))};localStorage[k]=JSON.stringify(s)})()`);
  await p.recargar();
  await p.ir('estudiar');
  await a.esperar('#vista [data-accion=estudio-repasar]');
  await tocarTexto('🔁 Repasar', 'button', false);
  await paso('repaso');
  await tocarTexto('Ver respuesta');
  await paso('volteada');
  await tocarTexto('✓ La sabía');
  falla(Object.values((await E()).tarjetas).some((t) => t.paso === 1), 'no subió de paso la tarjeta');
  await tocarTexto('← Salir del repaso');

  // Inglés
  await p.ir('hoy');
  await p.ir('estudiar/ingles-b2');
  await a.esperar('#vista [data-accion=ing-sumar]');
  await paso('inglés');
  await tocarTexto('+30 min');
  falla(((((await p.estado()).estudio || {}).ingles || {}).minutos || {})[iso()] >= 30, 'no sumó los minutos de inglés: ' + JSON.stringify(((await p.estado()).estudio || {}).ingles) + ' · ' + await a.aviso() + ' · ' + iso() + ' · ' + await p.ev('document.querySelectorAll("[data-accion=ing-sumar]").length'));
  await escribirCampo('Mi meta (horas)', '300');
  await paso('inglés sumado');

  // Enlace directo
  await p.ir('hoy');
  await p.ir('estudiar/aprender-a-aprender');
  await a.esperar('#vista [data-accion=estudio-pestana]');
  await paso('enlace curso');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('estudiar-pc');
  await p.celular();
  await pestana('hoy');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('estudiar-cel-curso');
  await p.ir('hoy');
  await p.ir('estudiar');
  await a.esperar('#vista h1');
  await tocarTexto('← Estudiar').catch(() => {});
  await p.ev('window.scrollTo(0,0)');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.foto('estudiar-cel');
  await p.computador();
  console.log('✓ Estudiar');
};
