// Educación financiera con los pies en la tierra (Colombia). Formato de src/cursos (ver aprender-a-aprender.js y /agregar-curso).
// Las cifras que cambian cada año (UVT, topes, montos asegurados, tasas) no van con número: se dice dónde consultarlas.

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const BASES = {
  titulo: 'Las bases',
  objetivo: 'Saber a dónde se va tu plata, armar un presupuesto que se pueda cumplir, tener un fondo de emergencia que se llene solo y entender cómo la inflación y el interés compuesto cambian el valor del dinero en el tiempo.',
  fuentes: [
    ['Lusardi, A. y Mitchell, O. S. (2014). The economic importance of financial literacy: Theory and evidence. Journal of Economic Literature, 52(1), 5-44.', 'Qué tanto sabe la gente de finanzas y por qué importa.'],
    ['Fernandes, D., Lynch, J. G. y Netemeyer, R. G. (2014). Financial literacy, financial education, and downstream financial behaviors. Management Science, 60(8), 1861-1883.', 'Los cursos de finanzas tienen efectos pequeños que se desvanecen si no se aplican.'],
    ['Warren, E. y Tyagi, A. W. (2005). All Your Worth: The ultimate lifetime money plan. Free Press.', 'El origen de la regla 50/30/20.'],
    ['Thaler, R. H. (1999). Mental accounting matters. Journal of Behavioral Decision Making, 12(3), 183-206.', 'La contabilidad mental: tratamos distinto la plata según de dónde viene.'],
    ['Madrian, B. C. y Shea, D. F. (2001). The power of suggestion: Inertia in 401(k) participation and savings behavior. Quarterly Journal of Economics, 116(4), 1149-1187.', 'El ahorro automático por defecto aumenta muchísimo cuánta gente ahorra.'],
    ['Thaler, R. H. y Benartzi, S. (2004). Save More Tomorrow: Using behavioral economics to increase employee saving. Journal of Political Economy, 112(S1), S164-S187.', 'Comprometerse hoy a ahorrar más cuando suba el sueldo.'],
    ['Stango, V. y Zinman, J. (2009). Exponential growth bias and household finance. Journal of Finance, 64(6), 2807-2849.', 'Subestimamos cómo crecen los intereses compuestos, a favor y en contra.'],
  ],
  lecciones: [
    l('Cómo funciona tu plata: el presupuesto', 11, {
      idea: 'No puedes manejar lo que no ves. El primer paso de las finanzas personales es saber cuánto entra, a dónde se va y decidir de antemano cuánto va a cada cosa.',
      bloques: [
        ['Por qué importa saber de esto', [
          'Lusardi y Mitchell (2014) encontraron en muchos países que buena parte de los adultos no responde bien tres preguntas básicas: cómo crece un ahorro con intereses, qué hace la inflación y por qué conviene diversificar.',
          'Quienes las responden bien tienden a ahorrar más, planear la pensión y endeudarse menos caro.',
          'Pero saber no basta: lo que cambia tu situación son los hábitos que pongas en marcha (por eso cada lección trae práctica).',
        ]],
        ['El flujo de tu plata', [
          'Ingresos: todo lo que entra (salario, extras, ventas).',
          'Gastos fijos: lo que pagas todos los meses casi igual (arriendo, servicios, cuotas, plan de celular).',
          'Gastos variables: lo que cambia (mercado, transporte, salidas, domicilios).',
          'Ahorro: lo que guardas para emergencias y metas. Si no lo planeas, casi nunca sobra.',
        ]],
        ['La regla 50/30/20', [
          'Elizabeth Warren y Amelia Tyagi (2005) propusieron una guía sencilla: máximo el 50 % del ingreso neto para necesidades, máximo el 30 % para deseos y mínimo el 20 % para ahorro y pagar deudas.',
          'Es un punto de partida, no una ley: si ganas el mínimo, las necesidades se llevan más del 50 %; lo importante es que el ahorro exista y vaya subiendo.',
          'La sección 💰 Finanzas de la app ya la calcula: registra tus gastos con su categoría y mira la pestaña 📊 Mes.',
        ]],
        ['Contabilidad mental', [
          'Richard Thaler (1999) describió que tratamos la plata distinto según de dónde viene: la prima "es para darse gusto", el sueldo "es para las cuentas".',
          'Pero un peso es un peso: la prima gastada en un televisor es plata que no fue al fondo de emergencia.',
          'Úsalo a tu favor: decide antes de recibirla a qué va cada plata extra (prima, cesantías, bonos).',
        ]],
      ],
      ejemplos: [
        'Ganas 3 millones netos. Con la regla 50/30/20 serían 1,5 millones para necesidades (arriendo, servicios, mercado, transporte), 900.000 para deseos y 600.000 para ahorro o deudas. Si el arriendo solo ya se lleva 1,2 millones, sabes que ahí está el punto a revisar.',
        'Registras tus gastos un mes en la app y descubres que en domicilios y comida fuera se te van 450.000 pesos. No lo sabías porque eran gastos de 25.000 que no se sentían.',
      ],
      practica: [
        'Escribe tu ingreso neto del mes y tus gastos fijos con su valor.',
        'Durante una semana, registra todos tus gastos en 💰 Finanzas, incluso los pequeños.',
        'Decide antes de recibir tu próxima prima o plata extra a qué va cada parte.',
      ],
      pregunta: '¿A dónde se me va la plata sin darme cuenta?',
      nota: 'Un metaanálisis (Fernandes, Lynch y Netemeyer, 2014) encontró que los cursos de educación financiera, por sí solos, cambian muy poco el comportamiento, y que el efecto se desvanece en meses. Lo que más funciona es aprender justo cuando vas a tomar una decisión y convertirlo en hábitos y en sistemas automáticos. Por eso este curso insiste tanto en la práctica.',
      recordar: [
        ['¿Cuáles son las tres preguntas básicas de Lusardi y Mitchell?', 'Cómo crece un ahorro con intereses, qué hace la inflación y por qué conviene diversificar.'],
        ['¿Qué dice la regla 50/30/20?', 'Máximo 50 % para necesidades, máximo 30 % para deseos y mínimo 20 % para ahorro y deudas.'],
        ['¿Qué es la contabilidad mental?', 'Tratar la plata distinto según de dónde viene, aunque un peso sea un peso.'],
        ['¿Qué encontró el metaanálisis de Fernandes sobre los cursos de finanzas?', 'Que por sí solos cambian poco el comportamiento y el efecto se desvanece si no se aplica.'],
      ],
      tarjetas: [
        ['Regla 50/30/20 (Warren y Tyagi)', 'Necesidades máximo 50 %, deseos máximo 30 %, ahorro y deudas mínimo 20 % del ingreso neto.'],
        ['Contabilidad mental (Thaler)', 'Un peso es un peso, venga de la prima o del sueldo. Decide antes a qué va cada plata extra.'],
        ['Saber no basta', 'Lo que cambia tus finanzas son los hábitos y los sistemas automáticos, no solo la información.'],
      ],
    }),
    l('Fondo de emergencia y ahorro automático', 10, {
      idea: 'El fondo de emergencia es la plata que te protege de tener que endeudarte caro cuando algo sale mal. La forma más segura de llenarlo es que el ahorro salga solo, apenas te pagan.',
      bloques: [
        ['El fondo de emergencia', [
          'Es plata separada solo para imprevistos: quedarte sin trabajo, una enfermedad, un daño de la moto o del carro.',
          'La recomendación habitual es tener entre 3 y 6 meses de gastos necesarios; si tu ingreso es variable o independiente, más cerca de 6.',
          'Empieza por una meta pequeña (por ejemplo, un mes de gastos) para no desanimarte.',
          'La app lo calcula en 💰 Finanzas → 🐷 Ahorro con tu gasto promedio.',
        ]],
        ['Dónde guardarlo', [
          'Debe estar disponible rápido y sin riesgo de perder valor: una cuenta de ahorros aparte o un CDT corto en una entidad vigilada por la Superintendencia Financiera.',
          'Los depósitos en entidades inscritas en Fogafín están asegurados hasta un monto por persona y por entidad; consulta el valor vigente en la página de Fogafín.',
          'No va en acciones, cripto ni "negocios": justo cuando lo necesites puede haber bajado.',
          'Ojo con el 4x1000 (gravamen a los movimientos financieros): puedes marcar una cuenta como exenta hasta cierto monto mensual; pregunta en tu banco.',
        ]],
        ['Que el ahorro salga solo', [
          'Madrian y Shea (2001) estudiaron una empresa que cambió el plan de ahorro para el retiro: antes había que inscribirse; después, todos quedaban inscritos y podían salirse.',
          'La participación subió muchísimo, aunque la decisión era igual de libre: la opción por defecto pesa enormemente.',
          'Aplícalo a ti: programa una transferencia automática a tu cuenta de ahorro el mismo día que te pagan. Lo que no ves, no lo gastas.',
          'Thaler y Benartzi (2004) propusieron "Ahorra más mañana": comprometerte hoy a subir tu ahorro cada vez que te suban el sueldo. Como el aumento todavía no lo tienes, no duele.',
        ]],
      ],
      ejemplos: [
        'Tus gastos necesarios son 2 millones al mes. Tu primera meta es un fondo de 2 millones; la meta completa, entre 6 y 12 millones. Programas una transferencia de 300.000 pesos el día de pago a una cuenta aparte que no tiene tarjeta débito.',
        'Se te daña la moto y el arreglo cuesta 800.000. Sin fondo, pagarías con la tarjeta de crédito a varias cuotas con intereses. Con fondo, pagas de contado y en los meses siguientes lo vuelves a llenar.',
      ],
      practica: [
        'Calcula tus gastos necesarios de un mes y multiplícalos por 3: esa es tu meta de fondo de emergencia.',
        'Abre o separa una cuenta solo para el fondo, distinta de la que usas a diario.',
        'Programa una transferencia automática, aunque sea pequeña, para el día en que te pagan.',
      ],
      pregunta: '¿Qué pasaría si mañana me quedo sin ingresos un mes? ¿Cómo lo pagaría?',
      nota: 'La cifra de "3 a 6 meses" es una regla práctica de planeadores financieros, no el resultado de un estudio: depende de qué tan estable es tu ingreso, si tienes personas a cargo y si cuentas con otros apoyos. Lo que sí está bien respaldado es el efecto de automatizar el ahorro y de las opciones por defecto.',
      recordar: [
        ['¿Para qué es el fondo de emergencia?', 'Para imprevistos (perder el trabajo, una enfermedad, un daño), sin tener que endeudarte caro.'],
        ['¿Cuánto se recomienda tener?', 'Entre 3 y 6 meses de gastos necesarios, más si el ingreso es variable.'],
        ['¿Dónde conviene guardarlo?', 'En un lugar disponible y sin riesgo: cuenta de ahorros aparte o CDT corto en entidad vigilada.'],
        ['¿Qué encontraron Madrian y Shea?', 'Que cuando el ahorro es automático por defecto, muchísima más gente ahorra.'],
      ],
      tarjetas: [
        ['Fondo de emergencia', '3 a 6 meses de gastos necesarios, disponible y sin riesgo. Empieza con un mes.'],
        ['El poder del "por defecto" (Madrian y Shea)', 'Programa el ahorro automático el día de pago: lo que no ves, no lo gastas.'],
        ['Ahorra más mañana (Thaler y Benartzi)', 'Comprométete hoy a subir tu ahorro cuando te suban el sueldo.'],
      ],
    }),
    l('Inflación e interés compuesto', 11, {
      idea: 'La inflación hace que la plata quieta pierda valor cada año. El interés compuesto hace que lo ahorrado crezca cada vez más rápido, y que las deudas también. Entender los dos cambia tus decisiones.',
      bloques: [
        ['La inflación', [
          'La inflación es el aumento general de los precios. Si es del 5 % en un año, lo que costaba 100.000 pesos pasa a costar unos 105.000.',
          'El Banco de la República tiene una meta de inflación de largo plazo del 3 % anual; en algunos años la inflación real ha estado bastante por encima.',
          'Plata guardada debajo del colchón pierde poder de compra cada año.',
          'Rentabilidad real: lo que ganas por encima de la inflación. Un CDT al 10 % con inflación del 5 % te deja una ganancia real cercana al 5 % (un poco menos).',
        ]],
        ['El interés compuesto', [
          'Interés compuesto es ganar intereses sobre los intereses: cada año, lo que ganaste se suma y también empieza a ganar.',
          'Ejemplo: 1 millón al 10 % anual se vuelve unos 2,6 millones en 10 años, unos 6,7 en 20 y unos 17,4 en 30. La mayor parte del crecimiento llega al final.',
          'Regla del 72: divide 72 por la tasa anual y sabes en cuántos años, aproximadamente, se duplica la plata (al 8 %, unos 9 años).',
          'Por eso empezar temprano pesa más que ahorrar mucho tarde.',
        ]],
        ['En contra también', [
          'Stango y Zinman (2009) encontraron que la mayoría de la gente subestima cómo crece algo con intereses compuestos: es el "sesgo de crecimiento exponencial".',
          'Quienes más lo subestimaban tendían a pedir más prestado y ahorrar menos.',
          'Las deudas también crecen así: una tarjeta al 2,5 % mensual equivale a cerca del 34 % efectivo anual, no al 30 % que sale de multiplicar por 12.',
        ]],
      ],
      ejemplos: [
        'Tienes 5 millones en la cuenta de ahorros que paga casi nada mientras la inflación está en 6 %. En un año, tu plata compra cerca de 300.000 pesos menos. Si no la necesitas pronto, un CDT o un fondo de bajo riesgo al menos le gana a la inflación.',
        'Dos amigos ahorran 200.000 al mes al mismo interés. Uno empieza a los 25 y para a los 35; el otro empieza a los 35 y sigue hasta los 60. Por el interés compuesto, el primero puede terminar con una cantidad comparable o mayor, aunque puso mucha menos plata.',
      ],
      practica: [
        'Busca la inflación anual más reciente de Colombia (DANE o Banco de la República) y compárala con lo que te paga tu cuenta de ahorros.',
        'Usa la regla del 72 para calcular en cuántos años se duplicaría tu ahorro a la tasa que te ofrecen.',
        'Mira la tasa de tu tarjeta de crédito o de tu crédito y anota si es mensual o efectiva anual.',
      ],
      pregunta: '¿Qué plata tengo quieta perdiendo valor, y qué deuda está creciendo más rápido de lo que creo?',
      nota: 'El ejemplo de los dos amigos depende de la tasa: con tasas altas y muchos años, el que empieza temprano gana con poca plata; con tasas bajas, la diferencia es menor. La lección se mantiene: el tiempo multiplica, y empezar antes ayuda mucho. Se atribuye a Einstein la frase "el interés compuesto es la fuerza más poderosa del universo", pero no hay registro de que la haya dicho.',
      recordar: [
        ['¿Qué es la inflación?', 'El aumento general de los precios, que hace que la plata quieta pierda poder de compra.'],
        ['¿Qué es la rentabilidad real?', 'Lo que ganas por encima de la inflación.'],
        ['¿Qué es la regla del 72?', 'Dividir 72 por la tasa anual para saber, aproximadamente, en cuántos años se duplica la plata.'],
        ['¿Qué es el sesgo de crecimiento exponencial?', 'Subestimar cómo crece algo con intereses compuestos, tanto ahorros como deudas.'],
      ],
      tarjetas: [
        ['Interés compuesto', 'Ganar intereses sobre los intereses. Lo más grande llega al final: empezar temprano pesa mucho.'],
        ['Regla del 72', '72 ÷ tasa anual = años para duplicar la plata (al 8 %, unos 9 años).'],
        ['Tasa mensual vs. efectiva anual', '2,5 % mensual no es 30 % anual: compuesto da cerca del 34 % efectivo anual.'],
      ],
    }),
  ],
};

