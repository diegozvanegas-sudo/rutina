// 🎯 Camino a la meta de peso (Dieta → Peso): cuánto falta, a qué ritmo vas, cuándo llegarías, IMC, peso saludable para tu
// estatura, cuántas calorías de déficit pide cada ritmo, semana a semana y consejos según tus datos. Sin pantalla.
// La pantalla está en src/react/pantallas/DietaMeta.tsx. Lista de pesos: [{ fecha, peso }] (dieta.js pesos)
import { sumarDias, diasEntre, lunesDeFecha } from './fechas.js';

export const KCAL_KG = 7700;                    // ~7.700 kcal por kg de grasa
export const RITMOS = [0.25, 0.5, 0.75];        // kg por semana: suave, ideal, rápido (más rápido se pierde músculo)
const prom = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

// Promedio móvil de 7 días (los registros de los 7 días hasta cada fecha): es la línea que vale, no el peso de un día
export function promedioMovil(lista) {
  return lista.map((x) => ({ fecha: x.fecha, peso: x.peso, prom: prom(lista.filter((y) => y.fecha <= x.fecha && diasEntre(y.fecha, x.fecha) < 7).map((y) => y.peso)) }));
}

// Semana a semana (de lunes a domingo): promedio, cuántas veces te pesaste y el cambio contra la semana anterior
export function semanas(lista, max = 12) {
  const g = {};
  for (const x of lista) (g[lunesDeFecha(x.fecha)] ??= []).push(x.peso);
  const out = Object.keys(g).sort().map((lunes) => ({ lunes, prom: prom(g[lunes]), veces: g[lunes].length }));
  out.forEach((s, i) => { s.cambio = i ? s.prom - out[i - 1].prom : null; });
  return out.slice(-max);
}

// Ritmo real: cambio por semana entre el promedio de los últimos 7 días y el de hace 3-4 semanas (o lo que haya, mínimo 10 días)
export function ritmoReal(lista, hoy) {
  const ult = lista.filter((x) => x.fecha <= hoy);
  if (ult.length < 4) return null;
  const ahora = prom(ult.filter((x) => diasEntre(x.fecha, hoy) < 7).map((x) => x.peso));
  const antes = ult.filter((x) => diasEntre(x.fecha, hoy) >= 21 && diasEntre(x.fecha, hoy) < 35);
  const base = antes.length >= 2 ? antes : ult.filter((x) => diasEntre(x.fecha, hoy) >= 10).slice(0, 4);
  if (ahora == null || base.length < 2) return null;
  const dias = diasEntre(base[Math.floor(base.length / 2)].fecha, hoy);
  return dias >= 10 ? ((ahora - prom(base.map((x) => x.peso))) / dias) * 7 : null;
}

// IMC y su categoría (OMS). Con mucho músculo el IMC exagera: la cintura dice más
export function imc(peso, estatura) {
  if (!(peso > 0 && estatura > 0)) return null;
  const v = peso / (estatura / 100) ** 2;
  const cat = v < 18.5 ? 'Bajo peso' : v < 25 ? 'Saludable' : v < 30 ? 'Sobrepeso' : v < 35 ? 'Obesidad grado 1' : v < 40 ? 'Obesidad grado 2' : 'Obesidad grado 3';
  return { v, cat, nivel: v < 18.5 ? 1 : v < 25 ? 0 : v < 30 ? 1 : 2 };
}
// El rango de peso saludable para tu estatura (IMC 18,5 a 24,9)
export const pesoSaludable = (estatura) => (estatura > 0 ? { min: 18.5 * (estatura / 100) ** 2, max: 24.9 * (estatura / 100) ** 2 } : null);

