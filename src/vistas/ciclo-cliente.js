// 📆 Ciclo del cliente: lo que se agrega a la pestaña Ciclo (la lógica está en ../ciclo.js)
// - elegir el tipo de ciclo (fuerza + músculo, hipertrofia, fuerza, principiante, poco tiempo)
// - gráfico del ciclo en el tiempo: series por semana (barras), fatiga y rendimiento (líneas), la supercompensación en la
//   descarga, la semana de hoy y la energía de sus check-ins
// - tiempo disponible contra lo que dura cada día · series por músculo contra su rango · señales para adelantar la descarga
// Los textos van dentro de HTML (no dentro del SVG) para que se lean igual en el celular y en el computador.
import { e, guardar, repintar } from '../estado.js';
import { esc, registrar, toast } from '../ui.js';
import { fechaCorta } from '../fechas.js';
import { TIPOS_CICLO, fasesDeTipo, semanasCarga, supercompensacion, volumenMusculos, seriesRutina, tiempoCliente, senalesSobrecarga, lecturaSemana, colorFase } from '../ciclo.js';

let tipo = 'mixto';
export const tipoElegido = () => tipo;
const num = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const pct = (n) => Math.round(n * 1000) / 10;

// ---------- Elegir el tipo (al crear el ciclo o para cambiarlo) ----------
export function elegirTipo(k, cambiar = false) {
  return '<div class="cc-tipos" role="group" aria-label="Tipo de ciclo">' + Object.entries(TIPOS_CICLO).map(([id, t]) =>
    '<button type="button" class="cc-tipo' + (!cambiar && id === tipo ? ' activo' : '') + '" data-accion="' + (cambiar ? 'cc-cambiar-tipo' : 'cc-tipo') + '" data-t="' + id + '" data-k="' + k + '"' +
    (cambiar ? '' : ' aria-pressed="' + (id === tipo) + '"') + '><b>' + t.nombre + '</b><small>' + t.corto + '</small><span>' +
    t.fases.map((x) => x.nombre + ' ' + x.semanas).join(' · ') + '</span></button>').join('') + '</div>';
}

