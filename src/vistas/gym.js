// Gym: registro de la semana actual (primero) y semanas pasadas; las futuras no se muestran
import { e, guardar, repintar, semanaActual, abrirSemana, semanaQuitable, quitarSemana } from '../estado.js';
import { semanaDe, lunesDe, sumarDias, fechaCorta, diaSemana, reloj } from '../fechas.js';
export { semanaActual };
import { CAMPOS_CARDIO, claveCardio, hayCardio, textoCardio, estadoFila, repsDe, registrosDeFila, ultimoRegistro, sugerencia, aproximacion, resumenSemana, numero, formatoPeso,
  PIERNAS, historial, records, ultimaSubida, estancamiento, consejoEstancado, progresoMes } from '../gym.js';
import { partidos } from '../registro.js';
import { linea, tablaDatos } from '../graficos.js';
import { CARDIO } from '../datos_iniciales.js';
import { esc, barra, registrar, toast, copiarTexto, botonSesion } from '../ui.js';
import { iniciar } from '../temporizador.js';
import { compartirImagen } from '../imagen.js';

let semanaVista = null, diaVista = null, editandoObjetivos = false;

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
function textoRegistro(r) {
  if (!r) return '—';
  const p = numero(r.peso);
  // Un peso que no es un solo número (drop set "91 59 72") se muestra tal cual
  const peso = p != null ? formatoPeso(p) : String(r.peso || '').trim();
  return (peso ? esc(peso) + ' ' + esc(r.unidad || 'kg') : 'sin peso') + (r.reps ? ' · ' + esc(r.reps) : '');
}

// ---------- Fuerza: última subida, estancado, récord e historial (1RM estimado del top set) ----------
const rm = (n) => formatoPeso(Math.round(n * 2) / 2);
const cuando = (s, sem) => (s === 0 ? 'antes de la app' : s === sem ? 'esta semana' : 'semana ' + s + ' (hace ' + (sem - s) + ' sem)');
const porcentaje = (c) => (c >= 0 ? '+' : '−') + (Math.round(Math.abs(c) * 1000) / 10).toLocaleString('es-CO') + ' %';
// Partidos por semana en las últimas 4 (para no confundir el cansancio del fútbol con falta de esfuerzo)
function partidosSemana() {
  const n = Math.min(4, semanaActual()), desde = lunesDe(Math.max(1, semanaActual() - 3));
  return Math.round((partidos(e()).filter((p) => p.fecha >= desde).length / n) * 2) / 2;
}
const consejo = (ej, semanas) => consejoEstancado(semanas, { pierna: PIERNAS.includes(ej.musculo), partidosSemana: partidosSemana() });

function lineaFuerza(ej, i, sem) {
  const hist = historial(e().semanas, e().rutina, ej, i, sem);
  if (!hist.length) return '';
  const u = hist[0].unidad, rec = records(hist).find((p) => p.semana === sem && sem > 0);
  const sub = ultimaSubida(hist), est = estancamiento(hist.filter((p) => p.semana < sem));
  if (rec) return '<div class="record">🏆 Récord: 1RM estimado <b>' + rm(rec.rm) + ' ' + u + '</b> (antes ' + rm(rec.antes) + ')</div>';
  if (est && est.estancado) return '<div class="progresion estancado">⏸ ' + est.semanas + ' semanas sin superar <b>' + formatoPeso(est.mejor.peso) + ' ' + u + ' × ' + est.mejor.reps + '</b>' +
    '<small>' + esc(consejo(ej, est.semanas)) + '</small></div>';
  if (sub) return '<div class="progresion">📈 Última subida: ' + formatoPeso(sub.de) + ' → <b>' + formatoPeso(sub.a) + ' ' + u + '</b> · ' + cuando(sub.semana, sem) + '</div>';
  return hist.length >= 2 ? '<div class="progresion">Aún no has subido el peso: llega al tope de reps en todas las series para subir.</div>' : '';
}

