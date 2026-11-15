// Finanzas → 🛟 Plan B → Módulo 3: Despertar creativo. La pantalla está en src/react/pantallas/FinanzasCreativo.tsx
// (con el cronómetro de 7 segundos); aquí quedan sus acciones: responder, el reto de 3 días, las soluciones y compartir.
import { e, guardar } from '../estado.js';
import { iso } from '../fechas.js';
import { registrar, toast, copiarTexto } from '../ui.js';
import { planDe } from '../desempleo.js';
import { creativoDe, avanceReto, textoCreativo } from '../creativo.js';

const cr = () => creativoDe(planDe(e().finanzas));

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
  'cr-copiar'() { copiarTexto(textoCreativo(cr()), '📋 Copiado'); },
  async 'cr-enviar'() {
    const t = textoCreativo(cr());
    if (navigator.share) { try { await navigator.share({ title: 'Despertar creativo', text: t }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(t, '📋 Copiado: compártelo con quien quieras');
  },
});
