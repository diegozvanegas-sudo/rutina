// Pantallas de mejora continua: "Voy mejor que…", qué te funciona, revisión del domingo, experimento de la semana e inglés
import { guardar, repintar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { esc, barra, registrar, toast } from '../ui.js';
import { comparativa, queFunciona, experimentos, experimentoActivo, estadoExperimento, nuevoExperimento, ingles, resumenIngles } from '../mejora.js';

const num = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString('es-CO');
const valor = (x, n) => (x.unidad === '$' ? '$ ' + Math.round(n).toLocaleString('es-CO') : x.unidad === '%' ? Math.round(n) + ' %' : num(n) + (x.unidad && x.unidad !== '/100' ? ' ' + x.unidad : ''));
const MARCA = { mejor: ['▲', 'Mejor'], peor: ['▼', 'Bajó'], igual: ['＝', 'Igual'] };

export function tableroMejora(hoy = iso()) {
  const filas = comparativa(hoy), conDatos = filas.filter((x) => x.estado !== 'sin-datos'), faltan = filas.filter((x) => x.estado === 'sin-datos');
  return '<section class="tarjeta mejora"><h2>📈 ¿Voy mejor que hace un mes?</h2><p class="nota-corta">Últimos 7 días frente a las 4 semanas anteriores. Un día no dice nada; la tendencia, sí.</p>' +
    (conDatos.length ? '<ul class="lista-mejora">' + conDatos.map((x) => '<li><a href="' + x.ir + '"><span class="m-ic" aria-hidden="true">' + x.icono + '</span><span class="m-txt"><b>' + esc(x.nombre) + '</b><small>Antes ' + valor(x, x.antes) + '</small></span>' +
      '<span class="m-val"><b>' + valor(x, x.ahora) + '</b><small class="m-' + x.estado + '">' + MARCA[x.estado].join(' ') + '</small></span></a></li>').join('') + '</ul>'
      : '<p>Todavía no hay datos para comparar. Sigue anotando: con unas semanas aparece tu tendencia.</p>') +
    (faltan.length && conDatos.length ? '<p class="nota-corta">Aún sin datos para comparar: ' + faltan.map((x) => esc(x.nombre)).join(', ') + '.</p>' : '') + '</section>';
}

// Revisión del domingo: lo que mejoró, lo que bajó y una pregunta
export function revisionDomingo(hoy = iso()) {
  const filas = comparativa(hoy), mejor = filas.filter((x) => x.estado === 'mejor'), peor = filas.filter((x) => x.estado === 'peor');
  if (!mejor.length && !peor.length) return '';
  const pregunta = peor.length ? '¿Qué hizo más difícil «' + peor[0].nombre.toLowerCase() + '» y qué cambio pequeño lo arreglaría?' : '¿Qué hiciste distinto en «' + mejor[0].nombre.toLowerCase() + '» y cómo lo repites la próxima semana?';
  return '<div class="revision-domingo">' + (mejor.length ? '<p>▲ <b>Mejoró:</b> ' + mejor.map((x) => esc(x.nombre)).join(', ') + '</p>' : '') + (peor.length ? '<p>▼ <b>Bajó:</b> ' + peor.map((x) => esc(x.nombre)).join(', ') + '</p>' : '') +
    '<p class="revision-pregunta">🤔 ' + esc(pregunta) + '</p></div>';
}

export function tarjetaQueFunciona(hoy = iso()) {
  const { frases, dias } = queFunciona(hoy);
  return '<section class="tarjeta"><h2>🔬 Qué te funciona a ti</h2>' + (frases.length ? '<ul class="lista-funciona">' + frases.map(({ titulo, medida, r }) =>
    '<li><b>' + esc(titulo) + '</b><span>' + Math.round(r.si) + ' % ' + esc(medida) + ' cuando sí (' + r.nSi + ' días), frente a ' + Math.round(r.no) + ' % cuando no (' + r.nNo + ' días).' + (r.nota ? '' : ' Casi sin diferencia.') + '</span></li>').join('') + '</ul>' +
    '<p class="nota-corta">Es una relación en tus datos, no prueba la causa. Úsala para decidir qué probar.</p>'
    : '<p class="nota-corta">Necesita al menos 5 días de cada lado (por ejemplo, 5 durmiendo bien y 5 no). Llevas ' + dias + ' ' + (dias === 1 ? 'día anotado' : 'días anotados') + '.</p>') + '</section>';
}

// ---------- Experimento de la semana ----------
export function tarjetaExperimento(hoy = iso()) {
  const x = experimentoActivo();
  if (!x) {
    return '<section class="tarjeta experimento" data-experimento><h2>🧪 Experimento de la semana</h2><p class="nota-corta">Un solo cambio pequeño, 7 días. Al final decides si se queda.</p>' +
      '<label class="campo">¿Qué vas a probar?<input type="text" name="cambio" placeholder="Ej.: acostarme 30 minutos antes"></label>' +
      '<label class="campo">¿Cómo sabrás si funcionó?<input type="text" name="medida" placeholder="Ej.: dormir 7 horas o más"></label>' +
      '<button type="button" class="boton primario ancho" data-accion="exp-empezar">Empezar hoy</button></section>';
  }
  const s = estadoExperimento(x, hoy);
  return '<section class="tarjeta experimento"><h2>🧪 ' + esc(x.cambio) + '</h2>' + (x.medida ? '<p class="nota-corta">Lo mido con: ' + esc(x.medida) + '</p>' : '') +
    (s.termino
      ? '<p class="rec-titulo">Lo cumpliste ' + s.cumplidos + ' de 7 días</p><p class="nota-corta">¿Te sirvió?</p><div class="botones-rapidos"><button type="button" class="boton primario" data-accion="exp-decidir" data-v="conservar">✅ Lo conservo</button><button type="button" class="boton secundario" data-accion="exp-decidir" data-v="descartar">❌ Lo descarto</button></div>'
      : '<p class="rec-titulo">Día ' + s.dia + ' de 7 <small>· ' + s.cumplidos + ' cumplidos</small></p>' + barra(s.dia / 7) +
        '<button type="button" class="boton ' + (s.hoyListo ? 'secundario' : 'primario') + ' ancho" data-accion="exp-hoy">' + (s.hoyListo ? '↩ Hoy no lo cumplí' : '✓ Hoy lo cumplí') + '</button>' +
        '<button type="button" class="boton-suave" data-accion="exp-cancelar">Dejar este experimento</button>') + '</section>';
}
export function historialExperimentos() {
  const hechos = experimentos().filter((x) => x.decision && x.decision !== 'cancelado').reverse();
  if (!hechos.length) return '';
  return '<section class="tarjeta"><h2>🧪 Experimentos anteriores</h2><ul class="lista-funciona">' + hechos.map((x) => '<li><b>' + (x.decision === 'conservar' ? '✅ ' : '❌ ') + esc(x.cambio) + '</b><span>' + fechaCorta(x.inicio) + ' · cumplido ' + Object.keys(x.dias || {}).length + ' de 7 días</span></li>').join('') + '</ul></section>';
}

// ---------- Inglés ----------
export function tarjetaIngles(hoy = iso()) {
  const i = ingles(), r = resumenIngles(i, hoy);
  const nivel = (n, t) => '<label class="campo">' + t + '<select name="' + n + '">' + [1, 2, 3, 4, 5].map((v) => '<option value="' + v + '"' + (v === 3 ? ' selected' : '') + '>' + v + '</option>').join('') + '</select></label>';
  return '<section class="tarjeta"><div class="fila-resumen"><h2>🇬🇧 Mis horas de inglés</h2><b>' + num(r.horas) + ' / ' + r.meta + ' h</b></div>' + barra(r.fraccion) +
    '<p class="nota-corta">' + num(r.semanaHoras) + ' h en los últimos 7 días. Suma lo que hagas fuera de las lecciones: escuchar, hablar, leer.</p>' +
    '<div class="botones-rapidos">' + [15, 30, 60, 90].map((m) => '<button type="button" class="boton secundario" data-accion="ing-sumar" data-m="' + m + '">+' + m + ' min</button>').join('') + '</div>' +
    '<label class="campo">Mi meta (horas)<input type="number" inputmode="numeric" min="1" data-cambio="ing-meta" value="' + r.meta + '"></label>' +
    (r.tocaPrueba
      ? '<details class="prueba-ingles" open><summary>📝 Prueba del mes</summary><p class="nota-corta">Graba 2 minutos hablando sin parar y mira 5 minutos de una serie sin subtítulos. Califícate de 1 (casi nada) a 5 (fluido).</p><div class="dos" data-prueba>' + nivel('escucha', 'Escucha') + nivel('habla', 'Habla') + '</div><button type="button" class="boton primario ancho" data-accion="ing-prueba">Guardar prueba</button></details>'
      : '<p class="nota-corta">Última prueba, ' + fechaCorta(r.ultima.fecha) + ': escucha ' + r.ultima.escucha + '/5, habla ' + r.ultima.habla + '/5. La próxima, a los 30 días.</p>') +
    (i.pruebas.length > 1 ? '<ul class="lista-pesos">' + [...i.pruebas].reverse().map((p) => '<li><span>' + fechaCorta(p.fecha) + '</span><span>Escucha ' + p.escucha + ' · Habla ' + p.habla + '</span></li>').join('') + '</ul>' : '') + '</section>';
}

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
    const caja = el.closest('details').querySelector('[data-prueba]');
    ingles().pruebas.push({ fecha: iso(), escucha: Number(caja.querySelector('[name=escucha]').value), habla: Number(caja.querySelector('[name=habla]').value) });
    guardar();
    toast('📝 Prueba guardada');
  },
});