function historialEj(ej, sem) {
  const hist = historial(e().semanas, e().rutina, ej, 0, sem);
  if (hist.length < 2) return '';
  const u = hist[0].unidad, recs = new Set(records(hist).map((p) => p.semana));
  const etiqueta = (p) => (p.semana ? 'S' + p.semana : 'Antes');
  const puntos = hist.map((p) => ({ etiqueta: etiqueta(p), v: Math.round(p.rm * 10) / 10,
    tip: (p.semana ? 'Semana ' + p.semana : 'Antes de la app') + ': ' + formatoPeso(p.peso) + ' ' + u + ' × ' + p.reps + ' → 1RM est. ' + rm(p.rm) + (recs.has(p.semana) ? ' 🏆 récord' : '') }));
  return '<details class="nota historial-ej"><summary>📈 Historial</summary>' +
    '<p class="nota-corta">1RM estimado de la mejor serie, semana a semana: así 60 × 10 y 65 × 7 se pueden comparar.</p>' +
    linea(puntos, { formato: rm, margenEje: 1 }) +
    tablaDatos(['Semana', 'Peso', 'Reps', '1RM est.', ''], hist.slice().reverse().map((p) => [etiqueta(p), formatoPeso(p.peso) + ' ' + u, p.reps, rm(p.rm), recs.has(p.semana) ? '🏆' : ''])) + '</details>';
}

// Últimas 4 semanas: en qué subiste, qué está quieto y tus últimos récords (Gym → Resumen y Progreso)
export function tarjetaFuerza(hasta = semanaActual()) {
  const lista = progresoMes(e().semanas, e().rutina, hasta);
  const suben = lista.filter((x) => x.cambio > 0.005), quietos = lista.filter((x) => x.est && x.est.estancado);
  const vistos = new Set(), recs = [];
  for (const d of e().rutina) for (const ej of d.ejercicios) {
    if (vistos.has(ej.nombre)) continue;
    vistos.add(ej.nombre);
    for (const p of records(historial(e().semanas, e().rutina, ej, 0, hasta))) if (p.semana > 0) recs.push({ ...p, nombre: ej.nombre });
  }
  recs.sort((a, b) => b.semana - a.semana);
  if (!lista.length && !recs.length) return '<p class="nota-corta">Cuando tengas el mismo ejercicio anotado en 2 semanas vas a ver aquí en qué estás mejorando.</p>';
  const fila = (x) => '<li><span>' + esc(x.nombre) + '<small>' + formatoPeso(x.de.peso) + ' × ' + x.de.reps + ' → ' + formatoPeso(x.a.peso) + ' × ' + x.a.reps + ' ' + x.a.unidad + '</small></span>' +
    '<b class="' + (x.cambio > 0.005 ? 'sube' : x.cambio < -0.005 ? 'baja' : '') + '">' + porcentaje(x.cambio) + '</b></li>';
  return '<h3>📈 Mejoraste (4 semanas)</h3>' +
    (suben.length ? '<ul class="fuerza-lista">' + suben.slice(0, 5).map(fila).join('') + '</ul>' : '<p class="nota-corta">Ningún ejercicio subió su 1RM estimado en estas 4 semanas.</p>') +
    (quietos.length ? '<h3>⏸ Estancados (3+ semanas sin superar tu mejor marca)</h3><ul class="fuerza-lista">' + quietos.slice(0, 5).map((x) =>
      '<li><span>' + esc(x.nombre) + '<small>' + esc(consejo(x, x.est.semanas)) + '</small></span><b class="baja">' + x.est.semanas + ' sem</b></li>').join('') + '</ul>' : '') +
    (recs.length ? '<h3>🏆 Últimos récords</h3><ul class="fuerza-lista">' + recs.slice(0, 6).map((p) =>
      '<li><span>' + esc(p.nombre) + '<small>' + formatoPeso(p.peso) + ' ' + p.unidad + ' × ' + p.reps + ' · semana ' + p.semana + '</small></span><b>' + rm(p.rm) + '</b></li>').join('') + '</ul>' : '') +
    (lista.length ? tablaDatos(['Ejercicio', 'Antes', 'Ahora', 'Cambio'], lista.map((x) => [x.nombre, formatoPeso(x.de.peso) + ' × ' + x.de.reps, formatoPeso(x.a.peso) + ' × ' + x.a.reps, porcentaje(x.cambio)])) : '');
}

