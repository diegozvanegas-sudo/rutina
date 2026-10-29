// Reglas del registro del gym (sin pantalla, para poder probarlas): series hechas, colores, peso sugerido y resúmenes.
import { OBJETIVOS } from './datos_iniciales.js';

// Cardio de cada día: se guarda por semana con la clave "cardio@idDía"
export const CAMPOS_CARDIO = [
  ['min', 'Minutos', '1'], ['vel', 'Velocidad', '0.1'], ['incl', 'Inclinación', '0.5'], ['fc', 'FC promedio', '1'],
  ['fcMax', 'FC máxima', '1'], ['km', 'Distancia (km)', '0.01'], ['kcal', 'Calorías', '1'],
];
export const claveCardio = (d) => 'cardio@' + d.id;
export const hayCardio = (c) => c && CAMPOS_CARDIO.some(([k]) => c[k] != null && c[k] !== '');
export function textoCardio(c) {
  if (!hayCardio(c)) return '';
  const n = (v) => String(v).replace('.', ',');
  return [c.min != null && c.min !== '' ? c.min + ' min' : '', c.vel ? 'vel ' + n(c.vel) : '', c.incl != null && c.incl !== '' ? 'incl ' + n(c.incl) : '',
    c.fc ? 'FC ' + c.fc + (c.fcMax ? ' (máx ' + c.fcMax + ')' : '') : c.fcMax ? 'FC máx ' + c.fcMax : '', c.km ? n(c.km) + ' km' : '', c.kcal ? c.kcal + ' kcal' : '']
    .filter(Boolean).join(' · ');
}

// "10 9 8" -> [10, 9, 8]. Las reps se guardan siempre como texto; aquí solo se cuentan.
export function repsDe(texto) {
  return (String(texto || '').match(/\d+(?:[.,]\d+)?/g) || []).map((n) => Number(n.replace(',', '.')));
}

// vacio (gris) · falta (amarillo) · completo (verde) · sube (azul: tope del rango en todas las series)
export function estadoFila(fila, reg) {
  const reps = repsDe(reg && reg.reps), hechas = reps.length;
  let color = 'vacio';
  if (hechas) color = hechas < fila.series ? 'falta' : reps.slice(0, fila.series).every((n) => n >= fila.max) ? 'sube' : 'completo';
  return { hechas, plan: fila.series, color };
}

export function numero(v) {
  const n = Number(String(v ?? '').replace(',', '.'));
  return isFinite(n) && String(v ?? '').trim() !== '' ? n : null;
}
const redondear = (n, paso) => Math.round(n / paso) * paso;
export const formatoPeso = (n) => (Math.round(n * 100) / 100).toLocaleString('es-CO');

// Registros de una fila en la semana. El core se anota en el día en que se hace: claves "idFila@idDía".
export function registrosDeFila(registros, fila) {
  return Object.keys(registros || {}).filter((k) => k === fila.id || k.startsWith(fila.id + '@')).sort().map((k) => registros[k]);
}
const conDatos = (r) => r && (repsDe(r.reps).length || String(r.peso || '').trim());

// Último registro de una fila antes de la semana indicada (la semana que se cerró pasa a ser "el último")
export function ultimoRegistro(semanas, fila, semana) {
  const previas = Object.keys(semanas || {}).map(Number).filter((n) => n < semana).sort((a, b) => b - a);
  for (const n of previas) {
    const reg = registrosDeFila(semanas[n], fila).filter(conDatos).pop();
    if (reg) return { ...reg, semana: n };
  }
  return fila.ultimo && (fila.ultimo.reps || fila.ultimo.peso) ? { ...fila.ultimo, semana: null } : null;
}

