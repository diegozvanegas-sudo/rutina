// 👥 Clientes: armas la rutina y el plan de comida de otra persona reutilizando tu Gym y tu Dieta, y se los compartes
// (texto para WhatsApp o imagen de la rutina). Los editores de ejercicios y de comidas son los mismos de Editar y de Dieta.
import { e, guardar, repintar } from '../estado.js';
import { esc, registrar, toast, copiarTexto, miles, barra } from '../ui.js';
import { editorEjercicios } from './editar.js';
import { editorComidas, macros, TIPOS_PLAN } from './dieta.js';
import { totalPlan } from '../dieta.js';
import { compartirRutina } from '../imagen-rutina.js';
import { semanaActual } from '../estado.js';
import { nuevoCliente, copiarRutina, copiarDieta, recalcularCliente, objetivoCliente, textoCliente, OBJETIVOS_CLIENTE, PLANES_CLIENTE,
  PERIODOS, estadoCobro, resumenNegocio, nuevoCiclo, semanasCiclo, tablaCiclo, semanaDeCiclo, preguntasCheckin, MEDIDAS, PRUEBAS_CLIENTE,
  comparacionValoraciones, pesosCliente, plantillaDe, clienteDePlantilla, htmlPlan } from '../clientes.js';
import { iso, fechaCorta } from '../fechas.js';
import { pesos, leerMonto } from '../finanzas.js';
import { linea } from '../graficos.js';
import { nuevoMovimiento } from './finanzas.js';
import { configurada, nube, llamar } from '../nube.js';
import { planParaPublicar, checkinsNuevos } from '../coach.js';

let abierto = null, pestana = 'datos', diaCl = 0, planCl = null, copiarDias = null, copiarPlanes = null;
const lista = () => (e().clientes ??= []);
const idx = () => lista().findIndex((c) => c.id === abierto);
const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const kg = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const series = (c) => c.rutina.reduce((s, d) => s + d.ejercicios.reduce((t, ej) => t + ej.filas.reduce((u, f) => u + f.series, 0), 0), 0);

const ESTADO_COBRO = { 'sin-plan': ['programado', 'Sin plan'], pausa: ['programado', 'En pausa'], 'al-dia': ['al-dia', 'Al día'], pronto: ['pronto', 'Paga pronto'], vencido: ['vencido', 'Vencido'] };
let filtroCl = '';
const plantillas = () => (e().plantillasCliente ??= []);
function listaClientes() {
  const ls = lista(), n = resumenNegocio(ls), pls = plantillas();
  const filas = ls.map((c) => ({ c, s: estadoCobro(c) })).filter(({ s }) => !filtroCl || s.estado === filtroCl || (filtroCl === 'cobrar' && ['vencido', 'pronto'].includes(s.estado)));
  return '<h1>Clientes</h1>' +
    (ls.length ? '<section class="tarjeta"><h2>📊 Tu negocio</h2><div class="datos-peso">' +
      '<div><small>Activos</small><b>' + n.activos + '</b><small>de ' + n.clientes + '</small></div>' +
      '<div><small>Cobrado este mes</small><b class="verde">' + pesos(n.cobradoMes) + '</b></div>' +
      '<div><small>Por cobrar</small><b class="' + (n.vencidos ? 'rojo' : '') + '">' + pesos(n.porCobrar) + '</b><small>' + n.vencidos + ' vencidos · ' + n.pronto + ' esta semana</small></div></div></section>'
      : '<p class="nota-corta">Arma la rutina, el ciclo y el plan de comida de otras personas a partir de los tuyos, lleva sus check-ins y sus pagos, y compárteles el plan por WhatsApp o en PDF. Ellos no necesitan cuenta.</p>') +
    '<section class="tarjeta cl-nuevo"><div class="cl-agregar"><input type="text" id="cl-nombre" placeholder="Nombre del cliente" aria-label="Nombre del cliente nuevo" data-enter="cl-agregar" enterkeyhint="done" autocomplete="off">' +
    (pls.length ? '<select id="cl-plantilla" aria-label="Empezar desde"><option value="">Empezar vacío</option>' + pls.map((p) => '<option value="' + p.id + '">📚 ' + esc(p.nombre) + '</option>').join('') + '</select>' : '') +
    '<button type="button" class="boton primario" data-accion="cl-agregar">＋ Cliente</button></div></section>' +
    (ls.length > 1 ? '<div class="chips" role="group" aria-label="Filtrar">' + [['', 'Todos (' + ls.length + ')'], ['cobrar', 'Por cobrar (' + (n.vencidos + n.pronto) + ')'], ['vencido', 'Vencidos (' + n.vencidos + ')'], ['al-dia', 'Al día']].map(([k, t]) =>
      '<button type="button" class="chip' + (filtroCl === k ? ' activo' : '') + '" data-accion="cl-filtro" data-v="' + k + '">' + t + '</button>').join('') + '</div>' : '') +
    (ls.length ? '<div class="lista-rec">' + filas.map(({ c, s }) => {
      const o = OBJETIVOS_CLIENTE[c.objetivo], w = semanaDeCiclo(c.ciclo), [clase, texto] = ESTADO_COBRO[s.estado], ultimo = (c.checkins || []).slice(-1)[0];
      return '<section class="rec-fila cl-fila rec-e-' + clase + '"><div class="rec-linea"><button type="button" class="rec-abrir" data-accion="cl-abrir" data-id="' + c.id + '">' +
        '<span class="rec-ic" aria-hidden="true">👤</span><b class="rec-nombre">' + esc(c.nombre) + ' <small>' + (o ? o[0] : '') + '</small></b>' +
        '<span class="estado e-' + clase + '">' + texto + (s.proximo && s.estado !== 'al-dia' ? ' · ' + fechaCorta(s.proximo) : '') + '</span>' +
        '<span class="rec-cuando">' + [c.peso ? kg(c.peso) + ' kg' : 'sin peso', w && w.n ? 'semana ' + w.n + ' · ' + w.fase.nombre : w && w.antes ? 'empieza en ' + w.faltan + ' días' : '', ultimo ? 'check-in ' + fechaCorta(ultimo.fecha) : 'sin check-in'].filter(Boolean).join(' · ') + '</span>' +
        '<span class="rec-flecha" aria-hidden="true">▸</span></button></div></section>';
    }).join('') + '</div>' : '<p class="nota-corta centro">Aún no tienes clientes. Escribe un nombre arriba y empieza.</p>') +
    (pls.length ? '<details class="tarjeta"><summary><h2>📚 Plantillas (' + pls.length + ')</h2></summary><ul class="lista-pesos">' + pls.map((p, i) => '<li><span>' + esc(p.nombre) + '<small> · ' + p.rutina.length + ' días · ' + Object.keys(p.dieta.planes || {}).length + ' planes</small></span>' +
      '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="plantillasCliente" data-i="' + i + '" data-nombre="' + esc(p.nombre) + '" aria-label="Borrar ' + esc(p.nombre) + '">🗑</button></li>').join('') + '</ul></details>' : '');
}

