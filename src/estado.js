// Todo se guarda en el celular (localStorage) en un objeto por usuario ("rutina_v1:<id>"). Funciona sin internet; se puede
// exportar/importar en Ajustes. Sin nube configurada se usa "rutina_v1".
import { HABITOS, METAS, ESPERA, RUTINA, SESIONES, OBJETIVOS, FUTBOL } from './datos_iniciales.js';
import { aplicarHoja } from './datos_hoja.js';
import { ALIMENTOS, PLANES, CONFIG_DIETA } from './datos_dieta.js';
import { FINANZAS, RECORDATORIOS } from './datos_finanzas.js';
import { tipoDeDia, totalPlan, macrosPorKg, objetivo, recalcular } from './dieta.js';
import { LIBROS } from './libros/index.js';
import { progresoInicial } from './biblioteca.js';
import { visibles } from './orden.js';
import { iso, sumarDias, semanaDe, diaSemana, hora, ponerSemana1, SEMANA_1_INICIAL } from './fechas.js';

const BASE = 'rutina_v1';
let CLAVE = BASE, escribible = true;
const copia = (o) => JSON.parse(JSON.stringify(o));

const dietaInicial = () => {
  const d = { config: copia(CONFIG_DIETA), alimentos: copia(ALIMENTOS), planes: copia(PLANES), anterior: null };
  Object.assign(d.config, macrosPorKg(d.planes, d.alimentos, d.config.pesoBase));
  return d;
};

function inicial() {
  return {
    version: 1,
    config: { metas: { ...METAS }, espera: { ...ESPERA }, sonido: true, objetivos: copia(OBJETIVOS), futbol: [...FUTBOL], ...CONFIG_NUEVA() },
    habitos: copia(HABITOS),
    rutina: copia(RUTINA),
    sesiones: copia([...SESIONES, ...LIBROS.flatMap((l) => l.sesiones || [])]),
    dieta: dietaInicial(),
    finanzas: FINANZAS(),
    recordatorios: RECORDATORIOS(),
    libros: {},   // id del libro (src/libros): { leidos, practica, notas, perfil, fichas, vuelta }
    dias: {},     // 'AAAA-MM-DD': { habitos: { id: { ts, texto } }, metas: {...}, crono: {...}, libros: { id: {...} } }
    semanas: {},  // número de semana: { idFila: { peso, unidad, reps } }
    activo: null, // temporizador en curso: { tipo, fin, ... }
    cambio: 0,    // milisegundos del último cambio hecho aquí (para sincronizar con la nube)
    nube: null,   // { usuario, base }: base = cambio que tenía la nube en la última sincronización
  };
}

// Lo que cada usuario puede cambiar y antes estaba fijo en el código
const CONFIG_NUEVA = () => ({
  nombre: '', semana1: SEMANA_1_INICIAL,
  orden: {}, ocultos: {},  // menú, tarjetas de Hoy y metas (orden.js)
  sesionesDescanso: ['rodilla', 'estiramiento-post'], sesionesPartido: ['calentamiento-futbol', 'estiramiento-post'],
});
// Las migraciones de abajo son para datos viejos: un celular nuevo arranca con todas hechas
const MIGRACIONES = ['hojaAplicada', 'diasV2', 'futbolV1', 'piernasV2'];
const nuevo = () => ({ ...inicial(), ...Object.fromEntries(MIGRACIONES.map((k) => [k, true])), bienvenida: true });

let estado = null, oyentes = [];

const leerClave = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch (err) { return null; } };

export function cargar() {
  const guardado = leerClave(CLAVE);
  estado = guardado && guardado.version === 1 ? { ...inicial(), ...guardado } : nuevo();
  // Sesiones nuevas que trae una versión de la app y aún no están en el celular
  for (const s of [...SESIONES, ...LIBROS.flatMap((l) => l.sesiones || [])]) if (!estado.sesiones.some((x) => x.id === s.id)) estado.sesiones.push(copia(s));
  // Una sola vez: últimos registros, descansos y semana 1 traídos de la hoja de Google
  if (!estado.hojaAplicada) { aplicarHoja(estado); estado.hojaAplicada = true; }
  if (!estado.diasV2) { moverDias(estado); estado.diasV2 = true; }
  if (!estado.dieta) estado.dieta = dietaInicial();
  // Carbos y grasa por kg: se toman de los planes que ya tiene el celular, así recalcular con el mismo peso no cambia nada
  if (!estado.dieta.config.carbKg) Object.assign(estado.dieta.config, macrosPorKg(estado.dieta.planes, estado.dieta.alimentos, estado.dieta.config.pesoBase));
  estado.config.objetivos ??= copia(OBJETIVOS);
  estado.config.metas.pantalla ??= METAS.pantalla;
  if (!estado.futbolV1) { rutinaFutbol(estado); estado.futbolV1 = true; }
  if (!estado.piernasV2) { piernasCbum(estado); estado.piernasV2 = true; }
  if (!estado.finanzas) estado.finanzas = FINANZAS();
  if (!estado.recordatorios) estado.recordatorios = RECORDATORIOS();
  estado.libros ??= {};
  if (estado.fenix) moverFenix(estado);
  const c = estado.config, n = CONFIG_NUEVA();
  for (const k of Object.keys(n)) c[k] ??= n[k];
  ponerSemana1(c.semana1);
  return estado;
}

