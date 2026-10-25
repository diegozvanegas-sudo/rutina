// "Primera hora": checklist en orden; cada toque guarda la hora
import { e, guardar, dia, racha, hechosManana, fraccionManana, alternarCrono, segundosCrono, textoHabito, ponerTextoHabito, pastillaDe } from '../estado.js';
import { iso, hora, reloj } from '../fechas.js';
import { esc, barra, registrar, toast } from '../ui.js';
import { iniciar } from '../temporizador.js';
import { abrirSesion } from './sesiones.js';
import { IDEAS_HABITOS } from '../datos_iniciales.js';

// Texto de la espera entre la pastilla y el desayuno (lo actualiza el reloj de main.js)
export function textoEspera(desde) {
  const { minimo, ideal } = e().config.espera, min = (Date.now() - desde) / 60000;
  if (min < minimo) return { clase: 'esperar', texto: 'Espera ' + reloj((minimo - min) * 60) + ' para desayunar (mín. ' + minimo + ' min)' };
  if (min < ideal) return { clase: 'casi', texto: 'Ya puedes desayunar · ideal en ' + reloj((ideal - min) * 60) };
  return { clase: 'listo', texto: 'Listo para desayunar ✓' };
}

function extra(h, d, fecha) {
  const reg = d.habitos[h.id];
  const pastilla = h.tipo === 'espera' && !reg && pastillaDe(d);
  if (pastilla) {
    const t = textoEspera(pastilla.ts);
    return '<div class="espera ' + t.clase + '" data-espera="' + pastilla.ts + '">' + t.texto + '</div>';
  }
  if (h.tipo === 'cuenta' && !reg) {
    const a = e().activo, corriendo = a && a.tipo === 'habito' && a.habito === h.id;
    return corriendo ? '<div class="nota-corta">Cronómetro en curso…</div>'
      : '<button type="button" class="boton secundario" data-accion="cuenta" data-id="' + h.id + '">▶ ' + h.segundos + ' s</button>';
  }
  if (h.tipo === 'sesion' && !reg) return '<button type="button" class="boton secundario" data-accion="sesion" data-sesion="' + h.sesion + '" data-habito="' + h.id + '">▶ Guiada</button>';
  if (h.tipo === 'texto') {
    return '<textarea rows="2" data-cambio="habito-texto" data-id="' + h.id + '" placeholder="1. …&#10;2. …" aria-label="' + esc(h.nombre) + '">' + esc(textoHabito(d, h)) + '</textarea>';
  }
  if (h.tipo === 'cronometro') {
    const c = d.crono[h.id], corre = c && c.inicio;
    return '<div class="crono"><span class="reloj" data-crono="' + fecha + '|' + h.id + '">' + reloj(segundosCrono(c)) + '</span> / ' + reloj(h.segundos) +
      ' <button type="button" class="boton secundario" data-accion="crono" data-id="' + h.id + '">' + (corre ? '⏸ Pausa' : '▶ ' + (segundosCrono(c) ? 'Seguir' : 'Iniciar')) + '</button></div>';
  }
  return '';
}

// Tipos que se pueden crear rápido desde la tarjeta (los demás, en Editar)
const TIPOS_RAPIDOS = { check: 'Marcar', texto: 'Con texto', cuenta: 'Cuenta regresiva', cronometro: 'Cronómetro' };

export function listaManana(fecha = iso()) {
  const d = dia(fecha);
  if (!e().habitos.length) return '<p class="nota-corta">Aún no tienes hábitos de mañana. Agrega el primero aquí abajo.</p>' + agregarManana();
  return '<ol class="habitos">' + e().habitos.map((h, i) => {
    const reg = d.habitos[h.id];
    return '<li class="habito' + (reg ? ' hecho' : '') + '">' +
      '<button type="button" class="check" data-accion="marcar" data-id="' + h.id + '" aria-pressed="' + !!reg + '" aria-label="' + esc(h.nombre) + '">' + (reg ? '✓' : i + 1) + '</button>' +
      '<div class="info"><div class="nombre">' + esc(h.nombre) + '</div>' +
      '<div class="detalle">' + (reg ? 'Hecho a las ' + hora(reg.ts) : esc(h.detalle || '')) + '</div>' + extra(h, d, fecha) + '</div></li>';
  }).join('') + '</ol>' + agregarManana();
}