const DEUDAS = {
  titulo: 'Deudas y crédito',
  objetivo: 'Entender cuánto te cuesta de verdad una deuda, usar la tarjeta de crédito sin que te use a ti, salir de deudas con un método y cuidar tu historial en las centrales de riesgo.',
  fuentes: [
    ['Presidencia de la República de Colombia (1971). Decreto 410 de 1971 (Código de Comercio), artículo 884.', 'La tasa de usura: 1,5 veces el interés bancario corriente que certifica la Superfinanciera.'],
    ['Congreso de Colombia (2000). Ley 599 de 2000 (Código Penal), artículo 305.', 'Cobrar intereses por encima de la usura es delito.'],
    ['Gal, D. y McShane, B. B. (2012). Can small victories help win the war? Evidence from consumer debt management. Journal of Marketing Research, 49(4), 487-501.', 'Cerrar deudas pequeñas primero motiva a seguir pagando.'],
    ['Kettle, K. L., Trudel, R., Blouin, S. J. y Häubl, G. (2016). Repayment concentration and consumer motivation to get out of debt. Journal of Consumer Research, 43(3), 460-477.', 'Concentrar los pagos en una deuda aumenta la motivación.'],
    ['Congreso de Colombia (2008). Ley 1266 de 2008 (habeas data financiero).', 'Tus derechos sobre la información en las centrales de riesgo.'],
    ['Congreso de Colombia (2021). Ley 2157 de 2021 ("borrón y cuenta nueva").', 'Cuánto tiempo puede quedar un reporte negativo después de pagar.'],
    ['Congreso de Colombia (2012). Ley 1564 de 2012, Código General del Proceso (insolvencia de persona natural no comerciante).', 'El proceso legal para renegociar deudas cuando no puedes pagar.'],
    ['Mullainathan, S. y Shafir, E. (2013). Scarcity: Why having too little means so much. Times Books. (En español: Escasez).', 'Cómo la falta de plata ocupa la mente y lleva a malas decisiones.'],
    ['Mani, A., Mullainathan, S., Shafir, E. y Zhao, J. (2013). Poverty impedes cognitive function. Science, 341(6149), 976-980.', 'Las preocupaciones de plata reducen la capacidad mental disponible.'],
  ],
  lecciones: [
    l('Cómo funciona una deuda', 11, {
      idea: 'Una deuda no se mide por la cuota, sino por cuánto terminas pagando en total. Aprende a leer la tasa efectiva anual, a reconocer la usura y a usar la tarjeta de crédito sin pagar intereses.',
      bloques: [
        ['Lo que de verdad cuesta', [
          'Pregunta siempre la tasa efectiva anual (EA): es la que permite comparar créditos. La tasa mensual engaña porque parece pequeña.',
          'Suma todo: intereses, seguros, cuota de manejo, comisiones y estudio de crédito. Eso es el costo total.',
          'Multiplica la cuota por el número de cuotas y compáralo con lo que te prestaron: la diferencia es lo que pagas por el préstamo.',
          'Una cuota baja a muchos meses casi siempre significa pagar mucho más en total.',
        ]],
        ['La tasa de usura', [
          'Cada mes, la Superintendencia Financiera certifica el interés bancario corriente; la tasa de usura es 1,5 veces ese valor.',
          'Cobrar por encima de la usura es un delito en Colombia. Ninguna entidad legal puede hacerlo.',
          'El "gota a gota" suele cobrar intereses muy por encima de la usura, con cobros diarios y amenazas. Es ilegal y peligroso: no es una opción, por urgente que sea.',
        ]],
        ['La tarjeta de crédito', [
          'Si pagas el total de lo que debes antes de la fecha límite, normalmente no pagas intereses por las compras: la tarjeta se vuelve un medio de pago.',
          'Diferir a una sola cuota suele no generar intereses; diferir a varias, sí. Pregunta en tu banco cómo funciona tu tarjeta.',
          'Los avances en efectivo cobran intereses desde el primer día y suelen ser de lo más caro.',
          'Pagar solo el mínimo hace que la deuda dure años. En la app, vincula tu tarjeta en 💳 Deudas para ver el saldo real.',
        ]],
      ],
      ejemplos: [
        'Te ofrecen un televisor de 2 millones "en cómodas cuotas de 120.000". Son 24 cuotas: 2.880.000 pesos. Pagas 880.000 más, un 44 % más que de contado. Con esa información decides ahorrar 4 meses y comprarlo de contado, o uno más barato.',
        'Usas la tarjeta para el mercado de 600.000 y lo difieres a 12 cuotas por costumbre. Terminas pagando intereses sobre comida que ya te comiste. Si lo difieres a 1 cuota y lo pagas completo, el costo es cero.',
      ],
      practica: [
        'Para cada deuda que tienes, escribe la tasa efectiva anual, la cuota, cuántas cuotas faltan y el total que vas a pagar.',
        'Revisa en el extracto de tu tarjeta de crédito si estás pagando intereses y por qué compras.',
        'Busca la tasa de usura vigente en la página de la Superintendencia Financiera y compárala con tus créditos.',
      ],
      pregunta: '¿Qué deuda tengo cuyo costo total nunca he calculado?',
      nota: 'No todas las deudas son malas: un crédito de vivienda razonable o uno para estudiar algo con buena salida laboral pueden ser buenas decisiones. El problema son las deudas caras para consumo (tarjeta, libranzas largas, créditos de almacén) y las que no puedes pagar. Si estás en riesgo de no pagar, habla con el banco antes de atrasarte: suele haber opciones de reestructuración. Las condiciones de cada tarjeta cambian según el banco; revisa tu contrato.',
      recordar: [
        ['¿Qué tasa permite comparar créditos?', 'La tasa efectiva anual (EA).'],
        ['¿Cómo se calcula lo que pagas por un préstamo?', 'Multiplicando la cuota por el número de cuotas y restando lo que te prestaron (más seguros y comisiones).'],
        ['¿Qué es la tasa de usura?', '1,5 veces el interés bancario corriente que certifica la Superfinanciera cada mes; cobrar más es delito.'],
        ['¿Cómo usar la tarjeta de crédito sin pagar intereses?', 'Pagando el total antes de la fecha límite y evitando diferir a varias cuotas y los avances.'],
      ],
      tarjetas: [
        ['Costo total de una deuda', 'Cuota × número de cuotas + seguros y comisiones. Una cuota baja a muchos meses casi siempre sale más cara.'],
        ['Tasa de usura', '1,5 veces el interés bancario corriente. Por encima es delito. El gota a gota es ilegal y peligroso.'],
        ['Tarjeta sin intereses', 'Paga el total antes de la fecha límite. Avances y diferir a muchas cuotas cuestan caro.'],
      ],
    }),
    l('Salir de deudas', 11, {
      idea: 'Para salir de deudas necesitas dos cosas: dejar de sumar deuda nueva y un método para pagar las que tienes. El mejor método es el que te mantiene motivado hasta el final.',
      bloques: [
        ['Primero, frenar', [
          'Haz una lista de todas tus deudas: a quién, cuánto debes, tasa efectiva anual, cuota y cuántas cuotas faltan.',
          'Deja de usar la tarjeta de crédito para gastos del día a día hasta que la controles.',
          'Revisa tu presupuesto para liberar plata extra cada mes, aunque sea poca: esa es tu "plata de ataque".',
        ]],
        ['Dos métodos', [
          'Avalancha: pagas el mínimo en todas y pones la plata extra en la deuda con la tasa más alta. Matemáticamente es la que menos intereses te cobra.',
          'Bola de nieve: pagas el mínimo en todas y pones la plata extra en la deuda más pequeña, sin importar la tasa. Cuando la cierras, esa cuota se suma a la siguiente.',
          'Gal y McShane (2012) encontraron que cerrar deudas pequeñas se asociaba con salir de toda la deuda, más que el monto pagado.',
          'Kettle y otros (2016) vieron que concentrar los pagos en una sola deuda aumentaba la motivación para seguir.',
          'Si las tasas son parecidas, la bola de nieve puede ayudarte a no abandonar. Si una deuda es mucho más cara (tarjeta, gota a gota), empieza por esa.',
        ]],
        ['Cuando no alcanza', [
          'Habla con el banco antes de atrasarte: puedes pedir reestructurar (más plazo, otra cuota) o consolidar deudas en una con tasa más baja. Calcula el costo total antes de aceptar.',
          'Desconfía de empresas que cobran por "limpiarte" de las centrales de riesgo o por negociar por ti.',
          'Si de verdad no puedes pagar, la ley colombiana tiene el proceso de insolvencia de persona natural no comerciante (Código General del Proceso), que se tramita en centros de conciliación o notarías. Consulta un consultorio jurídico de universidad, que suele ser gratuito.',
        ]],
      ],
      ejemplos: [
        'Debes 400.000 en un crédito de almacén, 1,5 millones en la tarjeta y 6 millones en un crédito de libre inversión. Con 300.000 extra al mes, usas la bola de nieve: cierras el crédito de almacén en dos meses, y esa cuota más los 300.000 van a la tarjeta. Ver deudas cerradas te mantiene motivado.',
        'Te atrasaste dos meses con la tarjeta porque te bajaron las horas en el trabajo. En lugar de esconderte de las llamadas, vas al banco y pides reestructurar la deuda. Te dan una cuota más baja a más plazo mientras te recuperas.',
      ],
      practica: [
        'Haz la lista completa de tus deudas con saldo, tasa, cuota y cuotas que faltan (puedes usar 💳 Deudas en la app).',
        'Calcula cuánta plata extra puedes poner cada mes y escoge un método: avalancha o bola de nieve.',
        'Prueba el simulador de la app ("¿Y si pagas más cada mes?") para ver cuánto te ahorras en intereses.',
      ],
      pregunta: '¿Qué deuda me quita más tranquilidad, y cuál es mi plan concreto para cerrarla?',
      nota: 'El debate avalancha frente a bola de nieve no tiene un ganador único: la avalancha ahorra más intereses en teoría, pero en la práctica la mejor es la que sigues hasta el final, y algunos estudios muestran que las victorias pequeñas ayudan a no abandonar. Si las deudas te quitan el sueño o te generan angustia fuerte, habla también con alguien: la preocupación financiera afecta la salud.',
      recordar: [
        ['¿Qué es el método avalancha?', 'Poner la plata extra en la deuda con la tasa más alta, pagando el mínimo en las demás.'],
        ['¿Qué es el método bola de nieve?', 'Poner la plata extra en la deuda más pequeña; al cerrarla, esa cuota se suma a la siguiente.'],
        ['¿Qué encontraron Gal y McShane?', 'Que cerrar deudas pequeñas se asociaba con salir de toda la deuda.'],
        ['¿Qué hacer si no te alcanza para pagar?', 'Hablar con el banco antes de atrasarte para reestructurar, y si no hay forma, consultar la insolvencia de persona natural.'],
      ],
      tarjetas: [
        ['Avalancha vs. bola de nieve', 'Avalancha: la más cara primero (menos intereses). Bola de nieve: la más pequeña primero (más motivación).'],
        ['Primero, frenar', 'Lista completa de deudas, nada de deuda nueva y una "plata de ataque" cada mes.'],
        ['Si no alcanza', 'Habla con el banco antes de atrasarte. Último recurso: insolvencia de persona natural (consultorio jurídico gratuito).'],
      ],
    }),
    l('Tu historial en las centrales de riesgo', 10, {
      idea: 'Tu historial de crédito es tu reputación financiera: los bancos lo miran para decidir si te prestan y a qué tasa. Se construye pagando a tiempo, y tienes derechos sobre esa información.',
      bloques: [
        ['Qué son las centrales de riesgo', [
          'En Colombia, empresas como Datacrédito (Experian) y TransUnion guardan tu comportamiento de pago: créditos, tarjetas, celulares a plan y algunos servicios.',
          'Estar "reportado" no es malo en sí: un historial de pagos al día es positivo. Lo negativo es estar reportado en mora.',
          'No tener historial también dificulta conseguir crédito: los bancos no tienen cómo saber si pagas.',
        ]],
        ['Tus derechos', [
          'La Ley 1266 de 2008 (habeas data financiero) te da derecho a consultar gratis tu historial, a que te avisen antes de reportarte en mora y a corregir información errada.',
          'La Ley 2157 de 2021 ("borrón y cuenta nueva") limitó cuánto tiempo puede permanecer un reporte negativo después de pagar: depende de cuánto duró la mora, con un tope.',
          'Si hay un error, reclama primero a la entidad que te reportó y luego a la central; si no responden, a la Superintendencia de Industria y Comercio.',
        ]],
        ['Cómo construir un buen historial', [
          'Paga siempre a tiempo, aunque sea el mínimo: el atraso es lo que más pesa.',
          'Si no tienes historial, una tarjeta con cupo bajo que pagues completa cada mes ayuda a construirlo.',
          'No uses todo el cupo de tus tarjetas: usar casi todo lo disponible puede verse como riesgo.',
          'Programa los pagos automáticos o pon recordatorios en 🔔 Recordatorios.',
        ]],
        ['La escasez ocupa la mente', [
          'Mullainathan y Shafir (2013) describen cómo la falta de plata ocupa la mente: la preocupación constante deja menos atención para planear y decidir bien.',
          'Por eso, cuando estás apretado, es más fácil caer en decisiones caras (el gota a gota, el avance de la tarjeta).',
          'Un colchón de ahorro y un plan escrito liberan esa "ancho de banda" mental.',
        ]],
      ],
      ejemplos: [
        'Un almacén te reportó por una deuda que ya habías pagado. Consultas gratis tu historial, reclamas por escrito a la entidad con el comprobante de pago y, como no responden, pones la queja ante la Superintendencia de Industria y Comercio.',
        'Tienes 23 años y nunca has tenido crédito. Para cuando quieras pedir un crédito de vivienda, sacas una tarjeta con cupo bajo, la usas para la gasolina y la pagas completa cada mes. En un par de años tienes historial positivo.',
      ],
      practica: [
        'Consulta gratis tu historial en Datacrédito o TransUnion (en sus páginas o apps) y revisa que todo esté bien.',
        'Pon recordatorios o pagos automáticos para todas tus obligaciones.',
        'Si encuentras un error, escribe el reclamo a la entidad que te reportó con tus comprobantes.',
      ],
      pregunta: '¿Cómo está mi historial de crédito, y cuándo fue la última vez que lo revisé?',
      nota: 'El estudio de Mani y otros (2013) mostró que pensar en problemas de plata bajaba el desempeño mental de personas con poca plata; algunas réplicas posteriores, en otros contextos, encontraron efectos más pequeños o nulos, así que el tamaño del efecto se discute. La idea general (la escasez ocupa la mente) tiene apoyo en varios estudios. Los tiempos exactos de permanencia de reportes los fija la ley; consulta la norma vigente o pregunta a la central.',
      recordar: [
        ['¿Qué guardan las centrales de riesgo?', 'Tu comportamiento de pago de créditos, tarjetas, celulares a plan y algunos servicios.'],
        ['¿Qué derechos te da la Ley 1266 de 2008?', 'Consultar gratis tu historial, que te avisen antes de reportarte y corregir información errada.'],
        ['¿Qué hizo la Ley 2157 de 2021?', 'Limitó cuánto tiempo puede permanecer un reporte negativo después de pagar.'],
        ['¿Qué describen Mullainathan y Shafir sobre la escasez?', 'Que la preocupación por la falta de plata ocupa la mente y deja menos atención para decidir bien.'],
      ],
      tarjetas: [
        ['Centrales de riesgo', 'Guardan cómo pagas. Estar reportado al día es bueno; lo malo es la mora. No tener historial también dificulta el crédito.'],
        ['Tus derechos (Ley 1266)', 'Consulta gratis, aviso antes del reporte negativo y corrección de errores. Si no responden: Superintendencia de Industria y Comercio.'],
        ['Escasez (Mullainathan y Shafir)', 'La preocupación por la plata ocupa la mente. Un colchón y un plan escrito la liberan.'],
      ],
    }),
  ],
};

