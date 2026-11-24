// Lo que se ve donde todavía no hay nada: un ícono, qué va aquí y el botón para empezar (en vez de un "no hay" sin salida)
import type { ReactNode } from 'react';
import { Box } from '@mui/material';

export function Vacio({ icono, children, accion }: { icono: string; children: ReactNode; accion?: ReactNode }) {
  return (
    <Box data-t="vacio" sx={{ display: 'grid', justifyItems: 'center', gap: '8px', textAlign: 'center', p: '18px 14px', my: '8px', border: '1px dashed', borderColor: 'divider', borderRadius: '14px' }}>
      <Box component="span" aria-hidden="true" sx={{ fontSize: 34, lineHeight: 1 }}>{icono}</Box>
      <Box component="p" sx={{ m: 0, color: 'text.secondary', fontSize: 15, maxWidth: 420 }}>{children}</Box>
      {accion}
    </Box>
  );
}
