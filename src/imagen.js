// Resumen del día del gym como imagen (PNG) para compartir por WhatsApp: los mismos datos que el texto, con los colores del registro
import { lunesDe, sumarDias, fechaCorta } from './fechas.js';
import { estadoFila, repsDe, resumenSemana, textoCardio, claveCardio } from './gym.js';

const DIAS_CORTOS = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const COLORES = { vacio: '#4a5866', falta: '#f5c542', completo: '#3dd68c', sube: '#5aa9ff' };
const T = { bg: '#101418', tarjeta: '#181e24', linea: '#2c3640', ink: '#e9eef2', muted: '#93a1ad', brand: '#3dd68c' };

// Lo que va en la imagen (sin pantalla, para poder probarlo)
export function resumenDia(d, sem, estado) {
  const regs = estado.semanas[sem] || {}, lunes = lunesDe(sem), r = resumenSemana([d], regs);
  const ejercicio = (ej, sufijo = '') => ({
    nombre: ej.nombre, musculo: ej.musculo,
    filas: ej.filas.map((f) => {
      const reg = regs[f.id + sufijo] || {}, est = estadoFila(f, reg), reps = repsDe(reg.reps), peso = String(reg.peso || '').trim();
      return {
        esquema: (f.tipo === 'Series' ? '' : f.tipo + ' ') + f.esquema, color: est.color, hechas: est.hechas, plan: est.plan,
        datos: reps.length ? (peso ? peso.replace('.', ',') + ' ' + (reg.unidad || 'kg') + ' × ' : '') + reps.join(' · ') : '—',
      };
    }),
  });
  const core = estado.rutina.find((x) => x.id === 'core'), sufijo = '@' + d.id;
  const coreHecho = core ? core.ejercicios.filter((ej) => ej.filas.some((f) => repsDe((regs[f.id + sufijo] || {}).reps).length)) : [];
  const c = d.cardio ? regs[claveCardio(d)] || {} : null;
  return {
    titulo: (d.diaSemana ? DIAS_CORTOS[d.diaSemana] + ' · ' : '') + d.nombre,
    semana: 'Semana ' + sem + ' · ' + fechaCorta(lunes) + ' – ' + fechaCorta(sumarDias(lunes, 6)),
    hechas: r.hechas, plan: r.plan,
    ejercicios: d.ejercicios.map((ej) => ejercicio(ej)),
    core: coreHecho.map((ej) => ejercicio(ej, sufijo)),
    cardio: c ? d.cardio + ': ' + (textoCardio(c) || '—') + (c.nota ? ' (' + c.nota + ')' : '') : '',
  };
}

// Recorta el texto con "…" si no cabe en el ancho
function cabe(ctx, texto, ancho) {
  if (ctx.measureText(texto).width <= ancho) return texto;
  while (texto.length > 1 && ctx.measureText(texto + '…').width > ancho) texto = texto.slice(0, -1);
  return texto + '…';
}

const W = 1080, M = 48, FUENTE = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const alto = (r) => 250 + [...r.ejercicios, ...r.core].reduce((h, ej) => h + 74 + ej.filas.length * 52, 0) + (r.core.length ? 70 : 0) + (r.cardio ? 110 : 0) + 70;

export function dibujar(canvas, r) {
  canvas.width = W; canvas.height = alto(r);
  const ctx = canvas.getContext('2d'), f = (peso, px) => { ctx.font = peso + ' ' + px + 'px ' + FUENTE; };
  ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, canvas.height);
  let y = M + 50;
  f(800, 52); ctx.fillStyle = T.ink; ctx.fillText(cabe(ctx, '🏋️ ' + r.titulo, W - 2 * M), M, y);
  y += 46; f(400, 30); ctx.fillStyle = T.muted; ctx.fillText(r.semana, M, y);
  f(800, 34); ctx.fillStyle = T.brand; ctx.textAlign = 'right'; ctx.fillText(r.hechas + ' / ' + r.plan + ' series', W - M, y); ctx.textAlign = 'left';
  y += 28;
  ctx.fillStyle = T.linea; ctx.beginPath(); ctx.roundRect(M, y, W - 2 * M, 14, 7); ctx.fill();
  ctx.fillStyle = T.brand; ctx.beginPath(); ctx.roundRect(M, y, Math.max(14, (W - 2 * M) * (r.plan ? r.hechas / r.plan : 0)), 14, 7); ctx.fill();
  y += 44;
  const bloque = (ej) => {
    const h = 58 + ej.filas.length * 52;
    ctx.fillStyle = T.tarjeta; ctx.beginPath(); ctx.roundRect(M, y, W - 2 * M, h, 18); ctx.fill();
    f(700, 34); ctx.fillStyle = T.ink; ctx.fillText(cabe(ctx, ej.nombre, W - 2 * M - 260), M + 28, y + 46);
    f(400, 26); ctx.fillStyle = T.muted; ctx.textAlign = 'right'; ctx.fillText(ej.musculo || '', W - M - 28, y + 46); ctx.textAlign = 'left';
    let yy = y + 58;
    for (const fila of ej.filas) {
      ctx.fillStyle = COLORES[fila.color]; ctx.beginPath(); ctx.arc(M + 40, yy + 26, 9, 0, 2 * Math.PI); ctx.fill();
      f(400, 28); ctx.fillStyle = T.muted; ctx.fillText(cabe(ctx, fila.esquema, 330), M + 64, yy + 36);
      f(600, 30); ctx.fillStyle = fila.datos === '—' ? T.muted : T.ink; ctx.fillText(cabe(ctx, fila.datos, W - 2 * M - 540), M + 410, yy + 36);
      f(700, 26); ctx.fillStyle = COLORES[fila.color]; ctx.textAlign = 'right';
      ctx.fillText(fila.color === 'sube' ? '⬆ sube' : fila.hechas + '/' + fila.plan, W - M - 28, yy + 36); ctx.textAlign = 'left';
      yy += 52;
    }
    y += h + 16;
  };
  r.ejercicios.forEach(bloque);
  if (r.core.length) { y += 30; f(800, 36); ctx.fillStyle = T.ink; ctx.fillText('💪 Core', M, y); y += 24; r.core.forEach(bloque); }
  if (r.cardio) {
    y += 10; ctx.fillStyle = T.tarjeta; ctx.beginPath(); ctx.roundRect(M, y, W - 2 * M, 84, 18); ctx.fill();
    f(600, 30); ctx.fillStyle = T.ink; ctx.fillText(cabe(ctx, '🏃 ' + r.cardio, W - 2 * M - 56), M + 28, y + 52);
    y += 100;
  }
  f(400, 24); ctx.fillStyle = T.muted; ctx.textAlign = 'center';
  ctx.fillText('⚪ sin anotar   🟡 faltan series   🟢 completo   🔵 sube peso', W / 2, canvas.height - 34); ctx.textAlign = 'left';
  return canvas;
}

// Crea la imagen y la comparte (WhatsApp, galería…); si el navegador no deja compartir archivos, la descarga
export async function compartirImagen(d, sem, estado) {
  const canvas = dibujar(document.createElement('canvas'), resumenDia(d, sem, estado));
  const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
  const nombre = ('resumen ' + d.nombre + ' semana ' + sem).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-') + '.png';
  const archivo = new File([blob], nombre, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
    try { await navigator.share({ files: [archivo], title: d.nombre }); return 'compartida'; } catch (err) { if (err.name === 'AbortError') return 'cancelada'; }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = nombre; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return 'descargada';
}
