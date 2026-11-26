// Que ningún equipo se quede con una versión vieja de la app abierta por días (23 nov 2026: una pestaña vieja subió su
// copia encima de lo nuevo). El service worker (vite-plugin-pwa, registerType autoUpdate) instala la versión nueva y
// recarga la página en cuanto la encuentra; aquí se le pide que la busque, y no solo al abrir la app:
// - al volver a la app (cambiar de app, encender la pantalla): nadie está escribiendo, recargar no corta nada
// - cada hora con la app a la vista, si no hay un campo con el cursor (para no borrar lo que se está escribiendo)
// - ya, si la nube dice que esta versión es vieja (nube.js)
import { registerSW } from 'virtual:pwa-register';

let registro = null, ultima = 0;
const HORA = 60 * 60 * 1000;

function escribiendo() {
  const a = document.activeElement;
  return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
}

// Busca una versión nueva (si la hay, el service worker la instala y la página se recarga sola)
export function buscarVersionNueva(forzar = false) {
  if (!registro || (!forzar && Date.now() - ultima < 5 * 60 * 1000)) return;
  if (!navigator.onLine) return;
  ultima = Date.now();
  registro.update().catch(() => {});
}

export function iniciarActualizar() {
  registerSW({
    immediate: true,
    onRegisteredSW(url, r) {
      if (!r) return;
      registro = r;
      setInterval(() => { if (document.visibilityState === 'visible' && !escribiendo()) buscarVersionNueva(); }, HORA);
    },
  });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') buscarVersionNueva(); });
  window.addEventListener('online', () => buscarVersionNueva());
}
