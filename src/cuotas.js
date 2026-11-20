// 💳 Cuotas de la tarjeta de crédito y quién paga qué (Finanzas → 🏦 Extracto). Sin pantalla, para poder probarlo.
// Cómo cobran los bancos en Colombia una compra a cuotas: el capital se reparte igual en las n cuotas (valor / n) y cada mes
// se cobra el interés sobre lo que falta por pagar (saldo × tasa mensual). Por eso la primera cuota es la más cara.
// Es un cálculo aproximado: el banco puede cobrar el primer interés por días, seguros o cuota de manejo aparte.
// Compra: { id, desc, fecha, original, n, k (la cuota que se cobra en este extracto), tasa (mensual %), quien: [nombres] }
import { mensualDeAnual } from './calculadora.js';
import { claveDe } from './extracto.js';

const r2 = (x) => Math.round(x);

// "3/12", "03 / 12", "3 de 12", "cuota 3 de 12" (sin la fecha: quítala antes). null si no hay
export function leerCuotas(texto) {
  const x = String(texto || '').match(/(?:cuota\s*)?\b(\d{1,2})\s*(?:\/|de)\s*(\d{1,2})\b(?![/.,]\d)/i);
  if (!x) return null;
  const k = +x[1], n = +x[2];
  return n >= 1 && n <= 72 && k >= 0 && k <= n ? { k, n, texto: x[0] } : null;
}
// Las tasas de la línea: "1,2600 %", "16,2130 %", "1,89", "24,88 % EA". Hasta 6 es mensual; más (o con EA), efectiva anual.
// Muchos extractos traen las dos (mensual y E.A.): manda la mensual. Solo números sueltos: el "20" de "20.000.000,00" o
// "1.500" (mil quinientos pesos) no son tasas. Sin %, solo con coma decimal o 2 o 4 decimales con punto.
// Devuelve { mensual, textos: [todo lo que era tasa, para quitarlo antes de buscar los montos] } o null
export function leerTasa(texto) {
  const re = /(?<![\d.,])(\d{1,2})([.,])(\d{1,4})(?![.,]?\d)(\s*%)?(\s*(?:e\.?\s?a\.?|m\.?\s?v\.?))?/gi, tasas = [];
  for (const x of String(texto || '').matchAll(re)) {
    const conPct = !!x[4], marca = (x[5] || '').trim();
    if (!conPct && !marca && !(x[2] === ',' || x[3].length === 2 || x[3].length === 4)) continue;
    const v = Number(x[1] + '.' + x[3]);
    // 0 también es una tasa: las compras "sin intereses" (0,00 %)
    if (!(v >= 0 && v < 60)) continue;
    tasas.push({ v, ea: /e/i.test(marca) || (!/m/i.test(marca) && v > 6), texto: x[0] });
  }
  if (!tasas.length) return null;
  const m = tasas.find((t) => !t.ea), a = tasas.find((t) => t.ea);
  return { mensual: m ? m.v : mensualDeAnual(a.v), ea: a ? a.v : null, textos: tasas.map((t) => t.texto) };
}

// El plan completo de una compra: cada cuota con su capital, interés y lo que queda
export function planCuotas(original, n, tasaMensual = 0) {
  if (!(original > 0) || !(n >= 1)) return [];
  const capital = original / n, r = (tasaMensual || 0) / 100, out = [];
  for (let j = 1; j <= n; j++) {
    const antes = original - capital * (j - 1), interes = n === 1 ? 0 : antes * r;
    out.push({ cuota: j, capital, interes, total: capital + interes, saldo: Math.max(0, antes - capital) });
  }
  return out;
}

// Lo de una compra en este extracto: la cuota k y lo que falta después de pagarla
// cargo: lo que el extracto dice que se cobra este mes por la compra. Si lo trae, manda: el interés del mes es el cargo menos
// el capital, y sin tasa escrita se saca de ahí (interés / lo que se debía) para estimar los intereses que faltan
export function tasaDeCargo(c) {
  const k = Math.min(Math.max(1, c.k || 1), c.n || 1), capital = c.original / c.n, antes = c.original - capital * (k - 1);
  return c.cargo > capital * 1.005 && antes > 0 && c.n > 1 ? ((c.cargo - capital) / antes) * 100 : null;
}
export function detalleCompra(c) {
  const k = Math.min(Math.max(1, c.k || 1), c.n || 1), deCargo = tasaDeCargo(c), tasa = c.tasa || deCargo || 0;
  const plan = planCuotas(c.original, c.n, tasa), este = plan[k - 1] && { ...plan[k - 1] };
  if (!este) return null;
  // Muchos bancos ponen en la línea solo el capital de la cuota (20.000.000 / 60 = 333.333,33) y cobran el interés aparte:
  // si el cargo es el capital, el interés sale de la tasa. Si es más, el cargo ya trae el interés y manda el del banco
  const cargoEsCapital = c.cargo > 0 && Math.abs(c.cargo - este.capital) <= Math.max(2, este.capital * 0.005);
  if (c.cargo > 0 && !cargoEsCapital && c.cargo > este.capital) { este.interes = c.cargo - este.capital; este.total = c.cargo; plan[k - 1] = este; }
  const despues = plan.slice(k);
  const interesesFaltan = despues.reduce((s, x) => s + x.interes, 0), interesesTotal = plan.reduce((s, x) => s + x.interes, 0);
  return { k, n: c.n, capital: este.capital, interes: este.interes, mes: este.total, saldo: este.saldo, cuotasFaltan: c.n - k,
    interesesFaltan, interesesTotal, totalCompra: c.original + interesesTotal, pagado: plan.slice(0, k).reduce((s, x) => s + x.total, 0),
    faltaPagar: este.saldo + interesesFaltan, ultima: k === c.n, tasa, tasaDe: c.tasaLeida ? 'extracto' : c.tasa ? 'tarjeta' : deCargo ? 'cargo' : null, delExtracto: c.cargo > 0 && este.total === c.cargo, cargoEsCapital, plan };
}

