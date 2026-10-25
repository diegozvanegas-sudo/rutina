// Los Cuatro Acuerdos (Dr. Miguel Ruiz, Urano): 14 lecturas, una por día, con todo el libro ordenado.
// Mismo formato que fenix.js (ver .claude/skills/agregar-libro/SKILL.md).
// El PDF es un escaneo de la edición de Urano; le faltan las páginas 134-135, reconstruidas con otras fuentes (ver notas de las lecturas 11 y 12).
// "nota": lo que se agregó aparte del libro (datos que conviene matizar o complementar).

const d = (n, titulo, temas, datos) => ({ n, titulo, temas, formulas: [], nota: '', ...datos });

const LECTURAS = [
  d(1, 'Los toltecas y el Espejo Humeante', ['toltecas', 'teotihuacan', 'nagual', 'espejo humeante', 'luz', 'introduccion'], {
    idea: 'Lo que realmente eres es amor y luz; lo que no te deja verlo es el humo de tus creencias: el Sueño.',
    intro: 'Antes de los acuerdos, Ruiz cuenta de dónde viene este conocimiento y la historia del hombre que se llamó Espejo Humeante. Es la base de todo el libro: vivimos dentro de un sueño hecho de creencias, y ese sueño se puede cambiar.',
    bloques: [
      ['Los toltecas', [
        'Hace miles de años, en el sur de México, los toltecas eran conocidos como "mujeres y hombres de conocimiento": científicos y artistas que formaron una sociedad para estudiar y conservar el conocimiento espiritual y las prácticas de los antiguos.',
        'Maestros (naguales) y estudiantes se reunían en Teotihuacán, la antigua ciudad de las pirámides, conocida como "el lugar en el que el hombre se convierte en Dios".',
        'Con la conquista europea y el mal uso del poder personal de algunos aprendices, el conocimiento se ocultó. Se transmitió por distintos linajes de naguales; las profecías anunciaban que llegaría el momento de devolverlo a la gente.',
        'Miguel Ruiz es un nagual del linaje de los Guerreros del Águila. El conocimiento tolteca no es una religión: respeta a todos los maestros espirituales y es, sobre todo, una manera de vivir que da fácil acceso a la felicidad y al amor.',
      ]],
      ['La historia del Espejo Humeante', [
        'Hace 3.000 años, un hombre que estudiaba para ser chamán sentía que debía haber algo más. Una noche, en una cueva, soñó que veía su propio cuerpo dormido; salió y vio la luna llena y millones de estrellas.',
        'Entonces comprendió: "Estoy hecho de luz; estoy hecho de estrellas". No son las estrellas las que crean la luz: es la luz la que crea las estrellas.',
        'Todo está hecho de luz, y el espacio entre las cosas no está vacío. Todo lo que existe es un único ser vivo; la luz es la mensajera de la vida y lleva toda la información.',
        'Las estrellas (la materia) son el tonal; la luz entre ellas es el nagual; lo que crea la armonía entre ambos es la Vida, o el Intento. La Vida es la fuerza de lo absoluto, el Creador.',
      ]],
      ['El espejo y el humo', [
        'Todo lo que existe es una manifestación de ese ser vivo que llamamos Dios. La percepción humana es luz que percibe luz; la materia es un espejo que refleja la luz y crea imágenes.',
        'El mundo de ilusión, el Sueño, es como un humo que nos impide ver lo que somos: "Lo que realmente somos es puro amor, pura luz".',
        'Ese hombre se vio en todo: en cada persona, animal, árbol, agua y estrella, y dejó de juzgar. "Soy Dios. Pero vosotros también lo sois. Todos somos iguales. Somos imágenes de luz". Nadie lo entendió.',
        'Cada uno de nosotros es un espejo; entre los espejos hay un muro de niebla: la interpretación de las imágenes de luz, el Sueño de los seres humanos. Por eso se llamó Espejo Humeante: "Ese humo es el Sueño, y el espejo eres tú, el soñador".',
        'El libro abre con una cita de John Lennon: es fácil vivir con los ojos cerrados, interpretando mal todo lo que se ve.',
      ]],
    ],
    nota: 'La "tradición tolteca" de Ruiz es una enseñanza espiritual, no historia académica: los toltecas históricos vivieron en Tula (siglos X-XII) y Teotihuacán es varios siglos anterior a ellos. En náhuatl, "tolteca" también significa artista o sabio, y ese es el sentido que usa el libro. Léelo como una metáfora potente sobre cómo funcionan las creencias, no como un dato histórico.',
    afirmacion: 'Soy luz y soy amor; el humo de mis creencias no es lo que soy.',
    practica: [
      'Esta noche mira el cielo o la luz de la mañana 2 minutos y repite: "Estoy hecho de luz".',
      'Elige a una persona que te cae mal y busca en ella algo de ti: hoy no la juzgues.',
      'Escribe 3 creencias sobre ti que podrían ser "humo" y no la verdad.',
    ],
    pregunta: '¿Qué parte de cómo veo mi vida podría ser humo (interpretación) y no la realidad?',
  }),

  d(2, 'La domesticación y el sueño del planeta', ['domesticacion', 'sueno del planeta', 'creencias', 'acuerdos', 'premio castigo', 'infancia', 'atencion'], {
    idea: 'Todo lo que crees lo aprendiste por acuerdo, sin elegirlo: así te domesticaron.',
    intro: 'Lo que ves y escuchas ahora mismo es un sueño. Este capítulo explica cómo se forma ese sueño: el de la sociedad (el sueño del planeta) entra en cada uno por la atención, la repetición y los premios y castigos, hasta volverse nuestro sistema de creencias.',
    bloques: [
      ['Todo es un sueño', [
        'Soñar es la función principal de la mente, y la mente sueña 24 horas al día. Despiertos hay un marco material que ordena las cosas de forma lineal; dormidos, no.',
        'El sueño del planeta es el sueño colectivo de miles de millones de sueños personales: familia, comunidad, ciudad, país, humanidad. Incluye las reglas, creencias, leyes, religiones, culturas, gobiernos, escuelas y celebraciones de la sociedad.',
        'Nacemos con la capacidad de aprender a soñar. Los seres humanos que viven antes que nosotros nos enseñan a soñar como sueña la sociedad, usando a mamá, papá, la escuela y la religión.',
      ]],
      ['La atención y los acuerdos', [
        'La atención es la capacidad de discernir y centrarnos en lo que queremos percibir. Por medio de ella, y con mucha repetición, los adultos nos enseñaron qué creer, qué es aceptable y qué no, qué es bueno y malo, bello y feo, correcto e incorrecto.',
        'La necesidad de atención se vuelve competitiva ("¡Mírame!") y sigue en los adultos.',
        'El lenguaje es un código: cada palabra es un acuerdo. Tú no escogiste tu lengua, tu religión, tus valores ni tu nombre: solo estuviste de acuerdo.',
        'La única forma de almacenar información es por acuerdo. Estar de acuerdo es creer, y creer incondicionalmente es tener fe. De niños creímos todo lo que nos decían.',
      ]],
      ['Cómo nos domesticaron', [
        'La información del sueño externo pasa al sueño interno y crea todo nuestro sistema de creencias: el nombre de las cosas, qué es ser mujer u hombre, y a juzgar: a nosotros, a los demás, a los vecinos.',
        'Nos domesticaron como a un perro o un gato: con premios y castigos. "Niño bueno", "niña mala". El castigo duele y el premio es atención.',
        'Por miedo al castigo y a no recibir el premio empezamos a fingir para complacer: a ser lo que no somos. El miedo a ser rechazados se vuelve miedo a no ser lo bastante buenos.',
        'En la domesticación perdemos nuestras tendencias naturales. Al crecer aprendimos a decir "¡No!" para defender nuestra libertad, pero los adultos eran más grandes y fuertes, y nos rendimos.',
        'La domesticación es tan poderosa que ya no hace falta un domador: somos animales autodomesticados. Nos castigamos y premiamos solos, con las mismas reglas que nos enseñaron.',
      ]],
    ],
    nota: 'En tu copia del libro escribiste: "El miedo a ser rechazados = miedo a no ser lo bastante buenos". Es justo la idea central de esta lectura. Hoy la psicología explica algo muy parecido con los "esquemas" que se forman en la infancia y se revisan en terapia. No se trata de culpar a los padres (la lectura 10 insiste en eso), sino de ver qué creencias tomaste sin elegirlas.',
    afirmacion: 'Hoy elijo qué creer: ya no soy un niño que acepta todo.',
    practica: [
      'Escribe 5 creencias que tienes y, al lado de cada una, quién te la enseñó.',
      'Nota hoy cada vez que actúes para complacer a alguien y no porque lo quieres.',
      'Pregúntate ante un "debería": ¿lo elegí yo o me lo enseñaron?',
    ],
    pregunta: '¿Qué creencias sobre mí mismo nunca elegí, pero sigo obedeciendo?',
  }),

  d(3, 'El Juez, la Víctima y el Libro de la Ley', ['juez', 'victima', 'libro de la ley', 'culpa', 'perfeccion', 'autorrechazo', 'maltrato', 'infierno', 'mitote'], {
    idea: 'Dentro de ti un Juez te condena y una Víctima sufre, siguiendo un Libro de la Ley lleno de mentiras.',
    intro: 'La domesticación deja instalado un sistema completo: un libro de reglas que no se cuestiona, un juez que lo aplica todo el día y una víctima que carga la culpa. De ahí sale el "infierno" que vivimos y el maltrato a nosotros mismos.',
    bloques: [
      ['El Libro de la Ley', [
        'El sistema de creencias es como un Libro de la Ley que gobierna la mente. No se cuestiona: lo que dice es "la verdad", y es la base de todos nuestros juicios, aunque vaya contra nuestra naturaleza. Incluye leyes morales como los Diez Mandamientos.',
        'Lo que va contra el Libro de la Ley produce una sensación en el plexo solar: miedo. Abre heridas emocionales y genera veneno emocional.',
        'Cuestionar nuestras creencias da inseguridad: aunque el Libro esté equivocado, nos hace sentir seguros. Se necesita mucha valentía para desafiarlo; incluso sabiendo que una regla es errónea, sentimos culpa al romperla.',
      ]],
      ['El Juez y la Víctima', [
        'El Juez interior lo juzga todo: el clima, el perro, el gato, lo que hacemos, pensamos y sentimos. Dice quién es culpable y merece castigo y vergüenza, muchas veces al día.',
        'La Víctima recibe los juicios y carga la culpa, el reproche y la vergüenza: "¡Pobre de mí! No soy suficientemente bueno, ni inteligente ni atractivo, y no merezco ser amado". Y el Juez le da la razón.',
        'Así, creencias que nunca escogimos siguen controlándonos años después.',
      ]],
      ['Pagar mil veces por el mismo error', [
        'La verdadera justicia es pagar una sola vez por cada error. Pagar varias veces es injusto.',
        'El ser humano es el único animal que paga miles de veces por el mismo error: tiene gran memoria. Cada vez que lo recordamos, nos juzgamos y nos castigamos otra vez.',
        'Y lo hacemos pagar a la pareja, a los hijos y a los padres: les recordamos su error una y otra vez y les lanzamos veneno emocional.',
        'El Juez está equivocado porque el Libro de la Ley es erróneo. Ruiz dice que el 95% de las creencias que almacenamos son mentiras, y que sufrimos porque creemos en todas ellas.',
      ]],
      ['El sueño del infierno', [
        'El sueño del planeta hace normal sufrir, vivir con miedo y crear dramas: violencia, guerras, injusticia. En conjunto es una pesadilla gobernada por el miedo.',
        'La descripción del infierno de las religiones (castigo, miedo, dolor, fuego) es la sociedad humana. La cólera, los celos, la envidia y el odio son el fuego que arde dentro. El infierno es un estado de ánimo, y ya vivimos en él; otros solo pueden hundirnos más si se lo permitimos.',
        'Buscamos verdad, justicia y belleza porque solo creemos mentiras, no hay justicia en nuestro sistema y no creemos ser bellos. Todo eso ya está en nosotros: las creencias nos ciegan.',
        'Necesitamos tener razón y que el otro esté equivocado. La mente es una bruma que los toltecas llaman mitote: miles de personas hablando a la vez sin que nadie entienda a nadie. En la India se llama maya, ilusión.',
      ]],
      ['El miedo a vivir y la imagen de perfección', [
        'El mayor miedo no es la muerte: es arriesgarnos a vivir, a estar vivos y expresar lo que somos. Vivimos según el punto de vista de otros por miedo a no ser aceptados y no ser lo bastante buenos.',
        'Nos hicimos una imagen de perfección (la de papá, mamá, los hermanos mayores, sacerdotes, profesores) para ser aceptados. Como no encajamos en ella, nos rechazamos y no nos perdonamos por no ser quien creemos que deberíamos ser.',
        'Nos volvemos falsos, usamos máscaras sociales por miedo a ser descubiertos y juzgamos a los demás con la misma imagen. Nos deshonramos para complacer y dañamos el cuerpo para ser aceptados (como el adolescente que se droga para no ser rechazado).',
        'Ante otros negamos nuestros errores; a solas, el Juez nos dice estúpidos, inútiles, indignos.',
      ]],
      ['El límite del maltrato', [
        'Nadie en toda tu vida te ha maltratado más que tú mismo. El límite del maltrato que toleras de otra persona es el mismo al que te sometes tú.',
        'Si alguien te maltrata más, te alejas. Si te maltrata un poco menos que tú, seguramente sigues con esa relación y la toleras siempre.',
        'Si te castigas de forma exagerada, puedes tolerar a alguien que te agrede, te humilla y te trata como basura, porque tu sistema de creencias dice: "Me lo merezco. Esta persona me hace un favor al estar conmigo. No soy digno de amor ni de respeto".',
        'Cuanta más autoestima, menos nos maltratamos. El abuso de uno mismo nace del autorrechazo, y este de una imagen de perfección imposible: por ella no nos aceptamos tal como somos ni aceptamos a los demás tal como son.',
      ]],
    ],
    nota: 'El "95%" es una forma de hablar, no una medida. Lo valioso es la idea de que el maltrato que aceptas de otros se parece al que te das tú. Si hoy vives agresión física, humillación o control, no es tu culpa ni algo que "te mereces": busca apoyo. En Colombia: 123 en emergencias y la línea 192, opción 4, para salud mental.',
    afirmacion: 'Pago una sola vez por cada error; ya no me castigo más.',
    practica: [
      'Cuando escuches al Juez ("eres un…"), nómbralo: "Ese es el Juez" y no le respondas.',
      'Elige un error viejo que sigues pagando y escribe: "Ya pagué por esto".',
      'Escribe tu imagen de perfección: ¿cómo "deberías" ser? ¿De quién es esa imagen?',
    ],
    pregunta: '¿Qué maltrato me hago a mí mismo que nunca aceptaría de otra persona?',
  }),

  d(4, 'El preludio y el poder de las palabras', ['acuerdos', 'poder personal', 'palabras', 'impecable', 'magia', 'hechizo', 'semillas', 'opiniones'], {
    idea: 'Tus palabras son tu poder para crear: pueden hechizar o liberar, a otros y a ti.',
    intro: 'Si la vida está hecha de acuerdos y el sueño no nos gusta, hay que cambiar los acuerdos. Ruiz propone cuatro, y el primero es el más importante y el más difícil: sé impecable con tus palabras. Empieza por entender qué son las palabras y qué hacen.',
    bloques: [
      ['El preludio de un nuevo sueño', [
        'Has hecho miles de acuerdos: contigo, con otras personas, con el sueño que es tu vida, con Dios, la sociedad, tus padres, tu pareja y tus hijos. Los más importantes son los que hiciste contigo: quién eres, qué sientes, qué crees y cómo debes comportarte. El resultado es tu personalidad.',
        'Un solo acuerdo no sería problema, pero tenemos muchos que nos hacen sufrir y fracasar. Para vivir con alegría hace falta valentía para romper los acuerdos basados en el miedo y reclamar tu poder personal.',
        'Los acuerdos que nacen del miedo gastan mucha energía; los que nacen del amor la conservan y la aumentan.',
        'Nacemos con poder personal que se renueva cada día con el descanso, pero lo gastamos en crear y mantener acuerdos, hasta quedar con el justo para sobrevivir.',
        'Cada vez que rompes un acuerdo, todo el poder que usaste para crearlo vuelve a ti. Los cuatro acuerdos te dan ese poder para cambiar todo tu sistema de acuerdos y crear tu propio sueño del cielo.',
      ]],
      ['Las palabras son magia', [
        'Las palabras son tu poder para crear; un don de Dios. El Evangelio de San Juan dice: "En el principio existía el Verbo, y el Verbo estaba con Dios, y el Verbo era Dios". Lo que sueñas, lo que sientes y lo que eres lo muestras con palabras.',
        'No son solo sonidos o símbolos: son una fuerza para expresar, comunicar, pensar y crear los acontecimientos de tu vida. ¿Qué otro animal puede hablar?',
        'Son una espada de doble filo: pueden crear el sueño más bello o destruir todo lo que te rodea. Un filo es el mal uso, que crea un infierno; el otro es la impecabilidad, que crea belleza, amor y el cielo en la tierra.',
        'Bien usadas son magia; mal usadas, magia negra. Una sola palabra puede cambiar una vida o destruir a millones: Hitler manipuló con palabras a un país entero, activó el miedo y llevó al mundo a la guerra.',
      ]],
      ['La mente es un campo fértil', [
        'La mente es un campo donde se plantan semillas: opiniones, ideas, conceptos. Las palabras son semillas, y la mente suele ser muy fértil para las del miedo.',
        'Cada mente es fértil para el tipo de semilla para la que está preparada. Lo importante es descubrir para cuál es fértil la tuya y prepararla para las semillas del amor.',
        'Un miedo o una duda plantados en la mente crean una serie interminable de acontecimientos. Una palabra es como un hechizo, y los humanos nos hechizamos unos a otros imprudentemente.',
      ]],
      ['Las opiniones son hechizos', [
        'Todo ser humano es un mago: con palabras puede hechizar a alguien o liberarlo de un hechizo. Lanzamos hechizos con nuestras opiniones.',
        'Ejemplo del libro: "Veo en tu cara el color de los que acaban teniendo cáncer". Si la persona lo escucha y está de acuerdo, el miedo trabaja en ella.',
        'De niños, padres y hermanos opinaban sin pensar: "no sirves para nadar, para los deportes, para escribir". "¡Mira qué niña tan fea!": la niña crece creyéndose fea, sin importar lo guapa que sea, mientras mantenga ese acuerdo.',
        'Si crees que eres estúpido, harás cosas para confirmarlo ("Me gustaría ser inteligente, pero debo ser estúpido, si no, no habría hecho esto"). Alguien que te dice con verdad que no lo eres te ayuda a romper ese hechizo; alguien que te llama "la persona más estúpida" lo refuerza.',
      ]],
      ['Qué es ser impecable', [
        'Impecable viene del latín: im (sin) y pecatus (pecado). Pecado es cualquier cosa que haces, sientes, crees o dices que va contra ti: juzgarte y culparte.',
        'Ser impecable es no ir contra ti mismo y asumir la responsabilidad de tus actos sin juzgarte ni culparte. El pecado deja de ser algo moral o religioso y se vuelve sentido común.',
        'El mayor pecado es rechazarte a ti mismo: es el "pecado mortal" porque lleva a la muerte. La impecabilidad lleva a la vida.',
        'Si te insulto en la calle, uso la palabra contra mí: me odiarás, y tu odio no es bueno para mí. Si me amo, seré impecable contigo, porque la acción provoca una reacción semejante: si te amo me amarás, si te insulto me insultarás, si siento gratitud por ti la sentirás por mí.',
      ]],
    ],
    nota: 'Matiz importante: una frase no "causa" un cáncer, y el libro lo exagera para mostrar el poder de las palabras. Lo que sí está demostrado es que lo que creemos influye en cómo nos sentimos y actuamos (efecto placebo y nocebo, estrés crónico). Si alguien te asusta con tu salud, la respuesta impecable es ir al médico, no cargar el miedo.',
    afirmacion: 'Soy impecable con mis palabras: las uso para la verdad y el amor.',
    practica: [
      'Hoy no digas nada contra ti, ni en voz alta ni en tu mente. Cada vez que pase, corrígelo.',
      'Recuerda una opinión que te "hechizó" de niño y escribe cuál es la verdad.',
      'Di a una persona algo verdadero y bueno sobre ella.',
    ],
    pregunta: '¿Qué hechizo de mi infancia (una frase que me dijeron) sigo creyendo hoy?',
  }),

  d(5, 'Sé impecable: chismes, hechizos y cómo te hablas', ['chismes', 'chisme', 'virus', 'hechizo', 'verdad', 'opinion', 'autoestima', 'hablarme', 'magia negra', 'impecable'], {
    idea: 'Solo la verdad deshace un hechizo; y la forma de medir tu impecabilidad es cuánto te amas.',
    intro: 'Segunda parte del primer acuerdo. Ruiz muestra con ejemplos cómo usamos las palabras para propagar veneno (a nuestros hijos, entre amigos, con chismes y con nosotros mismos), y cómo ser impecable te vuelve inmune.',
    bloques: [
      ['Por qué es tan difícil', [
        'Ser impecable es usar tu energía en la dirección de la verdad y del amor por ti mismo. Ese solo acuerdo basta para que la verdad se manifieste a través de ti y limpie el veneno emocional.',
        'Es difícil porque aprendimos lo contrario: hicimos de la mentira un hábito al comunicarnos con los demás y, más aún, al hablarnos a nosotros mismos.',
        'En el infierno usamos las palabras para maldecir, culpar, reprochar, destruir; para propagar rabia, celos, envidia y odio; para vengarnos y fomentar el odio entre personas, familias, razas y naciones.',
      ]],
      ['La niña que dejó de cantar', [
        'Una mujer inteligente y de gran corazón llega a casa cansada, tensa y con dolor de cabeza. Su hija salta y canta feliz cada vez más fuerte. La madre pierde el control: "¡Cállate! Tienes una voz horrible. ¿Es que no puedes estar callada?".',
        'La voz de la niña no era horrible: la tolerancia de la madre era nula. Pero la hija le creyó e hizo un acuerdo: nunca volvió a cantar, se volvió tímida y le costaba hablar. Creyó que debía reprimir sus emociones para que la amaran.',
        'Fue un hechizo de la persona que más la quería, que no sabía el poder de sus palabras. No se la puede culpar: hizo lo que le hicieron a ella. ¿Cuántas veces hacemos lo mismo con nuestros hijos? Las personas que nos quieren no saben lo que hacen; por eso debemos perdonarlas.',
      ]],
      ['La amiga y el vestido', [
        'Te arreglas dos horas frente al espejo y te sientes feliz. Una amiga te dice: "¿Qué te ha pasado? Estás horrorosa. Mira tu vestido; haces el ridículo". Basta para mandarte al infierno.',
        'Si aceptas esa opinión, se vuelve un acuerdo y pones todo tu poder en ella.',
        'La única forma de deshacer un hechizo es un nuevo acuerdo basado en la verdad. La espada tiene dos filos: las mentiras que crean magia negra y la verdad que deshace los hechizos. Solo la verdad nos hará libres.',
      ]],
      ['Los chismes: un virus', [
        'Los chismes son la peor magia negra: puro veneno. Los aprendimos de niños, escuchando a los adultos opinar sin parar, incluso de gente que no conocían. Hoy son la principal forma de comunicarnos: ver a otro tan mal como nosotros nos hace sentir mejor. "A la miseria le gusta estar acompañada".',
        'Si la mente es un ordenador, el chisme es un virus: un programa escrito en el mismo lenguaje pero con intención dañina. Entra sin que te des cuenta y llena todo de mensajes contradictorios.',
        'Ejemplo: empiezas un curso que esperabas y alguien te dice: "¡Ese profesor es un pedante y un pelmazo! No tiene ni idea, y además es un pervertido". No sabes sus motivos (quizá suspendió, quizá fueron prejuicios), pero el veneno queda: ves al profesor con sus ojos, lo cuentas a otros y terminas dejando de ir. Culpas al profesor; el culpable es el chisme.',
        'Al contagiarnos unos a otros, el mundo se llena de circuitos obstruidos por un virus venenoso: el mitote. Peores aún son los "piratas" que lo extienden a propósito, para vengarse, y se dicen que el otro "recibió su justo castigo".',
      ]],
      ['Cómo te hablas', [
        'Nos hablamos todo el tiempo: "Estoy gordo. Soy feo. Me hago viejo. Me estoy quedando calvo. Soy estúpido, nunca entiendo nada. Nunca seré lo suficientemente bueno. Nunca seré perfecto".',
        'Hay que entender lo que son las palabras y lo que hacen. Con el primer acuerdo cambia tu manera de tratarte y de tratar a otros, sobre todo a quienes más quieres.',
        '¿Cuántas veces has contado chismes del ser que más amas para que otros apoyen tu punto de vista? Tu opinión no es más que tu punto de vista, y no tiene por qué ser verdad: viene de tus creencias, tu ego y tu propio sueño.',
      ]],
      ['La inmunidad', [
        'Siendo impecable, el veneno desaparece de tu mente y dejas de transmitirlo, incluso a tu perro o tu gato.',
        'Solo recibes una idea negativa si tu mente es campo fértil para ella. Impecable, tu mente deja de ser fértil para la magia negra y lo es para las palabras del amor.',
        'Puedes medir tu impecabilidad por tu autoestima: el amor que sientes por ti es proporcional a la calidad e integridad de tus palabras. Impecable, te sientes bien, feliz y en paz.',
        'Usa la magia blanca empezando por ti: dite que eres maravilloso, cuánto te amas, y usa las palabras para romper los pequeños acuerdos que te hacen sufrir. "Si yo soy impecable con mis palabras, ¿por qué no tú?". Así puedes vivir en el cielo en medio de miles de personas que viven en el infierno.',
      ]],
    ],
    nota: 'Hablar de otros no siempre es chisme: compartir información útil o pedir consejo está bien. La prueba es la intención y el efecto: ¿lo diría delante de esa persona? ¿Busco resolver algo o sentirme mejor a su costa? Hablarte mal tampoco "motiva": los estudios sobre autocompasión muestran que tratarte como a un amigo te ayuda más a mejorar que castigarte.',
    afirmacion: 'Uso la magia blanca empezando por mí: me hablo con verdad y con amor.',
    practica: [
      'Un día sin chismes: si empiezan, cambia de tema o di algo bueno de esa persona.',
      'Escribe 3 frases con las que te hablas mal y cámbialas por una verdad amable.',
      'Antes de opinar de alguien, pregúntate: ¿es mi punto de vista o es la verdad?',
    ],
    pregunta: '¿Qué chisme he creído sobre alguien sin comprobarlo, y qué me hizo sentir?',
  }),

  d(6, 'No te tomes nada personalmente', ['personal', 'personalmente', 'ofendido', 'critica', 'insulto', 'importancia personal', 'opinion', 'egoismo', 'inmunidad'], {
    idea: 'Nada de lo que los demás hacen es por ti: habla de su sueño, no del tuyo.',
    intro: 'Los tres acuerdos siguientes nacen del primero. Pase lo que pase a tu alrededor, no te lo tomes personalmente: lo que otros dicen y hacen sale de sus propios acuerdos, y lo que tú sientes sale de los tuyos.',
    bloques: [
      ['Por qué te lo tomas personal', [
        'Si te encuentro en la calle y te digo "¡Eh, eres un estúpido!" sin conocerte, no hablo de ti, hablo de mí. Si te lo tomas personal, quizá pienses: "¿Cómo lo sabe? ¿Es clarividente o todos ven lo estúpido que soy?".',
        'Te lo tomas personal porque estás de acuerdo con lo que se dice. Apenas estás de acuerdo, el veneno te recorre y quedas atrapado en el sueño del infierno.',
        'La causa es la "importancia personal": tomarse las cosas personalmente es la expresión máxima del egoísmo, porque creemos que todo gira a nuestro alrededor. Lo aprendimos en la domesticación: "¡Yo, yo, yo y siempre yo!".',
      ]],
      ['Cada uno vive en su propio sueño', [
        'Nada de lo que los demás hacen es por ti: lo hacen por ellos. Cada uno vive en su propio sueño, en un mundo completamente distinto del tuyo.',
        'Incluso cuando alguien te insulta directamente, no tiene que ver contigo: lo que dice y hace responde a sus acuerdos y a la programación de su domesticación.',
        'Si alguien te dice "¡Oye, estás muy gordo!", habla de sus sentimientos, creencias y opiniones. Te intentó enviar su veneno; si te lo tomas personal, lo recoges y se vuelve tuyo.',
        'Tomarte las cosas personalmente te vuelve presa fácil de los "magos negros": te atrapan con una opinión y te comes toda su basura emocional. Si no, eres inmune aun en medio del infierno.',
      ]],
      ['Lo que piensen de mí', [
        'Al tomarlo personal te ofendes, defiendes tus creencias, creas conflictos, haces de un grano de arena una montaña porque necesitas tener razón y que el otro esté equivocado.',
        'Lo mismo al revés: lo que tú sientes y haces es una proyección de tu sueño. Ruiz dice: "Lo que pienses de mí no es importante para mí y no me lo tomo personalmente". "Miguel, eres el mejor" o "eres el peor"; contento me llamarás ángel y enfadado, demonio. Ninguno le afecta porque sabe lo que es y no necesita que lo acepten.',
        '"Miguel, lo que dices me duele". Lo que te duele no es lo que digo, sino las heridas que tienes y que yo rocé. Eres tú quien se hace daño.',
        'Cada uno crea una película en su mente donde es director, productor y protagonista; los demás tenemos papeles secundarios. Tu punto de vista no es la verdad de nadie más.',
      ]],
      ['El enfado nace del miedo', [
        'Si te enfadas conmigo, eso tiene que ver contigo: yo soy la excusa. Te enfadas porque tienes miedo y te enfrentas a tu miedo.',
        'Sin miedo no te enfadarías, no odiarías, no estarías triste ni celoso. Si vives sin miedo, si amas, no hay lugar para esas emociones.',
        'Entonces te sientes bien, todo lo que te rodea está bien y amas lo que te rodea porque te amas a ti mismo: estás satisfecho con la película que produces y vives en un estado de dicha.',
      ]],
      ['Ni siquiera lo que oyes en tu mente', [
        'Si te dicen que eres maravilloso, tampoco lo dicen por ti: tú sabes que lo eres y no necesitas que te lo digan. Ruiz llega al extremo: aunque alguien te disparara, no sería nada personal.',
        'Ni siquiera tus opiniones sobre ti son necesariamente verdad: no te tomes personalmente lo que oigas en tu propia mente.',
        'La mente puede hablarse y escucharse: una parte habla y otra escucha. Ruiz dice que también puede percibir "voces" de otras realidades: los toltecas las llamaban aliados; en Europa, África y la India, dioses. Tienes derecho a creerlas o no.',
        'Cuando muchas partes hablan a la vez aparece el mitote, como un enorme mercado: cada acuerdo es como un ser vivo con su propia voz, y los acuerdos incompatibles hacen la guerra dentro de ti. Por eso apenas sabemos qué queremos, cómo y cuándo. Solo con un inventario de acuerdos se pone orden en el caos.',
      ]],
      ['Lo que ganas', [
        'Los humanos somos adictos al sufrimiento y nos ayudamos a sufrir. Si necesitas que te maltraten, otros lo harán fácil; es como llevar un cartel en la espalda que dice "Patéame, por favor".',
        'Encontrarás gente que te miente, y descubrirás que tú también te mientes. No esperes la verdad de otros: confía en ti y decide si crees lo que te dicen. Te mienten porque tienen miedo de que descubras que no son perfectos. Si dicen una cosa y hacen otra y no miras sus actos, te mientes tú.',
        'Si alguien no te trata con amor ni respeto, que se aleje es un regalo. Duele un tiempo, pero tu corazón sanará y elegirás lo que de verdad quieres. Para elegir bien, confía en ti más que en los demás.',
        'Hecho hábito, este acuerdo hace desaparecer la rabia, los celos, la envidia y hasta la tristeza. El veneno que no recibes se vuelve más nocivo para quien lo envía. Con el segundo acuerdo rompes docenas de pequeños acuerdos que te hacen sufrir; con el primero, el 75%.',
        'Ruiz sugiere escribirlo en un papel y pegarlo en la nevera: "No te tomes nada personalmente". Nunca eres responsable de los actos de los demás, solo de ti mismo. Podrás decir "Te amo" sin miedo, pedir lo que necesitas y decir sí o no sin culparte.',
      ]],
    ],
    nota: 'No tomarlo personal NO es tolerarlo todo: no tomarte un insulto a pecho no significa quedarte donde te maltratan. El mismo libro dice que si alguien no te trata con respeto, que se aleje es un regalo: pon límites y aléjate. Y si oyes voces que no controlas o que te angustian, eso no es espiritual: consulta a un profesional de salud mental.',
    afirmacion: 'No me tomo nada personalmente: lo que otros dicen habla de su sueño.',
    practica: [
      'Escribe "No te tomes nada personalmente" y pégalo en la nevera o en el fondo del celular.',
      'Ante el próximo comentario que te moleste, pregúntate: ¿qué herida mía tocó?',
      'Haz lo mismo con un elogio: recíbelo con gracias, sin necesitarlo.',
    ],
    pregunta: '¿Qué comentario me dolió esta semana, y qué dice de la otra persona (y de mi herida)?',
  }),

  d(7, 'No hagas suposiciones', ['suposiciones', 'suponer', 'preguntar', 'malentendido', 'pareja', 'comunicacion', 'expectativas', 'drama'], {
    idea: 'Ten el valor de preguntar: suponer crea dramas de la nada.',
    intro: 'Suponemos sobre todo y creemos que lo que suponemos es cierto. Luego nos lo tomamos personal, culpamos y lanzamos veneno. El tercer acuerdo corta esa cadena con algo simple y difícil: preguntar y expresar lo que quieres.',
    bloques: [
      ['Cómo nace el drama', [
        'Hacemos suposiciones sobre lo que otros hacen o piensan, nos lo tomamos personalmente y después culpamos y reaccionamos con veneno emocional. Por eso, siempre que suponemos, buscamos problemas: entendemos mal y hacemos un gran drama de nada.',
        'Toda la tristeza y los dramas que has vivido tenían su raíz en suposiciones y en cosas que te tomaste personalmente. El sueño del infierno se basa en eso.',
        'Empezamos a chismorrear a partir de suposiciones. Por miedo a pedir una aclaración, suponemos, creemos que es cierto, lo defendemos e intentamos que el otro no tenga razón. Siempre es mejor preguntar que suponer.',
      ]],
      ['Vemos lo que queremos ver', [
        'El mitote nos lleva a interpretar mal: solo vemos lo que queremos ver y oímos lo que queremos oír. Inventamos las cosas en la imaginación, y cuando aparece la verdad la burbuja estalla.',
        'Ejemplo: alguien que te gusta te sonríe en el paseo y se aleja. Con eso creas una fantasía entera: "Realmente le gusto mucho", empieza una relación en tu mente, quizá hasta te casas. Pero todo está en tu sueño personal.',
      ]],
      ['Suposiciones en la pareja', [
        'Suponemos que la pareja sabe lo que pensamos y que no hace falta decir lo que queremos. Si no lo hace, nos sentimos heridos: "Deberías haberlo sabido".',
        'Te casas suponiendo que tu pareja ve el matrimonio igual que tú; al vivir juntos descubres que no, y en lugar de aclarar tus sentimientos acumulas conflictos.',
        'El marido llega a casa, la mujer está furiosa y él no sabe por qué: ella supuso que él la conoce tan bien que lee su mente, y se disgusta porque no cumple sus expectativas. "¿Cómo ha podido hacer eso? Debería haberlo sabido". Creamos un drama y le sumamos más suposiciones.',
      ]],
      ['Por qué suponemos', [
        'Necesitamos justificarlo, explicarlo y entenderlo todo para sentirnos seguros. Cualquier respuesta, correcta o no, nos da seguridad.',
        'Si nos dicen algo, suponemos; si no, también, para satisfacer la necesidad de saber y reemplazar la de comunicarnos. No tenemos el valor de preguntar.',
        'Lo hacemos rápido e inconscientemente porque acordamos que preguntar es peligroso y que quien nos ama debería saber qué queremos. Llegamos a destruir relaciones para defender nuestra posición.',
        'La mayor suposición: que todos ven la vida como nosotros, que piensan, sienten, juzgan y maltratan como nosotros. Por eso nos da miedo ser nosotros mismos: antes de que nos rechacen, ya nos rechazamos.',
        'También suponemos sobre nosotros: te sobreestimas o te subestimas porque no te tomaste el tiempo de preguntarte y contestarte. Quizá te faltan datos, o quizá te mientes sobre lo que de verdad quieres.',
      ]],
      ['"Mi amor lo cambiará"', [
        'Al empezar una relación justificas por qué te gusta esa persona, ves solo lo que quieres y niegas lo que te disgusta. Y supones: "Mi amor cambiará a esta persona". No es verdad: si alguien cambia es porque quiere.',
        'Cuando pasa algo, ves lo que no quisiste ver, amplificado por tu veneno, y culpas al otro de tus decisiones.',
        'No hace falta justificar el amor: está o no está. El amor verdadero es aceptar a los demás tal como son sin tratar de cambiarlos. Es mucho más fácil encontrar a alguien que ya sea como quieres que intentar cambiar a una persona; y esa persona debe quererte tal como eres.',
        'Sé quien eres, sin falsa imagen: "Si me amas tal como soy, muy bien, tómame. Si no me amas tal como soy, muy bien, adiós". Así los acuerdos con los demás son claros e impecables.',
      ]],
      ['Pregunta y exprésate', [
        'La manera de evitar suposiciones es preguntar. Asegúrate de que las cosas queden claras; ten el valor de preguntar hasta aclararlo todo, y aun así no supongas que lo sabes todo.',
        'Encuentra tu voz para pedir lo que quieres. Todos tienen derecho a contestarte sí o no, y tú siempre tienes derecho a preguntar. Del mismo modo, tú puedes contestar sí o no.',
        'Sin suposiciones te comunicas con claridad y sin veneno, y tus palabras se vuelven impecables: "Esto es lo que yo quiero y esto es lo que tú quieres". Si todos nos comunicáramos así no habría guerras, violencia ni disputas.',
      ]],
      ['La acción hace el cambio', [
        'Decirlo es fácil; hacerlo es difícil porque tenemos hábitos de los que ni somos conscientes. Tomar conciencia es el primer paso, pero no basta: la idea es solo una semilla.',
        'Lo que hace cambiar las cosas es la acción. Actuar una y otra vez fortalece tu voluntad y nutre la semilla; tras muchas repeticiones, los nuevos acuerdos se vuelven parte de ti y pasas de mago negro a mago blanco, que usa las palabras para crear, dar, compartir y amar.',
        'Cuando transformas tu sueño, la magia aparece: lo que necesitas llega con facilidad. Es la maestría del intento, del espíritu, del amor, de la gratitud y de la vida: el camino a la libertad personal.',
      ]],
    ],
    nota: 'Lo que Ruiz llama suposiciones, la terapia cognitiva lo llama "lectura de mente" y "adivinar el futuro": dos de los errores de pensamiento más comunes en la ansiedad y en las peleas de pareja. La herramienta es la misma: separa lo que viste de lo que imaginaste, y comprueba preguntando.',
    afirmacion: 'Tengo el valor de preguntar y de decir lo que quiero.',
    practica: [
      'Hoy, ante una duda sobre lo que alguien piensa, pregúntale en vez de suponer.',
      'Pide algo que quieres sin esperar que lo adivinen: "Me gustaría que…".',
      'Escribe una suposición que te tiene mal y anota qué viste de verdad y qué imaginaste.',
    ],
    pregunta: '¿Qué estoy suponiendo hoy de alguien, y qué pregunta clara podría hacerle?',
  }),

  d(8, 'Haz siempre lo máximo que puedas', ['maximo', 'lo mejor', 'esfuerzo', 'cansancio', 'agotado', 'recompensa', 'trabajo', 'accion', 'meditar', 'presente'], {
    idea: 'Haz lo máximo que puedas, ni más ni menos; y hazlo porque amas hacerlo, no por la recompensa.',
    intro: 'El cuarto acuerdo es el que permite que los otros tres se vuelvan hábitos. Lo máximo que puedes cambia de un momento a otro; si lo haces, el Juez no tiene de qué culparte.',
    bloques: [
      ['Lo máximo cambia', [
        'Bajo cualquier circunstancia, haz siempre lo máximo que puedas, ni más ni menos. Pero lo máximo varía: todo está vivo y cambia.',
        'Por la mañana, descansado, rindes más que por la noche agotado. Lo máximo es distinto sano que enfermo, sobrio que después de beber, feliz que disgustado, enfadado o celoso.',
        'Cambia de hora en hora y de día en día, y con el tiempo mejora: a medida que los cuatro acuerdos se vuelven hábito, tu rendimiento es mejor del que solía ser.',
      ]],
      ['Ni más ni menos', [
        'Si te esfuerzas demasiado para hacer más de lo que puedes, gastas más energía de la necesaria y al final tu rendimiento no alcanza. Te excedes, agotas tu cuerpo, vas contra ti y te cuesta más lograr tus objetivos.',
        'Si haces menos de lo que puedes, te sometes a frustración, juicios, culpa y reproches.',
        'Si siempre haces lo máximo, enfermo o cansado, no te juzgarás: no habrá reproche, culpa ni castigo. Así rompes el hechizo.',
      ]],
      ['El maestro y la meditación', [
        'Un hombre fue a un templo budista: "Maestro, si medito cuatro horas al día, ¿cuánto tardaré en alcanzar la iluminación?". "Tal vez diez años". "¿Y si medito ocho?". "Tal vez veinte".',
        '"¿Por qué tardaré más si medito más?". "No estás aquí para sacrificar tu alegría ni tu vida. Estás aquí para vivir, para ser feliz y para amar. Si puedes alcanzar tu máximo nivel en dos horas de meditación, pero utilizas ocho, solo conseguirás agotarte, apartarte del verdadero sentido de la meditación y no disfrutar de tu vida".',
        '"Haz lo máximo que puedas, y tal vez aprenderás que, independientemente del tiempo que medites, puedes vivir, amar y ser feliz".',
      ]],
      ['Actuar por amor, no por recompensa', [
        'Haciendo lo máximo vives con intensidad, eres productivo y bueno contigo, y te entregas a tu familia y tu comunidad. La acción es lo que te hace inmensamente feliz.',
        'Hacer lo máximo es actuar porque amas hacerlo, no porque esperas una recompensa. La mayoría hace lo contrario y no disfruta: por eso no hace lo máximo.',
        'Mucha gente trabaja pensando solo en el día de pago: espera el viernes o el sábado, se resiste al trabajo y la acción se vuelve cada vez más difícil. Trabaja porque debe pagar el alquiler y mantener a la familia; recibe la paga y no es feliz. En sus días libres intenta escaparse y se emborracha porque no se gusta. Cuando no nos gusta cómo somos, nos herimos de muchas maneras.',
        'Si actúas por el placer de hacerlo, disfrutas cada cosa. Las recompensas llegan, pero no estás apegado a ellas; quizá consigas más de lo que imaginabas. Te diviertes, no te aburres ni te frustras.',
      ]],
      ['El Juez no tiene sentencia', [
        'Cuando haces lo máximo, el Juez no puede declararte culpable. Si intenta juzgarte con tu Libro de la Ley, tienes la respuesta: "Hice lo máximo que podía". No hay reproches.',
        'Así aprendes a aceptarte, pero siendo consciente y aprendiendo de tus errores: practicar, comprobar los resultados con honestidad y seguir practicando. Así se expande la conciencia.',
        'Haciendo lo máximo no parece que trabajes, porque disfrutas. Lo haces porque quieres, no porque tengas que hacerlo ni para complacer al Juez o a los demás. Si actúas solo por obligación, es mejor no hacerlo.',
      ]],
      ['La acción es estar vivo', [
        'La acción es vivir con plenitud. La inacción es nuestra forma de negar la vida: sentarse frente al televisor cada día durante años por miedo a estar vivo y arriesgarse a expresar lo que somos.',
        'Puedes tener grandes ideas, pero lo que importa es la acción: una idea que no se hace no produce resultados ni recompensas.',
        'Forrest Gump no tenía grandes ideas, pero actuaba: era feliz porque hacía lo máximo en todo, y recibió recompensas que no esperaba. Actuar es arriesgarte a expresar tu sueño, sin imponérselo a nadie: todos tienen derecho a expresar el suyo.',
      ]],
    ],
    nota: 'Para ti, que entrenas pierna y juegas fútbol miércoles y viernes, este acuerdo es lo que en el deporte se llama "autorregulación": el 100% de un día cansado no es el de un día descansado. Bajar el peso o el volumen cuando estás agotado no es flojera, es hacer lo máximo de ese día; excederte es lo que trae lesiones y estancamiento. En Gym anota cómo te sentiste y ajusta sin culpa.',
    afirmacion: 'Hago lo máximo que puedo hoy, y eso es suficiente.',
    practica: [
      'Antes de cada tarea, pregúntate: ¿cuál es mi máximo hoy, con la energía que tengo?',
      'Haz una cosa del día por el puro placer de hacerla bien, sin esperar nada.',
      'Esta noche, si el Juez te reprocha algo, responde: "Hice lo máximo que podía".',
    ],
    pregunta: '¿Dónde me estoy exigiendo más de lo que puedo, y dónde estoy haciendo menos?',
  }),

  d(9, 'La práctica hace al maestro', ['practica', 'ritual', 'cuerpo', 'pasado', 'presente', 'recaida', 'volver a empezar', 'solo por hoy', 'voluntad', 'guerrero'], {
    idea: 'No esperes ser perfecto con los acuerdos: haz lo máximo, y si te caes, empieza de nuevo solo por hoy.',
    intro: 'Segunda parte del cuarto acuerdo: cómo convertir los cuatro en tu manera de vivir. Rituales, dejar ir el pasado, honrar el cuerpo, y sobre todo levantarte cada vez que rompas un acuerdo.',
    bloques: [
      ['Todo puede ser un ritual', [
        'Ruiz: "Yo hago lo máximo que puedo en todo lo que emprendo y siento". Lo eligió como un ritual, una creencia más de las que decidió tener.',
        'Ducharse es un ritual: con esa acción le dice a su cuerpo cuánto lo ama, disfruta el agua y cuida lo que el cuerpo necesita.',
        'En la India celebran la puja: bañan, alimentan y cantan a imágenes de Dios. Lo que importa no son las imágenes sino la forma de decir "Te amo, Dios".',
        'Dios es vida en acción. La mejor manera de decir "Te amo, Dios" es vivir haciendo lo máximo; la mejor manera de decir "Gracias, Dios" es dejar ir el pasado y vivir aquí y ahora.',
      ]],
      ['Deja ir el pasado', [
        'Sea lo que sea que la vida te arrebate, permite que se vaya. Dejar ir el pasado es disfrutar del sueño que pasa ahora mismo.',
        'Si vives en un sueño del pasado, no disfrutas el presente porque siempre deseas que sea distinto. No disfrutar de lo que sucede ahora es vivir a medias, y lleva a la autocompasión, el sufrimiento y las lágrimas.',
        'Naciste con derecho a ser feliz, a amar, a disfrutar y a compartir tu amor. No te resistas a que la vida pase por ti.',
      ]],
      ['Di sí cuando es sí', [
        'No necesitamos saber ni probar nada: ser, arriesgarnos a vivir y disfrutar es lo único que importa.',
        'Di que no cuando quieras decir que no, y di que sí cuando quieras decir que sí. Tienes derecho a ser tú mismo, y solo lo eres cuando haces lo máximo.',
        'No necesitas grandes conocimientos ni conceptos filosóficos, ni que los demás te acepten. Decir "Eh, te amo" ya es una expresión de lo divino.',
      ]],
      ['No esperes ser perfecto', [
        'Los tres primeros acuerdos solo funcionan si haces lo máximo. No esperes ser siempre impecable con tus palabras, ni no volver a tomarte nada personal, ni no suponer nunca: tus hábitos son fuertes. Haz lo máximo posible.',
        'Así, emplear mal las palabras, tomarte las cosas personal y suponer se debilitarán y serán menos frecuentes. No te juzgues, culpes ni castigues por no lograrlo todavía: haciendo lo máximo te sientes bien aunque aún falles.',
        'Haciéndolo una y otra vez te conviertes en maestro de la transformación. La práctica forma al maestro: así aprendiste a escribir, a conducir y a andar, y hablas tu lengua porque la practicaste.',
      ]],
      ['Honra tu cuerpo', [
        'No se trata de soñar despierto ni de meditar horas: ponte en pie y actúa. Honra al hombre o la mujer que eres.',
        'Respeta tu cuerpo, disfrútalo, ámalo, aliméntalo, límpialo y sánalo. Ejercítalo y haz lo que le haga sentirse bien: es una puja para tu cuerpo, una comunión entre Dios y tú.',
        'No necesitas adorar ninguna imagen (puedes, si te hace bien): tu cuerpo es una manifestación de Dios. Dando amor a cada parte, plantas semillas de amor y llegarás a honrarlo inmensamente.',
        'Después, honra cada pensamiento, emoción y creencia, "correcta" o "incorrecta": vivirás sin juicios, sin ser víctima y sin necesidad de chismorrear ni maltratarte.',
      ]],
      ['Elijo respetar los Cuatro Acuerdos', [
        'Con los cuatro juntos ya no vives en el infierno. Son un resumen de la maestría de la transformación, una de las maestrías toltecas. El conocimiento está ahí: solo tienes que usarlo.',
        'Establece hoy este acuerdo: "Elijo respetar los Cuatro Acuerdos". Son tan sencillos que un niño los entiende, pero mantenerlos exige una voluntad muy fuerte: todo lo que te rodea, los acuerdos del sueño del planeta, intentará que los rompas.',
        'Por eso necesitas ser un gran cazador, un gran guerrero que los defienda con su vida. La recompensa tolteca es trascender la experiencia humana del sufrimiento.',
        'Ruiz: al principio no creía poder. "He fracasado muchas veces, pero me levanté y seguí adelante. No me compadecí de mí mismo". "Si me caigo, soy lo bastante fuerte, lo bastante inteligente, ¡puedo hacerlo!". Cada vez fue más fácil.',
      ]],
      ['Si te caes, empieza otra vez', [
        'Si te caes, no te juzgues ni le des al Juez la satisfacción de convertirte en víctima. Sé firme contigo, levántate y vuelve a hacer el acuerdo.',
        '"Está bien, rompí el acuerdo de ser impecable con mis palabras. Empezaré otra vez desde el principio. Voy a mantener los Cuatro Acuerdos solo por hoy. Hoy seré impecable con mis palabras, no me tomaré nada personalmente, no haré suposiciones y haré lo máximo que pueda".',
        'Si rompes un acuerdo, empieza de nuevo mañana y al día siguiente. Al principio será difícil, pero cada día será más fácil, hasta que un día los Cuatro Acuerdos dirijan tu vida.',
        'No necesitas ser religioso ni ir a la iglesia. No te inquietes por el futuro: atención en el día de hoy. Vive el día a día. Hoy es el principio de un nuevo sueño.',
      ]],
    ],
    nota: 'El "solo por hoy" es la misma herramienta que usan los programas de recuperación de adicciones, y funciona por lo mismo: un día es manejable y una recaída no borra el camino. La revisión de la noche (🌙 en Herramientas) está hecha para esto: ver sin juicio qué acuerdo se rompió y empezar de nuevo mañana.',
    afirmacion: 'Hoy mantengo los Cuatro Acuerdos; si me caigo, empiezo otra vez.',
    practica: [
      'Di en voz alta al despertar: "Solo por hoy: impecable, nada personal, sin suposiciones y lo máximo".',
      'Convierte una acción diaria (ducha, comida, entreno) en un ritual de amor a tu cuerpo.',
      'Esta noche escribe qué acuerdo rompiste hoy, sin juzgarte, y empieza de nuevo mañana.',
    ],
    pregunta: '¿Qué hago cuando rompo un acuerdo: me castigo o empiezo otra vez?',
  }),

  d(10, 'Romper viejos acuerdos: el camino a la libertad', ['libertad', 'ser yo mismo', 'complacer', 'padres', 'nino interior', 'parasito', 'guerrero', 'maestrias', 'miedos', 'conciencia'], {
    idea: 'La verdadera libertad es ser quien realmente eres; el primer paso es darte cuenta de que no lo eres.',
    intro: 'Ruiz explica el plan tolteca para liberarse de la domesticación: entender quién nos quita la libertad, las tres maestrías, el "parásito" (Juez, Víctima y creencias) y las tres maneras de vencerlo.',
    bloques: [
      ['¿Qué es la libertad?', [
        'Todos hablan de libertad, pero ¿somos libres para ser quienes realmente somos? No. La verdadera libertad es la del espíritu humano: ser quienes somos.',
        'Culpamos al gobierno, al clima, a nuestros padres, a la religión, a Dios… pero nos lo impedimos nosotros. Nos casamos y decimos que perdimos la libertad; nos divorciamos y seguimos sin ser libres.',
        'Un niño de dos, tres o cuatro años es libre: hace lo que quiere, es salvaje como una flor o un animal no domesticado. Sonríe, se divierte, explora, no le da miedo jugar. Solo teme cuando se hace daño o tiene hambre; no le importa el pasado ni el futuro y vive en el presente.',
        'Los niños pequeños no temen expresar lo que sienten y, si perciben amor, se funden en él. Eso es un ser humano normal: no teme al futuro ni se avergüenza del pasado; su tendencia natural es disfrutar, jugar, explorar, ser feliz y amar.',
      ]],
      ['No culpes a tus padres', [
        'Desde el punto de vista de la Víctima, "nos ocurrió algo triste"; desde el del guerrero, "fue normal". El Libro de la Ley, el Juez, la Víctima y las creencias dirigen nuestra vida y no nos dejan ser quienes somos.',
        'Esta cadena pasa de generación en generación. No culpes a tus padres por enseñarte a ser como ellos: hicieron lo mejor que supieron, y si te maltrataron fue por su propia domesticación, sus miedos y creencias.',
        'No culpes a nadie que te haya maltratado, incluyéndote a ti. Pero ya es hora de poner fin a ese maltrato, de liberarte de la tiranía del Juez, cambiar tus acuerdos y dejar el papel de Víctima.',
      ]],
      ['Tu verdadero yo es un niño', [
        'Tu verdadero yo es todavía un niño que nunca creció. Reaparece cuando te diviertes, juegas, pintas, escribes poesía, tocas el piano o te expresas: esos son los momentos más felices de tu vida.',
        'Entonces llegan las "responsabilidades": el Juez dice "Espera, eres responsable, tienes que trabajar, ir a la universidad, ganarte la vida", y la cara se ensombrece. Mira a un niño que juega a ser abogado: cambia la expresión al instante.',
        'En lugar de vivir para complacernos, la mayor parte del tiempo hacemos cosas para complacer a los demás y que nos acepten. Ruiz dice que de cada mil personas, 999 están totalmente domesticadas, y lo peor es que la mayoría ni se da cuenta.',
      ]],
      ['Primero, la conciencia', [
        'El primer paso hacia la libertad personal es ser conscientes de que no somos libres: hay que ver el problema para resolverlo.',
        'Hasta que no seas consciente de que tu mente está llena de heridas y veneno, no los limpiarás y seguirás sufriendo. No hay razón para sufrir: consciente, puedes rebelarte y decir "¡Ya basta!".',
        'Si pones en duda tu sistema de creencias, verás que la mayoría de las creencias que abrieron heridas ni siquiera son verdad: viviste un drama por nada.',
        'Tu vida es la manifestación de tu sueño, es un arte, y puedes cambiarla en cualquier momento. Los maestros del sueño hacen de su vida una obra maestra, controlan el sueño con sus elecciones y son conscientes de sus consecuencias. Ser tolteca es vivir sin líderes ni seguidores, con tu propia verdad: volverte sabio, salvaje y libre de nuevo.',
      ]],
      ['Las tres maestrías', [
        'Maestría de la Conciencia: ser conscientes de quiénes somos realmente, con todas nuestras posibilidades.',
        'Maestría de la Transformación: cómo cambiar y liberarnos de la domesticación.',
        'Maestría del Intento: el Intento es la parte de la vida que hace posible la transformación de la energía, el ser vivo que envuelve toda energía, lo que llamamos Dios. Es la vida misma, el amor incondicional: la Maestría del Intento es la Maestría del Amor.',
      ]],
      ['El parásito', [
        'Los toltecas comparan al Juez, la Víctima y el sistema de creencias con un parásito que invade la mente: un ser vivo que se alimenta de otro, le chupa la energía sin dar nada y lo daña poco a poco.',
        'No es energía material, como no lo son las emociones ni los sueños, pero existe. El cerebro es una fábrica de emociones; el parásito sueña en tu mente, vive en tu cuerpo y se alimenta de las emociones del miedo: le encantan el drama y el sufrimiento.',
        'Cuando descubres que el Juez y la Víctima controlan tu mente, tienes dos opciones: seguir rindiéndote, o rebelarte como cuando eras niño y decir "¡No!": declarar la guerra por tu derecho a usar tu propia mente.',
        'Por eso quienes siguen las tradiciones chamánicas de América, de Canadá a Argentina, se llaman guerreros: se rebelan contra el parásito. No siempre se gana, pero siempre se hace lo máximo, y elegir este camino da al menos la dignidad de la rebelión: no ser la víctima desvalida de tus emociones ni de las de otros.',
        'En el mejor de los casos, trasciendes el sueño del planeta y cambias tu sueño por el cielo: un lugar en la mente lleno de júbilo, donde eres libre para amar y ser tú mismo. No hay que esperar a morir.',
      ]],
      ['Tres maneras de vencerlo', [
        'El parásito es un monstruo de cien cabezas, y cada cabeza es uno de tus miedos.',
        '1. Atacar las cabezas una a una: enfrentar tus miedos uno por uno. Es lento, pero funciona: cada miedo que enfrentas te hace un poco más libre.',
        '2. Dejar de alimentarlo: controlar tus emociones y no alimentar las que nacen del miedo. Fácil de decir, difícil de hacer, porque el Juez y la Víctima controlan la mente.',
        '3. La iniciación a la muerte: una muerte simbólica (presente en Egipto, la India, Grecia y América) que mata al parásito sin dañar el cuerpo. Es la más rápida y la más difícil: hace falta mucho valor para enfrentarse al ángel de la muerte (lectura 12).',
      ]],
    ],
    nota: 'El "parásito" es una imagen, no algo literal: describe la voz crítica interna y los patrones de miedo, lo que en psicología se llama crítico interior. La primera solución (un miedo a la vez) es la base de la terapia de exposición, uno de los tratamientos con más evidencia para la ansiedad y las fobias: pequeños pasos repetidos hacia lo que temes.',
    afirmacion: 'Recupero mi libertad de ser quien realmente soy.',
    practica: [
      'Haz hoy algo que te haga sentir como un niño: jugar, dibujar, cantar, bailar.',
      'Escribe tus 5 miedos principales (las cabezas del monstruo) y elige el más pequeño.',
      'Da hoy un paso concreto hacia ese miedo pequeño.',
    ],
    pregunta: '¿Qué hago solo para complacer a otros, y qué haría si fuera libre de ser yo?',
  }),

  d(11, 'El arte de la transformación y la disciplina del guerrero', ['transformacion', 'segunda atencion', 'inventario', 'creencias', 'repeticion', 'emociones', 'energia', 'heridas', 'perdon', 'perdonar'], {
    idea: 'Haz inventario de tus acuerdos, reemplaza cada uno que te hace sufrir y perdona: el perdón es la clave.',
    intro: 'Cómo se cambia el sueño en la práctica: con conciencia, un inventario de creencias, acuerdos nuevos repetidos muchas veces, el control de las emociones y el perdón para sanar las heridas.',
    bloques: [
      ['El sueño de la segunda atención', [
        'El sueño que vives es el resultado del sueño externo que captó tu atención y te alimentó con creencias. La domesticación es "el sueño de la primera atención": así usaron por primera vez tu atención para crear tu primer sueño.',
        'Si concentras tu atención en esos acuerdos y los cambias tú, usas la atención por segunda vez y creas "el sueño de la segunda atención": el nuevo sueño.',
        'La diferencia es que ya no eres inocente. De niño no tenías elección; ahora puedes escoger qué creer, incluso creer en ti.',
      ]],
      ['Inventario de acuerdos', [
        'El primer paso es darte cuenta de la bruma: soñamos continuamente. Cuando seas consciente de que tu sueño es el resultado de tus creencias y de que lo que crees no es real, empezarás a cambiarlo.',
        'Para cambiar tus creencias debes centrar tu atención en lo que quieres cambiar: conocer los acuerdos antes de cambiarlos.',
        'El siguiente paso es ser consciente de las creencias que te limitan, se basan en el miedo y te hacen infeliz. Haz un inventario de todo lo que crees, de todos tus acuerdos: así empiezas a transformarte.',
        'Los toltecas lo llaman el Arte de la Transformación: cambiar los acuerdos basados en el miedo que te hacen sufrir y reprogramar tu mente a tu manera. Una forma es estudiar y adoptar creencias alternativas, como los Cuatro Acuerdos.',
        'Adoptarlos es declarar la guerra para recuperar la libertad que te quitó el parásito, acabar con el dolor emocional y empezar un nuevo sueño. Cuanto más fuerte seas, más acuerdos romperás, hasta llegar a la esencia de todos: "ir al desierto", donde te encuentras cara a cara con tus demonios; al salir, se convierten en ángeles.',
      ]],
      ['Romper un acuerdo paso a paso', [
        'Practicar los Cuatro Acuerdos es un gran acto de poder. Cada acuerdo que rompes aumenta tu poder. Empieza por acuerdos pequeños que pidan poco, y tu poder crecerá hasta poder enfrentar los grandes demonios de tu mente.',
        'La niña a la que le dijeron que no cantara tiene ahora veinte años y sigue sin cantar. Puede decirse: "De acuerdo, intentaré cantar aunque sea verdad que canto mal". Puede imaginar que alguien aplaude: "¡Oh! ¡Lo has hecho de maravilla!". El acuerdo se agrieta un poco; con más poder y coraje lo intenta otra vez, y otra, hasta romperlo.',
        'Reemplaza cada acuerdo que te hace sufrir por uno nuevo que te haga feliz: si ocupas el mismo espacio con un acuerdo nuevo, el viejo desaparece para siempre.',
        'Hay creencias tan resistentes que parece imposible. Avanza paso a paso y sé paciente: vives así por muchos años de domesticación y no desaparece en un día.',
      ]],
      ['Por qué cuesta tanto', [
        'En cada acuerdo pusimos el poder de la palabra, que es el poder de la voluntad. Para cambiarlo hace falta la misma cantidad de poder; con menos es imposible.',
        'Invertimos casi todo nuestro poder en mantener los acuerdos con nosotros mismos, porque son como una fuerte adicción: somos adictos a nuestra forma de ser, a la rabia, los celos, la autocompasión y a creencias como "No soy lo bastante bueno… ¿Por qué voy a intentarlo? Si otros lo hacen es porque son mejores que yo".',
        'Los viejos acuerdos dirigen el sueño porque los repetimos una y otra vez. Para adoptar los nuevos hace falta lo mismo: repetición. Cada vez lo harás más y mejor. La repetición hace al maestro.',
      ]],
      ['La disciplina del guerrero', [
        'Te despiertas temprano lleno de entusiasmo y energía. En el desayuno discutes fuerte con tu pareja; te enfureces y gastas gran parte de tu poder en la rabia. Quedas agotado, te derrumbas en la cama y pasas el día envuelto en tus emociones, sin energía para nada.',
        'Cada día despertamos con una cantidad de energía mental, emocional y física. Si dejamos que las emociones la consuman, no queda nada para cambiar nuestra vida ni para dársela a los demás.',
        'Ves el mundo según tus emociones: enfadado, todo está mal y culpas hasta al clima; triste, los árboles y la lluvia te parecen tristes; vulnerable, crees que alguien te atacará y no confías en nada ni en nadie. Es ver el mundo con los ojos del miedo.',
        'El ser humano debe controlar sus emociones y no al revés. Sin control decimos cosas que no queremos decir y hacemos cosas que no queremos hacer. Por eso importa tanto ser impecable con las palabras y volverse un guerrero espiritual.',
      ]],
      ['El guerrero se contiene; la víctima reprime', [
        'Hay que aprender a controlar las emociones para tener suficiente poder personal y cambiar los acuerdos basados en el miedo, salir del infierno y crear tu propio cielo.',
        'El guerrero tiene conciencia y tiene control: no control sobre otras personas, sino sobre sus propias emociones, sobre sí mismo.',
        'Reprimimos las emociones cuando perdemos el control, no cuando lo tenemos. La gran diferencia: la víctima reprime y el guerrero se contiene.',
        'La víctima reprime porque le da miedo mostrar lo que siente y decir lo que quiere decir. Contenerse no es reprimir: es sostener la emoción y expresarla en el momento adecuado, ni antes ni después.',
        'Por eso el guerrero es impecable: controla sus emociones y, con ellas, su comportamiento.',
      ]],
      ['La mente es como la piel', [
        'Si tocas una piel sana, la sensación es maravillosa. Si tienes una herida infectada, duele y la cubres; no disfrutas que te toquen.',
        'Imagina que todos tuviéramos una enfermedad de la piel: nadie podría tocar a nadie, casi no nos abrazaríamos, y el dolor y la infección se considerarían normales.',
        'Así es la mente: cada uno tiene un cuerpo emocional cubierto de heridas infectadas por el veneno del odio, la rabia, la envidia y la tristeza. Una injusticia abre una herida, y reaccionamos con veneno por nuestras ideas de lo que es justo. Estamos tan heridos que creemos que es lo normal; no lo es.',
        'Ruiz llama al miedo la "enfermedad mental" del sueño del planeta: sus síntomas son la rabia, el odio, la tristeza, la envidia y el desengaño. Si vemos nuestro estado como una enfermedad, descubrimos que tiene cura.',
      ]],
      ['El perdón es la clave', [
        'Para curar las heridas hay que saber la verdad, abrirlas y sacar el veneno. ¿Cómo? Perdonando a quienes creemos que nos hicieron mal, no porque lo merezcan, sino porque nos amamos tanto que no queremos seguir pagando por esas injusticias.',
        'El perdón es la única manera de sanarnos. Elegimos perdonar por compasión hacia nosotros: "¡Ya basta! No volveré a ser el gran Juez que actúa contra mí mismo. No volveré a maltratarme ni a agredirme. No volveré a ser la Víctima".',
        'Empieza por perdonar a tus padres, hermanos, amigos y a Dios. Al perdonar a Dios te perdonas a ti; el autorrechazo desaparece y empiezas a aceptarte por completo. Así empezamos a ser libres.',
        'Sabrás que perdonaste cuando veas a esa persona u oigas su nombre y no sientas ninguna reacción emocional: te tocan donde antes había una herida y ya no duele.',
        'La verdad es como un escalpelo: duele porque abre las heridas tapadas por mentiras (el "sistema de negación", que nos deja seguir funcionando). Sin heridas ni veneno ya no necesitamos mentir: el contacto con una mente sana es placentero.',
      ]],
    ],
    nota: 'Matices de experto: (1) Perdonar no es reconciliarte ni justificar lo que pasó; es soltar el resentimiento por tu bien, y puedes perdonar y mantener distancia. (2) Que Ruiz hable del miedo como "enfermedad mental" es una metáfora: la ansiedad, la depresión o la psicosis tienen causas biológicas, psicológicas y sociales, no son culpa de nadie y tienen tratamiento. Si una herida es muy profunda (abuso, trauma), hazlo con un terapeuta. (3) El escaneo no trae las páginas 134-135. El bloque "El guerrero se contiene; la víctima reprime" se reconstruyó con resúmenes y citas de lectores de la edición original en inglés (Goodreads), contado con otras palabras: compáralo con tu libro si puedes.',
    afirmacion: 'Perdono porque me amo; ya no pago por las mismas heridas.',
    practica: [
      'Empieza tu inventario: escribe un acuerdo que te hace sufrir y el acuerdo nuevo que lo reemplaza (ficha 📋).',
      'Hoy, cuando una emoción te arrastre, para y respira antes de hablar: cuida tu energía.',
      'Elige a alguien a quien perdonar y escribe por qué lo haces por ti (ficha 🕊️).',
    ],
    pregunta: '¿Por qué injusticia sigo pagando, y qué cambiaría si la perdonara?',
  }),

  d(12, 'La iniciación a la muerte', ['muerte', 'angel de la muerte', 'ultimo dia', 'gratitud', 'decir te amo', 'pasado', 'resurreccion', 'duelo', 'perdida'], {
    idea: 'Vive cada día como si fuera el último: deja morir el pasado y di hoy "te quiero".',
    intro: 'La tercera manera de vencer al parásito: la iniciación a la muerte. No es morir: es dejar que muera el viejo sueño. El ángel de la muerte enseña a vivir en el presente, sin miedo, agradecido y diciendo lo que sientes.',
    bloques: [
      ['La muerte como maestra', [
        'El último paso hacia la libertad personal es prepararse para la iniciación a la muerte: tomar a la muerte como maestra.',
        'El ángel de la muerte nos enseña a estar realmente vivos: podemos morir en cualquier momento y solo tenemos el presente para vivir.',
        'Nadie sabe si va a morir mañana. Creemos que nos quedan muchos años por delante, pero ¿es así?',
      ]],
      ['Si te quedara una semana', [
        'Imagina que vas al hospital y el médico te dice que te queda una semana de vida. ¿Qué harías? Ante la muerte hay dos actitudes: lamentarse ("me voy a morir") y hacer un gran drama, o aprovechar cada momento para ser feliz y hacer lo que realmente te gusta.',
        'Si solo nos queda una semana de vida, disfrutémosla: "Voy a ser yo mismo. No puedo pasarme la vida intentando complacer a los demás. Ya no tendré miedo de lo que piensen de mí. ¿Qué me importa si me voy a morir dentro de una semana? Seré yo mismo".',
      ]],
      ['Lo que enseña el ángel de la muerte', [
        'El ángel de la muerte nos enseña a vivir cada día como si fuera el último, como si no hubiera mañana.',
        'Empieza el día diciendo: "Estoy despierto, veo el sol. Voy a entregarle mi gratitud, y también a todas las cosas y a todas las personas, porque todavía estoy vivo. Un día más para ser yo mismo".',
        'Así Ruiz aprendió a estar completamente abierto y a saber que no hay nada que temer. Trata con amor a quienes quiere porque puede ser el último día para decirles cuánto los ama, y no quiere pelear con ellos.',
        'Si tuviera una gran pelea con alguien que quiere, le lanzara todo su veneno y esa persona muriera al día siguiente, el Juez lo atacaría y se sentiría culpable incluso por no haberle dicho cuánto la quería.',
        'El amor que te hace feliz es el que compartes con quienes amas. ¿Por qué negar que los quieres? No importa que te lo devuelvan: lo que te hace feliz es hacerles saber hoy cuánto los quieres.',
      ]],
      ['Muere el parásito, no tú', [
        'Viviendo así te preparas para la iniciación: el viejo sueño de tu mente muere para siempre. Tendrás recuerdos del parásito (del Juez, la Víctima y lo que creías), pero estará muerto.',
        'No es fácil: el Juez y la Víctima luchan con todas sus armas porque no quieren morir, y sentimos que somos nosotros los que vamos a morir, y tenemos miedo.',
        'Viviendo en el sueño del planeta es como si estuviéramos muertos. Si sobrevivimos a la iniciación recibimos el regalo más maravilloso: la resurrección. Renacemos, estamos vivos, somos nosotros mismos otra vez.',
        'Resucitar es volver a ser un niño, salvaje y libre, pero con una diferencia: en lugar de inocencia, tenemos libertad con sabiduría. Rompemos la domesticación, recuperamos la libertad y sanamos la mente, con un juicio sano para dirigir nuestra vida.',
      ]],
      ['Todo me pertenece', [
        'El ángel de la muerte nos dice: "Todo lo que hay aquí me pertenece; no es tuyo. Tu casa, tu pareja, tus hijos, tu coche, tu trabajo, tu dinero: todo me pertenece y me lo puedo llevar cuando quiera, pero por ahora, puedes utilizarlo".',
        'Si nos rendimos a él, somos felices para siempre, porque se lleva el pasado para que la vida pueda continuar: de cada momento se lleva la parte que está muerta, y nosotros seguimos viviendo en el presente.',
        'El parásito quiere que carguemos con el pasado, y así estar vivo pesa mucho. Si vivimos en el pasado, ¿cómo disfrutamos el presente? Si soñamos con el futuro, ¿para qué cargar el pasado? ¿Cuándo viviremos en el presente? Eso nos enseña el ángel de la muerte.',
      ]],
    ],
    nota: 'Las páginas 134-135 no están en el escaneo. El bloque "La muerte como maestra" y el comienzo de "Si te quedara una semana" se reconstruyeron con un extracto del libro publicado en un blog (iscleo.blogspot.com, 2009), contado con otras palabras. La idea coincide con el "memento mori" de los estoicos (Séneca, Marco Aurelio): recordar que la vida es corta para vivir mejor hoy. Si estás pasando un duelo, permítete sentirlo: "dejar ir" no es dejar de extrañar, y pedir ayuda está bien.',
    afirmacion: 'Estoy vivo: un día más para ser yo mismo.',
    practica: [
      'Al despertar di: "Estoy despierto, veo el sol… Un día más para ser yo mismo".',
      'Dile hoy a una persona que quieres cuánto la quieres, sin esperar nada.',
      'Escribe qué harías distinto si te quedara una semana, y haz una de esas cosas hoy.',
    ],
    pregunta: 'Si hoy fuera mi último día, ¿qué diría, a quién, y qué dejaría de cargar?',
  }),

  d(13, 'El nuevo sueño: el cielo en la tierra', ['nuevo sueno', 'cielo', 'imaginacion', 'amor', 'felicidad', 'eleccion', 'sin miedo', 'dicha'], {
    idea: 'El sueño que vives lo creaste tú: la felicidad, igual que el sufrimiento, es una elección.',
    intro: 'El capítulo final invita a olvidar lo aprendido y usar la imaginación para ver tu vida con ojos nuevos: un sueño sin miedo, sin juicios y con amor, que según Ruiz es completamente posible.',
    bloques: [
      ['Puedes soñar otro sueño', [
        '"Quiero que olvides todo lo que has aprendido en tu vida". Este es el principio de un nuevo entendimiento, de un nuevo sueño.',
        'El sueño que vives lo has creado tú: es tu percepción de la realidad y puedes cambiarla en cualquier momento. Tienes el poder de crear el infierno y de crear el cielo. ¿Por qué no usar tu mente, tu imaginación y tus emociones para soñar el cielo?',
        'Imagina que puedes ver el mundo con otros ojos. Cierra los ojos, ábrelos y mira: verás amor que emana de los árboles, del cielo, de la luz, de ti y de los demás. Aun tristes o enfadados, detrás de sus sentimientos también envían amor.',
      ]],
      ['Imagínate que…', [
        'Vives sin tener que justificar tu existencia, libre para ser quien realmente eres; tienes permiso para ser feliz y disfrutar de verdad tu vida, libre de conflictos contigo y con los demás.',
        'No tienes miedo de expresar tus sueños: sabes qué quieres, cuándo y qué no. Tienes libertad para cambiar tu vida, pedir lo que necesitas y decir sí o no a lo que sea y a quien sea.',
        'Vives sin miedo a ser juzgado: ya no te dejas llevar por lo que otros piensen, no eres responsable de la opinión de nadie, no necesitas controlar a nadie y nadie te controla.',
        'Vives sin juzgar: perdonas con facilidad, no necesitas tener razón ni decirle a nadie que está equivocado. Te respetas y te respetan.',
        'Vives sin miedo de amar y no ser correspondido: dices "Te quiero" sin vergüenza ni justificarte, y andas por el mundo con el corazón abierto, sin miedo a que te hieran.',
        'Vives sin miedo a arriesgarte y explorar; no temes perder nada, ni estar vivo, ni morir. Te amas tal como eres: amas tu cuerpo y tus emociones, y sabes que eres perfecto tal como eres.',
      ]],
      ['Es posible', [
        'Te pide imaginarlo porque es totalmente posible: vivir en estado de gracia, de dicha, en el sueño del cielo. Pero primero hay que entender en qué consiste.',
        'Solo el amor da ese estado. Es como estar enamorado: flotas y percibes amor donde vayas. Se puede vivir así siempre, porque otros lo han logrado y no son distintos de ti: cambiaron sus acuerdos y sueñan un sueño diferente.',
        'Hace dos mil años Jesús habló del reino de los cielos, y casi nadie estaba preparado: "¿A qué te refieres? Mi corazón está vacío". No hace falta sentirlo ya: imagina que su mensaje de amor es posible y descubrirás que es tuyo.',
        'La vida es muy fácil cuando el amor es tu forma de vida. Puedes amar todo el tiempo si lo eliges; quizá no tengas una razón, pero amar te da gran felicidad y paz interior y cambia tu percepción. La bruma se disipa y el mitote desaparece.',
        'Es lo que la humanidad buscó por siglos: la felicidad, el paraíso perdido. Moisés la llamó la Tierra Prometida, Buda el Nirvana, Jesús el Cielo y los toltecas el Nuevo Sueño.',
      ]],
      ['Elegir el cielo', [
        'Tu identidad está mezclada con el sueño del planeta: sientes al parásito y crees que eres tú. Eso dificulta dejarlo ir y abrir espacio para el amor. Sufrir te hace sentir seguro porque lo conoces a la perfección.',
        'Pero no hay razón para sufrir. La única razón por la que sufres es que eliges hacerlo. Encontrarás muchas excusas, pero ninguna buena razón. La única razón por la que eres feliz es que eliges serlo.',
        'Quizá no podamos escapar del destino humano, pero podemos elegir entre sufrirlo o disfrutarlo, entre sufrir o amar y ser feliz, entre vivir en el infierno o en el cielo. "Mi elección personal es vivir en el cielo. ¿Y la tuya?".',
      ]],
    ],
    nota: 'Matiz: la actitud ante lo que pasa sí se elige y se entrena, pero la depresión o la ansiedad clínica no se resuelven "eligiendo" ser feliz, y nadie sufre por no querer lo suficiente. Toma la idea como una invitación a practicar (gratitud, perdón, los cuatro acuerdos), no como una culpa más del Juez.',
    afirmacion: 'Elijo vivir en el cielo: hoy miro todo con los ojos del amor.',
    practica: [
      'Haz la sesión guiada "Imagina el nuevo sueño" (5 minutos).',
      'Escribe cómo es tu nuevo sueño en "Mi nuevo sueño" (Herramientas).',
      'Elige una situación difícil de hoy y mírala de nuevo con los ojos del amor.',
    ],
    pregunta: '¿Cómo sería mi día si viviera sin miedo a ser juzgado y sin juzgar a nadie?',
  }),

  d(14, 'Oraciones: libertad y amor', ['oracion', 'oraciones', 'respirar', 'respiracion', 'gratitud', 'amor', 'creador', 'meditacion'], {
    idea: 'Respirar ya es amor: estar vivo es suficiente.',
    intro: 'El libro termina con una práctica: respirar con atención y dos oraciones, una para la libertad y otra para el amor. Puedes vivirlas como oración o como meditación, según lo que creas.',
    bloques: [
      ['Respirar el amor', [
        'Tómate unos instantes para cerrar los ojos, abrir tu corazón y sentir el amor que emana de él. Repite las palabras en tu mente y en tu corazón.',
        'Dirige tu atención a los pulmones como si solo existieran ellos. Al expandirse, siente el placer de satisfacer la mayor necesidad del cuerpo: respirar.',
        'Haz una inspiración profunda y siente que el aire no es otra cosa que amor. Descubre la conexión entre el aire y los pulmones: una conexión de amor.',
        'Llena los pulmones hasta que el cuerpo necesite soltar el aire, y al espirar siente de nuevo el placer: siempre que satisfacemos una necesidad del cuerpo sentimos placer. Respirar es lo único que necesitamos para sentirnos felices: estar vivos es suficiente.',
      ]],
      ['Oración para la libertad', [
        'Pide al Creador una fuerte comunión de amor: su verdadero nombre es Amor, y comulgar con él es compartir su misma vibración.',
        'Pide ser como él: amar la vida, ser vida, ser amor. Amar sin condiciones, sin expectativas, sin obligaciones, sin juicios.',
        'Pide amarte y aceptarte sin juzgarte, porque cuando te juzgas te hallas culpable y necesitas castigo.',
        'Pide amar a todas sus creaciones, sobre todo a las personas cercanas, a la familia y a quienes más te cuesta amar: rechazarlos es rechazarte, y rechazarte es rechazarlo a él.',
        'Pide amar y aceptar a los demás tal como son, sin juzgarlos; que limpie tu corazón de veneno emocional y libere tu mente de juicios para vivir en paz y amor.',
        'Hoy es un día especial: abres tu corazón para decir "Te amo" sin miedo, te ofreces para compartir el amor con tus palabras, ojos, manos y corazón, y das gracias por todo lo recibido hoy, sobre todo por la libertad de ser quien realmente eres. Amén.',
      ]],
      ['Oración para el amor: la llama', [
        'Imagina un día cálido y soleado: pájaros, viento y un pequeño río. En su orilla un anciano medita y de su cabeza sale una luz de muchos colores. Abre los ojos llenos de amor y te sonríe. Le preguntas cómo irradia esa luz, y te cuenta que hace muchos años le hizo la misma pregunta a su maestro.',
        'Su maestro sacó de su corazón una preciosa llama y la puso en el suyo. Al sentirla, sintió un amor intenso, porque esa llama era el amor de su maestro.',
        'La llama creció hasta ser un fuego que no quema, sino que purifica. Tocó cada célula de su cuerpo, que le devolvió su amor, y todas las emociones de su mente, que se volvieron amor: se amó de forma absoluta e incondicional.',
        'Sintió la necesidad de compartirlo: puso un poco de su amor en cada árbol, flor, hierba y en la tierra; en los animales; en los cristales, piedras y metales; en el agua, los océanos, la lluvia y la nieve; en el aire y el viento; en la luna, el sol y las estrellas; y en cada ser humano. Con todos se hizo uno: "Dondequiera que voy me veo en sus ojos, porque soy parte de todo, porque amo".',
        'Entonces el anciano pone la llama en tu corazón. Crece en tu interior y eres uno con el viento, el agua, las estrellas, la naturaleza, los animales y todos los seres humanos; de tu cabeza sale una luz de colores.',
        'Y rezas: gracias por el regalo de la vida, por darme todo lo que de verdad he necesitado, por este precioso cuerpo y esta maravillosa mente; gracias por usar mis palabras, mis ojos y mi corazón para compartir tu amor. Te amo tal como eres y, por ser tu creación, me amo tal como soy. Ayúdame a conservar el amor y la paz en mi corazón y a hacer del amor mi forma de vida. Amén.',
      ]],
    ],
    nota: 'No necesitas ser religioso: el propio Ruiz dice que no hace falta ir a la iglesia. La primera parte es una respiración consciente, como las que la evidencia relaciona con menos estrés; la de la llama se parece a la meditación de amor compasivo (metta). Las tienes como sesiones guiadas: "Respirar el amor" y "La llama del amor".',
    afirmacion: 'Me amo tal como soy y hago del amor mi forma de vida.',
    practica: [
      'Haz la sesión "Respirar el amor" antes de dormir.',
      'Haz la sesión "La llama del amor" una mañana de esta semana.',
      'Termina el día dando gracias por 3 cosas, como en la oración.',
    ],
    pregunta: '¿A quién me cuesta amar tal como es, y qué pasaría si dejara de juzgarlo?',
  }),
];

