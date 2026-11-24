// 🎨 Cómo se ve la app en este equipo (no viaja a la nube: al sol el celular puede ir claro y el computador oscuro):
//   tema: 'oscuro' (el de siempre) · 'claro' · 'sistema' (el que tenga el celular o el computador)
//   letra: 1 (normal) · 1.12 (grande) · 1.25 (muy grande); agranda toda la app, como el zoom del navegador
// El tema se elige al abrir la app (react/tema.ts lee temaClaro() una vez): cambiarlo recarga la página
const CLAVE = 'rutina_apariencia';
export const TEMAS = [['oscuro', '🌙 Oscuro'], ['claro', '☀️ Claro'], ['sistema', '📱 Como el equipo']];
export const LETRAS = [[1, 'Normal'], [1.12, 'Grande'], [1.25, 'Muy grande']];

export function leerApariencia() {
  let a = {};
  try { a = JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (err) { a = {}; }
  const tema = TEMAS.some(([k]) => k === a.tema) ? a.tema : 'oscuro';
  const letra = LETRAS.some(([k]) => k === a.letra) ? a.letra : 1;
  return { tema, letra };
}
function escribir(a) { try { localStorage.setItem(CLAVE, JSON.stringify(a)); } catch (err) {} }

const sistemaClaro = () => { try { return window.matchMedia('(prefers-color-scheme: light)').matches; } catch (err) { return false; } };
/** ¿Esta vez la app va clara? (lo lee react/tema.ts al cargar) */
export function temaClaro() {
  const { tema } = leerApariencia();
  return tema === 'claro' || (tema === 'sistema' && sistemaClaro());
}
export function aplicarLetra() {
  const { letra } = leerApariencia();
  document.documentElement.style.zoom = letra === 1 ? '' : String(letra);
}
/** Cambia el tema: si cambia lo que se ve, recarga (los colores se fijan al abrir) */
export function ponerTema(tema) {
  const antes = temaClaro();
  escribir({ ...leerApariencia(), tema });
  if (temaClaro() !== antes) location.reload();
}
export function ponerLetra(letra) {
  escribir({ ...leerApariencia(), letra: Number(letra) });
  aplicarLetra();
}
