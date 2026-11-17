// 🔮 Predicciones con tus propios datos (sin pantalla, para poder probarlas). Modelos pequeños que corren en el celular,
// sin internet, y que antes de decir algo se prueban contra tu pasado: si no predicen mejor que "seguirás igual", lo dicen
// y no muestran la predicción.
//   1. Peso y gasto real: la recta de tus pesos de 4 semanas dice a dónde vas y cuándo llegas a la meta; con las comidas
//      marcadas, cuántas calorías gastas de verdad (lo que comes menos lo que cambia tu peso × 7.700 kcal/kg).
//   2. Fuerza: la recta del 1RM estimado de cada ejercicio, a 4 semanas, con su margen, y aviso de estancamiento.
//   3. Carga: gym y fútbol juntos (minutos × esfuerzo). Carga de 7 días contra la de 6 semanas (fatiga contra forma).
// Más el texto de la revisión semanal para pegar en una IA (promptSemanal).
import { e, tipoDieta, comidasDelDia } from './estado.js';
import { iso, sumarDias, diasEntre, lunesDe, semanaDe, fechaCorta } from './fechas.js';
import { historial, lineasFuerza, resumenSemana, formatoPeso, progresoMes, estancamiento } from './gym.js';
import { totalPlan, pesos, tendencia } from './dieta.js';
import { partidos } from './registro.js';
import { contexto, volumenSemana } from './analisis.js';
import { focoDe } from './registro.js';

const f1 = (n) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const miles = (n) => Math.round(n).toLocaleString('es-CO');
const promedio = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const KCAL_KG = 7700;

// ---------- Recta por mínimos cuadrados, con el margen de una predicción (95 %) ----------
export function recta(puntos) {
  const n = puntos.length;
  if (n < 3) return null;
  const xm = promedio(puntos.map((p) => p.x)), ym = promedio(puntos.map((p) => p.y));
  const sxx = puntos.reduce((s, p) => s + (p.x - xm) ** 2, 0);
  if (!sxx) return null;
  const b = puntos.reduce((s, p) => s + (p.x - xm) * (p.y - ym), 0) / sxx, a = ym - b * xm;
  const s = Math.sqrt(puntos.reduce((t, p) => t + (p.y - (a + b * p.x)) ** 2, 0) / Math.max(1, n - 2));
  // t de Student aproximada para pocos puntos (n − 2 grados de libertad)
  const t = n <= 4 ? 4.3 : n <= 6 ? 2.8 : n <= 10 ? 2.3 : 2.0;
  return { a, b, s, n, predecir: (x) => ({ y: a + b * x, margen: t * s * Math.sqrt(1 + 1 / n + (x - xm) ** 2 / sxx) }) };
}

// ---------- 1. Peso ----------
// Pesos de las 4 semanas hasta "hoy": al menos 8 registros en 14 días o más
const VENTANA = 28, MIN_PESOS = 8, MIN_TRAMO = 14;
const tramo = (lista, hoy) => lista.filter((x) => x.fecha <= hoy && diasEntre(x.fecha, hoy) < VENTANA);
const sirveTramo = (t) => t.length >= MIN_PESOS && diasEntre(t[0].fecha, t[t.length - 1].fecha) >= MIN_TRAMO;
function rectaPeso(lista, hoy) {
  const t = tramo(lista, hoy);
  return sirveTramo(t) ? recta(t.map((x) => ({ x: -diasEntre(x.fecha, hoy), y: x.peso }))) : null;
}

