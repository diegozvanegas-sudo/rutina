// Numerología: historia de las ideas. Cada lección separa "Qué dice la tradición" de "Qué muestra la evidencia".
// Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const ORIGENES = {
  titulo: 'Los números sagrados en la historia',
  objetivo: 'Conocer de dónde viene la idea de que los números tienen un significado oculto: los pitagóricos, la gematría de las letras-número y el simbolismo de números en distintas culturas.',
  fuentes: [
    ['Burkert, W. (1972). Lore and Science in Ancient Pythagoreanism. Harvard University Press.', 'Lo que se sabe (y lo que no) de Pitágoras y los pitagóricos.'],
    ['Riedweg, C. (2005). Pythagoras: His life, teaching, and influence. Cornell University Press.', 'Biografía crítica de Pitágoras.'],
    ['Dudley, U. (1997). Numerology: Or what Pythagoras wrought. Mathematical Association of America.', 'Historia y crítica de la numerología, escrita por un matemático.'],
    ['Phillips, D. P. et al. (2001). The Hound of the Baskervilles effect: Natural experiment on the influence of psychological stress on timing of death. BMJ, 323(7327), 1443-1446.', 'El número 4 y las muertes cardiacas en personas de origen chino y japonés.'],
    ['Smith, G. (2002). Scared to death? BMJ, 325(7378), 1442-1443.', 'Crítica estadística al estudio anterior.'],
    ['Scanlon, T. J., Luben, R. N., Scanlon, F. L. y Singleton, N. (1993). Is Friday the 13th bad for your health? BMJ, 307(6919), 1584-1586.', 'Un estudio pequeño, en tono medio en broma, sobre el viernes 13.'],
  ],
  lecciones: [
    l('Pitágoras: "todo es número"', 10, {
      idea: 'Pitágoras y sus seguidores, en la Grecia del siglo VI a. C., creían que los números eran la base de la realidad. Descubrieron relaciones matemáticas reales en la música, y a la vez les dieron a los números significados místicos.',
      bloques: [
        ['Los pitagóricos', [
          'Pitágoras de Samos fundó en el sur de Italia una comunidad con reglas de vida, secretos y creencias religiosas, como la reencarnación.',
          'Sus seguidores descubrieron que los intervalos musicales armoniosos corresponden a proporciones simples entre números enteros (por ejemplo, 2:1 para la octava).',
          'De ahí sacaron una idea poderosa: el universo está ordenado por números.',
        ]],
        ['Qué dice la tradición', [
          'Que "todo es número": los números son la esencia de las cosas.',
          'Que cada número tiene un carácter: el 1 es la unidad y el origen, el 2 lo femenino, el 3 lo masculino, el 10 el número perfecto.',
          'La numerología moderna dice heredar esta sabiduría pitagórica.',
        ]],
        ['Qué muestra la evidencia', [
          'Walter Burkert (1972) y Christoph Riedweg (2005) muestran que sabemos muy poco de Pitágoras mismo: no dejó escritos, y mucho de lo que se le atribuye lo escribieron seguidores siglos después.',
          'Las relaciones musicales que descubrieron son reales y están en la base de la física del sonido.',
          'Pero los significados místicos de los números eran creencias religiosas, sin relación con la matemática que sí funciona. Incluso el famoso teorema de Pitágoras ya lo conocían los babilonios siglos antes.',
        ]],
      ],
      ejemplos: [
        'Cuando una guitarra suena "afinada", hay proporciones exactas entre las frecuencias de sus cuerdas. Ese descubrimiento pitagórico es ciencia real.',
        'Cuando una página de numerología dice que "tu número es el 7 porque eres espiritual, como enseñaba Pitágoras", mezcla un nombre famoso con una práctica que se inventó en su forma actual mucho después.',
      ],
      practica: [
        'Si tienes una guitarra o un instrumento cerca, toca una cuerda al aire y luego presionando en la mitad: suena la misma nota una octava más aguda (proporción 2:1).',
        'Escribe la diferencia entre el descubrimiento musical de los pitagóricos y su creencia en el carácter de los números.',
        'Anota qué sabías de numerología antes de empezar el curso, y si alguna vez calculaste tu "número".',
      ],
      pregunta: '¿Por qué nos atrae tanto la idea de que el universo tiene un orden numérico oculto?',
      nota: 'Se repite que "Pitágoras inventó la numerología". La numerología moderna (calcular números a partir del nombre y la fecha de nacimiento para conocer la personalidad) se desarrolló sobre todo en el siglo XX, en Estados Unidos; usa el nombre de Pitágoras como respaldo, pero no hay una línea directa documentada desde los pitagóricos. Este curso estudia estas ideas como historia, con respeto, sin darlas por ciertas.',
      recordar: [
        ['¿Qué descubrieron los pitagóricos en la música?', 'Que los intervalos armoniosos corresponden a proporciones simples entre números enteros.'],
        ['¿Qué significa "todo es número"?', 'La creencia pitagórica de que los números son la esencia de la realidad.'],
        ['¿Cuánto sabemos de Pitágoras mismo?', 'Muy poco: no dejó escritos y mucho se lo atribuyeron después.'],
        ['¿Inventó Pitágoras la numerología moderna?', 'No: la numerología moderna se desarrolló sobre todo en el siglo XX.'],
      ],
      tarjetas: [
        ['Pitagóricos y la música', 'Los intervalos armoniosos son proporciones simples (octava 2:1). Ciencia real.'],
        ['"Todo es número"', 'Creencia religiosa pitagórica: los números tendrían carácter y esencia. Sin respaldo científico.'],
        ['Pitágoras y la numerología moderna', 'No hay línea directa: la numerología actual es del siglo XX.'],
      ],
    }),
    l('Letras que son números: la gematría', 10, {
      idea: 'En hebreo, griego y otros alfabetos antiguos, las letras también servían como números. Eso permitió sumar el valor de las palabras y buscar significados ocultos, una práctica llamada gematría.',
      bloques: [
        ['Cuando las letras eran números', [
          'Antes de que se difundieran los números arábigos, muchos pueblos usaban las letras de su alfabeto para escribir cantidades.',
          'En hebreo, alef valía 1, bet 2, y así sucesivamente; en griego, alfa 1, beta 2.',
          'Por eso cada palabra tenía un valor numérico: la suma de sus letras.',
        ]],
        ['Qué dice la tradición', [
          'La gematría judía, desarrollada en la cábala, busca relaciones entre palabras con el mismo valor numérico como forma de interpretar textos sagrados.',
          'En el Apocalipsis, el número de la bestia, 666, se presenta como "número de un hombre".',
          'Hoy hay quienes calculan el valor de nombres y palabras para encontrar mensajes ocultos o predicciones.',
        ]],
        ['Qué muestra la evidencia', [
          'Muchos historiadores interpretan el 666 como la suma de las letras de "Nerón César" escrito en hebreo, una forma cifrada de criticar al emperador que perseguía a los cristianos.',
          'Algunos manuscritos antiguos dicen 616, que coincide con otra forma de escribir ese nombre: esto apoya la hipótesis de Nerón.',
          'Underwood Dudley (1997) muestra que con suficientes palabras y reglas siempre se encuentran coincidencias numéricas: no prueban un mensaje oculto.',
        ]],
      ],
      ejemplos: [
        'Alguien calcula que el nombre de un político "suma 666" con cierta tabla de valores. Dudley muestra que, cambiando un poco las reglas, casi cualquier nombre puede dar 666. La coincidencia dice más de las reglas escogidas que de la persona.',
        'Los números romanos (I, V, X, L, C) son un ejemplo que todavía vemos en relojes y capítulos de libros de cómo las letras sirvieron como números.',
      ],
      practica: [
        'Escribe tu nombre y súmale a cada letra su posición en el alfabeto (A=1, B=2…). Luego cambia la regla (por ejemplo, reiniciando en 1 cada 9 letras) y mira cómo cambia el resultado.',
        'Busca por qué muchos historiadores relacionan el 666 con Nerón.',
        'Escribe por qué, con suficientes reglas, siempre aparecen coincidencias.',
      ],
      pregunta: '¿Alguna vez una coincidencia numérica me pareció una señal? ¿Qué otra explicación podría tener?',
      nota: 'La gematría tiene un lugar importante en la tradición judía como método de interpretación religiosa, con reglas propias; no es lo mismo que la numerología comercial. Lo que no tiene respaldo es usarla para predecir el futuro o "descubrir" mensajes que prueben algo. El problema es estadístico: hay tantas formas de sumar y comparar que las coincidencias son inevitables.',
      recordar: [
        ['¿Qué es la gematría?', 'Asignar valores numéricos a las letras y buscar relaciones entre palabras con el mismo valor.'],
        ['¿Por qué las letras tenían valor numérico?', 'Porque muchos alfabetos antiguos se usaban para escribir cantidades.'],
        ['¿Con quién relacionan muchos historiadores el 666?', 'Con el emperador Nerón, por la suma de su nombre escrito en hebreo.'],
        ['¿Qué mostró Dudley sobre las coincidencias numéricas?', 'Que con suficientes palabras y reglas siempre se encuentran coincidencias.'],
      ],
      tarjetas: [
        ['Gematría', 'Letras con valor numérico; en la cábala, método para interpretar textos sagrados.'],
        ['666 y Nerón', 'Muchos historiadores lo leen como "Nerón César" en hebreo; algunos manuscritos dicen 616.'],
        ['Siempre hay coincidencias', 'Con suficientes reglas, cualquier nombre puede "sumar" lo que uno busca (Dudley).'],
      ],
    }),
    l('Números de suerte y de mala suerte', 10, {
      idea: 'Cada cultura tiene números con fama: el 7 de la suerte, el 13 de la mala suerte, el 4 que en China suena como "muerte". Esas creencias tienen efectos reales en la conducta, aunque los números en sí no tengan poder.',
      bloques: [
        ['Números con fama', [
          'El 7 aparece en muchas tradiciones: los días de la semana, los planetas visibles para los antiguos, los pecados capitales.',
          'El 13 se asocia con mala suerte en Occidente; muchos edificios no tienen piso 13.',
          'En China y Japón, el 4 se pronuncia parecido a la palabra "muerte", y muchos edificios evitan ese piso.',
        ]],
        ['Qué dice la tradición', [
          'Que ciertos números traen suerte o desgracia por sí mismos.',
          'Que el viernes 13 o el martes 13 (en la tradición hispana) son días peligrosos.',
          'Que escoger los números correctos (para la lotería, una fecha, una dirección) cambia lo que pasa.',
        ]],
        ['Qué muestra la evidencia', [
          'Un estudio británico de 1993 (Scanlon y otros) reportó más ingresos hospitalarios por accidentes de tránsito un viernes 13, pero era pequeño, se escribió en tono medio en broma y no tiene peso como prueba.',
          'Phillips y otros (2001) encontraron más muertes cardiacas el día 4 del mes entre personas de origen chino y japonés en Estados Unidos, y lo atribuyeron al estrés; Gary Smith (2002) criticó el análisis estadístico y no encontró el efecto con otros datos.',
          'Lo que sí es real es el efecto de la creencia en la conducta: la gente evita fechas, pisos y números, lo que tiene costos y consecuencias, aunque el número no tenga poder.',
        ]],
      ],
      ejemplos: [
        'Un constructor en Medellín se salta el piso 13 en un edificio porque los compradores no lo quieren. El número no tiene poder, pero la creencia de los compradores sí tiene un efecto económico real.',
        'Alguien no se casa ni viaja un martes 13 "por si acaso". No pasa nada malo por evitarlo, pero si eso lo lleva a pagar más por un tiquete o a perder una oportunidad, la superstición sí le cuesta.',
      ],
      practica: [
        'Escribe qué números o fechas consideras de buena o mala suerte, y de dónde viene esa idea.',
        'Busca un edificio de tu ciudad sin piso 13 o una costumbre local sobre números.',
        'Durante una semana, nota si tomas alguna decisión por un número "de suerte" y qué te cuesta.',
      ],
      pregunta: '¿Qué superstición con números tengo, y cuánto me cuesta mantenerla?',
      nota: 'Estudios como el del viernes 13 o el del número 4 se citan mucho en medios como "prueba" de que los números influyen. Al revisarlos, resultan pequeños, discutidos o no replicados. Lo que sí está documentado es que las creencias cambian la conducta. Ojo con la diferencia: "el número 13 es peligroso" no es lo mismo que "la gente que cree que el 13 es peligroso se comporta distinto".',
      recordar: [
        ['¿Por qué el 4 se considera de mala suerte en China y Japón?', 'Porque se pronuncia parecido a la palabra "muerte".'],
        ['¿Qué encontró Scanlon sobre el viernes 13?', 'Más ingresos por accidentes, pero en un estudio pequeño y medio en broma, sin peso como prueba.'],
        ['¿Qué criticó Gary Smith del estudio del número 4?', 'El análisis estadístico; no encontró el efecto con otros datos.'],
        ['¿Qué efecto sí es real de las supersticiones con números?', 'El efecto de la creencia en la conducta y sus costos.'],
      ],
      tarjetas: [
        ['Números con fama', '7 de suerte, 13 de mala suerte en Occidente, 4 en China y Japón por sonar como "muerte".'],
        ['Estudios del 13 y el 4', 'Pequeños, discutidos o no replicados; no prueban que los números tengan poder.'],
        ['La creencia sí actúa', 'El número no tiene poder; la creencia cambia la conducta (pisos, fechas, precios).'],
      ],
    }),
  ],
};

