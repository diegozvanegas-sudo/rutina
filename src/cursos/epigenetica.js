// Epigenética: cómo el ambiente enciende y apaga genes, sin exagerar lo que dice la ciencia. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const BASES = {
  titulo: 'Qué es la epigenética',
  objetivo: 'Entender la diferencia entre los genes y su uso, conocer los mecanismos básicos (metilación e histonas) y ver qué muestran los gemelos sobre genes, ambiente y epigenética.',
  fuentes: [
    ['Waddington, C. H. (1942). The epigenotype. Endeavour, 1, 18-20.', 'El origen del término "epigenética".'],
    ['Bird, A. (2007). Perceptions of epigenetics. Nature, 447(7143), 396-398.', 'Qué entienden los científicos por epigenética hoy.'],
    ['Allis, C. D. y Jenuwein, T. (2016). The molecular hallmarks of epigenetic control. Nature Reviews Genetics, 17(8), 487-500.', 'Los mecanismos moleculares de la epigenética.'],
    ['Jaenisch, R. y Bird, A. (2003). Epigenetic regulation of gene expression: How the genome integrates intrinsic and environmental signals. Nature Genetics, 33(S3), 245-254.', 'Cómo la metilación y las histonas regulan los genes.'],
    ['Lyon, M. F. (1961). Gene action in the X-chromosome of the mouse (Mus musculus L.). Nature, 190, 372-373.', 'La inactivación del cromosoma X.'],
    ['Fraga, M. F. et al. (2005). Epigenetic differences arise during the lifetime of monozygotic twins. Proceedings of the National Academy of Sciences, 102(30), 10604-10609.', 'Los gemelos idénticos se van diferenciando epigenéticamente con la edad.'],
    ['Polderman, T. J. C. et al. (2015). Meta-analysis of the heritability of human traits based on fifty years of twin studies. Nature Genetics, 47(7), 702-709.', 'Cincuenta años de estudios de gemelos: genes y ambiente pesan casi igual en promedio.'],
  ],
  lecciones: [
    l('Genes y su uso: la partitura y la interpretación', 10, {
      idea: 'Todas tus células tienen casi el mismo ADN, pero una neurona y una célula de la piel son muy distintas. La diferencia está en qué genes se usan y cuáles no: eso regula la epigenética.',
      bloques: [
        ['El ADN es la partitura', [
          'El ADN contiene las instrucciones para fabricar proteínas: los genes. Casi todas tus células tienen el mismo ADN.',
          'Lo que cambia entre una célula del hígado y una del ojo es qué genes están activos.',
          'Una metáfora útil: el ADN es la partitura, y la epigenética decide qué partes se tocan, cuándo y con qué volumen.',
        ]],
        ['Qué significa "epigenética"', [
          'El biólogo Conrad Waddington usó la palabra en 1942 para hablar de cómo los genes producen el cuerpo durante el desarrollo.',
          'Hoy, como explica Adrian Bird (2007), se usa para cambios en la actividad de los genes que no alteran la secuencia del ADN y que se pueden mantener cuando las células se dividen.',
          '"Epi" significa "encima": son marcas que están sobre el ADN, no cambios en las letras.',
        ]],
        ['Por qué importa', [
          'La epigenética explica cómo se forman los distintos tejidos a partir de una sola célula.',
          'También es una de las vías por las que el ambiente (nutrición, estrés, cigarrillo, edad) puede influir en la actividad de los genes.',
          'Pero no es magia: la mayoría de las marcas epigenéticas son estables, específicas de cada tejido y no las cambias con la mente.',
        ]],
      ],
      ejemplos: [
        'Una oruga y la mariposa en la que se convierte tienen el mismo ADN. Lo que cambia por completo su cuerpo es qué genes se activan en cada etapa.',
        'Tu célula del músculo del brazo y tu neurona del cerebro tienen las mismas "instrucciones", pero cada una usa solo las que necesita. Por eso el gym cambia tu músculo y no tu ADN.',
      ],
      practica: [
        'Explica con tus palabras, a alguien o en el diario, la diferencia entre el ADN y la epigenética usando la metáfora de la partitura.',
        'Busca una publicidad o publicación que use la palabra "epigenética" y anota qué promete.',
        'Escribe una pregunta que tengas sobre tus genes y tu salud para revisarla al final del curso.',
      ],
      pregunta: '¿Qué he oído sobre "mis genes" que me haya hecho sentir condenado o, al revés, todopoderoso?',
      nota: 'La metáfora de la partitura (o de los interruptores que "encienden y apagan" genes) ayuda a entender, pero simplifica: la regulación de los genes es gradual y depende de muchos factores a la vez, no de un interruptor. Además, la palabra "epigenética" se usa con significados distintos en distintos campos, lo que genera confusión. Este curso usa el significado molecular actual.',
      recordar: [
        ['¿Por qué una neurona y una célula de la piel son distintas si tienen el mismo ADN?', 'Porque usan genes distintos: la epigenética regula cuáles están activos.'],
        ['¿Qué significa hoy "epigenética"?', 'Cambios en la actividad de los genes que no alteran la secuencia del ADN y se mantienen al dividirse las células.'],
        ['¿Quién usó primero la palabra epigenética?', 'Conrad Waddington, en 1942.'],
        ['¿Las marcas epigenéticas cambian el ADN?', 'No: son marcas sobre el ADN, no cambios en sus letras.'],
      ],
      tarjetas: [
        ['Epigenética', 'Cambios en qué genes se usan, sin cambiar la secuencia del ADN.'],
        ['La partitura', 'El ADN es la partitura; la epigenética decide qué partes se tocan y cuándo (metáfora simplificada).'],
        ['Mismo ADN, distintas células', 'Neuronas, músculo y piel tienen el mismo ADN; cambia qué genes están activos.'],
      ],
    }),
    l('Los mecanismos: metilación e histonas', 11, {
      idea: 'Las dos marcas epigenéticas más estudiadas son la metilación del ADN, que suele apagar genes, y las modificaciones de las histonas, que abren o cierran el acceso al ADN.',
      bloques: [
        ['La metilación del ADN', [
          'Es agregar un pequeño grupo químico (metilo) a ciertos puntos del ADN.',
          'Cuando la zona que controla un gen está muy metilada, ese gen suele estar apagado (Jaenisch y Bird, 2003).',
          'Estas marcas se copian cuando la célula se divide, por eso una célula de la piel sigue siendo de piel.',
        ]],
        ['Las histonas', [
          'El ADN de cada célula mide unos dos metros estirado. Para caber en el núcleo, se enrolla alrededor de proteínas llamadas histonas, como hilo en un carrete.',
          'Las histonas pueden recibir marcas químicas que aflojan o aprietan el enrollado (Allis y Jenuwein, 2016).',
          'ADN flojo: los genes se pueden leer. ADN apretado: quedan escondidos.',
        ]],
        ['Un ejemplo visible: los gatos de tres colores', [
          'Las hembras de mamíferos tienen dos cromosomas X, y en cada célula uno se apaga al azar al comienzo del desarrollo (Lyon, 1961).',
          'En las gatas carey o de tres colores, los genes del color del pelo están en el X. Según cuál X se apagó en cada zona de la piel, el pelo sale de un color u otro.',
          'Por eso una gata clonada puede tener un patrón de manchas distinto al de la original: mismo ADN, distinta epigenética.',
        ]],
      ],
      ejemplos: [
        'Las mujeres también tienen ese "mosaico" de cromosomas X: en algunas enfermedades ligadas al X, los síntomas varían según qué X quedó activo en cada tejido.',
        'Algunos medicamentos para ciertos cánceres de la sangre actúan quitando metilación del ADN, para "reactivar" genes que frenan el crecimiento de las células.',
      ],
      practica: [
        'Dibuja en una hoja el ADN enrollado en histonas: una parte floja (genes activos) y una apretada (genes apagados).',
        'Busca la foto de una gata de tres colores y explícale a alguien por qué tiene ese patrón.',
        'Agrega a tus tarjetas de repaso la diferencia entre metilación e histonas con tus propias palabras.',
      ],
      pregunta: '¿Qué me sorprendió de saber que gemelos o clones con el mismo ADN pueden ser distintos?',
      nota: 'Se suele decir "la metilación apaga genes" como regla. Es cierto para las zonas que controlan el inicio de muchos genes, pero la metilación dentro del cuerpo de un gen puede tener otros efectos, y la relación no es siempre directa. Además, existen otros mecanismos epigenéticos (ARN no codificantes, organización del núcleo) que no vemos aquí.',
      recordar: [
        ['¿Qué es la metilación del ADN?', 'Agregar un grupo metilo a ciertos puntos del ADN; en las zonas de control suele apagar el gen.'],
        ['¿Qué son las histonas?', 'Proteínas alrededor de las que se enrolla el ADN; sus marcas aflojan o aprietan el enrollado.'],
        ['¿Por qué las gatas de tres colores tienen ese patrón?', 'Porque en cada zona de la piel se apagó al azar uno de sus dos cromosomas X, que llevan genes del color.'],
        ['¿Por qué una gata clonada puede verse distinta a la original?', 'Porque tiene el mismo ADN, pero el X que se apaga en cada zona es al azar.'],
      ],
      tarjetas: [
        ['Metilación del ADN', 'Una marca química que, en la zona de control de un gen, suele apagarlo. Se copia al dividirse la célula.'],
        ['Histonas', 'El ADN se enrolla en ellas. Flojo: genes legibles. Apretado: genes escondidos.'],
        ['Gatas de tres colores', 'Cada zona apaga al azar un cromosoma X: mismo ADN, distinto patrón.'],
      ],
    }),
    l('Gemelos: genes, ambiente y epigenética', 10, {
      idea: 'Los gemelos idénticos comparten el ADN, pero se van diferenciando con la edad, también en su epigenética. Los estudios de gemelos muestran que, en promedio, genes y ambiente pesan parecido.',
      bloques: [
        ['Gemelos que se diferencian', [
          'Fraga y otros (2005) compararon la epigenética de gemelos idénticos de distintas edades.',
          'Los gemelos jóvenes eran casi iguales; los mayores tenían más diferencias, sobre todo si habían vivido separados o con estilos de vida distintos.',
          'El ambiente y el azar van dejando marcas distintas aunque el ADN sea el mismo.',
        ]],
        ['Cincuenta años de gemelos', [
          'Polderman y otros (2015) juntaron casi todos los estudios de gemelos de los últimos 50 años, sobre miles de rasgos.',
          'En promedio, los genes explicaban cerca de la mitad de las diferencias entre personas, y el ambiente la otra mitad, con mucha variación según el rasgo.',
          'Para casi ningún rasgo los genes lo explicaban todo ni nada.',
        ]],
        ['Lo que esto significa', [
          'Ni "todo está en los genes" ni "todo es ambiente": casi siempre es una mezcla.',
          'Heredabilidad no es destino: que un rasgo sea muy heredable en una población no significa que no se pueda cambiar en una persona (la estatura es muy heredable y aun así mejoró con la nutrición).',
          'La epigenética es una de las formas en que genes y ambiente se encuentran, pero no la única.',
        ]],
      ],
      ejemplos: [
        'Dos hermanos gemelos idénticos de Medellín: uno fuma desde los 18 y trabaja de noche; el otro hace deporte y duerme bien. A los 50 se ven y se sienten distintos, y su epigenética también lo es, aunque nacieron con el mismo ADN.',
        'En tu familia hay diabetes y piensas que "ya te toca". Los genes aumentan el riesgo, pero el ejercicio, la alimentación y el peso cambian mucho la probabilidad. Ni condena ni inmunidad.',
      ],
      practica: [
        'Escribe un rasgo o enfermedad que "viene de familia" y qué parte de su riesgo depende de tus hábitos.',
        'Si conoces gemelos, pregúntales en qué se parecen y en qué se han ido diferenciando.',
        'Escoge un hábito (sueño, ejercicio, cigarrillo, alimentación) que puedas mejorar este mes, independientemente de tus genes.',
      ],
      pregunta: '¿Qué he dado por "genético e inevitable" cuando en realidad mis hábitos también pesan?',
      nota: 'La heredabilidad se malinterpreta mucho: un 50 % no significa que "la mitad de tu inteligencia viene de tus papás", sino que, en esa población y ese ambiente, la mitad de las diferencias entre personas se asocian a diferencias genéticas. Además, los estudios de gemelos tienen supuestos discutidos. Y que los gemelos se diferencien epigenéticamente no prueba que cada diferencia cause algo visible.',
      recordar: [
        ['¿Qué encontraron Fraga y otros en gemelos idénticos?', 'Que se diferencian epigenéticamente con la edad, más si vivieron separados o con estilos de vida distintos.'],
        ['¿Qué concluyó el metaanálisis de Polderman (2015)?', 'Que en promedio genes y ambiente explican cada uno cerca de la mitad de las diferencias, con mucha variación.'],
        ['¿Heredabilidad alta significa que no se puede cambiar?', 'No: la estatura es muy heredable y aun así cambió con la nutrición.'],
        ['¿Qué significa una heredabilidad del 50 %?', 'Que en esa población, la mitad de las diferencias entre personas se asocian a diferencias genéticas.'],
      ],
      tarjetas: [
        ['Gemelos que se separan (Fraga, 2005)', 'Mismo ADN, epigenética cada vez más distinta con la edad y los estilos de vida.'],
        ['Genes y ambiente (Polderman, 2015)', 'En promedio, cerca de mitad y mitad. Casi nada es solo genes ni solo ambiente.'],
        ['Heredabilidad no es destino', 'Habla de diferencias en una población, no de lo que puedes cambiar tú.'],
      ],
    }),
  ],
};

