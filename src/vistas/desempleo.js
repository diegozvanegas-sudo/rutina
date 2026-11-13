// Finanzas → 🛟 Plan B: los 7 puntos de la guía de Comfama para afrontar el desempleo, cada uno en una tarjeta
// que se abre y cierra, con lo que se puede hacer ahí mismo (anotar, contar, marcar) y conectado con tus datos.
import { e, guardar, repintar, semanaActual } from '../estado.js';
import { iso, sumarDias, fechaCorta } from '../fechas.js';
import { pesos, leerMonto } from '../finanzas.js';
import { resumenSemana } from '../gym.js';
import { horasSueno } from '../registro.js';
import { esc, registrar, toast, miles, barra } from '../ui.js';
import { planDe, diaPlan, colchon, avanceBusqueda, diarioEmociones, RECURSOS, INGRESOS_ALT, EMOCIONES, BLOQUES, RED,
  CARACTERISTICAS, PLAZOS, liderDe, analisisLider, venceAccion, cambiosLider, textoLider } from '../desempleo.js';
import { copiarTexto } from '../ui.js';

const plan = () => planDe(e().finanzas);
const meses = (n) => { if (n == null) return '—'; if (n === Infinity) return 'sin límite'; const r = Math.round(n * 10) / 10; return r.toLocaleString('es-CO') + (r === 1 ? ' mes' : ' meses'); };
const tarjeta = (n, titulo, cuerpo) => '<section class="tarjeta pb" data-ancla="pb-' + n + '"><h2><span class="pb-n">' + n + '</span> ' + titulo + '</h2>' + cuerpo + '</section>';
const punto = (titulo, texto) => '<p class="pb-punto"><b>' + titulo + '</b> ' + texto + '</p>';
const texto = (k, titulo, ayuda, filas = 3) => '<label class="campo">' + titulo +
  '<textarea rows="' + filas + '" data-cambio="pb-texto" data-k="' + k + '" placeholder="' + esc(ayuda) + '">' + esc(plan().textos[k] || '') + '</textarea></label>';
const textoDia = (k, titulo, ayuda, filas = 3) => '<label class="campo">' + titulo +
  '<textarea rows="' + filas + '" data-cambio="pb-dia" data-k="' + k + '" placeholder="' + esc(ayuda) + '">' + esc(diaPlan(plan())[k] || '') + '</textarea></label>';
const monto = (grupo, k, titulo, valor) => '<label class="campo">' + titulo +
  '<input type="text" inputmode="numeric" data-pesos data-cambio="pb-monto" data-grupo="' + grupo + '" data-k="' + k + '" value="' + (valor ? miles(valor) : '') + '" placeholder="$ 0"></label>';
const check = (accion, k, titulo, hecho, extra = '') => '<button type="button" class="pb-check' + (hecho ? ' hecho' : '') + '" data-accion="' + accion + '" data-k="' + k + '"' + extra + ' aria-pressed="' + !!hecho + '">' +
  '<span class="pb-caja" aria-hidden="true">' + (hecho ? '✓' : '') + '</span><span>' + titulo + '</span></button>';
const contador = (k, valor, meta, que) => '<div class="pb-contador"><button type="button" class="boton secundario" data-accion="pb-contar" data-k="' + k + '" data-n="-1" aria-label="Quitar un' + (k === 'hojas' ? 'a hoja de vida' : ' contacto') + '"' + (valor ? '' : ' disabled') + '>−</button>' +
  '<span class="pb-cuenta"><b class="' + (valor >= meta ? 'verde' : '') + '">' + valor + ' / ' + meta + '</b><small>' + que + '</small></span>' +
  '<button type="button" class="boton primario" data-accion="pb-contar" data-k="' + k + '" data-n="1">＋ ' + (k === 'hojas' ? 'Hoja de vida' : 'Contacto') + '</button></div>';

