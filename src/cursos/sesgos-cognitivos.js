// Sesgos cognitivos: los atajos de la mente que nos hacen equivocarnos y cómo frenarlos. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const ATAJOS = {
  titulo: 'Los atajos de la mente',
  objetivo: 'Entender qué son las heurísticas y los sesgos, y reconocer tres de los atajos más comunes: la disponibilidad, la representatividad y el anclaje.',
  fuentes: [
    ['Tversky, A. y Kahneman, D. (1974). Judgment under uncertainty: Heuristics and biases. Science, 185(4157), 1124-1131.', 'El artículo que fundó el estudio de las heurísticas y los sesgos.'],
    ['Kahneman, D. (2011). Pensar rápido, pensar despacio. (Ed. en español: Debate, 2012).', 'Los dos modos de pensar y sus errores típicos, para todo público.'],
    ['Gigerenzer, G. y Gaissmaier, W. (2011). Heuristic decision making. Annual Review of Psychology, 62, 451-482.', 'Las heurísticas también aciertan: cuándo un atajo es inteligente.'],
    ['Tversky, A. y Kahneman, D. (1973). Availability: A heuristic for judging frequency and probability. Cognitive Psychology, 5(2), 207-232.', 'La heurística de disponibilidad.'],
    ['Lichtenstein, S., Slovic, P., Fischhoff, B., Layman, M. y Combs, B. (1978). Judged frequency of lethal events. Journal of Experimental Psychology: Human Learning and Memory, 4(6), 551-578.', 'Sobreestimamos los riesgos llamativos y subestimamos los comunes.'],
    ['Tversky, A. y Kahneman, D. (1983). Extensional versus intuitive reasoning: The conjunction fallacy in probability judgment. Psychological Review, 90(4), 293-315.', 'El problema de Linda y la falacia de la conjunción.'],
    ['Northcraft, G. B. y Neale, M. A. (1987). Experts, amateurs, and real estate: An anchoring-and-adjustment perspective on property pricing decisions. Organizational Behavior and Human Decision Processes, 39(1), 84-97.', 'El anclaje afecta incluso a agentes inmobiliarios con experiencia.'],
    ['Klein, R. A. et al. (2014). Investigating variation in replicability: A "many labs" replication project. Social Psychology, 45(3), 142-152.', 'Una réplica en muchos laboratorios: el anclaje se sostuvo con fuerza.'],
  ],
  lecciones: [
    l('Qué es un sesgo (y por qué la mente toma atajos)', 10, {
      idea: 'La mente usa atajos (heurísticas) para decidir rápido con poca información. Casi siempre funcionan, pero en ciertas situaciones fallan de forma predecible: esos errores sistemáticos son los sesgos.',
      bloques: [
        ['Atajos que casi siempre sirven', [
          'Amos Tversky y Daniel Kahneman (1974) mostraron que, para juzgar probabilidades, no calculamos: usamos reglas rápidas.',
          'Esas reglas ahorran tiempo y energía. Sin ellas, cada decisión pequeña (qué fila del banco tomar, si cruzar la calle) sería agotadora.',
          'El problema es que fallan siempre en la misma dirección en ciertas situaciones. Por eso se llaman sesgos: no son errores al azar, son errores con tendencia.',
        ]],
        ['Rápido y despacio', [
          'Kahneman (2011) popularizó la idea de dos modos de pensar: uno rápido, automático e intuitivo, y otro lento, deliberado y que cuesta esfuerzo.',
          'La mayoría de los sesgos aparecen cuando el modo rápido responde y el lento no revisa.',
          'Es una metáfora útil, no dos partes separadas del cerebro: en la realidad ambos modos se mezclan.',
        ]],
        ['Los atajos también aciertan', [
          'Gerd Gigerenzer y Wolfgang Gaissmaier (2011) muestran que, en ambientes inciertos, una heurística simple a veces predice mejor que un cálculo complejo.',
          'Ejemplo: elegir la marca que reconoces puede ser un buen atajo si las marcas conocidas suelen ser las más confiables.',
          'La pregunta no es "¿uso atajos?" (siempre los usas), sino "¿este atajo sirve en esta situación?".',
        ]],
      ],
      ejemplos: [
        'En el supermercado escoges el aceite de la marca que siempre ves en televisión, sin comparar precios ni etiquetas. Ese atajo te ahorra tiempo; casi nunca es grave. El mismo atajo para escoger un fondo de inversión sí puede salir caro.',
        'Un tendero del barrio "huele" cuándo un cliente nuevo no le va a pagar el fiado. A veces acierta por experiencia; otras veces su atajo se basa en la apariencia y termina siendo injusto.',
      ],
      practica: [
        'Anota hoy tres decisiones rápidas que tomaste sin pensar mucho y si el atajo te sirvió.',
        'Escoge una decisión importante de esta semana y escribe qué atajo estás tentado a usar.',
        'Cuando sientas mucha seguridad inmediata en algo importante, pregúntate: "¿Esto lo pensé o lo sentí?".',
      ],
      pregunta: '¿En qué decisiones importantes de mi vida me dejo llevar por el primer impulso sin revisarlo?',
      nota: 'Hay listas en internet con más de 180 "sesgos cognitivos". Muchos se parecen entre sí, algunos tienen poca evidencia y otros son nombres distintos para lo mismo. Más útil que memorizar una lista larga es entender unos pocos bien documentados y las situaciones donde aparecen. La idea de los "dos sistemas" es una metáfora: el mismo Kahneman la presentó como una forma de hablar, no como dos estructuras del cerebro.',
      recordar: [
        ['¿Qué es una heurística?', 'Un atajo mental para decidir rápido con poca información.'],
        ['¿Qué diferencia un sesgo de un error cualquiera?', 'Que el sesgo es sistemático: falla siempre en la misma dirección en ciertas situaciones.'],
        ['¿Cuáles son los dos modos de pensar según Kahneman?', 'Uno rápido, automático e intuitivo, y otro lento, deliberado y que cuesta esfuerzo.'],
        ['¿Qué señalan Gigerenzer y Gaissmaier sobre las heurísticas?', 'Que también aciertan, y que en ambientes inciertos a veces predicen mejor que cálculos complejos.'],
      ],
      tarjetas: [
        ['Heurística vs. sesgo', 'La heurística es el atajo; el sesgo es el error sistemático que el atajo produce en ciertas situaciones.'],
        ['Rápido y despacio (Kahneman)', 'Los sesgos aparecen cuando el modo rápido responde y el lento no revisa. Es una metáfora, no dos cerebros.'],
        ['Pregunta clave', 'No "¿uso atajos?", sino "¿este atajo sirve en esta situación?".'],
      ],
    }),
    l('Disponibilidad y representatividad', 11, {
      idea: 'Juzgamos qué tan probable es algo por qué tan fácil lo recordamos (disponibilidad) y por qué tanto se parece a nuestra idea típica (representatividad). Los dos atajos engañan cuando lo llamativo no es lo frecuente.',
      bloques: [
        ['Disponibilidad', [
          'Tversky y Kahneman (1973) mostraron que juzgamos la frecuencia de algo por la facilidad con que nos vienen ejemplos a la mente.',
          'Lichtenstein y otros (1978) encontraron que la gente sobreestima las muertes llamativas (accidentes aéreos, homicidios) y subestima las comunes y silenciosas (enfermedades del corazón, diabetes).',
          'Lo que sale en noticias y redes se vuelve "disponible" y parece más común de lo que es.',
        ]],
        ['Representatividad', [
          'Juzgamos si algo pertenece a una categoría por qué tanto se parece al ejemplo típico, ignorando qué tan común es esa categoría.',
          'En el famoso "problema de Linda" (Tversky y Kahneman, 1983), la descripción de una mujer activista hacía que mucha gente juzgara más probable "cajera y feminista" que solo "cajera".',
          'Eso es imposible: dos condiciones juntas nunca pueden ser más probables que una sola. Es la falacia de la conjunción.',
          'Una historia con más detalles suena más creíble, aunque cada detalle la hace menos probable.',
        ]],
        ['Cómo corregirlos', [
          'Pregunta por los datos, no por los ejemplos: "¿Qué tan seguido pasa esto, según las cifras?".',
          'Desconfía de lo que recuerdas con facilidad por ser reciente, llamativo o emocional.',
          'Ante una historia muy detallada y convincente, pregúntate si cada detalle tiene respaldo.',
        ]],
      ],
      ejemplos: [
        'Después de ver en las noticias un accidente de avión, te da miedo volar y prefieres hacer el viaje Bogotá–Cartagena por carretera. Por kilómetro, la carretera es mucho más peligrosa; el avión solo es más "disponible" en tu memoria.',
        'Un vendedor de un "negocio" te cuenta una historia larga y detallada de cómo un primo suyo se volvió rico. Cada detalle la hace más vívida, pero no más probable. Lo que importa es cuántos de los que entraron ganaron.',
      ],
      practica: [
        'Escribe algo que te dé miedo y busca un dato de qué tan seguido pasa en realidad en Colombia.',
        'Cuando hoy oigas "eso pasa mucho", pregúntate de dónde viene esa impresión: ¿datos o casos que recuerdas?',
        'Toma una historia convincente que te hayan contado y separa los detalles que tienen respaldo de los que no.',
      ],
      pregunta: '¿Qué riesgo de mi vida exagero porque lo veo en noticias, y cuál ignoro porque es silencioso?',
      nota: 'Algunos investigadores (como Gigerenzer) critican la interpretación del problema de Linda: la palabra "probable" en el lenguaje cotidiano no siempre significa probabilidad matemática, y cuando la pregunta se plantea con frecuencias ("de 100 mujeres como Linda, ¿cuántas…?") el error baja mucho. La lección práctica se mantiene: pensar en frecuencias ayuda a no dejarse llevar por lo que "suena" típico.',
      recordar: [
        ['¿Qué es la heurística de disponibilidad?', 'Juzgar qué tan frecuente es algo por la facilidad con que recordamos ejemplos.'],
        ['¿Qué encontraron Lichtenstein y otros sobre las causas de muerte?', 'Que sobreestimamos las llamativas y subestimamos las comunes y silenciosas.'],
        ['¿Qué es la falacia de la conjunción?', 'Creer que dos condiciones juntas son más probables que una sola, lo cual es imposible.'],
        ['¿Cómo ayuda pensar en frecuencias?', 'Reduce los errores de representatividad: "de 100 casos como este, ¿cuántos…?".'],
      ],
      tarjetas: [
        ['Disponibilidad', 'Lo que recuerdas fácil (reciente, llamativo) parece más frecuente de lo que es. Pregunta por los datos.'],
        ['Representatividad', 'Juzgar por el parecido con lo típico e ignorar qué tan común es la categoría.'],
        ['Más detalles, menos probable', 'Una historia detallada suena más creíble, pero cada detalle la hace menos probable (falacia de la conjunción).'],
      ],
    }),
    l('El anclaje', 10, {
      idea: 'El primer número que oyes se te pega y arrastra tus estimaciones, aunque sea arbitrario. En negociaciones, precios y descuentos, quien pone la primera cifra suele llevar ventaja.',
      bloques: [
        ['Qué es', [
          'En un experimento de Tversky y Kahneman (1974), giraban una ruleta que caía en 10 o en 65, y luego preguntaban qué porcentaje de países africanos estaba en la ONU.',
          'Quienes vieron el número alto dieron estimaciones bastante más altas que quienes vieron el bajo, aunque sabían que la ruleta era al azar.',
          'Ese efecto se llama anclaje: partimos de un número y ajustamos muy poco desde ahí.',
        ]],
        ['Les pasa a los expertos', [
          'Northcraft y Neale (1987) dieron a agentes inmobiliarios la misma casa con distintos "precios de lista".',
          'Sus avalúos variaron según el precio de lista que vieron, y la mayoría no reconoció que ese número los había influido.',
          'Un proyecto de réplica en muchos laboratorios (Klein y otros, 2014) confirmó que el anclaje es de los efectos más sólidos de la psicología.',
        ]],
        ['Dónde aparece y cómo defenderte', [
          'El "antes 400.000, ahora 199.000" usa el precio tachado como ancla para que el precio nuevo parezca barato.',
          'En una negociación de sueldo o de un carro usado, la primera cifra pone el marco de toda la conversación.',
          'Defensa: antes de ver el precio, decide cuánto vale para ti o investiga precios de referencia; y si te ponen un ancla absurda, no negocies desde ahí: cámbiala.',
          'A tu favor: si sabes lo que vale tu trabajo, pon tú la primera cifra, razonable pero ambiciosa.',
        ]],
      ],
      ejemplos: [
        'Vas a comprar una moto usada y el vendedor pide 12 millones. Aunque la revistas de precios dicen que vale 9, terminas pagando 10,5 y sientes que negociaste bien. El 12 fue el ancla. Si hubieras dicho primero "por lo que vi en el mercado, vale 9", la conversación habría empezado en otro lugar.',
        'En la entrevista te preguntan cuánto quieres ganar. Si dices una cifra baja por miedo, esa se vuelve el ancla de toda la negociación. Investigar antes el rango del cargo te deja poner un ancla justa.',
      ],
      practica: [
        'Antes de tu próxima compra grande, escribe cuánto estás dispuesto a pagar antes de ver el precio.',
        'Busca hoy un precio "tachado" en una tienda o app y pregúntate si el producto vale lo que piden sin mirar el precio anterior.',
        'Investiga el rango de sueldo de tu cargo (o el precio de algo que vas a vender) para tener tu propia ancla.',
      ],
      pregunta: '¿En qué negociación o compra reciente me dejé llevar por la primera cifra que oí?',
      nota: 'El anclaje es de los sesgos más replicados, pero su fuerza varía: es mayor cuando no sabes del tema y menor cuando tienes buena información de referencia. Por eso la mejor defensa es investigar antes. Algunos estudios famosos de "anclaje" con números totalmente irrelevantes (como los últimos dígitos de la cédula) han dado resultados más débiles en réplicas que los de la ruleta original.',
      recordar: [
        ['¿Qué es el anclaje?', 'Que el primer número que oyes arrastra tus estimaciones, aunque sea arbitrario.'],
        ['¿Qué mostró el estudio de Northcraft y Neale?', 'Que el precio de lista influyó en los avalúos de agentes inmobiliarios con experiencia, sin que lo reconocieran.'],
        ['¿Qué tan sólido es el anclaje?', 'Es de los efectos más replicados de la psicología, más fuerte cuando no sabes del tema.'],
        ['¿Cómo defenderte del anclaje?', 'Decidir o investigar el valor antes de ver el precio, y no negociar desde un ancla absurda.'],
      ],
      tarjetas: [
        ['Anclaje', 'El primer número te arrastra y ajustas poco desde ahí, aunque sea arbitrario.'],
        ['El precio tachado', '"Antes 400.000, ahora 199.000" es un ancla para que parezca barato.'],
        ['Defensa contra el anclaje', 'Decide cuánto vale para ti antes de ver el precio, o pon tú la primera cifra con información.'],
      ],
    }),
  ],
};

