// 🏋️ Gym: la cabecera (semana, días y pestañas), el día de entreno (GymDia.tsx), 📊 Resumen, 📆 12 semanas y 🏠 En casa
// (GymPlan12.tsx). React pinta; anotar,
// elegir y cambiar son las acciones de siempre (src/vistas/gym.js y plan12.js).
import { useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, NativeSelect, OutlinedInput, Typography } from '@mui/material';
import { semanaQuitable } from '../../estado.js';
import { iso, semanaDe, lunesDe, sumarDias, fechaCorta, diaSemana } from '../../fechas.js';
import { resumenSemana, progresoMes, records, historial, lineasFuerza, registrosRaros, seriesRaras, ultimoRegistro, varianteDe, nombreConVariante, metaSesion,
  varianteActual, consejoRir, formatoPeso, numero, registrosDeFila, tieneVariantes } from '../../gym.js';
import { queTeHaceRendir, pesoCorporalEn } from '../../entrenador.js';
import { piezasGym, diasEnOrden, diaDeHoy } from '../../vistas/gym.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { CampoLista, CampoSolo } from '../ui/Campo';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Opciones, Avance } from '../ui/Varios';
import { TablaDatos } from '../ui/Graficos';
import { plan12, casa } from './GymPlan12';
import { origenDescarga, sugerirDescarga, rutinaDe, seriesDescarga, RIR_DESCARGA } from '../../descarga.js';
import { dia, HistorialEjercicio, ChequeoMensual } from './GymDia';
import { VolumenPlan } from './GymExtras';
import { DescansosSemana } from './GymDescanso';
import { descansaEl, movidoDe } from '../../estado.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'gym';
const G = piezasGym as Fin;
const DIAS: string[] = G.DIAS_CORTOS;
const H3 = ({ children }: { children: ReactNode }) => <Box component="h3" sx={{ m: '14px 0 6px', fontSize: 15 }}>{children}</Box>;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const Chico = ({ children }: { children: ReactNode }) => <Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{children}</Box>;

// Lista "nombre + detalle | cifra" de la fuerza
type Renglon = { k: string; nombre: ReactNode; detalle: ReactNode; cifra: ReactNode; color?: string };
const Lista = ({ filas }: { filas: Renglon[] }) => (
  <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '8px' }}>
    {filas.map((x) => (
      <Box component="li" key={x.k} sx={FILA}>
        <Box component="span" sx={{ display: 'grid', minWidth: 0 }}>{x.nombre}<Chico>{x.detalle}</Chico></Box>
        <Box component="b" sx={{ whiteSpace: 'nowrap', color: x.color }}>{x.cifra}</Box>
      </Box>
    ))}
  </Box>
);
const COLOR_CAMBIO = (c: number) => (c > 0.005 ? tokens.verde : c < -0.005 ? tokens.amarillo : undefined);

function textoRegistro(r: Fin) {
  if (!r) return '—';
  const p = numero(r.peso), peso = p != null ? formatoPeso(p) : String(r.peso || '').trim();
  return (peso ? peso + ' ' + (r.unidad || 'kg') : 'sin peso') + (r.reps ? ' · ' + r.reps : '');
}

// Etiqueta del estado de un músculo: Bajo, En rango, Alto
const ESTADO: Record<string, { bgcolor: string; color: string }> = {
  bajo: { bgcolor: tokens.amarilloFondo, color: tokens.amarillo }, 'en-rango': { bgcolor: tokens.brandSoft, color: tokens.brand }, alto: { bgcolor: tokens.azulFondo, color: tokens.azul },
};
const Estado = ({ estado }: { estado: string }) => (
  <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, ml: '6px', ...(ESTADO[estado.replace(' ', '-').toLowerCase()] || {}) }}>{estado}</Box>
);

