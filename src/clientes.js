// 👥 Clientes: planes que armas para otras personas (rutina de gym y plan de comida) y que les compartes como imagen o texto.
// Viven en tus datos (estado.clientes); ellos no necesitan cuenta. Aquí solo la lógica; la pantalla está en vistas/clientes.js.
// cliente = { id, nombre, objetivo, peso, estatura, nota, ajuste (% de carbos y grasa sobre tu fórmula), creado,
//             rutina: [días como los tuyos], dieta: { planes: { superior, inferior, descanso… } },
//             cobro: { precio, cada: mes | quincena | semana | unico, inicio, pausa, pagos: [{ fecha, monto }] },
//             ciclo: { inicio, fases: [{ id, nombre, semanas, rir, objetivo }] },     macrociclo → mesociclos (fases) → semanas
//             checkins: [{ id, fecha, peso, sueno, energia, entreno, comida, nota }], valoraciones: [{ id, fecha, medidas…, pruebas… }] }
import { objetivo, recalcular, totalPlan } from './dieta.js';
import { iso, sumarDias, diasEntre, diaSemana, fechaCorta } from './fechas.js';
import { sumarMeses, mesDe } from './finanzas.js';
import { FASES } from './plan12.js';

// El % es cuánto suben los carbos y la grasa sobre tu fórmula, que es de déficit (≈ 23-25 kcal por kg). Con la proteína
// por kg igual, +55 % deja ≈ 31-33 kcal/kg (mantener, persona activa) y +80 % ≈ 35-37 kcal/kg (superávit pequeño).
// Son puntos de partida: el ajuste real sale de cómo cambia su peso en 2 o 3 semanas
export const OBJETIVOS_CLIENTE = {
  grasa: ['🔥 Bajar grasa', 0], mantener: ['⚖️ Mantener', 55], musculo: ['💪 Ganar músculo', 80],
};
// Los planes de comida que se copian por defecto (fútbol y recarga son de tu semana con partido)
export const PLANES_CLIENTE = ['superior', 'inferior', 'descanso'];

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const copia = (x) => JSON.parse(JSON.stringify(x));

export function nuevoCliente(nombre) {
  return { id: 'cl' + uid(), nombre: String(nombre || '').trim() || 'Cliente', objetivo: 'grasa', peso: null, estatura: null, nota: '', ajuste: 0, creado: Date.now(), rutina: [], dieta: { planes: {} } };
}

// Copia de tus días (sin registros, variantes ni notas tuyas), con ids nuevos para que nada se cruce con tu Gym
export function copiarRutina(rutina, ids = null, { notas = false } = {}) {
  return rutina.filter((d) => (ids ? ids.includes(d.id) : d.id !== 'core' || d.ejercicios.length)).map((d) => {
    const dia = copia(d), id = 'cd' + uid();
    delete dia.notaCalentamiento;
    return {
      ...dia, id, origen: d.id,
      ejercicios: d.ejercicios.map((ej, j) => {
        const eid = id + '-' + (j + 1), x = copia(ej);
        delete x.variantes; delete x.variante;
        return { ...x, id: eid, nota: notas ? x.nota || '' : '', filas: x.filas.map((f, k) => { const g = { ...f, id: eid + '-' + (k + 1) }; delete g.ultimo; return g; }) };
      }),
    };
  });
}

// Tu fórmula de comida con el ajuste del cliente: el mismo gramaje de proteína por kg, y carbos y grasa ± el porcentaje
export function formulaCliente(config, c) {
  const f = 1 + (Number(c.ajuste) || 0) / 100, por = (o) => Object.fromEntries(Object.entries(o || {}).map(([k, v]) => [k, Math.round(v * f * 100) / 100]));
  const r = { ...copia(config), carbKg: por(config.carbKg), grasaKg: por(config.grasaKg), kcalKg: por(config.kcalKg) };
  delete r.protFija; // tu proteína fija es tuya: la del cliente sale de su peso
  return r;
}
export const objetivoCliente = (config, c, tipo) => (c.peso > 0 ? objetivo(formulaCliente(config, c), tipo, c.peso) : null);

// Copia tus planes y, si ya tiene peso, ajusta las cantidades a lo que le toca
export function copiarDieta(dieta, c, tipos = PLANES_CLIENTE) {
  const planes = {};
  for (const t of tipos) if (dieta.planes[t]) planes[t] = copia(dieta.planes[t]);
  c.dieta = { planes };
  return recalcularCliente(dieta, c);
}
export function recalcularCliente(dieta, c) {
  if (!(c.peso > 0)) return false;
  for (const [t, plan] of Object.entries(c.dieta.planes)) {
    const obj = objetivoCliente(dieta.config, c, t);
    if (obj) c.dieta.planes[t] = recalcular(plan, dieta.alimentos, obj).plan;
  }
  return true;
}

