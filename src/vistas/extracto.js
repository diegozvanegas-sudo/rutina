// 🏦 Extracto del banco (Finanzas): las acciones y lo que la pantalla recuerda mientras está abierta. La pantalla está en
// src/react/pantallas/FinanzasExtracto.tsx y la lectura y el análisis en src/extracto.js.
// El extracto (texto, archivo, clave del PDF) solo vive en esta pantalla: no se guarda ni se sube a la nube. Se guardan los
// movimientos que pases a Finanzas (importado: 'extracto') y las categorías que corrijas (fin.reglasExtracto: clave → "cat/sub")
import { e, guardar, repintar } from '../estado.js';
import { iso } from '../fechas.js';
import { agregarMovimiento, quitarMovimiento, anotarPatrimonio, pesos, leerMonto } from '../finanzas.js';
import { leerExtracto, claveDe } from '../extracto.js';
import { comprasDe, porPersona, textoPersona, quienDe } from '../cuotas.js';
import { mensualDeAnual } from '../calculadora.js';
import { registrar, toast, copiarTexto } from '../ui.js';

const f = () => e().finanzas;
// texto: lo pegado · movs: lo leído · metodo: la cuenta del extracto · tarjeta: si es de una tarjeta de crédito
// pdf: el archivo que pidió clave · abierto: el movimiento que se está corrigiendo · leyendo: mientras se lee un PDF
export const ext = { texto: '', movs: null, metodo: null, tarjeta: false, pdf: null, pideClave: false, abierto: null, leyendo: false, nombre: '', ultimos: null, filtro: 'todos' };
export const extracto = () => ext;

const metodoPorDefecto = () => (f().metodos.find((m) => m.id === 'debito') || f().metodos[0] || { id: 'efectivo' }).id;
const esTarjeta = (id) => id === 'credito' || f().deudas.some((d) => d.metodo === id);

// ---------- 💳 Cuotas y quién paga (src/cuotas.js) ----------
// fin.personas: quiénes usan la tarjeta (la primera eres tú) · fin.compras: por compra (claveCompra) quién paga y lo corregido
// fin.reglasQuien: comercio → personas (para la próxima compra igual) · fin.tasasTarjeta: tasa de cada tarjeta { valor, tipo }
export const personas = () => (f().personas && f().personas.length ? f().personas : ['Yo']);
// La tasa mensual de la tarjeta: la escrita aquí o la de su deuda en 💳 Deudas (que ya es mensual)
export function tasaTarjeta() {
  const id = ext.metodo || metodoPorDefecto(), t = (f().tasasTarjeta || {})[id], d = f().deudas.find((x) => x.metodo === id);
  if (t && t.valor > 0) return { ...t, mensual: t.tipo === 'ea' ? mensualDeAnual(t.valor) : t.valor, de: 'aqui' };
  return d && d.tasa > 0 ? { valor: d.tasa, tipo: 'mensual', mensual: d.tasa, de: 'deuda', deuda: d.nombre } : null;
}
export const compras = () => comprasDe(ext.movs || [], { guardadas: f().compras || {}, reglas: f().reglasQuien || {}, tasa: (tasaTarjeta() || {}).mensual || 0 });
const compraDe = (id) => compras().find((c) => c.id === id);
const guardada = (c) => ((f().compras ??= {})[c.clave] ??= {});
export const nombreTarjeta = () => ((f().metodos.find((m) => m.id === (ext.metodo || metodoPorDefecto())) || {}).nombre || 'la tarjeta');

function leer(texto) {
  ext.metodo ??= metodoPorDefecto();
  ext.tarjeta = esTarjeta(ext.metodo);
  ext.movs = leerExtracto(texto, { hoy: iso(), aprendidas: f().reglasExtracto || {}, movimientos: f().movimientos, tarjeta: ext.tarjeta });
  ext.abierto = null;
  ext.filtro = 'todos';
  repintar();
  if (!ext.movs.length) toast('No encontré movimientos: revisa que cada uno tenga fecha y valor');
  else toast('📄 ' + ext.movs.length + ' movimientos leídos');
}

