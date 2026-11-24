// 🎓 Estudiar: plan del día según los minutos, repasos con tarjetas, racha, áreas y cursos (src/cursos).
// 📚 Libros es un área más: sus libros se abren en su pantalla de siempre (#libros/<id>). Funciona sin internet.
import { e, guardar, repintar, alternarCrono } from '../estado.js';
import { iso } from '../fechas.js';
import { registrar, toast } from '../ui.js';
// Los cursos y los libros llegan después de abrir (src/contenidos.js): antes, las listas están vacías
import { CURSOS, LIBROS, curso, areas, area, catalogoAreas, catalogoCursos } from '../contenidos.js';
import { leidas } from '../biblioteca.js';
import { progresoCurso, lecciones, leccion, leccionQueToca, hechas, sumarTarjetas, repasar, pendientes, planDelDia, siguientes, anotar } from '../estudio.js';
import { registrarCatalogo, ve, veRuta } from '../permisos.js';
import { promptMentor } from '../mentor.js';

// Las áreas y los cursos entran al catálogo del administrador
registrarCatalogo('area', catalogoAreas);
registrarCatalogo('curso', catalogoCursos);

let areaAbierta = null, cursoAbierto = null, pestana = 'hoy', abierta = null, repaso = null;
// Respuestas de "recordar sin mirar" que ya se mostraron (se vuelven a tapar al cambiar de lección)
const vistas = new Set();

const E = () => e().estudio;
const VACIO = progresoCurso();
const progreso = (id) => E().cursos[id] || VACIO;
const P = () => (E().cursos[cursoAbierto] ??= progresoCurso());
const C = () => curso(cursoAbierto);
const minutos = () => e().config.estudio.minutos;
// Lo que el admin deja ver: Estudiar, el área y el curso
const veArea = (a) => veRuta([['seccion', 'estudiar'], ['area', a.id]]);
const veCurso = (a, c) => veArea(a) && ve('curso', c.id);
const areasVisibles = () => areas().filter(veArea);
const cursosVisibles = () => CURSOS.filter((c) => { const a = area(c.area); return a && veCurso(a, c); });
const pendientesVisibles = () => { const ids = new Set(cursosVisibles().map((c) => c.id)); return pendientes(E().tarjetas).filter((id) => ids.has(id.split(':')[0])); };
export const librosVisibles = () => (veArea(area('libros')) ? LIBROS.filter((l) => ve('curso', l.id)) : []);

function plan() {
  const h = E().dias[iso()] || { minutos: 0, repasos: 0 };
  return planDelDia({ minutos: minutos(), repasos: pendientesVisibles().length, siguientes: siguientes(cursosVisibles(), E()), hecho: h });
}

function avanceArea(a) {
  if (a.id === 'libros') {
    const ls = librosVisibles(), t = ls.reduce((s, l) => s + l.lecturas.length, 0);
    return t ? ls.reduce((s, l) => s + leidas(l, e().libros[l.id] || { leidos: {} }), 0) / t : 0;
  }
  const cs = a.cursos.map((x) => curso(x.id)).filter(Boolean), t = cs.reduce((s, c) => s + lecciones(c).length, 0);
  return t ? cs.reduce((s, c) => s + hechas(c, progreso(c.id)), 0) / t : 0;
}

// ---------- Escuchar (cursos de idiomas): la voz del dispositivo lee cada frase; "sombra" deja tiempo para repetirla ----------
let sombra = null;
function hablar(texto, lento, alTerminar) {
  if (!('speechSynthesis' in window)) { toast('Este navegador no puede leer en voz alta'); return false; }
  const u = new SpeechSynthesisUtterance(texto), idioma = C().idioma || 'en-US';
  u.lang = idioma;
  u.rate = lento ? 0.7 : 0.95;
  const voz = speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-') === idioma) || speechSynthesis.getVoices().find((v) => v.lang.startsWith(idioma.slice(0, 2)));
  if (voz) u.voice = voz;
  if (alTerminar) u.onend = alTerminar;
  speechSynthesis.speak(u);
  return true;
}
function pararSombra() { if (sombra) { clearTimeout(sombra.t); sombra = null; } if ('speechSynthesis' in window) speechSynthesis.cancel(); }

const irArriba = () => { pararSombra(); window.scrollTo(0, 0); };
function abrirCurso(id, n = null) { cursoAbierto = id; areaAbierta = curso(id).area; pestana = 'hoy'; abierta = n; }
// "#estudiar/aprender" abre el área; "#estudiar/aprender-a-aprender" el curso; "#estudiar/libros" los libros
function abrirEnlace(p) { repaso = null; if (curso(p)) abrirCurso(p); else if (area(p)) { areaAbierta = p; cursoAbierto = null; } }

