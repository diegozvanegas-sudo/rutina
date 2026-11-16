// 🏠 Hoy: el saludo y el puntaje, lo que falta hoy, los avisos, y el tablero de tarjetas (entrenador, foco y estudio a lo
// ancho; las demás en columnas). El usuario elige cuáles se ven y en qué orden (Editar → Pantallas) y, en el computador,
// las acomoda arrastrándolas entre columnas (✋ Organizar). React pinta; las reglas son las de cada sección y las de
// src/vistas/hoy.js (plantilla, hoy-organizar, hoy-reordenar, hoy-plegar, hoy-orden).
import { useState, type DragEvent, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Collapse, Link } from '@mui/material';
import { avanceMetas, hayFutbol, habitosDe, hechosManana, comidasDelDia, planDieta, semanaActual } from '../../estado.js';
import { iso, fechaLarga } from '../../fechas.js';
import { pct } from '../../ui.js';
import { TARJETAS_HOY, visibles, SECCION_TARJETA } from '../../orden.js';
import { ve } from '../../permisos.js';
import { configurada, nube } from '../../nube.js';
import { experimentoActivo, estadoExperimento } from '../../mejora.js';
import { retoActivo, estadoRacha } from '../../retos.js';
import { estadoFila } from '../../gym.js';
import { puntajeDia } from '../../progreso.js';
import { alertas } from '../../vistas/recordatorios.js';
import { diaDeHoy } from '../../vistas/gym.js';
import { fechaPartidoPendiente } from '../../vistas/registro.js';
import { pendienteSuplementos } from '../../vistas/suplementos.js';
import { piezasHoy } from '../../vistas/hoy.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { Flecha } from '../ui/Flecha';
import { Nota } from '../ui/Textos';
import { Avance } from '../ui/Varios';
import { CabeceraManana, ListaManana } from './Manana';
import { meta as filaMeta } from './Metas';
import { comidasHoy } from './Dieta';
import { lista as listaSuplementos } from './Suplementos';
import { calentamiento } from './GymDia';
import { Experimento, RetoHoy, Entrenador, Foco, EstudioHoy, SuenoPeso, Partido, Estandares, PlataHoy, CierreHoy, SemanaGym, BotonSesion, Botones, TarjetaEnlace, Tarjeta } from './HoyTarjetas';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const H = piezasHoy as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const NOMBRES = TARJETAS_HOY as Record<string, string>;

// ---------- 🏋️ El gym de hoy y el fútbol ----------
function futbolEstaNoche(e: Fin) {
  return (
    <Tarjeta titulo="⚽ Fútbol esta noche">
      <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '4px' }}>
        {['Comida pre-partido 2-3 h antes: arroz y pollo, poca grasa y poca fibra.', 'Plátano 1 h antes y agua todo el día; si hace calor o juegas más de 60 min, electrolitos.',
          'Calienta 10-12 min antes de jugar, de suave a rápido.', 'Después: cena con proteína y carbos, y estira suave.'].map((t) => <li key={t}>{t}</li>)}
      </Box>
      <Botones>{(e.config.sesionesPartido || []).map((id: string, i: number) => <BotonSesion key={id} e={e} id={id} primario={i === 0} />)}</Botones>
      <Botones><BotonSesion e={e} id="maletin-partido" texto="Maletín del partido" /></Botones>
    </Tarjeta>
  );
}
function entrenamiento(e: Fin) {
  // El partido de hoy (o el de ayer si no se anotó) se registra junto al entreno
  const pendiente = fechaPartidoPendiente() as string | null, d = diaDeHoy() as Fin;
  const futbol = <>{hayFutbol() ? futbolEstaNoche(e) : null}{pendiente ? <Partido e={e} fecha={pendiente} /> : null}</>;
  if (!d && (hayFutbol() || pendiente)) return futbol;
  if (!d) return (
    <Tarjeta titulo="🏋️ Hoy">
      <Box component="p" sx={{ fontSize: 20, m: '4px 0 12px !important' }}>Día de descanso 😌</Box>
      {e.rutina.length ? null : <Nota sx={{ m: 0 }}>Aún no tienes rutina. <Link href="#editar/rutina">Arma tus días →</Link></Nota>}
      <Botones>{(e.config.sesionesDescanso || []).map((id: string) => <BotonSesion key={id} e={e} id={id} />)}</Botones>
    </Tarjeta>
  );
  const regs = e.semanas[semanaActual()] || {};
  const PUNTO: Record<string, string> = { falta: tokens.amarillo, completo: tokens.verde, sube: tokens.azul };
  return (
    <>
      <Tarjeta titulo={'🏋️ ' + d.nombre} lado={<Button data-accion="ir-dia" data-dia={d.id}>Abrir registro →</Button>}>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '6px' }}>
          {(d.ejercicios as Fin[]).map((ej) => {
            const colores = (ej.filas as Fin[]).map((f) => estadoFila(f, regs[f.id]) as Fin);
            const hechas = colores.reduce((s, c) => s + Math.min(c.hechas, c.plan), 0), plan = colores.reduce((s, c) => s + c.plan, 0);
            const color = colores.some((c) => c.color === 'sube') ? 'sube' : hechas >= plan ? 'completo' : hechas ? 'falta' : 'vacio';
            return (
              <Box component="li" key={ej.id} sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box component="span" sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: PUNTO[color] || tokens.line, flex: 'none' }} />
                <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{ej.nombre}</Box><b>{hechas}/{plan}</b>
              </Box>
            );
          })}
        </Box>
      </Tarjeta>
      {futbol}
      {calentamiento(d, semanaActual())}
    </>
  );
}

