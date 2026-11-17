// 💼 Ventas (solo el superadmin): los productos en PDF, la página de venta (vista previa en celular o PC y descarga del HTML
// para publicarla en un proyecto aparte), el PDF de ejemplo para imprimir, el registro de ventas con gráfico y la lista
// para lanzar. Todo viene con un ejemplo armado; se cambia aquí mismo.
import { useState, type ReactNode } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { guardar } from '../../estado.js';
import { iso, fechaCorta } from '../../fechas.js';
import { toast as avisar, miles } from '../../ui.js';
import { leerMonto } from '../../finanzas.js';
import { barras } from '../../graficos.js';
import { ventasDe, nuevoProducto, nuevaVenta, faltantes, resumenVentas, avanceLista, paginaVenta, pesosCOP, ESTADOS_PRODUCTO, CANALES, LISTA_LANZAMIENTO } from '../../ventas.js';
import { PDFS } from '../../ventas-pdf.js';
import { usarEstado } from '../usarEstado';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo, CampoLista, DOS } from '../ui/Campo';
import { TituloPantalla, Nota, Detalle } from '../ui/Textos';
import { Opciones, HtmlViejo, Cifras, Avance, Marcable } from '../ui/Varios';

const VISTA = 'ventas';
const toast = avisar as (mensaje: string, deshacer?: (() => void) | null) => void;
type Producto = {
  id: string; nombre: string; formato: string; pdf: string | null; estado: string; promesa: string; precio: number; garantia: number; plataforma: string; link: string;
  incluye: string[]; paraQuien: string[]; noEsPara: string[]; faq: [string, string][];
};
type Autor = { nombre: string; credencial: string; historia: string; whatsapp: string };
type Venta = { id: string; fecha: string; producto: string; monto: number; canal: string };
type Datos = { productos: Producto[]; registro: Venta[]; lista: Record<string, boolean>; autor: Autor };
type Pestana = 'productos' | 'pagina' | 'pdf' | 'ventas' | 'lanzar';
type Texto = 'nombre' | 'formato' | 'promesa' | 'plataforma' | 'link';
type Renglones = 'incluye' | 'paraQuien' | 'noEsPara' | 'faq';
type Entrada = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const PESTANAS: [Pestana, string][] = [['productos', '📦 Productos'], ['pagina', '🛍️ Página'], ['pdf', '📄 PDF'], ['ventas', '💰 Ventas'], ['lanzar', '🚀 Lanzar']];
const ESTADOS = ESTADOS_PRODUCTO as [string, string][], CANALES_ = CANALES as [string, string][];
const COLOR_ESTADO: Record<string, string> = { listo: tokens.azul, venta: tokens.verde };
const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const graficoBarras = barras as (datos: { etiqueta: string; v: number; tip: string }[], opciones?: { formato?: (n: number) => string | number }) => string;
const pdfDe = PDFS as Record<string, (a: Autor) => string>;
const FILA_BOTONES = { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', my: '8px' };
const CAMPOS = { display: 'grid', gap: '8px' };
// Al salir de la pantalla y volver, sigue donde estaba
const visto: { pestana: Pestana; elegido: string | null; ancho: 'cel' | 'pc' } = { pestana: 'productos', elegido: null, ancho: 'cel' };
const lineas = (xs: string[]) => (xs || []).join('\n');
const slug = (s: string) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'pagina';
const Basura = ({ nombre, alTocar }: { nombre: string; alTocar: () => void }) => <IconButton aria-label={nombre} onClick={alTocar} sx={{ fontSize: 20 }}>🗑</IconButton>;

export default function Ventas() {
  const estado = usarEstado(), v = ventasDe(estado) as Datos;
  const [pestana, ponerPestana] = useState(visto.pestana), [elegido, ponerElegido] = useState(visto.elegido), [ancho, ponerAncho] = useState(visto.ancho);
  const producto = v.productos.find((p) => p.id === elegido) || v.productos[0];
  const ir = (p: Pestana, id: string | null = elegido) => { visto.pestana = p; visto.elegido = id; ponerPestana(p); ponerElegido(id); window.scrollTo(0, 0); };
  const elegir = (id: string) => { visto.elegido = id; ponerElegido(id); };

  // ---------- Acciones (las mismas reglas de siempre). Cada campo guarda al salir de él ----------
  function guardarTexto(p: Producto, k: Texto, el: Entrada) {
    const val = el.value.trim();
    if (k === 'nombre' && !val) { toast('El nombre no puede quedar vacío'); el.value = p.nombre; return; }
    if (p[k] === val) return;
    p[k] = val; guardar();
  }
  function guardarRenglones(p: Producto, k: Renglones, el: Entrada) {
    const ls = el.value.split('\n').map((x) => x.trim()).filter(Boolean);
    if (k === 'faq') p.faq = ls.map((x) => { const [q, ...r] = x.split('|'); return [q.trim(), r.join('|').trim()] as [string, string]; }).filter(([q]) => q);
    else p[k] = ls;
    guardar();
  }
  const guardarPrecio = (p: Producto, el: Entrada) => { p.precio = Math.max(0, leerMonto(el.value) || 0); el.value = p.precio ? miles(p.precio) : ''; guardar(); };
  const guardarGarantia = (p: Producto, el: Entrada) => { p.garantia = Math.min(60, Math.max(0, Math.round(Number(el.value) || 0))); el.value = String(p.garantia); guardar(); };
  function ponerEstado(p: Producto, k: string) {
    const f: string[] = faltantes(p, v.autor);
    if (k === 'venta' && f.length) { toast('Para ponerlo a la venta falta: ' + f.join(', ')); return; }
    p.estado = k; guardar();
  }
  function nuevo() {
    v.productos.push(nuevoProducto() as Producto); guardar();
    // El nombre del nuevo queda listo para escribir encima
    setTimeout(() => { const t = document.querySelectorAll<HTMLInputElement>('#vista [data-k=nombre]'); if (t.length) { t[t.length - 1].focus(); t[t.length - 1].select(); } }, 60);
  }
  function borrar(p: Producto) {
    const k = v.productos.indexOf(p);
    if (k < 0 || !confirm('¿Borrar «' + p.nombre + '»?')) return;
    v.productos.splice(k, 1); guardar(); toast('Producto borrado', () => { v.productos.splice(k, 0, p); guardar(); });
  }
  const guardarAutor = (k: keyof Autor, el: Entrada) => { const val = el.value.trim(); if (v.autor[k] !== val) { v.autor[k] = val; guardar(); } };
  function descargar() {
    const html = paginaVenta(producto, v.autor, { ejemplo: !producto.link }), a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = slug(producto.nombre) + '.html';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('⬇️ Página descargada' + (producto.link ? '' : ': aún dice «ejemplo» porque no tiene link de pago'));
  }
  function imprimir(p: Producto) {
    if (!p.pdf || !pdfDe[p.pdf]) return;
    let caja = document.getElementById('imprimir');
    if (!caja) { caja = document.createElement('div'); caja.id = 'imprimir'; document.body.appendChild(caja); }
    const papel = caja;
    papel.innerHTML = pdfDe[p.pdf](v.autor);
    document.body.classList.add('imprimiendo');
    const fin = () => { document.body.classList.remove('imprimiendo'); papel.innerHTML = ''; window.removeEventListener('afterprint', fin); };
    window.addEventListener('afterprint', fin);
    window.print();
  }
  function vender() {
    const val = (id: string) => (document.getElementById(id) as Entrada | null)?.value || '';
    const id = val('vt-v-producto'), p = v.productos.find((x) => x.id === id);
    const escrito = leerMonto(val('vt-v-monto')), monto = escrito > 0 ? escrito : p ? p.precio : 0;
    if (!(monto > 0)) { toast('Escribe el valor de la venta'); return; }
    v.registro.push(nuevaVenta(id, monto, val('vt-v-fecha') || iso(), val('vt-v-canal')) as Venta); guardar();
    toast('💰 Venta de ' + pesosCOP(monto) + ' registrada');
  }
  function borrarVenta(x: Venta) {
    const k = v.registro.indexOf(x); if (k < 0) return;
    v.registro.splice(k, 1); guardar(); toast('Venta borrada', () => { v.registro.splice(k, 0, x); guardar(); });
  }
  const alternarLista = (k: string) => { if (v.lista[k]) delete v.lista[k]; else v.lista[k] = true; guardar(); };

  // ---------- Pestañas (se llaman como funciones para que React conserve los campos entre pintadas) ----------
  const elegirProducto = (filtro: (p: Producto) => unknown = () => true) => (
    <Opciones nombre="Producto" envolver activa={producto.id} alElegir={elegir} opciones={v.productos.filter(filtro).map((p) => [p.id, p.nombre.split('·')[0].trim()] as [string, string])} />
  );

  function productos() {
    return (
      <>
        <Nota>Cuatro productos de ejemplo: tres PDF de entrada y el plan con entrenador en la app como lo premium. Cambia lo que quieras: lo que escribas aquí es lo que sale en la página de venta.</Nota>
        {v.productos.map((p, i) => {
          const f: string[] = faltantes(p, v.autor), est = ESTADOS.find(([k]) => k === p.estado) || ESTADOS[0];
          const texto = (k: Texto, t: string, extra: object = {}) => <Campo etiqueta={t} data-i={i} data-k={k} defaultValue={p[k] ?? ''} onBlur={(ev) => guardarTexto(p, k, ev.currentTarget)} {...extra} />;
          const area = (k: Renglones, t: string, valor: string, ayuda: string, filas = 3) => <CampoLargo etiqueta={t} filas={filas} data-i={i} data-k={k} defaultValue={valor} placeholder={ayuda} onBlur={(ev) => guardarRenglones(p, k, ev.currentTarget)} />;
          return (
            <TarjetaPlegable key={p.id} vista={VISTA} clave={p.nombre + ' ' + est[1]}
              titulo={<>{p.nombre} <Box component="small" sx={{ fontSize: 12, fontWeight: 700, p: '2px 8px', borderRadius: 999, bgcolor: tokens.surface2, color: COLOR_ESTADO[p.estado] || 'text.secondary', verticalAlign: 'middle' }}>{est[1]}</Box></>}>
              <Nota>{p.formato} · {p.precio > 0 ? pesosCOP(p.precio) : 'sin precio'}{f.length ? <> · <Box component="span" sx={{ color: 'warning.main' }}>Falta: {f.join(', ')}</Box></> : ' · ✓ completo'}</Nota>
              <Opciones nombre="Estado" chica envolver activa={p.estado} alElegir={(k) => ponerEstado(p, k)} opciones={ESTADOS} />
              <Box sx={CAMPOS}>
                {texto('nombre', 'Nombre')}
                {texto('formato', 'Formato')}
                <CampoLargo etiqueta="Promesa (lo que logra, en una frase)" filas={2} data-i={i} data-k="promesa" defaultValue={p.promesa} onBlur={(ev) => guardarTexto(p, 'promesa', ev.currentTarget)} />
                <Box sx={DOS}>
                  <Campo etiqueta="Precio" inputMode="numeric" data-pesos="" data-i={i} defaultValue={p.precio ? miles(p.precio) : ''} placeholder="$ 0" onBlur={(ev) => guardarPrecio(p, ev.currentTarget)} />
                  <Campo etiqueta="Garantía (días)" inputMode="numeric" data-i={i} defaultValue={p.garantia || 0} onBlur={(ev) => guardarGarantia(p, ev.currentTarget)} />
                </Box>
                <Box sx={DOS}>
                  <CampoLista etiqueta="Cobra con" data-i={i} data-k="plataforma" opciones={CANALES_.slice(0, 3)} defaultValue={p.plataforma} onChange={(ev) => guardarTexto(p, 'plataforma', ev.currentTarget)} />
                  {texto('link', 'Link de pago', { inputMode: 'url', placeholder: 'https://pay.hotmart.com/…' })}
                </Box>
                {area('incluye', 'Qué incluye (uno por renglón)', lineas(p.incluye), 'Un punto por renglón', 4)}
                <Box sx={DOS}>
                  {area('paraQuien', 'Es para ti si… (uno por renglón)', lineas(p.paraQuien), 'Empiezas de cero…')}
                  {area('noEsPara', 'No es para ti si…', lineas(p.noEsPara), 'Buscas resultados en 2 semanas…')}
                </Box>
                {area('faq', 'Preguntas frecuentes (pregunta | respuesta, una por renglón)', (p.faq || []).map(([q, r]) => q + ' | ' + r).join('\n'), '¿Necesito gym? | No, trae versión en casa.', 3)}
              </Box>
              <Box sx={FILA_BOTONES}>
                <Button color="secondary" onClick={() => ir('pagina', p.id)}>🛍️ Ver su página</Button>
                {p.pdf && <Button color="secondary" onClick={() => ir('pdf', p.id)}>📄 Ver el PDF</Button>}
                <Basura nombre={'Borrar ' + p.nombre} alTocar={() => borrar(p)} />
              </Box>
            </TarjetaPlegable>
          );
        })}
        <Button onClick={nuevo}>＋ Producto</Button>
      </>
    );
  }

  function pagina() {
    const a = v.autor, html: string = paginaVenta(producto, a), falta: string[] = faltantes(producto, a);
    const dato = (k: keyof Autor, t: string, ayuda: string) => <Campo etiqueta={t} data-k={k} defaultValue={a[k] || ''} placeholder={ayuda} onBlur={(ev) => guardarAutor(k, ev.currentTarget)} />;
    const t1 = '🛍️ Vista previa de la página', t2 = '🙋 Quién vende (sale en todas las páginas)';
    return (
      <>
        {elegirProducto()}
        <TarjetaPlegable vista={VISTA} clave={t1} titulo={t1}>
          <Nota>Así se vería la página de venta de <b>{producto.nombre}</b>. Sigue lo que funciona en páginas como la de Oso Musculoso (promesa clara, qué incluye, entrega inmediata, botón repetido), sin lo que no se debe copiar: precio tachado inventado y testimonios falsos.</Nota>
          <Opciones nombre="Ver en" activa={ancho} alElegir={(k) => { visto.ancho = k; ponerAncho(k); }} opciones={[['cel', '📱 Celular'], ['pc', '🖥️ Computador']]} />
          <Box sx={{ m: '10px auto', border: '1px solid', borderColor: 'divider', borderRadius: '16px', overflow: 'hidden', bgcolor: '#0f1316', maxWidth: '100%', width: ancho === 'cel' ? 390 : '100%' }}>
            <Box component="iframe" title="Vista previa de la página de venta" srcDoc={html} sandbox="allow-same-origin" sx={{ display: 'block', width: '100%', height: 'min(78vh, 760px)', border: 0, bgcolor: '#0f1316' }} />
          </Box>
          {falta.length > 0 && <Aviso>Antes de publicarla falta: {falta.join(', ')}.</Aviso>}
          <Box sx={FILA_BOTONES}><Button onClick={descargar}>⬇️ Descargar la página (HTML)</Button></Box>
          <Nota>El archivo se publica gratis en un proyecto aparte (por ejemplo Netlify o Cloudflare Pages, arrastrando el archivo), no en esta app. El cobro lo hace el link de pago.</Nota>
        </TarjetaPlegable>
        <TarjetaPlegable vista={VISTA} clave={t2} titulo={t2}>
          <Nota>Es lo que más confianza da y lo que Oso Musculoso no muestra. Escribe solo lo que es verdad.</Nota>
          <Box sx={CAMPOS}>
            {dato('nombre', 'Nombre o marca', 'Ej.: Diego Zapata · Entrena con plan')}
            {dato('credencial', 'Tu experiencia', 'Ej.: 10 años entrenando, he guiado a 15 personas')}
            <CampoLargo etiqueta="Tu historia (2 o 3 frases)" filas={3} data-k="historia" defaultValue={a.historia || ''} placeholder="Por qué empezaste y qué aprendiste" onBlur={(ev) => guardarAutor('historia', ev.currentTarget)} />
            {dato('whatsapp', 'WhatsApp de contacto', '57300…')}
          </Box>
        </TarjetaPlegable>
      </>
    );
  }

  function pdf() {
    const tiene = (x: Producto) => !!(x.pdf && pdfDe[x.pdf]);
    const con = v.productos.filter(tiene), p = tiene(producto) ? producto : con[0];
    const otros = v.productos.filter((x) => /pdf/i.test(x.formato) && !tiene(x));
    return (
      <>
        {con.length > 1 && elegirProducto(tiene)}
        {p ? (
          <TarjetaPlegable vista={VISTA} clave={'📄 ' + p.nombre} titulo={'📄 ' + p.nombre}>
            <Nota>El PDF de ejemplo completo (unas 20 páginas al imprimir). Toca <b>Imprimir</b> y elige «Guardar como PDF»: ese archivo es el que subes a la plataforma de pago para la entrega automática.</Nota>
            <Box sx={FILA_BOTONES}><Button onClick={() => imprimir(p)}>🖨️ Imprimir o guardar en PDF</Button></Box>
            {/* El documento lo arma ventas-pdf.js como HTML; "vt-papel" es la hoja blanca (estilos del documento, en armazon/estilosArmazon.ts) */}
            <HtmlViejo clase="vt-papel" html={pdfDe[p.pdf!](v.autor)} />
          </TarjetaPlegable>
        ) : <Aviso>Aún no hay ningún PDF escrito.</Aviso>}
        {otros.length > 0 && <Nota>Sin escribir todavía: {otros.map((x) => x.nombre).join(' · ')}. Pídele a Claude «escribe el PDF de …» y queda aquí igual que este.</Nota>}
      </>
    );
  }

  function ventas() {
    const r = resumenVentas(v) as { esteMes: { monto: number; n: number }; total: number; ventas: number; ticket: number; meses: { mes: string; monto: number; n: number }[]; porProducto: { producto: string; monto: number; n: number }[] };
    const nombre = (id: string) => (v.productos.find((p) => p.id === id) || { nombre: 'Producto borrado' }).nombre;
    const mes = (m: string) => MES[Number(m.slice(5, 7)) - 1];
    const t1 = '💰 Cómo van las ventas', t2 = '＋ Registrar una venta', t3 = '🧾 Ventas registradas';
    return (
      <>
        <TarjetaPlegable vista={VISTA} clave={t1} titulo={t1}>
          <Cifras datos={[
            { titulo: 'Este mes', valor: pesosCOP(r.esteMes.monto), nota: r.esteMes.n + ' ventas' },
            { titulo: 'En total', valor: pesosCOP(r.total), nota: r.ventas + ' ventas' },
            { titulo: 'Venta promedio', valor: pesosCOP(r.ticket) },
          ]} />
          {r.ventas ? (
            <>
              {/* El gráfico todavía lo dibuja graficos.js (lo usan las pantallas de antes) */}
              <HtmlViejo html={graficoBarras(r.meses.map((m) => ({ etiqueta: mes(m.mes), v: m.monto, tip: mes(m.mes) + ': ' + pesosCOP(m.monto) + ' · ' + m.n + ' ventas' })), { formato: (n: number) => (n >= 1e6 ? Math.round(n / 1e5) / 10 + ' M' : Math.round(n / 1000) + ' k') })} />
              <Box component="ul" sx={{ listStyle: 'none', m: '8px 0', p: 0, display: 'grid', gap: '8px' }}>
                {r.porProducto.map((x) => (
                  <Box component="li" key={x.producto} sx={{ display: 'grid', gridTemplateColumns: 'minmax(70px, 30%) minmax(0, 1fr) auto', gap: '8px', alignItems: 'center', fontSize: 14 }}>
                    <Box component="span" sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{nombre(x.producto)}</Box>
                    <Box component="span" sx={{ position: 'relative', height: 12, borderRadius: '6px', bgcolor: tokens.surface2 }}>
                      <Box component="span" sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: '6px', bgcolor: 'success.main', width: Math.round(x.monto / r.porProducto[0].monto * 100) + '%' }} />
                    </Box>
                    <Box component="b" sx={{ fontVariantNumeric: 'tabular-nums', minWidth: '4.5em', textAlign: 'right' }}>{x.n}</Box>
                  </Box>
                ))}
              </Box>
            </>
          ) : <Nota>Cuando registres ventas, aquí verás los últimos 6 meses y qué producto se vende más.</Nota>}
        </TarjetaPlegable>
        <TarjetaPlegable vista={VISTA} clave={t2} titulo={t2}>
          <Box sx={DOS}>
            <CampoLista etiqueta="Producto" id="vt-v-producto" opciones={v.productos.map((p) => [p.id, p.nombre])} />
            <Campo etiqueta="Valor (lo que te llegó)" id="vt-v-monto" inputMode="numeric" data-pesos="" placeholder={pesosCOP(v.productos[0] ? v.productos[0].precio : 0)} />
            <Campo etiqueta="Fecha" id="vt-v-fecha" type="date" defaultValue={iso()} />
            <CampoLista etiqueta="Canal" id="vt-v-canal" opciones={CANALES_} />
          </Box>
          <Button sx={{ mt: '8px' }} onClick={vender}>Registrar venta</Button>
          <Nota>Vacío = el precio del producto. Anota lo que de verdad te llegó (después de la comisión de la plataforma).</Nota>
        </TarjetaPlegable>
        {v.registro.length > 0 && (
          <TarjetaPlegable vista={VISTA} clave={t3} titulo={t3}>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {v.registro.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 30).map((x) => (
                <Box component="li" key={x.id} sx={{ display: 'flex', alignItems: 'center', gap: '10px', py: '6px', borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                  <Box component="span" sx={{ flex: 1, minWidth: 0 }}>{nombre(x.producto)}<Detalle>{fechaCorta(x.fecha)} · {(CANALES_.find(([k]) => k === x.canal) || ['', x.canal])[1]}</Detalle></Box>
                  <b>{pesosCOP(x.monto)}</b>
                  <Basura nombre="Borrar la venta" alTocar={() => borrarVenta(x)} />
                </Box>
              ))}
            </Box>
          </TarjetaPlegable>
        )}
      </>
    );
  }

  function lanzar() {
    const a = avanceLista(v) as { hechos: number; total: number }, t1 = '🚀 Lista para lanzar', t2 = '💡 El embudo que te recomiendo';
    return (
      <>
        <TarjetaPlegable vista={VISTA} clave={t1} titulo={t1}>
          <Nota>Lo que falta para la primera venta, en orden. Nada de esto se puede saltar sin riesgo.</Nota>
          <Cifras datos={[{ titulo: 'Hecho', valor: a.hechos + ' / ' + a.total }]} />
          <Avance parte={a.hechos / a.total} />
        </TarjetaPlegable>
        {(LISTA_LANZAMIENTO as [string, [string, string][]][]).map(([grupo, xs]) => (
          <TarjetaPlegable key={grupo} vista={VISTA} clave={grupo} titulo={grupo}>
            {xs.map(([k, t]) => <Marcable key={k} hecho={!!v.lista[k]} alTocar={() => alternarLista(k)}>{t}</Marcable>)}
          </TarjetaPlegable>
        ))}
        <TarjetaPlegable vista={VISTA} clave={t2} titulo={t2}>
          <Box component="ol" sx={{ pl: '22px', m: 0, display: 'grid', gap: '6px' }}>
            <li><b>Contenido gratis</b> (consejos en Instagram o TikTok) → lleva a la página.</li>
            <li><b>PDF de entrada</b> ({pesosCOP((v.productos[0] || {}).precio)}): resuelve un problema y demuestra que sabes.</li>
            <li><b>Al final del PDF</b>, la invitación al plan con entrenador en la app: ahí está la plata recurrente.</li>
            <li><b>Testimonios reales</b> de quienes lo siguieron → la página vende sola.</li>
          </Box>
        </TarjetaPlegable>
      </>
    );
  }

  return (
    <>
      <TituloPantalla>Ventas</TituloPantalla>
      <Nota>🔒 Solo la ves tú (superadmin). Todo viene con un ejemplo para que veas cómo sería; cámbialo a tu gusto.</Nota>
      <Opciones nombre="Secciones de Ventas" envolver activa={pestana} alElegir={(p) => ir(p)} opciones={PESTANAS} />
      {{ pagina, pdf, ventas, lanzar, productos }[pestana]()}
    </>
  );
}

// Aviso amarillo (lo que falta, lo que hay que tener en cuenta)
function Aviso({ children }: { children: ReactNode }) {
  return <Box component="p" sx={{ color: 'warning.main', bgcolor: '#3a2d10', borderRadius: '10px', p: '8px 10px', fontSize: 14, my: '8px' }}>{children}</Box>;
}