const CREENCIAS = {
  titulo: 'Proteger lo que ya creemos',
  objetivo: 'Reconocer cómo buscamos y leemos la información para confirmar lo que ya pensamos, por qué vemos los sesgos de los demás pero no los propios, y cómo juzgamos mal a otras personas.',
  fuentes: [
    ['Nickerson, R. S. (1998). Confirmation bias: A ubiquitous phenomenon in many guises. Review of General Psychology, 2(2), 175-220.', 'Revisión clásica del sesgo de confirmación.'],
    ['Wason, P. C. (1960). On the failure to eliminate hypotheses in a conceptual task. Quarterly Journal of Experimental Psychology, 12(3), 129-140.', 'La tarea 2-4-6: buscamos casos que confirmen, no que refuten.'],
    ['Lord, C. G., Ross, L. y Lepper, M. R. (1979). Biased assimilation and attitude polarization: The effects of prior theories on subsequently considered evidence. Journal of Personality and Social Psychology, 37(11), 2098-2109.', 'La misma evidencia refuerza las posturas opuestas.'],
    ['Kunda, Z. (1990). The case for motivated reasoning. Psychological Bulletin, 108(3), 480-498.', 'Razonamos para llegar a la conclusión que queremos.'],
    ['Kahan, D. M., Peters, E., Dawson, E. C. y Slovic, P. (2017). Motivated numeracy and enlightened self-government. Behavioural Public Policy, 1(1), 54-86.', 'Ser bueno con los números no protege cuando el tema es político.'],
    ['Pronin, E., Lin, D. Y. y Ross, L. (2002). The bias blind spot: Perceptions of bias in self versus others. Personality and Social Psychology Bulletin, 28(3), 369-381.', 'El punto ciego: vemos sesgos en otros, no en nosotros.'],
    ['West, R. F., Meserve, R. J. y Stanovich, K. E. (2012). Cognitive sophistication does not attenuate the bias blind spot. Journal of Personality and Social Psychology, 103(3), 506-519.', 'Ser más inteligente no reduce el punto ciego.'],
    ['Jones, E. E. y Harris, V. A. (1967). The attribution of attitudes. Journal of Experimental Social Psychology, 3(1), 1-24.', 'El estudio clásico del error fundamental de atribución.'],
    ['Nisbett, R. E. y Wilson, T. D. (1977). The halo effect: Evidence for unconscious alteration of judgments. Journal of Personality and Social Psychology, 35(4), 250-256.', 'El efecto halo: una cualidad tiñe todo lo demás.'],
    ['Tajfel, H. (1970). Experiments in intergroup discrimination. Scientific American, 223(5), 96-102.', 'Favorecemos a "los nuestros" aunque el grupo sea arbitrario.'],
  ],
  lecciones: [
    l('El sesgo de confirmación', 10, {
      idea: 'Tendemos a buscar, recordar e interpretar la información que confirma lo que ya creemos, y a pasar por alto la que lo contradice. Es probablemente el sesgo más extendido.',
      bloques: [
        ['La tarea 2-4-6', [
          'Peter Wason (1960) les daba a las personas la serie "2-4-6" y les pedía descubrir la regla, proponiendo otras series.',
          'La mayoría probaba series que confirmaban su idea ("8-10-12", "20-22-24") y se convencía de "números pares de dos en dos".',
          'La regla era simplemente "números en orden ascendente". Para descubrirla había que probar series que pudieran refutar la idea propia, como "1-2-3".',
        ]],
        ['La misma evidencia, dos conclusiones', [
          'Lord, Ross y Lepper (1979) mostraron a personas a favor y en contra de la pena de muerte los mismos dos estudios, uno a favor y otro en contra.',
          'Cada grupo encontró convincente el estudio que le daba la razón y lleno de fallas el otro. Al final, ambos grupos quedaron más convencidos de su postura.',
          'Raymond Nickerson (1998) revisó cómo este sesgo aparece en la ciencia, la medicina, los juicios y la vida diaria.',
        ]],
        ['Cómo frenarlo', [
          'Pregunta: "¿Qué evidencia me haría cambiar de opinión?". Si no hay ninguna, no estás razonando, estás defendiendo.',
          'Busca activamente el mejor argumento del lado contrario, no el más débil.',
          'En redes sociales, sigue a algunas fuentes serias que piensen distinto: el algoritmo tiende a mostrarte lo que ya te gusta.',
        ]],
      ],
      ejemplos: [
        'Crees que tu compañero nuevo es flojo. Desde entonces notas cada vez que llega tarde, pero no registras los días en que se queda hasta tarde terminando. Tu idea parece confirmarse sola.',
        'Estás convencido de que un suplemento te sube la fuerza. Recuerdas los días buenos de gym después de tomarlo y olvidas los días buenos sin él y los malos con él. Llevar el registro en 🏋️ Gym te mostraría la foto completa.',
      ],
      practica: [
        'Escoge una creencia fuerte que tengas y escribe qué evidencia te haría cambiar de opinión.',
        'Busca hoy el mejor argumento en contra de esa creencia, escrito por alguien serio.',
        'Revisa a quién sigues en redes y agrega una fuente confiable que piense distinto a ti.',
      ],
      pregunta: '¿Qué creencia mía nunca he puesto a prueba porque solo busco lo que la confirma?',
      nota: 'El sesgo de confirmación no significa que la gente ignore toda la evidencia contraria: con evidencia fuerte y repetida, la gente sí cambia, aunque más despacio de lo que debería. Tampoco es siempre irracional: si una creencia está bien fundada, exigir más prueba para abandonarla tiene sentido. El problema es aplicar estándares distintos a la evidencia según si nos gusta o no.',
      recordar: [
        ['¿Qué es el sesgo de confirmación?', 'Buscar, recordar e interpretar la información que confirma lo que ya creemos.'],
        ['¿Qué mostró la tarea 2-4-6 de Wason?', 'Que la gente prueba casos que confirman su idea en lugar de casos que podrían refutarla.'],
        ['¿Qué encontraron Lord, Ross y Lepper?', 'Que la misma evidencia mixta hizo que ambos grupos opuestos se convencieran más de su postura.'],
        ['¿Qué pregunta ayuda a frenar este sesgo?', '"¿Qué evidencia me haría cambiar de opinión?"'],
      ],
      tarjetas: [
        ['Sesgo de confirmación', 'Buscamos y creemos lo que confirma lo que ya pensamos, y descartamos lo que lo contradice.'],
        ['La tarea 2-4-6 (Wason)', 'Para encontrar la verdad hay que probar casos que podrían refutar tu idea, no solo los que la confirman.'],
        ['Antídoto', '"¿Qué evidencia me haría cambiar de opinión?" y buscar el mejor argumento contrario.'],
      ],
    }),
    l('Razonamiento motivado y el punto ciego', 10, {
      idea: 'Cuando queremos llegar a una conclusión, nuestra inteligencia trabaja como abogado, no como juez. Y casi todos creemos ser menos sesgados que los demás: ese es el punto ciego.',
      bloques: [
        ['Razonar hacia donde queremos', [
          'Ziva Kunda (1990) describió el razonamiento motivado: cuando deseamos una conclusión, buscamos y evaluamos los argumentos para llegar a ella, aunque sentimos que estamos siendo objetivos.',
          'Exigimos más pruebas para lo que no nos gusta ("¿y quién financió ese estudio?") que para lo que sí.',
          'Kahan y otros (2017) encontraron que personas muy buenas con los números resolvían bien un problema de datos cuando el tema era neutral, pero se equivocaban más cuando el resultado contradecía su postura política.',
        ]],
        ['El punto ciego', [
          'Pronin, Lin y Ross (2002) encontraron que la gente se califica a sí misma como menos sesgada que el promedio.',
          'Vemos claramente los sesgos de los demás ("él opina eso porque es hincha de ese equipo"), pero los nuestros nos parecen "simplemente la realidad".',
          'West, Meserve y Stanovich (2012) mostraron que ser más inteligente no reduce el punto ciego; en algunos casos, lo aumenta un poco.',
        ]],
        ['Qué hacer con esto', [
          'Aplícate el mismo estándar: ¿aceptaría esta evidencia si apuntara en la dirección contraria?',
          'Nota cuándo tienes un interés en la conclusión (plata, orgullo, tu equipo, tu partido): ahí es donde más debes revisar.',
          'Pide a alguien que no tenga tu interés que revise tu razonamiento.',
        ]],
      ],
      ejemplos: [
        'Sale un estudio que dice que el café en exceso tiene riesgos y tú tomas cinco tintos al día. Inmediatamente buscas fallas en el estudio. Si hubiera dicho que el café es buenísimo, lo habrías compartido sin revisar nada.',
        'En una discusión sobre fútbol, ves clarísimo que el hincha del otro equipo no ve los penaltis que le pitan a favor, pero no notas que tú haces lo mismo con el tuyo.',
      ],
      practica: [
        'Piensa en una noticia que hayas compartido recientemente y pregúntate si la habrías revisado más si dijera lo contrario.',
        'Escribe un tema en el que tengas interés personal (plata, orgullo, equipo, partido) y donde podrías estar razonando con sesgo.',
        'Pide hoy a alguien sin interés en el tema que te diga dónde ve un hueco en tu argumento.',
      ],
      pregunta: '¿En qué tema exijo muchas más pruebas a quien piensa distinto que a quien piensa como yo?',
      nota: 'Aprender sobre sesgos no te vuelve inmune a ellos: el punto ciego muestra justo lo contrario. Incluso puede pasar que uses lo que sabes de sesgos para descartar a los demás ("eso lo dices por tu sesgo") sin revisarte. Lo que ayuda son procedimientos concretos (aplicarte el mismo estándar, pedir revisión externa), no solo saber los nombres.',
      recordar: [
        ['¿Qué es el razonamiento motivado según Kunda?', 'Buscar y evaluar argumentos para llegar a la conclusión que deseamos, sintiéndonos objetivos.'],
        ['¿Qué encontraron Kahan y otros con personas buenas en números?', 'Que se equivocaban más con los datos cuando el resultado contradecía su postura política.'],
        ['¿Qué es el punto ciego de los sesgos?', 'Creer que somos menos sesgados que los demás.'],
        ['¿La inteligencia reduce el punto ciego?', 'No; según West, Meserve y Stanovich, no lo reduce y a veces lo aumenta un poco.'],
      ],
      tarjetas: [
        ['Razonamiento motivado (Kunda)', 'Cuando quieres una conclusión, razonas como abogado, no como juez.'],
        ['Punto ciego', 'Vemos los sesgos de los demás, no los nuestros. Ser más inteligente no lo cura.'],
        ['El mismo estándar', '¿Aceptaría esta evidencia si apuntara en la dirección contraria?'],
      ],
    }),
    l('Cómo juzgamos a los demás', 11, {
      idea: 'Al juzgar a otros, culpamos de más a su forma de ser y de menos a la situación; dejamos que una cualidad tiña todo lo demás; y favorecemos a "los nuestros" aunque el grupo sea casi arbitrario.',
      bloques: [
        ['El error fundamental de atribución', [
          'Jones y Harris (1967) pidieron a personas leer ensayos a favor o en contra de Fidel Castro y les dijeron que el autor había sido obligado a escribir esa postura.',
          'Aun así, la gente creyó que el autor pensaba lo que escribió. Le dio más peso a la persona que a la situación.',
          'Lee Ross lo llamó error fundamental de atribución: explicar la conducta ajena por cómo es la persona, olvidando las circunstancias.',
          'Con nosotros hacemos lo contrario: "llegué tarde por el trancón", pero "él llegó tarde porque es irresponsable".',
        ]],
        ['El efecto halo', [
          'Nisbett y Wilson (1977) mostraron a estudiantes un video del mismo profesor, una vez amable y otra vez frío.',
          'Cuando era amable, los estudiantes calificaron también su acento, su apariencia y sus gestos como más agradables. Y no se dieron cuenta de que la amabilidad había influido.',
          'Una cualidad (ser bonito, simpático, famoso, tener un buen título) tiñe el juicio de todo lo demás.',
        ]],
        ['Nosotros y ellos', [
          'Henri Tajfel (1970) dividió a jóvenes en grupos por criterios casi arbitrarios (qué pintor preferían). Aun así, al repartir recompensas, favorecieron a su grupo.',
          'Basta con sentirse parte de un grupo (barrio, región, equipo, partido) para empezar a juzgar con dos raseros.',
          'Antídoto: antes de juzgar, pregúntate qué situación podría explicar la conducta, y si juzgarías igual a alguien de "tu" grupo.',
        ]],
      ],
      ejemplos: [
        'Un domiciliario te trata seco y piensas "qué grosero". No sabes que lleva 10 horas en la moto bajo la lluvia y que le acaban de robar un pedido. La situación explica más de lo que crees.',
        'En el trabajo contratan a alguien con título de una universidad famosa y todos asumen que es bueno en todo. Meses después notan que es excelente en lo técnico pero desordenado con los clientes: el halo del título tapó lo demás.',
      ],
      practica: [
        'La próxima vez que alguien te moleste hoy, escribe dos explicaciones posibles que dependan de la situación y no de su forma de ser.',
        'Piensa en alguien que admiras y pregúntate en qué podría no ser tan bueno como asumes.',
        'Piensa en un grupo con el que te identificas fuerte y escribe un juicio que harías distinto si viniera de alguien de otro grupo.',
      ],
      pregunta: '¿A quién estoy juzgando por su "forma de ser" sin conocer su situación?',
      nota: 'El error fundamental de atribución es más fuerte en culturas individualistas (como Estados Unidos) que en culturas más colectivistas, donde la gente presta más atención al contexto; por eso algunos autores prefieren llamarlo "sesgo de correspondencia" y no "fundamental". Y no todo es situación: la personalidad sí existe y predice conducta. El punto es no olvidar las circunstancias, no ignorar el carácter.',
      recordar: [
        ['¿Qué es el error fundamental de atribución?', 'Explicar la conducta ajena por cómo es la persona, olvidando las circunstancias.'],
        ['¿Qué mostró el estudio de Jones y Harris?', 'Que la gente creyó que el autor pensaba lo que escribió, aunque sabía que lo habían obligado.'],
        ['¿Qué es el efecto halo?', 'Que una cualidad positiva tiñe el juicio de todo lo demás de una persona.'],
        ['¿Qué mostró Tajfel con grupos arbitrarios?', 'Que la gente favorece a su grupo aunque haya sido formado por un criterio casi sin importancia.'],
      ],
      tarjetas: [
        ['Error fundamental de atribución', 'Culpamos a la persona y olvidamos la situación. Con nosotros, hacemos lo contrario.'],
        ['Efecto halo (Nisbett y Wilson)', 'Una cualidad (simpatía, belleza, título) tiñe el juicio de todo lo demás, sin que lo notemos.'],
        ['Nosotros y ellos (Tajfel)', 'Basta un grupo casi arbitrario para favorecer a los nuestros. ¿Juzgaría igual a alguien de mi grupo?'],
      ],
    }),
  ],
};