// Ideas y nombres propios del libro, con las lecturas donde aparecen
const IDEAS = [
  ['Primer acuerdo: Sé impecable con tus palabras', 'Habla con integridad, di solo lo que quieres decir y no uses las palabras contra ti ni contra otros. Úsalas para la verdad y el amor.', [4, 5, 7, 9]],
  ['Segundo acuerdo: No te tomes nada personalmente', 'Lo que otros dicen y hacen es una proyección de su propio sueño. Si eres inmune a sus opiniones, no sufres por nada.', [6, 9]],
  ['Tercer acuerdo: No hagas suposiciones', 'Ten el valor de preguntar y de expresar lo que quieres. Comunícate con claridad para evitar malentendidos, tristeza y dramas.', [7, 9]],
  ['Cuarto acuerdo: Haz siempre lo máximo que puedas', 'Lo máximo cambia según el momento; haz lo que puedas, ni más ni menos, y no habrá juicio, culpa ni reproche.', [8, 9]],
  ['Espejo Humeante', 'Cada uno es un espejo hecho de luz; el humo entre los espejos es el Sueño: nuestras interpretaciones.', [1]],
  ['Tonal, nagual e Intento', 'La materia (tonal), la luz entre las estrellas (nagual) y lo que crea armonía entre ambos: la Vida o el Intento.', [1, 10]],
  ['Sueño del planeta', 'El sueño colectivo de la sociedad: reglas, creencias, leyes, religiones y culturas que nos enseñan a soñar.', [2, 3, 13]],
  ['Domesticación', 'Cómo aprendimos qué creer, con premios y castigos, hasta volvernos animales autodomesticados.', [2, 10, 11]],
  ['Acuerdo', 'Cada creencia que aceptamos. La información solo se guarda por acuerdo; estar de acuerdo es tener fe.', [2, 4, 11]],
  ['Libro de la Ley', 'El sistema de creencias que gobierna la mente y no se cuestiona; base de todos nuestros juicios.', [3, 8]],
  ['El Juez', 'La voz interior que juzga todo según el Libro de la Ley y nos declara culpables muchas veces al día.', [3, 8, 9, 10]],
  ['La Víctima', 'La parte que recibe los juicios y carga culpa y vergüenza: "No soy suficientemente bueno".', [3, 9, 10]],
  ['Pagar mil veces por un error', 'La justicia es pagar una vez; el humano paga miles de veces por el mismo error porque lo recuerda.', [3]],
  ['Imagen de perfección', 'El ideal de cómo "deberíamos" ser; como no lo alcanzamos, nos rechazamos y rechazamos a los demás.', [3]],
  ['Veneno emocional', 'Rabia, celos, envidia, odio y tristeza que nacen de las heridas y se transmiten con palabras.', [3, 5, 11]],
  ['Mitote', 'La bruma de la mente: miles de voces hablando a la vez, como un mercado, sin que nadie entienda a nadie.', [3, 5, 6, 13]],
  ['Poder personal', 'La energía con que nacemos; la gastamos en mantener acuerdos y vuelve al romperlos.', [4, 11]],
  ['Impecabilidad', 'Sin pecado: no ir contra ti mismo. Se mide por tu autoestima.', [4, 5]],
  ['Magia negra y magia blanca', 'Las palabras son magia: hechizan con mentiras y miedo o liberan con verdad y amor.', [4, 5, 7]],
  ['Hechizo', 'Una opinión que aceptamos y se vuelve acuerdo; solo se deshace con un acuerdo nuevo basado en la verdad.', [4, 5, 11]],
  ['Chismes', 'La peor magia negra: un virus informático que contagia veneno de mente en mente.', [5, 7]],
  ['Importancia personal', 'Creer que todo gira a nuestro alrededor: la expresión máxima del egoísmo y la raíz de tomárselo todo personal.', [6]],
  ['Inmunidad', 'Si no te tomas nada personalmente y eres impecable, el veneno de otros no te afecta.', [5, 6]],
  ['Amor verdadero', 'Aceptar a los demás tal como son, sin tratar de cambiarlos.', [7, 14]],
  ['Lo máximo que puedas', 'Ni más ni menos: depende de cómo estés ese día. Excederte agota; quedarte corto trae culpa.', [8, 9]],
  ['Acción e inacción', 'La acción es vivir con plenitud; la inacción es negar la vida por miedo a expresar lo que eres.', [8]],
  ['Ritual (puja)', 'Hacer cada acción con amor: ducharte, comer o ejercitarte como una forma de honrar tu cuerpo.', [9]],
  ['Solo por hoy', 'Si rompes un acuerdo, no te juzgues: empieza de nuevo y mantenlos solo por hoy.', [9]],
  ['Las tres maestrías', 'Conciencia (quién eres), Transformación (cómo cambiar) e Intento (el amor).', [10]],
  ['El parásito', 'El Juez, la Víctima y las creencias como un ser que se alimenta de las emociones del miedo.', [10, 12, 13]],
  ['Guerrero', 'Quien se rebela contra el parásito y hace lo máximo por recuperar su libertad.', [9, 10]],
  ['Monstruo de cien cabezas', 'Cada cabeza del parásito es un miedo: se vence enfrentando los miedos uno a uno.', [10]],
  ['Sueño de la primera y de la segunda atención', 'La domesticación usó tu atención por primera vez; al cambiar tus acuerdos la usas por segunda vez y creas el nuevo sueño.', [11]],
  ['Inventario de acuerdos', 'Ver todas tus creencias para elegir cuáles cambiar.', [6, 11]],
  ['Ir al desierto', 'Llegar a la esencia de tus acuerdos: enfrentarte a tus demonios hasta que se vuelven ángeles.', [11]],
  ['Disciplina del guerrero', 'Controlar tus emociones para no gastar tu energía en rabia y drama.', [11]],
  ['Perdón', 'La única manera de sanar: soltar el resentimiento porque te amas. Sabes que perdonaste cuando ya no hay reacción.', [5, 11]],
  ['Sistema de negación', 'Las mentiras que tapan las heridas para poder seguir funcionando.', [11]],
  ['Iniciación a la muerte', 'Una muerte simbólica del viejo sueño y del parásito; luego viene la resurrección.', [10, 12]],
  ['Ángel de la muerte', 'Enseña a vivir cada día como el último y a soltar el pasado: "todo me pertenece, por ahora puedes usarlo".', [12]],
  ['Resurrección', 'Volver a ser como un niño, salvaje y libre, pero con sabiduría en lugar de inocencia.', [12]],
  ['Nuevo Sueño', 'El cielo en la tierra: vivir sin miedo, sin juicios y con amor. La felicidad es una elección.', [13]],
].map(([nombre, texto, dias]) => ({ nombre, texto, dias }));

