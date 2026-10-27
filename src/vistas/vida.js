// Pantallas de vida.js: círculo cercano (en Recordatorios), regla de las 72 horas (en Finanzas) y mis estándares (en Hoy)
import { e, guardar, repintar, dia } from '../estado.js';
import { iso, fechaCorta, sumarDias } from '../fechas.js';
import { pesos, leerMonto } from '../finanzas.js';
import { RELACIONES, estadoContacto, estadoEspera, resumenEsperas, IDEAS_ESTANDARES, cumplimientoEstandares } from '../vida.js';
import { rango } from '../progreso.js';
import { esc, barra, registrar, toast } from '../ui.js';
import { nuevoMovimiento } from './finanzas.js';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const ESTADOS = { vencido: 'Ya toca', pronto: 'Pronto', 'al-dia': 'Al día', 'sin-dato': 'Sin registro' };
const haceDias = (n) => (n === 0 ? 'hoy' : n === 1 ? 'ayer' : 'hace ' + n + ' días');

// ---------- Círculo cercano ----------
export function seccionCirculo() {
  const lista = (e().circulo ||= []), orden = { vencido: 0, pronto: 1, 'sin-dato': 2, 'al-dia': 3 };
  const filas = lista.map((p, i) => ({ p, i, s: estadoContacto(p) })).sort((a, b) => orden[a.s.estado] - orden[b.s.estado] || (b.s.dias || 0) - (a.s.dias || 0));
  return '<h2 class="titulo-grupo">👥 Círculo cercano</h2>' +
    '<p class="nota-corta">Las 5 a 8 personas que más importan. Te avisa cuando llevas mucho sin hablar con alguien: las relaciones también se entrenan.</p>' +
    filas.map(({ p, i, s }) => {
      const ruta = 'circulo.' + i;
      return '<section class="tarjeta ed-item rec e-borde-' + s.estado + '"><div class="ed-cab"><b>' + esc(p.nombre) + ' <small>· ' + esc(p.relacion || '') + '</small></b>' +
        '<span class="estado e-' + s.estado + '">' + ESTADOS[s.estado] + '</span></div>' +
        '<p class="nota-corta">' + (s.ultimo ? 'Último contacto ' + haceDias(s.dias) + ' (' + fechaCorta(s.ultimo) + ')' : 'Aún no registras ningún contacto') + ' · cada ' + (p.cadaDias || 14) + ' días</p>' +
        (p.contactos && p.contactos.length && p.contactos[p.contactos.length - 1].nota ? '<p class="nota-corta">📝 ' + esc(p.contactos[p.contactos.length - 1].nota) + '</p>' : '') +
        '<div class="aportar"><input type="text" placeholder="Nota (opcional): de qué hablaron" aria-label="Nota del contacto" data-nota-contacto="' + p.id + '">' +
        '<button type="button" class="boton primario" data-accion="circulo-hable" data-id="' + p.id + '">✓ Hablé hoy</button></div>' +
        '<details><summary>Editar</summary><div class="dos">' +
        '<label class="campo">Nombre<input type="text" data-cambio="ed" data-ruta="' + ruta + '.nombre" value="' + esc(p.nombre) + '"></label>' +
        '<label class="campo">Cada cuántos días<input type="number" inputmode="numeric" min="1" data-cambio="ed" data-tipo="num" data-ruta="' + ruta + '.cadaDias" value="' + (p.cadaDias || 14) + '"></label>' +
        '<label class="campo">Relación<select data-cambio="ed" data-ruta="' + ruta + '.relacion">' + Object.keys(RELACIONES).map((r) => '<option' + (r === p.relacion ? ' selected' : '') + '>' + r + '</option>').join('') + '</select></label></div>' +
        ((p.contactos || []).length > 1 ? '<ul class="lista-pesos">' + [...p.contactos].reverse().slice(0, 8).map((c) => '<li><span>' + fechaCorta(c.fecha) + '</span><span>' + esc(c.nota || '') + '</span></li>').join('') + '</ul>' : '') +
        '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="circulo" data-i="' + i + '" data-nombre="' + esc(p.nombre) + '" aria-label="Borrar">🗑</button></details></section>';
    }).join('') +
    '<section class="tarjeta"><h2>＋ Agregar persona</h2><div class="dos">' +
    '<label class="campo">Nombre<input type="text" id="circulo-nombre" placeholder="Ej.: Mamá"></label>' +
    '<label class="campo">Relación<select id="circulo-relacion">' + Object.entries(RELACIONES).map(([r, n]) => '<option value="' + r + '">' + r + ' (cada ' + n + (n === 1 ? ' día' : ' días') + ')</option>').join('') + '</select></label></div>' +
    '<button type="button" class="boton primario ancho" data-accion="circulo-agregar">Agregar</button></section>';
}

