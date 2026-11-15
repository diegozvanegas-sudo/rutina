// Puente entre la app de antes y las pantallas de React: main.js monta aquí la pantalla migrada dentro de #vista.
// React y la pantalla se descargan solo al abrirla (las pantallas de antes no cargan React)
let raiz = null, turno = 0;
export function desmontarReact() {
  turno++;
  if (raiz) { raiz.unmount(); raiz = null; }
}
export async function montarReact(el, cargar) {
  desmontarReact();
  const mio = turno;
  const [{ createRoot }, { createElement }, pantalla] = await Promise.all([import('react-dom/client'), import('react'), cargar()]);
  // Si mientras cargaba se cambió de pantalla, esta ya no va
  if (mio !== turno || !el.isConnected) return;
  raiz = createRoot(el);
  raiz.render(createElement(pantalla.default));
}
