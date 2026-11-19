// 🧑‍💼 Panel del entrenador (la pantalla está en src/react/pantallas/Panel.tsx): su negocio de un vistazo, los pagos y las
// valoraciones de todos sus clientes y 🎨 su marca (nombre, color y logo), que les llega a sus clientes en su app.
import { e, guardar, repintar } from '../estado.js';
import { registrar, toast } from '../ui.js';
import { limpiarMarca, LOGO_MAX } from '../marca.js';
import { actualizarTodos } from './clientes.js';
import { nube } from '../nube.js';

export const PESTANAS_PANEL = ['inicio', 'pagos', 'valoraciones', 'marca'];
let pestana = 'inicio';
export const pestanaPanel = () => pestana;
export const marca = () => limpiarMarca(e().config.marca) || { negocio: '', color: null, logo: null };
function ponerMarca(cambio) {
  const m = limpiarMarca({ ...marca(), ...cambio });
  if (m) e().config.marca = m; else delete e().config.marca;
  guardar();
}

// El logo, achicado a 160 px (lo que se ve en la barra) y en webp o png: así cabe en el plan que se publica
async function logoChico(archivo) {
  const url = URL.createObjectURL(archivo);
  try {
    const img = await new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = url; });
    const lado = 160, k = Math.min(1, lado / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    for (const [tipo, q] of [['image/webp', 0.85], ['image/webp', 0.6], ['image/png', 1], ['image/jpeg', 0.7]]) {
      const d = c.toDataURL(tipo, q);
      if (d.startsWith('data:' + tipo) && d.length <= LOGO_MAX) return d;
    }
    return null;
  } finally { URL.revokeObjectURL(url); }
}

registrar({
  'abrir-panel'({ p }) { if (PESTANAS_PANEL.includes(p)) pestana = p; },
  'panel-pestana'({ p }) { if (PESTANAS_PANEL.includes(p)) { pestana = p; repintar(); window.scrollTo(0, 0); } },
  'marca-negocio'(ds, el) { ponerMarca({ negocio: el.value }); },
  'marca-color'({ v }, el) { ponerMarca({ color: v || (el && el.value) }); },
  async 'marca-logo'(ds, el) {
    const f = el.files && el.files[0];
    el.value = '';
    if (!f) return;
    if (!/^image\/(png|jpeg|webp)$/.test(f.type)) { toast('Usa una imagen PNG, JPG o WebP'); return; }
    const d = await logoChico(f).catch(() => null);
    if (!d) { toast('No se pudo usar esa imagen: prueba con otra más simple'); return; }
    ponerMarca({ logo: d });
    toast('🎨 Logo listo');
  },
  'marca-logo-quitar'() { ponerMarca({ logo: null }); },
  // Mandar la marca (y los pagos y valoraciones al día) a los clientes que ya tienen un plan tuyo
  async 'marca-mandar'() {
    if (!nube.usuario) { toast('Inicia sesión en la nube para mandarla a tus clientes'); return; }
    const n = await actualizarTodos();
    toast(n ? '📲 Les llegó a ' + n + (n === 1 ? ' cliente' : ' clientes') : 'A nadie: publica primero el plan de cada cliente (Clientes → 🔗 App)');
  },
});
