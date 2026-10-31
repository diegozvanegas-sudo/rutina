// Ciencias ocultas (astrología, alquimia y magia): historia de las ideas. Cada lección separa "Qué dice la tradición" de "Qué muestra la evidencia".
// Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const ASTROLOGIA = {
  titulo: 'Astrología',
  objetivo: 'Conocer la historia de la astrología desde Babilonia hasta los horóscopos actuales, qué han mostrado las pruebas científicas y por qué los signos del zodiaco ya no coinciden con el cielo.',
  fuentes: [
    ['Campion, N. (2008). A History of Western Astrology, Vol. 1: The ancient world. Continuum.', 'Historia académica de la astrología.'],
    ['Robbins, F. E. (trad.) (1940). Ptolemy: Tetrabiblos. Harvard University Press (Loeb).', 'El tratado de astrología de Ptolomeo (siglo II).'],
    ['Carlson, S. (1985). A double-blind test of astrology. Nature, 318(6045), 419-425.', 'La prueba a doble ciego de astrólogos.'],
    ['Dean, G. y Kelly, I. W. (2003). Is astrology relevant to consciousness and psi? Journal of Consciousness Studies, 10(6-7), 175-198.', 'El estudio de los "gemelos de tiempo" y otras pruebas.'],
    ['Forer, B. R. (1949). The fallacy of personal validation. Journal of Abnormal and Social Psychology, 44(1), 118-123.', 'Por qué los horóscopos parecen acertados.'],
  ],
  lecciones: [
    l('De Babilonia al horóscopo', 10, {
      idea: 'La astrología nació de la observación del cielo en Mesopotamia, donde los movimientos de los astros se leían como mensajes de los dioses. Los griegos la convirtieron en el horóscopo personal, y durante siglos se estudió junto a la astronomía.',
      bloques: [
        ['La historia', [
          'En Mesopotamia, hace más de tres mil años, los sacerdotes registraban eclipses y posiciones de planetas como presagios para el rey y el reino (Campion, 2008).',
          'En el mundo griego, sobre todo en el Egipto helenístico, se desarrolló la astrología personal: el horóscopo según el momento del nacimiento, con los doce signos del zodiaco.',
          'Claudio Ptolomeo, en el siglo II, escribió el Tetrabiblos, el gran tratado de astrología, y también el Almagesto, el gran tratado de astronomía. Para él eran dos partes de un mismo saber.',
        ]],
        ['Qué dice la tradición', [
          'Que la posición del Sol, la Luna y los planetas al nacer influye en la personalidad y el destino.',
          'Que cada signo del zodiaco tiene un carácter: Aries impulsivo, Tauro terco, Libra equilibrado.',
          'Que el cielo y la vida humana se corresponden ("como es arriba, es abajo").',
        ]],
        ['Qué muestra la evidencia', [
          'La astrología fue durante siglos una práctica respetada y estimuló la observación precisa del cielo, de la que se benefició la astronomía.',
          'Con la revolución científica, astronomía y astrología se separaron: la primera adoptó el método de la observación y la prueba; la segunda no logró mostrar sus efectos.',
          'La idea de influencias de los planetas en el carácter no tiene un mecanismo físico conocido: la gravedad del obstetra que atiende el parto es mayor que la de Marte en ese momento.',
        ]],
      ],
      ejemplos: [
        'Cuando lees tu horóscopo en el periódico o en una app, estás usando una versión muy simplificada de una tradición de más de dos mil años, reducida solo al signo solar.',
        'Muchos astrónomos antiguos, como Kepler, hacían horóscopos para ganarse la vida, aunque él mismo era escéptico de muchas de sus reglas.',
      ],
      practica: [
        'Busca qué es el Tetrabiblos y qué es el Almagesto, ambos de Ptolomeo.',
        'Escribe qué sabías o creías de la astrología antes de empezar el curso.',
        'Lee tu horóscopo de hoy y anota qué tan específico es.',
      ],
      pregunta: '¿Por qué siento curiosidad por mi signo, aunque no sepa si creo en la astrología?',
      nota: 'Este curso estudia las llamadas "ciencias ocultas" como historia de las ideas: fueron parte importante de la cultura, el arte y hasta del nacimiento de la ciencia. Respeta a quienes encuentran sentido en ellas, sin darlas por ciertas. El ejemplo de la gravedad del obstetra se usa mucho para ilustrar que no hay un mecanismo físico conocido; no es por sí mismo una prueba de que la astrología no funcione: eso lo muestran los estudios de la próxima lección.',
      recordar: [
        ['¿Dónde nació la astrología?', 'En Mesopotamia, como lectura de presagios en el cielo.'],
        ['¿Dónde se desarrolló el horóscopo personal?', 'En el mundo griego, sobre todo en el Egipto helenístico.'],
        ['¿Qué dos tratados escribió Ptolomeo?', 'El Tetrabiblos (astrología) y el Almagesto (astronomía).'],
        ['¿Cuándo se separaron astronomía y astrología?', 'Con la revolución científica.'],
      ],
      tarjetas: [
        ['Origen de la astrología', 'Mesopotamia (presagios para el rey); el horóscopo personal es griego.'],
        ['Ptolomeo', 'Escribió el Tetrabiblos (astrología) y el Almagesto (astronomía): para él, un mismo saber.'],
        ['Separación', 'Con la revolución científica, la astronomía adoptó la prueba; la astrología no logró mostrar efectos.'],
      ],
    }),
    l('¿Qué dicen las pruebas?', 11, {
      idea: 'La astrología hace afirmaciones que se pueden poner a prueba: que la carta natal describe la personalidad. Los estudios cuidadosos, incluidos algunos diseñados con astrólogos, no han encontrado que acierten más que el azar.',
      bloques: [
        ['El estudio de Carlson', [
          'Shawn Carlson (1985) diseñó con astrólogos un experimento a doble ciego publicado en la revista Nature.',
          'A los astrólogos se les dio la carta natal de una persona y tres perfiles de personalidad (uno real y dos de otras personas), y debían escoger el correcto.',
          'Acertaron más o menos una de cada tres veces, lo que se esperaría por azar, aunque ellos mismos habían predicho que acertarían mucho más.',
        ]],
        ['Qué dice la tradición', [
          'Que una carta natal bien hecha (con hora y lugar exactos) describe con precisión a la persona.',
          'Que los estudios fallan porque simplifican la astrología o no la entienden.',
          'Que la experiencia de millones de personas que se sienten descritas es una prueba.',
        ]],
        ['Qué muestra la evidencia', [
          'Dean y Kelly (2003) revisaron muchos estudios, entre ellos uno con "gemelos de tiempo": más de dos mil personas nacidas en Londres con minutos de diferencia. Si la astrología funcionara, deberían parecerse más entre sí; no se encontraron semejanzas especiales.',
          'El estadístico francés Michel Gauquelin reportó en los años 50 un "efecto Marte" en deportistas destacados; fue muy discutido y otros investigadores no lo confirmaron con claridad, y no apoya la astrología de los signos.',
          'Sentirse descrito se explica bien por el efecto Forer (curso de Numerología): descripciones vagas que le sirven a casi todos.',
        ]],
      ],
      ejemplos: [
        'Tu amiga es Escorpio y te dice que "obvio es intensa, es Escorpio". Si conocieras a cien personas Escorpio, encontrarías de todo: intensas, tranquilas, tímidas. Recordamos los casos que encajan y olvidamos los demás.',
        'Una empresa decide contratar según el signo del candidato. Además de no tener respaldo, eso podría ser discriminatorio e injusto.',
      ],
      practica: [
        'Lee la descripción de un signo que no es el tuyo y anota cuántas frases te describen también.',
        'Escribe con tus palabras qué fue el experimento de Carlson y qué encontró.',
        'Escribe qué tendría que pasar en un estudio para que te convenciera de que la astrología funciona.',
      ],
      pregunta: '¿He juzgado a alguien (o a mí mismo) por su signo?',
      nota: 'Algunos astrólogos responden que la astrología es un lenguaje simbólico para reflexionar sobre la vida, no una predicción científica. Planteada así, deja de ser una afirmación que se pueda poner a prueba y se parece más a una herramienta de reflexión, como un poema o un mito. El problema aparece cuando se usa para tomar decisiones importantes (contratar, casarse, invertir) o se cobra prometiendo predecir el futuro.',
      recordar: [
        ['¿Qué hizo Carlson (1985)?', 'Un experimento a doble ciego con astrólogos, publicado en Nature.'],
        ['¿Qué tan seguido acertaron los astrólogos?', 'Más o menos una de cada tres veces, lo esperado por azar.'],
        ['¿Qué mostró el estudio de los "gemelos de tiempo"?', 'Que personas nacidas con minutos de diferencia no se parecían más entre sí.'],
        ['¿Qué explica que la gente se sienta descrita por su horóscopo?', 'El efecto Forer: descripciones vagas que le sirven a casi todos.'],
      ],
      tarjetas: [
        ['Carlson (1985)', 'Astrólogos a doble ciego: acertaron como el azar, aunque esperaban mucho más.'],
        ['Gemelos de tiempo', 'Personas nacidas con minutos de diferencia no se parecían más (Dean y Kelly, 2003).'],
        ['Astrología como símbolo', 'Si es solo lenguaje simbólico, deja de predecir; el problema es decidir con ella.'],
      ],
    }),
    l('Los signos ya no coinciden con el cielo', 10, {
      idea: 'Por un lento movimiento del eje de la Tierra, las constelaciones se han corrido respecto a las fechas del zodiaco. Si naciste "en Aries", el Sol probablemente estaba frente a la constelación de Piscis.',
      bloques: [
        ['La precesión', [
          'El eje de la Tierra gira lentamente como un trompo, completando una vuelta en unos 26.000 años: es la precesión de los equinoccios.',
          'El astrónomo griego Hiparco la descubrió hacia el siglo II a. C.',
          'Por eso, desde que se fijaron los signos hace unos dos mil años, el cielo se ha corrido casi una constelación completa.',
        ]],
        ['Qué dice la tradición', [
          'La astrología occidental usa el zodiaco "tropical", atado a las estaciones y no a las constelaciones: Aries empieza siempre en el equinoccio de marzo.',
          'Para esa tradición, los signos son divisiones simbólicas del año, no las constelaciones que se ven.',
          'La astrología de la India usa en cambio un zodiaco "sideral", que sí sigue las estrellas.',
        ]],
        ['Qué muestra la evidencia', [
          'Que existen dos sistemas que dan signos distintos a la misma persona, y ambos dicen describirla, es un problema para la idea de que el signo determine la personalidad.',
          'Las constelaciones del zodiaco no ocupan doce partes iguales del cielo, y el Sol también pasa por una decimotercera, Ofiuco.',
          'Ninguno de los dos sistemas ha mostrado en pruebas controladas que describa mejor a las personas.',
        ]],
      ],
      ejemplos: [
        'Naces el 5 de abril y eres "Aries" según el horóscopo del periódico. Si salieras esa noche con un telescopio y vieras dónde está el Sol entre las estrellas, estaría en Piscis.',
        'Cada cierto tiempo se vuelve viral la noticia de que "la NASA cambió los signos" por Ofiuco. La NASA no cambió nada: solo explicó la precesión, que se conoce hace más de dos mil años.',
      ],
      practica: [
        'Busca tu signo en el zodiaco tropical y en el sideral y compara.',
        'Busca en qué fechas pasa el Sol por la constelación de Ofiuco.',
        'Escribe con tus palabras qué es la precesión de los equinoccios.',
      ],
      pregunta: '¿Qué cambiaría en cómo me veo si descubriera que mi "signo" es otro?',
      nota: 'La explicación de la astrología tropical (los signos como divisiones de las estaciones) es coherente dentro de su tradición, y responde a la crítica de que "el cielo se movió". Pero no resuelve la pregunta de fondo: si el signo, sea tropical o sideral, describe de verdad a las personas, algo que las pruebas no han mostrado.',
      recordar: [
        ['¿Qué es la precesión de los equinoccios?', 'El giro lento del eje de la Tierra, que completa una vuelta en unos 26.000 años.'],
        ['¿Quién la descubrió?', 'El astrónomo griego Hiparco, hacia el siglo II a. C.'],
        ['¿Qué diferencia hay entre el zodiaco tropical y el sideral?', 'El tropical sigue las estaciones; el sideral, las estrellas.'],
        ['¿Qué es Ofiuco?', 'Una decimotercera constelación por la que pasa el Sol.'],
      ],
      tarjetas: [
        ['Precesión', 'El eje terrestre gira en unos 26.000 años: las constelaciones se corrieron casi un signo.'],
        ['Tropical vs. sideral', 'Dos zodiacos dan signos distintos a la misma persona; ninguno ha mostrado describirla mejor.'],
        ['Ofiuco', 'El Sol pasa por una 13.ª constelación; se conoce hace siglos, la NASA no "cambió los signos".'],
      ],
    }),
  ],
};

