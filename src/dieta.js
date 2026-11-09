// Reglas de la dieta (sin pantalla, para poder probarlas): macros, totales, plan del día y recálculo por peso.
import { sumarDias } from './fechas.js';

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

// Comidas repetidas por la sincronización: mismo nombre y mismos alimentos, aunque cambien las cantidades. Dos meriendas distintas
// se quedan. De las versiones se deja el juego (las primeras o las últimas) que más se acerca a las calorías de la meta
export function quitarComidasRepetidas(plan, alimentos, obj) {
  const clave = (c) => c.nombre + '|' + c.items.map((i) => i.alimento).sort().join(',');
  const primeras = new Map(), ultimas = new Map();
  for (const c of plan.comidas) {
    if (!primeras.has(clave(c))) primeras.set(clave(c), c);
    ultimas.set(clave(c), c);
  }
  if (primeras.size === plan.comidas.length) return plan;
  const a = [...primeras.values()], b = [...primeras.keys()].map((k) => ultimas.get(k));
  const lejos = (comidas) => Math.abs(totalPlan({ comidas }, alimentos).kcal - obj.kcal);
  plan.comidas = lejos(b) < lejos(a) ? b : a;
  return plan;
}

// Qué plan toca según el día: partido → fútbol (aunque también haya gym); pierna → inferior; torso, empuje o tirón → superior;
// sin entreno → descanso, o recarga si mañana hay partido
export function tipoDeDia(diaRutina, futbol = false, futbolManana = false) {
  if (futbol) return 'futbol';
  if (!diaRutina) return futbolManana ? 'recarga' : 'descanso';
  // El plan elegido para ese día en Editar manda
  if (diaRutina.dieta) return diaRutina.dieta;
  return diaRutina.calentamiento === 'pierna' ? 'inferior' : 'superior';
}

// Recarga cada dos semanas: un descanso antes de partido toca recarga solo si pasaron 14 días o más desde la última.
// Se cuenta desde `desde`. Un día puesto a mano en recarga también cuenta y reinicia la cuenta; un día que tocaba recarga
// pero cambiaste a mano a otro plan no cuenta (la recarga pasa al siguiente descanso antes de partido).
// candidata(f): ¿es descanso con partido mañana? · manual(f): plan elegido a mano ese día o nada
export const CADA_RECARGA = 14;
export function tocaRecarga(fecha, { desde, candidata, manual = () => null, cada = CADA_RECARGA }) {
  let ultima = null;
  for (let f = desde; f <= fecha; f = sumarDias(f, 1)) {
    const m = manual(f);
    if (m === 'recarga' || (!m && candidata(f) && (!ultima || diasEntre(ultima, f) >= cada))) ultima = f;
  }
  return ultima === fecha;
}