function fila(f, sem, clave = f.id, ej = null, i = 0) {
  const reg = registros(sem)[clave] || {}, est = estadoFila(f, reg);
  const ult = ultimoRegistro(e().semanas, f, sem), sug = sugerencia(f, ult);
  const unidad = reg.unidad || (ult && ult.unidad) || 'kg';
  return '<div class="fila-ej c-' + est.color + '">' +
    '<div class="fila-cab"><span class="tipo t-' + f.tipo.toLowerCase() + '">' + f.tipo + '</span>' +
    '<span class="esquema">' + esc(f.esquema) + (f.unidad === 's' ? ' (seg)' : '') + '</span>' +
    '<span class="descanso" title="Descanso">⏱ ' + reloj(f.descanso) + '</span>' +
    '<span class="contador">' + est.hechas + ' / ' + est.plan + '</span></div>' +
    (est.color === 'sube' ? '<div class="sube-peso">⬆ SUBE PESO la próxima semana (+2,5–5 %)</div>' : '') +
    '<div class="ultimo">Último: <b>' + textoRegistro(ult) + '</b>' +
    (sug ? ' · Hoy: <b class="' + (sug.sube ? 'sugerido-sube' : '') + '">' + esc(sug.texto) + (sug.sube ? ' ⬆' : '') + '</b>' : '') + '</div>' +
    (ej ? lineaFuerza(ej, i, sem) : '') +
    '<div class="entradas">' +
    '<input class="peso" type="text" inputmode="decimal" data-cambio="peso" data-fila="' + clave + '" value="' + esc(reg.peso || '') + '" placeholder="' + esc(sug ? formatoPeso(sug.peso) : 'Peso') + '" aria-label="Peso">' +
    '<select data-cambio="unidad" data-fila="' + clave + '" aria-label="Unidad"><option' + (unidad === 'kg' ? ' selected' : '') + '>kg</option><option' + (unidad === 'discos' ? ' selected' : '') + '>discos</option></select>' +
    '<input class="reps" type="text" data-cambio="reps" data-fila="' + clave + '" value="' + esc(reg.reps || '') + '" placeholder="Reps: 10 9 8" aria-label="Repeticiones de cada serie, separadas por espacio" autocomplete="off">' +
    '</div>' +
    (est.hechas < est.plan ? '<div class="serie-rapida"><input type="text" inputmode="numeric" placeholder="' + (f.unidad === 's' ? 'seg' : 'reps') + '" aria-label="Repeticiones de esta serie" data-serie="' + clave + '">' +
      '<button type="button" class="boton primario" data-accion="serie" data-fila="' + clave + '">＋ Serie ' + (est.hechas + 1) + ' y descanso</button></div>' : '') +
    '</div>';
}

// ↑ ↓ en la tarjeta: cambia el orden del día en la rutina (misma acción que en Editar)
function moverEj(ej) {
  const d = e().rutina.find((x) => x.ejercicios.includes(ej)), i = d.ejercicios.indexOf(ej), n = d.ejercicios.length;
  if (n < 2) return '';
  const lista = 'rutina.' + e().rutina.indexOf(d) + '.ejercicios';
  return '<span class="mover-ej">' +
    '<button type="button" class="icono" data-accion="ed-mover" data-lista="' + lista + '" data-i="' + i + '" data-n="-1" aria-label="Subir ' + esc(ej.nombre) + '"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
    '<button type="button" class="icono" data-accion="ed-mover" data-lista="' + lista + '" data-i="' + i + '" data-n="1" aria-label="Bajar ' + esc(ej.nombre) + '"' + (i === n - 1 ? ' disabled' : '') + '>↓</button></span>';
}

function ejercicio(ej, sem, sufijo = '') {
  return '<article class="tarjeta ejercicio"><header><h3>' + esc(ej.nombre) + '</h3><span class="musculo">' + esc(ej.musculo) + '</span>' + moverEj(ej) + '</header>' +
    ej.filas.map((f, i) => fila(f, sem, f.id + sufijo, ej, i)).join('') +
    historialEj(ej, sem) +
    '<details class="nota"' + (ej.nota ? ' open' : '') + '><summary>Notas</summary><textarea rows="2" data-cambio="nota" data-ej="' + ej.id + '" placeholder="Agarre, asiento, molestias…">' + esc(ej.nota || '') + '</textarea></details>' +
    '</article>';
}