const ALQUIMIA = {
  titulo: 'Alquimia',
  objetivo: 'Entender qué buscaban los alquimistas, cómo su trabajo dio origen a la química moderna y cómo la física nuclear logró, de verdad, transformar unos elementos en otros.',
  fuentes: [
    ['Principe, L. M. (2013). The Secrets of Alchemy. University of Chicago Press.', 'Historia de la alquimia, de Egipto a la Ilustración.'],
    ['Newman, W. R. y Principe, L. M. (2002). Alchemy Tried in the Fire: Starkey, Boyle, and the fate of Helmontian chymistry. University of Chicago Press.', 'Los cuadernos de laboratorio de alquimistas del siglo XVII.'],
    ['Newman, W. R. y Principe, L. M. (1998). Alchemy vs. chemistry: The etymological origins of a historiographic mistake. Early Science and Medicine, 3(1), 32-65.', 'Por qué antes no se distinguía entre alquimia y química.'],
    ['Boyle, R. (1661). The Sceptical Chymist. Londres.', 'Crítica de las teorías de los elementos de su época.'],
    ['Lavoisier, A. (1789). Traité élémentaire de chimie. París.', 'El libro que fundó la química moderna.'],
    ['Aleklett, K. et al. (1981). Energy dependence of 209Bi fragmentation in relativistic nuclear collisions. Physical Review C, 23(3), 1044-1046.', 'El experimento que convirtió bismuto en una cantidad diminuta de oro.'],
  ],
  lecciones: [
    l('Qué buscaban los alquimistas', 10, {
      idea: 'Los alquimistas buscaban transformar metales comunes en oro, encontrar la piedra filosofal y un elixir de larga vida. Detrás de esas metas había teorías sobre la materia, experimentos reales y, para muchos, un sentido espiritual.',
      bloques: [
        ['La historia', [
          'La alquimia aparece en el Egipto grecorromano: Zósimo de Panópolis, hacia el año 300, es uno de los primeros autores conocidos.',
          'Se desarrolló mucho en el mundo islámico; a Jabir ibn Hayyan (conocido en Europa como Geber) se le atribuyen muchos textos.',
          'Llegó a Europa en el siglo XII con las traducciones del árabe al latín, y fue practicada hasta el siglo XVIII (Principe, 2013).',
        ]],
        ['Qué dice la tradición', [
          'Que todos los metales maduran lentamente en la tierra hacia el oro, y el alquimista puede acelerar ese proceso.',
          'Que existe una "piedra filosofal" capaz de transformar metales en oro y de curar enfermedades.',
          'Para muchos alquimistas, la transformación de la materia era también un símbolo de la purificación del alma.',
        ]],
        ['Qué muestra la evidencia', [
          'Las teorías de los alquimistas sobre la materia (como que los metales están hechos de mercurio y azufre) resultaron equivocadas.',
          'Pero sus experimentos eran reales: destilaban, sublimaban, pesaban, preparaban ácidos y sales, y registraban resultados.',
          'Nadie logró nunca hacer oro por medios químicos; muchos "transmutadores" fueron estafadores que usaban trucos, como crisoles de doble fondo con oro escondido.',
        ]],
      ],
      ejemplos: [
        'La palabra "alcohol" viene del árabe, como "alambique" y "álcali": son huellas en nuestro idioma del trabajo de los alquimistas del mundo islámico.',
        'Hoy hay quienes venden en internet "oro monoatómico" o "agua de plata alquímica" que curaría todo. Son productos sin respaldo; la piedra filosofal sigue sin existir.',
      ],
      practica: [
        'Busca tres palabras del español que vengan del vocabulario alquímico árabe (alcohol, alambique, álcali, elixir).',
        'Escribe qué era la piedra filosofal según la tradición.',
        'Anota qué sabías o creías de la alquimia antes de empezar.',
      ],
      pregunta: '¿Qué "piedra filosofal" he buscado en mi vida: algo que lo resolviera todo de una vez?',
      nota: 'La imagen del alquimista como un mago loco o un charlatán no es justa con la historia: muchos fueron investigadores serios para su época. Pero tampoco hay que idealizarlos: sus teorías eran incorrectas y hubo muchos fraudes. Los historiadores actuales los estudian como parte del camino hacia la ciencia moderna.',
      recordar: [
        ['¿Qué buscaban los alquimistas?', 'Transformar metales en oro, la piedra filosofal y un elixir de larga vida.'],
        ['¿Quién es uno de los primeros alquimistas conocidos?', 'Zósimo de Panópolis, hacia el año 300 en Egipto.'],
        ['¿Cuándo llegó la alquimia a Europa?', 'En el siglo XII, con traducciones del árabe al latín.'],
        ['¿Logró alguien hacer oro por medios químicos?', 'No; muchos "transmutadores" fueron estafadores.'],
      ],
      tarjetas: [
        ['Alquimia', 'Buscaba hacer oro, la piedra filosofal y el elixir; de Egipto al mundo islámico y Europa.'],
        ['Teorías malas, experimentos reales', 'Su idea de la materia falló, pero destilaban, pesaban y registraban de verdad.'],
        ['Huella en el idioma', 'Alcohol, alambique, álcali, elixir: palabras del vocabulario alquímico árabe.'],
      ],
    }),
    l('De la alquimia a la química', 10, {
      idea: 'La química moderna no surgió de la nada: nació en los laboratorios de los alquimistas. En el siglo XVII "alquimia" y "química" eran casi lo mismo, y fue en el siglo XVIII cuando se separaron.',
      bloques: [
        ['Cuando eran lo mismo', [
          'William Newman y Lawrence Principe (1998) mostraron que hasta fines del siglo XVII se usaban las palabras "alquimia" y "química" casi como sinónimos; ellos usan "quimia" (chymistry) para ese periodo.',
          'Paracelso (siglo XVI) aplicó los métodos alquímicos a la medicina, preparando remedios con minerales.',
          'Robert Boyle, en "El químico escéptico" (1661), criticó las teorías antiguas de los elementos, pero él mismo siguió interesado en la transmutación.',
        ]],
        ['Qué dice la tradición', [
          'Que la alquimia verdadera era un arte espiritual y secreto, y que la química fue una versión materialista y degradada.',
          'Que los grandes científicos fueron iniciados alquímicos que escondieron sus secretos.',
          'Que la alquimia y la química son caminos opuestos.',
        ]],
        ['Qué muestra la evidencia', [
          'Newman y Principe (2002) estudiaron los cuadernos de laboratorio del alquimista George Starkey: eran registros cuidadosos de experimentos, muy parecidos a los de un químico.',
          'Antoine Lavoisier, con su "Tratado elemental de química" (1789), estableció la conservación de la masa y una nueva lista de elementos; desde entonces, la química moderna dejó atrás la transmutación.',
          'La lectura de la alquimia como un camino puramente espiritual se popularizó sobre todo en el siglo XIX y con Jung; muchos alquimistas históricos estaban muy interesados en la materia real.',
        ]],
      ],
      ejemplos: [
        'Cuando un químico en un laboratorio colombiano destila, filtra o precipita una sustancia, usa técnicas que perfeccionaron los alquimistas, aunque con teorías completamente distintas.',
        'Lavoisier fue ejecutado en la guillotina durante la Revolución francesa en 1794, no por su ciencia sino por haber sido recaudador de impuestos. Un matemático de la época dijo que bastó un instante para cortar esa cabeza y quizás un siglo no bastaría para producir otra igual.',
      ],
      practica: [
        'Escribe qué cambió Lavoisier en la química.',
        'Busca quién fue Paracelso y qué aportó a la medicina.',
        'Escribe con tus palabras por qué Newman y Principe hablan de "quimia" para el siglo XVII.',
      ],
      pregunta: '¿Qué ideas que hoy considero equivocadas me sirvieron como paso para aprender algo correcto?',
      nota: 'La historia de la alquimia es un buen ejemplo de que la ciencia avanza corrigiendo: muchas técnicas sobrevivieron mientras las explicaciones cambiaron por completo. Tampoco hay que creer que los químicos modernos "descubrieron que los alquimistas tenían razón": la transmutación por medios químicos sigue siendo imposible.',
      recordar: [
        ['¿Qué mostraron Newman y Principe sobre las palabras "alquimia" y "química"?', 'Que hasta fines del siglo XVII se usaban casi como sinónimos.'],
        ['¿Qué hizo Paracelso?', 'Aplicó los métodos alquímicos a la medicina, preparando remedios con minerales.'],
        ['¿Qué libro publicó Boyle en 1661?', '"El químico escéptico", que criticaba las teorías antiguas de los elementos.'],
        ['¿Qué estableció Lavoisier en 1789?', 'La conservación de la masa y una nueva lista de elementos: la química moderna.'],
      ],
      tarjetas: [
        ['Quimia (Newman y Principe)', 'Hasta fines del siglo XVII, alquimia y química eran casi lo mismo.'],
        ['Lavoisier (1789)', 'Conservación de la masa y nuevos elementos: nace la química moderna.'],
        ['Técnicas sobreviven, teorías cambian', 'Destilar y filtrar siguieron; la transmutación química quedó atrás.'],
      ],
    }),
    l('La transmutación real: la física nuclear', 10, {
      idea: 'Los alquimistas no podían transformar un elemento en otro con química. Pero en el siglo XX, la física nuclear lo logró: cambiando el núcleo de los átomos, se pueden convertir unos elementos en otros, incluso en oro, aunque no vale la pena.',
      bloques: [
        ['Por qué la química no podía', [
          'Un elemento se define por el número de protones de su núcleo: el oro tiene 79, el plomo 82.',
          'Las reacciones químicas solo cambian los electrones de las capas externas; no tocan el núcleo.',
          'Por eso, por más que se calentara, mezclara o destilara, el plomo nunca se volvió oro.',
        ]],
        ['Qué dice la tradición', [
          'Que la transmutación de los metales es posible y que la piedra filosofal es la clave.',
          'Que algunos maestros lograron hacer oro y guardaron el secreto.',
          'Que la ciencia moderna "redescubrió" lo que los alquimistas sabían.',
        ]],
        ['Qué muestra la evidencia', [
          'En 1919, Ernest Rutherford logró transformar nitrógeno en oxígeno bombardeándolo con partículas: la primera transmutación artificial.',
          'En 1980, un equipo del laboratorio de Berkeley, con el químico Glenn Seaborg, convirtió una cantidad diminuta de bismuto en oro en un acelerador de partículas (Aleklett y otros, 1981).',
          'Hicieron solo unos miles de átomos de oro, a un costo enorme: muchísimo más caro que el oro que produjeron. La física nuclear lo hace con un mecanismo completamente distinto al que imaginaban los alquimistas.',
        ]],
      ],
      ejemplos: [
        'Los reactores nucleares y el sol transforman elementos todo el tiempo: en el núcleo del Sol, el hidrógeno se convierte en helio. La "alquimia" real ocurre en las estrellas.',
        'Si alguien te ofrece invertir en una tecnología para "fabricar oro barato", desconfía: la única forma conocida es nuclear y cuesta mucho más que el oro que produce.',
      ],
      practica: [
        'Busca cuántos protones tienen el oro, el plomo y el mercurio en la tabla periódica.',
        'Escribe por qué una reacción química no puede convertir plomo en oro.',
        'Busca qué hizo Rutherford en 1919 y por qué se considera la primera transmutación artificial.',
      ],
      pregunta: '¿Qué sueño antiguo de la humanidad se cumplió por un camino completamente distinto al imaginado?',
      nota: 'Se dice a veces que "los alquimistas tenían razón, porque se puede hacer oro". Es una forma engañosa de contarlo: lo que se logró es nuclear, no químico, se basa en una teoría de la materia que los alquimistas no tenían, y no sirve para enriquecerse. Es mejor verlo como un final irónico de una vieja búsqueda.',
      recordar: [
        ['¿Qué define a un elemento químico?', 'El número de protones de su núcleo.'],
        ['¿Por qué la química no puede convertir plomo en oro?', 'Porque las reacciones químicas solo cambian los electrones, no el núcleo.'],
        ['¿Qué logró Rutherford en 1919?', 'Transformar nitrógeno en oxígeno: la primera transmutación artificial.'],
        ['¿Qué pasó en 1980 en Berkeley?', 'Se convirtió una cantidad diminuta de bismuto en oro, a un costo enorme.'],
      ],
      tarjetas: [
        ['Elemento = protones', 'El oro tiene 79, el plomo 82. La química no toca el núcleo; por eso no puede transmutar.'],
        ['Rutherford (1919)', 'Primera transmutación artificial: nitrógeno en oxígeno.'],
        ['Oro nuclear (1980)', 'Bismuto en oro en un acelerador: unos miles de átomos, mucho más caros que el oro.'],
      ],
    }),
  ],
};

