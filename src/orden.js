// Orden y visibilidad que elige cada usuario (Editar > Pantallas): secciones del menú, tarjetas de Hoy y metas del día.
// Se guarda en config.orden[tipo] (ids en orden) y config.ocultos[tipo] (ids escondidos). Lo que agregue una versión nueva
// de la app y aún no esté en la lista del usuario aparece al final, visible.

export const SECCIONES = {
  hoy: ['🏠', 'Hoy'], progreso: ['📈', 'Progreso'], manana: ['☀️', 'Mañana'], metas: ['🎯', 'Metas'], libros: ['📚', 'Libros'],
  dieta: ['🥗', 'Dieta'], finanzas: ['💰', 'Finanzas'], recordatorios: ['🔔', 'Recordatorios'], gym: ['🏋️', 'Gym'],
  sesiones: ['🧘', 'Sesiones'], editar: ['✏️', 'Editar'], ajustes: ['⚙️', 'Ajustes'],
};
export const TARJETAS_HOY = {
  foco: '🗓️ Foco y cierre de la semana', libros: '📚 Lectura del día', manana: '☀️ Primera hora', metas: '🎯 Metas',
  gym: '🏋️ Entrenamiento y fútbol', suenoPeso: '🌙 Sueño y peso', estandares: '🧭 Mis estándares', dieta: '🥗 Comidas', semana: '📅 Semana', plata: '💰 Plata del mes', cierre: '🌙 Cierre de la noche (desde las 7 p. m.)',
};
export const METAS = { agua: '💧 Agua', pasos: '👟 Pasos', calorias: '🍽️ Calorías', lectura: '📖 Lectura', pantalla: '📵 Pantalla' };

export const CATALOGO = { menu: SECCIONES, hoy: TARJETAS_HOY, metas: METAS };
// No se pueden esconder: sin ellas no se puede volver a mostrar nada
export const FIJAS = { menu: ['hoy', 'editar', 'ajustes'], hoy: [], metas: [] };

// Todos los ids del tipo en el orden del usuario
export function enOrden(config, tipo) {
  const todos = Object.keys(CATALOGO[tipo]), propio = ((config && config.orden && config.orden[tipo]) || []).filter((id) => todos.includes(id));
  return [...new Set([...propio, ...todos])];
}
export const oculto = (config, tipo, id) => !FIJAS[tipo].includes(id) && !!(config && config.ocultos && (config.ocultos[tipo] || []).includes(id));
export const visibles = (config, tipo) => enOrden(config, tipo).filter((id) => !oculto(config, tipo, id));

// Mueve un id n posiciones (−1 sube, 1 baja) dentro del orden del usuario
export function mover(config, tipo, id, n) {
  const ids = enOrden(config, tipo), a = ids.indexOf(id), b = a + n;
  if (a < 0 || b < 0 || b >= ids.length) return false;
  [ids[a], ids[b]] = [ids[b], ids[a]];
  (config.orden ??= {})[tipo] = ids;
  return true;
}
export function alternar(config, tipo, id) {
  if (FIJAS[tipo].includes(id)) return false;
  const lista = ((config.ocultos ??= {})[tipo] ??= []), i = lista.indexOf(id);
  if (i < 0) lista.push(id); else lista.splice(i, 1);
  return true;
}
export function restablecer(config, tipo) {
  if (config.orden) delete config.orden[tipo];
  if (config.ocultos) delete config.ocultos[tipo];
}
