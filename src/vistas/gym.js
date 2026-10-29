// Gym: registro de la semana actual (primero) y semanas pasadas; las futuras no se muestran
import { e, guardar, repintar, semanaActual, abrirSemana, semanaQuitable, quitarSemana } from '../estado.js';
import { iso, semanaDe, lunesDe, sumarDias, fechaCorta, diaSemana, reloj } from '../fechas.js';
export { semanaActual };
import { CAMPOS_CARDIO, claveCardio, hayCardio, textoCardio, estadoFila, repsDe, registrosDeFila, ultimoRegistro, sugerencia, aproximacion, resumenSemana, numero, formatoPeso,
  PIERNAS, historial, records, ultimaSubida, estancamiento, consejoEstancado, progresoMes, seriesRaras, registrosRaros, metaSesion, consejoRir, gruposDia, enBiserie, nombresBiserie } from '../gym.js';
import { filasDeEsquema } from '../datos_iniciales.js';
import { partidos } from '../registro.js';
import { queTeHaceRendir, pesoCorporalEn } from '../entrenador.js';
import { linea, tablaDatos } from '../graficos.js';
import { CARDIO } from '../datos_iniciales.js';
import { esc, barra, registrar, toast, copiarTexto, botonSesion } from '../ui.js';
import { iniciar } from '../temporizador.js';
import { compartirImagen } from '../imagen.js';

let semanaVista = null, diaVista = null, editandoObjetivos = false, fuerzaEj = null;

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
// La última reserva anotada en la fila i del ejercicio (hasta esa semana)
function rirReciente(ej, i, sem) {
  const f = ej.filas[i];
  for (let s = sem; f && s >= 1; s--) {
    const r = registrosDeFila(e().semanas[s], f).reverse().find((x) => x.rir != null);
    if (r) return r.rir;
  }
  return null;
}

// ⚠️ Series que se salen del esquema: se pregunta si quedaron incompletas (así no cuentan en la fuerza)
function avisosRaros(f, sem, clave, reg, ult) {
  return seriesRaras(f, reg, ult).filter((x) => x.estado !== 'ok').map((x) => {
    const datos = ' data-sem="' + sem + '" data-clave="' + esc(clave) + '" data-i="' + x.i + '"';
    return x.estado === 'incompleta'
      ? '<div class="raro hecho">' + (x.i === 'p' ? 'Registro marcado como mal anotado' : 'Serie ' + (x.i + 1) + ' marcada como incompleta') + ': no cuenta en la fuerza. ' +
        '<button type="button" class="enlace" data-accion="gym-raro"' + datos + ' data-v="quitar">Deshacer</button></div>'
      : '<div class="raro"><span>⚠️ ' + esc(x.texto) + '. ¿' + (x.i === 'p' ? 'Peso mal anotado' : 'Registro incompleto') + '?</span><span class="raro-botones">' +
        '<button type="button" class="chip mini" data-accion="gym-raro"' + datos + ' data-v="inc">Sí, que no cuente</button>' +
        '<button type="button" class="chip mini" data-accion="gym-raro"' + datos + ' data-v="ok">No, está bien</button></span></div>';
  }).join('');
}

function lineaFuerza(ej, i, sem) {
  const hist = historial(e().semanas, e().rutina, ej, i, sem);
  if (!hist.length) return '';
  const u = hist[0].unidad, rec = records(hist).find((p) => p.semana === sem && sem > 0);
  const sub = ultimaSubida(hist), est = estancamiento(hist.filter((p) => p.semana < sem));
  if (rec) return '<div class="record">🏆 Récord: 1RM estimado <b>' + rm(rec.rm) + ' ' + u + '</b> (antes ' + rm(rec.antes) + ')</div>';
  if (est && est.estancado) return '<div class="progresion estancado">⏸ ' + est.semanas + ' semanas sin superar <b>' + formatoPeso(est.mejor.peso) + ' ' + u + ' × ' + est.mejor.reps + '</b>' +
    '<small>' + esc(consejoRir(rirReciente(ej, i, sem), true) || consejo(ej, est.semanas)) + '</small></div>';
  if (sub) return '<div class="progresion">📈 Última subida: ' + formatoPeso(sub.de) + ' → <b>' + formatoPeso(sub.a) + ' ' + u + '</b> · ' + cuando(sub.semana, sem) + '</div>';
  return hist.length >= 2 ? '<div class="progresion">Aún no has subido el peso: llega al tope de reps en todas las series para subir.</div>' : '';
}

