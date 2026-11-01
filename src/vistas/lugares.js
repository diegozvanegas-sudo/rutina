// 🗺️ Lugares: los lugares que visité y los que quiero visitar, en un mapa que empieza por Antioquia y se puede cambiar
// (mundo, Colombia, Brasil…). Por ahora solo la sección y sus números; el mapa y los lugares llegan en la fase 1.
import { e } from '../estado.js';

const lugares = () => e().lugares.lista;

export function vistaLugares() {
  const lista = lugares(), visitados = lista.filter((x) => x.estado === 'visitado'), quiero = lista.filter((x) => x.estado === 'quiero');
  const paises = new Set(visitados.map((x) => x.pais).filter(Boolean)).size;
  const kpi = (n, texto) => '<div class="kpi"><b>' + n + '</b><span>' + texto + '</span></div>';
  return '<h1>Lugares</h1>' +
    '<div class="kpis">' + kpi(visitados.length, 'lugares visitados') + kpi(quiero.length, 'por visitar') + kpi(paises, 'países') + kpi('0 / 125', 'municipios de Antioquia') + '</div>' +
    '<section class="tarjeta"><h2>🗺️ Tu mapa de viajes</h2>' +
    '<p>Aquí va a estar el mapa de Antioquia por municipios, con un punto por cada lugar: ● los que ya visitaste y ☆ los que quieres visitar. ' +
    'Después se podrá cambiar a Colombia, Brasil o el mundo, y cada visita guardará la fecha, con quién fuiste, la nota y las fotos.</p>' +
    '<p class="nota-corta">Próximamente: el mapa y la lista de lugares para marcar.</p></section>';
}
