// El mundo por país: Natural Earth 1:50m (ne_50m_admin_0_countries.geojson, dominio público), sin la Antártida.
const CONTINENTES = {
  Africa: 'África', Asia: 'Asia', Europe: 'Europa', 'North America': 'Norte y Centroamérica', 'South America': 'Sudamérica', Oceania: 'Oceanía', 'Seven seas (open ocean)': 'Islas',
};

export default {
  id: 'mundo',
  nombre: 'Mundo',
  padre: null,
  fuente: 'Natural Earth 1:50m, países (dominio público).',
  filtro: "CONTINENT !== 'Antarctica'",
  campoId: 'ADM0_A3',
  campoNombre: 'NAME_ES',
  nombreTal: true,
  ancho: 2000,
  simplificar: '20%',
  grupoDe: (p) => CONTINENTES[p.CONTINENT],
  ordenGrupos: ['Sudamérica', 'Norte y Centroamérica', 'Europa', 'África', 'Asia', 'Oceanía', 'Islas'],
};