// abierto: sin el desplegable (en la tarjeta de Fuerza, donde ya se eligió el ejercicio)
function historialEj(ej, sem, abierto = false) {
  const hist = historial(e().semanas, e().rutina, ej, 0, sem);
  if (hist.length < 2) return '';
  const u = hist[0].unidad, recs = new Set(records(hist).map((p) => p.semana));
  const etiqueta = (p) => (p.semana ? 'S' + p.semana : 'Antes');
  const puntos = hist.map((p) => ({ etiqueta: etiqueta(p), v: Math.round(p.rm * 10) / 10,
    tip: (p.semana ? 'Semana ' + p.semana : 'Antes de la app') + ': ' + formatoPeso(p.peso) + ' ' + u + ' × ' + p.reps + ' → 1RM est. ' + rm(p.rm) + (recs.has(p.semana) ? ' 🏆 récord' : '') }));
  const cuerpo = '<p class="nota-corta">1RM estimado de la mejor serie, semana a semana: así 60 × 10 y 65 × 7 se pueden comparar.</p>' +
    linea(puntos, { formato: rm, margenEje: 1 }) +
    tablaDatos(['Semana', 'Peso', 'Reps', '1RM est.', ''], hist.slice().reverse().map((p) => [etiqueta(p), formatoPeso(p.peso) + ' ' + u, p.reps, rm(p.rm), recs.has(p.semana) ? '🏆' : '']));
  return abierto ? cuerpo : '<details class="nota historial-ej"><summary>📈 Historial</summary>' + cuerpo + '</details>';
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
  const raros = revisarRaros(hasta), proximo = hasta === semanaActual() ? proximoEntreno() : '';
  if (!lista.length && !recs.length) return raros + proximo + '<p class="nota-corta">Cuando tengas el mismo ejercicio anotado en 2 semanas vas a ver aquí en qué estás mejorando.</p>';
  const fila = (x) => '<li><span>' + esc(x.nombre) + '<small>' + formatoPeso(x.de.peso) + ' × ' + x.de.reps + ' → ' + formatoPeso(x.a.peso) + ' × ' + x.a.reps + ' ' + x.a.unidad + '</small></span>' +
    '<b class="' + (x.cambio > 0.005 ? 'sube' : x.cambio < -0.005 ? 'baja' : '') + '">' + porcentaje(x.cambio) + '</b></li>';
  const ejDe = (nombre) => e().rutina.flatMap((d) => d.ejercicios).find((x) => x.nombre === nombre);
  return raros + proximo + '<h3>📈 Mejoraste (4 semanas)</h3>' +
    (suben.length ? '<ul class="fuerza-lista">' + suben.slice(0, 5).map(fila).join('') + '</ul>' : '<p class="nota-corta">Ningún ejercicio subió su 1RM estimado en estas 4 semanas.</p>') +
    (quietos.length ? '<h3>⏸ Estancados (3+ semanas sin superar tu mejor marca)</h3><ul class="fuerza-lista">' + quietos.slice(0, 5).map((x) =>
      '<li><span>' + esc(x.nombre) + '<small>' + esc(consejoRir(rirReciente(ejDe(x.nombre), 0, hasta), true) || consejo(x, x.est.semanas)) + '</small></span><b class="baja">' + x.est.semanas + ' sem</b></li>').join('') + '</ul>' : '') +
    (recs.length ? '<h3>🏆 Últimos récords</h3><ul class="fuerza-lista">' + recs.slice(0, 6).map((p) =>
      '<li><span>' + esc(p.nombre) + '<small>' + formatoPeso(p.peso) + ' ' + p.unidad + ' × ' + p.reps + ' · semana ' + p.semana + '</small></span><b>' + rm(p.rm) + '</b></li>').join('') + '</ul>' : '') +
    fuerzaRelativa(lista) + queRindes() + graficoEjercicio(hasta) +
    (lista.length ? tablaDatos(['Ejercicio', 'Antes', 'Ahora', 'Cambio'], lista.map((x) => [x.nombre, formatoPeso(x.de.peso) + ' × ' + x.de.reps, formatoPeso(x.a.peso) + ' × ' + x.a.reps, porcentaje(x.cambio)])) : '');
}