// Peso para hoy: si la última vez hizo el tope en todas las series, sube 2,5–5 %; si no, el mismo
export function sugerencia(fila, ultimo) {
  if (!ultimo) return null;
  const peso = numero(ultimo.peso), unidad = ultimo.unidad || 'kg';
  if (peso == null) return null;
  if (estadoFila(fila, ultimo).color !== 'sube') return { sube: false, peso, unidad, texto: formatoPeso(peso) + ' ' + unidad };
  if (unidad === 'discos') return { sube: true, peso: peso + 0.5, unidad, texto: formatoPeso(peso + 0.5) + '–' + formatoPeso(peso + 1) + ' discos' };
  const bajo = Math.max(redondear(peso * 1.025, 0.5), peso + 0.5), alto = Math.max(redondear(peso * 1.05, 0.5), bajo);
  return { sube: true, peso: bajo, unidad, texto: formatoPeso(bajo) + (alto > bajo ? '–' + formatoPeso(alto) : '') + ' kg' };
}

// Series de aproximación antes del primer top set
export function aproximacion(peso, unidad = 'kg') {
  if (!peso) return [];
  const paso = unidad === 'discos' ? 0.5 : 2.5;
  return [[0.5, 8], [0.7, 5], [0.85, 2]].map(([p, reps]) => ({ pct: p * 100, peso: Math.max(paso, redondear(peso * p, paso)), reps, unidad }));
}

// Series hechas (sin pasar de las planificadas) por día, total y por músculo en una semana
// objetivos: { músculo: [mín, máx], _: [mín, máx] para los demás } (editables en el resumen del gym)
export function resumenSemana(rutina, registros = {}, objetivos = OBJETIVOS) {
  const dias = [], musculos = {};
  let hechas = 0, plan = 0;
  for (const d of rutina) {
    let dh = 0, dp = 0;
    for (const ej of d.ejercicios) {
      for (const f of ej.filas) {
        const plan = f.series, h = Math.min(registrosDeFila(registros, f).reduce((s, r) => s + repsDe(r.reps).length, 0), plan);
        dh += h; dp += plan;
        const m = (musculos[ej.musculo] ??= { hechas: 0, plan: 0 });
        m.hechas += h; m.plan += plan;
      }
    }
    dias.push({ id: d.id, nombre: d.nombre, hechas: dh, plan: dp });
    hechas += dh; plan += dp;
  }
  for (const [nombre, m] of Object.entries(musculos)) {
    const [min, max] = objetivos[nombre] || objetivos._ || OBJETIVOS._;
    Object.assign(m, { min, max, estado: m.hechas < min ? 'Bajo' : m.hechas > max ? 'Alto' : 'En rango' });
  }
  return { dias, hechas, plan, musculos };
}

// ---------- Fuerza: 1RM estimado (Epley), historial, récords, última subida y estancamiento ----------
export const PIERNAS = ['Cuádriceps', 'Isquios', 'Glúteo', 'Aductores', 'Pantorrilla'];

export function unoRM(peso, reps) {
  if (!(peso > 0) || !(reps > 0)) return null;
  return reps === 1 ? peso : peso * (1 + reps / 30);
}
// Reps que cuentan para la fuerza: sin las series marcadas como incompletas (y ninguna si el peso quedó mal anotado)
export function repsValidas(reg) {
  const fuera = ((reg && reg.incompletas) || []).map(String);
  if (fuera.includes('p')) return [];
  return repsDe(reg && reg.reps).filter((_, i) => !fuera.includes(String(i)));
}
// Mejor serie de un registro: el peso es el mismo en todas, cuenta la de más reps
export function mejorSerie(reg) {
  const peso = numero(reg && reg.peso), reps = repsValidas(reg);
  if (peso == null || !reps.length) return null;
  const max = Math.max(...reps);
  return { peso, reps: max, unidad: reg.unidad || 'kg', rm: unoRM(peso, max) };
}
const mayorRM = (xs) => xs.filter(Boolean).sort((a, b) => b.rm - a.rm)[0];

