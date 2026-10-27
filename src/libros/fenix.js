// Seminario Fénix (Brian Tracy): 27 lecturas, una por día, con todo el contenido del PDF ordenado.
// Es el libro de ejemplo del formato de src/libros (ver .claude/skills/agregar-libro/SKILL.md).
// Cada lectura: idea central, bloques (título + puntos), fórmulas, afirmación, práctica del día, pregunta para el diario
// y "nota": lo que se agregó aparte del PDF (datos que conviene matizar o complementar).
// "temas" sirve para buscar y para los consejos por situación.

const d = (n, titulo, temas, datos) => ({ n, titulo, temas, formulas: [], nota: '', ...datos });

const LECTURAS = [
  d(1, 'La Psicología del Logro', ['exito', 'metas', 'potencial', 'aprendizaje'], {
    idea: 'El éxito es tan predecible como el amanecer: decide tener éxito y aprende cómo lograrlo.',
    intro: 'Explora por qué algunas personas alcanzan más éxito y satisfacción. El éxito no depende de la forma física, la educación, el dinero o los contactos: ayudan, pero no hay correlación directa. Todos tenemos un "instinto de éxito", una inclinación natural a buscar la realización y el crecimiento.',
    bloques: [
      ['Los 2 pasos fundamentales', [
        'Decidir tener éxito: ponerte como meta superar todos tus logros anteriores y comprometerte con el éxito.',
        'Aprender cómo lograrlo: adquirir el conocimiento y las habilidades necesarias para el éxito que deseas.',
      ]],
      ['Los 7 ingredientes del éxito', [
        'Paz mental: estar en armonía contigo, libre de miedos, estrés y emociones negativas.',
        'Salud y energía: libre de enfermedades y con vitalidad para los desafíos diarios.',
        'Relaciones amorosas: establecer y mantener relaciones significativas con los demás.',
        'Libertad financiera: suficiente dinero para no preocuparte por lo básico y enfocarte en metas superiores.',
        'Metas e ideales valiosos: objetivos que den significado y propósito a la vida.',
        'Autoconocimiento y autocomprensión: entender tus motivaciones, fortalezas y debilidades.',
        'Autorrealización: sentir que estás alcanzando tu máximo potencial.',
      ]],
      ['Por qué la gente no llega a su potencial', [
        'Falta un "manual de instrucciones" para la vida. Este seminario es esa guía para entender y aplicar los principios del éxito.',
      ]],
    ],
    formulas: ['Comprensión (aprender a hacerlo bien) + Esfuerzo (aplicarlo con constancia) = Resultados'],
    afirmacion: 'Decido tener éxito y cada día aprendo cómo lograrlo.',
    practica: [
      'Califica del 1 al 10 cada uno de los 7 ingredientes del éxito en tu vida hoy.',
      'Elige el ingrediente más bajo y escribe una acción concreta para subirlo esta semana.',
      'Escribe en una frase el logro anterior que quieres superar.',
    ],
    pregunta: '¿Qué significa para mí el éxito en cada una de las 7 áreas?',
  }),

  d(2, 'Las 7 Leyes Mentales', ['leyes', 'control', 'creencias', 'atraccion', 'metas'], {
    idea: 'Siete leyes mentales gobiernan tu vida: tu mundo exterior refleja tu mundo interior.',
    intro: 'Tracy presenta siete leyes que influyen en la vida y el éxito. Subrayan la importancia de la mentalidad y la autoconciencia para construir una vida exitosa y satisfactoria.',
    bloques: [
      ['Las 7 leyes', [
        'Ley del Control: tu bienestar depende del grado de control que sientes sobre tu vida. Sentir que diriges tus acciones y decisiones te hace más feliz y positivo.',
        'Ley del Accidente: no planificar es planificar el fracaso. Vivir sin objetivos deja la vida al azar y lleva a la frustración y a sentir falta de control.',
        'Ley de Causa y Efecto: todo efecto tiene una causa específica. Tus pensamientos y acciones son las causas de tus circunstancias. Para cambiar un resultado, cambia la causa.',
        'Ley de la Creencia: lo que crees con convicción se convierte en tu realidad. Las creencias son filtros de cómo percibes el mundo.',
        'Ley de la Expectativa: lo que esperas con confianza tiende a materializarse. Tus expectativas influyen en tus acciones y en cómo te relacionas.',
        'Ley de la Atracción: eres un imán viviente que atrae personas y circunstancias en armonía con tus pensamientos dominantes.',
        'Ley de la Correspondencia: tu mundo exterior es un reflejo de tu mundo interior. Para cambiar lo de afuera, trabaja primero tus pensamientos y creencias.',
      ]],
    ],
    afirmacion: 'Yo estoy a cargo de mi vida: cambio mis causas y cambian mis resultados.',
    practica: [
      'Elige un resultado que no te gusta y escribe sus 3 causas más probables (Causa y Efecto).',
      'Detecta una creencia que te limita y escríbela al revés, en positivo (Creencia).',
      'Planifica mañana por escrito antes de dormir (Ley del Accidente).',
    ],
    pregunta: '¿En qué área de mi vida estoy dejando las cosas al azar?',
    nota: 'La Ley de la Atracción funciona mejor entendida como atención: lo que ocupa tu mente decide qué notas, qué oportunidades ves y qué haces. No reemplaza la acción; la dirige.',
  }),

  d(3, 'Liberando su Potencial', ['potencial', 'creencias', 'disciplina', 'accion', 'miedo'], {
    idea: 'No te detiene la falta de talento, sino tus creencias limitantes, el miedo al fracaso y la falta de disciplina.',
    intro: 'Todos tenemos un potencial enorme que pocas veces aprovechamos. Para desbloquearlo hay que aplicar principios que permiten avanzar con confianza y determinación.',
    bloques: [
      ['Claves para liberar tu potencial', [
        'Definir objetivos claros: si no sabes qué quieres, es difícil avanzar. Metas específicas y un plan de acción son el primer paso.',
        'Reprogramar tu mentalidad: el mayor obstáculo suele estar en la mente. Cambia pensamientos negativos por creencias positivas para superar miedos y dudas.',
        'Desarrollar disciplina y enfoque: no basta con soñar; hay que trabajar en ello todos los días.',
        'Aprender y mejorar continuamente: cuanto más aprendes y aplicas, más creces.',
        'Tomar acción inmediata: no esperes el momento perfecto. La acción marca la diferencia entre el éxito y el estancamiento.',
      ]],
      ['Mensaje final', [
        'El éxito no es suerte: es aplicar principios probados con determinación y enfoque. Si tomas control de tu mentalidad y tus acciones, puedes lograr cualquier meta.',
      ]],
    ],
    afirmacion: 'Libero mi potencial hoy: actúo sin esperar el momento perfecto.',
    practica: [
      'Escribe una meta clara y el primer paso para lograrla.',
      'Haz hoy ese primer paso, aunque sea pequeño.',
      'Anota una creencia limitante y su reemplazo positivo.',
    ],
    pregunta: '¿Qué haría si supiera que no puedo fallar?',
  }),

  d(4, 'Su Central de Fuerza Subconsciente', ['subconsciente', 'pensamientos negativos', 'afirmaciones', 'visualizacion', 'miedo'], {
    idea: 'Tu subconsciente es una central de poder: prográmalo con palabras, imágenes y emoción.',
    intro: 'La mente subconsciente funciona como una central de poder que influye en cada aspecto de la vida. Al aprender a programarla, desbloqueas tu potencial.',
    bloques: [
      ['Consciente vs. subconsciente', [
        'Mente consciente (≈10%): razonamiento, lógica, análisis y toma de decisiones.',
        'Mente subconsciente (≈90%): memoria, hábitos, creencias y respuestas automáticas.',
        'El subconsciente no distingue entre realidad e imaginación: lo que repites con emoción, lo acepta como cierto.',
      ]],
      ['1. Ley de la Actividad Subconsciente', [
        'Todo lo que plantas en el subconsciente se pone en marcha para convertirse en realidad.',
        'Tu autoimagen y tus creencias moldean tu comportamiento, lenguaje corporal y confianza.',
        'Aliméntalo con pensamientos positivos y metas claras. Ejemplo: quien se ve como una persona segura lo refleja solo en su postura y actitud.',
      ]],
      ['2. Ley de la Concentración', [
        'Lo que piensas constantemente crece en tu vida.',
        'El subconsciente atrae personas y circunstancias alineadas con tu pensamiento dominante.',
        'Regla práctica: enfócate en lo que quieres, no en lo que temes. Si piensas en problemas todo el día, verás más dificultades; si piensas en soluciones, tu mente las buscará.',
      ]],
      ['3. Ley de la Sustitución', [
        'La mente consciente solo puede tener un pensamiento a la vez.',
        'Para eliminar un pensamiento negativo, reemplázalo por uno positivo.',
        'Técnica: cuando aparezca un pensamiento negativo, di "¡ALTO!" mentalmente y cámbialo por una afirmación. "No soy bueno en esto" → "Estoy aprendiendo y mejorando cada día".',
      ]],
      ['Estrategias para reprogramar tu subconsciente', [
        'Afirmaciones diarias: "Soy capaz", "Tengo confianza en mí mismo".',
        'Visualización: imagínate logrando tus metas con claridad y emoción.',
        'Autocontrol del diálogo interno: no permitas pensamientos negativos persistentes.',
        'Repetición y emoción: el subconsciente aprende por repetición y responde mejor a emociones intensas.',
        'Acción alineada: pensar positivo no basta; actúa en coherencia con lo que deseas.',
      ]],
    ],
    formulas: [
      '90% subconsciente – 10% consciente: lo que repitas y refuerces definirá tu éxito o fracaso.',
      'Palabras + Imágenes + Emoción = Reprogramación mental',
      'Lo que piensas constantemente, lo atraes.',
      'Temor vs. Deseo: si enfocas la mente en lo que deseas, los miedos pierden fuerza.',
    ],
    afirmacion: 'Estoy aprendiendo y mejorando cada día.',
    practica: [
      'Usa la técnica "¡ALTO!" cada vez que notes un pensamiento negativo hoy.',
      'Repite 3 afirmaciones en voz alta, con emoción, mañana y noche.',
      'Visualiza 5 minutos una meta como si ya la hubieras logrado.',
    ],
    pregunta: '¿Qué pensamiento negativo se repite más en mí y con qué lo voy a sustituir?',
    nota: 'El "90/10" es una metáfora, no una medida: lo útil es la idea de que la mayor parte de lo que haces es automático (hábitos), y los hábitos se cambian con repetición.',
  }),

  d(5, 'Estando a Cargo de su Vida', ['autoestima', 'responsabilidad', 'victima', 'quejas', 'excusas'], {
    idea: 'Autoestima + Responsabilidad = Confianza y Éxito. Te conviertes en el arquitecto de tu destino.',
    intro: 'El éxito depende de dos factores clave: la autoestima (cuánto te valoras y confías en ti) y la responsabilidad (qué tanto asumes el control de tu vida).',
    bloques: [
      ['1. Autoestima: la base del desempeño máximo', [
        'Cuanto más te agradas a ti mismo, más confianza y éxito tienes.',
        'Se fortalece con autoaceptación, afirmaciones y acción positiva.',
        'Fórmula: Autoestima = Autoaceptación + Confianza + Acción positiva.',
        'Tip: repite cada día "Me agrada mi persona" (decirlo en voz alta multiplica su impacto).',
      ]],
      ['2. Responsabilidad: la clave del éxito', [
        'Eres 100% responsable de tu vida. Nadie lo hará por ti.',
        'La gente exitosa no se queja ni pone excusas: actúa.',
        'Regla de oro: más responsabilidad = más control sobre tu destino.',
        'Tip: pregúntate siempre "¿Qué puedo hacer hoy para mejorar mi vida?"',
      ]],
      ['3. La trampa de la victimización', [
        'Culpar a otros o quejarte te mantiene atrapado.',
        'El éxito no depende de las circunstancias externas, sino de tu actitud.',
        'Quien se queja se estanca; quien asume la responsabilidad encuentra soluciones y avanza.',
        'Tip: cambia "No puedo porque…" por "¿Cómo puedo lograrlo?"',
      ]],
      ['4. Fórmula del éxito personal', [
        'Cuanto más control tomas, más éxito obtienes.',
        'Tip: actúa como la persona en la que quieres convertirte.',
      ]],
    ],
    formulas: ['Autoestima = Autoaceptación + Confianza + Acción positiva', 'Autoestima + Responsabilidad = Confianza y Éxito'],
    afirmacion: 'Me agrada mi persona. Soy 100% responsable de mi vida.',
    practica: [
      'Di en voz alta "Me agrada mi persona" varias veces hoy.',
      'Cada vez que te escuches decir "No puedo porque…", cámbialo por "¿Cómo puedo lograrlo?"',
      'Pasa un día entero sin quejarte. Si te quejas, vuelve a empezar.',
    ],
    pregunta: '¿Qué puedo hacer hoy para mejorar mi vida?',
  }),

  d(6, 'Eliminando Emociones Negativas', ['emociones negativas', 'culpa', 'rabia', 'resentimiento', 'perdon', 'responsabilidad', 'victima'], {
    idea: 'Las emociones negativas se alimentan de culpa y justificación; se eliminan con responsabilidad y sustitución.',
    intro: 'Las emociones negativas son el principal obstáculo entre una persona y su felicidad, éxito y bienestar. Consumen energía y afectan salud, relaciones y desempeño. Aprender a controlarlas es fundamental.',
    bloques: [
      ['¿Cómo surgen?', [
        'Son aprendidas: nadie nace con ellas; se desarrollan con el tiempo.',
        'Se alimentan de la repetición: cuanto más se justifican, más se fortalecen.',
        'Surgen de la falta de control: entre menos control sientes sobre tu vida, más negativas son tus emociones.',
        'Ley de la Correspondencia: tu mundo exterior refleja tu mundo interior.',
      ]],
      ['El árbol de las emociones negativas', [
        'Raíces: la culpa y la justificación.',
        'Tronco: la tendencia a culpar a otros.',
        'Ramas: temor, duda, resentimiento, envidia, odio y autocompasión.',
        'Frutos: estrés, ansiedad y baja autoestima.',
      ]],
      ['1. Acepta la responsabilidad total', [
        'No eres víctima de nada ni de nadie.',
        'Repite "Soy responsable, soy responsable" hasta que tu mente lo asimile.',
        'Cuanto más aceptas la responsabilidad, menos impacto tienen las emociones negativas.',
      ]],
      ['2. No expreses las emociones negativas', [
        'Hablar de problemas y quejas refuerza la negatividad.',
        'Ley de Sustitución: no puedes pensar en dos cosas a la vez.',
        'Enfoca la mente en soluciones. Si tienes un mal día, no hables solo de lo negativo: cambia a pensamientos y conversaciones constructivas.',
      ]],
      ['3. Rompe el ciclo de la justificación', [
        'Cuanto más justificas una emoción negativa, más poder le das.',
        'Ejercicio: cuando te sorprendas justificándola, cambia la narrativa.',
        'Pregúntate: "¿Cómo puedo ver esta situación de manera diferente?"',
      ]],
      ['4. No te tomes las cosas de forma personal', [
        'Desidentificación: no eres tus problemas, errores o fracasos.',
        'Mantén una actitud neutral y objetiva en situaciones difíciles.',
        'No permitas que el comportamiento de otros determine tu estado emocional.',
      ]],
      ['5. Practica el perdón', [
        'El 99% de las emociones negativas están ligadas a la culpa.',
        'Perdonar no es justificar: es liberarte del peso emocional.',
        'Repite "Los perdono por todo, los perdono por todo" hasta sentir alivio.',
      ]],
    ],
    formulas: ['Culpa + Justificación = Crecimiento de emociones negativas', 'Responsabilidad + Sustitución = Eliminación de emociones negativas'],
    afirmacion: 'Soy responsable. Perdono y me libero.',
    practica: [
      'Cuando sientas rabia o resentimiento, repite "Soy responsable" 5 veces.',
      'Escribe el nombre de alguien a quien te cuesta perdonar y repite "Te perdono por todo" hasta sentir alivio.',
      'Hoy no le cuentes a nadie un problema solo para quejarte.',
    ],
    pregunta: '¿A quién sigo culpando y qué pasaría si lo perdonara?',
  }),

  d(7, 'Liberando sus Frenos', ['miedo', 'fracaso', 'rechazo', 'creencias', 'critica', 'accion'], {
    idea: 'Los frenos mentales vienen de la infancia, la crítica y el miedo; se sueltan actuando a pesar del miedo.',
    intro: 'Nacemos con un enorme potencial, pero vamos creando barreras mentales. Estos "frenos" se forman desde la infancia y determinan creencias, miedos y limitaciones. El primer paso es identificarlos y eliminarlos.',
    bloques: [
      ['¿Cómo se forman?', [
        'Condicionamiento infantil: de niños absorbemos críticas sin cuestionarlas ("Eres torpe", "No eres bueno en matemáticas") y se instalan en la autoimagen.',
        'Crítica destructiva: mina la autoestima y genera inseguridad. Quien creció con críticas constantes teme el fracaso y evita desafíos.',
        'Miedo al rechazo y al fracaso: los dos mayores frenos del éxito. Hacen dudar de tus capacidades y evitar riesgos.',
      ]],
      ['1. Reprograma el subconsciente', [
        'Elimina creencias negativas repitiendo afirmaciones positivas.',
        'Cambia "No soy bueno en esto" por "Puedo mejorar con práctica".',
        'Ejercicio: cada vez que detectes un pensamiento negativo, di en voz alta "Cancelo esa idea, yo soy capaz".',
      ]],
      ['2. Rompe el miedo al fracaso', [
        'El fracaso es parte del aprendizaje.',
        'Edison hizo miles de intentos antes de la bombilla; no los vio como fracasos sino como pasos hacia el éxito.',
        'Tip: en lugar de "No quiero fracasar", piensa "Cada intento me acerca más a mi meta".',
      ]],
      ['3. Supera el miedo al rechazo', [
        'El temor a lo que otros piensen frena más que cualquier obstáculo real.',
        'Regla clave: no puedes gustarle a todo el mundo, y eso no define tu valor.',
        'Ejercicio: atrévete a recibir un "no" al día. Cada rechazo fortalece tu confianza.',
      ]],
      ['4. Actúa a pesar del miedo', [
        'La única manera de vencer los frenos es enfrentarlos directamente.',
        'Ley de la Acción: el miedo se disuelve cuando tomas acción.',
        'Ejemplo: si temes hablar en público, empieza con grupos pequeños y aumenta poco a poco.',
      ]],
    ],
    afirmacion: 'Cancelo esa idea: yo soy capaz. Cada intento me acerca a mi meta.',
    practica: [
      'Busca recibir un "no" hoy: pide algo que normalmente no pedirías.',
      'Haz una cosa pequeña que te dé miedo.',
      'Anota una crítica de tu infancia que aún crees y reescríbela.',
    ],
    pregunta: '¿Qué frase que me dijeron de niño sigo creyendo sin cuestionarla?',
    nota: 'Esto coincide con la exposición gradual que usa la psicología para el miedo: enfrentarlo en pasos pequeños y repetidos es lo que lo reduce, no esperar a dejar de sentirlo.',
  }),

  d(8, 'El Destructor de Preocupaciones', ['preocupacion', 'ansiedad', 'miedo', 'futuro', 'decision'], {
    idea: 'Solo el 8% de lo que te preocupa merece atención. Define lo peor, prepárate y actúa.',
    intro: 'La preocupación es una película de terror en tu cabeza: la mayoría de las veces tu mente inventa problemas que no existen.',
    bloques: [
      ['Dato impactante', [
        '40% de las preocupaciones nunca suceden.',
        '30% son sobre el pasado, que ya no puedes cambiar.',
        '12% son sobre salud sin fundamento.',
        '10% son cosas triviales.',
        'Solo el 8% de lo que te preocupa realmente necesita tu atención.',
      ]],
      ['¿Por qué nos preocupamos tanto?', [
        'Falta de claridad: no sabemos qué hacer y la mente se llena de dudas.',
        'Evitamos actuar: en lugar de resolver, nos quedamos atrapados en el miedo.',
        'Es un hábito: nos acostumbramos a preocuparnos como si eso ayudara.',
        'Pregunta clave: ¿estoy analizando un problema o solo sufriendo por adelantado?',
      ]],
      ['1. Pregúntate: "¿Qué es lo peor que puede pasar?"', [
        'Define el peor escenario posible.',
        'Piensa cómo lo manejarías si realmente sucediera.',
        'Acción inmediata: toma una decisión en lugar de quedarte en la duda.',
        'Ejemplo: si temes perder dinero en un negocio, diseña un plan de contingencia y sigue adelante.',
      ]],
      ['2. Mantén tu mente ocupada', [
        'Cuanto más ocupado estás, menos espacio hay para la preocupación.',
        'No es distraerte sin sentido, sino llenar la mente con tareas productivas: mejorar habilidades, avanzar proyectos.',
      ]],
      ['3. Cambia pensamientos negativos por preguntas inteligentes', [
        'La preocupación nace de preguntas terribles: "¿Y si todo sale mal?"',
        'Cambia a: "¿Qué puedo hacer para mejorar esto?" y "¿Cómo puedo manejar esta situación de manera efectiva?"',
        'Ejemplo: antes de una entrevista, en vez de "Voy a fallar", pregúntate "¿Cómo puedo prepararme mejor?"',
      ]],
      ['4. Confía en que puedes manejar lo que venga', [
        'El miedo a lo desconocido es una de las mayores fuentes de preocupación.',
        'Desarrolla confianza en que encontrarás soluciones cuando haga falta.',
        'Ejercicio: antes de dormir repite "Tengo la capacidad de manejar cualquier situación que se presente".',
        'Piensa en todos los desafíos que ya superaste.',
      ]],
      ['Resumen flash', [
        '¿Preocupado? Pregunta: "¿Es real o es solo mi mente exagerando?"',
        'Define lo peor que puede pasar y prepárate.',
        'Mantén tu mente ocupada en cosas productivas.',
        'Cambia pensamientos negativos por preguntas inteligentes.',
        'Confía en que puedes resolver cualquier situación.',
      ]],
    ],
    afirmacion: 'Tengo la capacidad de manejar cualquier situación que se presente.',
    practica: [
      'Usa la herramienta "Destructor de preocupaciones" con lo que más te preocupa hoy.',
      'Toma una decisión concreta sobre esa preocupación antes de que acabe el día.',
      'Antes de dormir, repite la afirmación del día.',
    ],
    pregunta: '¿Qué desafíos difíciles ya superé que me prueban que puedo con esto?',
    nota: 'Los porcentajes son aproximados y vienen de una encuesta antigua, no de un estudio riguroso. Lo que sí está bien respaldado: escribir la preocupación y decidir un siguiente paso reduce la rumiación.',
  }),

  d(9, 'Cómo Programar su Mente para el Éxito', ['creencias', 'subconsciente', 'visualizacion', 'afirmaciones', 'entorno', 'atraccion'], {
    idea: 'Creencia → Pensamientos → Emociones → Acciones → Resultados. Cambia la creencia y cambia todo lo demás.',
    intro: 'El éxito empieza en la mente. Tus pensamientos crean tu realidad, y lo que crees firmemente tarde o temprano se manifiesta. Programa el subconsciente con pensamientos que te impulsen.',
    bloques: [
      ['Ley de la Creencia', [
        'Lo que crees con convicción se vuelve cierto para ti.',
        'El subconsciente filtra la información para confirmar lo que ya crees.',
        'Si crees que eres malo en algo, evitarás intentarlo y reforzarás esa creencia.',
        'Tip: cambia "No puedo hacerlo" por "Estoy en proceso de mejorar".',
      ]],
      ['Ley de la Correspondencia', [
        'Tu mundo exterior refleja tu mundo interior. Si hay caos en tu mente, lo verás en tu vida.',
        'Si piensas en escasez, atraerás más dificultades financieras.',
        'Ejercicio: identifica qué áreas de tu vida no están como quisieras y qué pensamientos las moldean.',
      ]],
      ['Ley del Equivalente Mental', [
        'Nada cambia afuera si primero no cambia adentro. Todo lo que logres primero debe existir en tu mente.',
        'Las personas exitosas se ven triunfando antes de lograrlo.',
        'Ejercicio: dedica 5 minutos al día a visualizar tu éxito con todos los detalles.',
      ]],
      ['Ley de la Atracción', [
        'Lo que piensas repetidamente, lo atraes. Los pensamientos negativos generan más problemas; los positivos abren caminos.',
        'Tip: cuando algo no salga como esperabas, pregúntate "¿Cómo puedo convertir esto en una oportunidad?"',
      ]],
      ['Herramientas para reprogramar tu mente', [
        'Afirmaciones diarias: "Cada día soy más fuerte y exitoso". Habla siempre en términos positivos.',
        'Visualización con emoción: no basta con imaginarlo, debes sentirlo como si ya fuera real.',
        'Rodéate de las personas correctas: si pasas tiempo con personas negativas, empezarás a pensar igual.',
      ]],
      ['Resumen flash', [
        'Cree en ti y tu subconsciente te guiará.',
        'Tu realidad refleja lo que piensas a diario.',
        'Visualiza lo que quieres antes de lograrlo.',
        'Rodéate de personas que te impulsen.',
        'Toma el control de tu mente y cambiarás tu vida.',
      ]],
    ],
    formulas: ['Creencia → Pensamientos → Emociones → Acciones → Resultados'],
    afirmacion: 'Cada día soy más fuerte y exitoso.',
    practica: [
      'Haz la sesión guiada "Visualización 5 minutos".',
      'Elige un área que no está como quieres y escribe el pensamiento que la sostiene.',
      'Ante un tropiezo hoy, pregúntate cómo convertirlo en oportunidad.',
    ],
    pregunta: '¿Qué creencia mía está produciendo el resultado que menos me gusta?',
  }),

  d(10, 'Cambiando su Autoconcepto', ['autoestima', 'autoimagen', 'autoconcepto', 'identidad', 'afirmaciones', 'entorno'], {
    idea: 'Cuanto más se acerca tu autoimagen a tu autoideal, mayor es tu autoestima y tu desempeño.',
    intro: 'El autoconcepto es la imagen mental que tienes de ti: define qué crees posible, cómo actúas y lo que logras. Si es bajo te autolimitas; si es alto te abres a más oportunidades. "Nos convertimos en lo que pensamos." — Earl Nightingale',
    bloques: [
      ['Los 3 elementos del autoconcepto', [
        'Autoideal: la persona que te gustaría ser.',
        'Autoimagen: cómo te ves a ti mismo actualmente.',
        'Autoestima: qué tanto te agradas y confías en ti.',
        'Regla clave: cuanto más alineada esté tu autoimagen con tu autoideal, mayor tu autoestima y desempeño.',
        'Una gran brecha entre ambos genera frustración; trabajar para acercarte a tu autoideal genera motivación y confianza.',
      ]],
      ['1. Reprograma tu mente con afirmaciones', [
        'Tu mente cree lo que repites constantemente.',
        'Ejercicio: di en voz alta "Me agrada mi persona" al menos 50 veces al día.',
      ]],
      ['2. Actúa como la persona que quieres ser', [
        'El comportamiento refuerza la identidad: si actúas con seguridad, tu mente se adapta y empieza a creerlo.',
        'Pregúntate: "¿Cómo actuaría la mejor versión de mí en esta situación?"',
      ]],
      ['3. Rodéate de influencias positivas', [
        'Las personas a tu alrededor afectan tu autoconcepto. Evita la negatividad.',
        'Ejercicio: evalúa a las 5 personas con las que más pasas tiempo y pregúntate si te ayudan a crecer.',
      ]],
      ['4. Usa la Ley de la Sustitución', [
        'Cada vez que surja un pensamiento negativo, reemplázalo por uno positivo.',
        'En vez de "No soy lo suficientemente bueno", di "Estoy en constante mejora".',
      ]],
    ],
    formulas: ['Repetición + Visualización + Emoción = Nueva creencia'],
    afirmacion: 'Me agrada mi persona. Estoy en constante mejora.',
    practica: [
      'Escribe tu autoideal en "Mi perfil Fénix": cómo es la persona que quieres ser.',
      'Di "Me agrada mi persona" 50 veces a lo largo del día.',
      'Evalúa a las 5 personas con las que más tiempo pasas.',
    ],
    pregunta: '¿Cómo actuaría hoy la mejor versión de mí?',
  }),

  d(11, 'La Nueva Dieta Mental', ['dieta mental', 'pensamientos negativos', 'entorno', 'noticias', 'habitos', '21 dias', 'quejas'], {
    idea: 'Así como el cuerpo se forma con lo que comes, la mente se forma con lo que consumes. No hay pensamientos neutros.',
    intro: 'Todo lo que entra en tu mente influye en tu vida, para impulsarte o limitarte. Quien repite "nunca tengo suerte" busca evidencia para confirmarlo; quien dice "yo creo mis oportunidades" desarrolla una mente abierta a posibilidades.',
    bloques: [
      ['Leyes que rigen la mente', [
        'Ley de la Acumulación: cada pensamiento se suma y construye tu realidad. Un atleta que cada día se dice "soy fuerte y disciplinado" tiene más probabilidades de triunfar.',
        'Ley de la Atracción: atraes aquello en lo que piensas con más frecuencia. Enfocarte en soluciones atrae oportunidades.',
        'Ley de la Correspondencia: "como es adentro, es afuera". Si te sientes inseguro, tus relaciones y oportunidades lo reflejarán.',
      ]],
      ['Cómo hacer una dieta mental efectiva', [
        'Controla lo que ves y escuchas: evita noticias negativas, conversaciones tóxicas y críticas destructivas. Busca libros, audiolibros y conferencias que inspiren.',
        'Cuida tu diálogo interno: no digas "soy malo en esto", di "estoy aprendiendo y mejorando".',
        'Rodéate de personas que te impulsen: evita relaciones que solo giran en quejas; acércate a quienes te retan a crecer.',
        'Aplica repetición y visualización: usa afirmaciones diarias, por ejemplo "me quiero y me respeto tal como soy".',
      ]],
      ['La regla de los 21 días', [
        'Para reprogramar un hábito mental se necesitan unos 21 días de repetición constante.',
        'Ejemplo: para hablar en público con seguridad, repite cada mañana "Hablo con confianza y seguridad, cada vez me expreso mejor".',
        '¿Y si un día fallo? No se pierde nada: vuelve al camino y sigue con la dieta mental.',
      ]],
      ['Tips extra para una mente fuerte', [
        'Haz una lista de afirmaciones y repítelas cada día.',
        'Escribe tus logros y avances para reforzar tu confianza.',
        'Evita las quejas y enfócate en soluciones.',
        'Ríe más y mantente en ambientes positivos.',
      ]],
    ],
    afirmacion: 'Me quiero y me respeto tal como soy.',
    practica: [
      'Hoy: cero noticias negativas y cero redes sin propósito.',
      'Escucha o lee 20 minutos de algo que te inspire (cuenta para la meta de lectura).',
      'Escribe 3 logros o avances recientes.',
    ],
    pregunta: '¿Qué estoy consumiendo (contenido, conversaciones, personas) que me hace daño?',
    nota: 'Sobre los 21 días: el estudio más citado (Lally, 2009) encontró que un hábito tarda en promedio 66 días en volverse automático (entre 18 y 254). Usa 21 días como primera meta, no como final. El mismo estudio confirma lo del PDF: fallar un día no arruina el hábito.',
  }),

  d(12, 'Software para el Cerebro', ['metas escritas', 'planificacion', 'habitos', '80/20', 'visualizacion', 'afirmaciones', '21 dias'], {
    idea: 'Tu cerebro es una computadora: lo que le ingresas define tus resultados. Escribe metas, repite, visualiza.',
    intro: 'Para alcanzar el éxito hay que programar el cerebro con información de calidad y métodos que reemplacen creencias limitantes por pensamientos de crecimiento.',
    bloques: [
      ['Datos clave', [
        'El 80% del éxito depende de la mentalidad y el 20% de la estrategia.',
        'Cada minuto de planificación ahorra de 5 a 15 minutos de ejecución.',
        'Solo el 3% de las personas tiene metas escritas, y ese grupo logra más que el 97% restante.',
        'El subconsciente aprende por repetición y visualización: un pensamiento repetido se vuelve creencia.',
        'El subconsciente procesa unos 11 millones de bits por segundo; la mente consciente unos 40.',
      ]],
      ['Las leyes del software del cerebro', [
        'Ley de la Acumulación: cada pequeño pensamiento o acción se acumula. Si repites "soy disciplinado" cada día, tu cerebro lo asumirá y actuarás así.',
        'Ley del 80/20 (Pareto): el 80% de los resultados viene del 20% de las acciones. De 10 tareas, 2 generan la mayor parte del éxito: identifícalas.',
        'Ley de la Correspondencia: si piensas que "no hay oportunidades", tu mente se cierra a ellas.',
      ]],
      ['Cómo reprogramar el cerebro', [
        '1. Planifica y escribe tus metas, y revísalas constantemente. Escribir una meta la hace mucho más probable. Tip: antes de dormir, escribe tus 3 objetivos principales del día siguiente.',
        '2. Repetición y afirmaciones: en vez de "no soy bueno en esto", repite "cada día aprendo y mejoro".',
        '3. Visualización activa: el cerebro no distingue bien entre lo real y lo imaginado con intensidad. Cierra los ojos, imagina tu meta lograda y siente la emoción, 5 minutos al día.',
        '4. Controla tu entorno mental: evita noticias negativas y rodéate de personas motivadoras.',
        '5. Regla de los 21 días: repite el nuevo hábito mental 21 días seguidos. Ejemplo: "Soy valioso y merezco lo mejor".',
      ]],
    ],
    afirmacion: 'Soy valioso y merezco lo mejor. Cada día aprendo y mejoro.',
    practica: [
      'Esta noche escribe las 3 tareas más importantes de mañana (herramienta "Noche").',
      'De tu lista de pendientes, marca las 2 que más resultados dan (80/20).',
      'Visualiza 5 minutos tu meta principal.',
    ],
    pregunta: '¿Cuáles son las 2 actividades que me dan el 80% de mis resultados?',
    nota: 'El famoso estudio del "3% con metas escritas" (Harvard o Yale) nunca existió. Lo que sí hay: un estudio de Gail Matthews (2015) donde quienes escribieron sus metas y enviaron avances semanales a un amigo lograron bastante más. Escribir funciona; escribir y rendir cuentas funciona mejor.',
  }),

  d(13, 'Técnicas de Aprendizaje Rápido', ['aprendizaje', 'estudiar', 'memoria', 'concentracion', 'lectura', 'cerebro'], {
    idea: 'Aprender rápido no depende de la memoria sino de usar el cerebro con estrategia.',
    intro: 'La capacidad de aprender es la clave del éxito en cualquier área. Este módulo enseña a aprender más rápido, retener mejor y desarrollar una mente ágil.',
    bloques: [
      ['Datos clave sobre el aprendizaje', [
        'El cerebro puede aprender una enorme cantidad de información con la técnica adecuada.',
        'El IQ es maleable y puede aumentar con entrenamiento.',
        'Las personas que leen y estudian constantemente tienen mejor salud mental y longevidad.',
        'Se aprende mejor cuando se usan varios sentidos (visual, auditivo y kinestésico).',
      ]],
      ['Leyes del aprendizaje acelerado', [
        'Ley de la Atención: aprendes más rápido totalmente enfocado. Evita distracciones y estudia en bloques cortos e intensos.',
        'Ley de la Repetición Espaciada: repasar en intervalos retiene mejor. En vez de 3 horas seguidas, sesiones cortas a lo largo del día.',
        'Ley del Estado Mental: se aprende mejor relajado y motivado. La música suave puede ayudar a concentrarte.',
      ]],
      ['Métodos para aprender más rápido', [
        '1. Aprendizaje activo: toma notas, explica el concepto en voz alta o enséñaselo a alguien.',
        '2. Mapas mentales: diagramas y esquemas con colores y dibujos.',
        '3. Asociación de imágenes: al aprender un idioma, asocia cada palabra con una imagen en vez de una traducción literal.',
        '4. Aprendizaje multisensorial: leer en voz alta mientras subrayas y gesticulas activa más áreas del cerebro.',
        '5. Música: escuchar música instrumental tranquila mientras estudias puede ayudar.',
      ]],
      ['Cómo aprovechar tu potencial mental', [
        'Define un propósito claro: ¿por qué quiero aprender esto?',
        'Desarrolla el hábito de aprender: la inteligencia se entrena como un músculo.',
        'Rodéate de estímulos: leer, debatir y aprender cosas nuevas fortalece el cerebro.',
        'Cuida mente y cuerpo: buena alimentación y ejercicio mejoran la función cerebral.',
        'Frase clave: "Si quieres ganar más, aprende más."',
      ]],
    ],
    afirmacion: 'Aprendo rápido y recuerdo con facilidad.',
    practica: [
      'Lee algo 25 minutos y luego explícalo en voz alta sin mirar (aprendizaje activo).',
      'Repasa mañana y en 3 días lo que aprendiste hoy (repetición espaciada).',
      'Haz un mapa mental de una de las lecturas Fénix.',
    ],
    pregunta: '¿Qué habilidad, si la aprendiera este año, cambiaría más mi vida?',
    nota: 'Correcciones al PDF: "usamos el 10% del cerebro" es un mito (usamos todo, solo que no todo a la vez); el "efecto Mozart" es pequeño y pasajero; y Mozart y Beethoven no son barrocos (Bach sí). Lo que sí está muy respaldado: la repetición espaciada, explicar con tus palabras y ponerte a prueba sin mirar.',
  }),

  d(14, 'Relajación Progresiva con Música', ['relajacion', 'estres', 'respiracion', 'musica', 'dormir', 'ansiedad', 'concentracion'], {
    idea: 'Una mente relajada aprende mejor y graba pensamientos positivos con más facilidad. Menos esfuerzo, mejores resultados.',
    intro: 'Desde la antigüedad, pensadores y líderes espirituales usan la meditación y la relajación para potenciar la mente. En estado relajado el cerebro procesa mejor la información.',
    bloques: [
      ['El poder de la relajación y la música', [
        'En estado de relajación profunda (ondas alfa) el cerebro es más receptivo a la información.',
        'Escuchar música suave mientras estudias o reflexionas ayuda a la concentración.',
      ]],
      ['Pasos de la relajación progresiva', [
        '1. Busca un lugar tranquilo y cómodo.',
        '2. Pon música instrumental o sonidos relajantes.',
        '3. Respira profundo: inhala en 4 segundos, sostén 4 y exhala en 8.',
        '4. Relaja cada parte del cuerpo de forma consciente, desde los pies hasta la cabeza.',
        '5. Mantén la mente en pensamientos positivos o afirmaciones.',
        'Ideal antes de dormir o antes de una actividad que exija mucha concentración.',
      ]],
      ['La música como herramienta de reprogramación', [
        'Escuchar afirmaciones en estado relajado ayuda a que el subconsciente las adopte.',
        'Música recomendada: clásica (Mozart, Beethoven, Bach), sonidos de la naturaleza (lluvia, olas, bosque) y frecuencias binaurales.',
      ]],
      ['Ley de la Relajación: menos esfuerzo, mejores resultados', [
        'En el trabajo mental, cuanto menos te fuerces, mejor funciona.',
        'Si te esfuerzas demasiado por recordar algo, lo olvidas; si te relajas, surge solo.',
        'Si te sientes bloqueado o estresado, en vez de forzarte, toma un descanso y relájate.',
      ]],
    ],
    afirmacion: 'Me relajo y mi mente trabaja con claridad.',
    practica: [
      'Haz la sesión guiada "Relajación progresiva" (con música suave de fondo).',
      'Haz 5 ciclos de respiración 4-4-8 antes de una tarea importante.',
      'Cuando te bloquees hoy, para 5 minutos en vez de forzarte.',
    ],
    pregunta: '¿En qué momento del día me vendría mejor una pausa de relajación?',
    nota: 'La relajación muscular progresiva original (Jacobson) es tensar cada grupo de músculos 5 segundos y soltarlo 15: así está armada la sesión guiada de la app. Exhalar más largo de lo que inhalas sí calma el cuerpo; lo de "5 veces más receptivo" no está demostrado.',
  }),

  d(15, '5 Claves para el Establecimiento de Metas', ['metas', 'plan', 'disciplina', 'zona de confort', 'habitos'], {
    idea: '"El éxito son las metas; todo lo demás son comentarios." Saben exactamente lo que quieren y lo convierten en plan.',
    intro: 'El éxito no es suerte: es establecer metas claras y trabajar para alcanzarlas. La mayoría no tiene metas definidas y muy pocos las escriben; esos pocos logran mucho más.',
    bloques: [
      ['Las 5 claves', [
        '1. Propósito claro: una meta debe ser específica, medible y con un porqué fuerte. No "quiero más dinero", sino "quiero ganar $5.000 dólares al mes en un año con mi negocio".',
        '2. Escribe tus metas y visualízalas: escritas activan el subconsciente. Léelas cada día viéndote lograrlas.',
        '3. Usa la Ley de la Correspondencia: si piensas "esto es difícil", tu cerebro verá obstáculos; si piensas "siempre encuentro soluciones", verás oportunidades.',
        '4. Divide la meta en pasos pequeños: para escribir un libro en un año, escribe 500 palabras al día.',
        '5. Disciplina y constancia: las metas no se logran de la noche a la mañana. Pregúntate: "¿Esta acción me acerca o me aleja de mi meta?"',
      ]],
      ['Regla de oro: romper la zona de confort', [
        'El mayor enemigo del éxito es la comodidad.',
        'Salir de la zona de confort te permite crecer más de lo que imaginas.',
        'Si nunca has hecho ejercicio, empezar con 10 minutos al día rompe la resistencia inicial.',
      ]],
      ['Conclusión', [
        'El éxito es el resultado de metas bien definidas y acciones consistentes. Escribe tus metas, divídelas en pasos y trabaja en ellas todos los días.',
      ]],
    ],
    afirmacion: 'Todo lo que emprendo prospera y me llena de satisfacción.',
    practica: [
      'Crea una meta en la herramienta "Mis metas (12 pasos)" con número y fecha.',
      'Divide esa meta en una acción diaria pequeña.',
      'Antes de cada decisión hoy: "¿me acerca o me aleja de mi meta?"',
    ],
    pregunta: '¿Cuál es la meta que, si la lograra, más cambiaría mi vida?',
  }),

  d(16, 'Doce Pasos hacia la Consecución de las Metas', ['metas', 'plan', 'persistencia', 'accion', 'fecha limite', 'obstaculos'], {
    idea: 'El éxito sigue patrones repetibles: 12 pasos para lograr cualquier meta.',
    intro: 'Este método ha permitido a miles de personas lograr en meses lo que antes lograban en años. "La vida es demasiado corta para reinventar la rueda: aprende de quienes ya lograron lo que deseas."',
    bloques: [
      ['Los 12 pasos', [
        '1. Define exactamente lo que deseas: "generar $5.000 mensuales con mi negocio antes de diciembre", no "ganar más".',
        '2. Escríbelo en papel: las metas escritas activan el subconsciente y refuerzan el compromiso.',
        '3. Pon una fecha límite: sin plazo, una meta es solo un deseo.',
        '4. Identifica los obstáculos: "¿Qué me impide alcanzar esta meta?" y trabaja en eliminarlos.',
        '5. Define los conocimientos y habilidades que necesitas (Ley del Aprendizaje: a mayor conocimiento, más oportunidades).',
        '6. Encuentra personas clave: rodéate de quienes ya lograron lo que deseas y aprende de ellos.',
        '7. Crea un plan detallado: un objetivo sin plan es un sueño. Divídelo en pasos pequeños y medibles.',
        '8. Visualiza tu éxito: imagina vívidamente el logro de tu meta (Ley de la Correspondencia).',
        '9. Comprométete al 100%: "¿Estoy dispuesto a pagar el precio?"',
        '10. Toma acción inmediata (Ley de la Inercia): el primer paso es el más difícil; después el impulso te lleva.',
        '11. Sé persistente: el fracaso solo ocurre cuando te rindes. Cada obstáculo es una lección.',
        '12. Evalúa y ajusta el plan: si algo no funciona, cámbialo. La flexibilidad es clave.',
      ]],
      ['Leyes que respaldan las metas', [
        'Ley de Causa y Efecto: si sigues estos 12 pasos, el éxito será inevitable.',
        'Ley de la Atracción: lo que piensas y visualizas se manifiesta en tu vida.',
        'Ley del 80/20: el 80% de tus resultados viene del 20% de tus acciones clave.',
        'Tip: antes de dormir, repasa tus metas y elige una acción para avanzar al día siguiente.',
      ]],
    ],
    afirmacion: 'Todo lo que emprendo prospera y me llena de satisfacción.',
    practica: [
      'Completa los 12 pasos para tu meta principal en "Mis metas".',
      'Haz hoy mismo la primera acción (paso 10).',
      'Antes de dormir, repasa tus metas y elige la acción de mañana.',
    ],
    pregunta: '¿Estoy dispuesto a pagar el precio por mi meta? ¿Cuál es ese precio?',
  }),

  d(17, 'Estrategias de Administración del Tiempo', ['tiempo', 'procrastinacion', 'productividad', 'prioridades', 'pomodoro', '80/20', 'distracciones'], {
    idea: 'Administrar el tiempo no es trabajar más, sino trabajar mejor.',
    intro: '¿Te levantas con una lista interminable y al final del día sientes que avanzaste poco? No es falta de capacidad: es falta de administración. Las personas más exitosas no trabajan más horas, gestionan mejor su tiempo. Piensa en tu tiempo como dinero.',
    bloques: [
      ['1. Enfócate en lo realmente importante (Matriz de Eisenhower)', [
        'El error más común es gastar tiempo en lo urgente pero no importante.',
        'Importante y urgente → hazlo de inmediato.',
        'Importante pero no urgente → agéndalo en tu calendario.',
        'No importante pero urgente → delégalo.',
        'Ni importante ni urgente → elimínalo.',
      ]],
      ['2. Usa la Ley de Parkinson a tu favor', [
        '"El trabajo se expande hasta llenar el tiempo disponible."',
        'Si te das 2 horas para un informe, tardarás 2 horas; si te das 1, encontrarás la forma. Pon plazos ajustados.',
      ]],
      ['3. Aplica la regla del 80/20', [
        'El 20% de tus actividades genera el 80% de tus resultados. Ejemplo: el 20% de los clientes genera el 80% de los ingresos.',
      ]],
      ['4. Planifica antes de empezar el día', [
        'Cada minuto de planificación ahorra de 5 a 10 minutos de ejecución.',
        'Ejercicio: antes de dormir, escribe las 3 tareas más importantes del día siguiente.',
      ]],
      ['5. Vence la procrastinación con la regla de los 5 minutos', [
        'Si te cuesta empezar, comprométete a hacerlo solo 5 minutos. Una vez empiezas, es más fácil seguir.',
      ]],
      ['6. Bloquea distracciones', [
        'Cada interrupción puede costarte hasta 20 minutos de concentración.',
        'Método Pomodoro: 25 minutos sin interrupciones, 5 de descanso, y repite.',
      ]],
      ['7. Trabaja con sentido de urgencia', [
        'Las personas exitosas trabajan rápido y enfocadas. Terminar en 1 hora lo que tomaba 3 te deja avanzar más y tener tiempo libre.',
      ]],
    ],
    afirmacion: 'Hago primero lo más importante y termino lo que empiezo.',
    practica: [
      'Clasifica tus pendientes en los 4 cuadrantes de Eisenhower.',
      'Haz 2 pomodoros (25/5) en tu tarea más importante.',
      'Usa la regla de los 5 minutos en lo que vienes aplazando.',
    ],
    pregunta: '¿Qué tarea vengo aplazando y cuál es su primer paso de 5 minutos?',
  }),

  d(18, 'Cómo Duplicar el Poder Mental', ['superconsciente', 'creatividad', 'intuicion', 'ideas', 'problemas', 'decision'], {
    idea: 'Tu mente superconsciente es la fuente de creatividad e intuición. Define bien el problema, aliméntala, suéltala y actúa.',
    intro: '"Las respuestas que buscas ya están dentro de ti; solo necesitas aprender a escucharlas." La mente superconsciente es la fuente de creatividad, intuición, innovación y solución de problemas.',
    bloques: [
      ['Los tres niveles de la mente', [
        'Consciente: la parte lógica y racional; maneja una pequeña parte de la información.',
        'Subconsciente: guarda hábitos, recuerdos y emociones; maneja la mayoría de las funciones automáticas.',
        'Superconsciente: la inteligencia superior, fuente de creatividad, intuición y genialidad.',
        'Mozart decía que sus sinfonías le llegaban completas en un instante; Beethoven imaginaba una obra entera antes de escribir una nota.',
        'Trabaja mejor en estados de relajación y confianza.',
      ]],
      ['Cómo activarla', [
        '1. Define tu problema o meta con claridad: "un problema bien definido ya está medio resuelto".',
        '2. Alimenta tu mente con información: investiga, lee, consulta expertos.',
        '3. Desconéctate y relájate: funciona mejor cuando te concentras al 100% en el problema y luego cuando te desconectas por completo. Muchas soluciones llegan en la ducha, caminando o antes de dormir.',
        '4. Permanece atento a las señales: ideas espontáneas, corazonadas, coincidencias.',
        '5. Actúa de inmediato: las ideas tienen "fecha de caducidad". Si sientes el impulso de llamar a alguien o probar algo, hazlo.',
      ]],
      ['Leyes del poder mental', [
        'Ley de la Expectativa: lo que esperas con certeza tiende a manifestarse.',
        'Ley de la Correspondencia: tu realidad externa refleja tu mundo interno.',
        'Ley de la Acción: sin acción, una idea no tiene valor.',
        'Tip: programa tu mente antes de dormir con pensamientos positivos y preguntas poderosas.',
      ]],
    ],
    afirmacion: 'Mi mente está llena de ideas poderosas que me llevan al éxito.',
    practica: [
      'Escribe tu problema principal en una sola frase antes de dormir y pídele a tu mente una solución.',
      'Sal a caminar sin celular 20 minutos y anota las ideas que lleguen.',
      'Lleva siempre dónde anotar ideas y actúa sobre una hoy.',
    ],
    pregunta: '¿Qué pregunta poderosa le voy a hacer a mi mente esta noche?',
    nota: 'Lo de "consultarlo con la almohada" tiene respaldo: alternar concentración intensa con descanso (incubación) mejora la solución creativa de problemas. Los porcentajes del PDF (5/95) son ilustrativos.',
  }),

  d(19, 'Cómo Explotar su Genio Interno', ['creatividad', 'ideas', 'genio', 'error', 'mejora continua', '1%'], {
    idea: 'La genialidad no es un don de pocos: es una construcción diaria de aprendizaje, experimentación y acción.',
    intro: 'Grandes inventores, artistas y empresarios desarrollaron su creatividad con técnicas específicas. La creatividad no es un rasgo fijo: se entrena con práctica y nuevos estímulos.',
    bloques: [
      ['Puntos clave para desarrollar tu genio', [
        '1. Expande tu forma de pensar: explora distintas áreas para crear nuevas conexiones de ideas.',
        '2. Crea el hábito de generar ideas: cuantas más ideas produces, más se desarrolla tu pensamiento innovador.',
        '3. Rodéate de personas que te desafíen mentalmente.',
        '4. Relájate para que la mente procese: Einstein tenía sus mejores ideas caminando o tocando el violín.',
        '5. Actúa y aprende del error: la innovación surge del ensayo y error; cada fallo acerca a una mejor solución.',
      ]],
      ['Leyes y reglas del genio interno', [
        'Ley de la Asociación: las ideas más innovadoras surgen al combinar conocimientos de distintas áreas.',
        'Ley de la Incubación: cuando dejas un problema de lado, el cerebro sigue trabajando en la solución.',
        'Regla del 1% diario: si mejoras un 1% cada día, en un año serás 37 veces mejor (1,01^365 ≈ 37,8).',
        'Ley del Crecimiento Continuo: la genialidad no es un destino, sino un proceso en evolución.',
      ]],
    ],
    afirmacion: 'Mi mente está llena de ideas poderosas que me llevan al éxito.',
    practica: [
      'Escribe 20 ideas para mejorar un área de tu vida, sin filtrarlas.',
      'Aprende algo de un tema totalmente distinto al tuyo.',
      'Elige una mejora del 1% para hoy y hazla.',
    ],
    pregunta: '¿Qué pequeña mejora del 1% puedo hacer cada día en lo que más me importa?',
  }),

  d(20, 'Técnicas Creadoras para la Solución de Problemas', ['problemas', 'solucion', 'decision', 'creatividad', '5 porques', 'lluvia de ideas'], {
    idea: 'No hay problemas sin solución, solo enfoques ineficientes. Usa un método, no reacciones impulsivas.',
    intro: 'Los problemas no son el verdadero obstáculo: lo que importa es cómo los enfrentas. Aplicar un método estructurado da mucho mejores resultados que reaccionar impulsivamente.',
    bloques: [
      ['3 principios para resolver problemas', [
        '1. Reformula el problema hasta encontrar la verdadera causa: "el problema real rara vez es el que parece". Si un negocio vende poco, quizá no es el producto sino la falta de publicidad o de confianza.',
        '2. Separa generar ideas de evaluarlas: analizar mientras generas limita la creatividad. Primero escribe todo sin filtro, luego evalúa.',
        '3. Piensa fuera de lo convencional: "si sigues haciendo lo mismo, obtendrás los mismos resultados". Netflix y Uber cambiaron las reglas del juego.',
      ]],
      ['Método práctico', [
        '1. Define el problema en una sola oración. Ej.: "Necesitamos reducir los costos operativos sin afectar la calidad".',
        '2. Pregúntate "¿por qué?" al menos 5 veces. ¿Por qué costos altos? → producción ineficiente. ¿Por qué ineficiente? → tecnología obsoleta…',
        '3. Genera al menos 10 posibles soluciones: más opciones, más probable encontrar la mejor.',
        '4. Consulta a alguien que no esté involucrado: las mejores soluciones a menudo vienen de quien lo ve desde fuera.',
        '5. Decide y ponlo en práctica de inmediato: una solución sin ejecución no sirve. No busques la perfecta; busca la más efectiva y ajústala en el camino.',
      ]],
      ['Leyes para la solución de problemas', [
        'Ley de la Simplicidad: la solución más simple suele ser la mejor.',
        'Ley del Pensamiento Lateral: ver el problema desde otro ángulo genera nuevas soluciones.',
        'Ley de la Adaptación: no todo funciona a la primera; ajusta sobre la marcha. Airbnb empezó alquilando colchones inflables y se adaptó varias veces.',
      ]],
    ],
    afirmacion: 'Todo problema tiene una solución; solo hay que encontrar el camino correcto.',
    practica: [
      'Usa la herramienta "5 porqués" con tu problema actual.',
      'Escribe 10 soluciones sin juzgarlas.',
      'Cuéntaselo a alguien de fuera y pide su opinión.',
    ],
    pregunta: '¿Cuál es el problema REAL detrás del problema que veo?',
    nota: 'Los "5 porqués" vienen de Toyota (Sakichi Toyoda). Se detiene cuando llegas a una causa sobre la que puedes actuar.',
  }),

  d(21, 'Cómo Aumentar su Nivel de Energía', ['energia', 'salud', 'cansancio', 'sueño', 'ejercicio', 'nutricion', 'habitos', 'disciplina'], {
    idea: 'Tu energía es el reflejo directo de cómo cuidas tu cuerpo y tu mente. Se construye con hábitos, no con motivación.',
    intro: 'El nivel de energía no es solo genética o suerte: es el resultado de hábitos que impactan la salud física y mental. El cuerpo está diseñado para vivir muchos años con vitalidad, pero los malos hábitos la reducen.',
    bloques: [
      ['Las claves para aumentar tu energía (las 5 D)', [
        '1. Deseo: la energía empieza en la mente. No puedes cambiar si no lo deseas de verdad.',
        '2. Definición: ten claro tu objetivo de salud (rendir más en el trabajo, disfrutar con tu familia, sentirte mejor).',
        '3. Decisión: comprométete con hábitos saludables; no hay soluciones rápidas.',
        '4. Determinación: sé constante; el cuerpo responde a la disciplina.',
        '5. Disciplina: seguir haciendo lo correcto incluso sin ganas es la diferencia.',
      ]],
      ['Hábitos esenciales', [
        'Nutrición adecuada: evita azúcares refinados y ultraprocesados; come natural y balanceado.',
        'Ejercicio diario: no necesitas gimnasio; muévete cada día (caminar, estirar, algo de fuerza).',
        'Hidratación: la deshidratación reduce la energía y el rendimiento mental.',
        'Descanso de calidad: dormir bien no es opcional; es el pilar de la regeneración.',
        'Evitar el estrés crónico: aprende a relajarte y gestionar las tensiones.',
      ]],
      ['Leyes de tu nivel de energía', [
        'Ley de la Correspondencia: tu salud externa refleja lo que sucede dentro.',
        'Ley de Causa y Efecto: tu energía depende de lo que comes, cómo te ejercitas y cómo manejas el estrés.',
        'Ley del Hábito: la energía no viene de la motivación sino de la repetición de hábitos.',
        'Si te acuestas tarde y comes mal, tu energía será baja; si mejoras tus hábitos, en pocas semanas notarás la diferencia.',
      ]],
    ],
    afirmacion: 'Mi cuerpo es fuerte, sano y lleno de energía.',
    practica: [
      'Cumple hoy la meta de agua y de pasos de la app.',
      'Acuéstate a la misma hora y sin pantallas 30 minutos antes.',
      'Cambia un ultraprocesado por comida real.',
    ],
    pregunta: '¿Qué hábito me está robando más energía?',
    nota: 'Esto conecta directo con tus secciones de Gym, Dieta y Metas: el seguimiento que ya haces es exactamente la "Ley del Hábito" aplicada.',
  }),

  d(22, 'Entendiendo la Relación Mente-Cuerpo', ['salud', 'mente cuerpo', 'estres', 'emociones', 'sistema inmune', 'gratitud'], {
    idea: 'Mente y cuerpo están conectados: tus pensamientos y emociones influyen en tu salud física.',
    intro: 'La forma en que piensas y sientes influye en tu salud. Este módulo explica cómo las emociones, el estrés y la mentalidad afectan el bienestar. "El cuerpo sigue las órdenes de la mente."',
    bloques: [
      ['La ciencia de la conexión', [
        'Medicina psicosomática: cómo las emociones influyen en la salud física.',
        'Psiconeuroinmunología: el estrés, la ansiedad y la depresión pueden debilitar el sistema inmune.',
        'El estrés crónico reduce las defensas y aumenta la probabilidad de enfermedades como gripe, alergias y problemas cardíacos.',
      ]],
      ['Cómo la mente afecta al cuerpo', [
        'Bajo presión o en situaciones difíciles, el cuerpo puede manifestar síntomas físicos.',
        'El estrés, la rabia y la ansiedad deprimen el sistema inmune.',
        'Las personas optimistas suelen enfermarse menos que las negativas.',
        'El cuerpo reacciona a lo que crees: confiar en tu recuperación ayuda a que el cuerpo responda.',
      ]],
      ['Cómo usar la mente para sanar el cuerpo', [
        '1. Cambia tu diálogo interno: en vez de "Me voy a enfermar", di "Mi cuerpo es fuerte y saludable".',
        '2. Reduce el estrés a conciencia: respiración profunda, ejercicio y meditación bajan el cortisol.',
        '3. Practica la gratitud y el pensamiento positivo: "la energía sigue a la atención".',
      ]],
      ['Principios de la salud mente-cuerpo', [
        'Ley de la Correspondencia: lo que piensas se refleja en tu cuerpo.',
        'Ley de la Atracción: si crees en la salud, tu cuerpo responde con bienestar.',
        'Ley de la Respuesta Biológica: tus pensamientos y emociones afectan tu química interna.',
      ]],
    ],
    afirmacion: 'Mi cuerpo es fuerte, sano y lleno de energía.',
    practica: [
      'Escribe 3 cosas por las que estás agradecido (también en tu hábito de gratitud).',
      'Haz 5 ciclos de respiración 4-4-8.',
      'Escucha cómo te hablas sobre tu salud y cambia una frase.',
    ],
    pregunta: '¿Qué emoción que vengo guardando podría estar afectando mi cuerpo?',
    nota: 'Importante: el estrés sí afecta el sistema inmune, pero el PDF exagera ("80-95% de las enfermedades son psicológicas", "decidimos enfermarnos", el cáncer). Una buena actitud ayuda y complementa, pero nunca reemplaza al médico ni a un tratamiento, y nadie tiene la culpa de enfermarse.',
  }),

  d(23, 'Eliminando el Estrés y la Tensión', ['estres', 'ansiedad', 'tension', 'respiracion', 'descanso', 'control', 'dormir'], {
    idea: 'El problema no es el estrés sino cómo lo manejas: no controlas todo lo que pasa, pero sí cómo respondes.',
    intro: 'El estrés es parte de la vida. Cuando se vuelve crónico afecta la salud, la productividad y la felicidad.',
    bloques: [
      ['¿El estrés te está afectando? Señales', [
        'Físicas: dolores de cabeza, fatiga constante, insomnio.',
        'Mentales: falta de concentración, pensamientos negativos recurrentes.',
        'Emocionales: ansiedad, irritabilidad, cambios de humor.',
        'Conductuales: procrastinación, cambios en la alimentación, exceso de cafeína o alcohol.',
        'Si te despiertas cansado incluso después de dormir 8 horas, es señal de estrés acumulado.',
      ]],
      ['5 pasos para reducir el estrés', [
        '1. Identifica la causa real: muchas veces no es la situación sino cómo la interpretas. Con la misma carga, uno se abruma y otro lo ve como reto.',
        '2. Controla lo que puedes, acepta lo que no: "preocuparse por lo que no puedes cambiar es desperdiciar energía". No controlas el tráfico, pero puedes escuchar un audiolibro.',
        '3. Respira para calmar la mente: inhala 4 segundos, retén 4, exhala 8. Repite 5 veces. Baja el ritmo cardiaco y la ansiedad en minutos.',
        '4. Descanso y desconexión (Ley del Rendimiento Óptimo): más horas no es más productividad. Pausas cada 90 minutos mejoran la concentración.',
        '5. Reprograma tu mente: gran parte del estrés es anticipar problemas que ni ocurren. Escribe 3 cosas buenas del día antes de dormir: reduce el estrés y mejora el sueño.',
      ]],
      ['Cifras clave', [
        'La mayoría de las personas (cerca del 77%) siente síntomas físicos por estrés.',
        'Casi la mitad (48%) dice que el estrés afecta su sueño.',
        'Las empresas pierden miles de millones al año por baja productividad ligada al estrés.',
      ]],
    ],
    afirmacion: 'Vivo con calma, claridad y equilibrio en todo momento.',
    practica: [
      'Haz la sesión guiada "Respiración 4-4-8".',
      'Toma una pausa real cada 90 minutos de trabajo.',
      'Esta noche escribe 3 cosas buenas de hoy (herramienta "Noche").',
    ],
    pregunta: '¿Qué me estresa que no puedo controlar, y qué parte sí puedo controlar?',
    nota: 'En el PDF original el ejemplo de la empresa quedó cortado y se quitó. Lo de "80% de las enfermedades por estrés" es exagerado; la respiración lenta con exhalación larga y escribir lo bueno del día sí tienen buen respaldo.',
  }),

  d(24, 'Cómo Desarrollar una Personalidad de Éxito', ['personalidad', 'confianza', 'comunicacion', 'autoimagen', 'inteligencia emocional', 'proactividad', 'valores'], {
    idea: 'El éxito depende mucho de cómo piensas, actúas y te relacionas con los demás.',
    intro: 'Las personas con una personalidad fuerte, segura y magnética logran mejores oportunidades, construyen relaciones valiosas y se ganan la confianza de los demás. Gran parte del éxito (el PDF dice 85%) depende de cómo interactúas, no solo de tus habilidades técnicas.',
    bloques: [
      ['7 principios de una personalidad exitosa', [
        '1. Autoimagen positiva: cómo te ves determina cómo te percibe el mundo. Ejercicio: escribe tus fortalezas y léelas cada mañana.',
        '2. Actitud positiva y energía: la gente exitosa no se queja, encuentra soluciones y contagia entusiasmo. Sonríe más y habla con tono firme y positivo.',
        '3. Comunicación clara y asertiva: en vez de "No sé si esto funcionará", di "Vamos a probar esto y ver qué resultados obtenemos". Practica frente al espejo o grábate.',
        '4. Inteligencia emocional y control personal: reaccionar con ira te quita credibilidad; la calma te da respeto. Ante el enojo, respira y cuenta hasta 5 antes de responder.',
        '5. Habilidades sociales y empatía: la gente recuerda cómo la hiciste sentir. Haz preguntas abiertas: "¿Qué opinas sobre esto?"',
        '6. Confianza y autenticidad: no imites; sé coherente con tus valores. Escribe tus valores y revisa si tus acciones los reflejan.',
        '7. Responsabilidad y proactividad: "las personas exitosas no esperan oportunidades; las crean". Antes de culpar, pregúntate "¿Qué puedo hacer yo para cambiar esto?"',
      ]],
      ['Leyes del desarrollo personal', [
        'Ley del Espejo: la forma en que te tratas es la forma en que los demás te tratarán.',
        'Ley de la Atracción Social: atraes personas con la misma energía y mentalidad que proyectas.',
        'Ley de la Influencia: la gente sigue a quienes la inspiran y la hacen sentir valorada.',
        'Si quieres rodearte de personas exitosas, primero conviértete en alguien con mentalidad de éxito.',
      ]],
    ],
    afirmacion: 'Hablo con confianza y seguridad; cada día me expreso mejor.',
    practica: [
      'Escribe tus fortalezas y tus valores en "Mi perfil Fénix" y léelos al despertar.',
      'En cada conversación hoy, haz al menos una pregunta abierta y escucha.',
      'Ante cualquier enojo: respira y cuenta hasta 5 antes de responder.',
    ],
    pregunta: '¿Mis acciones de esta semana reflejan mis valores?',
    nota: 'El "85% del éxito viene de las habilidades con la gente" sale de un estudio de 1918 del Carnegie Institute con ingenieros; es un dato viejo, pero la idea (las habilidades sociales pesan mucho) sigue siendo válida.',
  }),

  d(25, 'Construyendo Relaciones Superiores', ['relaciones', 'pareja', 'familia', 'trabajo en equipo', 'conflicto', 'escuchar', 'confianza', 'comunicacion'], {
    idea: 'Tú eres 100% responsable de tus relaciones. La gente recuerda cómo la hiciste sentir.',
    intro: 'Las relaciones determinan gran parte del éxito y la felicidad. Las habilidades sociales abren puertas, generan confianza y permiten influir positivamente. "El secreto del éxito no es solo lo que sabes, sino cómo te relacionas."',
    bloques: [
      ['Principios para relaciones fuertes', [
        '1. Regla del 100% - 0%: eres 100% responsable de tus relaciones sin esperar nada a cambio. Si quieres mejorar una relación, toma tú la iniciativa.',
        '2. Escucha activa y real interés: "las personas no quieren ser impresionadas, quieren ser escuchadas". Pregunta más y habla menos: "Cuéntame más sobre eso".',
        '3. Genera confianza con coherencia y honestidad: se construye con acciones. Si prometes algo, cúmplelo sin excusas.',
        '4. Adapta tu estilo de comunicación: algunos son directos y quieren soluciones rápidas; otros valoran la empatía y la conexión.',
        '5. Maneja los conflictos sin confrontación: no ataques ni culpes. En vez de "Siempre haces lo mismo", di "Cuando sucede esto, me hace sentir así".',
        '6. Haz sentir importantes a los demás: felicita sus logros, muestra interés genuino y reconoce sus esfuerzos.',
      ]],
      ['Errores que destruyen relaciones', [
        'Hablar solo de uno mismo sin escuchar.',
        'Falta de empatía y validación emocional.',
        'Hacer promesas que no se cumplen.',
        'Evitar conversaciones difíciles y acumular resentimientos.',
        'No reconocer los logros o esfuerzos de los demás (si alguien aporta una idea y no se le reconoce, su motivación cae).',
      ]],
    ],
    afirmacion: 'Soy digno de amor y atraigo relaciones saludables y enriquecedoras.',
    practica: [
      'Escribe o llama a alguien importante solo para reconocer algo que hizo bien.',
      'En una conversación, di "Cuéntame más sobre eso" y solo escucha.',
      'Si tienes un conflicto pendiente, prepara la frase "Cuando pasa ___, me siento ___".',
    ],
    pregunta: '¿Qué relación quiero mejorar y qué haré yo primero, sin esperar nada?',
  }),

  d(26, 'Cómo Formar Súper Niños', ['niños', 'hijos', 'educacion', 'familia', 'autoimagen', 'disciplina', 'expectativas'], {
    idea: 'Los niños se ven a sí mismos como los ven sus padres. Dales herramientas, hábitos y confianza, no exigencia de perfección.',
    intro: 'La formación de los niños es una de las mayores responsabilidades de padres y educadores. Su éxito no depende solo de su inteligencia innata, sino del entorno y los estímulos. Los primeros años son fundamentales: el cerebro se desarrolla muchísimo antes de los 6 años.',
    bloques: [
      ['Principios para formar niños exitosos', [
        '1. La autoimagen es la clave: refuerza su valor y habilidades. En vez de "Eres malo en matemáticas", di "Puedes mejorar con práctica".',
        '2. Hábitos y disciplina desde la infancia: "la disciplina temprana se convierte en autodisciplina". Enséñales a terminar tareas sin recompensa inmediata.',
        '3. El poder de las expectativas: los niños cumplen lo que creen que se espera de ellos. Si les dices que son responsables, actuarán así.',
        '4. Estimulación temprana y aprendizaje continuo: leer con ellos, hacer preguntas y explorar juntos. Un niño rodeado de libros y conversación tiene más facilidad académica.',
        '5. Independencia y toma de decisiones: deja que elijan su ropa o cómo organizar su tiempo libre.',
        '6. El entorno define su mentalidad: aprenden más por observación que por instrucción. Si te ven leer, leerán.',
        '7. Resiliencia ante el fracaso: los errores son oportunidades. En vez de "Te equivocaste", pregunta "¿Qué aprendiste de esto?"',
      ]],
      ['Leyes de la educación infantil', [
        'Ley del Refuerzo Positivo: repiten lo que se premia con reconocimiento y afecto.',
        'Ley de la Asociación: sus creencias sobre el éxito y el esfuerzo se forman por lo que ven en casa.',
        'Ley del Espejo: tratarlos con respeto y confianza forma adultos seguros.',
        'Tip: elogia los esfuerzos, no solo los resultados.',
      ]],
    ],
    afirmacion: 'Los niños no recordarán todo lo que les enseñaste, pero sí cómo los hiciste sentir.',
    practica: [
      'Si convives con niños: elogia un esfuerzo concreto, no un resultado.',
      'Si no: aplícalo a tu niño interior; cambia una frase dura que te dices por una de apoyo.',
      'Haz algo hoy que quisieras que otros copien de ti (aprenden por observación).',
    ],
    pregunta: '¿Qué ejemplo estoy dando con lo que hago, no con lo que digo?',
    nota: 'Elogiar el esfuerzo en vez de "eres inteligente" coincide con la investigación de Carol Dweck sobre mentalidad de crecimiento.',
  }),

  d(27, 'Cómo Encontrar el Verdadero Propósito de su Vida', ['proposito', 'mision', 'sentido', 'pasion', 'contribucion', 'metas'], {
    idea: '¿Para qué estoy aquí? Descubre quién eres, desarrolla tu talento y contribuye con él al mundo.',
    intro: 'No estamos aquí solo para trabajar, pagar cuentas y sobrevivir, sino para descubrir nuestra misión y usar nuestro potencial al máximo. Pocos usan de verdad su potencial; la mayoría ignora su misión.',
    bloques: [
      ['Pasos para encontrar tu propósito', [
        '1. Escucha el deseo de tu corazón: todos tenemos un llamado interno, un talento natural. Hay quienes desde niños aman ayudar, crear, enseñar o liderar.',
        '2. Analiza qué actividad te hace perder la noción del tiempo: lo que amas hacer sin sentirlo como carga suele estar ligado a tu propósito.',
        '3. ¿Qué harías si el dinero no fuera un problema? Escribe: "Si no tuviera que preocuparme por el dinero, dedicaría mi vida a…"',
        '4. Busca a quienes marcaron la historia: Jesús, Buda, Mahoma, la Madre Teresa y otros dedicaron su vida a algo más grande que ellos.',
        '5. Comprométete con una causa mayor: "el éxito real no está en acumular cosas, sino en contribuir al bienestar de los demás" (Florence Nightingale, Albert Schweitzer).',
        '6. Define tu propósito en una sola frase, clara y específica. Ej.: "Mi propósito es empoderar a las personas a través de la educación financiera".',
        '7. Toma acción hoy, sin esperar el momento perfecto: no necesitas tenerlo todo resuelto. Escribe 3 acciones que puedas hacer hoy.',
      ]],
      ['Reglas del propósito de vida', [
        'Ley de la Misión: todos tenemos una razón para existir, pero solo quienes la buscan la encuentran.',
        'Ley de la Contribución: cuanto más impactas positivamente a otros, más sentido cobra tu vida.',
        'Ley del Equilibrio: el propósito real no es solo éxito profesional, sino bienestar personal y espiritual.',
        'Tip: si aún no tienes claro tu propósito, haz de encontrarlo tu primera misión.',
      ]],
    ],
    afirmacion: 'Vivo con propósito, pasión y contribuyo al mundo con mi talento.',
    practica: [
      'Completa: "Si no tuviera que preocuparme por el dinero, dedicaría mi vida a…"',
      'Escribe tu propósito en una sola frase en "Mi perfil Fénix".',
      'Escribe 3 acciones de hoy que te acerquen a ese propósito y haz una.',
    ],
    pregunta: '¿Qué actividad me hace perder la noción del tiempo?',
  }),
];

