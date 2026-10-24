// Editar hábitos, rutina y sesiones: agregar, cambiar, reordenar y borrar.
// Cada campo lleva data-ruta ("rutina.0.ejercicios.3.nombre") y se guarda al salir de él.
import { e, guardar, repintar } from '../estado.js';
import { filasDeEsquema, DESCANSOS } from '../datos_iniciales.js';
import { reloj } from '../fechas.js';
import { esc, registrar, toast } from '../ui.js';
import { figuraPaso, OPCIONES_FIGURA, videoValido } from '../figuras.js';

let pestana = 'rutina', diaEd = null, sesionEd = null;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

const TIPOS_HABITO = { check: 'Marcar', cuenta: 'Cuenta regresiva', cronometro: 'Cronómetro', texto: 'Con texto', sesion: 'Sesión guiada', pastilla: 'Pastilla (inicia la espera)', espera: 'Espera después de la pastilla' };
const CALENTAMIENTOS = { '': 'Sin calentamiento', torso: 'Torso', empuje: 'Empuje', tiron: 'Tirón', pierna: 'Pierna' };
const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIPOS_SESION = { calentamiento: 'Calentamiento', estiramiento: 'Estiramiento', fortalecimiento: 'Fortalecimiento', mente: 'Mente', otro: 'Otro' };
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
  '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="' + ruta + '" data-i="' + i + '" data-nombre="' + esc(nombre) + '" aria-label="Borrar">🗑</button></div>';

// ---------- Hábitos ----------
function editorHabitos() {
  const hs = e().habitos, sesiones = Object.fromEntries(e().sesiones.map((s) => [s.id, s.nombre]));
  return '<p class="nota-corta">El orden es el de la checklist de la mañana.</p>' + hs.map((h, i) => {
    const r = 'habitos.' + i;
    return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + (i + 1) + '. ' + esc(h.nombre) + '</b>' + controles('habitos', i, hs.length, h.nombre) + '</div>' +
      '<div class="dos">' + campo('Nombre', r + '.nombre', h.nombre) + campo('Detalle', r + '.detalle', h.detalle) + '</div>' +
      '<div class="dos">' + lista('Tipo', r + '.tipo', h.tipo, TIPOS_HABITO) +
      (h.tipo === 'cuenta' ? numero('Duración (segundos)', r + '.segundos', h.segundos) : '') +
      (h.tipo === 'cronometro' ? numero('Meta (minutos)', r + '.segundos', Math.round((h.segundos || 0) / 60), ' data-factor="60"') : '') +
      (h.tipo === 'sesion' ? lista('Sesión', r + '.sesion', h.sesion, sesiones) : '') + '</div></section>';
  }).join('') + '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="habitos">＋ Hábito</button>';
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
    (repetidos.length ? '<p class="aviso">⚠ Hay dos días asignados al mismo día de la semana: se usa el primero.</p>' : '') +
    (!d ? '' : '<section class="tarjeta"><div class="ed-cab"><b>Día</b>' + (d.id === 'core' ? '' : controles('rutina', i, rutina.length, d.nombre)) + '</div>' +
      '<div class="dos">' + campo('Nombre', 'rutina.' + i + '.nombre', d.nombre) +
      (d.id === 'core' ? '<p class="nota-corta">El core se anota al final de cualquier día.</p>' : lista('Día de la semana', 'rutina.' + i + '.diaSemana', d.diaSemana, Object.fromEntries(DIAS.map((t, n) => [n ? String(n) : '', t || 'Sin asignar'])), 'num')) + '</div>' +
      (d.id === 'core' ? '' : '<div class="dos">' + lista('Calentamiento', 'rutina.' + i + '.calentamiento', d.calentamiento || '', CALENTAMIENTOS) +
        campo('Cardio', 'rutina.' + i + '.cardio', d.cardio) + '</div>' + campo('Antes de empezar', 'rutina.' + i + '.previo', d.previo, ' placeholder="Ej.: movilidad previa 5-10 min"')) +
      '</section>' +
      '<datalist id="musculos">' + musculos.map((m) => '<option value="' + esc(m) + '">').join('') + '</datalist>' +
      d.ejercicios.map((ej, j) => {
        const r = 'rutina.' + i + '.ejercicios.' + j;
        return '<section class="tarjeta ed-item"><div class="ed-cab"><b>' + (j + 1) + '. ' + esc(ej.nombre) + '</b>' + controles('rutina.' + i + '.ejercicios', j, d.ejercicios.length, ej.nombre) + '</div>' +
          '<div class="dos">' + campo('Ejercicio', r + '.nombre', ej.nombre) + campo('Músculo', r + '.musculo', ej.musculo, ' list="musculos"') + '</div>' +
          '<label class="campo">Series × reps<input type="text" data-cambio="ed-esquema" data-ruta="' + r + '" value="' + esc(esquemaDe(ej)) + '" placeholder="Top 1×4-7 · Back-off 2×8-12"></label>' +
          '<div class="ed-descansos">' + ej.filas.map((f, k) => numero('Descanso ' + f.tipo + ' (s) · ' + reloj(f.descanso), r + '.filas.' + k + '.descanso', f.descanso)).join('') + '</div></section>';
      }).join('') +
      '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="rutina.' + i + '.ejercicios">＋ Ejercicio</button>' +
      '<p class="nota-corta">Series × reps: "3×8-12", "4×10 + fallo", "1×1 min" o con top set y back-off separados por "·". ' +
      'Los registros quedan en la misma posición: si reordenas, los registros siguen a su ejercicio.</p>');
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
      '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="sesiones.' + i + '.pasos">＋ Ejercicio</button>');
}

