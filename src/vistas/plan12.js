// 📆 Plan de 12 semanas (src/plan12.js): las acciones de las pestañas "📆 12 semanas" y "🏠 En casa" de Gym (la pantalla está en
// src/react/pantallas/GymPlan12.tsx; la tarjeta de comida de Dieta → Peso está en Dieta.tsx)
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { registrar, toast } from '../ui.js';
import { plan12, PRUEBAS, empezarPlan, CASA, tipoCasaDe, casaHecha, nivelDe } from '../plan12.js';

const f1 = (n) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
let tipoVista = null; // día de la versión en casa que se está viendo
// En lista: queda abierto el ejercicio que toca (el primero sin reps anotadas); los demás, un renglón. manualCasa: lo abierto o cerrado a mano
let manualCasa = {}, enfocarCasa = null;
// Lo que necesita la pantalla de React (src/react/pantallas/GymPlan12.tsx): el día en casa que se ve, lo abierto a mano y,
// después de anotar, el cursor listo en el siguiente ejercicio
export const verCasa = () => ({ tipoVista, manualCasa });
export function enfocarSiguienteCasa() {
  if (!enfocarCasa) return;
  const id = enfocarCasa; enfocarCasa = null;
  setTimeout(() => { const c = document.querySelector('[data-cambio=casa-reps][data-id="' + id + '"]'); if (c) { c.focus({ preventScroll: true }); c.scrollIntoView({ block: 'nearest' }); } }, 60);
}

registrar({
  'p12-empezar'(ds, el) {
    const caja = el.closest('[data-plan12]'), p = plan12(), inicio = caja.querySelector('[name=inicio]').value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio)) { toast('Elige la fecha de inicio'); return; }
    p.edad = Number(caja.querySelector('[name=edad]').value) || p.edad;
    p.sexo = caja.querySelector('[name=sexo]').value;
    empezarPlan(inicio, p);
    guardar();
    toast('📆 Plan listo: empieza el ' + fechaCorta(inicio));
  },
  'p12-reiniciar'() {
    if (!confirm('¿Reiniciar el plan? Se borra la fecha de inicio. Las revisiones y lo anotado en casa se quedan.')) return;
    plan12().inicio = '';
    guardar();
  },
  'p12-prueba'({ semana }, el) {
    const caja = el.closest('[data-prueba-plan]'), x = { id: 'p' + Date.now().toString(36), fecha: iso(), semana: Number(semana) };
    for (const [k] of PRUEBAS) { const v = Number(String(caja.querySelector('[name=' + k + ']').value).replace(',', '.')); if (v > 0) x[k] = v; }
    if (Object.keys(x).length <= 3) { toast('Anota al menos una prueba'); return; }
    const p = plan12();
    p.pruebas = (p.pruebas || []).filter((y) => y.semana !== x.semana).concat(x);
    // La cintura también queda en las medidas de Dieta → Peso
    if (x.cintura) { const d = (e().dias[iso()] ??= {}); d.medidas = { ...(d.medidas || {}), cintura: x.cintura }; }
    guardar();
    toast('📝 Revisión de la semana ' + x.semana + ' guardada');
  },
  'casa-tipo'({ t }) { tipoVista = t; manualCasa = {}; repintar(); },
  'casa-abrir'({ id }) { const el = document.querySelector('[data-accion=casa-abrir][data-id="' + id + '"]'); manualCasa[id] = !(el && el.getAttribute('aria-expanded') === 'true'); repintar(); },
  'casa-reps'({ id }, el) {
    const p = plan12(), hoy = iso(), ses = ((p.casa ??= {})[hoy] ??= {}), tipo = tipoVista || ses.tipo || tipoCasaDe(hoy) || 'torso';
    const v = el.value.replace(/\s+/g, ' ').trim();
    if (v) {
      ses[id] = v; ses.tipo = tipo; ses['v:' + id] = nivelDe(CASA[tipo].ejercicios.find((x) => x.id === id) || { escalera: [''] }, p);
      // Anotado: se cierra y se abre el siguiente que falta, con el cursor listo
      delete manualCasa[id];
      const sig = CASA[tipo].ejercicios.find((x) => !ses[x.id]);
      if (sig) { delete manualCasa[sig.id]; enfocarCasa = sig.id; }
    }
    else { delete ses[id]; delete ses['v:' + id]; }
    if (!casaHecha(hoy, p)) delete p.casa[hoy];
    guardar();
  },
  'casa-nivel'({ id }, el) { (plan12().nivel ??= {})[id] = Number(el.value); guardar(); },
});
