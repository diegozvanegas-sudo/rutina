// Llamar desde React a una acción de la app (las reglas de siempre, registradas en src/vistas/*.js con registrar()).
// Así una pantalla se puede pasar a React sin reescribir sus reglas: React pinta y la acción hace lo mismo que antes.
// Los datos van como texto, igual que los data-* de un botón: accion('fin-aportar', { id: 'emergencia' })
import { ejecutar } from '../ui.js';

export function accion(nombre: string, datos: Record<string, string | number> = {}) {
  const dataset: Record<string, string> = {};
  for (const k of Object.keys(datos)) dataset[k] = String(datos[k]);
  (ejecutar as (nombre: string, el: { dataset: Record<string, string> }) => void)(nombre, { dataset });
}
