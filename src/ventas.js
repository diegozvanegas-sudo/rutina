// 💼 Ventas (solo el superadmin): vender planes en PDF y el plan con entrenador en la app.
// Aquí solo la lógica (se prueba sin navegador); la pantalla está en vistas/ventas.js y el PDF de ejemplo en ventas-pdf.js.
// La venta y el cobro no pasan por esta app (GitHub Pages no se puede usar para una tienda): el botón de la página de
// venta lleva al link de pago de Hotmart, Wompi o Mercado Pago, que cobran, entregan el PDF y manejan los reembolsos.
// Se guarda en estado.ventas = { productos: [...], registro: [{ id, fecha, producto, monto, canal, nota }], lista: { id: true }, autor: {...} }
import { iso } from './fechas.js';

const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const copia = (x) => JSON.parse(JSON.stringify(x));

export const ESTADOS_PRODUCTO = [['borrador', '✏️ Borrador'], ['listo', '✅ Listo para vender'], ['venta', '🟢 A la venta']];
export const CANALES = [['hotmart', 'Hotmart'], ['wompi', 'Wompi'], ['mercadopago', 'Mercado Pago'], ['whatsapp', 'WhatsApp / transferencia'], ['efectivo', 'Efectivo']];

// Productos de ejemplo: precios en pesos para empezar a probar, sin "precio antes" (tachar un precio que nunca cobraste es engañoso)
export const PRODUCTOS_EJEMPLO = [
  { id: 'musculo', nombre: 'Ganar músculo desde cero · Plan de 12 semanas', formato: 'PDF · 20 páginas', pdf: 'musculo', estado: 'borrador',
    promesa: 'De flaco a fuerte en 12 semanas, con un plan que sí puedes seguir: 3 días de gym o en casa, comida normal y una forma clara de saber si vas bien.',
    paraQuien: ['Empiezas de cero o llevas meses sin ver cambios', 'Te cuesta subir de peso o "todo se te va"', 'Quieres un plan claro, no 50 videos distintos'],
    noEsPara: ['Buscas resultados en 2 semanas', 'Ya compites o entrenas con un entrenador personal'],
    incluye: ['Por qué no ganas peso y cómo calcular tus calorías y tu proteína (con ejemplo)', 'Rutina de cuerpo completo de 3 días, en gym o en casa', 'Cómo subir el peso cada semana sin estancarte (doble progresión)',
      'Plan de 12 semanas por fases: base, progresión, descarga e intensificación', '3 menús de ejemplo y lista de mercado', 'Errores típicos y qué hacer si no subes', 'Hojas para anotar tus entrenos y tu peso'],
    precio: 49900, garantia: 7, link: '', plataforma: 'hotmart',
    faq: [['¿Necesito ir al gimnasio?', 'No. Cada ejercicio trae su versión en casa con barra, paralelas y piso.'], ['¿Cuánto tiempo al día?', '3 entrenos de 50 a 60 minutos a la semana.'],
      ['¿Cómo lo recibo?', 'Al pagar te llega el PDF al correo y lo descargas de una vez. Pago único, sin suscripción.'], ['¿Y si no me sirve?', 'Tienes ' + 7 + ' días para pedir la devolución.']] },
  { id: 'grasa', nombre: 'Bajar grasa sin perder músculo · 12 semanas', formato: 'PDF', pdf: null, estado: 'borrador',
    promesa: 'Baja la barriga sin pasar hambre y sin perder la fuerza que ya tienes.',
    paraQuien: ['Ya entrenas pero no se te nota', 'Has hecho dietas y vuelves a subir'], noEsPara: ['Quieres bajar 10 kg en un mes'],
    incluye: ['Cómo calcular tu déficit sin pasar hambre', 'Comidas por tipo de día (pierna, torso, descanso)', 'Rutina para conservar el músculo', 'Qué hacer cuando el peso se estanca'],
    precio: 49900, garantia: 7, link: '', plataforma: 'hotmart', faq: [] },
  { id: 'casa', nombre: 'Entrena en casa: barra, paralelas y piso', formato: 'PDF', pdf: null, estado: 'borrador',
    promesa: 'Gana fuerza y músculo sin gimnasio, con progresiones de la más fácil a la más difícil.',
    paraQuien: ['No tienes tiempo o plata para el gym', 'Viajas mucho'], noEsPara: ['Quieres levantar pesos máximos'],
    incluye: ['Progresiones de dominadas, fondos y flexiones', 'Rutina de 3 días', 'Cómo saber cuándo pasar a la siguiente variante'],
    precio: 34900, garantia: 7, link: '', plataforma: 'hotmart', faq: [] },
  { id: 'coach', nombre: 'Plan con entrenador en la app (mensual)', formato: 'Suscripción mensual', pdf: null, estado: 'borrador',
    promesa: 'Tu rutina, tu comida y tu ciclo de 12 semanas en la app, con un entrenador que revisa tu avance cada semana.',
    paraQuien: ['Ya probaste el PDF y quieres acompañamiento', 'Quieres que alguien ajuste tu plan cuando te estancas'], noEsPara: ['No vas a mandar el check-in semanal'],
    incluye: ['Plan armado para ti (rutina, comidas y ciclo)', 'Check-in semanal y ajustes', 'Tu avance en gráficos', 'Chat por WhatsApp'],
    precio: 150000, garantia: 0, link: '', plataforma: 'wompi', faq: [] },
];

