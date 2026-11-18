// Reglas del registro del gym (sin pantalla, para poder probarlas): series hechas, colores, peso sugerido y resúmenes.
import { OBJETIVOS } from './datos_iniciales.js';
import { iso, lunesDe, sumarDias } from './fechas.js';

// ---------- ⏱ Cuánto duró el entreno de un día: fuerza y cardio por separado ----------
// Fuerza: dias[fecha].entreno = { dia, inicio, fin?, ultimo? }, en la fecha en que se entrenó (se busca en los 7 días de
// esa semana el que es de este día de la rutina). Si quedó abierto en un día que ya pasó, se cierra 5 min después de la
// última serie, como el cierre automático. Cardio: su propio cronómetro en el registro "cardio@día" ({ inicio, fin });
// sus minutos son los anotados (el cronómetro los llena al terminar, y se pueden corregir)
const minutos = (a, b) => Math.max(0, Math.round((b - a) / 60000));
// Lo que se cruzan dos tramos [a1, b1] y [a2, b2], en ms
const cruce = (a1, b1, a2, b2) => Math.max(0, Math.min(b1, b2) - Math.max(a1, a2));
// Separado y completo: fuerza y cardio por separado (la fuerza NO cuenta el rato en que corría el cardio, p. ej. si
// tocaste "↺ Seguir" en fuerza después del cardio), total = fuerza + cardio, y "en el gym" = de la primera hora de
// inicio a la última de fin (con lo que hubo entre uno y otro)
export function tiemposDia(d, sem, estado, ahora = Date.now()) {
  const hoy = iso(new Date(ahora)), lunes = lunesDe(sem);
  const c = d.cardio ? ((estado.semanas || {})[sem] || {})[claveCardio(d)] || {} : {};
  const cEnCurso = !!(c.inicio && !c.fin), cMin = c.min != null && c.min !== '' ? Number(c.min) : c.inicio ? minutos(c.inicio, c.fin || ahora) : null;
  const cardio = cMin != null || c.inicio ? { inicio: c.inicio || null, fin: c.fin || (cEnCurso ? ahora : null), enCurso: cEnCurso, min: cMin || 0 } : null;
  let fuerza = null;
  for (let k = 0; k < 7 && !fuerza; k++) {
    const f = sumarDias(lunes, k), x = ((estado.dias || {})[f] || {}).entreno;
    if (x && x.dia === d.id && x.inicio) {
      const enCurso = !x.fin && f === hoy, fin = x.fin || (enCurso ? ahora : (x.ultimo || x.inicio) + 5 * 60000);
      const menos = cardio && cardio.inicio && cardio.fin ? cruce(x.inicio, fin, cardio.inicio, cardio.fin) : 0;
      const ms = Math.max(0, fin - x.inicio - menos);
      fuerza = { fecha: f, inicio: x.inicio, fin, enCurso, ms, min: Math.round(ms / 60000) };
    }
  }
  const total = fuerza || cardio ? (fuerza ? fuerza.min : 0) + (cardio ? cardio.min : 0) : null;
  // Completo: solo si hay los dos con horas (si no, es igual al total)
  let gym = null;
  if (fuerza && cardio && cardio.inicio && cardio.fin) {
    const desde = Math.min(fuerza.inicio, cardio.inicio), hasta = Math.max(fuerza.fin, cardio.fin);
    gym = { inicio: desde, fin: hasta, min: minutos(desde, hasta) };
  }
  return { fuerza, cardio, total, gym };
}
// Cada serie anotada hoy mueve el contador de fuerza. Si pasaron más de 90 min sin anotar nada:
//  · lo de antes eran pocas series (menos de 5: una anotación suelta, p. ej. de madrugada) → el contador vuelve a empezar ahora
//  · lo de antes era un entreno de verdad → ese queda cerrado 5 min después de su última serie, y anotar o corregir
//    algo más tarde ya no lo alarga
// n: series anotadas en ese bloque (los contadores viejos no lo tienen y se toman como entreno de verdad)
export const SERIES_ENTRENO = 5;
export function anotarEnEntreno(x, dia, ahora = Date.now(), quieto = 90 * 60000) {
  const nuevo = () => ({ dia, inicio: ahora, ultimo: ahora, n: 1 });
  if (!x) return nuevo();
  const pocas = (x.n ?? SERIES_ENTRENO) < SERIES_ENTRENO, ultimo = x.ultimo || x.inicio;
  if (x.fin) return ahora - x.fin > quieto && pocas ? nuevo() : x;
  if (ahora - ultimo > quieto) return pocas ? nuevo() : { ...x, fin: ultimo + 5 * 60000 };
  return { ...x, ultimo: ahora, n: (x.n ?? SERIES_ENTRENO) + 1 };
}
// Un entreno de fuerza de más de 3 horas casi seguro es un error del contador: se ofrece corregir las horas
export const ENTRENO_RARO = 180;
// "1 h 42 min" o "45 min"
export const duracion = (min) => (min >= 60 ? Math.floor(min / 60) + ' h' + (min % 60 ? ' ' + (min % 60) + ' min' : '') : min + ' min');
// La línea para WhatsApp (texto e imagen): "⏱ Fuerza 1 h 12 min · 🏃 Cardio 30 min · Total 1 h 42 min"
// (+ " (en el gym 1 h 55 min)" si entre la fuerza y el cardio hubo 5 min o más de otra cosa)
export function lineaTiempos(t) {
  if (!t.fuerza && !t.cardio) return '';
  const partes = [];
  if (t.fuerza) partes.push('⏱ Fuerza ' + duracion(t.fuerza.min) + (t.fuerza.enCurso ? ' (en curso)' : ''));
  if (t.cardio) partes.push('🏃 Cardio ' + duracion(t.cardio.min) + (t.cardio.enCurso ? ' (en curso)' : ''));
  if (t.fuerza && t.cardio) partes.push('Total ' + duracion(t.total) + (t.gym && t.gym.min - t.total >= 5 ? ' (en el gym ' + duracion(t.gym.min) + ')' : ''));
  return partes.join(' · ');
}

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

