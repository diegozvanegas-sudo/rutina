// 🎓 Estudiar: plan del día según los minutos, repasos con tarjetas, racha, áreas y cursos (src/cursos).
// 📚 Libros es un área más: sus libros se abren en su pantalla de siempre (#libros/<id>). Funciona sin internet.
import { e, guardar, repintar, alternarCrono, segundosCrono, dia } from '../estado.js';
import { iso, reloj, fechaCorta } from '../fechas.js';
import { esc, barra, registrar, toast } from '../ui.js';
import { CURSOS, curso, areas, area, catalogoAreas, catalogoCursos } from '../cursos/index.js';
import { LIBROS } from '../libros/index.js';
import { lecturaQueToca, leidas } from '../biblioteca.js';
import { progresoCurso, lecciones, leccion, leccionQueToca, hechas, avance, sumarTarjetas, repasar, pendientes, tarjeta, dominada,
  planDelDia, siguientes, anotar, rachaEstudio, INTERVALOS } from '../estudio.js';
import { registrarCatalogo, ve, veRuta } from '../permisos.js';

// Las áreas y los cursos entran al catálogo del administrador
registrarCatalogo('area', catalogoAreas);
registrarCatalogo('curso', catalogoCursos);

let areaAbierta = null, cursoAbierto = null, pestana = 'hoy', abierta = null, repaso = null;
// Respuestas de "recordar sin mirar" que ya se mostraron (se vuelven a tapar al cambiar de lección)
const vistas = new Set();

const E = () => e().estudio;
const VACIO = progresoCurso();
const progreso = (id) => E().cursos[id] || VACIO;
const P = () => (E().cursos[cursoAbierto] ??= progresoCurso());
const C = () => curso(cursoAbierto);
const minutos = () => e().config.estudio.minutos;
// Lo que el admin deja ver: Estudiar, el área y el curso
const veArea = (a) => veRuta([['seccion', 'estudiar'], ['area', a.id]]);
const veCurso = (a, c) => veArea(a) && ve('curso', c.id);
const areasVisibles = () => areas().filter(veArea);
const cursosVisibles = () => CURSOS.filter((c) => { const a = area(c.area); return a && veCurso(a, c); });
const pendientesVisibles = () => { const ids = new Set(cursosVisibles().map((c) => c.id)); return pendientes(E().tarjetas).filter((id) => ids.has(id.split(':')[0])); };
export const librosVisibles = () => (veArea(area('libros')) ? LIBROS.filter((l) => ve('curso', l.id)) : []);

function plan() {
  const h = E().dias[iso()] || { minutos: 0, repasos: 0 };
  return planDelDia({ minutos: minutos(), repasos: pendientesVisibles().length, siguientes: siguientes(cursosVisibles(), E()), hecho: h });
}
const nombreLeccion = (s) => { const c = curso(s.curso), l = leccion(c, s.n); return c.icono + ' ' + esc(c.nombre) + ' · lección ' + s.n + ': ' + esc(l.titulo); };

// ---------- Inicio ----------
function cronometro() {
  const c = dia(iso()).crono.estudio, corre = c && c.inicio;
  return '<div class="crono"><span class="reloj" data-crono="' + iso() + '|estudio">' + reloj(segundosCrono(c)) + '</span>' +
    '<button type="button" class="boton secundario" data-accion="estudio-crono">' + (corre ? '⏸ Pausa' : '▶ Estudiar') + '</button>' +
    '<small class="nota-corta">Suma a tu meta de 📖 Lectura</small></div>';
}
function campoMinutos() {
  return '<label class="campo campo-corto">Minutos de estudio al día<input type="number" inputmode="numeric" min="5" max="240" step="5" data-cambio="estudio-minutos" value="' + minutos() + '"></label>';
}

