// Neurociencia del desarrollo: cómo se forma el cerebro desde el embarazo hasta la adultez. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const COMIENZO = {
  titulo: 'El comienzo: del embarazo a los primeros años',
  objetivo: 'Entender cómo se construye el cerebro antes y después del nacimiento, qué pasa con las conexiones en los primeros años y por qué el vínculo y el estrés temprano importan tanto (sin caer en el mito de que todo se define antes de los 3 años).',
  fuentes: [
    ['Stiles, J. y Jernigan, T. L. (2010). The basics of brain development. Neuropsychology Review, 20(4), 327-348.', 'Resumen claro de cómo se desarrolla el cerebro.'],
    ['MRC Vitamin Study Research Group (1991). Prevention of neural tube defects: Results of the Medical Research Council Vitamin Study. The Lancet, 338(8760), 131-137.', 'El ácido fólico previene defectos del tubo neural.'],
    ['Huttenlocher, P. R. y Dabholkar, A. S. (1997). Regional differences in synaptogenesis in human cerebral cortex. Journal of Comparative Neurology, 387(2), 167-178.', 'Producción y poda de sinapsis en la infancia.'],
    ['Bruer, J. T. (1999). The Myth of the First Three Years. Free Press.', 'Crítica a la idea de que todo se define antes de los 3 años.'],
    ['Bowlby, J. (1969). Attachment and Loss, Vol. 1: Attachment. Basic Books.', 'La teoría del apego.'],
    ['Ainsworth, M. D. S., Blehar, M. C., Waters, E. y Wall, S. (1978). Patterns of Attachment. Erlbaum.', 'Los estilos de apego y la "situación extraña".'],
    ['Nelson, C. A. et al. (2007). Cognitive recovery in socially deprived young children: The Bucharest Early Intervention Project. Science, 318(5858), 1937-1940.', 'Niños de orfanatos rumanos: el cuidado familiar temprano ayudó a recuperarse.'],
    ['Shonkoff, J. P. et al. (2012). The lifelong effects of early childhood adversity and toxic stress. Pediatrics, 129(1), e232-e246.', 'El estrés tóxico en la infancia y sus efectos.'],
  ],
  lecciones: [
    l('Antes de nacer', 10, {
      idea: 'El cerebro empieza a formarse en las primeras semanas del embarazo, muchas veces antes de que la mamá sepa que está embarazada. Lo que pasa en ese tiempo (nutrición, alcohol, infecciones, estrés) deja huella.',
      bloques: [
        ['Cómo se forma', [
          'En las primeras semanas se forma el tubo neural, del que salen el cerebro y la médula espinal (Stiles y Jernigan, 2010).',
          'Después, las neuronas se producen en grandes cantidades y "viajan" hasta su lugar en la corteza.',
          'Al nacer, el bebé tiene casi todas las neuronas que tendrá, pero muchas de sus conexiones todavía están por formarse.',
        ]],
        ['El ácido fólico', [
          'Un gran ensayo del Medical Research Council británico (1991) mostró que tomar ácido fólico antes y al comienzo del embarazo reduce mucho los defectos del tubo neural, como la espina bífida.',
          'Como el tubo neural se cierra muy temprano, se recomienda tomarlo desde antes de buscar el embarazo.',
          'En Colombia, como en otros países, algunas harinas se fortifican con ácido fólico, pero los médicos suelen recomendar el suplemento.',
        ]],
        ['Lo que daña', [
          'El alcohol durante el embarazo puede causar el trastorno del espectro alcohólico fetal: problemas de aprendizaje, atención y conducta. No se conoce una cantidad segura.',
          'El cigarrillo, algunas drogas, ciertas infecciones (como el zika) y algunos medicamentos también pueden afectar el desarrollo.',
          'El control prenatal temprano permite detectar y prevenir muchos de estos riesgos.',
        ]],
      ],
      ejemplos: [
        'Tu hermana y su pareja están pensando en tener un bebé. Uno de los consejos con más evidencia es que ella empiece a tomar ácido fólico (con indicación médica) desde ya, no cuando salga positiva la prueba.',
        'En una reunión, a una amiga embarazada le dicen "una cervecita no hace nada". La evidencia dice que no se conoce una cantidad segura de alcohol en el embarazo, así que lo más seguro es no tomar.',
      ],
      practica: [
        'Si tú o tu pareja piensan tener hijos, anota preguntar en la próxima cita médica por el ácido fólico.',
        'Comparte con alguien cercano que está embarazada (o planeando) la importancia del control prenatal temprano.',
        'Escribe un mito sobre el embarazo que hayas oído y busca qué dice la evidencia.',
      ],
      pregunta: '¿Qué creencias sobre el embarazo he repetido sin saber si tienen respaldo?',
      nota: 'Se venden audios y programas para "estimular la inteligencia del bebé en el vientre" con música clásica. No hay buena evidencia de que hagan al bebé más inteligente. Lo que sí tiene respaldo es aburrido pero poderoso: control prenatal, buena nutrición (incluido el ácido fólico), no alcohol ni cigarrillo, y cuidar la salud mental de la mamá. Esta lección no reemplaza la consulta médica.',
      recordar: [
        ['¿Qué estructura temprana da origen al cerebro y la médula?', 'El tubo neural.'],
        ['¿Qué mostró el estudio del Medical Research Council (1991)?', 'Que el ácido fólico reduce mucho los defectos del tubo neural.'],
        ['¿Por qué se recomienda el ácido fólico antes del embarazo?', 'Porque el tubo neural se cierra muy temprano, a veces antes de saber del embarazo.'],
        ['¿Hay una cantidad segura de alcohol en el embarazo?', 'No se conoce una cantidad segura.'],
      ],
      tarjetas: [
        ['Ácido fólico', 'Desde antes de buscar el embarazo: reduce mucho los defectos del tubo neural (espina bífida).'],
        ['Alcohol y embarazo', 'No se conoce una cantidad segura; puede causar el trastorno del espectro alcohólico fetal.'],
        ['Música para el bebé en el vientre', 'No hay buena evidencia de que lo haga más inteligente. Sí la hay para control prenatal y nutrición.'],
      ],
    }),
    l('Los primeros años: conexiones y poda', 10, {
      idea: 'En la primera infancia, el cerebro crea conexiones a enorme velocidad y luego elimina las que no usa. La experiencia decide qué se queda, pero eso no significa que todo se defina antes de los 3 años.',
      bloques: [
        ['Producir y podar', [
          'Huttenlocher y Dabholkar (1997) contaron sinapsis en cerebros humanos de distintas edades: en los primeros años aumentan mucho y después disminuyen.',
          'Esa disminución es la "poda": las conexiones que se usan se fortalecen y las que no, se eliminan. Es como podar un árbol para que crezca mejor.',
          'Las zonas sensoriales (visión, oído) llegan a su pico antes; las del lenguaje y la planeación, más tarde.',
        ]],
        ['La mielina', [
          'La mielina es una capa que recubre las conexiones y hace que las señales viajen más rápido.',
          'Se forma desde la infancia hasta la adultez temprana, empezando por las zonas del movimiento y los sentidos y terminando por las de la planeación.',
          'Por eso un niño pequeño reacciona y planea más despacio que un adulto: sus "cables" todavía se están aislando.',
        ]],
        ['El mito de los 3 años', [
          'John Bruer (1999) criticó la idea popular de que "todo se decide en los primeros 3 años" y de que hay que sobreestimular a los bebés.',
          'Los primeros años son muy importantes, pero el cerebro sigue cambiando mucho durante toda la niñez y la adolescencia.',
          'Lo que más necesita un bebé no son tarjetas ni videos educativos, sino interacción cálida, juego, sueño y una nutrición adecuada.',
        ]],
      ],
      ejemplos: [
        'Una mamá se angustia porque su bebé de 2 años no fue a un jardín "de estimulación temprana" y cree que ya quedó en desventaja. La evidencia dice que lo que más importa es que le hablen, jueguen con él y lo cuiden con cariño, cosas que puede hacer en casa.',
        'Tu sobrino de 4 años se demora mucho en responder cuando le preguntas algo complicado. No es "lento": sus conexiones de planeación están en plena construcción, y eso es normal a su edad.',
      ],
      practica: [
        'Si tienes niños pequeños cerca, dedica hoy 15 minutos a jugar con ellos sin pantallas, siguiendo lo que ellos proponen.',
        'Escribe qué cosas crees que "hay que hacer" para estimular a un bebé y marca cuáles tienen evidencia.',
        'Habla con algún familiar sobre el mito de los 3 años para bajar la angustia de "ya es tarde".',
      ],
      pregunta: '¿Qué presión innecesaria he sentido (o puesto en otros) sobre la "estimulación temprana"?',
      nota: 'Las cifras de "un millón de conexiones nuevas por segundo" circulan mucho; son estimaciones aproximadas, útiles para transmitir la idea de rapidez, no medidas exactas. Y la poda no es "perder" capacidad: es parte de un desarrollo sano. Algunos trastornos del desarrollo parecen relacionarse con una poda distinta, pero eso sigue en investigación.',
      recordar: [
        ['¿Qué es la poda sináptica?', 'Eliminar las conexiones que no se usan y fortalecer las que sí, durante la infancia y la adolescencia.'],
        ['¿Qué encontraron Huttenlocher y Dabholkar?', 'Que las sinapsis aumentan mucho en los primeros años y después disminuyen, en distinto momento según la zona.'],
        ['¿Qué hace la mielina?', 'Recubre las conexiones para que las señales viajen más rápido; termina de formarse en la adultez temprana.'],
        ['¿Qué criticó Bruer?', 'La idea de que todo se decide en los primeros 3 años y de que hay que sobreestimular a los bebés.'],
      ],
      tarjetas: [
        ['Poda sináptica', 'El cerebro crea muchas conexiones y luego elimina las que no usa. Es parte de un desarrollo sano.'],
        ['Mielina', 'Aísla las conexiones para que vayan más rápido; las zonas de planeación son las últimas.'],
        ['El mito de los 3 años (Bruer)', 'Los primeros años importan mucho, pero el cerebro sigue cambiando toda la niñez y la adolescencia.'],
      ],
    }),
    l('Vínculo, cuidado y estrés temprano', 11, {
      idea: 'Un bebé necesita al menos un adulto que lo cuide de forma cálida y estable. El estrés fuerte y sostenido sin ese apoyo puede afectar el desarrollo; un cuidado estable protege y ayuda a recuperarse.',
      bloques: [
        ['El apego', [
          'John Bowlby (1969) propuso que los bebés están hechos para buscar la cercanía de un cuidador cuando sienten miedo o malestar.',
          'Mary Ainsworth (1978) observó cómo reaccionaban bebés al separarse y reencontrarse con su mamá en un laboratorio ("la situación extraña"), y describió estilos de apego seguro e inseguro.',
          'Un apego seguro se construye con respuestas sensibles y consistentes: consolar cuando llora, jugar, estar disponible. No requiere perfección.',
        ]],
        ['Estrés tóxico', [
          'Shonkoff y otros (2012) diferencian el estrés positivo (breve, como una vacuna), el tolerable (fuerte pero con apoyo de un adulto) y el tóxico (fuerte, frecuente y sin apoyo).',
          'El estrés tóxico, como el maltrato, el abandono o la violencia constante, puede alterar el desarrollo del cerebro y la salud a largo plazo.',
          'El factor que más protege es una relación estable con al menos un adulto que cuide.',
        ]],
        ['Se puede recuperar', [
          'El Proyecto de Intervención Temprana de Bucarest (Nelson y otros, 2007) siguió a niños que vivían en orfanatos en Rumania. A algunos se les asignó al azar un hogar de acogida.',
          'Los niños que pasaron a familias mostraron mejoras en su desarrollo cognitivo, y las mejoras eran mayores cuanto antes salían del orfanato.',
          'El mensaje es doble: el cuidado temprano importa mucho, y nunca es tarde para mejorar las condiciones de un niño.',
        ]],
      ],
      ejemplos: [
        'Tu prima tiene miedo de "malcriar" a su bebé si lo alza cada vez que llora. La investigación sobre el apego dice que responder con calidez a un bebé no lo malcría: le enseña que el mundo es un lugar seguro.',
        'En el barrio hay un niño que vive en una casa con mucha violencia, pero tiene una abuela que lo cuida, lo escucha y lo lleva al colegio. Esa relación estable es un factor de protección enorme para su desarrollo.',
      ],
      practica: [
        'Si cuidas niños, nota hoy cómo respondes cuando lloran o tienen miedo: ¿consuelas o regañas?',
        'Piensa en un adulto que fue tu "base segura" en la infancia y escribe qué hacía.',
        'Si conoces un niño en una situación difícil, piensa en una forma concreta y respetuosa de ser un adulto estable en su vida.',
      ],
      pregunta: '¿Quién fue mi base segura de niño, y para quién lo soy yo hoy?',
      nota: 'Se usan mucho los "estilos de apego" para explicar las relaciones de pareja adultas ("es ansioso", "es evitativo"). Hay investigación sobre el apego adulto, pero en redes sociales se simplifica demasiado y se usa para etiquetar a la gente. Tampoco es cierto que un estilo de apego temprano te condene: puede cambiar con relaciones y experiencias nuevas. Si sospechas que un niño sufre maltrato, en Colombia puedes reportarlo al ICBF (línea 141).',
      recordar: [
        ['¿Qué propuso Bowlby sobre el apego?', 'Que los bebés están hechos para buscar la cercanía de un cuidador cuando sienten miedo o malestar.'],
        ['¿Qué tres tipos de estrés distinguen Shonkoff y otros?', 'Positivo, tolerable y tóxico.'],
        ['¿Qué es lo que más protege frente al estrés tóxico?', 'Una relación estable con al menos un adulto que cuide.'],
        ['¿Qué mostró el proyecto de Bucarest?', 'Que los niños que pasaron de orfanatos a familias mejoraron, más cuanto antes salieron.'],
      ],
      tarjetas: [
        ['Apego seguro', 'Se construye con respuestas cálidas y consistentes. Alzar a un bebé que llora no lo malcría.'],
        ['Estrés tóxico (Shonkoff)', 'Fuerte, frecuente y sin apoyo de un adulto. Lo que más protege: una relación estable.'],
        ['Nunca es tarde (Bucarest)', 'El cuidado temprano importa mucho, y mejorar las condiciones de un niño ayuda a cualquier edad.'],
      ],
    }),
  ],
};

