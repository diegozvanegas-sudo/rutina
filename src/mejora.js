// Mejorar un poco cada día: tendencia frente al último mes, qué te funciona, experimento de la semana e inglés con horas reales.
import { e, avanceMetas, fraccionManana, habitosDe, mananaCompleta, comidasDelDia, planDieta } from './estado.js';
import { iso, sumarDias, semanaDe, diasEntre } from './fechas.js';
import { resumenSemana } from './gym.js';
import { pesos as pesosCorporales, tendencia } from './dieta.js';
import { horasSueno } from './registro.js';
import { puntajeDia, rango } from './progreso.js';

const promedio = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

// ¿Mejoró? Menos del 2 % de diferencia cuenta como igual
export function compararValores(ahora, antes, mayorEsMejor = true) {
  if (ahora == null || antes == null) return 'sin-datos';
  const dif = ahora - antes, margen = Math.abs(antes) * 0.02;
  if (Math.abs(dif) <= margen) return 'igual';
  return dif > 0 === mayorEsMejor ? 'mejor' : 'peor';
}

// Últimos 7 días frente a las 4 semanas anteriores. Pide algo de datos en los dos lados para no sacar conclusiones de un solo día
export function comparativa(hoy = iso()) {
  const esta = rango(7, hoy), mes = rango(28, sumarDias(hoy, -7)), dias = e().dias;
  const serie = (fs, valor, minimo) => { const v = fs.map(valor).filter((x) => x != null); return v.length >= minimo ? promedio(v) : null; };
  const conDia = (f) => !!dias[f];
  const lados = (valor) => [serie(esta, valor, 3), serie(mes, valor, 5)];
  const fila = (id, icono, nombre, ir, unidad, [ahora, antes], mayorEsMejor = true) => ({ id, icono, nombre, ir, unidad, ahora, antes, estado: compararValores(ahora, antes, mayorEsMejor) });
  const lista = [
    fila('puntaje', '⭐', 'Puntaje del día', '#hoy', '/100', lados((f) => { const p = conDia(f) && puntajeDia(f); return p ? p.total : null; })),
    fila('manana', '☀️', 'Mañana cumplida', '#manana', '%', lados((f) => (conDia(f) && habitosDe(f).length ? fraccionManana(f) * 100 : null))),
    fila('sueno', '🌙', 'Horas de sueño', '#hoy', 'h', lados((f) => (conDia(f) ? horasSueno(dias[f].sueno) : null))),
  ];
  // Gym: la última semana completa frente a las 4 anteriores (la de ahora todavía no termina)
  const s = semanaDe(hoy) - 1, series = (n) => {
    const reg = e().semanas[n];
    return reg ? resumenSemana(e().rutina, reg, e().config.objetivos).hechas : null;
  };
  const previas = [1, 2, 3, 4].map((k) => series(s - k)).filter((x) => x != null);
  lista.push(fila('gym', '🏋️', 'Series por semana', '#gym/resumen', '', [series(s), previas.length >= 2 ? promedio(previas) : null]));
  // Estudio: minutos por día, contando los días sin estudiar
  const est = (e().estudio || {}).dias || {}, minutos = (fs) => fs.reduce((t, f) => t + ((est[f] || {}).minutos || 0), 0) / fs.length;
  lista.push(fila('estudio', '🎓', 'Estudio por día', '#estudiar', 'min', [mes.some((f) => est[f]) || esta.some((f) => est[f]) ? minutos(esta) : null, mes.some((f) => est[f]) ? minutos(mes) : null]));
  // Ahorro: lo aportado en 7 días frente al promedio semanal del mes
  const movs = (e().finanzas?.movimientos || []).filter((m) => m.tipo === 'ahorro');
  const ahorro = (fs) => movs.filter((m) => fs.includes(m.fecha)).reduce((t, m) => t + (m.monto || 0), 0);
  lista.push(fila('ahorro', '🐷', 'Ahorro por semana', '#finanzas', '$', movs.length ? [ahorro(esta), ahorro(mes) / 4] : [null, null]));
  // Peso: mejora si se acerca a la meta; sin meta solo se muestra
  if (e().dieta) {
    const pesos = pesosCorporales(dias), ahora = tendencia(pesos), antes = tendencia(pesos.filter((x) => x.fecha <= sumarDias(hoy, -28))), meta = e().dieta.config.meta;
    const f = fila('peso', '⚖️', 'Peso (promedio)', '#progreso', 'kg', [ahora ?? null, antes ?? null], meta != null && antes != null ? meta > antes : true);
    if (meta == null && f.estado !== 'sin-datos') f.estado = 'igual';
    lista.push(f);
  }
  return lista;
}

