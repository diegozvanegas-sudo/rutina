// Piezas que comparten las pestañas de 💰 Finanzas: campos que guardan al salir (por la ruta del dato), los controles
// de una lista (subir, bajar, borrar), la etiqueta de estado y la tarjeta de un elemento que se edita.
// Los campos usan las acciones de siempre: "fin-pesos" (dinero) y "ed" (texto, número, lista), de src/vistas/*.js
import type { ReactNode } from 'react';
import { Box, Card, IconButton } from '@mui/material';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { Campo, CampoLista } from '../ui/Campo';

export type Opcion = { id: string; nombre: string; icono?: string };

export const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
export const FILA_BOTONES = { display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' };
export const GRANDE = { minHeight: 56, fontSize: 17, mt: '8px', mb: '14px' };
const COLOR_ESTADO: Record<string, { bgcolor: string; color: string }> = {
  pagado: { bgcolor: tokens.brandSoft, color: tokens.brand }, pronto: { bgcolor: tokens.amarilloFondo, color: tokens.amarillo },
  vencido: { bgcolor: tokens.rojoFondo, color: tokens.rojoSuave }, pendiente: { bgcolor: tokens.surface2, color: tokens.muted },
};

// Campo de dinero que guarda al salir: acepta "25.000", "25000", "25k", "1,5M"
export const CampoPesos = ({ titulo, ruta, valor }: { titulo: string; ruta: string; valor?: number }) => (
  <Campo etiqueta={titulo} inputMode="numeric" data-pesos="" data-cambio="fin-pesos" data-ruta={ruta} defaultValue={valor ? Math.round(valor).toLocaleString('es-CO') : ''} placeholder="$ 0" />
);
export const CampoTexto = ({ titulo, ruta, valor, max }: { titulo: string; ruta: string; valor?: string; max?: number }) => (
  <Campo etiqueta={titulo} data-cambio="ed" data-ruta={ruta} defaultValue={valor ?? ''} maxLength={max} />
);
export const CampoNumero = ({ titulo, ruta, valor }: { titulo: string; ruta: string; valor?: number | string }) => (
  <Campo etiqueta={titulo} inputMode="decimal" data-cambio="ed" data-tipo="num" data-ruta={ruta} defaultValue={valor ?? ''} />
);
export const CampoFecha = ({ titulo, ruta, valor, min }: { titulo: string; ruta: string; valor?: string; min?: string }) => (
  <Campo etiqueta={titulo} type="date" data-cambio="ed" data-ruta={ruta} defaultValue={valor || ''} min={min} />
);
export const Selector = ({ titulo, ruta, valor, opciones }: { titulo: string; ruta: string; valor?: string; opciones: Opcion[] }) => (
  <CampoLista etiqueta={titulo} data-cambio="ed" data-ruta={ruta} defaultValue={valor || ''} opciones={opciones.map((o) => [o.id, (o.icono ? o.icono + ' ' : '') + o.nombre])} />
);

// Subir, bajar y borrar un elemento de una lista (categorías, fijos, metas, deudas, préstamos)
export function Controles({ lista, i, nombre, total }: { lista: string; i: number; nombre: string; total: number }) {
  const sx = { bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', fontSize: 18, '&.Mui-disabled': { opacity: 0.3, color: 'text.primary' } };
  return (
    <Box component="span" sx={{ display: 'flex', gap: '4px', flex: 'none' }}>
      <IconButton aria-label="Subir" disabled={i === 0} onClick={() => accion('ed-mover', { lista, i, n: -1 })} sx={sx}>↑</IconButton>
      <IconButton aria-label="Bajar" disabled={i >= total - 1} onClick={() => accion('ed-mover', { lista, i, n: 1 })} sx={sx}>↓</IconButton>
      <IconButton aria-label="Borrar" onClick={() => accion('ed-borrar', { lista, i, nombre })} sx={{ ...sx, color: 'error.main' }}>🗑</IconButton>
    </Box>
  );
}
export const Estado = ({ estado, children }: { estado: string; children: ReactNode }) => (
  <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, ml: '6px', whiteSpace: 'nowrap', ...(COLOR_ESTADO[estado] || COLOR_ESTADO.pendiente) }}>{children}</Box>
);
// Tarjeta de un elemento que se edita (una categoría, un fijo, una meta, una deuda)
export const Item = ({ children }: { children: ReactNode }) => <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '10px' }}>{children}</Card>;
export const Aviso = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, my: '8px' }}>{children}</Box>;
export const Chico = ({ children }: { children: ReactNode }) => <Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{children}</Box>;
// "monto + botones" en una fila
export const Aportar = ({ children, columnas = '1fr auto auto' }: { children: ReactNode; columnas?: string }) => <Box sx={{ display: 'grid', gridTemplateColumns: columnas, gap: '8px' }}>{children}</Box>;
