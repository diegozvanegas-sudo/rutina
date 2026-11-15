// Finanzas → 🛟 Plan B → Módulo 4: Innovación. La pantalla está en src/react/pantallas/FinanzasInnovacion.tsx; aquí quedan
// sus acciones: problemas y su puntaje, conversaciones, SCAMPER, ideas y su cuadro, propuesta de valor, experimento y compartir.
import { e, guardar } from '../estado.js';
import { iso } from '../fechas.js';
import { registrar, toast, copiarTexto } from '../ui.js';
import { planDe } from '../desempleo.js';
import { innovacionDe, nuevoProblema, nuevaEntrevista, nuevaIdea, textoInnovacion } from '../innovacion.js';

const inn = () => innovacionDe(planDe(e().finanzas));
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
