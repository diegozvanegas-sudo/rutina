// Tarjetas de registro rápido para "Hoy" y "Progreso": sueño y peso, cómo te fue en el partido,
// foco de la semana y el cierre de la semana (qué funcionó, qué frenó, qué ley se rompió y el foco de la próxima).
import { e, guardar, dia, hayFutbol } from '../estado.js';
import { iso, sumarDias, fechaCorta } from '../fechas.js';
import { hayPartido } from '../registro.js';
import { esc, registrar, toast } from '../ui.js';
import { pausaEn, pausarFutbol, reanudarFutbol } from '../futbol.js';

// ---------- Fútbol: el día del partido y, si no se anotó, al día siguiente ----------
export function fechaPartidoPendiente(hoy = iso()) {
  if (hayFutbol(hoy)) return hoy;
  const ayer = sumarDias(hoy, -1), d = e().dias[ayer];
  return hayFutbol(ayer) && !(d && hayPartido(d.partido)) ? ayer : null;
}

// ⏸ Pausa del fútbol: en Editar → Rutina y desde la tarjeta del partido. Si el partido de ayer no se anotó, la pausa
// empieza ayer (no se jugó) y deja de preguntarlo
export function tarjetaPausaFutbol() {
  const c = e().config, pausa = pausaEn(c, iso());
  if (!(c.futbol || []).length && !pausa) return '';
  if (!pausa) return '<button type="button" class="boton secundario" data-accion="futbol-pausar">⏸ Pausar el fútbol (lesión, viaje…)</button>';
  return '<div class="futbol-pausa"><p class="aviso">⏸ <b>Fútbol en pausa</b> desde el ' + fechaCorta(pausa.desde) + (pausa.hasta ? ' · vuelves el ' + fechaCorta(pausa.hasta) : '') +
    '. Mientras tanto no sale el partido en Hoy, la comida sigue el plan normal y no hay avisos del partido. Tus días de fútbol quedan guardados.</p>' +
    '<div class="dos"><label class="campo">Vuelvo a jugar el (opcional)<input type="date" data-cambio="futbol-vuelvo" min="' + sumarDias(iso(), 1) + '" value="' + esc(pausa.hasta || '') + '"></label>' +
    '<button type="button" class="boton primario" data-accion="futbol-reanudar">▶ Volví a jugar</button></div></div>';
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
