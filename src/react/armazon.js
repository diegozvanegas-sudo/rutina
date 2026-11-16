// Puente entre el armazón de la app (main.js) y sus piezas de React (react/armazon/*.tsx). main.js decide qué se ve
// (secciones permitidas, la actual, permisos) y pone aquí de dónde leerlo; React solo lo pinta.
let lateral = () => null;
/** main.js: la función que arma los datos del menú lateral (null = no se muestra: sin sesión o bloqueada) */
export const ponerLateral = (f) => { lateral = f; };
export const datosLateral = () => lateral();