const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const esquema = (ej) => ej.filas.map((f) => (f.tipo === 'Series' ? '' : f.tipo + ' ') + f.esquema).join(' · ');
const n0 = (n) => Math.round(n || 0).toLocaleString('es-CO');

// El plan en texto, para pegar en WhatsApp
export function textoCliente(c, dieta, tipos = null) {
  const L = ['*Plan de ' + c.nombre + '*', OBJETIVOS_CLIENTE[c.objetivo] ? OBJETIVOS_CLIENTE[c.objetivo][0] : ''].filter(Boolean);
  const dias = c.rutina.filter((d) => d.ejercicios.length).sort((a, b) => (a.diaSemana || 9) - (b.diaSemana || 9));
  if (dias.length) {
    L.push('', '🏋️ *RUTINA*');
    for (const d of dias) {
      L.push('', '*' + (d.diaSemana ? DIAS[d.diaSemana] + ' · ' : '') + d.nombre + '*');
      d.ejercicios.forEach((ej, i) => L.push((ej.calentamiento ? '🔥 ' : (i + 1) + '. ') + ej.nombre + ' — ' + esquema(ej)));
      if (d.cardio) L.push('🏃 ' + d.cardio);
    }
  }
  const planes = Object.entries(c.dieta.planes || {});
  if (planes.length) {
    L.push('', '🥗 *ALIMENTACIÓN*');
    for (const [t, plan] of planes) {
      if (tipos && !tipos.includes(t)) continue;
      const tot = totalPlan(plan, dieta.alimentos);
      L.push('', '*' + plan.nombre + '* (' + n0(tot.kcal) + ' kcal · proteína ' + n0(tot.p) + ' g)');
      for (const comida of plan.comidas) {
        const items = comida.items.map((it) => {
          const a = dieta.alimentos.find((x) => x.id === it.alimento);
          if (!a) return null;
          return a.por === 'libre' ? a.nombre : n0(it.cant) + (a.por === 'g' ? ' g' : '') + ' ' + a.nombre;
        }).filter(Boolean);
        if (items.length) L.push('• ' + comida.nombre + ': ' + items.join(', '));
      }
    }
  }
  if (c.nota) L.push('', '📝 ' + c.nota);
  return L.join('\n');
}

// ---------- 💳 Plan y cobro ----------
export const PERIODOS = { mes: ['Mensual', (f) => sumarMeses(f, 1)], quincena: ['Quincenal', (f) => sumarDias(f, 15)], semana: ['Semanal', (f) => sumarDias(f, 7)], unico: ['Pago único', null] };
// Estado del cliente: sin plan, en pausa, al día, pronto (paga en 5 días o menos) o vencido. proximo = la fecha del siguiente cobro
export function estadoCobro(c, hoy = iso()) {
  const k = c.cobro;
  if (!k || !(k.precio > 0)) return { estado: 'sin-plan' };
  if (k.pausa) return { estado: 'pausa' };
  const pagos = (k.pagos || []).slice().sort((a, b) => a.fecha.localeCompare(b.fecha)), ult = pagos[pagos.length - 1];
  const sig = PERIODOS[k.cada] ? PERIODOS[k.cada][1] : null;
  if (!sig) return ult ? { estado: 'al-dia', ultimo: ult } : { estado: 'vencido', proximo: k.inicio || hoy, faltan: diasEntre(hoy, k.inicio || hoy) };
  const proximo = ult ? sig(ult.fecha) : k.inicio || hoy, faltan = diasEntre(hoy, proximo);
  // El día del cobro todavía no está vencido: se vence al día siguiente
  return { estado: faltan < 0 ? 'vencido' : faltan <= 5 ? 'pronto' : 'al-dia', proximo, faltan, ultimo: ult };
}
// Tablero del entrenador: clientes activos, lo cobrado este mes y lo que falta por cobrar (vencidos y los de esta semana)
export function resumenNegocio(clientes, hoy = iso()) {
  const mes = mesDe(hoy), r = { clientes: clientes.length, activos: 0, cobradoMes: 0, porCobrar: 0, vencidos: 0, pronto: 0 };
  for (const c of clientes) {
    const s = estadoCobro(c, hoy);
    if (['al-dia', 'pronto', 'vencido'].includes(s.estado)) r.activos++;
    if (s.estado === 'vencido') { r.vencidos++; r.porCobrar += c.cobro.precio; }
    if (s.estado === 'pronto') { r.pronto++; r.porCobrar += c.cobro.precio; }
    for (const p of (c.cobro && c.cobro.pagos) || []) if (mesDe(p.fecha) === mes) r.cobradoMes += p.monto || 0;
  }
  return r;
}

