// ⚡ Energía: prácticas cortas para subir (o bajar) la energía según el momento del día. Sin pantalla, para poder probarlo.
// Las 8 primeras vienen de un video de WhatsApp ("8 hábitos que suben tu frecuencia"): se dejan con lo que sí se sabe y, cuando
// el video exagera o se equivoca, una nota "Ojo". Lo que el video llama "frecuencia" es el estado del sistema nervioso:
// activado (alerta, tenso) o en calma, y se cambia con el cuerpo: respiración, luz, movimiento, comida y sueño.
// Guardado: dias[fecha].energia = { id: true } (lo hecho ese día) · config.energiaFav = [ids]
// La pantalla está en src/react/pantallas/Energia.tsx
import { e, guardar, dia } from './estado.js';
import { iso, sumarDias } from './fechas.js';

export const MOMENTOS = {
  despertar: '🌅 Al despertar', manana: '☀️ En la mañana', dia: '🏢 Durante el día', tarde: '🪫 Bajón de la tarde',
  entreno: '⚽ Antes de entrenar o jugar', noche: '🌙 En la noche', tenso: '😤 Tenso o con rabia',
};
// p: práctica { id, ic, t (título), min, m: [momentos], pasos, porque (lo que sí se sabe), ojo? (lo que el video exagera), video? }
const p = (id, ic, t, min, m, pasos, porque, extra = {}) => ({ id, ic, t, min, m, pasos, porque, ...extra });

