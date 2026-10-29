// Editar hábitos, rutina, sesiones y pantallas: agregar, cambiar, duplicar, reordenar, mover y borrar.
// Cada campo lleva data-ruta ("rutina.0.ejercicios.3.nombre") y se guarda al salir de él.
import { e, guardar, repintar } from '../estado.js';
import { filasDeEsquema, DESCANSOS, HABITOS, IDEAS_HABITOS } from '../datos_iniciales.js';
import { reloj } from '../fechas.js';
import { esc, registrar, toast } from '../ui.js';
import { figuraPaso, OPCIONES_FIGURA, videoValido } from '../figuras.js';
import { CATALOGO, FIJAS, enOrden, oculto, mover as moverOrden, alternar, restablecer } from '../orden.js';
import { extrasCalentamiento } from './gym.js';

let pestana = 'rutina', diaEd = null, sesionEd = null;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

const TIPOS_HABITO = { check: 'Marcar', cuenta: 'Cuenta regresiva', cronometro: 'Cronómetro', texto: 'Con texto', sesion: 'Sesión guiada', pastilla: 'Pastilla (inicia la espera)', espera: 'Espera después de la pastilla' };
// Calentamiento del día: cualquier sesión de tipo calentamiento ("calentamiento-pierna" se guarda como "pierna", como antes)
const calentamientos = () => ({ '': 'Sin calentamiento', ...Object.fromEntries(e().sesiones.filter((s) => s.tipo === 'calentamiento' && s.id !== 'calentamiento-futbol')
  .map((s) => [s.id.replace(/^calentamiento-/, ''), s.nombre])) });
const PLANES_DIETA = { '': 'Automático (pierna → inferior, resto → superior)', inferior: 'Inferior', superior: 'Superior', descanso: 'Descanso' };
const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIPOS_SESION = { checklist: 'Checklist (marcar con ✓)', calentamiento: 'Calentamiento', estiramiento: 'Estiramiento', fortalecimiento: 'Fortalecimiento', mente: 'Mente', otro: 'Otro' };
const FIGURAS = { '': 'Automática (según el nombre)', '-': 'Sin figura', ...Object.fromEntries(OPCIONES_FIGURA.map((k) => [k, k[0].toUpperCase() + k.slice(1)])) };

// Imagen y video de un ejercicio de sesión: figura animada, foto propia o ninguna, y enlace de video
function mediosPaso(p, r) {
  return '<div class="ed-medios"><div class="ed-medios-vista">' + (figuraPaso(p, { animar: false }) || '<span class="nota-corta">Sin imagen</span>') + '</div><div class="ed-medios-campos">' +
    (p.foto ? '<p class="nota-corta">Usa tu foto. Quítala para volver a la figura.</p>' : lista('Figura animada', r + '.figura', p.figura || '', FIGURAS)) +
    '<div class="botones-rapidos"><label class="boton secundario">📷 ' + (p.foto ? 'Cambiar foto' : 'Subir foto') +
    '<input type="file" accept="image/*" hidden data-cambio="ed-foto" data-ruta="' + r + '"></label>' +
    (p.foto ? '<button type="button" class="boton secundario" data-accion="ed-foto-quitar" data-ruta="' + r + '">Quitar foto</button>' : '') + '</div>' +
    '<label class="campo">🎥 Video (enlace de YouTube u otro; vacío = buscar en YouTube)<input type="url" inputmode="url" data-cambio="ed-video" data-ruta="' + r + '" value="' + esc(p.video || '') + '" placeholder="https://www.youtube.com/watch?v=…"></label>' +
    '</div></div>';
}

// Foto del celular reducida a 480 px (JPEG) para que quepa en el almacenamiento y en la nube
async function reducirFoto(archivo, max = 480) {
  const url = URL.createObjectURL(archivo);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.75);
  } finally { URL.revokeObjectURL(url); }
}

function obtener(ruta) {
  return ruta.split('.').reduce((o, k) => (o == null ? o : o[k]), e());
}
function poner(ruta, valor) {
  const partes = ruta.split('.'), ultima = partes.pop();
  obtener(partes.join('.'))[ultima] = valor;
}

