// Los avisos de arriba de cada pantalla: "Estás viendo la app como …" (el admin en Ver como) y los recordatorios
// diarios que tocan hoy con su "✓ Listo". Se pintan encima de toda pantalla de React (react/montar.js). Las reglas son
// las de siempre: adm-ver-salir (vistas/administrar.js), rec-hoy y rec-gestionar (vistas/recordatorios.js).
import { useState } from 'react';
import { Box, Button, ButtonBase, Collapse } from '@mui/material';
import { leerPlegadas, alternarPlegada } from '../../plegables.js';
import { Flecha } from '../ui/Flecha';
import { viendoComo } from '../../permisos.js';
import { diariosDeHoy } from '../../vistas/recordatorios.js';
import { iso } from '../../fechas.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { modoSesion } from '../armazon.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
// Si están cerrados queda una barra con cuántos son y sus íconos: siempre se ven, solo ocupan una fila (se recuerda en este equipo)
const PLEGADA = 'avisos|Recordatorios de arriba';
const CAJA = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', mb: '10px', p: '10px 12px', borderRadius: '10px', border: '1px solid' };

export default function Avisos() {
  usarEstado();
  const [, repintar] = useState(0);
  if (modoSesion()) return null; // sin sesión o bloqueada no hay avisos
  const como = viendoComo() as string | null, diarios = diariosDeHoy() as Fin[], hoy = iso();
  if (!como && !diarios.length) return null;
  const cerrados = leerPlegadas().has(PLEGADA);
  const alternar = () => { alternarPlegada(PLEGADA); repintar((n) => n + 1); };
  return (
    <>
      {como ? (
        <Box sx={{ ...CAJA, flexWrap: 'wrap', gap: '8px', mb: '12px', bgcolor: tokens.verComoFondo, borderColor: tokens.azul, color: 'text.primary' }}>
          <span>👁 Estás viendo la app como <b>{como}</b></span>
          <Button color="secondary" data-accion="adm-ver-salir">Volver a mi vista</Button>
        </Box>
      ) : null}
      {diarios.length ? (
        <ButtonBase data-t="avisos-plegar" aria-expanded={!cerrados} onClick={alternar}
          sx={{ ...CAJA, width: '100%', justifyContent: 'flex-start', gap: '6px', mb: cerrados ? '10px' : '6px', minHeight: 44, py: '6px', font: 'inherit', textAlign: 'left',
            bgcolor: tokens.amarilloFondo, borderColor: tokens.amarillo, color: 'text.primary', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
          <Flecha abierta={!cerrados} />
          <Box component="span" sx={{ flex: 'none' }}>🔔 <b>{diarios.length} {diarios.length === 1 ? 'recordatorio' : 'recordatorios'}</b></Box>
          {cerrados ? <Box component="span" sx={{ minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{diarios.map((x) => x.icono).join(' ')}</Box> : <Box component="span" sx={{ flex: 1 }} />}
          <Box component="small" sx={{ color: 'text.secondary', flex: 'none' }}>{cerrados ? 'Ver' : 'Ocultar'}</Box>
        </ButtonBase>
      ) : null}
      <Collapse in={!cerrados} timeout={150} unmountOnExit>
      {diarios.map((x) => (
        <Box key={x.id} data-deslizar="[data-accion=rec-hoy]" data-deslizar-izq="[data-accion=rec-gestionar]" sx={{ ...CAJA, flexWrap: 'wrap', bgcolor: tokens.amarilloFondo, borderColor: tokens.amarillo }}>
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
      </Collapse>
    </>
  );
}
