// Gym: la pantalla está en src/react/pantallas/Gym.tsx (y GymDia.tsx, GymPlan12.tsx). Aquí quedan sus acciones (anotar series,
// reps, peso, variantes, biseries, cardio, semanas), lo que ve la pantalla (piezasGym) y las tarjetas que todavía usan Hoy y
// Progreso como texto HTML (tarjetaFuerza, tarjetaSemana, proximoEntreno, tarjetaCalentamiento)
import { e, guardar, repintar, semanaActual, abrirSemana, quitarSemana, dia as diaDe } from '../estado.js';
import { iso, lunesDe, sumarDias, fechaCorta, diaSemana } from '../fechas.js';
export { semanaActual };
import { claveCardio, hayCardio, textoCardio, estadoFila, repsDe, registrosDeFila, ultimoRegistro, sugerencia, resumenSemana, numero, formatoPeso, PIERNAS, historial, records, consejoEstancado, metaSesion, enBiserie, nombresBiserie, tieneVariantes, varianteDe, varianteActual, varianteEn, nombreConVariante } from '../gym.js';
import { filasDeEsquema } from '../datos_iniciales.js';
import { partidos } from '../registro.js';
import { pesos as pesosCorporales } from '../dieta.js';
import { linea, tablaDatos } from '../graficos.js';
import { promptEntreno } from '../analisis.js';
import { CARDIO } from '../datos_iniciales.js';
import { tip, registrar, toast, copiarTexto } from '../ui.js';
import { iniciar } from '../temporizador.js';
import { compartirImagen } from '../imagen.js';
import { compartirRutina } from '../imagen-rutina.js';
import './plan12.js';

let semanaVista = null, diaVista = null, editandoObjetivos = false, fuerzaEj = null;
// Ejercicio en el que vas: el último donde anotaste una serie (si le faltan) o el primero con series pendientes.
// enfocar: al abrir el día o terminar un ejercicio, la pantalla baja a ese y deja listo el campo de reps
let ultimoEj = null, actualId = null, enfocar = true;
// ⏭ Máquina ocupada: ejercicios que se dejan para después en esta visita (no cambia el orden de la rutina)
const saltados = new Set();
// Solo queda abierto el ejercicio en el que vas (y el último donde anotaste, para responder las reps en reserva);
// los demás son una fila con su resumen. manual: lo que se abrió o plegó a mano en este día (gana a lo automático)
let manual = {};
const estaAbierto = (clave, auto) => (clave in manual ? manual[clave] : auto);
if (typeof window !== 'undefined') window.addEventListener('hashchange', () => { if (location.hash.startsWith('#gym')) enfocar = true; });

export function diaDeHoy() {
  const n = diaSemana();
  return e().rutina.find((d) => d.diaSemana === n) || null;
}
const registros = (sem) => (e().semanas[sem] ??= {});
const DIAS_CORTOS = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
// Días de entrenamiento en orden de la semana (los que no tienen día asignado al final)
export const diasEnOrden = () => e().rutina.filter((d) => d.id !== 'core').sort((a, b) => (a.diaSemana || 99) - (b.diaSemana || 99));
// La clave del core lleva el día ("core-1-1@d3"): se busca la fila sin esa parte
function buscarFila(clave) {
  const id = clave.split('@')[0];
  for (const d of e().rutina) for (const ej of d.ejercicios) for (const f of ej.filas) if (f.id === id) return { d, ej, f };
  return null;
}
// Variante de un registro: la de la tarjeta en esa semana (core: clave con "@día")
const sufijoDe = (clave) => (clave.includes('@') ? clave.slice(clave.indexOf('@')) : '');
const filtroEn = (ej, sem, sufijo = '') => (tieneVariantes(ej) ? { ej, v: varianteEn(ej, registros(sem), sufijo) } : null);
// Los ejercicios con el mismo nombre (pierna A y B) comparten variantes
const mismos = (nombre) => e().rutina.flatMap((d) => d.ejercicios).filter((x) => x.nombre === nombre);
// Al anotar, el registro queda con la variante elegida
function marcarVariante(clave, sem = semanaVista) {
  const info = buscarFila(clave);
  if (!info || !tieneVariantes(info.ej)) return;
  const v = varianteEn(info.ej, registros(sem), sufijoDe(clave));
  (registros(sem)[clave] ??= {}).variante = v;
}
// Peso corporal del día de ese entreno (el último anotado hasta ese día, nunca uno futuro): es el peso de las paralelas
// y dominadas del calentamiento. null si nunca lo has anotado
function pesoDelDia(clave, sem) {
  const info = buscarFila(clave);
  if (!info) return null;
  const d = clave.includes('@') ? e().rutina.find((x) => x.id === clave.split('@')[1]) : info.d;
  const dia = d && d.diaSemana ? sumarDias(lunesDe(sem), d.diaSemana - 1) : iso(), hasta = dia < iso() ? dia : iso();
  const lista = pesosCorporales(e().dias).filter((x) => x.fecha <= hasta);
  return lista.length ? lista[lista.length - 1].peso : null;
}
const kgCorporal = (n) => String(Math.round(n * 10) / 10).replace('.', ',');

