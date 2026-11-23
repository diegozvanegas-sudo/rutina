// 🔔 Recordatorios: la moto (km del odómetro), mis recordatorios (una fila por cada uno, que se abre con su detalle:
// otra fecha, historial y editar), posibles para agregar, eventos, pagos de Finanzas, círculo cercano y las plantillas.
// React pinta; las reglas son las de siempre (src/vistas/recordatorios.js y vida.js): los botones llevan data-accion
// y main.js los despacha con el botón de verdad; los campos guardan al salir con data-cambio. Lo que está abierto (la
// fila, el filtro, el grupo de posibles) vive en recordatorios.js para que el clic afuera y Escape lo sigan cerrando.
import { useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Checkbox, Chip, Collapse, IconButton, OutlinedInput, Typography } from '@mui/material';
import { iso, fechaCorta, fechaLarga, diasEntre } from '../../fechas.js';
import { ordenarEventos, AVISAR_DIAS } from '../../eventos.js';
import { estadoRecordatorio, proximoRecordatorio, recordatoriosAutomaticos, ritmoKm, kmActual, pesos } from '../../finanzas.js';
import { PLANTILLAS_RECORDATORIO, GRUPOS_PLANTILLA, SUGERIDOS, TITULOS_SUGERIDOS } from '../../datos_finanzas.js';
import { pendientesCirculo, RELACIONES, estadoContacto } from '../../vida.js';
import { piezasRecordatorios } from '../../vistas/recordatorios.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo, CampoLista, CampoSolo, DOS } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { Flecha } from '../ui/Flecha';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Opciones, Avance, Cifras } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'recordatorios';
const R = piezasRecordatorios as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const PC = 'md'; // desde 900 px: rejillas de tarjetas

