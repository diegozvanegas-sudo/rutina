// Análisis al terminar el entreno: un resumen ejercicio por ejercicio para ver en la app y un prompt completo
// (sesión, historial, recuperación, fútbol, dieta) para pegar en Claude como si fuera un entrenador experto.
import { e } from './estado.js';
import { iso, sumarDias, lunesDe, fechaCorta } from './fechas.js';
import { historial, estancamiento, metaSesion, registrosDeFila, repsDe, resumenSemana, formatoPeso, progresoMes } from './gym.js';
import { disposicion, cargaFutbol, textoCarga, proteinaSemana, queTeHaceRendir } from './entrenador.js';
import { pesos, tendencia } from './dieta.js';
import { promedioSueno, partidos } from './registro.js';

const f1 = (n) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const serie = (p) => formatoPeso(p.peso) + ' ' + p.unidad + ' × ' + p.reps;
// Fecha del día de la rutina en esa semana (sin día asignado, el lunes)
export const fechaDelDia = (d, sem) => sumarDias(lunesDe(sem), (Number(d.diaSemana) || 1) - 1);

// Cada ejercicio del día: récord, subió, igual, bajó o estancado, y la meta para la próxima vez
export function resumenEjercicios(d, sem, est = e()) {
  const regs = est.semanas[sem] || {};
  return d.ejercicios.map((ej) => {
    const fila = ej.filas[0], reg = fila ? registrosDeFila(regs, fila).at(-1) : null;
    const hist = historial(est.semanas, est.rutina, ej, 0, sem), hoy = hist.find((p) => p.semana === sem), antes = hist.filter((p) => p.semana !== sem);
    const previo = antes.at(-1), mejorAntes = antes.length ? Math.max(...antes.map((p) => p.rm)) : null, parado = estancamiento(hist);
    const hechas = ej.filas.reduce((s, f) => s + Math.min(registrosDeFila(regs, f).reduce((n, r) => n + repsDe(r.reps).length, 0), f.series), 0);
    const plan = ej.filas.reduce((s, f) => s + f.series, 0);
    let estado = 'sin-dato';
    if (hoy && mejorAntes == null) estado = 'primera';
    else if (hoy && hoy.rm > mejorAntes + 0.05) estado = 'record';
    else if (hoy && previo) estado = hoy.rm > previo.rm + 0.05 ? 'sube' : hoy.rm < previo.rm - 0.05 ? 'baja' : parado && parado.estancado ? 'estancado' : 'igual';
    const meta = fila && reg ? metaSesion(fila, reg) : null;
    return { nombre: ej.nombre, musculo: ej.musculo, estado, hoy, previo, hechas, plan, rir: reg ? reg.rir : null, semanasParado: parado ? parado.semanas : 0,
      meta: meta ? meta.texto : '', cambio: hoy && previo ? (hoy.rm - previo.rm) / previo.rm : null, hist: hist.slice(-6) };
  });
}
export const ICONO_ESTADO = { record: '🏆', primera: '🆕', sube: '⬆️', igual: '➖', baja: '⬇️', estancado: '⚠️', 'sin-dato': '⏳' };
export const TEXTO_ESTADO = { record: 'Récord', primera: 'Primera vez', sube: 'Subió', igual: 'Igual', baja: 'Bajó', estancado: 'Estancado', 'sin-dato': 'Sin anotar' };

