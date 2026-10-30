// Metacognición: pensar sobre cómo piensas. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const SABER = {
  titulo: 'Saber lo que sabes',
  objetivo: 'Entender qué es la metacognición y medir con más precisión qué sabes y qué no, sin dejarte engañar por la sensación de saber.',
  fuentes: [
    ['Flavell, J. H. (1979). Metacognition and cognitive monitoring: A new area of cognitive-developmental inquiry. American Psychologist, 34(10), 906-911.', 'El artículo que le dio nombre a la metacognición.'],
    ['Nelson, T. O. y Narens, L. (1990). Metamemory: A theoretical framework and new findings. Psychology of Learning and Motivation, 26, 125-173.', 'El modelo de monitorear y controlar.'],
    ['Schraw, G. y Dennison, R. S. (1994). Assessing metacognitive awareness. Contemporary Educational Psychology, 19(4), 460-475.', 'Conocimiento y regulación de la cognición, y cómo medirlos.'],
    ['Nelson, T. O. y Dunlosky, J. (1991). When people’s judgments of learning (JOLs) are extremely accurate at predicting subsequent recall: The “delayed-JOL effect”. Psychological Science, 2(4), 267-270.', 'Juzgar lo aprendido un rato después es mucho más preciso.'],
    ['Kruger, J. y Dunning, D. (1999). Unskilled and unaware of it. Journal of Personality and Social Psychology, 77(6), 1121-1134.', 'El famoso efecto Dunning-Kruger (con sus matices).'],
    ['Moore, D. A. y Healy, P. J. (2008). The trouble with overconfidence. Psychological Review, 115(2), 502-517.', 'Las tres formas distintas de exceso de confianza.'],
    ['Rozenblit, L. y Keil, F. (2002). The misunderstood limits of folk science: An illusion of explanatory depth. Cognitive Science, 26(5), 521-562.', 'Creemos entender cómo funcionan las cosas hasta que intentamos explicarlas.'],
    ['Koriat, A. y Bjork, R. A. (2005). Illusions of competence in monitoring one’s knowledge during study. Journal of Experimental Psychology: Learning, Memory, and Cognition, 31(2), 187-194.', 'Por qué juzgamos mal lo que sabemos mientras estudiamos.'],
  ],
  lecciones: [
    l('Qué es la metacognición', 10, {
      idea: 'Metacognición es pensar sobre tu propio pensamiento: darte cuenta de qué sabes, cómo estás aprendiendo y cambiar de estrategia cuando algo no funciona.',
      bloques: [
        ['El origen de la palabra', [
          'El psicólogo John Flavell (1979) la llamó así al estudiar cómo los niños se dan cuenta (o no) de que no entendieron algo.',
          'La idea es sencilla: además de pensar, puedes observar cómo piensas, como si tuvieras un entrenador mirando el partido desde la tribuna.',
          'Ese entrenador no juega, pero ve lo que el jugador no ve desde la cancha y le dice qué cambiar.',
        ]],
        ['Las dos partes', [
          'Conocimiento: lo que sabes sobre cómo aprendes y piensas. Qué te cuesta, qué estrategias existen y cuándo sirve cada una.',
          'Regulación: lo que haces con ese conocimiento mientras trabajas: planear, revisar sobre la marcha y evaluar al final.',
          'Schraw y Dennison (1994) separaron así estas dos partes y crearon un cuestionario para medirlas.',
          'Puedes saber mucho de estrategias y no usarlas, o usarlas sin pensar si funcionan. Hacen falta las dos.',
        ]],
        ['Monitorear y controlar', [
          'Nelson y Narens (1990) lo resumieron en dos flechas: subir información (monitorear: "¿esto lo entiendo?") y bajar órdenes (controlar: "entonces lo vuelvo a leer despacio").',
          'Si el monitoreo falla, el control también: si crees que ya sabes algo, dejas de estudiarlo justo antes de tiempo.',
          'Por eso buena parte de este curso trata de monitorear mejor: si mides bien, decides bien.',
        ]],
      ],
      ejemplos: [
        'Estás leyendo un contrato de arriendo y te das cuenta de que llevas tres párrafos sin entender nada. Notarlo es monitorear; volver atrás, buscar las palabras que no conoces o preguntarle a alguien es controlar.',
        'En el gym notas que una sentadilla te sale "rara" y decides grabarte para ver la técnica. Esa pausa para mirar cómo lo estás haciendo es metacognición aplicada al cuerpo.',
      ],
      practica: [
        'Durante tu próxima lectura, para cada 5 minutos y pregúntate: "¿qué acabo de entender? ¿lo podría explicar?".',
        'Escribe una lista de 3 cosas que se te facilitan aprender y 3 que se te dificultan.',
        'Elige una estrategia de Aprender a aprender (recordar sin mirar, espaciar, intercalar) y escribe cuándo la vas a usar esta semana.',
      ],
      pregunta: '¿En qué parte de mi vida actúo en piloto automático sin preguntarme si lo que hago está funcionando?',
      nota: 'Se suele citar que enseñar metacognición da "7 meses extra de progreso" en el colegio (Education Endowment Foundation). Es un promedio de muchos estudios con niños y adolescentes, con resultados muy distintos entre ellos: indica que vale la pena, no una ganancia garantizada para todos.',
      recordar: [
        ['¿Qué es la metacognición, en una frase?', 'Pensar sobre tu propio pensamiento: darte cuenta de cómo aprendes y piensas, y ajustar lo que haces.'],
        ['¿Cuáles son las dos partes de la metacognición?', 'El conocimiento (qué sabes de cómo aprendes) y la regulación (planear, revisar y evaluar mientras trabajas).'],
        ['¿Qué son monitorear y controlar en el modelo de Nelson y Narens?', 'Monitorear es observar lo que pasa en tu mente; controlar es decidir qué hacer con eso.'],
        ['¿Por qué un mal monitoreo lleva a malas decisiones?', 'Porque si crees que ya sabes algo, dejas de estudiarlo antes de tiempo.'],
      ],
      tarjetas: [
        ['¿Qué es la metacognición?', 'Pensar sobre tu pensamiento: conocer cómo aprendes y regular lo que haces (planear, revisar, evaluar).'],
        ['Monitorear vs. controlar', 'Monitorear: observar ("¿lo entiendo?"). Controlar: actuar según eso ("lo vuelvo a leer despacio").'],
        ['Conocimiento vs. regulación metacognitiva', 'Conocimiento: saber qué estrategias hay y cuándo sirven. Regulación: usarlas mientras trabajas.'],
      ],
    }),
    l('Calibrar: cuánto confías frente a cuánto sabes', 10, {
      idea: 'Estar calibrado es que tu confianza coincida con tus aciertos. Casi todos nos pasamos de confiados, y la mejor forma de corregirlo es predecir y luego comprobar.',
      bloques: [
        ['Qué es estar calibrado', [
          'Si dices estar 90 % seguro de 10 respuestas, deberías acertar unas 9. Si aciertas 6, estás sobreconfiado.',
          'La calibración se entrena: los meteorólogos, que predicen todos los días y ven el resultado al otro, suelen estar muy bien calibrados.',
          'La clave es la retroalimentación: sin comparar lo que creías con lo que pasó, la confianza nunca se ajusta.',
        ]],
        ['Tres formas de exceso de confianza (Moore y Healy, 2008)', [
          'Sobreestimar: creer que lo hiciste mejor de lo que lo hiciste ("saqué 4,5" y sacaste 3,8).',
          'Sobreubicarte: creerte mejor que los demás ("manejo mejor que la mayoría").',
          'Sobreprecisión: estar demasiado seguro de tus cálculos ("la obra cuesta entre 10 y 11 millones" cuando el rango real es mucho más ancho).',
        ]],
        ['El truco del juicio demorado', [
          'Si juzgas "¿me lo sé?" justo después de estudiar algo, el recuerdo aún está fresco y te engaña.',
          'Nelson y Dunlosky (1991) mostraron que el juicio hecho un rato después, intentando recordar solo con la pregunta, predice mucho mejor lo que vas a recordar.',
          'En la práctica: no decidas que algo ya lo sabes mientras lo tienes enfrente. Espera, tápalo e intenta recordarlo.',
        ]],
      ],
      ejemplos: [
        'Antes de un examen de certificación, escribe la nota que crees que vas a sacar en cada tema. Después compárala con la real: los temas donde más te equivocaste son los que peor estás midiendo.',
        'Antes de un partido dices "les ganamos fácil". Si anotas tus pronósticos durante un mes y los comparas con los resultados, vas a ver qué tan calibrado estás.',
      ],
      practica: [
        'En tu próximo repaso, antes de voltear cada tarjeta di si estás "seguro", "más o menos" o "no sé", y fíjate si acertaste.',
        'Escribe cuánto crees que vas a gastar este mes en comida y compáralo al final con 💰 Finanzas.',
        'Antes de terminar una lección, tapa la pantalla y espera un minuto antes de decidir si ya la entendiste.',
      ],
      pregunta: '¿En qué tema me siento más seguro de lo que mis resultados justifican?',
      nota: 'El efecto Dunning-Kruger se resume mal como "los ignorantes se creen genios". En el estudio original (1999), quienes peor lo hicieron sí se sobreestimaron mucho, pero no se creyeron los mejores. Además, parte del efecto es un artefacto estadístico: aparece aunque nadie se conozca bien, porque los extremos tienden al promedio. Lo que sí se sostiene es más simple: casi todos nos calibramos mal, y medir y comparar ayuda.',
      recordar: [
        ['¿Qué significa estar calibrado?', 'Que tu confianza coincide con tus aciertos: si dices 90 % seguro, aciertas cerca del 90 %.'],
        ['Nombra las tres formas de exceso de confianza de Moore y Healy.', 'Sobreestimarte, sobreubicarte frente a los demás y la sobreprecisión (estar demasiado seguro de tus cálculos).'],
        ['¿Qué es el efecto del juicio demorado?', 'Juzgar si sabes algo un rato después, intentando recordarlo, predice mucho mejor que juzgarlo justo después de estudiar.'],
        ['¿Qué hace falta para mejorar la calibración?', 'Predecir y luego comparar con el resultado real (retroalimentación).'],
      ],
      tarjetas: [
        ['¿Qué es la calibración?', 'Qué tanto coincide tu confianza con tu desempeño real.'],
        ['Juicio demorado (Nelson y Dunlosky, 1991)', 'Decidir si te sabes algo un rato después y sin mirarlo es mucho más preciso que hacerlo justo al estudiar.'],
        ['Efecto Dunning-Kruger: el matiz', 'Los de peor desempeño se sobreestiman, pero no se creen los mejores; y parte del efecto es estadístico.'],
      ],
    }),
    l('Las ilusiones de saber', 10, {
      idea: 'La mente usa atajos para juzgar si sabe algo: lo familiar, lo fácil de leer, lo que entendiste al verlo explicado. Esos atajos se equivocan de formas predecibles.',
      bloques: [
        ['La ilusión de profundidad explicativa', [
          'Rozenblit y Keil (2002) preguntaron a la gente qué tan bien entendía cómo funciona una cremallera o un sanitario. Casi todos se calificaron alto.',
          'Luego les pidieron explicarlo paso a paso. Al intentarlo, la mayoría se dio cuenta de que no sabía, y su calificación bajó.',
          'Pasa con objetos, con políticas públicas y con temas del trabajo: creemos entender hasta que tenemos que explicar.',
        ]],
        ['Fluidez: lo fácil parece sabido', [
          'Un texto claro, un video bien hecho o una explicación del profesor se entienden sin esfuerzo, y eso se confunde con poder hacerlo solo.',
          'Ver a alguien resolver un problema no es lo mismo que resolverlo: por eso los ejercicios "se veían fáciles" en clase y en el examen no salen.',
          'Lo que viste ayer también se siente conocido hoy, aunque no puedas recordarlo sin ayuda (Koriat y Bjork, 2005).',
        ]],
        ['El antídoto: producir', [
          'Explica sin mirar, en voz alta o por escrito, paso a paso.',
          'Resuelve un ejercicio de cero, sin ver la solución.',
          'Pregúntate: "¿qué pregunta de examen me harían sobre esto y la sé contestar?".',
          'Si algo se siente demasiado fácil, desconfía y ponte a prueba.',
        ]],
      ],
      ejemplos: [
        'Ves un video de 10 minutos sobre cómo funciona la bolsa de valores y te parece clarísimo. Intenta explicarle a alguien qué pasa cuando compras una acción y dónde está tu plata: ahí aparecen los huecos.',
        'Un compañero te muestra cómo hacer una tabla dinámica en Excel y dices "listo, entendí". Al otro día, frente al computador y sin ayuda, no sabes por dónde empezar.',
      ],
      practica: [
        'Escoge algo que creas entender bien (cómo funciona tu tarjeta de crédito, un tiro libre, la inflación) y explícalo por escrito paso a paso.',
        'Califica del 1 al 7 tu comprensión antes y después de explicarlo. Anota la diferencia.',
        'La próxima vez que veas un tutorial, haz el ejercicio solo antes de pasar al siguiente video.',
      ],
      pregunta: '¿Qué tema doy por entendido solo porque lo he visto explicado muchas veces?',
      nota: 'Hace unos años se volvió famoso que leer en una letra difícil de leer ayudaba a aprender, porque obligaba a esforzarse. Varias réplicas grandes no encontraron ese efecto. Lo que sí ayuda es el esfuerzo de recordar y explicar, no el de descifrar una letra fea.',
      recordar: [
        ['¿Qué es la ilusión de profundidad explicativa?', 'Creer que entiendes cómo funciona algo hasta que intentas explicarlo paso a paso y descubres que no.'],
        ['¿Por qué ver a alguien resolver un problema engaña?', 'Porque entender la explicación se siente fácil (fluidez) y se confunde con poder hacerlo solo.'],
        ['Di dos antídotos contra las ilusiones de saber.', 'Explicar sin mirar y resolver ejercicios de cero (también imaginar la pregunta de examen).'],
      ],
      tarjetas: [
        ['Ilusión de profundidad explicativa (Rozenblit y Keil, 2002)', 'Creemos entender cómo funcionan las cosas hasta que tenemos que explicarlas paso a paso.'],
        ['Fluidez', 'La facilidad con que procesas algo; se confunde con saberlo, pero no lo es.'],
        ['¿Cómo saber si de verdad lo entiendes?', 'Producir: explicarlo sin mirar o resolver un ejercicio de cero.'],
      ],
    }),
  ],
};

