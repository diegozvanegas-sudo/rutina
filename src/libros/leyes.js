// Las Leyes del Éxito: las 41 leyes y reglas del Seminario Fénix ampliadas, una lectura por día.
// No viene de un PDF: cada lectura explica la ley, qué la respalda (y qué no), ejemplos de la vida diaria
// (gym, fútbol, dieta, dinero, relaciones) y cómo usarla paso a paso. Mismo formato que fenix.js.
// "nota": dónde la ley está exagerada o es un mito, y qué sí está comprobado.

const d = (n, titulo, temas, datos) => ({ n, titulo, temas, formulas: [], nota: '', ...datos });

const LECTURAS = [
  d(1, 'Cómo usar las leyes (y la ley madre: Causa y Efecto)', ['causa', 'efecto', 'resultados', 'leyes', 'sistema', 'empezar'], {
    idea: 'Todo resultado tiene causas: si cambias las causas que controlas, cambias el resultado.',
    intro: 'Las "leyes" del éxito no son leyes como la gravedad: son patrones que se repiten tanto que conviene tratarlos como reglas. Algunas tienen mucha evidencia, otras son metáforas útiles. Este libro toma las 41 leyes y reglas del Seminario Fénix, las explica una por una, separa lo comprobado de lo exagerado y te da la forma concreta de usarlas. Todas nacen de la ley madre: Causa y Efecto.',
    bloques: [
      ['Qué dice la Ley de Causa y Efecto', [
        'Nada pasa por casualidad: cada efecto (tu cuerpo, tu cuenta, tus relaciones) es la suma de causas (lo que piensas, decides y haces de forma repetida).',
        'Si alguien logró lo que tú quieres, hizo cosas concretas para lograrlo. Si haces lo mismo, de forma constante, tiendes a obtener resultados parecidos.',
        'Los pensamientos son causas porque llevan a decisiones, y las decisiones llevan a acciones. Sin acción, el pensamiento no produce efecto.',
      ]],
      ['Por qué funciona', [
        'Es la base del método científico: cambias una variable, mides el resultado y aprendes.',
        'Las personas con "locus de control interno" (creen que sus actos influyen en su vida) estudian más, ahorran más, cuidan más su salud y se recuperan mejor de los golpes (Julian Rotter, 1966, y décadas de estudios después).',
        'Ojo: no todo es tuyo. Hay causas que no controlas (genética, suerte, economía). La ley es útil cuando la aplicas a lo que sí depende de ti.',
      ]],
      ['Ejemplos', [
        'Gym: si no sube tu fuerza, las causas casi siempre están en lo básico: sueño, proteína, calorías y si de verdad subes peso o reps semana a semana.',
        'Dinero: tu saldo de fin de mes es el efecto de cientos de pequeñas compras. Cambia 3 de ellas y cambia el saldo.',
        'Fútbol: si te cansas en el segundo tiempo, la causa puede ser la comida antes del partido, el sueño o la falta de cardio, no "que no sirvo".',
      ]],
      ['El sistema para usar cualquier ley (4 pasos)', [
        '1. Situación: escribe en una frase qué resultado no te gusta o qué quieres lograr.',
        '2. Ley: busca en ⚖️ Leyes cuál aplica (o pregúntale al libro en 💬 Preguntar).',
        '3. Acción con "si… entonces…": "Si llego a la casa con hambre, entonces como primero la proteína". Las intenciones así de concretas casi duplican la probabilidad de cumplir (Gollwitzer, 1999).',
        '4. Medir y ajustar: después de 1-2 semanas, mira el resultado. Si no cambió, cambia la causa, no la meta. Usa la ficha 🔬 Aplicar una ley.',
      ]],
      ['Errores comunes', [
        'Buscar UNA causa mágica: casi siempre son varias pequeñas que se suman.',
        'Confundir causa con culpa: buscar la causa sirve para cambiarla, no para castigarte.',
        'Cambiar todo a la vez: si cambias 5 cosas, no sabrás cuál funcionó. Cambia una o dos y mide.',
      ]],
    ],
    formulas: ['Pensamiento → decisión → acción repetida → resultado', 'Resultado nuevo = causa nueva + tiempo'],
    nota: 'Todas las lecturas siguen el mismo orden: qué dice la ley, qué la respalda, ejemplos, cómo usarla y errores comunes. Cuando una ley del seminario está exagerada (por ejemplo, la Atracción o los 21 días), se dice con claridad y se explica qué sí está comprobado.',
    afirmacion: 'Soy la causa principal de mis resultados y cambio lo que depende de mí.',
    practica: [
      'Elige un resultado de tu vida que no te gusta y escribe 5 posibles causas que dependen de ti.',
      'Escoge UNA causa y escribe una regla "si… entonces…" para cambiarla desde hoy.',
      'Abre la ficha 🔬 Aplicar una ley y llénala con esa situación.',
    ],
    pregunta: '¿Qué resultado de mi vida estoy culpando a la suerte cuando en realidad tiene causas que yo controlo?',
  }),

  d(2, 'Ley del Control y Ley del Accidente', ['control', 'responsabilidad', 'accidente', 'azar', 'planificar', 'victima', 'estres'], {
    idea: 'Te sientes bien en la medida en que sientes que diriges tu vida; sin plan, la vida la dirige el azar.',
    intro: 'La Ley del Control dice que tu bienestar depende de cuánto control sientes sobre tu vida. La Ley del Accidente es su contracara: no planificar es planificar el fracaso, porque lo que no decides tú lo deciden las circunstancias. Las dos juntas dicen: toma el timón de lo que sí puedes mover.',
    bloques: [
      ['Qué dicen', [
        'Control: la gente que siente que maneja su vida tiene menos estrés y más energía. La que siente que su vida la manejan otros (el jefe, la plata, el pasado) se siente ansiosa, frustrada o resignada.',
        'Accidente: sin metas ni plan, terminas donde te lleve la corriente. Los "accidentes" de la vida son, muchas veces, la falta de decisiones.',
      ]],
      ['Por qué funciona', [
        'Experimentos clásicos: con el mismo ruido molesto, las personas que tenían un botón para apagarlo (aunque no lo usaran) se estresaban mucho menos (Glass y Singer, 1972). Sentir control baja el estrés.',
        'En un asilo, los ancianos a los que se les dio responsabilidad sobre su cuarto y una planta estaban más activos y felices que los que lo tenían todo hecho (Langer y Rodin, 1976).',
        'La "indefensión aprendida" (Seligman) es lo contrario: después de muchos golpes sin control, la gente deja de intentar aunque sí pueda. Se desaprende con pequeñas victorias.',
      ]],
      ['Ejemplos', [
        'Dos personas con el mismo sueldo: una tiene presupuesto (sección Finanzas) y la otra "ve qué pasa". La primera siente control aunque gane lo mismo.',
        'Semana de fútbol miércoles y viernes: si planificas pierna y comidas alrededor de los partidos, llegas fresco. Si no, el cansancio te "pasa" por accidente.',
        'Un día de lluvia que cancela tu caminata: no controlas la lluvia, sí controlas hacer 20 minutos de lazo en la casa.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Haz dos columnas: "lo que controlo" y "lo que no". Pon toda tu energía en la primera y suelta la segunda (es la idea central del estoicismo).',
        'Planifica la semana el domingo: entrenos, comidas, dinero y una meta. Un plan de 10 minutos te quita muchos "accidentes".',
        'Cambia el lenguaje: de "tengo que" a "elijo". De "no puedo porque…" a "¿cómo puedo…?".',
        'Si te sientes sin control en algo grande, busca un área pequeña donde sí lo tengas (tu cama tendida, tu entreno) y gana ahí primero.',
      ]],
      ['Errores comunes', [
        'Querer controlar lo incontrolable (lo que piensan otros, el clima, el resultado de un partido): genera más ansiedad, no menos.',
        'Confundir planificar con rigidez: el plan es una guía; ajustarlo también es tener control.',
      ]],
    ],
    formulas: ['Bienestar ≈ sensación de control', 'Sin plan = el azar decide'],
    afirmacion: 'Dirijo mi vida: decido, planifico y suelto lo que no depende de mí.',
    practica: [
      'Escribe tu preocupación principal y divídela en "lo que controlo" y "lo que no".',
      'Planifica mañana completo esta noche: entreno, comidas, la tarea más importante.',
      'Cambia 3 veces hoy un "tengo que" por "elijo".',
    ],
    pregunta: '¿En qué área de mi vida estoy dejando que decida el azar?',
  }),

  d(3, 'Ley de la Creencia y Ley de la Expectativa', ['creencia', 'creer', 'expectativa', 'esperar', 'confianza', 'pygmalion', 'placebo', 'limitante'], {
    idea: 'Lo que crees filtra lo que ves, y lo que esperas con confianza cambia cómo actúas y cómo te responden.',
    intro: 'La Ley de la Creencia dice que lo que crees con convicción se vuelve tu realidad. La Ley de la Expectativa dice que lo que esperas con confianza tiende a cumplirse. No es magia: las creencias deciden qué intentas, cuánto insistes y cómo interpretas lo que pasa.',
    bloques: [
      ['Qué dicen', [
        'No crees lo que ves: ves lo que ya crees. Si crees que "no soy bueno para la plata", notas cada error y no ves tus aciertos.',
        'Las creencias limitantes ("soy así", "eso no es para mí") suelen venir de la infancia o de un mal momento, y casi nunca se han revisado.',
        'Si esperas que te vaya bien, actúas con más seguridad, y eso cambia el resultado y cómo te tratan los demás.',
      ]],
      ['Por qué funciona', [
        'Efecto Pygmalion: cuando a profesores se les dijo que ciertos alumnos (elegidos al azar) iban a "florecer", esos alumnos mejoraron más (Rosenthal y Jacobson, 1968). Las expectativas cambian el trato y el trato cambia el resultado.',
        'Placebo: creer que un tratamiento sirve reduce el dolor y la fatiga de verdad, por cambios reales en el cerebro (no cura enfermedades graves, pero sí cambia la experiencia).',
        'Autoeficacia (Albert Bandura): creer que eres capaz de una tarea concreta predice si la intentas, cuánto esfuerzo pones y si persistes. Se construye sobre todo con pequeños logros reales.',
        'Mentalidad de crecimiento (Carol Dweck): creer que las habilidades se desarrollan te hace buscar retos y aprender del error.',
      ]],
      ['Ejemplos', [
        'Fútbol: el jugador que espera fallar el penal mira al arquero, duda y patea mal. El que espera meterlo elige un lado y patea firme.',
        'Gym: si crees que "no tengo genética para pierna", haces menos series. La creencia produce el resultado que "confirma" la creencia.',
        'Relaciones: si esperas que alguien te rechace, llegas a la defensiva, y eso provoca el rechazo.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Detecta la creencia: completa "Yo no soy…" y "Yo nunca…". Lo que escribas son tus creencias limitantes.',
        'Busca la prueba contraria: escribe 3 veces en que eso no fue verdad. Una creencia se debilita con evidencia, no con repetirse lo contrario.',
        'Cámbiala por una creíble y en crecimiento: no "soy rico" sino "estoy aprendiendo a manejar mi dinero".',
        'Constrúyela con hechos: ponte una meta tan pequeña que la cumplas seguro y súbela poco a poco. Cada logro es una prueba nueva para tu mente.',
        'Antes de algo importante, espera lo mejor y prepárate para lo peor: confianza más plan B.',
      ]],
      ['Errores comunes', [
        'Creer sin actuar: la expectativa positiva sin preparación lleva a decepción.',
        'Afirmaciones que tu mente no cree ("soy millonario" con deudas): pueden hacerte sentir peor. Usa frases de proceso ("cada mes mejoro").',
      ]],
    ],
    formulas: ['Creencia → lo que intentas → resultado → refuerza la creencia', 'Autoeficacia = pequeños logros repetidos'],
    nota: 'La versión "lo que crees se vuelve realidad" es exagerada si se entiende literal: creer no cambia el mundo por sí solo. Lo comprobado es que las creencias cambian tu conducta y la de los demás contigo (Pygmalion, autoeficacia, mentalidad de crecimiento), y por esa vía cambian los resultados.',
    afirmacion: 'Estoy aprendiendo y cada logro me demuestra que soy capaz.',
    practica: [
      'Escribe 3 creencias que empiecen por "Yo no soy…" o "Yo nunca…".',
      'Para la más fuerte, escribe 3 pruebas de que no siempre es verdad.',
      'Haz hoy una acción pequeña que la contradiga y anótala como prueba.',
    ],
    pregunta: '¿Qué creencia sobre mí mismo, si la cambiara, me abriría más puertas?',
  }),

  d(4, 'Atracción, Correspondencia y Atracción Social', ['atraccion', 'correspondencia', 'adentro afuera', 'energia', 'atraer', 'gente', 'entorno', 'amigos'], {
    idea: 'No atraes por magia: atraes por lo que notas, por cómo actúas y por la gente de la que te rodeas.',
    intro: 'La Ley de la Atracción dice que atraes personas y circunstancias en armonía con tus pensamientos dominantes. La Ley de la Correspondencia dice que tu mundo exterior refleja tu mundo interior. La Ley de la Atracción Social dice que atraes gente con tu misma energía y mentalidad. Las tres son ciertas en un sentido práctico y falsas en un sentido mágico.',
    bloques: [
      ['Qué dicen', [
        'Atracción: lo que piensas todo el tiempo termina apareciendo en tu vida.',
        'Correspondencia: "como es adentro, es afuera". Tu cuarto, tu cuerpo, tus finanzas y tus relaciones reflejan tus hábitos y tu orden mental.',
        'Atracción social: te juntas con gente parecida a ti, y te vuelves parecido a la gente con la que te juntas.',
      ]],
      ['Qué sí está comprobado', [
        'Atención selectiva: cuando decides comprar un carro rojo, empiezas a ver carros rojos en todas partes. Tu cerebro filtra lo que es importante para tus metas. Pensar en una meta hace que notes oportunidades que antes pasaban de largo.',
        'Conducta: quien piensa en una meta actúa hacia ella (pregunta, aprende, se mueve). Las oportunidades llegan por las acciones, no por el pensamiento.',
        'Contagio social: hábitos como subir de peso, dejar de fumar o la felicidad se propagan por las redes de amigos (Christakis y Fowler, Framingham, 2007-2008).',
        'Homofilia: tendemos a relacionarnos con gente parecida en valores y hábitos. Por eso cambiar de entorno es una de las palancas más fuertes.',
      ]],
      ['Ejemplos', [
        'Si te fijas como meta conseguir un mejor trabajo, empiezas a notar convocatorias, contactos y cursos que antes ignorabas. Eso es la atracción real.',
        'Correspondencia en el gym: tu registro desordenado suele corresponder a un progreso desordenado. Registrar cada serie (como en la app) ordena el resultado.',
        'Si tus amigos salen a beber cada fin de semana, mantener la dieta es más difícil. Un amigo que entrena hace que entrenar sea lo normal.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Escribe tu meta y léela cada mañana: así le dices a tu cerebro qué notar durante el día.',
        'Actúa cada día en dirección a lo que quieres atraer: pide, pregunta, preséntate, publica.',
        'Ordena tu exterior para ordenar tu interior (y al revés): tiende la cama, ordena el escritorio, mira tus números.',
        'Revisa tus 5 personas más cercanas: ¿te acercan o te alejan de quien quieres ser? Suma al menos una persona que ya vive como tú quieres vivir (un equipo de fútbol, un grupo de gym, una comunidad).',
        'Conviértete en la persona que te gustaría atraer: si quieres gente constante, sé constante.',
      ]],
      ['Errores comunes', [
        'Pensar sin actuar esperando que "el universo" lo traiga.',
        'Culparte de todo lo malo ("lo atraje por pensar negativo"): enfermedades, accidentes y crisis no se atraen con pensamientos. Eso solo genera culpa.',
        'Alejarte de todos los que no piensan igual: también necesitas gente que te cuestione.',
      ]],
    ],
    formulas: ['Meta clara → atención selectiva → oportunidades vistas → acción', 'Tú ≈ el promedio de tu entorno cercano'],
    nota: 'La "Ley de la Atracción" en su versión de El Secreto (los pensamientos emiten una frecuencia que atrae cosas) no tiene respaldo científico, y un estudio mostró que fantasear mucho con el resultado ya logrado, sin plan, puede bajar la energía para conseguirlo (Gabriele Oettingen). Lo que sí funciona: meta clara + atención + acción + entorno. Para soñar sin quedarte en el sueño, usa WOOP: deseo, resultado, obstáculo, plan (lectura 5).',
    afirmacion: 'Me convierto en la persona que quiero atraer y actúo cada día hacia lo que deseo.',
    practica: [
      'Escribe tu meta principal y léela en la mañana y en la noche.',
      'Haz la lista de las 5 personas con las que más tiempo pasas y marca cómo influye cada una.',
      'Ordena un espacio (cuarto, escritorio o celular) durante 10 minutos.',
    ],
    pregunta: 'Si mi vida exterior es un espejo de mi interior, ¿qué me está mostrando hoy?',
  }),

  d(5, 'Subconsciente, Concentración y Equivalente Mental', ['subconsciente', 'concentracion', 'equivalente mental', 'visualizar', 'visualizacion', 'imaginar', 'foco', 'woop'], {
    idea: 'Lo que ensayas en la mente y piensas a menudo se convierte en piloto automático; pero visualizar el plan funciona mejor que visualizar el premio.',
    intro: 'Tres leyes del seminario hablan de la mente como semillero. Actividad Subconsciente: lo que plantas en el subconsciente se pone en marcha. Concentración: lo que piensas constantemente crece. Equivalente Mental: todo logro existe primero en la mente; nada cambia afuera si no cambia adentro.',
    bloques: [
      ['Qué dicen', [
        'Tu mente trabaja aunque no estés pensando conscientemente: lo que repites y sientes con emoción se vuelve automático.',
        'Lo que más piensas crece: si piensas en problemas, ves más problemas; si piensas en soluciones, encuentras soluciones.',
        'Antes de lograr algo tienes que poder imaginarlo con claridad: si no lo ves posible, no lo intentas.',
      ]],
      ['Qué sí está comprobado', [
        'Ensayo mental: imaginar un movimiento activa zonas del cerebro parecidas a hacerlo. Los atletas lo usan para preparar jugadas; mejora el rendimiento, sobre todo combinado con práctica real.',
        'Automatismos: la mayoría de lo que haces al día es hábito (cerca del 40% según Wendy Wood). Lo que se repite pasa a funcionar solo.',
        'WOOP / contraste mental (Gabriele Oettingen): soñar con la meta y LUEGO imaginar el obstáculo y el plan para superarlo funciona mucho mejor que solo soñar con el resultado.',
        'Visualizar el proceso (los pasos) mejora más el desempeño que visualizar solo el resultado (estudios con estudiantes, Taylor y Pham, 1998).',
      ]],
      ['Ejemplos', [
        'Antes del partido, imagina 3 jugadas: el pase en profundidad, la marca en defensa, el remate. Siéntelas con detalle. Llegas con el cuerpo ya "ensayado".',
        'Antes de una sentadilla pesada: visualiza la bajada controlada, la profundidad y la subida explosiva.',
        'Dieta: imagina la situación difícil (llegas con hambre a la casa a las 8 p. m.) y lo que harás (comer la proteína preparada). Eso es el equivalente mental del hábito.',
      ]],
      ['Cómo usarla de la mejor forma (WOOP en 5 minutos)', [
        'W, deseo: ¿qué quiero lograr? En una frase.',
        'O, resultado: imagina 1 minuto lo mejor de lograrlo, con emoción.',
        'O, obstáculo: ¿qué dentro de mí me va a frenar? (pereza, miedo, celular).',
        'P, plan: "Si aparece [obstáculo], entonces haré [acción]".',
        'Repite cada mañana con la sesión guiada "Visualización 5 minutos" o "Activa tus leyes".',
      ]],
      ['Errores comunes', [
        'Quedarte solo en la imagen bonita: sin obstáculo y plan, la visualización puede quitarte energía.',
        'Pensar que el subconsciente hace el trabajo solo: programa la mente, pero el cuerpo tiene que ir al gym.',
      ]],
    ],
    formulas: ['Deseo + Resultado + Obstáculo + Plan = WOOP', 'Lo que repites con emoción se vuelve automático'],
    afirmacion: 'Veo con claridad lo que quiero, preveo los obstáculos y tengo un plan para cada uno.',
    practica: [
      'Haz un WOOP por escrito para tu meta más importante.',
      'Antes de tu próximo entreno o partido, visualiza 1 minuto la ejecución perfecta de un movimiento.',
      'Haz la sesión guiada "Activa tus leyes".',
    ],
    pregunta: '¿Qué estoy pensando constantemente y está creciendo en mi vida, aunque no lo quiera?',
  }),

  d(6, 'Ley de la Sustitución', ['sustitucion', 'pensamientos negativos', 'alto', 'reemplazar', 'mente', 'negativo', 'reencuadre'], {
    idea: 'La mente sostiene un pensamiento consciente a la vez: no pelees con el negativo, reemplázalo.',
    intro: 'La Ley de la Sustitución dice que puedes cambiar un pensamiento negativo poniendo uno positivo en su lugar, porque tu atención consciente no puede sostener dos al mismo tiempo. Es una de las herramientas más prácticas del seminario: la técnica "¡ALTO!".',
    bloques: [
      ['Qué dice', [
        'No puedes "dejar de pensar" en algo, pero sí puedes pensar en otra cosa.',
        'Cada vez que notas un pensamiento negativo tienes una elección: alimentarlo o sustituirlo.',
      ]],
      ['Qué sí está comprobado', [
        'Supresión: intentar NO pensar en algo lo trae más (el experimento del "oso blanco", Daniel Wegner). Por eso la clave es sustituir, no reprimir.',
        'Reestructuración cognitiva (terapia cognitivo-conductual): detectar el pensamiento, revisar si es verdad y cambiarlo por uno más realista es de lo más respaldado para la ansiedad y la depresión leve.',
        'Reevaluación (James Gross): cambiar la interpretación de una situación ("esto es un reto, no una amenaza") baja la emoción negativa mejor que aguantarla.',
        'Distracción activa: hacer algo que ocupe la mente (moverte, una tarea) corta la rumiación.',
      ]],
      ['Ejemplos', [
        '"Otra vez fallé el pase" → ¡ALTO! → "Siguiente jugada: cuerpo abierto y mirar antes de recibir".',
        '"No voy a poder con esta serie" → ¡ALTO! → "Una rep más, solo esta".',
        '"Me salí de la dieta, ya arruiné el día" → ¡ALTO! → "La siguiente comida vuelve al plan".',
      ]],
      ['Cómo usarla de la mejor forma (técnica ALTO en 4 pasos)', [
        '1. Nota el pensamiento y nómbralo: "estoy pensando que no sirvo".',
        '2. Di "¡ALTO!" mentalmente (o en voz baja), y si puedes cambia de postura o respira 4-4-8.',
        '3. Pregúntate: ¿es 100% verdad? ¿Qué le diría a un amigo?',
        '4. Sustituye por una frase realista, en presente y orientada a la acción, y haz algo de inmediato.',
        'Prepara tus sustitutos con anticipación: escribe tus 3 pensamientos negativos más frecuentes y su reemplazo.',
      ]],
      ['Errores comunes', [
        'Pensamiento positivo falso ("todo está perfecto" cuando no): la mente no lo cree. Mejor realista y útil.',
        'Reprimir emociones reales (tristeza, duelo): sentirlas es sano. La sustitución es para pensamientos repetitivos que no sirven.',
      ]],
    ],
    formulas: ['Notar → ¡ALTO! → ¿es verdad? → sustituir → actuar'],
    nota: 'La técnica de "detener el pensamiento" sola tiene evidencia débil; lo que funciona es detener Y reemplazar, y mejor si el reemplazo viene con una acción. Si los pensamientos negativos son constantes por semanas, un psicólogo con terapia cognitivo-conductual es la herramienta más efectiva.',
    afirmacion: 'Elijo mis pensamientos: cuando aparece uno que no me sirve, lo cambio por uno que me impulsa.',
    practica: [
      'Escribe tus 3 pensamientos negativos más frecuentes y su sustituto realista.',
      'Usa la técnica ALTO al menos 3 veces hoy y cuéntalas.',
      'Haz la sesión guiada "Me hablo bien".',
    ],
    pregunta: '¿Qué pensamiento repito tanto que ya lo creo, y por cuál lo voy a sustituir?',
  }),

  d(7, 'Acumulación, Regla del 1% y Crecimiento Continuo', ['acumulacion', '1%', 'uno por ciento', 'mejorar', 'compuesto', 'constancia', 'paciencia', 'progreso'], {
    idea: 'Los resultados grandes son pequeñas acciones repetidas: 1% mejor cada día se acumula como interés compuesto.',
    intro: 'La Ley de la Acumulación dice que cada pensamiento y acción se suma con el tiempo. La Regla del 1% diario dice que mejorar un poco cada día te hace mucho mejor en un año. La Ley del Crecimiento Continuo dice que la genialidad es un proceso, no un destino. Juntas explican por qué la constancia le gana al talento.',
    bloques: [
      ['Qué dicen', [
        'Ningún logro grande pasa de un día para otro: es la suma de días normales bien hechos.',
        'Matemáticamente: 1,01 elevado a 365 ≈ 37,8. Y 0,99 elevado a 365 ≈ 0,03. Mejorar un poco o empeorar un poco cada día da destinos muy distintos.',
        'No llegas a ser "el mejor" y paras: siempre hay un siguiente nivel.',
      ]],
      ['Qué sí está comprobado', [
        'Interés compuesto: así crecen el dinero, la fuerza, el conocimiento y las relaciones. Al principio no se nota nada; después se acelera.',
        'Práctica deliberada (Anders Ericsson): los expertos no son los que más horas tienen, sino los que practican con metas concretas, retroalimentación y un poco más allá de su nivel.',
        'Ganancias marginales: el ciclismo británico (Dave Brailsford) mejoró pequeños detalles (sueño, almohadas, lavado de manos) y pasó de no ganar casi nada a dominar el Tour de Francia.',
        'Sobrecarga progresiva: el músculo crece porque cada semana le pides un poco más (peso, reps o series). Es la regla del 1% aplicada al gym.',
      ]],
      ['Ejemplos', [
        'Gym: subir 1 rep o 2,5 kg cuando completas el rango (la app te marca ⬆ SUBE PESO). En 6 meses son muchos kilos más.',
        'Dinero: ahorrar 10.000 pesos al día no se siente, pero son 3,6 millones al año, y con intereses, más.',
        'Lectura: 10 páginas al día son unos 15 libros al año.',
        'Al revés: un gasto hormiga diario o 30 minutos de redes extra también se acumulan, en contra.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Elige qué quieres que se acumule (fuerza, ahorro, conocimiento) y define la "dosis diaria" mínima.',
        'Mide: lo que no mides no sabes si está creciendo. Usa Progreso, Gym y Finanzas de la app.',
        'Compárate con tu yo de hace 3 meses, no con el de ayer: el progreso diario es invisible, el trimestral no.',
        'Protege la constancia por encima de la intensidad: un entreno mediocre que haces vale más que uno perfecto que no haces.',
        'Revisa también lo que se acumula en contra y córtalo pequeño (un gasto, una hora de pantalla).',
      ]],
      ['Errores comunes', [
        'Abandonar en el "valle de la decepción": al principio el esfuerzo parece no dar resultado. Es normal; el resultado llega después.',
        'Querer el 50% de mejora en una semana: lleva a lesiones, dietas extremas y abandono.',
      ]],
    ],
    formulas: ['1,01^365 ≈ 37,8', '0,99^365 ≈ 0,03', 'Resultado = acción pequeña × repeticiones × tiempo'],
    nota: 'El "37 veces mejor" es una ilustración matemática, no una promesa: en la vida real el progreso se frena (en el gym, por ejemplo, los principiantes avanzan rápido y después más lento). La idea de fondo sí es sólida: pequeñas mejoras constantes ganan.',
    afirmacion: 'Cada día mejoro un 1%; confío en el proceso y en lo que se acumula.',
    practica: [
      'Elige un área y define tu "dosis del 1%" diaria (una rep, una página, un ahorro).',
      'Mira en Progreso cómo estabas hace 4 semanas y escribe lo que mejoró.',
      'Identifica un hábito pequeño que se está acumulando en tu contra y redúcelo hoy.',
    ],
    pregunta: '¿Qué pequeña acción, repetida todos los días por un año, cambiaría más mi vida?',
  }),

  d(8, 'Ley del Hábito y la Regla de los 21 días', ['habito', 'habitos', '21 dias', '66 dias', 'rutina', 'constancia', 'disciplina', 'automatico'], {
    idea: 'La energía y los resultados no vienen de la motivación sino de hábitos; y un hábito tarda más de 21 días, en promedio unos 66.',
    intro: 'La Ley del Hábito dice que la energía no viene de la motivación sino de repetir hábitos saludables. La Regla de los 21 días dice que repetir un hábito unos 21 días seguidos ayuda a fijarlo. La primera es muy sólida; la segunda necesita un ajuste.',
    bloques: [
      ['Qué dicen', [
        'Esperar a tener ganas es un error: las ganas llegan después de empezar, y los hábitos te llevan cuando las ganas no están.',
        'Repetir algo cada día lo vuelve automático: deja de costar fuerza de voluntad.',
      ]],
      ['Qué sí está comprobado', [
        'El estudio más citado (Phillippa Lally, 2009) encontró que un hábito tardó en promedio 66 días en volverse automático, con un rango de 18 a 254 días según la persona y el hábito. Beber agua se automatiza antes que hacer 50 abdominales.',
        'Fallar un día no arruinó el hábito en ese estudio: lo que importa es volver al día siguiente.',
        'El ciclo del hábito (Charles Duhigg, James Clear): señal → rutina → recompensa. Para crear un hábito: hazlo obvio, atractivo, fácil y satisfactorio.',
        'La fuerza de voluntad se gasta; el entorno no. Quien parece muy disciplinado casi siempre tiene un entorno que facilita lo bueno y dificulta lo malo.',
      ]],
      ['Ejemplos', [
        'Señal clara: "después de tomar la pastilla, me cuelgo 1 minuto" (así está en tu rutina de la mañana). Eso es apilar hábitos.',
        'Hacerlo fácil: deja la ropa del gym lista la noche anterior; la comida del día preparada en tarros.',
        'Hacerlo satisfactorio: marcar ✓ en la app, ver la racha y la barra de progreso.',
        'Dificultar lo malo: no tener dulces en la casa; dejar el celular fuera del cuarto.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Empieza ridículamente pequeño: 2 minutos (la versión mínima que harías incluso en tu peor día).',
        'Apílalo: "Después de [hábito que ya tengo], haré [hábito nuevo]".',
        'Usa los 21 días como primera meta (sirve para arrancar y darte una racha), pero espera unos 2 meses para que sea automático.',
        'Regla de oro: nunca falles dos veces seguidas. Un día malo es un accidente; dos es el comienzo de un hábito nuevo (el de no hacerlo).',
        'Cambia la identidad: no "quiero correr" sino "soy alguien que no falta". Cada repetición es un voto por esa persona.',
      ]],
      ['Errores comunes', [
        'Empezar 5 hábitos a la vez: elige 1 o 2.',
        'Rendirte el día 22 porque "ya debería salir solo": es normal que todavía cueste.',
        'Depender de la motivación: diseña el entorno.',
      ]],
    ],
    formulas: ['Señal → rutina → recompensa', 'Después de [hábito actual], haré [hábito nuevo]', 'Promedio para automatizar ≈ 66 días (18 a 254)'],
    nota: 'La "regla de los 21 días" viene de Maxwell Maltz (Psicocibernética, 1960), que observó que sus pacientes de cirugía tardaban "un mínimo de 21 días" en acostumbrarse a su nueva cara. Se popularizó quitando la palabra "mínimo". Úsala como meta de arranque, no como fecha en que el hábito queda listo.',
    afirmacion: 'Soy una persona constante: hago lo mínimo incluso en mis peores días y nunca fallo dos veces seguidas.',
    practica: [
      'Elige un hábito y escribe su versión de 2 minutos.',
      'Escribe tu fórmula: "Después de ___, haré ___".',
      'Cambia una cosa del entorno hoy para hacerlo más fácil (o el malo más difícil).',
    ],
    pregunta: '¿Qué hábito quiero que sea automático en 66 días, y cuál es su versión mínima?',
  }),

  d(9, 'Ley de la Acción, Ley de la Inercia y Regla de los 5 minutos', ['accion', 'inercia', '5 minutos', 'empezar', 'procrastinar', 'miedo', 'arrancar', 'pereza'], {
    idea: 'Lo más difícil es empezar; una vez en movimiento, seguir es fácil. El miedo y la pereza se disuelven actuando.',
    intro: 'La Ley de la Acción dice que el miedo se disuelve al actuar y que una idea sin acción no vale nada. La Ley de la Inercia dice que el primer paso es el más difícil y que después el impulso te lleva. La Regla de los 5 minutos convierte las dos en una herramienta: si te cuesta empezar, comprométete solo 5 minutos.',
    bloques: [
      ['Qué dicen', [
        'Como en la física: un objeto quieto tiende a seguir quieto y uno en movimiento a seguir en movimiento.',
        'El miedo crece cuando lo piensas y se encoge cuando actúas.',
        'Casi nunca te detienes a los 5 minutos: lo duro era arrancar.',
      ]],
      ['Qué sí está comprobado', [
        'Activación conductual: en la depresión y la desmotivación, hacer actividades (aunque no haya ganas) sube el ánimo; esperar a tener ánimo para actuar no funciona. Primero acción, luego motivación.',
        'Efecto Zeigarnik: las tareas empezadas y no terminadas se quedan en la mente y empujan a terminarlas. Empezar crea tensión para seguir.',
        'Exposición: la forma más efectiva de vencer un miedo es enfrentarlo de a poco y repetidamente. Evitarlo lo agranda.',
        'La procrastinación es sobre todo un problema de manejar emociones (evitar el malestar de la tarea), no de pereza (Tim Pychyl, Fuschia Sirois).',
      ]],
      ['Ejemplos', [
        'Gym sin ganas: "solo me pongo la ropa y caliento 5 minutos". Casi siempre terminas el entreno.',
        'Un trabajo pendiente: abre el archivo y escribe solo el título y 3 ideas.',
        'Miedo a hablar con alguien: escribe el primer mensaje; ya actuaste.',
        'Ordenar la casa: pon un temporizador de 5 minutos y recoge solo lo que alcances.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Define el primer paso físico, tan pequeño que sea ridículo: "abrir el documento", "ponerme los tenis".',
        'Pon un temporizador de 5 minutos y date permiso real de parar al terminar. Si quieres seguir, sigue.',
        'Ataca primero lo que más evitas (la "rana" de Brian Tracy): el resto del día se siente más liviano.',
        'Ante el miedo, pregúntate cuál es el paso más pequeño hacia eso que temes, y hazlo hoy.',
        'Nombra la emoción que evitas ("me aburre", "me da miedo hacerlo mal"): nombrarla le quita fuerza.',
      ]],
      ['Errores comunes', [
        'Esperar el momento perfecto o tener todo claro antes de empezar.',
        'Planificar, investigar y organizar como forma elegante de no hacer.',
      ]],
    ],
    formulas: ['Acción → motivación (no al revés)', 'Empezar 5 minutos > esperar ganas'],
    afirmacion: 'Actúo aunque no tenga ganas; el primer paso me pone en movimiento.',
    practica: [
      'Elige la tarea que más estás evitando y trabaja en ella solo 5 minutos con temporizador.',
      'Escribe el primer paso físico de tu meta más importante y hazlo hoy.',
      'Haz una cosa pequeña que te dé un poco de miedo.',
    ],
    pregunta: '¿Qué estoy esperando para empezar, y cuál sería el paso de 5 minutos?',
  }),

  d(10, 'Ley del 80/20 (Principio de Pareto)', ['80/20', 'pareto', 'prioridades', 'importante', 'productividad', 'enfoque', 'tiempo'], {
    idea: 'Una minoría de tus acciones produce la mayoría de tus resultados: encuéntrala y dale prioridad.',
    intro: 'La Ley del 80/20 dice que cerca del 80% de los resultados viene del 20% de las acciones. La observó el economista Vilfredo Pareto (el 20% de la gente tenía el 80% de la tierra en Italia) y se encontró en muchísimos campos. Es la ley de las prioridades.',
    bloques: [
      ['Qué dice', [
        'No todas las tareas valen lo mismo: unas pocas mueven la aguja y muchas solo te mantienen ocupado.',
        'Los números no son exactos (puede ser 70/30 o 90/10); lo importante es el desequilibrio.',
      ]],
      ['Por qué funciona', [
        'Se ve en ventas (pocos clientes dan la mayor parte de los ingresos), en errores de software, en gastos y en salud.',
        'En el gym: unos pocos factores (constancia, sobrecarga progresiva, proteína, sueño, calorías) explican casi todo el resultado; los suplementos raros y los detalles finos, muy poco.',
        'En la dieta: las calorías totales y la proteína importan mucho más que la hora exacta de comer.',
      ]],
      ['Ejemplos', [
        'Finanzas: mira tus gastos del mes. Probablemente 3 o 4 categorías son el 80% del total. Ahí es donde vale la pena recortar, no en el tinto.',
        'Estudio: el 20% de los temas suele salir en el 80% del examen.',
        'Relaciones: unas pocas personas te dan la mayor parte del apoyo y la alegría. Cuídalas primero.',
        'Fútbol: unas pocas acciones (posicionamiento, primer control, pase simple) deciden más que los trucos.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Haz la lista de todo lo que tienes que hacer y pregúntate: si solo pudiera hacer 2 cosas hoy, ¿cuáles darían más resultado? Esas van primero.',
        'Revisa al final de la semana: ¿qué 20% de lo que hice dio el 80% del avance? Haz más de eso.',
        'Al revés: ¿qué 20% de las cosas me da el 80% de los problemas o del estrés? Elimínalo o redúcelo.',
        'Combínala con la matriz de Eisenhower: urgente/importante → hazlo; importante no urgente → agéndalo; urgente no importante → delégalo; ninguno → elimínalo.',
      ]],
      ['Errores comunes', [
        'Hacer primero lo fácil para sentirte productivo.',
        'Usar el 80/20 como excusa para hacer solo lo mínimo en todo: el 20% importante se hace al 100%.',
      ]],
    ],
    formulas: ['≈80% de los resultados ← ≈20% de las causas', 'Importante + urgente = hazlo · Importante = agéndalo · Urgente = delégalo · Ninguno = elimínalo'],
    afirmacion: 'Hago primero lo que más importa y suelto lo que solo me mantiene ocupado.',
    practica: [
      'Escribe tus tareas de hoy y marca las 2 que darían más resultado. Hazlas primero.',
      'Revisa tus gastos del mes en Finanzas e identifica las 3 categorías más grandes.',
      'Escribe una actividad que te quita mucho tiempo y da poco, y redúcela esta semana.',
    ],
    pregunta: '¿Cuál es el 20% de mis acciones que produce el 80% de lo que me importa?',
  }),

  d(11, 'Ley de Parkinson', ['parkinson', 'plazos', 'tiempo', 'fecha limite', 'productividad', 'reuniones', 'eficiencia'], {
    idea: 'El trabajo se expande hasta llenar el tiempo disponible: ponte plazos cortos y concretos.',
    intro: 'La Ley de Parkinson la describió con humor C. Northcote Parkinson en 1955: si tienes una semana para una tarea de 2 horas, tardarás una semana. Lo mismo pasa con la plata (el gasto sube hasta llenar el ingreso) y con el espacio (las cosas llenan el clóset).',
    bloques: [
      ['Qué dice', [
        'Sin un límite claro, la tarea se estira: perfeccionas, te distraes y la dejas para el final.',
        'Con un límite ajustado, te enfocas en lo esencial (y aplicas el 80/20 sin pensarlo).',
      ]],
      ['Por qué funciona', [
        'Las fechas límite cercanas aumentan el esfuerzo: estudios con estudiantes mostraron que los plazos repartidos (aunque fueran autoimpuestos) dieron mejores resultados que un solo plazo al final (Ariely y Wertenbroch, 2002). Y los plazos impuestos por otros funcionaron aún mejor.',
        'La versión del dinero también está comprobada en la práctica: cuando el ingreso sube, el gasto tiende a subir con él ("inflación del estilo de vida").',
      ]],
      ['Ejemplos', [
        'En vez de "esta semana hago el informe", "el informe lo termino hoy de 9 a 11".',
        'Gym: descansos cronometrados (la app inicia el temporizador al sumar una serie). Sin reloj, los descansos se estiran y el entreno dura el doble.',
        'Dinero: si te suben el sueldo, aparta el aumento para ahorro antes de que el gasto lo llene.',
        'Pendientes de la casa: "10 minutos de orden antes de dormir" en lugar de "un día de estos".',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Ponle a cada tarea un bloque de tiempo en el calendario (time-blocking), un poco más corto de lo que crees que tardas.',
        'Usa pomodoros: 25 minutos de trabajo enfocado y 5 de descanso.',
        'Divide plazos largos en entregas pequeñas: no "el proyecto en un mes" sino "parte 1 el viernes".',
        'Haz que alguien más conozca tu plazo: el compromiso público aumenta el cumplimiento.',
        'Págate primero: ahorro automático el día de pago, para que el gasto no llene todo.',
      ]],
      ['Errores comunes', [
        'Plazos imposibles que te hacen trabajar mal o con ansiedad: ajustados, no absurdos.',
        'Llenar el tiempo ganado con más tareas sin descanso: el tiempo que te ahorras también es para recuperarte.',
      ]],
    ],
    formulas: ['Tiempo disponible ↑ → tiempo usado ↑', 'Ingreso ↑ → gasto ↑ (si no lo frenas)'],
    afirmacion: 'Me pongo plazos claros y termino lo que empiezo a tiempo.',
    practica: [
      'Ponle hora de inicio y de fin a tus 3 tareas más importantes de mañana.',
      'Haz 2 pomodoros de 25 minutos hoy en la tarea que más estiras.',
      'Si tienes un ingreso extra este mes, decide hoy qué parte va directo al ahorro.',
    ],
    pregunta: '¿Qué tarea llevo semanas estirando y cuánto tardaría si tuviera que entregarla mañana?',
  }),

  d(12, 'Rendimiento Óptimo y Ley de la Relajación', ['rendimiento', 'pausas', 'descanso', 'relajacion', 'presion', 'nervios', 'esfuerzo', 'recuperacion'], {
    idea: 'Más horas no es más productividad, y en las tareas mentales y de precisión, menos tensión da mejores resultados.',
    intro: 'La Ley del Rendimiento Óptimo dice que trabajar más horas no significa producir más: hay que hacer pausas. La Ley de la Relajación dice que en el trabajo mental, menos esfuerzo forzado da mejores resultados. Juntas explican por qué el descanso es parte del trabajo.',
    bloques: [
      ['Qué dicen', [
        'Después de cierto punto, cada hora extra rinde menos y produce más errores.',
        'Forzar la mente (o el cuerpo en un gesto técnico) con tensión empeora el resultado; la calma enfocada lo mejora.',
      ]],
      ['Qué sí está comprobado', [
        'Horas: la productividad por hora cae fuerte por encima de unas 50 horas semanales; quienes trabajaron 70 no produjeron mucho más que quienes trabajaron 55 (John Pencavel, 2014).',
        'Ley de Yerkes-Dodson: el rendimiento sube con la activación hasta un punto y luego baja. Un poco de nervios ayuda; demasiada presión bloquea, sobre todo en tareas complejas.',
        '"Ahogarse bajo presión" (Sian Beilock): pensar demasiado en un movimiento automatizado (un tiro libre, un penal) lo empeora. La relajación deja que funcione el automatismo.',
        'Recuperación: el músculo crece en el descanso, no durante el entreno. El sueño es cuando se consolidan la memoria y la fuerza.',
        'Los ciclos de 90 minutos de concentración tienen evidencia más débil, pero hacer pausas cortas regulares sí mejora la atención y reduce la fatiga.',
      ]],
      ['Ejemplos', [
        'Penal: respiración larga, eliges el lado antes, y patea sin pensar en la técnica. Pensar demasiado es lo que hace fallar.',
        'Entreno: más series no siempre es mejor. Si tu rendimiento baja y duermes mal, a veces la respuesta es una semana de descarga.',
        'Estudio: 4 bloques de 50 minutos con pausas rinden más que 6 horas seguidas con el celular al lado.',
        'Semana de fútbol: no meter pierna pesada el día antes del partido. Recuperar también es entrenar.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Trabaja en bloques (50/10 o 25/5) y en las pausas muévete, mira lejos y no mires el celular.',
        'Antes de algo importante, baja la activación: respiración 4-4-8 de 1 minuto.',
        'Cuando te bloquees, suéltalo un rato (ver Ley de la Incubación, lectura 15).',
        'Protege el sueño como parte del plan: misma hora de dormir, cuarto oscuro, sin pantallas antes.',
        'Planifica la descarga: cada 4-8 semanas de entreno duro, una semana más liviana.',
      ]],
      ['Errores comunes', [
        'Sentirte culpable por descansar.',
        'Confundir relajación con desgana: es enfoque tranquilo, no falta de esfuerzo.',
      ]],
    ],
    formulas: ['Rendimiento = estímulo + recuperación', 'Activación óptima: ni muy poca ni demasiada (Yerkes-Dodson)'],
    afirmacion: 'Rindo mejor cuando trabajo enfocado y descanso sin culpa.',
    practica: [
      'Trabaja hoy en bloques de 50 minutos con 10 de pausa sin celular.',
      'Antes de una situación importante hoy, haz 1 minuto de respiración 4-4-8.',
      'Fija tu hora de dormir de esta semana y ponle una alarma para empezar a desconectarte.',
    ],
    pregunta: '¿Dónde estoy confundiendo más horas con mejores resultados?',
  }),

  d(13, 'Ley de la Atención y Ley del Estado Mental', ['atencion', 'concentracion', 'enfoque', 'distraccion', 'celular', 'estado mental', 'motivado', 'multitarea'], {
    idea: 'Aprendes y rindes más cuando toda tu atención está en una sola cosa y estás tranquilo y motivado.',
    intro: 'La Ley de la Atención dice que aprendes más rápido cuando estás totalmente enfocado. La Ley del Estado Mental dice que se aprende mejor relajado y motivado. Tu atención es el recurso más valioso que tienes, y hoy es el más disputado.',
    bloques: [
      ['Qué dicen', [
        'Media atención da medio resultado: leer con el celular al lado, entrenar mirando redes o escuchar a alguien pensando en otra cosa.',
        'El miedo y el estrés cierran la mente; la curiosidad y el interés la abren.',
      ]],
      ['Qué sí está comprobado', [
        'La multitarea no existe para tareas que piensan: el cerebro alterna, y cada cambio cuesta tiempo y errores.',
        'La sola presencia del celular sobre la mesa (aunque esté apagado) reduce la capacidad de memoria de trabajo (Ward y colegas, 2017). Fuera de la vista es mejor.',
        'Después de una interrupción se tarda en volver a concentrarse del todo (los estudios de Gloria Mark hablan de unos 20 minutos).',
        'La curiosidad mejora la memoria: cuando algo te interesa, recuerdas mejor incluso lo que aparece alrededor (Gruber, 2014).',
        'La música suave puede ayudar a algunas personas en tareas repetitivas, pero la música con letra suele empeorar la lectura y el estudio.',
      ]],
      ['Ejemplos', [
        'Gym: guarda el celular entre series (usa el temporizador de la app). Concéntrate en el músculo: la conexión mente-músculo mejora la activación en ejercicios de aislamiento.',
        'Leer este libro: 10 minutos sin notificaciones rinden más que 30 interrumpidos.',
        'Una conversación importante: celular boca abajo y lejos; la otra persona lo nota.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Una sola pestaña, una sola tarea: decide qué es lo único que vas a hacer en este bloque.',
        'Celular en otro cuarto o en modo no molestar durante el trabajo y el entreno.',
        'Antes de aprender algo, pregúntate qué quieres sacar de ahí: la pregunta activa la curiosidad.',
        'Prepara el estado: 3 respiraciones, agua, postura derecha y una razón para hacerlo.',
        'Quita las notificaciones de todo lo que no sea una persona real.',
      ]],
      ['Errores comunes', [
        'Creer que eres "bueno en multitarea": quienes más la practican suelen rendir peor en atención.',
        'Estudiar o trabajar con estrés extremo: primero baja la activación.',
      ]],
    ],
    formulas: ['Resultado = tiempo × intensidad de la atención', 'Celular fuera de la vista > celular apagado en la mesa'],
    afirmacion: 'Mi atención es valiosa y yo decido en qué la pongo.',
    practica: [
      'Haz tu próximo bloque de trabajo o estudio con el celular en otro cuarto.',
      'Quita las notificaciones de 3 apps que no son de personas.',
      'Entrena hoy sin mirar redes entre series.',
    ],
    pregunta: '¿Qué está robando mi atención todos los días y cuánto me cuesta?',
  }),

  d(14, 'Repetición Espaciada y Ley del Aprendizaje', ['aprendizaje', 'aprender', 'estudiar', 'memoria', 'repaso', 'repeticion espaciada', 'fracaso', 'error'], {
    idea: 'Recuerdas lo que repasas en intervalos y lo que te obligas a recordar; y cada error es información para aprender.',
    intro: 'La Ley de la Repetición Espaciada dice que repasar en intervalos retiene mejor que estudiar todo de una vez. La Ley del Aprendizaje dice que a mayor conocimiento, más oportunidades, y que el fracaso es parte del éxito. Son de las leyes con más evidencia de todo el libro.',
    bloques: [
      ['Qué dicen', [
        'Estudiar 5 veces 20 minutos en días distintos rinde mucho más que 100 minutos de una vez.',
        'Si quieres ganar más, aprende más: tu conocimiento y tus habilidades son tu mayor activo.',
        'Equivocarte no es lo contrario de tener éxito: es parte del camino.',
      ]],
      ['Qué sí está comprobado', [
        'Curva del olvido (Hermann Ebbinghaus, 1885): olvidamos la mayor parte de lo nuevo en pocos días si no lo repasamos. Cada repaso aplana la curva.',
        'Efecto de espaciado: confirmado en cientos de estudios; es una de las técnicas de estudio más efectivas.',
        'Práctica de recuperación (efecto test): intentar recordar sin mirar (autoevaluarte, explicar en voz alta) fija mucho más que releer o subrayar (Roediger y Karpicke, 2006).',
        'Aprender del error: equivocarse y luego recibir la respuesta correcta mejora la memoria, siempre que revises el error.',
      ]],
      ['Ejemplos', [
        'Este libro: leer una ley por día y releerla al tercer y séptimo día (los chips de "Relee" en Preguntar).',
        'Técnica en el gym: repetir el patrón de la sentadilla con poco peso varias veces por semana fija la técnica mejor que una sesión larga.',
        'Fútbol: un partido perdido es información: ¿qué falló en la marca, en la condición, en la comunicación?',
        'Idiomas: 10 minutos diarios de flashcards (Anki) le ganan a 2 horas el fin de semana.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Repasa a los 1, 3, 7 y 30 días. Anota en el calendario o usa una app de tarjetas (Anki).',
        'Después de leer, cierra y explica en voz alta lo que entendiste (técnica Feynman). Si te trabas, ahí está lo que no entendiste.',
        'Hazte preguntas en lugar de releer.',
        'Cada vez que algo salga mal, escribe: qué pasó, qué aprendí, qué haré distinto. Así el error se convierte en dato.',
        'Dedica 30 minutos diarios a aprender una habilidad que suba tus ingresos.',
      ]],
      ['Errores comunes', [
        'Releer y subrayar: da sensación de dominio pero recuerdas poco.',
        'Estudiar todo la noche anterior: sirve para el examen, se olvida a la semana.',
        'Tomar el error como prueba de que no sirves en vez de como información.',
      ]],
    ],
    formulas: ['Repaso: día 1 → 3 → 7 → 30', 'Recordar sin mirar > releer', 'Error + revisión = aprendizaje'],
    afirmacion: 'Aprendo rápido, recuerdo con facilidad y cada error me enseña algo.',
    practica: [
      'Explica en voz alta, sin mirar, la ley de ayer.',
      'Programa en tu calendario los repasos de algo que estés aprendiendo (1, 3, 7 y 30 días).',
      'Escribe tu último error importante: qué pasó, qué aprendí, qué haré distinto.',
    ],
    pregunta: '¿Qué habilidad, si la aprendiera bien este año, cambiaría más mis oportunidades?',
  }),

  d(15, 'Ley de la Asociación y Ley de la Incubación', ['asociacion', 'incubacion', 'creatividad', 'ideas', 'innovar', 'bloqueado', 'dormir', 'soluciones'], {
    idea: 'Las ideas nuevas nacen de combinar conocimientos de áreas distintas y de soltar el problema un rato.',
    intro: 'La Ley de la Asociación dice que las ideas más innovadoras combinan conocimientos de distintas áreas. La Ley de la Incubación dice que, al dejar un problema de lado, el cerebro sigue trabajando en la solución. Son las dos leyes de la creatividad.',
    bloques: [
      ['Qué dicen', [
        'Crear casi nunca es inventar de la nada: es conectar cosas que ya existen de una forma nueva.',
        'Cuando te bloqueas, insistir puede empeorar; si te alejas, la respuesta muchas veces llega sola.',
      ]],
      ['Qué sí está comprobado', [
        'Incubación: un meta-análisis (Sio y Ormerod, 2009) confirmó que las pausas mejoran la resolución de problemas creativos, sobre todo si en la pausa haces una tarea liviana.',
        'Dormir sobre el problema: en un experimento, quienes durmieron tuvieron más del doble de probabilidad de descubrir un atajo oculto en un problema (Wagner, 2004).',
        'Caminar aumenta la generación de ideas mientras caminas y un rato después (Oppezzo y Schwartz, 2014).',
        'Diversidad: las innovaciones de mayor impacto suelen combinar conocimientos de campos poco conectados (Uzzi, 2013).',
      ]],
      ['Ejemplos', [
        'Tu app une gym, dieta, libros y finanzas: es Ley de la Asociación aplicada a tu vida.',
        'Llevar ideas del fútbol al trabajo: la comunicación del equipo en la cancha aplicada a una reunión.',
        'Bloqueado con una decisión: sales a caminar la hora de la mañana y la respuesta aparece a mitad del camino.',
        'Poincaré contaba que la solución de un problema matemático le llegó al subirse a un bus, después de días sin pensar en él.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Primero trabaja el problema en serio (sin preparación no hay incubación); luego suéltalo.',
        'Haz algo liviano y repetitivo: caminar, ducharte, entrenar, ordenar.',
        'Antes de dormir, hazle a tu mente una pregunta concreta sobre el problema. Ten un cuaderno al lado.',
        'Alimenta la asociación: lee y aprende fuera de tu área; pregunta "¿cómo resolvería esto alguien de otro campo?".',
        'Escribe 20 ideas sin filtrar; las primeras son obvias, las buenas salen después.',
      ]],
      ['Errores comunes', [
        'Usar la incubación como excusa para no empezar nunca.',
        'Llenar las pausas con el celular: la mente necesita aburrirse un poco para conectar.',
      ]],
    ],
    formulas: ['Preparar → soltar (incubar) → iluminación → verificar', 'Idea nueva = A + B de áreas distintas'],
    afirmacion: 'Mi mente conecta ideas y encuentra soluciones mientras descanso.',
    practica: [
      'Escribe un problema que tengas como pregunta y léela antes de dormir.',
      'Camina 20 minutos sin celular ni audífonos y anota lo que se te ocurra.',
      'Escribe 20 ideas para un problema actual sin juzgarlas.',
    ],
    pregunta: '¿Qué conocimiento de otra área de mi vida podría resolver el problema que tengo ahora?',
  }),

  d(16, 'Simplicidad, Pensamiento Lateral y Adaptación', ['simplicidad', 'simple', 'pensamiento lateral', 'adaptacion', 'problemas', 'resolver', 'ajustar', 'plan'], {
    idea: 'Prueba la solución más simple, mira el problema desde otro ángulo y ajusta sobre la marcha.',
    intro: 'Tres leyes del seminario para resolver problemas. Simplicidad: la solución más simple suele ser la mejor. Pensamiento Lateral: ver el problema desde otro ángulo genera soluciones nuevas. Adaptación: ajusta las soluciones en el camino, porque no todo funciona a la primera.',
    bloques: [
      ['Qué dicen', [
        'Antes de buscar algo complicado, prueba lo obvio.',
        'Si una forma de pensar no resuelve el problema, cambia la pregunta.',
        'Un plan es una hipótesis: se prueba, se mide y se corrige.',
      ]],
      ['Por qué funciona', [
        'Navaja de Ockham: entre explicaciones que funcionan igual, la más simple suele ser la correcta, y las soluciones simples fallan menos.',
        'Pensamiento lateral (Edward de Bono): técnicas como invertir el problema ("¿cómo lo empeoraría?") o cambiar el punto de vista rompen los caminos de siempre.',
        'Ciclo de mejora (PDCA: planificar, hacer, revisar, ajustar) y el método "lean": pruebas pequeñas y rápidas aprenden más que planes perfectos.',
        'En medicina y en ingeniería se usan listas de chequeo simples porque reducen los errores más que la experiencia sola (Atul Gawande).',
      ]],
      ['Ejemplos', [
        'Estancado en el gym: antes de cambiar de rutina, revisa lo simple (dormir 7-8 horas, proteína, subir peso cuando toca).',
        'Inversión: "¿cómo me aseguraría de abandonar la dieta?" → tener dulces en casa, saltarme comidas, llegar con hambre. Ahora haz lo contrario.',
        'Otro ángulo: en vez de "¿cómo gano más?", "¿cómo hago que mi trabajo valga más para alguien?".',
        'Adaptación: el plan de comidas no cuadra con un día de partido; lo ajustas en vez de abandonarlo.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Escribe el problema en una frase y pregúntate "¿por qué?" 5 veces para llegar a la causa (ficha 5 porqués del Seminario Fénix).',
        'Pregunta: ¿cuál es la solución más simple que podría funcionar? Pruébala primero.',
        'Usa la inversión: escribe cómo empeorarías el problema y haz lo contrario.',
        'Cambia de perspectiva: ¿qué haría un experto, un niño, alguien sin miedo?',
        'Define cuándo vas a revisar (en 1 o 2 semanas) y qué número te dirá si funcionó.',
      ]],
      ['Errores comunes', [
        'Complicar para sentir que estás haciendo algo serio.',
        'Cambiar de plan cada 3 días sin dejarlo funcionar, o seguir con un plan que claramente no sirve por orgullo.',
      ]],
    ],
    formulas: ['Planificar → hacer → revisar → ajustar', 'Invertir: ¿cómo lo empeoro? → haz lo contrario'],
    afirmacion: 'Todo problema tiene solución; empiezo por lo simple y ajusto en el camino.',
    practica: [
      'Escribe un problema actual en una frase y aplica los 5 porqués.',
      'Haz la inversión: escribe 3 formas de empeorarlo y lo contrario de cada una.',
      'Elige la solución más simple, ponle fecha de revisión y empieza hoy.',
    ],
    pregunta: '¿Qué estoy complicando que podría resolver con algo simple?',
  }),

  d(17, 'Ley de la Respuesta Biológica', ['respuesta biologica', 'cuerpo', 'estres', 'emociones', 'salud', 'respiracion', 'cortisol', 'nervios'], {
    idea: 'Tus pensamientos y emociones cambian la química de tu cuerpo, y tu cuerpo cambia tus pensamientos: puedes entrar por los dos lados.',
    intro: 'La Ley de la Respuesta Biológica dice que lo que piensas y sientes afecta tu química interna. Una preocupación activa la misma respuesta de estrés que un peligro real. La buena noticia: la conexión va en las dos direcciones.',
    bloques: [
      ['Qué dice', [
        'El cuerpo no distingue bien entre un peligro real y uno imaginado: los dos suben el pulso, tensan los músculos y liberan hormonas de estrés.',
        'Pensamientos y emociones sostenidos por mucho tiempo dejan huella en la salud.',
      ]],
      ['Qué sí está comprobado', [
        'Estrés crónico: el cortisol alto por mucho tiempo afecta el sueño, la recuperación muscular, el apetito, la presión y las defensas.',
        'La respiración lenta, con la exhalación más larga que la inhalación, activa el sistema de calma (parasimpático) y baja el pulso en minutos.',
        'Reinterpretar los nervios: decir "estoy emocionado" en vez de "estoy nervioso" mejoró el rendimiento al hablar y cantar en público (Alison Wood Brooks, 2014). La activación es la misma; el significado cambia el resultado.',
        'El ejercicio es uno de los antidepresivos y ansiolíticos naturales más respaldados.',
        'Las "poses de poder" cambian un poco cómo te sientes, pero sus efectos hormonales no se pudieron replicar: úsalas para sentirte seguro, no esperes química mágica.',
      ]],
      ['Ejemplos', [
        'La noche antes de algo importante, la preocupación te quita sueño, y el mal sueño te pone más ansioso: un círculo que se corta con respiración y escribiendo las preocupaciones.',
        'Antes del partido, el corazón acelerado: "es energía para jugar", no "estoy mal".',
        'Comer por ansiedad: la emoción busca alivio químico rápido (azúcar). Nombrar la emoción y moverse 10 minutos baja el impulso.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Entra por el cuerpo cuando la mente no obedece: respiración 4-4-8, caminar, ducharte, entrenar.',
        'Entra por la mente cuando el cuerpo se dispara: reinterpreta ("esto es emoción, no miedo").',
        'Cuida la base biológica: sueño, comida real, agua, sol y movimiento. Sin eso, ninguna técnica mental alcanza.',
        'Si vives estresado, ponle horario a la preocupación: 15 minutos al día para escribirla, y fuera de ahí la sustituyes.',
      ]],
      ['Errores comunes', [
        'Creer que pensar positivo cura enfermedades: ayuda a llevarlas, pero no reemplaza al médico.',
        'Culparte por enfermarte "por pensar mal": el estrés es un factor, no la única causa.',
      ]],
    ],
    formulas: ['Pensamiento ↔ emoción ↔ cuerpo (en las dos direcciones)', 'Exhalar más largo que inhalar = calma'],
    nota: 'Las técnicas de esta lectura ayudan a manejar el estrés, pero no reemplazan un tratamiento médico ni psicológico. Si tienes síntomas físicos persistentes o ansiedad que no baja, consulta a un profesional.',
    afirmacion: 'Calmo mi cuerpo con mi respiración y mi mente con mis palabras.',
    practica: [
      'Haz la sesión de respiración 4-4-8 una vez hoy, aunque estés tranquilo.',
      'La próxima vez que sientas nervios, di "estoy emocionado" y nota la diferencia.',
      'Revisa tu base: ¿cuántas horas dormiste, cuánta agua tomaste y cuánto te moviste hoy?',
    ],
    pregunta: '¿Qué pensamiento repetido está afectando mi cuerpo (sueño, apetito, tensión)?',
  }),

  d(18, 'Ley del Espejo y Ley de la Influencia', ['espejo', 'influencia', 'liderazgo', 'respeto', 'autoestima', 'como me tratan', 'inspirar', 'valorar'], {
    idea: 'Los demás tienden a tratarte como tú te tratas, y siguen a quien los inspira y los hace sentir valorados.',
    intro: 'La Ley del Espejo dice que como te tratas a ti mismo, te tratarán los demás. La Ley de la Influencia dice que la gente sigue a quien la inspira y la hace sentir valorada. Juntas hablan de autoestima y liderazgo: cómo te paras frente a ti y frente a otros.',
    bloques: [
      ['Qué dicen', [
        'Si no te respetas (no pones límites, te hablas mal, no cumples lo que te prometes), enseñas a otros a no respetarte.',
        'No influyes por cargo ni por gritar: influyes por el ejemplo y porque la gente se siente vista contigo.',
      ]],
      ['Qué sí está comprobado', [
        'Las personas que se perciben con más valor tienden a poner mejores límites y a elegir relaciones más sanas; y las relaciones sanas, a su vez, suben la autoestima (efecto en las dos direcciones, Orth y Robins).',
        'Reciprocidad (Robert Cialdini): la gente tiende a devolver lo que recibe, sea respeto, ayuda o desprecio.',
        'Liderazgo transformacional: los líderes que inspiran con una visión, dan ejemplo y se interesan por cada persona logran equipos más comprometidos y con mejor rendimiento.',
        'Reconocimiento: sentirse valorado es de los mayores motivadores en el trabajo, a veces más que el dinero.',
      ]],
      ['Ejemplos', [
        'En el equipo de fútbol, el que más influye no siempre es el que más grita: es el que corre todo el partido, da el pase y anima después del error.',
        'Si cumples tus entrenos y tu palabra, los demás empiezan a contar contigo y a respetar tus horarios.',
        'Hablarte mal ("soy un desastre") frente a otros les da permiso de verte así.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Cumple las promesas que te haces: es la base de la autoestima (y por eso empezar pequeño ayuda).',
        'Pon un límite amable y claro esta semana: "Gracias, esta vez no puedo".',
        'Haz sentir importante a alguien: escucha sin mirar el celular, recuerda su nombre y lo que te contó, reconoce algo concreto que hizo bien.',
        'Lidera con el ejemplo: haz tú primero lo que pides (llegar a tiempo, entrenar, no quejarte).',
        'Háblate como le hablarías a un amigo al que respetas.',
      ]],
      ['Errores comunes', [
        'Confundir respeto propio con arrogancia o con no aceptar críticas.',
        'Querer influir con presión o manipulación: funciona un rato y destruye la confianza.',
      ]],
    ],
    formulas: ['Cómo me trato → cómo enseño a otros a tratarme', 'Influencia = ejemplo + hacer sentir valorado'],
    afirmacion: 'Me trato con respeto y enseño a los demás a tratarme igual; inspiro con mi ejemplo.',
    practica: [
      'Cumple hoy una promesa pequeña que te hiciste.',
      'Reconoce a alguien en voz alta por algo concreto que hizo bien.',
      'Pon un límite amable en algo que vienes aceptando sin querer.',
    ],
    pregunta: '¿Qué les estoy enseñando a los demás sobre cómo tratarme?',
  }),

  d(19, 'Regla del 100% - 0% y Ley del Refuerzo Positivo', ['100%', 'relaciones', 'refuerzo positivo', 'pareja', 'familia', 'elogio', 'reconocer', 'premiar', 'ninos'], {
    idea: 'Hazte 100% responsable de tus relaciones sin esperar nada a cambio, y premia lo que quieres que se repita.',
    intro: 'La Regla del 100% - 0% dice que eres 100% responsable de tus relaciones y que das sin esperar que el otro ponga su parte. La Ley del Refuerzo Positivo dice que se repite lo que se premia con reconocimiento y afecto. Juntas son la receta para mejorar cualquier relación.',
    bloques: [
      ['Qué dicen', [
        'No esperas a que el otro cambie para cambiar tú: das el primer paso, pones el 100%.',
        'Las conductas que se reconocen se repiten; las que se ignoran tienden a desaparecer; el castigo frena pero no enseña.',
      ]],
      ['Qué sí está comprobado', [
        'Refuerzo (B. F. Skinner y décadas de investigación): reforzar una conducta aumenta la probabilidad de que se repita. Funciona en niños, adultos, equipos y en ti mismo.',
        'Proporción 5 a 1 (John Gottman): las parejas estables tienen unas 5 interacciones positivas por cada negativa en los conflictos.',
        'Elogiar el esfuerzo ("trabajaste duro") en vez del talento ("eres inteligente") hace que los niños busquen más retos y persistan más (Mueller y Dweck, 1998).',
        'Reciprocidad: dar primero tiende a generar respuesta, aunque no siempre ni de inmediato.',
      ]],
      ['Ejemplos', [
        'Con tu pareja o familia: en vez de reclamar lo que no hacen, nota y agradece lo que sí hacen. Se repite más.',
        'En un conflicto, das el primer paso: "Quiero que estemos bien. ¿Hablamos?".',
        'Contigo mismo: date una recompensa pequeña al cumplir la semana de entrenos (no comida chatarra; algo que no sabotee la meta).',
        'Con un sobrino o un niño: "me encantó cómo lo intentaste" en vez de "eres un genio".',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Elige una relación que quieras mejorar y haz hoy algo por esa persona sin esperar nada.',
        'Reconoce al momento y de forma concreta: "gracias por esperarme, de verdad me ayudó".',
        'Cuida la proporción: por cada crítica, al menos 5 gestos positivos.',
        'En los conflictos: "Cuando pasa ___, me siento ___. ¿Podemos ___?". Nunca "siempre" ni "nunca".',
        'Prémiate a ti mismo por cumplir: el refuerzo también construye tus hábitos.',
      ]],
      ['Errores comunes', [
        'Dar el 100% en una relación abusiva o con alguien que solo toma: el 100-0 no significa aguantar maltrato. Ahí lo responsable es poner límites o irse.',
        'Elogios genéricos o falsos: pierden efecto. Mejor concretos y sinceros.',
      ]],
    ],
    formulas: ['Lo que se refuerza se repite', '5 gestos positivos : 1 crítica', 'Yo pongo el 100%, no espero el 50%'],
    afirmacion: 'Doy lo mejor de mí en mis relaciones y reconozco lo bueno de los demás.',
    practica: [
      'Haz hoy un gesto por alguien sin esperar nada a cambio.',
      'Reconoce 3 cosas concretas que alguien cercano hizo bien.',
      'Ponte una recompensa sana por cumplir tus hábitos esta semana.',
    ],
    pregunta: '¿Qué relación mejoraría si yo diera el primer paso, y cuál sería ese paso?',
  }),

  d(20, 'Ley de la Misión, Ley de la Contribución y Ley del Equilibrio', ['mision', 'proposito', 'contribucion', 'sentido', 'equilibrio', 'ayudar', 'vacio', 'balance'], {
    idea: 'Una vida con sentido tiene un para qué, ayuda a otros y no sacrifica la salud ni los afectos por el éxito.',
    intro: 'La Ley de la Misión dice que todos tenemos una razón para existir y que solo quien la busca la encuentra. La Ley de la Contribución dice que cuanto más impactas positivamente a otros, más sentido tiene tu vida. La Ley del Equilibrio dice que el propósito no es solo éxito profesional, también bienestar personal y espiritual.',
    bloques: [
      ['Qué dicen', [
        'Tener un "para qué" le da dirección a todo lo demás: metas, hábitos y decisiones.',
        'El sentido no se encuentra mirándose a uno mismo, sino sirviendo a algo o a alguien.',
        'Éxito sin salud, sin relaciones o sin paz no es éxito completo.',
      ]],
      ['Qué sí está comprobado', [
        'Propósito y salud: tener un sentido de propósito se asocia con vivir más años y con menor riesgo de enfermedades del corazón (Hill y Turiano, 2014; Alimujiang, 2019).',
        'Viktor Frankl (El hombre en busca de sentido): en los campos de concentración, quienes tenían un "para qué" resistían mejor. "Quien tiene un porqué para vivir puede soportar casi cualquier cómo".',
        'Dar hace feliz: gastar dinero en otros sube más la felicidad que gastarlo en uno mismo (Dunn, Aknin y Norton, 2008). El voluntariado se asocia con más bienestar.',
        'Las relaciones cercanas son el mayor predictor de felicidad y salud a largo plazo (Estudio de Desarrollo Adulto de Harvard, más de 80 años).',
      ]],
      ['Ejemplos', [
        'Tu propósito puede estar en lo que ya haces: el entreno no es solo verte bien, es tener energía para tu familia y jugar fútbol muchos años.',
        'Contribuir en pequeño: ayudar a un compañero nuevo en el gym, enseñarle algo a alguien, compartir esta app.',
        'Equilibrio: una semana con mucho trabajo puede estar bien, pero si llevas meses sin ver a tus amigos ni dormir bien, el éxito se está cobrando caro.',
      ]],
      ['Cómo usarla de la mejor forma', [
        'Escribe tu propósito en una frase: "Mi vida sirve para ___ a ___". No tiene que ser perfecto; se ajusta con los años.',
        'Pregúntate: "Si no tuviera que preocuparme por el dinero, ¿a qué dedicaría mi vida?" y "¿Cuándo pierdo la noción del tiempo?".',
        'Haz una contribución por semana, por pequeña que sea, sin que nadie lo sepa.',
        'Revisa tu equilibrio con la rueda de la vida: califica del 1 al 10 salud, relaciones, trabajo, dinero, crecimiento, diversión y espiritualidad. Mejora el más bajo.',
      ]],
      ['Errores comunes', [
        'Esperar una revelación del propósito: se descubre haciendo, probando y sirviendo.',
        'Vivir solo para otros sin cuidarte: contribuir no es abandonarte.',
      ]],
    ],
    formulas: ['Propósito = lo que amo + lo que hago bien + lo que otros necesitan', 'Sentido ↑ cuando sirvo'],
    nota: 'Si sientes un vacío que dura semanas, poca energía y nada te interesa, puede ser algo más que falta de propósito. Hablar con un psicólogo es un acto de fuerza, no de debilidad.',
    afirmacion: 'Mi vida tiene propósito: sirvo a otros y cuido mi equilibrio.',
    practica: [
      'Escribe tu propósito en una frase (ponlo también en el perfil del Seminario Fénix).',
      'Haz hoy algo por otra persona sin que lo sepa.',
      'Califica tu rueda de la vida del 1 al 10 y elige el área más baja para esta semana.',
    ],
    pregunta: '¿Para qué quiero tener éxito? ¿A quién ayuda mi éxito además de a mí?',
  }),

  d(21, 'Combinar las leyes: tu sistema', ['combinar', 'sistema', 'plan', 'semana', 'resumen', 'todas las leyes', 'casos'], {
    idea: 'Las leyes no se usan solas: se combinan en un sistema simple que repites cada día y revisas cada semana.',
    intro: 'Una ley sola ayuda; varias juntas se multiplican. Esta última lectura junta todo: casos completos donde se combinan varias leyes, y un sistema diario y semanal para que se vuelvan tu forma de vivir.',
    bloques: [
      ['Caso 1: me estanqué en el gym', [
        'Causa y Efecto: reviso lo básico (sueño, proteína, calorías, sobrecarga).',
        '80/20: me enfoco en los 5 factores que dan casi todo el resultado, no en suplementos.',
        'Acumulación: busco +1 rep o +2,5 kg cuando completo el rango, cada semana.',
        'Rendimiento Óptimo: si estoy cansado de semanas, hago una semana de descarga.',
        'Adaptación: cambio UNA variable, la mido 2-3 semanas y ajusto.',
      ]],
      ['Caso 2: quiero ahorrar y no me alcanza', [
        'Control: anoto los gastos en Finanzas (no se mejora lo que no se mide).',
        '80/20: identifico las 3 categorías más grandes y recorto ahí.',
        'Parkinson: ahorro automático el día de pago, antes de que el gasto llene todo.',
        'Acumulación: un ahorro pequeño diario se vuelve grande en un año.',
        'Aprendizaje: 30 minutos diarios de una habilidad que suba mis ingresos.',
      ]],
      ['Caso 3: tengo un partido importante', [
        'Equivalente Mental: visualizo 3 jugadas y un plan para el error ("si fallo, siguiente jugada").',
        'Respuesta Biológica: respiración 4-4-8 antes de salir; "estoy emocionado", no "nervioso".',
        'Relajación: en el penal o el remate, decido antes y ejecuto sin pensar la técnica.',
        'Sustitución: después de un error, ¡ALTO! y la siguiente acción.',
        'Influencia: animo a un compañero después de su error.',
      ]],
      ['Caso 4: no tengo ganas de nada', [
        'Acción: 5 minutos de lo más simple (caminar, ordenar).',
        'Hábito: hago la versión mínima de mi rutina, no rompo la cadena dos veces.',
        'Contribución: hago algo por alguien.',
        'Misión: releo para qué hago todo esto.',
        'Si dura semanas, hablo con un profesional.',
      ]],
      ['El sistema diario', [
        'Mañana (5 min): sesión "Activa tus leyes": causa del día, expectativa, plan si-entonces y primer paso.',
        'Durante el día: 80/20 para elegir la tarea principal, Parkinson para ponerle hora, 5 minutos para empezar, ¡ALTO! ante lo negativo.',
        'Noche (3 min): diario "¿Qué ley usé hoy?": qué ley usé, qué pasó y qué ley usaré mañana.',
      ]],
      ['El sistema semanal (domingo, 15 min)', [
        'Revisa los números de la semana: entrenos, comidas, gastos.',
        'Pregunta 80/20: ¿qué 20% dio el 80% del avance? ¿Qué me frenó?',
        'Haz la evaluación "¿Qué leyes estoy rompiendo?" y elige UNA ley para la semana.',
        'Escribe una ficha 🔬 Aplicar una ley con esa ley.',
      ]],
    ],
    formulas: ['Situación → ley → acción si-entonces → medir → ajustar', 'Una ley por semana × 52 semanas = una vida distinta'],
    nota: 'Cuando termines las 21 lecturas, empieza otra vuelta: cada vez entenderás las leyes desde un lugar distinto, porque tú también habrás cambiado. El repaso espaciado (lectura 14) es lo que las fija.',
    afirmacion: 'Uso las leyes del éxito cada día: actúo, mido y ajusto.',
    practica: [
      'Elige el caso que más se parece a tu vida hoy y aplica sus pasos.',
      'Haz la evaluación "¿Qué leyes estoy rompiendo?" en Herramientas.',
      'Agenda tu revisión semanal del domingo (15 minutos).',
    ],
    pregunta: 'De todas las leyes, ¿cuáles 3 cambiarían más mi vida si las aplicara todos los días?',
  }),
];