// ---------- Gráfico del ciclo en el tiempo ----------
function grafico(c) {
  const base = seriesRutina(c.rutina), sem = semanasCarga(c.ciclo, base), N = sem.length;
  if (!N) return '';
  const fases = c.ciclo.fases, maxC = Math.max(...sem.map((w) => w.carga)), maxF = Math.max(...sem.map((w) => w.fatiga));
  const rs = sem.map((w) => w.rendimiento), minR = Math.min(...rs), maxR = Math.max(...rs);
  // y de 0 (abajo) a 100 (arriba). Las barras llegan hasta el 60 %; las líneas usan casi todo el alto
  const yR = (r) => 10 + (maxR > minR ? (r - minR) / (maxR - minR) : 0.5) * 80, yF = (f) => 8 + f / maxF * 72;
  const barras = sem.map((w, i) => { const h = w.carga / maxC * 60; return '<rect class="cg-barra f' + colorFase(fases, w.k) + (w.pasada ? ' pasada' : '') + '" x="' + (i + 0.18) + '" y="' + (100 - h) + '" width="0.64" height="' + h + '"/>'; }).join('');
  const linea = (f, clase) => '<polyline class="' + clase + '" vector-effect="non-scaling-stroke" points="' + sem.map((w, i) => (i + 0.5) + ',' + (100 - f(w))).join(' ') + '"/>';
  const area = '<polygon class="cg-fatiga-area" points="0.5,100 ' + sem.map((w, i) => (i + 0.5) + ',' + (100 - yF(w.fatiga))).join(' ') + ' ' + (N - 0.5) + ',100"/>';
  const x = (i) => ((i + 0.5) / N * 100);
  const hoy = sem.findIndex((w) => w.actual);
  const sc = supercompensacion(sem), iSc = sc ? sem.findIndex((w) => w.n === sc.n) : -1;
  // La energía de sus check-ins (1 a 5) en la semana en que los mandó
  const energia = (c.checkins || []).filter((ch) => ch.energia > 0).map((ch) => ({ ch, i: sem.findIndex((w) => ch.fecha >= w.desde && ch.fecha <= w.hasta) })).filter((p) => p.i >= 0);
  const lectura = lecturaSemana(sem);
  // Las fases arriba, cada una del ancho de sus semanas
  const cab = '<div class="cg-fases" style="grid-template-columns:repeat(' + N + ',minmax(0,1fr))">' + fases.filter((f) => Number(f.semanas) > 0).map((f) =>
    '<span class="f' + colorFase(fases, fases.indexOf(f)) + '" style="grid-column:span ' + Number(f.semanas) + '" title="' + esc(f.nombre) + '">' + esc(f.nombre) + '</span>').join('') + '</div>';
  return '<section class="tarjeta"><h2>📈 El ciclo en el tiempo</h2>' +
    (lectura ? '<p class="cg-lectura"><b>' + (lectura.w.actual ? 'Semana ' + lectura.w.n + ' · ' : 'Empieza el ' + fechaCorta(lectura.w.desde) + ' · ') + esc(lectura.w.fase.nombre) + '</b> ' +
      (base ? '≈ ' + lectura.w.series + ' series, ' : '') + 'RIR ' + num(lectura.w.rir) + '. ' + lectura.texto + '</p>' : '') +
    '<div class="cg" role="img" aria-label="Gráfico del ciclo: series por semana, fatiga y rendimiento' + (sc ? '; supercompensación en la semana ' + sc.n : '') + '">' + cab +
      '<div class="cg-plot"><svg viewBox="0 0 ' + N + ' 100" preserveAspectRatio="none" aria-hidden="true">' + barras + area +
        linea((w) => yF(w.fatiga), 'cg-fatiga') + linea((w) => yR(w.rendimiento), 'cg-rendimiento') + '</svg>' +
        (hoy >= 0 ? '<span class="cg-hoy" style="left:' + x(hoy) + '%"><i>hoy</i></span>' : '') +
        (iSc >= 0 ? '<span class="cg-super" style="left:' + Math.min(84, Math.max(16, x(iSc))) + '%;bottom:' + Math.min(88, yR(sem[iSc].rendimiento) + 4) + '%">⬆ Supercompensación</span>' : '') +
        energia.map((p) => '<i class="cg-energia" style="left:' + x(p.i) + '%;bottom:' + (p.ch.energia / 5 * 90) + '%" title="Check-in ' + fechaCorta(p.ch.fecha) + ': energía ' + p.ch.energia + '/5"></i>').join('') +
      '</div><div class="cg-semanas" style="grid-template-columns:repeat(' + N + ',minmax(0,1fr))">' + sem.map((w) => '<span' + (w.actual ? ' class="actual"' : '') + '>' + w.n + '</span>').join('') + '</div></div>' +
    '<ul class="cg-leyenda"><li><i class="cg-l-barra"></i>Carga: series × esfuerzo</li><li><i class="cg-l-rend"></i>Rendimiento</li><li><i class="cg-l-fat"></i>Fatiga</li>' + (energia.length ? '<li><i class="cg-l-energia"></i>Energía (check-in)</li>' : '') + '</ul>' +
    '<details class="nota"><summary>¿Cómo se lee?</summary><ul class="cg-explica">' +
      '<li><b>Cada semana carga un poco más</b> (más series o más cerca del fallo): la fatiga sube junto con la forma.</li>' +
      '<li><b>La fatiga se va rápido y la forma se queda.</b> Por eso en la descarga (la mitad de las series) la fatiga cae, y el rendimiento sube por encima de donde estaba: eso es la <b>supercompensación</b>.</li>' +
      '<li>Sin descarga, la fatiga se acumula y tapa lo ganado: se estanca o se lesiona.</li>' +
      '<li>Las curvas son un modelo (fitness-fatiga de Banister) para planear, no una medición. Lo real lo dicen sus check-ins, sus pesos y sus pruebas.</li></ul></details>' +
    (base ? '' : '<p class="nota-corta">Arma su rutina para ver las series reales de cada semana.</p>') + '</section>';
}

