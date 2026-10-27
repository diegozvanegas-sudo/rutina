// Tarjetas de registro rápido para "Hoy" y "Progreso": sueño y peso, cómo te fue en el partido,
// foco de la semana y el cierre de la semana (qué funcionó, qué frenó, qué ley se rompió y el foco de la próxima).
import { e, guardar, dia, hayFutbol } from '../estado.js';
import { iso, sumarDias, fechaCorta, semanaDe, lunesDe } from '../fechas.js';
import { horasSueno, promedioSueno, MOLESTIAS, hayPartido, semanaObjetivo, focoDe } from '../registro.js';
import { rango } from '../progreso.js';
import { libro } from '../libros/index.js';
import { esc, registrar, toast } from '../ui.js';

const f1 = (n) => String(n).replace('.', ',');
const puntos = (n, valor, accion, datos, etiqueta) => '<div class="escala" role="group" aria-label="' + esc(etiqueta) + '">' +
  Array.from({ length: n }, (_, i) => i + 1).map((v) => '<button type="button" class="chip' + (Number(valor) === v ? ' activo' : '') + '" data-accion="' + accion + '" ' + datos + ' data-v="' + v + '" aria-pressed="' + (Number(valor) === v) + '">' + v + '</button>').join('') + '</div>';

// ---------- Sueño y peso ----------
export function tarjetaSuenoPeso(fecha = iso()) {
  const d = e().dias[fecha] || {}, s = d.sueno || {}, h = horasSueno(s), prom = promedioSueno(e().dias, rango(7, fecha));
  const ultimoPeso = Object.keys(e().dias).sort().reverse().map((f) => e().dias[f].peso).find((p) => p > 0);
  return '<section class="tarjeta col-sueno"><div class="fila-resumen"><h2>🌙 Sueño y ⚖️ peso</h2>' +
    (prom ? '<span class="nota-corta" title="Promedio de las últimas noches anotadas">7 días: <b>' + f1(prom.horas) + ' h</b></span>' : '') + '</div>' +
    '<div class="dos"><label class="campo">Me acosté<input type="time" data-cambio="sueno" data-f="' + fecha + '" data-k="acoste" value="' + esc(s.acoste || '') + '"></label>' +
    '<label class="campo">Me levanté<input type="time" data-cambio="sueno" data-f="' + fecha + '" data-k="levante" value="' + esc(s.levante || '') + '"></label></div>' +
    (h != null ? '<p class="' + (h < 7 ? 'aviso' : 'nota-corta') + '">Dormiste <b>' + f1(h) + ' h</b>' + (h < 7 ? '. Menos de 7 h frena la recuperación y la fuerza: hoy acuéstate más temprano.' : '. ¡Bien!') + '</p>' : '') +
    '<p class="nota-corta">¿Cómo dormiste? (1 = muy mal · 5 = excelente)</p>' + puntos(5, s.calidad, 'sueno-calidad', 'data-f="' + fecha + '"', 'Calidad del sueño') +
    '<label class="campo">Peso en ayunas (kg)<input type="number" inputmode="decimal" step="0.1" min="0" data-cambio="dieta-peso" value="' + esc(d.peso || '') + '" placeholder="' + esc(ultimoPeso || '') + '"></label>' +
    '<a class="nota-corta" href="#dieta/peso">Ver la tendencia del peso →</a></section>';
}

// ---------- Fútbol: el día del partido y, si no se anotó, al día siguiente ----------
export function fechaPartidoPendiente(hoy = iso()) {
  if (hayFutbol(hoy)) return hoy;
  const ayer = sumarDias(hoy, -1), d = e().dias[ayer];
  return hayFutbol(ayer) && !(d && hayPartido(d.partido)) ? ayer : null;
}
export function tarjetaPartido(fecha) {
  const p = (e().dias[fecha] || {}).partido || {}, hecho = hayPartido(p), datos = 'data-f="' + fecha + '"';
  return '<section class="tarjeta partido' + (hecho ? ' hecho' : '') + '"><div class="fila-resumen"><h2>⚽ ¿Cómo te fue' + (fecha === iso() ? ' hoy' : ' ayer') + '?</h2>' +
    (hecho ? '<span class="estado e-pagado">✓ Anotado</span>' : '') + '</div>' +
    (fecha === iso() && !hecho ? '<p class="nota-corta">Anótalo después del partido (o mañana). Con esto se ve si la pierna te deja cansado para jugar.</p>' : '') +
    '<label class="campo">Minutos jugados<input type="number" inputmode="numeric" min="0" max="200" data-cambio="partido" ' + datos + ' data-k="minutos" value="' + esc(p.minutos || '') + '" placeholder="Ej.: 70"></label>' +
    '<p class="nota-corta">Esfuerzo (1 = suave · 10 = al máximo)</p>' + puntos(10, p.rpe, 'partido-punto', datos + ' data-k="rpe"', 'Esfuerzo del partido') +
    '<p class="nota-corta">Energía de las piernas (1 = sin piernas · 5 = volando)</p>' + puntos(5, p.energia, 'partido-punto', datos + ' data-k="energia"', 'Energía') +
    '<p class="nota-corta">Molestias</p><div class="chips envolver">' + MOLESTIAS.map((m) => {
      const activo = (p.molestias || []).includes(m);
      return '<button type="button" class="chip' + (activo ? ' activo' : '') + '" data-accion="partido-molestia" ' + datos + ' data-m="' + m + '" aria-pressed="' + activo + '">' + m + '</button>';
    }).join('') + '</div>' +
    '<label class="campo">Nota<input type="text" data-cambio="partido" ' + datos + ' data-k="nota" value="' + esc(p.nota || '') + '" placeholder="Ej.: gol, cancha mojada, me faltó aire…"></label>' +
    ((p.molestias || []).length ? '<p class="aviso">Con molestias: hoy haz la sesión de rodilla o estira suave, y si el dolor sigue en 2-3 días o es punzante, consulta a un fisioterapeuta.</p>' : '') +
    '</section>';
}