// "¿Qué te pasa?": situación → qué hacer ahora, qué días releer y qué herramienta usar
const CONSEJOS = [
  // Mente y emociones
  { id: 'hablo-mal', icono: '🗣️', texto: 'Me hablo mal a mí mismo', claves: ['hablo mal', 'me insulto', 'soy estupido', 'no sirvo', 'dialogo interno', 'voz interior', 'me digo'], dias: [5, 4, 3],
    ahora: ['Escribe la frase exacta que te estás diciendo.', 'Pregúntate: ¿se lo diría a mi mejor amigo? Si no, no es impecable.', 'Cámbiala por una verdad amable y dila en voz alta 3 veces.'],
    pregunta: '¿De quién aprendí a hablarme así?', afirmacion: 'Soy impecable con mis palabras, empezando conmigo.' },
  { id: 'culpa', icono: '⚖️', texto: 'Me siento culpable y me juzgo', claves: ['culpa', 'culpable', 'me juzgo', 'juez', 'remordimiento', 'verguenza', 'error', 'me equivoque'], dias: [3, 8, 9],
    ahora: ['Nombra la voz: "Ese es el Juez", y no discutas con ella.', 'Pregúntate: ¿hice lo máximo que podía en ese momento? Dilo: "Hice lo máximo que podía".', 'Si hay algo que reparar, haz una acción concreta hoy; luego di "Ya pagué por esto" y suéltalo.'],
    pregunta: '¿Cuántas veces he pagado ya por este mismo error?', afirmacion: 'Pago una sola vez por cada error; ya no me castigo.' },
  { id: 'rabia', icono: '😠', texto: 'Tengo rabia o estoy enojado', claves: ['rabia', 'ira', 'enojo', 'enojado', 'bravo', 'furia', 'molesto', 'me saca de quicio'], dias: [6, 11, 3],
    ahora: ['No hables todavía: respira lento 1 minuto. Tu energía de hoy vale más que esa discusión.', 'Pregúntate: ¿de qué tengo miedo? (el enojo nace del miedo).', 'Si debes decir algo, di lo que sientes y lo que quieres, sin atacar.'],
    sesion: 'respirar-amor', pregunta: '¿Qué herida mía tocó lo que pasó?', afirmacion: 'Controlo mis emociones; ellas no me controlan.' },
  { id: 'celos', icono: '💚', texto: 'Tengo celos o envidia', claves: ['celos', 'celoso', 'envidia', 'envidioso', 'comparo', 'comparacion', 'inseguridad'], dias: [6, 7, 3],
    ahora: ['Separa lo que viste de lo que supones: escríbelo en dos columnas.', 'Si es con tu pareja, pregunta con calma en vez de acusar.', 'Recuerda: lo que otros tienen o hacen no habla de tu valor.'],
    herramienta: 'suposiciones', pregunta: '¿Qué miedo hay detrás de estos celos?', afirmacion: 'No supongo: pregunto y confío en mí.' },
  { id: 'triste', icono: '😢', texto: 'Estoy triste o desanimado', claves: ['triste', 'tristeza', 'desanimado', 'bajoneado', 'llorar', 'decaido', 'deprimido'], dias: [11, 13, 12],
    ahora: ['Permítete sentirlo sin juzgarte: no es un fallo.', 'Haz lo máximo de hoy, aunque sea poco: una ducha, caminar, comer bien.', 'Habla con alguien de confianza. Si la tristeza dura más de dos semanas o piensas en hacerte daño, busca ayuda profesional (Colombia: línea 192, opción 4; emergencias 123).'],
    pregunta: '¿Qué me tomé personalmente que alimenta esta tristeza?', afirmacion: 'Hoy hago lo máximo que puedo, y eso es suficiente.' },
  { id: 'miedo-rechazo', icono: '😨', texto: 'Tengo miedo al rechazo o al qué dirán', claves: ['miedo', 'rechazo', 'que diran', 'verguenza', 'aprobacion', 'aceptacion', 'no soy suficiente', 'no soy lo bastante bueno'], dias: [2, 6, 10],
    ahora: ['Recuerda: el miedo a ser rechazado es miedo a no ser lo bastante bueno, y eso lo aprendiste, no es verdad.', 'Haz hoy una cosa pequeña siendo tú, aunque no guste a todos.', 'Lo que piensen de ti habla de su sueño: no te lo tomes personal.'],
    herramienta: 'miedos', pregunta: '¿Qué haría si no me importara la opinión de nadie?', afirmacion: 'No necesito que me acepten para ser yo.' },
  { id: 'perfeccion', icono: '🎯', texto: 'Soy perfeccionista y nunca es suficiente', claves: ['perfeccionista', 'perfeccion', 'perfecto', 'nunca es suficiente', 'exigente', 'autoexigencia'], dias: [3, 8, 9],
    ahora: ['Escribe tu "imagen de perfección": ¿de quién es esa voz?', 'Define cuál es tu máximo hoy, con la energía que tienes, y hazlo.', 'Al terminar di: "Hice lo máximo que podía" y no lo revises más.'],
    pregunta: '¿Qué pasaría si me aceptara tal como soy hoy?', afirmacion: 'Soy perfecto tal como soy, y sigo creciendo.' },
  { id: 'sobrepienso', icono: '🌀', texto: 'Le doy vueltas a todo y me imagino lo peor', claves: ['sobrepensar', 'pienso mucho', 'vueltas', 'imagino lo peor', 'ansiedad', 'ansioso', 'mente ruidosa', 'mitote', 'no puedo parar de pensar'], dias: [7, 6, 3],
    ahora: ['Escribe lo que estás suponiendo y, al lado, lo que realmente sabes.', 'Si la duda es sobre alguien, decide qué le vas a preguntar.', 'Haz 5 respiraciones lentas y vuelve a lo que tienes al frente.'],
    herramienta: 'suposiciones', sesion: 'respirar-amor', pregunta: '¿Qué de todo esto vi y qué imaginé?', afirmacion: 'No supongo: pregunto y vivo en el presente.' },
  { id: 'pasado', icono: '⏪', texto: 'No suelto el pasado', claves: ['pasado', 'no lo supero', 'recuerdo', 'nostalgia', 'arrepentido', 'soltar', 'dejar ir', 'aferrado'], dias: [12, 9, 11],
    ahora: ['Di: "Lo que se fue, se fue: hoy elijo vivir el presente".', 'Escribe qué estás cargando y qué te cuesta seguir cargándolo.', 'Haz algo hoy que solo puedas disfrutar si estás aquí y ahora.'],
    sesion: 'dia-mas', pregunta: '¿Qué me pierdo hoy por vivir en el pasado?', afirmacion: 'Dejo ir el pasado y disfruto el sueño de ahora.' },

  // Palabras y relaciones
  { id: 'critica', icono: '🗯️', texto: 'Me criticaron o me insultaron', claves: ['critica', 'criticaron', 'insulto', 'insultaron', 'ofendido', 'ofenden', 'me dijeron', 'humillaron', 'burla', 'personal', 'personalmente', 'todo me afecta', 'me duele lo que dicen'], dias: [6, 4, 5],
    ahora: ['Repite: "No me lo tomo personal: habla de su sueño, no de mí".', 'Pregúntate qué herida tuya tocó ese comentario.', 'Si hay algo de verdad, tómalo como información; lo demás, déjalo con quien lo dijo.'],
    pregunta: '¿Por qué me afecta tanto la opinión de esta persona?', afirmacion: 'No me tomo nada personalmente.' },
  { id: 'hechizo', icono: '🪄', texto: 'Algo que me dijeron de niño todavía me marca', claves: ['de nino', 'de pequeno', 'infancia', 'me marco', 'trauma', 'complejo', 'creencia', 'etiqueta'], dias: [4, 5, 11],
    ahora: ['Escribe la frase exacta y quién te la dijo.', 'Escribe la verdad que la contradice, con pruebas de tu vida.', 'Haz un pequeño acto contra el hechizo, como la niña que vuelve a cantar.'],
    herramienta: 'hechizos', pregunta: '¿Qué hechizo sigo creyendo sin comprobarlo?', afirmacion: 'Solo la verdad me hace libre: rompo este hechizo.' },
  { id: 'chismes', icono: '🐍', texto: 'Hay chismes (de mí o yo los cuento)', claves: ['chisme', 'chismes', 'hablan de mi', 'hablan mal', 'rumor', 'chismoso', 'critico a otros'], dias: [5, 6, 7],
    ahora: ['Si hablan de ti: no te lo tomes personal; tu respuesta es tu conducta, no otro chisme.', 'Si lo cuentas tú: para, cambia de tema o di algo bueno de esa persona.', 'No creas un chisme sin comprobarlo: es un virus.'],
    pregunta: '¿Lo diría delante de esa persona?', afirmacion: 'Mis palabras crean, no envenenan.' },
  { id: 'hiri', icono: '🩹', texto: 'Dije algo hiriente y me arrepiento', claves: ['dije algo', 'hiriente', 'lastime', 'me arrepiento', 'pedir perdon', 'disculpa', 'grite'], dias: [4, 5, 9],
    ahora: ['Pide perdón concreto: qué dijiste y que no era verdad.', 'No te castigues: rompiste el primer acuerdo, empieza de nuevo hoy.', 'Di algo verdadero y bueno a esa persona.'],
    pregunta: '¿Qué miedo habló por mí en ese momento?', afirmacion: 'Rompí un acuerdo; hoy empiezo de nuevo.' },
  { id: 'pareja', icono: '💑', texto: 'Tengo problemas con mi pareja', claves: ['pareja', 'novia', 'novio', 'esposa', 'esposo', 'pelea', 'discusion', 'relacion', 'matrimonio'], dias: [7, 6, 11],
    ahora: ['Revisa qué estás suponiendo: ¿esperas que adivine lo que quieres?', 'Pide en una frase clara lo que necesitas: "Me gustaría que…".', 'Escucha su respuesta sin tomarla personal, y sin intentar cambiarla.'],
    herramienta: 'suposiciones', pregunta: '¿Estoy amando a esta persona tal como es o como quiero que sea?', afirmacion: 'Digo lo que quiero con claridad y amo sin intentar cambiar a nadie.' },
  { id: 'adivinar', icono: '🔮', texto: 'Esperan que adivine (o yo espero que adivinen)', claves: ['adivinar', 'deberias saberlo', 'no me dicen', 'no me entienden', 'malentendido', 'expectativas', 'comunicacion'], dias: [7, 6],
    ahora: ['Pregunta directamente: "¿Qué esperas de mí con esto?".', 'Di tú lo que quieres, sin esperar a que lo noten.', 'Acepta su sí o su no; tú tienes derecho a preguntar y ellos a responder.'],
    herramienta: 'suposiciones', pregunta: '¿Qué estoy esperando que alguien adivine?', afirmacion: 'Tengo el valor de preguntar y de pedir.' },
  { id: 'cambiar-otro', icono: '🔧', texto: 'Quiero que alguien cambie', claves: ['que cambie', 'cambiarlo', 'cambiarla', 'no cambia', 'mi amor lo cambiara', 'aceptar', 'tal como es'], dias: [7, 14],
    ahora: ['Recuerda: tu amor no cambia a nadie; las personas cambian si quieren.', 'Decide: ¿puedo amarla tal como es hoy? Si sí, deja de pedirle que cambie.', 'Si no, sé honesto: "Te amo, pero esto no lo quiero en mi vida".'],
    pregunta: '¿Amo a esta persona o a la idea de lo que podría ser?', afirmacion: 'Amo a los demás tal como son.' },
  { id: 'maltrato', icono: '🛑', texto: 'Alguien me trata mal', claves: ['me trata mal', 'maltrato', 'abuso', 'me humilla', 'me grita', 'violencia', 'toxica', 'toxico', 'me controla'], dias: [3, 6, 10],
    ahora: ['No es tu culpa ni algo que "te mereces": el límite del maltrato que aceptas es el que te das tú.', 'Pon un límite claro o aléjate; que se vaya quien no te respeta es un regalo.', 'Si hay violencia o miedo, busca ayuda ya: en Colombia 123 (emergencias) y línea 155 (orientación a mujeres).'],
    pregunta: '¿Qué me digo a mí mismo para seguir tolerando esto?', afirmacion: 'Merezco amor y respeto, empezando por el mío.' },
  { id: 'complacer', icono: '🙇', texto: 'No sé decir que no y vivo complaciendo', claves: ['decir no', 'decir que no', 'no se decir no', 'complacer', 'complaciente', 'agradar', 'limites', 'me aprovechan'], dias: [9, 10, 13],
    ahora: ['Antes de responder, pregúntate: ¿quiero decir sí o no?', 'Di que no en una frase, sin justificarte: "Esta vez no puedo".', 'Recuerda: el otro tiene derecho a pedir y tú a contestar sí o no.'],
    pregunta: '¿Qué hago solo para que me acepten?', afirmacion: 'Digo sí cuando es sí y no cuando es no.' },
  { id: 'perdonar', icono: '🕊️', texto: 'No puedo perdonar a alguien', claves: ['perdonar', 'perdon', 'resentimiento', 'rencor', 'no lo perdono', 'me hizo dano', 'traicion'], dias: [11, 10, 3],
    ahora: ['Recuerda: perdonas por ti, porque no quieres seguir pagando; no es justificar ni reconciliarte.', 'Escribe la herida y cuántas veces la has vuelto a pagar.', 'Di: "¡Ya basta! No volveré a ser la Víctima". Repite cada vez que vuelva.'],
    herramienta: 'perdon', pregunta: '¿Qué me cuesta seguir cargando este rencor?', afirmacion: 'Perdono porque me amo.' },
  { id: 'padres', icono: '👪', texto: 'Tengo rabia con mis padres o mi familia', claves: ['padres', 'papa', 'mama', 'familia', 'crianza', 'me criaron', 'hermanos'], dias: [10, 2, 11],
    ahora: ['Recuerda: te enseñaron lo que sabían, con su propia domesticación.', 'Separa: lo que te hicieron vs. lo que hoy sigues haciéndote tú.', 'Escribe una creencia de ellos que ya no quieres y su reemplazo.'],
    herramienta: 'acuerdos', pregunta: '¿Qué acuerdo de mi familia quiero dejar de repetir?', afirmacion: 'Rompo la cadena: elijo mis propios acuerdos.' },
  { id: 'hijos', icono: '🧒', texto: 'Quiero hablarle mejor a los niños', claves: ['hijos', 'hijo', 'hija', 'ninos', 'sobrinos', 'educar', 'regañar'], dias: [5, 2, 4],
    ahora: ['Recuerda a la niña que dejó de cantar: tus opiniones son hechizos.', 'Corrige la conducta, no a la persona: "eso estuvo mal", no "eres malo".', 'Dile hoy algo verdadero y bueno de quién es.'],
    pregunta: '¿Qué hechizo no quiero pasarle a un niño?', afirmacion: 'Mis palabras siembran amor en los niños.' },

  // Acción y energía
  { id: 'agotado', icono: '🔋', texto: 'Estoy agotado o me exijo demasiado', claves: ['agotado', 'cansado', 'cansancio', 'quemado', 'burnout', 'me exijo', 'sobreentreno', 'sin energia', 'no doy mas'], dias: [8, 11, 9],
    ahora: ['Define tu máximo de hoy, no el de un día bueno: haz eso y basta.', 'Baja la carga (en el gym, el volumen o el peso) sin culpa: excederte va contra ti.', 'Cuida tu energía: evita la discusión o el drama que te la quitaría.'],
    pregunta: '¿Para quién me estoy exigiendo tanto: para mí o para el Juez?', afirmacion: 'Hago lo máximo que puedo hoy, ni más ni menos.' },
  { id: 'procrastino', icono: '⏳', texto: 'Estoy procrastinando o no hago nada', claves: ['procrastinar', 'procrastinando', 'pereza', 'no hago nada', 'aplazar', 'inaccion', 'television', 'celular', 'flojera'], dias: [8, 9, 10],
    ahora: ['Haz el paso más pequeño posible, ahora: la acción es estar vivo.', 'Hazlo por el placer de hacerlo bien, no por la recompensa.', 'Al terminar, nada de reproches: "Hice lo máximo que podía".'],
    pregunta: '¿A qué le tengo miedo si empiezo?', afirmacion: 'Actúo: así expreso lo que soy.' },
  { id: 'recaida', icono: '🔁', texto: 'Rompí un acuerdo y me siento mal', claves: ['rompi', 'recai', 'recaida', 'falle', 'otra vez', 'volvi a', 'no puedo cumplir', 'fracase'], dias: [9, 8],
    ahora: ['No le des al Juez el gusto de volverte víctima.', 'Di: "Está bien, rompí el acuerdo. Empiezo otra vez: solo por hoy".', 'Escribe en la revisión de la noche qué pasó, sin juzgarte.'],
    herramienta: 'diario', sesion: 'acuerdos-hoy', pregunta: '¿Qué aprendí de esta caída?', afirmacion: 'Si me caigo, me levanto: soy lo bastante fuerte.' },
  { id: 'trabajo', icono: '💼', texto: 'Trabajo sin ganas, solo por la plata', claves: ['trabajo', 'sin ganas', 'por la plata', 'por el dinero', 'quincena', 'viernes', 'odio mi trabajo', 'rutina'], dias: [8, 10],
    ahora: ['Elige una tarea de hoy y hazla lo mejor que puedas por el placer de hacerla bien.', 'Nota cuándo trabajas solo esperando la recompensa: ahí se vuelve pesado.', 'Escribe qué amarías hacer y un paso pequeño hacia eso.'],
    pregunta: '¿Qué parte de mi trabajo podría hacer porque me gusta?', afirmacion: 'Actúo porque amo hacerlo, no por la recompensa.' },
  { id: 'no-se-que-quiero', icono: '🧭', texto: 'No sé qué quiero', claves: ['no se que quiero', 'confundido', 'perdido', 'indeciso', 'rumbo', 'proposito', 'que hacer con mi vida'], dias: [6, 10, 13],
    ahora: ['Escribe 5 creencias que te dicen qué "deberías" querer, y tacha las que no son tuyas.', 'Recuerda qué hacías de niño cuando eras feliz sin pensarlo.', 'Imagina el nuevo sueño (sesión) y anota lo que aparezca.'],
    sesion: 'nuevo-sueno', herramienta: 'perfil', pregunta: '¿Qué quiero yo, sin la voz de nadie más?', afirmacion: 'Sé lo que quiero cuando escucho mi propio sueño.' },

  // Espíritu y sentido
  { id: 'vacio', icono: '🫥', texto: 'Me siento vacío o sin sentido', claves: ['vacio', 'sin sentido', 'nada me llena', 'apagado', 'desconectado'], dias: [1, 13, 14],
    ahora: ['Respira con atención 2 minutos: estar vivo ya es suficiente (sesión "Respirar el amor").', 'Haz algo con amor por tu cuerpo hoy: comer bien, moverte, una ducha consciente.', 'Si el vacío dura semanas o pierdes el interés por todo, habla con un profesional de salud mental.'],
    sesion: 'respirar-amor', pregunta: '¿Dónde dejé de expresar lo que soy?', afirmacion: 'Estoy vivo, y eso es suficiente para empezar.' },
  { id: 'no-libre', icono: '⛓️', texto: 'Siento que no soy libre de ser yo', claves: ['libre', 'libertad', 'ser yo', 'mascara', 'fingir', 'no soy yo', 'atrapado', 'domesticado'], dias: [10, 2, 13],
    ahora: ['Date cuenta: ese es el primer paso. Di "¡Ya basta!".', 'Haz hoy algo que harías si nadie te juzgara.', 'Empieza tu inventario: un acuerdo viejo y su reemplazo.'],
    herramienta: 'acuerdos', pregunta: '¿Qué máscara llevo y para quién?', afirmacion: 'Recupero mi libertad de ser quien realmente soy.' },
  { id: 'gratitud', icono: '🙏', texto: 'Quiero agradecer y empezar bien el día', claves: ['gratitud', 'agradecer', 'empezar el dia', 'manana', 'despertar', 'buen dia'], dias: [12, 14, 9],
    ahora: ['Al despertar: "Estoy despierto, veo el sol… Un día más para ser yo mismo".', 'Repite los cuatro acuerdos "solo por hoy".', 'Agradece a una persona concreta antes del mediodía.'],
    sesion: 'acuerdos-hoy', pregunta: '¿Por qué estoy agradecido hoy, aunque sea pequeño?', afirmacion: 'Estoy vivo: un día más para ser yo mismo.' },
  { id: 'muerte', icono: '🕯️', texto: 'Tengo miedo a la muerte o perdí a alguien', claves: ['muerte', 'morir', 'murio', 'duelo', 'perdida', 'perdi a', 'fallecio', 'miedo a morir'], dias: [12, 13, 14],
    ahora: ['Permítete sentir el dolor: "dejar ir" no es dejar de extrañar.', 'Dile hoy a alguien vivo cuánto lo quieres.', 'Si el duelo te impide funcionar durante semanas, busca un grupo de duelo o un terapeuta.'],
    sesion: 'dia-mas', pregunta: '¿Qué quiero decirle hoy a las personas que amo?', afirmacion: 'Vivo cada día con amor, como si fuera el último.' },
  { id: 'amarme', icono: '💗', texto: 'Quiero amarme más', claves: ['amarme', 'quererme', 'amor propio', 'autoestima', 'aceptarme', 'mi cuerpo', 'me rechazo'], dias: [5, 9, 14],
    ahora: ['Dite en voz alta 3 cosas verdaderas y buenas de ti.', 'Convierte una acción de hoy en un ritual para tu cuerpo (ducha, comida, entreno).', 'Haz la sesión "La llama del amor".'],
    sesion: 'llama-amor', pregunta: '¿Qué parte de mí todavía rechazo?', afirmacion: 'Me amo tal como soy.' },
];

