// Pantallas de vida.js: acciones del círculo cercano (lo pinta Recordatorios en React), regla de las 72 horas (en Finanzas) y mis estándares (en Hoy)
import { e, guardar, repintar, dia } from '../estado.js';
import { iso, fechaCorta, sumarDias } from '../fechas.js';
import { pesos, leerMonto } from '../finanzas.js';
import { RELACIONES, estadoEspera } from '../vida.js';
import { registrar, toast } from '../ui.js';
import { nuevoMovimiento } from './finanzas.js';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

// ---------- Regla de las 72 horas ----------
const espera = { tipo: 'compra' };
const SENALES = ['Te prometen ganancias seguras o muy altas', 'Te presionan para decidir ya', 'No entiendes bien cómo se gana la plata', 'Te piden traer a más gente', 'Te pidieron pagar o consignar a una persona, no a una entidad vigilada'];
// La pantalla está en src/react/pantallas/FinanzasCalculos.tsx; aquí quedan lo que recuerda y sus acciones
export const piezasEsperas = { espera, SENALES };

// ---------- Mis estándares (Hoy) ----------
let editandoEstandares = false;
// Para la tarjeta de React (src/react/pantallas/HoyTarjetas.tsx): si se están editando los estándares
export const editandoLosEstandares = () => editandoEstandares;

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
