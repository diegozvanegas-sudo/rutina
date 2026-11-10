// "Primera hora": checklist en orden; cada toque guarda la hora
import { e, guardar, dia, racha, habitosDe, hechosManana, fraccionManana, alternarCrono, segundosCrono, textoHabito, ponerTextoHabito, pastillaDe, mananaCorta, prioridadesDe } from '../estado.js';
import { iso, hora, reloj } from '../fechas.js';
import { esc, barra, tip, registrar, toast } from '../ui.js';
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
  if (!habitosDe(fecha).length) return '<p class="nota-corta">Hoy no tienes hábitos programados. Día libre 🙌</p>' + agregarManana();
  const corta = mananaCorta(fecha);
  return avisoCorta(corta) + prioridadesHoy(fecha) + '<ol class="habitos">' + habitosDe(fecha).map((h, i) => {
    const reg = d.habitos[h.id], partido = !reg && corta && esCaminata(h);
    return '<li class="habito' + (reg ? ' hecho' : '') + '"' + tip(reg && h.detalle ? h.nombre + '\n' + h.detalle : '') + '>' +
      '<button type="button" class="check" data-accion="marcar" data-id="' + h.id + '" aria-pressed="' + !!reg + '" aria-label="' + esc(h.nombre) + '">' + (reg ? '✓' : i + 1) + '</button>' +
      '<div class="info"><div class="nombre">' + esc(h.nombre) + '</div>' +
      '<div class="detalle">' + (reg ? (reg.minimo ? '🌱 Versión mínima a las ' : 'Hecho a las ') + hora(reg.ts) : esc(h.detalle || '')) + '</div>' + extra(h, d, fecha) + (partido ? '<button type="button" class="boton-suave habito-minimo" data-accion="marcar-minimo" data-id="' + h.id + '">⚽ Versión partido: 20 min suaves</button>' : '') + (!partido && !reg && h.minimo ? '<button type="button" class="boton-suave habito-minimo" data-accion="marcar-minimo" data-id="' + h.id + '">🌱 Hoy solo el mínimo: ' + esc(h.minimo) + '</button>' : '') + '</div></li>';
  }).join('') + '</ol>' + agregarManana();
}

// Día del partido y el siguiente: la caminata se acorta para llegar fresco y recuperar
const esCaminata = (h) => h.tipo === 'cronometro' && /camin/i.test(h.nombre);
function avisoCorta(corta) {
  if (corta === 'hoy') return '<p class="aviso">⚽ Hoy juegas: con 20 min suaves de caminata basta, llega fresco al partido.</p>';
  if (corta === 'ayer') return '<p class="aviso">⚽ Ayer jugaste: hoy va la versión corta. Lo que no se negocia: pastilla, desayuno, estirar y tus 3 prioridades. La caminata con 20 min suaves basta.</p>';
  return '';
}
// Las 3 prioridades de hoy (se escriben la noche anterior en el Cierre de la noche; aquí se ven y se corrigen)
const prioridadesHoy = (fecha) => '<label class="campo prioridades-hoy">🎯 Mis 3 prioridades de hoy<textarea rows="3" data-cambio="prioridades" data-f="' + fecha + '" placeholder="1. …&#10;2. …&#10;3. …">' + esc(prioridadesDe(fecha)) + '</textarea></label>';

// Agregar un hábito al final de la lista sin salir de la tarjeta; detalle, tiempos y orden se cambian en Editar
function agregarManana() {
  return '<div class="agregar-habito"><input type="text" data-cambio="manana-nuevo" list="ideas-habitos" placeholder="＋ Nuevo hábito (Enter para agregar)" aria-label="Nuevo hábito de la mañana">' +
    '<datalist id="ideas-habitos">' + IDEAS_HABITOS.filter((x) => !e().habitos.some((h) => h.nombre === x.nombre)).map((x) => '<option value="' + esc(x.nombre) + '">').join('') + '</datalist>' +
    '<select data-cambio="manana-tipo" aria-label="Tipo del nuevo hábito">' + Object.entries(TIPOS_RAPIDOS).map(([v, t]) => '<option value="' + v + '"' + (v === tipoNuevo ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>' +
    '<a class="boton secundario" href="#editar/habitos">✏️ Editar</a></div>';
}
let tipoNuevo = 'check';

export function cabeceraManana(fecha = iso()) {
  const n = hechosManana(fecha), total = habitosDe(fecha).length, r = racha(fecha);
  if (!total) return '';
  return '<div class="fila-resumen"><span><b>' + n + ' / ' + total + '</b> hechos</span><span class="racha" title="Días con la mañana completa. Un día fallado no la corta; dos seguidos, sí.">🔥 ' + r + ' día' + (r === 1 ? '' : 's') + '</span></div>' + barra(fraccionManana(fecha));
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
  'marcar-minimo'({ id }) { dia().habitos[id] = { ts: Date.now(), minimo: true }; guardar(); },
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
  prioridades({ f }, el) { dia(f).prioridades = el.value.trim(); guardar(false); },
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