const MAGIA = {
  titulo: 'Magia y ocultismo',
  objetivo: 'Conocer la historia de la magia en Europa y en Colombia (incluida la caza de brujas y la Inquisición de Cartagena), el ocultismo moderno y cómo reconocer los negocios que se aprovechan de estas creencias.',
  fuentes: [
    ['Agrippa, H. C. (1533). De occulta philosophia libri tres. Colonia.', 'El gran tratado renacentista de magia natural y ceremonial.'],
    ['Levack, B. P. (2006). The Witch-Hunt in Early Modern Europe (3.ª ed.). Pearson Longman.', 'Historia académica de la caza de brujas.'],
    ['Splendiani, A. M., Sánchez Bohórquez, J. E. y Luque de Salazar, E. C. (1997). Cincuenta años de inquisición en el Tribunal de Cartagena de Indias, 1610-1660. Centro Editorial Javeriano.', 'Los procesos de la Inquisición en Cartagena.'],
    ['Owen, A. (2004). The Place of Enchantment: British occultism and the culture of the modern. University of Chicago Press.', 'El ocultismo moderno: la Golden Dawn y su época.'],
    ['Dummett, M. (1980). The Game of Tarot. Duckworth.', 'El tarot como juego de cartas y su uso ocultista posterior.'],
    ['Vyse, S. A. (1997). Believing in Magic: The psychology of superstition. Oxford University Press.', 'Por qué creemos en la magia y la superstición.'],
  ],
  lecciones: [
    l('Magia, brujería y la caza de brujas', 11, {
      idea: 'En el Renacimiento, algunos sabios estudiaron la "magia natural" como conocimiento de fuerzas ocultas. Al mismo tiempo, el miedo a la brujería llevó a una persecución en la que murieron decenas de miles de personas, sobre todo mujeres. La Inquisición también juzgó "brujería" en Cartagena.',
      bloques: [
        ['La magia de los sabios', [
          'Heinrich Cornelius Agrippa publicó en 1533 "Sobre la filosofía oculta", un gran tratado de magia natural, astrológica y ceremonial.',
          'El inglés John Dee, matemático y consejero de la reina Isabel I, intentó comunicarse con ángeles.',
          'Para ellos, la magia era una forma de conocer y usar las fuerzas ocultas de la naturaleza, cercana a la filosofía y la ciencia de su tiempo.',
        ]],
        ['Qué dice la tradición', [
          'Que existen personas capaces de hacer daño o curar con poderes sobrenaturales.',
          'Que las brujas hacían pactos con el diablo y se reunían en aquelarres.',
          'Que hay rituales y objetos capaces de proteger, enamorar o dañar.',
        ]],
        ['Qué muestra la evidencia', [
          'Brian Levack (2006) estima que en Europa, entre los siglos XV y XVIII, unas noventa mil personas fueron juzgadas por brujería y alrededor de la mitad fueron ejecutadas; la mayoría eran mujeres.',
          'Los historiadores explican la caza de brujas por miedos religiosos, crisis sociales, conflictos entre vecinos y el uso de la tortura para obtener confesiones; no por la existencia de poderes reales.',
          'En América, el Tribunal de la Inquisición de Cartagena de Indias (desde 1610) juzgó casos de "brujería" y "hechicería", muchos contra mujeres y personas esclavizadas de origen africano, cuyas prácticas religiosas se veían como diabólicas (Splendiani y otros, 1997).',
        ]],
      ],
      ejemplos: [
        'En el Palacio de la Inquisición de Cartagena, hoy museo, se pueden ver instrumentos y documentos de esos procesos. Es una forma de recordar cómo la acusación de brujería sirvió para perseguir a los más vulnerables.',
        'Todavía hoy, en distintas partes del mundo, se acusa de brujería a personas (sobre todo mujeres mayores) y se las agrede. La creencia en brujas no es solo historia antigua.',
      ],
      practica: [
        'Busca qué era el Tribunal de la Inquisición de Cartagena y cuándo funcionó.',
        'Escribe tres causas que dan los historiadores para la caza de brujas.',
        'Busca cuántas personas estima Levack que fueron juzgadas y ejecutadas en Europa.',
      ],
      pregunta: '¿A quiénes se señala hoy como "culpables" de los males de una comunidad, y por qué?',
      nota: 'Se suele decir que "la Inquisición quemó a millones de brujas". Las investigaciones de archivo dan cifras mucho menores (decenas de miles en toda Europa), y la mayoría de las ejecuciones no fueron de la Inquisición española, sino de tribunales locales en zonas de Europa central. Corregir la cifra no le quita gravedad: fue una persecución terrible. Este curso estudia la magia como historia de las ideas, con respeto por las tradiciones y creencias de las personas.',
      recordar: [
        ['¿Qué publicó Agrippa en 1533?', '"Sobre la filosofía oculta", un gran tratado de magia.'],
        ['¿Cuántas personas fueron juzgadas por brujería en Europa según Levack?', 'Unas noventa mil, y alrededor de la mitad fueron ejecutadas.'],
        ['¿Cómo explican los historiadores la caza de brujas?', 'Por miedos religiosos, crisis sociales, conflictos entre vecinos y el uso de la tortura.'],
        ['¿Desde cuándo funcionó el Tribunal de la Inquisición de Cartagena?', 'Desde 1610.'],
      ],
      tarjetas: [
        ['Magia renacentista', 'Agrippa (1533) y John Dee: la magia como conocimiento de fuerzas ocultas.'],
        ['Caza de brujas (Levack)', 'Unas 90.000 personas juzgadas en Europa y cerca de la mitad ejecutadas; mayoría mujeres.'],
        ['Inquisición de Cartagena', 'Desde 1610 juzgó "brujería", sobre todo a mujeres y personas esclavizadas.'],
      ],
    }),
    l('El ocultismo moderno', 10, {
      idea: 'En el siglo XIX surgió el "ocultismo" moderno: sociedades como la Sociedad Teosófica y la Orden Hermética de la Aurora Dorada mezclaron magia, astrología, cábala y religiones orientales. Muchas ideas de la Nueva Era vienen de ahí.',
      bloques: [
        ['El nacimiento del ocultismo', [
          'El francés Éliphas Lévi, en la década de 1850, popularizó la palabra "ocultismo" y una visión de la magia como ciencia oculta.',
          'En 1875, Helena Blavatsky fundó en Nueva York la Sociedad Teosófica, que mezclaba ideas hindúes, budistas y esotéricas occidentales.',
          'En 1888 se fundó en Londres la Orden Hermética de la Aurora Dorada (Golden Dawn), que enseñaba magia ceremonial; uno de sus miembros fue el poeta W. B. Yeats.',
        ]],
        ['Qué dice la tradición', [
          'Que existe una sabiduría oculta común a todas las religiones, conocida por maestros iniciados.',
          'Que con rituales, meditación y entrenamiento la persona puede desarrollar facultades espirituales.',
          'Aleister Crowley, que pasó por la Golden Dawn, definió la magia como "la ciencia y el arte de causar cambios conforme a la voluntad".',
        ]],
        ['Qué muestra la evidencia', [
          'Alex Owen (2004) muestra que el ocultismo moderno fue una respuesta a su época: una búsqueda de lo espiritual en un mundo cada vez más científico e industrial.',
          'Blavatsky afirmaba recibir enseñanzas de "maestros" en el Tíbet; una investigación de la Sociedad para la Investigación Psíquica (1885) concluyó que algunos de sus fenómenos eran fraudulentos, aunque sus seguidores lo discuten.',
          'Las tradiciones ocultistas modernas influyeron mucho en el arte, la literatura y en movimientos actuales (Nueva Era, gnosis moderna), pero sus afirmaciones de poderes no se han comprobado.',
        ]],
      ],
      ejemplos: [
        'La idea de los "chakras" y la "energía" que se oye en clases de yoga en Colombia llegó a Occidente en buena parte a través de la teosofía, que reinterpretó ideas hindúes.',
        'El movimiento gnóstico de Samael Aun Weor (curso de Gnosticismo) tomó muchos elementos de la teosofía y del ocultismo del siglo XIX.',
      ],
      practica: [
        'Busca quién fue Helena Blavatsky y qué fue la Sociedad Teosófica.',
        'Busca qué artistas o escritores estuvieron cerca del ocultismo (Yeats, Kandinsky).',
        'Escribe una idea de la espiritualidad actual que creas que viene del ocultismo del siglo XIX.',
      ],
      pregunta: '¿Qué ideas espirituales que doy por "antiguas" pueden haber nacido en el siglo XIX?',
      nota: 'Los historiadores del esoterismo, como Hanegraaff, insisten en estudiar estos movimientos en serio, como parte de la cultura moderna, sin burlarse ni darles la razón. Muchas personas encuentran en ellos sentido, comunidad o inspiración artística. Lo que la evidencia no respalda son las afirmaciones de poderes sobrenaturales o de "maestros" con conocimientos secretos.',
      recordar: [
        ['¿Quién popularizó la palabra "ocultismo"?', 'Éliphas Lévi, en la década de 1850.'],
        ['¿Qué fundó Helena Blavatsky en 1875?', 'La Sociedad Teosófica.'],
        ['¿Qué fue la Golden Dawn?', 'La Orden Hermética de la Aurora Dorada, fundada en Londres en 1888, que enseñaba magia ceremonial.'],
        ['¿Cómo explica Alex Owen el ocultismo moderno?', 'Como una búsqueda de lo espiritual en un mundo cada vez más científico e industrial.'],
      ],
      tarjetas: [
        ['Ocultismo moderno', 'Lévi (1850s), Sociedad Teosófica (1875), Golden Dawn (1888).'],
        ['Teosofía', 'Mezcla de ideas hindúes, budistas y esotéricas; muy influyente en la Nueva Era.'],
        ['Respuesta a su época (Owen)', 'Búsqueda espiritual en un mundo industrial; influencia cultural real, poderes no comprobados.'],
      ],
    }),
    l('Tarot, "amarres" y el negocio de lo oculto', 11, {
      idea: 'El tarot nació como un juego de cartas en la Italia del siglo XV y se volvió herramienta de adivinación en el siglo XVIII. Hoy, la adivinación y los "trabajos" son un gran negocio, y algunos se aprovechan de personas en momentos difíciles.',
      bloques: [
        ['La historia del tarot', [
          'Michael Dummett (1980) mostró que las cartas del tarot aparecieron en el norte de Italia en el siglo XV como un juego de mesa, parecido a otros juegos de cartas.',
          'En 1781, el francés Antoine Court de Gébelin afirmó, sin pruebas, que el tarot contenía la sabiduría del antiguo Egipto, y a partir de ahí se usó para adivinar.',
          'El mazo más usado hoy (Rider-Waite) se publicó en 1909, diseñado por miembros de la Golden Dawn.',
        ]],
        ['Qué dice la tradición', [
          'Que las cartas del tarot revelan el pasado, el presente y el futuro de quien consulta.',
          'Que los "trabajos", "amarres" y "limpias" pueden atraer el amor, la plata o alejar la envidia.',
          'Que algunas personas tienen el don de ver más allá.',
        ]],
        ['Qué muestra la evidencia', [
          'No hay estudios controlados que muestren que el tarot o la adivinación predigan el futuro mejor que el azar.',
          'Las lecturas parecen acertadas por mecanismos conocidos: el efecto Forer, la "lectura en frío" (sacar información de las reacciones y la apariencia de la persona) y el sesgo de confirmación.',
          'Stuart Vyse (1997) explica que las supersticiones y la magia nos dan sensación de control en situaciones inciertas, lo cual es humano y comprensible; el problema es cuando se aprovechan de esa necesidad.',
        ]],
      ],
      ejemplos: [
        'Una persona desesperada porque su pareja la dejó paga 300.000 pesos por un "amarre". Luego le dicen que el trabajo "está bloqueado" y que necesita pagar más. Es un patrón de estafa conocido: cada pago lleva a otro.',
        'Una amiga usa las cartas del tarot para reflexionar sobre su vida, como un ejercicio de imaginación y autoconocimiento, sin pagarle a nadie. Es muy distinto a entregar plata a alguien que promete controlar el futuro.',
      ],
      practica: [
        'Busca la historia del tarot como juego de cartas y el papel de Court de Gébelin.',
        'Escribe qué es la "lectura en frío" y cómo podría usarse en una consulta.',
        'Escribe las señales de alerta de una estafa con "trabajos" (pedir más plata, urgencia, amenazas de que algo malo pasará).',
      ],
      pregunta: '¿En qué momentos de incertidumbre he buscado (o buscaría) respuestas en la adivinación, y qué necesitaba en realidad?',
      nota: 'Respetar las creencias de las personas no significa callar ante el abuso. En Colombia es frecuente que "brujos" o "videntes" cobren sumas cada vez mayores a personas en duelo, con problemas de pareja o enfermas, a veces con amenazas. Si te pasa a ti o a alguien cercano, puedes denunciarlo ante la Fiscalía. Y si lo que estás atravesando es una pérdida, una ruptura o una enfermedad, busca apoyo en personas de confianza y en profesionales de la salud: la angustia es real y merece una ayuda real.',
      recordar: [
        ['¿Cómo nació el tarot según Dummett?', 'Como un juego de cartas en el norte de Italia en el siglo XV.'],
        ['¿Quién lo convirtió en herramienta de adivinación y cuándo?', 'Antoine Court de Gébelin, en 1781, sin pruebas de su origen egipcio.'],
        ['¿Qué es la lectura en frío?', 'Sacar información de las reacciones y la apariencia de la persona para parecer acertado.'],
        ['¿Por qué creemos en la magia según Vyse?', 'Porque nos da sensación de control en situaciones inciertas.'],
      ],
      tarjetas: [
        ['Origen del tarot (Dummett)', 'Juego de cartas italiano del siglo XV; adivinación desde 1781 (Court de Gébelin).'],
        ['Lectura en frío', 'Información sacada de reacciones y apariencia: parece un don, es técnica.'],
        ['Estafa de los "trabajos"', 'Cada pago lleva a otro, con urgencia y amenazas. Se puede denunciar ante la Fiscalía.'],
      ],
    }),
  ],
};

