// Inglés: camino a B2 en 12 semanas. Curso de idioma con el formato de aprender-a-aprender.js más los campos del mentor
// (ancla, principios, 80/20, diagnóstico, comprobación, Feynman y reto) y "escuchar": frases en inglés que la app lee en voz
// alta (🔊, 🐢 y modo sombra). Las lecciones enseñan el método y lo esencial; las horas de inglés se hacen fuera, con la rutina diaria.

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const METODO = {
  titulo: 'El método: cómo se aprende un idioma',
  objetivo: 'Saber qué es B2, cuántas horas cuesta y armar la rutina diaria que combina escuchar, leer, hablar y corregir.',
  comprobacion: 'Sin mirar, describes qué puede hacer una persona B2, calculas tus horas hasta la meta y explicas tu rutina diaria con el porqué de cada parte (entrada, salida, interacción y corrección).',
  fuentes: [
    ['Council of Europe (2001). Common European Framework of Reference for Languages: Learning, teaching, assessment. Cambridge University Press.', 'El Marco Común Europeo (MCER): define los niveles A1 a C2 con descriptores de "puede hacer".'],
    ['Council of Europe (2020). Common European Framework of Reference for Languages: Learning, teaching, assessment – Companion volume. Council of Europe Publishing.', 'La actualización de los descriptores, con mediación e interacción en línea.'],
    ['Krashen, S. D. (1982). Principles and Practice in Second Language Acquisition. Pergamon.', 'La hipótesis del input comprensible: se adquiere entendiendo mensajes.'],
    ['Swain, M. (1985). Communicative competence: Some roles of comprehensible input and comprehensible output in its development. En S. Gass y C. Madden (Eds.), Input in Second Language Acquisition (pp. 235-253). Newbury House.', 'La hipótesis del output: hablar y escribir obliga a notar lo que te falta.'],
    ['Long, M. H. (1996). The role of the linguistic environment in second language acquisition. En W. Ritchie y T. Bhatia (Eds.), Handbook of Second Language Acquisition (pp. 413-468). Academic Press.', 'La hipótesis de la interacción: negociar el significado acelera el aprendizaje.'],
    ['Lyster, R. y Ranta, L. (1997). Corrective feedback and learner uptake: Negotiation of form in communicative classrooms. Studies in Second Language Acquisition, 19(1), 37-66.', 'Qué tipos de corrección hacen que el estudiante de verdad corrija.'],
    ['Norris, J. M. y Ortega, L. (2000). Effectiveness of L2 instruction: A research synthesis and quantitative meta-analysis. Language Learning, 50(3), 417-528.', 'Metaanálisis: la enseñanza explícita de la gramática funciona y dura.'],
  ],
  lecciones: [
    l('Qué es B2 y cuánto cuesta llegar', 11, {
      idea: 'Antes de leer: ¿qué crees que puede HACER alguien con B2? B2 no es "saber gramática": es poder conversar con fluidez sobre temas generales y de tu trabajo, entender lo esencial de una serie o una reunión y escribir un texto claro. Llegar en 3 meses depende de dónde empiezas y de cuántas horas pones.',
      feynman: 'Explícale a un niño de 12 años qué diferencia a alguien que "sabe inglés del colegio" de alguien con B2, sin usar las palabras "nivel", "gramática" ni "fluidez".',
      reto: 'Haz hoy una prueba de nivel gratuita en línea (por ejemplo EF SET) y graba 2 minutos hablando de tu trabajo en inglés. Guarda el resultado y la grabación: los vas a comparar en la semana 6 y en la 12.',
      bloques: [
        ['Los niveles del Marco Común Europeo', [
          'A1-A2 (básico): te defiendes en situaciones simples y predecibles: presentarte, pedir comida, preguntar una dirección.',
          'B1 (umbral): te manejas en un viaje, cuentas experiencias y planes, entiendes lo principal si te hablan claro de temas conocidos.',
          'B2 (avanzado): entiendes las ideas principales de textos y conversaciones complejas, incluso técnicas de tu campo; conversas con nativos con fluidez y espontaneidad sin que sea un esfuerzo para ninguno de los dos; escribes textos claros y detallados y defiendes una opinión.',
          'C1-C2 (experto): entiendes casi todo, incluso lo implícito, y te expresas con precisión y matices.',
          'Los niveles se definen por lo que PUEDES HACER ("can do"), no por los temas de gramática que viste.',
        ]],
        ['La cuenta honesta de las horas', [
          'Pasar de un nivel al siguiente cuesta cientos de horas de práctica; cada nivel cuesta más que el anterior.',
          '3 meses son unas 13 semanas. Con 2 horas al día son unas 180 horas; con 1 hora, unas 90.',
          'Si hoy estás en B1, llegar a B2 en 3 meses con 1,5 a 2 horas diarias es exigente pero posible. Si estás en A2 o menos, la meta realista para 3 meses es un B1 sólido, y B2 unos meses después.',
          'Las horas que cuentan son horas de atención: una serie de fondo mientras miras el celular casi no suma.',
        ]],
        ['Tu rutina diaria de 90 minutos (la base de todo el curso)', [
          '10 min · la app: la lección o las tarjetas de hoy y las frases de 🎧 Escucha y repite.',
          '25 min · escuchar con atención: un podcast o un episodio que entiendas casi todo; el mismo audio 2 o 3 veces, y 5 minutos de sombra (repetir encima del audio).',
          '20 min · hablar: hablar solo en voz alta, la técnica 4/3/2 o grabarte; 2 o 3 veces por semana con una persona (profesor, intercambio o amigo).',
          '15 min · vocabulario: tus tarjetas de frases (en papel o en una app de tarjetas), sacadas de lo que escuchaste y leíste.',
          '20 min · leer o escribir: un texto a tu nivel; una vez por semana, un texto escrito que alguien te corrija.',
          'Si un día solo tienes 30 minutos: 10 de app, 15 de escuchar y 5 de hablar en voz alta. Nunca cero.',
        ]],
      ],
      ejemplos: [
        'Andrés salió del colegio con inglés "de cuaderno": conjuga verbos, pero se congela en una llamada. Está en A2 de habla aunque reconozca mucha gramática: le falta escuchar y hablar, no más reglas.',
        'Laura entiende series con subtítulos en inglés y lee noticias, pero habla poco. Puede estar en B1 alto o B2 en comprensión y en B1 en expresión: su plan debe cargar más horas de hablar y escribir.',
      ],
      practica: [
        'Haz una prueba de nivel gratuita y anota el resultado en el diario de la lección.',
        'Calcula tus horas: minutos al día × días hasta la meta. Escríbelo.',
        'Crea en la app el hábito "Inglés 90 min" (o los minutos que de verdad puedas) para que salga en tu mañana.',
      ],
      pregunta: '¿Qué quiero poder HACER en inglés en 3 meses (una reunión, una entrevista, una serie sin subtítulos, un examen) y cómo voy a comprobar que lo logré?',
      nota: 'Las pruebas en línea gratuitas dan una estimación, no un certificado; miden sobre todo comprensión. Para un certificado oficial están exámenes como Cambridge B2 First, IELTS o TOEFL. Desconfía de cursos que prometan B2 en pocas semanas sin decir de qué nivel partes ni cuántas horas pones: las horas de práctica no se pueden saltar, solo aprovechar mejor.',
      recordar: [
        ['¿Cómo se definen los niveles del Marco Común Europeo?', 'Por lo que puedes hacer con el idioma (descriptores "puede hacer"), no por la gramática que estudiaste.'],
        ['¿Qué puede hacer alguien con B2?', 'Entender lo principal de textos y conversaciones complejas, conversar con fluidez y espontaneidad con nativos y escribir textos claros defendiendo una opinión.'],
        ['¿Cuántas horas suman 3 meses a 2 horas diarias, y para quién es realista llegar a B2?', 'Unas 180 horas. Es realista si empiezas en B1; desde A2 la meta de 3 meses es un B1 sólido.'],
        ['¿Cuáles son las 5 partes de la rutina diaria?', 'App y frases, escuchar con atención (con sombra), hablar, vocabulario en tarjetas y leer o escribir.'],
      ],
      tarjetas: [
        ['¿Qué define un nivel del MCER?', 'Lo que puedes HACER con el idioma (can do), no la gramática que viste.'],
        ['B2 en 3 meses: ¿para quién es realista?', 'Para quien empieza en B1 y pone 1,5-2 horas diarias de atención. Desde A2: B1 sólido en 3 meses.'],
        ['La rutina diaria (90 min)', 'App 10 · escuchar 25 (con sombra) · hablar 20 · vocabulario 15 · leer o escribir 20. Mínimo un día malo: 30 min.'],
      ],
      escuchar: [
        ['I’ve been studying English for three months.', 'Llevo tres meses estudiando inglés.'],
        ['My goal is to reach a B2 level by the end of the year.', 'Mi meta es llegar a un nivel B2 a final de año.'],
        ['I can understand most of it, but speaking is still hard for me.', 'Entiendo casi todo, pero hablar todavía me cuesta.'],
        ['Could you speak a bit more slowly, please?', '¿Podrías hablar un poco más despacio, por favor?'],
        ['I work in sales, and I often have meetings with clients.', 'Trabajo en ventas y a menudo tengo reuniones con clientes.'],
        ['I’m trying to practice a little bit every day.', 'Estoy tratando de practicar un poquito todos los días.'],
      ],
    }),
    l('Entrada: escuchar y leer lo que entiendes', 10, {
      idea: 'Piensa: ¿aprendiste español estudiando reglas o oyendo a tu familia? Un idioma se adquiere sobre todo entendiendo mensajes. La clave es que el audio o el texto sea comprensible: si entiendes casi todo, lo poco nuevo se aprende por contexto; si entiendes poco, solo es ruido.',
      feynman: 'Explícale a un niño de 12 años por qué ver una serie en inglés que no entiendes casi no enseña, pero una que entiendes casi toda sí, sin usar las palabras "input" ni "comprensible".',
      reto: 'Escoge un episodio corto (5-10 minutos) de un podcast para estudiantes. Escúchalo tres veces en días distintos: sin nada, con la transcripción y otra vez sin nada. Anota en una escala de 1 a 10 cuánto entendiste cada vez.',
      bloques: [
        ['Input comprensible', [
          'Stephen Krashen (1982) propuso que adquirimos un idioma al entender mensajes un poco por encima de nuestro nivel (lo llamó "i + 1").',
          'Lo que se adquiere así sale después solo al hablar, sin pensar en la regla; lo que solo se estudia como regla cuesta más usarlo en tiempo real.',
          'Analogía: es como el gym. Con un peso que no puedes mover no entrenas; con uno demasiado fácil tampoco. El progreso está en el peso que puedes mover con esfuerzo.',
        ]],
        ['¿Cuánto hay que entender?', [
          'Los estudios de vocabulario (Hu y Nation, 2000; Nation, 2006) muestran que para entender bien un texto sin ayuda hace falta conocer alrededor del 98 % de sus palabras; con el 95 % se entiende, pero con esfuerzo.',
          'Regla práctica: si en un minuto de audio te pierdes varias veces, baja de nivel (podcasts para estudiantes, audio más lento). Si entiendes todo sin esfuerzo, sube.',
          'Escuchar el mismo audio varias veces no es perder el tiempo: la primera vez sacas la idea, las siguientes notas palabras, frases y pronunciación.',
        ]],
        ['Qué escuchar y leer según tu nivel', [
          'A2-B1: podcasts y videos para estudiantes (por ejemplo BBC Learning English o VOA Learning English), libros graduados (graded readers) de tu nivel.',
          'B1-B2: series y YouTube con subtítulos en inglés, podcasts de temas que te gustan (fútbol, finanzas, gym), noticias cortas.',
          'Subtítulos en inglés, no en español: un metaanálisis (Montero Perez y colegas, 2013) encontró que los subtítulos en el mismo idioma ayudan a la comprensión y al vocabulario. En español, lees y no escuchas.',
          'Lo que te interesa se escucha más horas: un podcast de fútbol en inglés que sí ves vale más que uno "ideal" que abandonas.',
        ]],
      ],
      ejemplos: [
        'Felipe pone noticias de CNN mientras cocina y entiende 4 de cada 10 palabras: casi no aprende. Cambia a un podcast para estudiantes que entiende en un 90 % y empieza a notar frases nuevas que después usa.',
        'Contraejemplo: escuchar solo audio fácil durante 3 meses no te lleva a B2. Cuando un audio ya se entiende sin esfuerzo, toca subir el nivel.',
      ],
      practica: [
        'Busca dos fuentes de audio de tu nivel sobre algo que te guste y guárdalas.',
        'Cambia los subtítulos de lo que veas esta semana a inglés.',
        'Escucha 10 minutos con atención (sin el celular en la mano) y escribe en 3 frases de qué se trataba.',
      ],
      pregunta: '¿Qué tema me gusta tanto que podría escucharlo en inglés todos los días, y dónde lo encuentro a mi nivel?',
      nota: 'La versión fuerte de la idea de Krashen ("solo hace falta input, la gramática y hablar no sirven") no tiene buen respaldo: estudios posteriores muestran que hablar, recibir corrección y estudiar gramática de forma explícita también ayudan (ver las dos lecciones siguientes). Lo que sí se mantiene: sin muchas horas de escuchar y leer cosas comprensibles no se llega a B2. Las cifras de 95 % y 98 % son de comprensión lectora; sirven de guía también para escuchar.',
      recordar: [
        ['¿Qué es el input comprensible?', 'Audio o texto que entiendes casi todo, un poco por encima de tu nivel; lo nuevo se aprende por el contexto.'],
        ['¿Qué porcentaje de palabras hay que conocer para entender bien un texto sin ayuda?', 'Alrededor del 98 %; con el 95 % se entiende, pero con esfuerzo.'],
        ['¿Subtítulos en inglés o en español? ¿Por qué?', 'En inglés: ayudan a la comprensión y al vocabulario; en español lees y dejas de escuchar.'],
        ['Entiendes un podcast sin ningún esfuerzo. ¿Qué haces?', 'Subes de nivel: ya no te está enseñando mucho.'],
      ],
      tarjetas: [
        ['Input comprensible', 'Escuchar y leer lo que entiendes casi todo (≈ 95-98 % de las palabras): lo nuevo se aprende por contexto.'],
        ['Subtítulos: ¿en qué idioma?', 'En inglés. Ayudan a comprender y a aprender palabras; en español solo lees.'],
        ['El mismo audio varias veces', 'Sí sirve: la 1.ª vez la idea; las siguientes, palabras, frases y pronunciación.'],
      ],
      escuchar: [
        ['I didn’t catch that. Could you say it again?', 'No te entendí. ¿Lo puedes repetir?'],
        ['What does that word mean?', '¿Qué significa esa palabra?'],
        ['I usually listen to podcasts on my way to work.', 'Normalmente escucho podcasts camino al trabajo.'],
        ['I watch series with English subtitles.', 'Veo series con subtítulos en inglés.'],
        ['It was hard at first, but now it’s getting easier.', 'Al principio fue difícil, pero ahora se está volviendo más fácil.'],
        ['I got the main idea, but I missed some details.', 'Entendí la idea principal, pero se me escaparon algunos detalles.'],
      ],
    }),
    l('Salida: hablar, equivocarse y corregir', 11, {
      idea: '¿Has entendido una canción mil veces y, al cantarla, no te sale? Entender y producir son habilidades distintas. Hablar y escribir te obligan a notar lo que no sabes decir, y la corrección te muestra la forma correcta justo cuando la necesitas.',
      feynman: 'Explícale a un niño de 12 años por qué alguien que entiende muy bien inglés puede quedarse mudo en una conversación, sin usar las palabras "output", "producir" ni "fluidez".',
      reto: 'Ten esta semana una conversación de 20 minutos con una persona en inglés (un profesor en línea, un intercambio de idiomas o un amigo). Antes, pídele que anote tus 5 errores más repetidos. Después, conviértelos en 5 frases correctas para tus tarjetas.',
      bloques: [
        ['Por qué hablar enseña', [
          'Merrill Swain (1985) estudió a niños canadienses en inmersión en francés: después de años entendían muy bien, pero hablaban y escribían con errores. Su conclusión: el input no basta; producir obliga a procesar la gramática.',
          'Cuando intentas decir algo y no puedes, notas el hueco ("¿cómo se dice esto?"). Esa frase que buscas y luego oyes se queda mucho mejor.',
          'Michael Long (1996): al conversar negociamos el significado ("¿quieres decir…?", "¿cómo?"), y eso ajusta el input a lo que necesitas.',
        ]],
        ['Cómo usar la corrección', [
          'Lyster y Ranta (1997) observaron que la corrección más común es la reformulación (el profesor repite tu frase bien), pero muchas veces el estudiante ni la nota.',
          'Funciona mejor cuando te hacen corregir a ti: "¿cómo dirías eso en pasado?". Pídele a tu profesor o compañero que te dé la pista y te deje intentarlo.',
          'Lleva una lista de errores repetidos: si cometes el mismo error 10 veces, eso es tu tarea de la semana, no 30 temas nuevos.',
        ]],
        ['Hablar sin tener con quién', [
          'Hablar solo en voz alta: narra lo que haces ("Now I’m making coffee…"), resume en voz alta el podcast que escuchaste.',
          'Grabarte 2 minutos y escucharte: anota lo que no te salió y búscalo.',
          'Escribir también es salida: un mensaje, un correo, un post. Escribir da tiempo para pensar la gramática; después eso aparece al hablar.',
          'Una IA o un traductor sirven para revisar lo que dijiste, no para reemplazar el intento: primero tú, después la corrección.',
        ]],
      ],
      ejemplos: [
        'Juliana entiende series sin problema, pero en la entrevista de trabajo en inglés se bloqueó. Empezó a grabarse 2 minutos diarios contando su día y a tener dos clases de conversación por semana; en un mes hablaba con más soltura.',
        'Contraejemplo: hablar mucho sin ninguna corrección puede fijar errores ("I am agree"). La salida necesita también retroalimentación.',
      ],
      practica: [
        'Grábate 2 minutos hablando de tu día en inglés y escúchate.',
        'Anota 3 cosas que quisiste decir y no supiste; búscalas y escríbelas bien.',
        'Busca una opción de conversación para esta semana (profesor en línea, intercambio, compañero) y agenda la primera.',
      ],
      pregunta: '¿Qué me da más miedo o pena de hablar en inglés, y qué paso pequeño puedo dar esta semana para enfrentarlo?',
      nota: 'Se dice que "los niños aprenden idiomas y los adultos no": los niños suelen llegar más lejos en pronunciación a largo plazo, pero los adultos aprenden más rápido al principio, sobre todo gramática y vocabulario, porque pueden estudiar de forma explícita. El miedo a equivocarse no está en la edad: es un hábito, y se baja hablando mucho en situaciones de poco riesgo.',
      recordar: [
        ['¿Qué mostró Swain con los estudiantes de inmersión en Canadá?', 'Que entendían muy bien pero producían con errores: el input no basta, hay que producir.'],
        ['¿Qué tipo de corrección hace que el estudiante corrija de verdad?', 'La que le da una pista y le pide intentarlo (hacerle corregir), más que solo repetir la frase bien.'],
        ['¿Cómo practicas hablar si no tienes con quién?', 'Hablando solo en voz alta, narrando, resumiendo lo que escuchaste y grabándote.'],
        ['Cometes el mismo error 10 veces. ¿Qué haces?', 'Lo vuelves tu tarea de la semana: frases correctas en tarjetas y practicarlas en voz alta.'],
      ],
      tarjetas: [
        ['¿Por qué hablar enseña (Swain)?', 'Producir te obliga a notar lo que no sabes decir y a procesar la gramática; entender no basta.'],
        ['Corrección que funciona', 'Que te den la pista y te dejen corregir a ti, no solo que repitan tu frase bien.'],
        ['Hablar sin compañero', 'Narrar en voz alta, resumir lo que escuchaste, grabarte 2 minutos y revisar.'],
      ],
      escuchar: [
        ['Sorry, how do you say “cuenta de cobro” in English?', 'Perdón, ¿cómo se dice "cuenta de cobro" en inglés?'],
        ['Please correct me if I make a mistake.', 'Por favor corrígeme si me equivoco.'],
        ['What I mean is that I need more time.', 'Lo que quiero decir es que necesito más tiempo.'],
        ['Let me think for a second.', 'Déjame pensar un segundo.'],
        ['Is it correct to say it like that?', '¿Es correcto decirlo así?'],
        ['I’m not sure how to put it, but…', 'No estoy seguro de cómo decirlo, pero…'],
      ],
    }),
  ],
};

