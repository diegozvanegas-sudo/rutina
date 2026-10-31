// Ciencia de la procrastinación: por qué aplazamos y qué funciona para salir. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const QUE_ES = {
  titulo: 'Qué es procrastinar',
  objetivo: 'Entender qué es (y qué no es) la procrastinación, por qué es sobre todo una forma de huir de emociones incómodas y cómo el presente le gana al futuro.',
  fuentes: [
    ['Steel, P. (2007). The nature of procrastination: A meta-analytic and theoretical review of quintessential self-regulatory failure. Psychological Bulletin, 133(1), 65-94.', 'La gran revisión: definición, causas y consecuencias.'],
    ['Sirois, F. y Pychyl, T. (2013). Procrastination and the priority of short-term mood regulation: Consequences for future self. Social and Personality Psychology Compass, 7(2), 115-127.', 'Procrastinar como forma de reparar el ánimo del momento.'],
    ['Tice, D. M., Bratslavsky, E. y Baumeister, R. F. (2001). Emotional distress regulation takes precedence over impulse control: If you feel bad, do it! Journal of Personality and Social Psychology, 80(1), 53-67.', 'Cuando nos sentimos mal, priorizamos sentirnos mejor ya.'],
    ['Steel, P. y König, C. J. (2006). Integrating theories of motivation. Academy of Management Review, 31(4), 889-913.', 'La teoría de la motivación temporal: expectativa, valor, impulsividad y demora.'],
    ['Ainslie, G. (1975). Specious reward: A behavioral theory of impulsiveness and impulse control. Psychological Bulletin, 82(4), 463-496.', 'Por qué lo inmediato pesa mucho más que lo que viene después.'],
    ['Hershfield, H. E. (2011). Future self-continuity: How conceptions of the future self transform intertemporal choice. Annals of the New York Academy of Sciences, 1235, 30-43.', 'Sentir al "yo del futuro" como un extraño facilita dejarle el trabajo.'],
    ['Pychyl, T. A. (2013). Solving the Procrastination Puzzle: A concise guide to strategies for change. Tarcher/Penguin.', 'Guía breve y práctica de uno de los principales investigadores del tema.'],
  ],
  lecciones: [
    l('Procrastinar no es pereza', 10, {
      idea: 'Procrastinar es aplazar a propósito algo que quieres hacer, aun sabiendo que te va a ir peor por aplazarlo. No es pereza ni falta de tiempo: es un fallo en cómo te autorregulas.',
      bloques: [
        ['La definición', [
          'Piers Steel (2007) la define como retrasar voluntariamente una acción que pensabas hacer, aunque esperas estar peor por el retraso.',
          'Tres partes: es voluntario (nadie te obliga), es algo que tú mismo querías hacer, y sabes que aplazarlo te perjudica.',
          'Por eso se siente tan mal: vas en contra de tus propias intenciones.',
        ]],
        ['Lo que no es', [
          'No es pereza: el perezoso no quiere hacer la tarea; el que procrastina sí quiere, pero no arranca. Y muchas veces se mantiene muy ocupado con otras cosas.',
          'No es aplazar con estrategia: esperar a tener la información, dejar enfriar una decisión o priorizar algo más urgente es planear, no procrastinar.',
          'No es solo mala administración del tiempo: puedes tener la agenda perfecta y aun así no empezar.',
        ]],
        ['Qué tan común es', [
          'Steel encontró que la gran mayoría de los universitarios procrastina en sus estudios y que una parte importante de los adultos lo hace de forma crónica.',
          'Se asocia con peores notas, más estrés, peor salud y peores finanzas (por ejemplo, ahorrar tarde o pagar multas por trámites aplazados).',
          'Es un problema humano común, no un defecto raro de tu personalidad: por eso hay ciencia y técnicas para manejarlo.',
        ]],
      ],
      ejemplos: [
        'Tienes que hacer la declaración de renta y sabes que si la dejas para el último día te puede tocar pagar sanción o hacerla con errores. Igual llevas tres semanas sin abrir la página de la DIAN. Eso es procrastinar: quieres hacerlo, sabes que aplazarlo te perjudica y no arrancas.',
        'Dejas para después la cita de la revisión técnico-mecánica porque estás esperando la quincena para pagarla. Eso no es procrastinar: es una decisión razonable con una razón concreta.',
      ],
      practica: [
        'Escribe 3 cosas que llevas tiempo aplazando y, para cada una, si de verdad quieres hacerla y si aplazarla te perjudica.',
        'Separa las que son aplazamiento con estrategia de las que son procrastinación.',
        'Escoge una sola de procrastinación para trabajar durante el curso y anótala en 🎯 Metas o en el diario.',
      ],
      pregunta: '¿Qué estoy aplazando que de verdad quiero hacer, y qué me cuesta aplazarlo?',
      nota: 'Hay quienes defienden la "procrastinación activa": personas que deciden dejar las cosas para el final porque trabajan bien con presión. Algunos estudios la describen, pero se discute si es procrastinación de verdad o simplemente aplazar con estrategia. Lo que sí está claro es que la procrastinación tal como la define Steel (aplazar sabiendo que te perjudica) se asocia con peores resultados y más malestar.',
      recordar: [
        ['¿Cómo define Steel la procrastinación?', 'Retrasar voluntariamente algo que pensabas hacer, aunque esperas estar peor por el retraso.'],
        ['¿En qué se diferencia de la pereza?', 'El perezoso no quiere hacer la tarea; quien procrastina sí quiere, pero no arranca.'],
        ['¿Cuándo aplazar no es procrastinar?', 'Cuando hay una razón estratégica: esperar información, priorizar algo más urgente o dejar enfriar una decisión.'],
        ['Nombra dos consecuencias asociadas a procrastinar.', 'Peores notas o resultados, más estrés, peor salud o peores finanzas.'],
      ],
      tarjetas: [
        ['Procrastinar (Steel, 2007)', 'Aplazar a propósito algo que quieres hacer, sabiendo que te va a ir peor por aplazarlo.'],
        ['Procrastinar no es pereza', 'El perezoso no quiere hacerlo; quien procrastina sí quiere, pero no arranca.'],
        ['Aplazar con estrategia', 'Esperar información o priorizar algo más urgente es planear, no procrastinar.'],
      ],
    }),
    l('Es un problema de emociones', 10, {
      idea: 'Aplazas para sentirte mejor ahora: la tarea te produce aburrimiento, ansiedad, duda o frustración, y evitarla alivia ese malestar por un rato. El precio lo paga tu yo del futuro.',
      bloques: [
        ['Huir del malestar', [
          'Sirois y Pychyl (2013) describen la procrastinación como priorizar el ánimo del momento sobre las metas de más largo plazo.',
          'Cuando piensas en la tarea, sientes algo incómodo. Abrir redes, limpiar o ver un video hace que ese malestar baje de inmediato.',
          'Ese alivio es la recompensa que refuerza el aplazamiento: la próxima vez, el cerebro vuelve a elegir el atajo.',
        ]],
        ['Si me siento mal, lo hago', [
          'Tice, Bratslavsky y Baumeister (2001) encontraron que, cuando las personas se sentían mal, cedían más a lo que les daba alivio inmediato.',
          'En uno de sus experimentos, cuando a las personas les hicieron creer que su ánimo no podía cambiar por un rato, dejaron de procrastinar tanto: ya no tenía sentido buscar alivio.',
          'Conclusión: el problema no es que "no te importe", sino que estás intentando manejar una emoción.',
        ]],
        ['El ciclo', [
          'Pienso en la tarea → siento malestar → la evito → siento alivio → la tarea sigue ahí, más cerca del plazo → siento más malestar.',
          'Encima aparece la culpa por haberla aplazado, que es otra emoción incómoda, y el ciclo se repite.',
          'Romperlo implica aprender a tolerar el malestar de empezar, no esperar a que desaparezca.',
        ]],
      ],
      ejemplos: [
        'Tienes que llamar a la EPS para pedir una cita y la idea de la musiquita, los menús y la espera te aburre y te da rabia. Abres el celular "un momento" y se va la tarde. No es que no te importe tu salud: estás evitando ese malestar.',
        'Tu jefe te pidió un informe y no sabes bien cómo empezar. Cada vez que abres el documento, sientes duda y cierras la ventana. El alivio dura minutos; la ansiedad vuelve más fuerte el día antes de entregar.',
      ],
      practica: [
        'Cuando hoy te descubras aplazando algo, detente y nombra la emoción: ¿aburrimiento, ansiedad, duda, frustración, resentimiento?',
        'Anota en el diario qué hiciste para escapar y cuánto duró el alivio.',
        'Pregúntate: "¿qué es exactamente lo que me molesta de esta tarea?" y escribe la respuesta en una línea.',
      ],
      pregunta: '¿Qué emoción estoy evitando cuando aplazo lo que más aplazo?',
      nota: 'Decir que la procrastinación es "un problema de emociones" no significa que sea solo eso: también influyen la impulsividad, la forma de la tarea y el entorno. Pero el enfoque emocional tiene buen respaldo y explica algo que la "falta de disciplina" no explica: por qué aplazamos justo lo que más nos importa.',
      recordar: [
        ['¿Qué buscas, sin darte cuenta, cuando procrastinas?', 'Sentirte mejor ya: aliviar el malestar que te produce la tarea.'],
        ['¿Qué mostraron Tice, Bratslavsky y Baumeister?', 'Que cuando nos sentimos mal cedemos más a lo que da alivio inmediato, y procrastinamos menos si creemos que el ánimo no va a cambiar.'],
        ['Describe el ciclo de la procrastinación.', 'Tarea → malestar → evitarla → alivio → la tarea sigue y se acerca el plazo → más malestar (y culpa).'],
        ['¿Qué implica romper el ciclo?', 'Aprender a tolerar el malestar de empezar, en lugar de esperar a que desaparezca.'],
      ],
      tarjetas: [
        ['Procrastinar = manejar emociones', 'Evitas la tarea para aliviar el aburrimiento, la ansiedad o la duda que te produce (Sirois y Pychyl, 2013).'],
        ['El ciclo', 'Malestar → evitar → alivio → la tarea sigue ahí → más malestar y culpa.'],
        ['Qué hacer al notar que aplazas', 'Nombra la emoción y pregúntate qué te molesta exactamente de la tarea.'],
      ],
    }),
    l('La ecuación de la motivación y tu yo del futuro', 11, {
      idea: 'Las recompensas que llegan ya pesan mucho más que las que llegan después. Por eso aplazamos lo que da frutos lejanos y lo dejamos para un "yo del futuro" al que sentimos como otra persona.',
      bloques: [
        ['La ecuación de Steel', [
          'Piers Steel y Cornelius König (2006) resumieron varias teorías en una ecuación: Motivación = (Expectativa × Valor) ÷ (Impulsividad × Demora).',
          'Expectativa: qué tan seguro estás de que te va a salir. Valor: qué tan agradable o importante es para ti.',
          'Impulsividad: qué tan fácil te distraes. Demora: cuánto falta para la recompensa.',
          'Cada parte es una palanca: subir la expectativa o el valor, o bajar la impulsividad o la demora, sube las ganas de hacerlo.',
        ]],
        ['El presente gana', [
          'George Ainslie (1975) describió que valoramos mucho más lo inmediato: una recompensa lejana pierde fuerza muy rápido a medida que se aleja.',
          'Por eso el plan de ahorrar suena bien en enero, pero en el momento de la compra gana el antojo.',
          'Cuando el plazo se acerca, la recompensa (o el castigo) se vuelve inmediata y por fin arrancas: de ahí el sprint de última hora.',
        ]],
        ['El yo del futuro', [
          'Hal Hershfield ha estudiado que muchas personas piensan en su yo del futuro casi como en un desconocido.',
          'Es más fácil dejarle el trabajo a un desconocido: "el lunes yo lo hago", como si el del lunes fuera otro.',
          'Quienes se sienten más conectados con su yo del futuro tienden a ahorrar más y a tomar decisiones más pacientes.',
        ]],
      ],
      ejemplos: [
        'Estudiar inglés tiene una recompensa lejana (un mejor trabajo en uno o dos años) y una demora enorme. Bajar la demora sería ponerte metas cortas con recompensa rápida: aprobar el nivel del mes, entender una canción, tener una conversación de 5 minutos.',
        '"El domingo empiezo la dieta" deja el esfuerzo a otro: al de domingo. Imaginar en detalle cómo se va a sentir ese tú del domingo (cansado, con antojos, sin haber hecho mercado) ayuda a ver que es la misma persona y a preparar algo hoy.',
      ],
      practica: [
        'Toma la tarea que estás aplazando y califica de 1 a 5 cada parte: expectativa, valor, impulsividad y demora.',
        'Escoge la parte más débil y escribe un cambio para mejorarla (por ejemplo, dividir para subir la expectativa o ponerte un plazo cercano para bajar la demora).',
        'Escribe una carta corta de tu yo de dentro de un año a tu yo de hoy sobre esa tarea.',
      ],
      pregunta: '¿Qué le estoy dejando a mi "yo del futuro" como si fuera otra persona?',
      nota: 'La ecuación de Steel es un resumen útil para pensar, no una fórmula que se pueda calcular con números exactos. Tampoco existe un "detox de dopamina" que cure la procrastinación: esa idea popular simplifica mal cómo funciona la dopamina en el cerebro. Lo que sí sirve es hacer más cercana la recompensa y menos tentadoras las distracciones.',
      recordar: [
        ['¿Cuál es la ecuación de la motivación de Steel y König?', 'Motivación = (Expectativa × Valor) ÷ (Impulsividad × Demora).'],
        ['¿Qué describió Ainslie sobre las recompensas?', 'Que valoramos mucho más lo inmediato, y una recompensa lejana pierde fuerza muy rápido.'],
        ['¿Por qué solemos arrancar justo antes del plazo?', 'Porque la recompensa o el castigo por fin se vuelven inmediatos.'],
        ['¿Qué relación hay entre el yo del futuro y procrastinar?', 'Si sientes a tu yo del futuro como un extraño, es más fácil dejarle el trabajo.'],
      ],
      tarjetas: [
        ['Ecuación de la motivación (Steel)', '(Expectativa × Valor) ÷ (Impulsividad × Demora). Cada parte es una palanca para cambiar.'],
        ['El presente gana', 'Lo inmediato pesa mucho más que lo lejano. Acerca las recompensas: metas cortas, plazos próximos.'],
        ['El yo del futuro (Hershfield)', 'Si lo sientes como un extraño, le dejas el trabajo. Imagínalo en detalle: es la misma persona.'],
      ],
    }),
  ],
};

