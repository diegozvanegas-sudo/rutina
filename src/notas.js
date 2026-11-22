// 📝 Notas: un bloc de notas con formato, carpetas, etiquetas, fijadas, buscador y papelera de 30 días.
//   est.notas = { id: { id, titulo, html, creada, editada, carpeta, etiquetas: [id], fijada, borrada } }
//     Va por notas como dias y semanas (combinar.js cambiosParaNube y rutina.en_partes en supabase/esquema.sql): editar
//     una nota sube solo esa nota. titulo '' → se usa la primera línea. borrada: cuándo pasó a la papelera.
//   est.notasMeta = { carpetas: [{ id, nombre, padre }], etiquetas: [{ id, nombre, color }] }  (padre: un solo nivel)
// El formato se guarda como HTML limpio: solo las marcas de ESTILO de abajo, sin estilos pegados (limpiarHtml).
import { e, guardar } from './estado.js';

export const DIAS_PAPELERA = 30;
const DIA = 86400000;
export const COLORES = ['#e57373', '#ffb74d', '#fff176', '#81c784', '#4fc3f7', '#9575cd', '#f06292', '#a1887f'];
const nuevoId = (letra) => letra + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// ---------- HTML limpio ----------
// Lo único que se guarda. Lo demás que llegue (al pegar de una página o de Word) se cambia por su equivalente o se quita
const BLOQUES = ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote'];
const EN_LINEA = ['b', 'i', 'u', 'mark', 'a', 'br', 's'];
const CAMBIAR = { strong: 'b', em: 'i', ins: 'u', strike: 's', del: 's', h1: 'h2', h4: 'h3', h5: 'h3', h6: 'h3', div: 'p', section: 'p', article: 'p', header: 'p', footer: 'p', tr: 'p', dt: 'p', dd: 'p', pre: 'p' };
const SIN_CONTENIDO = ['script', 'style', 'head', 'title', 'meta', 'link', 'noscript', 'template', 'iframe', 'object', 'svg', 'math', 'button', 'select', 'textarea', 'img', 'video', 'audio', 'input'];
const VACIOS = ['br', 'hr', 'img', 'input', 'meta', 'link', 'wbr', 'col', 'area', 'base', 'source'];
const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decodificar = (t) => t.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, c) => {
  if (c[0] === '#') { const n = c[1] === 'x' || c[1] === 'X' ? parseInt(c.slice(2), 16) : parseInt(c.slice(1), 10); return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : ''; }
  return ENTIDADES[c.toLowerCase()] ?? m;
});
const escapar = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escaparAttr = (t) => escapar(t).replace(/"/g, '&quot;');
function atributos(texto) {
  const a = {};
  for (const m of texto.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) a[m[1].toLowerCase()] = decodificar(m[2] ?? m[3] ?? m[4] ?? '');
  return a;
}
// Árbol simple: { tag, a: {atributos}, hijos: [] } o texto (ya decodificado)
export function arbol(html) {
  const raiz = { tag: '#', a: {}, hijos: [] }, pila = [raiz];
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>|([^<]+)|</g;
  let m, saltar = null;
  while ((m = re.exec(String(html || '')))) {
    const [todo, nombre, resto, texto] = m;
    if (todo.startsWith('<!--')) continue;
    const arriba = pila[pila.length - 1];
    if (!nombre) { if (!saltar) arriba.hijos.push(decodificar(texto ?? todo)); continue; }
    const tag = nombre.toLowerCase(), cierra = todo[1] === '/';
    if (saltar) { if (cierra && tag === saltar) saltar = null; continue; }
    if (cierra) {
      const i = pila.map((n) => n.tag).lastIndexOf(tag);
      if (i > 0) pila.length = i;
      continue;
    }
    if (SIN_CONTENIDO.includes(tag) && !VACIOS.includes(tag) && !/\/\s*$/.test(resto)) { saltar = tag; continue; }
    // Un párrafo o un elemento de lista nuevo cierra el anterior que quedó abierto
    if ((tag === 'p' || tag === 'li') && arriba.tag === tag) pila.pop();
    const n = { tag, a: atributos(resto), hijos: [] };
    pila[pila.length - 1].hijos.push(n);
    if (!VACIOS.includes(tag) && !/\/\s*$/.test(resto)) pila.push(n);
  }
  return raiz;
}
const enlaceSeguro = (h) => (/^(https?:|mailto:|tel:)/i.test(String(h).trim()) ? String(h).trim() : /^www\./i.test(String(h).trim()) ? 'https://' + String(h).trim() : null);
const resaltado = (a) => /background(-color)?\s*:\s*(?!\s*(transparent|initial|inherit|none|white|#fff\b|#ffffff|rgba\(0,\s*0,\s*0,\s*0\)))/i.test(a.style || '');
const negrita = (a) => /font-weight\s*:\s*(bold|[6-9]00)/i.test(a.style || '');
const cursiva = (a) => /font-style\s*:\s*italic/i.test(a.style || '');
const subrayado = (a) => /text-decoration[^;]*underline/i.test(a.style || '');
const esBloque = (h) => typeof h !== 'string' && ['ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'div'].includes(h.tag);
function limpiarNodos(hijos, dentroDe) {
  let s = '';
  for (const n of hijos) {
    if (typeof n === 'string') { s += escapar(n.replace(/ /g, ' ')); continue; }
    let tag = CAMBIAR[n.tag] || n.tag;
    // Un párrafo con una lista o un título adentro (así lo arma a veces el navegador): lo de adentro sale como bloques
    if (tag === 'p' && !['li', 'h2', 'h3', 'p'].includes(dentroDe) && n.hijos.some(esBloque)) {
      let suelto = [];
      const soltar = () => { if (suelto.length) s += '<p>' + limpiarNodos(suelto, 'p') + '</p>'; suelto = []; };
      for (const h of n.hijos) { if (esBloque(h)) { soltar(); s += limpiarNodos([h], '#'); } else suelto.push(h); }
      soltar();
      continue;
    }
    const adentro = limpiarNodos(n.hijos, tag);
    if (tag === 'br') { s += '<br>'; continue; }
    if (tag === 'hr') { s += '<p></p>'; continue; }
    if (tag === 'span' || tag === 'font') {
      let x = adentro;
      if (negrita(n.a)) x = '<b>' + x + '</b>';
      if (cursiva(n.a)) x = '<i>' + x + '</i>';
      if (subrayado(n.a)) x = '<u>' + x + '</u>';
      if (resaltado(n.a)) x = '<mark>' + x + '</mark>';
      s += x; continue;
    }
    if (tag === 'li' && !['ul', 'ol'].includes(dentroDe)) tag = 'p';
    if (tag === 'p' && ['p', 'li', 'h2', 'h3'].includes(dentroDe)) { s += adentro + '<br>'; continue; }
    if (tag === 'a') { const h = enlaceSeguro(n.a.href || ''); s += h ? '<a href="' + escaparAttr(h) + '">' + adentro + '</a>' : adentro; continue; }
    if (tag === 'ul') { s += (n.a['data-tipo'] === 'checks' || /\bchecks\b/.test(n.a.class || '') ? '<ul data-tipo="checks">' : '<ul>') + adentro + '</ul>'; continue; }
    if (tag === 'li') { s += (n.a['data-hecho'] === '1' ? '<li data-hecho="1">' : '<li>') + adentro + '</li>'; continue; }
    if (BLOQUES.includes(tag) || EN_LINEA.includes(tag)) { s += '<' + tag + '>' + adentro + '</' + tag + '>'; continue; }
    s += adentro; // cualquier otra etiqueta: queda solo su texto
  }
  return s;
}
// El HTML que se guarda: solo las marcas permitidas, sin estilos, sin scripts y sin vacíos de más al final
export function limpiarHtml(html) {
  let s = limpiarNodos(arbol(html).hijos, '#');
  // Sin marcas vacías, ni casillas o viñetas vacías (las deja el Enter de más), ni listas que quedaron sin nada
  s = s.replace(/<(b|i|u|s|mark)><\/\1>/g, '').replace(/<li( data-hecho="1")?>(<br>|\s)*<\/li>/g, '').replace(/<(ul|ol)( data-tipo="checks")?><\/\1>/g, '')
    .replace(/<p>(<br>|\s)*<\/p>(?=<(ul|ol|h2|h3)\b)/g, '').replace(/(<br>)+(<\/(p|li|h2|h3)>)/g, '$2').replace(/(<p><\/p>|<br>|\s)+$/g, '');
  return s.trim();
}

// ---------- Texto plano y para WhatsApp ----------
const ES_BLOQUE = ['p', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'div', 'h1', 'h4', 'h5', 'h6'];
// Una línea por bloque. marcas: el formato de WhatsApp (*negrita*, _cursiva_, ~tachado~); sin marcas, texto plano
function aLineas(raiz, marcas, enlaces = true) {
  const lineas = [];
  let actual = '';
  const cortar = () => { lineas.push(actual); actual = ''; };
  // En WhatsApp la marca tiene que ir pegada a las letras: los espacios quedan por fuera
  const envolver = (t, m) => { const x = t.match(/^(\s*)([\s\S]*?)(\s*)$/); return x[2] ? x[1] + m + x[2] + m + x[3] : t; };
  const enLinea = (n) => {
    if (typeof n === 'string') return n.replace(/ /g, ' ');
    if (n.tag === 'br') return '\n';
    const t = n.hijos.map(enLinea).join('');
    if (!marcas) return enlaces && n.tag === 'a' && n.a.href && !t.includes(n.a.href) ? t + ' (' + n.a.href + ')' : t;
    if (n.tag === 'b' || n.tag === 'strong') return envolver(t, '*');
    if (n.tag === 'i' || n.tag === 'em') return envolver(t, '_');
    if (n.tag === 's' || n.tag === 'del') return envolver(t, '~');
    if (n.tag === 'a' && n.a.href && !t.includes(n.a.href)) return t + ' (' + n.a.href + ')';
    return t;
  };
  const bloque = (n, lista = null, i = 0) => {
    if (typeof n === 'string' || !ES_BLOQUE.includes(n.tag)) { actual += enLinea(n); return; }
    if (actual.trim()) cortar(); else actual = '';
    if (n.tag === 'ul' || n.tag === 'ol') {
      let k = 0;
      for (const h of n.hijos) if (typeof h !== 'string' || h.trim()) bloque(h, n, typeof h === 'string' || h.tag !== 'li' ? k : ++k);
      return;
    }
    if (n.tag === 'li') {
      const marca = lista && lista.tag === 'ol' ? i + '. ' : lista && lista.a['data-tipo'] === 'checks' ? (n.a['data-hecho'] === '1' ? '☑ ' : '☐ ') : '• ';
      const t = n.hijos.map((h) => (typeof h !== 'string' && ES_BLOQUE.includes(h.tag) ? '\n' + aLineas({ hijos: [h] }, marcas, enlaces).join('\n') : enLinea(h))).join('');
      lineas.push(marca + t.trim()); return;
    }
    const t = n.hijos.map((h) => (typeof h !== 'string' && ES_BLOQUE.includes(h.tag) ? '\n' + aLineas({ hijos: [h] }, marcas, enlaces).join('\n') + '\n' : enLinea(h))).join('');
    lineas.push(marcas && (n.tag === 'h2' || n.tag === 'h3') && t.trim() ? '*' + t.trim().replace(/^\*+|\*+$/g, '') + '*' : t);
  };
  for (const n of raiz.hijos) bloque(n);
  if (actual.trim()) cortar();
  return lineas.flatMap((l) => l.split('\n')).map((l) => l.replace(/[ \t]+$/g, ''));
}
const juntar = (lineas) => lineas.join('\n').replace(/\n{3,}/g, '\n\n').trim();
export const textoPlano = (html, enlaces = true) => juntar(aLineas(arbol(html), false, enlaces));
export const textoWhatsApp = (nota) => {
  const cuerpo = juntar(aLineas(arbol(nota.html), true)), t = (nota.titulo || '').trim();
  return t ? '*' + t + '*\n' + cuerpo : cuerpo;
};
export function primeraLinea(html) { return (textoPlano(html, false).split('\n').find((l) => l.trim()) || '').trim(); }
// El título que se ve: el puesto o la primera línea
export function tituloDe(nota) {
  const t = (nota.titulo || '').trim() || primeraLinea(nota.html).replace(/^(•|☐|☑|\d+\.)\s*/, '');
  return t ? (t.length > 80 ? t.slice(0, 80).trimEnd() + '…' : t) : 'Nota sin título';
}
// Lo que va debajo del título en la lista: la primera línea que no es el título
export function resumenDe(nota) {
  const lineas = textoPlano(nota.html, false).split('\n').map((l) => l.trim()).filter(Boolean);
  const l = (nota.titulo || '').trim() ? lineas[0] : lineas[1];
  return l ? (l.length > 100 ? l.slice(0, 100).trimEnd() + '…' : l) : '';
}
export const vacia = (nota) => !(nota.titulo || '').trim() && !textoPlano(nota.html).trim() && !/<li data-hecho/.test(nota.html || '');

// ---------- Listar, buscar y filtrar ----------
export const todas = (est) => Object.values(est.notas || {}).filter((n) => n && typeof n === 'object');
export const meta = (est) => ({ carpetas: [], etiquetas: [], ...(est.notasMeta || {}) });
export const carpetaDe = (est, id) => meta(est).carpetas.find((c) => c.id === id) || null;
export const etiquetaDe = (est, id) => meta(est).etiquetas.find((t) => t.id === id) || null;
// El nombre con su carpeta de arriba: «Trabajo › Clientes»
export function rutaCarpeta(est, id) {
  const c = carpetaDe(est, id);
  if (!c) return '';
  const p = c.padre && carpetaDe(est, c.padre);
  return p ? p.nombre + ' › ' + c.nombre : c.nombre;
}
// Las carpetas en orden para elegir: cada una con sus subcarpetas debajo
export function carpetasEnOrden(est) {
  const l = meta(est).carpetas, porNombre = (a, b) => a.nombre.localeCompare(b.nombre, 'es');
  const raiz = l.filter((c) => !c.padre || !l.some((x) => x.id === c.padre)).sort(porNombre);
  return raiz.flatMap((c) => [{ ...c, nivel: 0 }, ...l.filter((x) => x.padre === c.id).sort(porNombre).map((x) => ({ ...x, nivel: 1 }))]);
}
const sinTildes = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// filtro: { carpeta: id | 'sin' | '' (todas), etiquetas: [id] (todas deben estar), buscar: texto }
// Las fijadas van primero; después, lo último que se editó
/** @param {any} est @param {{ carpeta?: string, etiquetas?: string[], buscar?: string }} [filtro] @param {boolean} [papelera] */
export function filtrar(est, { carpeta = '', etiquetas = [], buscar = '' } = {}, papelera = false) {
  const hijas = carpeta && carpeta !== 'sin' ? [carpeta, ...meta(est).carpetas.filter((c) => c.padre === carpeta).map((c) => c.id)] : [];
  const q = sinTildes(buscar).trim().split(/\s+/).filter(Boolean);
  return todas(est).filter((n) => {
    if (!!n.borrada !== papelera) return false;
    if (carpeta === 'sin' && n.carpeta && carpetaDe(est, n.carpeta)) return false;
    if (hijas.length && !hijas.includes(n.carpeta)) return false;
    const suyas = n.etiquetas || [];
    if (etiquetas.some((t) => !suyas.includes(t))) return false;
    if (!q.length) return true;
    const donde = sinTildes([n.titulo, textoPlano(n.html), rutaCarpeta(est, n.carpeta), ...suyas.map((t) => (etiquetaDe(est, t) || {}).nombre)].join(' \n '));
    return q.every((p) => donde.includes(p));
  }).sort((a, b) => (papelera ? (b.borrada || 0) - (a.borrada || 0) : (b.fijada ? 1 : 0) - (a.fijada ? 1 : 0) || (b.editada || 0) - (a.editada || 0)));
}
export const diasEnPapelera = (n, ahora = Date.now()) => Math.max(0, DIAS_PAPELERA - Math.floor((ahora - (n.borrada || ahora)) / DIA));

// ---------- Cambios (sobre un estado; las de abajo los guardan) ----------
export function crear(est, datos = {}, ahora = Date.now()) {
  const n = { id: nuevoId('n'), titulo: '', html: '', creada: ahora, editada: ahora, etiquetas: [], ...datos };
  (est.notas ??= {})[n.id] = n;
  return n;
}
// Lo que se edita: titulo, html (se limpia), carpeta, etiquetas, fijada. Devuelve true si algo cambió
export function editar(est, id, cambios, ahora = Date.now()) {
  const n = est.notas && est.notas[id];
  if (!n) return false;
  let hubo = false;
  for (const [k, v0] of Object.entries(cambios)) {
    const v = k === 'html' ? limpiarHtml(v0) : k === 'titulo' ? String(v0 || '').replace(/\s+/g, ' ').trim() : v0;
    if (JSON.stringify(n[k] ?? null) === JSON.stringify(v ?? null)) continue;
    if (v == null || v === '' || v === false) { if (k === 'titulo' || k === 'html') n[k] = ''; else delete n[k]; } else n[k] = v;
    hubo = true;
  }
  if (hubo && !('fijada' in cambios && Object.keys(cambios).length === 1)) n.editada = ahora;
  return hubo;
}
export const aPapelera = (est, id, ahora = Date.now()) => { const n = est.notas && est.notas[id]; if (!n) return false; n.borrada = ahora; delete n.fijada; return true; };
export const recuperar = (est, id) => { const n = est.notas && est.notas[id]; if (!n || !n.borrada) return false; delete n.borrada; if (n.carpeta && !carpetaDe(est, n.carpeta)) delete n.carpeta; return true; };
export const borrarYa = (est, id) => { if (!est.notas || !est.notas[id]) return false; delete est.notas[id]; return true; };
// Lo que lleva más de 30 días en la papelera se borra de verdad; también las notas nuevas que quedaron vacías
export function purgar(est, ahora = Date.now(), abierta = null) {
  let n = 0;
  for (const x of todas(est)) {
    if ((x.borrada && ahora - x.borrada >= DIAS_PAPELERA * DIA) || (x.id !== abierta && !x.borrada && vacia(x) && ahora - (x.creada || 0) > 60000)) { delete est.notas[x.id]; n++; }
  }
  return n;
}

// Carpetas: un solo nivel adentro (una subcarpeta no puede tener otras)
const metaDe = (est) => (est.notasMeta ??= { carpetas: [], etiquetas: [] });
export function nuevaCarpeta(est, nombre, padre = null) {
  const t = String(nombre || '').trim();
  if (!t) return null;
  const p = padre && carpetaDe(est, padre);
  const c = { id: nuevoId('c'), nombre: t, ...(p && !p.padre ? { padre: p.id } : {}) };
  metaDe(est).carpetas.push(c);
  return c;
}
export function renombrarCarpeta(est, id, nombre) { const c = carpetaDe(est, id), t = String(nombre || '').trim(); if (!c || !t) return false; metaDe(est).carpetas.find((x) => x.id === id).nombre = t; return true; }
// Sus notas pasan a "Sin carpeta" y sus subcarpetas quedan arriba
export function borrarCarpeta(est, id) {
  const m = metaDe(est), i = m.carpetas.findIndex((c) => c.id === id);
  if (i < 0) return false;
  m.carpetas.splice(i, 1);
  for (const c of m.carpetas) if (c.padre === id) delete c.padre;
  for (const n of todas(est)) if (n.carpeta === id) delete n.carpeta;
  return true;
}
export function moverCarpeta(est, id, padre) {
  const c = metaDe(est).carpetas.find((x) => x.id === id), p = padre && carpetaDe(est, padre);
  if (!c || (padre && (!p || p.padre || p.id === id || metaDe(est).carpetas.some((x) => x.padre === id)))) return false;
  if (p) c.padre = p.id; else delete c.padre;
  return true;
}
export function nuevaEtiqueta(est, nombre, color = null) {
  const t = String(nombre || '').trim().replace(/^#/, '');
  if (!t) return null;
  const m = metaDe(est), ya = m.etiquetas.find((x) => sinTildes(x.nombre) === sinTildes(t));
  if (ya) return ya;
  const x = { id: nuevoId('t'), nombre: t, color: color || COLORES[m.etiquetas.length % COLORES.length] };
  m.etiquetas.push(x);
  return x;
}
export function cambiarEtiqueta(est, id, cambios) {
  const x = metaDe(est).etiquetas.find((t) => t.id === id);
  if (!x) return false;
  if (cambios.nombre != null && String(cambios.nombre).trim()) x.nombre = String(cambios.nombre).trim().replace(/^#/, '');
  if (cambios.color) x.color = cambios.color;
  return true;
}
export function borrarEtiqueta(est, id) {
  const m = metaDe(est), i = m.etiquetas.findIndex((t) => t.id === id);
  if (i < 0) return false;
  m.etiquetas.splice(i, 1);
  for (const n of todas(est)) if ((n.etiquetas || []).includes(id)) n.etiquetas = n.etiquetas.filter((t) => t !== id);
  return true;
}

// ---------- Lo que usa la pantalla (cambia e() y guarda) ----------
const y = (hubo) => { if (hubo) guardar(); return hubo; };
export const notaNueva = (datos) => { const n = crear(e(), datos); guardar(); return n; };
export const guardarNota = (id, cambios) => y(editar(e(), id, cambios));
export const tirarNota = (id) => y(aPapelera(e(), id));
export const recuperarNota = (id) => y(recuperar(e(), id));
export const borrarNotaYa = (id) => y(borrarYa(e(), id));
export const vaciarPapelera = () => y(filtrar(e(), {}, true).map((n) => borrarYa(e(), n.id)).some(Boolean));
export const limpiarNotas = (abierta) => { if (purgar(e(), Date.now(), abierta)) guardar(false); };
export const crearCarpeta = (nombre, padre) => { const c = nuevaCarpeta(e(), nombre, padre); if (c) guardar(); return c; };
export const renombrar = (id, nombre) => y(renombrarCarpeta(e(), id, nombre));
export const quitarCarpeta = (id) => y(borrarCarpeta(e(), id));
export const anidar = (id, padre) => y(moverCarpeta(e(), id, padre));
export const crearEtiqueta = (nombre, color) => { const t = nuevaEtiqueta(e(), nombre, color); if (t) guardar(); return t; };
export const editarEtiqueta = (id, cambios) => y(cambiarEtiqueta(e(), id, cambios));
export const quitarEtiqueta = (id) => y(borrarEtiqueta(e(), id));
