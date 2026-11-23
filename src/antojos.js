// 🍟 Antojos (Dieta): por qué te dan ganas de "pecar" y qué hacer en ese momento. Cuando llega el antojo: cuál es, por qué
// (hambre de verdad, estrés, aburrimiento, cansancio…), 10 minutos de espera, una versión que encaje en el plan y, si te lo
// comes, cómo acomodarlo sin el "ya qué, mañana empiezo". Cada vez queda anotada (dieta.antojos) para ver tus patrones.
// Las calorías son aproximadas (porciones de calle en Colombia); el número exacto depende del sitio. Sin pantalla.
import { diaSemana } from './fechas.js';

// Lo que más piden. kcal: una porción normal de calle o restaurante; version: una que encaja en el plan, con sus kcal aproximadas
export const ANTOJOS = [
  { id: 'salchipapa', nombre: 'Salchipapas', icono: '🍟', kcal: 1000, version: 'Salchipapa casera en freidora de aire: 250 g de papa con 1 cucharadita de aceite y 2 salchichas de pollo, con salsa rosada light o mostaza', kcalVersion: 520, truco: 'Lo que más suma es el aceite de la fritura y las salsas: la papa y la salchicha solas son la mitad.' },
  { id: 'hamburguesa', nombre: 'Hamburguesa', icono: '🍔', kcal: 900, version: 'Hamburguesa casera: carne magra de 150 g a la plancha, pan normal, lechuga, tomate y queso tajado, sin papas', kcalVersion: 550, truco: 'Pide sin papas y con gaseosa cero: solo eso son 400-500 kcal menos.' },
  { id: 'pizza', nombre: 'Pizza', icono: '🍕', kcal: 850, version: '2 porciones de pizza de jamón (no de carnes ni de borde relleno) con una ensalada antes', kcalVersion: 520, truco: 'La ensalada o la proteína primero llenan: es más fácil parar en 2 porciones.' },
  { id: 'empanadas', nombre: 'Empanadas', icono: '🥟', kcal: 600, version: '1 empanada con mucho ají y un vaso de agua, o empanadas al horno', kcalVersion: 250, truco: 'Cada empanada frita son 250-300 kcal: decide cuántas antes de pedir, no frente al plato.' },
  { id: 'dulce', nombre: 'Dulce o chocolate', icono: '🍫', kcal: 400, version: 'Chocolatina pequeña (20-30 g) o yogur griego con cacao y un poco de miel', kcalVersion: 150, truco: 'Las ganas de dulce suelen pasar con 2-3 bocados: compra la porción pequeña, no el paquete.' },
  { id: 'helado', nombre: 'Helado o postre', icono: '🍦', kcal: 450, version: '1 bola de helado en vaso (sin cono ni salsas) o un helado de agua', kcalVersion: 150, truco: 'El cono, la salsa y los toppings pesan casi lo mismo que el helado.' },
  { id: 'pan', nombre: 'Pan, buñuelo o pandebono', icono: '🥐', kcal: 500, version: '1 pandebono o 1 buñuelo con un café, en lugar del refrigerio del plan', kcalVersion: 220, truco: 'Uno con café se disfruta igual que tres: el tercero ya no sabe a nada.' },
  { id: 'gaseosa', nombre: 'Gaseosa o jugo', icono: '🥤', kcal: 250, version: 'Gaseosa cero, agua con gas y limón o un jugo en agua sin azúcar', kcalVersion: 10, truco: 'Las calorías que se toman no llenan: es lo más fácil de quitar sin pasar hambre.' },
  { id: 'trago', nombre: 'Cerveza o trago', icono: '🍺', kcal: 600, version: '2 cervezas (no 6) o trago con soda o gaseosa cero, y agua entre uno y otro', kcalVersion: 300, truco: 'Lo peor del trago no es el trago: es la comida de después. Come proteína antes de salir.' },
  { id: 'otro', nombre: 'Otro', icono: '🍽️', kcal: 0, version: 'La mitad de la porción, con proteína o verdura al lado', kcalVersion: 0, truco: 'Sírvelo en un plato y siéntate a comerlo: comer del paquete o de pie hace que se pierda la cuenta.' },
];

