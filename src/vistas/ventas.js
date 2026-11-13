// 💼 Ventas (solo el superadmin): los productos en PDF, la página de venta (vista previa en celular o PC y descarga del HTML
// para publicarla en un proyecto aparte), el PDF de ejemplo para imprimir, el registro de ventas con gráfico y la lista
// para lanzar. Todo viene con un ejemplo armado; se cambia aquí mismo.
import { e, guardar, repintar } from '../estado.js';
import { iso, fechaCorta } from '../fechas.js';
import { esc, registrar, toast, barra, miles } from '../ui.js';
import { leerMonto } from '../finanzas.js';
import { barras } from '../graficos.js';
import { ventasDe, nuevoProducto, nuevaVenta, faltantes, resumenVentas, avanceLista, paginaVenta, pesosCOP, ESTADOS_PRODUCTO, CANALES, LISTA_LANZAMIENTO } from '../ventas.js';
import { PDFS } from '../ventas-pdf.js';

let pestana = 'productos', elegido = null, ancho = 'cel';
const V = () => ventasDe(e());
const producto = () => { const ps = V().productos; return ps.find((p) => p.id === elegido) || ps[0]; };
const lineas = (xs) => (xs || []).join('\n');
const campo = (i, k, t, valor, extra = '') => '<label class="campo">' + t + '<input type="text" data-cambio="vt-campo" data-i="' + i + '" data-k="' + k + '" value="' + esc(valor ?? '') + '" autocomplete="off"' + extra + '></label>';
const area = (i, k, t, valor, ayuda, filas = 3) => '<label class="campo">' + t + '<textarea rows="' + filas + '" data-cambio="vt-lineas" data-i="' + i + '" data-k="' + k + '" placeholder="' + esc(ayuda) + '">' + esc(valor) + '</textarea></label>';
const elegirProducto = (filtro = () => true) => '<nav class="chips envolver" aria-label="Producto">' + V().productos.filter(filtro).map((p) =>
  '<button type="button" class="chip' + (p.id === producto().id ? ' activo' : '') + '" data-accion="vt-elegir" data-id="' + p.id + '" aria-pressed="' + (p.id === producto().id) + '">' + esc(p.nombre.split('·')[0].trim()) + '</button>').join('') + '</nav>';

