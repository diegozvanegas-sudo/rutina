// Ajustes: nube, Google Sheets, metas, espera de la pastilla, sonido y copia de seguridad
import { e, guardar, repintar, exportar, importar, reiniciar, avanceMetas, semanaActual } from '../estado.js';
import { csvGym, csvDias } from '../csv.js';
import { iso, hora, fechaLarga, lunesDeFecha, ponerSemana1 } from '../fechas.js';
import { nube, configurada, entrar, salir, sincronizar, textoNube } from '../nube.js';
import { hoja, hojaLista, enviarSemana } from '../hoja.js';
import { AVISOS, HORAS_AVISOS, avisosDelDia, calendarioIcs } from '../registro.js';
import { soportados, avisosActivos, activarAvisos, desactivarAvisos } from '../avisos.js';
import { bloqueo, huellaActiva, activarHuella, quitarHuella, desbloquear, abrir } from '../bloqueo.js';
import { esc, registrar, toast } from '../ui.js';

// La meta de calorías la pone el plan de Dieta de cada día
const ETIQUETAS = { agua: 'Agua (ml)', pasos: 'Pasos', lectura: 'Lectura (min)', pantalla: 'Pantalla máxima (min)' };

export function vistaAjustes() {
  const c = e().config;
  return '<h1>Ajustes</h1>' + seccionPerfil() + seccionNube() + seccionAvisos() + seccionHoja() +
    '<section class="tarjeta"><h2>Metas diarias</h2><div class="dos">' + Object.entries(ETIQUETAS).map(([k, t]) =>
      '<label class="campo">' + t + '<input type="number" inputmode="numeric" min="0" data-cambio="conf-meta" data-k="' + k + '" value="' + esc(c.metas[k]) + '"></label>').join('') + '</div></section>' +
    '<section class="tarjeta"><h2>Pastilla → desayuno</h2><p class="nota-corta">Ajústalo a lo que indique tu médico.</p><div class="dos">' +
    '<label class="campo">Mínimo (min)<input type="number" inputmode="numeric" min="0" data-cambio="conf-espera" data-k="minimo" value="' + c.espera.minimo + '"></label>' +
    '<label class="campo">Ideal (min)<input type="number" inputmode="numeric" min="0" data-cambio="conf-espera" data-k="ideal" value="' + c.espera.ideal + '"></label></div></section>' +
    '<section class="tarjeta"><h2>Avisos</h2><label class="interruptor"><input type="checkbox" data-cambio="conf-sonido"' + (c.sonido ? ' checked' : '') + '> Sonido al terminar descansos y cambios de lado (la vibración siempre está activa)</label></section>' +
    '<section class="tarjeta"><h2>Copia de seguridad</h2><p class="nota-corta">Todo se guarda en este celular. Exporta una copia de vez en cuando o para pasarla a otro equipo.</p>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="exportar">⬇ Exportar (JSON)</button>' +
    '<label class="boton secundario">⬆ Importar<input type="file" accept="application/json,.json" data-cambio="importar" hidden></label></div>' +
    '<h2>Exportar a Excel / Sheets (CSV)</h2><div class="botones-rapidos">' +
    '<button type="button" class="boton secundario" data-accion="csv" data-que="gym">🏋️ Gym por semana</button>' +
    '<button type="button" class="boton secundario" data-accion="csv" data-que="dias">☀️ Hábitos y metas por día</button></div></section>' +
    '<section class="tarjeta peligro"><h2>Empezar de cero</h2><button type="button" class="boton peligro" data-accion="reiniciar">Borrar todos los datos</button></section>';
}

// Sin sesión no se muestra la app: solo esta pantalla (main.js)
export function pantallaEntrar() {
  if (!nube.lista) return '<section class="entrar"><p class="nota-corta">Cargando…</p></section>';
  return '<section class="tarjeta entrar"><h1>🏋️ Rutina</h1><p class="nota-corta">Entra con tu usuario de microrrutas para usar la app. Tus datos se guardan en la nube y pasan a otro celular o al computador.</p>' +
    '<label class="campo">Correo<input type="email" id="nube-correo" autocomplete="username" inputmode="email"></label>' +
    '<label class="campo">Contraseña<input type="password" id="nube-clave" autocomplete="current-password"></label>' +
    (nube.estado === 'sin-sesion' && !navigator.onLine ? '<p class="aviso">Sin conexión: conéctate para iniciar sesión.</p>' : '') +
    '<button type="button" class="boton primario grande ancho" data-accion="nube-entrar">Entrar</button></section>';
}

