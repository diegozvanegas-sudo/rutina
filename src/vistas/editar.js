// Editar hábitos, rutina, sesiones y pantallas: agregar, cambiar, duplicar, reordenar, mover y borrar.
// Cada campo lleva data-ruta ("rutina.0.ejercicios.3.nombre") y se guarda al salir de él.
import { e, guardar, repintar } from '../estado.js';
import { filasDeEsquema, DESCANSOS, HABITOS, IDEAS_HABITOS } from '../datos_iniciales.js';
import { reloj } from '../fechas.js';
import { esc, registrar, toast } from '../ui.js';
import { figuraPaso, OPCIONES_FIGURA, videoValido } from '../figuras.js';
import { CATALOGO, FIJAS, SECCION_TARJETA, enOrden, oculto, mover as moverOrden, alternar, restablecer, colocar } from '../orden.js';
import { ve } from '../permisos.js';
import { extrasCalentamiento } from './gym.js';
import { tarjetaPausaFutbol } from './registro.js';
import { tieneVariantes, varianteDe, registrosDeFila } from '../gym.js';

let pestana = 'rutina', diaEd = null, sesionEd = null;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

const TIPOS_HABITO = { check: 'Marcar', cuenta: 'Cuenta regresiva', cronometro: 'Cronómetro', texto: 'Con texto', sesion: 'Sesión guiada', pastilla: 'Pastilla (inicia la espera)', espera: 'Espera después de la pastilla' };
// Calentamiento del día: cualquier sesión de tipo calentamiento ("calentamiento-pierna" se guarda como "pierna", como antes)
const calentamientos = () => ({ '': 'Sin calentamiento', ...Object.fromEntries(e().sesiones.filter((s) => s.tipo === 'calentamiento' && s.id !== 'calentamiento-futbol')
  .map((s) => [s.id.replace(/^calentamiento-/, ''), s.nombre])) });
const PLANES_DIETA = { '': 'Automático (pierna → inferior)', inferior: 'Inferior', superior: 'Superior', descanso: 'Descanso', recarga: 'Recarga' };
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

// Cada elemento se ve cerrado, con su nombre y controles; se abre al tocarlo y resalta mientras se edita
let itemAbierto = null;
// ⠿ asa para arrastrar y ordenar (main.js, arrastrarOrden)
const asa = (nombre) => '<button type="button" class="asa-orden" aria-label="Arrastrar ' + esc(nombre) + ' (o usa las flechas ↑ ↓)" title="Arrastra para ordenar">⠿</button>';
const abrirItem = (r, titulo, ctrl) => '<section class="tarjeta ed-item' + (itemAbierto === r ? ' rec-activa' : '') + '" data-orden-i="' + r.split('.').pop() + '"><div class="ed-cab">' + asa(titulo.replace(/<[^>]+>/g, '')) + '<button type="button" class="ed-titulo" data-accion="ed-abrir" data-r="' + r + '" aria-expanded="' + (itemAbierto === r) + '"><span aria-hidden="true">' + (itemAbierto === r ? '▾' : '▸') + '</span> <b>' + titulo + '</b></button>' + ctrl + '</div><div class="ed-cuerpo"' + (itemAbierto === r ? '' : ' hidden') + '>';
const DIAS_CHIP = ['', 'L', 'M', 'X', 'J', 'V', 'S', 'D'];

