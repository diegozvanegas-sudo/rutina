// Entrenador ↔ cliente por la nube (supabase/esquema.sql, rutina_coach_* y rutina_cliente_*). Aquí solo la lógica:
//   · planParaPublicar: lo que el entrenador le manda a un cliente (sale de 👥 Clientes)
//   · aplicarPlan: el cliente lo usa como su rutina y sus comidas (guarda antes lo que tenía, para volver)
//   · resumenAvance: lo que el cliente le comparte (series por semana, peso, fuerza, sueño y check-ins). Nunca sus datos completos
// En el cliente: estado.miEntrenador = { lista: [{ id, entrenador, plan, plan_version }], aplicado: { [id]: version }, antes, checkins: [], compartido }
import { resumenSemana, progresoMes } from './gym.js';
import { rutinaDe } from './descarga.js';
import { pesos } from './dieta.js';
import { horasSueno } from './registro.js';
import { iso, sumarDias } from './fechas.js';
import { estadoCobro, MEDIDAS, PRUEBAS_CLIENTE } from './clientes.js';
import { limpiarMarca, firmaPlan } from './marca.js';

const copia = (x) => JSON.parse(JSON.stringify(x));

// El plan del cliente, con los alimentos que usan sus comidas (el cliente puede no tenerlos en su app).
// También lleva la marca del entrenador, sus pagos y sus valoraciones (para que los vea en su app) y la firma de lo que
// usa (marca.js firmaPlan): si solo cambia un pago o la marca, no le aparece como plan nuevo
export function planParaPublicar(c, dieta, hoy = iso(), marca = null) {
  const planes = copia((c.dieta && c.dieta.planes) || {});
  const ids = new Set(Object.values(planes).flatMap((p) => p.comidas.flatMap((x) => x.items.map((i) => i.alimento))));
  const plan = {
    nombre: c.nombre, objetivo: c.objetivo, peso: c.peso || null, nota: c.nota || '', publicado: hoy,
    rutina: copia(c.rutina || []), dieta: { planes }, alimentos: dieta.alimentos.filter((a) => ids.has(a.id)).map(copia), ciclo: c.ciclo ? copia(c.ciclo) : null,
    marca: limpiarMarca(marca), pagos: pagosParaCliente(c, hoy), valoraciones: valoracionesParaCliente(c), firma: '',
  };
  plan.firma = firmaPlan(plan);
  return plan;
}
// 💳 Lo que el cliente ve de sus pagos: el plan, si está al día y cuándo le toca (null si no hay cobro)
export function pagosParaCliente(c, hoy = iso()) {
  const k = c.cobro;
  if (!k || !(k.precio > 0)) return null;
  const s = estadoCobro(c, hoy);
  return { precio: k.precio, cada: k.cada || 'mes', estado: s.estado, proximo: s.proximo || null, actualizado: hoy,
    pagos: (k.pagos || []).slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 6).map((p) => ({ fecha: p.fecha, monto: p.monto || 0 })) };
}
// 📊 Sus valoraciones (medidas y pruebas), las 6 últimas, solo con esos datos
export function valoracionesParaCliente(c) {
  const campos = [...MEDIDAS, ...PRUEBAS_CLIENTE].map(([k]) => k);
  return (c.valoraciones || []).slice().sort((a, b) => a.fecha.localeCompare(b.fecha)).slice(-6)
    .map((v) => Object.fromEntries([['fecha', v.fecha], ...campos.filter((k) => Number(v[k]) > 0).map((k) => [k, Number(v[k])])]));
}
// La marca del entrenador del cliente (la del primero que la tenga)
export const marcaDeMiEntrenador = (estado) => {
  for (const a of (estado.miEntrenador && estado.miEntrenador.lista) || []) { const m = limpiarMarca(a.plan && a.plan.marca); if (m) return { ...m, correo: a.entrenador }; }
  const a = ((estado.miEntrenador && estado.miEntrenador.lista) || [])[0];
  return a ? { negocio: '', color: null, logo: null, correo: a.entrenador } : null;
};