const POR_QUE = {
  titulo: 'Por qué aplazas tú',
  objetivo: 'Reconocer qué tiene una tarea que te hace aplazarla, cómo el perfeccionismo y el miedo a fallar alimentan la procrastinación, y por qué la presión de última hora no es tu aliada.',
  fuentes: [
    ['Blunt, A. K. y Pychyl, T. A. (2000). Task aversiveness and procrastination: A multi-dimensional approach to task aversiveness across stages of personal projects. Personality and Individual Differences, 28(1), 153-167.', 'Qué características de una tarea la hacen más fácil de aplazar.'],
    ['Pychyl, T. A. (2013). Solving the Procrastination Puzzle: A concise guide to strategies for change. Tarcher/Penguin.', 'Las tareas aburridas, frustrantes, ambiguas o sin sentido personal.'],
    ['Sirois, F. M., Molnar, D. S. y Hirsch, J. K. (2017). A meta-analytic and conceptual update on the associations between procrastination and multidimensional perfectionism. European Journal of Personality, 31(2), 137-159.', 'Qué tipo de perfeccionismo se relaciona con aplazar y cuál no.'],
    ['Berglas, S. y Jones, E. E. (1978). Drug choice as a self-handicapping strategy in response to noncontingent success. Journal of Personality and Social Psychology, 36(4), 405-417.', 'El autosabotaje: ponerse obstáculos para tener una excusa si se falla.'],
    ['Tice, D. M. y Baumeister, R. F. (1997). Longitudinal study of procrastination, performance, stress, and health: The costs and benefits of dawdling. Psychological Science, 8(6), 454-458.', 'Aplazar alivia al principio y cuesta más al final.'],
    ['Ariely, D. y Wertenbroch, K. (2002). Procrastination, deadlines, and performance: Self-control by precommitment. Psychological Science, 13(3), 219-224.', 'Los plazos intermedios ayudan, y los impuestos desde afuera más que los propios.'],
    ['Kim, K. R. y Seo, E. H. (2015). The relationship between procrastination and academic performance: A meta-analysis. Personality and Individual Differences, 82, 26-33.', 'Procrastinar se asocia con un rendimiento académico algo menor.'],
  ],
  lecciones: [
    l('Las tareas que más aplazamos', 10, {
      idea: 'No aplazamos todo por igual: aplazamos las tareas aburridas, frustrantes, difíciles, poco claras o sin sentido para nosotros. Si sabes qué tiene la tarea que te repele, puedes cambiar justo eso.',
      bloques: [
        ['Lo que vuelve una tarea "aplazable"', [
          'Tim Pychyl y su equipo encontraron características que hacen más probable aplazar: que sea aburrida, frustrante, difícil, ambigua (no está claro qué hacer), poco estructurada, sin sentido personal o sin nada agradable en sí misma.',
          'Blunt y Pychyl (2000) vieron además que lo que repele cambia según la etapa: a veces cuesta empezar, otras veces cuesta terminar.',
          'Mientras más de esas características tenga la tarea, más fuerte es la tentación de escapar.',
        ]],
        ['Cada característica tiene su arreglo', [
          'Aburrida: júntala con algo agradable (música, un buen sitio) o conviértela en reto (¿cuánto hago en 20 minutos?).',
          'Ambigua o poco estructurada: escribe el primer paso concreto y una lista de pasos cortos.',
          'Difícil o frustrante: divídela en partes pequeñas y busca ayuda o un ejemplo de cómo se hace.',
          'Sin sentido: conéctala con algo que te importa ("esto me deja cobrar a tiempo", "esto me acerca al ascenso").',
        ]],
        ['Ambigüedad: la más traicionera', [
          'Muchas tareas no se aplazan por difíciles sino porque no está claro qué hacer primero: "organizar las finanzas", "arreglar lo del carro".',
          'La mente ve una nube grande y se va a lo que sí está claro (contestar mensajes, lavar la loza).',
          'Escribir el siguiente paso físico ("buscar los extractos de octubre en el correo") suele bastar para arrancar.',
        ]],
      ],
      ejemplos: [
        '"Actualizar la hoja de vida" es ambigua, aburrida y un poco angustiante. Al dividirla queda: "abrir el archivo viejo", "escribir los dos últimos trabajos", "pedirle a un amigo que la revise". El primer paso toma 2 minutos.',
        'Te aburre registrar los gastos en 💰 Finanzas. Lo vuelves un juego: cada noche, mientras se calienta la comida, registras el día en menos de un minuto y miras cuánto llevas en la categoría que más te preocupa.',
      ],
      practica: [
        'Toma la tarea que más aplazas y marca cuáles de estas tiene: aburrida, frustrante, difícil, ambigua, poco estructurada, sin sentido, sin nada agradable.',
        'Para la característica que más pesa, escribe un arreglo concreto.',
        'Escribe el primer paso físico de esa tarea, de menos de 5 minutos.',
      ],
      pregunta: '¿Qué tienen en común las tareas que más aplazo?',
      nota: 'Que una tarea sea aburrida o difícil no significa que tengas que esperar a que se vuelva agradable: muchas no lo van a ser nunca. El objetivo no es que te guste, sino bajar lo suficiente el malestar para empezar.',
      recordar: [
        ['Nombra al menos cuatro características que hacen una tarea más fácil de aplazar.', 'Aburrida, frustrante, difícil, ambigua, poco estructurada, sin sentido personal o sin nada agradable.'],
        ['¿Por qué la ambigüedad es tan traicionera?', 'Porque si no está claro qué hacer primero, la mente se va a lo que sí está claro.'],
        ['¿Cómo se arregla una tarea ambigua?', 'Escribiendo el siguiente paso físico concreto y una lista de pasos cortos.'],
        ['¿Cómo se arregla una tarea sin sentido?', 'Conectándola con algo que te importa.'],
      ],
      tarjetas: [
        ['Tareas que aplazamos', 'Aburridas, frustrantes, difíciles, ambiguas, poco estructuradas, sin sentido o sin nada agradable.'],
        ['Contra la ambigüedad', 'Escribe el siguiente paso físico: "buscar los extractos de octubre", no "organizar las finanzas".'],
        ['Arreglar lo que repele', 'Identifica la característica que más pesa en la tarea y cambia justo esa.'],
      ],
    }),
    l('Perfeccionismo, miedo a fallar y autosabotaje', 11, {
      idea: 'A veces aplazamos para protegernos: si no lo intento, no fallo; si lo hago a última hora, la culpa es del poco tiempo, no mía. Querer hacerlo perfecto no es el problema; el miedo a no estar a la altura sí.',
      bloques: [
        ['Dos caras del perfeccionismo', [
          'Sirois, Molnar y Hirsch (2017) revisaron decenas de estudios y separaron dos tipos de perfeccionismo.',
          'Las preocupaciones perfeccionistas (miedo a equivocarse, sentir que nada es suficiente, miedo al juicio de otros) se asocian con más procrastinación.',
          'Los esfuerzos perfeccionistas (ponerse estándares altos y trabajar por ellos) se asocian muy poco con procrastinar, e incluso un poco en contra.',
          'Conclusión: el problema no es querer hacerlo bien, sino el miedo a no estar a la altura.',
        ]],
        ['El autosabotaje', [
          'Berglas y Jones (1978) describieron el autosabotaje (self-handicapping): ponerse un obstáculo para tener una excusa si se falla.',
          'Dejar el estudio para la última noche protege la autoestima: si te va mal, fue por el poco tiempo, no porque no seas capaz.',
          'El costo: te va peor de verdad, y nunca sabes de qué eras capaz con todo tu esfuerzo.',
        ]],
        ['Cómo bajar el miedo', [
          'Haz una primera versión "mala" a propósito: el borrador feo, la primera serie con poco peso. Lo perfecto viene en las revisiones.',
          'Separa tu valor como persona del resultado de la tarea: un informe regular no te hace una persona regular.',
          'Pregúntate: "¿qué es lo peor que pasaría si lo hago a medias?". Casi siempre es menos grave que no hacerlo.',
          'Define antes qué es "suficientemente bueno" para esta tarea y cuándo la das por terminada.',
        ]],
      ],
      ejemplos: [
        'Llevas meses queriendo abrir tu emprendimiento de comidas, pero no publicas nada en redes "hasta tener el logo perfecto". Ese logo es una forma de no exponerte al juicio. Publicar la primera foto con un logo sencillo te deja aprender de clientes reales.',
        'Antes de un parcial importante, te quedas viendo series hasta la madrugada y estudias la última noche. Si te va mal, "fue porque no estudié". Es autosabotaje: protege tu orgullo hoy y te cuesta la nota.',
      ],
      practica: [
        'Escribe qué temes que pase si haces la tarea y no te sale bien.',
        'Define por escrito qué es "suficientemente bueno" para esa tarea.',
        'Haz hoy una primera versión mala a propósito de algo que estás aplazando (10 minutos).',
      ],
      pregunta: '¿Qué estoy aplazando para no tener que enfrentar la posibilidad de fallar?',
      nota: 'Se repite que "los perfeccionistas son los que más procrastinan". La evidencia es más fina: el perfeccionismo de preocupación (miedo, autocrítica) sí se asocia con aplazar, pero el de esfuerzo (estándares altos) casi no. Si el miedo a fallar o la autocrítica te paralizan con frecuencia, o vienen con ansiedad o tristeza fuertes, consulta con un psicólogo: la terapia cognitivo-conductual tiene buena evidencia para esto.',
      recordar: [
        ['¿Qué tipo de perfeccionismo se asocia con más procrastinación?', 'Las preocupaciones perfeccionistas: miedo a equivocarse, sentir que nada es suficiente y miedo al juicio.'],
        ['¿Y el perfeccionismo de esfuerzo?', 'Se asocia muy poco con procrastinar, e incluso un poco en contra.'],
        ['¿Qué es el autosabotaje según Berglas y Jones?', 'Ponerse un obstáculo para tener una excusa si se falla, y proteger así la autoestima.'],
        ['Nombra dos formas de bajar el miedo a fallar.', 'Hacer una primera versión mala a propósito, separar tu valor del resultado, preguntar qué es lo peor que pasaría o definir qué es suficientemente bueno.'],
      ],
      tarjetas: [
        ['Perfeccionismo y procrastinación', 'Aplaza más quien tiene miedo a no estar a la altura, no quien simplemente tiene estándares altos.'],
        ['Autosabotaje', 'Aplazar para tener una excusa si fallas. Protege el orgullo hoy y cuesta el resultado.'],
        ['Primera versión mala', 'Hazla a propósito: lo perfecto llega en las revisiones, no en el primer intento.'],
      ],
    }),
    l('Plazos, presión y el mito de "trabajo mejor bajo presión"', 10, {
      idea: 'Aplazar se siente bien al principio y se paga caro al final. Casi nadie trabaja mejor a última hora: lo que pasa es que a última hora por fin trabaja. Los plazos intermedios son la herramienta.',
      bloques: [
        ['El costo diferido', [
          'Tice y Baumeister (1997) siguieron a estudiantes durante un semestre.',
          'Al principio, los que más procrastinaban tenían menos estrés y menos síntomas de enfermedad que los demás.',
          'Al final del semestre se invertía: más estrés, más síntomas, y sacaron peores notas.',
          'Sumando todo el semestre, procrastinar no les ahorró malestar: solo lo movió al final y lo hizo más grande.',
        ]],
        ['¿Trabajas mejor bajo presión?', [
          'Un metaanálisis (Kim y Seo, 2015) encontró que procrastinar se asocia con un rendimiento académico algo menor, en promedio.',
          'La sensación de "trabajo mejor con presión" viene de que la presión por fin te hace arrancar y concentrarte, y del alivio de haber terminado.',
          'Lo que no ves es la versión que habrías hecho con tiempo para revisar, preguntar y corregir.',
        ]],
        ['Plazos que ayudan', [
          'Ariely y Wertenbroch (2002) pusieron a estudiantes a entregar tres trabajos con plazos distintos.',
          'A quienes les pusieron plazos repartidos durante el semestre les fue mejor que a quienes tenían un solo plazo al final.',
          'Los que podían escoger sus propios plazos se pusieron algunos intermedios (sabían que procrastinan), pero les fue un poco peor que con plazos impuestos desde afuera.',
          'En la práctica: divide los proyectos en entregas cortas y, si puedes, comprométete con otra persona (un compañero, tu jefe, un amigo).',
        ]],
      ],
      ejemplos: [
        'Tienes que entregar la tesis en 3 meses. En lugar de un solo plazo, acuerdas con tu director entregar un capítulo cada 3 semanas. Cada entrega es un "final" pequeño que te hace arrancar.',
        'Siempre sacas la declaración de renta el último día y pagas con estrés. Este año te pones una cita contigo y con un amigo contador para dos semanas antes, y la anotas en 🔔 Recordatorios.',
      ],
      practica: [
        'Divide un proyecto que estás aplazando en 3 a 5 entregas con fecha.',
        'Comparte una de esas fechas con otra persona que te vaya a preguntar.',
        'Pon las fechas en el calendario o en Recordatorios.',
      ],
      pregunta: '¿En qué me digo "trabajo mejor bajo presión" para justificar dejarlo para el final?',
      nota: 'Algunas personas sí rinden bien con plazos cercanos, y un poco de presión ayuda a concentrarse. Pero la evidencia promedio es clara: aplazar se asocia con resultados algo peores y más estrés al final. Si te pasa en todos los ámbitos de la vida desde hace años (estudio, trabajo, trámites, citas médicas), con mucha distracción e impulsividad, vale la pena consultar a un profesional para descartar un trastorno de atención (TDAH), que también se da en adultos y tiene tratamiento.',
      recordar: [
        ['¿Qué encontraron Tice y Baumeister al seguir a estudiantes que procrastinaban?', 'Menos estrés al principio, pero más estrés, más síntomas y peores notas al final.'],
        ['¿Qué dice el metaanálisis de Kim y Seo?', 'Que procrastinar se asocia con un rendimiento académico algo menor, en promedio.'],
        ['¿Qué mostraron Ariely y Wertenbroch sobre los plazos?', 'Que los plazos repartidos funcionan mejor que uno solo al final, y los impuestos desde afuera algo mejor que los propios.'],
        ['¿De dónde viene la sensación de "trabajo mejor bajo presión"?', 'De que la presión por fin te hace arrancar y del alivio de terminar; no ves la versión que habrías hecho con tiempo.'],
      ],
      tarjetas: [
        ['El costo diferido (Tice y Baumeister)', 'Procrastinar da menos estrés al principio y más al final, con peores resultados.'],
        ['"Trabajo mejor bajo presión"', 'En promedio, no: a última hora por fin trabajas, pero sin tiempo para revisar ni corregir.'],
        ['Plazos intermedios (Ariely y Wertenbroch)', 'Divide en entregas cortas, mejor si alguien más las conoce o te las exige.'],
      ],
    }),
  ],
};

