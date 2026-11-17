// Estilos de los dibujos que todavía llegan como SVG en texto (puente HtmlViejo): los gráficos de graficos.js y las
// figuras de los ejercicios de figuras.js, más el globo de ayuda de los gráficos (#tip, main.js). Antes vivían en
// estilos.css; ahora salen del tema (tokens). Se monta una sola vez, como el menú (montarFijo), para que estén en toda la
// app aunque cambie la pantalla, y las clases son las mismas que escriben esos archivos.
import { GlobalStyles } from '@mui/material';
import { tokens as t } from '../tema';

const FUENTE = 'system-ui, sans-serif';
const ESTILOS = {
  // ---------- Gráficos (graficos.js) ----------
  '.grafico': { width: '100%', height: 'auto', display: 'block', overflow: 'visible' },
  '.grafico .guia': { stroke: t.line, strokeWidth: 1 },
  '.grafico .base': { stroke: t.graficoBase, strokeWidth: 1 },
  '.grafico .eje': { fill: t.muted, fontSize: '9.5px' },
  '.grafico .serie-1': { fill: t.serie1 }, '.grafico .serie-2': { fill: t.serie2 }, '.grafico .serie-3': { fill: t.serie3 },
  '.grafico .vacio': { fill: 'none' },
  '.grafico .trazo': { fill: 'none', stroke: t.serie1, strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' },
  '.grafico .punto': { stroke: t.surface, strokeWidth: 2 },
  '.grafico .dato': { fill: t.ink, fontSize: '11px', fontWeight: 700 },
  '.grafico .referencia': { stroke: t.muted, strokeWidth: 1, strokeDasharray: '4 3' },
  '.grafico .ref-texto': { fill: t.muted, fontSize: '9.5px' },
  '.grafico .zona': { fill: 'transparent', cursor: 'crosshair', outline: 'none' },
  '.grafico .zona:hover, .grafico .zona:focus': { fill: t.graficoZona },
  '.calendario': { maxWidth: 300 },
  '.calendario rect:focus': { stroke: t.ink, strokeWidth: 1.5, outline: 'none' },
  '.cal-0': { fill: t.surface2 }, '.cal-1': { fill: t.rampa1 }, '.cal-2': { fill: t.rampa2 }, '.cal-3': { fill: t.rampa3 }, '.cal-4': { fill: t.rampa4 },
  '.leyenda': { display: 'flex', gap: '14px', fontSize: 13, color: t.muted, marginBottom: 4 },
  '.leyenda i': { width: 12, height: 12, borderRadius: 3, display: 'inline-block', marginRight: 6, verticalAlign: '-1px' },
  '.leyenda i.serie-1': { background: t.serie1 }, '.leyenda i.serie-2': { background: t.serie2 }, '.leyenda i.serie-3': { background: t.serie3 },
  '.barras-h': { display: 'grid', gap: '8px' },
  '.bh': { display: 'grid', gridTemplateColumns: 'minmax(90px, 38%) 1fr auto', gap: '8px', alignItems: 'center', fontSize: 14, outline: 'none' },
  '.bh:focus .bh-pista, .bh:hover .bh-pista': { background: t.graficoPista },
  '.bh-et': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  '.bh-pista': { height: 12, borderRadius: 4, background: t.surface2, overflow: 'hidden' },
  '.bh-barra': { display: 'block', height: '100%', background: t.serie1, borderRadius: '0 4px 4px 0' },
  '.bh-v': { fontVariantNumeric: 'tabular-nums', color: t.muted, fontSize: 13 },
  '.ver-datos': { marginTop: 6, fontSize: 14 },
  '.tip': { position: 'fixed', zIndex: 70, pointerEvents: 'none', background: t.ink, color: t.bg, padding: '6px 10px', borderRadius: 8, fontSize: 13, fontWeight: 600,
    maxWidth: 'min(320px, 92vw)', whiteSpace: 'pre-line', boxShadow: `0 6px 18px ${t.prSombraFuerte}` },
  '.tip[hidden]': { display: 'none' },

  // ---------- Figuras de los ejercicios (figuras.js) ----------
  '.figura': { width: 'min(260px, 70vw)', height: 'auto', display: 'block', margin: '0 auto 4px' },
  '.figura .fg-piso': { stroke: t.line, strokeWidth: 2 },
  '.figura .fg-obj': { stroke: t.fgObjeto, strokeWidth: 4, fill: t.surface2, strokeLinecap: 'round' },
  '.figura .fg-cuerpo, .figura .fg-cerca, .figura .fg-lejos': { fill: 'none', strokeWidth: 7, strokeLinecap: 'round', strokeLinejoin: 'round' },
  '.figura .fg-cuerpo, .figura .fg-cerca': { stroke: t.ink },
  '.figura .fg-lejos': { stroke: t.fgLejos },
  '.figura .fg-cabeza': { fill: t.ink },
  '.figura .fg-banda': { fill: 'none', stroke: t.amarillo, strokeWidth: 3, strokeLinecap: 'round' },
  '.figura .fg-pesa': { fill: t.azul },
  '.figura .fg-balon': { fill: t.amarillo, stroke: t.bg, strokeWidth: 2 },
  '.figura .fg-aire': { fill: t.brandSoft, stroke: t.brand, strokeWidth: 3 },
  '.figura .fg-texto': { fill: t.ink, font: `700 17px ${FUENTE}` },
  '.figura .fg-relleno': { fill: t.ink },
  '.figura .fg-lejos-relleno': { fill: t.fgLejos },
  '.figura .fg-pierna': { fill: t.fgPierna },
  '.figura .fg-pierna-lejos': { fill: t.fgPiernaLejos },
  '.figura .fg-pesa-barra': { stroke: t.azul, strokeWidth: 4, strokeLinecap: 'round' },
  '.figura .fg-flecha': { fill: 'none', stroke: t.brand, strokeWidth: 3, strokeLinecap: 'round', strokeDasharray: '6 5' },
  '.figura .fg-punta': { fill: t.brand },
  '.figura .fg-nota': { fill: t.muted, font: `600 12px ${FUENTE}` },
  '.figura .fg-nota-fuerte': { fill: t.brand },
  '.figura .fg-resalta': { stroke: t.amarillo, fill: 'none', animation: 'fg-pulso 2.5s ease-in-out infinite' },
  '.figura circle.fg-resalta': { fill: t.amarillo },
  '@keyframes fg-pulso': { '50%': { opacity: 0.45 } },
  '@media (prefers-reduced-motion: reduce)': { '.figura .fg-resalta': { animation: 'none' } },
  '.foto-paso': { objectFit: 'cover', aspectRatio: '200 / 170', borderRadius: 12, background: t.surface2 },
} as const;

export default function Estilos() {
  return <GlobalStyles styles={ESTILOS} />;
}
