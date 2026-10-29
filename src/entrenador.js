// Entrenador: lo que la app concluye de tus datos para decirte qué hacer hoy (sin pantalla, para poder probarlo).
// Disposición del día, carga del fútbol, qué te hace rendir, lo único que mejorar, constancia del gym, proteína de la semana
// y peso corporal para la fuerza relativa.
import { e, avanceMetas, hayFutbol, planDieta, comidasDelDia, hechosManana } from './estado.js';
import { iso, sumarDias, semanaDe, lunesDe, diaSemana, diasEntre } from './fechas.js';
import { mejorSerie, resumenSemana } from './gym.js';
import { horasSueno, partidos, hayPartido } from './registro.js';
import { totalPlan, pesos, tendencia } from './dieta.js';
import { puntajeDia } from './progreso.js';
import { visibles } from './orden.js';

const f1 = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const f2 = (n) => n.toFixed(2).replace('.', ',');
const promedio = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const diaGym = (fecha) => e().rutina.find((x) => x.id !== 'core' && x.diaSemana === diaSemana(fecha)) || null;

// ---------- Carga del fútbol (agudo:crónico) ----------
// Carga de 7 días contra el promedio semanal de 28 días. Por encima de 1,3 sube el riesgo de lesión; de 1,5, mucho.
// Necesita 3 semanas de partidos anotados para tener con qué comparar.
export function cargaFutbol(fecha = iso()) {
  const lista = partidos(e()).filter((p) => p.fecha <= fecha);
  if (!lista.length) return null;
  const suma = (dias) => lista.filter((p) => diasEntre(p.fecha, fecha) < dias).reduce((s, p) => s + p.carga, 0);
  const aguda = suma(7), cronica = suma(28) / 4;
  if (diasEntre(lista[0].fecha, fecha) < 21 || !cronica) return { aguda, cronica, ratio: null, estado: 'pocos' };
  const ratio = aguda / cronica;
  return { aguda, cronica, ratio, estado: ratio > 1.5 ? 'peligro' : ratio > 1.3 ? 'alta' : ratio < 0.8 ? 'baja' : 'ok' };
}
export function textoCarga(c) {
  if (!c || c.ratio == null) return '';
  const r = f2(c.ratio);
  return { peligro: 'Esta semana jugaste ' + r + ' veces tu carga normal: riesgo alto de lesión. Baja minutos o intensidad y nada de pierna pesada.',
    alta: 'Carga del fútbol en ' + r + ' (sobre 1,3 sube el riesgo): cuida la rodilla, calienta bien y no hagas pierna pesada antes de jugar.',
    baja: 'Jugaste menos de lo normal (' + r + '): si vuelves a jugar fuerte, sube poco a poco.',
    ok: 'Carga del fútbol en ' + r + ': en la zona segura (0,8 a 1,3).' }[c.estado];
}