// Arriba: lo esencial en una mirada
function resumen(c, b) {
  return '<section class="tarjeta pb-resumen"><h2>🛟 Plan B: si te quedas sin empleo</h2>' +
    '<p class="nota-corta">Siete pasos para atravesar el desempleo sin perder el rumbo: emociones, plata, rutina, red de apoyo, habilidades, autocuidado y mentalidad. Abre y cierra cada uno tocando su título.</p>' +
    '<div class="datos-peso">' +
    '<div><small>Te alcanza (todo)</small><b>' + meses(c.mesesNormal) + '</b></div>' +
    '<div><small>Solo lo esencial</small><b class="verde">' + meses(c.mesesAustero) + '</b></div>' +
    '<div><small>Hojas de vida hoy</small><b>' + b.hojasHoy + ' / ' + b.metaHojas + '</b></div>' +
    '<div><small>Contactos esta semana</small><b>' + b.contactosSemana + ' / ' + b.metaContactos + '</b></div></div>' +
    (c.disponible ? '' : '<p class="aviso">Anota en el punto 2 con qué plata cuentas (liquidación, cesantías, ahorros) para saber cuántos meses te alcanza.</p>') + '</section>';
}

// 1. Emociones
function emociones() {
  const d = diaPlan(plan()), diario = diarioEmociones(plan()).filter((x) => x.fecha !== iso());
  return tarjeta(1, 'Acepta y procesa tus emociones',
    punto('Reconoce y valida lo que sientes:', 'permítete sentir tristeza, enojo o miedo sin juzgarte, y escríbelo.') +
    '<div class="chips envolver" role="group" aria-label="Cómo te sientes hoy">' + EMOCIONES.map((x) =>
      '<button type="button" class="chip' + (d.emociones.includes(x) ? ' activo' : '') + '" data-accion="pb-emocion" data-v="' + esc(x) + '" aria-pressed="' + d.emociones.includes(x) + '">' + x + '</button>').join('') + '</div>' +
    textoDia('siento', 'Hoy siento…', 'Sin filtro: nadie más lo lee. Escribir lo que sientes le baja el volumen.') +
    (diario.length ? '<details class="nota"><summary>📓 Días anteriores (' + diario.length + ')</summary><ul class="pb-diario">' + diario.map((x) =>
      '<li><b>' + fechaCorta(x.fecha) + '</b> ' + esc(x.emociones.join(' ')) + (x.siento ? '<span>' + esc(x.siento) + '</span>' : '') + '</li>').join('') + '</ul></details>' : '') +
    punto('Regula:', 'mindfulness, meditación y escribir un diario ayudan con el miedo y la incertidumbre.') +
    '<div class="botones-rapidos"><a class="boton secundario" href="#sesiones">🧘 Sesiones guiadas</a><a class="boton secundario" href="#recordatorios">👥 Mi círculo cercano</a></div>' +
    punto('Evita el aislamiento:', 'comparte lo que sientes con familia o amigos de confianza.'));
}