const AMBIENTE = {
  titulo: 'El ambiente deja marcas',
  objetivo: 'Conocer los estudios más famosos sobre cómo la nutrición, el estrés y el paso del tiempo dejan marcas epigenéticas, y qué tan seguros podemos estar de lo que significan en humanos.',
  fuentes: [
    ['Waterland, R. A. y Jirtle, R. L. (2003). Transposable elements: Targets for early nutritional effects on epigenetic gene regulation. Molecular and Cellular Biology, 23(15), 5293-5300.', 'Los ratones agouti: la dieta de la madre cambió el color y el peso de las crías.'],
    ['Heijmans, B. T. et al. (2008). Persistent epigenetic differences associated with prenatal exposure to famine in humans. Proceedings of the National Academy of Sciences, 105(44), 17046-17049.', 'El invierno del hambre en Holanda y sus marcas epigenéticas.'],
    ['Roseboom, T., de Rooij, S. y Painter, R. (2006). The Dutch famine and its long-term consequences for adult health. Early Human Development, 82(8), 485-491.', 'La salud de quienes estuvieron en el vientre durante la hambruna.'],
    ['Weaver, I. C. G. et al. (2004). Epigenetic programming by maternal behavior. Nature Neuroscience, 7(8), 847-854.', 'El cuidado de la madre rata cambió la epigenética del estrés en las crías.'],
    ['McGowan, P. O. et al. (2009). Epigenetic regulation of the glucocorticoid receptor in human brain associates with childhood abuse. Nature Neuroscience, 12(3), 342-348.', 'Maltrato infantil y marcas epigenéticas en humanos.'],
    ['Horvath, S. (2013). DNA methylation age of human tissues and cell types. Genome Biology, 14(10), R115.', 'El reloj epigenético.'],
    ['Lu, A. T. et al. (2019). DNA methylation GrimAge strongly predicts lifespan and healthspan. Aging, 11(2), 303-327.', 'Un reloj epigenético que predice mortalidad.'],
  ],
  lecciones: [
    l('La nutrición y el hambre', 10, {
      idea: 'Lo que come la madre durante el embarazo puede dejar marcas epigenéticas en el bebé. Los ratones agouti y la hambruna holandesa son los ejemplos más famosos.',
      bloques: [
        ['Los ratones agouti', [
          'Existe una cepa de ratones con una variante de un gen (agouti) que, cuando está activa, los hace amarillos, obesos y propensos a enfermedades.',
          'Waterland y Jirtle (2003) dieron a madres de esa cepa una dieta rica en donantes de metilo (como ácido fólico y vitamina B12) durante el embarazo.',
          'Más crías nacieron cafés y delgadas: la dieta aumentó la metilación de ese gen y lo apagó, sin cambiar el ADN.',
        ]],
        ['El invierno del hambre', [
          'En el invierno de 1944-45, el oeste de Holanda sufrió una hambruna severa por la guerra.',
          'Roseboom y su equipo (2006) siguieron a personas que estaban en el vientre durante la hambruna: según el momento del embarazo, tenían más riesgo de obesidad, enfermedad cardiaca y otros problemas en la adultez.',
          'Heijmans y otros (2008) encontraron que, seis décadas después, quienes estuvieron expuestos al comienzo del embarazo tenían menos metilación en un gen relacionado con el crecimiento (IGF2) que sus hermanos no expuestos.',
        ]],
        ['Lo que podemos concluir', [
          'La nutrición temprana importa y puede dejar marcas duraderas.',
          'En humanos, las diferencias epigenéticas encontradas son pequeñas y no está claro cuánto causan los problemas de salud observados.',
          'La conclusión práctica no es exótica: una buena nutrición en el embarazo (con control médico) es importante.',
        ]],
      ],
      ejemplos: [
        'Una amiga embarazada lee que "lo que comes programa los genes de tu bebé" y se angustia por cada comida. La evidencia apoya comer bien y tomar los suplementos que indique el médico, no obsesionarse con cada bocado.',
        'Un abuelo que nació en una época de escasez tiene más problemas de corazón que sus hermanos menores. No se puede saber en un caso individual si fue por la epigenética, pero estudios como el holandés sugieren que la nutrición temprana puede influir.',
      ],
      practica: [
        'Si tú o alguien cercano planea un embarazo, anoten preguntar en el control prenatal por la nutrición y los suplementos.',
        'Escribe con tus palabras qué mostraron los ratones agouti y por qué no es lo mismo en humanos.',
        'Revisa en 🥗 Dieta si tu alimentación de esta semana incluye variedad de frutas, verduras y proteínas.',
      ],
      pregunta: '¿Cómo pudo influir la nutrición de mi infancia o la de mis padres en mi salud de hoy?',
      nota: 'Los ratones agouti son un caso especial: esa variante del gen es inusualmente sensible a la metilación, y los efectos tan visibles no se ven en la mayoría de genes ni de especies. Se suelen usar como foto de "la dieta cambia tus genes", pero en humanos los efectos medidos son mucho más sutiles. Ningún alimento o suplemento "reprograma" tus genes de forma comprobada.',
      recordar: [
        ['¿Qué pasó con los ratones agouti cuando la madre comió más donantes de metilo?', 'Más crías nacieron cafés y delgadas porque la metilación apagó el gen agouti.'],
        ['¿Qué fue el invierno del hambre?', 'Una hambruna severa en Holanda en 1944-45, durante la guerra.'],
        ['¿Qué encontraron Heijmans y otros (2008)?', 'Menos metilación en el gen IGF2 en quienes estuvieron expuestos al comienzo del embarazo, seis décadas después.'],
        ['¿Por qué los ratones agouti no se aplican directo a humanos?', 'Porque esa variante es inusualmente sensible; en humanos los efectos medidos son mucho más sutiles.'],
      ],
      tarjetas: [
        ['Ratones agouti (Waterland y Jirtle)', 'La dieta de la madre apagó un gen por metilación: crías cafés y delgadas. Es un caso especial.'],
        ['Invierno del hambre holandés', 'La exposición a la hambruna en el vientre se asoció con marcas epigenéticas y riesgos de salud décadas después.'],
        ['Nutrición en el embarazo', 'Importa y puede dejar marcas, pero ningún alimento "reprograma" tus genes de forma comprobada.'],
      ],
    }),
    l('El estrés y el cuidado', 10, {
      idea: 'En ratas, el cuidado de la madre cambió la epigenética de los genes del estrés en las crías. En humanos hay hallazgos parecidos con el maltrato infantil, pero son más difíciles de interpretar.',
      bloques: [
        ['Las ratas lamidas', [
          'Algunas madres rata lamen y acicalan mucho a sus crías; otras, poco.',
          'Weaver y otros (2004) encontraron que las crías de madres muy cuidadoras tenían menos metilación en un gen que ayuda a frenar la respuesta al estrés (el receptor de glucocorticoides) y manejaban mejor el estrés de adultas.',
          'Cuando las crías se intercambiaban de madre al nacer, el efecto seguía al cuidado, no a la madre biológica.',
        ]],
        ['En humanos', [
          'McGowan y otros (2009) estudiaron el cerebro de personas fallecidas por suicidio y encontraron que quienes habían sufrido maltrato en la infancia tenían más metilación en ese mismo tipo de gen que quienes no.',
          'Es un hallazgo importante, pero con pocas personas, en cerebros después de la muerte y sin poder probar que la marca causó lo demás.',
          'Muchos estudios en humanos miden la epigenética en sangre o saliva, que no siempre refleja lo que pasa en el cerebro.',
        ]],
        ['Lo que significa para la vida', [
          'El cuidado temprano y el estrés severo pueden dejar huellas biológicas, y la epigenética es una de las vías posibles.',
          'Esas huellas no son una condena: las relaciones, la terapia y los cambios de ambiente también tienen efectos.',
          'Proteger a los niños del maltrato y apoyar a las familias es la conclusión práctica más clara.',
        ]],
      ],
      ejemplos: [
        'Alguien que tuvo una infancia muy dura lee que "el trauma queda grabado en tus genes para siempre" y siente que no hay nada que hacer. La evidencia muestra que el estrés temprano puede dejar huellas, pero también que la terapia y las relaciones de apoyo ayudan mucho.',
        'Una fundación del barrio apoya a mamás jóvenes con visitas en casa y acompañamiento. Ese tipo de apoyo al cuidado temprano es justo lo que la investigación sugiere que protege a los niños.',
      ],
      practica: [
        'Escribe con tus palabras qué mostró el estudio de las ratas y por qué es más difícil estudiar lo mismo en humanos.',
        'Piensa en una forma concreta de apoyar a una familia con niños pequeños en tu entorno.',
        'Si cargas con experiencias difíciles de la infancia, anota si te gustaría hablar de eso con un profesional.',
      ],
      pregunta: '¿Qué creencias tengo sobre lo que "me marcó para siempre", y qué evidencia hay de que no es una condena?',
      nota: 'La frase "el trauma se hereda en tus genes" se volvió muy popular, pero va mucho más allá de la evidencia. En animales los hallazgos son sólidos; en humanos hay asociaciones, muchas con muestras pequeñas, tejidos indirectos (sangre) y efectos pequeños. Si el pasado te pesa, la psicoterapia tiene evidencia de que ayuda. En Colombia puedes pedir cita de psicología en tu EPS, y si sospechas maltrato infantil, reportarlo al ICBF (línea 141).',
      recordar: [
        ['¿Qué encontraron Weaver y otros con las ratas?', 'Que las crías de madres muy cuidadoras tenían menos metilación en un gen del estrés y manejaban mejor el estrés de adultas.'],
        ['¿Qué pasó al intercambiar las crías de madre?', 'El efecto siguió al cuidado, no a la madre biológica.'],
        ['¿Qué encontraron McGowan y otros en humanos?', 'Más metilación en un gen del estrés en personas que sufrieron maltrato infantil.'],
        ['¿Por qué son más difíciles de interpretar los estudios en humanos?', 'Por muestras pequeñas, tejidos indirectos como la sangre y la imposibilidad de probar causa.'],
      ],
      tarjetas: [
        ['Ratas y cuidado materno (Weaver, 2004)', 'Más cuidado, menos metilación en un gen del estrés y mejor manejo del estrés. El efecto siguió al cuidado.'],
        ['Maltrato y epigenética en humanos', 'Hay asociaciones, pero con muestras pequeñas y sin probar causa.'],
        ['Huella, no condena', 'El estrés temprano puede dejar huellas; las relaciones y la terapia también tienen efectos.'],
      ],
    }),
    l('Los relojes epigenéticos', 10, {
      idea: 'La metilación del ADN cambia con la edad de forma tan regular que se puede usar para estimar la edad biológica. Es una herramienta prometedora de investigación, no todavía un examen confiable para decidir sobre tu salud.',
      bloques: [
        ['Cómo funciona el reloj', [
          'Steve Horvath (2013) encontró un conjunto de puntos del ADN cuya metilación cambia con la edad de forma muy predecible en casi todos los tejidos.',
          'Con esa información se puede estimar la edad de una persona con bastante precisión a partir de una muestra.',
          'Cuando la "edad epigenética" es mayor que la edad real, se habla de envejecimiento acelerado.',
        ]],
        ['Lo que predicen', [
          'Relojes más nuevos, como GrimAge (Lu y otros, 2019), se diseñaron para predecir mortalidad y enfermedad, y lo hacen mejor que la edad sola en estudios de poblaciones.',
          'Factores como el cigarrillo, la obesidad y el estrés crónico se asocian con relojes más "adelantados".',
          'Algunos estudios pequeños sugieren que cambios de estilo de vida podrían "atrasar" el reloj, pero falta confirmarlo con estudios grandes.',
        ]],
        ['Los tests comerciales', [
          'Hoy se venden pruebas de "edad biológica" por internet.',
          'Los resultados pueden variar entre laboratorios y entre muestras de la misma persona, y no hay consenso sobre qué hacer con ellos.',
          'Lo que reduce el riesgo de enfermar ya lo sabemos sin el test: no fumar, moverse, dormir, comer bien, cuidar la presión y la salud mental.',
        ]],
      ],
      ejemplos: [
        'Ves en Instagram un test de "edad biológica" por 600.000 pesos que te dice si envejeces rápido. Con esa plata podrías pagar meses de gimnasio o una consulta médica preventiva, que tienen más evidencia de mejorar tu salud.',
        'Un estudio encuentra que fumadores tienen relojes epigenéticos más adelantados. No necesitas medir tu reloj para saber que dejar el cigarrillo es de lo mejor que puedes hacer por tu salud.',
      ],
      practica: [
        'Escribe los hábitos que, según la evidencia, se asocian con un envejecimiento más lento y marca cuáles cumples.',
        'Escoge uno para mejorar este mes y regístralo en 🎯 Metas.',
        'Si ves un test de "edad biológica", pregúntate qué harías distinto con el resultado.',
      ],
      pregunta: '¿Qué hábito sé que me está envejeciendo más rápido y no necesito un test para comprobarlo?',
      nota: 'Los relojes epigenéticos son de los avances más interesantes de la biología del envejecimiento, pero se exageran en el mercadeo de "antienvejecimiento". Que un producto o suplemento "rejuvenezca tu reloj epigenético" en un estudio pequeño no significa que alargue tu vida. Para decisiones de salud, consulta a un médico y desconfía de quien venda el test y el tratamiento a la vez.',
      recordar: [
        ['¿Qué descubrió Horvath (2013)?', 'Un conjunto de puntos del ADN cuya metilación permite estimar la edad con mucha precisión.'],
        ['¿Qué es el envejecimiento acelerado en términos epigenéticos?', 'Que la edad epigenética es mayor que la edad real.'],
        ['¿Qué predice el reloj GrimAge?', 'Mortalidad y enfermedad, mejor que la edad sola en estudios de poblaciones.'],
        ['¿Por qué no conviene confiar en los tests comerciales?', 'Sus resultados varían y no hay consenso sobre qué hacer con ellos.'],
      ],
      tarjetas: [
        ['Reloj epigenético (Horvath, 2013)', 'La metilación cambia con la edad de forma predecible: permite estimar la edad biológica.'],
        ['Qué lo adelanta', 'Cigarrillo, obesidad y estrés crónico se asocian con relojes más adelantados.'],
        ['Tests comerciales', 'Varían y no está claro qué hacer con el resultado. Los hábitos sanos se saben sin test.'],
      ],
    }),
  ],
};

