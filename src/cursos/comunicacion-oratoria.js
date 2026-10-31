// Comunicación y oratoria (incluye hablar en público). Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const CLARIDAD = {
  titulo: 'Decir las cosas claras',
  objetivo: 'Encontrar la idea principal de lo que quieres decir, ordenarla para que se entienda a la primera y hacerla concreta con palabras simples, ejemplos e historias.',
  fuentes: [
    ['Heath, C. y Heath, D. (2007). Made to Stick: Why some ideas survive and others die. Random House. (En español: Pegar con fuerza).', 'Qué hace que una idea se entienda y se recuerde: simple, concreta, con historia.'],
    ['Camerer, C., Loewenstein, G. y Weber, M. (1989). The curse of knowledge in economic settings: An experimental analysis. Journal of Political Economy, 97(5), 1232-1254.', 'La maldición del conocimiento: cuando sabes algo, no logras imaginar no saberlo.'],
    ['Minto, B. (2009). The Pyramid Principle: Logic in writing and thinking (3.ª ed.). Financial Times Prentice Hall.', 'Empezar por la conclusión y después dar las razones.'],
    ['Murdock, B. B. (1962). The serial position effect of free recall. Journal of Experimental Psychology, 64(5), 482-488.', 'Se recuerda mejor lo del principio y lo del final.'],
    ['Oppenheimer, D. M. (2006). Consequences of erudite vernacular utilized irrespective of necessity: Problems with using long words needlessly. Applied Cognitive Psychology, 20(2), 139-156.', 'Usar palabras rebuscadas hace que te juzguen menos inteligente, no más.'],
    ['Green, M. C. y Brock, T. C. (2000). The role of transportation in the persuasiveness of public narratives. Journal of Personality and Social Psychology, 79(5), 701-721.', 'Las historias que te "transportan" cambian creencias.'],
    ['Small, D. A., Loewenstein, G. y Slovic, P. (2007). Sympathy and callousness: The impact of deliberative thought on donations to identifiable and statistical victims. Organizational Behavior and Human Decision Processes, 102(2), 143-153.', 'Una persona concreta mueve más que una estadística.'],
  ],
  lecciones: [
    l('Una idea principal (y la maldición del conocimiento)', 10, {
      idea: 'Comunicar bien empieza antes de hablar: decidir qué es lo único que quieres que la otra persona se lleve. Y recordar que lo que para ti es obvio, para ella puede no serlo.',
      bloques: [
        ['La idea principal', [
          'Antes de un mensaje, una reunión o una charla, completa: "Si solo recuerdan una cosa, quiero que sea…".',
          'Los hermanos Heath (2007) lo llaman encontrar el núcleo: quitar todo lo que no es esencial, aunque sea cierto e interesante.',
          'Si no la puedes decir en una o dos frases, todavía no la tienes clara; y si tú no la tienes clara, el otro menos.',
        ]],
        ['La maldición del conocimiento', [
          'Cuando ya sabes algo, te cuesta mucho imaginar cómo es no saberlo. Camerer, Loewenstein y Weber (1989) lo llamaron "maldición del conocimiento".',
          'En un experimento famoso de la Universidad de Stanford, unas personas tamborileaban con los dedos el ritmo de canciones conocidas y otras debían adivinar cuál era.',
          'Los que tamborileaban creían que muchos acertarían, porque oían la melodía en su cabeza. Los oyentes solo oían golpecitos y acertaron poquísimas.',
          'Lo mismo pasa cuando explicas tu trabajo, das indicaciones o enseñas: tú "oyes la melodía", el otro solo oye golpes.',
        ]],
        ['Cómo vencerla', [
          'Imagina a alguien concreto que no sabe del tema (tu mamá, un vecino) y explícale a esa persona.',
          'Quita las siglas y la jerga, o explícalas la primera vez.',
          'Pide que te lo repitan con sus palabras: "Para ver si me expliqué bien, ¿qué entendiste?".',
        ]],
      ],
      ejemplos: [
        'Le escribes a tu jefe un correo de seis párrafos sobre un problema con un proveedor. Antes de enviarlo, escribes arriba la idea principal: "El proveedor se atrasó 2 semanas; propongo cambiarlo por X a partir de diciembre". Lo demás queda como respaldo.',
        'Le explicas a tu mamá cómo usar Nequi y le dices "entra a la app, ve a movimientos y envía". Para ti es obvio; para ella no está claro dónde queda cada cosa. Mejor: te sientas a su lado y le pides que lo haga ella mientras tú solo indicas.',
      ],
      practica: [
        'Antes de tu próximo mensaje importante, escribe la idea principal en una sola frase.',
        'Explícale algo de tu trabajo a alguien que no sabe del tema y pídele que te lo repita con sus palabras.',
        'Revisa un texto tuyo y quita o explica todas las siglas y palabras técnicas.',
      ],
      pregunta: '¿Qué explico seguido creyendo que es obvio, cuando para los demás no lo es?',
      nota: 'El experimento de los tamborileros es de una tesis doctoral (Elizabeth Newton, Stanford, 1990) y se hizo famoso por el libro de los Heath; los números exactos se citan de distintas formas, pero la diferencia enorme entre lo que creían los que tocaban y lo que acertaron los oyentes es el punto central. La maldición del conocimiento sí está bien documentada en muchos otros estudios.',
      recordar: [
        ['¿Qué pregunta ayuda a encontrar la idea principal?', '"Si solo recuerdan una cosa, quiero que sea…".'],
        ['¿Qué es la maldición del conocimiento?', 'Que cuando sabes algo, te cuesta imaginar cómo es no saberlo, y explicas como si el otro supiera.'],
        ['¿Qué mostró el experimento de los tamborileros?', 'Que quienes tocaban el ritmo creían que muchos adivinarían la canción, pero los oyentes acertaron poquísimas.'],
        ['Nombra dos formas de vencer la maldición del conocimiento.', 'Explicarle a alguien concreto que no sabe, quitar la jerga y las siglas, o pedir que te lo repitan con sus palabras.'],
      ],
      tarjetas: [
        ['La idea principal', '"Si solo recuerdan una cosa, quiero que sea…". Si no cabe en una o dos frases, todavía no la tienes clara.'],
        ['Maldición del conocimiento', 'Cuando sabes algo, no logras imaginar no saberlo. Tú oyes la melodía; el otro solo oye golpecitos.'],
        ['Comprobar que te entendieron', '"Para ver si me expliqué bien, ¿qué entendiste?"'],
      ],
    }),
    l('Estructura: lo principal primero', 10, {
      idea: 'La gente entiende y recuerda mejor cuando sabe para dónde vas. Empieza por la conclusión, da pocas razones bien ordenadas y cierra repitiendo lo esencial.',
      bloques: [
        ['La pirámide', [
          'Barbara Minto, consultora, propuso el principio de la pirámide: primero la conclusión o la petición, después los argumentos que la sostienen, y después los detalles.',
          'Es lo contrario de como solemos contar las cosas: en orden cronológico ("primero pasó esto, luego esto…") hasta llegar al punto al final.',
          'En el trabajo, la gente lee el principio y decide si sigue. Si el punto está al final, muchos no llegan.',
        ]],
        ['Principio y final pesan más', [
          'En los estudios de memoria, las personas recuerdan mejor lo primero y lo último de una lista (Murdock, 1962).',
          'Por eso conviene abrir con la idea principal y cerrar repitiéndola: son los momentos que más quedan.',
          'Lo del medio se olvida más: ponlo en orden y no lo llenes de datos.',
        ]],
        ['Tres estructuras que sirven', [
          'Punto, razón, ejemplo, punto: dices la idea, por qué, un ejemplo y repites la idea.',
          'Problema, solución, beneficio: para propuestas y ventas.',
          'Antes, ahora, después: para contar un cambio (cómo estábamos, qué pasa hoy, adónde vamos).',
          'Tres razones suelen bastar: más de cuatro se pierden.',
        ]],
      ],
      ejemplos: [
        'En lugar de un audio de WhatsApp de cinco minutos contando todo lo que pasó en la obra, mandas: "Necesito 2 millones más para terminar el baño. Razones: el tubo estaba roto y hubo que cambiarlo, y la cerámica subió de precio. Te mando las fotos".',
        'En la reunión semanal del trabajo usas punto, razón, ejemplo, punto: "Propongo cerrar los pedidos a las 3 p. m. Así el despacho alcanza el último camión. La semana pasada se quedaron 12 pedidos por eso. Por eso, cerremos a las 3".',
      ],
      practica: [
        'Reescribe tu próximo correo o mensaje largo poniendo la conclusión o la petición en la primera línea.',
        'Prepara una intervención de un minuto con la estructura punto, razón, ejemplo, punto.',
        'Revisa un mensaje que ya enviaste y cuenta cuántas razones diste: si son más de cuatro, quédate con las tres mejores.',
      ],
      pregunta: '¿Dónde suelo enterrar lo importante al final de una historia larga?',
      nota: 'Se repite que "la gente solo recuerda 3 cosas" o que "el número 3 tiene un poder especial". No hay una regla mágica con el 3: lo que sí está respaldado es que la memoria de corto plazo es limitada y que listas cortas y ordenadas se recuerdan mejor. Tres es una buena cifra práctica, no una ley.',
      recordar: [
        ['¿Qué propone el principio de la pirámide de Minto?', 'Empezar por la conclusión o la petición, después los argumentos y al final los detalles.'],
        ['¿Qué partes de un mensaje se recuerdan mejor?', 'El principio y el final (efecto de posición serial, Murdock 1962).'],
        ['¿Cuál es la estructura punto, razón, ejemplo, punto?', 'Dices la idea, por qué, un ejemplo y repites la idea.'],
        ['¿Cuántas razones conviene dar?', 'Pocas, unas tres; más de cuatro se pierden.'],
      ],
      tarjetas: [
        ['Principio de la pirámide (Minto)', 'Primero la conclusión o la petición, luego las razones, luego los detalles.'],
        ['Principio y final', 'Es lo que más se recuerda: abre con la idea principal y ciérrala repitiéndola.'],
        ['Punto, razón, ejemplo, punto', 'Una estructura para hablar un minuto con claridad sobre cualquier tema.'],
      ],
    }),
    l('Palabras simples, ejemplos e historias', 10, {
      idea: 'Las palabras rebuscadas no te hacen ver más inteligente: te hacen más difícil de entender. Lo que se entiende y se recuerda es lo concreto: ejemplos, imágenes y personas con nombre.',
      bloques: [
        ['Lo simple parece más inteligente', [
          'Daniel Oppenheimer (2006) mostró textos con palabras sencillas y versiones con palabras rebuscadas.',
          'Los lectores juzgaron a los autores de los textos complicados como menos inteligentes, no más.',
          'Escribe y habla como hablarías con alguien que respetas: frases cortas, palabras comunes, una idea por oración.',
        ]],
        ['Lo concreto se pega', [
          'Lo abstracto ("mejorar la eficiencia operativa") resbala; lo concreto ("que el pedido llegue en 2 días y no en 5") se queda.',
          'Un ejemplo vale más que una definición: después de explicar algo, di "por ejemplo…".',
          'Las comparaciones con algo conocido ayudan: "la memoria de trabajo es como una mesa pequeña".',
        ]],
        ['El poder de las historias', [
          'Green y Brock (2000) encontraron que cuando una historia te "transporta" (te mete en ella), cambia más tus creencias.',
          'Small, Loewenstein y Slovic (2007) vieron que la gente donaba más para ayudar a una niña con nombre y foto que cuando le mostraban estadísticas de millones de personas.',
          'Una buena historia corta tiene una persona, un problema, lo que hizo y qué pasó. Úsala para ilustrar tu idea principal, no para reemplazarla.',
        ]],
      ],
      ejemplos: [
        'En lugar de decirle al equipo "debemos optimizar la gestión del inventario", les cuentas: "El martes doña Rosa vino por 20 bultos de cemento, le dijimos que había, y cuando fuimos a la bodega solo quedaban 8. Se fue a la competencia". Todos entienden el problema.',
        'Para convencer a tu familia de ahorrar, en vez de dar porcentajes, cuentas la historia del vecino que perdió el trabajo y pudo pagar el arriendo seis meses gracias a su fondo de emergencia.',
      ],
      practica: [
        'Reescribe un párrafo de un texto tuyo cambiando las palabras rebuscadas por palabras comunes.',
        'Prepara una historia corta (persona, problema, qué hizo, qué pasó) que ilustre algo importante de tu trabajo.',
        'En tu próxima explicación, después de la idea, di "por ejemplo…" y da un caso concreto.',
      ],
      pregunta: '¿Cuándo uso palabras complicadas para parecer más preparado?',
      nota: 'Las historias son poderosas, y por eso también se usan para manipular: una anécdota conmovedora no prueba que algo sea cierto ni que pase seguido. Usa historias para ilustrar datos, no para reemplazarlos, y desconfía cuando alguien te quiere convencer solo con un caso. Se dice también que "recordamos 22 veces más las historias que los datos": esa cifra circula sin una fuente clara.',
      recordar: [
        ['¿Qué encontró Oppenheimer sobre las palabras rebuscadas?', 'Que hacen que los lectores juzguen al autor como menos inteligente, no más.'],
        ['¿Por qué conviene ser concreto?', 'Porque lo concreto se entiende y se recuerda; lo abstracto resbala.'],
        ['¿Qué mostraron Small, Loewenstein y Slovic?', 'Que la gente dona más para una persona concreta con nombre que ante estadísticas de muchas personas.'],
        ['¿Qué partes tiene una buena historia corta?', 'Una persona, un problema, lo que hizo y qué pasó.'],
      ],
      tarjetas: [
        ['Palabras simples (Oppenheimer, 2006)', 'Lo rebuscado te hace ver menos inteligente. Frases cortas y palabras comunes.'],
        ['Lo concreto se pega', 'Después de una idea, di "por ejemplo…" y da un caso concreto.'],
        ['Historia corta', 'Persona, problema, qué hizo y qué pasó. Ilustra tu idea; no la reemplaza.'],
      ],
    }),
  ],
};