// Peso planeado del primer top set del día: lo escrito hoy, si no lo sugerido
function pesoPlaneado(d, sem) {
  const f = d.ejercicios[0] && d.ejercicios[0].filas[0];
  if (!f) return null;
  const reg = registros(sem)[f.id], ult = ultimoRegistro(e().semanas, f, sem), sug = sugerencia(f, ult);
  const peso = numero(reg && reg.peso) ?? (sug && sug.peso);
  return peso ? { peso, unidad: (reg && reg.unidad) || (sug && sug.unidad) || 'kg', nombre: d.ejercicios[0].nombre } : null;
}

// "pierna" abre "calentamiento-pierna"; también vale el id de cualquier sesión
export const sesionCalentamiento = (d) => (e().sesiones.some((s) => s.id === 'calentamiento-' + d.calentamiento) ? 'calentamiento-' + d.calentamiento : d.calentamiento);
// Sesiones extra junto al calentamiento: las elegidas en Editar, o las de siempre si el día nunca se editó
export const extrasCalentamiento = (d) => d.extras || (d.calentamiento === 'pierna' ? ['prevencion-futbol', 'rodilla', 'lazo'] : ['lazo']);

export function tarjetaCalentamiento(d, sem = semanaActual()) {
  if (!d.calentamiento) return '';
  const plan = pesoPlaneado(d, sem), aprox = plan ? aproximacion(plan.peso, plan.unidad) : [];
  return '<section class="tarjeta calentamiento"><h2>🔥 Calentamiento</h2>' +
    '<div class="botones-rapidos">' + botonSesion(sesionCalentamiento(d), 'primario', 'Calentamiento guiado') + extrasCalentamiento(d).map((id) => botonSesion(id)).join('') + '</div>' +
    (d.previo ? '<p class="nota-corta">' + esc(d.previo) + '</p>' : '') +
    // Mismo alto con o sin peso: al escribirlo la pantalla no salta
    '<p class="nota-corta">' + (plan ? 'Aproximación para <b>' + esc(plan.nombre) + '</b> (top set ' + formatoPeso(plan.peso) + ' ' + plan.unidad + '):'
      : 'Aproximación: escribe el peso del primer top set para calcularla.') + '</p><div class="aprox">' +
    (aprox.length ? aprox : [[50, 8], [70, 5], [85, 2]].map(([p, reps]) => ({ pct: p, reps }))).map((a) =>
      '<span><small>' + a.pct + ' %</small><b>' + (a.peso ? formatoPeso(a.peso) : '—') + '</b> × ' + a.reps + '</span>').join('') + '</div>' +
    '<details class="nota"' + (d.notaCalentamiento ? ' open' : '') + '><summary>Notas</summary><textarea rows="2" data-cambio="nota-calentamiento" data-dia="' + d.id + '" placeholder="Molestias, movilidad extra, cómo me sentí…">' + esc(d.notaCalentamiento || '') + '</textarea></details>' +
    '</section>';
}

// ---------- Cardio: cómo se hizo (se guarda por semana y día: "cardio@d3") ----------

function ultimoCardio(d, sem) {
  for (let s = sem - 1; s >= 1; s--) { const c = e().semanas[s] && e().semanas[s][claveCardio(d)]; if (hayCardio(c)) return { ...c, semana: s }; }
  return null;
}
const planCardio = () => e().config.cardioPlan ?? CARDIO;

