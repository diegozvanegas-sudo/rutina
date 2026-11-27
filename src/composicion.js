// 🩺 Controles de composición (Dieta → Peso): lo que mide la nutricionista con la báscula de bioimpedancia en cada control
// (peso, IMC, % grasa, % masa muscular, grasa visceral y cintura). Se comparan dos controles como en su "registro de
// evolución", pero además en kg: el % de músculo sube solo con bajar de peso, aunque no ganes nada, y eso confunde.
// Lo anotado va en dieta.controles = [{ id, fecha, peso, imc?, grasa, musculo, visceral, cintura, quien?, nota? }].
import { imc as imcDe } from './meta-peso.js';
import { desdeIso, fechaCorta } from './fechas.js';

// bueno: 1 = mejor si sube, -1 = mejor si baja, 0 = depende de tu meta (el peso)
export const PARAMETROS = [
  { k: 'peso', t: 'Peso', u: 'kg', ic: '⚖️', min: 20, max: 300, bueno: 0 },
  { k: 'imc', t: 'IMC', u: 'kg/m²', ic: '📐', min: 10, max: 70, bueno: -1 },
  { k: 'grasa', t: '% Grasa corporal', u: '%', ic: '🧈', min: 2, max: 70, bueno: -1 },
  { k: 'musculo', t: '% Masa muscular', u: '%', ic: '💪', min: 10, max: 70, bueno: 1 },
  { k: 'visceral', t: 'Grasa visceral', u: '', ic: '🎯', min: 1, max: 59, bueno: -1 },
  { k: 'cintura', t: 'Cintura', u: 'cm', ic: '📏', min: 40, max: 200, bueno: -1 },
];
// Lo que la app saca de los porcentajes: los kg de verdad
export const DERIVADOS = [
  { k: 'grasaKg', t: 'Grasa en kg', u: 'kg', ic: '🧈', bueno: -1 },
  { k: 'musculoKg', t: 'Músculo en kg', u: 'kg', ic: '💪', bueno: 1 },
];
const CAMPOS = PARAMETROS.map((p) => p.k);
const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;
const n1 = (n) => r1(n).toLocaleString('es-CO');
const n2 = (n) => r2(n).toLocaleString('es-CO');
const conSigno = (n, f = n1) => (n > 0 ? '+' : n < 0 ? '−' : '') + f(Math.abs(n));
const num = (v) => { const n = Number(String(v ?? '').replace(',', '.')); return Number.isFinite(n) && n > 0 ? n : null; };

// Limpia lo escrito: números con coma o punto, fuera de rango no se guarda. Devuelve null si no hay nada que guardar.
export function limpiarControl(r) {
  const x = { fecha: /^\d{4}-\d{2}-\d{2}$/.test(r.fecha || '') ? r.fecha : null };
  if (!x.fecha) return null;
  let alguno = false;
  for (const p of PARAMETROS) {
    const n = num(r[p.k]);
    if (n != null && n >= p.min && n <= p.max) { x[p.k] = p.k === 'visceral' ? Math.round(n * 2) / 2 : r1(n); alguno = true; }
  }
  if (!alguno) return null;
  const quien = String(r.quien || '').trim().slice(0, 60), nota = String(r.nota || '').trim().slice(0, 500);
  if (quien) x.quien = quien;
  if (nota) x.nota = nota;
  return x;
}

// Ordenados del más viejo al más nuevo
export const controlesDe = (dieta) => [...((dieta && dieta.controles) || [])].sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));

export function guardarControl(dieta, r, id = null) {
  const x = limpiarControl(r);
  if (!x) return null;
  const lista = (dieta.controles ??= []);
  const i = id ? lista.findIndex((c) => c.id === id) : -1;
  if (i >= 0) { lista[i] = { id, ...x }; return lista[i]; }
  const nuevo = { id: 'ct' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ...x };
  lista.push(nuevo);
  return nuevo;
}
export function borrarControl(dieta, id) {
  const i = (dieta.controles || []).findIndex((c) => c.id === id);
  if (i >= 0) dieta.controles.splice(i, 1);
  return i >= 0;
}

// El control con lo calculado: IMC (el anotado manda; si no, con tu estatura), kg de grasa y de músculo
export function completar(c, estatura) {
  const x = { ...c };
  if (x.imc == null && x.peso && estatura) x.imc = r1(imcDe(x.peso, estatura).v);
  if (x.peso && x.grasa) x.grasaKg = r2((x.peso * x.grasa) / 100);
  if (x.peso && x.musculo) x.musculoKg = r2((x.peso * x.musculo) / 100);
  return x;
}

