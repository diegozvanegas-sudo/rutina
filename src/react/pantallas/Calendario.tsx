// Calendario: mes gregoriano (lunes a domingo) con festivos de Colombia, fases de la luna, equinoccios y solsticios,
// y lo que toca cada día en la rutina (gym y fútbol). Tocar un día muestra su detalle.
import { useState } from 'react';
import { hayFutbol } from '../../estado.js';
import { iso, fechaLarga, fechaCorta, diaSemana, diasEntre } from '../../fechas.js';
import { estadoGym, constanciaGym } from '../../entrenador.js';
import {
  cuadricula, otroMes, festivo, proximosFestivos, fasesEntre, lunaDelDia, estacionesDe, diaDelAno, diasDelAno, semanaIso, esBisiesto, diaJuliano,
} from '../../calendario.js';
import { usarEstado } from '../usarEstado';
import { Tarjeta } from '../Tarjeta';

const VISTA = 'calendario';
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const GYM: Record<string, string> = { hecho: 'hecho', falto: 'no fuiste', pendiente: 'pendiente' };
const GYM_DETALLE: Record<string, string> = { hecho: ' ✅ hecho', falto: ' · no fuiste', pendiente: '' };
// Al salir de la pantalla y volver, sigue en el mes y el día que se estaban viendo
const visto = { mes: iso().slice(0, 7), elegido: iso() };

type Marca = { fecha: string; icono: string; nombre: string; ms: number };
type Estacion = Marca & { nota: string };
type Dia = { id: string; nombre: string; diaSemana: number };

const horaDe = (ms: number) => new Date(ms).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
const enDias = (f: string) => { const n = diasEntre(iso(), f); return n === 0 ? 'hoy' : n === 1 ? 'mañana' : n > 0 ? 'en ' + n + ' días' : 'hace ' + -n + ' días'; };

function Celda({ f, mes, elegido, fases, estaciones, gymDe, alElegir }: {
  f: string; mes: string; elegido: string; fases: Marca[]; estaciones: Estacion[]; gymDe: (f: string) => Dia | null; alElegir: (f: string) => void;
}) {
  const fuera = f.slice(0, 7) !== mes, fes = festivo(f), fase = fases.find((x) => x.fecha === f), est = estaciones.find((x) => x.fecha === f);
  const gym: string | null = estadoGym(f), futbol = hayFutbol(f);
  const titulo = [fechaLarga(f), fes, fase && fase.nombre, est && est.nombre, futbol && 'Fútbol', gym && 'Gym: ' + gymDe(f)?.nombre + ' (' + GYM[gym] + ')'].filter(Boolean).join(' · ');
  const clases = 'cal-dia' + (fuera ? ' fuera' : '') + (f === iso() ? ' hoy' : '') + (f === elegido ? ' elegido' : '') + (fes || diaSemana(f) === 7 ? ' festivo' : '');
  return (
    <button type="button" className={clases} aria-label={titulo} aria-pressed={f === elegido ? true : undefined} onClick={() => alElegir(f)}>
      <span className="cal-num">{Number(f.slice(8))}</span>
      <span className="cal-marcas">{(fase ? fase.icono : '') + (est ? est.icono : '') + (futbol ? '⚽' : '')}{gym && <span className={'cal-gym g-' + gym} aria-hidden="true" />}</span>
    </button>
  );
}

function Detalle({ f, gymDe }: { f: string; gymDe: (f: string) => Dia | null }) {
  const a = Number(f.slice(0, 4)), luna = lunaDelDia(f), fes = festivo(f), gym = gymDe(f), si = semanaIso(f);
  const est = (estacionesDe(a) as Estacion[]).find((x) => x.fecha === f);
  const hecho = GYM_DETALLE[estadoGym(f) as string] || '';
  const toca = [hayFutbol(f) && '⚽ Fútbol en la noche', gym && '🏋️ ' + gym.nombre + hecho].filter(Boolean);
  const juliano = Math.floor(diaJuliano(Date.UTC(a, Number(f.slice(5, 7)) - 1, Number(f.slice(8))) + 43200000)).toLocaleString('es-CO');
  const titulo = fechaLarga(f) + ' de ' + a;
  return (
    <Tarjeta vista={VISTA} clase="cal-detalle" clave={titulo} titulo={titulo} lado={<span className="nota-corta">{enDias(f)}</span>}>
      {fes && <p className="cal-festivo">🇨🇴 Festivo: <b>{fes}</b></p>}
      {est && <p>{est.icono} <b>{est.nombre}</b> a las {horaDe(est.ms)} · {est.nota}</p>}
      <p>{luna.icono} <b>{luna.nombre}</b>{luna.principal ? ' a las ' + horaDe(luna.principal.ms) : ''} · {luna.luz} % iluminada · {Math.floor(luna.edad)} días desde la luna nueva</p>
      <p>{toca.length ? 'Toca: ' + toca.join(' · ') : '😌 Día de descanso en la rutina'}</p>
      <ul className="lista-pesos">
        <li><span>Día del año</span><b>{diaDelAno(f)} de {diasDelAno(a)}</b></li>
        <li><span>Semana ISO</span><b>{si.semana + (si.ano !== a ? ' de ' + si.ano : '')}</b></li>
        <li><span>Año {a}</span><b>{esBisiesto(a) ? 'bisiesto (366 días)' : 'normal (365 días)'}</b></li>
        <li><span>Día juliano (astronomía)</span><b>{juliano}</b></li>
      </ul>
    </Tarjeta>
  );
}