// ---------- Regla de las 72 horas ----------
const espera = { tipo: 'compra' };
const SENALES = ['Te prometen ganancias seguras o muy altas', 'Te presionan para decidir ya', 'No entiendes bien cómo se gana la plata', 'Te piden traer a más gente', 'Te pidieron pagar o consignar a una persona, no a una entidad vigilada'];
export function vistaEsperas() {
  const lista = (e().finanzas.esperas ||= []), r = resumenEsperas(lista);
  const activas = lista.filter((x) => x.estado === 'esperando'), viejas = lista.filter((x) => x.estado !== 'esperando').slice(-10).reverse();
  return '<section class="tarjeta"><h2>⏳ Regla de las 72 horas</h2>' +
    '<p class="nota-corta">Antes de una compra grande o de meter plata en algo que promete mucho, anótalo aquí y espera 3 días. Si después de 72 horas lo sigues queriendo, cómpralo tranquilo. Las decisiones con prisa son las que más cuestan.</p>' +
    '<div class="datos-peso"><div><small>Te ahorraste</small><b>' + pesos(r.ahorrado) + '</b></div><div><small>Descartaste</small><b>' + r.descartadas + ' de ' + r.decididas + '</b></div>' +
    '<div><small>En espera</small><b>' + pesos(r.esperando) + '</b></div></div></section>' +
    activas.map((x) => {
      const s = estadoEspera(x);
      return '<section class="tarjeta ed-item rec e-borde-' + (s.lista ? 'pronto' : 'al-dia') + '"><div class="ed-cab"><b>' + (x.tipo === 'inversion' ? '📈 ' : '🛍️ ') + esc(x.nombre) + '</b><b>' + pesos(x.monto) + '</b></div>' +
        (x.motivo ? '<p class="nota-corta">Por qué lo quiero: ' + esc(x.motivo) + '</p>' : '') +
        '<p class="' + (s.lista ? 'aviso' : 'nota-corta') + '">' + (s.lista ? 'Ya pasaron las 72 horas. ¿Lo sigues queriendo igual?' : 'Faltan ' + s.horas + ' horas (desde el ' + fechaCorta(x.fecha) + ').') + '</p>' +
        '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="espera-decidir" data-id="' + x.id + '" data-e="descartado">🙅 Ya no lo quiero</button>' +
        (s.lista ? '<button type="button" class="boton primario" data-accion="espera-decidir" data-id="' + x.id + '" data-e="comprado">✓ Lo compro</button>' : '') + '</div></section>';
    }).join('') +
    '<section class="tarjeta"><h2>＋ Algo que quiero comprar</h2><nav class="chips">' +
    [['compra', '🛍️ Compra'], ['inversion', '📈 Inversión / negocio']].map(([k, t]) => '<button type="button" class="chip' + (espera.tipo === k ? ' activo' : '') + '" data-accion="espera-tipo" data-t="' + k + '">' + t + '</button>').join('') + '</nav>' +
    '<div class="dos"><label class="campo">Qué es<input type="text" id="espera-nombre" placeholder="' + (espera.tipo === 'inversion' ? 'Ej.: plataforma de cripto de un amigo' : 'Ej.: audífonos nuevos') + '"></label>' +
    '<label class="campo">Cuánto<input type="text" inputmode="numeric" id="espera-monto" placeholder="$ 0"></label></div>' +
    '<label class="campo">Por qué lo quiero<input type="text" id="espera-motivo" placeholder="Ej.: los míos ya fallan / me prometen el 10 % mensual"></label>' +
    (espera.tipo === 'inversion' ? '<div class="nota-libro"><b>🚩 Señales de alerta</b><div>Si se cumple una sola, no metas plata:</div><ul class="puntos-libro">' + SENALES.map((t) => '<li>' + t + '</li>').join('') + '</ul>' +
      '<div>Antes de invertir, verifica que la entidad esté vigilada por la Superintendencia Financiera.</div></div>' : '') +
    '<button type="button" class="boton primario ancho" data-accion="espera-agregar">⏳ Empezar a esperar 72 h</button></section>' +
    (viejas.length ? '<section class="tarjeta"><h2>Decisiones</h2><ul class="lista-pesos">' + viejas.map((x) =>
      '<li><span>' + (x.estado === 'descartado' ? '🙅 ' : '✓ ') + esc(x.nombre) + ' <small>' + fechaCorta(x.decidido || x.fecha) + '</small></span><span>' + pesos(x.monto) + '</span></li>').join('') + '</ul></section>' : '');
}