const NINEZ = {
  titulo: 'La niñez',
  objetivo: 'Entender cómo se desarrollan el lenguaje y el autocontrol en la niñez, qué tiene evidencia para apoyarlos y qué se sabe (y qué no) sobre las pantallas.',
  fuentes: [
    ['Kuhl, P. K. (2004). Early language acquisition: Cracking the speech code. Nature Reviews Neuroscience, 5(11), 831-843.', 'Cómo los bebés aprenden los sonidos de su idioma.'],
    ['Kuhl, P. K., Tsao, F.-M. y Liu, H.-M. (2003). Foreign-language experience in infancy: Effects of short-term exposure and social interaction on phonetic learning. Proceedings of the National Academy of Sciences, 100(15), 9096-9101.', 'Los bebés aprendieron sonidos de una persona real, no de un video.'],
    ['Hart, B. y Risley, T. R. (1995). Meaningful Differences in the Everyday Experience of Young American Children. Paul H. Brookes.', 'El estudio de la "brecha de palabras".'],
    ['Sperry, D. E., Sperry, L. L. y Miller, P. J. (2019). Reexamining the verbal environments of children from different socioeconomic backgrounds. Child Development, 90(4), 1303-1318.', 'Una réplica que cuestiona la brecha de 30 millones de palabras.'],
    ['Romeo, R. R. et al. (2018). Beyond the 30-million-word gap: Children’s conversational exposure is associated with language-related brain function. Psychological Science, 29(5), 700-710.', 'Lo que más importa son los turnos de conversación.'],
    ['Diamond, A. (2013). Executive functions. Annual Review of Psychology, 64, 135-168.', 'Las funciones ejecutivas y cómo se desarrollan.'],
    ['Watts, T. W., Duncan, G. J. y Quan, H. (2018). Revisiting the marshmallow test: A conceptual replication investigating links between early delay of gratification and later outcomes. Psychological Science, 29(7), 1159-1177.', 'La réplica del test del masmelo: el efecto era más pequeño.'],
    ['Moffitt, T. E. et al. (2011). A gradient of childhood self-control predicts health, wealth, and public safety. Proceedings of the National Academy of Sciences, 108(7), 2693-2698.', 'El autocontrol en la niñez y la vida adulta (estudio de Dunedin).'],
    ['Zimmerman, F. J., Christakis, D. A. y Meltzoff, A. N. (2007). Associations between media viewing and language development in children under age 2 years. Journal of Pediatrics, 151(4), 364-368.', 'Más videos para bebés se asoció con menos vocabulario.'],
    ['Organización Mundial de la Salud (2019). Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age. OMS.', 'Recomendaciones sobre pantallas, movimiento y sueño en menores de 5 años.'],
    ['Orben, A. y Przybylski, A. K. (2019). The association between adolescent well-being and digital technology use. Nature Human Behaviour, 3(2), 173-182.', 'La asociación entre pantallas y bienestar es pequeña.'],
  ],
  lecciones: [
    l('El lenguaje: conversar, no solo hablar', 10, {
      idea: 'Los niños aprenden a hablar en la interacción con personas reales. Lo que más se asocia con su desarrollo del lenguaje no es la cantidad de palabras que oyen, sino las conversaciones de ida y vuelta.',
      bloques: [
        ['Los bebés son estadísticos', [
          'Patricia Kuhl (2004) mostró que los bebés distinguen los sonidos de todos los idiomas al nacer y, hacia el final del primer año, se especializan en los de su lengua.',
          'En un experimento (Kuhl, Tsao y Liu, 2003), bebés estadounidenses que tuvieron sesiones de juego con una persona que les hablaba mandarín aprendieron a distinguir sonidos de ese idioma.',
          'Los que vieron las mismas sesiones en video o solo en audio no aprendieron: la interacción social era clave.',
        ]],
        ['La brecha de palabras', [
          'Hart y Risley (1995) observaron a familias en Estados Unidos y estimaron que los niños de hogares más pobres oían millones de palabras menos que los de hogares profesionales: la famosa "brecha de 30 millones".',
          'Era un estudio con pocas familias, y una réplica (Sperry y otros, 2019) encontró diferencias mucho menores y mucha variación, sobre todo al contar el habla de todos los adultos y niños alrededor.',
          'Romeo y otros (2018) encontraron que lo que más se asociaba con el desarrollo del lenguaje y la actividad cerebral de los niños eran los turnos de conversación, más que la cantidad de palabras.',
        ]],
        ['Cómo apoyarlo', [
          'Conversa con los niños: haz preguntas, espera la respuesta, responde a lo que dicen.',
          'Lean juntos y hablen de las imágenes, no solo lean el texto.',
          'Nombra lo que hacen y sienten ("estás armando una torre muy alta").',
          'Hablarles en tu idioma materno, con naturalidad, es mejor que forzar otro idioma que no dominas.',
        ]],
      ],
      ejemplos: [
        'Mientras haces el almuerzo, tu hijo de 3 años te cuenta algo del jardín. En vez de decir "ajá" mirando el celular, le preguntas "¿y qué hizo tu amiga?". Ese ida y vuelta es exactamente lo que más le ayuda.',
        'Una familia pone a su bebé a ver videos "para que aprenda inglés". Según el estudio de Kuhl, un bebé aprende mucho más de una persona real que le habla que de una pantalla.',
      ],
      practica: [
        'En tu próxima conversación con un niño, cuenta cuántos turnos de ida y vuelta logras y trata de alargarla.',
        'Lee un cuento con un niño y haz al menos tres preguntas sobre las imágenes.',
        'Si no tienes niños cerca, aplica lo mismo con un adulto: pregunta, espera y responde a lo que dijo.',
      ],
      pregunta: '¿Escucho y respondo a los niños de mi vida, o solo les hablo?',
      nota: 'La "brecha de 30 millones de palabras" se volvió muy famosa y se usó en políticas públicas, pero venía de un estudio con 42 familias y se ha criticado por sus métodos y por no contar el habla de otros cuidadores. Las diferencias en el ambiente del lenguaje existen, pero son más pequeñas y variadas de lo que se dijo. Si un niño no dice palabras hacia el año y medio, o no combina palabras hacia los 2 años, vale la pena consultar al pediatra.',
      recordar: [
        ['¿Qué mostró el experimento de Kuhl con el mandarín?', 'Que los bebés aprendieron sonidos de una persona real, pero no de un video o un audio.'],
        ['¿Qué fue la "brecha de 30 millones de palabras"?', 'Una estimación de Hart y Risley sobre las palabras que oían niños de distintos niveles socioeconómicos.'],
        ['¿Qué encontró la réplica de Sperry y otros?', 'Diferencias mucho menores y mucha variación.'],
        ['¿Qué se asoció más con el desarrollo del lenguaje según Romeo y otros?', 'Los turnos de conversación, más que la cantidad de palabras.'],
      ],
      tarjetas: [
        ['Los bebés aprenden de personas (Kuhl, 2003)', 'Aprendieron sonidos de una persona real, no de un video.'],
        ['Turnos de conversación (Romeo, 2018)', 'Lo que más ayuda al lenguaje es el ida y vuelta, no solo la cantidad de palabras.'],
        ['La brecha de 30 millones', 'Venía de pocas familias; las réplicas encontraron diferencias menores.'],
      ],
    }),
    l('El autocontrol y las funciones ejecutivas', 11, {
      idea: 'Las funciones ejecutivas (frenar impulsos, sostener información en la mente y cambiar de plan) se desarrollan durante toda la niñez y la adolescencia. Se asocian con cómo nos va en la vida, pero no son un destino fijo.',
      bloques: [
        ['Qué son', [
          'Adele Diamond (2013) describe tres funciones ejecutivas básicas: el control inhibitorio (frenar un impulso), la memoria de trabajo (sostener información mientras la usas) y la flexibilidad (cambiar de estrategia).',
          'Dependen mucho de la corteza prefrontal, una de las últimas zonas del cerebro en madurar.',
          'Se debilitan con el estrés, el cansancio y la falta de sueño, en niños y adultos.',
        ]],
        ['El test del masmelo', [
          'En los años 60 y 70, Walter Mischel ofrecía a niños de preescolar un dulce ya o dos si esperaban. Años después, quienes esperaron más tenían mejores resultados en pruebas académicas.',
          'Watts, Duncan y Quan (2018) repitieron el estudio con una muestra más grande y diversa: la relación existía, pero era mucho más pequeña, y casi desaparecía al tener en cuenta el entorno familiar.',
          'Esperar también depende de la confianza: en otro estudio, los niños esperaban menos si el adulto antes les había incumplido una promesa.',
        ]],
        ['El estudio de Dunedin y cómo apoyar', [
          'Moffitt y otros (2011) siguieron a unos 1.000 niños de Nueva Zelanda hasta los 32 años: más autocontrol en la niñez se asoció con mejor salud, más ingresos y menos problemas con la ley.',
          'El autocontrol se puede apoyar: juegos con reglas (como "Simón dice"), deportes, música y rutinas predecibles lo ejercitan.',
          'Un entorno estable y confiable ayuda más que exigirle a un niño "fuerza de voluntad".',
        ]],
      ],
      ejemplos: [
        'Tu hijo de 6 años no logra quedarse quieto haciendo tareas después de un día largo. No es "mala conducta": sus funciones ejecutivas están en desarrollo y cansadas. Un descanso, algo de comer y tareas cortas funcionan mejor que el regaño.',
        'En la escuela de fútbol, el profesor hace juegos donde los niños tienen que parar cuando suena el pito y cambiar de dirección cuando cambia el color de un cono. Sin saberlo, está entrenando funciones ejecutivas.',
      ],
      practica: [
        'Juega con un niño a un juego de reglas que lo haga frenar y cambiar (Simón dice, congelados, "pare y siga").',
        'Si cuidas niños, revisa si sus rutinas (comida, sueño, tareas) son predecibles.',
        'Nota en ti mismo cuándo tu autocontrol baja (cansancio, hambre, estrés) y qué te ayuda a recuperarlo.',
      ],
      pregunta: '¿Exijo autocontrol a los niños (o a mí mismo) en momentos en que el cuerpo no da para eso?',
      nota: 'El test del masmelo se volvió símbolo de "la fuerza de voluntad predice el éxito". La réplica de 2018 mostró que el efecto era mucho más pequeño y que buena parte se explicaba por el entorno familiar y económico. Los programas para mejorar funciones ejecutivas funcionan sobre todo en las tareas que se practican; los beneficios generales son más modestos de lo que a veces se promete. Si un niño tiene problemas de atención o impulsividad muy marcados en casa y en el colegio, consulta con un profesional.',
      recordar: [
        ['¿Cuáles son las tres funciones ejecutivas básicas según Diamond?', 'Control inhibitorio, memoria de trabajo y flexibilidad.'],
        ['¿Qué encontró la réplica del test del masmelo (Watts y otros, 2018)?', 'Que la relación con el éxito era mucho más pequeña y casi desaparecía al considerar el entorno familiar.'],
        ['¿Qué mostró el estudio de Dunedin?', 'Que más autocontrol en la niñez se asoció con mejor salud, más ingresos y menos problemas con la ley en la adultez.'],
        ['¿Qué ayuda a desarrollar el autocontrol?', 'Juegos con reglas, deportes, música, rutinas predecibles y un entorno confiable.'],
      ],
      tarjetas: [
        ['Funciones ejecutivas (Diamond)', 'Frenar impulsos, sostener información y cambiar de plan. Bajan con estrés, cansancio y mal sueño.'],
        ['Test del masmelo, con matiz', 'La réplica encontró un efecto mucho menor; el entorno familiar explicaba buena parte.'],
        ['Apoyar el autocontrol', 'Juegos con reglas, deporte, música y rutinas predecibles, más que exigir fuerza de voluntad.'],
      ],
    }),
    l('Pantallas, juego y sueño', 10, {
      idea: 'Los niños necesitan moverse, jugar libremente y dormir bien. Las pantallas no son veneno, pero en los más pequeños reemplazan cosas importantes; en los mayores, su efecto promedio es pequeño y depende del uso.',
      bloques: [
        ['Las recomendaciones para los más pequeños', [
          'La Organización Mundial de la Salud (2019) recomienda que los menores de 2 años no pasen tiempo frente a pantallas de forma sedentaria, y que entre 2 y 4 años sea máximo una hora al día, ojalá menos.',
          'La razón principal: ese tiempo reemplaza el movimiento, el juego, la interacción y el sueño, que son lo que más necesitan.',
          'Las videollamadas con familiares son distintas: hay interacción real.',
        ]],
        ['Videos "educativos" para bebés', [
          'Zimmerman, Christakis y Meltzoff (2007) encontraron que los bebés que veían más videos tipo "Baby Einstein" tenían, en promedio, un vocabulario un poco menor.',
          'No significa que el video dañe directamente, sino que ocupa tiempo que podría ser de conversación.',
          'El juego libre, en cambio, apoya el lenguaje, la creatividad, el autocontrol y la relación con otros.',
        ]],
        ['Niños mayores y adolescentes', [
          'Orben y Przybylski (2019) analizaron datos de cientos de miles de adolescentes: la asociación entre el uso de tecnología digital y el bienestar era negativa pero muy pequeña.',
          'Importa más qué hacen, cuándo y qué reemplaza: no es lo mismo una videollamada con un abuelo que horas de redes a medianoche.',
          'Reglas útiles: nada de pantallas en el cuarto a la hora de dormir, comidas sin celular y que los adultos den ejemplo.',
        ]],
      ],
      ejemplos: [
        'Para que tu hijo de 2 años coma tranquilo, le pones videos en el celular. Funciona, pero se pierde la conversación de la comida. Probar con una canción o un juego de nombrar los colores de la comida le da algo que el video no.',
        'Tu sobrina de 13 años está en el celular hasta la 1 a. m. y llega cansada al colegio. Más que el tiempo total de pantalla, el problema es que le quita horas de sueño. Dejar los celulares de todos cargando en la sala por la noche ayuda.',
      ],
      practica: [
        'Si hay niños en tu casa, acuerden un momento del día sin pantallas para todos (por ejemplo, las comidas).',
        'Deja tu propio celular fuera del cuarto una noche y nota cómo duermes.',
        'Juega 20 minutos con un niño a algo que él escoja, sin pantallas ni instrucciones.',
      ],
      pregunta: '¿Qué está reemplazando el tiempo de pantalla en mi casa: el juego, la conversación o el sueño?',
      nota: 'Hay libros y titulares que dicen que las pantallas "están destruyendo a una generación". Otros investigadores responden que la evidencia de daño general es débil y que el efecto promedio es pequeño. La discusión sigue abierta, sobre todo en adolescentes y redes sociales. Lo prudente: cuidar que las pantallas no le quiten al niño sueño, movimiento, juego y conversación. Si notas aislamiento, tristeza o cambios fuertes de conducta en un adolescente, habla con él y consulta a un profesional.',
      recordar: [
        ['¿Qué recomienda la OMS sobre pantallas en menores de 2 años?', 'Que no pasen tiempo frente a pantallas de forma sedentaria.'],
        ['¿Y entre 2 y 4 años?', 'Máximo una hora al día, ojalá menos.'],
        ['¿Qué encontraron Zimmerman y otros con los videos para bebés?', 'Que los bebés que veían más tenían, en promedio, un vocabulario un poco menor.'],
        ['¿Qué tan grande es la asociación entre tecnología y bienestar en adolescentes según Orben y Przybylski?', 'Negativa pero muy pequeña; importa más qué hacen y qué reemplaza.'],
      ],
      tarjetas: [
        ['Pantallas en menores de 5 (OMS, 2019)', 'Menores de 2: nada sedentario. De 2 a 4: máximo una hora. Videollamadas con familia son otra cosa.'],
        ['Lo que reemplazan', 'El problema de las pantallas es lo que quitan: sueño, movimiento, juego y conversación.'],
        ['Adolescentes y pantallas', 'Efecto promedio pequeño; importa qué hacen y cuándo. Nada de celular en el cuarto al dormir.'],
      ],
    }),
  ],
};

