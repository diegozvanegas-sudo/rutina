// 🗺️ Lugares: los que visité y los que quiero visitar, en mapas SVG propios (sin internet): Mundo › Colombia o Brasil ›
// Antioquia. React pinta; tocar, arrastrar, pellizcar y la rueda del mapa siguen en src/vistas/lugares.js (miran
// [data-mapa-svg] y mueven su viewBox sin repintar), igual que las acciones (lug-…). Guardar el lugar y la visita leen sus
// campos por nombre (data-form-lugar, data-visita): esos botones llevan data-accion.
import { useEffect, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Checkbox, Chip, FormControl, FormLabel, IconButton, Link, NativeSelect, OutlinedInput } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { iso, fechaCorta } from '../../fechas.js';
import { pct } from '../../ui.js';
import { pesos } from '../../finanzas.js';
import { ve } from '../../permisos.js';
import { MAPAS } from '../../mapas/index.js';
import { TIPOS_LUGAR } from '../../datos_lugares.js';
import { proyectar, piezaDelLugar, lugaresDePieza, estadoPieza, resumenMapa, avanceGrupos, lineaTiempo, filtrar, ordenar, mapaHijo, migas, enlaceSeguro } from '../../lugares.js';
import { piezasLugares } from '../../vistas/lugares.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo, CampoLista, CampoSolo } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';
import { Opciones, Avance } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'lugares';
const G = piezasLugares as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const CELULAR = '@media (max-width: 600px)';
const Botones = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' }}>{children}</Box>;
const Cerrar = ({ accion }: { accion: string }) => <IconButton data-accion={accion} aria-label="Cerrar">✕</IconButton>;
const Cal = ({ children }: { children: ReactNode }) => <Box component="span" sx={{ color: 'warning.main' }}>{children}</Box>;
const entra = keyframes`from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: none; }`;
const sale = keyframes`from { opacity: 0; transform: scale(1.08); } to { opacity: 1; transform: none; }`;
const ESTADO_PIEZA = (estado: string, tono: number) => (estado === 'visitado' ? 'v' + tono : estado === 'quiero' ? 'q' : '');

// Colores de las piezas y los puntos, por sus data-*
const SVG = {
  display: 'block', width: '100%', maxHeight: '78vh', m: '0 auto', touchAction: 'pan-y', userSelect: 'none', cursor: 'pointer',
  [CELULAR]: { minHeight: 240 },
  '&[data-zoom]': { touchAction: 'none', cursor: 'grab' },
  '& [data-pieza]': { fill: tokens.surface2, stroke: tokens.bg, strokeWidth: '.8px', vectorEffect: 'non-scaling-stroke', transition: 'fill .2s', '&:hover': { fill: tokens.line } },
  '& [data-e=q]': { fill: tokens.mapaQuiero, stroke: tokens.amarillo, strokeDasharray: '3 2' },
  '& [data-e=v1]': { fill: tokens.mapaVisto1 }, '& [data-e=v2]': { fill: tokens.mapaVisto2 }, '& [data-e=v3]': { fill: tokens.brand },
  '& [data-hijo]': { cursor: 'zoom-in', stroke: tokens.muted, strokeDasharray: 'none' }, '& [data-e=q][data-hijo]': { stroke: tokens.amarillo },
  '& [data-sel]': { stroke: tokens.ink, strokeWidth: '2px', strokeDasharray: 'none' },
  '& [data-lugar]': { transform: 'scale(calc(1 / var(--z, 1)))', cursor: 'pointer' },
  '& [data-toque]': { fill: 'transparent' },
  '& [data-punto=v] circle:not([data-toque])': { fill: tokens.ink, stroke: tokens.bg, strokeWidth: '1.5px' },
  '& [data-punto=q] polygon': { fill: tokens.surface, stroke: tokens.amarillo, strokeWidth: '1.4px' },
  '& [data-abierto] polygon, & [data-abierto] circle:not([data-toque])': { fill: tokens.amarillo, stroke: tokens.ink },
  '@media (prefers-reduced-motion: reduce)': { animation: 'none !important', '& [data-pieza]': { transition: 'none' } },
};
const Ley = ({ tipo }: { tipo?: 'v' | 'q' }) => (
  <Box component="i" sx={{ width: 12, height: 12, borderRadius: '3px', border: '1px solid', borderColor: 'divider', bgcolor: tokens.surface2, ...(tipo === 'v' ? { bgcolor: tokens.mapaVisto2 } : tipo === 'q' ? { bgcolor: tokens.mapaQuiero, border: '1px dashed', borderColor: tokens.amarillo } : null) }} />
);