function tarjetaCardio(d, sem) {
  if (!d.cardio) return '';
  const c = registros(sem)[claveCardio(d)] || {}, ult = ultimoCardio(d, sem), i = e().rutina.indexOf(d), hecho = hayCardio(c);
  return '<section class="tarjeta cardio' + (hecho ? ' hecho' : '') + '"><div class="fila-resumen"><h2>🏃 ' + esc(d.cardio) + '</h2>' + (hecho ? '<span class="estado e-pagado">✓ Hecho</span>' : '') + '</div>' +
    '<p class="nota-corta">Plan: ' + esc(planCardio()) + '</p>' +
    (ult ? '<p class="ultimo">Último (semana ' + ult.semana + '): <b>' + esc(textoCardio(ult)) + '</b></p>' : '') +
    '<div class="campos-cardio">' + CAMPOS_CARDIO.map(([k, t, paso]) =>
      '<label class="campo">' + t + '<input type="number" inputmode="decimal" min="0" step="' + paso + '" data-cambio="cardio" data-dia="' + d.id + '" data-k="' + k + '" value="' + esc(c[k] ?? '') + '"' +
      (ult && ult[k] != null && ult[k] !== '' ? ' placeholder="' + esc(ult[k]) + '"' : '') + '></label>').join('') + '</div>' +
    '<label class="campo">Nota<input type="text" data-cambio="cardio" data-dia="' + d.id + '" data-k="nota" value="' + esc(c.nota || '') + '" placeholder="Ej.: escaladora en vez de cinta, me sentí pesado…"></label>' +
    (ult && !hecho ? '<button type="button" class="boton secundario" data-accion="cardio-repetir" data-dia="' + d.id + '">↻ Igual que la última vez</button>' : '') +
    '<details><summary>Editar plan del cardio</summary><div class="dos">' +
    '<label class="campo">Cardio de este día<input type="text" data-cambio="ed" data-ruta="rutina.' + i + '.cardio" value="' + esc(d.cardio) + '"></label>' +
    '<label class="campo">Parámetros (todos los días)<input type="text" data-cambio="ed" data-ruta="config.cardioPlan" value="' + esc(planCardio()) + '"></label></div></details></section>';
}

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
  const bloque = (ej, sufijo = '') => ej.nombre + ' · ' + ej.musculo + '\n' + ej.filas.map((f) => lineaFila(f, f.id + sufijo)).join('\n');
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

function vistaDia(d, sem) {
  const r = resumenSemana([d], registros(sem));
  return tarjetaCalentamiento(d, sem) +
    '<div class="fila-resumen sticky-resumen"><b>' + esc(d.nombre) + '</b><span>' + r.hechas + ' / ' + r.plan + ' series</span></div>' + barra(r.plan ? r.hechas / r.plan : 0) +
    '<div class="copiar-dia"><button type="button" class="boton secundario" data-accion="gym-copiar" data-dia="' + d.id + '">📋 Copiar resumen del día</button>' +
    '<button type="button" class="boton secundario" data-accion="gym-imagen" data-dia="' + d.id + '">🖼️ Imagen del resumen</button>' +
    '<details><summary>Ver texto</summary><pre class="texto-copia">' + esc(textoDia(d, sem)) + '</pre></details></div>' +
    d.ejercicios.map((ej) => ejercicio(ej, sem)).join('') +
    tarjetaCore(d, sem) +
    tarjetaCardio(d, sem);
}

// Core al final de cualquier día: se anota en el día que se hace y cuenta para el total de la semana
function tarjetaCore(d, sem) {
  const core = e().rutina.find((x) => x.id === 'core');
  if (!core) return '';
  const sufijo = '@' + d.id, regs = registros(sem);
  const hoyAlgo = Object.keys(regs).some((k) => k.endsWith(sufijo) && repsDe(regs[k].reps).length);
  const semana = resumenSemana([core], regs);
  return '<details class="core"' + (hoyAlgo ? ' open' : '') + '><summary><b>💪 Core</b> · al final del día · ' + semana.hechas + ' / ' + semana.plan + ' series esta semana</summary>' +
    core.ejercicios.map((ej) => ejercicio(ej, sem, sufijo)).join('') + '</details>';
}

// Línea simple con el peso de la primera fila de cada ejercicio, semana a semana
function grafico(f, hasta) {
  const puntos = [];
  for (let s = 1; s <= hasta; s++) {
    const p = registrosDeFila(e().semanas[s], f).map((r) => numero(r.peso)).find((n) => n != null);
    if (p != null) puntos.push([s, p]);
  }
  if (!puntos.length) return '<span class="nota-corta">sin datos</span>';
  const ps = puntos.map((p) => p[1]), min = Math.min(...ps), max = Math.max(...ps), W = 120, H = 32;
  const x = (s) => (hasta > 1 ? ((s - 1) / (hasta - 1)) * (W - 8) + 4 : W / 2), y = (p) => (max > min ? H - 4 - ((p - min) / (max - min)) * (H - 8) : H / 2);
  return '<svg class="mini" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">' +
    '<polyline fill="none" stroke="currentColor" stroke-width="2" points="' + puntos.map(([s, p]) => x(s) + ',' + y(p)).join(' ') + '"/>' +
    puntos.map(([s, p]) => '<circle cx="' + x(s) + '" cy="' + y(p) + '" r="2.5" fill="currentColor"/>').join('') + '</svg>' +
    '<span class="nota-corta">' + formatoPeso(ps[0]) + ' → <b>' + formatoPeso(ps[ps.length - 1]) + '</b></span>';
}

