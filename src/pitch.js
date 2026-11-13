// Plan B → Módulo 5: Pitch (ruta de trabajo autónomo de Comfama; los ejercicios son propios). Un pitch de 1 minuto armado
// por bloques, con sugerencias sacadas del módulo 4 (problema, propuesta de valor, prueba), ensayos cronometrados y
// respuestas a las preguntas difíciles. Solo la lógica; la pantalla está en vistas/pitch.js.
// Se guarda en finanzas.desempleo.pitch: { bloques: { gancho, problema, … }, respuestas: { … }, ensayos: [{ fecha, segundos }], textos: {} }
import { fraseValor, resultadoExperimento } from './innovacion.js';

export const BLOQUES_PITCH = [
  ['gancho', '🎣 Gancho', 'Una pregunta o un dato que haga que te escuchen (5-10 s).'],
  ['problema', '😣 El problema', 'Quién lo sufre y cuánto le cuesta (10 s).'],
  ['solucion', '💡 Tu solución', 'Qué ofreces y por qué es mejor que lo de hoy (15 s).'],
  ['prueba', '📊 La prueba', 'Lo que ya pasó: clientes, ventas, personas que dijeron que sí (10 s).'],
  ['tu', '🙋 Por qué tú', 'Tu experiencia o lo que te hace la persona indicada (10 s).'],
  ['pedido', '🤝 Lo que pides', 'Una sola cosa concreta: una compra, una reunión, un contacto (5 s).'],
];
export const PREGUNTAS_DIFICILES = [
  ['precio', '¿Cuánto cuesta y cuánto ganas por cada venta?'],
  ['competencia', '¿Quién más hace esto y por qué te elegirían a ti?'],
  ['riesgo', '¿Qué puede salir mal y qué harías?'],
  ['necesitas', '¿Qué necesitas exactamente y para qué lo usarías?'],
];
export const CONSEJOS = [
  'Empieza por el problema, no por ti ni por tu producto.', 'Un número concreto vale más que tres adjetivos.',
  'Habla como le hablarías a un amigo: sin palabras raras.', 'Termina con lo que pides y quédate en silencio.',
  'Ensáyalo en voz alta hasta decirlo sin leer.', 'Grábate una vez en video y mírate.',
];
export const SEGUNDOS_PITCH = 60;

export function pitchDe(p) {
  const x = (p.pitch ??= {});
  x.bloques ??= {}; x.respuestas ??= {}; x.ensayos ??= []; x.textos ??= {};
  return x;
}
// ≈ 2,5 palabras por segundo hablando tranquilo (150 por minuto)
export const palabras = (t) => (String(t || '').trim().match(/\S+/g) || []).length;
export const segundosDe = (t) => Math.round(palabras(t) / 2.5);
export const textoPitch = (x) => BLOQUES_PITCH.map(([k]) => (x.bloques[k] || '').trim()).filter(Boolean).join(' ');
export const duracionPitch = (x) => segundosDe(textoPitch(x));

// Sugerencias para cada bloque a partir del módulo 4 (solo las que tienen con qué)
export function sugerencias(inn) {
  const s = {};
  if (!inn) return s;
  const pr = inn.problemas.find((p) => p.id === inn.elegido), idea = inn.ideas.find((i) => i.id === inn.idea), v = inn.valor || {};
  const problema = v.problema || (pr && pr.texto);
  if (problema) {
    s.gancho = v.cliente ? '¿Conoces a ' + v.cliente + ' que ' + problema.replace(/^que\s+/i, '') + '?' : 'Piensa en esto: ' + problema.replace(/^que\s+/i, '') + '.';
    s.problema = (v.cliente ? v.cliente[0].toUpperCase() + v.cliente.slice(1) : 'Mucha gente') + ' ' + problema.replace(/^que\s+/i, '') + '.';
  }
  const f = fraseValor(v);
  if (f) s.solucion = f;
  else if (idea && idea.texto) s.solucion = 'Mi solución: ' + idea.texto + '.';
  const r = resultadoExperimento(inn.experimento || {});
  if (r && r.si) s.prueba = 'Ya lo probé: de ' + r.personas + ' personas, ' + r.si + ' dijeron que sí' + (r.pct ? ' (' + r.pct + ' %)' : '') + '.';
  return s;
}

export function avancePitch(x) {
  const llenos = BLOQUES_PITCH.filter(([k]) => (x.bloques[k] || '').trim()).length, seg = duracionPitch(x);
  const pasos = [
    ['Los 6 bloques', llenos === BLOQUES_PITCH.length],
    ['Dura 1 minuto o menos', llenos > 0 && seg <= SEGUNDOS_PITCH + 5],
    ['3 ensayos', x.ensayos.length >= 3],
    ['Preguntas difíciles', PREGUNTAS_DIFICILES.every(([k]) => (x.respuestas[k] || '').trim())],
  ];
  return { pasos, hechos: pasos.filter((p) => p[1]).length, total: pasos.length, llenos, segundos: seg };
}

export function textoCompartirPitch(x) {
  const L = ['*Mi pitch de 1 minuto*', ''];
  for (const [k, t] of BLOQUES_PITCH) if ((x.bloques[k] || '').trim()) L.push(t + ': ' + x.bloques[k].trim());
  L.push('', '⏱️ ≈ ' + duracionPitch(x) + ' s');
  const r = PREGUNTAS_DIFICILES.filter(([k]) => (x.respuestas[k] || '').trim());
  if (r.length) { L.push('', '*Preguntas difíciles*'); for (const [k, p] of r) L.push(p + ' ' + x.respuestas[k].trim()); }
  return L.join('\n');
}