// ---------- Disposición del día: 🟢 sube · 🟡 mantén · 🔴 suave ----------
const NIVELES = {
  verde: { icono: '🟢', titulo: 'Hoy sube peso', consejo: 'Vas fresco: si te toca subir, súbelo y busca la meta de cada ejercicio.' },
  amarillo: { icono: '🟡', titulo: 'Hoy mantén', consejo: 'El mismo peso de la última vez y busca igualar tus reps. No es día de récords.' },
  rojo: { icono: '🔴', titulo: 'Hoy suave', consejo: 'Baja 10-20 % el peso o cambia por movilidad y la sesión de rodilla. Recuperar también es entrenar.' },
};
export function disposicion(fecha = iso()) {
  const d = e().dias[fecha] || {}, h = horasSueno(d.sueno), calidad = d.sueno && d.sueno.calidad, razones = [];
  let puntos = 100;
  const restar = (n, texto) => { puntos -= n; razones.push(texto); };
  if (h != null && h < 6) restar(30, 'Dormiste ' + f1(h) + ' h');
  else if (h != null && h < 7) restar(15, 'Dormiste ' + f1(h) + ' h (menos de 7)');
  if (calidad && calidad <= 2) restar(10, 'Dormiste mal (' + calidad + '/5)');
  const ayer = (e().dias[sumarDias(fecha, -1)] || {}).partido;
  if (hayPartido(ayer)) {
    const duro = Number(ayer.rpe) >= 8 || (Number(ayer.minutos) || 0) * (Number(ayer.rpe) || 0) >= 600;
    restar(duro ? 20 : 10, 'Jugaste ayer' + (duro ? ' a tope' : ''));
    if (Number(ayer.energia) && Number(ayer.energia) <= 2) restar(10, 'Terminaste el partido sin piernas');
  }
  const molestias = [...new Set(partidos(e()).filter((p) => p.fecha <= fecha && diasEntre(p.fecha, fecha) <= 3).flatMap((p) => p.molestias || []))];
  if (molestias.length) restar(25, 'Molestia reciente: ' + molestias.join(', ').toLowerCase());
  const carga = cargaFutbol(fecha);
  if (carga && carga.estado === 'peligro') restar(20, 'Carga del fútbol muy alta (' + f2(carga.ratio) + ')');
  else if (carga && carga.estado === 'alta') restar(10, 'Carga del fútbol alta (' + f2(carga.ratio) + ')');
  if (hayFutbol(fecha)) restar(10, 'Juegas esta noche');
  puntos = Math.max(0, puntos);
  const nivel = puntos >= 80 ? 'verde' : puntos >= 55 ? 'amarillo' : 'rojo', gym = diaGym(fecha);
  let consejo = NIVELES[nivel].consejo;
  if (molestias.length && gym && gym.calentamiento === 'pierna') consejo += ' Con molestia en ' + molestias.join(', ').toLowerCase() + ', hoy nada de pierna pesada.';
  return { puntos, nivel, ...NIVELES[nivel], consejo, razones, sinSueno: h == null, molestias, carga };
}

// ---------- ¿Qué te hace rendir? ----------
// Cada sesión se compara con su propia tendencia: el 1RM estimado de cada ejercicio contra el promedio de la sesión
// anterior y la siguiente del mismo ejercicio (así no pesa que con las semanas uno se haga más fuerte)
export function sesionesGym(hasta = iso()) {
  const est = e(), porFecha = {};
  for (const d of est.rutina) {
    if (!d.diaSemana || d.id === 'core') continue;
    for (const ej of d.ejercicios) {
      const f = ej.filas[0];
      if (!f || f.unidad === 's') continue;
      const puntos = Object.keys(est.semanas || {}).map(Number).filter((n) => n >= 1).sort((a, b) => a - b)
        .map((n) => ({ n, fecha: sumarDias(lunesDe(n), d.diaSemana - 1), m: mejorSerie((est.semanas[n] || {})[f.id]) }))
        .filter((p) => p.m && p.fecha <= hasta);
      const u = puntos.length && puntos[puntos.length - 1].m.unidad, lista = puntos.filter((p) => p.m.unidad === u);
      lista.forEach((p, k) => {
        const vecinos = [lista[k - 1], lista[k + 1]].filter(Boolean).map((x) => x.m.rm);
        if (vecinos.length) (porFecha[p.fecha] ??= []).push(p.m.rm / promedio(vecinos) - 1);
      });
    }
  }
  return Object.entries(porFecha).sort(([a], [b]) => a.localeCompare(b)).map(([fecha, xs]) => ({ fecha, rend: promedio(xs), ejercicios: xs.length }));
}
// Cada factor dice si la sesión fue en buenas o malas condiciones (null = sin dato)
const FACTORES = [
  { id: 'sueno', bien: 'Con 7 h o más de sueño', mal: 'con menos de 7 h', de: (f) => { const h = horasSueno((e().dias[f] || {}).sueno); return h == null ? null : h >= 7; } },
  { id: 'calidad', bien: 'Cuando duermes bien (4-5/5)', mal: 'cuando duermes mal (1-2/5)', de: (f) => { const c = ((e().dias[f] || {}).sueno || {}).calidad; return !c || c === 3 ? null : c >= 4; } },
  { id: 'partido', bien: 'Sin partido el día antes', mal: 'con partido el día antes', de: (f) => !hayPartido((e().dias[sumarDias(f, -1)] || {}).partido) },
  { id: 'proteina', bien: 'Con la proteína del día anterior cumplida', mal: 'sin cumplirla', de: (f) => { const p = proteinaDia(sumarDias(f, -1)); return p && p.comido ? p.parte >= 0.9 : null; } },
];
export function queTeHaceRendir(hasta = iso()) {
  const ses = sesionesGym(hasta), out = [];
  for (const x of FACTORES) {
    const bien = [], mal = [];
    for (const s of ses) { const v = x.de(s.fecha); if (v === true) bien.push(s.rend); else if (v === false) mal.push(s.rend); }
    if (bien.length < 2 || mal.length < 2) { out.push({ id: x.id, faltan: true, bien: bien.length, mal: mal.length }); continue; }
    const dif = promedio(bien) - promedio(mal), pct = f1(Math.abs(dif) * 100) + ' %', n = ' (' + bien.length + ' y ' + mal.length + ' sesiones)';
    out.push({ id: x.id, dif, bien: bien.length, mal: mal.length,
      texto: Math.abs(dif) < 0.01 ? x.bien + ' rindes casi igual que ' + x.mal + n + '.' : x.bien + ' rindes ' + pct + (dif > 0 ? ' más' : ' menos') + ' que ' + x.mal + n + '.' });
  }
  return { sesiones: ses.length, factores: out };
}

