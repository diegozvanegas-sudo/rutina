// "Hoy": tablero con la mañana, las metas, el entrenamiento que toca y la semana
import { e, avanceMetas, hayFutbol, elegirPlantilla } from '../estado.js';
import { iso, fechaLarga } from '../fechas.js';
import { esc, barra, pct, botonSesion, registrar } from '../ui.js';
import { visibles } from '../orden.js';
import { configurada, nube } from '../nube.js';
import { cabeceraManana, listaManana } from './manana.js';
import { tarjetaMeta } from './metas.js';
import { diaDeHoy, tarjetaCalentamiento, tarjetaSemana, semanaActual } from './gym.js';
import { estadoFila } from '../gym.js';
import { tarjetaComidasHoy } from './dieta.js';
import { alertas } from './recordatorios.js';
import { puntajeDia } from '../progreso.js';
import { tarjetasLibrosHoy } from './libros.js';
import { tarjetaEstandares } from './vida.js';
import { tarjetaSuenoPeso, tarjetaPartido, fechaPartidoPendiente, tarjetaFoco } from './registro.js';
import { tarjetaPlataHoy } from './finanzas.js';
import { tarjetaCierreHoy } from './sesiones.js';

function saludo() {
  const h = new Date().getHours();
  const nombre = (e().config.nombre || '').trim();
  return (h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches') + (nombre ? ', ' + esc(nombre) : '');
}
// Botones de las sesiones elegidas en Editar > Rutina (la primera resaltada si se pide)
const sesionesDe = (ids, primera = false) => '<div class="botones-rapidos">' + (ids || []).map((id, i) => botonSesion(id, primera && i === 0 ? 'primario' : 'secundario')).join('') + '</div>';

// Partido de noche: qué comer y cuándo, calentar antes y estirar después
function partido() {
  return '<section class="tarjeta futbol"><h2>⚽ Fútbol esta noche</h2><ul class="consejos">' +
    ['Comida pre-partido 2-3 h antes: arroz y pollo, poca grasa y poca fibra.', 'Plátano 1 h antes y agua todo el día; si hace calor o juegas más de 60 min, electrolitos.',
      'Calienta 10-12 min antes de jugar, de suave a rápido.', 'Después: cena con proteína y carbos, y estira suave.'].map((t) => '<li>' + t + '</li>').join('') + '</ul>' +
    sesionesDe(e().config.sesionesPartido, true) + '<div class="botones-rapidos">' + botonSesion('maletin-partido', 'secundario', 'Maletín del partido') + '</div></section>';
}

function entrenamiento() {
  // El partido de hoy (o el de ayer si no se anotó) se registra junto al entreno
  const pendiente = fechaPartidoPendiente(), d = diaDeHoy(), futbol = (hayFutbol() ? partido() : '') + (pendiente ? tarjetaPartido(pendiente) : '');
  if (!d && futbol) return futbol;
  if (!d) {
    return '<section class="tarjeta"><h2>🏋️ Hoy</h2><p class="grande-texto">Día de descanso 😌</p>' +
      (e().rutina.length ? '' : '<p class="nota-corta">Aún no tienes rutina. <a href="#editar/rutina">Arma tus días →</a></p>') +
      sesionesDe(e().config.sesionesDescanso) + '</section>';
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

// Usuario nuevo: con qué empezar (todo se puede cambiar después en Editar)
function bienvenida() {
  if (!e().bienvenida || (configurada && !nube.ultima)) return '';
  return '<section class="tarjeta bienvenida"><h2>👋 Bienvenido</h2><p>¿Cómo quieres empezar? Todo se puede cambiar, mover o borrar después en ✏️ Editar.</p>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario grande" data-accion="plantilla" data-vacia="">📋 Con el ejemplo (rutina, hábitos y fútbol)</button>' +
    '<button type="button" class="boton secundario grande" data-accion="plantilla" data-vacia="1">🧹 Vacío: armo lo mío</button></div></section>';
}

// Cada tarjeta del tablero; el orden y cuáles se ven los elige el usuario (Editar > Pantallas)
const TARJETAS = {
  foco: () => tarjetaFoco(),
  libros: () => tarjetasLibrosHoy(),
  manana: () => '<section class="tarjeta col-manana"><h2>☀️ Primera hora</h2>' + cabeceraManana() + listaManana() + '</section>',
  metas: () => {
    const metas = avanceMetas(), ks = metas.activas;
    if (!ks.length) return '';
    return '<section class="tarjeta col-metas"><div class="fila-resumen"><h2>🎯 Metas</h2><span class="grande-num">' + pct(metas.total) + '</span></div>' + barra(metas.total) +
      ks.map((k) => tarjetaMeta(k, iso(), true)).join('') + '<a class="boton secundario ancho" href="#metas">Registrar metas →</a></section>';
  },
  gym: () => '<div class="col-gym">' + entrenamiento() + '</div>',
  suenoPeso: () => tarjetaSuenoPeso(),
  estandares: () => tarjetaEstandares(),
  dieta: () => '<section class="tarjeta col-dieta"><div class="fila-resumen"><h2>🥗 Comidas</h2><a href="#dieta" class="nota-corta">Ver plan →</a></div>' + tarjetaComidasHoy(true) + '</section>',
  plata: () => tarjetaPlataHoy(),
  cierre: () => tarjetaCierreHoy(),
  semana: () => '<section class="tarjeta col-semana"><h2>📅 Semana</h2>' + tarjetaSemana() + '</section>',
};
// Foco y libros van arriba, a lo ancho; las demás en el tablero de dos columnas
const ANCHAS = ['foco', 'libros'];

export function vistaHoy() {
  const avisos = alertas(), p = puntajeDia(), ids = visibles(e().config, 'hoy');
  return '<div class="cab-hoy"><div><h1>' + saludo() + '</h1><p class="sub">' + fechaLarga(iso()) + ' · semana ' + semanaActual() + '</p></div>' +
    '<a class="puntaje-hoy" href="#progreso" title="Puntaje del día: mañana, metas, gym y dieta"><b>' + (p ? p.total : 0) + '</b><small>/100 hoy</small></a></div>' +
    bienvenida() +
    (avisos.length ? '<a class="tarjeta avisos-hoy" href="#recordatorios"><b>🔔 ' + avisos.length + (avisos.length === 1 ? ' recordatorio' : ' recordatorios') + '</b><span>' +
      avisos.slice(0, 3).map((a) => esc(a.icono + ' ' + a.nombre) + (a.estado === 'vencido' ? ' (vencido)' : '')).join(' · ') + '</span></a>' : '') +
    ids.filter((k) => ANCHAS.includes(k)).map((k) => TARJETAS[k]()).join('') +
    '<div class="tablero">' + ids.filter((k) => !ANCHAS.includes(k)).map((k) => TARJETAS[k]()).join('') + '</div>' +
    '<p class="nota-corta centro"><a href="#editar/pantallas">↕ Ordenar o esconder tarjetas</a></p>';
}

registrar({
  plantilla({ vacia }) { elegirPlantilla(!!vacia); },
});
