// 👥 Clientes: armas la rutina y el plan de comida de otra persona reutilizando tu Gym y tu Dieta, y se los compartes
// (texto para WhatsApp o imagen de la rutina). Los editores de ejercicios y de comidas son los mismos de Editar y de Dieta.
import { e, guardar, repintar } from '../estado.js';
import { esc, registrar, toast, copiarTexto, miles } from '../ui.js';
import { editorEjercicios } from './editar.js';
import { editorComidas, macros, TIPOS_PLAN } from './dieta.js';
import { totalPlan } from '../dieta.js';
import { compartirRutina } from '../imagen-rutina.js';
import { semanaActual } from '../estado.js';
import { nuevoCliente, copiarRutina, copiarDieta, recalcularCliente, objetivoCliente, textoCliente, OBJETIVOS_CLIENTE, PLANES_CLIENTE } from '../clientes.js';

let abierto = null, pestana = 'datos', diaCl = 0, planCl = null, copiarDias = null, copiarPlanes = null;
const lista = () => (e().clientes ??= []);
const idx = () => lista().findIndex((c) => c.id === abierto);
const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const kg = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const series = (c) => c.rutina.reduce((s, d) => s + d.ejercicios.reduce((t, ej) => t + ej.filas.reduce((u, f) => u + f.series, 0), 0), 0);

function listaClientes() {
  const ls = lista();
  return '<h1>Clientes</h1><p class="nota-corta">Arma la rutina y el plan de comida de otras personas a partir de los tuyos, ajústalos y compárteselos por WhatsApp. Ellos no necesitan cuenta.</p>' +
    '<section class="tarjeta cl-nuevo"><div class="cl-agregar"><input type="text" id="cl-nombre" placeholder="Nombre del cliente" aria-label="Nombre del cliente nuevo" data-enter="cl-agregar" enterkeyhint="done" autocomplete="off">' +
    '<button type="button" class="boton primario" data-accion="cl-agregar">＋ Cliente</button></div></section>' +
    (ls.length ? '<div class="lista-rec">' + ls.map((c) => {
      const o = OBJETIVOS_CLIENTE[c.objetivo], planes = Object.keys(c.dieta.planes || {}).length, dias = c.rutina.filter((d) => d.ejercicios.length).length;
      return '<section class="rec-fila cl-fila"><div class="rec-linea"><button type="button" class="rec-abrir" data-accion="cl-abrir" data-id="' + c.id + '">' +
        '<span class="rec-ic" aria-hidden="true">👤</span><b class="rec-nombre">' + esc(c.nombre) + '</b>' +
        '<span class="estado e-programado">' + (o ? o[0] : '') + '</span>' +
        '<span class="rec-cuando">' + [c.peso ? kg(c.peso) + ' kg' : 'sin peso', dias ? dias + (dias === 1 ? ' día' : ' días') + ' de gym' : 'sin rutina', planes ? planes + (planes === 1 ? ' plan' : ' planes') + ' de comida' : 'sin comidas'].join(' · ') + '</span>' +
        '<span class="rec-flecha" aria-hidden="true">▸</span></button></div></section>';
    }).join('') + '</div>' : '<p class="nota-corta centro">Aún no tienes clientes. Escribe un nombre arriba y empieza.</p>');
}

