// 🏋️ Más para el día de gym (agregado, sin cambiar lo de antes): pesos que parecen copiados, día de fútbol, lo esencial si vas
// corto de tiempo, alternativas si la máquina está ocupada, aproximación de cada ejercicio grande, hoy contra la última vez,
// cómo te fue, y en el Resumen el volumen que planea tu rutina por músculo. La lógica está en src/gym-extra.js
import type { ReactNode } from 'react';
import { Box, Button, Card, Chip } from '@mui/material';
import { e, semanaActual, hayFutbol } from '../../estado.js';
import { iso, sumarDias, lunesDe } from '../../fechas.js';
import { ultimoRegistro, sugerencia, numero, formatoPeso, aproximacion, estadoFila } from '../../gym.js';
import { sinDescargas, filaDe } from '../../descarga.js';
import { esDiaPierna } from '../../entreno-hoy.js';
import { piezasGym, estaSaltado } from '../../vistas/gym.js';
import { pesosCopiados, pesoRevisado, consejoFutbol, loEsencial, esCompuesto, volumenPlan, hoyVsUltima, sensacionDe, anotarSensacion, queTeHaceRendir, alternativas } from '../../gym-extra.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { Desplegable } from '../ui/Desplegable';
import { Nota } from '../ui/Textos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const G = piezasGym as Fin;
const GRIS = { color: 'text.secondary', fontSize: 14 };
const regs = (sem: number) => ((e() as Fin).semanas || {})[sem] || {};
const ultimoDe = (sem: number) => (f: Fin) => { const est = e() as Fin; return (ultimoRegistro as Fin)(sinDescargas(est.semanas, est), f, sem, null, est.rutina); };
const juntar = (l: string[]) => (l.length <= 1 ? l.join('') : l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1]);
// La fecha del día de la rutina en esa semana (el lunes de la semana + su día)
const fechaDe = (d: Fin, sem: number) => (d.diaSemana ? sumarDias(lunesDe(sem), d.diaSemana - 1) : iso());
const Aviso = ({ t, color, fondo, children }: { t: string; color?: string; fondo: string; children: ReactNode }) => (
  <Box data-t={t} sx={{ m: '0 0 12px', p: '10px 12px', borderRadius: '10px', bgcolor: fondo, color: color || 'text.primary', fontSize: 14, display: 'grid', gap: '6px' }}>{children}</Box>
);

// ---------- 1. ⚠️ Pesos que parecen copiados ----------
export function AvisoPesos({ d, sem }: { d: Fin; sem: number }) {
  const l = pesosCopiados(d, regs(sem), ultimoDe(sem), (e() as Fin).config.gymPesoOk || {}) as Fin[];
  if (!l.length) return null;
  return (
    <Aviso t="pesos-copiados" fondo={tokens.amarilloFondo} color="warning.main">
      <b>⚠️ ¿Pesos copiados?</b>
      {l.map((g) => (
        <Box key={g.clave} sx={{ display: 'grid', gap: '6px' }}>
          <span><b>{formatoPeso(g.peso)} {g.unidad}</b> en {juntar([...new Set(g.ejercicios as string[])])} ({g.hoy ? 'hoy' : 'la última vez'}). Es raro mover lo mismo en ejercicios tan distintos.</span>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <Button size="small" color="secondary" onClick={() => pesoRevisado(g.clave)} sx={{ minHeight: 40 }}>Está bien, es real</Button>
            <Box component="small" sx={{ color: 'text.secondary' }}>Si no, al anotar pon el peso que de verdad levantas: la app sugiere sus metas con esos números.</Box>
          </Box>
        </Box>
      ))}
    </Aviso>
  );
}

// ---------- 2. ⚽ Día de fútbol ----------
export function FutbolHoy({ d, sem }: { d: Fin; sem: number }) {
  if (sem !== semanaActual() || d.id === 'core') return null;
  const f = fechaDe(d, sem), c = consejoFutbol({ hoy: hayFutbol(f), manana: hayFutbol(sumarDias(f, 1)), ayer: hayFutbol(sumarDias(f, -1)) }, esDiaPierna(d), !!d.cardio) as Fin;
  if (!c) return null;
  return (
    <Aviso t="futbol-hoy" fondo={tokens.subeFondo}>
      <b>⚽ {c.cuando === 'hoy' ? 'Hoy juegas fútbol' : c.cuando === 'mañana' ? 'Mañana juegas fútbol' : 'Ayer jugaste fútbol'}</b>
      <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '2px' }}>{(c.consejos as string[]).map((x) => <li key={x}>{x}</li>)}</Box>
    </Aviso>
  );
}