// ---------- Hábitos ----------
function editorHabitos() {
  const hs = e().habitos, sesiones = Object.fromEntries(e().sesiones.map((s) => [s.id, s.nombre]));
  const faltan = HABITOS.filter((x) => !hs.some((h) => h.id === x.id)).length;
  return '<p class="nota-corta">El orden es el de la checklist de la mañana (Hoy, Mañana, Progreso, la hoja y el CSV).</p>' +
    '<div class="botones-rapidos">' + (hs.length ? '<button type="button" class="boton secundario" data-accion="ed-habitos-cero">🧹 Empezar de cero</button>' : '') +
    (faltan ? '<button type="button" class="boton secundario" data-accion="ed-habitos-ejemplo">↩ Traer los de ejemplo (' + faltan + ')</button>' : '') + '</div>' +
    (hs.length ? '<p class="nota-corta">⠿ Arrastra para cambiar el orden.</p>' : '<p class="nota-corta">Lista vacía: agrega tus hábitos con "＋ Hábito".</p>') + '<div class="ed-lista" data-orden-lista="habitos">' + hs.map((h, i) => {
    const r = 'habitos.' + i;
    return abrirItem(r, (i + 1) + '. ' + esc(h.nombre), controles('habitos', i, hs.length, h.nombre)) +
      '<div class="dos">' + campo('Nombre', r + '.nombre', h.nombre) + campo('Detalle', r + '.detalle', h.detalle) + '</div>' +
      campo('Versión mínima para un mal día (opcional)', r + '.minimo', h.minimo, ' placeholder="Ej.: 10 min de escucha"') +
      '<p class="nota-corta">Qué días toca (sin marcar, todos):</p><nav class="chips dias-habito">' + [1, 2, 3, 4, 5, 6, 7].map((n) => '<button type="button" class="chip' + ((h.dias || []).includes(n) ? ' activo' : '') + '" data-accion="ed-habito-dia" data-i="' + i + '" data-n="' + n + '" aria-pressed="' + (h.dias || []).includes(n) + '">' + DIAS_CHIP[n] + '</button>').join('') + '</nav>' +
      '<div class="dos">' + lista('Tipo', r + '.tipo', h.tipo, TIPOS_HABITO) +
      (h.tipo === 'cuenta' ? numero('Duración (segundos)', r + '.segundos', h.segundos) : '') +
      (h.tipo === 'cronometro' ? numero('Meta (minutos)', r + '.segundos', Math.round((h.segundos || 0) / 60), ' data-factor="60"') : '') +
      (h.tipo === 'sesion' ? lista('Sesión', r + '.sesion', h.sesion, sesiones) : '') + '</div>' +
      (h.nombre === 'Nuevo hábito' ? ideasHabito(i) : '') +
      (h.tipo === 'espera' && !hs.some((x) => x.tipo === 'pastilla') ? '<p class="aviso">⚠ La espera arranca al marcar un hábito de tipo "Pastilla": agrega uno.</p>' : '') + '</div></section>';
  }).join('') + '</div><button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="habitos">＋ Hábito</button>';
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
    tarjetaPausaFutbol() +
    elegirSesiones('Sesiones del partido', 'config.sesionesPartido', e().config.sesionesPartido) +
    elegirSesiones('Sesiones de los días de descanso', 'config.sesionesDescanso', e().config.sesionesDescanso) + '</section>' +
    (repetidos.length ? '<p class="aviso">⚠ Hay dos días asignados al mismo día de la semana: se usa el primero.</p>' : '') +
    (!d ? '' : '<section class="tarjeta"><div class="ed-cab"><b>Día</b>' + (d.id === 'core' ? '' : controles('rutina', i, rutina.length, d.nombre)) + '</div>' +
      '<div class="dos">' + campo('Nombre', 'rutina.' + i + '.nombre', d.nombre) +
      (d.id === 'core' ? '<p class="nota-corta">El core se anota al final de cualquier día.</p>' : lista('Día de la semana', 'rutina.' + i + '.diaSemana', d.diaSemana, Object.fromEntries(DIAS.map((t, n) => [n ? String(n) : '', t || 'Sin asignar'])), 'num')) + '</div>' +
      (d.id === 'core' ? '' : '<div class="dos dos-largo">' + lista('Calentamiento', 'rutina.' + i + '.calentamiento', d.calentamiento || '', calentamientos()) +
        campo('Cardio', 'rutina.' + i + '.cardio', d.cardio) + '</div>' +
        (d.calentamiento ? elegirSesiones('Junto al calentamiento', 'rutina.' + i + '.extras', extrasCalentamiento(d)) : '') +
        '<div class="dos dos-largo">' + campo('Antes de empezar', 'rutina.' + i + '.previo', d.previo, ' placeholder="Ej.: movilidad previa 5-10 min"') +
        lista('Plan de comida', 'rutina.' + i + '.dieta', d.dieta || '', PLANES_DIETA) + '</div>') +
      '</section>' +
      '<datalist id="musculos">' + musculos.map((m) => '<option value="' + esc(m) + '">').join('') + '</datalist>' +
      // Cada ejercicio es un renglón que se edita ahí mismo (nombre, músculo y series × reps); ⋯ abre lo demás
      (d.ejercicios.length ? '<div class="ed-ej-linea ed-ej-titulos" aria-hidden="true"><span></span><span>Ejercicio</span><span>Músculo</span><span>Series × reps</span><span></span></div>' : '') +
      '<div class="ed-lista" data-orden-lista="rutina.' + i + '.ejercicios">' + d.ejercicios.map((ej, j) => {
        const r = 'rutina.' + i + '.ejercicios.' + j, abierto = itemAbierto === r;
        return '<section class="tarjeta ed-item ed-ej' + (abierto ? ' rec-activa' : '') + '" data-ancla="ed-' + esc(ej.id) + '" data-orden-i="' + j + '"><div class="ed-ej-linea"><span class="ed-num">' + asa(ej.nombre) + '<small>' + (ej.calentamiento ? '🔥' : j + 1) + '</small></span>' +
          '<input class="ed-ej-nombre" type="text" data-cambio="ed" data-ruta="' + r + '.nombre" value="' + esc(ej.nombre) + '" aria-label="Ejercicio ' + (j + 1) + '">' +
          '<input class="ed-ej-musculo" type="text" data-cambio="ed" data-ruta="' + r + '.musculo" value="' + esc(ej.musculo || '') + '" list="musculos" placeholder="Músculo" aria-label="Músculo de ' + esc(ej.nombre) + '">' +
          '<input class="ed-ej-esquema" type="text" data-cambio="ed-esquema" data-ruta="' + r + '" value="' + esc(esquemaDe(ej)) + '" placeholder="3×8-12" aria-label="Series por reps de ' + esc(ej.nombre) + '">' +
          '<button type="button" class="icono ed-mas" data-accion="ed-abrir" data-r="' + r + '" aria-expanded="' + abierto + '" aria-label="Más opciones de ' + esc(ej.nombre) + '">' + (abierto ? '▾' : '⋯') + '</button></div>' +
          (!abierto ? '</section>' : '<div class="ed-cuerpo">' + controles('rutina.' + i + '.ejercicios', j, d.ejercicios.length, ej.nombre) +
          '<div class="dos">' + campo('Nota', r + '.nota', ej.nota, ' placeholder="Técnica, máquina, agarre…"') +
          (rutina.length > 1 ? '<label class="campo">Mover a otro día<select data-cambio="ed-mover-dia" data-dia="' + i + '" data-j="' + j + '"><option value="">—</option>' +
            rutina.map((x, k) => (k === i ? '' : '<option value="' + k + '">' + esc(x.nombre) + '</option>')).join('') + '</select></label>' : '') + '</div>' +
          (tieneVariantes(ej) ? '<div class="ed-variantes"><b>⇄ Variantes</b><p class="nota-corta">Cada una lleva su propio historial. Lo anotado antes de crearlas quedó en la primera. Se agregan desde la tarjeta del Gym.</p>' +
            ej.variantes.map((v, k) => '<div class="ed-variante"><input type="text" data-cambio="ed-variante" data-ruta="' + r + '" data-k="' + k + '" value="' + esc(v) + '" aria-label="Nombre de la variante ' + (k + 1) + '">' +
              '<button type="button" class="icono" data-accion="ed-variante-quitar" data-ruta="' + r + '" data-k="' + k + '" aria-label="Quitar ' + esc(v) + '">✕</button></div>').join('') + '</div>' : '') +
          (d.id !== 'core' && d.ejercicios[j + 1] ? '<label class="interruptor"><input type="checkbox" data-cambio="ed" data-tipo="bool" data-ruta="' + r + '.biserie"' + (ej.biserie ? ' checked' : '') + '> 🔁 En biserie con el siguiente (' + esc(d.ejercicios[j + 1].nombre) + ')</label>' : '') +
          (d.id !== 'core' ? '<label class="interruptor"><input type="checkbox" data-cambio="ed" data-tipo="bool" data-ruta="' + r + '.calentamiento"' + (ej.calentamiento ? ' checked' : '') + '> 🔥 Es del calentamiento (cuenta las series, pero no pide subir peso)</label>' : '') +
          '<div class="ed-descansos">' + ej.filas.map((f, k) => numero('Descanso ' + f.tipo + ' (s) · ' + reloj(f.descanso), r + '.filas.' + k + '.descanso', f.descanso)).join('') + '</div></div></section>');
      }).join('') + '</div>' +
      // Agregar escribiendo en el mismo renglón (Enter o el botón)
      '<section class="tarjeta ed-ej ed-nuevo"><div class="ed-ej-linea"><span class="ed-num">＋</span>' +
      '<input class="ed-ej-nombre" type="text" id="ed-nuevo-nombre" placeholder="Nuevo ejercicio" aria-label="Nombre del ejercicio nuevo" enterkeyhint="next" autocomplete="off">' +
      '<input class="ed-ej-musculo" type="text" id="ed-nuevo-musculo" list="musculos" placeholder="Músculo" aria-label="Músculo del ejercicio nuevo" enterkeyhint="next" autocomplete="off">' +
      '<input class="ed-ej-esquema" type="text" id="ed-nuevo-esquema" placeholder="3×8-12" aria-label="Series por reps del ejercicio nuevo" data-enter="ed-ej-agregar" enterkeyhint="done" autocomplete="off">' +
      '<button type="button" class="boton primario ed-mas" data-accion="ed-ej-agregar" data-lista="rutina.' + i + '.ejercicios">Agregar</button></div></section>' +
      '<p class="nota-corta">⠿ Arrastra del asa para ordenar los ejercicios (en el computador también con las flechas ↑ ↓). Cambia el nombre, el músculo o las series ahí mismo: se guarda al salir del campo y lo ya anotado en el Gym se conserva. ⋯ abre lo demás (orden, nota, descansos, mover de día, duplicar, borrar). ' +
      'Series × reps: "3×8-12", "4×10 + fallo", "1×1 min" o con top set y back-off separados por "·" (también vale "3x8-12").</p>');
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
      (s.tipo === 'checklist' ? '<p class="nota-corta">Cada punto se marca con ✓ en 🧘 Sesiones y la lista se reinicia cada día. ⠿ Arrastra para ordenar.</p><div class="ed-lista" data-orden-lista="sesiones.' + i + '.pasos">' + s.pasos.map((p, j) => {
        const r = 'sesiones.' + i + '.pasos.' + j;
        return abrirItem(r, (j + 1) + '. ' + esc(p.nombre), controles('sesiones.' + i + '.pasos', j, s.pasos.length, p.nombre)) +
          '<div class="dos">' + campo('Punto', r + '.nombre', p.nombre) + campo('Nota (opcional)', r + '.desc', p.desc) + '</div></div></section>';
      }).join('') + '</div><button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="sesiones.' + i + '.pasos">＋ Punto</button>' :
      '<p class="nota-corta">⠿ Arrastra para ordenar.</p><div class="ed-lista" data-orden-lista="sesiones.' + i + '.pasos">' + s.pasos.map((p, j) => {
        const r = 'sesiones.' + i + '.pasos.' + j, porReps = !!p.reps;
        return abrirItem(r, (j + 1) + '. ' + esc(p.nombre), controles('sesiones.' + i + '.pasos', j, s.pasos.length, p.nombre)) +
          '<div class="dos">' + campo('Ejercicio', r + '.nombre', p.nombre) + campo('Músculo', r + '.musculo', p.musculo) + '</div>' +
          '<div class="dos">' + '<label class="campo">Modo<select data-cambio="ed-modo" data-ruta="' + r + '"><option value="tiempo"' + (porReps ? '' : ' selected') + '>Por tiempo</option><option value="reps"' + (porReps ? ' selected' : '') + '>Por repeticiones</option></select></label>' +
          numero('Series', r + '.series', p.series || 1) + '</div>' +
          '<div class="dos">' + (porReps ? campo('Reps', r + '.reps', p.reps, ' placeholder="10-12"') : numero('Segundos', r + '.seg', p.seg)) +
          numero('Descanso entre series (s)', r + '.descanso', p.descanso ?? 30) + '</div>' +
          '<label class="interruptor"><input type="checkbox" data-cambio="ed" data-tipo="bool" data-ruta="' + r + '.lados"' + (p.lados ? ' checked' : '') + '> Por lado (izquierdo y derecho)</label>' +
          '<label class="campo">Descripción<textarea rows="2" data-cambio="ed" data-ruta="' + r + '.desc">' + esc(p.desc || '') + '</textarea></label>' +
          mediosPaso(p, r) + '</div></section>';
      }).join('') + '</div>' +
      '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="sesiones.' + i + '.pasos">＋ Ejercicio</button>'));
}

