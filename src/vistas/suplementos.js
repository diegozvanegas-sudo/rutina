// 💊 Suplementos: marcar lo que tomaste hoy (o ayer, si se te olvidó anotarlo), la constancia de cada uno y la lista para editar
import { e, dia, guardar, repintar, hayFutbol } from '../estado.js';
import { iso, sumarDias, diaSemana, hora } from '../fechas.js';
import { esc, registrar, toast } from '../ui.js';
import { MOMENTOS, NOMBRE_MOMENTO, PLANTILLAS, avisoPastilla, mismoNombre, deHoy, tomado, marcar, racha, constancia, seAcaba, avisosSuplementos } from '../suplementos.js';
import { adivinarCategoria, pendientes, claveCompra } from '../compras.js';
import { calendarioIcs } from '../registro.js';
import { futbolEnPausa } from '../futbol.js';

// Días de la semana con gym o partido (para los avisos de "solo días de entreno")
function diasEntreno() {
  const c = e().config, futbol = futbolEnPausa(c, iso()) ? [] : c.futbol || [];
  return [...new Set([...e().rutina.map((d) => d.diaSemana), ...futbol])].filter((n) => n >= 1 && n <= 7);
}
// Los avisos de los suplementos, para el calendario de Ajustes y el botón de aquí
export const avisosDeSuplementos = () => avisosSuplementos(datos().lista, diasEntreno());
function descargarCalendario() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([calendarioIcs(e().config, iso(), avisosDeSuplementos())], { type: 'text/calendar;charset=utf-8' }));
  a.download = 'rutina-avisos.ics';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

let cual = 'hoy', editando = null;
const datos = () => (e().suplementos ??= { lista: [] });
const uid = () => 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const DIAS_CORTOS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const opciones = (pares, actual) => pares.map(([id, t]) => '<option value="' + id + '"' + (id === actual ? ' selected' : '') + '>' + t + '</option>').join('');

// Para "solo días de entreno": hay gym ese día de la semana o partido
const info = (f) => { const n = diaSemana(f); return { diaSemana: n, entrena: e().rutina.some((d) => d.diaSemana === n) || hayFutbol(f) }; };
const hacia = (f, n) => Array.from({ length: n }, (_, i) => sumarDias(f, -i));
const deLaFecha = (f) => { const x = info(f); return deHoy(datos().lista, x.diaSemana, x.entrena); };

// Lo de un día, con el botón grande de los hábitos
function lista(f, corta = false) {
  const sups = deLaFecha(f), dias = e().dias;
  if (!sups.length) return '<p class="nota-corta">' + (datos().lista.length ? 'Hoy no te toca ningún suplemento.' : 'Aún no tienes suplementos.') + '</p>';
  return '<ol class="habitos suplementos">' + sups.map((s) => {
    const reg = tomado(dias, f, s.id) && e().dias[f].suplementos[s.id], aviso = avisoPastilla(s, e().habitos);
    const detalle = reg ? 'Tomado a las ' + hora(reg.ts) : [s.dosis, NOMBRE_MOMENTO[s.momento]].filter(Boolean).map(esc).join(' · ');
    return '<li class="habito' + (reg ? ' hecho' : '') + '">' +
      '<button type="button" class="check" data-accion="sup-marcar" data-id="' + s.id + '" data-f="' + f + '" aria-pressed="' + !!reg + '" aria-label="' + esc(s.nombre) + '">' + (reg ? '✓' : esc(s.emoji || '💊')) + '</button>' +
      '<div class="info"><div class="nombre">' + esc(s.nombre) + '</div><div class="detalle">' + detalle + '</div>' +
      (!corta && aviso && !reg ? '<div class="detalle aviso-sup">⚠️ ' + esc(aviso) + '</div>' : '') +
      (seAcaba(s) ? '<div class="detalle aviso-sup">' + (s.quedan ? '📦 Quedan ' + s.quedan + ' tomas' : '📦 Se acabó') +
        (corta ? '' : ' <button type="button" class="boton-suave" data-accion="sup-comprar" data-id="' + s.id + '">🛒 A Compras</button>') + '</div>' : '') +
      '</div></li>';
  }).join('') + '</ol>';
}