// ---------- Datos ----------
function datos(c, k) {
  const r = 'clientes.' + k;
  return '<section class="tarjeta"><h2>📋 Datos</h2><div class="dos">' +
    '<label class="campo">Nombre<input type="text" data-cambio="ed" data-ruta="' + r + '.nombre" value="' + esc(c.nombre) + '" autocomplete="off"></label>' +
    '<label class="campo">Peso (kg)<input type="text" inputmode="decimal" data-cambio="cl-num" data-k="peso" value="' + (c.peso ? kg(c.peso) : '') + '" placeholder="Ej.: 72,5" autocomplete="off"></label>' +
    '<label class="campo">Estatura (cm)<input type="text" inputmode="numeric" data-cambio="cl-num" data-k="estatura" value="' + (c.estatura || '') + '" placeholder="Ej.: 170" autocomplete="off"></label>' +
    '<label class="campo">Ajuste de comida (%)<input type="text" inputmode="numeric" data-cambio="cl-num" data-k="ajuste" value="' + (c.ajuste || 0) + '" autocomplete="off"></label></div>' +
    '<p class="nota-corta">Objetivo:</p><div class="chips envolver" role="group" aria-label="Objetivo">' + Object.entries(OBJETIVOS_CLIENTE).map(([id, [t]]) =>
      '<button type="button" class="chip' + (c.objetivo === id ? ' activo' : '') + '" data-accion="cl-objetivo" data-v="' + id + '" aria-pressed="' + (c.objetivo === id) + '">' + t + '</button>').join('') + '</div>' +
    '<p class="nota-corta">El ajuste sube o baja los carbos y la grasa sobre tu fórmula (la proteína queda por kg de su peso). Tu fórmula es de déficit, así que al elegir el objetivo se pone uno de partida: 0 % para bajar grasa, +55 % para mantener y +80 % para ganar músculo. Es un punto de partida: si en 2 o 3 semanas su peso no va hacia donde quiere, sube o baja 10 %.</p>' +
    '<label class="campo">Nota (lesiones, horarios, gustos)<textarea rows="2" data-cambio="ed" data-ruta="' + r + '.nota">' + esc(c.nota || '') + '</textarea></label>' +
    '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="cl-duplicar">⧉ Duplicar cliente</button>' +
    '<button type="button" class="boton secundario rec-borrar" data-accion="cl-borrar">🗑 Borrar cliente</button></div></section>';
}

// ---------- Rutina: tus días copiados y el mismo editor de ejercicios de Editar ----------
function rutina(c, k) {
  const r = 'clientes.' + k + '.rutina', mios = e().rutina.filter((d) => d.ejercicios.length);
  copiarDias ??= mios.filter((d) => d.id !== 'core').map((d) => d.id);
  const elegir = '<div class="chips envolver" role="group" aria-label="Días para copiar">' + mios.map((d) =>
    '<button type="button" class="chip' + (copiarDias.includes(d.id) ? ' activo' : '') + '" data-accion="cl-copiar-dia" data-id="' + d.id + '" aria-pressed="' + copiarDias.includes(d.id) + '">' + esc(d.nombre) + '</button>').join('') + '</div>';
  if (!c.rutina.length) return '<section class="tarjeta"><h2>🏋️ Empezar la rutina</h2><p class="nota-corta">Copia tus días (sin tus registros) y después cámbialos para ' + esc(c.nombre) + '. Elige cuáles:</p>' + elegir +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="cl-copiar-rutina">📋 Copiar ' + copiarDias.length + (copiarDias.length === 1 ? ' día' : ' días') + '</button>' +
    '<button type="button" class="boton secundario" data-accion="cl-dia-nuevo">＋ Empezar con un día vacío</button></div></section>';
  if (diaCl >= c.rutina.length) diaCl = 0;
  const d = c.rutina[diaCl], rd = r + '.' + diaCl;
  return '<nav class="chips">' + c.rutina.map((x, i) => '<button type="button" class="chip' + (i === diaCl ? ' activo' : '') + '" data-accion="cl-dia" data-i="' + i + '">' + (x.diaSemana ? DIAS[x.diaSemana].slice(0, 3) + ' · ' : '') + esc(x.nombre) + '</button>').join('') +
    '<button type="button" class="chip" data-accion="cl-dia-nuevo">＋ Día</button></nav>' +
    '<section class="tarjeta"><div class="ed-cab"><b>Día</b><div class="ed-controles">' +
      '<button type="button" class="icono" data-accion="cl-mover-dia" data-n="-1" aria-label="Mover el día antes"' + (diaCl === 0 ? ' disabled' : '') + '>↑</button>' +
      '<button type="button" class="icono" data-accion="cl-mover-dia" data-n="1" aria-label="Mover el día después"' + (diaCl === c.rutina.length - 1 ? ' disabled' : '') + '>↓</button>' +
      '<button type="button" class="icono borrar" data-accion="cl-borrar-dia" aria-label="Borrar el día">🗑</button></div></div>' +
    '<div class="dos"><label class="campo">Nombre<input type="text" data-cambio="ed" data-ruta="' + rd + '.nombre" value="' + esc(d.nombre) + '" autocomplete="off"></label>' +
    '<label class="campo">Día de la semana<select data-cambio="ed" data-tipo="num" data-ruta="' + rd + '.diaSemana">' + DIAS.map((t, n) => '<option value="' + (n || '') + '"' + ((d.diaSemana || 0) === n ? ' selected' : '') + '>' + (t || 'Sin asignar') + '</option>').join('') + '</select></label></div>' +
    '<label class="campo">Cardio<input type="text" data-cambio="ed" data-ruta="' + rd + '.cardio" value="' + esc(d.cardio || '') + '" placeholder="Ej.: cinta 25 min" autocomplete="off"></label></section>' +
    editorEjercicios(r, diaCl) +
    '<details class="nota"><summary>📋 Copiar otro día mío</summary>' + elegir + '<button type="button" class="boton secundario" data-accion="cl-copiar-rutina" data-sumar="1">Agregar ' + copiarDias.length + (copiarDias.length === 1 ? ' día' : ' días') + '</button></details>' +
    '<p class="nota-corta">' + c.rutina.length + (c.rutina.length === 1 ? ' día' : ' días') + ' · ' + series(c) + ' series a la semana.</p>';
}

