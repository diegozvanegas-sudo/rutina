// 📆 Plan de 12 semanas (src/plan12.js): las acciones de las pestañas "📆 12 semanas" y "🏠 En casa" de Gym (la pantalla está en
// src/react/pantallas/GymPlan12.tsx) y la tarjeta de comida en Dieta → Peso
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { esc, registrar, toast, miles } from '../ui.js';
import { plan12, SEMANAS_PLAN, semanaPlan, faseDe, PRUEBAS, gastoEstimado, kcalPromedioPlan, pesoEsperado, comoVaPeso, empezarPlan, CASA, tipoCasaDe, casaHecha, nivelDe } from '../plan12.js';
import { pesos, tendencia } from '../dieta.js';

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






// ---------- Dieta → Peso ----------
export function tarjetaPlanDieta(hoy = iso()) {
  const p = plan12(), peso = tendencia(pesos(e().dias)) ?? e().dieta?.config?.pesoBase, estatura = e().dieta?.config?.estatura;
  const g = gastoEstimado({ peso, estatura, edad: Number(p.edad), sexo: p.sexo }), kcal = kcalPromedioPlan(hoy);
  const s = semanaPlan(p, hoy), f = faseDe(s == null ? null : Math.min(s, SEMANAS_PLAN)), meta = pesoEsperado(p.pesoInicio, SEMANAS_PLAN), va = p.inicio ? comoVaPeso(p, hoy) : null;
  const deficit = g ? g.total - kcal : null;
  return '<section class="tarjeta plan-dieta"><h2>📆 Comida en el plan de 12 semanas</h2>' +
    (g ? '<div class="dos-num"><div><small>Gastas, más o menos</small><b>' + miles(g.total) + ' kcal</b></div><div><small>Tus planes, promedio de 7 días</small><b>' + miles(kcal) + ' kcal</b></div></div>' +
      '<p class="nota-corta">' + (deficit >= 300 && deficit <= 800 ? 'Déficit de unas ' + miles(deficit) + ' kcal al día: bien para bajar grasa sin perder músculo.' :
        deficit > 800 ? 'Déficit de unas ' + miles(deficit) + ' kcal al día: es mucho para ganar músculo a la vez. Si la fuerza baja, come más (la revisión de arriba te lo dirá).' :
        'Déficit de solo ' + miles(Math.max(0, deficit)) + ' kcal: así casi no se baja grasa. Mira la revisión de arriba antes de cambiar algo.') +
      ' El gasto es una estimación (' + (p.sexo === 'M' ? 'mujer' : 'hombre') + ', ' + esc(p.edad) + ' años, ' + estatura + ' cm, ' + f1(peso) + ' kg, 5 días de gym y fútbol): la báscula es la que manda.</p>' : '') +
    (f ? '<p><b>Semana ' + s + ' · ' + esc(f.nombre) + ':</b> ' + esc(f.dieta) + '</p>' : !p.inicio ? '<p class="nota-corta">Cuando empieces el plan en Gym → 📆 12 semanas, aquí verás qué hacer con la comida en cada fase.</p>' : '') +
    (meta ? '<p class="nota-corta">Meta realista a la semana 12: <b>' + f1(meta.max) + ' a ' + f1(meta.min) + ' kg</b> (empezaste con ' + f1(p.pesoInicio) + '). Más rápido que eso suele ser músculo y agua.</p>' : '') +
    (va && va.estado !== 'pronto' ? '<p class="' + (va.estado === 'bien' ? 'rec-titulo' : 'aviso-sup') + '">' + (va.estado === 'bien' ? '✅ Vas en el rango esperado' : va.estado === 'lento' ? '🐢 Vas por encima del rango' : '⚡ Vas más rápido de lo sano') + ' (' + f1(va.ahora) + ' kg; esperado ' + f1(va.esperado.max) + ' a ' + f1(va.esperado.min) + ').</p>' : '') +
    '</section>';
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