// Tarjeta de Hoy (src/vistas/hoy.js)
export function tarjetaSuplementosHoy() {
  const sups = deLaFecha(iso()), hechos = sups.filter((s) => tomado(e().dias, iso(), s.id)).length;
  if (!datos().lista.length) {
    return '<section class="tarjeta col-suplementos"><h2>💊 Suplementos</h2><p class="nota-corta">Anota la creatina y lo demás que tomes, para no saltarte días.</p>' +
      '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="sup-plantilla" data-i="0">＋ Creatina 5 g</button>' +
      '<a class="boton secundario" href="#suplementos">Ver más →</a></div></section>';
  }
  if (!sups.length) return '';
  return '<section class="tarjeta col-suplementos"><div class="fila-resumen"><h2>💊 Suplementos</h2><span class="grande-num">' + hechos + '/' + sups.length + '</span></div>' +
    lista(iso(), true) + '<a class="boton secundario ancho" href="#suplementos">Ver constancia →</a></section>';
}
// Para la fila de "lo que falta hoy" de Hoy: [hechos, total] o null
export function pendienteSuplementos() {
  const sups = deLaFecha(iso());
  return sups.length ? [sups.filter((s) => tomado(e().dias, iso(), s.id)).length, sups.length] : null;
}

// Últimos 7 días de cada uno (✓ tomado · ✗ tocaba y no · – no tocaba), la racha y el % del mes
function seccionConstancia() {
  const hoy = iso(), activos = datos().lista.filter((s) => s.activo !== false);
  if (!activos.length) return '';
  const semana = hacia(hoy, 7).reverse(), mes = hacia(hoy, 30);
  return '<section class="tarjeta"><h2>📈 Tu constancia</h2><ul class="constancia-sup">' + activos.map((s) => {
    const r = racha(s, e().dias, hacia(hoy, 400), info), c = constancia(s, e().dias, mes, info);
    const puntos = semana.map((f) => {
      const x = info(f), toca = deHoy([s], x.diaSemana, x.entrena).length && !(s.creado && f < s.creado);
      const estado = !toca ? 'nada' : tomado(e().dias, f, s.id) ? 'si' : f === hoy ? 'hoy' : 'no';
      return '<span class="punto-sup p-' + estado + '" title="' + f + '">' + DIAS_CORTOS[x.diaSemana - 1] + '</span>';
    }).join('');
    return '<li><div class="fila-resumen"><b>' + esc((s.emoji || '💊') + ' ' + s.nombre) + '</b><span>' + (r ? '🔥 ' + r + (r === 1 ? ' día' : ' días') : '') + '</span></div>' +
      '<div class="puntos-sup">' + puntos + '</div>' +
      '<small class="nota-corta">' + (c.parte == null ? 'Aún sin días para medir' : 'Últimos 30 días: ' + c.tomados + ' de ' + c.tocaban + ' (' + Math.round(c.parte * 100) + ' %)') + '</small></li>';
  }).join('') + '</ul></section>';
}