const LIMITES = {
  titulo: 'Herencia, medicina y mitos',
  objetivo: 'Separar lo que se sabe de lo que se exagera sobre heredar marcas epigenéticas, conocer su uso real en medicina y reconocer los mitos que usan la palabra "epigenética" para vender.',
  fuentes: [
    ['Heard, E. y Martienssen, R. A. (2014). Transgenerational epigenetic inheritance: Myths and mechanisms. Cell, 157(1), 95-109.', 'Qué se sabe y qué no sobre heredar marcas epigenéticas.'],
    ['Dias, B. G. y Ressler, K. J. (2014). Parental olfactory experience influences behavior and neural structure in subsequent generations. Nature Neuroscience, 17(1), 89-96.', 'Ratones que "heredaron" el miedo a un olor.'],
    ['Yehuda, R. et al. (2016). Holocaust exposure induced intergenerational effects on FKBP5 methylation. Biological Psychiatry, 80(5), 372-380.', 'Hijos de sobrevivientes del Holocausto (estudio pequeño y criticado).'],
    ['Esteller, M. (2008). Epigenetics in cancer. New England Journal of Medicine, 358(11), 1148-1159.', 'El papel de la epigenética en el cáncer.'],
    ['Deichmann, U. (2016). Epigenetics: The origins and evolution of a fashionable topic. Developmental Biology, 416(1), 249-254.', 'Cómo la epigenética se volvió un tema de moda y se exageró.'],
    ['Carey, N. (2012). The Epigenetics Revolution. Columbia University Press. (En español: La revolución epigenética).', 'Introducción para todo público, con sus límites.'],
  ],
  lecciones: [
    l('¿Se heredan las experiencias de los padres?', 11, {
      idea: 'En plantas y gusanos, algunas marcas epigenéticas pasan de generación en generación. En mamíferos, la mayoría se borra al formarse los óvulos, los espermatozoides y el embrión, y la evidencia de herencia de experiencias es limitada y discutida.',
      bloques: [
        ['El gran borrado', [
          'Heard y Martienssen (2014) explican que en los mamíferos hay dos grandes "borrados" de marcas epigenéticas: al formarse las células reproductivas y poco después de la fecundación.',
          'Por eso, la mayoría de las marcas que adquieres en la vida no pasan a tus hijos.',
          'En plantas y en el gusano C. elegans sí hay herencia epigenética bien documentada por varias generaciones.',
        ]],
        ['Los ratones y el olor', [
          'Dias y Ressler (2014) entrenaron ratones machos a temerle a un olor (asociándolo a un pequeño choque).',
          'Sus crías y nietos, que nunca fueron entrenados, reaccionaban más a ese olor.',
          'Fue un estudio muy citado, pero otros investigadores señalaron problemas estadísticos y no se ha replicado de forma convincente.',
        ]],
        ['En humanos', [
          'Yehuda y otros (2016) encontraron diferencias de metilación en hijos de sobrevivientes del Holocausto. El estudio tenía pocas personas y recibió críticas metodológicas.',
          'En humanos es muy difícil separar la herencia epigenética de lo que se transmite por la crianza, la cultura, el ambiente compartido y el propio estrés de los padres.',
          'Que el sufrimiento de una generación afecte a la siguiente es real; que sea por herencia epigenética, no está demostrado.',
        ]],
      ],
      ejemplos: [
        'Lees que "el dolor de tus ancestros vive en tu ADN" y que necesitas una terapia especial para "sanar tu linaje". La evidencia científica no respalda esa idea; si sientes que historias familiares te afectan, un psicólogo puede ayudarte a trabajarlas.',
        'Muchas familias colombianas cargan con historias de violencia y desplazamiento. Que esas experiencias afecten a hijos y nietos tiene explicaciones sólidas (crianza, pobreza, estrés familiar) aunque no se haya probado una herencia epigenética.',
      ],
      practica: [
        'Escribe con tus palabras por qué la mayoría de marcas epigenéticas no pasan a los hijos en mamíferos.',
        'Piensa en algo que "heredaste" de tu familia (un miedo, un hábito) y en las vías no genéticas por las que pudo llegarte.',
        'Busca una publicación que hable de "trauma heredado en el ADN" y revisa qué estudio cita.',
      ],
      pregunta: '¿Qué patrones de mi familia he atribuido a "la sangre" cuando podrían venir de la crianza o el ambiente?',
      nota: 'Esta es una de las áreas más exageradas de la epigenética. Hay investigadores serios que estudian la herencia intergeneracional y transgeneracional, y algunos resultados en animales son interesantes; pero los titulares de "heredas el trauma de tus abuelos" van mucho más allá de lo demostrado en humanos. Distingue: intergeneracional (el feto expuesto en el vientre) es más plausible; transgeneracional (nietos y bisnietos sin exposición) está mucho menos probado en mamíferos.',
      recordar: [
        ['¿Por qué la mayoría de las marcas epigenéticas no pasan a los hijos en mamíferos?', 'Porque se borran al formarse las células reproductivas y poco después de la fecundación.'],
        ['¿En qué organismos sí está bien documentada la herencia epigenética?', 'En plantas y en el gusano C. elegans.'],
        ['¿Qué pasó con el estudio de los ratones y el olor?', 'Fue muy citado, pero recibió críticas estadísticas y no se ha replicado de forma convincente.'],
        ['¿Por qué es tan difícil probar herencia epigenética en humanos?', 'Porque es difícil separarla de la crianza, la cultura y el ambiente compartido.'],
      ],
      tarjetas: [
        ['El gran borrado', 'En mamíferos, la mayoría de las marcas epigenéticas se borran antes de pasar a los hijos.'],
        ['Herencia epigenética en humanos', 'No está demostrada de forma sólida; el sufrimiento también se transmite por crianza y ambiente.'],
        ['Inter vs. transgeneracional', 'El feto expuesto en el vientre es más plausible; nietos sin exposición, mucho menos probado.'],
      ],
    }),
    l('Epigenética en la medicina', 10, {
      idea: 'Donde la epigenética ya cambia la medicina es en el cáncer: muchas células cancerosas tienen marcas alteradas, y existen medicamentos aprobados que actúan sobre ellas.',
      bloques: [
        ['Cáncer y epigenética', [
          'Manel Esteller (2008) describe que en el cáncer suelen aparecer dos cambios: genes que frenan el crecimiento de las células quedan apagados por exceso de metilación, y otras zonas del ADN pierden metilación.',
          'A diferencia de las mutaciones, estas marcas son en principio reversibles.',
          'Eso abrió la puerta a tratamientos que buscan "reactivar" los genes que frenan el cáncer.',
        ]],
        ['Medicamentos reales', [
          'Existen medicamentos aprobados que reducen la metilación del ADN (como la azacitidina y la decitabina) o que actúan sobre las histonas.',
          'Se usan sobre todo en algunos cánceres de la sangre, como ciertos síndromes mielodisplásicos y leucemias, y siempre bajo control de oncólogos.',
          'La investigación también busca usar marcas epigenéticas en la sangre para detectar cánceres de forma temprana.',
        ]],
        ['Lo que todavía no existe', [
          'No hay tratamientos epigenéticos aprobados para "rejuvenecer", "mejorar el ánimo" o "potenciar la inteligencia".',
          'Las terapias reales son medicamentos fuertes, con efectos secundarios, para enfermedades graves.',
          'Desconfía de clínicas o productos que ofrecen "terapias epigenéticas" para cualquier cosa.',
        ]],
      ],
      ejemplos: [
        'A un familiar le diagnostican un síndrome mielodisplásico y el hematólogo le propone azacitidina. Es un tratamiento epigenético real, con estudios y aprobación, para una enfermedad específica.',
        'En internet ves una "terapia epigenética" con sueros y vitaminas que promete rejuvenecer 10 años. No hay ningún tratamiento epigenético aprobado para eso.',
      ],
      practica: [
        'Escribe la diferencia entre un tratamiento epigenético real (medicamento aprobado para un cáncer) y una "terapia epigenética" comercial.',
        'Si alguien cercano está en tratamiento oncológico, anota preguntas para su médico en vez de buscar remedios en redes.',
        'Busca la página de una entidad regulatoria (en Colombia, el Invima) y revisa cómo verificar si un producto está aprobado.',
      ],
      pregunta: '¿Sé distinguir un tratamiento médico real de una promesa comercial que usa palabras científicas?',
      nota: 'La epigenética del cáncer es un campo sólido y activo, y la detección temprana con marcas en la sangre es prometedora pero todavía en desarrollo: algunos tests ya se venden en otros países sin que esté claro su beneficio para la población general. Ningún tratamiento de este tipo reemplaza la consulta con un oncólogo.',
      recordar: [
        ['¿Qué dos cambios epigenéticos suelen aparecer en el cáncer según Esteller?', 'Genes que frenan el cáncer apagados por exceso de metilación y pérdida de metilación en otras zonas.'],
        ['¿Por qué la epigenética abrió una vía de tratamiento?', 'Porque, a diferencia de las mutaciones, las marcas epigenéticas son en principio reversibles.'],
        ['Nombra un medicamento epigenético aprobado.', 'La azacitidina o la decitabina, usadas en algunos cánceres de la sangre.'],
        ['¿Existen terapias epigenéticas aprobadas para rejuvenecer?', 'No.'],
      ],
      tarjetas: [
        ['Epigenética del cáncer (Esteller)', 'Genes que frenan el cáncer apagados por metilación; las marcas son en principio reversibles.'],
        ['Medicamentos epigenéticos reales', 'Azacitidina y decitabina para algunos cánceres de la sangre, con oncólogo.'],
        ['"Terapias epigenéticas" comerciales', 'No hay tratamientos aprobados para rejuvenecer o potenciar la mente.'],
      ],
    }),
    l('Los mitos de la epigenética', 10, {
      idea: 'La epigenética se volvió una palabra de moda que se usa para vender libros, dietas y terapias. Saber qué dice la ciencia te protege de promesas que van mucho más allá de la evidencia.',
      bloques: [
        ['Una palabra de moda', [
          'Ute Deichmann (2016) muestra cómo la epigenética pasó de ser un campo técnico a un tema de moda, con afirmaciones exageradas sobre su poder.',
          'Algunos libros populares dicen que "tus creencias controlan tus genes" o que "puedes reescribir tu ADN con pensamientos positivos".',
          'Esas ideas no tienen respaldo: el estrés crónico puede tener efectos biológicos, pero no "programas" tus genes con la mente.',
        ]],
        ['Mitos frecuentes', [
          '"La epigenética demuestra que los genes no importan": falso. Los genes importan mucho; la epigenética explica parte de cómo se usan.',
          '"Esta dieta apaga tus genes de la obesidad": no hay evidencia de dietas que reprogramen genes concretos en humanos.',
          '"Epigenética cuántica" o "medicina epigenética energética": mezclan palabras científicas sin base.',
          '"Tu destino está en tus manos al 100 %": tus hábitos importan, pero también los genes, el azar y las condiciones de vida.',
        ]],
        ['Cómo leer una afirmación epigenética', [
          '¿El estudio fue en animales, en células o en personas?',
          '¿Midió una marca epigenética o un resultado de salud? ¿Probó causa o solo asociación?',
          '¿Quien lo dice vende algo relacionado (un test, una dieta, una terapia)?',
          'Lo que reduce tu riesgo de enfermar no depende de entender la epigenética: hábitos sanos, controles médicos y buenas condiciones de vida.',
        ]],
      ],
      ejemplos: [
        'Un coach en redes asegura que "con la epigenética puedes sanar cualquier enfermedad cambiando tus pensamientos". Pensar positivo no cura enfermedades, y abandonar un tratamiento médico por eso puede ser peligroso.',
        'En una conversación, alguien dice "los genes no importan, la epigenética lo demostró". Puedes responder que la epigenética explica cómo se usan los genes, no que dejen de importar.',
      ],
      practica: [
        'Usa las preguntas de la lección para analizar una afirmación sobre epigenética que encuentres en redes.',
        'Escribe con tus palabras qué sí puedes cambiar con tus hábitos y qué no.',
        'Comparte con alguien cercano una idea de este curso que desmiente un mito común.',
      ],
      pregunta: '¿Qué promesa "científica" sobre mi salud he creído porque sonaba esperanzadora?',
      nota: 'Desmontar los mitos no significa que la epigenética no importe: es un campo científico real e importante para entender el desarrollo, el cáncer y el envejecimiento. El problema es saltar de "el ambiente puede influir en la actividad de algunos genes" a "puedes controlar tus genes con la mente". Mantener los pies en la tierra te protege de gastar plata y de abandonar tratamientos que sí funcionan.',
      recordar: [
        ['¿Qué describe Deichmann (2016)?', 'Cómo la epigenética se volvió un tema de moda con afirmaciones exageradas.'],
        ['¿Es cierto que "tus pensamientos reescriben tu ADN"?', 'No: no hay respaldo científico.'],
        ['¿La epigenética demuestra que los genes no importan?', 'No: explica parte de cómo se usan; los genes siguen importando mucho.'],
        ['Nombra tres preguntas para evaluar una afirmación epigenética.', '¿Animales o personas? ¿Asociación o causa? ¿Quien lo dice vende algo?'],
      ],
      tarjetas: [
        ['Mito: los pensamientos reescriben el ADN', 'Sin respaldo. El estrés crónico puede tener efectos biológicos, pero no "programas" tus genes con la mente.'],
        ['Mito: los genes no importan', 'La epigenética explica cómo se usan; los genes siguen importando mucho.'],
        ['Leer una afirmación epigenética', '¿Animales o personas? ¿Asociación o causa? ¿Quien lo dice vende algo?'],
      ],
    }),
  ],
};