// ---------- Quién paga ----------
// Cada compra se divide por partes iguales entre sus personas (sin nadie elegido, es de la primera: "Yo")
export function quienDe(c, personas) {
  const q = (c.quien || []).filter((x) => personas.includes(x));
  return q.length ? q : [personas[0] || 'Yo'];
}
export function porPersona(compras, personas) {
  const out = Object.fromEntries(personas.map((p) => [p, { nombre: p, mes: 0, capital: 0, interes: 0, saldo: 0, interesesFaltan: 0, faltaPagar: 0, compras: [] }]));
  for (const c of compras) {
    const d = detalleCompra(c);
    if (!d) continue;
    const quien = quienDe(c, personas), parte = 1 / quien.length;
    for (const q of quien) {
      const x = out[q];
      x.mes += d.mes * parte; x.capital += d.capital * parte; x.interes += d.interes * parte; x.saldo += d.saldo * parte;
      x.interesesFaltan += d.interesesFaltan * parte; x.faltaPagar += d.faltaPagar * parte;
      x.compras.push({ c, d, parte, compartida: quien.length > 1, con: quien.filter((y) => y !== q) });
    }
  }
  return personas.map((p) => out[p]);
}

// El detalle de una persona para mandarle por WhatsApp
const $ = (n) => '$ ' + r2(n || 0).toLocaleString('es-CO');
export function textoPersona(x, { tarjeta = 'la tarjeta', mes = '' } = {}) {
  const lineas = ['💳 *' + x.nombre + '* · ' + tarjeta + (mes ? ' · ' + mes : ''), '', 'Este mes: *' + $(x.mes) + '* (' + $(x.capital) + ' de capital + ' + $(x.interes) + ' de intereses)'];
  if (x.faltaPagar > 0) lineas.push('Después de este pago te falta: ' + $(x.faltaPagar) + ' (' + $(x.saldo) + ' de capital + ' + $(x.interesesFaltan) + ' de intereses)');
  lineas.push('');
  for (const { c, d, parte, con } of x.compras) {
    const pedazo = parte < 1 ? ' (tu parte: ' + Math.round(parte * 100) + ' %, con ' + con.join(', ') + ')' : '';
    lineas.push('• ' + c.desc + ' · ' + $(c.original * parte) + pedazo);
    lineas.push('   Cuota ' + d.k + ' de ' + d.n + ': ' + $(d.mes * parte) + (d.interes ? ' (interés ' + $(d.interes * parte) + ')' : '') + (d.ultima ? ' · ¡última!' : ' · faltan ' + d.cuotasFaltan + ', ' + $(d.faltaPagar * parte)));
  }
  return lineas.join('\n');
}

// ---------- Del extracto a las compras ----------
// Clave de una compra para recordar quién la paga entre un extracto y el siguiente: fecha, comercio y valor original
export const claveCompra = (c) => c.fecha + '|' + claveDe(c.desc) + '|' + Math.round(c.original);
// Movimientos del extracto (src/extracto.js) → compras de la tarjeta. guardadas: fin.compras (lo corregido y quién paga)
// reglas: fin.reglasQuien (comercio → personas) · tasa: la mensual de la tarjeta para las que no la traen
export function comprasDe(movs, { guardadas = {}, reglas = {}, tasa = 0 } = {}) {
  return movs.filter((m) => m.tipo === 'gasto' && !m.interno && !m.banco).map((m) => {
    const cu = m.cuotas || null, base = { id: m.id, desc: m.desc, fecha: m.fecha, original: cu && cu.original ? cu.original : m.monto, n: cu ? cu.n : 1, k: cu ? Math.max(1, cu.k) : 1,
      tasa: cu && cu.tasa != null ? cu.tasa : cu && cu.n > 1 ? tasa : 0, tasaLeida: !!(cu && cu.tasa != null), cargo: cu && cu.original !== m.monto ? m.monto : null };
    // La clave sale de lo leído (no de lo corregido): así se encuentra igual en el próximo extracto
    const clave = claveCompra(base), g = guardadas[clave] || {};
    return { ...base, clave, ...('n' in g ? { n: g.n } : {}), ...('k' in g ? { k: g.k } : {}), ...('original' in g ? { original: g.original } : {}), ...('tasa' in g ? { tasa: g.tasa } : {}),
      quien: g.quien || reglas[claveDe(m.desc)] || null };
  });
}