// Con la huella activa: candado al abrir la app (main.js)
export function pantallaBloqueo() {
  return '<section class="tarjeta entrar"><h1>🔒 Rutina</h1><p class="nota-corta">' + esc(nube.usuario.correo) + '</p>' +
    '<p class="nota-corta">Desbloquea con tu huella, tu cara o el PIN del celular.</p>' +
    (bloqueo.error ? '<p class="aviso">' + esc(bloqueo.error) + '</p>' : '') +
    '<button type="button" class="boton primario grande ancho" data-accion="huella-abrir"' + (bloqueo.intentando ? ' disabled' : '') + '>🔓 Desbloquear</button>' +
    '<button type="button" class="boton secundario ancho" data-accion="huella-contrasena">Entrar con contraseña</button></section>';
}

function seccionHuella() {
  if (huellaActiva()) {
    return '<h2>🔒 Bloqueo con huella</h2><p class="nota-corta">Activo en este equipo: al abrir la app, o al volver después de 5 minutos, se pide tu huella, tu cara o el PIN del celular.</p>' +
      '<button type="button" class="boton secundario" data-accion="huella-quitar">Quitar bloqueo</button>';
  }
  if (!bloqueo.disponible) return '';
  return '<h2>🔒 Bloqueo con huella</h2><p class="nota-corta">La sesión sigue recordada, pero para abrir la app se pide tu huella, tu cara o el PIN del celular. Se activa en cada equipo.</p>' +
    '<button type="button" class="boton primario" data-accion="huella-activar">Activar en este equipo</button>';
}

function seccionNube() {
  if (!configurada || !nube.usuario) return '';
  return '<section class="tarjeta"><h2>☁️ Nube</h2><p>' + esc(nube.usuario.correo) + '</p>' +
    '<p class="estado-nube n-' + nube.estado + '">' + textoNube() + (nube.ultima ? ' · ' + hora(nube.ultima) : '') + '</p>' +
    (nube.error ? '<p class="aviso">' + esc(nube.error) + '</p>' : '') +
    '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="nube-sync">↻ Sincronizar ahora</button>' +
    '<button type="button" class="boton secundario" data-accion="nube-salir">Salir</button></div>' + seccionHuella() + '</section>';
}

// Lo propio de cada usuario: cómo saludarlo y desde cuándo cuentan las semanas del gym
function seccionPerfil() {
  const c = e().config;
  return '<section class="tarjeta"><h2>👤 Perfil</h2><div class="dos">' +
    '<label class="campo">Tu nombre (para el saludo)<input type="text" data-cambio="conf-nombre" value="' + esc(c.nombre || '') + '" autocomplete="given-name"></label>' +
    '<label class="campo">Semana 1 del gym empieza<input type="date" data-cambio="conf-semana1" value="' + esc(c.semana1) + '"></label></div>' +
    '<p class="nota-corta">Las semanas van de lunes a domingo: la semana 1 es la del ' + fechaLarga(c.semana1) + ' y hoy vas en la semana ' + semanaActual() + '. ' +
    'Si la cambias, los registros siguen con su número de semana.</p>' +
    '<p class="nota-corta">El orden del menú, las tarjetas de Hoy y las metas se cambian en <a href="#editar/pantallas">✏️ Editar → Pantallas</a>.</p></section>';
}

