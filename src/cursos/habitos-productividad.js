// Hábitos, productividad y organización personal. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const HABITOS = {
  titulo: 'Cómo funcionan los hábitos',
  objetivo: 'Entender qué es un hábito según la investigación, cuánto tarda en formarse y cómo atarlo a una señal concreta para que se haga casi solo.',
  fuentes: [
    ['Wood, W., Quinn, J. M. y Kashy, D. A. (2002). Habits in everyday life: Thought, emotion, and action. Journal of Personality and Social Psychology, 83(6), 1281-1297.', 'Cuánto de lo que hacemos cada día se repite en el mismo contexto, casi sin pensar.'],
    ['Wood, W. y Neal, D. T. (2007). A new look at habits and the habit-goal interface. Psychological Review, 114(4), 843-863.', 'El hábito como asociación entre un contexto y una respuesta, distinta de las metas.'],
    ['Wood, W. (2019). Good Habits, Bad Habits: The science of making positive changes that stick. Farrar, Straus and Giroux.', 'La investigación sobre hábitos explicada para todo público.'],
    ['Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W. y Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. European Journal of Social Psychology, 40(6), 998-1009.', 'Cuánto tarda de verdad un hábito nuevo en volverse automático.'],
    ['Gollwitzer, P. M. (1999). Implementation intentions: Strong effects of simple plans. American Psychologist, 54(7), 493-503.', 'Los planes "si pasa X, entonces hago Y".'],
    ['Gollwitzer, P. M. y Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. Advances in Experimental Social Psychology, 38, 69-119.', 'Metaanálisis: los planes "si-entonces" ayudan a cumplir metas.'],
    ['Duhigg, C. (2012). The Power of Habit: Why we do what we do in life and business. Random House.', 'Popularizó el ciclo señal, rutina y recompensa.'],
    ['Clear, J. (2018). Atomic Habits. Avery. (En español: Hábitos atómicos).', 'Guía práctica muy leída: hábitos pequeños, señales, entorno e identidad.'],
  ],
  lecciones: [
    l('Qué es un hábito (de verdad)', 10, {
      idea: 'Un hábito no es algo que haces seguido: es algo que tu cerebro dispara solo cuando aparece cierto contexto. Por eso los hábitos se construyen con repetición en el mismo lugar y momento, no con motivación.',
      bloques: [
        ['Contexto que dispara una acción', [
          'Wendy Wood y David Neal (2007) definen el hábito como una asociación aprendida entre un contexto (lugar, hora, lo que acabas de hacer, las personas) y una respuesta.',
          'Cuando el hábito está formado, el contexto activa la acción casi sin pasar por la decisión: llegas a la casa y ya estás prendiendo el televisor.',
          'Por eso un hábito no es lo mismo que una meta: la meta es lo que quieres; el hábito es lo que haces en automático, aunque ya no lo quieras.',
        ]],
        ['Cuánto pesa el piloto automático', [
          'Wood, Quinn y Kashy (2002) pidieron a estudiantes anotar lo que hacían a lo largo del día. Una parte grande de sus acciones se repetía casi a diario en el mismo lugar, mientras pensaban en otra cosa.',
          'Eso no es malo: liberar la mente de decidir cada paso de lo rutinario (cepillarse, manejar, vestirse) deja la atención para lo nuevo.',
          'El problema es que el piloto automático no distingue entre lo que te conviene y lo que no: repite lo que más has repetido.',
        ]],
        ['Lo que esto cambia', [
          'Querer algo con muchas ganas no basta: la motivación sube y baja, y el contexto se repite todos los días.',
          'Para crear un hábito, repite la misma acción en el mismo contexto, muchas veces.',
          'Para quitar un hábito, cambiar el contexto suele funcionar mejor que pelear contra él (lo verás en el módulo 2).',
        ]],
      ],
      ejemplos: [
        'Cada vez que te subes al bus, sin pensarlo, sacas el celular y abres redes. El contexto (sentarte en el bus) dispara la acción. Si quieres leer en ese rato, tienes que ocupar ese mismo momento con el libro, no esperar a "tener ganas".',
        'Llevas años entrenando a las 6 a. m. Un día que no tienes ganas, igual te encuentras con la maleta lista y camino al gym: eso es el hábito trabajando por ti.',
      ],
      practica: [
        'Escribe 5 cosas que haces todos los días casi sin pensar y anota qué las dispara (lugar, hora o lo que acabas de hacer).',
        'Marca cuáles te convienen y cuáles no.',
        'Escoge un hábito que quieras crear y escribe en qué contexto exacto va a ocurrir.',
      ],
      pregunta: '¿Qué hago en piloto automático que ya no quiero hacer, y qué lo dispara?',
      nota: 'Se suele decir que "el 40 % (o el 45 %) de lo que hacemos son hábitos". Esa cifra viene de estudios con diarios de pocas personas, sobre todo estudiantes, y depende de cómo se defina hábito. Lo que sí está bien respaldado: una buena parte de la conducta diaria se repite en los mismos contextos sin mucha deliberación.',
      recordar: [
        ['¿Cómo definen Wood y Neal un hábito?', 'Como una asociación aprendida entre un contexto y una respuesta, que se dispara casi sin decidir.'],
        ['¿En qué se diferencia un hábito de una meta?', 'La meta es lo que quieres; el hábito es lo que haces en automático cuando aparece el contexto, aunque ya no lo quieras.'],
        ['¿Por qué la motivación no basta para crear un hábito?', 'Porque sube y baja; lo que construye el hábito es repetir la misma acción en el mismo contexto.'],
        ['¿Qué suele funcionar mejor para quitar un hábito?', 'Cambiar el contexto que lo dispara, más que pelear contra él.'],
      ],
      tarjetas: [
        ['¿Qué es un hábito?', 'Una acción que un contexto (lugar, hora, lo que acabas de hacer) dispara casi sin decidir, aprendida por repetición.'],
        ['Hábito vs. meta', 'La meta es lo que quieres; el hábito, lo que haces en automático. Pueden ir en contra.'],
        ['Cómo se construye un hábito', 'Repitiendo la misma acción en el mismo contexto, muchas veces. No depende de tener ganas.'],
      ],
    }),
    l('Cuánto tarda: el mito de los 21 días', 10, {
      idea: 'Un hábito nuevo no se forma en 21 días: en el estudio más conocido tomó en promedio un par de meses, con mucha diferencia entre personas y hábitos. Y fallar un día no arruina el proceso.',
      bloques: [
        ['El estudio de Lally', [
          'Phillippa Lally y su equipo (2010) pidieron a casi cien personas escoger un hábito nuevo (tomar agua con el almuerzo, comer fruta, hacer ejercicio) y repetirlo cada día en el mismo contexto.',
          'Cada día calificaban qué tan automático se sentía. La automaticidad subía rápido al principio y luego se iba aplanando, como una curva.',
          'El tiempo para llegar casi al tope tuvo una mediana de 66 días, con un rango enorme: de menos de tres semanas a más de ocho meses.',
          'Los hábitos sencillos (tomar agua) se volvían automáticos antes que los más exigentes (hacer ejercicio).',
        ]],
        ['Fallar un día no lo daña', [
          'En ese estudio, saltarse una vez no afectó de forma importante la formación del hábito.',
          'Lo que sí daña es dejar que un día se vuelvan varios: "ya lo eché a perder, mejor empiezo el lunes".',
          'Regla práctica: nunca falles dos veces seguidas.',
        ]],
        ['Qué esperar', [
          'Las primeras semanas cuestan: todavía tienes que acordarte y decidir.',
          'Si a las tres semanas sigue costando, no estás fallando: es lo normal.',
          'Mide la constancia (cuántos días lo hiciste), no la perfección (si hiciste todos).',
        ]],
      ],
      ejemplos: [
        'Empezaste a estirar 10 minutos después de cada partido. A las tres semanas todavía se te olvida a veces. No es que "no seas de hábitos": vas por buen camino; dale uno o dos meses más con la misma señal.',
        'Llevabas 15 días tomando agua al despertar y un domingo se te pasó. El lunes vuelves a hacerlo: eso no reinicia el conteo ni borra lo que avanzaste.',
      ],
      practica: [
        'Escoge un hábito nuevo pequeño y anótalo en 🎯 Metas o en el diario con la fecha de hoy.',
        'Ponte una meta de constancia realista (por ejemplo, 5 de cada 7 días) en lugar de "todos los días sin falta".',
        'Escribe tu regla para cuando falles: "nunca dos veces seguidas".',
      ],
      pregunta: '¿Qué hábito abandoné porque esperaba que fuera fácil a las pocas semanas?',
      nota: 'El mito de los 21 días se suele atribuir al cirujano plástico Maxwell Maltz, que en su libro de 1960 contó que sus pacientes tardaban "un mínimo de unos 21 días" en acostumbrarse a su nueva cara. Era una observación de consultorio, no un estudio sobre hábitos, y con el tiempo se repitió quitándole el "mínimo". Los 66 días de Lally tampoco son una regla: son la mediana de un grupo, y cada hábito y cada persona varían.',
      recordar: [
        ['¿Cuánto tardó en promedio un hábito en el estudio de Lally?', 'Una mediana de 66 días, con un rango de menos de tres semanas a más de ocho meses.'],
        ['¿Qué pasaba en ese estudio cuando alguien fallaba un día?', 'No afectaba de forma importante la formación del hábito.'],
        ['¿De dónde sale el mito de los 21 días?', 'De una observación del cirujano Maxwell Maltz sobre cuánto tardaban sus pacientes en acostumbrarse a su nueva cara.'],
        ['¿Qué conviene medir mientras formas un hábito?', 'La constancia (cuántos días lo haces), no la perfección.'],
      ],
      tarjetas: [
        ['¿Cuánto tarda un hábito? (Lally, 2010)', 'En promedio un par de meses (mediana de 66 días), con mucha variación. Los sencillos, antes.'],
        ['Fallar un día', 'No arruina el hábito. Regla: nunca falles dos veces seguidas.'],
        ['El mito de los 21 días', 'Sale de una observación de Maxwell Maltz sobre pacientes de cirugía, no de un estudio sobre hábitos.'],
      ],
    }),
    l('La señal: cuándo y dónde exactamente', 10, {
      idea: 'Decir "voy a leer más" casi nunca funciona. Decir "después del almuerzo, en la silla del balcón, leo 10 páginas" sí, porque ata la acción a una señal concreta que se repite.',
      bloques: [
        ['Planes "si-entonces"', [
          'Peter Gollwitzer llamó intenciones de implementación a los planes con la forma: "Cuando pase X, haré Y".',
          'Un metaanálisis (Gollwitzer y Sheeran, 2006) encontró que formular estos planes ayuda bastante a cumplir metas, frente a solo tener la intención.',
          'Funcionan porque la señal queda "lista" en la mente: cuando aparece, la acción se activa sin tener que acordarte ni decidir.',
          'La señal tiene que ser concreta y observable: "después de lavarme los dientes en la noche", no "en la noche".',
        ]],
        ['Anclar a algo que ya haces', [
          'BJ Fogg propone anclar el hábito nuevo a uno que ya tienes: "Después de [hábito actual], voy a [hábito nuevo]".',
          'James Clear lo llama "apilar hábitos". Funciona porque el hábito viejo ya es una señal confiable.',
          'Escoge un ancla que pase todos los días, a una hora estable y en el lugar donde vas a hacer el hábito nuevo.',
        ]],
        ['El ciclo señal-rutina-recompensa', [
          'Charles Duhigg popularizó la idea de que cada hábito tiene una señal, una rutina y una recompensa.',
          'Es una forma útil de mirar un hábito, sobre todo para cambiarlo: mantener la señal y la recompensa, y cambiar la rutina.',
          'Pero es una simplificación: en la investigación, una vez el hábito está formado, la recompensa importa menos y el contexto pesa más (Wood y Neal, 2007).',
        ]],
      ],
      ejemplos: [
        '"Después de servirme el tinto de la mañana, abro la app y hago mi lección de 🎓 Estudiar." El tinto pasa todos los días, a la misma hora y en el mismo sitio: es un ancla confiable.',
        '"Cuando llegue al parqueadero del trabajo, antes de bajarme de la moto, reviso las 3 tareas importantes del día." La señal (apagar la moto) es clara y siempre ocurre.',
      ],
      practica: [
        'Escribe un plan "si-entonces" para un hábito que quieras: "Cuando [señal concreta], voy a [acción pequeña]".',
        'Revisa que la señal sea observable, que pase todos los días y que ocurra en el lugar donde harás el hábito.',
        'Haz el hábito hoy mismo justo después de la señal, aunque sea en su versión más pequeña.',
      ],
      pregunta: '¿Qué hábito que ya tengo podría servir de ancla para uno nuevo?',
      nota: 'El ciclo señal-rutina-recompensa es una buena herramienta para pensar, pero no un mecanismo cerebral demostrado tal cual. La investigación muestra que los hábitos ya formados siguen funcionando aunque la recompensa desaparezca: por eso cuesta tanto quitarlos. Los planes "si-entonces" sí tienen buena evidencia, aunque su efecto es menor en estudios más recientes y mejor diseñados que en los primeros.',
      recordar: [
        ['¿Qué es una intención de implementación?', 'Un plan de la forma "Cuando pase X, haré Y" que ata la acción a una señal concreta.'],
        ['¿Por qué funcionan los planes "si-entonces"?', 'Porque la señal queda lista en la mente y, cuando aparece, activa la acción sin tener que acordarte ni decidir.'],
        ['¿Qué es anclar o apilar hábitos?', 'Poner el hábito nuevo justo después de uno que ya tienes: "Después de X, haré Y".'],
        ['¿Qué matiz tiene el ciclo señal-rutina-recompensa?', 'Es una simplificación útil; cuando el hábito ya está formado, el contexto pesa más que la recompensa.'],
      ],
      tarjetas: [
        ['Plan "si-entonces" (Gollwitzer)', '"Cuando pase X (señal concreta), haré Y." Ayuda bastante más que solo tener la intención.'],
        ['Anclar un hábito', '"Después de [algo que ya hago todos los días], voy a [hábito nuevo]."'],
        ['Una buena señal', 'Concreta, observable, que pase todos los días y en el lugar donde harás el hábito.'],
      ],
    }),
  ],
};