// Registros de las últimas 4 semanas que se salen del esquema y aún no se han respondido
function revisarRaros(hasta) {
  const raros = registrosRaros(e().semanas, e().rutina, hasta - 3, hasta);
  if (!raros.length) return '';
  return '<h3>⚠️ Revisa estos registros</h3><p class="nota-corta">Se salen de tu esquema. Si quedaron incompletos, no cuentan en la comparación.</p>' +
    '<div class="raros">' + raros.slice(0, 8).map((x) => '<div class="raro-ej"><b>' + esc(x.ej.nombre) + '</b> <small>semana ' + x.semana + ' · ' + esc(textoRegistro(x.reg)) + '</small>' +
      avisosRaros(x.fila, x.semana, x.clave, x.reg, ultimoRegistro(e().semanas, x.fila, x.semana)) + '</div>').join('') + '</div>';
}

// Próximo día de gym (hoy si toca) con la meta de cada ejercicio (también en "Tu entrenador hoy")
export function proximoEntreno(max = Infinity) {
  const hoy = iso();
  for (let k = 0; k < 7; k++) {
    const f = sumarDias(hoy, k), d = e().rutina.find((x) => x.id !== 'core' && x.diaSemana === diaSemana(f));
    if (!d) continue;
    const sem = semanaActual() + (k && diaSemana(f) < diaSemana(hoy) ? 1 : 0);
    const metas = d.ejercicios.map((ej) => ({ ej, m: metaSesion(ej.filas[0], ultimoRegistro(e().semanas, ej.filas[0], sem)) })).filter((x) => x.m);
    if (!metas.length) return '';
    return '<h3>🎯 Tu próximo entreno: ' + esc(d.nombre) + ' <small>' + (k === 0 ? 'hoy' : k === 1 ? 'mañana' : DIAS_CORTOS[d.diaSemana].toLowerCase()) + '</small></h3>' +
      '<ul class="fuerza-lista">' + metas.slice(0, max).map(({ ej, m }) => '<li><span>' + esc(ej.nombre) + '<small>' + esc(m.motivo) + '</small></span><b class="' + (m.sube ? 'sube' : '') + '">' + esc(m.texto) + (m.sube ? ' ⬆' : '') + '</b></li>').join('') + '</ul>' +
      (metas.length > max ? '<button type="button" class="enlace" data-accion="ir-dia" data-dia="' + d.id + '">Ver las ' + metas.length + ' metas en el Gym →</button>' : '');
  }
  return '';
}

// 1RM estimado dividido por el peso corporal: bajar de peso y mantener lo que levantas también es progreso
function fuerzaRelativa(lista) {
  const ahora = pesoCorporalEn(iso()), antes = pesoCorporalEn(sumarDias(iso(), -28));
  if (!ahora) return '<h3>⚖️ Fuerza relativa</h3><p class="nota-corta">Anota tu peso en ayunas (Hoy → Sueño y peso) para ver cuántas veces tu peso levantas.</p>';
  const pesoEn = (s) => (s ? pesoCorporalEn(sumarDias(lunesDe(s), 6)) : null);
  const filas = lista.filter((x) => x.a.unidad === 'kg').map((x) => {
    const pa = pesoEn(x.a.semana) || ahora, pd = pesoEn(x.de.semana);
    return { x, rel: x.a.rm / pa, cambio: pd ? (x.a.rm / pa) / (x.de.rm / pd) - 1 : null };
  }).sort((a, b) => b.rel - a.rel);
  const veces = (n) => (Math.round(n * 100) / 100).toLocaleString('es-CO') + '×';
  return '<h3>⚖️ Fuerza relativa</h3><p class="nota-corta">Peso corporal: <b>' + formatoPeso(Math.round(ahora * 10) / 10) + ' kg</b>' +
    (antes ? ' (' + (ahora <= antes ? '−' : '+') + formatoPeso(Math.round(Math.abs(ahora - antes) * 10) / 10) + ' kg en 4 semanas)' : '') + '. Veces tu peso que levantas (1RM estimado):</p>' +
    '<ul class="fuerza-lista">' + filas.slice(0, 5).map(({ x, rel, cambio }) => '<li><span>' + esc(x.nombre) + '<small>' + rm(x.a.rm) + ' kg' +
      (cambio != null ? ' · ' + porcentaje(cambio) + ' relativo' : '') + '</small></span><b>' + veces(rel) + '</b></li>').join('') + '</ul>';
}