// ---------- Proteína ----------
export function proteinaDia(fecha) {
  if (!e().dieta) return null;
  const meta = totalPlan(planDieta(fecha), e().dieta.alimentos).p, comido = comidasDelDia(fecha).p;
  return { fecha, comido, meta, parte: meta ? comido / meta : 0 };
}
// Últimos 7 días (hasta hoy): cuántos llegaste al 90 % de la proteína del plan y el promedio
export function proteinaSemana(hasta = iso()) {
  if (!e().dieta) return null;
  const dias = Array.from({ length: 7 }, (_, i) => proteinaDia(sumarDias(hasta, i - 6)));
  return { dias, cumplidos: dias.filter((d) => d.parte >= 0.9).length, gramos: promedio(dias.map((d) => d.comido)), parte: promedio(dias.map((d) => Math.min(1, d.parte))) };
}

// ---------- Lo único que mejorar hoy (lo más flojo de ayer) ----------
const META = {
  agua: (v, m) => 'Ayer tomaste ' + f1(v / 1000) + ' L de ' + f1(m / 1000) + '. Hoy lo único: 500 ml apenas te levantes y la botella siempre a la vista.',
  pasos: (v, m) => 'Ayer caminaste ' + Math.round(v).toLocaleString('es-CO') + ' pasos de ' + m.toLocaleString('es-CO') + '. Hoy lo único: 20 minutos caminando después de almorzar.',
  calorias: (v, m) => 'Ayer comiste ' + Math.round(v).toLocaleString('es-CO') + ' de ' + m.toLocaleString('es-CO') + ' kcal. Hoy lo único: no te saltes ninguna comida del plan.',
  lectura: (v, m) => 'Ayer leíste ' + v + ' de ' + m + ' minutos. Hoy lo único: 10 minutos de lectura antes de abrir el celular en la noche.',
  pantalla: (v, m) => (v == null ? 'Ayer no anotaste el tiempo de pantalla. Hoy lo único: míralo en la noche y anótalo.'
    : 'Ayer pasaste ' + v + ' minutos en redes (máximo ' + m + '). Hoy lo único: el celular fuera del cuarto en la noche.'),
};
export function unicoMejorar(fecha = iso()) {
  const ayer = sumarDias(fecha, -1), p = e().dias[ayer] ? puntajeDia(ayer) : null, op = [];
  const h = horasSueno((e().dias[fecha] || {}).sueno);
  if (h != null) op.push({ v: Math.min(1, h / 7.5), icono: '🌙', ir: '#hoy', texto: 'Anoche dormiste ' + f1(h) + ' h. Hoy lo único: acuéstate 30 minutos antes; la fuerza y la recuperación empiezan en la cama.' });
  if (p) {
    const partes = p.partes;
    if (partes.manana != null) op.push({ v: partes.manana, icono: '☀️', ir: '#manana', texto: 'Ayer hiciste ' + hechosManana(ayer) + ' de ' + e().habitos.length + ' de la primera hora. Hoy lo único: la mañana completa, empezando por lo que más se te salta.' });
    if (partes.metas != null) {
      const a = avanceMetas(ayer), k = visibles(e().config, 'metas').filter((x) => x in a.partes).sort((x, y) => a.partes[x] - a.partes[y])[0];
      if (k && META[k]) op.push({ v: a.partes[k], icono: '🎯', ir: '#metas', texto: META[k](a.valores[k], a.meta[k]) });
    }
    if (partes.gym != null && diaGym(ayer)) {
      const r = resumenSemana([diaGym(ayer)], e().semanas[semanaDe(ayer)] || {});
      op.push({ v: partes.gym, icono: '🏋️', ir: '#gym', texto: 'Ayer hiciste ' + r.hechas + ' de ' + r.plan + ' series. Hoy lo único: no te saltes el primer ejercicio; empezar ya es la mitad.' });
    }
    if (partes.dieta != null) {
      const prot = proteinaDia(ayer);
      if (prot && prot.comido && prot.parte < partes.dieta) op.push({ v: prot.parte, icono: '🍗', ir: '#dieta', texto: 'Ayer comiste ' + Math.round(prot.comido) + ' g de proteína de ' + Math.round(prot.meta) + '. Hoy lo único: proteína en cada comida.' });
      else op.push({ v: partes.dieta, icono: '🥗', ir: '#dieta', texto: 'Ayer marcaste ' + comidasDelDia(ayer).n + ' de ' + planDieta(ayer).comidas.length + ' comidas. Hoy lo único: deja lista la próxima comida antes de salir.' });
    }
  }
  if (!op.length) return { icono: '📝', ir: '#manana', texto: 'Anota hoy tu mañana, tus metas y lo que comas: mañana te digo qué es lo único que mejorar.' };
  const peor = op.sort((a, b) => a.v - b.v)[0];
  if (peor.v >= 0.9) return { icono: '🌟', ir: '#progreso', texto: 'Ayer cumpliste casi todo' + (p ? ' (' + p.total + '/100)' : '') + '. Lo único: repetirlo hoy.' };
  return peor;
}

