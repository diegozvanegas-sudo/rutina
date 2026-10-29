// Calendario: mes gregoriano (lunes a domingo) con festivos de Colombia, fases de la luna, equinoccios y solsticios,
// y lo que toca cada día en la rutina (gym y fútbol). Tocar un día muestra su detalle.
import { e, repintar, hayFutbol } from '../estado.js';
import { iso, fechaLarga, fechaCorta, diaSemana, diasEntre } from '../fechas.js';
import { esc, registrar } from '../ui.js';
import {
  cuadricula, otroMes, festivo, proximosFestivos, fasesEntre, lunaDelDia, estacionesDe, diaDelAno, diasDelAno, semanaIso, esBisiesto, diaJuliano,
} from '../calendario.js';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let mes = iso().slice(0, 7), elegido = iso();

const gymDe = (f) => e().rutina.find((x) => x.diaSemana === diaSemana(f)) || null;
const horaDe = (ms) => new Date(ms).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
const enDias = (f) => { const n = diasEntre(iso(), f); return n === 0 ? 'hoy' : n === 1 ? 'mañana' : n > 0 ? 'en ' + n + ' días' : 'hace ' + -n + ' días'; };

function celda(f, fases, estaciones) {
  const fuera = f.slice(0, 7) !== mes, fes = festivo(f), fase = fases.find((x) => x.fecha === f), est = estaciones.find((x) => x.fecha === f);
  const marcas = (fase ? fase.icono : '') + (est ? est.icono : '') + (hayFutbol(f) ? '⚽' : '') + (gymDe(f) ? '<span class="cal-gym" aria-hidden="true"></span>' : '');
  const titulo = [fechaLarga(f), fes, fase && fase.nombre, est && est.nombre, hayFutbol(f) && 'Fútbol', gymDe(f) && 'Gym: ' + gymDe(f).nombre].filter(Boolean).join(' · ');
  return '<button type="button" class="cal-dia' + (fuera ? ' fuera' : '') + (f === iso() ? ' hoy' : '') + (f === elegido ? ' elegido' : '') +
    (fes || diaSemana(f) === 7 ? ' festivo' : '') + '" data-accion="cal-dia" data-f="' + f + '" aria-label="' + esc(titulo) + '"' + (f === elegido ? ' aria-pressed="true"' : '') + '>' +
    '<span class="cal-num">' + Number(f.slice(8)) + '</span><span class="cal-marcas">' + marcas + '</span></button>';
}

function detalle(f) {
  const a = Number(f.slice(0, 4)), luna = lunaDelDia(f), fes = festivo(f), gym = gymDe(f), si = semanaIso(f);
  const est = estacionesDe(a).find((x) => x.fecha === f);
  const toca = [hayFutbol(f) && '⚽ Fútbol en la noche', gym && '🏋️ ' + esc(gym.nombre)].filter(Boolean);
  return '<section class="tarjeta cal-detalle"><div class="fila-resumen"><h2>' + fechaLarga(f) + ' de ' + a + '</h2><span class="nota-corta">' + enDias(f) + '</span></div>' +
    (fes ? '<p class="cal-festivo">🇨🇴 Festivo: <b>' + fes + '</b></p>' : '') +
    (est ? '<p>' + est.icono + ' <b>' + est.nombre + '</b> a las ' + horaDe(est.ms) + ' · ' + est.nota + '</p>' : '') +
    '<p>' + luna.icono + ' <b>' + luna.nombre + '</b>' + (luna.principal ? ' a las ' + horaDe(luna.principal.ms) : '') + ' · ' + luna.luz + ' % iluminada · ' +
    Math.floor(luna.edad) + ' días desde la luna nueva</p>' +
    '<p>' + (toca.length ? 'Toca: ' + toca.join(' · ') : '😌 Día de descanso en la rutina') + '</p>' +
    '<ul class="lista-pesos"><li><span>Día del año</span><b>' + diaDelAno(f) + ' de ' + diasDelAno(a) + '</b></li>' +
    '<li><span>Semana ISO</span><b>' + si.semana + (si.ano !== a ? ' de ' + si.ano : '') + '</b></li>' +
    '<li><span>Año ' + a + '</span><b>' + (esBisiesto(a) ? 'bisiesto (366 días)' : 'normal (365 días)') + '</b></li>' +
    '<li><span>Día juliano (astronomía)</span><b>' + Math.floor(diaJuliano(Date.UTC(a, Number(f.slice(5, 7)) - 1, Number(f.slice(8))) + 43200000)).toLocaleString('es-CO') + '</b></li></ul></section>';
}

