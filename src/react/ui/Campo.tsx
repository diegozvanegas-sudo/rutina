// Campo de formulario con la etiqueta arriba (como los de siempre). Sabores: texto, texto largo, lista de opciones y sin etiqueta.
// No guardan lo que se escribe en el estado de React: el valor vive en el campo y se lee al agregar o al salir de él
// (así el formato de dinero y el "Enter pasa al siguiente campo" de la app siguen funcionando igual).
//
// Dos formas de guardar:
//  - con onBlur / onChange: la pantalla decide qué hacer;
//  - con data-cambio="accion" (y sus data-*): al salir del campo, la app llama a esa acción (las reglas de siempre, en
//    src/vistas/*.js). Estos campos, mientras no se esté escribiendo en ellos, muestran siempre el valor guardado.
import { useEffect, useId, useRef, type InputHTMLAttributes, type ReactNode, type Ref, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { FormControl, FormLabel, NativeSelect, OutlinedInput } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type Datos = { [k: `data-${string}`]: string | number | undefined };
type Entrada = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
const CAJA = { display: 'grid', gap: '4px' };

// Un campo con data-cambio vuelve al valor guardado cuando no se está escribiendo en él (por ejemplo, si un nombre
// se dejó vacío y la app no lo aceptó, o si el valor cambió desde otra parte)
function usarValorGuardado<T extends Entrada>(props: { defaultValue?: unknown } & Datos, referencia?: Ref<T>, siempre = false) {
  const propia = useRef<T>(null), guardado = props.defaultValue == null ? '' : String(props.defaultValue), activo = siempre || props['data-cambio'] != null;
  useEffect(() => {
    const el = propia.current;
    if (activo && el && document.activeElement !== el && el.value !== guardado) el.value = guardado;
  });
  return (el: T | null) => {
    propia.current = el;
    if (typeof referencia === 'function') referencia(el); else if (referencia) (referencia as { current: T | null }).current = el;
  };
}

/** dePaso: lo que se escribe es para un botón de al lado ("cuánto" + "Me pagó"); cuando la app guarda, vuelve a su valor inicial */
export function Campo({ etiqueta, referencia, dePaso = false, ...input }: { etiqueta: ReactNode; referencia?: Ref<HTMLInputElement>; dePaso?: boolean } & InputHTMLAttributes<HTMLInputElement> & Datos) {
  const propio = useId(), id = input.id || propio, ref = usarValorGuardado(input, referencia, dePaso);
  return (
    <FormControl fullWidth sx={CAJA}>
      <FormLabel htmlFor={id}>{etiqueta}</FormLabel>
      <OutlinedInput fullWidth inputRef={ref} inputProps={{ type: 'text', autoComplete: 'off', ...input, id }} />
    </FormControl>
  );
}

/** Campo sin etiqueta a la vista (lleva aria-label): para filas de "monto + botón". Es de paso: cuando la app guarda
 *  (el botón hizo lo suyo) queda vacío para el siguiente, salvo que se esté escribiendo en él. noVaciar: conserva lo escrito */
export function CampoSolo({ referencia, sx, noVaciar = false, ...input }: { referencia?: Ref<HTMLInputElement>; 'aria-label': string; sx?: SxProps<Theme>; noVaciar?: boolean } & InputHTMLAttributes<HTMLInputElement> & Datos) {
  const ref = usarValorGuardado(input, referencia, !noVaciar);
  return <OutlinedInput fullWidth inputRef={ref} sx={sx} inputProps={{ type: 'text', autoComplete: 'off', ...input }} />;
}

export function CampoLargo({ etiqueta, filas = 3, ...area }: { etiqueta: ReactNode; filas?: number } & TextareaHTMLAttributes<HTMLTextAreaElement> & Datos) {
  const propio = useId(), id = area.id || propio, ref = usarValorGuardado<HTMLTextAreaElement>(area);
  return (
    <FormControl fullWidth sx={CAJA}>
      <FormLabel htmlFor={id}>{etiqueta}</FormLabel>
      <OutlinedInput fullWidth multiline rows={filas} inputRef={ref} inputProps={{ ...area, id }} />
    </FormControl>
  );
}

/** Texto largo sin etiqueta a la vista (lleva aria-label): cuando el título va aparte, con algo más al lado */
export function CampoLargoSolo({ filas = 2, ...area }: { filas?: number; 'aria-label': string } & TextareaHTMLAttributes<HTMLTextAreaElement> & Datos) {
  const ref = usarValorGuardado<HTMLTextAreaElement>(area);
  return <OutlinedInput fullWidth multiline rows={filas} inputRef={ref} inputProps={area} />;
}

export function CampoLista({ etiqueta, opciones, referencia, ...select }: {
  etiqueta: ReactNode; opciones: [string, string][]; referencia?: Ref<HTMLSelectElement>;
} & SelectHTMLAttributes<HTMLSelectElement> & Datos) {
  const propio = useId(), id = select.id || propio, ref = usarValorGuardado(select, referencia);
  return (
    <FormControl fullWidth sx={CAJA}>
      <FormLabel htmlFor={id}>{etiqueta}</FormLabel>
      <NativeSelect input={<OutlinedInput fullWidth />} inputRef={ref} inputProps={{ ...select, id }}>
        {opciones.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </NativeSelect>
    </FormControl>
  );
}

// Dos campos lado a lado
export const DOS = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
