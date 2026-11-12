// 🔥 Retos: 28 cosas difíciles para hacer de verdad, no para leer. Sin pantalla, para poder probarlas.
// Dos tipos: 'una' (se hace una vez y se anota cómo fue) y 'racha' (N días seguidos; si fallas un día, vuelve a 0).
// Solo una racha activa a la vez. Lo hecho va en est.retos = [{ id, reto, inicio, dias: { fecha: true }, estado, fin, nota }]
// estado: 'activo' | 'hecho' | 'dejado'. Los retos "cumplir una promesa cada día" y "algo que tu yo de hace un año
// admiraría" no están aquí: son diarios y para siempre, así que son estándares (ideas en vida.js).
import { e } from './estado.js';
import { iso, sumarDias } from './fechas.js';
import { juegaEl } from './futbol.js';

const r = (id, texto, tipo = 'una', extra = {}) => ({ id, texto, tipo, ...(tipo === 'racha' ? { dias: 30 } : {}), ...extra });
export const TEMAS_RETOS = {
  '💪 Cuerpo': [
    r('forma', 'Ponte en forma: 30 días seguidos cumpliendo tu plan de gym y comida', 'racha'),
    r('lucha', 'Aprende a pelear: ve a tu primera clase de BJJ, boxeo o judo'),
    r('cinco', 'Levántate a las 5 a. m. 30 días seguidos y haz algo difícil antes de que nadie más despierte', 'racha',
      { nota: 'Sirve solo si duermes 7 horas: eso es acostarte a las 10 p. m. Levantarte a las 5 durmiendo poco te quita fuerza en el gym y en la cancha.' }),
    r('ayuno', 'Ayuna 24 horas y demuéstrate que controlas lo que comes', 'una',
      { futbol: true, nota: 'Nunca el día del partido ni el anterior. La levotiroxina se toma igual, con agua.' }),
    r('alcohol', 'Un mes sin alcohol: mira quién eres completamente sobrio', 'racha'),
    r('porno', '30 días sin porno', 'racha'),
    r('correr', 'Corre hasta que de verdad no puedas más', 'una',
      { futbol: true, nota: 'En un día sin fútbol ni pierna, después de calentar. «No poder más» es que se te acabe el aire, no un tirón muscular.' }),
  ],
  '🗣️ Social y rechazo': [
    r('atractiva', 'Acércate a alguien que te parezca atractivo y háblale'),
    r('extrano', 'Habla con un desconocido todos los días durante un mes', 'racha'),
    r('verguenza', 'Haz algo vergonzoso en público a propósito, hasta que deje de importarte'),
    r('solo', 'Come solo en un restaurante sin tocar el celular'),
    r('evento', 'Ve a un evento donde no conoces a nadie y habla con la gente'),
    r('dificil', 'Ten esa conversación difícil que llevas meses evitando'),
    r('no', 'Di que no a algo a lo que normalmente dirías que sí'),
  ],
  '💰 Riesgo y plata': [
    r('invertir', 'Invierte una suma pequeña que podrías perder sin que te afecte', 'una',
      { nota: 'El post decía «el dinero que tienes miedo de perder». Es un mal consejo: el reto es perderle el miedo a invertir, no poner en riesgo el arriendo.', ir: '#finanzas' }),
    r('pedir', 'Pide más dinero del que crees que mereces'),
    r('publico', 'Empieza algo sin garantía de que funcione, y hazlo en público'),
    r('extractos', 'Revisa tus extractos de los últimos 30 días y sé brutalmente honesto', 'una', { ir: '#finanzas' }),
    r('comodo', 'Deja eso que te da comodidad pero no te deja avanzar'),
  ],
  '🧠 Dureza mental': [
    r('silencio', '30 minutos en silencio total: sin celular, sin música, sin nada'),
    r('redes', 'Un día completo sin redes sociales'),
    r('fracaso', 'Quédate con la sensación de fracaso sin hacer nada para escaparte de ella'),
    r('quejas', 'Una semana entera sin quejarte ni una vez', 'racha', { dias: 7 }),
    r('miedo', 'Haz algo que llevas tiempo evitando por miedo'),
  ],
  '🧭 Carácter': [
    r('alejarte', 'Aléjate de alguien que te ha ido agotando poco a poco', 'una',
      { nota: 'Si todavía no le has dicho lo que te molesta, eso va primero (es el reto de la conversación difícil). Alejarte sin decir nada también puede ser una forma de evitarla.' }),
    r('vida', 'Escribe la vida que de verdad quieres, sin censurarte'),
    r('orgullo', 'Pregúntate en voz alta si estás orgulloso de en quién te estás convirtiendo'),
    r('sabado', 'Pasa un sábado por la noche solo, mientras todos están de fiesta'),
  ],
};
export const RETOS = Object.entries(TEMAS_RETOS).flatMap(([tema, lista]) => lista.map((x) => ({ ...x, tema })));
export const retoPorId = (id) => RETOS.find((x) => x.id === id) || null;

