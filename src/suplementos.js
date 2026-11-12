// 💊 Suplementos: qué tomas (creatina, proteína, omega…), cuándo, y lo que tomaste cada día.
// Lista en estado.suplementos = { lista: [sup] }
// sup: { id, nombre, emoji, dosis, momento, dias: [1..7] (vacío = todos), soloEntreno, quedan (tomas que quedan o null), nota, activo,
//        hora: 'HH:MM' del aviso en el calendario del celular (y de ahí al reloj), o vacío sin aviso }
// Lo tomado va con el día, como los hábitos: dias[fecha].suplementos = { id: { ts, dosis } }

export const MOMENTOS = [
  ['manana', '🌅 En la mañana'], ['comida', '🍽️ Con una comida'], ['pre', '⚡ Antes de entrenar'],
  ['post', '💪 Después de entrenar'], ['noche', '🌙 En la noche'], ['cualquiera', '🕐 A cualquier hora'],
];
export const NOMBRE_MOMENTO = Object.fromEntries(MOMENTOS);
const ORDEN_MOMENTO = Object.fromEntries(MOMENTOS.map(([id], i) => [id, i]));

// Para agregar de un toque; todo se puede cambiar después
export const PLANTILLAS = [
  { nombre: 'Creatina', emoji: '⚡', dosis: '5 g', momento: 'cualquiera', hora: '10:00', nota: 'Todos los días, también los de descanso: lo que sirve es tomarla seguido. No necesita fase de carga.' },
  { nombre: 'Proteína whey', emoji: '🥤', dosis: '1 scoop (30 g)', momento: 'post', nota: 'Cuenta para la proteína del día.' },
  { nombre: 'Omega 3', emoji: '🐟', dosis: '1-2 cápsulas', momento: 'comida' },
  { nombre: 'Vitamina D3', emoji: '☀️', dosis: '1 cápsula', momento: 'comida', nota: 'Mejor con una comida que tenga grasa.' },
  { nombre: 'Magnesio', emoji: '🌙', dosis: '200-400 mg', momento: 'noche' },
  { nombre: 'Multivitamínico', emoji: '💊', dosis: '1 tableta', momento: 'comida' },
  { nombre: 'Colágeno', emoji: '🦴', dosis: '10 g', momento: 'cualquiera' },
  { nombre: 'Electrolitos', emoji: '🧂', dosis: '1 sobre', momento: 'pre', soloEntreno: true, nota: 'Días de partido o de mucho calor.' },
  { nombre: 'Cafeína / preentreno', emoji: '☕', dosis: '1 servicio', momento: 'pre', soloEntreno: true, nota: 'No después de las 3 p. m.: quita sueño.' },
];

// Le quitan absorción a la levotiroxina (y a otras pastillas para la tiroides): hay que separarlos unas 4 horas
const CHOCAN_TIROIDES = /calcio|hierro|magnesio|multivit|zinc|soya|soja|antiacid/i;
export function avisoPastilla(sup, habitos) {
  const p = (habitos || []).find((h) => h.tipo === 'pastilla');
  if (!p || !CHOCAN_TIROIDES.test(sup.nombre || '')) return '';
  return 'Tómalo al menos 4 horas después de: ' + p.nombre + ' (le quita absorción).';
}

const sinTildes = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
export const mismoNombre = (a, b) => sinTildes(a) === sinTildes(b);

// ¿Toca ese día? entrena: hay gym o partido ese día (solo importa para los de "solo días de entreno")
export function tocaEl(sup, diaSemana, entrena) {
  if (!sup || sup.activo === false) return false;
  if (sup.dias && sup.dias.length && !sup.dias.includes(diaSemana)) return false;
  return !sup.soloEntreno || !!entrena;
}

// Los que tocan ese día, en el orden del día (mañana → noche)
export function deHoy(lista, diaSemana, entrena) {
  return (lista || []).filter((s) => tocaEl(s, diaSemana, entrena))
    .sort((a, b) => (ORDEN_MOMENTO[a.momento] ?? 9) - (ORDEN_MOMENTO[b.momento] ?? 9));
}

export const tomado = (dias, fecha, id) => !!(dias && dias[fecha] && dias[fecha].suplementos && dias[fecha].suplementos[id]);

// Marcar o desmarcar: devuelve true si quedó tomado. Lleva la cuenta de lo que queda en el frasco
export function marcar(dia, sup, ts = Date.now()) {
  const t = (dia.suplementos ??= {});
  if (t[sup.id]) {
    delete t[sup.id];
    if (sup.quedan != null) sup.quedan += 1;
    return false;
  }
  t[sup.id] = { ts, dosis: sup.dosis || '' };
  if (sup.quedan != null) sup.quedan = Math.max(0, sup.quedan - 1);
  return true;
}

// Días seguidos tomándolo (los días que no tocaba no cortan). Si hoy aún no lo tomó, cuenta hasta ayer.
// fechas: de hoy hacia atrás; info(fecha) → { diaSemana, entrena }
export function racha(sup, dias, fechas, info) {
  let n = 0;
  for (let i = 0; i < fechas.length; i++) {
    const f = fechas[i], x = info(f);
    if (!tocaEl(sup, x.diaSemana, x.entrena)) continue;
    if (tomado(dias, f, sup.id)) n++;
    else if (i === 0) continue; // hoy todavía hay tiempo
    else break;
  }
  return n;
}

// De los días que tocaba (en esas fechas), cuántos lo tomó. Los días antes de agregarlo no cuentan
export function constancia(sup, dias, fechas, info) {
  let tocaban = 0, tomados = 0;
  for (const f of fechas) {
    if (sup.creado && f < sup.creado) continue;
    const x = info(f);
    if (!tocaEl(sup, x.diaSemana, x.entrena)) continue;
    tocaban++;
    if (tomado(dias, f, sup.id)) tomados++;
  }
  return { tocaban, tomados, parte: tocaban ? tomados / tocaban : null };
}

// Avisos del calendario (registro.js → calendarioIcs): uno por suplemento con hora, solo los días que toca.
// diasEntreno: días de la semana con gym o partido (para los de "solo días de entreno")
export function avisosSuplementos(lista, diasEntreno = []) {
  const out = [];
  for (const s of lista || []) {
    if (s.activo === false || !/^\d{2}:\d{2}$/.test(s.hora || '')) continue;
    let dias = s.dias && s.dias.length ? [...s.dias].sort() : null;
    if (s.soloEntreno) dias = (dias || [1, 2, 3, 4, 5, 6, 7]).filter((n) => diasEntreno.includes(n));
    if (dias && !dias.length) continue;
    const nombre = s.nombre + (s.dosis ? ' · ' + s.dosis : '');
    out.push({ id: 'sup-' + s.id, hora: s.hora, icono: s.emoji || '💊', nombre, dias: dias && dias.length === 7 ? null : dias,
      texto: 'Toma ' + nombre + '.' + (s.nota ? ' ' + s.nota : '') + ' Márcalo en Rutina → 💊 Suplementos.' });
  }
  return out;
}

// Se está acabando: quedan 7 tomas o menos
export const seAcaba = (sup) => sup.quedan != null && sup.quedan <= 7;
