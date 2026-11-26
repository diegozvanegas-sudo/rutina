// 📋 Ficha de un alimento de etiqueta (src/datos_etiquetas.js): qué quiere decir cada número, sin pantalla para poder probarlo.
// Referencias: OMS (sodio < 2.000 mg al día, que son 5 g de sal; azúcares libres < 10 % de las calorías), fibra 25 g al día,
// y los sellos de advertencia de Colombia (Resolución 810 de 2021, ajustada por la 2492 de 2022).
// Es para informar, no es consejo médico: con presión alta o un problema de riñón, el sodio lo decide el médico.
export const SODIO_DIA = 2000, FIBRA_DIA = 25, SODIO_POR_G_SAL = 400;
// El sudor lleva en promedio unos 900 mg de sodio por litro (varía mucho de persona a persona: 200 a 2.000)
export const SODIO_SUDOR_L = 900;

const fmt = (n, dec = 0) => (Math.round(n * 10 ** dec) / 10 ** dec).toLocaleString('es-CO');
const pct = (n, base) => Math.round((n / base) * 100);

// Niveles por 100 g (como referencia, parecidos a los del Codex Alimentarius)
export function nivelSodio(mg100) {
  if (mg100 == null) return null;
  if (mg100 < 5) return { k: 'sin', nombre: 'sin sodio', icono: '🟢' };
  if (mg100 <= 40) return { k: 'muy-bajo', nombre: 'muy bajo en sodio', icono: '🟢' };
  if (mg100 <= 120) return { k: 'bajo', nombre: 'bajo en sodio', icono: '🟢' };
  if (mg100 < 300) return { k: 'moderado', nombre: 'sodio moderado', icono: '🟡' };
  return { k: 'alto', nombre: 'alto en sodio', icono: '🔴' };
}

// Sellos de advertencia de Colombia: cuáles llevaría el producto con lo de su etiqueta
export function sellos(a) {
  const kcal = a.kcal || 0, res = [];
  if (a.sodio != null && (a.sodio >= 300 || (kcal > 0 && a.sodio / kcal >= 1))) res.push('EXCESO EN SODIO');
  if (a.azucaresAnadidos != null && kcal > 0 && (a.azucaresAnadidos * 4) / kcal >= 0.1) res.push('EXCESO EN AZÚCARES');
  if (a.grasaSat != null && kcal > 0 && (a.grasaSat * 9) / kcal >= 0.1) res.push('EXCESO EN GRASAS SATURADAS');
  if (a.grasaTrans != null && kcal > 0 && (a.grasaTrans * 9) / kcal >= 0.01) res.push('EXCESO EN GRASAS TRANS');
  return res;
}

// Las calorías que deberían salir con sus macros (la fibra cuenta 2 kcal por gramo, el resto de carbos 4)
export function kcalCalculadas(a) {
  const fibra = a.fibra || 0;
  return 4 * (a.p || 0) + 4 * Math.max(0, (a.c || 0) - fibra) + 2 * fibra + 9 * (a.g || 0);
}

// Lo que trae una unidad (si la etiqueta dice cuánto pesa) o 100 g
const porcion = (a) => (a.unidadG ? { g: a.unidadG, nombre: 'cada unidad (' + a.unidadG + ' g)', f: a.unidadG / 100 } : { g: 100, nombre: '100 g', f: 1 });