const GRUPOS = [
  ['🧠 Mente y emociones', ['hablo-mal', 'culpa', 'rabia', 'celos', 'triste', 'miedo-rechazo', 'perfeccion', 'sobrepienso', 'pasado']],
  ['🗣️ Palabras', ['critica', 'hechizo', 'chismes', 'hiri']],
  ['🤝 Relaciones', ['pareja', 'adivinar', 'cambiar-otro', 'maltrato', 'complacer', 'perdonar', 'padres', 'hijos']],
  ['🚀 Acción y energía', ['agotado', 'procrastino', 'recaida', 'trabajo', 'no-se-que-quiero']],
  ['🕊️ Espíritu y sentido', ['vacio', 'no-libre', 'gratitud', 'muerte', 'amarme']],
];

// El libro convertido en un día
const RUTINA = [
  ['☀️ Al despertar', [
    '"Estoy despierto, veo el sol. Voy a entregarle mi gratitud… Un día más para ser yo mismo" (lectura 12).',
    'Repite los cuatro acuerdos solo por hoy: impecable con mis palabras, nada personal, sin suposiciones, lo máximo que pueda (sesión "Mis 4 acuerdos de hoy").',
    'Lee la lectura del día y su afirmación.',
    'Haz de la ducha un ritual: dile a tu cuerpo cuánto lo amas (lectura 9).',
  ]],
  ['💼 Durante el día', [
    'Antes de hablar: ¿es verdad y es con amor? Cero chismes, también contigo.',
    'Ante un comentario que duela: "No me lo tomo personal". ¿Qué herida tocó?',
    'Ante una duda: pregunta en vez de suponer; pide lo que quieres con claridad.',
    'Haz lo máximo de hoy según tu energía, ni más ni menos, y por el placer de hacerlo.',
    'Si una emoción te arrastra, respira antes de reaccionar: cuida tu energía.',
    'Di sí cuando es sí y no cuando es no.',
  ]],
  ['🌙 Antes de dormir', [
    'Revisión de los 4 acuerdos (🌙 en Herramientas), sin juzgarte.',
    'Si rompiste uno: "Está bien. Mañana empiezo otra vez".',
    'Perdona algo del día, a otro o a ti.',
    'Respira el amor 2 minutos o di la oración (sesiones "Respirar el amor" y "La llama del amor").',
  ]],
];