// 2. Plata: la tabla de la guía, calculada con tus datos
function finanzas(c) {
  const p = plan(), fila = (t, v, clase = '') => '<tr><th scope="row">' + t + '</th><td class="' + clase + '">' + v + '</td></tr>';
  const origen = p.esenciales != null || p.noEsenciales != null ? 'los que escribiste a mano' : c.auto.desde === 'movimientos' ? 'promedio de tus últimos ' + c.auto.meses + (c.auto.meses === 1 ? ' mes' : ' meses') + ' en Finanzas'
    : c.auto.desde === 'fijos' ? 'tus pagos fijos y cuotas (aún no hay meses completos anotados)' : 'escríbelos abajo: aún no hay gastos anotados';
  return tarjeta(2, 'Evalúa tu situación financiera',
    '<table class="pb-tabla"><thead><tr><th scope="col">Categoría</th><th scope="col">Por mes</th></tr></thead><tbody>' +
    fila('Disponible (ahorros y recursos)', pesos(c.disponible)) +
    (c.ingresos ? fila('Ingresos alternativos', pesos(c.ingresos)) : '') +
    fila('Gastos esenciales', pesos(c.esenciales)) + fila('Gastos no esenciales', pesos(c.noEsenciales)) +
    fila('Diferencia después de un mes', pesos(c.diferencia), c.diferencia < 0 ? 'rojo' : 'verde') + '</tbody></table>' +
    '<p class="nota-corta">Te alcanza para <b>' + meses(c.mesesNormal) + '</b> como vives hoy, y <b>' + meses(c.mesesAustero) + '</b> si recortas a lo esencial. Gastos: ' + origen + '.</p>' +
    (c.disponible && c.esenciales ? barra(Math.min(1, (c.mesesAustero === Infinity ? 12 : c.mesesAustero) / 6)) + '<p class="nota-corta">La barra llena son 6 meses de lo esencial: lo que se recomienda tener.</p>' : '') +
    '<details class="nota"' + (c.recursos ? '' : ' open') + '><summary>💼 Con qué plata cuentas</summary>' +
    '<label class="interruptor"><input type="checkbox" data-cambio="pb-sin-app"' + (p.sinApp ? '' : ' checked') + '> Sumar lo que ya tengo en la app (ahorros y cuentas: ' + pesos(c.enApp) + ')</label>' +
    '<div class="dos">' + RECURSOS.map(([k, t]) => monto('recursos', k, t, p.recursos[k])).join('') + '</div>' +
    '<p class="nota-corta">Pregunta en tu caja de compensación por el subsidio al desempleo, y averigua qué entidades públicas y privadas dan apoyos o tienen redes de ayuda.</p></details>' +
    '<details class="nota"><summary>➕ Ingresos alternativos (por mes)</summary><div class="dos">' + INGRESOS_ALT.map(([k, t]) => monto('ingresosAlt', k, t, p.ingresosAlt[k])).join('') + '</div></details>' +
    '<details class="nota"><summary>✏️ Ajustar los gastos a mano</summary><p class="nota-corta">Déjalos vacíos para usar lo calculado (' + pesos(c.auto.esenciales) + ' y ' + pesos(c.auto.noEsenciales) + ').</p><div class="dos">' +
      '<label class="campo">Gastos esenciales<input type="text" inputmode="numeric" data-pesos data-cambio="pb-gasto" data-k="esenciales" value="' + (p.esenciales != null ? miles(p.esenciales) : '') + '" placeholder="' + miles(c.auto.esenciales) + '"></label>' +
      '<label class="campo">Gastos no esenciales<input type="text" inputmode="numeric" data-pesos data-cambio="pb-gasto" data-k="noEsenciales" value="' + (p.noEsenciales != null ? miles(p.noEsenciales) : '') + '" placeholder="' + miles(c.auto.noEsenciales) + '"></label></div></details>' +
    punto('Ajusta el presupuesto:', 'prioriza lo esencial y busca ahorro en energía, agua y combustible.') +
    '<div class="botones-rapidos"><a class="boton secundario" href="#finanzas/presupuesto">🎯 Presupuesto</a><a class="boton secundario" href="#finanzas/fijos">🔁 Pagos fijos</a></div>');
}

// 3. Rutina: metas pequeñas y el horario del día
function rutina(b) {
  const d = diaPlan(plan()), p = plan();
  return tarjeta(3, 'Establece una rutina estructurada',
    punto('Metas pequeñas y alcanzables:', 'por ejemplo, ' + p.metas.hojasDia + ' hojas de vida al día y ' + p.metas.contactosSemana + ' contactos profesionales por semana.') +
    contador('hojas', b.hojasHoy, b.metaHojas, 'hojas de vida hoy') +
    contador('contactos', (d.contactos || 0), Math.max(1, b.metaContactos - (b.contactosSemana - (d.contactos || 0))), 'contactos hoy · ' + b.contactosSemana + ' de ' + b.metaContactos + ' en la semana') +
    '<p class="nota-corta">Esta semana: ' + b.hojasSemana + ' hojas de vida · ' + b.diasConMeta + ' de ' + b.diasSemana + ' días cumpliste la meta.</p>' +
    '<h3>Tu horario de hoy</h3><div class="pb-checks">' + BLOQUES.map(([k, t]) => check('pb-bloque', k, t, d.bloques[k])).join('') + '</div>' +
    '<details class="nota"><summary>🎯 Cambiar las metas</summary><div class="dos">' +
      '<label class="campo">Hojas de vida por día<input type="number" inputmode="numeric" min="0" max="50" data-cambio="pb-meta" data-k="hojasDia" value="' + p.metas.hojasDia + '"></label>' +
      '<label class="campo">Contactos por semana<input type="number" inputmode="numeric" min="0" max="50" data-cambio="pb-meta" data-k="contactosSemana" value="' + p.metas.contactosSemana + '"></label></div></details>');
}

