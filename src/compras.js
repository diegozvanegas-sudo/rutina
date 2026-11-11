// 🛒 Compras: la lista del próximo mercado y los deseos (cosas que quiero comprar algún día).
// Datos en estado.compras = { lista: [item], veces: { clave: { nombre, cat, n } } }
// item: { id, tipo: 'mercado' | 'deseo', nombre, cant, precio, cat, prioridad, enlace, nota, creado, hecho, comprado }
// "veces" cuenta lo que ya compraste: de ahí salen los botones rápidos del próximo mercado.

export const CATEGORIAS = [
  ['proteina', '🥩 Proteína'], ['frutas', '🥦 Frutas y verduras'], ['despensa', '🍚 Granos y despensa'], ['lacteos', '🥛 Lácteos y huevos'],
  ['bebidas', '🥤 Bebidas'], ['suplementos', '💊 Suplementos'], ['aseo', '🧴 Aseo y hogar'], ['otros', '📦 Otros'],
];
export const PRIORIDADES = [['necesito', '🔴 Lo necesito'], ['quiero', '🟡 Lo quiero'], ['algun-dia', '⚪ Algún día']];
// Días que conviene esperar antes de comprar un deseo que no necesitas (para no comprar por impulso)
export const ESPERA_DESEO = 30;

const sinTildes = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
export const claveCompra = (nombre) => sinTildes(nombre).replace(/\s+/g, ' ');

// Categoría según el nombre ("pechuga" -> proteína); si no se reconoce, "otros"
const PALABRAS = {
  proteina: ['pollo', 'pechuga', 'carne', 'res', 'cerdo', 'atun', 'pescado', 'salmon', 'tilapia', 'jamon', 'pavo', 'molida', 'lomo', 'chuleta', 'costilla', 'mortadela', 'salchicha', 'chorizo'],
  frutas: ['banano', 'platano', 'manzana', 'pera', 'fresa', 'mora', 'uva', 'mango', 'papaya', 'pina', 'naranja', 'limon', 'mandarina', 'aguacate', 'tomate', 'cebolla', 'ajo', 'papa', 'yuca', 'zanahoria',
    'lechuga', 'espinaca', 'brocoli', 'pepino', 'pimenton', 'ahuyama', 'verdura', 'fruta', 'ensalada', 'cilantro', 'arracacha', 'maracuya', 'guayaba', 'lulo', 'sandia', 'melon', 'kiwi', 'champinon'],
  despensa: ['arroz', 'avena', 'pasta', 'frijol', 'lenteja', 'garbanzo', 'harina', 'arepa', 'pan', 'aceite', 'sal', 'azucar', 'panela', 'cafe', 'chocolate', 'mantequilla de mani', 'mani', 'granola',
    'cereal', 'galleta', 'atun en lata', 'salsa', 'especia', 'miel', 'tortilla', 'quinoa', 'maiz', 'nueces', 'almendra'],
  lacteos: ['leche', 'huevo', 'queso', 'yogur', 'kumis', 'mantequilla', 'crema', 'cuajada', 'kefir'],
  bebidas: ['agua', 'jugo', 'gaseosa', 'cerveza', 'te ', 'electrolito', 'gatorade', 'vino', 'soda'],
  suplementos: ['proteina en polvo', 'whey', 'creatina', 'vitamina', 'omega', 'magnesio', 'colageno', 'preentreno', 'suplemento'],
  aseo: ['jabon', 'shampoo', 'champu', 'papel', 'detergente', 'cloro', 'desodorante', 'crema dental', 'cepillo', 'esponja', 'suavizante', 'toalla', 'bolsa', 'limpiador', 'servilleta', 'afeitar', 'seda dental'],
};
export function adivinarCategoria(nombre) {
  const n = ' ' + sinTildes(nombre) + ' ';
  // Primero las frases más largas: "mantequilla de mani" es despensa, "proteina en polvo" es suplemento
  const pares = Object.entries(PALABRAS).flatMap(([cat, ps]) => ps.map((p) => [cat, p])).sort((a, b) => b[1].length - a[1].length);
  // Al inicio de una palabra: "fresas" no es "res", "aguacate" no es "agua"
  const hit = pares.find(([, p]) => n.includes(' ' + p));
  return hit ? hit[0] : 'otros';
}