// ---------- El mapa ----------
function dibujo(e: Fin, ver: Fin) {
  const mapa = ver.mapa, caja = ver.caja, porPieza: Record<string, Fin[]> = {};
  for (const l of G.lista() as Fin[]) { const p = piezaDelLugar(l, mapa.id, MAPAS); if (p != null) (porPieza[p] ??= []).push(l); }
  const puntos = (G.lista() as Fin[]).filter((l) => l.lat != null && G.enElMapa(l) && (l.mapa === mapa.id || l.estado === 'visitado'));
  const z = 1000 / caja.w, anim = ver.animar === 'mapa-sale' ? sale : entra;
  return (
    <Box sx={{ position: 'relative', bgcolor: 'background.default', borderRadius: tokens.radio + 'px', overflow: 'hidden' }}>
      <Box component="svg" key={mapa.id} data-mapa-svg="" data-zoom={caja.w < mapa.ancho - 1 ? '' : undefined} viewBox={[caja.x, caja.y, caja.w, caja.h].join(' ')} role="img" aria-label={'Mapa de ' + mapa.nombre}
        style={{ '--z': z, aspectRatio: mapa.ancho + '/' + mapa.alto } as object}
        sx={[SVG, ver.animar ? { animation: anim + ' .45s ease-out' } : null, ver.ubicando ? { cursor: 'crosshair !important', outline: '2px solid', outlineColor: tokens.amarillo, outlineOffset: '-2px' } : null]}>
        {(mapa.piezas as Fin[]).map((p) => {
          const ls = porPieza[p.id] || [], { estado, tono } = estadoPieza(ls) as Fin, hijo = mapaHijo(MAPAS, mapa.id, p.id);
          const tip = p.nombre + ' · ' + p.grupo + ' · ' + (ls.length ? G.plural(ls.length, 'lugar', 'lugares') : 'sin lugares') + (hijo ? ' · toca para entrar' : '');
          return <path key={p.id} d={p.d} data-pieza={p.id} data-tip={tip} data-e={ESTADO_PIEZA(estado, tono) || undefined} data-sel={p.id === ver.piezaSel ? '' : undefined} data-hijo={hijo ? '' : undefined} />;
        })}
        {puntos.map((l) => {
          const [x, y] = proyectar(mapa, l.lat, l.lon) as number[], v = l.estado === 'visitado';
          return (
            <g key={l.id} transform={'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'}>
              <g data-lugar={l.id} data-punto={v ? 'v' : 'q'} data-abierto={l.id === ver.abierto ? '' : undefined} data-tip={(v ? '● ' : '☆ ') + l.nombre}>
                <circle data-toque="" r="14" />
                {v ? <circle r="6" /> : <polygon points="0,-8 2.2,-2.5 8,-2.5 3.4,1.2 5,7 0,3.6 -5,7 -3.4,1.2 -8,-2.5 -2.2,-2.5" />}
              </g>
            </g>
          );
        })}
      </Box>
      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'grid', gap: '4px', [CELULAR]: { position: 'static', display: 'flex', justifyContent: 'flex-end', p: '6px' } }}>
        {([['lug-zoom', '1.5', 'Acercar', '＋'], ['lug-zoom', '0.66', 'Alejar', '－'], ['lug-grupo', '', 'Ver todo', '⤢']] as string[][]).map(([a, v, t, s]) => (
          <IconButton key={t} data-accion={a} {...(a === 'lug-zoom' ? { 'data-f': v } : { 'data-g': v })} aria-label={t} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', fontSize: 20 }}>{s}</IconButton>
        ))}
      </Box>
      <Box sx={{ position: 'absolute', left: 8, bottom: 8, display: 'flex', flexWrap: 'wrap', gap: '8px', p: '4px 8px', borderRadius: '10px', bgcolor: 'background.paper', fontSize: 12, color: 'text.secondary', pointerEvents: 'none',
        '& span': { display: 'flex', alignItems: 'center', gap: '4px' }, [CELULAR]: { position: 'static', bgcolor: 'transparent', p: '0 8px 8px' } }}>
        <span><Ley tipo="v" />Visitado</span><span><Ley tipo="q" />Quiero ir</span><span><Ley />Sin marcar</span>
      </Box>
    </Box>
  );
}