function tarjetaPlan() {
  const p = plan(), r = rachaEstudio(E().dias), h = E().dias[iso()];
  let cuerpo;
  if (!cursosVisibles().length) cuerpo = '<p>Aún no hay cursos disponibles para ti.</p>';
  else if (p.listo) cuerpo = '<p class="grande-texto">✅ Listo por hoy</p><p class="nota-corta">' + (h && (h.lecciones || h.repasos) ? 'Hoy: ' + (h.lecciones || 0) + ' lección(es) y ' + (h.repasos || 0) + ' repaso(s). Mañana vuelven tus tarjetas.' : 'No hay nada pendiente.') + '</p>';
  else {
    cuerpo = '<ol class="plan-estudio">' +
      (p.repasos ? '<li><button type="button" class="boton primario ancho" data-accion="estudio-repasar">🔁 Repasar ' + p.repasos + (p.repasos === 1 ? ' tarjeta' : ' tarjetas') + ' (~' + Math.max(1, Math.round(p.repasos / 2)) + ' min)</button></li>' : '') +
      p.lecciones.map((s) => '<li><button type="button" class="boton ' + (p.repasos ? 'secundario' : 'primario') + ' ancho" data-accion="estudio-leccion" data-c="' + s.curso + '" data-n="' + s.n + '">📖 ' + nombreLeccion(s) + ' (' + s.minutos + ' min)</button></li>').join('') +
      '</ol>' +
      (p.quedanRepasos ? '<p class="nota-corta">Quedan ' + p.quedanRepasos + ' tarjetas para mañana: hoy no caben en tus ' + minutos() + ' minutos.</p>' : '') +
      (p.excede ? '<p class="nota-corta">La lección dura más que tus minutos de hoy: hazla completa o por partes.</p>' : '') +
      (p.repasos && !p.lecciones.length && !p.quedanRepasos ? '<p class="nota-corta">Hoy solo repaso: no alcanza el tiempo para una lección nueva.</p>' : '');
  }
  return '<section class="tarjeta"><div class="fila-resumen"><h2>📅 Hoy estudias…</h2><span>🔥 ' + r + (r === 1 ? ' día' : ' días') + '</span></div>' + cuerpo +
    '<div class="dos">' + campoMinutos() + cronometro() + '</div></section>';
}

function avanceArea(a) {
  if (a.id === 'libros') {
    const ls = librosVisibles(), t = ls.reduce((s, l) => s + l.lecturas.length, 0);
    return t ? ls.reduce((s, l) => s + leidas(l, e().libros[l.id] || { leidos: {} }), 0) / t : 0;
  }
  const cs = a.cursos.map((x) => curso(x.id)).filter(Boolean), t = cs.reduce((s, c) => s + lecciones(c).length, 0);
  return t ? cs.reduce((s, c) => s + hechas(c, progreso(c.id)), 0) / t : 0;
}
function inicio() {
  const total = Object.keys(E().tarjetas).length, dom = Object.values(E().tarjetas).filter(dominada).length;
  return '<h1>🎓 Estudiar</h1><p class="sub">Pocos minutos todos los días: primero repasas lo que toca y luego aprendes algo nuevo.</p>' +
    tarjetaPlan() +
    (total ? '<p class="nota-corta">🃏 ' + total + ' tarjetas en tu mazo · ' + dom + ' dominadas (aciertos a ' + INTERVALOS.join(', ') + ' días)</p>' : '') +
    '<h2 class="titulo-grupo">Áreas</h2><div class="areas-estudio">' + areasVisibles().map((a) => {
      const con = a.cursos.filter((x) => x.libro || curso(x.id)).length;
      return '<button type="button" class="tarjeta libro-tarjeta" data-accion="estudio-area" data-a="' + a.id + '"><span class="libro-icono">' + a.icono + '</span>' +
        '<span><b>' + esc(a.nombre) + '</b><small>' + esc(a.descripcion) + '</small><small>' + a.cursos.length + (a.cursos.length === 1 ? ' curso' : ' cursos') +
        (con < a.cursos.length ? ' · ' + con + ' disponibles' : '') + '</small>' + barra(avanceArea(a)) + '</span></button>';
    }).join('') + '</div>';
}

