// Presentación de la app en la pantalla de entrar (lo primero que ve quien abre el enlace): qué es, para quién, cómo
// funciona y cómo pedir acceso. En el computador va al lado del formulario; en el celular, el formulario va arriba.
// Todo lo que dice es lo que la app hace hoy: nada de cifras, precios ni testimonios inventados.
import { esc } from '../ui.js';

// WhatsApp para pedir acceso (solo dígitos, con indicativo: 57…). Vacío = no se muestra el botón
export const CONTACTO_WHATSAPP = '';

const punto = (icono, titulo, texto) => '<li><span class="pr-ic" aria-hidden="true">' + icono + '</span><span><b>' + titulo + '</b><small>' + texto + '</small></span></li>';

export function presentacion() {
  const wa = CONTACTO_WHATSAPP ? 'https://wa.me/' + CONTACTO_WHATSAPP + '?text=' + encodeURIComponent('Hola, quiero información de la app Rutina') : '';
  return '<div class="pr">' +
    '<section class="pr-heroe"><p class="pr-etiqueta">🏋️ Rutina</p>' +
      '<h1>Tu entrenamiento, tu comida y tu progreso, en un solo lugar.</h1>' +
      '<p class="pr-sub">Para quien entrena y para el entrenador que lo acompaña. Anotas tus series en segundos, sigues tu plan de comida y ves cómo mejoras. Funciona sin señal en el gym.</p>' +
      (wa ? '<a class="boton primario pr-cta" href="' + esc(wa) + '" target="_blank" rel="noopener">💬 Quiero usarla</a>' : '') + '</section>' +

    '<section class="pr-bloque"><h2>Para quien entrena</h2><ul class="pr-lista">' +
      punto('⏱️', 'Anota cada serie en segundos', 'Top set y back-off, descanso automático, reps en reserva y tu meta de hoy en cada ejercicio.') +
      punto('🏆', 'Mira cómo mejoras', 'Récords, fuerza estimada semana a semana y aviso cuando toca subir el peso o cuando te estancas.') +
      punto('🥗', 'Comida a tu medida', 'Planes por tipo de día (pierna, torso, descanso) que se ajustan a tu peso y tu objetivo.') +
      punto('📆', 'Un ciclo con sentido', '12 semanas por fases: base, progresión, descarga e intensificación.') +
      punto('📶', 'Sin señal, sin problema', 'Todo funciona en el gym sin internet y se guarda en la nube cuando vuelve la conexión.') +
    '</ul></section>' +

    '<section class="pr-bloque"><h2>Para entrenadores</h2><ul class="pr-lista">' +
      punto('👥', 'Tus clientes en un tablero', 'Quién está activo, quién te debe y en qué semana del ciclo va cada uno.') +
      punto('📚', 'Planes en minutos', 'Arma rutina, ciclo y comidas desde tus plantillas, y ajústalos a cada persona.') +
      punto('📲', 'El plan le llega a su app', 'Tu cliente lo usa en su Gym y su Dieta; tú ves su avance, su peso y sus check-ins.') +
      punto('✅', 'Seguimiento semanal', 'Check-ins, medidas y pruebas de fuerza con su evolución.') +
      punto('💳', 'Cobros al día', 'Precio, frecuencia y aviso de quién paga esta semana.') +
      punto('📤', 'Comparte como quieras', 'Por WhatsApp, en PDF o como imagen, aunque tu cliente no use la app.') +
    '</ul></section>' +

    '<section class="pr-bloque"><h2>Cómo funciona</h2><ol class="pr-pasos">' +
      '<li><b>Tu entrenador te arma el plan</b><small>Rutina, ciclo y comidas pensados para ti.</small></li>' +
      '<li><b>Lo usas cada día</b><small>Entrenas, anotas y mandas tu check-in desde el celular.</small></li>' +
      '<li><b>Él ve tu avance y lo ajusta</b><small>Sin hojas de cálculo ni mensajes perdidos.</small></li>' +
    '</ol></section>' +

    '<section class="pr-bloque pr-privacidad"><h2>🔒 Tus datos son tuyos</h2><p>Cada persona ve solo lo suyo. Tu entrenador (y el administrador de la app) ve únicamente el resumen de avance que aceptas compartir, nunca el resto de tus datos, y puedes dejar de compartir cuando quieras.</p></section>' +

    '<section class="pr-bloque"><h2>Y además</h2><p class="pr-chips"><span>☀️ Hábitos de la mañana</span><span>🎯 Metas del día</span><span>💊 Suplementos</span><span>🔔 Recordatorios</span><span>💰 Finanzas</span><span>🎓 Cursos sin internet</span></p></section>' +

    (wa ? '<section class="pr-bloque pr-final"><h2>¿Quieres usarla?</h2><p>Escríbenos y te contamos cómo empezar, como persona o como entrenador.</p><a class="boton primario pr-cta" href="' + esc(wa) + '" target="_blank" rel="noopener">💬 Escribir por WhatsApp</a></section>'
      : '<section class="pr-bloque pr-final"><h2>¿Quieres usarla?</h2><p>Pídele el acceso a tu entrenador. Si eres entrenador y quieres llevar a tus clientes aquí, pide tu cuenta a quien te compartió este enlace.</p></section>') +
    '</div>';
}