// Las 41 leyes y reglas del seminario, más los principios científicos que las respaldan
const LEYES = [
  ['Ley de Causa y Efecto', 'Todo efecto tiene una causa. Cambia la causa (pensamientos y acciones) y cambias el resultado.', [1, 21]],
  ['Ley del Control', 'Tu bienestar depende del grado de control que sientes sobre tu vida.', [2]],
  ['Ley del Accidente', 'No planificar es planificar el fracaso: sin metas, la vida queda al azar.', [2]],
  ['Ley de la Creencia', 'Lo que crees cambia lo que intentas, cuánto insistes y lo que ves.', [3]],
  ['Ley de la Expectativa', 'Lo que esperas con confianza cambia cómo actúas y cómo te tratan, y tiende a cumplirse.', [3]],
  ['Ley de la Atracción', 'Una meta clara dirige tu atención y tus acciones hacia lo que quieres (no funciona sin acción).', [4]],
  ['Ley de la Correspondencia', 'Tu mundo exterior refleja tus hábitos y tu mundo interior.', [4]],
  ['Ley de la Atracción Social', 'Te juntas con gente parecida a ti y te vuelves parecido a tu entorno.', [4]],
  ['Ley de la Actividad Subconsciente', 'Lo que repites con emoción se vuelve automático.', [5]],
  ['Ley de la Concentración', 'Lo que piensas constantemente crece en tu vida.', [5]],
  ['Ley del Equivalente Mental', 'Todo logro existe antes en la mente: visualiza el resultado, el obstáculo y el plan.', [5, 21]],
  ['Ley de la Sustitución', 'La mente sostiene un pensamiento consciente a la vez: reemplaza el negativo, no lo reprimas.', [6, 21]],
  ['Ley de la Acumulación', 'Cada pensamiento y acción se suma con el tiempo y construye tu realidad.', [7, 21]],
  ['Regla del 1% diario', 'Mejorar 1% cada día se acumula como interés compuesto (1,01^365 ≈ 37,8).', [7]],
  ['Ley del Crecimiento Continuo', 'La genialidad es un proceso, no un destino.', [7]],
  ['Ley del Hábito', 'La energía no viene de la motivación sino de repetir hábitos saludables.', [8, 21]],
  ['Regla de los 21 días', 'Sirve para arrancar; un hábito tarda en promedio unos 66 días en ser automático.', [8]],
  ['Ley de la Acción', 'El miedo se disuelve al actuar; sin acción, una idea no tiene valor.', [9, 21]],
  ['Ley de la Inercia', 'El primer paso es el más difícil; después el impulso te lleva.', [9]],
  ['Regla de los 5 minutos', 'Si te cuesta empezar, comprométete solo 5 minutos.', [9]],
  ['Ley del 80/20 (Pareto)', 'Cerca del 80% de los resultados viene del 20% de las acciones.', [10, 21]],
  ['Ley de Parkinson', 'El trabajo (y el gasto) se expande hasta llenar lo disponible: ponte plazos.', [11, 21]],
  ['Ley del Rendimiento Óptimo', 'Más horas no significan más productividad: haz pausas y recupérate.', [12, 21]],
  ['Ley de la Relajación', 'En el trabajo mental y de precisión, menos tensión da mejores resultados.', [12, 21]],
  ['Ley de la Atención', 'Aprendes y rindes más cuando estás totalmente enfocado en una cosa.', [13]],
  ['Ley del Estado Mental', 'Se aprende mejor relajado, curioso y motivado.', [13]],
  ['Ley de la Repetición Espaciada', 'Repasar en intervalos (1, 3, 7 y 30 días) retiene mucho más que estudiar de una vez.', [14]],
  ['Ley del Aprendizaje', 'A mayor conocimiento, más oportunidades. El error revisado es aprendizaje.', [14, 21]],
  ['Ley de la Asociación', 'Las ideas más innovadoras combinan conocimientos de distintas áreas.', [15]],
  ['Ley de la Incubación', 'Al soltar un problema (caminar, dormir), el cerebro sigue buscando la solución.', [15]],
  ['Ley de la Simplicidad', 'La solución más simple suele ser la mejor: pruébala primero.', [16]],
  ['Ley del Pensamiento Lateral', 'Ver el problema desde otro ángulo (o invertirlo) genera soluciones nuevas.', [16]],
  ['Ley de la Adaptación', 'Un plan es una hipótesis: pruébalo, mídelo y ajústalo.', [16, 21]],
  ['Ley de la Respuesta Biológica', 'Pensamientos, emociones y cuerpo se afectan en las dos direcciones.', [17, 21]],
  ['Ley del Espejo', 'Como te tratas a ti mismo, enseñas a los demás a tratarte.', [18]],
  ['Ley de la Influencia', 'La gente sigue a quien la inspira con el ejemplo y la hace sentir valorada.', [18, 21]],
  ['Regla del 100% - 0%', 'Eres 100% responsable de tus relaciones, sin esperar nada a cambio (pero sin aguantar maltrato).', [19]],
  ['Ley del Refuerzo Positivo', 'Se repite lo que se premia con reconocimiento y afecto.', [19]],
  ['Ley de la Misión', 'Todos tenemos un para qué; se descubre haciendo y sirviendo.', [20, 21]],
  ['Ley de la Contribución', 'Cuanto más ayudas a otros, más sentido tiene tu vida.', [20, 21]],
  ['Ley del Equilibrio', 'El éxito completo incluye salud, relaciones y paz, no solo logros.', [20]],
  // Respaldo científico
  ['Locus de control (Rotter)', 'Creer que tus actos influyen en tu vida predice mejores hábitos y más resiliencia.', [1, 2]],
  ['Intenciones si-entonces (Gollwitzer)', '"Si pasa X, entonces haré Y": casi duplica la probabilidad de cumplir.', [1, 5]],
  ['Efecto Pygmalion', 'Las expectativas de otros (y las tuyas) cambian el trato y el rendimiento.', [3]],
  ['Autoeficacia (Bandura)', 'Creer que eres capaz de una tarea concreta; se construye con pequeños logros.', [3]],
  ['Atención selectiva', 'Tu cerebro nota lo que es importante para tus metas (el "carro rojo").', [4]],
  ['WOOP / contraste mental (Oettingen)', 'Deseo, resultado, obstáculo y plan: soñar y planear vence a solo soñar.', [5]],
  ['Efecto del oso blanco (Wegner)', 'Intentar no pensar en algo lo trae más: sustituye en vez de reprimir.', [6]],
  ['Interés compuesto', 'Lo pequeño y constante crece cada vez más rápido con el tiempo.', [7]],
  ['Sobrecarga progresiva', 'El músculo crece si cada semana le pides un poco más (peso, reps o series).', [7, 21]],
  ['Ciclo del hábito', 'Señal → rutina → recompensa. Hazlo obvio, atractivo, fácil y satisfactorio.', [8]],
  ['Efecto Zeigarnik', 'Lo empezado y no terminado se queda en la mente y empuja a terminarlo.', [9]],
  ['Matriz de Eisenhower', 'Importante y urgente: hazlo; importante: agéndalo; urgente: delégalo; ninguno: elimínalo.', [10]],
  ['Ley de Yerkes-Dodson', 'Un poco de activación mejora el rendimiento; demasiada lo empeora.', [12]],
  ['Curva del olvido (Ebbinghaus)', 'Lo nuevo se olvida rápido si no se repasa; cada repaso la aplana.', [14]],
  ['Práctica de recuperación', 'Intentar recordar sin mirar fija más que releer.', [14]],
  ['Navaja de Ockham', 'Entre soluciones que funcionan igual, la más simple suele ser la mejor.', [16]],
  ['Proporción 5 a 1 (Gottman)', 'Cinco interacciones positivas por cada negativa sostienen una relación.', [19]],
];

