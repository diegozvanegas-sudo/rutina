// Reglas de la dieta (sin pantalla, para poder probarlas): macros, totales, plan del día y recálculo por peso.

const cero = () => ({ p: 0, g: 0, c: 0, kcal: 0 });
const sumar = (a, b) => ({ p: a.p + b.p, g: a.g + b.g, c: a.c + b.c, kcal: a.kcal + b.kcal });

export function factor(alimento, cant) {
  return alimento.por === 'g' ? (Number(cant) || 0) / 100 : alimento.por === 'u' ? Number(cant) || 0 : 1;
}
export function valoresItem(item, alimentos) {
  const a = alimentos.find((x) => x.id === item.alimento);
  if (!a) return cero();
  const f = factor(a, item.cant);
  return { p: a.p * f, g: a.g * f, c: a.c * f, kcal: a.kcal * f };
}
export function totalComida(comida, alimentos) {
  return comida.items.reduce((t, i) => sumar(t, valoresItem(i, alimentos)), cero());
}
export function totalPlan(plan, alimentos) {
  return plan.comidas.reduce((t, c) => sumar(t, totalComida(c, alimentos)), cero());
}

// Qué plan toca según el día de la rutina: pierna → inferior; torso, empuje o tirón → superior; sin entreno → descanso
export function tipoDeDia(diaRutina) {
  if (!diaRutina) return 'descanso';
  return diaRutina.calentamiento === 'pierna' ? 'inferior' : 'superior';
}

// Objetivo del plan con un peso: proteína, carbohidratos y grasa por kg; las kcal salen de los macros (4 · P + 4 · C + 9 · G).
// Sin carbos/grasa por kg (datos de antes) se usa el objetivo de kcal por kg.
export const kcalDeMacros = (p, c, g) => 4 * p + 4 * c + 9 * g;
export function objetivo(config, tipo, peso) {
  const p = Math.round(config.protKg[tipo] * peso);
  if (config.carbKg && config.grasaKg && config.carbKg[tipo] != null && config.grasaKg[tipo] != null) {
    const c = Math.round(config.carbKg[tipo] * peso), g = Math.round(config.grasaKg[tipo] * peso);
    return { p, c, g, kcal: Math.round(kcalDeMacros(p, c, g)) };
  }
  return { p, kcal: Math.round(config.kcalKg[tipo] * peso) };
}
// Carbos y grasa por kg que tienen hoy los planes (para empezar sin cambiar nada)
export function macrosPorKg(planes, alimentos, peso) {
  const r = (n) => Math.round((n / peso) * 100) / 100, carbKg = {}, grasaKg = {};
  for (const [t, plan] of Object.entries(planes)) { const x = totalPlan(plan, alimentos); carbKg[t] = r(x.c); grasaKg[t] = r(x.g); }
  return { carbKg, grasaKg };
}

function redondear(alimento, cant) {
  const paso = alimento.paso || (alimento.por === 'g' ? 5 : 1);
  return Math.max(paso, Math.round(cant / paso) * paso);
}

// Ajusta las cantidades a un objetivo, en orden: la proteína (huevos, carne, pollo, scoop); la grasa (almendras…), contando
// la que ya traen los huevos y la carne; y los carbos (arroz, avena, plátano). Verduras y lo "libre" quedan igual.
// Sin objetivo de carbos y grasa, los carbos ajustan las calorías.
export function recalcular(plan, alimentos, obj) {
  const nuevo = JSON.parse(JSON.stringify(plan));
  const deGrupo = (grupo) => nuevo.comidas.flatMap((c) => c.items).filter((i) => {
    const a = alimentos.find((x) => x.id === i.alimento);
    return a && a.grupo === grupo && a.por !== 'libre';
  });
  const escalar = (items, f) => items.forEach((i) => { i.cant = redondear(alimentos.find((x) => x.id === i.alimento), i.cant * f); });
  const antes = totalPlan(plan, alimentos);

  const prot = deGrupo('proteina');
  const pProt = prot.reduce((s, i) => s + valoresItem(i, alimentos).p, 0);
  if (pProt > 0) escalar(prot, Math.max(0.3, (obj.p - (antes.p - pProt)) / pProt));

  // Lo que aportan los alimentos de un grupo y lo que aporta todo lo demás
  const aporte = (items, macro) => items.reduce((s, i) => s + valoresItem(i, alimentos)[macro], 0);
  const ajustar = (grupo, macro, meta) => {
    const items = deGrupo(grupo), propio = aporte(items, macro), resto = totalPlan(nuevo, alimentos)[macro] - propio;
    if (propio > 0) escalar(items, Math.max(0.2, (meta - resto) / propio));
  };
  if (obj.c != null && obj.g != null) {
    ajustar('grasa', 'g', obj.g);
    ajustar('carbo', 'c', obj.c);
  } else {
    const medio = totalPlan(nuevo, alimentos), carbos = deGrupo('carbo');
    const kCarb = aporte(carbos, 'kcal');
    if (kCarb > 0) escalar(carbos, Math.max(0.2, (kCarb + obj.kcal - medio.kcal) / kCarb));
  }

  return { plan: nuevo, antes, despues: totalPlan(nuevo, alimentos) };
}

// Pesos anotados, del más viejo al más nuevo
export function pesos(dias) {
  return Object.keys(dias || {}).sort().filter((f) => Number(dias[f].peso) > 0).map((f) => ({ fecha: f, peso: Number(dias[f].peso) }));
}
// Promedio de los últimos 7 registros: se mueve menos que el peso de un solo día
export function tendencia(lista) {
  const ult = lista.slice(-7);
  return ult.length ? ult.reduce((s, x) => s + x.peso, 0) / ult.length : null;
}
