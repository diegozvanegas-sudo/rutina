// Neuroplasticidad: cómo el cerebro se recablea con la práctica, a cualquier edad, y sus límites reales. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const QUE_ES = {
  titulo: 'El cerebro que cambia',
  objetivo: 'Entender qué es la neuroplasticidad a nivel de conexiones, qué muestran los estudios de cerebros adultos que cambian con la práctica y qué se sabe (y qué se discute) sobre las neuronas nuevas.',
  fuentes: [
    ['Hebb, D. O. (1949). The Organization of Behavior: A neuropsychological theory. Wiley.', 'La idea de que las conexiones se fortalecen con el uso.'],
    ['Bliss, T. V. P. y Lømo, T. (1973). Long-lasting potentiation of synaptic transmission in the dentate area of the anaesthetized rabbit following stimulation of the perforant path. Journal of Physiology, 232(2), 331-356.', 'El descubrimiento de la potenciación a largo plazo.'],
    ['Kandel, E. R. (2001). The molecular biology of memory storage: A dialogue between genes and synapses. Science, 294(5544), 1030-1038.', 'Cómo la memoria cambia las sinapsis (conferencia del Nobel).'],
    ['Maguire, E. A. et al. (2000). Navigation-related structural change in the hippocampi of taxi drivers. Proceedings of the National Academy of Sciences, 97(8), 4398-4403.', 'Los taxistas de Londres y su hipocampo.'],
    ['Draganski, B. et al. (2004). Neuroplasticity: Changes in grey matter induced by training. Nature, 427(6972), 311-312.', 'Aprender malabares cambió la materia gris en adultos.'],
    ['Eriksson, P. S. et al. (1998). Neurogenesis in the adult human hippocampus. Nature Medicine, 4(11), 1313-1317.', 'Primera evidencia de neuronas nuevas en el hipocampo adulto humano.'],
    ['Sorrells, S. F. et al. (2018). Human hippocampal neurogenesis drops sharply in children to undetectable levels in adults. Nature, 555(7696), 377-381.', 'Un estudio que no encontró neuronas nuevas en adultos.'],
    ['Moreno-Jiménez, E. P. et al. (2019). Adult hippocampal neurogenesis is abundant in neurologically healthy subjects and drops sharply in patients with Alzheimer’s disease. Nature Medicine, 25(4), 554-560.', 'Otro estudio que sí las encontró: el debate sigue abierto.'],
  ],
  lecciones: [
    l('Qué es la neuroplasticidad', 10, {
      idea: 'Neuroplasticidad es la capacidad del sistema nervioso de cambiar su estructura y su funcionamiento con la experiencia. Cada vez que aprendes algo, cambian las conexiones entre tus neuronas.',
      bloques: [
        ['Neuronas y conexiones', [
          'El cerebro tiene miles de millones de neuronas que se comunican en puntos de contacto llamados sinapsis.',
          'Aprender no es "llenar" el cerebro: es cambiar cuáles conexiones se fortalecen, se debilitan, se crean o se eliminan.',
          'Donald Hebb (1949) propuso una idea que se resume así: las neuronas que se activan juntas, se conectan más fuerte.',
        ]],
        ['La prueba en el laboratorio', [
          'Bliss y Lømo (1973) estimularon repetidamente una vía nerviosa en conejos y vieron que la conexión quedaba reforzada por horas: la potenciación a largo plazo.',
          'Eric Kandel, premio Nobel en 2000, mostró en un caracol marino cómo la memoria de corto plazo cambia la fuerza de las sinapsis y la de largo plazo requiere fabricar proteínas y hasta crear sinapsis nuevas (Kandel, 2001).',
          'Esos mecanismos básicos se conservan en los mamíferos, incluidos nosotros.',
        ]],
        ['Plasticidad para bien y para mal', [
          'La plasticidad no distingue entre lo que te conviene y lo que no: el cerebro también "aprende" hábitos dañinos, el dolor crónico o el miedo.',
          'Por eso la repetición importa tanto: lo que practicas se fortalece, sea un buen hábito o uno malo.',
          'Y por eso cambiar cuesta: hay que practicar lo nuevo lo suficiente para que le gane a lo viejo.',
        ]],
      ],
      ejemplos: [
        'La primera vez que manejaste moto tenías que pensar en el clutch, el freno y los espejos. Después de meses, lo haces mientras conversas. Las conexiones que usaste tantas veces se volvieron fuertes y automáticas.',
        'Alguien que lleva años reaccionando con rabia ante cualquier crítica tiene esa respuesta "entrenada". Cambiarla es posible, pero requiere practicar otra respuesta muchas veces, no solo entender que debería cambiar.',
      ],
      practica: [
        'Escribe una habilidad que hoy haces en automático y que al principio te costaba mucho.',
        'Escoge algo nuevo que quieras aprender y define cuántas veces por semana lo vas a practicar.',
        'Identifica un hábito que no te conviene y piensa qué conducta nueva vas a "entrenar" en su lugar.',
      ],
      pregunta: '¿Qué estoy entrenando en mi cerebro sin darme cuenta, con lo que repito todos los días?',
      nota: 'La frase "las neuronas que se activan juntas se conectan" es un resumen popular de Hebb, no una cita textual suya, y simplifica mecanismos mucho más complejos. También se dice que "el cerebro es como un músculo": es una metáfora útil para la práctica, pero el cerebro no crece como un bíceps; cambia sobre todo en conexiones, no en tamaño.',
      recordar: [
        ['¿Qué es la neuroplasticidad?', 'La capacidad del sistema nervioso de cambiar su estructura y funcionamiento con la experiencia.'],
        ['¿Qué propuso Hebb?', 'Que las conexiones entre neuronas que se activan juntas se fortalecen.'],
        ['¿Qué es la potenciación a largo plazo?', 'El reforzamiento duradero de una conexión después de estimularla repetidamente (Bliss y Lømo, 1973).'],
        ['¿Por qué la plasticidad puede jugar en contra?', 'Porque también fortalece hábitos dañinos, el miedo o el dolor crónico.'],
      ],
      tarjetas: [
        ['Neuroplasticidad', 'El cerebro cambia sus conexiones con la experiencia: aprender es fortalecer, debilitar, crear o eliminar sinapsis.'],
        ['Idea de Hebb', 'Las neuronas que se activan juntas tienden a conectarse más fuerte.'],
        ['Lo que repites se fortalece', 'La plasticidad no distingue entre bueno y malo: entrenas lo que repites.'],
      ],
    }),
    l('El cerebro adulto también cambia', 10, {
      idea: 'Durante mucho tiempo se creyó que el cerebro adulto era fijo. Hoy se sabe que cambia con lo que haces, aunque más despacio que en la infancia: los taxistas, los malabaristas y los músicos lo muestran.',
      bloques: [
        ['Los taxistas de Londres', [
          'Para trabajar como taxista en Londres hay que memorizar miles de calles; el examen se conoce como "el conocimiento".',
          'Eleanor Maguire y su equipo (2000) encontraron que los taxistas tenían más grande la parte posterior del hipocampo, una zona clave para la navegación, y que esa diferencia era mayor en quienes llevaban más años manejando.',
          'Estudios posteriores del mismo grupo siguieron a aprendices y vieron cambios en quienes aprobaron el examen.',
        ]],
        ['Los malabaristas', [
          'Draganski y otros (2004) pidieron a adultos aprender a hacer malabares con tres pelotas durante tres meses.',
          'Al final, tenían más materia gris en zonas del cerebro que procesan el movimiento visual.',
          'Tres meses después de dejar de practicar, esa diferencia había disminuido: lo que no se usa, se pierde en parte.',
        ]],
        ['Lo que esto significa para ti', [
          'Puedes aprender cosas nuevas a cualquier edad: un idioma, un instrumento, una técnica en el gym.',
          'El cerebro cambia de forma específica: aprender malabares no te hace mejor en matemáticas. Mejoras en lo que practicas.',
          'Mantener una habilidad requiere seguir usándola.',
        ]],
      ],
      ejemplos: [
        'A los 40 años empiezas a aprender inglés. Te cuesta más que a un niño, pero con práctica constante tu cerebro cambia y cada mes entiendes más. No es "tarde"; es más lento.',
        'Dejaste de jugar fútbol dos años y al volver sientes que perdiste toque. Las conexiones que no se usaron se debilitaron, pero se recuperan más rápido que la primera vez.',
      ],
      practica: [
        'Escoge una habilidad que creías "ya tarde" para aprender y busca la forma más pequeña de empezar esta semana.',
        'Escribe una habilidad que tenías y dejaste de practicar, y planea una sesión corta para retomarla.',
        'Agenda la práctica en la app (🎯 Metas o 🎓 Estudiar) para que sea constante.',
      ],
      pregunta: '¿Qué habilidad he dado por perdida diciendo "ya estoy muy viejo para eso"?',
      nota: 'Los estudios de imágenes cerebrales suelen tener pocos participantes y muestran cambios promedio pequeños; además, "más materia gris" no siempre significa "mejor". En el estudio de los taxistas también tenían más pequeña otra parte del hipocampo. Lo sólido es que el cerebro adulto cambia con la práctica; lo dudoso son los titulares tipo "aprender X te agranda el cerebro y te hace más inteligente".',
      recordar: [
        ['¿Qué encontró Maguire en los taxistas de Londres?', 'Más volumen en la parte posterior del hipocampo, mayor en quienes llevaban más años.'],
        ['¿Qué pasó con los malabaristas de Draganski?', 'Ganaron materia gris en zonas del movimiento visual, y la diferencia disminuyó al dejar de practicar.'],
        ['¿El cerebro adulto cambia igual que el de un niño?', 'Cambia, pero más despacio.'],
        ['¿Aprender una habilidad mejora todo el cerebro?', 'No: el cambio es específico de lo que practicas.'],
      ],
      tarjetas: [
        ['Taxistas de Londres (Maguire, 2000)', 'Memorizar la ciudad se asoció con más volumen en parte del hipocampo. El cerebro adulto cambia.'],
        ['Malabares (Draganski, 2004)', 'Tres meses de práctica cambiaron la materia gris; al dejar, el cambio disminuyó.'],
        ['Plasticidad específica', 'Mejoras en lo que practicas, no en todo. Y lo que no usas, se debilita.'],
      ],
    }),
    l('¿Nacen neuronas nuevas en los adultos?', 10, {
      idea: 'La mayor parte de la plasticidad adulta viene de cambiar conexiones, no de fabricar neuronas nuevas. Si los adultos producimos neuronas nuevas en el hipocampo sigue siendo un debate científico abierto.',
      bloques: [
        ['La historia', [
          'Durante buena parte del siglo XX se aceptó que el cerebro adulto no producía neuronas nuevas.',
          'Eriksson y otros (1998) usaron un marcador en pacientes con cáncer y encontraron neuronas nacidas en la adultez en el hipocampo.',
          'En animales como ratas y ratones, la neurogénesis adulta está bien documentada y aumenta con el ejercicio y los ambientes ricos.',
        ]],
        ['El debate actual', [
          'Sorrells y otros (2018) analizaron cerebros humanos y no encontraron neuronas nuevas detectables en adultos: concluyeron que la producción cae mucho en la infancia.',
          'Al año siguiente, Moreno-Jiménez y otros (2019), con otra forma de preservar el tejido, encontraron miles de neuronas jóvenes en adultos sanos, y muchas menos en personas con Alzheimer.',
          'La diferencia parece depender en parte de cómo se procesan las muestras. Todavía no hay consenso.',
        ]],
        ['Qué importa en la práctica', [
          'Aunque se resuelva el debate, el aprendizaje adulto depende sobre todo de cambios en las conexiones entre neuronas que ya existen.',
          'Las recomendaciones prácticas (moverse, dormir, aprender cosas nuevas, tener vida social) son buenas para el cerebro por varias vías, no solo por neuronas nuevas.',
          'Desconfía de productos que prometen "generar neuronas nuevas".',
        ]],
      ],
      ejemplos: [
        'Ves un suplemento que promete "crear nuevas neuronas y mejorar tu memoria". Ni siquiera hay consenso sobre cuántas neuronas nuevas produce un adulto, y mucho menos evidencia de que una pastilla las aumente en humanos.',
        'Tu abuela empieza a tejer patrones nuevos y a aprender a usar el celular a los 75 años. Sea cual sea el debate sobre neuronas nuevas, su cerebro está creando conexiones nuevas con cada cosa que aprende.',
      ],
      practica: [
        'Busca un producto o publicidad que prometa "nuevas neuronas" o "rejuvenecer el cerebro" y analiza qué evidencia ofrece.',
        'Escribe tres cosas que haces (o podrías hacer) que son buenas para el cerebro por varias vías: movimiento, sueño, aprendizaje, vida social.',
        'Aprende hoy algo pequeño y nuevo (una palabra en otro idioma, un movimiento nuevo en el gym).',
      ],
      pregunta: '¿Qué promesas sobre "mejorar el cerebro" he creído sin revisar la evidencia?',
      nota: 'Este es un buen ejemplo de ciencia en construcción: dos estudios en la misma revista llegaron a conclusiones opuestas con un año de diferencia. Cuando leas un titular tipo "los científicos descubren que…", recuerda que un solo estudio rara vez cierra una pregunta. Lo que está claro es que el cerebro adulto es plástico; lo que se discute es cuánto de esa plasticidad viene de neuronas nuevas.',
      recordar: [
        ['¿De dónde viene la mayor parte de la plasticidad adulta?', 'De cambiar las conexiones entre neuronas que ya existen.'],
        ['¿Qué encontró Eriksson en 1998?', 'Neuronas nacidas en la adultez en el hipocampo humano.'],
        ['¿Qué concluyeron Sorrells y otros (2018)?', 'Que no había neuronas nuevas detectables en adultos.'],
        ['¿Qué encontraron Moreno-Jiménez y otros (2019)?', 'Miles de neuronas jóvenes en adultos sanos y muchas menos en personas con Alzheimer.'],
      ],
      tarjetas: [
        ['Neurogénesis adulta', 'En humanos sigue en debate: estudios de 2018 y 2019 llegaron a conclusiones opuestas.'],
        ['Plasticidad = conexiones', 'Aprender de adulto depende sobre todo de cambiar conexiones, no de neuronas nuevas.'],
        ['Desconfía de "nuevas neuronas"', 'No hay evidencia de que una pastilla o suplemento las aumente en humanos.'],
      ],
    }),
  ],
};

