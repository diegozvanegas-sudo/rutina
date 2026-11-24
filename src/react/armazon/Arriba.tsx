// La barra de arriba del celular, al lado de ☰: 🔎 Buscar y el estado de lo guardado (☁️ con un punto: verde guardado en
// la nube, amarillo subiendo o por subir, gris sin conexión, rojo error). Tocar la nube abre Ajustes, donde está el detalle.
// En el computador no se ve (la barra de arriba es solo del celular); allí 🔎 y la nube están en el menú lateral
import { Box, ButtonBase } from '@mui/material';
import { datosLateral } from '../armazon.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
export const COLOR_GUARDADO: Record<string, string> = { 'al-dia': tokens.brand, pendiente: tokens.amarillo, sincronizando: tokens.amarillo, 'sin-conexion': tokens.muted, error: tokens.rojo, 'no-configurada': tokens.muted };
const BOTON = { minWidth: 44, minHeight: 44, borderRadius: '10px', color: 'text.primary', '&:hover': { bgcolor: tokens.surface2 }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } };

export default function Arriba() {
  usarEstado();
  const d = datosLateral() as Fin;
  if (!d) return null;
  const n = d.nube, texto = n.estado === 'no-configurada' ? 'Sin nube: se guarda solo en este equipo' : n.texto;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px', ml: 'auto', mr: '6px' }}>
      <ButtonBase component="a" href="#ajustes" data-t="nube-arriba" data-estado={n.estado} aria-label={texto} title={n.titulo || texto} sx={{ ...BOTON, position: 'relative', fontSize: 20, textDecoration: 'none' }}>
        <span aria-hidden="true">☁️</span>
        <Box component="span" aria-hidden="true" sx={{ position: 'absolute', right: 6, bottom: 9, width: 11, height: 11, borderRadius: '50%', bgcolor: COLOR_GUARDADO[n.estado] || tokens.muted, border: '2px solid', borderColor: 'background.default',
          animation: n.estado === 'sincronizando' ? 'latido 1s ease-in-out infinite' : 'none', '@keyframes latido': { '50%': { opacity: 0.35 } }, '@media (prefers-reduced-motion: reduce)': { animation: 'none' } }} />
      </ButtonBase>
      <ButtonBase data-accion="buscar" aria-label="Buscar en la app" title="Buscar" sx={{ ...BOTON, fontSize: 20 }}><span aria-hidden="true">🔎</span></ButtonBase>
    </Box>
  );
}