// ---------- PDF: el texto de cada página, por renglones (pdf.js se baja solo la primera vez) ----------
async function textoDePdf(archivo, clave) {
  const pdfjs = await import('pdfjs-dist');
  const { default: trabajador } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = trabajador;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await archivo.arrayBuffer()), password: clave || undefined }).promise;
  const lineas = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const items = (await (await doc.getPage(n)).getTextContent()).items.filter((x) => x.str && x.str.trim());
    // Mismo renglón: la misma altura (con 3 puntos de tolerancia), de izquierda a derecha
    const filas = [];
    for (const x of items) {
      const y = x.transform[5], fila = filas.find((r) => Math.abs(r.y - y) <= 3);
      if (fila) fila.items.push(x); else filas.push({ y, items: [x] });
    }
    filas.sort((a, b) => b.y - a.y);
    for (const r of filas) lineas.push(r.items.sort((a, b) => a.transform[4] - b.transform[4]).map((x) => x.str.trim()).join(' '));
  }
  return lineas.join('\n');
}
async function leerPdf(archivo, clave) {
  ext.leyendo = true; ext.pideClave = false; repintar();
  try {
    const texto = await textoDePdf(archivo, clave);
    ext.pdf = null; ext.leyendo = false;
    if (!texto.trim()) { repintar(); toast('Ese PDF es una imagen (escaneado): no tiene texto para leer. Descarga el extracto desde la app o la página del banco'); return; }
    ext.texto = texto;
    leer(texto);
  } catch (err) {
    ext.leyendo = false;
    // Los bancos suelen proteger el PDF con la cédula
    if (err && err.name === 'PasswordException') { ext.pdf = archivo; ext.pideClave = true; repintar(); toast(clave ? 'Esa no es la clave' : '🔒 Este PDF tiene clave: casi siempre es tu cédula'); return; }
    repintar();
    toast('No pude leer el PDF. Prueba copiando su texto y pegándolo aquí');
  }
}

