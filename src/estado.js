// Todo se guarda en el celular (localStorage) en un solo objeto. Funciona sin internet; se puede exportar/importar en Ajustes.
import { HABITOS, METAS, ESPERA, RUTINA, SESIONES } from './datos_iniciales.js';
import { aplicarHoja } from './datos_hoja.js';
import { iso, sumarDias } from './fechas.js';

const CLAVE = 'rutina_v1';
const copia = (o) => JSON.parse(JSON.stringify(o));

function inicial() {
  return {
    version: 1,
    config: { metas: { ...METAS }, espera: { ...ESPERA }, sonido: true },
    habitos: copia(HABITOS),
    rutina: copia(RUTINA),
    sesiones: copia(SESIONES),
    dias: {},     // 'AAAA-MM-DD': { habitos: { id: { ts, texto } }, metas: {...}, crono: {...} }
    semanas: {},  // número de semana: { idFila: { peso, unidad, reps } }
    activo: null, // temporizador en curso: { tipo, fin, ... }
    cambio: 0,    // milisegundos del último cambio hecho aquí (para sincronizar con la nube)
    nube: null,   // { usuario, base }: base = cambio que tenía la nube en la última sincronización
  };
}

let estado = null, oyentes = [];

export function cargar() {
  let guardado = null;
  try { guardado = JSON.parse(localStorage.getItem(CLAVE)); } catch (e) {}
  estado = guardado && guardado.version === 1 ? { ...inicial(), ...guardado } : inicial();
  // Sesiones nuevas que trae una versión de la app y aún no están en el celular
  for (const s of SESIONES) if (!estado.sesiones.some((x) => x.id === s.id)) estado.sesiones.push(copia(s));
  // Una sola vez: últimos registros, descansos y semana 1 traídos de la hoja de Google
  if (!estado.hojaAplicada) { aplicarHoja(estado); estado.hojaAplicada = true; }
  return estado;
}
export const e = () => estado || cargar();

let pendiente = null, alGuardar = [];
function escribir() {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (err) {
    clearTimeout(pendiente);
    pendiente = setTimeout(() => alert('No se pudo guardar en el celular. Exporta una copia en Ajustes.'), 50);
  }
}
// Cada cambio real queda marcado con la hora (cambio) y avisa a la nube y a la hoja (alGuardarse)
export function guardar(conRepintar = true) {
  estado.cambio = Date.now();
  escribir();
  alGuardar.forEach((f) => f());
  if (conRepintar) repintar();
}
// Cambios que no se sincronizan (el temporizador en curso): se guardan aquí sin marcar cambio
export function guardarAqui() { escribir(); repintar(); }
// Solo pantalla (cambiar de día o de semana): no cuenta como cambio
export function repintar() { oyentes.forEach((f) => f()); }
export function alCambiar(f) { oyentes.push(f); }
export function alGuardarse(f) { alGuardar.push(f); }

// ---------- Nube ----------
// Lo que se sube: todo menos el temporizador en curso y los datos de la propia sincronización
export function datosParaNube() {
  const { activo, nube, ...resto } = estado;
  return resto;
}
export function reemplazar(datos) {
  const propio = { activo: estado.activo, nube: estado.nube };
  estado = { ...inicial(), ...datos, ...propio };
  escribir();
  repintar();
}
export function marcarNube(nube) { estado.nube = nube; escribir(); }

export function dia(fecha = iso()) {
  const d = (e().dias[fecha] ??= {});
  d.habitos ??= {};
  d.metas ??= { agua: 0, pasos: 0, calorias: 0, lectura: 0 };
  d.crono ??= {};
  return d;
}

// ---------- Mañana ----------
export function mananaCompleta(fecha) {
  const d = e().dias[fecha];
  return !!d && e().habitos.every((h) => d.habitos && d.habitos[h.id]);
}
export function hechosManana(fecha = iso()) {
  const d = e().dias[fecha];
  return e().habitos.filter((h) => d && d.habitos && d.habitos[h.id]).length;
}
// Días seguidos con la mañana completa. Si hoy aún no está completa, cuenta hasta ayer.
export function racha(hoy = iso()) {
  let n = 0, f = mananaCompleta(hoy) ? hoy : sumarDias(hoy, -1);
  while (mananaCompleta(f)) { n++; f = sumarDias(f, -1); }
  return n;
}

// ---------- Cronómetros (caminar, lectura): acumulan segundos y pueden estar corriendo ----------
export function segundosCrono(c) {
  if (!c) return 0;
  return (c.acumulado || 0) + (c.inicio ? (Date.now() - c.inicio) / 1000 : 0);
}
export function alternarCrono(fecha, id) {
  const d = dia(fecha), c = (d.crono[id] ??= { acumulado: 0, inicio: null });
  if (c.inicio) { c.acumulado = segundosCrono(c); c.inicio = null; } else c.inicio = Date.now();
}

// ---------- Metas ----------
export function avanceMetas(fecha = iso()) {
  const m = dia(fecha).metas, meta = e().config.metas;
  const lectura = Math.floor(segundosCrono(dia(fecha).crono.lectura) / 60) + (m.lectura || 0);
  const valores = { agua: m.agua || 0, pasos: m.pasos || 0, calorias: m.calorias || 0, lectura };
  const partes = Object.fromEntries(Object.keys(meta).map((k) => [k, Math.min(1, meta[k] ? valores[k] / meta[k] : 0)]));
  const total = Object.values(partes).reduce((a, b) => a + b, 0) / Object.keys(partes).length;
  return { valores, partes, total };
}

// ---------- Copia de seguridad ----------
export function exportar() { return JSON.stringify(estado, null, 1); }
export function importar(texto) {
  const datos = JSON.parse(texto);
  if (!datos || datos.version !== 1 || !datos.rutina) throw new Error('El archivo no es una copia de esta app.');
  estado = { ...inicial(), ...datos, nube: estado.nube };
  guardar();
}
export function reiniciar() { estado = { ...inicial(), nube: estado.nube }; aplicarHoja(estado); estado.hojaAplicada = true; guardar(); }