const DIRIGIR = {
  titulo: 'Dirigir tu aprendizaje',
  objetivo: 'Planear con realismo, vigilar el rumbo mientras trabajas y evaluar al final para que cada intento enseñe algo.',
  fuentes: [
    ['Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. Theory Into Practice, 41(2), 64-70.', 'El ciclo de planear, ejecutar y reflexionar.'],
    ['Dignath, C. y Büttner, G. (2008). Components of fostering self-regulated learning among students: A meta-analysis on intervention studies at primary and secondary school level. Metacognition and Learning, 3(3), 231-264.', 'Enseñar autorregulación mejora el rendimiento.'],
    ['Buehler, R., Griffin, D. y Ross, M. (1994). Exploring the “planning fallacy”: Why people underestimate their task completion times. Journal of Personality and Social Psychology, 67(3), 366-381.', 'La falacia de la planificación.'],
    ['Gollwitzer, P. M. (1999). Implementation intentions: Strong effects of simple plans. American Psychologist, 54(7), 493-503.', 'Los planes "si… entonces…".'],
    ['Gollwitzer, P. M. y Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. Advances in Experimental Social Psychology, 38, 69-119.', 'Metaanálisis de los planes "si… entonces…".'],
    ['Tannenbaum, S. I. y Cerasoli, C. P. (2013). Do team and individual debriefs enhance performance? A meta-analysis. Human Factors, 55(1), 231-245.', 'Revisar después de actuar mejora el desempeño.'],
    ['Lovett, M. C. (2013). Make exams worth more than the grade. En M. Kaplan y otros (Eds.), Using Reflection and Metacognition to Improve Student Learning. Stylus.', 'Las "envolturas de examen" para aprender de cada evaluación.'],
    ['Education Endowment Foundation (2018, actualizado 2021). Metacognition and Self-regulated Learning: Guidance Report. Londres: EEF.', 'Recomendaciones prácticas basadas en evidencia.'],
  ],
  lecciones: [
    l('Planear: antes de empezar', 10, {
      idea: 'Los que aprenden bien no se lanzan sin más: antes de empezar se ponen una meta concreta, escogen cómo la van a lograr y calculan el tiempo con realismo.',
      bloques: [
        ['El ciclo de la autorregulación (Zimmerman)', [
          'Antes (planear): meta, estrategia, tiempo y por qué te importa.',
          'Durante (ejecutar): concentrarte, aplicar la estrategia y vigilar cómo va.',
          'Después (reflexionar): ¿funcionó?, ¿por qué?, ¿qué cambio la próxima vez? Y eso alimenta el siguiente plan.',
          'Los estudios que enseñan este ciclo encuentran mejoras en el rendimiento (Dignath y Büttner, 2008).',
        ]],
        ['Una buena meta de estudio', [
          'Concreta y de proceso: "terminar la lección 4 y responder sus preguntas sin mirar", no "estudiar un rato".',
          'Medible al final: que puedas decir sí o no.',
          'Con la estrategia incluida: "con tarjetas", "explicándolo en voz alta", "haciendo 5 ejercicios mezclados".',
        ]],
        ['La falacia de la planificación', [
          'Casi siempre calculamos que las cosas tardan menos de lo que tardan. Buehler y colegas (1994) pidieron a estudiantes estimar cuándo terminarían su tesis: calcularon unos 34 días y tardaron unos 55; menos de un tercio terminó a tiempo.',
          'Pasa porque imaginamos el mejor camino y olvidamos los imprevistos, aunque nos hayan pasado mil veces.',
          'Antídoto: mira cuánto te tardaste las veces anteriores en algo parecido (la "vista desde afuera") y usa ese número, no el que imaginas.',
          'Otro antídoto: divide la tarea en pasos pequeños y calcula cada uno; luego suma un margen.',
        ]],
      ],
      ejemplos: [
        'Crees que la declaración de renta te toma una tarde. El año pasado te tomó tres tardes y una ida al banco. Planea con las tres tardes.',
        'Antes de entrenar defines: "hoy subo 2,5 kg en press de banca manteniendo 8 repeticiones". Es una meta de proceso, medible y con la estrategia incluida.',
      ],
      practica: [
        'Antes de tu próxima sesión de estudio, escribe la meta, la estrategia y cuántos minutos crees que te va a tomar.',
        'Al terminar, anota cuánto tardaste de verdad. Guarda la diferencia.',
        'Piensa en un proyecto pendiente y calcula cuánto tardaste en el último parecido.',
      ],
      pregunta: '¿Qué tarea vengo calculando mal una y otra vez, y cuánto me tarda de verdad?',
      nota: 'Planear no es hacer un cronograma perfecto: un plan corto y realista que se revisa sirve más que uno detallado que se abandona. Y la falacia de la planificación afecta sobre todo lo que estimamos para nosotros mismos; para otros solemos ser más realistas (o pesimistas).',
      recordar: [
        ['¿Cuáles son las tres fases del ciclo de autorregulación de Zimmerman?', 'Planear (antes), ejecutar y vigilar (durante) y reflexionar (después).'],
        ['¿Qué es la falacia de la planificación?', 'La tendencia a calcular que las tareas van a tardar menos de lo que tardan, aunque antes nos haya pasado.'],
        ['¿Qué encontraron Buehler y colegas con las tesis?', 'Los estudiantes calcularon unos 34 días y tardaron unos 55; menos de un tercio terminó a tiempo.'],
        ['¿Cuál es el antídoto principal contra la falacia de la planificación?', 'Usar cuánto tardaste en tareas parecidas (vista desde afuera) en vez de imaginar el mejor caso.'],
      ],
      tarjetas: [
        ['Ciclo de autorregulación (Zimmerman)', 'Planear → ejecutar y vigilar → reflexionar, y lo que aprendes alimenta el siguiente plan.'],
        ['Falacia de la planificación', 'Subestimar cuánto tardará una tarea propia. Antídoto: mirar cuánto tardaste en casos parecidos.'],
        ['Una buena meta de estudio es…', 'Concreta, de proceso, medible al final y con la estrategia incluida.'],
      ],
    }),
    l('Vigilar mientras haces', 10, {
      idea: 'Durante el trabajo, unas pocas preguntas a tiempo te dicen si vas bien o si tienes que cambiar de estrategia, y los planes "si… entonces…" deciden por ti antes de que llegue el momento difícil.',
      bloques: [
        ['Las preguntas del durante', [
          '¿Entiendo lo que acabo de leer o solo lo pasé con los ojos?',
          '¿La estrategia que escogí está funcionando? ¿Cómo lo sé?',
          '¿Estoy concentrado o llevo un rato pensando en otra cosa?',
          '¿Qué haría ahora un experto en esto?',
          'Ponlas en un papel al lado o en una alarma cada 15-20 minutos al principio, hasta que salgan solas.',
        ]],
        ['Pensar en voz alta', [
          'Decir en voz alta lo que piensas mientras resuelves algo hace visible tu razonamiento, y así encuentras dónde te enredas.',
          'Sirve para estudiar matemáticas, revisar un presupuesto o explicar por qué tomas una decisión en el trabajo.',
          'Si estudias con alguien, turnarse: uno resuelve pensando en voz alta y el otro pregunta "¿por qué hiciste eso?".',
        ]],
        ['Planes "si… entonces…"', [
          'Gollwitzer los llamó intenciones de implementación: "Si pasa X, entonces hago Y".',
          'Ejemplos: "Si llevo 3 párrafos sin entender, entonces paro y resumo lo último con mis palabras". "Si me provoca coger el celular, entonces lo pongo en la otra pieza".',
          'Un metaanálisis de Gollwitzer y Sheeran (2006) encontró que estos planes ayudan de forma moderada a fuerte a cumplir metas, sobre todo porque la decisión ya está tomada cuando aparece la tentación.',
        ]],
      ],
      ejemplos: [
        'Revisando el extracto del banco, piensas en voz alta: "este cobro de 45.000… ¿qué es? No lo reconozco". Decirlo te obliga a no pasarlo de largo.',
        'Tu plan: "Si son las 9 p. m. y no he hecho los repasos, entonces los hago antes de ver series". La decisión ya no depende de las ganas del momento.',
      ],
      practica: [
        'Escribe 2 planes "si… entonces…" para tus momentos difíciles de estudio (cansancio, celular, no entender).',
        'Pon una alarma a los 15 minutos de tu próxima sesión y responde las preguntas del durante.',
        'Resuelve un problema o un ejercicio pensando en voz alta y anota dónde te trabaste.',
      ],
      pregunta: '¿Cuál es el momento en que más suelo perder el rumbo cuando estudio o trabajo, y qué plan "si… entonces…" me ayudaría?',
      nota: 'Vigilar no es interrumpirte cada minuto ni dudar de todo: demasiada atención a cómo lo estás haciendo puede estorbar cuando ya dominas una habilidad (piensa en un futbolista que se pone a pensar cómo patea un penalti). Es más útil al aprender algo nuevo y en los momentos de decisión.',
      recordar: [
        ['Di tres preguntas para vigilar mientras estudias.', '¿Entiendo lo que leí? ¿Mi estrategia funciona? ¿Estoy concentrado? (también: ¿qué haría un experto?).'],
        ['¿Qué es una intención de implementación?', 'Un plan "si pasa X, entonces hago Y" que deja la decisión tomada antes del momento difícil.'],
        ['¿Para qué sirve pensar en voz alta?', 'Hace visible tu razonamiento y te muestra dónde te enredas.'],
        ['¿Cuándo vigilar demasiado puede estorbar?', 'Cuando ya dominas una habilidad automática: pensar cada detalle la empeora.'],
      ],
      tarjetas: [
        ['Intención de implementación (Gollwitzer)', 'Plan "si… entonces…": "Si pasa X, entonces hago Y". Ayuda a cumplir metas.'],
        ['Las 3 preguntas del durante', '¿Entiendo? ¿Mi estrategia funciona? ¿Estoy concentrado?'],
        ['Pensar en voz alta', 'Decir tu razonamiento mientras resuelves algo para ver dónde te enredas.'],
      ],
    }),
    l('Evaluar y ajustar: después de cada intento', 10, {
      idea: 'Lo que no se revisa se repite. Unos minutos para preguntarte qué pasó, por qué y qué cambias convierten cada examen, partido o proyecto en una clase.',
      bloques: [
        ['La revisión después de la acción', [
          'El Ejército de Estados Unidos la popularizó con cuatro preguntas: ¿Qué se esperaba que pasara? ¿Qué pasó? ¿Por qué hubo diferencia? ¿Qué hacemos distinto?',
          'Un metaanálisis de Tannenbaum y Cerasoli (2013) encontró que estas revisiones (debriefs), bien hechas, mejoran el desempeño de forma importante, tanto en equipos como de forma individual.',
          'Funcionan mejor si son honestas, se enfocan en lo que se puede cambiar y terminan en una acción concreta.',
        ]],
        ['La envoltura de examen', [
          'Marsha Lovett propuso una hoja corta para después de cada evaluación: ¿cómo te preparaste?, ¿qué tipo de errores cometiste?, ¿qué cambias para la próxima?',
          'Clasificar los errores ayuda: ¿no lo sabía?, ¿lo sabía pero me confundí?, ¿fue descuido?, ¿se me acabó el tiempo? Cada tipo pide un arreglo distinto.',
          'Sirve igual para un examen, una entrevista de trabajo o una presentación.',
        ]],
        ['Cerrar el día', [
          'Escribir unos minutos al final del día sobre lo que aprendiste también ayuda: en un estudio con empleados de un centro de llamadas, los que reflexionaban 15 minutos al día rindieron mejor en la prueba final que los que dedicaron ese tiempo a practicar más (Di Stefano y colegas, documento de trabajo de Harvard).',
          'En esta app, el diario de cada lección y la revisión semanal de 📈 Progreso son ese espacio.',
        ]],
      ],
      ejemplos: [
        'Después de un partido en que perdieron 3-1: ¿qué esperábamos? Presionar arriba. ¿Qué pasó? Nos cansamos a los 20 minutos. ¿Por qué? Varios llegaron sin comer. ¿Qué cambiamos? Comida 2-3 horas antes y cambios más seguidos.',
        'Te fue mal en una entrevista. En vez de "soy malo para eso", clasificas: dos preguntas no las sabía (preparar), una la sabía pero me puse nervioso (practicar en voz alta).',
      ],
      practica: [
        'Haz una revisión de 4 preguntas de algo que hiciste esta semana (un entreno, una reunión, un examen).',
        'Clasifica tus últimos 5 errores de repaso: ¿no lo sabía, me confundí, descuido o tiempo?',
        'Responde hoy la pregunta del diario de esta lección antes de dormir.',
      ],
      pregunta: '¿Qué error he cometido más de una vez porque nunca me senté a revisar por qué pasó?',
      nota: 'El estudio del centro de llamadas es un documento de trabajo (no una publicación revisada por pares) y se hizo con un grupo concreto de empleados en formación: es una pista interesante, no una ley. El respaldo más sólido viene de los metaanálisis sobre revisiones después de la acción.',
      recordar: [
        ['¿Cuáles son las cuatro preguntas de la revisión después de la acción?', '¿Qué se esperaba? ¿Qué pasó? ¿Por qué hubo diferencia? ¿Qué hacemos distinto?'],
        ['¿Qué es una envoltura de examen?', 'Una hoja corta para después de una evaluación: cómo me preparé, qué errores cometí y qué cambio.'],
        ['¿Por qué conviene clasificar los errores?', 'Porque cada tipo (no lo sabía, me confundí, descuido, tiempo) necesita un arreglo distinto.'],
      ],
      tarjetas: [
        ['Revisión después de la acción: 4 preguntas', '¿Qué se esperaba? ¿Qué pasó? ¿Por qué la diferencia? ¿Qué hacemos distinto?'],
        ['Tipos de error para clasificar', 'No lo sabía · lo sabía pero me confundí · descuido · se acabó el tiempo.'],
        ['¿Qué mostró el metaanálisis de Tannenbaum y Cerasoli (2013)?', 'Las revisiones después de actuar (debriefs) mejoran el desempeño de equipos e individuos.'],
      ],
    }),
  ],
};