// Por qué llega el antojo: qué pasa en el cuerpo y qué hacer en ese momento
export const MOTIVOS = [
  { id: 'hambre', nombre: 'Tengo hambre de verdad', icono: '😋', porque: 'Pasaron más de 4-5 horas sin comer o la última comida tuvo poca proteína. El cuerpo pide lo más rápido: grasa y azúcar.', hacer: 'Come ya tu siguiente comida del plan (o adelántala). Con hambre de verdad, cualquier comida sirve; si solo te sirve la salchipapa, no es hambre.' },
  { id: 'estres', nombre: 'Estrés o ansiedad', icono: '😤', porque: 'El estrés sube el cortisol, y el cortisol aumenta las ganas de comida dulce y grasosa: calman por un rato.', hacer: '5 minutos: camina, respira 4-7-8 (4 s adentro, 7 aguantando, 8 afuera) 4 veces, o escribe qué te tiene así. La comida no arregla lo que te estresa.' },
  { id: 'aburrido', nombre: 'Aburrimiento', icono: '🥱', porque: 'El cerebro busca algo que le dé dopamina, y la comida es lo más fácil de conseguir.', hacer: 'Cambia de actividad o de lugar por 10 minutos: sal, llama a alguien, haz algo con las manos. Si se te olvida el antojo, no era hambre.' },
  { id: 'cansado', nombre: 'Cansancio o dormí mal', icono: '😴', porque: 'Con menos de 7 horas de sueño sube la grelina (hambre) y baja la leptina (llenura): al otro día comes 300-500 kcal más sin darte cuenta.', hacer: 'Proteína y agua primero (un yogur griego, huevos, un scoop). Hoy no es el día para decidir: esta noche, a dormir temprano.' },
  { id: 'triste', nombre: 'Triste o solo', icono: '😔', porque: 'La comida rica es un consuelo que funciona en el momento: por eso se vuelve costumbre cuando uno está mal.', hacer: 'Busca lo que de verdad necesitas: hablar con alguien, salir, moverte. Si igual quieres comer, que sea algo que disfrutes, despacio y sin culpa.' },
  { id: 'social', nombre: 'Plan con amigos o familia', icono: '🎉', porque: 'Comer con otros es normal y sano; el problema es llegar con hambre y sin un plan.', hacer: 'Decide antes qué vas a pedir y cuánto. Come proteína antes de salir. Disfrútalo y la siguiente comida, normal: un día no arruina 6 semanas.' },
  { id: 'costumbre', nombre: 'Costumbre (la hora, el lugar)', icono: '🔁', porque: 'El hábito tiene una señal (la hora, pasar por el sitio, el sofá con la tele) y una recompensa. La señal dispara las ganas solas.', hacer: 'Cambia la rutina, no la fuerza de voluntad: otra ruta, otro sitio, otra recompensa en esa hora (un café, una ducha, una fruta fría).' },
  { id: 'merezco', nombre: '"Me lo merezco"', icono: '🏆', porque: 'Premiar el esfuerzo con comida hace que la comida se vuelva el premio, y en un corte se siente como castigo no comerla.', hacer: 'Prémiate con algo que no sea comida, o planea la comida libre de la semana (una, no cada día) y disfrútala.' },
  { id: 'vi', nombre: 'La vi o la olí', icono: '👀', porque: 'Ver u oler comida activa el antojo aunque no tengas hambre: es el cerebro preparándose para comer.', hacer: 'Aléjate 10 minutos. Si en tu casa hay, que no esté a la vista (o no la compres). En la calle, pasa sin parar.' },
  { id: 'restriccion', nombre: 'Llevo días comiendo poco', icono: '📉', porque: 'En un déficit fuerte o después de días muy estrictos, el cuerpo pide comida densa: es normal y es más fuerte en un corte agresivo.', hacer: 'Revisa que estés comiendo todo el plan y la proteína. Si el hambre es fuerte todos los días, sube 150 kcal de carbos (en ⚖️ Peso) o haz una recarga.' },
];

export const ESPERA_MIN = 10;
export const DECISIONES = { paso: '✅ Se me pasó', version: '🥗 Comí la versión que encaja', comi: '🍟 Me lo comí', planeado: '📅 Lo dejé planeado' };

export const antojoDe = (id) => ANTOJOS.find((a) => a.id === id) || ANTOJOS[ANTOJOS.length - 1];
export const motivoDe = (id) => MOTIVOS.find((m) => m.id === id) || null;

/** Anota un antojo. r = { antojo, otro?, motivos[], decision, nota? } */
export function anotarAntojo(dieta, r, fecha, horaTexto) {
  const lista = (dieta.antojos ??= []);
  const x = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), fecha, hora: horaTexto, antojo: r.antojo, motivos: [...(r.motivos || [])], decision: r.decision };
  if (r.otro && r.otro.trim()) x.otro = r.otro.trim().slice(0, 60);
  if (r.nota && r.nota.trim()) x.nota = r.nota.trim().slice(0, 300);
  lista.push(x);
  return x;
}
export function borrarAntojo(dieta, id) {
  const i = (dieta.antojos || []).findIndex((x) => x.id === id);
  if (i >= 0) dieta.antojos.splice(i, 1);
  return i >= 0;
}