// Qué te funciona: promedios de tus días según una condición. Solo compara con al menos 5 días de cada lado. Es una relación, no prueba la causa
export function compararGrupos(filas, minimo = 5, margen = 5) {
  const si = filas.filter((x) => x.cond).map((x) => x.valor), no = filas.filter((x) => !x.cond).map((x) => x.valor);
  if (si.length < minimo || no.length < minimo) return null;
  const a = promedio(si), b = promedio(no);
  return { si: a, no: b, nSi: si.length, nNo: no.length, dif: a - b, nota: Math.abs(a - b) >= margen };
}
export function queFunciona(hoy = iso()) {
  const dias = e().dias, fs = rango(90, hoy).filter((f) => dias[f]);
  const durmio = (f) => horasSueno(dias[f].sueno);
  const grupos = (selec, cond, valor) => compararGrupos(fs.filter(selec).map((f) => ({ cond: cond(f), valor: valor(f) })).filter((x) => x.valor != null));
  const metas = (f) => { const t = avanceMetas(f).total; return t == null ? null : t * 100; };
  const comidas = (f) => { const n = planDieta(f).comidas.length; return n ? Math.min(1, comidasDelDia(f).n / n) * 100 : null; };
  const conSueno = (f) => durmio(f) != null;
  const salida = [
    { titulo: 'Dormir 7 horas o más', medida: 'de tus metas', r: grupos(conSueno, (f) => durmio(f) >= 7, metas) },
    { titulo: 'Dormir 7 horas o más', medida: 'de tus comidas', r: grupos(conSueno, (f) => durmio(f) >= 7, comidas) },
    { titulo: 'Completar la mañana', medida: 'de tus metas', r: grupos((f) => habitosDe(f).length > 0, mananaCompleta, metas) },
  ];
  return { frases: salida.filter((x) => x.r), dias: fs.length };
}

// ---------- Experimento de la semana: un solo cambio, 7 días ----------
export const experimentos = () => (e().experimentos ??= []);
export const experimentoActivo = () => experimentos().find((x) => !x.decision) || null;
export function estadoExperimento(x, hoy = iso()) {
  const dia = diasEntre(x.inicio, hoy) + 1, cumplidos = Object.keys(x.dias || {}).length;
  return { dia: Math.min(dia, 7), cumplidos, termino: dia > 7, hoyListo: !!(x.dias || {})[hoy] };
}
export function nuevoExperimento(cambio, medida, hoy = iso()) {
  const x = { id: 'x' + Date.now().toString(36), cambio, medida, inicio: hoy, dias: {}, decision: '' };
  experimentos().push(x);
  return x;
}

// ---------- Inglés: horas reales hacia la meta y prueba mensual ----------
export const META_INGLES = 135; // 90 minutos diarios durante 90 días
export const ingles = () => ((e().estudio ??= { cursos: {}, tarjetas: {}, dias: {} }).ingles ??= { minutos: {}, pruebas: [], meta: META_INGLES });
export function resumenIngles(i, hoy = iso()) {
  const total = Object.values(i.minutos).reduce((a, b) => a + b, 0), semana = rango(7, hoy).reduce((t, f) => t + (i.minutos[f] || 0), 0);
  const meta = (i.meta || META_INGLES) * 60, ultima = i.pruebas[i.pruebas.length - 1] || null;
  return { horas: total / 60, meta: meta / 60, fraccion: Math.min(1, total / meta), semanaHoras: semana / 60, ultima, tocaPrueba: !ultima || diasEntre(ultima.fecha, hoy) >= 30 };
}