// Todo el camino: { ahora, inicio, meta, falta, avance (0-1), ritmo (kg/sem, negativo = bajando), escenarios por ritmo, real }
export function caminoMeta({ lista, meta, inicio, estatura, hoy }) {
  const ult7 = lista.filter((x) => x.fecha <= hoy && diasEntre(x.fecha, hoy) < 7);
  const ahora = prom((ult7.length ? ult7 : lista.slice(-1)).map((x) => x.peso));
  if (ahora == null) return null;
  const ini = inicio || (lista[0] || {}).peso || ahora, bajar = meta ? meta < ini : true;
  const falta = meta ? Math.abs(ahora - meta) : null, recorrido = meta && ini !== meta ? (bajar ? ini - ahora : ahora - ini) / Math.abs(ini - meta) : null;
  const ritmo = ritmoReal(lista, hoy);
  // Escenarios: a 0,25, 0,5 y 0,75 kg por semana, cuántas semanas, la fecha y el déficit diario que pide cada uno
  const escenarios = falta ? RITMOS.map((r) => ({ ritmo: r, semanas: falta / r, fecha: sumarDias(hoy, Math.round((falta / r) * 7)), kcalDia: Math.round((r * KCAL_KG) / 7) })) : [];
  // Al ritmo real: solo si va hacia la meta
  let real = null;
  if (falta && ritmo != null && Math.abs(ritmo) >= 0.05 && Math.sign(meta - ahora) === Math.sign(ritmo)) {
    const sem = falta / Math.abs(ritmo);
    real = { semanas: sem, fecha: sem <= 156 ? sumarDias(hoy, Math.round(sem * 7)) : null };
  }
  return { ahora, inicio: ini, meta, falta, avance: recorrido == null ? null : Math.max(0, Math.min(1, recorrido)), bajar, ritmo, escenarios, real,
    imc: imc(ahora, estatura), imcMeta: meta ? imc(meta, estatura) : null, saludable: pesoSaludable(estatura), llego: meta != null && (bajar ? ahora <= meta : ahora >= meta) };
}

// 🎯 El ritmo ideal para TU peso: entre el 0,5 % y el 0,75 % por semana baja grasa sin perder fuerza ni músculo; hasta el 1 %
// todavía es aceptable si duermes y comes bien la proteína; más del 1 % ya se lleva músculo y fuerza
export function ritmoIdeal(peso) {
  if (!(peso > 0)) return null;
  return { min: peso * 0.005, max: peso * 0.0075, tope: peso * 0.01, kcalMin: Math.round((peso * 0.005 * KCAL_KG) / 7), kcalMax: Math.round((peso * 0.0075 * KCAL_KG) / 7) };
}
// Cómo va tu ritmo contra el ideal: 'reves' (sube), 'quieto', 'lento', 'ideal', 'rapido' (más del máximo), 'muy-rapido' (más del 1 %)
export function comoVaRitmo(ritmo, peso) {
  const r = ritmoIdeal(peso);
  if (ritmo == null || !r) return null;
  const baja = -ritmo;
  return baja < -0.1 ? 'reves' : baja < 0.1 ? 'quieto' : baja < r.min * 0.9 ? 'lento' : baja <= r.max * 1.1 ? 'ideal' : baja <= r.tope * 1.05 ? 'rapido' : 'muy-rapido';
}

// La proteína para no perder músculo mientras bajas: 1,8 a 2,2 g por kg (con la meta como referencia si estás muy por encima)
export function proteinaDia(peso, meta) {
  const ref = meta && peso > meta * 1.15 ? meta * 1.1 : peso;
  return { min: Math.round(ref * 1.8), max: Math.round(ref * 2.2) };
}