// ---------- Usuarios ----------
// Con nube, cada usuario tiene su propio objeto en el celular. Mientras no se sabe quién entra, no se escribe nada.
export function esperarUsuario() {
  CLAVE = BASE; escribible = false;
  estado = nuevo();
  ponerSemana1(estado.config.semana1);
  repintar();
}
export function usarUsuario(id) {
  const clave = BASE + ':' + id;
  if (CLAVE === clave && escribible && estado) return;
  // Los datos de antes (una sola clave) pasan al usuario que ya los sincronizaba, o al primero que entre si nunca se subieron
  const viejo = leerClave(BASE);
  if (leerClave(clave) == null && viejo && viejo.version === 1 && (!viejo.nube || viejo.nube.usuario === id)) {
    try { localStorage.setItem(clave, JSON.stringify(viejo)); localStorage.removeItem(BASE); } catch (err) {}
  }
  CLAVE = clave; escribible = true;
  cargar();
  repintar();
}
export const claveActual = () => CLAVE;

// Bienvenida de un usuario nuevo: seguir con el ejemplo o empezar sin hábitos, rutina ni días de fútbol
export function elegirPlantilla(vacia) {
  if (vacia) {
    estado.habitos = [];
    estado.rutina = [];
    estado.config.futbol = [];
  }
  delete estado.bienvenida;
  guardar();
}
export const e = () => estado || cargar();

// 23 oct 2026: lun empuje, mar tirón, mié pierna A, vie torso A, sáb pierna B. Si ya se cambió a mano, no se toca.
const DIAS_ANTES = { d1: 1, d2: 2, d3: 3, d5: 5, d6: 6 }, DIAS_AHORA = { d1: 5, d2: 3, d3: 1, d5: 2, d6: 6 };
function moverDias(est) {
  if (!est.rutina.every((d) => !(d.id in DIAS_ANTES) || d.diaSemana === DIAS_ANTES[d.id])) return;
  for (const d of est.rutina) if (d.id in DIAS_AHORA) d.diaSemana = DIAS_AHORA[d.id];
}

// 24 oct 2026: fútbol mié y vie de noche: días de partido, objetivos de aductores, glúteo y pantorrilla y plan de comida "fútbol"
function rutinaFutbol(est) {
  est.config.futbol ??= [...FUTBOL];
  for (const [m, rango] of Object.entries(OBJETIVOS)) est.config.objetivos[m] ??= [...rango];
  const dt = est.dieta;
  if (dt && !dt.planes.futbol) {
    const c = dt.config, x = macrosPorKg({ futbol: PLANES.futbol }, ALIMENTOS, CONFIG_DIETA.pesoBase);
    dt.planes.futbol = copia(PLANES.futbol);
    c.kcalKg.futbol ??= CONFIG_DIETA.kcalKg.futbol;
    c.protKg.futbol ??= CONFIG_DIETA.protKg.futbol;
    if (c.carbKg && c.grasaKg) { c.carbKg.futbol ??= x.carbKg.futbol; c.grasaKg.futbol ??= x.grasaKg.futbol; }
    // Los otros planes ya se recalcularon con otro peso: este se pone al mismo
    if (c.pesoBase !== CONFIG_DIETA.pesoBase) dt.planes.futbol = recalcular(dt.planes.futbol, dt.alimentos, objetivo(c, 'futbol', c.pesoBase)).plan;
  }
}

