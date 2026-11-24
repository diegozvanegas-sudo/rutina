// 📱 La barra de abajo del celular (react/armazon/Abajo.tsx): 4 secciones al alcance del pulgar y «☰ Más» (el menú).
// Cada usuario elige cuáles (config.barra.abajo, en Ajustes → 🎨 Cómo se ve) o la apaga (config.barra.sinAbajo).
// Sin elegir: Hoy, Gym, Dieta y Finanzas, o las primeras de su menú que pueda abrir
export const MAX_ABAJO = 4;
export const PREFERIDAS = ['hoy', 'gym', 'dieta', 'finanzas'];

// disponibles: ids que puede abrir, en el orden de su menú
export function idsAbajo(barra, disponibles) {
  const puede = new Set(disponibles), propias = Array.isArray(barra && barra.abajo) ? barra.abajo : null;
  if (propias) return [...new Set(propias)].filter((k) => puede.has(k)).slice(0, MAX_ABAJO);
  const salida = PREFERIDAS.filter((k) => puede.has(k));
  for (const k of disponibles) if (salida.length < MAX_ABAJO && !salida.includes(k)) salida.push(k);
  return salida.slice(0, MAX_ABAJO);
}

// Poner o quitar una sección de la barra; si ya hay 4, la nueva entra en lugar de la última. Devuelve la lista nueva
export function alternarAbajo(barra, disponibles, id) {
  const actuales = idsAbajo(barra, disponibles);
  const nuevas = actuales.includes(id) ? actuales.filter((k) => k !== id) : [...actuales.slice(0, MAX_ABAJO - 1), id];
  barra.abajo = nuevas;
  return nuevas;
}