// ---------- Constancia del gym (para el calendario) ----------
// hecho: al menos una serie anotada ese día · falto: ya pasó sin nada · pendiente: hoy o más adelante · null: no toca gym
export function estadoGym(fecha, hoy = iso()) {
  const d = diaGym(fecha), sem = semanaDe(fecha);
  if (!d || sem < 1) return null;
  if (resumenSemana([d], e().semanas[sem] || {}).hechas > 0) return 'hecho';
  return fecha < hoy ? 'falto' : 'pendiente';
}
// Entrenos seguidos sin faltar (hoy cuenta si ya se hizo) y lo del mes hasta hoy
export function constanciaGym(mes, hoy = iso()) {
  let racha = 0;
  for (let f = hoy, n = 0; n < 400; f = sumarDias(f, -1), n++) {
    const s = estadoGym(f, hoy);
    if (s === 'hecho') racha++;
    else if (s === 'falto' || (s === null && semanaDe(f) < 1)) break;
  }
  const fechas = Array.from({ length: 31 }, (_, i) => sumarDias(mes + '-01', i)).filter((f) => f.startsWith(mes) && f <= hoy);
  const estados = fechas.map((f) => estadoGym(f, hoy)).filter((s) => s === 'hecho' || s === 'falto');
  return { racha, hechos: estados.filter((s) => s === 'hecho').length, plan: estados.length };
}

// ---------- Peso corporal para la fuerza relativa ----------
// Promedio de los últimos 7 pesos anotados hasta esa fecha
export const pesoCorporalEn = (fecha) => tendencia(pesos(e().dias).filter((x) => x.fecha <= fecha));
