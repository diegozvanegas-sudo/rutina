// Gnosticismo: historia de las ideas. Cada lección separa "Qué dice la tradición" de "Qué muestra la evidencia".
// Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const ORIGENES = {
  titulo: 'Orígenes y fuentes',
  objetivo: 'Saber qué se entiende por gnosticismo, por qué la palabra se discute, y de dónde sale lo que sabemos: los textos de Nag Hammadi y los escritos de sus críticos.',
  fuentes: [
    ['Williams, M. A. (1996). Rethinking "Gnosticism": An argument for dismantling a dubious category. Princeton University Press.', 'Por qué la categoría "gnosticismo" es problemática.'],
    ['King, K. L. (2003). What Is Gnosticism? Harvard University Press.', 'Historia de cómo se construyó la idea de "gnosticismo".'],
    ['Robinson, J. M. (Ed.). (1977). The Nag Hammadi Library in English. Harper & Row.', 'La primera traducción completa al inglés de los textos de Nag Hammadi.'],
    ['Piñero, A., Montserrat Torrents, J. y García Bazán, F. (Eds.). (1997). Textos gnósticos. Biblioteca de Nag Hammadi I. Trotta.', 'La traducción al español de los textos de Nag Hammadi.'],
    ['Pagels, E. (1979). The Gnostic Gospels. Random House. (En español: Los evangelios gnósticos, Crítica).', 'Divulgación influyente sobre los textos gnósticos.'],
    ['Ireneo de Lyon (c. 180). Contra las herejías. Ed. inglesa: Unger, D. J. (trad.) (1992). St. Irenaeus of Lyons: Against the Heresies, Book 1. Paulist Press.', 'La principal fuente antigua sobre los gnósticos, escrita por un crítico.'],
  ],
  lecciones: [
    l('Qué fue el gnosticismo', 10, {
      idea: '"Gnosticismo" es el nombre que se da a varios grupos religiosos de los primeros siglos de nuestra era, sobre todo cristianos, que enseñaban que la salvación llega por un conocimiento (gnosis) secreto sobre el origen divino del ser humano.',
      bloques: [
        ['El contexto', [
          'En los siglos I a III, el cristianismo no era todavía una religión unificada: había muchos grupos con ideas distintas sobre Jesús, Dios y el mundo.',
          '"Gnosis" en griego significa conocimiento. No un conocimiento de libros, sino una comprensión interior y revelada.',
          'Los grupos llamados gnósticos convivían con otros cristianos, con judíos y con filósofos platónicos, y tomaban ideas de todos.',
        ]],
        ['Qué dice la tradición', [
          'Que el ser humano lleva dentro una chispa divina atrapada en el mundo material.',
          'Que el mundo material no fue hecho por el Dios supremo, sino por un ser inferior o ignorante.',
          'Que la salvación consiste en despertar y conocer ese origen divino, y que ese conocimiento lo trae un revelador (para los cristianos gnósticos, Cristo).',
        ]],
        ['Qué muestra la evidencia', [
          'Los historiadores coinciden en que existieron estos grupos y sus textos, y en que fueron rechazados por la corriente que se volvió mayoritaria en el cristianismo.',
          'Michael Williams (1996) y Karen King (2003) argumentan que "gnosticismo" es una categoría moderna que mete en un mismo saco a grupos muy distintos; algunos prefieren hablar de "gnósticos" en plural o de grupos concretos.',
          'Las afirmaciones religiosas (la chispa divina, el creador inferior) no se pueden comprobar ni refutar con métodos científicos: se estudian como creencias de una época.',
        ]],
      ],
      ejemplos: [
        'Si en Colombia hoy hubiera muchas iglesias cristianas con ideas muy distintas y alguien las llamara a todas "los raros", estaría haciendo algo parecido a lo que critican Williams y King con la etiqueta "gnosticismo".',
        'Un amigo te dice que "los gnósticos tenían la verdad que la Iglesia escondió". Este curso no busca decidir quién tenía la verdad religiosa, sino entender qué creían, de dónde venían sus ideas y qué dicen las fuentes.',
      ],
      practica: [
        'Escribe con tus palabras qué significa "gnosis" y en qué se diferencia de saber algo por estudio.',
        'Escribe las tres ideas centrales que se atribuyen a los gnósticos.',
        'Anota qué sabías o habías oído sobre los gnósticos antes de empezar, para compararlo al final del curso.',
      ],
      pregunta: '¿Qué me atrae (o me desconfía) de la idea de un conocimiento secreto que salva?',
      nota: 'Hay que separar el estudio histórico de la fe personal: este curso describe lo que creían estos grupos y lo que dicen los historiadores, sin pretender confirmar ni negar creencias religiosas. También es importante no confundir el gnosticismo antiguo con los movimientos "gnósticos" modernos, que se verán en el módulo 3: comparten el nombre, pero no son una continuidad directa.',
      recordar: [
        ['¿Qué significa "gnosis"?', 'Conocimiento, entendido como comprensión interior y revelada.'],
        ['¿Qué tres ideas se atribuyen a los gnósticos?', 'Una chispa divina en el ser humano, un mundo hecho por un ser inferior y la salvación por el conocimiento.'],
        ['¿Qué critican Williams y King?', 'Que "gnosticismo" es una categoría moderna que agrupa a grupos muy distintos.'],
        ['¿Se pueden comprobar científicamente las creencias gnósticas?', 'No: se estudian como creencias de una época.'],
      ],
      tarjetas: [
        ['Gnosis', 'Conocimiento revelado e interior que, según estos grupos, salva al despertar el origen divino del ser humano.'],
        ['Ideas centrales gnósticas', 'Chispa divina atrapada, mundo hecho por un ser inferior, salvación por el conocimiento.'],
        ['Una categoría discutida', 'Williams y King: "gnosticismo" agrupa grupos muy distintos; es una etiqueta moderna.'],
      ],
    }),
    l('El hallazgo de Nag Hammadi', 10, {
      idea: 'En 1945, unos campesinos egipcios encontraron una vasija con trece códices antiguos. Esos textos, la biblioteca de Nag Hammadi, permitieron por primera vez leer a los gnósticos con sus propias palabras.',
      bloques: [
        ['El hallazgo', [
          'En diciembre de 1945, cerca del pueblo de Nag Hammadi, en el Alto Egipto, unos campesinos desenterraron una vasija de barro con libros encuadernados en cuero.',
          'Eran trece códices escritos en copto (la lengua egipcia de la época cristiana), copiados probablemente en el siglo IV, con más de cincuenta textos.',
          'Pasaron por manos de comerciantes antes de llegar al Museo Copto de El Cairo. Su traducción completa al inglés salió en 1977 (Robinson); en español, la editorial Trotta publicó la traducción (Piñero y otros, desde 1997).',
        ]],
        ['Qué dice la tradición', [
          'Los textos incluyen evangelios, revelaciones, diálogos y tratados que presentan enseñanzas secretas de Jesús o de figuras divinas.',
          'Muchos se presentan como conocimientos reservados a quienes están preparados para entenderlos.',
          'Algunos movimientos actuales los consideran la "verdadera enseñanza" que fue escondida.',
        ]],
        ['Qué muestra la evidencia', [
          'Los textos son auténticamente antiguos: las copias son del siglo IV, aunque muchos se compusieron antes, en el siglo II o III (algunos posiblemente antes).',
          'No todos son gnósticos: la colección incluye también un fragmento de "La República" de Platón y textos de otras corrientes.',
          'Una hipótesis es que pertenecieron a monjes de un monasterio cercano que los escondieron cuando se ordenó destruir textos considerados heréticos; es plausible, pero no está probada.',
        ]],
      ],
      ejemplos: [
        'Es como si en una finca de Boyacá apareciera un baúl enterrado con cartas y diarios de un grupo religioso del que solo conocíamos lo que decían sus enemigos. De pronto podemos leerlos directamente.',
        'Una serie de televisión dice que los textos de Nag Hammadi "prueban" lo que Jesús realmente enseñó. Lo que prueban es que existían esas creencias en los primeros siglos, no que sean más fieles al Jesús histórico que los evangelios del Nuevo Testamento.',
      ],
      practica: [
        'Busca en un mapa dónde queda Nag Hammadi, en Egipto.',
        'Lee un fragmento corto de algún texto de Nag Hammadi (por ejemplo, el Evangelio de Tomás) en una traducción seria y anota qué te llama la atención.',
        'Escribe la diferencia entre "es un texto antiguo" y "es un texto que dice la verdad sobre Jesús".',
      ],
      pregunta: '¿Por qué me resulta atractiva la idea de que hay verdades escondidas que alguien desenterró?',
      nota: 'La historia del hallazgo tiene detalles que se cuentan de forma novelada (por ejemplo, que la madre de uno de los campesinos quemó parte de los papiros en el horno). Vienen de entrevistas hechas años después y no se pueden verificar del todo. Lo que sí es sólido: los códices son auténticos y antiguos, y cambiaron el estudio del cristianismo primitivo.',
      recordar: [
        ['¿Cuándo y dónde se encontró la biblioteca de Nag Hammadi?', 'En 1945, en el Alto Egipto.'],
        ['¿En qué lengua están escritos los códices?', 'En copto.'],
        ['¿De cuándo son las copias y cuándo se compusieron los textos?', 'Las copias, del siglo IV; muchos textos se compusieron antes, en el siglo II o III.'],
        ['¿Todos los textos de Nag Hammadi son gnósticos?', 'No: incluye también un fragmento de La República de Platón y textos de otras corrientes.'],
      ],
      tarjetas: [
        ['Nag Hammadi (1945)', 'Trece códices en copto con más de 50 textos, copiados en el siglo IV: los gnósticos con sus propias palabras.'],
        ['Antiguo no es igual a verdadero', 'Los textos prueban que existían esas creencias, no que sean más fieles al Jesús histórico.'],
        ['Una colección variada', 'No todo es gnóstico: hay hasta un fragmento de La República de Platón.'],
      ],
    }),
    l('Lo que contaban sus críticos', 10, {
      idea: 'Antes de 1945, casi todo lo que se sabía de los gnósticos venía de sus críticos cristianos, los heresiólogos. Sus escritos son valiosos, pero hay que leerlos sabiendo que querían refutarlos.',
      bloques: [
        ['Los heresiólogos', [
          'Ireneo, obispo de Lyon, escribió hacia el año 180 "Contra las herejías", una larga refutación de varios grupos, en especial de los seguidores de Valentín.',
          'Después vinieron otros, como Hipólito de Roma (siglo III) y Epifanio de Salamina (siglo IV), con catálogos de "herejías".',
          'Estos autores ayudaron a definir qué era la "ortodoxia" (la enseñanza correcta) frente a la "herejía".',
        ]],
        ['Qué dice la tradición', [
          'Para los heresiólogos, los gnósticos eran falsos maestros que deformaban las Escrituras y engañaban a los fieles.',
          'Los acusaban de inventar mitos complicados y, a veces, de conductas inmorales.',
          'Para los gnósticos, en cambio, eran ellos quienes tenían la comprensión más profunda del mensaje de Cristo.',
        ]],
        ['Qué muestra la evidencia', [
          'Al comparar con los textos de Nag Hammadi, los historiadores encontraron que Ireneo resumía con bastante exactitud algunos mitos (por ejemplo, el del Apócrifo de Juan).',
          'Pero las acusaciones de inmoralidad eran comunes contra cualquier grupo rival en la Antigüedad, y no tienen respaldo en los textos gnósticos, que suelen ser más bien austeros.',
          'Lección de método: una fuente escrita por un enemigo puede ser útil para los hechos, pero hay que desconfiar de sus juicios.',
        ]],
      ],
      ejemplos: [
        'Es como conocer a un partido político solo por lo que dicen de él sus rivales en campaña. Algunas cosas que cuentan serán ciertas, pero el tono y las acusaciones hay que tomarlas con pinzas.',
        'Cuando un historiador encontró que el resumen de Ireneo coincidía con un texto de Nag Hammadi, ganó confianza en algunas de sus descripciones, pero no en sus acusaciones morales.',
      ],
      practica: [
        'Piensa en un grupo que conozcas solo por lo que dicen sus críticos y escribe qué te faltaría saber.',
        'Escribe la diferencia entre usar una fuente para los hechos y usarla para los juicios.',
        'Busca quién fue Ireneo de Lyon y en qué siglo vivió.',
      ],
      pregunta: '¿A qué grupos o personas conozco solo por lo que dicen sus enemigos?',
      nota: 'Durante siglos, la imagen de los gnósticos fue la que pintaron sus críticos. Desde 1945, algunos autores de divulgación pasaron al extremo contrario y los presentan como héroes de la libertad espiritual oprimidos por una Iglesia autoritaria. Los historiadores serios evitan ambos extremos: eran grupos religiosos con sus propias jerarquías, mitos y exigencias.',
      recordar: [
        ['¿Quién fue Ireneo de Lyon?', 'Un obispo que hacia el año 180 escribió "Contra las herejías", refutando a grupos gnósticos.'],
        ['¿De dónde venía casi todo lo que se sabía de los gnósticos antes de 1945?', 'De sus críticos cristianos, los heresiólogos.'],
        ['¿Qué encontraron los historiadores al comparar a Ireneo con Nag Hammadi?', 'Que resumía con bastante exactitud algunos mitos, aunque sus acusaciones morales no tienen respaldo.'],
        ['¿Qué lección de método deja esto?', 'Una fuente enemiga puede servir para los hechos, pero hay que desconfiar de sus juicios.'],
      ],
      tarjetas: [
        ['Heresiólogos', 'Ireneo (c. 180), Hipólito, Epifanio: críticos cristianos y principal fuente antes de 1945.'],
        ['Fuente enemiga', 'Útil para los hechos, sospechosa para los juicios.'],
        ['Ni villanos ni héroes', 'Los gnósticos no eran ni los inmorales que decían sus críticos ni los rebeldes libertarios de la divulgación moderna.'],
      ],
    }),
  ],
};

