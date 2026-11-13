// Plan B → Módulo 4: Innovación (ruta de trabajo autónomo de Comfama; los ejercicios son propios, sin la guía a la mano).
// Lleva de un problema real a una idea probada, lista para el pitch del módulo 5. Solo la lógica; la pantalla está en vistas/innovacion.js.
// Se guarda en finanzas.desempleo.innovacion:
//   problemas: [{ id, texto, notas: { frecuencia, dolor, pagar, puedo } }]   elegido: id del problema
//   entrevistas: [{ id, quien, fecha, aprendi }]
//   scamper: { s, c, a, m, p, e, r }   ideas: [{ id, texto, impacto: 'alto'|'bajo', esfuerzo: 'alto'|'bajo' }]   idea: id
//   valor: { cliente, problema, solucion, beneficio, alternativa }   prototipo: tipo
//   experimento: { hipotesis, meta, personas, si, veredicto }   textos: { aprendi, siguiente, pitch }
const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

export const TIPOS_INNOVACION = [
  ['🧴 Producto', 'Algo nuevo o mejor que la gente usa (una arepa congelada lista en 3 minutos).'],
  ['⚙️ Proceso', 'Hacer lo mismo más rápido, barato o fácil (agendar citas por WhatsApp en vez de llamadas).'],
  ['💼 Modelo de negocio', 'Cobrar o entregar distinto (alquilar herramientas en vez de venderlas).'],
  ['🤝 Servicio o experiencia', 'Cómo se siente el cliente (te llevan el mercado y te ayudan a guardarlo).'],
];
// Criterios para escoger el problema: de 1 a 5 cada uno
export const CRITERIOS = [
  ['frecuencia', '¿Qué tan seguido pasa?'], ['dolor', '¿Cuánto le molesta a quien lo sufre?'],
  ['pagar', '¿Pagarían por resolverlo?'], ['puedo', '¿Lo puedo resolver yo, con lo que sé y tengo?'],
];
export const SCAMPER = [
  ['s', 'Sustituir', '¿Qué material, persona o paso puedes cambiar por otro?'],
  ['c', 'Combinar', '¿Qué dos cosas puedes juntar en una?'],
  ['a', 'Adaptar', '¿Qué solución de otro sector o país puedes copiar y ajustar?'],
  ['m', 'Modificar', '¿Qué haces más grande, más pequeño, más rápido o más bonito?'],
  ['p', 'Poner otro uso', '¿Para qué más sirve lo que ya existe?'],
  ['e', 'Eliminar', '¿Qué quitas y sigue funcionando (o funciona mejor)?'],
  ['r', 'Reordenar', '¿Qué pasa si cambias el orden, o lo haces al revés?'],
];
export const PROTOTIPOS = [
  ['dibujo', '✏️ Un dibujo o boceto'], ['maqueta', '📦 Una maqueta o una muestra'], ['whatsapp', '📱 Un mensaje o catálogo de WhatsApp'],
  ['mano', '🙌 Hacerlo a mano para 3 clientes'], ['video', '🎬 Un video corto explicándolo'], ['pagina', '🌐 Una página sencilla con el precio'],
];
export const VEREDICTOS = [['seguir', '✅ Seguir: funcionó'], ['ajustar', '🔧 Ajustar y probar otra vez'], ['cambiar', '🔄 Cambiar de idea']];

export function innovacionDe(p) {
  const x = (p.innovacion ??= {});
  x.problemas ??= []; x.entrevistas ??= []; x.scamper ??= {}; x.ideas ??= []; x.valor ??= {}; x.experimento ??= {}; x.textos ??= {};
  return x;
}
export const nuevoProblema = (texto = '') => ({ id: uid('pr'), texto, notas: {} });
export const nuevaEntrevista = () => ({ id: uid('en'), quien: '', fecha: '', aprendi: '' });
export const nuevaIdea = (texto = '') => ({ id: uid('id'), texto, impacto: '', esfuerzo: '' });

// Puntaje de 4 a 20 (null si falta calificar algún criterio)
export function puntaje(pr) {
  const n = CRITERIOS.map(([k]) => Number(pr.notas && pr.notas[k]) || 0);
  return n.every((v) => v >= 1) ? n.reduce((s, v) => s + v, 0) : null;
}
// Los problemas calificados, de mayor a menor (en empate, el que más duele)
export const ranking = (x) => x.problemas.filter((pr) => puntaje(pr) != null)
  .sort((a, b) => puntaje(b) - puntaje(a) || (b.notas.dolor || 0) - (a.notas.dolor || 0));

