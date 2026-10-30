// Aprender a aprender: el curso piloto de 🎓 Estudiar y el ejemplo del formato de src/cursos (lo valida tests/cursos.test.mjs).
// Curso: ficha (id, nombre, área, ícono, nivel, para qué sirve), módulos con fuentes reales y lecciones de unos 10 minutos,
// y un proyecto final. Cada lección: idea central, bloques (título + puntos), ejemplos, práctica del día (3 acciones),
// pregunta del diario, nota (lo que conviene matizar), minutos, "recordar sin mirar" ([pregunta, respuesta], 3-5)
// y tarjetas de repaso ([frente, reverso]) que vuelven a 1, 3, 7, 16 y 35 días.

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const RECORDAR = {
  titulo: 'Recordar: la práctica que más enseña',
  objetivo: 'Entender por qué releer engaña y cómo sacar la información de la cabeza la fija mejor que meterla otra vez.',
  fuentes: [
    ['Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J. y Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4-58.', 'La revisión de 10 técnicas de estudio: cuáles sirven y cuáles no.'],
    ['Roediger, H. L. y Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249-255.', 'El experimento clásico de releer frente a recordar.'],
    ['Karpicke, J. D. y Blunt, J. R. (2011). Retrieval practice produces more learning than elaborative studying with concept mapping. Science, 331(6018), 772-775.', 'Recordar le gana a hacer mapas conceptuales, incluso en preguntas de razonar.'],
    ['Karpicke, J. D., Butler, A. C. y Roediger, H. L. (2009). Metacognitive strategies in student learning: Do students practise retrieval when they study on their own? Memory, 17(4), 471-479.', 'Qué hacen de verdad los estudiantes cuando estudian solos.'],
    ['Rowland, C. A. (2014). The effect of testing versus restudy on retention: A meta-analytic review of the testing effect. Psychological Bulletin, 140(6), 1432-1463.', 'Metaanálisis: el efecto de ponerse a prueba se repite en cientos de comparaciones.'],
    ['Brown, P. C., Roediger, H. L. y McDaniel, M. A. (2014). Make It Stick: The Science of Successful Learning. Harvard University Press.', 'Libro de divulgación escrito por los propios investigadores.'],
  ],
  lecciones: [
    l('La ilusión de saber', 10, {
      idea: 'Releer y subrayar se sienten productivos porque el texto se vuelve familiar, pero reconocer algo no es lo mismo que poder recordarlo.',
      bloques: [
        ['Lo que hace casi todo el mundo', [
          'Cuando estudian solos, la mayoría de los estudiantes relee sus notas o el libro: en una encuesta de Karpicke y colegas (2009), el 84 % dijo que releía, y muy pocos usaban ponerse a prueba como estrategia principal.',
          'Subrayar, resaltar, hacer resúmenes largos y releer son las técnicas más populares. También son de las que menos rinden por cada hora invertida.',
          'No son inútiles del todo: releer una vez ayuda a entender. El problema es usarlas como la forma principal de aprender.',
        ]],
        ['Por qué engañan: fluidez no es aprendizaje', [
          'La segunda vez que lees algo, lo procesas más rápido y con menos esfuerzo. Esa facilidad (fluidez) se siente como dominio.',
          'Pero el examen, la reunión o la conversación no te van a mostrar el texto: te van a pedir que lo saques de tu memoria.',
          'Reconocer ("ah, sí, esto lo vi") es mucho más fácil que recordar sin pistas. Releer entrena lo primero; la vida te pide lo segundo.',
          'A esto se le llama ilusión de competencia: juzgamos lo que sabemos por lo fácil que se siente, y lo fácil engaña.',
        ]],
        ['El veredicto de la evidencia', [
          'Dunlosky y su equipo (2013) revisaron cientos de estudios sobre 10 técnicas. Utilidad alta: practicar recordando (ponerse a prueba) y espaciar el estudio.',
          'Utilidad moderada: preguntarse por qué (interrogación elaborativa), explicarse a uno mismo y mezclar tipos de problemas (intercalar).',
          'Utilidad baja: resumir, subrayar o resaltar, la palabra clave como truco de memoria, imaginar el texto y releer.',
          'La conclusión no es "nunca subrayes", sino "lo que más rinde es lo que te obliga a recordar y a volver con el tiempo".',
        ]],
      ],
      ejemplos: [
        'Lees dos veces un capítulo de finanzas y te sientes listo. Cierras el libro e intentas explicar qué es el interés compuesto: te salen dos frases sueltas. Esa diferencia es la ilusión de saber.',
        'Un estudiante resalta medio libro en amarillo. Al final del semestre el libro está bonito, pero resaltar no le pidió decidir qué era importante ni recordarlo después.',
      ],
      practica: [
        'Toma algo que estudiaste esta semana, cierra todo y escribe en 3 minutos lo que recuerdas. Compara con el material.',
        'Cuenta cuántas veces releíste algo esta semana y cuántas intentaste recordarlo sin mirar.',
        'Escoge un tema que creas dominar y explícalo en voz alta como si se lo contaras a un amigo.',
      ],
      pregunta: '¿En qué tema creo que sé más de lo que realmente puedo explicar sin mirar?',
      nota: 'Las cifras exactas de la encuesta de 2009 vienen de estudiantes universitarios de Estados Unidos: no hay que tomarlas como verdad universal, pero el patrón (releer mucho, ponerse a prueba poco) aparece en muchas encuestas parecidas.',
      recordar: [
        ['¿Por qué releer se siente útil aunque rinda poco?', 'Porque el texto se vuelve familiar y fácil de procesar (fluidez), y confundimos esa facilidad con saberlo.'],
        ['¿Qué dos técnicas tuvieron utilidad alta en la revisión de Dunlosky (2013)?', 'Practicar recordando (ponerse a prueba) y espaciar el estudio en el tiempo.'],
        ['¿Cuál es la diferencia entre reconocer y recordar?', 'Reconocer es identificar algo cuando lo ves; recordar es sacarlo de la memoria sin pistas. Recordar es más difícil y es lo que pide la vida.'],
        ['Nombra tres técnicas de utilidad baja.', 'Releer, subrayar o resaltar y resumir (también la palabra clave y las imágenes del texto).'],
      ],
      tarjetas: [
        ['¿Qué es la ilusión de competencia?', 'Creer que sabes algo porque se siente fácil o familiar, cuando en realidad no puedes recordarlo ni explicarlo sin mirar.'],
        ['Técnicas de utilidad alta según Dunlosky (2013)', 'Ponerse a prueba (recuperación activa) y repaso espaciado.'],
        ['¿Por qué subrayar rinde poco?', 'No te obliga a recordar ni a conectar ideas; solo marca el texto, y luego releerlo da sensación falsa de dominio.'],
      ],
    }),
    l('Recuperación activa: sacar en vez de meter', 10, {
      idea: 'Cada vez que sacas un recuerdo de la memoria lo haces más fuerte y más fácil de encontrar la próxima vez. Ponerse a prueba no solo mide lo que sabes: lo enseña.',
      bloques: [
        ['El experimento clásico', [
          'Roediger y Karpicke (2006) pusieron a estudiantes a aprender textos cortos. Unos los leyeron varias veces; otros los leyeron una vez y luego practicaron escribir todo lo que recordaban.',
          'A los 5 minutos, los que releyeron recordaban un poco más. Pero a los 2 días y a la semana, ganaron con claridad los que practicaron recordar (en uno de los experimentos, alrededor de 61 % frente a 40 %).',
          'Lo curioso: los que solo releyeron predijeron que recordarían más. La sensación iba al revés del resultado.',
        ]],
        ['Por qué funciona', [
          'Recordar es un acto que cambia la memoria: el camino para llegar a la información se refuerza cada vez que lo recorres.',
          'Al intentar recordar descubres lo que no sabes. Eso te dice dónde estudiar, cosa que releer nunca te muestra.',
          'Funciona aunque no aciertes todo, siempre que después revises la respuesta correcta (retroalimentación).',
          'Karpicke y Blunt (2011) compararon recordar con hacer mapas conceptuales: recordar ganó, incluso en preguntas que pedían razonar y no solo repetir.',
        ]],
        ['Lo que dice la investigación completa', [
          'No es un estudio aislado: metaanálisis como el de Rowland (2014), con cientos de comparaciones, encuentran el mismo efecto.',
          'El beneficio aparece en niños, universitarios y adultos mayores, y en materias muy distintas: vocabulario, ciencias, historia, medicina.',
          'El efecto es moderado, no mágico: ponerse a prueba no reemplaza entender, pero hace que lo entendido se quede.',
        ]],
      ],
      ejemplos: [
        'En vez de releer tus apuntes de la reunión, cierra el cuaderno y escribe los 3 acuerdos y quién quedó encargado de cada uno. Luego abre y corrige.',
        'Para aprender las reglas del fuera de lugar, en vez de leerlas otra vez, mira una jugada y explica en voz alta si es fuera de lugar y por qué.',
      ],
      practica: [
        'Después de esta lección, cierra la app y escribe en un papel las 3 ideas que recuerdes. Luego vuelve y revisa.',
        'Convierte un tema que estudies en 5 preguntas y respóndelas mañana sin mirar.',
        'Responde hoy el "recordar sin mirar" de esta lección antes de ver las respuestas.',
      ],
      pregunta: '¿Qué podría empezar a practicar recordando en vez de releyendo (trabajo, idiomas, deporte, finanzas)?',
      nota: 'A veces se dice que ponerse a prueba "duplica" lo que recuerdas. Depende mucho del material, del tiempo hasta el examen y de si hay retroalimentación: es uno de los efectos más sólidos de la psicología del aprendizaje, pero su tamaño varía.',
      recordar: [
        ['¿Qué pasó a los 5 minutos y qué pasó a la semana en el estudio de Roediger y Karpicke (2006)?', 'A los 5 minutos recordaban un poco más los que releyeron; a la semana ganaron con claridad los que practicaron recordar.'],
        ['¿Qué predijeron los que solo releyeron?', 'Que iban a recordar más. Su sensación de dominio estaba equivocada.'],
        ['¿Por qué recordar fortalece la memoria?', 'Porque recorrer el camino hasta la información lo refuerza y lo hace más fácil de encontrar después; además muestra lo que no sabes.'],
        ['¿Qué hace falta para que funcione aunque te equivoques?', 'Revisar después la respuesta correcta (retroalimentación).'],
      ],
      tarjetas: [
        ['¿Qué es la recuperación activa?', 'Sacar la información de la memoria sin mirar (preguntas, tarjetas, explicar en blanco) en vez de volver a leerla.'],
        ['Roediger y Karpicke (2006): resultado a la semana', 'Los que practicaron recordar se acordaban de bastante más que los que releyeron (≈61 % frente a 40 % en un experimento).'],
        ['Karpicke y Blunt (2011)', 'Recordar le ganó a hacer mapas conceptuales, incluso en preguntas de razonar.'],
      ],
    }),
    l('Cómo practicar recordando', 11, {
      idea: 'Hay muchas formas de sacar la información de la cabeza; todas comparten lo mismo: primero intentas sin mirar y después revisas.',
      bloques: [
        ['Formas de practicar', [
          'Hoja en blanco: después de estudiar, escribe todo lo que recuerdes del tema, sin mirar. Luego compara y completa con otro color.',
          'Tarjetas (flashcards): pregunta por un lado, respuesta por el otro. Di la respuesta antes de voltearla.',
          'Preguntas propias: al leer, convierte cada título en una pregunta ("¿Qué es la inflación?") y respóndela al día siguiente.',
          'Explicar en voz alta: cuéntale el tema a alguien (o a una silla vacía) sin notas.',
          'Exámenes de práctica: los de años anteriores o los que vienen al final del capítulo.',
        ]],
        ['Las reglas que la hacen funcionar', [
          'Intenta antes de mirar, aunque cueste. Ese esfuerzo es la parte que enseña; si miras enseguida, se pierde.',
          'Revisa siempre la respuesta correcta. Sin retroalimentación puedes fijar un error.',
          'Responde con tus palabras, no reconociendo opciones: escribir o decir la respuesta enseña más que elegir entre varias.',
          'Las preguntas que pides "por qué" o "cómo se relaciona con…" fijan más que las de un dato suelto.',
          'Repite el ciclo en días distintos (eso es la lección 4).',
        ]],
        ['Errores que se pueden aprovechar', [
          'Equivocarse con mucha seguridad y luego ver la respuesta correcta se corrige muy bien: a esto se le llama efecto de hipercorrección (Butterfield y Metcalfe, 2001).',
          'Intentar responder antes de estudiar un tema (pre-prueba), aunque falles, ayuda a aprender después lo que se pregunta.',
          'Lo que no ayuda: mirar la respuesta y decirte "sí, eso iba a decir". Si no lo dijiste antes de mirar, cuenta como fallo.',
        ]],
      ],
      ejemplos: [
        'Para aprender inglés, en vez de leer la lista de palabras, tapa la columna en español y di cada traducción; marca las que fallaste y vuelve a ellas al final.',
        'Antes de una entrevista de trabajo, escribe las 5 preguntas que más temes y respóndelas en voz alta sin leer. Graba una y escúchala.',
      ],
      practica: [
        'Haz una hoja en blanco de las lecciones 1 y 2: escribe todo lo que recuerdes en 5 minutos.',
        'Escribe 3 tarjetas propias de algo que necesites aprender (trabajo, idioma, reglas) y respóndelas mañana.',
        'La próxima vez que falles una tarjeta, no te saltes la respuesta: léela y di en voz alta por qué es así.',
      ],
      pregunta: '¿Qué formato de práctica (hoja en blanco, tarjetas, explicar en voz alta) encaja mejor con lo que quiero aprender ahora?',
      nota: 'Las tarjetas son buenas para datos, vocabulario y definiciones, pero no bastan para temas que piden entender relaciones o resolver problemas: ahí sirven más la hoja en blanco, explicar y practicar ejercicios.',
      recordar: [
        ['¿Qué tienen en común todas las formas de practicar recordando?', 'Primero intentas sin mirar y después revisas la respuesta correcta.'],
        ['¿Qué es el efecto de hipercorrección?', 'Los errores que cometiste con mucha seguridad se corrigen muy bien cuando ves la respuesta correcta.'],
        ['¿Por qué escribir la respuesta enseña más que elegir entre opciones?', 'Porque te obliga a recordar sin pistas, no solo a reconocer.'],
        ['¿Cuenta como acierto mirar la respuesta y pensar "eso iba a decir"?', 'No: si no lo dijiste antes de mirar, es un fallo.'],
      ],
      tarjetas: [
        ['Técnica de la hoja en blanco', 'Escribir todo lo que recuerdas de un tema sin mirar y después completar lo que faltó con otro color.'],
        ['Las 2 reglas de oro de recordar', '1) Intentar antes de mirar, aunque cueste. 2) Revisar siempre la respuesta correcta.'],
        ['¿Para qué sirve una pre-prueba?', 'Intentar responder antes de estudiar, aunque falles, prepara la memoria para aprender mejor lo que se pregunta.'],
      ],
    }),
  ],
};

