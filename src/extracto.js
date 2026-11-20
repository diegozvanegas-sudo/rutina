// 🏦 Extracto del banco: leer los movimientos de un extracto (CSV, texto pegado o el texto de un PDF), clasificarlos y analizarlos.
// Sin pantalla, para poder probarlo. Todo pasa en el equipo: el extracto no se guarda ni sale de aquí; solo los movimientos que
// pases a Finanzas. La pantalla está en src/react/pantallas/FinanzasExtracto.tsx y las acciones en src/vistas/extracto.js
// Movimiento leído: { id, fecha, desc, monto, tipo: gasto | ingreso, saldo?, categoria, sub?, clave, banco?, interno?, ya?, pasar }

import { leerCuotas, leerTasa } from './cuotas.js';

// ---------- Montos ----------
// "25.000", "25.000,50", "25,000.50", "-$ 1.234.567", "(25.000)", "25.000-" → número con signo (null si no es un monto)
export function leerValor(t) {
  let s = String(t || '').trim();
  if (!s) return null;
  const neg = /^\(.*\)$/.test(s) || /^-|^\$\s*-|-\s*$/.test(s) || /^−/.test(s);
  s = s.replace(/[()$\s−+-]/g, '').replace(/cop$/i, '');
  if (!/^\d[\d.,]*$/.test(s)) return null;
  const punto = s.lastIndexOf('.'), coma = s.lastIndexOf(',');
  let n;
  if (punto >= 0 && coma >= 0) {
    // Los dos: el último es el decimal
    const dec = punto > coma ? '.' : ',', mil = dec === '.' ? ',' : '.';
    n = Number(s.split(mil).join('').replace(dec, '.'));
  } else if (punto >= 0 || coma >= 0) {
    const sep = punto >= 0 ? '.' : ',', partes = s.split(sep);
    // Grupos de 3 después del separador = miles (25.000 · 1,234,567); 1 o 2 cifras al final = decimales (25000,50)
    n = partes.slice(1).every((p) => p.length === 3) ? Number(partes.join('')) : partes.length === 2 && partes[1].length <= 2 ? Number(partes[0] + '.' + partes[1]) : NaN;
  } else n = Number(s);
  if (!isFinite(n)) return null;
  return Math.round((neg ? -n : n) * 100) / 100;
}
// Montos dentro de una línea: con separador de miles o decimales, o con $ (así no se toman referencias ni números de documento)
const MONTO = /\(?[-−]?\s?\$?\s?[-−]?\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?\)?-?|\(?[-−]?\s?\$?\s?\d+[.,]\d{2}\)?-?(?!\d)|[-−]?\$\s?\d+/g;

