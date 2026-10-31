// Masonería: historia de las ideas. Cada lección separa "Qué dice la tradición" de "Qué muestra la evidencia".
// Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const ORIGENES = {
  titulo: 'Orígenes: de los canteros a las logias',
  objetivo: 'Conocer cómo nació la masonería a partir de los gremios de constructores, qué pasó en 1717 en Londres y qué hay de cierto en las leyendas sobre su origen en el Templo de Salomón o los templarios.',
  fuentes: [
    ['Stevenson, D. (1988). The Origins of Freemasonry: Scotland’s century, 1590-1710. Cambridge University Press.', 'El paso de las logias de constructores a las logias especulativas en Escocia.'],
    ['Anderson, J. (1723). The Constitutions of the Free-Masons. Londres.', 'Las primeras constituciones de la Gran Logia de Londres.'],
    ['Jacob, M. C. (1991). Living the Enlightenment: Freemasonry and politics in eighteenth-century Europe. Oxford University Press.', 'La masonería en la Ilustración.'],
    ['Prescott, A. y Sommers, S. M. (2017). Searching for the apple tree: Revisiting the earliest years of organized English Freemasonry. En J. Noël (Ed.), Reflections on 300 Years of Freemasonry. Lewis Masonic.', 'Investigación que cuestiona la fecha tradicional de 1717.'],
    ['Barber, M. (1994). The New Knighthood: A history of the Order of the Temple. Cambridge University Press.', 'Historia académica de los templarios.'],
    ['Knight, C. y Lomas, R. (1996). The Hiram Key. Century. (En español: La clave masónica).', 'Ejemplo de pseudohistoria popular sobre el origen masónico.'],
  ],
  lecciones: [
    l('De los gremios de canteros a las logias', 10, {
      idea: 'La masonería nació de los gremios de canteros que construían catedrales y castillos. Entre los siglos XVI y XVII, en Escocia e Inglaterra, sus logias empezaron a admitir a personas que no eran constructores, y se volvieron sociedades de reflexión y fraternidad.',
      bloques: [
        ['Los masones "operativos"', [
          'En la Edad Media, los canteros (en inglés, masons) eran trabajadores calificados que viajaban de obra en obra.',
          'Se organizaban en logias (los talleres junto a las obras) y tenían reglas, pruebas de oficio y palabras de reconocimiento para demostrar que eran maestros.',
          'Documentos como el "Poema Regius" (hacia 1390) y el "Manuscrito Cooke" (hacia 1450) recogen sus reglas y una historia legendaria del oficio.',
        ]],
        ['Qué dice la tradición', [
          'Que la masonería conserva un conocimiento antiguo que se remonta a los constructores del Templo de Salomón.',
          'Que el paso de "operativa" (constructores) a "especulativa" (filosófica) fue una transmisión ininterrumpida de secretos.',
          'Que los símbolos de los constructores (escuadra, compás, nivel) guardan una sabiduría moral.',
        ]],
        ['Qué muestra la evidencia', [
          'David Stevenson (1988) documentó que en Escocia, desde fines del siglo XVI (con los Estatutos de Schaw de 1598 y 1599), las logias de canteros llevaban actas y empezaron a admitir miembros que no eran constructores.',
          'Esos nuevos miembros (nobles, comerciantes, intelectuales) se interesaban por la fraternidad, el simbolismo y la sociabilidad, no por cortar piedra.',
          'Los historiadores ven una evolución gradual de un gremio a una sociedad simbólica, no la transmisión de un secreto antiquísimo.',
        ]],
      ],
      ejemplos: [
        'Hoy un sindicato o una asociación de oficio tiene reglas, carnés y formas de reconocer a sus miembros. Los gremios de canteros medievales hacían algo parecido, con palabras y señas en lugar de carnés.',
        'Un maestro de obra que le enseña a su ayudante a trazar con cuerda y escuadra está transmitiendo un saber práctico, como hacían los canteros medievales en sus logias.',
      ],
      practica: [
        'Escribe con tus palabras la diferencia entre masonería "operativa" y "especulativa".',
        'Busca qué fueron los Estatutos de Schaw y en qué país se dieron.',
        'Anota qué sabías o habías oído sobre los masones antes de empezar el curso.',
      ],
      pregunta: '¿Por qué crees que personas que no eran constructores quisieron entrar a las logias de canteros?',
      nota: 'Este curso estudia la masonería como historia de las ideas y de las organizaciones: qué es, de dónde viene y qué papel ha tenido, separando hechos de leyendas, sin atacar ni defender a quienes la integran. Muchas de las leyendas de origen las crearon los propios masones como parte de su simbolismo, no necesariamente como afirmaciones históricas literales.',
      recordar: [
        ['¿De dónde viene la masonería según los historiadores?', 'De los gremios de canteros que construían catedrales y castillos.'],
        ['¿Qué son el Poema Regius y el Manuscrito Cooke?', 'Documentos medievales (hacia 1390 y 1450) con reglas e historia legendaria del oficio.'],
        ['¿Qué documentó Stevenson en Escocia?', 'Que desde fines del siglo XVI las logias admitían miembros que no eran constructores.'],
        ['¿Qué diferencia hay entre masonería operativa y especulativa?', 'La operativa era de constructores reales; la especulativa, de personas interesadas en el simbolismo y la fraternidad.'],
      ],
      tarjetas: [
        ['Origen de la masonería', 'Gremios de canteros medievales que, desde los siglos XVI-XVII, admitieron a no constructores.'],
        ['Operativa vs. especulativa', 'Operativa: constructores reales. Especulativa: fraternidad y simbolismo.'],
        ['Escocia, 1598-1599', 'Los Estatutos de Schaw y las actas de logias muestran la transición (Stevenson, 1988).'],
      ],
    }),
    l('1717: la Gran Logia de Londres', 10, {
      idea: 'Según la tradición, en 1717 cuatro logias de Londres se unieron y formaron la primera Gran Logia. Con ella y con las Constituciones de Anderson (1723) nació la masonería moderna, que se extendió por el mundo en el siglo XVIII.',
      bloques: [
        ['La fundación', [
          'La fecha tradicional es el 24 de junio de 1717, cuando cuatro logias se reunieron en una taberna de Londres y eligieron un Gran Maestro.',
          'En 1723, el pastor James Anderson publicó las "Constituciones", con una historia legendaria del oficio y las reglas de la orden.',
          'Desde Londres, la masonería se extendió por Europa, las colonias americanas y otras partes del mundo durante el siglo XVIII (Jacob, 1991).',
        ]],
        ['Qué dice la tradición', [
          'Que 1717 marca el "renacimiento" o la reorganización de una orden mucho más antigua.',
          'Que las Constituciones de Anderson recogen la historia verdadera de la masonería desde Adán y los constructores bíblicos.',
          'Que la orden reunía a hombres de distintas creencias bajo principios morales comunes.',
        ]],
        ['Qué muestra la evidencia', [
          'Las Constituciones de Anderson contienen una "historia" que los historiadores consideran legendaria: empieza con Adán y pasa por Noé, Salomón y los reyes de Inglaterra.',
          'Investigaciones recientes (Prescott y Sommers, 2017) señalan que casi todo lo que sabemos de 1717 viene de un relato de Anderson escrito años después, y que la organización pudo formarse algo más tarde.',
          'Lo indudable es que hacia 1720 había una Gran Logia en Londres con miembros influyentes, ligados a la ciencia y a la vida política de la época.',
        ]],
      ],
      ejemplos: [
        'Muchas instituciones tienen una "historia oficial" de su fundación que mezcla hechos y leyenda, como algunos clubes de fútbol o ciudades con mitos de origen. La masonería no es la excepción.',
        'En 2017, muchas logias del mundo celebraron los "300 años" de la masonería moderna. Los historiadores aprovecharon el aniversario para revisar qué se sabe realmente de esa fecha.',
      ],
      practica: [
        'Escribe qué pasó, según la tradición, el 24 de junio de 1717.',
        'Busca qué eran las Constituciones de Anderson y cuándo se publicaron.',
        'Escribe un ejemplo de institución o ciudad colombiana con una historia de fundación que mezcle hechos y leyenda.',
      ],
      pregunta: '¿Por qué a las organizaciones les gusta tener una historia de origen antigua y heroica?',
      nota: 'Que algunos datos de la fundación de 1717 sean inciertos no significa que la masonería moderna no haya surgido en Londres a comienzos del siglo XVIII: eso está bien documentado. Lo que se discute es el detalle exacto. Hay que distinguir entre una duda histórica razonable y las teorías que niegan toda la evidencia.',
      recordar: [
        ['¿Qué pasó según la tradición el 24 de junio de 1717?', 'Cuatro logias de Londres se unieron y formaron la primera Gran Logia.'],
        ['¿Qué publicó James Anderson en 1723?', 'Las Constituciones de la Gran Logia, con reglas y una historia legendaria.'],
        ['¿Qué cuestionan Prescott y Sommers?', 'Que casi todo lo que se sabe de 1717 viene de un relato posterior de Anderson; la organización pudo formarse algo después.'],
        ['¿Por dónde se extendió la masonería en el siglo XVIII?', 'Por Europa, las colonias americanas y otras partes del mundo.'],
      ],
      tarjetas: [
        ['1717', 'Fecha tradicional de la primera Gran Logia en Londres; su detalle se discute.'],
        ['Constituciones de Anderson (1723)', 'Reglas de la orden y una historia legendaria desde Adán.'],
        ['Masonería moderna', 'Surgió en Londres a comienzos del siglo XVIII y se expandió con la Ilustración.'],
      ],
    }),
    l('Templarios, Salomón e Hiram: las leyendas', 10, {
      idea: 'Las leyendas dicen que la masonería viene de los constructores del Templo de Salomón o de los caballeros templarios. Son relatos simbólicos y, en algunos casos, invenciones del siglo XVIII en adelante; no hay evidencia histórica de esa continuidad.',
      bloques: [
        ['Hiram Abiff y el Templo de Salomón', [
          'En la Biblia aparece Hiram, un artesano que trabajó en el Templo de Salomón.',
          'La masonería creó a partir de él una leyenda propia: Hiram Abiff, maestro constructor asesinado por tres obreros que querían robarle sus secretos, y que se negó a revelarlos.',
          'Esa leyenda se representa en el ritual del grado de Maestro como una enseñanza moral sobre la fidelidad y la muerte.',
        ]],
        ['Qué dice la tradición', [
          'Que la masonería desciende de los constructores del Templo de Salomón.',
          'Que los caballeros templarios, disueltos en 1312, sobrevivieron en secreto y fundaron la masonería en Escocia.',
          'Que los masones guardan tesoros o secretos de los templarios.',
        ]],
        ['Qué muestra la evidencia', [
          'La historia de Hiram Abiff asesinado no está en la Biblia: es una leyenda masónica que aparece en documentos del siglo XVIII.',
          'Malcolm Barber (1994) y otros historiadores de los templarios no encuentran evidencia de que la orden sobreviviera en secreto ni de una conexión con la masonería.',
          'La conexión templaria la inventaron algunos grados masónicos del siglo XVIII y la popularizaron después libros como "La clave masónica" (Knight y Lomas, 1996), que los historiadores consideran pseudohistoria.',
        ]],
      ],
      ejemplos: [
        'Novelas y películas presentan a masones guardando el tesoro de los templarios. Es entretenimiento, como lo son las leyendas de El Dorado: interesantes, pero no historia documentada.',
        'Para un masón, la leyenda de Hiram puede ser una enseñanza moral sobre la lealtad, sin necesidad de creer que pasó literalmente. Muchas tradiciones usan relatos simbólicos así.',
      ],
      practica: [
        'Busca qué dice la Biblia sobre Hiram (1 Reyes 7) y compáralo con la leyenda masónica.',
        'Busca en qué año fueron disueltos los templarios y por qué.',
        'Escribe la diferencia entre una leyenda simbólica y una afirmación histórica.',
      ],
      pregunta: '¿Qué leyendas de mi familia, mi región o mi religión entiendo como símbolos y cuáles como hechos?',
      nota: 'Las leyendas de origen cumplen una función dentro de la masonería: dan sentido a sus rituales y enseñanzas. Muchos masones las entienden como alegorías y no como historia literal. El problema aparece cuando libros comerciales las presentan como hechos comprobados. Como en el curso de Gnosticismo: parecido o inspiración no es descendencia.',
      recordar: [
        ['¿Quién es Hiram Abiff en la leyenda masónica?', 'Un maestro constructor del Templo de Salomón, asesinado por no revelar sus secretos.'],
        ['¿Está la historia del asesinato de Hiram en la Biblia?', 'No: es una leyenda masónica del siglo XVIII.'],
        ['¿Cuándo fueron disueltos los templarios?', 'En 1312.'],
        ['¿Hay evidencia de que los templarios fundaran la masonería?', 'No: es una conexión inventada en el siglo XVIII y popularizada por pseudohistoria.'],
      ],
      tarjetas: [
        ['Hiram Abiff', 'Leyenda masónica (siglo XVIII) del constructor asesinado; enseñanza moral en el grado de Maestro.'],
        ['Templarios y masones', 'Sin evidencia de continuidad; la conexión se inventó en el siglo XVIII.'],
        ['Leyenda vs. historia', 'Muchos masones entienden sus leyendas como alegorías; los libros comerciales las venden como hechos.'],
      ],
    }),
  ],
};

