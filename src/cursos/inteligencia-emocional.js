// Inteligencia emocional: reconocer, entender y manejar las emociones propias y ajenas. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const ENTENDER = {
  titulo: 'Qué es y qué son las emociones',
  objetivo: 'Saber qué es la inteligencia emocional según la investigación (y qué se exagera), para qué sirven las emociones y cómo reconocer con precisión lo que sientes.',
  fuentes: [
    ['Salovey, P. y Mayer, J. D. (1990). Emotional intelligence. Imagination, Cognition and Personality, 9(3), 185-211.', 'El artículo que propuso el concepto.'],
    ['Mayer, J. D. y Salovey, P. (1997). What is emotional intelligence? En P. Salovey y D. J. Sluyter (Eds.), Emotional Development and Emotional Intelligence (pp. 3-31). Basic Books.', 'El modelo de las cuatro habilidades.'],
    ['Goleman, D. (1995). Emotional Intelligence. Bantam Books. (En español: Inteligencia emocional, Kairós).', 'El libro que hizo famoso el tema.'],
    ['Mayer, J. D., Salovey, P. y Caruso, D. R. (2008). Emotional intelligence: New ability or eclectic traits? American Psychologist, 63(6), 503-517.', 'La diferencia entre la inteligencia emocional como habilidad y como mezcla de rasgos.'],
    ['Joseph, D. L. y Newman, D. A. (2010). Emotional intelligence: An integrative meta-analysis and cascading model. Journal of Applied Psychology, 95(1), 54-78.', 'Qué tanto predice de verdad el desempeño laboral.'],
    ['Ekman, P. (1992). An argument for basic emotions. Cognition and Emotion, 6(3-4), 169-200.', 'La teoría de las emociones básicas.'],
    ['Barrett, L. F. (2017). How Emotions Are Made: The secret life of the brain. Houghton Mifflin Harcourt. (En español: La vida secreta del cerebro).', 'La teoría de las emociones construidas.'],
    ['Lieberman, M. D. et al. (2007). Putting feelings into words: Affect labeling disrupts amygdala activity in response to affective stimuli. Psychological Science, 18(5), 421-428.', 'Ponerle nombre a lo que sientes baja la reacción emocional.'],
    ['Kashdan, T. B., Barrett, L. F. y McKnight, P. E. (2015). Unpacking emotion differentiation: Transforming unpleasant experience by perceiving distinctions in negativity. Current Directions in Psychological Science, 24(1), 10-16.', 'Distinguir con precisión las emociones ayuda a manejarlas.'],
    ['Willcox, G. (1982). The Feeling Wheel: A tool for expanding awareness of emotions and increasing spontaneity and intimacy. Transactional Analysis Journal, 12(4), 274-276.', 'La rueda de las emociones.'],
  ],
  lecciones: [
    l('Qué es (y qué no es) la inteligencia emocional', 10, {
      idea: 'La inteligencia emocional es la capacidad de percibir, entender y manejar las emociones propias y ajenas. Es útil y se puede entrenar, pero no es "más importante que el coeficiente intelectual" ni una medida de qué tan buena persona eres.',
      bloques: [
        ['El origen', [
          'Peter Salovey y John Mayer propusieron el concepto en 1990, como una habilidad para razonar con las emociones.',
          'Su modelo tiene cuatro habilidades: percibir emociones (en ti, en caras y voces), usarlas para pensar, entenderlas (de dónde vienen y cómo cambian) y manejarlas.',
          'Daniel Goleman lo hizo famoso en 1995 con un libro que mezcló esa idea con rasgos como la motivación, el optimismo y las habilidades sociales.',
        ]],
        ['Habilidad o rasgo', [
          'Mayer, Salovey y Caruso (2008) diferencian la inteligencia emocional como habilidad (se mide con problemas que tienen respuestas mejores y peores) de los modelos "mixtos" que se miden con cuestionarios de cómo te ves a ti mismo.',
          'Los cuestionarios de autopercepción se parecen mucho a la personalidad: miden más cómo te ves que lo que de verdad haces.',
          'Por eso los test de revista ("¿qué tan emocionalmente inteligente eres?") dicen poco.',
        ]],
        ['Lo que sí predice', [
          'Un metaanálisis de Joseph y Newman (2010) encontró que la inteligencia emocional predice algo del desempeño laboral, sobre todo en trabajos con mucha carga emocional (atención al cliente, salud, ventas).',
          'Ese aporte es moderado y en parte se explica por la personalidad y la inteligencia general.',
          'Lo práctico: las habilidades concretas (nombrar lo que sientes, calmarte, escuchar) sí se pueden practicar y ayudan en la vida diaria.',
        ]],
      ],
      ejemplos: [
        'En un partido el árbitro pita una falta injusta. Percibir: notas el calor en la cara y que estás a punto de gritar. Entender: es rabia por injusticia y por cansancio. Manejar: respiras, te alejas dos pasos y le pides al capitán que hable. Eso es inteligencia emocional en acción.',
        'Notas que tu compañera de trabajo está más callada que de costumbre y con los ojos rojos. Percibes la emoción, no la ignoras y le preguntas en privado si está bien. Es la misma habilidad, aplicada a otra persona.',
      ],
      practica: [
        'Escribe una situación de esta semana donde una emoción te ganó y describe las cuatro habilidades: qué percibiste, cómo la usaste, qué entendiste y cómo la manejaste (o no).',
        'Escoge una de las cuatro habilidades que sientas más débil.',
        'Hoy, en una conversación, fíjate en la emoción de la otra persona (cara, voz) antes de responder.',
      ],
      pregunta: '¿Cuál de las cuatro habilidades emocionales me cuesta más: percibir, usar, entender o manejar?',
      nota: 'Se repite que "la inteligencia emocional importa más que el coeficiente intelectual" o que "explica el 80 % del éxito". El libro de Goleman sugería que podía importar tanto o más, pero los estudios muestran que la inteligencia general sigue siendo el mejor predictor del desempeño en muchas tareas, y que la emocional suma un aporte moderado. Tampoco es lo mismo ser "emocionalmente inteligente" que ser buena persona: alguien que entiende muy bien las emociones también puede usarlas para manipular.',
      recordar: [
        ['¿Quiénes propusieron el concepto de inteligencia emocional y cuándo?', 'Peter Salovey y John Mayer, en 1990.'],
        ['¿Cuáles son las cuatro habilidades del modelo de Mayer y Salovey?', 'Percibir emociones, usarlas para pensar, entenderlas y manejarlas.'],
        ['¿Por qué dicen poco los test de revista sobre inteligencia emocional?', 'Porque miden cómo te ves a ti mismo, que se parece a la personalidad, y no lo que de verdad haces.'],
        ['¿Qué encontraron Joseph y Newman sobre el desempeño laboral?', 'Que la inteligencia emocional predice algo, sobre todo en trabajos con mucha carga emocional, pero el aporte es moderado.'],
      ],
      tarjetas: [
        ['Inteligencia emocional (Mayer y Salovey)', 'Percibir, usar, entender y manejar las emociones propias y ajenas.'],
        ['¿Más importante que el CI?', 'No: suma un aporte moderado. La inteligencia general sigue pesando mucho en el desempeño.'],
        ['Habilidad vs. autopercepción', 'Lo que haces con las emociones no es lo mismo que cómo crees que las manejas. Los test de revista miden lo segundo.'],
      ],
    }),
    l('Para qué sirven las emociones', 10, {
      idea: 'Las emociones no son buenas ni malas: son información y preparación del cuerpo para actuar. El miedo te protege, la rabia te avisa de una injusticia, la tristeza te hace pedir apoyo. El problema no es sentirlas, sino lo que haces con ellas.',
      bloques: [
        ['Qué es una emoción', [
          'Una emoción es una respuesta de todo el cuerpo: lo que sientes, cambios físicos (corazón, respiración, tensión), una forma de interpretar la situación y un impulso a actuar.',
          'Paul Ekman propuso un grupo de emociones básicas que se reconocen en casi todas las culturas por la expresión de la cara: alegría, tristeza, miedo, rabia, asco y sorpresa.',
          'Lisa Feldman Barrett propone otra mirada: el cerebro "construye" las emociones combinando las sensaciones del cuerpo con lo que aprendiste y el contexto. Las emociones serían más variadas y menos universales.',
          'El debate sigue abierto, pero ambas miradas coinciden en lo práctico: las emociones tienen una función y se pueden entender y regular.',
        ]],
        ['La función de cada una', [
          'Miedo: te prepara para huir o protegerte de un peligro.',
          'Rabia: te moviliza para defenderte o corregir algo injusto.',
          'Tristeza: te hace bajar el ritmo, procesar una pérdida y pedir apoyo.',
          'Asco: te aleja de lo que te puede enfermar (y, en lo social, de lo que te parece inaceptable).',
          'Alegría: te acerca a lo que te hace bien y a las personas.',
        ]],
        ['Agradables y desagradables, no buenas y malas', [
          'Llamar "negativas" a la tristeza o la rabia hace que las queramos eliminar. Son desagradables, pero útiles.',
          'Una emoción es un problema cuando no corresponde a la situación, es demasiado intensa o dura demasiado, o cuando lo que haces con ella te daña a ti o a otros.',
          'Pregunta útil: "¿Qué me está tratando de decir esta emoción?".',
        ]],
      ],
      ejemplos: [
        'Sientes rabia cada vez que tu cuñado hace chistes sobre tu trabajo. La rabia te está avisando que se está pasando un límite. Útil: decírselo con calma. No útil: explotar en la cena familiar.',
        'Después de que te dejaron sin el ascenso, te sientes triste y sin ganas de salir. Esa tristeza te pide tiempo para procesar y, quizás, hablar con alguien. Taparla con trabajo o con trago solo la aplaza.',
      ],
      practica: [
        'Piensa en una emoción desagradable que sentiste hoy y escribe qué te estaba tratando de decir.',
        'Escribe una situación en la que una emoción "negativa" te ayudó (el miedo te frenó, la rabia te hizo reclamar algo justo).',
        'Cuando sientas una emoción fuerte hoy, nota qué pasa en tu cuerpo: dónde la sientes.',
      ],
      pregunta: '¿Qué emoción trato de evitar siempre, y qué me estará queriendo decir?',
      nota: 'Se repite que "una emoción dura solo 90 segundos si no la alimentas". Sale de un libro de divulgación de una neurocientífica sobre su propia experiencia, no de estudios que lo midan: en la investigación, las emociones duran desde segundos hasta horas o días, según la emoción y lo que hagas con ella. También se habla del "secuestro de la amígdala" (Goleman): es una metáfora útil para la reacción impulsiva, pero la amígdala no es "el centro del miedo" ni actúa sola.',
      recordar: [
        ['¿Qué componentes tiene una emoción?', 'Lo que sientes, cambios en el cuerpo, una forma de interpretar la situación y un impulso a actuar.'],
        ['¿Cuáles son las emociones básicas según Ekman?', 'Alegría, tristeza, miedo, rabia, asco y sorpresa.'],
        ['¿Qué propone Lisa Feldman Barrett?', 'Que el cerebro construye las emociones combinando sensaciones del cuerpo, lo aprendido y el contexto.'],
        ['¿Cuándo una emoción se vuelve un problema?', 'Cuando no corresponde a la situación, es demasiado intensa o dura demasiado, o lo que haces con ella te daña.'],
      ],
      tarjetas: [
        ['Las emociones son información', 'Miedo protege, rabia señala injusticia, tristeza pide apoyo. Pregunta: "¿Qué me está diciendo?"'],
        ['Agradables y desagradables', 'No hay emociones buenas o malas; el problema es la intensidad, la duración o lo que haces con ellas.'],
        ['Ekman vs. Barrett', 'Emociones básicas universales vs. emociones construidas por el cerebro. En lo práctico, ambas se pueden entender y regular.'],
      ],
    }),
    l('Reconocer y nombrar lo que sientes', 10, {
      idea: 'Ponerle nombre preciso a lo que sientes ya es empezar a manejarlo. No es lo mismo "estoy mal" que "estoy frustrado porque me cambiaron el plan a última hora".',
      bloques: [
        ['Nombrarlo calma', [
          'Lieberman y su equipo (2007) mostraron fotos de caras con emociones fuertes a personas en un escáner cerebral.',
          'Cuando las personas le ponían nombre a la emoción ("rabia", "miedo"), la actividad de la amígdala bajaba más que cuando hacían otra tarea con las mismas fotos.',
          'Lo llamaron "etiquetado afectivo": ponerle palabras a lo que sientes ayuda a bajar la intensidad.',
        ]],
        ['Precisión emocional', [
          'Algunas personas distinguen pocas emociones ("bien", "mal", "estresado"); otras distinguen muchas (frustrado, decepcionado, avergonzado, celoso).',
          'Kashdan, Barrett y McKnight (2015) revisaron estudios que muestran que quienes distinguen con más precisión sus emociones desagradables las manejan mejor y recurren menos al trago o a la agresión.',
          'La razón: cada emoción precisa sugiere una acción distinta. "Frustrado" pide cambiar el plan; "decepcionado", hablar con alguien; "cansado", descansar.',
        ]],
        ['Cómo entrenarlo', [
          'Usa una rueda de emociones (como la de Gloria Willcox, 1982): parte de las básicas y va a las más finas.',
          'Pregúntate varias veces al día: "¿Qué estoy sintiendo? ¿Dónde lo siento en el cuerpo? ¿Qué lo disparó?".',
          'Escríbelo en el diario de la app: una línea al final del día con la emoción más fuerte y qué la causó.',
          'Diferencia la emoción del pensamiento: "siento que no me valoran" es un pensamiento; la emoción puede ser tristeza o rabia.',
        ]],
      ],
      ejemplos: [
        'Llegas a la casa diciendo "estoy mamado". Al preguntarte qué sientes exactamente, descubres que es frustración porque tu jefe cambió las prioridades tres veces. Con eso ya sabes qué hacer: pedir una reunión para dejar las prioridades por escrito.',
        'Después de ver las fotos de un amigo en un viaje te sientes "raro". Al nombrarlo, es envidia mezclada con tristeza porque llevas años sin vacaciones. Eso te lleva a abrir una meta de ahorro para tu propio viaje en 💰 Finanzas.',
      ],
      practica: [
        'Tres veces hoy (mañana, tarde y noche), detente y nombra con una palabra precisa lo que sientes.',
        'Busca una rueda de emociones o haz una lista de 20 emociones y léela en voz alta.',
        'Al final del día, escribe en el diario la emoción más fuerte, dónde la sentiste en el cuerpo y qué la causó.',
      ],
      pregunta: '¿Qué palabra uso para casi todo lo que siento ("estresado", "mal", "aburrido"), y qué emociones distintas esconde?',
      nota: 'El estudio de Lieberman es de laboratorio, con fotos y no con problemas de la vida real, y la neuroimagen tiene sus límites. Pero coincide con otros estudios sobre escribir y hablar de las emociones. Ojo: nombrar no es lo mismo que darle vueltas sin fin (rumiar), que empeora el ánimo. Si te cuesta mucho identificar lo que sientes o te sientes desconectado de tus emociones casi siempre, un psicólogo puede ayudarte a trabajarlo.',
      recordar: [
        ['¿Qué es el etiquetado afectivo?', 'Ponerle nombre a lo que sientes, lo que ayuda a bajar la intensidad de la emoción.'],
        ['¿Qué encontró Lieberman al pedir nombrar emociones?', 'Que la actividad de la amígdala bajaba más que al hacer otra tarea con las mismas fotos.'],
        ['¿Por qué ayuda distinguir emociones con precisión?', 'Porque cada emoción precisa sugiere una acción distinta, y quienes distinguen mejor las manejan mejor.'],
        ['¿Qué diferencia hay entre "siento que no me valoran" y una emoción?', 'Lo primero es un pensamiento; la emoción puede ser tristeza o rabia.'],
      ],
      tarjetas: [
        ['Nombrarlo para calmarlo', 'Ponerle nombre preciso a lo que sientes baja la intensidad (etiquetado afectivo, Lieberman 2007).'],
        ['Precisión emocional', '"Frustrado" pide cambiar el plan; "decepcionado", hablar; "cansado", descansar. Más precisión, mejor manejo.'],
        ['Tres preguntas', '¿Qué estoy sintiendo? ¿Dónde lo siento en el cuerpo? ¿Qué lo disparó?'],
      ],
    }),
  ],
};

