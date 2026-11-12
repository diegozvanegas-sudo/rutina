// Pantallas de 🔥 Retos (src/retos.js): la lista completa va en 📈 Progreso y el reto activo, en Hoy
import { guardar, repintar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { esc, barra, registrar, toast } from '../ui.js';
import { TEMAS_RETOS, RETOS, retoPorId, registros, retoActivo, hechoDe, cuantosHechos, estadoRacha, avisoFutbol, empezarRacha, marcarHoy, hacerUna, dejarActivo } from '../retos.js';

const duracion = (x) => (x.tipo === 'racha' ? x.dias + ' días seguidos' : 'Una vez');

// El reto activo: día de la racha y botón para marcar hoy
function bloqueActivo(x, hoy = iso()) {
  const reto = retoPorId(x.reto), s = estadoRacha(x, hoy);
  if (!reto) return '';
  return '<div class="reto-activo"><p class="rec-titulo">🔥 ' + esc(reto.texto) + '</p>' +
    '<p class="nota-corta">' + (s.rota ? 'Se rompió la racha: vuelve a empezar desde hoy.' : 'Día ' + s.racha + ' de ' + s.meta + (s.hoyListo ? ' · hoy ya cuenta' : ' · falta hoy')) + '</p>' +
    barra(s.fraccion) +
    '<button type="button" class="boton ' + (s.hoyListo ? 'secundario' : 'primario') + ' ancho" data-accion="reto-hoy">' + (s.hoyListo ? '↩ Hoy no lo cumplí' : '✓ Hoy lo cumplí') + '</button>' +
    '<button type="button" class="boton-suave" data-accion="reto-dejar">Dejar este reto</button></div>';
}

// Hoy: el reto activo o, si no hay, cuántos llevas y dónde elegir otro
export function tarjetaRetoHoy(hoy = iso()) {
  const x = retoActivo();
  if (x) return '<section class="tarjeta reto-hoy"><h2>🔥 Reto activo</h2>' + bloqueActivo(x, hoy) + '</section>';
  return '<section class="tarjeta reto-hoy"><h2>🔥 Retos</h2><p class="nota-corta">Llevas ' + cuantosHechos() + ' de ' + RETOS.length + '. No se trata de tachar los 28: termina los 3 o 4 que más miedo te den.</p>' +
    '<a class="boton secundario ancho" href="#progreso">Elegir un reto →</a></section>';
}

function filaReto(reto, activo, hoy) {
  const hecho = hechoDe(reto.id), aviso = avisoFutbol(reto, undefined, hoy), esActivo = activo && activo.reto === reto.id;
  const acciones = hecho
    ? '<label class="campo">¿Cómo te fue?<textarea rows="2" data-cambio="reto-nota" data-id="' + hecho.id + '" placeholder="Qué sentiste, qué aprendiste">' + esc(hecho.nota) + '</textarea></label>' +
      '<button type="button" class="boton-suave" data-accion="reto-quitar" data-id="' + hecho.id + '">↩ No lo hice</button>'
    : esActivo ? '<p class="nota-corta">Es tu reto activo (arriba).</p>'
    : reto.tipo === 'racha'
      ? (activo ? '<p class="nota-corta">Termina o deja el reto activo para empezar este.</p>' : '<button type="button" class="boton secundario" data-accion="reto-empezar" data-id="' + reto.id + '">▶ Empezar hoy</button>')
      : '<button type="button" class="boton secundario" data-accion="reto-una" data-id="' + reto.id + '">✅ Lo hice</button>';
  return '<li class="' + (hecho ? 'hecho' : '') + '"><b>' + (hecho ? '✅ ' : esActivo ? '🔥 ' : '') + esc(reto.texto) + '</b>' +
    '<span class="nota-corta">' + duracion(reto) + (hecho ? ' · hecho el ' + fechaCorta(hecho.fin) : '') + '</span>' +
    (reto.nota ? '<span class="nota-corta reto-ojo">⚠️ ' + esc(reto.nota) + '</span>' : '') +
    (aviso && !hecho ? '<span class="aviso-sup">⚽ ' + esc(aviso) + '</span>' : '') +
    (reto.ir && !hecho ? '<a class="nota-corta" href="' + reto.ir + '">Ir a Finanzas →</a>' : '') + acciones + '</li>';
}

// Progreso: los 28 retos por tema, el activo arriba
export function tarjetaRetos(hoy = iso()) {
  const activo = retoActivo(), n = cuantosHechos();
  return '<section class="tarjeta retos"><div class="fila-resumen"><h2>🔥 Retos</h2><b>' + n + ' / ' + RETOS.length + '</b></div>' + barra(n / RETOS.length) +
    '<p class="nota-corta">Una racha a la vez. Si fallas un día, vuelve a 0. Lo que más vale son tus notas de cómo te fue.</p>' +
    (activo ? bloqueActivo(activo, hoy) : '') +
    Object.entries(TEMAS_RETOS).map(([tema, lista]) => {
      const hechos = lista.filter((x) => hechoDe(x.id)).length;
      return '<details class="reto-tema"' + (activo && lista.some((x) => x.id === activo.reto) ? ' open' : '') + '><summary>' + esc(tema) + ' <small>' + hechos + ' / ' + lista.length + '</small></summary>' +
        '<ul class="lista-funciona lista-retos">' + lista.map((x) => filaReto(x, activo, hoy)).join('') + '</ul></details>';
    }).join('') + '</section>';
}

registrar({
  'reto-empezar'({ id }) {
    if (!empezarRacha(id)) { toast('Ya tienes un reto activo'); return; }
    guardar();
    toast('🔥 Empieza hoy. Marca cada día que lo cumplas.');
  },
  'reto-hoy'() {
    const x = marcarHoy();
    if (!x) return;
    guardar();
    if (x.estado === 'hecho') toast('🏆 ¡Reto cumplido! Anota cómo te fue.');
  },
  'reto-dejar'() {
    if (retoActivo() && confirm('¿Dejar este reto? La racha se pierde.')) { dejarActivo(); guardar(); }
  },
  'reto-una'({ id }) {
    const x = hacerUna(id);
    if (!x) return;
    guardar();
    toast('✅ Hecho. Anota cómo te fue.', () => { const l = registros(), i = l.indexOf(x); if (i >= 0) l.splice(i, 1); guardar(); });
  },
  'reto-quitar'({ id }) {
    const l = registros(), i = l.findIndex((x) => x.id === id);
    if (i < 0) return;
    const [x] = l.splice(i, 1);
    // Si era una racha cumplida, no vuelve a quedar activa: se empieza de nuevo
    guardar();
    toast('Quitado', () => { l.splice(i, 0, x); guardar(); });
  },
  'reto-nota'(ds, el) {
    const x = registros().find((r) => r.id === ds.id);
    if (!x) { repintar(); return; }
    x.nota = el.value.trim();
    guardar();
  },
});
