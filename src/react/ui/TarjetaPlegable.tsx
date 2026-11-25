// Tarjeta con título que se abre y se cierra tocando el título. Recuerda en este equipo cuáles están cerradas,
// con las mismas claves de las pantallas de antes (src/plegables.js): lo que el usuario ya tenía cerrado sigue cerrado
import { useState, type ReactNode } from 'react';
import { Box, ButtonBase, Card, Collapse, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { leerPlegadas, alternarPlegada, basePlegable } from '../../plegables.js';
import { Flecha } from './Flecha';

type Props = {
  vista: string;
  /** El título como texto: con él se recuerda si está cerrada */
  clave: string;
  titulo: ReactNode;
  /** Lo que va a la derecha del título, en la misma fila */
  lado?: ReactNode;
  sx?: SxProps<Theme>;
  children: ReactNode;
  /** De inicio cerrada (una fila por tema): se recuerda cuando el usuario la abre */
  cerradaAlInicio?: boolean;
};

export function TarjetaPlegable({ vista, clave, titulo, lado, sx, children, cerradaAlInicio = false }: Props) {
  const k = basePlegable(vista, clave), [, repintar] = useState(0);
  // Las cerradas de inicio guardan al revés: '+clave' = la abrió
  const marca = cerradaAlInicio ? '+' + k : k, marcada = leerPlegadas().has(marca);
  const cerrada = cerradaAlInicio ? !marcada : marcada;
  const alternar = () => { alternarPlegada(marca); repintar((n) => n + 1); };
  return (
    <Card component="section" data-t="tarjeta" data-plegable={k} data-estado={cerrada ? 'cerrada' : 'abierta'} sx={[{ mb: '14px' }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <Typography component="h2" variant="h2" sx={{ flex: 1, minWidth: 0, m: 0 }}>
          <ButtonBase data-t="plegar" aria-expanded={!cerrada} onClick={alternar}
            sx={{ width: '100%', justifyContent: 'flex-start', gap: '4px', font: 'inherit', color: 'inherit', textAlign: 'left', borderRadius: '8px', minHeight: 44, ml: '-6px', pl: '2px', pr: '6px',
              '&:hover .flecha': { color: 'text.primary' }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
            <Flecha abierta={!cerrada} />
            <span>{titulo}</span>
          </ButtonBase>
        </Typography>
        {lado}
      </Box>
      <Collapse in={!cerrada} timeout={150}>
        <Box sx={{ pt: '6px' }}>{children}</Box>
      </Collapse>
    </Card>
  );
}