const CONSEJOS = [
  // ---------- Mente ----------
  { id: 'negativo', icono: '🌧️', texto: 'Tengo pensamientos negativos', claves: ['negativo', 'pensamientos negativos', 'pesimista', 'mente', 'rumiar', 'no paro de pensar'], dias: [6, 17, 3],
    ahora: ['Ley de la Sustitución: nota el pensamiento, di ¡ALTO! y pregúntate si es 100% verdad.', 'Cámbialo por una frase realista y orientada a la acción, y haz algo de inmediato (5 minutos).', 'Si no se va, entra por el cuerpo: respiración 4-4-8 o camina 10 minutos.'],
    pregunta: '¿Qué le diría a un amigo que pensara esto de sí mismo?', afirmacion: 'Elijo mis pensamientos y cambio los que no me sirven.' },
  { id: 'no-creo', icono: '🪞', texto: 'No creo que pueda lograrlo', claves: ['no puedo', 'no soy capaz', 'inseguro', 'creencia', 'creencias', 'limitante', 'dudo', 'confianza'], dias: [3, 7, 9],
    ahora: ['Ley de la Creencia: escribe la creencia ("no soy capaz de…") y 3 pruebas de que no siempre es verdad.', 'Autoeficacia: ponte una meta tan pequeña que la cumplas seguro hoy.', 'Expectativa: cambia "no puedo" por "estoy aprendiendo a…" y actúa como lo haría alguien que sí puede.'],
    pregunta: '¿De dónde saqué esta creencia y la he comprobado alguna vez?', afirmacion: 'Cada logro me demuestra que soy capaz.' },
  { id: 'sin-control', icono: '🌀', texto: 'Siento que no controlo mi vida', claves: ['control', 'descontrol', 'caos', 'todo me pasa', 'victima', 'azar', 'desordenado'], dias: [2, 1, 4],
    ahora: ['Ley del Control: haz dos columnas, lo que controlo y lo que no. Suelta la segunda.', 'Ley del Accidente: planifica mañana completo esta noche (entreno, comidas, tarea principal).', 'Gana en algo pequeño ahora: tiende la cama, ordena el escritorio o haz una tarea pendiente de 5 minutos.'],
    herramienta: 'aplicar', pregunta: '¿Qué parte de mi vida estoy dejando en manos del azar?', afirmacion: 'Dirijo mi vida y suelto lo que no depende de mí.' },
  { id: 'nervios', icono: '😬', texto: 'Estoy nervioso antes de algo importante', claves: ['nervios', 'nervioso', 'ansiedad', 'presion', 'examen', 'entrevista', 'penal', 'partido importante'], dias: [17, 12, 5],
    ahora: ['Respuesta Biológica: haz 5 respiraciones 4-4-8 (exhala más largo de lo que inhalas).', 'Reinterpreta: di "estoy emocionado" en vez de "estoy nervioso". La energía es la misma; el significado cambia el resultado.', 'Relajación: decide tu plan antes y luego ejecuta sin pensar en la técnica. Si fallas, siguiente acción.'],
    pregunta: '¿Qué es lo peor que realmente puede pasar y cómo lo manejaría?', afirmacion: 'Convierto los nervios en energía y rindo con calma.' },
  { id: 'estresado', icono: '😮‍💨', texto: 'Estoy estresado o agotado', claves: ['estres', 'estresado', 'agotado', 'cansado', 'quemado', 'burnout', 'abrumado', 'agobiado'], dias: [12, 17, 2],
    ahora: ['Rendimiento Óptimo: haz una pausa real de 10 minutos ya, sin celular.', 'Control: escribe todo lo que tienes pendiente y separa lo que controlas de lo que no.', 'Respuesta Biológica: esta noche, sueño primero (misma hora, sin pantallas). Sin descanso, nada funciona.'],
    pregunta: '¿Qué estoy cargando que podría soltar, delegar o posponer?', afirmacion: 'Descanso sin culpa; el descanso también es parte del trabajo.' },

  // ---------- Acción y hábitos ----------
  { id: 'procrastino', icono: '⏳', texto: 'Estoy procrastinando', claves: ['procrastinar', 'procrastinando', 'aplazar', 'pereza', 'empezar', 'arrancar', 'postergar', 'despues lo hago'], dias: [9, 11, 10],
    ahora: ['Regla de los 5 minutos: pon un temporizador y trabaja solo 5 minutos en lo que evitas.', 'Ley de Parkinson: ponle hora de inicio y de fin a la tarea, hoy mismo.', '80/20: si tienes muchas cosas, haz primero la que más resultado da.'],
    pregunta: '¿Qué emoción estoy evitando con esta tarea (aburrimiento, miedo, duda)?', afirmacion: 'Actúo aunque no tenga ganas; empezar es mi superpoder.' },
  { id: 'constancia', icono: '🧱', texto: 'Empiezo cosas y las abandono', claves: ['abandono', 'constancia', 'disciplina', 'dejo', 'rendirme', 'habito', 'habitos', 'no soy constante'], dias: [8, 7, 9],
    ahora: ['Ley del Hábito: reduce el hábito a 2 minutos (la versión que harías en tu peor día).', 'Apílalo: "Después de ___, haré ___".', 'Regla de oro: nunca falles dos veces seguidas. Hoy, la versión mínima.'],
    herramienta: 'aplicar', pregunta: '¿Cuál es la versión mínima de mi hábito que puedo hacer pase lo que pase?', afirmacion: 'Soy constante: nunca fallo dos veces seguidas.' },
  { id: 'sin-tiempo', icono: '⌛', texto: 'No me alcanza el tiempo', claves: ['tiempo', 'no me alcanza', 'ocupado', 'productividad', 'prioridades', 'muchas cosas', 'organizar'], dias: [10, 11, 13],
    ahora: ['80/20: escribe todo lo pendiente y marca las 2 tareas que más resultado dan. Esas primero.', 'Eisenhower: lo que no es importante, delégalo o elimínalo.', 'Parkinson y Atención: bloques de 50 minutos con el celular en otro cuarto.'],
    pregunta: '¿Qué hago cada semana que podría dejar de hacer sin que pase nada grave?', afirmacion: 'Hago primero lo que más importa.' },
  { id: 'estancado', icono: '📉', texto: 'Me estanqué (gym, peso o progreso)', claves: ['estancado', 'estancamiento', 'meseta', 'no avanzo', 'gym', 'peso', 'fuerza', 'progreso'], dias: [21, 7, 1],
    ahora: ['Causa y Efecto: revisa lo básico: sueño, proteína, calorías reales y si subes peso o reps cada semana.', 'Acumulación: mira tus datos de 4 semanas en Progreso, no un solo día.', 'Adaptación: cambia UNA variable por 2-3 semanas y mide otra vez. Si llevas meses duro, prueba una semana de descarga.'],
    herramienta: 'aplicar', pregunta: '¿Qué hago "casi siempre" que en realidad no hago consistente?', afirmacion: 'Cada semana mejoro un 1%; confío en el proceso.' },
  { id: 'sin-ganas', icono: '🔋', texto: 'No tengo ganas de nada', claves: ['sin ganas', 'desmotivado', 'motivacion', 'flojera', 'desanimado', 'apatia', 'no quiero hacer nada'], dias: [9, 8, 20],
    ahora: ['Ley de la Acción: la motivación llega DESPUÉS de empezar. Haz 5 minutos de lo más simple.', 'Ley del Hábito: haz la versión mínima de tu rutina para no romper la cadena.', 'Ley de la Contribución: haz algo pequeño por alguien. Si esto dura semanas, habla con un profesional.'],
    pregunta: '¿Para qué empecé todo esto? ¿Sigue siendo importante para mí?', afirmacion: 'Actúo primero; las ganas llegan después.' },
  { id: 'entrenar', icono: '🏋️', texto: 'No tengo ganas de entrenar', claves: ['entrenar', 'entreno', 'gimnasio', 'ejercicio', 'ir al gym', 'faltar al gym'], dias: [9, 8, 18],
    ahora: ['Regla de los 5 minutos: solo ponte la ropa y calienta. Casi nunca te devuelves.', 'Ley del Hábito: día malo = sesión mínima (la mitad de series), pero no rompes la cadena.', 'Ley del Espejo: cumplir la promesa que te hiciste es lo que construye tu autoestima.'],
    pregunta: '¿Cómo actuaría hoy la versión de mí que ya tiene el cuerpo que quiero?', afirmacion: 'Soy alguien que no falta; cada entreno es un voto por esa persona.' },
  { id: 'dieta', icono: '🥗', texto: 'Me salgo de la dieta', claves: ['dieta', 'comer', 'comida', 'antojo', 'dulce', 'ansiedad por comer', 'me sali de la dieta'], dias: [8, 6, 17],
    ahora: ['Hábito: cambia el entorno. Comida del día preparada y nada de dulces a la vista.', 'Sustitución: "ya arruiné el día" → ¡ALTO! → "la siguiente comida vuelve al plan".', 'Respuesta Biológica: antes de comer fuera del plan, un vaso de agua y 10 minutos. ¿Es hambre o es emoción?'],
    pregunta: '¿Qué emoción o situación hay detrás de cada vez que me salgo?', afirmacion: 'Elijo lo que me nutre; un error no arruina mi hábito.' },

  // ---------- Metas, dinero y aprendizaje ----------
  { id: 'sin-metas', icono: '🧭', texto: 'No tengo metas claras', claves: ['metas', 'meta', 'rumbo', 'perdido', 'que quiero', 'objetivos', 'sin direccion'], dias: [2, 5, 20],
    ahora: ['Ley del Accidente: sin meta, decide el azar. Escribe UNA meta con número y fecha.', 'Equivalente Mental: haz un WOOP: deseo, resultado, obstáculo y plan.', 'Atracción: léela cada mañana para que tu cerebro note oportunidades.'],
    sesion: 'activa-leyes', pregunta: '¿Qué quiero de verdad dentro de un año, si nadie me juzgara?', afirmacion: 'Sé lo que quiero y cada día me acerco.' },
  { id: 'dinero', icono: '💸', texto: 'Tengo problemas de dinero', claves: ['dinero', 'plata', 'deudas', 'deuda', 'ahorrar', 'ahorro', 'gastos', 'no me alcanza la plata'], dias: [21, 10, 11],
    ahora: ['Control: anota todos tus gastos (sección Finanzas). Lo que no se mide no mejora.', '80/20: encuentra las 3 categorías más grandes y recorta ahí, no en lo pequeño.', 'Parkinson: ahorro automático el día de pago. Ley del Aprendizaje: 30 minutos diarios de una habilidad que suba tus ingresos.'],
    pregunta: '¿Qué habilidad, si la dominara, aumentaría más mis ingresos?', afirmacion: 'Manejo mi dinero con claridad y cada mes mejoro.' },
  { id: 'estudiar', icono: '📚', texto: 'Quiero aprender o estudiar mejor', claves: ['aprender', 'estudiar', 'memoria', 'examen', 'olvido', 'recordar', 'curso'], dias: [14, 13, 15],
    ahora: ['Repetición Espaciada: repasa a los 1, 3, 7 y 30 días.', 'Práctica de recuperación: cierra el libro y explícalo en voz alta.', 'Atención: bloques de 25-50 minutos con el celular en otro cuarto.'],
    pregunta: '¿Qué estoy releyendo que debería practicar recordando?', afirmacion: 'Aprendo rápido y recuerdo con facilidad.' },
  { id: 'ideas', icono: '💡', texto: 'Estoy bloqueado o necesito ideas', claves: ['ideas', 'creatividad', 'bloqueado', 'atascado', 'innovar', 'no se me ocurre', 'solucion'], dias: [15, 16, 5],
    ahora: ['Asociación: escribe 20 ideas sin filtrar y combina dos de áreas distintas.', 'Incubación: suelta el problema; camina, dúchate o duerme con la pregunta en mente.', 'Pensamiento Lateral: invierte el problema: ¿cómo lo empeoraría? Haz lo contrario.'],
    pregunta: '¿Cómo resolvería esto alguien de un campo totalmente distinto?', afirmacion: 'Mi mente encuentra soluciones mientras descanso.' },
  { id: 'decidir', icono: '⚖️', texto: 'No logro tomar una decisión', claves: ['decidir', 'decision', 'indeciso', 'dudas', 'elegir', 'opciones'], dias: [16, 15, 11],
    ahora: ['Simplicidad: escribe las opciones y la más simple que podría funcionar.', 'Parkinson: ponte un plazo corto para decidir. La mayoría de decisiones se pueden ajustar.', 'Incubación: consúltalo con la almohada una noche y escucha tu primera intuición.'],
    pregunta: '¿Qué elegiría si no tuviera miedo?', afirmacion: 'Decido con claridad y ajusto el rumbo si hace falta.' },
  { id: 'miedo', icono: '😨', texto: 'Tengo miedo a fracasar', claves: ['miedo', 'fracaso', 'fracasar', 'rechazo', 'verguenza', 'que diran', 'equivocarme'], dias: [9, 14, 3],
    ahora: ['Ley de la Acción: da el paso más pequeño hacia lo que temes, hoy. El miedo se encoge actuando.', 'Ley del Aprendizaje: el error revisado es información, no una sentencia.', 'Expectativa: espera lo mejor y prepara un plan B para lo peor.'],
    pregunta: '¿Qué haría si supiera que no puedo fracasar?', afirmacion: 'Actúo con miedo y cada intento me enseña algo.' },

  // ---------- Relaciones y sentido ----------
  { id: 'relacion', icono: '🤝', texto: 'Tengo problemas con alguien', claves: ['relacion', 'relaciones', 'pareja', 'familia', 'amigo', 'conflicto', 'pelea', 'discusion'], dias: [19, 18, 6],
    ahora: ['100% - 0%: da tú el primer paso sin esperar que el otro cambie.', 'Refuerzo Positivo: reconoce 3 cosas concretas que esa persona hace bien.', 'Habla sin atacar: "Cuando pasa ___, me siento ___. ¿Podemos ___?". Si hay maltrato, el límite es lo responsable.'],
    pregunta: '¿Qué hago yo que hace esta relación más difícil?', afirmacion: 'Doy lo mejor de mí y reconozco lo bueno de los demás.' },
  { id: 'respeto', icono: '🚧', texto: 'Siento que no me respetan', claves: ['respeto', 'no me respetan', 'abusan', 'se aprovechan', 'limites', 'decir que no', 'me pasan por encima'], dias: [18, 19, 2],
    ahora: ['Ley del Espejo: revisa cómo te tratas tú (¿cumples lo que te prometes? ¿te hablas con respeto?).', 'Pon un límite amable y claro hoy: "Gracias, esta vez no puedo".', 'Influencia: actúa con calma y coherencia; el respeto se gana con ejemplo, no con gritos.'],
    pregunta: '¿Qué estoy permitiendo que me gustaría dejar de permitir?', afirmacion: 'Me respeto y enseño a los demás a respetarme.' },
  { id: 'entorno', icono: '👥', texto: 'Mi entorno no me ayuda', claves: ['entorno', 'amigos', 'gente toxica', 'malas influencias', 'nadie me apoya', 'rodearme'], dias: [4, 18, 20],
    ahora: ['Atracción Social: haz la lista de tus 5 personas más cercanas y cómo influye cada una.', 'Suma una persona o grupo que ya vive como quieres vivir (equipo, gym, curso).', 'Conviértete en la persona que quieres atraer: tu ejemplo cambia a tu entorno.'],
    pregunta: '¿Con quién necesito pasar más tiempo y con quién menos?', afirmacion: 'Me rodeo de personas que me impulsan y yo impulso a otros.' },
  { id: 'liderar', icono: '🧑‍🏫', texto: 'Quiero liderar o influir mejor', claves: ['liderar', 'liderazgo', 'influir', 'influencia', 'equipo', 'jefe', 'capitan', 'motivar a otros'], dias: [18, 19, 9],
    ahora: ['Influencia: haz tú primero lo que pides (llegar a tiempo, esforzarte, no quejarte).', 'Refuerzo Positivo: reconoce en público y de forma concreta lo que alguien hizo bien.', 'Escucha de verdad: celular fuera, pregunta y recuerda lo que te contaron.'],
    pregunta: '¿Qué persona me inspiró más en la vida y qué hacía?', afirmacion: 'Inspiro con mi ejemplo y hago sentir valorados a los demás.' },
  { id: 'sentido', icono: '🕳️', texto: 'Siento que mi vida no tiene sentido', claves: ['sentido', 'proposito', 'vacio', 'para que', 'mision', 'da igual', 'triste'], dias: [20, 9, 19],
    ahora: ['Ley de la Contribución: haz algo por otra persona hoy, por pequeño que sea.', 'Ley de la Misión: escribe "Si no tuviera que preocuparme por el dinero, me dedicaría a…".', 'Equilibrio: muévete y sal al sol 20 minutos. Si el vacío dura semanas, habla con un psicólogo.'],
    pregunta: '¿Cuándo fue la última vez que perdí la noción del tiempo haciendo algo?', afirmacion: 'Mi vida tiene propósito y lo encuentro sirviendo.' },
  { id: 'equilibrio', icono: '⚖️', texto: 'Mi vida está desbalanceada', claves: ['equilibrio', 'balance', 'desbalance', 'solo trabajo', 'descuido', 'rueda de la vida'], dias: [20, 12, 2],
    ahora: ['Ley del Equilibrio: califica del 1 al 10 salud, relaciones, trabajo, dinero, crecimiento, diversión y espiritualidad.', 'Elige el área más baja y ponle una acción para esta semana.', 'Rendimiento Óptimo: agenda descanso y tiempo con la gente que quieres como si fueran citas de trabajo.'],
    pregunta: '¿Qué estoy sacrificando hoy que me va a doler en 5 años?', afirmacion: 'Cuido todas las áreas de mi vida, no solo una.' },
];