// Precio escrito como "12.500", "12500", "$ 12,5k" -> número (o null)
export function precioDe(texto) {
  let s = String(texto ?? '').toLowerCase().replace(/[$\s]/g, '');
  if (!s) return null;
  const mil = /k$/.test(s);
  s = s.replace(/k$/, '');
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, ''); // 12.500
  s = s.replace(',', '.');
  const n = Number(s);
  return isFinite(n) && n >= 0 ? Math.round(n * (mil ? 1000 : 1)) : null;
}

export const pendientes = (lista, tipo) => (lista || []).filter((x) => x.tipo === tipo && !x.hecho);
export const comprados = (lista, tipo) => (lista || []).filter((x) => x.tipo === tipo && x.hecho).sort((a, b) => String(b.comprado || '').localeCompare(String(a.comprado || '')));
export const total = (items) => items.reduce((s, x) => s + (Number(x.precio) || 0), 0);
export const sinPrecio = (items) => items.filter((x) => !(Number(x.precio) > 0)).length;

// Lo pendiente del mercado por categoría, en el orden de CATEGORIAS
export function porCategoria(items) {
  return CATEGORIAS.map(([id, nombre]) => ({ id, nombre, items: items.filter((x) => (x.cat || 'otros') === id) })).filter((g) => g.items.length);
}

// Botones rápidos: lo que más compras y no está pendiente
export function frecuentes(compras, max = 12) {
  const enLista = new Set(pendientes(compras.lista, 'mercado').map((x) => claveCompra(x.nombre)));
  return Object.entries(compras.veces || {}).filter(([k]) => !enLista.has(k)).sort((a, b) => b[1].n - a[1].n || a[1].nombre.localeCompare(b[1].nombre, 'es'))
    .slice(0, max).map(([k, v]) => ({ clave: k, ...v }));
}

// Días desde que se anotó (para la regla de esperar antes de comprar un deseo)
export const diasEnLista = (item, hoy) => Math.max(0, Math.round((Date.parse(hoy) - Date.parse(item.creado || hoy)) / 86400000));
export function consejoDeseo(item, hoy) {
  if (item.prioridad === 'necesito') return '';
  const d = diasEnLista(item, hoy);
  return d >= ESPERA_DESEO ? 'Lleva ' + d + ' días en la lista: si aún lo quieres, ya no es un impulso.' : 'Espera ' + (ESPERA_DESEO - d) + ' días' + (d ? ' más' : '') + ' antes de comprarlo: si en ' + ESPERA_DESEO + ' días lo sigues queriendo, cómpralo.';
}

// Marcar comprado suma a "veces" (para los botones rápidos); desmarcarlo lo resta
export function marcarComprado(compras, item, hoy, hecho = true) {
  if (!!item.hecho === hecho) return;
  item.hecho = hecho;
  if (hecho) item.comprado = hoy; else delete item.comprado;
  if (item.tipo !== 'mercado') return;
  const k = claveCompra(item.nombre), v = ((compras.veces ??= {})[k] ??= { nombre: item.nombre.trim(), cat: item.cat || 'otros', n: 0 });
  v.n = Math.max(0, v.n + (hecho ? 1 : -1));
  v.cat = item.cat || v.cat;
  if (!v.n) delete compras.veces[k];
}

// La lista en texto para WhatsApp o para llevar al supermercado
const pesos = (n) => '$' + Math.round(n).toLocaleString('es-CO');
export function textoLista(compras, tipo = 'mercado') {
  const items = pendientes(compras.lista, tipo);
  if (!items.length) return '';
  const linea = (x) => '☐ ' + x.nombre + (x.cant ? ' (' + x.cant + ')' : '') + (Number(x.precio) > 0 ? ' · ' + pesos(x.precio) : '');
  const cuerpo = tipo === 'mercado'
    ? porCategoria(items).map((g) => g.nombre + '\n' + g.items.map(linea).join('\n')).join('\n\n')
    : PRIORIDADES.map(([id, nombre]) => ({ nombre, xs: items.filter((x) => (x.prioridad || 'quiero') === id) })).filter((g) => g.xs.length).map((g) => g.nombre + '\n' + g.xs.map(linea).join('\n')).join('\n\n');
  const t = total(items);
  return (tipo === 'mercado' ? '🛒 Mercado' : '✨ Deseos') + ' (' + items.length + ')\n\n' + cuerpo + (t ? '\n\nTotal estimado: ' + pesos(t) : '');
}
