// Pestaña 🧮 Calcular de Finanzas: una calculadora con teclado y las cuentas que salen seguido.
// Todo se recalcula mientras se escribe, sin repintar (así no se pierde el cursor). Nada se guarda en los datos.
import { evaluar, leerNumero, numero, porcentajeDe, queTanto, conAumento, conDescuento, sinIncluido, dividir, cuotaCredito, mensualDeAnual, anualDeMensual, cuatroPorMil } from '../calculadora.js';
import { pesos } from '../finanzas.js';
import { esc, registrar } from '../ui.js';

// Lo escrito se recuerda al cambiar de pestaña
const calc = { expr: '', monto: '', pct: '19', parte: '', total: '', cuenta: '', personas: '2', propina: '0', credito: '', tasa: '2', tipoTasa: 'mensual', meses: '12', gmf: '' };
const num = (k) => { const n = leerNumero(calc[k]); return isFinite(n) ? n : 0; };
const fila = (titulo, valor, clase = '') => '<li><span>' + titulo + '</span><b class="' + clase + '">' + valor + '</b></li>';
const lista = (filas) => '<ul class="lista-pesos calc-lista">' + filas.join('') + '</ul>';

function resultadoCalc() {
  const r = evaluar(calc.expr);
  return calc.expr.trim() ? (isFinite(r) ? '= ' + numero(r) : '…') : '0';
}
const SALIDAS = {
  porcentaje() {
    const x = num('monto'), p = num('pct');
    if (!x || !p) return '<p class="nota-corta">Escribe un valor y un porcentaje.</p>';
    return lista([
      fila(numero(p) + ' % de ' + pesos(x), pesos(porcentajeDe(p, x))),
      fila(pesos(x) + ' + ' + numero(p) + ' %', pesos(conAumento(x, p))),
      fila(pesos(x) + ' − ' + numero(p) + ' %', pesos(conDescuento(x, p))),
      fila('Si ' + pesos(x) + ' ya incluye el ' + numero(p) + ' %, sin él era', pesos(sinIncluido(x, p)) + ' <small>(el ' + numero(p) + ' % era ' + pesos(x - sinIncluido(x, p)) + ')</small>'),
    ]);
  },
  proporcion() {
    const a = num('parte'), b = num('total'), q = queTanto(a, b);
    return a && b ? lista([fila(pesos(a) + ' es de ' + pesos(b), numero(q, 1) + ' %')]) : '';
  },
  dividir() {
    const t = num('cuenta'), n = Math.max(1, Math.floor(num('personas') || 1)), d = dividir(t, n, num('propina'));
    if (!t) return '<p class="nota-corta">Escribe el total de la cuenta.</p>';
    return lista([
      ...(d.propina ? [fila('Propina', pesos(d.propina)), fila('Total con propina', pesos(d.total))] : []),
      fila('Cada uno (' + n + ')', pesos(d.porPersona), 'verde'),
    ]);
  },
  credito() {
    const m = num('credito'), t = num('tasa'), mensual = calc.tipoTasa === 'anual' ? mensualDeAnual(t) : t, c = cuotaCredito(m, mensual, num('meses'));
    const equivale = t ? '<p class="nota-corta">' + (calc.tipoTasa === 'anual' ? numero(t) + ' % E.A. = ' + numero(mensual) + ' % mensual.' : numero(t) + ' % mensual = ' + numero(anualDeMensual(t)) + ' % E.A.') + '</p>' : '';
    if (!c) return equivale + '<p class="nota-corta">Escribe cuánto te prestan y a cuántos meses.</p>';
    return equivale + lista([
      fila('Cuota fija al mes', pesos(c.cuota), 'verde'),
      fila('Pagas en total', pesos(c.total)),
      fila('De eso son intereses', pesos(c.intereses), c.intereses > 0 ? 'rojo' : ''),
    ]) + '<p class="nota-corta">Sin seguros ni cuota de manejo: con ellos la cuota real sale más alta. Pregunta siempre la tasa E.A. y compárala.</p>';
  },
  gmf() {
    const m = num('gmf');
    if (!m) return '<p class="nota-corta">El 4x1000 es $ 4 por cada $ 1.000 que sale de una cuenta que no está marcada como exenta.</p>';
    return lista([
      fila('4x1000 de ' + pesos(m), pesos(cuatroPorMil(m))),
      fila('Para que lleguen ' + pesos(m) + ' completos, saca', pesos(m / 0.996)),
    ]);
  },
};
const salida = (k) => '<div data-calc-salida="' + k + '">' + SALIDAS[k]() + '</div>';
function refrescar() {
  const r = document.getElementById('calc-resultado');
  if (r) r.textContent = resultadoCalc();
  document.querySelectorAll('[data-calc-salida]').forEach((el) => { el.innerHTML = SALIDAS[el.dataset.calcSalida](); });
}