// Usa el plan: reemplaza la rutina (deja el core propio si el plan no trae) y los planes de comida que trae; agrega los
// alimentos que falten. La primera vez guarda la rutina y las comidas de antes, para poder volver. Devuelve lo cambiado
export function aplicarPlan(estado, a) {
  const plan = a && a.plan;
  if (!plan || !Array.isArray(plan.rutina)) return null;
  const m = (estado.miEntrenador ??= {});
  if (!m.antes) m.antes = { fecha: iso(), rutina: copia(estado.rutina), planes: copia((estado.dieta && estado.dieta.planes) || {}) };
  const core = estado.rutina.find((d) => d.id === 'core');
  estado.rutina = copia(plan.rutina);
  if (core && !estado.rutina.some((d) => d.id === 'core')) estado.rutina.push(core);
  const tipos = Object.keys((plan.dieta && plan.dieta.planes) || {});
  if (estado.dieta) {
    for (const t of tipos) estado.dieta.planes[t] = copia(plan.dieta.planes[t]);
    for (const al of plan.alimentos || []) if (!estado.dieta.alimentos.some((x) => x.id === al.id)) estado.dieta.alimentos.push(copia(al));
  }
  (m.aplicado ??= {})[a.id] = a.plan_version;
  if (plan.firma) (m.firmas ??= {})[a.id] = plan.firma;
  return { dias: estado.rutina.filter((d) => d.id !== 'core' && d.ejercicios.length).length, planes: tipos.length };
}
// Volver a lo que tenía antes de usar el plan del entrenador
export function volverAntes(estado) {
  const m = estado.miEntrenador;
  if (!m || !m.antes) return false;
  estado.rutina = copia(m.antes.rutina);
  if (estado.dieta) estado.dieta.planes = copia(m.antes.planes);
  delete m.antes;
  m.aplicado = {};
  m.firmas = {};
  return true;
}
// ¿Hay algo nuevo que usar? Con firma: solo si cambió lo que usa (un pago o la marca no cuentan); sin firma (planes de antes),
// cualquier versión nueva
export function planNuevo(estado, a) {
  if (!(a && a.plan && a.plan_version)) return false;
  const m = estado.miEntrenador || {};
  if (a.plan.firma && (m.firmas || {})[a.id] === a.plan.firma) return false;
  return (m.aplicado || {})[a.id] !== a.plan_version;
}

// Lo que ve el entrenador. semana: la semana actual del Gym del cliente
export function resumenAvance(estado, semana, hoy = iso()) {
  const semanas = [];
  for (let s = Math.max(1, semana - 5); s <= semana; s++) {
    // La semana de descarga y los días de descanso cuentan con lo que de verdad tocaba (src/descarga.js rutinaDe)
    const r = resumenSemana(rutinaDe(estado.rutina, s, estado), (estado.semanas || {})[s] || {});
    semanas.push({ n: s, hechas: r.hechas, plan: r.plan });
  }
  const horas = Array.from({ length: 7 }, (_, k) => horasSueno(((estado.dias || {})[sumarDias(hoy, -k)] || {}).sueno)).filter((h) => h != null);
  return {
    actualizado: hoy, semana, semanas,
    pesos: pesos(estado.dias || {}).slice(-20),
    fuerza: progresoMes(estado.semanas || {}, estado.rutina, semana).slice(0, 8).map((x) => ({ nombre: x.nombre, de: { peso: x.de.peso, reps: x.de.reps }, a: { peso: x.a.peso, reps: x.a.reps, unidad: x.a.unidad }, cambio: Math.round(x.cambio * 1000) / 1000 })),
    sueno: horas.length ? Math.round((horas.reduce((s, h) => s + h, 0) / horas.length) * 10) / 10 : null,
    checkins: ((estado.miEntrenador && estado.miEntrenador.checkins) || []).slice(-8),
  };
}

// Los check-ins que llegaron en el resumen y aún no están en el seguimiento del cliente (por id)
export function checkinsNuevos(c, resumen) {
  const ya = new Set((c.checkins || []).map((x) => x.id));
  return ((resumen && resumen.checkins) || []).filter((x) => x && x.id && !ya.has(x.id));
}