const CONVERSAR = {
  titulo: 'Escuchar y conversar',
  objetivo: 'Escuchar de una forma que la otra persona sienta, leer y usar el lenguaje no verbal sin creer en mitos, y llevar conversaciones difíciles sin que se vuelvan pelea.',
  fuentes: [
    ['Rogers, C. R. y Farson, R. E. (1957). Active Listening. Industrial Relations Center, University of Chicago.', 'El texto clásico sobre la escucha activa.'],
    ['Huang, K., Yeomans, M., Brooks, A. W., Minson, J. y Gino, F. (2017). It doesn’t hurt to ask: Question-asking increases liking. Journal of Personality and Social Psychology, 113(3), 430-452.', 'Hacer preguntas de seguimiento hace que caigas mejor.'],
    ['Itzchakov, G., Kluger, A. N. y Castro, D. R. (2017). I am aware of my inconsistencies but can tolerate them: The effect of high quality listening on speakers’ attitude ambivalence. Personality and Social Psychology Bulletin, 43(1), 105-120.', 'Ser bien escuchado ayuda a pensar con más matices.'],
    ['Mehrabian, A. y Wiener, M. (1967). Decoding of inconsistent communications. Journal of Personality and Social Psychology, 6(1), 109-114.', 'El origen del mito del "7 % palabras, 93 % no verbal".'],
    ['Ambady, N. y Rosenthal, R. (1993). Half a minute: Predicting teacher evaluations from thin slices of nonverbal behavior and physical attractiveness. Journal of Personality and Social Psychology, 64(3), 431-441.', 'Impresiones rápidas a partir de segundos de comportamiento no verbal.'],
    ['Bond, C. F. y DePaulo, B. M. (2006). Accuracy of deception judgments. Personality and Social Psychology Review, 10(3), 214-234.', 'Detectar mentiras por el comportamiento: apenas mejor que el azar.'],
    ['Carney, D. R., Cuddy, A. J. C. y Yap, A. J. (2010). Power posing: Brief nonverbal displays affect neuroendocrine levels and risk tolerance. Psychological Science, 21(10), 1363-1368.', 'El estudio original de las "posturas de poder".'],
    ['Ranehill, E. et al. (2015). Assessing the robustness of power posing: No effect on hormones and risk tolerance in a large sample of men and women. Psychological Science, 26(5), 653-656.', 'La réplica grande que no encontró efectos hormonales.'],
    ['Stone, D., Patton, B. y Heen, S. (1999). Difficult Conversations: How to discuss what matters most. Viking. (En español: Conversaciones difíciles).', 'Las tres conversaciones dentro de una conversación difícil.'],
    ['Gottman, J. M. y Silver, N. (1999). The Seven Principles for Making Marriage Work. Crown.', 'Empezar suave y evitar la crítica, el desprecio, la defensiva y el muro.'],
    ['Rosenberg, M. B. (2003). Nonviolent Communication: A language of life (2.ª ed.). PuddleDancer Press. (En español: Comunicación no violenta).', 'Observación, sentimiento, necesidad y petición.'],
  ],
  lecciones: [
    l('Escuchar de verdad', 10, {
      idea: 'Casi todos escuchamos esperando nuestro turno para hablar. Escuchar de verdad es tratar de entender lo que el otro quiere decir y mostrarle que lo entendiste, antes de opinar.',
      bloques: [
        ['La escucha activa', [
          'Carl Rogers y Richard Farson (1957) describieron la escucha activa: escuchar el contenido y también el sentimiento, sin juzgar ni aconsejar de entrada.',
          'Tres herramientas: parafrasear ("o sea, que lo que te molesta es…"), nombrar la emoción ("se te nota frustrado") y preguntar para profundizar.',
          'El objetivo no es estar de acuerdo, sino que la otra persona sienta que la entendiste.',
        ]],
        ['Preguntas de seguimiento', [
          'Huang y otros (2017) analizaron conversaciones reales y citas rápidas: las personas que hacían más preguntas caían mejor.',
          'Las que más servían eran las preguntas de seguimiento, las que retoman lo que el otro acaba de decir ("¿y cómo te fue con eso?").',
          'Muestran que escuchaste. Cambiar de tema hacia ti ("a mí también me pasó…") muestra lo contrario.',
        ]],
        ['Lo que escuchar bien produce', [
          'Itzchakov, Kluger y Castro (2017) encontraron que las personas que se sentían bien escuchadas pensaban su postura con más matices y se ponían menos a la defensiva.',
          'Escuchar no es solo amabilidad: también ayuda a que el otro piense mejor y a que la conversación avance.',
          'Señales de buena escucha: dejar el celular, mirar a la persona, no interrumpir y tolerar los silencios.',
        ]],
      ],
      ejemplos: [
        'Tu pareja llega diciendo que tuvo un día horrible en el trabajo. En vez de saltar a "deberías renunciar" o "a mí me fue peor", le dices: "¿Qué pasó?", y después "o sea que te culparon de algo que no fue tu culpa; qué rabia". Recién ahí, si quiere, le das tu opinión.',
        'Un cliente se queja por un pedido atrasado. Antes de explicar por qué pasó, parafraseas: "Entiendo, el pedido era para hoy y lo necesitaba para su evento". El cliente baja el tono porque se siente entendido.',
      ],
      practica: [
        'En tu próxima conversación, haz al menos dos preguntas de seguimiento sobre lo que el otro acaba de decir.',
        'Antes de dar tu opinión, parafrasea lo que entendiste y pregunta si es así.',
        'Hoy, cuando alguien te hable, deja el celular boca abajo o guárdalo.',
      ],
      pregunta: '¿Con quién suelo escuchar solo esperando mi turno para hablar?',
      nota: 'Escuchar bien no significa no dar nunca tu opinión ni estar siempre de acuerdo: a veces el otro sí quiere un consejo. Pregunta: "¿Quieres que te escuche o que te ayude a pensar qué hacer?". Parafrasear de forma mecánica ("lo que te escucho decir es…") en cada frase también suena falso; úsalo cuando importa.',
      recordar: [
        ['¿Qué es la escucha activa según Rogers y Farson?', 'Escuchar el contenido y el sentimiento, sin juzgar ni aconsejar de entrada, para entender al otro.'],
        ['Nombra tres herramientas de la escucha activa.', 'Parafrasear, nombrar la emoción y preguntar para profundizar.'],
        ['¿Qué tipo de pregunta hace que caigas mejor según Huang y otros?', 'Las preguntas de seguimiento, que retoman lo que el otro acaba de decir.'],
        ['¿Qué pasa cuando alguien se siente bien escuchado?', 'Piensa su postura con más matices y se pone menos a la defensiva.'],
      ],
      tarjetas: [
        ['Escucha activa', 'Parafrasear, nombrar la emoción y preguntar. La meta es que el otro se sienta entendido, no estar de acuerdo.'],
        ['Preguntas de seguimiento (Huang, 2017)', 'Retomar lo que el otro acaba de decir: muestran que escuchaste y hacen que caigas mejor.'],
        ['¿Escucharte o ayudarte?', 'Pregunta: "¿Quieres que te escuche o que te ayude a pensar qué hacer?"'],
      ],
    }),
    l('Lo no verbal, sin mitos', 10, {
      idea: 'Tu voz, tu cara y tu postura cuentan mucho, sobre todo cuando no coinciden con tus palabras. Pero casi todo lo que se repite sobre "lenguaje corporal" está exagerado: no existe un diccionario de gestos.',
      bloques: [
        ['El famoso 7-38-55', [
          'Se repite que la comunicación es 7 % palabras, 38 % tono y 55 % lenguaje corporal. Viene de dos experimentos de Albert Mehrabian (1967).',
          'En esos estudios, las personas escuchaban palabras sueltas con un tono que contradecía su significado y debían juzgar si el hablante sentía agrado o desagrado.',
          'El mismo Mehrabian ha aclarado que esos porcentajes solo aplican a esa situación (sentimientos con mensajes contradictorios), no a toda la comunicación.',
          'Lo que sí queda: cuando las palabras y el tono no coinciden ("estoy bien" dicho con rabia), solemos creerle al tono.',
        ]],
        ['Lo que sí se sabe', [
          'Nos formamos impresiones muy rápido: en estudios de Ambady y Rosenthal, personas que veían segundos de video de profesores sin sonido predijeron bastante bien cómo los calificarían sus estudiantes.',
          'El contacto visual moderado, una postura abierta y una voz clara transmiten interés y seguridad.',
          'El tono y el ritmo de la voz cambian cómo se recibe el mensaje: lo mismo dicho rápido y cortante suena a regaño.',
        ]],
        ['Lo que no se puede leer', [
          'Bond y DePaulo (2006) juntaron cientos de estudios: las personas detectan mentiras apenas un poco mejor que lanzando una moneda.',
          'Cruzar los brazos puede ser frío, comodidad o defensa: un gesto solo no tiene significado fijo. Mira el conjunto y el contexto, y pregunta si dudas.',
          'Mirar para un lado al recordar, tocarse la nariz o sudar no prueban que alguien mienta.',
        ]],
      ],
      ejemplos: [
        'Le dices a un compañero "tranquilo, no pasa nada" mientras miras el celular y suspiras. Tu tono dice lo contrario y te va a creer al tono. Si de verdad no pasa nada, míralo y dilo con calma.',
        'En una entrevista de trabajo, el entrevistador cruza los brazos. No significa que le caigas mal: puede tener frío o estar cómodo. Sigue con lo tuyo en vez de distraerte interpretando gestos.',
      ],
      practica: [
        'Grábate en video hablando un minuto sobre tu trabajo y mira solo tu postura, tu mirada y tu tono, sin sonido y luego con sonido.',
        'En tu próxima conversación importante, revisa que tu tono coincida con lo que dices.',
        'La próxima vez que interpretes un gesto de alguien, pregúntale en vez de suponer.',
      ],
      pregunta: '¿Cuándo mi tono dice algo distinto de mis palabras?',
      nota: 'Las "posturas de poder" (pararse como superhéroe dos minutos antes de una entrevista) se hicieron famosas por una charla TED. El estudio original decía que cambiaban las hormonas y la toma de riesgos; una réplica grande (Ranehill y otros, 2015) no encontró esos efectos, y una de las autoras originales (Carney) dijo después que ya no cree en el efecto. Puede que te haga sentir un poco más seguro, pero no esperes un cambio hormonal.',
      recordar: [
        ['¿De dónde sale el "7 % palabras, 38 % tono, 55 % cuerpo"?', 'De experimentos de Mehrabian con palabras sueltas y tonos contradictorios sobre agrado; no aplica a toda la comunicación.'],
        ['¿Qué sí se mantiene de los estudios de Mehrabian?', 'Que cuando palabras y tono no coinciden, solemos creerle al tono.'],
        ['¿Qué tan bien detectamos mentiras según Bond y DePaulo?', 'Apenas un poco mejor que el azar.'],
        ['¿Qué pasó con las "posturas de poder"?', 'Una réplica grande no encontró los efectos hormonales, y una de las autoras originales ya no cree en el efecto.'],
      ],
      tarjetas: [
        ['El mito del 7-38-55', 'Solo aplica a mensajes contradictorios sobre sentimientos. Lo útil: si palabras y tono chocan, creen al tono.'],
        ['Detectar mentiras', 'Por el comportamiento, apenas mejor que una moneda (Bond y DePaulo, 2006). Ningún gesto lo prueba.'],
        ['Un gesto no tiene significado fijo', 'Mira el conjunto y el contexto; si dudas, pregunta.'],
      ],
    }),
    l('Conversaciones difíciles', 11, {
      idea: 'Las conversaciones que más evitamos son las que más importan: reclamar, decir que no, poner un límite, dar una mala noticia. Se pueden tener sin pelear si empiezas suave, hablas de hechos y de ti, y buscas entender antes que ganar.',
      bloques: [
        ['Las tres conversaciones', [
          'Stone, Patton y Heen (1999), del Proyecto de Negociación de Harvard, dicen que en toda conversación difícil hay tres conversaciones a la vez.',
          '"Qué pasó": cada uno tiene su versión. En vez de discutir quién tiene la razón, busca entender por qué el otro lo ve distinto.',
          'Los sentimientos: están ahí aunque no se nombren, y si no se reconocen se cuelan en todo.',
          'La identidad: lo que la situación dice de mí ("¿soy un mal jefe?", "¿soy mala hija?"). Por eso duelen tanto.',
        ]],
        ['Empezar suave', [
          'John Gottman, que estudió por décadas a parejas, encontró que la forma de empezar una discusión predice mucho cómo termina.',
          'Un arranque duro ("tú nunca…", "siempre haces lo mismo") lleva a la defensiva. Un arranque suave describe el hecho y lo que necesitas.',
          'Gottman describió cuatro conductas que dañan las relaciones: la crítica a la persona, el desprecio (burla, sarcasmo), la defensiva y el muro (cerrarse).',
        ]],
        ['Una fórmula útil', [
          'Marshall Rosenberg propuso la comunicación no violenta en cuatro pasos: lo que observé (sin juicio), lo que sentí, lo que necesito y lo que te pido.',
          '"Cuando llegaste a las 11 sin avisar (hecho), me preocupé (sentimiento), porque necesito saber que estás bien (necesidad). ¿Me escribes si te vas a demorar? (petición)".',
          'Habla de hechos concretos, no de rasgos ("llegaste tarde 3 veces esta semana", no "eres un irresponsable").',
          'Si la emoción está muy alta, pide una pausa y retoma después: discutir con rabia rara vez resuelve algo.',
        ]],
      ],
      ejemplos: [
        'Tu jefe te carga trabajo de otro compañero sin decirte. En vez de quedarte callado o explotar, pides 10 minutos y le dices: "Esta semana me llegaron las tareas de Andrés además de las mías (hecho). Estoy preocupado porque no voy a alcanzar a entregar bien (sentimiento y necesidad). ¿Podemos definir cuáles son prioridad?".',
        'Un amigo te debe 500.000 pesos hace meses. En lugar de indirectas o de cortar la amistad, le escribes: "Te escribo por la plata que te presté en marzo. Me hace falta para el arriendo. ¿Cómo podemos hacer para que me la devuelvas, aunque sea por cuotas?".',
      ],
      practica: [
        'Piensa en una conversación difícil que estás evitando y escríbela con los cuatro pasos: hecho, sentimiento, necesidad y petición.',
        'Escribe cuál es la "conversación de identidad" para ti en esa situación: ¿qué temes que diga de ti?',
        'Ensaya la primera frase en voz alta hasta que suene suave y concreta.',
      ],
      pregunta: '¿Qué conversación importante llevo tiempo evitando, y qué temo que pase?',
      nota: 'A Gottman se le atribuye predecir divorcios con más del 90 % de acierto. Esas cifras salieron de ajustar el modelo a las mismas parejas que se estudiaron, no de predecir parejas nuevas, así que hay que tomarlas con cuidado. La comunicación no violenta es muy usada, pero tiene pocos estudios rigurosos. Lo que ambas comparten sí tiene buen sentido y apoyo: hablar de hechos y necesidades en vez de atacar a la persona baja la defensiva. Si en una relación hay gritos, amenazas o miedo, no es un problema de comunicación: busca ayuda (en Colombia, la Línea 155 orienta a mujeres víctimas de violencia).',
      recordar: [
        ['¿Cuáles son las tres conversaciones dentro de una conversación difícil?', 'Qué pasó, los sentimientos y la identidad.'],
        ['¿Qué encontró Gottman sobre la forma de empezar una discusión?', 'Que un arranque duro lleva a la defensiva y predice mucho cómo termina; conviene empezar suave.'],
        ['Nombra las cuatro conductas que dañan las relaciones según Gottman.', 'La crítica, el desprecio, la defensiva y el muro.'],
        ['¿Cuáles son los cuatro pasos de la comunicación no violenta?', 'Lo que observé, lo que sentí, lo que necesito y lo que pido.'],
      ],
      tarjetas: [
        ['Las tres conversaciones (Stone, Patton y Heen)', 'Qué pasó, los sentimientos y la identidad: las tres están en toda conversación difícil.'],
        ['Arranque suave (Gottman)', 'Describe el hecho y lo que necesitas; evita "tú nunca" y "siempre haces".'],
        ['Hecho, sentimiento, necesidad, petición', '"Cuando pasó X, me sentí Y, porque necesito Z. ¿Podrías…?"'],
      ],
    }),
  ],
};

