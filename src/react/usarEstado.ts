// El estado de la app (estado.js) visto desde React: el componente se vuelve a pintar cada vez que algo cambia
// (guardar, repintar, sincronizar con la nube). El estado se sigue cambiando con las funciones de estado.js
import { useSyncExternalStore } from 'react';
import { e, alCambiar } from '../estado.js';
import { alRefrescar } from './refrescar.js';

let version = 0;
const oyentes = new Set<() => void>();
const avisar = () => { version++; oyentes.forEach((f) => f()); };
alCambiar(avisar);
alRefrescar(avisar);
const suscribir = (f: () => void) => { oyentes.add(f); return () => { oyentes.delete(f); }; };

export function usarEstado() {
  useSyncExternalStore(suscribir, () => version);
  return e();
}