const IDEAS = {
  titulo: 'Las ideas y los textos',
  objetivo: 'Conocer el mito gnóstico del creador inferior, las principales escuelas y los "evangelios gnósticos" más conocidos, separando lo que dicen los textos de lo que sabemos sobre su origen.',
  fuentes: [
    ['Waldstein, M. y Wisse, F. (Eds.). (1995). The Apocryphon of John: Synopsis of Nag Hammadi Codices II,1; III,1; and IV,1 with BG 8502,2. Brill.', 'Edición crítica del Apócrifo de Juan, el mito gnóstico más completo.'],
    ['Platón (1992). Timeo. En Diálogos VI (trad. F. Lisi). Gredos.', 'El demiurgo platónico, que influyó en el mito gnóstico.'],
    ['Layton, B. (1987). The Gnostic Scriptures. Doubleday.', 'Traducción y clasificación de los textos gnósticos por escuelas.'],
    ['Markschies, C. (2003). Gnosis: An introduction. T&T Clark. (Original alemán, 2001).', 'Introducción académica breve.'],
    ['DeConick, A. D. (2007). The Thirteenth Apostle: What the Gospel of Judas really says. Continuum.', 'Crítica a la primera traducción del Evangelio de Judas.'],
    ['Ehrman, B. D. (2003). Lost Christianities. Oxford University Press. (En español: Cristianismos perdidos, Crítica).', 'Los cristianismos que no llegaron a ser mayoritarios.'],
  ],
  lecciones: [
    l('El mito: Sofía y el creador ignorante', 11, {
      idea: 'Muchos textos gnósticos cuentan que el mundo material lo hizo un ser inferior, el demiurgo, nacido de un error de Sofía (la Sabiduría). El ser humano conserva una chispa del Dios verdadero y debe despertar.',
      bloques: [
        ['El relato del Apócrifo de Juan', [
          'Hay un Dios supremo, incomprensible, rodeado de una "plenitud" (pleroma) de seres divinos llamados eones.',
          'Uno de ellos, Sofía, quiso crear algo sin su pareja ni el permiso del Padre, y de ese acto nació un ser imperfecto: Yaldabaot, el demiurgo.',
          'Yaldabaot, ignorante de que hay algo por encima de él, creó el mundo material y se proclamó el único dios.',
          'Pero una chispa de luz divina quedó en los seres humanos, y un revelador viene a despertarla.',
        ]],
        ['Qué dice la tradición', [
          'Que el dios que se presenta como único y celoso (identificado por algunos con el dios del Antiguo Testamento) es en realidad el demiurgo ignorante.',
          'Que el mundo material es una especie de prisión, y el cuerpo, una cárcel del espíritu.',
          'Que la salvación es despertar, conocer el origen divino y regresar a la plenitud.',
        ]],
        ['Qué muestra la evidencia', [
          'El mito combina ideas judías (la creación del Génesis), cristianas (Cristo como revelador) y platónicas: en el Timeo de Platón, un "demiurgo" (artesano) da forma al mundo, aunque allí es bueno.',
          'Los especialistas lo leen como una reinterpretación radical de las Escrituras judías y de la filosofía griega, típica del ambiente intelectual de ciudades como Alejandría.',
          'Como relato religioso, no es comprobable; lo que sí se puede estudiar es de dónde tomó sus elementos y cómo se transformaron.',
        ]],
      ],
      ejemplos: [
        'En la película "The Matrix", la humanidad vive en un mundo falso creado por máquinas y alguien viene a "despertarla". Muchos críticos han notado el parecido con el mito gnóstico, aunque los creadores tomaron ideas de muchas fuentes.',
        'Cuando alguien dice "este mundo es una cárcel y solo despertando nos liberamos", está repitiendo, sepa o no, una idea con raíces gnósticas.',
      ],
      practica: [
        'Escribe el mito de Sofía y Yaldabaot en cinco frases, con tus palabras.',
        'Señala en tu resumen qué elementos vienen del Génesis, cuáles del cristianismo y cuáles de Platón.',
        'Piensa en una película, canción o serie que use la idea de "despertar de un mundo falso".',
      ],
      pregunta: '¿Qué me dice sobre la época de los gnósticos que vieran el mundo material como una prisión?',
      nota: 'No todos los textos llamados gnósticos tienen este mito, ni todos ven el cuerpo de la misma manera. Se suele decir que los gnósticos "odiaban el cuerpo": algunos textos son muy negativos con lo material, pero otros son más matizados. Generalizar es justo lo que critican estudiosos como Williams.',
      recordar: [
        ['¿Quién es Sofía en el mito gnóstico?', 'Un ser divino (la Sabiduría) cuyo acto sin permiso dio origen al demiurgo.'],
        ['¿Quién es Yaldabaot?', 'El demiurgo ignorante que creó el mundo material y se proclamó único dios.'],
        ['¿Qué es el pleroma?', 'La "plenitud" de seres divinos que rodean al Dios supremo.'],
        ['¿De dónde viene la palabra "demiurgo"?', 'Del Timeo de Platón, donde es un artesano bueno que da forma al mundo.'],
      ],
      tarjetas: [
        ['El mito gnóstico', 'Sofía actúa sin permiso, nace Yaldabaot (el demiurgo) y crea el mundo; una chispa divina queda en el ser humano.'],
        ['Demiurgo', 'En Platón, un artesano bueno; en el mito gnóstico, un creador ignorante.'],
        ['Mezcla de fuentes', 'Génesis, cristianismo y filosofía platónica reinterpretados en ciudades como Alejandría.'],
      ],
    }),
    l('Las escuelas: valentinianos, setianos y otros', 10, {
      idea: 'Los gnósticos no eran un solo grupo. Los más conocidos son los seguidores de Valentín, que vivían dentro de las comunidades cristianas, y los llamados setianos, con mitos más elaborados.',
      bloques: [
        ['Valentín y sus seguidores', [
          'Valentín fue un maestro cristiano del siglo II, nacido en Egipto, que enseñó en Roma y, según una fuente antigua, estuvo cerca de ser elegido obispo.',
          'Sus seguidores participaban en las comunidades cristianas, pero creían tener una comprensión más profunda, reservada a los "espirituales".',
          'El "Evangelio de la Verdad", encontrado en Nag Hammadi, se asocia a menudo con Valentín o su escuela.',
        ]],
        ['Qué dice la tradición', [
          'Los valentinianos distinguían tres tipos de personas: materiales, psíquicas (la mayoría de los cristianos) y espirituales (los gnósticos).',
          'Los setianos se consideraban descendientes espirituales de Set, el tercer hijo de Adán y Eva, como linaje elegido.',
          'Marción, otro maestro del siglo II, enseñó que el dios del Antiguo Testamento era distinto del Padre de Jesús, aunque no compartía todo el mito gnóstico.',
        ]],
        ['Qué muestra la evidencia', [
          'Bentley Layton (1987) clasificó los textos por escuelas, pero otros especialistas discuten si los "setianos" fueron un grupo real o una categoría de los investigadores.',
          'Marción influyó mucho: su lista de libros sagrados presionó a otros cristianos a definir el suyo.',
          'Lo que muestran las fuentes es una gran diversidad de cristianismos en el siglo II, que solo después se fue unificando.',
        ]],
      ],
      ejemplos: [
        'Imagina a alguien que va a la misma iglesia que todos en tu barrio, pero cree que entiende el mensaje a un nivel más profundo que los demás y se reúne aparte con un grupo selecto. Así funcionaban, en parte, los valentinianos.',
        'Hoy hay muchas iglesias cristianas distintas en Colombia. En el siglo II la diversidad era aún mayor, porque todavía no se había definido qué era la enseñanza "oficial".',
      ],
      practica: [
        'Escribe en una línea qué distinguía a los valentinianos, a los setianos y a Marción.',
        'Busca en qué siglo vivió Valentín y en qué ciudad enseñó.',
        'Piensa en un grupo que conozcas que se considere "más iluminado" que los demás dentro de una misma tradición.',
      ],
      pregunta: '¿Qué riesgos y atractivos tiene dividir a la gente entre "los que entienden" y "los que no"?',
      nota: 'Las clasificaciones de los gnósticos en "escuelas" son en buena parte obra de investigadores modernos y de los heresiólogos antiguos, y se siguen discutiendo. Lo más sólido es que existieron maestros concretos (Valentín, Basílides, Marción) y textos concretos; los grandes rótulos son herramientas para ordenar, no realidades seguras.',
      recordar: [
        ['¿Quién fue Valentín?', 'Un maestro cristiano del siglo II, nacido en Egipto, que enseñó en Roma.'],
        ['¿Qué tres tipos de personas distinguían los valentinianos?', 'Materiales, psíquicas y espirituales.'],
        ['¿Por qué se llamaban setianos?', 'Porque se consideraban descendientes espirituales de Set, hijo de Adán y Eva.'],
        ['¿Qué enseñó Marción?', 'Que el dios del Antiguo Testamento era distinto del Padre de Jesús.'],
      ],
      tarjetas: [
        ['Valentinianos', 'Seguidores de Valentín (siglo II), dentro de las comunidades cristianas pero con una "comprensión espiritual" reservada.'],
        ['Setianos', 'Se veían como linaje espiritual de Set. Si fueron un grupo real se discute.'],
        ['Marción', 'El dios del Antiguo Testamento sería distinto del de Jesús; su lista de libros presionó a definir el canon.'],
      ],
    }),
    l('Los "evangelios gnósticos": Tomás, María y Judas', 11, {
      idea: 'Algunos textos fuera del Nuevo Testamento se volvieron famosos: el Evangelio de Tomás, el de María (Magdalena) y el de Judas. Son fuentes valiosas sobre el cristianismo primitivo, aunque se exagera lo que revelan.',
      bloques: [
        ['Los textos', [
          'El Evangelio de Tomás es una colección de 114 dichos atribuidos a Jesús, sin relato de su vida, muerte ni resurrección. Se encontró completo en Nag Hammadi.',
          'El Evangelio de María (Magdalena) se conoce por fragmentos; presenta a María como una discípula que recibió enseñanzas que otros apóstoles no entendieron.',
          'El Evangelio de Judas se conocía solo por menciones de Ireneo, hasta que apareció en un códice (el Códice Tchacos) publicado en 2006.',
        ]],
        ['Qué dice la tradición', [
          'Tomás presenta a Jesús como maestro de sabiduría: "el Reino está dentro de ustedes", y quien entiende sus palabras "no gustará la muerte".',
          'El Evangelio de María da protagonismo a una mujer como transmisora de la enseñanza.',
          'El Evangelio de Judas presenta a Judas como el discípulo que entendió a Jesús, en un relato con un mito de tipo setiano.',
        ]],
        ['Qué muestra la evidencia', [
          'La mayoría de los especialistas fechan Tomás en el siglo II, aunque algunos creen que conserva dichos antiguos, posiblemente del siglo I; varios dichos se parecen a los de los evangelios del Nuevo Testamento.',
          'El Evangelio de Judas se presentó en 2006 como si rehabilitara a Judas; April DeConick (2007) y otros argumentaron que la primera traducción tenía errores y que el texto, leído bien, presenta a Judas de forma negativa.',
          'Estos textos son, en general, posteriores a los evangelios del Nuevo Testamento, por lo que pocos historiadores los usan como fuente principal sobre el Jesús histórico.',
        ]],
      ],
      ejemplos: [
        'En 2006 muchos noticieros dijeron que "Judas no era un traidor, según un evangelio recién descubierto". Años después, varios especialistas mostraron que la traducción inicial había forzado esa lectura. Es un ejemplo de cómo un titular puede ir más allá del texto.',
        'Una amiga dice que el Evangelio de María "prueba que María Magdalena era la esposa de Jesús". El texto no dice eso: muestra que algunos grupos le daban un papel importante como discípula.',
      ],
      practica: [
        'Lee cinco dichos del Evangelio de Tomás en una traducción seria y anota cuáles se parecen a frases de los evangelios que conoces.',
        'Busca la historia del Evangelio de Judas desde su publicación en 2006 y las críticas a la traducción.',
        'Escribe la diferencia entre "este texto existió" y "este texto cuenta lo que realmente pasó".',
      ],
      pregunta: '¿Por qué crees que los "evangelios perdidos" despiertan tanto interés en el público?',
      nota: 'La novela "El código Da Vinci" (2003) popularizó la idea de que estos evangelios prueban que Jesús se casó con María Magdalena y que la Iglesia lo ocultó. Ningún texto antiguo conocido afirma claramente ese matrimonio; el fragmento del Evangelio de Felipe que a veces se cita está dañado y es ambiguo. Y un papiro presentado en 2012 como "Evangelio de la esposa de Jesús" resultó ser una falsificación moderna.',
      recordar: [
        ['¿Qué es el Evangelio de Tomás?', 'Una colección de 114 dichos atribuidos a Jesús, sin relato de su vida ni muerte.'],
        ['¿Cuándo se publicó el Evangelio de Judas?', 'En 2006, a partir del Códice Tchacos.'],
        ['¿Qué criticó DeConick sobre el Evangelio de Judas?', 'Que la primera traducción tenía errores y que el texto presenta a Judas de forma negativa.'],
        ['¿Algún texto antiguo afirma claramente que Jesús se casó con María Magdalena?', 'No; el fragmento citado del Evangelio de Felipe está dañado y es ambiguo.'],
      ],
      tarjetas: [
        ['Evangelio de Tomás', '114 dichos de Jesús, sin relato de su muerte; fechado en general en el siglo II, con posibles dichos antiguos.'],
        ['Evangelio de Judas (2006)', 'Presentado como rehabilitación de Judas; especialistas corrigieron la traducción.'],
        ['El mito del Código Da Vinci', 'Ningún texto antiguo conocido afirma claramente que Jesús se casó.'],
      ],
    }),
  ],
};

