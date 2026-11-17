// Retrato realista: dibujar una cara que se parezca, a lápiz, desde cero. Formato de src/cursos (ver aprender-a-aprender.js
// y /agregar-curso). Es el primer curso con figuras: cada lección puede traer `figuras` [{ titulo, vista, svg }], un SVG
// simple que Estudiar dibuja sobre papel con las clases linea, fina, guia, acento, rotulo, rotulo-acento y v1 a v5 (valores
// del más claro al más oscuro). Las proporciones de las figuras son las del canon clásico, que es un promedio: cada cara se mide.

const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });
const svg = (...partes) => partes.join('');

// ---------- Figuras ----------
const FIG_LOOMIS = {
  titulo: 'La cabeza de Loomis: una esfera con los lados cortados y la cara en tres partes iguales',
  vista: '0 0 300 230',
  svg: svg(
    '<line class="guia" x1="110" y1="18" x2="110" y2="212"/>',
    '<circle class="linea" cx="110" cy="90" r="58"/>',
    '<ellipse class="fina" cx="62" cy="90" rx="9" ry="38"/><ellipse class="fina" cx="158" cy="90" rx="9" ry="38"/>',
    '<path class="linea" d="M56 108 Q60 160 92 192 Q110 204 128 192 Q160 160 164 108"/>',
    '<line class="acento" x1="40" y1="35" x2="190" y2="35"/><line class="acento" x1="40" y1="90" x2="190" y2="90"/>',
    '<line class="acento" x1="40" y1="145" x2="190" y2="145"/><line class="acento" x1="40" y1="200" x2="190" y2="200"/>',
    '<text class="rotulo" x="195" y="38">Nacimiento del pelo</text><text class="rotulo" x="195" y="93">Cejas</text>',
    '<text class="rotulo" x="195" y="148">Base de la nariz</text><text class="rotulo" x="195" y="203">Mentón</text>',
    '<text class="rotulo-acento" x="14" y="66">1/3</text><text class="rotulo-acento" x="14" y="121">1/3</text><text class="rotulo-acento" x="14" y="176">1/3</text>',
  ),
};

const FIG_PROPORCIONES = {
  titulo: 'Proporciones de frente (promedio): los ojos van en la mitad de la cabeza y la cara mide cinco ojos de ancho',
  vista: '0 0 320 250',
  svg: svg(
    '<ellipse class="linea" cx="110" cy="115" rx="64" ry="92"/>',
    '<line class="guia" x1="110" y1="16" x2="110" y2="214"/>',
    '<line class="acento" x1="36" y1="23" x2="200" y2="23"/><line class="acento" x1="36" y1="115" x2="200" y2="115"/><line class="acento" x1="36" y1="207" x2="200" y2="207"/>',
    '<line class="guia" x1="40" y1="47" x2="200" y2="47"/><line class="guia" x1="40" y1="100" x2="200" y2="100"/>',
    '<line class="guia" x1="40" y1="153" x2="200" y2="153"/><line class="guia" x1="40" y1="170" x2="200" y2="170"/>',
    '<path class="linea" d="M72 115 Q84.5 106 97 115 Q84.5 121 72 115 Z"/><path class="linea" d="M123 115 Q135.5 106 148 115 Q135.5 121 123 115 Z"/>',
    '<circle class="v4" cx="84.5" cy="114" r="4"/><circle class="v4" cx="135.5" cy="114" r="4"/>',
    '<path class="fina" d="M70 101 Q84 94 98 100"/><path class="fina" d="M122 100 Q136 94 150 101"/>',
    '<path class="linea" d="M100 149 Q110 158 120 149"/><path class="fina" d="M97 146 Q94 152 100 153"/><path class="fina" d="M123 146 Q126 152 120 153"/>',
    '<path class="linea" d="M86 170 Q110 176 134 170"/>',
    '<path class="linea" d="M47 102 Q34 110 36 128 Q38 148 49 153"/><path class="linea" d="M173 102 Q186 110 184 128 Q182 148 171 153"/>',
    '<line class="acento" x1="97" y1="115" x2="97" y2="153"/><line class="acento" x1="123" y1="115" x2="123" y2="153"/>',
    '<line class="acento" x1="84.5" y1="118" x2="86" y2="170"/><line class="acento" x1="135.5" y1="118" x2="134" y2="170"/>',
    '<text class="rotulo" x="204" y="26">Coronilla</text><text class="rotulo" x="204" y="50">Nacimiento del pelo</text>',
    '<text class="rotulo" x="204" y="103">Cejas</text><text class="rotulo-acento" x="204" y="118">Ojos: mitad de la cabeza</text>',
    '<text class="rotulo" x="204" y="156">Base de la nariz</text><text class="rotulo" x="204" y="173">Boca</text><text class="rotulo" x="204" y="210">Mentón</text>',
    '<line class="fina" x1="46" y1="226" x2="174" y2="226"/>',
    '<line class="fina" x1="46" y1="222" x2="46" y2="230"/><line class="fina" x1="72" y1="222" x2="72" y2="230"/><line class="fina" x1="97" y1="222" x2="97" y2="230"/>',
    '<line class="fina" x1="123" y1="222" x2="123" y2="230"/><line class="fina" x1="148" y1="222" x2="148" y2="230"/><line class="fina" x1="174" y1="222" x2="174" y2="230"/>',
    '<text class="rotulo" x="62" y="244">De ancho, a la altura de los ojos: cinco ojos</text>',
  ),
};

const FIG_GIRO = {
  titulo: 'La cabeza girada (tres cuartos): la línea central y la de los ojos se curvan sobre la esfera',
  vista: '0 0 340 230',
  svg: svg(
    '<circle class="linea" cx="110" cy="92" r="55"/>',
    '<ellipse class="fina" cx="70" cy="98" rx="13" ry="36"/>',
    '<path class="acento" d="M136 38 Q160 96 140 150"/>',
    '<path class="linea" d="M60 118 Q74 180 136 200 Q156 196 160 150"/>',
    '<path class="acento" d="M58 100 Q108 116 163 96"/>',
    '<path class="guia" d="M60 140 Q108 156 162 138"/>',
    '<path class="fina" d="M66 86 Q60 100 64 118 Q70 124 76 116"/>',
    '<text class="rotulo-acento" x="186" y="60">Línea central: se curva</text>',
    '<text class="rotulo-acento" x="186" y="100">Línea de los ojos: se curva</text>',
    '<text class="rotulo" x="186" y="140">Base de la nariz</text>',
    '<text class="rotulo" x="186" y="180">Plano lateral (el óvalo): ahí va la oreja</text>',
    '',
  ),
};

const FIG_OJO = {
  titulo: 'El ojo es una esfera: los párpados la envuelven, tienen grosor y el de arriba tapa parte del iris',
  vista: '0 0 340 160',
  svg: svg(
    '<circle class="guia" cx="150" cy="85" r="48"/>',
    '<circle class="v3" cx="150" cy="84" r="21"/><circle class="v5" cx="150" cy="84" r="8"/>',
    '<path class="papel" d="M96 86 Q150 52 206 83 L206 22 L96 22 Z"/>',
    '<path class="papel" d="M98 88 Q150 114 204 85 L204 140 L98 140 Z"/>',
    '<circle class="papel" cx="158" cy="76" r="4"/>',
    '<circle class="guia" cx="150" cy="85" r="48"/><path class="linea" d="M96 86 Q150 52 206 83"/><path class="fina" d="M100 80 Q150 47 202 77"/>',
    '<path class="linea" d="M98 88 Q150 114 204 85"/><path class="fina" d="M104 94 Q150 118 198 92"/>',
    '<path class="fina" d="M92 62 Q150 30 214 60"/>',
    '<text class="rotulo" x="222" y="45">Pliegue del párpado</text>',
    '<text class="rotulo-acento" x="222" y="70">El párpado tapa el iris</text>',
    '<text class="rotulo" x="222" y="92">Brillo: un solo punto</text>',
    '<text class="rotulo" x="222" y="114">Grosor del párpado</text>',
    '<text class="rotulo" x="20" y="150">El globo (línea punteada) manda: los párpados lo siguen</text>',
  ),
};

const FIG_LUZ = {
  titulo: 'La luz sobre una esfera: luz, medio tono, núcleo de sombra, luz reflejada y sombra proyectada',
  vista: '0 0 330 200',
  svg: svg(
    '<defs><clipPath id="rr-esfera"><circle cx="110" cy="95" r="60"/></clipPath></defs>',
    '<ellipse class="v4" cx="158" cy="160" rx="62" ry="14"/>',
    '<g clip-path="url(#rr-esfera)"><rect class="v3" x="40" y="25" width="140" height="140"/>',
    '<circle class="v5" cx="98" cy="83" r="62"/><circle class="v2" cx="90" cy="76" r="56"/><circle class="v1" cx="85" cy="70" r="46"/></g>',
    '<circle class="fina" cx="110" cy="95" r="60"/><circle class="papel" cx="78" cy="62" r="6"/>',
    '<line class="acento" x1="14" y1="14" x2="48" y2="40"/><text class="rotulo-acento" x="10" y="12">Luz</text>',
    '<line class="fina" x1="200" y1="45" x2="84" y2="82"/><text class="rotulo" x="204" y="48">Luz</text>',
    '<line class="fina" x1="200" y1="70" x2="123" y2="106"/><text class="rotulo" x="204" y="73">Medio tono</text>',
    '<line class="fina" x1="200" y1="95" x2="136" y2="121"/><text class="rotulo-acento" x="204" y="98">Núcleo de sombra</text>',
    '<line class="fina" x1="200" y1="120" x2="148" y2="132"/><text class="rotulo" x="204" y="123">Luz reflejada</text>',
    '<line class="fina" x1="200" y1="160" x2="190" y2="162"/><text class="rotulo" x="204" y="163">Sombra proyectada</text>',
  ),
};