export function vistaEditar() {
  const tabs = { rutina: '🏋️ Rutina', habitos: '☀️ Hábitos', sesiones: '🧘 Sesiones' };
  return '<h1>Editar</h1><nav class="chips pestanas">' + Object.entries(tabs).map(([k, t]) =>
    '<button type="button" class="chip' + (k === pestana ? ' activo' : '') + '" data-accion="ed-pestana" data-p="' + k + '">' + t + '</button>').join('') + '</nav>' +
    (pestana === 'habitos' ? editorHabitos() : pestana === 'sesiones' ? editorSesiones() : editorRutina());
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
  if (/\.pasos$/.test(listaRuta)) return { nombre: 'Nuevo ejercicio', musculo: '', seg: 30, lados: false, desc: '' };
  // Dieta
  if (/\.comidas$/.test(listaRuta)) return { nombre: 'Nueva comida', items: [] };
  if (listaRuta === 'dieta.alimentos') return { id: 'a' + uid(), nombre: 'Nuevo alimento', por: 'g', p: 0, g: 0, c: 0, kcal: 0, grupo: 'otro' };
  // Finanzas
  if (listaRuta === 'finanzas.categorias.gasto') return { id: 'c' + uid(), nombre: 'Nueva categoría', icono: '🏷️', grupo: 'deseo', presupuesto: 0 };
  if (listaRuta === 'finanzas.fijos') return { id: 'f' + uid(), nombre: 'Nuevo pago', monto: 0, categoria: 'servicios', metodo: 'debito', dia: 1 };
  if (listaRuta === 'finanzas.metas') return { id: 'meta' + uid(), nombre: 'Nueva meta', icono: '🎯', objetivo: 0 };
  if (listaRuta === 'finanzas.deudas') return { id: 'd' + uid(), nombre: 'Tarjeta o crédito', saldo: 0, tasa: 2, cuota: 0, dia: 1 };
  return null;
}

registrar({
  'ed-pestana'({ p }) { pestana = p; repintar(); },
  'ed-dia'({ id }) { diaEd = id; repintar(); },
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
