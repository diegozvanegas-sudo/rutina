// Plan B (Finanzas → 🛟 Plan B): qué hacer si te quedas sin empleo, a partir de la guía de Comfama en 7 puntos.
// Aquí solo la lógica (se prueba sin navegador); la pantalla está en vistas/desempleo.js.
// Se guarda en finanzas.desempleo (viaja a la nube con lo demás):
//   recursos: { liquidacion, cesantias, ... }  plata disponible de una vez
//   ingresosAlt: { habitacion, ventas, ... }   ingresos alternativos por mes
//   esenciales / noEsenciales: lo que escribiste a mano (null = calculado de tus movimientos)
//   metas: { hojasDia, contactosSemana }       metas pequeñas y alcanzables
//   red: { linkedin: true, ... }               lo hecho de la red de apoyo
//   textos: { fortalezas, transferibles, mejora, alternativas, tengo, oportunidades }
//   dias: { 'AAAA-MM-DD': { siento, emociones: [], gratitud, hojas, contactos, bloques: {} } }
import { iso, sumarDias, diaSemana, fechaCorta } from './fechas.js';
import { mesDe, sumarMeses, gastoDe, abonoDe, patrimonio } from './finanzas.js';

export const RECURSOS = [
  ['liquidacion', 'Liquidación'], ['cesantias', 'Cesantías'], ['indemnizacion', 'Indemnización'],
  ['subsidio', 'Subsidio o seguro de desempleo'], ['inversiones', 'Inversiones a la vista'], ['otros', 'Otros ahorros'],
];
export const INGRESOS_ALT = [['habitacion', 'Alquiler de una habitación'], ['ventas', 'Venta de cosas que no usas'], ['freelance', 'Trabajos por encargo'], ['otros', 'Otros']];
export const EMOCIONES = ['😢 Tristeza', '😠 Enojo', '😨 Miedo', '😰 Ansiedad', '😶 Confusión', '😌 Calma', '🌱 Esperanza', '💪 Ánimo'];
// Horario diario sugerido por la guía (punto 3): se marca cada día
export const BLOQUES = [
  ['busqueda', '🔎 Búsqueda de empleo (portales y redes)'], ['formacion', '🎓 Autoformación (IA, marketing digital…)'],
  ['conversaciones', '☕ Conversación con alguien clave'], ['autocuidado', '🏃 Autocuidado (ejercicio físico y mental)'], ['ocio', '🎈 Un rato de ocio'],
];
// Red de apoyo (punto 4): lo que se hace una vez y queda hecho
export const RED = [
  ['familia', 'Identifiqué 2 o 3 personas de confianza para hablar'], ['linkedin', 'LinkedIn al día (foto, titular, experiencia)'],
  ['asociacion', 'Me uní a una asociación o grupo del sector'], ['evento', 'Fui a un evento de networking este mes'], ['excompaneros', 'Avisé a excompañeros y amigos que estoy buscando'],
];

// ---------- Módulo 2: Liderazgo emergente (guía de Comfama, trabajo autónomo) ----------
// Se guarda en desempleo.lider: { notas: { recursivo: 4, … }, fecha, anterior: { notas, fecha }, textos: {…}, acciones: [{ id, area, accion, plazo, recursos, creado, hecho }] }
export const CARACTERISTICAS = [
  ['recursivo', 'Recursivo', '¿Qué tan bien utilizo los recursos disponibles para resolver problemas?'],
  ['creativo', 'Creativo', '¿Genero ideas originales o busco soluciones fuera de lo común?'],
  ['frustracion', 'Alta tolerancia a la frustración', '¿Qué tan bien manejo los contratiempos en mi vida diaria?'],
  ['apasionado', 'Apasionado', '¿Demuestro entusiasmo genuino por mis proyectos o causas?'],
  ['logro', 'Orientado al logro', '¿Fijo metas claras y trabajo con determinación para alcanzarlas?'],
  ['servicio', 'Orientado al servicio', '¿Priorizo las necesidades de los demás?'],
  ['riesgos', 'Tomador de riesgos', '¿Asumo desafíos calculados?'],
  ['agil', 'Mentalidad ágil', '¿Me adapto fácilmente al cambio?'],
  ['retos', 'Solucionador de retos', '¿Enfrento problemas complejos con enfoques efectivos?'],
  ['autodesarrollo', 'Autodesarrollo (actualizado)', '¿Invierto tiempo en aprender y mejorar mis habilidades?'],
  ['influencia', 'Con impacto e influencia', '¿Logro inspirar o movilizar a otros con mis acciones o ideas?'],
  ['situacional', 'Liderazgo situacional', '¿Adapto mi estilo de liderazgo según las necesidades del contexto y las personas?'],
  ['holistico', 'Pensamiento holístico', '¿Considero todos los factores relevantes antes de tomar una decisión?'],
];
export const PLAZOS = [[1, '1 mes'], [3, '3 meses'], [6, '6 meses']];
const nombreCar = (k) => (CARACTERISTICAS.find((c) => c[0] === k) || [k, k])[1];

