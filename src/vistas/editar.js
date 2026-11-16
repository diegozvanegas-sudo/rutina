// Editar hábitos, rutina, sesiones y pantallas: agregar, cambiar, duplicar, reordenar, mover y borrar.
// Cada campo lleva data-ruta ("rutina.0.ejercicios.3.nombre") y se guarda al salir de él.
import { e, guardar, repintar } from '../estado.js';
import { filasDeEsquema, DESCANSOS, HABITOS, IDEAS_HABITOS } from '../datos_iniciales.js';
import { registrar, toast } from '../ui.js';
import { OPCIONES_FIGURA, videoValido } from '../figuras.js';
import { mover as moverOrden, alternar, restablecer, colocar } from '../orden.js';
import { extrasCalentamiento } from './gym.js';
import { varianteDe, registrosDeFila } from '../gym.js';

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

// Cada elemento se ve cerrado, con su nombre y controles; se abre al tocarlo y resalta mientras se edita
let itemAbierto = null;
const DIAS_CHIP = ['', 'L', 'M', 'X', 'J', 'V', 'S', 'D'];

// ---------- Rutina ----------
export const esquemaDe = (ej) => ej.filas.map((f) => (f.tipo === 'Series' ? '' : f.tipo + ' ') + f.esquema).join(' · ');

// ---------- Pantallas: orden y qué se ve del menú, de Hoy y de las metas ----------
const TITULOS_ORDEN = {
  menu: ['☰ Menú', 'Hoy, Editar y Ajustes siempre se ven.'],
  hoy: ['🏠 Tarjetas de Hoy', 'Entrenador, foco y estudio van arriba, a lo ancho; las demás en el tablero.'],
  metas: ['🎯 Metas del día', 'Las escondidas no cuentan en el porcentaje de metas ni en el puntaje.'],
};

// Lo que la pantalla de React (react/pantallas/Editar.tsx) necesita de aquí: qué está elegido y las listas de opciones
export const piezasEditar = {
  ver: () => ({ pestana, diaEd, sesionEd, itemAbierto }),
  ponerPestana: (p) => { pestana = p; itemAbierto = null; },
  // El día y la sesión que se editan (si el elegido ya no existe, el primero)
  diaElegido: () => { const r = e().rutina; if (!r.some((d) => d.id === diaEd)) diaEd = r[0] && r[0].id; return diaEd; },
  sesionElegida: () => { const s = e().sesiones; if (!s.some((x) => x.id === sesionEd)) sesionEd = s[0] && s[0].id; return sesionEd; },
  calentamientos, obtener, TIPOS_HABITO, PLANES_DIETA, DIAS, DIAS_CHIP, TIPOS_SESION, FIGURAS, TITULOS_ORDEN,
};

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
  'ed-mover-dia'({ lista = 'rutina', dia, j }, el) {
    if (el.value === '') return;
    const rutina = obtener(lista), de = rutina[Number(dia)], a = rutina[Number(el.value)];
    if (!de || !a) return;
    const [ej] = de.ejercicios.splice(Number(j), 1);
    a.ejercicios.push(ej);
    if (lista === 'rutina') diaEd = a.id;
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
    setTimeout(() => { const t = document.querySelectorAll('.ed-item, [data-ed-item]'); if (t.length) t[t.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
  },
});