// Semana a semana, la mejor serie de la fila i del ejercicio. Junta el mismo ejercicio de todos los días (pierna A y B).
// La semana 0 es el "último" que venía de la hoja. Solo la unidad más reciente: kg y discos no se comparan.
export function historial(semanas, rutina, ej, i = 0, hasta = Infinity) {
  const filas = rutina.flatMap((d) => d.ejercicios.filter((x) => x.nombre === ej.nombre).map((x) => x.filas[i])).filter(Boolean);
  if (!filas.length || filas[0].unidad === 's') return [];
  const puntos = [], base = mayorRM(filas.map((f) => f.ultimo && mejorSerie(f.ultimo)));
  if (base) puntos.push({ semana: 0, ...base });
  for (const n of Object.keys(semanas || {}).map(Number).filter((n) => n <= hasta).sort((a, b) => a - b)) {
    const mejor = mayorRM(filas.flatMap((f) => registrosDeFila(semanas[n], f)).map(mejorSerie));
    if (mejor) puntos.push({ semana: n, ...mejor });
  }
  const u = puntos.length && puntos[puntos.length - 1].unidad;
  return puntos.filter((p) => p.unidad === u);
}

// Récords: semanas cuyo 1RM estimado supera todo lo anterior (la primera nunca cuenta: no hay con qué comparar)
export function records(hist) {
  const out = [];
  let mejor = null;
  for (const p of hist) {
    if (mejor != null && p.rm > mejor + 0.05) out.push({ ...p, antes: mejor });
    if (mejor == null || p.rm > mejor) mejor = p.rm;
  }
  return out;
}

// Última vez que el peso subió respecto a la sesión anterior
export function ultimaSubida(hist) {
  for (let k = hist.length - 1; k > 0; k--) {
    if (hist[k].peso > hist[k - 1].peso) return { de: hist[k - 1].peso, a: hist[k].peso, semana: hist[k].semana, unidad: hist[k].unidad };
  }
  return null;
}

// Semanas registradas desde el mejor 1RM sin superarlo (3 o más = estancado)
export function estancamiento(hist) {
  if (hist.length < 2) return null;
  let k = 0;
  hist.forEach((p, j) => { if (p.rm > hist[k].rm + 0.05) k = j; });
  const semanas = hist.length - 1 - k;
  return { semanas, mejor: hist[k], estancado: semanas >= 3 };
}

// Qué hacer cuando no sube. Con 2 partidos por semana, mantener la fuerza de pierna ya es ganar.
export function consejoEstancado(semanas, { pierna = false, partidosSemana = 0 } = {}) {
  if (pierna && partidosSemana >= 2) return 'Con ' + String(partidosSemana).replace('.', ',') + ' partidos por semana, mantener la pierna ya es ganar: sube solo los días que llegues fresco y no la hagas el día antes de jugar.';
  if (semanas >= 5) return 'Haz una semana de descarga: baja 10 % el peso y vuelve a subir desde ahí.';
  return 'Cambia el rango de reps (ej. 6-8 en vez de 8-12) o quita una serie para recuperar mejor; revisa sueño y proteína.';
}

// Reserva (RIR: reps que te quedaban en la última serie, 4 = 4 o más) cuando no sube o cuando se puede empujar más
export function consejoRir(rir, estancado = false) {
  if (rir == null || rir === '') return '';
  if (Number(rir) <= 0 && estancado) return 'Llegas al fallo y aun así no sube: es fatiga, no falta de esfuerzo. Haz una semana de descarga.';
  if (Number(rir) >= 3) return 'Te quedaban ' + rir + (Number(rir) >= 4 ? ' o más' : '') + ' reps: empuja hasta dejar solo 1-2 en reserva.';
  return '';
}