const PENSAR = {
  titulo: 'Pensar sobre tu pensamiento',
  objetivo: 'Usar los errores para aprender, frenar el piloto automático en las decisiones importantes y armar tu propia rutina metacognitiva.',
  fuentes: [
    ['Metcalfe, J. (2017). Learning from errors. Annual Review of Psychology, 68, 465-489.', 'Cuándo equivocarse ayuda a aprender.'],
    ['Butterfield, B. y Metcalfe, J. (2001). Errors committed with high confidence are hypercorrected. Journal of Experimental Psychology: Learning, Memory, and Cognition, 27(6), 1491-1494.', 'El efecto de hipercorrección.'],
    ['Sisk, V. F., Burgoyne, A. P., Sun, J., Butler, J. L. y Macnamara, B. N. (2018). To what extent and under which circumstances are growth mind-sets important to academic achievement? Two meta-analyses. Psychological Science, 29(4), 549-571.', 'Lo que de verdad se sabe de la mentalidad de crecimiento.'],
    ['Kahneman, D. (2011). Pensar rápido, pensar despacio. (Ed. en español: Debate, 2012).', 'Los dos modos de pensar y sus errores típicos.'],
    ['Lord, C. G., Lepper, M. R. y Preston, E. (1984). Considering the opposite: A corrective strategy for social judgment. Journal of Personality and Social Psychology, 47(6), 1231-1243.', 'Considerar lo contrario reduce el sesgo.'],
    ['Klein, G. (2007). Performing a project premortem. Harvard Business Review, 85(9), 18-19.', 'El ejercicio del premortem.'],
    ['Ruiz Martín, H. (2020). ¿Cómo aprendemos? Una aproximación científica al aprendizaje y la enseñanza. Graó.', 'La metacognición dentro de la ciencia del aprendizaje, en español.'],
  ],
  lecciones: [
    l('Aprender de los errores', 10, {
      idea: 'Equivocarse, si después ves la respuesta correcta y entiendes por qué fallaste, es una de las mejores formas de aprender. Esconder los errores es perder la clase.',
      bloques: [
        ['Por qué el error enseña', [
          'Cuando intentas algo y fallas, tu mente queda "preparada" para fijarse en la respuesta correcta (Metcalfe, 2017).',
          'Los errores que cometiste muy seguro se corrigen especialmente bien al ver la respuesta (hipercorrección): la sorpresa ayuda a fijar.',
          'La condición es la retroalimentación: un error sin corrección se puede quedar grabado.',
          'Y el contexto: equivocarse en una práctica sin consecuencias enseña; en un momento de alto riesgo, se paga caro. Por eso conviene fallar en la práctica.',
        ]],
        ['El registro de errores', [
          'Un cuaderno o nota con tres columnas: qué me equivoqué, por qué (tipo de error) y la regla para la próxima.',
          'Releerlo antes de un examen o una tarea parecida rinde más que releer todo el material.',
          'Sirve para estudiar, pero también para el gym (técnica), las finanzas (gastos impulsivos) o el trabajo (correos que generaron problemas).',
        ]],
        ['La actitud ante el error', [
          'Decir "todavía no lo sé hacer" en lugar de "no sirvo para esto" mantiene abierta la puerta a practicar.',
          'Separa el error de tu valor como persona: el error dice algo sobre una estrategia, no sobre quién eres.',
          'Pregunta útil después de fallar: "¿qué me está enseñando esto que no sabía antes?".',
        ]],
      ],
      ejemplos: [
        'Tu registro de errores del gym: "Me dolió la espalda baja en el peso muerto → bajé la cadera demasiado tarde → regla: grabarme la primera serie pesada".',
        'En inglés siempre dices "I have 30 years". Lo anotas: error de traducción literal → regla: la edad va con "to be" (I am 30).',
      ],
      practica: [
        'Abre un registro de errores (en el diario de esta lección o en un cuaderno) con tres columnas: error, por qué, regla.',
        'Anota los errores de tus repasos de hoy con su regla.',
        'Piensa en un error reciente y escribe qué te enseñó.',
      ],
      pregunta: '¿Qué error me da tanta vergüenza que prefiero no mirarlo, y qué me podría enseñar?',
      nota: 'La "mentalidad de crecimiento" (Carol Dweck) es una idea útil, pero los metaanálisis encuentran que los cursos para enseñarla tienen efectos pequeños en las notas, algo mayores en estudiantes con dificultades (Sisk y colegas, 2018). No basta con repetir "puedo crecer": lo que mejora es practicar con buenas estrategias y retroalimentación.',
      recordar: [
        ['¿Qué condición hace que equivocarse ayude a aprender?', 'Recibir la respuesta correcta y entender por qué fallaste (retroalimentación).'],
        ['¿Qué tres columnas tiene un registro de errores?', 'Qué me equivoqué, por qué (tipo de error) y la regla para la próxima.'],
        ['¿Qué dicen los metaanálisis sobre la mentalidad de crecimiento?', 'Que las intervenciones tienen efectos pequeños en las notas, algo mayores en estudiantes con dificultades.'],
      ],
      tarjetas: [
        ['¿Cuándo el error enseña?', 'Cuando después ves la respuesta correcta y entiendes por qué fallaste, mejor en práctica sin consecuencias.'],
        ['Registro de errores', 'Error · por qué pasó · regla para la próxima. Releerlo antes de tareas parecidas.'],
        ['Mentalidad de crecimiento: el matiz', 'Útil, pero sus intervenciones tienen efectos pequeños; lo que mejora es practicar con buenas estrategias.'],
      ],
    }),
    l('Frenar el piloto automático', 10, {
      idea: 'La mayoría de lo que pensamos es rápido y automático, y casi siempre funciona. La metacognición sirve para reconocer los momentos en que conviene frenar y pensar despacio.',
      bloques: [
        ['Rápido y despacio', [
          'Daniel Kahneman popularizó la idea de dos modos de pensar: uno rápido, intuitivo y sin esfuerzo, y otro lento, deliberado y cansón.',
          'El rápido maneja casi todo el día (caminar, reconocer caras, leer) y está bien que así sea.',
          'El problema es cuando usamos el rápido para decisiones que piden el lento: una compra grande, un contrato, juzgar a una persona.',
          'Los "dos sistemas" son una forma de hablar, no dos partes separadas del cerebro.',
        ]],
        ['Señales para frenar', [
          'La decisión es cara o difícil de deshacer.',
          'Sientes mucha emoción (rabia, prisa, euforia) o alguien te presiona para decidir ya.',
          'Estás muy seguro sin haber buscado información en contra.',
          'Estás cansado, con hambre o con sueño.',
        ]],
        ['Herramientas para pensar despacio', [
          'Considera lo contrario: pregúntate "¿qué razones hay para que esté equivocado?". Lord, Lepper y Preston (1984) mostraron que esto reduce el sesgo mejor que solo pedir "sé objetivo".',
          'Premortem (Gary Klein): imagina que ya pasó un año y la decisión salió muy mal. ¿Qué pasó? Te ayuda a ver riesgos que el entusiasmo oculta.',
          'Regla del día siguiente: para lo grande, dormir antes de decidir (como la regla de las 72 horas de 💰 Finanzas para las compras).',
        ]],
      ],
      ejemplos: [
        'Un vendedor te ofrece un crédito "solo por hoy" para una moto. Prisa + decisión cara = señal para frenar. Pides los papeles, duermes y comparas la tasa al otro día.',
        'Estás seguro de que un compañero te ignoró a propósito. Considerar lo contrario: ¿qué otras razones hay? Tal vez no te vio, o estaba preocupado por algo.',
      ],
      practica: [
        'Escribe tus 2 señales personales de "aquí debo frenar".',
        'Haz un premortem de una decisión que tengas pendiente: imagina que salió mal y escribe 3 razones.',
        'Hoy, ante una opinión fuerte que tengas, escribe la mejor razón para pensar lo contrario.',
      ],
      pregunta: '¿Qué decisión importante tomé en caliente y qué habría cambiado si hubiera frenado?',
      nota: 'El libro de Kahneman es muy valioso, pero algunos estudios que cita (sobre todo los de "priming", como que leer palabras de vejez hace caminar más despacio) no se han podido replicar; el propio Kahneman lo reconoció. La idea general de los dos modos de pensar y los errores de juicio sigue siendo útil.',
      recordar: [
        ['¿Cuáles son los dos modos de pensar que popularizó Kahneman?', 'Uno rápido, intuitivo y automático, y otro lento, deliberado y que cuesta esfuerzo.'],
        ['Nombra tres señales para frenar y pensar despacio.', 'Decisión cara o irreversible, mucha emoción o presión, mucha seguridad sin buscar información en contra (también cansancio).'],
        ['¿Qué es un premortem?', 'Imaginar que la decisión ya salió mal y preguntarte por qué, para ver riesgos antes de decidir.'],
        ['¿Qué es "considerar lo contrario"?', 'Buscar activamente razones por las que podrías estar equivocado; reduce el sesgo.'],
      ],
      tarjetas: [
        ['Premortem (Gary Klein)', 'Imaginar que el proyecto ya fracasó y explicar por qué, para detectar riesgos a tiempo.'],
        ['Considerar lo contrario', 'Preguntarte "¿qué razones hay para que esté equivocado?". Reduce el sesgo más que "sé objetivo".'],
        ['Señales para frenar', 'Decisión cara o irreversible · emoción fuerte o prisa · seguridad sin buscar lo contrario · cansancio.'],
      ],
    }),
    l('Tu rutina metacognitiva', 12, {
      idea: 'La metacognición se vuelve útil cuando es hábito: unas preguntas fijas antes, durante y después, y una revisión semanal que mira cómo vas aprendiendo.',
      bloques: [
        ['Antes, durante y después (para cualquier tarea)', [
          'Antes: ¿qué quiero lograr?, ¿qué sé ya de esto?, ¿qué estrategia uso?, ¿cuánto tardé la última vez?',
          'Durante: ¿entiendo?, ¿funciona la estrategia?, ¿estoy concentrado?',
          'Después: ¿lo logré?, ¿qué funcionó?, ¿qué error cometí y qué regla saco?',
        ]],
        ['La revisión semanal (10 minutos)', [
          '¿Qué aprendí esta semana? Explícalo sin mirar en 3 frases.',
          '¿Cómo estuvo mi calibración? ¿Dónde creí saber más de lo que sabía?',
          '¿Qué errores se repitieron?',
          '¿Cumplí mi plan de estudio? Si no, ¿qué me lo impidió y qué plan "si… entonces…" pongo?',
          '¿Qué ajusto para la próxima semana? Una sola cosa.',
        ]],
        ['Cómo te ayuda esta app', [
          'El plan de 🎓 Estudiar ya ordena repasos y lecciones; el cronómetro te dice cuánto estudiaste de verdad.',
          'Recordar sin mirar y las tarjetas son tus pruebas de calibración diarias.',
          'El diario de cada lección y la revisión semanal de 📈 Progreso son tu espacio de reflexión.',
        ]],
      ],
      ejemplos: [
        'Domingo, 10 minutos: "Esta semana aprendí calibración y premortem. Creí dominar la lección 2 y fallé 2 de 3 tarjetas. Error repetido: estudio de noche cansado. Ajuste: si llego después de las 9 p. m., solo repasos".',
        'Antes de una reunión importante: "Quiero que aprueben el presupuesto; sé que preguntarán por costos; llevo los números del año pasado; la última vez me faltó tiempo, así que empiezo por lo esencial".',
      ],
      practica: [
        'Copia las preguntas de antes, durante y después en una nota que veas al estudiar.',
        'Pon en tu calendario 10 minutos el domingo para la revisión semanal.',
        'Elige el tema de tu proyecto final de este curso.',
      ],
      pregunta: '¿Qué cambiaría en mis resultados si dedicara 10 minutos a la semana a revisar cómo estoy aprendiendo?',
      nota: 'Más reflexión no siempre es mejor: darle vueltas sin fin a lo que salió mal (rumiar) no es metacognición, es preocupación, y se asocia con ansiedad. La reflexión útil es corta, concreta y termina en una acción. Si notas que no puedes parar de dar vueltas a algo, habla con alguien de confianza o con un profesional.',
      recordar: [
        ['¿Qué preguntas haces antes de una tarea?', '¿Qué quiero lograr? ¿Qué sé ya? ¿Qué estrategia uso? ¿Cuánto tardé la última vez?'],
        ['Di tres preguntas de la revisión semanal.', '¿Qué aprendí (explicado sin mirar)? ¿Cómo estuvo mi calibración? ¿Qué errores se repitieron? (También: ¿cumplí el plan?, ¿qué ajusto?).'],
        ['¿En qué se diferencia reflexionar de rumiar?', 'Reflexionar es corto, concreto y termina en una acción; rumiar es dar vueltas sin fin y aumenta la ansiedad.'],
      ],
      tarjetas: [
        ['Preguntas antes de una tarea', '¿Qué quiero lograr? ¿Qué sé ya? ¿Qué estrategia? ¿Cuánto tardé la última vez?'],
        ['Revisión semanal: el cierre', 'Escoger UNA sola cosa para ajustar la próxima semana.'],
        ['Reflexionar vs. rumiar', 'Reflexionar: breve, concreto, termina en acción. Rumiar: vueltas sin fin, sube la ansiedad.'],
      ],
    }),
  ],
};