const FRANJAS = [[0, 'madrugada'], [6, 'mañana'], [12, 'tarde'], [18, 'noche'], [22, 'tarde en la noche']];
const franja = (h) => { let n = FRANJAS[0][1]; for (const [d, t] of FRANJAS) if (h >= d) n = t; return n; };
const DIAS = ['', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const mayor = (cuenta) => Object.entries(cuenta).sort((a, b) => b[1] - a[1])[0] || null;

/** Tus patrones de los últimos `dias` días: cuántos, cuántos se pasaron, el motivo, el día, la hora y el antojo que más se repiten */
export function patronesAntojos(lista, hoy, dias = 30) {
  const desde = new Date(Date.parse(hoy) - dias * 86400000).toISOString().slice(0, 10);
  const xs = (lista || []).filter((x) => x.fecha > desde && x.fecha <= hoy);
  if (!xs.length) return { total: 0 };
  const motivo = {}, dia = {}, hora = {}, antojo = {};
  for (const x of xs) {
    for (const m of x.motivos || []) motivo[m] = (motivo[m] || 0) + 1;
    const d = DIAS[diaSemana(x.fecha)]; dia[d] = (dia[d] || 0) + 1;
    if (x.hora) { const f = franja(Number(x.hora.slice(0, 2))); hora[f] = (hora[f] || 0) + 1; }
    antojo[x.antojo] = (antojo[x.antojo] || 0) + 1;
  }
  const controlados = xs.filter((x) => x.decision !== 'comi').length;
  const m = mayor(motivo), d = mayor(dia), h = mayor(hora), a = mayor(antojo);
  return {
    total: xs.length, controlados, parte: controlados / xs.length,
    motivo: m && { id: m[0], veces: m[1] }, dia: d && { nombre: d[0], veces: d[1] }, franja: h && { nombre: h[0], veces: h[1] }, antojo: a && { id: a[0], veces: a[1] },
  };
}

/** Qué tanto pesa el antojo hoy: sus kcal contra las del plan del día y la versión que encaja */
export function pesoDelAntojo(antojo, kcalPlan) {
  const a = antojoDe(antojo);
  if (!a.kcal || !kcalPlan) return null;
  return { kcal: a.kcal, parte: a.kcal / kcalPlan, ahorro: a.kcal - a.kcalVersion, kcalVersion: a.kcalVersion };
}

// Por qué nos dan ganas de "pecar": lo que conviene saber para controlarlas (la tarjeta de lectura de la pestaña)
export const POR_QUE = [
  { t: 'La comida "chatarra" está hecha para eso', d: 'Grasa + azúcar + sal juntas casi no existen en la naturaleza: el cerebro las premia con dopamina y pide más. No es falta de voluntad: está diseñada para que no pares.' },
  { t: 'Prohibir lo hace más fuerte', d: 'Cuando una comida es "prohibida", piensas más en ella. Por eso funciona mejor una comida libre planeada a la semana que prohibir todo y caer en un atracón.' },
  { t: 'El "ya qué" hace más daño que el antojo', d: 'Una salchipapa son ~1.000 kcal: es medio día de déficit. El problema es pensar "ya la embarré" y comer mal el resto del fin de semana. Después de un antojo, la siguiente comida es normal.' },
  { t: 'Un corte agresivo sube el hambre', d: 'Con menos comida, el cuerpo sube las señales de hambre. Por eso el corte dura 6 semanas, la proteína es alta (llena más) y los días de fútbol no se recortan.' },
  { t: 'Dormir mal y el estrés lo empeoran', d: 'Menos de 7 horas de sueño y el estrés suben el hambre y las ganas de dulce y grasa. A veces el arreglo del antojo es dormir.' },
  { t: 'Las ganas suben y bajan como una ola', d: 'Un antojo dura entre 10 y 20 minutos si no le haces caso. Si esperas, notas el antojo sin obedecerlo y haces otra cosa, la mayoría pasa sola.' },
  { t: 'Lo que hay en casa es lo que comes', d: 'La decisión más fácil es en el supermercado, no a las 10 de la noche frente a la nevera. Lo que no compras no te lo comes.' },
];
export const ESTRATEGIAS = [
  'Proteína en cada comida (30-40 g) y verdura: llenan más con menos calorías.',
  'Una comida libre planeada a la semana, mejor el día de fútbol o de recarga. Decide antes qué y cuánto.',
  'No llegues con hambre a la tarde: el refrigerio del plan es para eso.',
  'Agua o café antes de decidir, y 10 minutos de espera.',
  'Si te lo vas a comer, siéntate, sírvelo en un plato y disfrútalo despacio. Sin culpa: la culpa lleva al atracón.',
];