const MODERNA = {
  titulo: 'La numerología moderna',
  objetivo: 'Saber cómo funciona la numerología actual (el número del camino de vida, el del nombre), de dónde salió y por qué sus lecturas parecen tan acertadas aunque no tengan base.',
  fuentes: [
    ['Dudley, U. (1997). Numerology: Or what Pythagoras wrought. Mathematical Association of America.', 'Historia de la numerología moderna y sus métodos.'],
    ['Forer, B. R. (1949). The fallacy of personal validation: A classroom demonstration of gullibility. Journal of Abnormal and Social Psychology, 44(1), 118-123.', 'El efecto Forer (o Barnum): descripciones vagas que parecen personales.'],
    ['Diaconis, P. y Mosteller, F. (1989). Methods for studying coincidences. Journal of the American Statistical Association, 84(408), 853-861.', 'Por qué las coincidencias son mucho más comunes de lo que creemos.'],
    ['McKay, B., Bar-Natan, D., Bar-Hillel, M. y Kalai, G. (1999). Solving the Bible code puzzle. Statistical Science, 14(2), 150-173.', 'El "código de la Biblia" y los mensajes "ocultos" en Moby Dick.'],
    ['Nickerson, R. S. (1998). Confirmation bias: A ubiquitous phenomenon in many guises. Review of General Psychology, 2(2), 175-220.', 'El sesgo de confirmación.'],
  ],
  lecciones: [
    l('Cómo funciona la numerología actual', 10, {
      idea: 'La numerología moderna convierte tu fecha de nacimiento y las letras de tu nombre en números del 1 al 9 (más algunos "maestros" como 11 y 22), y les asigna rasgos de personalidad y destino.',
      bloques: [
        ['El método', [
          'El "número del camino de vida" se calcula sumando los dígitos de la fecha de nacimiento hasta llegar a un solo dígito (por ejemplo, 15 de marzo de 1990: 1+5+3+1+9+9+0 = 28, 2+8 = 10, 1+0 = 1).',
          'El "número del nombre" se calcula asignando a cada letra un valor del 1 al 9 (A=1, B=2… I=9, J=1…) y sumando.',
          'Los números 11, 22 y 33 se suelen considerar "maestros" y no se reducen.',
        ]],
        ['Qué dice la tradición', [
          'Que cada número tiene una vibración y un carácter: el 1 es líder, el 2 cooperador, el 7 espiritual y analítico, el 8 ligado al dinero y el poder.',
          'Que tu fecha y tu nombre revelan tu personalidad, tus talentos y tu propósito.',
          'Que cambiar la escritura de tu nombre puede cambiar tu energía o tu suerte.',
        ]],
        ['Qué muestra la evidencia', [
          'Underwood Dudley (1997) muestra que la numerología moderna toma forma a comienzos del siglo XX en Estados Unidos, con autores como L. Dow Balliett, y luego se difundió en libros de autoayuda.',
          'El sistema depende de decisiones arbitrarias: el alfabeto inglés, la tabla A=1…I=9, sumar dígitos en base 10. Con otro alfabeto u otra base, el "número" cambia.',
          'No hay estudios que muestren que el número calculado prediga la personalidad o el destino.',
        ]],
      ],
      ejemplos: [
        'Calculas tu número del camino de vida y te sale 1: "líder, independiente". Tu amigo, con otra fecha, saca 6: "protector, familiar". Pero si usaran un calendario distinto (como el chino o el hebreo), sus números serían otros.',
        'Una persona cambia la forma de escribir su nombre en redes (agregando una letra) porque una numeróloga le dijo que así "atraería abundancia". No hay ninguna evidencia de que una letra cambie el destino.',
      ],
      practica: [
        'Calcula tu "número del camino de vida" con el método de la lección.',
        'Busca la descripción de tu número en dos páginas de numerología distintas y compara si dicen lo mismo.',
        'Escribe qué decisiones arbitrarias tiene el sistema (alfabeto, tabla, base 10).',
      ],
      pregunta: '¿Qué siento cuando leo la descripción de "mi número"? ¿Por qué?',
      nota: 'Probar la numerología de forma científica es difícil justamente porque sus descripciones son vagas y positivas: casi cualquiera se reconoce en ellas. Por eso hay pocos estudios formales sobre la numerología en sí. Pero los mecanismos que la hacen parecer acertada (efecto Forer, sesgo de confirmación) sí están muy bien estudiados, y los verás en las siguientes lecciones.',
      recordar: [
        ['¿Cómo se calcula el "número del camino de vida"?', 'Sumando los dígitos de la fecha de nacimiento hasta llegar a un solo dígito.'],
        ['¿Qué son los "números maestros"?', 'Los números 11, 22 y 33, que no se reducen.'],
        ['¿Cuándo y dónde toma forma la numerología moderna según Dudley?', 'A comienzos del siglo XX, en Estados Unidos.'],
        ['¿Por qué se dice que el sistema es arbitrario?', 'Porque depende del alfabeto, la tabla de valores y la base 10; con otros, el número cambia.'],
      ],
      tarjetas: [
        ['Número del camino de vida', 'Sumar los dígitos de la fecha de nacimiento hasta un dígito (salvo 11, 22, 33).'],
        ['Numerología moderna', 'Toma forma a comienzos del siglo XX en Estados Unidos (Dudley).'],
        ['Sistema arbitrario', 'Otro alfabeto, otra tabla u otra base dan otro número.'],
      ],
    }),
    l('Por qué parece acertar: el efecto Forer', 10, {
      idea: 'Las descripciones de la numerología, el horóscopo o los test de personalidad de revista parecen hechas para ti porque usan frases que le sirven a casi todo el mundo. Es el efecto Forer.',
      bloques: [
        ['El experimento de Forer', [
          'En 1948, el psicólogo Bertram Forer les hizo a sus estudiantes un "test de personalidad" y les entregó a cada uno una descripción "personalizada".',
          'Los estudiantes calificaron la descripción como muy acertada, en promedio con más de 4 sobre 5.',
          'En realidad, todos recibieron exactamente el mismo texto, armado con frases de horóscopos (Forer, 1949).',
        ]],
        ['Qué dice la tradición', [
          'Que la lectura numerológica describe con precisión tu personalidad única.',
          'Que si te reconoces en la descripción es porque el número es correcto.',
          'Que la numeróloga "te leyó" sin conocerte.',
        ]],
        ['Qué muestra la evidencia', [
          'El efecto Forer (también llamado efecto Barnum) se ha replicado muchas veces: aceptamos como personales descripciones vagas, positivas y que aplican a casi todos.',
          'Frases como "a veces eres sociable y otras prefieres estar solo" o "tienes un gran potencial que no has aprovechado" le sirven a casi cualquiera.',
          'Funciona mejor cuando creemos que la descripción es solo para nosotros y viene de una fuente con autoridad.',
        ]],
      ],
      ejemplos: [
        'Lees que las personas con número 7 "buscan la verdad, a veces se sienten incomprendidas y necesitan momentos de soledad". Casi todo el mundo se reconoce en eso, tenga el número que tenga.',
        'En una reunión, alguien hace la lectura numerológica de todos y cada uno se sorprende de lo acertada que es. Si se intercambiaran las lecturas sin decirlo, probablemente también les parecerían acertadas.',
      ],
      practica: [
        'Lee la descripción de un número que NO es el tuyo y anota cuántas frases también te describen.',
        'Haz la prueba con dos amigos: léeles la descripción de un número cualquiera diciendo que es el suyo y pregúntales qué tan acertada les parece.',
        'Escribe tres frases vagas que le sirvan a casi cualquier persona.',
      ],
      pregunta: '¿En qué otros lugares (horóscopos, test de redes, "lecturas") me he sentido descrito por frases que le sirven a todos?',
      nota: 'El efecto Forer no significa que quien hace la lectura esté engañando a propósito: muchas veces también cree en ella. Y reconocerse en una descripción puede ser una experiencia agradable o útil para reflexionar. El problema aparece cuando se toman decisiones importantes (de pareja, trabajo o plata) basadas en esas lecturas, o cuando se paga mucho dinero por ellas.',
      recordar: [
        ['¿Qué hizo Forer en su experimento?', 'Les dio a todos sus estudiantes la misma descripción "personalizada", y la calificaron como muy acertada.'],
        ['¿De dónde sacó Forer las frases?', 'De horóscopos.'],
        ['¿Qué es el efecto Forer o Barnum?', 'Aceptar como personales descripciones vagas que aplican a casi todos.'],
        ['¿Cuándo funciona mejor?', 'Cuando creemos que la descripción es solo para nosotros y viene de una fuente con autoridad.'],
      ],
      tarjetas: [
        ['Efecto Forer (1949)', 'Todos recibieron la misma descripción "personal" y la calificaron como muy acertada.'],
        ['Frases que sirven a todos', '"A veces sociable, a veces solitario", "potencial sin aprovechar": aplican a casi cualquiera.'],
        ['Prueba casera', 'Lee la descripción de otro número: probablemente también te describa.'],
      ],
    }),
    l('Coincidencias y mensajes ocultos', 11, {
      idea: 'Ver el 11:11 en el reloj, encontrar fechas que "coinciden" o mensajes escondidos en un libro parece significativo. Pero las coincidencias son mucho más comunes de lo que intuimos, y la mente es experta en encontrar patrones.',
      bloques: [
        ['La ley de los números muy grandes', [
          'Los estadísticos Persi Diaconis y Frederick Mosteller (1989) explicaron que, con suficientes oportunidades, hasta lo más raro termina pasando.',
          'Si algo tiene una probabilidad de uno en un millón por persona y día, en un país de 50 millones de personas pasará decenas de veces cada día.',
          'Lo que nos parece "imposible" a nosotros es casi seguro que le pase a alguien.',
        ]],
        ['Qué dice la tradición', [
          'Que ver números repetidos (11:11, 333, 777) es una señal del universo o de los ángeles.',
          'Que las fechas importantes de tu vida tienen números en común que revelan un plan.',
          'Que en los textos sagrados hay códigos numéricos ocultos que predicen el futuro.',
        ]],
        ['Qué muestra la evidencia', [
          'Notamos el 11:11 porque es llamativo; no registramos las veces que miramos el reloj a las 11:14 o a las 3:27. Es el sesgo de confirmación (Nickerson, 1998).',
          'En los años 90 se hizo famoso el "código de la Biblia", que encontraba predicciones ocultas en el texto hebreo. McKay y otros (1999) mostraron que con el mismo método se encontraban "predicciones" en Moby Dick y en otros libros.',
          'La mente humana está hecha para detectar patrones (lo que a veces se llama apofenia); eso nos sirve para sobrevivir, pero también nos hace ver patrones donde solo hay azar.',
        ]],
      ],
      ejemplos: [
        'Durante una semana ves el 11:11 tres veces y sientes que es una señal. No contaste las decenas de veces que miraste el reloj y vio otra hora. Si anotaras todas, verías que el 11:11 aparece más o menos lo que se esperaría por azar.',
        'Descubres que tu cumpleaños, el de tu mamá y la fecha en que conociste a tu pareja suman el mismo número. Con tantas fechas y formas de sumar, siempre se encuentra alguna coincidencia.',
      ],
      practica: [
        'Durante tres días, anota todas las veces que mires la hora, no solo cuando sea un número "especial".',
        'Calcula: si hay un 1 en 1.440 de que el reloj marque exactamente las 11:11 al mirarlo, ¿cuántas veces al año te pasaría si miras el reloj 30 veces al día?',
        'Escribe una coincidencia que te haya impresionado y busca cuántas oportunidades había de que pasara algo así.',
      ],
      pregunta: '¿Qué coincidencia de mi vida he interpretado como una señal? ¿Cambia algo si la veo como azar?',
      nota: 'Decir que una coincidencia es azar no le quita el valor emocional que pueda tener para ti: puede ser un recordatorio bonito o un momento de reflexión. El problema es usarla como prueba de algo o tomar decisiones importantes por ella. Si sientes que los números o las señales controlan tus decisiones y te generan ansiedad, puede valer la pena hablarlo con un profesional.',
      recordar: [
        ['¿Qué explicaron Diaconis y Mosteller sobre las coincidencias?', 'Que con suficientes oportunidades, hasta lo más raro termina pasando.'],
        ['¿Por qué notamos el 11:11 y no el 11:14?', 'Por el sesgo de confirmación: registramos lo llamativo y olvidamos lo demás.'],
        ['¿Qué mostraron McKay y otros sobre el código de la Biblia?', 'Que con el mismo método se encontraban "predicciones" en Moby Dick y otros libros.'],
        ['¿Qué es la apofenia?', 'La tendencia a ver patrones o significados donde solo hay azar.'],
      ],
      tarjetas: [
        ['Números muy grandes (Diaconis y Mosteller)', 'Con suficientes oportunidades, lo rarísimo pasa todos los días a alguien.'],
        ['El 11:11', 'Lo notas por llamativo; no cuentas las veces que viste otras horas.'],
        ['Código de la Biblia', 'El mismo método encontró "predicciones" en Moby Dick: es el método, no el texto.'],
      ],
    }),
  ],
};