// Prueba contra el pasado: desde cada fecha con datos suficientes, predice el peso de 14 días después y lo compara con el
// promedio real de esos días; "sin modelo" = el promedio de los últimos 7 registros se queda igual
export function probarPeso(lista, horizonte = 14) {
  const errM = [], errI = [];
  if (lista.length < MIN_PESOS * 2) return { n: 0 };
  for (let k = MIN_PESOS - 1; k < lista.length; k += 3) {
    const hoy = lista[k].fecha, r = rectaPeso(lista, hoy);
    if (!r) continue;
    const meta = sumarDias(hoy, horizonte), reales = lista.filter((x) => Math.abs(diasEntre(meta, x.fecha)) <= 3);
    if (!reales.length) continue;
    const real = promedio(reales.map((x) => x.peso)), base = tendencia(lista.slice(0, k + 1));
    errM.push(Math.abs(r.predecir(horizonte).y - real));
    errI.push(Math.abs(base - real));
  }
  return errM.length ? { n: errM.length, modelo: promedio(errM), sinModelo: promedio(errI) } : { n: 0 };
}
// ¿Gana el modelo? Con menos de 3 pruebas aún no se sabe (se muestra como estimación inicial)
const veredicto = (p) => (p.n < 3 ? 'pocas' : p.modelo <= p.sinModelo ? 'gana' : 'pierde');

export function pronosticoPeso(lista, hoy = iso(), meta = null) {
  const r = rectaPeso(lista, hoy), t = tramo(lista, hoy);
  if (!r) return { listo: false, faltan: Math.max(0, MIN_PESOS - t.length), texto: 'Pésate al menos ' + MIN_PESOS + ' veces en 2 semanas para predecir tu peso (llevas ' + t.length + ' en las últimas 4).' };
  const ahora = r.predecir(0).y, en4 = r.predecir(28), semana = r.b * 7, prueba = probarPeso(lista), v = veredicto(prueba);
  let llegada = null;
  if (meta && Math.abs(r.b) > 0.005 && Math.sign(meta - ahora) === Math.sign(r.b)) {
    const dias = Math.round((meta - ahora) / r.b);
    if (dias > 0 && dias <= 365) llegada = { fecha: sumarDias(hoy, dias), dias };
  } else if (meta && Math.abs(meta - ahora) < 0.3) llegada = { fecha: hoy, dias: 0 };
  // El margen nunca baja de 0,3 kg: el peso del día a día se mueve al menos eso
  return { listo: true, ahora, semana, en4: en4.y, margen: Math.max(0.3, en4.margen), llegada, meta, prueba, veredicto: v };
}

// Gasto real: días con las comidas marcadas casi completas (80 % o más de las calorías del plan de ese día)
export const DIA_COMPLETO = 0.8;
export function ingestas(hasta = iso(), dias = VENTANA, est = e()) {
  if (!est.dieta) return [];
  const out = [];
  for (let i = 1; i <= dias; i++) {
    const f = sumarDias(hasta, -i), c = comidasDelDia(f);
    if (!c.n) continue;
    const plan = est.dieta.planes[tipoDieta(f)], meta = plan ? totalPlan(plan, est.dieta.alimentos).kcal : 0;
    if (meta && c.kcal >= meta * DIA_COMPLETO) out.push({ fecha: f, kcal: c.kcal });
  }
  return out;
}
const MIN_COMIDAS = 10;
export function gastoReal(lista, comidas, hoy = iso()) {
  const r = rectaPeso(lista, hoy);
  if (!r || comidas.length < MIN_COMIDAS) return { listo: false, dias: comidas.length, texto: 'Marca tus comidas en Dieta → Hoy al menos ' + MIN_COMIDAS + ' días de 4 semanas (llevas ' + comidas.length + ') y pésate seguido: así se calcula cuánto gastas de verdad.' };
  const come = promedio(comidas.map((x) => x.kcal)), gasto = come - r.b * KCAL_KG;
  if (gasto < 1200 || gasto > 5000) return { listo: false, dias: comidas.length, texto: 'Los datos no cuadran (sale un gasto de ' + miles(gasto) + ' kcal): revisa que las comidas marcadas sean las que comes.' };
  return { listo: true, come, gasto, dias: comidas.length, balance: come - gasto };
}