const ADOLESCENCIA = {
  titulo: 'Adolescencia y adultez',
  objetivo: 'Entender por qué los adolescentes toman más riesgos, qué los afecta especialmente (sueño, alcohol, drogas) y cómo sigue cambiando el cerebro en la adultez y la vejez.',
  fuentes: [
    ['Casey, B. J., Jones, R. M. y Hare, T. A. (2008). The adolescent brain. Annals of the New York Academy of Sciences, 1124, 111-126.', 'El desequilibrio entre las zonas de la recompensa y del control.'],
    ['Steinberg, L. (2008). A social neuroscience perspective on adolescent risk-taking. Developmental Review, 28(1), 78-106.', 'Por qué los adolescentes toman más riesgos.'],
    ['Gardner, M. y Steinberg, L. (2005). Peer influence on risk taking, risk preference, and risky decision making in adolescence and adulthood. Developmental Psychology, 41(4), 625-635.', 'Con amigos mirando, los adolescentes arriesgan más.'],
    ['Carskadon, M. A. (2011). Sleep in adolescents: The perfect storm. Pediatric Clinics of North America, 58(3), 637-647.', 'Por qué los adolescentes se duermen y se levantan más tarde.'],
    ['Squeglia, L. M., Jacobus, J. y Tapert, S. F. (2009). The influence of substance use on adolescent brain development. Clinical EEG and Neuroscience, 40(1), 31-38.', 'El alcohol y las drogas en el cerebro adolescente.'],
    ['Meier, M. H. et al. (2012). Persistent cannabis users show neuropsychological decline from childhood to midlife. Proceedings of the National Academy of Sciences, 109(40), E2657-E2664.', 'El consumo persistente de marihuana desde la adolescencia y la cognición.'],
    ['Hartshorne, J. K. y Germine, L. T. (2015). When does cognitive functioning peak? The asynchronous rise and fall of different cognitive abilities across the life span. Psychological Science, 26(4), 433-443.', 'Cada capacidad mental llega a su pico en una edad distinta.'],
    ['Stern, Y. (2012). Cognitive reserve in ageing and Alzheimer’s disease. The Lancet Neurology, 11(11), 1006-1012.', 'La reserva cognitiva.'],
    ['Livingston, G. et al. (2020). Dementia prevention, intervention, and care: 2020 report of the Lancet Commission. The Lancet, 396(10248), 413-446.', 'Los factores de riesgo de demencia que se pueden modificar.'],
  ],
  lecciones: [
    l('El cerebro adolescente', 10, {
      idea: 'En la adolescencia, el sistema de la recompensa se vuelve muy sensible antes de que el sistema de control termine de madurar. Por eso los adolescentes buscan emociones y riesgos, sobre todo con amigos mirando.',
      bloques: [
        ['Dos sistemas a distinto ritmo', [
          'Casey, Jones y Hare (2008) describen un desequilibrio: las zonas de la recompensa y la emoción maduran antes que la corteza prefrontal, que ayuda a frenar y planear.',
          'No es que los adolescentes no entiendan los riesgos: en calma razonan casi como adultos.',
          'El problema aparece en situaciones de mucha emoción, cuando la recompensa pesa más que el freno.',
        ]],
        ['El efecto de los amigos', [
          'Gardner y Steinberg (2005) pusieron a jóvenes y adultos a jugar un videojuego de manejo con semáforos.',
          'Cuando los adolescentes jugaban con amigos mirando, tomaban bastantes más riesgos; en los adultos, la presencia de amigos casi no cambiaba nada.',
          'Laurence Steinberg (2008) explica que la aprobación de los pares es una recompensa muy poderosa en esta etapa.',
        ]],
        ['Una etapa de oportunidad', [
          'La misma sensibilidad que lleva a riesgos impulsa a explorar, aprender y conectar con otros.',
          'Es una etapa de mucha plasticidad: lo que el adolescente practica (deporte, música, estudio, hábitos) deja huella.',
          'Ayuda más darle espacios seguros para buscar emociones (deporte, retos, responsabilidades) que solo prohibir.',
        ]],
      ],
      ejemplos: [
        'Tu hijo de 16 años sabe perfectamente que no se debe manejar la moto sin casco. Pero con los amigos al lado y la emoción del momento, se sube sin él. No es ignorancia: es el peso de la recompensa social en ese momento.',
        'Un sobrino adolescente se mete de lleno en el fútbol, entrena todos los días y quiere ser el mejor de su equipo. Esa misma búsqueda de emoción y aprobación, bien canalizada, lo lleva a desarrollar disciplina.',
      ],
      practica: [
        'Si convives con adolescentes, conversa con ellos sobre una situación de riesgo pensando juntos qué harían si los amigos los presionan.',
        'Piensa en un espacio sano donde un adolescente cercano pueda buscar emociones y retos (deporte, música, un proyecto).',
        'Recuerda una decisión arriesgada que tomaste de adolescente con amigos y qué la impulsó.',
      ],
      pregunta: '¿Cómo puedo acompañar a los adolescentes de mi vida a tomar riesgos sanos en lugar de solo prohibirles?',
      nota: 'Se repite mucho que "el cerebro termina de madurar a los 25 años". Esa cifra es una simplificación: viene de estudios de imágenes que siguieron a personas hasta alrededor de esa edad, y el cerebro sigue cambiando después. No hay un día en que el cerebro "se termina". También hay mucha variación entre personas, y la cultura y el entorno influyen en cuánto se arriesga un adolescente.',
      recordar: [
        ['¿Qué desequilibrio describen Casey, Jones y Hare en la adolescencia?', 'Que las zonas de la recompensa maduran antes que la corteza prefrontal, que ayuda a frenar.'],
        ['¿Entienden los adolescentes los riesgos?', 'Sí, en calma razonan casi como adultos; el problema es en momentos de mucha emoción.'],
        ['¿Qué encontraron Gardner y Steinberg?', 'Que con amigos mirando, los adolescentes tomaban bastantes más riesgos; los adultos no.'],
        ['¿Qué tiene de cierto "el cerebro madura a los 25"?', 'Es una simplificación: el cerebro sigue cambiando después y no hay una fecha exacta.'],
      ],
      tarjetas: [
        ['Cerebro adolescente (Casey)', 'La recompensa se acelera antes que el freno: más riesgo en momentos de emoción.'],
        ['Amigos mirando (Gardner y Steinberg)', 'Los adolescentes arriesgan bastante más con amigos presentes; los adultos casi no.'],
        ['"Madura a los 25"', 'Es una simplificación: el cerebro sigue cambiando, sin una fecha exacta.'],
      ],
    }),
    l('Sueño, alcohol y drogas en la adolescencia', 10, {
      idea: 'Los adolescentes necesitan dormir mucho y su reloj biológico se corre hacia más tarde. Su cerebro en desarrollo es especialmente vulnerable al alcohol y a otras drogas.',
      bloques: [
        ['El reloj se corre', [
          'Mary Carskadon (2011) describe una "tormenta perfecta": en la pubertad, el reloj biológico se retrasa y les da sueño más tarde.',
          'Al mismo tiempo, los colegios empiezan temprano, hay tareas, redes y presión social, así que duermen menos de lo que necesitan.',
          'La falta de sueño afecta el ánimo, la atención, el aprendizaje y el control de impulsos.',
        ]],
        ['El alcohol', [
          'Squeglia, Jacobus y Tapert (2009) revisaron estudios que asocian el consumo fuerte de alcohol en la adolescencia con cambios en el desarrollo del cerebro y en la memoria y la atención.',
          'Empezar a tomar muy joven se asocia con más riesgo de problemas con el alcohol en la adultez.',
          'En Colombia es ilegal venderles alcohol a menores de 18 años.',
        ]],
        ['La marihuana y otras drogas', [
          'Meier y otros (2012) siguieron a más de 1.000 personas desde la niñez: quienes consumieron marihuana de forma persistente desde la adolescencia mostraron una caída en pruebas cognitivas hacia la adultez.',
          'Otros investigadores señalaron que factores como el nivel socioeconómico podrían explicar parte del efecto, y el debate sigue.',
          'Lo prudente: mientras más tarde y menos se consuma, menos riesgo.',
        ]],
      ],
      ejemplos: [
        'Tu hija de 15 años no se puede dormir antes de la medianoche y se levanta a las 5:30 a. m. para el colegio. No es pereza: su reloj está corrido. Ayuda que deje el celular fuera del cuarto, que haya luz natural en la mañana y que los fines de semana no duerma hasta el mediodía.',
        'En las fiestas de 15 años de la familia, a los adolescentes "les dan su traguito para que aprendan a tomar". La evidencia sugiere que empezar temprano aumenta el riesgo de problemas con el alcohol más adelante.',
      ],
      practica: [
        'Si convives con un adolescente, revisa con él a qué hora se duerme y qué lo mantiene despierto.',
        'Conversa con adolescentes cercanos sobre el alcohol con información, no solo con prohibiciones.',
        'Revisa tus propias horas de sueño: el ejemplo de los adultos pesa.',
      ],
      pregunta: '¿Qué mensaje doy sobre el alcohol y el sueño con mi propio ejemplo?',
      nota: 'Algunos titulares dicen que "una sola borrachera daña el cerebro para siempre" o que "la marihuana baja el CI en 8 puntos a cualquiera". Los estudios muestran riesgos reales, sobre todo con consumo frecuente y temprano, pero las cifras exactas se discuten y muchos estudios no pueden separar del todo causa y otros factores. El mensaje prudente no necesita exagerar: mientras más tarde y menos, mejor. Si un adolescente tiene problemas con el alcohol o las drogas, busquen ayuda profesional; los servicios de salud mental de la EPS pueden orientar (en Bogotá, también la línea 106).',
      recordar: [
        ['¿Qué pasa con el reloj biológico en la adolescencia?', 'Se retrasa: les da sueño más tarde.'],
        ['¿Qué es la "tormenta perfecta" de Carskadon?', 'Reloj corrido más colegio temprano, tareas, redes y presión social: duermen menos de lo que necesitan.'],
        ['¿Qué se asocia con empezar a tomar alcohol muy joven?', 'Más riesgo de problemas con el alcohol en la adultez.'],
        ['¿Qué encontraron Meier y otros sobre la marihuana?', 'Que el consumo persistente desde la adolescencia se asoció con caída en pruebas cognitivas; el debate sobre la causa sigue.'],
      ],
      tarjetas: [
        ['Sueño adolescente (Carskadon)', 'El reloj se corre más tarde y duermen menos de lo que necesitan. No es pereza.'],
        ['Alcohol temprano', 'Empezar muy joven se asocia con más problemas con el alcohol después. Más tarde y menos, mejor.'],
        ['Marihuana en la adolescencia', 'El consumo persistente se asocia con caída cognitiva; la causa exacta se discute.'],
      ],
    }),
    l('El cerebro adulto y el envejecimiento', 11, {
      idea: 'Las capacidades mentales no llegan a su pico al mismo tiempo: unas a los 20, otras a los 50 o más. Con la edad, algunas bajan, pero lo que haces durante la vida construye una reserva que protege.',
      bloques: [
        ['Cada capacidad tiene su edad', [
          'Hartshorne y Germine (2015) analizaron pruebas de decenas de miles de personas.',
          'La velocidad de procesamiento llega al pico alrededor de los 20 años; algunas memorias, hacia los 30; la capacidad de leer emociones, hacia los 40 o 50; y el vocabulario puede seguir creciendo hasta los 60 o 70.',
          'No hay una sola edad en la que "uno está en su mejor momento" mental.',
        ]],
        ['La reserva cognitiva', [
          'Yaakov Stern (2012) describe la reserva cognitiva: personas con más educación, trabajos exigentes y vida activa toleran mejor los cambios del envejecimiento o de enfermedades como el Alzheimer antes de mostrar síntomas.',
          'Se construye a lo largo de la vida: estudiar, aprender cosas nuevas, tener vida social y mantenerse activo.',
          'No impide la enfermedad, pero puede retrasar cuándo afecta la vida diaria.',
        ]],
        ['Lo que se puede modificar', [
          'La Comisión de The Lancet (Livingston y otros, 2020) estimó que una parte importante de los casos de demencia (cerca de cuatro de cada diez) se relaciona con factores modificables.',
          'Entre ellos: menos educación en la juventud, pérdida de audición, hipertensión, obesidad, cigarrillo, depresión, poca actividad física, diabetes, aislamiento social, exceso de alcohol, golpes en la cabeza y contaminación del aire.',
          'Varios dependen de decisiones personales; otros, de políticas públicas.',
        ]],
      ],
      ejemplos: [
        'A los 50 años te frustras porque los jóvenes del trabajo son más rápidos con los sistemas. Pero tú entiendes mejor a los clientes y tienes más vocabulario y criterio: cada edad tiene sus fortalezas.',
        'Tu mamá de 65 años empezó a oír mal y dejó de ir a reuniones porque no entendía. La pérdida de audición y el aislamiento son dos factores de riesgo modificables: llevarla a un examen de audición puede ayudarle mucho más de lo que parece.',
      ],
      practica: [
        'Revisa la lista de factores modificables y marca los que aplican a ti o a tus papás.',
        'Escoge uno para actuar este mes (tomarte la presión, un examen de audición, moverte más, llamar a alguien que vive solo).',
        'Escribe una actividad que te mantenga aprendiendo y conectado con otros a largo plazo.',
      ],
      pregunta: '¿Qué estoy haciendo hoy para construir mi reserva cognitiva para dentro de 30 años?',
      nota: 'La cifra de "cuatro de cada diez casos de demencia se podrían prevenir" es una estimación a nivel de población basada en riesgos atribuibles, no una garantía individual: alguien puede hacer todo bien y aun así desarrollar demencia. Las actualizaciones posteriores de la Comisión agregaron factores y ajustaron la estimación. Tampoco hay evidencia de que suplementos como el ginkgo prevengan la demencia. Si notas olvidos que afectan la vida diaria en ti o en alguien cercano, consulta al médico: algunas causas son tratables.',
      recordar: [
        ['¿Qué encontraron Hartshorne y Germine sobre el pico de las capacidades mentales?', 'Que cada capacidad llega a su pico en una edad distinta, desde los 20 hasta los 60 o 70.'],
        ['¿Qué es la reserva cognitiva?', 'La capacidad, construida con educación, trabajo exigente y vida activa, de tolerar mejor los cambios del envejecimiento.'],
        ['¿Qué estimó la Comisión de The Lancet en 2020?', 'Que cerca de cuatro de cada diez casos de demencia se relacionan con factores modificables.'],
        ['Nombra tres factores de riesgo modificables de demencia.', 'Pérdida de audición, hipertensión, cigarrillo, poca actividad física, aislamiento social, entre otros.'],
      ],
      tarjetas: [
        ['Picos distintos (Hartshorne y Germine)', 'Velocidad a los 20, lectura de emociones a los 40-50, vocabulario hasta los 60-70.'],
        ['Reserva cognitiva (Stern)', 'Aprender, trabajo exigente, vida social y actividad toleran mejor el envejecimiento.'],
        ['Demencia: lo modificable (Lancet, 2020)', 'Audición, presión, cigarrillo, actividad física, aislamiento, alcohol y más. Estimación poblacional, no garantía.'],
      ],
    }),
  ],
};