// Bajón dentro del ejercicio: la última serie cayó 30 % o más frente a la primera y todavía faltan series.
// Con eso el músculo ya recibió el estímulo; seguir solo suma cansancio
export function bajonReps(fila, reg) {
  const reps = repsDe(reg && reg.reps);
  if (reps.length < 2 || reps.length >= fila.series) return null;
  const de = reps[0], a = reps[reps.length - 1];
  return de > 0 && a <= de * 0.7 ? { de, a, caida: (de - a) / de } : null;
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

// ---------- Variantes: el mismo ejercicio hecho de otra forma (paralelas o máquina, predicador o barra Z) ----------
// ej.variantes: nombres; la primera es la principal. ej.variante: la que se está usando.
// Cada registro guarda la suya en reg.variante; los que no la tienen (anotados antes) son de la principal.
// El historial, el último registro, la meta y el estancamiento se calculan solo con la misma variante.
export const tieneVariantes = (ej) => !!(ej && Array.isArray(ej.variantes) && ej.variantes.length > 1);
export const varianteDe = (reg, ej) => (tieneVariantes(ej) ? (reg && ej.variantes.includes(reg.variante) ? reg.variante : ej.variantes[0]) : null);
// La que se está usando ahora (para la próxima vez)
export const varianteActual = (ej) => (tieneVariantes(ej) ? (ej.variantes.includes(ej.variante) ? ej.variante : ej.variantes[0]) : null);
// La de una semana: la del primer registro con datos; si no hay nada anotado, la que se está usando
export function varianteEn(ej, regs, sufijo = '') {
  if (!tieneVariantes(ej)) return null;
  for (const f of ej.filas) {
    const r = regs && regs[f.id + sufijo];
    if (r && (r.variante || conDatos(r))) return varianteDe(r, ej);
  }
  return varianteActual(ej);
}
// "Predicador" + "Barra Z" -> "Predicador · Barra Z"; si la variante ya dice el ejercicio, solo la variante
export function nombreConVariante(ej, v) {
  if (!v) return ej.nombre;
  return v.toLowerCase().includes(ej.nombre.toLowerCase()) ? v : ej.nombre + ' · ' + v;
}
// Cada ejercicio (por nombre) y cada una de sus variantes, una vez
export function lineasFuerza(rutina) {
  const vistos = new Set(), out = [];
  for (const d of rutina) for (const ej of d.ejercicios) {
    for (const v of tieneVariantes(ej) ? ej.variantes : [null]) {
      const k = ej.nombre + '|' + (v || '');
      if (vistos.has(k)) continue;
      vistos.add(k);
      out.push({ ej, v, nombre: nombreConVariante(ej, v) });
    }
  }
  return out;
}

// Último registro de una fila antes de la semana indicada (la semana que se cerró pasa a ser "el último").
// filtro { ej, v }: solo los de esa variante del ejercicio (sin filtro, todos)
// rutina: el mismo ejercicio en otro día (pierna A y B) cuenta como la misma sesión: vale lo más reciente de cualquiera,
// incluso de un día anterior de la misma semana
export function ultimoRegistro(semanas, fila, semana, filtro = null, rutina = null) {
  const sirve = (r) => !filtro || !tieneVariantes(filtro.ej) || filtro.v == null || varianteDe(r, filtro.ej) === filtro.v;
  const gem = rutina ? gemelas(rutina, fila) : null;
  if (gem && gem.otras.length) {
    const previas = Object.keys(semanas || {}).map(Number).filter((n) => n <= semana).sort((a, b) => b - a);
    for (const n of previas) {
      // En la semana vista solo los días anteriores; en las pasadas, del último día al primero
      const filas = gem.todas.filter((g) => n < semana || g.dia < gem.dia).sort((a, b) => b.dia - a.dia);
      for (const g of filas) {
        const reg = registrosDeFila(semanas[n], g.f).filter(conDatos).filter(sirve).pop();
        if (reg) return { ...reg, semana: n };
      }
    }
  } else {
    const previas = Object.keys(semanas || {}).map(Number).filter((n) => n < semana).sort((a, b) => b - a);
    for (const n of previas) {
      const reg = registrosDeFila(semanas[n], fila).filter(conDatos).filter(sirve).pop();
      if (reg) return { ...reg, semana: n };
    }
  }
  // El de la hoja es de antes de las variantes: cuenta para la principal
  if (filtro && tieneVariantes(filtro.ej) && filtro.v != null && filtro.v !== filtro.ej.variantes[0]) return null;
  return fila.ultimo && (fila.ultimo.reps || fila.ultimo.peso) ? { ...fila.ultimo, semana: null } : null;
}

// La misma fila (misma posición) del ejercicio con el mismo nombre en cada día de la rutina. dia: el orden en la semana
function gemelas(rutina, fila) {
  let propio = null, nombre = null, i = -1;
  rutina.forEach((d, k) => d.ejercicios.forEach((ej) => { const j = ej.filas.indexOf(fila); if (j >= 0 && !propio) { propio = k; nombre = ej.nombre; i = j; } }));
  if (propio == null) return null;
  const todas = [];
  rutina.forEach((d, k) => d.ejercicios.forEach((ej) => { if (ej.nombre === nombre && ej.filas[i] && ej.filas[i].unidad === fila.unidad) todas.push({ f: ej.filas[i], dia: k }); }));
  return { dia: propio, todas, otras: todas.filter((g) => g.f !== fila) };
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

// ---------- Biseries: ej.biserie = true va seguido, sin descanso, con el ejercicio siguiente del día ----------
// Grupos del día en orden: [ej] solo, o [a, b] en biserie
export function gruposDia(ejercicios) {
  const out = [];
  for (let k = 0; k < ejercicios.length; k++) {
    const a = ejercicios[k], b = ejercicios[k + 1];
    if (a.biserie && b) { out.push([a, b]); k++; } else out.push([a]);
  }
  return out;
}
// ¿El ejercicio es parte de una biserie de su día? (el primero lleva la marca; el segundo es el que le sigue)
export function enBiserie(ejercicios, ej) {
  return gruposDia(ejercicios).some((g) => g.length === 2 && g.includes(ej));
}
// "Laterales máquina / posterior" → ["Laterales máquina", "Posterior máquina"]: si la segunda parte es una sola palabra,
// se le agrega lo que sigue a la primera palabra de la primera parte (el aparato o el agarre)
export function nombresBiserie(nombre) {
  const partes = String(nombre).split('/').map((s) => s.trim()).filter(Boolean);
  if (partes.length !== 2) return null;
  const [a, b] = partes, resto = a.split(/\s+/).slice(1).join(' ');
  const segundo = b.charAt(0).toUpperCase() + b.slice(1);
  return [a, !/\s/.test(b) && resto ? segundo + ' ' + resto : segundo];
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
// v: la variante (por defecto la que se está usando); un ejercicio sin variantes junta todo, como siempre
export function historial(semanas, rutina, ej, i = 0, hasta = Infinity, v = varianteActual(ej)) {
  const pares = rutina.flatMap((d) => d.ejercicios.filter((x) => x.nombre === ej.nombre).map((x) => ({ f: x.filas[i], x }))).filter((p) => p.f);
  const filas = pares.map((p) => p.f);
  if (!filas.length || filas[0].unidad === 's') return [];
  const sirve = (r, x) => v == null || !tieneVariantes(x) || varianteDe(r, x) === v;
  const principal = (x) => v == null || !tieneVariantes(x) || v === x.variantes[0];
  const puntos = [], base = mayorRM(pares.filter((p) => principal(p.x)).map((p) => p.f.ultimo && mejorSerie(p.f.ultimo)));
  if (base) puntos.push({ semana: 0, ...base });
  for (const n of Object.keys(semanas || {}).map(Number).filter((n) => n <= hasta).sort((a, b) => a - b)) {
    const mejor = mayorRM(pares.flatMap((p) => registrosDeFila(semanas[n], p.f).filter((r) => sirve(r, p.x))).map(mejorSerie));
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
        const raras = seriesRaras(f, regs[clave], ultimoRegistro(semanas, f, n, { ej, v: varianteDe(regs[clave], ej) }, rutina)).filter((x) => x.estado === 'pendiente');
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
  const extra = Number(ultimo.rir) >= 3 ? 2 : 1, tope = (n) => Math.min(fila.max, Math.max(fila.min, n));
  if ((fila.series || 1) <= 1) {
    const mejor = Math.max(...reps), meta = tope(mejor + extra);
    const motivo = mejor >= fila.max ? 'Llega a ' + fila.max + ' en todas las series y la próxima subes peso.'
      : 'Supera ' + texto(sug.peso, mejor) + (extra === 2 ? ': te sobraban reps, busca 2 más.' : ' con 1 rep más.');
    return { peso: sug.peso, reps: meta, unidad: u, sube: false, texto: texto(sug.peso, meta), motivo };
  }
  // Varias series: se sube la más floja (lo realista: subir la mejor obliga a repetirla en todas). Si faltó alguna, se
  // completa con la última que hiciste
  const antes = reps.slice(0, fila.series);
  while (antes.length < fila.series) antes.push(antes[antes.length - 1]);
  const metas = antes.map(tope), k = metas.lastIndexOf(Math.min(...metas)), de = metas[k];
  metas[k] = tope(de + extra);
  const motivo = metas[k] === de ? 'Llega a ' + fila.max + ' en todas las series y la próxima subes peso.'
    : 'Sube la serie más floja: ' + de + ' → ' + metas[k] + (extra === 2 ? ' (te sobraban reps)' : '') + '; las demás, como la última vez.' + (Math.max(...metas) >= fila.max ? ' Con ' + fila.max + ' en todas, subes peso.' : '');
  return { peso: sug.peso, reps: Math.max(...metas), series: metas, unidad: u, sube: false, texto: texto(sug.peso, metas.join(' ')), motivo };
}

// Últimas 4 semanas por ejercicio (fila principal): el registro más reciente contra el de hace unas 4 semanas
// Cada variante va aparte ("Press plano · Paralelas"): no se comparan entre sí
export function progresoMes(semanas, rutina, hasta, ventana = 4) {
  const out = [];
  for (const { ej, v, nombre } of lineasFuerza(rutina)) {
    const hist = historial(semanas, rutina, ej, 0, hasta, v), corte = hasta - ventana;
    const dentro = hist.filter((p) => p.semana > corte && p.semana > 0), antes = hist.filter((p) => p.semana <= corte || p.semana === 0);
    const fin = dentro[dentro.length - 1], inicio = antes.length ? antes[antes.length - 1] : dentro[0];
    if (!fin || !inicio || inicio === fin) continue;
    out.push({ nombre, variante: v, musculo: ej.musculo, de: inicio, a: fin, cambio: (fin.rm - inicio.rm) / inicio.rm, est: estancamiento(hist) });
  }
  return out.sort((a, b) => b.cambio - a.cambio);
}
