// 📱 Barra de abajo del celular: 4 secciones al alcance del pulgar y «☰ Más» (abre el menú con todo lo demás). Cuáles van
// lo arma main.js (src/barra-abajo.js, config.barra.abajo); se elige o se apaga en Ajustes → 🎨 Cómo se ve. La caja #abajo
// (posición, alto y cuándo se ve: solo en el celular y no mientras escribes) está en armazon/estilosArmazon.ts
import { Box, ButtonBase } from '@mui/material';
import { datosLateral } from '../armazon.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const CASILLA = {
  flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', height: 60, px: '2px',
  borderRadius: '12px', font: 'inherit', fontSize: 11.5, fontWeight: 600, textDecoration: 'none', color: 'text.secondary', position: 'relative',
  '&.Mui-focusVisible, &:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' },
  '& .ic': { fontSize: 22, lineHeight: 1 }, '& .nom': { maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
};
const Punto = ({ n }: { n: number }) => (
  <Box component="span" aria-label={n + ' pendientes'} sx={{ position: 'absolute', top: 2, left: '50%', ml: '8px', minWidth: 18, height: 18, px: '4px', borderRadius: 999, bgcolor: tokens.rojo, color: '#fff', fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{n}</Box>
);

export default function Abajo() {
  usarEstado();
  const d = datosLateral() as Fin;
  if (!d || d.sinAbajo) return null;
  // Lo que está en el menú y no en la barra: si tiene pendientes, «Más» lo cuenta
  const enBarra = new Set((d.abajo as Fin[]).map((x) => x.k)), fuera = enBarra.has('recordatorios') ? 0 : d.avisos;
  return (
    <>
      {(d.abajo as Fin[]).map((x) => (
        <ButtonBase key={x.k} component="a" href={'#' + x.k} data-t="abajo" data-k={x.k} aria-current={x.actual ? 'page' : undefined}
          sx={[CASILLA, x.actual ? { color: 'primary.main', bgcolor: tokens.brandSoft } : null]}>
          <span className="ic" aria-hidden="true">{x.icono}</span><span className="nom">{x.nombre}</span>
          {x.insignia ? <Punto n={x.insignia} /> : null}
        </ButtonBase>
      ))}
      <ButtonBase data-accion="menu" data-t="abajo-mas" aria-controls="lateral" aria-label="Más secciones (abre el menú)" sx={CASILLA}>
        <span className="ic" aria-hidden="true">☰</span><span className="nom">Más</span>
        {fuera ? <Punto n={fuera} /> : null}
      </ButtonBase>
    </>
  );
}
