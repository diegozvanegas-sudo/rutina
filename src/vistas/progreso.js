// Progreso: la pantalla está en src/react/pantallas/Progreso.tsx; aquí queda el rango de días que se ve
import { repintar } from '../estado.js';
import { registrar, copiarTexto } from '../ui.js';
import { promptSemanal } from '../prediccion.js';

let dias = 30;
// Lo que necesita la pantalla de React (src/react/pantallas/Progreso.tsx): el rango de días que se ve
export const piezasProgreso = { dias: () => dias };

registrar({
  'prog-dias'({ n }) { dias = Number(n); repintar(); },
  // 🤖 La revisión de la semana para pegar en una IA (sin nombre ni correo)
  'prediccion-copiar'() { copiarTexto(promptSemanal(), 'Revisión copiada: pégala en la IA que uses'); },
});