// ---------- Piezas de formulario ----------
const campo = (titulo, ruta, valor, extra = '') =>
  '<label class="campo">' + titulo + '<input type="text" data-cambio="ed" data-ruta="' + ruta + '" value="' + esc(valor ?? '') + '"' + extra + '></label>';
const numero = (titulo, ruta, valor, extra = '') =>
  '<label class="campo">' + titulo + '<input type="number" inputmode="numeric" min="0" data-cambio="ed" data-tipo="num" data-ruta="' + ruta + '" value="' + esc(valor ?? '') + '"' + extra + '></label>';
const lista = (titulo, ruta, valor, opciones, tipo = '') =>
  '<label class="campo">' + titulo + '<select data-cambio="ed" data-ruta="' + ruta + '"' + (tipo ? ' data-tipo="' + tipo + '"' : '') + '>' +
  Object.entries(opciones).map(([v, t]) => '<option value="' + esc(v) + '"' + (String(valor ?? '') === v ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select></label>';
const controles = (ruta, i, total, nombre) =>
  '<div class="ed-controles">' +
  '<button type="button" class="icono" data-accion="ed-mover" data-lista="' + ruta + '" data-i="' + i + '" data-n="-1" aria-label="Subir"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
  '<button type="button" class="icono" data-accion="ed-mover" data-lista="' + ruta + '" data-i="' + i + '" data-n="1" aria-label="Bajar"' + (i === total - 1 ? ' disabled' : '') + '>↓</button>' +
  '<button type="button" class="icono" data-accion="ed-duplicar" data-lista="' + ruta + '" data-i="' + i + '" aria-label="Duplicar" title="Duplicar">⧉</button>' +
  '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="' + ruta + '" data-i="' + i + '" data-nombre="' + esc(nombre) + '" aria-label="Borrar">🗑</button></div>';

// Elegir varias sesiones guiadas (en el orden en que se tocan): extras del calentamiento, descanso y partido
function elegirSesiones(titulo, ruta, ids) {
  const sel = ids || [], nombres = sel.map((id) => (e().sesiones.find((x) => x.id === id) || {}).nombre).filter(Boolean);
  return '<details class="ed-sesiones"><summary>' + titulo + ': ' + (nombres.length ? esc(nombres.join(', ')) : 'ninguna') + '</summary><nav class="chips">' +
    e().sesiones.map((x) => '<button type="button" class="chip' + (sel.includes(x.id) ? ' activo' : '') + '" data-accion="ed-sesiones-lista" data-ruta="' + ruta + '" data-id="' + esc(x.id) + '">' + esc(x.nombre) + '</button>').join('') + '</nav></details>';
}

// ---------- Hábitos ----------
function editorHabitos() {
  const hs = e().habitos, sesiones = Object.fromEntries(e().sesiones.map((s) => [s.id, s.nombre]));
  const faltan = HABITOS.filter((x) => !hs.some((h) => h.id === x.id)).length;
  return '<p class="nota-corta">El orden es el de la checklist de la mañana (Hoy, Mañana, Progreso, la hoja y el CSV).</p>' +
    '<div class="botones-rapidos">' + (hs.length ? '<button type="button" class="boton secundario" data-accion="ed-habitos-cero">🧹 Empezar de cero</button>' : '') +
    (faltan ? '<button type="button" class="boton secundario" data-accion="ed-habitos-ejemplo">↩ Traer los de ejemplo (' + faltan + ')</button>' : '') + '</div>' +
    (hs.length ? '' : '<p class="nota-corta">Lista vacía: agrega tus hábitos con "＋ Hábito".</p>') + hs.map((h, i) => {
    const r = 'habitos.' + i;
    return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + (i + 1) + '. ' + esc(h.nombre) + '</b>' + controles('habitos', i, hs.length, h.nombre) + '</div>' +
      '<div class="dos">' + campo('Nombre', r + '.nombre', h.nombre) + campo('Detalle', r + '.detalle', h.detalle) + '</div>' +
      '<div class="dos">' + lista('Tipo', r + '.tipo', h.tipo, TIPOS_HABITO) +
      (h.tipo === 'cuenta' ? numero('Duración (segundos)', r + '.segundos', h.segundos) : '') +
      (h.tipo === 'cronometro' ? numero('Meta (minutos)', r + '.segundos', Math.round((h.segundos || 0) / 60), ' data-factor="60"') : '') +
      (h.tipo === 'sesion' ? lista('Sesión', r + '.sesion', h.sesion, sesiones) : '') + '</div>' +
      (h.nombre === 'Nuevo hábito' ? ideasHabito(i) : '') +
      (h.tipo === 'espera' && !hs.some((x) => x.tipo === 'pastilla') ? '<p class="aviso">⚠ La espera arranca al marcar un hábito de tipo "Pastilla": agrega uno.</p>' : '') + '</section>';
  }).join('') + '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="habitos">＋ Hábito</button>';
}

// Ideas para el hábito recién agregado (las que aún no están en la lista)
function ideasHabito(i) {
  const ideas = IDEAS_HABITOS.map((x, k) => [x, k]).filter(([x]) => !e().habitos.some((h) => h.nombre === x.nombre));
  return '<p class="nota-corta">💡 Ideas: toca una para usarla (luego la puedes cambiar)</p><div class="ideas">' +
    ideas.map(([x, k]) => '<button type="button" class="chip" data-accion="ed-idea" data-i="' + i + '" data-k="' + k + '">' + esc(x.nombre) + '</button>').join('') + '</div>';
}

// ---------- Rutina ----------
export const esquemaDe = (ej) => ej.filas.map((f) => (f.tipo === 'Series' ? '' : f.tipo + ' ') + f.esquema).join(' · ');

function editorRutina() {
  const rutina = e().rutina;
  if (!rutina.some((d) => d.id === diaEd)) diaEd = rutina[0] && rutina[0].id;
  const i = rutina.findIndex((d) => d.id === diaEd), d = rutina[i];
  const musculos = [...new Set(rutina.flatMap((x) => x.ejercicios.map((ej) => ej.musculo)).filter(Boolean))];
  const repetidos = rutina.filter((x) => x.diaSemana && rutina.filter((y) => y.diaSemana === x.diaSemana).length > 1);
  return '<nav class="chips">' + rutina.map((x) => '<button type="button" class="chip' + (x.id === diaEd ? ' activo' : '') + '" data-accion="ed-dia" data-id="' + x.id + '">' + esc(x.nombre) + '</button>').join('') +
    '<button type="button" class="chip" data-accion="ed-agregar" data-lista="rutina">＋ Día</button></nav>' +
    '<section class="tarjeta"><b>⚽ Días de fútbol</b><p class="nota-corta">Ese día el plan de comida es "Fútbol" y en Hoy aparece el partido.</p><nav class="chips">' +
    DIAS.slice(1).map((t, n) => '<button type="button" class="chip' + ((e().config.futbol || []).includes(n + 1) ? ' activo' : '') + '" data-accion="futbol-dia" data-n="' + (n + 1) + '">' + t + '</button>').join('') + '</nav>' +
    elegirSesiones('Sesiones del partido', 'config.sesionesPartido', e().config.sesionesPartido) +
    elegirSesiones('Sesiones de los días de descanso', 'config.sesionesDescanso', e().config.sesionesDescanso) + '</section>' +
    (repetidos.length ? '<p class="aviso">⚠ Hay dos días asignados al mismo día de la semana: se usa el primero.</p>' : '') +
    (!d ? '' : '<section class="tarjeta"><div class="ed-cab"><b>Día</b>' + (d.id === 'core' ? '' : controles('rutina', i, rutina.length, d.nombre)) + '</div>' +
      '<div class="dos">' + campo('Nombre', 'rutina.' + i + '.nombre', d.nombre) +
      (d.id === 'core' ? '<p class="nota-corta">El core se anota al final de cualquier día.</p>' : lista('Día de la semana', 'rutina.' + i + '.diaSemana', d.diaSemana, Object.fromEntries(DIAS.map((t, n) => [n ? String(n) : '', t || 'Sin asignar'])), 'num')) + '</div>' +
      (d.id === 'core' ? '' : '<div class="dos">' + lista('Calentamiento', 'rutina.' + i + '.calentamiento', d.calentamiento || '', calentamientos()) +
        campo('Cardio', 'rutina.' + i + '.cardio', d.cardio) + '</div>' +
        (d.calentamiento ? elegirSesiones('Junto al calentamiento', 'rutina.' + i + '.extras', extrasCalentamiento(d)) : '') +
        '<div class="dos">' + campo('Antes de empezar', 'rutina.' + i + '.previo', d.previo, ' placeholder="Ej.: movilidad previa 5-10 min"') +
        lista('Plan de comida', 'rutina.' + i + '.dieta', d.dieta || '', PLANES_DIETA) + '</div>') +
      '</section>' +
      '<datalist id="musculos">' + musculos.map((m) => '<option value="' + esc(m) + '">').join('') + '</datalist>' +
      d.ejercicios.map((ej, j) => {
        const r = 'rutina.' + i + '.ejercicios.' + j;
        return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + (j + 1) + '. ' + esc(ej.nombre) + '</b>' + controles('rutina.' + i + '.ejercicios', j, d.ejercicios.length, ej.nombre) + '</div>' +
          '<div class="dos">' + campo('Ejercicio', r + '.nombre', ej.nombre) + campo('Músculo', r + '.musculo', ej.musculo, ' list="musculos"') + '</div>' +
          '<label class="campo">Series × reps<input type="text" data-cambio="ed-esquema" data-ruta="' + r + '" value="' + esc(esquemaDe(ej)) + '" placeholder="Top 1×4-7 · Back-off 2×8-12"></label>' +
          '<div class="dos">' + campo('Nota', r + '.nota', ej.nota, ' placeholder="Técnica, máquina, agarre…"') +
          (rutina.length > 1 ? '<label class="campo">Mover a otro día<select data-cambio="ed-mover-dia" data-dia="' + i + '" data-j="' + j + '"><option value="">—</option>' +
            rutina.map((x, k) => (k === i ? '' : '<option value="' + k + '">' + esc(x.nombre) + '</option>')).join('') + '</select></label>' : '') + '</div>' +
          '<div class="ed-descansos">' + ej.filas.map((f, k) => numero('Descanso ' + f.tipo + ' (s) · ' + reloj(f.descanso), r + '.filas.' + k + '.descanso', f.descanso)).join('') + '</div></section>';
      }).join('') +
      '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="rutina.' + i + '.ejercicios">＋ Ejercicio</button>' +
      '<p class="nota-corta">Series × reps: "3×8-12", "4×10 + fallo", "1×1 min" o con top set y back-off separados por "·". ' +
      'Si reordenas o mueves un ejercicio a otro día, sus registros se van con él. ⧉ duplica (la copia empieza sin registros).</p>');
}

// ---------- Sesiones ----------
function editorSesiones() {
  const ss = e().sesiones;
  if (!ss.some((s) => s.id === sesionEd)) sesionEd = ss[0] && ss[0].id;
  const i = ss.findIndex((s) => s.id === sesionEd), s = ss[i];
  return '<nav class="chips">' + ss.map((x) => '<button type="button" class="chip' + (x.id === sesionEd ? ' activo' : '') + '" data-accion="ed-sesion" data-id="' + x.id + '">' + esc(x.nombre) + '</button>').join('') +
    '<button type="button" class="chip" data-accion="ed-agregar" data-lista="sesiones">＋ Sesión</button></nav>' +
    (!s ? '' : '<section class="tarjeta"><div class="ed-cab"><b>Sesión</b>' + controles('sesiones', i, ss.length, s.nombre) + '</div>' +
      '<div class="dos">' + campo('Nombre', 'sesiones.' + i + '.nombre', s.nombre) + lista('Tipo', 'sesiones.' + i + '.tipo', s.tipo, TIPOS_SESION) + '</div>' +
      (/^calentamiento-/.test(s.id) ? '<p class="nota-corta">Se abre desde los días con calentamiento "' + esc(s.id.replace('calentamiento-', '')) + '".</p>' : '') + '</section>' +
      (s.tipo === 'checklist' ? '<p class="nota-corta">Cada punto se marca con ✓ en 🧘 Sesiones y la lista se reinicia cada día.</p>' + s.pasos.map((p, j) => {
        const r = 'sesiones.' + i + '.pasos.' + j;
        return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + (j + 1) + '. ' + esc(p.nombre) + '</b>' + controles('sesiones.' + i + '.pasos', j, s.pasos.length, p.nombre) + '</div>' +
          '<div class="dos">' + campo('Punto', r + '.nombre', p.nombre) + campo('Nota (opcional)', r + '.desc', p.desc) + '</div></section>';
      }).join('') + '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="sesiones.' + i + '.pasos">＋ Punto</button>' :
      s.pasos.map((p, j) => {
        const r = 'sesiones.' + i + '.pasos.' + j, porReps = !!p.reps;
        return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + (j + 1) + '. ' + esc(p.nombre) + '</b>' + controles('sesiones.' + i + '.pasos', j, s.pasos.length, p.nombre) + '</div>' +
          '<div class="dos">' + campo('Ejercicio', r + '.nombre', p.nombre) + campo('Músculo', r + '.musculo', p.musculo) + '</div>' +
          '<div class="dos">' + '<label class="campo">Modo<select data-cambio="ed-modo" data-ruta="' + r + '"><option value="tiempo"' + (porReps ? '' : ' selected') + '>Por tiempo</option><option value="reps"' + (porReps ? ' selected' : '') + '>Por repeticiones</option></select></label>' +
          numero('Series', r + '.series', p.series || 1) + '</div>' +
          '<div class="dos">' + (porReps ? campo('Reps', r + '.reps', p.reps, ' placeholder="10-12"') : numero('Segundos', r + '.seg', p.seg)) +
          numero('Descanso entre series (s)', r + '.descanso', p.descanso ?? 30) + '</div>' +
          '<label class="interruptor"><input type="checkbox" data-cambio="ed" data-tipo="bool" data-ruta="' + r + '.lados"' + (p.lados ? ' checked' : '') + '> Por lado (izquierdo y derecho)</label>' +
          '<label class="campo">Descripción<textarea rows="2" data-cambio="ed" data-ruta="' + r + '.desc">' + esc(p.desc || '') + '</textarea></label>' +
          mediosPaso(p, r) + '</section>';
      }).join('') +
      '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="sesiones.' + i + '.pasos">＋ Ejercicio</button>'));
}

// ---------- Pantallas: orden y qué se ve del menú, de Hoy y de las metas ----------
const TITULOS_ORDEN = {
  menu: ['☰ Menú', 'Hoy, Editar y Ajustes siempre se ven.'],
  hoy: ['🏠 Tarjetas de Hoy', 'Foco y libros van arriba, a lo ancho; las demás en el tablero.'],
  metas: ['🎯 Metas del día', 'Las escondidas no cuentan en el porcentaje de metas ni en el puntaje.'],
};
function editorPantallas() {
  const c = e().config;
  return Object.entries(TITULOS_ORDEN).map(([tipo, [titulo, nota]]) => {
    const ids = enOrden(c, tipo), cat = CATALOGO[tipo];
    return '<section class="tarjeta"><div class="fila-resumen"><h2>' + titulo + '</h2><button type="button" class="boton secundario" data-accion="orden-restablecer" data-tipo="' + tipo + '">↺ Como venía</button></div>' +
      '<p class="nota-corta">' + nota + '</p><ul class="lista-orden">' + ids.map((id, i) => {
        const nombre = Array.isArray(cat[id]) ? cat[id].join(' ') : cat[id], fija = FIJAS[tipo].includes(id), apagado = oculto(c, tipo, id);
        return '<li' + (apagado ? ' class="apagado"' : '') + '><label class="interruptor"><input type="checkbox" data-cambio="orden-ver" data-tipo="' + tipo + '" data-id="' + id + '"' +
          (apagado ? '' : ' checked') + (fija ? ' disabled' : '') + '> ' + esc(nombre) + '</label><span class="ed-controles">' +
          '<button type="button" class="icono" data-accion="orden-mover" data-tipo="' + tipo + '" data-id="' + id + '" data-n="-1" aria-label="Subir ' + esc(nombre) + '"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
          '<button type="button" class="icono" data-accion="orden-mover" data-tipo="' + tipo + '" data-id="' + id + '" data-n="1" aria-label="Bajar ' + esc(nombre) + '"' + (i === ids.length - 1 ? ' disabled' : '') + '>↓</button></span></li>';
      }).join('') + '</ul></section>';
  }).join('');
}

export function vistaEditar() {
  const tabs = { rutina: '🏋️ Rutina', habitos: '☀️ Hábitos', sesiones: '🧘 Sesiones', pantallas: '🧩 Pantallas' };
  return '<h1>Editar</h1><nav class="chips pestanas">' + Object.entries(tabs).map(([k, t]) =>
    '<button type="button" class="chip' + (k === pestana ? ' activo' : '') + '" data-accion="ed-pestana" data-p="' + k + '">' + t + '</button>').join('') + '</nav>' +
    (pestana === 'habitos' ? editorHabitos() : pestana === 'sesiones' ? editorSesiones() : pestana === 'pantallas' ? editorPantallas() : editorRutina());
}

// Copia con ids nuevos (los registros del gym van por id de fila: la copia empieza limpia)
function ejercicioCopia(ej, diaId) {
  const id = diaId + '-' + uid(), c = JSON.parse(JSON.stringify(ej));
  return { ...c, id, filas: c.filas.map((f, k) => ({ ...f, id: id + '-' + (k + 1) })) };
}
function duplicado(ruta, item) {
  if (!item) return null;
  const c = JSON.parse(JSON.stringify(item));
  if (c.nombre) c.nombre += ' (copia)';
  if (ruta === 'habitos') c.id = 'h' + uid();
  else if (ruta === 'rutina') {
    c.id = 'd' + uid(); c.diaSemana = null; delete c.notaCalentamiento;
    c.ejercicios = item.ejercicios.map((ej) => ejercicioCopia(ej, c.id));
    diaEd = c.id;
  } else if (/\.ejercicios$/.test(ruta)) return { ...ejercicioCopia(item, obtener(ruta.replace(/\.ejercicios$/, '')).id), nombre: c.nombre };
  else if (ruta === 'sesiones') { c.id = 's' + uid(); sesionEd = c.id; }
  else if (c.id) c.id = (String(c.id).match(/^[a-z]+/i) || ['x'])[0] + uid();
  return c;
}

// Lo que se agrega en cada lista
function nuevo(listaRuta) {
  if (listaRuta === 'habitos') return { id: 'h' + uid(), nombre: 'Nuevo hábito', tipo: 'check' };
  if (listaRuta === 'rutina') {
    const d = { id: 'd' + uid(), nombre: 'Nuevo día', diaSemana: null, calentamiento: '', cardio: '', ejercicios: [] };
    diaEd = d.id;
    return d;
  }
  if (listaRuta === 'sesiones') {
    const s = { id: 's' + uid(), nombre: 'Nueva sesión', tipo: 'estiramiento', pasos: [] };
    sesionEd = s.id;
    return s;
  }
  if (/\.ejercicios$/.test(listaRuta)) {
    const dia = obtener(listaRuta.replace(/\.ejercicios$/, '')), id = dia.id + '-' + uid();
    return { id, nombre: 'Nuevo ejercicio', musculo: '', nota: '', filas: filasDeEsquema('3×8-12').map((f, k) => ({ ...f, id: id + '-' + (k + 1) })) };
  }
  if (/\.pasos$/.test(listaRuta)) {
    if (obtener(listaRuta.replace(/\.pasos$/, '')).tipo === 'checklist') return { id: 'k' + uid(), nombre: 'Nuevo punto', desc: '' };
    return { nombre: 'Nuevo ejercicio', musculo: '', seg: 30, lados: false, desc: '' };
  }
  // Dieta
  if (/\.comidas$/.test(listaRuta)) return { nombre: 'Nueva comida', items: [] };
  if (listaRuta === 'dieta.alimentos') return { id: 'a' + uid(), nombre: 'Nuevo alimento', por: 'g', p: 0, g: 0, c: 0, kcal: 0, grupo: 'otro' };
  // Finanzas
  if (listaRuta === 'finanzas.categorias.gasto') return { id: 'c' + uid(), nombre: 'Nueva categoría', icono: '🏷️', grupo: 'deseo', presupuesto: 0 };
  if (listaRuta === 'finanzas.fijos') return { id: 'f' + uid(), nombre: 'Nuevo pago', monto: 0, categoria: 'servicios', metodo: 'debito', dia: 1 };
  if (listaRuta === 'finanzas.metas') return { id: 'meta' + uid(), nombre: 'Nueva meta', icono: '🎯', objetivo: 0 };
  if (listaRuta === 'finanzas.prestamos') return { id: 'p' + uid(), nombre: 'Nuevo préstamo', monto: 0, tasa: 0, dia: 0, nota: '' };
  if (listaRuta === 'finanzas.deudas') return { id: 'd' + uid(), nombre: 'Tarjeta o crédito', saldo: 0, tasa: 2, cuota: 0, dia: 1 };
  return null;
}

registrar({
  'ed-pestana'({ p }) { pestana = p; repintar(); },
  'orden-mover'({ tipo, id, n }) { if (moverOrden(e().config, tipo, id, Number(n))) guardar(); },
  'orden-ver'({ tipo, id }) { if (alternar(e().config, tipo, id)) guardar(); },
  'orden-restablecer'({ tipo }) { restablecer(e().config, tipo); guardar(); },
  'ed-sesiones-lista'({ ruta, id }) {
    // Las extras de un día que nunca se editó arrancan con las de siempre
    const dia = /^rutina\.\d+\.extras$/.test(ruta) && obtener(ruta.replace(/\.extras$/, ''));
    if (dia && !dia.extras) dia.extras = [...extrasCalentamiento(dia)];
    const partes = ruta.split('.'), k = partes.pop(), padre = obtener(partes.join('.')), arr = (padre[k] ??= []), i = arr.indexOf(id);
    if (i < 0) arr.push(id); else arr.splice(i, 1);
    guardar();
  },
  'ed-mover-dia'({ dia, j }, el) {
    if (el.value === '') return;
    const rutina = e().rutina, de = rutina[Number(dia)], a = rutina[Number(el.value)];
    if (!de || !a) return;
    const [ej] = de.ejercicios.splice(Number(j), 1);
    a.ejercicios.push(ej);
    diaEd = a.id;
    toast('"' + ej.nombre + '" ahora está en ' + a.nombre);
    guardar();
  },
  'ed-duplicar'({ lista: ruta, i }) {
    const arr = obtener(ruta), copia = duplicado(ruta, arr[Number(i)]);
    if (!copia) return;
    arr.splice(Number(i) + 1, 0, copia);
    guardar();
  },
  // "#editar/habitos" (desde la tarjeta de la mañana)
  'abrir-editar'({ p }) { pestana = p; },
  'ed-idea'({ i, k }) {
    const h = e().habitos[Number(i)], idea = IDEAS_HABITOS[Number(k)];
    if (!h || !idea) return;
    delete h.segundos; delete h.sesion; delete h.detalle;
    Object.assign(h, JSON.parse(JSON.stringify(idea)));
    guardar();
  },
  'ed-habitos-cero'() {
    if (!confirm('¿Borrar todos los hábitos de la mañana y empezar de cero?\nLo marcado en días pasados queda guardado.')) return;
    e().habitos = [];
    guardar();
  },
  'ed-habitos-ejemplo'() {
    const hs = e().habitos;
    for (const x of HABITOS) if (!hs.some((h) => h.id === x.id)) hs.push(JSON.parse(JSON.stringify(x)));
    guardar();
  },
  'ed-dia'({ id }) { diaEd = id; repintar(); },
  'futbol-dia'({ n }) {
    const dias = (e().config.futbol ??= []), i = dias.indexOf(+n);
    if (i < 0) dias.push(+n); else dias.splice(i, 1);
    dias.sort((x, y) => x - y);
    guardar();
  },
  'ed-sesion'({ id }) { sesionEd = id; repintar(); },
  ed({ ruta, tipo, factor }, el) {
    let v = tipo === 'bool' ? el.checked : el.value;
    if (tipo === 'num') v = v === '' ? null : Math.max(0, Number(v) || 0) * (Number(factor) || 1);
    else if (typeof v === 'string') v = v.trim();
    if (/\.nombre$/.test(ruta) && !v) { toast('El nombre no puede quedar vacío'); repintar(); return; }
    poner(ruta, v);
    // Al cambiar el tipo de un hábito, valores por defecto para que funcione de una vez
    const h = /^habitos\.\d+\.tipo$/.test(ruta) && obtener(ruta.replace(/\.tipo$/, ''));
    if (h) {
      if (v === 'cuenta' && !h.segundos) h.segundos = 60;
      if (v === 'cronometro' && !h.segundos) h.segundos = 3600;
      if (v === 'sesion' && !h.sesion) h.sesion = e().sesiones[0] && e().sesiones[0].id;
    }
    guardar();
  },
  'ed-esquema'({ ruta }, el) {
    const ej = obtener(ruta);
    let nuevas;
    try { nuevas = filasDeEsquema(el.value, ej.musculo === 'Core' ? DESCANSOS.Core : DESCANSOS.Series); } catch (err) { toast('No entendí "' + el.value + '". Ej.: Top 1×4-7 · Back-off 2×8-12'); repintar(); return; }
    // Las filas conservan su id por posición (así los registros de semanas pasadas siguen en su sitio)
    ej.filas = nuevas.map((f, k) => {
      const vieja = ej.filas[k];
      return { ...f, id: ej.id + '-' + (k + 1), ...(vieja && vieja.tipo === f.tipo ? { descanso: vieja.descanso } : {}), ...(vieja && vieja.ultimo ? { ultimo: vieja.ultimo } : {}) };
    });
    guardar();
  },
  'ed-modo'({ ruta }, el) {
    const p = obtener(ruta);
    if (el.value === 'reps') { delete p.seg; p.reps ??= '10'; p.series ??= 3; p.descanso ??= 45; } else { delete p.reps; p.seg ??= 30; }
    guardar();
  },
  async 'ed-foto'({ ruta }, el) {
    const archivo = el.files && el.files[0];
    if (!archivo) return;
    try { obtener(ruta).foto = await reducirFoto(archivo); } catch (err) { toast('No se pudo leer esa imagen. Prueba con una foto JPG o PNG.'); return; }
    guardar();
  },
  'ed-foto-quitar'({ ruta }) { delete obtener(ruta).foto; guardar(); },
  'ed-video'({ ruta }, el) {
    const v = el.value.trim(), p = obtener(ruta);
    if (v && !videoValido(v)) { toast('Pega un enlace que empiece por https://'); repintar(); return; }
    if (v) p.video = v; else delete p.video;
    guardar();
  },
  'ed-mover'({ lista: ruta, i, n }) {
    const arr = obtener(ruta), a = Number(i), b = a + Number(n);
    if (b < 0 || b >= arr.length) return;
    [arr[a], arr[b]] = [arr[b], arr[a]];
    guardar();
  },
  'ed-borrar'({ lista: ruta, i, nombre }) {
    const arr = obtener(ruta), item = arr[Number(i)];
    if (ruta === 'sesiones' && e().habitos.some((h) => h.sesion === item.id)) { toast('Esa sesión la usa un hábito de la mañana: cámbialo primero'); return; }
    if (ruta === 'dieta.alimentos' && Object.values(e().dieta.planes).some((p) => p.comidas.some((c) => c.items.some((x) => x.alimento === item.id)))) {
      toast('Ese alimento está en un plan: quítalo de las comidas primero'); return;
    }
    if (ruta === 'finanzas.categorias.gasto' && e().finanzas.movimientos.some((m) => m.categoria === item.id)) {
      toast('Esa categoría tiene movimientos: no se puede borrar (cámbiale el nombre si quieres)'); return;
    }
    if (ruta === 'finanzas.metas' && e().finanzas.movimientos.some((m) => m.meta === item.id)) {
      toast('Esa meta tiene aportes: saca la plata primero'); return;
    }
    if (!confirm('¿Borrar "' + nombre + '"?' + (ruta === 'rutina' || /\.ejercicios$/.test(ruta) ? '\nLos registros de semanas pasadas quedan guardados pero no se verán.' : ''))) return;
    arr.splice(Number(i), 1);
    guardar();
  },
  'ed-agregar'({ lista: ruta }) {
    const item = nuevo(ruta);
    if (!item) return;
    obtener(ruta).push(item);
    guardar();
    setTimeout(() => { const t = document.querySelectorAll('.ed-item'); if (t.length) t[t.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
  },
});