// Todas las leyes y reglas del seminario, para consultarlas en un solo lugar
const LEYES = [
  ['Ley del Control', 'Tu bienestar depende del grado de control que sientes sobre tu vida.', [2, 6]],
  ['Ley del Accidente', 'No planificar es planificar el fracaso: sin metas, la vida queda al azar.', [2]],
  ['Ley de Causa y Efecto', 'Todo efecto tiene una causa. Cambia la causa (pensamientos y acciones) y cambias el resultado.', [2, 16, 21]],
  ['Ley de la Creencia', 'Lo que crees con convicción se vuelve tu realidad; las creencias filtran lo que percibes.', [2, 9]],
  ['Ley de la Expectativa', 'Lo que esperas con confianza tiende a cumplirse.', [2, 18, 26]],
  ['Ley de la Atracción', 'Atraes personas y circunstancias en armonía con tus pensamientos dominantes.', [2, 9, 11, 16, 22]],
  ['Ley de la Correspondencia', 'Tu mundo exterior refleja tu mundo interior: "como es adentro, es afuera".', [2, 6, 9, 11, 12, 15, 16, 18, 21, 22]],
  ['Ley de la Actividad Subconsciente', 'Lo que plantas en el subconsciente se pone en marcha para volverse realidad.', [4]],
  ['Ley de la Concentración', 'Lo que piensas constantemente crece en tu vida.', [4]],
  ['Ley de la Sustitución', 'La mente solo tiene un pensamiento a la vez: reemplaza el negativo por uno positivo.', [4, 6, 10]],
  ['Ley del Equivalente Mental', 'Nada cambia afuera si primero no cambia adentro; todo logro existe antes en la mente.', [9]],
  ['Ley de la Acumulación', 'Cada pensamiento y acción se suma con el tiempo y construye tu realidad.', [11, 12]],
  ['Regla de los 21 días', 'Repite un nuevo hábito mental unos 21 días seguidos para empezar a fijarlo.', [11, 12]],
  ['Ley del 80/20 (Pareto)', 'El 80% de los resultados viene del 20% de las acciones.', [12, 16, 17]],
  ['Ley de la Acción', 'El miedo se disuelve al actuar; sin acción, una idea no tiene valor.', [7, 18, 20]],
  ['Ley de la Atención', 'Aprendes más rápido cuando estás totalmente enfocado.', [13]],
  ['Ley de la Repetición Espaciada', 'Repasar en intervalos retiene mejor que estudiar todo de una vez.', [13]],
  ['Ley del Estado Mental', 'Se aprende mejor relajado y motivado.', [13]],
  ['Ley de la Relajación', 'En el trabajo mental, menos esfuerzo da mejores resultados.', [14]],
  ['Ley del Aprendizaje', 'A mayor conocimiento, más oportunidades. El fracaso es parte del éxito.', [16, 26]],
  ['Ley de la Inercia', 'El primer paso es el más difícil; después el impulso te lleva.', [16]],
  ['Ley de Parkinson', 'El trabajo se expande hasta llenar el tiempo disponible: ponte plazos ajustados.', [17]],
  ['Regla de los 5 minutos', 'Si te cuesta empezar, comprométete solo 5 minutos.', [17]],
  ['Ley de la Asociación', 'Las ideas más innovadoras combinan conocimientos de distintas áreas.', [19, 26]],
  ['Ley de la Incubación', 'Al dejar un problema de lado, el cerebro sigue trabajando en la solución.', [18, 19]],
  ['Regla del 1% diario', 'Mejorar 1% cada día te hace unas 37 veces mejor en un año.', [19]],
  ['Ley del Crecimiento Continuo', 'La genialidad es un proceso, no un destino.', [19]],
  ['Ley de la Simplicidad', 'La solución más simple suele ser la mejor.', [20]],
  ['Ley del Pensamiento Lateral', 'Ver el problema desde otro ángulo genera nuevas soluciones.', [20]],
  ['Ley de la Adaptación', 'Ajusta las soluciones sobre la marcha; no todo funciona a la primera.', [20]],
  ['Ley del Hábito', 'La energía no viene de la motivación sino de repetir hábitos saludables.', [21]],
  ['Ley de la Respuesta Biológica', 'Tus pensamientos y emociones afectan tu química interna.', [22]],
  ['Ley del Rendimiento Óptimo', 'Más horas de trabajo no significan más productividad: haz pausas.', [23]],
  ['Ley del Espejo', 'Como te tratas a ti mismo, te tratarán los demás.', [24, 26]],
  ['Ley de la Atracción Social', 'Atraes personas con tu misma energía y mentalidad.', [24]],
  ['Ley de la Influencia', 'La gente sigue a quien la inspira y la hace sentir valorada.', [24]],
  ['Regla del 100% - 0%', 'Eres 100% responsable de tus relaciones, sin esperar nada a cambio.', [25]],
  ['Ley del Refuerzo Positivo', 'Se repite lo que se premia con reconocimiento y afecto.', [26]],
  ['Ley de la Misión', 'Todos tenemos una razón para existir; solo quien la busca la encuentra.', [27]],
  ['Ley de la Contribución', 'Cuanto más impactas positivamente a otros, más sentido tiene tu vida.', [27]],
  ['Ley del Equilibrio', 'El propósito no es solo éxito profesional, también bienestar personal y espiritual.', [27]],
].map(([nombre, texto, dias]) => ({ nombre, texto, dias }));

