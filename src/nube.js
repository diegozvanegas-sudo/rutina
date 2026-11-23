// Copia en la nube (Supabase, esquema "rutina" del proyecto de microrrutas). El celular sigue siendo lo principal:
// todo funciona sin señal y, cuando hay internet, se sube o se baja lo más reciente.
import { createClient } from '@supabase/supabase-js';
import { e, alGuardarse, datosParaNube, reemplazar, marcarNube, repintar, usarUsuario, esperarUsuario, guardarBase, leerBase, guardarAntes, marcarCambio, claveActual, tomarBorradoAProposito } from './estado.js';
import { combinarEstado, difiereDeLaNube, tieneDatosPropios, cambiosParaNube, aplicarCambios, registrosQuitados, limpiarRepetidos, LIMITE_QUITAR } from './combinar.js';
import { toast } from './ui.js';
import { ponerPermisos, permisosGuardados, quitarPermisos, esSinAcceso } from './permisos.js';

const url = import.meta.env.VITE_SUPABASE_URL, llave = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configurada = !!(url && llave);
let supabase = configurada ? createClient(url, llave, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'rutina-sesion' } }) : null;

// estado: sin-sesion · sincronizando · al-dia · pendiente · sin-conexion · error
// lista: ya se sabe si hay sesión guardada (al abrir, Supabase la lee un instante después)
// proteccion: la nube no dejó subir porque se iban a borrar más de la mitad de los registros (supabase/esquema.sql)
// rechazo: la cuenta existe pero no tiene acceso a Rutina (es de microrrutas): se cerró la sesión y Entrar dice por qué
export const nube = { usuario: null, estado: configurada ? 'sin-sesion' : 'no-configurada', ultima: null, error: '', lista: !configurada, proteccion: false, rechazo: '' };
function poner(estado, error = '') { nube.estado = estado; nube.error = error; repintar(); }

// Las cuentas son las mismas de microrrutas y su administrador decide a qué app entra cada una: sin acceso a Rutina se cierra
// la sesión en este equipo (no en los demás ni en microrrutas) y se avisa en la pantalla de Entrar
async function rechazar(mensaje) {
  nube.rechazo = mensaje;
  clearTimeout(espera);
  try { await supabase.auth.signOut({ scope: 'local' }); } catch (err) {}
  repintar();
}

let corriendo = null, otraVez = false, espera = null;
// Sincronizar sin mover todo (rutina_version y rutina_guardar_partes, supabase/esquema.sql): se pregunta la versión y se baja
// todo solo si cambió; y se sube solo lo que cambió. sinPartes: la nube todavía no tiene esas funciones (se usa lo de antes).
// porPartes: la primera subida de cada vez que se abre la app va completa, por si la copia de base de este equipo quedó
// distinta de la nube; desde ahí, por partes
// sinCambios: la nube todavía no tiene rutina_cambios (bajar solo lo que cambió): se baja todo como antes
let sinPartes = false, porPartes = false, sinCambios = false;
const noExiste = (error) => !!error && (error.code === 'PGRST202' || /could not find the function/i.test(error.message || ''));
async function leerTodo() {
  const { data, error } = await supabase.rpc('rutina_leer');
  if (error) throw error;
  return (data && data[0]) || null;
}
// Bajar solo lo que cambió allá desde la última versión sincronizada (rutina_cambios, supabase/esquema.sql): se aplica a la
// copia de base de este equipo y queda lo mismo que tiene la nube. null si no se puede (sin copia de base, la primera vez
// de cada vez que se abre la app, o la nube no sabe): entonces se baja todo
async function leerCambios(base) {
  if (sinCambios || !porPartes || base == null) return null;
  const previo = leerBase();
  if (!previo) return null;
  const { data, error } = await supabase.rpc('rutina_cambios', { p_desde: base });
  if (noExiste(error)) { sinCambios = true; return null; }
  if (error) throw error;
  if (!data) return null;
  return { version: Number(data.version), datos: aplicarCambios(previo, data) };
}
// La versión de la nube (null si no hay nada); undefined si la nube no sabe responderla
async function versionNube() {
  if (sinPartes) return undefined;
  const { data, error } = await supabase.rpc('rutina_version');
  if (noExiste(error)) { sinPartes = true; return undefined; }
  if (error) throw error;
  return data == null ? null : Number(data);
}

