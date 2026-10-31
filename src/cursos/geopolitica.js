// Geopolítica: poder, geografía y recursos para leer las noticias del mundo. Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).
// En temas en disputa se presentan varias posturas; las cifras que cambian rápido no van con número.

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const IDEAS = {
  titulo: 'Las ideas básicas',
  objetivo: 'Entender qué estudia la geopolítica, cuáles son las grandes escuelas para interpretar la política internacional y de qué está hecho el poder de un país.',
  fuentes: [
    ['Mackinder, H. J. (1904). The geographical pivot of history. The Geographical Journal, 23(4), 421-437.', 'La teoría del "corazón continental".'],
    ['Mahan, A. T. (1890). The Influence of Sea Power upon History, 1660-1783. Little, Brown.', 'El poder naval como clave del poder mundial.'],
    ['Spykman, N. J. (1942). America’s Strategy in World Politics. Harcourt, Brace.', 'El "borde" de Eurasia y la geografía del poder.'],
    ['Marshall, T. (2015). Prisoners of Geography. Elliott & Thompson. (En español: Prisioneros de la geografía).', 'Divulgación sobre cómo la geografía condiciona a los países.'],
    ['Morgenthau, H. J. (1948). Politics Among Nations. Knopf.', 'El realismo clásico.'],
    ['Waltz, K. N. (1979). Theory of International Politics. Addison-Wesley.', 'El neorrealismo: la estructura del sistema internacional.'],
    ['Keohane, R. O. y Nye, J. S. (1977). Power and Interdependence. Little, Brown.', 'La interdependencia y las instituciones.'],
    ['Wendt, A. (1992). Anarchy is what states make of it: The social construction of power politics. International Organization, 46(2), 391-425.', 'El constructivismo: las ideas también cuentan.'],
    ['Nye, J. S. (2004). Soft Power: The means to success in world politics. PublicAffairs.', 'El poder blando.'],
  ],
  lecciones: [
    l('Qué es la geopolítica', 10, {
      idea: 'La geopolítica estudia cómo la geografía (ubicación, relieve, ríos, mares, recursos, población) influye en el poder y en las decisiones de los países. Ayuda a entender por qué los países hacen lo que hacen, aunque la geografía no lo decide todo.',
      bloques: [
        ['Las teorías clásicas', [
          'Halford Mackinder (1904) propuso que quien controlara el "corazón" de Eurasia (las llanuras de Rusia y Asia central) tendría ventaja para dominar el mundo.',
          'Alfred Mahan (1890) defendió lo contrario: el poder viene de controlar los mares y las rutas comerciales, como hizo el Imperio británico.',
          'Nicholas Spykman (1942) dijo que lo clave era el "borde" de Eurasia: las costas de Europa, Medio Oriente y Asia oriental, donde vive mucha gente y hay mucha riqueza.',
        ]],
        ['Por qué la geografía importa', [
          'Las montañas y los ríos facilitan o dificultan la defensa, el transporte y el comercio.',
          'El acceso al mar define buena parte de la economía: los países sin salida al mar dependen de sus vecinos para exportar.',
          'Tim Marshall (2015) muestra cómo, por ejemplo, Rusia ha buscado históricamente puertos de aguas cálidas y China protege sus rutas marítimas.',
        ]],
        ['Por qué no lo decide todo', [
          'La tecnología cambia el peso de la geografía: los aviones, internet y los misiles reducen la importancia de algunas barreras.',
          'Las decisiones de los líderes, las instituciones, la economía y las ideas también pesan.',
          'Además, las teorías clásicas se usaron para justificar imperios y guerras; hay que leerlas con ojo crítico.',
        ]],
      ],
      ejemplos: [
        'Colombia tiene costas en dos océanos, algo que pocos países tienen. Eso le da ventajas comerciales, pero su geografía de cordilleras ha hecho históricamente difícil y caro conectar sus regiones.',
        'Bolivia perdió su salida al mar en la guerra del Pacífico del siglo XIX y aún hoy depende de puertos de países vecinos para exportar. La geografía sigue pesando en su economía y su política.',
      ],
      practica: [
        'Abre un mapa de Colombia con relieve y escribe tres formas en que la geografía afecta tu región (transporte, clima, economía).',
        'Toma una noticia internacional de hoy y pregúntate qué papel juega la geografía (fronteras, mares, recursos).',
        'Escribe un ejemplo donde la tecnología haya reducido una barrera geográfica.',
      ],
      pregunta: '¿Cómo ha influido la geografía de mi región en las oportunidades que he tenido?',
      nota: 'El "determinismo geográfico" (creer que la geografía decide el destino de un país) es un error frecuente en los libros de divulgación. Países con geografías parecidas han tenido historias muy distintas por sus instituciones y decisiones. La geografía condiciona; no determina. Además, la palabra "geopolítica" estuvo asociada en el siglo XX a la propaganda expansionista de la Alemania nazi, por lo que muchos académicos la usaron con cautela durante décadas.',
      recordar: [
        ['¿Qué estudia la geopolítica?', 'Cómo la geografía influye en el poder y las decisiones de los países.'],
        ['¿Qué propuso Mackinder?', 'Que quien controlara el corazón de Eurasia tendría ventaja para dominar el mundo.'],
        ['¿Qué defendió Mahan?', 'Que el poder viene de controlar los mares y las rutas comerciales.'],
        ['¿Qué es el determinismo geográfico y por qué es un error?', 'Creer que la geografía decide el destino; países con geografía parecida han tenido historias distintas.'],
      ],
      tarjetas: [
        ['Geopolítica', 'Cómo la geografía (ubicación, relieve, mares, recursos) condiciona el poder de los países.'],
        ['Mackinder vs. Mahan', 'Mackinder: el corazón terrestre de Eurasia. Mahan: el control de los mares.'],
        ['Condiciona, no determina', 'La geografía pesa, pero las instituciones, la tecnología y las decisiones también.'],
      ],
    }),
    l('Las grandes escuelas: realismo, liberalismo y constructivismo', 11, {
      idea: 'Para interpretar la política internacional hay tres grandes lentes: el realismo (todo es poder y seguridad), el liberalismo (la cooperación y las instituciones importan) y el constructivismo (las ideas e identidades también moldean lo que hacen los países).',
      bloques: [
        ['Realismo', [
          'Hans Morgenthau (1948) sostuvo que los países buscan poder y defienden su interés nacional.',
          'Kenneth Waltz (1979) agregó que, como no hay un gobierno mundial por encima de los países (anarquía), cada uno debe cuidar su propia seguridad.',
          'John Mearsheimer, un realista actual, argumenta que las grandes potencias tienden a buscar dominar su región.',
          'Lo que explica bien: rivalidades entre potencias, carreras armamentistas, alianzas por conveniencia.',
        ]],
        ['Liberalismo', [
          'Robert Keohane y Joseph Nye (1977) mostraron que los países dependen unos de otros en comercio, finanzas y tecnología: la interdependencia.',
          'Las instituciones internacionales (la ONU, la Organización Mundial del Comercio, los tratados) reducen la desconfianza y facilitan cooperar.',
          'Lo que explica bien: por qué países que fueron enemigos (Francia y Alemania) hoy cooperan, o por qué el comercio frena algunos conflictos.',
        ]],
        ['Constructivismo', [
          'Alexander Wendt (1992) dijo que "la anarquía es lo que los Estados hacen de ella": que dos países se vean como amigos o enemigos depende de sus ideas e historia, no solo del poder.',
          'Las identidades, las normas y los discursos cambian lo que se considera aceptable (por ejemplo, la prohibición de las armas químicas).',
          'Lo que explica bien: por qué cinco bombas nucleares británicas preocupan menos a Estados Unidos que una sola de un país rival.',
        ]],
      ],
      ejemplos: [
        'Un realista explicaría la cooperación antidrogas entre Colombia y Estados Unidos como una relación de poder e intereses; un liberal, como una forma de manejar un problema común con instituciones y acuerdos; un constructivista, como resultado de cómo ambos países definieron el narcotráfico como amenaza.',
        'Ante una noticia sobre una disputa comercial entre dos potencias, puedes preguntarte: ¿qué diría un realista (poder)? ¿un liberal (interdependencia)? ¿un constructivista (identidades e ideas)?',
      ],
      practica: [
        'Toma una noticia internacional y explícala con las tres lentes en tres frases cortas.',
        'Escribe cuál de las tres escuelas te parece más convincente y por qué.',
        'Busca un ejemplo en la historia de Colombia de cooperación entre países que antes estaban en conflicto.',
      ],
      pregunta: '¿Con qué lente suelo leer las noticias del mundo, y qué me pierdo por no usar las otras?',
      nota: 'Ninguna escuela explica todo: son lentes, no verdades. Los académicos discuten mucho entre ellas, y cada una tiene versiones distintas. Desconfía de quien explique toda la política mundial con una sola idea ("todo es por el petróleo", "todo es una conspiración", "todo es choque de civilizaciones"). Las explicaciones simples son atractivas, pero el mundo casi siempre es más complicado.',
      recordar: [
        ['¿Qué sostiene el realismo?', 'Que los países buscan poder y seguridad en un sistema sin gobierno mundial.'],
        ['¿Qué aportaron Keohane y Nye?', 'La idea de interdependencia: los países dependen unos de otros y las instituciones facilitan cooperar.'],
        ['¿Qué significa "la anarquía es lo que los Estados hacen de ella"?', 'Que la amistad o enemistad entre países depende de sus ideas e historia, no solo del poder (Wendt).'],
        ['¿Por qué no conviene explicar todo con una sola escuela?', 'Porque son lentes parciales; el mundo suele ser más complicado.'],
      ],
      tarjetas: [
        ['Realismo', 'Poder y seguridad en un mundo sin gobierno global (Morgenthau, Waltz, Mearsheimer).'],
        ['Liberalismo', 'Interdependencia e instituciones facilitan cooperar (Keohane y Nye).'],
        ['Constructivismo', 'Ideas, identidades y normas moldean lo que hacen los países (Wendt).'],
      ],
    }),
    l('De qué está hecho el poder', 10, {
      idea: 'El poder de un país no es solo militar: también es su economía, su población, su tecnología, sus alianzas y su capacidad de atraer a otros con su cultura y sus valores.',
      bloques: [
        ['Poder duro', [
          'Es la capacidad de obligar o de pagar: fuerzas armadas, armas nucleares, tamaño de la economía, sanciones.',
          'Una economía grande permite financiar ejércitos, ayudar a aliados y presionar con el comercio.',
          'La población cuenta, pero no basta: importa cuánta gente está educada y en edad de trabajar.',
        ]],
        ['Poder blando', [
          'Joseph Nye (2004) llamó poder blando a la capacidad de lograr lo que quieres porque otros te admiran o quieren parecerse a ti.',
          'Viene de la cultura (música, cine, deporte), los valores políticos y una política exterior vista como legítima.',
          'Ejemplos: las universidades que atraen estudiantes de todo el mundo, la música coreana, el fútbol europeo.',
        ]],
        ['Otras fuentes de poder', [
          'La tecnología: quien domina los chips, la inteligencia artificial o las telecomunicaciones tiene ventaja.',
          'Las alianzas: un país mediano con buenos aliados puede pesar más que uno grande y aislado.',
          'La estabilidad interna: un país con instituciones sólidas y poca violencia puede proyectar más poder.',
        ]],
      ],
      ejemplos: [
        'Colombia no es una potencia militar mundial, pero tiene poder blando: su música (del vallenato al reguetón), sus futbolistas, su café y sus flores son conocidos en todo el mundo y abren puertas comerciales y diplomáticas.',
        'Un país pequeño como Singapur tiene mucho peso económico y diplomático por su ubicación en una ruta comercial clave, su estabilidad y su capacidad técnica.',
      ],
      practica: [
        'Escribe tres fuentes de poder blando de Colombia y una que podría desarrollar más.',
        'Escoge un país y anota sus fuentes de poder duro y blando.',
        'Busca en una noticia internacional qué tipo de poder está usando cada país.',
      ],
      pregunta: '¿Qué imagen tiene Colombia en el mundo, y qué podría hacer cada colombiano para mejorarla?',
      nota: 'Los rankings de "poder mundial" o "poder blando" que salen en las noticias usan métodos distintos y a veces discutibles: miden cosas fáciles de contar (gasto militar, número de turistas) y dejan por fuera otras. Úsalos como una referencia, no como una verdad. Y el poder blando no se puede comprar fácilmente con propaganda: depende de que lo que hace un país sea visto como creíble.',
      recordar: [
        ['¿Qué es el poder duro?', 'La capacidad de obligar o de pagar: fuerzas armadas, economía, sanciones.'],
        ['¿Qué es el poder blando según Nye?', 'La capacidad de lograr lo que quieres porque otros te admiran o quieren parecerse a ti.'],
        ['¿De dónde viene el poder blando?', 'De la cultura, los valores políticos y una política exterior vista como legítima.'],
        ['Nombra dos fuentes de poder además del militar.', 'La economía, la tecnología, las alianzas o la estabilidad interna.'],
      ],
      tarjetas: [
        ['Poder duro', 'Obligar o pagar: ejército, economía, sanciones.'],
        ['Poder blando (Nye)', 'Atraer: cultura, valores y legitimidad. No se compra con propaganda.'],
        ['Otras fuentes de poder', 'Tecnología, alianzas y estabilidad interna pesan tanto como el tamaño.'],
      ],
    }),
  ],
};

