// Orden y visibilidad que elige cada usuario (Editar > Pantallas): secciones del menú, tarjetas de Hoy y metas del día.
// Se guarda en config.orden[tipo] (ids en orden) y config.ocultos[tipo] (ids escondidos). Lo que agregue una versión nueva
// de la app y aún no esté en la lista del usuario aparece al final, visible (o debajo de su vecina, ver DESPUES).

export const SECCIONES = {
  hoy: ['🏠', 'Hoy'], calendario: ['📅', 'Calendario'], progreso: ['📈', 'Progreso'], vida: ['🌱', 'Mi vida'], energia: ['⚡', 'Energía'], voz: ['🎙️', 'Audio a texto'], manana: ['☀️', 'Mañana'], metas: ['🎯', 'Metas'], estudiar: ['🎓', 'Estudiar'],
  dieta: ['🥗', 'Dieta'], suplementos: ['💊', 'Suplementos'], finanzas: ['💰', 'Finanzas'], compras: ['🛒', 'Compras'], recordatorios: ['🔔', 'Recordatorios'], lugares: ['🗺️', 'Lugares'], gym: ['🏋️', 'Gym'], panel: ['🧑‍💼', 'Panel'], clientes: ['👥', 'Clientes'], entrenador: ['🧑‍🏫', 'Mi entrenador'],
  sesiones: ['🧘', 'Sesiones'], editar: ['✏️', 'Editar'], ajustes: ['⚙️', 'Ajustes'],
};
export const TARJETAS_HOY = {
  entrenador: '🧑‍🏫 Tu entrenador hoy', experimento: '🧪 Experimento de la semana', retos: '🔥 Reto activo', foco: '🗓️ Foco y cierre de la semana', trabajo: '💼 Trabajo e ingresos', estudio: '🎓 Estudio de hoy', manana: '☀️ Primera hora', metas: '🎯 Metas',
  gym: '🏋️ Entrenamiento y fútbol', suenoPeso: '🌙 Sueño y peso', animo: '😊 Ánimo y energía', estandares: '🧭 Mis estándares', dieta: '🥗 Comidas', suplementos: '💊 Suplementos', semana: '📅 Semana', plata: '💰 Plata del mes', cierre: '🌙 Cierre de la noche (desde las 7 p. m.)',
};
// Sección de la que depende cada tarjeta de Hoy: si el admin esconde la sección, la tarjeta tampoco se ve
export const SECCION_TARJETA = { estudio: 'estudiar', manana: 'manana', metas: 'metas', gym: 'gym', dieta: 'dieta', suplementos: 'suplementos', plata: 'finanzas', semana: 'gym', entrenador: 'gym', animo: 'vida', trabajo: 'vida' };
export const METAS = { agua: '💧 Agua', pasos: '👟 Pasos', calorias: '🍽️ Calorías', lectura: '📖 Lectura', pantalla: '📵 Pantalla' };

export const CATALOGO = { menu: SECCIONES, hoy: TARJETAS_HOY, metas: METAS };
// No se pueden esconder: sin ellas no se puede volver a mostrar nada
export const FIJAS = { menu: ['hoy', 'editar', 'ajustes'], hoy: [], metas: [] };

// Ids que cambiaron de nombre: 📚 Libros pasó a ser un área de 🎓 Estudiar, y su tarjeta de Hoy es la del estudio.
// Se traducen al leer, así quien la tenía movida o escondida la sigue viendo igual
const ANTES = { menu: { libros: 'estudiar' }, hoy: { libros: 'estudio' }, metas: {} };
// Secciones nuevas que en un menú ya ordenado van debajo de su vecina y no al final (donde no se ven)
const DESPUES = { menu: { compras: 'finanzas', suplementos: 'dieta', clientes: 'suplementos', entrenador: 'hoy', vida: 'progreso', energia: 'vida', voz: 'vida', panel: 'suplementos' }, hoy: { suplementos: 'dieta', retos: 'experimento', animo: 'suenoPeso', trabajo: 'foco' }, metas: {} };
const lista = (config, que, tipo) => ((config && config[que] && config[que][tipo]) || []).map((id) => ANTES[tipo][id] || id);

