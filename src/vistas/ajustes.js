// Ajustes: las acciones de la pantalla (la pinta React: react/pantallas/Ajustes.tsx) y las pantallas de entrar y del
// candado, que son del armazón de la app (main.js)
import { e, guardar, repintar, exportar, importar, reiniciar, avanceMetas, semanaActual } from '../estado.js';
import { csvGym, csvDias } from '../csv.js';
import { iso, hora, fechaLarga, lunesDeFecha, ponerSemana1 } from '../fechas.js';
import { nube, entrar, salir, sincronizar, usarLoDeLaNube, copiasNube, restaurarCopia } from '../nube.js';
import { enviarSemana } from '../hoja.js';
import { calendarioIcs } from '../registro.js';
import { activarAvisos, desactivarAvisos } from '../avisos.js';
import { bloqueo, activarHuella, quitarHuella, desbloquear, abrir } from '../bloqueo.js';
import { esc, registrar, toast } from '../ui.js';
import { avisosDeSuplementos } from './suplementos.js';
import { presentacion } from './presentacion.js';

// Sin sesión no se muestra la app: solo esta pantalla (main.js)
export function pantallaEntrar() {
  if (!nube.lista) return '<section class="entrar"><p class="nota-corta">Cargando…</p></section>';
  // Al lado (computador) o debajo (celular): qué es la app, para quien llega por primera vez
  return '<div class="entrar-pagina"><section class="tarjeta entrar" aria-labelledby="entrar-titulo"><h2 id="entrar-titulo">Entrar</h2><p class="nota-corta">Entra con tu usuario. Tus datos se guardan en la nube y pasan a otro celular o al computador.</p>' +
    '<label class="campo">Correo<input type="email" id="nube-correo" autocomplete="username" inputmode="email"></label>' +
    '<label class="campo">Contraseña<input type="password" id="nube-clave" autocomplete="current-password"></label>' +
    (nube.estado === 'sin-sesion' && !navigator.onLine ? '<p class="aviso">Sin conexión: conéctate para iniciar sesión.</p>' : '') +
    (nube.rechazo ? '<p class="aviso" role="alert">🔒 ' + esc(nube.rechazo) + '</p>' : '') +
    '<button type="button" class="boton primario grande ancho" data-accion="nube-entrar">Entrar</button>' +
    '<p class="nota-corta">¿No tienes usuario? Pídeselo a tu entrenador.</p></section>' + presentacion() + '</div>';
}

// Con la huella activa: candado al abrir la app (main.js)
// El navegador que abre los enlaces dentro de WhatsApp, Instagram o Facebook: ahí la huella no funciona
const navegadorDeApp = () => typeof navigator !== 'undefined' && /WhatsApp|FBAN|FBAV|Instagram|Line\//i.test(navigator.userAgent || '');
export function pantallaBloqueo() {
  return '<div class="entrar-pagina"><section class="tarjeta entrar"><h2>🔒 Desbloquear</h2><p class="nota-corta">' + esc(nube.usuario.correo) + '</p>' +
    '<p class="nota-corta">Desbloquea con tu huella, tu cara o el PIN del celular.</p>' +
    (bloqueo.error ? '<p class="aviso">' + esc(bloqueo.error) + '</p>' : '') +
    (bloqueo.error || navegadorDeApp() ? '<p class="nota-corta">Si abriste el enlace desde WhatsApp u otra app, la huella puede no funcionar ahí: ábrelo en Safari o Chrome (menú ⋯ → Abrir en el navegador) o entra con tu contraseña.</p>' : '') +
    '<button type="button" class="boton primario grande ancho" data-accion="huella-abrir"' + (bloqueo.intentando ? ' disabled' : '') + '>🔓 Desbloquear</button>' +
    '<button type="button" class="boton secundario ancho" data-accion="huella-contrasena">Entrar con contraseña</button></section>' + presentacion() + '</div>';
}

// Copias que guarda la nube (una cada 10 minutos de uso y antes de cualquier subida que quite datos)
let copias = null, cargandoCopias = false;
const fechaCopia = (t) => { const d = new Date(t); return fechaLarga(iso(d)) + ' · ' + hora(d.getTime()); };
// Lo que lee la pantalla de React
export const piezasAjustes = { copias: () => copias, cargandoCopias: () => cargandoCopias, fechaCopia };
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
  async 'nube-usar'() {
    if (!confirm('¿Cambiar lo de este equipo por lo de la nube? Lo de aquí queda en una copia interna por si acaso.')) return;
    try { await usarLoDeLaNube(); toast('☁️ Listo: tienes lo de la nube'); } catch (err) { toast(err.message); }
  },
  async 'nube-copias'() {
    cargandoCopias = true; repintar();
    try { copias = await copiasNube(); } catch (err) { toast('No se pudieron ver las copias: ' + err.message); }
    cargandoCopias = false; repintar();
  },
  async 'nube-restaurar'({ id }) {
    const c = (copias || []).find((x) => String(x.id) === String(id));
    if (!c || !confirm('¿Volver a la copia del ' + fechaCopia(c.guardado) + ' (' + c.dias + ' días)? Lo de ahora queda guardado como otra copia.')) return;
    try { await restaurarCopia(c.id); copias = null; toast('🕘 Copia restaurada'); } catch (err) { toast('No se pudo restaurar: ' + err.message); }
  },
  'aviso-hora'({ k }, el) { if (el.value) { ((e().config.avisos ??= {}).horas ??= {})[k] = el.value; guardar(); } },
  'aviso-activo'({ id }, el) { const a = ((e().config.avisos ??= {}).apagados ??= {}); if (el.checked) delete a[id]; else a[id] = true; guardar(); },
  'aviso-calendario'() { descargar(calendarioIcs(e().config, iso(), avisosDeSuplementos()),'text/calendar;charset=utf-8', 'rutina-avisos.ics'); toast('📅 Abre el archivo para agregarlo a tu calendario'); },
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
    // Con nube, esto también se subiría: la nube lo frena si borra más de la mitad (y deja una copia en 🕘 Copias)
    const aviso = nube.usuario ? ' Se borran de este equipo; la nube conserva tus datos y no deja borrarlos de golpe (podrás volver a bajarlos).' : ' No se puede deshacer.';
    if (confirm('¿Borrar todos los registros, hábitos y metas?' + aviso) && confirm('¿Seguro? Exporta antes una copia si la quieres.')) reiniciar();
  },
});