function fila(s) {
  const titulo = esc((s.emoji || '💊') + ' ' + s.nombre) + (s.activo === false ? ' <small>(en pausa)</small>' : '');
  if (editando !== s.id) {
    const extra = [s.dosis, NOMBRE_MOMENTO[s.momento], s.hora && '⏰ ' + s.hora, s.dias && s.dias.length ? s.dias.map((n) => DIAS_CORTOS[n - 1]).join(' ') : 'todos los días', s.soloEntreno && 'solo días de entreno', s.quedan != null && 'quedan ' + s.quedan].filter(Boolean).map(esc).join(' · ');
    return '<li class="sup-fila"><span><b>' + titulo + '</b><small>' + extra + '</small>' + (s.nota ? '<small>' + esc(s.nota) + '</small>' : '') + '</span>' +
      '<button type="button" class="boton secundario" data-accion="sup-editar" data-id="' + s.id + '">✏️ Editar</button></li>';
  }
  const campo = (k, t, tipo = 'text', extra = '') => '<label class="campo">' + t + '<input type="' + tipo + '"' + extra + ' data-cambio="sup-campo" data-id="' + s.id + '" data-k="' + k + '" value="' + esc(s[k] ?? '') + '"></label>';
  return '<li class="sup-fila editando"><div class="compra-editar">' +
    '<div class="dos">' + campo('nombre', 'Nombre') + campo('emoji', 'Ícono', 'text', ' maxlength="4"') + '</div>' +
    '<div class="dos">' + campo('dosis', 'Dosis') +
    '<label class="campo">Cuándo<select data-cambio="sup-campo" data-id="' + s.id + '" data-k="momento">' + opciones(MOMENTOS, s.momento || 'cualquiera') + '</select></label></div>' +
    '<div class="dos">' + campo('hora', '⏰ Aviso en el calendario y el reloj (opcional)', 'time') + '</div>' +
    '<p class="nota-corta">Días (sin marcar ninguno: todos)</p><div class="chips-dias">' + DIAS_CORTOS.map((d, i) =>
      '<button type="button" class="chip mini' + ((s.dias || []).includes(i + 1) ? ' activo' : '') + '" data-accion="sup-dia" data-id="' + s.id + '" data-n="' + (i + 1) + '" aria-pressed="' + (s.dias || []).includes(i + 1) + '">' + d + '</button>').join('') + '</div>' +
    '<label class="interruptor"><input type="checkbox" data-cambio="sup-entreno" data-id="' + s.id + '"' + (s.soloEntreno ? ' checked' : '') + '> Solo los días de gym o de partido</label>' +
    '<div class="dos">' + campo('quedan', 'Tomas que quedan en el frasco (opcional)', 'number', ' inputmode="numeric" min="0"') + campo('nota', 'Nota') + '</div>' +
    '<label class="interruptor"><input type="checkbox" data-cambio="sup-activo" data-id="' + s.id + '"' + (s.activo === false ? '' : ' checked') + '> Lo estoy tomando (quítalo para pausarlo sin perder el historial)</label>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="sup-editar" data-id="">✓ Listo</button>' +
    '<button type="button" class="boton secundario" data-accion="sup-borrar" data-id="' + s.id + '">🗑 Quitar</button></div></div></li>';
}

function seccionLista() {
  const l = datos().lista, faltan = PLANTILLAS.map((p, i) => [p, i]).filter(([p]) => !l.some((s) => mismoNombre(s.nombre, p.nombre)));
  return '<section class="tarjeta"><h2>🧾 Mis suplementos</h2>' +
    (l.length ? '<ul class="sup-lista">' + l.map(fila).join('') + '</ul>' : '') +
    (faltan.length ? '<p class="nota-corta">Agregar de un toque:</p><div class="chips-compra">' + faltan.map(([p, i]) =>
      '<button type="button" class="chip mini" data-accion="sup-plantilla" data-i="' + i + '">＋ ' + esc(p.emoji + ' ' + p.nombre) + '</button>').join('') + '</div>' : '') +
    '<div class="agregar-habito"><input type="text" id="sup-nuevo" autocomplete="off" data-enter="sup-agregar" placeholder="＋ Otro suplemento (Enter para agregar)" aria-label="Nuevo suplemento">' +
    '<button type="button" class="boton secundario" data-accion="sup-agregar">Agregar</button></div></section>' + seccionAvisos();
}

// Los avisos llegan al reloj por el calendario del celular: suena aunque la app esté cerrada
function seccionAvisos() {
  const av = avisosDeSuplementos();
  if (!datos().lista.length) return '';
  return '<section class="tarjeta"><h2>⏰ Avisos en el reloj</h2>' +
    (av.length ? '<p class="nota-corta">' + av.map((a) => esc(a.hora + ' ' + a.icono + ' ' + a.nombre)).join(' · ') + '</p>'
      : '<p class="nota-corta">Ningún suplemento tiene hora de aviso. Ponle una en ✏️ Editar.</p>') +
    '<p class="nota-corta">Toca el botón, abre el archivo y elige "Agregar todo". El calendario del celular avisa a esa hora y el reloj muestra el aviso, aunque la app esté cerrada. ' +
    'Si cambias una hora, vuelve a agregarlo (si queda repetido, borra el evento viejo del calendario).</p>' +
    '<button type="button" class="boton primario" data-accion="sup-calendario"' + (av.length ? '' : ' disabled') + '>📅 Agregar al calendario</button></section>';
}

