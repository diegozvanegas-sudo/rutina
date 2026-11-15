// Lo que envuelve a toda pantalla de React: el tema de Material UI con los colores de la app.
// No se usa CssBaseline: cambiaría los estilos de las pantallas que aún no se migran
import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { tema } from './tema';

export default function Proveedor({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={tema}>{children}</ThemeProvider>;
}
