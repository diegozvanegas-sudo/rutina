// El plan de comida de un día para mandar por WhatsApp: como texto (con *negritas* de WhatsApp) y como imagen (PNG),
// con los mismos datos que se ven en 🥗 Dieta → Hoy (las comidas, sus alimentos, kcal y macros, y lo ya comido)
import { fechaLarga, hora } from './fechas.js';
import { totalPlan, totalComida } from './dieta.js';
import { entregarImagen } from './imagen.js';

const r0 = (n) => Math.round(n || 0);
const miles = (n) => r0(n).toLocaleString('es-CO');
const coma = (n) => String(n).replace('.', ',');

// Lo que va en el texto y en la imagen (sin pantalla, para poder probarlo).
// plan: { comidas: [{ nombre, items: [{ alimento, cant }] }] } · hechas: dias[fecha].comidas · tipo: la clave del plan
export function resumenDieta({ plan, alimentos, hechas = {}, tipo, titulo, fecha }) {
  const total = totalPlan(plan, alimentos), alimento = (id) => alimentos.find((a) => a.id === id);
  const comidas = plan.comidas.map((c, i) => {
    const t = totalComida(c, alimentos), marca = hechas[tipo + ':' + i];
    return {
      nombre: c.nombre, kcal: r0(t.kcal), p: r0(t.p), hecha: marca ? hora(marca.ts) : null,
      items: c.items.map((it) => { const a = alimento(it.alimento); return (a ? a.nombre : it.alimento) + (a && a.por !== 'libre' ? ' ' + coma(it.cant) + ' ' + (a.por === 'g' ? 'g' : 'u') : ''); }),
    };
  });
  // Lo comido, como en la pantalla (estado.js comidasDelDia): todas las comidas marcadas del día
  const comido = Object.values(hechas).reduce((s, x) => ({ kcal: s.kcal + ((x && x.kcal) || 0), p: s.p + ((x && x.p) || 0) }), { kcal: 0, p: 0 });
  return {
    titulo, fecha: fechaLarga(fecha), kcal: r0(total.kcal), p: r0(total.p), c: r0(total.c), g: r0(total.g),
    comido: { kcal: r0(comido.kcal), p: r0(comido.p) }, hechas: comidas.filter((c) => c.hecha).length, comidas,
  };
}

export function textoDieta(r) {
  const lineas = ['🍽️ *Mi plan de comida · ' + r.fecha + '*', r.titulo + ' — *' + miles(r.kcal) + ' kcal*', 'Proteína ' + r.p + ' g · Carbos ' + r.c + ' g · Grasa ' + r.g + ' g'];
  if (r.hechas) lineas.push('Llevo ' + r.hechas + ' de ' + r.comidas.length + ' comidas: ' + miles(r.comido.kcal) + ' kcal y ' + r.comido.p + ' g de proteína');
  for (const c of r.comidas) {
    lineas.push('', (c.hecha ? '✅' : '⬜') + ' *' + c.nombre + '* (' + miles(c.kcal) + ' kcal · P ' + c.p + ' g)' + (c.hecha ? ' · ' + c.hecha : ''));
    if (c.items.length) lineas.push('   ' + c.items.join(', '));
  }
  return lineas.join('\n');
}

// ---------- La imagen ----------
const W = 1080, M = 48, FUENTE = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const T = { bg: '#101418', tarjeta: '#181e24', linea: '#2c3640', ink: '#e9eef2', muted: '#93a1ad', brand: '#3dd68c' };
const ANCHO_ITEMS = W - 2 * M - 56;

// Parte el texto en líneas que caben en el ancho (máximo "max" líneas, la última con "…")
function lineasDe(ctx, texto, ancho, max = 3) {
  const palabras = texto.split(' '), lineas = [];
  let actual = '';
  for (const p of palabras) {
    const prueba = actual ? actual + ' ' + p : p;
    if (ctx.measureText(prueba).width <= ancho || !actual) actual = prueba;
    else { lineas.push(actual); actual = p; }
  }
  if (actual) lineas.push(actual);
  if (lineas.length > max) {
    const resto = lineas.slice(0, max);
    let u = resto[max - 1];
    while (u.length > 1 && ctx.measureText(u + '…').width > ancho) u = u.slice(0, -1);
    resto[max - 1] = u + '…';
    return resto;
  }
  return lineas;
}

