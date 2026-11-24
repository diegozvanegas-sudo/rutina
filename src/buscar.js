// 🔎 Buscar en toda la app (react/armazon/Buscar.tsx): secciones y sus pestañas, recordatorios y eventos, notas, ejercicios,
// hábitos, movimientos de Finanzas y la lista de compras. Solo de lo que el usuario puede abrir (secciones permitidas).
// Cada resultado dice a dónde lleva: { ir: '#seccion/pestaña' } y, si hace falta, { accion, id } para abrir esa fila.
import { todas as todasLasNotas } from './notas.js';

/** Sin tildes ni mayúsculas: "Cuádriceps" y "cuadriceps" son lo mismo */
export const llano = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const textoDeHtml = (h) => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const pesos = (n) => '$ ' + Math.round(Math.abs(Number(n) || 0)).toLocaleString('es-CO');

// secciones: [{ k, icono, nombre }] las que puede abrir · subs: { seccion: [[pestaña, texto]] } · habitos: [{ id, nombre, icono }]
export function armarIndice(est, { secciones = [], subs = {}, habitos = [] } = {}) {
  const puede = new Set(secciones.map((s) => s.k.split('/')[0]));
  const lista = [];
  const poner = (x) => lista.push({ ...x, clave: llano([x.titulo, x.sub, x.extra].filter(Boolean).join(' ')) });
  for (const s of secciones) {
    poner({ tipo: 'Sección', icono: s.icono, titulo: s.nombre, ir: '#' + s.k });
    for (const [p, t] of subs[s.k] || []) poner({ tipo: 'Sección', icono: s.icono, titulo: t.replace(/^\S+\s/, ''), sub: s.nombre, ir: '#' + s.k + '/' + p });
  }
  if (puede.has('recordatorios') && est.recordatorios) {
    for (const x of est.recordatorios.lista || []) poner({ tipo: 'Recordatorio', icono: x.icono || '🔔', titulo: x.nombre, sub: 'Recordatorios', extra: x.nota, ir: '#recordatorios', accion: 'rec-abrir', id: x.id });
    for (const x of est.recordatorios.eventos || []) poner({ tipo: 'Evento', icono: x.icono || '🎟️', titulo: x.nombre, sub: x.fecha ? 'Evento · ' + x.fecha : 'Evento', ir: '#recordatorios' });
  }
  if (puede.has('notas')) {
    for (const n of todasLasNotas(est)) {
      if (n.borrada) continue;
      const texto = textoDeHtml(n.html);
      if (!n.titulo && !texto) continue;
      poner({ tipo: 'Nota', icono: '📝', titulo: n.titulo || texto.slice(0, 60), sub: n.titulo ? texto.slice(0, 80) : 'Nota', extra: texto, ir: '#notas/' + n.id });
    }
  }
  if (puede.has('gym')) {
    const vistos = new Set();
    for (const d of est.rutina || []) for (const ej of d.ejercicios || []) {
      const k = llano(ej.nombre);
      if (!ej.nombre || vistos.has(k)) continue;
      vistos.add(k);
      poner({ tipo: 'Ejercicio', icono: '🏋️', titulo: ej.nombre, sub: [d.nombre, ej.musculo].filter(Boolean).join(' · '), ir: '#gym' });
    }
  }
  if (puede.has('manana')) for (const h of habitos) poner({ tipo: 'Hábito', icono: h.icono || '☀️', titulo: h.nombre, sub: 'Mañana', ir: '#manana' });
  if (puede.has('finanzas') && est.finanzas) {
    const cats = [...((est.finanzas.categorias || {}).gasto || []), ...((est.finanzas.categorias || {}).ingreso || [])];
    const nombreCat = (id) => { const c = cats.find((x) => x.id === id); return c ? c.icono + ' ' + c.nombre : ''; };
    const movs = [...(est.finanzas.movimientos || [])].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))).slice(0, 400);
    for (const m of movs) {
      const cat = nombreCat(m.categoria);
      poner({ tipo: m.tipo === 'ingreso' ? 'Ingreso' : 'Gasto', icono: m.tipo === 'ingreso' ? '💵' : '💸', titulo: m.nota || cat || 'Movimiento', sub: [m.fecha, pesos(m.monto), m.nota ? cat : ''].filter(Boolean).join(' · '), extra: cat + ' ' + Math.round(m.monto || 0), ir: '#finanzas/mes' });
    }
  }
  if (puede.has('imagenes')) {
    for (const x of Object.values(est.imagenes || {})) if (x && x.id) poner({ tipo: 'Imagen', icono: '🖼️', titulo: x.nombre, sub: [x.album, (x.etiquetas || []).map((t) => '#' + t).join(' ')].filter(Boolean).join(' · ') || 'Imágenes', extra: x.nota, ir: '#imagenes/' + x.id });
  }
  if (puede.has('compras') && est.compras) {
    for (const x of est.compras.lista || []) if (!x.comprado) poner({ tipo: x.tipo === 'deseo' ? 'Deseo' : 'Compra', icono: x.tipo === 'deseo' ? '✨' : '🛒', titulo: x.nombre, sub: x.tipo === 'deseo' ? 'Lista de deseos' : 'Lista del mercado', extra: x.nota, ir: x.tipo === 'deseo' ? '#compras/deseos' : '#compras' });
  }
  return lista;
}

// Primero lo que empieza con lo buscado, luego lo que lo tiene en el título y al final en el resto; las secciones van antes
const ORDEN_TIPO = { Sección: 0 };
export function buscar(indice, texto, max = 30) {
  const q = llano(texto);
  if (!q) return [];
  const palabras = q.split(/\s+/);
  const puntos = (x) => {
    const t = llano(x.titulo);
    return (t.startsWith(q) ? 0 : t.includes(q) ? 1 : 2) * 10 + (ORDEN_TIPO[x.tipo] ?? 1);
  };
  return indice.filter((x) => palabras.every((p) => x.clave.includes(p)))
    .map((x) => [puntos(x), x]).sort((a, b) => a[0] - b[0]).slice(0, max).map(([, x]) => x);
}