const FIG_VALORES = {
  titulo: 'Una escala de 5 valores: entrecierra los ojos y decide a cuál se parece cada zona',
  vista: '0 0 300 80',
  svg: svg(
    '<rect class="v1" x="20" y="14" width="50" height="40"/><rect class="v2" x="75" y="14" width="50" height="40"/>',
    '<rect class="v3" x="130" y="14" width="50" height="40"/><rect class="v4" x="185" y="14" width="50" height="40"/><rect class="v5" x="240" y="14" width="50" height="40"/>',
    '<text class="rotulo" x="38" y="70">1 luz</text><text class="rotulo" x="88" y="70">2</text><text class="rotulo" x="143" y="70">3 medio</text>',
    '<text class="rotulo" x="203" y="70">4</text><text class="rotulo" x="248" y="70">5 oscuro</text>',
  ),
};

const FIG_BORDES = {
  titulo: 'Bordes: duro donde la forma gira de golpe o hay contraste, suave donde gira despacio, perdido donde se funde con el fondo',
  vista: '0 0 320 120',
  svg: svg(
    '<defs><radialGradient id="rr-suave"><stop offset="55%" class="s-oscuro"/><stop offset="100%" class="s-papel"/></radialGradient>',
    '<linearGradient id="rr-perdido" x1="0" x2="1"><stop offset="0%" class="s-oscuro"/><stop offset="45%" class="s-oscuro"/><stop offset="100%" class="s-papel"/></linearGradient></defs>',
    '<circle class="v4" cx="55" cy="55" r="34"/>',
    '<circle cx="160" cy="55" r="40" fill="url(#rr-suave)"/>',
    '<rect x="220" y="21" width="90" height="68" fill="url(#rr-perdido)"/>',
    '<text class="rotulo" x="30" y="108">Duro</text><text class="rotulo" x="140" y="108">Suave</text><text class="rotulo" x="240" y="108">Perdido</text>',
  ),
};

