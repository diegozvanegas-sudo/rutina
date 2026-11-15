// El estado de la app (estado.js) visto desde React: el componente se vuelve a pintar cada vez que algo cambia
// (guardar, repintar, sincronizar con la nube). El estado se sigue cambiando con las funciones de estado.js
import { useSyncExternalStore } from 'react';
import { e, alCambiar } from '../estado.js';

let version = 0;
const oyentes = new Set<() => void>();
alCambiar(() => { version++; oyentes.forEach((f) => f()); });
const suscribir = (f: () => void) => { oyentes.add(f); return () => { oyentes.delete(f); }; };

export function usarEstado() {
  useSyncExternalStore(suscribir, () => version);
  return e();
}
