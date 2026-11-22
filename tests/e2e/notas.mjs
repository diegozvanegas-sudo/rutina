// Recorrido de 📝 Notas con clics reales, en computador y celular: la sección en el menú (🌱 Mente y crecimiento), nota
// nueva con el cursor listo, escribir con formato (negrita, cursiva, título, casillas, resaltar, enlace), pegar algo con
// estilos (queda limpio), dictar (reconocimiento de voz de mentira), "Guardado", recargar y que siga igual, carpetas
// (con una adentro), etiquetas con color, filtros, buscador, fijar, borrar a la papelera y recuperar.
// No se prueba aquí: el teclado de un celular de verdad (la barra encima del teclado) ni WhatsApp abierto.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/notas.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

const DICTADO = `(() => {
  class Falso {
    start() { window.__dictando = this; setTimeout(() => this.oir([['dictado de prueba', false]]), 80); setTimeout(() => this.oir([['dictado de prueba', true]]), 200); }
    oir(lista) { const results = lista.map(([t, f]) => Object.assign([{ transcript: t }], { isFinal: f })); this.onresult && this.onresult({ resultIndex: 0, results }); }
    stop() { setTimeout(() => this.onend && this.onend(), 20); }
    abort() { this.stop(); }
  }
  window.SpeechRecognition = Falso; window.webkitSpeechRecognition = Falso;
})()`;
// Deja seleccionada la palabra (dentro del texto de la nota)
const elegir = (palabra) => `(()=>{const ed=document.querySelector('[data-t=texto]');const w=document.createTreeWalker(ed,NodeFilter.SHOW_TEXT);let n;
  while((n=w.nextNode())){const i=n.textContent.indexOf(${JSON.stringify(palabra)});if(i>=0){ed.focus();const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+${palabra.length});const s=getSelection();s.removeAllRanges();s.addRange(r);return true}}return false})()`;
// El cursor al final de la nota
const alFinal = `(()=>{const ed=document.querySelector('[data-t=texto]');ed.focus();const r=document.createRange();r.selectNodeContents(ed);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r);return true})()`;