const GRUPOS = [
  ['🧠 Mente y emociones', ['negativo', 'no-creo', 'sin-control', 'nervios', 'estresado', 'miedo']],
  ['🚀 Acción y hábitos', ['procrastino', 'constancia', 'sin-tiempo', 'sin-ganas']],
  ['💪 Cuerpo y gym', ['entrenar', 'estancado', 'dieta']],
  ['🎯 Metas, dinero y aprendizaje', ['sin-metas', 'dinero', 'estudiar', 'ideas', 'decidir']],
  ['🤝 Relaciones y sentido', ['relacion', 'respeto', 'entorno', 'liderar', 'sentido', 'equilibrio']],
];

const RUTINA = [
  ['☀️ Al despertar', [
    'Sesión "Activa tus leyes" (5 min): causa del día, expectativa, plan si-entonces y primer paso.',
    'Lee tu meta principal (Atracción: le dices a tu cerebro qué notar).',
    'Lee la ley del día y elige cómo la vas a aplicar hoy.',
  ]],
  ['💼 Durante el día', [
    '80/20: haz primero las 2 tareas que más resultado dan.',
    'Parkinson: cada tarea con hora de inicio y fin; pomodoros 25/5 o 50/10.',
    'Regla de los 5 minutos para lo que cueste empezar.',
    'Sustitución: ¡ALTO! ante cada pensamiento negativo.',
    'Atención: celular fuera de la vista en el trabajo y en el entreno.',
    'Refuerzo Positivo: reconoce a alguien por algo concreto.',
  ]],
  ['🌙 Antes de dormir', [
    'Diario: qué ley usé hoy, qué pasó y qué ley usaré mañana.',
    'Planifica mañana (Ley del Accidente).',
    'Incubación: hazle a tu mente una pregunta sobre tu problema principal.',
    'Respuesta Biológica: respiración 4-4-8 si hay tensión.',
  ]],
  ['📅 Cada domingo', [
    'Revisa tus números: entrenos, comidas y gastos.',
    '¿Qué 20% dio el 80% del avance? ¿Qué me frenó?',
    'Haz la evaluación "¿Qué leyes estoy rompiendo?" y elige UNA ley para la semana.',
  ]],
];