// ---------- Fuerza: última subida, estancado, récord e historial (1RM estimado del top set) ----------
const rm = (n) => formatoPeso(Math.round(n * 2) / 2);
const porcentaje = (c) => (c >= 0 ? '+' : '−') + (Math.round(Math.abs(c) * 1000) / 10).toLocaleString('es-CO') + ' %';
// Partidos por semana en las últimas 4 (para no confundir el cansancio del fútbol con falta de esfuerzo)
function partidosSemana() {
  const n = Math.min(4, semanaActual()), desde = lunesDe(Math.max(1, semanaActual() - 3));
  return Math.round((partidos(e()).filter((p) => p.fecha >= desde).length / n) * 2) / 2;
}
const consejo = (ej, semanas) => consejoEstancado(semanas, { pierna: PIERNAS.includes(ej.musculo), partidosSemana: partidosSemana() });
// La última reserva anotada en la fila i del ejercicio (hasta esa semana)
function rirReciente(ej, i, sem, v = varianteActual(ej)) {
  const f = ej.filas[i];
  for (let s = sem; f && s >= 1; s--) {
    const r = registrosDeFila(e().semanas[s], f).reverse().find((x) => x.rir != null && (v == null || varianteDe(x, ej) === v));
    if (r) return r.rir;
  }
  return null;
}

// abierto: sin el desplegable (en la tarjeta de Fuerza, donde ya se eligió el ejercicio)
function historialEj(ej, sem, abierto = false, v = varianteActual(ej)) {
  const hist = historial(e().semanas, e().rutina, ej, 0, sem, v);
  if (hist.length < 2) return '';
  const u = hist[0].unidad, recs = new Set(records(hist).map((p) => p.semana));
  const etiqueta = (p) => (p.semana ? 'S' + p.semana : 'Antes');
  const puntos = hist.map((p) => ({ etiqueta: etiqueta(p), v: Math.round(p.rm * 10) / 10,
    tip: (p.semana ? 'Semana ' + p.semana : 'Antes de la app') + ': ' + formatoPeso(p.peso) + ' ' + u + ' × ' + p.reps + ' → 1RM est. ' + rm(p.rm) + (recs.has(p.semana) ? ' 🏆 récord' : '') }));
  const cuerpo = '<p class="nota-corta">1RM estimado de la mejor serie, semana a semana: así 60 × 10 y 65 × 7 se pueden comparar.</p>' +
    linea(puntos, { formato: rm, margenEje: 1 }) +
    tablaDatos(['Semana', 'Peso', 'Reps', '1RM est.', ''], hist.slice().reverse().map((p) => [etiqueta(p), formatoPeso(p.peso) + ' ' + u, p.reps, rm(p.rm), recs.has(p.semana) ? '🏆' : '']));
  return cuerpo;
}

// Lo anotado de un ejercicio en una línea ("41 kg × 5 · 40 kg × 12 11"); sin nada anotado, el esquema y la meta de hoy
function resumenEj(ej, sem, sufijo = '') {
  const regs = registros(sem);
  let hechas = 0, plan = 0;
  const partes = ej.filas.map((f) => {
    const reg = regs[f.id + sufijo] || {}, est = estadoFila(f, reg), reps = repsDe(reg.reps), p = numero(reg.peso);
    hechas += Math.min(est.hechas, est.plan); plan += est.plan;
    return reps.length ? (p != null ? formatoPeso(p) + ' ' + (reg.unidad || 'kg') + ' × ' : '') + reps.join(' ') : '';
  }).filter(Boolean);
  if (partes.length) return { hechas, plan, texto: partes.join(' · ') };
  const f = ej.filas[0], meta = f && metaSesion(f, ultimoRegistro(e().semanas, f, sem, filtroEn(ej, sem, sufijo), e().rutina));
  return { hechas, plan, texto: ej.filas.map((x) => x.esquema + (x.unidad === 's' ? ' seg' : '')).join(' · ') + (meta ? ' · hoy ' + meta.texto + (meta.sube ? ' ⬆' : '') : '') };
}

