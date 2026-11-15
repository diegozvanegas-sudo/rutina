// Textos que se repiten en todas las pantallas, con los tamaños de siempre
import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type P = { children: ReactNode; sx?: SxProps<Theme> };
const con = (base: object, sx?: SxProps<Theme>) => [base, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>;

/** El título de la pantalla */
export const TituloPantalla = ({ children, sx }: P) => <Typography variant="h1" sx={con({ m: '4px 0 12px' }, sx)}>{children}</Typography>;
/** Párrafo normal */
export const Parrafo = ({ children, sx }: P) => <Typography sx={con({ my: '8px' }, sx)}>{children}</Typography>;
/** Nota gris y pequeña (la .nota-corta de antes) */
export const Nota = ({ children, sx }: P) => <Typography variant="body2" sx={con({ color: 'text.secondary', my: '6px' }, sx)}>{children}</Typography>;
/** Renglón pequeño y gris dentro de una fila */
export const Detalle = ({ children, sx }: P) => <Typography component="small" sx={con({ display: 'block', fontSize: 13, color: 'text.secondary' }, sx)}>{children}</Typography>;
