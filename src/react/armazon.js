// Puente entre el armazón de la app (main.js) y sus piezas de React (react/armazon/*.tsx). main.js decide qué se ve
// (secciones permitidas, la actual, permisos) y pone aquí de dónde leerlo; React solo lo pinta.
let lateral = () => null;
/** main.js: la función que arma los datos del menú lateral (null = no se muestra: sin sesión o bloqueada) */
export const ponerLateral = (f) => { lateral = f; };
export const datosLateral = () => lateral();
let sesion = () => ({ modo: null });
/** main.js: sin sesión ('entrar') o con la app bloqueada ('bloqueada') no se ve la app, solo src/react/armazon/Sesion.tsx */
export const ponerSesion = (f) => { sesion = f; };
export const datosSesion = () => sesion();
export const modoSesion = () => sesion().modo;
