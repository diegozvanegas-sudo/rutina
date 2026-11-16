// 📆 Ciclo del cliente, lo que va debajo de las fases: elegir el tipo de ciclo, el gráfico del ciclo en el tiempo (series
// por semana, fatiga, rendimiento, supercompensación, hoy y la energía de sus check-ins), su tiempo, las series por
// músculo y las señales para adelantar la descarga. React pinta; la lógica está en src/ciclo.js y las acciones
// (cc-tipo, cc-cambiar-tipo, cc-tiempo) en src/vistas/ciclo-cliente.js. Los textos van en HTML, no dentro del SVG.
import { type ReactNode } from 'react';
import { Box, ButtonBase, Card } from '@mui/material';
import { fechaCorta } from '../../fechas.js';
import { TIPOS_CICLO, semanasCarga, supercompensacion, volumenMusculos, seriesRutina, tiempoCliente, senalesSobrecarga, lecturaSemana, colorFase } from '../../ciclo.js';
import { tipoElegido } from '../../vistas/ciclo-cliente.js';
import { tokens } from '../tema';
import { Campo, DOS } from '../ui/Campo';
import { Nota } from '../ui/Textos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
/** Color de cada fase según colorFase (0 azul, 1 verde, 2 morado = descarga, 3 amarillo) */
export const FASE = [tokens.faseAzul, tokens.brand, tokens.faseMorado, tokens.amarillo];
export const colorDe = (fases: Fin[], k: number) => FASE[colorFase(fases, k) as number] || tokens.line;
const num = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',');
const pct = (n: number) => Math.round(n * 1000) / 10;
const mezcla = (color: string, p: number) => 'color-mix(in srgb, ' + color + ' ' + p + '%, transparent)';

