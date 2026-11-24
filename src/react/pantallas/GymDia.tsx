// 🏋️ Gym → un día de entreno: calentamiento, el ejercicio en el que vas (abierto, con el cursor listo), los demás en una
// fila, biseries, core, cardio, copiar el resumen y el análisis. React pinta; anotar es de las acciones de siempre
// (src/vistas/gym.js: serie, reps, peso, gym-rir, gym-ronda…).
// "＋ Serie" y la ronda de la biserie leen su campo junto al botón: esos botones llevan data-accion (los despacha main.js con
// el botón de verdad) y el campo de la serie es un <input> hermano del botón (Enter en él toca ese botón, main.js)
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Chip, IconButton, NativeSelect, OutlinedInput } from '@mui/material';
import { e, semanaActual } from '../../estado.js';
import { reloj, fechaCorta, iso, sumarDias } from '../../fechas.js';
import { lecturaHoy, suenoDeHoras, esDiaPierna, planCorto, seriesCortas, chequeoMensual, videoValido, buscarVideo } from '../../entreno-hoy.js';
import { horasSueno, hayPartido } from '../../registro.js';
import { esDescarga, esDescanso, filaDe, sinDescargas, rutinaDe } from '../../descarga.js';
import { AvisoPesos, FutbolHoy, Esencial, Ocupadas, AproxEjercicio, HoyVsUltima, ComoTeFue } from './GymExtras';
import { DescansoDia } from './GymDescanso';
import { juegaEl } from '../../futbol.js';
import { estadoFila, ultimoRegistro, sugerencia, aproximacion, resumenSemana, numero, formatoPeso, historial, records, ultimaSubida, estancamiento, seriesRaras, metaSesion,
  consejoRir, gruposDia, nombresBiserie, bajonReps, tieneVariantes, varianteEn, nombreConVariante, repsDe, CAMPOS_CARDIO, claveCardio, hayCardio, textoCardio, tiemposDia, duracion, ENTRENO_RARO, tiemposEjercicios, minutosTexto, mmss } from '../../gym.js';
import { resumenEjercicios, promptEntreno, ICONO_ESTADO, TEXTO_ESTADO } from '../../analisis.js';
import { piezasGym, textoDia, sesionCalentamiento, extrasCalentamiento, entrenoHoy, minutosEntreno, entrenoQuieto, molestiaHoy, molestiaReciente } from '../../vistas/gym.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargoSolo, CampoSolo } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { Nota } from '../ui/Textos';
import { Avance } from '../ui/Varios';
import { Linea, TablaDatos } from '../ui/Graficos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const G = piezasGym as Fin;
const VISTA = 'gym';
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const GRIS = { fontSize: 14, color: 'text.secondary', '& b': { color: 'text.primary' } };
const ICONO_SESION: Record<string, string> = { checklist: '✅', calentamiento: '🔥', estiramiento: '🧘', fortalecimiento: '🦵', mente: '🧠' };
const ENLACE = { minHeight: 32, p: 0, minWidth: 0, color: 'info.main', fontWeight: 400, fontSize: 14, textDecoration: 'underline', justifyContent: 'flex-start', textAlign: 'left', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } };
const MINI = { minHeight: 32, borderRadius: 999, fontSize: 13 };
// Color de la fila según cómo va: falta (amarillo), completo (verde), sube peso (azul)
const BORDE: Record<string, string> = { falta: tokens.amarillo, completo: tokens.verde, sube: tokens.azul };
const CONTADOR: Record<string, { bgcolor: string; color: string }> = {
  falta: { bgcolor: tokens.amarillo, color: tokens.amarilloInk }, completo: { bgcolor: tokens.verde, color: tokens.brandInk }, sube: { bgcolor: tokens.azul, color: tokens.azulInk },
};
const Contador = ({ color, children, sx }: { color?: string; children: ReactNode; sx?: object }) => (
  <Box component="span" sx={{ fontWeight: 800, fontSize: 16, p: '2px 10px', borderRadius: 999, bgcolor: tokens.surface2, fontVariantNumeric: 'tabular-nums', ...(color ? CONTADOR[color] : null), ...sx }}>{children}</Box>
);
const TIPO: Record<string, { bgcolor: string; color: string }> = { top: { bgcolor: tokens.topFondo, color: tokens.topInk }, 'back-off': { bgcolor: tokens.azulFondo, color: tokens.backoffInk } };

const regs = (sem: number) => (e() as Fin).semanas[sem] || {};
// ⏱ Cuánto tomó cada ejercicio ese día (gym.js tiemposEjercicios: con la hora de cada serie anotada en vivo)
const tiemposDe = (d: Fin, sem: number) => { const f = (tiemposDia(d, sem, e()) as Fin).fuerza; return tiemposEjercicios(d.ejercicios, regs(sem), f ? f.inicio : null) as Record<string, Fin>; };
// Con una sola serie y nada antes no hay tiempo que mostrar
const conTiempo = (t: Fin) => !!t && !(t.aproximado && t.series < 2);
function lineaTiempo(ej: Fin, d: Fin, sem: number) {
  const t = tiemposDe(d, sem)[ej.id];
  if (!conTiempo(t)) return null;
  const antes = sem > 1 ? tiemposDe(d, sem - 1)[ej.id] : null;
  return (
    <Box data-t="tiempo-ej" sx={{ fontSize: 13, color: 'text.secondary', m: '2px 0 6px' }}>
      ⏱ <b>{minutosTexto(t.ms)}</b>{t.aproximado ? ' desde la 1.ª serie' : ''}{t.descanso ? ' · descanso medio ' + mmss(t.descanso) : ''}{conTiempo(antes) ? ' · la semana pasada ' + minutosTexto(antes.ms) : ''}
    </Box>
  );
}
// La lista del día: cada ejercicio con su tiempo, sus series y su descanso medio
function TiemposPorEjercicio({ d, sem }: { d: Fin; sem: number }) {
  const t = tiemposDe(d, sem), filas = (d.ejercicios as Fin[]).filter((ej) => conTiempo(t[ej.id]));
  if (!filas.length) return null;
  const total = filas.reduce((n, ej) => n + t[ej.id].ms, 0);
  return (
    <Desplegable titulo={'⏱ Tiempo por ejercicio (' + filas.length + ')'} sx={{ mb: '12px' }}>
      <Box component="ul" data-t="tiempos-ej" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '2px' }}>
        {filas.map((ej) => { const x = t[ej.id]; return (
          <Box component="li" key={ej.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', p: '6px 0', borderBottom: '1px solid', borderColor: 'divider', fontSize: 14 }}>
            <Box component="span" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>{ej.nombre} <Box component="small" sx={{ color: 'text.secondary' }}>· {x.series} {x.series === 1 ? 'serie' : 'series'}{x.descanso ? ' · desc. ' + mmss(x.descanso) : ''}</Box></Box>
            <b style={{ whiteSpace: 'nowrap' }}>{minutosTexto(x.ms)}{x.aproximado ? '*' : ''}</b>
          </Box>
        ); })}
      </Box>
      <Box component="p" sx={{ fontSize: 13, color: 'text.secondary', m: '6px 0 0' }}>Suman {minutosTexto(total)}. Cada uno cuenta desde que terminaste el anterior: montar, series y descansos.{filas.some((ej) => t[ej.id].aproximado) ? ' * Desde su primera serie (antes no hubo nada cerca).' : ''}</Box>
    </Desplegable>
  );
}

