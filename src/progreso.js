// Puntaje del día (0–100) y revisión semanal: junta mañana, metas, gym y dieta en un solo número
// y saca frases con lo que mejoró, lo que falta y qué hacer. Cada frase lleva "ir": la sección donde se arregla.
import { e, avanceMetas, hechosManana, fraccionManana, planDieta, comidasDelDia } from './estado.js';
import { iso, sumarDias, semanaDe, diaSemana } from './fechas.js';
import { resumenSemana, progresoMes } from './gym.js';
import { pesos as pesosCorporales, tendencia } from './dieta.js';
import { resumenMes, mesDe, pesos } from './finanzas.js';
import { promedioSueno, partidos } from './registro.js';
import { visibles } from './orden.js';

// Cada parte vale lo mismo; el gym solo cuenta los días que toca entrenar
export function puntajeDia(fecha = iso()) {
  const d = e().dias[fecha];
  if (!d) return null;
  const partes = {}, metas = avanceMetas(fecha).total;
  // Sin metas a la vista, esa parte no cuenta
  if (metas != null) partes.metas = metas;
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
  return { total: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) : 0, partes };
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
    const nombres = { agua: 'el agua', pasos: 'los pasos', calorias: 'las calorías', lectura: 'la lectura', pantalla: 'el tiempo de pantalla' };
    const prom = visibles(e().config, 'metas').map((k) => [k, promedio(conDatos.map((f) => avanceMetas(f).partes[k]))]).sort((a, b) => a[1] - b[1]);
    if (prom.length && prom[0][1] < 0.8) frases.push({ icono: '🎯', ir: '#metas', texto: 'Tu meta más floja es ' + nombres[prom[0][0]] + ': vas al ' + Math.round(prom[0][1] * 100) + ' % en promedio.' });
  }
  // Gym
  const r = resumenSemana(e().rutina, e().semanas[semanaDe(hoy)] || {}, e().config.objetivos);
  const bajos = Object.entries(r.musculos).filter(([, m]) => m.estado === 'Bajo').map(([n]) => n);
  if (r.plan) frases.push({ icono: '🏋️', ir: '#gym/resumen', texto: 'Semana ' + semanaDe(hoy) + ' del gym: ' + r.hechas + ' de ' + r.plan + ' series (' + Math.round((r.hechas / r.plan) * 100) + ' %).' +
    (bajos.length && diaSemana(hoy) >= 6 ? ' Quedan bajos: ' + bajos.slice(0, 3).join(', ') + '.' : '') });
  // Fuerza: en qué subiste en 4 semanas y qué lleva 3+ semanas quieto
  const fuerza = progresoMes(e().semanas, e().rutina, semanaDe(hoy)), suben = fuerza.filter((x) => x.cambio > 0.005), quietos = fuerza.filter((x) => x.est && x.est.estancado);
  if (fuerza.length) {
    const pct = (c) => '+' + (Math.round(c * 1000) / 10).toLocaleString('es-CO') + ' %';
    frases.push({ icono: '💪', ir: '#gym/resumen', texto: (suben.length ? 'En 4 semanas mejoraste en ' + suben.slice(0, 3).map((x) => x.nombre + ' (' + pct(x.cambio) + ')').join(', ') + '.' : 'En 4 semanas ningún ejercicio subió su 1RM estimado.') +
      (quietos.length ? ' Estancados: ' + quietos.slice(0, 3).map((x) => x.nombre).join(', ') + '.' : '') });
  }
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
  // Sueño
  const sueno = promedioSueno(e().dias, esta);
  if (sueno) frases.push({ icono: '🌙', ir: '#hoy', texto: 'Dormiste ' + String(sueno.horas).replace('.', ',') + ' h en promedio (' + sueno.noches + (sueno.noches === 1 ? ' noche anotada' : ' noches anotadas') + ').' +
    (sueno.horas < 7 ? ' Por debajo de 7 h la fuerza y la recuperación bajan: adelanta la hora de acostarte 30 minutos.' : '') });
  // Fútbol
  const jugados = partidos(e()).filter((p) => esta.includes(p.fecha));
  if (jugados.length) {
    const molestias = [...new Set(jugados.flatMap((p) => p.molestias || []))], energia = jugados.filter((p) => p.energia).map((p) => p.energia);
    frases.push({ icono: '⚽', ir: '#progreso', texto: jugados.length + (jugados.length === 1 ? ' partido' : ' partidos') + ', ' + jugados.reduce((t, p) => t + (Number(p.minutos) || 0), 0) + ' minutos' +
      (energia.length ? ', energía ' + String(Math.round(promedio(energia) * 10) / 10).replace('.', ',') + '/5' : '') + '.' +
      (molestias.length ? ' Molestias: ' + molestias.join(', ') + '. Si siguen, baja la pierna pesada y consulta a un fisioterapeuta.' : '') });
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
