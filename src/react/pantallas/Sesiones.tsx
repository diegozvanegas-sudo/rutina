// 🧘 Sesiones: las checklists del día, las sesiones guiadas por categoría (con sus ejercicios y ▶ Iniciar) y el banco de
// ejercicios de rehabilitación. React pinta; las reglas son las de src/vistas/sesiones.js (check-paso, check-limpiar,
// ses-tipo, banco-zona, banco-agregar). El reproductor (#reproductor) es de toda la app: lo abre "sesion" y sigue allá.
// Las figuras de los ejercicios las dibuja figuras.js como SVG (puente HtmlViejo, igual que los gráficos).
import { useState, type ReactNode } from 'react';
import { Box, Button, Card, Link } from '@mui/material';
import { figuraPaso, videoPaso, figura, urlVideo } from '../../figuras.js';
import { BANCO, ZONAS, NIVELES, fotosDe } from '../../banco.js';
import { piezasSesiones } from '../../vistas/sesiones.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { CampoLista } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Opciones, Avance, HtmlViejo } from '../ui/Varios';
import { Paso, Pasos } from '../ui/Lectura';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const S = piezasSesiones as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const Tarjeta = ({ children, sx }: { children: ReactNode; sx?: object }) => <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '10px', ...sx }}>{children}</Card>;
const Video = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} target="_blank" rel="noopener" sx={{ fontWeight: 700, p: '10px 14px', borderRadius: 999, bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', textDecoration: 'none', display: 'inline-block' }}>{children}</Link>
);
// Las figuras traen sus notas: en las miniaturas sobran
const SIN_NOTA = { '& .fg-nota': { display: 'none' } };
const Mini = ({ html, ancho }: { html: string; ancho: number }) => <HtmlViejo html={html} sx={{ ...SIN_NOTA, flex: 'none', width: ancho, '& svg, & img': { width: ancho, m: 0, bgcolor: 'background.default', borderRadius: '8px', display: 'block' }, '& img': { height: Math.round(ancho * 0.75), objectFit: 'cover' } }} />;

// ---------- Checklists ----------
function checklist(s: Fin) {
  const marcas = S.marcasDe(s.id), a = S.avanceChecklist(s, marcas) as Fin;
  return (
    <Tarjeta key={s.id}>
      <Box sx={FILA}><b>{s.nombre}</b><Box component="span" sx={a.completa ? { color: 'success.main' } : null}>{a.completa ? '✓ Lista' : a.hechos + ' / ' + a.total + ' hoy'}</Box></Box>
      <Avance parte={a.total ? a.hechos / a.total : 0} />
      {s.pasos.length ? (
        <Pasos>
          {(s.pasos as Fin[]).map((p, i) => {
            const id = S.idPaso(p, i), hecho = !!marcas[id];
            return <Paso key={id} hecho={hecho} datos={{ 'data-accion': 'check-paso', 'data-sesion': s.id, 'data-paso': id }}>{p.nombre}{p.desc ? <Box component="small" sx={{ color: 'text.secondary', fontSize: 14 }}> · {p.desc}</Box> : null}</Paso>;
          })}
        </Pasos>
      ) : <Nota>Sin puntos todavía: agrégalos en ✏️ Editar → Sesiones.</Nota>}
      {a.hechos ? <Button fullWidth color="secondary" data-accion="check-limpiar" data-sesion={s.id}>↺ Desmarcar todo</Button> : null}
    </Tarjeta>
  );
}

// ---------- Sesiones guiadas ----------
const dosis = (p: Fin) => (p.reps ? (p.series || 1) + '×' + p.reps : (p.series > 1 ? p.series + '×' : '') + p.seg + ' s') + (p.lados ? ' por lado' : '');
function tira(pasos: Fin[]) {
  return (
    <Box role="list" sx={{ position: 'relative', display: 'flex', gap: '8px', overflowX: 'auto', p: '8px 2px', m: '4px 0', scrollbarWidth: 'thin' }}>
      {pasos.map((p, i) => {
        const dibujo = figuraPaso(p, { animar: false }) as string;
        return (
          <Box role="listitem" key={i} sx={{ flex: 'none', width: 76, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', p: '4px', borderRadius: '10px', bgcolor: tokens.surface2, border: '2px solid transparent' }}>
            {dibujo ? <Mini html={dibujo} ancho={64} /> : <Box component="span" sx={{ width: 64, height: 54, display: 'grid', placeItems: 'center', bgcolor: 'background.default', borderRadius: '8px', fontWeight: 800, color: 'text.secondary' }}>{i + 1}</Box>}
            <Box component="small" sx={{ fontSize: 11, lineHeight: 1.2, textAlign: 'center', color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{i + 1}. {p.nombre}</Box>
          </Box>
        );
      })}
    </Box>
  );
}
function guiada(s: Fin) {
  return (
    <Tarjeta key={s.id}>
      <Box sx={FILA}><b>{s.nombre}</b><span>~{Math.round(S.duracion(s) / 60)} min · {s.pasos.length} ejercicios</span></Box>
      {s.pasos.length ? tira(s.pasos) : null}
      <Desplegable titulo={<Box component="span" sx={{ fontWeight: 400 }}>Ver ejercicios</Box>}>
        <Box component="ol" sx={{ pl: 0, m: 0, listStyle: 'none', display: 'grid', gap: '8px' }}>
          {(s.pasos as Fin[]).map((p, i) => {
            const dibujo = figuraPaso(p, { animar: false }) as string;
            return (
              <Box component="li" key={i} sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                {dibujo ? <Mini html={dibujo} ancho={84} /> : null}
                <div>
                  <b>{p.nombre}</b> <Box component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>{p.musculo || ''} · {dosis(p)}</Box>
                  <Nota sx={{ m: 0 }}>{p.desc || ''}</Nota>
                  {videoPaso(p) ? <Link href={videoPaso(p) as string} target="_blank" rel="noopener" sx={{ fontSize: 14 }}>🎥 Ver video</Link> : null}
                </div>
              </Box>
            );
          })}
        </Box>
      </Desplegable>
      <Button fullWidth data-accion="sesion" data-sesion={s.id} sx={{ minHeight: 56, fontSize: 17 }}>▶ Iniciar</Button>
    </Tarjeta>
  );
}

// ---------- 🩹 Banco de ejercicios ----------
function imagen(x: Fin, animar: boolean, ancho?: number) {
  const dibujo = x.figura === '-' ? '' : figura(x.figura || x.n, { animar }) as string;
  if (dibujo) return ancho ? <Mini html={dibujo} ancho={ancho} /> : <HtmlViejo html={dibujo} sx={{ '& svg': { width: 'min(260px, 70vw)', height: 'auto', display: 'block', m: '0 auto 4px' } }} />;
  const fotos = fotosDe(x) as string[];
  if (!fotos.length) return null;
  if (ancho) return <Box component="img" src={fotos[0]} alt="" loading="lazy" sx={{ flex: 'none', width: ancho, height: Math.round(ancho * 0.75), objectFit: 'cover', bgcolor: 'background.default', borderRadius: '8px', display: 'block' }} />;
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', maxWidth: 520, m: '0 auto' }}>
      {fotos.map((f, i) => <Box component="img" key={i} src={f} alt={x.n + (i ? ': final' : ': inicio')} loading="lazy" sx={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block' }} />)}
    </Box>
  );
}
const NIVEL_COLOR: Record<number, string> = { 1: 'primary.main', 2: 'warning.main', 3: 'error.main' };
function banco(e: Fin, zona: string) {
  const zonas = Object.keys(ZONAS), Z = ZONAS as Record<string, string>, B = BANCO as Fin[], N = NIVELES as Record<number, string>;
  const cuenta = (z: string) => B.filter((x) => x.z === z).length;
  const lista = B.map((x, i) => ({ x, i })).filter(({ x }) => zona === 'todas' || x.z === zona);
  const sesiones = (e.sesiones as Fin[]).filter((s) => s.tipo !== 'checklist');
  return (
    <>
      <Nota sx={{ m: '0 0 8px' }}>Para prevenir y fortalecer. Una molestia de hasta 3 de 10 que se calma al día siguiente está bien; si pasa de eso o empeora, baja de nivel. Con una lesión actual, primero el fisioterapeuta.</Nota>
      <Opciones nombre="Zona" activa={zona} opciones={[['todas', 'Todas (' + B.length + ')'], ...zonas.map((z) => [z, Z[z] + ' (' + cuenta(z) + ')'] as [string, string])]} datos={(z) => ({ 'data-accion': 'banco-zona', 'data-z': z })} />
      {zonas.filter((z) => zona === 'todas' || z === zona).map((z) => (
        <div key={z}>
          <Box component="h2" sx={{ fontSize: 16, m: '14px 0 6px' }}>{Z[z]}</Box>
          {lista.filter(({ x }) => x.z === z).sort((a, b) => a.x.nv - b.x.nv).map(({ x, i }) => (
            <Card key={i} data-banco="" sx={{ p: 0, mb: '6px', '& .MuiAccordionSummary-root': { p: '8px 10px', minHeight: 56 }, '& .MuiAccordionSummary-content': { alignItems: 'center', gap: '10px', width: '100%' }, '& .MuiAccordionSummary-root .flecha': { display: 'none' } }}>
              <Desplegable titulo={
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                  <Box component="span" sx={{ flex: 'none', width: 56 }}>{imagen(x, false, 56)}</Box>
                  <Box component="span" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', fontWeight: 400 }}><b>{x.n}</b><Box component="small" sx={{ color: 'text.secondary' }}>{x.m} · {S.dosisTexto(x.d)}</Box></Box>
                  <Box component="span" title={N[x.nv]} sx={{ flex: 'none', color: NIVEL_COLOR[x.nv], fontSize: 13, letterSpacing: '1px' }}>{'●'.repeat(x.nv)}<Box component="span" sx={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>{N[x.nv]}</Box></Box>
                </Box>
              }>
                <Box sx={{ p: '0 12px 12px', '& p': { m: '8px 0' } }}>
                  {imagen(x, true)}
                  <p><b>Para qué:</b> {x.para}</p><p><b>Cómo:</b> {x.como}</p><p><b>Ojo:</b> {x.ojo}</p>
                  <Box component="p" sx={{ color: 'text.secondary', fontSize: 14 }}>{N[x.nv]} · {S.dosisTexto(x.d)}{x.d.descanso ? ' · descanso ' + x.d.descanso + ' s' : ''}</Box>
                  <p>⬇️ <b>Más fácil:</b> {x.facil}<br />⬆️ <b>Más difícil:</b> {x.dificil}</p>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    <Video href={urlVideo(x.n) as string}>🎥 Ver video</Video>
                    {sesiones.length ? <Box sx={{ flex: 1, minWidth: 200 }}><CampoLista etiqueta="" aria-label={'Agregar ' + x.n + ' a una sesión'} data-cambio="banco-agregar" data-i={i} defaultValue="" opciones={[['', '➕ Agregar a una sesión…'], ...sesiones.map((s) => [s.id, s.nombre] as [string, string])]} /></Box> : null}
                  </Box>
                  {x.foto ? <Nota>Foto: free-exercise-db (dominio público).</Nota> : null}
                </Box>
              </Desplegable>
            </Card>
          ))}
        </div>
      ))}
    </>
  );
}

export default function Sesiones({ pestana }: { pestana?: string }) {
  // "#sesiones/banco" y "#sesiones/banco-rodilla" abren el banco en esa zona (una sola vez, al abrir)
  useState(() => { if (pestana) accion('abrir-sesiones', { p: pestana }); return 0; });
  const e = usarEstado() as Fin, ver = S.ver(), grupos: Record<string, Fin[]> = {};
  // Las checklists van primero: son las que se usan a diario
  for (const s of [...(e.sesiones as Fin[])].sort((a, b) => Number(b.tipo === 'checklist') - Number(a.tipo === 'checklist'))) (grupos[s.tipo] ??= []).push(s);
  const tipos = Object.keys(grupos);
  let tipo = ver.tipoVisto;
  if (!tipos.includes(tipo) && tipo !== 'banco') { tipo = tipos[0]; S.ponerTipo(tipo); }
  let zona = ver.zonaVista;
  if (zona !== 'todas' && !Object.keys(ZONAS).includes(zona)) { zona = 'todas'; S.ponerZona(zona); }
  const T = S.TIPOS as Record<string, string>;
  return (
    <>
      <TituloPantalla>Sesiones</TituloPantalla>
      <Opciones nombre="Categoría" activa={tipo} opciones={[...tipos.map((t) => [t, (T[t] || t) + ' (' + grupos[t].length + ')'] as [string, string]), ['banco', '🩹 Banco de ejercicios (' + (BANCO as Fin[]).length + ')']]}
        datos={(t) => ({ 'data-accion': 'ses-tipo', 'data-t': t })} sx={{ '& .MuiChip-root': { fontSize: 15 } }} />
      {tipo === 'banco' ? banco(e, zona) : (grupos[tipo] || []).map((s) => (s.tipo === 'checklist' ? checklist(s) : guiada(s)))}
    </>
  );
}
