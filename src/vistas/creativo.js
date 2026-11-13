// Finanzas → 🛟 Plan B → Módulo 3: Despertar creativo. Los 4 puntos de la guía de Comfama, cada uno en una tarjeta que se
// abre y cierra, con lo que se hace ahí mismo: responder, marcar el reto de 3 días, el cronómetro de 7 segundos para dibujar
// y las 3 soluciones simples. Lo escrito se guarda solo y se puede compartir.
import { e, guardar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { esc, registrar, toast, barra, copiarTexto } from '../ui.js';
import { planDe } from '../desempleo.js';
import { creativoDe, avanceReto, avanceCreativo, textoCreativo, PREGUNTAS_RUTINA, IDEAS_RETO, HERRAMIENTAS_NINO, NORMAS_EJEMPLO, CONCLUSIONES } from '../creativo.js';

const cr = () => creativoDe(planDe(e().finanzas));
const tarjeta = (n, titulo, cuerpo) => '<section class="tarjeta pb" data-ancla="cr-' + n + '"><h2><span class="pb-n">' + n + '</span> ' + titulo + '</h2>' + cuerpo + '</section>';
const sub = (n, titulo) => '<h3 class="cr-sub"><span>' + n + '</span> ' + titulo + '</h3>';
const punto = (titulo, texto) => '<p class="pb-punto"><b>' + titulo + '</b> ' + texto + '</p>';
const texto = (k, titulo, ayuda, filas = 3) => '<label class="campo">' + titulo +
  '<textarea rows="' + filas + '" data-cambio="cr-texto" data-k="' + k + '" placeholder="' + esc(ayuda) + '">' + esc(cr().textos[k] || '') + '</textarea></label>';

function reto(c) {
  const a = avanceReto(c), hoy = iso();
  return '<p class="pb-punto"><b>El reto:</b> durante los próximos 3 días, haz al menos <b>una actividad diferente cada día</b>. Toca una idea o escribe la tuya, y márcala cuando la hagas.</p>' +
    '<div class="cr-reto">' + c.reto.map((d, i) => '<div class="cr-dia' + (d.fecha ? ' hecho' : '') + '">' +
      '<div class="cr-dia-cab"><b>Día ' + (i + 1) + '</b>' + (d.fecha ? '<small>✓ ' + (d.fecha === hoy ? 'hoy' : fechaCorta(d.fecha)) + '</small>' : '') + '</div>' +
      '<input type="text" data-cambio="cr-reto" data-i="' + i + '" value="' + esc(d.actividad || '') + '" placeholder="¿Qué vas a hacer distinto?" autocomplete="off" aria-label="Actividad del día ' + (i + 1) + '">' +
      (d.actividad || d.fecha ? '' : '<div class="chips envolver cr-ideas">' + IDEAS_RETO.filter((x) => !c.reto.some((o) => o.actividad === x)).slice(0, 4).map((x) =>
        '<button type="button" class="chip mini" data-accion="cr-idea" data-i="' + i + '" data-v="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div>') +
      '<button type="button" class="pb-check' + (d.fecha ? ' hecho' : '') + '" data-accion="cr-hecho" data-i="' + i + '" aria-pressed="' + !!d.fecha + '"><span class="pb-caja" aria-hidden="true">' + (d.fecha ? '✓' : '') + '</span><span>Lo hice</span></button></div>').join('') + '</div>' +
    '<p class="nota-corta">' + a.hechos + ' de 3 días' + (a.mismoDia ? ' · ⚠️ dos quedaron el mismo día: la idea es uno distinto cada día' : '') + '</p>' +
    (a.completo ? '' : '<details class="nota"><summary>💡 Más ideas</summary><p class="nota-corta">' + IDEAS_RETO.map(esc).join(' · ') + '</p></details>') +
    texto('reto', '✍️ Al final de los 3 días: ¿cómo afectaron estas pequeñas acciones tu forma de pensar o de ver el mundo?', 'Un párrafo: qué notaste, qué te sorprendió, qué te costó…', 4);
}

export function vistaCreativo() {
  const c = cr(), av = avanceCreativo(c), sol = c.soluciones;
  return '<section class="tarjeta pb-resumen"><h2>💡 Módulo 3: Despertar creativo</h2>' +
    '<p class="nota-corta">Rompe la rutina, juega como un niño, cuestiona lo de siempre y simplifica. Cada punto se abre y cierra tocando su título.</p>' +
    '<div class="datos-peso"><div><small>Puntos hechos</small><b>' + av.hechos + ' / ' + av.total + '</b></div>' +
    '<div><small>Reto de 3 días</small><b>' + avanceReto(c).hechos + ' / 3</b></div></div>' + barra(av.hechos / av.total) +
    '<ul class="cr-pasos">' + av.pasos.map(([t, ok]) => '<li class="' + (ok ? 'ok' : '') + '">' + (ok ? '✓' : '○') + ' ' + esc(t) + '</li>').join('') + '</ul></section>' +
    // 1. Reflexiona sobre tu rutina
    tarjeta(1, 'Reflexiona sobre tu rutina',
      '<p class="pb-punto">Tu vida está llena de <b>hábitos</b> y <b>patrones</b> que has construido con el tiempo. Las rutinas te dan estabilidad y comodidad, pero también pueden volverse límites invisibles que reducen tu experiencia.</p>' +
      '<p class="pb-punto"><b>Pregúntate:</b></p>' + PREGUNTAS_RUTINA.map(([k, p]) => texto(k, p, 'Tu respuesta', 1)).join('') + reto(c)) +
    // 2. Potencia tu creatividad
    tarjeta(2, 'Potencia tu creatividad',
      sub('2.1', 'Ejercicio de imaginación infantil') +
      punto('Reflexiona', 'sobre las herramientas que los niños usan naturalmente:') +
      '<p class="pr-chips cr-chips">' + HERRAMIENTAS_NINO.map((x) => '<span>' + x + '</span>').join('') + '</p>' +
      punto('Cierra los ojos', 'e imagina que eres un niño de 5 años. Piensa en algo que te parezca mágico o increíble (pilotear una nave espacial, montar un unicornio, alimentar un dinosaurio).') +
      texto('magico', '🦄 Lo que imaginé', 'Ej.: alimentar un dinosaurio en el patio de mi casa', 1) +
      punto('Dibuja', 'esa idea en una hoja de papel en 7 segundos. No te preocupes por hacerlo perfecto: el objetivo es expresarte sin restricciones.') +
      '<button type="button" class="boton primario cr-siete" data-accion="cr-siete">⏱️ Empezar los 7 segundos</button>' +
      texto('sentir', '✍️ ¿Qué sentiste? ¿Te resultó fácil o difícil? ¿Qué aprendiste sobre tu creatividad?', 'Escribe brevemente', 3) +
      sub('2.2', 'Aceptación de la diversidad de pensamiento') +
      '<p class="pb-punto">Cuestionar el <i>statu quo</i> abre nuevas posibilidades. Piensa (solo o en grupo) en una <b>idea innovadora que desafíe una norma común</b>. Por ejemplo:</p>' +
      '<ul class="puntos-libro">' + NORMAS_EJEMPLO.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>' +
      texto('norma', '💭 Mi idea que desafía una norma', 'Ej.: ¿cómo sería un banco donde los intereses los pusiera el cliente?', 3) +
      '<p class="nota-corta">Si la discutes con otros, acepta sus opiniones sin juzgarlas. Recuerda: «Si no tienes nada bueno que decir de una idea, es mejor que no digas nada».</p>' +
      texto('perspectiva', '✍️ ¿Cómo te ayudó esta actividad a ver las cosas desde otra perspectiva? ¿Qué aprendiste de las ideas de los demás?', 'Un párrafo', 3) +
      sub('2.3', 'Simplificación creativa') +
      '<p class="pb-punto">Muchas soluciones creativas vienen de <b>simplificar problemas complejos</b> (una caja para organizar cables en vez de organizadores costosos, un horario semanal para no olvidar tareas).</p>' +
      '<label class="campo">🧩 Un problema cotidiano que enfrentas<input type="text" data-cambio="cr-texto" data-k="problema" value="' + esc(c.textos.problema || '') + '" placeholder="Ej.: se me va el tiempo en tareas de la casa" autocomplete="off"></label>' +
      '<p class="pb-punto">Propón al menos <b>3 soluciones simples</b> y elige una con la ⭐:</p>' +
      '<div class="cr-soluciones">' + sol.map((s, i) => '<div class="cr-sol' + (c.elegida === i ? ' elegida' : '') + '"><span class="cr-num">' + (i + 1) + '</span>' +
        '<input type="text" data-cambio="cr-sol" data-i="' + i + '" value="' + esc(s || '') + '" placeholder="Solución ' + (i + 1) + '" autocomplete="off" aria-label="Solución ' + (i + 1) + '">' +
        '<button type="button" class="icono cr-estrella" data-accion="cr-elegir" data-i="' + i + '" aria-pressed="' + (c.elegida === i) + '" aria-label="Elegir la solución ' + (i + 1) + '">' + (c.elegida === i ? '⭐' : '☆') + '</button></div>').join('') + '</div>' +
      '<button type="button" class="enlace" data-accion="cr-sol-mas">＋ Otra solución</button>' +
      texto('porque', '✅ ¿Por qué crees que la elegida es efectiva?', 'Explica en pocas líneas', 2) +
      texto('ayudo', '✍️ ¿Cómo te ayudó el proceso de simplificar a ser más creativo?', 'Un párrafo', 2)) +
    // 3. Conclusiones (en la guía es el 4)
    tarjeta(3, 'Conclusiones',
      '<p class="pb-punto">Responde en un párrafo:</p>' + CONCLUSIONES.map(([k, p]) => texto(k, p, 'Tu respuesta', 3)).join('') +
      '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="cr-enviar">📤 Compartir</button><button type="button" class="boton secundario" data-accion="cr-copiar">📋 Copiar texto</button></div>');
}

let reloj = null;
registrar({
  'cr-texto'({ k }, el) { cr().textos[k] = el.value.trim(); guardar(); },
  'cr-reto'({ i }, el) { const d = cr().reto[Number(i)]; if (d) { d.actividad = el.value.trim(); guardar(); } },
  'cr-idea'({ i, v }) { const d = cr().reto[Number(i)]; if (d) { d.actividad = v; guardar(); } },
  'cr-hecho'({ i }) {
    const c = cr(), d = c.reto[Number(i)];
    if (!d) return;
    if (d.fecha) { d.fecha = ''; guardar(); return; }
    if (!d.actividad) { toast('Escribe primero qué hiciste distinto'); return; }
    d.fecha = iso(); guardar();
    const a = avanceReto(c);
    toast(a.completo ? '🎉 ¡Reto de 3 días cumplido! Escribe el párrafo de abajo' : '✓ Día ' + (Number(i) + 1) + ' hecho' + (a.mismoDia ? ': el siguiente, otro día' : ''));
  },
  'cr-sol'({ i }, el) { cr().soluciones[Number(i)] = el.value.trim(); guardar(); },
  'cr-sol-mas'() {
    const c = cr();
    if (c.soluciones.length >= 6) { toast('Con 6 basta: elige una'); return; }
    c.soluciones.push(''); guardar();
    setTimeout(() => { const t = document.querySelectorAll('[data-cambio=cr-sol]'); if (t.length) t[t.length - 1].focus(); }, 60);
  },
  'cr-elegir'({ i }) { const c = cr(), n = Number(i); c.elegida = c.elegida === n ? null : n; guardar(); },
  // 7 segundos para dibujar: cuenta en el mismo botón, sin repintar
  'cr-siete'(ds, el) {
    if (reloj) return;
    const boton = el && el.closest ? el.closest('button') : document.querySelector('.cr-siete');
    let n = 7;
    const pintar = () => { const b = document.querySelector('.cr-siete') || boton; if (b) { b.textContent = n > 0 ? '✏️ ¡Dibuja! ' + n : '✓ ¡Tiempo!'; b.classList.toggle('corriendo', n > 0); } };
    pintar();
    reloj = setInterval(() => {
      n--; pintar();
      if (n <= 0) {
        clearInterval(reloj); reloj = null;
        if (navigator.vibrate) try { navigator.vibrate(200); } catch (err) {}
        toast('⏱️ ¡Tiempo! Ahora escribe qué sentiste');
        setTimeout(() => { const b = document.querySelector('.cr-siete'); if (b && !reloj) { b.textContent = '⏱️ Otra vez los 7 segundos'; b.classList.remove('corriendo'); } }, 2500);
      }
    }, 1000);
  },
  'cr-copiar'() { copiarTexto(textoCreativo(cr()), '📋 Copiado'); },
  async 'cr-enviar'() {
    const t = textoCreativo(cr());
    if (navigator.share) { try { await navigator.share({ title: 'Despertar creativo', text: t }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(t, '📋 Copiado: compártelo con quien quieras');
  },
});
