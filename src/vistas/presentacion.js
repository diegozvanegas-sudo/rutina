// Presentación de la app en la pantalla de entrar (lo primero que ve quien abre el enlace): qué es, para quién, cómo
// funciona y cómo pedir acceso. En el computador va al lado del formulario; en el celular, el formulario va arriba.
// Todo lo que dice es lo que la app hace hoy: nada de cifras, precios ni testimonios inventados. Las muestras de pantalla
// están dibujadas con los mismos estilos de la app y dicen que son un ejemplo.
import { esc } from '../ui.js';

// WhatsApp para pedir acceso (solo dígitos, con indicativo: 57…). Vacío = no se muestra el botón
export const CONTACTO_WHATSAPP = '';

const punto = (icono, titulo, texto) => '<li><span class="pr-ic" aria-hidden="true">' + icono + '</span><span><b>' + titulo + '</b><small>' + texto + '</small></span></li>';

// Muestra de la tarjeta del Gym (lo que ve quien entrena)
const muestraGym = '<figure class="pr-muestra" aria-label="Ejemplo de la pantalla del Gym"><figcaption>Así anotas en el gym</figcaption>' +
  '<div class="pr-pantalla"><div class="pr-m-cab"><b>Press plano</b><span>Pecho</span></div>' +
  '<div class="pr-m-fila"><span class="pr-m-tipo">TOP</span><span>1×4-7</span><span class="pr-m-cont">0 / 1</span></div>' +
  '<p class="pr-m-meta">🎯 Hoy: <b>62,5 kg × 5 ⬆</b> <span>· último 60 kg · 7</span></p>' +
  '<div class="pr-m-entrada"><span>reps</span><span class="pr-m-boton">＋ Serie 1 y descanso</span></div>' +
  '<p class="pr-m-record">🏆 Récord: fuerza estimada 72,5 kg</p>' +
  '<div class="pr-m-reloj"><span>Descanso</span><b>2:29</b></div></div></figure>';

// Muestra del tablero del entrenador
const muestraCoach = '<figure class="pr-muestra" aria-label="Ejemplo del tablero del entrenador"><figcaption>Así ves a tus clientes</figcaption>' +
  '<div class="pr-pantalla"><div class="pr-m-cab"><b>Tus clientes</b><span>ejemplo</span></div>' +
  [['Ana', 'Semana 3 · Base', 'Al día', 'ok'], ['Juan', 'Semana 6 · Progresión', 'Paga pronto', 'pronto'], ['Laura', 'Check-in nuevo 📥', 'Al día', 'ok']].map(([n, s, e, c]) =>
    '<div class="pr-m-cliente"><span class="pr-m-avatar" aria-hidden="true">' + n[0] + '</span><span><b>' + n + '</b><small>' + s + '</small></span><span class="pr-m-estado ' + c + '">' + e + '</span></div>').join('') +
  '<div class="pr-m-barras" aria-hidden="true">' + [62, 80, 74, 92, 88].map((h, i) => '<span style="--h:' + h + '%"><i>S' + (i + 1) + '</i></span>').join('') + '</div></div></figure>';

