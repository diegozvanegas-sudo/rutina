// Piezas de lectura que comparten 📚 Libros y 🎓 Estudiar: subtítulo verde, lista de puntos, caja de nota o de fórmula,
// afirmación, el paso que se marca con ✓, la lista numerada de lecturas o lecciones y la tarjeta de un libro o curso
import type { ReactNode } from 'react';
import { Box, ButtonBase, Card } from '@mui/material';
import { tokens } from '../tema';
import { Avance } from './Varios';

export const Sub = ({ children }: { children: ReactNode }) => <Box component="h3" sx={{ color: 'primary.main', m: '18px 0 6px', fontSize: 16 }}>{children}</Box>;
export const Puntos = ({ items, ordenada = false, chicos }: { items: ReactNode[]; ordenada?: boolean; chicos?: ReactNode[] }) => (
  <Box component={ordenada ? 'ol' : 'ul'} sx={{ m: 0, pl: '20px', display: 'grid', gap: '6px', lineHeight: 1.5, '& small': { display: 'block', color: 'text.secondary' } }}>
    {items.map((x, i) => <li key={i}>{x}{chicos && chicos[i] != null ? <small>{chicos[i]}</small> : null}</li>)}
  </Box>
);
export const Caja = ({ titulo, children, formula = false }: { titulo: ReactNode; children: ReactNode; formula?: boolean }) => (
  <Box sx={{ borderRadius: '10px', p: '10px 12px', m: '14px 0 0', display: 'grid', gap: '4px', ...(formula ? { bgcolor: tokens.brandSoft } : { bgcolor: tokens.notaFondo, border: '1px solid', borderColor: tokens.notaBorde, fontSize: 15 }) }}><b>{titulo}</b>{children}</Box>
);
export const Afirmacion = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ fontSize: 18, fontStyle: 'italic', textAlign: 'center', color: tokens.doradoSuave, m: '14px 0 6px' }}>“{children}”</Box>;
// La cabecera dorada de la lectura o la lección ("DÍA 01 DE 27", "LECCIÓN 02 DE 9 · 10 MIN")
export const Dia = ({ children }: { children: ReactNode }) => <Box component="span" sx={{ color: tokens.dorado, fontWeight: 800, fontSize: 13, letterSpacing: '.06em' }}>{children}</Box>;
export const TituloLectura = ({ children }: { children: ReactNode }) => <Box component="h2" sx={{ fontSize: 23, fontWeight: 700, m: '4px 0 10px' }}>{children}</Box>;
export const Idea = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ fontSize: 17, fontWeight: 600, borderLeft: '3px solid', borderColor: 'primary.main', pl: '10px', m: '0 0 10px' }}>{children}</Box>;
// Un paso que se marca (práctica, proyecto, frases de una evaluación): círculo con ✓ (o su número) a la izquierda
export const Paso = ({ hecho, datos, marca, children }: { hecho: boolean; datos: Record<string, string | number>; marca?: ReactNode; children: ReactNode }) => (
  <ButtonBase {...datos} aria-pressed={hecho} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', textAlign: 'left', minHeight: 52, p: '8px 12px', borderRadius: '12px', border: '1px solid', borderColor: hecho ? 'primary.main' : 'divider', bgcolor: tokens.surface2, color: 'text.primary', font: 'inherit', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
    <Box component="span" sx={{ flex: 'none', width: 30, height: 30, borderRadius: '50%', border: '2px solid', display: 'grid', placeItems: 'center', fontWeight: 800, ...(hecho ? { bgcolor: 'primary.main', borderColor: 'primary.main', color: 'primary.contrastText' } : { borderColor: 'divider' }) }}>{hecho ? '✓' : marca ?? ''}</Box>
    <span>{children}</span>
  </ButtonBase>
);
export const Pasos = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'grid', gap: '8px' }}>{children}</Box>;
// Lista numerada de lecturas o lecciones: ✓ las hechas (verde) y la que toca con borde dorado
export const ListaNumerada = ({ children }: { children: ReactNode }) => (
  <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '6px', '& small': { display: 'block', mt: '2px', color: 'text.secondary', fontSize: 13 } }}>{children}</Box>
);
export function FilaNumerada({ n, hecha, toca, datos, children }: { n: number; hecha: boolean; toca: boolean; datos: Record<string, string | number>; children: ReactNode }) {
  return (
    <li>
      <ButtonBase {...datos} sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', textAlign: 'left', p: '10px', borderRadius: '12px', border: '1px solid', borderColor: !hecha && toca ? tokens.dorado : 'divider', bgcolor: tokens.surface2, color: 'text.primary', font: 'inherit' }}>
        <Box component="span" sx={{ flex: 'none', width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', border: '1px solid', fontWeight: 800, ...(hecha ? { bgcolor: 'primary.main', borderColor: 'primary.main', color: 'primary.contrastText' } : { bgcolor: 'background.paper', borderColor: 'divider' }) }}>{hecha ? '✓' : n}</Box>
        <span>{children}</span>
      </ButtonBase>
    </li>
  );
}
// La tarjeta de un libro, un área o un curso: ícono grande, nombre, detalle y avance. Botón, enlace o (próximamente) nada
export function TarjetaLibro({ icono, titulo, lineas, avance, datos, href, apagada = false }: { icono: string; titulo: ReactNode; lineas: ReactNode[]; avance?: number; datos?: Record<string, string>; href?: string; apagada?: boolean }) {
  const cuerpo = (
    <>
      <Box component="span" sx={{ fontSize: 32, lineHeight: 1 }}>{icono}</Box>
      <Box component="span" sx={{ flex: 1, display: 'grid', gap: '4px', '& small': { color: 'text.secondary', fontSize: 14 }, '& [role=progressbar]': { m: 0 } }}>
        <b>{titulo}</b>{lineas.map((x, i) => <small key={i}>{x}</small>)}
        {avance != null ? <Avance parte={avance} /> : null}
      </Box>
    </>
  );
  const sx = { display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', textAlign: 'left', color: 'text.primary', font: 'inherit', textDecoration: 'none', mb: '14px', ...(apagada ? { opacity: 0.6 } : null) };
  if (apagada) return <Card sx={sx}>{cuerpo}</Card>;
  return <Card component={ButtonBase as unknown as 'button'} {...(href ? { href } : null)} {...datos} sx={sx}>{cuerpo}</Card>;
}