// Consejos según tus datos, del más importante al menos. Sin adornos: si vas mal, lo dice
export function consejosMeta(c, { lista, hoy, cintura, estatura, partidos = 0, pasos = null, fuerza = null }) {
  const out = [];
  if (!c) return out;
  const semana = lista.filter((x) => diasEntre(x.fecha, hoy) < 7 && x.fecha <= hoy).length, ss = semanas(lista, 4);
  if (c.llego) out.push({ ic: '🏁', t: 'Llegaste a la meta', d: 'Ahora el trabajo es mantenerlo: sube las calorías de a 100-150 al día por semana hasta que el peso se quede quieto. Si quieres más, pon una meta nueva.' });
  if (c.ritmo != null && c.bajar && c.ritmo > 0.15) out.push({ ic: '⚠️', t: 'Vas al revés: +' + n1(c.ritmo) + ' kg por semana', d: 'Las 3 causas más comunes: el fin de semana (2 días comiendo de más borran 5 de déficit), lo que se toma (gaseosa, jugos, alcohol) y el picoteo que no se anota. Durante 7 días anota todo, también lo pequeño.' });
  // El ritmo contra el ideal para tu peso (0,5 % a 0,75 % por semana; más del 1 % se lleva músculo)
  const va = c.bajar ? comoVaRitmo(c.ritmo, c.ahora) : null, ri = ritmoIdeal(c.ahora);
  if (va === 'muy-rapido') out.push({ ic: '🐇', t: 'Bajas muy rápido: ' + n1(-c.ritmo) + ' kg por semana', d: 'Es más del 1 % de tu peso: a ese ritmo se va músculo y fuerza, no solo grasa. Sube unas 200 kcal de carbos alrededor del entreno y de los partidos, hasta quedar en ' + n2(ri.min) + '-' + n2(ri.max) + ' kg por semana.' });
  else if (va === 'rapido') out.push({ ic: '🏃', t: 'Un poco rápido: ' + n1(-c.ritmo) + ' kg por semana', d: 'Todavía aceptable, pero lo ideal para ti es ' + n2(ri.min) + '-' + n2(ri.max) + ' kg. Si la fuerza empieza a bajar o duermes mal, come 100-150 kcal más.' });
  // Fuerza mientras bajas (fuerza: cambio promedio del 1RM en el mes, de dieta.js fuerzaDelMes)
  if (fuerza != null && c.bajar && c.ritmo != null && c.ritmo < -0.1) {
    if (fuerza < -0.03) out.push({ ic: '📉', t: 'Estás perdiendo fuerza: ' + Math.round(fuerza * 100) + ' % en el mes', d: 'Bajar de peso no debería quitarte fuerza en los básicos. Baja el déficit (100-200 kcal más, en carbos antes del gym), revisa la proteína y el sueño, y no vayas al fallo en todo.' });
    else out.push({ ic: '💪', t: 'Bajas sin perder fuerza', d: 'Tu fuerza del mes ' + (fuerza > 0.005 ? 'sube un ' + Math.round(fuerza * 100) + ' %' : 'se mantiene') + ' mientras bajas de peso: es la señal de que pierdes grasa y no músculo. Sigue igual.' });
  }
  if (va === 'ideal' && !(fuerza != null && fuerza < -0.03)) out.push({ ic: '✅', t: 'Vas en tu ritmo ideal: ' + n1(-c.ritmo) + ' kg por semana', d: 'Entre ' + n2(ri.min) + ' y ' + n2(ri.max) + ' kg es lo mejor para ti: bajas grasa, cuidas el músculo y es fácil de mantener. No cambies nada.' });
  const quieto = ss.length >= 3 && ss.slice(-3).every((s) => s.cambio != null && Math.abs(s.cambio) < 0.2);
  if (quieto && !c.llego) out.push({ ic: '⏸', t: 'Estancado 3 semanas', d: 'Normal después de bajar un tiempo: el cuerpo gasta menos. Prueba en este orden: 2.000 pasos más al día, quita 150 kcal de carbos los días de descanso, revisa el sueño (menos de 7 h da más hambre). No recortes de golpe.' });
  if (semana < 4) out.push({ ic: '⚖️', t: 'Pésate más seguido: llevas ' + semana + ' esta semana', d: 'Con 4 o más pesajes por semana el promedio es confiable. Siempre igual: en ayunas, después del baño, misma báscula.' });
  if (!cintura) out.push({ ic: '📏', t: 'Mide tu cintura', d: 'A la altura del ombligo, sin apretar, una vez por semana. Si la cintura baja y el peso no, estás ganando músculo: vas bien.' });
  else if (estatura && cintura / estatura >= 0.5) out.push({ ic: '📏', t: 'Cintura: ' + n1(cintura) + ' cm, la meta es menos de ' + Math.round(estatura / 2), d: 'La grasa de la barriga es la que más riesgo trae. Baja con el déficit y la fuerza, no con abdominales: no se puede quemar grasa de un solo lugar.' });
  if (c.imc && c.imcMeta && c.saludable && c.meta > c.saludable.max + 0.5) out.push({ ic: '🎯', t: 'Tu meta (' + n1(c.meta) + ' kg) sigue en IMC ' + n1(c.imcMeta.v), d: 'No está mal como primera meta. Con gym el IMC exagera porque no distingue músculo; cuando llegues, decide con la cintura y la foto si sigues hasta ' + Math.round(c.saludable.max) + ' kg.' });
  if (partidos > 0) out.push({ ic: '⚽', t: 'Los días de fútbol no recortes carbos', d: 'El partido gasta 600-900 kcal: come carbos antes (arroz, papa, pan) y proteína después. Recorta en los días de descanso, no en los de partido.' });
  if (pasos != null && pasos < 8000) out.push({ ic: '🚶', t: 'Pasos: ' + Math.round(pasos).toLocaleString('es-CO') + ' al día', d: 'Llegar a 8.000-10.000 quema unas 200-300 kcal más sin cansar las piernas para el fútbol.' });
  return out;
}
const n1 = (x) => (Math.round(x * 10) / 10).toLocaleString('es-CO');
const n2 = (x) => (Math.round(x * 100) / 100).toLocaleString('es-CO');