const VOCABULARIO = {
  titulo: 'Palabras y frases que más rinden',
  objetivo: 'Aprender primero las palabras más frecuentes, en frases completas, y repasarlas con tarjetas para poder usarlas al hablar.',
  comprobacion: 'Sin mirar, conviertes 10 palabras nuevas de un podcast en tarjetas de frase (español → inglés), las dices en voz alta y en 7 días recuerdas al menos 8; y evitas los 10 falsos amigos y errores típicos del hispanohablante.',
  fuentes: [
    ['Nation, I. S. P. (2006). How large a vocabulary is needed for reading and listening? Canadian Modern Language Review, 63(1), 59-82.', 'Cuántas familias de palabras hacen falta para entender textos y conversaciones.'],
    ['Hu, M. y Nation, P. (2000). Unknown vocabulary density and reading comprehension. Reading in a Foreign Language, 13(1), 403-430.', 'El umbral del 98 % de palabras conocidas para entender un texto sin ayuda.'],
    ['Webb, S. y Rodgers, M. P. H. (2009). The lexical coverage of movies. Applied Linguistics, 30(3), 407-427.', 'Cuánto vocabulario hace falta para entender películas.'],
    ['Nation, I. S. P. (2013). Learning Vocabulary in Another Language (2.ª ed.). Cambridge University Press.', 'El manual de referencia sobre cómo se aprende vocabulario.'],
    ['Wray, A. (2002). Formulaic Language and the Lexicon. Cambridge University Press.', 'Las frases hechas y los bloques de palabras en el habla real.'],
    ['Webb, S. y Nation, P. (2017). How Vocabulary Is Learned. Oxford University Press.', 'Qué hace que una palabra se aprenda: encuentros, recuperación y uso.'],
    ['Nakata, T. (2011). Computer-assisted second language vocabulary learning in a paired-associate paradigm: A critical investigation of flashcard software. Computer Assisted Language Learning, 24(1), 17-38.', 'Qué deben tener las tarjetas para aprender vocabulario.'],
    ['Kornell, N. (2009). Optimising learning using flashcards: Spacing is more effective than cramming. Applied Cognitive Psychology, 23(9), 1297-1317.', 'Repasar tarjetas espaciadas le gana a repasarlas de un tirón.'],
  ],
  lecciones: [
    l('Las palabras que más rinden', 10, {
      idea: 'Adivina: ¿cuántas palabras distintas crees que hacen falta para entender casi toda una conversación normal? Menos de las que crees. Unas pocas miles de palabras muy frecuentes aparecen en casi todo lo que oyes; aprender esas primero rinde muchísimo más que aprender palabras raras.',
      feynman: 'Explícale a un niño de 12 años por qué conviene aprender primero "get", "take" y "make" que "chandelier", sin usar las palabras "frecuencia" ni "vocabulario".',
      reto: 'Durante una semana, de cada podcast o episodio saca solo 5 palabras o frases que hayas oído más de una vez y que tú usarías. Al final de la semana, úsalas todas en una grabación de 3 minutos.',
      bloques: [
        ['Pocas palabras hacen casi todo', [
          'En inglés, las palabras más frecuentes (the, be, have, get, go, make, take, thing, think…) aparecen en casi cada frase.',
          'Paul Nation (2006) calculó que para entender el 98 % de las palabras hacen falta unas 6.000-7.000 familias de palabras en conversación y unas 8.000-9.000 en textos escritos. Para películas, Webb y Rodgers (2009) encontraron que con unas 3.000 familias (más nombres propios) se cubre el 95 %.',
          'Una "familia" incluye las formas de una palabra: work, works, worked, working, worker.',
          'Conclusión práctica: las primeras 2.000-3.000 familias son la base; después, el vocabulario de tus temas (tu trabajo, el deporte, la plata).',
        ]],
        ['Cómo escoger qué palabras aprender', [
          'Si una palabra aparece varias veces en lo que escuchas, apréndela; si aparece una vez en un año, déjala pasar.',
          'Prioriza las palabras que tú dirías: para hablar de tu trabajo, tu familia, tus planes y tus opiniones.',
          'Los verbos comodín valen oro: get (conseguir, llegar, ponerse), take, make, do, keep, put, go. Con ellos y unas preposiciones dices muchísimo.',
        ]],
        ['Recepción y producción', [
          'Reconocer una palabra al oírla es más fácil que sacarla al hablar. Para B2 necesitas muchas palabras para entender y un grupo más pequeño, bien practicado, para hablar.',
          'Por eso las tarjetas de producción (español → inglés) son las que más preparan para conversar.',
        ]],
      ],
      ejemplos: [
        'Mateo memorizó listas de 50 palabras "avanzadas" (ubiquitous, notwithstanding) y no las usa nunca. En cambio, "I’ll get back to you", "it depends on" y "I ended up…" las oye y las necesita todos los días.',
        'Contraejemplo: si trabajas en contabilidad, "invoice", "accounts payable" y "balance sheet" no son las más frecuentes del idioma, pero son de las más frecuentes en TU día: van primero.',
      ],
      practica: [
        'Escribe 10 verbos comodín (get, take, make, do, keep, put, go, come, look, give) con una frase tuya para cada uno.',
        'Haz una lista de 15 palabras de tu trabajo o de tu tema favorito que necesitarías para hablar de eso.',
        'Del próximo audio que escuches, anota solo las palabras que se repitan.',
      ],
      pregunta: '¿Sobre qué 3 temas voy a hablar más en inglés, y qué palabras me faltan para hablar de ellos?',
      nota: 'Se repite que "con 1.000 palabras hablas un idioma" o "con 800 palabras dominas el 80 %": son simplificaciones. Unas pocas palabras sí cubren un gran porcentaje del texto, pero el significado está en las palabras menos frecuentes, y el 80 % de las palabras deja sin entender casi cada frase. Las cifras de Nation son estimaciones para entender bien sin ayuda, no el mínimo para comunicarse.',
      recordar: [
        ['¿Qué es una familia de palabras?', 'Una palabra con sus formas: work, works, worked, working, worker.'],
        ['¿Qué palabras aprender primero?', 'Las más frecuentes del idioma y las de tus temas (trabajo, intereses); las que se repiten en lo que escuchas.'],
        ['¿Por qué valen tanto los verbos como get, take y make?', 'Porque son muy frecuentes y con preposiciones expresan muchísimas cosas.'],
        ['Una palabra aparece una vez en todo un mes de audio. ¿La aprendes?', 'No vale la pena por ahora: mejor las que se repiten o las que tú necesitas decir.'],
      ],
      tarjetas: [
        ['¿Qué vocabulario va primero?', 'Las 2.000-3.000 familias más frecuentes y las palabras de tus temas.'],
        ['Verbos comodín', 'get, take, make, do, keep, put, go: muy frecuentes y con muchos usos.'],
        ['Entender vs. hablar', 'Para entender necesitas muchas palabras; para hablar, menos pero muy practicadas (tarjetas español → inglés).'],
      ],
      escuchar: [
        ['I’ll get back to you tomorrow.', 'Te respondo mañana.'],
        ['It depends on the price.', 'Depende del precio.'],
        ['We ended up staying at home.', 'Terminamos quedándonos en casa.'],
        ['Can you keep an eye on my bag?', '¿Me puedes echar un ojo al bolso?'],
        ['I need to get used to the new schedule.', 'Tengo que acostumbrarme al nuevo horario.'],
        ['It took me two hours to get there.', 'Me demoré dos horas en llegar.'],
      ],
    }),
    l('Frases hechas: aprende bloques, no palabras sueltas', 10, {
      idea: '¿Por qué un nativo habla tan rápido? En buena parte porque no arma cada frase palabra por palabra: usa bloques ya hechos ("as far as I know", "it’s up to you"). Aprender en bloques te da fluidez y suena natural.',
      feynman: 'Explícale a un niño de 12 años por qué es más fácil hablar con frases completas aprendidas que traduciendo palabra por palabra, usando un ejemplo de fútbol y sin usar las palabras "colocación" ni "chunk".',
      reto: 'Escoge 3 situaciones reales de tu semana (una reunión, pedir algo en una tienda, opinar de un partido) y prepara 5 bloques para cada una. Úsalos en voz alta en una conversación o una grabación sin leerlos.',
      bloques: [
        ['Qué son los bloques', [
          'Colocaciones: palabras que van juntas por costumbre. En inglés se dice "make a decision" (no "do a decision"), "take a photo", "heavy traffic", "strong coffee".',
          'Verbos con partícula (phrasal verbs): find out (averiguar), give up (rendirse), run out of (quedarse sin), figure out (descifrar).',
          'Frases funcionales: "Would you mind…?", "I was wondering if…", "That makes sense", "It’s up to you".',
          'Alison Wray (2002) describe cómo gran parte del habla real está hecha de estas secuencias que se guardan enteras en la memoria.',
        ]],
        ['Por qué rinden', [
          'Un bloque ocupa un solo espacio en la memoria de trabajo: hablas más rápido y piensas en la idea, no en la gramática.',
          'Traen la gramática incluida: "I’ve been meaning to…" ya trae el presente perfecto continuo bien usado.',
          'Evitan los errores de traducir del español: "make a question" (mal) frente a "ask a question" (bien).',
        ]],
        ['Cómo cazarlos y guardarlos', [
          'Cuando escuches o leas, anota la frase completa, no la palabra: no "deadline" sino "We’re running out of time to meet the deadline".',
          'Guárdalos por situación (reuniones, opinar, quejarse, pedir favores), no por orden alfabético.',
          'Dilos en voz alta varias veces hasta que salgan sin pensar. La 🎧 sombra de la app es para eso.',
        ]],
      ],
      ejemplos: [
        'Para opinar de un partido: "To be honest, I think the coach got it wrong", "They should have scored in the first half", "It was a fair result".',
        'Contraejemplo: no todo se aprende como bloque. Para expresar una idea nueva y compleja también necesitas la gramática para armar frases que nunca has oído (módulo 4).',
      ],
      practica: [
        'Del próximo audio, anota 5 frases completas que te gustaría decir.',
        'Escribe 5 colocaciones con make, do y take que se confundan en español (make a mistake, do homework, take a break…).',
        'Repite en voz alta 3 veces cada frase de 🎧 Escucha y repite de esta lección.',
      ],
      pregunta: '¿En qué situación de mi vida necesito sonar natural en inglés, y qué 5 frases me harían sentir seguro en ella?',
      nota: 'Las listas de "100 phrasal verbs que debes saber" sirven poco solas: un phrasal verb se aprende cuando lo oyes en contexto varias veces y lo usas. Mejor 20 que te sirvan, en frases, que 100 de memoria. Y ojo con "sonar como nativo": la meta de B2 es comunicarte con claridad y naturalidad, no perder todo el acento.',
      recordar: [
        ['¿Qué es una colocación? Da un ejemplo.', 'Palabras que van juntas por costumbre: make a decision, take a photo, heavy traffic.'],
        ['¿Por qué los bloques dan fluidez?', 'Porque se guardan enteros: ocupan poco espacio en la mente y traen la gramática incluida.'],
        ['¿Cómo anotas vocabulario nuevo?', 'En frase completa y por situación, no la palabra sola por orden alfabético.'],
        ['¿Cómo dices "hacer una pregunta" y "tomar una decisión"?', 'Ask a question; make a decision.'],
      ],
      tarjetas: [
        ['Hacer una pregunta / tomar una decisión / cometer un error', 'Ask a question / make a decision / make a mistake.'],
        ['Averiguar / rendirse / quedarse sin', 'Find out / give up / run out of.'],
        ['¿Cómo anotar vocabulario?', 'En frases completas y agrupadas por situación; luego decirlas en voz alta.'],
      ],
      escuchar: [
        ['As far as I know, the meeting is at three.', 'Hasta donde sé, la reunión es a las tres.'],
        ['It’s up to you.', 'Tú decides.'],
        ['That makes sense.', 'Eso tiene sentido.'],
        ['I was wondering if you could help me.', 'Me preguntaba si me podrías ayudar.'],
        ['We’re running out of time.', 'Se nos está acabando el tiempo.'],
        ['To be honest, I think the coach got it wrong.', 'Para serte sincero, creo que el técnico se equivocó.'],
      ],
    }),
    l('Tarjetas y errores típicos del hispanohablante', 11, {
      idea: 'Antes de leer: ¿cómo se dice "tengo 30 años" y "estoy de acuerdo"? Si dijiste "I have 30 years" o "I am agree", tienes errores que vienen del español. Las tarjetas bien hechas, repasadas con espacio, son la forma más rápida de fijar vocabulario y arrancar estos errores.',
      feynman: 'Explícale a un niño de 12 años por qué "actually" no significa "actualmente", y por qué traducir palabra por palabra del español mete errores, sin usar las palabras "falso amigo" ni "interferencia".',
      reto: 'Haz 20 tarjetas de producción (español → inglés, en frase completa) con tus propios errores y frases nuevas. Repásalas con espacio (al día siguiente, a los 3 días, a la semana) y anota cuántas sabías cada vez.',
      bloques: [
        ['Tarjetas que funcionan', [
          'Producción: el frente en español (o una situación) y el reverso en inglés. Obliga a sacar la palabra, que es lo que pide hablar.',
          'Frase completa, no palabra suelta: frente "Llevo dos años viviendo aquí", reverso "I’ve been living here for two years".',
          'Dila en voz alta antes de voltearla. Si dudaste, cuenta como fallada.',
          'Espaciadas: Kornell (2009) encontró que repasar tarjetas repartidas en el tiempo le gana a repasarlas todas seguidas, aunque se sienta peor. Nakata (2011) recomienda recuperar (no solo mirar) y espaciar.',
          'Pocas y diarias: 10-20 nuevas al día como máximo; si no, en dos semanas tienes un muro de repasos.',
        ]],
        ['Falsos amigos (parecen y no son)', [
          'actually = en realidad (actualmente = currently).',
          'embarrassed = avergonzado (embarazada = pregnant).',
          'assist = ayudar (asistir a = attend). realize = darse cuenta (realizar = carry out).',
          'sensible = sensato (sensible = sensitive). library = biblioteca (librería = bookstore).',
          'career = carrera profesional (carrera universitaria = degree / major). exit = salida (éxito = success).',
        ]],
        ['Errores típicos que vienen del español', [
          '"I have 30 years" → I’m 30. "I am agree" → I agree. "Is raining" → It’s raining (en inglés el sujeto no se omite).',
          '"People is" → people are. "Explain me" → explain to me. "Depend of" → depend on.',
          '"I am here since Monday" → I’ve been here since Monday. "Make a question" → ask a question.',
          '"She don’t" → she doesn’t. "More easy" → easier. "The life is hard" → life is hard (sin "the" para hablar en general).',
        ]],
      ],
      ejemplos: [
        'En una reunión, Camila dijo "Actually, the company has 200 employees" queriendo decir "actualmente". Todos entendieron "en realidad (aunque creías otra cosa)". Con una tarjeta de "currently" lo arregló.',
        'Contraejemplo: no todos los parecidos son falsos amigos. "Important", "possible", "hospital", "family" sí significan lo mismo: apóyate en ellos.',
      ],
      practica: [
        'Haz 10 tarjetas de producción con frases completas de las lecciones anteriores.',
        'Escribe 5 frases usando bien actually, realize, attend, sensitive y currently.',
        'Lee en voz alta la lista de errores típicos diciendo la versión correcta 3 veces.',
      ],
      pregunta: '¿Cuáles de estos errores cometo yo, y en qué situación me salen más?',
      nota: 'Las tarjetas no reemplazan escuchar y hablar: sirven para fijar lo que ya encontraste en contexto. Aprender listas de palabras sueltas sin haberlas oído nunca rinde poco. Y no hace falta una app especial: unas tarjetas de papel repasadas con espacio funcionan igual, lo que importa es recuperar y espaciar.',
      recordar: [
        ['¿Qué tipo de tarjeta prepara mejor para hablar?', 'La de producción: español (o situación) al frente e inglés atrás, en frase completa, dicha en voz alta.'],
        ['¿Qué significa "actually" y cómo dices "actualmente"?', 'Actually = en realidad; actualmente = currently.'],
        ['Corrige: "I am agree, it depend of the price".', 'I agree, it depends on the price.'],
        ['¿Por qué repasar las tarjetas espaciadas aunque se sienta peor?', 'Porque se recuerdan mucho más a largo plazo que repasándolas de un tirón (Kornell, 2009).'],
        ['¿Cómo dices "tengo 30 años" y "llevo aquí desde el lunes"?', 'I’m 30; I’ve been here since Monday.'],
      ],
      tarjetas: [
        ['actually / currently', 'Actually = en realidad. Currently = actualmente.'],
        ['Tengo 30 años · Estoy de acuerdo · Está lloviendo', 'I’m 30 · I agree · It’s raining.'],
        ['Llevo aquí desde el lunes', 'I’ve been here since Monday (presente perfecto, no "I am here since").'],
      ],
      escuchar: [
        ['I’m thirty years old.', 'Tengo treinta años.'],
        ['I totally agree with you.', 'Estoy totalmente de acuerdo contigo.'],
        ['Actually, I’m currently working from home.', 'En realidad, actualmente estoy trabajando desde la casa.'],
        ['Could you explain it to me again?', '¿Me lo podrías explicar otra vez?'],
        ['I didn’t realize it was so late.', 'No me di cuenta de que era tan tarde.'],
        ['People are usually friendly here.', 'La gente normalmente es amable aquí.'],
      ],
    }),
  ],
};

