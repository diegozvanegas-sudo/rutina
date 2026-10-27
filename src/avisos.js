// Avisos del celular (notificaciones). Una página web solo puede avisar mientras la app está abierta o recién cerrada:
// para que avise siempre, Ajustes descarga los mismos avisos como eventos del calendario (registro.js → calendarioIcs).
// Se activan por equipo (localStorage), no se suben a la nube.
import { e } from './estado.js';
import { iso } from './fechas.js';
import { avisosPendientes } from './registro.js';

const CLAVE = 'rutina-avisos', MOSTRADOS = 'rutina-avisos-mostrados';
const leer = (k, def) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch (err) { return def; } };
const escribir = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (err) {} };

export const soportados = () => typeof window !== 'undefined' && 'Notification' in window;
export const avisosActivos = () => soportados() && Notification.permission === 'granted' && leer(CLAVE, false) === true;

export async function activarAvisos() {
  if (!soportados()) throw new Error('Este navegador no permite avisos');
  const permiso = await Notification.requestPermission();
  if (permiso !== 'granted') throw new Error(permiso === 'denied' ? 'Los avisos están bloqueados: actívalos en los ajustes del navegador para esta página' : 'No se dio permiso');
  escribir(CLAVE, true);
  await avisar('🔔 Avisos activados', 'Así se verán los avisos de Rutina.');
}
export function desactivarAvisos() { escribir(CLAVE, false); }

// En Android solo funcionan desde el service worker; en el computador sirve también el constructor
export async function avisar(titulo, cuerpo, etiqueta = titulo) {
  if (!soportados() || Notification.permission !== 'granted') return;
  const opciones = { body: cuerpo, tag: etiqueta, icon: 'icons/icono-192.png', badge: 'icons/icono-192.png', vibrate: [200, 100, 200] };
  try {
    const reg = 'serviceWorker' in navigator && await navigator.serviceWorker.getRegistration();
    if (reg) { await reg.showNotification(titulo, opciones); return; }
  } catch (err) {}
  try { new Notification(titulo, opciones); } catch (err) {}
}

// Revisa los avisos del día; cada uno se muestra una sola vez por día y por equipo
export function revisarAvisos(ahora = new Date()) {
  if (!avisosActivos()) return;
  const mostrados = leer(MOSTRADOS, {}), hoy = iso(ahora);
  for (const a of avisosPendientes(e().config, ahora, mostrados)) {
    // La pastilla ya marcada no se recuerda
    const d = e().dias[hoy];
    if (a.id === 'pastilla' && d && d.habitos && Object.keys(d.habitos).some((id) => (e().habitos.find((h) => h.id === id) || {}).tipo === 'pastilla')) { mostrados[hoy + ':' + a.id] = true; continue; }
    if (a.id === 'como-fue' && d && d.partido) { mostrados[hoy + ':' + a.id] = true; continue; }
    mostrados[hoy + ':' + a.id] = true;
    avisar(a.icono + ' Rutina', a.texto, a.id);
  }
  // Solo se guardan los de hoy (no crece sin fin)
  escribir(MOSTRADOS, Object.fromEntries(Object.entries(mostrados).filter(([k]) => k.startsWith(hoy))));
}

export function iniciarAvisos() {
  if (!soportados()) return;
  revisarAvisos();
  setInterval(revisarAvisos, 20000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') revisarAvisos(); });
}
