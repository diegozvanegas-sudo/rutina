// Gráficos en SVG sin librerías. Cada marca lleva data-tip (texto del cuadro al pasar el dedo o el mouse);
// las zonas sensibles son más grandes que la marca. Colores por rol (variables CSS --serie-*, --rampa-*).
import { esc } from './ui.js';

const W = 360; // ancho del dibujo; el SVG se estira al ancho de la tarjeta

function eje(max, alto, formato, margen) {
  // Tres líneas guía (0, mitad, máximo), recesivas
  return [0, 0.5, 1].map((f) => {
    const y = margen.arriba + (1 - f) * alto;
    return '<line class="guia" x1="' + margen.izq + '" x2="' + (W - margen.der) + '" y1="' + y + '" y2="' + y + '"/>' +
      '<text class="eje" x="' + (margen.izq - 4) + '" y="' + (y + 3.5) + '" text-anchor="end">' + esc(formato(max * f)) + '</text>';
  }).join('');
}
// Etiquetas del eje x espaciadas para que no se monten
function etiquetasX(datos, x, ancho, yBase) {
  const cada = Math.max(1, Math.ceil(datos.length / Math.floor((W - 40) / 34)));
  return datos.map((d, i) => (i % cada === 0) && d.etiqueta
    ? '<text class="eje" x="' + (x(i) + ancho / 2) + '" y="' + (yBase + 13) + '" text-anchor="middle">' + esc(d.etiqueta) + '</text>' : '').join('');
}
// Barra con las esquinas de arriba redondeadas (4 px) y apoyada en la base
function barra(x, y, w, h, clase) {
  if (h <= 0) return '';
  const r = Math.min(4, w / 2, h);
  return '<path class="' + clase + '" d="M' + x + ',' + (y + h) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y + 'H' + (x + w - r) + 'Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) + 'V' + (y + h) + 'Z"/>';
}

// datos: [{ etiqueta, v (número o null), tip }]; ref: { v, texto } línea de referencia (meta o plan)
export function barras(datos, { alto = 120, max, formato = (n) => Math.round(n), ref, clase = 'serie-1', sinEtiquetas = false } = {}) {
  const m = { izq: 34, der: 6, arriba: 8, abajo: 18 };
  const tope = Math.max(max || 0, ref ? ref.v : 0, ...datos.map((d) => d.v || 0)) || 1;
  const paso = (W - m.izq - m.der) / Math.max(1, datos.length), ancho = Math.min(28, Math.max(2, paso - 2)); // 2 px de aire; con pocas barras no se vuelven bloques
  const x = (i) => m.izq + i * paso + (paso - ancho) / 2, yBase = m.arriba + alto, h = (v) => (Math.max(0, v || 0) / tope) * alto;
  return '<svg class="grafico" viewBox="0 0 ' + W + ' ' + (alto + m.arriba + m.abajo) + '" role="img">' + eje(tope, alto, formato, m) +
    datos.map((d, i) => barra(x(i), yBase - h(d.v), ancho, h(d.v), d.v == null ? 'vacio' : clase) +
      '<rect class="zona" x="' + (m.izq + i * paso) + '" y="' + m.arriba + '" width="' + paso + '" height="' + alto + '" data-tip="' + esc(d.tip || '') + '" tabindex="0"/>').join('') +
    (ref ? '<line class="referencia" x1="' + m.izq + '" x2="' + (W - m.der) + '" y1="' + (yBase - h(ref.v)) + '" y2="' + (yBase - h(ref.v)) + '"/>' +
      '<text class="ref-texto" x="' + (W - m.der) + '" y="' + (yBase - h(ref.v) - 4) + '" text-anchor="end">' + esc(ref.texto) + '</text>' : '') +
    '<line class="base" x1="' + m.izq + '" x2="' + (W - m.der) + '" y1="' + yBase + '" y2="' + yBase + '"/>' + (sinEtiquetas ? '' : etiquetasX(datos, x, ancho, yBase)) + '</svg>';
}

// Dos series lado a lado (ingresos y gastos): series [{ nombre, clase }], grupos [{ etiqueta, valores: [a, b], tips: [..] }]
export function barrasAgrupadas(grupos, series, { alto = 130, formato = (n) => Math.round(n) } = {}) {
  const m = { izq: 40, der: 6, arriba: 8, abajo: 18 };
  const tope = Math.max(1, ...grupos.flatMap((g) => g.valores));
  const paso = (W - m.izq - m.der) / Math.max(1, grupos.length), ancho = Math.max(3, (paso - 8) / series.length - 2);
  const yBase = m.arriba + alto, h = (v) => (Math.max(0, v) / tope) * alto;
  return '<svg class="grafico" viewBox="0 0 ' + W + ' ' + (alto + m.arriba + m.abajo) + '" role="img">' + eje(tope, alto, formato, m) +
    grupos.map((g, i) => {
      const x0 = m.izq + i * paso + 4;
      return g.valores.map((v, k) => barra(x0 + k * (ancho + 2), yBase - h(v), ancho, h(v), series[k].clase) +
        '<rect class="zona" x="' + (x0 + k * (ancho + 2) - 1) + '" y="' + m.arriba + '" width="' + (ancho + 2) + '" height="' + alto + '" data-tip="' + esc(g.tips[k]) + '" tabindex="0"/>').join('');
    }).join('') +
    '<line class="base" x1="' + m.izq + '" x2="' + (W - m.der) + '" y1="' + yBase + '" y2="' + yBase + '"/>' +
    etiquetasX(grupos, (i) => m.izq + i * paso + 4, paso - 8, yBase) + '</svg>';
}

