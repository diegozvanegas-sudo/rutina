// Puntaje del día (0–100) y revisión semanal: junta mañana, metas, gym y dieta en un solo número
// y saca frases con lo que mejoró, lo que falta y qué hacer. Cada frase lleva "ir": la sección donde se arregla.
import { e, avanceMetas, hechosManana, fraccionManana, planDieta, comidasDelDia } from './estado.js';
import { iso, sumarDias, semanaDe, diaSemana } from './fechas.js';
import { resumenSemana } from './gym.js';
import { pesos as pesosCorporales, tendencia } from './dieta.js';
import { resumenMes, mesDe, pesos } from './finanzas.js';

// Cada parte vale lo mismo; el gym solo cuenta los días que toca entrenar
export function puntajeDia(fecha = iso()) {
  const d = e().dias[fecha];
  if (!d) return null;
  const partes = { metas: avanceMetas(fecha).total };
  // Sin hábitos de mañana, esa parte no cuenta
  if (e().habitos.length) partes.manana = fraccionManana(fecha);
  const diaGym = e().rutina.find((x) => x.diaSemana === diaSemana(fecha));
  if (diaGym) {
    const r = resumenSemana([diaGym], e().semanas[semanaDe(fecha)] || {});
    partes.gym = r.plan ? r.hechas / r.plan : 0;
  }
  if (e().dieta) {
    const total = planDieta(fecha).comidas.length;
    partes.dieta = total ? Math.min(1, comidasDelDia(fecha).n / total) : 0;
  }
  const vals = Object.values(partes);
  return { total: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100), partes };
}

// Días de un rango, del más viejo al de hoy
export function rango(dias, hasta = iso()) {
  return Array.from({ length: dias }, (_, i) => sumarDias(hasta, i - dias + 1));
}
const promedio = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

export function revisionSemanal(hoy = iso()) {
  const frases = [], esta = rango(7, hoy), antes = rango(7, sumarDias(hoy, -7));
  const pts = (fs) => fs.map(puntajeDia).filter(Boolean).map((p) => p.total);
  const pEsta = promedio(pts(esta)), pAntes = promedio(pts(antes));
  if (pEsta != null) {
    frases.push({ icono: '⭐', ir: '#hoy', texto: 'Puntaje promedio de la semana: ' + Math.round(pEsta) + '/100' +
      (pAntes != null ? (pEsta >= pAntes ? ' (▲ ' + Math.round(pEsta - pAntes) + ' vs. la anterior)' : ' (▼ ' + Math.round(pAntes - pEsta) + ' vs. la anterior)') : '') + '.' });
  }
  // Mañana completa
  const completas = esta.filter((f) => e().dias[f] && e().habitos.length && hechosManana(f) === e().habitos.length).length;
  frases.push({ icono: '☀️', ir: '#manana', texto: 'Mañana completa ' + completas + ' de 7 días.' + (completas < 5 ? ' Prepara la noche anterior lo que más se te salta.' : '') });
  // La meta más floja
  const conDatos = esta.filter((f) => e().dias[f]);
  if (conDatos.length) {
    const nombres = { agua: 'el agua', pasos: 'los pasos', calorias: 'las calorías', lectura: 'la lectura' };
    const prom = Object.keys(nombres).map((k) => [k, promedio(conDatos.map((f) => avanceMetas(f).partes[k]))]).sort((a, b) => a[1] - b[1]);
    if (prom[0][1] < 0.8) frases.push({ icono: '🎯', ir: '#metas', texto: 'Tu meta más floja es ' + nombres[prom[0][0]] + ': vas al ' + Math.round(prom[0][1] * 100) + ' % en promedio.' });
  }
  // Gym
  const r = resumenSemana(e().rutina, e().semanas[semanaDe(hoy)] || {}, e().config.objetivos);
  const bajos = Object.entries(r.musculos).filter(([, m]) => m.estado === 'Bajo').map(([n]) => n);
  frases.push({ icono: '🏋️', ir: '#gym/resumen', texto: 'Semana ' + semanaDe(hoy) + ' del gym: ' + r.hechas + ' de ' + r.plan + ' series (' + Math.round((r.hechas / r.plan) * 100) + ' %).' +
    (bajos.length && diaSemana(hoy) >= 6 ? ' Quedan bajos: ' + bajos.slice(0, 3).join(', ') + '.' : '') });
  // Peso: ritmo y cuánto falta
  if (e().dieta) {
    const lista = pesosCorporales(e().dias), ahora = tendencia(lista);
    const previos = lista.filter((x) => x.fecha <= sumarDias(hoy, -7)), entonces = tendencia(previos);
    if (ahora && entonces) {
      const ritmo = ahora - entonces, meta = e().dieta.config.meta;
      let txt = 'Peso: ' + (ritmo <= 0 ? 'bajaste ' : 'subiste ') + Math.abs(ritmo).toFixed(1).replace('.', ',') + ' kg en la semana (promedio de 7 días).';
      if (ritmo < -0.05 && ahora > meta) txt += ' A este ritmo llegas a ' + meta + ' kg en unas ' + Math.ceil((ahora - meta) / -ritmo) + ' semanas.';
      if (ritmo < -1) txt += ' Es rápido: cuida la proteína para no perder músculo.';
      if (ritmo >= 0 && ahora > meta) txt += ' Revisa las porciones o recalcula los planes con tu peso.';
      frases.push({ icono: '⚖️', ir: '#dieta/peso', texto: txt });
    } else if (!lista.length) frases.push({ icono: '⚖️', ir: '#dieta/peso', texto: 'Anota tu peso en Dieta para ver cómo vas hacia la meta.' });
  }
  // Gasto de la semana
  if (e().finanzas) {
    const gasto = (fs) => e().finanzas.movimientos.filter((m) => m.tipo === 'gasto' && fs.includes(m.fecha)).reduce((s, m) => s + m.monto, 0);
    const gEsta = gasto(esta), gAntes = gasto(antes);
    if (gEsta || gAntes) {
      frases.push({ icono: '💰', ir: '#finanzas/mes', texto: 'Gastaste ' + pesos(gEsta) + ' esta semana' + (gAntes ? ' (' + (gEsta >= gAntes ? '+' : '−') + Math.abs(Math.round(((gEsta - gAntes) / gAntes) * 100)) + ' % vs. la anterior)' : '') + '.' });
    }
    const mes = resumenMes(e().finanzas, mesDe(hoy), hoy);
    if (mes.ingresos && mes.tasaAhorro < 0.2) frases.push({ icono: '🐷', ir: '#finanzas/ahorro', texto: 'Este mes vas ahorrando el ' + Math.round(mes.tasaAhorro * 100) + ' % de lo que entra; la meta es al menos 20 %.' });
  }
  return frases;
}