// La cuenta con la que empezó la sincronización. Si mientras se espera a la nube se cambia de cuenta (Salir y entrar con
// otra), lo que llega no se mezcla con los datos de la otra cuenta: se corta y la siguiente vuelta empieza de nuevo
const cuentaDe = () => (nube.usuario ? nube.usuario.id + '|' + claveActual() : null);
class CambioDeCuenta extends Error {}
const seguir = (cuenta) => { if (cuentaDe() !== cuenta) throw new CambioDeCuenta('Cambió la cuenta'); };

export async function sincronizar(silencio = false) {
  if (!supabase || !nube.usuario) return;
  if (corriendo) { otraVez = true; return corriendo; }
  if (!navigator.onLine) { poner('sin-conexion'); return; }
  // Mientras la nube no deje subir, no se insiste cada 20 s: se espera a que se elija qué hacer en Ajustes
  if (nube.proteccion) return;
  corriendo = (async () => {
    if (!silencio) poner('sincronizando');
    const cuenta = cuentaDe();
    try {
      // Primero solo la versión: si nada cambió allá, no se baja nada
      const version = await versionNube();
      seguir(cuenta);
      let remoto = version === undefined ? await leerTodo() : null;
      seguir(cuenta);
      const local = e(), base = local.nube && local.nube.usuario === nube.usuario.id ? local.nube.base : null;
      const cambioRemoto = version === undefined ? (remoto ? Number(remoto.version) : null) : version;
      const hayRemoto = cambioRemoto != null;
      const cambiosAqui = base == null ? tieneDatos(local) : local.cambio > base;
      const cambiosAlla = hayRemoto && (base == null || cambioRemoto > base);
      if (cambiosAlla && !remoto) { remoto = (await leerCambios(base)) || (seguir(cuenta), await leerTodo()); seguir(cuenta); }

      if (cambiosAlla && remoto && cambiosAqui) {
        // Los dos lados cambiaron desde la última vez: se combinan, y solo en lo que chocan gana lo último guardado
        const aqui = datosParaNube(), vRemoto = Number(remoto.version);
        guardarAntes(aqui);
        reemplazar(combinarEstado(leerBase(), aqui, remoto.datos, (local.cambio || 0) > vRemoto));
        marcarCambio(Math.max(Date.now(), vRemoto + 1));
        await subir(e(), cuenta, { version: vRemoto, datos: remoto.datos });
      } else if (cambiosAlla && remoto) bajar(remoto);
      else if (cambiosAqui || !hayRemoto || (cambiosAlla && !remoto)) {
        // Allá no cambió nada: basta subir la diferencia con la última copia sincronizada
        const previo = hayRemoto && cambioRemoto === base && leerBase();
        await subir(local, cuenta, previo ? { version: base, datos: previo } : null);
      }
      nube.ultima = Date.now();
      if (!silencio || nube.estado !== 'al-dia') poner('al-dia');
    } catch (err) {
      if (err instanceof CambioDeCuenta) return;
      const msg = err.message || String(err);
      if (esSinAcceso(msg)) { await rechazar(msg); return; }
      if (/^Protecci/.test(msg)) nube.proteccion = true;
      poner(navigator.onLine ? 'error' : 'sin-conexion', msg);
    }
  })();
  try { await corriendo; } finally {
    corriendo = null;
    if (otraVez) { otraVez = false; sincronizar(); }
  }
}