const CAMBIAR = {
  titulo: 'Cambiar hábitos',
  objetivo: 'Diseñar hábitos nuevos que sean fáciles de empezar, dejar los que no te sirven cambiando el entorno en vez de pelear con tu voluntad, y sostenerlos con registro y recompensas.',
  fuentes: [
    ['Fogg, B. J. (2019). Tiny Habits: The small changes that change everything. Houghton Mifflin Harcourt.', 'Empezar con versiones diminutas del hábito y anclarlas.'],
    ['Thaler, R. H. y Sunstein, C. R. (2008). Nudge: Improving decisions about health, wealth, and happiness. Yale University Press.', 'Cómo el entorno y las opciones por defecto cambian lo que hacemos.'],
    ['Neal, D. T., Wood, W., Wu, M. y Kurlander, D. (2011). The pull of the past: When do habits persist despite conflict with motives? Personality and Social Psychology Bulletin, 37(11), 1428-1437.', 'El estudio de las crispetas viejas: el contexto dispara el hábito aunque no lo disfrutes.'],
    ['Hofmann, W., Baumeister, R. F., Förster, G. y Vohs, K. D. (2012). Everyday temptations: An experience sampling study of desire, conflict, and self-control. Journal of Personality and Social Psychology, 102(6), 1318-1335.', 'Las personas con más autocontrol reportan menos tentaciones, no más resistencia.'],
    ['Galla, B. M. y Duckworth, A. L. (2015). More than resisting temptation: Beneficial habits mediate the relationship between self-control and positive life outcomes. Journal of Personality and Social Psychology, 109(3), 508-525.', 'El autocontrol funciona sobre todo a través de buenos hábitos.'],
    ['Harkin, B. et al. (2016). Does monitoring goal progress promote goal attainment? A meta-analysis of the experimental evidence. Psychological Bulletin, 142(2), 198-229.', 'Registrar el avance ayuda a cumplir metas, más si queda escrito o se comparte.'],
    ['Milkman, K. L., Minson, J. A. y Volpp, K. G. M. (2014). Holding the Hunger Games hostage at the gym: An evaluation of temptation bundling. Management Science, 60(2), 283-299.', 'Juntar algo que te gusta con algo que te cuesta.'],
    ['Hagger, M. S. et al. (2016). A multilab preregistered replication of the ego-depletion effect. Perspectives on Psychological Science, 11(4), 546-573.', 'La réplica que no encontró el "agotamiento de la fuerza de voluntad".'],
  ],
  lecciones: [
    l('Empezar pequeño y diseñar el entorno', 10, {
      idea: 'El hábito que se mantiene es el que es fácil de empezar. Hazlo tan pequeño que no puedas decir que no, y arregla tu entorno para que lo bueno quede a la mano y lo malo lejos.',
      bloques: [
        ['La versión diminuta', [
          'BJ Fogg propone empezar con una versión del hábito que tome menos de 30 segundos: una flexión, una línea del diario, sacar los tenis.',
          'La idea no es quedarse ahí, sino volver automático el empezar. Una vez arrancas, muchas veces haces más.',
          'Los días malos haces solo la versión mínima: así no rompes la cadena.',
        ]],
        ['El entorno decide por ti', [
          'Lo que está a la vista y a la mano se usa más; lo que cuesta alcanzar se usa menos.',
          'Thaler y Sunstein (2008) muestran cómo pequeños cambios en cómo se presentan las opciones (qué está primero, qué viene por defecto) cambian lo que la gente elige.',
          'Para un hábito bueno, quita pasos: la maleta del gym lista la noche anterior, la fruta lavada a la vista.',
          'Para uno malo, agrega pasos: el paquete de papas en el estante de arriba, las apps de redes fuera de la pantalla principal.',
        ]],
        ['Cuánto más fácil, mejor', [
          'Cada paso extra es una oportunidad de no hacerlo: si para ir a trotar tienes que buscar la ropa, ya perdiste la mitad.',
          'Pregunta: "¿qué es lo que más me frena para empezar?" y quítalo.',
          'Hazlo visible: un recordatorio en la app, el libro sobre la almohada, la botella de agua en el escritorio.',
        ]],
      ],
      ejemplos: [
        'Quieres hacer abdominales todos los días. En vez de "20 minutos de core", empiezas con "después de bañarme, una plancha de 20 segundos". En pocas semanas ya la alargas sin esfuerzo, porque empezar dejó de costar.',
        'Quieres comer menos dulce por la noche. En lugar de comprar el paquete grande "para la semana", no lo compras en el mercado y dejas fruta picada en la nevera a la altura de los ojos. La decisión se toma una vez en el supermercado, no cada noche.',
      ],
      practica: [
        'Escribe la versión de menos de 30 segundos del hábito que quieres crear.',
        'Haz un cambio en tu casa hoy que deje un hábito bueno a la mano (prepara la maleta, deja el libro visible).',
        'Haz un cambio que ponga un paso más entre tú y un hábito que quieres reducir.',
      ],
      pregunta: '¿Qué hay en mi entorno que me empuja a hacer justo lo que no quiero?',
      nota: 'La idea de los "pequeños empujones" (nudges) es real, pero su efecto promedio es más pequeño de lo que sugieren los ejemplos famosos, y varios estudios clásicos tuvieron problemas de replicación o de sesgo de publicación. El cambio de entorno funciona mejor como parte de un plan, no como truco único. Empezar pequeño está muy recomendado por la práctica, aunque hay menos experimentos que lo midan directamente.',
      recordar: [
        ['¿Qué es la versión diminuta de un hábito según Fogg?', 'Una versión que tome menos de 30 segundos, para que empezar se vuelva automático.'],
        ['¿Cómo se usa el entorno para un hábito bueno?', 'Quitando pasos y dejándolo a la vista y a la mano.'],
        ['¿Y para un hábito que quieres reducir?', 'Agregando pasos y sacándolo de la vista.'],
        ['¿Qué pregunta ayuda a facilitar un hábito?', '"¿Qué es lo que más me frena para empezar?", y quitarlo.'],
      ],
      tarjetas: [
        ['Hábito diminuto (Fogg)', 'Empieza con una versión de menos de 30 segundos. Lo importante es volver automático el empezar.'],
        ['Diseñar el entorno', 'Lo bueno a la vista y a la mano (menos pasos); lo malo lejos y escondido (más pasos).'],
        ['Los días malos', 'Haz solo la versión mínima del hábito: así no rompes la cadena.'],
      ],
    }),
    l('Romper malos hábitos sin pelear con tu voluntad', 11, {
      idea: 'Las personas que parecen tener mucha fuerza de voluntad en realidad pelean menos contra las tentaciones: organizan su vida para no tenerlas enfrente. Para quitar un mal hábito, ataca la señal, no a ti mismo.',
      bloques: [
        ['El contexto manda', [
          'Neal y su equipo (2011) dieron crispetas a personas en un cine, algunas frescas y otras de una semana. Quienes tenían el hábito de comer crispetas en cine comieron casi igual de las viejas que de las frescas.',
          'En una sala de reuniones, en cambio, comieron menos de las viejas. Fuera del contexto, el hábito perdió fuerza y volvieron a importar los gustos.',
          'También comieron menos cuando les pidieron usar la mano no dominante: romper la forma automática de hacerlo ayudó.',
        ]],
        ['El autocontrol real', [
          'Hofmann y otros (2012) preguntaron a la gente varias veces al día por sus tentaciones. Quienes tenían más autocontrol reportaban menos tentaciones, no que las resistieran más.',
          'Galla y Duckworth (2015) encontraron que la relación entre autocontrol y buenos resultados (notas, salud) pasaba en buena parte por tener buenos hábitos.',
          'Conclusión práctica: no te pongas a prueba. Organiza tu entorno para no tener que resistir.',
        ]],
        ['Estrategias que funcionan', [
          'Cambia o evita la señal: si fumas con el tinto en la tienda de la esquina, toma el tinto en otro lado.',
          'Agrega fricción: deja el celular cargando fuera del cuarto, cierra sesión en la app de apuestas o desinstálala.',
          'Reemplaza la rutina: ante la misma señal, haz otra cosa que te dé algo parecido (aburrimiento → caminar 5 minutos en vez de redes).',
          'Aprovecha los cambios de vida (mudanza, trabajo nuevo, vacaciones): la señal vieja desaparece y es más fácil instalar algo nuevo.',
        ]],
      ],
      ejemplos: [
        'Cada noche terminas viendo videos en el celular hasta la 1 a. m. En vez de prometerte "esta noche no", compras un despertador barato y dejas el celular cargando en la sala. Ya no tienes que resistir: el celular no está.',
        'Siempre que pasas por la panadería de camino a la casa compras pan dulce. Cambias de ruta y pasas por el parque. No le pediste nada a tu fuerza de voluntad: quitaste la señal.',
      ],
      practica: [
        'Escoge un mal hábito y escribe su señal: dónde, cuándo, con quién o después de qué.',
        'Escribe una forma de evitar esa señal o de agregarle un paso, y aplícala hoy.',
        'Escribe con qué otra acción vas a reemplazar la rutina cuando aparezca la señal.',
      ],
      pregunta: '¿En qué estoy confiando en mi fuerza de voluntad cuando podría cambiar mi entorno?',
      nota: 'Durante años se dijo que la fuerza de voluntad es como un músculo que se cansa ("agotamiento del yo"). Una réplica muy grande, con muchos laboratorios (Hagger y otros, 2016), encontró un efecto prácticamente nulo, y el tema sigue discutido. No pienses que tienes un "tanque" que se vacía: lo que sí ayuda es depender menos de resistir. Si un hábito te domina y te hace daño (alcohol, apuestas, drogas, comida), busca ayuda profesional: no es falta de carácter.',
      recordar: [
        ['¿Qué mostró el estudio de las crispetas viejas?', 'Que en el cine, quien tenía el hábito comía casi igual de crispetas viejas que de frescas: el contexto disparaba el hábito.'],
        ['¿Qué reportaban las personas con más autocontrol en el estudio de Hofmann?', 'Menos tentaciones, no que las resistieran más.'],
        ['Nombra tres estrategias para quitar un mal hábito.', 'Evitar o cambiar la señal, agregar fricción y reemplazar la rutina por otra.'],
        ['¿Por qué ayudan los cambios de vida para cambiar hábitos?', 'Porque las señales viejas desaparecen y es más fácil instalar algo nuevo.'],
      ],
      tarjetas: [
        ['El secreto del autocontrol', 'Quienes tienen más autocontrol enfrentan menos tentaciones: organizan su vida para no tener que resistir.'],
        ['Quitar un mal hábito', 'Ataca la señal (evítala o cámbiala), agrega fricción y reemplaza la rutina.'],
        ['La fuerza de voluntad como "tanque"', 'El agotamiento del yo no se replicó bien. Mejor depender menos de resistir.'],
      ],
    }),
    l('Registrar el avance y premiarte', 10, {
      idea: 'Lo que se anota se cuida. Registrar lo que haces y darte una recompensa inmediata mantiene vivo el hábito en las semanas en que todavía no es automático.',
      bloques: [
        ['Registrar funciona', [
          'Un metaanálisis de Harkin y otros (2016) encontró que monitorear el progreso ayuda a cumplir metas.',
          'El efecto fue mayor cuando el progreso quedaba registrado por escrito o se le contaba a otra persona.',
          'Por eso sirven las rachas de la app (🏋️ Gym, 🎓 Estudiar, 🎯 Metas): ver la cadena crecer motiva a no romperla.',
        ]],
        ['Recompensas inmediatas', [
          'Los beneficios de los buenos hábitos llegan tarde (salud, plata, aprendizaje); los costos llegan ya (esfuerzo, tiempo).',
          'Una recompensa inmediata compensa ese desbalance mientras el hábito se forma: marcar la casilla, un buen café, una canción.',
          'Katherine Milkman probó el "empaquetado de tentaciones": dejar algo que te encanta solo para cuando haces lo que te cuesta. Quienes solo podían escuchar sus audiolibros favoritos en el gym fueron más al gym.',
        ]],
        ['Cuidado con la racha', [
          'La racha motiva, pero si se rompe puede dar ganas de abandonar todo ("ya perdí la racha de 40 días").',
          'Recuerda la regla de la lección anterior: nunca dos veces seguidas. La racha es una herramienta, no el objetivo.',
          'Mira también el total: "este mes lo hice 22 días" cuenta más que una racha rota.',
        ]],
      ],
      ejemplos: [
        'Anotas en la app cada vez que vas al gym y cada semana miras el total. Ver "12 entrenos este mes" frente a "8 el mes pasado" te da un empujón que no te da ninguna frase motivacional.',
        'Te encanta una serie. Decides verla solo mientras haces bicicleta estática o planchas la ropa de la semana. Tienes ganas de ver el siguiente capítulo, y eso te lleva a la bicicleta.',
      ],
      practica: [
        'Escoge dónde vas a registrar tu hábito (la app, un calendario de papel) y anótalo hoy.',
        'Escoge una recompensa pequeña e inmediata para después de hacerlo.',
        'Piensa en algo que te encante y que puedas reservar solo para cuando haces algo que te cuesta.',
      ],
      pregunta: '¿Qué hábito sostendría mejor si viera mi avance por escrito?',
      nota: 'El empaquetado de tentaciones funcionó en el estudio de Milkman, pero el efecto se fue reduciendo con las semanas, y estudios posteriores más grandes encontraron efectos más pequeños. Es un empujón, no una solución mágica. Algo parecido pasa con la idea de que "los hábitos se construyen desde la identidad" ("soy una persona que entrena"): es una forma útil de motivarse, popularizada por libros de divulgación, más que un hallazgo experimental.',
      recordar: [
        ['¿Qué encontró el metaanálisis de Harkin sobre registrar el progreso?', 'Que ayuda a cumplir metas, y más si queda por escrito o se comparte con alguien.'],
        ['¿Por qué ayudan las recompensas inmediatas?', 'Porque los beneficios del hábito llegan tarde y los costos llegan ya; la recompensa compensa ese desbalance.'],
        ['¿Qué es el empaquetado de tentaciones?', 'Reservar algo que te encanta solo para cuando haces algo que te cuesta.'],
        ['¿Qué riesgo tiene la racha?', 'Que si se rompe dé ganas de abandonar todo; conviene mirar también el total.'],
      ],
      tarjetas: [
        ['Registrar el progreso (Harkin, 2016)', 'Ayuda a cumplir metas, sobre todo si queda escrito o lo compartes con alguien.'],
        ['Empaquetado de tentaciones (Milkman)', 'Algo que te encanta, solo mientras haces algo que te cuesta. Ayuda, aunque el efecto baja con el tiempo.'],
        ['La racha', 'Motiva, pero no es el objetivo. Si se rompe, vuelve al día siguiente y mira el total del mes.'],
      ],
    }),
  ],
};

