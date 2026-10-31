// Geometría sagrada: historia de las ideas. Cada lección separa "Qué dice la tradición" de "Qué muestra la evidencia".
// Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const MATEMATICA = {
  titulo: 'La matemática real',
  objetivo: 'Entender las bases matemáticas reales que usa la geometría sagrada: la proporción áurea, la sucesión de Fibonacci y los sólidos platónicos, y dónde aparecen de verdad en la naturaleza.',
  fuentes: [
    ['Livio, M. (2002). The Golden Ratio: The story of phi, the world’s most astonishing number. Broadway Books. (En español: La proporción áurea, Ariel).', 'Historia de la proporción áurea, separando hechos de mitos.'],
    ['Euclides (1991-1996). Elementos (3 vols., trad. M. L. Puertas Castaños). Gredos.', 'La definición de la "razón extrema y media" y los sólidos regulares.'],
    ['Sigler, L. E. (trad.) (2002). Fibonacci’s Liber Abaci. Springer.', 'Traducción del libro de Fibonacci de 1202.'],
    ['Swinton, J., Ochu, E. y The MSI Turing’s Sunflower Consortium (2016). Novel Fibonacci and non-Fibonacci structure in the sunflower: Results of a citizen science experiment. Royal Society Open Science, 3(5), 160091.', 'Miles de girasoles contados: la mayoría siguen Fibonacci, no todos.'],
    ['Falbo, C. (2005). The golden ratio: A contrary viewpoint. The College Mathematics Journal, 36(2), 123-134.', 'El caracol nautilus no sigue la espiral áurea.'],
    ['Kepler, J. (1596). Mysterium Cosmographicum. Tubinga.', 'El intento de Kepler de explicar los planetas con los sólidos platónicos.'],
  ],
  lecciones: [
    l('La proporción áurea', 10, {
      idea: 'La proporción áurea (phi, cerca de 1,618) aparece cuando divides una línea de modo que la parte grande es a la pequeña como el total es a la grande. Es un número matemático real y fascinante, con propiedades únicas.',
      bloques: [
        ['Qué es', [
          'Euclides la definió hacia el 300 a. C. como "razón extrema y media", al estudiar figuras como el pentágono regular.',
          'Su valor es (1 + √5) / 2, aproximadamente 1,618, y se representa con la letra griega phi (φ).',
          'Tiene propiedades curiosas: si a phi le restas 1 obtienes su inverso (0,618…), y si lo elevas al cuadrado obtienes phi + 1.',
          'En el pentágono regular y la estrella de cinco puntas aparece por todos lados (Livio, 2002).',
        ]],
        ['Qué dice la tradición', [
          'Que la proporción áurea es la "divina proporción", la medida de la belleza perfecta.',
          'Que está en todas partes: en el cuerpo humano, las caras bellas, las pirámides, el Partenón y las obras de Leonardo.',
          'Que quien la usa conecta con el orden sagrado del universo.',
        ]],
        ['Qué muestra la evidencia', [
          'Las propiedades matemáticas de phi son reales y bien conocidas desde Euclides.',
          'El nombre "divina proporción" viene del libro de Luca Pacioli de 1509, ilustrado por Leonardo da Vinci; antes no se le daba ese carácter místico.',
          'Mario Livio (2002) muestra que muchas de las afirmaciones sobre su presencia en el arte, la arquitectura y el cuerpo son exageradas o falsas, como se verá en el módulo 2.',
        ]],
      ],
      ejemplos: [
        'Si dibujas una estrella de cinco puntas y mides sus segmentos, encontrarás la proporción áurea entre ellos. Es geometría pura y la puedes comprobar con una regla.',
        'Un curso en internet promete "diseñar tu vida con la proporción divina". Puedes disfrutar la matemática de phi sin creer que tenga poderes sobre tu destino.',
      ],
      practica: [
        'Calcula en el celular (1 + √5) / 2 y comprueba que phi al cuadrado es igual a phi + 1.',
        'Dibuja una estrella de cinco puntas y mide la relación entre un lado de la estrella y un segmento interior.',
        'Anota qué habías oído de la proporción áurea antes de empezar.',
      ],
      pregunta: '¿Por qué nos atrae la idea de un número que sea la clave de la belleza?',
      nota: 'La geometría sagrada mezcla matemáticas reales con creencias espirituales. Este curso estudia ambas cosas como historia de las ideas: qué es cierto matemáticamente, qué se le atribuye y de dónde vienen esas atribuciones. Se pueden respetar las creencias de quienes encuentran sentido en estos símbolos sin darlas por ciertas.',
      recordar: [
        ['¿Cuál es el valor aproximado de la proporción áurea?', 'Cerca de 1,618, que es (1 + √5) / 2.'],
        ['¿Quién la definió primero?', 'Euclides, hacia el 300 a. C., como "razón extrema y media".'],
        ['¿De dónde viene el nombre "divina proporción"?', 'Del libro de Luca Pacioli de 1509, ilustrado por Leonardo.'],
        ['¿En qué figura aparece por todos lados?', 'En el pentágono regular y la estrella de cinco puntas.'],
      ],
      tarjetas: [
        ['Proporción áurea (phi)', '(1 + √5) / 2 ≈ 1,618. Definida por Euclides; propiedades matemáticas reales.'],
        ['"Divina proporción"', 'El nombre místico viene de Pacioli (1509), no de la Antigüedad.'],
        ['Phi en el pentágono', 'La estrella de cinco puntas está llena de proporciones áureas: compruébalo con una regla.'],
      ],
    }),
    l('Fibonacci y la naturaleza', 11, {
      idea: 'La sucesión de Fibonacci (1, 1, 2, 3, 5, 8, 13…) aparece en la forma en que muchas plantas acomodan sus hojas y semillas. Pero no está "en todas partes": el famoso caracol nautilus, por ejemplo, no sigue la espiral áurea.',
      bloques: [
        ['La sucesión', [
          'Leonardo de Pisa, conocido como Fibonacci, la presentó en su libro "Liber Abaci" (1202) con un problema sobre la cría de conejos.',
          'Cada número es la suma de los dos anteriores: 1, 1, 2, 3, 5, 8, 13, 21, 34…',
          'Al dividir un número entre el anterior, el resultado se acerca cada vez más a la proporción áurea.',
        ]],
        ['Qué dice la tradición', [
          'Que Fibonacci y la espiral áurea son el "código de la creación" presente en toda la naturaleza.',
          'Que el caracol nautilus, las galaxias, los huracanes y el cuerpo humano siguen la espiral áurea.',
          'Que esto prueba un diseño sagrado del universo.',
        ]],
        ['Qué muestra la evidencia', [
          'En muchas plantas, el número de espirales en girasoles, piñas y coliflores son números de Fibonacci. Se explica porque esa forma de crecer acomoda las semillas de manera eficiente.',
          'Un experimento con voluntarios (Swinton y otros, 2016) contó espirales en cientos de girasoles: la mayoría seguía Fibonacci, pero alrededor de uno de cada cinco no.',
          'Clement Falbo (2005) midió conchas de nautilus: su espiral es logarítmica, pero con una proporción distinta a la áurea. Las galaxias y los huracanes tampoco siguen esa proporción en particular.',
        ]],
      ],
      ejemplos: [
        'Si compras una piña en la plaza y cuentas las espirales de su cáscara en una dirección y en la otra, muy probablemente obtengas dos números de Fibonacci, como 8 y 13. Es un experimento que puedes hacer hoy.',
        'Una imagen viral pone una espiral áurea sobre la foto de un huracán y "encaja". Con tantas formas de ubicar y escalar la espiral, casi cualquier curva parece encajar; las mediciones cuidadosas no lo confirman.',
      ],
      practica: [
        'Escribe los primeros 15 números de Fibonacci y divide cada uno entre el anterior para ver cómo se acerca a 1,618.',
        'Cuenta las espirales de una piña, un girasol o una coliflor romanesco si tienes acceso.',
        'Busca una imagen que diga que algo "sigue la espiral áurea" y pregúntate si se midió o solo se superpuso.',
      ],
      pregunta: '¿Qué patrones de la naturaleza me asombran, y cómo podría comprobar si son lo que dicen?',
      nota: 'Que la sucesión de Fibonacci aparezca en la filotaxis (la disposición de hojas y semillas) es un hecho bien estudiado y tiene explicaciones de cómo crecen las plantas. Lo exagerado es extenderlo a todo: conchas, galaxias, rostros y obras de arte. Las imágenes donde una espiral se superpone a una foto no son una medición.',
      recordar: [
        ['¿Cómo se forma la sucesión de Fibonacci?', 'Cada número es la suma de los dos anteriores: 1, 1, 2, 3, 5, 8…'],
        ['¿En qué libro y año la presentó Fibonacci?', 'En el Liber Abaci, de 1202.'],
        ['¿Qué encontró el experimento de los girasoles?', 'Que la mayoría seguía Fibonacci, pero alrededor de uno de cada cinco no.'],
        ['¿Sigue el nautilus la espiral áurea?', 'No: su espiral es logarítmica con otra proporción (Falbo, 2005).'],
      ],
      tarjetas: [
        ['Fibonacci', '1, 1, 2, 3, 5, 8, 13…; la razón entre términos se acerca a phi. Liber Abaci, 1202.'],
        ['Fibonacci en las plantas', 'Girasoles, piñas y coliflores: real y explicado por cómo crecen; no en todos los casos.'],
        ['El mito del nautilus', 'Su concha no sigue la proporción áurea. Superponer una espiral a una foto no es medir.'],
      ],
    }),
    l('Los sólidos platónicos', 10, {
      idea: 'Solo existen cinco poliedros regulares: tetraedro, cubo, octaedro, dodecaedro e icosaedro. Platón los asoció a los elementos, y Kepler intentó explicar los planetas con ellos. La matemática es real; las explicaciones del cosmos no funcionaron.',
      bloques: [
        ['Cinco y solo cinco', [
          'Un poliedro regular tiene todas sus caras iguales y regulares, y en cada vértice se juntan el mismo número de caras.',
          'Euclides demostró que solo hay cinco: el tetraedro (4 caras), el cubo (6), el octaedro (8), el dodecaedro (12) y el icosaedro (20).',
          'Es un resultado matemático elegante que se puede comprobar con papel y tijeras.',
        ]],
        ['Qué dice la tradición', [
          'En el Timeo, Platón asoció cada sólido a un elemento: fuego (tetraedro), tierra (cubo), aire (octaedro), agua (icosaedro) y el dodecaedro al cosmos.',
          'Johannes Kepler, en su "Mysterium Cosmographicum" (1596), propuso que las órbitas de los seis planetas conocidos estaban separadas por los cinco sólidos platónicos encajados uno dentro de otro.',
          'Hoy se venden juegos de "sólidos sagrados" en cristal con supuestas propiedades energéticas.',
        ]],
        ['Qué muestra la evidencia', [
          'La asociación de Platón con los elementos era una especulación filosófica: la química moderna muestra que la materia está hecha de átomos de más de cien elementos, no de cuatro.',
          'El modelo de Kepler no encajaba bien con las mediciones; él mismo, al estudiar los datos de Tycho Brahe, descubrió que las órbitas son elípticas, y sus leyes sí funcionan.',
          'No hay evidencia de que los objetos con forma de sólidos platónicos tengan efectos energéticos o de sanación.',
        ]],
      ],
      ejemplos: [
        'Un dado de seis caras es un cubo; los de juegos de rol tienen forma de tetraedro, octaedro, dodecaedro o icosaedro. Los sólidos platónicos están en tu mesa de juego.',
        'Kepler es un gran ejemplo de honestidad científica: amaba su idea de los sólidos, pero cuando los datos no encajaron, la abandonó y encontró las leyes correctas de los planetas.',
      ],
      practica: [
        'Busca los moldes de papel de un tetraedro y un cubo, recórtalos y ármalos.',
        'Cuenta las caras, aristas y vértices de un cubo y verifica que caras − aristas + vértices = 2.',
        'Escribe qué enseña la historia de Kepler sobre cambiar de idea con la evidencia.',
      ],
      pregunta: '¿Hay alguna idea que amo y que me costaría abandonar si los datos me mostraran que estoy equivocado?',
      nota: 'Los sólidos platónicos sí aparecen en la naturaleza en algunos casos: ciertos virus tienen forma de icosaedro y algunos cristales minerales son cúbicos u octaédricos, por razones físicas y químicas. Eso es muy distinto de atribuirles poderes. Si te ofrecen "sólidos sagrados" para curar o equilibrar energías, recuerda que no hay pruebas de esos efectos.',
      recordar: [
        ['¿Cuántos poliedros regulares existen?', 'Cinco.'],
        ['Nombra los cinco sólidos platónicos.', 'Tetraedro, cubo, octaedro, dodecaedro e icosaedro.'],
        ['¿Qué propuso Kepler con los sólidos platónicos?', 'Que separaban las órbitas de los planetas, encajados uno dentro de otro.'],
        ['¿Qué descubrió Kepler después?', 'Que las órbitas de los planetas son elípticas.'],
      ],
      tarjetas: [
        ['Sólidos platónicos', 'Solo cinco poliedros regulares: tetraedro, cubo, octaedro, dodecaedro, icosaedro (Euclides).'],
        ['Platón y los elementos', 'Asoció cada sólido a un elemento: especulación filosófica, no química.'],
        ['Kepler', 'Probó explicar los planetas con los sólidos; con los datos, descubrió las órbitas elípticas.'],
      ],
    }),
  ],
};

