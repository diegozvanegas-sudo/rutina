// 💊 Suplementos: marcar lo que tomaste hoy (o ayer, si se te olvidó anotarlo), la constancia de cada uno y la lista para editar
import { e, dia, guardar, repintar, hayFutbol } from '../estado.js';
import { iso, sumarDias, diaSemana } from '../fechas.js';
import { registrar, toast } from '../ui.js';
import { PLANTILLAS, mismoNombre, deHoy, tomado, marcar, constancia, avisosSuplementos } from '../suplementos.js';
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

// Para "solo días de entreno": hay gym ese día de la semana o partido
const info = (f) => { const n = diaSemana(f); return { diaSemana: n, entrena: e().rutina.some((d) => d.diaSemana === n) || hayFutbol(f) }; };
const hacia = (f, n) => Array.from({ length: n }, (_, i) => sumarDias(f, -i));
const deLaFecha = (f) => { const x = info(f); return deHoy(datos().lista, x.diaSemana, x.entrena); };

// Para la fila de "lo que falta hoy" de Hoy: [hechos, total] o null
export function pendienteSuplementos() {
  const sups = deLaFecha(iso());
  return sups.length ? [sups.filter((s) => tomado(e().dias, iso(), s.id)).length, sups.length] : null;
}

// Lo que necesita la pantalla de React (src/react/pantallas/Suplementos.tsx): el día que se ve, el que se edita y las reglas
export const piezasSuplementos = {
  ver: () => ({ cual, editando }),
  datos, deLaFecha, hacia, info, avisosDeSuplementos,
};

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