export default async (p) => {
  const a = ayudas(p, 'Notas'), { paso, falla, tocarTexto, dormir } = a;
  const notas = async () => Object.values(((await p.estado()) || {}).notas || {});
  const html = () => p.ev(`document.querySelector('[data-t=texto]').innerHTML`);
  const hasta = async (cond, ms = 5000) => { for (let t = 0; t < ms; t += 100) { if (await cond()) return true; await dormir(100); } return false; };
  const escribir = async (t) => { await p.cdp('Input.insertText', { text: t }); await dormir(150); };
  const boton = (titulo) => p.tocar(`[role=toolbar] [aria-label="${titulo}"]`);
  const guardada = async () => falla(await hasta(async () => (await p.leer('[data-t=guardado]')) === '✓ Guardado', 4000), 'no dice Guardado');

  // El dictado de mentira va también después de recargar (voz.js lee el reconocimiento de voz al cargar)
  await p.cdp('Page.addScriptToEvaluateOnNewDocument', { source: DICTADO });
  for (const equipo of ['computador', 'celular']) {
    await p[equipo]();
    await p.ev(DICTADO);
    await p.recargar();
    if (equipo === 'computador') {
      await p.ev(`(()=>{const b=document.querySelector('#lateral [data-accion=barra-grupo][data-g=mente]');if(b&&b.getAttribute('aria-expanded')!=='true')b.click()})()`);
      await dormir(300);
      falla(await p.cuantos('#lateral a[href="#notas"]'), 'Notas no está en Mente y crecimiento');
    }
    await p.ir('notas');
    await a.esperar('#vista h1');
    falla((await a.texto()).includes('📝 Notas'), 'no abrió la sección');
    const antes = (await notas()).map((n) => n.id);

    // ＋ Nota nueva: el cursor queda en el texto
    await tocarTexto('＋ Nota nueva');
    await a.esperar('[data-t=texto]');
    falla(await p.ev(`document.activeElement===document.querySelector('[data-t=texto]')`), 'el cursor no quedó listo para escribir');
    await escribir('Lista del mercado');
    await a.tecla('Enter', 13);
    await escribir('comprar huevos y pan hoy');
    // Negrita y cursiva sobre lo seleccionado
    await p.ev(elegir('huevos')); await dormir(150); await boton('Negrita');
    await p.ev(elegir('pan')); await dormir(150); await boton('Cursiva');
    // Título: la primera línea
    await p.ev(elegir('Lista')); await dormir(150); await boton('Título');
    // Casillas: dos, y se marca la primera tocando su cuadrito
    await p.ev(alFinal); await a.tecla('Enter', 13);
    await boton('Casillas');
    await escribir('pagar la luz'); await a.tecla('Enter', 13); await escribir('llamar a mamá');
    const c = await p.ev(`(()=>{const li=document.querySelector('[data-t=texto] ul[data-tipo=checks] li');const r=li.getBoundingClientRect();return [r.left+10,r.top+12]})()`);
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await p.cdp('Input.dispatchMouseEvent', { type, x: c[0], y: c[1], button: 'left', clickCount: 1 });
    await dormir(300);
    // Resaltar y enlace
    await p.ev(elegir('comprar')); await dormir(150); await boton('Resaltar');
    await p.ev(elegir('mercado')); await dormir(150); await boton('Enlace');
    await a.esperar('[aria-label="Dirección del enlace"]');
    await escribir('tienda.co');
    await tocarTexto('Poner');
    // Pegar algo con estilos: queda limpio
    await p.ev(alFinal); await a.tecla('Enter', 13);
    await p.ev(`(()=>{const dt=new DataTransfer();dt.setData('text/html','<div style="color:red;font-family:Comic Sans"><span style="font-weight:bold">pegado</span> <script>alert(1)</script>con estilo</div>');dt.setData('text/plain','pegado con estilo');
      document.querySelector('[data-t=texto]').dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}))})()`);
    await dormir(200);
    // Dictar: lo oído queda donde está el cursor
    await p.ev(alFinal); await a.tecla('Enter', 13);
    await boton('Dictar');
    falla(await hasta(async () => (await html()).includes('dictado de prueba')), 'el dictado no quedó en la nota');
    await boton('Parar el dictado');
    await guardada();
    await p.foto('notas-editor-' + equipo);
    let n = (await notas()).find((x) => !antes.includes(x.id));
    falla(n, 'no se guardó la nota');
    const esperado = ['<h2>Lista del <a href="https://tienda.co">mercado</a></h2>', '<b>huevos</b>', '<i>pan</i>', '<mark>comprar</mark>',
      '<ul data-tipo="checks"><li data-hecho="1">pagar la luz</li><li>llamar a mamá</li></ul>', '<b>pegado</b> con estilo', 'dictado de prueba'];
    for (const x of esperado) falla(n.html.includes(x), 'falta ' + x + ' en ' + n.html);
    falla(!/style=|script|alert|font-family/.test(n.html), 'quedaron estilos o scripts: ' + n.html);
    await paso('nota con formato ' + equipo);

    // Recargar: sigue igual
    await p.recargar();
    await p.ir('notas');
    await a.esperar('[data-nota="' + n.id + '"]');
    falla((await p.leer('[data-nota="' + n.id + '"]')).includes('Lista del mercado'), 'la fila no muestra el título');
    await p.tocar('[data-nota="' + n.id + '"] button');
    await a.esperar('[data-t=texto]');
    const h2 = await html();
    for (const x of esperado) falla(h2.includes(x), 'tras recargar falta ' + x);
    falla(await p.cuantos('[data-t=texto] ul[data-tipo=checks] li[data-hecho="1"]') === 1, 'tras recargar la casilla no sigue marcada');
    await tocarTexto('← Notas');

    // Carpetas: Trabajo y, adentro, Clientes. Etiqueta urgente
    const sufijo = equipo === 'computador' ? '' : ' 2';
    await tocarTexto('📁 Carpetas', '.MuiAccordionSummary-root', false);
    await a.escribir('[aria-label="Nombre de la carpeta nueva"]', 'Trabajo' + sufijo); await p.tocar('[aria-label="Crear carpeta"]');
    await a.escribir('[aria-label="Nombre de la carpeta nueva"]', 'Clientes' + sufijo);
    const est1 = await p.estado(), trabajo = est1.notasMeta.carpetas.find((x) => x.nombre === 'Trabajo' + sufijo);
    await p.poner('[aria-label="Dentro de"]', trabajo.id);
    await p.tocar('[aria-label="Crear carpeta"]');
    await tocarTexto('🏷️ Etiquetas', '.MuiAccordionSummary-root', false);
    await a.escribir('[aria-label="Nombre de la etiqueta nueva"]', 'urgente' + sufijo); await p.tocar('[aria-label="Crear etiqueta"]');
    const est2 = await p.estado(), clientes = est2.notasMeta.carpetas.find((x) => x.nombre === 'Clientes' + sufijo), urg = est2.notasMeta.etiquetas.find((x) => x.nombre === 'urgente' + sufijo);
    falla(clientes && clientes.padre === trabajo.id, 'Clientes no quedó dentro de Trabajo');
    falla(urg && /^#/.test(urg.color), 'la etiqueta no tiene color');
    // A la nota: carpeta Clientes y etiqueta urgente
    await p.tocar('[data-nota="' + n.id + '"] button');
    await a.esperar('[data-t=texto]');
    await p.tocar('[data-editor] button[aria-expanded]');
    await p.poner('[aria-label="Carpeta de la nota"]', clientes.id);
    await tocarTexto('urgente' + sufijo, '[aria-label="Etiquetas de la nota"] button');
    n = (await notas()).find((x) => x.id === n.id);
    falla(n.carpeta === clientes.id && n.etiquetas.includes(urg.id), 'no quedó la carpeta o la etiqueta: ' + JSON.stringify([n.carpeta, n.etiquetas]));
    await tocarTexto('← Notas');

    // Otra nota (con título puesto) y fijada: queda arriba
    await tocarTexto('＋ Nota nueva');
    await a.esperar('[data-t=texto]');
    await escribir('una idea suelta');
    await p.tocar('[aria-label="Título de la nota"]'); await escribir('Ideas' + sufijo);
    await p.tocar('[aria-label="Fijar arriba"]');
    await guardada();
    const otra = (await notas()).find((x) => !antes.includes(x.id) && x.id !== n.id);
    falla(otra && otra.titulo === 'Ideas' + sufijo && otra.fijada, 'la segunda nota no tiene título o no quedó fijada: ' + JSON.stringify(otra));
    await tocarTexto('← Notas');
    falla(await p.ev(`document.querySelector('#vista ul[aria-label=Notas] li').dataset.nota`) === otra.id, 'la fijada no quedó arriba');
    await paso('lista ' + equipo);
    await p.foto('notas-lista-' + equipo);

    // Filtros: etiqueta, carpeta (con la de adentro) y buscador
    const filas = () => p.ev(`[...document.querySelectorAll('#vista ul[aria-label=Notas] li')].map(x=>x.dataset.nota)`);
    await tocarTexto('urgente' + sufijo, '[aria-label="Filtrar por etiqueta"] button');
    falla(JSON.stringify(await filas()) === JSON.stringify([n.id]), 'el filtro de etiqueta no deja solo la nota');
    await tocarTexto('urgente' + sufijo, '[aria-label="Filtrar por etiqueta"] button');
    await p.poner('[aria-label="Carpeta"]', trabajo.id);
    falla(JSON.stringify(await filas()) === JSON.stringify([n.id]), 'el filtro de carpeta no muestra lo de su subcarpeta');
    await p.poner('[aria-label="Carpeta"]', '');
    await a.escribir('[aria-label="Buscar notas"]', 'clientes' + sufijo);
    falla((await filas()).includes(n.id) && !(await filas()).includes(otra.id), 'buscar por carpeta no sirvió');
    await a.escribir('[aria-label="Buscar notas"]', 'mamá');
    falla((await filas()).includes(n.id) && !(await filas()).includes(otra.id), 'buscar en el texto no sirvió');
    await a.escribir('[aria-label="Buscar notas"]', '');

    // Copiar (con formato de WhatsApp)
    await p.tocar('[data-nota="' + n.id + '"] button');
    await a.esperar('[data-t=texto]');
    await tocarTexto('📋 Copiar');
    falla((await a.aviso()).includes('Copiado') || (await a.aviso()).includes('copiar'), 'copiar no avisó: ' + (await a.aviso()));
    // Borrar: a la papelera (el confirm se acepta solo) y recuperar
    await p.tocar('[aria-label="Mandar la nota a la papelera"]');
    falla((await notas()).find((x) => x.id === n.id).borrada, 'no fue a la papelera');
    falla(!(await p.cuantos('[data-nota="' + n.id + '"]')), 'sigue en la lista');
    await tocarTexto('🗑 Papelera (1)', 'button', false);
    falla(await p.cuantos('[data-papelera="' + n.id + '"]'), 'no está en la papelera');
    await p.foto('notas-papelera-' + equipo);
    await p.tocar('[data-papelera="' + n.id + '"] button');
    falla(!(await notas()).find((x) => x.id === n.id).borrada, 'no se recuperó');
    await tocarTexto('← Notas');
    // Borrar la carpeta Trabajo: Clientes queda arriba y la nota sigue en Clientes
    await tocarTexto('📁 Carpetas', '.MuiAccordionSummary-root', false);
    await p.tocar('[aria-label="Borrar la carpeta ' + 'Trabajo' + sufijo + '"]');
    const est3 = await p.estado();
    falla(!est3.notasMeta.carpetas.some((x) => x.id === trabajo.id) && !est3.notasMeta.carpetas.find((x) => x.id === clientes.id).padre, 'borrar la carpeta no dejó arriba la de adentro');
    falla(await p.sinDesborde(), 'la pantalla se desborda en ' + equipo);
    await paso('carpetas y papelera ' + equipo);
  }
  console.log('✓ Notas');
};