// ---------- Módulo 1 ----------
const VER = {
  titulo: 'Ver y medir',
  objetivo: 'Entender por qué dibujamos lo que creemos y no lo que vemos, y medir con el lápiz (tamaños, ángulos y alineaciones) para corregirlo.',
  fuentes: [
    ['Cohen, D. J. y Bennett, S. (1997). Why can\'t most people draw what they see? Journal of Experimental Psychology: Human Perception and Performance, 23(3), 609-621.', 'El error principal al dibujar está en cómo se percibe el modelo, no en la mano.'],
    ['Chamberlain, R. y Wagemans, J. (2016). The genesis of errors in drawing. Neuroscience & Biobehavioral Reviews, 65, 195-207.', 'Revisión de dónde vienen los errores al dibujar del natural.'],
    ['Kozbelt, A. (2001). Artists as experts in visual cognition. Visual Cognition, 8(6), 705-723.', 'Los artistas perciben mejor, no solo mueven mejor la mano.'],
    ['Edwards, B. (1979). Drawing on the Right Side of the Brain. J. P. Tarcher. (En español: Aprender a dibujar con el lado derecho del cerebro, Urano).', 'Ejercicios clásicos para ver: dibujo al revés, contornos, espacios negativos.'],
    ['Nielsen, J. A., Zielinski, B. A., Ferguson, M. A., Lainhart, J. E. y Anderson, J. S. (2013). An evaluation of the left-brain vs. right-brain hypothesis with resting state functional connectivity magnetic resonance imaging. PLoS ONE, 8(8), e71275.', 'No hay personas "de cerebro derecho" o "izquierdo".'],
    ['Speed, H. (1913). The Practice and Science of Drawing. Seeley, Service & Co. (Reeditado por Dover).', 'Un clásico sobre ver masas, medir y trabajar de lo general a lo particular.'],
    ['Ackerman, G. M. (2003). Charles Bargue and Jean-Léon Gérôme: Drawing Course. ACR Edition.', 'El curso de láminas de las academias del siglo XIX, que también copió Van Gogh.'],
  ],
  lecciones: [
    l('Por qué no dibujamos lo que vemos', 10, {
      idea: 'Antes de leer: dibuja de memoria un ojo en un papel. Seguramente te salió una almendra con un círculo en el centro. Ese es el problema: dibujamos el símbolo que tenemos guardado de "ojo", no el ojo que tenemos al frente. Aprender a dibujar es, sobre todo, aprender a mirar.',
      bloques: [
        ['El cerebro dibuja símbolos', [
          'Cuando miras una cara, el cerebro no guarda la imagen como una foto: guarda lo que sabe ("dos ojos, una nariz, una boca") y completa el resto.',
          'Por eso los niños (y los adultos que no practican) dibujan ojos de almendra, una nariz de "L" y la boca como una línea: son los símbolos, no lo que ven.',
          'Cohen y Bennett (1997) probaron varias explicaciones de por qué la mayoría no dibuja bien lo que ve. El error más grande no estaba en la mano ni en la decisión de qué dibujar, sino en cómo percibimos el modelo.',
        ]],
        ['Lo que sabes engaña a lo que ves', [
          'Sabes que los ojos de alguien son iguales; en una cara girada, el ojo lejano se ve más angosto. Si dibujas lo que sabes, la cara se aplana.',
          'Sabes que la mesa es rectangular; vista en perspectiva no tiene ángulos rectos. Lo mismo pasa con la cara: casi nada se ve como "es".',
          'Kozbelt (2001) comparó artistas y no artistas: los artistas no solo dibujaban mejor, también resolvían mejor tareas de percepción. Dibujar bien es en buena parte ver bien.',
        ]],
        ['Cómo engañar a tu cerebro', [
          'Copiar una foto al revés: así no reconoces la cara y te obligas a ver líneas, ángulos y formas.',
          'Dibujar los espacios negativos: la forma del aire entre la oreja y el cuello, o entre el brazo y el cuerpo. Esas formas no tienen nombre, entonces las ves como son.',
          'Comparar todo el tiempo: el modelo, el dibujo, el modelo. Un buen dibujante mira el modelo tanto como el papel.',
        ]],
      ],
      ejemplos: [
        'Le haces un retrato a tu sobrina y te queda "con cara de adulta". Al comparar con la foto, ves que dibujaste los ojos muy arriba: en los niños los ojos están por debajo de la mitad de la cabeza porque el cráneo es grande. Dibujaste el símbolo de cara adulta, no la cara de ella.',
        'Copias la foto de tu papá al revés y, sin poder reconocerlo, te sale más parecido que el que hiciste derecho: tuviste que mirar ángulos y distancias en vez de "ojos" y "boca".',
      ],
      practica: [
        'Dibuja de memoria una cara en 2 minutos; guárdala con la fecha: es tu punto de partida.',
        'Busca la foto de una cara, voltéala de cabeza y cópiala en 20 minutos sin girarla hasta terminar.',
        'Compara los dos dibujos y anota tres diferencias entre el símbolo y lo que viste.',
      ],
      pregunta: '¿Qué parte de la cara dibujo "de memoria" sin mirar de verdad?',
      nota: 'Betty Edwards popularizó la idea de que dibujar es usar "el lado derecho del cerebro". Es una metáfora: los estudios de imágenes del cerebro no encuentran personas de "cerebro derecho" o "izquierdo" (Nielsen y colegas, 2013), y dibujar usa los dos lados. Lo que sí sirve de su libro son los ejercicios para ver: dibujar al revés, los contornos y los espacios negativos. Tampoco es cierto que dibujar sea un "don": hay diferencias entre personas, pero la percepción para dibujar se entrena.',
      recordar: [
        ['¿Dónde está el error principal al dibujar lo que vemos, según Cohen y Bennett?', 'En cómo percibimos el modelo, más que en la mano.'],
        ['¿Por qué dibujamos ojos de almendra?', 'Porque el cerebro reemplaza lo que ve por el símbolo que tiene guardado.'],
        ['¿Para qué sirve copiar una foto al revés?', 'Para no reconocer la cara y obligarte a ver ángulos, distancias y formas.'],
        ['¿Qué son los espacios negativos?', 'Las formas del aire entre las partes del modelo; como no tienen nombre, se ven como son.'],
      ],
      tarjetas: [
        ['El enemigo del retrato', 'El símbolo: dibujas lo que sabes ("un ojo") en vez de lo que ves. Mira más el modelo que el papel.'],
        ['Cerebro derecho', 'Es una metáfora, no un hecho. Lo útil son los ejercicios para ver: al revés, contornos, espacios negativos.'],
        ['Dibujar es ver', 'Los artistas perciben mejor, no solo mueven mejor la mano. La percepción se entrena.'],
      ],
      feynman: 'Explícale a un niño de 12 años por qué su dibujo de una cara no se parece a nadie, sin usar las palabras "símbolo" ni "percepción".',
      reto: 'Haz la copia al revés de una foto de un familiar en 30 minutos, luego voltéala y marca con un círculo los tres sitios donde más se aleja de la foto.',
    }),
    l('Medir con el lápiz: tamaños, ángulos y plomadas', 12, {
      idea: 'El ojo engaña, la medida no. Con el brazo estirado y el lápiz como regla puedes comparar tamaños (cuántas veces cabe la nariz en la cara), copiar ángulos (la inclinación de la mandíbula) y ver qué queda alineado con qué.',
      bloques: [
        ['La unidad de medida', [
          'Elige una medida corta del modelo, por ejemplo el alto de la nariz o el ancho de un ojo. Esa es tu unidad.',
          'Estira el brazo del todo (siempre igual, si no las medidas cambian), cierra un ojo y marca con el pulgar sobre el lápiz el largo de la unidad.',
          'Compara: ¿cuántas narices hay del mentón a las cejas? ¿cuántos ojos de ancho tiene la cara? Así pasas las proporciones a tu papel, aunque el dibujo sea más grande o más pequeño.',
        ]],
        ['Ángulos y plomadas', [
          'Pon el lápiz sobre una línea del modelo (la mandíbula, la inclinación de la cabeza) y llévalo al papel sin girarlo para copiar el ángulo.',
          'Plomada: el lápiz vertical muestra qué está debajo de qué. Por ejemplo, qué parte del ojo queda encima de la comisura de la boca.',
          'Lo mismo en horizontal: qué queda a la misma altura (la punta de la oreja y la ceja, el lóbulo y la nariz).',
        ]],
        ['Primero lo grande', [
          'Empieza por el tamaño total de la cabeza y su inclinación; después ojos, nariz y boca. Si el contorno general está mal, ningún detalle lo arregla.',
          'Marca con puntos suaves (arriba, abajo, lados) antes de dibujar líneas.',
          'Mide, dibuja, vuelve a medir. Las medidas no son para el principio: son para comprobar todo el tiempo.',
        ]],
      ],
      ejemplos: [
        'Dibujas a tu mamá desde la foto y la cara te queda muy larga. Mides: en la foto, del mentón a las cejas caben dos narices; en tu dibujo caben casi tres. Ya sabes qué corregir: la parte de abajo.',
        'Al poner el lápiz vertical sobre el ojo izquierdo de tu amigo, ves que la comisura de su boca cae justo debajo del borde del iris. En tu dibujo quedó por fuera del ojo: por eso la boca se ve muy ancha.',
      ],
      practica: [
        'Mide con el lápiz la cara de alguien (o de una foto en la pantalla): cuántas veces cabe la nariz del mentón al pelo.',
        'Copia tres ángulos de una foto (inclinación de la cabeza, de la mandíbula y de la línea de los ojos) solo con líneas.',
        'Haz un dibujo de 15 minutos marcando primero los puntos de arriba, abajo y los lados antes de cualquier detalle.',
      ],
      pregunta: '¿En qué parte de mis dibujos suelo equivocarme de tamaño: lo hago más grande o más chico de lo que es?',
      nota: 'Medir no es "hacer trampa" ni le quita lo artístico al dibujo: las academias del siglo XIX enseñaban así (por ejemplo, con las láminas de Bargue que también copió Van Gogh). Lo que sí se exagera es la idea de que hay que medirlo todo con regla: con la práctica el ojo aprende las proporciones y se mide para comprobar. Otro aviso: la cuadrícula o calcar sirven para estudiar, pero si solo calcas, no entrenas el ojo.',
      recordar: [
        ['¿Por qué el brazo debe ir siempre igual de estirado al medir?', 'Porque si cambia la distancia, cambian todas las medidas.'],
        ['¿Qué es la unidad de medida?', 'Una parte corta del modelo (por ejemplo, la nariz) con la que comparas todo lo demás.'],
        ['¿Para qué sirve la plomada?', 'Para ver qué queda exactamente debajo o encima de qué.'],
        ['¿Por qué empezar por lo grande?', 'Porque si el tamaño y la inclinación generales están mal, ningún detalle lo arregla.'],
      ],
      tarjetas: [
        ['Medir con el lápiz', 'Brazo estirado siempre igual, un ojo cerrado, una unidad (la nariz) y comparas cuántas caben.'],
        ['Plomada', 'El lápiz vertical u horizontal muestra qué queda alineado con qué.'],
        ['De lo grande a lo chico', 'Tamaño e inclinación de la cabeza primero; los detalles al final.'],
      ],
      feynman: 'Explícale a un niño de 12 años cómo usar un lápiz para saber si dibujó la cara muy larga, sin usar las palabras "proporción" ni "unidad".',
      reto: 'Haz el contorno de una cabeza en 10 minutos solo con medidas y plomadas, sin ojos ni boca. Luego superpón tu dibujo a la foto con una foto del celular y anota cuánto te desviaste.',
    }),
    l('Materiales y cómo trabajar', 10, {
      idea: 'No necesitas materiales caros. Con tres o cuatro lápices de grafito, buen papel, una goma moldeable y una sola luz de lado ya puedes hacer un retrato realista. Más importa cómo trabajas: de lo claro a lo oscuro, con capas y mirando de lejos.',
      bloques: [
        ['Lo mínimo', [
          'Lápices: la letra H es dura y clara; la B es blanda y oscura; HB es el punto medio. Con 2H (líneas de guía), HB, 2B y 6B (las sombras más oscuras) tienes de sobra.',
          'Papel con algo de textura y de buen gramaje: aguanta capas y borrones. La hoja de impresora sirve para practicar, no para un retrato largo.',
          'Goma moldeable (de amasar): levanta grafito sin rayar el papel y sirve para "dibujar" brillos. Una goma dura en lápiz para bordes finos.',
          'Un sacapuntas o un bisturí para puntas largas, y una hoja de papel bajo la mano para no manchar.',
        ]],
        ['La luz y la referencia', [
          'Una sola luz fuerte de lado (una ventana, una lámpara) marca las formas. La luz del techo o el flash aplanan la cara.',
          'Si usas foto: que sea nítida, con luz de un solo lado y tomada a la altura de los ojos. Las fotos de celular muy cerca deforman la nariz y la frente.',
          'Dibujar del natural (una persona al frente) enseña más, porque te obliga a convertir lo que ves en 3D a 2D; la foto ya lo hizo por ti. Combina las dos.',
        ]],
        ['Cómo trabajar', [
          'Postura: el papel casi vertical (en un tablero inclinado) para no deformar el dibujo; si lo dibujas acostado, se te alarga.',
          'Capas: oscurece poco a poco con varias pasadas; si aprietas mucho al principio, el grafito brilla y ya no se borra.',
          'Aléjate cada 10 o 15 minutos: de lejos se ven los errores de proporción y de valor.',
        ]],
      ],
      ejemplos: [
        'Le tomas una foto a tu abuela con el flash del celular y al dibujarla todo te queda plano: no hay sombras que muestren la nariz ni los pómulos. La repites con ella sentada al lado de la ventana y aparecen las formas.',
        'Haces las sombras del pelo con un 6B apretando fuerte desde el principio; el papel se satura, brilla y no puedes aclarar. La próxima vez empiezas con HB suave y subes por capas.',
      ],
      practica: [
        'Haz una escala de valores con cada lápiz que tengas: del más claro que puedas al más oscuro.',
        'Toma una foto de alguien (o de ti) con luz de ventana de un solo lado y otra con la luz del techo; compáralas.',
        'Prepara tu sitio: tablero o carpeta inclinada, luz de lado y la referencia a la altura de los ojos.',
      ],
      pregunta: '¿Qué me frena para empezar: los materiales, el sitio o el miedo a que quede feo?',
      nota: 'Se repite que "sin buenos materiales no hay buen dibujo". Los materiales buenos ayudan, pero los retratos de estudio de las academias se hacían con muy poco: carboncillo, papel y una luz. Al principio, más lápices solo distraen. Otro mito: que dibujar de fotos "no vale". Muchos retratistas trabajan con fotos; el riesgo es copiar sus deformaciones (lentes muy cerca, sombras planas) sin darte cuenta.',
      recordar: [
        ['¿Qué diferencia hay entre un lápiz H y uno B?', 'El H es duro y claro; el B es blando y oscuro.'],
        ['¿Por qué una sola luz de lado?', 'Porque marca las formas con sombras; la luz de frente o del techo aplana la cara.'],
        ['¿Por qué oscurecer por capas?', 'Porque si aprietas mucho al principio el grafito brilla y ya no se puede corregir.'],
        ['¿Por qué el papel casi vertical?', 'Porque dibujando acostado el dibujo se deforma (se alarga).'],
      ],
      tarjetas: [
        ['Kit mínimo', '2H, HB, 2B, 6B, papel con textura, goma moldeable. Nada más para empezar.'],
        ['La luz', 'Una sola, fuerte y de lado. El flash y la luz del techo aplanan.'],
        ['Por capas', 'De claro a oscuro y sin apretar al principio. Aléjate cada 15 minutos.'],
      ],
      feynman: 'Explícale a un niño de 12 años por qué la foto con flash es mala para dibujar, sin usar las palabras "sombra" ni "volumen".',
      reto: 'Haz la misma esfera (una pelota) dos veces: una con luz del techo y otra con una lámpara de lado. Dibuja ambas en 20 minutos cada una y compara cuál se ve redonda.',
    }),
  ],
  comprobacion: 'Lo dominas si, sin mirar la lección, puedes medir con el lápiz una cara (unidad, ángulos y plomadas), explicar por qué dibujamos símbolos y preparar tu sitio con la luz y los materiales correctos.',
};