function numeros(ver: Fin) {
  const mapa = ver.mapa, r = resumenMapa(mapa, G.lista(), MAPAS, Number(iso().slice(0, 4))) as Fin, info = (MAPAS as Fin)[mapa.id];
  const kpis: [string, string][] = [[r.piezas + ' / ' + r.total, info.unidad + ' · ' + pct(r.fraccion)], [String(r.visitados), r.visitados === 1 ? 'lugar visitado' : 'lugares visitados'], [String(r.porVisitar), 'por visitar'],
    [String(r.viajes), r.viajes === 1 ? 'viaje este año' : 'viajes este año'], [String(r.paises), r.paises === 1 ? 'país' : 'países'], [r.ultimo ? r.ultimo.nombre : '—', 'último lugar']];
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', mb: '14px' }}>
      {kpis.map(([n, t], i) => (
        <Box key={i} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: tokens.radio + 'px', p: '12px', display: 'grid', gap: '2px' }}>
          <Box component="b" sx={{ fontSize: 26, fontVariantNumeric: 'tabular-nums' }}>{n}</Box><Box component="span" sx={{ color: 'text.secondary', fontSize: 13 }}>{t}</Box>
        </Box>
      ))}
    </Box>
  );
}

// ---------- Listas ----------
function filaLugar(l: Fin, abierto: string | null) {
  const v = l.estado === 'visitado', detalle = [G.dondeEs(l), v ? ((l.visitas || []).length ? G.plural(l.visitas.length, 'visita') : '') : l.horas ? G.horas(l.horas) : ''].filter(Boolean).join(' · ');
  return (
    <li key={l.id}>
      <ButtonBase data-accion="lug-abrir" data-id={l.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', width: '100%', minHeight: 52, p: '8px', bgcolor: tokens.surface2, borderRadius: '12px', color: 'text.primary', font: 'inherit', textAlign: 'left', ...(l.id === abierto ? { outline: '2px solid', outlineColor: 'primary.main' } : null) }}>
        <Box component="span" aria-hidden="true" sx={{ fontSize: 22, width: 30, textAlign: 'center' }}>{l.emoji || '📍'}</Box>
        <Box component="span" sx={{ flex: 1, minWidth: 0, display: 'grid', '& small': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'text.secondary', fontSize: 13 } }}><b>{l.nombre}</b><small>{detalle}</small></Box>
        <Box component="span" sx={{ color: v ? 'primary.main' : 'warning.main' }}>{v ? '●' : '☆'}</Box>
      </ButtonBase>
    </li>
  );
}
const Lista = ({ children }: { children: ReactNode }) => <Box component="ul" sx={{ listStyle: 'none', m: '8px 0', p: 0, display: 'grid', gap: '4px' }}>{children}</Box>;

function panelPieza(ver: Fin) {
  const mapa = ver.mapa, p = ver.piezaSel && (mapa.piezas as Fin[]).find((x) => x.id === ver.piezaSel);
  if (!p) return null;
  const ls = lugaresDePieza(G.lista(), mapa.id, p.id, MAPAS) as Fin[];
  return (
    <TarjetaPlegable vista={VISTA} clave={p.nombre} titulo={p.nombre} lado={<Cerrar accion="lug-cerrar-pieza" />}>
      <Nota>{p.grupo} · {G.plural(ls.length, 'lugar', 'lugares')}</Nota>
      {ls.length ? <Lista>{ls.map((l) => filaLugar(l, ver.abierto))}</Lista> : null}
      <Botones>
        {ls.some((l) => l.estado === 'visitado')
          ? <Button color="secondary" data-accion="lug-quitar-pieza" data-p={p.id}>↩ Quitar de visitados</Button>
          : <Button data-accion="lug-ya-estuve" data-p={p.id}>✓ Ya estuve aquí</Button>}
        <Button color="secondary" data-accion="lug-nuevo" data-p={p.id}>＋ Agregar lugar aquí</Button>
      </Botones>
    </TarjetaPlegable>
  );
}