export function dibujarDieta(canvas, r) {
  const ctx = canvas.getContext('2d'), f = (peso, px) => { ctx.font = peso + ' ' + px + 'px ' + FUENTE; };
  // Primero se miden los alimentos de cada comida para saber el alto
  f(400, 28);
  const items = r.comidas.map((c) => lineasDe(ctx, c.items.join(' · '), ANCHO_ITEMS));
  const altoComida = (i) => 76 + items[i].length * 38 + 18;
  canvas.width = W;
  canvas.height = 330 + r.comidas.reduce((h, _, i) => h + altoComida(i) + 16, 0) + 40;
  f(400, 28); // el cambio de tamaño borra la fuente
  ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, canvas.height);
  let y = M + 50;
  f(800, 50); ctx.fillStyle = T.ink; ctx.fillText('🍽️ Mi plan de comida', M, y);
  y += 46; f(400, 30); ctx.fillStyle = T.muted; ctx.fillText(r.fecha.charAt(0).toUpperCase() + r.fecha.slice(1) + ' · ' + r.titulo, M, y);
  y += 64; f(800, 44); ctx.fillStyle = T.brand; ctx.fillText(miles(r.kcal) + ' kcal', M, y);
  f(600, 30); ctx.fillStyle = T.ink; ctx.textAlign = 'right'; ctx.fillText('P ' + r.p + ' g · C ' + r.c + ' g · G ' + r.g + ' g', W - M, y); ctx.textAlign = 'left';
  y += 26;
  const parte = r.kcal ? Math.min(1, r.comido.kcal / r.kcal) : 0;
  ctx.fillStyle = T.linea; ctx.beginPath(); ctx.roundRect(M, y, W - 2 * M, 14, 7); ctx.fill();
  if (parte) { ctx.fillStyle = T.brand; ctx.beginPath(); ctx.roundRect(M, y, Math.max(14, (W - 2 * M) * parte), 14, 7); ctx.fill(); }
  y += 44; f(400, 26); ctx.fillStyle = T.muted;
  ctx.fillText(r.hechas ? 'Llevo ' + r.hechas + ' de ' + r.comidas.length + ' comidas · ' + miles(r.comido.kcal) + ' kcal · ' + r.comido.p + ' g de proteína' : r.comidas.length + ' comidas en el día', M, y);
  y += 30;
  r.comidas.forEach((c, i) => {
    const h = altoComida(i);
    ctx.fillStyle = T.tarjeta; ctx.beginPath(); ctx.roundRect(M, y, W - 2 * M, h, 18); ctx.fill();
    if (c.hecha) { ctx.strokeStyle = T.brand; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(M + 1.5, y + 1.5, W - 2 * M - 3, h - 3, 17); ctx.stroke(); }
    ctx.fillStyle = c.hecha ? T.brand : T.linea; ctx.beginPath(); ctx.arc(M + 44, y + 46, 14, 0, 2 * Math.PI); ctx.fill();
    if (c.hecha) { f(800, 20); ctx.fillStyle = T.bg; ctx.textAlign = 'center'; ctx.fillText('✓', M + 44, y + 53); ctx.textAlign = 'left'; }
    f(700, 34); ctx.fillStyle = T.ink; ctx.fillText(c.nombre + (c.hecha ? '  ' : ''), M + 74, y + 58);
    if (c.hecha) { const w = ctx.measureText(c.nombre + '  ').width; f(400, 24); ctx.fillStyle = T.muted; ctx.fillText(c.hecha, M + 74 + w, y + 58); }
    f(600, 28); ctx.fillStyle = T.muted; ctx.textAlign = 'right'; ctx.fillText(miles(c.kcal) + ' kcal · P ' + c.p, W - M - 28, y + 58); ctx.textAlign = 'left';
    f(400, 28); ctx.fillStyle = T.ink;
    items[i].forEach((l, k) => ctx.fillText(l, M + 28, y + 76 + 30 + k * 38));
    y += h + 16;
  });
  return canvas;
}

// Crea la imagen y la comparte (WhatsApp, galería…); si el navegador no deja compartir archivos, la descarga
export function compartirDieta(r, fecha) {
  return entregarImagen(dibujarDieta(document.createElement('canvas'), r), 'plan de comida ' + fecha, 'Mi plan de comida');
}