// Hay algo propio en este celular (más allá de lo que trae la app de entrada y de los días vacíos que crea al pintar)
const tieneDatos = tieneDatosPropios;
function bajar(remoto) {
  porPartes = true;
  reemplazar(remoto.datos);
  marcarNube({ usuario: nube.usuario.id, base: Number(remoto.version) });
  guardarBase(remoto.datos);
}
// previo: { version, datos } lo que tiene la nube ahora, para subir solo la diferencia (sin previo, se sube todo)
async function subir(local, cuenta, previo = null) {
  seguir(cuenta);
  const cambio = local.cambio || Date.now();
  let datos = datosParaNube();
  // Freno: si esto quitaría de la nube muchos registros de golpe (una copia vieja de este equipo), no se borra nada: se
  // junta con lo de la nube (lo de los dos lados) y se avisa. Borrar todo desde Ajustes sí pasa
  if (previo && previo.datos && !tomarBorradoAProposito()) {
    const q = registrosQuitados(previo.datos, datos);
    if (q.total > LIMITE_QUITAR) {
      guardarAntes(datos);
      reemplazar(limpiarRepetidos(combinarEstado({}, datos, previo.datos, true)));
      datos = datosParaNube();
      const que = [['dias', 'días'], ['movimientos', 'movimientos'], ['recordatorios', 'de recordatorios'], ['notas', 'notas'], ['gym', 'del gym']].filter(([k]) => q[k]).map(([k, t]) => q[k] + ' ' + t).join(', ');
      toast('☁️ Este equipo tenía una copia vieja: en vez de borrar ' + que + ' de la nube, se juntó con lo de la nube. Revisa que esté todo.');
    }
  }
  let respuesta = null;
  if (previo && porPartes && !sinPartes) {
    const { partes, quitar } = cambiosParaNube(previo.datos, datos);
    respuesta = await supabase.rpc('rutina_guardar_partes', { p_partes: partes, p_quitar: quitar, p_base: previo.version, p_version: cambio });
    if (noExiste(respuesta.error)) { sinPartes = true; respuesta = null; }
    else if (!respuesta.error && Number(respuesta.data) !== cambio) {
      // La nube ya no estaba en esa versión (otro equipo guardó en el medio) y no cambió nada: otra vuelta para combinar
      seguir(cuenta);
      otraVez = true;
      return;
    }
  }
  respuesta ??= await supabase.rpc('rutina_guardar', { p_datos: datos, p_version: cambio });
  const { data, error } = respuesta;
  if (error) throw error;
  seguir(cuenta);
  if (Number(data) > cambio) {
    // Otro equipo guardó algo más nuevo justo antes: otra vuelta para combinarlo
    otraVez = true;
    return;
  }
  porPartes = true;
  marcarNube({ usuario: nube.usuario.id, base: cambio });
  guardarBase(datos);
}

// ---------- Protección e historial (☁️ Nube en Ajustes) ----------
// Lo de este equipo queda en ":antes" antes de cambiarlo por lo de la nube
async function traerDeNube() {
  const cuenta = cuentaDe();
  const { data, error } = await supabase.rpc('rutina_leer');
  if (error) throw new Error(error.message);
  seguir(cuenta);
  if (!data || !data[0]) throw new Error('La nube no tiene datos de esta cuenta');
  guardarAntes(datosParaNube());
  bajar(data[0]);
  nube.proteccion = false;
  nube.ultima = Date.now();
  poner('al-dia');
}
// La protección frenó una subida: se deja lo de la nube y se descarta lo de este equipo
export async function usarLoDeLaNube() {
  if (!supabase || !nube.usuario) throw new Error('Inicia sesión en la nube');
  clearTimeout(espera);
  await traerDeNube();
}
// Copias que guarda la nube (las más nuevas primero): { id, guardado, motivo, dias, registros }
export const copiasNube = () => llamar('rutina_historial');
// Vuelve a una copia en la nube y en este equipo; los demás equipos la bajan solos al sincronizar
export async function restaurarCopia(id) {
  await llamar('rutina_restaurar', { p_id: id });
  clearTimeout(espera);
  await traerDeNube();
}

// Red de seguridad: si algo cambió aquí sin pasar por guardar() (y por eso no quedó marcado), se marca y se sube.
// Devuelve true si encontró algo
export function revisarSinSubir() {
  if (!nube.usuario || nube.proteccion || corriendo) return false;
  const local = e();
  if (!local.nube || local.nube.usuario !== nube.usuario.id || local.cambio > local.nube.base) return false; // ya está por subir
  if (!difiereDeLaNube(datosParaNube(), leerBase())) return false;
  marcarCambio(Math.max(Date.now(), local.nube.base + 1));
  programar();
  return true;
}

// Después de cada cambio, se sube a los pocos segundos (agrupa varios toques seguidos)
function programar() {
  if (!nube.usuario) return;
  if (nube.estado === 'al-dia') { nube.estado = 'pendiente'; }
  clearTimeout(espera);
  espera = setTimeout(sincronizar, 3000);
}