// Etiqueta de estado y el color del borde de la fila
const COLOR: Record<string, { bgcolor: string; color: string }> = {
  pronto: { bgcolor: tokens.amarilloFondo, color: tokens.amarillo }, vencido: { bgcolor: tokens.rojoFondo, color: tokens.rojoSuave },
  'al-dia': { bgcolor: tokens.brandSoft, color: tokens.brand }, gris: { bgcolor: tokens.surface2, color: tokens.muted },
};
const BORDE: Record<string, string> = { vencido: tokens.rojo, pronto: tokens.amarillo, pendiente: tokens.amarillo, 'al-dia': tokens.brand, programado: tokens.azul };
const BARRA: Record<string, string> = { vencido: 'error.main', pronto: 'warning.main' };
const Estado = ({ estado, children, sx }: { estado: string; children: ReactNode; sx?: object }) => (
  <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap', ...(COLOR[estado] || COLOR.gris), ...sx }}>{children}</Box>
);
const TituloGrupo = ({ children, sx }: { children: ReactNode; sx?: object }) => (
  <Typography component="h2" sx={{ m: '18px 0 8px', color: 'text.secondary', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', ...sx }}>{children}</Typography>
);
const Titulo = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ m: 0, fontSize: 17, fontWeight: 700, '& small': { fontSize: 14, fontWeight: 400 } }}>{children}</Box>;
const Corta = ({ children }: { children: ReactNode }) => <Nota sx={{ m: 0 }}>{children}</Nota>;
// Casilla con su texto al lado (el .interruptor de antes): guarda al cambiar con data-cambio o se lee por su id
const Interruptor = ({ texto, marcado, datos }: { texto: string; marcado?: boolean; datos: Record<string, string | undefined> }) => (
  <Box component="label" sx={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', fontSize: 16 }}>
    <Checkbox key={String(!!marcado)} defaultChecked={!!marcado} slotProps={{ input: datos as object }} sx={{ p: '4px', ml: '-4px' }} />{texto}
  </Box>
);
// Rejilla de tarjetas en el computador; una tras otra en el celular
const REJILLA = { display: { [PC]: 'grid' }, gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px', alignItems: 'start', mb: { [PC]: '14px' }, '& > *': { [PC]: { m: 0 } } };
// Botón de un toque a la derecha de la fila: solo ✓ en el celular, con texto en el computador
const OK = { minWidth: { xs: 48, [PC]: 136 }, minHeight: 44, p: '8px 12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700 };
const TextoOk = ({ children }: { children: ReactNode }) => <Box component="span" sx={{ display: { xs: 'none', [PC]: 'inline' } }}>{children}</Box>;
const Borrar = (props: Record<string, string | number>) => (
  <IconButton {...props} data-accion={String(props['data-accion'] || 'ed-borrar')} sx={{ minWidth: 40, minHeight: 40, color: 'error.main', fontSize: 16 }}>🗑</IconButton>
);
const BotonBorrar = ({ children, ...datos }: { children: ReactNode } & Record<string, string | number | ReactNode>) => (
  <Button color="secondary" {...(datos as object)} sx={{ color: 'error.main', justifySelf: 'start' }}>{children}</Button>
);
const ListaSimple = ({ filas }: { filas: { k: string; izq: ReactNode; der: ReactNode }[] }) => (
  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: '4px' }}>
    {filas.map((x) => <Box component="li" key={x.k} sx={{ ...FILA, p: '6px 0', borderBottom: '1px solid', borderColor: 'divider' }}><span>{x.izq}</span><Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{x.der}</Box></Box>)}
  </Box>
);

// ---------- Una fila: qué es, cuándo toca, estado y el botón de la derecha; al tocarla se abre el detalle ----------
type Fila = { id: string; estado: string; activa: boolean; abrir: boolean; ic: ReactNode; nombre: ReactNode; etiqueta: ReactNode; cuando: ReactNode; lado?: ReactNode; detalle?: ReactNode; sug?: boolean };
function fila(f: Fila) {
  const celda = { gridArea: 'ic', fontSize: 20, textAlign: 'center' };
  const rejilla = f.sug
    // Sugerencias en el celular: nombre y la idea en una línea (completa al pasar encima); cada cuánto ya lo dice la pestaña elegida
    ? { gridTemplateColumns: { xs: '30px minmax(0, 1fr)', [PC]: '30px minmax(0, 1.2fr) minmax(0, 1.2fr) 110px' }, gridTemplateAreas: { xs: '"ic nombre" "ic cuando"', [PC]: '"ic nombre cuando estado"' }, rowGap: { xs: '2px' } }
    : { gridTemplateColumns: { xs: '30px auto minmax(0, 1fr) 14px', [PC]: '30px minmax(0, 1.2fr) minmax(0, 1.2fr) 110px 14px' }, gridTemplateAreas: { xs: '"ic nombre nombre flecha" "ic estado cuando flecha"', [PC]: '"ic nombre cuando estado flecha"' } };
  const cuerpo = (
    <>
      <Box component="span" aria-hidden="true" sx={celda}>{f.ic}</Box>
      <Box component="b" sx={{ gridArea: 'nombre', minWidth: 0, overflowWrap: 'anywhere', '& small': { fontWeight: 400, color: 'text.secondary' } }}>{f.nombre}</Box>
      <Box component="span" sx={{ gridArea: 'estado', justifySelf: 'start', '& > span': f.sug ? { whiteSpace: 'normal' } : null, display: f.sug ? { xs: 'none', [PC]: 'block' } : undefined }}>{f.etiqueta}</Box>
      <Box component="span" title={f.sug && typeof f.cuando === 'string' ? f.cuando : undefined}
        sx={{ gridArea: 'cuando', color: 'text.secondary', fontSize: f.sug ? 13 : 14, minWidth: 0, overflowWrap: 'break-word', '& b': { color: 'text.primary' },
          ...(f.sug ? { display: '-webkit-box', WebkitLineClamp: { xs: 1, [PC]: 2 }, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : null) }}>{f.cuando}</Box>
      {f.abrir ? <Box component="span" aria-hidden="true" sx={{ gridArea: 'flecha', color: 'text.secondary' }}>{f.activa ? '▾' : '▸'}</Box> : null}
    </>
  );
  const base = { ...rejilla, display: 'grid', alignItems: 'center', columnGap: { xs: '8px', [PC]: '12px' }, rowGap: '2px', minHeight: 48, p: '4px 6px', borderRadius: '8px', color: 'text.primary', font: 'inherit', textAlign: 'left', justifyContent: 'stretch' };
  return (
    <Box component="section" key={f.id} data-rec-id={f.abrir ? f.id : undefined}
      sx={[{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderLeft: '4px solid', borderLeftColor: f.sug ? tokens.line : BORDE[f.estado] || tokens.line, borderRadius: '12px' },
        f.activa ? { borderColor: 'primary.main', boxShadow: '0 0 0 2px ' + tokens.brand + ', 0 10px 30px rgba(0, 0, 0, .45)', position: 'relative', zIndex: 1 } : null]}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: f.sug ? { xs: 'start', [PC]: 'center' } : 'center', gap: '8px', p: '6px 8px 6px 4px' }}>
        {f.abrir
          ? <ButtonBase data-accion="rec-abrir" data-id={f.id} aria-expanded={f.activa} sx={[base, { '&:hover': { bgcolor: tokens.surface2 }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '1px' } }]}>{cuerpo}</ButtonBase>
          : <Box sx={base}>{cuerpo}</Box>}
        {f.lado}
      </Box>
      {f.activa && f.detalle ? <Box sx={{ display: 'grid', gap: '8px', p: { xs: '6px 12px 12px', [PC]: '6px 12px 12px 54px' }, borderTop: '1px solid', borderColor: 'divider' }}>{f.detalle}</Box> : null}
    </Box>
  );
}
// Pestañas del detalle (Otra fecha, Historial, Editar): tocar la abierta la cierra
const Pestana = ({ id, q, que, children }: { id: string; q: string; que: string | null; children: ReactNode }) => (
  <Chip clickable label={children} data-accion="rec-panel" data-id={id} data-q={q} aria-expanded={que === q} color={que === q ? 'primary' : 'default'} variant={que === q ? 'filled' : 'outlined'} sx={{ fontSize: 14 }} />
);
const Pestanas = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{children}</Box>;

