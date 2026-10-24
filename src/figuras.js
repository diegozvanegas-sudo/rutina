// Figuras animadas de los ejercicios de las sesiones guiadas: un muñeco de palitos (SVG) que pasa por las posiciones
// del ejercicio. Funciona sin internet. Cada ejercicio se ubica por su nombre (POSES); los que no estén no muestran figura.
//
// Una posición se escribe con puntos del dibujo (200 × 170, el piso en y = 150, el muñeco mira a la derecha):
//   h: cadera, n: cuello, c: curva de la espalda (+ redonda, − arqueada), o: giro de la cabeza (+ arriba)
//   m1/m2: mano cercana/lejana, p1/p2: tobillo cercano/lejano. Codos y rodillas se calculan solos;
//   s: { m1: 1 } cambia hacia dónde se dobla esa articulación. t1/t2: hacia dónde apunta el pie (grados, 90 = adelante)
const BRAZO = [24, 22], PIERNA = [30, 30], CABEZA = 13, PISO = 150;
const r1 = (n) => Math.round(n * 10) / 10;
const dir = (g) => [Math.sin((g * Math.PI) / 180), Math.cos((g * Math.PI) / 180)];
const angulo = (a, b) => (Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI;

// Dos segmentos de largo l1 y l2 desde a hacia b: [articulación, extremo]. Si no alcanza, queda estirado hacia b
function ik(a, b, [l1, l2], s) {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 0.5), ux = dx / d, uy = dy / d;
  if (d >= l1 + l2) return [[a[0] + ux * l1, a[1] + uy * l1], [a[0] + ux * (l1 + l2), a[1] + uy * (l1 + l2)]];
  const x = (l1 * l1 - l2 * l2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
  return [[a[0] + ux * x + uy * h * s, a[1] + uy * x - ux * h * s], b];
}

function puntos(p) {
  const s = { m1: -1, m2: -1, p1: 1, p2: 1, ...p.s };
  const t = angulo(p.h, p.n), u = dir(t);
  const hombro = [p.n[0] - u[0] * 4, p.n[1] - u[1] * 4];
  const cab = dir(t + (p.o || 0)), largo = Math.hypot(p.n[0] - p.h[0], p.n[1] - p.h[1]) || 1;
  const perp = [(p.n[1] - p.h[1]) / largo, -(p.n[0] - p.h[0]) / largo], c = p.c || 0;
  const control = [(p.h[0] + p.n[0]) / 2 + perp[0] * c, (p.h[1] + p.n[1]) / 2 + perp[1] * c];
  const brazo = (k) => [hombro, ...ik(hombro, p[k], BRAZO, s[k])];
  const pierna = (k, pie) => {
    const [rodilla, tobillo] = ik(p.h, p[k], PIERNA, s[k]), d = dir(p[pie] ?? 90);
    return [p.h, rodilla, tobillo, [tobillo[0] + d[0] * 8, tobillo[1] + d[1] * 8]];
  };
  return {
    torso: 'M' + p.h.map(r1) + 'Q' + control.map(r1) + ' ' + p.n.map(r1),
    cabeza: [p.n[0] + cab[0] * CABEZA, p.n[1] + cab[1] * CABEZA],
    m1: brazo('m1'), m2: brazo('m2'), p1: pierna('p1', 't1'), p2: pierna('p2', 't2'),
  };
}
const linea = (ps) => ps.map((q) => r1(q[0]) + ',' + r1(q[1])).join(' ');

// ---------- Posiciones de base ----------
const DE_PIE = { h: [100, 90], n: [100, 48], m1: [103, 94], m2: [97, 94], p1: [103, PISO], p2: [97, PISO] };
const FRENTE = { ...DE_PIE, m1: [114, 92], m2: [86, 92], p1: [112, PISO], p2: [88, PISO], s: { p1: -1 } };
const CUATRO = { h: [70, 118], n: [112, 104], m1: [114, PISO], m2: [110, PISO], p1: [40, PISO], p2: [37, PISO] };
const PLANCHA = { h: [82.6, 123.1], n: [120, 104], m1: [121, PISO], m2: [118, PISO], p1: [30, PISO], p2: [27, PISO] };
const BOCA_ARRIBA = { h: [100, 144], n: [58, 144], m1: [34, 148], m2: [30, 148], p1: [132, 148], p2: [130, 148] };
const SENTADO = { h: [100, 142], n: [100, 100], m1: [108, 120], m2: [92, 120], p1: [124, 148], p2: [76, 148], s: { m2: 1, p2: -1 } };
const ACOSTADO = { h: [100, 144], n: [58, 144], m1: [104, 148], m2: [100, 148], p1: [158, 146], p2: [156, 146], t1: 180, t2: 180 };
const con = (base, cambios) => ({ ...base, ...cambios, s: { ...base.s, ...cambios.s } });

// Objetos del dibujo
const OBJETOS = {
  pared: (x) => '<line class="fg-obj" x1="' + x + '" y1="-6" x2="' + x + '" y2="' + PISO + '"/>',
  escalon: ([x, y, w]) => '<rect class="fg-obj" x="' + x + '" y="' + y + '" width="' + w + '" height="' + (PISO - y) + '" rx="2"/>',
  barra: ([x1, x2, y]) => '<line class="fg-obj" x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '"/>',
  cinta: () => '<rect class="fg-obj" x="50" y="' + (PISO - 1) + '" width="110" height="7" rx="3"/><line class="fg-obj" x1="152" y1="' + PISO + '" x2="146" y2="70"/><line class="fg-obj" x1="146" y1="70" x2="128" y2="74"/>',
};

// ---------- Los ejercicios ----------
export const POSES = {
  'gato-vaca': { poses: [con(CUATRO, { c: -9, o: 45 }), con(CUATRO, { c: 12, o: -55 })], dur: 3 },
  'flexor de cadera': { poses: [
    { h: [98, 120], n: [100, 78], m1: [104, 100], m2: [96, 100], p1: [130, PISO], p2: [58, PISO], t2: -90 },
    { h: [106, 124], n: [106, 82], m1: [110, 104], m2: [102, 104], p1: [130, PISO], p2: [58, PISO], t2: -90 }] },
  'isquiotibiales de pie': { poses: [
    { h: [96, 92], n: [98, 50], m1: [100, 96], m2: [96, 96], p1: [140, 135], p2: [97, PISO], t1: 150 },
    { h: [92, 92], n: [128, 66], m1: [136, 112], m2: [132, 112], p1: [140, 135], p2: [97, PISO], t1: 150 }], escalon: [126, 135, 44] },
  'pecho en la pared': { poses: [con(DE_PIE, { m1: [126, 28], s: { m1: -1 } }), con(DE_PIE, { h: [97, 90], n: [94, 49], m1: [126, 28] })], pared: 128 },
  'rotacion toracica': { poses: [
    { h: [70, 140], n: [112, 140], m1: [152, 136], m2: [150, 142], p1: [52, 146], p2: [50, 147], s: { p1: -1, p2: -1 }, t1: -90, t2: -90 },
    { h: [70, 140], n: [112, 140], m1: [80, 104], m2: [150, 142], p1: [52, 146], p2: [50, 147], s: { p1: -1, p2: -1, m1: 1 }, t1: -90, t2: -90 }], dur: 3 },
  'pantorrilla en la pared': { poses: [
    { h: [108, 94], n: [126, 56], m1: [160, 62], m2: [158, 66], p1: [128, PISO], p2: [80, PISO] },
    { h: [114, 97], n: [132, 59], m1: [160, 62], m2: [158, 66], p1: [128, PISO], p2: [80, PISO] }], pared: 162 },
  'postura del nino': { poses: [
    { h: [70, 128], n: [108, 138], c: 6, o: -10, m1: [154, 146], m2: [150, 146], p1: [52, PISO], p2: [50, PISO], t1: -90, t2: -90 },
    { h: [70, 125], n: [110, 137], c: 9, o: -10, m1: [156, 146], m2: [152, 146], p1: [52, PISO], p2: [50, PISO], t1: -90, t2: -90 }], dur: 4 },
  'cuadriceps de pie': { poses: [
    con(DE_PIE, { p1: [88, 94], m1: [88, 97], m2: [144, 56], t1: -60, s: { m2: 1 } }),
    con(DE_PIE, { h: [104, 90], n: [102, 48], p1: [90, 98], m1: [90, 101], m2: [146, 56], t1: -60, s: { m2: 1 } })] },
  'isquiotibiales sentado': { poses: [
    { h: [60, 145], n: [72, 104], m1: [100, 138], m2: [96, 138], p1: [120, 146], p2: [74, 147], s: { p2: -1 }, t1: 180 },
    { h: [60, 145], n: [98, 120], c: 8, o: -20, m1: [126, 142], m2: [122, 142], p1: [120, 146], p2: [74, 147], s: { p2: -1 }, t1: 180 }], dur: 3 },
  'gluteo en figura 4': { poses: [
    { h: [86, 142], n: [44, 142], m1: [92, 118], m2: [90, 121], p2: [120, 104], p1: [96, 108], s: { p1: -1, p2: 1, m1: 1, m2: 1 }, t1: 180, t2: 180 },
    { h: [86, 142], n: [44, 142], m1: [88, 108], m2: [86, 111], p2: [112, 94], p1: [92, 99], s: { p1: -1, p2: 1, m1: 1, m2: 1 }, t1: 180, t2: 180 }], dur: 3 },
  'dorsal en marco de puerta': { poses: [
    { h: [104, 90], n: [110, 48], m1: [163, 60], m2: [163, 66], p1: [112, PISO], p2: [106, PISO] },
    { h: [84, 104], n: [120, 70], m1: [163, 60], m2: [163, 66], p1: [112, PISO], p2: [106, PISO] }], pared: 165, dur: 3 },
  'pecho y hombro': { poses: [con(DE_PIE, { m1: [54, 47] }), con(DE_PIE, { h: [104, 90], n: [107, 49], m1: [54, 47] })], pared: 52 },
  'triceps sobre la cabeza': { poses: [
    con(DE_PIE, { m1: [94, 50], m2: [104, 26], s: { m1: 1, m2: 1 } }),
    con(DE_PIE, { m1: [94, 60], m2: [102, 24], s: { m1: 1, m2: 1 } })] },
  'cardio suave': { poses: [
    con(DE_PIE, { n: [103, 48], p1: [118, PISO], p2: [84, PISO], m1: [88, 90], m2: [116, 86] }),
    con(DE_PIE, { n: [103, 48], p1: [84, PISO], p2: [118, PISO], m1: [116, 86], m2: [88, 90] })], dur: 0.8, cinta: true },
  'circulos de brazos': { poses: [
    con(FRENTE, { m1: [146, 52], m2: [54, 52] }), con(FRENTE, { m1: [143, 40], m2: [57, 40], s: { m1: 1, m2: 1 } }),
    con(FRENTE, { m1: [139, 52], m2: [61, 52] }), con(FRENTE, { m1: [143, 64], m2: [57, 64] })], dur: 0.6 },
  'dislocaciones con banda': { poses: [
    con(DE_PIE, { m1: [140, 72], m2: [138, 74] }), con(DE_PIE, { m1: [102, 4], m2: [100, 4] }), con(DE_PIE, { m1: [62, 80], m2: [60, 82] })], banda: true, dur: 1.6 },
  'rotacion externa con banda': { poses: [
    con(FRENTE, { m1: [82, 78], m2: [66, 82], s: { m1: 1 } }), con(FRENTE, { m1: [126, 76], m2: [66, 82] })], banda: true },
  'rotacion toracica en cuatro apoyos': { poses: [
    con(CUATRO, { m1: [116, 96], s: { m1: -1 } }), con(CUATRO, { m1: [116, 96], s: { m1: 1 }, o: 30 })] },
  'flexiones escapulares': { poses: [PLANCHA, con(PLANCHA, { h: [82, 119], n: [120, 98], c: 4 })], dur: 1.4 },
  'aperturas con banda': { poses: [con(FRENTE, { m1: [107, 66], m2: [93, 66], s: { m1: 1 } }), con(FRENTE, { m1: [146, 60], m2: [54, 60] })], banda: true },
  'flexiones lentas': { poses: [con(PLANCHA, { p1: [22, PISO], p2: [19, PISO] }), con(PLANCHA, { h: [80, 139], n: [118, 132], p1: [22, PISO], p2: [19, PISO] })], dur: 2.2 },
  'colgarse de la barra': { poses: [
    { h: [100, 94], n: [100, 52], m1: [102, 6], m2: [98, 6], p1: [88, 140], p2: [84, 142] },
    { h: [101, 95], n: [100, 53], m1: [102, 6], m2: [98, 6], p1: [90, 141], p2: [86, 143] }], barra: [70, 130, 6], dur: 3 },
  'face pull con banda': { poses: [con(DE_PIE, { m1: [144, 50], m2: [142, 52] }), con(DE_PIE, { m1: [112, 40], m2: [110, 42], s: { m1: 1, m2: 1 } })], anclaje: [176, 48] },
  'remo con banda': { poses: [
    con(DE_PIE, { h: [96, 92], n: [102, 50], m1: [146, 66], m2: [144, 68], p1: [108, PISO], p2: [102, PISO] }),
    con(DE_PIE, { h: [96, 92], n: [100, 50], m1: [106, 76], m2: [104, 78], p1: [108, PISO], p2: [102, PISO] })], anclaje: [176, 66] },
  'balanceo de pierna': { poses: [con(DE_PIE, { m2: [64, 70], p1: [146, 124], s: { m2: 1 } }), con(DE_PIE, { m2: [64, 70], p1: [62, 132], s: { m2: 1 } })], pared: 60, dur: 1 },
  'cadera 90/90': { poses: [
    con(SENTADO, { m1: [132, 136], m2: [72, 136], p1: [104, 148], p2: [94, 148], s: { p1: -1, p2: -1, m2: -1 } }),
    con(SENTADO, { m1: [128, 136], m2: [68, 136], p1: [96, 148], p2: [106, 148], s: { p1: 1, p2: 1, m2: -1 } })], dur: 2.4 },
  'tobillo: rodilla a la pared': { poses: [
    { h: [100, 90], n: [108, 50], m1: [148, 60], m2: [148, 64], p1: [126, PISO], p2: [84, PISO] },
    { h: [108, 96], n: [116, 56], m1: [148, 64], m2: [148, 68], p1: [126, PISO], p2: [84, PISO] }], pared: 150 },
  'sentadilla goblet profunda': { poses: [
    con(DE_PIE, { m1: [116, 70], m2: [114, 72] }),
    { h: [90, 130], n: [104, 90], m1: [120, 104], m2: [118, 106], p1: [102, PISO], p2: [98, PISO] }], pesa: true, dur: 2.4 },
  'puente de gluteo': { poses: [BOCA_ARRIBA, con(BOCA_ARRIBA, { h: [104, 116], n: [62, 140] })], dur: 2 },
  'sissy squat': { poses: [
    con(DE_PIE, { h: [100, 82], n: [100, 40], m1: [146, 66], m2: [144, 68], p1: [100, 143], p2: [97, 143], t1: 35, t2: 35 }),
    { h: [80, 112], n: [64, 74], m1: [146, 80], m2: [144, 82], p1: [100, 143], p2: [97, 143], t1: 35, t2: 35 }], pared: 150, dur: 2.6 },
  'talones (tibial)': { poses: [
    { h: [80, 90], n: [74, 48], m1: [82, 92], m2: [78, 92], p1: [110, PISO], p2: [106, PISO], t1: 90, t2: 90 },
    { h: [80, 90], n: [74, 48], m1: [82, 92], m2: [78, 92], p1: [110, PISO], p2: [106, PISO], t1: 140, t2: 140 }], pared: 68, dur: 1 },
  'isometrica en la pared': { poses: [
    { h: [80, 112], n: [76, 70], m1: [100, 82], m2: [98, 84], p1: [110, PISO], p2: [106, PISO] },
    { h: [80, 113], n: [76, 71], m1: [100, 83], m2: [98, 85], p1: [110, PISO], p2: [106, PISO] }], pared: 70, dur: 2 },
  'pantorrilla': { poses: [
    { h: [100, 80], n: [100, 38], m1: [132, 64], m2: [130, 66], p1: [100, 140], p2: [97, 140], t1: 115, t2: 115 },
    { h: [100, 68], n: [100, 26], m1: [132, 54], m2: [130, 56], p1: [100, 128], p2: [97, 128], t1: 35, t2: 35 }], escalon: [94, 135, 40], dur: 1.8 },
  'step up': { poses: [
    { h: [96, 90], n: [98, 48], m1: [100, 94], m2: [94, 94], p1: [128, 120], p2: [94, PISO] },
    { h: [126, 60], n: [128, 18], m1: [130, 64], m2: [124, 64], p1: [128, 120], p2: [140, 104] }], escalon: [112, 120, 48], dur: 2 },
  'sentadilla en punta de pies': { poses: [
    con(DE_PIE, { h: [100, 84], n: [100, 42], m1: [104, 88], m2: [96, 88], p1: [100, 143], p2: [97, 143], t1: 35, t2: 35 }),
    { h: [96, 118], n: [106, 78], m1: [146, 80], m2: [144, 82], p1: [100, 143], p2: [97, 143], t1: 35, t2: 35 }], dur: 2.4 },

  // Mente: sentado, respiración y relajación acostado (resalta la parte que se tensa)
  'postura': { poses: [SENTADO], quieta: true },
  'afirmacion': { poses: [SENTADO], quieta: true },
  'respiracion 4-4-8': { respira: true },
  'respira profundo': { respira: true },
  'relajate': { respira: true },
  'pies y pantorrillas': { poses: [ACOSTADO], resalta: ['p1', 'p2'] },
  'muslos': { poses: [ACOSTADO], resalta: ['p1', 'p2'] },
  'gluteos y abdomen': { poses: [ACOSTADO], resalta: ['torso'] },
  'manos y antebrazos': { poses: [ACOSTADO], resalta: ['m1', 'm2'] },
  'brazos y hombros': { poses: [ACOSTADO], resalta: ['m1', 'm2'] },
  'cuello': { poses: [ACOSTADO], resalta: ['cabeza'] },
  'cara': { poses: [ACOSTADO], resalta: ['cabeza'] },
  'todo el cuerpo flojo': { poses: [ACOSTADO], quieta: true },
  've tu meta lograda': { poses: [SENTADO], quieta: true },
  'sientelo': { poses: [SENTADO], quieta: true },
  'afirma': { poses: [SENTADO], quieta: true },
  'primer paso': { poses: [SENTADO], quieta: true },
};

export const claveFigura = (nombre) => String(nombre || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
export const tieneFigura = (nombre) => claveFigura(nombre) in POSES;
// Los de mente no llevan video: no hay técnica que ver
export const esFisico = (nombre) => { const f = POSES[claveFigura(nombre)]; return !f || !!(f.poses && !f.quieta && !f.resalta); };
export const urlVideo = (nombre) => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(nombre + ' ejercicio cómo hacerlo técnica');

// Valores de una animación SMIL que pasa por las posiciones y vuelve a la primera
function animar(atributo, valores, dur) {
  if (valores.every((v) => v === valores[0])) return '';
  const lista = [...valores, valores[0]], n = lista.length - 1;
  return '<animate attributeName="' + atributo + '" dur="' + r1(dur * n) + 's" repeatCount="indefinite" values="' + lista.join(';') + '" calcMode="spline"' +
    ' keyTimes="' + lista.map((_, i) => r1((i / n) * 1000) / 1000).join(';') + '" keySplines="' + Array(n).fill('.45 0 .55 1').join(';') + '"/>';
}

// Respiración 4-4-8: el círculo crece al inhalar, se queda al retener y se encoge al exhalar (16 s por ciclo)
function respiracion() {
  const fase = (texto, desde, hasta) => '<text class="fg-texto" x="100" y="80" text-anchor="middle" opacity="0">' + texto +
    '<animate attributeName="opacity" dur="16s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;' + desde + ';' + hasta + '" values="0;1;0"/></text>';
  return '<svg class="figura" viewBox="0 -10 200 170" role="img" aria-label="Respiración: inhala 4, retén 4, exhala 8">' +
    '<circle class="fg-aire" cx="100" cy="76" r="26"><animate attributeName="r" dur="16s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.25;.5;1" values="26;62;62;26" keySplines=".4 0 .6 1;0 0 1 1;.4 0 .6 1"/></circle>' +
    fase('Inhala', '0', '.25') + fase('Retén', '.25', '.5') + fase('Exhala', '.5', '1') + '</svg>';
}

// Figura del ejercicio. Con animar = false queda quieta en la primera posición (para las listas)
export function figura(nombre, { animar: mover = true } = {}) {
  const f = POSES[claveFigura(nombre)];
  if (!f) return '';
  if (f.respira) return respiracion();
  const ps = (mover ? f.poses : f.poses.slice(0, 1)).map(puntos), dur = f.dur || 1.8, a = ps[0];
  const val = (fn) => ps.map(fn);
  const parte = (k, clase) => '<polyline class="' + clase + ((f.resalta || []).includes(k) ? ' fg-resalta' : '') + '" points="' + linea(a[k]) + '">' + animar('points', val((p) => linea(p[k])), dur) + '</polyline>';
  let objetos = '';
  if (f.pared) objetos += OBJETOS.pared(f.pared);
  if (f.escalon) objetos += OBJETOS.escalon(f.escalon);
  if (f.barra) objetos += OBJETOS.barra(f.barra);
  if (f.cinta) objetos += OBJETOS.cinta();
  const extremo = (p, k) => p[k][p[k].length - 1];
  let encima = '';
  if (f.banda) encima += '<polyline class="fg-banda" points="' + linea([extremo(a, 'm1'), extremo(a, 'm2')]) + '">' + animar('points', val((p) => linea([extremo(p, 'm1'), extremo(p, 'm2')])), dur) + '</polyline>';
  if (f.anclaje) encima += '<polyline class="fg-banda" points="' + linea([extremo(a, 'm1'), f.anclaje]) + '">' + animar('points', val((p) => linea([extremo(p, 'm1'), f.anclaje])), dur) + '</polyline>';
  if (f.pesa) {
    const m = val((p) => extremo(p, 'm1'));
    encima += '<circle class="fg-pesa" r="7" cx="' + r1(m[0][0]) + '" cy="' + r1(m[0][1]) + '">' + animar('cx', m.map((q) => r1(q[0])), dur) + animar('cy', m.map((q) => r1(q[1])), dur) + '</circle>';
  }
  const cab = val((p) => p.cabeza);
  return '<svg class="figura" viewBox="0 -10 200 170" role="img" aria-label="Cómo se hace: ' + nombre.replace(/"/g, '') + '">' +
    '<line class="fg-piso" x1="4" y1="' + (PISO + 4) + '" x2="196" y2="' + (PISO + 4) + '"/>' + objetos +
    parte('m2', 'fg-lejos') + parte('p2', 'fg-lejos') +
    '<path class="fg-cuerpo' + ((f.resalta || []).includes('torso') ? ' fg-resalta' : '') + '" d="' + a.torso + '">' + animar('d', val((p) => p.torso), dur) + '</path>' +
    '<circle class="fg-cabeza' + ((f.resalta || []).includes('cabeza') ? ' fg-resalta' : '') + '" r="9" cx="' + r1(a.cabeza[0]) + '" cy="' + r1(a.cabeza[1]) + '">' +
    animar('cx', cab.map((q) => r1(q[0])), dur) + animar('cy', cab.map((q) => r1(q[1])), dur) + '</circle>' +
    parte('p1', 'fg-cerca') + parte('m1', 'fg-cerca') + encima + '</svg>';
}