// "¿Qué te pasa?": situación → qué hacer ahora, qué días releer y qué herramienta usar
const CONSEJOS = [
  { id: 'preocupado', icono: '😟', texto: 'Estoy preocupado', claves: ['preocupacion', 'preocupado', 'miedo', 'futuro', 'y si'], dias: [8, 4, 23],
    ahora: ['Pregúntate: ¿es real o es mi mente exagerando? Solo el 8% de las preocupaciones merece atención.', 'Escribe lo peor que puede pasar y cómo lo manejarías.', 'Toma UNA decisión concreta hoy y ocupa tu mente en algo productivo.'],
    herramienta: 'preocupaciones', afirmacion: 'Tengo la capacidad de manejar cualquier situación que se presente.' },
  { id: 'estres', icono: '😮‍💨', texto: 'Estoy estresado o ansioso', claves: ['estres', 'estresado', 'ansiedad', 'ansioso', 'tension', 'agobiado', 'abrumado'], dias: [23, 14, 22],
    ahora: ['Respira 4-4-8 cinco veces: inhala 4, retén 4, exhala 8.', 'Separa: ¿qué controlo y qué no? Suelta lo que no.', 'Haz una pausa real de 10 minutos y esta noche escribe 3 cosas buenas del día.'],
    sesion: 'respiracion-448', afirmacion: 'Vivo con calma, claridad y equilibrio en todo momento.' },
  { id: 'rabia', icono: '😠', texto: 'Tengo rabia, culpa o resentimiento', claves: ['rabia', 'ira', 'enojo', 'culpa', 'resentimiento', 'odio', 'envidia', 'perdon', 'emociones negativas'], dias: [6, 24, 25],
    ahora: ['Repite "Soy responsable" hasta que baje la intensidad: dejas de ser víctima.', 'No lo justifiques ni lo cuentes para quejarte; pregúntate cómo verlo distinto.', 'Si hay alguien detrás, repite "Te perdono por todo" hasta sentir alivio. Perdonar es liberarte, no justificar.'],
    afirmacion: 'Soy responsable. Perdono y me libero.' },
  { id: 'miedo', icono: '😨', texto: 'Tengo miedo a fracasar o al rechazo', claves: ['miedo', 'fracaso', 'rechazo', 'verguenza', 'que diran', 'inseguridad'], dias: [7, 3, 4],
    ahora: ['Di en voz alta: "Cancelo esa idea, yo soy capaz".', 'Cambia "no quiero fracasar" por "cada intento me acerca a mi meta".', 'Da el paso más pequeño posible hacia eso que temes, hoy. El miedo se disuelve actuando.'],
    afirmacion: 'Cancelo esa idea: yo soy capaz.' },
  { id: 'autoestima', icono: '🪞', texto: 'Me siento inseguro o poca cosa', claves: ['autoestima', 'inseguro', 'no soy suficiente', 'autoimagen', 'confianza', 'valgo'], dias: [10, 5, 24],
    ahora: ['Di "Me agrada mi persona" en voz alta, varias veces.', 'Lee tu lista de fortalezas (Mi perfil Fénix) o escríbela ahora.', 'Pregúntate: ¿cómo actuaría la mejor versión de mí ahora? Y hazlo.'],
    herramienta: 'perfil', afirmacion: 'Me agrada mi persona. Estoy en constante mejora.' },
  { id: 'procrastino', icono: '⏳', texto: 'Estoy procrastinando o no me alcanza el tiempo', claves: ['procrastinar', 'procrastinando', 'pereza', 'tiempo', 'aplazar', 'productividad', 'pendientes', 'distraido', 'empezar', 'arrancar', 'organizar', 'celular'], dias: [17, 12, 16],
    ahora: ['Regla de los 5 minutos: comprométete solo 5 minutos con la tarea.', 'Pon un pomodoro: 25 minutos sin celular, 5 de descanso.', 'Ordena por Eisenhower: hazlo, agéndalo, delégalo o elimínalo. Empieza por el 20% que da el 80%.'],
    afirmacion: 'Hago primero lo más importante y termino lo que empiezo.' },
  { id: 'rumbo', icono: '🧭', texto: 'No tengo metas claras o me siento sin rumbo', claves: ['metas', 'rumbo', 'perdido', 'proposito', 'sentido', 'que hago con mi vida', 'mision'], dias: [15, 16, 27],
    ahora: ['Escribe: "Si no tuviera que preocuparme por el dinero, dedicaría mi vida a…"', 'Elige UNA meta, escríbela con número y fecha límite.', 'Haz hoy la primera acción, por pequeña que sea.'],
    herramienta: 'metas', afirmacion: 'Todo lo que emprendo prospera y me llena de satisfacción.' },
  { id: 'energia', icono: '🔋', texto: 'No tengo energía', claves: ['energia', 'cansado', 'cansancio', 'sueño', 'agotado', 'sin ganas', 'flojera'], dias: [21, 22, 23],
    ahora: ['Toma un vaso grande de agua y camina 10 minutos.', 'Revisa tu sueño: misma hora de dormir y sin pantallas antes.', 'Recuerda la Ley del Hábito: no esperes motivación; haz lo mínimo y la energía llega después.'],
    afirmacion: 'Mi cuerpo es fuerte, sano y lleno de energía.' },
  { id: 'problema', icono: '🧩', texto: 'Tengo un problema que no sé resolver', claves: ['problema', 'resolver', 'solucion', 'decidir', 'decision', 'atascado', 'bloqueado'], dias: [20, 18, 19],
    ahora: ['Escribe el problema en una sola oración.', 'Pregunta "¿por qué?" 5 veces y luego escribe 10 soluciones sin juzgarlas.', 'Consúltalo con alguien de fuera, decide la más efectiva y actúa. Ajusta en el camino.'],
    herramienta: 'problemas', afirmacion: 'Todo problema tiene una solución; solo hay que encontrar el camino correcto.' },
  { id: 'negativo', icono: '🌧️', texto: 'Tengo pensamientos negativos', claves: ['negativo', 'pensamientos negativos', 'pesimista', 'quejas', 'quejarme', 'mente'], dias: [4, 11, 9],
    ahora: ['Di "¡ALTO!" mentalmente y sustitúyelo por una afirmación (Ley de la Sustitución).', 'Revisa tu dieta mental: corta noticias, redes y conversaciones tóxicas hoy.', 'Escribe 3 logros recientes para recordarte de qué eres capaz.'],
    afirmacion: 'Estoy aprendiendo y mejorando cada día.' },
  { id: 'hablo-mal', icono: '🗣️', texto: 'Me hablo mal a mí mismo', claves: ['me hablo mal', 'hablo mal', 'autocritica', 'critico', 'dialogo interno', 'no sirvo', 'soy un fracaso', 'me insulto', 'me trato mal', 'inutil'], dias: [4, 10, 5],
    ahora: ['Haz la sesión guiada "Me hablo bien" (6 minutos).', 'Cada vez que te escuches criticándote, di ¡ALTO! y cambia la frase por su versión positiva y en presente.', 'Repite en voz alta: "Soy el mejor y siempre tiendo a mejorar." Ser el mejor es ser mejor que ayer.'],
    sesion: 'dialogo-interno', pregunta: '¿Le hablaría a alguien que quiero como me hablo a mí?', afirmacion: 'Soy el mejor y siempre tiendo a mejorar.' },
  { id: 'victima', icono: '🫵', texto: 'Siento que todo es culpa de otros', claves: ['culpa de otros', 'victima', 'injusto', 'excusas', 'quejas'], dias: [5, 6, 24],
    ahora: ['Cambia "No puedo porque…" por "¿Cómo puedo lograrlo?"', 'Pregúntate: "¿Qué puedo hacer yo para cambiar esto?"', 'Intenta un día entero sin quejarte.'],
    afirmacion: 'Soy 100% responsable de mi vida.' },
  { id: 'ideas', icono: '💡', texto: 'Necesito ideas o creatividad', claves: ['ideas', 'creatividad', 'creativo', 'innovar', 'inspiracion'], dias: [19, 18, 20],
    ahora: ['Escribe 20 ideas sin filtrar.', 'Combina conocimientos de dos áreas distintas (Ley de la Asociación).', 'Suéltalo: camina, dúchate o duerme con la pregunta en mente, y anota lo que llegue.'],
    afirmacion: 'Mi mente está llena de ideas poderosas que me llevan al éxito.' },
  { id: 'aprender', icono: '📚', texto: 'Quiero aprender o estudiar mejor', claves: ['aprender', 'estudiar', 'memoria', 'examen', 'concentrarme', 'leer'], dias: [13, 12, 14],
    ahora: ['Estudia en bloques cortos y totalmente enfocado.', 'Al terminar, explícalo en voz alta sin mirar.', 'Repasa mañana y en 3 días (repetición espaciada).'],
    afirmacion: 'Aprendo rápido y recuerdo con facilidad.' },
  { id: 'relaciones', icono: '🤝', texto: 'Tengo problemas con alguien', claves: ['relacion', 'relaciones', 'pareja', 'amigo', 'familia', 'conflicto', 'pelea', 'discusion', 'jefe'], dias: [25, 24, 6],
    ahora: ['Aplica el 100% - 0%: da tú el primer paso sin esperar nada.', 'Escucha de verdad: "Cuéntame más sobre eso".', 'Habla sin atacar: "Cuando pasa ___, me siento ___".'],
    afirmacion: 'Soy digno de amor y atraigo relaciones saludables y enriquecedoras.' },
  { id: 'ninos', icono: '🧒', texto: 'Quiero educar mejor a un niño', claves: ['niño', 'niños', 'hijo', 'hija', 'hijos', 'educar', 'sobrino'], dias: [26, 10],
    ahora: ['Elogia el esfuerzo, no solo el resultado.', 'Cambia "te equivocaste" por "¿qué aprendiste de esto?"', 'Recuerda que aprende más de lo que ve que de lo que le dices.'],
    afirmacion: 'Los niños recordarán cómo los hice sentir.' },

  // ---------- Cuerpo y salud ----------
  { id: 'dormir', icono: '😴', texto: 'No estoy durmiendo bien', claves: ['dormir', 'insomnio', 'sueño', 'desvelo', 'noche', 'despierto'], dias: [23, 14, 21],
    ahora: ['Saca la cabeza de la cama: escribe tus preocupaciones y las 3 tareas de mañana. Lo escrito deja de dar vueltas.', 'Pantallas fuera 30-60 minutos antes; cuarto oscuro, fresco y silencioso. Nada de cafeína después de las 2 p. m.', 'Ya acostado, haz la relajación progresiva o 5 ciclos 4-4-8. Levántate siempre a la misma hora, aunque hayas dormido mal.'],
    sesion: 'relajacion-progresiva', pregunta: '¿Qué me llevo a la cama cada noche que debería dejar escrito en un papel?', afirmacion: 'Mi cuerpo sabe descansar; suelto el día y duermo profundo.' },
  { id: 'entrenar', icono: '🏃', texto: 'No tengo ganas de entrenar', claves: ['entrenar', 'gym', 'gimnasio', 'ejercicio', 'ganas', 'flojera', 'pereza'], dias: [17, 21, 10],
    ahora: ['Regla de los 5 minutos: comprométete solo a ponerte la ropa y calentar. Casi nunca te devuelves.', 'Cambia la identidad: no "tengo que entrenar", sino "soy alguien que no falta". Cada sesión es un voto por esa persona.', 'Día malo = sesión mínima (la mitad de series), pero no rompes la cadena. Lo que construye es la constancia, no el día perfecto.'],
    pregunta: '¿Cómo actuaría hoy la versión de mí que ya tiene el cuerpo que quiero?', afirmacion: 'Soy una persona que entrena; mi cuerpo es fuerte, sano y lleno de energía.' },
  { id: 'ansiedad-comer', icono: '🍔', texto: 'Como por ansiedad o me salgo de la dieta', claves: ['comer', 'comida', 'ansiedad', 'dieta', 'antojo', 'dulce', 'atracon', 'hambre'], dias: [21, 23, 6],
    ahora: ['Pausa de 10 minutos y un vaso grande de agua antes de comer algo fuera del plan.', 'Pregúntate: ¿es hambre del cuerpo (cualquier comida sirve) o de la emoción (solo quiero eso)? Si es emoción, nómbrala.', 'Si te saliste, no compenses castigándote: la siguiente comida vuelve al plan. Un error no arruina un hábito.'],
    pregunta: '¿Qué emoción estoy intentando tapar con comida?', afirmacion: 'Elijo lo que me nutre; trato a mi cuerpo con respeto.' },
  { id: 'estancado', icono: '📉', texto: 'Me estanqué en el gym o en el peso', claves: ['estancado', 'estancamiento', 'meseta', 'progreso', 'peso', 'musculo', 'fuerza', 'resultados'], dias: [2, 16, 19],
    ahora: ['Causa y efecto: revisa lo básico antes que lo raro: sueño, proteína, calorías reales y si de verdad subes peso o reps.', 'Mira tus datos de 4 semanas (Progreso) en vez de un solo día; el cuerpo cambia en tendencias.', 'Paso 12: ajusta UNA variable (calorías, volumen o descanso) por 2-3 semanas y mide otra vez.'],
    pregunta: '¿Qué estoy haciendo "casi siempre" que en realidad no hago consistente?', afirmacion: 'Cada semana mejoro un 1%; confío en el proceso.' },
  { id: 'enfermo', icono: '🤒', texto: 'Estoy enfermo o con dolor', claves: ['enfermo', 'enfermedad', 'dolor', 'lesion', 'salud', 'medico', 'gripa'], dias: [22, 21, 14],
    ahora: ['Primero el médico o el fisioterapeuta: la mente ayuda, pero no reemplaza un tratamiento.', 'Cuida tu diálogo: en vez de "estoy fatal", "mi cuerpo se está recuperando". Descansa sin culpa: también es parte del plan.', 'Haz lo que sí puedes (caminar suave, estirar, comer bien) y baja el estrés con respiración; el estrés frena la recuperación.'],
    pregunta: '¿Qué me está pidiendo mi cuerpo que vengo ignorando?', afirmacion: 'Mi cuerpo sabe sanar y yo le doy lo que necesita.' },
  { id: 'cuerpo', icono: '🪞', texto: 'No me gusta mi cuerpo', claves: ['cuerpo', 'fisico', 'gordo', 'flaco', 'apariencia', 'espejo', 'verme'], dias: [10, 5, 22],
    ahora: ['Separa tu valor de tu apariencia: puedes querer cambiar tu cuerpo y aceptarte hoy, las dos cosas a la vez.', 'Agradece 3 cosas que tu cuerpo hace por ti (caminar, cargar, sanar).', 'Mide progreso en cosas que controlas: entrenos cumplidos, proteína, sueño. El espejo llega después.'],
    pregunta: '¿Le hablaría a un amigo como me hablo a mí frente al espejo?', afirmacion: 'Respeto mi cuerpo hoy mientras lo construyo para mañana.' },

  // ---------- Espíritu y sentido ----------
  { id: 'vacio', icono: '🕳️', texto: 'Me siento vacío, todo me da igual', claves: ['vacio', 'sentido', 'da igual', 'apatia', 'nada me llena', 'aburrido', 'triste', 'tristeza'], dias: [27, 1, 22],
    ahora: ['Haz algo por otra persona hoy, por pequeño que sea: la Ley de la Contribución es el atajo más rápido al sentido.', 'Escribe 3 cosas por las que estás agradecido y una que te hizo sentir vivo alguna vez.', 'Muévete y sal al sol 20 minutos. Si este vacío dura semanas, habla con un psicólogo: es fuerza, no debilidad.'],
    pregunta: '¿Cuándo fue la última vez que perdí la noción del tiempo haciendo algo?', afirmacion: 'Mi vida tiene propósito y hoy lo encuentro sirviendo.' },
  { id: 'paz', icono: '🕊️', texto: 'Quiero paz interior', claves: ['paz', 'calma', 'tranquilidad', 'serenidad', 'equilibrio', 'meditar', 'meditacion'], dias: [6, 23, 14],
    ahora: ['10 minutos de silencio total: sin celular, solo respirar y observar lo que pasa por tu mente sin pelear con ello.', 'Haz dos listas: lo que controlo y lo que no. Entrega la segunda.', 'Perdona algo pendiente hoy. La paz mental es el primer ingrediente del éxito y casi siempre está bloqueada por un resentimiento.'],
    sesion: 'respiracion-448', pregunta: '¿Qué estoy cargando que no me corresponde cargar?', afirmacion: 'Vivo con calma, claridad y equilibrio en todo momento.' },
  { id: 'gratitud', icono: '🙏', texto: 'Quiero ser más feliz y agradecido', claves: ['feliz', 'felicidad', 'gratitud', 'agradecido', 'alegria', 'disfrutar'], dias: [22, 23, 1],
    ahora: ['Cada noche, 3 cosas buenas del día y POR QUÉ pasaron (herramienta Noche). Es de lo más respaldado para subir el bienestar.', 'Escribe una carta de gratitud a alguien que te ayudó y, si puedes, léesela.', 'Saborea: hoy haz una cosa simple despacio y con toda tu atención (comer, caminar, una conversación).'],
    herramienta: 'diario', pregunta: '¿Qué tengo hoy que antes solo soñaba con tener?', afirmacion: 'Agradezco lo que tengo y atraigo más motivos para agradecer.' },
  { id: 'perdonarme', icono: '💔', texto: 'No me perdono algo que hice', claves: ['perdonarme', 'culpa', 'arrepentido', 'error', 'verguenza', 'remordimiento'], dias: [6, 10, 7],
    ahora: ['Responsabilidad no es castigo: reconoce lo que hiciste, sin excusas y sin látigo.', 'Pregúntate "¿qué aprendí?" y, si se puede, repara: pide perdón o compénsalo con una acción.', 'Repite "Me perdono por todo" hasta sentir alivio. No eres tus errores (desidentificación).'],
    pregunta: 'Si un amigo hubiera hecho lo mismo y estuviera arrepentido, ¿qué le diría?', afirmacion: 'Aprendo de mi pasado, me perdono y sigo creciendo.' },
  { id: 'duelo', icono: '🥀', texto: 'Estoy pasando por una pérdida', claves: ['perdida', 'duelo', 'murio', 'muerte', 'ruptura', 'termine', 'separacion', 'despido'], dias: [22, 6, 27],
    ahora: ['Date permiso de sentirlo: el duelo no es una emoción negativa que haya que reprimir, es amor que no tiene a dónde ir. Llora si lo necesitas.', 'Sostén lo básico: dormir, comer, moverte un poco y no aislarte. Cuéntaselo a alguien de confianza.', 'Cuando estés listo, pregúntate qué te dejó esa persona o etapa y cómo honrarlo. Si te sobrepasa, busca ayuda profesional.'],
    pregunta: '¿Qué me enseñó lo que perdí y cómo lo llevo conmigo?', afirmacion: 'Me doy tiempo para sanar; el amor que viví sigue en mí.' },
  { id: 'trascender', icono: '✨', texto: 'Quiero conectar con algo más grande', claves: ['espiritual', 'espiritualidad', 'dios', 'fe', 'alma', 'trascender', 'universo', 'orar', 'oracion'], dias: [27, 18, 14],
    ahora: ['Crea un ritual diario de silencio: oración, meditación o contemplación, 10 minutos a la misma hora.', 'Sirve a una causa más grande que tú (Ley de la Contribución): voluntariado, ayudar sin que nadie lo sepa.', 'Pasa tiempo en la naturaleza sin distracciones y escucha tu intuición (la mente superconsciente del día 18).'],
    pregunta: 'Si mi vida fuera un mensaje para el mundo, ¿qué diría?', afirmacion: 'Estoy conectado con algo más grande que yo y mi vida tiene una misión.' },
  { id: 'comparo', icono: '📱', texto: 'Me comparo con los demás', claves: ['comparo', 'comparar', 'comparacion', 'envidia', 'redes', 'instagram', 'otros tienen'], dias: [10, 11, 19],
    ahora: ['Compárate solo con tu yo de ayer: ¿mejoraste un 1%?', 'Las redes muestran el resultado de otros, no su proceso: aplica la dieta mental y deja de seguir lo que te hace sentir menos.', 'Convierte la envidia en información: ¿qué tiene esa persona que yo quiero? Eso es una meta; escríbela.'],
    pregunta: '¿Qué he logrado este año que mi yo de hace un año admiraría?', afirmacion: 'Recorro mi propio camino y cada día soy mejor que ayer.' },

  // ---------- Mente, metas y dinero ----------
  { id: 'abandono', icono: '🧱', texto: 'Empiezo cosas y las abandono', claves: ['abandono', 'constancia', 'disciplina', 'dejo', 'rendirme', 'habito', 'cadena'], dias: [11, 21, 16],
    ahora: ['Hazlo ridículamente pequeño: una versión de 2 minutos que puedas cumplir incluso en tu peor día.', 'No rompas la cadena dos veces: fallar un día es normal; fallar dos seguidos es el inicio de abandonar.', 'Ponlo a la vista y mídelo (esta app): lo que se mide, mejora.'],
    pregunta: '¿Cuál es la versión mínima de mi hábito que puedo hacer pase lo que pase?', afirmacion: 'Termino lo que empiezo; soy constante.' },
  { id: 'decidir', icono: '⚖️', texto: 'No logro tomar una decisión', claves: ['decidir', 'decision', 'indeciso', 'dudas', 'opciones', 'elegir'], dias: [18, 8, 20],
    ahora: ['Escribe las opciones y, para cada una, lo peor que puede pasar y cómo lo manejarías.', 'Ponte un plazo corto (Ley de Parkinson). La mayoría de decisiones son reversibles: decide y ajusta.', 'Consúltalo con la almohada una noche y escucha tu primera intuición al despertar.'],
    pregunta: '¿Qué elegiría si no tuviera miedo?', afirmacion: 'Decido con claridad y confío en mi capacidad de ajustar el rumbo.' },
  { id: 'dinero', icono: '💸', texto: 'Tengo problemas de dinero', claves: ['dinero', 'plata', 'deudas', 'deuda', 'ingresos', 'ahorro', 'pobre', 'escasez', 'gastos'], dias: [15, 13, 2],
    ahora: ['Mira los números sin miedo (sección Finanzas): no puedes cambiar lo que no mides.', 'Cambia "no me alcanza" por "¿cómo puedo ganar más y gastar mejor?". Pon una meta con cifra y fecha.', '"Si quieres ganar más, aprende más": elige una habilidad que aumente tus ingresos y dale 30 minutos diarios.'],
    herramienta: 'metas', pregunta: '¿Qué habilidad, si la dominara, aumentaría más mis ingresos?', afirmacion: 'El dinero llega a mí mientras aporto más valor.' },
  { id: 'cambiar-vida', icono: '🔄', texto: 'Quiero cambiar mi vida y no sé por dónde empezar', claves: ['cambiar', 'cambio', 'empezar', 'nueva vida', 'reinventar', 'mejorar mi vida'], dias: [1, 3, 15],
    ahora: ['Califica del 1 al 10 los 7 ingredientes del éxito (día 1): paz, salud, relaciones, dinero, metas, autoconocimiento, realización.', 'Elige SOLO el más bajo y ponle una meta para los próximos 27 días.', 'Empieza mañana con la Rutina Fénix completa y sigue las lecturas una por día.'],
    pregunta: 'Si nada cambia, ¿cómo será mi vida en 5 años? ¿Lo acepto?', afirmacion: 'Hoy empieza mi nueva vida; decido tener éxito.' },
  { id: 'motivacion', icono: '🔥', texto: 'Perdí la motivación', claves: ['motivacion', 'desmotivado', 'ganas', 'sin ganas', 'animo', 'desanimado'], dias: [9, 15, 27],
    ahora: ['La motivación viene DESPUÉS de la acción, no antes: haz 5 minutos y deja que llegue.', 'Vuelve a tu porqué: relee tu meta y tu propósito, y visualízalos 5 minutos.', 'Celebra lo ya logrado: escribe 3 avances, aunque sean pequeños.'],
    sesion: 'visualizacion', pregunta: '¿Por qué empecé? ¿Ese motivo sigue siendo importante para mí?', afirmacion: 'Mi propósito me impulsa aunque no tenga ganas.' },
  { id: 'celular', icono: '📵', texto: 'Paso demasiado tiempo en el celular', claves: ['celular', 'redes', 'pantalla', 'scroll', 'tiktok', 'instagram', 'distraccion', 'adiccion'], dias: [11, 17, 13],
    ahora: ['Saca el celular del cuarto al dormir y no lo mires la primera hora del día (usa ese tiempo para la Rutina Fénix).', 'Quita las notificaciones de todo lo que no sea una persona real.', 'Cambia scroll por input de calidad: audiolibro o lectura. Es la dieta mental del día 11.'],
    pregunta: '¿Qué haría con 2 horas extra cada día?', afirmacion: 'Mi atención es valiosa y yo decido en qué la pongo.' },
  { id: 'hablar', icono: '🎤', texto: 'Me da miedo hablar en público', claves: ['hablar en publico', 'exponer', 'presentacion', 'nervios', 'timidez', 'timido', 'hablar'], dias: [7, 24, 11],
    ahora: ['Empieza pequeño: habla en grupos chicos y sube poco a poco. El miedo se disuelve con la acción.', 'Practica en voz alta o grábate; prepárate el doble de lo que crees necesario.', 'Antes de hablar: respiración 4-4-8 y repite la afirmación. Los nervios son energía: úsala.'],
    pregunta: '¿Qué es lo peor que realmente puede pasar si me equivoco hablando?', afirmacion: 'Hablo con confianza y seguridad; cada vez me expreso mejor.' },
  { id: 'critica', icono: '🗯️', texto: 'Me afecta mucho la crítica', claves: ['critica', 'criticas', 'juzgan', 'opinion', 'ofendido', 'personal', 'me afecta'], dias: [6, 7, 10],
    ahora: ['No te lo tomes personal: la crítica habla de una conducta o de quien la dice, no de tu valor.', 'Filtra: toma lo útil, agradece y descarta el resto sin justificar ni pelear.', 'Recuerda: no puedes gustarle a todo el mundo, y eso no define quién eres.'],
    pregunta: '¿Qué parte de esta crítica, si fuera cierta, me ayudaría a crecer?', afirmacion: 'Mi valor no depende de la opinión de nadie.' },

  // ---------- Relaciones ----------
  { id: 'soledad', icono: '🫂', texto: 'Me siento solo', claves: ['solo', 'soledad', 'aislado', 'sin amigos', 'nadie'], dias: [25, 24, 27],
    ahora: ['Escríbele hoy a alguien con quien perdiste contacto, sin esperar nada (Regla 100% - 0%).', 'Únete a algo con gente: un grupo, deporte, voluntariado o clase. Es más fácil hacer amigos haciendo algo juntos.', 'Sé tú quien escucha y hace sentir importante al otro. Si la soledad pesa mucho, hablarlo con un profesional ayuda.'],
    pregunta: '¿A quién podría alegrarle el día hoy con un mensaje?', afirmacion: 'Soy digno de amor y atraigo relaciones saludables y enriquecedoras.' },
  { id: 'pareja', icono: '❤️', texto: 'Quiero mejorar mi relación de pareja', claves: ['pareja', 'novia', 'novio', 'esposa', 'esposo', 'amor', 'relacion'], dias: [25, 6, 24],
    ahora: ['Escucha sin defenderte: "Cuéntame más sobre eso", y repite lo que entendiste.', 'Reconoce algo que tu pareja hace bien, hoy y en voz alta.', 'En los conflictos: "Cuando pasa ___, me siento ___", nunca "siempre" ni "nunca". Y perdona lo viejo.'],
    pregunta: '¿Qué hago yo que hace la relación más difícil?', afirmacion: 'Doy amor sin esperar y construyo una relación sana.' },
  { id: 'limites', icono: '🚧', texto: 'No sé decir que no', claves: ['decir que no', 'limites', 'complacer', 'abusan', 'aprovechan', 'compromisos'], dias: [7, 24, 17],
    ahora: ['Cada "sí" a algo es un "no" a otra cosa (tus metas, tu descanso). Pregúntate qué le estás quitando.', 'Usa un "no" amable y corto, sin justificarte de más: "Gracias por pensar en mí, esta vez no puedo".', 'Practica el miedo al rechazo al revés: si la otra persona se molesta, sobrevivirás; tu valor no depende de complacer.'],
    pregunta: '¿A qué estoy diciendo que sí por miedo a decepcionar?', afirmacion: 'Respeto mi tiempo y mis prioridades; puedo decir no con amor.' },
];