// ---------- 🔧 Mis recordatorios ----------
function principal(x: Fin, s: Fin, actual: number | null) {
  if (s.estado === 'sin-dato') return <><Titulo>Aún sin registro</Titulo><Corta>{R.regla(x)}. Márcalo la próxima vez o anota cuándo fue el último.{x.cadaKm ? '' : ' ¿Aún no empieza? Pon la fecha en ✏️ Editar.'}</Corta></>;
  const p = proximoRecordatorio(x, s, actual) as Fin;
  if (s.empieza) return <><Titulo>{p.titulo} <small>{fechaCorta(s.empieza)}</small></Titulo><Corta>Después, {R.regla(x)}. {s.estado === 'programado' ? 'Te avisa 14 días antes.' : 'Márcalo cuando lo hagas.'}</Corta></>;
  const ultimo = !s.ultimo ? 'Aún sin registro' : 'Último: ' + fechaCorta(s.ultimo.fecha) + ' (' + R.hace(diasEntre(s.ultimo.fecha, iso())) + ')' + (s.ultimo.km != null ? ' · ' + R.km(s.ultimo.km) : '') + (s.ultimo.costo ? ' · ' + pesos(s.ultimo.costo) : '');
  if (!p) return <><Titulo>Sin fecha fija</Titulo><Corta>{ultimo}</Corta></>;
  const cuando = [p.km != null ? 'a los ' + R.km(p.km) : '', p.fecha ? (p.km != null ? '≈ ' : '') + fechaCorta(p.fecha) : ''].filter(Boolean).join(' · ');
  return (
    <>
      <Titulo>{p.titulo}{cuando ? <> <small>{cuando}</small></> : null}</Titulo>
      <Box sx={{ '& [role=progressbar]': { m: 0 } }}><Avance parte={p.fraccion} color={BARRA[s.estado]} /></Box>
      <Corta>{R.regla(x)}<br />{ultimo}</Corta>
    </>
  );
}
function panelHecho(x: Fin, actual: number | null) {
  const hoy = iso(), desde = (R.ver() as Fin).fechaPanel || hoy;
  return (
    <Box data-rec={x.id} sx={{ display: 'grid', gap: '8px' }}>
      <Box sx={DOS}>
        <Campo etiqueta="Fecha" type="date" name="fecha" defaultValue={desde} max={hoy} />
        {x.cadaKm ? <Campo etiqueta="Km de la moto" type="number" inputMode="numeric" name="km" defaultValue={actual ?? ''} placeholder="km" /> : null}
        <Campo etiqueta="Costo (opcional)" inputMode="numeric" data-pesos="" name="costo" placeholder="$ 0" />
      </Box>
      <Button fullWidth data-accion="rec-hecho" data-id={x.id}>Guardar</Button>
      <Corta>Si pones el costo, queda también como gasto en Finanzas.</Corta>
    </Box>
  );
}
function panelHistorial(x: Fin) {
  const filas = (x.hechos as Fin[]).map((h, k) => [h, k] as [Fin, number]).reverse().map(([h, k]) => ({
    k: String(k), izq: fechaCorta(h.fecha),
    der: <>{(h.km != null ? R.km(h.km) : '') + (h.costo ? ' · ' + pesos(h.costo) : '')} <Borrar data-accion="rec-borrar-hecho" data-id={x.id} data-k={k} aria-label={'Borrar registro del ' + fechaCorta(h.fecha)} /></>,
  }));
  return <ListaSimple filas={filas} />;
}
function panelEditar(estado: Fin, x: Fin, i: number) {
  const ruta = 'recordatorios.lista.' + i, enDias = !!x.cadaDias, cada = x.cadaDias || x.cadaMeses || 0;
  return (
    <Box data-rec-editar="" sx={{ display: 'grid', gap: '10px', mt: '2px' }}>
      <Box sx={DOS}>
        <Campo etiqueta="Nombre" data-cambio="ed" data-ruta={ruta + '.nombre'} defaultValue={x.nombre} />
        <Campo etiqueta="Ícono" maxLength={4} data-cambio="ed" data-ruta={ruta + '.icono'} defaultValue={x.icono || ''} />
        <Campo etiqueta="Se repite cada (0 = sin fecha)" type="number" inputMode="numeric" min={0} name="cada" data-cambio="rec-frecuencia" data-id={x.id} defaultValue={cada} />
        <CampoLista etiqueta="Unidad" name="unidad" data-cambio="rec-frecuencia" data-id={x.id} defaultValue={enDias ? 'dias' : 'meses'} opciones={[['dias', 'Días'], ['meses', 'Meses']]} />
        {x.cadaKm ? null : <Campo etiqueta="O un día fijo del mes (1 a 31)" type="number" inputMode="numeric" min={0} max={31} data-cambio="ed" data-tipo="num" data-ruta={ruta + '.diaMes'} defaultValue={x.diaMes || ''} placeholder="Ej.: 15" />}
        {x.hechos.length ? null : <Campo etiqueta="Empieza el (opcional)" type="date" data-cambio="ed" data-ruta={ruta + '.empieza'} defaultValue={x.empieza || ''} />}
        {x.vehiculo || x.cadaKm ? <>
          <Campo etiqueta="Cada cuántos km (0 = no)" type="number" inputMode="numeric" min={0} data-cambio="ed" data-tipo="num" data-ruta={ruta + '.cadaKm'} defaultValue={x.cadaKm || 0} />
          <CampoLista etiqueta="Vehículo" data-cambio="ed" data-ruta={ruta + '.vehiculo'} defaultValue={x.vehiculo || ''} opciones={[['', 'Ninguno'], ...(estado.recordatorios.vehiculos as Fin[]).map((w) => [w.id, w.nombre] as [string, string])]} />
        </> : null}
        <CampoLista etiqueta="El costo va a" data-cambio="ed" data-ruta={ruta + '.categoria'} defaultValue={R.categoriaDe(x)} opciones={(estado.finanzas.categorias.gasto as Fin[]).map((c) => [c.id, c.icono + ' ' + c.nombre] as [string, string])} />
      </Box>
      <Interruptor texto="📌 Todos los días, hasta que lo marque (sale arriba en toda la app)" marcado={x.diario} datos={{ 'data-cambio': 'ed', 'data-tipo': 'bool', 'data-ruta': ruta + '.diario' }} />
      <CampoLargo etiqueta="Nota" filas={2} data-cambio="ed" data-ruta={ruta + '.nota'} defaultValue={x.nota || ''} />
      <BotonBorrar data-accion="ed-borrar" data-lista="recordatorios.lista" data-i={i} data-nombre={x.nombre}>🗑 Borrar recordatorio</BotonBorrar>
    </Box>
  );
}
function miRecordatorio(estado: Fin, x: Fin, i: number, abierto: Fin) {
  const v = R.vehiculo(x.vehiculo), s = estadoRecordatorio(x, v) as Fin, actual = v ? kmActual(v.km) as number | null : null;
  const que = abierto.id === x.id ? abierto.que : null, hoyYa = (s.ultimo || {}).fecha === iso(), urge = s.estado !== 'al-dia';
  const conKm = x.cadaKm && actual != null ? 'Hecho hoy, a los ' + R.km(actual) : 'Hecho hoy';
  const lado = s.estado === 'programado' ? <Box component="span" sx={OK} />
    : hoyYa ? <Box component="span" title="Hecho hoy" sx={{ ...OK, color: 'primary.main' }}><span aria-hidden="true">✓</span><TextoOk>Hecho hoy</TextoOk></Box>
    : <Button color={urge ? 'primary' : 'secondary'} data-accion="rec-hoy" data-id={x.id} title={conKm} aria-label={x.nombre + ': ' + conKm} sx={OK}><span aria-hidden="true">✓</span><TextoOk>Hecho hoy</TextoOk></Button>;
  const detalle = (
    <>
      {principal(x, s, actual)}
      {x.nota ? <Corta>📝 {x.nota}</Corta> : null}
      <Pestanas>
        {s.estado === 'programado' ? null : <Pestana id={x.id} q="hecho" que={que}>📅 Otra fecha</Pestana>}
        {x.hechos.length ? <Pestana id={x.id} q="historial" que={que}>🕘 Historial ({x.hechos.length})</Pestana> : null}
        <Pestana id={x.id} q="editar" que={que}>✏️ Editar</Pestana>
      </Pestanas>
      {que === 'hecho' ? panelHecho(x, actual) : que === 'historial' && x.hechos.length ? panelHistorial(x) : que === 'editar' ? panelEditar(estado, x, i) : null}
    </>
  );
  return fila({ id: x.id, estado: s.estado, activa: !!que, abrir: true, ic: x.icono || '🔔', nombre: <>{x.nombre}{v ? <> <small>· {v.nombre}</small></> : null}</>,
    etiqueta: <Estado estado={s.estado === 'pronto' || s.estado === 'vencido' || s.estado === 'al-dia' ? s.estado : 'gris'}>{R.ESTADOS[s.estado]}</Estado>, cuando: R.cuandoCorto(x, s, actual), lado, detalle });
}

