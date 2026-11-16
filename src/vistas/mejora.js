// Pantallas de mejora continua: "Voy mejor que…", qué te funciona, revisión del domingo, experimento de la semana e inglés
import { guardar, repintar } from '../estado.js';
import { iso } from '../fechas.js';
import { registrar, toast } from '../ui.js';
import { experimentoActivo, nuevoExperimento, ingles } from '../mejora.js';

registrar({
  'exp-empezar'(ds, el) {
    const caja = el.closest('[data-experimento]'), cambio = caja.querySelector('[name=cambio]').value.trim();
    if (!cambio) { toast('Escribe qué vas a probar'); return; }
    nuevoExperimento(cambio, caja.querySelector('[name=medida]').value.trim());
    guardar();
    toast('🧪 Empieza hoy: 7 días');
  },
  'exp-hoy'() {
    const x = experimentoActivo(), hoy = iso();
    if (!x) return;
    if (x.dias[hoy]) delete x.dias[hoy]; else x.dias[hoy] = true;
    guardar();
  },
  'exp-decidir'({ v }) {
    const x = experimentoActivo();
    if (!x) return;
    x.decision = v;
    guardar();
    toast(v === 'conservar' ? '✅ Se queda. Conviértelo en hábito si te sirve.' : 'Descartado. También es aprender.');
  },
  'exp-cancelar'() {
    const x = experimentoActivo();
    if (x && confirm('¿Dejar este experimento?')) { x.decision = 'cancelado'; guardar(); }
  },
  'ing-sumar'({ m }) {
    const i = ingles(), hoy = iso(), n = Number(m);
    i.minutos[hoy] = (i.minutos[hoy] || 0) + n;
    guardar();
    toast('🇬🇧 +' + n + ' min', () => { i.minutos[hoy] -= n; if (i.minutos[hoy] <= 0) delete i.minutos[hoy]; guardar(); });
  },
  'ing-meta'(ds, el) {
    const n = Math.round(Number(el.value));
    if (n > 0) { ingles().meta = n; guardar(); } else repintar();
  },
  'ing-prueba'(ds, el) {
    const caja = el.closest('[data-prueba-ingles]').querySelector('[data-prueba]');
    ingles().pruebas.push({ fecha: iso(), escucha: Number(caja.querySelector('[name=escucha]').value), habla: Number(caja.querySelector('[name=habla]').value) });
    guardar();
    toast('📝 Prueba guardada');
  },
});
