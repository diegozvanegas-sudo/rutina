// Trabajador de 🎙️ Audio a texto (src/voz.js): Whisper con transformers.js, en el propio equipo. La librería se baja de
// jsDelivr con la versión fija y el modelo de Hugging Face la primera vez; los dos quedan guardados en el navegador
// (la librería en el service worker y el modelo en su caché), así después funciona sin internet.
const LIBRERIA = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2';
let tubo = null, cargado = null;

self.onmessage = async ({ data }) => {
  const { id, audio, modelo } = data;
  try {
    const { pipeline, env } = await import(/* @vite-ignore */ LIBRERIA);
    env.allowLocalModels = false;
    if (!tubo || cargado !== modelo) {
      tubo = null;
      tubo = await pipeline('automatic-speech-recognition', modelo, {
        progress_callback: (p) => { if (p.status === 'progress' || p.status === 'done' || p.status === 'ready') self.postMessage({ id, tipo: 'progreso', p: { status: p.status, file: p.file, progress: p.progress } }); },
      });
      cargado = modelo;
    }
    self.postMessage({ id, tipo: 'escuchando' });
    const r = await tubo(audio, { language: 'spanish', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 });
    self.postMessage({ id, tipo: 'listo', texto: String((r && r.text) || '').trim() });
  } catch (err) {
    self.postMessage({ id, tipo: 'error', error: /fetch|network|Failed to/i.test(String(err && err.message)) ? 'No se pudo bajar el modelo. Revisa tu internet e inténtalo de nuevo.' : 'No se pudo pasar a texto: ' + String((err && err.message) || err) });
  }
};