// Biserie: los dos ejercicios en una tarjeta (A1 y A2), cada uno con su peso, y una ronda que anota los dos y arranca el descanso
// Series hechas y planeadas de todo el ejercicio, y la fila donde va la próxima serie (top, back-off…)
function avanceEj(ej, sem) {
  const regs = registros(sem), est = ej.filas.map((f) => estadoFila(f, regs[f.id] || {}));
  return { hechas: est.reduce((s, x) => s + Math.min(x.hechas, x.plan), 0), plan: est.reduce((s, x) => s + x.plan, 0),
    fila: ej.filas[est.findIndex((x) => x.hechas < x.plan)] || null };
}

// Peso planeado del primer top set del día: lo escrito hoy, si no lo sugerido
function pesoPlaneado(d, sem) {
  const ej = d.ejercicios.find((x) => !x.calentamiento), f = ej && ej.filas[0];
  if (!f) return null;
  const reg = registros(sem)[f.id], ult = ultimoRegistro(e().semanas, f, sem, filtroEn(ej, sem), e().rutina), sug = sugerencia(f, ult);
  const peso = numero(reg && reg.peso) ?? (sug && sug.peso);
  return peso ? { peso, unidad: (reg && reg.unidad) || (sug && sug.unidad) || 'kg', nombre: ej.nombre } : null;
}

// "pierna" abre "calentamiento-pierna"; también vale el id de cualquier sesión
export const sesionCalentamiento = (d) => (e().sesiones.some((s) => s.id === 'calentamiento-' + d.calentamiento) ? 'calentamiento-' + d.calentamiento : d.calentamiento);
// Sesiones extra junto al calentamiento: las elegidas en Editar, o las de siempre si el día nunca se editó
export const extrasCalentamiento = (d) => d.extras || (d.calentamiento === 'pierna' ? ['prevencion-futbol', 'rodilla', 'tobillo', 'lazo'] : ['hombro-codo', 'lazo']);

// ---------- Cardio: cómo se hizo (se guarda por semana y día: "cardio@d3") ----------

function ultimoCardio(d, sem) {
  for (let s = sem - 1; s >= 1; s--) { const c = e().semanas[s] && e().semanas[s][claveCardio(d)]; if (hayCardio(c)) return { ...c, semana: s }; }
  return null;
}
const planCardio = () => e().config.cardioPlan ?? CARDIO;

// Resumen del día en texto, para pegar en WhatsApp, notas o la hoja
export function textoDia(d, sem, estado = e()) {
  const regs = estado.semanas[sem] || {}, lunes = lunesDe(sem);
  const lineaFila = (f, clave) => {
    const reg = regs[clave] || {}, est = estadoFila(f, reg), reps = repsDe(reg.reps);
    const peso = String(reg.peso || '').trim(), unidad = reg.unidad || 'kg';
    const marca = est.color === 'sube' ? ' ⬆ sube peso' : est.color === 'completo' ? ' ✅' : est.color === 'falta' ? ' ⏳ ' + est.hechas + '/' + est.plan : '';
    const datos = reps.length ? (peso ? peso + ' ' + unidad + ' × ' : '') + reps.join(' · ') : '—';
    return '  ' + (f.tipo === 'Series' ? '' : f.tipo + ' ') + f.esquema + ': ' + datos + marca;
  };
  const bloque = (ej, sufijo = '') => nombreConVariante(ej, varianteEn(ej, regs, sufijo)) + ' · ' + ej.musculo + '\n' + ej.filas.map((f) => lineaFila(f, f.id + sufijo)).join('\n');
  const r = resumenSemana([d], regs), lineas = [
    '🏋️ ' + (d.diaSemana ? DIAS_CORTOS[d.diaSemana] + ' · ' : '') + d.nombre + ' — Semana ' + sem + ' (' + fechaCorta(lunes) + ' – ' + fechaCorta(sumarDias(lunes, 6)) + ')',
    'Series: ' + r.hechas + '/' + r.plan, '', ...d.ejercicios.map((ej) => bloque(ej)),
  ];
  // Core: solo lo anotado ese día
  const core = estado.rutina.find((x) => x.id === 'core'), sufijo = '@' + d.id;
  const coreHecho = core ? core.ejercicios.filter((ej) => ej.filas.some((f) => repsDe((regs[f.id + sufijo] || {}).reps).length)) : [];
  if (coreHecho.length) lineas.push('', '💪 Core', ...coreHecho.map((ej) => bloque(ej, sufijo)));
  if (d.cardio) {
    const c = regs[claveCardio(d)] || {};
    lineas.push('', '🏃 ' + d.cardio + ': ' + (textoCardio(c) || '—') + (c.nota ? ' (' + c.nota + ')' : ''));
  }
  return lineas.join('\n');
}

