// "Hoy": tablero con la mañana, las metas, el entrenamiento que toca y la semana
import { e, avanceMetas } from '../estado.js';
import { iso, fechaLarga } from '../fechas.js';
import { esc, barra, pct } from '../ui.js';
import { cabeceraManana, listaManana } from './manana.js';
import { tarjetaMeta } from './metas.js';
import { diaDeHoy, tarjetaCalentamiento, tarjetaSemana, semanaActual } from './gym.js';
import { estadoFila } from '../gym.js';

function saludo() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

function entrenamiento() {
  const d = diaDeHoy();
  if (!d) {
    return '<section class="tarjeta"><h2>🏋️ Hoy</h2><p class="grande-texto">Día de descanso 😌</p>' +
      '<div class="botones-rapidos"><button type="button" class="boton secundario grande" data-accion="sesion" data-sesion="rodilla">🦵 Rodilla</button>' +
      '<button type="button" class="boton secundario grande" data-accion="sesion" data-sesion="estiramiento-post">🧘 Estirar</button></div></section>';
  }
  const regs = e().semanas[semanaActual()] || {};
  return '<section class="tarjeta"><div class="fila-resumen"><h2>🏋️ ' + esc(d.nombre) + '</h2>' +
    '<button type="button" class="boton primario" data-accion="ir-dia" data-dia="' + d.id + '">Abrir registro →</button></div>' +
    '<ul class="lista-ej">' + d.ejercicios.map((ej) => {
      const colores = ej.filas.map((f) => estadoFila(f, regs[f.id]));
      const hechas = colores.reduce((s, c) => s + Math.min(c.hechas, c.plan), 0), plan = colores.reduce((s, c) => s + c.plan, 0);
      const color = colores.some((c) => c.color === 'sube') ? 'sube' : hechas >= plan ? 'completo' : hechas ? 'falta' : 'vacio';
      return '<li class="c-' + color + '"><span class="punto-color"></span>' + esc(ej.nombre) + '<b>' + hechas + '/' + plan + '</b></li>';
    }).join('') + '</ul></section>' + tarjetaCalentamiento(d);
}

export function vistaHoy() {
  const metas = avanceMetas();
  return '<div class="cab-hoy"><div><h1>' + saludo() + '</h1><p class="sub">' + fechaLarga(iso()) + ' · semana ' + semanaActual() + '</p></div></div>' +
    '<div class="tablero">' +
    '<section class="tarjeta col-manana"><h2>☀️ Primera hora</h2>' + cabeceraManana() + listaManana() + '</section>' +
    '<section class="tarjeta col-metas"><div class="fila-resumen"><h2>🎯 Metas</h2><span class="grande-num">' + pct(metas.total) + '</span></div>' + barra(metas.total) +
    ['agua', 'pasos', 'calorias', 'lectura'].map((k) => tarjetaMeta(k, iso(), true)).join('') +
    '<a class="boton secundario ancho" href="#metas">Registrar pasos, calorías y lectura →</a></section>' +
    '<div class="col-gym">' + entrenamiento() + '</div>' +
    '<section class="tarjeta col-semana"><h2>📅 Semana</h2>' + tarjetaSemana() + '</section>' +
    '</div>';
}
