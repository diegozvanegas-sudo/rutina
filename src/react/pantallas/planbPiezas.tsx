// Piezas que comparten los cinco módulos de 💰 Finanzas → 🛟 Plan B: la tarjeta numerada de cada punto, los párrafos de
// la guía, la lista de pasos hechos, los chips que se prenden y apagan, el cuadro de un elemento y la nota del pie.
import type { ReactNode } from 'react';
import { Box, Button, Chip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Nota } from '../ui/Textos';

export const VISTA = 'finanzas';
export const CAMPOS = { display: 'grid', gap: '8px', my: '8px' };
const con = (base: object, sx?: SxProps<Theme>) => [base, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>;

// Cada punto de la guía: una tarjeta numerada que se abre y se cierra
export const Punto = ({ n, titulo, children }: { n: number; titulo: string; children: ReactNode }) => (
  <TarjetaPlegable vista={VISTA} clave={n + ' ' + titulo}
    titulo={<><Box component="span" sx={{ display: 'inline-grid', placeItems: 'center', width: 26, height: 26, borderRadius: '50%', bgcolor: tokens.brandSoft, color: 'primary.main', fontSize: 14, fontWeight: 800 }}>{n}</Box> {titulo}</>}>
    {children}
  </TarjetaPlegable>
);
/** Idea en negrita y su explicación */
export const Idea = ({ titulo, children }: { titulo: string; children: ReactNode }) => <Box component="p" sx={{ my: '10px' }}><b>{titulo}</b> {children}</Box>;
/** Párrafo de la guía: gris, con lo importante en negrita y blanco */
export const Guia = ({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) => (
  <Box component="p" sx={con({ my: '8px', fontSize: 15, color: 'text.secondary', '& b': { color: 'text.primary' } }, sx)}>{children}</Box>
);
/** De dónde sale el módulo */
export const Pie = ({ children }: { children: ReactNode }) => <Nota sx={{ textAlign: 'center' }}>{children}</Nota>;

/** Lo que ya se hizo del módulo: ✓ en verde, ○ lo que falta */
export const Pasos = ({ pasos }: { pasos: [string, boolean][] }) => (
  <Box component="ul" sx={{ listStyle: 'none', m: '8px 0 0', p: 0, display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontSize: 13, color: 'text.secondary' }}>
    {pasos.map(([t, ok]) => <Box component="li" key={t} sx={ok ? { color: 'success.main' } : null}>{ok ? '✓' : '○'} {t}</Box>)}
  </Box>
);

/** Lista con viñetas (la de los libros) */
export const Vinetas = ({ items }: { items: ReactNode[] }) => (
  <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '6px', lineHeight: 1.5 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</Box>
);

/** Chip que se prende y se apaga con una acción de las de siempre */
export const ChipSi = ({ si, nombre, datos, children, sx }: { si: boolean; nombre: string; datos: Record<string, string | number>; children: ReactNode; sx?: SxProps<Theme> }) => (
  <Chip clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={children} onClick={() => accion(nombre, datos)} sx={sx} />
);
/** Fila de chips que pasa al renglón de abajo */
export const FilaChips = ({ nombre, children, sx }: { nombre?: string; children: ReactNode; sx?: SxProps<Theme> }) => (
  <Box role={nombre ? 'group' : undefined} aria-label={nombre} sx={con({ display: 'flex', flexWrap: 'wrap', gap: '8px', m: '6px 0 8px' }, sx)}>{children}</Box>
);

/** Cuadro de un elemento (un día del reto, un problema, una idea). marcado: verde (hecho) o amarillo (el elegido) */
export const Caja = ({ marcado, children, sx }: { marcado?: 'verde' | 'amarillo' | null; children: ReactNode; sx?: SxProps<Theme> }) => (
  <Box sx={con({
    display: 'grid', gap: '8px', alignContent: 'start', p: '10px', borderRadius: '12px', border: '1px solid', bgcolor: tokens.surface2,
    borderColor: marcado === 'verde' ? 'success.main' : marcado === 'amarillo' ? 'warning.main' : 'divider',
    boxShadow: marcado === 'amarillo' ? '0 0 0 1px ' + tokens.amarillo + ' inset' : 'none',
  }, sx)}>{children}</Box>
);
/** Campo + botones pequeños en una fila */
export const FilaCampo = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto auto', gap: '6px', alignItems: 'center' }}>{children}</Box>
);

/** Botón con aspecto de enlace (azul y subrayado) */
export const Enlace = ({ onClick, children, sx }: { onClick: () => void; children: ReactNode; sx?: SxProps<Theme> }) => (
  <Button variant="text" onClick={onClick} sx={con({ minHeight: 32, p: 0, minWidth: 0, color: 'info.main', fontWeight: 400, textDecoration: 'underline', textAlign: 'left', justifyContent: 'flex-start', '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' } }, sx)}>{children}</Button>
);
/** Compartir (o copiar si no se puede) y copiar el texto del módulo */
export const Compartir = ({ enviar, copiar, texto = '📤 Compartir' }: { enviar: string; copiar: string; texto?: string }) => (
  <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' }}>
    <Button onClick={() => accion(enviar)}>{texto}</Button>
    <Button color="secondary" onClick={() => accion(copiar)}>📋 Copiar texto</Button>
  </Box>
);
/** Título pequeño de una parte dentro de un punto (2.1, 2.2…), en rosa */
export const Sub = ({ n, children }: { n: string; children: ReactNode }) => (
  <Box component="h3" sx={{ display: 'flex', alignItems: 'center', gap: '8px', m: '18px 0 6px', fontSize: 16, color: tokens.rosa }}>
    <Box component="span" sx={{ fontSize: 12, p: '2px 8px', borderRadius: 999, bgcolor: 'color-mix(in srgb, ' + tokens.rosa + ' 18%, transparent)' }}>{n}</Box> {children}
  </Box>
);
/** Etiquetas fijas (no se tocan) */
export const Etiquetas = ({ items }: { items: string[] }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', m: '4px 0 10px' }}>
    {items.map((x) => <Box component="span" key={x} sx={{ p: '6px 12px', borderRadius: 999, bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', fontSize: 14 }}>{x}</Box>)}
  </Box>
);