// ---------- Tiempo disponible ----------
function tiempo(c, k) {
  const t = tiempoCliente(c), maxM = Math.max(t.minutos + 15, ...t.porDia.map((d) => d.minutos));
  const filas = t.porDia.map((d) => '<li class="cc-fila' + (d.minutos > t.minutos + 5 ? ' alto' : '') + '"><span class="cc-nombre">' + esc(d.nombre) + '</span>' +
    '<span class="cc-pista"><span class="cc-lleno" style="width:' + pct(d.minutos / maxM) + '%"></span><span class="cc-limite" style="left:' + pct(t.minutos / maxM) + '%"></span></span><b>' + d.minutos + ' min</b></li>').join('');
  return '<section class="tarjeta"><h2>⏱️ Su tiempo</h2><div class="dos">' +
    '<label class="campo">Días por semana<input type="text" inputmode="numeric" data-cambio="cc-tiempo" data-campo="dias" data-k="' + k + '" value="' + t.dias + '"></label>' +
    '<label class="campo">Minutos por sesión<input type="text" inputmode="numeric" data-cambio="cc-tiempo" data-campo="minutos" data-k="' + k + '" value="' + t.minutos + '"></label></div>' +
    '<p class="nota-corta">📐 <b>' + t.dias + ' días:</b> ' + t.division + ' En ' + t.minutos + ' min le caben unas <b>' + t.caben + ' series</b> por sesión (≈ ' + t.cabenSemana + ' a la semana).</p>' +
    (filas ? '<ul class="cc-barras" aria-label="Minutos de cada día">' + filas + '</ul><p class="nota-corta cc-ley"><i class="cc-l-limite"></i> sus ' + t.minutos + ' min · cada serie ≈ 40 s + su descanso, y 8 min de calentamiento</p>' : '<p class="nota-corta">Arma su rutina para ver cuánto dura cada día.</p>') +
    (t.largo.length ? '<p class="aviso">⏱️ ' + t.largo.map((d) => esc(d.nombre)).join(', ') + (t.largo.length === 1 ? ' no le cabe' : ' no le caben') + '. Para recortar sin perder resultados: biseries de músculos opuestos (pecho + espalda), descansos de 90 s en los aislados y quita primero los ejercicios repetidos, nunca los básicos.</p>' : '') +
    (t.sobranDias ? '<p class="aviso">📅 Su rutina tiene ' + c.rutina.length + ' días y solo puede ir ' + t.dias + '. Junta días o pasa a la división de arriba.</p>' : '') + '</section>';
}

// ---------- Series por músculo a la semana ----------
function musculos(c) {
  const lista = volumenMusculos(c.rutina, e().config.objetivos);
  if (!lista.length) return '';
  const tope = Math.max(24, ...lista.map((m) => m.series + 2));
  const ESTADO = { bajo: 'Poco', ok: 'Bien', alto: 'Mucho' };
  return '<section class="tarjeta"><h2>💪 Series por músculo a la semana</h2>' +
    '<p class="nota-corta">La franja verde es el rango que sirve para crecer (10-20 series por músculo; menos en core, glúteo y pantorrilla). Es su rutina en las fases al 100 %: en la descarga baja a la mitad.</p>' +
    '<ul class="cc-barras">' + lista.map((m) => '<li class="cc-fila ' + m.estado + '"><span class="cc-nombre">' + esc(m.musculo) + '</span>' +
      '<span class="cc-pista"><span class="cc-rango" style="left:' + pct(m.min / tope) + '%;width:' + pct((m.max - m.min) / tope) + '%"></span><span class="cc-lleno" style="width:' + pct(m.series / tope) + '%"></span></span>' +
      '<b>' + m.series + ' <small>' + ESTADO[m.estado] + '</small></b></li>').join('') + '</ul>' +
    (lista.some((m) => m.estado === 'bajo') ? '<p class="nota-corta">⬇ <b>Poco:</b> súmale 2-4 series a la semana a ' + lista.filter((m) => m.estado === 'bajo').map((m) => esc(m.musculo)).join(', ') + ' (o acéptalo si no es su prioridad).</p>' : '') +
    (lista.some((m) => m.estado === 'alto') ? '<p class="nota-corta">⬆ <b>Mucho:</b> más de 20 series casi no suma músculo y sí fatiga. Baja ' + lista.filter((m) => m.estado === 'alto').map((m) => esc(m.musculo)).join(', ') + '.</p>' : '') +
    (lista.some((m) => m.muchoEnUnDia) ? '<p class="nota-corta">🔁 Más de 10 series de un músculo en un solo día rinden menos: reparte ' + lista.filter((m) => m.muchoEnUnDia).map((m) => esc(m.musculo)).join(', ') + ' en dos días.</p>' : '') + '</section>';
}