function ejActual(d, sem) {
  if (sem !== semanaActual()) return null;
  const ult = d.ejercicios.find((ej) => ej.id === ultimoEj), falta = (ej) => avanceEj(ej, sem).fila;
  return ((ult && falta(ult) && !saltados.has(ult.id) ? ult : d.ejercicios.find((ej) => falta(ej) && !saltados.has(ej.id)) || d.ejercicios.find(falta)) || {}).id || null;
}
// Lo que hace la vista del día al pintarse: marca el ejercicio en el que vas y, si toca, pide bajar hasta él
function prepararDia(d, sem) {
  actualId = ejActual(d, sem);
  if (enfocar && actualId) { enfocar = false; return true; }
  return false;
}
function irAlActual() {
  const a = document.querySelector('[data-actual]');
  if (!a) return;
  a.scrollIntoView({ block: 'start', behavior: 'smooth' });
  const campo = a.querySelector('[data-serie]');
  if (campo) campo.focus({ preventScroll: true });
}

// La semana y la pestaña que se ven (al abrir: la semana actual y el día de hoy, o el resumen)
function prepararGym() {
  const actual = semanaActual();
  if (semanaVista == null || semanaVista > actual) semanaVista = actual;
  if (diaVista == null || diaVista === 'core') diaVista = (diaDeHoy() || {}).id || 'resumen';
  return actual;
}
// Qué pestaña se ve, para main.js: 'dia' (un día de entreno), 'plan12', 'casa' o 'resumen'
export function claveGym() {
  prepararGym();
  if (diaVista === 'plan12' || diaVista === 'casa') return diaVista;
  return e().rutina.some((x) => x.id === diaVista) ? 'dia' : 'resumen';
}
// Lo que necesita la pantalla de React (src/react/pantallas/Gym.tsx): lo que se ve y los cálculos que comparte con esta
export const piezasGym = {
  ver: () => ({ actual: prepararGym(), semana: semanaVista, dia: diaVista, editandoObjetivos, fuerzaEj }),
  DIAS_CORTOS, rirReciente, consejo, rm, porcentaje, historialEj,
  // El día: en qué ejercicio vas y qué está abierto (prepararDia dice si hay que bajar al ejercicio en el que vas)
  prepararDia, irAlActual, estaAbierto, verDia: () => ({ ultimoEj, actualId }), filtroEn, sufijoDe, pesoDelDia, kgCorporal,
  resumenEj, avanceEj, ultimoCardio, planCardio, pesoPlaneado,
};

// Gym entero lo pinta React (src/react/pantallas/Gym.tsx); esto queda por si main.js no la encuentra
export function vistaGym() {
  return '<h1>Gym</h1>';
}

// ---------- ⏱ Contador del entreno de hoy: { dia, inicio, fin? } en el día de hoy (dias[fecha].entreno) ----------
export const entrenoHoy = () => (e().dias[iso()] || {}).entreno || null;
export const minutosEntreno = (x, ahora = Date.now()) => Math.max(0, Math.round(((x.fin || ahora) - x.inicio) / 60000));
// Si pasan 90 minutos sin anotar nada, el entreno se da por terminado 5 minutos después de la última serie
export const ENTRENO_QUIETO = 90 * 60000;
export const entrenoQuieto = (x, ahora = Date.now()) => !!(x && !x.fin && ahora - (x.ultimo || x.inicio) > ENTRENO_QUIETO);
// 🤕 Molestias: dias[fecha].molestias = { nombre del ejercicio: 1 (leve) | 2 (fuerte) }
export const molestiaHoy = (nombre) => (((e().dias[iso()] || {}).molestias) || {})[nombre] || 0;
// La más reciente de los últimos 14 días (sin contar hoy): { dias, nivel }
export function molestiaReciente(nombre, hoy = iso()) {
  for (let k = 1; k <= 14; k++) { const n = (((e().dias[sumarDias(hoy, -k)] || {}).molestias) || {})[nombre]; if (n) return { dias: k, nivel: n }; }
  return null;
}
export const estaSaltado = (id) => saltados.has(id);