export const registros = () => (e().retos ??= []);
export const retoActivo = (lista = registros()) => lista.find((x) => x.estado === 'activo') || null;
export const hechoDe = (id, lista = registros()) => lista.filter((x) => x.reto === id && x.estado === 'hecho').pop() || null;
export const cuantosHechos = (lista = registros()) => new Set(lista.filter((x) => x.estado === 'hecho').map((x) => x.reto)).size;

// Racha: días seguidos marcados que terminan hoy (o ayer, si hoy todavía no se marca)
export function estadoRacha(x, hoy = iso()) {
  const meta = (retoPorId(x.reto) || {}).dias || 30, dias = x.dias || {};
  let f = dias[hoy] ? hoy : sumarDias(hoy, -1), racha = 0;
  while (dias[f] && f >= x.inicio) { racha++; f = sumarDias(f, -1); }
  // Se rompió: hubo días marcados, pero ayer no (y el reto ya llevaba más de un día)
  const rota = !racha && Object.keys(dias).length > 0;
  return { racha, meta, fraccion: Math.min(1, racha / meta), hoyListo: !!dias[hoy], rota, termina: racha >= meta };
}

// Aviso de fútbol para los retos que te dejan sin fuerza (ayuno, correr al límite)
export function avisoFutbol(reto, config = e().config, hoy = iso()) {
  if (!reto || !reto.futbol) return '';
  if (juegaEl(config, hoy)) return 'Hoy juegas fútbol: hazlo otro día.';
  if (juegaEl(config, sumarDias(hoy, 1))) return 'Mañana juegas fútbol: hazlo otro día.';
  return '';
}

// ---------- Cambios ----------
const nuevoId = () => 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
export function empezarRacha(id, hoy = iso(), lista = registros()) {
  const reto = retoPorId(id);
  if (!reto || reto.tipo !== 'racha' || retoActivo(lista)) return null;
  const x = { id: nuevoId(), reto: id, inicio: hoy, dias: {}, estado: 'activo', fin: '', nota: '' };
  lista.push(x);
  return x;
}
// Marca o desmarca hoy. Si con eso llega a la meta, queda hecho
export function marcarHoy(hoy = iso(), lista = registros()) {
  const x = retoActivo(lista);
  if (!x) return null;
  if (x.dias[hoy]) delete x.dias[hoy]; else x.dias[hoy] = true;
  if (estadoRacha(x, hoy).termina) { x.estado = 'hecho'; x.fin = hoy; }
  return x;
}
export function hacerUna(id, hoy = iso(), lista = registros()) {
  const reto = retoPorId(id);
  if (!reto || reto.tipo !== 'una') return null;
  const x = { id: nuevoId(), reto: id, inicio: hoy, dias: {}, estado: 'hecho', fin: hoy, nota: '' };
  lista.push(x);
  return x;
}
export function dejarActivo(lista = registros()) {
  const x = retoActivo(lista);
  if (x) x.estado = 'dejado';
  return x;
}
