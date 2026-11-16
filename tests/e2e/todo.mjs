// Todos los recorridos de punta a punta, uno tras otro (npm run e2e -- <carpeta de capturas>).
// Cada pantalla migrada a React suma aquí el suyo.
import calendario from './calendario.mjs';
import compras from './compras.mjs';
import ventas from './ventas.mjs';
import finanzas from './finanzas.mjs';
import planb from './planb.mjs';
import gym from './gym.mjs';
import gymdia from './gymdia.mjs';
import gymextra from './gymextra.mjs';
import recordatorios from './recordatorios.mjs';

export default async (p) => {
  for (const recorrido of [calendario, compras, ventas, finanzas, planb, gym, gymdia, gymextra, recordatorios]) await recorrido(p);
};