const MITOS = {
  titulo: 'Lo que se le atribuye',
  objetivo: 'Revisar las afirmaciones más famosas sobre la proporción áurea en la arquitectura, el arte y la belleza, y conocer el origen de símbolos como la "flor de la vida".',
  fuentes: [
    ['Markowitz, G. (1992). Misconceptions about the golden ratio. The College Mathematics Journal, 23(1), 2-19.', 'Revisión de los mitos más comunes sobre la proporción áurea.'],
    ['Livio, M. (2002). The Golden Ratio. Broadway Books.', 'El Partenón, las pirámides y Leonardo, con lupa.'],
    ['Pacioli, L. (1509). De divina proportione. Venecia.', 'El libro que llamó "divina" a la proporción.'],
    ['Green, C. D. (1995). All that glitters: A review of psychological research on the aesthetics of the golden section. Perception, 24(8), 937-968.', 'Qué dicen los experimentos sobre si preferimos la proporción áurea.'],
    ['Fechner, G. T. (1876). Vorschule der Ästhetik. Breitkopf & Härtel.', 'Los primeros experimentos sobre preferencia de rectángulos.'],
    ['Melchizedek, D. (1999). The Ancient Secret of the Flower of Life, Vol. 1. Light Technology Publishing.', 'El libro que popularizó la "flor de la vida" en la Nueva Era.'],
  ],
  lecciones: [
    l('Pirámides, Partenón y Leonardo', 11, {
      idea: 'Se dice que la proporción áurea está en las pirámides de Egipto, el Partenón y la Mona Lisa. Cuando se mide con cuidado, las coincidencias son débiles o inventadas.',
      bloques: [
        ['El problema de medir', [
          'Un edificio tiene muchísimas medidas posibles: altura, base, columnas, ventanas, desde dónde a dónde.',
          'Con tantas opciones, siempre se pueden encontrar dos medidas cuya razón se acerque a 1,618.',
          'George Markowitz (1992) revisó muchas de estas afirmaciones y encontró que la mayoría escogían las medidas a conveniencia o redondeaban mucho.',
        ]],
        ['Qué dice la tradición', [
          'Que los egipcios construyeron la Gran Pirámide con la proporción áurea por conocimiento sagrado.',
          'Que el Partenón de Atenas encierra rectángulos áureos en su fachada.',
          'Que Leonardo da Vinci pintó la Mona Lisa y el Hombre de Vitruvio con la divina proporción.',
        ]],
        ['Qué muestra la evidencia', [
          'Mario Livio (2002) muestra que las medidas de la Gran Pirámide se explican igual de bien con otras proporciones, y no hay textos egipcios que mencionen la proporción áurea.',
          'El Partenón no encaja bien en un rectángulo áureo: depende de dónde se tome la medida, y partes del edificio están dañadas.',
          'El Hombre de Vitruvio se basa en las proporciones que describió el arquitecto romano Vitruvio, que no usan phi; no hay evidencia clara de que Leonardo usara la proporción áurea en la Mona Lisa, aunque sí ilustró el libro de Pacioli.',
        ]],
      ],
      ejemplos: [
        'Si mides tu casa por todos lados, seguramente encuentres dos medidas cuya razón se acerque a 1,6. No significa que el maestro de obra haya usado la proporción divina.',
        'Un documental superpone rectángulos dorados a la fachada del Partenón y "encajan". Si cambias un poco dónde empieza el rectángulo, deja de encajar: el ajuste es del dibujante, no del edificio.',
      ],
      practica: [
        'Mide cinco cosas de tu casa (puerta, ventana, mesa, celular) y calcula la razón entre su largo y su ancho.',
        'Cuenta cuántas razones salen "cerca de 1,6" si aceptas un margen de error de 0,1.',
        'Busca una imagen del Partenón con un rectángulo áureo y observa dónde empieza y termina.',
      ],
      pregunta: '¿Por qué una historia sobre un "secreto de los antiguos" es más atractiva que la explicación aburrida?',
      nota: 'Esto no quita mérito a los constructores antiguos: los egipcios y los griegos tenían conocimientos de geometría y técnicas de construcción admirables. Lo que no tiene respaldo es atribuirles el uso deliberado de la proporción áurea sin documentos que lo prueben. Algunos artistas modernos sí la usaron a propósito, como se verá en el módulo 3.',
      recordar: [
        ['¿Por qué es fácil "encontrar" la proporción áurea en un edificio?', 'Porque hay muchísimas medidas posibles y siempre alguna razón se acerca a 1,618.'],
        ['¿Qué encontró Markowitz (1992)?', 'Que la mayoría de las afirmaciones escogían medidas a conveniencia o redondeaban mucho.'],
        ['¿Hay textos egipcios que mencionen la proporción áurea?', 'No.'],
        ['¿En qué se basa el Hombre de Vitruvio?', 'En las proporciones descritas por Vitruvio, que no usan phi.'],
      ],
      tarjetas: [
        ['Medir a conveniencia', 'Con suficientes medidas, siempre alguna razón da cerca de 1,618 (Markowitz, 1992).'],
        ['Pirámides y Partenón', 'Sin documentos ni medidas que prueben un uso deliberado de phi.'],
        ['Hombre de Vitruvio', 'Basado en las proporciones de Vitruvio, no en la proporción áurea.'],
      ],
    }),
    l('¿Es la proporción más bella?', 10, {
      idea: 'Se repite que el rectángulo áureo es el más agradable a la vista y que las caras bellas siguen phi. Los experimentos, desde el siglo XIX, no muestran una preferencia clara ni constante.',
      bloques: [
        ['Los experimentos', [
          'Gustav Fechner (1876) mostró rectángulos de distintas proporciones a la gente y reportó una ligera preferencia por los cercanos a la proporción áurea.',
          'Christopher Green (1995) revisó un siglo de experimentos: los resultados son inconsistentes y dependen mucho de cómo se presentan las figuras.',
          'Cuando se cambia el orden, el tamaño o el contexto, la supuesta preferencia desaparece o se mueve a otras proporciones.',
        ]],
        ['Qué dice la tradición', [
          'Que el ojo humano está hecho para preferir la proporción divina.',
          'Que los rostros más bellos se ajustan a una "máscara áurea".',
          'Que diseñar con phi garantiza belleza en logos, cuerpos y casas.',
        ]],
        ['Qué muestra la evidencia', [
          'No hay una preferencia universal y estable por la proporción áurea.',
          'La "máscara áurea" de la belleza es una propuesta comercial de un cirujano plástico, sin validación científica sólida; los estudios sobre atractivo facial apuntan a otros factores, como la simetría y el promedio de rasgos.',
          'La belleza depende de muchos factores: cultura, costumbre, contexto y gusto personal.',
        ]],
      ],
      ejemplos: [
        'Tu celular, tu cédula y una hoja carta tienen proporciones distintas, y ninguna te parece fea. No hay una proporción única que el ojo exija.',
        'Una clínica estética promete "armonizar tu rostro con la proporción áurea". No hay evidencia sólida de que esa medida defina la belleza; desconfía de tratamientos basados en ella.',
      ],
      practica: [
        'Dibuja cinco rectángulos con proporciones distintas y pide a tres personas que escojan el más bonito. Anota los resultados.',
        'Escribe tres objetos que te parezcan bonitos y mide si su proporción se acerca a 1,618.',
        'Escribe con tus palabras qué encontró la revisión de Green (1995).',
      ],
      pregunta: '¿Qué ideas de "belleza perfecta" me han hecho sentir mal con mi cuerpo o mi cara?',
      nota: 'Las afirmaciones sobre la "proporción perfecta" del rostro o el cuerpo pueden afectar la autoestima y empujar a procedimientos estéticos innecesarios. La investigación sobre el atractivo es compleja y no se reduce a un número. Si una preocupación por tu apariencia te causa mucho malestar, habla con un profesional de salud mental.',
      recordar: [
        ['¿Qué encontró Fechner en 1876?', 'Una ligera preferencia por rectángulos cercanos a la proporción áurea.'],
        ['¿Qué concluyó la revisión de Green (1995)?', 'Que los resultados son inconsistentes y dependen de cómo se presentan las figuras.'],
        ['¿Tiene validación científica la "máscara áurea" de la belleza?', 'No: es una propuesta comercial sin validación sólida.'],
        ['¿De qué depende la belleza según la evidencia?', 'De muchos factores: cultura, costumbre, contexto y gusto personal.'],
      ],
      tarjetas: [
        ['¿Preferimos phi?', 'Un siglo de experimentos: sin preferencia universal ni estable (Green, 1995).'],
        ['La "máscara áurea"', 'Propuesta comercial sin validación; el atractivo facial se relaciona más con simetría y promedio.'],
        ['Belleza', 'Depende de la cultura, el contexto y el gusto, no de un solo número.'],
      ],
    }),
    l('Flor de la vida, mandalas y símbolos', 10, {
      idea: 'La "flor de la vida" y otros diseños de círculos entrelazados se presentan como símbolos antiquísimos con poder. Son patrones geométricos bonitos que aparecen en muchas culturas; su sentido místico actual es sobre todo de la Nueva Era.',
      bloques: [
        ['Los patrones', [
          'La flor de la vida se forma con círculos del mismo tamaño que se cruzan en sus centros, formando una red de pétalos.',
          'Patrones así aparecen en el arte decorativo de muchas épocas y culturas, porque se dibujan fácil con un compás.',
          'Los mandalas son diseños circulares que se usan en el hinduismo y el budismo como apoyo para la meditación.',
        ]],
        ['Qué dice la tradición', [
          'Que la flor de la vida contiene el "plano de la creación" y todos los sólidos platónicos.',
          'Que fue grabada por civilizaciones antiquísimas en el templo de Osiris en Abidos (Egipto) como mensaje secreto.',
          'Que meditar con ella o llevarla puesta activa energías o la "geometría sagrada del cuerpo".',
        ]],
        ['Qué muestra la evidencia', [
          'El nombre "flor de la vida" y su significado místico se popularizaron con los libros de Drunvalo Melchizedek desde 1999, dentro de la Nueva Era.',
          'Los dibujos del templo de Abidos parecen ser muy posteriores a la construcción del templo, posiblemente de época grecorromana o más tardía; su fecha se discute.',
          'Para los mandalas, Carl Jung los interpretó como símbolos de la integración de la personalidad; meditar con ellos puede relajar, como otras prácticas de concentración, pero no hay evidencia de efectos "energéticos".',
        ]],
      ],
      ejemplos: [
        'Ves en una feria artesanal manillas y cuadros con la flor de la vida que "equilibran tus chakras". Puedes comprarlos porque te gusta el diseño; no hay evidencia de que tengan efectos sobre tu energía o tu salud.',
        'Colorear mandalas se volvió popular para relajarse. Lo que tiene respaldo es que actividades tranquilas y concentradas pueden bajar el estrés, no que la forma circular tenga un poder especial.',
      ],
      practica: [
        'Con un compás o un vaso, dibuja la flor de la vida: un círculo y luego seis más con centro en su borde.',
        'Busca ejemplos de patrones de círculos entrelazados en el arte de distintas culturas.',
        'Escribe la diferencia entre "un diseño me relaja" y "un diseño tiene poderes".',
      ],
      pregunta: '¿Qué objetos o símbolos uso por lo que significan para mí, y cuáles por lo que prometen?',
      nota: 'Los símbolos tienen un valor cultural y personal real: un mandala puede ayudarte a concentrarte y una figura puede recordarte algo importante. El problema aparece con las promesas: curar enfermedades, "activar el ADN" o atraer riqueza. Esas promesas no tienen respaldo y a veces sirven para vender productos caros.',
      recordar: [
        ['¿Cómo se forma la flor de la vida?', 'Con círculos del mismo tamaño que se cruzan en sus centros.'],
        ['¿Quién popularizó su significado místico actual?', 'Drunvalo Melchizedek, con libros desde 1999, dentro de la Nueva Era.'],
        ['¿Son tan antiguos como el templo los dibujos de Abidos?', 'Parecen muy posteriores al templo; su fecha se discute.'],
        ['¿Cómo interpretó Jung los mandalas?', 'Como símbolos de la integración de la personalidad.'],
      ],
      tarjetas: [
        ['Flor de la vida', 'Patrón de círculos entrelazados presente en muchas culturas; su sentido místico es de la Nueva Era.'],
        ['Abidos', 'Los dibujos parecen muy posteriores al templo: no prueban un saber antiquísimo.'],
        ['Mandalas', 'Apoyo para meditar; relajan como otras prácticas tranquilas. Sin evidencia de efectos energéticos.'],
      ],
    }),
  ],
};