const IMPULSA = {
  titulo: 'Qué impulsa el cambio',
  objetivo: 'Saber qué tipo de práctica produce cambios reales, cómo el ejercicio y el sueño apoyan la plasticidad y por qué ninguna de estas cosas funciona por arte de magia.',
  fuentes: [
    ['Ericsson, K. A., Krampe, R. T. y Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363-406.', 'La práctica deliberada en violinistas y otros expertos.'],
    ['Macnamara, B. N., Hambrick, D. Z. y Oswald, F. L. (2014). Deliberate practice and performance in music, games, sports, education, and professions: A meta-analysis. Psychological Science, 25(8), 1608-1618.', 'La práctica importa, pero explica menos de lo que se creía.'],
    ['Erickson, K. I. et al. (2011). Exercise training increases size of hippocampus and improves memory. Proceedings of the National Academy of Sciences, 108(7), 3017-3022.', 'Un año de caminar aumentó el hipocampo en adultos mayores.'],
    ['Cotman, C. W. y Berchtold, N. C. (2002). Exercise: A behavioral intervention to enhance brain health and plasticity. Trends in Neurosciences, 25(6), 295-301.', 'Cómo el ejercicio favorece la plasticidad (BDNF y otras vías).'],
    ['Walker, M. P. y Stickgold, R. (2004). Sleep-dependent learning and memory consolidation. Neuron, 44(1), 121-133.', 'El sueño consolida lo aprendido.'],
    ['Tononi, G. y Cirelli, C. (2014). Sleep and the price of plasticity: From synaptic and cellular homeostasis to memory consolidation and integration. Neuron, 81(1), 12-34.', 'El sueño "reajusta" las conexiones del día.'],
    ['Xie, L. et al. (2013). Sleep drives metabolite clearance from the adult brain. Science, 342(6156), 373-377.', 'Durante el sueño se limpian desechos del cerebro (en ratones).'],
  ],
  lecciones: [
    l('La práctica que cambia el cerebro', 11, {
      idea: 'No toda práctica cambia igual. La que más mejora es la práctica deliberada: enfocada en tus puntos débiles, con retroalimentación y un poco más allá de lo cómodo. Pero la práctica no lo explica todo.',
      bloques: [
        ['Práctica deliberada', [
          'Anders Ericsson y su equipo (1993) estudiaron violinistas de una academia en Berlín: los mejores habían acumulado muchas más horas de práctica solitaria y enfocada.',
          'La llamaron práctica deliberada: con un objetivo concreto, en lo que todavía no dominas, con retroalimentación inmediata y con concentración total.',
          'Repetir lo que ya sabes hacer bien se siente bien, pero cambia poco.',
        ]],
        ['La práctica no lo explica todo', [
          'Macnamara, Hambrick y Oswald (2014) juntaron muchos estudios y encontraron que la práctica deliberada explicaba una parte del desempeño: importante en juegos y música, menor en deportes, educación y profesiones.',
          'El resto depende de otros factores: la edad de inicio, la genética, la calidad del entrenador, las oportunidades.',
          'Conclusión práctica: practicar bien siempre te hace mejor que tú mismo; no garantiza ser el mejor del mundo.',
        ]],
        ['Cómo practicar mejor', [
          'Divide la habilidad en partes y trabaja la más débil.',
          'Busca retroalimentación: un entrenador, un video de ti mismo, un registro de resultados.',
          'Trabaja en la zona de esfuerzo: si todo sale perfecto, está muy fácil; si nada sale, está muy difícil.',
          'Sesiones cortas y frecuentes, con descanso, suelen rendir más que maratones esporádicas (lo viste en Aprender a aprender).',
        ]],
      ],
      ejemplos: [
        'En el gym llevas meses haciendo la misma rutina con el mismo peso. Se siente bien, pero no avanzas. La práctica deliberada sería trabajar tu punto débil (por ejemplo, la técnica de la sentadilla), grabarte y subir el reto poco a poco, como hace la sección 🏋️ Gym cuando te sugiere subir peso.',
        'Llevas años jugando fútbol con la derecha. Si dedicas 15 minutos de cada entrenamiento a pases con la izquierda, con un compañero que te corrija, vas a mejorar mucho más que jugando partidos sin más.',
      ],
      practica: [
        'Escoge una habilidad y escribe cuál es su parte más débil.',
        'Diseña una sesión de 15 minutos enfocada solo en esa parte, con alguna forma de retroalimentación.',
        'Grábate o registra tu resultado para comparar en dos semanas.',
      ],
      pregunta: '¿En qué estoy repitiendo lo que ya sé hacer en lugar de trabajar lo que me cuesta?',
      nota: 'La famosa "regla de las 10.000 horas" la popularizó Malcolm Gladwell a partir del estudio de Ericsson, pero el propio Ericsson dijo que era una simplificación: no hay un número mágico, el promedio de horas variaba mucho y lo que importa es el tipo de práctica, no solo la cantidad. Tampoco garantiza la excelencia: los metaanálisis muestran que la práctica explica solo una parte de las diferencias entre personas.',
      recordar: [
        ['¿Qué es la práctica deliberada?', 'Práctica con objetivo concreto, en lo que no dominas, con retroalimentación y concentración total.'],
        ['¿Qué encontraron Macnamara y otros sobre la práctica?', 'Que explica una parte del desempeño, más en juegos y música y menos en deportes, educación y profesiones.'],
        ['¿Qué pasa con la "regla de las 10.000 horas"?', 'Es una simplificación de Gladwell; no hay un número mágico y lo que importa es el tipo de práctica.'],
        ['¿Cómo saber si una práctica está en la zona correcta?', 'Si todo sale perfecto, está muy fácil; si nada sale, muy difícil. Debe costar un poco.'],
      ],
      tarjetas: [
        ['Práctica deliberada (Ericsson)', 'Objetivo concreto, en tu punto débil, con retroalimentación y un poco más allá de lo cómodo.'],
        ['El mito de las 10.000 horas', 'No hay número mágico; importa el tipo de práctica. Y la práctica explica solo una parte del desempeño.'],
        ['Repetir lo fácil', 'Se siente bien pero cambia poco. Lo que cambia es trabajar lo que te cuesta.'],
      ],
    }),
    l('El ejercicio y el cerebro', 10, {
      idea: 'Moverse no solo cambia el cuerpo: también favorece la plasticidad del cerebro. El ejercicio aeróbico regular se ha asociado con mejor memoria y con un hipocampo que se conserva mejor con la edad.',
      bloques: [
        ['El estudio de la caminata', [
          'Erickson y otros (2011) pusieron a adultos mayores a caminar 40 minutos, tres veces por semana, durante un año. Otro grupo hizo estiramientos.',
          'El grupo que caminó aumentó un poco el tamaño del hipocampo, mientras que en el grupo de estiramientos se redujo, como es normal con la edad.',
          'El aumento se relacionó con mejoras en una prueba de memoria espacial.',
        ]],
        ['Por qué ayuda', [
          'Cotman y Berchtold (2002) describen varias vías: el ejercicio aumenta el flujo de sangre al cerebro y la producción de BDNF, una proteína que ayuda a las neuronas a crecer y conectarse.',
          'En animales, el ejercicio aumenta la producción de neuronas nuevas en el hipocampo.',
          'También mejora el sueño y el ánimo, que a su vez favorecen el aprendizaje.',
        ]],
        ['Cómo usarlo', [
          'El tipo con más evidencia es el aeróbico regular (caminar rápido, trotar, bicicleta, fútbol), aunque la fuerza también tiene beneficios.',
          'La constancia importa más que la intensidad extrema: varias sesiones por semana durante meses.',
          'Un poco de movimiento antes de estudiar puede ayudarte a estar más despierto y concentrado.',
        ]],
      ],
      ejemplos: [
        'Tu papá de 68 años empieza a olvidar cosas y se la pasa sentado. Proponerle una caminata de 30 minutos tres veces por semana, acompañado, es una de las cosas con más evidencia para su cerebro (y su corazón). Si los olvidos son frecuentes, también vale la pena una consulta médica.',
        'Antes de sentarte a estudiar la lección del día, das una vuelta de 10 minutos a la manzana. Llegas más despierto que si vienes directo de estar acostado viendo el celular.',
      ],
      practica: [
        'Revisa en la app cuántos días te moviste esta semana y planea al menos tres sesiones aeróbicas para la próxima.',
        'Prueba hoy caminar 10 minutos antes de estudiar o de una tarea que exija concentración.',
        'Invita a alguien mayor de tu familia a caminar contigo una vez esta semana.',
      ],
      pregunta: '¿Cómo cambia mi concentración y mi ánimo los días que me muevo frente a los que no?',
      nota: 'Los efectos del ejercicio en la memoria y la cognición son reales pero modestos en promedio, y varían mucho entre estudios y personas. El estudio de Erickson fue con adultos mayores y un cambio de pocos puntos porcentuales en volumen. No esperes que el ejercicio te convierta en genio, pero sí es de lo mejor documentado para cuidar el cerebro con la edad. Si notas pérdida de memoria que afecta tu día a día (o la de alguien cercano), consulta a un médico.',
      recordar: [
        ['¿Qué encontraron Erickson y otros (2011)?', 'Que un año de caminata aumentó un poco el hipocampo en adultos mayores y mejoró una prueba de memoria.'],
        ['¿Qué es el BDNF?', 'Una proteína que ayuda a las neuronas a crecer y conectarse, y que aumenta con el ejercicio.'],
        ['¿Qué tipo de ejercicio tiene más evidencia para el cerebro?', 'El aeróbico regular, aunque la fuerza también ayuda.'],
        ['¿Qué tan grandes son los efectos del ejercicio en la cognición?', 'Reales pero modestos en promedio, y variables.'],
      ],
      tarjetas: [
        ['Caminar y el hipocampo (Erickson, 2011)', 'Un año caminando 3 veces por semana aumentó un poco el hipocampo en adultos mayores.'],
        ['Por qué el ejercicio ayuda', 'Más flujo de sangre al cerebro, más BDNF, mejor sueño y mejor ánimo.'],
        ['Constancia > intensidad', 'Varias sesiones aeróbicas por semana durante meses; los efectos son reales pero modestos.'],
      ],
    }),
    l('El sueño: donde se fija lo aprendido', 10, {
      idea: 'Lo que practicas de día se consolida de noche. Dormir bien es parte del aprendizaje, no un descanso de él: sin sueño, la plasticidad trabaja a medias.',
      bloques: [
        ['Consolidación', [
          'Walker y Stickgold (2004) revisaron estudios en los que la gente mejoraba en habilidades motoras y de memoria después de dormir, sin practicar más.',
          'Durante el sueño, el cerebro "repasa" lo vivido y lo integra con lo que ya sabía.',
          'Dormir después de aprender ayuda más que pasar el mismo tiempo despierto.',
        ]],
        ['El reajuste de las conexiones', [
          'Tononi y Cirelli (2014) proponen que, durante el día, el aprendizaje fortalece muchas conexiones, y el sueño las "recalibra" para que el cerebro no se sature.',
          'Es una hipótesis con apoyo en animales, todavía en estudio en humanos.',
          'En ratones, Xie y otros (2013) vieron que durante el sueño aumenta la limpieza de desechos del cerebro.',
        ]],
        ['En la práctica', [
          'Duerme suficiente las noches después de aprender algo importante (antes de un examen, después de practicar una técnica nueva).',
          'Trasnochar para estudiar suele salir peor que estudiar menos y dormir.',
          'Horarios regulares ayudan más que dormir mucho un día y poco otro.',
        ]],
      ],
      ejemplos: [
        'Practicaste una técnica nueva de remate en el entrenamiento del miércoles y no te salía. El viernes, después de dos noches de buen sueño, te sale mejor sin haber practicado más. Tu cerebro siguió trabajando mientras dormías.',
        'La noche antes del examen de certificación te quedas hasta las 3 a. m. repasando. Al otro día olvidas cosas que sabías. Dormir 7 u 8 horas después de repasar habría fijado mejor lo estudiado.',
      ],
      practica: [
        'Esta semana, haz tu lección de estudio o tu práctica más difícil en la tarde o noche, y duerme bien después.',
        'Revisa a qué hora te acuestas y te levantas, y escoge un horario regular para los próximos siete días.',
        'Anota en el diario si al día siguiente de dormir bien notas que algo que practicaste te sale mejor.',
      ],
      pregunta: '¿Estoy sacrificando sueño justo en los días en que más necesito aprender?',
      nota: 'Se dice que "puedes aprender idiomas escuchando grabaciones mientras duermes". La evidencia es muy débil: en el mejor de los casos, se han visto efectos pequeños para reforzar algo ya aprendido de día, no para aprender cosas nuevas. El estudio de la "limpieza" del cerebro durante el sueño fue en ratones y su aplicación a humanos sigue en investigación. Lo sólido: dormir bien después de aprender ayuda a consolidar. Si tienes problemas de sueño persistentes (insomnio, ronquidos fuertes con pausas), consulta a un médico.',
      recordar: [
        ['¿Qué es la consolidación durante el sueño?', 'El proceso por el que el cerebro fija e integra lo aprendido mientras dormimos.'],
        ['¿Qué proponen Tononi y Cirelli?', 'Que el sueño recalibra las conexiones fortalecidas durante el día para que el cerebro no se sature.'],
        ['¿Qué se vio en ratones sobre el sueño y los desechos?', 'Que durante el sueño aumenta la limpieza de desechos del cerebro (Xie y otros, 2013).'],
        ['¿Sirve aprender idiomas dormido?', 'No para aprender cosas nuevas; como mucho, efectos pequeños para reforzar lo aprendido de día.'],
      ],
      tarjetas: [
        ['Dormir consolida (Walker y Stickgold)', 'Mejoras en lo practicado después de dormir, sin practicar más.'],
        ['Trasnochar para estudiar', 'Suele salir peor que estudiar menos y dormir bien.'],
        ['Aprender dormido', 'No funciona para aprender cosas nuevas. El sueño fija lo que practicaste despierto.'],
      ],
    }),
  ],
};

