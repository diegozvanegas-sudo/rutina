// 🎨 La marca de un entrenador arriba de la barra lateral (y su vista previa en 🧑‍💼 Panel → Mi marca): logo o iniciales
// en su color, el nombre del negocio y una línea debajo (por ejemplo "Tu entrenador" o tu correo)
import { Box } from '@mui/material';
import { tintaSobre, iniciales } from '../../marca.js';
import { tokens } from '../tema';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Marca = { negocio?: string; color?: string | null; logo?: string | null } | null;

export function Logo({ marca, tam = 40 }: { marca: Marca; tam?: number }) {
  const color = (marca && marca.color) || tokens.brandSoft, tinta = (marca && marca.color && tintaSobre(marca.color)) || tokens.brand;
  if (marca && marca.logo) return <Box component="img" src={marca.logo} alt="" sx={{ width: tam, height: tam, borderRadius: '10px', objectFit: 'contain', bgcolor: '#fff', flex: 'none' }} />;
  return <Box component="span" aria-hidden="true" sx={{ width: tam, height: tam, borderRadius: '10px', bgcolor: color, color: tinta, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: tam * 0.4, flex: 'none' }}>{iniciales(marca && marca.negocio)}</Box>;
}

export function MarcaCabecera({ marca, sub, chica = false }: { marca: Marca; sub?: string; chica?: boolean }) {
  return (
    <Box data-t="marca" sx={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, justifyContent: chica ? 'center' : undefined }} title={chica ? (marca && marca.negocio) || sub : undefined}>
      <Logo marca={marca} tam={chica ? 34 : 40} />
      {chica ? null : (
        <Box sx={{ display: 'grid', minWidth: 0, lineHeight: 1.2 }}>
          <Box component="b" sx={{ fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(marca && marca.negocio) || 'Tu entrenador'}</Box>
          {sub ? <Box component="small" sx={{ color: 'text.secondary', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</Box> : null}
        </Box>
      )}
    </Box>
  );
}