const ORGANIZAR = {
  titulo: 'Productividad y organización personal',
  objetivo: 'Escoger metas claras y decidir qué es importante, proteger tu atención para hacer trabajo de calidad, y armar un sistema semanal sencillo que te quite pendientes de la cabeza.',
  fuentes: [
    ['Locke, E. A. y Latham, G. P. (2002). Building a practically useful theory of goal setting and task motivation: A 35-year odyssey. American Psychologist, 57(9), 705-717.', 'Metas específicas y retadoras frente a "haz lo mejor que puedas".'],
    ['Oettingen, G. (2014). Rethinking Positive Thinking: Inside the new science of motivation. Current.', 'El método WOOP: deseo, resultado, obstáculo y plan.'],
    ['Covey, S. R. (1989). The 7 Habits of Highly Effective People. Free Press. (En español: Los 7 hábitos de la gente altamente efectiva).', 'Popularizó la matriz de lo urgente y lo importante.'],
    ['Rubinstein, J. S., Meyer, D. E. y Evans, J. E. (2001). Executive control of cognitive processes in task switching. Journal of Experimental Psychology: Human Perception and Performance, 27(4), 763-797.', 'Cambiar de tarea cuesta tiempo, más cuanto más complejas son.'],
    ['Leroy, S. (2009). Why is it so hard to do my work? The challenge of attention residue when switching between work tasks. Organizational Behavior and Human Decision Processes, 109(2), 168-181.', 'El "residuo de atención" de la tarea anterior.'],
    ['Mark, G., Gudith, D. y Klocke, U. (2008). The cost of interrupted work: More speed and stress. Proceedings of the SIGCHI Conference on Human Factors in Computing Systems, 107-110.', 'Las interrupciones nos hacen trabajar más rápido, pero con más estrés.'],
    ['Newport, C. (2016). Deep Work: Rules for focused success in a distracted world. Grand Central.', 'El trabajo profundo: bloques de concentración sin distracciones.'],
    ['Allen, D. (2001). Getting Things Done: The art of stress-free productivity. Viking. (En español: Organízate con eficacia).', 'Capturar todo, aclarar, organizar y revisar cada semana.'],
    ['Masicampo, E. J. y Baumeister, R. F. (2011). Consider it done! Plan making can eliminate the cognitive effects of unfulfilled goals. Journal of Personality and Social Psychology, 101(4), 667-683.', 'Hacer un plan concreto calma los pendientes que dan vueltas en la cabeza.'],
  ],
  lecciones: [
    l('Metas claras y prioridades', 10, {
      idea: 'Productividad no es hacer más cosas, sino hacer las que importan. Eso empieza con metas concretas y con distinguir lo importante de lo que solo es urgente.',
      bloques: [
        ['Metas que funcionan', [
          'Locke y Latham (2002) revisaron décadas de estudios: las metas específicas y retadoras llevan a mejor desempeño que "haz lo mejor que puedas".',
          'Funcionan mejor cuando hay compromiso, retroalimentación (saber cómo vas) y la tarea no es completamente nueva.',
          'Para algo que estás aprendiendo desde cero, conviene más una meta de aprendizaje ("dominar la técnica del press") que una de resultado ("levantar 100 kg").',
        ]],
        ['Pensar en los obstáculos (WOOP)', [
          'Gabriele Oettingen encontró que solo fantasear con la meta cumplida se asocia con menos esfuerzo: la mente "ya siente" el logro.',
          'Propone WOOP: Deseo (Wish), Resultado (Outcome), Obstáculo (Obstacle) y Plan.',
          'La clave es el obstáculo interno: ¿qué hay en mí que me puede frenar? Y el plan es un "si-entonces" para ese obstáculo.',
        ]],
        ['Urgente vs. importante', [
          'Stephen Covey popularizó una matriz con dos preguntas: ¿es urgente? ¿es importante?',
          'Lo urgente grita (el chat, la llamada); lo importante casi nunca grita (estudiar, entrenar, ahorrar, hablar con tu familia).',
          'Si no le reservas tiempo a lo importante que no es urgente, lo urgente se lo come todo.',
          'Cada día, antes de abrir el correo o el chat, escoge de 1 a 3 cosas importantes y hazlas primero.',
        ]],
      ],
      ejemplos: [
        '"Ponerme en forma" es vago. "Entrenar 3 veces por semana durante 12 semanas y llegar a 10 dominadas" es específico y retador. Con WOOP: obstáculo, "llego cansado del trabajo"; plan, "si llego cansado, hago solo la mitad de la rutina, pero voy".',
        'Tu día se va respondiendo mensajes del grupo de trabajo y nunca avanzas en el informe que importa. Decides hacer el informe de 8 a 9:30 a. m., antes de abrir el chat.',
      ],
      practica: [
        'Escribe una meta para los próximos 3 meses de forma específica y retadora.',
        'Haz un WOOP rápido: deseo, mejor resultado, obstáculo interno y plan "si-entonces".',
        'Escribe las 3 cosas importantes de mañana y decide a qué hora vas a hacer la primera.',
      ],
      pregunta: '¿Qué es importante en mi vida y nunca es urgente, y por eso nunca lo hago?',
      nota: 'Las metas "SMART" (específicas, medibles, alcanzables, relevantes y con plazo) vienen de un artículo de gestión de 1981, no de un experimento. Son una lista útil, pero la evidencia fuerte es la de Locke y Latham sobre metas específicas y retadoras. Y las metas también tienen riesgos: demasiado estrechas o impuestas pueden llevar a hacer trampa o a descuidar lo que no se mide.',
      recordar: [
        ['¿Qué encontraron Locke y Latham sobre las metas?', 'Que las metas específicas y retadoras llevan a mejor desempeño que "haz lo mejor que puedas".'],
        ['¿Qué significan las letras de WOOP?', 'Deseo, Resultado, Obstáculo y Plan.'],
        ['¿Por qué solo fantasear con la meta puede ser contraproducente?', 'Porque la mente "ya siente" el logro y se asocia con menos esfuerzo (Oettingen).'],
        ['¿Qué diferencia hay entre lo urgente y lo importante?', 'Lo urgente exige atención ya; lo importante te acerca a lo que quieres, aunque casi nunca grita.'],
      ],
      tarjetas: [
        ['Metas que funcionan (Locke y Latham)', 'Específicas y retadoras, con compromiso y retroalimentación. Para algo nuevo, mejor una meta de aprendizaje.'],
        ['WOOP (Oettingen)', 'Deseo, Resultado, Obstáculo (interno) y Plan "si-entonces" para ese obstáculo.'],
        ['Urgente vs. importante', 'Lo importante casi nunca es urgente: resérvale tiempo, o lo urgente se lo come todo.'],
      ],
    }),
    l('Atención y trabajo profundo', 11, {
      idea: 'Saltar de una tarea a otra se siente productivo, pero cuesta tiempo y calidad. El trabajo que importa se hace en bloques de concentración sin interrupciones.',
      bloques: [
        ['El costo de cambiar de tarea', [
          'Rubinstein, Meyer y Evans (2001) midieron que cambiar de una tarea a otra cuesta tiempo, y que ese costo crece con la complejidad de las tareas.',
          'Lo que llamamos multitarea casi siempre es alternar rápido entre tareas, no hacerlas a la vez.',
          'Sophie Leroy (2009) describió el "residuo de atención": al pasar a otra tarea, parte de la mente se queda pegada en la anterior, sobre todo si quedó sin terminar.',
          'Gloria Mark y su equipo (2008) vieron que las personas interrumpidas compensan trabajando más rápido, pero con más estrés y frustración.',
        ]],
        ['Trabajo profundo', [
          'Cal Newport llama trabajo profundo a las tareas que exigen concentración total y producen algo valioso: estudiar, escribir, programar, planear.',
          'Se hace en bloques: 45 a 90 minutos con una sola tarea, el celular lejos y las notificaciones apagadas.',
          'Lo superficial (correos, mensajes, trámites) se agrupa en otros momentos del día.',
        ]],
        ['Cómo proteger la atención', [
          'Pon el bloque en el calendario como si fuera una cita, a la hora en que tienes más energía.',
          'Deja el celular en otro cuarto o en modo no molestar; cierra las pestañas que no necesitas.',
          'Antes de cambiar de tarea, anota en una línea dónde quedaste y cuál es el siguiente paso: eso reduce el residuo.',
          'Revisa el chat y el correo a horas fijas (por ejemplo, cada hora o tres veces al día) en lugar de cada vez que suenan.',
        ]],
      ],
      ejemplos: [
        'Estudias para un examen con el celular al lado y miras cada mensaje que llega. Dos horas después sientes que estudiaste mucho, pero avanzaste poco. Al día siguiente estudias 50 minutos con el celular en la sala y avanzas más en menos tiempo.',
        'En el trabajo decides que de 8 a 10 a. m. no abres el correo ni el chat, y lo avisas al equipo. En ese bloque sacas el reporte que llevabas una semana empezando.',
      ],
      practica: [
        'Agenda para mañana un bloque de 45 a 90 minutos para tu tarea más importante.',
        'Durante ese bloque, deja el celular en otro cuarto o en modo no molestar.',
        'Antes de cambiar de tarea hoy, anota en una línea dónde quedaste y cuál es el siguiente paso.',
      ],
      pregunta: '¿Cuántas veces al día interrumpo yo mismo lo que estoy haciendo, y por qué?',
      nota: 'Se repite que "se necesitan 23 minutos para recuperar la concentración después de una interrupción". Esa cifra sale de observaciones de oficinistas y no es una ley: depende de la tarea y de la interrupción. También se volvió famoso un estudio según el cual solo tener el celular a la vista reduce la capacidad mental; réplicas posteriores encontraron efectos más pequeños o nulos. Lo bien respaldado es más simple: cambiar de tarea cuesta, y las interrupciones aumentan el estrés. La técnica Pomodoro (25 minutos y descanso) es popular y le sirve a mucha gente, pero no hay estudios fuertes que muestren que 25 minutos sea el número correcto.',
      recordar: [
        ['¿Qué midieron Rubinstein, Meyer y Evans sobre cambiar de tarea?', 'Que cambiar de tarea cuesta tiempo, y que el costo crece con la complejidad.'],
        ['¿Qué es el residuo de atención?', 'La parte de la mente que se queda en la tarea anterior al pasar a otra, sobre todo si quedó sin terminar.'],
        ['¿Qué es el trabajo profundo según Newport?', 'Tareas de concentración total que producen algo valioso, hechas en bloques sin distracciones.'],
        ['¿Qué hacer antes de cambiar de tarea para reducir el residuo?', 'Anotar en una línea dónde quedaste y cuál es el siguiente paso.'],
      ],
      tarjetas: [
        ['La multitarea', 'Casi siempre es alternar rápido entre tareas, y cada cambio cuesta tiempo y calidad.'],
        ['Residuo de atención (Leroy, 2009)', 'Al cambiar de tarea, parte de tu mente se queda en la anterior. Anota dónde quedaste antes de cambiar.'],
        ['Bloque de trabajo profundo', '45 a 90 minutos, una sola tarea, celular lejos y notificaciones apagadas.'],
      ],
    }),
    l('Tu sistema semanal', 12, {
      idea: 'Una mente llena de pendientes sueltos se distrae y se estresa. Un sistema sencillo (capturar todo, decidir el siguiente paso y revisar cada semana) te quita peso de la cabeza y asegura que lo importante tenga espacio.',
      bloques: [
        ['Sacar los pendientes de la cabeza', [
          'Los pendientes sin terminar tienden a volver a la mente una y otra vez.',
          'Masicampo y Baumeister (2011) encontraron que hacer un plan concreto para un pendiente redujo esa intrusión, aunque todavía no se hubiera hecho.',
          'David Allen, en "Getting Things Done", propone capturar todo en un solo lugar de confianza: una lista, una nota del celular, la app.',
        ]],
        ['Siguiente paso concreto', [
          'Un pendiente como "arreglar lo del carro" no se hace porque no dice qué hacer.',
          'Conviértelo en el siguiente paso físico: "llamar al taller de la 30 para pedir cita".',
          'Si algo toma menos de 2 minutos, hazlo de una vez (regla de Allen).',
          'Lo que tiene fecha va al calendario o a 🔔 Recordatorios; lo demás, a una lista de tareas.',
        ]],
        ['La revisión semanal', [
          'Una vez por semana, 20 a 30 minutos, a la misma hora (por ejemplo, el domingo en la tarde).',
          'Vacía todo lo que anotaste suelto, revisa la semana pasada (qué salió, qué no) y mira el calendario de la que viene.',
          'Escoge las 3 prioridades de la semana y agenda los bloques de trabajo profundo y los entrenos.',
          'Deja descanso y sueño en el plan: sin dormir bien, ningún sistema funciona.',
        ]],
      ],
      ejemplos: [
        'El domingo a las 6 p. m. haces tu revisión: anotas lo que tenías en la cabeza (pagar el SOAT, cumpleaños de tu mamá, entregar el informe), lo pasas a la app y escoges tus 3 prioridades. El lunes arrancas sabiendo qué hacer.',
        'Llevas días con "organizar los papeles de la declaración de renta" dando vueltas en la cabeza. Lo conviertes en "el sábado a las 9 a. m., descargar el certificado de ingresos y retenciones" y lo pones en el calendario. Esa noche duermes más tranquilo.',
      ],
      practica: [
        'Haz una descarga mental: escribe en un solo lugar todos los pendientes que tienes en la cabeza.',
        'Convierte tres de ellos en el siguiente paso físico y concreto.',
        'Agenda en el calendario tu revisión semanal (20 a 30 minutos, mismo día y hora).',
      ],
      pregunta: '¿Qué pendiente me lleva días dando vueltas en la cabeza, y cuál es su siguiente paso concreto?',
      nota: 'Se suele citar el "efecto Zeigarnik" para decir que recordamos mejor lo que quedó sin terminar. Las réplicas de ese efecto de memoria son mixtas; lo mejor respaldado es que las metas pendientes generan pensamientos que interrumpen, y que hacer un plan los calma. Tampoco hay un sistema perfecto: el mejor es el más sencillo que de verdad uses cada semana. Si el estrés o la sensación de no poder con todo no bajan, consulta con un profesional de salud mental.',
      recordar: [
        ['¿Qué encontraron Masicampo y Baumeister sobre los pendientes?', 'Que hacer un plan concreto reduce los pensamientos intrusivos de un pendiente, aunque todavía no se haga.'],
        ['¿Qué propone David Allen para empezar?', 'Capturar todos los pendientes en un solo lugar de confianza.'],
        ['¿Qué es el siguiente paso concreto?', 'La acción física siguiente para avanzar un pendiente: "llamar al taller", no "arreglar lo del carro".'],
        ['¿Qué incluye la revisión semanal?', 'Vaciar lo anotado, revisar la semana pasada, mirar el calendario y escoger 3 prioridades con sus bloques.'],
      ],
      tarjetas: [
        ['Plan para un pendiente (Masicampo y Baumeister)', 'Hacer un plan concreto calma el pendiente que da vueltas en la cabeza, aunque no se haya hecho.'],
        ['Siguiente paso + regla de 2 minutos', 'Cada pendiente se vuelve una acción física concreta. Si toma menos de 2 minutos, hazlo ya.'],
        ['Revisión semanal', '20-30 minutos fijos: vaciar pendientes, revisar la semana, mirar el calendario y escoger 3 prioridades.'],
      ],
    }),
  ],
};