const QUE_HACEN = {
  titulo: 'Qué es y qué hace la masonería',
  objetivo: 'Entender cómo se organiza la masonería (grados, logias, símbolos), cuáles son sus ideales, en qué se diferencian sus distintas ramas y por qué la Iglesia católica la ha rechazado.',
  fuentes: [
    ['Bullock, S. C. (1996). Revolutionary Brotherhood: Freemasonry and the transformation of the American social order, 1730-1840. University of North Carolina Press.', 'La masonería como fraternidad y su papel social.'],
    ['Ferrer Benimeli, J. A. (1980). Masonería española contemporánea. Siglo XXI.', 'Historia de la masonería en el mundo hispano.'],
    ['Clemente XII (1738). In eminenti apostolatus specula (bula).', 'La primera condena papal de la masonería.'],
    ['Congregación para la Doctrina de la Fe (1983). Declaración sobre la masonería.', 'La postura católica actual.'],
    ['Hanegraaff, W. J. (2012). Esotericism and the Academy. Cambridge University Press.', 'La masonería dentro de la historia del esoterismo occidental.'],
  ],
  lecciones: [
    l('Grados, logias y símbolos', 10, {
      idea: 'La masonería se organiza en logias, y sus miembros avanzan por grados (aprendiz, compañero y maestro). Usa símbolos tomados de la construcción, como la escuadra y el compás, para transmitir enseñanzas morales.',
      bloques: [
        ['La organización', [
          'Una logia es el grupo local de masones que se reúne con regularidad; varias logias forman una Gran Logia.',
          'Los tres grados básicos son aprendiz, compañero y maestro, y a cada uno se accede con una ceremonia de iniciación.',
          'Existen "ritos" con grados adicionales, como el Rito Escocés Antiguo y Aceptado, que tiene 33 grados.',
        ]],
        ['Qué dice la tradición', [
          'La escuadra simboliza la rectitud en la conducta; el compás, la medida y el control de las pasiones.',
          'El "Gran Arquitecto del Universo" es la forma masónica de referirse a un principio creador, sin imponer una religión concreta.',
          'Los rituales y las palabras de reconocimiento son secretos que el iniciado promete guardar.',
        ]],
        ['Qué muestra la evidencia', [
          'Los rituales y símbolos masónicos están documentados: muchos se han publicado desde el siglo XVIII, por exmiembros, críticos y por las propias organizaciones.',
          'Los historiadores describen la masonería más como una "sociedad discreta" (con reuniones privadas y rituales propios) que como una sociedad secreta: suele tener sedes conocidas y existencia legal.',
          'Los 33 grados del Rito Escocés no significan una jerarquía de poder oculto: son grados honoríficos y de estudio simbólico.',
        ]],
      ],
      ejemplos: [
        'Ves el símbolo de la escuadra y el compás en un edificio del centro de Bogotá o de Barranquilla. Es probablemente una sede masónica: no son lugares escondidos, sino edificios conocidos.',
        'Alguien dice que "un masón grado 33 controla el país". Los grados son pasos simbólicos dentro de la orden, no cargos con poder sobre la sociedad.',
      ],
      practica: [
        'Escribe los tres grados básicos de la masonería y qué simbolizan la escuadra y el compás.',
        'Busca si en tu ciudad hay una sede masónica conocida.',
        'Escribe la diferencia entre "sociedad secreta" y "sociedad discreta".',
      ],
      pregunta: '¿Qué grupos de mi vida tienen rituales, símbolos o reglas propias que los de afuera no conocen?',
      nota: 'Los rituales masónicos son "secretos" en el sentido de que los miembros prometen no revelarlos, pero buena parte de su contenido es accesible en libros de historia. El atractivo del misterio ha alimentado muchas especulaciones, pero lo que se conoce de los rituales es sobre todo enseñanza moral simbólica.',
      recordar: [
        ['¿Cuáles son los tres grados básicos de la masonería?', 'Aprendiz, compañero y maestro.'],
        ['¿Qué simbolizan la escuadra y el compás?', 'La rectitud en la conducta y la medida o el control de las pasiones.'],
        ['¿Qué es el "Gran Arquitecto del Universo"?', 'La forma masónica de referirse a un principio creador, sin imponer una religión concreta.'],
        ['¿Qué son los 33 grados del Rito Escocés?', 'Grados honoríficos y de estudio simbólico, no una jerarquía de poder oculto.'],
      ],
      tarjetas: [
        ['Grados masónicos', 'Aprendiz, compañero y maestro; el Rito Escocés suma grados simbólicos hasta el 33.'],
        ['Escuadra y compás', 'Rectitud en la conducta y medida de las pasiones.'],
        ['Sociedad discreta', 'Reuniones privadas y rituales propios, pero sedes conocidas y existencia legal.'],
      ],
    }),
    l('Ideales y ramas: regulares, liberales y mixtas', 10, {
      idea: 'La masonería dice promover la fraternidad, la tolerancia, la caridad y el perfeccionamiento moral. Pero no es una sola organización: hay ramas que exigen creer en Dios y otras no, y algunas admiten mujeres.',
      bloques: [
        ['Los ideales', [
          'Fraternidad entre personas de distintas clases y creencias.',
          'Tolerancia religiosa y debate de ideas, en un tiempo (siglo XVIII) de guerras de religión.',
          'Caridad y ayuda mutua entre sus miembros y hacia la sociedad.',
          'Steven Bullock (1996) muestra que, en el siglo XVIII, las logias fueron espacios donde se practicaban formas de sociabilidad, debate y elección de autoridades que influyeron en la vida cívica.',
        ]],
        ['Qué dice la tradición', [
          'Que la masonería "toma hombres buenos y los hace mejores".',
          'Que no es una religión, sino una escuela de moral basada en símbolos.',
          'Que en la logia no se discute de política partidista ni de religión.',
        ]],
        ['Qué muestra la evidencia', [
          'Las masonerías llamadas "regulares" (vinculadas a la Gran Logia Unida de Inglaterra) exigen creer en un Ser Supremo y solo admiten hombres.',
          'El Gran Oriente de Francia eliminó en 1877 la obligación de creer en Dios, y desde entonces se habla de masonería "liberal", más activa en temas políticos y laicos.',
          'Desde 1893 existen órdenes mixtas, como "Le Droit Humain", y también logias solo de mujeres. En la práctica, la regla de no hablar de política no siempre se ha cumplido, sobre todo en la rama liberal.',
        ]],
      ],
      ejemplos: [
        'Dos personas te dicen que son masones y tienen ideas muy distintas sobre religión y política. Puede que pertenezcan a ramas diferentes: una regular, otra liberal.',
        'Una mujer colombiana te cuenta que es masona. No es una contradicción: hay órdenes mixtas y femeninas, aunque las regulares solo admiten hombres.',
      ],
      practica: [
        'Escribe las diferencias entre la masonería regular y la liberal.',
        'Busca qué pasó en 1877 en el Gran Oriente de Francia.',
        'Escribe qué ideales masónicos te parecen valiosos y cuáles te generan dudas.',
      ],
      pregunta: '¿Qué espacios de mi vida me permiten debatir con personas que piensan distinto?',
      nota: 'Hablar de "la masonería" en singular es engañoso: hay muchas organizaciones que no se reconocen entre sí y que tienen posiciones distintas. Tampoco hay que aceptar sin más la autoimagen ("hacemos hombres mejores") ni la de sus críticos ("controlan el mundo"): como cualquier organización humana, tiene miembros de todo tipo y ha tenido aciertos y escándalos.',
      recordar: [
        ['¿Cuáles son los ideales que dice promover la masonería?', 'Fraternidad, tolerancia, caridad y perfeccionamiento moral.'],
        ['¿Qué exige la masonería regular?', 'Creer en un Ser Supremo y, en general, solo admite hombres.'],
        ['¿Qué hizo el Gran Oriente de Francia en 1877?', 'Eliminó la obligación de creer en Dios.'],
        ['¿Existen logias que admitan mujeres?', 'Sí: órdenes mixtas desde 1893 (como Le Droit Humain) y logias femeninas.'],
      ],
      tarjetas: [
        ['Ideales masónicos', 'Fraternidad, tolerancia, caridad y mejora moral; espacios de sociabilidad cívica (Bullock).'],
        ['Regular vs. liberal', 'Regular: creer en un Ser Supremo, solo hombres. Liberal (Gran Oriente de Francia, 1877): sin ese requisito.'],
        ['No hay una sola masonería', 'Muchas organizaciones distintas que no siempre se reconocen entre sí.'],
      ],
    }),
    l('La Iglesia católica y la masonería', 10, {
      idea: 'Desde 1738, la Iglesia católica ha condenado la masonería, y su posición oficial sigue siendo que los católicos no deben pertenecer a ella. Entender por qué ayuda a comprender buena parte de la historia política de países como Colombia.',
      bloques: [
        ['La historia del conflicto', [
          'En 1738, el papa Clemente XII condenó la masonería en la bula "In eminenti" y prohibió a los católicos pertenecer a ella.',
          'Después vinieron muchas condenas más, sobre todo en el siglo XIX, cuando muchas logias se asociaron con el liberalismo y la separación entre Iglesia y Estado.',
          'En 1983, una declaración de la Congregación para la Doctrina de la Fe reafirmó que los católicos que se afilian a la masonería están en "pecado grave".',
        ]],
        ['Qué dice la tradición', [
          'Para la Iglesia, los principios masónicos (como la idea de que todas las religiones son igualmente válidas) son incompatibles con la fe católica, y el secreto y los juramentos son problemáticos.',
          'Muchos masones responden que la masonería no es una religión ni compite con ninguna, y que sus miembros pueden ser creyentes.',
          'Algunas iglesias protestantes también la han criticado, y otras no.',
        ]],
        ['Qué muestra la evidencia', [
          'Los historiadores muestran que el conflicto fue en buena parte político: en el siglo XIX, muchas logias apoyaron la educación laica, el matrimonio civil y la reducción del poder de la Iglesia.',
          'José Antonio Ferrer Benimeli (1980) estudió cómo en el mundo hispano la masonería fue a la vez real, exagerada por sus enemigos y usada como chivo expiatorio.',
          'La posición de la Iglesia es una cuestión de doctrina religiosa; la historia explica el contexto, no decide quién tiene la razón teológica.',
        ]],
      ],
      ejemplos: [
        'En muchas familias colombianas se dice que "los masones son enemigos de la Iglesia". Esa idea tiene raíces en los conflictos del siglo XIX entre liberales y conservadores, que verás en el próximo módulo.',
        'Una persona católica le pregunta a un amigo masón si puede ser las dos cosas. Para la Iglesia católica, no; para muchas logias, sí. Son posiciones distintas sobre una misma pregunta.',
      ],
      practica: [
        'Busca en qué año fue la primera condena papal de la masonería.',
        'Escribe dos razones de la Iglesia para condenarla y dos respuestas de los masones.',
        'Pregunta a alguien mayor de tu familia qué le enseñaron sobre los masones y de dónde cree que viene esa idea.',
      ],
      pregunta: '¿Qué ideas sobre los masones heredé de mi familia o mi entorno, y de dónde vienen?',
      nota: 'Este curso no toma partido en la cuestión teológica: si un católico puede o no ser masón lo decide su propia fe e Iglesia. Lo que hace es explicar el origen histórico del conflicto. Ojo con dos errores opuestos: creer que la condena fue solo por prejuicio, o creer que la masonería conspiró contra la Iglesia en todas partes. La historia muestra un conflicto real, con exageraciones de ambos lados.',
      recordar: [
        ['¿Qué papa condenó primero la masonería y cuándo?', 'Clemente XII, en 1738.'],
        ['¿Qué dijo la declaración de 1983?', 'Que los católicos que se afilian a la masonería están en pecado grave.'],
        ['¿Por qué se intensificó el conflicto en el siglo XIX?', 'Porque muchas logias apoyaron el liberalismo, la educación laica y la separación entre Iglesia y Estado.'],
        ['¿Qué estudió Ferrer Benimeli?', 'Cómo la masonería en el mundo hispano fue real, exagerada por sus enemigos y usada como chivo expiatorio.'],
      ],
      tarjetas: [
        ['Iglesia y masonería', 'Condena desde 1738 (Clemente XII), reafirmada en 1983.'],
        ['Raíz política del conflicto', 'Siglo XIX: logias ligadas al liberalismo, la educación laica y la separación Iglesia-Estado.'],
        ['Chivo expiatorio', 'En el mundo hispano, la masonería fue a la vez real y exagerada por sus enemigos (Ferrer Benimeli).'],
      ],
    }),
  ],
};