// Cruza tus sesiones con el sueño, los partidos y la proteína
function queRindes() {
  const r = queTeHaceRendir(), listos = r.factores.filter((x) => !x.faltan);
  return '<h3>🧪 ¿Qué te hace rendir?</h3>' + (listos.length
    ? '<ul class="puntos-libro">' + listos.map((x) => '<li>' + esc(x.texto) + '</li>').join('') + '</ul>'
    : '<p class="nota-corta">Comparo cada entreno con tu propia tendencia. Con ' + r.sesiones + (r.sesiones === 1 ? ' sesión' : ' sesiones') +
      ' todavía faltan datos: anota el sueño cada mañana y los partidos, y en unas semanas vas a ver aquí qué te hace rendir más.</p>') +
    (listos.length && listos.length < r.factores.length ? '<p class="nota-corta">Para comparar lo demás faltan más días anotados de cada lado.</p>' : '');
}

// Un ejercicio a la vez: su 1RM estimado semana a semana
function graficoEjercicio(hasta) {
  const nombres = [...new Set(e().rutina.flatMap((d) => d.ejercicios))].filter((ej) => historial(e().semanas, e().rutina, ej, 0, hasta).length >= 2)
    .filter((ej, i, xs) => xs.findIndex((y) => y.nombre === ej.nombre) === i);
  if (!nombres.length) return '';
  const ej = nombres.find((x) => x.nombre === fuerzaEj) || nombres[0];
  return '<h3>📉 Un ejercicio en el tiempo</h3><label class="campo">Ejercicio<select data-cambio="fuerza-ej">' +
    nombres.map((x) => '<option' + (x.nombre === ej.nombre ? ' selected' : '') + '>' + esc(x.nombre) + '</option>').join('') + '</select></label>' +
    historialEj(ej, hasta, true);
}

