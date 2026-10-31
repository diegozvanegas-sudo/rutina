// Hermetismo: historia de las ideas. Cada lección separa "Qué dice la tradición" de "Qué muestra la evidencia".
// Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const TEXTOS = {
  titulo: 'Hermes Trismegisto y sus textos',
  objetivo: 'Saber quién es la figura de Hermes Trismegisto, qué es el Corpus Hermeticum y cómo un erudito del siglo XVII descubrió que esos textos no eran tan antiguos como se creía.',
  fuentes: [
    ['Fowden, G. (1986). The Egyptian Hermes: A historical approach to the late pagan mind. Cambridge University Press.', 'El estudio histórico clásico sobre el hermetismo en Egipto.'],
    ['Copenhaver, B. P. (1992). Hermetica: The Greek Corpus Hermeticum and the Latin Asclepius in a new English translation. Cambridge University Press.', 'Traducción anotada de referencia.'],
    ['Renau Nebot, X. (trad.) (1999). Textos herméticos. Gredos.', 'Traducción al español del Corpus Hermeticum y otros textos.'],
    ['Grafton, A. (1983). Protestant versus prophet: Isaac Casaubon on Hermes Trismegistus. Journal of the Warburg and Courtauld Institutes, 46, 78-93.', 'Cómo Casaubon fechó los textos herméticos.'],
    ['Ebeling, F. (2007). The Secret History of Hermes Trismegistus: Hermeticism from ancient to modern times. Cornell University Press.', 'Historia del hermetismo desde la Antigüedad hasta hoy.'],
  ],
  lecciones: [
    l('¿Quién fue Hermes Trismegisto?', 10, {
      idea: 'Hermes Trismegisto ("el tres veces grande") es una figura legendaria que une al dios egipcio Thot con el dios griego Hermes. Se le atribuyeron textos de sabiduría, magia y alquimia, pero no fue una persona histórica.',
      bloques: [
        ['El origen de la figura', [
          'Después de que Alejandro Magno conquistó Egipto (siglo IV a. C.), las culturas griega y egipcia se mezclaron, sobre todo en Alejandría.',
          'Los griegos identificaron a su dios Hermes (mensajero, guía de las almas, inventor de la escritura) con el egipcio Thot, dios de la sabiduría y la escritura.',
          'De esa mezcla nació Hermes Trismegisto, presentado como un sabio antiquísimo, a veces divino y a veces humano (Fowden, 1986).',
        ]],
        ['Qué dice la tradición', [
          'Que Hermes Trismegisto fue un sabio egipcio de la más remota antigüedad, contemporáneo o anterior a Moisés.',
          'Que recibió una revelación divina sobre Dios, el cosmos y el alma, y la enseñó a sus discípulos.',
          'Que fue el origen de una "sabiduría antigua" (prisca theologia) que luego heredaron los filósofos griegos.',
        ]],
        ['Qué muestra la evidencia', [
          'No hay evidencia de que Hermes Trismegisto haya existido como persona: es una figura literaria y religiosa construida en el Egipto grecorromano.',
          'Los textos que se le atribuyen se escribieron en griego, en los primeros siglos de nuestra era.',
          'Atribuir textos a un sabio antiguo era común en la época, para darles autoridad.',
        ]],
      ],
      ejemplos: [
        'Hoy hay libros de autoayuda que dicen basarse en "la sabiduría milenaria de Hermes Trismegisto". Saber que es una figura legendaria te ayuda a leerlos como lo que son: interpretaciones modernas.',
        'Es parecido a cuando un refrán se atribuye a "un sabio chino" o a "los abuelos": darle un origen antiguo lo hace sonar más sabio, aunque no se sepa quién lo dijo.',
      ],
      practica: [
        'Busca imágenes del dios egipcio Thot y del griego Hermes y anota qué tienen en común.',
        'Escribe con tus palabras por qué se le llamaba "tres veces grande".',
        'Anota qué habías oído sobre Hermes Trismegisto antes de empezar el curso.',
      ],
      pregunta: '¿Por qué una idea nos parece más valiosa cuando se dice que es "antiquísima"?',
      nota: 'Hay quienes presentan a Hermes Trismegisto como un personaje histórico de hace miles de años, a veces relacionado con la Atlántida o con extraterrestres. Esas afirmaciones no tienen ningún respaldo histórico. Este curso estudia el hermetismo como historia de las ideas: qué se creía, cuándo y qué influencia tuvo, respetando a quienes encuentran sentido en él, sin darlo por cierto.',
      recordar: [
        ['¿Qué significa "Trismegisto"?', 'El "tres veces grande".'],
        ['¿Qué dioses se mezclaron en Hermes Trismegisto?', 'El dios egipcio Thot y el dios griego Hermes.'],
        ['¿Fue Hermes Trismegisto una persona histórica?', 'No hay evidencia de ello: es una figura literaria y religiosa.'],
        ['¿Qué es la prisca theologia?', 'La idea de una sabiduría antigua original que luego heredaron los filósofos.'],
      ],
      tarjetas: [
        ['Hermes Trismegisto', 'Figura legendaria que une a Thot (Egipto) y Hermes (Grecia). No fue una persona histórica.'],
        ['Autoridad por antigüedad', 'Atribuir textos a un sabio antiguo era común para darles autoridad.'],
        ['Prisca theologia', 'La creencia en una sabiduría original y antiquísima transmitida por sabios como Hermes.'],
      ],
    }),
    l('El Corpus Hermeticum', 10, {
      idea: 'El Corpus Hermeticum es una colección de tratados en griego, escritos probablemente entre los siglos I y III, con diálogos sobre Dios, el cosmos y el alma. Junto con el Asclepio, en latín, son los textos centrales del hermetismo.',
      bloques: [
        ['Los textos', [
          'El Corpus Hermeticum reúne unos diecisiete tratados breves, en forma de diálogos entre Hermes y sus discípulos (Tat, Asclepio, Amón).',
          'El primero, el Poimandres, cuenta una visión en la que la Mente divina revela a Hermes el origen del mundo y del ser humano.',
          'El Asclepio se conserva en una traducción latina antigua y fue conocido en Europa durante la Edad Media.',
          'Hay traducciones serias al español, como la de Xavier Renau Nebot (1999).',
        ]],
        ['Qué dice la tradición', [
          'Que Dios es Mente (Nous), uno y fuente de todo.',
          'Que el ser humano tiene un origen divino y puede, por el conocimiento y la purificación, volver a unirse con Dios.',
          'Que el cosmos es bello y está lleno de lo divino, a diferencia del mito gnóstico que veía el mundo como una prisión.',
        ]],
        ['Qué muestra la evidencia', [
          'Los especialistas fechan los tratados entre el siglo I y el III de nuestra era, en el Egipto romano (Copenhaver, 1992).',
          'Sus ideas combinan filosofía platónica y estoica, con elementos judíos y algunos egipcios; los investigadores discuten cuánto de egipcio tienen.',
          'Algunos textos herméticos aparecieron también en Nag Hammadi, lo que muestra que circulaban junto a textos gnósticos.',
        ]],
      ],
      ejemplos: [
        'Si lees el Poimandres sabiendo que viene de una época en que el platonismo estaba de moda en Alejandría, reconocerás ideas que también aparecen en filósofos de ese tiempo.',
        'Una amiga dice que el Corpus Hermeticum "es más antiguo que las pirámides". Puedes explicarle que los especialistas lo fechan en los primeros siglos después de Cristo.',
      ],
      practica: [
        'Lee el comienzo del Poimandres en una traducción seria y resume la visión en cinco frases.',
        'Escribe una diferencia entre cómo ve el mundo el hermetismo y cómo lo veía el gnosticismo.',
        'Busca en qué siglos fechan los especialistas el Corpus Hermeticum.',
      ],
      pregunta: '¿Qué ideas del hermetismo, como la de un cosmos lleno de lo divino, me resultan atractivas y por qué?',
      nota: 'No todos los textos atribuidos a Hermes son iguales: el Corpus Hermeticum es filosófico y religioso, mientras que otros textos herméticos tratan de astrología, magia o alquimia. Se suele mezclar todo bajo el nombre "hermetismo", lo que genera confusión. La lección siguiente cuenta cómo se descubrió su verdadera fecha.',
      recordar: [
        ['¿Qué es el Corpus Hermeticum?', 'Una colección de tratados griegos atribuidos a Hermes Trismegisto, sobre Dios, el cosmos y el alma.'],
        ['¿Qué cuenta el Poimandres?', 'Una visión en la que la Mente divina revela a Hermes el origen del mundo y del ser humano.'],
        ['¿Cuándo se escribieron los tratados según los especialistas?', 'Entre los siglos I y III de nuestra era, en el Egipto romano.'],
        ['¿Cómo ve el cosmos el hermetismo, a diferencia del gnosticismo?', 'Como bello y lleno de lo divino, no como una prisión.'],
      ],
      tarjetas: [
        ['Corpus Hermeticum', 'Tratados griegos de los siglos I-III: Dios como Mente, origen divino del ser humano, cosmos lleno de lo divino.'],
        ['Poimandres', 'El primer tratado: la Mente divina revela a Hermes el origen del mundo.'],
        ['Hermetismo vs. gnosticismo', 'El hermetismo ve el cosmos como bello y divino; el mito gnóstico, como una prisión.'],
      ],
    }),
    l('Casaubon y la fecha de los textos', 10, {
      idea: 'Durante el Renacimiento se creyó que los textos herméticos eran de la época de Moisés. En 1614, el erudito Isaac Casaubon demostró con análisis del lenguaje que eran de los primeros siglos después de Cristo.',
      bloques: [
        ['La creencia del Renacimiento', [
          'Cuando los textos herméticos llegaron a Florencia en el siglo XV, se creyó que eran de un sabio egipcio antiquísimo.',
          'Eso explicaba, según sus lectores, por qué se parecían tanto a Platón y al cristianismo: habrían sido su fuente.',
          'Esa idea dio a los textos un prestigio enorme durante más de un siglo.',
        ]],
        ['Qué dice la tradición', [
          'Que Hermes anticipó verdades cristianas, como la Trinidad, siglos antes de Cristo.',
          'Que su sabiduría era la fuente común de Platón, Pitágoras y Moisés.',
          'Algunas corrientes esotéricas actuales siguen afirmando esa antigüedad.',
        ]],
        ['Qué muestra la evidencia', [
          'Isaac Casaubon, un filólogo, publicó en 1614 un análisis del griego de los textos: su vocabulario y estilo eran de los primeros siglos de nuestra era, no de tiempos de Moisés (Grafton, 1983).',
          'También notó que mencionaban ideas e incluso personajes posteriores, y que el parecido con Platón y el cristianismo se debía a que los autores los conocían.',
          'Su conclusión la aceptan hoy los especialistas: los textos herméticos tomaron de la filosofía griega, no al revés.',
        ]],
      ],
      ejemplos: [
        'Es como si alguien presentara una carta "del Libertador Simón Bolívar" que habla de WhatsApp. Por el lenguaje, cualquiera notaría que no puede ser de esa época. Casaubon hizo algo parecido con el griego de los textos herméticos.',
        'Un video en internet dice que "Hermes enseñó la Trinidad antes que el cristianismo". Gracias a Casaubon sabemos que el texto se escribió cuando el cristianismo ya existía, así que pudo tomar esas ideas.',
      ],
      practica: [
        'Escribe con tus palabras cómo usó Casaubon el lenguaje para fechar un texto.',
        'Piensa en un ejemplo de algo que puedas fechar por las palabras que usa (una canción, una carta, un aviso).',
        'Busca en qué año publicó Casaubon su análisis.',
      ],
      pregunta: '¿Qué afirmación sobre algo "antiquísimo" podría revisar con las herramientas de Casaubon?',
      nota: 'El trabajo de Casaubon no le quitó todo el interés al hermetismo: muchos siguieron leyéndolo, y los textos siguen siendo valiosos para entender la religiosidad de su época. Lo que cambió fue la idea de que eran la fuente de toda la sabiduría antigua. También es un ejemplo de cómo funciona el conocimiento: una hipótesis muy prestigiosa se corrigió con evidencia.',
      recordar: [
        ['¿Qué se creía en el Renacimiento sobre los textos herméticos?', 'Que eran de un sabio egipcio antiquísimo, de la época de Moisés.'],
        ['¿Quién fechó correctamente los textos y cuándo?', 'Isaac Casaubon, en 1614.'],
        ['¿Cómo lo hizo?', 'Analizando el griego: el vocabulario y el estilo eran de los primeros siglos de nuestra era.'],
        ['¿Por qué se parecían a Platón y al cristianismo?', 'Porque sus autores los conocían: tomaron de ellos, no al revés.'],
      ],
      tarjetas: [
        ['Casaubon (1614)', 'Fechó los textos herméticos en los primeros siglos d. C. analizando su griego.'],
        ['Quién copió a quién', 'Los textos herméticos tomaron de Platón y del cristianismo, no al revés.'],
        ['Fechar por el lenguaje', 'Las palabras y el estilo delatan la época de un texto.'],
      ],
    }),
  ],
};