function productos() {
  const v = V();
  return '<p class="nota-corta">Cuatro productos de ejemplo: tres PDF de entrada y el plan con entrenador en la app como lo premium. Cambia lo que quieras: lo que escribas aquí es lo que sale en la página de venta.</p>' +
    v.productos.map((p, i) => {
      const f = faltantes(p, v.autor), est = ESTADOS_PRODUCTO.find(([k]) => k === p.estado) || ESTADOS_PRODUCTO[0];
      return '<section class="tarjeta vt-producto" data-ancla="vt-' + p.id + '"><h2>' + esc(p.nombre) + ' <small class="vt-estado ' + p.estado + '">' + est[1] + '</small></h2>' +
        '<p class="nota-corta">' + esc(p.formato) + ' · ' + (p.precio > 0 ? pesosCOP(p.precio) : 'sin precio') + (f.length ? ' · <span class="vt-falta">Falta: ' + f.join(', ') + '</span>' : ' · ✓ completo') + '</p>' +
        '<div class="chips envolver" role="group" aria-label="Estado">' + ESTADOS_PRODUCTO.map(([k, t]) => '<button type="button" class="chip mini' + (p.estado === k ? ' activo' : '') + '" data-accion="vt-estado" data-i="' + i + '" data-v="' + k + '" aria-pressed="' + (p.estado === k) + '">' + t + '</button>').join('') + '</div>' +
        campo(i, 'nombre', 'Nombre', p.nombre) + campo(i, 'formato', 'Formato', p.formato) +
        '<label class="campo">Promesa (lo que logra, en una frase)<textarea rows="2" data-cambio="vt-campo" data-i="' + i + '" data-k="promesa">' + esc(p.promesa) + '</textarea></label>' +
        '<div class="dos"><label class="campo">Precio<input type="text" inputmode="numeric" data-pesos data-cambio="vt-precio" data-i="' + i + '" value="' + (p.precio ? miles(p.precio) : '') + '" placeholder="$ 0"></label>' +
        '<label class="campo">Garantía (días)<input type="text" inputmode="numeric" data-cambio="vt-garantia" data-i="' + i + '" value="' + (p.garantia || 0) + '"></label></div>' +
        '<div class="dos"><label class="campo">Cobra con<select data-cambio="vt-campo" data-i="' + i + '" data-k="plataforma">' + CANALES.slice(0, 3).map(([k, t]) => '<option value="' + k + '"' + (p.plataforma === k ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></label>' +
        campo(i, 'link', 'Link de pago', p.link, ' inputmode="url" placeholder="https://pay.hotmart.com/…"') + '</div>' +
        area(i, 'incluye', 'Qué incluye (uno por renglón)', lineas(p.incluye), 'Un punto por renglón', 4) +
        '<div class="dos">' + area(i, 'paraQuien', 'Es para ti si… (uno por renglón)', lineas(p.paraQuien), 'Empiezas de cero…') + area(i, 'noEsPara', 'No es para ti si…', lineas(p.noEsPara), 'Buscas resultados en 2 semanas…') + '</div>' +
        area(i, 'faq', 'Preguntas frecuentes (pregunta | respuesta, una por renglón)', (p.faq || []).map(([q, r]) => q + ' | ' + r).join('\n'), '¿Necesito gym? | No, trae versión en casa.', 3) +
        '<div class="botones-rapidos"><button type="button" class="boton secundario" data-accion="vt-ver-pagina" data-id="' + p.id + '">🛍️ Ver su página</button>' +
          (p.pdf ? '<button type="button" class="boton secundario" data-accion="vt-ver-pdf" data-id="' + p.id + '">📄 Ver el PDF</button>' : '') +
          '<button type="button" class="icono borrar" data-accion="vt-borrar" data-i="' + i + '" aria-label="Borrar ' + esc(p.nombre) + '">🗑</button></div></section>';
    }).join('') +
    '<button type="button" class="boton primario" data-accion="vt-nuevo">＋ Producto</button>';
}

function pagina() {
  const v = V(), p = producto(), html = paginaVenta(p, v.autor);
  const a = v.autor, inp = (k, t, ayuda) => '<label class="campo">' + t + '<input type="text" data-cambio="vt-autor" data-k="' + k + '" value="' + esc(a[k] || '') + '" placeholder="' + esc(ayuda) + '" autocomplete="off"></label>';
  return elegirProducto() +
    '<section class="tarjeta"><h2>🛍️ Vista previa de la página</h2>' +
    '<p class="nota-corta">Así se vería la página de venta de <b>' + esc(p.nombre) + '</b>. Sigue lo que funciona en páginas como la de Oso Musculoso (promesa clara, qué incluye, entrega inmediata, botón repetido), sin lo que no se debe copiar: precio tachado inventado y testimonios falsos.</p>' +
    '<div class="chips" role="group" aria-label="Ver en">' + [['cel', '📱 Celular'], ['pc', '🖥️ Computador']].map(([k, t]) => '<button type="button" class="chip' + (ancho === k ? ' activo' : '') + '" data-accion="vt-ancho" data-v="' + k + '" aria-pressed="' + (ancho === k) + '">' + t + '</button>').join('') + '</div>' +
    '<div class="vt-marco ' + ancho + '"><iframe title="Vista previa de la página de venta" srcdoc="' + esc(html) + '" sandbox="allow-same-origin"></iframe></div>' +
    (faltantes(p, a).length ? '<p class="aviso">Antes de publicarla falta: ' + faltantes(p, a).join(', ') + '.</p>' : '') +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="vt-descargar">⬇️ Descargar la página (HTML)</button></div>' +
    '<p class="nota-corta">El archivo se publica gratis en un proyecto aparte (por ejemplo Netlify o Cloudflare Pages, arrastrando el archivo), no en esta app. El cobro lo hace el link de pago.</p></section>' +
    '<section class="tarjeta"><h2>🙋 Quién vende (sale en todas las páginas)</h2>' +
    '<p class="nota-corta">Es lo que más confianza da y lo que Oso Musculoso no muestra. Escribe solo lo que es verdad.</p>' +
    inp('nombre', 'Nombre o marca', 'Ej.: Diego Zapata · Entrena con plan') + inp('credencial', 'Tu experiencia', 'Ej.: 10 años entrenando, he guiado a 15 personas') +
    '<label class="campo">Tu historia (2 o 3 frases)<textarea rows="3" data-cambio="vt-autor" data-k="historia" placeholder="Por qué empezaste y qué aprendiste">' + esc(a.historia || '') + '</textarea></label>' +
    inp('whatsapp', 'WhatsApp de contacto', '57300…') + '</section>';
}

function pdf() {
  const con = V().productos.filter((p) => p.pdf && PDFS[p.pdf]);
  const p = producto().pdf && PDFS[producto().pdf] ? producto() : con[0];
  const otros = V().productos.filter((x) => /pdf/i.test(x.formato) && !(x.pdf && PDFS[x.pdf]));
  return (con.length > 1 ? elegirProducto((x) => x.pdf && PDFS[x.pdf]) : '') +
    (p ? '<section class="tarjeta"><h2>📄 ' + esc(p.nombre) + '</h2>' +
      '<p class="nota-corta">El PDF de ejemplo completo (unas 20 páginas al imprimir). Toca <b>Imprimir</b> y elige «Guardar como PDF»: ese archivo es el que subes a la plataforma de pago para la entrega automática.</p>' +
      '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="vt-imprimir" data-id="' + p.id + '">🖨️ Imprimir o guardar en PDF</button></div>' +
      '<div class="vt-papel">' + PDFS[p.pdf](V().autor) + '</div></section>' : '<p class="aviso">Aún no hay ningún PDF escrito.</p>') +
    (otros.length ? '<p class="nota-corta">Sin escribir todavía: ' + otros.map((x) => esc(x.nombre)).join(' · ') + '. Pídele a Claude «escribe el PDF de …» y queda aquí igual que este.</p>' : '');
}

function ventas() {
  const v = V(), r = resumenVentas(v), nombre = (id) => (v.productos.find((p) => p.id === id) || { nombre: 'Producto borrado' }).nombre;
  const mes = (m) => ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][Number(m.slice(5, 7)) - 1];
  return '<section class="tarjeta"><h2>💰 Cómo van las ventas</h2>' +
    '<div class="datos-peso"><div><small>Este mes</small><b>' + pesosCOP(r.esteMes.monto) + '</b><small>' + r.esteMes.n + ' ventas</small></div><div><small>En total</small><b>' + pesosCOP(r.total) + '</b><small>' + r.ventas + ' ventas</small></div>' +
    '<div><small>Venta promedio</small><b>' + pesosCOP(r.ticket) + '</b></div></div>' +
    (r.ventas ? barras(r.meses.map((m) => ({ etiqueta: mes(m.mes), v: m.monto, tip: mes(m.mes) + ': ' + pesosCOP(m.monto) + ' · ' + m.n + ' ventas' })), { formato: (n) => (n >= 1e6 ? Math.round(n / 1e5) / 10 + ' M' : Math.round(n / 1000) + ' k') }) +
      '<ul class="cc-barras">' + r.porProducto.map((x) => '<li class="cc-fila ok"><span class="cc-nombre">' + esc(nombre(x.producto)) + '</span><span class="cc-pista"><span class="cc-lleno" style="width:' + Math.round(x.monto / r.porProducto[0].monto * 100) + '%"></span></span><b>' + x.n + '</b></li>').join('') + '</ul>'
      : '<p class="nota-corta">Cuando registres ventas, aquí verás los últimos 6 meses y qué producto se vende más.</p>') + '</section>' +
    '<section class="tarjeta"><h2>＋ Registrar una venta</h2><div class="dos">' +
    '<label class="campo">Producto<select id="vt-v-producto">' + v.productos.map((p) => '<option value="' + p.id + '">' + esc(p.nombre) + '</option>').join('') + '</select></label>' +
    '<label class="campo">Valor (lo que te llegó)<input type="text" id="vt-v-monto" inputmode="numeric" data-pesos placeholder="' + esc(pesosCOP(v.productos[0] ? v.productos[0].precio : 0)) + '"></label>' +
    '<label class="campo">Fecha<input type="date" id="vt-v-fecha" value="' + iso() + '"></label>' +
    '<label class="campo">Canal<select id="vt-v-canal">' + CANALES.map(([k, t]) => '<option value="' + k + '">' + t + '</option>').join('') + '</select></label></div>' +
    '<button type="button" class="boton primario" data-accion="vt-vender">Registrar venta</button>' +
    '<p class="nota-corta">Vacío = el precio del producto. Anota lo que de verdad te llegó (después de la comisión de la plataforma).</p></section>' +
    (v.registro.length ? '<section class="tarjeta"><h2>🧾 Ventas registradas</h2><ul class="rec-lista">' + v.registro.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 30).map((x) =>
      '<li class="rec-fila"><span class="rec-nombre">' + esc(nombre(x.producto)) + '<small>' + fechaCorta(x.fecha) + ' · ' + esc((CANALES.find(([k]) => k === x.canal) || ['', x.canal])[1]) + '</small></span><b>' + pesosCOP(x.monto) + '</b>' +
      '<button type="button" class="icono borrar" data-accion="vt-venta-borrar" data-id="' + x.id + '" aria-label="Borrar la venta">🗑</button></li>').join('') + '</ul></section>' : '');
}

