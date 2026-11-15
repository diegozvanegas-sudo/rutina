// Tarjetas que se abren y cierran: cuáles están cerradas se recuerda en este equipo (no viaja a la nube: el celular y el
// computador pueden diferir). Lo usan las pantallas de antes (main.js) y las de React (react/Tarjeta.tsx), con las mismas claves
const CLAVE = 'rutina_plegadas';
let plegadas = null;
export function leerPlegadas() {
  if (!plegadas) { try { plegadas = new Set(JSON.parse(localStorage.getItem(CLAVE)) || []); } catch (err) { plegadas = new Set(); } }
  return plegadas;
}
// Cierra la que estaba abierta y abre la cerrada; devuelve true si quedó cerrada
export function alternarPlegada(k) {
  const cerradas = leerPlegadas(), cerrar = !cerradas.has(k);
  if (cerrar) cerradas.add(k); else cerradas.delete(k);
  try { localStorage.setItem(CLAVE, JSON.stringify([...cerradas])); } catch (err) {}
  return cerrar;
}
// Clave de una tarjeta: la pantalla y su título sin números ("🔔 4 recordatorios" y "🔔 5 recordatorios" son la misma tarjeta)
export const basePlegable = (vista, titulo) => vista + '|' + String(titulo).replace(/[\d.,:/%$+−-]+/g, '').replace(/\s+/g, ' ').trim();