// Herramientas que guardan fichas
const FICHAS = {
  acuerdos: { icono: '📋', titulo: 'Inventario de acuerdos', lectura: 11, nueva: '+ Nuevo acuerdo', campos: [
    ['viejo', 'El acuerdo viejo: lo que creo (ej.: "No soy lo bastante bueno")'],
    ['origen', '¿De dónde viene? ¿Quién me lo enseñó y cuándo?'],
    ['verdad', '¿Es verdad? ¿Qué pruebas tengo en contra?'],
    ['costo', '¿Qué me cuesta mantenerlo? (energía, relaciones, oportunidades)'],
    ['nuevo', 'El acuerdo nuevo que ocupa su lugar'],
    ['practica', 'Cómo lo voy a repetir (qué, cuándo, cada cuánto)'],
    ['avance', 'Cómo voy: ¿se agrieta, ya se rompió?'],
  ] },
  hechizos: { icono: '🪄', titulo: 'Romper un hechizo', lectura: 4, nueva: '+ Nuevo hechizo', campos: [
    ['frase', 'Lo que me dijeron (la frase exacta)'],
    ['quien', 'Quién me lo dijo y en qué momento'],
    ['crei', 'Por qué lo creí y qué he hecho desde entonces por creerlo'],
    ['verdad', 'La verdad (con ejemplos reales de mi vida)'],
    ['acuerdo', 'Mi nuevo acuerdo basado en la verdad'],
    ['acto', 'Un acto para romperlo (como la niña que vuelve a cantar)'],
  ] },
  suposiciones: { icono: '❓', titulo: 'Preguntar en vez de suponer', lectura: 7, nueva: '+ Nueva situación', campos: [
    ['hecho', 'Lo que pasó (solo los hechos)'],
    ['supuse', 'Lo que supuse'],
    ['personal', '¿Cómo me lo tomé personalmente? ¿Qué sentí?'],
    ['pregunta', 'La pregunta clara que voy a hacer (o lo que voy a pedir)'],
    ['respuesta', 'Lo que me respondieron (la verdad)'],
  ] },
  perdon: { icono: '🕊️', titulo: 'Perdonar para sanar', lectura: 11, nueva: '+ Nuevo perdón', campos: [
    ['quien', '¿A quién perdono? (también puede ser a mí)'],
    ['herida', 'La herida: qué pasó y qué sentí'],
    ['pago', '¿Cuántas veces he vuelto a pagar por esto?'],
    ['porque', 'Lo perdono porque me amo y no quiero seguir pagando. Lo que gano'],
    ['declaro', 'Mi declaración: "¡Ya basta! No volveré a ser la Víctima…"'],
    ['reaccion', '¿Todavía siento reacción al ver o escuchar su nombre?'],
    ['fecha', 'Fecha', 'date'],
  ] },
  miedos: { icono: '🐉', titulo: 'Las cien cabezas: mis miedos', lectura: 10, nueva: '+ Nuevo miedo', campos: [
    ['miedo', 'El miedo (una cabeza del monstruo)'],
    ['cuando', '¿Cuándo aparece y qué me impide hacer?'],
    ['paso', 'El paso más pequeño para enfrentarlo'],
    ['fecha', 'Cuándo lo voy a dar', 'date'],
    ['paso2', 'Qué pasó y cuál es el siguiente paso'],
  ] },
};