// Para qué sirve cada calendario y qué marca de verdad la naturaleza
const EXPLICACION = '<section class="tarjeta cal-explica"><h2>🌍 ¿Qué calendario rige el mundo?</h2>' +
  '<p>El <b>gregoriano</b>: es el estándar civil internacional (norma ISO 8601) y lo usan los gobiernos, la ciencia, la aviación, los bancos e internet. ' +
  'Unos pocos países llevan otro como oficial (Irán y Afganistán el solar persa, Etiopía el etíope, Nepal el Vikram Samvat) y muchas culturas guardan ' +
  'el suyo para fiestas religiosas (islámico, hebreo, chino, hindú), pero todos convierten al gregoriano para tratar con el resto del mundo.</p>' +
  '<details><summary>Lo único que marca la naturaleza</summary>' +
  '<p>Tres ciclos son reales y no dependen de nadie:</p><ul>' +
  '<li><b>El día</b>: una vuelta de la Tierra sobre sí misma.</li>' +
  '<li><b>El mes lunar</b>: 29,53 días de una luna nueva a la otra.</li>' +
  '<li><b>El año trópico</b>: 365,2422 días de un equinoccio de marzo al siguiente (las estaciones).</li></ul>' +
  '<p>Ninguno cabe un número exacto de veces en el otro: un año son 12,37 lunas. Por eso <b>todo calendario es un acuerdo humano</b> que escoge qué ciclo ' +
  'seguir: el islámico sigue la luna (sus meses se corren 11 días cada año frente a las estaciones), el hebreo y el chino mezclan luna y sol, y el gregoriano ' +
  'sigue al sol. En el universo no hay "calendario oficial": la física mide en segundos y la astronomía cuenta días seguidos (el día juliano).</p></details>' +
  '<details><summary>¿Por qué el gregoriano y no otro?</summary>' +
  '<p>Viene del calendario juliano (Julio César, 46 a. C.), que ponía un bisiesto cada 4 años: 365,25 días, 11 minutos más que el año real. En 1582 el ' +
  'equinoccio ya se había corrido 10 días, y el papa Gregorio XIII los quitó (al jueves 4 de octubre lo siguió el viernes 15) y cambió la regla: ' +
  'los años de siglo solo son bisiestos si se dividen por 400 (1900 no, 2000 sí). Queda en 365,2425 días: se desvía <b>un día cada ~3.000 años</b>. ' +
  'Lo hicieron para que la Pascua no se corriera, no para el comercio; el comercio lo adoptó después porque ya era el más usado.</p>' +
  '<p>Sus meses no siguen la luna (por eso aquí se muestran las fases reales aparte), pero sí sigue muy bien al sol: los equinoccios caen siempre el 19, 20 o 21 de marzo.</p></details>' +
  '<details><summary>¿Y el calendario de 13 lunas de 28 días?</summary>' +
  '<p>Es el "Encantamiento del Sueño" o "Ley del Tiempo", que publicó José Argüelles entre 1987 y 1990. Dice que el gregoriano es "artificial" y que 13 × 28 es ' +
  'el tiempo natural. Los datos no lo sostienen:</p><ul>' +
  '<li>La luna tarda 29,53 días, no 28: con "lunas" de 28 días, en un año la fecha ya va unos 20 días corrida frente a la luna del cielo.</li>' +
  '<li>13 × 28 = 364: le falta un día (el "día fuera del tiempo") y cada 4 años otro más. Tampoco cuadra solo.</li>' +
  '<li>Su cuenta "maya" no coincide con la cuenta de 260 días que los pueblos mayas de Guatemala siguen llevando hasta hoy.</li></ul>' +
  '<p>Es un calendario simbólico: se puede usar para reflexionar, pero no es más "natural" que el gregoriano. Lo natural está en las marcas de este calendario: ' +
  'la luna 🌑🌓🌕🌗 y los equinoccios y solsticios 🌱☀️🍂❄️, calculados con astronomía.</p></details>' +
  '<p class="nota-corta">En Colombia, cerca del ecuador, no hay cuatro estaciones: los días duran casi lo mismo todo el año y el clima va por lluvias y secas. ' +
  'Los equinoccios y solsticios igual ocurren y se marcan aquí.</p></section>';

