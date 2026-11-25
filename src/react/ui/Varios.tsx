// Piezas pequeñas que usan varias pantallas
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, ButtonBase, Chip, Collapse } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { tokens } from '../tema';

/** Fila de pestañas o de opciones: una sola activa (en verde). envolver: pasan al renglón de abajo en vez de deslizarse.
 *  Al tocar una: alElegir(id), o los data-* de datos(id) cuando la acción es de las de siempre (data-accion, las despacha main.js) */
export function Opciones<T extends string>({ opciones, activa, alElegir, datos, nombre, chica = false, envolver = false, marcada, sx }: {
  opciones: [T, ReactNode][]; activa: T | null; alElegir?: (id: T) => void; datos?: (id: T) => Record<`data-${string}`, string>; nombre: string; chica?: boolean; envolver?: boolean;
  /** Una opción con borde verde aunque no esté elegida (por ejemplo, el día de hoy) y su título al pasar encima */
  marcada?: { id: T; titulo: string } | null; sx?: SxProps<Theme>;
}) {
  // En el celular la fila se desliza: la activa queda a la vista
  const fila = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = fila.current, el = c && c.querySelector<HTMLElement>('[aria-pressed=true]');
    if (!c || !el || c.scrollWidth <= c.clientWidth + 2) return;
    const r = el.getBoundingClientRect(), rc = c.getBoundingClientRect();
    if (r.right > rc.right || r.left < rc.left) c.scrollLeft += r.left - rc.left - (rc.width - r.width) / 2;
  }, [activa]);
  return (
    <Box ref={fila} role="group" aria-label={nombre}
      sx={[{ display: 'flex', gap: chica ? '6px' : '8px', p: '2px 0 12px' }, envolver ? { flexWrap: 'wrap' } : { overflowX: 'auto', scrollbarWidth: 'none' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {opciones.map(([id, t]) => (
        <Chip key={id} clickable size={chica ? 'small' : 'medium'} aria-pressed={activa === id} color={activa === id ? 'primary' : 'default'} variant={activa === id ? 'filled' : 'outlined'}
          label={t} onClick={alElegir ? () => alElegir(id) : undefined} {...(datos ? datos(id) : null)} title={marcada && marcada.id === id ? marcada.titulo : undefined}
          sx={[{ flex: 'none' }, marcada && marcada.id === id && activa !== id ? { borderColor: 'primary.main', borderWidth: 2 } : null]} />
      ))}
    </Box>
  );
}

/** Pestañas con "⋯ Más": se ven las principales (y la activa, si es de las otras); el resto se abre debajo, en renglones.
 *  Las de "Más" siguen en la página (plegadas), con los mismos data-* de siempre */
export function PestanasConMas({ opciones, principales, activa, datos, nombre, sx }: {
  opciones: [string, ReactNode][]; principales: string[]; activa: string; datos: (id: string) => Record<`data-${string}`, string>; nombre: string; sx?: SxProps<Theme>;
}) {
  const [abierto, poner] = useState(false);
  const arriba = opciones.filter(([id]) => principales.includes(id) || id === activa), resto = opciones.filter(([id]) => !principales.includes(id) && id !== activa);
  const chip = ([id, t]: [string, ReactNode]) => (
    <Chip key={id} clickable aria-pressed={activa === id} color={activa === id ? 'primary' : 'default'} variant={activa === id ? 'filled' : 'outlined'}
      label={t} onClick={() => poner(false)} {...datos(id)} sx={{ flex: 'none', minHeight: 40 }} />
  );
  return (
    <Box sx={[{ p: '2px 0 12px' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box role="group" aria-label={nombre} sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {arriba.map(chip)}
        {resto.length ? <Chip clickable data-t="pestanas-mas" aria-expanded={abierto} variant="outlined" label={abierto ? '▴ Menos' : '⋯ Más (' + resto.length + ')'} onClick={() => poner(!abierto)} sx={{ flex: 'none', minHeight: 40, fontWeight: 700 }} /> : null}
      </Box>
      <Collapse in={abierto} timeout={150}>
        <Box role="group" aria-label={nombre + ': más'} sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', pt: '10px', mt: '10px', borderTop: '1px solid', borderColor: 'divider' }}>{resto.map(chip)}</Box>
      </Collapse>
    </Box>
  );
}

/** HTML que todavía arma el código de antes (las figuras de figuras.js, el PDF de ventas-pdf.js). Puente temporal:
 *  cuando esa pieza se pase a React, deja de usarse. El HTML viene de la app, nunca de lo que escribe otra persona sin escapar */
export const HtmlViejo = ({ html, clase, sx }: { html: string; clase?: string; sx?: SxProps<Theme> }) => <Box className={clase} sx={sx} dangerouslySetInnerHTML={{ __html: html }} />;

/** Cuadros de cifras: título pequeño, número grande y una nota */
export function Cifras({ datos }: { datos: { titulo: string; valor: ReactNode; nota?: ReactNode; color?: string }[] }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', mb: '10px' }}>
      {datos.map((d) => (
        <Box key={d.titulo} sx={{ bgcolor: 'background.default', borderRadius: '10px', p: '8px 10px', display: 'grid' }}>
          <Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{d.titulo}</Box>
          <Box component="b" sx={{ fontSize: 20, color: d.color }}>{d.valor}</Box>
          {d.nota != null && <Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{d.nota}</Box>}
        </Box>
      ))}
    </Box>
  );
}

/** Barra de avance (0 a 1). rojo: se pasó del tope. color: otro color del tema (por ejemplo "warning.main") */
export function Avance({ parte, rojo = false, color }: { parte: number; rojo?: boolean; color?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, parte || 0)) * 100);
  return (
    <Box role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} sx={{ height: 8, borderRadius: 999, bgcolor: tokens.surface2, overflow: 'hidden', m: '2px 0 10px' }}>
      <Box sx={{ width: pct + '%', height: '100%', bgcolor: color || (rojo ? 'error.main' : 'primary.main'), borderRadius: 999, transition: 'width .3s' }} />
    </Box>
  );
}

/** Renglón de una lista para marcar como hecho (caja a la izquierda, texto tachado al marcar) */
export function Marcable({ hecho, alTocar, children }: { hecho: boolean; alTocar: () => void; children: ReactNode }) {
  return (
    <ButtonBase aria-pressed={hecho} onClick={alTocar}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px', width: '100%', minHeight: 48, p: '8px 10px', mb: '6px', borderRadius: '10px', border: '1px solid',
        borderColor: hecho ? 'primary.main' : 'divider', bgcolor: 'background.default', color: 'text.primary', font: 'inherit', textAlign: 'left',
        '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
      <Box component="span" aria-hidden="true" sx={{ flex: 'none', display: 'grid', placeItems: 'center', width: 24, height: 24, borderRadius: '6px', border: '2px solid', fontWeight: 800,
        borderColor: hecho ? 'primary.main' : 'divider', bgcolor: hecho ? 'primary.main' : 'transparent', color: 'primary.contrastText' }}>{hecho ? '✓' : ''}</Box>
      <Box component="span" sx={hecho ? { color: 'text.secondary', textDecoration: 'line-through' } : null}>{children}</Box>
    </ButtonBase>
  );
}