const MANEJAR = {
  titulo: 'Manejar tus emociones',
  objetivo: 'Usar las estrategias de regulación que funcionan (y dejar las que no), manejar la rabia sin explotar ni rumiar, y cuidar el cuerpo como base de las emociones.',
  fuentes: [
    ['Gross, J. J. (1998). The emerging field of emotion regulation: An integrative review. Review of General Psychology, 2(3), 271-299.', 'El modelo de proceso: dónde se puede intervenir en una emoción.'],
    ['Gross, J. J. y John, O. P. (2003). Individual differences in two emotion regulation processes: Implications for affect, relationships, and well-being. Journal of Personality and Social Psychology, 85(2), 348-362.', 'Reinterpretar frente a reprimir.'],
    ['Webb, T. L., Miles, E. y Sheeran, P. (2012). Dealing with feeling: A meta-analysis of the effectiveness of strategies derived from the process model of emotion regulation. Psychological Bulletin, 138(4), 775-808.', 'Qué estrategias funcionan mejor según cientos de estudios.'],
    ['Bushman, B. J. (2002). Does venting anger feed or extinguish the flame? Catharsis, rumination, distraction, anger, and aggressive responding. Personality and Social Psychology Bulletin, 28(6), 724-731.', 'Desahogar la rabia golpeando no la reduce.'],
    ['Nolen-Hoeksema, S., Wisco, B. E. y Lyubomirsky, S. (2008). Rethinking rumination. Perspectives on Psychological Science, 3(5), 400-424.', 'Darle vueltas a lo que sientes empeora el ánimo.'],
    ['Kross, E. et al. (2014). Self-talk as a regulatory mechanism: How you do it matters. Journal of Personality and Social Psychology, 106(2), 304-324.', 'Hablarte en tercera persona ayuda a tomar distancia.'],
    ['Walker, M. P. y van der Helm, E. (2009). Overnight therapy? The role of sleep in emotional brain processing. Psychological Bulletin, 135(5), 731-748.', 'El sueño y la regulación emocional.'],
    ['Schuch, F. B. et al. (2018). Physical activity and incident depression: A meta-analysis of prospective cohort studies. American Journal of Psychiatry, 175(7), 631-648.', 'Las personas más activas tienen menos riesgo de depresión.'],
    ['Balban, M. Y. et al. (2023). Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine, 4(1), 100895.', 'Cinco minutos de respiración con exhalación larga mejoraron el ánimo.'],
    ['Pennebaker, J. W. y Beall, S. K. (1986). Confronting a traumatic event: Toward an understanding of inhibition and disease. Journal of Abnormal Psychology, 95(3), 274-281.', 'Escribir sobre lo que sientes tiene beneficios.'],
  ],
  lecciones: [
    l('Estrategias que funcionan y las que no', 11, {
      idea: 'Hay muchas formas de manejar una emoción y no todas sirven igual. Cambiar cómo interpretas la situación suele funcionar; tragarte la emoción y poner cara de nada suele salir caro.',
      bloques: [
        ['Dónde se puede intervenir', [
          'James Gross (1998) describió que una emoción se puede regular en distintos momentos: escogiendo la situación, cambiándola, moviendo la atención, cambiando cómo la interpretas o cambiando tu respuesta.',
          'Mientras antes intervengas, más fácil: evitar la discusión a las 11 p. m. cuando ambos están cansados es más fácil que calmarte en medio de ella.',
          'No existe una sola estrategia correcta: depende de la situación.',
        ]],
        ['Reinterpretar', [
          'Reinterpretar es cambiar el significado que le das a lo que pasó: "no me contestó porque está ocupado", en vez de "me está ignorando".',
          'Gross y John (2003) encontraron que quienes usan más la reinterpretación tienden a tener más emociones agradables, mejores relaciones y más bienestar.',
          'Un metaanálisis de Webb, Miles y Sheeran (2012) confirmó que la reinterpretación funciona, sobre todo cuando cambias cómo ves la situación (no solo te dices "no importa").',
        ]],
        ['Reprimir la expresión', [
          'Reprimir es sentir la emoción por dentro pero no mostrarla: poner cara de nada.',
          'En los mismos estudios, reprimir no bajó lo que se sentía, subió la activación del cuerpo y empeoró las relaciones (la otra persona te nota distante).',
          'A veces es necesario (no vas a llorar en la mitad de una negociación), pero como estrategia habitual sale caro.',
          'Distraerse funciona a corto plazo, sobre todo con emociones muy intensas, pero no resuelve lo que la causó.',
        ]],
      ],
      ejemplos: [
        'Un carro se te atraviesa en la moto. Primera reacción: rabia y ganas de pitarle y gritarle. Reinterpretas: "Quizás no me vio, o va para urgencias". La rabia baja y no te arriesgas a una pelea en la vía.',
        'Tu jefe te critica delante de todos y tú pones cara de piedra, aunque por dentro estás que hierves. Te aguantaste, pero llegas a la casa tenso y contestas mal. Mejor: respirar en el momento y, después, pedir hablar con él en privado.',
      ],
      practica: [
        'Piensa en algo que te dio rabia o tristeza esta semana y escribe dos interpretaciones distintas de lo que pasó.',
        'Identifica una situación que se repite y te altera, y escribe cómo podrías evitarla o cambiarla antes de que empiece.',
        'Nota hoy cuándo pones "cara de nada" y qué estabas sintiendo por dentro.',
      ],
      pregunta: '¿Qué emoción me trago siempre en lugar de entenderla o expresarla bien?',
      nota: 'Reinterpretar no es mentirte ni "pensar positivo" a la fuerza: es buscar una explicación realista que también sea posible. Si la situación de verdad es injusta o peligrosa, la emoción tiene razón y lo que toca es actuar, no reinterpretarla. Y "pensar positivo" todo el tiempo tampoco es sano: forzarse a estar bien puede hacer sentir peor.',
      recordar: [
        ['¿En qué momentos se puede regular una emoción según Gross?', 'Escogiendo la situación, cambiándola, moviendo la atención, cambiando la interpretación o cambiando la respuesta.'],
        ['¿Qué es reinterpretar?', 'Cambiar el significado que le das a lo que pasó.'],
        ['¿Qué efectos tiene reprimir la expresión de una emoción?', 'No baja lo que sientes, sube la activación del cuerpo y empeora las relaciones.'],
        ['¿Para qué sirve distraerse?', 'Para bajar emociones muy intensas a corto plazo, aunque no resuelve lo que las causó.'],
      ],
      tarjetas: [
        ['Reinterpretar (Gross y John, 2003)', 'Cambiar el significado de lo que pasó por otro realista. Se asocia con más bienestar.'],
        ['Reprimir sale caro', 'Poner cara de nada no baja lo que sientes, tensa el cuerpo y aleja a los demás.'],
        ['Intervenir temprano', 'Es más fácil evitar o cambiar la situación que calmarte en la mitad de la emoción.'],
      ],
    }),
    l('Rabia, rumiación y el mito del desahogo', 10, {
      idea: 'Golpear una almohada o "sacar la rabia" gritando no la reduce: la alimenta. Darle vueltas a lo que pasó tampoco ayuda. Lo que funciona es bajar la activación y tomar distancia.',
      bloques: [
        ['El mito del desahogo', [
          'Brad Bushman (2002) hizo enojar a unas personas y luego les pidió golpear un saco pensando en quien las ofendió, golpearlo pensando en hacer ejercicio, o quedarse quietas.',
          'Las que golpearon pensando en la persona terminaron más enojadas y más agresivas que las que no hicieron nada.',
          'La idea de "descargar la rabia" (catarsis) no tiene respaldo: practicar la agresión la entrena.',
          'Lo que baja la rabia son actividades que bajan la activación: respirar lento, caminar tranquilo, contar, esperar.',
        ]],
        ['Rumiar', [
          'Rumiar es darle vueltas una y otra vez a lo que pasó, a por qué te sientes así y a lo que debiste haber dicho.',
          'Nolen-Hoeksema y otros (2008) revisaron décadas de estudios: rumiar mantiene y empeora la tristeza y la rabia, y se asocia con depresión y ansiedad.',
          'Reflexionar es distinto: es breve, concreto y termina en una acción. Rumiar da vueltas sin llegar a ninguna parte.',
        ]],
        ['Tomar distancia', [
          'Ethan Kross ha estudiado el "distanciamiento": mirar la situación como si fueras un observador.',
          'Kross y otros (2014) encontraron que hablarte en tercera persona o por tu nombre ("Diego, ¿por qué estás tan bravo?") ayudó a manejar mejor el estrés que hablarte en primera persona.',
          'Otras formas: imaginar cómo verás esto en un año, o qué le aconsejarías a un amigo en la misma situación.',
        ]],
      ],
      ejemplos: [
        'Después de una discusión fuerte con tu hermano, te vas a dar golpes al saco del gym "para sacarte la rabia" mientras repites lo que te dijo. Sales igual o más bravo. Mejor: caminar 15 minutos sin pensar en la discusión y hablar al otro día.',
        'Llevas toda la noche dándole vueltas a lo que te dijo tu ex. Te preguntas, en tercera persona: "¿Qué le dirías a un amigo que está igual?". Respondes: "Que ya pasó, que duerma y que mañana decida si le escribe". Te calmas lo suficiente para dormir.',
      ],
      practica: [
        'Cuando sientas rabia hoy, antes de responder respira lento 5 veces y espera al menos 10 minutos.',
        'Si te descubres rumiando, pon un límite: 10 minutos para pensar en eso y escribir una acción concreta, y luego cambia de actividad.',
        'Escribe sobre algo que te tiene alterado hablándote en tercera persona o por tu nombre.',
      ],
      pregunta: '¿Qué hago cuando tengo rabia, y me calma o me alimenta más?',
      nota: 'Hacer ejercicio sí ayuda al ánimo en general, pero hacerlo "para sacar la rabia" mientras piensas en quien te enojó puede mantenerla viva. Expresar la rabia con palabras, con calma y a la persona indicada, sí puede ser útil para resolver el problema: lo que no funciona es la descarga agresiva. Si la rabia te lleva a golpear, romper cosas o hacer daño, o te arrepientes seguido de cómo reaccionas, busca ayuda profesional.',
      recordar: [
        ['¿Qué encontró Bushman sobre golpear un saco para desahogar la rabia?', 'Que quienes golpearon pensando en quien los ofendió terminaron más enojados y agresivos.'],
        ['¿Qué baja la rabia de verdad?', 'Actividades que bajan la activación: respirar lento, caminar tranquilo, esperar.'],
        ['¿Qué diferencia hay entre rumiar y reflexionar?', 'Rumiar da vueltas sin llegar a nada y empeora el ánimo; reflexionar es breve, concreto y termina en una acción.'],
        ['¿Qué es el distanciamiento según Kross?', 'Mirar la situación como un observador, por ejemplo hablándote en tercera persona o por tu nombre.'],
      ],
      tarjetas: [
        ['El mito del desahogo (Bushman, 2002)', 'Golpear o gritar para "sacar la rabia" la alimenta. Baja la activación: respira, camina, espera.'],
        ['Rumiar vs. reflexionar', 'Rumiar da vueltas y empeora el ánimo. Reflexionar es breve y termina en una acción.'],
        ['Hablarte por tu nombre (Kross)', '"Diego, ¿qué está pasando?" ayuda a tomar distancia y pensar con más calma.'],
      ],
    }),
    l('El cuerpo: sueño, movimiento, respiración y escritura', 11, {
      idea: 'Las emociones se manejan también desde el cuerpo. Dormir mal te vuelve más reactivo, moverte protege el ánimo, respirar lento baja la activación y escribir lo que sientes ayuda a ordenarlo.',
      bloques: [
        ['El sueño', [
          'Walker y van der Helm (2009) revisaron estudios que muestran que el sueño ayuda a procesar las experiencias emocionales.',
          'En un estudio de su grupo, personas privadas de una noche de sueño reaccionaron mucho más fuerte a imágenes desagradables, con menos control de la parte frontal del cerebro.',
          'En la práctica: cuando duermes mal, todo te afecta más. Ese no es el día para decisiones ni conversaciones difíciles.',
        ]],
        ['El movimiento', [
          'Un metaanálisis de Schuch y otros (2018) con estudios que siguieron a muchas personas durante años encontró que las más activas tenían menos riesgo de desarrollar depresión.',
          'No hace falta un entrenamiento extremo: caminar con regularidad ya cuenta.',
          'El gym, el fútbol y la caminata no son solo para el cuerpo: también son parte de tu salud emocional.',
        ]],
        ['La respiración', [
          'Respirar lento, con la exhalación más larga que la inhalación, ayuda a bajar la activación del cuerpo.',
          'Balban y otros (2023) compararon varias técnicas de respiración de 5 minutos diarios con meditación: el "suspiro cíclico" (dos inhalaciones seguidas por la nariz y una exhalación larga por la boca) fue el que más mejoró el ánimo.',
          'Úsalo antes de una conversación difícil, en un trancón o cuando te despiertas con ansiedad.',
        ]],
        ['Escribir', [
          'James Pennebaker encontró en los años ochenta que escribir durante varios días sobre experiencias difíciles, con pensamientos y emociones, tenía beneficios para el ánimo y la salud.',
          'Se escribe 15 a 20 minutos, sin preocuparse por la ortografía, solo para ti.',
          'El diario de la app sirve para esto: unas líneas sobre lo que sentiste y por qué.',
        ]],
      ],
      ejemplos: [
        'Dormiste 4 horas por el bebé y en la mañana le contestas feo a tu pareja por una bobada. Al darte cuenta, le dices: "Perdón, dormí fatal y ando irritable; hablemos de eso más tarde".',
        'Antes de entrar a la reunión donde vas a pedir un aumento, sientes el corazón acelerado. Haces tres suspiros cíclicos en el baño y entras más tranquilo.',
      ],
      practica: [
        'Haz hoy 5 minutos de suspiro cíclico: dos inhalaciones por la nariz y una exhalación larga por la boca.',
        'Revisa cómo dormiste las últimas noches y fíjate si coincide con los días en que estuviste más irritable.',
        'Escribe 15 minutos en el diario sobre algo que te tiene preocupado: qué pasó, qué sientes y por qué.',
      ],
      pregunta: '¿Cómo cambia mi ánimo cuando duermo mal o dejo de moverme?',
      nota: 'El estudio de la respiración (Balban y otros, 2023) fue pequeño y de un mes, así que es una pista prometedora, no una cura. La relación entre ejercicio y menos depresión viene en buena parte de estudios de observación, aunque hay ensayos que también muestran beneficios. Y la escritura expresiva tiene efectos promedio modestos, mejores en unas personas que en otras. Ninguna de estas herramientas reemplaza la ayuda profesional si tienes depresión o ansiedad: si llevas más de dos semanas con tristeza, falta de energía o pérdida de interés casi todos los días, consulta. Si piensas en hacerte daño, llama al 123 o ve a urgencias.',
      recordar: [
        ['¿Qué pasa con las emociones cuando duermes mal?', 'Reaccionas mucho más fuerte a lo desagradable y tienes menos control.'],
        ['¿Qué encontró el metaanálisis de Schuch sobre la actividad física?', 'Que las personas más activas tenían menos riesgo de desarrollar depresión.'],
        ['¿Qué es el suspiro cíclico?', 'Dos inhalaciones seguidas por la nariz y una exhalación larga por la boca.'],
        ['¿Qué propuso Pennebaker?', 'Escribir 15 a 20 minutos durante varios días sobre experiencias difíciles, con pensamientos y emociones.'],
      ],
      tarjetas: [
        ['Sueño y emociones', 'Dormir mal te vuelve más reactivo. Ese día, nada de decisiones ni conversaciones difíciles.'],
        ['Suspiro cíclico', 'Dos inhalaciones por la nariz y una exhalación larga por la boca, unos minutos. Baja la activación.'],
        ['Escritura expresiva (Pennebaker)', '15-20 minutos escribiendo lo que sientes y por qué, solo para ti.'],
      ],
    }),
  ],
};