export function vistaCalendario() {
  const semanas = cuadricula(mes), desde = semanas[0][0], hasta = semanas.at(-1)[6], a = Number(mes.slice(0, 4));
  const fases = fasesEntre(desde, hasta), estaciones = [...estacionesDe(a), ...estacionesDe(a - 1), ...estacionesDe(a + 1)];
  const delMes = fases.filter((x) => x.fecha.slice(0, 7) === mes);
  return '<h1>Calendario</h1>' +
    '<section class="tarjeta"><div class="cal-cab">' +
    '<button type="button" class="icono" data-accion="cal-mes" data-n="-1" aria-label="Mes anterior">‹</button>' +
    '<h2>' + MESES[Number(mes.slice(5)) - 1] + ' ' + a + '</h2>' +
    '<button type="button" class="icono" data-accion="cal-mes" data-n="1" aria-label="Mes siguiente">›</button></div>' +
    (mes !== iso().slice(0, 7) || elegido !== iso() ? '<button type="button" class="chip mini cal-hoy" data-accion="cal-hoy">Volver a hoy</button>' : '') +
    '<div class="cal-rejilla" role="grid"><div class="cal-sem" role="row">' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => '<span role="columnheader">' + d + '</span>').join('') + '</div>' +
    semanas.map((s) => '<div class="cal-sem" role="row">' + s.map((f) => celda(f, fases, estaciones)).join('') + '</div>').join('') + '</div>' +
    '<p class="nota-corta cal-leyenda"><span class="rojo">Rojo</span>: domingo o festivo · <span class="cal-gym"></span> gym · ⚽ fútbol · 🌑🌓🌕🌗 luna · 🌱☀️🍂❄️ estación</p></section>' +
    detalle(elegido) +
    '<section class="tarjeta"><h2>🌙 La luna en ' + MESES[Number(mes.slice(5)) - 1].toLowerCase() + '</h2><ul class="lista-pesos">' +
    delMes.map((x) => '<li><span>' + x.icono + ' ' + x.nombre + '</span><b>' + fechaCorta(x.fecha) + ' · ' + horaDe(x.ms) + '</b></li>').join('') + '</ul></section>' +
    '<section class="tarjeta"><h2>🇨🇴 Próximos festivos</h2><ul class="lista-pesos">' +
    proximosFestivos(iso(), 6).map((x) => '<li><span>' + x.nombre + '</span><b>' + fechaCorta(x.fecha) + ' · ' + enDias(x.fecha) + '</b></li>').join('') + '</ul></section>' +
    '<section class="tarjeta"><h2>🌍 Estaciones de ' + a + '</h2><ul class="lista-pesos">' +
    estacionesDe(a).map((x) => '<li><span>' + x.icono + ' ' + x.nombre + '</span><b>' + fechaCorta(x.fecha) + ' · ' + horaDe(x.ms) + '</b></li>').join('') + '</ul></section>' +
    EXPLICACION;
}

registrar({
  'cal-mes'({ n }) { mes = otroMes(mes, Number(n)); repintar(); },
  'cal-dia'({ f }) { elegido = f; mes = f.slice(0, 7); repintar(); },
  'cal-hoy'() { mes = iso().slice(0, 7); elegido = iso(); repintar(); },
});