const OIDO = {
  titulo: 'Escuchar y pronunciar',
  objetivo: 'Entender el inglés hablado a velocidad real (sonidos que se unen y se comen) y pronunciar de forma que te entiendan sin esfuerzo.',
  comprobacion: 'Sin mirar, haces un dictado de 1 minuto de un audio B1-B2 y aciertas la mayoría de las palabras; explicas y produces gonna, wanna, el sonido débil de "can" y las tres terminaciones de -ed; y te grabas leyendo un párrafo con /ɪ/ e /iː/ bien diferenciados.',
  fuentes: [
    ['Field, J. (2008). Listening in the Language Classroom. Cambridge University Press.', 'Cómo se procesa el audio y por qué cuesta entender el habla conectada.'],
    ['Vandergrift, L. y Goh, C. C. M. (2012). Teaching and Learning Second Language Listening: Metacognition in Action. Routledge.', 'Estrategias de escucha: predecir, verificar y revisar.'],
    ['Hamada, Y. (2016). Shadowing: Who benefits and how? Uncovering a booming EFL teaching technique for listening comprehension. Language Teaching Research, 20(1), 35-52.', 'La técnica de sombra y su efecto en la comprensión auditiva.'],
    ['Montero Perez, M., Van Den Noortgate, W. y Desmet, P. (2013). Captioned video for L2 listening and vocabulary learning: A meta-analysis. System, 41(3), 720-739.', 'Los subtítulos en el mismo idioma ayudan a entender y a aprender palabras.'],
    ['Munro, M. J. y Derwing, T. M. (1995). Foreign accent, comprehensibility, and intelligibility in the speech of second language learners. Language Learning, 45(1), 73-97.', 'Tener acento no impide que te entiendan: lo que importa es la inteligibilidad.'],
    ['Derwing, T. M. y Munro, M. J. (2015). Pronunciation Fundamentals: Evidence-based perspectives for L2 teaching and research. John Benjamins.', 'Qué partes de la pronunciación conviene priorizar según la evidencia.'],
  ],
  lecciones: [
    l('El inglés de verdad: sonidos que se unen y se comen', 10, {
      idea: 'Prueba: di rápido "What are you going to do?". Un nativo dice algo como "Whatcha gonna do?". Entiendes el inglés escrito pero no el hablado porque en la calle las palabras se pegan, se acortan y se comen. Si aprendes cómo pasa, empiezas a oírlo.',
      feynman: 'Explícale a un niño de 12 años por qué entiende un texto en inglés pero no la misma frase dicha por un nativo, usando el ejemplo de cómo hablamos rápido en español ("pa’ qué", "¿qué más pues?") y sin usar las palabras "fonética" ni "conectado".',
      reto: 'Haz un dictado diario de 1 minuto durante una semana: escucha un fragmento de un podcast con transcripción, escribe todo lo que oyes (pausando las veces que quieras) y compara. Anota qué palabras no oíste y por qué (se pegaron, se comieron, no las conocías).',
      bloques: [
        ['Formas débiles', [
          'Las palabras pequeñas (to, for, can, and, of, you, them) casi nunca se dicen completas: "to" suena /tə/, "for" /fə/, "and" /ən/, "them" /əm/.',
          '"I can swim" suena "I kən swim" (débil); "I can’t swim" suena con "can’t" fuerte y una /t/ que a veces apenas se oye. La diferencia está en el acento de la palabra.',
          'El sonido más común del inglés es la schwa /ə/, una vocal corta y relajada como "e" floja: about, banana, problem.',
        ]],
        ['Palabras que se pegan y se acortan', [
          'Se unen: "turn it off" suena "tur-ni-toff"; "an apple" suena "a-napple".',
          'Contracciones habladas: going to → gonna; want to → wanna; got to → gotta; kind of → kinda; don’t know → dunno.',
          'Did you → "didja"; would you → "wouldja"; what are you → "whatcha".',
          'En inglés estadounidense la t entre vocales suena casi como una r suave: water → "wader", better → "bedder", a lot of → "a lodda".',
        ]],
        ['Cómo entrenar el oído', [
          'Dictado: escribir lo que oyes te muestra con precisión qué no estás oyendo.',
          'Escuchar con transcripción después, no antes: primero intentas, después verificas (Vandergrift y Goh, 2012, proponen predecir, escuchar, verificar y revisar).',
          'Ritmo: el inglés acentúa unas sílabas y comprime las demás; el español da casi el mismo tiempo a todas. Oír ese ritmo es la mitad del trabajo.',
        ]],
      ],
      ejemplos: [
        'Santiago no entendía "Whaddaya wanna do tonight?" hasta que lo vio escrito: "What do you want to do tonight?". Conocía todas las palabras; lo que no conocía era cómo suenan juntas.',
        'Contraejemplo: no hace falta que tú hables así para que te entiendan. Usar "gonna" y "wanna" al hablar es opcional; reconocerlos al escuchar es obligatorio.',
      ],
      practica: [
        'Escucha las frases de esta lección con 🔊 y luego con 🐢: nota qué cambia entre la versión normal y la lenta.',
        'Haz un dictado de 1 minuto de cualquier audio con transcripción.',
        'Busca en un audio 3 casos de gonna, wanna o una palabra comida, y escríbelos.',
      ],
      pregunta: '¿Qué tipo de inglés hablado me cuesta más entender (rápido, con acento, en grupo, por teléfono) y cuál voy a escuchar esta semana?',
      nota: 'Escuchar mucho en "modo pasivo" (de fondo) sirve poco para aprender a oír: la mejora viene de escuchar con atención, verificar con la transcripción y repetir. Las voces de la app son sintéticas: suenan claras pero menos naturales que una persona; úsalas para practicar frases y complementa con audio real.',
      recordar: [
        ['¿Qué es la schwa y por qué importa?', 'La vocal débil /ə/, la más común del inglés; las sílabas sin acento suenan así y por eso "desaparecen".'],
        ['¿Cómo suena normalmente "I can swim" y cómo lo distingues de "I can’t swim"?', '"Can" suena débil (/kən/); "can’t" se dice fuerte y acentuado.'],
        ['¿Qué significan gonna, wanna y gotta?', 'Going to, want to y got to (have got to).'],
        ['¿Para qué sirve el dictado?', 'Para descubrir con precisión qué palabras no estás oyendo y por qué.'],
      ],
      tarjetas: [
        ['gonna / wanna / gotta / dunno', 'going to / want to / got to / don’t know.'],
        ['"I can" vs "I can’t" al oído', 'Can suena débil (/kən/); can’t se acentúa y suena fuerte.'],
        ['Schwa /ə/', 'La vocal débil de las sílabas sin acento: about, problem. La más común del inglés.'],
      ],
      escuchar: [
        ['What are you going to do this weekend?', '¿Qué vas a hacer este fin de semana?'],
        ['I want to go, but I have to work.', 'Quiero ir, pero tengo que trabajar.'],
        ['Did you turn it off?', '¿Lo apagaste?'],
        ['I can swim, but I can’t dive.', 'Sé nadar, pero no sé clavarme.'],
        ['There’s a lot of water on the floor.', 'Hay mucha agua en el piso.'],
        ['I don’t know what you’re talking about.', 'No sé de qué estás hablando.'],
      ],
    }),
    l('Sombra: imita para hablar y oír mejor', 10, {
      idea: '¿Cómo aprendiste las canciones que te sabes? Cantando encima. La sombra (shadowing) es eso con el inglés: escuchas una frase y la repites al tiempo o justo después, imitando ritmo, entonación y sonidos. Entrena a la vez el oído y la boca.',
      feynman: 'Explícale a un niño de 12 años cómo funciona la sombra y por qué ayuda a hablar y a entender, usando el ejemplo de cantar encima de una canción y sin usar las palabras "shadowing" ni "entonación".',
      reto: 'Escoge un audio de 1 minuto con transcripción y hazle sombra 5 minutos al día durante 7 días. Grábate el día 1 y el día 7 haciendo la sombra sin ayuda y compara: ritmo, sonidos y cuántas veces te quedaste atrás.',
      bloques: [
        ['Cómo se hace', [
          '1. Escucha el fragmento entero y entiéndelo (con transcripción si hace falta).',
          '2. Repite frase por frase, pausando: imita la música (dónde sube y baja la voz, qué palabras son fuertes).',
          '3. Sombra con texto: lee y habla encima del audio, casi al tiempo.',
          '4. Sombra sin texto: solo el audio. Es la parte difícil, la que más entrena.',
          'En la app: botón 🔁 Sombra en cada lección; reproduce cada frase y deja una pausa para que la repitas.',
        ]],
        ['Por qué ayuda', [
          'Obliga a procesar el audio rápido y en detalle: no puedes repetir lo que no oíste.',
          'Hamada (2016) encontró que la sombra mejoró la comprensión auditiva en estudiantes de inglés; el efecto fue más claro en los de nivel más bajo.',
          'Automatiza frases completas con su pronunciación: después salen solas al hablar.',
        ]],
        ['Errores comunes', [
          'Escoger un audio muy difícil: si no puedes seguirlo con texto, baja de nivel.',
          'Hacerlo en silencio o en susurro: tiene que ser en voz alta, aunque sea en el carro o en la ducha.',
          'Cambiar de audio cada día: el valor está en repetir el mismo hasta que salga.',
        ]],
      ],
      ejemplos: [
        'Valentina hace sombra 5 minutos al día con un video de 1 minuto de BBC Learning English mientras va en bus (en voz baja, pero moviendo la boca). Al mes nota que entiende mejor y que "I would have" le sale sin pensar.',
        'Contraejemplo: la sombra no sirve para aprender a construir tus propias ideas; para eso necesitas hablar libre (lección 11).',
      ],
      practica: [
        'Usa el botón 🔁 Sombra de esta lección y repite las 6 frases en voz alta.',
        'Escoge el audio de 1 minuto que vas a usar toda la semana.',
        'Hazle sombra 5 minutos con texto.',
      ],
      pregunta: '¿En qué momento del día puedo hacer 5 minutos de sombra en voz alta sin falta (carro, ducha, caminando)?',
      nota: 'La sombra tiene evidencia a favor sobre todo para la comprensión auditiva y la pronunciación, pero los estudios son pocos y la mayoría con estudiantes japoneses: tómala como una herramienta útil, no como un método mágico. Funciona mejor como complemento de escuchar mucho y hablar libre.',
      recordar: [
        ['¿Cuáles son los 4 pasos de la sombra?', 'Escuchar y entender; repetir frase por frase; sombra con texto; sombra sin texto.'],
        ['¿Por qué la sombra ayuda a entender?', 'Porque para repetir tienes que procesar el audio rápido y en detalle.'],
        ['¿Qué error hace que la sombra no funcione?', 'Un audio demasiado difícil, hacerlo en silencio o cambiar de audio cada día.'],
      ],
      tarjetas: [
        ['Sombra (shadowing)', 'Repetir en voz alta encima del audio imitando ritmo y sonidos: entrena oído y boca.'],
        ['4 pasos de la sombra', 'Entender → frase por frase → con texto → sin texto. El mismo audio varios días.'],
        ['¿Qué audio para la sombra?', 'Corto (≈ 1 min), a tu nivel, con transcripción, repetido toda la semana.'],
      ],
      escuchar: [
        ['If I had known, I would have told you.', 'Si lo hubiera sabido, te lo habría dicho.'],
        ['I’m not sure, but I think so.', 'No estoy seguro, pero creo que sí.'],
        ['How long have you been working there?', '¿Cuánto llevas trabajando allí?'],
        ['It’s not as easy as it looks.', 'No es tan fácil como parece.'],
        ['Let’s keep in touch.', 'Sigamos en contacto.'],
        ['I’d rather stay home tonight.', 'Prefiero quedarme en casa esta noche.'],
      ],
    }),
    l('Pronunciación que importa: que te entiendan', 11, {
      idea: '¿Necesitas sonar como gringo? No. La meta es que te entiendan sin esfuerzo. Unos pocos sonidos y el acento de las palabras hacen casi toda la diferencia para un hispanohablante.',
      feynman: 'Explícale a un niño de 12 años la diferencia entre "tener acento" y "no hacerse entender", y qué sonidos del inglés cuestan a los colombianos, sin usar las palabras "inteligibilidad" ni "fonema".',
      reto: 'Graba la lectura de un párrafo con palabras de los pares ship/sheep, live/leave, full/fool y verbos en pasado (worked, played, wanted). Pídele a alguien (o a un dictado por voz del celular en inglés) que lo transcriba: lo que no entienda, es tu tarea.',
      bloques: [
        ['Acento no es el problema', [
          'Munro y Derwing (1995) encontraron que hablantes con acento extranjero fuerte a menudo eran perfectamente entendibles.',
          'Lo que importa es la inteligibilidad (que te entiendan) y la comprensibilidad (que no cueste esfuerzo entenderte).',
          'Prioriza lo que causa malentendidos, no lo que suena "extranjero".',
        ]],
        ['Los sonidos clave para hispanohablantes', [
          'Vocales cortas y largas: ship /ɪ/ vs sheep /iː/; live vs leave; full vs fool. En español solo hay una "i" y una "u"; en inglés cambian el significado (y algunas parejas pueden ser embarazosas: beach/b*tch, sheet/sh*t).',
          'cat /æ/ vs cut /ʌ/: la /æ/ es abierta, entre a y e.',
          'La s inicial: "Spain", "student", "school" sin "e" adelante (no "Espain").',
          'Terminación -ed: /t/ después de sonidos sordos (worked, stopped), /d/ después de sonoros (played, called), /ɪd/ solo después de t o d (wanted, needed). "Worked" es una sílaba, no "work-ed".',
          'Finales: la -s de tercera persona y plurales (works, books) y las consonantes finales (want, world) se dicen.',
        ]],
        ['El acento de la palabra y de la frase', [
          'Acentuar la sílaba equivocada confunde más que una vocal imperfecta: PHOtograph, phoTOgraphy, photoGRAPHic; DEvelop no, deVELop.',
          'En la frase se acentúan las palabras de contenido y se comprimen las demás: "I WANT to GO to the BEACH".',
          'La entonación cambia el sentido: "Really." (bajando, aceptas) frente a "Really?" (subiendo, te sorprendes).',
        ]],
      ],
      ejemplos: [
        'Diego (otro) decía "I live in Medellín" con la vocal de "leave": sonaba "I leave in Medellín" (me voy de Medellín). Con la /ɪ/ corta se arregló.',
        'Contraejemplo: la "th" (think, this) cuesta mucho y es muy visible, pero rara vez causa malentendidos; vale la pena practicarla, pero después de las vocales y el acento de las palabras.',
      ],
      practica: [
        'Escucha con 🔊 y repite las frases de esta lección prestando atención a las vocales cortas y largas.',
        'Di en voz alta: worked, played, wanted, stopped, needed, called y clasifícalos en /t/, /d/ o /ɪd/.',
        'Busca el acento de 5 palabras largas que uses en tu trabajo (por ejemplo en un diccionario en línea con audio) y repítelas.',
      ],
      pregunta: '¿Qué palabras digo a menudo en inglés que podrían estar mal acentuadas o con la vocal equivocada?',
      nota: 'Los cursos de "elimina tu acento" venden una meta innecesaria: casi todos los adultos conservan algo de acento y eso no impide un B2 ni un buen trabajo en inglés. Lo que sí hay que pulir es lo que causa malentendidos. Si te cuesta mucho la pronunciación, un profesor que te escuche y corrija ahorra meses.',
      recordar: [
        ['¿Qué importa más, el acento o la inteligibilidad?', 'La inteligibilidad: que te entiendan sin esfuerzo. Un acento fuerte puede ser perfectamente entendible.'],
        ['¿Cómo suenan las terminaciones de worked, played y wanted?', 'Worked con /t/, played con /d/, wanted con /ɪd/ (solo después de t o d se agrega sílaba).'],
        ['¿Qué parejas de vocales confunden los hispanohablantes?', 'ship/sheep (/ɪ/ e /iː/), full/fool, cat/cut.'],
        ['¿Dónde va el acento en photograph y photography?', 'PHOtograph, phoTOgraphy.'],
      ],
      tarjetas: [
        ['Terminación -ed', '/t/ tras sordos (worked), /d/ tras sonoros (played), /ɪd/ solo tras t o d (wanted).'],
        ['ship vs sheep · live vs leave', 'Vocal corta /ɪ/ vs larga /iː/: cambian el significado.'],
        ['¿Qué priorizar en pronunciación?', 'Lo que causa malentendidos: vocales cortas/largas, acento de la palabra, -ed y consonantes finales.'],
      ],
      escuchar: [
        ['I live in a small apartment.', 'Vivo en un apartamento pequeño.'],
        ['I’m going to leave at six.', 'Me voy a ir a las seis.'],
        ['I worked late, so I called you.', 'Trabajé hasta tarde, así que te llamé.'],
        ['She wanted to study in Spain.', 'Ella quería estudiar en España.'],
        ['I took a photograph for my photography class.', 'Tomé una foto para mi clase de fotografía.'],
        ['Can you pass me a sheet of paper?', '¿Me pasas una hoja de papel?'],
      ],
    }),
  ],
};