const RECURSOS = {
  titulo: 'Recursos, comercio y clima',
  objetivo: 'Entender cómo la energía, los minerales, el comercio y el clima mueven la política mundial, y por qué tener muchos recursos no siempre es una bendición.',
  fuentes: [
    ['Yergin, D. (1991). The Prize: The epic quest for oil, money, and power. Simon & Schuster. (En español: La historia del petróleo).', 'La historia del petróleo y el poder.'],
    ['International Energy Agency (2021). The Role of Critical Minerals in Clean Energy Transitions. IEA.', 'Los minerales críticos para la transición energética.'],
    ['Sachs, J. D. y Warner, A. M. (2001). The curse of natural resources. European Economic Review, 45(4-6), 827-838.', 'La maldición de los recursos.'],
    ['Ross, M. L. (2015). What have we learned about the resource curse? Annual Review of Political Science, 18, 239-259.', 'Lo que se sabe hoy sobre la maldición de los recursos.'],
    ['Farrell, H. y Newman, A. L. (2019). Weaponized interdependence: How global economic networks shape state coercion. International Security, 44(1), 42-79.', 'Cómo las redes económicas se usan como arma.'],
    ['Hufbauer, G. C., Schott, J. J., Elliott, K. A. y Oegg, B. (2007). Economic Sanctions Reconsidered (3.ª ed.). Peterson Institute for International Economics.', 'Cuándo funcionan las sanciones económicas.'],
    ['IPCC (2022). Climate Change 2022: Impacts, Adaptation and Vulnerability. Contribución del Grupo de Trabajo II al Sexto Informe de Evaluación. Cambridge University Press.', 'Los impactos del cambio climático en las sociedades.'],
    ['Selby, J., Dahi, O. S., Fröhlich, C. y Hulme, M. (2017). Climate change and the Syrian civil war revisited. Political Geography, 60, 232-244.', 'Crítica a la idea de que la sequía causó la guerra en Siria.'],
  ],
  lecciones: [
    l('Energía y minerales', 11, {
      idea: 'El petróleo y el gas moldearon la política del siglo XX. Hoy, la transición energética vuelve estratégicos otros recursos: el litio, el cobre, el níquel y las tierras raras.',
      bloques: [
        ['El siglo del petróleo', [
          'Daniel Yergin (1991) cuenta cómo el control del petróleo influyó en guerras, alianzas y crisis económicas durante el siglo XX.',
          'Buena parte del petróleo mundial pasa por "cuellos de botella" marítimos, como el estrecho de Ormuz (golfo Pérsico) o el de Malaca (Asia).',
          'Una crisis en esos pasos puede subir el precio de la gasolina en todo el mundo, incluida Colombia.',
        ]],
        ['Los minerales de la transición', [
          'Los carros eléctricos, las baterías, los paneles solares y las redes eléctricas necesitan muchos minerales.',
          'La Agencia Internacional de Energía (2021) advierte que la producción y el procesamiento de varios de estos minerales están muy concentrados en pocos países, lo que crea riesgos de suministro.',
          'China tiene una posición dominante en el procesamiento de muchos de ellos; el llamado triángulo del litio (Argentina, Bolivia y Chile) tiene grandes reservas.',
        ]],
        ['La maldición de los recursos', [
          'Sachs y Warner (2001) encontraron que, en promedio, los países que dependían mucho de recursos naturales crecían más lento.',
          'Michael Ross (2015) revisa la evidencia: la maldición no es automática; aparece sobre todo con el petróleo y en países con instituciones débiles (más corrupción, autoritarismo o conflicto).',
          'Noruega, con mucho petróleo y buenas instituciones, ahorró la riqueza en un fondo; otros países la vieron perderse.',
        ]],
      ],
      ejemplos: [
        'Cuando hay tensión en el golfo Pérsico y sube el precio internacional del petróleo, Colombia recibe más por sus exportaciones de crudo, pero también se encarecen otras cosas. La geopolítica del petróleo llega a tu bolsillo.',
        'En regiones colombianas con minería ilegal de oro, la riqueza del recurso ha financiado grupos armados y ha dañado ríos. Es una muestra de cómo, con instituciones débiles, un recurso puede volverse una maldición local.',
      ],
      practica: [
        'Busca cuánto pesan el petróleo y el carbón en las exportaciones de Colombia (DANE o Banco de la República).',
        'Escribe qué minerales necesita un carro eléctrico y dónde se producen principalmente.',
        'Piensa en una región de Colombia rica en recursos y pregúntate si esa riqueza ha beneficiado a su gente.',
      ],
      pregunta: '¿Cómo me afecta en la vida diaria lo que pasa con el petróleo y la energía en el mundo?',
      nota: 'Se repite que "todas las guerras son por petróleo". Los recursos influyen en muchos conflictos, pero rara vez son la única causa: también pesan la política interna, las identidades, la seguridad y las decisiones de los líderes. Y la "maldición de los recursos" no es una ley: algunos estudios recientes discuten cuánto pesa, y depende mucho de las instituciones.',
      recordar: [
        ['¿Qué son los cuellos de botella marítimos?', 'Pasos estrechos por donde pasa buena parte del comercio y el petróleo, como Ormuz o Malaca.'],
        ['¿Qué minerales son estratégicos para la transición energética?', 'Litio, cobre, níquel, cobalto y tierras raras, entre otros.'],
        ['¿Qué es la maldición de los recursos?', 'Que países muy dependientes de recursos naturales tienden a crecer más lento o tener más problemas.'],
        ['¿Cuándo aparece sobre todo según Ross?', 'Con el petróleo y en países con instituciones débiles.'],
      ],
      tarjetas: [
        ['Cuellos de botella', 'Ormuz, Malaca, el canal de Panamá: una crisis ahí sube precios en todo el mundo.'],
        ['Minerales críticos', 'La transición energética depende de minerales concentrados en pocos países.'],
        ['Maldición de los recursos (Ross)', 'No es automática: pesa sobre todo con petróleo e instituciones débiles. Noruega es el contraejemplo.'],
      ],
    }),
    l('Comercio, cadenas de suministro y sanciones', 10, {
      idea: 'El comercio une a los países, pero también los vuelve dependientes. Esa dependencia se puede usar como arma: controlar un nodo clave (una tecnología, una moneda, una red) da poder sobre otros.',
      bloques: [
        ['Interdependencia', [
          'Un celular se diseña en un país, sus chips se fabrican en otro, se ensambla en un tercero y se vende en todo el mundo.',
          'Esas cadenas abaratan los productos, pero cuando se rompen (una pandemia, una guerra, un bloqueo) los efectos se sienten en todas partes.',
          'Por eso muchos países buscan hoy acercar la producción de lo estratégico (relocalización o "nearshoring").',
        ]],
        ['La interdependencia como arma', [
          'Farrell y Newman (2019) muestran que quien controla un nodo central de las redes económicas (como el dólar o los sistemas de pagos internacionales) puede vigilar o excluir a otros.',
          'Un ejemplo es la exclusión de bancos de algunos países del sistema de mensajería financiera internacional (SWIFT).',
          'Por eso hay países que intentan crear alternativas para depender menos de esas redes.',
        ]],
        ['¿Funcionan las sanciones?', [
          'Las sanciones económicas buscan presionar a un país sin usar la fuerza.',
          'Hufbauer y otros (2007) estudiaron muchos casos del siglo XX y encontraron que las sanciones lograron sus objetivos solo en una parte de ellos, más cuando las metas eran modestas.',
          'A menudo afectan más a la población que a los gobernantes, y los países sancionados buscan formas de evadirlas.',
        ]],
      ],
      ejemplos: [
        'Durante la pandemia, muchas empresas colombianas no conseguían repuestos o insumos porque las fábricas de Asia cerraron o los barcos se atrasaron. Fue una lección práctica de la fragilidad de las cadenas de suministro.',
        'Las sanciones contra Venezuela se discutieron mucho en Colombia: unos argumentaban que presionaban al gobierno, otros que empeoraban la crisis que empujó a millones a migrar. Es un caso donde los efectos de las sanciones son difíciles de separar de otras causas.',
      ],
      practica: [
        'Revisa la etiqueta de tres objetos que usas a diario y anota dónde se fabricaron.',
        'Busca un producto colombiano que se exporte y averigua a qué países va principalmente.',
        'Escribe un argumento a favor y uno en contra de las sanciones económicas como herramienta.',
      ],
      pregunta: '¿De qué países depende lo que uso todos los días, y qué pasaría si esa cadena se rompiera?',
      nota: 'El debate sobre si las sanciones "funcionan" depende de qué se considere éxito: cambiar el gobierno, cambiar una política, castigar o simplemente mostrar rechazo. Los estudios usan definiciones distintas y llegan a conclusiones distintas. Tampoco es cierto que la globalización "se acabó": el comercio mundial sigue siendo enorme, aunque algunos países estén reorganizando sus cadenas por seguridad.',
      recordar: [
        ['¿Qué es la interdependencia económica?', 'Que los países dependen unos de otros en sus cadenas de producción y comercio.'],
        ['¿Qué es la "interdependencia como arma" según Farrell y Newman?', 'Usar el control de un nodo central de las redes económicas para vigilar o excluir a otros.'],
        ['¿Qué encontraron Hufbauer y otros sobre las sanciones?', 'Que lograron sus objetivos solo en una parte de los casos, más con metas modestas.'],
        ['¿A quién suelen afectar más las sanciones?', 'A menudo a la población más que a los gobernantes.'],
      ],
      tarjetas: [
        ['Cadenas de suministro', 'Abaratan, pero cuando se rompen el efecto llega a todos. Por eso se relocaliza lo estratégico.'],
        ['Interdependencia como arma (Farrell y Newman)', 'Quien controla un nodo central (el dólar, SWIFT) puede vigilar o excluir a otros.'],
        ['Sanciones (Hufbauer)', 'Funcionan solo a veces, más con metas modestas, y a menudo golpean a la población.'],
      ],
    }),
    l('Clima, agua y migración', 10, {
      idea: 'El cambio climático actúa como multiplicador de riesgos: sequías, inundaciones y olas de calor presionan economías y pueden empujar migraciones. Pero rara vez son la única causa de un conflicto.',
      bloques: [
        ['Un multiplicador de riesgos', [
          'El IPCC (2022) describe cómo el cambio climático afecta la comida, el agua, la salud y los medios de vida, sobre todo de los más pobres.',
          'Esos impactos pueden aumentar tensiones donde ya hay pobreza, desigualdad o gobiernos débiles.',
          'Colombia es vulnerable: fenómenos como El Niño y La Niña afectan el agua, la energía hidroeléctrica y la agricultura.',
        ]],
        ['¿Guerras por el clima o por el agua?', [
          'Se dijo mucho que una sequía causó la guerra civil en Siria. Selby y otros (2017) revisaron la evidencia y concluyeron que esa relación es débil: pesaron más la política, la economía y la represión.',
          'También se repite que "las guerras del futuro serán por el agua". La historia muestra que los países que comparten ríos con frecuencia firman acuerdos de cooperación, aunque hay tensiones.',
          'El clima puede empeorar los conflictos, pero las decisiones políticas suelen ser decisivas.',
        ]],
        ['Migración', [
          'Las personas migran por muchas razones combinadas: violencia, crisis económica, persecución política, desastres y clima.',
          'Colombia ha sido en los últimos años el país que más migrantes venezolanos ha recibido, varios millones de personas, lo que cambió su economía, sus ciudades y su política.',
          'También hay millones de colombianos viviendo en el exterior, cuyas remesas son una fuente importante de ingresos para muchas familias.',
        ]],
      ],
      ejemplos: [
        'En un año de El Niño fuerte, bajan los embalses y sube el riesgo de racionamiento de energía y agua en Colombia. Un fenómeno climático se vuelve un tema económico y político.',
        'En tu barrio llegaron familias venezolanas que trabajan en ventas, domicilios y construcción. Su llegada es parte de una de las migraciones más grandes de la historia reciente de América Latina, con causas políticas y económicas.',
      ],
      practica: [
        'Busca cómo afectó el último fenómeno de El Niño o La Niña a tu región.',
        'Escribe las razones por las que alguien de tu familia o de tu entorno migró (dentro o fuera del país).',
        'Lee una noticia sobre migración y separa las causas que menciona: económicas, políticas, de violencia o climáticas.',
      ],
      pregunta: '¿Cómo ha cambiado la migración mi ciudad o mi barrio, y qué sé realmente de por qué la gente migra?',
      nota: 'Se publican cifras como "habrá 200 millones (o mil millones) de refugiados climáticos para 2050". Esas proyecciones varían enormemente según los supuestos y muchos investigadores las consideran poco confiables. Lo más respaldado: el clima es un factor más entre varios que empujan la migración, y la mayoría de la migración por desastres es interna y temporal. Las cifras de migrantes cambian; consulta fuentes como Migración Colombia o la plataforma R4V para datos actuales.',
      recordar: [
        ['¿Por qué se dice que el cambio climático es un multiplicador de riesgos?', 'Porque aumenta tensiones donde ya hay pobreza, desigualdad o gobiernos débiles.'],
        ['¿Qué concluyeron Selby y otros sobre Siria?', 'Que la relación entre la sequía y la guerra es débil; pesaron más la política, la economía y la represión.'],
        ['¿Es cierto que las guerras del futuro serán por el agua?', 'No está demostrado; los países que comparten ríos con frecuencia cooperan, aunque hay tensiones.'],
        ['¿Por qué migran las personas?', 'Por muchas razones combinadas: violencia, economía, persecución, desastres y clima.'],
      ],
      tarjetas: [
        ['Clima como multiplicador', 'Empeora riesgos donde hay pobreza y gobiernos débiles; rara vez es la única causa de un conflicto.'],
        ['Siria y la sequía (Selby, 2017)', 'La relación es débil: pesaron más la política y la represión.'],
        ['Migración', 'Casi siempre por varias causas juntas. Colombia es el principal receptor de migrantes venezolanos.'],
      ],
    }),
  ],
};

