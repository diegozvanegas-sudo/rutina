// ✏️ Editar: 🏋️ Rutina (días, fútbol, ejercicios en renglones), ☀️ Hábitos, 🧘 Sesiones y 🧩 Pantallas (orden y qué se ve).
// React pinta; las reglas son las de src/vistas/editar.js (ed, ed-esquema, ed-mover, ed-duplicar, ed-borrar, ed-agregar,
// ed-ordenar, orden-…). Los campos guardan al salir (data-cambio). "Agregar" del renglón nuevo lee sus campos por id
// (ed-nuevo-nombre…): por eso lleva data-accion y main.js lo despacha. Ordenar arrastrando: ui/Ordenable.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, Button, Card, Chip, IconButton } from '@mui/material';
import { HABITOS, IDEAS_HABITOS } from '../../datos_iniciales.js';
import { reloj, iso, sumarDias, fechaCorta } from '../../fechas.js';
import { figuraPaso } from '../../figuras.js';
import { CATALOGO, FIJAS, SECCION_TARJETA, enOrden, oculto } from '../../orden.js';
import { ve } from '../../permisos.js';
import { pausaEn } from '../../futbol.js';
import { tieneVariantes } from '../../gym.js';
import { extrasCalentamiento } from '../../vistas/gym.js';
import { piezasEditar, esquemaDe } from '../../vistas/editar.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { accion } from '../acciones';
import { Campo, CampoLargo, CampoLista, DOS } from '../ui/Campo';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Opciones, HtmlViejo } from '../ui/Varios';
import { Ordenable } from '../ui/Ordenable';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const P = piezasEditar as Fin;
const PESTANAS: [string, string][] = [['rutina', '🏋️ Rutina'], ['habitos', '☀️ Hábitos'], ['sesiones', '🧘 Sesiones'], ['pantallas', '🧩 Pantallas']];
const CELULAR = '@media (max-width: 640px)';
const ops = (o: Record<string, string>): [string, string][] => Object.entries(o);
const sinEtiquetas = (t: string) => t.replace(/<[^>]+>/g, '');