// Objetivo del plan con un peso: proteína, carbohidratos y grasa por kg; las kcal salen de los macros (4 · P + 4 · C + 9 · G).
// Con proteína fija (protFija, g al día) la proteína no baja al bajar de peso: es lo que protege el músculo en el déficit.
// Sin carbos/grasa por kg (datos de antes) se usa el objetivo de kcal por kg.
export const kcalDeMacros = (p, c, g) => 4 * p + 4 * c + 9 * g;
export function objetivo(config, tipo, peso) {
  const p = config.protFija || Math.round(config.protKg[tipo] * peso);
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

// Sugerencia de la semana: compara el promedio de los últimos 7 días con el de los 7 anteriores. Con pocos registros no concluye
export function sugerenciaPeso(lista, hoy) {
  const diasAtras = (f) => Math.round((Date.parse(hoy) - Date.parse(f)) / 86400000);
  const prom = (xs) => xs.reduce((s, x) => s + x.peso, 0) / xs.length;
  const ahora = lista.filter((x) => diasAtras(x.fecha) < 7), antes = lista.filter((x) => diasAtras(x.fecha) >= 7 && diasAtras(x.fecha) < 14);
  if (ahora.length < 4 || antes.length < 4) return { tipo: 'faltan', cambio: null, texto: 'Pésate al menos 4 días por semana durante 2 semanas para saber si el plan funciona.' };
  const cambio = prom(ahora) - prom(antes);
  if (cambio < -0.9) return { tipo: 'rapido', cambio, texto: 'Bajas muy rápido y puedes perder músculo. Suma 150–200 kcal de carbos, sobre todo alrededor del entreno.' };
  if (cambio <= -0.5) return { tipo: 'bien', cambio, texto: 'Vas al ritmo ideal. No cambies nada.' };
  if (cambio <= -0.2) return { tipo: 'lento', cambio, texto: 'Vas lento pero bajando. Si la fuerza sube, no cambies nada todavía.' };
  return { tipo: 'quieto', cambio, texto: 'El peso casi no cambió. Si sigue igual otra semana y la ropa no te queda más suelta, quita 150 kcal de carbos los días de descanso o camina más.' };
}

// Medidas anotadas, de la más vieja a la más nueva: { fecha, cintura, pecho, brazo, muslo }
export function medidasDe(dias) {
  return Object.keys(dias || {}).sort().filter((f) => dias[f].medidas && Object.keys(dias[f].medidas).length).map((f) => ({ fecha: f, ...dias[f].medidas }));
}
const diasEntre = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
// Cuánto cambió la cintura: la última medida contra la más reciente de hace al menos 12 días
export function cambioCintura(medidas) {
  const con = medidas.filter((m) => m.cintura > 0), fin = con[con.length - 1];
  const inicio = fin && [...con].reverse().find((m) => diasEntre(m.fecha, fin.fecha) >= 12);
  return inicio ? fin.cintura - inicio.cintura : null;
}
// Promedio de energía o hambre (1 a 5) de los últimos 7 días; con menos de 3 días no dice nada
export function promedioSenal(dias, k, hoy) {
  const v = Object.keys(dias || {}).filter((f) => dias[f][k] > 0 && diasEntre(f, hoy) >= 0 && diasEntre(f, hoy) < 7).map((f) => dias[f][k]);
  return v.length >= 3 ? v.reduce((s, n) => s + n, 0) / v.length : null;
}
// Fuerza del último mes: promedio del cambio del 1RM estimado por ejercicio (progresoMes). Con menos de 3 ejercicios no dice nada
export function fuerzaDelMes(progreso) {
  return progreso.length >= 3 ? progreso.reduce((s, x) => s + x.cambio, 0) / progreso.length : null;
}

// Revisión de la semana: junta peso, cintura, fuerza, energía y hambre, y dice si conviene mover los carbos (gramos al día).
// Primero se protege el músculo y la energía; bajar comida es lo último, y nunca si la cintura ya va bajando o hay mucha hambre.
const DIAS_ENTRE_AJUSTES = 14, GRAMOS_AJUSTE = 40;
export function revisionDieta({ lista, dias, progreso = [], ultimoAjuste = null }, hoy) {
  const peso = sugerenciaPeso(lista, hoy), cintura = cambioCintura(medidasDe(dias)), fuerza = fuerzaDelMes(progreso);
  const energia = promedioSenal(dias, 'energia', hoy), hambre = promedioSenal(dias, 'hambre', hoy);
  const senales = { peso: peso.cambio, cintura, fuerza, energia, hambre };
  const fin = (tipo, texto, gramos = 0) => ({ tipo, texto, gramos, senales });
  if (peso.tipo === 'faltan') return fin('faltan', peso.texto);
  if (ultimoAjuste && diasEntre(ultimoAjuste.fecha, hoy) < DIAS_ENTRE_AJUSTES) {
    return fin('espera', 'Ajustaste los carbos hace ' + diasEntre(ultimoAjuste.fecha, hoy) + ' días. Espera a cumplir ' + DIAS_ENTRE_AJUSTES + ' para ver el efecto: cambiar antes confunde los datos.');
  }
  const motivos = [];
  if (peso.tipo === 'rapido') motivos.push('bajas muy rápido');
  if (fuerza != null && fuerza < -0.03) motivos.push('la fuerza va bajando');
  if (energia != null && energia <= 2.5) motivos.push('tienes poca energía');
  if (motivos.length) return fin('subir', 'Conviene comer un poco más: ' + motivos.join(', ') + '. Suma ' + GRAMOS_AJUSTE + ' g de carbos al día en los días de entreno, partido y recarga.' + (energia != null && energia <= 2.5 ? ' Si la energía sigue baja comiendo y durmiendo bien, coméntalo con tu médico.' : ''), GRAMOS_AJUSTE);
  if (peso.tipo === 'bien' || peso.tipo === 'lento') return fin(peso.tipo, peso.texto);
  if (cintura != null && cintura <= -0.5) return fin('recomposicion', 'El peso casi no cambia, pero la cintura bajó: estás perdiendo grasa y conservando músculo. No cambies nada.');
  if (cintura == null) return fin('medir', 'El peso casi no cambió. Antes de comer menos, mide tu cintura durante 2 semanas: puede estar bajando aunque el peso no.');
  if (hambre != null && hambre >= 4) return fin('hambre', 'El peso y la cintura no bajan, pero tienes mucha hambre: no quites comida todavía. Sube la verdura y camina más.');
  return fin('bajar', 'El peso y la cintura no bajan. Quita ' + GRAMOS_AJUSTE + ' g de carbos al día en los días de gym y de descanso; los días de partido y la recarga no se tocan.', -GRAMOS_AJUSTE);
}

// Lo que cambiaría en los planes al mover los carbos. Al subir no se toca el descanso; al bajar no se tocan el partido ni la recarga
export function ajusteCarbos(dt, gramos) {
  const tipos = gramos > 0 ? ['inferior', 'superior', 'recarga', 'futbol'] : ['inferior', 'superior', 'descanso'];
  const c = { ...dt.config, carbKg: { ...dt.config.carbKg } };
  const resultados = tipos.filter((t) => dt.planes[t]).map((t) => {
    c.carbKg[t] = Math.max(0.8, Math.round((((c.carbKg[t] || 0) * c.pesoBase + gramos) / c.pesoBase) * 100) / 100);
    return [t, recalcular(dt.planes[t], dt.alimentos, objetivo(c, t, c.pesoBase))];
  });
  return { carbKg: c.carbKg, resultados };
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
