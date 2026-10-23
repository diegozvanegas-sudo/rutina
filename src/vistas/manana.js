// "Primera hora": checklist en orden; cada toque guarda la hora
import { e, guardar, dia, racha, hechosManana, alternarCrono, segundosCrono } from '../estado.js';
import { iso, hora, reloj } from '../fechas.js';
import { esc, barra, registrar } from '../ui.js';
import { iniciar } from '../temporizador.js';
import { abrirSesion } from './sesiones.js';

// Texto de la espera entre la pastilla y el desayuno (lo actualiza el reloj de main.js)
export function textoEspera(desde) {
  const { minimo, ideal } = e().config.espera, min = (Date.now() - desde) / 60000;
  if (min < minimo) return { clase: 'esperar', texto: 'Espera ' + reloj((minimo - min) * 60) + ' para desayunar (mín. ' + minimo + ' min)' };
  if (min < ideal) return { clase: 'casi', texto: 'Ya puedes desayunar · ideal en ' + reloj((ideal - min) * 60) };
  return { clase: 'listo', texto: 'Listo para desayunar ✓' };
}

function extra(h, d, fecha) {
  const reg = d.habitos[h.id];
  if (h.tipo === 'espera' && !reg && d.habitos.pastilla) {
    const t = textoEspera(d.habitos.pastilla.ts);
    return '<div class="espera ' + t.clase + '" data-espera="' + d.habitos.pastilla.ts + '">' + t.texto + '</div>';
  }
  if (h.tipo === 'cuenta' && !reg) {
    const a = e().activo, corriendo = a && a.tipo === 'habito' && a.habito === h.id;
    return corriendo ? '<div class="nota-corta">Cronómetro en curso…</div>'
      : '<button type="button" class="boton secundario" data-accion="cuenta" data-id="' + h.id + '">▶ ' + h.segundos + ' s</button>';
  }
  if (h.tipo === 'sesion' && !reg) return '<button type="button" class="boton secundario" data-accion="sesion" data-sesion="' + h.sesion + '" data-habito="' + h.id + '">▶ Guiada</button>';
  if (h.tipo === 'texto') {
    return '<textarea rows="2" data-cambio="gratitud" placeholder="1. …&#10;2. …" aria-label="Cosas por las que agradezco">' + esc(d.gratitud || '') + '</textarea>';
  }
  if (h.tipo === 'cronometro') {
    const c = d.crono[h.id], corre = c && c.inicio;
    return '<div class="crono"><span class="reloj" data-crono="' + fecha + '|' + h.id + '">' + reloj(segundosCrono(c)) + '</span> / ' + reloj(h.segundos) +
      ' <button type="button" class="boton secundario" data-accion="crono" data-id="' + h.id + '">' + (corre ? '⏸ Pausa' : '▶ ' + (segundosCrono(c) ? 'Seguir' : 'Iniciar')) + '</button></div>';
  }
  return '';
}

export function listaManana(fecha = iso()) {
  const d = dia(fecha);
  return '<ol class="habitos">' + e().habitos.map((h, i) => {
    const reg = d.habitos[h.id];
    return '<li class="habito' + (reg ? ' hecho' : '') + '">' +
      '<button type="button" class="check" data-accion="marcar" data-id="' + h.id + '" aria-pressed="' + !!reg + '" aria-label="' + esc(h.nombre) + '">' + (reg ? '✓' : i + 1) + '</button>' +
      '<div class="info"><div class="nombre">' + esc(h.nombre) + '</div>' +
      '<div class="detalle">' + (reg ? 'Hecho a las ' + hora(reg.ts) : esc(h.detalle || '')) + '</div>' + extra(h, d, fecha) + '</div></li>';
  }).join('') + '</ol>';
}

export function cabeceraManana(fecha = iso()) {
  const n = hechosManana(fecha), total = e().habitos.length, r = racha(fecha);
  return '<div class="fila-resumen"><span><b>' + n + ' / ' + total + '</b> hechos</span><span class="racha" title="Días seguidos con la mañana completa">🔥 ' + r + ' día' + (r === 1 ? '' : 's') + '</span></div>' + barra(n / total);
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
  gratitud(ds, el) { dia().gratitud = el.value.trim(); guardar(false); },
  sesion({ sesion, habito }) { abrirSesion(sesion, habito ? () => { dia().habitos[habito] ??= { ts: Date.now() }; guardar(); } : null); },
});
