// Metas del día: agua, pasos, calorías y lectura, con historial de 7 y 30 días
import { e, guardar, dia, avanceMetas, alternarCrono, segundosCrono } from '../estado.js';
import { iso, sumarDias, fechaCorta, reloj, diaSemana } from '../fechas.js';
import { barra, pct, miles, registrar } from '../ui.js';

const NOMBRES = { agua: '💧 Agua', pasos: '👟 Pasos', calorias: '🍽️ Calorías', lectura: '📖 Lectura' };
const UNIDAD = { agua: 'ml', pasos: '', calorias: 'kcal', lectura: 'min' };
const formato = (k, v) => (k === 'agua' ? (v / 1000).toLocaleString('es-CO', { maximumFractionDigits: 2 }) + ' L' : miles(v) + (UNIDAD[k] ? ' ' + UNIDAD[k] : ''));

function controles(k, fecha) {
  if (k === 'agua') {
    return '<div class="botones-rapidos">' +
      '<button type="button" class="boton grande" data-accion="agua" data-ml="250">+250 ml</button>' +
      '<button type="button" class="boton grande" data-accion="agua" data-ml="500">+500 ml</button>' +
      '<button type="button" class="boton secundario" data-accion="agua" data-ml="-250" aria-label="Quitar 250 ml">−</button></div>';
  }
  if (k === 'pasos') {
    return '<label class="campo">Pasos de hoy<input type="number" inputmode="numeric" min="0" step="100" data-cambio="meta" data-k="pasos" value="' + (dia(fecha).metas.pasos || '') + '" placeholder="0"></label>';
  }
  if (k === 'calorias') {
    return '<div class="dos">' +
      '<label class="campo">Fuera del plan<input type="number" inputmode="numeric" min="0" data-cambio="meta" data-k="calorias" value="' + (dia(fecha).metas.calorias || '') + '" placeholder="0"></label>' +
      '<label class="campo">Sumar comida<input type="number" inputmode="numeric" min="0" data-cambio="comida" placeholder="kcal"></label></div>' +
      '<a class="nota-corta" href="#dieta">Las comidas del plan se marcan en 🥗 Dieta y se suman solas.</a>';
  }
  const c = dia(fecha).crono.lectura, corre = c && c.inicio;
  return '<div class="crono"><span class="reloj" data-crono="' + fecha + '|lectura">' + reloj(segundosCrono(c)) + '</span>' +
    '<button type="button" class="boton grande" data-accion="crono-lectura">' + (corre ? '⏸ Pausa' : '▶ Leer') + '</button>' +
    '<button type="button" class="boton secundario" data-accion="lectura-mas" title="Sumar 5 minutos leídos sin cronómetro">+5 min</button></div>';
}

export function tarjetaMeta(k, fecha = iso(), compacta = false) {
  const a = avanceMetas(fecha), meta = a.meta[k];
  return '<div class="meta meta-' + k + (a.partes[k] >= 1 ? ' cumplida' : '') + '">' +
    '<div class="fila-resumen"><b>' + NOMBRES[k] + '</b><span>' + formato(k, a.valores[k]) + ' / ' + formato(k, meta) + '</span></div>' +
    barra(a.partes[k], 'meta') + (compacta && k !== 'agua' ? '' : controles(k, fecha)) + '</div>';
}

function historial(dias) {
  const filas = [];
  for (let i = dias - 1; i >= 0; i--) {
    const f = sumarDias(iso(), -i);
    filas.push({ f, a: e().dias[f] ? avanceMetas(f) : null });
  }
  return filas;
}

export function vistaMetas() {
  const hoy = avanceMetas(), semana = historial(7), mes = historial(30);
  const promedio = (k) => mes.reduce((s, x) => s + (x.a ? x.a.partes[k] : 0), 0) / mes.length;
  const cumplidos = (k) => mes.filter((x) => x.a && x.a.partes[k] >= 1).length;
  const letra = (f) => 'LMMJVSD'[diaSemana(f) - 1];
  return '<h1>Metas del día</h1>' +
    '<section class="tarjeta"><div class="fila-resumen"><b>Hoy</b><span class="grande-num">' + pct(hoy.total) + '</span></div>' + barra(hoy.total) + '</section>' +
    '<section class="tarjeta lista-metas">' + Object.keys(NOMBRES).map((k) => tarjetaMeta(k)).join('') + '</section>' +
    '<section class="tarjeta"><h2>Últimos 7 días</h2><div class="tabla-scroll"><table class="historial"><thead><tr><th></th>' +
    semana.map((x) => '<th title="' + fechaCorta(x.f) + '">' + letra(x.f) + '<small>' + fechaCorta(x.f).split(' ')[0] + '</small></th>').join('') + '</tr></thead><tbody>' +
    Object.keys(NOMBRES).map((k) => '<tr><th>' + NOMBRES[k] + '</th>' + semana.map((x) => {
      const p = x.a ? x.a.partes[k] : 0;
      return '<td><span class="punto" style="--p:' + p + '" title="' + pct(p) + '">' + (p >= 1 ? '✓' : '') + '</span></td>';
    }).join('') + '</tr>').join('') + '</tbody></table></div></section>' +
    '<section class="tarjeta"><h2>Últimos 30 días</h2>' + Object.keys(NOMBRES).map((k) =>
      '<div class="fila-resumen"><span>' + NOMBRES[k] + '</span><span>' + cumplidos(k) + ' días cumplida · promedio ' + pct(promedio(k)) + '</span></div>' + barra(promedio(k))).join('') + '</section>';
}

registrar({
  agua({ ml }) { const m = dia().metas; m.agua = Math.max(0, (m.agua || 0) + Number(ml)); guardar(); },
  meta({ k }, el) { dia().metas[k] = Math.max(0, Number(el.value) || 0); guardar(); },
  comida(ds, el) {
    const n = Number(el.value) || 0;
    if (!n) return;
    const m = dia().metas;
    m.calorias = (m.calorias || 0) + n;
    guardar();
  },
  'crono-lectura'() { alternarCrono(iso(), 'lectura'); guardar(); },
  'lectura-mas'() { const m = dia().metas; m.lectura = (m.lectura || 0) + 5; guardar(); },
});
