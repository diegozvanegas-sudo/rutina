// 🧑‍🏫 Mi entrenador (lado del cliente): unirse con el código, usar el plan que publica, mandarle el check-in y
// compartirle el avance. La lógica está en src/coach.js y las funciones de la nube en supabase/esquema.sql.
import { e, guardar, repintar, semanaActual } from '../estado.js';
import { esc, registrar, toast } from '../ui.js';
import { iso, fechaCorta } from '../fechas.js';
import { configurada, nube, llamar } from '../nube.js';
import { aplicarPlan, volverAntes, planNuevo, resumenAvance } from '../coach.js';
import { semanaDeCiclo, OBJETIVOS_CLIENTE, PREGUNTAS_CHECKIN } from '../clientes.js';

let codigoLink = '', cargando = false, ultimoUsuario = null, ultimaCarga = 0;
const mi = () => (e().miEntrenador ??= { lista: [], aplicado: {}, checkins: [] });
const kg = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const cuantos = (n, uno, varios) => n + ' ' + (n === 1 ? uno : varios);
const fecha = (ms) => (ms ? fechaCorta(iso(new Date(Number(ms)))) : '');

// Trae de la nube los planes de sus entrenadores (al entrar, al volver a la app y cada 10 minutos)
export async function cargarMiEntrenador(forzar = false) {
  if (!configurada || !nube.usuario || !navigator.onLine || cargando) return;
  if (!forzar && Date.now() - ultimaCarga < 10 * 60 * 1000 && ultimoUsuario === nube.usuario.id) return;
  cargando = true;
  try {
    const lista = await llamar('rutina_cliente_planes');
    const m = mi(), antes = JSON.stringify(m.lista);
    m.lista = (lista || []).map((x) => ({ id: x.id, entrenador: x.entrenador, aceptado: x.aceptado, plan: x.plan, plan_version: x.plan_version }));
    ultimaCarga = Date.now(); ultimoUsuario = nube.usuario.id;
    if (JSON.stringify(m.lista) !== antes) guardar(); else repintar();
    if (m.lista.length) compartirAvance();
  } catch (err) { /* sin las funciones en la nube o sin conexión: queda lo último guardado */ }
  cargando = false;
}
// Manda el resumen a sus entrenadores (a lo sumo cada 5 minutos, salvo que se pida: check-in, usar el plan, "Compartir ahora")
export async function compartirAvance(forzar = false) {
  const m = mi();
  if (!m.lista.length || !nube.usuario || !navigator.onLine) return false;
  if (!forzar && m.compartido && Date.now() - m.compartido < 5 * 60 * 1000) return false;
  try {
    await llamar('rutina_cliente_compartir', { p_resumen: resumenAvance(e(), semanaActual()) });
    m.compartido = Date.now();
    guardar(false);
    return true;
  } catch (err) { if (forzar) toast('⚠️ ' + err.message); return false; }
}
if (typeof window !== 'undefined') {
  // Al entrar con una cuenta, al volver a la app y cada minuto revisa si toca traer el plan
  setInterval(() => { if (nube.usuario && nube.usuario.id !== ultimoUsuario) cargarMiEntrenador(true); }, 3000);
  setInterval(() => { cargarMiEntrenador(); if (tieneEntrenador() && document.visibilityState === 'visible') compartirAvance(); }, 60 * 1000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') cargarMiEntrenador(); });
}

// El menú muestra "Mi entrenador" solo a quien tiene uno (o el rol cliente); por enlace se abre siempre
export const tieneEntrenador = () => !!(e().miEntrenador && e().miEntrenador.lista && e().miEntrenador.lista.length);

function unirse() {
  return '<section class="tarjeta"><h2>🔑 Unirme a mi entrenador</h2>' +
    '<p class="nota-corta">Escribe el código que te mandó tu entrenador. Desde ese momento recibes su plan aquí y él ve un resumen de tu avance: series por semana, peso, sueño, fuerza y tus check-ins. El administrador de la app también puede verlo. <b>Nadie ve el resto de tus datos.</b> Puedes dejar de compartir cuando quieras.</p>' +
    (!configurada ? '<p class="aviso">Esta versión de la app no tiene la nube configurada.</p>' : !nube.usuario ? '<p class="aviso">Inicia sesión primero (⚙️ Ajustes).</p>' : '') +
    '<div class="cl-agregar"><input type="text" id="ent-codigo" value="' + esc(codigoLink) + '" placeholder="Ej.: F9110E" maxlength="10" autocomplete="off" autocapitalize="characters" aria-label="Código del entrenador" data-enter="ent-unirme" enterkeyhint="go">' +
    '<button type="button" class="boton primario" data-accion="ent-unirme"' + (!nube.usuario ? ' disabled' : '') + '>Unirme</button></div></section>';
}

function tarjetaPlan(a) {
  const p = a.plan, m = mi(), nuevo = planNuevo(e(), a), usado = (m.aplicado || {})[a.id], w = p && p.ciclo ? semanaDeCiclo(p.ciclo) : null, o = p && OBJETIVOS_CLIENTE[p.objetivo];
  return '<section class="tarjeta"><h2>🧑‍🏫 ' + esc(a.entrenador || 'Tu entrenador') + '</h2>' +
    '<p class="nota-corta">Desde el ' + (a.aceptado ? fechaCorta(String(a.aceptado).slice(0, 10)) : '') + (o ? ' · ' + o[0] : '') + '</p>' +
    (!p ? '<p class="nota-corta">Aún no te ha mandado el plan. Te aparece aquí apenas lo publique.</p>'
      : (nuevo ? '<div class="aviso">📬 ' + (usado ? 'Te mandó una versión nueva del plan' : 'Te mandó tu plan') + ' (' + fecha(a.plan_version) + '): ' + cuantos(p.rutina.filter((d) => d.id !== 'core' && d.ejercicios.length).length, 'día', 'días') + ' de gym · ' + cuantos(Object.keys((p.dieta && p.dieta.planes) || {}).length, 'plan', 'planes') + ' de comida.</div>' +
          '<button type="button" class="boton primario ancho" data-accion="ent-usar" data-id="' + esc(a.id) + '">✓ Usar este plan</button>' +
          '<p class="nota-corta">Reemplaza tu rutina del Gym y tus planes de comida (tu core se queda). Lo de ahora queda guardado para volver.</p>'
        : '<p>✓ Estás usando su plan del <b>' + fecha(a.plan_version) + '</b>. Míralo en 🏋️ Gym y 🥗 Dieta.</p>') +
        (w && w.n ? '<p class="nota-corta">📆 Semana <b>' + w.n + '</b> del ciclo · fase <b>' + esc(w.fase.nombre) + '</b> (reps en reserva ' + esc(w.fase.rir) + '): ' + esc(w.fase.objetivo) + '</p>' : w && w.antes ? '<p class="nota-corta">📆 Tu ciclo empieza el ' + fechaCorta(p.ciclo.inicio) + '.</p>' : '') +
        (p.nota ? '<p class="nota-corta">📝 ' + esc(p.nota) + '</p>' : '')) +
    (m.antes ? '<button type="button" class="enlace" data-accion="ent-volver">↶ Volver a mi rutina y mis comidas de antes (' + fechaCorta(m.antes.fecha) + ')</button>' : '') + '</section>';
}

function checkin() {
  const m = mi(), ult = (m.checkins || []).slice(-1)[0];
  const num = (id, titulo, ph, modo = 'decimal') => '<label class="campo">' + titulo + '<input type="text" inputmode="' + modo + '" id="' + id + '" placeholder="' + ph + '" autocomplete="off" enterkeyhint="next"></label>';
  return '<section class="tarjeta"><h2>✅ Check-in de la semana</h2>' + (ult ? '<p class="nota-corta">El último lo mandaste el ' + fechaCorta(ult.fecha) + '.</p>' : '') + '<div class="dos">' +
    num('mck-peso', 'Peso en ayunas (kg)', 'Ej.: 72,5') + num('mck-sueno', 'Sueño (1-5)', '1 a 5', 'numeric') + num('mck-energia', 'Energía (1-5)', '1 a 5', 'numeric') +
    num('mck-entreno', 'Entrenos hechos', 'Ej.: 4', 'numeric') + num('mck-comida', 'Plan de comida (%)', 'Ej.: 80', 'numeric') + '</div>' +
    '<label class="campo">' + esc(PREGUNTAS_CHECKIN[5][1].replace(/^📝 /, '')) + '<input type="text" id="mck-nota" autocomplete="off" data-enter="ent-checkin" enterkeyhint="send"></label>' +
    '<button type="button" class="boton primario ancho" data-accion="ent-checkin">📤 Mandar check-in</button></section>';
}

export function vistaEntrenador() {
  const m = mi();
  return '<h1>Mi entrenador</h1>' + (m.lista.length ? m.lista.map(tarjetaPlan).join('') + checkin() +
    '<section class="tarjeta"><h2>🔄 Lo que compartes</h2><p class="nota-corta">Series por semana, peso, sueño promedio, cómo va tu fuerza y tus check-ins, con tu entrenador (y el administrador de la app). Se manda solo cada vez que abres la app' +
      (m.compartido ? ' (la última: ' + fechaCorta(iso(new Date(m.compartido))) + ')' : '') + '.</p>' +
    '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="ent-compartir">🔄 Compartir ahora</button>' +
      m.lista.map((a) => '<button type="button" class="boton secundario rec-borrar" data-accion="ent-salir" data-id="' + esc(a.id) + '">Dejar de compartir con ' + esc((a.entrenador || '').split('@')[0]) + '</button>').join('') + '</div></section>' + unirse()
    : unirse());
}

registrar({
  'abrir-entrenador'({ p }) { codigoLink = String(p || '').toUpperCase().slice(0, 10); },
  async 'ent-unirme'() {
    const campo = document.getElementById('ent-codigo'), codigo = (campo ? campo.value : '').trim();
    if (!codigo) { toast('Escribe el código de tu entrenador'); return; }
    if (!confirm('¿Unirte a este entrenador?\n\nVa a ver un resumen de tu avance: series por semana, peso, sueño, fuerza y tus check-ins (el administrador de la app también puede verlo). Nadie ve el resto de tus datos. Puedes dejar de compartir cuando quieras.')) return;
    try {
      const r = await llamar('rutina_cliente_aceptar', { p_codigo: codigo });
      codigoLink = '';
      toast('🤝 Listo: ahora entrenas con ' + (r && r.entrenador ? r.entrenador : 'tu entrenador'));
      await cargarMiEntrenador(true);
      compartirAvance(true);
    } catch (err) { toast('⚠️ ' + err.message); }
  },
  'ent-usar'({ id }) {
    const a = mi().lista.find((x) => x.id === id);
    if (!a || !confirm('¿Usar el plan de tu entrenador?\n\nReemplaza tu rutina del Gym y tus planes de comida. Lo de ahora queda guardado y puedes volver a él.')) return;
    const r = aplicarPlan(e(), a);
    guardar();
    if (r) compartirAvance(true);
    if (r) toast('✓ Plan listo: ' + cuantos(r.dias, 'día', 'días') + ' en 🏋️ Gym y ' + cuantos(r.planes, 'plan', 'planes') + ' en 🥗 Dieta');
  },
  'ent-volver'() {
    if (!confirm('¿Volver a tu rutina y tus comidas de antes de usar el plan del entrenador?')) return;
    if (volverAntes(e())) { guardar(); toast('↶ Volviste a tu rutina de antes'); }
  },
  async 'ent-checkin'() {
    const v = (id) => (document.getElementById(id) || { value: '' }).value.trim(), n = (id) => { const x = Number(v(id).replace(',', '.')); return v(id) && Number.isFinite(x) ? x : null; };
    const x = { id: 'ck' + Date.now().toString(36), fecha: iso(), peso: n('mck-peso'), sueno: n('mck-sueno'), energia: n('mck-energia'), entreno: n('mck-entreno'), comida: n('mck-comida'), nota: v('mck-nota') };
    if (x.peso != null && (x.peso < 25 || x.peso > 300)) { toast('Revisa el peso'); return; }
    if ([x.sueno, x.energia].some((y) => y != null && (y < 1 || y > 5))) { toast('Sueño y energía van del 1 al 5'); return; }
    if (x.comida != null && (x.comida < 0 || x.comida > 100)) { toast('El plan de comida va de 0 a 100 %'); return; }
    if ([x.peso, x.sueno, x.energia, x.entreno, x.comida].every((y) => y == null) && !x.nota) { toast('Responde al menos una pregunta'); return; }
    (mi().checkins ??= []).push(x);
    if (x.peso && !(e().dias[iso()] || {}).peso) { (e().dias[iso()] ??= {}).peso = x.peso; } // también queda como tu peso de hoy
    guardar();
    toast((await compartirAvance(true)) ? '📤 Check-in enviado a tu entrenador' : '✓ Check-in guardado: se manda cuando haya internet');
  },
  async 'ent-compartir'() { if (await compartirAvance(true)) toast('🔄 Avance compartido'); },
  async 'ent-salir'({ id }) {
    const a = mi().lista.find((x) => x.id === id);
    if (!a || !confirm('¿Dejar de compartir con ' + a.entrenador + '?\n\nDeja de ver tu avance y tú dejas de recibir su plan. Lo que ya tienes en tu Gym y tu Dieta se queda.')) return;
    try { await llamar('rutina_cliente_salir', { p_id: id }); mi().lista = mi().lista.filter((x) => x.id !== id); guardar(); toast('Listo: ya no compartes con ' + a.entrenador); } catch (err) { toast('⚠️ ' + err.message); }
  },
});