function listaLugares(ver: Fin) {
  const mapa = ver.mapa, f = ver.filtro, delMapa = (G.lista() as Fin[]).filter(G.enElMapa), ls = ordenar(filtrar(delMapa, f, G.grupoDe)) as Fin[], paises = [...new Set(delMapa.map((l) => l.pais).filter(Boolean))].sort() as string[];
  const sel = (k: string, etiqueta: string, todas: string, valores: [string, string][]) => (
    <NativeSelect key={k} defaultValue={f[k]} input={<OutlinedInput />} inputProps={{ 'data-cambio': 'lug-filtro', 'data-k': k, 'aria-label': etiqueta } as object}>
      <option value="">{todas}</option>{valores.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
    </NativeSelect>
  );
  return (
    <TarjetaPlegable vista={VISTA} clave={'Lugares (' + ls.length + ')'} titulo={'Lugares (' + ls.length + ')'} lado={<Button data-accion="lug-nuevo">＋ Agregar lugar</Button>}>
      <Opciones nombre="Estado" activa={f.estado} opciones={[['', 'Todos'], ['visitado', '● Visitados'], ['quiero', '☆ Por visitar']]} datos={(v) => ({ 'data-accion': 'lug-estado', 'data-v': v })} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', m: '10px 0' }}>
        <CampoSolo noVaciar type="search" data-cambio="lug-filtro" data-k="texto" placeholder="Buscar" aria-label="Buscar lugar" defaultValue={f.texto} />
        {sel('pais', 'País', 'Todos los países', paises.map((p) => [p, p]))}
        {sel('grupo', 'Región', 'Todas las regiones', (mapa.grupos as string[]).map((g) => [g, g]))}
        {sel('tipo', 'Tipo', 'Todos los tipos', Object.entries(TIPOS_LUGAR as Record<string, string>))}
      </Box>
      {ls.length ? <Lista>{ls.map((l) => filaLugar(l, ver.abierto))}</Lista> : <Nota>Nada con estos filtros.</Nota>}
    </TarjetaPlegable>
  );
}

// ---------- Detalle de un lugar ----------
// Las fotos no se guardan en la app: cada visita puede llevar un enlace a su carpeta de Drive
const verFotos = (v: Fin) => (enlaceSeguro(v.enlace) ? <Link href={enlaceSeguro(v.enlace) as string} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontWeight: 600 }}>📷 Ver fotos</Link> : null);
function detalle(ver: Fin) {
  const l = ver.abierto && G.buscar(ver.abierto);
  if (!l) return null;
  const v = l.estado === 'visitado', finanzas = ve('seccion', 'finanzas'), visitas = (l.visitas || []) as Fin[];
  const datos = [(TIPOS_LUGAR as Record<string, string>)[l.tipo], G.dondeEs(l), !v && l.prioridad ? 'Prioridad ' + ['alta', 'media', 'baja'][l.prioridad - 1] : '', !v && l.epoca ? 'Mejor época: ' + l.epoca : '',
    !v && l.horas ? G.horas(l.horas) : '', !v && l.presupuesto ? 'Presupuesto ≈ ' + pesos(l.presupuesto) : ''].filter(Boolean);
  return (
    <TarjetaPlegable vista={VISTA} clave={(l.emoji || '📍') + ' ' + l.nombre} titulo={(l.emoji || '📍') + ' ' + l.nombre} lado={<Cerrar accion="lug-cerrar" />}>
      <Nota>{datos.join(' · ')}</Nota>
      <Botones>
        <Button color="secondary" data-accion="lug-cambiar-estado" data-id={l.id}>{v ? '☆ Pasar a quiero ir' : '✓ Ya estuve'}</Button>
        <Button color="secondary" data-accion="lug-editar" data-id={l.id}>✏️ Editar</Button>
        <Button color="secondary" data-accion="lug-borrar" data-id={l.id}>🗑️ Borrar</Button>
      </Botones>
      {visitas.length ? <>
        <Box component="h3" sx={{ fontSize: 17, m: '12px 0 4px' }}>Visitas</Box>
        <Box component="ul" sx={{ listStyle: 'none', m: '8px 0', p: 0, display: 'grid', gap: '6px' }}>
          {visitas.map((x, i) => (
            <Box component="li" key={i} sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px', p: '8px', bgcolor: tokens.surface2, borderRadius: '12px', '& small': { display: 'block', color: 'text.secondary', fontSize: 13 }, '& p': { m: '4px 0 0' } }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <b>{x.fecha ? fechaCorta(x.fecha) : 'Sin fecha'}</b> <Cal>{G.estrellas(x.calificacion)}</Cal>
                <small>{[x.con ? 'Con ' + x.con : '', x.gasto ? pesos(x.gasto) : ''].filter(Boolean).join(' · ')}</small>
                {x.nota ? <p>{x.nota}</p> : null}
                {verFotos(x)}
                <Desplegable titulo={<Box component="span" sx={{ fontSize: 14, fontWeight: 400, color: 'text.secondary' }}>🔗 {x.enlace ? 'Cambiar enlace' : 'Agregar enlace de fotos'}</Box>}>
                  <CampoSolo noVaciar type="url" inputMode="url" data-cambio="lug-enlace" data-id={l.id} data-i={i} placeholder="https://drive.google.com/…" aria-label="Enlace de las fotos" defaultValue={x.enlace || ''} />
                </Desplegable>
              </Box>
              <IconButton data-accion="lug-borrar-visita" data-id={l.id} data-i={i} aria-label="Borrar visita">🗑️</IconButton>
            </Box>
          ))}
        </Box>
      </> : null}
      {/* Se rehace cuando cambia el estado o se guarda una visita: queda vacío y abierto si aún no hay visitas */}
      <Desplegable key={l.id + l.estado + visitas.length} abiertoAlInicio={v && !visitas.length} titulo="＋ Agregar visita" sx={{ mt: '10px' }}>
        <Box data-visita={l.id} sx={{ display: 'grid', gap: '10px' }}>
          <Campo etiqueta="Fecha" type="date" name="fecha" defaultValue={iso()} />
          <Campo etiqueta="Con quién" name="con" />
          <CampoLista etiqueta="Calificación" name="calificacion" defaultValue="0" opciones={[['0', 'Sin calificar'], ...[5, 4, 3, 2, 1].map((n) => [String(n), G.estrellas(n)] as [string, string])]} />
          <CampoLargo etiqueta="Nota" name="nota" filas={2} />
          <Campo etiqueta="Enlace de las fotos (Drive, opcional)" type="url" inputMode="url" name="enlace" placeholder="https://drive.google.com/…" />
          <Campo etiqueta="Gasto" inputMode="numeric" data-pesos="" name="gasto" placeholder="0" />
          {finanzas ? <Box component="label" sx={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}><Checkbox defaultChecked slotProps={{ input: { name: 'finanzas' } as object }} sx={{ p: '4px', ml: '-4px' }} />Guardar el gasto en Finanzas (Salidas y ocio)</Box> : null}
          <Button fullWidth data-accion="lug-guardar-visita" data-id={l.id}>Guardar visita</Button>
        </Box>
      </Desplegable>
    </TarjetaPlegable>
  );
}