const CUANDO = {
  titulo: 'Cuándo y cómo practicar',
  objetivo: 'Repartir el estudio en el tiempo, mezclar temas parecidos y conectar lo nuevo con lo que ya sabes.',
  fuentes: [
    ['Ebbinghaus, H. (1885). Über das Gedächtnis (La memoria). Leipzig: Duncker & Humblot.', 'La primera curva del olvido, medida en sí mismo con sílabas sin sentido.'],
    ['Murre, J. M. J. y Dros, J. (2015). Replication and analysis of Ebbinghaus’ forgetting curve. PLOS ONE, 10(7), e0120644.', 'La curva del olvido replicada 130 años después.'],
    ['Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T. y Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354-380.', 'Metaanálisis del repaso espaciado.'],
    ['Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T. y Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. Psychological Science, 19(11), 1095-1102.', 'Cuánto espaciar según cuándo lo necesitas recordar.'],
    ['Kornell, N. (2009). Optimising learning using flashcards: Spacing is more effective than cramming. Applied Cognitive Psychology, 23(9), 1297-1317.', 'Tarjetas espaciadas frente a tarjetas en bloque.'],
    ['Rohrer, D. y Taylor, K. (2007). The shuffling of mathematics problems improves learning. Instructional Science, 35(6), 481-498.', 'Intercalar problemas de matemáticas.'],
    ['Kornell, N. y Bjork, R. A. (2008). Learning concepts and categories: Is spacing the “enemy of induction”? Psychological Science, 19(6), 585-592.', 'Aprender estilos de pintores mezclando cuadros.'],
    ['Brunmair, M. y Richter, T. (2019). Similarity matters: A meta-analysis of interleaved learning and its moderators. Psychological Bulletin, 145(11), 1029-1052.', 'Cuándo intercalar ayuda y cuándo no.'],
    ['Chi, M. T. H., de Leeuw, N., Chiu, M.-H. y LaVancher, C. (1994). Eliciting self-explanations improves understanding. Cognitive Science, 18(3), 439-477.', 'Explicarse a uno mismo mejora la comprensión.'],
    ['Weinstein, Y., Madan, C. R. y Sumeracki, M. A. (2018). Teaching the science of learning. Cognitive Research: Principles and Implications, 3(2).', 'Las seis estrategias con evidencia, explicadas para profesores y estudiantes.'],
  ],
  lecciones: [
    l('Repaso espaciado: volver antes de olvidar', 10, {
      idea: 'Lo mismo estudiado en varios días se recuerda mucho más que estudiado de una sola vez. Cada repaso, hecho justo cuando empieza a costar, alarga el tiempo que dura el recuerdo.',
      bloques: [
        ['La curva del olvido', [
          'Hermann Ebbinghaus (1885) se aprendió listas de sílabas sin sentido y midió cuánto olvidaba: la mayor parte se va en las primeras horas y días, y después el olvido se hace más lento.',
          'Cada vez que repasaba, la curva caía más despacio. El recuerdo se volvía más duradero con cada vuelta.',
          'Murre y Dros (2015) repitieron el experimento y obtuvieron una curva muy parecida.',
        ]],
        ['Espaciar le gana a "embutir"', [
          'Estudiar todo la noche antes (embutir, "cramming") sirve para el día siguiente, pero se olvida rápido.',
          'El metaanálisis de Cepeda y colegas (2006) reunió cientos de experimentos: repartir el mismo tiempo en sesiones separadas da mejor memoria a largo plazo.',
          'Cuánto espaciar depende de cuándo lo necesitas: para recordar en una semana, el mejor espacio entre sesiones rondó un día; para dentro de varios meses o un año, unas tres semanas (Cepeda y colegas, 2008).',
          'Kornell (2009): con tarjetas, repasar todas en un solo mazo grande (más espacio entre cada tarjeta) funcionó mejor que en mazos pequeños para el 90 % de los participantes… aunque la mayoría creyó lo contrario.',
        ]],
        ['Cómo lo hace esta app', [
          'Al terminar una lección, sus tarjetas entran a tu mazo. Vuelven al día siguiente, y si las aciertas vuelven a los 3, 7, 16 y 35 días.',
          'Si fallas una, empieza de nuevo (mañana). Así lo difícil se repasa más y lo fácil casi no te quita tiempo.',
          'Es una versión del sistema de cajas de Sebastian Leitner (1972), que hacía lo mismo con tarjetas de papel y cajas.',
          'Por eso el plan del día pone primero los repasos: si te los saltas, el recuerdo se debilita y luego cuesta más.',
        ]],
      ],
      ejemplos: [
        'Con 3 horas para un examen, es mejor estudiar 1 hora el lunes, 1 el miércoles y 1 el viernes que las 3 el jueves en la noche.',
        'Para recordar los nombres del equipo nuevo del trabajo, repásalos hoy, mañana y el fin de semana, en vez de 20 veces el primer día.',
      ],
      practica: [
        'Haz hoy los repasos que te tocan antes de empezar algo nuevo.',
        'Escribe en tu calendario 3 repasos (mañana, en 3 días y en una semana) de algo que estés aprendiendo fuera de la app.',
        'Divide la próxima tarea grande de estudio en sesiones cortas en días distintos.',
      ],
      pregunta: '¿Qué cosa importante aprendí "embutiendo" y ya se me olvidó?',
      nota: 'La famosa frase "olvidas el 70 % en 24 horas" sale de los datos de Ebbinghaus con sílabas sin sentido, medidos en él mismo. Con material con significado, que entiendes y conectas, se olvida bastante más despacio. La forma de la curva sí se repite; los porcentajes exactos no son universales.',
      recordar: [
        ['¿Qué mostró la curva del olvido de Ebbinghaus?', 'Que se olvida rápido al principio y más despacio después, y que cada repaso hace que el olvido sea más lento.'],
        ['¿Por qué estudiar la noche antes es mala estrategia a largo plazo?', 'Sirve para el día siguiente, pero se olvida rápido; repartir el mismo tiempo en varios días deja un recuerdo más duradero.'],
        ['¿Cada cuántos días vuelven las tarjetas en esta app?', 'A 1, 3, 7, 16 y 35 días. Si fallas una, empieza de nuevo.'],
        ['¿De qué depende cuánto espaciar los repasos?', 'De cuándo lo necesitas recordar: más lejos el examen, más espacio entre sesiones.'],
      ],
      tarjetas: [
        ['¿Qué es el repaso espaciado?', 'Repartir el estudio de lo mismo en varias sesiones separadas en el tiempo, volviendo justo cuando empieza a costar recordarlo.'],
        ['Intervalos de las tarjetas de esta app', '1, 3, 7, 16 y 35 días; si fallas, vuelve a empezar.'],
        ['¿Qué es el sistema Leitner?', 'Tarjetas en cajas: las que aciertas pasan a una caja que se repasa menos seguido; las que fallas vuelven a la primera.'],
      ],
    }),
    l('Intercalar: mezclar para aprender a elegir', 10, {
      idea: 'Practicar un solo tipo de problema seguido se siente fluido, pero mezclar tipos parecidos te obliga a decidir cuál es cuál, y eso es lo que pide la vida real.',
      bloques: [
        ['En bloque frente a intercalado', [
          'En bloque: 10 ejercicios del tipo A, luego 10 del tipo B, luego 10 del C (AAA BBB CCC).',
          'Intercalado: los mismos 30 ejercicios mezclados (A C B B A C…).',
          'En bloque ya sabes qué método usar antes de leer el problema. Intercalado, primero tienes que reconocer qué tipo de problema es.',
        ]],
        ['La evidencia', [
          'Rohrer y Taylor (2007) pusieron a estudiantes a calcular volúmenes de figuras. Mientras practicaban, los de bloque iban mejor; una semana después, en el examen, los que mezclaron sacaron alrededor de 63 % frente a 20 %.',
          'Kornell y Bjork (2008) enseñaron a distinguir el estilo de 12 pintores. Ver los cuadros mezclados funcionó mejor para reconocer cuadros nuevos, pero la mayoría de participantes creyó que en bloque había aprendido más.',
          'El metaanálisis de Brunmair y Richter (2019) matiza: intercalar ayuda sobre todo cuando las categorías se parecen y se confunden (pinturas, tipos de problemas de matemáticas). Con listas de palabras no ayudó.',
        ]],
        ['Cómo usarlo', [
          'Primero aprende cada tipo por separado hasta entenderlo; después mezcla para practicar.',
          'Mezcla cosas que se puedan confundir entre sí: tiempos verbales, tipos de ejercicios del gym, estrategias de negociación.',
          'Espera que se sienta más difícil y más lento. Esa dificultad es parte de lo que lo hace funcionar.',
        ]],
      ],
      ejemplos: [
        'Aprendiendo inglés, en vez de hacer 20 frases en pasado simple y luego 20 en presente perfecto, mézclalas: así aprendes cuándo usar cada uno.',
        'En el fútbol, practicar solo pases cortos 20 minutos se siente bien; una práctica que mezcla pase, control y remate en situaciones distintas se parece más al partido.',
      ],
      practica: [
        'Toma tres temas parecidos que estés aprendiendo y haz una práctica mezclándolos.',
        'Al resolver un problema mezclado, antes de resolverlo di en voz alta qué tipo es y cómo lo sabes.',
        'Fíjate si hoy en algo te sentiste "fluido": ¿estabas repitiendo lo mismo en bloque?',
      ],
      pregunta: '¿Dónde estoy practicando en bloque algo que en la vida real me va a llegar mezclado?',
      nota: 'Intercalar no es saltar de un tema a otro sin relación (matemáticas, luego historia, luego química) por el gusto de variar. El beneficio viene de comparar cosas parecidas que se confunden. Y al principio, cuando aún no entiendes un tipo, conviene verlo en bloque.',
      recordar: [
        ['¿En qué se diferencia practicar en bloque de practicar intercalado?', 'En bloque haces muchos del mismo tipo seguidos; intercalado mezclas tipos, así que primero debes reconocer cuál es cuál.'],
        ['¿Qué pasó en el estudio de Rohrer y Taylor (2007)?', 'En la práctica iban mejor los de bloque, pero una semana después los que mezclaron sacaron mucho más (≈63 % frente a 20 %).'],
        ['¿Cuándo ayuda más intercalar, según Brunmair y Richter (2019)?', 'Cuando las categorías se parecen y se confunden, como pinturas o tipos de problemas; no con listas de palabras.'],
      ],
      tarjetas: [
        ['¿Qué es intercalar?', 'Mezclar en la práctica tipos de problemas o categorías parecidas en vez de practicar uno solo seguido.'],
        ['¿Por qué funciona intercalar?', 'Obliga a reconocer qué tipo de problema es y qué método usar, y a comparar categorías que se confunden.'],
        ['¿Cuándo NO conviene intercalar?', 'Cuando todavía no entiendes cada tipo por separado, o al mezclar temas sin relación ni parecido.'],
      ],
    }),
    l('Elaboración: preguntar por qué y explicártelo', 10, {
      idea: 'Lo que conectas con lo que ya sabes se recuerda mejor. Preguntarte "¿por qué es así?" y explicarte cada paso convierte datos sueltos en una red.',
      bloques: [
        ['Interrogación elaborativa: ¿por qué?', [
          'Al leer un dato, pregúntate por qué es cierto y respóndelo con lo que sabes.',
          'En los estudios de Pressley y colegas (1987), pedir "¿por qué tendría sentido esto?" mejoró el recuerdo de datos frente a solo leerlos.',
          'Funciona mejor cuando ya sabes algo del tema: necesitas conocimientos previos con los que conectar.',
        ]],
        ['Autoexplicación', [
          'Al estudiar un ejemplo resuelto o un texto difícil, explícate cada paso: qué se hizo, por qué y cómo se conecta con lo anterior.',
          'Chi y colegas (1994) pidieron a estudiantes que se explicaran un texto de biología mientras lo leían: entendieron mejor que quienes solo lo leyeron dos veces.',
          'Las preguntas útiles: ¿qué significa esto?, ¿qué nueva información me da?, ¿cómo se relaciona con lo que ya sé?, ¿qué pasaría si…?',
        ]],
        ['Ejemplos concretos y dos formas de verlo', [
          'Las ideas abstractas se fijan mejor con ejemplos concretos; mejor si son varios y distintos, y si comparas qué tienen en común.',
          'Combinar palabras con un dibujo, un esquema o una línea de tiempo da dos caminos para recordar lo mismo (codificación dual, de Allan Paivio).',
          'Conectar con tu propia vida ("¿dónde he visto esto?") es una de las elaboraciones más fuertes.',
        ]],
      ],
      ejemplos: [
        'Dato: "Los músculos crecen durante el descanso, no durante el entreno". ¿Por qué? Porque el entreno daña las fibras y el cuerpo las repara más fuertes cuando descansa y come proteína. Ahora el dato tiene un porqué y es difícil olvidarlo.',
        'Al leer que "el interés compuesto crece más rápido con el tiempo", hazte un ejemplo: 1 millón al 10 % anual da 1,1 millones el primer año, pero el año 20 ya gana más de 600.000 en un solo año.',
      ],
      practica: [
        'Toma 3 datos de esta lección y escribe al lado de cada uno "¿por qué?" con tu respuesta.',
        'Busca un ejemplo de tu vida para el repaso espaciado y otro para el intercalado.',
        'Dibuja un esquema de una página con lo que va del curso: recordar, espaciar, intercalar y elaborar.',
      ],
      pregunta: '¿Qué estoy aprendiendo como datos sueltos que podría conectar con algo que ya sé muy bien?',
      nota: 'Elaborar ayuda, pero no reemplaza recordar: lo mejor es combinarlos (explícalo sin mirar). También ojo con la "pirámide del aprendizaje" que dice que recuerdas el 10 % de lo que lees y el 90 % de lo que enseñas: esos porcentajes no salen de ningún estudio. Enseñar sí ayuda, pero porque te obliga a recordar y a explicar.',
      recordar: [
        ['¿Qué es la interrogación elaborativa?', 'Preguntarte por qué un dato es cierto y responderlo con lo que ya sabes.'],
        ['¿Qué encontraron Chi y colegas (1994) sobre la autoexplicación?', 'Quienes se explicaron un texto de biología mientras lo leían lo entendieron mejor que quienes solo lo leyeron dos veces.'],
        ['¿Qué es la codificación dual?', 'Aprender algo con palabras y con una imagen o esquema, para tener dos caminos de recuerdo.'],
        ['¿Tiene base la pirámide de "10 % de lo que lees, 90 % de lo que enseñas"?', 'No: esos porcentajes no salen de ningún estudio.'],
      ],
      tarjetas: [
        ['¿Qué es elaborar?', 'Conectar lo nuevo con lo que ya sabes: preguntar por qué, explicarte los pasos, buscar ejemplos y relaciones.'],
        ['4 preguntas de autoexplicación', '¿Qué significa? ¿Qué información nueva da? ¿Cómo se relaciona con lo que sé? ¿Qué pasaría si…?'],
        ['La pirámide del aprendizaje (10 % leer, 90 % enseñar)', 'Es un mito: sus porcentajes no vienen de ningún estudio.'],
      ],
    }),
  ],
};