// sinRapida: en una biserie las series se anotan por ronda (los dos ejercicios juntos), no una por una
function fila(f, sem, clave = f.id, ej = null, i = 0, sinRapida = false) {
  const reg = registros(sem)[clave] || {}, est = estadoFila(f, reg);
  const ult = ultimoRegistro(e().semanas, f, sem), sug = sugerencia(f, ult), meta = metaSesion(f, ult);
  const unidad = reg.unidad || (ult && ult.unidad) || 'kg';
  const rir = (v) => '<button type="button" class="chip mini' + (reg.rir === v ? ' activo' : '') + '" data-accion="gym-rir" data-fila="' + clave + '" data-v="' + v + '" aria-pressed="' + (reg.rir === v) + '">' + (v === 4 ? '4+' : v) + '</button>';
  return '<div class="fila-ej c-' + est.color + '">' +
    '<div class="fila-cab"><span class="tipo t-' + f.tipo.toLowerCase() + '">' + f.tipo + '</span>' +
    '<span class="esquema">' + esc(f.esquema) + (f.unidad === 's' ? ' (seg)' : '') + '</span>' +
    '<span class="descanso" title="Descanso">⏱ ' + reloj(f.descanso) + '</span>' +
    '<span class="contador">' + est.hechas + ' / ' + est.plan + '</span></div>' +
    (est.color === 'sube' ? '<div class="sube-peso">⬆ SUBE PESO la próxima semana (+2,5–5 %)</div>' : '') +
    '<div class="ultimo">Último: <b>' + textoRegistro(ult) + '</b>' +
    (sug ? ' · Hoy: <b class="' + (sug.sube ? 'sugerido-sube' : '') + '">' + esc(sug.texto) + (sug.sube ? ' ⬆' : '') + '</b>' : '') + '</div>' +
    (meta ? '<div class="meta-sesion">🎯 Meta: <b>' + esc(meta.texto) + '</b><small>' + esc(meta.motivo) + '</small></div>' : '') +
    (ej ? lineaFuerza(ej, i, sem) : '') + avisosRaros(f, sem, clave, reg, ult) +
    '<div class="entradas">' +
    '<input class="peso" type="text" inputmode="decimal" data-cambio="peso" data-fila="' + clave + '" value="' + esc(reg.peso || '') + '" placeholder="' + esc(sug ? formatoPeso(sug.peso) : 'Peso') + '" aria-label="Peso">' +
    '<select data-cambio="unidad" data-fila="' + clave + '" aria-label="Unidad"><option' + (unidad === 'kg' ? ' selected' : '') + '>kg</option><option' + (unidad === 'discos' ? ' selected' : '') + '>discos</option></select>' +
    '<input class="reps" type="text" data-cambio="reps" data-fila="' + clave + '" value="' + esc(reg.reps || '') + '" placeholder="Reps: 10 9 8" aria-label="Repeticiones de cada serie, separadas por espacio" autocomplete="off">' +
    '</div>' +
    (est.hechas < est.plan && !sinRapida ? '<div class="serie-rapida"><input type="text" inputmode="numeric" placeholder="' + (f.unidad === 's' ? 'seg' : 'reps') + '" aria-label="Repeticiones de esta serie" data-serie="' + clave + '">' +
      '<button type="button" class="boton primario" data-accion="serie" data-fila="' + clave + '">＋ Serie ' + (est.hechas + 1) + ' y descanso</button></div>' : '') +
    (est.hechas && f.unidad !== 's' ? '<div class="rir"><span>¿Cuántas reps te quedaban en la última serie?</span><span class="raro-botones">' + [0, 1, 2, 3, 4].map(rir).join('') + '</span></div>' : '') +
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
  // "A / b" en el nombre: botón para separarlo en una biserie (juntar dos ejercicios cualquiera se hace en Editar)
  const d = e().rutina.find((x) => x.ejercicios.includes(ej)), nombres = nombresBiserie(ej.nombre);
  return '<article class="tarjeta ejercicio"><header><h3>' + esc(ej.nombre) + '</h3><span class="musculo">' + esc(ej.musculo) + '</span>' + moverEj(ej) + '</header>' +
    (nombres && !sufijo && d && d.id !== 'core' ? '<button type="button" class="enlace bis-hacer" data-accion="gym-biserie" data-ej="' + ej.id + '">🔁 Separar en biserie: ' + esc(nombres.join(' + ')) + '</button>' : '') +
    ej.filas.map((f, i) => fila(f, sem, f.id + sufijo, ej, i)).join('') +
    historialEj(ej, sem) +
    '<details class="nota"' + (ej.nota ? ' open' : '') + '><summary>Notas</summary><textarea rows="2" data-cambio="nota" data-ej="' + ej.id + '" placeholder="Agarre, asiento, molestias…">' + esc(ej.nota || '') + '</textarea></details>' +
    '</article>';
}