export const LISTA_LANZAMIENTO = [
  ['Producto', [
    ['pdf', 'El PDF terminado, revisado por otra persona (ortografía y que se entienda)'],
    ['aviso', 'El aviso de salud en el PDF y en la página: «no reemplaza a un médico o nutricionista»'],
    ['probado', '3 a 5 personas lo siguieron gratis 4 semanas a cambio de su opinión (y, si quieren, su testimonio real)'],
  ]],
  ['Cobro y entrega', [
    ['cuenta', 'Cuenta en la plataforma de pago (Hotmart, Wompi o Mercado Pago) a tu nombre, con tu cuenta bancaria'],
    ['producto', 'El producto creado en la plataforma, con el PDF para la entrega automática'],
    ['compra', 'Una compra de prueba de principio a fin: pagas, te llega el PDF, lo abres en el celular'],
    ['reembolso', 'La política de devolución escrita (días y cómo pedirla) y probada'],
  ]],
  ['Página de venta', [
    ['autor', 'Quién eres: tu nombre, tu foto y por qué sabes de esto (sin inventar títulos)'],
    ['link', 'El botón de comprar con el link de pago real'],
    ['datos', 'La política de tratamiento de datos (Ley 1581) y los términos, enlazados abajo'],
    ['publicada', 'La página publicada en su propio sitio (proyecto aparte, no en esta app)'],
  ]],
  ['Legal y plata', [
    ['precio', 'Precio final claro, con impuestos, sin «precio antes» inventado (Estatuto del Consumidor, SIC)'],
    ['testimonios', 'Solo testimonios y fotos reales, con permiso por escrito de cada persona'],
    ['contador', 'Hablar con un contador: RUT, cómo declarar estos ingresos y si debes facturar electrónicamente (DIAN)'],
  ]],
  ['Primeras ventas', [
    ['contenido', 'Un plan de contenido: 3 publicaciones por semana con un consejo útil y el link'],
    ['conocidos', 'Avisar a 20 conocidos uno por uno (no un mensaje masivo)'],
    ['medir', 'Anotar cada venta aquí para saber qué funciona'],
  ]],
];

export function ventasDe(est) {
  const v = (est.ventas ??= {});
  v.productos ??= copia(PRODUCTOS_EJEMPLO);
  v.registro ??= []; v.lista ??= {}; v.autor ??= { nombre: '', credencial: '', historia: '', whatsapp: '' };
  return v;
}
export const nuevoProducto = () => ({ id: uid('p'), nombre: 'Producto nuevo', formato: 'PDF', pdf: null, estado: 'borrador', promesa: '', paraQuien: [], noEsPara: [], incluye: [], precio: 0, garantia: 7, link: '', plataforma: 'hotmart', faq: [] });
export const nuevaVenta = (producto, monto, fecha = iso(), canal = 'hotmart') => ({ id: uid('v'), fecha, producto, monto: Number(monto) || 0, canal, nota: '' });

// Lo que le falta a un producto para venderse (lo que se ve en la página)
export function faltantes(p, autor = {}) {
  const f = [];
  if (!p.promesa) f.push('la promesa');
  if (!(p.incluye || []).length) f.push('qué incluye');
  if (!(p.precio > 0)) f.push('el precio');
  if (!p.link) f.push('el link de pago');
  if (!autor.nombre) f.push('quién eres (Autor)');
  return f;
}