const Tarjeta = ({ children, sx, datos }: { children: ReactNode; sx?: object; datos?: Record<string, string> }) => (
  <Card component="section" {...datos} sx={{ mb: '14px', display: 'grid', gap: '10px', ...sx }}>{children}</Card>
);
const Aviso = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, m: 0 }}>{children}</Box>;
const Corta = ({ children }: { children: ReactNode }) => <Nota sx={{ m: 0 }}>{children}</Nota>;
const Dos = ({ children, largo = false }: { children: ReactNode; largo?: boolean }) => (
  <Box sx={{ ...DOS, ...(largo ? { gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' } : null), alignItems: 'end' }}>{children}</Box>
);
const FILA = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' };
const BOTON_GRANDE = { minHeight: 56, fontSize: 17, mb: '14px' };

// ---------- Piezas de formulario: cada una guarda en su ruta al salir (acción "ed") ----------
const Texto = ({ titulo, ruta, valor, ...extra }: { titulo: string; ruta: string; valor: Fin; placeholder?: string }) => (
  <Campo etiqueta={titulo} data-cambio="ed" data-ruta={ruta} defaultValue={valor ?? ''} {...extra} />
);
const Numero = ({ titulo, ruta, valor, factor }: { titulo: string; ruta: string; valor: Fin; factor?: number }) => (
  <Campo etiqueta={titulo} type="number" inputMode="numeric" min={0} data-cambio="ed" data-tipo="num" data-ruta={ruta} data-factor={factor} defaultValue={valor ?? ''} />
);
const Lista = ({ titulo, ruta, valor, opciones, tipo }: { titulo: string; ruta: string; valor: Fin; opciones: Record<string, string>; tipo?: string }) => (
  <CampoLista etiqueta={titulo} opciones={ops(opciones)} data-cambio="ed" data-ruta={ruta} data-tipo={tipo} defaultValue={String(valor ?? '')} />
);
// Casilla nativa con su texto (se rehace con lo guardado cada vez que cambia)
export function Interruptor({ marcado, datos, disabled, children }: { marcado: boolean; datos: Record<string, string>; disabled?: boolean; children: ReactNode }) {
  return (
    <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: 44, cursor: disabled ? 'default' : 'pointer', flex: 1, minWidth: 0 }}>
      <Box component="input" type="checkbox" key={String(marcado)} defaultChecked={marcado} disabled={disabled} {...datos} sx={{ width: 22, height: 22, flex: 'none', accentColor: tokens.brand, cursor: 'inherit' }} />
      <span>{children}</span>
    </Box>
  );
}
// Varios a la vez (días de la semana, sesiones): cada chip con su acción de siempre
/** envolver: pasan al renglón de abajo en vez de deslizarse */
export function Chips({ items, nombre, envolver = false }: { items: { id: string; texto: ReactNode; activo: boolean; datos: Record<string, string> }[]; nombre: string; envolver?: boolean }) {
  // En el celular la fila se desliza: el primero elegido queda a la vista
  const fila = useRef<HTMLDivElement>(null), primero = (items.find((x) => x.activo) || { id: '' }).id;
  useEffect(() => {
    const c = fila.current, el = c && c.querySelector<HTMLElement>('[aria-pressed=true]');
    if (!c || !el || c.scrollWidth <= c.clientWidth + 2) return;
    const r = el.getBoundingClientRect(), rc = c.getBoundingClientRect();
    if (r.right > rc.right || r.left < rc.left) c.scrollLeft += r.left - rc.left - (rc.width - r.width) / 2;
  }, [primero]);
  return (
    // Una sola fila que se desliza (como las de antes)
    <Box ref={fila} role="group" aria-label={nombre} sx={[{ display: 'flex', gap: '8px', p: '2px 0' }, envolver ? { flexWrap: 'wrap' } : { overflowX: 'auto', scrollbarWidth: 'none' }]}>
      {items.map((x) => <Chip key={x.id} clickable label={x.texto} aria-pressed={x.activo} color={x.activo ? 'primary' : 'default'} variant={x.activo ? 'filled' : 'outlined'} {...x.datos} sx={{ minWidth: 44, flex: 'none' }} />)}
    </Box>
  );
}

const ICONO = { minWidth: 44, minHeight: 44, bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', fontSize: 18, '&.Mui-disabled': { opacity: 0.3, color: 'text.primary' } };
// ↑ ↓ ⧉ 🗑
function Controles({ ruta, i, total, nombre }: { ruta: string; i: number; total: number; nombre: string }) {
  return (
    <Box component="span" sx={{ display: 'flex', gap: '4px', flex: 'none' }}>
      <IconButton data-accion="ed-mover" data-lista={ruta} data-i={i} data-n="-1" aria-label="Subir" disabled={i === 0} sx={ICONO}>↑</IconButton>
      <IconButton data-accion="ed-mover" data-lista={ruta} data-i={i} data-n="1" aria-label="Bajar" disabled={i === total - 1} sx={ICONO}>↓</IconButton>
      <IconButton data-accion="ed-duplicar" data-lista={ruta} data-i={i} aria-label="Duplicar" title="Duplicar" sx={ICONO}>⧉</IconButton>
      <IconButton data-accion="ed-borrar" data-lista={ruta} data-i={i} data-nombre={nombre} aria-label="Borrar" sx={{ ...ICONO, color: 'error.main' }}>🗑</IconButton>
    </Box>
  );
}

// Elegir varias sesiones guiadas (en el orden en que se tocan): extras del calentamiento, descanso y partido
function ElegirSesiones({ titulo, ruta, ids, sesiones }: { titulo: string; ruta: string; ids: string[] | undefined; sesiones: Fin[] }) {
  const sel = ids || [], nombres = sel.map((id) => (sesiones.find((x) => x.id === id) || {}).nombre).filter(Boolean);
  return (
    <Box component="details" sx={{ mt: '8px', '& > summary': { cursor: 'pointer', py: '10px', overflowWrap: 'anywhere' } }}>
      <summary>{titulo}: {nombres.length ? nombres.join(', ') : 'ninguna'}</summary>
      <Chips nombre={titulo} items={sesiones.map((x) => ({ id: x.id, texto: x.nombre, activo: sel.includes(x.id), datos: { 'data-accion': 'ed-sesiones-lista', 'data-ruta': ruta, 'data-id': x.id } }))} />
    </Box>
  );
}

// Un elemento que se ve cerrado (asa, nombre y controles) y se abre al tocarlo; resalta mientras se edita
function Item({ r, titulo, asa, ctrl, abierto, children }: { r: string; titulo: string; asa: ReactNode; ctrl: ReactNode; abierto: boolean; children: ReactNode }) {
  return (
    <Card component="section" data-ed-item="" sx={[{ mb: '14px', display: 'grid', gap: '10px' }, abierto ? { borderColor: 'primary.main', boxShadow: (t) => '0 0 0 2px ' + t.palette.primary.main } : null]}>
      {/* En un celular chico (320 px) los controles bajan a otra fila en vez de aplastar el nombre */}
      <Box sx={{ ...FILA, '@media (max-width: 359px)': { flexWrap: 'wrap' } }}>
        <Box sx={{ ml: '-6px' }}>{asa}</Box>
        <Box component="button" type="button" data-accion="ed-abrir" data-r={r} aria-expanded={abierto}
          sx={{ flex: 1, minWidth: 0, '@media (max-width: 359px)': { flexBasis: '120px' }, minHeight: 44, textAlign: 'left', bgcolor: 'transparent', border: 0, color: 'text.primary', font: 'inherit', cursor: 'pointer', p: 0, overflowWrap: 'anywhere' }}>
          <span aria-hidden="true">{abierto ? '▾' : '▸'}</span> <b>{titulo}</b>
        </Box>
        {ctrl}
      </Box>
      {abierto ? <Box sx={{ display: 'grid', gap: '10px' }}>{children}</Box> : null}
    </Card>
  );
}

const ordenar = (lista: string) => (orden: number[]) => accion('ed-ordenar', { lista, orden: orden.join(',') });

// ---------- ⏸ Pausa del fútbol ----------
function PausaFutbol({ c }: { c: Fin }) {
  const pausa = pausaEn(c, iso()) as Fin;
  if (!(c.futbol || []).length && !pausa) return null;
  if (!pausa) return <Box><Button color="secondary" data-accion="futbol-pausar">⏸ Pausar el fútbol (lesión, viaje…)</Button></Box>;
  return (
    <Box sx={{ display: 'grid', gap: '10px' }}>
      <Aviso>⏸ <b>Fútbol en pausa</b> desde el {fechaCorta(pausa.desde)}{pausa.hasta ? ' · vuelves el ' + fechaCorta(pausa.hasta) : ''}. Mientras tanto no sale el partido en Hoy, la comida sigue el plan normal y no hay avisos del partido. Tus días de fútbol quedan guardados.</Aviso>
      <Dos>
        <Campo etiqueta="Vuelvo a jugar el (opcional)" type="date" data-cambio="futbol-vuelvo" min={sumarDias(iso(), 1)} defaultValue={pausa.hasta || ''} />
        <Button data-accion="futbol-reanudar" sx={{ minHeight: 44 }}>▶ Volví a jugar</Button>
      </Dos>
    </Box>
  );
}

// ---------- 🏋️ Rutina ----------
const LINEA = {
  display: 'grid', gridTemplateColumns: '34px minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1.7fr) 44px', gap: '6px', alignItems: 'center',
  '& input': { minHeight: 44, boxSizing: 'border-box' },
  [CELULAR]: { gridTemplateColumns: '34px minmax(0, 1fr) minmax(0, 1.3fr) auto', gridTemplateAreas: '"n nombre nombre mas" "n musculo esquema esquema"',
    '& > .n': { gridArea: 'n', alignSelf: 'start', pt: '2px' }, '& > .nombre': { gridArea: 'nombre' }, '& > .musculo': { gridArea: 'musculo' }, '& > .esquema': { gridArea: 'esquema' }, '& > .mas': { gridArea: 'mas' } },
};
const ENTRADA = {
  width: '100%', minWidth: 0, minHeight: 44, p: '8px 10px', font: 'inherit', fontSize: 16, color: 'text.primary', bgcolor: 'background.default',
  border: '1px solid', borderColor: 'divider', borderRadius: '10px', boxSizing: 'border-box', '&:focus': { outline: '2px solid', outlineColor: 'primary.main', borderColor: 'transparent' },
};
// Un campo del renglón (sin etiqueta a la vista: lleva aria-label)
const Celda = ({ clase, negrita = false, ...input }: { clase: string; negrita?: boolean } & Record<string, Fin>) => (
  <Box component="input" type="text" className={clase} autoComplete="off" key={String(input.defaultValue ?? '')} sx={{ ...ENTRADA, fontWeight: negrita ? 700 : 400 }} {...input} />
);
const MAS = { ...ICONO, borderRadius: '10px' };

/** Los ejercicios de un día en renglones que se editan ahí mismo (⋯ abre lo demás) y se ordenan arrastrando.
 *  lista: ruta de los días ("rutina" o, más adelante, "clientes.2.rutina"); i: el día; propia: es tu rutina */
export function EditorEjercicios({ e, lista, i, propia = lista === 'rutina' }: { e: Fin; lista: string; i: number; propia?: boolean }) {
  const rutina = P.obtener(lista) as Fin[], d = rutina[i], base = lista + '.' + i, abierto = P.ver().itemAbierto;
  const musculos = [...new Set([...e.rutina, ...rutina].flatMap((x: Fin) => x.ejercicios.map((ej: Fin) => ej.musculo)).filter(Boolean))] as string[];
  const nota = 'Cambia el nombre, el músculo o las series ahí mismo: se guarda al salir del campo' + (propia ? ' y lo ya anotado en el Gym se conserva' : '') + '. ⋯ abre lo demás (orden, nota, descansos, mover de día, duplicar, borrar). ' +
    'Series × reps: "3×8-12", "4×10 + fallo", "1×1 min" o con top set y back-off separados por "·" (también vale "3x8-12").';
  return (
    <>
      <datalist id="musculos">{musculos.map((m) => <option key={m} value={m} />)}</datalist>
      {d.ejercicios.length ? (
        <Box aria-hidden="true" sx={{ ...LINEA, p: '0 11px 0 21px', m: '4px 0', color: 'text.secondary', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', [CELULAR]: { display: 'none' } }}>
          <span /><span>Ejercicio</span><span>Músculo</span><span>Series × reps</span><span />
        </Box>
      ) : null}
      <Ordenable n={d.ejercicios.length} clave={(j) => d.ejercicios[j].id} alSoltar={ordenar(base + '.ejercicios')} datos={{ 'data-orden-lista': base + '.ejercicios' }}>
        {(j, asa) => {
          const ej = d.ejercicios[j], r = base + '.ejercicios.' + j, abre = abierto === r;
          return (
            <Card component="section" data-ed-item="" data-ancla={'ed-' + ej.id}
              sx={[{ p: '8px 10px', mb: '8px', display: 'grid', gap: '8px' }, abre ? { borderColor: 'primary.main', boxShadow: (t) => '0 0 0 2px ' + t.palette.primary.main } : null]}>
              <Box sx={LINEA}>
                <Box className="n" sx={{ display: 'grid', justifyItems: 'center', color: 'text.secondary', fontWeight: 700, fontSize: 12 }}>
                  {asa(ej.nombre, { minHeight: 34 })}<small>{ej.calentamiento ? '🔥' : j + 1}</small>
                </Box>
                <Celda clase="nombre" negrita data-cambio="ed" data-ruta={r + '.nombre'} defaultValue={ej.nombre} aria-label={'Ejercicio ' + (j + 1)} />
                <Celda clase="musculo" data-cambio="ed" data-ruta={r + '.musculo'} defaultValue={ej.musculo || ''} list="musculos" placeholder="Músculo" aria-label={'Músculo de ' + ej.nombre} />
                <Celda clase="esquema" data-cambio="ed-esquema" data-ruta={r} defaultValue={esquemaDe(ej)} placeholder="3×8-12" aria-label={'Series por reps de ' + ej.nombre} />
                <IconButton className="mas" data-accion="ed-abrir" data-r={r} aria-expanded={abre} aria-label={'Más opciones de ' + ej.nombre} sx={MAS}>{abre ? '▾' : '⋯'}</IconButton>
              </Box>
              {!abre ? null : (
                <Box sx={{ display: 'grid', gap: '10px', pt: '4px', borderTop: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: '6px' }}><Controles ruta={base + '.ejercicios'} i={j} total={d.ejercicios.length} nombre={ej.nombre} /></Box>
                  <Dos>
                    <Texto titulo="Nota" ruta={r + '.nota'} valor={ej.nota} placeholder="Técnica, máquina, agarre…" />
                    {rutina.length > 1 ? (
                      <CampoLista etiqueta="Mover a otro día" key={'m' + i} data-cambio="ed-mover-dia" data-lista={lista} data-dia={i} data-j={j} defaultValue=""
                        opciones={[['', '—'], ...rutina.map((x: Fin, k: number) => [String(k), x.nombre] as [string, string]).filter(([k]) => Number(k) !== i)]} />
                    ) : null}
                  </Dos>
                  {propia && tieneVariantes(ej) ? (
                    <Box sx={{ display: 'grid', gap: '6px' }}>
                      <b>⇄ Variantes</b>
                      <Corta>Cada una lleva su propio historial. Lo anotado antes de crearlas quedó en la primera. Se agregan desde la tarjeta del Gym.</Corta>
                      {(ej.variantes as string[]).map((v, k) => (
                        <Box key={k + v} sx={{ display: 'flex', gap: '6px' }}>
                          <Celda clase="" data-cambio="ed-variante" data-ruta={r} data-k={k} defaultValue={v} aria-label={'Nombre de la variante ' + (k + 1)} />
                          <IconButton data-accion="ed-variante-quitar" data-ruta={r} data-k={k} aria-label={'Quitar ' + v} sx={ICONO}>✕</IconButton>
                        </Box>
                      ))}
                    </Box>
                  ) : null}
                  {d.id !== 'core' && d.ejercicios[j + 1] ? <Interruptor marcado={!!ej.biserie} datos={{ 'data-cambio': 'ed', 'data-tipo': 'bool', 'data-ruta': r + '.biserie' }}>🔁 En biserie con el siguiente ({d.ejercicios[j + 1].nombre})</Interruptor> : null}
                  {d.id !== 'core' ? <Interruptor marcado={!!ej.calentamiento} datos={{ 'data-cambio': 'ed', 'data-tipo': 'bool', 'data-ruta': r + '.calentamiento' }}>🔥 Es del calentamiento (cuenta las series, pero no pide subir peso)</Interruptor> : null}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                    {(ej.filas as Fin[]).map((f, k) => <Numero key={k} titulo={'Descanso ' + f.tipo + ' (s) · ' + reloj(f.descanso)} ruta={r + '.filas.' + k + '.descanso'} valor={f.descanso} />)}
                  </Box>
                </Box>
              )}
            </Card>
          );
        }}
      </Ordenable>
      {/* Agregar escribiendo en el mismo renglón (Enter o el botón) */}
      <Card component="section" sx={{ p: '8px 10px', mb: '8px' }}>
        <Box sx={{ ...LINEA, gridTemplateColumns: '34px minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1.7fr) auto' }}>
          <Box className="n" sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 700 }}>＋</Box>
          <Box component="input" type="text" className="nombre" id="ed-nuevo-nombre" placeholder="Nuevo ejercicio" aria-label="Nombre del ejercicio nuevo" enterKeyHint="next" autoComplete="off" sx={{ ...ENTRADA, fontWeight: 700 }} />
          <Box component="input" type="text" className="musculo" id="ed-nuevo-musculo" list="musculos" placeholder="Músculo" aria-label="Músculo del ejercicio nuevo" enterKeyHint="next" autoComplete="off" sx={ENTRADA} />
          <Box component="input" type="text" className="esquema" id="ed-nuevo-esquema" placeholder="3×8-12" aria-label="Series por reps del ejercicio nuevo" data-enter="ed-ej-agregar" enterKeyHint="done" autoComplete="off" sx={ENTRADA} />
          <Button className="mas" data-accion="ed-ej-agregar" data-lista={base + '.ejercicios'} sx={{ minHeight: 44, px: '14px' }}>Agregar</Button>
        </Box>
      </Card>
      <Corta>⠿ Arrastra del asa para ordenar los ejercicios (en el computador también con las flechas ↑ ↓). {nota}</Corta>
    </>
  );
}

function Rutina({ e }: { e: Fin }) {
  const rutina = e.rutina as Fin[], c = e.config, diaEd = P.diaElegido();
  const i = rutina.findIndex((x) => x.id === diaEd), d = rutina[i];
  const repetidos = rutina.some((x) => x.diaSemana && rutina.filter((y) => y.diaSemana === x.diaSemana).length > 1);
  const dias = (P.DIAS as string[]);
  return (
    <>
      {rutina.length ? null : <Corta>Aún no tienes días de gym. Toca <b>＋ Día</b> para crear el primero (por ejemplo «Lunes · Pierna») y después agrégale sus ejercicios con series y reps. Si juegas fútbol, marca tus días aquí abajo.</Corta>}
      <Box sx={{ mb: '12px' }}><Chips nombre="Días de la rutina" items={[...rutina.map((x) => ({ id: x.id, texto: x.nombre, activo: x.id === diaEd, datos: { 'data-accion': 'ed-dia', 'data-id': x.id } })), { id: '+', texto: '＋ Día', activo: false, datos: { 'data-accion': 'ed-agregar', 'data-lista': 'rutina' } }]} /></Box>
      <Tarjeta>
        <b>⚽ Días de fútbol</b>
        <Corta>Ese día el plan de comida es "Fútbol" y en Hoy aparece el partido.</Corta>
        <Chips nombre="Días de fútbol" items={dias.slice(1).map((t, n) => ({ id: String(n + 1), texto: t, activo: (c.futbol || []).includes(n + 1), datos: { 'data-accion': 'futbol-dia', 'data-n': String(n + 1) } }))} />
        <PausaFutbol c={c} />
        <Box>
          <ElegirSesiones titulo="Sesiones del partido" ruta="config.sesionesPartido" ids={c.sesionesPartido} sesiones={e.sesiones} />
          <ElegirSesiones titulo="Sesiones de los días de descanso" ruta="config.sesionesDescanso" ids={c.sesionesDescanso} sesiones={e.sesiones} />
        </Box>
      </Tarjeta>
      {repetidos ? <Box sx={{ mb: '14px' }}><Aviso>⚠ Hay dos días asignados al mismo día de la semana: se usa el primero.</Aviso></Box> : null}
      {!d ? null : (
        <>
          <Tarjeta key={d.id}>
            <Box sx={FILA}><b>Día</b>{d.id === 'core' ? null : <Controles ruta="rutina" i={i} total={rutina.length} nombre={d.nombre} />}</Box>
            <Dos>
              <Texto titulo="Nombre" ruta={'rutina.' + i + '.nombre'} valor={d.nombre} />
              {d.id === 'core' ? <Corta>El core se anota al final de cualquier día.</Corta>
                : <Lista titulo="Día de la semana" ruta={'rutina.' + i + '.diaSemana'} valor={d.diaSemana ?? ''} tipo="num" opciones={Object.fromEntries(dias.map((t, n) => [n ? String(n) : '', t || 'Sin asignar']))} />}
            </Dos>
            {d.id === 'core' ? null : (
              <>
                <Dos largo>
                  <Lista titulo="Calentamiento" ruta={'rutina.' + i + '.calentamiento'} valor={d.calentamiento || ''} opciones={P.calentamientos()} />
                  <Texto titulo="Cardio" ruta={'rutina.' + i + '.cardio'} valor={d.cardio} />
                </Dos>
                {d.calentamiento ? <ElegirSesiones titulo="Junto al calentamiento" ruta={'rutina.' + i + '.extras'} ids={extrasCalentamiento(d) as string[]} sesiones={e.sesiones} /> : null}
                <Dos largo>
                  <Texto titulo="Antes de empezar" ruta={'rutina.' + i + '.previo'} valor={d.previo} placeholder="Ej.: movilidad previa 5-10 min" />
                  <Lista titulo="Plan de comida" ruta={'rutina.' + i + '.dieta'} valor={d.dieta || ''} opciones={P.PLANES_DIETA} />
                </Dos>
              </>
            )}
          </Tarjeta>
          <EditorEjercicios e={e} lista="rutina" i={i} key={'ej' + d.id} />
        </>
      )}
    </>
  );
}

// ---------- ☀️ Hábitos ----------
function Habitos({ e }: { e: Fin }) {
  const hs = e.habitos as Fin[], abierto = P.ver().itemAbierto, sesiones = Object.fromEntries((e.sesiones as Fin[]).map((s) => [s.id, s.nombre]));
  const faltan = (HABITOS as Fin[]).filter((x) => !hs.some((h) => h.id === x.id)).length;
  const ideas = (IDEAS_HABITOS as Fin[]).map((x, k) => [x, k] as [Fin, number]).filter(([x]) => !hs.some((h) => h.nombre === x.nombre));
  return (
    <>
      <Corta>El orden es el de la checklist de la mañana (Hoy, Mañana, Progreso, la hoja y el CSV).</Corta>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', my: '10px' }}>
        {hs.length ? <Button color="secondary" data-accion="ed-habitos-cero">🧹 Empezar de cero</Button> : null}
        {faltan ? <Button color="secondary" data-accion="ed-habitos-ejemplo">↩ Traer los de ejemplo ({faltan})</Button> : null}
      </Box>
      <Box sx={{ mb: '10px' }}><Corta>{hs.length ? '⠿ Arrastra para cambiar el orden.' : 'Lista vacía: agrega tus hábitos con "＋ Hábito".'}</Corta></Box>
      <Ordenable n={hs.length} clave={(i) => hs[i].id} alSoltar={ordenar('habitos')} datos={{ 'data-orden-lista': 'habitos' }}>
        {(i, asa) => {
          const h = hs[i], r = 'habitos.' + i;
          return (
            <Item r={r} titulo={(i + 1) + '. ' + h.nombre} asa={asa(h.nombre)} abierto={abierto === r} ctrl={<Controles ruta="habitos" i={i} total={hs.length} nombre={h.nombre} />}>
              <Dos><Texto titulo="Nombre" ruta={r + '.nombre'} valor={h.nombre} /><Texto titulo="Detalle" ruta={r + '.detalle'} valor={h.detalle} /></Dos>
              <Texto titulo="Versión mínima para un mal día (opcional)" ruta={r + '.minimo'} valor={h.minimo} placeholder="Ej.: 10 min de escucha" />
              <Corta>Qué días toca (sin marcar, todos):</Corta>
              <Chips nombre="Qué días toca" items={[1, 2, 3, 4, 5, 6, 7].map((n) => ({ id: String(n), texto: P.DIAS_CHIP[n], activo: (h.dias || []).includes(n), datos: { 'data-accion': 'ed-habito-dia', 'data-i': String(i), 'data-n': String(n) } }))} />
              <Dos>
                <Lista titulo="Tipo" ruta={r + '.tipo'} valor={h.tipo} opciones={P.TIPOS_HABITO} />
                {h.tipo === 'cuenta' ? <Numero titulo="Duración (segundos)" ruta={r + '.segundos'} valor={h.segundos} /> : null}
                {h.tipo === 'cronometro' ? <Numero titulo="Meta (minutos)" ruta={r + '.segundos'} valor={Math.round((h.segundos || 0) / 60)} factor={60} /> : null}
                {h.tipo === 'sesion' ? <Lista titulo="Sesión" ruta={r + '.sesion'} valor={h.sesion} opciones={sesiones} /> : null}
              </Dos>
              {h.nombre === 'Nuevo hábito' ? (
                <>
                  <Corta>💡 Ideas: toca una para usarla (luego la puedes cambiar)</Corta>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {ideas.map(([x, k]) => <Chip key={k} clickable variant="outlined" label={x.nombre} data-accion="ed-idea" data-i={i} data-k={k} />)}
                  </Box>
                </>
              ) : null}
              {h.tipo === 'espera' && !hs.some((x) => x.tipo === 'pastilla') ? <Aviso>⚠ La espera arranca al marcar un hábito de tipo "Pastilla": agrega uno.</Aviso> : null}
            </Item>
          );
        }}
      </Ordenable>
      <Button fullWidth data-accion="ed-agregar" data-lista="habitos" sx={BOTON_GRANDE}>＋ Hábito</Button>
    </>
  );
}

// ---------- 🧘 Sesiones ----------
// Imagen y video de un ejercicio de sesión: figura animada, foto propia o ninguna, y enlace de video
function Medios({ p, r }: { p: Fin; r: string }) {
  const figura = figuraPaso(p, { animar: false }) as string;
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', pt: '10px', borderTop: '1px solid', borderColor: 'divider', '@media (max-width: 420px)': { gridTemplateColumns: '1fr' } }}>
      <Box sx={{ '& .figura': { width: 120, m: 0, bgcolor: 'background.default', borderRadius: '10px' }, '@media (max-width: 420px)': { '& .figura': { m: '0 auto' } } }}>
        {figura ? <HtmlViejo html={figura} /> : <Corta>Sin imagen</Corta>}
      </Box>
      <Box sx={{ display: 'grid', gap: '6px', minWidth: 0 }}>
        {p.foto ? <Corta>Usa tu foto. Quítala para volver a la figura.</Corta> : <Lista titulo="Figura animada" ruta={r + '.figura'} valor={p.figura || ''} opciones={P.FIGURAS} />}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Button component="label" color="secondary">📷 {p.foto ? 'Cambiar foto' : 'Subir foto'}<input type="file" accept="image/*" hidden data-cambio="ed-foto" data-ruta={r} /></Button>
          {p.foto ? <Button color="secondary" data-accion="ed-foto-quitar" data-ruta={r}>Quitar foto</Button> : null}
        </Box>
        <Campo etiqueta="🎥 Video (enlace de YouTube u otro; vacío = buscar en YouTube)" type="url" inputMode="url" data-cambio="ed-video" data-ruta={r} defaultValue={p.video || ''} placeholder="https://www.youtube.com/watch?v=…" />
      </Box>
    </Box>
  );
}

function Sesiones({ e }: { e: Fin }) {
  const ss = e.sesiones as Fin[], sesionEd = P.sesionElegida(), abierto = P.ver().itemAbierto;
  const i = ss.findIndex((x) => x.id === sesionEd), s = ss[i], rp = 'sesiones.' + i + '.pasos';
  return (
    <>
      <Box sx={{ mb: '12px' }}><Chips nombre="Sesiones" items={[...ss.map((x) => ({ id: x.id, texto: x.nombre, activo: x.id === sesionEd, datos: { 'data-accion': 'ed-sesion', 'data-id': x.id } })), { id: '+', texto: '＋ Sesión', activo: false, datos: { 'data-accion': 'ed-agregar', 'data-lista': 'sesiones' } }]} /></Box>
      {!s ? null : (
        <>
          <Tarjeta key={s.id}>
            <Box sx={FILA}><b>Sesión</b><Controles ruta="sesiones" i={i} total={ss.length} nombre={s.nombre} /></Box>
            <Dos><Texto titulo="Nombre" ruta={'sesiones.' + i + '.nombre'} valor={s.nombre} /><Lista titulo="Tipo" ruta={'sesiones.' + i + '.tipo'} valor={s.tipo} opciones={P.TIPOS_SESION} /></Dos>
            {/^calentamiento-/.test(s.id) ? <Corta>Se abre desde los días con calentamiento "{s.id.replace('calentamiento-', '')}".</Corta> : null}
          </Tarjeta>
          <Box sx={{ mb: '10px' }}><Corta>{s.tipo === 'checklist' ? 'Cada punto se marca con ✓ en 🧘 Sesiones y la lista se reinicia cada día. ⠿ Arrastra para ordenar.' : '⠿ Arrastra para ordenar.'}</Corta></Box>
          <Ordenable key={'pasos' + s.id} n={s.pasos.length} clave={s.tipo === 'checklist' ? (j) => s.pasos[j].id || j : undefined} alSoltar={ordenar(rp)} datos={{ 'data-orden-lista': rp }}>
            {(j, asa) => {
              const p = s.pasos[j], r = rp + '.' + j, porReps = !!p.reps;
              return (
                <Item r={r} titulo={(j + 1) + '. ' + sinEtiquetas(p.nombre)} asa={asa(p.nombre)} abierto={abierto === r} ctrl={<Controles ruta={rp} i={j} total={s.pasos.length} nombre={p.nombre} />}>
                  {s.tipo === 'checklist' ? (
                    <Dos><Texto titulo="Punto" ruta={r + '.nombre'} valor={p.nombre} /><Texto titulo="Nota (opcional)" ruta={r + '.desc'} valor={p.desc} /></Dos>
                  ) : (
                    <>
                      <Dos><Texto titulo="Ejercicio" ruta={r + '.nombre'} valor={p.nombre} /><Texto titulo="Músculo" ruta={r + '.musculo'} valor={p.musculo} /></Dos>
                      <Dos>
                        <CampoLista etiqueta="Modo" data-cambio="ed-modo" data-ruta={r} defaultValue={porReps ? 'reps' : 'tiempo'} opciones={[['tiempo', 'Por tiempo'], ['reps', 'Por repeticiones']]} />
                        <Numero titulo="Series" ruta={r + '.series'} valor={p.series || 1} />
                      </Dos>
                      <Dos>
                        {porReps ? <Campo etiqueta="Reps" data-cambio="ed" data-ruta={r + '.reps'} defaultValue={p.reps ?? ''} placeholder="10-12" key="reps" /> : <Numero titulo="Segundos" ruta={r + '.seg'} valor={p.seg} key="seg" />}
                        <Numero titulo="Descanso entre series (s)" ruta={r + '.descanso'} valor={p.descanso ?? 30} />
                      </Dos>
                      <Interruptor marcado={!!p.lados} datos={{ 'data-cambio': 'ed', 'data-tipo': 'bool', 'data-ruta': r + '.lados' }}>Por lado (izquierdo y derecho)</Interruptor>
                      <CampoLargo etiqueta="Descripción" filas={2} data-cambio="ed" data-ruta={r + '.desc'} defaultValue={p.desc || ''} />
                      <Medios p={p} r={r} />
                    </>
                  )}
                </Item>
              );
            }}
          </Ordenable>
          <Button fullWidth data-accion="ed-agregar" data-lista={rp} sx={BOTON_GRANDE}>{s.tipo === 'checklist' ? '＋ Punto' : '＋ Ejercicio'}</Button>
        </>
      )}
    </>
  );
}

// ---------- 🧩 Pantallas: orden y qué se ve del menú, de Hoy y de las metas ----------
function Pantallas({ e }: { e: Fin }) {
  const c = e.config;
  return (
    <>
      {Object.entries(P.TITULOS_ORDEN as Record<string, [string, string]>).map(([tipo, [titulo, nota]]) => {
        // Solo lo que el admin le deja ver a este usuario
        const permitido = (id: string) => (tipo === 'menu' ? ve('seccion', id) : tipo === 'hoy' ? !(SECCION_TARJETA as Fin)[id] || ve('seccion', (SECCION_TARJETA as Fin)[id]) : true);
        const ids = (enOrden(c, tipo) as string[]).filter(permitido), cat = (CATALOGO as Fin)[tipo];
        const soltar = (orden: number[], movido: number) => {
          const k = orden.indexOf(movido), sig = orden[k + 1];
          accion('orden-colocar', { tipo, id: ids[movido], antes: sig == null ? '' : ids[sig] });
        };
        return (
          <Tarjeta key={tipo}>
            <Box sx={{ ...FILA, '@media (max-width: 359px)': { flexWrap: 'wrap' } }}>
              <Box component="h2" sx={{ m: 0, fontSize: 19 }}>{titulo}</Box>
              <Button color="secondary" data-accion="orden-restablecer" data-tipo={tipo}>↺ Como venía</Button>
            </Box>
            <Corta>{nota} ⠿ Arrastra para ordenar.</Corta>
            <Ordenable n={ids.length} clave={(i) => ids[i]} alSoltar={soltar} datos={{ 'data-orden-tipo': tipo }}>
              {(i, asa) => {
                const id = ids[i], nombre = Array.isArray(cat[id]) ? cat[id].join(' ') : cat[id], fija = (FIJAS as Fin)[tipo].includes(id), apagado = oculto(c, tipo, id);
                return (
                  <Box data-orden-id={id} sx={{ ...FILA, py: '6px', borderBottom: '1px solid', borderColor: 'divider', color: apagado ? 'text.secondary' : 'text.primary' }}>
                    {asa(nombre, { mr: '-4px' })}
                    <Interruptor marcado={!apagado} disabled={fija} datos={{ 'data-cambio': 'orden-ver', 'data-tipo': tipo, 'data-id': id }}>{nombre}</Interruptor>
                    <Box component="span" sx={{ display: 'flex', gap: '4px', flex: 'none' }}>
                      <IconButton data-accion="orden-mover" data-tipo={tipo} data-id={id} data-n="-1" aria-label={'Subir ' + nombre} disabled={i === 0} sx={ICONO}>↑</IconButton>
                      <IconButton data-accion="orden-mover" data-tipo={tipo} data-id={id} data-n="1" aria-label={'Bajar ' + nombre} disabled={i === ids.length - 1} sx={ICONO}>↓</IconButton>
                    </Box>
                  </Box>
                );
              }}
            </Ordenable>
          </Tarjeta>
        );
      })}
    </>
  );
}

export default function Editar({ pestana }: { pestana?: string }) {
  // El enlace (#editar/habitos, desde la tarjeta de la mañana) elige la pestaña una sola vez, al abrir
  useState(() => { if (pestana) P.ponerPestana(pestana); return 0; });
  const e = usarEstado() as Fin, ver = P.ver();
  return (
    <>
      <TituloPantalla>Editar</TituloPantalla>
      <Opciones nombre="Qué editar" opciones={PESTANAS} activa={ver.pestana} datos={(k) => ({ 'data-accion': 'ed-pestana', 'data-p': k })} />
      {ver.pestana === 'habitos' ? <Habitos e={e} /> : ver.pestana === 'sesiones' ? <Sesiones e={e} /> : ver.pestana === 'pantallas' ? <Pantallas e={e} /> : <Rutina e={e} />}
    </>
  );
}
