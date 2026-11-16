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
import dieta from './dieta.mjs';
import administrar from './administrar.mjs';
import libros from './libros.mjs';
import lugares from './lugares.mjs';
import metas from './metas.mjs';
import suplementos from './suplementos.mjs';
import manana from './manana.mjs';
import estudiar from './estudiar.mjs';
import sesiones from './sesiones.mjs';
import hoy from './hoy.mjs';
import progreso from './progreso.mjs';
import editar from './editar.mjs';
import clientes from './clientes.mjs';

export default async (p) => {
  for (const recorrido of [calendario, compras, ventas, finanzas, planb, gym, gymdia, gymextra, recordatorios, dieta, administrar, libros, lugares, metas, suplementos, manana, estudiar, sesiones, hoy, progreso, editar, clientes]) await recorrido(p);
};