const HISTORIA = {
  titulo: 'Historia, política y conspiraciones',
  objetivo: 'Conocer el papel real de los masones en la Ilustración, las independencias americanas y la historia de Colombia, y aprender a reconocer las teorías de conspiración sobre la masonería.',
  fuentes: [
    ['Carnicelli, A. (1970). La masonería en la independencia de América (2 vols.). Bogotá.', 'La participación masónica en las independencias, desde una mirada favorable.'],
    ['Loaiza Cano, G. (2011). Sociabilidad, religión y política en la definición de la nación: Colombia, 1820-1886. Universidad Externado de Colombia.', 'Las sociedades, incluidas las logias, en la Colombia del siglo XIX.'],
    ['Hofstadter, R. (1964). The paranoid style in American politics. Harper’s Magazine, noviembre de 1964.', 'El "estilo paranoico" en la política, incluido el antimasonismo.'],
    ['Douglas, K. M., Sutton, R. M. y Cichocka, A. (2017). The psychology of conspiracy theories. Current Directions in Psychological Science, 26(6), 538-542.', 'Por qué la gente cree en teorías de conspiración.'],
    ['Ferrer Benimeli, J. A. (1980). Masonería española contemporánea. Siglo XXI.', 'La masonería y el antimasonismo en el mundo hispano, incluida la persecución franquista.'],
    ['Bullock, S. C. (1996). Revolutionary Brotherhood. University of North Carolina Press.', 'La masonería en la independencia de Estados Unidos.'],
  ],
  lecciones: [
    l('Masones en las revoluciones y las independencias', 11, {
      idea: 'Muchos protagonistas de la Ilustración y de las independencias de Estados Unidos y América Latina fueron masones. Eso es cierto; lo que se exagera es que las logias hayan dirigido esas revoluciones como un plan secreto.',
      bloques: [
        ['Ilustración e independencias', [
          'En el siglo XVIII, las logias fueron espacios donde circulaban ideas ilustradas: razón, tolerancia, derechos y crítica al absolutismo.',
          'En Estados Unidos, figuras como George Washington y Benjamin Franklin fueron masones (Bullock, 1996).',
          'En América Latina, varios próceres pasaron por logias en Europa o en América. Hay documentación de la iniciación de Simón Bolívar en una logia de París en 1805, y Francisco de Paula Santander también fue masón.',
        ]],
        ['Qué dice la tradición', [
          'Que la masonería planeó y dirigió las independencias americanas.',
          'Que sociedades como la "Logia Lautaro" o la "Gran Reunión Americana" de Francisco de Miranda fueron logias masónicas que organizaron la emancipación.',
          'Que los símbolos de algunas naciones y billetes esconden mensajes masónicos.',
        ]],
        ['Qué muestra la evidencia', [
          'Autores como Américo Carnicelli (1970) destacaron mucho la presencia masónica en las independencias; historiadores posteriores advierten que a veces se confunden sociedades patrióticas secretas con logias masónicas.',
          'Si la Logia Lautaro era propiamente masónica o una sociedad política secreta que copiaba sus formas se sigue discutiendo.',
          'La independencia tuvo muchas causas (crisis de la monarquía española, ideas ilustradas, intereses de las élites criollas, guerras); los masones participaron, pero no fueron la explicación única.',
        ]],
      ],
      ejemplos: [
        'Un video asegura que "Bolívar liberó cinco países por orden de los masones". Que Bolívar fuera iniciado en una logia está documentado; que la independencia fuera una orden masónica es una simplificación que ignora todas las demás causas.',
        'En los billetes de dólar aparece un ojo sobre una pirámide, que muchos dicen que es masónico. Los historiadores señalan que ese diseño del Gran Sello de Estados Unidos no lo crearon masones y que su simbolismo es más general de la época.',
      ],
      practica: [
        'Busca qué dicen los historiadores sobre la iniciación masónica de Bolívar.',
        'Escribe tres causas de la independencia de la Nueva Granada que no tengan que ver con la masonería.',
        'Escribe la diferencia entre "muchos próceres eran masones" y "la masonería dirigió la independencia".',
      ],
      pregunta: '¿Por qué nos atrae explicar los grandes cambios históricos con un solo grupo que lo planeó todo?',
      nota: 'Hay dos errores frecuentes: negar la presencia masónica en las independencias (que fue real) o convertirla en la explicación de todo (que no lo es). Las afirmaciones sobre quién fue masón deben basarse en documentos; muchas listas que circulan en internet incluyen personajes sin pruebas.',
      recordar: [
        ['¿Qué ideas circulaban en las logias del siglo XVIII?', 'Ideas ilustradas: razón, tolerancia, derechos y crítica al absolutismo.'],
        ['¿Qué prócer colombiano fue masón además de Bolívar?', 'Francisco de Paula Santander.'],
        ['¿Qué se discute sobre la Logia Lautaro?', 'Si era propiamente masónica o una sociedad política secreta que copiaba sus formas.'],
        ['¿Fueron los masones la única causa de la independencia?', 'No: hubo muchas causas; los masones participaron, pero no fueron la explicación única.'],
      ],
      tarjetas: [
        ['Masones e independencias', 'Muchos próceres fueron masones (Bolívar, Santander), pero las logias no dirigieron todo.'],
        ['Logia Lautaro', 'Si era masónica o una sociedad patriótica secreta se sigue discutiendo.'],
        ['Documentos, no listas', 'Quién fue masón se prueba con documentos; muchas listas de internet no tienen respaldo.'],
      ],
    }),
    l('La masonería en la historia de Colombia', 10, {
      idea: 'En la Colombia del siglo XIX, las logias masónicas fueron parte de la vida política, sobre todo del liberalismo radical. Eso alimentó un fuerte conflicto con la Iglesia y con el partido conservador que todavía deja huella en la cultura.',
      bloques: [
        ['El siglo XIX', [
          'Gilberto Loaiza Cano (2011) estudia cómo en Colombia, entre 1820 y 1886, surgieron muchas formas de asociación: sociedades democráticas, católicas y logias masónicas.',
          'Varias logias reunieron a liberales que defendían la educación laica, la libertad de prensa y la separación entre Iglesia y Estado, ideas que marcaron la Constitución de Rionegro de 1863.',
          'Del otro lado, las asociaciones católicas y el partido conservador veían en la masonería una amenaza para la religión y el orden.',
        ]],
        ['Qué dice la tradición', [
          'Para los liberales radicales de la época, la masonería era una escuela de libertad y progreso.',
          'Para sus críticos conservadores y católicos, era una conspiración contra la fe y la nación.',
          'Esas dos imágenes se transmitieron en las familias y los partidos durante generaciones.',
        ]],
        ['Qué muestra la evidencia', [
          'Las logias sí fueron espacios de sociabilidad y organización política liberal, junto a muchas otras asociaciones.',
          'Pero no todos los liberales eran masones ni todas las logias actuaban como un bloque político.',
          'Con la Regeneración y la Constitución de 1886, la Iglesia recuperó un papel central y el antimasonismo se fortaleció; la masonería siguió existiendo, con menos visibilidad pública.',
        ]],
      ],
      ejemplos: [
        'En algunos cementerios de ciudades colombianas como Barranquilla o Cali hay tumbas con símbolos masónicos del siglo XIX y comienzos del XX, testimonio de su presencia en la vida de esas ciudades.',
        'Un abuelo conservador dice que "los masones acabaron con la religión", y un tío liberal responde que "trajeron la educación pública". Ambos repiten imágenes heredadas del conflicto del siglo XIX.',
      ],
      practica: [
        'Busca qué fue la Constitución de Rionegro de 1863 y qué cambió en la relación entre Iglesia y Estado.',
        'Busca si en tu ciudad hay rastros de la masonería (edificios, tumbas, logias conocidas).',
        'Escribe cómo pudo influir el conflicto entre liberales y conservadores en lo que te enseñaron sobre los masones.',
      ],
      pregunta: '¿Qué conflictos de la historia de Colombia siguen vivos en las opiniones de mi familia?',
      nota: 'La historia de la masonería en Colombia está menos estudiada que en otros países, y muchas afirmaciones circulan sin fuentes claras (por ejemplo, listas de presidentes "masones"). Conviene confiar en historiadores que trabajan con documentos y desconfiar tanto de la propaganda masónica como de la antimasónica.',
      recordar: [
        ['¿Qué estudia Loaiza Cano (2011)?', 'Las formas de asociación en Colombia entre 1820 y 1886, incluidas las logias.'],
        ['¿Qué defendían muchos liberales radicales ligados a las logias?', 'La educación laica, la libertad de prensa y la separación entre Iglesia y Estado.'],
        ['¿Qué constitución de 1863 refleja esas ideas?', 'La Constitución de Rionegro.'],
        ['¿Qué pasó con la Constitución de 1886?', 'La Iglesia recuperó un papel central y el antimasonismo se fortaleció.'],
      ],
      tarjetas: [
        ['Masonería en la Colombia del siglo XIX', 'Espacio de sociabilidad liberal radical, junto a muchas otras asociaciones (Loaiza Cano).'],
        ['Rionegro (1863) y 1886', 'De un Estado laico liberal a la Regeneración con la Iglesia en el centro.'],
        ['Imágenes heredadas', '"Escuela de libertad" o "conspiración contra la fe": dos visiones del conflicto partidista.'],
      ],
    }),
    l('Las teorías de conspiración sobre los masones', 11, {
      idea: 'Desde el siglo XVIII, los masones han sido protagonistas de teorías de conspiración: que controlan gobiernos, bancos y la historia. Algunas fueron fraudes, otras sirvieron para perseguirlos. Conocerlas ayuda a reconocer cómo funciona el pensamiento conspirativo.',
      bloques: [
        ['Historia del antimasonismo', [
          'Después de la Revolución francesa, algunos autores la explicaron como una conspiración de masones e "iluminados".',
          'En Estados Unidos, la desaparición de William Morgan en 1826, que iba a publicar los rituales masónicos, generó un movimiento y hasta un partido político antimasónico.',
          'Entre 1885 y 1897, el escritor francés Léo Taxil publicó supuestas revelaciones sobre masones que adoraban al diablo; en 1897 confesó públicamente que todo era un fraude.',
          'Regímenes como el nazi en Alemania y el franquista en España persiguieron a los masones, a menudo junto con otras minorías (Ferrer Benimeli, 1980).',
        ]],
        ['Qué dice la tradición conspirativa', [
          'Que los masones controlan en secreto gobiernos, bancos, medios y elecciones.',
          'Que buscan un "nuevo orden mundial" y destruir la religión.',
          'Que sus símbolos aparecen en todas partes como señales de su poder.',
        ]],
        ['Qué muestra la evidencia', [
          'Ha habido casos reales de abuso: en Italia, en 1981, se descubrió que la logia "Propaganda Due" (P2) reunía a políticos, militares y banqueros en una red ilegal. Fue un escándalo real, investigado y castigado, y la propia masonería italiana había expulsado a esa logia.',
          'Pero no hay evidencia de un control mundial masónico: las distintas masonerías ni siquiera se reconocen entre sí y tienen posiciones opuestas.',
          'Douglas, Sutton y Cichocka (2017) explican que creemos en conspiraciones cuando buscamos entender el mundo, sentirnos seguros o sentirnos parte de un grupo; por eso estas teorías prosperan en tiempos de crisis.',
        ]],
      ],
      ejemplos: [
        'Un video en redes encuentra "símbolos masónicos" en logos, edificios y billetes. Con tantas imágenes, triángulos, ojos y escuadras siempre aparecen en algún lado: es la misma trampa de las coincidencias del curso de Numerología.',
        'El fraude de Léo Taxil engañó a mucha gente durante años, incluidos religiosos que lo citaban. Cuando confesó, muchos siguieron creyendo sus historias. Una mentira llamativa puede sobrevivir a su propia desmentida.',
      ],
      practica: [
        'Busca la historia del fraude de Léo Taxil y cómo terminó.',
        'Busca qué fue el escándalo de la logia P2 en Italia y por qué fue un caso real y no una teoría.',
        'Ante una afirmación conspirativa, escribe: ¿qué evidencia la sostendría? ¿qué evidencia la refutaría?',
      ],
      pregunta: '¿Qué teoría de conspiración me ha parecido convincente alguna vez, y qué me hacía creerla?',
      nota: 'Hofstadter (1964) describió el "estilo paranoico" en la política: ver detrás de los acontecimientos un plan secreto de un enemigo poderoso. El antimasonismo ha sido uno de sus ejemplos más antiguos. Criticar estas teorías no significa negar que existan abusos de poder o redes ilegales (como la P2): significa exigir evidencia en cada caso, en lugar de explicar todo con un mismo enemigo oculto. Las teorías de conspiración han servido para justificar persecuciones reales contra personas.',
      recordar: [
        ['¿Qué fue el fraude de Léo Taxil?', 'Supuestas revelaciones sobre masones adoradores del diablo (1885-1897); él mismo confesó que era falso.'],
        ['¿Qué fue la logia P2?', 'Una red ilegal descubierta en Italia en 1981, un caso real investigado y castigado.'],
        ['¿Qué regímenes persiguieron a los masones?', 'El nazi en Alemania y el franquista en España, entre otros.'],
        ['¿Por qué creemos en conspiraciones según Douglas, Sutton y Cichocka?', 'Para entender el mundo, sentirnos seguros o sentirnos parte de un grupo.'],
      ],
      tarjetas: [
        ['Fraude de Taxil (1897)', 'Inventó masones satánicos y luego confesó; muchos siguieron creyendo.'],
        ['P2 (1981)', 'Un caso real de red ilegal, investigado y castigado: no prueba un control mundial.'],
        ['Pensamiento conspirativo', 'Explica todo con un enemigo oculto; ha justificado persecuciones reales. Exige evidencia en cada caso.'],
      ],
    }),
  ],
};

