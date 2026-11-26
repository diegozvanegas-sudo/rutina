// Puente entre la app de antes y las pantallas de React: main.js monta aquí la pantalla migrada dentro de #vista.
// React y la pantalla se descargan solo al abrirla (las pantallas de antes no cargan React)
import { anotarError } from '../errores.js';

let raiz = null, turno = 0;
export function desmontarReact() {
  turno++;
  if (raiz) { raiz.unmount(); raiz = null; }
}
// props: lo que se le pasa a la pantalla (por ejemplo la pestaña de un enlace como #compras/deseos)
export async function montarReact(el, cargar, props = null) {
  desmontarReact();
  const mio = turno;
  const [{ createRoot }, { createElement, Fragment }, proveedor, avisos, pantalla] = await Promise.all([import('react-dom/client'), import('react'), import('./Proveedor.tsx'), import('./armazon/Avisos.tsx'), cargar()]);
  // Si mientras cargaba se cambió de pantalla, esta ya no va
  if (mio !== turno || !el.isConnected) return;
  // 🐞 Si la pantalla se cae, queda anotado (src/errores.js) y en vez de una página en blanco se dice qué hacer
  raiz = createRoot(el, {
    onUncaughtError(error) {
      anotarError('pantalla', (error && error.message) || String(error), (location.hash || '#') + ' · ' + String((error && error.stack) || '').split('\n').slice(1, 3).join(' ').trim());
      setTimeout(() => {
        if (!el.isConnected || el.childElementCount) return;
        el.innerHTML = '<div role="alert" style="padding:24px 16px;line-height:1.5"><b>Algo falló en esta pantalla.</b><br>Tus datos están bien. Prueba otra sección del menú o recarga la app. Queda anotado en Ajustes → 🐞 Errores.<br><br><button type="button" onclick="location.reload()" style="min-height:44px;padding:0 16px;border-radius:10px">↻ Recargar</button></div>';
      }, 0);
    },
  });
  // Toda pantalla va dentro del tema de la app (Material UI con los colores de siempre), con los avisos de arriba
  // (Ver como, recordatorios de hoy) encima
  raiz.render(createElement(proveedor.default, null, createElement(Fragment, null, createElement(avisos.default), createElement(pantalla.default, props))));
}

// Piezas fijas del armazón (el menú lateral): se montan una sola vez, cada una con su raíz, y no se desmontan al
// cambiar de pantalla
export async function montarFijo(el, cargar) {
  const [{ createRoot }, { createElement }, proveedor, pieza] = await Promise.all([import('react-dom/client'), import('react'), import('./Proveedor.tsx'), cargar()]);
  createRoot(el).render(createElement(proveedor.default, null, createElement(pieza.default)));
}
