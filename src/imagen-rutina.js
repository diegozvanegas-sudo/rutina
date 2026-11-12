// La rutina de la semana como imagen (PNG): cada día con sus ejercicios, series y meta de peso, fútbol, descanso, core y balance por músculo
import { lunesDe, sumarDias, fechaCorta } from './fechas.js';
import { metaSesion, ultimoRegistro, resumenSemana, varianteActual, nombreConVariante } from './gym.js';
import { entregarImagen } from './imagen.js';
import { juegaEl } from './futbol.js';

const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const OK = '#3dd68c', AMARILLO = '#f5c542', AZUL = '#5aa9ff', VIOLETA = '#b48cff', ROJO = '#ff6b6b';
const T = { bg: '#101418', tarjeta: '#181e24', fila: '#212932', linea: '#2c3640', ink: '#e9eef2', muted: '#93a1ad' };

// Lo que va en la imagen (sin pantalla, para poder probarlo)
export function resumenRutina(sem, estado) {
  const lunes = lunesDe(sem), rutina = estado.rutina, sesiones = estado.sesiones || [], cfg = estado.config || {};
  const nombreSesion = (id) => (sesiones.find((s) => s.id === id) || {}).nombre;
  const nombres = (ids) => (ids || []).map(nombreSesion).filter(Boolean);
  const serieDe = (ej) => ej.filas.reduce((s, f) => s + f.series, 0);
  const ejercicio = (ej) => {
    const v = varianteActual(ej), meta = ej.filas[0] ? metaSesion(ej.filas[0], ultimoRegistro(estado.semanas, ej.filas[0], sem, { ej, v })) : null;
    return {
      nombre: nombreConVariante(ej, v), musculo: ej.musculo, series: serieDe(ej), biserie: !!ej.biserie,
      esquema: ej.filas.map((f) => (f.tipo === 'Series' ? '' : f.tipo + ' ') + f.esquema).join(' · '),
      meta: meta ? meta.texto : '', sube: !!(meta && meta.sube),
    };
  };
  const dias = [];
  for (let n = 1; n <= 7; n++) {
    const entrenos = rutina.filter((d) => d.id !== 'core' && d.diaSemana === n).map((d) => {
      const cal = sesiones.some((s) => s.id === 'calentamiento-' + d.calentamiento) ? 'calentamiento-' + d.calentamiento : d.calentamiento;
      const extras = d.extras || (d.calentamiento === 'pierna' ? ['prevencion-futbol', 'rodilla', 'tobillo', 'lazo'] : ['hombro-codo', 'lazo']);
      return {
        nombre: d.nombre, series: d.ejercicios.reduce((s, ej) => s + serieDe(ej), 0), cardio: d.cardio || '',
        calentamiento: d.calentamiento ? nombres([cal, ...extras]) : [], ejercicios: d.ejercicios.map(ejercicio),
      };
    });
    const futbol = juegaEl(cfg, sumarDias(lunes, n - 1));
    dias.push({
      nombre: DIAS[n], fecha: fechaCorta(sumarDias(lunes, n - 1)), entrenos, futbol,
      sesiones: futbol ? nombres(cfg.sesionesPartido) : entrenos.length ? [] : nombres(cfg.sesionesDescanso),
    });
  }
  const r = resumenSemana(rutina.filter((d) => d.id !== 'core' || d.ejercicios.length), estado.semanas?.[sem] || {}, cfg.objetivos);
  const core = rutina.find((d) => d.id === 'core');
  return {
    semana: 'Semana ' + sem + ' · ' + fechaCorta(lunes) + ' – ' + fechaCorta(sumarDias(lunes, 6)),
    totales: { dias: dias.filter((d) => d.entrenos.length).length, series: r.plan, ejercicios: rutina.reduce((s, d) => s + d.ejercicios.length, 0), partidos: dias.filter((d) => d.futbol).length },
    dias,
    core: core && core.ejercicios.length ? core.ejercicios.map(ejercicio) : [],
    musculos: Object.entries(r.musculos).map(([nombre, m]) => ({ nombre, plan: m.plan, min: m.min, max: m.max, estado: m.plan < m.min ? 'Bajo' : m.plan > m.max ? 'Alto' : 'En rango' })),
  };
}

function cabe(ctx, texto, ancho) {
  if (ctx.measureText(texto).width <= ancho) return texto;
  while (texto.length > 1 && ctx.measureText(texto + '…').width > ancho) texto = texto.slice(0, -1);
  return texto + '…';
}