function lanzar() {
  const v = V(), a = avanceLista(v);
  return '<section class="tarjeta pb-resumen"><h2>🚀 Lista para lanzar</h2><p class="nota-corta">Lo que falta para la primera venta, en orden. Nada de esto se puede saltar sin riesgo.</p>' +
    '<div class="datos-peso"><div><small>Hecho</small><b>' + a.hechos + ' / ' + a.total + '</b></div></div>' + barra(a.hechos / a.total) + '</section>' +
    LISTA_LANZAMIENTO.map(([grupo, xs]) => '<section class="tarjeta"><h2>' + esc(grupo) + '</h2>' + xs.map(([k, t]) =>
      '<button type="button" class="pb-check' + (v.lista[k] ? ' hecho' : '') + '" data-accion="vt-lista" data-k="' + k + '" aria-pressed="' + !!v.lista[k] + '"><span class="pb-caja" aria-hidden="true">' + (v.lista[k] ? '✓' : '') + '</span><span>' + esc(t) + '</span></button>').join('') + '</section>').join('') +
    '<section class="tarjeta"><h2>💡 El embudo que te recomiendo</h2><ol class="puntos-libro"><li><b>Contenido gratis</b> (consejos en Instagram o TikTok) → lleva a la página.</li>' +
    '<li><b>PDF de entrada</b> (' + pesosCOP((V().productos[0] || {}).precio) + '): resuelve un problema y demuestra que sabes.</li>' +
    '<li><b>Al final del PDF</b>, la invitación al plan con entrenador en la app: ahí está la plata recurrente.</li>' +
    '<li><b>Testimonios reales</b> de quienes lo siguieron → la página vende sola.</li></ol></section>';
}

