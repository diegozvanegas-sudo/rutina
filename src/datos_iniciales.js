// Datos con los que arranca la app la primera vez. Después todo vive en el celular (ver estado.js) y se puede editar.

export const HABITOS = [
  { id: 'pastilla', nombre: 'Pastilla de levotiroxina', detalle: 'En ayunas', tipo: 'pastilla' },
  { id: 'chia', nombre: 'Chía con lo demás', detalle: 'Desayuno, después del tiempo de espera', tipo: 'espera' },
  { id: 'colgarse', nombre: 'Colgarme 1 minuto', tipo: 'cuenta', segundos: 60 },
  { id: 'estirar', nombre: 'Estirar', detalle: 'Sesión guiada de la mañana', tipo: 'sesion', sesion: 'estiramiento-manana' },
  { id: 'agradecer', nombre: 'Agradecer por todo', detalle: 'Escribe 1 a 3 cosas (opcional)', tipo: 'texto' },
  { id: 'caminar', nombre: 'Caminar 1 hora', tipo: 'cronometro', segundos: 3600 },
];

export const METAS = { agua: 4000, pasos: 10000, calorias: 2400, lectura: 30 };

// Tiempo entre la pastilla y el desayuno. Ajústalo a lo que indique tu médico.
export const ESPERA = { minimo: 30, ideal: 60 };

// Descanso por defecto (segundos) según el tipo de serie
export const DESCANSOS = { Top: 210, 'Back-off': 150, Series: 105, Core: 60 };

// Series por músculo a la semana
export const OBJETIVOS = { _: [10, 20], Core: [6, 10] };

// "Top 1×4-7 · Back-off 2×8-12" -> filas registrables. "4×10 + fallo", "2×5-9", "1×1 min" también valen.
export function filasDeEsquema(esquema, descansoSeries = DESCANSOS.Series) {
  return esquema.split('·').map((parte) => {
    parte = parte.trim();
    const tipo = /^top/i.test(parte) ? 'Top' : /^back-?off/i.test(parte) ? 'Back-off' : 'Series';
    const m = parte.match(/(\d+)\s*[×x]\s*(\d+)(?:\s*-\s*(\d+))?\s*(min|s\b)?/i);
    if (!m) throw new Error('Esquema no reconocido: ' + parte);
    const factor = m[4] && /min/i.test(m[4]) ? 60 : 1;
    const min = +m[2] * factor, max = (m[3] ? +m[3] : +m[2]) * factor;
    return {
      tipo, series: +m[1], min, max,
      unidad: m[4] ? 's' : 'reps',
      fallo: /fallo/i.test(parte),
      esquema: parte.replace(/^(top|back-?off)\s*/i, ''),
      descanso: tipo === 'Series' ? descansoSeries : DESCANSOS[tipo],
    };
  });
}

function dia(id, nombre, diaSemana, calentamiento, cardio, ejercicios, previo) {
  return {
    id, nombre, diaSemana, calentamiento, cardio, previo,
    ejercicios: ejercicios.map(([nombreEj, musculo, esquema], i) => ({
      id: id + '-' + (i + 1), nombre: nombreEj, musculo, nota: '',
      filas: filasDeEsquema(esquema, musculo === 'Core' ? DESCANSOS.Core : DESCANSOS.Series)
        .map((f, j) => ({ ...f, id: id + '-' + (i + 1) + '-' + (j + 1) })),
    })),
  };
}