const MEJOR = {
  titulo: 'Pensar mejor con los datos',
  objetivo: 'Reconocer los errores que cometemos con la memoria y con el azar (retrospectiva, supervivencia, regresión a la media, rachas) y aplicar las técnicas para reducir sesgos que tienen evidencia.',
  fuentes: [
    ['Fischhoff, B. (1975). Hindsight is not equal to foresight: The effect of outcome knowledge on judgment under uncertainty. Journal of Experimental Psychology: Human Perception and Performance, 1(3), 288-299.', 'El sesgo retrospectivo: "yo sabía que eso iba a pasar".'],
    ['Roese, N. J. y Vohs, K. D. (2012). Hindsight bias. Perspectives on Psychological Science, 7(5), 411-426.', 'Revisión moderna del sesgo retrospectivo.'],
    ['Loftus, E. F. y Palmer, J. C. (1974). Reconstruction of automobile destruction: An example of the interaction between language and memory. Journal of Verbal Learning and Verbal Behavior, 13(5), 585-589.', 'La forma de preguntar cambia lo que la gente recuerda.'],
    ['Mangel, M. y Samaniego, F. J. (1984). Abraham Wald’s work on aircraft survivability. Journal of the American Statistical Association, 79(386), 259-267.', 'El análisis de los aviones que volvieron: el sesgo de supervivencia.'],
    ['Gilovich, T., Vallone, R. y Tversky, A. (1985). The hot hand in basketball: On the misperception of random sequences. Cognitive Psychology, 17(3), 295-314.', 'El estudio clásico de la "mano caliente".'],
    ['Miller, J. B. y Sanjurjo, A. (2018). Surprised by the hot hand fallacy? A truth in the law of small numbers. Econometrica, 86(6), 2019-2047.', 'Un error estadístico en el estudio clásico: la mano caliente podría existir.'],
    ['Chapman, L. J. y Chapman, J. P. (1967). Genesis of popular but erroneous psychodiagnostic observations. Journal of Abnormal Psychology, 72(3), 193-204.', 'La correlación ilusoria: vemos relaciones que no existen.'],
    ['Lord, C. G., Lepper, M. R. y Preston, E. (1984). Considering the opposite: A corrective strategy for social judgment. Journal of Personality and Social Psychology, 47(6), 1231-1243.', 'Considerar lo contrario reduce el sesgo.'],
    ['Morewedge, C. K. et al. (2015). Debiasing decisions: Improved decision making with a single training intervention. Policy Insights from the Behavioral and Brain Sciences, 2(1), 129-140.', 'Un entrenamiento con juegos y retroalimentación redujo varios sesgos por meses.'],
  ],
  lecciones: [
    l('Memoria y retrospectiva', 10, {
      idea: 'Después de saber cómo terminó algo, creemos que era obvio desde el principio. Y la memoria no es una grabación: se reconstruye y se puede deformar.',
      bloques: [
        ['"Yo sabía que eso iba a pasar"', [
          'Baruch Fischhoff (1975) dio a personas descripciones de eventos históricos con distintos finales. Quienes conocían el final lo juzgaban como el más probable, y creían que lo habrían predicho.',
          'Roese y Vohs (2012) describen tres capas del sesgo retrospectivo: recordar mal lo que pensabas antes, sentir que era inevitable y creer que lo sabías.',
          'Es peligroso porque nos impide aprender: si "todo era obvio", no revisamos qué no vimos.',
        ]],
        ['La memoria se reconstruye', [
          'Loftus y Palmer (1974) mostraron un video de un choque y preguntaron qué tan rápido iban los carros cuando se "estrellaron" o cuando se "tocaron".',
          'Con la palabra "estrellaron" la gente estimó velocidades más altas y, días después, más personas "recordaron" vidrios rotos que no estaban en el video.',
          'Cada vez que recuerdas algo, lo reconstruyes, y la información nueva se puede mezclar.',
        ]],
        ['El sesgo de supervivencia', [
          'En la Segunda Guerra Mundial, el estadístico Abraham Wald analizó los impactos de bala en los aviones que volvían de las misiones (Mangel y Samaniego, 1984).',
          'La idea intuitiva era reforzar donde había más impactos. Wald razonó lo contrario: los aviones que recibían balas en otras partes no volvían, así que había que reforzar justo donde los sobrevivientes no tenían marcas.',
          'Pasa en la vida diaria: solo vemos a los emprendedores que triunfaron, a los que ganaron con las apuestas, a los famosos que dejaron la universidad. Los que fracasaron no salen en las noticias.',
        ]],
      ],
      ejemplos: [
        'Después de que tu equipo pierde la final, todos dicen "se veía venir, el técnico no debía cambiar al 9". Antes del partido, nadie lo dijo. Un diario de decisiones (curso de Toma de decisiones) evita que la memoria reescriba lo que pensabas.',
        'Ves en redes a jóvenes que "se volvieron millonarios con cripto" y concluyes que es fácil. No ves a los miles que perdieron y no publicaron nada. Ese es el sesgo de supervivencia.',
      ],
      practica: [
        'Antes de un evento con resultado incierto (un partido, una entrevista, una venta), escribe qué crees que pasará y con qué probabilidad.',
        'Busca una historia de éxito que te inspire y pregúntate cuántos intentaron lo mismo y fracasaron.',
        'Cuando recuerdes una discusión vieja, pregúntate qué partes podrías estar reconstruyendo a tu favor.',
      ],
      pregunta: '¿Qué historias de éxito tomo como modelo sin ver a todos los que lo intentaron y fallaron?',
      nota: 'Que la memoria se pueda deformar no significa que todos los recuerdos sean falsos: la mayoría de lo que recordamos de forma general es razonablemente correcto. Los detalles, las fechas y lo que pensábamos en el momento son lo más frágil. Por eso, para lo importante, escribir en el momento (el diario de la app) vale más que confiar en la memoria.',
      recordar: [
        ['¿Qué es el sesgo retrospectivo?', 'Creer, después de saber el resultado, que era obvio y que lo habríamos predicho.'],
        ['¿Qué mostraron Loftus y Palmer?', 'Que la palabra usada al preguntar ("estrellaron" o "tocaron") cambió las velocidades estimadas y los recuerdos falsos.'],
        ['¿Qué es el sesgo de supervivencia?', 'Sacar conclusiones solo de los casos que "sobrevivieron", sin ver los que fallaron.'],
        ['¿Qué razonó Abraham Wald con los aviones?', 'Que había que reforzar donde los aviones que volvían no tenían impactos, porque los que recibían balas ahí no volvían.'],
      ],
      tarjetas: [
        ['Sesgo retrospectivo (Fischhoff)', '"Yo sabía que iba a pasar." Escribir tus predicciones antes evita que la memoria las reescriba.'],
        ['La memoria se reconstruye (Loftus)', 'Cada recuerdo se rearma y la información nueva se mezcla; los detalles son lo más frágil.'],
        ['Sesgo de supervivencia (Wald)', 'Solo ves a los que llegaron. Pregunta: ¿cuántos lo intentaron y fallaron?'],
      ],
    }),
    l('El azar y las rachas', 11, {
      idea: 'La mente ve patrones aunque no los haya. Confundimos el azar con causas, la regresión a la media con el efecto de nuestras acciones y las coincidencias con relaciones reales.',
      bloques: [
        ['La regresión a la media', [
          'Cuando algo sale extraordinariamente bien o mal, lo siguiente suele estar más cerca del promedio, solo por azar.',
          'Kahneman cuenta que unos instructores de vuelo creían que regañar funcionaba mejor que felicitar: después de un aterrizaje excelente felicitado, el siguiente era peor; después de uno pésimo regañado, el siguiente era mejor.',
          'No era el regaño: era la regresión a la media. Los aterrizajes extremos suelen ir seguidos de otros más normales.',
          'Por eso muchas "curas" parecen funcionar: la gente consulta cuando está peor, y luego mejora de todos modos.',
        ]],
        ['Rachas y la falacia del jugador', [
          'La falacia del jugador es creer que, después de varias veces rojo en la ruleta, "ya toca" negro. Cada giro es independiente.',
          'Gilovich, Vallone y Tversky (1985) estudiaron la "mano caliente" en el baloncesto y concluyeron que las rachas de aciertos eran las que se esperan por azar.',
          'Miller y Sanjurjo (2018) encontraron un error sutil en ese cálculo: corregido, los datos sugieren que la mano caliente podría existir, aunque sea un efecto pequeño.',
          'Lección: es difícil saber cuándo una racha es real; en juegos de azar puros (lotería, ruleta) nunca lo es.',
        ]],
        ['Correlaciones ilusorias', [
          'Chapman y Chapman (1967) encontraron que psicólogos clínicos "veían" en dibujos de pacientes relaciones que esperaban encontrar, aunque los datos no las mostraban.',
          'Vemos relaciones donde esperamos verlas: "cada vez que estreno guayos perdemos", "cuando llueve me duele la rodilla".',
          'Y que dos cosas vayan juntas no significa que una cause la otra: puede haber una tercera causa o pura coincidencia.',
        ]],
      ],
      ejemplos: [
        'Tuviste tu peor semana en el gym y empezaste a tomar un suplemento nuevo. La semana siguiente rindes mejor y crees que fue el suplemento. Pudo ser simplemente que volviste a tu nivel normal: regresión a la media.',
        'Llevas cinco semanas jugando los mismos números del chance sin ganar y piensas que "ya casi sale". Cada sorteo es independiente: tus números no tienen más probabilidad por haberlos jugado antes.',
      ],
      practica: [
        'Piensa en algo que "funcionó" después de un momento muy malo (un remedio, un regaño, un cambio) y pregúntate si pudo ser regresión a la media.',
        'Escribe una "regla" que creas haber descubierto en tu vida (una cábala, una coincidencia) y qué datos tienes de verdad.',
        'Cuando oigas "ya toca" en un juego de azar, recuerda que cada jugada es independiente.',
      ],
      pregunta: '¿Qué cábala o patrón creo ver que probablemente es coincidencia?',
      nota: 'La historia de la mano caliente es un buen ejemplo de cómo la ciencia se corrige: durante décadas se citó como prueba de que la gente ve patrones donde no los hay, y luego se descubrió un error en el análisis. La falacia del jugador en juegos de azar puros sigue siendo un error claro; la mano caliente en deportes, donde la confianza y el cansancio cambian de verdad, es un caso más abierto.',
      recordar: [
        ['¿Qué es la regresión a la media?', 'Que después de un resultado extremo, el siguiente suele estar más cerca del promedio, solo por azar.'],
        ['¿Qué explica la historia de los instructores de vuelo?', 'Que creían que regañar funcionaba, cuando la mejora venía de la regresión a la media.'],
        ['¿Qué es la falacia del jugador?', 'Creer que después de varias veces un resultado, "ya toca" el otro, aunque cada jugada sea independiente.'],
        ['¿Qué encontraron Miller y Sanjurjo sobre la mano caliente?', 'Un error en el estudio clásico; corregido, la mano caliente podría existir como un efecto pequeño.'],
      ],
      tarjetas: [
        ['Regresión a la media', 'Tras un extremo viene algo más normal, por azar. Muchas "curas" y regaños parecen funcionar por esto.'],
        ['Falacia del jugador', 'En el azar puro, cada jugada es independiente: nunca "ya toca".'],
        ['Correlación ilusoria', 'Vemos relaciones donde esperamos verlas. Que vayan juntas no significa que una cause la otra.'],
      ],
    }),
    l('Cómo reducir los sesgos (lo que sí funciona)', 11, {
      idea: 'Saber que existen los sesgos no basta para evitarlos. Lo que funciona son procedimientos concretos: considerar lo contrario, pensar en frecuencias, pedir opiniones independientes y practicar con retroalimentación.',
      bloques: [
        ['Saber no es suficiente', [
          'Como vimos con el punto ciego, conocer los nombres de los sesgos no te vuelve inmune.',
          'Lo que reduce los sesgos son cambios en el procedimiento: cómo buscas información, cómo comparas y a quién le pides revisión.',
          'También ayuda cambiar el entorno: listas de chequeo, reglas escritas antes de decidir y datos a la vista.',
        ]],
        ['Técnicas con evidencia', [
          'Considerar lo contrario: Lord, Lepper y Preston (1984) encontraron que pedirle a la gente "piensa por qué podrías estar equivocado" redujo más el sesgo que pedirle "sé objetivo".',
          'Pensar en frecuencias: "de 100 casos como este, ¿cuántos…?" reduce errores con probabilidades.',
          'Opiniones independientes: pedir el juicio de varias personas por separado, antes de que se influyan entre sí.',
          'Tomar distancia: imaginar que le aconsejas a un amigo en la misma situación.',
        ]],
        ['Entrenar con retroalimentación', [
          'Morewedge y otros (2015) diseñaron un videojuego y un video que enseñaban varios sesgos con ejemplos y retroalimentación inmediata.',
          'Quienes lo hicieron cometieron menos sesgos en pruebas posteriores, incluso semanas o meses después; el juego interactivo funcionó mejor que el video.',
          'La clave es practicar en casos concretos y saber si acertaste, como con las tarjetas de repaso de la app.',
        ]],
      ],
      ejemplos: [
        'Antes de comprar un carro, haces una lista de chequeo: precio de referencia investigado (anclaje), mejor reseña negativa leída (confirmación), opinión de un mecánico que no gana nada (punto ciego) y "¿y si me estoy equivocando?" (considerar lo contrario).',
        'En el trabajo hay que escoger entre dos proveedores. En vez de discutir en reunión, cada miembro del equipo califica a los dos por escrito antes de hablar. Las opiniones independientes evitan que todos copien al jefe.',
      ],
      practica: [
        'Para tu próxima decisión importante, escribe tres razones por las que podrías estar equivocado.',
        'Arma una lista de chequeo de cuatro preguntas contra los sesgos que más te afectan y guárdala en el celular.',
        'Pide a dos personas, por separado, su opinión sobre algo que vas a decidir, antes de contarles la tuya.',
      ],
      pregunta: '¿Cuál es el sesgo que más me cuesta en la vida, y qué procedimiento concreto voy a usar contra él?',
      nota: 'Durante años se dijo que los sesgos eran casi imposibles de corregir. El estudio de Morewedge y otros fue esperanzador, aunque con estudiantes y pruebas de laboratorio; no está claro cuánto se transfiere a decisiones reales. Lo más sólido sigue siendo cambiar el procedimiento y el entorno (listas, opiniones independientes, reglas escritas) más que confiar en la fuerza de voluntad o en "estar atento".',
      recordar: [
        ['¿Por qué saber que existen los sesgos no basta?', 'Por el punto ciego: conocer los nombres no te vuelve inmune; hace falta cambiar el procedimiento.'],
        ['¿Qué encontraron Lord, Lepper y Preston?', 'Que pedir "piensa por qué podrías estar equivocado" redujo más el sesgo que pedir "sé objetivo".'],
        ['¿Qué mostró el estudio de Morewedge y otros?', 'Que un entrenamiento con juego y retroalimentación redujo varios sesgos, incluso semanas o meses después.'],
        ['Nombra tres técnicas contra los sesgos.', 'Considerar lo contrario, pensar en frecuencias, opiniones independientes y tomar distancia.'],
      ],
      tarjetas: [
        ['Considerar lo contrario (Lord, Lepper y Preston)', '"¿Por qué podría estar equivocado?" funciona mejor que "sé objetivo".'],
        ['Opiniones independientes', 'Pide juicios por separado antes de que la gente se influya entre sí.'],
        ['Cambiar el procedimiento', 'Listas de chequeo, reglas escritas y revisión externa reducen sesgos más que "estar atento".'],
      ],
    }),
  ],
};