// Grupos para mostrar las situaciones ordenadas
const GRUPOS = [
  ['🧠 Mente y emociones', ['hablo-mal', 'preocupado', 'estres', 'negativo', 'rabia', 'miedo', 'autoestima', 'victima', 'perdonarme', 'critica', 'comparo', 'decidir']],
  ['💪 Cuerpo y salud', ['energia', 'dormir', 'entrenar', 'ansiedad-comer', 'estancado', 'enfermo', 'cuerpo']],
  ['🕊️ Espíritu y sentido', ['vacio', 'rumbo', 'paz', 'gratitud', 'duelo', 'trascender']],
  ['🚀 Metas, hábitos y dinero', ['procrastino', 'abandono', 'motivacion', 'cambiar-vida', 'dinero', 'celular', 'problema', 'ideas', 'aprender']],
  ['🤝 Relaciones', ['relaciones', 'pareja', 'soledad', 'limites', 'hablar', 'ninos']],
];

// Rutina diaria sugerida con todo lo del seminario (para seguirla durante los 27 días)
const RUTINA = [
  ['☀️ Al despertar', [
    'Lee la lectura del día (5-10 min).',
    'Repite 3 afirmaciones en voz alta, con emoción (palabras + imágenes + emoción).',
    'Lee tus metas y visualízalas 5 minutos como ya logradas.',
    'Lee tus fortalezas y tu propósito.',
  ]],
  ['💼 Durante el día', [
    'Primero la tarea más importante (80/20, Eisenhower).',
    'Pomodoros de 25/5 y pausas cada 90 minutos.',
    'Regla de los 5 minutos para lo que cuesta empezar.',
    'Técnica "¡ALTO!" ante cualquier pensamiento negativo; cero quejas.',
    'Dieta mental: nada de noticias negativas ni chismes.',
    'Haz la práctica del día.',
  ]],
  ['🌙 Antes de dormir', [
    'Escribe 3 cosas buenas del día (gratitud).',
    'Escribe las 3 tareas más importantes de mañana.',
    'Repasa tus metas y elige la acción de mañana.',
    'Hazle a tu mente una pregunta poderosa sobre tu problema principal.',
    'Repite: "Tengo la capacidad de manejar cualquier situación que se presente."',
    'Si hay tensión, relajación progresiva o respiración 4-4-8.',
  ]],
];