// Lo que necesita la pantalla de React (src/react/pantallas/Estudiar.tsx): lo abierto y las reglas que comparte con esta
export const piezasEstudio = {
  ver: () => ({ areaAbierta, cursoAbierto, pestana, abierta, repaso, vistas, sombra }),
  abrir: abrirEnlace, plan, cursosVisibles, areasVisibles, avanceArea, veArea, veCurso, progreso, P, C,
};

registrar({
  'abrir-estudiar'({ p }) { abrirEnlace(p); },
  'estudio-area'({ a }) { areaAbierta = a || null; cursoAbierto = null; repaso = null; repintar(); irArriba(); },
  'estudio-curso'({ c }) { abrirCurso(c); repintar(); irArriba(); },
  'estudio-leccion'({ c, n }) { abrirCurso(c, Number(n)); repintar(); irArriba(); },
  'estudio-pestana'({ p }) { pestana = p; repintar(); },
  'estudio-abrir'({ n }, el, ev) { if (ev) ev.preventDefault(); abierta = Number(n) || null; pestana = 'hoy'; repintar(); irArriba(); },
  'estudio-minutos'(ds, el) { e().config.estudio.minutos = Math.max(5, Math.min(240, Math.round(Number(el.value) || 15))); guardar(); },
  'estudio-crono'() { alternarCrono(iso(), 'estudio'); guardar(); },
  'estudio-ver'({ k }) { vistas.add(k); repintar(); },
  'estudio-recordar'({ n, i, ok }) { const r = (P().recordar[n] ??= {}); r[i] = !!ok; guardar(); },
  'estudio-practica'({ n, i }) { const p = (P().practica[n] ??= {}); if (p[i]) delete p[i]; else p[i] = iso(); guardar(); },
  'estudio-proyecto'({ i }) { const p = P().proyecto; if (p[i]) delete p[i]; else p[i] = iso(); guardar(); },
  'estudio-diario'({ c, n }, el) { ((E().cursos[c] ??= progresoCurso()).diario)[n] = el.value; guardar(); },
  'estudio-hecha'({ n }) {
    const c = C(), l = leccion(c, Number(n)), p = P(), dias = E().dias;
    if (p.hechas[n]) {
      // Desmarcar descuenta del día en que se terminó; las tarjetas se quedan en el mazo
      anotar(dias, 'lecciones', -1, p.hechas[n]); anotar(dias, 'minutos', -l.minutos, p.hechas[n]);
      delete p.hechas[n]; guardar(); return;
    }
    p.hechas[n] = iso();
    E().actual = c.id;
    sumarTarjetas(E().tarjetas, c, l);
    anotar(dias, 'lecciones', 1); anotar(dias, 'minutos', l.minutos);
    abierta = null;
    guardar();
    const sig = leccionQueToca(c, p);
    toast(sig ? '✓ Lección ' + n + ' lista. ' + l.tarjetas.length + ' tarjetas nuevas para mañana' : '🎉 ¡Curso completo! Te falta el proyecto final');
    irArriba();
  },
  'estudio-repasar'() {
    const ids = pendientesVisibles().slice(0, Math.max(1, plan().repasos));
    if (!ids.length) return;
    repaso = { ids, i: 0, volteada: false, bien: 0 };
    repintar(); irArriba();
  },
  'estudio-voltear'() { repaso.volteada = true; repintar(); },
  'estudio-responder'({ ok }) {
    const id = repaso.ids[repaso.i];
    repasar(E().tarjetas[id], !!ok);
    anotar(E().dias, 'repasos', 1);
    if (ok) repaso.bien++;
    repaso.i++; repaso.volteada = false;
    guardar();
  },
  async 'estudio-copiar-mentor'() {
    const texto = promptMentor(C(), P(), { minutos: minutos() });
    try { await navigator.clipboard.writeText(texto); toast('📋 Prompt copiado: pégalo en Claude'); }
    catch { const t = document.getElementById('prompt-mentor'); if (t) t.select(); toast('Abre «Ver el prompt», selecciona el texto y cópialo'); }
  },
  'estudio-hablar'({ n, i, lento }) {
    pararSombra();
    hablar(leccion(C(), Number(n)).escuchar[Number(i)][0], !!lento);
  },
  'estudio-sombra'({ n }) {
    if (sombra) { pararSombra(); repintar(); return; }
    if (!('speechSynthesis' in window)) { toast('Este navegador no puede leer en voz alta'); return; }
    const frases = leccion(C(), Number(n)).escuchar.map(([en]) => en);
    // Cada frase suena y luego hay una pausa del doble de lo que duró, para repetirla en voz alta
    const siguiente = () => {
      if (!sombra || sombra.i >= frases.length) { sombra = null; repintar(); return; }
      const inicio = Date.now();
      hablar(frases[sombra.i++], false, () => { if (sombra) sombra.t = setTimeout(siguiente, Math.max(1500, 2 * (Date.now() - inicio))); });
    };
    pararSombra();
    sombra = { i: 0 };
    siguiente();
    repintar();
  },
  'estudio-fin-repaso'() { repaso = null; repintar(); irArriba(); },
});