export function vistaVentas() {
  const tabs = { productos: '📦 Productos', pagina: '🛍️ Página', pdf: '📄 PDF', ventas: '💰 Ventas', lanzar: '🚀 Lanzar' };
  return '<h1>Ventas</h1><p class="nota-corta">🔒 Solo la ves tú (superadmin). Todo viene con un ejemplo para que veas cómo sería; cámbialo a tu gusto.</p>' +
    '<nav class="chips pestanas">' + Object.entries(tabs).map(([t, n]) => '<button type="button" class="chip' + (t === pestana ? ' activo' : '') + '" data-accion="vt-pestana" data-p="' + t + '">' + n + '</button>').join('') + '</nav>' +
    ({ pagina, pdf, ventas, lanzar }[pestana] || productos)();
}

const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'pagina';
registrar({
  'vt-pestana'({ p }) { pestana = p; repintar(); window.scrollTo(0, 0); },
  'vt-elegir'({ id }) { elegido = id; repintar(); },
  'vt-ancho'({ v }) { ancho = v; repintar(); },
  'vt-ver-pagina'({ id }) { elegido = id; pestana = 'pagina'; repintar(); window.scrollTo(0, 0); },
  'vt-ver-pdf'({ id }) { elegido = id; pestana = 'pdf'; repintar(); window.scrollTo(0, 0); },
  'vt-campo'({ i, k }, el) { const p = V().productos[Number(i)]; if (!p) return; const v = el.value.trim(); if (k === 'nombre' && !v) { toast('El nombre no puede quedar vacío'); repintar(); return; } p[k] = v; guardar(); },
  'vt-lineas'({ i, k }, el) {
    const p = V().productos[Number(i)]; if (!p) return;
    const ls = el.value.split('\n').map((x) => x.trim()).filter(Boolean);
    p[k] = k === 'faq' ? ls.map((x) => { const [q, ...r] = x.split('|'); return [q.trim(), r.join('|').trim()]; }).filter(([q]) => q) : ls;
    guardar();
  },
  'vt-precio'({ i }, el) { const p = V().productos[Number(i)]; if (p) { p.precio = Math.max(0, leerMonto(el.value) || 0); guardar(); } },
  'vt-garantia'({ i }, el) { const p = V().productos[Number(i)]; if (p) { p.garantia = Math.min(60, Math.max(0, Math.round(Number(el.value) || 0))); guardar(); } },
  'vt-estado'({ i, v }) {
    const p = V().productos[Number(i)]; if (!p) return;
    const f = faltantes(p, V().autor);
    if (v === 'venta' && f.length) { toast('Para ponerlo a la venta falta: ' + f.join(', ')); return; }
    p.estado = v; guardar();
  },
  'vt-nuevo'() { V().productos.push(nuevoProducto()); guardar(); setTimeout(() => { const t = document.querySelectorAll('[data-cambio=vt-campo][data-k=nombre]'); if (t.length) { t[t.length - 1].focus(); t[t.length - 1].select(); } }, 60); },
  'vt-borrar'({ i }) {
    const ps = V().productos, k = Number(i), p = ps[k]; if (!p) return;
    if (!confirm('¿Borrar «' + p.nombre + '»?')) return;
    ps.splice(k, 1); guardar(); toast('Producto borrado', () => { ps.splice(k, 0, p); guardar(); });
  },
  'vt-autor'({ k }, el) { V().autor[k] = el.value.trim(); guardar(); },
  'vt-descargar'() {
    const p = producto(), html = paginaVenta(p, V().autor, { ejemplo: !p.link }), a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = slug(p.nombre) + '.html';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('⬇️ Página descargada' + (p.link ? '' : ': aún dice «ejemplo» porque no tiene link de pago'));
  },
  'vt-imprimir'({ id }) {
    const p = V().productos.find((x) => x.id === id); if (!p || !PDFS[p.pdf]) return;
    let caja = document.getElementById('imprimir');
    if (!caja) { caja = document.createElement('div'); caja.id = 'imprimir'; document.body.appendChild(caja); }
    caja.innerHTML = PDFS[p.pdf](V().autor);
    document.body.classList.add('imprimiendo');
    const fin = () => { document.body.classList.remove('imprimiendo'); caja.innerHTML = ''; window.removeEventListener('afterprint', fin); };
    window.addEventListener('afterprint', fin);
    window.print();
  },
  'vt-vender'() {
    const v = V(), id = document.getElementById('vt-v-producto').value, p = v.productos.find((x) => x.id === id);
    const escrito = leerMonto(document.getElementById('vt-v-monto').value), monto = escrito > 0 ? escrito : p ? p.precio : 0;
    if (!(monto > 0)) { toast('Escribe el valor de la venta'); return; }
    const fecha = document.getElementById('vt-v-fecha').value || iso();
    v.registro.push(nuevaVenta(id, monto, fecha, document.getElementById('vt-v-canal').value)); guardar();
    toast('💰 Venta de ' + pesosCOP(monto) + ' registrada');
  },
  'vt-venta-borrar'({ id }) {
    const r = V().registro, k = r.findIndex((x) => x.id === id); if (k < 0) return;
    const x = r[k]; r.splice(k, 1); guardar(); toast('Venta borrada', () => { r.splice(k, 0, x); guardar(); });
  },
  'vt-lista'({ k }) { const l = V().lista; if (l[k]) delete l[k]; else l[k] = true; guardar(); },
});