// ---------- Área ----------
function vistaArea() {
  const a = area(areaAbierta);
  return '<button type="button" class="boton secundario" data-accion="estudio-area" data-a="">← Estudiar</button>' +
    '<h1>' + a.icono + ' ' + esc(a.nombre) + '</h1><p class="sub">' + esc(a.descripcion) + '</p>' +
    a.cursos.filter((x) => veCurso(a, x)).map((x) => {
      if (x.libro) {
        const l = LIBROS.find((y) => y.id === x.id), pl = e().libros[l.id] || { leidos: {} }, toca = lecturaQueToca(l, pl), n = leidas(l, pl);
        return '<a class="tarjeta libro-tarjeta" href="#libros/' + l.id + '"><span class="libro-icono">' + l.icono + '</span><span><b>' + esc(l.titulo) + '</b>' +
          '<small>' + esc(l.autor) + ' · ' + esc(l.descripcion) + '</small><small>' + (toca ? 'Toca: ' + esc(l.unidad.toLowerCase()) + ' ' + toca + ' · ' : '¡Completo! · ') + n + '/' + l.lecturas.length + '</small>' +
          barra(n / l.lecturas.length) + '</span></a>';
      }
      const c = curso(x.id);
      if (!c) return '<div class="tarjeta libro-tarjeta proximamente"><span class="libro-icono">' + x.icono + '</span><span><b>' + esc(x.nombre) + '</b><small>' + esc(x.descripcion) + '</small><small>⏳ Próximamente</small></span></div>';
      const p = progreso(c.id), toca = leccionQueToca(c, p);
      return '<button type="button" class="tarjeta libro-tarjeta" data-accion="estudio-curso" data-c="' + c.id + '"><span class="libro-icono">' + c.icono + '</span><span><b>' + esc(c.nombre) + '</b>' +
        '<small>' + esc(c.nivel) + ' · ' + esc(x.descripcion) + '</small><small>' + (toca ? 'Toca: lección ' + toca + ' · ' : '¡Completo! · ') + hechas(c, p) + '/' + lecciones(c).length + ' lecciones</small>' +
        barra(avance(c, p)) + '</span></button>';
    }).join('');
}

// ---------- Curso ----------
function recordarSinMirar(l) {
  const r = P().recordar[l.n] || {};
  return '<h3 class="sub-libro">🧠 Recordar sin mirar</h3><p class="nota-corta">Responde en tu cabeza o en un papel antes de ver la respuesta. El esfuerzo es lo que enseña.</p>' +
    '<ol class="recordar">' + l.recordar.map(([q, a], i) => {
      const clave = cursoAbierto + ':' + l.n + ':' + i, visto = vistas.has(clave) || i in r;
      return '<li><b>' + esc(q) + '</b>' + (visto
        ? '<div class="respuesta">' + esc(a) + '</div><div class="botones-rapidos">' +
          '<button type="button" class="chip' + (r[i] === true ? ' activo' : '') + '" data-accion="estudio-recordar" data-n="' + l.n + '" data-i="' + i + '" data-ok="1">✓ La sabía</button>' +
          '<button type="button" class="chip' + (r[i] === false ? ' activo' : '') + '" data-accion="estudio-recordar" data-n="' + l.n + '" data-i="' + i + '" data-ok="">✗ No la sabía</button></div>'
        : '<button type="button" class="boton secundario" data-accion="estudio-ver" data-k="' + clave + '">Ver respuesta</button>') + '</li>';
    }).join('') + '</ol>';
}