// Biserie: los dos ejercicios en una tarjeta (A1 y A2), cada uno con su peso, y una ronda que anota los dos y arranca el descanso
// Series hechas y planeadas de todo el ejercicio, y la fila donde va la próxima serie (top, back-off…)
function avanceEj(ej, sem) {
  const regs = registros(sem), est = ej.filas.map((f) => estadoFila(f, regs[f.id] || {}));
  return { hechas: est.reduce((s, x) => s + Math.min(x.hechas, x.plan), 0), plan: est.reduce((s, x) => s + x.plan, 0),
    fila: ej.filas[est.findIndex((x) => x.hechas < x.plan)] || null };
}
function biserie(a, b, sem) {
  const ea = avanceEj(a, sem), eb = avanceEj(b, sem), fa = ea.fila, fb = eb.fila;
  const plan = Math.max(ea.plan, eb.plan), ronda = Math.min(ea.hechas, eb.hechas) + 1;
  const descanso = Math.max(...[fa, fb, a.filas[0], b.filas[0]].filter(Boolean).map((f) => f.descanso));
  const parte = (ej, letra) => '<div class="bis-ej"><h4><span class="bis-letra">' + letra + '</span>' + esc(ej.nombre) + ' <small>' + esc(ej.musculo) + '</small></h4>' +
    ej.filas.map((f, i) => fila(f, sem, f.id, ej, i, true)).join('') + historialEj(ej, sem) +
    '<details class="nota"' + (ej.nota ? ' open' : '') + '><summary>Notas</summary><textarea rows="2" data-cambio="nota" data-ej="' + ej.id + '" placeholder="Agarre, asiento, molestias…">' + esc(ej.nota || '') + '</textarea></details></div>';
  // Cada campo va a la fila pendiente de su ejercicio; si ese ya terminó, no aparece
  const campo = (f, ej, letra) => (f ? '<label class="campo">' + letra + ' · ' + esc(ej.nombre) + (ej.filas.length > 1 ? ' (' + f.tipo + ' ' + esc(f.esquema) + ')' : '') +
    '<input type="text" inputmode="numeric" placeholder="reps" data-serie="ronda@' + f.id + '"></label>' : '');
  return '<article class="tarjeta ejercicio biserie"><header><h3>🔁 Biserie</h3><span class="musculo">sin descanso entre los dos · ⏱ ' + reloj(descanso) + ' después</span></header>' +
    parte(a, 'A1') + parte(b, 'A2') +
    (fa || fb ? '<div class="bis-ronda"><div class="dos">' + campo(fa, a, 'A1') + campo(fb, b, 'A2') + '</div>' +
      '<button type="button" class="boton primario ancho" data-accion="gym-ronda" data-a="' + a.id + '" data-b="' + b.id + '">＋ Ronda ' + Math.min(ronda, plan) + ' de ' + plan + ' y descanso</button></div>'
      : '<p class="nota-corta centro">✓ ' + plan + ' rondas hechas</p>') +
    '<button type="button" class="enlace" data-accion="gym-biserie-quitar" data-ej="' + a.id + '">Ya no es biserie (separar las tarjetas)</button></article>';
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
    gruposDia(d.ejercicios).map((g) => (g.length === 2 ? biserie(g[0], g[1], sem) : ejercicio(g[0], sem))).join('') +
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
  // Descanso automático al sumar una serie (si aún faltan). En una biserie lo arranca la ronda, después de los dos
  if (ahora > antes && ahora < info.f.series && !enBiserie(info.d.ejercicios, info.ej)) iniciar('descanso', info.f.descanso, info.ej.nombre);
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
    const reg = (registros(semanaVista)[id] ??= {}), n = Number(v);
    if (reg.rir === n) delete reg.rir; else reg.rir = n;
    guardar();
  },
  'fuerza-ej'(ds, el) { fuerzaEj = el.value; repintar(); },
  // Ronda de la biserie: suma la serie de A1 y la de A2 (las que tengan reps) y arranca un solo descanso
  'gym-ronda'({ a, b }, el) {
    const ejs = [a, b].map((id) => e().rutina.flatMap((d) => d.ejercicios).find((x) => x.id === id));
    const caja = el.closest('.bis-ronda'), filas = ejs.map((ej) => avanceEj(ej, semanaVista).fila);
    const campos = filas.map((f) => f && caja.querySelector('[data-serie="ronda@' + f.id + '"]')), valores = campos.map((c) => (c ? c.value.trim() : ''));
    const valido = (v) => /^\d+([.,]\d+)?$/.test(v);
    if (!valores.some(valido)) { toast('Escribe las reps de A1 y A2'); (campos.find(Boolean) || el).focus(); return; }
    campos.forEach((c) => { if (c) c.value = ''; });
    const descanso = Math.max(...filas.filter(Boolean).map((f) => f.descanso));
    filas.forEach((f, k) => {
      if (!f || !valido(valores[k])) return;
      const reg = (registros(semanaVista)[f.id] ??= {});
      if (!reg.peso) {
        const sug = sugerencia(f, ultimoRegistro(e().semanas, f, semanaVista));
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
