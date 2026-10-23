// Progreso: tablero con gráficos de todo (constancia, puntaje, peso, gym, metas y plata) y la revisión semanal
import { e, avanceMetas, racha, repintar, semanaActual } from '../estado.js';
import { iso, sumarDias, fechaCorta, diaSemana, lunesDe } from '../fechas.js';
import { resumenSemana } from '../gym.js';
import { pesos as pesosCorporales, tendencia } from '../dieta.js';
import { resumenMes, mesDe, sumarMeses, pesos } from '../finanzas.js';
import { puntajeDia, rango, revisionSemanal } from '../progreso.js';
import { barras, barrasAgrupadas, linea, calendario, barrasH, tablaDatos } from '../graficos.js';
import { esc, registrar } from '../ui.js';

let dias = 30;
const LETRA = ['', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
const corta = (f) => fechaCorta(f).split(' ')[0] + '/' + (Number(f.slice(5, 7)));
const kg = (n) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const millones = (n) => (n >= 1e6 ? (Math.round(n / 1e5) / 10).toLocaleString('es-CO') + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'k' : String(Math.round(n)));
// ir: sección a la que lleva el título de la tarjeta ("#dieta/peso" abre Dieta en la pestaña Peso)
const tarjeta = (titulo, cuerpo, nota = '', ir = '') => '<section class="tarjeta grafica">' +
  (ir ? '<a class="titulo-enlace" href="' + ir + '"><h2>' + titulo + '</h2><span aria-hidden="true">›</span></a>' : '<h2>' + titulo + '</h2>') +
  (nota ? '<p class="nota-corta">' + nota + '</p>' : '') + cuerpo + '</section>';
const ir = (href, texto) => '<a href="' + href + '">' + texto + '</a>';

function indicadores() {
  const hoy = puntajeDia(), semana = rango(7).map(puntajeDia).filter(Boolean), prom = semana.length ? Math.round(semana.reduce((s, p) => s + p.total, 0) / semana.length) : null;
  const lista = e().dieta ? pesosCorporales(e().dias) : [], peso = tendencia(lista), previo = tendencia(lista.filter((x) => x.fecha <= sumarDias(iso(), -7)));
  const gym = resumenSemana(e().rutina, e().semanas[semanaActual()] || {}), mes = e().finanzas ? resumenMes(e().finanzas, mesDe(iso())) : null;
  const tile = (titulo, valor, sub = '', href = '') => '<a class="kpi" href="' + href + '"><small>' + titulo + ' <span aria-hidden="true">›</span></small><b>' + valor + '</b>' + (sub ? '<span>' + sub + '</span>' : '') + '</a>';
  return '<div class="kpis">' +
    tile('Puntaje de hoy', hoy ? hoy.total : '—', '/100', '#hoy') +
    tile('Promedio 7 días', prom ?? '—', prom != null ? '/100' : '', '#hoy') +
    tile('Racha mañana', racha() + ' 🔥', racha() === 1 ? 'día' : 'días', '#manana') +
    tile('Peso (prom. 7 d)', peso ? kg(peso) + ' kg' : '—', peso && previo ? (peso <= previo ? '▼ ' : '▲ ') + kg(Math.abs(peso - previo)) + ' en la semana' : 'anota tu peso', '#dieta/peso') +
    tile('Gym semana ' + semanaActual(), gym.hechas + '/' + gym.plan, Math.round((gym.hechas / gym.plan) * 100) + ' % de las series', '#gym/resumen') +
    (mes ? tile('Ahorro del mes', mes.tasaAhorro == null ? '—' : Math.round(mes.tasaAhorro * 100) + ' %', mes.ingresos ? 'de lo que entró' : 'registra ingresos', mes.ingresos ? '#finanzas/mes' : '#finanzas/registrar') : '') + '</div>';
}

function constancia() {
  // 12 semanas que terminan en la actual: columnas lunes → domingo
  const lunesHoy = sumarDias(iso(), 1 - diaSemana()), semanas = [], titulos = [];
  for (let s = 11; s >= 0; s--) {
    const lunes = sumarDias(lunesHoy, -7 * s);
    titulos.push(Number(lunes.slice(8, 10)) <= 7 ? ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][Number(lunes.slice(5, 7)) - 1] : '');
    semanas.push(Array.from({ length: 7 }, (_, k) => {
      const f = sumarDias(lunes, k);
      if (f > iso()) return null;
      const p = puntajeDia(f);
      return { v: p ? p.total / 100 : null, tip: LETRA[k + 1] + ' ' + fechaCorta(f) + ': ' + (p ? p.total + '/100' : 'sin datos') };
    }));
  }
  return tarjeta('🗓️ Constancia', calendario(semanas, { titulos }) +
    '<div class="leyenda-rampa"><span>Menos</span>' + [0, 1, 2, 3, 4].map((n) => '<i class="cal-' + n + '"></i>').join('') + '<span>Más</span></div>',
    'Cada cuadro es un día: entre más claro, más alto el puntaje (mañana, metas, gym y dieta).', '#hoy');
}

