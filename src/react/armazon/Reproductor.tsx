// Reproductor de sesiones guiadas: pantalla completa sobre cualquier sección (lo abren los botones "sesion" de Hoy,
// Mañana, Gym, Sesiones, Libros, Dieta). Fases (preparar, tiempo, reps, cambio de lado, descanso), la tira de figuras
// para saltar, pausa, anterior/saltar y, en una checklist, los puntos para marcar. La caja #reproductor sigue en
// index.html; el reloj, las fases, los pitidos y la pantalla encendida siguen en vistas/sesiones.js (rep-…, check-paso).
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Link } from '@mui/material';
import { reloj } from '../../fechas.js';
import { figuraPaso, videoPaso } from '../../figuras.js';
import { piezasReproductor } from '../../vistas/sesiones.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { HtmlViejo } from '../ui/Varios';
import { Paso, Pasos } from '../ui/Lectura';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const R = piezasReproductor as Fin;
const ANCHO = { maxWidth: 560, mx: 'auto', width: '100%' };
const COLOR_FASE: Record<string, string> = { prep: tokens.amarillo, cambio: tokens.amarillo, descanso: tokens.azul };

const Cabecera = ({ texto }: { texto: string }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary' }}>
    <span>{texto}</span>
    <ButtonBase data-accion="rep-cerrar" aria-label="Cerrar" sx={{ minWidth: 44, minHeight: 44, borderRadius: '12px', fontSize: 22, color: 'text.primary', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>✕</ButtonBase>
  </Box>
);
const Barra = ({ parte }: { parte: number }) => (
  <Box sx={{ height: 6, bgcolor: tokens.surface2, borderRadius: 999, overflow: 'hidden', flex: 'none' }}><Box sx={{ height: '100%', width: Math.round(parte * 100) + '%', bgcolor: 'primary.main' }} /></Box>
);
const Grande = ({ children, id }: { children: ReactNode; id?: string }) => (
  <Box id={id} sx={{ fontSize: { xs: 64, sm: 84 }, fontWeight: 800, fontVariantNumeric: 'tabular-nums', lineHeight: 1, my: '6px', '& small': { display: 'block', fontSize: 18 } }}>{children}</Box>
);
const Fiesta = ({ titulo, children }: { titulo: string; children?: ReactNode }) => (
  <Box sx={{ ...ANCHO, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
    <Box sx={{ fontSize: 84, lineHeight: 1, my: '16px' }}>🎉</Box>
    <Box component="h2" sx={{ fontSize: 28, m: 0 }}>{titulo}</Box>
    {children}
  </Box>
);
const BotonGrande = ({ datos, children, sx }: { datos: Record<string, string>; children: ReactNode; sx?: object }) => (
  <Button {...datos} sx={{ minHeight: 64, fontSize: 22, ...sx }}>{children}</Button>
);

// Todas las figuras de la sesión en una fila: la actual resaltada, las hechas con ✓; se tocan para saltar
function Tira({ pasos, actual }: { pasos: Fin[]; actual: number }) {
  const fila = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = fila.current, el = c && c.querySelector<HTMLElement>('[aria-current=step]');
    if (c && el) c.scrollLeft = el.offsetLeft - (c.clientWidth - el.offsetWidth) / 2;
  }, [actual]);
  return (
    <Box ref={fila} role="list" sx={{ position: 'relative', flex: 'none', display: 'flex', gap: '8px', overflowX: 'auto', p: { xs: '4px 2px', sm: '8px 2px' }, maxWidth: 760, width: '100%', mx: 'auto', mt: '6px', scrollbarWidth: 'thin' }}>
      {pasos.map((p, i) => {
        const dibujo = figuraPaso(p, { animar: false }) as string, es = i === actual, hecho = actual > i;
        return (
          <ButtonBase key={i} role="listitem" data-accion="rep-paso" data-i={i} aria-current={es ? 'step' : undefined} aria-label={(i + 1) + '. ' + p.nombre}
            sx={{ flex: 'none', width: { xs: 62, sm: 76 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: '2px', p: '4px', borderRadius: '10px', bgcolor: tokens.surface2,
              border: '2px solid', borderColor: es ? 'primary.main' : 'transparent', opacity: hecho ? 0.5 : 1, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
            {dibujo ? <HtmlViejo html={dibujo} sx={{ '& .fg-nota': { display: 'none' }, '& svg, & img': { width: { xs: 50, sm: 64 }, m: 0, bgcolor: 'background.default', borderRadius: '8px', display: 'block' }, '& img': { height: { xs: 38, sm: 48 }, objectFit: 'cover' } }} />
              : <Box component="span" sx={{ width: { xs: 50, sm: 64 }, height: 54, display: 'grid', placeItems: 'center', bgcolor: 'background.default', borderRadius: '8px', fontWeight: 800, color: 'text.secondary' }}>{i + 1}</Box>}
            <Box component="small" sx={{ fontSize: { xs: 10, sm: 11 }, lineHeight: 1.2, textAlign: 'center', color: es ? 'text.primary' : 'text.secondary', fontWeight: es ? 700 : 400, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {hecho ? '✓ ' : (i + 1) + '. '}{p.nombre}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function Checklist({ r }: { r: Fin }) {
  const s = r.sesion, marcas = R.marcasDe(s.id), a = R.avanceChecklist(s, marcas) as Fin;
  return (
    <>
      <Cabecera texto={s.nombre + ' · ' + a.hechos + ' / ' + a.total} />
      <Barra parte={a.total ? a.hechos / a.total : 0} />
      <Box sx={{ ...ANCHO, flex: 1, overflowY: 'auto', py: '12px' }}>
        {a.completa ? <Box sx={{ mb: '12px' }}><Fiesta titulo="¡Todo listo!" /></Box> : null}
        <Pasos>
          {(s.pasos as Fin[]).map((p, i) => {
            const id = R.idPaso(p, i), hecho = !!marcas[id];
            return <Paso key={id} hecho={hecho} datos={{ 'data-accion': 'check-paso', 'data-sesion': s.id, 'data-paso': id }}>{p.nombre}{p.desc ? <Box component="small" sx={{ color: 'text.secondary', fontSize: 14 }}> · {p.desc}</Box> : null}</Paso>;
          })}
        </Pasos>
      </Box>
      <Box sx={{ ...ANCHO, display: 'grid' }}><BotonGrande datos={{ 'data-accion': 'rep-cerrar' }}>{a.completa ? 'Listo' : 'Cerrar'}</BotonGrande></Box>
    </>
  );
}

function Guiada({ r }: { r: Fin }) {
  const f = r.lista[r.k], s = r.sesion;
  if (!f) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Fiesta titulo="¡Sesión completa!"><p>{s.nombre}</p><BotonGrande datos={{ 'data-accion': 'rep-cerrar' }} sx={{ px: '32px' }}>Listo</BotonGrande></Fiesta>
      </Box>
    );
  }
  const total = s.pasos.length, sig = s.pasos[f.i + 1], conTira = total > 1;
  const titulo = f.fase === 'prep' ? 'Prepárate' : f.fase === 'cambio' ? '↔ Cambia de lado' : f.fase === 'descanso' ? 'Descanso' : f.lado || '';
  const fase = [titulo, f.series > 1 && (f.fase === 'tiempo' || f.fase === 'reps') ? 'serie ' + f.serie + ' de ' + f.series : ''].filter(Boolean).join(' · ');
  const dibujo = figuraPaso(f.p) as string, video = videoPaso(f.p) as string;
  return (
    <>
      <Cabecera texto={s.nombre + ' · ' + (f.i + 1) + ' / ' + total} />
      <Barra parte={r.k / r.lista.length} />
      {conTira ? <Tira pasos={s.pasos} actual={f.i} /> : null}
      <Box sx={{ ...ANCHO, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: conTira ? '4px' : '8px' }}>
        <Box sx={{ fontWeight: 800, fontSize: 18, color: COLOR_FASE[f.fase] || 'primary.main', textTransform: 'uppercase', letterSpacing: '.04em' }}>{fase}{' '}</Box>
        {dibujo ? <HtmlViejo html={dibujo} sx={{ '& .figura': { width: conTira ? 'min(340px, 82vw, 26vh)' : 'min(340px, 82vw, 34vh)', mb: '6px' } }} /> : null}
        <Box component="h2" sx={{ fontSize: { xs: conTira ? 24 : 28, sm: 28 }, m: 0 }}>{f.p.nombre}</Box>
        <Box sx={{ color: 'text.secondary' }}>{f.p.musculo || ''}</Box>
        {f.fase === 'reps' ? <Grande>{f.p.reps}<small>reps</small></Grande> : <Grande id="rep-reloj">{reloj(R.segRestantes())}</Grande>}
        <Box component="p" sx={{ color: 'text.secondary', fontSize: { xs: 15, sm: 17 }, my: '4px' }}>{f.p.desc || ''}</Box>
        {video ? <Link href={video} target="_blank" rel="noopener" sx={{ fontWeight: 700, p: '10px 14px', borderRadius: 999, bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', textDecoration: 'none' }}>🎥 Ver video de cómo se hace</Link> : null}
        {sig && f.fase !== 'prep' ? <Box component="p" sx={{ color: 'text.secondary', fontSize: 14, my: '4px' }}>Siguiente: {sig.nombre}</Box> : null}
      </Box>
      <Box sx={{ ...ANCHO, display: 'grid', gridTemplateColumns: '72px 1fr 72px', gap: '10px' }}>
        <BotonGrande datos={{ 'data-accion': 'rep-mover', 'data-n': '-1', 'aria-label': 'Anterior' }} sx={{ bgcolor: tokens.surface2, color: 'text.primary', border: '1px solid', borderColor: 'divider', minWidth: 0 }}>⏮</BotonGrande>
        {f.fase === 'reps' ? <BotonGrande datos={{ 'data-accion': 'rep-mover', 'data-n': '1' }}>✓ Hecho</BotonGrande>
          : <BotonGrande datos={{ 'data-accion': 'rep-pausa' }}>{r.pausa != null ? '▶ Seguir' : '⏸ Pausa'}</BotonGrande>}
        <BotonGrande datos={{ 'data-accion': 'rep-mover', 'data-n': '1', 'aria-label': 'Saltar' }} sx={{ bgcolor: tokens.surface2, color: 'text.primary', border: '1px solid', borderColor: 'divider', minWidth: 0 }}>⏭</BotonGrande>
      </Box>
    </>
  );
}

export default function Reproductor() {
  usarEstado(); // las marcas de la checklist
  useSyncExternalStore(R.suscribir, R.version);
  const r = R.actual() as Fin, [, latir] = useState(0);
  // La caja se ve solo con una sesión abierta
  useEffect(() => { const caja = document.getElementById('reproductor'); if (caja) caja.hidden = !r; }, [r]);
  // El reloj se ve correr (las fases las pasa vistas/sesiones.js)
  const corre = !!(r && r.lista && r.pausa == null);
  useEffect(() => {
    if (!corre) return;
    const t = setInterval(() => latir((n) => n + 1), 250);
    return () => clearInterval(t);
  }, [corre]);
  if (!r) return null;
  return r.sesion.tipo === 'checklist' ? <Checklist r={r} /> : <Guiada r={r} />;
}