// Permisos de quien entra (⚙️ Administrar). Si falla (sin internet, o el esquema aún no tiene las funciones) quedan
// los últimos guardados en el celular
export async function cargarPermisos() {
  if (!supabase || !nube.usuario || !navigator.onLine) return;
  const { data, error } = await supabase.rpc('rutina_mis_permisos');
  if (error && esSinAcceso(error.message)) { await rechazar(error.message); return; }
  if (error || !data) return;
  ponerPermisos(nube.usuario.id, data);
  repintar();
}
// Funciones de la pantalla Administrar: devuelve los datos o lanza el error con su mensaje
export async function llamar(funcion, args = {}) {
  if (!supabase || !nube.usuario) throw new Error('Inicia sesión en la nube');
  const { data, error } = await supabase.rpc(funcion, args);
  if (error) throw new Error(error.message);
  return data;
}

export async function entrar(correo, clave) {
  nube.rechazo = '';
  const { error } = await supabase.auth.signInWithPassword({ email: correo.trim(), password: clave });
  if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : error.message);
  // La contraseña es correcta, pero ¿la cuenta entra a Rutina? (si no, se sale y se dice por qué)
  const r = await supabase.rpc('rutina_mis_permisos');
  if (r.error && esSinAcceso(r.error.message)) { await rechazar(r.error.message); throw new Error(r.error.message); }
}
export async function salir() {
  await supabase.auth.signOut();
}

// Al salir de la app (cambiar de app, apagar la pantalla, cerrar la pestaña) lo pendiente se sube ya, sin esperar los 3 s
function subirYa() {
  revisarSinSubir();
  if (nube.estado === 'pendiente') { clearTimeout(espera); sincronizar(true); }
}

export function iniciarNube() {
  if (!supabase) return;
  supabase.auth.onAuthStateChange((evento, sesion) => {
    const antes = nube.usuario && nube.usuario.id;
    nube.usuario = sesion ? { id: sesion.user.id, correo: sesion.user.email } : null;
    nube.lista = true;
    if ((nube.usuario && nube.usuario.id) !== antes) { nube.proteccion = false; porPartes = false; }
    if (!nube.usuario) { nube.ultima = null; quitarPermisos(); esperarUsuario(); poner('sin-sesion'); return; }
    // Cada usuario con sus propios datos (y sus permisos) en este equipo
    if (antes !== nube.usuario.id) { nube.ultima = null; usarUsuario(nube.usuario.id); permisosGuardados(nube.usuario.id); }
    repintar();
    if (antes !== nube.usuario.id) setTimeout(() => { sincronizar(); cargarPermisos(); }, 0);
  });
  alGuardarse(programar);
  window.addEventListener('online', () => { sincronizar(); cargarPermisos(); });
  window.addEventListener('offline', () => nube.usuario && poner('sin-conexion'));
  // Al volver a la app (otro equipo pudo haber guardado)
  // Al salir (cambiar de app, apagar la pantalla) lo pendiente se sube ya, sin esperar los 3 s
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { sincronizar(); cargarPermisos(); }
    else subirYa();
  });
  window.addEventListener('pagehide', subirYa);
  // Con la app abierta también: cada 20 s se baja lo que otro equipo haya subido (los cambios de aquí se suben solos a los 3 s)
  // y se revisa que no haya quedado nada cambiado sin subir
  setInterval(() => {
    if (document.visibilityState !== 'visible' || corriendo || revisarSinSubir() || nube.estado === 'pendiente') return;
    sincronizar(true);
  }, 20000);
}

// Solo en desarrollo (tests/e2e/nube.mjs): una nube de mentira con las mismas funciones rutina_*, para probar la
// sincronización con clics reales y sin Supabase. No llega a la versión publicada
let dePrueba = false;
export function nubeDePrueba(cliente, usuario) {
  if (!import.meta.env.DEV) return;
  supabase = cliente; sinPartes = false; porPartes = false; sinCambios = false; corriendo = null; otraVez = false; nube.proteccion = false;
  nube.usuario = usuario; nube.lista = true; nube.estado = 'pendiente';
  usarUsuario(usuario.id);
  if (!dePrueba) { dePrueba = true; alGuardarse(programar); }
}

export function textoNube() {
  return {
    'no-configurada': 'Sin nube', 'sin-sesion': 'Sin iniciar sesión', sincronizando: 'Sincronizando…', 'al-dia': 'Guardado en la nube',
    pendiente: 'Cambios por subir', 'sin-conexion': 'Sin conexión: se sube al volver', error: 'Error al sincronizar',
  }[nube.estado];
}