// ---------- Fechas ----------
const MESES = { ene: 1, jan: 1, feb: 2, mar: 3, abr: 4, apr: 4, may: 5, jun: 6, jul: 7, ago: 8, aug: 8, sep: 9, set: 9, oct: 10, nov: 11, dic: 12, dec: 12 };
const dos = (n) => String(n).padStart(2, '0');
const armar = (a, m, d) => (m >= 1 && m <= 12 && d >= 1 && d <= 31 && a > 1990 && a < 2100 ? a + '-' + dos(m) + '-' + dos(d) : null);
const anio = (a) => (a < 100 ? 2000 + a : a);
const FECHAS = [
  [/\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/, (x) => armar(+x[1], +x[2], +x[3])],
  [/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4}|\d{2})\b/, (x) => armar(anio(+x[3]), +x[2], +x[1])],
  [/\b(\d{1,2})[\s-/.]+([a-záé]{3})[a-záé]*\.?[\s-/.,]+(?:de\s+)?(\d{4}|\d{2})\b/i, (x) => MESES[x[2].toLowerCase().slice(0, 3)] && armar(anio(+x[3]), MESES[x[2].toLowerCase().slice(0, 3)], +x[1])],
  [/\b([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})\b/i, (x) => MESES[x[1].toLowerCase().slice(0, 3)] && armar(+x[3], MESES[x[1].toLowerCase().slice(0, 3)], +x[2])],
];
// Sin año (12/11, 12 nov): el año del extracto, y si queda en el futuro, el anterior
const SIN_ANIO = [
  [/\b(\d{1,2})[/-](\d{1,2})\b(?![/-]\d)/, (x) => [+x[2], +x[1]]],
  [/\b(\d{1,2})[\s-]([a-záé]{3})[a-záé]*\.?\b/i, (x) => [MESES[x[2].toLowerCase().slice(0, 3)], +x[1]]],
];
// La fecha de una línea: { fecha, texto sin la fecha } o null
export function leerFecha(linea, { anioBase, hoy } = {}) {
  for (const [re, f] of FECHAS) { const x = linea.match(re), v = x && f(x); if (v) return { fecha: v, resto: linea.replace(x[0], ' ') }; }
  const a = anioBase || Number((hoy || '').slice(0, 4)) || new Date().getFullYear();
  for (const [re, f] of SIN_ANIO) {
    const x = linea.match(re); if (!x) continue;
    const [m, d] = f(x); let v = m && armar(a, m, d);
    if (v && hoy && v > hoy) v = armar(a - 1, m, d);
    if (v) return { fecha: v, resto: linea.replace(x[0], ' ') };
  }
  return null;
}