export function presentacion() {
  const wa = CONTACTO_WHATSAPP ? 'https://wa.me/' + CONTACTO_WHATSAPP + '?text=' + encodeURIComponent('Hola, quiero información de la app Rutina') : '';
  return '<div class="pr">' +
    '<section class="pr-heroe"><p class="pr-etiqueta"><span aria-hidden="true">🏋️</span> Rutina · gym, comida y progreso</p>' +
      '<h1>Entrena con un plan.<br><span class="pr-acento">Mira cómo mejoras.</span></h1>' +
      '<p class="pr-sub">Tu rutina, tu comida y tu progreso en un solo lugar, para ti y para el entrenador que te acompaña. Anotas cada serie en segundos y funciona sin señal en el gym.</p>' +
      '<div class="pr-acciones">' + (wa ? '<a class="boton primario pr-cta" href="' + esc(wa) + '" target="_blank" rel="noopener">💬 Quiero usarla</a>' : '') +
        '<a class="boton secundario pr-cta" href="#como-funciona">Ver cómo funciona ↓</a></div>' +
      '<ul class="pr-sellos"><li>📶 Funciona sin internet</li><li>📱 Celular y computador</li><li>🔒 Tus datos son tuyos</li></ul></section>' +

    '<div class="pr-muestras">' + muestraGym + muestraCoach + '</div>' +

    '<section class="pr-bloque pr-verde"><p class="pr-kicker">Para quien entrena</p><h2>Todo tu entreno, sin papel ni hojas de cálculo</h2><ul class="pr-lista">' +
      punto('⏱️', 'Anota cada serie en segundos', 'Top set y back-off, descanso automático, reps en reserva y tu meta de hoy en cada ejercicio.') +
      punto('🏆', 'Mira cómo mejoras', 'Récords, fuerza estimada semana a semana y aviso cuando toca subir el peso o cuando te estancas.') +
      punto('🥗', 'Comida a tu medida', 'Planes por tipo de día (pierna, torso, descanso) que se ajustan a tu peso y tu objetivo.') +
      punto('📆', 'Un ciclo con sentido', '12 semanas por fases: base, progresión, descarga e intensificación.') +
    '</ul></section>' +

    '<section class="pr-bloque pr-azul"><p class="pr-kicker">Para entrenadores</p><h2>Tus clientes, sus planes y sus pagos en un tablero</h2><ul class="pr-lista">' +
      punto('📚', 'Planes en minutos', 'Arma rutina, ciclo y comidas desde tus plantillas y ajústalos a cada persona.') +
      punto('📲', 'El plan le llega a su app', 'Tu cliente lo usa en su Gym y su Dieta; tú ves su avance, su peso y sus check-ins.') +
      punto('✅', 'Seguimiento semanal', 'Check-ins, medidas y pruebas de fuerza con su evolución.') +
      punto('💳', 'Cobros al día', 'Precio, frecuencia y aviso de quién paga esta semana.') +
      punto('📤', 'Comparte como quieras', 'Por WhatsApp, en PDF o como imagen, aunque tu cliente no use la app.') +
      punto('👥', 'Todo a la vista', 'Quién está activo, quién te debe y en qué semana del ciclo va cada uno.') +
    '</ul></section>' +

    '<section class="pr-bloque" id="como-funciona"><p class="pr-kicker">Cómo funciona</p><h2>Tres pasos, cada semana</h2><ol class="pr-pasos">' +
      '<li><b>Tu entrenador te arma el plan</b><small>Rutina, ciclo y comidas pensados para ti.</small></li>' +
      '<li><b>Lo usas cada día</b><small>Entrenas, anotas y mandas tu check-in desde el celular.</small></li>' +
      '<li><b>Él ve tu avance y lo ajusta</b><small>Sin mensajes perdidos ni planes en papel.</small></li>' +
    '</ol></section>' +

    '<section class="pr-bloque pr-privacidad"><span class="pr-candado" aria-hidden="true">🔒</span><div><h2>Tus datos son tuyos</h2><p>Cada persona ve solo lo suyo. Tu entrenador (y el administrador de la app) ve únicamente el resumen de avance que aceptas compartir, nunca el resto de tus datos, y puedes dejar de compartir cuando quieras.</p></div></section>' +

    '<section class="pr-bloque"><p class="pr-kicker">Y además</p><p class="pr-chips"><span>☀️ Hábitos de la mañana</span><span>🎯 Metas del día</span><span>💊 Suplementos</span><span>🔔 Recordatorios</span><span>💰 Finanzas</span><span>🎓 Cursos sin internet</span></p></section>' +

    '<section class="pr-final"><h2>¿Listo para entrenar con un plan?</h2>' +
      (wa ? '<p>Escríbenos y te contamos cómo empezar, como persona o como entrenador.</p><a class="boton pr-cta pr-cta-claro" href="' + esc(wa) + '" target="_blank" rel="noopener">💬 Escribir por WhatsApp</a>'
        : '<p>Pídele el acceso a tu entrenador. Si eres entrenador y quieres llevar a tus clientes aquí, pide tu cuenta a quien te compartió este enlace.</p>') + '</section>' +
    '</div>';
}