// ---------- Formulario de lugar ----------
function formulario(ver: Fin) {
  const b = ver.borrador, mapa = ver.mapa;
  if (!b) return null;
  const titulo = b.id ? 'Editar lugar' : 'Nuevo lugar';
  return (
    <TarjetaPlegable key={b.id || 'nuevo'} vista={VISTA} clave={titulo} titulo={titulo}>
      <Box data-form-lugar="" sx={{ display: 'grid', gap: '10px' }}>
        <Campo etiqueta="Nombre" name="nombre" defaultValue={b.nombre || ''} />
        <Campo etiqueta="Emoji" maxLength={4} name="emoji" defaultValue={b.emoji || '📍'} />
        <CampoLista etiqueta="Tipo" name="tipo" defaultValue={b.tipo} opciones={Object.entries(TIPOS_LUGAR as Record<string, string>)} />
        <CampoLista etiqueta="Estado" name="estado" defaultValue={b.estado === 'visitado' ? 'visitado' : 'quiero'} opciones={[['quiero', '☆ Quiero ir'], ['visitado', '● Visitado']]} />
        <FormControl fullWidth sx={{ display: 'grid', gap: '4px' }}>
          <FormLabel htmlFor="lug-pieza">{G.una()}</FormLabel>
          <NativeSelect key={b.pieza} defaultValue={b.pieza || ''} input={<OutlinedInput fullWidth />} inputProps={{ id: 'lug-pieza', name: 'pieza' }}>
            <option value="">Escoge…</option>
            {(mapa.grupos as string[]).map((g) => (
              <optgroup key={g} label={g}>{(mapa.piezas as Fin[]).filter((p) => p.grupo === g && !mapaHijo(MAPAS, mapa.id, p.id)).map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</optgroup>
            ))}
          </NativeSelect>
        </FormControl>
        <Button fullWidth color="secondary" data-accion="lug-ubicar">📍 Tocar el mapa para ubicarlo</Button>
        <Nota sx={{ m: 0 }}>{b.lat != null ? 'Punto: ' + b.lat.toFixed(4) + ', ' + b.lon.toFixed(4) : 'Sin tocar el mapa, el punto queda en el centro.'}</Nota>
        <CampoLista etiqueta="Prioridad" name="prioridad" defaultValue={String(b.prioridad || 2)} opciones={[['1', 'Alta'], ['2', 'Media'], ['3', 'Baja']]} />
        <Campo etiqueta="Mejor época" name="epoca" defaultValue={b.epoca || ''} />
        <Campo etiqueta="Horas desde Medellín" inputMode="decimal" min={0} step="0.5" name="horas" defaultValue={b.horas ?? ''} />
        <Campo etiqueta="Presupuesto aproximado" inputMode="numeric" data-pesos="" name="presupuesto" defaultValue={b.presupuesto || ''} />
        <Botones><Button data-accion="lug-guardar">Guardar</Button><Button color="secondary" data-accion="lug-cancelar">Cancelar</Button></Botones>
      </Box>
    </TarjetaPlegable>
  );
}

// ---------- Sorpréndeme, avance por región y línea de tiempo ----------
function sorpresa(ver: Fin) {
  const plan = ver.plan, p = plan && G.buscar(plan.principal);
  const lado = <Button data-accion="lug-sorpresa">{p ? 'Otro plan' : 'Dame un plan'}</Button>;
  const cerca = plan ? (plan.cercanos as string[]).map(G.buscar).filter(Boolean) as Fin[] : [];
  return (
    <TarjetaPlegable vista={VISTA} clave="🎲 Sorpréndeme" titulo="🎲 Sorpréndeme" lado={lado}>
      {!plan ? <Nota>Un plan de fin de semana entre los lugares de Antioquia que quieres conocer, según la distancia y la prioridad.</Nota>
        : !p ? <Nota>No hay lugares por visitar a menos de 4 horas. Agrega alguno.</Nota>
        : <>
          <Box component="p" sx={{ fontSize: 20, fontWeight: 700, m: '6px 0 2px' }}>{(p.emoji || '📍') + ' ' + p.nombre}</Box>
          <Nota>{G.dondeEs(p)} · {G.horas(p.horas)} · {plan.dias === 2 ? 'mejor con noche' : 'da para ir y volver el mismo día'}</Nota>
          {cerca.length ? <Nota>Cerca: {cerca.map((x) => x.nombre).join(', ')}</Nota> : null}
          <Button color="secondary" data-accion="lug-abrir" data-id={p.id}>Ver en el mapa</Button>
        </>}
    </TarjetaPlegable>
  );
}
function grupos(ver: Fin) {
  const filas = avanceGrupos(ver.mapa, G.lista(), MAPAS) as Fin[], nombre = (MAPAS as Fin)[ver.mapa.id].grupo;
  return (
    <TarjetaPlegable vista={VISTA} clave={'Avance por ' + nombre} titulo={'Avance por ' + nombre}>
      <Nota>Toca una para acercarte en el mapa.</Nota>
      <Box sx={{ display: 'grid', gap: '4px', gridTemplateColumns: { md: '1fr 1fr' }, columnGap: { md: '16px' } }}>
        {filas.map((g) => (
          <ButtonBase key={g.grupo} data-accion="lug-grupo" data-g={g.grupo} sx={{ display: 'block', width: '100%', p: '6px', borderRadius: '10px', color: 'text.primary', font: 'inherit', textAlign: 'left', '&:hover': { bgcolor: tokens.surface2 } }}>
            <Box component="span" sx={{ ...FILA, mb: '6px' }}><span>{g.grupo}</span><b>{g.hechas}/{g.total}</b></Box>
            <Avance parte={g.fraccion} />
          </ButtonBase>
        ))}
      </Box>
    </TarjetaPlegable>
  );
}
function tiempo() {
  const t = lineaTiempo(G.lista()) as Fin[];
  return (
    <TarjetaPlegable vista={VISTA} clave="Línea de tiempo" titulo="Línea de tiempo">
      {t.length ? (
        <Box component="ol" sx={{ listStyle: 'none', m: '8px 0 0', p: '0 0 0 14px', borderLeft: '2px solid', borderColor: 'divider', display: 'grid', gap: '6px' }}>
          {t.map(({ lugar: l, visita: v }, i) => (
            <li key={i}>
              <ButtonBase data-accion="lug-abrir" data-id={l.id} sx={{ display: 'grid', gap: '2px', justifyItems: 'start', width: '100%', p: '8px', borderRadius: '10px', color: 'text.primary', font: 'inherit', textAlign: 'left', '&:hover': { bgcolor: tokens.surface2 }, '& small': { color: 'text.secondary', fontSize: 13 } }}>
                <small>{fechaCorta(v.fecha)}</small><b>{(l.emoji || '📍') + ' ' + l.nombre}</b><Cal>{G.estrellas(v.calificacion)}</Cal>
                {v.con || v.nota ? <small>{[v.con ? 'Con ' + v.con : '', v.nota].filter(Boolean).join(' · ')}</small> : null}
              </ButtonBase>
              {verFotos(v)}
            </li>
          ))}
        </Box>
      ) : <Nota>Cuando agregues una visita con fecha, tus viajes aparecen aquí.</Nota>}
    </TarjetaPlegable>
  );
}

export default function Lugares() {
  const e = usarEstado() as Fin, ver = G.ver();
  useEffect(() => { G.pedir(); });
  if (!ver.mapa) return (
    <>
      <TituloPantalla>Lugares</TituloPantalla>
      <Card component="section">{ver.errorMapa ? <><Parrafo>No se pudo abrir el mapa.</Parrafo><Button data-accion="lug-reintentar">Reintentar</Button></> : <Nota>Abriendo el mapa…</Nota>}</Card>
    </>
  );
  const mapa = ver.mapa, ruta = migas(MAPAS, mapa.id) as Fin[];
  const miga = { minHeight: 44, p: '0 10px', borderRadius: '10px', color: 'primary.main', font: 'inherit', fontWeight: 600, '&:hover': { bgcolor: tokens.surface2 } };
  return (
    <>
      <TituloPantalla>Lugares</TituloPantalla>
      <Box component="nav" aria-label="Mapa abierto" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px', color: 'text.secondary', fontSize: 14, m: '-6px 0 10px' }}>
        {ruta.map((m, i) => (i === ruta.length - 1
          ? <Box component="span" key={m.id} aria-current="page" sx={{ p: '0 6px', color: 'text.primary', fontWeight: 700 }}>{m.icono} {m.nombre}</Box>
          : <Box component="span" key={m.id} sx={{ display: 'contents' }}><ButtonBase data-accion="lug-mapa" data-id={m.id} sx={miga}>{m.icono} {m.nombre}</ButtonBase><span aria-hidden="true">›</span></Box>))}
        {mapa.id === 'colombia' ? <ButtonBase data-accion="lug-mapa" data-id="brasil" sx={{ ...miga, ml: 'auto', color: 'text.secondary' }}>🇧🇷 Brasil</ButtonBase>
          : mapa.id === 'brasil' ? <ButtonBase data-accion="lug-mapa" data-id="colombia" sx={{ ...miga, ml: 'auto', color: 'text.secondary' }}>🇨🇴 Colombia</ButtonBase> : null}
      </Box>
      {numeros(ver)}
      {ver.ubicando ? <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14 }}>📍 Toca el punto exacto en el mapa. <Button color="secondary" data-accion="lug-no-ubicar">Cancelar</Button></Box> : null}
      <Card component="section" sx={{ p: '8px', mb: '14px' }}>
        {dibujo(e, ver)}
        <Box sx={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', mt: '8px', pb: '4px' }}>
          <Chip clickable variant="outlined" data-accion="lug-grupo" data-g="" label="Todo" sx={{ flex: 'none' }} />
          {(mapa.grupos as string[]).map((g) => <Chip key={g} clickable variant="outlined" data-accion="lug-grupo" data-g={g} label={g} sx={{ flex: 'none' }} />)}
        </Box>
      </Card>
      {formulario(ver)}
      {detalle(ver)}
      {panelPieza(ver)}
      {sorpresa(ver)}
      {grupos(ver)}
      {listaLugares(ver)}
      {tiempo()}
    </>
  );
}