export default {
  id: 'sesgos-cognitivos',
  nombre: 'Sesgos cognitivos',
  area: 'aprender',
  icono: '🎭',
  nivel: 'Intermedio',
  paraQue: 'Reconocer los atajos de la mente que nos hacen equivocarnos (con los números, con las creencias, con las personas y con el azar) y aprender los procedimientos que de verdad los reducen. Complementa Metacognición y Toma de decisiones: aquí están los errores; allá, el método para decidir.',
  modulos: [ATAJOS, CREENCIAS, MEJOR],
  proyecto: {
    titulo: 'Tu cazador de sesgos de dos semanas',
    intro: 'Durante 2 semanas vas a registrar los sesgos que encuentres en ti, en las noticias y en la publicidad, y vas a armar tu propia lista de chequeo contra los que más te afectan.',
    pasos: [
      'Cada día, anota en el diario un sesgo que hayas notado en ti (no en los demás) y la situación.',
      'Cada día, anota también un sesgo que notes en una noticia, una publicidad o una conversación.',
      'Antes de una compra o negociación importante, escribe tu precio o valor de referencia para no caer en el ancla.',
      'Escoge una creencia fuerte y busca el mejor argumento en contra, de una fuente seria.',
      'Escribe antes de un evento incierto qué crees que pasará y con qué probabilidad; compáralo después.',
      'Al final de la primera semana, identifica los tres sesgos que más se repitieron en tu registro.',
      'Arma una lista de chequeo de 4 a 6 preguntas contra esos sesgos y úsala en tus decisiones de la segunda semana.',
      'Al terminar, escribe qué sesgo te sorprendió más en ti y qué procedimiento vas a mantener.',
    ],
  },
};
