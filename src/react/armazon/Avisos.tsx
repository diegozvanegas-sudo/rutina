// Los avisos de arriba de cada pantalla: "Estás viendo la app como …" (el admin en Ver como) y los recordatorios
// diarios que tocan hoy con su "✓ Listo". Se pintan encima de toda pantalla de React (react/montar.js). Las reglas son
// las de siempre: adm-ver-salir (vistas/administrar.js) y rec-hoy (vistas/recordatorios.js).
import { Box, Button } from '@mui/material';
import { viendoComo } from '../../permisos.js';
import { diariosDeHoy } from '../../vistas/recordatorios.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const CAJA = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', mb: '10px', p: '10px 12px', borderRadius: '10px', border: '1px solid' };

export default function Avisos() {
  usarEstado();
  const como = viendoComo() as string | null, diarios = diariosDeHoy() as Fin[];
  if (!como && !diarios.length) return null;
  return (
    <>
      {como ? (
        <Box sx={{ ...CAJA, flexWrap: 'wrap', gap: '8px', mb: '12px', bgcolor: tokens.verComoFondo, borderColor: tokens.azul, color: 'text.primary' }}>
          <span>👁 Estás viendo la app como <b>{como}</b></span>
          <Button color="secondary" data-accion="adm-ver-salir">Volver a mi vista</Button>
        </Box>
      ) : null}
      {diarios.map((x) => (
        <Box key={x.id} sx={{ ...CAJA, bgcolor: tokens.amarilloFondo, borderColor: tokens.amarillo }}>
          <Box component="span" sx={{ display: 'grid', minWidth: 0 }}>
            <span>{x.icono} <b>{x.nombre}</b></span>
            {x.detalle ? <Box component="small" sx={{ color: 'text.secondary' }}>{x.detalle}</Box> : null}
          </Box>
          <Button data-accion="rec-hoy" data-id={x.id} sx={{ flex: 'none' }}>✓ Listo</Button>
        </Box>
      ))}
    </>
  );
}
