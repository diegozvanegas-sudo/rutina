// Bloqueo con la huella, la cara o el PIN del celular (WebAuthn). La sesión de la nube sigue recordada:
// esto solo pide comprobar que eres tú al abrir la app o al volver después de un rato.
// La llave queda en este equipo (no se sube a la nube); cada celular o computador se activa aparte.
import { repintar } from './estado.js';
import { nube } from './nube.js';

const CLAVE = 'rutina-huella', AUSENCIA = 5 * 60 * 1000;
function leer() { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch (err) { return null; } }
function escribir(v) { try { if (v) localStorage.setItem(CLAVE, JSON.stringify(v)); else localStorage.removeItem(CLAVE); } catch (err) {} }
const aTexto = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const aBytes = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const reto = () => crypto.getRandomValues(new Uint8Array(32));

// cerrado: al abrir la app empieza bloqueada · auto: pedir la huella sola al mostrar el candado
export const bloqueo = { disponible: false, cerrado: true, auto: true, intentando: false, error: '' };

// Activo para el usuario con sesión en este equipo
export const huellaActiva = () => { const h = leer(); return !!(h && nube.usuario && h.usuario === nube.usuario.id); };
export const bloqueada = () => bloqueo.cerrado && huellaActiva();
export function abrir() { bloqueo.cerrado = false; bloqueo.error = ''; }

export async function activarHuella() {
  const cred = await navigator.credentials.create({ publicKey: {
    challenge: reto(),
    rp: { name: 'Rutina' },
    user: { id: new TextEncoder().encode(nube.usuario.id), name: nube.usuario.correo, displayName: nube.usuario.correo },
    pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' },
    timeout: 60000,
  } });
  escribir({ id: aTexto(cred.rawId), usuario: nube.usuario.id });
  abrir();
}
export function quitarHuella() { escribir(null); }

export async function desbloquear() {
  const h = leer();
  if (!h || bloqueo.intentando) return;
  bloqueo.intentando = true; bloqueo.error = '';
  repintar();
  try {
    await navigator.credentials.get({ publicKey: {
      challenge: reto(), allowCredentials: [{ type: 'public-key', id: aBytes(h.id) }], userVerification: 'required', timeout: 60000,
    } });
    abrir();
  } catch (err) {
    bloqueo.error = err.name === 'NotAllowedError' ? 'No se comprobó. Toca Desbloquear para intentar de nuevo.' : (err.message || String(err));
  }
  bloqueo.intentando = false;
  repintar();
}

if (window.PublicKeyCredential && PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
  PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((si) => { bloqueo.disponible = si; repintar(); }).catch(() => {});
}

// Al volver a la app después de 5 minutos fuera se vuelve a bloquear
let fuera = 0;
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { fuera = Date.now(); return; }
  if (fuera && Date.now() - fuera > AUSENCIA && huellaActiva() && !bloqueo.cerrado) { bloqueo.cerrado = true; bloqueo.auto = true; repintar(); }
});
