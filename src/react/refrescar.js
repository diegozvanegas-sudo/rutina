// Pedirle a la pantalla de React que se vuelva a pintar cuando cambió algo que no es del estado guardado
// (por ejemplo, un enlace que abre otra pestaña de la misma sección). main.js lo llama; usarEstado.ts lo escucha
let pintar = null;
export const alRefrescar = (f) => { pintar = f; };
export const refrescarReact = () => { if (pintar) pintar(); };
