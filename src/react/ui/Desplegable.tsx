// Un renglón que se abre para mostrar más (el <details> de antes): empieza cerrado y no recuerda cómo quedó
import { useState, type ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { Flecha } from './Flecha';

export function Desplegable({ titulo, children, sx }: { titulo: ReactNode; children: ReactNode; sx?: SxProps<Theme> }) {
  const [abierto, poner] = useState(false);
  return (
    <Accordion expanded={abierto} onChange={(_, v) => poner(v)} sx={sx}>
      <AccordionSummary><Flecha abierta={abierto} /><span>{titulo}</span></AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
