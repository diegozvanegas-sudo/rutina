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

export function objetivo(config, tipo, peso) {
  return { kcal: Math.round(config.kcalKg[tipo] * peso), p: Math.round(config.protKg[tipo] * peso) };
}

function redondear(alimento, cant) {
  const paso = alimento.paso || (alimento.por === 'g' ? 5 : 1);
  return Math.max(paso, Math.round(cant / paso) * paso);
}

// Ajusta las cantidades a un objetivo: primero la proteína (huevos, carne, pollo, scoop) hasta la proteína objetivo,
// después los carbos (arroz, avena, plátano) hasta las calorías objetivo. Grasas, verduras y lo "libre" quedan igual.
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

  const medio = totalPlan(nuevo, alimentos), carbos = deGrupo('carbo');
  const kCarb = carbos.reduce((s, i) => s + valoresItem(i, alimentos).kcal, 0);
  if (kCarb > 0) escalar(carbos, Math.max(0.2, (kCarb + obj.kcal - medio.kcal) / kCarb));

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
