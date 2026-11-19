// 🎨 La marca del entrenador (su negocio, su color y su logo) y el portal de cada lado. Sin pantalla, para poder probarlo.
//   · El entrenador la guarda en config.marca = { negocio, color: '#RRGGBB', logo: 'data:image/…' } (🧑‍💼 Panel → Mi marca)
//   · Viaja dentro del plan que publica (coach.js planParaPublicar): el cliente la ve en su barra lateral y en Mi entrenador
//   · El menú: el cliente ve primero lo suyo (Inicio, Mi entrenador, Mi entreno, Nutrición, Progreso) y lo demás en "Más";
//     el entrenador ve arriba su negocio (Panel, Pagos, Valoraciones, Clientes)
export const COLORES_MARCA = ['#3ddc84', '#2f80ed', '#9b51e0', '#eb5757', '#f2994a', '#f2c94c', '#00b8a9', '#111111'];
export const LOGO_MAX = 60000; // caracteres del data URL (~45 kB): el plan publicado tiene un tope de 500 kB
const hex = (c) => (/^#[0-9a-f]{6}$/i.test(String(c || '').trim()) ? String(c).trim().toLowerCase() : null);
const logoValido = (l) => typeof l === 'string' && /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(l) && l.length <= LOGO_MAX;

// Lo que se guarda y se publica: solo esto, limpio (un plan que llega de la nube no puede traer otra cosa)
export function limpiarMarca(m) {
  if (!m || typeof m !== 'object') return null;
  const negocio = String(m.negocio || '').trim().slice(0, 40), color = hex(m.color), logo = logoValido(m.logo) ? m.logo : null;
  return negocio || color || logo ? { negocio, color, logo } : null;
}

// Texto legible sobre un color (blanco o casi negro, el de más contraste)
export function tintaSobre(color) {
  const c = hex(color);
  if (!c) return null;
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(c.slice(i, i + 2), 16))), L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return (1.05) / (L + 0.05) >= (L + 0.05) / 0.05 ? '#ffffff' : '#111111';
}
// Iniciales del negocio para cuando no hay logo ("Fit Lab" → "FL")
export const iniciales = (nombre) => String(nombre || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '🏋️';

// ---------- El menú de cada lado ----------
// modo: 'cliente' (tiene entrenador y no entrena a nadie), 'entrenador' (rol entrenador) o null (como siempre)
export function modoPortal({ rol, tieneEntrenador }) {
  if (rol === 'entrenador') return 'entrenador';
  if (tieneEntrenador && rol !== 'admin') return 'cliente';
  return null;
}
// Lo principal del cliente, en este orden y con nombres de cliente. Lo demás va en "Más"
export const MENU_CLIENTE = [['hoy', 'Inicio'], ['entrenador', 'Mi entrenador'], ['gym', 'Mi entreno'], ['dieta', 'Nutrición'], ['progreso', 'Mi progreso'], ['ajustes', 'Ajustes']];
// El negocio del entrenador, arriba: [ruta, icono, nombre]
export const MENU_NEGOCIO = [['panel/inicio', '🧑‍💼', 'Panel'], ['panel/pagos', '💳', 'Pagos'], ['panel/valoraciones', '📊', 'Valoraciones'], ['clientes', '👥', 'Clientes']];

// Reparte los enlaces del menú (en el orden del usuario) según el modo: { principales, mas }
export function repartirMenu(enlaces, modo) {
  if (modo === 'cliente') {
    const por = Object.fromEntries(enlaces.map((x) => [x.k, x]));
    const principales = MENU_CLIENTE.filter(([k]) => por[k]).map(([k, nombre]) => ({ ...por[k], nombre }));
    const usados = new Set(principales.map((x) => x.k));
    return { principales, mas: enlaces.filter((x) => !usados.has(x.k)) };
  }
  return { principales: enlaces, mas: [] };
}

// ---------- Firma del plan: cambia solo si cambia lo que el cliente usa (rutina, comidas, ciclo, objetivo, nota) ----------
// Así, mandarle un pago nuevo, una valoración o la marca no le aparece como "plan nuevo" que tenga que volver a usar
export function firmaPlan(p) {
  const t = JSON.stringify([p.rutina || [], (p.dieta && p.dieta.planes) || {}, p.ciclo || null, p.objetivo || '', p.nota || '']);
  let h = 5381;
  for (let i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0;
  return h.toString(36) + '-' + t.length.toString(36);
}