const ETIQUETAS_HORA = { pastilla: '💊 Pastilla', partido: '⚽ Hora del partido', dormir: '🌙 Prepararte para dormir', revision: '📝 Cierre del domingo' };
function seccionAvisos() {
  const c = e().config.avisos || {}, horas = { ...HORAS_AVISOS, ...(c.horas || {}) }, apagados = c.apagados || {};
  const hoy = avisosDelDia(e().config);
  return '<section class="tarjeta"><h2>🔔 Avisos del día</h2>' +
    '<p class="nota-corta">Para que te avise siempre, aunque la app esté cerrada, agrega los avisos al calendario del celular. Los avisos de la app solo llegan con la app abierta o recién cerrada (también el fin del descanso del gym).</p>' +
    '<div class="dos">' + Object.entries(ETIQUETAS_HORA).map(([k, t]) =>
      '<label class="campo">' + t + '<input type="time" data-cambio="aviso-hora" data-k="' + k + '" value="' + esc(horas[k]) + '"></label>').join('') + '</div>' +
    Object.entries(AVISOS).map(([id, a]) => '<label class="interruptor"><input type="checkbox" data-cambio="aviso-activo" data-id="' + id + '"' + (apagados[id] ? '' : ' checked') + '> ' + a.icono + ' ' + esc(a.nombre) + '</label>').join('') +
    '<p class="nota-corta">Hoy: ' + (hoy.length ? hoy.map((a) => a.hora + ' ' + a.icono).join(' · ') : 'ningún aviso') + '</p>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="aviso-calendario">📅 Agregar al calendario</button>' +
    (soportados() ? (avisosActivos() ? '<button type="button" class="boton secundario" data-accion="aviso-desactivar">🔕 Quitar avisos de la app</button>'
      : '<button type="button" class="boton secundario" data-accion="aviso-activar">🔔 Activar avisos de la app</button>') : '') + '</div>' +
    '<p class="nota-corta">Si cambias una hora, vuelve a agregar el calendario (el nuevo reemplaza al anterior en la mayoría de calendarios; si queda repetido, borra el viejo).</p></section>';
}

function seccionHoja() {
  const h = e().config.hoja || {};
  return '<section class="tarjeta"><h2>📗 Google Sheets</h2><p class="nota-corta">Escribe el gym en la pestaña "Rutina 2.0" (columna de cada semana) y los días en "Diario App". ' +
    'Instala antes el Apps Script de la carpeta apps_script (ver README).</p>' +
    '<label class="campo">Dirección de la aplicación web<input type="url" data-cambio="conf-hoja" data-k="url" value="' + esc(h.url || '') + '" placeholder="https://script.google.com/macros/s/…/exec" autocomplete="off"></label>' +
    '<label class="campo">Clave (la misma de CLAVE en el script)<input type="text" data-cambio="conf-hoja" data-k="clave" value="' + esc(h.clave || '') + '" autocomplete="off"></label>' +
    '<label class="interruptor"><input type="checkbox" data-cambio="conf-hoja-auto"' + (h.auto !== false ? ' checked' : '') + '> Enviar sola la semana actual un minuto después de cada cambio</label>' +
    (hoja.mensaje ? '<p class="' + (hoja.estado === 'error' ? 'aviso' : 'nota-corta') + '">' + (hoja.ultima && hoja.estado === 'ok' ? hora(hoja.ultima) + ' · ' : '') + esc(hoja.mensaje) + '</p>' : '') +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="hoja-enviar"' + (hojaLista() ? '' : ' disabled') + '>📤 Enviar semana actual</button>' +
    '<button type="button" class="boton secundario" data-accion="hoja-todas"' + (hojaLista() ? '' : ' disabled') + '>Enviar todas</button></div></section>';
}

function descargar(texto, tipo, nombre) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([texto], { type: tipo }));
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function enviar(semanas) {
  try {
    let ultimo = '';
    for (const s of semanas) ultimo = await enviarSemana(s);
    toast('📗 ' + (semanas.length > 1 ? semanas.length + ' semanas enviadas' : ultimo));
  } catch (err) { toast('No se pudo enviar: ' + err.message); }
  repintar();
}

