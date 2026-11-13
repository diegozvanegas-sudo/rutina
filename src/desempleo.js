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
import { iso, sumarDias, diaSemana } from './fechas.js';
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
