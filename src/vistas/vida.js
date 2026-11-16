// Pantallas de vida.js: acciones del círculo cercano (lo pinta Recordatorios en React), regla de las 72 horas (en Finanzas) y mis estándares (en Hoy)
import { e, guardar, repintar, dia } from '../estado.js';
import { iso, fechaCorta, sumarDias } from '../fechas.js';
import { pesos, leerMonto } from '../finanzas.js';
import { RELACIONES, estadoEspera, IDEAS_POR_TEMA, cumplimientoEstandares } from '../vida.js';
import { rango } from '../progreso.js';
import { esc, barra, registrar, toast } from '../ui.js';
import { nuevoMovimiento } from './finanzas.js';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

// ---------- Regla de las 72 horas ----------
const espera = { tipo: 'compra' };
const SENALES = ['Te prometen ganancias seguras o muy altas', 'Te presionan para decidir ya', 'No entiendes bien cómo se gana la plata', 'Te piden traer a más gente', 'Te pidieron pagar o consignar a una persona, no a una entidad vigilada'];
// La pantalla está en src/react/pantallas/FinanzasCalculos.tsx; aquí quedan lo que recuerda y sus acciones
export const piezasEsperas = { espera, SENALES };

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
  const libre = (t) => !lista.some((s) => s.texto === t);
  return (lista.length ? '<ul class="lista-pesos">' + lista.map((s) => '<li><span>' + esc(s.texto) + '</span><button type="button" class="icono" data-accion="estandar-quitar" data-id="' + s.id + '" aria-label="Quitar">✕</button></li>').join('') + '</ul>' : '') +
    '<div class="aportar"><input type="text" id="estandar-nuevo" placeholder="Mi regla: …" aria-label="Nuevo estándar">' +
    '<button type="button" class="boton primario" data-accion="estandar-agregar">＋</button></div>' +
    Object.entries(IDEAS_POR_TEMA).filter(([, ts]) => ts.some(libre)).map(([tema, ts]) => '<h3 class="tema-ideas">' + tema + '</h3><div class="chips envolver">' +
      ts.filter(libre).map((t) => '<button type="button" class="chip mini" data-accion="estandar-agregar" data-t="' + esc(t) + '">' + esc(t) + '</button>').join('') + '</div>').join('') +
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
