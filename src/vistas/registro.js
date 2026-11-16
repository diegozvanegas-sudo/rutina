// Tarjetas de registro rápido para "Hoy" y "Progreso": sueño y peso, cómo te fue en el partido,
// foco de la semana y el cierre de la semana (qué funcionó, qué frenó, qué ley se rompió y el foco de la próxima).
import { e, guardar, dia, hayFutbol } from '../estado.js';
import { iso, sumarDias } from '../fechas.js';
import { hayPartido } from '../registro.js';
import { registrar, toast } from '../ui.js';
import { pausaEn, pausarFutbol, reanudarFutbol } from '../futbol.js';

// ---------- Fútbol: el día del partido y, si no se anotó, al día siguiente ----------
export function fechaPartidoPendiente(hoy = iso()) {
  if (hayFutbol(hoy)) return hoy;
  const ayer = sumarDias(hoy, -1), d = e().dias[ayer];
  return hayFutbol(ayer) && !(d && hayPartido(d.partido)) ? ayer : null;
}

registrar({
  'futbol-pausar'() {
    const c = e().config, hoy = iso(), ayer = sumarDias(hoy, -1), d = e().dias[ayer], antes = JSON.parse(JSON.stringify(c.futbolPausas || []));
    pausarFutbol(c, hayFutbol(ayer) && !(d && hayPartido(d.partido)) ? ayer : hoy);
    guardar();
    toast('⏸ Fútbol en pausa. Cuando vuelvas: Editar → Rutina → Volví a jugar', () => { c.futbolPausas = antes; guardar(); });
  },
  'futbol-reanudar'() { reanudarFutbol(e().config, iso()); guardar(); toast('⚽ ¡De vuelta a la cancha!'); },
  'futbol-vuelvo'(ds, el) {
    const p = pausaEn(e().config, iso());
    if (!p) return;
    if (el.value && el.value > iso()) p.hasta = el.value; else delete p.hasta;
    guardar();
  },
});

registrar({
  sueno({ f, k }, el) {
    const s = (dia(f).sueno ??= {});
    if (el.value) s[k] = el.value; else delete s[k];
    guardar();
  },
  'sueno-calidad'({ f, v }) {
    const s = (dia(f).sueno ??= {});
    if (s.calidad === Number(v)) delete s.calidad; else s.calidad = Number(v);
    guardar();
  },
  partido({ f, k }, el) {
    const p = (dia(f).partido ??= {});
    if (k === 'nota') p.nota = el.value.trim();
    else { const n = Math.round(Number(el.value)); if (n > 0) p[k] = n; else delete p[k]; }
    guardar();
  },
  'partido-punto'({ f, k, v }) {
    const p = (dia(f).partido ??= {});
    if (p[k] === Number(v)) delete p[k]; else p[k] = Number(v);
    guardar();
  },
  'partido-molestia'({ f, m }) {
    const p = (dia(f).partido ??= {}), l = (p.molestias ??= []);
    p.molestias = l.includes(m) ? l.filter((x) => x !== m) : [...l, m];
    guardar();
  },
  cierre({ s, k }, el) {
    const r = ((e().revisiones ??= {})[s] ??= {});
    r[k] = el.value.trim();
    r.fecha = iso();
    guardar();
    if (k === 'foco' && r.foco) toast('🎯 Foco de la semana ' + s + ' guardado');
  },
});
