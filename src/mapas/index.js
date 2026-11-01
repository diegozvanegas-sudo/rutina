// Índice de mapas de 🗺️ Lugares. Agregar uno: generar su archivo con scripts/convertir-mapa.mjs y sumarlo aquí.
// padre y piezaPadre dicen en qué pieza del mapa de arriba queda este mapa (los niveles de arriba toman el estado de abajo).
// Cada archivo se carga solo cuando se abre; el service worker lo guarda para que sirva sin internet.
export const MAPAS = {
  antioquia: { id: 'antioquia', nombre: 'Antioquia', icono: '🌄', unidad: 'municipios', grupo: 'subregión', pais: 'Colombia', padre: null, piezaPadre: null, cargar: () => import('./antioquia.js') },
};
export const MAPA_INICIAL = 'antioquia';

const cargados = {};
export async function cargarMapa(id) {
  if (!cargados[id]) cargados[id] = (await MAPAS[id].cargar()).default;
  return cargados[id];
}