function puntajes() {
  const fs = rango(dias), ps = fs.map((f) => ({ f, p: puntajeDia(f) }));
  const datos = ps.map(({ f, p }) => ({ etiqueta: corta(f), v: p ? p.total : null, tip: LETRA[diaSemana(f)] + ' ' + fechaCorta(f) + ': ' + (p ? p.total + '/100 · mañana ' + Math.round(p.partes.manana * 100) + ' %, metas ' + Math.round(p.partes.metas * 100) + ' %' +
    (p.partes.gym != null ? ', gym ' + Math.round(p.partes.gym * 100) + ' %' : '') + (p.partes.dieta != null ? ', dieta ' + Math.round(p.partes.dieta * 100) + ' %' : '') : 'sin datos') }));
  return tarjeta('⭐ Puntaje por día', barras(datos, { max: 100, ref: { v: 80, texto: 'buen día: 80' } }) +
    tablaDatos(['Día', 'Puntaje'], ps.filter((x) => x.p).map(({ f, p }) => [fechaCorta(f), p.total])), '', '#hoy');
}

function graficoPeso() {
  if (!e().dieta) return '';
  const lista = pesosCorporales(e().dias), meta = e().dieta.config.meta;
  if (!lista.length) return tarjeta('⚖️ Peso', '<p class="nota-corta">' + ir('#dieta/peso', 'Anota tu peso en 🥗 Dieta → Peso') + ' para ver la línea.</p>', '', '#dieta/peso');
  const fs = rango(Math.max(dias, 14)), porFecha = Object.fromEntries(lista.map((x) => [x.fecha, x.peso]));
  const puntos = fs.map((f) => {
    const hasta = lista.filter((x) => x.fecha <= f), t = hasta.length && porFecha[f] != null ? tendencia(hasta) : null;
    return { etiqueta: corta(f), v: t, tip: fechaCorta(f) + (porFecha[f] != null ? ': ' + kg(porFecha[f]) + ' kg (promedio 7: ' + kg(t) + ')' : ': sin registro') };
  });
  return tarjeta('⚖️ Peso (promedio de 7 registros)', linea(puntos, { formato: kg, ref: puntos.some((p) => p.v != null && p.v - meta < 6) ? { v: meta, texto: 'meta ' + kg(meta) } : null }) +
    tablaDatos(['Fecha', 'Peso (kg)'], lista.slice(-dias).reverse().map((x) => [fechaCorta(x.fecha), kg(x.peso)])), 'La línea es el promedio para que un día con más agua no te engañe.', '#dieta/peso');
}

function graficoGym() {
  const actual = semanaActual(), desde = Math.max(1, actual - 11), datos = [];
  for (let s = desde; s <= actual; s++) {
    const r = resumenSemana(e().rutina, e().semanas[s] || {});
    datos.push({ etiqueta: 'S' + s, v: r.hechas, plan: r.plan, tip: 'Semana ' + s + ' (' + fechaCorta(lunesDe(s)) + '): ' + r.hechas + ' de ' + r.plan + ' series' });
  }
  return tarjeta('🏋️ Series por semana', barras(datos, { ref: { v: datos[datos.length - 1].plan, texto: 'plan ' + datos[datos.length - 1].plan } }) +
    tablaDatos(['Semana', 'Series', 'Plan'], datos.map((d) => [d.etiqueta, d.v, d.plan])), '', '#gym/resumen');
}

function graficoCardio() {
  const actual = semanaActual(), desde = Math.max(1, actual - 11), datos = [];
  for (let s = desde; s <= actual; s++) {
    const regs = e().semanas[s] || {}, dias = Object.keys(regs).filter((k) => k.startsWith('cardio@') && regs[k].min > 0);
    const min = dias.reduce((t, k) => t + regs[k].min, 0);
    datos.push({ etiqueta: 'S' + s, v: min, tip: 'Semana ' + s + ': ' + min + ' min de cardio en ' + dias.length + (dias.length === 1 ? ' día' : ' días') });
  }
  if (!datos.some((d) => d.v)) return '';
  // Plan: la suma del mínimo de cada día con cardio ("30-35 min" → 30)
  const plan = e().rutina.reduce((t, d) => t + (Number(((d.cardio || '').match(/(\d+)/) || [])[1]) || 0), 0);
  return tarjeta('🏃 Minutos de cardio por semana', barras(datos, plan ? { ref: { v: plan, texto: 'plan ' + plan + ' min' } } : {}) +
    tablaDatos(['Semana', 'Minutos'], datos.map((d) => [d.etiqueta, d.v])), '', '#gym');
}

