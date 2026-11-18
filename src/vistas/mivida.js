// Acciones de 🌱 Mi vida y de sus tarjetas de Hoy (ánimo, trabajo e ingresos). La lógica está en src/mivida.js y la
// pantalla en react/pantallas/MiVida.tsx. La revisión con IA (src/ia.ts) se pide desde aquí.
import { e, dia, guardar, repintar } from '../estado.js';
import { iso } from '../fechas.js';
import { registrar, toast } from '../ui.js';
import { AREAS, IDEAS_AREA, ruedaDeHoy, decisiones, nuevaDecision } from '../mivida.js';
import { experimentoActivo, nuevoExperimento } from '../mejora.js';
import { promptSemanal } from '../prediccion.js';
import { ponerClaveIA, pareceClave, pedirRevisionIA } from '../ia.ts';

// Mientras se espera la respuesta de la IA (y el último error), mientras la app esté abierta
const ia = { pidiendo: false, error: '' };
export const piezasVida = { ia: () => ({ ...ia }) };
export const revisionesIA = () => (e().revisionesIA ??= []);

registrar({
  // 😊 Ánimo y energía: tocar el mismo número lo quita
  animo({ f, k, v }) {
    const a = (dia(f).animo ??= {}), n = Number(v);
    if (a[k] === n) delete a[k]; else a[k] = n;
    guardar();
  },
  'animo-nota'({ f }, el) {
    const a = (dia(f).animo ??= {}), t = el.value.trim();
    if (t) a.nota = t; else delete a.nota;
    guardar();
  },
  // 📈 Mi mejora del 1 % de hoy (en el cierre de la noche)
  'mejora-uno'({ f }, el) {
    const d = dia(f), t = el.value.trim();
    if (t) d.mejoraUno = t; else delete d.mejoraUno;
    guardar(false);
  },
  // 💼 Trabajo e ingresos
  'trabajo-min'({ f }, el) {
    const t = (dia(f).trabajo ??= {}), n = Math.round(Number(String(el.value).replace(',', '.')));
    if (n > 0) t.minutos = n; else delete t.minutos;
    guardar();
  },
  'trabajo-sumar'({ f, k, n }) {
    const t = (dia(f).trabajo ??= {}), a = (t.acciones ??= {}), v = Math.max(0, (a[k] || 0) + Number(n));
    if (v) a[k] = v; else delete a[k];
    guardar();
  },
  // 🎡 Rueda de la vida: la de hoy (si ya hay una de hoy, se corrige esa)
  'rueda-nota'({ k, v }) {
    const r = ruedaDeHoy(iso());
    r.notas[k] = Number(v);
    guardar();
  },
  'rueda-experimento'({ k }) {
    if (experimentoActivo()) { toast('Ya tienes un experimento en curso: termínalo primero (Hoy → 🧪)'); return; }
    const area = AREAS.find(([x]) => x === k);
    nuevoExperimento(IDEAS_AREA[k], 'Mi nota de ' + (area ? area[2].toLowerCase() : k) + ' en la próxima rueda');
    guardar();
    toast('🧪 Experimento de 7 días empezado: míralo en Hoy');
  },
  // ⚖️ Diario de decisiones
  'decision-agregar'(ds, el) {
    const caja = el.closest('[data-decision-nueva]'), v = (n) => (caja.querySelector('[name=' + n + ']') || {}).value || '';
    const texto = v('texto').trim();
    if (!texto) { toast('Escribe qué decidiste'); return; }
    nuevaDecision({ texto, espero: v('espero').trim(), confianza: v('confianza'), dias: v('dias') });
    guardar();
    toast('⚖️ Guardada. Te la recuerdo cuando toque revisarla');
  },
  'decision-salio'({ id, v }) {
    const d = decisiones().find((x) => x.id === id);
    if (!d) return;
    d.salio = d.salio === v ? '' : v;
    if (d.salio) d.revisada = iso(); else delete d.revisada;
    guardar();
  },
  'decision-resultado'({ id }, el) {
    const d = decisiones().find((x) => x.id === id);
    if (d) { d.resultado = el.value.trim(); guardar(); }
  },
  'decision-borrar'({ id }) {
    const l = decisiones(), i = l.findIndex((x) => x.id === id);
    if (i < 0 || !confirm('¿Borrar esta decisión?')) return;
    const [d] = l.splice(i, 1);
    guardar();
    toast('Decisión borrada', () => { l.splice(i, 0, d); guardar(); });
  },
  // ⏳ Tu vida en semanas
  'vida-nacimiento'(ds, el) {
    const v = el.value;
    if (/^\d{4}-\d{2}-\d{2}$/.test(v) && v < iso()) (e().vida ??= {}).nacimiento = v;
    else if (e().vida) delete e().vida.nacimiento;
    guardar();
  },
  // 🤖 Revisión con IA: la clave queda solo en este equipo
  'ia-clave'(ds, el) {
    const k = el.value.trim();
    if (k && !pareceClave(k)) { toast('Esa no parece una clave de Anthropic (empieza por sk-ant-)'); return; }
    ponerClaveIA(k);
    ia.error = '';
    repintar();
    toast(k ? '🔑 Clave guardada solo en este equipo' : 'Clave borrada de este equipo');
  },
  async 'ia-pedir'() {
    if (ia.pidiendo) return;
    ia.pidiendo = true; ia.error = '';
    repintar();
    try {
      const texto = await pedirRevisionIA(promptSemanal());
      const l = revisionesIA();
      l.push({ fecha: iso(), texto });
      if (l.length > 12) l.splice(0, l.length - 12);
      ia.pidiendo = false;
      guardar();
      toast('🤖 Revisión lista');
    } catch (err) {
      ia.pidiendo = false;
      ia.error = err && err.message ? err.message : String(err);
      repintar();
    }
  },
});
