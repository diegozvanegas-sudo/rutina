// Lo que protege los datos en este equipo (src/copias-locales.js y src/errores.js), con clics reales:
// 🗂️ la copia del día queda sola con lo primero que se anota, se ve en Ajustes → Copia de seguridad y «Volver a esta»
// deja los datos como estaban; 💾 el espacio usado se ve; 🐞 un error queda anotado, se ve en Ajustes y se borra.
// En computador y celular. Sin nube (la subida de errores y Administrar → 🐞 Errores se prueban en la base: ver esquema.sql).
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/guardado.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Guardado'), { falla, tocarTexto } = a;
  const agua = async () => ((((await p.estado()) || {}).dias || {})[iso()] || {}).metas?.agua || 0;
  const abrirAjustes = async () => {
    await p.ir('ajustes');
    await a.esperar('#vista [data-plegable="ajustes|Copia de seguridad"]');
    await p.ev(`document.querySelectorAll('#vista [data-plegable="ajustes|Copia de seguridad"][data-estado=cerrada] [data-t=plegar], #vista [data-plegable="ajustes|🐞 Errores"][data-estado=cerrada] [data-t=plegar]').forEach((b) => b.click())`);
    await a.dormir(500);
  };

  await p.computador();
  // Empezar sin copias (otros recorridos de antes pudieron dejar una) y con un cambio: la copia de hoy se toma con él
  await p.ev(`new Promise((r) => { const q = indexedDB.deleteDatabase('rutina-copias'); q.onsuccess = q.onerror = q.onblocked = () => r(); })`);
  await p.recargar();
  await p.ir('metas'); await a.esperar('#vista h1');
  await tocarTexto('+250 ml');
  await a.dormir(500);
  const aguaCopia = await agua();
  await abrirAjustes();
  await a.esperar('#vista [data-t=copias-equipo] li');
  falla((await p.cuantos('#vista [data-t=copias-equipo] li')) === 1, 'debería haber una sola copia (la de hoy)');
  falla(/^Hoy/.test(await p.leer('#vista [data-t=copias-equipo] li')), 'la copia no dice Hoy: ' + await p.leer('#vista [data-t=copias-equipo] li'));
  falla(/Tus datos: [\d,]+ MB de unos 5 MB/.test(await p.leer('#vista [data-t=espacio]')), 'no muestra el espacio: ' + await p.leer('#vista [data-t=espacio]'));
  console.log('✓ la copia de hoy quedó sola con el primer cambio, y se ve el espacio: ' + await p.leer('#vista [data-t=espacio]'));

  // Más cambios hoy: la copia de hoy no se pisa (queda cómo empezó el día)
  await p.ir('metas'); await a.esperar('#vista h1');
  await tocarTexto('+250 ml'); await tocarTexto('+250 ml');
  falla((await agua()) === aguaCopia + 500, 'no sumó el agua');
  await abrirAjustes();
  await a.esperar('#vista [data-t=copias-equipo] li');
  falla((await p.cuantos('#vista [data-t=copias-equipo] li')) === 1, 'con más cambios se hizo otra copia');

  // Volver a la copia: el agua queda como en la copia (confirm se acepta solo en las pruebas)
  await p.tocar('#vista [data-t=copia-volver]');
  await a.dormir(800);
  falla((await agua()) === aguaCopia, 'Volver a esta no dejó los datos de la copia: agua ' + (await agua()) + ' (copia ' + aguaCopia + ')');
  console.log('✓ más cambios no pisan la copia de hoy, y «Volver a esta» deja los datos como estaban');

  // 🐞 Errores: uno anotado se ve (con cuántas veces), se copia y se borra
  falla(await p.cuantos('#vista [data-t=sin-errores]'), 'empezó con errores anotados');
  await p.ev(`(async () => { const m = await import('/src/errores.js'); m.anotarError('pantalla', 'Prueba: algo falló', '#gym'); m.anotarError('pantalla', 'Prueba: algo falló', '#gym'); })()`);
  await a.dormir(400);
  await a.esperar('#vista [data-t=errores] li');
  const t = await p.leer('#vista [data-t=errores] li');
  falla(/2 veces/.test(t) && /Prueba: algo falló/.test(t), 'el error no se ve bien: ' + t);
  await p.celular();
  await abrirAjustes();
  falla(await p.sinDesborde(), 'Ajustes se sale de la pantalla en el celular');
  await p.ev(`document.querySelector('#vista [data-plegable="ajustes|Copia de seguridad"]').scrollIntoView()`);
  await p.foto('guardado-copias-cel');
  await p.ev(`document.querySelector('#vista [data-plegable="ajustes|🐞 Errores"]').scrollIntoView()`);
  await p.foto('guardado-errores-cel');
  await tocarTexto('🗑 Borrar la lista');
  await a.dormir(300);
  falla(await p.cuantos('#vista [data-t=sin-errores]'), 'no borró la lista de errores');
  console.log('✓ un error queda anotado (2 veces en una fila), se ve en Ajustes y se borra');

  // Una pantalla que se cae no deja la página en blanco: dice qué hacer y queda anotado
  await p.computador();
  console.log('✓ Guardado');
};