export default {
  id: 'ciencias-ocultas',
  nombre: 'Ciencias ocultas',
  area: 'esoterico',
  icono: '🔮',
  nivel: 'Básico',
  paraQue: 'Conocer, como historia de las ideas, la astrología, la alquimia y la magia: de dónde vienen, qué papel tuvieron en el nacimiento de la ciencia y qué muestran las pruebas sobre sus afirmaciones. También aprenderás a reconocer cuándo estas creencias se usan para aprovecharse de las personas. Cada lección separa lo que dice la tradición de lo que muestra la evidencia.',
  modulos: [ASTROLOGIA, ALQUIMIA, MAGIA],
  proyecto: {
    titulo: 'Tu laboratorio de lo oculto',
    intro: 'Durante 2 a 3 semanas vas a poner a prueba, de forma casera y respetuosa, algunas afirmaciones de las ciencias ocultas, y a escribir lo que aprendiste.',
    pasos: [
      'Escoge una práctica: horóscopos, tarot o signos zodiacales.',
      'Si escoges horóscopos: durante una semana, copia el horóscopo de los doce signos sin decir cuál es cuál, y al final de cada día escoge cuál describió mejor tu día.',
      'Si escoges signos: pide a varias personas (con su permiso) que lean descripciones de signos sin nombre y escojan la que mejor las describe; anota si escogen la suya.',
      'Compara tus resultados con lo que esperarías por azar (1 de cada 12 para horóscopos).',
      'Busca la historia de la práctica que escogiste y escribe "Qué dice la tradición" y "Qué muestra la evidencia".',
      'Escribe una lista de señales de alerta para reconocer cuándo alguien usa estas prácticas para aprovecharse de otros.',
      'Concluye qué valor cultural o personal tiene la práctica y qué límites tiene como forma de conocer el futuro.',
    ],
  },
};
