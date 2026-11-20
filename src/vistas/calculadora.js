// Pestaña 🧮 Calcular de Finanzas: lo que la calculadora recuerda y hace. La pantalla está en
// src/react/pantallas/FinanzasCalculos.tsx; aquí queda lo escrito (calc), el teclado y los atajos del computador.
// Nada se guarda en los datos.
import { evaluar, numero } from '../calculadora.js';
import { registrar } from '../ui.js';

// Lo escrito se recuerda al cambiar de pestaña
const calc = { expr: '', monto: '', pct: '19', parte: '', total: '', cuenta: '', personas: '2', propina: '0', credito: '', tasa: '2', tipoTasa: 'mensual', meses: '12', gmf: '', conv: '', tipoConv: 'ea' };

function resultadoCalc() {
  const r = evaluar(calc.expr);
  return calc.expr.trim() ? (isFinite(r) ? '= ' + numero(r) : '…') : '0';
}
// Lo escrito en un campo, listo para leerlo. Los campos de plata se leen mientras main.js les pone los puntos de miles
// y pueden llegar a medio formatear ("6.9000", que se leía como 6,9 en vez de 69.000): sin k, M ni coma, sus puntos
// solo son de miles y se quitan
export const valorCampo = (el) => (el.dataset && 'pesos' in el.dataset && !/[kKmM,]/.test(el.value) ? el.value.replace(/\./g, '') : el.value);
// Para la pantalla: lo escrito, el resultado de la cuenta y cómo leer un campo
export const piezasCalculadora = { calc, resultadoCalc, valorCampo };

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
}

if (typeof document !== 'undefined') {
  // Cada campo de la calculadora lleva data-calc="nombre": lo escrito queda en calc
  document.addEventListener('input', (ev) => {
    const el = ev.target;
    if (el.matches && el.matches('[data-calc]')) calc[el.dataset.calc] = valorCampo(el);
  });
  document.addEventListener('change', (ev) => {
    const el = ev.target;
    if (el.matches && el.matches('select[data-calc]')) calc[el.dataset.calc] = el.value;
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