// ---------- Módulo 2 ----------
const ESTRUCTURA = {
  titulo: 'La estructura de la cabeza',
  objetivo: 'Construir la cabeza como un volumen (el método de Loomis), ubicar los rasgos con las proporciones promedio y ajustarlas a la persona, de frente y girada.',
  fuentes: [
    ['Loomis, A. (1956). Drawing the Head and Hands. Viking Press.', 'El método de la esfera con los lados cortados y la cara en tercios.'],
    ['Bridgman, G. B. (1920). Constructive Anatomy. Edward C. Bridgman. (Reeditado por Dover).', 'La cabeza y el cuerpo como bloques que se encajan.'],
    ['Hampton, M. (2009). Figure Drawing: Design and Invention. Michael Hampton.', 'Formas simples y ritmos para construir la figura y la cabeza.'],
    ['Farkas, L. G. et al. (2005). International anthropometric study of facial morphology in various ethnic groups/races. Journal of Craniofacial Surgery, 16(4), 615-646.', 'Las proporciones "clásicas" de la cara casi nunca se cumplen exactas y varían entre poblaciones.'],
    ['Peck, S. R. (1951). Atlas of Human Anatomy for the Artist. Oxford University Press.', 'Anatomía del cráneo y los músculos de la cara para artistas.'],
  ],
  lecciones: [
    l('La cabeza es un volumen: el método de Loomis', 12, {
      idea: 'Una cara no es un óvalo plano con rasgos pegados: es un volumen. Andrew Loomis propuso empezar con una esfera (el cráneo), cortarle los lados, colgarle la mandíbula y dividir la cara en tres partes iguales. Con esa estructura, los rasgos caen en su sitio y la cabeza se puede girar.',
      figuras: [FIG_LOOMIS],
      bloques: [
        ['La esfera y los cortes', [
          'Dibuja una esfera: es el cráneo. Visto de frente es un círculo.',
          'Córtale los lados: la cabeza es más angosta que una pelota. Esos cortes son los planos laterales, donde van las sienes y las orejas.',
          'Traza la línea central (de arriba abajo) y la línea de las cejas (horizontal, en la mitad de la esfera). Si la cabeza gira o se inclina, esas líneas giran con ella.',
        ]],
        ['La cara en tres partes', [
          'Del nacimiento del pelo a las cejas, de las cejas a la base de la nariz y de la nariz al mentón: tres partes más o menos iguales.',
          'En el método de Loomis, la base de la nariz cae en la parte de abajo de la esfera, y el mentón una parte más abajo.',
          'Une el mentón con los lados de la esfera: esa es la mandíbula. Su forma (cuadrada, fina, ancha) cambia mucho de una persona a otra.',
        ]],
        ['Por qué sirve', [
          'Te obliga a pensar en volumen desde el primer trazo: así la cara se ve redonda y no recortada.',
          'Es un andamio, no el dibujo: se hace con líneas suaves y después se borra o se tapa.',
          'Sirve para cualquier ángulo: si sabes girar la esfera, sabes girar la cara.',
        ]],
      ],
      ejemplos: [
        'Quieres dibujar a tu hermano mirando un poco hacia arriba, desde una foto del partido. Sin estructura, los ojos te quedan rectos y la cara parece de frente. Con la esfera de Loomis inclinada, la línea de las cejas se curva hacia arriba y los rasgos la siguen: ahora sí mira hacia arriba.',
        'Contraejemplo: si ya tienes la referencia de frente y bien medida, hacer un Loomis completo puede sobrar; basta con el contorno medido. El método brilla cuando hay giro o cuando dibujas de imaginación.',
      ],
      practica: [
        'Llena una hoja con 10 esferas de Loomis de frente, cada una en 2 minutos.',
        'Haz otras 10 girando la esfera: hacia los lados, hacia arriba y hacia abajo.',
        'Sobre la foto de una cara (impresa o en una app de dibujo), traza la esfera, la línea central y los tres tercios.',
      ],
      pregunta: '¿Mis caras se ven planas o con volumen? ¿Qué parte de la estructura me salto?',
      nota: 'El método de Loomis es una herramienta de construcción, no una ley de la naturaleza. Las tres partes "iguales" de la cara son un promedio y en muchas personas no se cumplen (Farkas y colegas, 2005, midieron miles de caras de distintas poblaciones y encontraron que las proporciones clásicas casi nunca son exactas). Úsalo para arrancar y después mide a la persona real: el parecido está justo en cómo se aparta del promedio.',
      recordar: [
        ['¿Con qué forma empieza el método de Loomis?', 'Con una esfera (el cráneo) a la que se le cortan los lados.'],
        ['¿Cuáles son las tres partes de la cara?', 'Del pelo a las cejas, de las cejas a la base de la nariz y de la nariz al mentón.'],
        ['¿Dónde cae la línea de las cejas en la esfera?', 'En la mitad de la esfera.'],
        ['¿Cuándo sirve más el método?', 'Cuando la cabeza está girada o inclinada, o cuando dibujas de imaginación.'],
      ],
      tarjetas: [
        ['Loomis', 'Esfera, lados cortados, línea central y de cejas, nariz abajo de la esfera, mentón un tercio más abajo.'],
        ['Tres tercios', 'Pelo-cejas, cejas-nariz, nariz-mentón. Es un promedio: mide a la persona real.'],
        ['Andamio', 'La estructura se hace suave y se borra; sirve para girar la cabeza sin perderla.'],
      ],
      feynman: 'Explícale a un niño de 12 años por qué conviene empezar una cara con una pelota, sin usar las palabras "volumen" ni "estructura".',
      reto: 'Elige 5 fotos de caras en ángulos distintos (frente, perfil, arriba, abajo, tres cuartos) y traza encima la esfera de Loomis de cada una. Luego dibuja solo las estructuras, sin rasgos, de memoria.',
    }),
    l('Proporciones del rostro: el promedio y la persona', 12, {
      idea: 'Antes de leer: ¿dónde crees que van los ojos, en el tercio de arriba o en la mitad de la cabeza? La mayoría los pone muy arriba. En un adulto, los ojos van en la mitad de la cabeza contando el cráneo, no la mitad de la cara.',
      figuras: [FIG_PROPORCIONES],
      bloques: [
        ['Las medidas promedio de frente', [
          'Los ojos están en la mitad de la cabeza, de la coronilla al mentón.',
          'A la altura de los ojos la cara mide más o menos cinco ojos de ancho, y entre los dos ojos cabe más o menos un ojo.',
          'Las alas de la nariz caen más o menos debajo del lagrimal (la esquina de adentro del ojo).',
          'Las comisuras de la boca caen más o menos debajo del centro del ojo (la pupila mirando al frente).',
          'Las orejas van entre la línea de las cejas y la base de la nariz.',
        ]],
        ['Qué cambia con la edad y con cada persona', [
          'En los bebés y niños los ojos están por debajo de la mitad, porque el cráneo es grande y la cara pequeña.',
          'Con la edad la nariz y las orejas parecen más largas y los párpados caen un poco.',
          'Cada persona se aparta del promedio: ojos más juntos, frente más alta, mentón más corto. Ahí está el parecido.',
        ]],
        ['Cómo usarlas', [
          'Primero ubica las líneas con las medidas promedio, suaves.',
          'Después mide a la persona con el lápiz y corrige: "su nariz es más larga que el promedio", "sus ojos están más separados".',
          'Exagera un poquito lo que la hace distinta, no lo que la hace igual a todos: así el retrato se parece.',
        ]],
      ],
      ejemplos: [
        'Tu retrato de un compañero del trabajo se ve "genérico". Mides la foto: él tiene la frente alta y el mentón corto. En tu dibujo quedó todo en tercios iguales. Al ajustar esas dos medidas, de repente es él.',
        'Contraejemplo: si dibujas a tu hija de 3 años con los ojos en la mitad de la cabeza, parece una adulta pequeña. En los niños la regla no aplica: los ojos bajan.',
      ],
      practica: [
        'Dibuja una cabeza de frente con todas las medidas promedio de la figura, en 15 minutos.',
        'Toma una foto de frente de alguien y mide sus diferencias con el promedio: escribe tres.',
        'Haz un segundo dibujo de esa persona aplicando esas tres diferencias.',
      ],
      pregunta: '¿Qué rasgo de la cara de alguien que quiero dibujar se aparta más del promedio?',
      nota: 'Las proporciones "perfectas" (los tercios, los cinco ojos, la proporción áurea en la cara) vienen de cánones artísticos, no de cómo son las caras reales. Farkas y colegas (2005) midieron caras de muchas poblaciones y encontraron que esos cánones casi nunca se cumplen exactos y varían entre grupos. Y no hay evidencia sólida de que la belleza siga la proporción áurea. Las medidas son un punto de partida, no un molde.',
      recordar: [
        ['¿Dónde van los ojos en un adulto?', 'En la mitad de la cabeza, de la coronilla al mentón.'],
        ['¿Cuántos ojos de ancho mide la cara a la altura de los ojos?', 'Más o menos cinco, con un ojo entre los dos ojos.'],
        ['¿Entre qué líneas van las orejas?', 'Entre la línea de las cejas y la base de la nariz.'],
        ['¿Por qué no sirven las mismas medidas para un niño?', 'Porque su cráneo es grande y la cara pequeña: los ojos quedan por debajo de la mitad.'],
        ['¿Dónde está el parecido de un retrato?', 'En cómo la persona se aparta del promedio.'],
      ],
      tarjetas: [
        ['Los ojos', 'En la mitad de la cabeza (adultos). La mayoría los dibuja muy arriba.'],
        ['Cinco ojos', 'La cara mide unos cinco ojos de ancho; entre los ojos cabe uno.'],
        ['Promedio vs. persona', 'Pon el promedio suave y luego mide a la persona: el parecido está en sus diferencias.'],
      ],
      feynman: 'Explícale a un niño de 12 años dónde van los ojos en una cara y por qué casi todos los ponemos mal, sin usar las palabras "proporción" ni "promedio".',
      reto: 'Dibuja de memoria (sin mirar la figura) una cabeza de frente con todas las medidas. Luego compárala con la figura y con la foto de alguien real, y marca qué recordaste mal.',
    }),
    l('La cabeza girada e inclinada', 10, {
      idea: 'La mayoría de los retratos que valen la pena no son de frente perfecto: la cabeza gira o se inclina. Cuando la esfera gira, la línea central y la línea de los ojos se curvan, el ojo y la mejilla lejanos se achican y aparece el plano lateral con la oreja.',
      figuras: [FIG_GIRO],
      bloques: [
        ['Las líneas se curvan', [
          'Sobre una esfera, toda línea se ve curva salvo cuando la miras de frente. Por eso, al girar la cabeza, la línea central se corre hacia un lado y se curva.',
          'Al inclinar la cabeza hacia arriba, las líneas de cejas, nariz y boca se curvan hacia arriba (como una sonrisa); hacia abajo, se curvan hacia abajo.',
          'Los rasgos se apoyan sobre esas líneas: si las líneas están bien, los rasgos quedan en su sitio.',
        ]],
        ['Lo que se achica (escorzo)', [
          'Escorzo es cuando algo que va hacia el fondo se ve más corto. En tres cuartos, el ojo lejano se ve más angosto y la mejilla lejana casi desaparece.',
          'La nariz sobresale de la cara: en tres cuartos tapa parte de la mejilla del otro lado.',
          'La boca también se curva: la mitad lejana se ve más corta.',
        ]],
        ['El perfil y los tres cuartos', [
          'De perfil, la cabeza es casi tan honda como alta y la oreja queda un poco detrás de la mitad.',
          'En tres cuartos aparece el plano lateral (sienes, pómulo, oreja) y el borde de la cara deja de ser simétrico.',
          'Truco: dibuja la caja o la esfera con su giro antes que cualquier rasgo.',
        ]],
      ],
      ejemplos: [
        'Dibujas a tu novia de tres cuartos y el ojo lejano te queda igual de grande que el cercano: parece que tuviera los ojos de frente pegados en una cara girada. Al hacerlo más angosto y pegado a la nariz, el giro se ve natural.',
        'En una foto tu primo mira hacia abajo al celular. Si dibujas la boca recta, parece que mirara al frente; al curvar hacia abajo las líneas de nariz y boca, se ve inclinado.',
      ],
      practica: [
        'Dibuja 6 esferas de Loomis con la línea central y la de los ojos girando: izquierda, derecha, arriba, abajo y dos en diagonal.',
        'Copia una cabeza de tres cuartos de una foto, solo la estructura y las líneas de los rasgos.',
        'Marca en esa copia qué se ve más corto por el escorzo.',
      ],
      pregunta: '¿Por qué mis caras siempre terminan mirando de frente aunque la foto esté girada?',
      nota: 'Se dice que el perfil "es lo más fácil". Es más fácil de medir, pero también es donde más se nota un error de proporción (la nariz, el mentón). Y la cabeza no es una esfera perfecta: en perfil es más honda atrás. La esfera sirve para entender el giro; para el parecido, mide.',
      recordar: [
        ['¿Qué pasa con la línea central al girar la cabeza?', 'Se corre hacia un lado y se curva sobre la esfera.'],
        ['¿Hacia dónde se curvan las líneas al mirar hacia arriba?', 'Hacia arriba, como una sonrisa.'],
        ['¿Qué es el escorzo?', 'Lo que va hacia el fondo se ve más corto.'],
        ['En tres cuartos, ¿cómo se ve el ojo lejano?', 'Más angosto y pegado a la nariz.'],
      ],
      tarjetas: [
        ['Giro', 'La línea central y la de los ojos se curvan sobre la esfera. Los rasgos las siguen.'],
        ['Escorzo', 'Lo lejano se acorta: ojo, mejilla y media boca del otro lado.'],
        ['Inclinación', 'Mirando arriba, las líneas se curvan hacia arriba; mirando abajo, hacia abajo.'],
      ],
      feynman: 'Explícale a un niño de 12 años por qué en una cara girada un ojo se ve más pequeño que el otro, sin usar las palabras "escorzo" ni "perspectiva".',
      reto: 'Pídele a alguien que gire la cabeza despacio mientras haces 5 bocetos de 2 minutos cada uno, solo con la esfera y las líneas. Al final ordénalos del más girado al menos girado.',
    }),
  ],
  comprobacion: 'Lo dominas si, sin mirar, puedes construir una cabeza con el método de Loomis de frente y girada, ubicar ojos, nariz, boca y orejas con las proporciones promedio y decir tres diferencias de una cara real con ese promedio.',
};

