// 🖼️ Imágenes: infografías, fotos de comidas, técnica, progreso… guardadas en tu Google Drive (una subcarpeta por álbum)
// y en este equipo para verlas sin señal. Se ordenan por álbum, etiquetas y fecha, y se ven en cuadrícula, línea de
// tiempo, álbumes o dos lado a lado (antes y después). Reglas: src/imagenes.js · equipo y Drive: src/imagenes-equipo.js
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Chip, Dialog, IconButton, Link, OutlinedInput } from '@mui/material';
import { e, guardar } from '../../estado.js';
import { toast } from '../../ui.js';
import { fechaCorta } from '../../fechas.js';
import { todas, enOrden, albumes, agregarAlbum, etiquetasEnUso, filtrar, porMes, editar } from '../../imagenes.js';
import { agregar, url, urlLista, archivoDe, borrar, sincronizar, drive, driveListo, pendientesDrive } from '../../imagenes-equipo.js';
import { usarEstado } from '../usarEstado';
import { tokens } from '../tema';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Campo, CampoLargo, CampoLista, DOS } from '../ui/Campo';
import { Opciones } from '../ui/Varios';
import { Vacio } from '../ui/Vacio';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
type Vista = 'cuadricula' | 'tiempo' | 'albumes' | 'comparar';
const VISTAS: [Vista, string][] = [['cuadricula', '🔲 Cuadrícula'], ['tiempo', '🗓️ Por fecha'], ['albumes', '📁 Álbumes'], ['comparar', '↔️ Comparar']];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const nombreMes = (m: string) => MESES[Number(m.slice(5, 7)) - 1] + ' ' + m.slice(0, 4);
// Lo que se eligió se recuerda mientras la app está abierta
const recuerdo = { vista: 'cuadricula' as Vista, filtro: { album: '', etiqueta: '', buscar: '' }, comparar: [null, null] as (string | null)[] };

// Una miniatura: sale de este equipo o se baja de Drive la primera vez
function Mini({ x, alto = 'auto', redondo = 10 }: { x: Fin; alto?: number | string; redondo?: number }) {
  const [src, ponerSrc] = useState<string | null>(urlLista(x.id, true)), [falla, ponerFalla] = useState(false);
  useEffect(() => { let vivo = true; if (!src) url(x.id, true).then((u: string | null) => { if (vivo) { if (u) ponerSrc(u); else ponerFalla(true); } }).catch(() => vivo && ponerFalla(true)); return () => { vivo = false; }; }, [x.id, x.driveId]);
  return (
    <Box sx={{ position: 'relative', width: '100%', height: alto, aspectRatio: alto === 'auto' ? '1' : undefined, borderRadius: redondo + 'px', overflow: 'hidden', bgcolor: tokens.surface2, display: 'grid', placeItems: 'center' }}>
      {src ? <Box component="img" src={src} alt={x.nombre} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <Box component="span" aria-hidden="true" sx={{ fontSize: 22, color: 'text.secondary' }}>{falla ? '☁️' : '…'}</Box>}
      {!x.driveId && driveListo() ? <Box component="span" title="Aún no sube a Drive" sx={{ position: 'absolute', top: 4, right: 4, fontSize: 12, bgcolor: tokens.velo, color: '#fff', borderRadius: 999, px: '6px' }}>⏳</Box> : null}
    </Box>
  );
}

