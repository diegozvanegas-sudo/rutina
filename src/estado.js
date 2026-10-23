// Todo se guarda en el celular (localStorage) en un solo objeto. Funciona sin internet; se puede exportar/importar en Ajustes.
import { HABITOS, METAS, ESPERA, RUTINA, SESIONES } from './datos_iniciales.js';
import { aplicarHoja } from './datos_hoja.js';
import { ALIMENTOS, PLANES, CONFIG_DIETA } from './datos_dieta.js';
import { FINANZAS, RECORDATORIOS } from './datos_finanzas.js';
import { tipoDeDia, totalPlan } from './dieta.js';
import { iso, sumarDias, semanaDe, diaSemana } from './fechas.js';

const CLAVE = 'rutina_v1';
const copia = (o) => JSON.parse(JSON.stringify(o));

const dietaInicial = () => ({ config: copia(CONFIG_DIETA), alimentos: copia(ALIMENTOS), planes: copia(PLANES), anterior: null });

function inicial() {
  return {
    version: 1,
    config: { metas: { ...METAS }, espera: { ...ESPERA }, sonido: true },
    habitos: copia(HABITOS),
    rutina: copia(RUTINA),
    sesiones: copia(SESIONES),
    dieta: dietaInicial(),
    finanzas: FINANZAS(),
    recordatorios: RECORDATORIOS(),
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
  if (!estado.diasV2) { moverDias(estado); estado.diasV2 = true; }
  if (!estado.dieta) estado.dieta = dietaInicial();
  if (!estado.finanzas) estado.finanzas = FINANZAS();
  if (!estado.recordatorios) estado.recordatorios = RECORDATORIOS();
  return estado;
}
export const e = () => estado || cargar();

// 23 oct 2026: lun empuje, mar tirón, mié pierna A, vie torso A, sáb pierna B. Si ya se cambió a mano, no se toca.
const DIAS_ANTES = { d1: 1, d2: 2, d3: 3, d5: 5, d6: 6 }, DIAS_AHORA = { d1: 5, d2: 3, d3: 1, d5: 2, d6: 6 };
function moverDias(est) {
  if (!est.rutina.every((d) => !(d.id in DIAS_ANTES) || d.diaSemana === DIAS_ANTES[d.id])) return;
  for (const d of est.rutina) if (d.id in DIAS_AHORA) d.diaSemana = DIAS_AHORA[d.id];
}

let pendiente = null, alGuardar = [];
function escribir() {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (err) {
    clearTimeout(pendiente);
    // Sin ventana (pruebas) no hay a quién avisar
    if (typeof alert === 'function') pendiente = setTimeout(() => alert('No se pudo guardar en el celular. Exporta una copia en Ajustes.'), 50);
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

// ---------- Semanas ----------
// La semana de trabajo es la del calendario (cambia sola cada lunes), o una más adelante si se abrió a mano
export const semanaActual = () => Math.max(1, semanaDe(), e().semanaAbierta || 0);
export function abrirSemana() { e().semanaAbierta = semanaActual() + 1; guardar(); return e().semanaAbierta; }
// Solo se puede deshacer la última semana abierta a mano, y si no tiene nada anotado
export function semanaQuitable() {
  const n = e().semanaAbierta;
  if (!n || n <= semanaDe()) return null;
  const regs = e().semanas[n] || {};
  return Object.values(regs).some((r) => String(r.reps || '').trim() || String(r.peso || '').trim()) ? null : n;
}
export function quitarSemana() {
  const n = semanaQuitable();
  if (!n) return;
  delete e().semanas[n];
  e().semanaAbierta = n - 1 > semanaDe() ? n - 1 : null;
  guardar();
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
  const m = dia(fecha).metas, meta = { ...e().config.metas };
  const lectura = Math.floor(segundosCrono(dia(fecha).crono.lectura) / 60) + (m.lectura || 0);
  // Calorías: lo anotado a mano más las comidas marcadas en Dieta; la meta es la del plan que toca ese día
  const comidas = comidasDelDia(fecha);
  if (e().dieta) meta.calorias = Math.round(totalPlan(planDieta(fecha), e().dieta.alimentos).kcal);
  const valores = { agua: m.agua || 0, pasos: m.pasos || 0, calorias: (m.calorias || 0) + comidas.kcal, lectura };
  const partes = Object.fromEntries(Object.keys(meta).map((k) => [k, Math.min(1, meta[k] ? valores[k] / meta[k] : 0)]));
  const total = Object.values(partes).reduce((a, b) => a + b, 0) / Object.keys(partes).length;
  return { valores, partes, total, meta };
}

// ---------- Dieta ----------
// Plan del día: el elegido a mano ese día o el que toca según la rutina (pierna → inferior, resto → superior, sin entreno → descanso)
export function tipoDieta(fecha = iso()) {
  const d = e().dias[fecha];
  if (d && d.dieta) return d.dieta;
  const n = diaSemana(fecha);
  return tipoDeDia(e().rutina.find((x) => x.diaSemana === n));
}
export const planDieta = (fecha = iso()) => e().dieta.planes[tipoDieta(fecha)];
// Comidas marcadas: guardan sus calorías y proteína del momento (si después cambia el plan, el día no cambia)
export function comidasDelDia(fecha = iso()) {
  const c = (e().dias[fecha] && e().dias[fecha].comidas) || {};
  return Object.values(c).reduce((t, x) => ({ kcal: t.kcal + (x.kcal || 0), p: t.p + (x.p || 0), n: t.n + 1 }), { kcal: 0, p: 0, n: 0 });
}

// ---------- Copia de seguridad ----------
export function exportar() { return JSON.stringify(estado, null, 1); }
export function importar(texto) {
  const datos = JSON.parse(texto);
  if (!datos || datos.version !== 1 || !datos.rutina) throw new Error('El archivo no es una copia de esta app.');
  estado = { ...inicial(), ...datos, nube: estado.nube };
  guardar();
}
export function reiniciar() { estado = { ...inicial(), nube: estado.nube }; aplicarHoja(estado); estado.hojaAplicada = estado.diasV2 = true; guardar(); }