// Matriz impacto / esfuerzo
export function cuadrante(idea) {
  const { impacto: i, esfuerzo: e } = idea;
  if (!i || !e) return null;
  return i === 'alto' ? (e === 'bajo' ? ['ya', '🚀 Hazla ya'] : ['plan', '🗺️ Vale la pena: planéala']) : (e === 'bajo' ? ['rapida', '🧩 Victoria pequeña'] : ['no', '🗑️ Déjala']);
}

// "Para [cliente] que [problema], [solución] le permite [beneficio], a diferencia de [alternativa]"
export function fraseValor(v) {
  if (!v.cliente || !v.solucion) return '';
  return 'Para ' + v.cliente + (v.problema ? ' que ' + v.problema : '') + ', ' + v.solucion + (v.beneficio ? ' le permite ' + v.beneficio : '') +
    (v.alternativa ? ', a diferencia de ' + v.alternativa : '') + '.';
}
// Cuántos dijeron que sí frente a la meta
export function resultadoExperimento(ex) {
  const personas = Number(ex.personas) || 0, si = Number(ex.si) || 0, meta = Number(ex.meta) || 0;
  if (!personas) return null;
  return { personas, si, meta, pct: Math.round(si / personas * 100), logrado: meta > 0 ? si >= meta : null };
}

export function avanceInnovacion(x) {
  const t = x.textos, v = x.valor, ex = x.experimento;
  const pasos = [
    ['1. Tipos de innovación', !!t.tipo],
    ['2. Un problema que valga la pena', !!x.elegido && x.problemas.some((p) => p.id === x.elegido)],
    ['3. Hablar con 3 personas', x.entrevistas.filter((e) => e.aprendi && e.aprendi.trim()).length >= 3],
    ['4. Ideas y la elegida', x.ideas.length >= 3 && !!x.idea],
    ['5. Propuesta de valor', !!fraseValor(v)],
    ['6. Prototipo y prueba', !!x.prototipo && !!ex.veredicto],
    ['7. Conclusiones', !!(t.aprendi && t.siguiente)],
  ];
  return { pasos, hechos: pasos.filter((p) => p[1]).length, total: pasos.length };
}

export function textoInnovacion(x) {
  const L = ['*Innovación: de un problema a una idea probada*'], t = x.textos;
  const pr = x.problemas.find((p) => p.id === x.elegido);
  if (pr) L.push('', '*El problema*', pr.texto + (puntaje(pr) != null ? ' (' + puntaje(pr) + '/20)' : ''));
  const en = x.entrevistas.filter((e) => e.aprendi);
  if (en.length) { L.push('', '*Lo que aprendí hablando con la gente*'); for (const e of en) L.push('• ' + (e.quien ? e.quien + ': ' : '') + e.aprendi); }
  const idea = x.ideas.find((i) => i.id === x.idea);
  if (idea) L.push('', '*La idea*', idea.texto + (cuadrante(idea) ? ' · ' + cuadrante(idea)[1] : ''));
  const f = fraseValor(x.valor);
  if (f) L.push('', '*Propuesta de valor*', f);
  const pt = PROTOTIPOS.find(([k]) => k === x.prototipo);
  if (pt) L.push('', '*Prototipo*', pt[1]);
  const ex = x.experimento, r = resultadoExperimento(ex);
  if (ex.hipotesis || r) {
    L.push('', '*La prueba*');
    if (ex.hipotesis) L.push('Creo que: ' + ex.hipotesis);
    if (r) L.push(r.si + ' de ' + r.personas + ' dijeron que sí (' + r.pct + ' %)' + (r.meta ? ' · meta ' + r.meta : ''));
    const v = VEREDICTOS.find(([k]) => k === ex.veredicto);
    if (v) L.push(v[1]);
  }
  if (t.aprendi) L.push('', '*Lo que aprendí*', t.aprendi);
  if (t.siguiente) L.push('', '*Mi siguiente paso*', t.siguiente);
  return L.join('\n');
}