// ---------- Las tarjetas del tablero (cada una devuelve null si no tiene nada que mostrar) ----------
function tarjetas(e: Fin): Record<string, () => ReactNode> {
  return {
    experimento: () => Experimento({}),
    retos: () => RetoHoy(),
    entrenador: () => Entrenador({ e }),
    foco: () => Foco({ e }),
    estudio: () => EstudioHoy({ e }),
    manana: () => <Tarjeta titulo="☀️ Primera hora"><CabeceraManana /><ListaManana e={e} /></Tarjeta>,
    metas: () => {
      const m = avanceMetas() as Fin, ks = m.activas as string[];
      if (!ks.length) return null;
      return (
        <Tarjeta titulo="🎯 Metas" lado={<Box component="span" sx={{ fontSize: 22, fontWeight: 800 }}>{pct(m.total)}</Box>}>
          <Avance parte={m.total} />
          {ks.map((k) => <Box key={k} sx={{ mt: '10px' }}>{filaMeta(e, k, m, true)}</Box>)}
          <Button fullWidth color="secondary" href="#metas">Registrar metas →</Button>
        </Tarjeta>
      );
    },
    gym: () => entrenamiento(e),
    suenoPeso: () => SuenoPeso({ e }),
    estandares: () => Estandares({ e }),
    dieta: () => <Tarjeta titulo="🥗 Comidas" lado={<Link href="#dieta" sx={{ fontSize: 14, color: 'text.secondary' }}>Ver plan →</Link>}>{comidasHoy(e, true)}</Tarjeta>,
    plata: () => PlataHoy({ e }),
    suplementos: () => {
      const S = (e.suplementos || { lista: [] }) as Fin, p = pendienteSuplementos() as [number, number] | null;
      if (!S.lista.length) return (
        <Tarjeta titulo="💊 Suplementos">
          <Nota sx={{ m: 0 }}>Anota la creatina y lo demás que tomes, para no saltarte días.</Nota>
          <Botones><Button color="secondary" data-accion="sup-plantilla" data-i="0">＋ Creatina 5 g</Button><Button color="secondary" href="#suplementos">Ver más →</Button></Botones>
        </Tarjeta>
      );
      if (!p) return null;
      return (
        <Tarjeta titulo="💊 Suplementos" lado={<Box component="span" sx={{ fontSize: 22, fontWeight: 800 }}>{p[0]}/{p[1]}</Box>}>
          {listaSuplementos(e, iso(), true)}
          <Button fullWidth color="secondary" href="#suplementos">Ver constancia →</Button>
        </Tarjeta>
      );
    },
    cierre: () => CierreHoy({ e }),
    semana: () => <Tarjeta titulo="📅 Semana"><SemanaGym e={e} /></Tarjeta>,
  };
}