export default {
  id: 'masoneria',
  nombre: 'Masonería',
  area: 'esoterico',
  icono: '🧱',
  nivel: 'Básico',
  paraQue: 'Conocer, como historia de las ideas y de las instituciones, el origen, los grados, los símbolos y el papel histórico de la masonería, incluida su presencia en la Colombia del siglo XIX, separando los hechos de las leyendas y de las teorías de conspiración. Cada lección separa lo que dice la tradición de lo que muestra la evidencia.',
  modulos: [ORIGENES, QUE_HACEN, HISTORIA],
  proyecto: {
    titulo: 'Investiga un mito masónico',
    intro: 'Durante 2 a 3 semanas vas a escoger una afirmación popular sobre la masonería y a investigarla como un historiador, separando la tradición, la evidencia y la conspiración.',
    pasos: [
      'Escoge una afirmación: el origen templario, "la masonería hizo la independencia", un personaje que "era masón" o un símbolo "masónico" en billetes o edificios.',
      'Busca de dónde viene la afirmación: quién la dijo primero y cuándo.',
      'Busca qué dicen historiadores serios y qué documentos existen.',
      'Escribe la sección "Qué dice la tradición" (o la teoría popular).',
      'Escribe la sección "Qué muestra la evidencia", citando tus fuentes.',
      'Revisa si en tu investigación encontraste señales del pensamiento conspirativo (un solo enemigo, coincidencias, falta de pruebas).',
      'Concluye con lo que se puede afirmar con seguridad, lo que es dudoso y lo que es falso.',
    ],
  },
};