registrar({
  async 'nube-entrar'() {
    const correo = document.getElementById('nube-correo').value, clave = document.getElementById('nube-clave').value;
    if (!correo || !clave) { toast('Escribe correo y contraseña'); return; }
    abrir(); // con la contraseña no hace falta además la huella
    try { await entrar(correo, clave); toast('Sesión iniciada'); } catch (err) { toast(err.message); }
  },
  'huella-abrir'() { desbloquear(); },
  async 'huella-contrasena'() { await salir(); },
  async 'huella-activar'() {
    try { await activarHuella(); toast('🔒 Bloqueo con huella activado'); } catch (err) { toast(err.name === 'NotAllowedError' ? 'Se canceló' : 'No se pudo activar: ' + err.message); }
    repintar();
  },
  'huella-quitar'() { if (confirm('¿Quitar el bloqueo con huella en este equipo?')) { quitarHuella(); repintar(); } },
  'nube-sync'() { sincronizar(); },
  'aviso-hora'({ k }, el) { if (el.value) { ((e().config.avisos ??= {}).horas ??= {})[k] = el.value; guardar(); } },
  'aviso-activo'({ id }, el) { const a = ((e().config.avisos ??= {}).apagados ??= {}); if (el.checked) delete a[id]; else a[id] = true; guardar(); },
  'aviso-calendario'() { descargar(calendarioIcs(e().config), 'text/calendar;charset=utf-8', 'rutina-avisos.ics'); toast('📅 Abre el archivo para agregarlo a tu calendario'); },
  async 'aviso-activar'() { try { await activarAvisos(); toast('🔔 Avisos activados en este equipo'); } catch (err) { toast(err.message); } repintar(); },
  'aviso-desactivar'() { desactivarAvisos(); repintar(); },
  async 'nube-salir'() { if (confirm('¿Cerrar la sesión? Los datos siguen en este celular, pero para volver a usar la app tendrás que entrar de nuevo.')) await salir(); },
  'conf-hoja'({ k }, el) { (e().config.hoja ??= {})[k] = el.value.trim(); guardar(); },
  'conf-hoja-auto'(ds, el) { (e().config.hoja ??= {}).auto = el.checked; guardar(); },
  'hoja-enviar'() { enviar([semanaActual()]); },
  'hoja-todas'() {
    const semanas = Object.keys(e().semanas).map(Number).filter((n) => n >= 1 && n <= semanaActual()).sort((a, b) => a - b);
    if (semanas.length && confirm('¿Enviar ' + semanas.length + ' semana(s) a la hoja? Escribe encima de lo que haya en esas columnas.')) enviar(semanas);
  },
  'conf-nombre'(ds, el) { e().config.nombre = el.value.trim(); guardar(); },
  'conf-semana1'(ds, el) {
    if (!el.value) { repintar(); return; }
    const lunes = lunesDeFecha(el.value);
    if (Object.keys(e().semanas).length && !confirm('Las semanas se vuelven a contar desde el ' + fechaLarga(lunes) + '. Lo anotado sigue en su número de semana. ¿Seguir?')) { repintar(); return; }
    e().config.semana1 = lunes;
    ponerSemana1(lunes);
    guardar();
  },
  'conf-meta'({ k }, el) { e().config.metas[k] = Math.max(0, Number(el.value) || 0); guardar(); },
  'conf-espera'({ k }, el) { e().config.espera[k] = Math.max(0, Number(el.value) || 0); guardar(); },
  'conf-sonido'(ds, el) { e().config.sonido = el.checked; guardar(); },
  exportar() { descargar(exportar(), 'application/json', 'rutina-' + iso() + '.json'); },
  csv({ que }) {
    const texto = que === 'gym' ? csvGym(e()) : csvDias(e(), avanceMetas);
    descargar(texto, 'text/csv;charset=utf-8', (que === 'gym' ? 'gym-' : 'dias-') + iso() + '.csv');
  },
  importar(ds, el) {
    const archivo = el.files && el.files[0];
    if (!archivo || !confirm('Esto reemplaza todos los datos de este celular por los del archivo. ¿Seguir?')) return;
    archivo.text().then((t) => { importar(t); toast('Copia importada'); }).catch((err) => alert(err.message));
  },
  reiniciar() {
    if (confirm('¿Borrar todos los registros, hábitos y metas de este celular? No se puede deshacer.') && confirm('¿Seguro? Exporta antes una copia si la quieres.')) reiniciar();
  },
});