// ---------- 💡 Posibles para agregar ----------
function sugeridos(estado: Fin, sug: string | null) {
  const r = estado.recordatorios, tengo = new Set((r.lista as Fin[]).map((x) => R.llano(x.nombre))), fuera = new Set(((r.descartados || []) as string[]).map(R.llano));
  const P = PLANTILLAS_RECORDATORIO as Fin[];
  const grupos: Record<string, number[]> = Object.fromEntries(Object.entries(SUGERIDOS as Record<string, string[]>).map(([g, nombres]) => [g, nombres
    .map((n) => P.findIndex((p) => p.nombre === n)).filter((k) => k >= 0)
    .filter((k) => !tengo.has(R.llano(P[k].nombre)) && !fuera.has(R.llano(P[k].nombre)))]));
  const total = Object.values(grupos).reduce((s, x) => s + x.length, 0), ocultos = (r.descartados || []).length;
  if (!total && !ocultos) return null;
  let vista = sug;
  if (!vista || !grupos[vista] || !grupos[vista].length) { vista = Object.keys(grupos).find((g) => grupos[g].length) || 'semana'; R.ponerSug(vista); }
  const chips = Object.entries(TITULOS_SUGERIDOS as Record<string, string>).filter(([g]) => grupos[g].length).map(([g, t]) => [g, t + ' (' + grupos[g].length + ')'] as [string, string]);
  return (
    <TarjetaPlegable vista={VISTA} clave={'💡 Posibles para agregar (' + total + ')'} titulo={'💡 Posibles para agregar (' + total + ')'}>
      <Nota>Ideas para el día a día. ＋ lo agrega a tus recordatorios y lo deja abierto para ajustarlo; ✕ si no te sirve.</Nota>
      <Opciones nombre="Cada cuánto" activa={vista} opciones={chips} datos={(g) => ({ 'data-accion': 'rec-sug-vista', 'data-v': g })} sx={{ pb: '8px', minWidth: 0 }} />
      <Box sx={{ display: 'grid', gap: '6px', mb: '14px' }}>
        {(grupos[vista] || []).map((k) => {
          const p = P[k];
          return fila({ id: 'sug' + k, estado: '', activa: false, abrir: false, sug: true, ic: p.icono, nombre: p.nombre,
            etiqueta: <Estado estado="gris">{(p.diario ? 'Todos los días' : R.regla(p)).replace(/ \(lo que pase primero\)/, '')}</Estado>, cuando: p.nota || '',
            lado: <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '4px', pt: { xs: '6px', [PC]: 0 } }}>
              <Button data-accion="rec-agregar" data-k={k} aria-label={'Agregar ' + p.nombre} sx={OK}><span aria-hidden="true">＋</span><TextoOk>Agregar</TextoOk></Button>
              <IconButton data-accion="rec-sug-quitar" data-n={p.nombre} aria-label={'No me sirve: ' + p.nombre} sx={{ minWidth: 40, minHeight: 44, fontSize: 16, color: 'text.secondary', bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider' }}>✕</IconButton>
            </Box> });
        })}
      </Box>
      {ocultos ? <Button variant="text" data-accion="rec-sug-volver" sx={{ minHeight: 32, p: 0, color: 'info.main', fontWeight: 400, textDecoration: 'underline', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }}>Ver otra vez los {ocultos} que descartaste</Button> : null}
    </TarjetaPlegable>
  );
}

