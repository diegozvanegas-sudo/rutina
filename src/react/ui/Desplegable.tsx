// Un renglón que se abre para mostrar más (el <details> de antes): empieza cerrado y no recuerda cómo quedó
import { useState, type ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { Flecha } from './Flecha';

/** perezoso: lo de adentro se dibuja la primera vez que se abre (un gráfico o un texto largo que casi nunca se mira) */
export function Desplegable({ titulo, children, sx, abiertoAlInicio = false, perezoso = false }: { titulo: ReactNode; children: ReactNode; sx?: SxProps<Theme>; abiertoAlInicio?: boolean; perezoso?: boolean }) {
  const [abierto, poner] = useState(abiertoAlInicio), [visto, ponerVisto] = useState(abiertoAlInicio);
  if (abierto && !visto) ponerVisto(true);
  return (
    <Accordion expanded={abierto} onChange={(_, v) => poner(v)} sx={sx}>
      <AccordionSummary><Flecha abierta={abierto} /><span>{titulo}</span></AccordionSummary>
      <AccordionDetails>{!perezoso || visto ? children : null}</AccordionDetails>
    </Accordion>
  );
}