// ---------- 2. Fuerza ----------
const MIN_SEMANAS = 4, ULTIMAS = 8;
const puntosFuerza = (hist) => hist.filter((p) => p.semana >= 1).slice(-ULTIMAS).map((p) => ({ x: p.semana, y: p.rm }));
// Para cada ejercicio: con sus semanas anteriores predice la siguiente; "sin modelo" = igual que la última
export function probarFuerza(hists) {
  const errM = [], errI = [];
  for (const hist of hists) {
    const ps = hist.filter((p) => p.semana >= 1);
    for (let k = MIN_SEMANAS; k < ps.length; k++) {
      const r = recta(ps.slice(Math.max(0, k - ULTIMAS), k).map((p) => ({ x: p.semana, y: p.rm })));
      if (!r) continue;
      errM.push(Math.abs(r.predecir(ps[k].semana).y - ps[k].rm) / ps[k].rm);
      errI.push(Math.abs(ps[k - 1].rm - ps[k].rm) / ps[k].rm);
    }
  }
  return errM.length ? { n: errM.length, modelo: promedio(errM), sinModelo: promedio(errI) } : { n: 0 };
}
export function pronosticoFuerza(hist, semana) {
  const ps = puntosFuerza(hist);
  if (ps.length < MIN_SEMANAS) return null;
  const r = recta(ps);
  if (!r) return null;
  const ultimo = ps[ps.length - 1], en4 = r.predecir(semana + 4), mejor = Math.max(...ps.map((p) => p.y));
  const porSemana = r.b / ultimo.y, parado = estancamiento(hist);
  // Se viene un estancamiento: la recta casi no sube (menos de 0,3 % por semana) o ya van 2 semanas sin récord
  const aviso = porSemana < 0.003 ? (parado && parado.estancado ? 'estancado' : 'frenando') : null;
  // El margen nunca baja del 2 %: el 1RM estimado de una semana a otra varía al menos eso
  return { actual: ultimo.y, en4: en4.y, margen: Math.max(ultimo.y * 0.02, en4.margen), porSemana, mejor, aviso, unidad: hist[hist.length - 1].unidad };
}

// ---------- 3. Carga de gym y fútbol ----------
// Carga de un día (Foster: minutos × esfuerzo de 1 a 10). Gym: los minutos del contador del entreno, o 3 min por serie
// si no se usó, con esfuerzo 7. Fútbol: minutos × esfuerzo anotados del partido
const ESFUERZO_GYM = 7, MIN_POR_SERIE = 3;
export function cargasDiarias(est = e(), hasta = iso()) {
  const c = {};
  const sumar = (f, n) => { if (n > 0 && f <= hasta) c[f] = (c[f] || 0) + n; };
  for (const n of Object.keys(est.semanas || {}).map(Number).filter((n) => n >= 1)) {
    for (const d of est.rutina) {
      if (!d.diaSemana) continue;
      const f = sumarDias(lunesDe(n), d.diaSemana - 1), hechas = resumenSemana([d], est.semanas[n] || {}).hechas;
      if (!hechas) continue;
      const x = (est.dias[f] || {}).entreno, min = x && x.fin ? (x.fin - x.inicio) / 60000 : 0;
      // Si hay contador, cuenta una sola vez por día (aunque ese día tenga dos rutinas)
      if (min > 0) { if (!c['@' + f]) { c['@' + f] = 1; sumar(f, Math.min(180, min) * ESFUERZO_GYM); } }
      else sumar(f, hechas * MIN_POR_SERIE * ESFUERZO_GYM);
    }
  }
  for (const p of partidos(est)) sumar(p.fecha, p.carga);
  for (const k of Object.keys(c)) if (k[0] === '@') delete c[k];
  return c;
}
// Fatiga (7 días) contra forma (6 semanas): promedios diarios. Necesita 4 semanas desde la primera carga anotada
export function carga(cargas, hoy = iso()) {
  const fechas = Object.keys(cargas).filter((f) => f <= hoy).sort();
  if (!fechas.length || diasEntre(fechas[0], hoy) < 28) return { listo: false, texto: 'Con 4 semanas de entrenos anotados se mide tu carga (gym y fútbol juntos).' };
  const suma = (dias) => fechas.filter((f) => diasEntre(f, hoy) < dias).reduce((s, f) => s + cargas[f], 0);
  const aguda = suma(7) / 7, cronica = suma(42) / Math.min(42, diasEntre(fechas[0], hoy) + 1);
  if (!cronica) return { listo: false, texto: 'Sin entrenos en las últimas 6 semanas.' };
  const ratio = aguda / cronica;
  const nivel = ratio > 1.5 ? 'alta' : ratio > 1.3 ? 'subiendo' : ratio < 0.8 ? 'baja' : 'ok';
  const texto = {
    alta: 'Esta semana llevas ' + f1(ratio) + ' veces tu carga normal: riesgo alto de lesión y de rendir menos. Haz la próxima sesión suave (mitad de series) y duerme más.',
    subiendo: 'Tu carga va en ' + f1(ratio) + ' (sobre 1,3 sube el riesgo): no sumes más esta semana.',
    ok: 'Carga en ' + f1(ratio) + ': en la zona buena (0,8 a 1,3). Puedes apretar.',
    baja: 'Carga en ' + f1(ratio) + ': entrenaste menos de lo normal. Vas descansado; si vuelves fuerte, sube poco a poco.',
  }[nivel];
  return { listo: true, aguda, cronica, ratio, nivel, texto };
}
// ¿Sirve la carga para predecir cómo rindes? Rendimiento de cada sesión contra su propia tendencia (sesiones), con la
// carga de ese día alta (más de 1,3) o normal. Con menos de 3 sesiones de cada lado no concluye
export function probarCarga(cargas, sesiones) {
  const alta = [], normal = [];
  for (const s of sesiones) {
    const c = carga(cargas, sumarDias(s.fecha, -1));
    if (!c.listo) continue;
    (c.ratio > 1.3 ? alta : normal).push(s.rend);
  }
  if (alta.length < 3 || normal.length < 3) return { n: alta.length + normal.length, alta: alta.length, normal: normal.length };
  return { n: alta.length + normal.length, alta: alta.length, normal: normal.length, diferencia: promedio(alta) - promedio(normal) };
}