// ---------- 🎟️ Eventos ----------
const opcionesAviso = (AVISAR_DIAS as number[]).map((n) => [String(n), n === 1 ? '1 día antes' : n + ' días antes'] as [string, string]);
function evento(x: Fin, i: number, s: Fin, abierto: Fin) {
  const [clase, texto] = R.ESTADO_EVENTO[s.estado] || ['programado', ''], ruta = 'recordatorios.eventos.' + i, enlace = R.enlaceSeguro(x.enlace);
  const id = x.id || 'ev-' + i, que = abierto.id === id ? abierto.que : null;
  const cuando = s.fecha ? fechaLarga(s.fecha) + (x.hora ? ' · ' + x.hora : '') : 'Aún no sabes cuándo es';
  const chipEnlace = (href: string, t: string) => <Chip clickable component="a" href={href} target="_blank" rel="noopener" label={t} variant="outlined" sx={{ fontSize: 14 }} />;
  const detalle = (
    <>
      <Titulo>{cuando}</Titulo>
      <Corta>{[x.lugar ? '📍 ' + x.lugar : '', x.anual ? '🔁 Cada año' : '', s.fecha ? 'Te avisa ' + (Number(x.avisarDias ?? 7) || 0) + ' días antes' : 'Cuando sepas la fecha, ponla en Editar y te avisa'].filter(Boolean).join(' · ')}</Corta>
      {x.nota ? <Corta>📝 {x.nota}</Corta> : null}
      <Pestanas>
        {enlace ? chipEnlace(enlace, '🔗 Abrir enlace') : null}
        {s.fecha ? null : chipEnlace(R.buscar(x), '🔎 Buscar la fecha')}
        <Pestana id={id} q="editar" que={que}>✏️ Editar</Pestana>
      </Pestanas>
      {que === 'editar' ? <>
        <Box sx={DOS}>
          <Campo etiqueta="Nombre" data-cambio="ed" data-ruta={ruta + '.nombre'} defaultValue={x.nombre} />
          <Campo etiqueta="Ícono" maxLength={4} data-cambio="ed" data-ruta={ruta + '.icono'} defaultValue={x.icono || ''} />
          <Campo etiqueta="Fecha" type="date" data-cambio="ed" data-ruta={ruta + '.fecha'} defaultValue={x.fecha || ''} />
          <Campo etiqueta="Hora (opcional)" type="time" data-cambio="ed" data-ruta={ruta + '.hora'} defaultValue={x.hora || ''} />
          <CampoLista etiqueta="Avisarme" data-cambio="ed" data-tipo="num" data-ruta={ruta + '.avisarDias'} defaultValue={String(x.avisarDias ?? 7)} opciones={opcionesAviso} />
          <Campo etiqueta="Lugar" data-cambio="ed" data-ruta={ruta + '.lugar'} defaultValue={x.lugar || ''} placeholder="Ej.: Atanasio Girardot" />
        </Box>
        <Campo etiqueta="Enlace (boletas, página, transmisión)" type="url" inputMode="url" data-cambio="ed" data-ruta={ruta + '.enlace'} defaultValue={x.enlace || ''} placeholder="https://…" />
        <Interruptor texto="Se repite cada año (cumpleaños, fechas especiales)" marcado={x.anual} datos={{ 'data-cambio': 'ed', 'data-tipo': 'bool', 'data-ruta': ruta + '.anual' }} />
        <CampoLargo etiqueta="Nota" filas={2} data-cambio="ed" data-ruta={ruta + '.nota'} defaultValue={x.nota || ''} />
        <BotonBorrar data-accion="ed-borrar" data-lista="recordatorios.eventos" data-i={i} data-nombre={x.nombre}>🗑 Borrar evento</BotonBorrar>
      </> : null}
    </>
  );
  return fila({ id, estado: clase === 'sin-dato' ? 'gris' : clase, activa: !!que, abrir: true, ic: x.icono || '🎟️', nombre: x.nombre,
    etiqueta: <Estado estado={clase === 'pronto' ? 'pronto' : 'gris'}>{texto || (s.faltan === 1 ? 'Mañana' : 'En ' + s.faltan + ' días')}</Estado>, cuando, detalle });
}
function eventos(estado: Fin, abierto: Fin) {
  const r = estado.recordatorios, { proximos, porConfirmar, pasados } = ordenarEventos(r.eventos) as Fin;
  const lista = [...proximos, ...porConfirmar] as Fin[];
  return (
    <>
      <TituloGrupo>🎟️ Eventos</TituloGrupo>
      <Nota>Conciertos, partidos, estrenos, cumpleaños: lo que quieres ver o no perderte. Cuando se acerca, te avisa aquí, en Hoy y en el menú.</Nota>
      {lista.length ? <Box sx={{ display: 'grid', gap: '6px', mb: '14px' }}>{lista.map(({ x, i, s }) => evento(x, i, s, abierto))}</Box> : null}
      <Box sx={REJILLA}>
        {/* Al agregar, el formulario vuelve a quedar vacío (antes se quedaba con lo del evento anterior) */}
        <TarjetaPlegable key={r.eventos.length} vista={VISTA} clave="＋ Agregar evento" titulo="＋ Agregar evento">
          <Box sx={{ display: 'grid', gap: '10px' }}>
            <Campo etiqueta="Qué es" id="evento-nombre" placeholder="Ej.: concierto de …, final de la liga" />
            <Box sx={DOS}>
              <Campo etiqueta="Fecha (si ya la sabes)" type="date" id="evento-fecha" />
              <Campo etiqueta="Hora (opcional)" type="time" id="evento-hora" />
              <CampoLista etiqueta="Avisarme" id="evento-aviso" defaultValue="7" opciones={opcionesAviso} />
            </Box>
            <Interruptor texto="Se repite cada año" datos={{ id: 'evento-anual' }} />
            <Button fullWidth data-accion="evento-agregar">Agregar</Button>
            <Corta>¿Aún no sabes la fecha? Agrégalo igual: queda como «Por confirmar», con un botón para buscarla.</Corta>
          </Box>
        </TarjetaPlegable>
      </Box>
      {pasados.length ? (
        <Card component="section" sx={{ mb: '14px' }}>
          <Desplegable titulo={<Box component="span" sx={{ fontSize: 17 }}>🕘 Ya pasaron ({pasados.length})</Box>}>
            <ListaSimple filas={(pasados as Fin[]).map(({ x, i, s }) => ({ k: String(i), izq: (x.icono || '🎟️') + ' ' + x.nombre,
              der: <>{fechaCorta(s.fecha)} <Borrar data-lista="recordatorios.eventos" data-i={i} data-nombre={x.nombre} aria-label={'Borrar ' + x.nombre} /></> }))} />
          </Desplegable>
        </Card>
      ) : null}
    </>
  );
}