export function vistaSuplementos() {
  const f = cual === 'hoy' ? iso() : sumarDias(iso(), -1);
  return '<h1>💊 Suplementos</h1>' +
    '<section class="tarjeta"><div class="fila-resumen"><h2>' + (cual === 'hoy' ? 'Hoy' : 'Ayer') + '</h2>' +
    '<div class="chips-compra">' + [['hoy', 'Hoy'], ['ayer', 'Ayer']].map(([k, t]) =>
      '<button type="button" class="chip mini' + (cual === k ? ' activo' : '') + '" aria-pressed="' + (cual === k) + '" data-accion="sup-cual" data-k="' + k + '">' + t + '</button>').join('') + '</div></div>' +
    (cual === 'ayer' ? '<p class="nota-corta">Si se te olvidó anotar algo ayer, márcalo aquí.</p>' : '') +
    lista(f) + '</section>' + seccionConstancia() + seccionLista();
}

function agregar(base) {
  const nombre = String(base.nombre || '').trim();
  if (!nombre) return null;
  const l = datos().lista;
  if (l.some((s) => mismoNombre(s.nombre, nombre))) { toast('"' + nombre + '" ya está en tu lista'); return null; }
  const s = { id: uid(), emoji: '💊', dosis: '', momento: 'cualquiera', dias: [], soloEntreno: false, quedan: null, activo: true, creado: iso(), ...base, nombre };
  l.push(s);
  return s;
}
const buscar = (id) => datos().lista.find((s) => s.id === id);

registrar({
  'sup-marcar'({ id, f }) {
    const s = buscar(id);
    if (!s) return;
    const quedo = marcar(dia(f || iso()), s);
    guardar();
    if (quedo && s.quedan === 0) toast('📦 Se acabó ' + s.nombre + ': agrégalo a Compras');
  },
  'sup-cual'({ k }) { cual = k; repintar(); },
  'sup-calendario'() { descargarCalendario(); toast('📅 Abre el archivo y elige "Agregar todo"'); },
  'sup-plantilla'({ i }) {
    const p = PLANTILLAS[Number(i)];
    if (p && agregar({ ...p })) { guardar(); toast('＋ ' + p.nombre); }
  },
  'sup-agregar'() {
    const el = document.getElementById('sup-nuevo'), nombre = el ? el.value.trim() : '';
    if (!nombre) { toast('Escribe el nombre del suplemento'); el?.focus(); return; }
    const s = agregar({ nombre });
    if (!s) return;
    editando = s.id;
    guardar();
    toast('＋ ' + nombre + ': ponle la dosis y cuándo lo tomas');
  },
  'sup-editar'({ id }) { editando = id || null; repintar(); },
  'sup-campo'({ id, k }, el) {
    const s = buscar(id);
    if (!s) return;
    if (k === 'quedan') s.quedan = el.value === '' ? null : Math.max(0, Math.round(Number(el.value) || 0));
    else if (k === 'nombre') { const v = el.value.trim(); if (!v) { repintar(); return; } s.nombre = v; }
    else s[k] = el.value.trim();
    guardar();
  },
  'sup-dia'({ id, n }) {
    const s = buscar(id);
    if (!s) return;
    const d = Number(n), ds = (s.dias ||= []);
    if (ds.includes(d)) ds.splice(ds.indexOf(d), 1); else { ds.push(d); ds.sort(); }
    guardar();
  },
  'sup-entreno'({ id }, el) { const s = buscar(id); if (s) { s.soloEntreno = el.checked; guardar(); } },
  'sup-activo'({ id }, el) { const s = buscar(id); if (s) { s.activo = el.checked; guardar(); } },
  'sup-borrar'({ id }) {
    const s = buscar(id);
    if (!s || !confirm('¿Quitar ' + s.nombre + ' de tu lista? Lo que ya anotaste en días pasados se queda guardado. Si solo lo dejaste un tiempo, mejor quita "Lo estoy tomando".')) return;
    datos().lista = datos().lista.filter((x) => x.id !== id);
    editando = null;
    guardar();
  },
  // Lo agrega a la lista del mercado de 🛒 Compras (si no está ya pendiente)
  'sup-comprar'({ id }) {
    const s = buscar(id);
    if (!s) return;
    const c = (e().compras ??= { lista: [], veces: {} });
    if (pendientes(c.lista, 'mercado').some((x) => claveCompra(x.nombre) === claveCompra(s.nombre))) { toast(s.nombre + ' ya está en Compras'); return; }
    const cat = adivinarCategoria(s.nombre);
    c.lista.push({ id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), tipo: 'mercado', nombre: s.nombre, cat: cat === 'otros' ? 'suplementos' : cat, creado: iso(), hecho: false });
    guardar();
    toast('🛒 ' + s.nombre + ' agregado a Compras');
  },
});