export function liderDe(p) {
  const l = (p.lider ??= {});
  l.notas ??= {}; l.textos ??= {}; l.acciones ??= [];
  return l;
}
// Tus 3 mayores fortalezas y tus 3 principales áreas de mejora (en empate, el orden de la tabla). Solo con todo calificado
export function analisisLider(notas) {
  const con = CARACTERISTICAS.filter(([k]) => notas[k] >= 1).map(([k, nombre], i) => ({ k, nombre, n: notas[k], i }));
  const promedio = con.length ? Math.round((con.reduce((s, x) => s + x.n, 0) / con.length) * 10) / 10 : null;
  const completo = con.length === CARACTERISTICAS.length;
  const fuertes = completo ? [...con].sort((a, b) => b.n - a.n || a.i - b.i).slice(0, 3) : [];
  const mejora = completo ? [...con].sort((a, b) => a.n - b.n || a.i - b.i).slice(0, 3) : [];
  return { respondidas: con.length, total: CARACTERISTICAS.length, completo, promedio, fuertes, mejora };
}
// Cuándo vence una acción del plan
export const venceAccion = (a) => sumarMeses(iso(new Date(a.creado || Date.now())), a.plazo || 1);
// Cambio frente a la evaluación anterior (para ver si mejoraste al repetirla)
export function cambiosLider(l) {
  if (!l.anterior) return [];
  return CARACTERISTICAS.map(([k, nombre]) => ({ k, nombre, antes: l.anterior.notas[k], ahora: l.notas[k] }))
    .filter((x) => x.antes >= 1 && x.ahora >= 1 && x.antes !== x.ahora);
}
// Todo el módulo en texto, para compartirlo con alguien de confianza (el último consejo de la guía)
export function textoLider(l) {
  const a = analisisLider(l.notas), L = ['*Liderazgo emergente: mi autoevaluación*' + (l.fecha ? ' (' + fechaCorta(l.fecha) + ')' : '')];
  L.push('', ...CARACTERISTICAS.filter(([k]) => l.notas[k]).map(([k, nombre]) => nombre + ': ' + l.notas[k] + '/5'));
  if (a.promedio != null) L.push('Promedio: ' + String(a.promedio).replace('.', ',') + '/5');
  if (a.completo) L.push('', '💪 Fortalezas: ' + a.fuertes.map((x) => x.nombre).join(', '), '📈 Por mejorar: ' + a.mejora.map((x) => x.nombre).join(', '));
  const t = l.textos;
  if (t.fortalezas) L.push('', '*Cómo aprovecho mis fortalezas*', t.fortalezas);
  if (t.mejora) L.push('', '*Por qué importan mis áreas de mejora*', t.mejora);
  if (t.relacion) L.push('', '*Cómo se relacionan*', t.relacion);
  if (l.acciones.length) {
    L.push('', '*Plan de acción*');
    for (const x of l.acciones) L.push((x.hecho ? '✅ ' : '• ') + nombreCar(x.area) + ': ' + (x.accion || '—') + ' (' + (x.plazo || 1) + (x.plazo > 1 ? ' meses' : ' mes') + (x.recursos ? ' · ' + x.recursos : '') + ')');
  }
  const r = [['aprendido', 'Qué aprendí de mí'], ['aplicar', 'Cómo lo voy a aplicar'], ['compromisos', 'Mis compromisos']].filter(([k]) => t[k]);
  if (r.length) { L.push('', '*Reflexión final*'); for (const [k, titulo] of r) L.push(titulo + ': ' + t[k]); }
  return L.join('\n');
}

// El plan guardado, con lo que falte (se crea la primera vez que se abre)
export function planDe(fin) {
  const p = (fin.desempleo ??= {});
  p.recursos ??= {}; p.ingresosAlt ??= {}; p.red ??= {}; p.textos ??= {}; p.dias ??= {};
  p.metas ??= {};
  p.metas.hojasDia ??= 3; p.metas.contactosSemana ??= 2;
  return p;
}
export const diaPlan = (p, fecha = iso()) => {
  const d = (p.dias[fecha] ??= {});
  d.emociones ??= []; d.bloques ??= {};
  return d;
};