const buscar = (id) => (ext.movs || []).find((m) => m.id === id);
registrar({
  'ext-texto'(_, el) { ext.texto = el.value; },
  'ext-leer'() {
    const campo = document.querySelector('[data-cambio="ext-texto"]'), texto = (campo ? campo.value : ext.texto) || '';
    ext.texto = texto;
    if (!texto.trim()) { toast('Pega el texto del extracto o sube el archivo'); return; }
    leer(texto);
  },
  // CSV o texto se leen directo; el PDF, con pdf.js (y su clave si la tiene)
  async 'ext-archivo'(_, el) {
    const archivo = el.files && el.files[0];
    el.value = '';
    if (!archivo) return;
    ext.nombre = archivo.name;
    if (/\.pdf$/i.test(archivo.name) || archivo.type === 'application/pdf') { await leerPdf(archivo); return; }
    if (/\.xlsx?$/i.test(archivo.name)) { toast('Ese es de Excel: ábrelo y guárdalo como CSV, o copia las filas y pégalas aquí'); return; }
    ext.texto = await archivo.text();
    leer(ext.texto);
  },
  'ext-clave'() {
    const campo = document.querySelector('[data-t="ext-clave"] input'), clave = campo ? campo.value.trim() : '';
    if (!ext.pdf) return;
    if (!clave) { toast('Escribe la clave del PDF'); return; }
    leerPdf(ext.pdf, clave);
  },
  // La cuenta del extracto: si es una tarjeta de crédito, las compras sin signo son gastos y el pago no se pasa
  'ext-metodo'(_, el) {
    ext.metodo = el.value;
    if (ext.movs && esTarjeta(ext.metodo) !== ext.tarjeta) leer(ext.texto); else repintar();
  },
  'ext-filtro'({ v }) { ext.filtro = v; ext.abierto = null; repintar(); },
  'ext-abrir'({ id }) { ext.abierto = ext.abierto === id ? null : id; repintar(); },
  'ext-pasar'({ id }) { const m = buscar(id); if (m) { m.pasar = !m.pasar; repintar(); } },
  'ext-todos'({ v }) { for (const m of ext.movs || []) if (!m.ya || v !== 'si') m.pasar = v === 'si' && !m.interno; repintar(); },
  'ext-tipo'({ id }) {
    const m = buscar(id); if (!m) return;
    m.tipo = m.tipo === 'gasto' ? 'ingreso' : 'gasto';
    m.categoria = m.tipo === 'ingreso' ? 'otro-ingreso' : 'otros'; delete m.sub; delete m.banco;
    repintar();
  },
  // Corregir la categoría la aprende para ese comercio y la aplica a los demás iguales de este extracto
  'ext-cat'({ id }, el) {
    const m = buscar(id); if (!m) return;
    const [categoria, sub] = el.value.split('/');
    const reglas = (f().reglasExtracto ??= {}), k = claveDe(m.desc);
    reglas[k] = el.value;
    let otros = 0;
    for (const x of ext.movs) if (x.clave === k && x.tipo === m.tipo) { if (x !== m) otros++; x.categoria = categoria; if (sub) x.sub = sub; else delete x.sub; }
    guardar();
    toast('✓ ' + (otros ? 'Este y ' + otros + ' más iguales' : 'Listo') + ': la próxima vez lo clasifico así');
  },
  'ext-importar'() {
    const lista = (ext.movs || []).filter((m) => m.pasar);
    if (!lista.length) { toast('Marca los movimientos que quieres pasar'); return; }
    const nuevos = lista.map((m) => agregarMovimiento(f(), {
      tipo: m.tipo, monto: m.monto, categoria: m.categoria, ...(m.sub ? { sub: m.sub } : {}), metodo: ext.metodo || metodoPorDefecto(), nota: m.desc.slice(0, 80), fecha: m.fecha, importado: 'extracto',
      // Cuota de manejo o comisión: es un gasto del banco, no el pago de una deuda
      ...(m.categoria === 'deudas' ? { noEsDeuda: true } : {}),
    }, m.fecha));
    for (const m of lista) { m.ya = 'pasado'; m.pasar = false; }
    ext.ultimos = nuevos.map((x) => x.id);
    anotarPatrimonio(f());
    guardar();
    const total = lista.filter((m) => m.tipo === 'gasto').reduce((s, m) => s + m.monto, 0);
    toast('✓ ' + nuevos.length + ' movimientos pasados a Finanzas' + (total ? ' · ' + pesos(total) + ' en gastos' : ''), () => {
      for (const id of ext.ultimos || []) quitarMovimiento(f(), id);
      for (const m of ext.movs || []) if (m.ya === 'pasado') { m.ya = null; m.pasar = true; }
      ext.ultimos = null; anotarPatrimonio(f()); guardar();
    });
  },
  'ext-limpiar'() { Object.assign(ext, { texto: '', movs: null, pdf: null, pideClave: false, abierto: null, nombre: '', ultimos: null, filtro: 'todos', compraAbierta: null }); repintar(); },

  // ---------- 💳 Cuotas y quién paga ----------
  'cu-abrir'({ id }) { ext.compraAbierta = ext.compraAbierta === id ? null : id; repintar(); },
  'cu-persona-nueva'() {
    const campo = document.querySelector('[data-t="cu-persona"] input'), nombre = campo ? campo.value.trim().slice(0, 30) : '';
    if (!nombre) { toast('Escribe el nombre'); return; }
    const lista = personas();
    if (lista.some((p) => p.toLowerCase() === nombre.toLowerCase())) { toast(nombre + ' ya está'); return; }
    f().personas = [...lista, nombre];
    guardar();
    if (campo) campo.value = '';
  },
  'cu-persona-quitar'({ p }) {
    if (p === personas()[0]) return;
    f().personas = personas().filter((x) => x !== p);
    for (const g of Object.values(f().compras || {})) if (g.quien) g.quien = g.quien.filter((x) => x !== p);
    guardar();
    toast(p + ' quitado: sus compras vuelven a ' + personas()[0]);
  },
  // Tocar una persona la suma o la quita de la compra; con varias, la compra se divide por partes iguales.
  // Se recuerda para esa compra (en los próximos extractos) y para ese comercio
  'cu-quien'({ id, p }) {
    const c = compraDe(id); if (!c) return;
    const g = guardada(c), antes = quienDe(c, personas());
    let quien = antes.includes(p) ? antes.filter((x) => x !== p) : [...antes, p];
    if (!quien.length) quien = [personas()[0]];
    g.quien = quien;
    (f().reglasQuien ??= {})[claveDe(c.desc)] = quien;
    guardar();
  },
  // Corregir lo leído: valor original, cuántas cuotas, en cuál va y la tasa mensual de esa compra
  'cu-campo'({ id, k }, el) {
    const c = compraDe(id); if (!c || !['original', 'n', 'k', 'tasa'].includes(k)) return;
    const v = k === 'original' ? leerMonto(el.value) : Number(String(el.value).replace(',', '.'));
    const g = guardada(c);
    if (!(v >= 0) || (k !== 'tasa' && !v)) delete g[k]; else g[k] = k === 'n' || k === 'k' ? Math.round(v) : v;
    guardar();
  },
  // La tasa de la tarjeta, para las compras que no la traen en el extracto (en % mensual o E.A.)
  'cu-tasa'(_, el) {
    const campo = document.querySelector('[data-t="cu-tasa"] input'), tipo = document.querySelector('[data-t="cu-tasa"] select');
    const v = Number(String((campo || el).value).replace(',', '.'));
    const t = (f().tasasTarjeta ??= {}), id = ext.metodo || metodoPorDefecto();
    if (v > 0) t[id] = { valor: v, tipo: tipo ? tipo.value : 'mensual' }; else delete t[id];
    guardar();
  },
  'cu-copiar'({ p }) {
    const x = porPersona(compras(), personas()).find((y) => y.nombre === p);
    if (x) copiarTexto(textoPersona(x, { tarjeta: nombreTarjeta() }), '📋 Detalle de ' + p + ' copiado');
  },
});