// ---------- 📆 Ciclo: macrociclo de 12 semanas con las fases de tu plan (base, progresión, descarga, intensificación) ----------
export const proximoLunesDe = (hoy = iso()) => sumarDias(hoy, diaSemana(hoy) === 1 ? 0 : 8 - diaSemana(hoy));
export function nuevoCiclo(inicio = proximoLunesDe()) {
  return { inicio, fases: FASES.map((x) => ({ id: x.id, nombre: x.nombre, semanas: x.hasta - x.desde + 1, rir: x.rir, objetivo: x.gym })) };
}
export const semanasCiclo = (ciclo) => (ciclo ? ciclo.fases.reduce((t, x) => t + (Number(x.semanas) || 0), 0) : 0);
// Cada semana del macrociclo con su fase (mesociclo), sus fechas y si toca revisión (la primera y la última de cada fase)
export function tablaCiclo(ciclo, hoy = iso()) {
  if (!ciclo) return [];
  const out = [];
  let n = 0;
  ciclo.fases.forEach((fase, k) => {
    for (let i = 1; i <= (Number(fase.semanas) || 0); i++) {
      n++;
      const desde = sumarDias(ciclo.inicio, (n - 1) * 7), hasta = sumarDias(desde, 6);
      out.push({ n, fase, k, enFase: i, desde, hasta, actual: hoy >= desde && hoy <= hasta, pasada: hoy > hasta, revision: n === 1 || i === Number(fase.semanas) });
    }
  });
  return out;
}
export function semanaDeCiclo(ciclo, hoy = iso()) {
  const t = tablaCiclo(ciclo, hoy), w = t.find((x) => x.actual);
  if (w) return w;
  if (t.length && hoy < t[0].desde) return { antes: true, faltan: diasEntre(hoy, t[0].desde) };
  return t.length ? { terminado: true } : null;
}

// ---------- 📈 Seguimiento: check-ins semanales y valoraciones ----------
export const PREGUNTAS_CHECKIN = [
  ['peso', '⚖️ ¿Cuánto pesaste en ayunas (promedio de la semana)?'], ['sueno', '🌙 ¿Cómo dormiste? (1 a 5)'], ['energia', '⚡ ¿Cómo estuvo tu energía? (1 a 5)'],
  ['entreno', '🏋️ ¿Cuántos entrenos hiciste de los planeados?'], ['comida', '🥗 ¿Qué tanto seguiste el plan de comida? (0 a 100 %)'], ['nota', '📝 ¿Molestias, dudas o algo que quieras contarme?'],
];
export function preguntasCheckin(c, hoy = iso()) {
  const w = semanaDeCiclo(c.ciclo, hoy);
  return ['Hola ' + c.nombre.split(' ')[0] + ' 👋 Check-in de la semana' + (w && w.n ? ' ' + w.n + ' (' + w.fase.nombre + ')' : '') + ':', '',
    ...PREGUNTAS_CHECKIN.map(([, p], i) => (i + 1) + '. ' + p), '', 'Responde con los números en orden. ¡Vamos!'].join('\n');
}
export const MEDIDAS = [['peso', 'Peso', 'kg'], ['cintura', 'Cintura', 'cm'], ['cadera', 'Cadera', 'cm'], ['pecho', 'Pecho', 'cm'], ['brazo', 'Brazo', 'cm'], ['muslo', 'Muslo', 'cm']];
export const PRUEBAS_CLIENTE = [['sentadilla', 'Sentadilla 1RM', 'kg'], ['press', 'Press banca 1RM', 'kg'], ['dominadas', 'Dominadas seguidas', 'reps'], ['flexiones', 'Flexiones seguidas', 'reps'], ['plancha', 'Plancha', 's']];
// Primera y última valoración con cada dato: cuánto cambió
export function comparacionValoraciones(vals) {
  const lista = (vals || []).slice().sort((a, b) => a.fecha.localeCompare(b.fecha));
  if (lista.length < 2) return [];
  const a = lista[0], b = lista[lista.length - 1];
  return [...MEDIDAS, ...PRUEBAS_CLIENTE].filter(([k]) => a[k] > 0 && b[k] > 0).map(([k, nombre, u]) => ({ k, nombre, u, antes: a[k], ahora: b[k], cambio: Math.round((b[k] - a[k]) * 10) / 10, desde: a.fecha, hasta: b.fecha }));
}
// El peso semana a semana: de los check-ins y las valoraciones
export const pesosCliente = (c) => [...(c.checkins || []), ...(c.valoraciones || [])].filter((x) => x.peso > 0).map((x) => ({ fecha: x.fecha, peso: x.peso })).sort((a, b) => a.fecha.localeCompare(b.fecha));