// ---------- Todo junto, con los datos de la app ----------
export function predicciones(hoy = iso(), est = e()) {
  const lista = pesos(est.dias).filter((x) => x.fecha <= hoy), c = (est.dieta || {}).config || {};
  const peso = pronosticoPeso(lista, hoy, c.meta || null), gasto = gastoReal(lista, ingestas(hoy, VENTANA, est), hoy);
  const sem = semanaDe(hoy), lineas = lineasFuerza(est.rutina.filter((d) => d.id !== 'core'));
  const hists = lineas.map((l) => ({ ...l, hist: historial(est.semanas, est.rutina, l.ej, 0, sem, l.v) }));
  const fuerza = hists.map((l) => ({ nombre: l.nombre, ...pronosticoFuerza(l.hist, sem) })).filter((x) => x.actual != null);
  const pruebaFuerza = probarFuerza(hists.map((l) => l.hist));
  const cargas = cargasDiarias(est, hoy);
  return { peso, gasto, fuerza, pruebaFuerza, veredictoFuerza: veredicto(pruebaFuerza), carga: carga(cargas, hoy), cargas };
}

// Una línea por predicción, para la pantalla y para la IA
export function textoPrueba(p, unidad) {
  if (!p.n) return 'Aún no hay con qué probarla contra tu pasado.';
  const fmt = (x) => (unidad === '%' ? f1(x * 100) + ' %' : f1(x) + ' ' + unidad);
  return 'Probada ' + p.n + ' veces con tu pasado: se equivoca ' + fmt(p.modelo) + ' en promedio (sin modelo, ' + fmt(p.sinModelo) + ').';
}