const LIMITES = {
  titulo: 'Límites reales y mitos',
  objetivo: 'Entender qué cambia con la edad, cómo la plasticidad ayuda a recuperarse de lesiones y separar lo que dice la ciencia de lo que prometen los productos de "entrenamiento cerebral".',
  fuentes: [
    ['Wiesel, T. N. y Hubel, D. H. (1963). Single-cell responses in striate cortex of kittens deprived of vision in one eye. Journal of Neurophysiology, 26(6), 1003-1017.', 'Los periodos críticos de la visión.'],
    ['Hartshorne, J. K., Tenenbaum, J. B. y Pinker, S. (2018). A critical period for second language acquisition: Evidence from 2/3 million English speakers. Cognition, 177, 263-277.', 'Hasta qué edad se aprende la gramática de otro idioma como un nativo.'],
    ['Wolf, S. L. et al. (2006). Effect of constraint-induced movement therapy on upper extremity function 3 to 9 months after stroke: The EXCITE randomized clinical trial. JAMA, 296(17), 2095-2104.', 'Una terapia que aprovecha la plasticidad después de un derrame.'],
    ['Ramachandran, V. S. y Rogers-Ramachandran, D. (1996). Synaesthesia in phantom limbs induced with mirrors. Proceedings of the Royal Society B, 263(1369), 377-386.', 'La caja de espejos y el miembro fantasma.'],
    ['Owen, A. M. et al. (2010). Putting brain training to the test. Nature, 465(7299), 775-778.', 'Miles de personas entrenaron con juegos: mejoraron en los juegos, no en lo demás.'],
    ['Simons, D. J. et al. (2016). Do "brain-training" programs work? Psychological Science in the Public Interest, 17(3), 103-186.', 'Revisión completa de la evidencia sobre el entrenamiento cerebral.'],
    ['Nielsen, J. A., Zielinski, B. A., Ferguson, M. A., Lainhart, J. E. y Anderson, J. S. (2013). An evaluation of the left-brain vs. right-brain hypothesis with resting state functional connectivity magnetic resonance imaging. PLoS ONE, 8(8), e71275.', 'No hay personas "de hemisferio izquierdo" o "derecho".'],
    ['Chabris, C. F. (1999). Prelude or requiem for the "Mozart effect"? Nature, 400(6747), 826-827.', 'El efecto Mozart era pequeño y pasajero.'],
  ],
  lecciones: [
    l('Periodos sensibles y la edad', 10, {
      idea: 'Hay ventanas en la infancia en las que ciertas capacidades se desarrollan con mucha facilidad. Fuera de ellas se sigue aprendiendo, pero cuesta más y el resultado puede ser distinto.',
      bloques: [
        ['Los periodos críticos', [
          'Torsten Wiesel y David Hubel (1963) taparon un ojo a gatitos durante semanas en una etapa temprana: ese ojo quedó con la visión muy afectada aunque luego lo destaparan.',
          'En gatos adultos, tapar el ojo no tenía el mismo efecto. Había una ventana del desarrollo en la que la experiencia era indispensable.',
          'Por esto se tratan pronto en los niños el ojo perezoso (ambliopía) y las cataratas congénitas.',
        ]],
        ['El idioma', [
          'Hartshorne, Tenenbaum y Pinker (2018) analizaron pruebas de gramática de inglés de unas 670.000 personas.',
          'Concluyeron que la capacidad de aprender la gramática como un nativo se mantiene alta hasta el final de la adolescencia y luego baja.',
          'Pero los adultos aprenden idiomas, a veces más rápido al principio que los niños: lo que cuesta más es llegar a sonar exactamente como nativo.',
        ]],
        ['Qué cambia con la edad', [
          'Con los años, la plasticidad no desaparece, pero baja: aprender cuesta más repeticiones.',
          'A cambio, el adulto tiene más conocimiento previo para conectar lo nuevo.',
          'Mantener el cerebro activo (aprender, moverse, socializar) se asocia con un mejor envejecimiento cognitivo.',
        ]],
      ],
      ejemplos: [
        'Tu sobrino de 4 años tiene un ojo desviado. Es importante llevarlo pronto al oftalmólogo: en la infancia el tratamiento funciona mucho mejor que si se espera a la adultez.',
        'Empiezas a aprender portugués a los 35. Puedes llegar a hablarlo y entenderlo muy bien; quizás te quede un acento. Eso no es fracaso: es lo esperable, y no impide comunicarte.',
      ],
      practica: [
        'Si tienes hijos o sobrinos pequeños, revisa que tengan al día sus controles de vista y oído.',
        'Escribe un aprendizaje que dejaste por creer que "ya pasó la edad" y una meta realista para retomarlo.',
        'Busca una forma de aprender algo con otra persona (clase, grupo, intercambio): suma aprendizaje y vida social.',
      ],
      pregunta: '¿Qué meta de aprendizaje he descartado por la edad, cuando lo que cambia es la meta realista, no la posibilidad?',
      nota: 'Se dice que "después de los 3 años (o de los 7) ya no se puede aprender X". Los periodos críticos estrictos aplican a funciones muy básicas (como la visión), no a la mayoría de lo que aprendemos. Para el idioma hablamos de periodos sensibles: la facilidad baja, pero no hay una puerta que se cierra. El estudio del inglés es muy grande, pero basado en una prueba en línea; su estimación de la edad exacta se discute.',
      recordar: [
        ['¿Qué mostraron Wiesel y Hubel con los gatitos?', 'Que tapar un ojo en una etapa temprana afectaba su visión de forma duradera, pero no en gatos adultos.'],
        ['¿Hasta cuándo se aprende la gramática como un nativo según Hartshorne y otros?', 'La capacidad se mantiene alta hasta el final de la adolescencia y luego baja.'],
        ['¿Pueden los adultos aprender idiomas?', 'Sí, a veces más rápido al principio; lo que cuesta más es sonar exactamente como nativo.'],
        ['¿Qué diferencia hay entre periodo crítico y periodo sensible?', 'El crítico es una ventana casi obligatoria (visión); el sensible es una etapa de mayor facilidad (idioma).'],
      ],
      tarjetas: [
        ['Periodos críticos (Wiesel y Hubel)', 'En funciones básicas como la visión, la experiencia temprana es indispensable. Por eso el ojo perezoso se trata pronto.'],
        ['Idiomas en adultos', 'Se aprenden; cuesta más sonar nativo. La facilidad baja, no se cierra la puerta.'],
        ['Plasticidad y edad', 'Baja con los años, pero no desaparece: el adulto necesita más repeticiones y tiene más conocimiento previo.'],
      ],
    }),
    l('Recuperarse de una lesión', 10, {
      idea: 'Después de un derrame o una lesión, otras partes del cerebro pueden asumir funciones perdidas. La rehabilitación intensa y temprana aprovecha esa plasticidad, aunque la recuperación tiene límites.',
      bloques: [
        ['La rehabilitación aprovecha la plasticidad', [
          'Después de un accidente cerebrovascular, zonas cercanas o del otro hemisferio pueden reorganizarse para recuperar parte del movimiento o del lenguaje.',
          'Esa reorganización depende de la práctica: lo que el paciente usa, mejora.',
          'La terapia de movimiento inducido por restricción obliga a usar el brazo afectado inmovilizando el sano. El ensayo EXCITE (Wolf y otros, 2006) mostró mejoras en la función del brazo frente a la atención habitual.',
        ]],
        ['El miembro fantasma', [
          'Muchas personas que pierden un brazo o una pierna siguen sintiéndolo, y a veces les duele: es el miembro fantasma.',
          'Ramachandran y Rogers-Ramachandran (1996) usaron una caja con un espejo para que el paciente "viera" moverse el miembro perdido; en algunos casos el dolor disminuyó.',
          'Muestra que el mapa del cuerpo en el cerebro se puede reorganizar, para bien y para mal.',
        ]],
        ['Los límites', [
          'La recuperación suele ser mayor en los primeros meses y depende del tamaño y el lugar de la lesión.',
          'No todo se recupera, y la motivación sola no basta: hacen falta terapia profesional y mucha repetición.',
          'Ante señales de un derrame (cara caída, brazo débil, habla rara), cada minuto cuenta: llama al 123 o ve a urgencias de inmediato.',
        ]],
      ],
      ejemplos: [
        'A tu tío le dio un derrame y quedó con el brazo derecho débil. Con fisioterapia frecuente y ejercicios en casa que lo obligan a usar ese brazo (abotonarse, comer), recupera buena parte del movimiento en los meses siguientes.',
        'Un soldado que perdió una pierna por una mina siente dolor en el pie que ya no tiene. Con terapia de espejo y acompañamiento profesional, el dolor se reduce en algunas sesiones.',
      ],
      practica: [
        'Aprende las señales de alarma de un derrame (cara caída, brazo débil, habla rara) y compártelas con tu familia.',
        'Si alguien cercano está en rehabilitación, pregunta qué ejercicios puede practicar en casa y ofrécete a acompañarlo.',
        'Escribe un ejemplo de algo que recuperaste (una habilidad, una lesión deportiva) a fuerza de práctica constante.',
      ],
      pregunta: '¿Cómo puedo apoyar la recuperación de alguien cercano con constancia y paciencia?',
      nota: 'Se repiten historias de personas que "recuperaron todo" con fuerza de voluntad. Algunas recuperaciones son notables, pero dependen de la lesión, la edad, la terapia y el tiempo, y no todas las personas se recuperan igual aunque se esfuercen igual. La terapia de espejo tiene resultados variables según los estudios. Este curso no reemplaza la atención médica: la rehabilitación debe guiarla un profesional.',
      recordar: [
        ['¿Qué es la terapia de movimiento inducido por restricción?', 'Inmovilizar el brazo sano para obligar a usar el afectado después de un derrame.'],
        ['¿Qué mostró el ensayo EXCITE?', 'Mejoras en la función del brazo frente a la atención habitual.'],
        ['¿Qué es el miembro fantasma?', 'Seguir sintiendo, y a veces doliendo, un miembro amputado.'],
        ['¿Cuáles son las señales de un derrame?', 'Cara caída, brazo débil y habla rara: llamar al 123 de inmediato.'],
      ],
      tarjetas: [
        ['Rehabilitación y plasticidad', 'Después de una lesión, lo que se practica mejora. La recuperación es mayor en los primeros meses.'],
        ['Caja de espejos (Ramachandran)', 'Ver moverse el reflejo del miembro sano redujo el dolor fantasma en algunos casos.'],
        ['Señales de derrame', 'Cara caída, brazo débil, habla rara: cada minuto cuenta, llama al 123.'],
      ],
    }),
    l('Mitos del cerebro y "entrenamiento cerebral"', 11, {
      idea: 'La neuroplasticidad se ha vuelto una palabra de mercadeo. Los juegos de "entrenamiento cerebral" te hacen mejor en esos juegos, no más inteligente; y varias ideas populares sobre el cerebro son falsas.',
      bloques: [
        ['Los juegos de entrenamiento cerebral', [
          'Owen y otros (2010) pusieron a más de 11.000 personas a entrenar con juegos de memoria y razonamiento durante seis semanas.',
          'Mejoraron mucho en los juegos que practicaron, pero casi nada en otras pruebas distintas.',
          'Simons y otros (2016) revisaron toda la evidencia: hay poca prueba de que estos programas mejoren la vida diaria o la inteligencia general.',
          'Si quieres mejorar en algo, practica ese algo.',
        ]],
        ['Mitos comunes', [
          '"Solo usamos el 10 % del cerebro": falso. Las imágenes cerebrales muestran actividad en todo el cerebro, aunque no todo al mismo tiempo.',
          '"Hay personas de hemisferio izquierdo (lógicas) y derecho (creativas)": Nielsen y otros (2013) analizaron más de mil cerebros y no encontraron personas con un hemisferio dominante en general.',
          '"Escuchar Mozart te hace más inteligente": Chabris (1999) revisó los estudios y encontró un efecto pequeño y pasajero, explicado por el ánimo y la activación, no por Mozart.',
          '"Recablea tu cerebro en 21 días": no hay un plazo así; los cambios dependen de la práctica y varían mucho.',
        ]],
        ['Cómo reconocer el neuromarketing', [
          'Desconfía cuando ponen "neuro" o "cuántico" delante de un producto sin explicar el estudio.',
          'Pregunta: ¿qué estudio lo prueba? ¿con cuántas personas? ¿mejoraron en la vida real o solo en el juego?',
          'Las recomendaciones con mejor evidencia son aburridas y gratis: dormir, moverse, aprender cosas nuevas y relacionarse.',
        ]],
      ],
      ejemplos: [
        'Pagas una suscripción mensual a una app de juegos para "mantener tu cerebro joven". Después de tres meses eres muy bueno en esos juegos, pero no recuerdas mejor dónde dejaste las llaves. Con la misma plata y tiempo, una clase de baile o de idioma te daría práctica real, movimiento y vida social.',
        'En una capacitación de la empresa te hacen un test para saber si eres "de cerebro izquierdo o derecho" y te ponen en un equipo según eso. Es entretenido, pero no tiene base científica.',
      ],
      practica: [
        'Busca una app, curso o producto que prometa mejorar tu cerebro y responde: ¿qué estudio lo respalda y qué mejoró exactamente?',
        'Escribe uno de estos mitos que hayas creído y cómo te lo explicarías ahora.',
        'Reemplaza 15 minutos de juego en el celular por aprender algo real esta semana (una lección, un instrumento, un idioma).',
      ],
      pregunta: '¿En qué he gastado tiempo o plata creyendo que "entrenaba mi cerebro"?',
      nota: 'Algunos entrenamientos muy específicos sí tienen beneficios en grupos concretos (por ejemplo, ciertos programas de velocidad de procesamiento en adultos mayores mostraron efectos en estudios grandes), pero no son la "gimnasia mental universal" que promete la publicidad. En 2016, la empresa de Lumosity tuvo que pagar una multa en Estados Unidos por publicidad engañosa sobre sus beneficios.',
      recordar: [
        ['¿Qué encontraron Owen y otros con 11.000 personas?', 'Que mejoraron en los juegos practicados, pero casi nada en otras pruebas.'],
        ['¿Es cierto que solo usamos el 10 % del cerebro?', 'No: todo el cerebro tiene actividad, aunque no todo al mismo tiempo.'],
        ['¿Qué encontraron Nielsen y otros sobre el cerebro izquierdo y derecho?', 'Que no hay personas con un hemisferio dominante en general.'],
        ['¿Qué pasó con el efecto Mozart?', 'Era pequeño y pasajero, explicado por el ánimo y la activación.'],
      ],
      tarjetas: [
        ['Entrenamiento cerebral (Owen, 2010)', 'Mejoras en el juego que practicas, no en la inteligencia general. Si quieres mejorar en algo, practica ese algo.'],
        ['Mitos del cerebro', 'Falso: usamos el 10 %, personas de cerebro izquierdo o derecho, Mozart te hace más inteligente.'],
        ['Lo que sí funciona (gratis)', 'Dormir, moverse, aprender cosas nuevas y relacionarse.'],
      ],
    }),
  ],
};

