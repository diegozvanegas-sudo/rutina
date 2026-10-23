// Copia en la nube (Supabase, esquema "rutina" del proyecto de microrrutas). El celular sigue siendo lo principal:
// todo funciona sin señal y, cuando hay internet, se sube o se baja lo más reciente.
import { createClient } from '@supabase/supabase-js';
import { e, alGuardarse, datosParaNube, reemplazar, marcarNube, repintar } from './estado.js';

const url = import.meta.env.VITE_SUPABASE_URL, llave = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configurada = !!(url && llave);
const supabase = configurada ? createClient(url, llave, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'rutina-sesion' } }) : null;

// estado: sin-sesion · sincronizando · al-dia · pendiente · sin-conexion · error
export const nube = { usuario: null, estado: configurada ? 'sin-sesion' : 'no-configurada', ultima: null, error: '' };
function poner(estado, error = '') { nube.estado = estado; nube.error = error; repintar(); }

let corriendo = null, otraVez = false, espera = null;

export async function sincronizar() {
  if (!supabase || !nube.usuario) return;
  if (corriendo) { otraVez = true; return corriendo; }
  if (!navigator.onLine) { poner('sin-conexion'); return; }
  corriendo = (async () => {
    poner('sincronizando');
    try {
      const { data, error } = await supabase.rpc('rutina_leer');
      if (error) throw error;
      const remoto = data && data[0];
      const local = e(), base = local.nube && local.nube.usuario === nube.usuario.id ? local.nube.base : null;
      const cambioRemoto = remoto ? Number(remoto.version) : 0;
      const cambiosAqui = base == null ? tieneDatos(local) : local.cambio > base;
      const cambiosAlla = remoto && (base == null || cambioRemoto > base);

      if (cambiosAlla && cambiosAqui) {
        // Los dos lados cambiaron desde la última vez (o es la primera vez en este celular con datos propios)
        const usarNube = confirm('Hay cambios en este celular y también en la nube.\n\nAceptar: quedarse con lo de la nube.\nCancelar: subir lo de este celular y reemplazar la nube.');
        if (usarNube) bajar(remoto); else await subir(local);
      } else if (cambiosAlla) bajar(remoto);
      else if (cambiosAqui || !remoto) await subir(local);
      nube.ultima = Date.now();
      poner('al-dia');
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
    if (!nube.usuario) { poner('sin-sesion'); return; }
    if (antes !== nube.usuario.id) setTimeout(sincronizar, 0);
  });
  alGuardarse(programar);
  window.addEventListener('online', sincronizar);
  window.addEventListener('offline', () => nube.usuario && poner('sin-conexion'));
  // Al volver a la app (otro equipo pudo haber guardado)
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') sincronizar(); });
}

export function textoNube() {
  return {
    'no-configurada': 'Sin nube', 'sin-sesion': 'Sin iniciar sesión', sincronizando: 'Sincronizando…', 'al-dia': 'Guardado en la nube',
    pendiente: 'Cambios por subir', 'sin-conexion': 'Sin conexión: se sube al volver', error: 'Error al sincronizar',
  }[nube.estado];
}