export default {
  id: 'neurociencia-desarrollo',
  nombre: 'Neurociencia del desarrollo',
  area: 'cerebro',
  icono: '👶',
  nivel: 'Básico',
  paraQue: 'Entender cómo se forma y cambia el cerebro desde el embarazo hasta la vejez: qué importa en cada etapa, qué tiene evidencia y qué es mito. Te sirve para acompañar mejor a los niños y adolescentes de tu vida y para cuidar tu propio cerebro con los años.',
  modulos: [COMIENZO, NINEZ, ADOLESCENCIA],
  proyecto: {
    titulo: 'Mapa del cerebro de tu familia',
    intro: 'En 2 a 3 semanas vas a aplicar lo aprendido a las personas de tu familia en distintas etapas (niños, adolescentes, adultos y mayores) con acciones concretas y respetuosas.',
    pasos: [
      'Haz una lista de las personas de tu familia o círculo cercano y anota en qué etapa del desarrollo está cada una.',
      'Para cada etapa, escribe las dos cosas con más evidencia que vale la pena cuidar (por ejemplo: conversación y juego en niños pequeños, sueño en adolescentes, audición y actividad en mayores).',
      'Si hay niños pequeños, dedica al menos tres ratos a jugar y conversar con ellos sin pantallas.',
      'Si hay adolescentes, ten una conversación abierta sobre el sueño, el alcohol o los riesgos con amigos.',
      'Si hay adultos mayores, ayuda con una acción concreta: un control de presión o audición, una caminata o una visita.',
      'Para ti, escoge un factor de riesgo modificable y actúa sobre él durante las semanas del proyecto.',
      'Anota en el diario qué hiciste con cada persona y cómo respondió.',
      'Al final, escribe qué cambio pequeño quieres mantener en tu familia.',
    ],
  },
};