const IDEAS = {
  titulo: 'Las ideas herméticas',
  objetivo: 'Conocer las ideas centrales del hermetismo sobre Dios y el ser humano, la famosa Tabla Esmeralda y la diferencia entre el hermetismo filosófico y el "técnico" (astrología, magia y alquimia).',
  fuentes: [
    ['Copenhaver, B. P. (1992). Hermetica. Cambridge University Press.', 'El Poimandres y los tratados, anotados.'],
    ['Principe, L. M. (2013). The Secrets of Alchemy. University of Chicago Press.', 'Historia de la alquimia, incluida la Tabla Esmeralda.'],
    ['Fowden, G. (1986). The Egyptian Hermes. Cambridge University Press.', 'La distinción entre hermetismo filosófico y técnico.'],
    ['Van den Broek, R. y Hanegraaff, W. J. (Eds.). (1998). Gnosis and Hermeticism from Antiquity to Modern Times. State University of New York Press.', 'Estudios académicos sobre la tradición hermética.'],
  ],
  lecciones: [
    l('Dios, el cosmos y el ser humano', 10, {
      idea: 'Para el hermetismo, el ser humano es un pequeño cosmos con origen divino. Conocer el universo y conocerse a sí mismo son caminos para volver a Dios.',
      bloques: [
        ['El ser humano como microcosmos', [
          'Los textos herméticos describen al ser humano como un "pequeño mundo" (microcosmos) que refleja el gran mundo (macrocosmos).',
          'El ser humano tiene una doble naturaleza: mortal por el cuerpo e inmortal por la mente que viene de Dios.',
          'Por eso puede contemplar el universo y, al hacerlo, conocer a Dios.',
        ]],
        ['Qué dice la tradición', [
          'Que "quien se conoce a sí mismo va hacia Dios", una idea del Poimandres.',
          'Que el alma, después de la muerte, asciende por las esferas de los planetas dejando atrás sus vicios hasta llegar a Dios.',
          'Que el ser humano es "un gran milagro", una frase del Asclepio que luego citaron los humanistas del Renacimiento.',
        ]],
        ['Qué muestra la evidencia', [
          'La idea del microcosmos y el ascenso del alma por las esferas aparece en otros textos de la época, en el platonismo y en la astrología antigua.',
          'Los especialistas ven en el hermetismo una "piedad filosófica": una forma de religión personal basada en el conocimiento y la contemplación.',
          'Son creencias religiosas y filosóficas, no afirmaciones comprobables; su valor histórico está en lo que muestran de la espiritualidad de su tiempo.',
        ]],
      ],
      ejemplos: [
        'Cuando miras el cielo estrellado en el campo y sientes que eres parte de algo enorme, estás teniendo una experiencia parecida a la que el hermetismo convirtió en camino espiritual.',
        'La frase "el hombre es un gran milagro" la retomó Pico della Mirandola en el Renacimiento para defender la dignidad humana, una idea que influyó en el humanismo.',
      ],
      practica: [
        'Escribe con tus palabras qué significa que el ser humano sea un "microcosmos".',
        'Busca la frase "el hombre es un gran milagro" y en qué texto aparece.',
        'Pasa diez minutos esta noche mirando el cielo y escribe en el diario qué sentiste.',
      ],
      pregunta: '¿Qué significa para mí la idea de conocerme a mí mismo como camino de sentido?',
      nota: 'El ascenso del alma por las esferas de los planetas se basaba en el modelo del universo de la época, con la Tierra en el centro y los planetas en esferas. Hoy sabemos que el universo no tiene esa forma. Eso no invalida el valor espiritual que alguien pueda encontrar en estos textos, pero sí muestra que sus ideas sobre el cosmos son de su tiempo.',
      recordar: [
        ['¿Qué es el microcosmos en el hermetismo?', 'La idea de que el ser humano es un pequeño mundo que refleja el gran mundo.'],
        ['¿Qué naturaleza doble tiene el ser humano según el hermetismo?', 'Mortal por el cuerpo e inmortal por la mente que viene de Dios.'],
        ['¿Qué texto dice que el ser humano es "un gran milagro"?', 'El Asclepio.'],
        ['¿En qué modelo del universo se basaba el ascenso del alma por las esferas?', 'En el modelo antiguo con la Tierra en el centro y los planetas en esferas.'],
      ],
      tarjetas: [
        ['Microcosmos y macrocosmos', 'El ser humano refleja el universo; conocerse es un camino hacia Dios.'],
        ['"Un gran milagro"', 'Frase del Asclepio sobre el ser humano, retomada por los humanistas del Renacimiento.'],
        ['Cosmos antiguo', 'El ascenso por las esferas planetarias se basaba en un modelo del universo hoy superado.'],
      ],
    }),
    l('La Tabla Esmeralda: "como es arriba, es abajo"', 10, {
      idea: 'La Tabla Esmeralda es un texto muy breve atribuido a Hermes, famoso por la frase "lo que está abajo es como lo que está arriba". Fue central para los alquimistas, pero su origen conocido es árabe y medieval, no egipcio.',
      bloques: [
        ['El texto', [
          'Son unas pocas frases enigmáticas sobre "la operación del Sol", la unión de lo de arriba y lo de abajo y una sustancia que da poder sobre el mundo.',
          'Los alquimistas la leían como una receta cifrada para obtener la piedra filosofal.',
          'Isaac Newton hizo su propia traducción y comentario, que se conserva entre sus manuscritos de alquimia.',
        ]],
        ['Qué dice la tradición', [
          'Que fue grabada por el mismo Hermes en una tabla de esmeralda encontrada en su tumba.',
          'Que contiene en pocas líneas el secreto de toda la alquimia y de la unidad del universo.',
          'Que la frase "como es arriba, es abajo" es una ley universal.',
        ]],
        ['Qué muestra la evidencia', [
          'Las versiones más antiguas conocidas están en árabe, en textos de alrededor de los siglos VIII y IX, como el "Libro del secreto de la creación" atribuido a Apolonio de Tiana (Balinas).',
          'Se tradujo al latín en el siglo XII y desde entonces se difundió en Europa (Principe, 2013).',
          'No hay evidencia de un original egipcio ni de una tabla física de esmeralda: la historia de la tumba es parte de la leyenda.',
        ]],
      ],
      ejemplos: [
        'Hoy la frase "como es arriba, es abajo" aparece en tatuajes, camisetas y redes de espiritualidad. Saber que viene de un texto árabe medieval atribuido a Hermes ayuda a entender su recorrido.',
        'Que Newton estudiara la Tabla Esmeralda sorprende a mucha gente. Muestra que, en el siglo XVII, la alquimia y lo que hoy llamamos ciencia todavía no estaban separadas.',
      ],
      practica: [
        'Lee una traducción de la Tabla Esmeralda (es muy corta) y escribe qué crees que significa.',
        'Busca dónde aparece hoy la frase "como es arriba, es abajo" (redes, tatuajes, libros).',
        'Escribe con tus palabras cuál es el origen documentado del texto.',
      ],
      pregunta: '¿Por qué un texto breve y enigmático puede inspirar tantas interpretaciones distintas?',
      nota: 'La frase "como es arriba, es abajo" se presenta a veces como un principio científico que "la física cuántica confirma". No lo es: es una afirmación filosófica y simbólica. La ciencia sí encuentra patrones que se repiten a distintas escalas en algunos fenómenos, pero eso no prueba una ley mística de correspondencia entre el cielo y la vida humana.',
      recordar: [
        ['¿Cuál es la frase más famosa de la Tabla Esmeralda?', '"Lo que está abajo es como lo que está arriba."'],
        ['¿Cuál es el origen documentado más antiguo de la Tabla Esmeralda?', 'Textos árabes de alrededor de los siglos VIII y IX.'],
        ['¿Cuándo llegó a Europa en latín?', 'En el siglo XII.'],
        ['¿Qué científico famoso la tradujo y comentó?', 'Isaac Newton.'],
      ],
      tarjetas: [
        ['Tabla Esmeralda', 'Texto breve atribuido a Hermes; origen documentado árabe (siglos VIII-IX), latín en el XII.'],
        ['"Como es arriba, es abajo"', 'Afirmación filosófica y simbólica, no un principio científico.'],
        ['Newton alquimista', 'Tradujo la Tabla Esmeralda: en su época, alquimia y ciencia aún no estaban separadas.'],
      ],
    }),
    l('Hermetismo filosófico y hermetismo técnico', 10, {
      idea: 'Bajo el nombre de Hermes circularon dos tipos de textos: los filosóficos (sobre Dios y el alma) y los técnicos (astrología, magia, alquimia, medicina). Separarlos ayuda a no confundir tradiciones distintas.',
      bloques: [
        ['Dos familias de textos', [
          'Garth Fowden (1986) distinguió entre el hermetismo filosófico (como el Corpus Hermeticum) y el técnico.',
          'El técnico incluía instrucciones de astrología, propiedades de plantas y piedras, fórmulas mágicas y procedimientos alquímicos.',
          'Ambos compartían la idea de un cosmos conectado por "simpatías" ocultas entre las cosas.',
        ]],
        ['Qué dice la tradición', [
          'Que todo en el universo está conectado: los planetas influyen en metales, plantas, órganos y caracteres.',
          'Que conocer esas conexiones da poder para curar, transformar metales o influir en el destino.',
          'Que la astrología, la alquimia y la magia son caminos para aplicar la sabiduría de Hermes.',
        ]],
        ['Qué muestra la evidencia', [
          'Las "simpatías" eran la forma de explicar el mundo en la Antigüedad y la Edad Media, antes del método científico moderno.',
          'Algunos conocimientos prácticos de estas tradiciones (sobre plantas, metales o destilación) fueron útiles y pasaron a la medicina y la química.',
          'Las afirmaciones de influencia de los planetas en el carácter o el destino no han resistido las pruebas científicas, como se verá en el curso de Ciencias ocultas.',
        ]],
      ],
      ejemplos: [
        'En las plazas de mercado de Colombia se venden plantas para "la buena suerte" o "contra la envidia" según el día y el astro. Esa lógica de correspondencias entre plantas, astros y destino tiene raíces en tradiciones como el hermetismo técnico.',
        'La destilación, que los alquimistas perfeccionaron, se usa hoy para hacer alcohol, perfumes y medicamentos. Algunas técnicas de estas tradiciones sí pasaron a la ciencia, aunque sus explicaciones no.',
      ],
      practica: [
        'Escribe la diferencia entre el hermetismo filosófico y el técnico con un ejemplo de cada uno.',
        'Busca en tu entorno (plaza de mercado, redes, tiendas esotéricas) un producto basado en correspondencias entre astros y cosas.',
        'Anota un conocimiento práctico que haya pasado de la alquimia a la química.',
      ],
      pregunta: '¿Qué prácticas de "correspondencias" (plantas, colores, astros) he visto en mi familia o mi barrio?',
      nota: 'Es útil separar el valor histórico de estas tradiciones de su validez como explicación del mundo. Estudiar la alquimia o la astrología antigua ayuda a entender cómo pensaba la gente y cómo nació la ciencia moderna; eso no significa que sus afirmaciones sobre el destino o la salud sean ciertas. Si alguien te ofrece curar una enfermedad con estas prácticas en lugar de un tratamiento médico, desconfía.',
      recordar: [
        ['¿Qué distinguió Fowden en los textos herméticos?', 'El hermetismo filosófico (Dios, alma) y el técnico (astrología, magia, alquimia).'],
        ['¿Qué idea compartían ambos?', 'Un cosmos conectado por "simpatías" ocultas entre las cosas.'],
        ['¿Qué pasó con algunos conocimientos prácticos de estas tradiciones?', 'Pasaron a la medicina y la química, como la destilación.'],
        ['¿Han resistido las pruebas científicas las influencias astrales en el destino?', 'No.'],
      ],
      tarjetas: [
        ['Hermetismo filosófico vs. técnico', 'Filosófico: Dios y el alma. Técnico: astrología, magia, alquimia (Fowden).'],
        ['Simpatías', 'La idea antigua de conexiones ocultas entre planetas, metales, plantas y caracteres.'],
        ['Técnicas sí, explicaciones no', 'Técnicas como la destilación pasaron a la ciencia; las explicaciones místicas, no.'],
      ],
    }),
  ],
};