const OBRA = {
  titulo: 'Geometría en el arte y la arquitectura',
  objetivo: 'Ver cómo la geometría se ha usado de verdad para construir catedrales, decorar mezquitas y diseñar edificios modernos, y reconocer la belleza real de la geometría actual.',
  fuentes: [
    ['Villard de Honnecourt (c. 1230). Cuaderno de dibujos. Estudio: Bechmann, R. (1993). Villard de Honnecourt: la pensée technique au XIIIe siècle et sa communication. Picard.', 'El cuaderno de un constructor medieval y su geometría práctica.'],
    ['Lu, P. J. y Steinhardt, P. J. (2007). Decagonal and quasi-crystalline tilings in medieval Islamic architecture. Science, 315(5815), 1106-1110.', 'Los artesanos islámicos crearon patrones casi cristalinos siglos antes que la ciencia.'],
    ['Le Corbusier (1950). Le Modulor. Éditions de l’Architecture d’Aujourd’hui.', 'El sistema de medidas de Le Corbusier basado en la proporción áurea.'],
    ['Shechtman, D., Blech, I., Gratias, D. y Cahn, J. W. (1984). Metallic phase with long-range orientational order and no translational symmetry. Physical Review Letters, 53(20), 1951-1953.', 'El descubrimiento de los cuasicristales (Nobel de Química 2011).'],
    ['Penrose, R. (1974). The role of aesthetics in pure and applied mathematical research. Bulletin of the Institute of Mathematics and its Applications, 10, 266-271.', 'Los mosaicos de Penrose.'],
  ],
  lecciones: [
    l('Catedrales y templos: la geometría del constructor', 10, {
      idea: 'Los constructores de templos y catedrales usaban geometría práctica (compás, escuadra y cuerdas) para trazar planos y proporciones. Era un saber de oficio, que también tenía para ellos un sentido religioso.',
      bloques: [
        ['El saber de los constructores', [
          'Antes de los planos a escala y las calculadoras, se trazaba con compás, cuerdas y escuadras sobre el suelo o en tablas.',
          'El cuaderno del constructor francés Villard de Honnecourt (hacia 1230) muestra figuras geométricas usadas para trazar arcos, caras y planos.',
          'Métodos como trabajar "a partir del cuadrado" o "del triángulo" permitían obtener proporciones armoniosas sin hacer cálculos.',
        ]],
        ['Qué dice la tradición', [
          'Que las catedrales encierran un saber geométrico secreto transmitido por iniciados.',
          'Que sus medidas codifican mensajes sagrados y numéricos.',
          'Que los constructores medievales conservaban conocimientos de los templos antiguos, como el de Salomón.',
        ]],
        ['Qué muestra la evidencia', [
          'La geometría práctica de los constructores está bien documentada y era un saber de oficio que se enseñaba de maestro a aprendiz, con cierta reserva gremial.',
          'Para los constructores medievales, la geometría tenía también un sentido religioso: reflejaba el orden de la creación. Eso es parte de la historia de las ideas, no una prueba de mensajes ocultos.',
          'Las interpretaciones de "mensajes secretos" en las medidas de catedrales suelen tener el mismo problema que con el Partenón: escoger las medidas a conveniencia.',
        ]],
      ],
      ejemplos: [
        'Un maestro de obra en Colombia que traza un ángulo recto con una cuerda de 3, 4 y 5 metros está usando geometría práctica que viene de la Antigüedad, sin calcular nada.',
        'Las iglesias coloniales de ciudades como Popayán o Cartagena se trazaron con métodos geométricos heredados de la tradición europea de constructores.',
      ],
      practica: [
        'Traza un ángulo recto con una cuerda marcada en 3, 4 y 5 partes iguales (el triángulo 3-4-5).',
        'Dibuja con un compás un arco apuntado (como el de las ventanas góticas): dos arcos con el mismo radio desde los extremos de la base.',
        'Busca imágenes del cuaderno de Villard de Honnecourt.',
      ],
      pregunta: '¿Qué conocimiento práctico de mi oficio aprendí de alguien sin que estuviera escrito en un libro?',
      nota: 'La relación entre los gremios de constructores medievales y la masonería moderna es un tema que se verá en el curso de Masonería: hay una conexión histórica real, pero menos directa y misteriosa de lo que cuentan las leyendas. La geometría de las catedrales es fascinante sin necesidad de inventarle mensajes secretos.',
      recordar: [
        ['¿Con qué herramientas trazaban los constructores medievales?', 'Con compás, cuerdas y escuadras.'],
        ['¿Quién fue Villard de Honnecourt?', 'Un constructor francés cuyo cuaderno (hacia 1230) muestra geometría práctica.'],
        ['¿Qué sentido tenía la geometría para los constructores medievales?', 'Además de práctico, religioso: reflejaba el orden de la creación.'],
        ['¿Qué problema tienen las interpretaciones de mensajes ocultos en catedrales?', 'Que suelen escoger las medidas a conveniencia.'],
      ],
      tarjetas: [
        ['Geometría del constructor', 'Compás, cuerda y escuadra para trazar sin cálculos. Saber de oficio, de maestro a aprendiz.'],
        ['Villard de Honnecourt', 'Su cuaderno (c. 1230) documenta la geometría práctica de los constructores medievales.'],
        ['Triángulo 3-4-5', 'Con una cuerda de 3, 4 y 5 partes se traza un ángulo recto sin escuadra.'],
      ],
    }),
    l('Los mosaicos islámicos y los cuasicristales', 10, {
      idea: 'Los artesanos del mundo islámico crearon patrones geométricos de una complejidad asombrosa. Algunos, del siglo XV, tienen una estructura matemática que los científicos solo entendieron en el siglo XX.',
      bloques: [
        ['El arte geométrico islámico', [
          'En buena parte del arte religioso islámico se evitan las imágenes de personas, y se desarrolló un arte de patrones geométricos, caligrafía y formas vegetales.',
          'Mezquitas y palacios, como la Alhambra en Granada, están cubiertos de mosaicos con estrellas y polígonos entrelazados.',
          'Para muchos artistas y fieles, esos patrones infinitos evocan la unidad y el infinito de Dios.',
        ]],
        ['Qué dice la tradición', [
          'Que la geometría es un camino para contemplar el orden divino.',
          'Que los patrones expresan la unidad dentro de la multiplicidad.',
          'Algunas corrientes de "geometría sagrada" moderna atribuyen a estos diseños poderes energéticos.',
        ]],
        ['Qué muestra la evidencia', [
          'Peter Lu y Paul Steinhardt (2007) mostraron que en un santuario de Isfahán (Irán), de 1453, los artesanos usaron un conjunto de piezas (llamadas girih) para crear patrones casi periódicos.',
          'Esos patrones se parecen a los mosaicos que el matemático Roger Penrose describió en los años 70, y a la estructura de los cuasicristales que Dan Shechtman descubrió en 1984 (Nobel de Química 2011).',
          'Es un ejemplo extraordinario de cómo el conocimiento artesanal llegó a resultados matemáticos avanzados, sin necesidad de poderes ocultos.',
        ]],
      ],
      ejemplos: [
        'En Colombia puedes ver la herencia de estos patrones en algunos azulejos y celosías de estilo mudéjar en iglesias y casas coloniales, que llegaron a través de España.',
        'Dan Shechtman fue ridiculizado durante años por decir que había encontrado cristales "imposibles". Finalmente le dieron la razón y el Nobel. La ciencia también tarda en aceptar lo nuevo, pero se corrige con evidencia.',
      ],
      practica: [
        'Busca imágenes de los mosaicos de la Alhambra o del santuario Darb-i Imam en Isfahán.',
        'Busca imágenes de un mosaico de Penrose y compáralas con los patrones islámicos.',
        'Intenta dibujar una estrella de ocho puntas con dos cuadrados superpuestos girados.',
      ],
      pregunta: '¿Qué saber práctico o artesanal conozco que se adelantó a la explicación científica?',
      nota: 'Lu y Steinhardt no afirman que los artesanos medievales conocieran la teoría matemática de los cuasicristales, sino que llegaron a patrones con propiedades parecidas usando piezas y reglas prácticas. El hallazgo es valioso porque muestra la sofisticación del arte islámico, sin necesidad de exagerarlo.',
      recordar: [
        ['¿Por qué se desarrolló tanto la geometría en el arte islámico?', 'Porque en buena parte del arte religioso se evitan las imágenes de personas.'],
        ['¿Qué mostraron Lu y Steinhardt (2007)?', 'Que artesanos de 1453 en Isfahán crearon patrones casi periódicos con piezas girih.'],
        ['¿A qué se parecen esos patrones?', 'A los mosaicos de Penrose y a la estructura de los cuasicristales.'],
        ['¿Quién descubrió los cuasicristales y qué premio recibió?', 'Dan Shechtman, en 1984; recibió el Nobel de Química en 2011.'],
      ],
      tarjetas: [
        ['Arte geométrico islámico', 'Patrones de estrellas y polígonos que evocan la unidad y el infinito de Dios.'],
        ['Isfahán, 1453 (Lu y Steinhardt)', 'Artesanos crearon patrones casi periódicos, parecidos a los de Penrose, siglos antes.'],
        ['Cuasicristales', 'Descubiertos por Shechtman (1984), ridiculizado y luego premiado con el Nobel (2011).'],
      ],
    }),
    l('Diseño moderno y geometría hoy', 11, {
      idea: 'Algunos artistas y arquitectos modernos sí usaron la proporción áurea a propósito, como Le Corbusier. Hoy circulan muchos mitos sobre logos "diseñados con phi", y la geometría real sigue ofreciendo belleza y utilidad.',
      bloques: [
        ['Uso deliberado moderno', [
          'El arquitecto Le Corbusier creó "el Modulor" (1950), un sistema de medidas basado en la altura humana y la proporción áurea, que usó en varios edificios.',
          'Pintores como Salvador Dalí usaron la proporción áurea a propósito en algunas obras.',
          'En estos casos sí hay documentos que prueban el uso, a diferencia de las pirámides o el Partenón.',
        ]],
        ['Qué dice la tradición', [
          'Que los logos de grandes marcas (como Apple o Twitter) fueron diseñados con círculos áureos y por eso funcionan.',
          'Que usar la proporción áurea garantiza un buen diseño.',
          'Que la geometría sagrada es un lenguaje universal que el diseño moderno redescubrió.',
        ]],
        ['Qué muestra la evidencia', [
          'Muchas de las imágenes de logos "construidos con phi" fueron hechas después por terceros, superponiendo círculos; los diseñadores originales no siempre lo confirman.',
          'El buen diseño depende de muchas cosas (contraste, legibilidad, contexto, cultura); la proporción áurea es una herramienta posible entre muchas.',
          'La geometría real sigue siendo esencial: en la ingeniería, la arquitectura, los gráficos de computador, el GPS y la medicina por imágenes.',
        ]],
      ],
      ejemplos: [
        'En una clase de diseño te muestran el logo de una marca famosa "explicado" con círculos áureos. Puedes preguntar: ¿lo dijo el diseñador o lo dibujó alguien después?',
        'El GPS de tu celular calcula tu posición con geometría (triangulación con satélites). Es geometría real que usas cuando pides un domicilio o vas en moto a un lugar nuevo.',
      ],
      practica: [
        'Busca el Modulor de Le Corbusier y mira cómo relaciona la altura humana con la proporción áurea.',
        'Busca un logo famoso "explicado con la proporción áurea" y averigua si el diseñador original lo confirmó.',
        'Relee lo que anotaste al empezar el curso y escribe qué piensas ahora de la geometría sagrada.',
      ],
      pregunta: '¿Qué me llevo de este curso: la fascinación por la geometría real, la crítica a los mitos o ambas?',
      nota: 'Separar mitos de hechos no le quita belleza a la geometría: los patrones de las plantas, los cinco sólidos platónicos, los mosaicos islámicos y los cuasicristales son más sorprendentes que muchas leyendas. Si te atrae este mundo, el dibujo geométrico con regla y compás, la matemática recreativa o el diseño son caminos con bases sólidas.',
      recordar: [
        ['¿Qué fue el Modulor de Le Corbusier?', 'Un sistema de medidas de 1950 basado en la altura humana y la proporción áurea.'],
        ['¿Qué diferencia hay entre Le Corbusier y las pirámides respecto a phi?', 'En Le Corbusier hay documentos que prueban su uso deliberado; en las pirámides, no.'],
        ['¿Qué problema tienen las imágenes de logos "construidos con phi"?', 'Muchas las hicieron terceros después, superponiendo círculos.'],
        ['Nombra un uso real de la geometría hoy.', 'Ingeniería, arquitectura, gráficos de computador, GPS o medicina por imágenes.'],
      ],
      tarjetas: [
        ['Le Corbusier y el Modulor (1950)', 'Uso deliberado y documentado de la proporción áurea en la arquitectura moderna.'],
        ['Logos "áureos"', 'Muchas explicaciones con círculos dorados las hicieron terceros después.'],
        ['Geometría real hoy', 'GPS, ingeniería, gráficos y medicina por imágenes: geometría que sí funciona.'],
      ],
    }),
  ],
};

