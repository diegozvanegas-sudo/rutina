// Envío a la hoja de Google "Rutina Gym" por medio del Apps Script (apps_script/Codigo.gs).
// Gym: escribe peso y reps en la columna "Sem N" de la pestaña "Rutina 2.0", igual que a mano.
// Días: hábitos y metas en la pestaña "Diario App" (una fila por fecha).
import { e, alGuardarse, avanceMetas, semanaActual } from './estado.js';
import { lunesDe, sumarDias, hora } from './fechas.js';
import { registrosDeFila, repsDe } from './gym.js';

export const hoja = { estado: 'inactiva', ultima: null, mensaje: '' };
const config = () => e().config.hoja || {};
export const hojaLista = () => !!(config().url && config().clave);

// Filas en el orden de la hoja: los días de la rutina (lunes → sábado) y al final el core
export function datosGym(estado, semana) {
  const regs = estado.semanas[semana] || {};
  const dias = estado.rutina.filter((d) => d.diaSemana).sort((a, b) => a.diaSemana - b.diaSemana);
  const core = estado.rutina.find((d) => d.id === 'core');
  const bloque = (d) => ({
    nombre: d.nombre,
    filas: d.ejercicios.flatMap((ej) => ej.filas.map((f) => {
      // El core se anota por día: en la hoja va todo junto (reps de todos los días, el último peso)
      const lista = registrosDeFila(regs, f);
      const reps = lista.flatMap((r) => repsDe(r.reps)).join(' · ');
      const conPeso = lista.filter((r) => String(r.peso || '').trim()).pop();
      const peso = conPeso ? String(conPeso.peso).trim() + (conPeso.unidad === 'discos' ? ' discos' : '') : '';
      return { ejercicio: ej.nombre, tipo: f.tipo, peso, reps };
    })),
  });
  return { semana, lunes: lunesDe(semana), bloques: dias.map(bloque), core: core ? bloque(core) : null };
}

export function datosDias(estado, desde, hasta) {
  const filas = [];
  for (let f = desde; f <= hasta; f = sumarDias(f, 1)) {
    const d = estado.dias[f];
    if (!d) continue;
    const a = avanceMetas(f);
    filas.push({
      fecha: f,
      habitos: estado.habitos.map((h) => [h.nombre, d.habitos && d.habitos[h.id] ? hora(d.habitos[h.id].ts) : '']),
      gratitud: d.gratitud || '', agua: a.valores.agua, pasos: a.valores.pasos, calorias: a.valores.calorias, lectura: a.valores.lectura,
      metas: Math.round(a.total * 100),
    });
  }
  return filas;
}

export async function enviarSemana(semana = semanaActual()) {
  const c = config();
  if (!hojaLista()) throw new Error('Falta la dirección del Apps Script o la clave (Ajustes)');
  const lunes = lunesDe(semana);
  const cuerpo = { clave: c.clave, gym: datosGym(e(), semana), dias: datosDias(e(), lunes, sumarDias(lunes, 6)) };
  hoja.estado = 'enviando';
  try {
    // text/plain: el navegador no hace la consulta previa (CORS) que Apps Script no responde
    const r = await fetch(c.url, { method: 'POST', body: JSON.stringify(cuerpo), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
    const res = await r.json();
    if (!res.ok) throw new Error(res.mensaje || 'La hoja respondió con un error');
    Object.assign(hoja, { estado: 'ok', ultima: Date.now(), mensaje: res.mensaje });
    return res.mensaje;
  } catch (err) {
    Object.assign(hoja, { estado: 'error', mensaje: err.message });
    throw err;
  }
}

// Si está configurada, la semana actual se manda sola un minuto después del último cambio
let espera = null;
export function iniciarHoja() {
  alGuardarse(() => {
    if (!hojaLista() || config().auto === false) return;
    clearTimeout(espera);
    espera = setTimeout(() => { if (navigator.onLine) enviarSemana().catch(() => {}); }, 60000);
  });
}