const TABLERO = {
  titulo: 'El tablero mundial',
  objetivo: 'Entender las grandes tensiones del mundo actual (la competencia entre Estados Unidos y China, la guerra en Ucrania) y cómo funcionan las organizaciones y el derecho internacional, presentando las distintas interpretaciones.',
  fuentes: [
    ['Allison, G. (2017). Destined for War: Can America and China escape Thucydides’s trap? Houghton Mifflin Harcourt.', 'La "trampa de Tucídides" entre una potencia en ascenso y otra establecida.'],
    ['Mearsheimer, J. J. (2001). The Tragedy of Great Power Politics. W. W. Norton.', 'El realismo ofensivo.'],
    ['Mearsheimer, J. J. (2014). Why the Ukraine crisis is the West’s fault. Foreign Affairs, 93(5), 77-89.', 'Una interpretación realista, muy discutida, del conflicto en Ucrania.'],
    ['Plokhy, S. (2015). The Gates of Europe: A history of Ukraine. Basic Books.', 'La historia de Ucrania y su identidad.'],
    ['Naciones Unidas (1945). Carta de las Naciones Unidas.', 'El documento fundador de la ONU.'],
    ['Corte Internacional de Justicia (2012). Territorial and Maritime Dispute (Nicaragua v. Colombia), Judgment of 19 November 2012.', 'El fallo sobre los límites marítimos con Nicaragua.'],
    ['Estatuto de Roma de la Corte Penal Internacional (1998).', 'El tratado que creó la Corte Penal Internacional.'],
  ],
  lecciones: [
    l('Estados Unidos y China', 11, {
      idea: 'La relación entre Estados Unidos, la potencia dominante, y China, la potencia en ascenso, es la más importante del siglo XXI. Compiten en economía, tecnología y poder militar, pero también dependen mucho uno del otro.',
      bloques: [
        ['El ascenso de China', [
          'En pocas décadas, China pasó de ser un país pobre a la segunda economía del mundo y el mayor exportador.',
          'Sacó de la pobreza extrema a cientos de millones de personas, con un modelo de partido único y un Estado muy presente en la economía.',
          'Hoy es el principal socio comercial de muchos países de América Latina, incluidos varios vecinos de Colombia.',
        ]],
        ['La trampa de Tucídides', [
          'Graham Allison (2017) tomó la idea del historiador griego Tucídides: la guerra entre Atenas y Esparta se volvió inevitable por el miedo que causaba el ascenso de Atenas.',
          'Allison revisó varios casos históricos en que una potencia en ascenso desafió a una establecida y encontró que la mayoría terminaron en guerra, aunque no todos.',
          'Otros autores critican la selección de casos y señalan que las armas nucleares y la interdependencia económica cambian el cálculo.',
        ]],
        ['Dónde compiten', [
          'Tecnología: los chips más avanzados, la inteligencia artificial, las telecomunicaciones (5G).',
          'Taiwán: una isla con gobierno propio que China considera parte de su territorio, y donde se fabrica buena parte de los chips más avanzados del mundo.',
          'Influencia: comercio, inversión en infraestructura (como la Iniciativa de la Franja y la Ruta china), préstamos y alianzas.',
        ]],
      ],
      ejemplos: [
        'Muchos de los celulares, motos y herramientas que se venden en Colombia vienen de China, mientras que buena parte de la cooperación militar y antidrogas de Colombia es con Estados Unidos. Colombia está en medio de esa relación.',
        'Si hubiera un conflicto en el estrecho de Taiwán, la producción de chips podría detenerse y faltarían celulares, carros y computadores en todo el mundo, incluida Colombia.',
      ],
      practica: [
        'Busca cuáles son hoy los principales socios comerciales de Colombia.',
        'Escribe un argumento de por qué un conflicto entre Estados Unidos y China sería probable y otro de por qué no.',
        'Lee una noticia sobre chips o tecnología y anota qué papel juegan Estados Unidos, China y Taiwán.',
      ],
      pregunta: '¿Cómo me afectaría a mí, aquí en Colombia, una crisis grave entre Estados Unidos y China?',
      nota: 'La "trampa de Tucídides" se volvió muy popular, pero varios historiadores discuten el conteo de casos de Allison y si la guerra entre Atenas y Esparta se puede comparar con el mundo actual. El propio Allison dice que la guerra no es inevitable. Las cifras económicas (tamaño de cada economía, comercio) cambian cada año: consulta fuentes como el Banco Mundial o el FMI para los datos actuales.',
      recordar: [
        ['¿Qué es la trampa de Tucídides según Allison?', 'El riesgo de guerra cuando una potencia en ascenso desafía a una establecida.'],
        ['¿Qué critican otros autores de esa idea?', 'La selección de casos y que las armas nucleares y la interdependencia cambian el cálculo.'],
        ['¿Por qué Taiwán es tan importante?', 'Porque China la reclama y allí se fabrica buena parte de los chips más avanzados del mundo.'],
        ['¿En qué compiten Estados Unidos y China?', 'Tecnología, comercio, inversión, influencia y poder militar.'],
      ],
      tarjetas: [
        ['Trampa de Tucídides (Allison)', 'Potencia en ascenso vs. establecida: riesgo de guerra, pero no inevitable. El conteo de casos se discute.'],
        ['Taiwán', 'Reclamada por China y clave en la fabricación de chips avanzados: un punto de tensión global.'],
        ['Colombia en medio', 'Gran socio comercial: China. Gran socio militar y antidrogas: Estados Unidos.'],
      ],
    }),
    l('Rusia, Europa y la guerra en Ucrania', 11, {
      idea: 'En 2022 Rusia lanzó una invasión a gran escala de Ucrania, la mayor guerra en Europa desde la Segunda Guerra Mundial. Para entenderla hay que conocer la historia, las distintas explicaciones y sus efectos en el mundo.',
      bloques: [
        ['La historia', [
          'Ucrania y Rusia tienen una historia compartida y conflictiva: ambas formaron parte del Imperio ruso y luego de la Unión Soviética (Plokhy, 2015).',
          'Ucrania se independizó en 1991, al disolverse la Unión Soviética.',
          'En 2014, Rusia anexó la península de Crimea y apoyó a grupos armados en el este de Ucrania; en febrero de 2022 lanzó la invasión a gran escala.',
        ]],
        ['Las explicaciones', [
          'Una interpretación realista (Mearsheimer, 2014) sostiene que la expansión de la OTAN hacia el este hizo que Rusia se sintiera amenazada.',
          'Muchos otros analistas responden que los países de Europa del Este pidieron entrar a la OTAN por su propia decisión y su miedo a Rusia, y que la invasión responde también a la visión del gobierno ruso sobre Ucrania como parte de su esfera o de su identidad.',
          'La mayoría de los países de la Asamblea General de la ONU votó condenando la invasión como una violación de la soberanía de Ucrania.',
        ]],
        ['Efectos en el mundo', [
          'Subieron los precios de la energía y de los alimentos, porque Rusia y Ucrania son grandes exportadores de gas, petróleo, trigo y fertilizantes.',
          'Europa redujo su dependencia del gas ruso y aumentó su gasto militar; la OTAN sumó nuevos miembros (Finlandia y Suecia).',
          'Para Colombia, el efecto más visible fue el aumento de precios de los fertilizantes y de algunos alimentos.',
        ]],
      ],
      ejemplos: [
        'En 2022, los campesinos colombianos vieron cómo el precio de los fertilizantes se disparaba. Buena parte de esos fertilizantes venían de Rusia o dependían del gas: una guerra lejana llegó a los cultivos de papa de Boyacá.',
        'En una discusión, alguien dice que "la culpa es solo de la OTAN" y otro que "es solo la ambición de Putin". Conocer las distintas explicaciones te permite discutir con más matices y separar las explicaciones de las justificaciones.',
      ],
      practica: [
        'Busca en un mapa dónde quedan Ucrania, Crimea y los países que entraron a la OTAN después de 1991.',
        'Escribe la explicación realista y la principal crítica a ella en dos frases cada una.',
        'Investiga cómo afectó la guerra los precios de algún producto en Colombia.',
      ],
      pregunta: '¿Distingo entre explicar por qué un país hizo algo y justificarlo?',
      nota: 'Este es un conflicto en curso y muy cargado de propaganda de todos los lados: desconfía de cifras de bajas o avances que no vengan de varias fuentes independientes. Explicar las causas de una guerra (como hace Mearsheimer) no es lo mismo que justificarla; y que exista una explicación no significa que sea la correcta: el debate académico sigue. Este curso no puede describir los hechos más recientes: consulta medios serios y diversos para la situación actual.',
      recordar: [
        ['¿Cuándo se independizó Ucrania?', 'En 1991, al disolverse la Unión Soviética.'],
        ['¿Qué pasó en 2014 y en 2022?', 'En 2014 Rusia anexó Crimea; en febrero de 2022 lanzó la invasión a gran escala.'],
        ['¿Qué sostiene la explicación realista de Mearsheimer?', 'Que la expansión de la OTAN hizo que Rusia se sintiera amenazada.'],
        ['¿Qué efecto tuvo la guerra en Colombia?', 'Subieron los precios de los fertilizantes y de algunos alimentos.'],
      ],
      tarjetas: [
        ['Guerra en Ucrania', '2014: anexión de Crimea. 2022: invasión a gran escala. La mayor guerra en Europa desde 1945.'],
        ['Explicar no es justificar', 'Hay explicaciones distintas (OTAN, visión rusa de Ucrania); entender las causas no equivale a justificar.'],
        ['Efectos globales', 'Más caros energía, alimentos y fertilizantes; Europa redujo su dependencia del gas ruso.'],
      ],
    }),
    l('La ONU y el derecho internacional', 10, {
      idea: 'No hay un gobierno mundial, pero sí reglas e instituciones: la ONU, las cortes internacionales y los tratados. Tienen límites reales, pero también efectos concretos, incluidos para Colombia.',
      bloques: [
        ['La ONU', [
          'La ONU se creó en 1945, después de la Segunda Guerra Mundial, para mantener la paz y la seguridad (Carta de las Naciones Unidas).',
          'Su Consejo de Seguridad tiene cinco miembros permanentes con derecho a veto: Estados Unidos, Rusia, China, Reino Unido y Francia.',
          'Ese veto hace que el Consejo se paralice cuando una potencia está involucrada en un conflicto.',
          'La ONU también hace mucho trabajo menos visible: ayuda humanitaria, refugiados, salud (OMS), alimentos y misiones de verificación, como la de los acuerdos de paz en Colombia.',
        ]],
        ['Las cortes internacionales', [
          'La Corte Internacional de Justicia (en La Haya) resuelve disputas entre Estados que aceptan su autoridad.',
          'En 2012 falló en el caso entre Nicaragua y Colombia: confirmó la soberanía colombiana sobre las islas de San Andrés, Providencia y los cayos, pero trazó un límite marítimo que dio a Nicaragua una amplia zona de mar.',
          'La Corte Penal Internacional, creada por el Estatuto de Roma (1998), juzga a personas (no a Estados) por crímenes graves como genocidio y crímenes de guerra. Colombia es parte del Estatuto.',
        ]],
        ['Límites y utilidad', [
          'Las potencias a veces ignoran las reglas cuando no les convienen, y no hay una policía mundial que las obligue.',
          'Aun así, el derecho internacional crea costos (reputación, sanciones, aislamiento) y da a los países pequeños herramientas para defenderse.',
          'La mayoría de las reglas (aviación, correo, comercio, mar) se cumplen todos los días sin que sea noticia.',
        ]],
      ],
      ejemplos: [
        'El fallo de La Haya de 2012 afectó directamente a los pescadores de San Andrés, que perdieron acceso a zonas donde trabajaban. Una decisión de una corte internacional cambió la vida de una comunidad colombiana.',
        'Cuando viajas en avión de Bogotá a Madrid, decenas de reglas internacionales (espacio aéreo, seguridad, pasaportes) funcionan sin que lo notes. Esa parte del derecho internacional casi nunca falla.',
      ],
      practica: [
        'Busca en el mapa el área marítima que quedó para Nicaragua con el fallo de 2012.',
        'Escribe un ejemplo en que la ONU haya tenido un papel en Colombia.',
        'Lee una noticia sobre el Consejo de Seguridad y revisa si algún país usó el veto.',
      ],
      pregunta: '¿Creo que las reglas internacionales "no sirven para nada"? ¿Qué ejemplos me harían cambiar de opinión?',
      nota: 'Se dice que "la ONU no sirve para nada" o, al revés, que "es un gobierno mundial". Ninguna de las dos es cierta: es una organización de Estados con poderes limitados, que funciona mejor en temas técnicos y humanitarios que en conflictos entre potencias. Sobre el caso con Nicaragua hubo fallos y procesos posteriores; consulta fuentes oficiales para el estado actual.',
      recordar: [
        ['¿Cuándo se creó la ONU?', 'En 1945, después de la Segunda Guerra Mundial.'],
        ['¿Quiénes tienen veto en el Consejo de Seguridad?', 'Estados Unidos, Rusia, China, Reino Unido y Francia.'],
        ['¿Qué decidió la Corte Internacional de Justicia en 2012 sobre Nicaragua y Colombia?', 'Confirmó la soberanía colombiana sobre San Andrés, Providencia y los cayos, pero dio a Nicaragua una amplia zona marítima.'],
        ['¿Qué diferencia hay entre la Corte Internacional de Justicia y la Corte Penal Internacional?', 'La primera resuelve disputas entre Estados; la segunda juzga a personas por crímenes graves.'],
      ],
      tarjetas: [
        ['Consejo de Seguridad', 'Cinco miembros con veto (EE. UU., Rusia, China, Reino Unido, Francia): se paraliza cuando una potencia está involucrada.'],
        ['Fallo de La Haya (2012)', 'Islas para Colombia, amplia zona marítima para Nicaragua. Afectó a los pescadores de San Andrés.'],
        ['CIJ vs. CPI', 'CIJ: disputas entre Estados. CPI: juzga personas por genocidio y crímenes de guerra.'],
      ],
    }),
  ],
};