// ---------- Comidas: tus planes ajustados a su peso, con el mismo editor de Dieta ----------
function comidas(c, k) {
  const planes = c.dieta.planes || {}, tipos = Object.keys(planes);
  copiarPlanes ??= [...PLANES_CLIENTE];
  const elegir = '<div class="chips envolver" role="group" aria-label="Planes para copiar">' + Object.entries(TIPOS_PLAN).map(([t, nombre]) =>
    '<button type="button" class="chip' + (copiarPlanes.includes(t) ? ' activo' : '') + '" data-accion="cl-copiar-plan" data-t="' + t + '" aria-pressed="' + copiarPlanes.includes(t) + '">' + nombre + '</button>').join('') + '</div>';
  const sinPeso = !(c.peso > 0) ? '<p class="aviso">Pon su peso en 📋 Datos para ajustar las cantidades a lo que le toca.</p>' : '';
  if (!tipos.length) return '<section class="tarjeta"><h2>🥗 Empezar el plan de comida</h2><p class="nota-corta">Copia tus planes y se ajustan solos a su peso. Elige cuáles:</p>' + elegir + sinPeso +
    '<button type="button" class="boton primario" data-accion="cl-copiar-dieta">📋 Copiar ' + copiarPlanes.length + (copiarPlanes.length === 1 ? ' plan' : ' planes') + '</button></section>';
  if (!planes[planCl]) planCl = tipos[0];
  const plan = planes[planCl], total = totalPlan(plan, e().dieta.alimentos), obj = objetivoCliente(e().dieta.config, c, planCl);
  return '<nav class="chips">' + tipos.map((t) => '<button type="button" class="chip' + (t === planCl ? ' activo' : '') + '" data-accion="cl-plan" data-t="' + t + '">' + (TIPOS_PLAN[t] || t) + '</button>').join('') + '</nav>' +
    '<section class="tarjeta"><div class="fila-resumen"><b>' + esc(plan.nombre) + '</b>' + macros(total) + '</div>' + sinPeso +
    (obj ? '<p class="nota-corta">Con <b>' + kg(c.peso) + ' kg</b> le toca <b>≈ ' + miles(obj.kcal) + ' kcal</b> (' + kg(obj.kcal / c.peso) + ' kcal por kg): proteína <b>' + obj.p + ' g</b>' + (obj.c != null ? ', carbos <b>' + obj.c + ' g</b>, grasa <b>' + obj.g + ' g</b>' : '') + '. Ajuste: ' + (c.ajuste > 0 ? '+' : '') + (c.ajuste || 0) + ' % (en 📋 Datos).</p>' : '') +
    '<div class="botones-rapidos">' + (c.peso > 0 ? '<button type="button" class="boton primario" data-accion="cl-recalcular">⚖️ Ajustar todo a su peso</button>' : '') +
    '<button type="button" class="boton secundario rec-borrar" data-accion="cl-quitar-plan">Quitar este plan</button></div></section>' +
    editorComidas('clientes.' + k + '.dieta.planes.' + planCl, plan) +
    '<details class="nota"><summary>📋 Copiar más planes míos</summary>' + elegir + '<button type="button" class="boton secundario" data-accion="cl-copiar-dieta" data-sumar="1">Agregar los que falten</button></details>';
}