const W = 1600, M = 48, G = 24, COL = (W - 2 * M - G) / 2, FUENTE = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const FILA = 86, CABEZA = 92;
const LINEA = 32, ANCHO_TEXTO = COL - 44, PX_LINEAS = '400 23px ' + FUENTE;
// Reparte una lista de nombres en líneas que quepan, para no cortar ninguno
function enLineas(ctx, nombres, inicio, ancho) {
  ctx.font = PX_LINEAS;
  const lineas = [];
  let actual = inicio;
  for (const n of nombres) {
    const junto = actual + (actual === inicio ? '' : ' · ') + n;
    if (actual !== inicio && ctx.measureText(junto).width > ancho) { lineas.push(actual); actual = n; } else actual = junto;
  }
  actual = actual.replace(/ · $/, '');
  if (actual) lineas.push(actual);
  return lineas;
}
const altoEntreno = (x) => 70 + (x.lineasCal.length ? x.lineasCal.length * LINEA + 8 : 0) + x.ejercicios.length * FILA + (x.cardio ? 52 : 0) + 8;
const altoDia = (d) => CABEZA + d.entrenos.reduce((h, x) => h + altoEntreno(x), 0) + (d.futbol ? 26 + d.lineasSes.length * LINEA + 12 : 0) +
  (!d.futbol && !d.entrenos.length ? 62 + d.lineasSes.length * LINEA : 0) + 18;
const altoCore = (r) => CABEZA + r.core.length * FILA + 18;
const altoMusculos = (r) => 110 + Math.ceil(r.musculos.length / 2) * 72 + 16;
const COLOR_ESTADO = { Bajo: AMARILLO, Alto: ROJO, 'En rango': OK };

// Acomoda las tarjetas en dos columnas, siempre en la más corta, respetando el orden de la semana
function acomodar(r) {
  const y = [0, 0], lugares = [];
  const poner = (tipo, dato, h) => { const c = y[0] <= y[1] ? 0 : 1; lugares.push({ tipo, dato, c, y: y[c], h }); y[c] += h + G; };
  r.dias.forEach((d) => poner('dia', d, altoDia(d)));
  if (r.core.length) poner('core', null, altoCore(r));
  return { lugares, alto: Math.max(...y) };
}