// Ventas: este mes, el total, por producto y los últimos 6 meses
export function resumenVentas(v, hoy = iso()) {
  const mes = hoy.slice(0, 7), r = v.registro;
  const porProducto = {};
  for (const x of r) { const p = (porProducto[x.producto] ??= { producto: x.producto, n: 0, monto: 0 }); p.n++; p.monto += x.monto; }
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Number(mes.slice(0, 4)), Number(mes.slice(5, 7)) - 1 - i, 1), m = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const del = r.filter((x) => x.fecha.slice(0, 7) === m);
    meses.push({ mes: m, n: del.length, monto: del.reduce((s, x) => s + x.monto, 0) });
  }
  const esteMes = meses[5];
  return { total: r.reduce((s, x) => s + x.monto, 0), ventas: r.length, esteMes, meses, porProducto: Object.values(porProducto).sort((a, b) => b.monto - a.monto),
    ticket: r.length ? Math.round(r.reduce((s, x) => s + x.monto, 0) / r.length) : 0 };
}
export function avanceLista(v) {
  const todos = LISTA_LANZAMIENTO.flatMap(([, xs]) => xs);
  return { hechos: todos.filter(([k]) => v.lista[k]).length, total: todos.length };
}

// ---------- La página de venta (un HTML completo, para la vista previa y para descargarlo al proyecto nuevo) ----------
const h = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const pesosCOP = (n) => '$ ' + Math.round(Number(n) || 0).toLocaleString('es-CO');
const CSS_PAGINA = `
:root{--bg:#0f1316;--card:#171d22;--ink:#eef2f4;--muted:#9aa7b1;--brand:#3dd68c;--brand-ink:#062b18;--line:#26313a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.envoltura{max-width:980px;margin:0 auto;padding:0 16px}
header{display:flex;align-items:center;justify-content:space-between;padding:14px 0}header b{font-size:18px}
.heroe{display:grid;gap:22px;padding:28px 0 36px;align-items:center}
@media(min-width:820px){.heroe{grid-template-columns:1.2fr .8fr}}
.etiqueta{display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(61,214,140,.12);color:var(--brand);font-weight:700;font-size:13px}
h1{font-size:clamp(30px,6vw,52px);line-height:1.05;margin:12px 0}h2{font-size:clamp(22px,4vw,32px);margin:0 0 14px}
.promesa{font-size:18px;color:#cfd8de}
.portada{aspect-ratio:3/4;border-radius:18px;background:linear-gradient(150deg,#1d6b4b,#173a5f);display:grid;align-content:end;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,.45)}
.portada b{font-size:26px;line-height:1.1}.portada small{color:#cde}
.precio{display:flex;align-items:baseline;gap:10px;margin:16px 0}.precio b{font-size:34px}.precio small{color:var(--muted)}
.cta{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 26px;border-radius:14px;background:var(--brand);color:var(--brand-ink);font-weight:800;font-size:18px;text-decoration:none;border:0}
.cta.sin-link{opacity:.55;pointer-events:none}
.nota{color:var(--muted);font-size:14px}
section{padding:30px 0;border-top:1px solid var(--line)}
.dos{display:grid;gap:14px}@media(min-width:760px){.dos{grid-template-columns:1fr 1fr}}
.caja{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px}
ul.lista{list-style:none;padding:0;margin:0;display:grid;gap:10px}ul.lista li{display:flex;gap:10px}ul.lista li::before{content:"✓";color:var(--brand);font-weight:800}
ul.no li::before{content:"✗";color:#ff7b7b}
.autor{display:flex;gap:16px;align-items:center}.foto{width:76px;height:76px;border-radius:50%;background:#26313a;display:grid;place-items:center;font-size:30px;flex:none}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:8px}summary{font-weight:700;cursor:pointer}
.final{text-align:center;padding:44px 16px;border-radius:20px;background:linear-gradient(135deg,#12503a,#1e3a5f);margin:30px 0}
.barra-fija{position:sticky;bottom:0;background:rgba(15,19,22,.94);backdrop-filter:blur(8px);border-top:1px solid var(--line);padding:10px 0}
.barra-fija .envoltura{display:flex;align-items:center;justify-content:space-between;gap:12px}.barra-fija .cta{min-height:46px;font-size:16px;padding:0 18px}
footer{padding:28px 0 90px;color:var(--muted);font-size:13px}
.ejemplo{background:#5a4300;color:#ffe08a;text-align:center;font-size:13px;padding:6px}`;