const EVALUACIONES = {
  acuerdo: {
    icono: '🧭', titulo: '¿Qué acuerdo te cuesta más?', lectura: 9,
    intro: 'Marca todo lo que hoy sea verdad para ti. El resultado te dice en qué acuerdo enfocarte este mes. Repítela cada mes y mira cómo cambias.',
    categorias: {
      palabras: { nombre: '🗣️ Sé impecable con tus palabras', consejo: 'Tu trabajo está en las palabras: cómo te hablas y cómo hablas de otros. Un día sin chismes y sin hablarte mal; usa la ficha "Romper un hechizo" (lecturas 4 y 5).' },
      personal: { nombre: '🛡️ No te tomes nada personalmente', consejo: 'Lo que otros dicen te afecta mucho. Pega el acuerdo en la nevera y ante cada comentario pregúntate qué herida tocó (lectura 6).' },
      suposiciones: { nombre: '❓ No hagas suposiciones', consejo: 'Tu mente llena los huecos con lo peor. Usa la ficha "Preguntar en vez de suponer" y pide lo que quieres con claridad (lectura 7).' },
      maximo: { nombre: '💪 Haz siempre lo máximo que puedas', consejo: 'Te exiges de más o te quedas corto, y el Juez te castiga. Define tu máximo de cada día según tu energía y empieza de nuevo cuando falles (lecturas 8 y 9).' },
    },
    items: [
      ['Me digo cosas como "soy estúpido" o "no sirvo"', 'palabras'],
      ['Cuento o escucho chismes con frecuencia', 'palabras'],
      ['Digo cosas que no pienso cuando me enojo', 'palabras'],
      ['Prometo cosas que después no cumplo', 'palabras'],
      ['Uso las palabras para culpar o reprochar', 'palabras'],
      ['Una crítica me arruina el día', 'personal'],
      ['Necesito que me digan que lo hice bien', 'personal'],
      ['Me ofendo y reacciono para defender mi punto', 'personal'],
      ['Siento que la gente hace las cosas contra mí', 'personal'],
      ['Me cuesta dejar ir lo que alguien me dijo', 'personal'],
      ['Me imagino lo que otros piensan de mí', 'suposiciones'],
      ['Espero que los demás adivinen lo que quiero', 'suposiciones'],
      ['Me armo historias en la cabeza y luego me las creo', 'suposiciones'],
      ['Me da miedo preguntar para aclarar algo', 'suposiciones'],
      ['Me enojo porque alguien "debería haberlo sabido"', 'suposiciones'],
      ['Me exijo tanto que termino agotado', 'maximo'],
      ['Me castigo cuando no rindo como esperaba', 'maximo'],
      ['Dejo cosas a medias o no empiezo', 'maximo'],
      ['Hago las cosas solo por la recompensa o por obligación', 'maximo'],
      ['Si fallo un día, abandono todo', 'maximo'],
    ],
  },
};