export function dibujarRutina(canvas, r) {
  const ctx = canvas.getContext('2d');
  r = { ...r, dias: r.dias.map((d) => ({
    ...d, lineasSes: enLineas(ctx, d.sesiones, d.futbol ? '⚽ Partido · ' : '', ANCHO_TEXTO - 32),
    entrenos: d.entrenos.map((x) => ({ ...x, lineasCal: x.calentamiento.length ? enLineas(ctx, x.calentamiento, '🔥 ', ANCHO_TEXTO) : [] })),
  })) };
  const { lugares, alto: altoCols } = acomodar(r), arriba = 300;
  canvas.width = W; canvas.height = arriba + altoCols + altoMusculos(r) + 96;
  const f = (peso, px) => { ctx.font = peso + ' ' + px + 'px ' + FUENTE; };
  const caja = (x, y, w, h, rad, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, rad); ctx.fill(); };
  const txt = (t, x, y, color, derecha) => { ctx.fillStyle = color; ctx.textAlign = derecha ? 'right' : 'left'; ctx.fillText(t, x, y); ctx.textAlign = 'left'; };

  ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, canvas.height);
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, '#173a2a'); g.addColorStop(1, '#16283c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 270);
  f(800, 72); txt('🏋️ Mi rutina semanal', M, 106, T.ink);
  f(400, 34); txt(r.semana, M, 156, T.ink);
  const datos = [[r.totales.dias, 'días de gym'], [r.totales.series, 'series'], [r.totales.ejercicios, 'ejercicios'], [r.totales.partidos, r.totales.partidos === 1 ? 'partido' : 'partidos']];
  const wd = (W - 2 * M - 3 * 16) / 4;
  datos.forEach(([n, t], i) => {
    const x = M + i * (wd + 16);
    caja(x, 180, wd, 72, 16, 'rgba(16,20,24,.55)');
    f(800, 36); txt(String(n), x + 22, 228, OK);
    const w = ctx.measureText(String(n)).width;
    f(400, 26); txt(t, x + 34 + w, 227, T.ink);
  });

  const fila = (x, y, w, ej) => {
    caja(x, y, w, FILA - 8, 12, T.fila);
    f(700, 27); txt(cabe(ctx, (ej.biserie ? '⛓ ' : '') + ej.nombre, w - 240), x + 18, y + 33, T.ink);
    f(500, 23); txt(cabe(ctx, ej.musculo || '', 210), x + w - 18, y + 33, VIOLETA, true);
    const meta = ej.meta ? (ej.sube ? '⬆ ' : '🎯 ') + ej.meta : '';
    f(700, 23); const wm = meta ? ctx.measureText(meta).width : 0;
    if (meta) txt(meta, x + w - 18, y + 65, ej.sube ? AZUL : OK, true);
    f(400, 23); txt(cabe(ctx, ej.esquema, w - 50 - wm), x + 18, y + 65, T.muted);
  };
  const cabeza = (x, y, w, titulo, sub, color, derecha) => {
    caja(x, y, 10, 60, 5, color);
    f(800, 38); txt(titulo, x + 26, y + 38, T.ink);
    const wt = ctx.measureText(titulo).width;
    f(400, 25); txt(sub, x + 40 + wt, y + 37, T.muted);
    if (derecha) { f(700, 26); txt(derecha, x + w, y + 37, color, true); }
  };

  for (const l of lugares) {
    const x = M + l.c * (COL + G), yt = arriba + l.y;
    caja(x, yt, COL, l.h, 22, T.tarjeta);
    const xi = x + 22, wi = COL - 44;
    let y = yt + 18;
    if (l.tipo === 'core') {
      const series = r.core.reduce((s, e) => s + e.series, 0);
      cabeza(xi, y, wi, '💪 Core', 'cualquier día', AMARILLO, series + ' series');
      y += CABEZA - 18;
      r.core.forEach((ej) => { fila(xi, y, wi, ej); y += FILA; });
      continue;
    }
    const d = l.dato, color = d.entrenos.length ? OK : d.futbol ? AZUL : T.muted;
    const series = d.entrenos.reduce((s, x2) => s + x2.series, 0);
    cabeza(xi, y, wi, d.nombre, d.fecha, color, series ? series + ' series' : d.entrenos.length ? '' : d.futbol ? 'Partido' : 'Descanso');
    y += CABEZA - 18;
    for (const x2 of d.entrenos) {
      f(800, 31); txt(cabe(ctx, x2.nombre, wi), xi, y + 32, OK);
      y += 58;
      if (x2.lineasCal.length) { f(400, 23); for (const t of x2.lineasCal) { txt(t, xi, y + 18, T.muted); y += LINEA; } y += 8; }
      x2.ejercicios.forEach((ej) => { fila(xi, y, wi, ej); y += FILA; });
      if (x2.cardio) { f(600, 25); txt(cabe(ctx, '🏃 ' + x2.cardio, wi), xi, y + 30, AZUL); y += 52; }
      y += 20;
    }
    if (d.futbol) {
      caja(xi, y, wi, 26 + d.lineasSes.length * LINEA, 12, '#16283c');
      f(600, 23);
      d.lineasSes.forEach((t, i) => txt(t, xi + 16, y + 34 + i * LINEA, AZUL));
    } else if (!d.entrenos.length) {
      f(700, 29); txt('😴 Día de descanso', xi, y + 32, T.ink); y += 62;
      f(400, 23); d.lineasSes.forEach((t) => { txt(t, xi, y + 18, T.muted); y += LINEA; });
    }
  }

  // Balance por músculo: las series que planea la rutina frente al objetivo de cada uno
  const yb = arriba + altoCols;
  caja(M, yb, W - 2 * M, altoMusculos(r), 22, T.tarjeta);
  f(800, 36); txt('💪 Series planeadas por músculo', M + 26, yb + 54, T.ink);
  f(400, 24); txt('Objetivo por semana', W - M - 26, yb + 54, T.muted, true);
  const wm = (W - 2 * M - 52 - 40) / 2;
  r.musculos.forEach((m, i) => {
    const x = M + 26 + (i % 2) * (wm + 40), y = yb + 92 + Math.floor(i / 2) * 72, color = COLOR_ESTADO[m.estado];
    f(600, 26); txt(cabe(ctx, m.nombre, wm - 210), x, y + 22, T.ink);
    f(700, 26); txt(m.plan + ' / ' + m.min + '–' + m.max, x + wm, y + 22, color, true);
    caja(x, y + 36, wm, 12, 6, T.fila);
    caja(x, y + 36, Math.max(12, wm * Math.min(1, m.plan / Math.max(m.max, m.plan, 1))), 12, 6, color);
  });
  f(400, 23); txt('🎯 meta de la próxima sesión   ⬆ toca subir peso   ⛓ biserie: seguido con el siguiente', W / 2 - 480, canvas.height - 36, T.muted);
  return canvas;
}

export function compartirRutina(sem, estado) {
  return entregarImagen(dibujarRutina(document.createElement('canvas'), resumenRutina(sem, estado)), 'rutina semana ' + sem, 'Mi rutina semanal');
}