// diaSemana: 1 = lunes … 7 = domingo. Lun empuje, mar tirón, mié pierna A, jue descanso, vie torso A, sáb pierna B, dom descanso. Core: al final de cualquier día, se registra una vez por semana.
export const RUTINA = [
  dia('d1', 'Torso A', 5, 'torso', 'Cardio cinta 25-35 min', [
    ['Press inclinado mancuernas', 'Pecho', 'Top 1×4-7 · Back-off 2×8-12'],
    ['Remo T / hammer abierto', 'Espalda', 'Top 1×4-7 · Back-off 2×8-12'],
    ['Apertura pecho máquina', 'Pecho', 'Top 1×8-12 · Back-off 2×10-15'],
    ['Jalón al pecho', 'Espalda', '3×8-12'],
    ['Laterales máquina / posterior', 'Hombro', '4×10 + fallo'],
    ['Tríceps extensión', 'Tríceps', 'Top 1×8-12 · Back-off 2×8-12'],
    ['Bíceps polea baja / predicador', 'Bíceps', '3×8-12'],
    ['Tríceps invertido', 'Tríceps', '3×10-12'],
  ]),
  dia('d2', 'Pierna A', 3, 'pierna', 'Cardio cinta 30-35 min', [
    ['Pantorrilla unilateral', 'Pantorrilla', '4×5-8 al fallo'],
    ['Abductores', 'Abductores', 'Top 1×4-7 · Back-off 2×8-12'],
    ['Sentadilla', 'Cuádriceps', 'Top 1×8-10 · Back-off 1×8-10'],
    ['Prensa piernas', 'Cuádriceps', 'Top 1×8-10 · Back-off 2×8-12'],
    ['Isquios sentado', 'Isquios', 'Top 1×8-10 · Back-off 2×8-12'],
    ['Extensión piernas', 'Cuádriceps', '4×12-15'],
    ['Isquios acostado', 'Isquios', 'Top 1×4-7 · Back-off 3×8-12'],
  ], 'Movilidad previa 5-10 min'),
  dia('d3', 'Empuje + Bíceps', 1, 'empuje', 'Cardio cinta 30 min', [
    ['Press plano (barra/máquina)', 'Pecho', 'Top 1×4-7 · Back-off 2×8-12'],
    ['Press inclinado mancuerna', 'Pecho', '3×10-15'],
    ['Máquina laterales', 'Hombro', '4×10-15'],
    ['Aperturas', 'Pecho', 'Top 1×10-12 · Back-off 2×10-12'],
    ['Laterales mancuerna', 'Hombro', '3×12-15'],
    ['Predicador', 'Bíceps', 'Top 1×9-12 · Back-off 2×10-15'],
    ['Curl bayesiano', 'Bíceps', 'Top 1×8-10 · Back-off 2×10-15'],
    ['Martillo mancuerna', 'Bíceps', 'Top 1×8-10 · Back-off 2×8-10'],
  ]),
  dia('d5', 'Tirón + Tríceps', 2, 'tiron', 'Cardio escaladora 25 min', [
    ['Jalón polea alta', 'Espalda', 'Top 1×4-7 · Back-off 2×8-12'],
    ['Remo hammer abierto', 'Espalda', 'Top 1×4-7 · Back-off 2×8-12'],
    ['Posterior máquina', 'Deltoide posterior', 'Top 1×10-12 · Back-off 3×15-20'],
    ['Remo hammer cerrado', 'Espalda', '2×10-15'],
    ['Pullover', 'Espalda', '2×8-12'],
    ['Posterior polea', 'Deltoide posterior', '4×12-15 al fallo'],
    ['Jalón tríceps', 'Tríceps', 'Top 1×10-15 · Back-off 2×10-15'],
    ['Jalón invertido tríceps', 'Tríceps', 'Top 1×4-7 · Back-off 2×10-12'],
  ]),
  dia('d6', 'Pierna B', 6, 'pierna', 'Cardio cinta 30 min', [
    ['Pantorrilla bilateral / sissy', 'Pantorrilla', '4×12-15 al fallo'],
    ['Abductor', 'Abductores', 'Top 1×4-7 · Back-off 2×8-12'],
    ['Peso muerto rumano', 'Isquios', 'Top 1×6-9 · Back-off 2×10-12'],
    ['Isquios acostado', 'Isquios', 'Top 1×4-7 · Back-off 2×8-10'],
    ['Prensa', 'Cuádriceps', '3×12-15'],
    ['Hip thrust máquina', 'Glúteo', 'Top 1×8-10 · Back-off 2×8-10'],
    ['Isquios sentado', 'Isquios', 'Top 1×5-7 · Back-off 2×8-12'],
    ['Extensión piernas', 'Cuádriceps', '3×12-15'],
  ]),
  dia('core', 'Core', null, null, null, [
    ['Crunch', 'Core', '2×15'],
    ['Rueda abdominal', 'Core', '2×5-9'],
    ['Toes to bar', 'Core', '2×12'],
    ['Plancha', 'Core', '1×1 min'],
    ['Parabrisas', 'Core', '2×12'],
  ]),
];