const INFLUENCIA = {
  titulo: 'Influencia: del Renacimiento a hoy',
  objetivo: 'Entender cómo los textos herméticos influyeron en el Renacimiento y en los inicios de la ciencia moderna, qué se exagera de esa influencia y de dónde sale el popular libro "El Kybalión".',
  fuentes: [
    ['Yates, F. A. (1964). Giordano Bruno and the Hermetic Tradition. Routledge & Kegan Paul. (En español: Giordano Bruno y la tradición hermética, Ariel).', 'La tesis de la influencia hermética en el Renacimiento.'],
    ['Westman, R. S. y McGuire, J. E. (1977). Hermeticism and the Scientific Revolution. William Andrews Clark Memorial Library.', 'Crítica a la tesis de Yates sobre la ciencia.'],
    ['Hanegraaff, W. J. (2012). Esotericism and the Academy. Cambridge University Press.', 'El hermetismo dentro de la historia del esoterismo.'],
    ['Newman, W. R. (2019). Newton the Alchemist. Princeton University Press.', 'Los estudios alquímicos de Newton.'],
    ['Deslippe, P. (2011). Introducción a The Kybalion: Centenary Edition. Tarcher/Penguin.', 'El origen estadounidense del Kybalión (1908).'],
  ],
  lecciones: [
    l('El Renacimiento: Ficino, Pico y Bruno', 11, {
      idea: 'En el siglo XV, Cosme de Médici pidió traducir el Corpus Hermeticum antes que las obras de Platón. Los textos de Hermes entusiasmaron a los humanistas del Renacimiento y llegaron hasta Giordano Bruno.',
      bloques: [
        ['La traducción de Ficino', [
          'Hacia 1463, Marsilio Ficino, en Florencia, tradujo al latín el Corpus Hermeticum por encargo de Cosme de Médici; se publicó en 1471.',
          'Cosme le pidió que lo tradujera antes de terminar a Platón, porque se creía más antiguo y venerable.',
          'El libro tuvo muchas ediciones y circuló por toda Europa.',
        ]],
        ['Qué dice la tradición', [
          'Que Hermes era el primero de una cadena de sabios (Hermes, Orfeo, Pitágoras, Platón) que transmitieron la verdadera sabiduría.',
          'Pico della Mirandola usó ideas herméticas y cabalísticas en su "Discurso sobre la dignidad del hombre" (1486).',
          'Giordano Bruno, quemado por la Inquisición en Roma en 1600, defendió un universo infinito y se inspiró en parte en el hermetismo.',
        ]],
        ['Qué muestra la evidencia', [
          'La historiadora Frances Yates (1964) propuso que el hermetismo fue clave en el pensamiento renacentista y en Bruno, a quien vio más como un mago hermético que como un científico.',
          'Su libro fue muy influyente, pero otros historiadores consideran que exageró el peso del hermetismo frente a otras fuentes (el platonismo, la cábala, la filosofía natural).',
          'Lo indudable es que los textos herméticos eran muy leídos y respetados en el Renacimiento, hasta que Casaubon los fechó en 1614.',
        ]],
      ],
      ejemplos: [
        'Es como si hoy se encontrara un libro que se cree escrito por el primer filósofo de la historia: todos querrían leerlo primero. Eso pasó con el Corpus Hermeticum en Florencia.',
        'A Giordano Bruno a veces se le presenta como "mártir de la ciencia". Los historiadores muestran que lo condenaron por varias ideas religiosas consideradas herejías, no solo por defender un universo infinito.',
      ],
      practica: [
        'Busca quién fue Marsilio Ficino y qué otras obras tradujo.',
        'Escribe por qué Cosme de Médici quería el Corpus Hermeticum antes que a Platón.',
        'Busca por qué fue condenado Giordano Bruno y anota las razones que dan los historiadores.',
      ],
      pregunta: '¿Por qué la creencia en que algo era antiquísimo le dio tanto prestigio a estos textos?',
      nota: 'La tesis de Yates fue revolucionaria en su época y abrió el estudio académico del esoterismo, pero hoy se considera exagerada en varios puntos. Algo parecido pasa con la imagen de Bruno: ni fue solo un mago hermético ni solo un mártir de la ciencia; fue un filósofo con ideas muy originales, condenado por varias razones religiosas.',
      recordar: [
        ['¿Quién tradujo el Corpus Hermeticum al latín y para quién?', 'Marsilio Ficino, por encargo de Cosme de Médici.'],
        ['¿Por qué se tradujo antes que Platón?', 'Porque se creía más antiguo y venerable.'],
        ['¿Qué propuso Frances Yates (1964)?', 'Que el hermetismo fue clave en el Renacimiento y en Giordano Bruno.'],
        ['¿Qué critican otros historiadores de Yates?', 'Que exageró el peso del hermetismo frente a otras fuentes.'],
      ],
      tarjetas: [
        ['Ficino y Cosme de Médici', 'El Corpus Hermeticum se tradujo antes que Platón porque se creía más antiguo (publicado en 1471).'],
        ['Tesis de Yates (1964)', 'El hermetismo como clave del Renacimiento; hoy se considera exagerada.'],
        ['Giordano Bruno', 'Quemado en 1600 por varias ideas religiosas; ni solo mago ni solo mártir de la ciencia.'],
      ],
    }),
    l('¿El hermetismo dio origen a la ciencia?', 10, {
      idea: 'Algunos de los fundadores de la ciencia moderna leyeron textos herméticos y practicaron la alquimia, como Newton. Pero decir que el hermetismo "dio origen" a la ciencia es una exageración.',
      bloques: [
        ['Copérnico y Newton', [
          'Copérnico, en su libro de 1543 que puso al Sol en el centro, menciona que Trismegisto llamó al Sol "el dios visible".',
          'Isaac Newton dedicó años a la alquimia y escribió más sobre ella y sobre teología que sobre física (Newman, 2019).',
          'Johannes Kepler mezclaba su astronomía con ideas sobre la armonía del cosmos.',
        ]],
        ['Qué dice la tradición', [
          'Algunos autores esotéricos dicen que la ciencia moderna es un "redescubrimiento" de la sabiduría hermética.',
          'Que figuras como Newton eran, en el fondo, iniciados en una tradición secreta.',
          'Que la ciencia y el hermetismo dicen lo mismo con palabras distintas.',
        ]],
        ['Qué muestra la evidencia', [
          'Westman y McGuire (1977) criticaron la tesis de Yates: el hermetismo influyó en el ambiente intelectual, pero no fue la causa de la revolución científica.',
          'Los historiadores muestran que Newton estudiaba la alquimia con experimentos y registros cuidadosos, buscando entender la materia; no era un "iniciado" en una sociedad secreta.',
          'Lo que hizo distinta a la ciencia fue el método: experimentar, medir y someter las ideas a prueba, algo que las tradiciones herméticas no hacían de forma sistemática.',
        ]],
      ],
      ejemplos: [
        'Un video dice que "Newton era alquimista, así que la alquimia tenía razón". Que un genio estudiara algo no lo vuelve cierto: Newton también estudió profecías bíblicas para calcular el fin del mundo.',
        'La química moderna surgió en parte de las prácticas de los alquimistas (destilar, pesar, mezclar), pero cambió por completo sus explicaciones. Es una evolución, no una continuidad de la sabiduría hermética.',
      ],
      practica: [
        'Busca qué temas estudió Newton además de la física.',
        'Escribe la diferencia entre "influir en el ambiente" y "ser la causa" de algo.',
        'Escribe qué tiene el método científico que no tenían la alquimia ni el hermetismo.',
      ],
      pregunta: '¿Confundo a veces que alguien famoso crea algo con que ese algo sea verdad?',
      nota: 'Durante mucho tiempo se ocultó o se ignoró la alquimia de Newton porque no encajaba con la imagen del científico racional. Hoy los historiadores la estudian en serio. Pero el péndulo no debe irse al otro extremo: reconocer que Newton practicaba la alquimia no convierte la alquimia en ciencia ni prueba una tradición secreta.',
      recordar: [
        ['¿Qué dijo Copérnico sobre Trismegisto?', 'Que llamó al Sol "el dios visible".'],
        ['¿Qué estudió Newton además de física?', 'Alquimia y teología, a las que dedicó mucho tiempo.'],
        ['¿Qué criticaron Westman y McGuire?', 'Que el hermetismo fuera la causa de la revolución científica.'],
        ['¿Qué hizo distinta a la ciencia moderna?', 'El método: experimentar, medir y someter las ideas a prueba.'],
      ],
      tarjetas: [
        ['Newton alquimista', 'Dedicó años a la alquimia y la teología, con registros cuidadosos; no era un "iniciado" secreto.'],
        ['Influencia no es causa', 'El hermetismo influyó en el ambiente, pero no causó la revolución científica.'],
        ['El método', 'Lo que distingue a la ciencia es poner las ideas a prueba, no sus fuentes de inspiración.'],
      ],
    }),
    l('El Kybalión y el hermetismo moderno', 11, {
      idea: 'El libro más popular sobre hermetismo hoy, "El Kybalión", no es antiguo: se publicó en Chicago en 1908 y se atribuye a William Walker Atkinson, un autor del movimiento del Nuevo Pensamiento.',
      bloques: [
        ['El libro', [
          '"El Kybalión" se publicó en 1908 firmado por "Tres Iniciados".',
          'Presenta siete "principios herméticos": mentalismo, correspondencia, vibración, polaridad, ritmo, causa y efecto, y género.',
          'Es uno de los libros esotéricos más vendidos en español y se encuentra en muchas librerías de Colombia.',
        ]],
        ['Qué dice la tradición', [
          'Que resume la enseñanza secreta de Hermes Trismegisto, transmitida de maestro a discípulo desde el antiguo Egipto.',
          'Que "el Todo es Mente" y que, al dominar los principios, la persona puede transformar su realidad con el pensamiento.',
          'Muchos seguidores de la "ley de la atracción" lo usan como base.',
        ]],
        ['Qué muestra la evidencia', [
          'El historiador Philip Deslippe (2011) documentó que el autor fue casi con seguridad William Walker Atkinson, escritor estadounidense del Nuevo Pensamiento.',
          'Los "siete principios" no aparecen en el Corpus Hermeticum ni en la Tabla Esmeralda: son una síntesis moderna con ideas del Nuevo Pensamiento, la teosofía y la ciencia popular de 1900 (como las "vibraciones").',
          'La idea de que el pensamiento cambia directamente la realidad material no tiene respaldo científico.',
        ]],
      ],
      ejemplos: [
        'En una librería de Bogotá encuentras "El Kybalión" en la sección de "sabiduría egipcia antigua". Ahora sabes que es un libro estadounidense de 1908, que puede interesarte como fenómeno cultural pero no como texto egipcio.',
        'Un conocido te dice que si "vibras alto" vas a atraer plata, según los principios herméticos. Puedes explicarle que esa idea viene del Nuevo Pensamiento de comienzos del siglo XX, no del Egipto antiguo, y que pensar positivo no reemplaza un plan financiero.',
      ],
      practica: [
        'Escribe los siete principios del Kybalión y marca si alguno aparece en los textos antiguos que estudiaste.',
        'Busca quién fue William Walker Atkinson y qué era el movimiento del Nuevo Pensamiento.',
        'Relee lo que anotaste sobre Hermes al empezar el curso y escribe qué cambió.',
      ],
      pregunta: '¿Qué ideas de "autoayuda espiritual" he aceptado creyendo que eran antiquísimas?',
      nota: 'Saber que el Kybalión es moderno no impide que alguien encuentre en él ideas útiles para reflexionar. Pero es importante no confundirlo con el hermetismo antiguo y desconfiar de su uso para prometer riqueza o salud con el pensamiento. Si alguien abandona un tratamiento médico o decisiones financieras sensatas por confiar solo en "la mente", puede salir muy perjudicado.',
      recordar: [
        ['¿Cuándo y dónde se publicó El Kybalión?', 'En 1908, en Chicago.'],
        ['¿A quién se atribuye su autoría?', 'A William Walker Atkinson, autor del Nuevo Pensamiento.'],
        ['¿Aparecen los siete principios en los textos herméticos antiguos?', 'No: son una síntesis moderna.'],
        ['¿Tiene respaldo científico la idea de que el pensamiento cambia directamente la realidad?', 'No.'],
      ],
      tarjetas: [
        ['El Kybalión (1908)', 'Libro estadounidense atribuido a William Walker Atkinson, no un texto egipcio antiguo.'],
        ['Siete principios', 'Mentalismo, correspondencia, vibración, polaridad, ritmo, causa y efecto, género: síntesis moderna.'],
        ['Nuevo Pensamiento', 'Movimiento de 1900 detrás de la "ley de la atracción"; el pensamiento no cambia directamente la realidad.'],
      ],
    }),
  ],
};