export function tarjetaSemana(sem = semanaActual(), conMusculos = false) {
  const r = resumenSemana(e().rutina, registros(sem), e().config.objetivos);
  const pos = (id) => { const d = e().rutina.find((x) => x.id === id); return id === 'core' ? 100 : (d && d.diaSemana) || 99; };
  r.dias.sort((a, b) => pos(a.id) - pos(b.id));
  return '<div class="fila-resumen"><b>Semana ' + sem + '</b><span>' + r.hechas + ' / ' + r.plan + ' series</span></div>' + barra(r.plan ? r.hechas / r.plan : 0) +
    '<div class="dias-semana">' + r.dias.map((d) => (d.id === 'core' ? '<div class="dia-mini"' : '<button type="button" class="dia-mini" data-accion="ir-dia" data-dia="' + d.id + '"') + '><span>' + (DIAS_CORTOS[pos(d.id)] ? DIAS_CORTOS[pos(d.id)] + ' · ' : '') + esc(d.nombre) + '</span><b>' + d.hechas + '/' + d.plan + '</b>' + barra(d.plan ? d.hechas / d.plan : 0) + (d.id === 'core' ? '</div>' : '</button>')).join('') + '</div>' +
    (conMusculos ? '<div class="fila-resumen"><h2>Series por músculo</h2><button type="button" class="boton secundario" data-accion="gym-objetivos">' + (editandoObjetivos ? '✓ Listo' : '✏️ Editar objetivos') + '</button></div>' +
      (editandoObjetivos ? '<p class="nota-corta">Series por semana que buscas para cada músculo: menos del mínimo es "Bajo", más del máximo es "Alto".</p>' : '') +
      '<div class="musculos">' + Object.entries(r.musculos).map(([m, x]) => {
        const rango = editandoObjetivos
          ? '<span class="rango-ed"><input type="number" inputmode="numeric" min="0" data-cambio="gym-objetivo" data-m="' + esc(m) + '" data-k="0" value="' + x.min + '" aria-label="Mínimo de ' + esc(m) + '"> – ' +
            '<input type="number" inputmode="numeric" min="1" data-cambio="gym-objetivo" data-m="' + esc(m) + '" data-k="1" value="' + x.max + '" aria-label="Máximo de ' + esc(m) + '"></span>'
          : x.min + '–' + x.max;
        return '<div class="musculo-fila"><div class="fila-resumen"><span>' + esc(m) + '</span><span><b>' + x.hechas + '</b> / ' + rango + ' <span class="estado e-' + x.estado.replace(' ', '-').toLowerCase() + '">' + x.estado + '</span></span></div>' + barra(x.hechas / x.max) + '</div>';
      }).join('') + '</div>' : '');
}

function vistaResumen(sem) {
  return '<section class="tarjeta">' + tarjetaSemana(sem, true) + '</section>' +
    '<section class="tarjeta fuerza"><h2>💪 Fuerza</h2>' + tarjetaFuerza(sem) + '</section>' +
    '<section class="tarjeta"><h2>Progreso de peso</h2><div class="progreso">' + e().rutina.flatMap((d) => d.ejercicios.map((ej) =>
      '<div class="progreso-fila"><span>' + esc(ej.nombre) + '<small>' + esc(d.nombre) + ' · ' + ej.filas[0].tipo + '</small></span>' + grafico(ej.filas[0], sem) + '</div>')).join('') + '</div></section>';
}