// 24 oct 2026: la semana sigue como antes (lun empuje, mar tirón, mié pierna A, vie torso A, sáb pierna B) y las dos piernas son la
// de Cbum. Puede venir de la semana vieja (d2/d6) o de la de fútbol que alcanzó a llegar (p1/p2 con los días movidos). Los registros
// de cada ejercicio que sigue (el mismo o su equivalente) pasan al nuevo en todas las semanas; los demás quedan guardados.
const PIERNAS = { d2: 'pa', p1: 'pa', d6: 'pb', p2: 'pb' };
// Por día nuevo, en el orden de PIERNA: ejercicios viejos equivalentes
const EQUIVALENTES = {
  pa: [['d2-6', 'p1-5'], ['d2-3', 'p1-1'], ['d2-5', 'p1-4'], ['p1-2'], ['p1-6'], [], ['d2-1', 'p1-7']],
  pb: [['d6-8', 'p2-1'], [], ['d6-7', 'p2-3'], ['d6-3'], [], ['d6-6', 'p2-6'], ['d6-1', 'p2-7']],
};
const DIAS_FUTBOL = { d3: 2, d1: 3, d5: 4 }, CARDIO_FUTBOL = { d1: '', d5: 'Cardio suave 15-20 min (mañana hay fútbol)' };
function piernasCbum(est) {
  const viejos = {}, dias = {};
  for (const d of est.rutina) if (d.id in PIERNAS) { dias[d.id] = d; for (const ej of d.ejercicios) viejos[ej.id] = ej; }
  est.rutina = est.rutina.map((d) => (d.id in PIERNAS ? copia(RUTINA.find((x) => x.id === PIERNAS[d.id])) : d));
  const pasar = (de, a) => { for (const regs of Object.values(est.semanas)) if (regs[de] && !regs[a]) regs[a] = { ...regs[de] }; };
  for (const [viejo, nuevo] of Object.entries(PIERNAS)) if (dias[viejo]) pasar('cardio@' + viejo, 'cardio@' + nuevo);
  for (const d of est.rutina) {
    if (!EQUIVALENTES[d.id]) continue;
    d.ejercicios.forEach((ej, i) => {
      for (const id of EQUIVALENTES[d.id][i]) {
        const viejo = viejos[id];
        if (!viejo) continue;
        ej.filas.forEach((f, j) => {
          // Una fila vieja va solo a la nueva de su misma posición (no se duplican series); el último peso sí sirve para todas
          const vf = viejo.filas[Math.min(j, viejo.filas.length - 1)];
          if (vf.ultimo && !f.ultimo) f.ultimo = { ...vf.ultimo };
          if (j < viejo.filas.length) pasar(vf.id, f.id);
        });
      }
    });
  }
  if (est.rutina.every((d) => !(d.id in DIAS_FUTBOL) || d.diaSemana === DIAS_FUTBOL[d.id])) {
    for (const d of est.rutina) {
      if (!(d.id in DIAS_FUTBOL)) continue;
      const base = RUTINA.find((x) => x.id === d.id);
      d.diaSemana = base.diaSemana;
      if (d.cardio === CARDIO_FUTBOL[d.id]) d.cardio = base.cardio;
      if (/fútbol en la noche/.test(d.previo || '')) delete d.previo;
    }
  }
}

// Fénix se guardaba aparte (e().fenix y dias[fecha].fenix) antes de ser un libro más
function moverFenix(est) {
  const { preocupaciones = [], problemas = [], metas = [], ...resto } = est.fenix;
  est.libros.fenix = { ...progresoInicial(), ...resto, fichas: { preocupaciones, problemas, metas } };
  for (const d of Object.values(est.dias)) if (d.fenix) { (d.libros ??= {}).fenix = d.fenix; delete d.fenix; }
  delete est.fenix;
}

let pendiente = null, alGuardar = [];
function escribir() {
  if (!escribible) return;
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
  const { activo, nube, bienvenida, ...resto } = estado;
  return resto;
}
export function reemplazar(datos) {
  const propio = { activo: estado.activo, nube: estado.nube };
  estado = { ...inicial(), ...datos, ...propio };
  for (const [k, v] of Object.entries(CONFIG_NUEVA())) estado.config[k] ??= v;
  ponerSemana1(estado.config.semana1);
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
  // Cualquier dato anotado (reps, peso o el cardio) cuenta
  return Object.values(regs).some((r) => Object.values(r || {}).some((v) => v != null && String(v).trim() !== '')) ? null : n;
}
export function quitarSemana() {
  const n = semanaQuitable();
  if (!n) return;
  delete e().semanas[n];
  e().semanaAbierta = n - 1 > semanaDe() ? n - 1 : null;
  guardar();
}