const CEREBRO = {
  titulo: 'El cerebro que aprende',
  objetivo: 'Cuidar la memoria de trabajo, dormir para fijar lo aprendido y armar un sistema de estudio propio sin caer en mitos.',
  fuentes: [
    ['Cowan, N. (2001). The magical number 4 in short-term memory: A reconsideration of mental storage capacity. Behavioral and Brain Sciences, 24(1), 87-114.', 'La memoria de trabajo guarda unos 4 bloques, no 7.'],
    ['Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. Cognitive Science, 12(2), 257-285.', 'El origen de la teoría de la carga cognitiva.'],
    ['Sweller, J., van Merriënboer, J. J. G. y Paas, F. (2019). Cognitive architecture and instructional design: 20 years later. Educational Psychology Review, 31(2), 261-292.', 'La teoría actualizada: ejemplos resueltos, atención dividida y más.'],
    ['Kalyuga, S., Ayres, P., Chandler, P. y Sweller, J. (2003). The expertise reversal effect. Educational Psychologist, 38(1), 23-31.', 'Lo que ayuda al principiante puede estorbar al experto.'],
    ['Diekelmann, S. y Born, J. (2010). The memory function of sleep. Nature Reviews Neuroscience, 11(2), 114-126.', 'Cómo el sueño consolida la memoria.'],
    ['Rasch, B. y Born, J. (2013). About sleep’s role in memory. Physiological Reviews, 93(2), 681-766.', 'Revisión completa de sueño y memoria.'],
    ['Yoo, S.-S., Hu, P. T., Gujar, N., Jolesz, F. A. y Walker, M. P. (2007). A deficit in the ability to form new human memories without sleep. Nature Neuroscience, 10(3), 385-392.', 'Dormir mal antes de aprender también afecta.'],
    ['Pashler, H., McDaniel, M., Rohrer, D. y Bjork, R. (2008). Learning styles: Concepts and evidence. Psychological Science in the Public Interest, 9(3), 105-119.', 'Por qué los "estilos de aprendizaje" no tienen respaldo.'],
    ['Bjork, E. L. y Bjork, R. A. (2011). Making things hard on yourself, but in a good way: Creating desirable difficulties to enhance learning. En Psychology and the Real World (pp. 56-64). Worth.', 'Las dificultades deseables.'],
    ['Ruiz Martín, H. (2020). ¿Cómo aprendemos? Una aproximación científica al aprendizaje y la enseñanza. Graó.', 'Buen resumen en español de toda esta investigación.'],
  ],
  lecciones: [
    l('Carga cognitiva: la mesa pequeña de la mente', 10, {
      idea: 'La memoria de trabajo, donde piensas lo nuevo, es muy pequeña. Si la llenas de ruido, distracciones o demasiada información a la vez, no queda espacio para aprender.',
      bloques: [
        ['Una mesa pequeña y una bodega enorme', [
          'Memoria de trabajo: lo que tienes "en mente" ahora mismo. Es como una mesa pequeña: caben pocas cosas a la vez y se caen rápido si no las usas.',
          'Memoria de largo plazo: la bodega. Cabe muchísimo y no se llena.',
          'Aprender es pasar cosas de la mesa a la bodega, bien organizadas. Lo que ya está en la bodega en bloques grandes ocupa poco espacio en la mesa: por eso un experto piensa más rápido.',
        ]],
        ['¿Cuántas cosas caben?', [
          'George Miller (1956) habló del "número mágico 7 ± 2". Nelson Cowan (2001) revisó la evidencia y concluyó que, sin repetir ni agrupar, caben unos 4 bloques.',
          'Un "bloque" puede ser una letra o una idea entera: para un ajedrecista, una posición completa es un solo bloque. Agrupar es una de las claves de la experiencia.',
        ]],
        ['Carga que ayuda y carga que estorba (Sweller)', [
          'Intrínseca: lo difícil del tema en sí. No se elimina, pero se divide en partes.',
          'Extraña: lo que estorba sin enseñar (instrucciones confusas, saltar entre el texto y una figura lejana, el celular vibrando, la música con letra).',
          'Útil: el esfuerzo de entender y conectar. Esa es la que quieres.',
          'Para principiantes, estudiar ejemplos resueltos antes de resolver solo ahorra carga. Cuando ya dominas el tema, los ejemplos estorban y conviene practicar sin ayudas (efecto de inversión de la experiencia).',
        ]],
        ['Atención: una cosa a la vez', [
          'Cambiar de tarea tiene costo: cada salto al chat o a una notificación te hace perder tiempo y concentración al volver.',
          'Para estudiar: celular lejos o en silencio, una sola pestaña y un bloque de tiempo cerrado (por ejemplo, el cronómetro de estudio de esta app).',
        ]],
      ],
      ejemplos: [
        'Aprender a hacer una declaración de renta leyendo la norma, viendo un video y respondiendo mensajes a la vez satura la mesa. Mejor: un ejemplo resuelto paso a paso, luego tu caso, sin el celular.',
        'Un número de teléfono de 10 dígitos es difícil de retener; agrupado (310 456 7890) son tres bloques y cabe en la mesa.',
      ],
      practica: [
        'Haz tu próxima sesión de estudio con el celular en otra habitación y el cronómetro de estudio corriendo.',
        'Divide un tema difícil que tengas pendiente en 3 partes pequeñas y estudia solo la primera hoy.',
        'Antes de resolver un problema nuevo, busca un ejemplo resuelto y explícate cada paso.',
      ],
      pregunta: '¿Qué está ocupando mi "mesa" cuando estudio o trabajo y no debería estar ahí?',
      nota: 'Se repite mucho que la sola presencia del celular sobre la mesa reduce la capacidad mental (estudio "Brain drain", Ward y colegas, 2017). Réplicas posteriores no encontraron el efecto con claridad. Lo que sí está bien establecido es el costo de interrumpirse y cambiar de tarea: el problema no es que el celular exista, sino mirarlo.',
      recordar: [
        ['¿Cuántos bloques caben en la memoria de trabajo según Cowan (2001)?', 'Unos 4 (no los 7 ± 2 que se citaban antes).'],
        ['¿Cuáles son los tres tipos de carga cognitiva?', 'Intrínseca (lo difícil del tema), extraña (lo que estorba sin enseñar) y útil (el esfuerzo de entender y conectar).'],
        ['¿Por qué un experto piensa más rápido?', 'Porque agrupa mucho en bloques grandes guardados en la memoria de largo plazo, que ocupan poco espacio en la de trabajo.'],
        ['¿Qué es el efecto de inversión de la experiencia?', 'Lo que ayuda al principiante (ejemplos resueltos, guías) puede estorbar al que ya sabe.'],
      ],
      tarjetas: [
        ['Memoria de trabajo vs. largo plazo', 'Trabajo: pequeña y pasajera (≈4 bloques), donde piensas lo nuevo. Largo plazo: enorme y duradera, donde queda lo aprendido.'],
        ['¿Qué es la carga extraña?', 'Lo que ocupa la memoria de trabajo sin enseñar: distracciones, instrucciones confusas, saltar entre fuentes.'],
        ['¿Por qué estudiar con ejemplos resueltos al principio?', 'Ahorran carga al principiante y muestran el camino; con experiencia conviene practicar sin ellos.'],
      ],
    }),
    l('Sueño y memoria', 10, {
      idea: 'Dormir no es tiempo perdido para estudiar: mientras duermes, el cerebro repasa y fija lo que aprendiste, y una noche mala también daña lo que vas a aprender al otro día.',
      bloques: [
        ['Dormir después de aprender', [
          'Ya en 1924, Jenkins y Dallenbach vieron que se olvidaba menos lo aprendido si después se dormía que si se pasaba el mismo tiempo despierto.',
          'Hoy se sabe que durante el sueño profundo (de ondas lentas) el cerebro "reproduce" lo aprendido en el día y lo pasa del hipocampo a la corteza, donde queda más estable (Diekelmann y Born, 2010; Rasch y Born, 2013).',
          'Las siestas también pueden ayudar a consolidar algunos aprendizajes.',
        ]],
        ['Dormir antes de aprender', [
          'Yoo y colegas (2007) privaron de sueño a un grupo una noche y luego les pidieron aprender: formaron muchos menos recuerdos nuevos que quienes durmieron, y el hipocampo respondía menos.',
          'Trasnochar para estudiar sale caro dos veces: quitas el sueño que fija lo del día y llegas peor a aprender lo del día siguiente.',
        ]],
        ['Lo práctico', [
          'Repasa lo más importante en la tarde o noche, y luego duerme: así el sueño trabaja sobre eso.',
          'Prefiere estudiar varios días con buen sueño a una trasnochada larga.',
          'Las mismas reglas del gym aplican: horario regular, poca pantalla y poca cafeína en la tarde.',
        ]],
      ],
      ejemplos: [
        'Antes de un examen importante, estudiar hasta las 3 a. m. se siente responsable; dormir 7-8 horas después de repasar suele rendir más al otro día.',
        'Practicas un movimiento nuevo de fútbol y al otro día, después de dormir, te sale mejor sin haberlo practicado más: parte de esa mejora ocurre en el sueño.',
      ],
      practica: [
        'Haz tus repasos de hoy en la tarde o noche, no al despertar.',
        'Anota a qué hora te acostaste y si dormiste bien (en 🌙 Sueño y peso), para ver si coincide con tus días de mejor estudio.',
        'Pon una alarma para empezar a desconectarte 30 minutos antes de dormir.',
      ],
      pregunta: '¿Estoy sacrificando sueño para estudiar o trabajar? ¿Qué me está costando eso?',
      nota: 'No se pueden aprender idiomas ni temas nuevos escuchando audios dormido: el sueño consolida lo que aprendiste despierto, no mete información nueva compleja. Y el libro popular "Por qué dormimos" (Matthew Walker) es útil pero ha sido criticado por exagerar algunos datos: el mensaje general (el sueño importa para la memoria) sí está bien respaldado.',
      recordar: [
        ['¿Qué hace el cerebro con lo aprendido durante el sueño profundo?', 'Lo reproduce y lo pasa del hipocampo a la corteza, donde queda más estable (consolidación).'],
        ['¿Qué encontraron Yoo y colegas (2007)?', 'Una noche sin dormir antes de aprender reduce mucho la capacidad de formar recuerdos nuevos.'],
        ['¿Por qué trasnochar para estudiar sale caro dos veces?', 'Quitas el sueño que fija lo del día y llegas peor a aprender lo del día siguiente.'],
        ['¿Se pueden aprender idiomas escuchando audios dormido?', 'No: el sueño consolida lo aprendido despierto, no mete información nueva compleja.'],
      ],
      tarjetas: [
        ['¿Qué es la consolidación de la memoria?', 'El proceso, en buena parte durante el sueño, en que un recuerdo nuevo y frágil se vuelve estable y duradero.'],
        ['Sueño ANTES de aprender', 'Dormir mal la noche anterior reduce la capacidad de formar recuerdos nuevos (Yoo y colegas, 2007).'],
        ['¿Cuándo conviene repasar lo más importante?', 'En la tarde o noche, antes de dormir bien.'],
      ],
    }),
    l('Tu sistema de estudio', 12, {
      idea: 'Las técnicas que funcionan se sienten más difíciles: esas son las dificultades deseables. Un buen sistema las vuelve hábito y deja de lado los mitos.',
      bloques: [
        ['Dificultades deseables', [
          'Robert y Elizabeth Bjork llaman así a lo que hace el estudio más lento y costoso en el momento pero mejora el aprendizaje: recordar en vez de releer, espaciar en vez de embutir, intercalar en vez de bloquear.',
          'Por eso juzgar el estudio por cómo se siente engaña. Júzgalo por lo que recuerdas días después.',
          'No toda dificultad sirve: un texto mal escrito o un tema para el que no tienes bases es difícil sin ser deseable.',
        ]],
        ['Mitos que conviene soltar', [
          'Estilos de aprendizaje ("soy visual", "soy auditivo"): Pashler y colegas (2008) no encontraron evidencia de que enseñar según el estilo de cada persona mejore el aprendizaje. Lo que sí importa es el formato que pide el contenido (un mapa se aprende viéndolo, un idioma oyéndolo).',
          '"Solo usamos el 10 % del cerebro": falso. Las imágenes del cerebro muestran actividad en todas sus partes.',
          'Hacer varias cosas a la vez: lo que hacemos es saltar entre tareas, y cada salto cuesta.',
          'Hemisferio izquierdo lógico y derecho creativo como "tipos de persona": es una simplificación sin base.',
        ]],
        ['El sistema, en una sesión', [
          '1. Antes: celular lejos, cronómetro de estudio en marcha y una meta concreta ("terminar la lección 9").',
          '2. Repasos primero: las tarjetas que tocan hoy.',
          '3. Lección nueva: lee buscando entender, preguntando por qué y con ejemplos tuyos.',
          '4. Cierra y recuerda: responde sin mirar, revisa y corrige.',
          '5. Practica algo concreto y escribe la pregunta del diario.',
          '6. Pocos minutos todos los días le ganan a muchas horas de vez en cuando.',
        ]],
      ],
      ejemplos: [
        'Con 15 minutos al día: 5 minutos de repasos y una lección de 10. En un mes son 7,5 horas de estudio de calidad, con todo lo visto repasado varias veces.',
        'Alguien que dice "soy visual" y solo ve videos aprende menos que si combina ver el video con cerrar y explicar lo que vio.',
      ],
      practica: [
        'Escribe tu sistema en una frase: cuándo estudias, cuántos minutos y en qué orden (repasos, lección, recordar).',
        'Ajusta en esta pantalla tus minutos de estudio al día a algo que puedas cumplir siempre, aunque sea poco.',
        'Elige el tema de tu proyecto final.',
      ],
      pregunta: '¿Qué mito sobre aprender creía y qué voy a hacer distinto ahora?',
      nota: 'El curso de Barbara Oakley y Terrence Sejnowski "Aprendiendo a aprender" (Coursera) y su libro "Abre tu mente a los números" popularizaron los "modos enfocado y difuso" del pensamiento y la técnica Pomodoro. Son metáforas útiles para organizarte, pero no son hallazgos neurocientíficos medidos como el efecto de recordar o de espaciar.',
      recordar: [
        ['¿Qué son las dificultades deseables?', 'Lo que hace el estudio más lento y costoso en el momento pero mejora el aprendizaje: recordar, espaciar, intercalar.'],
        ['¿Qué concluyeron Pashler y colegas (2008) sobre los estilos de aprendizaje?', 'Que no hay evidencia de que enseñar según el "estilo" de cada persona mejore el aprendizaje.'],
        ['¿Cómo hay que juzgar si una forma de estudiar funciona?', 'Por lo que recuerdas días después, no por lo fácil o agradable que se siente.'],
        ['Di los pasos de una sesión de estudio del sistema.', 'Preparar (sin celular, cronómetro, meta), repasos primero, lección nueva entendiendo, cerrar y recordar, practicar y escribir el diario.'],
        ['¿Toda dificultad es deseable?', 'No: un texto mal escrito o un tema sin bases es difícil sin enseñar más.'],
      ],
      tarjetas: [
        ['¿Qué son las dificultades deseables (Bjork)?', 'Condiciones que hacen el estudio más difícil en el momento pero mejoran el aprendizaje a largo plazo: recordar, espaciar, intercalar.'],
        ['¿Tienen base los estilos de aprendizaje?', 'No: no hay evidencia de que adaptar la enseñanza al "estilo" de cada persona mejore el aprendizaje (Pashler y colegas, 2008).'],
        ['El orden de una sesión', 'Repasos → lección nueva → recordar sin mirar → práctica y diario.'],
      ],
    }),
  ],
};