// Herramientas que guardan fichas (una por preocupación, problema o meta)
const FICHAS = {
  preocupaciones: { icono: '😟', titulo: 'Destructor de preocupaciones', lectura: 8, nueva: '+ Nueva preocupación', campos: [
    ['que', '¿Qué me preocupa?'],
    ['real', '¿Es real o es mi mente exagerando? ¿Está en el 8% que de verdad merece atención?'],
    ['peor', '¿Qué es lo peor que puede pasar?'],
    ['manejar', 'Si pasara, ¿cómo lo manejaría? (plan de contingencia)'],
    ['pregunta', 'Pregunta inteligente: ¿qué puedo hacer para mejorar esto?'],
    ['decision', 'Mi decisión y acción de hoy'],
  ] },
  problemas: { icono: '🧩', titulo: '5 porqués: resolver un problema', lectura: 20, nueva: '+ Nuevo problema', campos: [
    ['problema', 'El problema en una sola oración'],
    ['p1', '¿Por qué? (1)'], ['p2', '¿Por qué? (2)'], ['p3', '¿Por qué? (3)'], ['p4', '¿Por qué? (4)'], ['p5', '¿Por qué? (5): la causa real'],
    ['soluciones', '10 posibles soluciones, sin juzgarlas'],
    ['externo', '¿Qué opina alguien que no está involucrado?'],
    ['decision', 'Decisión y primer paso (la más efectiva, no la perfecta)'],
  ] },
  metas: { icono: '🎯', titulo: 'Mis metas (12 pasos)', lectura: 16, nueva: '+ Nueva meta', campos: [
    ['meta', '1-2. Qué deseo exactamente (específico, con número). Escribirlo aquí ya es el paso 2'],
    ['fecha', '3. Fecha límite', 'date'],
    ['porque', 'Por qué la quiero (el propósito fuerte detrás)'],
    ['obstaculos', '4. ¿Qué me impide lograrla?'],
    ['conocimientos', '5. Conocimientos y habilidades que necesito'],
    ['personas', '6. Personas clave que ya lo lograron'],
    ['plan', '7. Plan en pasos pequeños y medibles'],
    ['vision', '8. Cómo se ve y se siente cuando ya la logré'],
    ['precio', '9. ¿Estoy dispuesto a pagar el precio? ¿Cuál es?'],
    ['accion', '10. Acción inmediata de hoy'],
    ['persistir', '11. Qué haré cuando aparezca un obstáculo'],
    ['ajustes', '12. Evaluación: qué funciona y qué cambio'],
  ] },
};