// ---------- 🔗 App: el cliente entra con su cuenta, recibe el plan que publicas y te comparte su avance ----------
let remotos = null, cargandoR = false, errorR = '';
async function cargarRemotos() {
  if (cargandoR) return;
  cargandoR = true; errorR = '';
  try { remotos = await llamar('rutina_coach_clientes'); } catch (err) { errorR = err.message; remotos = remotos || []; }
  cargandoR = false;
  repintar();
}
const enlaceInvitacion = (codigo) => location.origin + location.pathname + '#entrenador/' + codigo;
const textoInvitacion = (c, codigo) => 'Hola ' + c.nombre.split(' ')[0] + ' 👋 Te invito a la app Rutina: ahí vas a tener tu plan de entrenamiento y de comidas, y me compartes tu avance.\n\n' +
  '1. Abre este enlace: ' + enlaceInvitacion(codigo) + '\n2. Entra con tu usuario\n3. Toca «Unirme» (tu código es ' + codigo + ')';
function app(c) {
  if (!configurada) return '<section class="tarjeta"><h2>🔗 App del cliente</h2><p class="aviso">Esta versión de la app no tiene la nube configurada.</p></section>';
  if (!nube.usuario) return '<section class="tarjeta"><h2>🔗 App del cliente</h2><p class="aviso">Inicia sesión en la nube (⚙️ Ajustes) para invitar a tus clientes.</p></section>';
  if (remotos == null && !cargandoR) setTimeout(cargarRemotos, 0);
  const a = (remotos || []).find((x) => x.local === c.id), r = a && a.resumen;
  const explicacion = '<p class="nota-corta">Con su cuenta, ' + esc(c.nombre) + ' ve su plan en su Gym y su Dieta, anota sus entrenos y te manda su check-in. Tú ves un resumen de su avance: series por semana, peso, sueño, fuerza y check-ins. No ves el resto de sus datos y él puede cortar cuando quiera.</p>';
  if (remotos == null) return '<section class="tarjeta"><h2>🔗 App del cliente</h2><p class="nota-corta">Cargando…</p></section>';
  if (!a) return '<section class="tarjeta"><h2>🔗 App del cliente</h2>' + explicacion + (errorR ? '<p class="aviso">' + esc(errorR) + '</p>' : '') +
    '<button type="button" class="boton primario" data-accion="cl-invitar">🔗 Invitar a la app</button>' +
    '<p class="nota-corta">Necesita un usuario para entrar. La app aún no deja crear cuentas: créaselo tú en Supabase (Authentication → Add user) y mándale su correo y contraseña.</p></section>';
  if (a.estado === 'invitado') return '<section class="tarjeta"><h2>🔗 Invitación enviada</h2><p>Código: <b class="cl-codigo">' + esc(a.codigo) + '</b></p>' +
    '<p class="nota-corta">Cuando lo acepte, aquí ves su correo y su avance.</p>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="cl-invitacion-enviar" data-codigo="' + esc(a.codigo) + '">📤 Mandarle la invitación</button>' +
    '<button type="button" class="boton secundario" data-accion="cl-remotos">🔄 Revisar si ya aceptó</button>' +
    '<button type="button" class="boton secundario rec-borrar" data-accion="cl-terminar">Cancelar invitación</button></div>' + explicacion + '</section>';
  const nuevos = checkinsNuevos(c, r), sem = (r && r.semanas) || [], ps = (r && r.pesos) || [];
  return '<section class="tarjeta"><h2>🔗 Conectado</h2><p class="nota-corta">' + esc(a.correo || '') + (a.aceptado ? ' · desde el ' + fechaCorta(String(a.aceptado).slice(0, 10)) : '') + '</p>' +
    '<p>' + (a.plan_version ? 'Plan publicado el <b>' + fechaCorta(iso(new Date(Number(a.plan_version)))) + '</b>.' : 'Aún no le has publicado el plan.') + '</p>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="cl-publicar">📲 ' + (a.plan_version ? 'Publicar los cambios' : 'Publicar su plan') + '</button>' +
    '<button type="button" class="boton secundario" data-accion="cl-remotos">🔄 Actualizar</button></div>' +
    '<p class="nota-corta">Le llega su rutina, su ciclo y sus comidas. Cada vez que cambies algo, publica de nuevo: él decide cuándo usarlo.</p></section>' +
    '<section class="tarjeta"><h2>📊 Su avance</h2>' + (!r ? '<p class="nota-corta">Aún no ha compartido nada (se manda solo cuando abre la app).</p>' :
      '<p class="nota-corta">Actualizado el ' + fechaCorta(r.actualizado) + ' · semana ' + r.semana + ' de su Gym' + (r.sueno ? ' · duerme ' + String(r.sueno).replace('.', ',') + ' h en promedio' : '') + '</p>' +
      '<div class="cl-avance">' + sem.map((x) => '<div><small>S' + x.n + '</small><b>' + x.hechas + '/' + x.plan + '</b>' + barra(x.plan ? x.hechas / x.plan : 0) + '</div>').join('') + '</div>' +
      (ps.length ? '<p>⚖️ ' + kg(ps[0].peso) + ' → <b>' + kg(ps[ps.length - 1].peso) + ' kg</b> <small>(' + fechaCorta(ps[0].fecha) + ' – ' + fechaCorta(ps[ps.length - 1].fecha) + ')</small></p>' : '') +
      ((r.fuerza || []).length ? '<h3>💪 Fuerza (4 semanas)</h3><ul class="fuerza-lista">' + r.fuerza.map((x) => '<li><span>' + esc(x.nombre) + '<small>' + kg(x.de.peso) + ' × ' + x.de.reps + ' → ' + kg(x.a.peso) + ' × ' + x.a.reps + ' ' + esc(x.a.unidad || '') + '</small></span><b class="' + (x.cambio > 0.005 ? 'sube' : x.cambio < -0.005 ? 'baja' : '') + '">' + (x.cambio >= 0 ? '+' : '') + Math.round(x.cambio * 1000) / 10 + ' %</b></li>').join('') + '</ul>' : '') +
      (nuevos.length ? '<p class="aviso">📥 ' + nuevos.length + (nuevos.length === 1 ? ' check-in nuevo' : ' check-ins nuevos') + ' (el último del ' + fechaCorta(nuevos[nuevos.length - 1].fecha) + ').</p><button type="button" class="boton primario" data-accion="cl-traer-checkins">Pasarlos a 📈 Seguimiento</button>' : '')) + '</section>' +
    '<button type="button" class="enlace rec-borrar" data-accion="cl-terminar">Terminar la conexión con ' + esc(c.nombre) + '</button>';
}