// ---------- Compartir ----------
function compartir(c) {
  const texto = textoCliente(c, e().dieta);
  return '<section class="tarjeta"><h2>📤 Compartir con ' + esc(c.nombre) + '</h2>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="cl-enviar">📤 Enviar (WhatsApp u otra app)</button>' +
    '<button type="button" class="boton secundario" data-accion="cl-copiar-texto">📋 Copiar texto</button>' +
    (c.rutina.some((d) => d.ejercicios.length && d.diaSemana) ? '<button type="button" class="boton secundario" data-accion="cl-imagen">🖼️ Imagen de la rutina</button>' : '') + '</div>' +
    (c.rutina.some((d) => d.ejercicios.length && !d.diaSemana) ? '<p class="nota-corta">La imagen muestra solo los días con día de la semana asignado (en 🏋️ Rutina).</p>' : '') +
    '<details class="nota" open><summary>Ver el texto</summary><pre class="texto-copia">' + esc(texto) + '</pre></details></section>';
}

export function vistaClientes() {
  const k = idx();
  if (k < 0) { abierto = null; return listaClientes(); }
  const c = lista()[k];
  const tabs = { datos: '📋 Datos', rutina: '🏋️ Rutina', comidas: '🥗 Comidas', compartir: '📤 Compartir' };
  return '<button type="button" class="enlace cl-volver" data-accion="cl-cerrar">← Todos los clientes</button><h1>' + esc(c.nombre) + '</h1>' +
    '<nav class="chips pestanas">' + Object.entries(tabs).map(([t, n]) => '<button type="button" class="chip' + (t === pestana ? ' activo' : '') + '" data-accion="cl-pestana" data-p="' + t + '">' + n + '</button>').join('') + '</nav>' +
    ({ rutina, comidas, compartir }[pestana] || datos)(c, k);
}