const PERSUADIR = {
  titulo: 'Persuadir con ética',
  objetivo: 'Convencer con confianza, emoción y buenas razones, reconocer las técnicas de influencia para no caer en ellas y cambiar opiniones conversando en lugar de peleando.',
  fuentes: [
    ['Aristóteles (1990). Retórica (trad. Q. Racionero). Gredos.', 'El origen de ethos, pathos y logos.'],
    ['Petty, R. E. y Cacioppo, J. T. (1986). The elaboration likelihood model of persuasion. Advances in Experimental Social Psychology, 19, 123-205.', 'Las dos rutas de la persuasión: la central y la periférica.'],
    ['Cialdini, R. B. (2006). Influence: The psychology of persuasion (ed. revisada). Harper Business. (En español: Influencia).', 'Los principios de la influencia y cómo defenderse.'],
    ['Bohner, G. y Schlüter, L. E. (2014). A room with a viewpoint revisited: Descriptive norms and hotel guests’ towel reuse behavior. PLoS ONE, 9(8), e104086.', 'Una réplica del famoso estudio de las toallas que no encontró el efecto.'],
    ['Nyhan, B. y Reifler, J. (2010). When corrections fail: The persistence of political misperceptions. Political Behavior, 32(2), 303-330.', 'El estudio que describió el "efecto contraproducente".'],
    ['Wood, T. y Porter, E. (2019). The elusive backfire effect: Mass attitudes’ steadfast factual adherence. Political Behavior, 41(1), 135-163.', 'Con muchas más personas, corregir datos casi nunca resulta contraproducente.'],
    ['Broockman, D. y Kalla, J. (2016). Durably reducing transphobia: A field experiment on door-to-door canvassing. Science, 352(6282), 220-224.', 'Conversaciones de escucha y experiencias personales cambiaron opiniones de forma duradera.'],
    ['Feinberg, M. y Willer, R. (2015). From gulf to bridge: When do moral arguments facilitate political influence? Personality and Social Psychology Bulletin, 41(12), 1665-1681.', 'Convence más hablar con los valores del otro, no con los tuyos.'],
    ['Miller, W. R. y Rollnick, S. (2013). Motivational Interviewing: Helping people change (3.ª ed.). Guilford Press.', 'La entrevista motivacional: ayudar a que el otro encuentre sus propias razones.'],
  ],
  lecciones: [
    l('Confianza, emoción y razones', 10, {
      idea: 'Hace más de 2.000 años, Aristóteles dijo que se convence por tres vías: quién lo dice, cómo hace sentir y qué razones da. Hoy se sabe que cuando a la gente le importa el tema, pesan más las razones; cuando no, pesan los atajos.',
      bloques: [
        ['Ethos, pathos y logos', [
          'Ethos: tu credibilidad. Que sepas del tema, que seas honesto y que te importe el otro.',
          'Pathos: la emoción. Conectar con lo que el otro siente y valora.',
          'Logos: las razones y la evidencia. Datos, ejemplos y argumentos que se sostienen.',
          'Los tres se necesitan: buenas razones de alguien en quien no se confía no convencen; emoción sin razones manipula.',
        ]],
        ['Dos rutas', [
          'Petty y Cacioppo (1986) propusieron el modelo de probabilidad de elaboración: hay dos rutas para convencer.',
          'Ruta central: cuando a la persona le importa el tema y tiene tiempo, examina los argumentos. Ahí pesa la calidad de las razones.',
          'Ruta periférica: cuando no le importa mucho o está distraída, se deja llevar por atajos: quién lo dice, cuántos lo dicen, si se ve bonito.',
          'Los cambios por la ruta central duran más y resisten mejor la contrapropaganda.',
        ]],
        ['Construir credibilidad', [
          'Di lo que sabes y también lo que no sabes: reconocer un límite aumenta la confianza.',
          'Menciona el argumento contrario más fuerte y respóndelo: muestra que pensaste el tema.',
          'Cumple lo que prometes en lo pequeño: la credibilidad se gana antes de la conversación importante.',
        ]],
      ],
      ejemplos: [
        'Quieres convencer a tu papá de ir al médico por un dolor en el pecho. Ethos: "Lo hablé con mi amiga que es enfermera". Pathos: "Te queremos ver en la boda de Laura". Logos: "Ese dolor puede ser del corazón y en la EPS te dan cita prioritaria si dices que es en el pecho".',
        'En el trabajo propones un cambio de proveedor. Además de tu propuesta, dices: "El riesgo es que el nuevo es más pequeño; por eso propongo un mes de prueba". Al nombrar la objeción antes que otros, ganas credibilidad.',
      ],
      practica: [
        'Para algo que quieres proponer esta semana, escribe un punto de ethos, uno de pathos y uno de logos.',
        'Escribe la objeción más fuerte a tu propuesta y cómo la respondes.',
        'Piensa si a la otra persona le importa mucho el tema: si sí, cuida sobre todo la calidad de tus razones.',
      ],
      pregunta: '¿Suelo convencer más con razones, con emoción o con mi credibilidad, y cuál me falta?',
      nota: 'Las dos rutas del modelo de Petty y Cacioppo son una simplificación útil; en la realidad se mezclan. Y persuadir no es manipular: la diferencia está en si respetas la libertad del otro y le das información verdadera, o si le escondes cosas o le metes presión para que decida sin pensar.',
      recordar: [
        ['¿Qué son ethos, pathos y logos?', 'La credibilidad de quien habla, la emoción y las razones o evidencia.'],
        ['¿Qué es la ruta central de la persuasión?', 'Cuando a la persona le importa el tema y examina los argumentos; pesa la calidad de las razones.'],
        ['¿Y la ruta periférica?', 'Cuando no le importa mucho y se deja llevar por atajos: quién lo dice, cuántos lo dicen, la forma.'],
        ['Nombra dos formas de construir credibilidad.', 'Reconocer lo que no sabes, mencionar y responder la objeción más fuerte, y cumplir lo que prometes.'],
      ],
      tarjetas: [
        ['Ethos, pathos, logos (Aristóteles)', 'Credibilidad, emoción y razones. Se necesitan los tres.'],
        ['Las dos rutas (Petty y Cacioppo)', 'Si al otro le importa, pesan las razones (ruta central). Si no, los atajos (ruta periférica).'],
        ['Nombrar la objeción', 'Menciona tú el mejor argumento en contra y respóndelo: aumenta tu credibilidad.'],
      ],
    }),
    l('Los principios de influencia (y cómo no caer)', 11, {
      idea: 'Hay atajos mentales que nos hacen decir que sí casi sin pensar. Conocerlos te sirve para comunicar mejor y, sobre todo, para darte cuenta cuando alguien los usa contra ti.',
      bloques: [
        ['Los principios de Cialdini', [
          'Robert Cialdini estudió durante años a vendedores, reclutadores y publicistas, y resumió los atajos que más usan.',
          'Reciprocidad: sentimos que debemos devolver un favor ("le regalo la prueba gratis").',
          'Compromiso y coherencia: después de decir que sí a algo pequeño, nos cuesta decir que no a algo más grande.',
          'Prueba social: hacemos lo que vemos hacer a otros ("el más vendido").',
          'Autoridad: obedecemos a quien parece experto (bata, título, uniforme).',
          'Simpatía y escasez: le decimos que sí a quien nos cae bien, y queremos más lo que parece escaso ("últimas unidades", "solo hoy").',
        ]],
        ['Usarlos con ética', [
          'Puedes usarlos sin engañar: mencionar que muchos clientes están satisfechos, si es verdad; mostrar tu experiencia real; ser amable.',
          'El límite es la verdad y la libertad: inventar escasez, autoridad o testimonios es manipular.',
          'Pregúntate: "¿me sentiría cómodo si la otra persona supiera exactamente qué estoy haciendo?".',
        ]],
        ['Cómo defenderte', [
          'Cuando sientas prisa ("solo por hoy"), frena: la urgencia es la señal más común de manipulación y de estafa.',
          'Ante un regalo o un favor de un vendedor, separa el favor de la decisión: puedes agradecer y decir que no.',
          'Pregunta: "Si no me hubieran dicho eso (que es el último, que todos lo compran, que lo recomienda un doctor), ¿lo querría?".',
          'Las pirámides, las captadoras ilegales y el "gota a gota" usan casi todos estos principios a la vez.',
        ]],
      ],
      ejemplos: [
        'En un centro comercial te regalan una muestra de crema, te preguntan si tienes la piel seca (dices que sí) y luego te ofrecen el tratamiento completo "con descuento solo hoy". Ahí hay reciprocidad, compromiso y escasez juntos. Puedes agradecer la muestra y decir: "Lo pienso y si me interesa, vuelvo".',
        'Un conocido te invita a un "negocio" donde te muestran fotos de gente con carros nuevos, un "experto" con traje y te dicen que los cupos se acaban esta semana. Prueba social, autoridad y escasez: tres señales de alerta de una pirámide.',
      ],
      practica: [
        'Durante un día, anota cada vez que una publicidad o un vendedor use un principio de influencia y cuál era.',
        'Escribe tu frase para frenar la prisa: por ejemplo, "Gracias, lo pienso y te confirmo mañana".',
        'Para algo que quieras proponer, escoge un principio que puedas usar con honestidad y escribe cómo.',
      ],
      pregunta: '¿Qué compra o decisión tomé por presión de tiempo o por no quedar mal, y de cuál me arrepiento?',
      nota: 'Los principios de Cialdini son una buena guía, pero algunos estudios famosos que los ilustran no se replicaron bien. Por ejemplo, el de las toallas de hotel (más huéspedes reutilizaban la toalla si el letrero decía que la mayoría lo hacía): una réplica (Bohner y Schlüter, 2014) no encontró el efecto. Los atajos existen, pero su fuerza depende mucho del contexto. Si caíste en una estafa o pirámide, denúncialo ante la Superintendencia Financiera o la Fiscalía y no inviertas más para "recuperar".',
      recordar: [
        ['Nombra al menos cinco principios de influencia de Cialdini.', 'Reciprocidad, compromiso y coherencia, prueba social, autoridad, simpatía y escasez.'],
        ['¿Cuál es el límite ético para usarlos?', 'La verdad y la libertad: no inventar escasez, autoridad ni testimonios, ni presionar para decidir sin pensar.'],
        ['¿Cuál es la señal más común de manipulación y de estafa?', 'La prisa: "solo por hoy", "los cupos se acaban".'],
        ['¿Qué pregunta te protege de la influencia?', '"Si no me hubieran dicho eso, ¿lo querría?"'],
      ],
      tarjetas: [
        ['Principios de influencia (Cialdini)', 'Reciprocidad, compromiso, prueba social, autoridad, simpatía y escasez.'],
        ['La prisa es una alerta', '"Solo por hoy" es la señal más común de manipulación. Frena y decide mañana.'],
        ['¿Ético o manipulador?', '¿Me sentiría cómodo si el otro supiera exactamente qué estoy haciendo?'],
      ],
    }),
    l('Cambiar opiniones sin pelear', 11, {
      idea: 'Atacar las creencias de alguien con datos y burla rara vez lo convence. Lo que más funciona es escuchar primero, hablar desde los valores del otro y ayudarle a encontrar sus propias razones para cambiar.',
      bloques: [
        ['¿Corregir empeora las cosas?', [
          'Nyhan y Reifler (2010) describieron el "efecto contraproducente": a veces, corregir una creencia falsa hacía que la gente se aferrara más a ella.',
          'Estudios posteriores con muchas más personas (Wood y Porter, 2019) encontraron que ese efecto es raro: en general, la gente sí ajusta un poco sus creencias cuando le corrigen un dato.',
          'Corregir vale la pena. Pero corregir a alguien no basta para que cambie de actitud o de voto: los datos mueven poco cuando la creencia es parte de la identidad.',
        ]],
        ['Escuchar y conectar', [
          'Broockman y Kalla (2016) estudiaron conversaciones puerta a puerta de unos 10 minutos donde el voluntario escuchaba y pedía a la persona recordar una experiencia propia.',
          'Esas conversaciones redujeron prejuicios de forma duradera, cosa que pocos métodos logran.',
          'Feinberg y Willer (2015) encontraron que los argumentos convencen más cuando se plantean con los valores morales del otro, no con los propios.',
        ]],
        ['La entrevista motivacional', [
          'William Miller y Stephen Rollnick desarrollaron la entrevista motivacional, muy usada en salud para ayudar a cambiar hábitos.',
          'En lugar de decirle a alguien por qué debe cambiar, le preguntas sus propias razones: "¿Qué te preocupa de esto? ¿Qué ganarías si cambiaras?".',
          'Cuando una persona dice en voz alta sus razones para cambiar, es más probable que cambie que cuando se las dice otro.',
          'Evita el "reflejo de corregir": cuanto más empujas, más defiende el otro el lado contrario.',
        ]],
      ],
      ejemplos: [
        'Tu tío comparte cadenas falsas de WhatsApp. En vez de humillarlo en el grupo familiar, le escribes en privado: "Tío, vi lo que mandaste. ¿De dónde salió? Yo lo busqué y encontré que es falso, te paso el enlace. Sé que te preocupa la salud de la familia, por eso te lo cuento".',
        'Tu hermano fuma y quieres que lo deje. En lugar del sermón, le preguntas: "¿Alguna vez has pensado en dejarlo? ¿Qué te haría querer intentarlo?". Él dice: "Que mi hija no me vea fumando". Esa razón suya pesa más que todas las tuyas.',
      ],
      practica: [
        'Piensa en alguien con quien no estás de acuerdo en algo importante y escribe qué valores crees que hay detrás de su postura.',
        'En tu próxima discusión, antes de argumentar, haz dos preguntas para entender por qué el otro piensa así.',
        'Si quieres que alguien cambie un hábito, pregúntale sus propias razones en lugar de darle las tuyas.',
      ],
      pregunta: '¿En qué discusión me he dedicado a tener la razón en vez de entender al otro?',
      nota: 'El "efecto contraproducente" se volvió una idea popular ("corregir a la gente la hace creer más en lo falso"), pero la evidencia más amplia muestra que es raro. No es razón para dejar de corregir datos falsos: hazlo, pero con respeto y en privado cuando puedas. Tampoco esperes que una conversación cambie a alguien de golpe: los cambios de opinión suelen ser pequeños y lentos.',
      recordar: [
        ['¿Qué encontraron Wood y Porter sobre el efecto contraproducente?', 'Que es raro: en general la gente ajusta un poco sus creencias cuando le corrigen un dato.'],
        ['¿Qué tipo de conversación redujo prejuicios de forma duradera en el estudio de Broockman y Kalla?', 'Conversaciones de escucha donde la persona recordaba una experiencia propia.'],
        ['¿Qué encontraron Feinberg y Willer?', 'Que los argumentos convencen más cuando se plantean con los valores morales del otro.'],
        ['¿Qué propone la entrevista motivacional?', 'Preguntar al otro sus propias razones para cambiar, en lugar de darle las tuyas.'],
      ],
      tarjetas: [
        ['El efecto contraproducente', 'Es raro: corregir datos sirve. Pero los datos solos mueven poco cuando la creencia es parte de la identidad.'],
        ['Hablar con los valores del otro (Feinberg y Willer)', 'Convence más un argumento planteado desde lo que le importa a él, no a ti.'],
        ['Entrevista motivacional', 'Pregunta: "¿Qué ganarías si cambiaras?". Las razones propias pesan más que las ajenas.'],
      ],
    }),
  ],
};