// Recuperación y contexto de los últimos días, en frases cortas
export function contexto(fecha, est = e()) {
  const lineas = [], ultimos = (n) => Array.from({ length: n }, (_, i) => sumarDias(fecha, i - n + 1));
  const disp = disposicion(fecha);
  lineas.push('Disposición del día: ' + disp.titulo + ' (' + disp.puntos + '/100)' + (disp.razones.length ? ' · ' + disp.razones.join(', ') : ''));
  const sueno = promedioSueno(est.dias, ultimos(7));
  if (sueno) lineas.push('Sueño, últimos 7 días: ' + f1(sueno.horas) + ' h de promedio (' + sueno.noches + ' noches anotadas)');
  const lista = pesos(est.dias).filter((x) => x.fecha <= fecha), prom = tendencia(lista), hace = tendencia(lista.filter((x) => x.fecha <= sumarDias(fecha, -28)));
  const c = (est.dieta || {}).config || {};
  if (prom) lineas.push('Peso corporal: ' + f1(prom) + ' kg (promedio de 7 registros)' + (hace ? ', ' + (prom - hace > 0 ? '+' : '') + f1(prom - hace) + ' kg en 4 semanas' : '') + (c.meta ? ' · meta ' + f1(c.meta) + ' kg' : '') + (c.estatura ? ' · estatura ' + c.estatura + ' cm' : ''));
  const prot = proteinaSemana(fecha);
  if (prot && prot.gramos) lineas.push('Proteína, últimos 7 días: ' + Math.round(prot.gramos) + ' g/día de promedio, ' + prot.cumplidos + ' de 7 días llegó a la meta');
  const carga = cargaFutbol(fecha);
  if (carga && carga.ratio != null) lineas.push(textoCarga(carga));
  const juegos = partidos(est).filter((p) => p.fecha <= fecha && p.fecha > sumarDias(fecha, -14));
  if (juegos.length) lineas.push('Fútbol, últimos 14 días: ' + juegos.map((p) => fechaCorta(p.fecha) + ' ' + (p.minutos || '?') + ' min, esfuerzo ' + (p.rpe || '?') + '/10' + ((p.molestias || []).length ? ', molestia: ' + p.molestias.join(', ').toLowerCase() : '')).join(' · '));
  const futbol = (est.config.futbol || []).map((n) => ['', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'][n]);
  if (futbol.length) lineas.push('Juega fútbol los ' + futbol.join(' y '));
  for (const x of queTeHaceRendir(fecha).factores) if (x.texto) lineas.push('Qué le hace rendir: ' + x.texto);
  return lineas;
}

// Series por músculo de la semana contra el rango objetivo
export const volumenSemana = (sem, est = e()) => Object.entries(resumenSemana(est.rutina.filter((d) => d.id !== 'core'), est.semanas[sem] || {}, est.config.objetivos).musculos)
  .map(([m, x]) => m + ' ' + x.hechas + '/' + x.plan + ' (objetivo ' + x.min + '-' + x.max + ', ' + x.estado.toLowerCase() + ')');

export function promptEntreno(d, sem, textoDia, est = e()) {
  const fecha = fechaDelDia(d, sem), ejercicios = resumenEjercicios(d, sem, est), mes = progresoMes(est.semanas, est.rutina, sem);
  const lineaEj = (x) => '- ' + x.nombre + ' (' + x.musculo + '): ' + TEXTO_ESTADO[x.estado] + (x.hoy ? ', mejor serie ' + serie(x.hoy) + ' (1RM estimado ' + f1(x.hoy.rm) + ')' : '') +
    (x.previo ? ', la vez anterior ' + serie(x.previo) : '') + ', series ' + x.hechas + '/' + x.plan + (x.rir != null ? ', reps en reserva al final: ' + (x.rir >= 4 ? '4 o más' : x.rir) : '') +
    (x.semanasParado >= 2 ? ', ' + x.semanasParado + ' semanas sin récord' : '') + (x.meta ? '. Meta que propone la app: ' + x.meta : '') +
    (x.hist.length > 1 ? '\n  Historial (semana: mejor serie): ' + x.hist.map((p) => (p.semana ? 'S' + p.semana : 'antes') + ' ' + serie(p)).join(' → ') : '');
  return [
    'Eres mi entrenador personal: experto en fuerza e hipertrofia, recomposición corporal y preparación física para fútbol amateur.',
    'Analiza mi entrenamiento de hoy con todos mis datos y dame un análisis completo, honesto y práctico. Respóndeme en español, claro y directo.',
    '',
    '## Lo que necesito',
    '1. Veredicto de la sesión en 2-3 frases: ¿fue buena, normal o mala, y por qué?',
    '2. Ejercicio por ejercicio: qué pasó, qué significa y la meta exacta para la próxima vez (peso × reps).',
    '3. Estancamientos y fatiga: ¿toca semana de descarga? Si sí, cuál conviene (mitad de las series con el mismo peso o bajar el peso) y por cuánto tiempo.',
    '4. Volumen: ¿qué músculos van cortos o pasados de series esta semana y qué moverías?',
    '5. Recuperación: sueño, proteína, peso corporal y fútbol. ¿Qué me está frenando?',
    '6. Predicción: dónde voy a estar en 4 y 8 semanas en los ejercicios principales y en el peso corporal si sigo así.',
    '7. Las 3 acciones más importantes para la próxima semana, concretas.',
    'Si te falta un dato para concluir algo, dilo y no lo inventes. Si ves una señal de lesión o sobreentrenamiento, ponla de primera.',
    '',
    '## Sesión de hoy (' + fecha + ')',
    textoDia,
    '',
    '## Ejercicios con su historial',
    ...ejercicios.map(lineaEj),
    '',
    '## Volumen de la semana ' + sem + ' (series hechas/planeadas por músculo)',
    ...volumenSemana(sem, est).map((x) => '- ' + x),
    '',
    '## Progreso del último mes (1RM estimado)',
    ...(mes.length ? mes.map((x) => '- ' + x.nombre + ': ' + (x.cambio > 0 ? '+' : '') + f1(x.cambio * 100) + ' %' + (x.est && x.est.estancado ? ' (estancado ' + x.est.semanas + ' semanas)' : '')) : ['- Aún hay pocas semanas para comparar']),
    '',
    '## Recuperación y contexto',
    ...contexto(fecha, est).map((x) => '- ' + x),
  ].join('\n');
}