// ---------- 🚦 Antes de entrenar: cómo llegas hoy (src/entreno-hoy.js) ----------
function datosHoy(d: Fin) {
  const est = e() as Fin, hoy = iso(), ayer = sumarDias(hoy, -1), manana = sumarDias(hoy, 1), l = G.listoHoy() as Fin;
  const horas = horasSueno((est.dias[hoy] || {}).sueno) as number | null;
  const futbol = { ayer: juegaEl(est.config, ayer) || hayPartido((est.dias[ayer] || {}).partido), manana: juegaEl(est.config, manana) };
  const sueno = l.sueno ?? suenoDeHoras(horas), pierna = esDiaPierna(d);
  return { l, horas, futbol, pierna, sueno, lectura: lecturaHoy({ sueno, energia: l.energia ?? null, futbol, pierna }) as Fin };
}
// El nivel de hoy del día al que pertenece un ejercicio (solo en la semana actual)
const nivelHoy = (ej: Fin, sem: number) => {
  if (sem !== semanaActual()) return null;
  const d = (e() as Fin).rutina.find((x: Fin) => x.ejercicios.includes(ej));
  return d && d.id !== 'core' ? (datosHoy(d).lectura || {}).nivel || null : null;
};
// ⏱ Series de menos hoy por la versión corta, en el día de ese ejercicio
const menosHoy = (ej: Fin, sem: number) => {
  const d = (e() as Fin).rutina.find((x: Fin) => x.ejercicios.includes(ej)), c = d && G.cortoHoy(d, sem);
  return c ? c.menos || 0 : 0;
};
const OPC_SUENO: [number, string][] = [[1, '😴 Poco'], [2, '😐 Normal'], [3, '😃 Bien']];
const OPC_ENERGIA: [number, string][] = [[1, '🪫 Baja'], [2, '🔋 Normal'], [3, '⚡ Alta']];
const OPC_MIN: number[] = [30, 45, 60];
function Fichas({ k, opciones, activa, nombre }: { k: string; opciones: [number, string][]; activa: number | null; nombre: string }) {
  return (
    <Box role="group" aria-label={nombre} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
      <Box component="span" sx={{ flexBasis: { xs: '100%', sm: 'auto' }, minWidth: { sm: 76 }, fontSize: 14, color: 'text.secondary' }}>{nombre}</Box>
      {opciones.map(([n, t]) => { const si = activa === n; return <Chip key={n} clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={t} onClick={() => accion('gym-listo', { k, v: n })} sx={{ minHeight: 36 }} />; })}
    </Box>
  );
}
const COLOR_NIVEL: Record<string, string> = { full: tokens.verde, normal: tokens.azul, suave: tokens.amarillo };
function AntesDeEntrenar({ d, sem }: { d: Fin; sem: number }) {
  const { l, horas, sueno, lectura } = datosHoy(d), respondido = !!(l.energia && sueno), [abierto, ponerAbierto] = useState(!respondido);
  if (sem !== semanaActual()) return null;
  const corto = l.min ? G.cortoHoy(d, sem) as Fin : null, total = (planCorto(gruposDia(d.ejercicios), 999, regs(sem)) as Fin).total;
  const resumen = [lectura ? lectura.icono + ' ' + lectura.titulo : '🚦 ¿Cómo llegas hoy?', l.descarga ? '🔻 liviano' : null, l.min ? '⏱ ' + l.min + ' min' + (corto.fuera.length ? ' (' + corto.fuera.length + ' fuera)' : '') : null].filter(Boolean).join(' · ');
  return (
    <Card component="section" data-t="antes" sx={{ mb: '12px', p: 0, borderLeft: '5px solid', borderLeftColor: lectura ? COLOR_NIVEL[lectura.nivel] : 'divider' }}>
      <ButtonBase aria-expanded={abierto} onClick={() => ponerAbierto(!abierto)}
        sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', minHeight: 48, p: '8px 14px', font: 'inherit', color: 'text.primary', textAlign: 'left', gap: '10px', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '-2px' } }}>
        <b>{resumen}</b><Box component="span" aria-hidden="true" sx={{ color: 'text.secondary' }}>{abierto ? '▾' : '▸'}</Box>
      </ButtonBase>
      {abierto ? (
        <Box sx={{ display: 'grid', gap: '8px', p: '0 14px 12px' }}>
          <Fichas k="sueno" nombre="Dormí" opciones={OPC_SUENO} activa={sueno} />
          {horas != null && l.sueno == null ? <Box sx={{ ...GRIS, mt: '-4px' }}>Según Hoy dormiste <b>{String(horas).replace('.', ',')} h</b>: toca otra opción si no fue así.</Box> : null}
          <Fichas k="energia" nombre="Energía" opciones={OPC_ENERGIA} activa={l.energia ?? null} />
          <Box role="group" aria-label="Tiempo que tengo" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <Box component="span" sx={{ flexBasis: { xs: '100%', sm: 'auto' }, minWidth: { sm: 76 }, fontSize: 14, color: 'text.secondary' }}>Tengo</Box>
            {OPC_MIN.map((n) => { const si = l.min === n; return <Chip key={n} clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={n + ' min'} onClick={() => accion('gym-listo', { k: 'min', v: n })} sx={{ minHeight: 36 }} />; })}
            <Chip clickable aria-pressed={!l.min} color={!l.min ? 'primary' : 'default'} variant={!l.min ? 'filled' : 'outlined'} label="Todo" onClick={() => accion('gym-listo', { k: 'min', v: 0 })} sx={{ minHeight: 36 }} />
          </Box>
          {/* 🔻 Descargar hoy: 15 % menos de peso en cada ejercicio, solo hoy (src/descarga.js metaLiviana) */}
          {esDescarga(sem, e()) ? null : (
            <Box role="group" aria-label="Peso de hoy" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
              <Box component="span" sx={{ flexBasis: { xs: '100%', sm: 'auto' }, minWidth: { sm: 76 }, fontSize: 14, color: 'text.secondary' }}>Peso</Box>
              <Chip clickable data-t="liviano" aria-pressed={!!l.descarga} color={l.descarga ? 'primary' : 'default'} variant={l.descarga ? 'filled' : 'outlined'} label="🔻 Descargar hoy (−15 %)" onClick={() => accion('gym-listo', { k: 'descarga', v: 1 })} sx={{ minHeight: 36 }} />
              {l.descarga ? <Box component="span" sx={{ ...GRIS, flexBasis: '100%' }}>Cada ejercicio te dice su peso liviano: mismas series y reps, deja 3-4 en reserva. Mañana vuelves a lo normal.</Box>
                : lectura && lectura.nivel === 'suave' ? <Box component="span" sx={{ ...GRIS, flexBasis: '100%' }}>¿Muy cansado? Con 🔻 te bajo el peso de cada ejercicio solo por hoy.</Box> : null}
            </Box>
          )}
          {lectura ? (
            <Box data-t="lectura" sx={{ p: '8px 10px', borderRadius: '10px', bgcolor: lectura.nivel === 'suave' ? tokens.amarilloFondo : tokens.surface2, fontSize: 14, display: 'grid', gap: '4px' }}>
              <b>{lectura.icono} {lectura.titulo}</b><span>{lectura.texto}</span>
              {(lectura.consejos as string[]).map((c) => <Box component="span" key={c} sx={{ color: 'text.secondary' }}>• {c}</Box>)}
            </Box>
          ) : null}
          <Box sx={GRIS}>{corto
            ? (corto.fuera.length || corto.menos ? <>⏱ Versión de <b>~{corto.minutos} min</b> (todo son ~{total}):{corto.menos ? <> <b>{corto.menos === 1 ? 'una serie' : '2 series'} menos</b> en cada ejercicio (así entran todos los músculos)</> : null}{corto.fuera.length ? <>{corto.menos ? ' y' : ''} {corto.fuera.length} ejercicio{corto.fuera.length > 1 ? 's' : ''} pasa{corto.fuera.length > 1 ? 'n' : ''} al final como «Hoy no entra»</> : null}.</> : <>⏱ Todo cabe en {l.min} min (~{total}).</>)
            : <>Lo que falta del día: <b>~{total} min</b>. Si tienes menos, elige cuánto y dejo lo principal.</>}</Box>
        </Box>
      ) : null}
    </Card>
  );
}

// ⬆ Los ejercicios en los que hoy toca subir el peso (aún sin empezar), en una línea
function TocaSubir({ d, sem }: { d: Fin; sem: number }) {
  if (sem !== semanaActual()) return null;
  const fuera = G.fueraHoy(d, sem) as Set<string>, lista = (d.ejercicios as Fin[]).filter((ej) => !fuera.has(ej.id) && ((r) => r.sube && !r.hechas)(G.resumenEj(ej, sem)));
  if (!lista.length) return null;
  const suave = nivelHoy(d.ejercicios[0], sem) === 'suave';
  return (
    <Box data-t="toca-subir" sx={{ m: '0 0 12px', p: '8px 10px', borderRadius: '10px', bgcolor: tokens.subeFondo, borderLeft: '4px solid', borderLeftColor: tokens.azul, fontSize: 14 }}>
      <Box component="b" sx={{ color: 'info.main' }}>⬆ Hoy toca subir en {lista.length}:</Box> {lista.map((ej) => ej.nombre).join(', ')}
      {suave ? <Box component="small" sx={{ display: 'block', color: 'text.secondary' }}>Pero hoy vas suave: déjalo para la próxima y repite el peso.</Box> : null}
    </Box>
  );
}