// ---------- Mis estándares (Hoy) ----------
let editandoEstandares = false;
export function tarjetaEstandares(fecha = iso()) {
  const lista = (e().estandares ||= []), hechos = ((e().dias[fecha] || {}).estandares) || {}, perfil = (e().libros.fenix && e().libros.fenix.perfil) || {};
  const semana = cumplimientoEstandares(e(), rango(7, fecha)), n = lista.filter((s) => hechos[s.id]).length;
  return '<section class="tarjeta col-estandares"><div class="fila-resumen"><h2>🧭 Mis estándares</h2>' +
    (lista.length ? '<b>' + n + '/' + lista.length + '</b>' : '') + '</div>' +
    (perfil.proposito ? '<p class="idea-libro">' + esc(perfil.proposito) + '</p>'
      : '<p class="nota-corta"><a href="#libros/fenix">Escribe tu propósito</a> en Libros → Fénix → Herramientas → Mi perfil Fénix, y aparecerá aquí.</p>') +
    (lista.length ? '<p class="nota-corta">Lo que no negocias. Márcalos en la noche.</p><div class="practica-libro">' + lista.map((s) =>
      '<button type="button" class="paso-libro' + (hechos[s.id] ? ' hecho' : '') + '" data-accion="estandar" data-id="' + s.id + '" data-f="' + fecha + '" aria-pressed="' + !!hechos[s.id] + '">' +
      '<span class="check-libro">' + (hechos[s.id] ? '✓' : '') + '</span><span>' + esc(s.texto) + '</span></button>').join('') + '</div>' +
      (semana && semana.dias ? '<div class="fila-resumen nota-corta"><span>Últimos 7 días</span><b>' + Math.round(semana.fraccion * 100) + ' %</b></div>' + barra(semana.fraccion) : '')
      : '<p class="nota-corta">Elige 3 a 5 reglas que cumples pase lo que pase. Toca una idea o escribe la tuya.</p>') +
    (editandoEstandares || !lista.length ? editorEstandares(lista) : '<button type="button" class="boton secundario ancho" data-accion="estandares-editar">✏️ Editar estándares</button>') + '</section>';
}
function editorEstandares(lista) {
  const ideas = IDEAS_ESTANDARES.filter((t) => !lista.some((s) => s.texto === t));
  return (lista.length ? '<ul class="lista-pesos">' + lista.map((s) => '<li><span>' + esc(s.texto) + '</span><button type="button" class="icono" data-accion="estandar-quitar" data-id="' + s.id + '" aria-label="Quitar">✕</button></li>').join('') + '</ul>' : '') +
    '<div class="aportar"><input type="text" id="estandar-nuevo" placeholder="Mi regla: …" aria-label="Nuevo estándar">' +
    '<button type="button" class="boton primario" data-accion="estandar-agregar">＋</button></div>' +
    (ideas.length ? '<div class="chips envolver">' + ideas.map((t) => '<button type="button" class="chip mini" data-accion="estandar-agregar" data-t="' + esc(t) + '">' + esc(t) + '</button>').join('') + '</div>' : '') +
    (lista.length ? '<button type="button" class="boton secundario ancho" data-accion="estandares-editar">✓ Listo</button>' : '');
}

