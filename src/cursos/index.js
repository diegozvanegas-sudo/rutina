// 🎓 Estudiar: áreas y cursos. Cada curso con contenido es un archivo en esta carpeta con el formato de
// aprender-a-aprender.js (lo valida tests/cursos.test.mjs) y se registra en CURSOS. Los demás salen como "Próximamente".
// El área 📚 Libros son los libros de src/libros, con sus pantallas de siempre (#libros/<id>).
import { LIBROS } from '../libros/index.js';
import aprenderAAprender from './aprender-a-aprender.js';
import metacognicion from './metacognicion.js';
import tomaDeDecisiones from './toma-de-decisiones.js';
import habitosProductividad from './habitos-productividad.js';
import procrastinacion from './procrastinacion.js';
import comunicacionOratoria from './comunicacion-oratoria.js';
import inteligenciaEmocional from './inteligencia-emocional.js';
import educacionFinanciera from './educacion-financiera.js';
import sesgosCognitivos from './sesgos-cognitivos.js';
import neuroplasticidad from './neuroplasticidad.js';
import neurocienciaDesarrollo from './neurociencia-desarrollo.js';
import epigenetica from './epigenetica.js';

export const CURSOS = [aprenderAAprender, metacognicion, tomaDeDecisiones, habitosProductividad, procrastinacion, comunicacionOratoria, inteligenciaEmocional, educacionFinanciera, sesgosCognitivos, neuroplasticidad, neurocienciaDesarrollo, epigenetica];
export const curso = (id) => CURSOS.find((c) => c.id === id) || null;

const c = (id, icono, nombre, descripcion) => ({ id, icono, nombre, descripcion });
const AREAS_CURSOS = [
  { id: 'aprender', icono: '🧠', nombre: 'Aprender y pensar', descripcion: 'Cómo estudiar, pensar mejor y decidir. Empieza por aquí: enseña a estudiar todo lo demás.', cursos: [
    c('aprender-a-aprender', '🧠', 'Aprender a aprender', 'Las técnicas de estudio que funcionan según la evidencia, y las que no.'),
    c('metacognicion', '🪞', 'Metacognición', 'Pensar sobre cómo piensas: saber qué sabes, qué no y cómo corregir el rumbo.'),
    c('sesgos-cognitivos', '🎭', 'Sesgos cognitivos', 'Los atajos de la mente que nos hacen equivocarnos y cómo frenarlos.'),
    c('toma-de-decisiones', '🧭', 'Toma de decisiones', 'Decidir con método cuando hay incertidumbre, prisa o emociones.'),
  ] },
  { id: 'cerebro', icono: '🧬', nombre: 'Cerebro y biología', descripcion: 'Cómo cambia el cerebro y qué hacen los genes con lo que vivimos.', cursos: [
    c('neuroplasticidad', '🌱', 'Neuroplasticidad', 'Cómo el cerebro se recablea con la práctica, a cualquier edad, y sus límites reales.'),
    c('neurociencia-desarrollo', '👶', 'Neurociencia del desarrollo', 'Cómo se forma el cerebro desde la infancia hasta la adultez.'),
    c('epigenetica', '🧬', 'Epigenética', 'Cómo el ambiente enciende y apaga genes, sin exagerar lo que dice la ciencia.'),
  ] },
  { id: 'habitos', icono: '⚡', nombre: 'Hábitos y productividad', descripcion: 'Organizar el día, construir hábitos y dejar de aplazar.', cursos: [
    c('habitos-productividad', '⚡', 'Hábitos, productividad y organización personal', 'Sistemas para que lo importante se haga solo.'),
    c('procrastinacion', '⏳', 'Ciencia de la procrastinación', 'Por qué aplazamos (no es pereza) y qué funciona para salir.'),
  ] },
  { id: 'comunicacion', icono: '💬', nombre: 'Comunicación y emociones', descripcion: 'Hablar con claridad, en público y con inteligencia emocional.', cursos: [
    c('comunicacion-oratoria', '🎤', 'Comunicación y oratoria', 'Ordenar ideas, persuadir y hablar en público sin bloquearse.'),
    c('inteligencia-emocional', '❤️', 'Inteligencia emocional', 'Reconocer, entender y manejar las emociones propias y ajenas.'),
  ] },
  { id: 'mundo', icono: '🌍', nombre: 'Mundo y dinero', descripcion: 'Entender cómo se mueve el mundo y cómo manejar tu plata.', cursos: [
    c('geopolitica', '🌍', 'Geopolítica', 'Poder, geografía y recursos: las claves para leer las noticias del mundo.'),
    c('educacion-financiera', '💵', 'Educación financiera', 'Ahorro, deudas, inversión e impuestos con los pies en la tierra (Colombia).'),
  ] },
  { id: 'esoterico', icono: '🜂', nombre: 'Tradiciones esotéricas', descripcion: 'Historia de las ideas: qué dice cada tradición y qué muestra la evidencia.', cursos: [
    c('gnosticismo', '✴️', 'Gnosticismo', 'Los grupos cristianos y paganos del conocimiento secreto en los primeros siglos.'),
    c('hermetismo', '☿', 'Hermetismo', 'El Corpus Hermeticum, Hermes Trismegisto y su influencia en el Renacimiento.'),
    c('numerologia', '🔢', 'Numerología', 'De Pitágoras a la numerología moderna, y por qué no tiene respaldo científico.'),
    c('geometria-sagrada', '📐', 'Geometría sagrada', 'La matemática real (proporción áurea, sólidos platónicos) y lo que se le atribuye.'),
    c('masoneria', '🧱', 'Masonería', 'Origen, grados, símbolos y papel histórico, separando hechos de mitos.'),
    c('ciencias-ocultas', '🔮', 'Ciencias ocultas', 'Alquimia, astrología y magia ceremonial en la historia, y lo que dice la evidencia.'),
  ] },
];

// Las 7 áreas en orden: Libros primero (ya tiene contenido), luego las de cursos
export function areas() {
  return [
    { id: 'libros', icono: '📚', nombre: 'Libros', descripcion: 'Libros y seminarios convertidos desde PDF: una lectura por día.',
      cursos: LIBROS.map((l) => ({ id: l.id, icono: l.icono, nombre: l.titulo, descripcion: l.descripcion, libro: true })) },
    ...AREAS_CURSOS,
  ];
}
export const area = (id) => areas().find((a) => a.id === id) || null;
export const areaDeCurso = (id) => areas().find((a) => a.cursos.some((x) => x.id === id)) || null;
// Catálogo para los permisos (⚙️ Administrar)
export const catalogoAreas = () => Object.fromEntries(areas().map((a) => [a.id, a.icono + ' ' + a.nombre]));
export const catalogoCursos = () => Object.fromEntries(areas().flatMap((a) => a.cursos.map((x) => [x.id, x.icono + ' ' + x.nombre + ' (' + a.nombre + ')'])));