const suma = (o) => Object.values(o || {}).reduce((s, v) => s + (Number(v) > 0 ? Number(v) : 0), 0);

// Gasto esencial (categorías de "necesidad" y abonos a deudas) y no esencial por mes: promedio de los últimos meses completos con datos.
// Sin meses con datos, lo esencial sale de los pagos fijos y las cuotas de las deudas
export function gastosPorGrupo(fin, hoy = iso(), meses = 3) {
  const grupo = Object.fromEntries(fin.categorias.gasto.map((c) => [c.id, c.grupo]));
  const totales = [];
  for (let i = 1; i <= 12 && totales.length < meses; i++) {
    const mes = mesDe(sumarMeses(hoy.slice(0, 8) + '01', -i));
    let esenciales = 0, noEsenciales = 0;
    for (const m of fin.movimientos) {
      if (mesDe(m.fecha) !== mes) continue;
      const g = gastoDe(m) + abonoDe(m);
      if (!g) continue;
      if (abonoDe(m) || grupo[m.categoria] === 'necesidad') esenciales += g; else noEsenciales += g;
    }
    if (esenciales + noEsenciales > 0) totales.push([esenciales, noEsenciales]);
  }
  if (totales.length) {
    const prom = (k) => Math.round(totales.reduce((s, t) => s + t[k], 0) / totales.length);
    return { esenciales: prom(0), noEsenciales: prom(1), meses: totales.length, desde: 'movimientos' };
  }
  const fijos = (fin.fijos || []).filter((x) => x.tipo !== 'ingreso').reduce((s, x) => s + (x.monto || 0), 0);
  const cuotas = (fin.deudas || []).filter((d) => d.saldo > 0).reduce((s, d) => s + (d.cuota || 0), 0);
  return { esenciales: fijos + cuotas, noEsenciales: 0, meses: 0, desde: fijos + cuotas ? 'fijos' : 'nada' };
}

// Cuánto tienes, cuánto gastas al mes y para cuántos meses te alcanza (con todo, o solo con lo esencial)
export function colchon(fin, p = planDe(fin), hoy = iso()) {
  const auto = gastosPorGrupo(fin, hoy);
  const esenciales = p.esenciales ?? auto.esenciales, noEsenciales = p.noEsenciales ?? auto.noEsenciales;
  const pat = patrimonio(fin), enApp = Math.max(0, pat.ahorro + pat.cuentas);
  const recursos = suma(p.recursos), ingresos = suma(p.ingresosAlt);
  const disponible = (p.sinApp ? 0 : enApp) + recursos;
  // Lo que sale cada mes después de los ingresos alternativos
  const quema = (g) => Math.max(0, g - ingresos);
  const meses = (g) => (quema(g) > 0 ? disponible / quema(g) : g > 0 ? Infinity : null);
  return {
    enApp, recursos, ingresos, disponible, esenciales, noEsenciales, auto,
    total: esenciales + noEsenciales,
    diferencia: disponible + ingresos - esenciales - noEsenciales, // lo que queda después de un mes, como en la tabla de la guía
    mesesNormal: meses(esenciales + noEsenciales), mesesAustero: meses(esenciales),
  };
}

// Metas pequeñas: hojas de vida hoy y contactos profesionales en la semana (de lunes a domingo)
export function avanceBusqueda(p, hoy = iso()) {
  const lunes = sumarDias(hoy, 1 - diaSemana(hoy)), semana = Array.from({ length: 7 }, (_, k) => sumarDias(lunes, k)).filter((f) => f <= hoy);
  const de = (k) => semana.reduce((s, f) => s + ((p.dias[f] || {})[k] || 0), 0);
  return {
    hojasHoy: (p.dias[hoy] || {}).hojas || 0, metaHojas: p.metas.hojasDia,
    hojasSemana: de('hojas'), contactosSemana: de('contactos'), metaContactos: p.metas.contactosSemana,
    diasConMeta: semana.filter((f) => ((p.dias[f] || {}).hojas || 0) >= p.metas.hojasDia).length, diasSemana: semana.length,
  };
}

// Los últimos días en que escribiste cómo te sentías (lo más nuevo primero)
export function diarioEmociones(p, hoy = iso(), max = 7) {
  return Object.entries(p.dias).filter(([f, d]) => f <= hoy && ((d.siento || '').trim() || (d.emociones || []).length))
    .sort(([a], [b]) => b.localeCompare(a)).slice(0, max).map(([fecha, d]) => ({ fecha, siento: d.siento || '', emociones: d.emociones || [] }));
}
