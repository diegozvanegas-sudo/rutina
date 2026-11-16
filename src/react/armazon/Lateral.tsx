// Menú lateral: fijo a un lado en el computador y, en el celular, entra desde la derecha con ☰ (eso, el velo y la
// posición del contenedor #lateral siguen en main.js y estilos.css). Aquí: la marca con "solo íconos", las secciones,
// organizar (arrastrar del asa ⠿ o flechas ↑ ↓, esconder con 👁), el resumen, el estado de la nube, la cuenta y el
// borde para cambiar el ancho. Los datos los arma main.js (react/armazon.js) y las reglas son sus acciones barra-….
import { useState, type PointerEvent as EventoPuntero, type ReactNode } from 'react';
import { Box, Button, ButtonBase, useMediaQuery } from '@mui/material';
import { datosLateral } from '../armazon.js';
import { tokens } from '../tema';
import { accion } from '../acciones';
import { usarEstado } from '../usarEstado';
import { Ordenable } from '../ui/Ordenable';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const ANCHO_MIN = 200, ANCHO_MAX = 420;
const COLOR_NUBE: Record<string, string> = { 'al-dia': tokens.brand, error: tokens.rojo, pendiente: tokens.amarillo, sincronizando: tokens.amarillo };
const SUAVE = {
  justifyContent: 'flex-start', color: 'text.secondary', font: 'inherit', fontSize: 14, textAlign: 'left', p: '8px 6px', minHeight: 44, borderRadius: '10px',
  '&:hover': { bgcolor: tokens.surface2, color: 'text.primary' }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' },
};
const Barrita = ({ parte }: { parte: number }) => {
  const pct = Math.round(Math.max(0, Math.min(1, parte || 0)) * 100);
  return (
    <Box role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} sx={{ height: 8, bgcolor: tokens.surface2, borderRadius: 999, overflow: 'hidden', mb: '2px' }}>
      <Box sx={{ width: pct + '%', height: '100%', bgcolor: 'primary.main', borderRadius: 999, transition: 'width .3s' }} />
    </Box>
  );
};
const Insignia = ({ n, sola }: { n: number; sola: boolean }) => (
  <Box component="span" aria-label={n + ' pendientes'} sx={[{ ml: 'auto', minWidth: 22, height: 22, px: '6px', borderRadius: 999, bgcolor: tokens.rojo, color: '#fff', fontSize: 12, fontWeight: 800, display: 'grid', placeItems: 'center' },
    sola ? { position: 'absolute', top: 0, right: 0, m: 0 } : null]}>{n}</Box>
);

// El borde del menú: arrastrarlo cambia el ancho (se ve mientras se arrastra y se guarda al soltar)
function Borde({ lado }: { lado: string }) {
  const [moviendo, ponerMoviendo] = useState(false);
  const empezar = (ev: EventoPuntero<HTMLElement>) => {
    if (ev.button !== 0) return;
    ev.preventDefault();
    let ancho = 0;
    const mover = (m: PointerEvent) => {
      ancho = Math.min(ANCHO_MAX, Math.max(ANCHO_MIN, Math.round(lado === 'izquierda' ? m.clientX : window.innerWidth - m.clientX)));
      document.documentElement.style.setProperty('--ancho-barra', ancho + 'px');
    };
    const fin = () => {
      document.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerup', fin);
      document.removeEventListener('pointercancel', fin);
      ponerMoviendo(false);
      if (ancho) accion('barra-ancho', { ancho });
    };
    ponerMoviendo(true);
    document.addEventListener('pointermove', mover);
    document.addEventListener('pointerup', fin);
    document.addEventListener('pointercancel', fin);
  };
  return (
    <Box title="Arrastra para cambiar el ancho" aria-hidden="true" onPointerDown={empezar}
      sx={{ position: 'fixed', top: 0, bottom: 0, width: 8, zIndex: 5, cursor: 'col-resize', touchAction: 'none', bgcolor: moviendo ? tokens.brandSoft : 'transparent', '&:hover': { bgcolor: tokens.brandSoft },
        ...(lado === 'izquierda' ? { left: 'calc(var(--ancho-barra, 260px) - 4px)' } : { right: 'calc(var(--ancho-barra, 260px) - 4px)' }) }} />
  );
}