const INVERTIR = {
  titulo: 'Invertir',
  objetivo: 'Entender la relación entre riesgo, rentabilidad y plazo, saber por qué diversificar y por qué casi nadie le gana al mercado de forma constante, y reconocer las estafas antes de caer.',
  fuentes: [
    ['Markowitz, H. (1952). Portfolio selection. Journal of Finance, 7(1), 77-91.', 'La base de la diversificación.'],
    ['Malkiel, B. G. (1973). A Random Walk Down Wall Street. W. W. Norton. (En español: Un paseo aleatorio por Wall Street).', 'Por qué es tan difícil predecir el mercado.'],
    ['Bogle, J. C. (2007). The Little Book of Common Sense Investing. Wiley. (En español: El pequeño libro para invertir con sentido común).', 'Los fondos indexados de bajo costo.'],
    ['Barber, B. M. y Odean, T. (2000). Trading is hazardous to your wealth: The common stock investment performance of individual investors. Journal of Finance, 55(2), 773-806.', 'Quienes más compran y venden acciones, menos ganan.'],
    ['Fama, E. F. y French, K. R. (2010). Luck versus skill in the cross-section of mutual fund returns. Journal of Finance, 65(5), 1915-1947.', 'Muy pocos fondos le ganan al mercado después de costos, y es difícil distinguir habilidad de suerte.'],
    ['Frankel, T. (2012). The Ponzi Scheme Puzzle: A history and analysis of con artists and victims. Oxford University Press.', 'Cómo funcionan los esquemas Ponzi y por qué la gente cae.'],
    ['Lea, S., Fischer, P. y Evans, K. (2009). The Psychology of Scams: Provoking and committing errors of judgement. Office of Fair Trading (Reino Unido).', 'Los errores de juicio que explotan las estafas.'],
  ],
  lecciones: [
    l('Riesgo, rentabilidad y diversificación', 11, {
      idea: 'No existe inversión con alta rentabilidad y sin riesgo. Cuanto más puedes ganar, más puedes perder. El plazo y la diversificación son tus mejores herramientas para manejar ese riesgo.',
      bloques: [
        ['La regla de oro', [
          'Rentabilidad y riesgo van juntos: si te prometen mucha ganancia sin riesgo, desconfía.',
          'Liquidez: qué tan rápido puedes sacar la plata sin perder. Un CDT a un año no lo puedes sacar antes sin costo; una cuenta de ahorros sí.',
          'Plazo: plata que vas a necesitar pronto no debe estar en inversiones que suben y bajan mucho.',
        ]],
        ['Opciones comunes en Colombia', [
          'Cuenta de ahorros: muy líquida, casi sin riesgo, rentabilidad baja.',
          'CDT: plazo fijo, tasa conocida, protegido por Fogafín en entidades inscritas (hasta un monto); buena opción para plata que no necesitas en meses.',
          'Fondos de inversión colectiva: juntan la plata de muchos y la invierten; los hay de bajo riesgo (para el corto plazo) y de mayor riesgo. No están garantizados.',
          'Acciones y fondos de acciones: pueden subir mucho a largo plazo, pero también caer fuerte en un año. Para plata de 5 años o más.',
          'TES (bonos del Gobierno): prestarle plata al Estado; su precio cambia si suben o bajan las tasas.',
        ]],
        ['Diversificar', [
          'Harry Markowitz (1952) mostró que combinar inversiones que no se mueven igual reduce el riesgo total sin sacrificar tanto la rentabilidad.',
          'En palabras simples: no pongas todos los huevos en la misma canasta.',
          'Diversificar es repartir entre tipos de inversión, empresas, sectores y países, no tener cinco cuentas en el mismo banco.',
          'Ninguna diversificación te protege de una estafa: si la "inversión" es falsa, se pierde todo.',
        ]],
      ],
      ejemplos: [
        'Tienes 10 millones: 4 son tu fondo de emergencia, 3 son para la cuota inicial de una moto en un año y 3 no los necesitas en 10 años. El fondo va a cuenta de ahorros o CDT corto; lo de la moto, a un CDT a un año; lo de largo plazo puede ir a un fondo diversificado que acepte subidas y bajadas.',
        'Un compañero metió toda su plata en acciones de una sola empresa porque "le iba muy bien". La empresa tuvo problemas y la acción cayó a la mitad. Si hubiera diversificado, la caída habría pesado mucho menos.',
      ],
      practica: [
        'Separa tu plata por plazo: lo que necesitas en menos de 1 año, de 1 a 5 años y más de 5 años.',
        'Escribe qué tipo de inversión le corresponde a cada plazo según su riesgo y liquidez.',
        'Revisa si toda tu plata está en un solo lugar o en una sola inversión.',
      ],
      pregunta: '¿Tengo plata que voy a necesitar pronto en algo que puede caer, o plata de largo plazo quieta perdiendo contra la inflación?',
      nota: 'Esto es educación general, no una recomendación personal de inversión: lo adecuado para ti depende de tus metas, tu plazo, tu tolerancia al riesgo y tu situación. Antes de invertir en algo, verifica que la entidad esté vigilada por la Superintendencia Financiera, y si vas a mover sumas grandes, busca un asesor independiente (que no gane comisión por venderte productos).',
      recordar: [
        ['¿Cuál es la regla de oro de las inversiones?', 'Rentabilidad y riesgo van juntos: más ganancia posible significa más pérdida posible.'],
        ['¿Qué es la liquidez?', 'Qué tan rápido puedes sacar la plata sin perder.'],
        ['¿Qué mostró Markowitz sobre diversificar?', 'Que combinar inversiones que no se mueven igual reduce el riesgo total.'],
        ['¿Qué inversión conviene para plata que vas a necesitar en menos de un año?', 'Algo líquido y de bajo riesgo: cuenta de ahorros o CDT corto.'],
      ],
      tarjetas: [
        ['Riesgo y rentabilidad', 'Van juntos. Mucha ganancia "sin riesgo" es señal de alerta.'],
        ['Plazo primero', 'Plata de menos de 1 año: sin riesgo. Plata de más de 5 años: puede aguantar subidas y bajadas.'],
        ['Diversificar (Markowitz, 1952)', 'Repartir entre inversiones que no se mueven igual reduce el riesgo total.'],
      ],
    }),
    l('Fondos que siguen al mercado: por qué casi nadie le gana', 10, {
      idea: 'Escoger las acciones "ganadoras" o el momento perfecto parece fácil y casi nadie lo logra de forma constante, ni siquiera los profesionales. Para el largo plazo, invertir barato y diversificado suele ganarle a intentar adivinar.',
      bloques: [
        ['Ganarle al mercado es muy difícil', [
          'Burton Malkiel (1973) popularizó la idea de que los precios de las acciones se mueven de forma muy difícil de predecir.',
          'Fama y French (2010) analizaron miles de fondos de Estados Unidos: después de costos, muy pocos le ganaron al mercado, y era difícil distinguir a los hábiles de los que tuvieron suerte.',
          'Los fondos que ganan un año muchas veces no repiten el siguiente.',
        ]],
        ['Los fondos indexados', [
          'John Bogle creó los fondos indexados: en vez de escoger acciones, compran todas las de un índice (por ejemplo, las principales empresas de un mercado).',
          'Su ventaja es que cobran muy poco y diversifican automáticamente.',
          'Los costos importan muchísimo a largo plazo: una comisión de 2 % anual frente a una de 0,2 %, con el interés compuesto, puede llevarse una parte grande de tu ganancia en 20 o 30 años.',
          'En Colombia hay fondos y ETF (fondos que se compran como una acción) que siguen índices locales e internacionales; revisa siempre sus comisiones.',
        ]],
        ['El enemigo eres tú', [
          'Barber y Odean (2000) estudiaron miles de cuentas de inversionistas: quienes más compraban y vendían acciones obtenían menos rentabilidad, por los costos y por equivocarse en el momento.',
          'Vender por miedo cuando el mercado cae y comprar por emoción cuando sube es la forma más común de perder.',
          'Lo que funciona es aburrido: aportar con regularidad, mantener y no mirar todos los días.',
        ]],
      ],
      ejemplos: [
        'Un amigo te dice que ganó 30 % en un mes con una acción que le recomendaron en un grupo de Telegram. No te cuenta las que perdió. Tú prefieres aportar 200.000 cada mes a un fondo diversificado de bajo costo y dejarlo crecer.',
        'El mercado cae 20 % en un año y te dan ganas de sacar todo. Recuerdas que esa plata es para dentro de 15 años y que vender ahora sería convertir una baja temporal en una pérdida real. Sigues aportando.',
      ],
      practica: [
        'Si tienes alguna inversión, busca cuánto te cobra de comisión anual (la "comisión de administración").',
        'Escribe qué harías si tu inversión de largo plazo cae 20 % en un año, antes de que pase.',
        'Lee el reglamento o la ficha técnica de un fondo de inversión: qué invierte, cuánto cobra y qué riesgo tiene.',
      ],
      pregunta: '¿He tomado decisiones de inversión por emoción, por un dato de un conocido o por miedo a quedarme por fuera?',
      nota: 'La mayoría de los estudios sobre fondos que no le ganan al mercado son de Estados Unidos, que es un mercado muy grande y eficiente; en mercados pequeños como el colombiano la evidencia es menor, aunque los costos siguen pesando igual. Y "siempre sube a largo plazo" no es una garantía: hay mercados que han tardado muchos años en recuperarse. Diversificar entre países ayuda. Cripto: es muy volátil y especulativa; si inviertes, que sea solo lo que puedes perder por completo.',
      recordar: [
        ['¿Qué encontraron Fama y French sobre los fondos?', 'Que después de costos muy pocos le ganan al mercado y es difícil distinguir habilidad de suerte.'],
        ['¿Qué es un fondo indexado?', 'Un fondo que compra todas las acciones de un índice en vez de escogerlas, con costos bajos.'],
        ['¿Por qué importan tanto las comisiones?', 'Porque, con el interés compuesto, una comisión alta se lleva una parte grande de la ganancia a largo plazo.'],
        ['¿Qué encontraron Barber y Odean?', 'Que quienes más compraban y vendían acciones obtenían menos rentabilidad.'],
      ],
      tarjetas: [
        ['Ganarle al mercado', 'Muy pocos lo logran de forma constante, ni los profesionales (Fama y French, 2010).'],
        ['Fondos indexados (Bogle)', 'Compran todo el índice, diversifican solos y cobran poco. Las comisiones pesan muchísimo a largo plazo.'],
        ['El enemigo eres tú (Barber y Odean)', 'Comprar y vender mucho, o vender por miedo en las caídas, es la forma más común de perder.'],
      ],
    }),
    l('Estafas y "negocios" milagrosos', 11, {
      idea: 'Las estafas financieras no caen solo en gente ingenua: están diseñadas para engañar a cualquiera. Todas tienen señales parecidas. Si conoces las señales, te puedes proteger tú y a tu familia.',
      bloques: [
        ['Cómo funcionan', [
          'Un esquema Ponzi paga "rendimientos" a los primeros con la plata de los que entran después. Funciona mientras entre gente nueva; cuando deja de entrar, colapsa (Frankel, 2012).',
          'Una pirámide gana por reclutar personas, no por vender algo real.',
          'En Colombia hubo casos enormes: en 2008, captadoras ilegales como DMG y DRFE se llevaron los ahorros de cientos de miles de personas.',
          'Hoy aparecen como "inversiones en cripto", "trading con robots", "cadenas de regalos" o "negocios" de redes sociales.',
        ]],
        ['Las señales de alerta', [
          'Rendimientos altos, fijos y garantizados ("10 % mensual", "duplica tu plata").',
          'Presión para decidir ya ("los cupos se acaban").',
          'Ganas por traer a más gente.',
          'No puedes explicar con claridad de dónde sale la ganancia.',
          'La entidad no está vigilada por la Superintendencia Financiera, o te piden consignar a una persona.',
          'Testimonios de "gente como tú" que se volvió rica, carros y viajes en redes sociales.',
        ]],
        ['Por qué caemos', [
          'Un informe de Lea, Fischer y Evans (2009) para el gobierno británico encontró que las estafas explotan errores de juicio comunes: confiar en alguien conocido, la urgencia, la promesa de una gran recompensa y la vergüenza de admitir el engaño.',
          'Muchas entran por personas de confianza: familiares, amigos, la iglesia, compañeros de trabajo, que a veces también son víctimas.',
          'La vergüenza hace que la gente meta más plata para "recuperar" o no denuncie.',
        ]],
      ],
      ejemplos: [
        'Tu prima te invita a un grupo de WhatsApp donde "un experto en trading" paga 8 % semanal. Te muestra pantallazos de sus ganancias. Revisas: no está vigilado por la Superfinanciera, la ganancia es fija y altísima, y te piden traer a dos personas para subir de nivel. Es una estafa, por bien que le esté yendo a ella hoy.',
        'Te llaman diciendo que eres del banco y que hay un movimiento raro; te piden la clave o el código que llegó a tu celular "para bloquear la tarjeta". Cuelgas y llamas tú al número que aparece en la tarjeta. Ningún banco pide claves por teléfono.',
      ],
      practica: [
        'Antes de cualquier inversión, verifica en la página de la Superintendencia Financiera si la entidad está vigilada.',
        'Escribe las señales de alerta y compártelas con tu familia, sobre todo con las personas mayores.',
        'Acuerda una regla personal: "Nunca invierto en algo que no puedo explicar ni en algo que me piden decidir hoy".',
      ],
      pregunta: '¿Qué "negocio" me han ofrecido que tenía varias de estas señales, y qué hice?',
      nota: 'Se dice que "a mí no me pasa, yo soy muy vivo". Las investigaciones sobre estafas muestran que caen personas de todos los niveles de educación e ingresos, porque las estafas aprovechan emociones y la confianza, no la falta de inteligencia. Si caíste, no es motivo de vergüenza: denuncia ante la Fiscalía y avisa a la Superintendencia Financiera, y nunca pagues a quien prometa "recuperar" tu plata a cambio de una comisión, porque suele ser una segunda estafa.',
      recordar: [
        ['¿Cómo funciona un esquema Ponzi?', 'Paga "rendimientos" a los primeros con la plata de los que entran después, hasta que deja de entrar gente y colapsa.'],
        ['Nombra cuatro señales de alerta de una estafa.', 'Rendimientos altos y garantizados, presión para decidir, ganar por reclutar, no saber de dónde sale la ganancia, entidad no vigilada.'],
        ['¿Qué errores de juicio explotan las estafas según Lea, Fischer y Evans?', 'Confiar en alguien conocido, la urgencia, la promesa de una gran recompensa y la vergüenza de admitir el engaño.'],
        ['¿Qué hacer si te llaman "del banco" pidiendo claves?', 'Colgar y llamar tú al número oficial; ningún banco pide claves por teléfono.'],
      ],
      tarjetas: [
        ['Esquema Ponzi', 'Paga a los primeros con la plata de los nuevos. Colapsa cuando deja de entrar gente (DMG, 2008).'],
        ['Señales de estafa', 'Ganancia alta y garantizada, prisa, reclutar, no se entiende el negocio, entidad no vigilada.'],
        ['Verificar antes de invertir', 'Consulta en la Superintendencia Financiera si la entidad está vigilada. Ningún banco pide claves por teléfono.'],
      ],
    }),
  ],
};