registrar({
  'circulo-agregar'() {
    const nombre = document.getElementById('circulo-nombre').value.trim(), relacion = document.getElementById('circulo-relacion').value;
    if (!nombre) { toast('Escribe el nombre'); return; }
    (e().circulo ||= []).push({ id: 'c' + uid(), nombre, relacion, cadaDias: RELACIONES[relacion] || 14, contactos: [] });
    guardar();
    toast('👥 ' + nombre + ' agregado');
  },
  'circulo-hable'({ id }) {
    const p = e().circulo.find((x) => x.id === id), campo = document.querySelector('[data-nota-contacto="' + id + '"]'), nota = campo ? campo.value.trim() : '';
    p.contactos = (p.contactos || []).filter((c) => c.fecha !== iso() || nota);
    p.contactos.push({ fecha: iso(), nota });
    guardar();
    toast('✓ Hablaste con ' + p.nombre);
  },
  'espera-tipo'({ t }) { espera.tipo = t; repintar(); },
  'espera-agregar'() {
    const val = (id) => document.getElementById(id).value.trim(), nombre = val('espera-nombre'), monto = leerMonto(val('espera-monto'));
    if (!nombre || !monto) { toast('Escribe qué es y cuánto cuesta'); return; }
    (e().finanzas.esperas ||= []).push({ id: 'w' + uid(), tipo: espera.tipo, nombre, monto, motivo: val('espera-motivo'), fecha: iso(), ts: Date.now(), estado: 'esperando' });
    guardar();
    toast('⏳ Vuelve en 72 horas: ' + fechaCorta(sumarDias(iso(), 3)));
  },
  'espera-decidir'({ id, e: estado }) {
    const x = e().finanzas.esperas.find((y) => y.id === id);
    if (estado === 'comprado' && !estadoEspera(x).lista) return;
    x.estado = estado; x.decidido = iso();
    if (estado === 'comprado' && confirm('¿Registrar ' + pesos(x.monto) + ' como gasto de hoy en "Otros"? (Puedes cambiar la categoría después.)')) nuevoMovimiento({ tipo: 'gasto', monto: x.monto, categoria: 'otros', nota: x.nombre });
    guardar();
    toast(estado === 'descartado' ? '🐷 Te ahorraste ' + pesos(x.monto) : '✓ ' + x.nombre);
  },
  estandar({ id, f }) {
    const h = (dia(f).estandares ??= {});
    if (h[id]) delete h[id]; else h[id] = true;
    guardar();
  },
  'estandares-editar'() { editandoEstandares = !editandoEstandares; repintar(); },
  'estandar-agregar'({ t }) {
    const campo = document.getElementById('estandar-nuevo'), texto = (t || (campo ? campo.value : '')).trim();
    if (!texto) { toast('Escribe tu regla'); return; }
    (e().estandares ||= []).push({ id: 's' + uid(), texto });
    editandoEstandares = true; // el editor sigue abierto para agregar más
    guardar();
  },
  'estandar-quitar'({ id }) { e().estandares = e().estandares.filter((s) => s.id !== id); guardar(); },
});