const REAL = {
  titulo: 'Los números de verdad',
  objetivo: 'Ver cómo los números influyen en nuestras decisiones (lotería, precios, amuletos), qué pasa cuando se ponen a prueba las supersticiones y la belleza real de las matemáticas.',
  fuentes: [
    ['Thomas, M. y Morwitz, V. (2005). Penny wise and pound foolish: The left-digit effect in price cognition. Journal of Consumer Research, 32(1), 54-64.', 'Por qué 9.990 parece mucho más barato que 10.000.'],
    ['Damisch, L., Stoberock, B. y Mussweiler, T. (2010). Keep your fingers crossed! How superstition improves performance. Psychological Science, 21(7), 1014-1020.', 'Estudio que dijo que los amuletos mejoraban el desempeño.'],
    ['Calin-Jageman, R. J. y Caldwell, T. L. (2014). Replication of the superstition and performance study by Damisch, Stoberock, and Mussweiler (2010). Social Psychology, 45(3), 239-245.', 'La réplica que no encontró el efecto.'],
    ['du Sautoy, M. (2003). The Music of the Primes. HarperCollins. (En español: La música de los números primos, Acantilado).', 'La belleza y el misterio real de los números primos.'],
    ['Dudley, U. (1997). Numerology: Or what Pythagoras wrought. Mathematical Association of America.', 'Por qué la numerología no resiste el análisis.'],
  ],
  lecciones: [
    l('Lotería, números de la suerte y azar', 10, {
      idea: 'En la lotería y el chance, ningún número tiene más probabilidad que otro. Escoger fechas especiales no te ayuda a ganar; incluso puede hacer que, si ganas, compartas el premio con más gente.',
      bloques: [
        ['Cómo funciona el azar', [
          'En un sorteo justo, cada combinación tiene exactamente la misma probabilidad de salir.',
          'Los números que salieron la semana pasada no tienen más ni menos probabilidad esta semana: cada sorteo es independiente (la falacia del jugador, del curso de Sesgos cognitivos).',
          'La combinación 1-2-3-4-5-6 tiene la misma probabilidad que cualquier otra, aunque parezca imposible.',
        ]],
        ['Qué dice la tradición', [
          'Que hay números de la suerte personales (por fecha de nacimiento o numerología) que aumentan la probabilidad de ganar.',
          'Que los sueños se pueden traducir a números para jugar (la "tabla de los sueños" del chance).',
          'Que ciertos números "están por salir" porque no han salido en mucho tiempo.',
        ]],
        ['Qué muestra la evidencia', [
          'Ningún método numerológico ni de sueños cambia la probabilidad de un sorteo justo.',
          'Mucha gente juega fechas de cumpleaños, así que los números del 1 al 31 son más jugados: si salen y ganas, es más probable que compartas el premio.',
          'Las loterías están diseñadas para que, en promedio, el jugador pierda (lo viste en Educación financiera): el valor esperado es negativo.',
        ]],
      ],
      ejemplos: [
        'Tu tío juega en el chance el número que soñó con la "tabla de los sueños": soñó con un perro y jugó el 08. Tiene la misma probabilidad que si hubiera jugado cualquier otro número.',
        'Una persona juega cada semana la fecha de nacimiento de sus hijos "porque le van a dar suerte". No aumenta su probabilidad, y si gana, como muchos juegan fechas, puede tener que repartir el premio.',
      ],
      practica: [
        'Calcula cuánto has gastado (o gasta alguien de tu familia) en lotería o chance en el último año.',
        'Escribe por qué la combinación 1-2-3-4-5-6 tiene la misma probabilidad que cualquier otra.',
        'Si juegas, decide un tope mensual y regístralo en 💰 Finanzas como gasto de ocio, no como inversión.',
      ],
      pregunta: '¿Cuánto me cuesta al año creer en números de la suerte?',
      nota: 'Jugar de vez en cuando con plata que puedes perder puede ser un entretenimiento. El problema aparece cuando se juega por necesidad, para "recuperar" pérdidas o creyendo tener un método para ganar. Si sientes que no puedes parar de apostar, es una adicción real y tratable: busca ayuda profesional.',
      recordar: [
        ['¿Tiene más probabilidad un número de la suerte en un sorteo justo?', 'No: todas las combinaciones tienen la misma probabilidad.'],
        ['¿Influye que un número no haya salido en mucho tiempo?', 'No: cada sorteo es independiente.'],
        ['¿Qué pasa si juegas fechas de cumpleaños y ganas?', 'Es más probable que compartas el premio, porque mucha gente juega números del 1 al 31.'],
        ['¿Cuál es el valor esperado de la lotería para el jugador?', 'Negativo: en promedio, pierde.'],
      ],
      tarjetas: [
        ['Azar justo', 'Todas las combinaciones tienen la misma probabilidad, incluida 1-2-3-4-5-6.'],
        ['Fechas en la lotería', 'No aumentan la probabilidad; si ganas, es más probable compartir el premio.'],
        ['Sueños y números', 'La "tabla de los sueños" no cambia la probabilidad de un sorteo.'],
      ],
    }),
    l('Cuando los números sí influyen en ti', 10, {
      idea: 'Los números no tienen poder místico, pero sí influyen en nuestras decisiones por cómo los percibimos: los precios terminados en 9, las anclas y los amuletos que creemos que nos ayudan.',
      bloques: [
        ['El efecto del dígito izquierdo', [
          'Thomas y Morwitz (2005) mostraron que la gente percibe 2,99 como bastante más barato que 3,00, aunque la diferencia sea mínima.',
          'Leemos de izquierda a derecha y el primer dígito pesa mucho en nuestra impresión.',
          'Por eso en Colombia ves precios como 19.900 o 99.990: no es magia, es psicología del consumidor.',
        ]],
        ['Qué dice la tradición', [
          'Que tener un amuleto o un número de la suerte trae buenos resultados.',
          'Que la suerte acompaña a quien cree en ella.',
          'Que ciertos números atraen la prosperidad en los negocios.',
        ]],
        ['Qué muestra la evidencia', [
          'Damisch, Stoberock y Mussweiler (2010) publicaron que tener un amuleto de la suerte mejoraba el desempeño en tareas como el golf o la memoria, al dar más confianza.',
          'Calin-Jageman y Caldwell (2014) repitieron esos experimentos con más personas y no encontraron el efecto.',
          'Lo que sí está bien documentado es que la forma en que se presentan los números (precios, porcentajes, anclas) cambia nuestras decisiones.',
        ]],
      ],
      ejemplos: [
        'Ves unos tenis a 199.900 y otros a 205.000. Los primeros "se sienten" mucho más baratos, aunque la diferencia es de 5.100 pesos. El dígito izquierdo hizo su trabajo.',
        'Un futbolista siempre juega con medias de la suerte. Si eso le da tranquilidad, no le hace daño; pero la evidencia más reciente no muestra que un amuleto mejore el rendimiento por sí mismo.',
      ],
      practica: [
        'En tu próxima compra, redondea los precios terminados en 900 o 990 hacia arriba antes de decidir.',
        'Busca en una tienda o app tres precios diseñados con el efecto del dígito izquierdo.',
        'Escribe un amuleto, ritual o número de la suerte que tengas y qué crees que hace por ti.',
      ],
      pregunta: '¿En qué compras me dejo llevar por cómo se ve un precio en lugar de por cuánto cuesta?',
      nota: 'El caso de los amuletos es un ejemplo de por qué conviene desconfiar de un solo estudio llamativo: el original se publicó en una revista prestigiosa y fue muy citado, pero no resistió la réplica. Si un ritual te da calma antes de un partido o un examen, úsalo; solo no lo confundas con preparación.',
      recordar: [
        ['¿Qué es el efecto del dígito izquierdo?', 'Percibir un precio como mucho más barato por su primer dígito, como 2,99 frente a 3,00.'],
        ['¿Qué publicaron Damisch y otros (2010)?', 'Que tener un amuleto de la suerte mejoraba el desempeño.'],
        ['¿Qué encontró la réplica de Calin-Jageman y Caldwell?', 'Que el efecto de los amuletos no aparecía.'],
        ['¿Cómo sí influyen los números en nuestras decisiones?', 'Por cómo se presentan: precios, porcentajes y anclas.'],
      ],
      tarjetas: [
        ['Dígito izquierdo (Thomas y Morwitz)', '19.900 se siente mucho más barato que 20.000. Redondea hacia arriba antes de decidir.'],
        ['Amuletos de la suerte', 'El estudio de 2010 no se replicó: no mejoran el rendimiento por sí mismos.'],
        ['El poder real de los números', 'No es místico: es cómo los percibimos (precios, anclas, porcentajes).'],
      ],
    }),
    l('La belleza real de los números', 11, {
      idea: 'Las matemáticas reales tienen misterios y bellezas más asombrosos que cualquier numerología: los números primos, la proporción en la naturaleza y las leyes que permiten construir puentes y viajar al espacio.',
      bloques: [
        ['Los números primos', [
          'Un número primo solo se puede dividir exactamente entre 1 y sí mismo: 2, 3, 5, 7, 11, 13…',
          'Euclides demostró hace más de 2.000 años que hay infinitos números primos.',
          'Marcus du Sautoy (2003) cuenta que todavía no se sabe con exactitud cómo se distribuyen: es uno de los grandes problemas abiertos de las matemáticas (la hipótesis de Riemann).',
          'Los primos protegen hoy tus transacciones: la seguridad de muchas compras por internet y apps bancarias se basa en lo difícil que es descomponer números enormes en primos.',
        ]],
        ['Qué dice la tradición', [
          'Que los números tienen significados espirituales y vibraciones que influyen en la vida.',
          'Que el universo está escrito en un lenguaje numérico secreto que solo los iniciados entienden.',
          'Que la numerología es la "ciencia sagrada" de los números.',
        ]],
        ['Qué muestra la evidencia', [
          'Galileo escribió que el libro de la naturaleza está escrito en lenguaje matemático, y la física lo ha confirmado de forma espectacular: con ecuaciones se predicen eclipses, se diseñan celulares y se envían sondas a otros planetas.',
          'Pero ese lenguaje no es secreto ni simbólico: es público, se puede aprender y se pone a prueba constantemente.',
          'La numerología usa el prestigio de las matemáticas, pero no comparte su método: no hace predicciones comprobables ni se corrige con la evidencia.',
        ]],
      ],
      ejemplos: [
        'Cada vez que pagas con Nequi o con tarjeta en internet, la seguridad se apoya en propiedades de los números primos. Es la "magia" de los números que sí funciona.',
        'Con las mismas leyes matemáticas que estudió Newton se calcula la trayectoria de un satélite de comunicaciones que permite ver un partido en vivo en Colombia.',
      ],
      practica: [
        'Escribe los números primos menores que 50.',
        'Busca qué es la hipótesis de Riemann y por qué se ofrece un premio de un millón de dólares por resolverla.',
        'Relee lo que anotaste al empezar el curso sobre la numerología y escribe qué piensas ahora.',
      ],
      pregunta: '¿Qué me fascina de los números, y cómo podría explorar las matemáticas reales con esa curiosidad?',
      nota: 'Criticar la numerología no significa despreciar la fascinación por los números: esa curiosidad es el punto de partida de las matemáticas. La diferencia está en el método: las matemáticas demuestran y la ciencia pone a prueba; la numerología interpreta sin poder ser refutada. Si te atrae este mundo, la matemática recreativa (acertijos, primos, patrones) puede darte la misma emoción con bases sólidas.',
      recordar: [
        ['¿Qué es un número primo?', 'Un número que solo se puede dividir exactamente entre 1 y sí mismo.'],
        ['¿Qué demostró Euclides sobre los primos?', 'Que hay infinitos.'],
        ['¿Para qué sirven hoy los números primos?', 'Para la seguridad de las compras por internet y las apps bancarias.'],
        ['¿Qué diferencia a las matemáticas de la numerología?', 'Las matemáticas demuestran y se ponen a prueba; la numerología interpreta sin poder ser refutada.'],
      ],
      tarjetas: [
        ['Números primos', 'Infinitos (Euclides), con una distribución todavía misteriosa (hipótesis de Riemann).'],
        ['Primos y seguridad', 'Protegen las compras por internet: descomponer números enormes en primos es muy difícil.'],
        ['Matemáticas vs. numerología', 'Las matemáticas demuestran y se ponen a prueba; la numerología solo interpreta.'],
      ],
    }),
  ],
};

