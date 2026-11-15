// Finanzas → 🛟 Plan B → Módulo 5: Pitch. La pantalla está en src/react/pantallas/FinanzasPitch.tsx; aquí quedan sus
// acciones: escribir los bloques y las respuestas, usar una sugerencia del módulo 4, el cronómetro del ensayo y compartir.
import { e, guardar } from '../estado.js';
import { iso } from '../fechas.js';
import { registrar, toast, copiarTexto } from '../ui.js';
import { planDe } from '../desempleo.js';
import { innovacionDe } from '../innovacion.js';
import { pitchDe, sugerencias, textoCompartirPitch, SEGUNDOS_PITCH } from '../pitch.js';

const pi = () => pitchDe(planDe(e().finanzas));

let reloj = null, inicio = 0;
// Cuándo empezó el ensayo que está corriendo (0 si no hay): con esto la pantalla pinta lo que queda
export const ensayoPitch = () => (reloj ? inicio : 0);
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
    const quedan = () => SEGUNDOS_PITCH - Math.round((Date.now() - inicio) / 1000);
    reloj = setInterval(() => { if (quedan() <= 0) fin(true); }, 1000);
  },
  'pi-copiar'() { copiarTexto(textoCompartirPitch(pi()), '📋 Copiado'); },
  async 'pi-enviar'() {
    const t = textoCompartirPitch(pi());
    if (navigator.share) { try { await navigator.share({ title: 'Mi pitch', text: t }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(t, '📋 Copiado: compártelo con quien quieras');
  },
});