const SALIR = {
  titulo: 'Salir del ciclo',
  objetivo: 'Arrancar aunque no tengas ganas, tratarte con amabilidad cuando aplazas para no repetirlo y armar tu propio plan contra la procrastinación, sabiendo cuándo pedir ayuda.',
  fuentes: [
    ['Owens, S. G., Bowman, C. G. y Dill, C. A. (2008). Overcoming procrastination: The effect of implementation intentions. Journal of Applied Social Psychology, 38(2), 366-384.', 'Los planes de "cuándo y dónde" ayudan a quienes procrastinan.'],
    ['Wohl, M. J. A., Pychyl, T. A. y Bennett, S. H. (2010). I forgive myself, now I can study: How self-forgiveness for procrastinating can reduce future procrastination. Personality and Individual Differences, 48(7), 803-808.', 'Perdonarse por haber aplazado se asoció con aplazar menos la vez siguiente.'],
    ['Sirois, F. M. (2014). Procrastination and stress: Exploring the role of self-compassion. Self and Identity, 13(2), 128-145.', 'La autocompasión se asocia con menos estrés en quienes procrastinan.'],
    ['Blouin-Hudon, E.-M. C. y Pychyl, T. A. (2015). Experiencing the temporally extended self: Initial support for the role of affective states, vivid mental imagery, and future self-continuity in the prediction of academic procrastination. Personality and Individual Differences, 86, 50-56.', 'Imaginar vívidamente al yo del futuro se relaciona con procrastinar menos.'],
    ['Rozental, A. y Carlbring, P. (2014). Understanding and treating procrastination: A review of a common self-regulatory failure. Psychology, 5(13), 1488-1502.', 'Revisión de qué tratamientos tienen evidencia.'],
    ['Rozental, A., Forsell, E., Svensson, A., Andersson, G. y Carlbring, P. (2015). Internet-based cognitive-behavior therapy for procrastination: A randomized controlled trial. Journal of Consulting and Clinical Psychology, 83(4), 808-824.', 'La terapia cognitivo-conductual por internet redujo la procrastinación.'],
    ['Ariely, D. y Wertenbroch, K. (2002). Procrastination, deadlines, and performance: Self-control by precommitment. Psychological Science, 13(3), 219-224.', 'Comprometerse por adelantado con plazos.'],
  ],
  lecciones: [
    l('Empezar sin tener ganas', 10, {
      idea: 'Las ganas casi nunca llegan antes de empezar: suelen llegar después. El truco es hacer el arranque tan pequeño y tan concreto que el malestar sea tolerable, y empezar con la emoción encima.',
      bloques: [
        ['No esperes a tener ganas', [
          'Una trampa común es pensar "lo hago cuando me sienta con ánimo". Si la tarea produce malestar, ese momento puede no llegar nunca.',
          'Tim Pychyl lo resume así: no tienes que sentirte bien para empezar; puedes sentir el malestar y empezar igual.',
          'Muchas veces, a los pocos minutos de arrancar, la tarea resulta menos mala de lo que anticipabas y el malestar baja.',
        ]],
        ['El siguiente paso más pequeño', [
          'Pregúntate: "¿cuál es la acción más pequeña y concreta que puedo hacer ahora?": abrir el archivo, escribir el título, sacar los papeles.',
          'Comprométete solo con unos minutos ("trabajo 5 minutos y después decido si sigo"). Lo difícil es empezar; seguir suele ser más fácil.',
          'Si tampoco arrancas así, el paso todavía es muy grande: divídelo más.',
        ]],
        ['Cuándo y dónde', [
          'Owens y otros (2008) encontraron que formular un plan de cuándo y dónde (como los "si-entonces" del curso de Hábitos) ayudó a quienes procrastinaban a cumplir.',
          'Ponle hora y lugar al primer paso: "Mañana a las 7 a. m., en el escritorio, abro el informe y escribo el título".',
          'Prepara el entorno la noche anterior: el archivo abierto, el celular cargando en otro cuarto.',
        ]],
      ],
      ejemplos: [
        'Llevas semanas sin ordenar el clóset. Te dices "solo saco la ropa que ya no me queda de un cajón". Terminas organizando dos cajones porque, una vez empezaste, ya no daba tanta pereza.',
        'Tienes que llamar a cobrarle a un cliente que te debe y te da incomodidad. Pones la hora: "a las 10 a. m., después del tinto, lo llamo". Sientes los nervios igual, pero marcas. La llamada dura 3 minutos.',
      ],
      practica: [
        'Escribe la acción más pequeña posible de la tarea que aplazas (menos de 5 minutos).',
        'Ponle hora y lugar para hoy o mañana.',
        'Cuando llegue la hora, empieza aunque sientas malestar y trabaja solo 5 minutos. Después anota cómo te sentiste.',
      ],
      pregunta: '¿Qué estoy esperando sentir antes de empezar, y qué pasaría si empezara sin sentirlo?',
      nota: 'Hay muchos "trucos" populares para arrancar (contar hasta cinco y lanzarse, entre otros) que pueden servirle a alguien, pero no tienen estudios que los respalden por sí solos. Lo que sí tiene apoyo es dividir la tarea, ponerle cuándo y dónde, y aceptar que el malestar viene contigo en lugar de esperar a que se vaya.',
      recordar: [
        ['¿Por qué esperar a tener ganas es una trampa?', 'Porque si la tarea produce malestar, las ganas pueden no llegar nunca; suelen llegar después de empezar.'],
        ['¿Qué hacer si no logras arrancar con el paso que escogiste?', 'Dividirlo más: el paso todavía es muy grande.'],
        ['¿Qué encontraron Owens y otros (2008)?', 'Que un plan de cuándo y dónde ayudó a quienes procrastinaban a cumplir.'],
        ['¿Qué es comprometerse "solo con 5 minutos"?', 'Empezar con un compromiso mínimo, sabiendo que lo difícil es arrancar y seguir suele ser más fácil.'],
      ],
      tarjetas: [
        ['Las ganas llegan después', 'No esperes a sentirte bien para empezar: empieza con el malestar encima.'],
        ['El siguiente paso más pequeño', 'Una acción de menos de 5 minutos. Si no arrancas, divídela más.'],
        ['Cuándo y dónde', 'Ponle hora y lugar al primer paso y deja el entorno listo la noche anterior.'],
      ],
    }),
    l('Perdonarte y hablarte bien', 10, {
      idea: 'Castigarte por haber aplazado no te hace aplazar menos: agrega culpa, que es otra emoción de la que vas a querer escapar. Perdonarte y tratarte con amabilidad ayuda a volver a la tarea.',
      bloques: [
        ['El estudio del perdón', [
          'Wohl, Pychyl y Bennett (2010) siguieron a universitarios entre dos parciales.',
          'Quienes se perdonaron más por haber procrastinado para el primer parcial procrastinaron menos para el segundo.',
          'La explicación: perdonarse bajó las emociones negativas asociadas al estudio, y así fue más fácil volver a él.',
        ]],
        ['Autocompasión no es dejarse', [
          'Fuschia Sirois (2014) encontró que quienes procrastinan suelen tener menos autocompasión, y que la autocompasión se asocia con menos estrés.',
          'Autocompasión es tratarte como tratarías a un buen amigo que se equivocó: con amabilidad, reconociendo que a todos nos pasa y sin dramatizar.',
          'No es justificarte ni bajar tus estándares: es quitarle peso emocional al error para poder corregirlo.',
        ]],
        ['Cómo hablarte', [
          'En vez de "soy un desastre, nunca hago nada", prueba: "Aplacé esto porque me generaba ansiedad. Le pasa a mucha gente. ¿Cuál es el siguiente paso?".',
          'Nota el diálogo interno que aparece cuando aplazas y escríbelo tal cual: verlo escrito ayuda a notar lo duro que es.',
          'Termina siempre con una acción concreta: el perdón sirve si te devuelve a la tarea.',
        ]],
      ],
      ejemplos: [
        'No fuiste al gym en toda la semana. En vez de pensar "no tengo disciplina, para qué sigo", te dices: "Fue una semana pesada en el trabajo. Mañana voy, aunque sea a hacer media rutina". Al día siguiente vas.',
        'Se te pasó la fecha de pago de la tarjeta por aplazar y pagaste intereses. Te perdonas el error, anotas lo que aprendiste y programas el pago automático en el banco. El regaño no te habría evitado el próximo atraso; el cambio sí.',
      ],
      practica: [
        'Recuerda la última vez que aplazaste algo y escribe lo que te dijiste a ti mismo.',
        'Reescríbelo como se lo dirías a un buen amigo, terminando con un siguiente paso.',
        'La próxima vez que te descubras aplazando hoy, usa esa nueva frase en voz baja y haz el siguiente paso.',
      ],
      pregunta: '¿Cómo me hablo cuando aplazo algo, y le hablaría así a alguien que quiero?',
      nota: 'El estudio del perdón (Wohl y otros, 2010) fue con un solo grupo de universitarios y es correlacional: muestra una asociación, no prueba causa. Pero coincide con otros estudios sobre autocompasión y con la idea de que la procrastinación es una forma de evitar emociones. La autocompasión no reemplaza la responsabilidad: es una forma de volver a ella más rápido. Si la autocrítica es constante y viene con tristeza profunda, falta de energía o pérdida de interés por casi todo, consulta a un profesional: puede haber depresión, y se trata.',
      recordar: [
        ['¿Qué encontraron Wohl, Pychyl y Bennett?', 'Que los estudiantes que se perdonaron por procrastinar para un parcial procrastinaron menos para el siguiente.'],
        ['¿Por qué castigarte no ayuda?', 'Porque agrega culpa, otra emoción incómoda de la que vas a querer escapar.'],
        ['¿Qué es la autocompasión?', 'Tratarte como tratarías a un buen amigo que se equivocó: con amabilidad, sin dramatizar y reconociendo que a todos nos pasa.'],
        ['¿Cómo debe terminar una buena conversación contigo mismo después de aplazar?', 'Con un siguiente paso concreto.'],
      ],
      tarjetas: [
        ['Perdonarte (Wohl y otros, 2010)', 'Perdonarte por haber aplazado se asoció con aplazar menos la vez siguiente.'],
        ['Autocompasión', 'Tratarte como a un buen amigo que se equivocó. No es justificarte: es quitarle peso al error para corregirlo.'],
        ['Después de aplazar', '"Lo aplacé porque me generaba X. Le pasa a mucha gente. ¿Cuál es el siguiente paso?"'],
      ],
    }),
    l('Tu plan contra la procrastinación', 12, {
      idea: 'Salir de la procrastinación no es un truco sino un sistema: saber qué aplazas y por qué, preparar el arranque, comprometerte con plazos y revisar cada semana. Si es crónica y te afecta mucho, la terapia funciona.',
      bloques: [
        ['Las piezas del plan', [
          'Detectar: lleva unos días un registro de qué aplazas, qué emoción aparece y qué haces para escapar.',
          'Preparar: para cada tarea importante, el siguiente paso pequeño con hora y lugar.',
          'Comprometer: plazos intermedios y, si puedes, alguien que te los pregunte (Ariely y Wertenbroch, 2002).',
          'Proteger: quita las distracciones de siempre (celular lejos, apps fuera de la pantalla principal), como viste en el curso de Hábitos.',
          'Revisar: cada semana, mira qué aplazaste, qué funcionó y ajusta una cosa.',
        ]],
        ['Conectar con tu yo del futuro', [
          'Blouin-Hudon y Pychyl (2015) encontraron que quienes imaginan con más detalle y viveza a su yo del futuro tienden a procrastinar menos.',
          'Antes de aplazar, imagina en detalle a tu yo de mañana o del día del plazo: cómo se va a sentir, qué va a tener que hacer.',
          'También puedes hacerle un favor concreto: dejarle el primer paso hecho.',
        ]],
        ['Cuándo pedir ayuda', [
          'Rozental y su equipo (2015) probaron una terapia cognitivo-conductual por internet para la procrastinación y encontraron que la redujo, frente a un grupo que esperaba.',
          'Busca a un profesional si la procrastinación es crónica y te está costando cosas importantes (el trabajo, el estudio, la salud, la plata).',
          'También si viene con ansiedad fuerte, tristeza persistente o si te pasa desde niño en todas las áreas, con mucha distracción: puede haber depresión, ansiedad o TDAH, y todos tienen tratamiento.',
          'Pedir ayuda no es fracasar: es usar la herramienta con más evidencia.',
        ]],
      ],
      ejemplos: [
        'Tu plan: los domingos escoges las 3 tareas que más vas a querer aplazar; a cada una le pones el primer paso, la hora y el lugar; le cuentas a tu pareja cuál es la más difícil; y el siguiente domingo revisas qué pasó.',
        'Llevas años aplazando todo, perdiste un trabajo por entregas tardías y te sientes sin energía. En vez de buscar otra app de productividad, pides cita con un psicólogo por tu EPS o tu caja de compensación. Es la decisión con más evidencia.',
      ],
      practica: [
        'Durante 3 días, anota cada vez que aplazas: qué tarea, qué emoción y qué hiciste en su lugar.',
        'Escribe tu plan en 5 líneas: detectar, preparar, comprometer, proteger y revisar.',
        'Agenda tu primera revisión semanal contra la procrastinación en el calendario o en Recordatorios.',
      ],
      pregunta: '¿Qué me está costando la procrastinación, y es momento de pedir ayuda profesional?',
      nota: 'Hay muchas apps, métodos y libros que prometen acabar con la procrastinación "para siempre". La evidencia muestra algo más modesto: varias técnicas ayudan, sobre todo combinadas, y la terapia cognitivo-conductual tiene los mejores resultados en estudios controlados, aunque todavía son relativamente pocos. Vas a volver a aplazar cosas; el objetivo es aplazar menos lo importante y volver más rápido.',
      recordar: [
        ['¿Cuáles son las cinco piezas del plan contra la procrastinación?', 'Detectar, preparar, comprometer, proteger y revisar.'],
        ['¿Qué encontraron Blouin-Hudon y Pychyl sobre el yo del futuro?', 'Que imaginarlo con más detalle y viveza se asocia con procrastinar menos.'],
        ['¿Qué mostró el estudio de Rozental y su equipo (2015)?', 'Que una terapia cognitivo-conductual por internet redujo la procrastinación.'],
        ['¿Cuándo conviene buscar ayuda profesional?', 'Cuando es crónica y te cuesta cosas importantes, o viene con ansiedad, tristeza persistente o mucha distracción desde siempre.'],
      ],
      tarjetas: [
        ['Plan contra la procrastinación', 'Detectar (qué y por qué), preparar (paso pequeño con hora), comprometer (plazos), proteger (sin distracciones) y revisar.'],
        ['Un favor a tu yo del futuro', 'Imagínalo en detalle y déjale el primer paso hecho.'],
        ['Cuándo pedir ayuda', 'Si es crónica y te cuesta mucho, o viene con ansiedad, tristeza o distracción de siempre: la terapia cognitivo-conductual funciona.'],
      ],
    }),
  ],
};

