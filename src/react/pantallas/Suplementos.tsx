// 💊 Suplementos: marcar lo de hoy (o ayer), la constancia de cada uno, la lista para editar y los avisos en el calendario.
// React pinta; las reglas son las de src/vistas/suplementos.js (sup-…). "Agregar" lee su campo por id (sup-nuevo) y los
// demás botones llevan data-accion. La tarjeta HTML de Hoy (tarjetaSuplementosHoy) sigue allá hasta migrar Hoy.
import type { ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Checkbox, Chip } from '@mui/material';
import { iso, sumarDias, hora } from '../../fechas.js';
import { MOMENTOS, NOMBRE_MOMENTO, PLANTILLAS, avisoPastilla, mismoNombre, deHoy, tomado, racha, constancia, seAcaba } from '../../suplementos.js';
import { piezasSuplementos } from '../../vistas/suplementos.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLista, CampoSolo, DOS } from '../ui/Campo';
import { TituloPantalla, Nota } from '../ui/Textos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'suplementos';
const S = piezasSuplementos as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const Detalle = ({ children, sx }: { children: ReactNode; sx?: object }) => <Box sx={{ color: 'text.secondary', fontSize: 14, ...sx }}>{children}</Box>;
const Mini = ({ activo, datos, children }: { activo?: boolean; datos: Record<string, string | number>; children: ReactNode }) => (
  <Chip clickable size="small" {...datos} aria-pressed={activo} color={activo ? 'primary' : 'default'} variant={activo ? 'filled' : 'outlined'} label={children} sx={activo ? null : { color: 'info.main' }} />
);
const Interruptor = ({ texto, marcado, datos }: { texto: string; marcado: boolean; datos: Record<string, string> }) => (
  <Box component="label" sx={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
    <Checkbox key={String(marcado)} defaultChecked={marcado} slotProps={{ input: datos as object }} sx={{ p: '4px', ml: '-4px' }} />{texto}
  </Box>
);

// Lo de un día, con el botón grande de los hábitos
// corta (Hoy): sin el aviso de la pastilla ni el botón de Compras
export function lista(e: Fin, f: string, corta = false) {
  const sups = S.deLaFecha(f) as Fin[];
  if (!sups.length) return <Nota>{S.datos().lista.length ? 'Hoy no te toca ningún suplemento.' : 'Aún no tienes suplementos.'}</Nota>;
  return (
    <Box component="ol" sx={{ listStyle: 'none', m: '8px 0 0', p: 0, display: 'grid', gap: '8px' }}>
      {sups.map((s) => {
        const reg = tomado(e.dias, f, s.id) && e.dias[f].suplementos[s.id], aviso = avisoPastilla(s, e.habitos);
        const detalle = reg ? 'Tomado a las ' + hora(reg.ts) : [s.dosis, (NOMBRE_MOMENTO as Record<string, string>)[s.momento]].filter(Boolean).join(' · ');
        return (
          <Box component="li" key={s.id} sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start', p: '10px', borderRadius: '12px', bgcolor: 'background.default' }}>
            <ButtonBase data-accion="sup-marcar" data-id={s.id} data-f={f} aria-pressed={!!reg} aria-label={s.nombre}
              sx={{ flex: 'none', width: 52, height: 52, borderRadius: '50%', border: '2px solid', fontSize: 22, fontWeight: 800, ...(reg ? { bgcolor: 'primary.main', borderColor: 'primary.main', color: 'primary.contrastText' } : { bgcolor: tokens.surface2, borderColor: 'divider', color: 'text.secondary' }) }}>
              {reg ? '✓' : s.emoji || '💊'}
            </ButtonBase>
            <Box sx={{ flex: 1, minWidth: 0, display: 'grid', gap: '6px', pt: '4px' }}>
              <Box sx={{ fontWeight: 700, fontSize: 17, ...(reg ? { color: 'text.secondary', textDecoration: 'line-through', textDecorationColor: tokens.line } : null) }}>{s.nombre}</Box>
              <Detalle>{detalle}</Detalle>
              {!corta && aviso && !reg ? <Detalle sx={{ color: 'warning.main' }}>⚠️ {aviso}</Detalle> : null}
              {seAcaba(s) ? (
                <Detalle sx={{ color: 'warning.main' }}>{s.quedan ? '📦 Quedan ' + s.quedan + ' tomas' : '📦 Se acabó'}{' '}
                  {corta ? null : <Button variant="text" data-accion="sup-comprar" data-id={s.id} sx={{ minHeight: 36, p: '4px 8px', color: 'text.primary', fontWeight: 400, fontSize: 14 }}>🛒 A Compras</Button>}
                </Detalle>
              ) : null}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// Últimos 7 días de cada uno (✓ tomado · ✗ tocaba y no · – no tocaba), la racha y el % del mes
function constanciaDe(e: Fin) {
  const hoy = iso(), activos = (S.datos().lista as Fin[]).filter((s) => s.activo !== false);
  if (!activos.length) return null;
  const semana = (S.hacia(hoy, 7) as string[]).reverse(), mes = S.hacia(hoy, 30);
  const PUNTO: Record<string, object> = {
    si: { bgcolor: 'primary.main', borderColor: 'primary.main', color: 'primary.contrastText' }, no: { borderColor: 'error.main', color: 'error.main' },
    hoy: { borderStyle: 'dashed', color: 'text.primary' }, nada: { opacity: 0.35 },
  };
  return (
    <TarjetaPlegable vista={VISTA} clave="📈 Tu constancia" titulo="📈 Tu constancia">
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '12px' }}>
        {activos.map((s) => {
          const r = racha(s, e.dias, S.hacia(hoy, 400), S.info) as number, c = constancia(s, e.dias, mes, S.info) as Fin;
          return (
            <Box component="li" key={s.id} sx={{ display: 'grid', gap: '6px', pb: '10px', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={FILA}><b>{(s.emoji || '💊') + ' ' + s.nombre}</b><span>{r ? '🔥 ' + r + (r === 1 ? ' día' : ' días') : ''}</span></Box>
              <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {semana.map((f) => {
                  const x = S.info(f), toca = deHoy([s], x.diaSemana, x.entrena).length && !(s.creado && f < s.creado);
                  const estado = !toca ? 'nada' : tomado(e.dias, f, s.id) ? 'si' : f === hoy ? 'hoy' : 'no';
                  return <Box component="span" key={f} title={f} sx={{ width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, border: '1px solid', borderColor: 'divider', color: 'text.secondary', ...PUNTO[estado] }}>{DIAS[x.diaSemana - 1]}</Box>;
                })}
              </Box>
              <Box component="small" sx={{ color: 'text.secondary', fontSize: 14 }}>{c.parte == null ? 'Aún sin días para medir' : 'Últimos 30 días: ' + c.tomados + ' de ' + c.tocaban + ' (' + Math.round(c.parte * 100) + ' %)'}</Box>
            </Box>
          );
        })}
      </Box>
    </TarjetaPlegable>
  );
}

function fila(s: Fin, editando: string | null) {
  const titulo = <>{(s.emoji || '💊') + ' ' + s.nombre}{s.activo === false ? <> <small>(en pausa)</small></> : null}</>;
  const raya = { py: '8px', borderBottom: '1px solid', borderColor: 'divider', '& small': { color: 'text.secondary' } };
  if (editando !== s.id) {
    const extra = [s.dosis, (NOMBRE_MOMENTO as Record<string, string>)[s.momento], s.hora && '⏰ ' + s.hora, s.dias && s.dias.length ? (s.dias as number[]).map((n) => DIAS[n - 1]).join(' ') : 'todos los días', s.soloEntreno && 'solo días de entreno', s.quedan != null && 'quedan ' + s.quedan].filter(Boolean).join(' · ');
    return (
      <Box component="li" key={s.id} sx={{ ...raya, display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Box component="span" sx={{ display: 'grid', gap: '2px', flex: '1 1 14em', minWidth: 0 }}><b>{titulo}</b><small>{extra}</small>{s.nota ? <small>{s.nota}</small> : null}</Box>
        <Button color="secondary" data-accion="sup-editar" data-id={s.id}>✏️ Editar</Button>
      </Box>
    );
  }
  const campo = (k: string, t: string, props: Record<string, unknown> = {}) => <Campo etiqueta={t} data-cambio="sup-campo" data-id={s.id} data-k={k} defaultValue={s[k] ?? ''} {...props} />;
  return (
    <Box component="li" key={s.id} sx={{ ...raya, display: 'grid', gap: '10px' }}>
      <Box sx={DOS}>{campo('nombre', 'Nombre')}{campo('emoji', 'Ícono', { maxLength: 4 })}</Box>
      <Box sx={DOS}>
        {campo('dosis', 'Dosis')}
        <CampoLista etiqueta="Cuándo" data-cambio="sup-campo" data-id={s.id} data-k="momento" defaultValue={s.momento || 'cualquiera'} opciones={MOMENTOS as [string, string][]} />
      </Box>
      <Box sx={DOS}>{campo('hora', '⏰ Aviso en el calendario y el reloj (opcional)', { type: 'time' })}</Box>
      <Nota sx={{ m: 0 }}>Días (sin marcar ninguno: todos)</Nota>
      <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {DIAS.map((d, i) => <Mini key={d} activo={(s.dias || []).includes(i + 1)} datos={{ 'data-accion': 'sup-dia', 'data-id': s.id, 'data-n': i + 1 }}>{d}</Mini>)}
      </Box>
      <Interruptor texto="Solo los días de gym o de partido" marcado={!!s.soloEntreno} datos={{ 'data-cambio': 'sup-entreno', 'data-id': s.id }} />
      <Box sx={DOS}>{campo('quedan', 'Tomas que quedan en el frasco (opcional)', { type: 'number', inputMode: 'numeric', min: 0 })}{campo('nota', 'Nota')}</Box>
      <Interruptor texto="Lo estoy tomando (quítalo para pausarlo sin perder el historial)" marcado={s.activo !== false} datos={{ 'data-cambio': 'sup-activo', 'data-id': s.id }} />
      <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button data-accion="sup-editar" data-id="">✓ Listo</Button>
        <Button color="secondary" data-accion="sup-borrar" data-id={s.id}>🗑 Quitar</Button>
      </Box>
    </Box>
  );
}

function misSuplementos(ver: Fin) {
  const l = S.datos().lista as Fin[], faltan = (PLANTILLAS as Fin[]).map((p, i) => [p, i] as [Fin, number]).filter(([p]) => !l.some((s) => mismoNombre(s.nombre, p.nombre)));
  return (
    <TarjetaPlegable vista={VISTA} clave="🧾 Mis suplementos" titulo="🧾 Mis suplementos">
      {l.length ? <Box component="ul" sx={{ listStyle: 'none', m: '0 0 8px', p: 0, display: 'grid', gap: '4px' }}>{l.map((s) => fila(s, ver.editando))}</Box> : null}
      {faltan.length ? <>
        <Nota>Agregar de un toque:</Nota>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', m: '6px 0 4px' }}>{faltan.map(([p, i]) => <Mini key={i} datos={{ 'data-accion': 'sup-plantilla', 'data-i': i }}>＋ {p.emoji + ' ' + p.nombre}</Mini>)}</Box>
      </> : null}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', mt: '10px' }}>
        <Box sx={{ gridColumn: '1 / -1' }}><CampoSolo id="sup-nuevo" data-enter="sup-agregar" placeholder="＋ Otro suplemento (Enter para agregar)" aria-label="Nuevo suplemento" /></Box>
        <Button color="secondary" data-accion="sup-agregar" sx={{ gridColumn: 2 }}>Agregar</Button>
      </Box>
    </TarjetaPlegable>
  );
}

// Los avisos llegan al reloj por el calendario del celular: suena aunque la app esté cerrada
function avisos() {
  if (!S.datos().lista.length) return null;
  const av = S.avisosDeSuplementos() as Fin[];
  return (
    <TarjetaPlegable vista={VISTA} clave="⏰ Avisos en el reloj" titulo="⏰ Avisos en el reloj">
      <Nota>{av.length ? av.map((a) => a.hora + ' ' + a.icono + ' ' + a.nombre).join(' · ') : 'Ningún suplemento tiene hora de aviso. Ponle una en ✏️ Editar.'}</Nota>
      <Nota>Toca el botón, abre el archivo y elige "Agregar todo". El calendario del celular avisa a esa hora y el reloj muestra el aviso, aunque la app esté cerrada. Si cambias una hora, vuelve a agregarlo (si queda repetido, borra el evento viejo del calendario).</Nota>
      <Button data-accion="sup-calendario" disabled={!av.length}>📅 Agregar al calendario</Button>
    </TarjetaPlegable>
  );
}

export default function Suplementos() {
  const e = usarEstado() as Fin, ver = S.ver(), f = ver.cual === 'hoy' ? iso() : sumarDias(iso(), -1);
  const titulo = ver.cual === 'hoy' ? 'Hoy' : 'Ayer';
  return (
    <>
      <TituloPantalla>💊 Suplementos</TituloPantalla>
      <TarjetaPlegable vista={VISTA} clave={titulo} titulo={titulo}
        lado={<Box sx={{ display: 'flex', gap: '6px' }}>{([['hoy', 'Hoy'], ['ayer', 'Ayer']] as [string, string][]).map(([k, t]) => <Mini key={k} activo={ver.cual === k} datos={{ 'data-accion': 'sup-cual', 'data-k': k }}>{t}</Mini>)}</Box>}>
        {ver.cual === 'ayer' ? <Nota>Si se te olvidó anotar algo ayer, márcalo aquí.</Nota> : null}
        {lista(e, f)}
      </TarjetaPlegable>
      {constanciaDe(e)}
      {misSuplementos(ver)}
      {avisos()}
    </>
  );
}
