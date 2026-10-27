// "Hoy": tablero con la mañana, las metas, el entrenamiento que toca y la semana
import { e, avanceMetas, hayFutbol } from '../estado.js';
import { iso, fechaLarga } from '../fechas.js';
import { esc, barra, pct } from '../ui.js';
import { cabeceraManana, listaManana } from './manana.js';
import { tarjetaMeta } from './metas.js';
import { diaDeHoy, tarjetaCalentamiento, tarjetaSemana, semanaActual } from './gym.js';
import { estadoFila } from '../gym.js';
import { tarjetaComidasHoy } from './dieta.js';
import { alertas } from './recordatorios.js';
import { puntajeDia } from '../progreso.js';
import { tarjetasLibrosHoy } from './libros.js';
import { tarjetaSuenoPeso, tarjetaPartido, fechaPartidoPendiente, tarjetaFoco } from './registro.js';

function saludo() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

// Partido de noche: qué comer y cuándo, calentar antes y estirar después
function partido() {
  return '<section class="tarjeta futbol"><h2>⚽ Fútbol esta noche</h2><ul class="consejos">' +
    ['Comida pre-partido 2-3 h antes: arroz y pollo, poca grasa y poca fibra.', 'Plátano 1 h antes y agua todo el día; si hace calor o juegas más de 60 min, electrolitos.',
      'Calienta 10-12 min antes de jugar, de suave a rápido.', 'Después: cena con proteína y carbos, y estira suave.'].map((t) => '<li>' + t + '</li>').join('') + '</ul>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario grande" data-accion="sesion" data-sesion="calentamiento-futbol">▶ Calentamiento fútbol</button>' +
    '<button type="button" class="boton secundario grande" data-accion="sesion" data-sesion="estiramiento-post">🧘 Estirar después</button></div></section>';
}

function entrenamiento() {
  // El partido de hoy (o el de ayer si no se anotó) se registra junto al entreno
  const pendiente = fechaPartidoPendiente(), d = diaDeHoy(), futbol = (hayFutbol() ? partido() : '') + (pendiente ? tarjetaPartido(pendiente) : '');
  if (!d && futbol) return futbol;
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
    }).join('') + '</ul></section>' + futbol + tarjetaCalentamiento(d);
}

export function vistaHoy() {
  const metas = avanceMetas(), avisos = alertas(), p = puntajeDia();
  return '<div class="cab-hoy"><div><h1>' + saludo() + '</h1><p class="sub">' + fechaLarga(iso()) + ' · semana ' + semanaActual() + '</p></div>' +
    '<a class="puntaje-hoy" href="#progreso" title="Puntaje del día: mañana, metas, gym y dieta"><b>' + (p ? p.total : 0) + '</b><small>/100 hoy</small></a></div>' +
    (avisos.length ? '<a class="tarjeta avisos-hoy" href="#recordatorios"><b>🔔 ' + avisos.length + (avisos.length === 1 ? ' recordatorio' : ' recordatorios') + '</b><span>' +
      avisos.slice(0, 3).map((a) => esc(a.icono + ' ' + a.nombre) + (a.estado === 'vencido' ? ' (vencido)' : '')).join(' · ') + '</span></a>' : '') +
    tarjetaFoco() + tarjetasLibrosHoy() +
    '<div class="tablero">' +
    '<section class="tarjeta col-manana"><h2>☀️ Primera hora</h2>' + cabeceraManana() + listaManana() + '</section>' +
    '<section class="tarjeta col-metas"><div class="fila-resumen"><h2>🎯 Metas</h2><span class="grande-num">' + pct(metas.total) + '</span></div>' + barra(metas.total) +
    ['agua', 'pasos', 'calorias', 'lectura'].map((k) => tarjetaMeta(k, iso(), true)).join('') +
    '<a class="boton secundario ancho" href="#metas">Registrar pasos, calorías y lectura →</a></section>' +
    '<div class="col-gym">' + entrenamiento() + '</div>' +
    tarjetaSuenoPeso() +
    '<section class="tarjeta col-dieta"><div class="fila-resumen"><h2>🥗 Comidas</h2><a href="#dieta" class="nota-corta">Ver plan →</a></div>' + tarjetaComidasHoy(true) + '</section>' +
    '<section class="tarjeta col-semana"><h2>📅 Semana</h2>' + tarjetaSemana() + '</section>' +
    '</div>';
}