function Organizar({ d, pc }: { d: Fin; pc: boolean }) {
  const filas = d.filas as Fin[];
  const soltar = (orden: number[], movido: number) => {
    const k = orden.indexOf(movido), sig = orden[k + 1];
    accion('barra-colocar', { id: filas[movido].k, antes: sig == null ? '' : filas[sig].k });
  };
  return (
    <>
      <Ordenable n={filas.length} clave={(i) => filas[i].k} alSoltar={soltar} sx={{ gap: '4px', gridTemplateColumns: 'minmax(0, 1fr)' }}>
        {(i, asa) => {
          const f = filas[i];
          return (
            <Box data-sec={f.k} sx={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: 48, p: '2px 4px', borderRadius: '12px', bgcolor: tokens.surface2, fontWeight: 600, opacity: f.apagado ? 0.5 : 1 }}>
              {asa(f.nombre, { minWidth: 40 })}
              <Box component="span" aria-hidden="true" sx={{ fontSize: 22, width: 28, textAlign: 'center' }}>{f.icono}</Box>
              <Box component="span" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.nombre}</Box>
              {f.fija ? null : (
                <ButtonBase data-accion="barra-ver" data-id={f.k} aria-pressed={!f.apagado} aria-label={'Mostrar ' + f.nombre + ' en el menú'}
                  sx={{ minWidth: 36, minHeight: 44, borderRadius: '10px', fontSize: 18, flex: 'none', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>{f.apagado ? '🙈' : '👁️'}</ButtonBase>
              )}
            </Box>
          );
        }}
      </Ordenable>
      <Box sx={{ display: 'grid', gap: '6px' }}>
        <Button data-accion="barra-organizar">✓ Listo</Button>
        <Button color="secondary" data-accion="barra-restablecer">↺ Como venía</Button>
        {pc ? <Button color="secondary" data-accion="barra-lado">⇄ Cambiar de lado</Button> : null}
      </Box>
    </>
  );
}

function Secciones({ d, chica }: { d: Fin; chica: boolean }) {
  return (
    <Box component="nav" aria-label="Secciones" sx={{ display: 'grid', gap: '4px' }}>
      {(d.enlaces as Fin[]).map((x) => (
        <Box component="a" key={x.k} href={'#' + x.k} title={x.nombre} aria-current={x.actual ? 'page' : undefined}
          sx={[{ display: 'flex', alignItems: 'center', gap: '14px', minHeight: { xs: 56, md: 0 }, p: '12px 14px', borderRadius: '12px', color: 'text.primary', textDecoration: 'none', fontWeight: 600, fontSize: { xs: 18, md: 16 },
            '&:hover': { bgcolor: tokens.surface2 }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } },
            x.actual ? { bgcolor: tokens.brandSoft, color: 'primary.main', '&:hover': { bgcolor: tokens.brandSoft } } : null,
            chica ? { position: 'relative', justifyContent: 'center', p: '10px', gap: 0 } : null]}>
          <Box component="span" aria-hidden="true" sx={{ fontSize: 22, width: 28, textAlign: 'center' }}>{x.icono}</Box>
          {chica ? null : <span>{x.nombre}</span>}
          {x.insignia ? <Insignia n={x.insignia} sola={chica} /> : null}
        </Box>
      ))}
    </Box>
  );
}

const Fila = ({ href, titulo, children }: { href: string; titulo: string; children: ReactNode }) => (
  <Box component="a" href={href} title={titulo} sx={{ display: 'block', p: '6px', borderRadius: '10px', color: 'text.primary', textDecoration: 'none', '&:hover': { bgcolor: tokens.surface2 } }}>{children}</Box>
);