// Compara dos controles: una fila por parámetro que esté en los dos, con la diferencia y si fue para bien
export function comparar(a0, b0, { estatura = null, bajar = true } = {}) {
  const a = completar(a0, estatura), b = completar(b0, estatura);
  const dias = Math.round((desdeIso(b.fecha) - desdeIso(a.fecha)) / 86400000);
  const fila = (p) => {
    if (a[p.k] == null || b[p.k] == null) return null;
    const dif = p.k.endsWith('Kg') ? r2(b[p.k] - a[p.k]) : r1(b[p.k] - a[p.k]);
    const sentido = p.bueno || (bajar ? -1 : 1);
    return { ...p, a: a[p.k], b: b[p.k], dif, bien: dif === 0 ? null : dif * sentido > 0 };
  };
  return { a, b, dias, filas: PARAMETROS.map(fila).filter(Boolean), derivados: DERIVADOS.map(fila).filter(Boolean) };
}

// La lectura honesta de la comparación: qué pasó de verdad en kg, a qué ritmo, y lo que el % esconde
export function conclusion(cmp, { estatura = null } = {}) {
  const { a, b, dias } = cmp, out = [], semanas = dias / 7, meses = dias / 30.4;
  if (dias < 1) return [{ ic: '📅', t: 'Son del mismo día', d: 'Para comparar hacen falta dos controles en fechas distintas; lo ideal es cada 4 a 8 semanas.' }];
  const dG = a.grasaKg != null && b.grasaKg != null ? b.grasaKg - a.grasaKg : null;
  const dM = a.musculoKg != null && b.musculoKg != null ? b.musculoKg - a.musculoKg : null;
  const dP = a.peso && b.peso ? b.peso - a.peso : null;
  const tiempo = dias < 60 ? Math.round(semanas) + ' semanas' : n1(meses) + ' meses';

  if (dG != null && dM != null) {
    const ganoM = dM >= 0.3, perdioM = dM <= -0.3, bajoG = dG <= -0.5, subioG = dG >= 0.5;
    if (bajoG && ganoM) out.push({ ic: '🔄', tipo: 'recomposicion', t: 'Recomposición: menos grasa y más músculo', d: 'En ' + tiempo + ': ' + conSigno(dG, n2) + ' kg de grasa y ' + conSigno(dM, n2) + ' kg de músculo. Es lo más difícil de lograr y se está dando.' });
    else if (bajoG && !perdioM) out.push({ ic: '✅', tipo: 'grasa', t: 'Bajaste grasa y cuidaste el músculo', d: 'En ' + tiempo + ': ' + conSigno(dG, n2) + ' kg de grasa; el músculo quedó casi igual (' + conSigno(dM, n2) + ' kg). Es justo lo que se busca en déficit.' });
    else if (bajoG && perdioM) out.push({ ic: '⚠️', tipo: 'perdida-musculo', t: 'Bajaste grasa, pero también músculo', d: conSigno(dG, n2) + ' kg de grasa y ' + conSigno(dM, n2) + ' kg de músculo en ' + tiempo + '. Revisa la proteína (1,8 a 2,2 g por kg), que la fuerza no baje en el gym y que el déficit no sea muy grande.' });
    else if (subioG && ganoM) out.push({ ic: '📈', tipo: 'volumen', t: 'Subiste músculo y también grasa', d: conSigno(dM, n2) + ' kg de músculo y ' + conSigno(dG, n2) + ' kg de grasa. Si tu meta es bajar, estás comiendo de más.' });
    else if (subioG) out.push({ ic: '🔺', tipo: 'subio-grasa', t: 'Subió la grasa', d: conSigno(dG, n2) + ' kg de grasa en ' + tiempo + '. Mira si se te fueron las comidas fuera del plan o los antojos.' });
    else if (perdioM) out.push({ ic: '⚠️', tipo: 'perdida-musculo', t: 'Bajó el músculo', d: conSigno(dM, n2) + ' kg de músculo sin bajar grasa. Revisa proteína, sueño y que estés entrenando con carga.' });
    else out.push({ ic: '⏸️', tipo: 'igual', t: 'Casi todo igual', d: 'Grasa ' + conSigno(dG, n2) + ' kg y músculo ' + conSigno(dM, n2) + ' kg en ' + tiempo + ': dentro de lo que varía la báscula entre un día y otro.' });

    // Lo que el % esconde: cuánto del % de músculo sube solo por pesar menos
    const dPct = b.musculo - a.musculo, soloPorPeso = r1((a.musculoKg / b.peso) * 100 - a.musculo);
    if (dPct > 0 && dP < 0 && soloPorPeso > 0.1) {
      const real = r1(dPct - soloPorPeso);
      out.push({ ic: '🔍', tipo: 'porcentaje', t: 'Ojo con el % de músculo', d: 'De los ' + conSigno(dPct) + ' puntos de músculo, ' + n1(Math.min(soloPorPeso, dPct)) + ' salen solo de pesar menos: con los mismos kg de músculo el % sube igual. ' + (real > 0.05 ? 'Lo que de verdad ganaste son ' + n2(dM) + ' kg.' : 'En kg el músculo casi no cambió (' + conSigno(dM, n2) + ' kg).') });
    }

    // Ritmos: grasa por semana y músculo por mes contra lo que es posible
    if (dG < 0 && semanas >= 2) {
      const gS = -dG / semanas;
      out.push({ ic: '⏱️', tipo: 'ritmo-grasa', t: 'Grasa: ' + n2(gS) + ' kg por semana', d: gS < 0.15 ? 'Lento pero sostenible. Si quieres más ritmo, sin perder músculo se puede llegar a 0,3 a 0,5 kg de grasa por semana.' : gS <= 0.6 ? 'Buen ritmo: rápido y sin poner en riesgo el músculo.' : 'Muy rápido: cuida que no se vaya músculo y fuerza.' });
    }
    if (dM > 0 && meses >= 0.5) {
      const mM = dM / meses;
      out.push({ ic: '🏋️', tipo: 'ritmo-musculo', t: 'Músculo: ' + n2(mM) + ' kg por mes', d: mM > 1 ? 'Es más de lo que se gana sin ayuda (con déficit, 0,1 a 0,5 kg al mes). Casi seguro es agua o una medición en condiciones distintas: no lo tomes como real hasta el próximo control.' : mM > 0.5 ? 'Muy alto para estar en déficit. Puede ser real si eres principiante, pero parte suele ser agua o glucógeno.' : 'Realista para alguien que entrena y está en déficit: es progreso de verdad, aunque no se vea grande.' });
    }
  } else if (dP != null) {
    out.push({ ic: '⚖️', tipo: 'solo-peso', t: 'Peso: ' + conSigno(dP) + ' kg en ' + tiempo, d: 'Sin el % de grasa y de músculo no se sabe si fue grasa, músculo o agua. Pídelos en el próximo control.' });
  }

  if (a.cintura && b.cintura) {
    const dC = b.cintura - a.cintura;
    const limite = estatura ? estatura / 2 : null;
    out.push({ ic: '📏', tipo: 'cintura', t: 'Cintura: ' + conSigno(dC) + ' cm', d: (dC < 0 ? 'Baja la grasa de la barriga, la que más riesgo trae.' : dC > 0 ? 'Subió: la grasa de la barriga es la que más riesgo trae.' : 'Quieta.') + (limite ? ' La meta para tu estatura: menos de ' + Math.round(limite) + ' cm' + (b.cintura < limite ? ' (ya estás).' : ' (te faltan ' + n1(b.cintura - limite) + ').') : '') });
  }
  if (b.visceral != null) out.push({ ic: '🎯', tipo: 'visceral', t: 'Grasa visceral: ' + n1(b.visceral), d: b.visceral <= 9 ? 'En rango sano (1 a 9 en la mayoría de básculas). ' + (b.visceral >= 8 ? 'Está cerca del límite: que siga bajando.' : '') : b.visceral <= 14 ? 'Alta (10 a 14). Baja con el déficit, el cardio y la fuerza, y es la que más importa para la salud.' : 'Muy alta (15 o más). Coméntalo con tu médico.' });
  out.push({ ic: '🔬', tipo: 'medicion', t: 'Para que el próximo control sirva', d: 'La bioimpedancia cambia 1 a 3 puntos de grasa solo por el agua: mismo aparato, misma hora, en ayunas, sin entrenar antes y con la vejiga vacía. Un control solo no dice mucho; la tendencia de 3 o más, sí.' });
  return out;
}

// Para mandar por WhatsApp a la nutricionista o al entrenador
export function textoComparacion(cmp, conclu) {
  const u = (p, v) => n1(v) + (p.u === '%' ? ' %' : p.u ? ' ' + p.u : '');
  const l = ['🩺 Mi evolución: ' + fechaCorta(cmp.a.fecha) + ' → ' + fechaCorta(cmp.b.fecha) + ' (' + cmp.dias + ' días)', ''];
  for (const p of [...cmp.filas, ...cmp.derivados]) l.push(p.ic + ' ' + p.t + ': ' + u(p, p.a) + ' → ' + u(p, p.b) + ' (' + conSigno(p.dif, p.k.endsWith('Kg') ? n2 : n1) + ')' + (p.bien === true ? ' ✅' : p.bien === false ? ' 🔺' : ''));
  l.push('');
  for (const c of conclu.filter((x) => x.tipo !== 'medicion')) l.push(c.ic + ' ' + c.t + '. ' + c.d);
  return l.join('\n');
}

export const CAMPOS_CONTROL = CAMPOS;
