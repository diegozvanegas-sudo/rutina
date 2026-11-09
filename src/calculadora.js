// Calculadora de Finanzas: cuentas sueltas y las que salen seguido (porcentajes, dividir la cuenta, cuota de un crédito, 4x1000).
// Solo cálculos: nada se guarda en los datos.

// "1.234.567,5" → 1234567.5 · "1.5" → 1.5 · "25k" → 25000 · "1,5M" → 1500000
export function leerNumero(texto) {
  let s = String(texto ?? '').trim().toLowerCase().replace(/\$|\s/g, '');
  if (!s) return NaN;
  const mult = /m$/.test(s) ? 1e6 : /k$/.test(s) ? 1e3 : 1;
  s = s.replace(/[km]$/, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if ((s.match(/\./g) || []).length > 1 || /^\d{1,3}\.\d{3}$/.test(s)) s = s.replace(/\./g, '');
  const n = /^\d*\.?\d+$|^\d+\.$/.test(s) ? Number(s) : NaN;
  return n * mult;
}

// Lo que se escribe en la calculadora: + − × ÷ ( ) y %.
// "200.000 + 19 %" suma el 19 % de 200.000; "50 % × 80" es la mitad de 80. Devuelve NaN si la cuenta está incompleta.
export function evaluar(texto) {
  const fuente = String(texto || '').replace(/[×xX*]/g, '*').replace(/[÷:/]/g, '/').replace(/[−–]/g, '-');
  const tokens = fuente.match(/[\d.,]+[kKmM]?|[-+*/()%]|\S/g) || [];
  let i = 0;
  const ver = () => tokens[i], tomar = () => tokens[i++];
  function factor() {
    const t = tomar();
    if (t === '-') return -factor();
    if (t === '+') return factor();
    let v;
    if (t === '(') { v = suma(); if (ver() === ')') tomar(); }
    else v = leerNumero(t);
    return v;
  }
  // Un término que termina en % devuelve la fracción y se marca, para que la suma lo tome como "% de lo anterior"
  function termino() {
    let v = factor(), esPct = false;
    if (ver() === '%') { tomar(); v /= 100; esPct = true; }
    while (ver() === '*' || ver() === '/') {
      const op = tomar();
      let w = factor();
      if (ver() === '%') { tomar(); w /= 100; }
      v = op === '*' ? v * w : v / w;
      esPct = false;
    }
    return { v, esPct };
  }
  function suma() {
    let { v } = termino();
    while (ver() === '+' || ver() === '-') {
      const op = tomar(), t = termino(), w = t.esPct ? v * t.v : t.v;
      v = op === '+' ? v + w : v - w;
    }
    return v;
  }
  if (!tokens.length) return NaN;
  const r = suma();
  return i < tokens.length || !isFinite(r) ? NaN : r;
}

// Número para mostrar: miles con punto y hasta 2 decimales con coma
export const numero = (n, dec = 2) => (isFinite(n) ? Number(n).toLocaleString('es-CO', { maximumFractionDigits: dec }) : '—');

// Porcentajes
export const porcentajeDe = (p, x) => (x * p) / 100;
export const queTanto = (parte, total) => (total ? (parte / total) * 100 : NaN);
export const conAumento = (x, p) => x * (1 + p / 100);
export const conDescuento = (x, p) => x * (1 - p / 100);
// Si el precio ya trae el IVA (o el aumento) incluido: cuánto era antes
export const sinIncluido = (x, p) => x / (1 + p / 100);

// Dividir la cuenta entre varios, con propina opcional
export function dividir(total, personas, propina = 0) {
  const n = Math.max(1, Math.floor(personas || 1)), conPropina = total * (1 + (propina || 0) / 100);
  return { total: conPropina, propina: conPropina - total, porPersona: conPropina / n };
}

// Cuota fija mensual de un crédito (sistema francés)
export function cuotaCredito(monto, tasaMensual, meses) {
  const n = Math.floor(meses || 0), r = (tasaMensual || 0) / 100;
  if (!(monto > 0) || !(n > 0)) return null;
  const cuota = r ? (monto * r) / (1 - (1 + r) ** -n) : monto / n;
  return { cuota, total: cuota * n, intereses: cuota * n - monto };
}
// Tasa efectiva anual ↔ mensual (en %)
export const mensualDeAnual = (ea) => ((1 + ea / 100) ** (1 / 12) - 1) * 100;
export const anualDeMensual = (m) => ((1 + m / 100) ** 12 - 1) * 100;

// Gravamen a los movimientos financieros: $4 por cada $1.000
export const cuatroPorMil = (monto) => (monto * 4) / 1000;
