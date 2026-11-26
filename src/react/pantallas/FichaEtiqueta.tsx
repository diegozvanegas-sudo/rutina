// 📋 Ficha de un producto de etiqueta (src/datos_etiquetas.js): qué es en tu plan, sodio, azúcar, fibra, sellos, si la
// etiqueta cuadra y lo del empaque. Los textos salen de src/etiqueta-info.js. Se abre y se cierra (un renglón por tema)
import { Box, Button } from '@mui/material';
import { fichaEtiqueta } from '../../etiqueta-info.js';
import { Desplegable } from '../ui/Desplegable';
import { tokens } from '../tema';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;

export function FichaEtiqueta({ datos, abierta = false, agregar }: { datos: Fin; abierta?: boolean; agregar?: (() => void) | null }) {
  const f: Fin = fichaEtiqueta(datos);
  if (!f) return null;
  return (
    <Desplegable abiertoAlInicio={abierta} titulo={<><b>{f.titulo}</b> <Box component="small" sx={{ color: 'text.secondary' }}>· qué quiere decir la etiqueta</Box></>}
      sx={{ bgcolor: tokens.surface2, borderRadius: '12px !important', '&:before': { display: 'none' } }}>
      <Box data-t="ficha-etiqueta" sx={{ display: 'grid', gap: '8px' }}>
        <Box component="small" sx={{ color: 'text.secondary' }}>{f.marca} · {f.resumen}</Box>
        {f.puntos.map((x: Fin, i: number) => (
          <Box key={i} data-k={x.k} sx={{ display: 'grid', gridTemplateColumns: '26px minmax(0, 1fr)', gap: '6px', alignItems: 'start' }}>
            <Box component="span" aria-hidden="true" sx={{ fontSize: 18, lineHeight: '22px', textAlign: 'center' }}>{x.icono}</Box>
            <Box sx={{ minWidth: 0 }}>
              <Box component="b" sx={{ display: 'block' }}>{x.titulo}</Box>
              <Box component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>{x.texto}</Box>
            </Box>
          </Box>
        ))}
        <Box component="small" sx={{ color: 'text.secondary', fontSize: 12 }}>Es informativo, no consejo médico: con presión alta o un problema de riñón, cuánto sodio comer lo dice tu médico.</Box>
        {agregar ? <Button color="secondary" data-t="etiqueta-agregar" onClick={agregar} sx={{ justifySelf: 'start' }}>＋ Agregar a 🥚 Alimentos</Button> : null}
      </Box>
    </Desplegable>
  );
}
