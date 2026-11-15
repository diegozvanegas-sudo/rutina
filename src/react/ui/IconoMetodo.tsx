// Ícono de un método de pago (💰 Finanzas): un dibujo propio para cada uno de los de siempre, para que no se confundan
// (antes Nequi y Daviplata eran el mismo 📲). Un método que agregaste tú sigue con el emoji que le pusiste.
import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { tokens } from '../tema';

const Tarjeta = ({ color, credito = false }: { color: string; credito?: boolean }) => (
  <>
    <rect x="2" y="5" width="20" height="14" rx="3" fill={color} />
    <rect x="2" y="8.5" width="20" height="2.6" fill={tokens.bg} opacity=".55" />
    <rect x="5" y="13.2" width="4.5" height="3.2" rx=".8" fill={tokens.amarillo} stroke={tokens.bg} strokeWidth=".6" />
    {credito
      ? <path d="M15 13.2a2.6 2.6 0 0 1 0 3.4M17.2 12.4a4 4 0 0 1 0 5" fill="none" stroke={tokens.bg} strokeWidth="1.2" strokeLinecap="round" />
      : <rect x="13" y="14.2" width="6" height="1.4" rx=".7" fill={tokens.bg} opacity=".55" />}
  </>
);
// Cuadro redondeado con una letra (las billeteras del celular)
const Letra = ({ fondo, color, letra }: { fondo: string; color: string; letra: string }) => (
  <>
    <rect x="2" y="2" width="20" height="20" rx="6" fill={fondo} />
    <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif" fill={color}>{letra}</text>
  </>
);

const DIBUJOS: Record<string, () => ReactNode> = {
  efectivo: () => (
    <>
      <rect x="1.5" y="6" width="21" height="12" rx="2" fill={tokens.verde} />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke={tokens.brandInk} strokeWidth="1.6" />
      <circle cx="5.5" cy="12" r="1" fill={tokens.brandInk} /><circle cx="18.5" cy="12" r="1" fill={tokens.brandInk} />
    </>
  ),
  debito: () => <Tarjeta color={tokens.azul} />,
  credito: () => <Tarjeta color={tokens.amarillo} credito />,
  nequi: () => <Letra fondo={tokens.nequi} color={tokens.nequiInk} letra="N" />,
  daviplata: () => <Letra fondo={tokens.daviplata} color={tokens.ink} letra="D" />,
  transferencia: () => (
    <>
      <circle cx="12" cy="12" r="10" fill={tokens.surface2} stroke={tokens.azul} strokeWidth="1.4" />
      <path d="M7 9.5h9.5m-2.5-2.5 2.5 2.5-2.5 2.5M17 14.5H7.5m2.5 2.5L7.5 14.5 10 12" fill="none" stroke={tokens.azul} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

/** El ícono del método (id) o, si no es de los de siempre, su emoji */
export function IconoMetodo({ m, tam = 18 }: { m: { id?: string; icono?: string }; tam?: number }) {
  const dibujo = m.id ? DIBUJOS[m.id] : null;
  if (!dibujo) return m.icono ? <span aria-hidden="true">{m.icono}</span> : null;
  return (
    <Box component="svg" viewBox="0 0 24 24" width={tam} height={tam} aria-hidden="true" sx={{ display: 'inline-block', verticalAlign: '-0.2em', flex: 'none' }}>
      {dibujo()}
    </Box>
  );
}
/** Ícono y nombre del método, juntos */
export const NombreMetodo = ({ m }: { m: { id?: string; icono?: string; nombre: string } }) => (
  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><IconoMetodo m={m} />{m.nombre}</Box>
);