// ---------- Clave del comercio (para aprender categorías y ver qué se repite) ----------
const RUIDO = /\b(compra|compras|pago|pagos|pse|pos|en|de|del|la|el|los|las|a|por|con|y|internet|web|online|tarj(eta)?|tdc|tc|deb(ito)?|cred(ito)?|trx|transacc?(ion)?|ref(erencia)?|no|nro|num|cop|col|bogota|medellin|cali|co|sas|s\.?a\.?s?|ltda|visa|mastercard|master|dcto|sucursal|virtual|app)\b/g;
export function claveDe(desc) {
  const t = String(desc || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(RUIDO, ' ').replace(/\s+/g, ' ').trim();
  // Las palabras con letras (d1 sí; 234 o 0045 no: son sucursales y referencias)
  return t.split(' ').filter((w) => w.length > 1 && /[a-z]/.test(w)).slice(0, 3).join(' ') || String(desc || '').trim().toLowerCase().slice(0, 20);
}

// ---------- Categorías por comercio ----------
// [expresión, categoría, subcategoría?] Lo primero que coincide gana. Lo que corrijas a mano se aprende (fin.reglasExtracto)
const R = (re, categoria, sub) => ({ re, categoria, sub });
export const REGLAS = [
  // Cobros del banco: cuota de manejo, comisiones, 4x1000, seguros
  R(/cuota\s*(de\s*)?manejo|cuota\s*admin/i, 'deudas', 'cuota-de-manejo'),
  R(/gmf|4\s*x\s*1000|4\s*x\s*mil|gravamen/i, 'impuestos', 'retencion'),
  R(/comisi[oó]n|costo\s*(de\s*)?(transacc|retiro|transf)|iva\s*(comis|cuota)|cobro\s*(serv|por)/i, 'deudas', 'comisiones-bancarias'),
  R(/intereses?\s*(corriente|de\s*mora|mora|financ)/i, 'deudas', 'intereses'),
  R(/seguro\s*(de\s*)?(vida|deudor|cuota|tarjeta|fraude|desempleo)|seguro\s*bancario/i, 'deudas', 'seguro-de-la-deuda'),
  R(/netflix|spotify|disney|hbo|\bmax\b|prime\s*video|amazon\s*prime|youtube|google\s*(one|storage|play)|icloud|apple\.com|apple\s*(music|tv)|deezer|crunchyroll|paramount|star\+|openai|chatgpt|anthropic|claude|microsoft|office\s*365|adobe|canva|dropbox/i, 'suscripciones'),
  R(/rappi|ifood|domicilios|didi\s*food|uber\s*eats|restaurante|rest\b|crepes|frisby|kfc|mcdonald|burger|el\s*corral|presto|subway|domino|pizza|juan\s*valdez|tostao|oma\b|starbucks|cafe|panaderia|asadero|wok|sushi|qbano|hamburgues/i, 'comida'),
  R(/\bd1\b|\bara\b|exito|éxito|carulla|olimpica|olímpica|jumbo|metro\b|makro|pricesmart|alkosto|surtimax|isimo|colsubsidio|supermercado|minimercado|fruver|carniceria|mercado|justo\s*y\s*bueno|euro\s*super|la\s*14|zapatoca|super\s*inter|cencosud/i, 'mercado'),
  R(/terpel|primax|biomax|texaco|esso|mobil|petrobras|gasolina|combustible|eds\b|estacion\s*de\s*servicio|zeuss|brio/i, 'gasolina'),
  R(/claro|movistar|tigo|\bwom\b|\betb\b|virgin\s*mobile|une\b|hughesnet|internet\s*hogar/i, 'celular'),
  R(/\bepm\b|empresas\s*publicas|codensa|enel|vanti|gas\s*natural|acueducto|emcali|aguas\s*de|electricaribe|air-e|afinia|celsia|essa\b|cens\b|chec\b|edeq|alcantarill|aseo\b|energia/i, 'servicios'),
  R(/smart\s*fit|bodytech|spinning|stark|gym|gimnasio|suplement|proteina|nutramerican|athletic/i, 'gym'),
  R(/uber|didi|cabify|indriver|in\s*driver|beat\b|taxi|peaje|soat|parqueadero|parking|transmilenio|tullave|metro\s*de\s*medellin|civica|sitp|mio\b|moto|taller|lubric|llantas|runt/i, 'transporte'),
  R(/drogueria|droguería|farmatodo|cruz\s*verde|cafam|la\s*rebaja|colsanitas|sura\b|eps\b|clinica|clínica|hospital|laboratorio|optica|óptica|odonto|dental|medic/i, 'salud'),
  R(/cine\s*colombia|cinemark|procinal|cinepolis|tuboleta|eticket|bar\b|discoteca|licor|cerveza|steam|playstation|xbox|nintendo|epic\s*games|bowling|parque/i, 'ocio'),
  R(/zara|h\s*&\s*m|koaj|arturo\s*calle|studio\s*f|tennis\b|adidas|nike|puma|falabella|bershka|pull\s*&?\s*bear|offcorss|gef\b|punto\s*blanco|americanino|ropa|calzado|zapat/i, 'ropa'),
  R(/mercado\s*libre|mercadolibre|amazon|aliexpress|temu|shein|linio|dafiti/i, 'otros', 'compras-por-internet'),
  R(/ktronix|panamericana|homecenter|easy\b|mac\s*center|ishop|samsung|xiaomi|huawei|lenovo|tecnolog/i, 'tecnologia'),
  R(/arriendo|arrendamiento|administracion|administración|inmobiliaria|propiedad\s*horizontal/i, 'vivienda'),
  R(/universidad|colegio|matricula|matrícula|platzi|udemy|coursera|domestika|icetex|curso|educaci/i, 'educacion'),
  R(/barberia|barbería|peluqueria|peluquería|spa\b|manicure|cosmetic|sephora|perfum/i, 'cuidado'),
  R(/avianca|latam|wingo|jetsmart|satena|booking|airbnb|despegar|hotel|hostal|expedia|terminal\s*de\s*transporte|bolivariano|expreso/i, 'viajes'),
  R(/veterinari|petsmart|mascota|agrocampo|laika|puppis|dog|gato/i, 'mascotas'),
  R(/dian\b|impuesto|predial|registradur|notaria|notaría|camara\s*de\s*comercio|tránsito|transito|multa|simit/i, 'impuestos'),
];
// Plata que entra: nómina, abonos, consignaciones, transferencias recibidas
const INGRESO = /n[oó]mina|pago\s*(de\s*)?(n[oó]mina|salario|sueldo)|salario|sueldo|abono\s*(de|por|transf|recib)|consignaci[oó]n|transf(erencia)?\s*(recibida|de\s|desde)|recibiste|te\s*envi|dep[oó]sito|devoluci[oó]n|reembolso|reverso|rendimiento|intereses?\s*(ganad|abonad|liquid)|prima\b|cesant[ií]as/i;
// Movimientos entre tus cuentas o pagos de la tarjeta: por defecto no se pasan (se contarían dos veces)
const INTERNO = /pago\s*(a\s*)?(tarjeta|tc\b|tdc|t\.?\s*c\.?\s|de\s*tarjeta|credito\s*visa|credito\s*master)|abono\s*(a\s*)?(tarjeta|tc\b|cr[eé]dito)|traslado|entre\s*(mis\s*)?cuentas|bolsillo|colch[oó]n|meta\s*de\s*ahorro|cuenta\s*propia|recarga\s*nequi|a\s*nequi|desde\s*nequi|retiro\s*(cajero|atm|en\s*cajero)|cajero|\batm\b/i;
const COBRO_BANCO = (m) => ['cuota-de-manejo', 'comisiones-bancarias', 'intereses', 'seguro-de-la-deuda'].includes(m.sub) || (m.categoria === 'impuestos' && m.sub === 'retencion');

export function categorizar(desc, tipo, aprendidas = {}) {
  const k = claveDe(desc);
  if (aprendidas[k]) { const [categoria, sub] = String(aprendidas[k]).split('/'); return { categoria, sub: sub || undefined }; }
  if (tipo === 'ingreso') return { categoria: /n[oó]mina|salario|sueldo/i.test(desc) ? 'salario' : /prima|cesant/i.test(desc) ? 'prestaciones' : /rendimiento|interes/i.test(desc) ? 'rendimientos' : /devoluci|reembolso|reverso/i.test(desc) ? 'reembolso' : 'otro-ingreso' };
  const r = REGLAS.find((x) => x.re.test(desc));
  return r ? { categoria: r.categoria, sub: r.sub } : { categoria: 'otros' };
}

// ---------- Leer el extracto ----------
// CSV: una fila de encabezados con "fecha" y columnas de descripción y valor (o débito y crédito)
function separarCSV(linea, sep) {
  const out = []; let cur = '', q = false;
  for (const ch of linea) {
    if (ch === '"') q = !q; else if (ch === sep && !q) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}
function leerCSV(lineas, op) {
  const sep = [';', '\t', ',', '|'].find((s) => lineas.slice(0, 15).some((l) => /fecha/i.test(l) && l.split(s).length >= 3));
  if (!sep) return null;
  const h = lineas.findIndex((l) => /fecha/i.test(l) && l.split(sep).length >= 3), cab = separarCSV(lineas[h], sep).map((c) => c.toLowerCase());
  const col = (re) => cab.findIndex((c) => re.test(c));
  const iF = col(/fecha/), iD = col(/descrip|concepto|detalle|comercio|movimiento|transacci|referencia|nombre/), iV = col(/^valor|monto|importe|valor\s*(trans|mov)|^valor$/);
  const iDeb = col(/d[eé]bito|cargo|retiro|salida|egreso/), iCre = col(/cr[eé]dito|abono|entrada|dep[oó]sito|ingreso/), iS = col(/saldo/);
  if (iF < 0 || (iV < 0 && iDeb < 0 && iCre < 0)) return null;
  const out = [];
  for (const l of lineas.slice(h + 1)) {
    const c = separarCSV(l, sep), f = leerFecha(c[iF] || '', op);
    if (!f) continue;
    let v = iV >= 0 ? leerValor(c[iV]) : null;
    if (v == null) { const d = leerValor(c[iDeb]) || 0, cr = leerValor(c[iCre]) || 0; v = cr ? Math.abs(cr) : d ? -Math.abs(d) : null; }
    if (!v) continue;
    out.push({ fecha: f.fecha, desc: (iD >= 0 ? c[iD] : c.filter((_, i) => ![iF, iV, iDeb, iCre, iS].includes(i)).join(' ')).replace(/\s+/g, ' ').trim(), valor: v, signo: true, saldo: iS >= 0 ? leerValor(c[iS]) : null });
  }
  return out;
}
// Encabezados y pies de página que no son parte de una descripción
const CABECERA = /p[aá]gina|fecha|descripci|saldo|total|valor|extracto|banco|cuenta|nit\b|cliente|sucursal|oficina|per[ií]odo|movimientos|resumen|d[eé]bitos|cr[eé]ditos/i;
// Texto (pegado o de un PDF): una línea por movimiento con fecha, descripción y valor (y el saldo al final, si lo trae)
function leerLineas(lineas, op) {
  const out = [];
  for (const l0 of lineas) {
    const l = l0.replace(/\s+/g, ' ').trim();
    if (!l) continue;
    const f = leerFecha(l, op);
    if (!f) {
      // Una línea sin fecha ni monto sigue la descripción del movimiento de arriba
      const ultimo = out[out.length - 1];
      if (ultimo && !(l.match(MONTO) || []).length && l.length < 60 && /^[a-záéíóúñ*.&' ]+$/i.test(l) && !CABECERA.test(l)) ultimo.desc = (ultimo.desc + ' ' + l).trim();
      continue;
    }
    if (/saldo\s*(anterior|inicial|final)|total(es)?\b/i.test(l)) continue;
    // 💳 Tarjeta de crédito: la cuota ("3/12") y la tasa salen antes de buscar los montos (si no, "1,89" parecería un valor).
    // Las otras fechas de la línea (la de corte) también, para que "05/11/2026" no se lea como cuota 5 de 11
    let resto = f.resto, cuotas = null;
    if (op.tarjeta) {
      resto = resto.replace(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/g, ' ');
      const cu = leerCuotas(resto);
      if (cu) {
        resto = resto.replace(cu.texto, ' ');
        const ta = leerTasa(resto);
        if (ta) for (const t of ta.textos) resto = resto.replace(t, ' ');
        cuotas = { k: cu.k, n: cu.n, tasa: ta ? ta.mensual : null };
      }
    }
    const montos = (resto.match(MONTO) || []).map((t) => ({ t, v: leerValor(t) })).filter((x) => x.v != null && x.v !== 0 && (!cuotas || Math.abs(x.v) >= 100));
    if (!montos.length) continue;
    // Con dos o más montos, el último suele ser el saldo y el de antes el valor del movimiento. En una compra a cuotas el
    // primero es el valor original de la compra y el que sigue, el cargo de este mes
    const mov = cuotas ? montos[Math.min(1, montos.length - 1)] : montos.length >= 2 ? montos[montos.length - 2] : montos[0];
    const saldo = !cuotas && montos.length >= 2 ? montos[montos.length - 1].v : null;
    if (cuotas) cuotas.original = Math.abs(montos[0].v);
    let desc = resto;
    for (const x of montos) desc = desc.replace(x.t, ' ');
    desc = desc.replace(/\b\d{5,}\b/g, ' ').replace(/\s+/g, ' ').replace(/^[\s\-|:]+|[\s\-|:]+$/g, '').trim();
    out.push({ fecha: f.fecha, desc: desc || 'Movimiento', valor: mov.v, signo: /^\(|[-−]/.test(mov.t.trim()), saldo, cuotas });
  }
  return out;
}

// El año que más se repite entre las fechas completas del extracto (para las fechas sin año)
function anioDe(texto) {
  const a = {}; for (const x of texto.matchAll(/\b(20\d{2})\b/g)) a[x[1]] = (a[x[1]] || 0) + 1;
  const mejor = Object.entries(a).sort((p, q) => q[1] - p[1])[0];
  return mejor ? Number(mejor[0]) : null;
}

// Extracto → movimientos clasificados. op: { hoy, aprendidas (fin.reglasExtracto), movimientos (los ya anotados) }
export function leerExtracto(texto, { hoy, aprendidas = {}, movimientos = [], tarjeta = false } = {}) {
  const lineas = String(texto || '').replace(/\r/g, '').split('\n'), op = { hoy, anioBase: anioDe(texto), tarjeta };
  const crudos = leerCSV(lineas, op) || leerLineas(lineas, op);
  let prev = null;
  const movs = crudos.map((x, i) => {
    let tipo;
    // El saldo dice la verdad: si bajó en el valor del movimiento, salió plata
    if (x.saldo != null && prev != null && Math.abs(Math.abs(prev - x.saldo) - Math.abs(x.valor)) < 1) tipo = x.saldo < prev ? 'gasto' : 'ingreso';
    else if (x.signo || x.valor < 0) tipo = x.valor < 0 ? 'gasto' : 'ingreso';
    else if (tarjeta) tipo = /pago|abono/i.test(x.desc) ? 'ingreso' : 'gasto';
    else tipo = INGRESO.test(x.desc) ? 'ingreso' : 'gasto';
    if (x.saldo != null) prev = x.saldo;
    const monto = Math.round(Math.abs(x.valor)), c = categorizar(x.desc, tipo, aprendidas);
    const m = { id: 'x' + i, fecha: x.fecha, desc: x.desc, monto, tipo, saldo: x.saldo, clave: claveDe(x.desc), ...c, ...(x.cuotas ? { cuotas: x.cuotas } : {}) };
    if (tipo === 'gasto' && COBRO_BANCO(m)) m.banco = true;
    if (INTERNO.test(x.desc) || (tarjeta && tipo === 'ingreso')) m.interno = true;
    m.ya = yaAnotado(m, movimientos);
    m.pasar = !m.interno && !m.ya;
    return m;
  }).filter((m) => m.monto > 0);
  return movs.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

// Ya está en Finanzas: mismo tipo y monto, a 3 días o menos
const dias = (a, b) => Math.abs(Math.round((Date.parse(a) - Date.parse(b)) / 86400000));
export function yaAnotado(m, movimientos = []) {
  const x = movimientos.find((y) => y.tipo === m.tipo && Math.round(y.monto) === m.monto && dias(y.fecha, m.fecha) <= 3);
  return x ? x.id : null;
}

// ---------- Análisis ----------
const suma = (xs) => xs.reduce((s, m) => s + m.monto, 0);
export const HORMIGA = 20000;
export function analizar(movs) {
  const gastos = movs.filter((m) => m.tipo === 'gasto' && !m.interno), ingresos = movs.filter((m) => m.tipo === 'ingreso' && !m.interno);
  const porCategoria = {};
  for (const m of gastos) porCategoria[m.categoria] = (porCategoria[m.categoria] || 0) + m.monto;
  const banco = gastos.filter((m) => m.banco);
  // Lo que se repite: el mismo comercio 2 o más veces. Con montos parecidos (±10 %) parece una suscripción o un fijo
  const grupos = {};
  for (const m of gastos) (grupos[m.clave] ??= []).push(m);
  const repetidos = Object.entries(grupos).filter(([, xs]) => xs.length >= 2).map(([clave, xs]) => {
    const min = Math.min(...xs.map((x) => x.monto)), max = Math.max(...xs.map((x) => x.monto));
    const fechas = xs.map((x) => x.fecha).sort();
    return { clave, desc: xs[0].desc, veces: xs.length, total: suma(xs), fijo: max <= min * 1.1, categoria: xs[0].categoria, dias: dias(fechas[0], fechas[fechas.length - 1]) };
  }).sort((a, b) => b.total - a.total);
  // Cobros dobles: mismo comercio y mismo monto, el mismo día o al siguiente
  const dobles = [];
  for (const xs of Object.values(grupos)) for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) {
    if (xs[i].monto === xs[j].monto && dias(xs[i].fecha, xs[j].fecha) <= 1 && !xs[i].banco) dobles.push([xs[i], xs[j]]);
  }
  // Gastos grandes: más de 3 veces lo normal (la mediana) y al menos el 10 % de lo que salió
  const orden = gastos.map((m) => m.monto).sort((a, b) => a - b), mediana = orden.length ? orden[Math.floor(orden.length / 2)] : 0, total = suma(gastos);
  const grandes = gastos.filter((m) => m.monto >= mediana * 3 && m.monto >= total * 0.1 && !m.banco).sort((a, b) => b.monto - a.monto).slice(0, 5);
  const hormiga = gastos.filter((m) => m.monto < HORMIGA && !m.banco);
  const fechas = movs.map((m) => m.fecha).sort();
  return { gastos: total, ingresos: suma(ingresos), neto: suma(ingresos) - total, desde: fechas[0] || null, hasta: fechas[fechas.length - 1] || null,
    porCategoria, banco: { total: suma(banco), lista: banco }, repetidos, dobles, grandes, hormiga: { total: suma(hormiga), veces: hormiga.length },
    yaAnotados: movs.filter((m) => m.ya).length, internos: movs.filter((m) => m.interno).length };
}

// Lo que conviene hacer, del más importante al menos
export function consejos(a) {
  const out = [];
  if (a.dobles.length) out.push('⚠️ ' + a.dobles.length + (a.dobles.length === 1 ? ' posible cobro doble' : ' posibles cobros dobles') + ': revisa con el banco y pide el reverso si no los hiciste.');
  if (a.banco.total > 0) out.push('🏦 El banco te cobró ' + pesosCortos(a.banco.total) + ' (cuota de manejo, comisiones, 4x1000 o seguros). Pide una cuenta sin cuota de manejo y marca una sola cuenta como exenta del 4x1000 (hasta 350 UVT al mes no lo pagas).');
  // Suscripciones y fijos: el mismo valor cada mes (o algo de la categoría Suscripciones). Dos el mismo día son un cobro doble
  const subs = a.repetidos.filter((r) => r.fijo && r.dias >= 20);
  const fijos = [...subs, ...(a.porCategoria.suscripciones ? [{ desc: 'tus suscripciones', total: a.porCategoria.suscripciones, veces: 1 }] : [])];
  if (subs.length) out.push('🔁 ' + (subs.length === 1 ? 'Se repite cada mes un cobro casi igual' : 'Se repiten cada mes ' + subs.length + ' cobros casi iguales') + ' (' + subs.slice(0, 3).map((r) => r.desc).join(', ') + '): ¿lo sigues usando? Cancelar uno te ahorra ' + pesosCortos(Math.min(...subs.map((r) => r.total / r.veces))) + ' o más al mes.');
  else if (fijos.length) out.push('📺 En suscripciones se fueron ' + pesosCortos(fijos[0].total) + ': revisa cuáles usas de verdad este mes.');
  if (a.hormiga.veces >= 8) out.push('🐜 ' + a.hormiga.veces + ' gastos pequeños (menos de ' + pesosCortos(HORMIGA) + ') suman ' + pesosCortos(a.hormiga.total) + '. Ponles un tope semanal.');
  if (a.neto < 0) out.push('📉 Salió más de lo que entró: ' + pesosCortos(-a.neto) + ' de diferencia en estas fechas.');
  return out;
}
const pesosCortos = (n) => '$ ' + Math.round(n || 0).toLocaleString('es-CO');