// ---------- Módulo 3 ----------
const RASGOS = {
  titulo: 'Los rasgos',
  objetivo: 'Dibujar ojos, nariz, boca, orejas y pelo como formas con volumen y planos, no como símbolos, y ubicarlos sobre la estructura.',
  fuentes: [
    ['Loomis, A. (1956). Drawing the Head and Hands. Viking Press.', 'Rasgos sobre la estructura y sus planos.'],
    ['Peck, S. R. (1951). Atlas of Human Anatomy for the Artist. Oxford University Press.', 'Anatomía del ojo, la nariz, la boca y el cuello.'],
    ['Hale, R. B. (1964). Drawing Lessons from the Great Masters. Watson-Guptill.', 'Cómo resolvían los maestros los rasgos y el pelo con pocas líneas.'],
    ['Livingstone, M. (2002). Vision and Art: The Biology of Seeing. Harry N. Abrams.', 'Cómo percibimos caras, bordes y contrastes.'],
  ],
  lecciones: [
    l('El ojo', 12, {
      idea: 'El ojo no es una almendra plana: es una esfera metida en la cuenca, y los párpados la envuelven. Si dibujas el globo primero, los párpados se curvan solos, el iris queda tapado en parte por el párpado de arriba y el ojo mira de verdad.',
      figuras: [FIG_OJO],
      bloques: [
        ['La esfera y los párpados', [
          'El globo del ojo es una esfera; los párpados son como dos telas gruesas que la cubren.',
          'Los párpados tienen grosor: el borde de abajo se ve como una franja clara que recibe luz, no como una línea.',
          'El párpado de arriba casi siempre tapa una parte del iris; si dibujas el iris completo, la persona se ve asustada.',
          'La esquina de adentro (el lagrimal) es más baja y redondeada; la de afuera, más fina.',
        ]],
        ['El iris, la pupila y el brillo', [
          'El iris es un círculo (una elipse si el ojo gira) con el borde más oscuro que el centro.',
          'La pupila es el punto más oscuro del ojo.',
          'El brillo es el reflejo de la luz: uno solo, en el mismo lado en los dos ojos, y casi siempre tocando el borde entre iris y pupila. Resérvalo (no lo pintes) o sácalo con la goma.',
        ]],
        ['Alrededor del ojo', [
          'Lo blanco del ojo no es blanco: está a la sombra del párpado y de la cuenca, sobre todo arriba y en las esquinas.',
          'La ceja sigue el hueso de la frente; se dibuja en la dirección en que crece el pelo, con trazos, no como una barra.',
          'Las pestañas se agrupan y se curvan; dibujarlas una por una como palitos se ve falso.',
        ]],
      ],
      ejemplos: [
        'Tus ojos se ven "de muñeco". Revisas: dibujaste el iris completo, lo blanco muy blanco y las pestañas como palitos. Al tapar el iris con el párpado, sombrear lo blanco y agrupar las pestañas, el ojo cobra vida.',
        'En el retrato de tu abuelo los párpados caen un poco sobre el ojo de afuera. Si los dibujas como los de un joven, deja de parecerse: ese pliegue es parte de su cara.',
      ],
      practica: [
        'Dibuja 5 ojos de una foto, empezando cada uno con el círculo del globo en línea suave.',
        'Haz uno de frente y uno de perfil (de perfil el iris es una elipse delgada).',
        'Sombrea lo blanco de uno de ellos y compáralo con uno donde lo dejaste blanco.',
      ],
      pregunta: '¿Qué hago siempre igual en los ojos que dibujo, sin importar de quién sean?',
      nota: 'Se dice que "los ojos son lo más importante del retrato". Atraen la mirada, pero un ojo perfecto en el sitio equivocado arruina el parecido: la ubicación y la estructura pesan más que el detalle. Otro error común: dibujar los dos ojos por separado hasta terminarlos. Llévalos juntos, porque su relación (distancia, inclinación, tamaño) es lo que se nota.',
      recordar: [
        ['¿Por qué empezar el ojo con un círculo?', 'Porque es una esfera y los párpados la envuelven; así se curvan bien.'],
        ['¿Qué pasa si dibujas el iris completo?', 'La persona se ve asustada: normalmente el párpado de arriba tapa una parte.'],
        ['¿Cómo es el brillo en los dos ojos?', 'Uno solo, del mismo lado en los dos ojos.'],
        ['¿Por qué no dejar lo blanco del ojo blanco?', 'Porque está a la sombra de los párpados y la cuenca.'],
      ],
      tarjetas: [
        ['El ojo', 'Esfera primero; párpados con grosor que la envuelven; el de arriba tapa parte del iris.'],
        ['Brillo', 'Uno solo, del mismo lado en los dos ojos. Resérvalo o sácalo con la goma.'],
        ['Los dos a la vez', 'Lleva los dos ojos juntos: su distancia e inclinación dan el parecido.'],
      ],
      feynman: 'Explícale a un niño de 12 años por qué un ojo con todo el círculo de color a la vista se ve raro, sin usar las palabras "iris" ni "párpado".',
      reto: 'Dibuja tus propios ojos frente a un espejo en 20 minutos, con el globo primero. Luego repite mirando hacia un lado y compara cómo cambian los párpados.',
    }),
    l('La nariz y la boca', 12, {
      idea: 'La nariz casi no tiene líneas: se dibuja con planos y sombras (el puente, la punta, las alas y la base a la sombra). La boca no es una línea con dos labios: es una forma curva que sigue los dientes, con el labio de arriba más oscuro porque mira hacia abajo.',
      bloques: [
        ['La nariz como bloque', [
          'Imagina la nariz como una cuña o una caja: el puente (arriba), los dos lados, la punta y la base (que mira al piso).',
          'La base casi siempre está a la sombra; las fosas nasales son los puntos más oscuros, pero no son dos huecos negros: tienen forma de coma.',
          'La punta suele tener un brillo y las alas un pliegue que las separa de la mejilla.',
          'Evita la línea de los dos lados de la nariz: de frente se ve con la sombra de un lado, no con contornos.',
        ]],
        ['La boca sobre un cilindro', [
          'La boca se apoya sobre los dientes, que forman un medio cilindro: por eso la boca se curva y se ve más corta en tres cuartos.',
          'La línea donde se juntan los labios es lo más oscuro y no es recta: tiene una forma de alas en el centro.',
          'El labio de arriba mira hacia abajo y suele estar más oscuro; el de abajo mira hacia arriba, recibe luz y deja una sombra debajo.',
          'Las comisuras se hunden un poco; si las dibujas como puntas, la boca se ve pegada.',
        ]],
        ['No contornear', [
          'Rodear los labios con una línea los hace ver de caricatura. Define el borde con el cambio de valor: el labio es más oscuro que la piel.',
          'El surco de encima del labio (el filtrum) y la sombra debajo del labio de abajo arman la forma.',
          'Una sonrisa mueve las mejillas y achica los ojos: no es solo la boca.',
        ]],
      ],
      ejemplos: [
        'Dibujas la nariz de tu amiga con dos líneas a los lados y un gancho abajo: se ve como un dibujo animado. Cambias a la sombra de un lado, la base oscura y dos comas en las fosas, sin líneas, y aparece la nariz.',
        'Contraejemplo: en un dibujo rápido de línea (un boceto de 2 minutos) sí puedes usar una línea para la nariz o la boca; la regla de no contornear es para el retrato con valores.',
      ],
      practica: [
        'Dibuja 3 narices de fotos usando solo sombras, sin líneas de contorno.',
        'Dibuja 3 bocas: de frente, de tres cuartos y sonriendo.',
        'En cada una marca qué plano mira hacia la luz y cuál hacia abajo.',
      ],
      pregunta: '¿Contorneo los rasgos con líneas porque no sé dónde poner las sombras?',
      nota: 'Se repite que "la nariz es lo más difícil". Lo difícil es que casi no tiene bordes y obliga a pensar en planos y valores; cuando entiendes la luz (módulo 4), se vuelve más fácil. Tampoco hay narices o bocas "correctas": las formas cambian mucho entre personas y edades, y copiarlas tal cual es lo que da el parecido.',
      recordar: [
        ['¿Qué partes tiene la nariz como bloque?', 'El puente, los lados, la punta y la base.'],
        ['¿Por qué la base de la nariz casi siempre está a la sombra?', 'Porque mira hacia el piso, lejos de la luz.'],
        ['¿Por qué el labio de arriba suele ser más oscuro?', 'Porque mira hacia abajo, lejos de la luz.'],
        ['¿Por qué no contornear los labios?', 'Porque se ven de caricatura; el borde lo marca el cambio de valor.'],
      ],
      tarjetas: [
        ['Nariz', 'Bloque con puente, lados, punta y base a la sombra. Sombras, no líneas.'],
        ['Boca', 'Sobre el cilindro de los dientes. Labio de arriba oscuro, el de abajo con luz y sombra debajo.'],
        ['Sin contorno', 'En el retrato con valores, el borde lo hace el cambio de tono, no una línea.'],
      ],
      feynman: 'Explícale a un niño de 12 años cómo se dibuja una nariz sin hacerle líneas, sin usar las palabras "plano" ni "valor".',
      reto: 'Con una lámpara de lado, haz una foto de tu nariz y tu boca y dibújalas en 30 minutos solo con sombras. Luego mira tu dibujo de lejos: si se ve sin las líneas, lo lograste.',
    }),
    l('Orejas, pelo y cuello', 10, {
      idea: 'El pelo no se dibuja pelo por pelo: se dibuja como masas con luz y sombra, y solo al final unos cuantos mechones sueltos. La oreja es una forma de signo de interrogación con planos, y el cuello sale inclinado hacia adelante, no como un tubo recto.',
      bloques: [
        ['La oreja', [
          'Va entre la línea de las cejas y la base de la nariz, en el plano lateral de la cabeza.',
          'Su forma es como un signo de interrogación: el borde de afuera (hélix) y una forma en "Y" adentro (antihélix).',
          'De frente casi no se ve: es una franja angosta pegada a la cabeza. De perfil se inclina más o menos como la mandíbula.',
        ]],
        ['El pelo en masas', [
          'Entrecierra los ojos: el pelo se ve como dos o tres masas grandes (la parte con luz y la parte en sombra), no como hilos.',
          'Primero el volumen del pelo sobre el cráneo (el pelo tiene grosor y sobresale de la cabeza), después las masas, al final algunos mechones.',
          'Dibuja en la dirección en que crece y cae el pelo; deja los brillos como bandas que siguen la forma de la cabeza.',
          'Donde el pelo toca la frente el borde es suave; si lo marcas duro parece una peluca.',
        ]],
        ['El cuello', [
          'Visto de lado, el cuello sale inclinado hacia adelante y la nuca empieza más arriba que la garganta.',
          'Dos músculos grandes (los esternocleidomastoideos) van de detrás de cada oreja al centro, entre las clavículas, y forman una "V".',
          'El cuello es casi tan ancho como la mandíbula; si lo haces muy delgado, la cabeza parece flotar.',
        ]],
      ],
      ejemplos: [
        'Tu sobrino tiene el pelo crespo y pasas una hora dibujando rizo por rizo; de lejos se ve como una mancha pareja sin volumen. Repites con dos masas (luz arriba, sombra abajo) y unos pocos rizos en el borde: se ve más real en 15 minutos.',
        'Haces a tu papá de perfil con el cuello recto como un tubo y parece rígido. Al inclinar el cuello hacia adelante y marcar la "V" de los músculos, se ve natural.',
      ],
      practica: [
        'Dibuja tu oreja (con dos espejos o una foto) en 10 minutos.',
        'Haz 3 estudios de pelo de fotos: solo masas de luz y sombra, sin un solo pelo suelto.',
        'Dibuja un cuello de perfil marcando su inclinación y la "V" de los músculos.',
      ],
      pregunta: '¿Gasto tiempo en detalles (pelos, pestañas) antes de tener bien las masas grandes?',
      nota: 'Se cree que el realismo está en el detalle: dibujar cada pelo, cada poro. En realidad, de lejos lo que se lee como real son las masas de valor bien puestas; el exceso de detalle aplana el dibujo. Los maestros resolvían el pelo con pocas masas y unos cuantos trazos.',
      recordar: [
        ['¿Entre qué líneas va la oreja?', 'Entre la de las cejas y la base de la nariz.'],
        ['¿Cómo se dibuja el pelo?', 'En masas de luz y sombra; los mechones sueltos solo al final.'],
        ['¿Cómo sale el cuello visto de lado?', 'Inclinado hacia adelante; la nuca empieza más arriba que la garganta.'],
        ['¿Qué forman los músculos esternocleidomastoideos?', 'Una "V" desde detrás de las orejas hasta entre las clavículas.'],
      ],
      tarjetas: [
        ['Pelo', 'Masas de luz y sombra, con volumen sobre el cráneo. Unos pocos mechones al final.'],
        ['Oreja', 'Signo de interrogación entre cejas y nariz; de frente, una franja angosta.'],
        ['Cuello', 'Inclinado hacia adelante, ancho como la mandíbula, con la "V" de los músculos.'],
      ],
      feynman: 'Explícale a un niño de 12 años por qué no hay que dibujar el pelo hilo por hilo, sin usar las palabras "masa" ni "valor".',
      reto: 'Dibuja el pelo de alguien en 3 versiones: 2 minutos, 10 minutos y 30 minutos. Compáralas de lejos: ¿cuánto agregó de verdad la versión larga?',
    }),
  ],
  comprobacion: 'Lo dominas si, sin mirar, puedes dibujar un ojo partiendo del globo, una nariz y una boca sin contornos, una oreja en su sitio y el pelo en masas, todo ubicado sobre la estructura de la cabeza.',
};