const FICHAS = {
  aplicar: { icono: '🔬', titulo: 'Aplicar una ley', lectura: 1, nueva: '+ Aplicar una ley', campos: [
    ['situacion', 'Situación: el resultado que no me gusta o lo que quiero lograr (en una frase)'],
    ['ley', 'Ley que voy a usar (busca en ⚖️ Leyes)'],
    ['causas', 'Causas que dependen de mí'],
    ['plan', 'Mi plan "si… entonces…": si pasa ___, entonces haré ___'],
    ['medida', '¿Con qué número o señal sabré si funciona?'],
    ['revision', 'Fecha de revisión (1-2 semanas)', 'date'],
    ['resultado', 'Resultado: ¿qué pasó?'],
    ['ajuste', 'Ajuste: qué mantengo y qué cambio'],
  ] },
  woop: { icono: '🎯', titulo: 'WOOP: meta con plan', lectura: 5, nueva: '+ Nuevo WOOP', campos: [
    ['deseo', 'Deseo: ¿qué quiero lograr? (una frase)'],
    ['resultado', 'Resultado: lo mejor de lograrlo (imagínalo 1 minuto)'],
    ['obstaculo', 'Obstáculo: ¿qué DENTRO de mí me va a frenar?'],
    ['plan', 'Plan: si aparece [obstáculo], entonces haré [acción]'],
  ] },
  creencia: { icono: '🧠', titulo: 'Cambiar una creencia', lectura: 3, nueva: '+ Nueva creencia', campos: [
    ['creencia', 'La creencia limitante ("Yo no soy…", "Yo nunca…")'],
    ['origen', '¿De dónde viene? ¿Quién me lo dijo o qué pasó?'],
    ['pruebas', '3 pruebas de que no siempre es verdad'],
    ['nueva', 'Nueva creencia, creíble y en crecimiento ("Estoy aprendiendo a…")'],
    ['accion', 'Acción pequeña de hoy que la demuestra'],
  ] },
};