// ---------- La semana: días y series por músculo ----------
function semana(estado: Fin, sem: number, editando: boolean) {
  const r = resumenSemana(rutinaDe(estado.rutina, sem, estado), estado.semanas[sem] || {}, estado.config.objetivos) as Fin;
  const pos = (id: string) => { const d = estado.rutina.find((x: Fin) => x.id === id); return id === 'core' ? 100 : (d && d.diaSemana) || 99; };
  r.dias.sort((a: Fin, b: Fin) => pos(a.id) - pos(b.id));
  const tip = (id: string) => { const d = estado.rutina.find((x: Fin) => x.id === id); return d && d.ejercicios.length ? d.nombre + '\n\n' + d.ejercicios.map((ej: Fin) => '• ' + ej.nombre).join('\n') : undefined; };
  const MINI = { textAlign: 'left', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: '12px', p: '10px', color: 'text.primary', font: 'inherit', fontSize: 14, display: 'grid', gap: '4px', justifyContent: 'stretch', '& [role=progressbar]': { m: 0 } };
  return (
    <>
      <Box sx={{ ...FILA, mb: '6px' }}><b>Semana {sem}</b><span>{r.hechas} / {r.plan} series</span></Box>
      <Avance parte={r.plan ? r.hechas / r.plan : 0} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', mb: '8px' }}>
        {(r.dias as Fin[]).map((d) => {
          const cuerpo = <><span>{DIAS[pos(d.id)] ? DIAS[pos(d.id)] + ' · ' : ''}{d.nombre}</span><b>{d.hechas}/{d.plan}</b><Avance parte={d.plan ? d.hechas / d.plan : 0} /></>;
          return d.id === 'core'
            ? <Box key={d.id} sx={MINI}>{cuerpo}</Box>
            : <ButtonBase key={d.id} data-tip={tip(d.id)} onClick={() => accion('ir-dia', { dia: d.id })} sx={[MINI, { '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }]}>{cuerpo}</ButtonBase>;
        })}
      </Box>
      <Box sx={{ ...FILA, mb: '6px' }}>
        <Typography component="h2" variant="h2" sx={{ m: 0 }}>Series por músculo</Typography>
        <Button color="secondary" onClick={() => accion('gym-objetivos')}>{editando ? '✓ Listo' : '✏️ Editar objetivos'}</Button>
      </Box>
      {editando && <Nota>Series por semana que buscas para cada músculo: menos del mínimo es "Bajo", más del máximo es "Alto".</Nota>}
      <Box sx={{ display: 'grid', gap: '6px' }}>
        {Object.entries(r.musculos as Record<string, Fin>).map(([m, x]) => (
          <div key={m}>
            <Box sx={{ ...FILA, mb: '6px' }}>
              <span>{m}</span>
              <span>
                <b>{x.hechas}</b> / {editando
                  ? <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CampoSolo noVaciar type="number" inputMode="numeric" min={0} data-cambio="gym-objetivo" data-m={m} data-k={0} defaultValue={x.min} aria-label={'Mínimo de ' + m} sx={{ width: 64, '& input': { textAlign: 'center', p: '6px 8px' } }} /> – <CampoSolo noVaciar type="number" inputMode="numeric" min={1} data-cambio="gym-objetivo" data-m={m} data-k={1} defaultValue={x.max} aria-label={'Máximo de ' + m} sx={{ width: 64, '& input': { textAlign: 'center', p: '6px 8px' } }} />
                    </Box>
                  : x.min + '–' + x.max} <Estado estado={x.estado} />
              </span>
            </Box>
            <Avance parte={x.hechas / x.max} />
          </div>
        ))}
      </Box>
    </>
  );
}

// ---------- 💪 Fuerza ----------
// Registros de las últimas 4 semanas que se salen del esquema y aún no se han respondido
function raros(estado: Fin, hasta: number) {
  const lista = registrosRaros(estado.semanas, estado.rutina, hasta - 3, hasta) as Fin[];
  if (!lista.length) return null;
  const chip = { minHeight: 32, p: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 700, bgcolor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'divider' };
  return (
    <>
      <H3>⚠️ Revisa estos registros</H3>
      <Nota>Se salen de tu esquema. Si quedaron incompletos, no cuentan en la comparación.</Nota>
      <Box sx={{ display: 'grid', gap: '10px', mb: '8px' }}>
        {lista.slice(0, 8).map((x) => {
          const v = varianteDe(x.reg, x.ej), ult = (ultimoRegistro as Fin)(estado.semanas, x.fila, x.semana, { ej: x.ej, v });
          return (
            <div key={x.semana + x.clave}>
              <b>{nombreConVariante(x.ej, v)}</b> <Chico>semana {x.semana} · {textoRegistro(x.reg)}</Chico>
              {(seriesRaras(x.fila, x.reg, ult) as Fin[]).filter((s) => s.estado !== 'ok').map((s) => {
                const datos = { sem: x.semana, clave: x.clave, i: s.i };
                return s.estado === 'incompleta'
                  ? <Box key={s.i} sx={{ mt: '6px', p: '8px 10px', borderRadius: '10px', bgcolor: tokens.surface2, color: 'text.secondary', fontSize: 14 }}>
                      {s.i === 'p' ? 'Registro marcado como mal anotado' : 'Serie ' + (s.i + 1) + ' marcada como incompleta'}: no cuenta en la fuerza. <Button variant="text" onClick={() => accion('gym-raro', { ...datos, v: 'quitar' })} sx={{ minHeight: 32, p: 0, color: 'info.main', fontWeight: 400, textDecoration: 'underline' }}>Deshacer</Button>
                    </Box>
                  : <Box key={s.i} sx={{ display: 'grid', gap: '6px', mt: '6px', p: '8px 10px', borderRadius: '10px', bgcolor: tokens.amarilloFondo, color: 'warning.main', fontSize: 14 }}>
                      <span>⚠️ {s.texto}. ¿{s.i === 'p' ? 'Peso mal anotado' : 'Registro incompleto'}?</span>
                      <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        <Button size="small" onClick={() => accion('gym-raro', { ...datos, v: 'inc' })} sx={chip}>Sí, que no cuente</Button>
                        <Button size="small" onClick={() => accion('gym-raro', { ...datos, v: 'ok' })} sx={chip}>No, está bien</Button>
                      </Box>
                    </Box>;
              })}
            </div>
          );
        })}
      </Box>
    </>
  );
}

// Próximo día de gym (hoy si toca) con la meta de cada ejercicio
function proximo(estado: Fin, semActual: number) {
  const hoy = iso();
  for (let k = 0; k < 7; k++) {
    const f = sumarDias(hoy, k), d = estado.rutina.find((x: Fin) => x.id !== 'core' && x.diaSemana === diaSemana(f));
    if (!d) continue;
    const sem = semActual + (k && diaSemana(f) < diaSemana(hoy) ? 1 : 0);
    const metas = (d.ejercicios as Fin[]).map((ej) => ({ ej, m: metaSesion(ej.filas[0], (ultimoRegistro as Fin)(estado.semanas, ej.filas[0], sem, { ej, v: varianteActual(ej) }, estado.rutina)) as Fin })).filter((x) => x.m);
    if (!metas.length) return null;
    return (
      <>
        <H3>🎯 Tu próximo entreno: {d.nombre} <small>{k === 0 ? 'hoy' : k === 1 ? 'mañana' : DIAS[d.diaSemana].toLowerCase()}</small></H3>
        <Lista filas={metas.map(({ ej, m }) => ({ k: ej.id, nombre: nombreConVariante(ej, varianteActual(ej)), detalle: m.motivo, cifra: m.texto + (m.sube ? ' ⬆' : ''), color: m.sube ? tokens.verde : undefined }))} />
      </>
    );
  }
  return null;
}

// 1RM estimado dividido por el peso corporal
function fuerzaRelativa(lista: Fin[]) {
  const ahora = pesoCorporalEn(iso()) as number | null, antes = pesoCorporalEn(sumarDias(iso(), -28)) as number | null;
  if (!ahora) return <><H3>⚖️ Fuerza relativa</H3><Nota>Anota tu peso en ayunas (Hoy → Sueño y peso) para ver cuántas veces tu peso levantas.</Nota></>;
  const pesoEn = (s: number) => (s ? pesoCorporalEn(sumarDias(lunesDe(s), 6)) as number | null : null);
  const filas = lista.filter((x) => x.a.unidad === 'kg').map((x) => {
    const pa = pesoEn(x.a.semana) || ahora, pd = pesoEn(x.de.semana);
    return { x, rel: x.a.rm / pa, cambio: pd ? (x.a.rm / pa) / (x.de.rm / pd) - 1 : null };
  }).sort((a, b) => b.rel - a.rel);
  const veces = (n: number) => (Math.round(n * 100) / 100).toLocaleString('es-CO') + '×';
  return (
    <>
      <H3>⚖️ Fuerza relativa</H3>
      <Nota>Peso corporal: <b>{formatoPeso(Math.round(ahora * 10) / 10)} kg</b>{antes ? ' (' + (ahora <= antes ? '−' : '+') + formatoPeso(Math.round(Math.abs(ahora - antes) * 10) / 10) + ' kg en 4 semanas)' : ''}. Veces tu peso que levantas (1RM estimado):</Nota>
      <Lista filas={filas.slice(0, 5).map(({ x, rel, cambio }) => ({ k: x.nombre, nombre: x.nombre, detalle: G.rm(x.a.rm) + ' kg' + (cambio != null ? ' · ' + G.porcentaje(cambio) + ' relativo' : ''), cifra: veces(rel) }))} />
    </>
  );
}

function queRindes() {
  const r = queTeHaceRendir() as Fin, listos = (r.factores as Fin[]).filter((x) => !x.faltan);
  return (
    <>
      <H3>🧪 ¿Qué te hace rendir?</H3>
      {listos.length
        ? <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '6px', lineHeight: 1.5 }}>{listos.map((x) => <li key={x.texto}>{x.texto}</li>)}</Box>
        : <Nota>Comparo cada entreno con tu propia tendencia. Con {r.sesiones}{r.sesiones === 1 ? ' sesión' : ' sesiones'} todavía faltan datos: anota el sueño cada mañana y los partidos, y en unas semanas vas a ver aquí qué te hace rendir más.</Nota>}
      {listos.length > 0 && listos.length < r.factores.length && <Nota>Para comparar lo demás faltan más días anotados de cada lado.</Nota>}
    </>
  );
}

// Un ejercicio a la vez: su 1RM estimado semana a semana
function graficoEjercicio(estado: Fin, hasta: number, elegido: string | null) {
  const nombres = (lineasFuerza(estado.rutina) as Fin[]).filter((x) => (historial(estado.semanas, estado.rutina, x.ej, 0, hasta, x.v) as Fin[]).length >= 2);
  if (!nombres.length) return null;
  const sel = nombres.find((x) => x.nombre === elegido) || nombres[0];
  return (
    <>
      <H3>📉 Un ejercicio en el tiempo</H3>
      <CampoLista key={sel.nombre} etiqueta="Ejercicio" data-cambio="fuerza-ej" defaultValue={sel.nombre} opciones={nombres.map((x) => [x.nombre, x.nombre])} />
      <HistorialEjercicio ej={sel.ej} sem={hasta} v={sel.v} />
    </>
  );
}

export function fuerza(estado: Fin, hasta: number, semActual: number, elegido: string | null) {
  const lista = progresoMes(estado.semanas, estado.rutina, hasta) as Fin[];
  const suben = lista.filter((x) => x.cambio > 0.005), quietos = lista.filter((x) => x.est && x.est.estancado);
  const recs: Fin[] = [];
  for (const { ej, v, nombre } of lineasFuerza(estado.rutina) as Fin[]) {
    for (const p of records(historial(estado.semanas, estado.rutina, ej, 0, hasta, v)) as Fin[]) if (p.semana > 0) recs.push({ ...p, nombre });
  }
  recs.sort((a, b) => b.semana - a.semana);
  const arriba = <>{raros(estado, hasta)}{hasta === semActual ? proximo(estado, semActual) : null}</>;
  if (!lista.length && !recs.length) return <>{arriba}<Nota>Cuando tengas el mismo ejercicio anotado en 2 semanas vas a ver aquí en qué estás mejorando.</Nota></>;
  const lineaDe = (nombre: string) => (lineasFuerza(estado.rutina) as Fin[]).find((x) => x.nombre === nombre);
  const cambio = (x: Fin) => ({ k: x.nombre, nombre: x.nombre, detalle: formatoPeso(x.de.peso) + ' × ' + x.de.reps + ' → ' + formatoPeso(x.a.peso) + ' × ' + x.a.reps + ' ' + x.a.unidad, cifra: G.porcentaje(x.cambio), color: COLOR_CAMBIO(x.cambio) });
  return (
    <>
      {arriba}
      <H3>📈 Mejoraste (4 semanas)</H3>
      {suben.length ? <Lista filas={suben.slice(0, 5).map(cambio)} /> : <Nota>Ningún ejercicio subió su 1RM estimado en estas 4 semanas.</Nota>}
      {quietos.length > 0 && <><H3>⏸ Estancados (3+ semanas sin superar tu mejor marca)</H3>
        <Lista filas={quietos.slice(0, 5).map((x) => ({ k: x.nombre, nombre: x.nombre, detalle: consejoRir(G.rirReciente(lineaDe(x.nombre).ej, 0, hasta, x.variante), true) || G.consejo(x, x.est.semanas), cifra: x.est.semanas + ' sem', color: tokens.amarillo }))} /></>}
      {recs.length > 0 && <><H3>🏆 Últimos récords</H3>
        <Lista filas={recs.slice(0, 6).map((p) => ({ k: p.nombre + p.semana, nombre: p.nombre, detalle: formatoPeso(p.peso) + ' ' + p.unidad + ' × ' + p.reps + ' · semana ' + p.semana, cifra: G.rm(p.rm) }))} /></>}
      {fuerzaRelativa(lista)}
      {queRindes()}
      {graficoEjercicio(estado, hasta, elegido)}
      {lista.length > 0 && <Box><TablaDatos columnas={['Ejercicio', 'Antes', 'Ahora', 'Cambio']} filas={lista.map((x) => [x.nombre, formatoPeso(x.de.peso) + ' × ' + x.de.reps, formatoPeso(x.a.peso) + ' × ' + x.a.reps, G.porcentaje(x.cambio)])} /></Box>}
    </>
  );
}

// ---------- Progreso de peso: la primera fila de cada ejercicio, semana a semana ----------
function Mini({ estado, f, hasta, filtro }: { estado: Fin; f: Fin; hasta: number; filtro: Fin }) {
  const puntos: [number, number][] = [];
  for (let s = 1; s <= hasta; s++) {
    const p = (registrosDeFila(estado.semanas[s], f) as Fin[]).filter((r) => !filtro || varianteDe(r, filtro.ej) === filtro.v).map((r) => numero(r.peso)).find((n) => n != null);
    if (p != null) puntos.push([s, p]);
  }
  if (!puntos.length) return <Chico>sin datos</Chico>;
  const ps = puntos.map((p) => p[1]), min = Math.min(...ps), max = Math.max(...ps), W = 120, H = 32;
  const x = (s: number) => (hasta > 1 ? ((s - 1) / (hasta - 1)) * (W - 8) + 4 : W / 2), y = (p: number) => (max > min ? H - 4 - ((p - min) / (max - min)) * (H - 8) : H / 2);
  return (
    <>
      <svg viewBox={'0 0 ' + W + ' ' + H} width={W} height={H} aria-hidden="true" style={{ color: tokens.brand }}>
        <polyline fill="none" stroke="currentColor" strokeWidth="2" points={puntos.map(([s, p]) => x(s) + ',' + y(p)).join(' ')} />
        {puntos.map(([s, p]) => <circle key={s} cx={x(s)} cy={y(p)} r="2.5" fill="currentColor" />)}
      </svg>
      <Chico>{formatoPeso(ps[0])} → <b>{formatoPeso(ps[ps.length - 1])}</b></Chico>
    </>
  );
}
function progreso(estado: Fin, sem: number) {
  const filas = (estado.rutina as Fin[]).flatMap((d) => (d.ejercicios as Fin[]).flatMap((ej) => (tieneVariantes(ej) ? ej.variantes as string[] : [null]).map((v) => ({ d, ej, v }))));
  return (
    <Box sx={{ display: 'grid', gap: '10px' }}>
      {filas.map(({ d, ej, v }) => (
        <Box key={d.id + ej.id + (v || '')} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <Box component="span" sx={{ display: 'grid', fontSize: 14 }}>{nombreConVariante(ej, v)}<Chico>{d.nombre} · {ej.filas[0].tipo}</Chico></Box>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><Mini estado={estado} f={ej.filas[0]} hasta={sem} filtro={v ? { ej, v } : null} /></Box>
        </Box>
      ))}
    </Box>
  );
}

function resumen(estado: Fin, sem: number, semActual: number, ver: Fin) {
  return (
    <>
      {sem === semActual ? <ChequeoMensual /> : null}
      <Button fullWidth onClick={() => accion('gym-imagen-rutina')} sx={{ mb: '14px' }}>🖼️ Crear imagen de mi rutina semanal</Button>
      <Card component="section" sx={{ mb: '14px' }}>{semana(estado, sem, ver.editandoObjetivos)}</Card>
      <VolumenPlan estado={estado} />
      <TarjetaPlegable vista={VISTA} clave="💪 Fuerza" titulo="💪 Fuerza">{fuerza(estado, sem, semActual, ver.fuerzaEj)}</TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="Progreso de peso" titulo="Progreso de peso">{progreso(estado, sem)}</TarjetaPlegable>
    </>
  );
}

// ---------- 🔻 Semana de descarga (src/descarga.js) ----------
// Activa: una fila morada que se abre para ver qué cambia. Sugerida: un aviso con "Hacer descarga" o "Esta semana no"
function Descarga({ estado, sem, actual }: { estado: Fin; sem: number; actual: number }) {
  const [abierta, ponerAbierta] = useState(false), origen = origenDescarga(sem, estado) as string | null, sug = sem === actual ? sugerirDescarga(sem, estado) as Fin : null;
  const ejemplo = (estado.rutina as Fin[]).flatMap((d) => d.ejercicios as Fin[]).flatMap((ej) => ej.filas as Fin[]).find((f) => f.series >= 3);
  const chip = { minHeight: 40 };
  if (origen) return (
    <Card component="section" data-t="descarga" sx={{ mb: '12px', p: 0, borderLeft: '5px solid', borderLeftColor: tokens.faseMorado, bgcolor: tokens.moradoFondo }}>
      <ButtonBase aria-expanded={abierta} onClick={() => ponerAbierta(!abierta)}
        sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', minHeight: 48, p: '8px 14px', font: 'inherit', color: tokens.moradoInk, textAlign: 'left', gap: '10px', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '-2px' } }}>
        <b>{origen === 'descanso' ? '🛌 Semana de descanso: descarga sin ir al gym' : '🔻 Semana de descarga' + (origen === 'plan' ? ' · del plan de 12 semanas' : '')}</b><Box component="span" aria-hidden="true">{abierta ? '▾' : '▸'}</Box>
      </ButtonBase>
      {abierta && origen === 'descanso' ? (
        <Box data-t="descanso" sx={{ display: 'grid', gap: '8px', p: '0 14px 12px', fontSize: 14, color: 'text.primary' }}>
          <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '4px' }}>
            <li><b>Esta semana no vas al gym:</b> los días salen en 0 de 0, no como "te faltan".</li>
            <li>Si quieres moverte: <b>caminar 30-45 minutos</b>, 10 minutos de movilidad o estiramientos, y el fútbol suave.</li>
            <li><b>Come normal y duerme más.</b> No bajes comida: el peso puede subir un poco por agua y es normal.</li>
            <li>La próxima semana vuelves con los mismos pesos de tu última semana normal: esta no cuenta como estancamiento ni para tus metas.</li>
          </Box>
          <Box component="small" sx={{ color: 'text.secondary' }}>Una semana sin ir no te hace perder músculo ni fuerza: la fatiga baja y vuelves con más ganas. Más de 2 semanas seguidas, sí empieza a bajar.</Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button color="secondary" onClick={() => accion('gym-descarga', { v: 'si' })} sx={chip}>🔻 Mejor ir con la mitad de las series</Button>
            <Button color="secondary" onClick={() => accion('gym-descarga', { v: 'no' })} sx={chip}>Quitar la descarga de la semana {sem}</Button>
          </Box>
        </Box>
      ) : abierta ? (
        <Box sx={{ display: 'grid', gap: '8px', p: '0 14px 12px', fontSize: 14, color: 'text.primary' }}>
          <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '4px' }}>
            <li><b>La mitad de las series</b>{ejemplo ? <> (si tocaban {ejemplo.series}, haces {seriesDescarga(ejemplo.series)})</> : null}: ya vienen así en cada día.</li>
            <li><b>El mismo peso</b> de tu última semana normal, sin subir. Deja <b>{RIR_DESCARGA} reps en reserva</b>.</li>
            <li>Si juegas fútbol, juégalo suave. <b>No bajes comida</b>: si el peso sube un poco por agua, es normal.</li>
            <li>La próxima semana vuelves a tus metas de antes: esta no cuenta como estancamiento.</li>
          </Box>
          <Box component="small" sx={{ color: 'text.secondary' }}>No es flojera: la fatiga baja más rápido que la fuerza, y después de la descarga rindes más. No la "aproveches" para entrenar más.</Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button color="secondary" onClick={() => accion('gym-descarga', { v: 'descanso' })} sx={chip}>🛌 No voy esta semana (descanso total)</Button>
            <Button color="secondary" onClick={() => accion('gym-descarga', { v: 'no' })} sx={chip}>Quitar la descarga de la semana {sem}</Button>
          </Box>
        </Box>
      ) : null}
    </Card>
  );
  if (sug) return (
    <Box data-t="descarga-sugerida" sx={{ mb: '12px', p: '10px 12px', borderRadius: '10px', bgcolor: tokens.moradoFondo, borderLeft: '4px solid', borderLeftColor: tokens.faseMorado, fontSize: 14, display: 'grid', gap: '8px' }}>
      <span><Box component="b" sx={{ color: tokens.moradoInk }}>🔻 ¿Toca descarga?</Box> {sug.texto} Una semana con la mitad de las series y el mismo peso te deja volver más fuerte.</span>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Button onClick={() => accion('gym-descarga', { v: 'si' })} sx={chip}>🔻 Hacer descarga esta semana</Button>
        <Button color="secondary" onClick={() => accion('gym-descarga', { v: 'descanso' })} sx={chip}>🛌 Descansar sin ir</Button>
        <Button color="secondary" onClick={() => accion('gym-descarga', { v: 'no' })} sx={chip}>Esta semana no</Button>
      </Box>
    </Box>
  );
  return null;
}
// Sin descarga ni sugerencia: un botón al lado de "＋ Nueva semana" (solo en la semana actual)
const conBotonDescarga = (estado: Fin, sem: number, actual: number) => sem === actual && !origenDescarga(sem, estado) && !sugerirDescarga(sem, estado);