// ---------- 3. ⏱ Lo esencial si vas corto de tiempo ----------
export function Esencial({ d, sem }: { d: Fin; sem: number }) {
  if (sem !== semanaActual() || d.id === 'core') return null;
  const { esencial, extra } = loEsencial(d) as Fin;
  if (!extra.length) return null;
  return (
    <Desplegable titulo={<>⏱ <b>¿Poco tiempo?</b> Lo esencial de hoy ({esencial.length} de {esencial.length + extra.length})</>} sx={{ mb: '12px' }}>
      <Box sx={{ display: 'grid', gap: '6px', fontSize: 14 }}>
        <span><b>No te los saltes:</b> {juntar((esencial as Fin[]).map((x) => x.nombre))}. Son los que más músculo mueven.</span>
        <span style={{ opacity: 0.85 }}><b>Si te queda tiempo:</b> {juntar((extra as Fin[]).map((x) => x.nombre))}.</span>
        <Nota sx={{ m: 0 }}>Con 45-60 minutos, haz lo esencial completo antes que todo a medias. "¿Cómo llegas hoy? → Tengo 30/45/60 min" te acomoda las series.</Nota>
      </Box>
    </Desplegable>
  );
}

// ---------- 10. 🔁 Máquina ocupada: alternativas ----------
export function Ocupadas({ d, sem }: { d: Fin; sem: number }) {
  if (sem !== semanaActual()) return null;
  const l = (d.ejercicios as Fin[]).filter((ej) => estaSaltado(ej.id));
  if (!l.length) return null;
  return (
    <Aviso t="ocupadas" fondo={tokens.surface2}>
      {l.map((ej) => { const alt = alternativas(ej) as string[]; return (
        <span key={ej.id}>⏭ <b>{ej.nombre}</b> quedó para después.{alt.length ? <> Si sigue ocupada, cámbiala por: <b>{alt.join(' · ')}</b> (mismo músculo, mismo rango de reps).</> : null}</span>
      ); })}
    </Aviso>
  );
}

// ---------- 8. 🔥 Aproximación de cada ejercicio grande ----------
// Antes de la primera serie: 70 % × 5 y 85 % × 2 (ya vienes caliente). El primero del día la tiene en el calentamiento
export function AproxEjercicio({ ej, sem }: { ej: Fin; sem: number }) {
  if (sem !== semanaActual() || !esCompuesto(ej)) return null;
  const d = (e() as Fin).rutina.find((x: Fin) => x.ejercicios.includes(ej)), primero = d && G.pesoPlaneado(d, sem);
  if (primero && primero.nombre === ej.nombre) return null;
  const f = ej.filas[0], reg = regs(sem)[f.id] || {};
  if ((estadoFila(filaDe(f, sem, e()), reg) as Fin).hechas) return null;
  const sug = sugerencia(f, ultimoDe(sem)(f)) as Fin, peso = numero(reg.peso) ?? (sug && sug.peso), unidad = reg.unidad || (sug && sug.unidad) || 'kg';
  if (!(peso >= 20) || unidad !== 'kg') return null;
  const pasos = (aproximacion(peso, unidad) as Fin[]).slice(1);
  return (
    <Box data-t="aprox-ej" sx={{ ...GRIS, m: '2px 0 6px' }}>🔥 Antes de la primera serie: {pasos.map((x) => formatoPeso(x.peso) + ' kg × ' + x.reps).join(' · ')} <Box component="small" sx={{ color: 'text.secondary' }}>(sin cansarte)</Box></Box>
  );
}

// ---------- 6. 🏆 Hoy contra la última vez ----------
export function HoyVsUltima({ d, sem }: { d: Fin; sem: number }) {
  const l = (hoyVsUltima(d, regs(sem), ultimoDe(sem)) as Fin[]).filter((x) => x.antes);
  if (!l.length) return null;
  const suben = l.filter((x) => x.cambio > 0.005), bajan = l.filter((x) => x.cambio < -0.005);
  const fila = (x: Fin) => (
    <Box key={x.nombre} sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', py: '4px', borderBottom: '1px solid', borderColor: 'divider' }}>
      <span>{x.nombre}<Box component="small" sx={{ display: 'block', color: 'text.secondary' }}>{formatoPeso(x.antes.peso)} × {x.antes.reps} → {formatoPeso(x.hoy.peso)} × {x.hoy.reps}</Box></span>
      <Box component="b" sx={{ color: x.cambio > 0.005 ? 'success.main' : x.cambio < -0.005 ? 'warning.main' : 'text.secondary', whiteSpace: 'nowrap' }}>{x.cambio > 0.005 ? '⬆ ' : x.cambio < -0.005 ? '⬇ ' : '= '}{Math.round(Math.abs(x.cambio) * 100)} %</Box>
    </Box>
  );
  return (
    <Card component="section" data-t="hoy-vs-ultima" sx={{ mb: '12px', display: 'grid', gap: '6px', fontSize: 14 }}>
      <Box component="h3" sx={{ m: 0, fontSize: 17 }}>🏆 Hoy contra la última vez</Box>
      <span>{suben.length ? '⬆ Mejoraste en ' + suben.length : 'Sin mejoras todavía'}{bajan.length ? ' · ⬇ bajaste en ' + bajan.length : ''} <Box component="small" sx={{ color: 'text.secondary' }}>(1RM estimado de la mejor serie)</Box></span>
      {[...suben, ...bajan, ...l.filter((x) => !suben.includes(x) && !bajan.includes(x))].map(fila)}
      {bajan.length >= 3 ? <Nota sx={{ m: 0 }}>Bajaste en 3 o más: suele ser sueño, comida o el partido de ayer, no falta de fuerza. Revisa "¿Cómo llegas hoy?".</Nota> : null}
    </Card>
  );
}