const COLOMBIA = {
  titulo: 'Colombia, América Latina y las noticias',
  objetivo: 'Ubicar a Colombia y a América Latina en el tablero mundial, y aprender a leer las noticias internacionales con criterio, sin caer en la propaganda ni en las explicaciones fáciles.',
  fuentes: [
    ['Palacios, M. y Safford, F. (2002). Colombia: país fragmentado, sociedad dividida. Norma.', 'Cómo la geografía y la historia fragmentaron a Colombia.'],
    ['Tickner, A. B. (2007). Intervención por invitación: claves de la política exterior colombiana y de sus debilidades principales. Colombia Internacional, 65, 90-111.', 'La relación de Colombia con Estados Unidos.'],
    ['Bértola, L. y Ocampo, J. A. (2012). The Economic Development of Latin America since Independence. Oxford University Press. (En español: El desarrollo económico de América Latina desde la Independencia, FCE).', 'La historia económica de la región y su dependencia de las materias primas.'],
    ['Tetlock, P. E. (2005). Expert Political Judgment: How good is it? How can we know? Princeton University Press.', 'Qué tan bien predicen los expertos en política.'],
    ['Vosoughi, S., Roy, D. y Aral, S. (2018). The spread of true and false news online. Science, 359(6380), 1146-1151.', 'Las noticias falsas se difunden más rápido que las verdaderas.'],
  ],
  lecciones: [
    l('Colombia en el mapa del mundo', 11, {
      idea: 'Colombia es una "esquina" de Sudamérica con costas en dos océanos, la Amazonía, los Andes y una larga frontera con Venezuela. Su geografía, el narcotráfico y su relación con Estados Unidos han marcado su papel en el mundo.',
      bloques: [
        ['Una geografía que fragmenta', [
          'Marco Palacios y Frank Safford (2002) describen cómo las tres cordilleras dividieron a Colombia en regiones muy distintas y difíciles de conectar.',
          'Esa fragmentación facilitó identidades regionales fuertes y, durante mucho tiempo, que el Estado no llegara a zonas apartadas, donde crecieron grupos armados y economías ilegales.',
          'A la vez, la posición entre dos océanos y cerca del canal de Panamá le da a Colombia un valor estratégico. Panamá fue parte de Colombia hasta 1903.',
        ]],
        ['Narcotráfico y relación con Estados Unidos', [
          'Colombia ha sido uno de los principales productores de cocaína del mundo, lo que convirtió el narcotráfico en tema central de su política exterior.',
          'Arlene Tickner (2007) habla de "intervención por invitación": los gobiernos colombianos buscaron activamente la ayuda de Estados Unidos, como en el Plan Colombia (desde el año 2000).',
          'Esa relación trajo recursos militares y de cooperación, pero también debates sobre la soberanía, la fumigación y los resultados de la guerra contra las drogas.',
        ]],
        ['Vecinos y región', [
          'La frontera con Venezuela, de más de 2.000 kilómetros, es una de las más dinámicas del continente: comercio, familias binacionales, migración y también contrabando y grupos armados.',
          'Colombia participa en organizaciones regionales (como la Comunidad Andina y la Alianza del Pacífico) y en la OCDE.',
          'Sus relaciones con los vecinos cambian mucho según los gobiernos de turno de cada país.',
        ]],
      ],
      ejemplos: [
        'Un camión de Bogotá a la costa tarda muchas horas por las cordilleras, mientras que un contenedor de Asia llega a Buenaventura en semanas. La geografía hace que a veces sea más fácil comerciar con el mundo que entre regiones del propio país.',
        'Cuando se cierra o se abre la frontera con Venezuela, cambia la vida en Cúcuta: el comercio, el trabajo, los precios y la migración. Es geopolítica que se siente en la calle.',
      ],
      practica: [
        'Ubica en un mapa los principales puertos de Colombia y por dónde sale lo que exporta.',
        'Escribe qué cambió en Colombia con el Plan Colombia, según lo que sepas o investigues, con un efecto positivo y uno negativo.',
        'Busca con qué países limita Colombia por tierra y por mar.',
      ],
      pregunta: '¿Cómo explicaría a un extranjero la posición de Colombia en el mundo, más allá del narcotráfico?',
      nota: 'Es común que desde afuera se reduzca a Colombia al narcotráfico, y desde adentro a veces se exagera su importancia o su aislamiento. La realidad es más rica: Colombia es una economía mediana, con un papel diplomático activo en temas como la paz, el medio ambiente y la migración. Las evaluaciones del Plan Colombia son muy distintas según quién las haga: hubo mejoras en seguridad y también críticas por derechos humanos y por no reducir de forma sostenida la producción de coca.',
      recordar: [
        ['¿Qué describen Palacios y Safford sobre la geografía colombiana?', 'Que las cordilleras fragmentaron el país en regiones difíciles de conectar.'],
        ['¿Hasta cuándo fue Panamá parte de Colombia?', 'Hasta 1903.'],
        ['¿Qué significa "intervención por invitación" según Tickner?', 'Que los gobiernos colombianos buscaron activamente la ayuda de Estados Unidos, como en el Plan Colombia.'],
        ['¿Cuándo empezó el Plan Colombia?', 'Alrededor del año 2000.'],
      ],
      tarjetas: [
        ['Geografía colombiana', 'Tres cordilleras que fragmentan, dos océanos y la Amazonía. Panamá fue parte de Colombia hasta 1903.'],
        ['Intervención por invitación (Tickner)', 'Colombia buscó la ayuda de EE. UU. (Plan Colombia, desde 2000), con logros y críticas.'],
        ['Frontera con Venezuela', 'Más de 2.000 km: comercio, familias, migración, contrabando y grupos armados.'],
      ],
    }),
    l('América Latina en el mundo', 10, {
      idea: 'América Latina es una región rica en recursos naturales que ha dependido mucho de exportarlos. Esa dependencia, su desigualdad y su relación con las potencias explican buena parte de su lugar en el mundo.',
      bloques: [
        ['La dependencia de las materias primas', [
          'Luis Bértola y José Antonio Ocampo (2012) muestran que, desde la independencia, las economías latinoamericanas han dependido de exportar materias primas: café, petróleo, minerales, carne, soya.',
          'Cuando los precios suben (como en el "boom" de las materias primas de los años 2000), la región crece; cuando bajan, vienen las crisis.',
          'Diversificar la economía (industria, servicios, tecnología) ha sido un desafío permanente.',
        ]],
        ['Entre potencias', [
          'Durante el siglo XX, Estados Unidos fue la potencia dominante en la región, con intervenciones directas e indirectas en varios países.',
          'En el siglo XXI, China se volvió el principal socio comercial de varios países sudamericanos y un gran inversionista y prestamista.',
          'Muchos gobiernos latinoamericanos buscan no alinearse del todo con ninguna potencia y sacar ventaja de ambas.',
        ]],
        ['Recursos estratégicos', [
          'La región tiene grandes reservas de litio (Argentina, Bolivia y Chile), cobre (Chile y Perú), petróleo (Venezuela, Brasil) y la mayor selva tropical del planeta, la Amazonía.',
          'La transición energética podría ser una oportunidad, o repetir la historia de exportar sin agregar valor.',
          'La Amazonía es clave para el clima mundial, lo que la vuelve tema de debate internacional y de tensión con la soberanía de los países que la comparten.',
        ]],
      ],
      ejemplos: [
        'Cuando el precio internacional del café cae, miles de familias cafeteras colombianas ven bajar sus ingresos, aunque cosechen igual. La dependencia de una materia prima se siente en las regiones.',
        'Una empresa china construye un puerto o una vía en un país vecino, mientras Estados Unidos ofrece cooperación en seguridad. Los gobiernos de la región negocian entre ambas potencias.',
      ],
      practica: [
        'Busca los cinco productos que más exporta Colombia y cuántos son materias primas.',
        'Escribe qué ventaja y qué riesgo tiene para un país latinoamericano acercarse mucho a China o a Estados Unidos.',
        'Busca qué países comparten la Amazonía y uno de los desafíos que enfrentan para cuidarla.',
      ],
      pregunta: '¿Qué le haría falta a Colombia para depender menos del petróleo y el carbón?',
      nota: 'Se repite que "América Latina es pobre porque la saquearon" o, al revés, "porque no trabaja". Ambas explicaciones son demasiado simples: los historiadores económicos señalan una mezcla de instituciones heredadas, desigualdad, dependencia de materias primas, inestabilidad política y decisiones económicas. La relación con China también genera debate: unos la ven como oportunidad de comercio e inversión; otros advierten sobre deudas y dependencia.',
      recordar: [
        ['¿De qué han dependido históricamente las economías latinoamericanas según Bértola y Ocampo?', 'De exportar materias primas.'],
        ['¿Qué pasa cuando suben o bajan los precios de las materias primas?', 'Cuando suben, la región crece; cuando bajan, vienen crisis.'],
        ['¿Qué papel tiene China hoy en la región?', 'Es el principal socio comercial de varios países sudamericanos y un gran inversionista.'],
        ['¿Dónde está el triángulo del litio?', 'En Argentina, Bolivia y Chile.'],
      ],
      tarjetas: [
        ['Dependencia de materias primas', 'América Latina crece con precios altos y entra en crisis con precios bajos. Diversificar es el reto.'],
        ['Entre EE. UU. y China', 'EE. UU. fue la potencia dominante; China es hoy el gran socio comercial de varios países.'],
        ['Recursos estratégicos', 'Litio, cobre, petróleo y la Amazonía: oportunidad o repetición de la historia.'],
      ],
    }),
    l('Cómo leer las noticias del mundo', 11, {
      idea: 'Las noticias internacionales llegan filtradas, a veces con propaganda, y muchas predicciones de expertos fallan. Leer con criterio es usar varias fuentes, separar hechos de opiniones y desconfiar de lo que se viraliza.',
      bloques: [
        ['Los expertos se equivocan', [
          'Philip Tetlock (2005) siguió durante años las predicciones de cientos de expertos en política.',
          'En promedio, sus predicciones fueron poco mejores que el azar, y los más famosos y seguros de sí mismos a menudo acertaban menos.',
          'Los que acertaban más eran los que consideraban varias explicaciones, dudaban y ajustaban sus ideas con información nueva.',
        ]],
        ['Lo falso viaja más rápido', [
          'Vosoughi, Roy y Aral (2018) analizaron millones de publicaciones en Twitter y encontraron que las noticias falsas se difundían más lejos y más rápido que las verdaderas.',
          'Las falsas suelen ser más novedosas y despiertan más sorpresa o indignación, lo que nos hace compartirlas.',
          'En las guerras y crisis internacionales circulan muchos videos e imágenes viejos o sacados de contexto.',
        ]],
        ['Cómo leer mejor', [
          'Lee la misma noticia en medios de distintos países y orientaciones.',
          'Separa los hechos (qué pasó, dónde, cuándo) de las interpretaciones y opiniones.',
          'Desconfía de las explicaciones que culpan a un solo actor de todo o que todo lo explican con una conspiración.',
          'Antes de compartir un video o una cifra impactante, busca si otras fuentes serias la confirman.',
          'Usa mapas: la proyección Mercator, la más común, agranda los países cercanos a los polos (Groenlandia parece del tamaño de África, que es unas catorce veces más grande).',
        ]],
      ],
      ejemplos: [
        'En un grupo de WhatsApp circula un video de "un bombardeo de ayer" en una guerra lejana. Al buscarlo, descubres que es de un videojuego o de un conflicto de hace años. Verificar antes de compartir evita difundir propaganda.',
        'Un analista en televisión asegura con total seguridad qué va a pasar en una elección extranjera. Según Tetlock, la seguridad no es señal de acierto: mejor desconfiar de quien no muestra dudas.',
      ],
      practica: [
        'Lee hoy una misma noticia internacional en dos medios de países distintos y anota en qué difieren.',
        'Toma una noticia y separa en dos columnas los hechos y las opiniones.',
        'Busca un mapa con la proyección de Gall-Peters o una herramienta que compare tamaños reales de países, y compara África con Groenlandia.',
      ],
      pregunta: '¿Qué noticia internacional he compartido sin verificar, y qué haría distinto ahora?',
      nota: 'Desconfiar de todo tampoco es la solución: el escepticismo extremo ("todos mienten, no se puede saber nada") es tan peligroso como creer todo, porque deja el campo libre a la propaganda. Hay medios, agencias de noticias y verificadores (como ColombiaCheck) que trabajan con métodos serios. El estudio de Vosoughi fue en Twitter y con datos hasta 2017; las plataformas han cambiado, pero el patrón de que lo novedoso e indignante se comparte más sigue siendo un riesgo.',
      recordar: [
        ['¿Qué encontró Tetlock sobre los expertos en política?', 'Que sus predicciones fueron poco mejores que el azar, y los más seguros a menudo acertaban menos.'],
        ['¿Qué encontraron Vosoughi, Roy y Aral?', 'Que las noticias falsas se difunden más lejos y más rápido que las verdaderas.'],
        ['Nombra tres hábitos para leer mejor las noticias del mundo.', 'Usar varias fuentes, separar hechos de opiniones, desconfiar de explicaciones de un solo culpable y verificar antes de compartir.'],
        ['¿Qué distorsiona la proyección Mercator?', 'Agranda los países cercanos a los polos; Groenlandia parece del tamaño de África, que es mucho más grande.'],
      ],
      tarjetas: [
        ['Los expertos se equivocan (Tetlock)', 'Predicen poco mejor que el azar; los que dudan y ajustan aciertan más.'],
        ['Lo falso viaja más rápido (Vosoughi, 2018)', 'Lo novedoso e indignante se comparte más: verifica antes de compartir.'],
        ['Leer noticias del mundo', 'Varias fuentes, hechos vs. opiniones, desconfiar de un solo culpable y usar mapas con cuidado.'],
      ],
    }),
  ],
};