// 4. Red de apoyo
function red() {
  const p = plan(), hechos = RED.filter(([k]) => p.red[k]).length;
  return tarjeta(4, 'Fortalece tu red de apoyo',
    '<p class="nota-corta">' + hechos + ' de ' + RED.length + ' hechos.</p><div class="pb-checks">' + RED.map(([k, t]) => check('pb-red', k, t, p.red[k])).join('') + '</div>' +
    punto('Redes profesionales:', 'búsqueda constante en LinkedIn, asociaciones del sector y eventos de networking.') +
    punto('Apoyo emocional:', 'si la tristeza o la ansiedad duran más de dos semanas, o te cuesta dormir, comer o levantarte, busca un psicólogo (tu EPS o tu caja de compensación tienen) o un grupo de apoyo. Pedir ayuda es parte del plan, no un fracaso.'));
}

// 5. Habilidades
function habilidades() {
  return tarjeta(5, 'Reinvéntate y desarrolla habilidades',
    punto('Autoevaluación:', 'lista tus fortalezas, lo que sabes hacer que sirve en otros trabajos y lo que debes mejorar.') +
    '<div class="dos">' + texto('fortalezas', '💪 Mis fortalezas', 'Una por línea') + texto('transferibles', '🔁 Habilidades transferibles', 'Asesorías, cursos, podcast, ventas, Excel…') + '</div>' +
    texto('mejora', '📈 Áreas de mejora', '¿Qué te pide el mercado que aún no tienes?', 2) +
    punto('Autoformación continua:', 'cursos en línea (ComfamaPro, Coursera, Udemy, YouTube) y certificaciones.') +
    '<div class="botones-rapidos"><a class="boton secundario" href="#estudiar">🎓 Estudiar en la app</a></div>' +
    punto('Explora alternativas:', 'emprendimientos que has postergado, trabajar por encargo o sectores nuevos ligados a tus intereses.') +
    texto('alternativas', '🚀 Ideas que quiero explorar', 'Ej.: asesorías de…, vender…, freelance de…', 2));
}

// 6. Autocuidado: lo que la app ya sabe de ti
function autocuidado() {
  const g = resumenSemana(e().rutina, e().semanas[semanaActual()] || {});
  const hs = Array.from({ length: 7 }, (_, k) => horasSueno((e().dias[sumarDias(iso(), -k)] || {}).sueno)).filter((h) => h != null);
  const sueno = hs.length ? Math.round((hs.reduce((a, b) => a + b, 0) / hs.length) * 10) / 10 : null;
  return tarjeta(6, 'Garantiza el autocuidado integral',
    '<div class="datos-peso"><div><small>Gym esta semana</small><b>' + g.hechas + ' / ' + g.plan + '</b><small>series</small></div>' +
    '<div><small>Sueño (7 días)</small><b class="' + (sueno != null && sueno < 7 ? 'rojo' : '') + '">' + (sueno != null ? String(sueno).replace('.', ',') + ' h' : '—') + '</b><small>' + (sueno != null ? 'promedio' : 'anótalo en Hoy') + '</small></div></div>' +
    punto('Salud física:', 'ejercicio regular, comida balanceada y sueño suficiente (un podcast antes de dormir ayuda).') +
    punto('Salud mental:', 'meditación, arte, lectura o voluntariado para mantener la motivación.') +
    '<div class="botones-rapidos"><a class="boton secundario" href="#gym">🏋️ Gym</a><a class="boton secundario" href="#dieta">🥗 Dieta</a><a class="boton secundario" href="#estudiar">📚 Leer</a></div>');
}