// ---------- 💳 Plan y cobro ----------
function cobro(c, k) {
  const kb = (c.cobro ??= { precio: 0, cada: 'mes', inicio: iso(), pausa: false, pagos: [] }), s = estadoCobro(c), [clase, texto] = ESTADO_COBRO[s.estado];
  const pagos = (kb.pagos || []).map((p, i) => [p, i]).sort((a, b) => b[0].fecha.localeCompare(a[0].fecha));
  return '<section class="tarjeta"><h2>💳 Plan y pago</h2>' +
    '<div class="fila-resumen"><span class="estado e-' + clase + '">' + texto + '</span><span>' + (s.proximo ? 'Próximo cobro: <b>' + fechaCorta(s.proximo) + '</b>' + (s.faltan != null ? ' (' + (s.faltan < 0 ? 'hace ' + -s.faltan : s.faltan === 0 ? 'hoy' : 'en ' + s.faltan) + (Math.abs(s.faltan) === 1 ? ' día' : s.faltan === 0 ? '' : ' días') + ')' : '') : s.ultimo ? 'Último pago: ' + fechaCorta(s.ultimo.fecha) : '') + '</span></div>' +
    '<div class="dos"><label class="campo">Precio<input type="text" inputmode="numeric" data-pesos data-cambio="cl-cobro" data-k="precio" value="' + (kb.precio ? miles(kb.precio) : '') + '" placeholder="$ 0" autocomplete="off"></label>' +
    '<label class="campo">Cada cuánto<select data-cambio="cl-cobro" data-k="cada">' + Object.entries(PERIODOS).map(([id, [t]]) => '<option value="' + id + '"' + (kb.cada === id ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></label>' +
    '<label class="campo">Primer cobro<input type="date" data-cambio="cl-cobro" data-k="inicio" value="' + esc(kb.inicio || '') + '"></label></div>' +
    '<label class="interruptor"><input type="checkbox" data-cambio="cl-cobro" data-k="pausa"' + (kb.pausa ? ' checked' : '') + '> ⏸ En pausa (no cuenta como activo ni avisa del cobro)</label>' +
    (kb.precio > 0 ? '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="cl-pagar">✓ Registrar pago de ' + pesos(kb.precio) + ' hoy</button></div>' +
      '<label class="interruptor"><input type="checkbox" id="cl-a-finanzas" checked> También anotarlo como ingreso en 💰 Finanzas</label>' : '<p class="nota-corta">Pon el precio para llevar sus pagos.</p>') +
    (pagos.length ? '<h3>Pagos</h3><ul class="lista-pesos">' + pagos.map(([p, i]) => '<li><span>' + fechaCorta(p.fecha) + '</span><span>' + pesos(p.monto) +
      ' <button type="button" class="icono borrar" data-accion="cl-pago-borrar" data-i="' + i + '" aria-label="Borrar el pago del ' + fechaCorta(p.fecha) + '">🗑</button></span></li>').join('') + '</ul>' : '') + '</section>';
}

// ---------- 📆 Ciclo: macrociclo → mesociclos (fases) → semanas ----------
function ciclo(c, k) {
  if (!c.ciclo) return '<section class="tarjeta"><h2>📆 Ciclo de entrenamiento</h2><p class="nota-corta">Un macrociclo de 12 semanas con las fases de tu plan: base (técnica y punto de partida), progresión (más peso o reps cada semana), descarga (la mitad de las series) e intensificación (última serie cerca del fallo). Después cambias las semanas y los objetivos de cada fase.</p>' +
    '<label class="campo">Empieza el (lunes)<input type="date" id="cl-ciclo-inicio" value="' + (() => { const d = new Date(); const n = (8 - (d.getDay() || 7)) % 7; d.setDate(d.getDate() + n); return iso(d); })() + '"></label>' +
    '<button type="button" class="boton primario" data-accion="cl-ciclo-crear">📆 Crear el ciclo de 12 semanas</button></section>';
  const r = 'clientes.' + k + '.ciclo', t = tablaCiclo(c.ciclo), w = semanaDeCiclo(c.ciclo);
  return '<section class="tarjeta"><h2>📆 Ciclo de ' + semanasCiclo(c.ciclo) + ' semanas</h2>' +
    '<p class="nota-corta">' + (w && w.n ? 'Va en la <b>semana ' + w.n + '</b>: fase <b>' + esc(w.fase.nombre) + '</b> (reps en reserva ' + esc(w.fase.rir) + '). ' + esc(w.fase.objetivo) : w && w.antes ? 'Empieza el ' + fechaCorta(c.ciclo.inicio) + ' (en ' + w.faltan + ' días).' : w && w.terminado ? '✓ Terminó. Haz la valoración final y arma el siguiente ciclo.' : '') + '</p>' +
    '<label class="campo">Empieza el<input type="date" data-cambio="ed" data-ruta="' + r + '.inicio" value="' + esc(c.ciclo.inicio) + '"></label>' +
    '<div class="cl-semanas" role="list" aria-label="Semanas del ciclo">' + t.map((x) => '<span role="listitem" class="cl-sem f' + (x.k % 4) + (x.actual ? ' actual' : x.pasada ? ' pasada' : '') + '" title="Semana ' + x.n + ': ' + esc(x.fase.nombre) + ', ' + fechaCorta(x.desde) + ' – ' + fechaCorta(x.hasta) + (x.revision ? ' · revisión' : '') + '">' + x.n + (x.revision ? '<i aria-hidden="true">•</i>' : '') + '</span>').join('') + '</div>' +
    '<p class="nota-corta">• = semana de revisión (la primera y la última de cada fase): pide valoración y check-in.</p></section>' +
    '<h2 class="titulo-grupo">Fases (mesociclos)</h2><div class="ed-lista" data-orden-lista="' + r + '.fases">' + c.ciclo.fases.map((x, i) =>
      '<section class="tarjeta ed-item cl-fase f' + (i % 4) + '" data-orden-i="' + i + '"><div class="cl-fase-cab"><button type="button" class="asa-orden" aria-label="Arrastrar ' + esc(x.nombre) + '">⠿</button>' +
      '<input type="text" class="ed-ej-nombre" data-cambio="ed" data-ruta="' + r + '.fases.' + i + '.nombre" value="' + esc(x.nombre) + '" aria-label="Nombre de la fase">' +
      '<label class="cl-mini">Semanas<input type="text" inputmode="numeric" data-cambio="cl-fase-semanas" data-i="' + i + '" value="' + x.semanas + '" aria-label="Semanas de ' + esc(x.nombre) + '"></label>' +
      '<label class="cl-mini">RIR<input type="text" data-cambio="ed" data-ruta="' + r + '.fases.' + i + '.rir" value="' + esc(x.rir) + '" aria-label="Reps en reserva de ' + esc(x.nombre) + '"></label>' +
      '<button type="button" class="icono borrar" data-accion="cl-fase-borrar" data-i="' + i + '" aria-label="Borrar la fase ' + esc(x.nombre) + '">🗑</button></div>' +
      '<textarea rows="2" data-cambio="ed" data-ruta="' + r + '.fases.' + i + '.objetivo" aria-label="Objetivo de ' + esc(x.nombre) + '">' + esc(x.objetivo || '') + '</textarea></section>').join('') + '</div>' +
    '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="cl-fase-nueva">＋ Fase</button><button type="button" class="boton secundario rec-borrar" data-accion="cl-ciclo-borrar">Quitar el ciclo</button></div>';
}

// ---------- 📈 Seguimiento: check-ins y valoraciones ----------
function seguimiento(c, k) {
  const ck = (c.checkins ||= []), vs = (c.valoraciones ||= []), pesosC = pesosCliente(c), comp = comparacionValoraciones(vs);
  const num = (id, titulo, ph = '', modo = 'decimal') => '<label class="campo">' + titulo + '<input type="text" inputmode="' + modo + '" id="' + id + '" placeholder="' + ph + '" autocomplete="off" enterkeyhint="next"></label>';
  // Del 1 al 5 con el teclado numérico (Enter pasa al siguiente, sin abrir una lista)
  const escala = (id, titulo) => num(id, titulo, '1 a 5', 'numeric');
  return '<section class="tarjeta"><h2>✅ Check-in de la semana</h2>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="cl-checkin-pedir">📤 Pedirle el check-in por WhatsApp</button></div>' +
    '<p class="nota-corta">Cuando te responda, anótalo aquí:</p><div class="dos">' +
    num('ck-peso', 'Peso (kg)', c.peso ? kg(c.peso) : '') + escala('ck-sueno', 'Sueño (1-5)') + escala('ck-energia', 'Energía (1-5)') +
    num('ck-entreno', 'Entrenos hechos', 'Ej.: 4', 'numeric') + num('ck-comida', 'Plan de comida (%)', 'Ej.: 80', 'numeric') + '</div>' +
    '<label class="campo">Nota<input type="text" id="ck-nota" placeholder="Molestias, dudas, lo que te contó" autocomplete="off" data-enter="cl-checkin"></label>' +
    '<button type="button" class="boton primario ancho" data-accion="cl-checkin">Guardar check-in</button>' +
    (ck.length ? '<ul class="lista-pesos cl-checkins">' + ck.map((x, i) => [x, i]).reverse().map(([x, i]) => '<li><span><b>' + fechaCorta(x.fecha) + '</b> ' +
      [x.peso ? kg(x.peso) + ' kg' : '', x.sueno ? '🌙 ' + x.sueno : '', x.energia ? '⚡ ' + x.energia : '', x.entreno != null && x.entreno !== '' ? '🏋️ ' + x.entreno : '', x.comida != null && x.comida !== '' ? '🥗 ' + x.comida + ' %' : ''].filter(Boolean).join(' · ') +
      (x.nota ? '<small>' + esc(x.nota) + '</small>' : '') + '</span><button type="button" class="icono borrar" data-accion="cl-registro-borrar" data-lista="checkins" data-i="' + i + '" aria-label="Borrar check-in del ' + fechaCorta(x.fecha) + '">🗑</button></li>').join('') + '</ul>' : '') + '</section>' +
    (pesosC.length >= 2 ? '<section class="tarjeta"><h2>⚖️ Peso</h2>' + linea(pesosC.map((x) => ({ etiqueta: fechaCorta(x.fecha), v: x.peso, tip: fechaCorta(x.fecha) + ': ' + kg(x.peso) + ' kg' })), { formato: kg }) +
      '<p class="nota-corta">' + kg(pesosC[0].peso) + ' → <b>' + kg(pesosC[pesosC.length - 1].peso) + ' kg</b> (' + (pesosC[pesosC.length - 1].peso >= pesosC[0].peso ? '+' : '−') + kg(Math.abs(pesosC[pesosC.length - 1].peso - pesosC[0].peso)) + ' kg desde el ' + fechaCorta(pesosC[0].fecha) + ')</p></section>' : '') +
    '<section class="tarjeta"><h2>📏 Valoración</h2><p class="nota-corta">Al empezar y en cada semana de revisión del ciclo. Llena lo que midas.</p><div class="dos">' +
    MEDIDAS.map(([id, t, u]) => num('va-' + id, t + ' (' + u + ')')).join('') + PRUEBAS_CLIENTE.map(([id, t, u]) => num('va-' + id, t + ' (' + u + ')')).join('') + '</div>' +
    '<button type="button" class="boton primario ancho" data-accion="cl-valoracion">Guardar valoración</button>' +
    (comp.length ? '<h3>Cambio desde el ' + fechaCorta(comp[0].desde) + '</h3><ul class="lista-pesos">' + comp.map((x) => '<li><span>' + esc(x.nombre) + '</span><span>' + kg(x.antes) + ' → <b>' + kg(x.ahora) + ' ' + x.u + '</b> <small class="' + (x.cambio === 0 ? '' : (x.cambio > 0) === !['peso', 'cintura', 'cadera'].includes(x.k) ? 'verde' : 'rojo') + '">' + (x.cambio > 0 ? '+' : '') + kg(x.cambio) + '</small></span></li>').join('') + '</ul>' : '') +
    (vs.length ? '<details class="nota"><summary>Valoraciones (' + vs.length + ')</summary><ul class="lista-pesos">' + vs.map((x, i) => [x, i]).reverse().map(([x, i]) => '<li><span>' + fechaCorta(x.fecha) + '<small>' +
      [...MEDIDAS, ...PRUEBAS_CLIENTE].filter(([id]) => x[id] > 0).map(([id, t, u]) => t + ' ' + kg(x[id]) + ' ' + u).join(' · ') + '</small></span><button type="button" class="icono borrar" data-accion="cl-registro-borrar" data-lista="valoraciones" data-i="' + i + '" aria-label="Borrar valoración del ' + fechaCorta(x.fecha) + '">🗑</button></li>').join('') + '</ul></details>' : '') + '</section>';
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
    '<button type="button" class="boton secundario" data-accion="cl-pdf">🖨️ PDF del plan</button>' +
    (c.rutina.some((d) => d.ejercicios.length && d.diaSemana) ? '<button type="button" class="boton secundario" data-accion="cl-imagen">🖼️ Imagen de la rutina</button>' : '') + '</div>' +
    '<p class="nota-corta">En 🖨️ PDF elige "Guardar como PDF" y mándaselo.</p>' +
    (c.rutina.some((d) => d.ejercicios.length && !d.diaSemana) ? '<p class="nota-corta">La imagen muestra solo los días con día de la semana asignado (en 🏋️ Rutina).</p>' : '') +
    '<details class="nota"><summary>Ver el texto</summary><pre class="texto-copia">' + esc(texto) + '</pre></details></section>' +
    '<section class="tarjeta"><h2>📚 Guardar como plantilla</h2><p class="nota-corta">Guarda la rutina, las comidas y el ciclo de ' + esc(c.nombre) + ' para empezar otro cliente igual (al agregarlo, elige la plantilla).</p>' +
    '<div class="cl-agregar"><input type="text" id="cl-plantilla-nombre" placeholder="Ej.: Hipertrofia 4 días" value="" autocomplete="off" data-enter="cl-plantilla-guardar">' +
    '<button type="button" class="boton secundario" data-accion="cl-plantilla-guardar">Guardar</button></div></section>';
}

export function vistaClientes() {
  const k = idx();
  if (k < 0) { abierto = null; return listaClientes(); }
  const c = lista()[k];
  const tabs = { datos: '📋 Datos', cobro: '💳 Pago', rutina: '🏋️ Rutina', ciclo: '📆 Ciclo', comidas: '🥗 Comidas', seguimiento: '📈 Seguimiento', app: '🔗 App', compartir: '📤 Compartir' };
  return '<button type="button" class="enlace cl-volver" data-accion="cl-cerrar">← Todos los clientes</button><h1>' + esc(c.nombre) + '</h1>' +
    '<nav class="chips pestanas">' + Object.entries(tabs).map(([t, n]) => '<button type="button" class="chip' + (t === pestana ? ' activo' : '') + '" data-accion="cl-pestana" data-p="' + t + '">' + n + '</button>').join('') + '</nav>' +
    ({ cobro, rutina, ciclo, comidas, seguimiento, app, compartir }[pestana] || datos)(c, k);
}

const cliente = () => lista()[idx()];
registrar({
  'abrir-clientes'({ p }) { if (lista().some((c) => c.id === p)) { abierto = p; pestana = 'datos'; } },
  'cl-agregar'() {
    const campo = document.getElementById('cl-nombre'), nombre = campo ? campo.value.trim() : '';
    if (!nombre) { toast('Escribe el nombre del cliente'); if (campo) campo.focus(); return; }
    const sel = document.getElementById('cl-plantilla'), pl = sel && sel.value ? plantillas().find((x) => x.id === sel.value) : null;
    const c = pl ? clienteDePlantilla(pl, nombre) : nuevoCliente(nombre);
    lista().push(c);
    abierto = c.id; pestana = 'datos'; diaCl = 0; planCl = null;
    guardar();
    window.scrollTo(0, 0);
    toast('👤 ' + nombre + ' agregado' + (pl ? ' con la plantilla «' + pl.nombre + '»' : '') + ': pon su peso y su objetivo');
  },
  'cl-abrir'({ id }) { abierto = id; pestana = 'datos'; diaCl = 0; planCl = null; repintar(); window.scrollTo(0, 0); },
  'cl-cerrar'() { abierto = null; repintar(); window.scrollTo(0, 0); },
  'cl-filtro'({ v }) { filtroCl = v; repintar(); },
  // App del cliente
  'cl-remotos'() { cargarRemotos(); },
  async 'cl-invitar'() {
    const c = cliente();
    try { const r = await llamar('rutina_coach_invitar', { p_local: c.id }); await cargarRemotos(); toast('🔗 Código ' + r.codigo + ': mándale la invitación'); } catch (err) { toast('⚠️ ' + err.message); }
  },
  async 'cl-invitacion-enviar'({ codigo }) {
    const t = textoInvitacion(cliente(), codigo);
    if (navigator.share) { try { await navigator.share({ title: 'Invitación a Rutina', text: t }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(t, '📋 Invitación copiada: pégala en WhatsApp');
  },
  async 'cl-publicar'() {
    const c = cliente();
    if (!c.rutina.length && !Object.keys(c.dieta.planes || {}).length) { toast('Primero arma su rutina o sus comidas'); return; }
    try { await llamar('rutina_coach_publicar', { p_local: c.id, p_plan: planParaPublicar(c, e().dieta) }); await cargarRemotos(); toast('📲 Plan publicado: le llega a ' + c.nombre + ' al abrir la app'); } catch (err) { toast('⚠️ ' + err.message); }
  },
  async 'cl-terminar'() {
    const c = cliente();
    if (!confirm('¿Terminar la conexión con ' + c.nombre + '? Deja de recibir tus planes y tú dejas de ver su avance. Lo que tienes aquí de ' + c.nombre + ' se queda.')) return;
    try { await llamar('rutina_coach_terminar', { p_local: c.id }); await cargarRemotos(); toast('Conexión terminada'); } catch (err) { toast('⚠️ ' + err.message); }
  },
  'cl-traer-checkins'() {
    const c = cliente(), a = (remotos || []).find((x) => x.local === c.id), nuevos = checkinsNuevos(c, a && a.resumen);
    if (!nuevos.length) return;
    (c.checkins ||= []).push(...nuevos.map((x) => ({ ...x })));
    c.checkins.sort((x, y) => x.fecha.localeCompare(y.fecha));
    const conPeso = nuevos.filter((x) => x.peso > 0).pop();
    if (conPeso) c.peso = conPeso.peso;
    guardar();
    toast('📥 ' + nuevos.length + (nuevos.length === 1 ? ' check-in pasado' : ' check-ins pasados') + ' a Seguimiento');
  },
  // Cobro
  'cl-cobro'({ k }, el) {
    const kb = (cliente().cobro ??= { precio: 0, cada: 'mes', inicio: iso(), pagos: [] });
    if (k === 'precio') kb.precio = leerMonto(el.value) || 0;
    else if (k === 'pausa') kb.pausa = el.checked;
    else kb[k] = el.value;
    guardar();
  },
  'cl-pagar'() {
    const c = cliente(), kb = c.cobro, pago = { fecha: iso(), monto: kb.precio };
    (kb.pagos ??= []).push(pago);
    const aFin = document.getElementById('cl-a-finanzas');
    if (aFin && aFin.checked) {
      const cats = e().finanzas.categorias.ingreso, cat = (cats.find((x) => /freelance|extra/i.test(x.nombre)) || cats.find((x) => x.id === 'otro-ingreso') || cats[0]).id;
      nuevoMovimiento({ tipo: 'ingreso', monto: kb.precio, categoria: cat, metodo: 'transferencia', nota: 'Asesoría ' + c.nombre, fecha: pago.fecha });
    }
    guardar();
    toast('✓ Pago de ' + c.nombre + ': ' + pesos(kb.precio) + (aFin && aFin.checked ? ' (también en Finanzas)' : ''));
  },
  'cl-pago-borrar'({ i }) {
    const kb = cliente().cobro, p = kb.pagos[Number(i)];
    if (!p || !confirm('¿Borrar el pago del ' + fechaCorta(p.fecha) + '? Si lo anotaste en Finanzas, bórralo también allá.')) return;
    kb.pagos.splice(Number(i), 1);
    guardar();
  },
  // Ciclo
  'cl-ciclo-crear'() { const campo = document.getElementById('cl-ciclo-inicio'); cliente().ciclo = nuevoCiclo(campo && campo.value ? campo.value : undefined); guardar(); toast('📆 Ciclo de 12 semanas listo: ajusta las fases'); },
  'cl-ciclo-borrar'() {
    const c = cliente(), antes = c.ciclo;
    if (!confirm('¿Quitar el ciclo de ' + c.nombre + '?')) return;
    c.ciclo = null; guardar();
    toast('Ciclo quitado', () => { c.ciclo = antes; guardar(); });
  },
  'cl-fase-semanas'({ i }, el) {
    const n = Math.round(Number(el.value));
    if (!(n >= 1 && n <= 20)) { toast('Entre 1 y 20 semanas'); repintar(); return; }
    cliente().ciclo.fases[Number(i)].semanas = n; guardar();
  },
  'cl-fase-nueva'() { cliente().ciclo.fases.push({ id: 'f' + Date.now().toString(36), nombre: 'Fase nueva', semanas: 2, rir: '2', objetivo: '' }); guardar(); },
  'cl-fase-borrar'({ i }) {
    const fases = cliente().ciclo.fases, k = Number(i), x = fases[k];
    if (fases.length < 2) { toast('El ciclo necesita al menos una fase'); return; }
    fases.splice(k, 1); guardar();
    toast('Fase ' + x.nombre + ' borrada', () => { fases.splice(k, 0, x); guardar(); });
  },
  // Seguimiento
  'cl-checkin-pedir'() {
    const c = cliente(), t = preguntasCheckin(c);
    if (navigator.share) { navigator.share({ text: t }).catch((err) => { if (err.name !== 'AbortError') copiarTexto(t, '📋 Preguntas copiadas: pégalas en WhatsApp'); }); return; }
    copiarTexto(t, '📋 Preguntas copiadas: pégalas en WhatsApp');
  },
  'cl-checkin'() {
    const c = cliente(), v = (id) => (document.getElementById(id) || { value: '' }).value.trim(), n = (id) => { const x = Number(v(id).replace(',', '.')); return v(id) && Number.isFinite(x) ? x : null; };
    const x = { id: 'ck' + Date.now().toString(36), fecha: iso(), peso: n('ck-peso'), sueno: n('ck-sueno'), energia: n('ck-energia'), entreno: n('ck-entreno'), comida: n('ck-comida'), nota: v('ck-nota') };
    if (x.peso != null && (x.peso < 25 || x.peso > 300)) { toast('Revisa el peso'); return; }
    if (x.comida != null && (x.comida < 0 || x.comida > 100)) { toast('El plan de comida va de 0 a 100 %'); return; }
    if ([x.sueno, x.energia].some((y) => y != null && (y < 1 || y > 5))) { toast('Sueño y energía van del 1 al 5'); return; }
    if ([x.peso, x.sueno, x.energia, x.entreno, x.comida].every((y) => y == null) && !x.nota) { toast('Escribe al menos una respuesta'); return; }
    (c.checkins ||= []).push(x);
    if (x.peso) c.peso = x.peso; // el peso del check-in pasa a ser su peso actual
    guardar();
    toast('✅ Check-in guardado' + (x.peso ? ' · su peso quedó en ' + kg(x.peso) + ' kg' : ''));
  },
  'cl-valoracion'() {
    const c = cliente(), x = { id: 'va' + Date.now().toString(36), fecha: iso() };
    for (const [id] of [...MEDIDAS, ...PRUEBAS_CLIENTE]) { const t = (document.getElementById('va-' + id) || { value: '' }).value.trim().replace(',', '.'), n = Number(t); if (t && Number.isFinite(n) && n > 0) x[id] = n; }
    if (Object.keys(x).length <= 2) { toast('Llena al menos una medida'); return; }
    if (x.peso && (x.peso < 25 || x.peso > 300)) { toast('Revisa el peso'); return; }
    (c.valoraciones ||= []).push(x);
    if (x.peso) c.peso = x.peso;
    guardar();
    toast('📏 Valoración guardada');
  },
  'cl-registro-borrar'({ lista: que, i }) {
    const arr = cliente()[que], k = Number(i), x = arr && arr[k];
    if (!x) return;
    arr.splice(k, 1); guardar();
    toast('Borrado el del ' + fechaCorta(x.fecha), () => { arr.splice(k, 0, x); guardar(); });
  },
  // Plantillas y PDF
  'cl-plantilla-guardar'() {
    const c = cliente(), campo = document.getElementById('cl-plantilla-nombre'), pl = plantillaDe(c, campo ? campo.value : '');
    if (!c.rutina.length && !Object.keys(c.dieta.planes || {}).length) { toast('Primero arma su rutina o sus comidas'); return; }
    plantillas().push(pl); guardar();
    toast('📚 Plantilla «' + pl.nombre + '» guardada');
  },
  'cl-pdf'() {
    const c = cliente();
    let caja = document.getElementById('imprimir');
    if (!caja) { caja = document.createElement('div'); caja.id = 'imprimir'; document.body.appendChild(caja); }
    caja.innerHTML = htmlPlan(c, e().dieta);
    document.body.classList.add('imprimiendo');
    const fin = () => { document.body.classList.remove('imprimiendo'); caja.innerHTML = ''; window.removeEventListener('afterprint', fin); };
    window.addEventListener('afterprint', fin);
    window.print();
  },
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