const PUBLICO = {
  titulo: 'Hablar en público',
  objetivo: 'Manejar los nervios antes de hablar, preparar y ensayar una charla sin memorizarla palabra por palabra, y usar la voz, las pausas y las preguntas para que la gente te entienda y te recuerde.',
  fuentes: [
    ['Bodie, G. D. (2010). A racing heart, rattling knees, and ruminative thoughts: Defining, explaining, and treating public speaking anxiety. Communication Education, 59(1), 70-105.', 'Revisión sobre el miedo a hablar en público y sus tratamientos.'],
    ['Gilovich, T., Medvec, V. H. y Savitsky, K. (2000). The spotlight effect in social judgment: An egocentric bias in estimates of the salience of one’s own actions and appearance. Journal of Personality and Social Psychology, 78(2), 211-222.', 'Creemos que los demás nos notan mucho más de lo que nos notan.'],
    ['Savitsky, K. y Gilovich, T. (2003). The illusion of transparency and the alleviation of speech anxiety. Journal of Experimental Social Psychology, 39(6), 618-625.', 'Los nervios se notan menos de lo que crees, y saberlo ayuda.'],
    ['Brooks, A. W. (2014). Get excited: Reappraising pre-performance anxiety as excitement. Journal of Experimental Psychology: General, 143(3), 1144-1158.', 'Decirse "estoy emocionado" en vez de "cálmate" mejoró el desempeño.'],
    ['Jamieson, J. P., Nock, M. K. y Mendes, W. B. (2012). Mind over matter: Reappraising arousal improves cardiovascular and cognitive responses to stress. Journal of Experimental Psychology: General, 141(3), 417-422.', 'Ver la activación del cuerpo como ayuda cambia la respuesta al estrés.'],
    ['Mayer, R. E. (2009). Multimedia Learning (2.ª ed.). Cambridge University Press.', 'Cómo combinar palabras e imágenes para que se entienda: no leer las diapositivas.'],
    ['Clark, H. H. y Fox Tree, J. E. (2002). Using uh and um in spontaneous speaking. Cognition, 84(1), 73-111.', 'Las muletillas tienen una función y son normales al hablar.'],
    ['Karpicke, J. D. y Roediger, H. L. (2008). The critical importance of retrieval for learning. Science, 319(5865), 966-968.', 'Practicar recordando fija mejor: también sirve para ensayar.'],
  ],
  lecciones: [
    l('El miedo escénico', 11, {
      idea: 'Casi todo el mundo siente nervios antes de hablar en público, incluso los buenos oradores. El objetivo no es eliminarlos, sino usarlos: se notan menos de lo que crees y se pueden reinterpretar como energía.',
      bloques: [
        ['Por qué da tanto miedo', [
          'Gaylord Bodie (2010) revisó la investigación: el miedo a hablar en público es de los temores más comunes y combina síntomas del cuerpo (corazón acelerado, temblor, voz que se quiebra) y pensamientos ("me voy a quedar en blanco", "van a pensar que soy un bruto").',
          'En el fondo es miedo a ser evaluado y rechazado por el grupo.',
          'Se reduce con exposición gradual (hablar muchas veces, empezando por lo fácil), preparación y algunas técnicas para los pensamientos.',
        ]],
        ['Te notan menos de lo que crees', [
          'Gilovich, Medvec y Savitsky (2000) describieron el efecto foco: creemos que los demás notan nuestros errores y detalles mucho más de lo que los notan.',
          'Savitsky y Gilovich (2003) encontraron que quienes daban una charla creían que sus nervios se notaban mucho más de lo que el público decía notar (la ilusión de transparencia).',
          'Además, explicarles esto antes de hablar mejoró su desempeño y redujo los nervios.',
        ]],
        ['De "cálmate" a "estoy emocionado"', [
          'Alison Wood Brooks (2014) pidió a personas que, antes de cantar o hablar en público, se dijeran "estoy emocionado" o "estoy tranquilo".',
          'Las que dijeron "estoy emocionado" lo hicieron mejor. Es más fácil pasar de nervios a emoción (ambos son activación) que forzar la calma.',
          'Jamieson y otros (2012) vieron que explicar que la activación del cuerpo ayuda a rendir mejoró la respuesta al estrés.',
          'Respirar lento y largo antes de empezar (exhalación más larga que la inhalación) también ayuda a bajar la activación.',
        ]],
      ],
      ejemplos: [
        'Antes de presentar el informe a la gerencia sientes el corazón a mil. En vez de pensar "cálmate, cálmate", te dices: "Estoy emocionado, mi cuerpo se está preparando". Sientes los nervios igual, pero dejan de parecer un enemigo.',
        'En el brindis de la boda de tu hermana te tiembla la voz en la primera frase. Te sientes en evidencia, pero después varios invitados te dicen que te vieron muy tranquilo. Era la ilusión de transparencia.',
      ],
      practica: [
        'Escribe los pensamientos que te vienen cuando imaginas hablar en público y, al lado, qué es lo peor que de verdad podría pasar.',
        'Antes de tu próxima intervención (aunque sea en una reunión), di en voz baja: "Estoy emocionado".',
        'Busca una oportunidad pequeña de hablar ante otros esta semana: una opinión en la reunión, un comentario en clase.',
      ],
      pregunta: '¿Qué me da más miedo de hablar en público, y qué es lo peor que realmente ha pasado cuando lo he hecho?',
      nota: 'Se repite que "la gente le teme más a hablar en público que a la muerte". Sale de una encuesta de los años setenta donde la pregunta era qué temores tenía la gente de una lista, no una comparación directa, y se hizo famosa por un chiste de un comediante. Es un miedo muy común, pero no más que la muerte. Si el miedo es tan fuerte que evitas trabajos, clases o reuniones, o te da ataques de pánico, puede ser ansiedad social: la terapia cognitivo-conductual funciona muy bien, y vale la pena consultar a un psicólogo.',
      recordar: [
        ['¿Qué es el efecto foco?', 'Creer que los demás notan nuestros errores y detalles mucho más de lo que los notan.'],
        ['¿Qué es la ilusión de transparencia aplicada a hablar en público?', 'Creer que los nervios se notan mucho más de lo que el público realmente nota.'],
        ['¿Qué encontró Brooks al pedir decirse "estoy emocionado"?', 'Que esas personas rindieron mejor que las que intentaban calmarse.'],
        ['¿Qué reduce el miedo a hablar en público a largo plazo?', 'La exposición gradual (hablar muchas veces), la preparación y trabajar los pensamientos.'],
      ],
      tarjetas: [
        ['Ilusión de transparencia', 'Tus nervios se notan mucho menos de lo que crees (Savitsky y Gilovich, 2003).'],
        ['"Estoy emocionado" (Brooks, 2014)', 'Es más fácil convertir los nervios en emoción que forzar la calma.'],
        ['Exposición gradual', 'El miedo baja hablando muchas veces, empezando por situaciones fáciles.'],
      ],
    }),
    l('Preparar y ensayar', 11, {
      idea: 'Una buena charla se prepara de adentro hacia afuera: primero la idea principal, luego la estructura y al final las diapositivas. Se ensaya en voz alta, varias veces, sin aprenderla palabra por palabra.',
      bloques: [
        ['El orden de la preparación', [
          'Empieza por la idea principal y el público: ¿qué saben ya? ¿qué les importa? ¿qué quieres que hagan o piensen al salir?',
          'Arma la estructura: una apertura que enganche (una pregunta, una historia corta o un dato concreto), 2 o 3 puntos y un cierre que repita la idea y diga qué hacer.',
          'Las diapositivas van al final, para apoyar lo que dices, no para guiarte.',
        ]],
        ['Diapositivas que ayudan', [
          'Richard Mayer, que estudió durante décadas cómo se aprende con imágenes y palabras, encontró que la gente entiende mejor cuando ve imágenes y escucha la explicación, que cuando además lee el mismo texto en pantalla.',
          'Leer las diapositivas en voz alta compite con tu voz: el público lee más rápido de lo que hablas y deja de escucharte.',
          'Una idea por diapositiva, pocas palabras, letra grande e imágenes que expliquen. El detalle va en un documento aparte.',
        ]],
        ['Ensayar bien', [
          'Ensaya en voz alta, de pie, como si fuera de verdad. Ensayar en silencio en la cabeza no prepara la voz ni el tiempo.',
          'No la memorices palabra por palabra: si se te olvida una frase, te pierdes. Memoriza la estructura y la primera y última frase.',
          'Practica recordando: repasa los puntos sin mirar las notas, como en Aprender a aprender (Karpicke y Roediger, 2008). Así se fija mejor que releyendo.',
          'Grábate o ensaya ante alguien de confianza y cronométrate: casi todo el mundo se alarga.',
        ]],
      ],
      ejemplos: [
        'Te toca presentar los resultados del trimestre en 10 minutos. Escribes la idea principal ("vendimos menos, pero recuperamos los clientes grandes"), tres puntos con un dato cada uno y un cierre con lo que pides. Después haces cinco diapositivas con una gráfica cada una.',
        'Para el discurso del grado de tu hijo, en vez de aprenderlo de memoria, te sabes de memoria la primera frase, los tres momentos que vas a contar y la última frase. Lo ensayas cuatro veces en la sala de tu casa con el cronómetro del celular.',
      ],
      practica: [
        'Para tu próxima presentación o intervención, escribe la idea principal, la apertura, 2 o 3 puntos y el cierre en una hoja.',
        'Revisa una presentación tuya y quita el texto que vas a decir en voz alta: deja solo palabras clave o imágenes.',
        'Ensaya una vez en voz alta, de pie, con cronómetro, y anota cuánto te demoraste.',
      ],
      pregunta: '¿Cómo suelo preparar mis presentaciones, y qué parte me salto?',
      nota: 'Hay muchas "reglas" de diapositivas (10-20-30, máximo 6 palabras, etc.) que vienen de consultores y no de estudios. Lo que sí tiene buena evidencia es lo de Mayer: no pongas en pantalla el mismo texto que dices, y usa imágenes que expliquen. Y aunque se dice que "por cada minuto de charla hay que ensayar una hora", no hay una regla: ensaya hasta que puedas decir la estructura sin notas y te salga a tiempo.',
      recordar: [
        ['¿En qué orden se prepara una charla?', 'Primero la idea principal y el público, luego la estructura y al final las diapositivas.'],
        ['¿Qué encontró Mayer sobre leer las diapositivas?', 'Que poner en pantalla el mismo texto que dices compite con tu voz; se entiende mejor con imágenes y explicación oral.'],
        ['¿Por qué no conviene memorizar palabra por palabra?', 'Porque si se te olvida una frase, te pierdes; mejor memorizar la estructura y la primera y última frase.'],
        ['¿Cómo conviene ensayar?', 'En voz alta, de pie, con cronómetro, repasando los puntos sin mirar las notas.'],
      ],
      tarjetas: [
        ['Preparar de adentro hacia afuera', 'Idea principal y público → estructura (apertura, 2-3 puntos, cierre) → diapositivas.'],
        ['Diapositivas (Mayer)', 'No leas en pantalla lo que dices: una idea por diapositiva, pocas palabras e imágenes que expliquen.'],
        ['Ensayar', 'En voz alta y de pie, con cronómetro. Memoriza la estructura y la primera y última frase, no todo el texto.'],
      ],
    }),
    l('Durante la charla: voz, pausas y preguntas', 10, {
      idea: 'En el momento de hablar, lo que más ayuda es lo sencillo: empezar despacio, hacer pausas, mirar a las personas y responder las preguntas con calma. Una muletilla de vez en cuando no arruina nada.',
      bloques: [
        ['La voz y las pausas', [
          'Con los nervios casi todos hablamos más rápido. Empieza más despacio de lo que te parece natural.',
          'Las pausas son tus aliadas: antes de una idea importante, después de una pregunta y al cambiar de punto. Al público no le parecen tan largas como a ti.',
          'Varía el volumen y el ritmo: hablar todo igual cansa. Baja la velocidad en lo importante.',
          'Habla para el último de la fila: proyecta la voz desde el abdomen, no desde la garganta.',
        ]],
        ['Mirar y moverse', [
          'Mira a personas concretas, una idea por persona, en distintos lados del salón; no al techo ni a la pantalla.',
          'Busca algunas caras amables al principio y vuelve a ellas cuando te sientas nervioso.',
          'Las manos pueden acompañar lo que dices; si no sabes qué hacer con ellas, déjalas a los lados o junta las yemas a la altura del ombligo.',
          'Muévete con intención (cambiar de lugar al cambiar de punto) y no por nervios (ir y venir sin parar).',
        ]],
        ['Muletillas, errores y preguntas', [
          'Clark y Fox Tree (2002) mostraron que los "eh" y "em" tienen una función: avisan que estás buscando la palabra. Son normales al hablar.',
          'El problema es el exceso. Si dices muchos "o sea", "este" o "¿sí?", grábate y cámbialos por una pausa en silencio.',
          'Si te equivocas o te quedas en blanco, haz una pausa, mira tus notas o repite la última idea: el público casi nunca lo nota tanto como tú.',
          'Ante una pregunta: escúchala completa, repítela o resúmela, responde corto y, si no sabes, dilo y ofrece averiguar.',
        ]],
      ],
      ejemplos: [
        'En la presentación del proyecto en la universidad te quedas en blanco en el segundo punto. Respiras, haces una pausa, miras la diapositiva y dices: "Como les decía, el problema principal es…". Nadie se da cuenta de que te perdiste.',
        'En una reunión de padres del colegio te preguntan algo que no sabes. En vez de inventar, respondes: "Buena pregunta. No tengo el dato exacto; lo consulto con la coordinación y se los envío por el grupo esta semana". Ganas más credibilidad que si hubieras improvisado.',
      ],
      practica: [
        'Grábate hablando 2 minutos sobre tu día y cuenta tus muletillas. Escoge una para reemplazar por una pausa.',
        'En tu próxima intervención, haz una pausa de dos segundos antes de tu idea más importante.',
        'Escribe tu frase para cuando no sepas una respuesta.',
      ],
      pregunta: '¿Qué hago cuando me pongo nervioso al hablar (correr, mirar al piso, muletillas), y qué puedo hacer en su lugar?',
      nota: 'Hay cursos que prometen "eliminar por completo" las muletillas. No hace falta: en la conversación normal todos las usamos y cumplen una función; solo distraen cuando son muchas y muy repetidas. Lo mismo con los nervios: el objetivo es comunicar, no parecer un robot perfecto. Para practicar con regularidad, sirven los clubes de oratoria (como Toastmasters, que tiene clubes en varias ciudades de Colombia) o cualquier espacio donde hables seguido ante otros.',
      recordar: [
        ['¿Qué pasa con la velocidad al hablar cuando estamos nerviosos, y qué hacer?', 'Hablamos más rápido; conviene empezar más despacio de lo que parece natural.'],
        ['¿Cuándo conviene hacer pausas?', 'Antes de una idea importante, después de una pregunta y al cambiar de punto.'],
        ['¿Qué mostraron Clark y Fox Tree sobre los "eh" y "em"?', 'Que tienen una función (avisar que buscas la palabra) y son normales; el problema es el exceso.'],
        ['¿Cómo responder una pregunta en público?', 'Escucharla completa, repetirla o resumirla, responder corto y, si no sabes, decirlo y ofrecer averiguar.'],
      ],
      tarjetas: [
        ['Las pausas', 'Antes de lo importante, después de una pregunta y al cambiar de punto. Al público no le parecen largas.'],
        ['Muletillas (Clark y Fox Tree)', 'Son normales y tienen función; si son muchas, cámbialas por una pausa en silencio.'],
        ['Si no sabes la respuesta', '"Buena pregunta. No tengo el dato; lo averiguo y te lo envío." Da más credibilidad que improvisar.'],
      ],
    }),
  ],
};