// 7. Mentalidad
function mentalidad() {
  return tarjeta(7, 'Replantea tu mentalidad para adaptarte',
    punto('Enfócate en las oportunidades:', 'este tiempo sirve para redirigir tu carrera, estudiar y hacer lo que nunca podías por falta de tiempo.') +
    texto('oportunidades', '🌅 Lo que este momento me permite', 'Escribe todo lo que pienses o identifiques', 2) +
    punto('Practica la gratitud:', 'valora lo que tienes, a nivel material y espiritual.') +
    textoDia('gratitud', '🙏 Hoy agradezco', '1 a 3 cosas', 2) + texto('tengo', '🎒 Lo que tengo (material y espiritual)', 'Salud, familia, una moto, lo que sabes hacer…', 3) +
    punto('Flexibilidad:', 'el camino cambió y seguirá cambiando; adaptarte a las opciones nuevas es el camino. Confía en lo que creas y escribe lo que quieres que pase.'));
}

// ---------- Módulo 2: Liderazgo emergente ----------
const lider = () => liderDe(plan());
const textoL = (k, titulo, ayuda, filas = 3) => '<label class="campo">' + titulo +
  '<textarea rows="' + filas + '" data-cambio="pb-lider-texto" data-k="' + k + '" placeholder="' + esc(ayuda) + '">' + esc(lider().textos[k] || '') + '</textarea></label>';
const listaCar = (xs) => xs.map((x) => '<b>' + esc(x.nombre) + '</b> (' + x.n + ')').join(', ');