// "¿Qué leyes estás rompiendo?": frases en primera persona; la categoría con más marcas es la ley a trabajar
const EVALUACIONES = {
  rompiendo: {
    icono: '🩺', titulo: '¿Qué leyes estás rompiendo?', lectura: 21,
    intro: 'Marca las frases que describen tu última semana. El resultado te dice qué grupo de leyes te conviene trabajar primero. Hazla cada domingo.',
    categorias: {
      mente: { nombre: 'Mente (Creencia, Expectativa, Sustitución)', consejo: 'Tu mente te está frenando. Esta semana: técnica ¡ALTO! cada día, la ficha "Cambiar una creencia" y la sesión "Me hablo bien". Relee las lecturas 3 y 6.' },
      accion: { nombre: 'Acción (Acción, Inercia, 80/20, Parkinson)', consejo: 'Sabes qué hacer pero no lo haces. Esta semana: regla de los 5 minutos para lo que evitas, 2 tareas 80/20 primero y hora de fin para cada una. Relee las lecturas 9, 10 y 11.' },
      constancia: { nombre: 'Constancia (Hábito, Acumulación, 1%)', consejo: 'Empiezas bien y se cae. Esta semana: versión de 2 minutos de tu hábito y nunca fallar dos veces. Mide en la app. Relee las lecturas 7 y 8.' },
      energia: { nombre: 'Energía (Rendimiento Óptimo, Respuesta Biológica)', consejo: 'Estás forzando sin recuperar. Esta semana: sueño primero, pausas reales y respiración 4-4-8 diaria. Considera una semana de descarga. Relee las lecturas 12 y 17.' },
      relaciones: { nombre: 'Relaciones (Espejo, 100-0, Refuerzo)', consejo: 'Tus relaciones necesitan atención. Esta semana: un gesto sin esperar nada, 5 reconocimientos por cada crítica y un límite amable. Relee las lecturas 18 y 19.' },
      proposito: { nombre: 'Propósito (Misión, Contribución, Equilibrio)', consejo: 'Te falta el para qué o estás desbalanceado. Esta semana: escribe tu propósito, haz una contribución anónima y mejora el área más baja de tu rueda de la vida. Relee la lectura 20.' },
    },
    items: [
      ['Me dije varias veces que no soy capaz de algo.', 'mente'],
      ['Me quedé dándole vueltas a un pensamiento negativo.', 'mente'],
      ['Esperé que algo me saliera mal antes de intentarlo.', 'mente'],
      ['Dejé para después algo importante.', 'accion'],
      ['Pasé el día ocupado en cosas urgentes pero poco importantes.', 'accion'],
      ['Una tarea me tomó mucho más tiempo del necesario.', 'accion'],
      ['Falté a un hábito dos días seguidos o más.', 'constancia'],
      ['Empecé algo con fuerza y ya lo dejé.', 'constancia'],
      ['No medí mi progreso (entrenos, comida o gastos).', 'constancia'],
      ['Dormí mal o poco varios días.', 'energia'],
      ['Trabajé o entrené sin pausas y me sentí agotado.', 'energia'],
      ['Me sentí tenso o ansioso sin hacer nada para bajarlo.', 'energia'],
      ['Esperé que otra persona diera el primer paso.', 'relaciones'],
      ['Critiqué más de lo que reconocí lo bueno.', 'relaciones'],
      ['Acepté algo que no quería por no decir que no.', 'relaciones'],
      ['Sentí que lo que hago no tiene mucho sentido.', 'proposito'],
      ['No hice nada por nadie sin esperar algo a cambio.', 'proposito'],
      ['Descuidé un área importante (salud, familia, diversión).', 'proposito'],
    ],
  },
};