const DEMAS = {
  titulo: 'Emociones con los demás',
  objetivo: 'Entender lo que sienten los otros sin ahogarte en ello, cuidar el clima emocional de tus relaciones y usar la inteligencia emocional en el trabajo y la familia, sabiendo cuándo pedir ayuda.',
  fuentes: [
    ['Singer, T. y Klimecki, O. M. (2014). Empathy and compassion. Current Biology, 24(18), R875-R878.', 'La diferencia entre el malestar empático y la compasión.'],
    ['Bloom, P. (2016). Against Empathy: The case for rational compassion. Ecco. (En español: Contra la empatía).', 'Los límites y sesgos de la empatía.'],
    ['Hickok, G. (2014). The Myth of Mirror Neurons: The real neuroscience of communication and cognition. W. W. Norton.', 'Lo que se exagera sobre las "neuronas espejo".'],
    ['Hatfield, E., Cacioppo, J. T. y Rapson, R. L. (1993). Emotional contagion. Current Directions in Psychological Science, 2(3), 96-100.', 'Cómo se contagian las emociones entre personas.'],
    ['Gable, S. L., Reis, H. T., Impett, E. A. y Asher, E. R. (2004). What do you do when things go right? The intrapersonal and interpersonal benefits of sharing positive events. Journal of Personality and Social Psychology, 87(2), 228-245.', 'Cómo responder a las buenas noticias de otros fortalece la relación.'],
    ['Kramer, A. D. I., Guillory, J. E. y Hancock, J. T. (2014). Experimental evidence of massive-scale emotional contagion through social networks. Proceedings of the National Academy of Sciences, 111(24), 8788-8790.', 'El experimento de Facebook sobre contagio emocional (efecto muy pequeño).'],
    ['Hochschild, A. R. (1983). The Managed Heart: Commercialization of human feeling. University of California Press.', 'El trabajo emocional: mostrar emociones como parte del empleo.'],
    ['Mattingly, V. y Kraiger, K. (2019). Can emotional intelligence be trained? A meta-analytical investigation. Human Resource Management Review, 29(2), 140-155.', 'Los entrenamientos en inteligencia emocional tienen efectos moderados.'],
    ['Gottman, J. M. (1997). Raising an Emotionally Intelligent Child. Simon & Schuster. (En español: Los secretos de la educación emocional de los niños).', 'Acompañar las emociones de los hijos.'],
  ],
  lecciones: [
    l('Empatía y compasión', 10, {
      idea: 'Empatía es entender y sentir lo que siente otro. Es valiosa, pero tiene trampas: puede agotarte y se inclina hacia los que se parecen a ti. La compasión (querer ayudar sin hundirte) es más sostenible.',
      bloques: [
        ['Dos empatías', [
          'Empatía cognitiva: entender lo que el otro piensa y siente ("me imagino que estás preocupado por la plata").',
          'Empatía emocional: sentir algo parecido a lo que siente ("me duele verte así").',
          'Se pueden tener por separado: un vendedor manipulador puede entender muy bien lo que sientes sin sentir nada por ti.',
        ]],
        ['Empatía vs. compasión', [
          'Tania Singer y Olga Klimecki (2014) distinguen el malestar empático (sentir el dolor del otro hasta angustiarte) de la compasión (sentir calidez y ganas de ayudar).',
          'El malestar empático agota y puede hacer que te alejes; la compasión se asocia con más ganas de ayudar y menos desgaste.',
          'En sus estudios, entrenar la compasión cambió la respuesta de las personas ante el sufrimiento ajeno.',
        ]],
        ['Los límites de la empatía', [
          'Paul Bloom (2016) señala que la empatía es como un reflector: ilumina a una persona concreta y deja a las demás en la sombra.',
          'Sentimos más empatía por quienes se parecen a nosotros, por los cercanos y por los casos con cara y nombre.',
          'Para decisiones justas (en el trabajo, en lo público) conviene combinar la empatía con criterios claros y razonados.',
        ]],
      ],
      ejemplos: [
        'Tu mejor amigo te cuenta que lo echaron del trabajo. Empatía cognitiva: "Me imagino que estás asustado por el arriendo". Compasión: "¿Qué necesitas? ¿Te ayudo a revisar la hoja de vida?". Malestar empático sería quedarte tan angustiado que no puedes ayudar.',
        'Como jefe, sientes mucha empatía por un empleado que te cae bien y pasas por alto sus errores, mientras eres más duro con otro. La empatía te sesgó. Criterios claros para todos corrigen el sesgo.',
      ],
      practica: [
        'En tu próxima conversación con alguien que está pasando por algo difícil, di en voz alta lo que crees que siente y pregunta si es así.',
        'Después, pregúntale qué necesita, en vez de suponerlo.',
        'Piensa en alguien con quien sueles ser menos empático (porque es distinto a ti) y escribe cómo podría estar viendo la situación.',
      ],
      pregunta: '¿Con quién me cuesta sentir empatía, y por qué?',
      nota: 'Se dice que las "neuronas espejo" explican la empatía: neuronas que se activan igual cuando haces algo y cuando ves a otro hacerlo. Existen (se encontraron en monos), pero su papel en la empatía y la comprensión humana se ha exagerado mucho (Hickok, 2014). Si trabajas cuidando a otros (salud, docencia, atención a víctimas) y te sientes agotado o insensible, puede ser desgaste por empatía: habla con un profesional y cuida tus descansos.',
      recordar: [
        ['¿Qué diferencia hay entre empatía cognitiva y emocional?', 'La cognitiva es entender lo que el otro siente; la emocional es sentir algo parecido.'],
        ['¿Qué diferencia hay entre malestar empático y compasión según Singer y Klimecki?', 'El malestar empático angustia y agota; la compasión es calidez y ganas de ayudar, y es más sostenible.'],
        ['¿Qué límite de la empatía señala Bloom?', 'Que es como un reflector: favorece a los cercanos, a los parecidos y a los casos con nombre.'],
        ['¿Qué se exagera sobre las neuronas espejo?', 'Su papel en la empatía humana: existen, pero no explican por sí solas la comprensión de los demás.'],
      ],
      tarjetas: [
        ['Empatía cognitiva y emocional', 'Entender lo que siente el otro vs. sentir algo parecido. Se pueden tener por separado.'],
        ['Compasión > malestar empático (Singer y Klimecki)', 'Sentir calidez y ganas de ayudar agota menos que hundirte en el dolor del otro.'],
        ['El reflector de la empatía (Bloom)', 'Favorece a los cercanos y parecidos. Para decidir con justicia, súmale criterios claros.'],
      ],
    }),
    l('Contagio emocional y celebrar con otros', 10, {
      idea: 'Las emociones se pegan: el mal genio de uno puede dañar la reunión y la calma de otro puede bajar la tensión. Y cómo respondes a las buenas noticias de los demás pesa tanto como cómo los apoyas en las malas.',
      bloques: [
        ['El contagio emocional', [
          'Hatfield, Cacioppo y Rapson (1993) describieron que tendemos a imitar sin darnos cuenta las expresiones, la voz y la postura de los demás, y eso nos lleva a sentir algo parecido.',
          'Por eso el estrés del jefe se siente en toda la oficina, y la alegría en un cumpleaños se contagia.',
          'Tú también contagias: tu tono al llegar a la casa cambia el clima de todos.',
        ]],
        ['Cuidar el clima', [
          'Antes de entrar a una reunión o a la casa, nota con qué emoción vas a llegar.',
          'Si vienes cargado, dilo ("vengo de un día pesado, necesito 15 minutos") en vez de descargarlo en otros.',
          'Rodéate en lo posible de personas que te hacen bien, y pon distancia con quien te carga siempre.',
        ]],
        ['Celebrar las buenas noticias', [
          'Shelly Gable y su equipo (2004) estudiaron cómo respondemos cuando alguien nos cuenta algo bueno.',
          'Respuesta activa y constructiva: entusiasmo y preguntas ("¡qué bien! ¿cómo te enteraste? ¿qué vas a hacer?").',
          'Pasiva ("ah, qué bien") o destructiva ("¿y te va a tocar trabajar más?"), o ignorarla y hablar de ti.',
          'Solo la activa y constructiva se asoció con más satisfacción y confianza en la relación.',
        ]],
      ],
      ejemplos: [
        'Tu pareja llega feliz porque le aprobaron un curso que quería. Respuesta pasiva: "Ah, bacano" mientras miras el celular. Activa y constructiva: dejas el celular y le dices "¡qué chimba! ¿cuándo empiezas? ¿qué es lo que más te emociona?". La segunda fortalece la relación.',
        'Llegas a entrenar a tu equipo de fútbol con rabia por un problema del trabajo. Sin darte cuenta, gritas más y el ambiente se pone pesado. La próxima vez, antes de llegar, tomas cinco minutos en el carro para respirar y dejar el trabajo atrás.',
      ],
      practica: [
        'Hoy, cuando alguien te cuente algo bueno, responde con entusiasmo y al menos dos preguntas.',
        'Antes de llegar a la casa, nota con qué emoción vas y decide cómo quieres llegar.',
        'Escribe quiénes te suben el ánimo y quiénes te lo bajan casi siempre.',
      ],
      pregunta: '¿Qué emoción suelo contagiar cuando llego a la casa o al trabajo?',
      nota: 'El famoso experimento de Facebook (Kramer y otros, 2014) cambió lo que casi 700.000 personas veían en su muro y encontró un contagio emocional real pero diminuto, y fue muy criticado porque no pidió consentimiento. También se dijo que la felicidad "se contagia hasta tres grados de separación" en las redes de amigos; esos estudios recibieron críticas por problemas de método. El contagio cara a cara está mejor respaldado que el de las redes sociales.',
      recordar: [
        ['¿Qué es el contagio emocional según Hatfield, Cacioppo y Rapson?', 'Imitar sin darnos cuenta las expresiones y la voz de otros, y sentir algo parecido.'],
        ['¿Qué es una respuesta activa y constructiva?', 'Responder a una buena noticia con entusiasmo y preguntas.'],
        ['¿Qué encontró Gable sobre las respuestas a las buenas noticias?', 'Que solo la respuesta activa y constructiva se asoció con más satisfacción y confianza en la relación.'],
        ['¿Qué hacer si llegas cargado emocionalmente?', 'Decirlo y pedir un momento, en vez de descargarlo en los demás.'],
      ],
      tarjetas: [
        ['Contagio emocional', 'Las emociones se pegan por imitación. Nota con qué emoción llegas a la casa o al trabajo.'],
        ['Respuesta activa y constructiva (Gable)', 'Ante una buena noticia: entusiasmo y preguntas. Fortalece la relación más que el apoyo en lo malo.'],
        ['Si vienes cargado', '"Vengo de un día pesado, necesito 15 minutos", en vez de descargarlo en otros.'],
      ],
    }),
    l('En el trabajo, en la familia y cuándo pedir ayuda', 12, {
      idea: 'La inteligencia emocional se nota en lo cotidiano: cómo das una mala noticia, cómo acompañas a un hijo que llora, cómo manejas un cliente bravo. Se puede mejorar con práctica, y saber cuándo pedir ayuda también es parte de ella.',
      bloques: [
        ['En el trabajo', [
          'Arlie Hochschild (1983) llamó "trabajo emocional" a tener que mostrar ciertas emociones como parte del empleo: sonreír al cliente, mantener la calma con el paciente.',
          'Fingir por fuera lo que no sientes por dentro (actuación superficial) desgasta más que tratar de sentirlo de verdad (por ejemplo, reinterpretando la situación del cliente).',
          'Un buen líder nota el estado del equipo, nombra las tensiones y no descarga su estrés en otros.',
          'Dar críticas sobre el trabajo, no sobre la persona, en privado y con un camino para mejorar.',
        ]],
        ['En la familia', [
          'John Gottman (1997) propuso el "entrenamiento emocional" para padres: notar la emoción del hijo, verla como una oportunidad de conectar, escucharla y nombrarla, y luego poner límites y buscar soluciones juntos.',
          'Lo contrario es descartarla ("no llore por bobadas") o castigarla. Con eso el niño aprende a esconder lo que siente, no a manejarlo.',
          'Todas las emociones se aceptan; no todas las conductas: "Entiendo que tengas rabia; no está bien pegarle a tu hermano".',
        ]],
        ['¿Se puede entrenar?', [
          'Un metaanálisis de Mattingly y Kraiger (2019) encontró que los entrenamientos en inteligencia emocional tienen efectos moderados.',
          'Lo que más mejora son habilidades concretas practicadas con regularidad, no charlas motivacionales sueltas.',
          'Como con el gym: no cambia con una sesión, cambia con repeticiones.',
        ]],
        ['Cuándo pedir ayuda', [
          'Si una emoción te desborda seguido, dura semanas o te impide trabajar, dormir o relacionarte.',
          'Si llevas más de dos semanas con tristeza, sin energía o sin interés en casi nada; o con ansiedad que no se va.',
          'Si recurres al trago, las drogas, las apuestas o la comida para calmarte.',
          'Pide cita con psicología en tu EPS o tu caja de compensación. Si piensas en hacerte daño, llama al 123 o ve a urgencias. Pedir ayuda es una decisión emocionalmente inteligente.',
        ]],
      ],
      ejemplos: [
        'Tu hija de 6 años llora porque se le rompió un juguete. En vez de "no llore por eso", te agachas y le dices: "Estás triste porque se rompió tu muñeca, ¿cierto? Es normal. ¿La intentamos arreglar o la guardamos?". Aprende que lo que siente se puede decir y manejar.',
        'Trabajas en un call center y un cliente te grita. En vez de fingir una sonrisa mientras hierves por dentro, piensas: "Lleva tres días sin internet, yo también estaría desesperado". Bajas el tono y le das una solución concreta. Terminas el día menos agotado.',
      ],
      practica: [
        'Escoge una situación de trabajo donde tengas que mostrar una emoción que no sientes y busca una forma realista de verla que te ayude a sentirla.',
        'La próxima vez que alguien de tu familia esté alterado, nombra lo que crees que siente antes de dar soluciones o regaños.',
        'Revisa honestamente la lista de cuándo pedir ayuda y anota si alguna aplica a ti o a alguien cercano.',
      ],
      pregunta: '¿Qué emoción me cuesta acompañar en las personas que quiero, y cómo reacciono cuando la muestran?',
      nota: 'Muchas empresas venden cursos o test de inteligencia emocional como si fueran a transformar a la gente en un día. La evidencia muestra efectos moderados y solo con práctica sostenida. Y la inteligencia emocional no reemplaza el tratamiento de problemas como la depresión, la ansiedad o las adicciones: este curso te da herramientas para la vida diaria, no es terapia.',
      recordar: [
        ['¿Qué es el trabajo emocional según Hochschild?', 'Tener que mostrar ciertas emociones como parte del empleo.'],
        ['¿Qué desgasta más en el trabajo emocional?', 'Fingir por fuera lo que no sientes (actuación superficial), más que intentar sentirlo de verdad.'],
        ['¿Cuáles son los pasos del entrenamiento emocional de Gottman para padres?', 'Notar la emoción, verla como oportunidad de conectar, escucharla y nombrarla, y luego poner límites y buscar soluciones.'],
        ['Nombra dos señales de que conviene pedir ayuda profesional.', 'Emociones que desbordan o duran semanas, más de dos semanas de tristeza o sin interés, o usar trago, drogas o apuestas para calmarse.'],
      ],
      tarjetas: [
        ['Trabajo emocional (Hochschild)', 'Fingir por fuera lo que no sientes desgasta. Buscar una forma realista de sentirlo desgasta menos.'],
        ['Entrenamiento emocional (Gottman)', 'Nota la emoción del hijo, escúchala y nómbrala; luego pon límites y busquen soluciones. Todas las emociones se aceptan; no todas las conductas.'],
        ['Cuándo pedir ayuda', 'Si te desborda o dura semanas, si llevas más de dos semanas triste o sin interés, o si te calmas con trago o apuestas. En crisis: 123.'],
      ],
    }),
  ],
};

