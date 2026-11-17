// Gráficos en SVG sin librerías, dibujados por React (antes era src/graficos.js, que los devolvía como texto HTML).
// Cada marca lleva data-tip (el texto del cuadro al pasar el dedo o el mouse, lo muestra main.js); las zonas sensibles
// son más grandes que la marca. Los colores van por clase (serie-*, cal-*) y los estilos están en armazon/Estilos.tsx.
import type { ReactNode } from 'react';

const W = 360; // ancho del dibujo; el SVG se estira al ancho de la tarjeta

type Formato = (n: number) => ReactNode;
type Margen = { izq: number; der: number; arriba: number; abajo: number };
export type Dato = { etiqueta?: string; v: number | null | undefined; tip?: string };
export type Referencia = { v: number; texto: string } | null | undefined;

// Tres líneas guía (0, mitad, máximo), recesivas
function Eje({ max, alto, formato, m }: { max: number; alto: number; formato: Formato; m: Margen }) {
  return <>{[0, 0.5, 1].map((f) => {
    const y = m.arriba + (1 - f) * alto;
    return [<line key={'l' + f} className="guia" x1={m.izq} x2={W - m.der} y1={y} y2={y} />,
      <text key={'t' + f} className="eje" x={m.izq - 4} y={y + 3.5} textAnchor="end">{formato(max * f)}</text>];
  })}</>;
}
// Etiquetas del eje x espaciadas para que no se monten
function EtiquetasX({ datos, x, ancho, yBase }: { datos: { etiqueta?: string }[]; x: (i: number) => number; ancho: number; yBase: number }) {
  const cada = Math.max(1, Math.ceil(datos.length / Math.floor((W - 40) / 34)));
  return <>{datos.map((d, i) => (i % cada === 0 && d.etiqueta
    ? <text key={i} className="eje" x={x(i) + ancho / 2} y={yBase + 13} textAnchor="middle">{d.etiqueta}</text> : null))}</>;
}
// Barra con las esquinas de arriba redondeadas (4 px) y apoyada en la base
function Barra({ x, y, w, h, clase }: { x: number; y: number; w: number; h: number; clase: string }) {
  if (h <= 0) return null;
  const r = Math.min(4, w / 2, h);
  return <path className={clase} d={'M' + x + ',' + (y + h) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) + 'V' + (y + h) + 'Z'} />;
}
// Línea de meta o plan con su texto a la derecha
function LineaRef({ m, y, texto }: { m: Margen; y: number; texto: string }) {
  return <>
    <line className="referencia" x1={m.izq} x2={W - m.der} y1={y} y2={y} />
    <text className="ref-texto" x={W - m.der} y={y - 4} textAnchor="end">{texto}</text>
  </>;
}

// datos: [{ etiqueta, v (número o null), tip }]; meta: { v, texto } línea de referencia (meta o plan)
export function Barras({ datos, alto = 120, max, formato = (n) => Math.round(n), meta: ref, clase = 'serie-1', sinEtiquetas = false }:
  { datos: Dato[]; alto?: number; max?: number; formato?: Formato; meta?: Referencia; clase?: string; sinEtiquetas?: boolean }) {
  const m = { izq: 34, der: 6, arriba: 8, abajo: 18 };
  const tope = Math.max(max || 0, ref ? ref.v : 0, ...datos.map((d) => d.v || 0)) || 1;
  const paso = (W - m.izq - m.der) / Math.max(1, datos.length), ancho = Math.min(28, Math.max(2, paso - 2)); // 2 px de aire; con pocas barras no se vuelven bloques
  const x = (i: number) => m.izq + i * paso + (paso - ancho) / 2, yBase = m.arriba + alto, h = (v: number | null | undefined) => (Math.max(0, v || 0) / tope) * alto;
  return (
    <svg className="grafico" viewBox={'0 0 ' + W + ' ' + (alto + m.arriba + m.abajo)} role="img">
      <Eje max={tope} alto={alto} formato={formato} m={m} />
      {datos.map((d, i) => [
        <Barra key={'b' + i} x={x(i)} y={yBase - h(d.v)} w={ancho} h={h(d.v)} clase={d.v == null ? 'vacio' : clase} />,
        <rect key={'z' + i} className="zona" x={m.izq + i * paso} y={m.arriba} width={paso} height={alto} data-tip={d.tip || ''} tabIndex={0} />,
      ])}
      {ref ? <LineaRef m={m} y={yBase - h(ref.v)} texto={ref.texto} /> : null}
      <line className="base" x1={m.izq} x2={W - m.der} y1={yBase} y2={yBase} />
      {sinEtiquetas ? null : <EtiquetasX datos={datos} x={x} ancho={ancho} yBase={yBase} />}
    </svg>
  );
}