export function fichaEtiqueta(a) {
  if (!a || !a.marca) return null;
  const u = porcion(a), puntos = [];
  const val = (k) => (a[k] == null ? null : a[k] * u.f);

  // Qué es en tu plan
  const carbo = (a.c || 0) * 4 >= (a.kcal || 0) * 0.6, prote = (a.p || 0) * 4 >= (a.kcal || 0) * 0.3;
  puntos.push({ k: 'plan', icono: carbo ? '🍚' : prote ? '🍗' : '🥑', titulo: 'En tu plan cuenta como ' + (carbo ? 'carbohidrato' : prote ? 'proteína' : 'grasa'),
    texto: 'Trae ' + fmt(val('kcal')) + ' kcal en ' + u.nombre + ': ' + fmt(val('c'), 1) + ' g de carbos, ' + fmt(val('p'), 1) + ' g de proteína y ' + fmt(val('g'), 1) + ' g de grasa. '
      + (carbo ? 'Reemplaza al arroz, la papa o la avena, no a la carne' + ((a.p || 0) < 5 ? ': casi no trae proteína, así que acompáñala con huevo, queso o pollo.' : '.') : '') });

  // Sodio
  if (a.sodio != null) {
    const n = nivelSodio(a.sodio), mg = val('sodio');
    puntos.push({ k: 'sodio', icono: '🧂', titulo: 'Sodio: ' + n.nombre + ' ' + n.icono, nivel: n.k,
      texto: fmt(mg, 1) + ' mg en ' + u.nombre + ', ' + (pct(mg, SODIO_DIA) < 1 ? 'menos del 1 %' : 'el ' + pct(mg, SODIO_DIA) + ' %') + ' de los ' + fmt(SODIO_DIA) + ' mg que la OMS pone como tope al día (5 g de sal). '
        + 'La sal es 40 % sodio: 1 g de sal (una pizca grande) trae unos ' + SODIO_POR_G_SAL + ' mg. El exceso sube la presión; por eso se cuenta. '
        + (n.k === 'alto' ? 'Cuídalo: con poco de esto ya llevas buena parte del día.' : n.k === 'moderado' ? 'Va bien si el resto del día no es de paquete o embutido.'
          : 'Casi todo el sodio del día te llega por lo que le pones (sal, queso, mantequilla, embutidos), no por este producto.') },
    { k: 'sudor', icono: '⚽', titulo: 'Los días de fútbol o gym fuerte',
      texto: 'Al sudar pierdes sodio: unos ' + fmt(SODIO_SUDOR_L) + ' mg por litro de sudor, y en un partido se sudan fácil 1,5 a 2 litros (≈ ' + fmt(SODIO_SUDOR_L * 1.5) + '–' + fmt(SODIO_SUDOR_L * 2) + ' mg). '
        + 'Ese día no hace falta huirle a la sal: una pizca en la comida de después, un caldo o un suero ayudan a recuperarte y a evitar calambres.' });
  }

  // Azúcar
  if (a.azucares != null || a.azucaresAnadidos != null) {
    const sin = a.azucaresAnadidos === 0;
    puntos.push({ k: 'azucar', icono: '🍬', titulo: sin ? 'Azúcar: sin azúcar añadida' : 'Azúcar',
      texto: (a.azucares != null ? 'Trae ' + fmt(val('azucares'), 1) + ' g de azúcares en ' + u.nombre + '. ' : '')
        + (sin ? 'Son los del propio ingrediente; no le echaron azúcar. ' : a.azucaresAnadidos != null ? fmt(val('azucaresAnadidos'), 1) + ' g son añadidos. ' : '')
        + 'Lo que importa es el azúcar añadido: la OMS pide que no pase del 10 % de tus calorías.' });
  }

  // Fibra
  if (a.fibra != null) {
    const f = val('fibra');
    puntos.push({ k: 'fibra', icono: '🌾', titulo: 'Fibra: ' + fmt(f, 1) + ' g',
      texto: 'Es el ' + pct(f, FIBRA_DIA) + ' % de unos ' + FIBRA_DIA + ' g al día. La fibra llena más y hace que el carbohidrato pase más despacio a la sangre. ' + (a.fibra >= 3 ? 'Para ser un carbohidrato, está bien.' : '') });
  }

  // Grasas y sellos
  const s = sellos(a);
  puntos.push({ k: 'sellos', icono: s.length ? '⬛' : '✅', titulo: s.length ? 'Llevaría sello: ' + s.join(', ') : 'No lleva sellos de advertencia',
    texto: 'En Colombia el sello negro sale con sodio desde 1 mg por cada kcal (o 300 mg en 100 g), o si el azúcar añadido o la grasa saturada pasan del 10 % de las calorías. '
      + (s.length ? 'Este los pasa: es de los que se comen de vez en cuando.' : 'Este no pasa ninguno' + (a.sodio != null && a.kcal ? ' (tiene ' + fmt(a.sodio / a.kcal, 2) + ' mg de sodio por kcal)' : '') + '.') });

  // ¿Cuadran las calorías?
  const calc = kcalCalculadas(a), dif = a.kcal ? (calc - a.kcal) / a.kcal : 0;
  if (Math.abs(dif) >= 0.05) {
    puntos.push({ k: 'cuadra', icono: '🧮', titulo: 'La etiqueta no cuadra exacto',
      texto: 'Con sus macros deberían salir unas ' + fmt(calc) + ' kcal por 100 g y dice ' + fmt(a.kcal) + ' (' + (dif > 0 ? '+' : '') + Math.round(dif * 100) + ' %). Pasa seguido: la ley permite un margen y cada fábrica redondea. La app usa lo que dice la etiqueta.' });
  }

  // Del empaque
  const empaque = [a.ingredientes && ['🥣', 'Ingredientes', a.ingredientes], a.preparacion && ['🔥', 'Preparación', a.preparacion], a.conservacion && ['❄️', 'Conservación', a.conservacion], a.empaque && ['📦', 'Empaque', a.empaque]].filter(Boolean);
  for (const [icono, titulo, texto] of empaque) puntos.push({ k: 'empaque', icono, titulo, texto });

  return {
    titulo: '📋 ' + a.nombre,
    resumen: [fmt(val('kcal')) + ' kcal', fmt(val('c'), 1) + ' g carbos', a.sodio != null ? fmt(val('sodio'), 1) + ' mg sodio' : null].filter(Boolean).join(' · ') + ' en ' + u.nombre,
    marca: a.marca, puntos, porcionG: u.g,
  };
}

