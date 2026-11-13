// Finanzas → 🛟 Plan B → Módulo 5: Pitch. Armar el pitch de 1 minuto por bloques (con sugerencias del módulo 4), ver cuánto
// dura, ensayarlo con un cronómetro de 60 s y preparar las preguntas difíciles.
import { e, guardar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { esc, registrar, toast, barra, copiarTexto } from '../ui.js';
import { planDe } from '../desempleo.js';
import { innovacionDe } from '../innovacion.js';
import { pitchDe, sugerencias, avancePitch, textoPitch, segundosDe, textoCompartirPitch, BLOQUES_PITCH, PREGUNTAS_DIFICILES, CONSEJOS, SEGUNDOS_PITCH } from '../pitch.js';

const pi = () => pitchDe(planDe(e().finanzas));
const tarjeta = (n, titulo, cuerpo) => '<section class="tarjeta pb" data-ancla="pi-' + n + '"><h2><span class="pb-n">' + n + '</span> ' + titulo + '</h2>' + cuerpo + '</section>';

export function vistaPitch() {
  const x = pi(), av = avancePitch(x), sug = sugerencias(innovacionDe(planDe(e().finanzas))), seg = av.segundos;
  return '<section class="tarjeta pb-resumen"><h2>🎤 Módulo 5: Pitch</h2>' +
    '<p class="nota-corta">Cuenta tu idea en 1 minuto para que alguien diga «sí»: un cliente, un aliado o quien te pueda financiar. Usa lo que trabajaste en el módulo 4.</p>' +
    '<div class="datos-peso"><div><small>Bloques</small><b>' + av.llenos + ' / ' + BLOQUES_PITCH.length + '</b></div><div><small>Dura</small><b class="' + (seg > SEGUNDOS_PITCH + 5 ? 'rojo' : seg ? 'verde' : '') + '">' + (seg ? '≈ ' + seg + ' s' : '—') + '</b></div>' +
    '<div><small>Ensayos</small><b>' + x.ensayos.length + ' / 3</b></div></div>' + barra(av.hechos / av.total) +
    '<ul class="cr-pasos">' + av.pasos.map(([t, ok]) => '<li class="' + (ok ? 'ok' : '') + '">' + (ok ? '✓' : '○') + ' ' + esc(t) + '</li>').join('') + '</ul></section>' +
    tarjeta(1, 'Arma tu pitch de 1 minuto',
      '<p class="pb-punto">Seis bloques cortos, en este orden. ' + (Object.keys(sug).length ? 'Donde veas <b>✨ Usar del módulo 4</b>, toca para empezar con lo que ya escribiste.' : 'Si haces primero el módulo 4, aquí te salen sugerencias.') + '</p>' +
      BLOQUES_PITCH.map(([k, t, ayuda]) => {
        const v = x.bloques[k] || '';
        return '<div class="pi-bloque"><div class="pi-cab"><b>' + t + '</b><small>' + (v ? '≈ ' + segundosDe(v) + ' s' : '') + '</small></div>' +
          '<textarea rows="2" data-cambio="pi-bloque" data-k="' + k + '" placeholder="' + esc(ayuda) + '" aria-label="' + esc(t) + '">' + esc(v) + '</textarea>' +
          (sug[k] && !v.trim() ? '<button type="button" class="enlace" data-accion="pi-sugerencia" data-k="' + k + '">✨ Usar del módulo 4: «' + esc(sug[k].length > 70 ? sug[k].slice(0, 70) + '…' : sug[k]) + '»</button>' : '') + '</div>';
      }).join('') +
      '<div class="pi-medidor"><div class="pi-pista"><span class="' + (seg > SEGUNDOS_PITCH + 5 ? 'largo' : '') + '" style="width:' + Math.min(100, Math.round(seg / SEGUNDOS_PITCH * 100)) + '%"></span></div>' +
      '<p class="nota-corta">' + (seg ? '≈ <b>' + seg + ' s</b> de ' + SEGUNDOS_PITCH + ' s' + (seg > SEGUNDOS_PITCH + 5 ? ': recorta. Quita adjetivos y deja un solo dato por bloque.' : ' ✓') : 'Escribe los bloques para ver cuánto dura') + ' (hablando tranquilo, ≈ 150 palabras por minuto).</p></div>' +
      (textoPitch(x) ? '<details class="nota"><summary>📄 Ver el pitch completo</summary><p class="pi-completo">' + esc(textoPitch(x)) + '</p></details>' : '')) +
    tarjeta(2, 'Ensaya en voz alta',
      '<p class="pb-punto">Lee tu pitch en voz alta con el cronómetro. Ensáyalo <b>al menos 3 veces</b>, hasta decirlo sin leer.</p>' +
      '<button type="button" class="boton primario pi-reloj" data-accion="pi-ensayar">▶ Ensayar (60 s)</button>' +
      (x.ensayos.length ? '<p class="nota-corta">Ensayos: ' + x.ensayos.slice(-5).map((en) => fechaCorta(en.fecha) + (en.segundos ? ' (' + en.segundos + ' s)' : '')).join(' · ') + '</p>' : '') +
      '<ul class="puntos-libro">' + CONSEJOS.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul>') +
    tarjeta(3, 'Prepara las preguntas difíciles',
      '<p class="pb-punto">Después del pitch casi siempre preguntan esto. Tener la respuesta lista da confianza.</p>' +
      PREGUNTAS_DIFICILES.map(([k, p]) => '<label class="campo">' + p + '<textarea rows="2" data-cambio="pi-respuesta" data-k="' + k + '">' + esc(x.respuestas[k] || '') + '</textarea></label>').join('') +
      '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="pi-enviar">📤 Compartir mi pitch</button><button type="button" class="boton secundario" data-accion="pi-copiar">📋 Copiar texto</button></div>');
}

let reloj = null, inicio = 0;
const boton = () => document.querySelector('.pi-reloj');
registrar({
  'pi-bloque'({ k }, el) { pi().bloques[k] = el.value.trim(); guardar(); },
  'pi-respuesta'({ k }, el) { pi().respuestas[k] = el.value.trim(); guardar(); },
  'pi-sugerencia'({ k }) { const s = sugerencias(innovacionDe(planDe(e().finanzas)))[k]; if (s) { pi().bloques[k] = s; guardar(); } },
  // Primer toque: arranca 60 s. Segundo toque: para y guarda el ensayo con lo que duró
  'pi-ensayar'() {
    const fin = (completo) => {
      clearInterval(reloj); reloj = null;
      const s = Math.min(SEGUNDOS_PITCH, Math.round((Date.now() - inicio) / 1000));
      pi().ensayos.push({ fecha: iso(), segundos: s }); guardar();
      if (navigator.vibrate) try { navigator.vibrate(200); } catch (err) {}
      toast(completo ? '⏱️ ¡Se acabó el minuto! Si no terminaste, recorta' : '✓ Ensayo de ' + s + ' s guardado');
    };
    if (reloj) { fin(false); return; }
    inicio = Date.now();
    const pintar = () => { const b = boton(), q = SEGUNDOS_PITCH - Math.round((Date.now() - inicio) / 1000); if (b) { b.textContent = '⏹ Terminé · quedan ' + Math.max(0, q) + ' s'; b.classList.add('corriendo'); } return q; };
    pintar();
    reloj = setInterval(() => { if (pintar() <= 0) fin(true); }, 1000);
  },
  'pi-copiar'() { copiarTexto(textoCompartirPitch(pi()), '📋 Copiado'); },
  async 'pi-enviar'() {
    const t = textoCompartirPitch(pi());
    if (navigator.share) { try { await navigator.share({ title: 'Mi pitch', text: t }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(t, '📋 Copiado: compártelo con quien quieras');
  },
});