export default {
  id: 'aprender-a-aprender',
  nombre: 'Aprender a aprender',
  area: 'aprender',
  icono: '🧠',
  nivel: 'Básico',
  paraQue: 'Aprender cualquier cosa en menos tiempo y que se quede: las técnicas de estudio con mejor evidencia, cómo usarlas y los mitos que conviene soltar. Es la base para estudiar los demás cursos.',
  modulos: [RECORDAR, CUANDO, CEREBRO],
  proyecto: {
    titulo: 'Dos semanas de estudio con método',
    intro: 'Escoge algo que de verdad quieras aprender (un tema del trabajo, un idioma, las reglas de un deporte, un capítulo de finanzas) y apréndelo durante 14 días con lo que viste en el curso.',
    pasos: [
      'Elige el tema y escribe qué quieres poder hacer o explicar al final de las dos semanas.',
      'Haz una pre-prueba: escribe sin mirar todo lo que ya sabes del tema.',
      'Divídelo en partes de unos 10 minutos y haz tus tarjetas o preguntas de cada parte.',
      'Estudia con el sistema: repasos primero, parte nueva, recordar sin mirar y revisar.',
      'Espacia: vuelve a cada parte al día siguiente, a los 3 días y a la semana.',
      'Intercala: en la segunda semana mezcla preguntas de todas las partes.',
      'Al día 14, sin mirar, explica el tema completo en voz alta o por escrito y compáralo con la pre-prueba.',
      'Escribe qué funcionó, qué no y qué mantienes para el próximo curso.',
    ],
  },
};