const t = (nombre, musculo, seg, desc) => ({ nombre, musculo, seg, lados: false, desc });

export default {
  id: 'leyes',
  titulo: 'Las Leyes del Éxito',
  autor: 'Guía práctica del Seminario Fénix',
  icono: '⚖️',
  descripcion: '21 lecturas, una por día, con cada ley explicada, ejemplos y cómo usarla',
  unidad: 'Día',
  lecturas: LECTURAS,
  conceptos: { titulo: 'Leyes', icono: '⚖️', lista: LEYES.map(([nombre, texto, dias]) => ({ nombre, texto, dias })) },
  consejos: CONSEJOS,
  grupos: GRUPOS,
  rutina: RUTINA,
  diario: {
    titulo: '🌙 Noche: ¿qué ley usé hoy?',
    campos: [
      ['usada', '⚖️ ¿Qué ley usé hoy y qué pasó?'],
      ['rompi', '🩹 ¿Qué ley rompí y qué aprendí?'],
      ['manana', '🌅 Mañana voy a aplicar la ley… así:'],
    ],
    ayer: ['manana', '📌 La ley que te propusiste aplicar hoy'],
  },
  fichas: FICHAS,
  evaluaciones: EVALUACIONES,
  perfil: {
    titulo: '⚖️ Mis leyes',
    campos: [
      ['top', '🏆 Las 3 leyes que más cambian mi vida (y por qué)'],
      ['reglas', '📜 Mis reglas personales "si… entonces…" (una por línea)'],
      ['minimos', '🧱 La versión mínima de mis hábitos para los días malos'],
      ['entorno', '👥 Las personas y lugares que me acercan a quien quiero ser'],
    ],
  },
  sesiones: [
    {
      id: 'activa-leyes', nombre: 'Activa tus leyes', tipo: 'mente', pasos: [
        t('Respira y observa', 'Llegar', 30, 'Tres respiraciones lentas, exhalando largo. Nota cómo amaneces hoy, sin juzgar.'),
        t('La causa de hoy', 'Causa y Efecto', 45, 'Piensa en el resultado que más quieres esta semana. ¿Qué causa depende de ti HOY? Elige una sola.'),
        t('Espera lo mejor', 'Expectativa', 40, 'Imagina el día saliendo bien: te ves haciendo esa acción con calma y seguridad. Siente la satisfacción.'),
        t('Prevé el obstáculo', 'Equivalente Mental', 45, '¿Qué te puede frenar hoy (pereza, celular, cansancio)? Decide: "Si pasa eso, entonces haré…".'),
        t('Lo más importante', '80/20', 40, 'De todo lo que tienes hoy, ¿cuáles 2 cosas dan más resultado? Esas van primero, con hora de inicio y de fin.'),
        t('El primer paso', 'Acción', 30, 'Decide el primer paso de 5 minutos. Al abrir los ojos, haces solo eso.'),
        t('Afirma', 'Acumulación', 30, 'En voz alta: "Hoy mejoro un 1%. Actúo, mido y ajusto."'),
      ],
    },
  ],
};
