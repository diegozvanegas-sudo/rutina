// Índice de mapas de 🗺️ Lugares. Agregar uno: generar su archivo con scripts/convertir-mapa.mjs y sumarlo aquí.
// padre y piezaPadre dicen en qué pieza del mapa de arriba queda este mapa (los niveles de arriba toman el estado de abajo).
// Cada archivo se carga solo cuando se abre; el service worker lo guarda para que sirva sin internet.
export const MAPAS = {
  mundo: { id: 'mundo', nombre: 'Mundo', icono: '🌍', unidad: 'países y territorios', una: 'País', grupo: 'continente', pais: '', padre: null, piezaPadre: null, cargar: () => import('./mundo.js') },
  colombia: { id: 'colombia', nombre: 'Colombia', icono: '🇨🇴', unidad: 'departamentos', una: 'Departamento', grupo: 'región', pais: 'Colombia', padre: 'mundo', piezaPadre: 'COL', cargar: () => import('./colombia.js') },
  brasil: { id: 'brasil', nombre: 'Brasil', icono: '🇧🇷', unidad: 'estados', una: 'Estado', grupo: 'región', pais: 'Brasil', padre: 'mundo', piezaPadre: 'BRA', cargar: () => import('./brasil.js') },
  antioquia: { id: 'antioquia', nombre: 'Antioquia', icono: '🌄', unidad: 'municipios', una: 'Municipio', grupo: 'subregión', pais: 'Colombia', padre: 'colombia', piezaPadre: '05', cargar: () => import('./antioquia.js') },
};
export const MAPA_INICIAL = 'antioquia';

const cargados = {};
export async function cargarMapa(id) {
  if (!cargados[id]) cargados[id] = (await MAPAS[id].cargar()).default;
  return cargados[id];
}