// Pasos de las sesiones guiadas: { nombre, musculo (subtítulo), seg, lados, desc }
const t = (nombre, musculo, seg, desc) => ({ nombre, musculo, seg, lados: false, desc });

export default {
  id: 'cuatro-acuerdos',
  titulo: 'Los Cuatro Acuerdos',
  autor: 'Miguel Ruiz',
  icono: '🪶',
  descripcion: '14 lecturas, una por día, para romper los acuerdos que te hacen sufrir',
  unidad: 'Día',
  lecturas: LECTURAS,
  conceptos: { titulo: 'Ideas clave', icono: '🪶', lista: IDEAS },
  consejos: CONSEJOS,
  grupos: GRUPOS,
  rutina: RUTINA,
  diario: {
    titulo: '🌙 Noche: revisión de los 4 acuerdos (sin juzgarte)',
    campos: [
      ['palabras', '🗣️ ¿Fui impecable con mis palabras? ¿Dónde no (conmigo o con otros)?'],
      ['personal', '🛡️ ¿Qué me tomé personalmente? ¿De quién era en realidad?'],
      ['suposiciones', '❓ ¿Qué supuse? ¿Qué voy a preguntar?'],
      ['maximo', '💪 ¿Hice lo máximo que podía hoy, ni más ni menos?'],
      ['manana', '🌅 Mañana empiezo de nuevo: me enfoco en…'],
    ],
    ayer: ['manana', '📌 Lo que te propusiste anoche para hoy'],
  },
  fichas: FICHAS,
  evaluaciones: EVALUACIONES,
  perfil: {
    titulo: '🪶 Mi nuevo sueño',
    campos: [
      ['sueno', '🌄 Cómo es mi cielo en la tierra: cómo vivo sin miedo (lectura 13)'],
      ['soy', '🧒 Quién soy sin máscaras: lo que hago cuando soy como un niño (lectura 10)'],
      ['acuerdos', '📜 Los cuatro acuerdos en mis propias palabras'],
      ['rituales', '🚿 Mis rituales de amor por mi cuerpo (lectura 9)'],
      ['amo', '💗 Lo que amo hacer por el puro placer de hacerlo (lectura 8)'],
      ['compromiso', '✍️ "Elijo respetar los Cuatro Acuerdos" (fecha y firma)'],
    ],
  },
  // Sesiones guiadas (lecturas 9, 12, 13 y 14): aparecen también en 🧘 Sesiones
  sesiones: [
    {
      id: 'acuerdos-hoy', nombre: 'Mis 4 acuerdos de hoy', tipo: 'mente', pasos: [
        t('Respira y observa', 'Llegar', 30, 'Tres respiraciones lentas. Nota cómo amaneces hoy: tu energía, tu ánimo. Ese es tu punto de partida.'),
        t('Impecable con mis palabras', 'Primer acuerdo', 40, 'Piensa en una conversación de hoy. Decide: diré solo lo que es verdad y con amor; no hablaré contra mí ni contra nadie. Di: "Soy impecable con mis palabras".'),
        t('Nada personal', 'Segundo acuerdo', 40, 'Imagina a alguien diciéndote algo que te molesta. Respira y repite: "Habla de su sueño, no de mí. No me tomo nada personalmente".'),
        t('Sin suposiciones', 'Tercer acuerdo', 40, '¿Hay algo que estás suponiendo de alguien? Decide qué vas a preguntar hoy y qué vas a pedir con claridad.'),
        t('Lo máximo que pueda', 'Cuarto acuerdo', 40, 'Mira tu energía de hoy. Decide hacer lo máximo con ella, ni más ni menos, por el placer de hacerlo.'),
        t('Solo por hoy', 'Compromiso', 30, 'Di en voz alta: "Solo por hoy seré impecable con mis palabras, no me tomaré nada personalmente, no haré suposiciones y haré lo máximo que pueda". Si me caigo, empiezo otra vez.'),
      ],
    },
    {
      id: 'dia-mas', nombre: 'Un día más para ser yo', tipo: 'mente', pasos: [
        t('Estoy despierto', 'Ángel de la muerte', 30, 'Abre los ojos despacio. Di: "Estoy despierto, veo el sol (o la luz)". Siente que estás vivo.'),
        t('Gratitud a todo', 'Gratitud', 45, 'Agradece a la luz, a tu cama, a tu cuerpo, a las personas que quieres, una por una: "Gracias, porque todavía estoy vivo".'),
        t('Si fuera el último día', 'Presente', 45, 'Imagina que hoy es tu último día. ¿Qué no harías? ¿Qué te dejaría de importar? ¿Qué harías?'),
        t('Dile que lo amas', 'Amor', 40, 'Piensa en alguien que quieres. Decide decírselo hoy, sin esperar nada a cambio.'),
        t('Suelta el pasado', 'Dejar ir', 40, 'Piensa en algo que cargas de ayer. Imagina que el ángel de la muerte se lo lleva: "Lo que está muerto, se va". Respira y suéltalo.'),
        t('Un día más', 'Compromiso', 20, 'Di: "Un día más para ser yo mismo". Levántate y empieza.'),
      ],
    },
    {
      id: 'nuevo-sueno', nombre: 'Imagina el nuevo sueño', tipo: 'mente', pasos: [
        t('Cierra y abre los ojos', 'Nuevos ojos', 40, 'Cierra los ojos, respira, y ábrelos como si vieras el mundo por primera vez. Busca el amor en la luz, en las cosas, en ti.'),
        t('Sin miedo a ser juzgado', 'Imagínate que…', 45, 'Imagínate viviendo sin miedo a lo que piensen de ti: no eres responsable de la opinión de nadie. ¿Qué harías distinto hoy?'),
        t('Sin juzgar a nadie', 'Imagínate que…', 45, 'Imagínate sin necesidad de tener razón, perdonando con facilidad. Piensa en alguien y míralo sin juicio.'),
        t('Amar sin miedo', 'Imagínate que…', 45, 'Imagínate diciendo "Te quiero" sin vergüenza, con el corazón abierto, sin miedo a que te hieran.'),
        t('Te amas tal como eres', 'Imagínate que…', 45, 'Imagínate amando tu cuerpo y tus emociones tal como son: eres perfecto tal como eres.'),
        t('Elige el cielo', 'Elección', 30, 'La felicidad, igual que el sufrimiento, es una elección. Di: "Hoy elijo vivir en el cielo".'),
      ],
    },
    {
      id: 'respirar-amor', nombre: 'Respirar el amor', tipo: 'mente', pasos: [
        t('Abre tu corazón', 'Oración', 30, 'Siéntate o acuéstate. Cierra los ojos, pon una mano en el pecho y siente el amor que sale de tu corazón.'),
        t('Atención a los pulmones', 'Respiración', 45, 'Lleva la atención a tus pulmones como si solo existieran ellos. Al expandirse, siente el placer de respirar.'),
        t('El aire es amor', 'Respiración', 60, 'Inspira profundo y siente que el aire no es otra cosa que amor. Llena los pulmones hasta que el cuerpo pida soltarlo.'),
        t('Suelta y siente el placer', 'Respiración', 60, 'Espira despacio y siente el placer de satisfacer una necesidad del cuerpo. Repite: inhala amor, exhala placer.'),
        t('Estar vivo es suficiente', 'Gratitud', 30, 'Di en silencio: "Estar vivo es suficiente. Gracias por este aire".'),
      ],
    },
    {
      id: 'llama-amor', nombre: 'La llama del amor', tipo: 'mente', pasos: [
        t('El río y el anciano', 'Oración para el amor', 45, 'Imagina un día cálido y soleado: pájaros, viento, un pequeño río. En la orilla un anciano medita y de su cabeza sale una luz de colores. Te mira con amor.'),
        t('La llama en tu corazón', 'Oración para el amor', 45, 'El anciano saca de su corazón una pequeña llama y la pone en el tuyo. Siente su calor: es amor.'),
        t('Ama tu cuerpo', 'Oración para el amor', 45, 'La llama crece: es un fuego que no quema, purifica. Toca cada célula de tu cuerpo y cada emoción, y todo se vuelve amor por ti.'),
        t('Comparte tu amor', 'Oración para el amor', 60, 'Pon un poco de ese amor en los árboles, las flores, los animales, el agua, el aire, la luna, el sol y las estrellas. Te devuelven su amor.'),
        t('Uno con todo', 'Oración para el amor', 45, 'Pon tu amor en cada ser humano: en tu familia, en quien te cuesta amar. Eres parte de todo porque amas.'),
        t('Gracias', 'Oración para el amor', 40, 'Gracias por la vida, por este cuerpo y esta mente. Me amo tal como soy. Que el amor sea mi forma de vida.'),
      ],
    },
  ],
};
