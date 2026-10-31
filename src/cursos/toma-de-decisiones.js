// Toma de decisiones: decidir con método cuando hay incertidumbre, prisa o emociones. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const PENSAR = {
  titulo: 'Pensar la decisión',
  objetivo: 'Separar la calidad de una decisión de su resultado, plantear bien el problema con más de una opción y decidir según lo que de verdad te importa.',
  fuentes: [
    ['Baron, J. y Hershey, J. C. (1988). Outcome bias in decision evaluation. Journal of Personality and Social Psychology, 54(4), 569-579.', 'Juzgamos las decisiones por cómo salieron, no por cómo se tomaron.'],
    ['Duke, A. (2018). Thinking in Bets: Making smarter decisions when you don’t have all the facts. Portfolio.', 'Decidir como apostar: separar la suerte de la calidad de la decisión.'],
    ['Tversky, A. y Kahneman, D. (1981). The framing of decisions and the psychology of choice. Science, 211(4481), 453-458.', 'La misma decisión, presentada distinto, se elige distinto (el efecto marco).'],
    ['Nutt, P. C. (1999). Surprising but true: Half the decisions in organizations fail. Academy of Management Executive, 13(4), 75-90.', 'Por qué fallan las decisiones en las organizaciones: se cierra el problema demasiado pronto.'],
    ['Heath, C. y Heath, D. (2013). Decisive: How to make better choices in life and work. Crown Business.', 'El método WRAP: ampliar opciones, poner a prueba los supuestos, tomar distancia y prepararse para equivocarse.'],
    ['Hammond, J. S., Keeney, R. L. y Raiffa, H. (1999). Smart Choices: A practical guide to making better decisions. Harvard Business School Press.', 'El método PrOACT: problema, objetivos, alternativas, consecuencias y compensaciones.'],
    ['Keeney, R. L. (1992). Value-Focused Thinking: A path to creative decisionmaking. Harvard University Press.', 'Empezar por lo que te importa y no por las opciones que tienes enfrente.'],
  ],
  lecciones: [
    l('Decisión no es lo mismo que resultado', 10, {
      idea: 'Una buena decisión puede salir mal y una mala puede salir bien, porque en el medio está la suerte. Si juzgas tus decisiones solo por cómo salieron, aprendes las lecciones equivocadas.',
      bloques: [
        ['Dos cosas distintas', [
          'La decisión es lo que controlas: qué información buscaste, qué opciones viste y cómo las comparaste.',
          'El resultado depende de tu decisión y además de cosas que no controlas: el clima, lo que hacen otros, el azar.',
          'Manejar borracho y llegar bien a la casa no fue una buena decisión; fue una mala decisión con suerte.',
          'Salir con tiempo, por la ruta más segura, y que igual te choquen no fue una mala decisión; fue mala suerte.',
        ]],
        ['El sesgo del resultado', [
          'Baron y Hershey (1988) mostraron que la gente califica la misma decisión médica como mejor o peor según si al paciente le fue bien o mal, aunque la información al decidir era idéntica.',
          'Annie Duke, exjugadora profesional de póker, lo llama "resultadismo": creer que si salió mal, se decidió mal.',
          'El peligro: repites decisiones malas que tuvieron suerte y abandonas decisiones buenas que tuvieron mala suerte.',
        ]],
        ['Cómo evaluar una decisión', [
          'Pregunta qué sabías o podías saber en ese momento, no lo que sabes ahora.',
          'Pregunta si consideraste otras opciones y si pensaste en lo que podía salir mal.',
          'Mira muchas decisiones parecidas, no una sola: en una sola la suerte pesa demasiado; en veinte, se nota el método.',
          'Separa lo que se puede aprender ("no revisé el contrato") de la mala suerte ("justo ese mes cerraron la empresa").',
        ]],
      ],
      ejemplos: [
        'Un amigo metió los ahorros en una "inversión" que pagaba intereses altísimos y le fue bien los primeros meses. Eso no prueba que haya sido buena decisión: muchas captadoras ilegales pagan al principio con la plata de los que entran después, hasta que colapsan.',
        'Decidiste no jugar el partido del miércoles porque sentías la rodilla rara, y tu equipo ganó sin ti. Eso no dice que hayas decidido mal: con la información que tenías, cuidarte era razonable.',
      ],
      practica: [
        'Recuerda una decisión que salió mal y escribe qué sabías en ese momento. ¿Fue mala decisión o mala suerte?',
        'Recuerda una que salió bien y pregúntate si tuviste suerte. ¿La repetirías con la misma información?',
        'Cuando alguien te cuente un éxito o un fracaso esta semana, pregúntate en silencio: "¿cuánto de eso fue decisión y cuánto suerte?".',
      ],
      pregunta: '¿Qué decisión de mi vida estoy juzgando solo por cómo salió y no por cómo la tomé?',
      nota: 'Separar decisión de resultado no es una excusa para no hacerse responsable. Si algo sale mal una y otra vez, el patrón sí dice algo del método. La idea es revisar el proceso cada vez, salga bien o salga mal, en lugar de revisarlo solo cuando sale mal.',
      recordar: [
        ['¿Qué diferencia hay entre una decisión y su resultado?', 'La decisión es lo que controlas con la información que tenías; el resultado depende además de la suerte y de lo que no controlas.'],
        ['¿Qué es el sesgo del resultado?', 'Juzgar si una decisión fue buena o mala solo por cómo salió (Baron y Hershey, 1988).'],
        ['¿Por qué conviene mirar muchas decisiones parecidas y no una sola?', 'Porque en una sola la suerte pesa mucho; en muchas se ve si el método es bueno.'],
        ['¿Qué pregunta ayuda a evaluar una decisión pasada?', '¿Qué sabía o podía saber en ese momento, y qué opciones consideré?'],
      ],
      tarjetas: [
        ['Decisión vs. resultado', 'Una buena decisión puede salir mal por mala suerte, y una mala puede salir bien por buena suerte.'],
        ['Sesgo del resultado (Baron y Hershey, 1988)', 'Calificar una decisión por cómo salió y no por la información y el método con que se tomó.'],
        ['Cómo evaluar una decisión', 'Con lo que sabías en ese momento, las opciones que viste y los riesgos que pensaste; no con lo que pasó después.'],
      ],
    }),
    l('El problema correcto y más de una opción', 10, {
      idea: 'Muchas malas decisiones fallan antes de empezar: se resuelve el problema equivocado o se elige entre "sí o no" sin ver otras opciones. Plantear bien y abrir alternativas mejora la decisión más que analizar mucho.',
      bloques: [
        ['El marco cambia la decisión', [
          'Tversky y Kahneman (1981) mostraron que la gente elige distinto según cómo se presente lo mismo: "se salvan 200 de 600" frente a "mueren 400 de 600".',
          'Lo mismo pasa en la vida: "¿compro la moto?" no es lo mismo que "¿cómo me muevo mejor al trabajo con este presupuesto?".',
          'Antes de decidir, escribe el problema de dos o tres formas distintas. Si cambia lo que quieres hacer, el marco te estaba empujando.',
        ]],
        ['La trampa del "sí o no"', [
          'Paul Nutt estudió cientos de decisiones en organizaciones y encontró que en la mayoría se consideraba una sola opción: hacerlo o no hacerlo.',
          'También encontró que muchas fallaban por cerrar el problema demasiado pronto y adoptar la primera idea.',
          'Los hermanos Heath (2013) lo resumen así: cuando te oyes decir "¿hago esto o no?", detente y busca al menos una opción más.',
        ]],
        ['Cómo abrir opciones', [
          'Pregunta "¿y si no pudiera hacer ninguna de las opciones que tengo?": te obliga a inventar otra.',
          'Busca opciones de "y" en vez de "o": a veces se pueden combinar (trabajar y estudiar de noche, en lugar de una cosa o la otra).',
          'Busca a alguien que ya resolvió algo parecido y pregúntale qué hizo.',
          'Haz una prueba pequeña antes de la decisión grande: un mes, un curso corto, una visita.',
        ]],
      ],
      ejemplos: [
        '"¿Renuncio o no renuncio?" puede convertirse en: pedir traslado de área, negociar trabajo remoto dos días, buscar trabajo antes de renunciar o tomar vacaciones para pensarlo. La pregunta original solo dejaba dos salidas.',
        'Estás pensando en sacar un crédito para comprar carro. Si planteas el problema como "llegar al trabajo cómodo y a tiempo", aparecen otras opciones: moto, carro usado de contado, mudarte más cerca o combinar bicicleta y transporte público.',
      ],
      practica: [
        'Escoge una decisión pendiente y escríbela como pregunta. Luego reescríbela de dos formas distintas.',
        'Si tu decisión es de "sí o no", escribe al menos dos opciones más.',
        'Pregúntale a una persona que haya pasado por algo parecido qué hizo y qué haría distinto.',
      ],
      pregunta: '¿En qué decisión pendiente me estoy limitando a "sí o no" cuando podría haber otras opciones?',
      nota: 'Abrir opciones no significa buscar infinitas. Con dos o tres alternativas reales ya se decide mucho mejor que con una. Pasado cierto punto, más opciones solo agregan trabajo (lo verás en la lección sobre cuánto analizar).',
      recordar: [
        ['¿Qué es el efecto marco?', 'Que la misma situación, presentada de otra forma, se elige distinto (Tversky y Kahneman, 1981).'],
        ['¿Qué encontró Nutt sobre las decisiones en organizaciones?', 'Que en la mayoría se consideraba una sola opción y muchas fallaban por cerrar el problema demasiado pronto.'],
        ['¿Qué hacer cuando te oyes decir "¿hago esto o no?"?', 'Detenerte y buscar al menos una opción más.'],
        ['Nombra dos formas de abrir opciones.', 'Imaginar que tus opciones actuales desaparecen, combinar opciones con "y", preguntar a quien ya lo vivió o hacer una prueba pequeña.'],
      ],
      tarjetas: [
        ['Efecto marco', 'La forma de presentar un problema cambia lo que elegimos. Reescríbelo de varias formas antes de decidir.'],
        ['La trampa del "sí o no"', 'Decidir entre hacer algo o no hacerlo oculta otras opciones. Busca al menos una alternativa más.'],
        ['¿Y si no pudiera hacer ninguna de estas opciones?', 'Pregunta para obligarte a inventar alternativas nuevas.'],
      ],
    }),
    l('Qué te importa: criterios y valores', 11, {
      idea: 'Una decisión es buena para ti si te acerca a lo que te importa. Escribir tus criterios antes de comparar opciones evita que la opción más llamativa decida por ti.',
      bloques: [
        ['Empezar por los valores', [
          'Ralph Keeney (1992) propuso pensar primero en lo que quieres lograr y después en las opciones, no al revés.',
          'Si empiezas por las opciones, comparas lo que te ofrecen (salario, marca, precio) y olvidas lo que no está en la oferta (tiempo con la familia, salud, aprender).',
          'Pregúntate: "Si esto sale perfecto, ¿qué tendría en un año?". Las respuestas son tus criterios.',
        ]],
        ['El método PrOACT', [
          'Hammond, Keeney y Raiffa (1999) resumen una decisión en cinco pasos: Problema, Objetivos, Alternativas, Consecuencias y Compensaciones (Tradeoffs en inglés).',
          'Las compensaciones son la parte difícil: casi nunca una opción gana en todo. Hay que decidir cuánto de una cosa das por otra.',
          'Escribirlas en voz alta ("gano 800 mil más, pero pierdo dos horas diarias de transporte") hace visible el precio real.',
        ]],
        ['Una tabla sencilla', [
          'Columnas: las opciones. Filas: tus criterios (4 a 6).',
          'Dale a cada criterio un peso del 1 al 5 según qué tanto te importa, y califica cada opción del 1 al 5 en cada criterio.',
          'Multiplica, suma y mira el resultado. No obedezcas el número a ciegas: si la ganadora te deja incómodo, esa incomodidad suele señalar un criterio que no escribiste.',
        ]],
      ],
      ejemplos: [
        'Dos ofertas de trabajo: una en Bogotá con mejor sueldo y otra en tu ciudad con menos plata. Criterios: plata, cercanía a la familia, aprendizaje, tiempo de transporte, estabilidad. Con pesos y calificaciones, la que paga menos puede ganar si la familia y el tiempo pesan mucho para ti.',
        'Escoger gimnasio: el más barato queda a 40 minutos y el otro a 5. Si el criterio "que efectivamente vaya" pesa 5, la cercanía vale más que la diferencia de precio.',
      ],
      practica: [
        'Para una decisión pendiente, escribe 4 a 6 criterios y ponle un peso del 1 al 5 a cada uno.',
        'Arma la tabla con al menos dos opciones y calcúlala.',
        'Escribe una compensación clara en una frase: "gano esto, pero pierdo esto otro".',
      ],
      pregunta: '¿Qué criterio importante para mí suele quedar por fuera cuando comparo opciones?',
      nota: 'La tabla con pesos no es una fórmula mágica: los pesos y las calificaciones son tus juicios, así que el número refleja lo que pusiste. Su valor está en obligarte a hacer explícito lo que te importa y en mostrar dónde están las compensaciones.',
      recordar: [
        ['¿Qué propone el pensamiento centrado en valores de Keeney?', 'Pensar primero en lo que quieres lograr y después en las opciones.'],
        ['¿Qué significan las letras de PrOACT?', 'Problema, Objetivos, Alternativas, Consecuencias y Compensaciones.'],
        ['¿Cómo se arma la tabla de criterios con pesos?', 'Opciones en columnas, criterios con un peso del 1 al 5, calificar cada opción, multiplicar y sumar.'],
        ['¿Qué significa si la opción ganadora te deja incómodo?', 'Que probablemente hay un criterio importante que no escribiste.'],
      ],
      tarjetas: [
        ['PrOACT (Hammond, Keeney y Raiffa)', 'Problema, Objetivos, Alternativas, Consecuencias y Compensaciones: los cinco pasos de una decisión.'],
        ['Pensar centrado en valores', 'Primero lo que te importa, después las opciones: así no decide solo lo que trae la oferta.'],
        ['Tabla de criterios con pesos', 'Criterios con un peso del 1 al 5, calificar cada opción, multiplicar y sumar. Sirve para ver las compensaciones, no para obedecer el número.'],
      ],
    }),
  ],
};

