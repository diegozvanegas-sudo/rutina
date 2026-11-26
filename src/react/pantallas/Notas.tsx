// 📝 Notas, como un bloc de notas: lista de dos líneas (título y comienzo del texto, fijadas arriba) con buscador; carpetas y
// etiquetas detrás de «Filtrar» y lo de organizar en un solo «⚙️ Organizar». Al tocar una nota se abre el editor con
// formato (barra encima del teclado en el celular), que se guarda solo mientras se escribe. Papelera de 30 días.
// La lógica (HTML limpio, filtros, carpetas, etiquetas, WhatsApp) está en src/notas.js. El editor es el contentEditable
// del navegador, sin librerías: lo que se guarda pasa siempre por limpiarHtml.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, Button } from '@mui/material';
import { Vacio } from '../ui/Vacio';
import { fechaCorta } from '../../fechas.js';
import { toast, copiarTexto } from '../../ui.js';
import { Reconocedor } from '../../voz.js';
import * as N from '../../notas.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota } from '../ui/Textos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
type Filtro = { carpeta: string; etiquetas: string[]; buscar: string };
const FILA = { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' };
const CAMPO = { font: 'inherit', fontSize: 16, color: 'text.primary', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '10px', p: '10px 12px', minHeight: 44, minWidth: 0, boxSizing: 'border-box' };
const cuando = (ts: number) => {
  const d = new Date(ts), f = new Date(ts - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  return f === new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10) ? d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' }) : fechaCorta(f);
};

// Una etiqueta como chip de color; activa = rellena
function Chip({ t, activa, alTocar, chica = false }: { t: Fin; activa?: boolean; alTocar?: () => void; chica?: boolean }) {
  const cuerpo = (
    <>
      <Box component="span" aria-hidden sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: t.color, flex: 'none' }} />
      <span>{t.nombre}</span>
    </>
  );
  const sx = { display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '999px', border: '1px solid', borderColor: activa ? t.color : 'divider',
    bgcolor: activa ? tokens.surface2 : 'transparent', color: 'text.primary', font: 'inherit', fontSize: chica ? 12 : 14, p: chica ? '1px 8px' : '6px 12px', minHeight: chica ? 0 : 36, whiteSpace: 'nowrap' };
  if (!alTocar) return <Box component="span" sx={sx}>{cuerpo}</Box>;
  return <Box component="button" type="button" aria-pressed={!!activa} onClick={alTocar} sx={{ ...sx, cursor: 'pointer', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>{cuerpo}</Box>;
}

// 📁 Carpetas de un toque: una fila de botones (la elegida rellena) y "＋ Carpeta" que la crea ahí mismo.
// En la lista filtra (con "Todas" y "Sin carpeta"); en una nota la pone en esa carpeta (con "Sin carpeta")
function BotonCarpeta({ activa, alTocar, children, ...resto }: { activa: boolean; alTocar: () => void; children: ReactNode; [k: string]: Fin }) {
  return (
    <Box component="button" type="button" role="radio" aria-checked={activa} onClick={alTocar} {...resto}
      sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flex: 'none', borderRadius: '999px', border: '1px solid', borderColor: activa ? 'primary.main' : 'divider', bgcolor: activa ? tokens.brandSoft : 'transparent',
        color: activa ? 'primary.main' : 'text.primary', font: 'inherit', fontSize: 14, fontWeight: activa ? 700 : 400, p: '6px 12px', minHeight: 40, whiteSpace: 'nowrap', cursor: 'pointer', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
      {children}
    </Box>
  );
}
function ElegirCarpeta({ est, valor, alElegir, filtro = false, nombre }: { est: Fin; valor: string; alElegir: (id: string) => void; filtro?: boolean; nombre: string }) {
  const [creando, ponerCreando] = useState(false), [texto, ponerTexto] = useState(''), fila = useRef<HTMLDivElement>(null);
  const carpetas = N.carpetasEnOrden(est), vivas = filtro ? N.filtrar(est) : [];
  // En el celular la fila se desliza de lado: que la elegida quede a la vista (sin mover la página)
  useEffect(() => {
    const f = fila.current, el = f && (f.querySelector('[aria-checked="true"]') as HTMLElement | null);
    if (!f || !el || f.scrollWidth <= f.clientWidth) return;
    if (el.offsetLeft < f.scrollLeft || el.offsetLeft + el.offsetWidth > f.scrollLeft + f.clientWidth) f.scrollLeft = Math.max(0, el.offsetLeft - 12);
  }, [valor, carpetas.length]);
  const cuantas = (id: string) => vivas.filter((x: Fin) => x.carpeta === id || (N.carpetaDe(est, x.carpeta) || {}).padre === id).length;
  const sin = filtro ? vivas.filter((x: Fin) => !x.carpeta || !N.carpetaDe(est, x.carpeta)).length : 0;
  const crear = () => {
    const c = N.crearCarpeta(texto, null);
    if (!c) { ponerCreando(false); return; }
    ponerTexto(''); ponerCreando(false); alElegir(c.id);
    toast('📁 ' + c.nombre + (filtro ? ' creada' : ': la nota quedó ahí'));
  };
  return (
    <Box ref={fila} role="radiogroup" aria-label={nombre} data-t={filtro ? 'carpetas-filtro' : 'carpetas-nota'}
      sx={{ position: 'relative', display: 'flex', gap: '6px', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none', pb: '2px', '@media (min-width: 900px)': { flexWrap: 'wrap', overflowX: 'visible' } }}>
      {filtro ? <BotonCarpeta activa={!valor} alTocar={() => alElegir('')} data-carpeta-id="">Todas</BotonCarpeta> : null}
      {carpetas.map((c: Fin) => (
        <BotonCarpeta key={c.id} activa={valor === c.id} alTocar={() => alElegir(filtro && valor === c.id ? '' : c.id)} data-carpeta-id={c.id}>
          {c.nivel ? '└ ' : '📁 '}{c.nombre}{filtro ? <Box component="small" sx={{ color: 'text.secondary', fontWeight: 400 }}>{cuantas(c.id)}</Box> : null}
        </BotonCarpeta>
      ))}
      {filtro && !carpetas.length ? null : (
        <BotonCarpeta activa={valor === 'sin' || (!filtro && !valor)} alTocar={() => alElegir(filtro ? (valor === 'sin' ? '' : 'sin') : '')} data-carpeta-id="sin">
          Sin carpeta{filtro ? <Box component="small" sx={{ color: 'text.secondary', fontWeight: 400 }}>{sin}</Box> : null}
        </BotonCarpeta>
      )}
      {creando ? (
        <Box sx={{ display: 'inline-flex', gap: '4px', flex: 'none' }}>
          <Box component="input" autoFocus placeholder="Nombre de la carpeta" aria-label="Nombre para la carpeta nueva" value={texto} onChange={(ev: Fin) => ponerTexto(ev.target.value)}
            onKeyDown={(ev: Fin) => { if (ev.key === 'Enter') { ev.preventDefault(); crear(); } if (ev.key === 'Escape') ponerCreando(false); }}
            sx={{ ...CAMPO, width: '11em', minHeight: 40, p: '6px 10px' }} />
          <Button onClick={crear} disabled={!texto.trim()} aria-label="Crear y elegir la carpeta" sx={{ minHeight: 40 }}>Crear</Button>
          <Button color="secondary" onClick={() => { ponerCreando(false); ponerTexto(''); }} aria-label="Cancelar" sx={{ minHeight: 40, minWidth: 40 }}>✕</Button>
        </Box>
      ) : (
        <BotonCarpeta activa={false} alTocar={() => ponerCreando(true)} aria-label="Carpeta nueva" role="button" aria-checked={undefined}>＋ Carpeta</BotonCarpeta>
      )}
    </Box>
  );
}

// ---------- La lista ----------
function Fila({ n, est, alAbrir, conCarpeta = true }: { n: Fin; est: Fin; alAbrir: () => void; conCarpeta?: boolean }) {
  const resumen = N.resumenDe(n), tags = (n.etiquetas || []).map((id: string) => N.etiquetaDe(est, id)).filter(Boolean);
  const carpeta = conCarpeta && n.carpeta && N.carpetaDe(est, n.carpeta) ? N.rutaCarpeta(est, n.carpeta) : '';
  return (
    <Box component="li" data-nota={n.id}>
      {/* Como en un bloc de notas: arriba el título y la fecha; debajo, en gris, el comienzo del texto */}
      <Box component="button" type="button" onClick={alAbrir}
        sx={{ all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', display: 'grid', gap: '2px', p: '10px 14px', minHeight: 56, borderRadius: '12px', bgcolor: tokens.surface2, '&:hover': { bgcolor: tokens.line }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
        <Box component="span" sx={{ display: 'flex', alignItems: 'baseline', gap: '8px', minWidth: 0 }}>
          {n.fijada ? <span title="Fijada" aria-label="Fijada">📌</span> : null}
          <Box component="b" data-t="titulo" sx={{ fontWeight: 700, fontSize: 16, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{N.tituloDe(n)}</Box>
          <Box component="small" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', flex: 'none' }}>{cuando(n.editada || n.creada)}</Box>
        </Box>
        {resumen || carpeta || tags.length ? (
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, color: 'text.secondary', fontSize: 14 }}>
            {tags.slice(0, 3).map((t: Fin) => <Box key={t.id} component="span" aria-hidden sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: t.color, flex: 'none' }} />)}
            {carpeta ? <Box component="span" data-t="carpeta" sx={{ flex: 'none', maxWidth: '45%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📁 {carpeta}{resumen ? ' ·' : ''}</Box> : null}
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resumen}</Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

function Filtros({ est, f, poner }: { est: Fin; f: Filtro; poner: (f: Filtro) => void }) {
  const etiquetas = N.meta(est).etiquetas, carpetas = N.meta(est).carpetas;
  const alternar = (id: string) => poner({ ...f, etiquetas: f.etiquetas.includes(id) ? f.etiquetas.filter((x) => x !== id) : [...f.etiquetas, id] });
  // Carpetas y etiquetas no se ven hasta tocar "Filtrar": así arriba solo queda el buscador
  const activos = (f.carpeta ? 1 : 0) + f.etiquetas.length, [abierto, ponerAbierto] = useState(activos > 0);
  const nombre = f.carpeta === 'sin' ? 'Sin carpeta' : f.carpeta ? (N.carpetaDe(est, f.carpeta) || {}).nombre : '';
  return (
    <Box sx={{ display: 'grid', gap: '8px' }}>
      <Box sx={{ display: 'flex', gap: '6px' }}>
        <Box component="input" type="search" placeholder="🔎 Buscar" aria-label="Buscar notas" value={f.buscar}
          onChange={(ev: Fin) => poner({ ...f, buscar: ev.target.value })} sx={{ ...CAMPO, flex: 1 }} />
        {carpetas.length || etiquetas.length ? (
          <Button color="secondary" aria-expanded={abierto} data-t="filtrar" onClick={() => ponerAbierto(!abierto)}
            sx={{ minHeight: 44, flex: 'none', ...(activos ? ACTIVO : {}) }}>
            {activos ? '📁 ' + (nombre || 'Filtro') + (f.etiquetas.length ? ' +' + f.etiquetas.length : '') : 'Filtrar'} {abierto ? '▴' : '▾'}
          </Button>
        ) : null}
      </Box>
      {abierto ? (
        <Box sx={{ display: 'grid', gap: '8px', p: '10px', borderRadius: '12px', bgcolor: tokens.surface2 }}>
          <ElegirCarpeta est={est} valor={f.carpeta} alElegir={(id) => poner({ ...f, carpeta: id })} filtro nombre="Carpeta" />
          {etiquetas.length ? (
            <Box role="group" aria-label="Filtrar por etiqueta" sx={{ display: 'flex', gap: '6px', overflowX: 'auto', pb: '2px', scrollbarWidth: 'none' }}>
              {etiquetas.map((t: Fin) => <Chip key={t.id} t={t} activa={f.etiquetas.includes(t.id)} alTocar={() => alternar(t.id)} />)}
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}

// ---------- Carpetas y etiquetas ----------
function Renombrable({ valor, etiqueta, alGuardar }: { valor: string; etiqueta: string; alGuardar: (v: string) => void }) {
  return <Box component="input" key={valor} defaultValue={valor} aria-label={etiqueta} onBlur={(ev: Fin) => { const v = ev.target.value.trim(); if (v && v !== valor) alGuardar(v); else ev.target.value = valor; }}
    onKeyDown={(ev: Fin) => { if (ev.key === 'Enter') ev.target.blur(); }} sx={{ ...CAMPO, flex: '1 1 8em', minHeight: 40, p: '6px 10px' }} />;
}
function Carpetas({ est }: { est: Fin }) {
  const [nombre, ponerNombre] = useState(''), [padre, ponerPadre] = useState('');
  const lista = N.carpetasEnOrden(est), raiz = lista.filter((c: Fin) => !c.nivel);
  const crear = () => { if (N.crearCarpeta(nombre, padre || null)) { ponerNombre(''); toast('📁 Carpeta creada'); } };
  return (
    <Box sx={{ display: 'grid', gap: '8px' }}>
      {lista.map((c: Fin) => {
        const tieneHijas = lista.some((x: Fin) => x.padre === c.id);
        return (
          <Box key={c.id} data-carpeta={c.id} sx={{ ...FILA, pl: c.nivel ? '18px' : 0 }}>
            <span aria-hidden>{c.nivel ? '└' : '📁'}</span>
            <Renombrable valor={c.nombre} etiqueta={'Nombre de la carpeta ' + c.nombre} alGuardar={(v) => N.renombrar(c.id, v)} />
            {!tieneHijas ? (
              <Box component="select" aria-label={'Dónde va ' + c.nombre} value={c.padre || ''} onChange={(ev: Fin) => N.anidar(c.id, ev.target.value || null)} sx={{ ...CAMPO, minHeight: 40, p: '6px 8px', maxWidth: '10em' }}>
                <option value="">Arriba</option>
                {raiz.filter((x: Fin) => x.id !== c.id).map((x: Fin) => <option key={x.id} value={x.id}>Dentro de {x.nombre}</option>)}
              </Box>
            ) : null}
            <Button color="secondary" aria-label={'Borrar la carpeta ' + c.nombre}
              onClick={() => { if (confirm('¿Borrar la carpeta «' + c.nombre + '»? Sus notas pasan a «Sin carpeta»' + (tieneHijas ? ' y sus subcarpetas quedan arriba' : '') + '.')) N.quitarCarpeta(c.id); }}>🗑</Button>
          </Box>
        );
      })}
      <Box sx={FILA}>
        <Box component="input" placeholder="Carpeta nueva" aria-label="Nombre de la carpeta nueva" value={nombre} onChange={(ev: Fin) => ponerNombre(ev.target.value)}
          onKeyDown={(ev: Fin) => { if (ev.key === 'Enter') crear(); }} sx={{ ...CAMPO, flex: '1 1 10em' }} />
        {raiz.length ? (
          <Box component="select" aria-label="Dentro de" value={padre} onChange={(ev: Fin) => ponerPadre(ev.target.value)} sx={{ ...CAMPO, maxWidth: '11em' }}>
            <option value="">Arriba</option>
            {raiz.map((x: Fin) => <option key={x.id} value={x.id}>Dentro de {x.nombre}</option>)}
          </Box>
        ) : null}
        <Button onClick={crear} disabled={!nombre.trim()} aria-label="Crear carpeta">＋ Crear</Button>
      </Box>
    </Box>
  );
}
function Etiquetas({ est }: { est: Fin }) {
  const [nombre, ponerNombre] = useState(''), lista = N.meta(est).etiquetas;
  const crear = () => { if (N.crearEtiqueta(nombre)) { ponerNombre(''); toast('🏷️ Etiqueta creada'); } };
  return (
    <Box sx={{ display: 'grid', gap: '8px' }}>
      {lista.map((t: Fin) => (
        <Box key={t.id} data-etiqueta={t.id} sx={FILA}>
          <Renombrable valor={t.nombre} etiqueta={'Nombre de la etiqueta ' + t.nombre} alGuardar={(v) => N.editarEtiqueta(t.id, { nombre: v })} />
          <Box role="radiogroup" aria-label={'Color de ' + t.nombre} sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {N.COLORES.map((c) => (
              <Box key={c} component="button" type="button" role="radio" aria-checked={t.color === c} aria-label={'Color ' + c} onClick={() => N.editarEtiqueta(t.id, { color: c })}
                sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: c, cursor: 'pointer', border: '2px solid', borderColor: t.color === c ? 'text.primary' : 'transparent', p: 0 }} />
            ))}
          </Box>
          <Button color="secondary" aria-label={'Borrar la etiqueta ' + t.nombre} onClick={() => { if (confirm('¿Borrar la etiqueta «' + t.nombre + '»? Las notas no se borran.')) N.quitarEtiqueta(t.id); }}>🗑</Button>
        </Box>
      ))}
      <Box sx={FILA}>
        <Box component="input" placeholder="Etiqueta nueva" aria-label="Nombre de la etiqueta nueva" value={nombre} onChange={(ev: Fin) => ponerNombre(ev.target.value)}
          onKeyDown={(ev: Fin) => { if (ev.key === 'Enter') crear(); }} sx={{ ...CAMPO, flex: '1 1 10em' }} />
        <Button onClick={crear} disabled={!nombre.trim()} aria-label="Crear etiqueta">＋ Crear</Button>
      </Box>
    </Box>
  );
}

// ---------- Papelera ----------
function Papelera({ est, alVolver }: { est: Fin; alVolver: () => void }) {
  const lista = N.filtrar(est, {}, true);
  return (
    <>
      <Box sx={{ ...FILA, mb: '10px' }}>
        <Button color="secondary" onClick={alVolver}>← Notas</Button>
        <Box component="h2" sx={{ m: 0, fontSize: 20 }}>🗑 Papelera</Box>
      </Box>
      <Nota sx={{ mt: 0 }}>Las notas se borran solas a los {N.DIAS_PAPELERA} días de estar aquí.</Nota>
      {!lista.length ? <Nota>La papelera está vacía.</Nota> : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '6px' }}>
          {lista.map((n: Fin) => (
            <Box component="li" key={n.id} data-papelera={n.id} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto auto', alignItems: 'center', gap: '6px', p: '6px 6px 6px 12px', borderRadius: '12px', bgcolor: tokens.surface2 }}>
              <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <b>{N.tituloDe(n)}</b> <Box component="small" sx={{ color: 'text.secondary' }}>· quedan {N.diasEnPapelera(n)} días</Box>
              </Box>
              <Button color="secondary" onClick={() => { N.recuperarNota(n.id); toast('↩️ Nota recuperada'); }}>↩️ Recuperar</Button>
              <Button color="secondary" aria-label={'Borrar para siempre ' + N.tituloDe(n)} onClick={() => { if (confirm('¿Borrar «' + N.tituloDe(n) + '» para siempre? No se puede deshacer.')) N.borrarNotaYa(n.id); }}>✕</Button>
            </Box>
          ))}
        </Box>
      )}
      {lista.length > 1 ? <Button color="secondary" sx={{ mt: '12px' }} onClick={() => { if (confirm('¿Vaciar la papelera? Se borran ' + lista.length + ' notas para siempre.')) N.vaciarPapelera(); }}>Vaciar la papelera</Button> : null}
    </>
  );
}

// ---------- El editor ----------
const ACTIVO = { bgcolor: tokens.brandSoft, color: 'primary.main' };
const enEditor = (el: Fin, raiz: HTMLElement | null) => !!(raiz && el && raiz.contains(el.nodeType === 1 ? el : el.parentNode));
function cerca(raiz: HTMLElement | null, prueba: (el: HTMLElement) => boolean): HTMLElement | null {
  const s = window.getSelection();
  let el: Fin = s && s.anchorNode;
  if (el && el.nodeType !== 1) el = el.parentNode;
  while (el && el !== raiz) { if (prueba(el)) return el; el = el.parentNode; }
  return null;
}
const desenvolver = (el: HTMLElement) => { const p = el.parentNode!; while (el.firstChild) p.insertBefore(el.firstChild, el); p.removeChild(el); };
const exec = (c: string, v?: string) => document.execCommand(c, false, v);

// Un botón de la barra: no le quita el cursor al texto (preventDefault al apoyar el dedo o el mouse)
function Boton({ titulo, activo, alTocar, children }: { titulo: string; activo?: boolean; alTocar: () => void; children: ReactNode }) {
  return (
    <Box component="button" type="button" aria-label={titulo} title={titulo} aria-pressed={activo}
      onPointerDown={(ev: Fin) => ev.preventDefault()} onMouseDown={(ev: Fin) => ev.preventDefault()} onClick={alTocar}
      sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', minWidth: 40, height: 40, px: '6px', display: 'grid', placeItems: 'center', borderRadius: '8px', fontSize: 16, fontWeight: 700, color: 'text.primary', flex: 'none',
        ...(activo ? ACTIVO : {}), '&:hover': { bgcolor: tokens.line }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>{children}</Box>
  );
}

// La barra va encima del teclado en el celular (con el teclado abierto se pega al borde de arriba del teclado)
function usarTeclado(activo: boolean) {
  const [abajo, ponerAbajo] = useState<number | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!activo || !vv || !window.matchMedia('(pointer: coarse)').matches) { ponerAbajo(null); return undefined; }
    const medir = () => { const t = window.innerHeight - vv.height - vv.offsetTop; ponerAbajo(t > 120 ? t : null); };
    medir();
    vv.addEventListener('resize', medir); vv.addEventListener('scroll', medir);
    return () => { vv.removeEventListener('resize', medir); vv.removeEventListener('scroll', medir); };
  }, [activo]);
  return abajo;
}

function Editor({ n, est, alCerrar }: { n: Fin; est: Fin; alCerrar: () => void }) {
  const caja = useRef<HTMLDivElement>(null), espera = useRef<Fin>(null), rango = useRef<Range | null>(null);
  const [estado, ponerEstado] = useState<'guardado' | 'guardando'>('guardado'), [foco, ponerFoco] = useState(false), [marcas, ponerMarcas] = useState<Record<string, boolean>>({});
  const [enlace, ponerEnlace] = useState<string | null>(null), [detalles, ponerDetalles] = useState(false), [masFormato, ponerMasFormato] = useState(false);
  const [oyendo, ponerOyendo] = useState(false), [parcial, ponerParcial] = useState(''), rec = useRef<Fin>(null), seguir = useRef(false);
  const abajo = usarTeclado(foco);
  const [arriba, ponerArriba] = useState(0);
  useEffect(() => { const t = document.querySelector('.top-movil') as HTMLElement | null; ponerArriba(t && getComputedStyle(t).display !== 'none' ? t.offsetHeight : 0); }, []);

  // El contenido se pone una vez al abrir; después lo maneja el navegador (React no lo vuelve a pintar)
  useEffect(() => {
    const el = caja.current!;
    el.innerHTML = n.html || '';
    try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch (err) { /* navegador viejo */ }
    if (!n.html) { el.focus(); }
  }, [n.id]);
  // Si llega un cambio de otro equipo y no se está escribiendo, se muestra
  useEffect(() => {
    const el = caja.current;
    if (el && document.activeElement !== el && !espera.current && N.limpiarHtml(el.innerHTML) !== (n.html || '')) el.innerHTML = n.html || '';
  }, [n.html]);

  const guardarYa = () => {
    clearTimeout(espera.current); espera.current = null;
    if (caja.current) N.guardarNota(n.id, { html: caja.current.innerHTML });
    ponerEstado('guardado');
  };
  const cambio = () => { ponerEstado('guardando'); clearTimeout(espera.current); espera.current = setTimeout(guardarYa, 600); };
  // Al salir de la pantalla (o cerrar la app) no se pierde lo último
  useEffect(() => {
    const salir = () => { if (espera.current) guardarYa(); };
    window.addEventListener('pagehide', salir);
    document.addEventListener('visibilitychange', salir);
    return () => { salir(); window.removeEventListener('pagehide', salir); document.removeEventListener('visibilitychange', salir); seguir.current = false; rec.current?.abort?.(); };
  }, [n.id]);

  // Qué botones de la barra están activos donde está el cursor
  useEffect(() => {
    const ver = () => {
      const s = window.getSelection();
      if (!s || !enEditor(s.anchorNode, caja.current)) return;
      rango.current = s.rangeCount ? s.getRangeAt(0).cloneRange() : null;
      const q = (c: string) => { try { return document.queryCommandState(c); } catch (err) { return false; } };
      const bloque = cerca(caja.current, (el) => /^(H2|H3|P|LI)$/.test(el.tagName));
      ponerMarcas({ b: q('bold'), i: q('italic'), u: q('underline'), h2: bloque?.tagName === 'H2', h3: bloque?.tagName === 'H3',
        ul: !!cerca(caja.current, (el) => el.tagName === 'UL' && !el.dataset.tipo), ol: !!cerca(caja.current, (el) => el.tagName === 'OL'),
        checks: !!cerca(caja.current, (el) => el.tagName === 'UL' && el.dataset.tipo === 'checks'), mark: !!cerca(caja.current, (el) => el.tagName === 'MARK' || (el.tagName === 'SPAN' && /background/.test(el.getAttribute('style') || ''))),
        a: !!cerca(caja.current, (el) => el.tagName === 'A') });
    };
    document.addEventListener('selectionchange', ver);
    return () => document.removeEventListener('selectionchange', ver);
  }, []);

  const volverAlCursor = () => {
    const el = caja.current!;
    el.focus();
    const s = window.getSelection();
    if (rango.current && s && enEditor(rango.current.startContainer, el)) { s.removeAllRanges(); s.addRange(rango.current); }
  };
  const hacer = (f: () => void) => { volverAlCursor(); f(); cambio(); };
  const bloque = (tag: string) => hacer(() => exec('formatBlock', marcas[tag] ? '<p>' : '<' + tag + '>'));
  const casillas = () => hacer(() => {
    const ul = cerca(caja.current, (el) => el.tagName === 'UL');
    if (ul && ul.dataset.tipo === 'checks') { exec('insertUnorderedList'); return; }
    if (!ul) exec('insertUnorderedList');
    const nuevo = cerca(caja.current, (el) => el.tagName === 'UL');
    if (nuevo) nuevo.dataset.tipo = 'checks';
  });
  const resaltar = () => hacer(() => {
    const m = cerca(caja.current, (el) => el.tagName === 'MARK' || (el.tagName === 'SPAN' && /background/.test(el.getAttribute('style') || '')));
    if (m) { desenvolver(m); return; }
    const s = window.getSelection();
    if (!s || s.isCollapsed) { toast('Selecciona el texto que quieres resaltar'); return; }
    exec('styleWithCSS', 'true'); exec('hiliteColor', '#fff59d'); exec('styleWithCSS', 'false');
  });
  const ponerLink = () => {
    const url = (enlace || '').trim(), h = /^(https?:|mailto:|tel:)/i.test(url) ? url : url ? 'https://' + url : '';
    ponerEnlace(null);
    if (!h) return;
    hacer(() => {
      const s = window.getSelection();
      if (s && !s.isCollapsed) exec('createLink', h);
      else exec('insertHTML', '<a href="' + h.replace(/"/g, '&quot;') + '">' + url.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</a>&nbsp;');
    });
  };
  const linkBoton = () => {
    if (marcas.a) { hacer(() => { const a = cerca(caja.current, (el) => el.tagName === 'A'); if (a) desenvolver(a); }); return; }
    ponerEnlace('');
  };

  // Casillas: tocar el cuadrito marca o desmarca; Enter en una marcada empieza una sin marcar
  const alTocar = (ev: Fin) => {
    const li = ev.target.closest && ev.target.closest('li');
    if (!li || !caja.current!.contains(li) || li.parentElement?.dataset.tipo !== 'checks') return;
    const r = li.getBoundingClientRect();
    if (ev.clientX - r.left > 30) return;
    ev.preventDefault();
    if (li.dataset.hecho === '1') delete li.dataset.hecho; else li.dataset.hecho = '1';
    cambio();
  };
  const alTeclear = (ev: Fin) => {
    if (ev.key === 'Enter') setTimeout(() => { const li = cerca(caja.current, (el) => el.tagName === 'LI'); if (li && li.dataset.hecho && !li.textContent!.trim()) { delete li.dataset.hecho; cambio(); } }, 0);
  };
  // Pegar: se limpia (sin estilos raros); si no trae formato, va como texto
  const alPegar = (ev: Fin) => {
    const html = ev.clipboardData.getData('text/html'), texto = ev.clipboardData.getData('text/plain');
    ev.preventDefault();
    if (html) exec('insertHTML', N.limpiarHtml(html));
    else exec('insertText', texto);
    cambio();
  };

  // 🎙️ Dictar dentro de la nota (el mismo reconocimiento de voz de 🎙️ Audio a texto): lo oído se escribe donde está el cursor
  const dictar = () => {
    if (!Reconocedor) { toast('Este navegador no tiene dictado. Usa Chrome o Edge.'); return; }
    if (oyendo) { seguir.current = false; rec.current?.stop?.(); ponerOyendo(false); ponerParcial(''); return; }
    const r = new (Reconocedor as Fin)();
    r.lang = 'es-CO'; r.continuous = true; r.interimResults = true;
    let escritos = 0;
    r.onresult = (ev: Fin) => {
      const finales: string[] = []; let p = '';
      for (let i = 0; i < ev.results.length; i++) { const t = ev.results[i][0].transcript; if (ev.results[i].isFinal) finales.push(t); else p += ' ' + t; }
      const nuevos = finales.slice(escritos).join(' ').replace(/\s+/g, ' ').trim();
      escritos = finales.length;
      if (nuevos) {
        volverAlCursor();
        const s = window.getSelection(), antes = s && s.anchorNode && s.anchorNode.nodeType === 3 ? (s.anchorNode.textContent || '').slice(0, s.anchorOffset) : '';
        exec('insertText', (antes && !/\s$/.test(antes) ? ' ' : '') + nuevos);
        const s2 = window.getSelection(); if (s2 && s2.rangeCount) rango.current = s2.getRangeAt(0).cloneRange();
        cambio();
      }
      ponerParcial(p.trim());
    };
    r.onerror = (ev: Fin) => {
      if (ev.error === 'no-speech' || ev.error === 'aborted') return;
      seguir.current = false; ponerOyendo(false);
      toast(ev.error === 'not-allowed' || ev.error === 'service-not-allowed' ? 'Sin permiso para el micrófono' : ev.error === 'network' ? 'El dictado necesita internet' : 'El dictado se detuvo');
    };
    r.onend = () => { escritos = 0; if (seguir.current) { try { r.start(); return; } catch (err) { /* ya escuchaba */ } } ponerOyendo(false); ponerParcial(''); };
    rec.current = r; seguir.current = true;
    if (!rango.current) { volverAlCursor(); const s = window.getSelection(); if (s && s.rangeCount) rango.current = s.getRangeAt(0).cloneRange(); }
    try { r.start(); ponerOyendo(true); } catch (err) { toast('No se pudo empezar el dictado'); }
  };

  const cerrar = () => { guardarYa(); alCerrar(); };
  const borrar = () => {
    if (!confirm('¿Mandar «' + N.tituloDe(N.todas(est).find((x: Fin) => x.id === n.id) || n) + '» a la papelera? Puedes recuperarla durante ' + N.DIAS_PAPELERA + ' días.')) return;
    guardarYa(); N.tirarNota(n.id); alCerrar();
    (toast as Fin)('🗑 Nota en la papelera', () => N.recuperarNota(n.id));
  };
  const whatsapp = () => { guardarYa(); return N.textoWhatsApp(est.notas[n.id] || n); };
  const etiquetas = N.meta(est).etiquetas, suyas: string[] = n.etiquetas || [];
  const barraFija = abajo != null;

  return (
    <Box data-editor={n.id}>
      <Box sx={{ ...FILA, justifyContent: 'space-between', mb: '6px' }}>
        <Button color="secondary" onClick={cerrar}>← Notas</Button>
        <Box sx={{ ...FILA, gap: '4px' }}>
          <Box component="small" data-t="guardado" aria-live="polite" sx={{ color: 'text.secondary', mr: '4px' }}>{estado === 'guardando' ? 'Guardando…' : '✓ Guardado'}</Box>
          <Button color="secondary" aria-pressed={!!n.fijada} aria-label={n.fijada ? 'Quitar de fijadas' : 'Fijar arriba'} onClick={() => N.guardarNota(n.id, { fijada: !n.fijada })} sx={n.fijada ? ACTIVO : undefined}>📌</Button>
          <Button color="secondary" aria-label="Más opciones de la nota" aria-expanded={detalles} data-t="opciones" onClick={() => ponerDetalles(!detalles)} sx={{ minWidth: 44, fontSize: 20, ...(detalles ? ACTIVO : {}) }}>⋯</Button>
        </Box>
      </Box>

      {/* ⋯ Opciones: carpeta, etiquetas, copiar, WhatsApp y borrar; cerradas para que la nota sea solo título y texto */}
      {detalles ? (
        <Box data-t="panel-opciones" sx={{ display: 'grid', gap: '10px', p: '12px', mb: '10px', borderRadius: '12px', bgcolor: tokens.surface2 }}>
          <Box sx={{ display: 'grid', gap: '4px' }}>
            <Box component="small" sx={{ color: 'text.secondary' }}>📁 Carpeta</Box>
            <ElegirCarpeta est={est} valor={n.carpeta && N.carpetaDe(est, n.carpeta) ? n.carpeta : ''} alElegir={(id) => N.guardarNota(n.id, { carpeta: id || null })} nombre="Carpeta de la nota" />
          </Box>
          <Box sx={{ display: 'grid', gap: '4px' }}>
            <Box component="small" sx={{ color: 'text.secondary' }}>🏷️ Etiquetas</Box>
            {etiquetas.length ? (
              <Box role="group" aria-label="Etiquetas de la nota" sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {etiquetas.map((t: Fin) => <Chip key={t.id} t={t} activa={suyas.includes(t.id)} alTocar={() => N.guardarNota(n.id, { etiquetas: suyas.includes(t.id) ? suyas.filter((x) => x !== t.id) : [...suyas, t.id] })} />)}
              </Box>
            ) : null}
            <Box component="input" placeholder="＋ Etiqueta nueva (Enter)" aria-label="Etiqueta nueva para la nota"
              onKeyDown={(ev: Fin) => { if (ev.key !== 'Enter') return; const t = N.crearEtiqueta(ev.target.value); if (t) { if (!suyas.includes(t.id)) N.guardarNota(n.id, { etiquetas: [...suyas, t.id] }); ev.target.value = ''; } }} sx={CAMPO} />
          </Box>
          <Box sx={{ ...FILA, gap: '6px' }}>
            <Button color="secondary" onClick={() => copiarTexto(whatsapp(), 'Copiado con el formato de WhatsApp')}>📋 Copiar</Button>
            <Button color="secondary" onClick={() => { window.open('https://wa.me/?text=' + encodeURIComponent(whatsapp()), '_blank', 'noopener'); }}>💬 WhatsApp</Button>
            <Button color="secondary" onClick={borrar} aria-label="Mandar la nota a la papelera">🗑 Borrar</Button>
          </Box>
        </Box>
      ) : null}
      <Box component="input" key={'t' + n.id} defaultValue={n.titulo} placeholder="Título" aria-label="Título de la nota"
        onInput={(ev: Fin) => { const v = ev.target.value; ponerEstado('guardando'); clearTimeout(espera.current); espera.current = setTimeout(() => { N.guardarNota(n.id, { titulo: v }); guardarYa(); }, 600); }}
        onKeyDown={(ev: Fin) => { if (ev.key === 'Enter') { ev.preventDefault(); caja.current?.focus(); } }}
        sx={{ all: 'unset', boxSizing: 'border-box', width: '100%', fontSize: 22, fontWeight: 700, p: '6px 2px', '&::placeholder': { color: 'text.secondary', opacity: 0.7 } }} />

      {/* Carpeta y etiquetas puestas, en una línea chica (se cambian en ⋯) */}
      {(n.carpeta && N.carpetaDe(est, n.carpeta)) || suyas.length ? (
        <Box sx={{ ...FILA, gap: '6px', mb: '4px', color: 'text.secondary', fontSize: 13 }}>
          {n.carpeta && N.carpetaDe(est, n.carpeta) ? <span>📁 {N.rutaCarpeta(est, n.carpeta)}</span> : null}
          {suyas.map((id) => N.etiquetaDe(est, id)).filter(Boolean).map((t: Fin) => <Chip key={t.id} t={t} chica />)}
        </Box>
      ) : null}

      {/* Barra de formato: arriba del texto; en el celular con el teclado abierto, pegada encima del teclado */}
      <Box role="toolbar" aria-label="Formato" data-t="barra"
        sx={{ display: 'flex', gap: '2px', flexWrap: masFormato ? 'wrap' : 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', p: '4px', bgcolor: tokens.surface, borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider', zIndex: 30,
          ...(barraFija ? { position: 'fixed', left: 0, right: 0, bottom: abajo + 'px' } : { position: 'sticky', top: arriba + 'px', mx: '-4px', borderRadius: '10px', border: '1px solid', borderColor: 'divider' }) }}>
        {enlace != null ? (
          <Box sx={{ display: 'flex', gap: '6px', alignItems: 'center', width: '100%' }}>
            <Box component="input" autoFocus type="url" inputMode="url" placeholder="https://…" aria-label="Dirección del enlace" value={enlace} onChange={(ev: Fin) => ponerEnlace(ev.target.value)}
              onKeyDown={(ev: Fin) => { if (ev.key === 'Enter') { ev.preventDefault(); ponerLink(); } if (ev.key === 'Escape') ponerEnlace(null); }} sx={{ ...CAMPO, flex: 1, minHeight: 40, p: '6px 10px' }} />
            <Button onClick={ponerLink}>Poner</Button>
            <Button color="secondary" onClick={() => ponerEnlace(null)}>✕</Button>
          </Box>
        ) : (
          <>
            {/* Lo de siempre a la vista; "Aa" muestra el resto del formato */}
            <Boton activo={!!marcas.b} titulo="Negrita" alTocar={() => hacer(() => exec('bold'))}><b>B</b></Boton>
            <Boton activo={!!marcas.i} titulo="Cursiva" alTocar={() => hacer(() => exec('italic'))}><i>I</i></Boton>
            <Boton activo={!!marcas.ul} titulo="Viñetas" alTocar={() => hacer(() => { const ul = cerca(caja.current, (el) => el.tagName === 'UL'); if (ul && ul.dataset.tipo) delete ul.dataset.tipo; else exec('insertUnorderedList'); })}>•≡</Boton>
            <Boton activo={!!marcas.checks} titulo="Casillas" alTocar={casillas}>☑</Boton>
            <Boton titulo={oyendo ? 'Parar el dictado' : 'Dictar'} alTocar={dictar}>{oyendo ? '⏹' : '🎙️'}</Boton>
            {masFormato ? (
              <>
                <Boton activo={!!marcas.h2} titulo="Título" alTocar={() => bloque('h2')}>H1</Boton>
                <Boton activo={!!marcas.h3} titulo="Subtítulo" alTocar={() => bloque('h3')}>H2</Boton>
                <Boton activo={!!marcas.u} titulo="Subrayado" alTocar={() => hacer(() => exec('underline'))}><u>U</u></Boton>
                <Boton activo={!!marcas.ol} titulo="Lista numerada" alTocar={() => hacer(() => exec('insertOrderedList'))}>1.</Boton>
                <Boton activo={!!marcas.mark} titulo="Resaltar" alTocar={resaltar}>🖍</Boton>
                <Boton activo={!!marcas.a} titulo={marcas.a ? 'Quitar enlace' : 'Enlace'} alTocar={linkBoton}>🔗</Boton>
              </>
            ) : null}
            <Box sx={{ flex: 1 }} />
            <Boton activo={masFormato} titulo={masFormato ? 'Menos formato' : 'Más formato'} alTocar={() => ponerMasFormato(!masFormato)}>Aa</Boton>
          </>
        )}
      </Box>
      {oyendo ? <Box role="status" data-t="oyendo" sx={{ fontSize: 14, color: 'text.secondary', p: '6px 2px' }}>🔴 Escuchando… {parcial}</Box> : null}

      <Box ref={caja} contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Texto de la nota" data-t="texto" spellCheck
        onInput={cambio} onBlur={() => { ponerFoco(false); if (espera.current) guardarYa(); }} onFocus={() => ponerFoco(true)}
        onPaste={alPegar} onClick={alTocar} onKeyDown={alTeclear}
        sx={{ minHeight: '40vh', outline: 'none', p: '10px 2px', fontSize: 17, lineHeight: 1.55, overflowWrap: 'anywhere', mb: barraFija ? '64px' : 0,
          '&:empty::before': { content: '"Escribe aquí…"', color: 'text.secondary' },
          '& p': { m: '0 0 6px' }, '& h2': { fontSize: 22, m: '12px 0 6px' }, '& h3': { fontSize: 18, m: '10px 0 4px' },
          '& ul, & ol': { m: '0 0 6px', pl: '24px' }, '& a': { color: 'primary.main' }, '& mark': { bgcolor: '#fff59d', color: '#111', borderRadius: '2px' },
          '& span[style*="background"]': { color: '#111' }, '& blockquote': { borderLeft: '3px solid', borderColor: 'divider', m: '0 0 6px', pl: '10px', color: 'text.secondary' },
          '& ul[data-tipo="checks"]': { listStyle: 'none', pl: '2px' },
          '& ul[data-tipo="checks"] > li': { position: 'relative', pl: '32px', minHeight: 28 },
          '& ul[data-tipo="checks"] > li::before': { content: '""', position: 'absolute', left: 2, top: 2, width: 20, height: 20, boxSizing: 'border-box', border: '2px solid', borderColor: 'text.secondary', borderRadius: '5px', cursor: 'pointer' },
          '& ul[data-tipo="checks"] > li[data-hecho="1"]': { textDecoration: 'line-through', color: 'text.secondary' },
          '& ul[data-tipo="checks"] > li[data-hecho="1"]::before': { content: '"✓"', bgcolor: 'primary.main', borderColor: 'primary.main', color: tokens.brandInk, fontSize: 14, fontWeight: 900, lineHeight: '16px', textAlign: 'center' } }} />
    </Box>
  );
}

// ---------- La pantalla ----------
export default function Notas({ pestana }: { pestana?: string } = {}) {
  const est = usarEstado() as Fin;
  const [abierta, ponerAbierta] = useState<string | null>(pestana && pestana !== 'papelera' ? pestana : null);
  const [papelera, ponerPapelera] = useState(pestana === 'papelera');
  const [f, ponerF] = useState<Filtro>({ carpeta: '', etiquetas: [], buscar: '' });
  // Lo que lleva 30 días en la papelera, y las notas nuevas que quedaron vacías, se borran solas
  useEffect(() => { N.limpiarNotas(abierta); }, [abierta]);
  const nota = abierta && est.notas && est.notas[abierta] && !est.notas[abierta].borrada ? est.notas[abierta] : null;
  const cerrar = () => {
    const n = abierta && est.notas && est.notas[abierta];
    if (n && N.vacia(n)) N.borrarNotaYa(n.id);
    ponerAbierta(null);
    window.scrollTo(0, 0);
  };
  if (nota) return <Editor key={nota.id} n={nota} est={est} alCerrar={cerrar} />;
  if (papelera) return <Papelera est={est} alVolver={() => ponerPapelera(false)} />;

  const lista = N.filtrar(est, f), hay = N.filtrar(est).length, enPapelera = N.filtrar(est, {}, true).length;
  const filtrando = !!(f.buscar.trim() || f.carpeta || f.etiquetas.length);
  // Con una carpeta elegida, la nota nueva se crea adentro (el botón lo dice)
  const enCarpeta = f.carpeta && f.carpeta !== 'sin' ? N.carpetaDe(est, f.carpeta) : null;
  const nueva = () => {
    const datos: Fin = {};
    if (f.carpeta && f.carpeta !== 'sin') datos.carpeta = f.carpeta;
    if (f.etiquetas.length) datos.etiquetas = [...f.etiquetas];
    ponerAbierta(N.notaNueva(datos).id);
  };
  return (
    <>
      <Box sx={{ ...FILA, justifyContent: 'space-between', mb: '10px' }}>
        <TituloPantalla sx={{ m: 0 }}>📝 Notas</TituloPantalla>
        <Button onClick={nueva} sx={{ minHeight: 44, maxWidth: '60%' }} data-t="nota-nueva" data-teclado="">
          <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>＋ {enCarpeta ? 'Nota en ' + enCarpeta.nombre : 'Nota nueva'}</Box>
        </Button>
      </Box>
      {hay ? <Filtros est={est} f={f} poner={ponerF} /> : null}
      <Box component="ul" aria-label="Notas" sx={{ listStyle: 'none', m: '10px 0 0', p: 0, display: 'grid', gap: '6px' }}>
        {lista.map((n: Fin) => <Fila key={n.id} n={n} est={est} alAbrir={() => ponerAbierta(n.id)} conCarpeta={!f.carpeta || f.carpeta === 'sin' || N.carpetasEnOrden(est).some((c: Fin) => c.padre === f.carpeta)} />)}
      </Box>
      {!hay ? <Vacio icono="📝" accion={<Button onClick={nueva}>＋ Escribir la primera nota</Button>}>Aquí van tus notas: ideas, listas, lo que quieras. Se guardan solas mientras escribes, también sin internet.</Vacio>
        : !lista.length ? <Box sx={{ ...FILA, mt: '8px' }}><Nota sx={{ m: 0 }}>Ninguna nota con ese filtro.</Nota><Button color="secondary" onClick={() => ponerF({ carpeta: '', etiquetas: [], buscar: '' })}>Quitar filtros</Button></Box> : null}
      {filtrando && lista.length ? <Nota>{lista.length} de {hay} notas</Nota> : null}
      {/* Lo de organizar (crear y renombrar carpetas y etiquetas, papelera) va junto y cerrado, para no estorbar */}
      {hay || enPapelera ? (
        <Box sx={{ mt: '20px' }}>
          <Desplegable titulo={<Box component="span" data-t="organizar" sx={{ fontWeight: 400, color: 'text.secondary' }}>⚙️ Organizar: carpetas, etiquetas y papelera</Box>}>
            <Box sx={{ display: 'grid', gap: '8px' }}>
              <Desplegable titulo={'📁 Carpetas' + (N.meta(est).carpetas.length ? ' (' + N.meta(est).carpetas.length + ')' : '')}><Carpetas est={est} /></Desplegable>
              <Desplegable titulo={'🏷️ Etiquetas' + (N.meta(est).etiquetas.length ? ' (' + N.meta(est).etiquetas.length + ')' : '')}><Etiquetas est={est} /></Desplegable>
              <Button color="secondary" onClick={() => ponerPapelera(true)} sx={{ justifySelf: 'start' }}>🗑 Papelera{enPapelera ? ' (' + enPapelera + ')' : ''}</Button>
            </Box>
          </Desplegable>
        </Box>
      ) : null}
    </>
  );
}