export default {
  id: 'habitos-productividad',
  nombre: 'Hábitos, productividad y organización personal',
  area: 'habitos',
  icono: '⚡',
  nivel: 'Básico',
  paraQue: 'Crear hábitos que se sostengan solos, dejar los que no te sirven sin depender de la fuerza de voluntad y organizar tu semana para que lo importante tenga tiempo. Es la base para que el gym, la dieta, el estudio y las finanzas avancen todos los días y no solo cuando hay motivación.',
  modulos: [HABITOS, CAMBIAR, ORGANIZAR],
  proyecto: {
    titulo: 'Un hábito nuevo y tu sistema semanal en 4 semanas',
    intro: 'Durante 4 semanas vas a instalar un hábito nuevo con todo lo del curso y a montar tu sistema semanal. Al final tendrás el hábito en marcha y una forma de organizarte que puedes mantener.',
    pasos: [
      'Escoge un hábito nuevo que te acerque a una meta importante y escribe su versión de menos de 30 segundos.',
      'Escribe el plan "si-entonces" con un ancla que ya tengas todos los días.',
      'Cambia tu entorno: quita un paso al hábito nuevo y agrega uno a un hábito que quieras reducir.',
      'Registra el hábito cada día en la app y elige una recompensa inmediata; tu regla para los fallos: nunca dos veces seguidas.',
      'Haz una descarga mental de todos tus pendientes y conviértelos en siguientes pasos concretos.',
      'Cada domingo, haz la revisión semanal: 3 prioridades, bloques de trabajo profundo y entrenos en el calendario.',
      'Al final de cada semana, anota cuántos días hiciste el hábito y qué te frenó, y ajusta una sola cosa.',
      'Al terminar las 4 semanas, compara el total de días de la semana 1 con el de la semana 4 y decide si subes la versión del hábito.',
    ],
  },
};