const campo = (titulo, k, dinero = true) =>
  '<label class="campo">' + titulo + '<input type="text" inputmode="' + (dinero ? 'numeric' : 'decimal') + '"' + (dinero ? ' data-pesos' : '') + ' data-calc="' + k + '" value="' + esc(calc[k]) + '" autocomplete="off"></label>';
const TECLAS = ['C', '⌫', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '000', ',', '='];

export function vistaCalculadora() {
  return '<div class="calc-rejilla"><section class="tarjeta calc"><h2>🧮 Calculadora</h2>' +
    '<input id="calc-expr" class="calc-pantalla" type="text" inputmode="none" data-calc="expr" value="' + esc(calc.expr) + '" placeholder="0" autocomplete="off" aria-label="Cuenta">' +
    '<p id="calc-resultado" class="calc-resultado" aria-live="polite">' + resultadoCalc() + '</p>' +
    '<div class="calc-teclado">' + TECLAS.map((t) => '<button type="button" class="boton ' + (t === '=' ? 'primario' : /\d/.test(t) || t === ',' ? 'secundario' : 'secundario calc-op') + '" data-accion="calc-tecla" data-t="' + t + '">' + t + '</button>').join('') + '</div>' +
    '<button type="button" class="boton secundario ancho" data-accion="calc-usar">➕ Registrar este valor como gasto o ingreso</button>' +
    '<p class="nota-corta">"200.000 + 19 %" suma el 19 % · "80.000 − 10 %" descuenta · también sirven 25k y 1,5M. En el computador puedes escribir con el teclado, con paréntesis.</p></section>' +
    '<section class="tarjeta"><h2>％ Porcentajes</h2><div class="dos">' + campo('Valor', 'monto') + campo('Porcentaje %', 'pct', false) + '</div>' + salida('porcentaje') +
    '<h3 class="calc-sub">¿Qué porcentaje es?</h3><div class="dos">' + campo('Esto', 'parte') + campo('De esto', 'total') + '</div>' + salida('proporcion') + '</section>' +
    '<section class="tarjeta"><h2>🍽️ Dividir la cuenta</h2><div class="dos">' + campo('Total', 'cuenta') + campo('Personas', 'personas', false) + '</div>' +
    campo('Propina %', 'propina', false) + salida('dividir') + '</section>' +
    '<section class="tarjeta"><h2>🏦 Cuota de un crédito</h2><div class="dos">' + campo('Te prestan', 'credito') + campo('Meses', 'meses', false) +
    campo('Tasa %', 'tasa', false) + '<label class="campo">La tasa es<select data-calc="tipoTasa">' +
    [['mensual', 'Mensual (M.V.)'], ['anual', 'Anual (E.A.)']].map(([v, t]) => '<option value="' + v + '"' + (calc.tipoTasa === v ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></label></div>' +
    salida('credito') + '</section>' +
    '<section class="tarjeta"><h2>🧾 4x1000</h2>' + campo('Monto que sale de la cuenta', 'gmf') + salida('gmf') + '</section></div>';
}

function tecla(t) {
  const el = document.getElementById('calc-expr');
  let v = calc.expr;
  if (t === 'C') v = '';
  else if (t === '⌫') v = v.replace(/\s*\S\s*$/, '');
  else if (t === '=') { const r = evaluar(v); if (!isFinite(r)) return; v = numero(r); }
  else if (/[÷×−+%]/.test(t)) v = v.replace(/\s+$/, '') + ' ' + t + ' ';
  else {
    v += t;
    // El número que se está escribiendo lleva sus puntos de miles ("1000000" → "1.000.000")
    v = v.replace(/(\d[\d.]*)(,\d*)?$/, (todo, ent, dec) => ent.replace(/\./g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (dec || ''));
  }
  calc.expr = v;
  if (el) el.value = v;
  refrescar();
}

if (typeof document !== 'undefined') {
  document.addEventListener('input', (ev) => {
    const el = ev.target;
    if (!el.matches || !el.matches('[data-calc]')) return;
    calc[el.dataset.calc] = el.value;
    refrescar();
  });
  document.addEventListener('change', (ev) => {
    const el = ev.target;
    if (el.matches && el.matches('select[data-calc]')) { calc[el.dataset.calc] = el.value; refrescar(); }
  });
  // En el computador: Enter = resultado, Escape = borrar
  document.addEventListener('keydown', (ev) => {
    if (ev.target.id !== 'calc-expr') return;
    if (ev.key === 'Enter') { ev.preventDefault(); ev.stopImmediatePropagation(); tecla('='); }
    else if (ev.key === 'Escape') tecla('C');
  }, true);
}

registrar({
  'calc-tecla'({ t }) { tecla(t); },
});
// El valor de la calculadora (para llevarlo a Registrar)
export const valorCalculadora = () => { const r = evaluar(calc.expr); return isFinite(r) && r > 0 ? Math.round(r) : 0; };