// ---------- Módulo 4 ----------
const LUZ = {
  titulo: 'Luz, valor y el retrato completo',
  objetivo: 'Usar la luz y los valores para dar volumen, manejar los bordes y seguir un proceso completo de retrato, con una práctica que te haga mejorar semana a semana.',
  fuentes: [
    ['Gurney, J. (2010). Color and Light: A Guide for the Realist Painter. Andrews McMeel.', 'Cómo cae la luz sobre las formas: luz, sombra, núcleo, reflejos y bordes.'],
    ['Speed, H. (1913). The Practice and Science of Drawing. Seeley, Service & Co.', 'Ver en masas de valor y trabajar de lo general a lo particular.'],
    ['Livingstone, M. (2002). Vision and Art: The Biology of Seeing. Harry N. Abrams.', 'Por qué el valor (claro-oscuro) da más volumen que el color o la línea.'],
    ['Ericsson, K. A., Krampe, R. T. y Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363-406.', 'La práctica deliberada: con metas claras, retroalimentación y un poco por encima del nivel.'],
    ['Macnamara, B. N., Hambrick, D. Z. y Oswald, F. L. (2014). Deliberate practice and performance in music, games, sports, education, and professions: A meta-analysis. Psychological Science, 25(8), 1608-1618.', 'La práctica pesa mucho, pero no lo explica todo.'],
    ['Chamberlain, R. y Wagemans, J. (2016). The genesis of errors in drawing. Neuroscience & Biobehavioral Reviews, 65, 195-207.', 'Cómo se corrigen los errores de percepción con práctica y comparación.'],
  ],
  lecciones: [
    l('La luz sobre la forma y los valores', 12, {
      idea: 'Antes de leer: mira una pelota con una lámpara de lado y busca la parte más oscura. No está en el borde, sino un poco adentro: es el núcleo de sombra, y entre él y el borde hay luz reflejada. El volumen se dibuja con valores (qué tan claro u oscuro), y eso pesa más que la línea.',
      figuras: [FIG_LUZ, FIG_VALORES],
      bloques: [
        ['Las zonas de la luz', [
          'Luz: la parte que mira hacia la lámpara. Dentro está el brillo, el punto más claro.',
          'Medio tono: donde la forma empieza a girar y recibe menos luz.',
          'Núcleo de sombra (o terminador): la franja donde la forma deja de recibir luz. Es lo más oscuro de la sombra propia.',
          'Luz reflejada: dentro de la sombra, cerca del borde, la luz que rebota del piso o la ropa. Siempre más oscura que cualquier luz.',
          'Sombra proyectada: la que el objeto tira sobre otra superficie (la nariz sobre la mejilla). Su borde es más duro cerca del objeto.',
        ]],
        ['Dos familias', [
          'Todo en la luz es más claro que todo en la sombra. Si un reflejo en la sombra queda tan claro como la luz, el volumen se rompe.',
          'Entrecierra los ojos: los detalles desaparecen y ves las dos familias como manchas.',
          'Empieza separando la luz de la sombra con una sola mancha de valor medio; después afinas.',
        ]],
        ['La escala de valores', [
          'Trabaja con una escala de 5 valores: 1 la luz más clara (el papel), 3 el medio, 5 lo más oscuro.',
          'Antes de sombrear, decide a qué valor de la escala se parece cada zona del modelo, comparando dos zonas a la vez: "¿esta mejilla es más clara o más oscura que la frente?".',
          'El ojo juzga los valores por contraste con lo que tienen al lado; por eso hay que comparar, no adivinar.',
        ]],
      ],
      ejemplos: [
        'En tu retrato, la mejilla de la sombra te quedó con mucho reflejo y casi tan clara como la de la luz: la cara se ve plana. Al oscurecer todo el lado de sombra un paso, para que quede claramente más oscuro que la luz, la cara gira.',
        'Contraejemplo: con luz difusa (un día nublado, sin una fuente clara) las zonas casi no se distinguen y el retrato depende más de los valores locales (el pelo oscuro, la piel clara). Por eso para aprender conviene una luz de lado.',
      ],
      practica: [
        'Dibuja una pelota o un huevo con una lámpara de lado y marca las cinco zonas.',
        'Haz una escala de 5 valores con tu lápiz y compárala con la figura.',
        'Toma una foto de una cara, conviértela a blanco y negro en el celular y entrecierra los ojos: dibuja solo dos manchas (luz y sombra) en 5 minutos.',
      ],
      pregunta: '¿Mis dibujos se ven planos porque mi sombra es muy clara o porque mi luz es muy oscura?',
      nota: 'Se dice que la sombra más oscura está en el borde. En una forma redonda casi siempre está en el núcleo, un poco adentro, porque la luz reflejada aclara el borde. Pero el reflejo es fácil de exagerar: si lo haces muy claro, el objeto parece de plástico o con luz por detrás. Y el ojo se engaña con los valores (un gris se ve más claro junto a uno oscuro), por eso se compara siempre de a dos.',
      recordar: [
        ['¿Cuáles son las zonas de la luz sobre una forma?', 'Luz (con el brillo), medio tono, núcleo de sombra, luz reflejada y sombra proyectada.'],
        ['¿Dónde suele estar lo más oscuro de una sombra propia?', 'En el núcleo de sombra, un poco adentro del borde.'],
        ['¿Qué regla separa las dos familias?', 'Todo lo que está en la luz es más claro que todo lo que está en la sombra.'],
        ['¿Para qué sirve entrecerrar los ojos?', 'Para quitar detalles y ver las manchas de luz y sombra.'],
      ],
      tarjetas: [
        ['Cinco zonas', 'Luz, medio tono, núcleo de sombra, luz reflejada y sombra proyectada.'],
        ['Dos familias', 'Todo en la luz más claro que todo en la sombra. El reflejo nunca tan claro como la luz.'],
        ['Valores', 'Escala de 5; compara de a dos zonas. El volumen lo dan los valores, no las líneas.'],
      ],
      feynman: 'Explícale a un niño de 12 años por qué la parte más oscura de una pelota no está en el borde, sin usar las palabras "núcleo" ni "reflejada".',
      reto: 'Dibuja tu propia cara en un espejo con una lámpara de lado usando solo 3 valores (papel, gris y oscuro), en 30 minutos. Nada de detalles: si se lee la cara, dominas las familias.',
    }),
    l('Sombrear y manejar los bordes', 10, {
      idea: 'Un retrato realista no tiene bordes iguales. Donde la forma gira de golpe o hay mucho contraste el borde es duro; donde gira despacio es suave; y donde se funde con el fondo se pierde. Controlar los bordes es lo que hace que una cara se vea viva y no recortada.',
      figuras: [FIG_BORDES],
      bloques: [
        ['El trazo', [
          'Sombrea con trazos paralelos y parejos, por capas; cambia un poco la dirección en cada capa para que no se vean rayas.',
          'Sigue la forma cuando quieras reforzar el volumen (trazos que se curvan con la mejilla); trazos rectos y parejos para manchas grandes.',
          'Para oscurecer, más capas o un lápiz más blando, no más presión.',
          'Difuminar con papel o un pañuelo empareja, pero de más deja el dibujo sucio y sin textura: úsalo poco.',
        ]],
        ['Los tres bordes', [
          'Duro: el borde de una sombra proyectada cerca del objeto, la línea entre los labios, el contorno del lado de la luz contra un fondo oscuro.',
          'Suave: el paso de la luz a la sombra en la mejilla o la frente, que giran despacio.',
          'Perdido: donde el pelo en sombra se junta con un fondo oscuro; el ojo lo completa solo.',
          'Regla práctica: el borde más duro y el contraste más fuerte van donde quieres que miren (normalmente los ojos).',
        ]],
        ['Lo que arruina el sombreado', [
          'Contornear todo con una línea oscura: aplana y recorta.',
          'Sombrear sin decidir el valor: todo queda gris medio.',
          'Pulir una zona hasta el final mientras el resto está en blanco: pierdes la comparación. Avanza en todo el dibujo a la vez.',
        ]],
      ],
      ejemplos: [
        'En tu retrato, el contorno de la cara está marcado igual de oscuro en todo el borde y parece un recorte pegado. Al dejar duro solo el borde del lado de la luz contra el fondo y suavizar el del lado de la sombra, la cara sale del papel.',
        'Contraejemplo: en una ilustración o un cómic los contornos parejos son un estilo y está bien. La regla de los bordes es para el dibujo realista.',
      ],
      practica: [
        'Haz una barra de 10 cm que pase de claro a oscuro con trazos parejos, sin difumino.',
        'Dibuja una esfera con los tres bordes: duro en la sombra proyectada, suave en el terminador y perdido contra un fondo oscuro.',
        'En un retrato viejo tuyo, señala los sitios donde todos los bordes son iguales.',
      ],
      pregunta: '¿Dónde quiero que miren en mi retrato, y ahí están mi borde más duro y mi contraste más fuerte?',
      nota: 'Mucha gente cree que el realismo es difuminar todo hasta que quede liso como una foto. El difumino de más quita textura y deja el dibujo sucio; los dibujos académicos que más impresionan suelen tener trazo visible y bordes bien elegidos. Lo que da la sensación de realidad es el valor correcto en el sitio correcto y la variedad de bordes.',
      recordar: [
        ['¿Cuáles son los tres tipos de borde?', 'Duro, suave y perdido.'],
        ['¿Dónde va el borde más duro?', 'Donde quieres que miren, normalmente los ojos, y donde la forma gira de golpe o hay mucho contraste.'],
        ['¿Cómo oscurecer sin dañar el papel?', 'Con más capas o un lápiz más blando, no apretando más.'],
        ['¿Por qué no terminar una zona antes que las demás?', 'Porque pierdes la comparación de valores con el resto del dibujo.'],
      ],
      tarjetas: [
        ['Bordes', 'Duro donde gira de golpe o hay contraste; suave donde gira despacio; perdido contra un fondo parecido.'],
        ['Donde miran', 'El borde más duro y el contraste más fuerte van en el centro de interés (los ojos).'],
        ['Sombreado', 'Capas parejas, poco difumino, todo el dibujo avanza a la vez.'],
      ],
      feynman: 'Explícale a un niño de 12 años por qué no hay que hacer una raya oscura alrededor de toda la cara, sin usar las palabras "borde" ni "contorno".',
      reto: 'Haz un retrato de 45 minutos donde elijas a propósito tres bordes perdidos y uno muy duro en el ojo más cercano. Al terminar, pregúntale a alguien a dónde mira primero.',
    }),
    l('El proceso completo y cómo practicar', 12, {
      idea: 'Un retrato se construye como una casa: cimientos (tamaño, inclinación y proporciones), estructura (la cabeza y los rasgos en su sitio), muros (las manchas de luz y sombra) y acabados (detalles y bordes). Y se aprende con muchos dibujos cortos y corregidos, no con un retrato perfecto cada mes.',
      bloques: [
        ['El proceso en 5 pasos', [
          '1. Encaje: tamaño, inclinación y contorno general con líneas rectas suaves, medido con el lápiz (10-15 min).',
          '2. Estructura: línea central, línea de los ojos, nariz, boca y orejas en su sitio; mide y corrige antes de seguir.',
          '3. Masas: separa la luz de la sombra con un valor medio parejo, entrecerrando los ojos.',
          '4. Valores: oscurece por capas comparando de a dos zonas; avanza en toda la cara a la vez.',
          '5. Acabado: bordes, oscuros más profundos, brillos con la goma y pocos detalles donde quieres que miren.',
        ]],
        ['Cómo revisar tu dibujo', [
          'Aléjate o toma una foto del dibujo y mírala pequeña en el celular: los errores de proporción saltan.',
          'Voltea el dibujo en un espejo (o la foto en el celular): la asimetría que tu ojo ya no veía aparece.',
          'Pon la foto del dibujo y la referencia en blanco y negro una al lado de la otra para comparar valores.',
        ]],
        ['La práctica que sirve', [
          'Práctica deliberada (Ericsson): metas concretas ("hoy: ojos girados"), retroalimentación inmediata y un poco por encima de tu nivel.',
          'Mezcla dibujos cortos (bocetos de 2 a 5 minutos para estructura) con estudios medianos (30 minutos para valores) y un retrato largo de vez en cuando.',
          'Guarda todo con la fecha y compara cada mes: el progreso en dibujo es lento y no se nota día a día.',
          'Con la app: ponte en 🎯 Metas una meta diaria de minutos de dibujo, como una serie más del gym.',
        ]],
      ],
      ejemplos: [
        'Llevas un mes haciendo un retrato largo cada domingo y sientes que no mejoras. Cambias a 15 minutos diarios: 3 bocetos de estructura de 2 minutos y un estudio de 10 minutos de un rasgo. A las cuatro semanas, tus encajes salen mejor a la primera.',
        'Terminas el retrato de tu mamá y "algo no cuadra". Lo volteas en el espejo y ves que la boca está inclinada hacia la izquierda. Lo corriges en 5 minutos lo que habías mirado una hora sin ver.',
      ],
      practica: [
        'Escribe tu plan de práctica de la semana: cuántos minutos al día y qué meta concreta cada día.',
        'Haz un retrato de 30 minutos siguiendo los 5 pasos y marca el tiempo de cada uno.',
        'Revísalo con los tres trucos (lejos, espejo, blanco y negro) y anota los tres errores principales.',
      ],
      pregunta: '¿Practico para pasar el rato o con una meta concreta y una forma de saber si mejoré?',
      nota: 'Se repite la "regla de las 10.000 horas" como si bastara con acumular horas. Ericsson estudió práctica deliberada (con metas, retroalimentación y corrección), no horas sueltas, y un metaanálisis de Macnamara y colegas (2014) encontró que la práctica explica una parte importante del desempeño, pero no todo. En dibujo, mil horas copiando sin corregir enseñan menos que cien comparando y corrigiendo.',
      recordar: [
        ['¿Cuáles son los 5 pasos del proceso?', 'Encaje, estructura, masas, valores y acabado.'],
        ['Nombra dos trucos para revisar el dibujo.', 'Alejarse o verlo pequeño en una foto; voltearlo en un espejo; compararlo en blanco y negro con la referencia.'],
        ['¿Qué hace "deliberada" a la práctica?', 'Metas concretas, retroalimentación inmediata y un nivel un poco por encima del tuyo.'],
        ['¿Por qué mezclar dibujos cortos y largos?', 'Los cortos entrenan la estructura muchas veces; los largos, los valores y el acabado.'],
      ],
      tarjetas: [
        ['Proceso', 'Encaje → estructura → masas → valores → acabado. Nunca detalles antes de tiempo.'],
        ['Revisar', 'De lejos, en el espejo y en blanco y negro junto a la referencia.'],
        ['Práctica deliberada', 'Meta concreta, corrección inmediata, un poco por encima de tu nivel. No horas sueltas.'],
      ],
      feynman: 'Explícale a un niño de 12 años en qué orden se hace un retrato y por qué no se empieza por los ojos, sin usar las palabras "encaje" ni "valores".',
      reto: 'Durante una semana, haz cada día 3 bocetos de 2 minutos y un estudio de 10 minutos de la misma persona (de fotos distintas). El séptimo día, compáralos con el dibujo de memoria de la primera lección.',
    }),
  ],
  comprobacion: 'Lo dominas si, sin mirar, puedes seguir los 5 pasos en un retrato de una hora con luz de lado, usar al menos tres bordes distintos a propósito y revisar tu dibujo con los tres trucos para encontrar y corregir tus errores.',
};