function graficoMetas() {
  const fs = rango(dias), nombres = { agua: '💧 Agua', pasos: '👟 Pasos', calorias: '🍽️ Calorías', lectura: '📖 Lectura' };
  // Cuatro gráficos pequeños con la misma escala (0–100 % de la meta), uno por meta
  return tarjeta('🎯 Metas cumplidas', '<p class="nota-corta">Últimos ' + dias + ' días, de izquierda (antes) a derecha (hoy). Toca una barra para ver el día.</p><div class="multiples">' + Object.entries(nombres).map(([k, t]) => {
    const datos = fs.map((f) => {
      const a = e().dias[f] ? avanceMetas(f) : null;
      return { etiqueta: corta(f), v: a ? Math.round(a.partes[k] * 100) : null, tip: fechaCorta(f) + ': ' + (a ? Math.round(a.partes[k] * 100) + ' % de la meta' : 'sin datos') };
    });
    return '<div><h3>' + t + '</h3>' + barras(datos, { alto: 60, max: 100, formato: (n) => n + '%', sinEtiquetas: true }) + '</div>';
  }).join('') + '</div>', '', '#metas');
}

function graficoPlata() {
  if (!e().finanzas) return '';
  const meses = Array.from({ length: 6 }, (_, i) => mesDe(sumarMeses(iso().slice(0, 8) + '01', i - 5)));
  const NOM = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const res = meses.map((m) => [m, resumenMes(e().finanzas, m)]);
  if (!res.some(([, r]) => r.ingresos || r.gastos)) return tarjeta('💰 Plata', '<p class="nota-corta">' + ir('#finanzas/registrar', 'Registra gastos e ingresos en 💰 Finanzas') + ' para ver los meses.</p>', '', '#finanzas/registrar');
  const grupos = res.map(([m, r]) => ({ etiqueta: NOM[Number(m.slice(5, 7)) - 1], valores: [r.ingresos, r.gastos], tips: [NOM[Number(m.slice(5, 7)) - 1] + ': ingresos ' + pesos(r.ingresos), NOM[Number(m.slice(5, 7)) - 1] + ': gastos ' + pesos(r.gastos)] }));
  const actual = res[res.length - 1][1], cats = e().finanzas.categorias.gasto;
  const porCat = Object.entries(actual.porCategoria).sort((a, b) => b[1] - a[1]);
  const top = porCat.slice(0, 6), resto = porCat.slice(6).reduce((s, [, v]) => s + v, 0);
  const filas = top.map(([id, v]) => { const c = cats.find((x) => x.id === id) || { nombre: id, icono: '' }; return { etiqueta: c.icono + ' ' + c.nombre, v, tip: c.nombre + ': ' + pesos(v) + ' (' + Math.round((v / actual.gastos) * 100) + ' %)' }; });
  if (resto) filas.push({ etiqueta: 'Otras', v: resto, tip: 'Otras categorías: ' + pesos(resto) });
  return tarjeta('💰 Ingresos y gastos por mes', '<div class="leyenda"><span><i class="serie-1"></i>Ingresos</span><span><i class="serie-2"></i>Gastos</span></div>' +
    barrasAgrupadas(grupos, [{ nombre: 'Ingresos', clase: 'serie-1' }, { nombre: 'Gastos', clase: 'serie-2' }], { formato: millones }) +
    tablaDatos(['Mes', 'Ingresos', 'Gastos', 'Diferencia'], res.map(([m, r]) => [NOM[Number(m.slice(5, 7)) - 1] + ' ' + m.slice(0, 4), pesos(r.ingresos), pesos(r.gastos), pesos(r.ingresos - r.gastos)])), '', '#finanzas/mes') +
    (filas.length ? tarjeta('🧾 En qué se va la plata este mes', barrasH(filas, { formato: pesos }), '', '#finanzas/presupuesto') : '');
}

function revision() {
  return '<section class="tarjeta revision"><h2>📝 Revisión de la semana</h2><ul>' + revisionSemanal().map((f) =>
    '<li>' + (f.ir ? '<a href="' + f.ir + '">' : '') + '<span>' + f.icono + '</span><span class="txt">' + esc(f.texto) + '</span>' + (f.ir ? '<span class="flecha" aria-hidden="true">›</span></a>' : '') + '</li>').join('') + '</ul></section>';
}

export function vistaProgreso() {
  return '<div class="cab-vista"><h1>Progreso</h1><div class="chips filtro" role="group" aria-label="Rango">' + [7, 30, 90].map((n) =>
    '<button type="button" class="chip' + (n === dias ? ' activo' : '') + '" data-accion="prog-dias" data-n="' + n + '">' + n + ' días</button>').join('') + '</div></div>' +
    indicadores() + revision() + '<div class="tablero-graficos">' + constancia() + puntajes() + graficoPeso() + graficoGym() + graficoCardio() + graficoMetas() + graficoPlata() + '</div>';
}

registrar({ 'prog-dias'({ n }) { dias = Number(n); repintar(); } });
