// Todos los recorridos de punta a punta, uno tras otro (npm run e2e -- <carpeta de capturas>).
// Cada pantalla migrada a React suma aquí el suyo.
import calendario from './calendario.mjs';
import compras from './compras.mjs';
import ventas from './ventas.mjs';

export default async (p) => {
  for (const recorrido of [calendario, compras, ventas]) await recorrido(p);
};