// ---------- 💸 Pagos de Finanzas (salen solos cuando se acerca el día) ----------
function pagos(auto: Fin[]) {
  if (!auto.length) return null;
  return (
    <>
      <TituloGrupo>💸 Pagos de Finanzas</TituloGrupo>
      <Box sx={{ display: 'grid', gap: '6px', mb: '14px' }}>
        {auto.map((a) => fila({ id: 'pago-' + a.id, estado: a.estado, activa: false, abrir: false, ic: a.tipo === 'cobro' ? '💰' : '💸', nombre: a.nombre,
          etiqueta: <Estado estado={a.estado === 'pronto' || a.estado === 'vencido' ? a.estado : 'gris'}>{R.ESTADOS[a.estado]}</Estado>,
          cuando: <><b>{pesos(a.monto)}</b> · {fechaCorta(a.fecha)}{a.faltan > 0 ? ' · en ' + a.faltan + ' días' : a.faltan === 0 ? ' · hoy' : ''}</>,
          lado: <Button color={a.estado === 'vencido' ? 'primary' : 'secondary'} data-accion={({ fijo: 'fin-pagar-fijo', cobro: 'fin-cobrar' } as Record<string, string>)[a.tipo] || 'fin-pagar-deuda'} data-id={a.id}
            aria-label={(a.tipo === 'cobro' ? 'Registrar cobro' : 'Registrar pago') + ' de ' + a.nombre} sx={OK}>{a.tipo === 'cobro' ? 'Cobrar' : 'Pagar'}</Button> }))}
      </Box>
    </>
  );
}

