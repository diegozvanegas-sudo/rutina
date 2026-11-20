// Lista que se ordena arrastrando del asa ⠿ (con el dedo o el mouse) o con las flechas ↑ ↓ sobre el asa.
// Mientras se arrastra, el orden vive en React (no se mueve el DOM a mano); al soltar, alSoltar(orden, movido) recibe las
// posiciones viejas en el orden nuevo ([2, 0, 1]) y la pantalla llama a la acción de siempre (ed-ordenar, orden-colocar).
// Cada elemento va envuelto en un <div data-orden-i="posición vieja"> (los recorridos de prueba lo buscan así).
// El asa NO lleva la clase "asa-orden": esa la mueve main.js con el DOM (la usan las pantallas que siguen como antes).
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Box, ButtonBase } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { tokens } from '../tema';

type Datos = Record<`data-${string}`, string | number>;
type Props = {
  n: number;
  /** Clave de React de cada elemento (su id); sin ella, la posición */
  clave?: (i: number) => string | number;
  alSoltar: (orden: number[], movido: number) => void;
  datos?: Datos;
  sx?: SxProps<Theme>;
  children: (i: number, asa: (nombre: string, sx?: SxProps<Theme>) => ReactNode) => ReactNode;
};

const ASA = {
  flex: 'none', minWidth: 34, minHeight: 44, borderRadius: '8px', color: 'text.secondary', fontSize: 20, lineHeight: 1, cursor: 'grab', touchAction: 'none',
  '&:hover': { color: 'text.primary', bgcolor: tokens.surface2 }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' },
};

export function Ordenable({ n, clave, alSoltar, datos, sx, children }: Props) {
  const [orden, ponerOrden] = useState<number[] | null>(null), [moviendo, ponerMoviendo] = useState<number | null>(null);
  const caja = useRef<HTMLDivElement>(null), foco = useRef<number | null>(null);
  const actual = orden && orden.length === n ? orden : Array.from({ length: n }, (_, i) => i);
  const items = () => [...(caja.current?.querySelectorAll<HTMLElement>(':scope > [data-orden-i]') || [])];

  // Con el teclado, el foco sigue al elemento en su posición nueva
  useEffect(() => {
    if (foco.current == null) return;
    const b = items()[foco.current]?.querySelector<HTMLElement>('[data-asa]');
    foco.current = null;
    if (b) b.focus({ preventScroll: true });
  });

  const empezar = (i: number) => (ev: PointerEvent<HTMLElement>) => {
    if (ev.button !== 0) return;
    ev.preventDefault();
    const item = items().find((x) => x.dataset.ordenI === String(i));
    if (!item) return;
    // Se compara el centro del renglón que se arrastra (no el dedo): en el celular el asa queda arriba de un renglón alto
    const r0 = item.getBoundingClientRect(), desfase = r0.top + r0.height / 2 - ev.clientY, inicio = actual.join(',');
    let y = ev.clientY, ultimo = actual;
    const ubicar = () => {
      const centro = y + desfase, otros = items().filter((x) => x !== item);
      const k = otros.findIndex((x) => { const r = x.getBoundingClientRect(); return centro < r.top + r.height / 2; });
      const nuevo = otros.map((x) => Number(x.dataset.ordenI));
      nuevo.splice(k < 0 ? nuevo.length : k, 0, i);
      if (nuevo.join(',') !== ultimo.join(',')) { ultimo = nuevo; ponerOrden(nuevo); }
    };
    // Cerca del borde de la pantalla, se desliza sola: la caja con scroll que la contiene (el menú del celular) o la página
    let cont: HTMLElement | null = caja.current ? caja.current.parentElement : null;
    while (cont && !(/(auto|scroll)/.test(getComputedStyle(cont).overflowY) && cont.scrollHeight > cont.clientHeight)) cont = cont.parentElement;
    const borde = setInterval(() => {
      const paso = y < 90 ? -14 : y > innerHeight - 90 ? 14 : 0;
      if (paso) { if (cont) cont.scrollBy(0, paso); else scrollBy(0, paso); ubicar(); }
    }, 16);
    const mover = (m: globalThis.PointerEvent) => { y = m.clientY; ubicar(); };
    const fin = () => {
      clearInterval(borde);
      document.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerup', fin);
      document.removeEventListener('pointercancel', fin);
      ponerMoviendo(null);
      ponerOrden(null);
      if (ultimo.join(',') !== inicio) alSoltar(ultimo, i);
    };
    ponerMoviendo(i);
    document.addEventListener('pointermove', mover);
    document.addEventListener('pointerup', fin);
    document.addEventListener('pointercancel', fin);
  };

  const teclas = (i: number) => (ev: KeyboardEvent<HTMLElement>) => {
    if (ev.key !== 'ArrowUp' && ev.key !== 'ArrowDown') return;
    ev.preventDefault();
    const k = actual.indexOf(i), otro = k + (ev.key === 'ArrowUp' ? -1 : 1);
    if (otro < 0 || otro >= n) return;
    const nuevo = [...actual];
    [nuevo[k], nuevo[otro]] = [nuevo[otro], nuevo[k]];
    foco.current = otro;
    alSoltar(nuevo, i);
  };

  return (
    <Box ref={caja} {...datos} sx={[{ display: 'grid' }, moviendo != null ? { cursor: 'grabbing', userSelect: 'none' } : null, ...(Array.isArray(sx) ? sx : [sx])]}>
      {actual.map((i) => (
        <Box key={clave ? clave(i) : i} data-orden-i={i} sx={moviendo === i ? { opacity: 0.85, '& > *': { outline: '2px solid', outlineColor: 'primary.main' } } : undefined}>
          {children(i, (nombre, s) => (
            <ButtonBase data-asa="" aria-label={'Arrastrar ' + nombre + ' (o usa las flechas ↑ ↓)'} title="Arrastra para ordenar"
              onPointerDown={empezar(i)} onKeyDown={teclas(i)} sx={[ASA, ...(Array.isArray(s) ? s : [s])]}>⠿</ButtonBase>
          ))}
        </Box>
      ))}
    </Box>
  );
}