export default {
  id: 'procrastinacion',
  nombre: 'Ciencia de la procrastinación',
  area: 'habitos',
  icono: '⏳',
  nivel: 'Básico',
  paraQue: 'Entender por qué aplazas lo que de verdad quieres hacer (no es pereza: es una forma de huir de emociones incómodas) y aprender lo que funciona para salir del ciclo. Complementa el curso de Hábitos: aquel te ayuda a construir rutinas; este, a arrancar cuando una tarea te repele.',
  modulos: [QUE_ES, POR_QUE, SALIR],
  proyecto: {
    titulo: 'Tres semanas para sacar adelante lo que más aplazas',
    intro: 'Vas a escoger la tarea o el proyecto que más llevas aplazando y, en 3 semanas, sacarlo adelante usando lo del curso, mientras aprendes cómo funciona tu propia procrastinación.',
    pasos: [
      'Escoge la tarea o proyecto que más llevas aplazando y que de verdad quieres hacer.',
      'Durante los primeros 3 días, registra cada vez que lo aplazas: qué emoción aparece y qué haces en su lugar.',
      'Marca qué características de la tarea te repelen (aburrida, ambigua, difícil…) y escribe un arreglo para cada una.',
      'Divide el proyecto en entregas con fecha a lo largo de las 3 semanas y compártelas con alguien que te las vaya a preguntar.',
      'Cada día, define el siguiente paso pequeño con hora y lugar, y empieza aunque no tengas ganas (mínimo 5 minutos).',
      'Cuando aplaces, usa tu frase de autocompasión y vuelve al siguiente paso.',
      'Cada domingo, revisa qué funcionó, qué no y ajusta una sola cosa.',
      'Al terminar, escribe qué aprendiste de tu forma de procrastinar y qué parte del plan te quedas para siempre.',
    ],
  },
};