export default {
  id: 'geopolitica',
  nombre: 'Geopolítica',
  area: 'mundo',
  icono: '🌍',
  nivel: 'Intermedio',
  paraQue: 'Tener las claves para entender las noticias del mundo: cómo la geografía, los recursos, la economía y las ideas mueven a los países, y dónde está Colombia en ese tablero. También aprenderás a leer la información internacional con criterio, sin caer en propaganda ni en explicaciones fáciles.',
  modulos: [IDEAS, RECURSOS, TABLERO, COLOMBIA],
  proyecto: {
    titulo: 'Tu observatorio del mundo de un mes',
    intro: 'Durante 4 semanas vas a seguir un tema internacional de tu interés aplicando las herramientas del curso, y al final vas a escribir tu propio análisis en una página.',
    pasos: [
      'Escoge un tema internacional que te interese (una guerra, una elección, una disputa comercial, la migración, un recurso).',
      'Busca tres fuentes de distintos países u orientaciones y síguelas durante el mes.',
      'Cada semana, anota los hechos nuevos en una columna y las interpretaciones en otra.',
      'Explica el tema con las tres lentes: realista, liberal y constructivista.',
      'Identifica qué papel juegan la geografía, los recursos y la economía.',
      'Escribe cómo afecta o podría afectar el tema a Colombia.',
      'Haz una predicción con probabilidad ("creo que hay 60 % de que…") y anótala con fecha.',
      'Al final del mes, escribe tu análisis en una página y revisa tu predicción.',
    ],
  },
};