export default {
  id: 'metacognicion',
  nombre: 'Metacognición',
  area: 'aprender',
  icono: '🪞',
  nivel: 'Básico',
  paraQue: 'Saber con precisión qué sabes y qué no, y dirigir tu propio aprendizaje: planear, vigilar y corregir el rumbo. Es la otra mitad de Aprender a aprender: aquel curso enseña qué técnicas usar; este, cómo darte cuenta de si te están funcionando.',
  modulos: [SABER, DIRIGIR, PENSAR],
  proyecto: {
    titulo: 'Un mes con bitácora de calibración',
    intro: 'Durante 4 semanas vas a medir qué tan bien conoces lo que sabes y a usar ese dato para estudiar mejor. Sirve con este curso, con otro o con algo de tu trabajo.',
    pasos: [
      'Escoge qué vas a estudiar este mes y escribe la meta concreta.',
      'En cada repaso, antes de voltear la tarjeta, anota si estás seguro, más o menos o no sabes; luego anota si acertaste.',
      'Al final de cada semana, calcula: de las que dijiste "seguro", ¿cuántas acertaste?',
      'Antes de cada sesión, escribe cuánto tiempo crees que te va a tomar; al final, cuánto tomó.',
      'Lleva un registro de errores con su tipo y su regla.',
      'Cada domingo haz la revisión semanal de 10 minutos y escoge un solo ajuste.',
      'Al terminar el mes, compara tu calibración y tus tiempos de la semana 1 con los de la semana 4.',
      'Escribe qué aprendiste sobre cómo aprendes y qué hábito te quedas.',
    ],
  },
};