export const PRACTICAS = [
  // ---------- 🎬 Las 8 del video ----------
  p('tararear', '🎶', 'Tararea 2 minutos', 2, ['tenso', 'dia', 'noche'],
    ['Cierra la boca y relaja la mandíbula.', 'Inhala por la nariz y, al soltar el aire, haz un "mmm" grave y largo.', 'Siente la vibración en el pecho y la cabeza. Repite 2 minutos.'],
    'Soltar el aire despacio (más largo que al tomarlo) baja el pulso y calma el sistema nervioso; tararear obliga a exhalar largo. También abre la nariz y sube el óxido nítrico nasal.',
    { video: 1, ojo: 'No "libera emociones estancadas": te calma, que ya es bastante.' }),
  p('muestrame', '🌌', 'Antes de dormir: "Muéstrame lo que necesito ver"', 3, ['noche'],
    ['Acostado, piensa en la pregunta que te tiene dando vueltas.', 'Di (o piensa): "Muéstrame lo que necesito ver esta noche" y suéltala.', 'Al despertar, antes del celular, escribe lo primero que recuerdes o se te ocurra.'],
    'Mientras duermes el cerebro sigue ordenando lo que viviste, y al despertar las ideas llegan más sueltas. Escribirlas antes de mirar el celular las atrapa.',
    { video: 2, ojo: 'No llegan "señales": las respuestas salen de tu propia cabeza, descansada. Igual sirve.' }),
  p('gratitud', '🤲', '20 segundos de gratitud', 1, ['despertar', 'noche', 'tenso'],
    ['Pon la mano en el pecho.', 'Durante 20 segundos piensa en algo concreto que agradeces hoy (el café, el sol, un partido, alguien).', 'Siéntelo, no solo lo pienses.'],
    'Practicar la gratitud de forma constante mejora el ánimo y el sueño en varios estudios. La mano en el pecho y respirar lento ayudan a calmarte.',
    { video: 3, ojo: '20 segundos no cambian el cuerpo de golpe: lo que suma es hacerlo todos los días.' }),
  p('futuro6', '🔭', 'Imagina a tu yo de dentro de 6 meses', 3, ['manana', 'despertar'],
    ['Cierra los ojos 3 minutos.', 'Imagina cómo camina, habla, come y entrena el Diego de dentro de 6 meses, y cómo reacciona cuando algo lo molesta.', 'Luego imagina lo que hizo HOY para llegar ahí: la comida, el gym, el trabajo.'],
    'Ver a tu yo futuro como alguien cercano ayuda a tomar mejores decisiones hoy (ahorrar, comer mejor). Imaginar los pasos, y no solo el final, es lo que más ayuda a cumplir.',
    { video: 4, ojo: 'El cerebro sí distingue lo imaginado de lo real. Imaginar solo el resultado puede quitarte las ganas de hacer el esfuerzo: imagina también el camino.' }),
  p('sol', '🌞', 'Luz del sol en la mañana', 10, ['despertar', 'manana'],
    ['En la primera hora después de despertar, sal 5 a 10 minutos al aire libre (con nubes, 15-20).', 'Sin gafas de sol y sin mirar el sol directamente.', 'Si puedes, camina mientras tanto.'],
    'La luz de la mañana ajusta el reloj del cuerpo: más alerta en el día y más sueño en la noche, a la hora que es.',
    { video: 5, ojo: 'El video dice "2 minutos con los ojos cerrados para estimular la pineal": eso no es así. Lo que funciona es la luz que entra con los ojos abiertos (sin mirar el sol), y unos minutos más.' }),
  p('ira', '🔥', 'La rabia se mueve, no se golpea', 5, ['tenso'],
    ['Nómbrala: "estoy con rabia por…". Ponerle nombre ya la baja.', 'Muévete sin pensar en la persona: 5 minutos caminando rápido, sprints, saltar la cuerda o el gym.', 'Respira con exhalaciones largas y, cuando estés más tranquilo, escribe qué pasó y qué quieres hacer.'],
    'Moverse gasta la energía de la rabia, y ponerle nombre a lo que sientes baja la reacción del cuerpo.',
    { video: 6, ojo: 'El video dice que golpees y le grites a una almohada. Está estudiado y es al revés: desahogarse con agresión mantiene viva la rabia o la aumenta. Si la rabia te lleva a hacer daño, busca ayuda.' }),
  p('despacio', '🐌', 'Lo que haces rápido, hazlo despacio', 10, ['dia', 'tenso'],
    ['Elige una cosa del día: comer, caminar o hablar.', 'Hazla a la mitad de velocidad. Si es comer, suelta el cubierto entre bocados.', 'Nota la respiración y los hombros: que bajen.'],
    'Ir con prisa todo el día mantiene el cuerpo en alerta. Comer despacio, además, te llena con menos comida: te sirve para la dieta.',
    { video: 7 }),
  p('yofuturo', '🌠', 'Antes de dormir, sé tu yo futuro un rato', 3, ['noche'],
    ['Acostado, ponte en el lugar de esa versión tuya: la postura, la calma, cómo piensa.', 'Pregúntale qué haría mañana a primera hora.', 'Decide UNA cosa concreta para mañana y déjala anotada.'],
    'Ensayar en la mente lo que vas a hacer sí ayuda a hacerlo (los deportistas lo usan). Terminar con una acción concreta es lo que lo vuelve útil.',
    { video: 8, ojo: '"Esa versión ya existe" es una frase bonita, no un hecho: existe si haces lo que decidiste.' }),

  // ---------- 🌅 Al despertar ----------
  p('primera', '📵', 'Los primeros 30 minutos sin celular', 30, ['despertar'],
    ['Deja el celular lejos de la cama (usa un despertador o déjalo cargando en otro lado).', 'Primero: agua, luz, baño, moverte.', 'Lo abres después de la primera tarea o del desayuno.'],
    'Lo primero que haces marca el día: arrancar con mensajes y redes te pone en modo reacción y te roba la mañana.',
    { ojo: 'El video habla de una "ventana theta" de un minuto en la que el cerebro toma todo como orden: eso es exagerado. Lo útil es no regalarle el arranque del día a la pantalla.' }),
  p('aguadesp', '💧', 'Un vaso grande de agua al despertar', 1, ['despertar'],
    ['Deja un vaso o botella de agua al lado de la cama.', 'Tómatelo antes del café.'],
    'Después de 7-8 horas sin tomar nada, un poco de deshidratación ya baja la concentración y el ánimo.'),
  p('cama', '🛏️', 'Tiende la cama y abre la ventana', 2, ['despertar'],
    ['Apenas te levantes, tiende la cama.', 'Abre la cortina o la ventana para que entre luz y aire.'],
    'Una primera tarea fácil y terminada arranca el día con sensación de avance, y la luz te despierta.'),
  p('fria', '🚿', 'Termina la ducha con 30-60 segundos de agua fría', 1, ['despertar', 'manana'],
    ['Báñate normal.', 'Al final, pon el agua fría 30 a 60 segundos, respirando lento.', 'Empieza por 15 segundos si te cuesta.'],
    'El agua fría sube de golpe la alerta y el ánimo por un buen rato.',
    { ojo: 'No la hagas justo después del gym si buscas ganar músculo: puede frenar un poco la adaptación. Mejor en la mañana.' }),
  p('movilidad', '🤸', '5 minutos de movilidad', 5, ['despertar', 'dia'],
    ['Círculos de cuello, hombros y cadera (10 de cada uno).', 'Gato-vaca en el piso 10 veces.', '10 sentadillas lentas y 10 zancadas por pierna.'],
    'Mover las articulaciones sube la circulación y te quita la rigidez de la noche; las piernas te lo agradecen después del fútbol.'),

  // ---------- ☀️ En la mañana ----------
  p('caminata', '🚶', 'Camina 10 minutos al aire libre', 10, ['manana', 'tarde'],
    ['Sal sin audífonos o con una canción que te guste.', 'Paso rápido, mirando lejos (no el celular).'],
    'Caminar con luz natural sube la energía y el ánimo más que un café, y suma pasos para la meta de peso.'),
  p('desayuno', '🍳', 'Desayuno con 30 g de proteína', 10, ['manana'],
    ['Por ejemplo: 3 huevos, o yogur griego con avena, o arepa con huevo y queso.', 'Suma una fruta.'],
    'La proteína en el desayuno mantiene la energía estable y quita el hambre de media mañana mejor que el pan o el dulce solo.'),
  p('cafe', '☕', 'El café, mejor después de desayunar y antes de las 2 p. m.', 1, ['manana'],
    ['Toma primero agua y desayuna.', 'Último café a más tardar a las 2 p. m.'],
    'La cafeína dura horas en el cuerpo: un café en la tarde te puede quitar sueño profundo aunque te duermas, y al otro día tienes menos energía.'),
  p('dificil', '🎯', 'La tarea más difícil, primero', 60, ['manana'],
    ['Antes de abrir el correo o WhatsApp, elige la tarea más importante del día.', 'Trabaja en ella 60 a 90 minutos, con el celular en otro lado.'],
    'En la mañana la mente está más fresca; dejar lo difícil para después hace que lo arrastres todo el día y cansa más que hacerlo.'),
  p('tres', '📝', 'Escribe las 3 cosas del día', 2, ['manana', 'despertar'],
    ['En un papel o en la app: las 3 cosas que, si las haces hoy, el día valió la pena.', 'Solo 3.'],
    'Tener claro qué importa quita la sensación de estar atrasado, que es de lo que más cansa.'),

  // ---------- 🏢 Durante el día ----------
  p('suspiro', '😮‍💨', 'Suspiro fisiológico (3 veces)', 1, ['tenso', 'dia', 'entreno'],
    ['Toma aire por la nariz.', 'Sin soltarlo, toma otro poquito más por la nariz.', 'Suéltalo todo, largo y despacio, por la boca. Repite 3 veces.'],
    'Es de las formas más rápidas de bajar el estrés que se han estudiado: en uno o dos minutos baja el pulso.'),
  p('caja', '⬜', 'Respiración en caja 4-4-4-4', 3, ['tenso', 'dia', 'entreno'],
    ['Inhala contando 4.', 'Sostén 4.', 'Exhala 4.', 'Sostén 4. Repite 3 minutos.'],
    'Respirar a un ritmo lento y parejo calma y enfoca a la vez. La usan los militares y los deportistas antes de competir.'),
  p('pausa90', '⏸', 'Pausa de 5 minutos cada 90 minutos', 5, ['dia', 'tarde'],
    ['Pon una alarma cada 90 minutos de trabajo.', 'Párate, mira lejos por la ventana, toma agua, camina.', 'Sin celular en la pausa.'],
    'La concentración baja después de 60-90 minutos seguidos: una pausa corta y de verdad la recupera; una pausa mirando redes no.'),
  p('aguadia', '🥤', 'Un vaso de agua cada 2 horas', 1, ['dia', 'tarde'],
    ['Ten la botella a la vista.', 'Un vaso cada 2 horas, más en los días de gym o fútbol.'],
    'Con solo un 1-2 % de deshidratación ya aparecen cansancio, dolor de cabeza y antojos que parecen hambre.'),
  p('escaleras', '🪜', '1 minuto de escaleras o 20 sentadillas', 1, ['dia', 'tarde'],
    ['Sube y baja escaleras 1 minuto, o haz 20 sentadillas al lado del escritorio.'],
    'Un "snack de ejercicio" corto sube la circulación y la alerta enseguida, y cortar el tiempo sentado ayuda al azúcar en sangre.'),
  p('postura', '🧍', 'Párate derecho y abre el pecho', 1, ['dia', 'entreno'],
    ['Pies firmes, hombros atrás y abajo, mirada al frente.', 'Respira lento 1 minuto así.'],
    'Una postura abierta te hace sentir más alerta y seguro que una encorvada.',
    { ojo: 'Lo de que "cambia las hormonas en 2 minutos" no se confirmó en estudios grandes; la sensación sí cambia.' }),
  p('cancion', '🎵', 'Una canción que te encante, moviéndote', 4, ['dia', 'tarde', 'entreno'],
    ['Ponte audífonos y elige una canción que te prenda.', 'Muévete, canta o al menos marca el ritmo.'],
    'La música que te gusta sube el ánimo y la energía; si además te mueves, el efecto es mayor.'),
  p('llamar', '📞', 'Habla 5 minutos con alguien que quieres', 5, ['dia', 'tarde', 'tenso'],
    ['Llama (no escribas) a alguien con quien te sientas bien.', 'Pregúntale cómo está y cuéntale algo bueno tuyo.'],
    'El contacto con la gente que quieres es de lo que más recarga el ánimo; una llamada corta vale más que muchos mensajes.'),
  p('orden5', '🧹', 'Ordena un espacio 5 minutos', 5, ['dia', 'tarde'],
    ['Pon una alarma de 5 minutos.', 'Ordena solo un lugar: el escritorio, la mesa o el maletín del gym.'],
    'El desorden a la vista distrae y cansa; terminar algo pequeño da energía para lo siguiente.'),

  // ---------- 🪫 Bajón de la tarde ----------
  p('siesta', '😴', 'Siesta de 10 a 20 minutos (antes de las 3 p. m.)', 20, ['tarde'],
    ['Pon alarma de 20 minutos.', 'Acuéstate o recuéstate con los ojos cerrados aunque no te duermas.', 'Si puedes, toma un café justo antes: hace efecto cuando despiertas.'],
    'Una siesta corta recupera la alerta sin la pesadez de una larga, y no daña el sueño de la noche si es temprano.'),
  p('nsdr', '🧘', 'Descanso profundo sin dormir (10 minutos)', 10, ['tarde', 'noche', 'tenso'],
    ['Acostado, ojos cerrados.', 'Recorre el cuerpo de los pies a la cabeza soltando cada parte.', 'Exhala largo. Puedes poner un audio de "yoga nidra" o "NSDR".'],
    'Relajar el cuerpo así repone energía cuando no puedes dormir siesta y ayuda a bajar el estrés acumulado.'),
  p('snack', '🍌', 'Proteína + fruta en vez de dulce', 5, ['tarde'],
    ['Cambia el dulce o el paquete por: yogur con fruta, queso con fruta, un batido o un huevo con arepa.'],
    'El dulce solo sube el azúcar y luego la baja de golpe: más sueño. Con proteína la energía se queda estable, y te ayuda con la dieta.'),
  p('caminaalmuerzo', '🚶‍♂️', 'Camina 10 minutos después de almorzar', 10, ['tarde'],
    ['Apenas termines de almorzar, camina 10 minutos, aunque sea dentro del edificio.'],
    'Caminar después de comer baja el pico de azúcar en sangre y quita buena parte del sueño de la tarde.'),
  p('caraagua', '💦', 'Agua fría en la cara y las muñecas', 1, ['tarde', 'tenso'],
    ['Echa agua fría en la cara 3 o 4 veces y en las muñecas.', 'Respira lento mientras tanto.'],
    'El agua fría en la cara activa un reflejo que baja el pulso y te despeja al instante.'),

  // ---------- ⚽ Antes de entrenar o jugar ----------
  p('calentamiento', '🔥', 'Calentamiento dinámico de 8 minutos', 8, ['entreno'],
    ['2 minutos de trote suave o saltar la cuerda.', 'Rodillas arriba, talones atrás, zancadas, giros de cadera.', '3 aceleraciones cortas a medio ritmo.'],
    'Sube la temperatura del músculo, rindes más y baja el riesgo de lesión, sobre todo en el fútbol.'),
  p('carbos', '🍚', 'Carbos 2-3 horas antes del partido o del gym', 15, ['entreno'],
    ['Arroz, papa, pasta, arepa o pan, con algo de proteína y poca grasa.', 'Si comes 1 hora antes, que sea poco: un banano o pan.'],
    'Los carbos son la gasolina del esfuerzo intenso: sin ellos llegas sin piernas al segundo tiempo.'),
  p('frases', '🗣️', '3 frases clave antes de empezar', 1, ['entreno'],
    ['Elige 3 frases cortas de lo que quieres hacer hoy: "presiono rápido", "técnica limpia", "sin miedo".', 'Repítelas mientras calientas.'],
    'Hablarse en instrucciones cortas mejora el rendimiento y quita nervios; está estudiado en deportistas.'),
  p('sprints', '⚡', '2 o 3 arranques cortos para despertar', 2, ['entreno'],
    ['Después de calentar, haz 2 o 3 arranques de 10 metros a buena velocidad.', 'Descansa 30 segundos entre cada uno.'],
    'Prender el sistema nervioso con esfuerzos cortos te deja más rápido y fuerte para lo que sigue.'),

  // ---------- 🌙 En la noche ----------
  p('pantallas', '🔅', 'Luz baja y pantallas fuera 1 hora antes de dormir', 60, ['noche'],
    ['Una hora antes de acostarte, baja las luces de la casa.', 'Celular fuera de la cama; si lo usas, brillo al mínimo y modo noche.'],
    'La luz fuerte en la noche le dice al cuerpo que aún es de día y retrasa el sueño; y dormir bien es la base de toda la energía.'),
  p('descarga', '🗒️', 'Escribe lo pendiente de mañana', 5, ['noche', 'tenso'],
    ['Antes de dormir, escribe todo lo que tienes pendiente para mañana.', 'Saca de la cabeza lo que te tiene dando vueltas.'],
    'En un estudio, quienes escribían su lista de pendientes antes de dormir se dormían más rápido que quienes escribían lo que ya habían hecho.'),
  p('478', '🌬️', 'Respiración 4-7-8 (4 veces)', 2, ['noche', 'tenso'],
    ['Inhala por la nariz contando 4.', 'Sostén 7.', 'Exhala por la boca contando 8, como soplando.', 'Repite 4 veces.'],
    'La exhalación larga activa la parte del sistema nervioso que calma y prepara para dormir.'),
  p('hora', '⏰', 'Acuéstate y levántate a la misma hora', 1, ['noche', 'despertar'],
    ['Elige una hora para dormir y otra para despertar.', 'Cúmplela todos los días, también el fin de semana, con 30 minutos de margen.'],
    'El horario fijo es lo que más mejora la calidad del sueño; dormir hasta tarde el fin de semana es como un "jet lag" cada lunes.'),
  p('bano', '🛁', 'Baño caliente 1-2 horas antes de dormir', 10, ['noche'],
    ['Báñate con agua caliente (no hirviendo) 10 minutos, entre 1 y 2 horas antes de acostarte.'],
    'Al salir, la temperatura del cuerpo baja, y esa bajada es una de las señales que dan sueño.'),
  p('cena', '🍽️', 'Cena 2 o 3 horas antes de dormir', 20, ['noche'],
    ['Cena a una hora que te deje 2-3 horas antes de acostarte.', 'Si te da hambre después, algo pequeño con proteína (yogur, queso).'],
    'Acostarse lleno empeora el sueño y la digestión; cenar temprano también ayuda a bajar de peso.'),

  // ---------- 😤 Tenso o con rabia ----------
  p('nombrar', '🏷️', 'Ponle nombre a lo que sientes', 1, ['tenso'],
    ['Di o escribe la emoción exacta: "estoy frustrado", "estoy con miedo", "estoy con rabia".', 'Agrega por qué: "porque…".'],
    'Ponerle palabras a la emoción baja la reacción del cerebro: con solo nombrarla ya pierde fuerza.'),
  p('sentidos', '🖐️', '5-4-3-2-1 con los sentidos', 2, ['tenso'],
    ['Nombra 5 cosas que ves, 4 que puedes tocar, 3 que oyes, 2 que hueles y 1 que saboreas.'],
    'Te saca de la cabeza y te trae al presente; sirve mucho cuando la ansiedad sube.'),
  p('progresiva', '💪', 'Aprieta y suelta los músculos', 5, ['tenso', 'noche'],
    ['Aprieta fuerte 5 segundos los pies y suéltalos 10 segundos.', 'Sube: piernas, abdomen, manos, brazos, hombros y cara.'],
    'Se llama relajación muscular progresiva: soltar después de apretar enseña al cuerpo a relajarse, y baja la ansiedad y el insomnio.'),
  p('exhalar', '🫁', 'Exhala el doble de lo que inhalas', 2, ['tenso', 'dia', 'noche'],
    ['Inhala contando 4.', 'Exhala contando 8, despacio.', '2 minutos.'],
    'Cuanto más larga la exhalación, más baja el pulso: es la base de casi todas las respiraciones que calman.'),
];