export default function Lateral() {
  usarEstado();
  // En el celular "solo íconos" no aplica (el menú se abre a pantalla casi completa)
  const pc = useMediaQuery('(min-width:900px)'), d = datosLateral() as Fin;
  if (!d) return null;
  const chica = pc && d.compacta, hacia = (d.lado === 'izquierda') === !!d.compacta ? '»' : '«';
  const plegar = d.compacta ? 'Expandir el menú' : 'Dejar solo los íconos';
  return (
    <>
      {pc && !chica ? <Borde lado={d.lado} /> : null}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 18, justifyContent: chica ? 'center' : undefined }}>
        {chica ? null : <><Box component="span" aria-hidden="true" sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: tokens.brandSoft, display: 'grid', placeItems: 'center', fontSize: 18 }}>🏋️</Box><b>Rutina</b></>}
        {pc ? (
          <ButtonBase data-accion="barra-compacta" aria-pressed={!!d.compacta} aria-label={plegar} title={plegar}
            sx={{ ml: chica ? 0 : 'auto', minWidth: 44, minHeight: 44, borderRadius: '12px', fontSize: 20, color: 'text.primary', '&:hover': { bgcolor: tokens.surface2 }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>{hacia}</ButtonBase>
        ) : null}
      </Box>
      {d.organizando ? <Organizar d={d} pc={pc} /> : (
        <>
          <Secciones d={d} chica={chica} />
          {chica ? null : <ButtonBase data-accion="barra-organizar" sx={SUAVE}>✋ Organizar menú</ButtonBase>}
        </>
      )}
      {chica ? null : <ButtonBase data-accion="barra-resumen" aria-expanded={d.resumenAbierto} sx={SUAVE}>{d.resumenAbierto ? '▾' : '▸'} Resumen</ButtonBase>}
      {chica || !d.resumenAbierto ? null : (
        <Box sx={{ display: 'grid', gap: '6px', p: '8px', bgcolor: 'background.default', borderRadius: '14px', fontSize: 14 }}>
          {(d.resumen as Fin[]).map((r) => (
            <Fila key={r.href} href={r.href} titulo={r.titulo}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', mb: '6px' }}><span>{r.texto}</span><b>{r.valor}</b></Box>
              <Barrita parte={r.parte} />
            </Fila>
          ))}
        </Box>
      )}
      <Box component="a" href="#ajustes" title={d.nube.titulo} sx={{ display: 'block', fontSize: 13, color: COLOR_NUBE[d.nube.estado] || 'text.secondary', textDecoration: 'none', p: '4px 2px' }}>
        ☁️ {chica ? null : <span>{d.nube.texto}</span>}
      </Box>
      {/* Con sesión: quién está adentro y Salir, siempre a la vista (en el celular, al abrir ☰) */}
      {d.correo ? (
        <Box sx={{ position: 'sticky', bottom: -20, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: chica ? 'center' : 'space-between', gap: '8px', m: chica ? 'auto -8px -20px' : 'auto -16px -20px',
          p: chica ? '10px 8px 14px' : '10px 16px 14px', borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', fontSize: 13, color: 'text.secondary' }}>
          {chica ? null : <Box component="span" title={d.correo} sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>👤 {d.correo}</Box>}
          <ButtonBase data-accion="nube-salir" title="Cerrar sesión" aria-label={'Cerrar sesión de ' + d.correo}
            sx={{ ...SUAVE, flex: 'none', p: '8px 12px', color: 'text.primary', border: '1px solid', borderColor: 'divider', '&:hover': { borderColor: tokens.rojo, color: tokens.rojo } }}>↪{chica ? null : ' Salir'}</ButtonBase>
        </Box>
      ) : null}
    </>
  );
}