const cliente = () => lista()[idx()];
registrar({
  'abrir-clientes'({ p }) { if (lista().some((c) => c.id === p)) { abierto = p; pestana = 'datos'; } },
  'cl-agregar'() {
    const campo = document.getElementById('cl-nombre'), nombre = campo ? campo.value.trim() : '';
    if (!nombre) { toast('Escribe el nombre del cliente'); if (campo) campo.focus(); return; }
    const c = nuevoCliente(nombre);
    lista().push(c);
    abierto = c.id; pestana = 'datos'; diaCl = 0; planCl = null;
    guardar();
    window.scrollTo(0, 0);
    toast('👤 ' + nombre + ' agregado: pon su peso y su objetivo');
  },
  'cl-abrir'({ id }) { abierto = id; pestana = 'datos'; diaCl = 0; planCl = null; repintar(); window.scrollTo(0, 0); },
  'cl-cerrar'() { abierto = null; repintar(); window.scrollTo(0, 0); },
  'cl-pestana'({ p }) { pestana = p; repintar(); window.scrollTo(0, 0); },
  'cl-objetivo'({ v }) { const c = cliente(); c.objetivo = v; c.ajuste = OBJETIVOS_CLIENTE[v][1]; guardar(); },
  'cl-num'({ k }, el) {
    const c = cliente(), t = el.value.trim().replace(',', '.'), n = Number(t);
    if (t === '') c[k] = k === 'ajuste' ? 0 : null;
    else if (!Number.isFinite(n) || (k !== 'ajuste' && n <= 0)) { toast('Escribe un número'); repintar(); return; }
    // Un peso o una estatura imposibles dañan todo el plan de comida: se piden de nuevo
    else if (k === 'peso' && (n < 25 || n > 300)) { toast('Revisa el peso: ' + t.replace('.', ',') + ' kg no parece correcto'); repintar(); return; }
    else if (k === 'estatura' && (n < 100 || n > 250)) { toast('Revisa la estatura: va en centímetros (ej.: 170)'); repintar(); return; }
    else c[k] = k === 'ajuste' ? Math.max(-50, Math.min(100, Math.round(n))) : Math.round(n * 10) / 10;
    guardar();
  },
  'cl-borrar'() {
    const c = cliente();
    if (!confirm('¿Borrar a ' + c.nombre + ' con su rutina y su plan de comida?')) return;
    const i = idx(), quitado = lista().splice(i, 1)[0];
    abierto = null;
    guardar();
    toast('Borrado ' + quitado.nombre, () => { lista().splice(i, 0, quitado); guardar(); });
  },
  'cl-duplicar'() {
    const c = cliente(), copia = { ...JSON.parse(JSON.stringify(c)), ...nuevoCliente(c.nombre + ' (copia)') };
    Object.assign(copia, { objetivo: c.objetivo, peso: c.peso, estatura: c.estatura, ajuste: c.ajuste, nota: c.nota, rutina: copiarRutina(c.rutina, c.rutina.map((d) => d.id), { notas: true }), dieta: JSON.parse(JSON.stringify(c.dieta)) });
    lista().splice(idx() + 1, 0, copia);
    abierto = copia.id;
    guardar();
    toast('⧉ Copia lista: cámbiale el nombre');
  },
  // Rutina
  'cl-copiar-dia'({ id }) { const i = copiarDias.indexOf(id); if (i < 0) copiarDias.push(id); else copiarDias.splice(i, 1); repintar(); },
  'cl-copiar-rutina'({ sumar }) {
    if (!copiarDias.length) { toast('Elige al menos un día'); return; }
    const c = cliente(), nuevos = copiarRutina(e().rutina, copiarDias);
    // En el orden de tu semana
    nuevos.sort((a, b) => (a.diaSemana || 9) - (b.diaSemana || 9));
    if (sumar) { diaCl = c.rutina.length; c.rutina.push(...nuevos); } else { c.rutina = nuevos; diaCl = 0; }
    guardar();
    toast('📋 ' + nuevos.length + (nuevos.length === 1 ? ' día copiado' : ' días copiados') + ': ajústalos para ' + c.nombre);
  },
  'cl-dia-nuevo'() {
    const c = cliente(), id = 'cd' + Date.now().toString(36);
    c.rutina.push({ id, nombre: 'Día ' + (c.rutina.length + 1), diaSemana: null, calentamiento: '', cardio: '', ejercicios: [] });
    diaCl = c.rutina.length - 1;
    guardar();
    setTimeout(() => document.getElementById('ed-nuevo-nombre')?.focus({ preventScroll: true }), 80);
  },
  'cl-dia'({ i }) { diaCl = Number(i); repintar(); },
  'cl-mover-dia'({ n }) {
    const r = cliente().rutina, a = diaCl, b = a + Number(n);
    if (b < 0 || b >= r.length) return;
    [r[a], r[b]] = [r[b], r[a]]; diaCl = b;
    guardar();
  },
  'cl-borrar-dia'() {
    const c = cliente(), d = c.rutina[diaCl];
    if (!d || !confirm('¿Borrar el día "' + d.nombre + '" de ' + c.nombre + '?')) return;
    const i = diaCl, quitado = c.rutina.splice(i, 1)[0];
    diaCl = Math.max(0, i - 1);
    guardar();
    toast('Borrado ' + quitado.nombre, () => { c.rutina.splice(i, 0, quitado); diaCl = i; guardar(); });
  },
  // Comidas
  'cl-copiar-plan'({ t }) { const i = copiarPlanes.indexOf(t); if (i < 0) copiarPlanes.push(t); else copiarPlanes.splice(i, 1); repintar(); },
  'cl-copiar-dieta'({ sumar }) {
    if (!copiarPlanes.length) { toast('Elige al menos un plan'); return; }
    const c = cliente(), antes = { ...(c.dieta.planes || {}) };
    const tipos = sumar ? copiarPlanes.filter((t) => !antes[t]) : copiarPlanes;
    if (sumar && !tipos.length) { toast('Ya tiene esos planes'); return; }
    const tmp = { ...c };
    const ajustado = copiarDieta(e().dieta, tmp, tipos);
    c.dieta = { planes: sumar ? { ...antes, ...tmp.dieta.planes } : tmp.dieta.planes };
    planCl = tipos[0];
    guardar();
    toast('🥗 ' + tipos.length + (tipos.length === 1 ? ' plan copiado' : ' planes copiados') + (ajustado ? ' y ajustados a ' + kg(c.peso) + ' kg' : ': pon su peso para ajustarlos'));
  },
  'cl-plan'({ t }) { planCl = t; repintar(); },
  'cl-recalcular'() {
    const c = cliente(), antes = JSON.parse(JSON.stringify(c.dieta.planes));
    if (!recalcularCliente(e().dieta, c)) { toast('Pon su peso primero'); return; }
    guardar();
    toast('⚖️ Cantidades ajustadas a ' + kg(c.peso) + ' kg', () => { c.dieta.planes = antes; guardar(); });
  },
  'cl-quitar-plan'() {
    const c = cliente(), plan = c.dieta.planes[planCl];
    if (!plan || !confirm('¿Quitar el plan "' + plan.nombre + '" de ' + c.nombre + '?')) return;
    const t = planCl;
    delete c.dieta.planes[t];
    planCl = null;
    guardar();
    toast('Quitado ' + plan.nombre, () => { c.dieta.planes[t] = plan; planCl = t; guardar(); });
  },
  // Compartir
  'cl-copiar-texto'() { const c = cliente(); copiarTexto(textoCliente(c, e().dieta), '📋 Plan de ' + c.nombre + ' copiado: pégalo en WhatsApp'); },
  async 'cl-enviar'() {
    const c = cliente(), texto = textoCliente(c, e().dieta);
    if (navigator.share) { try { await navigator.share({ title: 'Plan de ' + c.nombre, text: texto }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(texto, '📋 Copiado: pégalo en WhatsApp');
  },
  async 'cl-imagen'() {
    const c = cliente();
    try {
      const r = await compartirRutina(semanaActual(), { rutina: c.rutina, sesiones: e().sesiones, semanas: {}, config: { futbol: [], sesionesPartido: [], sesionesDescanso: [], objetivos: e().config.objetivos } },
        { titulo: '🏋️ Rutina de ' + c.nombre, subtitulo: OBJETIVOS_CLIENTE[c.objetivo] ? OBJETIVOS_CLIENTE[c.objetivo][0] : '' });
      if (r === 'descargada') toast('🖼️ Imagen descargada');
    } catch (err) { toast('No se pudo crear la imagen'); }
  },
});