// ---------- 4. Revisión de la semana para pegar en una IA ----------
// Sin nombre, correo ni nada que identifique a la persona: solo los números de la semana
export function promptSemanal(hoy = iso(), est = e()) {
  const P = predicciones(hoy, est), sem = semanaDe(hoy), mes = progresoMes(est.semanas, est.rutina, sem), c = (est.dieta || {}).config || {};
  const foco = focoDe(est, sem), lista = pesos(est.dias).filter((x) => x.fecha <= hoy && diasEntre(x.fecha, hoy) < 14);
  const pe = P.peso, ga = P.gasto, ca = P.carga;
  const lineasPeso = pe.listo
    ? ['- Ahora (recta de 4 semanas): ' + f1(pe.ahora) + ' kg, ' + (pe.semana > 0 ? '+' : '') + f1(pe.semana) + ' kg por semana',
      '- En 4 semanas: ' + f1(pe.en4) + ' kg (± ' + f1(pe.margen) + ')' + (pe.meta ? ' · meta ' + f1(pe.meta) + ' kg' + (pe.llegada ? ', llegaría el ' + pe.llegada.fecha : ', a este ritmo no llega') : ''),
      '- ' + textoPrueba(pe.prueba, 'kg')]
    : ['- ' + pe.texto];
  return [
    'Eres mi entrenador personal y nutricionista deportivo: experto en fuerza, hipertrofia, recomposición corporal y fútbol amateur.',
    'Haz la revisión de mi semana con estos datos. Respóndeme en español, claro, directo y honesto: si algo va mal, dilo.',
    '',
    '## Lo que necesito',
    '1. Veredicto de la semana en 3 frases: ¿avancé, me estanqué o retrocedí, y por qué?',
    '2. Peso y comida: ¿el ritmo es el correcto para mi meta? Si hay que mover calorías, dime cuántas y en qué comidas.',
    '3. Fuerza: qué ejercicios van bien, cuáles se están frenando y qué cambio concreto haría en cada uno.',
    '4. Carga y recuperación: ¿toca descarga? Mira sueño, fútbol y carga.',
    '5. Revisa mis predicciones: ¿te parecen creíbles con estos datos? ¿Qué dato me falta anotar para que sean mejores?',
    '6. El plan de la próxima semana: las 3 acciones más importantes, con números (peso × reps, kcal, horas de sueño).',
    'Si te falta un dato, dilo y no lo inventes. Si ves una señal de lesión o sobreentrenamiento, ponla de primera.',
    '',
    '## Semana ' + sem + ' (hasta el ' + fechaCorta(hoy) + ')',
    ...(foco && foco.foco ? ['- Foco que me puse: ' + foco.foco] : []),
    '- Series por músculo (hechas/planeadas):',
    ...volumenSemana(sem, est).map((x) => '  - ' + x),
    '',
    '## Peso',
    '- Pesos de las últimas 2 semanas: ' + (lista.length ? lista.map((x) => fechaCorta(x.fecha) + ' ' + f1(x.peso)).join(' · ') : 'ninguno'),
    ...lineasPeso,
    ...(c.estatura ? ['- Estatura: ' + c.estatura + ' cm'] : []),
    '',
    '## Comida y gasto real',
    ...(ga.listo ? ['- Días con las comidas marcadas: ' + ga.dias + ' de 28', '- Como en promedio ' + miles(ga.come) + ' kcal y mi gasto real calculado es ' + miles(ga.gasto) + ' kcal (balance ' + (ga.balance > 0 ? '+' : '') + miles(ga.balance) + ' kcal/día)',
      '- Ojo: solo cuenta lo que marco del plan; lo que como fuera del plan no está.'] : ['- ' + ga.texto]),
    '',
    '## Fuerza (1RM estimado)',
    ...(mes.length ? mes.map((x) => '- ' + x.nombre + ' último mes: ' + (x.cambio > 0 ? '+' : '') + f1(x.cambio * 100) + ' %') : ['- Aún hay pocas semanas para comparar']),
    ...P.fuerza.map((x) => '- Predicción ' + x.nombre + ': ahora ' + formatoPeso(x.actual) + ' ' + x.unidad + ', en 4 semanas ' + formatoPeso(Math.round(x.en4 * 2) / 2) + ' (± ' + f1(x.margen) + ')' + (x.aviso ? ' · ' + (x.aviso === 'estancado' ? 'estancado' : 'se está frenando') : '')),
    '- ' + textoPrueba(P.pruebaFuerza, '%'),
    '',
    '## Carga (gym + fútbol, minutos × esfuerzo)',
    '- ' + ca.texto,
    '',
    '## Recuperación y contexto',
    ...contexto(hoy, est).map((x) => '- ' + x),
  ].join('\n');
}
