// Plan B → Módulo 3: Despertar creativo (guía de Comfama, trabajo autónomo). Solo la lógica; la pantalla está en vistas/creativo.js.
// Se guarda en finanzas.desempleo.creativo (viaja a la nube con lo demás):
//   textos: { seguido, cama, plato, reto, magico, sentir, norma, perspectiva, problema, porque, ayudo, aprendi, cambios, aplicar }
//   reto: [{ actividad, fecha }] × 3     una actividad distinta cada día durante 3 días (fecha = el día que la hiciste)
//   soluciones: ['', '', '']  elegida: 0-2   las 3 soluciones simples a un problema y la que escogiste
import { fechaCorta } from './fechas.js';

export const PREGUNTAS_RUTINA = [
  ['seguido', '¿Qué tan seguido haces lo mismo todos los días?'],
  ['cama', '¿Cuántos años llevas durmiendo en el mismo lado de la cama?'],
  ['plato', '¿Siempre pides el mismo plato en tu restaurante favorito?'],
];
// Las tres de la guía primero; las demás son más ideas del mismo tipo
export const IDEAS_RETO = [
  '🛣️ Cambiar mi ruta habitual', '📻 Una emisora o un pódcast que nunca he oído', '🍦 Un sabor o una comida que nunca he probado',
  '🛏️ Dormir del otro lado de la cama', '✋ Hacer algo con la otra mano', '📰 Leer de un tema que nunca leo',
  '🚶 Caminar 20 min sin celular', '💬 Hablar con alguien que no conozco', '🎵 Un género de música que no escucho',
];
export const HERRAMIENTAS_NINO = ['Imaginación', 'Creatividad', 'Intuición', 'Curiosidad', 'Empatía'];
export const NORMAS_EJEMPLO = ['¿Cómo sería un restaurante donde no se pidiera dinero, sino tiempo?', '¿Cómo funcionaría un sistema educativo que no usara exámenes?'];
export const CONCLUSIONES = [
  ['aprendi', '¿Qué aprendiste sobre tu propio potencial creativo?'],
  ['cambios', '¿Qué cambios harás en tu vida diaria para seguir estimulando tu creatividad?'],
  ['aplicar', '¿Cómo puedes aplicar estas herramientas (imaginación, curiosidad, intuición…) en tu trabajo o estudios?'],
];

export function creativoDe(p) {
  const c = (p.creativo ??= {});
  c.textos ??= {};
  c.reto ??= [];
  while (c.reto.length < 3) c.reto.push({ actividad: '', fecha: '' });
  c.soluciones ??= [];
  while (c.soluciones.length < 3) c.soluciones.push('');
  return c;
}

// Los días del reto hechos, y si dos quedaron el mismo día (la guía pide uno distinto cada día)
export function avanceReto(c) {
  const hechos = c.reto.filter((d) => d.fecha);
  const fechas = hechos.map((d) => d.fecha);
  return { hechos: hechos.length, mismoDia: new Set(fechas).size < fechas.length, completo: hechos.length === 3 };
}

// Lo que falta, punto por punto (para la barra de arriba)
export function avanceCreativo(c) {
  const t = c.textos, lleno = (k) => !!(t[k] && t[k].trim());
  const pasos = [
    ['1. Tu rutina', PREGUNTAS_RUTINA.some(([k]) => lleno(k))],
    ['1. Reto de 3 días', avanceReto(c).completo],
    ['1. Párrafo del reto', lleno('reto')],
    ['2.1 Imaginación infantil', lleno('magico') && lleno('sentir')],
    ['2.2 Diversidad de pensamiento', lleno('norma') && lleno('perspectiva')],
    ['2.3 Simplificación creativa', !!t.problema && c.soluciones.filter((s) => s && s.trim()).length >= 3 && c.elegida != null && lleno('porque')],
    ['3. Conclusiones', CONCLUSIONES.every(([k]) => lleno(k))],
  ];
  return { pasos, hechos: pasos.filter((x) => x[1]).length, total: pasos.length };
}

// Todo el módulo en texto, para guardarlo o compartirlo
export function textoCreativo(c) {
  const t = c.textos, L = ['*Despertar creativo*'];
  const r = PREGUNTAS_RUTINA.filter(([k]) => t[k]);
  if (r.length) { L.push('', '*Mi rutina*'); for (const [k, p] of r) L.push(p + ' ' + t[k]); }
  const hechos = c.reto.filter((d) => d.actividad || d.fecha);
  if (hechos.length) { L.push('', '*Reto de 3 días*'); c.reto.forEach((d, i) => { if (d.actividad || d.fecha) L.push((d.fecha ? '✅ ' : '• ') + 'Día ' + (i + 1) + ': ' + (d.actividad || '—') + (d.fecha ? ' (' + fechaCorta(d.fecha) + ')' : '')); }); }
  if (t.reto) L.push('', t.reto);
  if (t.magico || t.sentir) L.push('', '*Imaginación infantil*', ...(t.magico ? ['Lo mágico: ' + t.magico] : []), ...(t.sentir ? ['Lo que sentí: ' + t.sentir] : []));
  if (t.norma || t.perspectiva) L.push('', '*Diversidad de pensamiento*', ...(t.norma ? ['Mi idea: ' + t.norma] : []), ...(t.perspectiva ? [t.perspectiva] : []));
  const sol = c.soluciones.filter((s) => s && s.trim());
  if (t.problema || sol.length) {
    L.push('', '*Simplificación creativa*');
    if (t.problema) L.push('Problema: ' + t.problema);
    c.soluciones.forEach((s, i) => { if (s && s.trim()) L.push((c.elegida === i ? '⭐ ' : (i + 1) + '. ') + s); });
    if (t.porque) L.push('Por qué funciona: ' + t.porque);
    if (t.ayudo) L.push('Cómo me ayudó simplificar: ' + t.ayudo);
  }
  const con = CONCLUSIONES.filter(([k]) => t[k]);
  if (con.length) { L.push('', '*Conclusiones*'); for (const [k, p] of con) L.push(p + ' ' + t[k]); }
  return L.join('\n');
}