// Racha de entrenos seguidos y cuántos del mes visto se hicieron (hasta hoy)
function Constancia({ mes }: { mes: string }) {
  const c = constanciaGym(mes);
  if (!c.plan && !c.racha) return null;
  return (
    <div className="cal-constancia">
      <span>🔥 Racha: <b>{c.racha + (c.racha === 1 ? ' entreno' : ' entrenos')}</b> seguidos</span>
      {c.plan ? <span>Este mes: <b>{c.hechos} de {c.plan}</b></span> : null}
    </div>
  );
}

// Para qué sirve cada calendario y qué marca de verdad la naturaleza
function Explicacion() {
  const titulo = '🌍 ¿Qué calendario rige el mundo?';
  return (
    <Tarjeta vista={VISTA} clase="cal-explica" clave={titulo} titulo={titulo}>
      <p>El <b>gregoriano</b>{': es el estándar civil internacional (norma ISO 8601) y lo usan los gobiernos, la ciencia, la aviación, los bancos e internet. ' +
        'Unos pocos países llevan otro como oficial (Irán y Afganistán el solar persa, Etiopía el etíope, Nepal el Vikram Samvat) y muchas culturas guardan ' +
        'el suyo para fiestas religiosas (islámico, hebreo, chino, hindú), pero todos convierten al gregoriano para tratar con el resto del mundo.'}</p>
      <details><summary>Lo único que marca la naturaleza</summary>
        <p>Tres ciclos son reales y no dependen de nadie:</p>
        <ul>
          <li><b>El día</b>: una vuelta de la Tierra sobre sí misma.</li>
          <li><b>El mes lunar</b>: 29,53 días de una luna nueva a la otra.</li>
          <li><b>El año trópico</b>: 365,2422 días de un equinoccio de marzo al siguiente (las estaciones).</li>
        </ul>
        <p>{'Ninguno cabe un número exacto de veces en el otro: un año son 12,37 lunas. Por eso '}<b>todo calendario es un acuerdo humano</b>{' que escoge qué ciclo ' +
          'seguir: el islámico sigue la luna (sus meses se corren 11 días cada año frente a las estaciones), el hebreo y el chino mezclan luna y sol, y el gregoriano ' +
          'sigue al sol. En el universo no hay "calendario oficial": la física mide en segundos y la astronomía cuenta días seguidos (el día juliano).'}</p>
      </details>
      <details><summary>¿Por qué el gregoriano y no otro?</summary>
        <p>{'Viene del calendario juliano (Julio César, 46 a. C.), que ponía un bisiesto cada 4 años: 365,25 días, 11 minutos más que el año real. En 1582 el ' +
          'equinoccio ya se había corrido 10 días, y el papa Gregorio XIII los quitó (al jueves 4 de octubre lo siguió el viernes 15) y cambió la regla: ' +
          'los años de siglo solo son bisiestos si se dividen por 400 (1900 no, 2000 sí). Queda en 365,2425 días: se desvía '}<b>un día cada ~3.000 años</b>{'. ' +
          'Lo hicieron para que la Pascua no se corriera, no para el comercio; el comercio lo adoptó después porque ya era el más usado.'}</p>
        <p>Sus meses no siguen la luna (por eso aquí se muestran las fases reales aparte), pero sí sigue muy bien al sol: los equinoccios caen siempre el 19, 20 o 21 de marzo.</p>
      </details>
      <details><summary>¿Y el calendario de 13 lunas de 28 días?</summary>
        <p>{'Es el "Encantamiento del Sueño" o "Ley del Tiempo", que publicó José Argüelles entre 1987 y 1990. Dice que el gregoriano es "artificial" y que 13 × 28 es ' +
          'el tiempo natural. Los datos no lo sostienen:'}</p>
        <ul>
          <li>La luna tarda 29,53 días, no 28: con "lunas" de 28 días, en un año la fecha ya va unos 20 días corrida frente a la luna del cielo.</li>
          <li>13 × 28 = 364: le falta un día (el "día fuera del tiempo") y cada 4 años otro más. Tampoco cuadra solo.</li>
          <li>Su cuenta "maya" no coincide con la cuenta de 260 días que los pueblos mayas de Guatemala siguen llevando hasta hoy.</li>
        </ul>
        <p>{'Es un calendario simbólico: se puede usar para reflexionar, pero no es más "natural" que el gregoriano. Lo natural está en las marcas de este calendario: ' +
          'la luna 🌑🌓🌕🌗 y los equinoccios y solsticios 🌱☀️🍂❄️, calculados con astronomía.'}</p>
      </details>
      <p className="nota-corta">{'En Colombia, cerca del ecuador, no hay cuatro estaciones: los días duran casi lo mismo todo el año y el clima va por lluvias y secas. ' +
        'Los equinoccios y solsticios igual ocurren y se marcan aquí.'}</p>
    </Tarjeta>
  );
}

