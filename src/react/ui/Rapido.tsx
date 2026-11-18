// Toques rápidos para llenar: − valor + y fichas con los valores de siempre ("igual que la última", 23:00, 70 min).
// Se puede seguir escribiendo en el campo. Guarda con la misma acción del campo de antes (data-cambio, en src/vistas/*.js):
// la acción recibe el valor nuevo como si se hubiera escrito. El valor late un instante al cambiar (sin animación si el
// equipo pide menos movimiento).
import { useId, useRef, type ReactNode } from 'react';
import { Box, ButtonBase, Chip, OutlinedInput } from '@mui/material';
import { ejecutar } from '../../ui.js';
import { tokens } from '../tema';

type Datos = Record<string, string>;
const guardarCon = (accion: string, valor: string, datos: Datos) =>
  (ejecutar as (n: string, el: { value: string; dataset: Datos }) => void)(accion, { value: valor, dataset: datos });

const LATIDO = {
  '@keyframes latido': { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.08)', color: tokens.brand }, '100%': { transform: 'scale(1)' } },
  '&.late': { animation: 'latido .35s ease-out' },
  '@media (prefers-reduced-motion: reduce)': { '&.late': { animation: 'none' } },
};
function latir(el: HTMLElement | null) {
  if (!el) return;
  el.classList.remove('late'); void el.offsetWidth; el.classList.add('late');
  if (navigator.vibrate) try { navigator.vibrate(8); } catch (err) { /* sin vibración */ }
}

const Boton = ({ children, etiqueta, onClick }: { children: ReactNode; etiqueta: string; onClick: () => void }) => (
  <ButtonBase aria-label={etiqueta} onClick={onClick}
    sx={{ width: 48, height: 48, flex: 'none', borderRadius: '12px', bgcolor: tokens.surface2, color: 'text.primary', fontSize: 22, fontWeight: 700,
      '&:active': { transform: 'scale(.94)' }, '&:hover': { bgcolor: tokens.line }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
    {children}
  </ButtonBase>
);
const Fichas = ({ fichas, alElegir, nombre }: { fichas: [string, ReactNode][]; alElegir: (v: string) => void; nombre: string }) => (fichas.length
  ? <Box role="group" aria-label={nombre} sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', mt: '6px' }}>
      {fichas.map(([v, t]) => <Chip key={v + String(t)} clickable size="small" variant="outlined" label={t} onClick={() => alElegir(v)} sx={{ height: 32, fontSize: 14 }} />)}
    </Box>
  : null);

/** Un número con − y +: peso, minutos, pasos. base: desde dónde arrancan − y + cuando está vacío (el último anotado) */
export function Ajustar({ etiqueta, valor, base, paso, min = 0, max = Infinity, decimales = 0, unidad, accion, datos = {}, fichas = [] }: {
  etiqueta: string; valor: number | null | undefined; base?: number | null; paso: number; min?: number; max?: number; decimales?: number; unidad?: string;
  accion: string; datos?: Datos; fichas?: [number, ReactNode][];
}) {
  const caja = useRef<HTMLDivElement>(null), id = useId();
  const texto = (n: number) => (decimales ? n.toFixed(decimales).replace('.', ',') : String(n));
  const poner = (n: number) => { const v = Math.min(max, Math.max(min, Math.round(n * 10 ** decimales) / 10 ** decimales)); guardarCon(accion, String(v), datos); latir(caja.current); };
  const desde = valor ?? base ?? null;
  const mover = (s: number) => poner(desde == null ? Math.max(min, s > 0 ? paso : 0) : desde + s * paso);
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box component="label" htmlFor={id} sx={{ display: 'block', fontSize: 14, color: 'text.secondary', mb: '4px' }}>{etiqueta}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Boton etiqueta={'Bajar ' + etiqueta} onClick={() => mover(-1)}>−</Boton>
        <Box ref={caja} sx={{ flex: 1, minWidth: 0, ...LATIDO }}>
          {/* key: al cambiar con − y + el campo muestra el valor nuevo */}
          <OutlinedInput key={String(valor ?? '')} fullWidth inputMode="decimal" defaultValue={valor != null ? texto(valor) : ''} placeholder={desde != null ? texto(desde) : ''}
            inputProps={{ id, 'data-cambio': accion, ...Object.fromEntries(Object.entries(datos).map(([k, v]) => ['data-' + k, v])), style: { textAlign: 'center', fontSize: 22, fontWeight: 800, minWidth: 0 } }}
            endAdornment={unidad ? <Box component="span" sx={{ color: 'text.secondary', fontSize: 14, pr: '4px' }}>{unidad}</Box> : undefined} />
        </Box>
        <Boton etiqueta={'Subir ' + etiqueta} onClick={() => mover(1)}>＋</Boton>
      </Box>
      <Fichas nombre={'Valores rápidos de ' + etiqueta} fichas={fichas.map(([v, t]) => [String(v), t])} alElegir={(v) => poner(Number(v))} />
    </Box>
  );
}

// "23:00" ↔ minutos del día
const aMin = (t: string | null | undefined) => { const m = /^(\d{1,2}):(\d{2})$/.exec(t || ''); return m ? Number(m[1]) * 60 + Number(m[2]) : null; };
const aHora = (n: number) => { const x = ((n % 1440) + 1440) % 1440; return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); };
/** Las horas más repetidas de una lista (las de los últimos días), tal como se anotaron, de la más usada a la menos */
export function horasDeSiempre(horas: (string | null | undefined)[], cuantas = 3): string[] {
  const n: Record<string, number> = {};
  for (const h of horas) { const m = aMin(h); if (m != null) { const k = aHora(m); n[k] = (n[k] || 0) + 1; } }
  return Object.entries(n).sort((a, b) => b[1] - a[1]).slice(0, cuantas).map(([k]) => k);
}

/** Una hora con −15 y +15 min y fichas con las de siempre. porDefecto: desde dónde arranca si está vacía */
export function Hora({ etiqueta, valor, porDefecto, accion, datos = {}, siempre = [] }: {
  etiqueta: string; valor: string | null | undefined; porDefecto: string; accion: string; datos?: Datos; siempre?: string[];
}) {
  const caja = useRef<HTMLDivElement>(null), id = useId();
  const poner = (h: string) => { guardarCon(accion, h, datos); latir(caja.current); };
  const desde = aMin(valor) ?? aMin(siempre[0]) ?? aMin(porDefecto) ?? 0;
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box component="label" htmlFor={id} sx={{ display: 'block', fontSize: 14, color: 'text.secondary', mb: '4px' }}>{etiqueta}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Boton etiqueta={etiqueta + ': 15 minutos antes'} onClick={() => poner(aHora(valor ? desde - 15 : desde))}>−</Boton>
        <Box ref={caja} sx={{ flex: 1, minWidth: 0, ...LATIDO }}>
          <OutlinedInput key={valor || ''} fullWidth type="time" defaultValue={valor || ''}
            inputProps={{ id, 'data-cambio': accion, ...Object.fromEntries(Object.entries(datos).map(([k, v]) => ['data-' + k, v])), style: { textAlign: 'center', fontSize: 18, fontWeight: 700, minWidth: 0 } }} />
        </Box>
        <Boton etiqueta={etiqueta + ': 15 minutos después'} onClick={() => poner(aHora(valor ? desde + 15 : desde))}>＋</Boton>
      </Box>
      <Fichas nombre={'Horas de siempre: ' + etiqueta} fichas={siempre.filter((h) => h !== valor).map((h) => [h, h])} alElegir={poner} />
    </Box>
  );
}
