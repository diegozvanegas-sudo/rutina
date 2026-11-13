// Finanzas → 🛟 Plan B → Módulo 4: Innovación. Siete pasos en tarjetas que se abren y cierran: tipos de innovación,
// escoger un problema con puntaje, hablar con 3 personas, ideas con SCAMPER y la matriz impacto/esfuerzo, propuesta de
// valor, prototipo y prueba barata, y conclusiones. Todo se guarda solo y se puede compartir.
import { e, guardar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { esc, registrar, toast, barra, copiarTexto } from '../ui.js';
import { planDe } from '../desempleo.js';
import { innovacionDe, nuevoProblema, nuevaEntrevista, nuevaIdea, puntaje, ranking, cuadrante, fraseValor, resultadoExperimento, avanceInnovacion, textoInnovacion,
  TIPOS_INNOVACION, CRITERIOS, SCAMPER, PROTOTIPOS, VEREDICTOS } from '../innovacion.js';

export const inn = () => innovacionDe(planDe(e().finanzas));
const tarjeta = (n, titulo, cuerpo) => '<section class="tarjeta pb" data-ancla="in-' + n + '"><h2><span class="pb-n">' + n + '</span> ' + titulo + '</h2>' + cuerpo + '</section>';
const punto = (titulo, texto) => '<p class="pb-punto"><b>' + titulo + '</b> ' + texto + '</p>';
const area = (k, titulo, ayuda, filas = 3) => '<label class="campo">' + titulo + '<textarea rows="' + filas + '" data-cambio="in-texto" data-k="' + k + '" placeholder="' + esc(ayuda) + '">' + esc(inn().textos[k] || '') + '</textarea></label>';
const chip = (accion, datos, texto, activo) => '<button type="button" class="chip' + (activo ? ' activo' : '') + '" data-accion="' + accion + '"' + datos + ' aria-pressed="' + !!activo + '">' + texto + '</button>';

function problemas(x) {
  const top = ranking(x);
  return '<p class="pb-punto">Una buena idea empieza por un <b>problema real</b>, no por un producto. Anota problemas que tú o la gente que conoces sufren (en tu barrio, en tu oficio, en tu trabajo anterior) y califica cada uno del 1 al 5.</p>' +
    '<div class="in-problemas">' + x.problemas.map((pr, i) => {
      const p = puntaje(pr);
      return '<div class="in-problema' + (x.elegido === pr.id ? ' elegido' : '') + '"><div class="in-fila"><input type="text" data-cambio="in-problema" data-i="' + i + '" value="' + esc(pr.texto) + '" placeholder="Ej.: los vecinos no tienen quién les arregle el celular cerca" autocomplete="off" aria-label="Problema ' + (i + 1) + '">' +
        '<button type="button" class="icono borrar" data-accion="in-problema-borrar" data-i="' + i + '" aria-label="Borrar el problema">🗑</button></div>' +
        CRITERIOS.map(([k, t]) => '<div class="in-criterio"><small>' + t + '</small><div class="lid-notas" role="group" aria-label="' + esc(t) + '">' + [1, 2, 3, 4, 5].map((n) =>
          chip('in-nota', ' data-i="' + i + '" data-k="' + k + '" data-n="' + n + '"', n, pr.notas[k] === n)).join('') + '</div></div>').join('') +
        '<div class="in-pie"><b>' + (p != null ? p + ' / 20' : 'Califica los 4') + '</b>' + chip('in-elegir', ' data-id="' + pr.id + '"', x.elegido === pr.id ? '⭐ El elegido' : 'Elegir este', x.elegido === pr.id) + '</div></div>';
    }).join('') + '</div>' +
    '<button type="button" class="boton ' + (x.problemas.length ? 'secundario' : 'primario') + '" data-accion="in-problema-nuevo">＋ Problema</button>' +
    (top.length >= 2 ? '<p class="nota-corta">🏆 El de más puntaje: <b>' + esc(top[0].texto || 'sin nombre') + '</b> (' + puntaje(top[0]) + '/20). Elige con la cabeza, pero también con el que te emocione resolver.</p>' : '') +
    '<p class="nota-corta">Lo ideal: que pase seguido, que duela, que paguen por resolverlo y que tú puedas hacerlo. Con 16 o más tienes un buen candidato.</p>';
}

function entrevistas(x) {
  const hechas = x.entrevistas.filter((en) => en.aprendi && en.aprendi.trim()).length;
  return '<p class="pb-punto">Antes de inventar, <b>pregunta</b>. Habla con 3 personas que tengan el problema y pregúntales por lo que <b>ya hicieron</b>, no por lo que harían:</p>' +
    '<ul class="puntos-libro"><li>«Cuéntame la última vez que te pasó. ¿Qué hiciste?»</li><li>«¿Cuánto te costó (plata o tiempo)?»</li><li>«¿Qué has probado para resolverlo? ¿Por qué no te sirvió?»</li></ul>' +
    '<p class="nota-corta">No les cuentes tu idea todavía: por amabilidad te van a decir que sí. Lo que hicieron vale más que lo que opinan.</p>' +
    '<div class="in-entrevistas">' + x.entrevistas.map((en, i) => '<div class="cr-dia' + (en.aprendi ? ' hecho' : '') + '"><div class="in-fila"><input type="text" data-cambio="in-entrevista" data-i="' + i + '" data-k="quien" value="' + esc(en.quien) + '" placeholder="¿Con quién hablaste?" autocomplete="off" aria-label="Persona ' + (i + 1) + '">' +
      '<button type="button" class="icono borrar" data-accion="in-entrevista-borrar" data-i="' + i + '" aria-label="Borrar la conversación">🗑</button></div>' +
      '<textarea rows="2" data-cambio="in-entrevista" data-i="' + i + '" data-k="aprendi" placeholder="Lo que aprendiste (algo que no sabías)" aria-label="Lo que aprendiste de la persona ' + (i + 1) + '">' + esc(en.aprendi) + '</textarea>' +
      (en.fecha ? '<small class="nota-corta">' + fechaCorta(en.fecha) + '</small>' : '') + '</div>').join('') + '</div>' +
    '<button type="button" class="boton ' + (x.entrevistas.length < 3 ? 'primario' : 'secundario') + '" data-accion="in-entrevista-nueva">＋ Conversación</button>' +
    '<p class="nota-corta">' + hechas + ' de 3 conversaciones con aprendizaje.</p>' +
    area('patron', '🔁 ¿Qué se repitió en las conversaciones?', 'Ej.: a todos les preocupa más el tiempo que la plata', 2);
}

function ideas(x) {
  const pr = x.problemas.find((p) => p.id === x.elegido);
  return (pr ? '<p class="cg-lectura">🧩 Problema: <b>' + esc(pr.texto) + '</b></p>' : '<p class="aviso">Elige primero un problema en el punto 2.</p>') +
    punto('SCAMPER:', 'siete preguntas para sacar ideas de algo que ya existe. Responde las que te salgan, sin juzgar.') +
    '<div class="in-scamper">' + SCAMPER.map(([k, n, q]) => '<label class="campo"><span><b class="in-letra">' + k.toUpperCase() + '</b> ' + n + ' <small>' + q + '</small></span>' +
      '<input type="text" data-cambio="in-scamper" data-k="' + k + '" value="' + esc(x.scamper[k] || '') + '" autocomplete="off"></label>').join('') + '</div>' +
    punto('Tus ideas:', 'escribe al menos 3 (pueden salir del SCAMPER) y ubícalas según su impacto y su esfuerzo. Elige una con la ⭐.') +
    '<div class="in-ideas">' + x.ideas.map((idea, i) => {
      const q = cuadrante(idea);
      return '<div class="in-idea' + (x.idea === idea.id ? ' elegida' : '') + '"><div class="in-fila"><input type="text" data-cambio="in-idea" data-i="' + i + '" value="' + esc(idea.texto) + '" placeholder="Idea ' + (i + 1) + '" autocomplete="off" aria-label="Idea ' + (i + 1) + '">' +
        '<button type="button" class="icono cr-estrella" data-accion="in-idea-elegir" data-id="' + idea.id + '" aria-pressed="' + (x.idea === idea.id) + '" aria-label="Elegir la idea ' + (i + 1) + '">' + (x.idea === idea.id ? '⭐' : '☆') + '</button>' +
        '<button type="button" class="icono borrar" data-accion="in-idea-borrar" data-i="' + i + '" aria-label="Borrar la idea">🗑</button></div>' +
        '<div class="in-matriz">' + [['impacto', 'Impacto', ['alto', 'bajo']], ['esfuerzo', 'Esfuerzo', ['bajo', 'alto']]].map(([k, t, vs]) =>
          '<span class="in-eje" role="group" aria-label="' + t + '"><small>' + t + '</small>' + vs.map((v) => chip('in-idea-eje', ' data-i="' + i + '" data-k="' + k + '" data-v="' + v + '"', v, idea[k] === v)).join('') + '</span>').join('') +
        (q ? '<b class="in-q ' + q[0] + '">' + q[1] + '</b>' : '') + '</div></div>';
    }).join('') + '</div>' +
    '<button type="button" class="boton ' + (x.ideas.length < 3 ? 'primario' : 'secundario') + '" data-accion="in-idea-nueva">＋ Idea</button>' +
    matriz(x);
}

// La matriz dibujada: cada idea en su cuadro
function matriz(x) {
  const con = x.ideas.filter((i) => cuadrante(i));
  if (!con.length) return '';
  const caja = (k, t) => '<div class="in-caja ' + k + '"><small>' + t + '</small>' + con.filter((i) => cuadrante(i)[0] === k).map((i) => '<span' + (x.idea === i.id ? ' class="elegida"' : '') + '>' + esc(i.texto || 'sin nombre') + '</span>').join('') + '</div>';
  return '<div class="in-tablero" role="img" aria-label="Matriz de impacto y esfuerzo"><span class="in-eje-y">Impacto ↑</span>' +
    caja('ya', '🚀 Hazla ya') + caja('plan', '🗺️ Planéala') + caja('rapida', '🧩 Victoria pequeña') + caja('no', '🗑️ Déjala') + '<span class="in-eje-x">Esfuerzo →</span></div>';
}

function valor(x) {
  const v = x.valor, f = fraseValor(v), idea = x.ideas.find((i) => i.id === x.idea), pr = x.problemas.find((p) => p.id === x.elegido);
  const campo = (k, t, ayuda) => '<label class="campo">' + t + '<input type="text" data-cambio="in-valor" data-k="' + k + '" value="' + esc(v[k] || '') + '" placeholder="' + esc(ayuda) + '" autocomplete="off"></label>';
  return '<p class="pb-punto">Una frase que diga <b>para quién</b> es, <b>qué problema</b> resuelve y <b>por qué es mejor</b> que lo que ya usan. Será el centro de tu pitch.</p>' +
    campo('cliente', 'Para (¿quién?)', 'Ej.: mamás que trabajan en el centro') +
    campo('problema', 'que (¿qué problema tienen?)', pr ? pr.texto : 'Ej.: no tienen tiempo de cocinar entre semana') +
    campo('solucion', 'mi solución', idea ? idea.texto : 'Ej.: un menú semanal congelado') +
    campo('beneficio', 'le permite (¿qué gana?)', 'Ej.: comer casero en 5 minutos') +
    campo('alternativa', 'a diferencia de (¿qué usan hoy?)', 'Ej.: los domicilios caros y poco saludables') +
    (f ? '<blockquote class="in-frase">💬 ' + esc(f) + '</blockquote>' : '<p class="nota-corta">Llena al menos «para» y «mi solución» y aquí sale tu frase.</p>');
}

function prueba(x) {
  const ex = x.experimento, r = resultadoExperimento(ex);
  const num = (k, t) => '<label class="campo">' + t + '<input type="text" inputmode="numeric" data-cambio="in-exp" data-k="' + k + '" data-tipo="num" value="' + (ex[k] ?? '') + '"></label>';
  return '<p class="pb-punto">No gastes en grande antes de saber si funciona. Haz la versión <b>más barata y rápida</b> que deje a alguien decir «sí, lo quiero» (mejor si paga o aparta).</p>' +
    '<div class="chips envolver" role="group" aria-label="Tipo de prototipo">' + PROTOTIPOS.map(([k, t]) => chip('in-prototipo', ' data-v="' + k + '"', t, x.prototipo === k)).join('') + '</div>' +
    '<label class="campo">🔬 Creo que… (tu hipótesis)<input type="text" data-cambio="in-exp" data-k="hipotesis" value="' + esc(ex.hipotesis || '') + '" placeholder="Ej.: de 10 vecinos, al menos 3 apartan el menú pagando la mitad" autocomplete="off"></label>' +
    '<div class="in-tres">' + num('personas', 'Le mostré a') + num('si', 'Dijeron que sí / pagaron') + num('meta', 'Mi meta era') + '</div>' +
    (r ? '<div class="in-resultado"><div class="barra"><span style="width:' + Math.min(100, r.pct) + '%"></span></div><p><b>' + r.si + ' de ' + r.personas + '</b> (' + r.pct + ' %)' +
      (r.logrado === true ? ' · <b class="verde">✓ Lograste la meta</b>' : r.logrado === false ? ' · <b class="rojo">No llegó a la meta (' + r.meta + ')</b>' : '') + '</p></div>' : '') +
    '<p class="pb-punto"><b>¿Qué decides?</b></p><div class="chips envolver" role="group" aria-label="Decisión">' + VEREDICTOS.map(([k, t]) => chip('in-veredicto', ' data-v="' + k + '"', t, ex.veredicto === k)).join('') + '</div>' +
    '<p class="nota-corta">Cambiar de idea no es fracasar: es lo que ahorra meses y plata. Casi ninguna idea sale bien en el primer intento.</p>';
}

export function vistaInnovacion() {
  const x = inn(), av = avanceInnovacion(x);
  return '<section class="tarjeta pb-resumen"><h2>🚀 Módulo 4: Innovación</h2>' +
    '<p class="nota-corta">De un problema real a una idea probada con gente de verdad, lista para tu pitch del módulo 5. Cada paso se abre y cierra tocando su título.</p>' +
    '<div class="datos-peso"><div><small>Pasos hechos</small><b>' + av.hechos + ' / ' + av.total + '</b></div><div><small>Problemas</small><b>' + x.problemas.length + '</b></div>' +
    '<div><small>Conversaciones</small><b>' + x.entrevistas.filter((en) => en.aprendi).length + ' / 3</b></div><div><small>Ideas</small><b>' + x.ideas.length + '</b></div></div>' + barra(av.hechos / av.total) +
    '<ul class="cr-pasos">' + av.pasos.map(([t, ok]) => '<li class="' + (ok ? 'ok' : '') + '">' + (ok ? '✓' : '○') + ' ' + esc(t) + '</li>').join('') + '</ul></section>' +
    tarjeta(1, 'Qué es innovar',
      '<p class="pb-punto">Innovar no es inventar algo que nadie ha visto: es <b>resolver mejor un problema</b> y que alguien lo use (o pague). Casi siempre es una mejora pequeña sobre algo que ya existe.</p>' +
      '<div class="in-tipos">' + TIPOS_INNOVACION.map(([t, d]) => '<div><b>' + t + '</b><small>' + d + '</small></div>').join('') + '</div>' +
      area('tipo', '🔎 Piensa en un negocio que admiras: ¿qué innovó y de qué tipo fue?', 'Ej.: Rappi innovó en servicio: te llevan cualquier cosa, no solo comida', 2)) +
    tarjeta(2, 'Encuentra un problema que valga la pena', problemas(x)) +
    tarjeta(3, 'Habla con 3 personas', entrevistas(x)) +
    tarjeta(4, 'Genera ideas y elige una', ideas(x)) +
    tarjeta(5, 'Tu propuesta de valor', valor(x)) +
    tarjeta(6, 'Prototipa y prueba barato', prueba(x)) +
    tarjeta(7, 'Conclusiones',
      area('aprendi', '¿Qué aprendiste de innovar con gente de verdad?', 'Ej.: lo que yo creía importante no era lo que a ellos les importaba', 3) +
      area('siguiente', '¿Cuál es tu siguiente paso concreto (y cuándo)?', 'Ej.: el sábado vendo 5 menús a los vecinos del edificio', 2) +
      '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="in-enviar">📤 Compartir</button><button type="button" class="boton secundario" data-accion="in-copiar">📋 Copiar texto</button></div>');
}

const enfocar = (sel) => setTimeout(() => { const t = document.querySelectorAll(sel); if (t.length) { t[t.length - 1].focus({ preventScroll: true }); t[t.length - 1].scrollIntoView({ block: 'center' }); } }, 60);
const quitar = (lista, i, nombre) => { const k = Number(i), v = lista[k]; if (!v) return; lista.splice(k, 1); guardar(); toast(nombre + ' borrada', () => { lista.splice(k, 0, v); guardar(); }); };
registrar({
  'in-texto'({ k }, el) { inn().textos[k] = el.value.trim(); guardar(); },
  'in-problema-nuevo'() { inn().problemas.push(nuevoProblema()); guardar(); enfocar('[data-cambio=in-problema]'); },
  'in-problema'({ i }, el) { const p = inn().problemas[Number(i)]; if (p) { p.texto = el.value.trim(); guardar(); } },
  'in-problema-borrar'({ i }) { quitar(inn().problemas, i, 'Problema'); },
  'in-nota'({ i, k, n }) { const p = inn().problemas[Number(i)]; if (!p) return; const v = Number(n); if (p.notas[k] === v) delete p.notas[k]; else p.notas[k] = v; guardar(); },
  'in-elegir'({ id }) { const x = inn(); x.elegido = x.elegido === id ? null : id; guardar(); if (x.elegido) toast('⭐ Problema elegido: ahora habla con 3 personas que lo tengan'); },
  'in-entrevista-nueva'() { inn().entrevistas.push(nuevaEntrevista()); guardar(); enfocar('[data-cambio=in-entrevista][data-k=quien]'); },
  'in-entrevista'({ i, k }, el) { const en = inn().entrevistas[Number(i)]; if (!en) return; en[k] = el.value.trim(); if (k === 'aprendi' && en.aprendi && !en.fecha) en.fecha = iso(); guardar(); },
  'in-entrevista-borrar'({ i }) { quitar(inn().entrevistas, i, 'Conversación'); },
  'in-scamper'({ k }, el) { inn().scamper[k] = el.value.trim(); guardar(); },
  'in-idea-nueva'() { inn().ideas.push(nuevaIdea()); guardar(); enfocar('[data-cambio=in-idea]'); },
  'in-idea'({ i }, el) { const d = inn().ideas[Number(i)]; if (d) { d.texto = el.value.trim(); guardar(); } },
  'in-idea-borrar'({ i }) { quitar(inn().ideas, i, 'Idea'); },
  'in-idea-eje'({ i, k, v }) { const d = inn().ideas[Number(i)]; if (!d) return; d[k] = d[k] === v ? '' : v; guardar(); },
  'in-idea-elegir'({ id }) { const x = inn(); x.idea = x.idea === id ? null : id; guardar(); },
  'in-valor'({ k }, el) { inn().valor[k] = el.value.trim(); guardar(); },
  'in-prototipo'({ v }) { const x = inn(); x.prototipo = x.prototipo === v ? '' : v; guardar(); },
  'in-exp'({ k, tipo }, el) {
    const ex = inn().experimento;
    if (tipo === 'num') { const n = Math.round(Number(String(el.value).replace(',', '.'))); if (el.value.trim() === '' || !(n >= 0)) delete ex[k]; else ex[k] = n; }
    else ex[k] = el.value.trim();
    guardar();
  },
  'in-veredicto'({ v }) { const ex = inn().experimento; ex.veredicto = ex.veredicto === v ? '' : v; guardar(); },
  'in-copiar'() { copiarTexto(textoInnovacion(inn()), '📋 Copiado'); },
  async 'in-enviar'() {
    const t = textoInnovacion(inn());
    if (navigator.share) { try { await navigator.share({ title: 'Mi idea innovadora', text: t }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(t, '📋 Copiado: compártelo con quien quieras');
  },
});