// 📏📸 Cada 4 semanas: medidas (en Dieta → Peso) y foto de progreso. Solo sale cuando toca
export function ChequeoMensual() {
  const c = chequeoMensual((e() as Fin).dias, iso()) as Fin;
  if (!c.medida.toca && !c.foto.toca) return null;
  const hace = (x: Fin) => (x.dias == null ? 'nunca' : 'hace ' + x.dias + ' días');
  return (
    <Box data-t="chequeo-mensual" sx={{ m: '0 0 12px', p: '8px 10px', borderRadius: '10px', bgcolor: tokens.surface2, fontSize: 14, display: 'grid', gap: '6px' }}>
      <b>📅 Revisión de cada 4 semanas</b>
      {c.medida.toca ? <Box sx={FILA}><span>📏 Medidas: <Box component="span" sx={GRIS}>{hace(c.medida)}</Box></span><Button size="small" color="secondary" href="#dieta/peso" sx={MINI}>Medirme →</Button></Box> : null}
      {c.foto.toca ? <Box sx={FILA}><span>📸 Foto de frente, lado y espalda: <Box component="span" sx={GRIS}>{hace(c.foto)}</Box></span><Button size="small" color="secondary" onClick={() => accion('gym-foto')} sx={MINI}>✓ Ya me la tomé</Button></Box> : null}
      <Box component="small" sx={{ color: 'text.secondary' }}>El peso solo engaña cuando ganas músculo: la cintura y la foto dicen la verdad. La foto queda en tu celular, aquí solo la fecha.</Box>
    </Box>
  );
}
function textoRegistro(r: Fin) {
  if (!r) return '—';
  const p = numero(r.peso), peso = p != null ? formatoPeso(p) : String(r.peso || '').trim();
  return (peso ? peso + ' ' + (r.unidad || 'kg') : 'sin peso') + (r.reps ? ' · ' + r.reps : '');
}

// Botón de una sesión guiada (calentamiento y extras)
function BotonSesion({ id, primario = false, texto = '' }: { id: string; primario?: boolean; texto?: string }) {
  const s = (e() as Fin).sesiones.find((x: Fin) => x.id === id);
  if (!s) return null;
  return <Button color={primario ? 'primary' : 'secondary'} data-accion="sesion" data-sesion={s.id} sx={{ minHeight: 56, fontSize: 17 }}>{(ICONO_SESION[s.tipo] || '▶') + ' ' + (texto || s.nombre)}</Button>;
}

export function calentamiento(d: Fin, sem: number) {
  if (!d.calentamiento) return null;
  const plan = G.pesoPlaneado(d, sem), aprox = plan ? aproximacion(plan.peso, plan.unidad) as Fin[] : [];
  const lista = aprox.length ? aprox : [[50, 8], [70, 5], [85, 2]].map(([p, reps]) => ({ pct: p, reps }));
  return (
    <TarjetaPlegable vista={VISTA} clave="🔥 Calentamiento" titulo="🔥 Calentamiento">
      <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' }}>
        <BotonSesion id={sesionCalentamiento(d)} primario texto="Calentamiento guiado" />
        {(extrasCalentamiento(d) as string[]).map((id) => <BotonSesion key={id} id={id} />)}
      </Box>
      {d.previo ? <Nota>{d.previo}</Nota> : null}
      <Nota>{plan ? <>Aproximación para <b>{plan.nombre}</b> (top set {formatoPeso(plan.peso)} {plan.unidad}):</> : 'Aproximación: escribe el peso del primer top set para calcularla.'}</Nota>
      <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {lista.map((x: Fin) => <Box component="span" key={x.pct} sx={{ bgcolor: 'background.default', borderRadius: '10px', p: '8px 12px', display: 'grid', textAlign: 'center' }}><small>{x.pct} %</small><b>{x.peso ? formatoPeso(x.peso) : '—'}</b> × {x.reps}</Box>)}
      </Box>
      <Desplegable titulo="Notas" abiertoAlInicio={!!d.notaCalentamiento} sx={{ mt: '8px' }}>
        <CampoLargoSolo aria-label="Notas del calentamiento" data-cambio="nota-calentamiento" data-dia={d.id} defaultValue={d.notaCalentamiento || ''} placeholder="Molestias, movilidad extra, cómo me sentí…" />
      </Desplegable>
    </TarjetaPlegable>
  );
}

// ---------- Una fila de series (Top, Back-off, Series) ----------
const cuando = (s: number, sem: number) => (s === 0 ? 'antes de la app' : s === sem ? 'esta semana' : 'semana ' + s + ' (hace ' + (sem - s) + ' sem)');
function lineaFuerza(ej: Fin, i: number, sem: number, v: Fin, conMeta: boolean) {
  const est0 = e() as Fin, hist = historial(sinDescargas(est0.semanas, est0), est0.rutina, ej, i, sem, v) as Fin[];
  if (!hist.length) return null;
  const u = hist[0].unidad, rec = (records(hist) as Fin[]).find((p) => p.semana === sem && sem > 0);
  const sub = ultimaSubida(hist) as Fin, est = estancamiento(hist.filter((p) => p.semana < sem)) as Fin, gris = { fontSize: 14, color: 'text.secondary', mt: '2px', '& b': { color: 'text.primary' } };
  if (rec) return <Box sx={{ fontSize: 14, fontWeight: 700, color: 'warning.main', mt: '2px' }}>🏆 Récord: 1RM estimado <b>{G.rm(rec.rm)} {u}</b> (antes {G.rm(rec.antes)})</Box>;
  // En la semana de descarga no se repite "haz una descarga": ya se está haciendo
  if (est && est.estancado && !esDescarga(sem, est0)) return (
    <Box sx={{ ...gris, color: 'warning.main' }}>⏸ {est.semanas} semanas sin superar <b>{formatoPeso(est.mejor.peso)} {u} × {est.mejor.reps}</b>
      <Box component="small" sx={{ display: 'block', color: 'text.secondary' }}>{consejoRir(G.rirReciente(ej, i, sem, v), true) || G.consejo(ej, est.semanas)}</Box></Box>
  );
  if (sub) return <Box sx={gris}>📈 Última subida: {formatoPeso(sub.de)} → <b>{formatoPeso(sub.a)} {u}</b> · {cuando(sub.semana, sem)}</Box>;
  return hist.length >= 2 && !conMeta ? <Box sx={gris}>Aún no has subido el peso: llega al tope de reps en todas las series para subir.</Box> : null;
}

// ⚠️ Series que se salen del esquema: se pregunta si quedaron incompletas (así no cuentan en la fuerza)
function avisosRaros(f: Fin, sem: number, clave: string, reg: Fin, ult: Fin) {
  const chip = { ...MINI, p: '4px 10px', fontWeight: 700, bgcolor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'divider' };
  return (seriesRaras(f, reg, ult) as Fin[]).filter((x) => x.estado !== 'ok').map((x) => {
    const datos = { sem, clave, i: x.i };
    return x.estado === 'incompleta'
      ? <Box key={x.i} sx={{ mt: '6px', p: '8px 10px', borderRadius: '10px', bgcolor: tokens.surface2, color: 'text.secondary', fontSize: 14 }}>
          {x.i === 'p' ? 'Registro marcado como mal anotado' : 'Serie ' + (x.i + 1) + ' marcada como incompleta'}: no cuenta en la fuerza. <Button variant="text" onClick={() => accion('gym-raro', { ...datos, v: 'quitar' })} sx={ENLACE}>Deshacer</Button>
        </Box>
      : <Box key={x.i} sx={{ display: 'grid', gap: '6px', mt: '6px', p: '8px 10px', borderRadius: '10px', bgcolor: tokens.amarilloFondo, color: 'warning.main', fontSize: 14 }}>
          <span>⚠️ {x.texto}. ¿{x.i === 'p' ? 'Peso mal anotado' : 'Registro incompleto'}?</span>
          <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <Button size="small" onClick={() => accion('gym-raro', { ...datos, v: 'inc' })} sx={chip}>Sí, que no cuente</Button>
            <Button size="small" onClick={() => accion('gym-raro', { ...datos, v: 'ok' })} sx={chip}>No, está bien</Button>
          </Box>
        </Box>;
  });
}