const Tarjeta = ({ children }: { children: ReactNode }) => <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '10px' }}>{children}</Card>;
const H2 = ({ children }: { children: ReactNode }) => <Box component="h2" sx={{ m: 0, fontSize: 17 }}>{children}</Box>;
const Corta = ({ children }: { children: ReactNode }) => <Nota sx={{ m: 0 }}>{children}</Nota>;
const Aviso = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, m: 0 }}>{children}</Box>;
const Plegable = ({ titulo, children }: { titulo: ReactNode; children: ReactNode }) => (
  <Box component="details" sx={{ '& > summary': { cursor: 'pointer', py: '8px', color: 'text.secondary' } }}><summary>{titulo}</summary>{children}</Box>
);
const Explica = ({ items }: { items: ReactNode[] }) => (
  <Box component="ul" sx={{ m: '6px 0 0', pl: '18px', display: 'grid', gap: '6px', fontSize: 14 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</Box>
);

// ---------- Elegir el tipo (al crear el ciclo, o para cambiarlo) ----------
export function ElegirTipo({ k, cambiar = false }: { k: number; cambiar?: boolean }) {
  const tipo = tipoElegido();
  return (
    <Box role="group" aria-label="Tipo de ciclo" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '8px', m: '8px 0 12px' }}>
      {Object.entries(TIPOS_CICLO as Record<string, Fin>).map(([id, t]) => {
        const activo = !cambiar && id === tipo;
        return (
          <ButtonBase key={id} data-accion={cambiar ? 'cc-cambiar-tipo' : 'cc-tipo'} data-t={id} data-k={k} aria-pressed={cambiar ? undefined : id === tipo}
            sx={[{ display: 'grid', gap: '3px', justifyItems: 'start', textAlign: 'left', p: '12px', borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: tokens.surface2, color: 'text.primary', font: 'inherit', minHeight: 44, '&:hover': { borderColor: 'primary.main' } },
              activo ? { borderColor: 'primary.main', bgcolor: tokens.brandSoft, boxShadow: 'inset 0 0 0 1px ' + tokens.brand } : null]}>
            <b>{t.nombre}</b>
            <Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{t.corto}</Box>
            <Box component="span" sx={{ color: 'text.secondary', fontSize: 11 }}>{(t.fases as Fin[]).map((x) => x.nombre + ' ' + x.semanas).join(' · ')}</Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

// ---------- Gráfico del ciclo en el tiempo ----------
function Grafico({ c }: { c: Fin }) {
  const base = seriesRutina(c.rutina) as number, sem = semanasCarga(c.ciclo, base) as Fin[], N = sem.length;
  if (!N) return null;
  const fases = c.ciclo.fases as Fin[], maxC = Math.max(...sem.map((w) => w.carga)), maxF = Math.max(...sem.map((w) => w.fatiga));
  const rs = sem.map((w) => w.rendimiento), minR = Math.min(...rs), maxR = Math.max(...rs);
  // y de 0 (abajo) a 100 (arriba). Las barras llegan hasta el 60 %; las líneas usan casi todo el alto
  const yR = (r: number) => 10 + (maxR > minR ? (r - minR) / (maxR - minR) : 0.5) * 80, yF = (f: number) => 8 + f / maxF * 72;
  const puntos = (f: (w: Fin) => number) => sem.map((w, i) => (i + 0.5) + ',' + (100 - f(w))).join(' ');
  const x = (i: number) => ((i + 0.5) / N * 100);
  const hoy = sem.findIndex((w) => w.actual);
  const sc = supercompensacion(sem) as Fin, iSc = sc ? sem.findIndex((w) => w.n === sc.n) : -1;
  // La energía de sus check-ins (1 a 5) en la semana en que los mandó
  const energia = ((c.checkins || []) as Fin[]).filter((ch) => ch.energia > 0).map((ch) => ({ ch, i: sem.findIndex((w) => ch.fecha >= w.desde && ch.fecha <= w.hasta) })).filter((p) => p.i >= 0);
  const lectura = lecturaSemana(sem) as Fin;
  const columnas = { display: 'grid', gap: '2px', gridTemplateColumns: 'repeat(' + N + ', minmax(0, 1fr))' };
  const ley = { display: 'inline-block', width: 16 };
  return (
    <Tarjeta>
      <H2>📈 El ciclo en el tiempo</H2>
      {lectura ? (
        <Box component="p" sx={{ m: 0, p: '10px 12px', borderRadius: '10px', bgcolor: tokens.surface2, fontSize: 14 }}>
          <b>{(lectura.w.actual ? 'Semana ' + lectura.w.n + ' · ' : 'Empieza el ' + fechaCorta(lectura.w.desde) + ' · ') + lectura.w.fase.nombre}</b>{' '}
          {(base ? '≈ ' + lectura.w.series + ' series, ' : '') + 'RIR ' + num(lectura.w.rir) + '. ' + lectura.texto}
        </Box>
      ) : null}
      <Box role="img" aria-label={'Gráfico del ciclo: series por semana, fatiga y rendimiento' + (sc ? '; supercompensación en la semana ' + sc.n : '')} sx={{ display: 'grid', gap: '4px' }}>
        <Box sx={columnas}>
          {fases.filter((f) => Number(f.semanas) > 0).map((f) => {
            const color = colorDe(fases, fases.indexOf(f));
            return <Box component="span" key={f.id || f.nombre} title={f.nombre} sx={{ gridColumn: 'span ' + Number(f.semanas), overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 11, fontWeight: 700, p: '3px 4px', borderRadius: '6px', textAlign: 'center', bgcolor: mezcla(color, 22), borderBottom: '2px solid ' + color }}>{f.nombre}</Box>;
          })}
        </Box>
        <Box sx={{ position: 'relative', height: 'clamp(170px, 26vw, 260px)', borderBottom: '1px solid', borderColor: 'divider', background: 'repeating-linear-gradient(to top, transparent 0 24.5%, ' + mezcla(tokens.line, 60) + ' 24.5% 25%)' }}>
          <Box component="svg" viewBox={'0 0 ' + N + ' 100'} preserveAspectRatio="none" aria-hidden="true" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            {sem.map((w, i) => { const h = w.carga / maxC * 60; return <rect key={i} x={i + 0.18} y={100 - h} width={0.64} height={h} fill={colorDe(fases, w.k)} opacity={w.pasada ? 0.3 : 0.55} />; })}
            <polygon points={'0.5,100 ' + puntos((w) => yF(w.fatiga)) + ' ' + (N - 0.5) + ',100'} fill={tokens.rojo} opacity={0.08} />
            <polyline points={puntos((w) => yF(w.fatiga))} vectorEffect="non-scaling-stroke" fill="none" stroke={tokens.rojo} strokeWidth={2} strokeDasharray="5 4" strokeLinejoin="round" />
            <polyline points={puntos((w) => yR(w.rendimiento))} vectorEffect="non-scaling-stroke" fill="none" stroke={tokens.verde} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
          </Box>
          {hoy >= 0 ? (
            <Box component="span" sx={{ position: 'absolute', top: 0, bottom: 0, width: 0, borderLeft: '2px dashed', borderColor: 'text.primary', opacity: 0.8, left: x(hoy) + '%' }}>
              <Box component="i" sx={{ position: 'absolute', top: -2, left: 4, fontStyle: 'normal', fontSize: 11, fontWeight: 700, bgcolor: 'text.primary', color: 'background.default', p: '0 5px', borderRadius: '6px' }}>hoy</Box>
            </Box>
          ) : null}
          {iSc >= 0 ? (
            <Box component="span" sx={{ position: 'absolute', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 800, color: tokens.brandInk, bgcolor: tokens.verde, p: '2px 8px', borderRadius: 999, boxShadow: '0 2px 10px rgba(0, 0, 0, .35)',
              left: Math.min(84, Math.max(16, x(iSc))) + '%', bottom: Math.min(88, yR(sem[iSc].rendimiento) + 4) + '%' }}>⬆ Supercompensación</Box>
          ) : null}
          {energia.map((p, n) => (
            <Box component="i" key={n} title={'Check-in ' + fechaCorta(p.ch.fecha) + ': energía ' + p.ch.energia + '/5'}
              sx={{ position: 'absolute', width: 9, height: 9, m: '0 0 -4px -4px', borderRadius: '50%', bgcolor: tokens.amarillo, border: '2px solid', borderColor: 'background.default', left: x(p.i) + '%', bottom: (p.ch.energia / 5 * 90) + '%' }} />
          ))}
        </Box>
        <Box sx={columnas}>
          {sem.map((w) => <Box component="span" key={w.n} sx={{ textAlign: 'center', fontSize: 11, fontVariantNumeric: 'tabular-nums', color: w.actual ? 'text.primary' : 'text.secondary', fontWeight: w.actual ? 800 : 400 }}>{w.n}</Box>)}
        </Box>
      </Box>
      <Box component="ul" sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', listStyle: 'none', m: '0', p: 0, fontSize: 12, color: 'text.secondary', '& li': { display: 'flex', alignItems: 'center', gap: '6px' } }}>
        <li><Box component="i" sx={{ ...ley, height: 10, borderRadius: '2px', background: 'linear-gradient(90deg, ' + tokens.faseAzul + ', ' + tokens.brand + ', ' + tokens.faseMorado + ')', opacity: 0.7 }} />Carga: series × esfuerzo</li>
        <li><Box component="i" sx={{ ...ley, height: 3, bgcolor: tokens.verde, borderRadius: '2px' }} />Rendimiento</li>
        <li><Box component="i" sx={{ ...ley, borderTop: '2px dashed ' + tokens.rojo }} />Fatiga</li>
        {energia.length ? <li><Box component="i" sx={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', bgcolor: tokens.amarillo }} />Energía (check-in)</li> : null}
      </Box>
      <Plegable titulo="¿Cómo se lee?">
        <Explica items={[
          <><b>Cada semana carga un poco más</b> (más series o más cerca del fallo): la fatiga sube junto con la forma.</>,
          <><b>La fatiga se va rápido y la forma se queda.</b> Por eso en la descarga (la mitad de las series) la fatiga cae, y el rendimiento sube por encima de donde estaba: eso es la <b>supercompensación</b>.</>,
          'Sin descarga, la fatiga se acumula y tapa lo ganado: se estanca o se lesiona.',
          'Las curvas son un modelo (fitness-fatiga de Banister) para planear, no una medición. Lo real lo dicen sus check-ins, sus pesos y sus pruebas.',
        ]} />
      </Plegable>
      {base ? null : <Corta>Arma su rutina para ver las series reales de cada semana.</Corta>}
    </Tarjeta>
  );
}

// Barras horizontales: nombre, pista y número (el tiempo de cada día y las series por músculo)
const PISTA = { position: 'relative', height: 12, borderRadius: '6px', bgcolor: tokens.surface2 };
const Barras = ({ etiqueta, children }: { etiqueta?: string; children: ReactNode }) => (
  <Box component="ul" aria-label={etiqueta} sx={{ listStyle: 'none', m: '0', p: 0, display: 'grid', gap: '8px' }}>{children}</Box>
);
const Barra = ({ nombre, children, valor }: { nombre: string; children: ReactNode; valor: ReactNode }) => (
  <Box component="li" sx={{ display: 'grid', gridTemplateColumns: 'minmax(70px, 30%) minmax(0, 1fr) auto', gap: '8px', alignItems: 'center', fontSize: 14 }}>
    <Box component="span" sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{nombre}</Box>
    <Box component="span" sx={PISTA}>{children}</Box>
    <Box component="b" sx={{ fontVariantNumeric: 'tabular-nums', minWidth: '4.5em', textAlign: 'right', '& small': { color: 'text.secondary', fontWeight: 400, fontSize: 11 } }}>{valor}</Box>
  </Box>
);
const Lleno = ({ parte, color }: { parte: number; color: string }) => <Box component="span" sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: '6px', bgcolor: color, width: pct(parte) + '%' }} />;
const Limite = ({ en }: { en: number }) => <Box component="span" sx={{ position: 'absolute', top: -4, bottom: -4, width: 0, borderLeft: '2px solid', borderColor: 'text.primary', left: pct(en) + '%' }} />;

// ---------- Su tiempo ----------
function Tiempo({ c, k }: { c: Fin; k: number }) {
  const t = tiempoCliente(c) as Fin, maxM = Math.max(t.minutos + 15, ...(t.porDia as Fin[]).map((d) => d.minutos));
  return (
    <Tarjeta>
      <H2>⏱️ Su tiempo</H2>
      <Box sx={DOS}>
        <Campo etiqueta="Días por semana" inputMode="numeric" data-cambio="cc-tiempo" data-campo="dias" data-k={k} defaultValue={t.dias} />
        <Campo etiqueta="Minutos por sesión" inputMode="numeric" data-cambio="cc-tiempo" data-campo="minutos" data-k={k} defaultValue={t.minutos} />
      </Box>
      <Corta>📐 <b>{t.dias} días:</b> {t.division} En {t.minutos} min le caben unas <b>{t.caben} series</b> por sesión (≈ {t.cabenSemana} a la semana).</Corta>
      {t.porDia.length ? (
        <>
          <Barras etiqueta="Minutos de cada día">
            {(t.porDia as Fin[]).map((d) => (
              <Barra key={d.id} nombre={d.nombre} valor={d.minutos + ' min'}>
                <Lleno parte={d.minutos / maxM} color={d.minutos > t.minutos + 5 ? tokens.rojo : tokens.azul} /><Limite en={t.minutos / maxM} />
              </Barra>
            ))}
          </Barras>
          <Corta><Box component="i" sx={{ display: 'inline-block', width: 0, height: 12, borderLeft: '2px solid', borderColor: 'text.primary', verticalAlign: 'middle', mr: '4px' }} /> sus {t.minutos} min · cada serie ≈ 40 s + su descanso, y 8 min de calentamiento</Corta>
        </>
      ) : <Corta>Arma su rutina para ver cuánto dura cada día.</Corta>}
      {t.largo.length ? <Aviso>⏱️ {(t.largo as Fin[]).map((d) => d.nombre).join(', ')}{t.largo.length === 1 ? ' no le cabe' : ' no le caben'}. Para recortar sin perder resultados: biseries de músculos opuestos (pecho + espalda), descansos de 90 s en los aislados y quita primero los ejercicios repetidos, nunca los básicos.</Aviso> : null}
      {t.sobranDias ? <Aviso>📅 Su rutina tiene {c.rutina.length} días y solo puede ir {t.dias}. Junta días o pasa a la división de arriba.</Aviso> : null}
    </Tarjeta>
  );
}

// ---------- Series por músculo a la semana ----------
function Musculos({ c, objetivos }: { c: Fin; objetivos: Fin }) {
  const lista = volumenMusculos(c.rutina, objetivos) as Fin[];
  if (!lista.length) return null;
  const tope = Math.max(24, ...lista.map((m) => m.series + 2));
  const ESTADO: Record<string, string> = { bajo: 'Poco', ok: 'Bien', alto: 'Mucho' };
  const COLOR: Record<string, string> = { bajo: tokens.amarillo, ok: tokens.verde, alto: tokens.rojo };
  const nombres = (f: (m: Fin) => boolean) => lista.filter(f).map((m) => m.musculo).join(', ');
  return (
    <Tarjeta>
      <H2>💪 Series por músculo a la semana</H2>
      <Corta>La franja verde es el rango que sirve para crecer (10-20 series por músculo; menos en core, glúteo y pantorrilla). Es su rutina en las fases al 100 %: en la descarga baja a la mitad.</Corta>
      <Barras>
        {lista.map((m) => (
          <Barra key={m.musculo} nombre={m.musculo} valor={<>{m.series} <small>{ESTADO[m.estado]}</small></>}>
            <Box component="span" sx={{ position: 'absolute', top: -3, bottom: -3, borderRadius: '4px', border: '1px solid', borderColor: tokens.verde, bgcolor: mezcla(tokens.verde, 14), left: pct(m.min / tope) + '%', width: pct((m.max - m.min) / tope) + '%' }} />
            <Lleno parte={m.series / tope} color={COLOR[m.estado] || tokens.azul} />
          </Barra>
        ))}
      </Barras>
      {lista.some((m) => m.estado === 'bajo') ? <Corta>⬇ <b>Poco:</b> súmale 2-4 series a la semana a {nombres((m) => m.estado === 'bajo')} (o acéptalo si no es su prioridad).</Corta> : null}
      {lista.some((m) => m.estado === 'alto') ? <Corta>⬆ <b>Mucho:</b> más de 20 series casi no suma músculo y sí fatiga. Baja {nombres((m) => m.estado === 'alto')}.</Corta> : null}
      {lista.some((m) => m.muchoEnUnDia) ? <Corta>🔁 Más de 10 series de un músculo en un solo día rinden menos: reparte {nombres((m) => m.muchoEnUnDia)} en dos días.</Corta> : null}
    </Tarjeta>
  );
}

// ---------- ¿Va sobrecargado? ----------
function Senales({ c }: { c: Fin }) {
  const s = senalesSobrecarga(c) as string[];
  return (
    <Tarjeta>
      <H2>🚦 ¿Va sobrecargado?</H2>
      {s.length ? <Aviso>⚠️ {s.join(' · ')}. Si además bajó su fuerza, <b>adelanta la descarga</b> esta semana (mueve la fase o pon menos semanas en la actual).</Aviso>
        : <Corta>{(c.checkins || []).length ? '✓ Sus últimos check-ins no muestran señales de sobrecarga.' : 'Cuando mande check-ins, aquí verás si duerme mal o tiene la energía baja.'}</Corta>}
      <Plegable titulo="Las señales para adelantar la descarga">
        <Explica items={['Dos semanas seguidas durmiendo mal o sin energía.', 'Baja el peso o las reps en sus básicos dos entrenos seguidos.',
          'Dolor en una articulación (no el dolor muscular normal) o le cuesta calentar.', 'Pulso en reposo más alto de lo normal varios días, o ganas de no entrenar.',
          'Con 1-2 señales: misma semana con 1 serie menos por ejercicio. Con 3 o más: descarga ya.']} />
      </Plegable>
    </Tarjeta>
  );
}

export function CicloExperto({ c, k, objetivos }: { c: Fin; k: number; objetivos: Fin }) {
  return (
    <>
      <Grafico c={c} />
      <Tiempo c={c} k={k} />
      <Musculos c={c} objetivos={objetivos} />
      <Senales c={c} />
      <Plegable titulo="🔄 Cambiar el tipo de ciclo">
        <Corta>Cambia las fases por las del tipo elegido (la fecha de inicio se queda). Puedes deshacerlo.</Corta>
        <ElegirTipo k={k} cambiar />
      </Plegable>
    </>
  );
}