function cambiarReps(id, texto) {
  marcarVariante(id);
  const info = buscarFila(id), reg = (registros(semanaVista)[id] ??= {}), i = info.ej.filas.indexOf(info.f), filtro = filtroEn(info.ej, semanaVista, sufijoDe(id));
  const esRecord = () => records(historial(e().semanas, e().rutina, info.ej, i, semanaVista, filtro ? filtro.v : null)).some((p) => p.semana === semanaVista);
  const antes = repsDe(reg.reps).length, eraRecord = esRecord();
  reg.reps = texto.replace(/\s+/g, ' ').trim(); // siempre texto
  // Calentamiento con peso corporal: sin peso escrito, se anota el tuyo de ese día
  if (info.ej.calentamiento && !String(reg.peso || '').trim() && repsDe(reg.reps).length) { const c = pesoDelDia(id, semanaVista); if (c) { reg.peso = kgCorporal(c); reg.unidad = 'kg'; } }
  const ahora = repsDe(reg.reps).length;
  if (!reg.unidad) { const u = ultimoRegistro(e().semanas, info.f, semanaVista, filtro, e().rutina); reg.unidad = (u && u.unidad) || 'kg'; }
  // Descanso automático al sumar una serie (si aún faltan). En una biserie lo arranca la ronda, después de los dos
  if (ahora > antes) {
    ultimoEj = info.ej.id;
    saltados.delete(info.ej.id);
    // El contador del entreno arranca solo con la primera serie de hoy (en la semana actual)
    if (semanaVista === semanaActual() && !entrenoHoy()) diaDe().entreno = { dia: info.d.id, inicio: Date.now() };
    const x = semanaVista === semanaActual() && entrenoHoy();
    if (x && !x.fin) x.ultimo = Date.now();
    if (!avanceEj(info.ej, semanaVista).fila) enfocar = true; // terminó: pasa al siguiente
  }
  if (ahora > antes && ahora < info.f.series && !enBiserie(info.d.ejercicios, info.ej)) iniciar('descanso', info.f.descanso, info.ej.nombre);
  if (ahora > antes && !eraRecord && esRecord()) toast('🏆 ¡Récord en ' + nombreConVariante(info.ej, filtro && filtro.v) + '! Tu mejor 1RM estimado');
  else if (ahora >= info.f.series && ahora > antes) toast(estadoFila(info.f, reg).color === 'sube' && !info.ej.calentamiento ? '⬆ ¡Tope del rango! Sube peso la próxima semana' : '✓ ' + info.ej.nombre + ' completo');
  guardar();
}

function elegirVariante(id, v, sufijo = '') {
  const ej = e().rutina.flatMap((d) => d.ejercicios).find((x) => x.id === id);
  if (!ej || !tieneVariantes(ej) || !ej.variantes.includes(v)) return;
  const regs = registros(semanaVista), antes = varianteEn(ej, regs, sufijo);
  if (semanaVista === semanaActual()) for (const x of mismos(ej.nombre)) x.variante = v;
  let movidos = 0;
  for (const f of ej.filas) {
    const r = regs[f.id + sufijo];
    if (r && (r.variante || r.reps || r.peso)) { if (repsDe(r.reps).length && antes !== v) movidos++; r.variante = v; }
  }
  guardar();
  if (movidos) toast('Lo anotado en la semana ' + semanaVista + ' quedó como ' + v);
}