const LEGADO = {
  titulo: 'El legado: de los maniqueos a hoy',
  objetivo: 'Seguir el rastro de las ideas gnósticas en la historia (maniqueos, cátaros, pensadores modernos y movimientos actuales, incluido uno nacido en Colombia) y aprender a distinguir entre continuidad histórica y parecido de ideas.',
  fuentes: [
    ['Jonas, H. (1958). The Gnostic Religion. Beacon Press. (En español: La religión gnóstica, Siruela).', 'Una interpretación filosófica influyente del gnosticismo.'],
    ['BeDuhn, J. D. (2000). The Manichaean Body: In discipline and ritual. Johns Hopkins University Press.', 'Estudio del maniqueísmo.'],
    ['Pegg, M. G. (2008). A Most Holy War: The Albigensian Crusade and the battle for Christendom. Oxford University Press.', 'La cruzada contra los cátaros.'],
    ['Moore, R. I. (2012). The War on Heresy. Belknap Press.', 'Crítica a la imagen tradicional de los cátaros.'],
    ['Hanegraaff, W. J. (2012). Esotericism and the Academy: Rejected knowledge in Western culture. Cambridge University Press.', 'Cómo estudiar el esoterismo como historia de las ideas.'],
    ['Ehrman, B. D. (2003). Lost Christianities. Oxford University Press.', 'Cómo se formó el canon del Nuevo Testamento.'],
  ],
  lecciones: [
    l('Maniqueos y cátaros', 10, {
      idea: 'Después de los gnósticos antiguos surgieron religiones con ideas parecidas: el maniqueísmo, que se extendió de Europa a China, y en la Edad Media los cátaros del sur de Francia. Si hubo una línea directa entre ellos se discute.',
      bloques: [
        ['El maniqueísmo', [
          'Mani (siglo III) fue un profeta nacido en Mesopotamia, entonces bajo el Imperio persa, que fundó una religión que mezclaba elementos cristianos, zoroastrianos y budistas.',
          'Se extendió desde el norte de África hasta China, y fue durante siglos una de las religiones más difundidas del mundo.',
          'San Agustín fue maniqueo durante varios años antes de convertirse al cristianismo.',
        ]],
        ['Qué dice la tradición', [
          'El maniqueísmo enseñaba una lucha cósmica entre dos principios: la Luz (el bien, el espíritu) y la Oscuridad (el mal, la materia).',
          'Los cátaros, en los siglos XII y XIII, rechazaban el mundo material como obra del mal, y sus "perfectos" llevaban una vida muy austera.',
          'Algunos grupos esotéricos modernos presentan a los cátaros como guardianes de un conocimiento secreto que viene de los gnósticos.',
        ]],
        ['Qué muestra la evidencia', [
          'El maniqueísmo está bien documentado con textos propios y de sus críticos (BeDuhn, 2000).',
          'Los cátaros fueron perseguidos con la cruzada albigense (desde 1209) y la Inquisición (Pegg, 2008).',
          'Historiadores como Robert Moore (2012) discuten cuánto de la imagen de los cátaros como una "iglesia" organizada y conectada con los gnósticos fue construcción de sus perseguidores. Una continuidad directa desde los gnósticos antiguos no está probada.',
        ]],
      ],
      ejemplos: [
        'Cuando alguien explica todo como una lucha entre "la luz y la oscuridad", está usando una forma de pensar dualista que se parece al maniqueísmo. Por eso, en lenguaje común, decir que alguien es "maniqueo" significa que ve todo en blanco y negro.',
        'En el sur de Francia, los castillos donde resistieron los cátaros se volvieron destino turístico, y muchas guías repiten leyendas sobre "tesoros secretos" que los historiadores no respaldan.',
      ],
      practica: [
        'Busca en qué siglo vivió Mani y por qué regiones se extendió su religión.',
        'Escribe qué significa hoy llamar "maniquea" a una persona o un discurso, y da un ejemplo de la política o el fútbol.',
        'Escribe la diferencia entre "dos grupos tienen ideas parecidas" y "un grupo desciende del otro".',
      ],
      pregunta: '¿En qué temas tiendo a ver el mundo de forma "maniquea", todo bueno o todo malo?',
      nota: 'Es común que se presente una "cadena secreta" que va de los gnósticos a los maniqueos, los cátaros, los templarios y los masones. Los historiadores no encuentran evidencia de esa continuidad: lo que hay son ideas parecidas que reaparecen, a veces por influencia de textos y otras por coincidencia. Parecido no es descendencia.',
      recordar: [
        ['¿Quién fue Mani?', 'Un profeta del siglo III que fundó una religión que mezclaba elementos cristianos, zoroastrianos y budistas.'],
        ['¿Qué enseñaba el maniqueísmo?', 'Una lucha cósmica entre la Luz (bien, espíritu) y la Oscuridad (mal, materia).'],
        ['¿Quiénes fueron los cátaros?', 'Un movimiento cristiano disidente de los siglos XII y XIII en el sur de Francia, perseguido con la cruzada albigense.'],
        ['¿Hay evidencia de una línea directa de los gnósticos a los cátaros?', 'No está probada; hay ideas parecidas, no una descendencia demostrada.'],
      ],
      tarjetas: [
        ['Maniqueísmo', 'Religión de Mani (siglo III): lucha entre Luz y Oscuridad. Llegó de África a China.'],
        ['Cátaros', 'Disidentes de los siglos XII y XIII en Francia, perseguidos desde 1209. Su imagen se discute.'],
        ['Parecido no es descendencia', 'No hay evidencia de una cadena secreta gnósticos-cátaros-templarios-masones.'],
      ],
    }),
    l('El gnosticismo moderno y en Colombia', 11, {
      idea: 'Desde el siglo XIX, el gnosticismo inspiró a filósofos, psicólogos, artistas y nuevos movimientos religiosos. Uno de los más extendidos en América Latina nació en Colombia, con Samael Aun Weor.',
      bloques: [
        ['Intelectuales y artistas', [
          'El filósofo Hans Jonas (1958) interpretó el gnosticismo como una experiencia de extrañeza ante el mundo, parecida a la del existencialismo moderno.',
          'El psicólogo Carl Jung se interesó mucho por los textos gnósticos, que leía como símbolos del proceso psicológico de autoconocimiento; uno de los códices de Nag Hammadi fue comprado y llamado "Códice Jung".',
          'Escritores como Borges y el cine (como "The Matrix") retomaron imágenes gnósticas.',
        ]],
        ['Qué dice la tradición', [
          'Víctor Manuel Gómez Rodríguez (1917-1977), nacido en Bogotá y conocido como Samael Aun Weor, fundó a mediados del siglo XX un movimiento gnóstico que se extendió por América Latina y otros países.',
          'Su enseñanza mezcla elementos del cristianismo, la teosofía, el hinduismo, la cábala y la alquimia, y se presenta como la "gnosis" o el conocimiento esotérico de todas las épocas.',
          'Hoy existen varias organizaciones que continúan sus enseñanzas, con cursos y templos en muchas ciudades de Colombia.',
        ]],
        ['Qué muestra la evidencia', [
          'Los movimientos gnósticos modernos son nuevos movimientos religiosos: toman el nombre y algunas ideas del gnosticismo antiguo, pero sus enseñanzas son en su mayoría creaciones del siglo XIX y XX.',
          'Wouter Hanegraaff (2012) propone estudiar estos movimientos como parte de la historia del esoterismo occidental, sin burlarse de ellos ni asumir que son verdad.',
          'Afirmaciones como el poder de ciertas prácticas para "despertar la conciencia" o adquirir capacidades especiales no tienen respaldo científico; la experiencia personal de quienes participan es otra cosa, y es real para ellos.',
        ]],
      ],
      ejemplos: [
        'En muchas ciudades colombianas ves anuncios de "cursos gratuitos de gnosis, autoconocimiento y meditación". Muchos están ligados al movimiento fundado por Samael Aun Weor. Saber su historia te permite decidir con información si te interesa.',
        'Un amigo te dice que la gnosis de esos cursos es "la misma de los primeros cristianos". Puedes explicarle que el gnosticismo antiguo y los movimientos actuales comparten el nombre, pero son tradiciones distintas separadas por muchos siglos.',
      ],
      practica: [
        'Busca quién fue Samael Aun Weor y en qué año fundó su movimiento.',
        'Escribe dos diferencias entre el gnosticismo antiguo (siglos II-III) y un movimiento gnóstico actual.',
        'Si te ofrecen un curso espiritual, escribe tres preguntas que harías antes de entrar (quién lo dirige, cuánto cuesta, qué compromisos pide).',
      ],
      pregunta: '¿Qué busco cuando me atraen enseñanzas espirituales que prometen un conocimiento oculto?',
      nota: 'Hablar de la historia de un movimiento religioso no es atacar la fe de quienes participan en él. Muchas personas encuentran comunidad, sentido y prácticas de meditación valiosas en estos grupos. Pero conviene estar atento a señales de alerta en cualquier grupo espiritual: pedir mucha plata, aislarte de tu familia, prohibir dudar o prometer poderes sobrenaturales. Si algo así te pasa a ti o a alguien cercano, habla con personas de confianza fuera del grupo.',
      recordar: [
        ['¿Cómo interpretó Hans Jonas el gnosticismo?', 'Como una experiencia de extrañeza ante el mundo, parecida al existencialismo moderno.'],
        ['¿Por qué se interesó Jung por los gnósticos?', 'Porque leía sus textos como símbolos del proceso psicológico de autoconocimiento.'],
        ['¿Quién fue Samael Aun Weor?', 'Víctor Manuel Gómez Rodríguez (1917-1977), bogotano que fundó un movimiento gnóstico moderno extendido por América Latina.'],
        ['¿El gnosticismo moderno es el mismo que el antiguo?', 'No: comparten el nombre y algunas ideas, pero son tradiciones distintas.'],
      ],
      tarjetas: [
        ['Jonas y Jung', 'Jonas: gnosticismo como extrañeza existencial. Jung: sus textos como símbolos psicológicos.'],
        ['Samael Aun Weor', 'Bogotano (1917-1977) que fundó un movimiento gnóstico moderno muy extendido en América Latina.'],
        ['Gnosis antigua vs. moderna', 'Comparten el nombre, no una continuidad directa: los movimientos actuales son de los siglos XIX y XX.'],
      ],
    }),
    l('Cómo leer textos antiguos sin caer en mitos', 10, {
      idea: 'Alrededor de los gnósticos circulan muchos mitos modernos: que la Iglesia "escondió" los evangelios verdaderos, que había una verdad secreta perdida. Conocer cómo se formó el Nuevo Testamento ayuda a separar historia de leyenda.',
      bloques: [
        ['Cómo se formó el canon', [
          'El canon es la lista de libros que una comunidad considera sagrados. El del Nuevo Testamento se fue formando a lo largo de varios siglos.',
          'Ya en el siglo II circulaban como autoridad los cuatro evangelios de Mateo, Marcos, Lucas y Juan, junto con cartas de Pablo.',
          'En el año 367, el obispo Atanasio de Alejandría escribió una carta con una lista de 27 libros que coincide con el Nuevo Testamento actual (Ehrman, 2003).',
        ]],
        ['Qué dice la tradición', [
          'Para las iglesias cristianas, el canon reconoce los libros inspirados y fieles a la enseñanza de los apóstoles.',
          'Para muchos movimientos esotéricos, el canon fue una decisión política para esconder enseñanzas más profundas.',
          'Para algunos autores de divulgación, existió un cristianismo "original" gnóstico que fue derrotado.',
        ]],
        ['Qué muestra la evidencia', [
          'Los historiadores muestran que hubo una diversidad real de cristianismos y que la selección del canon fue un proceso largo, con criterios teológicos y también disputas de poder.',
          'No hay evidencia de que el cristianismo "original" fuera gnóstico: los textos gnósticos conocidos son, en general, posteriores a los evangelios del Nuevo Testamento.',
          'Los textos gnósticos no estaban "escondidos por el Vaticano": se perdieron porque dejaron de copiarse y algunos fueron destruidos, y hoy cualquiera puede leerlos en traducciones.',
        ]],
      ],
      ejemplos: [
        'Un video en redes dice que "el Concilio de Nicea (325) eligió los libros de la Biblia a votación". Los historiadores señalan que ese concilio no decidió el canon; la lista de 27 libros aparece más tarde, por ejemplo en la carta de Atanasio de 367.',
        'Puedes comprar en una librería de Bogotá o leer en internet traducciones de los textos de Nag Hammadi. Lo que "estaba escondido" hoy está al alcance de cualquiera.',
      ],
      practica: [
        'Escribe con tus palabras qué es un canon y cómo se formó el del Nuevo Testamento.',
        'Busca un video o publicación sobre "los evangelios prohibidos" y revisa qué afirmaciones tienen respaldo y cuáles no.',
        'Relee lo que anotaste al empezar el curso sobre los gnósticos y escribe qué cambió en tu forma de verlos.',
      ],
      pregunta: '¿Por qué nos atraen tanto las historias de verdades escondidas por los poderosos?',
      nota: 'Ser crítico con los mitos modernos no significa negar que hubo luchas de poder en la historia del cristianismo: las hubo, y los grupos que perdieron fueron a veces perseguidos. La pregunta histórica no es "¿quién tenía la verdad religiosa?" (eso no lo resuelve la historia), sino "¿qué creía cada grupo, cuándo y por qué?". Esa distinción entre historia y fe es la base de todo este curso.',
      recordar: [
        ['¿Qué es el canon?', 'La lista de libros que una comunidad considera sagrados.'],
        ['¿Qué hizo Atanasio en el año 367?', 'Escribió una carta con una lista de 27 libros que coincide con el Nuevo Testamento actual.'],
        ['¿Decidió el Concilio de Nicea los libros de la Biblia?', 'No; ese concilio no decidió el canon.'],
        ['¿Hay evidencia de que el cristianismo original fuera gnóstico?', 'No: los textos gnósticos conocidos son en general posteriores a los evangelios del Nuevo Testamento.'],
      ],
      tarjetas: [
        ['Canon del Nuevo Testamento', 'Proceso de siglos; la lista de 27 libros aparece en la carta de Atanasio (367).'],
        ['Mito de Nicea', 'El Concilio de Nicea (325) no eligió los libros de la Biblia.'],
        ['Historia vs. fe', 'La historia pregunta qué creía cada grupo y por qué, no quién tenía la verdad religiosa.'],
      ],
    }),
  ],
};