// Todos los ids del tipo en el orden del usuario
export function enOrden(config, tipo) {
  const todos = Object.keys(CATALOGO[tipo]), propio = lista(config, 'orden', tipo).filter((id) => todos.includes(id));
  const salida = [...new Set([...propio, ...todos.filter((id) => !propio.includes(id) && !(DESPUES[tipo][id] && propio.includes(DESPUES[tipo][id])))])];
  // Lo nuevo con vecina va justo debajo de ella, también en un menú ya ordenado
  for (const [id, vecina] of Object.entries(DESPUES[tipo])) {
    if (todos.includes(id) && !salida.includes(id)) salida.splice(salida.indexOf(vecina) + 1, 0, id);
  }
  return salida;
}
export const oculto = (config, tipo, id) => !FIJAS[tipo].includes(id) && lista(config, 'ocultos', tipo).includes(id);
export const visibles = (config, tipo) => enOrden(config, tipo).filter((id) => !oculto(config, tipo, id));

// Mueve un id n posiciones (−1 sube, 1 baja) dentro del orden del usuario
export function mover(config, tipo, id, n) {
  const ids = enOrden(config, tipo), a = ids.indexOf(id), b = a + n;
  if (a < 0 || b < 0 || b >= ids.length) return false;
  [ids[a], ids[b]] = [ids[b], ids[a]];
  (config.orden ??= {})[tipo] = ids;
  return true;
}
// Pone un id justo antes de otro (sin "antesDe", al final): lo usa el arrastre del menú
export function colocar(config, tipo, id, antesDe) {
  const ids = enOrden(config, tipo).filter((x) => x !== id);
  if (ids.length === enOrden(config, tipo).length) return false;
  const i = ids.indexOf(antesDe);
  ids.splice(i < 0 ? ids.length : i, 0, id);
  (config.orden ??= {})[tipo] = ids;
  return true;
}
export function alternar(config, tipo, id) {
  if (FIJAS[tipo].includes(id)) return false;
  const ocultos = ((config.ocultos ??= {})[tipo] = lista(config, 'ocultos', tipo)), i = ocultos.indexOf(id);
  if (i < 0) ocultos.push(id); else ocultos.splice(i, 1);
  return true;
}
export function restablecer(config, tipo) {
  if (config.orden) delete config.orden[tipo];
  if (config.ocultos) delete config.ocultos[tipo];
  if (tipo === 'menu' && config.grupos) delete config.grupos;
}

// ---------- Grupos del menú (por área de vida) ----------
// Cada sección va en un grupo; el usuario la puede pasar a otro al organizar (config.grupos = { id: grupo }).
// El orden dentro del grupo es el del menú (config.orden.menu). Lo que no tiene grupo va a ⚙️ App
export const GRUPOS = [['dia', '📅', 'Mi día'], ['cuerpo', '💪', 'Cuerpo'], ['plata', '💰', 'Plata'], ['mente', '🌱', 'Mente y crecimiento'], ['app', '⚙️', 'App']];
export const GRUPO_DE = {
  hoy: 'dia', manana: 'dia', calendario: 'dia', recordatorios: 'dia', metas: 'dia',
  gym: 'cuerpo', dieta: 'cuerpo', suplementos: 'cuerpo', energia: 'cuerpo', sesiones: 'cuerpo', progreso: 'cuerpo', entrenador: 'cuerpo', clientes: 'cuerpo', panel: 'cuerpo',
  finanzas: 'plata', compras: 'plata',
  vida: 'mente', estudiar: 'mente', voz: 'mente', lugares: 'mente',
  editar: 'app', ajustes: 'app',
};
const esGrupo = (g) => GRUPOS.some(([id]) => id === g);
export const grupoDe = (config, id) => { const g = ((config && config.grupos) || {})[id]; return esGrupo(g) ? g : GRUPO_DE[id] || 'app'; };
// Pasa una sección a otro grupo (si vuelve al suyo de siempre, se borra la excepción)
export function moverAGrupo(config, id, g) {
  if (!esGrupo(g)) return false;
  const grupos = (config.grupos ??= {});
  if ((GRUPO_DE[id] || 'app') === g) delete grupos[id]; else grupos[id] = g;
  return true;
}
// items: [{ k, … }] en el orden del menú → [{ g, icono, nombre, items }] en el orden de GRUPOS, sin los grupos vacíos
export function agrupar(config, items) {
  return GRUPOS.map(([g, icono, nombre]) => ({ g, icono, nombre, items: items.filter((x) => grupoDe(config, x.k) === g) })).filter((x) => x.items.length);
}