export default {
  id: 'epigenetica',
  nombre: 'Epigenética',
  area: 'cerebro',
  icono: '🧬',
  nivel: 'Intermedio',
  paraQue: 'Entender cómo el ambiente (nutrición, estrés, edad) puede influir en la actividad de los genes sin cambiar el ADN, y qué tan sólido es lo que se dice al respecto. Te ayuda a no sentirte condenado por "tus genes" ni a creer promesas que usan la palabra epigenética para vender.',
  modulos: [BASES, AMBIENTE, LIMITES],
  proyecto: {
    titulo: 'Detector de afirmaciones genéticas',
    intro: 'Durante 2 semanas vas a recolectar y analizar afirmaciones sobre genes y epigenética que encuentres (redes, publicidad, conversaciones) y vas a escoger un hábito que dependa de ti para mejorar tu salud.',
    pasos: [
      'Recolecta al menos 6 afirmaciones sobre genes o epigenética que veas en redes, publicidad o conversaciones.',
      'Para cada una, responde: ¿animales o personas? ¿asociación o causa? ¿quien lo dice vende algo?',
      'Clasifícalas en "respaldada", "exagerada" o "sin base".',
      'Escribe una enfermedad o rasgo que "viene de familia" y qué parte del riesgo depende de tus hábitos.',
      'Escoge un hábito con buena evidencia para tu salud (no fumar, moverte, dormir, comer mejor) y regístralo en 🎯 Metas durante las 2 semanas.',
      'Explícale a alguien cercano, con la metáfora de la partitura, qué es la epigenética.',
      'Al final, escribe qué mito te sorprendió más y qué hábito vas a mantener.',
    ],
  },
};