// ---------- Lo de cada día ----------
const hechoEl = (fecha, est = e()) => ((est.dias || {})[fecha] || {}).energia || {};
export const hechosHoy = (fecha = iso(), est = e()) => Object.keys(hechoEl(fecha, est)).filter((id) => PRACTICAS.some((x) => x.id === id));
export function marcar(id, fecha = iso()) {
  const d = dia(fecha), h = (d.energia ??= {});
  if (h[id]) delete h[id]; else h[id] = true;
  guardar();
  return !!h[id];
}
export const favoritos = (est = e()) => (est.config && est.config.energiaFav) || [];
export function alternarFavorito(id) {
  const c = e().config, l = favoritos();
  c.energiaFav = l.includes(id) ? l.filter((x) => x !== id) : [...l, id];
  guardar();
  return c.energiaFav.includes(id);
}
// Días seguidos (hasta hoy o ayer) con al menos una práctica
export function racha(hoy = iso(), est = e()) {
  let n = 0, f = hechosHoy(hoy, est).length ? hoy : sumarDias(hoy, -1);
  while (hechosHoy(f, est).length) { n++; f = sumarDias(f, -1); }
  return n;
}
// Las que más has hecho en los últimos 30 días
export function masHechas(hoy = iso(), est = e(), max = 3) {
  const c = {};
  for (let i = 0; i < 30; i++) for (const id of hechosHoy(sumarDias(hoy, -i), est)) c[id] = (c[id] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, max).map(([id, veces]) => ({ ...PRACTICAS.find((x) => x.id === id), veces }));
}

// El momento según la hora: 5-8 despertar, 8-11 mañana, 11-14 durante el día, 14-17 bajón, 17-20 entreno, 20 en adelante noche
export function momentoDe(horaDelDia) {
  const h = horaDelDia;
  return h >= 5 && h < 8 ? 'despertar' : h >= 8 && h < 11 ? 'manana' : h >= 11 && h < 14 ? 'dia' : h >= 14 && h < 17 ? 'tarde' : h >= 17 && h < 20 ? 'entreno' : 'noche';
}
// Una para ahora: del momento, que no hayas hecho hoy (azar = número entre 0 y 1, para poder probarlo)
export function unaParaAhora(horaDelDia, hechas = [], azar = Math.random()) {
  const m = momentoDe(horaDelDia), l = PRACTICAS.filter((x) => x.m.includes(m) && !hechas.includes(x.id));
  const lista = l.length ? l : PRACTICAS.filter((x) => x.m.includes(m));
  return lista[Math.floor(azar * lista.length) % lista.length];
}