function Cuadricula({ lista, abrir, elegida }: { lista: Fin[]; abrir: (id: string) => void; elegida?: (string | null)[] }) {
  return (
    <Box data-t="cuadricula" sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', sm: 'repeat(auto-fill, minmax(150px, 1fr))' }, gap: { xs: '4px', sm: '8px' } }}>
      {lista.map((x) => {
        const marca = elegida ? elegida.indexOf(x.id) : -1;
        return (
          <ButtonBase key={x.id} data-t="imagen" data-id={x.id} onClick={() => abrir(x.id)} aria-label={x.nombre}
            sx={{ display: 'block', borderRadius: '10px', position: 'relative', outline: marca >= 0 ? '3px solid' : 'none', outlineColor: 'primary.main', '&.Mui-focusVisible': { outline: '3px solid', outlineColor: 'primary.main' } }}>
            <Mini x={x} />
            {marca >= 0 ? <Box component="span" sx={{ position: 'absolute', left: 6, top: 6, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800, borderRadius: 999, px: '8px', fontSize: 13 }}>{marca ? 'B' : 'A'}</Box> : null}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function Albumes({ est, alElegir }: { est: Fin; alElegir: (a: string) => void }) {
  const lista = enOrden(todas(est)) as Fin[], [nuevo, ponerNuevo] = useState('');
  const grupos: [string, string, Fin[]][] = [...(albumes(est) as string[]).map((a) => [a, a, lista.filter((x) => x.album === a)] as [string, string, Fin[]]), ['-', 'Sin álbum', lista.filter((x) => !x.album)]];
  const crear = () => { const n = agregarAlbum(e(), nuevo); if (n) { guardar(); ponerNuevo(''); toast('📁 Álbum «' + n + '» listo: agrega imágenes desde él'); } };
  return (
    <>
      <Box data-t="albumes" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', mb: '14px' }}>
        {grupos.filter(([k, , xs]) => k !== '-' || xs.length).map(([k, nombre, xs]) => (
          <ButtonBase key={k} data-t="album" onClick={() => alElegir(k)} sx={{ display: 'grid', gap: '6px', textAlign: 'left', borderRadius: '12px', p: '6px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', '&:hover': { bgcolor: tokens.surface2 } }}>
            {xs.length ? <Mini x={xs[0]} /> : <Box sx={{ aspectRatio: '1', borderRadius: '10px', bgcolor: tokens.surface2, display: 'grid', placeItems: 'center', fontSize: 30 }} aria-hidden="true">📁</Box>}
            <Box component="span" sx={{ px: '4px', minWidth: 0 }}><b style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</b><Box component="small" sx={{ color: 'text.secondary' }}>{xs.length} {xs.length === 1 ? 'imagen' : 'imágenes'}</Box></Box>
          </ButtonBase>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <OutlinedInput fullWidth value={nuevo} onChange={(ev) => ponerNuevo(ev.target.value)} onKeyDown={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); crear(); } }} placeholder="Álbum nuevo: Movilidad, Comidas, Técnica…" inputProps={{ 'aria-label': 'Nombre del álbum nuevo', 'data-t': 'album-nuevo' }} />
        <Button onClick={crear} disabled={!nuevo.trim()} sx={{ flex: 'none', whiteSpace: 'nowrap' }}>＋ Crear</Button>
      </Box>
      {driveListo() ? <Nota>Cada álbum es una subcarpeta de «Rutina · Imágenes» en tu Drive.</Nota> : null}
    </>
  );
}

// ↔️ Dos imágenes lado a lado: se elige A y B tocando abajo
function Comparar({ lista }: { lista: Fin[] }) {
  const [par, ponerPar] = useState(recuerdo.comparar), [lado, ponerLado] = useState(par[0] ? (par[1] ? 0 : 1) : 0);
  const est = e() as Fin, A = par[0] && est.imagenes[par[0]], B = par[1] && est.imagenes[par[1]];
  const elegir = (id: string) => { const p = [...par]; p[lado] = id; recuerdo.comparar = p; ponerPar(p); ponerLado(lado ? 0 : 1); };
  const Lado = ({ x, k }: { x: Fin; k: number }) => (
    <ButtonBase onClick={() => ponerLado(k)} aria-pressed={lado === k} sx={{ display: 'grid', gap: '4px', borderRadius: '12px', p: '4px', border: '2px solid', borderColor: lado === k ? 'primary.main' : 'divider', textAlign: 'left' }}>
      {x ? <Grande x={x} /> : <Box sx={{ aspectRatio: '3 / 4', borderRadius: '10px', bgcolor: tokens.surface2, display: 'grid', placeItems: 'center', color: 'text.secondary', fontSize: 14, p: '8px', textAlign: 'center' }}>Toca una imagen abajo para {k ? 'B' : 'A'}</Box>}
      <Box component="small" sx={{ px: '4px', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><b>{k ? 'B' : 'A'}</b>{x ? ' · ' + fechaCorta(x.fecha) + ' · ' + x.nombre : ''}</Box>
    </ButtonBase>
  );
  return (
    <>
      <Box data-t="comparar" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', mb: '8px' }}><Lado x={A} k={0} /><Lado x={B} k={1} /></Box>
      <Box sx={{ display: 'flex', gap: '8px', mb: '10px' }}>
        <Button size="small" color="secondary" disabled={!A && !B} onClick={() => { const p = [par[1], par[0]]; recuerdo.comparar = p; ponerPar(p); }}>⇄ Cambiar de lado</Button>
        <Nota sx={{ m: 0, alignSelf: 'center' }}>Eligiendo <b>{lado ? 'B' : 'A'}</b></Nota>
      </Box>
      <Cuadricula lista={lista} abrir={elegir} elegida={par} />
    </>
  );
}
function Grande({ x }: { x: Fin }) {
  const [src, ponerSrc] = useState<string | null>(urlLista(x.id, false));
  useEffect(() => { let vivo = true; ponerSrc(urlLista(x.id, false)); url(x.id, false).then((u: string | null) => vivo && ponerSrc(u)).catch(() => {}); return () => { vivo = false; }; }, [x.id]);
  return src ? <Box component="img" src={src} alt={x.nombre} sx={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '10px', bgcolor: tokens.surface2, display: 'block' }} />
    : <Box sx={{ aspectRatio: '3 / 4', borderRadius: '10px', bgcolor: tokens.surface2 }}><Mini x={x} alto="100%" /></Box>;
}

// El visor: la imagen grande (doble toque para acercar), ‹ › o deslizar para pasar, y sus datos para editar
function Visor({ lista, id, cerrar, cambiar, alComparar }: { lista: Fin[]; id: string; cerrar: () => void; cambiar: (id: string) => void; alComparar: (id: string) => void }) {
  const est = e() as Fin, x = est.imagenes[id], i = lista.findIndex((y) => y.id === id), [cerca, ponerCerca] = useState(false), toque = useRef<{ x: number; y: number } | null>(null);
  const [src, ponerSrc] = useState<string | null>(urlLista(id, false));
  useEffect(() => { let vivo = true; ponerCerca(false); ponerSrc(urlLista(id, false) || urlLista(id, true)); url(id, false).then((u: string | null) => vivo && u && ponerSrc(u)).catch(() => {}); return () => { vivo = false; }; }, [id]);
  useEffect(() => {
    const tecla = (ev: KeyboardEvent) => { if ((ev.target as HTMLElement).closest('input, textarea, select')) return; if (ev.key === 'ArrowRight' && lista[i + 1]) cambiar(lista[i + 1].id); if (ev.key === 'ArrowLeft' && i > 0) cambiar(lista[i - 1].id); };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [i, lista]);
  if (!x) return null;
  const guardarCampo = (cambios: Fin) => { if (editar(e(), id, cambios)) { guardar(); sincronizar(); } };
  const compartir = async () => {
    const b = await archivoDe(id);
    if (!b) { toast('Esta imagen aún no está en este equipo'); return; }
    const f = new File([b], x.nombre + (b.type === 'image/png' ? '.png' : '.jpg'), { type: b.type });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: x.nombre }); } catch (err) { /* cancelado */ } return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const quitar = () => { const deshacer = borrar(id); if (!deshacer) return; const sig = lista[i + 1] || lista[i - 1]; if (sig) cambiar(sig.id); else cerrar(); toast('🗑 ' + x.nombre + ' borrada' + (x.driveId ? ' (va a la papelera de Drive)' : ''), deshacer as never); };
  const opcionesAlbum: [string, string][] = [['', 'Sin álbum'], ...(albumes(est) as string[]).map((a) => [a, a] as [string, string])];
  return (
    <Dialog open fullScreen onClose={cerrar} aria-label={'Imagen: ' + x.nombre} data-t="visor" slotProps={{ paper: { sx: { bgcolor: 'background.default', p: 0 } } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', p: 'calc(6px + env(safe-area-inset-top)) 8px 6px', borderBottom: '1px solid', borderColor: 'divider' }}>
        <IconButton onClick={cerrar} aria-label="Cerrar" sx={{ fontSize: 20 }}>✕</IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}><b style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.nombre}</b><Box component="small" sx={{ color: 'text.secondary' }}>{i + 1} de {lista.length}{x.album ? ' · 📁 ' + x.album : ''}</Box></Box>
        <IconButton disabled={i <= 0} onClick={() => cambiar(lista[i - 1].id)} aria-label="Anterior" sx={{ fontSize: 22 }}>‹</IconButton>
        <IconButton disabled={i >= lista.length - 1} onClick={() => cambiar(lista[i + 1].id)} aria-label="Siguiente" sx={{ fontSize: 22 }}>›</IconButton>
      </Box>
      <Box sx={{ overflowY: 'auto', flex: 1, display: { md: 'grid' }, gridTemplateColumns: { md: 'minmax(0, 1fr) 360px' } }}>
        <Box data-t="visor-imagen" onDoubleClick={() => ponerCerca(!cerca)}
          onTouchStart={(ev) => { if (ev.touches.length === 1) toque.current = { x: ev.touches[0].clientX, y: ev.touches[0].clientY }; }}
          onTouchEnd={(ev) => { const t = toque.current; toque.current = null; if (!t || cerca) return; const dx = ev.changedTouches[0].clientX - t.x, dy = ev.changedTouches[0].clientY - t.y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { const j = dx < 0 ? i + 1 : i - 1; if (lista[j]) cambiar(lista[j].id); } }}
          sx={{ overflow: 'auto', bgcolor: '#000', display: 'grid', placeItems: cerca ? 'start' : 'center', minHeight: { xs: '55vh', md: 'calc(100vh - 60px)' }, maxHeight: { md: 'calc(100vh - 60px)' }, touchAction: cerca ? 'pan-x pan-y pinch-zoom' : 'pan-y pinch-zoom', cursor: cerca ? 'zoom-out' : 'zoom-in' }}>
          {src ? <Box component="img" src={src} alt={x.nombre} draggable={false} sx={cerca ? { width: '200%', maxWidth: 'none', display: 'block' } : { maxWidth: '100%', maxHeight: { xs: '70vh', md: 'calc(100vh - 60px)' }, objectFit: 'contain', display: 'block' }} />
            : <Box sx={{ color: '#fff', p: '20px' }}>{driveListo() || !x.driveId ? 'Cargando…' : 'Esta imagen está en Drive: conecta Drive en Ajustes para verla aquí.'}</Box>}
        </Box>
        <Box key={id} sx={{ p: '12px 16px calc(16px + env(safe-area-inset-bottom))', display: 'grid', gap: '10px', alignContent: 'start' }}>
          <Nota sx={{ m: 0 }}>Doble toque para acercar · desliza o usa ‹ › para pasar.</Nota>
          <Campo etiqueta="Nombre" defaultValue={x.nombre} onBlur={(ev) => ev.target.value !== x.nombre && guardarCampo({ nombre: ev.target.value })} />
          <Box sx={DOS}>
            <CampoLista etiqueta="Álbum" opciones={opcionesAlbum} defaultValue={x.album || ''} onChange={(ev) => guardarCampo({ album: ev.target.value })} />
            <Campo etiqueta="Fecha" type="date" defaultValue={x.fecha} onChange={(ev) => guardarCampo({ fecha: ev.target.value })} />
          </Box>
          <Campo etiqueta="Etiquetas (separadas por coma)" defaultValue={(x.etiquetas || []).join(', ')} placeholder="cuello, movilidad, mañana" onBlur={(ev) => guardarCampo({ etiquetas: ev.target.value })} />
          <CampoLargo etiqueta="Nota" filas={2} defaultValue={x.nota || ''} onBlur={(ev) => ev.target.value !== (x.nota || '') && guardarCampo({ nota: ev.target.value })} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button onClick={compartir}>📤 Compartir</Button>
            <Button color="secondary" onClick={() => { alComparar(id); }}>↔️ Comparar</Button>
            {x.driveId ? <Button color="secondary" href={'https://drive.google.com/file/d/' + x.driveId + '/view'} target="_blank" rel="noopener">↗ En Drive</Button> : null}
            <Button color="secondary" onClick={quitar} sx={{ color: 'error.main' }}>🗑 Borrar</Button>
          </Box>
          <Nota sx={{ m: 0 }}>{x.ancho && x.alto ? x.ancho + ' × ' + x.alto + ' px · ' : ''}{x.tam ? Math.round(x.tam / 1024) + ' KB · ' : ''}{x.driveId ? '☁️ En tu Drive' : driveListo() ? '⏳ Por subir a Drive' : '📱 Solo en este equipo'}</Nota>
        </Box>
      </Box>
    </Dialog>
  );
}

function EstadoDrive() {
  const n = pendientesDrive() as number;
  if (!driveListo()) return <Nota data-t="drive-estado">📱 Se guardan en este equipo. Para tenerlas siempre en tu Google Drive (y en tus otros equipos), conéctalo en <Link href="#ajustes" sx={{ color: 'primary.main' }}>⚙️ Ajustes → 🖼️ Google Drive</Link>.</Nota>;
  const D = drive as Fin;
  return (
    <Box data-t="drive-estado" sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: 14, color: D.estado === 'error' ? 'error.main' : 'text.secondary', mb: '8px' }}>
      <span>{D.estado === 'trabajando' ? '⏳ Hablando con Drive…' : D.estado === 'error' ? '⚠️ Drive: ' + D.mensaje : n ? '⏳ ' + n + ' por llevar a Drive' : '☁️ Todo en tu Drive'}{D.estado === 'ok' && D.mensaje ? ' · ' + D.mensaje : ''}</span>
      {D.estado !== 'trabajando' ? <Button size="small" color="secondary" onClick={() => sincronizar({ traer: true })}>↻ {n ? 'Subir ahora' : 'Revisar Drive'}</Button> : null}
    </Box>
  );
}

export default function Imagenes({ pestana }: { pestana?: string } = {}) {
  const est = usarEstado() as Fin;
  const [vista, ponerVista] = useState<Vista>(recuerdo.vista), [f, ponerF] = useState(recuerdo.filtro), [abierta, ponerAbierta] = useState<string | null>(pestana && est.imagenes && est.imagenes[pestana] ? pestana : null);
  const [arrastrando, ponerArrastrando] = useState(false), [cargando, ponerCargando] = useState(0), entrada = useRef<HTMLInputElement>(null);
  const cambiarVista = (v: Vista) => { recuerdo.vista = v; ponerVista(v); };
  const filtro = (x: Fin) => { const n = { ...f, ...x }; recuerdo.filtro = n; ponerF(n); };
  // Al abrir: sube lo pendiente y trae lo que haya en la carpeta de Drive
  useEffect(() => { sincronizar({ traer: true }); }, []);
  const subir = async (archivos: File[]) => {
    const fotos = archivos.filter((a) => a && /^image\//.test(a.type));
    if (!fotos.length) { toast('Eso no es una imagen'); return; }
    ponerCargando(fotos.length);
    try {
      const album = f.album && f.album !== '-' ? f.album : '';
      const nuevas = await agregar(fotos, { album, etiquetas: f.etiqueta ? [f.etiqueta] : [] }) as Fin[];
      toast('🖼️ ' + (nuevas.length === 1 ? 'Imagen guardada' : nuevas.length + ' imágenes guardadas') + (album ? ' en ' + album : '') + (driveListo() ? ': subiendo a Drive' : ''));
      if (nuevas.length === 1) ponerAbierta(nuevas[0].id);
    } catch (err: any) { toast('No se pudo guardar: ' + (err && err.message || err)); } finally { ponerCargando(0); }
  };
  // Pegar (Ctrl+V) una imagen copiada
  useEffect(() => {
    const pegar = (ev: ClipboardEvent) => { if ((ev.target as HTMLElement).closest && (ev.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')) return; const fs = [...(ev.clipboardData ? ev.clipboardData.files : [])]; if (fs.length) { ev.preventDefault(); subir(fs); } };
    window.addEventListener('paste', pegar);
    return () => window.removeEventListener('paste', pegar);
  });
  const lista = filtrar(enOrden(todas(est)), f) as Fin[], hay = todas(est).length, etiquetas = etiquetasEnUso(todas(est)) as [string, number][];
  const albs = albumes(est) as string[];
  const enAlbum = f.album ? (f.album === '-' ? 'Sin álbum' : f.album) : '';
  let cuerpo: ReactNode;
  if (!hay) cuerpo = <Vacio icono="🖼️" accion={<Button onClick={() => entrada.current && entrada.current.click()}>＋ Agregar la primera imagen</Button>}>Guarda infografías, rutinas, comidas, técnica o fotos de progreso. Las ordenas por álbum y etiquetas, y quedan en tu Drive.</Vacio>;
  else if (vista === 'albumes') cuerpo = <Albumes est={est} alElegir={(a) => { filtro({ album: a }); cambiarVista('cuadricula'); }} />;
  else if (vista === 'comparar') cuerpo = <Comparar lista={lista} />;
  else if (!lista.length) cuerpo = <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}><Nota sx={{ m: 0 }}>Ninguna imagen con ese filtro.</Nota><Button color="secondary" onClick={() => filtro({ album: '', etiqueta: '', buscar: '' })}>Quitar filtros</Button></Box>;
  else if (vista === 'tiempo') cuerpo = (porMes(lista) as [string, Fin[]][]).map(([m, xs]) => (
    <Box key={m} sx={{ mb: '14px' }}>
      <Box component="h2" sx={{ fontSize: 15, color: 'text.secondary', textTransform: 'capitalize', m: '4px 0 8px' }}>{nombreMes(m)} · {xs.length}</Box>
      <Cuadricula lista={xs} abrir={ponerAbierta} />
    </Box>
  ));
  else cuerpo = <Cuadricula lista={lista} abrir={ponerAbierta} />;
  return (
    <Box onDragOver={(ev) => { if ([...ev.dataTransfer.types].includes('Files')) { ev.preventDefault(); ponerArrastrando(true); } }} onDragLeave={(ev) => { if (ev.currentTarget === ev.target) ponerArrastrando(false); }}
      onDrop={(ev) => { ev.preventDefault(); ponerArrastrando(false); subir([...ev.dataTransfer.files]); }}
      sx={{ position: 'relative', minHeight: '60vh', outline: arrastrando ? '3px dashed' : 'none', outlineColor: 'primary.main', borderRadius: '14px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', mb: '8px' }}>
        <TituloPantalla sx={{ m: 0 }}>🖼️ Imágenes</TituloPantalla>
        <Button data-t="agregar-imagen" disabled={!!cargando} onClick={() => entrada.current && entrada.current.click()} sx={{ minHeight: 44 }}>{cargando ? 'Guardando ' + cargando + '…' : '＋ Agregar'}</Button>
        <input ref={entrada} type="file" accept="image/*" multiple hidden data-t="elegir-imagen" onChange={(ev) => { const fs = [...(ev.target.files || [])]; ev.target.value = ''; if (fs.length) subir(fs); }} />
      </Box>
      <EstadoDrive />
      {hay ? <>
        <Opciones nombre="Cómo verlas" opciones={VISTAS} activa={vista} alElegir={cambiarVista} />
        {vista !== 'albumes' ? <>
          <Box sx={{ display: 'flex', gap: '8px', mb: '8px' }}>
            <OutlinedInput fullWidth type="search" value={f.buscar} onChange={(ev) => filtro({ buscar: ev.target.value })} placeholder="🔎 Buscar por nombre, etiqueta o nota" inputProps={{ 'aria-label': 'Buscar imágenes' }} />
          </Box>
          {albs.length ? <Opciones nombre="Álbum" chica opciones={[['', 'Todas'] as [string, string], ...albs.map((a) => [a, '📁 ' + a] as [string, string]), ['-', 'Sin álbum'] as [string, string]]} activa={f.album} alElegir={(a) => filtro({ album: a })} /> : null}
          {etiquetas.length ? <Box sx={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', pb: '10px' }} role="group" aria-label="Etiquetas">
            {etiquetas.slice(0, 30).map(([t, n]) => <Chip key={t} size="small" clickable aria-pressed={f.etiqueta === t} color={f.etiqueta === t ? 'primary' : 'default'} variant={f.etiqueta === t ? 'filled' : 'outlined'} label={'#' + t + ' · ' + n} onClick={() => filtro({ etiqueta: f.etiqueta === t ? '' : t })} sx={{ flex: 'none' }} />)}
          </Box> : null}
          <Nota>{lista.length} de {hay}{enAlbum ? ' · 📁 ' + enAlbum + ' (lo que agregues aquí entra a este álbum)' : ''}{f.etiqueta ? ' · #' + f.etiqueta : ''} · también puedes pegar (Ctrl+V) o arrastrar imágenes aquí.</Nota>
        </> : null}
      </> : null}
      <Card component="section" sx={{ p: { xs: '8px', sm: '12px' } }}>{cuerpo}</Card>
      {abierta && est.imagenes && est.imagenes[abierta] ? <Visor lista={vista === 'comparar' ? enOrden(todas(est)) : lista.some((x) => x.id === abierta) ? lista : enOrden(todas(est))} id={abierta} cerrar={() => ponerAbierta(null)} cambiar={ponerAbierta}
        alComparar={(id) => { recuerdo.comparar = [id, recuerdo.comparar[1] === id ? null : recuerdo.comparar[1]]; ponerAbierta(null); cambiarVista('comparar'); }} /> : null}
    </Box>
  );
}