// ---------- Pantallas: orden y qué se ve del menú, de Hoy y de las metas ----------
const TITULOS_ORDEN = {
  menu: ['☰ Menú', 'Hoy, Editar y Ajustes siempre se ven.'],
  hoy: ['🏠 Tarjetas de Hoy', 'Entrenador, foco y estudio van arriba, a lo ancho; las demás en el tablero.'],
  metas: ['🎯 Metas del día', 'Las escondidas no cuentan en el porcentaje de metas ni en el puntaje.'],
};
function editorPantallas() {
  const c = e().config;
  return Object.entries(TITULOS_ORDEN).map(([tipo, [titulo, nota]]) => {
    // Solo lo que el admin le deja ver a este usuario
    const permitido = (id) => (tipo === 'menu' ? ve('seccion', id) : tipo === 'hoy' ? !SECCION_TARJETA[id] || ve('seccion', SECCION_TARJETA[id]) : true);
    const ids = enOrden(c, tipo).filter(permitido), cat = CATALOGO[tipo];
    return '<section class="tarjeta"><div class="fila-resumen"><h2>' + titulo + '</h2><button type="button" class="boton secundario" data-accion="orden-restablecer" data-tipo="' + tipo + '">↺ Como venía</button></div>' +
      '<p class="nota-corta">' + nota + ' ⠿ Arrastra para ordenar.</p><ul class="lista-orden" data-orden-tipo="' + tipo + '">' + ids.map((id, i) => {
        const nombre = Array.isArray(cat[id]) ? cat[id].join(' ') : cat[id], fija = FIJAS[tipo].includes(id), apagado = oculto(c, tipo, id);
        return '<li' + (apagado ? ' class="apagado"' : '') + ' data-orden-id="' + esc(id) + '">' + asa(nombre) + '<label class="interruptor"><input type="checkbox" data-cambio="orden-ver" data-tipo="' + tipo + '" data-id="' + id + '"' +
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

// Variantes: los ejercicios con el mismo nombre (pierna A y B) las comparten
const mismosEj = (nombre) => e().rutina.flatMap((d) => d.ejercicios).filter((x) => x.nombre === nombre);
const registrosDe = (ejs) => Object.values(e().semanas || {}).flatMap((regs) => ejs.flatMap((x) => x.filas.flatMap((f) => registrosDeFila(regs, f).map((r) => ({ r, x })))));

registrar({
  // Renombrar una variante: sus registros se van con el nombre nuevo
  'ed-variante'({ ruta, k }, el) {
    const ej = obtener(ruta), i = Number(k), viejo = ej.variantes[i], nuevo = el.value.trim();
    if (!nuevo || nuevo === viejo) { repintar(); return; }
    if (ej.variantes.some((v, n) => n !== i && v.toLowerCase() === nuevo.toLowerCase())) { toast('Ya hay una variante "' + nuevo + '"'); repintar(); return; }
    const ejs = mismosEj(ej.nombre);
    for (const { r } of registrosDe(ejs)) if (r.variante === viejo) r.variante = nuevo;
    for (const x of ejs) { x.variantes = x.variantes.map((v) => (v === viejo ? nuevo : v)); if (x.variante === viejo) x.variante = nuevo; }
    guardar();
  },
  // Quitar una variante sin registros (con registros se pierde su historial: primero se pasan a otra desde el Gym)
  'ed-variante-quitar'({ ruta, k }) {
    const ej = obtener(ruta), v = ej.variantes[Number(k)], ejs = mismosEj(ej.nombre);
    const usados = registrosDe(ejs).filter(({ r, x }) => varianteDe(r, x) === v && (String(r.reps || '').trim() || String(r.peso || '').trim())).length;
    if (usados) { toast('"' + v + '" tiene ' + usados + (usados === 1 ? ' registro' : ' registros') + '. Cámbialos a otra variante en el Gym antes de quitarla.'); return; }
    if (!confirm('¿Quitar la variante "' + v + '"?')) return;
    for (const x of ejs) {
      x.variantes = x.variantes.filter((y) => y !== v);
      if (x.variante === v) delete x.variante;
      if (x.variantes.length < 2) { delete x.variantes; delete x.variante; }
    }
    guardar();
  },
  'ed-pestana'({ p }) { pestana = p; itemAbierto = null; repintar(); },
  'ed-abrir'({ r }) { itemAbierto = itemAbierto === r ? null : r; repintar(); },
  'ed-habito-dia'({ i, n }) {
    const h = e().habitos[Number(i)], d = Number(n), dias = (h.dias ??= []), k = dias.indexOf(d);
    if (k < 0) dias.push(d); else dias.splice(k, 1);
    dias.sort();
    guardar();
  },
  'orden-mover'({ tipo, id, n }) { if (moverOrden(e().config, tipo, id, Number(n))) guardar(); },
  'orden-ver'({ tipo, id }) { if (alternar(e().config, tipo, id)) guardar(); },
  'orden-restablecer'({ tipo }) { restablecer(e().config, tipo); guardar(); },
  // Soltar en Pantallas: queda antes del que quedó debajo (vacío = al final)
  'orden-colocar'({ tipo, id, antes }) { if (colocar(e().config, tipo, id, antes || undefined)) guardar(); },
  // Soltar en una lista de Editar: orden = las posiciones viejas en el orden nuevo ("2,0,1"). Solo si es la misma lista, reordenada
  'ed-ordenar'({ lista: ruta, orden }) {
    const arr = obtener(ruta), idx = String(orden).split(',').map(Number);
    if (!Array.isArray(arr) || idx.length !== arr.length || new Set(idx).size !== arr.length || idx.some((n) => !(n >= 0 && n < arr.length))) { repintar(); return; }
    const nuevo = idx.map((n) => arr[n]);
    // El que estaba abierto sigue abierto en su posición nueva
    const abierto = itemAbierto && itemAbierto.startsWith(ruta + '.') ? Number(itemAbierto.slice(ruta.length + 1)) : null;
    if (abierto != null && idx.includes(abierto)) itemAbierto = ruta + '.' + idx.indexOf(abierto);
    arr.splice(0, arr.length, ...nuevo);
    guardar();
  },
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
    if (tipo === 'num') v = v === '' ? null : Math.max(0, Number(String(v).replace(',', '.')) || 0) * (Number(factor) || 1);
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
  // Ejercicio nuevo desde el renglón de abajo: queda listo y el cursor vuelve al nombre para seguir agregando
  'ed-ej-agregar'({ lista: ruta }) {
    const val = (id) => (document.getElementById(id) || { value: '' }).value.trim();
    const nombre = val('ed-nuevo-nombre'), musculo = val('ed-nuevo-musculo'), esquema = val('ed-nuevo-esquema') || '3×8-12';
    if (!nombre) { toast('Escribe el nombre del ejercicio'); document.getElementById('ed-nuevo-nombre')?.focus(); return; }
    const dia = obtener(ruta.replace(/\.ejercicios$/, '')), id = dia.id + '-' + uid();
    let filas;
    try { filas = filasDeEsquema(esquema, musculo === 'Core' ? DESCANSOS.Core : DESCANSOS.Series); } catch (err) { toast('No entendí "' + esquema + '". Ej.: 3×8-12 o Top 1×4-7 · Back-off 2×8-12'); document.getElementById('ed-nuevo-esquema')?.focus(); return; }
    obtener(ruta).push({ id, nombre, musculo, nota: '', filas: filas.map((f, k) => ({ ...f, id: id + '-' + (k + 1) })) });
    for (const c of ['nombre', 'musculo', 'esquema']) document.getElementById('ed-nuevo-' + c).value = '';
    guardar();
    toast('＋ ' + nombre + ' agregado');
    setTimeout(() => document.getElementById('ed-nuevo-nombre')?.focus(), 60);
  },
  'ed-agregar'({ lista: ruta }) {
    const item = nuevo(ruta);
    if (!item) return;
    obtener(ruta).push(item);
    itemAbierto = ruta + '.' + (obtener(ruta).length - 1);
    guardar();
    setTimeout(() => { const t = document.querySelectorAll('.ed-item'); if (t.length) t[t.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
  },
});
