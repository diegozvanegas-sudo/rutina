// 🔄 Equivalencias de alimentos: cuánto de un alimento equivale a otro en calorías, carbohidratos, proteína o grasa.
// Sin pantalla, para poder probarlo (la pantalla es src/react/pantallas/DietaEquivalencias.tsx).
// Alimentos: los de USDA (src/datos_equivalencias.js, por 100 g) y los tuyos de 🥚 Alimentos (por 100 g o por unidad;
// los de porción fija no sirven para calcular una cantidad).
import { totalComida } from './dieta.js';

export const CRITERIOS = { kcal: 'Calorías', c: 'Carbohidratos', p: 'Proteína', g: 'Grasa' };
export const NUTRIENTES = [['kcal', 'Calorías', 'kcal'], ['c', 'Carbohidratos', 'g'], ['p', 'Proteína', 'g'], ['g', 'Grasa', 'g'], ['fibra', 'Fibra', 'g']];
export const AVISO_MACROS = 'Igualar un nutriente no iguala los demás: mira la tabla para ver cómo cambian.';
// Una porción deja de ser práctica: muy poco para medir, demasiado para comer, o mucho más que lo que reemplaza
export const LIMITES = { minG: 5, maxG: 500, maxVeces: 4, minU: 0.5, maxU: 10 };

const num = (x) => (typeof x === 'number' && isFinite(x) ? x : null);
const llano = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const GRUPO_A_CATEGORIA = { proteina: 'carnes', carbo: 'cereales', grasa: 'grasas', verdura: 'verduras' };

// Todo alimento queda igual: valores por 100 g (por 'g') o por unidad (por 'u'), con su fuente
export function deUsda(a, fuente = 'USDA FoodData Central') {
  return { id: 'usda:' + a.id, nombre: a.nombre, estado: a.estado, categoria: a.categoria, por: 'g', kcal: a.kcal, p: a.p, c: a.c, g: a.g, fibra: num(a.fibra), fuente: a.marca ? 'Etiqueta del empaque · ' + a.marca : fuente + ' · ' + a.fdc, deEtiqueta: !!a.marca, unidadG: a.unidadG, etiqueta: a.etiqueta, datosEtiqueta: a.marca ? a : undefined, fdc: a.fdc, usda: a.usda || a.marca };
}
export function dePropio(a) {
  if (!a || (a.por !== 'g' && a.por !== 'u')) return null;
  return { id: 'tu:' + a.id, nombre: a.nombre, estado: '', categoria: GRUPO_A_CATEGORIA[a.grupo] || 'otros', por: a.por, kcal: Number(a.kcal) || 0, p: Number(a.p) || 0, c: Number(a.c) || 0, g: Number(a.g) || 0,
    fibra: num(a.fibra), fuente: a.fuente || 'Tus valores (🥚 Alimentos)', propio: true, idPropio: a.id };
}
// Un alimento de USDA que ya pasaste a 🥚 Alimentos (id 'usda-…') sale una sola vez: el tuyo, que es el que usa el plan
export function todos(usda, propios = []) {
  const tuyos = new Set(propios.map((a) => a && a.id));
  return [...propios.map(dePropio).filter(Boolean), ...usda.filter((a) => !tuyos.has('usda-' + a.id)).map((a) => deUsda(a))];
}
export const nombreCompleto = (a) => a.nombre + (a.estado ? ' (' + a.estado + ')' : '');
export const unidadDe = (a) => (a.por === 'u' ? 'u' : 'g');

// Lo que trae una cantidad (en gramos o unidades, según el alimento)
export function valoresDe(a, cant) {
  const f = a.por === 'u' ? cant : cant / 100;
  return { kcal: a.kcal * f, p: a.p * f, c: a.c * f, g: a.g * f, fibra: a.fibra == null ? null : a.fibra * f };
}

// Redondeo para mostrar: gramos enteros (medio gramo si es menos de 10 g), unidades de a media
export function redondear(cant, por) {
  if (por === 'u') return Math.max(0.5, Math.round(cant * 2) / 2);
  return cant < 10 ? Math.round(cant * 2) / 2 : Math.round(cant);
}

export function cantidadValida(cant) {
  const n = typeof cant === 'string' ? Number(cant.replace(',', '.')) : cant;
  return typeof n === 'number' && isFinite(n) && n > 0 && n <= 100000 ? n : null;
}

// ¿Se puede comer o medir esa porción?
export function practica(sust, cantSust, orig, cantOrig) {
  if (sust.por === 'u') {
    if (cantSust < LIMITES.minU) return { ok: false, motivo: 'Menos de media unidad: difícil de medir' };
    if (cantSust > LIMITES.maxU) return { ok: false, motivo: 'Más de ' + LIMITES.maxU + ' unidades: demasiado para una comida' };
    return { ok: true };
  }
  if (cantSust < LIMITES.minG) return { ok: false, motivo: 'Menos de ' + LIMITES.minG + ' g: difícil de medir' };
  if (cantSust > LIMITES.maxG) return { ok: false, motivo: 'Más de ' + LIMITES.maxG + ' g: demasiado para una comida' };
  if (orig && orig.por === 'g' && cantOrig > 0 && cantSust > cantOrig * LIMITES.maxVeces) return { ok: false, motivo: 'Más de ' + LIMITES.maxVeces + ' veces lo que reemplaza' };
  return { ok: true };
}