// Lo largo o de consulta va plegado en el celular; cada quien lo abre y queda como lo dejó (hoy-plegar)
function Plegada({ k, children }: { k: string; children: ReactNode }) {
  const abierta = H.abierta(k) as boolean;
  return (
    <Box data-plegar={k} sx={{ mb: '14px', borderRadius: tokens.radio + 'px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: '10px 14px', '& > .MuiCollapse-root section, & > .MuiCollapse-root .MuiCard-root': { border: 0, p: 0, mb: 0, bgcolor: 'transparent' } }}>
      <ButtonBase data-accion="hoy-plegar" data-k={k} aria-expanded={abierta} sx={{ width: '100%', justifyContent: 'flex-start', gap: '6px', minHeight: 40, font: 'inherit', fontWeight: 700, fontSize: 17, color: 'text.primary', textAlign: 'left' }}>
        <Flecha abierta={abierta} />{NOMBRES[k]}
      </ButtonBase>
      <Collapse in={abierta} timeout={150}><Box sx={{ pt: '8px' }}>{children}</Box></Collapse>
    </Box>
  );
}

// ---------- El tablero en columnas: repartido solo o como el usuario lo dejó; en ✋ Organizar se arrastra ----------
function Tablero({ ids, contenido, n, moviendo }: { ids: string[]; contenido: Record<string, ReactNode>; n: number; moviendo: boolean }) {
  const base = H.repartir(ids, n) as string[][];
  const [arrastre, ponerArrastre] = useState<{ k: string; cols: string[][] } | null>(null);
  const cols = arrastre ? arrastre.cols : base;
  const empezar = (k: string, ev: DragEvent) => { ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', k); ponerArrastre({ k, cols: base.map((c) => [...c]) }); };
  // Se mueve en vivo: queda antes de la primera tarjeta cuyo centro está debajo del cursor
  const encima = (i: number, ev: DragEvent<HTMLDivElement>) => {
    if (!arrastre) return;
    ev.preventDefault();
    const cartas = [...ev.currentTarget.querySelectorAll<HTMLElement>(':scope > [data-carta]')].filter((x) => x.dataset.carta !== arrastre.k);
    const antes = cartas.find((x) => { const r = x.getBoundingClientRect(); return ev.clientY < r.top + r.height / 2; });
    const nuevas = arrastre.cols.map((c) => c.filter((k) => k !== arrastre.k)), destino = nuevas[i];
    const pos = antes ? destino.indexOf(antes.dataset.carta as string) : destino.length;
    destino.splice(pos < 0 ? destino.length : pos, 0, arrastre.k);
    if (JSON.stringify(nuevas) !== JSON.stringify(arrastre.cols)) ponerArrastre({ k: arrastre.k, cols: nuevas });
  };
  const terminar = () => { if (arrastre) { H.guardarOrden(arrastre.cols); ponerArrastre(null); } };
  return (
    <Box data-tablero="" sx={{ display: 'grid', gridTemplateColumns: 'repeat(' + n + ', minmax(0, 1fr))', gap: '14px', alignItems: 'start' }}>
      {cols.map((c, i) => (
        <Box key={i} data-col={i} onDragOver={moviendo ? (ev) => encima(i, ev) : undefined} onDrop={moviendo ? (ev) => ev.preventDefault() : undefined}
          sx={[{ minWidth: 0, minHeight: 40 }, moviendo ? { outline: '2px dashed', outlineColor: tokens.line, borderRadius: tokens.radio + 'px', p: '6px' } : null]}>
          {c.map((k) => (
            <Box key={k} data-carta={k} draggable={moviendo || undefined} onDragStart={moviendo ? (ev) => empezar(k, ev) : undefined} onDragEnd={moviendo ? terminar : undefined}
              sx={[moviendo ? { cursor: 'grab', '& *': { pointerEvents: 'none' } } : null, arrastre && arrastre.k === k ? { opacity: 0.4 } : null]}>
              {contenido[k]}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}

// Lo que falta hoy, de un vistazo
function pendienteHoy(e: Fin) {
  const hs = habitosDe().length, plan = planDieta().comidas.length, m = avanceMetas() as Fin, x = experimentoActivo() as Fin, fichas: [string, string, string, boolean][] = [];
  if (hs) fichas.push(['☀️', hechosManana() + '/' + hs, '#manana', hechosManana() >= hs]);
  if (m.activas.length) fichas.push(['🎯', pct(m.total), '#metas', m.total >= 1]);
  if (plan) fichas.push(['🥗', (comidasDelDia() as Fin).n + '/' + plan, '#dieta', (comidasDelDia() as Fin).n >= plan]);
  const sup = ve('seccion', 'suplementos') && (pendienteSuplementos() as [number, number] | null);
  if (sup) fichas.push(['💊', sup[0] + '/' + sup[1], '#suplementos', sup[0] >= sup[1]]);
  if (x && !(estadoExperimento(x) as Fin).termino) fichas.push(['🧪', (estadoExperimento(x) as Fin).hoyListo ? 'Hecho' : 'Pendiente', '#hoy', (estadoExperimento(x) as Fin).hoyListo]);
  const reto = retoActivo() as Fin;
  if (reto) fichas.push(['🔥', (estadoRacha(reto) as Fin).hoyListo ? 'Hecho' : 'Pendiente', '#hoy', (estadoRacha(reto) as Fin).hoyListo]);
  void e;
  if (!fichas.length) return null;
  return (
    <Box component="nav" aria-label="Lo de hoy" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mb: '14px' }}>
      {fichas.map(([i, t, ir, ok]) => (
        <Box component="a" key={i} href={ir} sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', minHeight: 44, p: '6px 14px', borderRadius: 999, border: '1px solid', borderColor: ok ? 'primary.main' : 'divider', bgcolor: 'background.paper', color: ok ? 'primary.main' : 'text.primary', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
          <span aria-hidden="true">{i}</span> {t}
        </Box>
      ))}
    </Box>
  );
}

export default function Hoy() {
  const e = usarEstado() as Fin, ver = H.ver(), p = puntajeDia() as Fin;
  // Las tarjetas de una sección que el admin escondió tampoco se ven
  const avisos = (ve('seccion', 'recordatorios') ? alertas() : []) as Fin[];
  const ids = (visibles(e.config, 'hoy') as string[]).filter((k) => !(SECCION_TARJETA as Record<string, string>)[k] || ve('seccion', (SECCION_TARJETA as Record<string, string>)[k]));
  const T = tarjetas(e), contenido: Record<string, ReactNode> = {};
  for (const k of ids) { const c = T[k] ? T[k]() : null; if (c) contenido[k] = (H.PLEGABLES as string[]).includes(k) ? <Plegada k={k}>{c}</Plegada> : c; }
  const anchas = ids.filter((k) => (H.ANCHAS as string[]).includes(k) && contenido[k]), resto = ids.filter((k) => !(H.ANCHAS as string[]).includes(k) && contenido[k]);
  const n = H.columnas() as number, moviendo = ver.organizando && n > 1;
  const bienvenida = e.bienvenida && !(configurada && !nube.ultima);
  return (
    <>
      <Box sx={{ ...FILA, alignItems: 'flex-start', mb: '10px' }}>
        <div>
          <Box component="h1" sx={{ m: '4px 0 4px', fontSize: 26, fontWeight: 700, lineHeight: 1.25 }}>{H.saludo()}</Box>
          <Box component="p" sx={{ color: 'text.secondary', m: 0 }}>{fechaLarga(iso())} · semana {semanaActual()}</Box>
        </div>
        <Box component="a" href="#progreso" title="Puntaje del día: mañana, metas, gym y dieta" sx={{ display: 'grid', justifyItems: 'center', minWidth: 82, p: '8px 12px', borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary', textDecoration: 'none', '& b': { fontSize: 22 }, '& small': { color: 'text.secondary', fontSize: 12 } }}>
          <b>{p ? p.total : 0}</b><small>/100 hoy</small>
        </Box>
      </Box>
      {bienvenida ? (
        <Tarjeta titulo="👋 Bienvenido">
          <p>¿Cómo quieres empezar? Todo se puede cambiar, mover o borrar después en ✏️ Editar.</p>
          <Botones>
            <Button data-accion="plantilla" data-vacia="" sx={{ minHeight: 56, fontSize: 17 }}>📋 Con el ejemplo (rutina, hábitos y fútbol)</Button>
            <Button color="secondary" data-accion="plantilla" data-vacia="1" sx={{ minHeight: 56, fontSize: 17 }}>🧹 Vacío: armo lo mío</Button>
          </Botones>
        </Tarjeta>
      ) : null}
      {pendienteHoy(e)}
      {/* Avisos, entrenador, foco y estudio: en el computador se acomodan lado a lado */}
      <Box sx={{ display: { md: 'grid' }, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', columnGap: '14px', alignItems: 'start' }}>
        {avisos.length ? (
          <TarjetaEnlace href="#recordatorios" dorada tip={avisos.length > 3 ? avisos.map((a) => '• ' + a.icono + ' ' + a.nombre + (a.estado === 'vencido' ? ' (vencido)' : '')).join('\n') : undefined}>
            <b>🔔 {avisos.length}{avisos.length === 1 ? ' recordatorio' : ' recordatorios'}</b>
            <span>{avisos.slice(0, 3).map((a) => a.icono + ' ' + a.nombre + (a.estado === 'vencido' ? ' (vencido)' : '')).join(' · ')}</span>
          </TarjetaEnlace>
        ) : null}
        {anchas.map((k) => <Box key={k} sx={{ minWidth: 0 }}>{contenido[k]}</Box>)}
      </Box>
      <Tablero ids={resto} contenido={contenido} n={n} moviendo={moviendo} />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', mt: '6px' }}>
        <Button color="secondary" data-accion="hoy-organizar">{ver.organizando ? '✓ Listo' : '✋ Organizar tarjetas'}</Button>
        {ver.organizando && H.guardadas()[n] ? <Button color="secondary" data-accion="hoy-reordenar">↺ Acomodar solas</Button> : null}
      </Box>
      {ver.organizando ? <Nota sx={{ textAlign: 'center' }}>Arrastra cada tarjeta a la columna y el lugar que quieras. Se guarda para este ancho de pantalla.</Nota> : null}
      <Nota sx={{ textAlign: 'center' }}><Link href="#editar/pantallas">↕ Ordenar o esconder tarjetas</Link></Nota>
    </>
  );
}
