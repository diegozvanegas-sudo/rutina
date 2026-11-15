// Tarjeta con título que se abre y se cierra tocando el título o su flecha (igual que las de las pantallas de antes,
// y con las mismas claves: lo que el usuario ya tenía cerrado sigue cerrado)
import { useState, type ReactNode, type MouseEvent, type KeyboardEvent } from 'react';
import { leerPlegadas, alternarPlegada, basePlegable } from '../plegables.js';

type Props = {
  vista: string;
  /** El título como texto: con él se recuerda si está cerrada */
  clave: string;
  titulo: ReactNode;
  /** Lo que va a la derecha del título, en la misma fila */
  lado?: ReactNode;
  clase?: string;
  children: ReactNode;
};

export function Tarjeta({ vista, clave, titulo, lado, clase = '', children }: Props) {
  const k = basePlegable(vista, clave), [, repintar] = useState(0);
  const cerrada = leerPlegadas().has(k), nombre = clave.replace(/\s+/g, ' ').trim();
  const alternar = () => { alternarPlegada(k); repintar((n) => n + 1); };
  // El título pliega si lo que se tocó no es un enlace ni un control
  const tocarTitulo = (ev: MouseEvent<HTMLElement>) => { if (!(ev.target as HTMLElement).closest('a, button, input, select, textarea, label')) alternar(); };
  const tecla = (ev: KeyboardEvent) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ev.stopPropagation(); alternar(); } };
  const flecha = (
    <span className="plegar-t" tabIndex={0} role="button" aria-expanded={!cerrada} aria-label={(cerrada ? 'Abrir ' : 'Cerrar ') + (nombre || 'la tarjeta')}
      onClick={(ev) => { ev.stopPropagation(); alternar(); }} onKeyDown={tecla}>{cerrada ? '▸' : '▾'}</span>
  );
  const clases = 'tarjeta plegable' + (clase ? ' ' + clase : '') + (cerrada ? ' tarjeta-cerrada' : '');
  return (
    <section className={clases} data-plegable={k}>
      {lado === undefined
        ? <h2 className="t-cab" onClick={tocarTitulo}>{flecha}{titulo}</h2>
        : <div className="fila-resumen t-cab"><h2 onClick={tocarTitulo}>{flecha}{titulo}</h2>{lado}</div>}
      {children}
    </section>
  );
}