export function paginaVenta(p, autor = {}, { ejemplo = true } = {}) {
  const link = p.link ? h(p.link) : '#', boton = (t) => '<a class="cta' + (p.link ? '' : ' sin-link') + '" href="' + link + '" rel="noopener">' + t + '</a>';
  const lista = (xs, clase = '') => '<ul class="lista ' + clase + '">' + (xs || []).map((x) => '<li>' + h(x) + '</li>').join('') + '</ul>';
  const precio = p.precio > 0 ? pesosCOP(p.precio) : 'Precio por definir';
  const faq = [...(p.faq || [])];
  if (p.garantia > 0 && !faq.some(([q]) => /no me sirve|devoluci/i.test(q))) faq.push(['¿Y si no me sirve?', 'Tienes ' + p.garantia + ' días para pedir la devolución.']);
  return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + h(p.nombre) + '</title>' +
    '<meta name="description" content="' + h(p.promesa) + '"><style>' + CSS_PAGINA + '</style></head><body>' +
    (ejemplo ? '<div class="ejemplo">Vista previa de ejemplo · sin link de pago real todavía</div>' : '') +
    '<div class="envoltura"><header><b>' + h(autor.nombre || 'Tu marca') + '</b>' + boton('Comprar') + '</header>' +
    '<div class="heroe"><div><span class="etiqueta">' + h(p.formato || 'PDF') + ' · acceso inmediato</span><h1>' + h(p.nombre) + '</h1><p class="promesa">' + h(p.promesa) + '</p>' +
      '<div class="precio"><b>' + precio + '</b><small>pago único' + (/mensual/i.test(p.formato) ? ' cada mes' : '') + '</small></div>' + boton('Quiero mi plan →') +
      '<p class="nota">' + (/pdf/i.test(p.formato) ? 'Te llega al correo apenas pagas. ' : '') + (p.garantia > 0 ? p.garantia + ' días de garantía de devolución.' : '') + '</p></div>' +
      '<div class="portada" aria-hidden="true"><small>' + h(p.formato || '') + '</small><b>' + h(p.nombre) + '</b></div></div>' +
    (p.paraQuien && p.paraQuien.length || p.noEsPara && p.noEsPara.length ? '<section><div class="dos"><div class="caja"><h2>Es para ti si…</h2>' + lista(p.paraQuien) + '</div>' +
      '<div class="caja"><h2>No es para ti si…</h2>' + lista(p.noEsPara, 'no') + '</div></div></section>' : '') +
    '<section><h2>Qué incluye</h2>' + lista(p.incluye) + '</section>' +
    '<section><h2>Quién te acompaña</h2><div class="autor"><div class="foto">🏋️</div><div><b>' + h(autor.nombre || '[Tu nombre]') + '</b><br><span class="nota">' + h(autor.credencial || '[Tu experiencia: años entrenando, a cuántas personas has guiado, estudios reales]') + '</span>' +
      (autor.historia ? '<p>' + h(autor.historia) + '</p>' : '') + '</div></div></section>' +
    '<section><h2>Lo que dicen quienes lo siguieron</h2><p class="nota">Aquí van testimonios reales, con nombre y permiso. Mientras no los tengas, no pongas ninguno.</p></section>' +
    (faq.length ? '<section><h2>Preguntas frecuentes</h2>' + faq.map(([q, r]) => '<details><summary>' + h(q) + '</summary><p>' + h(r) + '</p></details>').join('') + '</section>' : '') +
    '<div class="final"><h2>' + h(p.nombre) + '</h2><p>' + precio + (p.garantia > 0 ? ' · ' + p.garantia + ' días de garantía' : '') + '</p>' + boton('Empezar hoy →') + '</div>' +
    '<footer>Contenido educativo para adultos sanos. No reemplaza el consejo de un médico o nutricionista.<br>' + h(autor.nombre || '') + (autor.whatsapp ? ' · WhatsApp ' + h(autor.whatsapp) : '') +
      ' · Política de datos · Términos · Devoluciones</footer></div>' +
    '<div class="barra-fija"><div class="envoltura"><span><b>' + precio + '</b></span>' + boton('Quiero mi plan →') + '</div></div></body></html>';
}
