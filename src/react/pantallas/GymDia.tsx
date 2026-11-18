// 🏋️ Gym → un día de entreno: calentamiento, el ejercicio en el que vas (abierto, con el cursor listo), los demás en una
// fila, biseries, core, cardio, copiar el resumen y el análisis. React pinta; anotar es de las acciones de siempre
// (src/vistas/gym.js: serie, reps, peso, gym-rir, gym-ronda…).
// "＋ Serie" y la ronda de la biserie leen su campo junto al botón: esos botones llevan data-accion (los despacha main.js con
// el botón de verdad) y el campo de la serie es un <input> hermano del botón (Enter en él toca ese botón, main.js)
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Chip, IconButton, NativeSelect, OutlinedInput } from '@mui/material';
import { e, semanaActual } from '../../estado.js';
import { reloj, fechaCorta } from '../../fechas.js';
import { estadoFila, ultimoRegistro, sugerencia, aproximacion, resumenSemana, numero, formatoPeso, historial, records, ultimaSubida, estancamiento, seriesRaras, metaSesion,
  consejoRir, gruposDia, nombresBiserie, bajonReps, tieneVariantes, varianteEn, nombreConVariante, repsDe, CAMPOS_CARDIO, claveCardio, hayCardio, textoCardio, tiemposDia, duracion, ENTRENO_RARO } from '../../gym.js';
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
  const est0 = e() as Fin, hist = historial(est0.semanas, est0.rutina, ej, i, sem, v) as Fin[];
  if (!hist.length) return null;
  const u = hist[0].unidad, rec = (records(hist) as Fin[]).find((p) => p.semana === sem && sem > 0);
  const sub = ultimaSubida(hist) as Fin, est = estancamiento(hist.filter((p) => p.semana < sem)) as Fin, gris = { fontSize: 14, color: 'text.secondary', mt: '2px', '& b': { color: 'text.primary' } };
  if (rec) return <Box sx={{ fontSize: 14, fontWeight: 700, color: 'warning.main', mt: '2px' }}>🏆 Récord: 1RM estimado <b>{G.rm(rec.rm)} {u}</b> (antes {G.rm(rec.antes)})</Box>;
  if (est && est.estancado) return (
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
  const reg = regs(sem)[clave] || {}, est = estadoFila(f, reg) as Fin, filtro = ej && G.filtroEn(ej, sem, G.sufijoDe(clave));
  const ult = (ultimoRegistro as Fin)((e() as Fin).semanas, f, sem, filtro, (e() as Fin).rutina), sug = sugerencia(f, ult) as Fin, meta = metaSesion(f, ult) as Fin;
  const unidad = reg.unidad || (ult && ult.unidad) || 'kg', calent = !!(ej && ej.calentamiento), corporal = calent ? G.pesoDelDia(clave, sem) : null;
  const tipo = f.tipo.toLowerCase();
  return (
    <Box component="section" key={clave} sx={{ borderLeft: '5px solid', borderLeftColor: BORDE[est.color] || tokens.line, bgcolor: est.color === 'sube' ? tokens.subeFondo : 'background.default', borderRadius: '10px', p: '10px', mb: '8px', display: 'grid', gap: '8px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: 14 }}>
        <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', ...(TIPO[tipo] || { bgcolor: tokens.surface2 }) }}>{f.tipo}</Box>
        <Box component="span" sx={{ fontWeight: 700 }}>{f.esquema}{f.unidad === 's' ? ' (seg)' : ''}</Box>
        <Box component="span" title="Descanso" sx={{ color: 'text.secondary' }}>⏱ {reloj(f.descanso)}</Box>
        <Contador color={est.color} sx={{ ml: 'auto' }}>{est.hechas} / {est.plan}</Contador>
      </Box>
      {est.color === 'sube' && !calent ? <Box sx={{ fontWeight: 800, color: 'info.main', fontSize: 14 }}>⬆ SUBE PESO la próxima semana <span>(+2,5–5 %)</span></Box> : null}
      {meta
        ? <Box sx={{ fontSize: 14, mt: '4px' }}>🎯 Hoy: <Box component="b" sx={{ color: meta.sube ? 'info.main' : 'primary.main' }}>{meta.texto}{meta.sube ? ' ⬆' : ''}</Box> <Box component="span" sx={GRIS}>· último <b>{textoRegistro(ult)}</b></Box><Box component="small" sx={{ display: 'block', color: 'text.secondary' }}>{meta.motivo}</Box></Box>
        : <Box sx={GRIS}>Último: <b>{textoRegistro(ult)}</b>{sug ? <> · Hoy: <Box component="b" sx={sug.sube ? { color: 'info.main !important' } : null}>{sug.texto}{sug.sube ? ' ⬆' : ''}</Box></> : null}</Box>}
      {calent ? <Box sx={GRIS}>⚖️ {corporal ? <>Tu peso de ese día: <b>{G.kgCorporal(corporal)} kg</b> (se anota solo en cada serie)</> : 'Anota tu peso en Hoy (Sueño y peso) y se usa aquí solo'}</Box> : null}
      {ej ? lineaFuerza(ej, i, sem, filtro ? filtro.v : null, !!meta) : null}
      {avisosRaros(f, sem, clave, reg, ult)}
      {(() => { const b = bajonReps(f, reg) as Fin; return b ? (
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
  <Desplegable titulo="Notas" abiertoAlInicio={!!ej.nota}>
    <CampoLargoSolo aria-label={'Notas de ' + ej.nombre} data-cambio="nota" data-ej={ej.id} defaultValue={ej.nota || ''} placeholder="Agarre, asiento, molestias…" />
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
function plegado(clave: string, titulo: ReactNode, sub: ReactNode, r: Fin) {
  const listo = r.plan > 0 && r.hechas >= r.plan, color = listo ? 'completo' : r.hechas ? 'falta' : undefined;
  return (
    <Card component="article" key={clave} data-ancla={'ej-' + clave} sx={{ p: 0, mb: '8px', scrollMarginTop: '90px' }}>
      <ButtonBase aria-expanded="false" onClick={() => accion('gym-plegar', { clave, abierto: '0' })}
        sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto 14px', alignItems: 'center', gap: '10px', width: '100%', minHeight: 56, p: '8px 14px', color: 'text.primary', font: 'inherit', textAlign: 'left',
          '&:hover': { bgcolor: tokens.surface2 }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '-2px' } }}>
        <Box component="span" sx={{ display: 'grid', gap: '2px', minWidth: 0 }}>
          <span><b>{titulo}</b> <Box component="small" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: 13 }}>{sub}</Box></span>
          <Box component="span" sx={{ color: color ? 'text.primary' : 'text.secondary', fontSize: 14, overflowWrap: 'anywhere' }}>{r.texto}</Box>
        </Box>
        <Contador color={color} sx={{ fontSize: 14, whiteSpace: 'nowrap' }}>{listo ? '✓ ' : ''}{r.hechas} / {r.plan}</Contador>
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
  const proxima = (ej.filas as Fin[]).findIndex((f) => { const x = estadoFila(f, regs(sem)[f.id + sufijo] || {}) as Fin; return x.hechas < x.plan; });
  const clave = ej.id + sufijo, v = varianteEn(ej, regs(sem), sufijo);
  if (!G.estaAbierto(clave, es || (!sufijo && ej.id === ultimoEj && sem === semanaActual()))) return plegado(clave, nombreConVariante(ej, v), ej.musculo, G.resumenEj(ej, sem, sufijo));
  return (
    <Card component="article" key={clave} data-ancla={'ej-' + clave} data-actual={es ? '' : undefined} sx={tarjeta(es)}>
      <Box component="header" sx={CABECERA}>
        {es ? <Ahora /> : null}<h3>{ej.nombre}</h3><Musculo>{ej.calentamiento ? '🔥 ' : ''}{ej.musculo}</Musculo>{moverEj(ej)}<BotonPlegar clave={clave} nombre={ej.nombre} />
      </Box>
      {nombres && !sufijo && d && d.id !== 'core' ? <Button variant="text" onClick={() => accion('gym-biserie', { ej: ej.id })} sx={{ ...ENLACE, display: 'block', m: '2px 0 6px' }}>🔁 Separar en biserie: {nombres.join(' + ')}</Button> : null}
      {chipsVariante(ej, sem, sufijo)}
      {(ej.filas as Fin[]).map((f, i) => fila(f, sem, f.id + sufijo, ej, i, i !== proxima))}
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
  const es = actualId === a.id || actualId === b.id, clave = 'bis-' + a.id;
  if (!G.estaAbierto(clave, es || ((ultimoEj === a.id || ultimoEj === b.id) && sem === semanaActual()))) {
    const ra = G.resumenEj(a, sem), rb = G.resumenEj(b, sem);
    return plegado(clave, '🔁 ' + a.nombre + ' + ' + b.nombre, 'biserie', { hechas: ra.hechas + rb.hechas, plan: ra.plan + rb.plan, texto: ra.hechas + rb.hechas ? ra.texto + ' | ' + rb.texto : ra.texto });
  }
  const parte = (ej: Fin, letra: string) => (
    <Box key={letra} sx={{ mt: '10px', pt: '10px', borderTop: '1px solid', borderColor: 'divider' }}>
      <Box component="h4" sx={{ display: 'flex', alignItems: 'center', gap: '8px', m: '0 0 6px', fontSize: 16 }}>
        <Box component="span" sx={{ display: 'inline-grid', placeItems: 'center', minWidth: 32, height: 24, borderRadius: '6px', bgcolor: tokens.azul, color: tokens.azulInk, fontSize: 13, fontWeight: 800 }}>{letra}</Box>{ej.nombre} <Box component="small" sx={{ color: 'text.secondary', fontWeight: 400 }}>{ej.musculo}</Box>
      </Box>
      {chipsVariante(ej, sem)}
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
  const t = tiemposDia(d, sem, e(), ahora) as Fin, cardioYTotal = t.cardio && t.fuerza ? <Box component="span" sx={GRIS}> · 🏃 cardio {duracion(t.cardio.min)} · total <b>{duracion(t.total)}</b></Box> : null;
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
      <span>✓ Fuerza hoy: <b>{duracion(minutosEntreno(x))}</b> <Box component="span" sx={GRIS}>({hora(x.inicio)} – {hora(x.fin)})</Box>{cardioYTotal}</span>
      <Box sx={{ display: 'flex', gap: '6px' }}>{lapiz}<Button size="small" color="secondary" onClick={() => accion('gym-entreno-seguir')} sx={MINI}>↺ Seguir</Button></Box>
      {correccion}
    </Box>
  );
  const s = Math.max(0, Math.floor((ahora - x.inicio) / 1000)), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), dos = (n: number) => String(n).padStart(2, '0');
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

export function dia(d: Fin, sem: number) {
  const r = resumenSemana([d], regs(sem)) as Fin, ir = G.prepararDia(d, sem) as boolean;
  return (
    <>
      {calentamiento(d, sem)}
      <Box sx={{ ...FILA, mt: '4px', mb: '6px' }}><b>{d.nombre}</b><span>{r.hechas} / {r.plan} series</span></Box>
      <Avance parte={r.plan ? r.hechas / r.plan : 0} />
      <ContadorEntreno d={d} sem={sem} />
      {(gruposDia(d.ejercicios) as Fin[][]).map((g) => (g.length === 2 ? biserie(g[0], g[1], sem) : ejercicio(g[0], sem)))}
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
      </> : null}
      <IrAlActual ir={ir} />
    </>
  );
}