export const CARDIO = 'Velocidad 3.5 · inclinación 15 · FC 125-135 (máx 150)';

// Pasos de una sesión guiada: por tiempo { seg, lados } o por repeticiones { series, reps, descanso, lados }
const t = (nombre, musculo, seg, desc, lados = false) => ({ nombre, musculo, seg, lados, desc });
const r = (nombre, musculo, series, reps, desc, lados = false, descanso = 45) => ({ nombre, musculo, series, reps, lados, descanso, desc });

export const SESIONES = [
  {
    id: 'estiramiento-manana', nombre: 'Estiramiento de la mañana', tipo: 'estiramiento', pasos: [
      t('Gato-vaca', 'Columna', 45, 'En cuatro apoyos, alterna arquear y redondear la espalda con la respiración.'),
      t('Flexor de cadera', 'Cadera', 35, 'Rodilla atrás en el piso, empuja la cadera adelante sin arquear la espalda.', true),
      t('Isquiotibiales de pie', 'Isquios', 35, 'Talón en un escalón bajo, espalda recta, inclínate desde la cadera.', true),
      t('Pecho en la pared', 'Pecho', 30, 'Antebrazo en la pared a la altura del hombro, gira el cuerpo hacia el lado contrario.', true),
      t('Rotación torácica', 'Espalda alta', 30, 'De lado en el piso, rodillas dobladas, abre el brazo de arriba hacia atrás.', true),
      t('Pantorrilla en la pared', 'Pantorrilla', 30, 'Pierna atrás estirada, talón al piso, inclínate hacia la pared.', true),
      t('Postura del niño', 'Espalda baja', 45, 'Rodillas abiertas, glúteos a los talones, brazos adelante. Respira lento.'),
    ],
  },
  {
    id: 'estiramiento-post', nombre: 'Estiramiento post-entreno', tipo: 'estiramiento', pasos: [
      t('Cuádriceps de pie', 'Cuádriceps', 35, 'Talón al glúteo, rodillas juntas, cadera adelante.', true),
      t('Isquiotibiales sentado', 'Isquios', 40, 'Pierna estirada, la otra doblada, inclínate desde la cadera.', true),
      t('Glúteo en figura 4', 'Glúteo', 40, 'Acostado, tobillo sobre la rodilla contraria, lleva la pierna al pecho.', true),
      t('Dorsal en marco de puerta', 'Espalda', 30, 'Agárrate al marco y deja caer la cadera hacia atrás y al lado.', true),
      t('Pecho y hombro', 'Pecho', 30, 'Brazo extendido en la pared detrás de ti, gira el torso.', true),
      t('Tríceps sobre la cabeza', 'Tríceps', 30, 'Codo arriba, mano a la espalda, empuja suave el codo.', true),
    ],
  },
  {
    id: 'calentamiento-torso', nombre: 'Calentamiento torso', tipo: 'calentamiento', pasos: [
      t('Cardio suave', 'General', 300, 'Cinta o elíptica a ritmo cómodo.'),
      t('Círculos de brazos', 'Hombro', 30, 'Pequeños a grandes, adelante y atrás.'),
      t('Dislocaciones con banda', 'Hombro', 45, 'Brazos estirados, pasa la banda por encima de la cabeza y atrás.'),
      t('Rotación externa con banda', 'Manguito rotador', 30, 'Codo pegado al cuerpo, gira el antebrazo hacia afuera.', true),
      t('Rotación torácica en cuatro apoyos', 'Espalda alta', 30, 'Mano en la nuca, gira el codo hacia el techo.', true),
      t('Flexiones escapulares', 'Serrato', 30, 'En plancha alta, junta y separa las escápulas sin doblar los codos.'),
    ],
  },
  {
    id: 'calentamiento-empuje', nombre: 'Calentamiento empuje', tipo: 'calentamiento', pasos: [
      t('Cardio suave', 'General', 300, 'Cinta o elíptica a ritmo cómodo.'),
      t('Círculos de brazos', 'Hombro', 30, 'Pequeños a grandes, adelante y atrás.'),
      t('Dislocaciones con banda', 'Hombro', 45, 'Brazos estirados, pasa la banda por encima de la cabeza y atrás.'),
      t('Aperturas con banda', 'Pecho', 30, 'Brazos al frente, abre la banda hasta tocar el pecho.'),
      t('Flexiones lentas', 'Pecho', 40, '8 a 10 flexiones controladas, sin llegar al fallo.'),
    ],
  },
  {
    id: 'calentamiento-tiron', nombre: 'Calentamiento tirón', tipo: 'calentamiento', pasos: [
      t('Cardio suave', 'General', 300, 'Escaladora o cinta a ritmo cómodo.'),
      t('Colgarse de la barra', 'Espalda', 30, 'Colgado pasivo, hombros relajados.'),
      t('Face pull con banda', 'Deltoide posterior', 40, 'Tira la banda hacia la cara abriendo los codos.'),
      t('Rotación torácica en cuatro apoyos', 'Espalda alta', 30, 'Mano en la nuca, gira el codo hacia el techo.', true),
      t('Remo con banda', 'Espalda', 40, 'Lleva los codos atrás juntando las escápulas.'),
    ],
  },
  {
    id: 'calentamiento-pierna', nombre: 'Calentamiento pierna', tipo: 'calentamiento', pasos: [
      t('Cardio suave', 'General', 300, 'Bicicleta o cinta a ritmo cómodo.'),
      t('Balanceo de pierna', 'Cadera', 30, 'Adelante y atrás, sostenido de algo.', true),
      t('Cadera 90/90', 'Cadera', 45, 'Sentado, rodillas a 90°, cambia de lado girando la cadera.'),
      t('Tobillo: rodilla a la pared', 'Tobillo', 30, 'Pie a un palmo de la pared, lleva la rodilla adelante sin levantar el talón.', true),
      t('Sentadilla goblet profunda', 'Cuádriceps', 45, 'Abajo con el peso al frente, empuja las rodillas afuera con los codos.'),
      t('Puente de glúteo', 'Glúteo', 40, 'Aprieta el glúteo arriba 2 segundos en cada repetición.'),
    ],
  },
  {
    id: 'rodilla', nombre: 'Fortalecimiento de rodilla', tipo: 'fortalecimiento', pasos: [
      r('Sissy squat', 'Cuádriceps', 3, '8-12', 'Sostente de algo, sube en puntas y lleva las rodillas adelante bajando el cuerpo en línea recta. Rango cómodo, sin dolor.'),
      r('Talones (tibial)', 'Tibial', 3, '15-20', 'Espalda en la pared, talones apoyados un paso adelante: sube y baja las puntas de los pies.'),
      { ...t('Isométrica en la pared', 'Cuádriceps', 45, 'Espalda en la pared, rodillas a 60-90°. Aguanta sin dolor.'), series: 3, descanso: 45 },
      r('Pantorrilla', 'Pantorrilla', 3, '15', 'En un escalón, baja el talón completo y sube hasta la punta. Pausa arriba.'),
      r('Step up', 'Cuádriceps', 3, '10', 'Sube al cajón empujando con el pie de arriba; la rodilla sigue la línea del pie. Baja lento.', true),
      r('Sentadilla en punta de pies', 'Cuádriceps', 3, '10-12', 'Talones arriba todo el tiempo, baja controlado hasta donde no haya dolor.'),
    ],
  },
];