const INCERTIDUMBRE = {
  titulo: 'Decidir con incertidumbre',
  objetivo: 'Pensar en probabilidades en vez de certezas, comparar opciones por su valor esperado y su riesgo, y ajustar cuánto analizas según lo que está en juego.',
  fuentes: [
    ['Kahneman, D. y Tversky, A. (1973). On the psychology of prediction. Psychological Review, 80(4), 237-251.', 'Ignoramos las tasas base y nos dejamos llevar por lo que parece típico.'],
    ['Tetlock, P. E. y Gardner, D. (2015). Superforecasting: The art and science of prediction. Crown.', 'Cómo pronostican quienes mejor lo hacen: probabilidades, partir de la tasa base y actualizar.'],
    ['Mellers, B. et al. (2014). Psychological strategies for winning a geopolitical forecasting tournament. Psychological Science, 25(5), 1106-1115.', 'El entrenamiento en probabilidades y el trabajo en equipo mejoran los pronósticos.'],
    ['Gigerenzer, G. (2014). Risk Savvy: How to make good decisions. Viking.', 'Entender riesgos con frecuencias naturales ("3 de cada 100") en vez de porcentajes confusos.'],
    ['Kahneman, D. y Tversky, A. (1979). Prospect theory: An analysis of decision under risk. Econometrica, 47(2), 263-291.', 'La teoría prospectiva: las pérdidas pesan más que las ganancias equivalentes.'],
    ['Gal, D. y Rucker, D. D. (2018). The loss of loss aversion: Will it loom larger than its gain? Journal of Consumer Psychology, 28(3), 497-516.', 'Una crítica a la aversión a la pérdida como regla general.'],
    ['Simon, H. A. (1955). A behavioral model of rational choice. The Quarterly Journal of Economics, 69(1), 99-118.', 'Racionalidad limitada y la idea de buscar lo "suficientemente bueno".'],
    ['Schwartz, B., Ward, A., Monterosso, J., Lyubomirsky, S., White, K. y Lehman, D. R. (2002). Maximizing versus satisficing: Happiness is a matter of choice. Journal of Personality and Social Psychology, 83(5), 1178-1197.', 'Quienes buscan siempre lo mejor tienden a quedar menos satisfechos.'],
    ['Iyengar, S. S. y Lepper, M. R. (2000). When choice is demotivating: Can one desire too much of a good thing? Journal of Personality and Social Psychology, 79(6), 995-1006.', 'El estudio de las mermeladas sobre el exceso de opciones.'],
    ['Scheibehenne, B., Greifeneder, R. y Todd, P. M. (2010). Can there ever be too many options? A meta-analytic review of choice overload. Journal of Consumer Research, 37(3), 409-425.', 'En promedio, el efecto del exceso de opciones es cercano a cero: depende de las condiciones.'],
    ['Bezos, J. (2016). 2015 Letter to Shareholders. Amazon.', 'Decisiones tipo 1 (difíciles de revertir) y tipo 2 (reversibles).'],
  ],
  lecciones: [
    l('Pensar en probabilidades', 10, {
      idea: 'Casi nada es seguro ni imposible. Cambiar el "va a pasar" o "no va a pasar" por un "creo que hay 7 de 10 posibilidades" te hace decidir mejor y aprender de lo que pasa.',
      bloques: [
        ['De certezas a probabilidades', [
          'Decir "seguro que me dan el crédito" te prepara para un solo escenario. Decir "creo que 70 %" te recuerda preparar un plan para el otro 30 %.',
          'Tetlock y Gardner (2015) estudiaron a los "superpronosticadores": personas comunes que pronosticaban eventos mundiales mejor que muchos expertos.',
          'Lo que hacían distinto: hablar en probabilidades precisas, partir de datos generales y ajustar poco a poco con cada noticia nueva.',
        ]],
        ['Empezar por la tasa base', [
          'La tasa base es qué tan seguido pasa algo en general: ¿cuántos negocios como el tuyo siguen abiertos a los tres años?',
          'Kahneman y Tversky (1973) mostraron que tendemos a ignorarla y a juzgar por lo que "se parece" a un caso típico.',
          'Primero pregunta "¿qué tan seguido le sale bien esto a la gente en general?" y después ajusta por lo particular de tu caso.',
          'Ese ajuste debe ser moderado: casi todos creemos que nuestro caso es la excepción.',
        ]],
        ['Frecuencias que se entienden', [
          'Gerd Gigerenzer recomienda pensar en frecuencias: "3 de cada 100 personas" se entiende mejor que "3 %" o "riesgo relativo del 50 %".',
          '"Este medicamento reduce el riesgo a la mitad" puede significar pasar de 2 de cada 1.000 a 1 de cada 1.000. Pregunta siempre: ¿de cuánto a cuánto?',
          'Cuando no tengas datos, igual estima un rango y anótalo: así puedes comprobar después qué tan bien calibrado estás (lo viste en Metacognición).',
        ]],
      ],
      ejemplos: [
        'Quieres abrir una tienda de ropa en el barrio. Antes de pensar en lo bueno que es tu local, averigua qué pasa en general con negocios parecidos en sus primeros años (la Cámara de Comercio o personas del gremio te pueden orientar). Esa es tu tasa base; luego ajusta por tu experiencia y tu plan.',
        'Antes de un partido dices "ganamos seguro". Si en cambio dices "60 % de ganar", tienes una cifra que puedes comprobar: si anotas tus pronósticos durante la temporada, sabrás si eres buen pronosticador o solo optimista.',
      ],
      practica: [
        'Escribe tres cosas que crees que van a pasar este mes y ponle a cada una una probabilidad (por ejemplo 60 % o 9 de 10).',
        'Para una decisión pendiente, busca la tasa base: ¿qué tan seguido le sale bien esto a la gente en general?',
        'La próxima vez que leas "reduce el riesgo a la mitad", busca o pregunta de cuánto a cuánto.',
      ],
      pregunta: '¿Sobre qué cosa de mi vida hablo como si fuera segura cuando en realidad es probable?',
      nota: 'Los porcentajes inventados pueden dar una falsa sensación de precisión. No se trata de adivinar con decimales, sino de reconocer grados de incertidumbre y comprobar después. Los superpronosticadores del estudio de Tetlock se destacaron en preguntas de corto plazo (meses); a muchos años, pronosticar sigue siendo muy difícil para todos.',
      recordar: [
        ['¿Por qué conviene hablar en probabilidades y no en certezas?', 'Porque te prepara para varios escenarios y te permite comprobar después qué tan bien pronosticas.'],
        ['¿Qué es la tasa base?', 'Qué tan seguido pasa algo en general, antes de mirar los detalles de tu caso.'],
        ['¿Qué hacían distinto los superpronosticadores de Tetlock?', 'Usaban probabilidades precisas, partían de datos generales y ajustaban poco a poco con información nueva.'],
        ['¿Qué pregunta hacer ante "reduce el riesgo a la mitad"?', '¿De cuánto a cuánto? (el riesgo absoluto).'],
      ],
      tarjetas: [
        ['Tasa base', 'Qué tan seguido pasa algo en general. Empieza por ahí y luego ajusta (poco) por tu caso.'],
        ['Superpronosticadores (Tetlock y Gardner, 2015)', 'Piensan en probabilidades, parten de la tasa base y actualizan poco a poco con cada dato nuevo.'],
        ['Frecuencias naturales (Gigerenzer)', '"3 de cada 100" se entiende mejor que porcentajes. Ante un riesgo relativo, pregunta de cuánto a cuánto.'],
      ],
    }),
    l('Valor esperado, riesgo y miedo a perder', 11, {
      idea: 'Para comparar opciones inciertas, multiplica lo que puedes ganar o perder por su probabilidad. Pero no basta con el promedio: también importa cuánto puedes perder y si lo aguantas.',
      bloques: [
        ['El valor esperado', [
          'Valor esperado = suma de (resultado × probabilidad) de cada escenario.',
          'Ejemplo: una apuesta paga 100.000 con 1 posibilidad en 10 y pierdes 20.000 en las otras 9. Valor esperado: 10.000 − 18.000 = −8.000 por jugada. Si la repites mucho, pierdes.',
          'Las loterías y las casas de apuestas están diseñadas para que el valor esperado del jugador sea negativo: así ganan ellas. Un golpe de suerte no cambia esa cuenta.',
        ]],
        ['El riesgo de ruina', [
          'El promedio no lo es todo: una opción con buen valor esperado pero con un escenario que te arruina no es aceptable.',
          'Pregunta siempre: "¿qué es lo peor que puede pasar y lo puedo aguantar?". Si la respuesta es no, busca otra opción o reduce la apuesta.',
          'Por eso se tiene un fondo de emergencia, se compra el SOAT y no se mete toda la plata en una sola inversión.',
        ]],
        ['Las pérdidas pesan más', [
          'La teoría prospectiva de Kahneman y Tversky (1979) describe que una pérdida suele dolernos más de lo que nos alegra una ganancia del mismo tamaño.',
          'Eso nos hace aferrarnos a lo que ya tenemos y evitar riesgos razonables, o al revés, arriesgar de más para "recuperar" lo perdido.',
          'Perseguir pérdidas es la trampa clásica del apostador: después de perder, sube la apuesta para recuperarse.',
          'Pregunta útil: "Si no tuviera esto hoy, ¿lo compraría al precio actual?". Sirve para acciones, carros, proyectos y hasta relaciones de negocio.',
        ]],
      ],
      ejemplos: [
        'Te ofrecen un "negocio" que promete duplicar tu plata en seis meses. Aunque te digan que la probabilidad de éxito es alta, el escenario malo es perder todo tu ahorro. Si no lo puedes perder, la decisión es no, por bueno que suene el promedio.',
        'Tienes una moto vieja que no paras de arreglar. Te cuesta venderla porque "ya le metiste mucha plata". La pregunta correcta es si hoy, con lo que vale y lo que va a costar mantenerla, la comprarías. La plata que ya gastaste no vuelve con ninguna de las dos opciones.',
      ],
      practica: [
        'Para una decisión con riesgo, escribe los escenarios (bueno, normal, malo) con una probabilidad aproximada y calcula el valor esperado.',
        'Escribe lo peor que puede pasar en esa decisión y responde: ¿lo aguanto?',
        'Busca algo que conservas solo porque ya invertiste en ello y hazte la pregunta: "¿lo compraría hoy?".',
      ],
      pregunta: '¿Dónde estoy arriesgando algo que no podría permitirme perder?',
      nota: 'Se repite que "las pérdidas duelen el doble que las ganancias". Esa cifra sale de ciertos experimentos con apuestas y varía mucho según la situación y la cantidad de dinero; algunos investigadores (Gal y Rucker, 2018) discuten que la aversión a la pérdida sea una regla general. Lo que sí está bien respaldado: solemos tratar distinto las pérdidas y las ganancias, y eso cambia nuestras decisiones. Si tienes problemas con las apuestas, busca ayuda profesional: es una adicción real y tratable.',
      recordar: [
        ['¿Cómo se calcula el valor esperado?', 'Sumando cada resultado posible multiplicado por su probabilidad.'],
        ['¿Por qué no basta con el valor esperado?', 'Porque una opción con buen promedio puede tener un escenario que te arruina; hay que ver si aguantas lo peor.'],
        ['¿Qué describe la teoría prospectiva sobre las pérdidas?', 'Que una pérdida suele pesar más que una ganancia del mismo tamaño.'],
        ['¿Qué pregunta ayuda a no aferrarse a lo que ya invertiste?', '"Si no lo tuviera hoy, ¿lo compraría al precio actual?"'],
      ],
      tarjetas: [
        ['Valor esperado', 'Suma de resultado × probabilidad de cada escenario. En loterías y apuestas es negativo para el jugador.'],
        ['Riesgo de ruina', 'Aunque el promedio sea bueno, si el peor escenario no lo puedes aguantar, no es buena opción.'],
        ['Perseguir pérdidas', 'Arriesgar más para recuperar lo perdido. La plata ya gastada no vuelve: decide por lo que viene.'],
      ],
    }),
    l('Cuánto analizar: reversible o no, y suficientemente bueno', 10, {
      idea: 'No todas las decisiones merecen el mismo esfuerzo. Las que se pueden deshacer se deciden rápido; las que no, despacio. Y muchas veces lo "suficientemente bueno" es mejor que buscar lo perfecto.',
      bloques: [
        ['Puertas de ida y vuelta', [
          'Jeff Bezos, en su carta a los accionistas de 2015, separó las decisiones en dos tipos: las que son como una puerta de una sola vía (difíciles de revertir) y las que son como una puerta de ida y vuelta.',
          'Las irreversibles (casarse, tener hijos, una deuda a 20 años, una cirugía) merecen tiempo, información y consejo.',
          'Las reversibles (probar un horario, una rutina de gym, una marca de café) se deciden rápido: si no funciona, se cambia.',
          'Error común: tratar las reversibles como si fueran irreversibles y quedarse días pensando en algo que se puede probar mañana.',
        ]],
        ['Suficientemente bueno', [
          'Herbert Simon (1955) explicó que no podemos analizar todas las opciones: tenemos tiempo, información y atención limitados.',
          'Propuso buscar lo "suficientemente bueno": definir un mínimo aceptable y elegir la primera opción que lo cumpla.',
          'Schwartz y su equipo (2002) encontraron que las personas que siempre buscan lo mejor (maximizadoras) tienden a sentirse menos satisfechas con lo que eligen que las que buscan lo suficientemente bueno.',
        ]],
        ['Ajusta el esfuerzo', [
          'Pregunta: ¿qué tan grave es equivocarme? ¿Se puede deshacer? ¿Cuánto cuesta esperar?',
          'Para decisiones pequeñas, pon un límite de tiempo: "en 10 minutos escojo".',
          'Para decisiones grandes, pon una fecha: analizar sin fecha se vuelve aplazar.',
          'A veces no decidir también es decidir: dejar pasar la oferta o seguir igual tiene consecuencias.',
        ]],
      ],
      ejemplos: [
        'Llevas dos semanas comparando audífonos y leyendo reseñas para ahorrarte 30.000 pesos. Es una decisión reversible y pequeña: define lo que necesitas (precio máximo, cancelación de ruido) y compra los primeros que cumplan.',
        'Te ofrecen un crédito hipotecario a 20 años. Es una puerta de una sola vía: vale la pena comparar bancos, leer la letra pequeña, simular la cuota en 💰 Finanzas y consultar con alguien que sepa antes de firmar.',
      ],
      practica: [
        'Haz una lista de tus decisiones pendientes y marca cada una como "ida y vuelta" o "una sola vía".',
        'Toma hoy una de las de ida y vuelta, en menos de 10 minutos.',
        'Para una de una sola vía, ponle una fecha límite para decidir y escribe qué información te falta.',
      ],
      pregunta: '¿Qué decisión pequeña estoy tratando como si fuera irreversible?',
      nota: 'El famoso estudio de las mermeladas (Iyengar y Lepper, 2000) encontró que con 24 sabores menos gente compraba que con 6, y se volvió la prueba de que "más opciones paralizan". Pero un metaanálisis (Scheibehenne y otros, 2010) encontró que, en promedio, el efecto es cercano a cero: aparece solo en ciertas condiciones (opciones difíciles de comparar, cuando no sabes lo que quieres). La idea útil se mantiene: define tus criterios antes de ver las opciones.',
      recordar: [
        ['¿Qué son las decisiones de "una sola vía" y las de "ida y vuelta"?', 'Las primeras son difíciles de revertir y merecen tiempo; las segundas se pueden deshacer y se deciden rápido.'],
        ['¿Qué propuso Herbert Simon con lo "suficientemente bueno"?', 'Definir un mínimo aceptable y elegir la primera opción que lo cumpla, porque no se puede analizar todo.'],
        ['¿Qué encontraron Schwartz y su equipo sobre los maximizadores?', 'Que tienden a sentirse menos satisfechos con lo que eligen que quienes buscan lo suficientemente bueno.'],
        ['¿Qué tres preguntas ayudan a ajustar el esfuerzo de una decisión?', '¿Qué tan grave es equivocarme? ¿Se puede deshacer? ¿Cuánto cuesta esperar?'],
      ],
      tarjetas: [
        ['Puertas de una sola vía vs. de ida y vuelta', 'Lo irreversible se decide despacio y con información; lo reversible, rápido: si no sirve, se cambia.'],
        ['Suficientemente bueno (Simon, 1955)', 'Define el mínimo que necesitas y elige la primera opción que lo cumpla.'],
        ['El estudio de las mermeladas, con matiz', 'Más opciones no siempre paralizan: en promedio el efecto es casi cero. Ayuda definir los criterios antes de ver las opciones.'],
      ],
    }),
  ],
};