// Agregar un hábito al final de la lista sin salir de la tarjeta; detalle, tiempos y orden se cambian en Editar
function agregarManana() {
  return '<div class="agregar-habito"><input type="text" data-cambio="manana-nuevo" list="ideas-habitos" placeholder="＋ Nuevo hábito (Enter para agregar)" aria-label="Nuevo hábito de la mañana">' +
    '<datalist id="ideas-habitos">' + IDEAS_HABITOS.filter((x) => !e().habitos.some((h) => h.nombre === x.nombre)).map((x) => '<option value="' + esc(x.nombre) + '">').join('') + '</datalist>' +
    '<select data-cambio="manana-tipo" aria-label="Tipo del nuevo hábito">' + Object.entries(TIPOS_RAPIDOS).map(([v, t]) => '<option value="' + v + '"' + (v === tipoNuevo ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>' +
    '<a class="boton secundario" href="#editar/habitos">✏️ Editar</a></div>';
}
let tipoNuevo = 'check';

export function cabeceraManana(fecha = iso()) {
  const n = hechosManana(fecha), total = e().habitos.length, r = racha(fecha);
  if (!total) return '';
  return '<div class="fila-resumen"><span><b>' + n + ' / ' + total + '</b> hechos</span><span class="racha" title="Días seguidos con la mañana completa">🔥 ' + r + ' día' + (r === 1 ? '' : 's') + '</span></div>' + barra(fraccionManana(fecha));
}

export function vistaManana() {
  return '<h1>Primera hora</h1>' + '<section class="tarjeta">' + cabeceraManana() + listaManana() + '</section>';
}

// Si el cronómetro de caminar llega a la hora, se marca solo
export function revisarCronos(fecha = iso()) {
  const d = e().dias[fecha];
  if (!d) return;
  for (const h of e().habitos) {
    if (h.tipo === 'cronometro' && !d.habitos[h.id] && segundosCrono(d.crono && d.crono[h.id]) >= h.segundos) {
      alternarCrono(fecha, h.id);
      d.habitos[h.id] = { ts: Date.now() };
      guardar();
    }
  }
}

registrar({
  marcar({ id }) {
    const h = dia().habitos;
    if (h[id]) { if (!confirm('¿Desmarcar este hábito?')) return; delete h[id]; } else h[id] = { ts: Date.now() };
    guardar();
  },
  cuenta({ id }) {
    const h = e().habitos.find((x) => x.id === id);
    iniciar('habito', h.segundos, h.nombre, { habito: id, fecha: iso() });
  },
  crono({ id }) { alternarCrono(iso(), id); guardar(); },
  'habito-texto'({ id }, el) {
    const h = e().habitos.find((x) => x.id === id);
    if (h) { ponerTextoHabito(dia(), h, el.value.trim()); guardar(false); }
  },
  'manana-tipo'(ds, el) { tipoNuevo = el.value; },
  'manana-nuevo'(ds, el) {
    const nombre = el.value.trim();
    if (!nombre) return;
    // Si es una de las ideas, trae su tipo, detalle y tiempo
    const idea = IDEAS_HABITOS.find((x) => x.nombre.toLowerCase() === nombre.toLowerCase());
    const h = { id: 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ...(idea ? JSON.parse(JSON.stringify(idea)) : { nombre, tipo: tipoNuevo }) };
    if (h.tipo === 'cuenta') h.segundos ??= 60;
    if (h.tipo === 'cronometro') h.segundos ??= 1800;
    if (h.tipo === 'texto') h.detalle ??= 'Escribe aquí (opcional)';
    e().habitos.push(h);
    el.value = '';
    guardar();
    toast('Agregado: ' + h.nombre + (!idea && (h.tipo === 'cuenta' || h.tipo === 'cronometro') ? '. El tiempo se cambia en Editar.' : ''));
  },
  sesion({ sesion, habito }) { abrirSesion(sesion, habito ? () => { dia().habitos[habito] ??= { ts: Date.now() }; guardar(); } : null); },
});
