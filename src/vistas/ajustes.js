// Ajustes: nube, Google Sheets, metas, espera de la pastilla, sonido y copia de seguridad
import { e, guardar, repintar, exportar, importar, reiniciar, avanceMetas, semanaActual } from '../estado.js';
import { csvGym, csvDias } from '../csv.js';
import { iso, hora } from '../fechas.js';
import { nube, configurada, entrar, salir, sincronizar, textoNube } from '../nube.js';
import { hoja, hojaLista, enviarSemana } from '../hoja.js';
import { esc, registrar, toast } from '../ui.js';

// La meta de calorías la pone el plan de Dieta de cada día
const ETIQUETAS = { agua: 'Agua (ml)', pasos: 'Pasos', lectura: 'Lectura (min)' };

export function vistaAjustes() {
  const c = e().config;
  return '<h1>Ajustes</h1>' + seccionNube() + seccionHoja() +
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

function seccionNube() {
  if (!configurada || !nube.usuario) return '';
  return '<section class="tarjeta"><h2>☁️ Nube</h2><p>' + esc(nube.usuario.correo) + '</p>' +
    '<p class="estado-nube n-' + nube.estado + '">' + textoNube() + (nube.ultima ? ' · ' + hora(nube.ultima) : '') + '</p>' +
    (nube.error ? '<p class="aviso">' + esc(nube.error) + '</p>' : '') +
    '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="nube-sync">↻ Sincronizar ahora</button>' +
    '<button type="button" class="boton secundario" data-accion="nube-salir">Salir</button></div></section>';
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
    try { await entrar(correo, clave); toast('Sesión iniciada'); } catch (err) { toast(err.message); }
  },
  'nube-sync'() { sincronizar(); },
  async 'nube-salir'() { if (confirm('¿Cerrar la sesión? Los datos siguen en este celular, pero para volver a usar la app tendrás que entrar de nuevo.')) await salir(); },
  'conf-hoja'({ k }, el) { (e().config.hoja ??= {})[k] = el.value.trim(); guardar(); },
  'conf-hoja-auto'(ds, el) { (e().config.hoja ??= {}).auto = el.checked; guardar(); },
  'hoja-enviar'() { enviar([semanaActual()]); },
  'hoja-todas'() {
    const semanas = Object.keys(e().semanas).map(Number).filter((n) => n >= 1 && n <= semanaActual()).sort((a, b) => a - b);
    if (semanas.length && confirm('¿Enviar ' + semanas.length + ' semana(s) a la hoja? Escribe encima de lo que haya en esas columnas.')) enviar(semanas);
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
