// Pantallas del 📆 Plan de 12 semanas (src/plan12.js): pestañas "📆 12 semanas" y "🏠 En casa" en Gym, y la tarjeta de comida en Dieta → Peso
import { e, guardar, repintar, hayFutbol } from '../estado.js';
import { iso, fechaCorta, sumarDias } from '../fechas.js';
import { esc, barra, registrar, toast, miles } from '../ui.js';
import { plan12, FASES, FIJO, SEMANAS_PLAN, semanaPlan, faseDe, proximoLunes, REVISIONES, PRUEBAS, tocaRevision, pruebaDeSemana, avancePruebas,
  gastoEstimado, kcalPromedioPlan, pesoEsperado, comoVaPeso, ultimaCintura, empezarPlan, CASA, tipoCasaDe, sesionCasa, casaHecha, ultimoCasa, tocaSubir, nivelDe } from '../plan12.js';
import { pesos, tendencia } from '../dieta.js';

const f1 = (n) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
let tipoVista = null; // día de la versión en casa que se está viendo
// En lista: queda abierto el ejercicio que toca (el primero sin reps anotadas); los demás, un renglón. manualCasa: lo abierto o cerrado a mano
let manualCasa = {}, enfocarCasa = null;

// ---------- 📆 12 semanas ----------
function empezar() {
  const p = plan12(), lunes = proximoLunes();
  return '<section class="tarjeta plan12" data-plan12><h2>📆 Plan de 12 semanas</h2>' +
    '<p>Bajar grasa y ganar músculo a la vez, con tu rutina del gym o con la versión en casa. No cambia tu rutina ni tu dieta: les pone fases, revisiones y una meta de peso realista.</p>' +
    '<ul class="lista-plan">' + FASES.map((f) => '<li><b>Semana ' + f.desde + (f.hasta > f.desde ? '-' + f.hasta : '') + ' · ' + f.nombre + '</b><span>' + esc(f.gym) + '</span></li>').join('') + '</ul>' +
    '<div class="dos"><label class="campo">Edad<input type="number" inputmode="numeric" min="14" max="90" name="edad" value="' + esc(p.edad) + '"></label>' +
    '<label class="campo">Sexo<select name="sexo"><option value="H"' + (p.sexo !== 'M' ? ' selected' : '') + '>Hombre</option><option value="M"' + (p.sexo === 'M' ? ' selected' : '') + '>Mujer</option></select></label></div>' +
    '<label class="campo">Empieza el<input type="date" name="inicio" value="' + lunes + '"></label>' +
    '<p class="nota-corta">Mejor un lunes. Ese día pésate y haz la prueba de la semana 1: es tu punto de partida.</p>' +
    '<button type="button" class="boton primario ancho" data-accion="p12-empezar">Empezar el plan</button></section>';
}

function formularioPrueba(semana) {
  const cintura = ultimaCintura();
  return '<details class="prueba-plan" open data-prueba-plan><summary>📝 Revisión de la semana ' + semana + '</summary>' +
    '<p class="nota-corta">Descansado y antes de entrenar. Cada prueba, hasta que la técnica se rompa. Tómate también una foto de frente y de lado con la misma luz.</p>' +
    '<div class="dos">' + PRUEBAS.map(([k, nombre, unidad]) => '<label class="campo">' + esc(nombre) + ' (' + unidad + ')<input type="number" inputmode="decimal" min="0" step="' + (unidad === 'cm' ? '0.5' : '1') + '" name="' + k + '"' + (k === 'cintura' && cintura ? ' value="' + cintura + '"' : '') + '></label>').join('') + '</div>' +
    '<button type="button" class="boton primario ancho" data-accion="p12-prueba" data-semana="' + semana + '">Guardar revisión</button></details>';
}

