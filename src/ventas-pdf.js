// 📄 El PDF de ejemplo para vender: "Ganar músculo desde cero · 12 semanas". HTML para imprimir o guardar en PDF
// (Ventas → El PDF → Imprimir). Es contenido educativo con lo que ya usa la app: proteína por kg, ciclo por fases,
// doble progresión y versión en casa. Se puede cambiar el nombre del autor desde Ventas → Autor.
import { FASES } from './plan12.js';

const h = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tabla = (cab, filas) => '<table><tr>' + cab.map((c) => '<th>' + c + '</th>').join('') + '</tr>' + filas.map((f) => '<tr>' + f.map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table>';
const lista = (xs) => '<ul>' + xs.map((x) => '<li>' + x + '</li>').join('') + '</ul>';

// Rutina de cuerpo completo: [ejercicio en gym, en casa, series × reps]
const DIA_A = [['Sentadilla con barra o goblet', 'Sentadilla búlgara (mochila con peso)', '3 × 6-10'], ['Press plano con mancuernas', 'Flexiones (pies en una silla si es fácil)', '3 × 8-12'],
  ['Remo con mancuerna', 'Remo invertido en la barra baja', '3 × 8-12'], ['Peso muerto rumano', 'Puente de glúteo a una pierna', '2 × 8-12'], ['Plancha', 'Plancha', '3 × 30-45 s']];
const DIA_B = [['Peso muerto (o hip thrust)', 'Zancadas largas con mochila', '3 × 5-8'], ['Press militar con mancuernas', 'Flexiones en pica', '3 × 8-12'],
  ['Jalón al pecho', 'Dominadas (con banda o negativas)', '3 × 6-10'], ['Fondos en paralelas', 'Fondos en paralelas o en silla', '2 × 8-12'], ['Curl de bíceps', 'Curl con mochila', '2 × 10-15']];

export function pdfMusculo(autor = {}) {
  const firma = h(autor.nombre || '[Tu nombre]');
  return '<header><h1>Ganar músculo desde cero</h1><p>Plan de 12 semanas · gym o casa · ' + firma + '</p></header>' +
    '<p><small>Contenido educativo para adultos sanos. No reemplaza el consejo de un médico o nutricionista. Si tienes una lesión o una enfermedad, consulta antes de empezar.</small></p>' +

    '<h2>1. Por qué no ganas músculo (todavía)</h2>' +
    '<p>Casi nunca es el «metabolismo rápido». Son tres cosas, y este plan arregla las tres:</p>' +
    lista(['<b>Comes menos de lo que crees.</b> Un día comes mucho y dos días poco: el promedio de la semana no alcanza.', '<b>Entrenas sin progresar.</b> Mismo peso, mismas reps, mes tras mes: el cuerpo no tiene por qué cambiar.',
      '<b>No le das tiempo.</b> El músculo se gana en meses, no en semanas. Bien hecho, un principiante gana entre 0,5 y 1 kg de músculo al mes.']) +

    '<h2>2. Cuánto comer: calorías y proteína</h2>' +
    '<p><b>Calorías:</b> tu peso × 33 a 35 = lo que gastas al día (si eres activo). Para ganar músculo súmale <b>250 a 350 kcal</b>.</p>' +
    '<p><b>Proteína:</b> entre <b>1,6 y 2,2 g por kg</b> de peso al día, repartida en 3 o 4 comidas.</p>' +
    tabla(['Ejemplo: 65 kg', 'Cálculo', 'Resultado'], [['Gasto diario', '65 × 34', '≈ 2.200 kcal'], ['Para ganar', '2.200 + 300', '≈ 2.500 kcal'], ['Proteína', '65 × 1,8', '≈ 117 g al día']]) +
    '<p><b>¿Cómo sé si voy bien?</b> Pésate 4 mañanas por semana y saca el promedio. Debes subir entre <b>0,25 y 0,5 kg por semana</b>. Si no subes en 2 semanas, suma 150 kcal (un banano y un puñado de maní). Si subes más de 0,5 kg, quita 150.</p>' +

    '<h2>3. Comer más sin sufrir</h2>' +
    lista(['Agrega una comida: un batido de leche, avena, banano y mantequilla de maní (≈ 600 kcal).', 'Carbohidratos en cada comida: arroz, papa, arepa, pasta, plátano.', 'Grasas fáciles: aguacate, maní, aceite de oliva en la ensalada.',
      'Bebe agua entre comidas, no con la comida, si te llenas rápido.', 'Ten siempre a la mano algo listo: yogur, queso, huevos cocidos, frutos secos.']) +
    '<h3>3 menús de ejemplo (≈ 2.500 kcal)</h3>' +
    tabla(['', 'Menú 1', 'Menú 2', 'Menú 3'], [
      ['Desayuno', '3 huevos, 2 arepas, queso, fruta', 'Avena con leche, banano y maní', 'Calentado con huevo, chocolate en leche'],
      ['Almuerzo', 'Arroz, fríjoles, pollo, aguacate', 'Pasta con carne molida y ensalada', 'Arroz, pescado, papa, ensalada'],
      ['Algo', 'Batido de 600 kcal', 'Yogur griego con granola', 'Sándwich de atún y fruta'],
      ['Cena', 'Papa, carne de res, verduras', 'Arepa, pollo desmechado, queso', 'Tortilla de 3 huevos con arroz']]) +
    '<p><b>Lista de mercado base:</b> huevos, pollo, carne molida, atún, leche, yogur, queso, avena, arroz, pasta, papa, arepas, fríjoles, banano, aguacate, maní, aceite de oliva, verduras de temporada.</p>' +

    '<h2>4. La rutina: cuerpo completo, 3 días</h2>' +
    '<p>Alterna el día A y el B (lunes A, miércoles B, viernes A; la semana siguiente empieza con B). Descansa 2 a 3 min en los básicos y 90 s en el resto.</p>' +
    '<h3>Día A</h3>' + tabla(['Gym', 'En casa', 'Series × reps'], DIA_A) +
    '<h3>Día B</h3>' + tabla(['Gym', 'En casa', 'Series × reps'], DIA_B) +
    '<p><b>Calienta 8 minutos:</b> 5 min de bici o caminata rápida y 2 series ligeras del primer ejercicio (50 % y 70 % del peso del día).</p>' +

    '<h2>5. Cómo progresar: la doble progresión</h2>' +
    '<p>Cada ejercicio tiene un rango (por ejemplo 8-12). Empieza con un peso con el que hagas 8 en todas las series. Cada entreno intenta 1 rep más. <b>Cuando llegues a 12 en todas, sube el peso</b> 2,5 a 5 % y vuelve a 8.</p>' +
    tabla(['Semana', 'Peso', 'Reps (3 series)'], [['1', '20 kg', '8 · 8 · 8'], ['2', '20 kg', '10 · 9 · 9'], ['3', '20 kg', '12 · 12 · 11'], ['4', '20 kg', '12 · 12 · 12 ✓'], ['5', '22,5 kg', '8 · 8 · 8']]) +
    '<p><b>RIR</b> = reps en reserva: las que te quedarían limpias al terminar la serie. RIR 2 es parar cuando aún podrías hacer 2 más. Al empezar trabaja con RIR 2-3; nunca vayas al fallo en los básicos.</p>' +

    '<h2>6. El plan de 12 semanas</h2>' +
    tabla(['Semanas', 'Fase', 'RIR', 'Qué hacer'], FASES.map((f) => [f.desde === f.hasta ? f.desde : f.desde + '–' + f.hasta, '<b>' + h(f.nombre) + '</b>', h(f.rir), h(f.gym)])) +
    '<p>La descarga de la semana 9 <b>no es perder el tiempo</b>: la fatiga baja más rápido que lo que ganaste, y vuelves más fuerte (supercompensación). Las semanas 1, 4, 8 y 12, pésate, mide la cintura y anota tu peso en sentadilla y press.</p>' +

    '<h2>7. Descanso: donde de verdad creces</h2>' +
    lista(['Duerme 7 a 9 horas. Con menos de 6, el plan rinde la mitad.', 'Un día de descanso entre entrenos de cuerpo completo.', 'Camina 6.000 a 8.000 pasos al día: ayuda a recuperar y al apetito.',
      'La creatina (3-5 g al día, todos los días) es el único suplemento con evidencia fuerte para ganar fuerza y músculo. La proteína en polvo es comida, no magia.']) +

    '<h2>8. Errores típicos y qué hacer si no subes</h2>' +
    tabla(['Si pasa esto…', 'Haz esto'], [['No subo de peso en 2 semanas', 'Suma 150 kcal al día (una comida extra pequeña)'], ['Subo pero solo barriga', 'Quita 150 kcal y revisa que llegues a la proteína'],
      ['Me estanco 2 semanas en un ejercicio', 'Baja 10 % el peso y vuelve a subir con la doble progresión'], ['Me duele una articulación', 'Cambia el ejercicio por su versión en casa y consulta si sigue'],
      ['No tengo tiempo un día', 'Haz solo los 2 primeros ejercicios: es mejor que nada']]) +

    '<h2>9. Preguntas frecuentes</h2>' +
    '<p><b>¿Puedo entrenar 5 días?</b> Al empezar, 3 días bien hechos ganan a 5 días a medias. A los 6 meses puedes pasar a 4 (torso / pierna).</p>' +
    '<p><b>¿Tengo que comer pollo con arroz?</b> No. Cuenta el total del día: come lo que te guste dentro de tus calorías y tu proteína.</p>' +
    '<p><b>¿Cardio?</b> Sí, 2 veces por semana 20 minutos suave. Mejora tu recuperación y no te quita músculo.</p>' +

    '<h2>10. Tus hojas de registro</h2>' +
    '<h3>Entrenos</h3>' + tabla(['Fecha', 'Ejercicio', 'Peso', 'Reps serie 1', 'Serie 2', 'Serie 3', 'RIR'], Array.from({ length: 8 }, () => ['', '', '', '', '', '', ''])) +
    '<h3>Peso de la mañana</h3>' + tabla(['Semana', 'Lun', 'Mar', 'Mié', 'Jue', 'Promedio', 'Cintura'], Array.from({ length: 12 }, (_, i) => [String(i + 1), '', '', '', '', '', ''])) +
    '<p style="margin-top:18pt"><b>¿Quieres que alguien te arme el plan y lo ajuste cada semana?</b> Escríbele a ' + firma + ' y pregunta por el plan con entrenador en la app.</p>';
}

export const PDFS = { musculo: pdfMusculo };
