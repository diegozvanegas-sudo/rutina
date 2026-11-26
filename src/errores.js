// 🐞 Errores de este equipo: lo que falla (una pantalla que se cae, la nube que no deja guardar) queda anotado aquí, se ve
// en Ajustes → 🐞 Errores y, con nube, sube para que el administrador lo vea en ⚙️ Administrar → 🐞 Errores (los de todos).
// Solo el mensaje y dónde pasó: nunca datos de la persona. Guardado en este equipo (no en los datos de la app ni en la nube
// de cada quien), los últimos MAX.
const CLAVE = 'rutina-errores', MAX = 40, LARGO = 400;
let oyentes = [];

const leer = () => { try { const l = JSON.parse(localStorage.getItem(CLAVE)); return Array.isArray(l) ? l : []; } catch (err) { return []; } };
const escribir = (l) => { try { localStorage.setItem(CLAVE, JSON.stringify(l.slice(-MAX))); } catch (err) {} };

// Los errores anotados, el más nuevo primero: { ts, origen, mensaje, veces, subido }
export const erroresDelEquipo = () => leer().slice().reverse();

// origen: 'pantalla' (algo que se cayó), 'promesa', 'nube'. El mismo error seguido se cuenta en vez de repetirse
export function anotarError(origen, mensaje, donde = '') {
  const m = String(mensaje || '').slice(0, LARGO).trim();
  if (!m) return;
  const lista = leer(), ultimo = lista[lista.length - 1], ts = Date.now();
  if (ultimo && ultimo.origen === origen && ultimo.mensaje === m) { ultimo.veces = (ultimo.veces || 1) + 1; ultimo.ts = ts; ultimo.subido = false; }
  else lista.push({ ts, origen, mensaje: m, donde: String(donde || '').slice(0, 200), veces: 1, subido: false });
  escribir(lista);
  oyentes.forEach((f) => f());
}
export function borrarErrores() { escribir([]); oyentes.forEach((f) => f()); }
// Devuelve cómo dejar de oír
export function alAnotarError(f) { oyentes.push(f); return () => { oyentes = oyentes.filter((x) => x !== f); }; }

// Los que faltan por subir a la nube (como van a rutina_error_anotar) y marcarlos subidos
export function erroresPorSubir() {
  return leer().filter((x) => !x.subido).slice(-20).map(({ ts, origen, mensaje, donde, veces }) => ({ ts, origen, mensaje, donde, veces }));
}
export function marcarSubidos(hasta) { const l = leer(); l.forEach((x) => { if (x.ts <= hasta) x.subido = true; }); escribir(l); }

// Texto para copiar y mandar (WhatsApp, correo)
export const textoErrores = (lista = erroresDelEquipo()) => lista.map((x) =>
  new Date(x.ts).toLocaleString('es-CO') + ' · ' + x.origen + (x.veces > 1 ? ' ×' + x.veces : '') + '\n' + x.mensaje + (x.donde ? '\n' + x.donde : '')).join('\n\n');

// Lo que se cae sin que nadie lo atrape. Los de extensiones del navegador y los «Script error.» sin datos no sirven: fuera
export function iniciarErrores() {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (ev) => {
    const m = ev.message || (ev.error && ev.error.message) || '';
    if (!m || /^Script error\.?$/i.test(m) || /extension:\/\//.test(ev.filename || '')) return;
    anotarError('pantalla', m, (location.hash || '#') + ' · ' + String(ev.filename || '').replace(/^.*\//, '') + ':' + (ev.lineno || 0));
  });
  window.addEventListener('unhandledrejection', (ev) => {
    const r = ev.reason, m = (r && r.message) || String(r || '');
    // Sin internet un fetch falla y ya se avisa en ☁️; no es un error de la app
    if (!m || (!navigator.onLine && /fetch|network|load failed/i.test(m))) return;
    anotarError('promesa', m, location.hash || '#');
  });
}