// ---------- 📚 Plantillas: la rutina, las comidas y el ciclo de un cliente para empezar otro igual ----------
export function plantillaDe(c, nombre) {
  return { id: 'pl' + uid(), nombre: String(nombre || '').trim() || 'Plantilla de ' + c.nombre, objetivo: c.objetivo, ajuste: c.ajuste, creado: Date.now(),
    rutina: copiarRutina(c.rutina, c.rutina.map((d) => d.id), { notas: true }), dieta: copia(c.dieta || { planes: {} }), fases: c.ciclo ? copia(c.ciclo.fases) : null };
}
export function clienteDePlantilla(pl, nombre, hoy = iso()) {
  const c = nuevoCliente(nombre);
  return { ...c, objetivo: pl.objetivo || c.objetivo, ajuste: pl.ajuste ?? c.ajuste, rutina: copiarRutina(pl.rutina, pl.rutina.map((d) => d.id), { notas: true }),
    dieta: copia(pl.dieta || { planes: {} }), ciclo: pl.fases ? { inicio: proximoLunesDe(hoy), fases: copia(pl.fases) } : null, plantilla: pl.id };
}

// ---------- 🖨️ El plan para imprimir o guardar en PDF (HTML sin estilos de la app) ----------
const h = (t) => String(t ?? '').replace(/[&<>"]/g, (x) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]));
export function htmlPlan(c, dieta, hoy = iso()) {
  const o = OBJETIVOS_CLIENTE[c.objetivo], partes = ['<header><h1>Plan de ' + h(c.nombre) + '</h1><p>' + [o ? o[0] : '', c.peso ? String(c.peso).replace('.', ',') + ' kg' : '', fechaCorta(hoy)].filter(Boolean).join(' · ') + '</p></header>'];
  if (c.ciclo) {
    partes.push('<h2>📆 Ciclo de ' + semanasCiclo(c.ciclo) + ' semanas · desde el ' + fechaCorta(c.ciclo.inicio) + '</h2><table><tr><th>Fase</th><th>Semanas</th><th>Reps en reserva</th><th>Reps</th><th>Objetivo</th></tr>' +
      c.ciclo.fases.map((x, i, a) => { const d = a.slice(0, i).reduce((t, y) => t + Number(y.semanas), 0) + 1; return '<tr><td><b>' + h(x.nombre) + '</b></td><td>' + d + (x.semanas > 1 ? '–' + (d + Number(x.semanas) - 1) : '') + '</td><td>' + h(x.rir) + '</td><td>' + h(x.reps || '') + '</td><td>' + h(x.objetivo) + '</td></tr>'; }).join('') + '</table>');
  }
  const dias = c.rutina.filter((d) => d.ejercicios.length).sort((a, b) => (a.diaSemana || 9) - (b.diaSemana || 9));
  if (dias.length) partes.push('<h2>🏋️ Rutina</h2>' + dias.map((d) => '<section class="dia"><h3>' + (d.diaSemana ? DIAS[d.diaSemana] + ' · ' : '') + h(d.nombre) + '</h3><table><tr><th>#</th><th>Ejercicio</th><th>Series × reps</th><th>Descanso</th></tr>' +
    d.ejercicios.map((ej, i) => '<tr><td>' + (ej.calentamiento ? '🔥' : i + 1) + '</td><td>' + h(ej.nombre) + (ej.nota ? '<small>' + h(ej.nota) + '</small>' : '') + '</td><td>' + h(esquema(ej)) + '</td><td>' + ej.filas.map((f) => Math.round(f.descanso / 60 * 10) / 10 + ' min').join(' · ') + '</td></tr>').join('') + '</table>' +
    (d.cardio ? '<p>🏃 ' + h(d.cardio) + '</p>' : '') + '</section>').join(''));
  for (const [, plan] of Object.entries((c.dieta && c.dieta.planes) || {})) {
    const tot = totalPlan(plan, dieta.alimentos);
    partes.push('<section class="dia"><h2>🥗 ' + h(plan.nombre) + ' <small>' + n0(tot.kcal) + ' kcal · P ' + n0(tot.p) + ' g · C ' + n0(tot.c) + ' g · G ' + n0(tot.g) + ' g</small></h2><table><tr><th>Comida</th><th>Alimentos</th></tr>' +
      plan.comidas.map((comida) => '<tr><td><b>' + h(comida.nombre) + '</b></td><td>' + comida.items.map((it) => { const a = dieta.alimentos.find((x) => x.id === it.alimento); return a ? (a.por === 'libre' ? h(a.nombre) : n0(it.cant) + (a.por === 'g' ? ' g ' : ' ') + h(a.nombre)) : ''; }).filter(Boolean).join(', ') + '</td></tr>').join('') + '</table></section>');
  }
  if (c.nota) partes.push('<p>📝 ' + h(c.nota) + '</p>');
  return partes.join('');
}