function vistaLeccion(n) {
  const c = C(), l = leccion(c, n), p = P(), hecha = p.hechas[n], pr = p.practica[n] || {}, total = lecciones(c).length, m = c.modulos[l.modulo - 1];
  return '<article class="tarjeta lectura-libro">' +
    '<div class="fila-resumen"><span class="dia-libro">LECCIÓN ' + String(n).padStart(2, '0') + ' DE ' + total + ' · ' + l.minutos + ' MIN</span>' +
    (hecha ? '<span class="nota-corta">✓ el ' + fechaCorta(hecha) + '</span>' : '') + '</div>' +
    '<p class="nota-corta">Módulo ' + l.modulo + ': ' + esc(m.titulo) + '</p>' +
    '<h2 class="titulo-libro">' + esc(l.titulo) + '</h2><p class="idea-libro">' + esc(l.idea) + '</p>' +
    l.bloques.map(([t, ps]) => '<h3 class="sub-libro">' + esc(t) + '</h3><ul class="puntos-libro">' + ps.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>').join('') +
    '<h3 class="sub-libro">🔎 Ejemplos</h3><ul class="puntos-libro">' + l.ejemplos.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
    '<div class="nota-libro"><b>💡 Para tener en cuenta</b><div>' + esc(l.nota) + '</div></div>' +
    recordarSinMirar(l) +
    '<h3 class="sub-libro">✅ Práctica</h3><div class="practica-libro">' + l.practica.map((x, i) =>
      '<button type="button" class="paso-libro' + (pr[i] ? ' hecho' : '') + '" data-accion="estudio-practica" data-n="' + n + '" data-i="' + i + '" aria-pressed="' + !!pr[i] + '">' +
      '<span class="check-libro">' + (pr[i] ? '✓' : '') + '</span><span>' + esc(x) + '</span></button>').join('') + '</div>' +
    '<h3 class="sub-libro">✍️ Diario</h3><label class="campo">' + esc(l.pregunta) + '<textarea rows="3" data-cambio="estudio-diario" data-c="' + c.id + '" data-n="' + n + '">' + esc(p.diario[n] || '') + '</textarea></label>' +
    '<p class="nota-corta">🃏 Al terminar, ' + l.tarjetas.length + ' tarjetas de esta lección entran a tus repasos (vuelven mañana).</p>' +
    '<button type="button" class="boton ' + (hecha ? 'secundario' : 'primario') + ' grande ancho" data-accion="estudio-hecha" data-n="' + n + '">' + (hecha ? '↩ Marcar como no terminada' : '✓ Terminé la lección') + '</button>' +
    '<div class="botones-rapidos">' +
    (n > 1 ? '<button type="button" class="boton secundario grande" data-accion="estudio-abrir" data-n="' + (n - 1) + '">← Lección ' + (n - 1) + '</button>' : '') +
    (n < total ? '<button type="button" class="boton secundario grande" data-accion="estudio-abrir" data-n="' + (n + 1) + '">Lección ' + (n + 1) + ' →</button>' : '') + '</div></article>';
}

function pestanaHoy() {
  const c = C(), toca = leccionQueToca(c, P()), n = abierta || toca;
  if (!n) return '<section class="tarjeta"><h2>🎉 ¡Terminaste las ' + lecciones(c).length + ' lecciones!</h2><p>Tus tarjetas siguen volviendo para que no se olvide. Ahora haz el proyecto final.</p>' +
    '<button type="button" class="boton primario grande ancho" data-accion="estudio-pestana" data-p="proyecto">🎯 Proyecto final</button></section>';
  return (abierta && toca && abierta !== toca ? '<p class="nota-corta">Estás viendo la lección ' + abierta + '. <a href="#estudiar" data-accion="estudio-abrir" data-n="0">Volver a la de hoy (' + toca + ')</a></p>' : '') + vistaLeccion(n);
}

function pestanaLecciones() {
  const c = C(), p = P(), toca = leccionQueToca(c, p), ls = lecciones(c);
  return c.modulos.map((m, im) => '<section class="tarjeta"><h2>Módulo ' + (im + 1) + ': ' + esc(m.titulo) + '</h2><p class="nota-corta">' + esc(m.objetivo) + '</p><ol class="lista-libro">' +
    ls.filter((l) => l.modulo === im + 1).map((l) => '<li class="' + (p.hechas[l.n] ? 'leida' : l.n === toca ? 'toca' : '') + '"><button type="button" data-accion="estudio-abrir" data-n="' + l.n + '">' +
      '<span class="num-libro">' + (p.hechas[l.n] ? '✓' : l.n) + '</span><span><b>' + esc(l.titulo) + '</b><small>' + esc(l.idea) + '</small><small>' + l.minutos + ' min' +
      (Object.keys(p.practica[l.n] || {}).length ? ' · práctica ' + Object.keys(p.practica[l.n]).length + '/3' : '') + (p.diario[l.n] ? ' · con diario' : '') + '</small></span></button></li>').join('') +
    '</ol></section>').join('');
}

function pestanaProyecto() {
  const pr = C().proyecto, hechos = P().proyecto;
  return '<section class="tarjeta"><h2>🎯 ' + esc(pr.titulo) + '</h2><p>' + esc(pr.intro) + '</p><div class="practica-libro">' + pr.pasos.map((x, i) =>
    '<button type="button" class="paso-libro' + (hechos[i] ? ' hecho' : '') + '" data-accion="estudio-proyecto" data-i="' + i + '" aria-pressed="' + !!hechos[i] + '">' +
    '<span class="check-libro">' + (hechos[i] ? '✓' : i + 1) + '</span><span>' + esc(x) + '</span></button>').join('') + '</div>' +
    '<label class="campo">Notas del proyecto<textarea rows="4" data-cambio="estudio-diario" data-c="' + C().id + '" data-n="proyecto">' + esc(P().diario.proyecto || '') + '</textarea></label></section>';
}

const pestanaFuentes = () => '<p class="nota-corta">Las investigaciones y libros de donde sale cada módulo. Las notas "Para tener en cuenta" separan lo que tiene evidencia de lo que se suele exagerar.</p>' +
  C().modulos.map((m, im) => '<section class="tarjeta"><h2>Módulo ' + (im + 1) + ': ' + esc(m.titulo) + '</h2><ul class="puntos-libro fuentes">' +
    m.fuentes.map(([cita, para]) => '<li>' + esc(cita) + '<small>' + esc(para) + '</small></li>').join('') + '</ul></section>').join('');

function vistaCurso() {
  const c = C(), a = area(c.area), p = P(), n = hechas(c, p), total = lecciones(c).length;
  const tabs = { hoy: '📖 Hoy', lecciones: '📚 ' + total + ' lecciones', proyecto: '🎯 Proyecto', fuentes: '📎 Fuentes' };
  const vistasP = { hoy: pestanaHoy, lecciones: pestanaLecciones, proyecto: pestanaProyecto, fuentes: pestanaFuentes };
  return '<button type="button" class="boton secundario" data-accion="estudio-area" data-a="' + a.id + '">← ' + a.icono + ' ' + esc(a.nombre) + '</button>' +
    '<h1>' + c.icono + ' ' + esc(c.nombre) + '</h1><p class="sub">' + esc(c.nivel) + ' · ' + esc(c.paraQue) + '</p>' +
    '<section class="tarjeta"><div class="fila-resumen"><b>📖 ' + n + ' de ' + total + ' lecciones</b><span>🔥 ' + rachaEstudio(E().dias) + ' días</span></div>' + barra(n / total) + '</section>' +
    '<nav class="chips pestanas">' + Object.entries(tabs).map(([k, t]) => '<button type="button" class="chip' + (k === pestana ? ' activo' : '') + '" data-accion="estudio-pestana" data-p="' + k + '">' + esc(t) + '</button>').join('') +
    '</nav>' + (vistasP[pestana] || pestanaHoy)();
}

// ---------- Repaso de tarjetas ----------
function vistaRepaso() {
  const id = repaso.ids[repaso.i];
  if (!id) {
    const r = repaso;
    return '<section class="tarjeta"><h2>✅ Repaso terminado</h2><p>' + r.bien + ' de ' + r.ids.length + ' las sabías. Las que fallaste vuelven mañana; las demás, más adelante.</p>' +
      '<button type="button" class="boton primario grande ancho" data-accion="estudio-fin-repaso">Seguir con el plan →</button></section>';
  }
  const t = tarjeta(CURSOS, id), x = E().tarjetas[id];
  return '<button type="button" class="boton secundario" data-accion="estudio-fin-repaso">← Salir del repaso</button>' +
    '<h1>🔁 Repaso</h1><p class="sub">Tarjeta ' + (repaso.i + 1) + ' de ' + repaso.ids.length + ' · ' + t.curso.icono + ' ' + esc(t.curso.nombre) + ', lección ' + t.leccion.n + '</p>' +
    barra(repaso.i / repaso.ids.length) +
    '<section class="tarjeta tarjeta-repaso"><p class="frente">' + esc(t.frente) + '</p>' +
    (repaso.volteada
      ? '<div class="respuesta">' + esc(t.reverso) + '</div><div class="botones-rapidos">' +
        '<button type="button" class="boton peligro grande" data-accion="estudio-responder" data-ok="">✗ No la sabía</button>' +
        '<button type="button" class="boton primario grande" data-accion="estudio-responder" data-ok="1">✓ La sabía</button></div>' +
        '<p class="nota-corta">Si la sabes vuelve en ' + (x.paso + 1 >= INTERVALOS.length ? '… ¡queda dominada!' : INTERVALOS[x.paso + 1] + ' días') + '; si no, mañana.</p>'
      : '<p class="nota-corta">Respóndela en tu cabeza o en voz alta antes de voltearla.</p><button type="button" class="boton primario grande ancho" data-accion="estudio-voltear">Ver respuesta</button>') +
    '</section>';
}

// ---------- Tarjeta para "Hoy" (reemplaza las de los libros) ----------
export function tarjetaEstudioHoy() {
  const p = plan(), r = rachaEstudio(E().dias);
  const libros = librosVisibles().filter((l) => e().libros[l.id] && lecturaQueToca(l, e().libros[l.id]));
  const lineas = [];
  if (p.repasos) lineas.push('🔁 ' + p.repasos + (p.repasos === 1 ? ' tarjeta' : ' tarjetas') + ' para repasar');
  for (const s of p.lecciones) lineas.push('📖 ' + nombreLeccion(s) + ' · ' + s.minutos + ' min');
  for (const l of libros) { const n = lecturaQueToca(l, e().libros[l.id]); lineas.push(l.icono + ' ' + esc(l.titulo) + ': ' + esc(l.unidad.toLowerCase()) + ' ' + n + ', ' + esc(l.lecturas[n - 1].titulo)); }
  if (!lineas.length && !cursosVisibles().length) return '';
  return '<a class="tarjeta libro-hoy" href="#estudiar"><b>🎓 Estudio de hoy · ' + minutos() + ' min' + (r ? ' · 🔥 ' + r : '') + '</b>' +
    (lineas.length ? lineas.map((x) => '<span>' + x + '</span>').join('') : '<span>✅ Listo por hoy. Mañana vuelven tus tarjetas.</span>') + '</a>';
}

export function vistaEstudiar() {
  if (repaso) return vistaRepaso();
  if (cursoAbierto && C() && ve('curso', cursoAbierto) && veArea(area(C().area))) return vistaCurso();
  if (areaAbierta && area(areaAbierta) && veArea(area(areaAbierta))) return vistaArea();
  return inicio();
}

const irArriba = () => window.scrollTo(0, 0);
function abrirCurso(id, n = null) { cursoAbierto = id; areaAbierta = curso(id).area; pestana = 'hoy'; abierta = n; }
registrar({
  // "#estudiar/aprender" abre el área; "#estudiar/aprender-a-aprender" el curso; "#estudiar/libros" los libros
  'abrir-estudiar'({ p }) { repaso = null; if (curso(p)) abrirCurso(p); else if (area(p)) { areaAbierta = p; cursoAbierto = null; } },
  'estudio-area'({ a }) { areaAbierta = a || null; cursoAbierto = null; repaso = null; repintar(); irArriba(); },
  'estudio-curso'({ c }) { abrirCurso(c); repintar(); irArriba(); },
  'estudio-leccion'({ c, n }) { abrirCurso(c, Number(n)); repintar(); irArriba(); },
  'estudio-pestana'({ p }) { pestana = p; repintar(); },
  'estudio-abrir'({ n }, el, ev) { if (ev) ev.preventDefault(); abierta = Number(n) || null; pestana = 'hoy'; repintar(); irArriba(); },
  'estudio-minutos'(ds, el) { e().config.estudio.minutos = Math.max(5, Math.min(240, Math.round(Number(el.value) || 15))); guardar(); },
  'estudio-crono'() { alternarCrono(iso(), 'estudio'); guardar(); },
  'estudio-ver'({ k }) { vistas.add(k); repintar(); },
  'estudio-recordar'({ n, i, ok }) { const r = (P().recordar[n] ??= {}); r[i] = !!ok; guardar(); },
  'estudio-practica'({ n, i }) { const p = (P().practica[n] ??= {}); if (p[i]) delete p[i]; else p[i] = iso(); guardar(); },
  'estudio-proyecto'({ i }) { const p = P().proyecto; if (p[i]) delete p[i]; else p[i] = iso(); guardar(); },
  'estudio-diario'({ c, n }, el) { ((E().cursos[c] ??= progresoCurso()).diario)[n] = el.value; guardar(); },
  'estudio-hecha'({ n }) {
    const c = C(), l = leccion(c, Number(n)), p = P(), dias = E().dias;
    if (p.hechas[n]) {
      // Desmarcar descuenta del día en que se terminó; las tarjetas se quedan en el mazo
      anotar(dias, 'lecciones', -1, p.hechas[n]); anotar(dias, 'minutos', -l.minutos, p.hechas[n]);
      delete p.hechas[n]; guardar(); return;
    }
    p.hechas[n] = iso();
    E().actual = c.id;
    sumarTarjetas(E().tarjetas, c, l);
    anotar(dias, 'lecciones', 1); anotar(dias, 'minutos', l.minutos);
    abierta = null;
    guardar();
    const sig = leccionQueToca(c, p);
    toast(sig ? '✓ Lección ' + n + ' lista. ' + l.tarjetas.length + ' tarjetas nuevas para mañana' : '🎉 ¡Curso completo! Te falta el proyecto final');
    irArriba();
  },
  'estudio-repasar'() {
    const ids = pendientesVisibles().slice(0, Math.max(1, plan().repasos));
    if (!ids.length) return;
    repaso = { ids, i: 0, volteada: false, bien: 0 };
    repintar(); irArriba();
  },
  'estudio-voltear'() { repaso.volteada = true; repintar(); },
  'estudio-responder'({ ok }) {
    const id = repaso.ids[repaso.i];
    repasar(E().tarjetas[id], !!ok);
    anotar(E().dias, 'repasos', 1);
    if (ok) repaso.bien++;
    repaso.i++; repaso.volteada = false;
    guardar();
  },
  'estudio-fin-repaso'() { repaso = null; repintar(); irArriba(); },
});