// ---------- 👥 Círculo cercano ----------
const ESTADO_CIRCULO: Record<string, string> = { vencido: 'Ya toca', pronto: 'Pronto', 'al-dia': 'Al día', 'sin-dato': 'Sin registro' };
const haceDias = (n: number) => (n === 0 ? 'hoy' : n === 1 ? 'ayer' : 'hace ' + n + ' días');
function circulo(estado: Fin) {
  const lista = (estado.circulo ||= []) as Fin[], orden: Record<string, number> = { vencido: 0, pronto: 1, 'sin-dato': 2, 'al-dia': 3 };
  const filas = lista.map((p, i) => ({ p, i, s: estadoContacto(p) as Fin })).sort((a, b) => orden[a.s.estado] - orden[b.s.estado] || (b.s.dias || 0) - (a.s.dias || 0));
  const rel = RELACIONES as Record<string, number>;
  return (
    <>
      <TituloGrupo>👥 Círculo cercano</TituloGrupo>
      <Nota>Las 5 a 8 personas que más importan. Te avisa cuando llevas mucho sin hablar con alguien: las relaciones también se entrenan.</Nota>
      <Box sx={REJILLA}>
        {filas.map(({ p, i, s }) => {
          const ruta = 'circulo.' + i, ultima = p.contactos && p.contactos.length ? p.contactos[p.contactos.length - 1] : null;
          return (
            <Card component="section" key={p.id} sx={{ mb: '14px', display: 'grid', gap: '10px', borderColor: s.estado === 'vencido' ? tokens.rojo : s.estado === 'pronto' ? tokens.amarillo : undefined }}>
              <Box sx={{ ...FILA, gap: '8px' }}>
                <b>{p.nombre} <Box component="small" sx={{ fontWeight: 400, color: 'text.secondary' }}>· {p.relacion || ''}</Box></b>
                <Estado estado={s.estado === 'sin-dato' ? 'gris' : s.estado}>{ESTADO_CIRCULO[s.estado]}</Estado>
              </Box>
              <Corta>{(s.ultimo ? 'Último contacto ' + haceDias(s.dias) + ' (' + fechaCorta(s.ultimo) + ')' : 'Aún no registras ningún contacto') + ' · cada ' + (p.cadaDias || 14) + ' días'}</Corta>
              {ultima && ultima.nota ? <Corta>📝 {ultima.nota}</Corta> : null}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                <CampoSolo placeholder="Nota (opcional): de qué hablaron" aria-label="Nota del contacto" data-nota-contacto={p.id} />
                <Button data-accion="circulo-hable" data-id={p.id}>✓ Hablé hoy</Button>
              </Box>
              <Desplegable titulo="Editar">
                <Box sx={{ display: 'grid', gap: '10px' }}>
                  <Box sx={DOS}>
                    <Campo etiqueta="Nombre" data-cambio="ed" data-ruta={ruta + '.nombre'} defaultValue={p.nombre} />
                    <Campo etiqueta="Cada cuántos días" type="number" inputMode="numeric" min={1} data-cambio="ed" data-tipo="num" data-ruta={ruta + '.cadaDias'} defaultValue={p.cadaDias || 14} />
                    <CampoLista etiqueta="Relación" data-cambio="ed" data-ruta={ruta + '.relacion'} defaultValue={p.relacion} opciones={Object.keys(rel).map((r) => [r, r] as [string, string])} />
                  </Box>
                  {(p.contactos || []).length > 1 ? <ListaSimple filas={[...p.contactos].reverse().slice(0, 8).map((c: Fin, k: number) => ({ k: String(k), izq: fechaCorta(c.fecha), der: c.nota || '' }))} /> : null}
                  <Box><Borrar data-lista="circulo" data-i={i} data-nombre={p.nombre} aria-label="Borrar" /></Box>
                </Box>
              </Desplegable>
            </Card>
          );
        })}
        <TarjetaPlegable key={lista.length} vista={VISTA} clave="＋ Agregar persona" titulo="＋ Agregar persona">
          <Box sx={{ display: 'grid', gap: '10px' }}>
            <Box sx={DOS}>
              <Campo etiqueta="Nombre" id="circulo-nombre" placeholder="Ej.: Mamá" />
              <CampoLista etiqueta="Relación" id="circulo-relacion" defaultValue={Object.keys(rel)[0]} opciones={Object.entries(rel).map(([r, n]) => [r, r + ' (cada ' + n + (n === 1 ? ' día' : ' días') + ')'] as [string, string])} />
            </Box>
            <Button fullWidth data-accion="circulo-agregar">Agregar</Button>
          </Box>
        </TarjetaPlegable>
      </Box>
    </>
  );
}