export default {
  id: 'comunicacion-oratoria',
  nombre: 'Comunicación y oratoria',
  area: 'comunicacion',
  icono: '🎤',
  nivel: 'Básico',
  paraQue: 'Decir las cosas con claridad, escuchar de verdad, llevar conversaciones difíciles, convencer con ética y hablar en público sin bloquearte. Te sirve en el trabajo, en la familia y en cualquier lugar donde necesites que te entiendan y te tengan en cuenta.',
  modulos: [CLARIDAD, CONVERSAR, PERSUADIR, PUBLICO],
  proyecto: {
    titulo: 'Tu charla de 5 minutos',
    intro: 'Durante 3 a 4 semanas vas a preparar y dar una charla de 5 minutos sobre algo que sabes y te importa (tu trabajo, un hobby, una lección de vida), ante un grupo real: familia, amigos, compañeros o un club de oratoria.',
    pasos: [
      'Escoge el tema y el público, y escribe la idea principal en una frase.',
      'Arma la estructura: una apertura que enganche, 2 o 3 puntos con un ejemplo o una historia corta cada uno y un cierre que repita la idea.',
      'Revisa el texto: cambia las palabras rebuscadas por simples y explica cualquier sigla.',
      'Si usas diapositivas, haz máximo 5, con una idea y una imagen cada una, sin el texto que vas a decir.',
      'Ensaya en voz alta y de pie al menos 5 veces, con cronómetro, repasando la estructura sin mirar las notas.',
      'Grábate una vez y revisa velocidad, pausas, mirada y muletillas; escoge una sola cosa para mejorar.',
      'Antes de hablar, respira lento y dite "estoy emocionado". Da la charla y deja 2 minutos para preguntas.',
      'Pide a dos personas del público que te digan qué recordaron y compáralo con tu idea principal.',
    ],
  },
};