// Dos o más series lado a lado (ingresos y gastos): series [{ nombre, clase }], grupos [{ etiqueta, valores: [a, b], tips: [..] }]
export function BarrasAgrupadas({ grupos, series, alto = 130, formato = (n) => Math.round(n) }:
  { grupos: { etiqueta?: string; valores: number[]; tips: string[] }[]; series: { nombre: string; clase: string }[]; alto?: number; formato?: Formato }) {
  const m = { izq: 40, der: 6, arriba: 8, abajo: 18 };
  const tope = Math.max(1, ...grupos.flatMap((g) => g.valores));
  const paso = (W - m.izq - m.der) / Math.max(1, grupos.length), ancho = Math.max(3, (paso - 8) / series.length - 2);
  const yBase = m.arriba + alto, h = (v: number) => (Math.max(0, v) / tope) * alto;
  return (
    <svg className="grafico" viewBox={'0 0 ' + W + ' ' + (alto + m.arriba + m.abajo)} role="img">
      <Eje max={tope} alto={alto} formato={formato} m={m} />
      {grupos.map((g, i) => {
        const x0 = m.izq + i * paso + 4;
        return g.valores.map((v, k) => [
          <Barra key={'b' + i + '-' + k} x={x0 + k * (ancho + 2)} y={yBase - h(v)} w={ancho} h={h(v)} clase={series[k].clase} />,
          <rect key={'z' + i + '-' + k} className="zona" x={x0 + k * (ancho + 2) - 1} y={m.arriba} width={ancho + 2} height={alto} data-tip={g.tips[k]} tabIndex={0} />,
        ]);
      })}
      <line className="base" x1={m.izq} x2={W - m.der} y1={yBase} y2={yBase} />
      <EtiquetasX datos={grupos} x={(i) => m.izq + i * paso + 4} ancho={paso - 8} yBase={yBase} />
    </svg>
  );
}

// Línea de 2 px; puntos: [{ etiqueta, v, tip }] (los días sin dato se saltan: la línea une los registros); meta: { v, texto }
export function Linea({ puntos, alto = 120, formato = (n) => n, meta: ref, margenEje = 0.5 }:
  { puntos: Dato[]; alto?: number; formato?: Formato; meta?: Referencia; margenEje?: number }) {
  const m = { izq: 34, der: 8, arriba: 10, abajo: 18 };
  const vals = (puntos.map((p) => p.v).filter((v) => v != null) as number[]).concat(ref ? [ref.v] : []);
  if (!vals.length) return null;
  const min = Math.min(...vals) - margenEje, max = Math.max(...vals) + margenEje;
  const paso = (W - m.izq - m.der) / Math.max(1, puntos.length - 1), x = (i: number) => m.izq + i * paso, y = (v: number) => m.arriba + (1 - (v - min) / (max - min || 1)) * alto;
  const tramo = puntos.map((p, i) => (p.v == null ? null : [x(i), y(p.v)])).filter(Boolean) as number[][];
  const ultimo = [...puntos].reverse().find((p) => p.v != null) as Dato, iu = puntos.lastIndexOf(ultimo), vu = ultimo.v as number;
  return (
    <svg className="grafico" viewBox={'0 0 ' + W + ' ' + (alto + m.arriba + m.abajo)} role="img">
      {[min, (min + max) / 2, max].map((v, k) => [
        <line key={'l' + k} className="guia" x1={m.izq} x2={W - m.der} y1={y(v)} y2={y(v)} />,
        <text key={'t' + k} className="eje" x={m.izq - 4} y={y(v) + 3.5} textAnchor="end">{formato(v)}</text>,
      ])}
      {ref ? <LineaRef m={m} y={y(ref.v)} texto={ref.texto} /> : null}
      {tramo.length > 1
        ? <polyline className="trazo serie-1" points={tramo.map((p) => p[0] + ',' + p[1]).join(' ')} />
        : <circle className="punto serie-1" r={4} cx={tramo[0][0]} cy={tramo[0][1]} />}
      {/* Solo el último punto lleva marca y etiqueta directa */}
      <circle className="punto serie-1" r={4.5} cx={x(iu)} cy={y(vu)} />
      <text className="dato" x={Math.min(x(iu), W - m.der - 2)} y={y(vu) - 9} textAnchor={iu > puntos.length / 2 ? 'end' : 'start'}>{formato(vu)}</text>
      {puntos.map((p, i) => <rect key={i} className="zona" x={x(i) - paso / 2} y={m.arriba} width={paso} height={alto} data-tip={p.tip || ''} tabIndex={0} />)}
      <EtiquetasX datos={puntos} x={(i) => x(i) - 1} ancho={2} yBase={m.arriba + alto} />
    </svg>
  );
}

