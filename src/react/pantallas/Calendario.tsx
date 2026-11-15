// Calendario: mes gregoriano (lunes a domingo) con festivos de Colombia, fases de la luna, equinoccios y solsticios,
// y lo que toca cada día en la rutina (gym y fútbol). Tocar un día muestra su detalle.
import { useState, type ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonBase, Card, IconButton, Typography } from '@mui/material';
import { hayFutbol } from '../../estado.js';
import { iso, fechaLarga, fechaCorta, diaSemana, diasEntre } from '../../fechas.js';
import { estadoGym, constanciaGym } from '../../entrenador.js';
import {
  cuadricula, otroMes, festivo, proximosFestivos, fasesEntre, lunaDelDia, estacionesDe, diaDelAno, diasDelAno, semanaIso, esBisiesto, diaJuliano,
} from '../../calendario.js';
import { usarEstado } from '../usarEstado';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { ListaPares } from '../ui/ListaPares';
import { Flecha } from '../ui/Flecha';

const VISTA = 'calendario';
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const GYM: Record<string, string> = { hecho: 'hecho', falto: 'no fuiste', pendiente: 'pendiente' };
const GYM_DETALLE: Record<string, string> = { hecho: ' ✅ hecho', falto: ' · no fuiste', pendiente: '' };
const COLOR_GYM: Record<string, string> = { hecho: tokens.verde, falto: tokens.rojo, pendiente: tokens.azul };
// Al salir de la pantalla y volver, sigue en el mes y el día que se estaban viendo
const visto = { mes: iso().slice(0, 7), elegido: iso() };

type Marca = { fecha: string; icono: string; nombre: string; ms: number };
type Estacion = Marca & { nota: string };
type Dia = { id: string; nombre: string; diaSemana: number };

const horaDe = (ms: number) => new Date(ms).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
const enDias = (f: string) => { const n = diasEntre(iso(), f); return n === 0 ? 'hoy' : n === 1 ? 'mañana' : n > 0 ? 'en ' + n + ' días' : 'hace ' + -n + ' días'; };