export default {
  id: 'geometria-sagrada',
  nombre: 'Geometría sagrada',
  area: 'esoterico',
  icono: '📐',
  nivel: 'Básico',
  paraQue: 'Separar la matemática real (proporción áurea, Fibonacci, sólidos platónicos) de lo que se le atribuye, y conocer como historia de las ideas el uso de la geometría en templos, mosaicos y diseño. Cada lección separa lo que dice la tradición de lo que muestra la evidencia.',
  modulos: [MATEMATICA, MITOS, OBRA],
  proyecto: {
    titulo: 'Mide el mundo tú mismo',
    intro: 'Durante 2 semanas vas a medir objetos, plantas y edificios para comprobar con tus propios ojos dónde aparece de verdad la proporción áurea y dónde no.',
    pasos: [
      'Consigue un metro o una regla y una libreta (o usa el diario de la app).',
      'Cuenta las espirales de al menos dos plantas (piña, girasol, coliflor, piña de pino) y anota si son números de Fibonacci.',
      'Mide 10 objetos rectangulares de tu casa y calcula la razón entre largo y ancho.',
      'Mide la fachada de un edificio o una iglesia de tu barrio y prueba si encuentras razones cercanas a 1,618; anota cuántas medidas tuviste que probar.',
      'Dibuja con compás la flor de la vida y un pentágono, y mide las proporciones áureas del pentágono.',
      'Escribe qué encontraste: dónde sí aparece phi, dónde no y cuántas veces tuviste que escoger las medidas.',
      'Concluye qué te enseñó el ejercicio sobre medir con cuidado frente a superponer figuras a una foto.',
    ],
  },
};