export default {
  id: 'retrato-realista',
  nombre: 'Retrato realista a lápiz',
  area: 'arte',
  icono: '✏️',
  nivel: 'Básico',
  paraQue: 'Dibujar una cara que se parezca a la persona, a lápiz y desde cero: medir, construir la cabeza, ubicar los rasgos y darles volumen con la luz. Sirve para retratar a tu familia, empezar a dibujar del natural o como un pasatiempo que entrena la paciencia y la mirada.',
  ancla: 'Un retrato se construye como una casa: primero los cimientos y la estructura (proporciones y la cabeza como volumen), después los muros (las manchas de luz y sombra) y al final los acabados (los detalles). Si pintas la ventana antes de levantar la pared, queda torcida: lo mismo pasa si dibujas el ojo perfecto antes de saber dónde va.',
  principios: [
    'Dibuja lo que ves, no lo que sabes: el cerebro cambia lo que mira por símbolos, y medir y comparar lo corrige.',
    'De lo general a lo particular: tamaño e inclinación, después la estructura, después las masas y al final los detalles.',
    'Las proporciones se miden, no se adivinan: una unidad, ángulos y plomadas, y el promedio solo como punto de partida.',
    'La cabeza es un volumen: una esfera con planos sobre la que se apoyan los rasgos y que gira como un todo.',
    'El volumen lo da la luz: todo en la luz más claro que todo en la sombra, y el valor pesa más que la línea.',
    'Se mejora con práctica deliberada: dibujos cortos con una meta, revisados y corregidos.',
  ],
  ochenta: 'El 20 % que da el 80 %: medir con el lápiz (sobre todo la ubicación de los ojos en la mitad de la cabeza y el tamaño total), separar la luz de la sombra en dos familias y revisar el dibujo de lejos y en el espejo. Con eso, un retrato ya se parece aunque los detalles sean pocos; sin eso, ningún detalle lo salva.',
  diagnostico: [
    ['¿En qué parte de la cabeza van los ojos en un adulto?', 'En la mitad de la cabeza, de la coronilla al mentón (no en el tercio de arriba).'],
    ['En una pelota con luz de lado, ¿dónde está la parte más oscura de la sombra propia y por qué?', 'En el núcleo de sombra, un poco adentro del borde, porque cerca del borde llega luz reflejada.'],
    ['Tu retrato está bien medido pero se ve plano y recortado. ¿Qué cambiarías?', 'Separar mejor las familias de luz y sombra (la sombra más oscura que toda la luz) y variar los bordes: suavizar los del lado de la sombra y dejar duro solo el borde del centro de interés, sin contornear todo.'],
  ],
  modulos: [VER, ESTRUCTURA, RASGOS, LUZ],
  proyecto: {
    titulo: 'El retrato de alguien que quieres, en 4 semanas',
    intro: 'Vas a hacer el retrato a lápiz de una persona de tu familia, desde una foto que tomes tú con buena luz, y vas a documentar el proceso para ver cuánto mejoraste desde el dibujo de memoria del primer día.',
    pasos: [
      'Semana 1: toma 5 fotos de la persona con luz de ventana de un solo lado, a la altura de sus ojos y sin flash. Elige la mejor.',
      'Haz 10 bocetos de 2 minutos de la foto (solo estructura) y 2 estudios de 15 minutos de sus rasgos más difíciles.',
      'Semana 2: encaje y estructura del retrato definitivo, midiendo con el lápiz; revisa en el espejo y corrige antes de sombrear.',
      'Escribe las tres diferencias de su cara con las proporciones promedio y verifica que estén en el dibujo.',
      'Semana 3: masas de luz y sombra y valores por capas, en toda la cara a la vez.',
      'Semana 4: bordes, oscuros profundos, brillos y detalles solo en los ojos y donde quieras que miren.',
      'Toma una foto del retrato en blanco y negro junto a la referencia y anota qué mejorarías en el siguiente.',
      'Pon lado a lado el dibujo de memoria del primer día y el retrato final, con las fechas.',
    ],
  },
};