function resumenPruebas() {
  const p = plan12(), l = [...(p.pruebas || [])].sort((a, b) => a.semana - b.semana);
  if (!l.length) return '';
  const av = avancePruebas(p);
  return '<h3>Revisiones</h3><div class="tabla-scroll"><table class="tabla-plan"><thead><tr><th>Prueba</th>' + l.map((x) => '<th>S' + x.semana + '</th>').join('') + '</tr></thead><tbody>' +
    PRUEBAS.map(([k, nombre, unidad]) => '<tr><th>' + esc(nombre) + '</th>' + l.map((x) => '<td>' + (x[k] > 0 ? f1(x[k]) + (unidad === 'reps' ? '' : ' ' + unidad) : '—') + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>' +
    (av.length ? '<p class="nota-corta">Desde la primera: ' + av.map((x) => esc(x.nombre.toLowerCase()) + ' ' + (x.dif > 0 ? '+' : '') + f1(x.dif) + (x.unidad === 'reps' ? '' : ' ' + x.unidad)).join(' · ') + '.</p>' : '');
}

export function vistaPlan12(hoy = iso()) {
  const p = plan12();
  if (!p.inicio) return empezar();
  const s = semanaPlan(p, hoy);
  if (s == null) return '<section class="tarjeta plan12"><h2>📆 Plan de 12 semanas</h2><p>Empieza el <b>' + fechaCorta(p.inicio) + '</b>. Ese día pésate y haz la revisión de la semana 1.</p>' +
    '<button type="button" class="boton-suave" data-accion="p12-reiniciar">Cambiar la fecha</button></section>';
  const fin = s > SEMANAS_PLAN, f = faseDe(Math.min(s, SEMANAS_PLAN)), revision = !fin && tocaRevision(s) && !pruebaDeSemana(s), prox = REVISIONES.find((n) => n >= s && !pruebaDeSemana(n));
  return '<section class="tarjeta plan12"><div class="fila-resumen"><h2>📆 ' + (fin ? 'Plan terminado' : 'Semana ' + s + ' de ' + SEMANAS_PLAN) + '</h2>' + (f ? '<b>' + esc(f.nombre) + '</b>' : '') + '</div>' +
    barra(Math.min(1, s / SEMANAS_PLAN)) +
    '<ol class="semanas-plan" aria-label="Semanas">' + Array.from({ length: SEMANAS_PLAN }, (_, i) => {
      const n = i + 1, fa = faseDe(n);
      return '<li class="fase-' + fa.id + (n === s ? ' actual' : n < s ? ' pasada' : '') + '" title="' + esc(fa.nombre) + '">' + n + (REVISIONES.includes(n) ? '<small>📝</small>' : '') + '</li>';
    }).join('') + '</ol>' +
    (fin ? '<p>Terminaste las 12 semanas. Haz la última revisión si te falta y compárala con la primera: eso decide si repites con más carga o pasas a mantener.</p>' + (!pruebaDeSemana(12) ? formularioPrueba(12) : '')
      : '<div class="fase-hoy"><p><b>🏋️ Gym:</b> ' + esc(f.gym) + ' <small>(RIR ' + f.rir + ')</small></p><p><b>🏠 En casa:</b> ' + esc(f.casa) + '</p><p><b>🥗 Comida:</b> ' + esc(f.dieta) + '</p></div>' +
        (revision ? formularioPrueba(s) : prox ? '<p class="nota-corta">Próxima revisión: semana ' + prox + ' (' + fechaCorta(sumarDias(p.inicio, (prox - 1) * 7)) + ').</p>' : '')) +
    resumenPruebas() +
    '<details class="fijo-plan"><summary>Lo que no cambia en las 12 semanas</summary><ul>' + FIJO.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>' +
    '<p class="nota-corta">RIR = repeticiones que te guardas en la última serie. RIR 2: paras cuando todavía te salen 2 limpias.</p></details>' +
    '<p class="nota-corta">Empezó el ' + fechaCorta(p.inicio) + (p.pesoInicio ? ' con ' + f1(p.pesoInicio) + ' kg' : '') + '. <button type="button" class="boton-suave" data-accion="p12-reiniciar">Reiniciar el plan</button></p></section>';
}

// ---------- 🏠 En casa ----------
export function vistaCasa(fecha = iso()) {
  const deHoy = tipoCasaDe(fecha), tipo = tipoVista || sesionCasa(fecha).tipo || deHoy || 'torso';
  const f = faseDe(Math.min(semanaPlan() || 1, SEMANAS_PLAN)), futbol = hayFutbol(fecha) ? 'Hoy' : hayFutbol(sumarDias(fecha, 1)) ? 'Mañana' : '';
  return '<section class="tarjeta casa"><h2>🏠 Entreno en casa</h2><p class="nota-corta">Solo barra, paralelas y piso. Mismo día que el gym, con peso corporal. ' +
    (deHoy ? 'Hoy en el gym tocaba <b>' + esc(CASA[deHoy].nombre.toLowerCase()) + '</b>.' : 'Hoy no toca gym: si entrenas, que sea torso o pierna suave.') + '</p>' +
    '<nav class="chips" aria-label="Día en casa">' + Object.entries(CASA).map(([k, x]) => '<button type="button" class="chip' + (k === tipo ? ' activo' : '') + '" data-accion="casa-tipo" data-t="' + k + '">' + esc(x.nombre.split(' (')[0]) + '</button>').join('') + '</nav>' +
    (f ? '<p class="nota-corta"><b>' + esc(f.nombre) + ' (RIR ' + f.rir + '):</b> ' + esc(f.casa) + '</p>' : '') +
    (futbol && tipo === 'pierna' ? '<p class="aviso-sup">⚽ ' + futbol + ' juegas fútbol: 3 series en vez de 4 y deja 2-3 reps en reserva. Las piernas tienen que llegar frescas a la cancha.</p>' : '') +
    ejerciciosCasa(fecha, tipo) + '</section>';
}
function ejerciciosCasa(fecha, tipo) {
  const ses = sesionCasa(fecha), dia = CASA[tipo], toca = (dia.ejercicios.find((x) => !ses[x.id]) || {}).id;
  if (enfocarCasa) { const id = enfocarCasa; enfocarCasa = null; setTimeout(() => { const c = document.querySelector('[data-cambio=casa-reps][data-id="' + id + '"]'); if (c) { c.focus({ preventScroll: true }); c.scrollIntoView({ block: 'nearest' }); } }, 60); }
  return '<ol class="lista-casa">' + dia.ejercicios.map((x) => {
    const n = nivelDe(x), ult = ultimoCasa(x.id, fecha), reps = ses[x.id] || '', sube = tocaSubir(x, reps) || (!reps && ult && tocaSubir(x, ult.reps));
    const abierto = x.id in manualCasa ? manualCasa[x.id] : x.id === toca;
    const fila = '<button type="button" class="casa-fila" data-accion="casa-abrir" data-id="' + x.id + '" aria-expanded="' + abierto + '">' +
      '<span class="casa-txt"><b>' + esc(x.nombre) + '</b><small>' + esc((n + 1) + '. ' + x.escalera[n]) + (reps ? '' : ult ? ' · la vez pasada ' + esc(ult.reps) : '') + '</small></span>' +
      '<span class="casa-dato' + (reps ? ' hecho' : '') + '">' + (reps ? '✓ ' + esc(reps) : x.series + ' × ' + esc(x.reps)) + '</span>' +
      '<span class="casa-flecha" aria-hidden="true">' + (abierto ? '▾' : '▸') + '</span></button>';
    if (!abierto) return '<li class="casa-ej plegado' + (reps ? ' hecho' : '') + (sube && n < x.escalera.length - 1 ? ' sube' : '') + '" data-ancla="casa-' + x.id + '">' + fila + '</li>';
    return '<li class="casa-ej' + (x.id === toca ? ' actual' : '') + '" data-ancla="casa-' + x.id + '">' + fila +
      '<label class="campo">Variante<select data-cambio="casa-nivel" data-id="' + x.id + '">' + x.escalera.map((v, i) => '<option value="' + i + '"' + (i === n ? ' selected' : '') + '>' + (i + 1) + '. ' + esc(v) + '</option>').join('') + '</select></label>' +
      (x.nota ? '<p class="nota-corta">' + esc(x.nota) + '</p>' : '') +
      '<label class="campo">Reps de cada serie<input type="text" data-solo="reps" autocomplete="off" enterkeyhint="done" data-cambio="casa-reps" data-id="' + x.id + '" value="' + esc(reps) + '" placeholder="' + esc(ult ? ult.reps : 'Ej.: 10 9 8') + '"></label>' +
      (ult ? '<p class="nota-corta">La vez pasada (' + fechaCorta(ult.fecha) + '): ' + esc(ult.reps) + '</p>' : '') +
      (sube && n < x.escalera.length - 1 ? '<p class="aviso-sup">⬆️ Llegaste al tope en todas las series: la próxima, «' + esc(x.escalera[n + 1]) + '».</p>' : '') + '</li>';
  }).join('') + '</ol>' +
    (casaHecha(fecha) ? '<p class="rec-titulo">✅ Sesión en casa anotada: cuenta como día de gym.</p>' : '<p class="nota-corta">Anota las reps al terminar cada ejercicio. Con una sola anotada, el día cuenta como entrenado.</p>');
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