const PERSONA = {
  titulo: 'La persona que decide',
  objetivo: 'Reconocer cuándo tu estado (emociones, cansancio, prisa) te está empujando, saber cuándo confiar en tu intuición, decidir mejor con otros y aprender de tus decisiones con un diario.',
  fuentes: [
    ['Lerner, J. S., Li, Y., Valdesolo, P. y Kassam, K. S. (2015). Emotion and decision making. Annual Review of Psychology, 66, 799-823.', 'Revisión de cómo las emociones cambian lo que decidimos.'],
    ['Loewenstein, G. (2005). Hot-cold empathy gaps and medical decision making. Health Psychology, 24(4, supl.), S49-S56.', 'En calma subestimamos cómo vamos a decidir con hambre, rabia o deseo, y al revés.'],
    ['Danziger, S., Levav, J. y Avnaim-Pesso, L. (2011). Extraneous factors in judicial decisions. Proceedings of the National Academy of Sciences, 108(17), 6889-6892.', 'El estudio de los jueces antes y después del almuerzo.'],
    ['Weinshall-Margel, K. y Shapard, J. (2011). Overlooked factors in the analysis of parole decisions. Proceedings of the National Academy of Sciences, 108(42), E833.', 'La crítica al estudio de los jueces: el orden de los casos no era al azar.'],
    ['Hagger, M. S. et al. (2016). A multilab preregistered replication of the ego-depletion effect. Perspectives on Psychological Science, 11(4), 546-573.', 'La gran réplica que no encontró el "agotamiento de la fuerza de voluntad".'],
    ['Welch, S. (2009). 10-10-10: A life-transforming idea. Scribner.', 'La regla de pensar en 10 minutos, 10 meses y 10 años.'],
    ['Kahneman, D. y Klein, G. (2009). Conditions for intuitive expertise: A failure to disagree. American Psychologist, 64(6), 515-526.', 'Cuándo se puede confiar en la intuición de un experto.'],
    ['Klein, G. (1998). Sources of Power: How people make decisions. MIT Press.', 'Cómo deciden bomberos, enfermeras y militares bajo presión.'],
    ['Dijksterhuis, A., Bos, M. W., Nordgren, L. F. y van Baaren, R. B. (2006). On making the right choice: The deliberation-without-attention effect. Science, 311(5763), 1005-1007.', 'El estudio que dijo que "pensar sin pensar" decide mejor.'],
    ['Nieuwenstein, M. R. et al. (2015). On making the right choice: A meta-analysis and large-scale replication attempt of the unconscious thought advantage. Judgment and Decision Making, 10(1), 1-17.', 'La réplica grande que no encontró esa ventaja.'],
    ['Janis, I. L. (1972). Victims of Groupthink. Houghton Mifflin.', 'El pensamiento de grupo: cuando el deseo de acuerdo apaga la crítica.'],
    ['Sunstein, C. R. y Hastie, R. (2015). Wiser: Getting beyond groupthink to make groups smarter. Harvard Business Review Press.', 'Cómo hacer que un grupo decida mejor que sus miembros por separado.'],
    ['Galton, F. (1907). Vox populi. Nature, 75, 450-451.', 'La estimación del medio entre cientos de apuestas independientes sobre el peso de un buey quedó muy cerca del real.'],
  ],
  lecciones: [
    l('Emociones, cansancio y prisa', 10, {
      idea: 'Tu estado del momento cambia lo que decides, y desde ese estado no lo notas. Las decisiones importantes se toman con la cabeza fría, o al menos sabiendo que no la tienes.',
      bloques: [
        ['Las emociones informan y empujan', [
          'Las emociones no son el enemigo: el miedo te avisa de un riesgo y la incomodidad puede señalar algo que no cuadra (Lerner y otros, 2015).',
          'El problema es cuando la emoción de un asunto se cuela en otro: la rabia por el trancón te hace contestar mal un correo del trabajo.',
          'La rabia suele hacernos más arriesgados y confiados; el miedo, más cautelosos. Ninguna de las dos mira la situación con calma.',
        ]],
        ['La brecha frío-caliente', [
          'George Loewenstein describe que, estando tranquilos, subestimamos cuánto nos van a mover el hambre, la rabia o el deseo; y estando "calientes", no imaginamos cómo pensaremos después.',
          'Por eso prometes no pedir domicilio esta noche y a las 10 p. m., con hambre, lo pides.',
          'La solución es decidir con anticipación, en frío, y dejar reglas para el momento caliente: "si tengo rabia, no envío mensajes hasta el día siguiente".',
        ]],
        ['Reglas prácticas', [
          'HALT: no decidas nada importante con hambre, rabia, soledad o cansancio (Hungry, Angry, Lonely, Tired en inglés).',
          'Regla 10-10-10 (Suzy Welch): ¿cómo me voy a sentir con esto en 10 minutos, en 10 meses y en 10 años?',
          'Si te presionan para decidir ya ("la oferta es solo hoy"), desconfía: la prisa es una técnica de venta y de estafa. Lo que es bueno hoy suele seguir siendo bueno mañana.',
          'Duerme sobre las decisiones grandes: no porque el sueño las resuelva solo, sino porque al otro día el estado emocional ya cambió.',
        ]],
      ],
      ejemplos: [
        'Después de una discusión fuerte con tu jefe, escribes la carta de renuncia. La regla en frío: la guardas como borrador y la relees en 48 horas. Si sigue teniendo sentido, la decisión no era solo la rabia.',
        'Un vendedor te dice que la moto tiene ese precio "solo hasta hoy" y que hay otro cliente interesado. Esa prisa es una señal para frenar: pide la oferta por escrito y decide mañana.',
      ],
      practica: [
        'Escribe una regla en frío para un momento caliente que se te repite (por ejemplo: "si estoy con rabia, no contesto mensajes hasta mañana").',
        'Antes de una decisión de hoy, revisa HALT: ¿hambre, rabia, soledad o cansancio?',
        'Aplica la regla 10-10-10 a una decisión pendiente y escribe las tres respuestas.',
      ],
      pregunta: '¿Qué decisión de la que me arrepiento tomé con hambre, rabia, soledad o cansancio?',
      nota: 'Es famoso el estudio de jueces israelíes que daban más libertades condicionales después de comer (Danziger y otros, 2011), citado como prueba de la "fatiga de decisión". Una crítica mostró que el orden de los casos no era al azar (los presos sin abogado solían ir al final de cada sesión), lo que explicaría buena parte del efecto. Y la idea de que la fuerza de voluntad se "gasta" como un tanque no se replicó en un estudio grande con muchos laboratorios (Hagger y otros, 2016). Lo que sí es sensato: el sueño y el hambre afectan cómo te sientes y cómo decides, así que lo importante, mejor descansado. Si las emociones te desbordan con frecuencia, habla con un psicólogo.',
      recordar: [
        ['¿Qué es la brecha frío-caliente?', 'Que en calma subestimamos cuánto nos van a mover el hambre, la rabia o el deseo, y estando "calientes" no imaginamos cómo pensaremos después.'],
        ['¿Qué significa HALT?', 'No decidir nada importante con hambre, rabia, soledad o cansancio.'],
        ['¿En qué consiste la regla 10-10-10?', 'Preguntar cómo te vas a sentir con la decisión en 10 minutos, 10 meses y 10 años.'],
        ['¿Qué hacer cuando te presionan para decidir ya?', 'Desconfiar, pedir la información por escrito y decidir después: la prisa es una técnica de venta y de estafa.'],
      ],
      tarjetas: [
        ['Brecha frío-caliente (Loewenstein)', 'En calma no anticipas cómo decidirás con hambre o rabia. Decide en frío y deja reglas para el momento caliente.'],
        ['HALT', 'No decidas nada importante con hambre (Hungry), rabia (Angry), soledad (Lonely) o cansancio (Tired).'],
        ['Regla 10-10-10', '¿Cómo me sentiré con esto en 10 minutos, 10 meses y 10 años?'],
      ],
    }),
    l('Intuición: cuándo confiar en la corazonada', 10, {
      idea: 'La intuición es reconocer patrones que aprendiste con la experiencia. Es confiable donde hubo mucha práctica con retroalimentación clara, y poco confiable en todo lo demás.',
      bloques: [
        ['Qué es la intuición', [
          'Gary Klein estudió a bomberos con experiencia: decidían en segundos sin comparar opciones, porque reconocían la situación por lo que habían visto antes.',
          'Esa "corazonada" no es magia: es memoria de muchos casos parecidos, comprimida en una sensación.',
          'Un mecánico que oye un ruido y sabe qué es, o un arquero que adivina para dónde va el penal, usan este tipo de intuición.',
        ]],
        ['Cuándo sí y cuándo no', [
          'Kahneman, que desconfiaba de la intuición, y Klein, que la defendía, escribieron juntos un artículo (2009) y llegaron a un acuerdo.',
          'La intuición es confiable cuando se cumplen dos condiciones: el ambiente tiene regularidades (lo que pasa sigue patrones) y tuviste mucha práctica con retroalimentación rápida y clara.',
          'Ejemplos que cumplen: un enfermero de urgencias, un ajedrecista, un piloto. Ejemplos que no: pronosticar la bolsa, adivinar si un negocio nuevo va a funcionar o juzgar a alguien en una entrevista de 10 minutos.',
          'Sentirse muy seguro no indica que la intuición sea buena: la confianza aparece igual en los dos casos.',
        ]],
        ['Cómo usarla bien', [
          'Pregúntate: "¿he hecho esto muchas veces y he visto rápido si acerté?". Si sí, la corazonada vale. Si no, analiza.',
          'Úsala como un dato más: si el análisis dice una cosa y la intuición otra, investiga por qué.',
          'Cuando la uses, anótala: así puedes comprobar después qué tan seguido acierta en ese tipo de decisión.',
        ]],
      ],
      ejemplos: [
        'Llevas años jugando fútbol de mitad de cancha y "sientes" cuándo un pase va a ser interceptado. Esa intuición tiene miles de jugadas con retroalimentación inmediata detrás: confía en ella en la cancha.',
        'Te "late" que un apartamento en arriendo es buen negocio porque te gustó la vista. Nunca has arrendado varias veces ni has visto en qué terminan esas corazonadas: revisa el contrato, pregunta a los vecinos por los servicios y la administración, y compara precios.',
      ],
      practica: [
        'Escribe un área de tu vida donde tienes mucha práctica con retroalimentación clara (donde tu intuición vale) y otra donde no.',
        'Para una decisión pendiente, anota qué te dice la intuición antes de analizar y compáralo con el análisis.',
        'Empieza a anotar tus corazonadas en una decisión que se repite (por ejemplo, cómo te va a ir en un partido) y revisa en un mes cuántas acertaste.',
      ],
      pregunta: '¿En qué tema confío en mis corazonadas sin tener la experiencia que las respalde?',
      nota: 'Un estudio muy citado (Dijksterhuis y otros, 2006) dijo que para decisiones complejas era mejor distraerse y dejar que el "inconsciente" eligiera. Una réplica grande y un metaanálisis (Nieuwenstein y otros, 2015) no encontraron esa ventaja. "Dejarlo reposar" puede servir para calmarte o recordar algo que faltaba, pero no hay buena evidencia de que el inconsciente analice mejor que tú.',
      recordar: [
        ['¿Qué es la intuición según Klein?', 'Reconocer patrones aprendidos con la experiencia, comprimidos en una sensación.'],
        ['¿Cuáles son las dos condiciones para confiar en la intuición (Kahneman y Klein, 2009)?', 'Un ambiente con regularidades y mucha práctica con retroalimentación rápida y clara.'],
        ['¿Sentirse muy seguro indica que la intuición es buena?', 'No: la confianza aparece igual cuando la intuición es buena y cuando no.'],
        ['¿Qué pasó con el estudio de "pensar sin pensar" de Dijksterhuis?', 'Una réplica grande y un metaanálisis no encontraron la ventaja del pensamiento inconsciente.'],
      ],
      tarjetas: [
        ['Cuándo confiar en la intuición', 'Cuando el ambiente sigue patrones y tuviste mucha práctica con retroalimentación rápida y clara.'],
        ['Intuición = patrones', 'Una corazonada experta es memoria de muchos casos parecidos (Klein). Sin esos casos, es solo una sensación.'],
        ['La seguridad no es prueba', 'Sentirte muy seguro no dice si la intuición es buena: anota tus corazonadas y comprueba cuántas aciertan.'],
      ],
    }),
    l('Decidir con otros y aprender de tus decisiones', 12, {
      idea: 'Un grupo puede decidir mejor que una persona si cada uno piensa por su cuenta antes de hablar. Y la única forma de mejorar tus decisiones con el tiempo es registrarlas y revisarlas.',
      bloques: [
        ['La sabiduría y la locura del grupo', [
          'Francis Galton (1907) reunió cientos de apuestas sobre el peso de un buey en una feria: las estimaciones individuales variaban mucho, pero la del medio (la mediana) quedó muy cerca del peso real.',
          'Funciona cuando las opiniones son independientes: cada uno estima sin oír a los demás.',
          'Irving Janis (1972) describió el pensamiento de grupo: cuando el deseo de estar de acuerdo apaga las críticas y el grupo se equivoca con mucha seguridad.',
          'Sunstein y Hastie (2015) explican que los grupos a menudo amplifican los errores de sus miembros en vez de corregirlos, sobre todo si habla primero el jefe.',
        ]],
        ['Cómo decidir mejor en grupo', [
          'Que cada uno escriba su opinión antes de la reunión, y que el de más rango hable de último.',
          'Asignar a alguien el papel de "abogado del diablo" para que buscar fallas no sea personal.',
          'Hacer un premortem (lo viste en Metacognición): "imaginemos que esto fracasó dentro de un año, ¿por qué fue?".',
          'En familia sirve igual: que cada uno diga qué quiere antes de que el papá o la mamá den su opinión.',
        ]],
        ['El diario de decisiones', [
          'Para decisiones importantes, anota antes de saber el resultado: fecha, qué decidiste, qué opciones viste, qué esperas que pase (con probabilidad) y cómo te sientes.',
          'Revísalo meses después: así comparas lo que pensabas con lo que pasó, sin que tu memoria lo reescriba.',
          'Con el tiempo verás patrones: en qué tipo de decisiones aciertas, cuándo te pesan las emociones y qué te falta mirar.',
          'Puedes llevarlo en el diario de la app o en una nota del celular; lo importante es escribirlo antes del resultado.',
        ]],
      ],
      ejemplos: [
        'En la empresa hay que escoger un proveedor. En vez de que el gerente diga primero cuál le gusta, cada miembro del equipo envía por escrito su opción y sus razones. Aparecen dos riesgos que nadie habría dicho en voz alta delante del jefe.',
        'Hace seis meses anotaste en tu diario de decisiones: "Cambio de trabajo: 70 % de que me guste más; me preocupa el horario". Al releerlo ves que acertaste en el trabajo, pero subestimaste el transporte. La próxima vez lo pesarás más.',
      ],
      practica: [
        'Empieza tu diario de decisiones con una decisión pendiente: qué decides, qué opciones viste, qué esperas que pase y con qué probabilidad.',
        'En la próxima decisión de grupo (trabajo, familia, equipo), pide que cada uno diga o escriba su opinión antes de discutir.',
        'Ponte un recordatorio en 🔔 Recordatorios para revisar tu diario de decisiones dentro de 3 meses.',
      ],
      pregunta: '¿Qué decisión tomé en grupo en la que no dije lo que pensaba para no llevar la contraria?',
      nota: 'La "sabiduría de las multitudes" no significa que la mayoría tenga razón. Funciona con estimaciones independientes de algo que tiene respuesta (un peso, una fecha, una cifra), y falla cuando todos se influencian entre sí o comparten la misma fuente de información. Votar o promediar no reemplaza tener datos.',
      recordar: [
        ['¿Qué condición necesita la "sabiduría de las multitudes"?', 'Que las opiniones sean independientes: cada uno estima sin oír a los demás.'],
        ['¿Qué es el pensamiento de grupo según Janis?', 'Cuando el deseo de estar de acuerdo apaga las críticas y el grupo se equivoca con mucha seguridad.'],
        ['Nombra dos formas de decidir mejor en grupo.', 'Que cada uno escriba su opinión antes y el jefe hable de último; tener un abogado del diablo; hacer un premortem.'],
        ['¿Qué se anota en un diario de decisiones y cuándo?', 'Antes de saber el resultado: qué decidiste, qué opciones viste, qué esperas que pase (con probabilidad) y cómo te sientes.'],
      ],
      tarjetas: [
        ['Sabiduría de las multitudes (Galton, 1907)', 'Juntar muchas estimaciones independientes (la mediana o el promedio) suele dar un resultado muy preciso. Sin independencia, falla.'],
        ['Pensamiento de grupo (Janis)', 'El deseo de acuerdo apaga la crítica. Antídoto: opiniones por escrito antes, jefe de último, abogado del diablo.'],
        ['Diario de decisiones', 'Anota antes del resultado qué decidiste, por qué y qué esperas; revísalo meses después para aprender.'],
      ],
    }),
  ],
};