// ---------- Señales para adelantar la descarga ----------
function senales(c) {
  const s = senalesSobrecarga(c);
  return '<section class="tarjeta"><h2>🚦 ¿Va sobrecargado?</h2>' +
    (s.length ? '<p class="aviso">⚠️ ' + s.map(esc).join(' · ') + '. Si además bajó su fuerza, <b>adelanta la descarga</b> esta semana (mueve la fase o pon menos semanas en la actual).</p>'
      : (c.checkins || []).length ? '<p class="nota-corta">✓ Sus últimos check-ins no muestran señales de sobrecarga.</p>' : '<p class="nota-corta">Cuando mande check-ins, aquí verás si duerme mal o tiene la energía baja.</p>') +
    '<details class="nota"><summary>Las señales para adelantar la descarga</summary><ul class="cg-explica">' +
      '<li>Dos semanas seguidas durmiendo mal o sin energía.</li><li>Baja el peso o las reps en sus básicos dos entrenos seguidos.</li>' +
      '<li>Dolor en una articulación (no el dolor muscular normal) o le cuesta calentar.</li><li>Pulso en reposo más alto de lo normal varios días, o ganas de no entrenar.</li>' +
      '<li>Con 1-2 señales: misma semana con 1 serie menos por ejercicio. Con 3 o más: descarga ya.</li></ul></details></section>';
}

export function cicloExperto(c, k) {
  return grafico(c) + tiempo(c, k) + musculos(c) + senales(c) +
    '<details class="nota"><summary>🔄 Cambiar el tipo de ciclo</summary><p class="nota-corta">Cambia las fases por las del tipo elegido (la fecha de inicio se queda). Puedes deshacerlo.</p>' + elegirTipo(k, true) + '</details>';
}

const clienteK = (k) => (e().clientes || [])[Number(k)];
registrar({
  'cc-tipo'({ t }) { if (TIPOS_CICLO[t]) tipo = t; repintar(); },
  'cc-cambiar-tipo'({ t, k }) {
    const c = clienteK(k);
    if (!c || !c.ciclo || !TIPOS_CICLO[t]) return;
    const antes = c.ciclo.fases;
    c.ciclo.fases = fasesDeTipo(t); guardar();
    toast('📆 Ciclo ' + TIPOS_CICLO[t].nombre, () => { c.ciclo.fases = antes; guardar(); });
  },
  'cc-tiempo'({ campo, k }, el) {
    const c = clienteK(k), n = Math.round(Number(String(el.value).replace(',', '.')));
    if (!c) return;
    const [min, max] = campo === 'dias' ? [1, 7] : [15, 240];
    if (!(n >= min && n <= max)) { toast(campo === 'dias' ? 'Entre 1 y 7 días' : 'Entre 15 y 240 minutos'); guardar(); return; }
    (c.tiempo ??= {})[campo] = n; guardar();
  },
});
