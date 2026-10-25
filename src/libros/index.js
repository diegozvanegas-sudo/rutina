// Biblioteca: cada libro es un archivo en esta carpeta con el formato de fenix.js.
// Para sumar uno nuevo desde un PDF: /agregar-libro (ver .claude/skills/agregar-libro/SKILL.md) y agregarlo aquí.
import fenix from './fenix.js';
import crecimiento from './crecimiento.js';
import cuatroAcuerdos from './cuatro-acuerdos.js';

export const LIBROS = [fenix, crecimiento, cuatroAcuerdos];
export const libro = (id) => LIBROS.find((l) => l.id === id);
