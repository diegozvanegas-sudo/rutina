// Pantallas de 🔥 Retos (src/retos.js): la lista completa va en 📈 Progreso y el reto activo, en Hoy
import { guardar, repintar } from '../estado.js';
import { registrar, toast } from '../ui.js';
import { registros, retoActivo, empezarRacha, marcarHoy, hacerUna, dejarActivo } from '../retos.js';

registrar({
  'reto-empezar'({ id }) {
    if (!empezarRacha(id)) { toast('Ya tienes un reto activo'); return; }
    guardar();
    toast('🔥 Empieza hoy. Marca cada día que lo cumplas.');
  },
  'reto-hoy'() {
    const x = marcarHoy();
    if (!x) return;
    guardar();
    if (x.estado === 'hecho') toast('🏆 ¡Reto cumplido! Anota cómo te fue.');
  },
  'reto-dejar'() {
    if (retoActivo() && confirm('¿Dejar este reto? La racha se pierde.')) { dejarActivo(); guardar(); }
  },
  'reto-una'({ id }) {
    const x = hacerUna(id);
    if (!x) return;
    guardar();
    toast('✅ Hecho. Anota cómo te fue.', () => { const l = registros(), i = l.indexOf(x); if (i >= 0) l.splice(i, 1); guardar(); });
  },
  'reto-quitar'({ id }) {
    const l = registros(), i = l.findIndex((x) => x.id === id);
    if (i < 0) return;
    const [x] = l.splice(i, 1);
    // Si era una racha cumplida, no vuelve a quedar activa: se empieza de nuevo
    guardar();
    toast('Quitado', () => { l.splice(i, 0, x); guardar(); });
  },
  'reto-nota'(ds, el) {
    const x = registros().find((r) => r.id === ds.id);
    if (!x) { repintar(); return; }
    x.nota = el.value.trim();
    guardar();
  },
});
