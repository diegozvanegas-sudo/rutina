// Lógica de 🗺️ Lugares sin pantalla: proyección, estado de las piezas, números, línea de tiempo y "Sorpréndeme".

// ---------- Proyección ----------
export function proyectar(mapa, lat, lon) {
  const p = mapa.proyeccion;
  return [p.margen + (lon - p.lon0) * p.k * p.escala, p.margen + (p.lat0 - lat) * p.escala];
}
export function desproyectar(mapa, x, y) {
  const p = mapa.proyeccion;
  return [p.lat0 - (y - p.margen) / p.escala, p.lon0 + (x - p.margen) / (p.k * p.escala)];
}

// ---------- Geometría de las piezas (el path es "Mx yLx yZ", uno o varios anillos) ----------
export const anillos = (d) => d.split('Z').filter(Boolean).map((a) => a.slice(1).split('L').map((q) => q.split(' ').map(Number)));
export function dentroDePieza(pieza, x, y) {
  let c = false;
  for (const r of anillos(pieza.d)) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    if ((r[i][1] > y) !== (r[j][1] > y) && x < (r[j][0] - r[i][0]) * (y - r[i][1]) / (r[j][1] - r[i][1]) + r[i][0]) c = !c;
  }
  return c;
}
export const piezaEn = (mapa, x, y) => mapa.piezas.find((p) => dentroDePieza(p, x, y)) || null;
// Rectángulo { x, y, w, h } que encierra unas piezas: para hacer zoom a una subregión
export function cajaDe(piezas, margen = 12) {
  const pts = piezas.flatMap((p) => anillos(p.d).flat());
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const x = Math.min(...xs) - margen, y = Math.min(...ys) - margen;
  return { x, y, w: Math.max(...xs) + margen - x, h: Math.max(...ys) + margen - y };
}

// ---------- Niveles: un lugar cuenta en su pieza y en las piezas de los mapas de arriba ----------
// Devuelve la pieza del mapa `mapaId` a la que pertenece el lugar, subiendo por los padres del índice (o null si no está en ese mapa)
export function piezaDelLugar(lugar, mapaId, indice) {
  let m = lugar.mapa, pieza = lugar.pieza;
  while (m && m !== mapaId) {
    const info = indice[m];
    if (!info || !info.padre) return null;
    pieza = info.piezaPadre;
    m = info.padre;
  }
  return m === mapaId ? pieza : null;
}
export const lugaresDePieza = (lista, mapaId, piezaId, indice) => lista.filter((l) => piezaDelLugar(l, mapaId, indice) === piezaId);

// visitado si hay algún lugar visitado; quiero si solo hay por visitar. El tono (1 a 3) sube con los lugares recorridos
export function estadoPieza(lugares) {
  const visitados = lugares.filter((l) => l.estado === 'visitado').length;
  if (visitados) return { estado: 'visitado', tono: Math.min(3, visitados) };
  return lugares.length ? { estado: 'quiero', tono: 0 } : { estado: 'nada', tono: 0 };
}

// ---------- Números ----------
const fechasDe = (lista) => lista.flatMap((l) => (l.visitas || []).map((v) => ({ lugar: l, visita: v })));
export function lineaTiempo(lista) {
  return fechasDe(lista).filter((x) => x.visita.fecha).sort((a, b) => b.visita.fecha.localeCompare(a.visita.fecha));
}
// Un viaje es una fecha con alguna visita: dos lugares el mismo día cuentan como uno
export const viajesDelAnio = (lista, anio) => new Set(lineaTiempo(lista).filter((x) => x.visita.fecha.startsWith(String(anio))).map((x) => x.visita.fecha)).size;
export const paisesVisitados = (lista) => new Set(lista.filter((l) => l.estado === 'visitado' && l.pais).map((l) => l.pais)).size;
export function ultimoVisitado(lista) {
  const t = lineaTiempo(lista);
  return t.length ? t[0].lugar : null;
}
export const fraccion = (a, b) => (b ? a / b : 0);

export function resumenMapa(mapa, lista, indice, anio) {
  const delMapa = lista.filter((l) => piezaDelLugar(l, mapa.id, indice) != null);
  const visitadas = new Set(delMapa.filter((l) => l.estado === 'visitado').map((l) => piezaDelLugar(l, mapa.id, indice)));
  return {
    piezas: visitadas.size, total: mapa.piezas.length, fraccion: fraccion(visitadas.size, mapa.piezas.length),
    visitados: delMapa.filter((l) => l.estado === 'visitado').length, porVisitar: delMapa.filter((l) => l.estado === 'quiero').length,
    viajes: viajesDelAnio(lista, anio), paises: paisesVisitados(lista), ultimo: ultimoVisitado(lista),
  };
}
// Avance por grupo (subregión, región, continente), en el orden del mapa
export function avanceGrupos(mapa, lista, indice) {
  const visitadas = new Set(lista.filter((l) => l.estado === 'visitado').map((l) => piezaDelLugar(l, mapa.id, indice)));
  return (mapa.grupos || []).map((grupo) => {
    const piezas = mapa.piezas.filter((p) => p.grupo === grupo), hechas = piezas.filter((p) => visitadas.has(p.id)).length;
    return { grupo, hechas, total: piezas.length, fraccion: fraccion(hechas, piezas.length) };
  });
}

// ---------- Lista ----------
export function filtrar(lista, f, grupoDe = () => '') {
  const texto = (f.texto || '').trim().toLowerCase();
  return lista.filter((l) => (!f.estado || l.estado === f.estado) && (!f.pais || l.pais === f.pais) && (!f.tipo || l.tipo === f.tipo) &&
    (!f.grupo || grupoDe(l) === f.grupo) && (!texto || l.nombre.toLowerCase().includes(texto)));
}
// Primero los de más prioridad; a igual prioridad, por nombre
export const ordenar = (lista) => [...lista].sort((a, b) => (a.estado === b.estado ? 0 : a.estado === 'quiero' ? -1 : 1) || (a.prioridad || 3) - (b.prioridad || 3) || a.nombre.localeCompare(b.nombre, 'es'));

export function agregarVisita(lugar, visita) {
  (lugar.visitas ??= []).push(visita);
  lugar.visitas.sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''));
  lugar.estado = 'visitado';
}

// ---------- Sorpréndeme: un plan de fin de semana ----------
export function distanciaKm(a, b) {
  const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}
// Más probable cuanto más prioridad tenga y menos se tarde en llegar. Solo los que dan para ir y volver en un fin de semana
export const pesoPlan = (l) => (4 - (l.prioridad || 3)) ** 2 / Math.max(1, l.horas || 1);
export function sorprender(lista, { mapa = 'antioquia', maxHoras = 4, cercaKm = 30, azar = Math.random } = {}) {
  const quiero = lista.filter((l) => l.estado === 'quiero' && l.mapa === mapa);
  const opciones = quiero.filter((l) => (l.horas || 0) <= maxHoras);
  if (!opciones.length) return null;
  let tiro = azar() * opciones.reduce((s, l) => s + pesoPlan(l), 0), principal = opciones[opciones.length - 1];
  for (const l of opciones) { tiro -= pesoPlan(l); if (tiro < 0) { principal = l; break; } }
  const cercanos = quiero.filter((l) => l !== principal && distanciaKm(l, principal) <= cercaKm)
    .sort((a, b) => distanciaKm(a, principal) - distanciaKm(b, principal)).slice(0, 2);
  return { principal, cercanos, dias: (principal.horas || 0) > 2 ? 2 : 1 };
}
