// Copia en la nube (Supabase, esquema "rutina" del proyecto de microrrutas). El celular sigue siendo lo principal:
// todo funciona sin señal y, cuando hay internet, se sube o se baja lo más reciente.
import { createClient } from '@supabase/supabase-js';
import { e, alGuardarse, datosParaNube, reemplazar, marcarNube, repintar, usarUsuario, esperarUsuario } from './estado.js';
import { ponerPermisos, permisosGuardados, quitarPermisos } from './permisos.js';

const url = import.meta.env.VITE_SUPABASE_URL, llave = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configurada = !!(url && llave);
const supabase = configurada ? createClient(url, llave, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'rutina-sesion' } }) : null;

// estado: sin-sesion · sincronizando · al-dia · pendiente · sin-conexion · error
// lista: ya se sabe si hay sesión guardada (al abrir, Supabase la lee un instante después)
export const nube = { usuario: null, estado: configurada ? 'sin-sesion' : 'no-configurada', ultima: null, error: '', lista: !configurada };
function poner(estado, error = '') { nube.estado = estado; nube.error = error; repintar(); }

let corriendo = null, otraVez = false, espera = null;

export async function sincronizar(silencio = false) {
  if (!supabase || !nube.usuario) return;
  if (corriendo) { otraVez = true; return corriendo; }
  if (!navigator.onLine) { poner('sin-conexion'); return; }
  corriendo = (async () => {
    if (!silencio) poner('sincronizando');
    try {
      const { data, error } = await supabase.rpc('rutina_leer');
      if (error) throw error;
      const remoto = data && data[0];
      const local = e(), base = local.nube && local.nube.usuario === nube.usuario.id ? local.nube.base : null;
      const cambioRemoto = remoto ? Number(remoto.version) : 0;
      const cambiosAqui = base == null ? tieneDatos(local) : local.cambio > base;
      const cambiosAlla = remoto && (base == null || cambioRemoto > base);

      if (cambiosAlla && cambiosAqui) {
        // Los dos lados cambiaron desde la última vez: queda lo último que se guardó, sea de aquí o de otro equipo
        if (cambioRemoto >= (local.cambio || 0)) bajar(remoto); else await subir(local);
      } else if (cambiosAlla) bajar(remoto);
      else if (cambiosAqui || !remoto) await subir(local);
      nube.ultima = Date.now();
      if (!silencio || nube.estado !== 'al-dia') poner('al-dia');
    } catch (err) {
      poner(navigator.onLine ? 'error' : 'sin-conexion', err.message || String(err));
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
}
async function subir(local) {
  const cambio = local.cambio || Date.now();
  const { data, error } = await supabase.rpc('rutina_guardar', { p_datos: datosParaNube(), p_version: cambio });
  if (error) throw error;
  if (Number(data) > cambio) {
    // Otro equipo guardó algo más nuevo justo antes: se baja eso
    const r = await supabase.rpc('rutina_leer');
    if (!r.error && r.data && r.data[0]) bajar(r.data[0]);
    return;
  }
  marcarNube({ usuario: nube.usuario.id, base: cambio });
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

export function iniciarNube() {
  if (!supabase) return;
  supabase.auth.onAuthStateChange((evento, sesion) => {
    const antes = nube.usuario && nube.usuario.id;
    nube.usuario = sesion ? { id: sesion.user.id, correo: sesion.user.email } : null;
    nube.lista = true;
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
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { sincronizar(); cargarPermisos(); } });
  // Con la app abierta también: cada 20 s se baja lo que otro equipo haya subido (los cambios de aquí se suben solos a los 3 s)
  setInterval(() => { if (document.visibilityState === 'visible' && !corriendo && nube.estado !== 'pendiente') sincronizar(true); }, 20000);
}

export function textoNube() {
  return {
    'no-configurada': 'Sin nube', 'sin-sesion': 'Sin iniciar sesión', sincronizando: 'Sincronizando…', 'al-dia': 'Guardado en la nube',
    pendiente: 'Cambios por subir', 'sin-conexion': 'Sin conexión: se sube al volver', error: 'Error al sincronizar',
  }[nube.estado];
}