// ---------- Foco de la semana (en Hoy) ----------
export function tarjetaFoco(hoy = iso()) {
  const foco = focoDe(e(), semanaDe(hoy)), objetivo = semanaObjetivo(hoy), finde = objetivo > semanaDe(hoy), cerrada = focoDe(e(), objetivo);
  const recordar = finde && !(cerrada && cerrada.foco)
    ? '<a class="tarjeta avisos-hoy" href="#progreso"><b>📝 Cierra tu semana</b><span>Revisa qué funcionó y elige el foco de la próxima (5 minutos).</span></a>' : '';
  if (!foco || !foco.foco) return recordar;
  return '<a class="tarjeta foco-hoy" href="#progreso"><small>🎯 Foco de la semana' + (foco.ley ? ' · ⚖️ ' + esc(foco.ley) : '') + '</small><b>' + esc(foco.foco) + '</b></a>' + recordar;
}

// ---------- Cierre de la semana (en Progreso) ----------
const leyes = () => { const l = libro('leyes'); return l ? l.conceptos.lista.map((c) => c.nombre) : []; };
export function cierreSemana(hoy = iso()) {
  const s = semanaObjetivo(hoy), r = (e().revisiones || {})[s] || {}, lunes = lunesDe(s);
  const campo = (k, etiqueta, ph) => '<label class="campo">' + etiqueta + '<textarea rows="2" data-cambio="cierre" data-s="' + s + '" data-k="' + k + '" placeholder="' + esc(ph) + '">' + esc(r[k] || '') + '</textarea></label>';
  const anteriores = Object.entries(e().revisiones || {}).map(([n, x]) => [Number(n), x]).filter(([n, x]) => n !== s && x.foco).sort((a, b) => b[0] - a[0]).slice(0, 4);
  return '<section class="tarjeta cierre"><h2>🗓️ Cierre de la semana</h2>' +
    '<p class="nota-corta">' + (s > semanaDe(hoy) ? 'Para la semana ' + s + ' (desde el ' + fechaCorta(lunes) + ').' : 'Semana ' + s + '. El sábado o el domingo se planea la siguiente.') + ' Mira la revisión de arriba y responde.</p>' +
    campo('funciono', '✅ ¿Qué 20 % me dio el 80 % del avance?', 'Ej.: entrenar temprano, la comida preparada') +
    campo('freno', '🧱 ¿Qué me frenó?', 'Ej.: me acosté tarde martes y jueves') +
    '<label class="campo">⚖️ ¿Qué ley rompí o voy a trabajar?<select data-cambio="cierre" data-s="' + s + '" data-k="ley"><option value="">Elige una ley…</option>' +
    leyes().map((n) => '<option' + (r.ley === n ? ' selected' : '') + '>' + esc(n) + '</option>').join('') + '</select></label>' +
    (r.ley ? '<a class="nota-corta" href="#libros/leyes">Releer cómo usar esa ley →</a>' : '') +
    '<label class="campo">🎯 Mi foco de la semana (una sola cosa)<input type="text" data-cambio="cierre" data-s="' + s + '" data-k="foco" value="' + esc(r.foco || '') + '" placeholder="Ej.: dormir antes de las 11 de domingo a jueves"></label>' +
    (anteriores.length ? '<h3 class="sub-libro">Focos anteriores</h3><ul class="puntos-libro">' + anteriores.map(([n, x]) =>
      '<li>Semana ' + n + ': ' + esc(x.foco) + (x.ley ? ' <small>(' + esc(x.ley) + ')</small>' : '') + '</li>').join('') + '</ul>' : '') +
    '</section>';
}

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
