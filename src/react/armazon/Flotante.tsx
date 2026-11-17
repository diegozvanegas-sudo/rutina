// Cronómetro flotante: el temporizador en curso (descanso del gym, tiempo de un hábito) abajo, sobre cualquier
// pantalla. La caja #flotante (posición y fondo) sigue en index.html y armazon/estilosArmazon.ts; aquí lo de adentro, que corre con su
// propio reloj de medio segundo. Las reglas son las de temporizador.js (t-sumar, t-parar en main.js).
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { reloj } from '../../fechas.js';
import { restante } from '../../temporizador.js';
import { usarEstado } from '../usarEstado';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const BOTON = { minHeight: 44, minWidth: 44, p: '8px 12px', flex: 'none' };

export default function Flotante() {
  const a = (usarEstado() as Fin).activo as Fin, [, latir] = useState(0);
  // La caja se esconde sin nada en curso
  useEffect(() => { const caja = document.getElementById('flotante'); if (caja) caja.hidden = !a; }, [a]);
  useEffect(() => {
    if (!a) return;
    const t = setInterval(() => latir((n) => n + 1), 500);
    return () => clearInterval(t);
  }, [a]);
  if (!a) return null;
  const queda = restante() as number, avance = Math.max(0, Math.min(100, 100 - (queda / a.total) * 100));
  return (
    <>
      <Box sx={{ flex: 1, minWidth: 0, display: 'grid' }}>
        <Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{a.tipo === 'descanso' ? 'Descanso' : 'En curso'}</Box>
        <Box component="b" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.nombre}</Box>
      </Box>
      <Box component="span" sx={{ fontSize: 30, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: 'primary.main' }}>{reloj(queda)}</Box>
      {a.tipo === 'descanso' ? <Button color="secondary" data-accion="t-sumar" sx={BOTON}>+30 s</Button> : null}
      <Button color="secondary" data-accion="t-parar" aria-label="Terminar" sx={BOTON}>✕</Button>
      <Box component="span" aria-hidden="true" sx={{ position: 'absolute', left: 0, bottom: 0, height: 4, bgcolor: 'primary.main', width: avance + '%' }} />
    </>
  );
}