export default {
  id: 'numerologia',
  nombre: 'Numerología',
  area: 'esoterico',
  icono: '🔢',
  nivel: 'Básico',
  paraQue: 'Conocer, como historia de las ideas, la creencia en el significado oculto de los números: de Pitágoras y la gematría a la numerología moderna. Entenderás por qué sus lecturas parecen acertadas, qué muestran las pruebas y la belleza real de las matemáticas. Cada lección separa lo que dice la tradición de lo que muestra la evidencia.',
  modulos: [ORIGENES, MODERNA, REAL],
  proyecto: {
    titulo: 'Pon a prueba la numerología',
    intro: 'Durante 2 semanas vas a hacer un pequeño experimento casero para ver si las descripciones numerológicas describen de verdad a las personas, y a registrar tus propias "coincidencias".',
    pasos: [
      'Calcula el número del camino de vida de 4 a 6 personas cercanas que acepten participar (con su permiso).',
      'Copia de una página de numerología la descripción de cada número, sin el número.',
      'Mezcla las descripciones y pídele a cada persona que escoja cuál la describe mejor, sin saber cuál es la suya.',
      'Anota cuántas personas escogieron la descripción de su propio número.',
      'Compara con lo que esperarías por azar (si hay 5 descripciones, más o menos 1 de cada 5 acertaría).',
      'Durante las dos semanas, anota todas las veces que mires la hora y cuántas fueron "números especiales".',
      'Escribe tus conclusiones: qué mostró el experimento y qué te enseñó sobre el efecto Forer y las coincidencias.',
    ],
  },
};