registrar({
  'ir-dia'({ dia }) { diaVista = dia; enfocar = true; manual = {}; saltados.clear(); if (location.hash !== '#gym') location.hash = '#gym'; else repintar(); window.scrollTo(0, 0); },
  semana(ds, el) { semanaVista = Number(el.value); manual = {}; repintar(); },
  // Abrir o plegar la tarjeta de un ejercicio (la pantalla no se mueve: main.js deja quieta la tarjeta tocada)
  'gym-plegar'({ clave, abierto }) { manual[clave] = abierto !== '1'; repintar(); },
  'abrir-gym'({ p }) { diaVista = p; },
  'gym-objetivos'() { editandoObjetivos = !editandoObjetivos; repintar(); },
  'gym-objetivo'({ m, k }, el) {
    const obj = e().config.objetivos, actual = [...(obj[m] || obj._ || [10, 20])];
    actual[Number(k)] = Math.min(99, Math.max(0, Math.round(Number(el.value) || 0)));
    // Que el mínimo no quede por encima del máximo
    if (actual[0] > actual[1]) actual[Number(k) === 0 ? 1 : 0] = actual[Number(k)];
    obj[m] = actual;
    guardar();
  },
  cardio({ dia, k }, el) {
    const d = e().rutina.find((x) => x.id === dia), c = (registros(semanaVista)[claveCardio(d)] ??= {});
    if (k === 'nota') c.nota = el.value.trim();
    else {
      const n = Number(String(el.value).replace(',', '.'));
      if (el.value === '' || !(n >= 0)) delete c[k]; else c[k] = n;
    }
    guardar();
  },
  'cardio-repetir'({ dia }) {
    const d = e().rutina.find((x) => x.id === dia), ult = ultimoCardio(d, semanaVista);
    if (!ult) return;
    const { semana, nota, ...datos } = ult;
    registros(semanaVista)[claveCardio(d)] = { ...datos };
    guardar();
    toast('🏃 Cardio igual que la semana ' + semana);
  },
  async 'gym-imagen'({ dia }) {
    const d = e().rutina.find((x) => x.id === dia);
    if (!d) return;
    try {
      const r = await compartirImagen(d, semanaVista ?? semanaActual(), e());
      if (r === 'descargada') toast('🖼️ Imagen descargada');
    } catch (err) { toast('No se pudo crear la imagen'); }
  },
  async 'gym-imagen-rutina'() {
    try {
      const r = await compartirRutina(semanaVista ?? semanaActual(), e());
      if (r === 'descargada') toast('🖼️ Imagen descargada');
    } catch (err) { toast('No se pudo crear la imagen'); }
  },
  'gym-analisis'({ dia }) {
    const d = e().rutina.find((x) => x.id === dia), sem = semanaVista ?? semanaActual();
    if (d) copiarTexto(promptEntreno(d, sem, textoDia(d, sem)), '📋 Análisis copiado: pégalo en Claude');
  },
  'gym-copiar'({ dia }) {
    const d = e().rutina.find((x) => x.id === dia);
    if (d) copiarTexto(textoDia(d, semanaVista ?? semanaActual()), 'Resumen de ' + d.nombre + ' copiado');
  },
  'semana-nueva'() {
    const n = semanaActual() + 1, lunes = lunesDe(n);
    if (!confirm('¿Abrir la semana ' + n + ' (' + fechaCorta(lunes) + ' – ' + fechaCorta(sumarDias(lunes, 6)) + ')?\n\nLo que registres desde ahora va a esa semana, y lo de la semana ' + (n - 1) + ' pasa a ser el "último registro".')) return;
    semanaVista = abrirSemana();
    repintar();
    toast('Semana ' + semanaVista + ' abierta');
  },
  'semana-quitar'() {
    if (!confirm('¿Quitar la semana ' + semanaActual() + '? No tiene nada anotado.')) return;
    quitarSemana();
    semanaVista = semanaActual();
    repintar();
  },
  // ⚠️ Registro raro: "inc" no cuenta en la fuerza, "ok" está bien, "quitar" deshace la respuesta
  'gym-raro'({ sem, clave, i, v }) {
    const reg = e().semanas[sem] && e().semanas[sem][clave];
    if (!reg) return;
    const id = i === 'p' ? 'p' : Number(i), sin = (l) => (l || []).filter((x) => String(x) !== String(id));
    reg.incompletas = sin(reg.incompletas); reg.revisadas = sin(reg.revisadas);
    if (v === 'inc') reg.incompletas.push(id);
    if (v === 'ok') reg.revisadas.push(id);
    if (!reg.incompletas.length) delete reg.incompletas;
    if (!reg.revisadas.length) delete reg.revisadas;
    guardar();
    if (v === 'inc') toast('Listo: no cuenta en la comparación de fuerza');
  },
  // Reps en reserva de la última serie (tocar el mismo número lo quita)
  'gym-rir'({ fila: id, v }) {
    marcarVariante(id);
    const reg = (registros(semanaVista)[id] ??= {}), n = Number(v);
    if (reg.rir === n) delete reg.rir; else reg.rir = n;
    guardar();
  },
  'fuerza-ej'(ds, el) { fuerzaEj = el.value; repintar(); },
  // Elegir la variante: en la semana actual también queda para la próxima vez; lo ya anotado esa semana pasa a esa variante
  'gym-variante'({ ej: id, v, sufijo = '' }) { elegirVariante(id, v, sufijo); },
  'gym-variante-nueva'({ ej: id, sufijo = '' }) {
    const ej = e().rutina.flatMap((d) => d.ejercicios).find((x) => x.id === id);
    if (!ej) return;
    const nombre = (prompt('¿Cómo se llama la otra forma de hacer "' + ej.nombre + '"?\n\nEj.: Paralelas, Barra Z, Máquina, Mancuernas.\nCada una lleva su propio historial, meta y peso sugerido.') || '').trim();
    if (!nombre) return;
    const lista = tieneVariantes(ej) ? ej.variantes : [ej.nombre];
    if (lista.some((x) => x.toLowerCase() === nombre.toLowerCase())) { toast('Ya existe "' + nombre + '"'); return; }
    // Lo anotado antes queda en la primera (el nombre del ejercicio)
    for (const x of mismos(ej.nombre)) x.variantes = [...lista, nombre];
    elegirVariante(id, nombre, sufijo);
  },
  // Ronda de la biserie: suma la serie de A1 y la de A2 (las que tengan reps) y arranca un solo descanso
  'gym-ronda'({ a, b }, el) {
    const ejs = [a, b].map((id) => e().rutina.flatMap((d) => d.ejercicios).find((x) => x.id === id));
    const caja = el.closest('.bis-ronda, [data-ronda]'), filas = ejs.map((ej) => avanceEj(ej, semanaVista).fila);
    const campos = filas.map((f) => f && caja.querySelector('[data-serie="ronda@' + f.id + '"]')), valores = campos.map((c) => (c ? c.value.trim() : ''));
    const valido = (v) => /^\d+([.,]\d+)?$/.test(v);
    if (!valores.some(valido)) { toast('Escribe las reps de A1 y A2'); (campos.find(Boolean) || el).focus(); return; }
    campos.forEach((c) => { if (c) c.value = ''; });
    const descanso = Math.max(...filas.filter(Boolean).map((f) => f.descanso));
    filas.forEach((f, k) => {
      if (!f || !valido(valores[k])) return;
      const reg = (registros(semanaVista)[f.id] ??= {});
      if (!reg.peso) {
        const sug = sugerencia(f, ultimoRegistro(e().semanas, f, semanaVista, filtroEn(ejs[k], semanaVista), e().rutina));
        if (sug) reg.peso = String(sug.peso);
      }
      cambiarReps(f.id, ((reg.reps || '') + ' ' + valores[k]).trim());
    });
    if (ejs.some((ej) => avanceEj(ej, semanaVista).fila)) iniciar('descanso', descanso, 'Biserie: ' + ejs.map((ej) => ej.nombre).join(' + '));
  },
  // "A / b" se separa en dos ejercicios en biserie (lo anotado hasta hoy queda en el primero)
  'gym-biserie'({ ej: id }) {
    const d = e().rutina.find((x) => x.ejercicios.some((y) => y.id === id)), j = d.ejercicios.findIndex((y) => y.id === id), ej = d.ejercicios[j];
    const nombres = nombresBiserie(ej.nombre);
    if (!nombres || !confirm('¿Separar "' + ej.nombre + '" en una biserie?\n\nA1: ' + nombres[0] + '\nA2: ' + nombres[1] + '\n\nLo anotado hasta hoy queda en ' + nombres[0] + '. Los nombres se cambian en Editar.')) return;
    const nuevoId = d.id + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const filas = filasDeEsquema(ej.filas.map((f) => (f.tipo === 'Series' ? '' : f.tipo + ' ') + f.esquema).join(' · ')).map((f, k) => ({ ...f, id: nuevoId + '-' + (k + 1), descanso: ej.filas[k] ? ej.filas[k].descanso : f.descanso }));
    d.ejercicios.splice(j + 1, 0, { id: nuevoId, nombre: nombres[1], musculo: ej.musculo, nota: '', filas });
    ej.nombre = nombres[0];
    ej.biserie = true;
    guardar();
    toast('🔁 Biserie lista: anota cada ronda con los dos ejercicios');
  },
  'gym-biserie-quitar'({ ej: id }) {
    for (const d of e().rutina) for (const ej of d.ejercicios) if (ej.id === id) delete ej.biserie;
    guardar();
  },
  peso({ fila: id }, el) { marcarVariante(id); (registros(semanaVista)[id] ??= {}).peso = el.value.trim(); guardar(); },
  unidad({ fila: id }, el) { marcarVariante(id); (registros(semanaVista)[id] ??= {}).unidad = el.value; guardar(); },
  reps({ fila: id }, el) { cambiarReps(id, el.value); },
  serie({ fila: id }, el) {
    // Una serie ("12") o varias de una vez ("15 15")
    const campo = el.parentNode.querySelector('[data-serie]'), n = campo.value.replace(/\s+/g, ' ').trim(), conTeclado = document.activeElement === campo;
    if (!/^\d+([.,]\d+)?( \d+([.,]\d+)?)*$/.test(n)) { toast('Escribe las reps de la serie'); campo.focus(); return; }
    campo.value = '';
    const reg = registros(semanaVista)[id] || {};
    if (!reg.peso && !buscarFila(id).ej.calentamiento) {
      // Sin peso escrito: se usa el sugerido para no tener que escribirlo en cada serie (en el calentamiento, el corporal: cambiarReps)
      const info = buscarFila(id), sug = sugerencia(info.f, ultimoRegistro(e().semanas, info.f, semanaVista, filtroEn(info.ej, semanaVista, sufijoDe(id)), e().rutina));
      if (sug) (registros(semanaVista)[id] ??= {}).peso = String(sug.peso);
    }
    const ejId = buscarFila(id).ej.id;
    cambiarReps(id, ((reg.reps || '') + ' ' + n).trim());
    // Si la fila se terminó, el campo desaparece: el foco pasa a la siguiente serie del mismo ejercicio (si no hay, main.js lleva al siguiente)
    if (conTeclado) setTimeout(() => {
      if (document.activeElement && document.activeElement.matches('[data-serie]')) return;
      const tarjeta = [...document.querySelectorAll('[data-ancla^="ej-"]')].find((t) => t.dataset.ancla === 'ej-' + ejId), sig = tarjeta && tarjeta.querySelector('[data-serie]');
      if (sig) { sig.focus({ preventScroll: true }); sig.scrollIntoView({ block: 'nearest' }); }
    }, 80);
  },
  'gym-entreno-empezar'({ dia: d }) { diaDe().entreno = { dia: d, inicio: Date.now() }; guardar(); toast('⏱ Entreno en marcha'); },
  // en: la hora de cierre cuando se cierra solo (sin aviso)
  'gym-entreno-terminar'({ en }) {
    const x = entrenoHoy();
    if (!x || x.fin) return;
    x.fin = en ? Number(en) : Date.now();
    guardar();
    if (!en) toast('✓ Entreno de ' + minutosEntreno(x) + ' min', () => { delete x.fin; guardar(); });
  },
  'gym-ocupada'({ ej }) {
    saltados.add(ej);
    if (ultimoEj === ej) ultimoEj = null;
    enfocar = true;
    const d = e().rutina.find((x) => x.ejercicios.some((y) => y.id === ej)), sig = d && d.ejercicios.find((y) => y.id === ejActual(d, semanaVista));
    repintar();
    toast(sig && sig.id !== ej ? '⏭ Lo dejamos para después. Sigue con ' + sig.nombre : 'No hay otro pendiente: este sigue siendo el que va');
  },
  'gym-molestia'({ n, v }) {
    const m = (diaDe().molestias ??= {}), nivel = Number(v);
    if (!nivel || m[n] === nivel) delete m[n]; else m[n] = nivel;
    guardar();
  },
  'gym-entreno-seguir'() { const x = entrenoHoy(); if (x) { delete x.fin; guardar(); } },
  nota({ ej: id }, el) {
    for (const d of e().rutina) for (const ej of d.ejercicios) if (ej.id === id) ej.nota = el.value.trim();
    guardar(false);
  },
  'nota-calentamiento'({ dia }, el) {
    const d = e().rutina.find((x) => x.id === dia);
    if (d) d.notaCalentamiento = el.value.trim();
    guardar(false);
  },
});
