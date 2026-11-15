// Puente entre la app de antes y las pantallas de React: main.js monta aquí la pantalla migrada dentro de #vista.
// React y la pantalla se descargan solo al abrirla (las pantallas de antes no cargan React)
let raiz = null, turno = 0;
export function desmontarReact() {
  turno++;
  if (raiz) { raiz.unmount(); raiz = null; }
}
// props: lo que se le pasa a la pantalla (por ejemplo la pestaña de un enlace como #compras/deseos)
export async function montarReact(el, cargar, props = null) {
  desmontarReact();
  const mio = turno;
  const [{ createRoot }, { createElement }, proveedor, pantalla] = await Promise.all([import('react-dom/client'), import('react'), import('./Proveedor.tsx'), cargar()]);
  // Si mientras cargaba se cambió de pantalla, esta ya no va
  if (mio !== turno || !el.isConnected) return;
  raiz = createRoot(el);
  // Toda pantalla va dentro del tema de la app (Material UI con los colores de siempre)
  raiz.render(createElement(proveedor.default, null, createElement(pantalla.default, props)));
}