// Pasos de las sesiones guiadas: { nombre, musculo (subtítulo), seg, lados, desc }
const t = (nombre, musculo, seg, desc) => ({ nombre, musculo, seg, lados: false, desc });

export default {
  id: 'fenix',
  titulo: 'Seminario Fénix',
  autor: 'Brian Tracy',
  icono: '🔥',
  descripcion: '27 lecturas, una por día, para reprogramar tu mente y tu vida',
  unidad: 'Día',
  lecturas: LECTURAS,
  // "ampliar": libro que explica cada concepto en detalle (botón en la pestaña Leyes)
  conceptos: { titulo: 'Leyes', icono: '⚖️', lista: LEYES, ampliar: 'leyes' },
  consejos: CONSEJOS,
  grupos: GRUPOS,
  rutina: RUTINA,
  racha: { meta: 21, texto: 'Regla de los 21 días' },
  diario: {
    titulo: '🌙 Noche: gratitud y tareas de mañana',
    campos: [['buenas', '3 cosas buenas que me pasaron hoy (día 23)'], ['tareas', 'Las 3 tareas más importantes de mañana (días 12 y 17)']],
    ayer: ['tareas', '📌 Tus 3 tareas de hoy (las escribiste anoche)'],
  },
  fichas: FICHAS,
  perfil: {
    titulo: '🪞 Mi perfil Fénix',
    campos: [
      ['proposito', '🧭 Mi propósito en una frase (día 27)'],
      ['autoideal', '🌟 Mi autoideal: la persona que quiero ser (día 10)'],
      ['fortalezas', '💪 Mis fortalezas, para leer cada mañana (día 24)'],
      ['valores', '⚖️ Mis valores y principios (día 24)'],
      ['dinero', '💭 Si no tuviera que preocuparme por el dinero, dedicaría mi vida a… (día 27)'],
      ['afirmaciones', '🗣 Mis afirmaciones (en presente, positivas y en primera persona). Ej.: Soy el mejor y siempre tiendo a mejorar'],
    ],
  },
  // Sesiones guiadas (días 4, 5, 9, 10, 14 y 23): aparecen también en 🧘 Sesiones
  sesiones: [
    {
      id: 'dialogo-interno', nombre: 'Me hablo bien', tipo: 'mente', pasos: [
        t('Respira y observa', 'Diálogo interno', 40, 'Tres respiraciones lentas, exhalando largo. Sin juzgar, nota qué te has estado diciendo hoy.'),
        t('Di ¡ALTO!', 'Ley de la Sustitución', 30, 'Recuerda una frase con la que te hablas mal ("no sirvo", "siempre fallo"). Escúchala y di con fuerza, mentalmente: ¡ALTO!'),
        t('Cámbiala por una positiva', 'Ley de la Sustitución', 45, 'Tu mente solo tiene un pensamiento a la vez: reemplázala en presente y en positivo. "No soy capaz" → "Estoy aprendiendo y mejorando cada día".'),
        t('Soy el mejor', 'Afirmación', 60, 'En voz alta y con emoción, 10 veces, cada vez más convencido: "Soy el mejor y siempre tiendo a mejorar." Ser el mejor es ser mejor que ayer.'),
        t('Mírate ganando', 'Visualización', 60, 'Recuerda un logro tuyo, grande o pequeño. Revívelo con detalle: qué hiciste, cómo te sentiste. Esa persona eres tú.'),
        t('Como a tu mejor amigo', 'Autocompasión', 45, '¿Qué le dirías a tu mejor amigo si estuviera en tu lugar? Dítelo a ti, con las mismas palabras y el mismo cariño.'),
        t('Me agrada mi persona', 'Autoestima', 30, 'Cinco veces en voz alta: "Me agrada mi persona." (días 5 y 10)'),
        t('Compromiso del día', 'Acción', 30, 'Decide: hoy, cada vez que me hable mal, digo ¡ALTO! y lo cambio. Abre los ojos y empieza.'),
      ],
    },
    {
      id: 'respiracion-448', nombre: 'Respiración 4-4-8', tipo: 'mente', pasos: [
        t('Postura', 'Calma', 20, 'Siéntate derecho, hombros sueltos, una mano en el abdomen. Suelta el aire.'),
        t('Respiración 4-4-8', 'Calma', 80, 'Inhala por la nariz 4 s, retén 4 s y exhala lento por la boca 8 s. Son 5 ciclos.'),
        t('Afirmación', 'Calma', 30, 'Repite: "Vivo con calma, claridad y equilibrio en todo momento."'),
      ],
    },
    {
      id: 'relajacion-progresiva', nombre: 'Relajación progresiva', tipo: 'mente', pasos: [
        t('Respira profundo', 'Todo el cuerpo', 60, 'Acostado o sentado, con música suave. Inhala 4, retén 4, exhala 8.'),
        t('Pies y pantorrillas', 'Tensa y suelta', 20, 'Aprieta fuerte 5 s (puntas hacia ti), suelta y siente cómo se aflojan.'),
        t('Muslos', 'Tensa y suelta', 20, 'Aprieta los muslos 5 s, suelta y nota la diferencia.'),
        t('Glúteos y abdomen', 'Tensa y suelta', 20, 'Aprieta glúteos y abdomen 5 s, suelta y respira hacia el abdomen.'),
        t('Manos y antebrazos', 'Tensa y suelta', 20, 'Cierra los puños con fuerza 5 s, abre y deja caer las manos.'),
        t('Brazos y hombros', 'Tensa y suelta', 20, 'Sube los hombros a las orejas 5 s y déjalos caer de golpe.'),
        t('Cuello', 'Tensa y suelta', 20, 'Lleva el mentón al pecho suave 5 s y vuelve despacio.'),
        t('Cara', 'Tensa y suelta', 20, 'Arruga frente, ojos y mandíbula 5 s; suelta y deja la boca entreabierta.'),
        t('Todo el cuerpo flojo', 'Mente', 90, 'Recorre el cuerpo de pies a cabeza buscando tensión y suéltala. Repite una afirmación.'),
      ],
    },
    {
      id: 'visualizacion', nombre: 'Visualización 5 minutos', tipo: 'mente', pasos: [
        t('Relájate', 'Mente', 45, 'Ojos cerrados. Tres respiraciones lentas, exhalando largo.'),
        t('Ve tu meta lograda', 'Mente', 90, 'Imagina con detalle el momento en que ya la lograste: dónde estás, quién está, qué ves y oyes.'),
        t('Siéntelo', 'Mente', 75, 'Siente la emoción como si estuviera pasando ahora: orgullo, alegría, calma.'),
        t('Afirma', 'Mente', 45, 'Di en presente lo que eres y lo que tienes, con convicción.'),
        t('Primer paso', 'Mente', 45, 'Antes de abrir los ojos, decide la acción concreta de hoy que te acerca a esa imagen.'),
      ],
    },
  ],
};