// sinRapida: en una biserie las series se anotan por ronda; en un ejercicio, el "＋ Serie" va solo en la fila que sigue
function fila(f: Fin, sem: number, clave: string, ej: Fin, i: number, sinRapida: boolean) {
  // 🔻 En descarga: la mitad de las series, el peso de la última semana normal y sin "sube" (src/descarga.js)
  const todo = e() as Fin, descarga = esDescarga(sem, todo), fd = filaDe(f, sem, todo) as Fin;
  const reg = regs(sem)[clave] || {}, est = estadoFila(fd, reg) as Fin, filtro = ej && G.filtroEn(ej, sem, G.sufijoDe(clave));
  const ult = (ultimoRegistro as Fin)(sinDescargas(todo.semanas, todo), f, sem, filtro, todo.rutina), sug0 = sugerencia(f, ult) as Fin, meta = G.metaDe(f, ult, sem) as Fin;
  const sug = meta && meta.liviano ? { sube: false, peso: meta.peso, texto: formatoPeso(meta.peso) + ' ' + meta.unidad }
    : descarga && sug0 && sug0.sube ? { sube: false, peso: numero(ult.peso), texto: formatoPeso(numero(ult.peso) as number) + ' ' + sug0.unidad } : sug0;
  const unidad = reg.unidad || (ult && ult.unidad) || 'kg', calent = !!(ej && ej.calentamiento), corporal = calent ? G.pesoDelDia(clave, sem) : null;
  const tipo = f.tipo.toLowerCase();
  return (
    <Box component="section" key={clave} sx={{ borderLeft: '5px solid', borderLeftColor: BORDE[est.color] || tokens.line, bgcolor: est.color === 'sube' ? tokens.subeFondo : 'background.default', borderRadius: '10px', p: '10px', mb: '8px', display: 'grid', gap: '8px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: 14 }}>
        <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', ...(TIPO[tipo] || { bgcolor: tokens.surface2 }) }}>{f.tipo}</Box>
        <Box component="span" sx={{ fontWeight: 700 }}>{f.esquema}{f.unidad === 's' ? ' (seg)' : ''}</Box>
        {descarga && fd.series < f.series ? <Box component="span" data-t="series-descarga" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, bgcolor: tokens.moradoFondo, color: tokens.moradoInk }}>🔻 {fd.series} de {f.series}</Box> : null}
        {(() => { const c = ej && sem === semanaActual() ? menosHoy(ej, sem) : 0, n = seriesCortas(fd.series, c); return c && n < fd.series ? <Box component="span" data-t="series-hoy" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, bgcolor: tokens.amarilloFondo, color: 'warning.main' }}>⏱ hoy {n}</Box> : null; })()}
        <Box component="span" title="Descanso" sx={{ color: 'text.secondary' }}>⏱ {reloj(f.descanso)}</Box>
        <Contador color={est.color} sx={{ ml: 'auto' }}>{est.hechas} / {est.plan}</Contador>
      </Box>
      {est.color === 'sube' && !calent && !descarga ? <Box sx={{ fontWeight: 800, color: 'info.main', fontSize: 14 }}>⬆ SUBE PESO la próxima semana <span>(+2,5–5 %)</span></Box> : null}
      {meta
        ? <Box sx={{ fontSize: 14, mt: '4px' }}>{meta.descarga || meta.liviano ? '🔻' : '🎯'} Hoy: <Box component="b" sx={{ color: meta.sube ? 'info.main' : 'primary.main' }}>{meta.texto}{meta.sube ? ' ⬆' : ''}</Box> <Box component="span" sx={GRIS}>· último <b>{textoRegistro(ult)}</b></Box><Box component="small" sx={{ display: 'block', color: 'text.secondary' }}>{meta.motivo}</Box></Box>
        : <Box sx={GRIS}>Último: <b>{textoRegistro(ult)}</b>{sug ? <> · Hoy: <Box component="b" sx={sug.sube ? { color: 'info.main !important' } : null}>{sug.texto}{sug.sube ? ' ⬆' : ''}</Box></> : null}</Box>}
      {meta && meta.sube && !calent && ej && nivelHoy(ej, sem) === 'suave' ? <Box data-t="suave" sx={{ fontSize: 14, color: 'warning.main' }}>🟡 Hoy vas suave: no subas, repite <b>{textoRegistro(ult)}</b> y sube la próxima.</Box> : null}
      {calent ? <Box sx={GRIS}>⚖️ {corporal ? <>Tu peso de ese día: <b>{G.kgCorporal(corporal)} kg</b> (se anota solo en cada serie)</> : 'Anota tu peso en Hoy (Sueño y peso) y se usa aquí solo'}</Box> : null}
      {ej ? lineaFuerza(ej, i, sem, filtro ? filtro.v : null, !!meta) : null}
      {avisosRaros(f, sem, clave, reg, ult)}
      {(() => { const b = bajonReps(fd, reg) as Fin; return b ? (
        <Box data-t="bajon" sx={{ fontSize: 14, p: '8px 10px', borderRadius: '10px', bgcolor: tokens.amarilloFondo, color: 'warning.main' }}>
          📉 Bajaste de {b.de} a {b.a} reps (−{Math.round(b.caida * 100)} %): el músculo ya recibió el trabajo. Si la próxima no llega a {f.min}, para aquí y pasa al siguiente.
        </Box>) : null; })()}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 96px', sm: '90px 96px 1fr' }, gap: '8px', '& input::placeholder': { fontSize: 14 } }}>
        <CampoSolo noVaciar aria-label="Peso" inputMode="decimal" enterKeyHint="next" data-sig="[data-serie]" data-cambio="peso" data-fila={clave} defaultValue={reg.peso || ''}
          placeholder={corporal ? G.kgCorporal(corporal) : calent ? 'Tu peso' : sug ? formatoPeso(sug.peso) : 'Peso'} />
        <NativeSelect key={unidad} defaultValue={unidad} input={<OutlinedInput />} inputProps={{ 'aria-label': 'Unidad', 'data-cambio': 'unidad', 'data-fila': clave } as object}>
          <option>kg</option><option>discos</option>
        </NativeSelect>
        <CampoSolo noVaciar aria-label="Repeticiones de cada serie, separadas por espacio" data-solo="reps" enterKeyHint="done" data-cambio="reps" data-fila={clave} defaultValue={reg.reps || ''} placeholder="Reps: 10 9 8" sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }} />
      </Box>
      {est.hechas < est.plan && !sinRapida ? (
        <Box data-ancla={'serie-' + clave} sx={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '8px', '& input': { minHeight: 44, minWidth: 0, boxSizing: 'border-box' } }}>
          <input type="text" inputMode="numeric" data-solo="reps" enterKeyHint="send" autoComplete="off" placeholder={f.unidad === 's' ? 'seg' : 'reps'} aria-label="Repeticiones de esta serie" title="Una serie (12) o varias de una vez (15 15)" data-serie={clave} />
          <Button data-accion="serie" data-fila={clave} sx={{ minHeight: 44 }}>＋ Serie {est.hechas + 1} y descanso</Button>
        </Box>
      ) : null}
      {est.hechas && f.unidad !== 's' ? (
        <Box role="group" aria-label="¿Cuántas reps te quedaban en la última serie?" title="¿Cuántas reps te quedaban en la última serie?" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 8px', fontSize: 13, color: 'text.secondary' }}>
          <span>Te quedaban:</span>
          <Box component="span" sx={{ display: 'flex', gap: '5px' }}>
            {[0, 1, 2, 3, 4].map((v) => { const si = reg.rir === v; return <Chip key={v} clickable size="small" aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={v === 4 ? '4+' : v} onClick={() => accion('gym-rir', { fila: clave, v })} sx={{ minWidth: 38 }} />; })}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

// ---------- Un ejercicio ----------
function chipsVariante(ej: Fin, sem: number, sufijo = '') {
  if (!tieneVariantes(ej)) return <Button variant="text" onClick={() => accion('gym-variante-nueva', { ej: ej.id, sufijo })} sx={{ ...ENLACE, fontSize: 13, color: 'text.secondary', mb: '6px' }}>⇄ Hoy lo hago de otra forma</Button>;
  const v = varianteEn(ej, regs(sem), sufijo);
  return (
    <Box role="group" aria-label={'Variante de ' + ej.nombre} sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', m: '2px 0 8px' }}>
      {(ej.variantes as string[]).map((x) => <Chip key={x} clickable size="small" aria-pressed={x === v} color={x === v ? 'primary' : 'default'} variant={x === v ? 'filled' : 'outlined'} label={x} onClick={() => accion('gym-variante', { ej: ej.id, sufijo, v: x })} />)}
      <Chip clickable size="small" variant="outlined" aria-label="Agregar variante" label="＋" onClick={() => accion('gym-variante-nueva', { ej: ej.id, sufijo })} />
    </Box>
  );
}
// El 1RM estimado de un ejercicio semana a semana, con su tabla (también en la tarjeta de Fuerza de Gym y Progreso)
export function HistorialEjercicio({ ej, sem, v }: { ej: Fin; sem: number; v: Fin }) {
  const h = G.datosHistorial(ej, sem, v) as { puntos: Fin[]; filas: Fin[][] } | null;
  if (!h) return null;
  return (
    <Box>
      <p className="nota-corta">1RM estimado de la mejor serie, semana a semana: así 60 × 10 y 65 × 7 se pueden comparar.</p>
      <Linea puntos={h.puntos} formato={G.rm} margenEje={1} />
      <TablaDatos columnas={['Semana', 'Peso', 'Reps', '1RM est.', '']} filas={h.filas} />
    </Box>
  );
}
function historialPlegado(ej: Fin, sem: number, v: Fin) {
  const est = e() as Fin;
  if ((historial(est.semanas, est.rutina, ej, 0, sem, v) as Fin[]).length < 2) return null;
  return <Desplegable perezoso titulo={'📈 Historial' + (v ? ' · ' + v : '')} sx={{ mb: '6px' }}><HistorialEjercicio ej={ej} sem={sem} v={v} /></Desplegable>;
}
const notas = (ej: Fin) => (
  <>
    {tecnicaEditar(ej)}
    <Desplegable titulo="Notas" abiertoAlInicio={!!ej.nota}>
      <CampoLargoSolo aria-label={'Notas de ' + ej.nombre} data-cambio="nota" data-ej={ej.id} defaultValue={ej.nota || ''} placeholder="Agarre, asiento, molestias…" />
    </Desplegable>
  </>
);
// 🎯 Técnica: las claves cortas siempre a la vista y el video (o buscar uno) a un toque
function tecnica(ej: Fin) {
  const video = videoValido(ej.video) ? ej.video : null;
  return (
    <Box data-t="tecnica" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 12px', m: '0 0 8px', fontSize: 14 }}>
      {ej.tecnica ? <Box component="span" sx={{ flex: '1 1 220px' }}>🎯 <b>{ej.tecnica}</b></Box> : null}
      <Box component="a" href={video || buscarVideo(ej.nombre)} target="_blank" rel="noopener noreferrer" sx={{ color: 'info.main', fontSize: 13 }}>{video ? '▶ Ver video' : '🔎 Buscar video de técnica'}</Box>
    </Box>
  );
}
const tecnicaEditar = (ej: Fin) => (
  <Desplegable titulo="🎯 Técnica" sx={{ mb: '6px' }}>
    <Box sx={{ display: 'grid', gap: '8px' }}>
      <Campo etiqueta="Claves (1 o 2, cortas)" data-cambio="gym-tecnica" data-ej={ej.id} data-k="tecnica" defaultValue={ej.tecnica || ''} placeholder="Ej.: codos pegados, pausa abajo" />
      <Campo etiqueta="Enlace del video" type="url" inputMode="url" data-cambio="gym-tecnica" data-ej={ej.id} data-k="video" defaultValue={ej.video || ''} placeholder="https://…" />
    </Box>
  </Desplegable>
);
function moverEj(ej: Fin) {
  const est = e() as Fin, d = est.rutina.find((x: Fin) => x.ejercicios.includes(ej)), i = d.ejercicios.indexOf(ej), n = d.ejercicios.length;
  if (n < 2) return null;
  const lista = 'rutina.' + est.rutina.indexOf(d) + '.ejercicios', sx = { minWidth: 36, minHeight: 36, fontSize: 16, bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', borderRadius: '10px', '&.Mui-disabled': { opacity: 0.35, color: 'text.primary' } };
  return (
    <Box component="span" sx={{ display: 'flex', gap: '4px', alignSelf: 'center' }}>
      <IconButton aria-label={'Subir ' + ej.nombre} disabled={i === 0} onClick={() => accion('ed-mover', { lista, i, n: -1 })} sx={sx}>↑</IconButton>
      <IconButton aria-label={'Bajar ' + ej.nombre} disabled={i === n - 1} onClick={() => accion('ed-mover', { lista, i, n: 1 })} sx={sx}>↓</IconButton>
    </Box>
  );
}
const BotonPlegar = ({ clave, nombre }: { clave: string; nombre: string }) => (
  <IconButton aria-expanded="true" aria-label={'Plegar ' + nombre} onClick={() => accion('gym-plegar', { clave, abierto: '1' })}
    sx={{ minWidth: 36, minHeight: 36, fontSize: 16, alignSelf: 'center', bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', borderRadius: '10px' }}>▾</IconButton>
);
const Ahora = () => <Box component="span" sx={{ flexBasis: '100%', color: 'primary.main', fontSize: 12, fontWeight: 800, letterSpacing: '.04em', textTransform: 'uppercase' }}>▶ Ahora</Box>;
const CABECERA = { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', mb: '8px', '& h3': { flex: 1, m: 0, fontSize: 17 } };
const Musculo = ({ children }: { children: ReactNode }) => <Box component="span" sx={{ color: 'text.secondary', fontSize: 13, whiteSpace: 'nowrap' }}>{children}</Box>;
const tarjeta = (actual: boolean) => ({ mb: '14px', scrollMarginTop: '90px', ...(actual ? { borderColor: 'primary.main', boxShadow: '0 0 0 1px ' + tokens.brand } : null) });

// Fila de un ejercicio plegado: se abre al tocarla
// fuera: hoy no entra en el tiempo elegido (⏱ versión corta): se ve apagado, y se puede abrir igual
function plegado(clave: string, titulo: ReactNode, sub: ReactNode, r: Fin, fuera = false, tiempo = '') {
  const listo = r.plan > 0 && r.hechas >= r.plan, color = listo ? 'completo' : r.hechas ? 'falta' : undefined;
  return (
    <Card component="article" key={clave} data-ancla={'ej-' + clave} data-fuera={fuera ? '' : undefined} sx={{ p: 0, mb: '8px', scrollMarginTop: '90px', ...(fuera ? { opacity: 0.55, borderStyle: 'dashed' } : null) }}>
      <ButtonBase aria-expanded="false" onClick={() => accion('gym-plegar', { clave, abierto: '0' })}
        sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto 14px', alignItems: 'center', gap: '10px', width: '100%', minHeight: 56, p: '8px 14px', color: 'text.primary', font: 'inherit', textAlign: 'left',
          '&:hover': { bgcolor: tokens.surface2 }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '-2px' } }}>
        <Box component="span" sx={{ display: 'grid', gap: '2px', minWidth: 0 }}>
          <span><b>{titulo}</b> <Box component="small" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: 13 }}>{sub}</Box></span>
          <Box component="span" sx={{ color: color ? 'text.primary' : 'text.secondary', fontSize: 14, overflowWrap: 'anywhere' }}>{fuera ? '⏭ Hoy no entra (poco tiempo) · ' : ''}{r.texto}{tiempo ? <Box component="span" sx={{ color: 'text.secondary' }}> · ⏱ {tiempo}</Box> : null}</Box>
        </Box>
        <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {r.sube && !r.hechas && !fuera ? <Contador color="sube" sx={{ fontSize: 13, whiteSpace: 'nowrap', p: '2px 8px' }}>⬆ Sube</Contador> : null}
          <Contador color={color} sx={{ fontSize: 14, whiteSpace: 'nowrap' }}>{listo ? '✓ ' : ''}{r.hechas} / {r.plan}</Contador>
        </Box>
        <Box component="span" aria-hidden="true" sx={{ color: 'text.secondary' }}>▸</Box>
      </ButtonBase>
    </Card>
  );
}

// 🤕 Molestia en este ejercicio hoy (leve o fuerte) y el aviso si la sentiste hace poco. Los chips salen cuando ya
// empezaste el ejercicio o si ya marcaste algo
const NIVEL: [number, string][] = [[1, 'Leve'], [2, 'Fuerte']];
function molestia(ej: Fin, empezado: boolean) {
  const hoy = molestiaHoy(ej.nombre) as number, antes = molestiaReciente(ej.nombre) as Fin;
  return (
    <>
      {antes && !hoy ? <Box data-t="molestia-antes" sx={{ fontSize: 14, color: 'warning.main' }}>⚠️ Hace {antes.dias === 1 ? '1 día' : antes.dias + ' días'} sentiste molestia {antes.nivel === 2 ? 'fuerte' : 'leve'} aquí: calienta bien y baja un poco el peso si vuelve.</Box> : null}
      {empezado || hoy ? (
        <Box role="group" aria-label={'¿Molestia en ' + ej.nombre + '?'} sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px 8px', fontSize: 13, color: 'text.secondary' }}>
          <span>🤕 ¿Molestia?</span>
          {NIVEL.map(([n, t]) => { const si = hoy === n; return <Chip key={n} clickable size="small" aria-pressed={si} color={si ? (n === 2 ? 'error' : 'warning') : 'default'} variant={si ? 'filled' : 'outlined'} label={t} onClick={() => accion('gym-molestia', { n: ej.nombre, v: n })} />; })}
        </Box>
      ) : null}
      {hoy === 2 ? <Box data-t="molestia-fuerte" sx={{ fontSize: 14, p: '8px 10px', borderRadius: '10px', bgcolor: tokens.surface2, color: 'error.main' }}>Para con este ejercicio hoy: si duele, no suma. Prueba otra forma («Hoy lo hago de otra forma») o pasa al siguiente.</Box> : null}
    </>
  );
}

function ejercicio(ej: Fin, sem: number, sufijo = '') {
  const est = e() as Fin, { ultimoEj, actualId } = G.verDia(), d = est.rutina.find((x: Fin) => x.ejercicios.includes(ej)), nombres = nombresBiserie(ej.nombre) as string[] | null, es = !sufijo && ej.id === actualId;
  const proxima = (ej.filas as Fin[]).findIndex((f) => { const x = estadoFila(filaDe(f, sem, est), regs(sem)[f.id + sufijo] || {}) as Fin; return x.hechas < x.plan; });
  const clave = ej.id + sufijo, v = varianteEn(ej, regs(sem), sufijo), fuera = !sufijo && d && (G.fueraHoy(d, sem) as Set<string>).has(ej.id);
  if (!G.estaAbierto(clave, !fuera && (es || (!sufijo && ej.id === ultimoEj && sem === semanaActual())))) { const t = d && !sufijo ? tiemposDe(d, sem)[ej.id] : null; return plegado(clave, nombreConVariante(ej, v), ej.musculo, G.resumenEj(ej, sem, sufijo), fuera, conTiempo(t) ? minutosTexto(t.ms) : ''); }
  return (
    <Card component="article" key={clave} data-ancla={'ej-' + clave} data-actual={es ? '' : undefined} sx={tarjeta(es)}>
      <Box component="header" sx={CABECERA}>
        {es ? <Ahora /> : null}<h3>{ej.nombre}</h3><Musculo>{ej.calentamiento ? '🔥 ' : ''}{ej.musculo}</Musculo>{moverEj(ej)}<BotonPlegar clave={clave} nombre={ej.nombre} />
      </Box>
      {nombres && !sufijo && d && d.id !== 'core' ? <Button variant="text" onClick={() => accion('gym-biserie', { ej: ej.id })} sx={{ ...ENLACE, display: 'block', m: '2px 0 6px' }}>🔁 Separar en biserie: {nombres.join(' + ')}</Button> : null}
      {chipsVariante(ej, sem, sufijo)}
      {tecnica(ej)}
      {!sufijo ? <AproxEjercicio ej={ej} sem={sem} /> : null}
      {(ej.filas as Fin[]).map((f, i) => fila(f, sem, f.id + sufijo, ej, i, i !== proxima))}
      {!sufijo && d ? lineaTiempo(ej, d, sem) : null}
      {!sufijo && sem === semanaActual() ? molestia(ej, G.avanceEj(ej, sem).hechas > 0) : null}
      {es && !sufijo ? <Button variant="text" onClick={() => accion('gym-ocupada', { ej: ej.id })} sx={{ ...ENLACE, display: 'block', mb: '4px' }}>⏭ Máquina ocupada: hago otro primero</Button> : null}
      {historialPlegado(ej, sem, v)}
      {notas(ej)}
    </Card>
  );
}

// Biserie: los dos ejercicios en una tarjeta (A1 y A2), cada uno con su peso, y una ronda que anota los dos y arranca el descanso
function biserie(a: Fin, b: Fin, sem: number) {
  const { ultimoEj, actualId } = G.verDia(), ea = G.avanceEj(a, sem), eb = G.avanceEj(b, sem), fa = ea.fila, fb = eb.fila;
  const plan = Math.max(ea.plan, eb.plan), ronda = Math.min(ea.hechas, eb.hechas) + 1;
  const descanso = Math.max(...[fa, fb, a.filas[0], b.filas[0]].filter(Boolean).map((f: Fin) => f.descanso));
  const es = actualId === a.id || actualId === b.id, clave = 'bis-' + a.id, d = (e() as Fin).rutina.find((x: Fin) => x.ejercicios.includes(a)), fuera = !!d && (G.fueraHoy(d, sem) as Set<string>).has(a.id);
  if (!G.estaAbierto(clave, !fuera && (es || ((ultimoEj === a.id || ultimoEj === b.id) && sem === semanaActual())))) {
    const ra = G.resumenEj(a, sem), rb = G.resumenEj(b, sem);
    return plegado(clave, '🔁 ' + a.nombre + ' + ' + b.nombre, 'biserie', { hechas: ra.hechas + rb.hechas, plan: ra.plan + rb.plan, sube: ra.sube || rb.sube, texto: ra.hechas + rb.hechas ? ra.texto + ' | ' + rb.texto : ra.texto }, fuera);
  }
  const parte = (ej: Fin, letra: string) => (
    <Box key={letra} sx={{ mt: '10px', pt: '10px', borderTop: '1px solid', borderColor: 'divider' }}>
      <Box component="h4" sx={{ display: 'flex', alignItems: 'center', gap: '8px', m: '0 0 6px', fontSize: 16 }}>
        <Box component="span" sx={{ display: 'inline-grid', placeItems: 'center', minWidth: 32, height: 24, borderRadius: '6px', bgcolor: tokens.azul, color: tokens.azulInk, fontSize: 13, fontWeight: 800 }}>{letra}</Box>{ej.nombre} <Box component="small" sx={{ color: 'text.secondary', fontWeight: 400 }}>{ej.musculo}</Box>
      </Box>
      {chipsVariante(ej, sem)}
      {tecnica(ej)}
      {(ej.filas as Fin[]).map((f, i) => fila(f, sem, f.id, ej, i, true))}
      {historialPlegado(ej, sem, varianteEn(ej, regs(sem)))}
      {notas(ej)}
    </Box>
  );
  // Cada campo va a la fila pendiente de su ejercicio; si ese ya terminó, no aparece
  const campo = (f: Fin, ej: Fin, letra: string) => (f ? <Campo key={letra} etiqueta={letra + ' · ' + ej.nombre + (ej.filas.length > 1 ? ' (' + f.tipo + ' ' + f.esquema + ')' : '')} inputMode="numeric" placeholder="reps" data-serie={'ronda@' + f.id} /> : null);
  return (
    <Card component="article" key={clave} data-ancla={'ej-' + clave} data-actual={es ? '' : undefined} sx={tarjeta(es)}>
      <Box component="header" sx={CABECERA}>
        {es ? <Ahora /> : null}<h3>🔁 Biserie</h3><Musculo>sin descanso entre los dos · ⏱ {reloj(descanso)} después</Musculo><BotonPlegar clave={clave} nombre="la biserie" />
      </Box>
      {parte(a, 'A1')}{parte(b, 'A2')}
      {fa || fb
        ? <Box data-ronda="" sx={{ mt: '12px', p: '10px', borderRadius: '10px', bgcolor: tokens.surface2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>{campo(fa, a, 'A1')}{campo(fb, b, 'A2')}</Box>
            <Button fullWidth data-accion="gym-ronda" data-a={a.id} data-b={b.id} sx={{ mt: '6px' }}>＋ Ronda {Math.min(ronda, plan)} de {plan} y descanso</Button>
          </Box>
        : <Nota sx={{ textAlign: 'center' }}>✓ {plan} rondas hechas</Nota>}
      <Button variant="text" onClick={() => accion('gym-biserie-quitar', { ej: a.id })} sx={ENLACE}>Ya no es biserie (separar las tarjetas)</Button>
    </Card>
  );
}

// Core al final de cualquier día: se anota en el día que se hace y cuenta para el total de la semana
function core(d: Fin, sem: number) {
  const c = (e() as Fin).rutina.find((x: Fin) => x.id === 'core');
  if (!c) return null;
  const sufijo = '@' + d.id, r = regs(sem), hoyAlgo = Object.keys(r).some((k) => k.endsWith(sufijo) && (repsDe(r[k].reps) as Fin[]).length), semana = resumenSemana([c], r) as Fin;
  return (
    <Desplegable abiertoAlInicio={hoyAlgo} titulo={<><b>💪 Core</b> · al final del día · {semana.hechas} / {semana.plan} series esta semana</>} sx={{ mb: '14px' }}>
      {(c.ejercicios as Fin[]).map((ej) => ejercicio(ej, sem, sufijo))}
    </Desplegable>
  );
}

// ⏱ Cronómetro del cardio (aparte del de fuerza): al terminar pone los minutos de abajo
const dosDig = (n: number) => String(n).padStart(2, '0');
const enReloj = (ms: number) => { const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return (h ? h + ':' + dosDig(m) : m) + ':' + dosDig(s % 60); };
function CronoCardio({ d, sem, c }: { d: Fin; sem: number; c: Fin }) {
  const corre = !!(c.inicio && !c.fin), [ahora, ponerAhora] = useState(Date.now()), actual = sem === semanaActual();
  useEffect(() => { if (!corre) return undefined; const t = setInterval(() => ponerAhora(Date.now()), 1000); return () => clearInterval(t); }, [corre]);
  const caja = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', p: '8px 10px', borderRadius: '10px', bgcolor: 'background.default', border: '1px solid', borderColor: corre ? 'primary.main' : 'divider', fontSize: 14 };
  if (corre) return (
    <Box data-t="crono-cardio" sx={caja}>
      <span>🏃 Cardio <Box component="b" role="timer" sx={{ fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{enReloj(ahora - c.inicio)}</Box> <Box component="span" sx={GRIS}>· desde las {hora(c.inicio)}</Box></span>
      {actual ? <Button size="small" color="secondary" onClick={() => accion('cardio-terminar', { dia: d.id })} sx={MINI}>⏹ Terminar</Button> : null}
    </Box>
  );
  if (c.inicio && c.fin) return (
    <Box data-t="crono-cardio" sx={caja}>
      <span>✓ Cardio: <b>{c.min ?? Math.round((c.fin - c.inicio) / 60000)} min</b> <Box component="span" sx={GRIS}>({hora(c.inicio)} – {hora(c.fin)})</Box></span>
      {actual ? <Button size="small" color="secondary" onClick={() => accion('cardio-seguir', { dia: d.id })} sx={MINI}>↺ Seguir</Button> : null}
    </Box>
  );
  if (!actual || hayCardio(c)) return null;
  return (
    <Box data-t="crono-cardio" sx={caja}>
      <Box component="span" sx={GRIS}>⏱ Cronómetro del cardio, aparte de la fuerza</Box>
      <Button size="small" color="secondary" onClick={() => accion('cardio-empezar', { dia: d.id })} sx={MINI}>▶ Empezar cardio</Button>
    </Box>
  );
}

function cardio(d: Fin, sem: number) {
  if (!d.cardio) return null;
  const est = e() as Fin, c = regs(sem)[claveCardio(d)] || {}, ult = G.ultimoCardio(d, sem), i = est.rutina.indexOf(d), hecho = hayCardio(c), titulo = '🏃 ' + d.cardio;
  return (
    <TarjetaPlegable vista={VISTA} clave={titulo} titulo={titulo} sx={hecho ? { borderColor: 'primary.main' } : undefined}
      lado={hecho ? <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, bgcolor: tokens.brandSoft, color: tokens.brand, whiteSpace: 'nowrap' }}>✓ Hecho</Box> : null}>
      <Box sx={{ display: 'grid', gap: '8px' }}>
        <CronoCardio d={d} sem={sem} c={c} />
        <Nota sx={{ m: 0 }}>Plan: {G.planCardio()}</Nota>
        {ult ? <Box component="p" sx={{ ...GRIS, m: 0 }}>Último (semana {ult.semana}): <b>{textoCardio(ult)}</b></Box> : null}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' }}>
          {(CAMPOS_CARDIO as [string, string, string][]).map(([k, t, paso]) => (
            <Campo key={k} etiqueta={t} inputMode="decimal" min="0" step={paso} data-cambio="cardio" data-dia={d.id} data-k={k} defaultValue={c[k] ?? ''} placeholder={ult && ult[k] != null && ult[k] !== '' ? String(ult[k]) : undefined} />
          ))}
        </Box>
        <Campo etiqueta="Nota" data-cambio="cardio" data-dia={d.id} data-k="nota" defaultValue={c.nota || ''} placeholder="Ej.: escaladora en vez de cinta, me sentí pesado…" />
        {ult && !hecho ? <Button color="secondary" onClick={() => accion('cardio-repetir', { dia: d.id })} sx={{ justifySelf: 'start' }}>↻ Igual que la última vez</Button> : null}
        <Desplegable titulo="Editar plan del cardio">
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Campo etiqueta="Cardio de este día" data-cambio="ed" data-ruta={'rutina.' + i + '.cardio'} defaultValue={d.cardio} />
            <Campo etiqueta="Parámetros (todos los días)" data-cambio="ed" data-ruta="config.cardioPlan" defaultValue={G.planCardio()} />
          </Box>
        </Desplegable>
      </Box>
    </TarjetaPlegable>
  );
}

// Al terminar: cómo fue cada ejercicio y el prompt completo para que Claude lo analice como entrenador
function analisis(d: Fin, sem: number) {
  const lista = resumenEjercicios(d, sem) as Fin[], cuenta = (k: string) => lista.filter((x) => x.estado === k).length;
  const ICONO = ICONO_ESTADO as Record<string, string>, TEXTO = TEXTO_ESTADO as Record<string, string>;
  return (
    <TarjetaPlegable vista={VISTA} clave="🧠 Análisis del entreno" titulo="🧠 Análisis del entreno">
      <Nota>{[cuenta('record') && '🏆 ' + cuenta('record') + ' récord' + (cuenta('record') > 1 ? 's' : ''), cuenta('sube') && '⬆️ ' + cuenta('sube') + ' subieron',
        cuenta('igual') && '➖ ' + cuenta('igual') + ' igual', cuenta('baja') && '⬇️ ' + cuenta('baja') + ' bajaron', cuenta('estancado') && '⚠️ ' + cuenta('estancado') + ' estancados'].filter(Boolean).join(' · ')}</Nota>
      <Box component="ul" sx={{ listStyle: 'none', m: '8px 0 12px', p: 0, display: 'grid', gap: '8px' }}>
        {lista.map((x) => (
          <Box component="li" key={x.nombre} sx={x.estado === 'sin-dato' ? { opacity: 0.6 } : null}>
            <Box component="span" sx={{ display: 'grid', gap: '2px' }}>
              <b>{ICONO[x.estado]} {x.nombre}</b>
              <Box component="small" sx={{ color: 'text.secondary' }}>{TEXTO[x.estado] + (x.cambio != null && Math.abs(x.cambio) >= 0.005 ? ' (' + (x.cambio > 0 ? '+' : '') + (Math.round(x.cambio * 1000) / 10).toLocaleString('es-CO') + ' %)' : '') +
                (x.semanasParado >= 3 ? ' · ' + x.semanasParado + ' semanas sin récord' : '') + (x.meta ? ' · próxima: ' + x.meta : '')}</Box>
            </Box>
          </Box>
        ))}
      </Box>
      <Button fullWidth onClick={() => accion('gym-analisis', { dia: d.id })}>📋 Copiar análisis completo para Claude</Button>
      <Nota>Lleva la sesión, el historial de cada ejercicio, el volumen por músculo, el sueño, la proteína, el peso y el fútbol, con las instrucciones para que te responda como entrenador. Pégalo en Claude.</Nota>
      <Desplegable perezoso titulo="Ver el texto">
        <Box component="textarea" id="prompt-entreno" readOnly rows={10} value={promptEntreno(d, sem, textoDia(d, sem))}
          sx={{ width: '100%', boxSizing: 'border-box', whiteSpace: 'pre-wrap', font: '13px/1.5 ui-monospace, Consolas, monospace', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: '10px', p: '10px' }} />
      </Desplegable>
    </TarjetaPlegable>
  );
}

// ⏱ Cuánto llevas de entreno hoy. Arranca solo con la primera serie (o con el botón); Terminar lo deja guardado
const hora = (ts: number) => new Date(ts).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
const hhmm = (ts: number) => { const f = new Date(ts); return String(f.getHours()).padStart(2, '0') + ':' + String(f.getMinutes()).padStart(2, '0'); };
// Cada día de la rutina muestra SU contador (el de la fecha en que se entrenó esa semana), no el de hoy: así al volver
// al lunes se ve cuánto duró. Solo el de hoy tiene botones; el cardio va aparte y aquí se suma al total
function ContadorEntreno({ d, sem }: { d: Fin; sem: number }) {
  const hoyX = entrenoHoy() as Fin, x = hoyX && hoyX.dia === d.id ? hoyX : null, [ahora, ponerAhora] = useState(Date.now()), corre = !!(x && !x.fin), [editar, ponerEditar] = useState(false);
  useEffect(() => { if (!corre) return undefined; const t = setInterval(() => ponerAhora(Date.now()), 1000); return () => clearInterval(t); }, [corre]);
  // Olvidaste tocar Terminar: después de 90 min sin series se cierra solo, 5 min después de la última
  const quieto = entrenoQuieto(x, ahora);
  useEffect(() => { if (quieto) accion('gym-entreno-terminar', { en: (x.ultimo || x.inicio) + 5 * 60000 }); }, [quieto]);
  const caja = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', m: '0 0 12px', p: '8px 10px', borderRadius: '10px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', fontSize: 14 };
  const t = tiemposDia(d, sem, e(), ahora) as Fin, cardioYTotal = t.cardio && t.fuerza ? <Box component="span" sx={GRIS}> · 🏃 cardio {duracion(t.cardio.min)} · total <b>{duracion(t.total)}</b>{t.gym && t.gym.min - t.total >= 5 ? <> · en el gym {duracion(t.gym.min)} ({hora(t.gym.inicio)} – {hora(t.gym.fin)})</> : null}</Box> : null;
  // ✏️ Corregir las horas (un entreno de más de 3 h casi seguro es un error: lo avisa y abre la corrección)
  const raro = !!(t.fuerza && !t.fuerza.enCurso && t.fuerza.min > ENTRENO_RARO), abierto = editar || raro;
  // Abierta por el aviso, queda abierta al corregir el inicio (así se puede corregir también el fin)
  useEffect(() => { if (raro) ponerEditar(true); }, [raro]);
  const lapiz = t.fuerza && !t.fuerza.enCurso ? <Button size="small" color="secondary" aria-label="Corregir las horas del entreno" aria-expanded={abierto} onClick={() => ponerEditar(!abierto)} sx={MINI}>✏️</Button> : null;
  const correccion = abierto && t.fuerza && !t.fuerza.enCurso ? (
    <Box sx={{ flexBasis: '100%', display: 'grid', gap: '6px' }}>
      {raro ? <Box component="p" sx={{ m: 0, color: 'warning.main' }}>⚠️ Más de 3 horas parece un error del contador (una serie anotada mucho antes o mucho después). Pon la hora real:</Box> : null}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <Campo key={'i' + t.fuerza.inicio} etiqueta="Empecé a las" type="time" data-cambio="entreno-hora" data-f={t.fuerza.fecha} data-k="inicio" defaultValue={hhmm(t.fuerza.inicio)} />
        <Campo key={'f' + t.fuerza.fin} etiqueta="Terminé a las" type="time" data-cambio="entreno-hora" data-f={t.fuerza.fecha} data-k="fin" defaultValue={hhmm(t.fuerza.fin)} />
      </Box>
    </Box>
  ) : null;
  // Otro día (o el de hoy ya cerrado): lo que duró, para consultarlo siempre
  if (!x && t.fuerza) return (
    <Box data-t="entreno" sx={[caja, raro ? { borderColor: 'warning.main' } : null]}>
      <span>✓ Fuerza el {fechaCorta(t.fuerza.fecha)}: <b>{duracion(t.fuerza.min)}</b> <Box component="span" sx={GRIS}>({hora(t.fuerza.inicio)} – {hora(t.fuerza.fin)})</Box>{cardioYTotal}</span>
      {lapiz}
      {correccion}
    </Box>
  );
  if (sem !== semanaActual()) return null;
  // Hoy ya se entrenó otro día de la rutina: este no arranca solo
  if (!x && hoyX) return null;
  if (!x) return (
    <Box data-t="entreno" sx={caja}>
      <Box component="span" sx={GRIS}>⏱ El contador del entreno arranca con tu primera serie</Box>
      <Button size="small" color="secondary" onClick={() => accion('gym-entreno-empezar', { dia: d.id })} sx={MINI}>▶ Empezar ya</Button>
    </Box>
  );
  if (x.fin) return (
    <Box data-t="entreno" sx={caja}>
      <span>✓ Fuerza hoy: <b>{duracion(t.fuerza ? t.fuerza.min : minutosEntreno(x))}</b> <Box component="span" sx={GRIS}>({hora(x.inicio)} – {hora(x.fin)})</Box>{cardioYTotal}</span>
      <Box sx={{ display: 'flex', gap: '6px' }}>{lapiz}<Button size="small" color="secondary" onClick={() => accion('gym-entreno-seguir')} sx={MINI}>↺ Seguir</Button></Box>
      {correccion}
    </Box>
  );
  // Sin el rato del cardio (si después del cardio tocaste "↺ Seguir")
  const s = Math.max(0, Math.floor((t.fuerza ? t.fuerza.ms : ahora - x.inicio) / 1000)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), dos = (n: number) => String(n).padStart(2, '0');
  return (
    <Box data-t="entreno" sx={[caja, { borderColor: 'primary.main' }]}>
      <span>⏱ Fuerza <Box component="b" role="timer" sx={{ fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{(h ? h + ':' + dos(m) : m) + ':' + dos(s % 60)}</Box> <Box component="span" sx={GRIS}>· desde las {hora(x.inicio)}</Box></span>
      <Button size="small" color="secondary" onClick={() => accion('gym-entreno-terminar')} sx={MINI}>⏹ Terminar</Button>
    </Box>
  );
}

// Baja al ejercicio en el que vas cuando la vista lo pide (al abrir el día o terminar un ejercicio)
function IrAlActual({ ir }: { ir: boolean }) {
  useEffect(() => { if (ir) { const t = setTimeout(G.irAlActual, 60); return () => clearTimeout(t); } return undefined; });
  return null;
}

// ⏱ Con la versión corta, lo que hoy no entra pasa al final (el orden de la rutina no cambia)
function ordenCorto(d: Fin, sem: number) {
  const grupos = gruposDia(d.ejercicios) as Fin[][], fuera = G.fueraHoy(d, sem) as Set<string>;
  if (!fuera.size) return grupos;
  return [...grupos.filter((g) => !fuera.has(g[0].id)), ...grupos.filter((g) => fuera.has(g[0].id))];
}

export function dia(d: Fin, sem: number) {
  const r = resumenSemana(rutinaDe([d], sem, e()), regs(sem)) as Fin, ir = G.prepararDia(d, sem) as boolean;
  return (
    <>
      {/* 🛌 Descarga sin ir: esa semana no toca gym; si igual vienes, se anota con la mitad de las series */}
      {esDescanso(sem, e()) && d.id !== 'core' ? (
        <Box data-t="dia-descanso" sx={{ m: '0 0 12px', p: '10px 12px', borderRadius: '10px', bgcolor: tokens.moradoFondo, color: tokens.moradoInk, fontSize: 14, display: 'grid', gap: '4px' }}>
          <b>🛌 Esta semana descansas: hoy no toca gym</b>
          <Box component="span" sx={{ color: 'text.primary' }}>Camina 30-45 minutos o haz 10 de movilidad si quieres moverte. Si igual vienes, la app te pone la mitad de las series y el mismo peso.</Box>
        </Box>
      ) : null}
      <DescansoDia d={d} sem={sem} />
      {calentamiento(d, sem)}
      <Box sx={{ ...FILA, mt: '4px', mb: '6px' }}><b>{d.nombre}</b><span>{r.hechas} / {r.plan} series</span></Box>
      <Avance parte={r.plan ? r.hechas / r.plan : 0} />
      <ContadorEntreno d={d} sem={sem} />
      <TiemposPorEjercicio d={d} sem={sem} />
      <AntesDeEntrenar key={d.id} d={d} sem={sem} />
      <TocaSubir d={d} sem={sem} />
      {sem === semanaActual() ? <ChequeoMensual /> : null}
      <FutbolHoy d={d} sem={sem} />
      <AvisoPesos d={d} sem={sem} />
      <Esencial d={d} sem={sem} />
      <Ocupadas d={d} sem={sem} />
      {ordenCorto(d, sem).map((g) => (g.length === 2 ? biserie(g[0], g[1], sem) : ejercicio(g[0], sem)))}
      {core(d, sem)}
      {cardio(d, sem)}
      {r.hechas ? <>
        <Box sx={{ display: 'grid', gap: '4px', m: '0 0 12px', '& > button': { justifySelf: 'start' } }}>
          <Button color="secondary" onClick={() => accion('gym-copiar', { dia: d.id })}>📋 Copiar resumen del día</Button>
          <Button color="secondary" onClick={() => accion('gym-imagen', { dia: d.id })}>🖼️ Imagen del resumen</Button>
          <Desplegable titulo="Ver texto">
            <Box component="pre" sx={{ whiteSpace: 'pre-wrap', font: '13px/1.5 ui-monospace, Consolas, monospace', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: '10px', p: '10px', m: '4px 0 0', userSelect: 'all', overflowWrap: 'anywhere' }}>{textoDia(d, sem)}</Box>
          </Desplegable>
        </Box>
        {analisis(d, sem)}
        <HoyVsUltima d={d} sem={sem} />
        <ComoTeFue d={d} sem={sem} />
      </> : null}
      <IrAlActual ir={ir} />
    </>
  );
}
