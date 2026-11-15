// Lista de renglones "nombre a la izquierda · valor a la derecha", con una línea entre renglones (la .lista-pesos de antes)
import type { ReactNode } from 'react';
import { Box } from '@mui/material';

export type Par = { id: string | number; nombre: ReactNode; valor: ReactNode };

export function ListaPares({ pares }: { pares: Par[] }) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: '4px' }}>
      {pares.map((x) => (
        <Box component="li" key={x.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', py: '6px', borderBottom: '1px solid', borderColor: 'divider' }}>
          <span>{x.nombre}</span>
          {typeof x.valor === 'string' || typeof x.valor === 'number' ? <b>{x.valor}</b> : x.valor}
        </Box>
      ))}
    </Box>
  );
}
