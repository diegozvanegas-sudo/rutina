// 🔎 Buscar en toda la app: se abre con 🔎 (arriba en el celular, en el menú en el computador), con Ctrl+K o con "/".
// Escribes y salen secciones, recordatorios, notas, ejercicios, hábitos, gastos y compras (src/buscar.js); tocar uno lleva
// a su lugar. Con ↑ ↓ se elige y Enter abre. main.js avisa que se abra con el evento "rutina:buscar"
import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, ButtonBase, Dialog, InputBase, useMediaQuery } from '@mui/material';
import { e } from '../../estado.js';
import { ejecutar } from '../../ui.js';
import { armarIndice, buscar } from '../../buscar.js';
import { datosBuscar } from '../armazon.js';
import { tokens } from '../tema';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;

function ir(x: Fin) {
  const actual = location.hash || '#hoy';
  if (actual !== x.ir) location.hash = x.ir;
  if (!x.accion) return;
  // Abrir esa fila cuando la pantalla ya está montada, y dejarla a la vista
  setTimeout(() => {
    ejecutar(x.accion, { dataset: { id: x.id } });
    setTimeout(() => { const el = document.querySelector('[data-rec-id="' + x.id + '"]'); if (el) el.scrollIntoView({ block: 'center' }); }, 250);
  }, actual === x.ir ? 0 : 700);
}

export default function Buscar() {
  const [abierto, ponerAbierto] = useState(false), [texto, ponerTexto] = useState(''), [elegido, ponerElegido] = useState(0);
  const celular = useMediaQuery('(max-width:899px)'), lista = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const abrir = () => { ponerTexto(''); ponerElegido(0); ponerAbierto(true); };
    window.addEventListener('rutina:buscar', abrir);
    return () => window.removeEventListener('rutina:buscar', abrir);
  }, []);
  // El índice se arma al abrir (con lo de ese momento) y no en cada letra
  const indice = useMemo(() => (abierto ? armarIndice(e(), datosBuscar()) : []), [abierto]);
  const resultados = useMemo(() => buscar(indice, texto) as Fin[], [indice, texto]);
  const cerrar = () => ponerAbierto(false);
  const elegir = (x: Fin) => { cerrar(); ir(x); };
  useEffect(() => { const el = lista.current && lista.current.querySelector('[data-elegido="si"]'); if (el) (el as HTMLElement).scrollIntoView({ block: 'nearest' }); }, [elegido]);
  const tecla = (ev: React.KeyboardEvent) => {
    if (ev.key === 'ArrowDown') { ev.preventDefault(); ponerElegido((n) => Math.min(resultados.length - 1, n + 1)); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); ponerElegido((n) => Math.max(0, n - 1)); }
    else if (ev.key === 'Enter' && resultados[elegido]) { ev.preventDefault(); elegir(resultados[elegido]); }
  };
  return (
    <Dialog open={abierto} onClose={cerrar} fullScreen={celular} aria-label="Buscar en la app" data-t="buscar"
      slotProps={{ paper: { sx: { width: { md: 600 }, maxWidth: '100%', alignSelf: { md: 'flex-start' }, mt: { md: '10vh' }, bgcolor: 'background.paper', borderRadius: { xs: 0, md: '16px' }, p: 0 } } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: 'calc(10px + env(safe-area-inset-top)) 12px 10px', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box component="span" aria-hidden="true" sx={{ fontSize: 20 }}>🔎</Box>
        <InputBase autoFocus fullWidth value={texto} onChange={(ev) => { ponerTexto(ev.target.value); ponerElegido(0); }} onKeyDown={tecla}
          placeholder="Buscar: un recordatorio, una nota, un ejercicio, un gasto…" inputProps={{ 'aria-label': 'Buscar', 'data-t': 'buscar-campo', enterKeyHint: 'go' }}
          sx={{ fontSize: 17, '& input': { border: 0, minHeight: 44, p: '8px 4px', bgcolor: 'transparent', outline: 'none !important' } }} />
        <ButtonBase onClick={cerrar} aria-label="Cerrar" sx={{ flex: 'none', minWidth: 44, minHeight: 44, borderRadius: '10px', fontSize: 15, color: 'text.secondary', '&:hover': { bgcolor: tokens.surface2 } }}>{celular ? 'Cerrar' : 'Esc'}</ButtonBase>
      </Box>
      <Box ref={lista} role="listbox" aria-label="Resultados" sx={{ overflowY: 'auto', maxHeight: { md: '60vh' }, p: '6px' }}>
        {!texto.trim() ? <Box component="p" sx={{ color: 'text.secondary', fontSize: 14, m: 0, p: '14px 10px' }}>Escribe una o más palabras. Busca en las secciones, tus recordatorios, notas, ejercicios, hábitos, gastos y compras.</Box>
          : !resultados.length ? <Box component="p" sx={{ color: 'text.secondary', fontSize: 14, m: 0, p: '14px 10px' }}>Nada con «{texto.trim()}».</Box>
          : resultados.map((x, i) => (
            <ButtonBase key={i} role="option" aria-selected={i === elegido} data-elegido={i === elegido ? 'si' : undefined} data-t="buscar-resultado" onClick={() => elegir(x)} onMouseMove={() => i !== elegido && ponerElegido(i)}
              sx={{ width: '100%', display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) auto', alignItems: 'center', gap: '8px', textAlign: 'left', minHeight: 52, p: '6px 10px', borderRadius: '10px', font: 'inherit', color: 'text.primary',
                bgcolor: i === elegido ? tokens.surface2 : 'transparent', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
              <Box component="span" aria-hidden="true" sx={{ fontSize: 20, textAlign: 'center' }}>{x.icono}</Box>
              <Box component="span" sx={{ display: 'grid', minWidth: 0 }}>
                <Box component="b" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.titulo}</Box>
                {x.sub ? <Box component="small" sx={{ color: 'text.secondary', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.sub}</Box> : null}
              </Box>
              <Box component="small" sx={{ color: 'text.secondary', fontSize: 12 }}>{x.tipo}</Box>
            </ButtonBase>
          ))}
      </Box>
    </Dialog>
  );
}
