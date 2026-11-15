// La flecha de todo lo que se abre y se cierra (un solo estilo en toda la app): apunta abajo abierta, a la derecha cerrada
import { SvgIcon } from '@mui/material';

export function Flecha({ abierta }: { abierta: boolean }) {
  return (
    <SvgIcon className="flecha" aria-hidden="true" viewBox="0 0 24 24"
      sx={{ fontSize: 22, color: 'text.secondary', flex: 'none', transition: 'transform .15s', transform: abierta ? 'none' : 'rotate(-90deg)' }}>
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
    </SvgIcon>
  );
}
