// 👥 Clientes: planes que armas para otras personas (rutina de gym y plan de comida) y que les compartes como imagen o texto.
// Viven en tus datos (estado.clientes); ellos no necesitan cuenta. Aquí solo la lógica; la pantalla está en vistas/clientes.js.
// cliente = { id, nombre, objetivo, peso, estatura, nota, ajuste (% de carbos y grasa sobre tu fórmula), creado,
//             rutina: [días como los tuyos], dieta: { planes: { superior, inferior, descanso… } } }
import { objetivo, recalcular, totalPlan } from './dieta.js';

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