// Calendario de constancia: columnas = semanas, filas = lunes..domingo; v de 0 a 1 (null = sin datos)
export type DiaCalendario = { v: number | null; tip: string; futuro?: boolean } | null;
export function Calendario({ semanas, titulos = [] }: { semanas: DiaCalendario[][]; titulos?: string[] }) {
  const c = 16, g = 3, izq = 22, arriba = 4;
  const ancho = izq + semanas.length * (c + g), alto = arriba + 7 * (c + g) + 14;
  const nivel = (v: number | null) => (v == null ? 'cal-0' : v >= 0.85 ? 'cal-4' : v >= 0.6 ? 'cal-3' : v >= 0.35 ? 'cal-2' : 'cal-1');
  return (
    <svg className="grafico calendario" viewBox={'0 0 ' + ancho + ' ' + alto} role="img">
      {['L', '', 'M', '', 'V', '', 'D'].map((t, k) => (t ? <text key={k} className="eje" x={izq - 6} y={arriba + k * (c + g) + 12} textAnchor="end">{t}</text> : null))}
      {semanas.map((sem, i) => [
        ...sem.map((d, k) => (d ? <rect key={i + '-' + k} className={nivel(d.v) + (d.futuro ? ' futuro' : '')} rx={3} x={izq + i * (c + g)} y={arriba + k * (c + g)} width={c} height={c} data-tip={d.tip} tabIndex={0} /> : null)),
        titulos[i] ? <text key={'s' + i} className="eje" x={izq + i * (c + g)} y={alto - 2}>{titulos[i]}</text> : null,
      ])}
    </svg>
  );
}

// Barras horizontales (gasto por categoría): [{ etiqueta, v, tip }], ya ordenadas
export function BarrasH({ datos, formato = (n) => Math.round(n) }: { datos: { etiqueta: string; v: number; tip?: string }[]; formato?: Formato }) {
  const tope = Math.max(1, ...datos.map((d) => d.v));
  return (
    <div className="barras-h">
      {datos.map((d, i) => (
        <div key={i} className="bh" data-tip={d.tip || ''} tabIndex={0}>
          <span className="bh-et">{d.etiqueta}</span>
          <span className="bh-pista"><span className="bh-barra" style={{ width: Math.max(1, (d.v / tope) * 100) + '%' }} /></span>
          <span className="bh-v">{formato(d.v)}</span>
        </div>
      ))}
    </div>
  );
}

// Tabla con los mismos datos (para leer sin el gráfico)
export function TablaDatos({ columnas, filas }: { columnas: string[]; filas: unknown[][] }) {
  return (
    <details className="ver-datos">
      <summary>Ver datos</summary>
      <div className="tabla-scroll">
        <table className="historial">
          <thead><tr>{columnas.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
          <tbody>{filas.map((f, i) => <tr key={i}>{f.map((v, k) => <td key={k}>{String(v ?? '')}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </details>
  );
}