export default {
  id: 'inteligencia-emocional',
  nombre: 'Inteligencia emocional',
  area: 'comunicacion',
  icono: '❤️',
  nivel: 'Básico',
  paraQue: 'Reconocer lo que sientes con precisión, manejar la rabia, la tristeza y el estrés con estrategias que funcionan, y acompañar las emociones de los demás sin hundirte. Te sirve en la pareja, la familia y el trabajo, y te ayuda a saber cuándo es momento de pedir ayuda.',
  modulos: [ENTENDER, MANEJAR, DEMAS],
  proyecto: {
    titulo: 'Un mes de diario emocional',
    intro: 'Durante 4 semanas vas a llevar un registro breve de tus emociones y a practicar una estrategia por semana. Al final vas a conocer mejor tus patrones: qué te dispara, cómo reaccionas y qué te funciona.',
    pasos: [
      'Cada noche, escribe en el diario de la app la emoción más fuerte del día con una palabra precisa, dónde la sentiste en el cuerpo y qué la disparó.',
      'Anota también cuántas horas dormiste y si te moviste ese día, para ver la relación con tu ánimo.',
      'Semana 1: practica nombrar tus emociones tres veces al día.',
      'Semana 2: practica reinterpretar dos situaciones que te alteren y anota cómo cambió la emoción.',
      'Semana 3: cuando sientas rabia o ansiedad, usa el suspiro cíclico y háblate por tu nombre antes de responder.',
      'Semana 4: responde de forma activa y constructiva a las buenas noticias de otros y nombra las emociones de alguien cercano antes de aconsejar.',
      'Al terminar, relee el mes y escribe tus tres disparadores más comunes y las dos estrategias que más te sirvieron.',
      'Si notaste emociones que te desbordan o duran semanas, pide una cita con psicología.',
    ],
  },
};