// El punto de color del gym: verde hecho, rojo no fuiste, azul por hacer
const PuntoGym = ({ estado }: { estado: string }) => (
  <Box component="span" aria-hidden="true" sx={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', bgcolor: COLOR_GYM[estado] }} />
);
const Parrafo = ({ children, color }: { children: ReactNode; color?: string }) => <Typography sx={{ my: '8px', color }}>{children}</Typography>;
const Nota = ({ children }: { children: ReactNode }) => <Typography variant="body2" sx={{ color: 'text.secondary', my: '6px' }}>{children}</Typography>;

function Celda({ f, mes, elegido, fases, estaciones, gymDe, alElegir }: {
  f: string; mes: string; elegido: string; fases: Marca[]; estaciones: Estacion[]; gymDe: (f: string) => Dia | null; alElegir: (f: string) => void;
}) {
  const fuera = f.slice(0, 7) !== mes, fes = festivo(f), fase = fases.find((x) => x.fecha === f), est = estaciones.find((x) => x.fecha === f);
  const gym: string | null = estadoGym(f), futbol = hayFutbol(f), hoy = f === iso(), activo = f === elegido, rojo = !!fes || diaSemana(f) === 7;
  const titulo = [fechaLarga(f), fes, fase && fase.nombre, est && est.nombre, futbol && 'Fútbol', gym && 'Gym: ' + gymDe(f)?.nombre + ' (' + GYM[gym] + ')'].filter(Boolean).join(' · ');
  return (
    <ButtonBase data-t="dia" data-hoy={hoy ? '' : undefined} aria-label={titulo} aria-pressed={activo ? true : undefined} onClick={() => alElegir(f)}
      sx={{ minHeight: 52, minWidth: 0, p: '4px 2px', display: 'grid', gridTemplateRows: 'auto 1fr', justifyItems: 'center', gap: '2px', borderRadius: '10px', font: 'inherit',
        border: '1px solid', borderColor: hoy || activo ? 'primary.main' : 'transparent', bgcolor: activo ? tokens.brandSoft : tokens.surface2, color: 'text.primary', opacity: fuera ? 0.4 : 1,
        '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 1 } }}>
      <Box component="span" sx={{ fontWeight: 700, fontSize: 15, color: hoy ? 'primary.main' : rojo ? 'error.main' : 'inherit' }}>{Number(f.slice(8))}</Box>
      <Box component="span" sx={{ fontSize: 11, lineHeight: 1.1, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '1px' }}>
        {(fase ? fase.icono : '') + (est ? est.icono : '') + (futbol ? '⚽' : '')}{gym && <PuntoGym estado={gym} />}
      </Box>
    </ButtonBase>
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
    <TarjetaPlegable vista={VISTA} clave={titulo} titulo={titulo} lado={<Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>{enDias(f)}</Typography>}>
      {fes && <Parrafo color="error.main">🇨🇴 Festivo: <b>{fes}</b></Parrafo>}
      {est && <Parrafo>{est.icono} <b>{est.nombre}</b> a las {horaDe(est.ms)} · {est.nota}</Parrafo>}
      <Parrafo>{luna.icono} <b>{luna.nombre}</b>{luna.principal ? ' a las ' + horaDe(luna.principal.ms) : ''} · {luna.luz} % iluminada · {Math.floor(luna.edad)} días desde la luna nueva</Parrafo>
      <Parrafo>{toca.length ? 'Toca: ' + toca.join(' · ') : '😌 Día de descanso en la rutina'}</Parrafo>
      <ListaPares pares={[
        { id: 'dia', nombre: 'Día del año', valor: diaDelAno(f) + ' de ' + diasDelAno(a) },
        { id: 'semana', nombre: 'Semana ISO', valor: si.semana + (si.ano !== a ? ' de ' + si.ano : '') },
        { id: 'ano', nombre: 'Año ' + a, valor: esBisiesto(a) ? 'bisiesto (366 días)' : 'normal (365 días)' },
        { id: 'juliano', nombre: 'Día juliano (astronomía)', valor: juliano },
      ]} />
    </TarjetaPlegable>
  );
}

// Racha de entrenos seguidos y cuántos del mes visto se hicieron (hasta hoy)
function Constancia({ mes }: { mes: string }) {
  const c = constanciaGym(mes);
  if (!c.plan && !c.racha) return null;
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px', mt: '8px', pt: '8px', borderTop: '1px solid', borderColor: 'divider' }}>
      <span>🔥 Racha: <b>{c.racha + (c.racha === 1 ? ' entreno' : ' entrenos')}</b> seguidos</span>
      {c.plan ? <span>Este mes: <b>{c.hechos} de {c.plan}</b></span> : null}
    </Box>
  );
}

// Cada pregunta de la explicación: se abre y se cierra
function Pregunta({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [abierta, poner] = useState(false);
  return (
    <Accordion expanded={abierta} onChange={(_, v) => poner(v)}>
      <AccordionSummary><Flecha abierta={abierta} /><span>{titulo}</span></AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
const Vinetas = ({ children }: { children: ReactNode }) => <Box component="ul" sx={{ pl: '20px', my: '8px' }}>{children}</Box>;

// Para qué sirve cada calendario y qué marca de verdad la naturaleza
function Explicacion() {
  const titulo = '🌍 ¿Qué calendario rige el mundo?';
  return (
    <TarjetaPlegable vista={VISTA} clave={titulo} titulo={titulo}>
      <Parrafo>El <b>gregoriano</b>{': es el estándar civil internacional (norma ISO 8601) y lo usan los gobiernos, la ciencia, la aviación, los bancos e internet. ' +
        'Unos pocos países llevan otro como oficial (Irán y Afganistán el solar persa, Etiopía el etíope, Nepal el Vikram Samvat) y muchas culturas guardan ' +
        'el suyo para fiestas religiosas (islámico, hebreo, chino, hindú), pero todos convierten al gregoriano para tratar con el resto del mundo.'}</Parrafo>
      <Pregunta titulo="Lo único que marca la naturaleza">
        <Parrafo>Tres ciclos son reales y no dependen de nadie:</Parrafo>
        <Vinetas>
          <li><b>El día</b>: una vuelta de la Tierra sobre sí misma.</li>
          <li><b>El mes lunar</b>: 29,53 días de una luna nueva a la otra.</li>
          <li><b>El año trópico</b>: 365,2422 días de un equinoccio de marzo al siguiente (las estaciones).</li>
        </Vinetas>
        <Parrafo>{'Ninguno cabe un número exacto de veces en el otro: un año son 12,37 lunas. Por eso '}<b>todo calendario es un acuerdo humano</b>{' que escoge qué ciclo ' +
          'seguir: el islámico sigue la luna (sus meses se corren 11 días cada año frente a las estaciones), el hebreo y el chino mezclan luna y sol, y el gregoriano ' +
          'sigue al sol. En el universo no hay "calendario oficial": la física mide en segundos y la astronomía cuenta días seguidos (el día juliano).'}</Parrafo>
      </Pregunta>
      <Pregunta titulo="¿Por qué el gregoriano y no otro?">
        <Parrafo>{'Viene del calendario juliano (Julio César, 46 a. C.), que ponía un bisiesto cada 4 años: 365,25 días, 11 minutos más que el año real. En 1582 el ' +
          'equinoccio ya se había corrido 10 días, y el papa Gregorio XIII los quitó (al jueves 4 de octubre lo siguió el viernes 15) y cambió la regla: ' +
          'los años de siglo solo son bisiestos si se dividen por 400 (1900 no, 2000 sí). Queda en 365,2425 días: se desvía '}<b>un día cada ~3.000 años</b>{'. ' +
          'Lo hicieron para que la Pascua no se corriera, no para el comercio; el comercio lo adoptó después porque ya era el más usado.'}</Parrafo>
        <Parrafo>Sus meses no siguen la luna (por eso aquí se muestran las fases reales aparte), pero sí sigue muy bien al sol: los equinoccios caen siempre el 19, 20 o 21 de marzo.</Parrafo>
      </Pregunta>
      <Pregunta titulo="¿Y el calendario de 13 lunas de 28 días?">
        <Parrafo>{'Es el "Encantamiento del Sueño" o "Ley del Tiempo", que publicó José Argüelles entre 1987 y 1990. Dice que el gregoriano es "artificial" y que 13 × 28 es ' +
          'el tiempo natural. Los datos no lo sostienen:'}</Parrafo>
        <Vinetas>
          <li>La luna tarda 29,53 días, no 28: con "lunas" de 28 días, en un año la fecha ya va unos 20 días corrida frente a la luna del cielo.</li>
          <li>13 × 28 = 364: le falta un día (el "día fuera del tiempo") y cada 4 años otro más. Tampoco cuadra solo.</li>
          <li>Su cuenta "maya" no coincide con la cuenta de 260 días que los pueblos mayas de Guatemala siguen llevando hasta hoy.</li>
        </Vinetas>
        <Parrafo>{'Es un calendario simbólico: se puede usar para reflexionar, pero no es más "natural" que el gregoriano. Lo natural está en las marcas de este calendario: ' +
          'la luna 🌑🌓🌕🌗 y los equinoccios y solsticios 🌱☀️🍂❄️, calculados con astronomía.'}</Parrafo>
      </Pregunta>
      <Nota>{'En Colombia, cerca del ecuador, no hay cuatro estaciones: los días duran casi lo mismo todo el año y el clima va por lluvias y secas. ' +
        'Los equinoccios y solsticios igual ocurren y se marcan aquí.'}</Nota>
    </TarjetaPlegable>
  );
}

const FILA_SEMANA = { display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '4px' };
const BOTON_MES = { bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', fontSize: 24 };

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
      <Typography variant="h1" sx={{ m: '4px 0 12px' }}>Calendario</Typography>
      <Card component="section" sx={{ mb: '14px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <IconButton aria-label="Mes anterior" onClick={() => ver(otroMes(mes, -1))} sx={BOTON_MES}>‹</IconButton>
          <Typography component="h2" variant="h2" sx={{ m: 0, flex: 1, textAlign: 'center' }}>{nombreMes} {a}</Typography>
          <IconButton aria-label="Mes siguiente" onClick={() => ver(otroMes(mes, 1))} sx={BOTON_MES}>›</IconButton>
        </Box>
        {(mes !== iso().slice(0, 7) || elegido !== iso()) && (
          <Button data-t="volver-hoy" size="small" variant="outlined" color="inherit" onClick={() => ver(iso().slice(0, 7), iso())}
            sx={{ display: 'block', m: '8px auto 0', borderColor: 'divider', bgcolor: 'background.paper', fontWeight: 600 }}>Volver a hoy</Button>
        )}
        <Box data-t="rejilla" role="grid" sx={{ display: 'grid', gap: '4px', mt: '12px' }}>
          <Box role="row" sx={FILA_SEMANA}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <Box component="span" role="columnheader" key={i} sx={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>{d}</Box>)}
          </Box>
          {semanas.map((s) => (
            <Box role="row" key={s[0]} sx={FILA_SEMANA}>
              {s.map((f) => <Celda key={f} f={f} mes={mes} elegido={elegido} fases={fases} estaciones={estaciones} gymDe={gymDe} alElegir={(x) => ver(x.slice(0, 7), x)} />)}
            </Box>
          ))}
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: '10px', mb: '6px' }}>
          <Box component="span" sx={{ color: 'error.main' }}>Rojo</Box>: domingo o festivo · gym <PuntoGym estado="hecho" /> hecho <PuntoGym estado="falto" /> no fuiste <PuntoGym estado="pendiente" /> por hacer · ⚽ fútbol · 🌑🌓🌕🌗 luna · 🌱☀️🍂❄️ estación
        </Typography>
        <Constancia mes={mes} />
      </Card>
      <Detalle f={elegido} gymDe={gymDe} />
      <TarjetaPlegable vista={VISTA} clave={tLuna} titulo={tLuna}>
        <ListaPares pares={delMes.map((x) => ({ id: x.ms, nombre: x.icono + ' ' + x.nombre, valor: fechaCorta(x.fecha) + ' · ' + horaDe(x.ms) }))} />
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave={tFestivos} titulo={tFestivos}>
        <ListaPares pares={(proximosFestivos(iso(), 6) as { fecha: string; nombre: string }[]).map((x) => ({ id: x.fecha, nombre: x.nombre, valor: fechaCorta(x.fecha) + ' · ' + enDias(x.fecha) }))} />
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave={tEstaciones} titulo={tEstaciones}>
        <ListaPares pares={(estacionesDe(a) as Estacion[]).map((x) => ({ id: x.ms, nombre: x.icono + ' ' + x.nombre, valor: fechaCorta(x.fecha) + ' · ' + horaDe(x.ms) }))} />
      </TarjetaPlegable>
      <Explicacion />
    </>
  );
}