export default {
  id: 'neuroplasticidad',
  nombre: 'Neuroplasticidad',
  area: 'cerebro',
  icono: '🌱',
  nivel: 'Básico',
  paraQue: 'Entender cómo tu cerebro cambia con lo que haces, a cualquier edad, y qué lo impulsa de verdad (práctica bien hecha, ejercicio y sueño). También aprenderás a separar la ciencia de las promesas de mercadeo que usan la palabra "neuroplasticidad".',
  modulos: [QUE_ES, IMPULSA, LIMITES],
  proyecto: {
    titulo: 'Un mes aprendiendo algo nuevo, con ciencia',
    intro: 'Durante 4 semanas vas a aprender una habilidad nueva (un idioma, un instrumento, una técnica deportiva, malabares) aplicando lo del curso, y vas a registrar cómo cambias.',
    pasos: [
      'Escoge una habilidad nueva y concreta, y graba o anota tu nivel el primer día.',
      'Divídela en partes y decide cuál es la más débil para empezar a trabajarla.',
      'Practica al menos 4 veces por semana en sesiones de 15 a 30 minutos, con práctica deliberada y alguna forma de retroalimentación.',
      'Muévete al menos tres veces por semana (caminar, trotar, fútbol, gym).',
      'Cuida tu horario de sueño, sobre todo las noches después de practicar.',
      'Registra cada sesión en la app o en el diario: qué practicaste y cómo salió.',
      'Al final de cada semana, compara tu nivel con el del primer día y ajusta qué parte vas a trabajar.',
      'Al terminar el mes, graba o anota tu nivel final y escribe qué cambió y qué vas a seguir practicando.',
    ],
  },
};