const B2 = {
  titulo: 'Gramática B2, fluidez y la meta',
  objetivo: 'Dominar la gramática que separa B1 de B2, hablar con fluidez sobre temas generales y medir el avance hasta la meta.',
  comprobacion: 'Sin mirar, hablas 3 minutos sobre un tema general dando tu opinión con razones y ejemplos, usando bien el presente perfecto, un condicional y una forma pasiva; y escribes en 30 minutos un correo o un texto de opinión de unas 200 palabras que otra persona entienda sin esfuerzo.',
  fuentes: [
    ['Norris, J. M. y Ortega, L. (2000). Effectiveness of L2 instruction: A research synthesis and quantitative meta-analysis. Language Learning, 50(3), 417-528.', 'La instrucción explícita de gramática funciona y sus efectos duran.'],
    ['Spada, N. y Tomita, Y. (2010). Interactions between type of instruction and type of language feature: A meta-analysis. Language Learning, 60(2), 263-308.', 'La enseñanza explícita sirve tanto para reglas simples como complejas.'],
    ['DeKeyser, R. (Ed.) (2007). Practice in a Second Language: Perspectives from Applied Linguistics and Cognitive Psychology. Cambridge University Press.', 'Cómo la práctica convierte una regla sabida en habilidad automática.'],
    ['Nation, P. (1989). Improving speaking fluency. System, 17(3), 377-384.', 'La técnica 4/3/2 para ganar fluidez repitiendo una charla con menos tiempo.'],
    ['Kormos, J. y Dénes, M. (2004). Exploring measures and perceptions of fluency in the speech of second language learners. System, 32(2), 145-164.', 'Qué hace que alguien suene fluido: velocidad, pausas y fragmentos sin pausa.'],
    ['Bitchener, J. y Ferris, D. R. (2012). Written Corrective Feedback in Second Language Acquisition and Writing. Routledge.', 'Cómo usar la corrección de lo que escribes.'],
    ['Council of Europe (2001). Common European Framework of Reference for Languages: Learning, teaching, assessment. Cambridge University Press.', 'Los descriptores de B2 para hablar y escribir.'],
  ],
  lecciones: [
    l('La gramática que separa B1 de B2', 12, {
      idea: 'Traduce antes de leer: "Llevo 5 años trabajando aquí", "Si hubiera estudiado, habría pasado" y "La casa fue construida en 1990". Si te salieron, ya tienes parte del B2. B2 no pide gramática rara: pide usar bien unas pocas estructuras que permiten contar, suponer y matizar.',
      feynman: 'Explícale a un niño de 12 años la diferencia entre "I lived in Bogotá for 5 years" y "I have lived in Bogotá for 5 years", sin usar las palabras "presente perfecto" ni "pasado simple".',
      reto: 'Escribe una historia real de tu vida de unas 150 palabras usando: presente perfecto, pasado continuo, pasado perfecto, un condicional del tercer tipo y una pasiva. Después grábala contada sin leer.',
      bloques: [
        ['Tiempos verbales', [
          'Presente perfecto (have + participio): conecta pasado y presente. "I’ve worked here for 5 years" (sigo aquí). Pasado simple: algo terminado. "I worked there for 5 years" (ya no).',
          'Presente perfecto continuo: "I’ve been waiting for an hour" (y sigo esperando).',
          'Narrar: pasado continuo para el fondo ("I was driving…"), pasado simple para los hechos ("…when it started to rain") y pasado perfecto para lo de antes ("I had already left").',
          'Futuro: will (decisión del momento, predicción), going to (plan o algo que se ve venir), presente continuo (cita ya arreglada: "I’m meeting him at 5").',
        ]],
        ['Suponer y matizar', [
          'Condicionales: "If it rains, we’ll stay" (real); "If I had more time, I would study more" (imaginario ahora); "If I had studied, I would have passed" (imaginario en el pasado).',
          'Deducción: "He must be tired" (seguro que sí), "might be" (quizás), "can’t be" (imposible). En pasado: "must have been", "might have", "can’t have".',
          '"I wish I had more time" (presente) / "I wish I had gone" (pasado).',
        ]],
        ['Otras estructuras clave', [
          'Pasiva: "The project was finished last week", "It’s being repaired" (cuando importa la acción, no quién la hizo).',
          'Estilo indirecto: "She said (that) she was tired", "He asked me if I could help".',
          'Gerundio o infinitivo: "I enjoy playing", "I decided to stay"; "stop smoking" (dejar de) vs "stop to smoke" (parar para).',
          'used to / be used to / get used to: "I used to play" (antes jugaba), "I’m used to waking up early" (estoy acostumbrado), "I’m getting used to it" (me estoy acostumbrando).',
        ]],
        ['Cómo estudiarla para que salga al hablar', [
          'Norris y Ortega (2000) y Spada y Tomita (2010) mostraron que la enseñanza explícita (entender la regla con ejemplos) funciona y dura.',
          'Pero saber la regla no es usarla: DeKeyser (2007) explica que hace falta práctica hasta automatizarla. Primero entiendes, luego practicas con ejercicios, luego en frases tuyas y por último hablando.',
          'Una estructura por semana, mezclada con las anteriores (intercalar).',
        ]],
      ],
      ejemplos: [
        'En una entrevista: "I’ve been working in logistics for six years. Before that, I had worked in sales. If I get this job, I’ll be able to use both."',
        'Contraejemplo: el presente perfecto no va con un momento terminado: "I have seen him yesterday" está mal; es "I saw him yesterday".',
      ],
      practica: [
        'Escribe 3 frases tuyas con presente perfecto y 3 con pasado simple sobre tu vida.',
        'Escribe un condicional de cada tipo sobre tu trabajo o el fútbol.',
        'Haz 10 minutos de ejercicios en línea de la estructura que más te cueste.',
      ],
      pregunta: '¿Qué estructura evito al hablar porque no me siento seguro, y cuándo la voy a practicar esta semana?',
      nota: 'Estudiar solo gramática no lleva a B2, y estudiar cero gramática tampoco: la evidencia apoya combinarla con mucho input y mucha práctica. No necesitas saber el nombre de cada tiempo verbal; necesitas usarlo bien. Las reglas de los libros son simplificaciones: cuando un nativo "rompe" una regla, casi siempre es una regla más fina que todavía no viste.',
      recordar: [
        ['¿Cuándo usas presente perfecto y cuándo pasado simple?', 'Presente perfecto: conecta con el presente o sin momento definido. Pasado simple: algo terminado en un momento pasado.'],
        ['Di "Si hubiera estudiado, habría pasado".', 'If I had studied, I would have passed.'],
        ['¿Qué diferencia hay entre "stop smoking" y "stop to smoke"?', 'Stop smoking = dejar de fumar; stop to smoke = parar (lo que hacías) para fumar.'],
        ['¿Por qué saber una regla no basta?', 'Porque hay que practicarla hasta automatizarla: entender, ejercitar, usarla en frases propias y al hablar.'],
        ['Di "Debe estar cansado" y "No puede haber sido él".', 'He must be tired; it can’t have been him.'],
      ],
      tarjetas: [
        ['Llevo 5 años trabajando aquí', 'I’ve been working here for five years.'],
        ['Si hubiera sabido, te habría dicho', 'If I had known, I would have told you.'],
        ['used to / be used to / get used to', 'Antes solía / estar acostumbrado a / acostumbrarse a (+ -ing).'],
      ],
      escuchar: [
        ['I’ve been working here for five years.', 'Llevo cinco años trabajando aquí.'],
        ['I was driving home when it started to rain.', 'Iba manejando a la casa cuando empezó a llover.'],
        ['If I had more time, I would study more.', 'Si tuviera más tiempo, estudiaría más.'],
        ['He must have forgotten about the meeting.', 'Se le debe haber olvidado la reunión.'],
        ['The report was sent last Friday.', 'El informe se envió el viernes pasado.'],
        ['I’m getting used to waking up early.', 'Me estoy acostumbrando a levantarme temprano.'],
      ],
    }),
    l('Fluidez: hablar sin frenarse', 10, {
      idea: 'Piensa en alguien que habla inglés con soltura: ¿es porque no comete errores o porque no se frena? La fluidez es hablar sin pausas largas y seguir aunque falte una palabra. Se entrena repitiendo, con técnicas concretas, no esperando a "saber más".',
      feynman: 'Explícale a un niño de 12 años cómo funciona la técnica 4/3/2 y por qué hace hablar más rápido, sin usar las palabras "fluidez" ni "automatizar".',
      reto: 'Haz la técnica 4/3/2 con 3 temas distintos esta semana (tu trabajo, un partido, una decisión difícil) y grábate la versión de 2 minutos. Cuenta las pausas largas de la primera y la última grabación.',
      bloques: [
        ['Qué es sonar fluido', [
          'Kormos y Dénes (2004) encontraron que lo que más hace que alguien parezca fluido es la velocidad de habla y cuánto dura cada tramo sin pausa, no la ausencia de errores.',
          'Un B2 comete errores y sigue; lo que lo diferencia del B1 es que no se queda callado buscando la frase perfecta.',
        ]],
        ['Técnicas que funcionan', [
          '4/3/2 (Nation, 1989): cuenta lo mismo en 4 minutos, luego en 3 y luego en 2 (a personas distintas o grabándote). Al repetir con menos tiempo, lo dices más rápido y con menos pausas.',
          'Hablar solo: narra tu día, comenta un partido, explica en voz alta lo que leíste. Es práctica gratis y sin pena.',
          'Muletillas para ganar tiempo sin callarte: "Well…", "Let me think…", "The thing is…", "What I mean is…".',
          'Rodear la palabra que no sabes: "the thing you use to… (open bottles)", "it’s like a… but bigger". Seguir hablando vale más que la palabra exacta.',
        ]],
        ['Opinar como B2', [
          'Estructura: opinión → razón → ejemplo → conclusión. "I think…, because… For example,… So overall…".',
          'Matizar: "It depends on…", "On the one hand… on the other hand…", "I see your point, but…".',
          'Conectores: however, although, whereas, on top of that, in my opinion, as a result.',
        ]],
      ],
      ejemplos: [
        'Para "¿Qué opinas del trabajo remoto?": "Well, it depends. On the one hand, you save a lot of time commuting. On the other hand, it can be lonely. For example, I… So overall, I think a mix is best."',
        'Contraejemplo: la fluidez no es hablar rápido sin control. Si nadie te entiende, baja la velocidad: claridad primero.',
      ],
      practica: [
        'Haz una ronda de 4/3/2 sobre tu trabajo y graba la de 2 minutos.',
        'Escribe 5 muletillas y 5 conectores en una tarjeta y úsalos hoy hablando solo.',
        'Responde en voz alta en 1 minuto: "What’s the best decision you’ve ever made?" con opinión, razón, ejemplo y conclusión.',
      ],
      pregunta: '¿Cuándo me quedo callado en inglés, y qué frase de las de esta lección me sacaría de ese bloqueo?',
      nota: 'Hablar con errores no "fosiliza" el idioma por arte de magia si recibes corrección de vez en cuando y sigues escuchando mucho. Lo que sí estanca es no hablar nunca o hablar siempre igual sin retroalimentación. Si sientes mucha ansiedad al hablar en otro idioma, es muy común: empieza por situaciones de poco riesgo y sube poco a poco.',
      recordar: [
        ['¿Qué hace que alguien suene fluido según Kormos y Dénes?', 'La velocidad y los tramos largos sin pausa, más que no tener errores.'],
        ['¿Cómo es la técnica 4/3/2?', 'Contar lo mismo en 4, luego 3 y luego 2 minutos: al repetir con menos tiempo ganas velocidad y pierdes pausas.'],
        ['No sabes la palabra "destapador". ¿Qué dices?', 'La rodeas: "the thing you use to open bottles".'],
        ['¿Cuál es la estructura para opinar?', 'Opinión, razón, ejemplo y conclusión, con conectores.'],
      ],
      tarjetas: [
        ['Técnica 4/3/2', 'La misma charla en 4, 3 y 2 minutos: más velocidad y menos pausas.'],
        ['Muletillas para ganar tiempo', 'Well… · Let me think… · The thing is… · What I mean is…'],
        ['Opinar como B2', 'Opinión → razón → ejemplo → conclusión. On the one hand… on the other hand…'],
      ],
      escuchar: [
        ['Well, it depends on the situation.', 'Bueno, depende de la situación.'],
        ['On the one hand, it saves time. On the other hand, it’s expensive.', 'Por un lado, ahorra tiempo. Por otro, es caro.'],
        ['I see your point, but I don’t completely agree.', 'Entiendo lo que dices, pero no estoy del todo de acuerdo.'],
        ['The thing is, we don’t have enough people.', 'El tema es que no tenemos suficiente gente.'],
        ['It’s the thing you use to open bottles.', 'Es la cosa que usas para abrir botellas.'],
        ['So overall, I think it was a good decision.', 'Entonces, en general, creo que fue una buena decisión.'],
      ],
    }),
    l('Escribir, medir y llegar a la meta', 11, {
      idea: '¿Cómo vas a saber, en la semana 12, si llegaste a B2? No por cuántas lecciones hiciste, sino por lo que puedes hacer. Esta lección cierra el método: escribir con corrección, medir el avance cada 2 semanas y ajustar el plan a lo que falte.',
      feynman: 'Explícale a un niño de 12 años cómo vas a saber si ya tienes nivel B2 sin hacer un examen oficial, sin usar las palabras "nivel", "examen" ni "descriptor".',
      reto: 'Haz una "prueba B2" casera: escucha 5 minutos de un podcast nativo y resume las ideas principales por escrito; escribe un texto de opinión de 200 palabras en 30 minutos; y graba 3 minutos de opinión sobre un tema nuevo. Repite la misma prueba en 2 semanas y compara.',
      bloques: [
        ['Escribir para B2', [
          'B2 escribe textos claros y detallados: un correo formal, un texto de opinión o un informe corto, con párrafos y conectores.',
          'Estructura de opinión: introducción con tu postura, 2 párrafos de razones con ejemplos, un párrafo con el otro lado y una conclusión.',
          'Correo formal: "I’m writing to…", "I would be grateful if…", "I look forward to hearing from you", "Kind regards".',
          'La corrección escrita ayuda cuando es enfocada (Bitchener y Ferris, 2012): mejor que te marquen tus 2-3 errores repetidos que cada coma. Reescribe el texto corregido; no solo lo leas.',
        ]],
        ['Medir el avance', [
          'Cada 2 semanas, la misma prueba casera: resumen de un audio, un texto de 200 palabras y 3 minutos hablando. Guarda todo con fecha.',
          'Compara con los descriptores B2: ¿entiendo las ideas principales de un audio nativo? ¿Opino 3 minutos sin quedarme callado? ¿Mi texto se entiende sin esfuerzo?',
          'Pruebas gratuitas en línea para estimar comprensión: úsalas en la semana 6 y la 12.',
          'Si quieres certificado: Cambridge B2 First, IELTS o TOEFL. Haz al menos un simulacro completo antes, con tiempo.',
        ]],
        ['Ajustar el plan', [
          'Si el audio sigue costando: más horas de escuchar y dictado, y bajar un poco el nivel del material.',
          'Si te quedas callado: más 4/3/2, más conversaciones y menos gramática nueva.',
          'Si escribes con errores repetidos: tarjetas con tus errores y un texto corregido por semana.',
          'Si no cumples la rutina: recórtala a lo mínimo (30 min) pero diaria. La constancia le gana a los maratones.',
        ]],
      ],
      ejemplos: [
        'Semana 6: Sebastián resume un podcast con 3 de 5 ideas, se queda callado 4 veces en 3 minutos y su texto tiene 12 errores de tiempos verbales. Ajusta: más 4/3/2 y tarjetas de tiempos. En la semana 8 se queda callado una vez.',
        'Contraejemplo: terminar las 12 lecciones de este curso no te da B2. El curso te da el método; el nivel lo dan las horas de escuchar, hablar, leer y escribir.',
      ],
      practica: [
        'Haz hoy la prueba casera completa y guárdala con fecha.',
        'Escribe un correo formal corto pidiendo información sobre un curso o un trabajo.',
        'Pon en el calendario las próximas pruebas: cada 2 semanas hasta la semana 12.',
      ],
      pregunta: '¿Cuál de las 4 habilidades (escuchar, hablar, leer, escribir) está más lejos de B2 hoy, y qué cambio en mi rutina la ataca?',
      nota: 'Cada examen mide distinto: un B2 en un examen de comprensión no garantiza un B2 al hablar, y al revés. Por eso la prueba casera mide las cuatro habilidades. Ojo con las academias o apps que entregan "certificados B2" propios: el que vale para trabajos y estudios es el de un examen reconocido.',
      recordar: [
        ['¿Cuál es la estructura de un texto de opinión?', 'Introducción con la postura, razones con ejemplos, el otro lado y conclusión.'],
        ['¿Qué tipo de corrección escrita ayuda más?', 'La enfocada en tus errores repetidos, y reescribir el texto corregido.'],
        ['¿Qué incluye la prueba casera cada 2 semanas?', 'Resumir un audio nativo, escribir 200 palabras de opinión y hablar 3 minutos.'],
        ['Te quedas callado al hablar. ¿Qué cambias del plan?', 'Más 4/3/2 y conversaciones, menos gramática nueva.'],
      ],
      tarjetas: [
        ['Prueba casera B2 (cada 2 semanas)', 'Resumir 5 min de audio nativo + 200 palabras de opinión en 30 min + 3 min hablando. Comparar.'],
        ['Correo formal: frases clave', 'I’m writing to… · I would be grateful if… · I look forward to hearing from you.'],
        ['Corrección escrita útil', 'Enfocada en 2-3 errores repetidos y reescribir el texto, no solo leer las correcciones.'],
      ],
      escuchar: [
        ['I’m writing to ask for more information about the course.', 'Escribo para pedir más información sobre el curso.'],
        ['I would be grateful if you could send me the details.', 'Le agradecería si me pudiera enviar los detalles.'],
        ['I look forward to hearing from you.', 'Quedo atento a su respuesta.'],
        ['In my opinion, the advantages outweigh the disadvantages.', 'En mi opinión, las ventajas superan a las desventajas.'],
        ['However, some people argue that it’s too expensive.', 'Sin embargo, algunas personas dicen que es muy caro.'],
        ['To sum up, I believe it’s worth it.', 'En resumen, creo que vale la pena.'],
      ],
    }),
  ],
};