// Línea de 2 px; puntos: [{ etiqueta, v, tip }] (los días sin dato se saltan: la línea une los registros); ref: { v, texto } (meta)
export function linea(puntos, { alto = 120, formato = (n) => n, ref, margenEje = 0.5 } = {}) {
  const m = { izq: 34, der: 8, arriba: 10, abajo: 18 };
  const vals = puntos.map((p) => p.v).filter((v) => v != null).concat(ref ? [ref.v] : []);
  if (!vals.length) return '';
  const min = Math.min(...vals) - margenEje, max = Math.max(...vals) + margenEje;
  const paso = (W - m.izq - m.der) / Math.max(1, puntos.length - 1), x = (i) => m.izq + i * paso, y = (v) => m.arriba + (1 - (v - min) / (max - min || 1)) * alto;
  const tramos = [puntos.map((p, i) => (p.v == null ? null : x(i) + ',' + y(p.v))).filter(Boolean)];
  const ultimo = [...puntos].reverse().find((p) => p.v != null), iu = puntos.lastIndexOf(ultimo);
  const guias = [min, (min + max) / 2, max].map((v) => '<line class="guia" x1="' + m.izq + '" x2="' + (W - m.der) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>' +
    '<text class="eje" x="' + (m.izq - 4) + '" y="' + (y(v) + 3.5) + '" text-anchor="end">' + esc(formato(v)) + '</text>').join('');
  return '<svg class="grafico" viewBox="0 0 ' + W + ' ' + (alto + m.arriba + m.abajo) + '" role="img">' + guias +
    (ref ? '<line class="referencia" x1="' + m.izq + '" x2="' + (W - m.der) + '" y1="' + y(ref.v) + '" y2="' + y(ref.v) + '"/><text class="ref-texto" x="' + (W - m.der) + '" y="' + (y(ref.v) - 4) + '" text-anchor="end">' + esc(ref.texto) + '</text>' : '') +
    tramos.map((t) => (t.length > 1 ? '<polyline class="trazo serie-1" points="' + t.join(' ') + '"/>' : '<circle class="punto serie-1" r="4" cx="' + t[0].split(',')[0] + '" cy="' + t[0].split(',')[1] + '"/>')).join('') +
    // Solo el último punto lleva marca y etiqueta directa
    '<circle class="punto serie-1" r="4.5" cx="' + x(iu) + '" cy="' + y(ultimo.v) + '"/>' +
    '<text class="dato" x="' + Math.min(x(iu), W - m.der - 2) + '" y="' + (y(ultimo.v) - 9) + '" text-anchor="' + (iu > puntos.length / 2 ? 'end' : 'start') + '">' + esc(formato(ultimo.v)) + '</text>' +
    puntos.map((p, i) => '<rect class="zona" x="' + (x(i) - paso / 2) + '" y="' + m.arriba + '" width="' + paso + '" height="' + alto + '" data-tip="' + esc(p.tip || '') + '" tabindex="0"/>').join('') +
    etiquetasX(puntos, (i) => x(i) - 1, 2, m.arriba + alto) + '</svg>';
}

// Calendario de constancia: columnas = semanas, filas = lunes..domingo; v de 0 a 1 (null = sin datos)
export function calendario(semanas, { titulos = [] } = {}) {
  const c = 16, g = 3, izq = 22, arriba = 4;
  const ancho = izq + semanas.length * (c + g), alto = arriba + 7 * (c + g) + 14;
  const nivel = (v) => (v == null ? 'cal-0' : v >= 0.85 ? 'cal-4' : v >= 0.6 ? 'cal-3' : v >= 0.35 ? 'cal-2' : 'cal-1');
  return '<svg class="grafico calendario" viewBox="0 0 ' + ancho + ' ' + alto + '" role="img">' +
    ['L', '', 'M', '', 'V', '', 'D'].map((t, k) => t ? '<text class="eje" x="' + (izq - 6) + '" y="' + (arriba + k * (c + g) + 12) + '" text-anchor="end">' + t + '</text>' : '').join('') +
    semanas.map((sem, i) => sem.map((d, k) => d ? '<rect class="' + nivel(d.v) + (d.futuro ? ' futuro' : '') + '" rx="3" x="' + (izq + i * (c + g)) + '" y="' + (arriba + k * (c + g)) + '" width="' + c + '" height="' + c + '" data-tip="' + esc(d.tip) + '" tabindex="0"/>' : '').join('') +
      (titulos[i] ? '<text class="eje" x="' + (izq + i * (c + g)) + '" y="' + (alto - 2) + '">' + esc(titulos[i]) + '</text>' : '')).join('') + '</svg>';
}

// Barras horizontales (gasto por categoría): [{ etiqueta, v, tip }], ya ordenadas
export function barrasH(datos, { formato = (n) => Math.round(n) } = {}) {
  const tope = Math.max(1, ...datos.map((d) => d.v));
  return '<div class="barras-h">' + datos.map((d) => '<div class="bh" data-tip="' + esc(d.tip || '') + '" tabindex="0"><span class="bh-et">' + esc(d.etiqueta) + '</span>' +
    '<span class="bh-pista"><span class="bh-barra" style="width:' + Math.max(1, (d.v / tope) * 100) + '%"></span></span><span class="bh-v">' + esc(formato(d.v)) + '</span></div>').join('') + '</div>';
}

// Tabla con los mismos datos (para leer sin el gráfico)
export function tablaDatos(columnas, filas) {
  return '<details class="ver-datos"><summary>Ver datos</summary><div class="tabla-scroll"><table class="historial"><thead><tr>' +
    columnas.map((c) => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' +
    filas.map((f) => '<tr>' + f.map((v) => '<td>' + esc(v) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div></details>';
}