function liderazgo() {
  const l = lider(), a = analisisLider(l.notas), cambios = cambiosLider(l);
  const opcionesArea = (sel) => CARACTERISTICAS.map(([k, n]) => '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + esc(n) + '</option>').join('');
  return '<section class="tarjeta pb-resumen"><h2>🧭 Módulo 2: Liderazgo emergente</h2>' +
    '<p class="nota-corta">Califícate, mira tus fortalezas y lo que te falta, arma un plan con plazos y cierra con un compromiso.</p>' +
    '<div class="datos-peso"><div><small>Calificadas</small><b>' + a.respondidas + ' / ' + a.total + '</b></div>' +
    '<div><small>Promedio</small><b>' + (a.promedio != null ? String(a.promedio).replace('.', ',') + ' / 5' : '—') + '</b></div>' +
    '<div><small>Acciones</small><b>' + l.acciones.filter((x) => x.hecho).length + ' / ' + l.acciones.length + '</b><small>hechas</small></div></div>' +
    barra(a.respondidas / a.total) + '</section>' +
    // 1. Autoevaluación
    tarjeta(1, 'Autoevaluación: fortalezas y áreas de mejora',
      '<p class="pb-punto">Califícate del <b>1</b> (nada desarrollado) al <b>5</b> (altamente desarrollado). Si la pregunta no tiene nada que ver contigo, pon 1; si tiene mucho que ver, pon 5.</p>' +
      '<div class="lid-lista">' + CARACTERISTICAS.map(([k, nombre, pregunta]) => '<div class="lid-fila"><div class="lid-txt"><b>' + esc(nombre) + '</b><small>' + esc(pregunta) + '</small></div>' +
        '<div class="lid-notas" role="group" aria-label="' + esc(nombre) + ': calificación del 1 al 5">' + [1, 2, 3, 4, 5].map((n) =>
          '<button type="button" class="chip' + (l.notas[k] === n ? ' activo' : '') + '" data-accion="pb-lider-nota" data-k="' + k + '" data-n="' + n + '" aria-pressed="' + (l.notas[k] === n) + '">' + n + '</button>').join('') + '</div></div>').join('') + '</div>' +
      (cambios.length ? '<p class="nota-corta">Frente a tu evaluación del ' + fechaCorta(l.anterior.fecha) + ': ' + cambios.map((x) => esc(x.nombre) + ' ' + x.antes + ' → <b class="' + (x.ahora > x.antes ? 'verde' : 'rojo') + '">' + x.ahora + '</b>').join(' · ') + '</p>' : '') +
      (a.completo ? '<button type="button" class="enlace" data-accion="pb-lider-repetir">↻ Repetir la autoevaluación más adelante (guarda esta para comparar)</button>' : '')) +
    // 2. Análisis
    tarjeta(2, 'Análisis de resultados: reconoce patrones',
      (a.completo ? '<div class="lid-patrones"><p>💪 <b>Tus 3 mayores fortalezas:</b> ' + listaCar(a.fuertes) + '</p><p>📈 <b>Tus 3 áreas de mejora:</b> ' + listaCar(a.mejora) + '</p></div>'
        : '<p class="aviso">Califica las ' + a.total + ' características del punto 1 y aquí salen tus fortalezas y tus áreas de mejora (' + a.respondidas + ' de ' + a.total + ').</p>') +
      textoL('fortalezas', '¿Cómo puedo aprovechar mejor mis fortalezas?', 'Ej.: "Mi empatía me ayuda a conectar con los demás. Puedo usarla para motivar a mi equipo en momentos difíciles".') +
      textoL('mejora', '¿Por qué son importantes mis áreas de mejora para liderar?', 'Ej.: "Mi tolerancia a la frustración es baja, lo que puede afectar mi capacidad para liderar en situaciones de alta presión".') +
      textoL('relacion', '¿Cómo se relacionan? ¿Cómo uso mis fortalezas para compensar mis debilidades?', 'Escribe cómo una fortaleza te ayuda con un área de mejora.', 2)) +
    // 3. Plan de acción
    tarjeta(3, 'Diseño de un plan de acción',
      '<p class="pb-punto">Por cada área de mejora: una acción concreta, un plazo y los recursos que necesitas.</p>' +
      (l.acciones.length ? '<div class="lid-acciones">' + l.acciones.map((x, i) => '<div class="lid-accion' + (x.hecho ? ' hecha' : '') + '" data-orden-i="' + i + '">' +
        '<div class="lid-accion-cab"><label class="campo">Área de mejora<select data-cambio="pb-accion" data-i="' + i + '" data-k="area">' + opcionesArea(x.area) + '</select></label>' +
        '<button type="button" class="pb-check' + (x.hecho ? ' hecho' : '') + ' lid-hecho" data-accion="pb-accion-hecha" data-i="' + i + '" aria-pressed="' + !!x.hecho + '"><span class="pb-caja" aria-hidden="true">' + (x.hecho ? '✓' : '') + '</span><span>Hecha</span></button>' +
        '<button type="button" class="icono borrar" data-accion="pb-accion-borrar" data-i="' + i + '" aria-label="Borrar esta acción">🗑</button></div>' +
        '<label class="campo">Acción concreta<textarea rows="2" data-cambio="pb-accion" data-i="' + i + '" data-k="accion" placeholder="Ej.: practicar respiración profunda y meditación en situaciones difíciles">' + esc(x.accion || '') + '</textarea></label>' +
        '<div class="lid-plazo"><span>Plazo:</span>' + PLAZOS.map(([n, t]) => '<button type="button" class="chip mini' + ((x.plazo || 1) === n ? ' activo' : '') + '" data-accion="pb-accion-plazo" data-i="' + i + '" data-n="' + n + '" aria-pressed="' + ((x.plazo || 1) === n) + '">' + t + '</button>').join('') +
        '<small>vence ' + fechaCorta(venceAccion(x)) + '</small></div>' +
        '<label class="campo">Recursos necesarios<input type="text" data-cambio="pb-accion" data-i="' + i + '" data-k="recursos" value="' + esc(x.recursos || '') + '" placeholder="Ej.: app de mindfulness, un libro, un mentor" autocomplete="off"></label></div>').join('') + '</div>'
        : '<p class="nota-corta">Aún no tienes acciones.' + (a.completo ? ' Empieza con tus 3 áreas de mejora:' : '') + '</p>') +
      '<div class="botones-rapidos">' + (a.completo && !l.acciones.length ? '<button type="button" class="boton primario" data-accion="pb-accion-mejora">＋ Una acción por cada área de mejora</button>' : '') +
        '<button type="button" class="boton ' + (a.completo && !l.acciones.length ? 'secundario' : 'primario') + '" data-accion="pb-accion-nueva">＋ Acción</button></div>' +
      '<details class="nota"><summary>💡 Consejos y ejemplo</summary><ul class="puntos-libro"><li>Sé realista con los plazos y que las acciones sean específicas y medibles.</li>' +
        '<li>Busca recursos disponibles: libros, cursos, mentores (en 🎓 Estudiar tienes cursos sin internet).</li><li>Comparte tu plan con alguien de confianza para recibir retroalimentación (botón de abajo).</li></ul>' +
        '<p class="nota-corta"><b>Ejemplo:</b> Tolerancia a la frustración → respiración y meditación en situaciones difíciles · 1 mes · apps de mindfulness. Pensamiento holístico → leer sobre sistemas complejos y analizar problemas desde varias perspectivas · 3 meses · libros, cursos, mentorías.</p></details>') +
    // 4. Reflexión
    tarjeta(4, 'Reflexión final: compromiso personal',
      textoL('aprendido', '¿Qué aprendí sobre mí con esta autoevaluación?', 'Ej.: "Identifiqué que soy empático, pero necesito trabajar mi mentalidad ágil".', 2) +
      textoL('aplicar', '¿Cómo me imagino aplicando estas habilidades en mi vida personal, profesional o comunitaria?', 'Ej.: "En mi trabajo diario, respondiendo distinto al cambio".', 2) +
      textoL('compromisos', '¿Qué compromisos específicos asumo para desarrollarme como líder?', 'Ej.: "Me comprometo a leer un libro sobre adaptabilidad y quiero ser un líder que inspire confianza".', 2) +
      '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="pb-lider-enviar">📤 Compartir con alguien de confianza</button><button type="button" class="boton secundario" data-accion="pb-lider-copiar">📋 Copiar texto</button></div>');
}

// Plan B tiene dos módulos de la guía de Comfama; arriba se elige cuál ver
let modulo = 'desempleo';
export function vistaDesempleo() {
  const chips = '<nav class="chips" aria-label="Módulo">' + [['desempleo', '🛟 Módulo 1 · Afrontar el desempleo'], ['lider', '🧭 Módulo 2 · Liderazgo emergente']].map(([k, t]) =>
    '<button type="button" class="chip' + (k === modulo ? ' activo' : '') + '" data-accion="pb-modulo" data-v="' + k + '" aria-pressed="' + (k === modulo) + '">' + t + '</button>').join('') + '</nav>';
  if (modulo === 'lider') return chips + liderazgo() + '<p class="nota-corta centro">Basado en la guía de Comfama: Trabajo autónomo, módulo 2.</p>';
  const c = colchon(e().finanzas), b = avanceBusqueda(plan());
  return chips + resumen(c, b) + emociones() + finanzas(c) + rutina(b) + red() + habilidades() + autocuidado() + mentalidad() +
    '<p class="nota-corta centro">Basado en la guía de Comfama para afrontar el desempleo.</p>';
}

registrar({
  'pb-modulo'({ v }) { modulo = v; repintar(); window.scrollTo(0, 0); },
  // Tocar la misma nota la quita
  'pb-lider-nota'({ k, n }) {
    const l = lider(), v = Number(n), antes = analisisLider(l.notas).completo;
    if (l.notas[k] === v) delete l.notas[k]; else l.notas[k] = v;
    if (!l.fecha) l.fecha = iso();
    guardar();
    // Solo al completar la última
    if (!antes && analisisLider(l.notas).completo) toast('✓ Autoevaluación completa: mira tus fortalezas en el punto 2');
  },
  'pb-lider-repetir'() {
    const l = lider();
    if (!confirm('¿Empezar una autoevaluación nueva? La de hoy queda guardada para comparar.')) return;
    l.anterior = { notas: { ...l.notas }, fecha: l.fecha || iso() };
    l.notas = {}; l.fecha = iso();
    guardar();
  },
  'pb-lider-texto'({ k }, el) { lider().textos[k] = el.value.trim(); guardar(); },
  'pb-accion-nueva'() {
    const l = lider(), a = analisisLider(l.notas), usadas = new Set(l.acciones.map((x) => x.area));
    const area = (a.mejora.find((x) => !usadas.has(x.k)) || a.mejora[0] || { k: CARACTERISTICAS[0][0] }).k;
    l.acciones.push({ id: 'ac' + Date.now().toString(36), area, accion: '', plazo: 1, recursos: '', creado: Date.now() });
    guardar();
    setTimeout(() => { const t = document.querySelectorAll('.lid-accion textarea'); if (t.length) { t[t.length - 1].focus({ preventScroll: true }); t[t.length - 1].scrollIntoView({ block: 'center' }); } }, 60);
  },
  'pb-accion-mejora'() {
    const l = lider(), a = analisisLider(l.notas);
    a.mejora.forEach((x, k) => l.acciones.push({ id: 'ac' + Date.now().toString(36) + k, area: x.k, accion: '', plazo: [1, 3, 6][k] || 1, recursos: '', creado: Date.now() }));
    guardar();
    toast('＋ 3 acciones: escribe qué vas a hacer en cada una');
  },
  'pb-accion'({ i, k }, el) { const x = lider().acciones[Number(i)]; if (!x) return; x[k] = el.value.trim(); guardar(); },
  'pb-accion-plazo'({ i, n }) { const x = lider().acciones[Number(i)]; if (x) { x.plazo = Number(n); guardar(); } },
  'pb-accion-hecha'({ i }) { const x = lider().acciones[Number(i)]; if (!x) return; x.hecho = !x.hecho; guardar(); if (x.hecho) toast('✅ Acción cumplida'); },
  'pb-accion-borrar'({ i }) {
    const l = lider(), k = Number(i), x = l.acciones[k];
    if (!x) return;
    l.acciones.splice(k, 1);
    guardar();
    toast('Acción borrada', () => { l.acciones.splice(k, 0, x); guardar(); });
  },
  'pb-lider-copiar'() { copiarTexto(textoLider(lider()), '📋 Copiado: compártelo con alguien de confianza'); },
  async 'pb-lider-enviar'() {
    const t = textoLider(lider());
    if (navigator.share) { try { await navigator.share({ title: 'Mi plan de liderazgo', text: t }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(t, '📋 Copiado: compártelo con alguien de confianza');
  },
  'pb-emocion'({ v }) {
    const d = diaPlan(plan()), i = d.emociones.indexOf(v);
    if (i < 0) d.emociones.push(v); else d.emociones.splice(i, 1);
    guardar();
  },
  'pb-dia'({ k }, el) { diaPlan(plan())[k] = el.value.trim(); guardar(); },
  'pb-texto'({ k }, el) { plan().textos[k] = el.value.trim(); guardar(); },
  'pb-monto'({ grupo, k }, el) {
    const n = leerMonto(el.value), g = plan()[grupo];
    if (n > 0) g[k] = n; else delete g[k];
    guardar();
  },
  // Vacío = vuelve a lo calculado
  'pb-gasto'({ k }, el) {
    const n = leerMonto(el.value);
    if (el.value.trim() === '' || !(n >= 0)) delete plan()[k]; else plan()[k] = n;
    guardar();
  },
  'pb-sin-app'(ds, el) { if (el.checked) delete plan().sinApp; else plan().sinApp = true; guardar(); },
  'pb-meta'({ k }, el) { plan().metas[k] = Math.min(50, Math.max(0, Math.round(Number(el.value) || 0))); guardar(); },
  'pb-contar'({ k, n }) {
    const d = diaPlan(plan()), antes = d[k] || 0, ahora = Math.max(0, antes + Number(n));
    d[k] = ahora;
    guardar();
    const meta = k === 'hojas' ? plan().metas.hojasDia : plan().metas.contactosSemana, b = avanceBusqueda(plan());
    if (ahora > antes && (k === 'hojas' ? ahora === meta : b.contactosSemana === meta)) toast(k === 'hojas' ? '✓ Meta de hoy: ' + meta + ' hojas de vida' : '✓ Meta de la semana: ' + meta + ' contactos');
  },
  'pb-bloque'({ k }) { const b = diaPlan(plan()).bloques; if (b[k]) delete b[k]; else b[k] = true; guardar(); },
  'pb-red'({ k }) { const r = plan().red; if (r[k]) delete r[k]; else r[k] = true; guardar(); },
});