// ---------- Mañana ----------
// Sin hábitos no hay mañana completa (si no, la racha no termina nunca)
export function mananaCompleta(fecha) {
  const d = e().dias[fecha];
  return !!d && e().habitos.length > 0 && e().habitos.every((h) => d.habitos && d.habitos[h.id]);
}
export function hechosManana(fecha = iso()) {
  const d = e().dias[fecha];
  return e().habitos.filter((h) => d && d.habitos && d.habitos[h.id]).length;
}
// Parte hecha (0–1); sin hábitos es 0
export const fraccionManana = (fecha = iso()) => (e().habitos.length ? hechosManana(fecha) / e().habitos.length : 0);
// Lo escrito en un hábito "Con texto": el de agradecer sigue en d.gratitud (columna Gratitud); los demás en d.textos
export const textoHabito = (d, h) => (h.id === 'agradecer' ? d.gratitud : d.textos && d.textos[h.id]) || '';
export function ponerTextoHabito(d, h, texto) {
  if (h.id === 'agradecer') d.gratitud = texto;
  else (d.textos ??= {})[h.id] = texto;
}
// Celda de un hábito en la hoja y el CSV: la hora y, si tiene texto propio, el texto
export const celdaHabito = (d, h) => {
  const t = h.id === 'agradecer' ? '' : textoHabito(d, h), hecho = d.habitos && d.habitos[h.id];
  return [hecho ? hora(hecho.ts) : '', t].filter(Boolean).join(' · ');
};
// La primera pastilla marcada inicia la espera del desayuno
export function pastillaDe(d) {
  const p = e().habitos.find((h) => h.tipo === 'pastilla');
  return p && d.habitos && d.habitos[p.id];
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
  const valores = { agua: m.agua || 0, pasos: m.pasos || 0, calorias: (m.calorias || 0) + comidas.kcal, lectura, pantalla: m.pantalla ?? null };
  // Pantalla es un máximo: cumplida si se anotó y no pasa del máximo; si se pasa, baja en proporción. Sin anotar, 0
  const parte = (k) => (k === 'pantalla' ? (valores.pantalla == null ? 0 : valores.pantalla <= meta.pantalla ? 1 : meta.pantalla / valores.pantalla) : Math.min(1, meta[k] ? valores[k] / meta[k] : 0));
  const partes = Object.fromEntries(Object.keys(meta).map((k) => [k, parte(k)]));
  // El total es de las metas que el usuario tiene a la vista (Editar > Pantallas); sin ninguna, no cuenta (null)
  const activas = visibles(e().config, 'metas').filter((k) => k in partes);
  const total = activas.length ? activas.reduce((a, k) => a + partes[k], 0) / activas.length : null;
  return { valores, partes, total, meta, activas };
}

// ---------- Fútbol ----------
export const hayFutbol = (fecha = iso()) => (e().config.futbol || []).includes(diaSemana(fecha));

// ---------- Dieta ----------
// Plan que toca por el día: partido → fútbol, pierna → inferior, resto → superior, sin entreno → descanso
export function tipoDietaAuto(fecha = iso()) {
  const n = diaSemana(fecha);
  return tipoDeDia(e().rutina.find((x) => x.diaSemana === n), hayFutbol(fecha));
}
// Plan del día: el elegido a mano ese día o el que toca
export function tipoDieta(fecha = iso()) {
  const d = e().dias[fecha];
  return (d && d.dieta) || tipoDietaAuto(fecha);
}
export const planDieta = (fecha = iso()) => e().dieta.planes[tipoDieta(fecha)];
// Comidas marcadas: guardan sus calorías y proteína del momento (si después cambia el plan, el día no cambia)
export function comidasDelDia(fecha = iso()) {
  const c = (e().dias[fecha] && e().dias[fecha].comidas) || {};
  return Object.values(c).reduce((t, x) => ({ kcal: t.kcal + (x.kcal || 0), p: t.p + (x.p || 0), c: t.c + (x.c || 0), g: t.g + (x.g || 0), n: t.n + 1 }), { kcal: 0, p: 0, c: 0, g: 0, n: 0 });
}

// ---------- Copia de seguridad ----------
export function exportar() { return JSON.stringify(estado, null, 1); }
export function importar(texto) {
  const datos = JSON.parse(texto);
  if (!datos || datos.version !== 1 || !datos.rutina) throw new Error('El archivo no es una copia de esta app.');
  estado = { ...inicial(), ...datos, nube: estado.nube };
  for (const [k, v] of Object.entries(CONFIG_NUEVA())) estado.config[k] ??= v;
  ponerSemana1(estado.config.semana1);
  guardar();
}
export function reiniciar() { estado = { ...nuevo(), nube: estado.nube }; ponerSemana1(estado.config.semana1); guardar(); }