const LARGO_PLAZO = {
  titulo: 'El largo plazo',
  objetivo: 'Entender cómo funcionan la pensión y las cesantías en Colombia, cumplir con los impuestos, pensar la decisión de comprar o arrendar vivienda, y armar un plan financiero que use la plata para vivir mejor.',
  fuentes: [
    ['Congreso de Colombia (1993). Ley 100 de 1993 (Sistema de Seguridad Social Integral).', 'Creó los regímenes de pensión público y de ahorro individual.'],
    ['Congreso de Colombia (2024). Ley 2381 de 2024 (reforma pensional).', 'Reorganizó el sistema de pensiones por pilares.'],
    ['Benartzi, S. y Thaler, R. H. (2007). Heuristics and biases in retirement savings behavior. Journal of Economic Perspectives, 21(3), 81-104.', 'Los atajos mentales que nos hacen ahorrar poco para la vejez.'],
    ['Hershfield, H. E. et al. (2011). Increasing saving behavior through age-progressed renderings of the future self. Journal of Marketing Research, 48(SPL), S23-S37.', 'Ver tu cara envejecida aumentó lo que la gente ahorraba para el retiro.'],
    ['Presidencia de la República de Colombia (1989). Decreto 624 de 1989 (Estatuto Tributario).', 'Las normas del impuesto de renta.'],
    ['Kahneman, D. y Deaton, A. (2010). High income improves evaluation of life but not emotional well-being. Proceedings of the National Academy of Sciences, 107(38), 16489-16493.', 'La relación entre ingresos y bienestar.'],
    ['Killingsworth, M. A., Kahneman, D. y Mellers, B. (2023). Income and emotional well-being: A conflict resolved. Proceedings of the National Academy of Sciences, 120(10), e2208661120.', 'Más ingreso se asocia con más bienestar para la mayoría, con matices.'],
    ['Dunn, E. W., Gilbert, D. T. y Wilson, T. D. (2011). If money doesn’t make you happy, then you probably aren’t spending it right. Journal of Consumer Psychology, 21(2), 115-125.', 'Cómo gastar la plata para que aporte más bienestar.'],
    ['Van Boven, L. y Gilovich, T. (2003). To do or to have? That is the question. Journal of Personality and Social Psychology, 85(6), 1193-1202.', 'Las experiencias suelen dar más satisfacción que las cosas.'],
  ],
  lecciones: [
    l('Pensión y cesantías', 11, {
      idea: 'La pensión es la plata de tu yo de 65 años, y las cesantías son un colchón que tu empleador te consigna cada año. Entender cómo funcionan te ayuda a no perder semanas, a no gastarlas mal y a planear tu vejez.',
      bloques: [
        ['El sistema de pensiones', [
          'La Ley 100 de 1993 creó dos regímenes: el público (Colpensiones), donde la pensión depende de semanas cotizadas y del salario, y el de ahorro individual (fondos privados), donde depende de lo que se acumula en tu cuenta.',
          'La reforma pensional (Ley 2381 de 2024) reorganizó el sistema por pilares; su implementación ha tenido trámites y ajustes. Consulta la situación vigente en Colpensiones o en tu fondo.',
          'Revisa con regularidad tu historia laboral (semanas cotizadas) en la página de tu fondo o de Colpensiones: si un empleador no pagó, se puede reclamar.',
          'Antes de trasladarte de régimen, pide la asesoría que exige la ley y que debe ser gratuita. Es una decisión difícil de reversar.',
        ]],
        ['Las cesantías', [
          'Si tienes contrato laboral, tu empleador debe consignar cada año en un fondo de cesantías el equivalente a un mes de salario por año trabajado, a más tardar el 14 de febrero, y pagarte directamente los intereses sobre cesantías.',
          'Están pensadas como un colchón para cuando quedes sin trabajo. También se pueden retirar para vivienda (comprar, construir, pagar crédito) o educación.',
          'Gastarlas en consumo es perder ese colchón; úsalas para algo que mejore tu patrimonio o déjalas crecer.',
        ]],
        ['Por qué ahorramos poco para la vejez', [
          'Benartzi y Thaler (2007) describen los atajos que nos frenan: aplazar ("después empiezo"), la inercia y lo lejana que se siente la vejez.',
          'Hershfield y otros (2011) mostraron a personas fotos de su cara envejecida digitalmente: después, decidieron ahorrar más para el retiro.',
          'Si eres independiente, cotizar a pensión es obligatorio sobre tus ingresos; además, los aportes voluntarios pueden tener beneficios tributarios, según las reglas vigentes.',
        ]],
      ],
      ejemplos: [
        'Revisas tu historia laboral y descubres que hay 8 meses de 2019 sin cotizaciones, aunque trabajaste. Ese empleador no pagó. Reclamas ante el fondo con tus desprendibles de nómina para que cobren esos aportes.',
        'En febrero te llegan las cesantías y piensas en cambiar el celular. En cambio, las usas para abonar a capital del crédito de vivienda, lo que baja tus intereses por años.',
      ],
      practica: [
        'Entra a la página de tu fondo de pensiones o de Colpensiones y descarga tu historia laboral.',
        'Revisa en tu fondo de cesantías cuánto tienes y si tu empleador consignó el último año.',
        'Escribe qué te gustaría tener a los 65 años y cuánto crees que vas a necesitar al mes.',
      ],
      pregunta: '¿Qué estoy haciendo hoy por mi yo de 65 años?',
      nota: 'Las reglas de pensiones en Colombia han cambiado y pueden seguir cambiando; este curso explica la lógica general, no la norma exacta de hoy. Para decisiones como trasladarte de régimen o pensionarte, busca la asesoría oficial y gratuita de Colpensiones o de tu fondo, o un abogado laboral. Ten cuidado con "tramitadores" que cobran por gestiones que puedes hacer tú.',
      recordar: [
        ['¿Cuáles son los dos regímenes que creó la Ley 100?', 'El público (Colpensiones) y el de ahorro individual (fondos privados).'],
        ['¿Qué debe hacer tu empleador con las cesantías?', 'Consignar un mes de salario por año en un fondo de cesantías, a más tardar el 14 de febrero, y pagarte los intereses sobre cesantías.'],
        ['¿Para qué se pueden retirar las cesantías?', 'Cuando quedas sin trabajo, para vivienda o para educación.'],
        ['¿Qué mostraron Hershfield y otros con las fotos envejecidas?', 'Que ver tu cara envejecida aumentó lo que la gente decidía ahorrar para el retiro.'],
      ],
      tarjetas: [
        ['Historia laboral', 'Revísala con regularidad: si un empleador no pagó tus aportes de pensión, se puede reclamar.'],
        ['Cesantías', 'Un mes de salario por año, consignado a más tardar el 14 de febrero. Colchón para desempleo, vivienda o educación.'],
        ['Tu yo de 65 años', 'La vejez se siente lejana y por eso ahorramos poco. Imagínala en detalle (Hershfield).'],
      ],
    }),
    l('Impuestos y vivienda', 11, {
      idea: 'Declarar renta a tiempo te evita sanciones, y conocer las reglas puede ahorrarte plata legalmente. Comprar vivienda no siempre es mejor que arrendar: depende de los números y de tu vida.',
      bloques: [
        ['La declaración de renta', [
          'Las personas naturales deben declarar renta si superan ciertos topes de ingresos, patrimonio, compras, consumos con tarjeta o consignaciones del año anterior. Los topes se fijan en UVT (unidad de valor tributario) y cambian cada año: consulta los vigentes en la DIAN.',
          'Declarar no siempre significa pagar: muchas personas declaran y pagan poco o nada, gracias a deducciones y rentas exentas.',
          'Las fechas dependen de los últimos dígitos del NIT y suelen ir de agosto a octubre. Declarar tarde genera sanción.',
          'Guarda durante el año los certificados: de ingresos y retenciones, de intereses de vivienda, de medicina prepagada, de aportes voluntarios y de dependientes.',
        ]],
        ['El 4x1000 y otros cobros', [
          'El gravamen a los movimientos financieros (4x1000) cobra 4 pesos por cada 1.000 que sacas o transfieres.',
          'Puedes marcar una cuenta como exenta hasta un monto mensual: pídelo en tu banco y escoge la cuenta que más uses.',
          'Revisa también la cuota de manejo de tus cuentas y tarjetas: hay opciones sin costo.',
        ]],
        ['¿Comprar o arrendar?', [
          'Comprar te da estabilidad y un patrimonio, pero tiene costos que no se ven en la cuota: intereses del crédito, predial, administración, mantenimiento, escrituras y seguros.',
          'Arrendar te da flexibilidad para mudarte por trabajo, y la plata que no va a la cuota inicial puede invertirse.',
          'Compara el costo total de comprar (todos los gastos, no solo la cuota) con el arriendo de algo parecido más lo que podrías ganar invirtiendo la diferencia.',
          'Pregunta por subsidios y beneficios vigentes (cajas de compensación, programas del Gobierno para vivienda) y por el uso de cesantías para la cuota inicial.',
        ]],
      ],
      ejemplos: [
        'Nunca has declarado renta porque "no ganas tanto", pero el año pasado te consignaron en la cuenta la venta de una moto y te pasaste del tope de consignaciones. Revisas los topes en la DIAN, declaras a tiempo y, con tus deducciones, te sale un valor bajo a pagar. Evitaste una sanción.',
        'Pagas 1,5 millones de arriendo y te ofrecen un apartamento con cuota de 2 millones. Al sumar administración, predial, seguros y mantenimiento, comprar te cuesta cerca de 2,6 millones al mes. Decides seguir arrendando un año más mientras ahorras una cuota inicial más grande para bajar la cuota.',
      ],
      practica: [
        'Consulta en la página de la DIAN los topes vigentes para declarar renta y revisa si te aplican.',
        'Crea una carpeta (física o en el celular) para guardar durante el año los certificados que sirven para la declaración.',
        'Si estás pensando en comprar vivienda, haz una lista de todos los costos mensuales, no solo la cuota.',
      ],
      pregunta: '¿Tengo claro si debo declarar renta y qué documentos necesito?',
      nota: 'Se repite que "arrendar es botar la plata". No necesariamente: comprar también tiene costos que no recuperas (intereses, predial, mantenimiento), y en algunos casos arrendar e invertir la diferencia sale igual o mejor. Tampoco es cierto que la vivienda "nunca baja": su precio puede quedarse quieto o bajar en términos reales por años. Las normas tributarias cambian con frecuencia: para casos con negocios, varias fuentes de ingreso o patrimonio alto, consulta a un contador.',
      recordar: [
        ['¿Cuándo deben declarar renta las personas naturales?', 'Cuando superan ciertos topes de ingresos, patrimonio, compras, consumos o consignaciones, fijados en UVT y que cambian cada año.'],
        ['¿Declarar renta significa siempre pagar?', 'No: muchas personas declaran y pagan poco o nada por deducciones y rentas exentas.'],
        ['¿Cómo reducir el 4x1000?', 'Marcando una cuenta como exenta hasta el monto mensual permitido.'],
        ['¿Qué costos de comprar vivienda no se ven en la cuota?', 'Intereses, predial, administración, mantenimiento, escrituras y seguros.'],
      ],
      tarjetas: [
        ['Declaración de renta', 'Revisa cada año los topes en UVT en la DIAN. Declarar no siempre es pagar; declarar tarde sí trae sanción.'],
        ['4x1000', 'Marca una cuenta como exenta hasta el monto permitido y úsala para lo de todos los días.'],
        ['Comprar vs. arrendar', 'Compara el costo total de comprar (no solo la cuota) con el arriendo más lo que ganarías invirtiendo la diferencia.'],
      ],
    }),
    l('Plata, bienestar y tu plan financiero', 12, {
      idea: 'La plata no es el fin: es una herramienta para vivir con tranquilidad y hacer lo que te importa. Un plan financiero sencillo une todo el curso, y gastar bien también es parte de él.',
      bloques: [
        ['¿La plata da felicidad?', [
          'Kahneman y Deaton (2010) encontraron que más ingreso mejoraba la evaluación que la gente hacía de su vida, pero que el bienestar del día a día dejaba de subir a partir de cierto nivel.',
          'Estudios posteriores con más datos (Killingsworth, Kahneman y Mellers, 2023) mostraron que, para la mayoría, más ingreso sí se asocia con más bienestar diario, aunque para las personas menos felices el efecto se aplana.',
          'Lo que está claro: salir de la escasez y de las deudas cambia mucho la tranquilidad. Pasado cierto punto, cómo gastas pesa más que cuánto ganas.',
        ]],
        ['Gastar mejor', [
          'Dunn, Gilbert y Wilson (2011) resumen formas de gastar que aportan más bienestar.',
          'Comprar experiencias más que cosas: Van Boven y Gilovich (2003) encontraron que las experiencias (un viaje, un concierto, un curso) suelen dar más satisfacción duradera.',
          'Gastar en otros, comprar tiempo (pagar para delegar lo que odias hacer) y muchos placeres pequeños en vez de uno grande.',
          'Esperar antes de comprar también ayuda: la regla de las 72 horas (⏳ en la app) te deja pensar si de verdad lo quieres.',
        ]],
        ['Tu plan financiero en una página', [
          '1. Presupuesto: cuánto entra y a dónde va (regla 50/30/20 como guía).',
          '2. Fondo de emergencia: meta de 3 a 6 meses, con ahorro automático.',
          '3. Deudas: lista y método para salir de las caras.',
          '4. Metas con fecha: qué quieres lograr en 1, 5 y 20 años, y cuánto ahorrar al mes para cada una.',
          '5. Inversión de largo plazo: diversificada y barata, con la plata que no necesitas pronto.',
          '6. Protección y vejez: pensión al día, cesantías bien usadas, seguros que de verdad necesitas y declaración de renta.',
        ]],
        ['Cuándo buscar un profesional', [
          'Para decisiones grandes (pensión, vivienda, herencias, impuestos complejos, inversiones importantes), consulta a alguien que sepa.',
          'Prefiere asesores independientes, que cobren por la asesoría y no por venderte productos.',
          'Si la plata te causa angustia constante o hay apuestas o compras compulsivas de por medio, busca también apoyo psicológico.',
        ]],
      ],
      ejemplos: [
        'En vez de cambiar de celular cada año, decides usarlo tres años y destinar esa plata a un viaje con tu familia a la costa. Años después sigues recordando el viaje; del celular, no.',
        'Haces tu plan en una página: presupuesto con 20 % de ahorro, fondo de 6 millones en 18 meses, la tarjeta pagada en 8 meses con bola de nieve, meta de cuota inicial de vivienda en 5 años y un aporte mensual a un fondo diversificado. Lo pones en 🎯 Metas y 💰 Finanzas y lo revisas cada tres meses.',
      ],
      practica: [
        'Escribe tu plan financiero en una página con los seis puntos.',
        'Crea en 💰 Finanzas → 🐷 Ahorro una meta con fecha para lo más importante que quieres lograr.',
        'Revisa tus compras del último mes y marca cuáles te dieron bienestar de verdad y cuáles no.',
      ],
      pregunta: '¿Para qué quiero la plata, y mi forma de gastarla refleja eso?',
      nota: 'Se repite que "la felicidad se compra hasta 75.000 dólares al año" (Kahneman y Deaton, 2010). Esa cifra era de Estados Unidos, se refería solo al bienestar del día a día y estudios posteriores la matizaron. No hay un número mágico, y menos uno que aplique a Colombia. Recuerda que este curso es educación financiera general: no reemplaza la asesoría de un profesional para tu caso.',
      recordar: [
        ['¿Qué encontraron Kahneman y Deaton sobre ingreso y bienestar?', 'Que más ingreso mejoraba la evaluación de la vida, pero el bienestar diario dejaba de subir a partir de cierto nivel.'],
        ['¿Qué matizó el estudio de 2023 con Killingsworth?', 'Que para la mayoría, más ingreso sí se asocia con más bienestar diario, salvo para los menos felices.'],
        ['¿Qué tipo de compras suelen dar más satisfacción según Van Boven y Gilovich?', 'Las experiencias, más que las cosas.'],
        ['¿Cuáles son los seis puntos del plan financiero?', 'Presupuesto, fondo de emergencia, deudas, metas con fecha, inversión de largo plazo, y protección y vejez.'],
      ],
      tarjetas: [
        ['Plata y bienestar', 'Salir de la escasez cambia mucho la tranquilidad. Después, cómo gastas pesa tanto como cuánto ganas.'],
        ['Gastar mejor (Dunn, Gilbert y Wilson)', 'Experiencias más que cosas, gastar en otros, comprar tiempo y esperar antes de comprar.'],
        ['Plan financiero en una página', 'Presupuesto, emergencia, deudas, metas con fecha, inversión de largo plazo, protección y vejez.'],
      ],
    }),
  ],
};

