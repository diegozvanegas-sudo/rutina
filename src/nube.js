// Copia en la nube (Supabase, esquema "rutina" del proyecto de microrrutas). El celular sigue siendo lo principal:
// todo funciona sin señal y, cuando hay internet, se sube o se baja lo más reciente.
import { createClient } from '@supabase/supabase-js';
import { e, alGuardarse, datosParaNube, reemplazar, marcarNube, repintar, usarUsuario, esperarUsuario, guardarBase, leerBase, guardarAntes, marcarCambio, claveActual } from './estado.js';
import { combinarEstado, difiereDeLaNube } from './combinar.js';
import { ponerPermisos, permisosGuardados, quitarPermisos } from './permisos.js';

const url = import.meta.env.VITE_SUPABASE_URL, llave = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configurada = !!(url && llave);
const supabase = configurada ? createClient(url, llave, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'rutina-sesion' } }) : null;

// estado: sin-sesion · sincronizando · al-dia · pendiente · sin-conexion · error
// lista: ya se sabe si hay sesión guardada (al abrir, Supabase la lee un instante después)
// proteccion: la nube no dejó subir porque se iban a borrar más de la mitad de los registros (supabase/esquema.sql)
export const nube = { usuario: null, estado: configurada ? 'sin-sesion' : 'no-configurada', ultima: null, error: '', lista: !configurada, proteccion: false };
function poner(estado, error = '') { nube.estado = estado; nube.error = error; repintar(); }

let corriendo = null, otraVez = false, espera = null;

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
      const { data, error } = await supabase.rpc('rutina_leer');
      if (error) throw error;
      seguir(cuenta);
      const remoto = data && data[0];
      const local = e(), base = local.nube && local.nube.usuario === nube.usuario.id ? local.nube.base : null;
      const cambioRemoto = remoto ? Number(remoto.version) : 0;
      const cambiosAqui = base == null ? tieneDatos(local) : local.cambio > base;
      const cambiosAlla = remoto && (base == null || cambioRemoto > base);

      if (cambiosAlla && cambiosAqui) {
        // Los dos lados cambiaron desde la última vez: se combinan, y solo en lo que chocan gana lo último guardado
        const aqui = datosParaNube();
        guardarAntes(aqui);
        reemplazar(combinarEstado(leerBase(), aqui, remoto.datos, (local.cambio || 0) > cambioRemoto));
        marcarCambio(Math.max(Date.now(), cambioRemoto + 1));
        await subir(e(), cuenta);
      } else if (cambiosAlla) bajar(remoto);
      else if (cambiosAqui || !remoto) await subir(local, cuenta);
      nube.ultima = Date.now();
      if (!silencio || nube.estado !== 'al-dia') poner('al-dia');
    } catch (err) {
      if (err instanceof CambioDeCuenta) return;
      const msg = err.message || String(err);
      if (/^Protecci/.test(msg)) nube.proteccion = true;
      poner(navigator.onLine ? 'error' : 'sin-conexion', msg);
    }
  })();
  try { await corriendo; } finally {
    corriendo = null;
    if (otraVez) { otraVez = false; sincronizar(); }
  }
}

// Hay algo propio en este celular (más allá de lo que trae la app de entrada)
function tieneDatos(est) {
  return Object.keys(est.dias || {}).length > 0 || Object.keys(est.semanas || {}).some((s) => s !== '1');
}
function bajar(remoto) {
  reemplazar(remoto.datos);
  marcarNube({ usuario: nube.usuario.id, base: Number(remoto.version) });
  guardarBase(remoto.datos);
}
async function subir(local, cuenta) {
  seguir(cuenta);
  const cambio = local.cambio || Date.now();
  const datos = datosParaNube();
  const { data, error } = await supabase.rpc('rutina_guardar', { p_datos: datos, p_version: cambio });
  if (error) throw error;
  seguir(cuenta);
  if (Number(data) > cambio) {
    // Otro equipo guardó algo más nuevo justo antes: otra vuelta para combinarlo
    otraVez = true;
    return;
  }
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
  const { error } = await supabase.auth.signInWithPassword({ email: correo.trim(), password: clave });
  if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : error.message);
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
    if ((nube.usuario && nube.usuario.id) !== antes) nube.proteccion = false;
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

export function textoNube() {
  return {
    'no-configurada': 'Sin nube', 'sin-sesion': 'Sin iniciar sesión', sincronizando: 'Sincronizando…', 'al-dia': 'Guardado en la nube',
    pendiente: 'Cambios por subir', 'sin-conexion': 'Sin conexión: se sube al volver', error: 'Error al sincronizar',
  }[nube.estado];
}