export function vistaGym() {
  const actual = semanaActual();
  if (semanaVista == null || semanaVista > actual) semanaVista = actual;
  if (diaVista == null || diaVista === 'core') diaVista = (diaDeHoy() || {}).id || 'resumen';
  const lunes = lunesDe(semanaVista), d = e().rutina.find((x) => x.id === diaVista);
  const opciones = [];
  for (let s = actual; s >= 1; s--) opciones.push('<option value="' + s + '"' + (s === semanaVista ? ' selected' : '') + '>Semana ' + s + (s === actual ? ' (actual)' : ' · ' + fechaCorta(lunesDe(s))) + '</option>');
  return '<div class="cab-vista"><h1>Gym</h1><select data-cambio="semana" aria-label="Semana">' + opciones.join('') + '</select></div>' +
    '<div class="semana-acciones"><p class="sub">' + fechaCorta(lunes) + ' – ' + fechaCorta(sumarDias(lunes, 6)) +
      (semanaVista < actual ? ' · <b>semana pasada</b>' : semanaVista > semanaDe() ? ' · <b>abierta antes de tiempo</b>' : '') + '</p>' +
      (semanaVista === actual ? '<button type="button" class="boton secundario" data-accion="semana-nueva">＋ Nueva semana</button>' : '') +
      (semanaVista === actual && semanaQuitable() === actual ? '<button type="button" class="boton secundario" data-accion="semana-quitar">Quitar semana ' + actual + '</button>' : '') + '</div>' +
    '<nav class="chips" aria-label="Día">' + diasEnOrden().map((x) => '<button type="button" class="chip' + (x.id === diaVista ? ' activo' : '') + '" data-accion="ir-dia" data-dia="' + x.id + '">' +
      (x.diaSemana ? DIAS_CORTOS[x.diaSemana] + ' · ' : '') + esc(x.nombre) + '</button>').join('') +
    '<button type="button" class="chip' + (diaVista === 'resumen' ? ' activo' : '') + '" data-accion="ir-dia" data-dia="resumen">📊 Resumen</button></nav>' +
    (d ? vistaDia(d, semanaVista) : vistaResumen(semanaVista));
}

function cambiarReps(id, texto) {
  const info = buscarFila(id), reg = (registros(semanaVista)[id] ??= {}), i = info.ej.filas.indexOf(info.f);
  const esRecord = () => records(historial(e().semanas, e().rutina, info.ej, i, semanaVista)).some((p) => p.semana === semanaVista);
  const antes = repsDe(reg.reps).length, eraRecord = esRecord();
  reg.reps = texto.replace(/\s+/g, ' ').trim(); // siempre texto
  const ahora = repsDe(reg.reps).length;
  if (!reg.unidad) { const u = ultimoRegistro(e().semanas, info.f, semanaVista); reg.unidad = (u && u.unidad) || 'kg'; }
  // Descanso automático al sumar una serie (si aún faltan)
  if (ahora > antes && ahora < info.f.series) iniciar('descanso', info.f.descanso, info.ej.nombre);
  if (ahora > antes && !eraRecord && esRecord()) toast('🏆 ¡Récord en ' + info.ej.nombre + '! Tu mejor 1RM estimado');
  else if (ahora >= info.f.series && ahora > antes) toast(estadoFila(info.f, reg).color === 'sube' ? '⬆ ¡Tope del rango! Sube peso la próxima semana' : '✓ ' + info.ej.nombre + ' completo');
  guardar();
}

registrar({
  'ir-dia'({ dia }) { diaVista = dia; if (location.hash !== '#gym') location.hash = '#gym'; else repintar(); window.scrollTo(0, 0); },
  semana(ds, el) { semanaVista = Number(el.value); repintar(); },
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
  peso({ fila: id }, el) { (registros(semanaVista)[id] ??= {}).peso = el.value.trim(); guardar(); },
  unidad({ fila: id }, el) { (registros(semanaVista)[id] ??= {}).unidad = el.value; guardar(); },
  reps({ fila: id }, el) { cambiarReps(id, el.value); },
  serie({ fila: id }, el) {
    const campo = el.parentNode.querySelector('[data-serie]'), n = campo.value.trim();
    if (!/^\d+([.,]\d+)?$/.test(n)) { toast('Escribe las reps de la serie'); campo.focus(); return; }
    campo.value = '';
    const reg = registros(semanaVista)[id] || {};
    if (!reg.peso) {
      // Sin peso escrito: se usa el sugerido para no tener que escribirlo en cada serie
      const info = buscarFila(id), sug = sugerencia(info.f, ultimoRegistro(e().semanas, info.f, semanaVista));
      if (sug) (registros(semanaVista)[id] ??= {}).peso = String(sug.peso);
    }
    cambiarReps(id, ((reg.reps || '') + ' ' + n).trim());
  },
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