// ---------- Registros raros: series que se salen del esquema o pesos que saltan ----------
// reg.incompletas: series (índice, o "p" para el peso) que el usuario dijo que quedaron mal: no cuentan en la fuerza.
// reg.revisadas: las que dijo que están bien: ya no se pregunta. Las series en segundos no se revisan.
const rangoFila = (f) => (f.min === f.max ? String(f.max) : f.min + '-' + f.max);
export function seriesRaras(fila, reg, anterior) {
  if (!reg || fila.unidad === 's') return [];
  const inc = (reg.incompletas || []).map(String), ok = (reg.revisadas || []).map(String), out = [];
  const pocas = Math.max(2, Math.ceil(fila.min / 2));
  repsDe(reg.reps).forEach((r, i) => {
    if (r < pocas) out.push({ i, texto: r + (r === 1 ? ' rep' : ' reps') + ' en la serie ' + (i + 1) + ' y el plan es ' + rangoFila(fila) });
    else if (r > fila.max * 2) out.push({ i, texto: r + ' reps en la serie ' + (i + 1) + ': más del doble del plan (' + rangoFila(fila) + ')' });
  });
  const p = numero(reg.peso), q = anterior && numero(anterior.peso), u = reg.unidad || 'kg';
  if (p != null && q && (anterior.unidad || 'kg') === u && Math.abs(p - q) / q > 0.4) {
    out.push({ i: 'p', texto: 'El peso pasó de ' + formatoPeso(q) + ' a ' + formatoPeso(p) + ' ' + u + ' (cambió más de 40 %)' });
  }
  return out.map((x) => ({ ...x, estado: inc.includes(String(x.i)) ? 'incompleta' : ok.includes(String(x.i)) ? 'ok' : 'pendiente' }));
}
// Los que faltan por responder entre dos semanas, del más nuevo al más viejo
export function registrosRaros(semanas, rutina, desde, hasta) {
  const out = [];
  for (let n = hasta; n >= Math.max(1, desde); n--) {
    const regs = semanas[n] || {};
    for (const d of rutina) for (const ej of d.ejercicios) for (const f of ej.filas) {
      for (const clave of Object.keys(regs).filter((k) => k === f.id || k.startsWith(f.id + '@'))) {
        const raras = seriesRaras(f, regs[clave], ultimoRegistro(semanas, f, n)).filter((x) => x.estado === 'pendiente');
        if (raras.length) out.push({ semana: n, clave, ej, fila: f, reg: regs[clave], raras });
      }
    }
  }
  return out;
}

// Meta de la próxima sesión (doble progresión): con el tope del rango en todas las series sube el peso y vuelve al mínimo
// de reps; si no, el mismo peso con 1 rep más (2 si te quedaban 3 o más en reserva), sin pasar del tope
export function metaSesion(fila, ultimo) {
  if (fila.unidad === 's') return null;
  const sug = sugerencia(fila, ultimo);
  if (!sug) return null;
  const u = sug.unidad, texto = (peso, reps) => formatoPeso(peso) + ' ' + u + ' × ' + reps;
  if (sug.sube) return { peso: sug.peso, reps: fila.min, unidad: u, sube: true, texto: texto(sug.peso, fila.min), motivo: 'Llegaste al tope: sube el peso y vuelve a ' + fila.min + ' reps.' };
  const reps = repsValidas(ultimo);
  if (!reps.length) return null;
  const mejor = Math.max(...reps), extra = Number(ultimo.rir) >= 3 ? 2 : 1, meta = Math.min(fila.max, Math.max(fila.min, mejor + extra));
  const motivo = mejor >= fila.max ? 'Llega a ' + fila.max + ' en todas las series y la próxima subes peso.'
    : 'Supera ' + texto(sug.peso, mejor) + (extra === 2 ? ': te sobraban reps, busca 2 más.' : ' con 1 rep más.');
  return { peso: sug.peso, reps: meta, unidad: u, sube: false, texto: texto(sug.peso, meta), motivo };
}

// Últimas 4 semanas por ejercicio (fila principal): el registro más reciente contra el de hace unas 4 semanas
export function progresoMes(semanas, rutina, hasta, ventana = 4) {
  const vistos = new Set(), out = [];
  for (const d of rutina) for (const ej of d.ejercicios) {
    if (vistos.has(ej.nombre)) continue;
    vistos.add(ej.nombre);
    const hist = historial(semanas, rutina, ej, 0, hasta), corte = hasta - ventana;
    const dentro = hist.filter((p) => p.semana > corte && p.semana > 0), antes = hist.filter((p) => p.semana <= corte || p.semana === 0);
    const fin = dentro[dentro.length - 1], inicio = antes.length ? antes[antes.length - 1] : dentro[0];
    if (!fin || !inicio || inicio === fin) continue;
    out.push({ nombre: ej.nombre, musculo: ej.musculo, de: inicio, a: fin, cambio: (fin.rm - inicio.rm) / inicio.rm, est: estancamiento(hist) });
  }
  return out.sort((a, b) => b.cambio - a.cambio);
}
