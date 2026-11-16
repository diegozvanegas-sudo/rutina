// "Hoy": tablero con la mañana, las metas, el entrenamiento que toca y la semana. La pantalla está en
// src/react/pantallas/Hoy.tsx (y sus tarjetas en HoyTarjetas.tsx); aquí quedan el saludo, el reparto en columnas, lo
// plegado y las acciones (plantilla, organizar, acomodar solas, plegar y guardar el orden arrastrado)
import { e, avanceMetas, elegirPlantilla, guardar, repintar } from '../estado.js';
import { esc, registrar } from '../ui.js';
import { diaDeHoy } from './gym.js';
import { pendienteSuplementos } from './suplementos.js';

function saludo() {
  const h = new Date().getHours();
  const nombre = (e().config.nombre || '').trim();
  return (h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches') + (nombre ? ', ' + esc(nombre) : '');
}

// Entrenador, foco y estudio van arriba, a lo ancho; las demás en el tablero de columnas
const ANCHAS = ['entrenador', 'foco', 'estudio'];
// Lo largo o de consulta va plegado en el celular, para que Hoy se lea de un vistazo; cada quien lo abre y queda como lo dejó
const PLEGABLES = ['estandares', 'semana', 'plata', 'suenoPeso', 'dieta', 'metas', 'gym'];
const PLEGADAS_CELULAR = ['estandares', 'semana', 'plata', 'suenoPeso', 'dieta', 'metas'];
const abierta = (k) => { const c = e().config.hoyAbiertas || {}; return k in c ? c[k] : !(columnas() === 1 && PLEGADAS_CELULAR.includes(k)); };

// ---------- Tablero en columnas ----------
// En el computador las tarjetas van en columnas independientes (sin huecos). Si el usuario las organizó arrastrando, se
// respeta su orden (guardado por número de columnas); si no, se reparten solas según un tamaño aproximado. El tamaño sale
// de los datos (cuántos hábitos, cuántas metas) y no de medir la pantalla, para que una tarjeta no salte de columna al crecer.
let organizando = false;
const columnas = () => (typeof window === 'undefined' ? 1 : innerWidth >= 2000 ? 4 : innerWidth >= 1400 ? 3 : innerWidth >= 900 ? 2 : 1);
const guardadas = () => e().config.tablero || {};
function altoAprox(k) {
  if (k === 'manana') return 110 + 64 * e().habitos.length;
  if (k === 'metas') return 100 + 44 * avanceMetas().activas.length;
  if (k === 'gym') return diaDeHoy() ? 700 : 220;
  if (k === 'suplementos') return 110 + 64 * (pendienteSuplementos() || [0, 1])[1];
  return { retos: 230, dieta: 260, semana: 220, suenoPeso: 170, estandares: 160, plata: 110, cierre: 200 }[k] || 180;
}
function repartir(ids, n) {
  const cols = Array.from({ length: n }, () => []), alto = Array(n).fill(0);
  // Cada tarjeta va una sola vez: si el orden guardado la tiene repetida, cuenta solo la primera
  const vistas = new Set();
  const guardado = (guardadas()[n] || []).map((c) => c.filter((k) => ids.includes(k) && !vistas.has(k) && vistas.add(k)));
  guardado.slice(0, n).forEach((c, i) => { cols[i] = c; alto[i] = c.reduce((s, k) => s + altoAprox(k), 0); });
  // Las que no estaban en el orden guardado (nuevas o recién mostradas) van a la columna más corta
  for (const k of ids) {
    if (cols.some((c) => c.includes(k))) continue;
    const i = alto.indexOf(Math.min(...alto));
    cols[i].push(k);
    alto[i] += altoAprox(k);
  }
  return cols;
}
// Guarda cómo quedaron las columnas después de arrastrar (cada tarjeta una sola vez)
function guardarOrden(cols) {
  const vistas = new Set();
  const limpias = cols.map((c) => c.filter((k) => !vistas.has(k) && vistas.add(k)));
  e().config.tablero = { ...guardadas(), [limpias.length]: limpias };
  guardar();
}

// Lo que necesita la pantalla de React (src/react/pantallas/Hoy.tsx)
export const piezasHoy = { ver: () => ({ organizando }), saludo, columnas, guardadas, repartir, abierta, guardarOrden, ANCHAS, PLEGABLES };

if (typeof window !== 'undefined') {
  let ultimas = columnas();
  // Al cambiar el ancho de la ventana, se rearma con el número de columnas que toca
  addEventListener('resize', () => {
    const n = columnas();
    if (n !== ultimas) { ultimas = n; if (document.querySelector('[data-tablero]')) repintar(); }
  });
}

registrar({
  plantilla({ vacia }) { elegirPlantilla(!!vacia); },
  'hoy-organizar'() { organizando = !organizando; repintar(); },
  'hoy-reordenar'() {
    const t = { ...guardadas() };
    delete t[columnas()];
    e().config.tablero = t;
    guardar();
  },
  // Abrir o plegar una tarjeta del tablero: queda como la dejó
  'hoy-plegar'({ k }) {
    (e().config.hoyAbiertas ??= {})[k] = !abierta(k);
    guardar();
  },
});
