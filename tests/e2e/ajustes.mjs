// Recorrido de ⚙️ Ajustes con clics y teclado reales: perfil (nombre y semana 1), avisos del día (hora y apagar uno),
// Google Sheets (dirección, clave, envío automático), metas diarias, estudio al día, pastilla → desayuno, sonido,
// exportar (JSON y CSV) y empezar de cero. Sin nube (la cuenta no se prueba aquí).
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/ajustes.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Ajustes'), { paso, falla, tocarTexto, escribirCampo } = a;
  const c = async () => ((await p.estado()) || {}).config || {};

  await p.computador();
  await p.ir('ajustes');
  await a.esperar('#vista [data-cambio=conf-nombre]');
  await paso('inicio');

  // 👤 Perfil
  await escribirCampo('Tu nombre (para el saludo)', 'Diego');
  falla((await c()).nombre === 'Diego', 'no guardó el nombre');
  await p.poner('#vista [data-cambio=conf-semana1]', '2026-09-02');
  falla((await c()).semana1 === '2026-08-31', 'la semana 1 no quedó en el lunes: ' + (await c()).semana1);
  await paso('perfil');

  // 🔔 Avisos del día
  await p.poner('#vista [data-cambio=aviso-hora][data-k=pastilla]', '06:30');
  falla((await c()).avisos.horas.pastilla === '06:30', 'no guardó la hora de la pastilla');
  const id = await p.ev(`document.querySelector('#vista [data-cambio=aviso-activo]').dataset.id`);
  await p.tocar('#vista [data-cambio=aviso-activo][data-id="' + id + '"]');
  falla((await c()).avisos.apagados[id], 'no apagó el aviso ' + id);
  await p.tocar('#vista [data-cambio=aviso-activo][data-id="' + id + '"]');
  falla(!(await c()).avisos.apagados[id], 'no volvió a prender el aviso');
  await paso('avisos');

  // 📗 Google Sheets
  await escribirCampo('Dirección de la aplicación web', 'https://script.google.com/macros/s/abc/exec');
  await escribirCampo('Clave (la misma de CLAVE en el script)', 'secreta');
  let h = (await c()).hoja;
  falla(h.url === 'https://script.google.com/macros/s/abc/exec' && h.clave === 'secreta', 'no guardó la hoja: ' + JSON.stringify(h));
  await p.tocar('#vista [data-cambio=conf-hoja-auto]');
  falla((await c()).hoja.auto === false, 'no apagó el envío automático');
  falla(!(await p.ev(`document.querySelector('#vista [data-accion=hoja-enviar]').disabled`)), 'el botón de enviar sigue apagado con la hoja lista');
  await paso('hoja');

  // Metas, estudio, pastilla y sonido
  await escribirCampo('Agua (ml)', '3000');
  falla((await c()).metas.agua === 3000, 'no guardó la meta de agua');
  await escribirCampo('🎓 Estudio al día (min)', '45');
  falla((await c()).estudio.minutos === 45, 'no guardó el estudio al día');
  await escribirCampo('Mínimo (min)', '30');
  await escribirCampo('Ideal (min)', '50');
  const esp = (await c()).espera;
  falla(esp.minimo === 30 && esp.ideal === 50, 'no guardó la espera: ' + JSON.stringify(esp));
  const sonido = !!(await c()).sonido;
  await p.tocar('#vista [data-cambio=conf-sonido]');
  falla(!!(await c()).sonido === !sonido, 'no cambió el sonido');
  await paso('metas');

  // Copia de seguridad (las descargas no se revisan; que no falle)
  await tocarTexto('⬇ Exportar (JSON)');
  await tocarTexto('🏋️ Gym por semana');
  await tocarTexto('☀️ Hábitos y metas por día');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('ajustes-pc');
  await p.celular();
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('ajustes-cel');
  await p.ev('window.scrollBy(0, 900)');
  await p.foto('ajustes-cel-2');
  await p.ev('window.scrollBy(0, 1200)');
  await p.foto('ajustes-cel-3');
  await p.computador();

  // Empezar de cero (los dos "¿Seguro?" se aceptan solos)
  await tocarTexto('Borrar todos los datos');
  await a.dormir(800);
  falla(!(await c()).nombre, 'no borró los datos');
  const s = (await p.estado()) || {};
  falla(!s.rutina.length && !s.habitos.length && !Object.keys(s.semanas).length, 'empezar de cero no dejó la cuenta vacía');
  // Los recorridos que siguen arrancan otra vez con el ejemplo
  await p.ev('window.rutinaPrueba.ejemplo()');
  await a.dormir(300);
  console.log('✓ Ajustes');
};
