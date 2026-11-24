// Libros: biblioteca de libros convertidos desde PDF (src/libros). Cada uno con lectura del día, práctica, diario,
// buscador, consejos por situación, conceptos clave, rutina y herramientas. Funciona sin internet.
import { e, guardar, repintar } from '../estado.js';
import { iso } from '../fechas.js';
import { registrar, toast } from '../ui.js';
import { LIBROS, libro, alCargarContenidos } from '../contenidos.js';
import { progresoInicial, lecturaQueToca, buscar, resultadoEvaluacion } from '../biblioteca.js';

let actual = null, pestana = 'hoy', abierto = null, consulta = '', consejo = null;
// Herramientas y fichas desplegadas: siguen abiertas después de repintar (al guardar un campo)
const desplegados = new Set();

const L = () => libro(actual);
// Al mostrar no se escribe nada: el progreso se crea con la primera acción
const VACIO = progresoInicial();
const progreso = (id) => e().libros[id] || VACIO;
const P = () => (e().libros[actual] ??= progresoInicial());
const hoyDe = (id, fecha = iso()) => (((e().dias[fecha] ??= {}).libros ??= {})[id] ??= {});
const total = (l) => l.lecturas.length;

















// Con un solo libro, la sección lo abre directo
alCargarContenidos(() => { if (LIBROS.length === 1 && !actual) actual = LIBROS[0].id; });

// Lo que necesita la pantalla de React (src/react/pantallas/Libros.tsx): el libro, la pestaña y lo abierto
export const piezasLibros = {
  ver: () => ({ actual, pestana, abierto, consulta, consejo, desplegados }),
  L, P, progreso, total,
};

const irArriba = () => window.scrollTo(0, 0);
function elegir(id) { actual = id || null; pestana = 'hoy'; abierto = null; consulta = ''; consejo = null; desplegados.clear(); }
registrar({
  // "#libros/fenix" abre ese libro
  'abrir-libros'({ p }) { if (libro(p)) elegir(p); },
  'libro-elegir'({ id }) { elegir(id); repintar(); irArriba(); },
  'libro-pestana'({ p }) { pestana = p; repintar(); },
  // Abrir o cerrar una herramienta o una ficha: sigue así después de repintar
  'libro-desplegar'({ clave }) { if (desplegados.has(clave)) desplegados.delete(clave); else desplegados.add(clave); repintar(); },
  'libro-abrir'({ n }, el, ev) { if (ev) ev.preventDefault(); abierto = Number(n) || null; pestana = 'hoy'; repintar(); irArriba(); },
  'libro-leida'({ n }) {
    const l = P().leidos;
    if (l[n]) { delete l[n]; guardar(); return; }
    l[n] = iso();
    abierto = null;
    guardar();
    const sig = lecturaQueToca(L(), P());
    toast(sig ? '✓ ' + L().unidad + ' ' + n + ' listo. Sigue: ' + L().unidad.toLowerCase() + ' ' + sig : '🎉 ¡Libro completo!');
    irArriba();
  },
  'libro-practica'({ n, i }) {
    const p = (P().practica[n] ??= {});
    if (p[i]) delete p[i]; else p[i] = iso();
    guardar();
  },
  'libro-nota'({ n }, el) { P().notas[n] = el.value; guardar(); },
  'libro-afirmar'() { const d = hoyDe(actual); d.afirmaciones = (d.afirmaciones || 0) + 1; guardar(); },
  'libro-vuelta'() { const p = P(); p.leidos = {}; p.practica = {}; p.vuelta = (p.vuelta || 1) + 1; abierto = null; guardar(); irArriba(); },
  'libro-buscar'(ds, el) { consulta = el.value.trim(); consejo = null; repintar(); },
  'libro-limpiar'() { consulta = ''; repintar(); },
  'libro-consejo'({ c }) { consejo = consejo === c ? null : c; consulta = ''; repintar(); },
  'libro-herramienta'({ h }) { desplegados.add(h); pestana = 'herramientas'; repintar(); irArriba(); },
  'libro-dia'({ k }, el) { hoyDe(actual)[k] = el.value; guardar(); },
  'libro-perfil'({ k }, el) { P().perfil[k] = el.value; guardar(); },
  'libro-nueva'({ t }) {
    const id = Date.now().toString(36);
    (P().fichas[t] ??= []).unshift({ id, fecha: iso() });
    desplegados.add(t).add(id);
    guardar();
  },
  'libro-eval'({ ev, i }) {
    const x = ((P().evaluaciones ??= {})[ev] ??= {}), m = (x.marcados ??= {});
    if (m[i]) delete m[i]; else m[i] = true;
    guardar();
  },
  'libro-eval-guardar'({ ev }) {
    const x = P().evaluaciones[ev], r = resultadoEvaluacion(L().evaluaciones[ev], x.marcados);
    if (!r.principal) return;
    // Un resultado por día: si ya había uno hoy, se reemplaza
    x.historial = (x.historial || []).filter((h) => h.fecha !== iso());
    x.historial.push({ fecha: iso(), principal: r.principal, pct: r.pct });
    guardar();
    toast('💾 Resultado guardado: ' + L().evaluaciones[ev].categorias[r.principal].nombre);
  },
  'libro-eval-limpiar'({ ev }) { P().evaluaciones[ev].marcados = {}; guardar(); },
  'libro-ficha'({ t, id, k }, el) { const x = (P().fichas[t] || []).find((y) => y.id === id); if (x) { x[k] = el.value; guardar(); } },
  'libro-borrar'({ t, id }) {
    if (!confirm('¿Borrar esta ficha?')) return;
    P().fichas[t] = P().fichas[t].filter((y) => y.id !== id);
    guardar();
  },
});