export default {
  id: 'educacion-financiera',
  nombre: 'Educación financiera',
  area: 'mundo',
  icono: '💵',
  nivel: 'Básico',
  paraQue: 'Manejar tu plata con los pies en la tierra en Colombia: presupuesto, fondo de emergencia, deudas, inversión, pensión, cesantías e impuestos, y cómo no caer en estafas. Es educación general para tomar mejores decisiones y usar mejor 💰 Finanzas; no reemplaza la asesoría de un profesional para tu caso.',
  modulos: [BASES, DEUDAS, INVERTIR, LARGO_PLAZO],
  proyecto: {
    titulo: 'Tu chequeo financiero de un mes',
    intro: 'Durante 4 semanas vas a hacer una revisión completa de tu plata con la app y lo aprendido, y vas a terminar con un plan financiero en una página que puedas revisar cada tres meses.',
    pasos: [
      'Semana 1: registra todos tus gastos en 💰 Finanzas con su categoría y mira cómo te queda la regla 50/30/20.',
      'Calcula tu fondo de emergencia (3 a 6 meses de gastos necesarios) y programa una transferencia automática el día de pago.',
      'Semana 2: haz la lista completa de tus deudas en 💳 Deudas con tasa efectiva anual y costo total, y escoge un método para salir.',
      'Consulta gratis tu historial en una central de riesgo y revisa que no haya errores.',
      'Semana 3: separa tu plata por plazo (menos de 1 año, 1 a 5, más de 5) y revisa que cada parte esté en algo adecuado y vigilado por la Superfinanciera.',
      'Semana 4: descarga tu historia laboral de pensión, revisa tus cesantías y confirma si debes declarar renta este año.',
      'Escribe tu plan financiero en una página con los seis puntos y crea en la app una meta de ahorro con fecha.',
      'Pon un recordatorio en 🔔 Recordatorios para revisar el plan cada tres meses.',
    ],
  },
};
