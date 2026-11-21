// Recorrido de 🎙️ Audio a texto con clics reales, en computador y celular: la sección en el menú, dictar (con un
// reconocimiento de voz de mentira que "oye" dos frases), guardar la nota, pasar un audio a texto (un .wav hecho aquí y
// Whisper de mentira, que avisa que baja el modelo y luego escucha), abrir una nota, editarla, buscar y borrar con deshacer.
// El Whisper de verdad no se prueba aquí (bajaría 80 MB): ver la prueba aparte con un audio real.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/voz.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

// Dicta "hola esto es una prueba" y luego "segunda frase" (con un resultado parcial antes)
const DICTADO = `(() => {
  class Falso {
    start() { window.__dictando = this; setTimeout(() => this.oir([['hola esto es una prueba', true]]), 100); setTimeout(() => this.oir([['hola esto es una prueba', true], ['segunda', false]]), 200); setTimeout(() => this.oir([['hola esto es una prueba', true], ['segunda frase', true]], 1), 300); }
    oir(lista, desde = 0) { const results = lista.map(([t, f]) => Object.assign([{ transcript: t }], { isFinal: f })); this.onresult && this.onresult({ resultIndex: desde, results }); }
    stop() { setTimeout(() => this.onend && this.onend(), 20); }
    abort() { this.stop(); }
  }
  window.SpeechRecognition = Falso; window.webkitSpeechRecognition = Falso;
})()`;
// Whisper de mentira: primero "baja" el modelo y después devuelve un texto que dice cuántos segundos oyó
const WHISPER = `window.__vozPrueba = async (muestras, modelo, avance) => {
  for (const pr of [20, 60, 100]) { avance({ tipo: 'progreso', p: { status: 'progress', file: 'modelo.onnx', progress: pr } }); await new Promise((r) => setTimeout(r, 120)); }
  avance({ tipo: 'escuchando' }); await new Promise((r) => setTimeout(r, 150));
  return 'Audio de ' + Math.round(muestras.length / 16000) + ' segundos con el modelo ' + modelo + ': comprar huevos y llamar a mamá';
}`;
// Un .wav de 3 s (un tono) metido en el campo de archivo, como si se eligiera
const ELEGIR_WAV = `(() => {
  const sr = 16000, n = sr * 3, b = new ArrayBuffer(44 + n * 2), v = new DataView(b), t = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  t(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); t(8, 'WAVE'); t(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); t(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.sin(i / 8) * 8000, true);
  const dt = new DataTransfer(); dt.items.add(new File([b], 'nota de voz.wav', { type: 'audio/wav' }));
  const inp = document.querySelector('input[type=file][aria-label="Audio para pasar a texto"]'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
})()`;

export default async (p) => {
  const a = ayudas(p, 'Audio a texto'), { paso, falla, tocarTexto } = a;
  const notas = async () => (((await p.estado()) || {}).voz || {}).notas || [];
  const hasta = async (cond, ms = 6000) => { for (let t = 0; t < ms; t += 100) { if (await cond()) return true; await a.dormir(100); } return false; };

  for (const equipo of ['computador', 'celular']) {
    await p[equipo]();
    await p.ev(DICTADO + ';' + WHISPER);
    // Audio a texto está en 🌱 Mente y crecimiento, que arranca cerrado
    if (equipo === 'computador') { await p.ev(`(()=>{const b=document.querySelector('#lateral [data-accion=barra-grupo][data-g=mente]');if(b&&b.getAttribute('aria-expanded')!=='true')b.click()})()`); await a.dormir(300); falla(await p.cuantos('#lateral a[href="#voz"]'), 'Audio a texto no está en el menú'); }
    await p.ir('voz');
    await a.esperar('#vista h1');
    falla((await a.texto()).includes('Audio a texto'), 'no abrió la sección');
    const antes = (await notas()).length;

    // 🎤 Dictar: se ve lo que va oyendo y se guarda como nota
    await tocarTexto('🎤 Empezar a dictar');
    falla(await hasta(async () => (await a.texto()).includes('hola esto es una prueba segunda frase')), 'no se ve lo dictado: ' + (await a.texto()).slice(0, 300));
    await p.foto('voz-dictando-' + equipo);
    await tocarTexto('✓ Guardar nota');
    let l = await notas();
    falla(l.length === antes + 1 && l[0].texto === 'hola esto es una prueba segunda frase' && l[0].origen === 'dictado', 'no guardó el dictado: ' + JSON.stringify(l[0]));
    falla(!(await p.cuantos('[data-t=dictado]')), 'el cuadro del dictado no se limpió');
    await paso('dictado ' + equipo);

    // 🎧 Pasar un audio: baja el modelo (con su avance), escucha y queda la nota con su duración
    await p.ev(ELEGIR_WAV);
    falla(await hasta(async () => (await a.texto()).includes('Bajando el modelo')), 'no avisó que baja el modelo');
    await p.foto('voz-bajando-' + equipo);
    falla(await hasta(async () => (await notas()).length === antes + 2, 8000), 'no pasó el audio a texto');
    l = await notas();
    falla(l[0].texto.startsWith('Audio de 3 segundos con el modelo base') && l[0].origen === 'audio' && l[0].seg === 3 && l[0].nombre === 'nota de voz.wav', 'la nota del audio quedó mal: ' + JSON.stringify(l[0]));
    falla(!(await p.cuantos('[data-t=trabajo]')), 'el aviso de trabajo no se quitó');
    await paso('audio ' + equipo);

    // 📝 Abrir la nota (una fila), editarla y verla guardada
    await p.tocar(`[data-nota="${l[0].id}"] button[aria-expanded]`);
    await a.escribir('[aria-label="Texto de la nota"]', 'Comprar huevos y llamar a mamá el domingo');
    await a.salir();
    falla((await notas())[0].texto === 'Comprar huevos y llamar a mamá el domingo', 'no guardó lo editado');
    falla(await p.sinDesborde(), 'la pantalla se desborda en ' + equipo);
    await p.foto('voz-nota-' + equipo);

    // 🗑 Borrar con deshacer
    await p.tocar(`[data-nota="${l[0].id}"] [aria-label="Borrar la nota"]`);
    falla((await notas()).length === antes + 1, 'no borró la nota');
    await tocarTexto('Deshacer', 'button', false);
    falla((await notas()).length === antes + 2, 'deshacer no devolvió la nota');
    await paso('notas ' + equipo);
  }

  // 🔎 Con más de 5 notas aparece el buscador
  await p.ev(`(async () => { const v = await import('/src/voz.js'); for (let i = 0; i < 4; i++) v.nuevaNota('nota de relleno ' + i, 'dictado'); })()`);
  await a.dormir(300);
  await a.escribir('[aria-label="Buscar en tus notas"]', 'domingo');
  await a.dormir(200);
  falla(await p.cuantos('[data-nota]') === 2, 'el buscador no filtró: ' + await p.cuantos('[data-nota]'));
  await p.foto('voz-buscar-celular');
  console.log('✓ Audio a texto');
};