export default {
  id: 'ingles-b2',
  nombre: 'Inglés: camino a B2 en 12 semanas',
  area: 'comunicacion',
  icono: '🇬🇧',
  nivel: 'Intermedio',
  idioma: 'en-US',
  paraQue: 'Llegar a B2 (conversar con fluidez, entender series y reuniones, escribir con claridad) con un método de 12 semanas que combina escuchar, hablar, vocabulario en frases y gramática. Cada lección trae frases que la app te lee en voz alta para escuchar y repetir.',
  ancla: 'Aprender inglés es como ponerse en forma en el gym: nadie se pone fuerte leyendo sobre ejercicios. Escuchar es comer bien (sin eso no hay de dónde crecer), hablar es levantar el peso (duele y es donde se nota el progreso), la corrección es el entrenador que te arregla la técnica, y las tarjetas son la constancia que evita perder lo ganado. Y como en el gym, lo que cuenta son las horas bien hechas, todas las semanas.',
  principios: [
    'Un nivel es lo que puedes HACER con el idioma, no la gramática que estudiaste.',
    'Se adquiere entendiendo mensajes: muchas horas de audio y texto que entiendes casi todo.',
    'Unas pocas miles de palabras frecuentes, aprendidas en frases, cubren casi todo lo que oyes y dices.',
    'Entender y producir son habilidades distintas: hablar y escribir, con corrección, es lo que te hace producir.',
    'El inglés hablado se pega y se come sonidos: hay que entrenar el oído con audio real, no solo leer.',
    'Saber una regla no es usarla: la gramática se vuelve habilidad con práctica hasta que sale sola.',
    'Las horas de atención son lo que no se puede saltar: la constancia diaria le gana a los maratones.',
  ],
  ochenta: 'Escuchar con atención material que entiendes casi todo (con sombra y dictado) y hablar todos los días en voz alta con algo de corrección. Esas dos cosas, unos 45-60 minutos al día, dan la mayor parte del avance. Las tarjetas de frases fijan lo que encuentras, y la gramática ordena; pero sin las horas de escuchar y hablar no se llega a B2.',
  diagnostico: [
    ['Traduce: "Ayer fui al cine con mis amigos y después comimos pizza".', 'Yesterday I went to the cinema (movies) with my friends and then we ate (had) pizza. Si te salió sin dudar, tienes un A2 sólido en pasado simple.'],
    ['Traduce: "Llevo dos años trabajando aquí, pero antes había trabajado en ventas".', 'I’ve been working here for two years, but before that I had worked in sales. Si te salió bien y rápido, estás en B1 o más: B2 en 3 meses es posible con 1,5-2 horas diarias.'],
    ['Habla 1 minuto en voz alta, sin preparar, respondiendo: "Should people work from home? Why?". ¿Diste una opinión con razón y ejemplo, sin quedarte callado más de unos segundos?', 'Una respuesta B2 da postura clara, al menos una razón con ejemplo, menciona el otro lado y concluye ("Well, it depends. On the one hand… For example… On the other hand… So overall…"). Si te quedaste callado o solo dijiste frases sueltas, tu habla está en B1 o menos: carga más horas de hablar.'],
  ],
  modulos: [METODO, VOCABULARIO, OIDO, B2],
  proyecto: {
    titulo: '12 semanas a B2',
    intro: 'El plan completo para pasar del curso a la práctica diaria. Cada semana sigues la rutina de 90 minutos (o la mínima de 30) y cumples un objetivo concreto. Al final mides con la misma prueba del principio.',
    pasos: [
      'Semana 0: prueba de nivel en línea, grabación de 2 minutos sobre tu trabajo y prueba casera B2 (audio, texto, habla). Guarda todo con fecha y crea el hábito diario en la app.',
      'Semanas 1-2: rutina diaria completa; escoge tus fuentes de audio a tu nivel; 10 tarjetas de frases por día; primera conversación con una persona.',
      'Semanas 3-4: sombra 5 minutos diarios con el mismo audio por semana; dictado de 1 minuto; tus 10 errores típicos convertidos en tarjetas. Prueba casera #2.',
      'Semanas 5-6: una estructura gramatical por semana (presente perfecto y narración; condicionales); 4/3/2 tres veces por semana. Prueba de nivel en línea y prueba casera #3: ajusta el plan.',
      'Semanas 7-8: pasa a audio nativo con subtítulos en inglés (series, podcasts de tus temas); pasiva y estilo indirecto; un texto escrito corregido por semana. Prueba casera #4.',
      'Semanas 9-10: conversaciones de 30 minutos sobre temas de opinión; deducción y wish; correos formales. Prueba casera #5.',
      'Semanas 11-12: simulacros con tiempo (escuchar, leer, escribir, hablar); repasa tus errores repetidos. Al final: prueba de nivel, prueba casera y la grabación de 2 minutos sobre tu trabajo; compara con la semana 0.',
      'Escribe qué funcionó, qué no, y tu plan para los siguientes 3 meses (mantener o subir a C1).',
    ],
  },
};