export default {
  id: 'toma-de-decisiones',
  nombre: 'Toma de decisiones',
  area: 'aprender',
  icono: '🧭',
  nivel: 'Intermedio',
  paraQue: 'Decidir con método cuando hay incertidumbre, prisa o emociones: plantear bien el problema, comparar opciones por lo que de verdad te importa y por su riesgo, y saber cuándo confiar en tu intuición. Te sirve para la plata, el trabajo, la salud y la familia, y para aprender de cada decisión en lugar de juzgarla solo por cómo salió.',
  modulos: [PENSAR, INCERTIDUMBRE, PERSONA],
  proyecto: {
    titulo: 'Tu próxima decisión importante, con método',
    intro: 'En 2 a 3 semanas vas a tomar una decisión real que tengas pendiente (trabajo, plata, estudio, vivienda) aplicando lo del curso, y vas a dejar todo escrito para revisarlo después.',
    pasos: [
      'Escoge una decisión real y pendiente que sea importante para ti, y escríbela de tres formas distintas.',
      'Escribe tus criterios con su peso y abre al menos tres opciones (ninguna de "sí o no").',
      'Busca la tasa base: qué tan seguido le sale bien esto a la gente en general, y pregúntale a alguien que ya lo vivió.',
      'Para cada opción, escribe el escenario bueno, normal y malo con su probabilidad, y responde si aguantas el peor.',
      'Marca si es de una sola vía o de ida y vuelta, y ponle fecha límite según eso.',
      'Arma la tabla de criterios con pesos, haz un premortem de la opción ganadora y revisa HALT antes de decidir.',
      'Decide y anótalo en tu diario de decisiones: qué elegiste, por qué, qué esperas que pase y con qué probabilidad.',
      'Pon un recordatorio a 3 y 6 meses para revisar la decisión por el método, no solo por el resultado.',
    ],
  },
};
