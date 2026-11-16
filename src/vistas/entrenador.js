// 🧑‍🏫 Mi entrenador (lado del cliente): unirse con el código, usar el plan que publica, mandarle el check-in y
// compartirle el avance. La lógica está en src/coach.js y las funciones de la nube en supabase/esquema.sql.
import { e, guardar, repintar, semanaActual } from '../estado.js';
import { registrar, toast } from '../ui.js';
import { iso } from '../fechas.js';
import { configurada, nube, llamar } from '../nube.js';
import { aplicarPlan, volverAntes, resumenAvance } from '../coach.js';

let codigoLink = '', cargando = false, ultimoUsuario = null, ultimaCarga = 0;
const mi = () => (e().miEntrenador ??= { lista: [], aplicado: {}, checkins: [] });
const cuantos = (n, uno, varios) => n + ' ' + (n === 1 ? uno : varios);

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

// Lo que lee la pantalla de React (react/pantallas/Entrenador.tsx)
export const piezasEntrenador = { mi, codigoLink: () => codigoLink };

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
