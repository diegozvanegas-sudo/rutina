// Finanzas → 🛟 Plan B (la ruta de Comfama). Las pantallas de los cinco módulos están en src/react/pantallas (FinanzasPlanB.tsx
// y los que importa); aquí quedan las acciones de los módulos 1 y 2 (anotar, contar, marcar) y el módulo que se ve. Las acciones
// de los módulos 3, 4 y 5 están en creativo.js, innovacion.js y pitch.js, que se cargan desde aquí.
import { e, guardar, repintar } from '../estado.js';
import { iso } from '../fechas.js';
import { leerMonto } from '../finanzas.js';
import { registrar, toast } from '../ui.js';
import { planDe, diaPlan, avanceBusqueda, CARACTERISTICAS, liderDe, analisisLider, textoLider } from '../desempleo.js';
import { copiarTexto } from '../ui.js';
import './creativo.js';
import './innovacion.js';
import './pitch.js';

const plan = () => planDe(e().finanzas);

// ---------- Módulo 2: Liderazgo emergente ----------
const lider = () => liderDe(plan());

// Plan B tiene cinco módulos de la ruta de Comfama; arriba se elige cuál ver
let modulo = 'desempleo';
// La pantalla de React (src/react/pantallas/FinanzasPlanB.tsx) pregunta aquí cuál se está viendo
export const moduloPlanB = () => modulo;
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
    setTimeout(() => { const t = document.querySelectorAll('[data-t=accion-lider] textarea, .lid-accion textarea'); if (t.length) { t[t.length - 1].focus({ preventScroll: true }); t[t.length - 1].scrollIntoView({ block: 'center' }); } }, 60);
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
