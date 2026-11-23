// Los avisos de arriba de cada pantalla: "Estás viendo la app como …" (el admin en Ver como) y los recordatorios
// diarios que tocan hoy con su "✓ Listo". Se pintan encima de toda pantalla de React (react/montar.js). Las reglas son
// las de siempre: adm-ver-salir (vistas/administrar.js), rec-hoy y rec-gestionar (vistas/recordatorios.js).
import { Box, Button } from '@mui/material';
import { viendoComo } from '../../permisos.js';
import { diariosDeHoy } from '../../vistas/recordatorios.js';
import { iso } from '../../fechas.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { modoSesion } from '../armazon.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const CAJA = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', mb: '10px', p: '10px 12px', borderRadius: '10px', border: '1px solid' };

export default function Avisos() {
  usarEstado();
  if (modoSesion()) return null; // sin sesión o bloqueada no hay avisos
  const como = viendoComo() as string | null, diarios = diariosDeHoy() as Fin[], hoy = iso();
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
        <Box key={x.id} sx={{ ...CAJA, flexWrap: 'wrap', bgcolor: tokens.amarilloFondo, borderColor: tokens.amarillo }}>
          <Box component="span" sx={{ display: 'grid', minWidth: 0, flex: '1 1 200px' }}>
            <span>{x.icono} <b>{x.nombre}</b></span>
            {x.detalle ? <Box component="small" sx={{ color: 'text.secondary' }}>{x.detalle}</Box> : null}
          </Box>
          {/* En el celular: el nombre arriba y fecha, Gestionar y Listo en una fila debajo */}
          <Box data-aviso-rec={x.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', flex: { xs: '1 1 100%', sm: 'none' } }}>
            <Box component="input" type="date" name="fecha" defaultValue={hoy} max={hoy} aria-label={'Fecha en que se hizo: ' + x.nombre} title="Fecha en que se hizo"
              sx={{ height: 40, px: '8px', minWidth: 0, width: { xs: 'auto', sm: 150 }, flex: { xs: '1 1 auto', sm: 'none' }, borderRadius: '8px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary', font: 'inherit', colorScheme: 'inherit' }} />
            <Button color="secondary" data-accion="rec-gestionar" data-id={x.id} sx={{ minHeight: 40, flex: 'none', whiteSpace: 'nowrap', px: '12px' }}>Gestionar</Button>
            <Button data-accion="rec-hoy" data-id={x.id} sx={{ minHeight: 40, flex: 'none', whiteSpace: 'nowrap', px: '12px' }}>✓ Listo</Button>
          </Box>
        </Box>
      ))}
    </>
  );
}