// ---------- 7. ⭐ Cómo te fue ----------
export function ComoTeFue({ d, sem }: { d: Fin; sem: number }) {
  usarEstado();
  if (sem !== semanaActual() || d.id === 'core') return null;
  const s = (sensacionDe() || {}) as Fin, r = queTeHaceRendir((e() as Fin).dias) as Fin;
  return (
    <Card component="section" data-t="como-te-fue" sx={{ mb: '12px', display: 'grid', gap: '8px', fontSize: 14 }}>
      <Box component="h3" sx={{ m: 0, fontSize: 17 }}>⭐ ¿Cómo te fue hoy?</Box>
      <Box role="group" aria-label="Cómo te fue del 1 al 5" sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {[[1, '😫'], [2, '😕'], [3, '😐'], [4, '🙂'], [5, '💪']].map(([n, ic]) => { const si = s.n === n; return <Chip key={n} clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={ic + ' ' + n} onClick={() => anotarSensacion('n', n as number)} sx={{ minHeight: 40 }} />; })}
        <Chip clickable aria-pressed={!!s.dolor} color={s.dolor ? 'warning' : 'default'} variant={s.dolor ? 'filled' : 'outlined'} label="🤕 Algo dolió" onClick={() => anotarSensacion('dolor', 1)} sx={{ minHeight: 40 }} />
      </Box>
      {s.dolor ? <Box sx={{ color: 'warning.main' }}>Anótalo en el ejercicio (🤕 en cada uno) y la próxima vez baja el peso de ese. Si el dolor es en la articulación y sigue 2 semanas, que te lo revisen.</Box> : null}
      <Box sx={GRIS}>{r.listo
        ? <>Con 7 h de sueño o más te va <b>{(Math.round(r.conSueno * 10) / 10).toLocaleString('es-CO')}</b>/5; con menos, <b>{(Math.round(r.sinSueno * 10) / 10).toLocaleString('es-CO')}</b>/5{r.dif >= 0.5 ? ': dormir te hace rendir más.' : r.dif <= -0.5 ? ': curioso, te va mejor con menos sueño.' : ': casi igual.'}</>
        : <>Anótalo cada entreno (y tu sueño en 🏠 Hoy): con unas semanas te digo qué te hace rendir mejor.</>}</Box>
    </Card>
  );
}

// ---------- 5. 📊 Volumen que planea tu rutina (en el Resumen) ----------
const COLOR: Record<string, string> = { bajo: 'warning.main', bien: 'success.main', alto: 'warning.main' };
export function VolumenPlan({ estado }: { estado: Fin }) {
  const l = volumenPlan(estado.rutina, estado.config.objetivos) as Fin[];
  if (!l.length) return null;
  const altos = l.filter((x) => x.estado === 'alto'), bajos = l.filter((x) => x.estado === 'bajo');
  return (
    <Desplegable titulo={<>📊 <b>Lo que planea tu rutina por músculo</b>{altos.length || bajos.length ? ' · ' + (altos.length ? altos.length + ' alto' + (altos.length > 1 ? 's' : '') : '') + (altos.length && bajos.length ? ', ' : '') + (bajos.length ? bajos.length + ' bajo' + (bajos.length > 1 ? 's' : '') : '') : ' · todo en rango'}</>} sx={{ mb: '14px' }}>
      <Box sx={{ display: 'grid', fontSize: 14 }}>
        {l.map((x) => (
          <Box key={x.musculo} sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', py: '6px', borderBottom: '1px solid', borderColor: 'divider' }}>
            <span>{x.musculo}<Box component="small" sx={{ display: 'block', color: 'text.secondary' }}>{x.ejercicios} ejercicio{x.ejercicios > 1 ? 's' : ''} · rango {x.min}-{x.max} series por semana</Box></span>
            <Box component="b" sx={{ color: COLOR[x.estado], whiteSpace: 'nowrap', textAlign: 'right' }}>{x.series} series<Box component="small" sx={{ display: 'block', fontWeight: 600 }}>{x.estado === 'alto' ? 'mucho' : x.estado === 'bajo' ? 'poco' : 'bien'}</Box></Box>
          </Box>
        ))}
        <Nota>Es lo que dice tu rutina si haces todo, no lo que hiciste (eso está arriba, en la semana). Mientras bajas grasa, más series que el rango solo suman cansancio: quita en los músculos "mucho" antes que en los demás. El rango se cambia en ✏️ Editar.</Nota>
      </Box>
    </Desplegable>
  );
}