export default function Calendario() {
  const estado = usarEstado();
  const [mes, ponerMes] = useState(visto.mes), [elegido, ponerElegido] = useState(visto.elegido);
  const ver = (m: string, f: string = elegido) => { visto.mes = m; visto.elegido = f; ponerMes(m); ponerElegido(f); };
  const gymDe = (f: string): Dia | null => (estado.rutina as Dia[]).find((x) => x.diaSemana === diaSemana(f)) || null;

  const semanas: string[][] = cuadricula(mes), desde = semanas[0][0], hasta = semanas[semanas.length - 1][6], a = Number(mes.slice(0, 4));
  const fases = fasesEntre(desde, hasta) as Marca[], estaciones = [...estacionesDe(a), ...estacionesDe(a - 1), ...estacionesDe(a + 1)] as Estacion[];
  const delMes = fases.filter((x) => x.fecha.slice(0, 7) === mes), nombreMes = MESES[Number(mes.slice(5)) - 1];
  const tLuna = '🌙 La luna en ' + nombreMes.toLowerCase(), tFestivos = '🇨🇴 Próximos festivos', tEstaciones = '🌍 Estaciones de ' + a;

  return (
    <>
      <h1>Calendario</h1>
      <section className="tarjeta">
        <div className="cal-cab">
          <button type="button" className="icono" aria-label="Mes anterior" onClick={() => ver(otroMes(mes, -1))}>‹</button>
          <h2>{nombreMes} {a}</h2>
          <button type="button" className="icono" aria-label="Mes siguiente" onClick={() => ver(otroMes(mes, 1))}>›</button>
        </div>
        {(mes !== iso().slice(0, 7) || elegido !== iso()) && <button type="button" className="chip mini cal-hoy" onClick={() => ver(iso().slice(0, 7), iso())}>Volver a hoy</button>}
        <div className="cal-rejilla" role="grid">
          <div className="cal-sem" role="row">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span role="columnheader" key={i}>{d}</span>)}</div>
          {semanas.map((s) => (
            <div className="cal-sem" role="row" key={s[0]}>
              {s.map((f) => <Celda key={f} f={f} mes={mes} elegido={elegido} fases={fases} estaciones={estaciones} gymDe={gymDe} alElegir={(x) => ver(x.slice(0, 7), x)} />)}
            </div>
          ))}
        </div>
        <p className="nota-corta cal-leyenda"><span className="rojo">Rojo</span>: domingo o festivo · gym <span className="cal-gym g-hecho" /> hecho <span className="cal-gym g-falto" /> no fuiste <span className="cal-gym g-pendiente" /> por hacer · ⚽ fútbol · 🌑🌓🌕🌗 luna · 🌱☀️🍂❄️ estación</p>
        <Constancia mes={mes} />
      </section>
      <Detalle f={elegido} gymDe={gymDe} />
      <Tarjeta vista={VISTA} clave={tLuna} titulo={tLuna}>
        <ul className="lista-pesos">{delMes.map((x) => <li key={x.ms}><span>{x.icono} {x.nombre}</span><b>{fechaCorta(x.fecha)} · {horaDe(x.ms)}</b></li>)}</ul>
      </Tarjeta>
      <Tarjeta vista={VISTA} clave={tFestivos} titulo={tFestivos}>
        <ul className="lista-pesos">{(proximosFestivos(iso(), 6) as { fecha: string; nombre: string }[]).map((x) => <li key={x.fecha}><span>{x.nombre}</span><b>{fechaCorta(x.fecha)} · {enDias(x.fecha)}</b></li>)}</ul>
      </Tarjeta>
      <Tarjeta vista={VISTA} clave={tEstaciones} titulo={tEstaciones}>
        <ul className="lista-pesos">{(estacionesDe(a) as Estacion[]).map((x) => <li key={x.ms}><span>{x.icono} {x.nombre}</span><b>{fechaCorta(x.fecha)} · {horaDe(x.ms)}</b></li>)}</ul>
      </Tarjeta>
      <Explicacion />
    </>
  );
}
