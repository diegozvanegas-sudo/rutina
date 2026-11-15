// Campo de formulario con la etiqueta arriba (como los de siempre). Tres sabores: texto, texto largo y lista de opciones.
// No guardan lo que se escribe en el estado de React: el valor vive en el campo y se lee al agregar o al salir de él
// (así el formato de dinero y el "Enter pasa al siguiente campo" de la app siguen funcionando igual)
import { useId, type InputHTMLAttributes, type ReactNode, type Ref, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { FormControl, FormLabel, NativeSelect, OutlinedInput } from '@mui/material';

type Datos = { [k: `data-${string}`]: string | number | undefined };
const CAJA = { display: 'grid', gap: '4px' };

export function Campo({ etiqueta, referencia, ...input }: { etiqueta: ReactNode; referencia?: Ref<HTMLInputElement> } & InputHTMLAttributes<HTMLInputElement> & Datos) {
  const propio = useId(), id = input.id || propio;
  return (
    <FormControl fullWidth sx={CAJA}>
      <FormLabel htmlFor={id}>{etiqueta}</FormLabel>
      <OutlinedInput fullWidth inputRef={referencia} inputProps={{ type: 'text', autoComplete: 'off', ...input, id }} />
    </FormControl>
  );
}

export function CampoLargo({ etiqueta, filas = 3, ...area }: { etiqueta: ReactNode; filas?: number } & TextareaHTMLAttributes<HTMLTextAreaElement> & Datos) {
  const propio = useId(), id = area.id || propio;
  return (
    <FormControl fullWidth sx={CAJA}>
      <FormLabel htmlFor={id}>{etiqueta}</FormLabel>
      <OutlinedInput fullWidth multiline rows={filas} inputProps={{ ...area, id }} />
    </FormControl>
  );
}

export function CampoLista({ etiqueta, opciones, referencia, ...select }: {
  etiqueta: ReactNode; opciones: [string, string][]; referencia?: Ref<HTMLSelectElement>;
} & SelectHTMLAttributes<HTMLSelectElement> & Datos) {
  const propio = useId(), id = select.id || propio;
  return (
    <FormControl fullWidth sx={CAJA}>
      <FormLabel htmlFor={id}>{etiqueta}</FormLabel>
      <NativeSelect input={<OutlinedInput fullWidth />} inputRef={referencia} inputProps={{ ...select, id }}>
        {opciones.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </NativeSelect>
    </FormControl>
  );
}

// Dos campos lado a lado
export const DOS = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