// Tabla comparativa: original contra sustituto, con la diferencia y el % de variación
export function comparar(orig, cantOrig, sust, cantSust) {
  const a = valoresDe(orig, cantOrig), b = valoresDe(sust, cantSust);
  return NUTRIENTES.map(([k, nombre, unidad]) => {
    const x = a[k], y = b[k];
    if (x == null || y == null) return { k, nombre, unidad, original: x, sustituto: y, diferencia: null, variacion: null };
    const diferencia = y - x;
    return { k, nombre, unidad, original: x, sustituto: y, diferencia, variacion: Math.abs(x) < 1e-9 ? (Math.abs(y) < 1e-9 ? 0 : null) : (diferencia / x) * 100 };
  });
}

// cantidad_equivalente = cantidad_original × nutriente_original / nutriente_sustituto (con cada uno en su base: 100 g o 1 unidad)
export function equivalente(orig, cantOrig, sust, criterio = 'kcal') {
  if (!orig || !sust) return { error: 'Elige los dos alimentos' };
  if (!CRITERIOS[criterio]) return { error: 'Criterio desconocido' };
  const cant = cantidadValida(cantOrig);
  if (cant == null) return { error: 'Escribe una cantidad mayor que cero' };
  const objetivo = valoresDe(orig, cant)[criterio];
  if (!(orig[criterio] > 0)) return { error: nombreCompleto(orig) + ' no tiene ' + CRITERIOS[criterio].toLowerCase() + ': elige otro criterio' };
  if (!(sust[criterio] > 0)) return { error: nombreCompleto(sust) + ' no tiene ' + CRITERIOS[criterio].toLowerCase() + ': no puede reemplazarlo por ese criterio' };
  const exacta = sust.por === 'u' ? objetivo / sust[criterio] : (objetivo / sust[criterio]) * 100;
  const cantidad = redondear(exacta, sust.por);
  return { cantidad, exacta, unidad: unidadDe(sust), objetivo, criterio, tabla: comparar(orig, cant, sust, cantidad), practica: practica(sust, exacta, orig, cant) };
}

// Qué tanto se parecen en lo demás: la diferencia de los otros macros, contada en calorías (proteína y carbos 4, grasa 9)
const PESO = { p: 4, c: 4, g: 9 };
export function distancia(tabla, criterio) {
  return tabla.filter((x) => PESO[x.k] && x.k !== criterio).reduce((s, x) => s + Math.abs(x.diferencia || 0) * PESO[x.k], 0)
    + (criterio !== 'kcal' ? Math.abs((tabla.find((x) => x.k === 'kcal') || {}).diferencia || 0) * 0.5 : 0);
}

// Sustitutos para un alimento: todos igualan el criterio, así que van primero los que más se parecen en lo demás
// y al final los que dan porciones poco prácticas
export function sugerir(orig, cantOrig, lista, { criterio = 'kcal', categoria = null, max = 30 } = {}) {
  const out = [];
  for (const s of lista) {
    if (s.id === orig.id || (categoria && s.categoria !== categoria)) continue;
    const r = equivalente(orig, cantOrig, s, criterio);
    if (r.error) continue;
    out.push({ alimento: s, ...r, distancia: distancia(r.tabla, criterio) });
  }
  return out.sort((a, b) => (a.practica.ok === b.practica.ok ? a.distancia - b.distancia : a.practica.ok ? -1 : 1)).slice(0, max);
}

// Buscador: todas las palabras en el nombre, el estado o el nombre en inglés de USDA; primero los que empiezan así
export function buscar(lista, texto, { categoria = null, max = 12 } = {}) {
  const palabras = llano(texto).split(/\s+/).filter(Boolean);
  const res = lista.filter((a) => (!categoria || a.categoria === categoria) && palabras.every((w) => llano(a.nombre + ' ' + a.estado + ' ' + (a.usda || '')).includes(w)));
  const empieza = (a) => (palabras.length && llano(a.nombre).startsWith(palabras[0]) ? 0 : 1);
  return res.sort((a, b) => empieza(a) - empieza(b) || Number(!a.propio) - Number(!b.propio) || a.nombre.localeCompare(b.nombre)).slice(0, max);
}

// Un alimento de USDA pasa a 🥚 Alimentos (para usarlo en un plan): por 100 g, con su grupo y su fuente
export function paraDieta(a) {
  const grupo = { carnes: 'proteina', pescados: 'proteina', 'huevos-lacteos': 'proteina', grasas: 'grasa', verduras: 'verdura' }[a.categoria] || 'carbo';
  return { id: a.id.replace(/^usda:/, 'usda-'), nombre: nombreCompleto(a), por: 'g', p: a.p, g: a.g, c: a.c, kcal: a.kcal, grupo, fibra: a.fibra ?? undefined, fuente: a.fuente,
    ...(a.deEtiqueta ? { etiquetaId: a.id.replace(/^usda:/, ''), unidadG: a.unidadG, sodio: a.datosEtiqueta?.sodio } : {}) };
}

// Reemplazar el alimento i de una comida: copia nueva, la original no cambia
export function sustituirEnComida(comida, i, alimentoId, cant) {
  if (!comida || !comida.items[i]) return null;
  const items = comida.items.map((x, j) => (j === i ? { alimento: alimentoId, cant } : { ...x }));
  return { ...comida, items };
}

// La foto de una comida marcada (la que suma al día), igual que al marcarla en 🍽 Hoy
export function fotoComida(comida, alimentos, ts = Date.now()) {
  const t = totalComida(comida, alimentos);
  return { ts, nombre: comida.nombre, kcal: Math.round(t.kcal), p: Math.round(t.p), c: Math.round(t.c), g: Math.round(t.g) };
}