export default {
  id: 'hermetismo',
  nombre: 'Hermetismo',
  area: 'esoterico',
  icono: '☿',
  nivel: 'Intermedio',
  paraQue: 'Conocer, como historia de las ideas, la tradición atribuida a Hermes Trismegisto: sus textos, sus ideas sobre Dios y el ser humano, su enorme influencia en el Renacimiento y cómo se transformó hasta libros modernos como El Kybalión. Cada lección separa lo que dice la tradición de lo que muestra la evidencia histórica.',
  modulos: [TEXTOS, IDEAS, INFLUENCIA],
  proyecto: {
    titulo: 'El viaje de una idea hermética',
    intro: 'Durante 2 a 3 semanas vas a seguir el recorrido de una idea hermética desde su origen hasta hoy, y escribirás una ficha que separe la tradición de la evidencia.',
    pasos: [
      'Escoge una idea: "como es arriba, es abajo", el ser humano como microcosmos o "el Todo es Mente".',
      'Busca en qué texto aparece por primera vez de forma documentada y de qué época es.',
      'Rastrea cómo la usaron en el Renacimiento o en la alquimia.',
      'Busca cómo se usa hoy en libros, redes o publicidad.',
      'Escribe la sección "Qué dice la tradición" sobre esa idea.',
      'Escribe la sección "Qué muestra la evidencia": su origen real y si tiene respaldo científico.',
      'Concluye qué valor tiene la idea como reflexión personal y qué límites tiene como explicación del mundo.',
    ],
  },
};