export default {
  id: 'gnosticismo',
  nombre: 'Gnosticismo',
  area: 'esoterico',
  icono: '✴️',
  nivel: 'Intermedio',
  paraQue: 'Conocer, como historia de las ideas, a los grupos cristianos y paganos de los primeros siglos que enseñaban la salvación por un conocimiento secreto: sus textos, sus mitos, sus críticos y su legado hasta hoy, incluido el movimiento gnóstico nacido en Colombia. Cada lección separa lo que dice la tradición de lo que muestra la evidencia histórica.',
  modulos: [ORIGENES, IDEAS, LEGADO],
  proyecto: {
    titulo: 'Tu ficha de un texto gnóstico',
    intro: 'Durante 2 a 3 semanas vas a leer un texto gnóstico corto en una traducción seria y a escribir una ficha histórica sobre él, separando lo que dice el texto de lo que sabemos sobre su origen.',
    pasos: [
      'Escoge un texto corto: el Evangelio de Tomás, el Evangelio de María o el Evangelio de la Verdad.',
      'Busca una traducción seria al español (por ejemplo, la de la editorial Trotta) y anota su procedencia.',
      'Lee el texto en varias sesiones cortas y subraya las ideas que más se repiten.',
      'Escribe la sección "Qué dice el texto": sus ideas principales en tus palabras.',
      'Escribe la sección "Qué sabemos de su origen": dónde se encontró, en qué lengua, cuándo se copió y cuándo se cree que se escribió.',
      'Busca una afirmación popular sobre ese texto en redes o videos y compárala con lo que dicen los especialistas.',
      'Escribe una conclusión: qué te enseña el texto sobre la diversidad del cristianismo antiguo.',
    ],
  },
};