// ---------- ＋ Agregar recordatorio: las plantillas por grupo, con un buscador que filtra sin repintar ----------
function Plantillas({ abierto }: { abierto: boolean }) {
  const [q, ponerQ] = useState(''), busca = q.trim().toLowerCase(), P = PLANTILLAS_RECORDATORIO as Fin[];
  const vale = (p: Fin) => !busca || (p.icono + p.nombre).toLowerCase().includes(busca);
  const OCULTO = { '&[hidden]': { display: 'none' } };
  return (
    <Card component="section" data-plantillas="" sx={{ mb: '14px' }}>
      <Typography component="h2" variant="h2" sx={{ m: 0 }}>
        <ButtonBase data-accion="rec-agregar-alternar" aria-expanded={abierto} sx={{ width: '100%', justifyContent: 'flex-start', gap: '4px', font: 'inherit', color: 'inherit', textAlign: 'left', borderRadius: '8px', minHeight: 32, ml: '-6px', pl: '2px', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
          <Flecha abierta={abierto} /><span>＋ Agregar recordatorio</span>
        </ButtonBase>
      </Typography>
      <Collapse in={abierto} timeout={150}>
        <Box sx={{ pt: '10px' }}>
          <OutlinedInput fullWidth type="search" placeholder="Buscar: hipoteca, SOAT, aceite…" inputProps={{ id: 'rec-buscar', 'aria-label': 'Buscar plantilla', autoComplete: 'off' }} onChange={(ev) => ponerQ(ev.target.value)} />
          <Box sx={{ display: { [PC]: 'grid' }, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6px 20px', alignItems: 'start' }}>
            {Object.entries(GRUPOS_PLANTILLA as Record<string, string>).map(([g, titulo]) => {
              const delGrupo = P.map((p, k) => [p, k] as [Fin, number]).filter(([p]) => p.grupo === g);
              return (
                <Box key={g} hidden={!delGrupo.some(([p]) => vale(p))} sx={OCULTO}>
                  <Box component="h3" sx={{ fontSize: 19, fontWeight: 800, m: '14px 0 10px', pb: '6px', borderBottom: '2px solid', borderColor: tokens.brandSoft }}>{titulo}</Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '8px', mb: '10px' }}>
                    {delGrupo.map(([p, k]) => (
                      <ButtonBase key={k} hidden={!vale(p)} data-accion="rec-agregar" data-k={k}
                        sx={{ ...OCULTO, display: 'grid', justifyItems: 'center', gap: '4px', p: '10px 6px', minHeight: 72, borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.default', color: 'text.primary', font: 'inherit', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                        <Box component="span" sx={{ fontSize: 24 }}>{p.icono}</Box>{p.nombre}
                      </ButtonBase>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Nota>Los pagos fijos, las cuotas y los intereses por cobrar de Finanzas aparecen aquí solos cuando se acerca el día.</Nota>
        </Box>
      </Collapse>
    </Card>
  );
}

export default function Recordatorios() {
  const estado = usarEstado() as Fin, ver = R.ver(), r = estado.recordatorios;
  const auto = recordatoriosAutomaticos(estado.finanzas) as Fin[];
  const orden: Record<string, number> = { pendiente: 0, vencido: 0, pronto: 1, 'sin-dato': 2, 'al-dia': 3, programado: 4 };
  const lista = (r.lista as Fin[]).map((x, i) => ({ x, i, s: estadoRecordatorio(x, R.vehiculo(x.vehiculo)) as Fin })).sort((a, b) => orden[a.s.estado] - orden[b.s.estado]);
  const cuenta = (est: string) => lista.filter(({ s }) => s.estado === est).length, visibles = lista.filter(({ s }) => !ver.filtro || s.estado === ver.filtro);
  const porLlamar = (pendientesCirculo(estado.circulo || []) as Fin[]).length;
  const filtros: [string, string][] = [['', 'Todos (' + lista.length + ')'],
    ...([['pendiente', 'De hoy'], ['vencido', 'Vencidos'], ['pronto', 'Pronto'], ['sin-dato', 'Sin registro'], ['al-dia', 'Al día'], ['programado', 'Programados']] as [string, string][]).filter(([k]) => cuenta(k)).map(([k, t]) => [k, t + ' (' + cuenta(k) + ')'] as [string, string])];
  const colorCifra: Record<string, string> = { vencido: tokens.rojoSuave, pronto: tokens.amarillo };
  return (
    <>
      <TituloPantalla>Recordatorios</TituloPantalla>
      <Box sx={{ display: { [PC]: 'grid' }, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px', alignItems: 'start', mb: { [PC]: '14px' }, '& > *': { [PC]: { m: 0 } } }}>
        {(r.vehiculos as Fin[]).map((v, i) => {
          const actual = kmActual(v.km) as number | null, ritmo = ritmoKm(v.km) as number | null;
          return (
            <TarjetaPlegable key={v.id} vista={VISTA} clave={v.icono + ' ' + v.nombre} titulo={v.icono + ' ' + v.nombre} lado={<b>{actual != null ? R.km(actual) : 'sin km'}</b>}>
              <Box sx={{ display: 'grid', gap: '6px' }}>
                <Campo etiqueta="Km del odómetro hoy" type="number" inputMode="numeric" min={0} data-cambio="rec-km" data-v={v.id} defaultValue="" placeholder={String(actual ?? 'km')} style={{ fontSize: 28, fontWeight: 800, height: 60 }} />
                <Corta>{ritmo ? 'Andas unos ' + Math.round(ritmo) + ' km por día: con eso se calcula la fecha del próximo cambio.' : 'Anota los km de vez en cuando (por ejemplo cada semana) para estimar cuándo toca el próximo cambio.'}</Corta>
                <Desplegable titulo={<Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>Editar vehículo</Box>}>
                  <Box sx={{ display: 'grid', gap: '8px' }}>
                    <Campo etiqueta="Nombre" data-cambio="ed" data-ruta={'recordatorios.vehiculos.' + i + '.nombre'} defaultValue={v.nombre} />
                    {v.km.length ? <>
                      <Corta>Lecturas del odómetro (borra las que estén mal):</Corta>
                      <ListaSimple filas={(v.km as Fin[]).map((l, k) => [l, k] as [Fin, number]).sort((a, b) => b[0].fecha.localeCompare(a[0].fecha)).map(([l, k]) => ({ k: String(k), izq: fechaCorta(l.fecha),
                        der: <>{R.km(l.km)} <Borrar data-accion="rec-borrar-km" data-v={v.id} data-k={k} aria-label={'Borrar lectura del ' + fechaCorta(l.fecha)} /></> }))} />
                    </> : null}
                  </Box>
                </Desplegable>
              </Box>
            </TarjetaPlegable>
          );
        })}
        <TarjetaPlegable vista={VISTA} clave="🔔 Resumen" titulo="🔔 Resumen" sx={{ display: { xs: 'none', [PC]: 'block' } }}>
          <Cifras datos={([['vencido', 'Vencidos'], ['pronto', 'Pronto'], ['sin-dato', 'Sin registro'], ['al-dia', 'Al día']] as [string, string][]).map(([k, t]) => ({ titulo: t, valor: cuenta(k), color: cuenta(k) ? colorCifra[k] : undefined }))} />
          <Corta>{(auto.length ? auto.length + (auto.length === 1 ? ' pago' : ' pagos') + ' de Finanzas cerca · ' : '') + porLlamar + (porLlamar === 1 ? ' persona' : ' personas') + ' por llamar'}</Corta>
        </TarjetaPlegable>
      </Box>
      <Box sx={{ ...FILA, mb: '8px' }}>
        <TituloGrupo sx={{ m: 0 }}>🔧 Mis recordatorios</TituloGrupo>
        <Button data-accion="rec-abrir-agregar">＋ Agregar</Button>
      </Box>
      {lista.length > 1 ? <Opciones nombre="Filtrar por estado" activa={ver.filtro} opciones={filtros} datos={(k) => ({ 'data-accion': 'rec-filtro', 'data-v': k })} sx={{ mb: '10px' }} /> : null}
      {lista.length
        ? <Box sx={{ display: 'grid', gap: '6px', mb: '14px' }}>{visibles.map(({ x, i }) => miRecordatorio(estado, x, i, ver.abierto))}</Box>
        : <Card component="section" sx={{ mb: '14px' }}><Corta>Aún no tienes recordatorios. Toca ＋ Agregar y escoge uno.</Corta></Card>}
      {sugeridos(estado, ver.sug)}
      {eventos(estado, ver.abierto)}
      {pagos(auto)}
      {circulo(estado)}
      <Plantillas abierto={!!ver.agregar} />
    </>
  );
}