export default function Gym() {
  const estado = usarEstado() as Fin, ver = G.ver(), actual: number = ver.actual, sem: number = ver.semana, lunes = lunesDe(sem);
  const semanas = Array.from({ length: actual }, (_, k) => actual - k);
  // 🛌 En la fila de días: el que descansas y el que pasaste a otro día (en la semana que se ve)
  const marca = (x: Fin) => { if (!x.diaSemana) return ''; const f = sumarDias(lunes, x.diaSemana - 1), a = movidoDe(f) as string | null; return a ? ' → ' + DIAS[diaSemana(a) as number] : descansaEl(f) ? ' 🛌' : ''; };
  const dias: [string, string][] = (diasEnOrden() as Fin[]).map((x) => [x.id, (x.diaSemana ? DIAS[x.diaSemana] + ' · ' : '') + x.nombre + marca(x)]);
  const hoyDia = (estado.rutina as Fin[]).find((x) => x.id === ver.dia);
  // Los días de entreno en una fila (el de hoy con borde verde) y las vistas en otra: en el computador ya no se cortan
  const vistas: [string, string][] = [['resumen', '📊 Resumen'], ['plan12', '📆 12 semanas'], ['casa', '🏠 En casa']];
  const deHoy = sem === actual ? (diaDeHoy() as Fin) : null, ir = (id: string) => ({ 'data-accion': 'ir-dia', 'data-dia': id });
  return (
    <>
      <Box sx={{ ...FILA, flexWrap: 'wrap' }}>
        <TituloPantalla>Gym</TituloPantalla>
        <NativeSelect key={sem} defaultValue={String(sem)} input={<OutlinedInput />} inputProps={{ 'aria-label': 'Semana', 'data-cambio': 'semana' } as object} sx={{ width: '60%' }}>
          {semanas.map((s) => <option key={s} value={s}>Semana {s}{s === actual ? ' (actual)' : ' · ' + fechaCorta(lunesDe(s))}{origenDescarga(s, estado) === 'descanso' ? ' 🛌' : origenDescarga(s, estado) ? ' 🔻' : ''}</option>)}
        </NativeSelect>
      </Box>
      <Box sx={{ ...FILA, flexWrap: 'wrap', gap: '8px', m: '-6px 0 10px' }}>
        <Box component="p" sx={{ color: 'text.secondary', m: 0 }}>
          {fechaCorta(lunes)} – {fechaCorta(sumarDias(lunes, 6))}{sem < actual ? <> · <b>semana pasada</b></> : sem > semanaDe() ? <> · <b>abierta antes de tiempo</b></> : null}
        </Box>
        {sem === actual && <Button color="secondary" onClick={() => accion('semana-nueva')} sx={{ minHeight: 44 }}>＋ Nueva semana</Button>}
        {conBotonDescarga(estado, sem, actual) && <Button color="secondary" data-t="descarga-activar" onClick={() => accion('gym-descarga', { v: 'si' })} sx={{ minHeight: 44 }}>🔻 Descarga</Button>}
        {sem === actual && semanaQuitable() === actual && <Button color="secondary" onClick={() => accion('semana-quitar')} sx={{ minHeight: 44 }}>Quitar semana {actual}</Button>}
      </Box>
      {(estado.rutina as Fin[]).some((x) => x.id !== 'core' && x.ejercicios.length) ? null : (
        <Card component="section" sx={{ mb: '14px', borderColor: 'primary.main', display: 'grid', gap: '8px' }}>
          <Box component="h2" sx={{ m: 0, fontSize: 18 }}>🏋️ Aún no tienes rutina</Box>
          <Box component="ol" sx={{ m: 0, pl: '22px', display: 'grid', gap: '4px' }}>
            <li>En ✏️ Editar → Rutina agrega tus días (por ejemplo «Lunes · Pierna») y en cada uno sus ejercicios con series y reps.</li>
            <li>El día de entreno, aquí anotas el peso y las reps de cada serie; el descanso corre solo.</li>
            <li>Cada semana la app compara con la anterior y te dice cuándo subir el peso.</li>
          </Box>
          <Button href="#editar/rutina" sx={{ justifySelf: 'start' }}>Armar mi rutina →</Button>
        </Card>
      )}
      <Descarga estado={estado} sem={sem} actual={actual} />
      <DescansosSemana sem={sem} />
      <Opciones nombre="Día" activa={ver.dia} opciones={dias} datos={ir} marcada={deHoy ? { id: deHoy.id, titulo: 'Hoy' } : null} sx={{ pb: '8px' }} />
      <Opciones nombre="Vista" activa={ver.dia} opciones={vistas} datos={ir} chica />
      {ver.dia === 'plan12' ? plan12(estado) : ver.dia === 'casa' ? casa(estado) : hoyDia ? dia(hoyDia, sem) : resumen(estado, sem, actual, ver)}
    </>
  );
}
