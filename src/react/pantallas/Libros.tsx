// 📚 Libros (un área de 🎓 Estudiar): la biblioteca y cada libro con su lectura del día (afirmación, práctica, diario),
// la lista de lecturas, preguntar (buscar y consejos por situación), herramientas (evaluaciones, diario, fichas,
// perfil, sesiones), la rutina y los conceptos. React pinta; las reglas son las de src/vistas/libros.js (libro-…).
import { useState, type ReactNode } from 'react';
import { accion } from '../acciones';
import { Box, Button, ButtonBase, Card, Chip, Collapse, Link, Typography } from '@mui/material';
import { iso, sumarDias, fechaCorta } from '../../fechas.js';
import { LIBROS, libro } from '../../libros/index.js';
import { delDia, lecturaQueToca, leidas, racha, afirmacionDelDia, buscar, resultadoEvaluacion } from '../../biblioteca.js';
import { ve } from '../../permisos.js';
import { librosVisibles } from '../../vistas/estudiar.js';
import { piezasLibros } from '../../vistas/libros.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo } from '../ui/Campo';
import { Flecha } from '../ui/Flecha';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';
import { Opciones, Avance } from '../ui/Varios';
import { Sub, Puntos, Caja, Afirmacion, Paso, Pasos } from '../ui/Lectura';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'libros';
const B = piezasLibros as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const Tarjeta = ({ children, sx, component = 'section' }: { children: ReactNode; sx?: object; component?: string }) => <Card component={component as 'section'} sx={{ mb: '14px', ...sx }}>{children}</Card>;
const Botones = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' }}>{children}</Box>;
const Sesion = ({ id, texto }: { id: string; texto: string }) => <Button color="secondary" data-accion="sesion" data-sesion={id}>{texto}</Button>;
const Grande = { minHeight: 56, fontSize: 17 };
const Enlace = ({ n, children }: { n: number; children: ReactNode }) => <Link href="#libros" data-accion="libro-abrir" data-n={n} sx={{ color: 'primary.main' }}>{children}</Link>;
// Algo que se abre y se cierra y lo recuerda al repintar (libro-desplegar). tarjeta: con el aspecto de una tarjeta
function Abrible({ clave, titulo, abierto, tarjeta = false, children }: { clave: string; titulo: ReactNode; abierto: boolean; tarjeta?: boolean; children: ReactNode }) {
  return (
    <Box component="section" sx={tarjeta ? { mb: '14px', p: '14px', borderRadius: tokens.radio + 'px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' } : { border: '1px solid', borderColor: 'divider', borderRadius: '12px', p: '8px 12px', mt: '10px' }}>
      <ButtonBase data-accion="libro-desplegar" data-clave={clave} aria-expanded={abierto}
        sx={{ width: '100%', justifyContent: 'flex-start', gap: '6px', font: 'inherit', color: 'text.primary', textAlign: 'left', minHeight: 32, borderRadius: '8px', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
        <Flecha abierta={abierto} />{titulo}
      </ButtonBase>
      <Collapse in={abierto} timeout={150}><Box sx={{ pt: tarjeta ? '10px' : '4px', display: 'grid', gap: '10px' }}>{children}</Box></Collapse>
    </Box>
  );
}

// ---------- 📖 Hoy ----------
function cabecera(e: Fin, l: Fin) {
  const P = B.P(), n = leidas(l, P) as number, r = racha(l.id, P, e.dias) as number, meta = l.racha, total = B.total(l);
  return (
    <Tarjeta>
      <Box sx={{ ...FILA, mb: '6px' }}><b>📖 {n} de {total} lecturas{P.vuelta > 1 ? ' · vuelta ' + P.vuelta : ''}</b><span>🔥 {r}{r === 1 ? ' día' : ' días'} seguidos</span></Box>
      <Avance parte={n / total} />
      {meta ? <Nota>{meta.texto}: {r >= meta.meta ? '¡cumplida! Sigue hasta volverlo automático.' : 'te faltan ' + (meta.meta - r) + ' días seguidos. Si fallas uno, vuelve al camino al otro día.'}</Nota> : null}
    </Tarjeta>
  );
}
function lectura(l: Fin, n: number) {
  const P = B.P(), d = l.lecturas[n - 1], p = P.practica[n] || {}, leida = P.leidos[n], total = B.total(l);
  return (
    <Tarjeta component="article" sx={{ '& p': { lineHeight: 1.55 } }}>
      <Box sx={FILA}>
        <Box component="span" sx={{ color: tokens.dorado, fontWeight: 800, fontSize: 13, letterSpacing: '.06em' }}>{l.unidad.toUpperCase()} {String(n).padStart(2, '0')} DE {total}</Box>
        {leida ? <Nota sx={{ m: 0 }}>✓ leída el {fechaCorta(leida)}</Nota> : null}
      </Box>
      <Typography component="h2" sx={{ fontSize: 23, fontWeight: 700, m: '4px 0 10px' }}>{d.titulo}</Typography>
      <Box component="p" sx={{ fontSize: 17, fontWeight: 600, borderLeft: '3px solid', borderColor: 'primary.main', pl: '10px', m: '0 0 10px' }}>{d.idea}</Box>
      <p>{d.intro}</p>
      {(d.bloques as [string, string[]][]).map(([t, puntos], i) => <div key={i}><Sub>{t}</Sub><Puntos items={puntos} /></div>)}
      {(d.formulas || []).length ? <Caja titulo="Fórmulas" formula>{(d.formulas as string[]).map((x, i) => <div key={i}>{x}</div>)}</Caja> : null}
      {d.nota ? <Caja titulo="💡 Para tener en cuenta"><div>{d.nota}</div></Caja> : null}
      {d.afirmacion ? <Afirmacion>{d.afirmacion}</Afirmacion> : null}
      <Sub>✅ Práctica</Sub>
      <Pasos>{(d.practica as string[]).map((x, i) => <Paso key={i} hecho={!!p[i]} datos={{ 'data-accion': 'libro-practica', 'data-n': n, 'data-i': i }}>{x}</Paso>)}</Pasos>
      <Sub>✍️ Diario</Sub>
      <Box sx={{ mt: '4px' }}><CampoLargo key={n} etiqueta={d.pregunta} filas={3} data-cambio="libro-nota" data-n={n} defaultValue={P.notas[n] || ''} /></Box>
      <Button fullWidth color={leida ? 'secondary' : 'primary'} data-accion="libro-leida" data-n={n} sx={{ ...Grande, mt: '14px' }}>{leida ? '↩ Marcar como no leída' : '✓ Terminé la lectura de hoy'}</Button>
      <Botones>
        {n > 1 ? <Button color="secondary" data-accion="libro-abrir" data-n={n - 1} sx={Grande}>← {l.unidad} {n - 1}</Button> : null}
        {n < total ? <Button color="secondary" data-accion="libro-abrir" data-n={n + 1} sx={Grande}>{l.unidad} {n + 1} →</Button> : null}
      </Botones>
    </Tarjeta>
  );
}
function afirmacion(e: Fin, l: Fin, actual: string) {
  const a = afirmacionDelDia(l) as string | null;
  if (!a) return null;
  const veces = (delDia(e.dias, iso(), actual) as Fin).afirmaciones || 0;
  return (
    <Tarjeta>
      <Box sx={FILA}><b>🗣 Afirmación de hoy</b><Nota sx={{ m: 0 }}>{veces}{veces === 1 ? ' vez' : ' veces'}</Nota></Box>
      <Afirmacion>{a}</Afirmacion>
      <Nota>Dila en voz alta, con emoción y viéndote así (palabras + imágenes + emoción).</Nota>
      <Button fullWidth color="secondary" data-accion="libro-afirmar">🔁 La dije (+1)</Button>
    </Tarjeta>
  );
}
function hoy(e: Fin, l: Fin, ver: Fin) {
  const P = B.P(), toca = lecturaQueToca(l, P) as number | null, n = ver.abierto || toca;
  if (!n) return (
    <>
      {cabecera(e, l)}
      <TarjetaPlegable vista={VISTA} clave={'🎉 ¡Completaste las ' + B.total(l) + ' lecturas!'} titulo={'🎉 ¡Completaste las ' + B.total(l) + ' lecturas!'}>
        <Parrafo>Repetirlo es como un hábito: cada vuelta lo graba más hondo. Tus notas, fichas y perfil se quedan.</Parrafo>
        <Button fullWidth data-accion="libro-vuelta" sx={Grande}>🔁 Empezar la vuelta {P.vuelta + 1}</Button>
      </TarjetaPlegable>
      {afirmacion(e, l, ver.actual)}
    </>
  );
  return (
    <>
      {cabecera(e, l)}
      {ver.abierto && ver.abierto !== toca && toca ? <Nota>Estás viendo {l.unidad.toLowerCase()} {ver.abierto}. <Enlace n={0}>Volver a la de hoy ({toca})</Enlace></Nota> : null}
      {afirmacion(e, l, ver.actual)}
      {lectura(l, n)}
    </>
  );
}

// ---------- 📚 Lecturas ----------
function lecturas(l: Fin) {
  const P = B.P(), toca = lecturaQueToca(l, P);
  return (
    <Tarjeta>
      <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '6px', '& small': { display: 'block', mt: '2px', color: 'text.secondary', fontSize: 13 } }}>
        {(l.lecturas as Fin[]).map((d) => {
          const leida = P.leidos[d.n], p = Object.keys(P.practica[d.n] || {}).length;
          return (
            <li key={d.n}>
              <ButtonBase data-accion="libro-abrir" data-n={d.n} sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', textAlign: 'left', p: '10px', borderRadius: '12px', border: '1px solid', borderColor: !leida && d.n === toca ? tokens.dorado : 'divider', bgcolor: tokens.surface2, color: 'text.primary', font: 'inherit' }}>
                <Box component="span" sx={{ flex: 'none', width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', border: '1px solid', fontWeight: 800, ...(leida ? { bgcolor: 'primary.main', borderColor: 'primary.main', color: 'primary.contrastText' } : { bgcolor: 'background.paper', borderColor: 'divider' }) }}>{leida ? '✓' : d.n}</Box>
                <span><b>{d.titulo}</b><small>{d.idea}</small>{p ? <small>Práctica {p}/{d.practica.length}{P.notas[d.n] ? ' · con nota' : ''}</small> : null}</span>
              </ButtonBase>
            </li>
          );
        })}
      </Box>
    </Tarjeta>
  );
}

// ---------- 💬 Preguntar ----------
const enlaceLectura = (l: Fin, n: number) => <Chip key={n} clickable variant="outlined" data-accion="libro-abrir" data-n={n} label={l.unidad + ' ' + n + ' · ' + l.lecturas[n - 1].titulo} sx={{ height: 'auto', minHeight: 44, '& .MuiChip-label': { whiteSpace: 'normal', py: '6px' } }} />;
function consejo(l: Fin, c: Fin) {
  return (
    <TarjetaPlegable key={c.id} vista={VISTA} clave={c.icono + ' ' + c.texto} titulo={c.icono + ' ' + c.texto}>
      <Sub>Haz esto ahora</Sub>
      <Puntos items={c.ahora} ordenada />
      {c.pregunta ? <Caja titulo="🤔 Para reflexionar"><div>{c.pregunta}</div></Caja> : null}
      {c.afirmacion ? <Afirmacion>{c.afirmacion}</Afirmacion> : null}
      {c.herramienta ? <Button fullWidth data-accion="libro-herramienta" data-h={c.herramienta} sx={{ mt: '10px' }}>Abrir la herramienta →</Button> : null}
      {c.sesion ? <Botones><Sesion id={c.sesion} texto="▶ Sesión guiada" /></Botones> : null}
      <Sub>Relee</Sub>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{(c.dias as number[]).map((n) => enlaceLectura(l, n))}</Box>
    </TarjetaPlegable>
  );
}
const conceptoDe = (l: Fin, c: Fin, k: number) => (
  <Box key={k} sx={{ p: '10px 0', borderBottom: '1px solid', borderColor: 'divider', display: 'grid', gap: '4px', '&:last-child': { borderBottom: 0 } }}>
    <b>{c.nombre}</b><div>{c.texto}</div>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{(c.dias as number[]).map((n) => <Chip key={n} clickable size="small" variant="outlined" data-accion="libro-abrir" data-n={n} label={l.unidad + ' ' + n} />)}</Box>
  </Box>
);
const TituloGrupo = ({ children }: { children: ReactNode }) => <Typography component="h2" sx={{ m: '18px 0 8px', color: 'text.secondary', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{children}</Typography>;
function resultados(l: Fin, r: Fin) {
  if (!r.consejos.length && !r.lecturas.length && !r.conceptos.length) return <Tarjeta><Parrafo sx={{ m: 0 }}>No encontré eso en el libro. Prueba con otra palabra o elige una situación abajo.</Parrafo></Tarjeta>;
  return (
    <>
      {(r.consejos as Fin[]).map((c) => consejo(l, c))}
      {r.lecturas.length ? <>
        <TituloGrupo>En las lecturas</TituloGrupo>
        {(r.lecturas as Fin[]).map((d) => (
          <Tarjeta key={d.n}>
            <Box sx={{ ...FILA, mb: '6px' }}><b>{l.unidad} {d.n} · {d.titulo}</b><Button color="secondary" data-accion="libro-abrir" data-n={d.n}>Leer →</Button></Box>
            <Puntos items={d.puntos} />
          </Tarjeta>
        ))}
      </> : null}
      {r.conceptos.length ? <><TituloGrupo>{l.conceptos.titulo}</TituloGrupo><Tarjeta>{(r.conceptos as Fin[]).map((c, k) => conceptoDe(l, c, k))}</Tarjeta></> : null}
    </>
  );
}
function preguntar(l: Fin, ver: Fin) {
  const r = ver.consulta ? buscar(l, ver.consulta) as Fin : null, sel = (l.consejos as Fin[]).find((c) => c.id === ver.consejo);
  const boton = (c: Fin) => (
    <Chip key={c.id} clickable data-accion="libro-consejo" data-c={c.id} color={c.id === ver.consejo ? 'primary' : 'default'} variant={c.id === ver.consejo ? 'filled' : 'outlined'} label={c.icono + ' ' + c.texto}
      sx={{ height: 'auto', minHeight: 44, borderRadius: '12px', justifyContent: 'flex-start', '& .MuiChip-label': { whiteSpace: 'normal', py: '8px', textAlign: 'left' } }} />
  );
  const rejilla = (cs: Fin[]) => <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '8px', mb: '14px' }}>{cs.map(boton)}</Box>;
  return (
    <>
      <Tarjeta sx={{ display: 'grid', gap: '10px' }}>
        <Campo etiqueta="Pregúntale al libro (una palabra o una frase)" type="search" enterKeyHint="search" data-cambio="libro-buscar" defaultValue={ver.consulta} placeholder={'Ej.: ' + (l.consejos as Fin[]).slice(0, 3).map((c) => c.texto.toLowerCase()).join(', ')} />
        {ver.consulta ? <Button fullWidth color="secondary" data-accion="libro-limpiar">Borrar búsqueda</Button> : null}
      </Tarjeta>
      {r ? resultados(l, r) : null}
      {sel ? consejo(l, sel) : null}
      <TituloGrupo>¿Qué te pasa hoy?</TituloGrupo>
      {l.grupos
        ? (l.grupos as [string, string[]][]).map(([titulo, ids]) => <div key={titulo}><Sub>{titulo}</Sub>{rejilla(ids.map((id) => (l.consejos as Fin[]).find((c) => c.id === id)))}</div>)
        : rejilla(l.consejos)}
    </>
  );
}

// ---------- 🔆 Conceptos y 🗓 Rutina ----------
function conceptos(l: Fin) {
  const otro = libro(l.conceptos.ampliar) as Fin;
  return (
    <>
      <Nota>{l.conceptos.lista.length} {l.conceptos.titulo.toLowerCase()} del libro, con dónde aparece cada una.</Nota>
      {otro ? <Button fullWidth data-accion="libro-elegir" data-id={otro.id} sx={{ ...Grande, mb: '14px' }}>{otro.icono} Cada una explicada con ejemplos: {otro.titulo} →</Button> : null}
      <Tarjeta>{(l.conceptos.lista as Fin[]).map((c, k) => conceptoDe(l, c, k))}</Tarjeta>
    </>
  );
}
function rutina(l: Fin) {
  return (
    <>
      <Nota>Todo el libro convertido en un día. Síguela mientras lo lees (y después).</Nota>
      {(l.rutina as [string, string[]][]).map(([t, pasos]) => <TarjetaPlegable key={t} vista={VISTA} clave={t} titulo={t}><Puntos items={pasos} /></TarjetaPlegable>)}
      {(l.musica || []).length ? (
        <TarjetaPlegable vista={VISTA} clave="🎧 Música del seminario" titulo="🎧 Música del seminario">
          <Nota>Listas de 100 canciones en Spotify. Se abren en la app de Spotify (o en el navegador).</Nota>
          {(l.musica as Fin[]).map((m) => (
            <Button key={m.url} component="a" href={m.url} target="_blank" rel="noopener noreferrer" fullWidth color="secondary"
              sx={{ justifyContent: 'flex-start', textAlign: 'left', minHeight: 56, mt: '8px', display: 'grid', gap: '2px', textTransform: 'none' }}>
              <b>{m.nombre} ↗</b><Box component="small" sx={{ color: 'text.secondary', fontWeight: 400 }}>{m.para}</Box>
            </Button>
          ))}
        </TarjetaPlegable>
      ) : null}
      {(l.sesiones || []).length ? <TarjetaPlegable vista={VISTA} clave="🧘 Sesiones guiadas" titulo="🧘 Sesiones guiadas"><Botones>{(l.sesiones as Fin[]).map((s) => <Sesion key={s.id} id={s.id} texto={'▶ ' + s.nombre} />)}</Botones></TarjetaPlegable> : null}
    </>
  );
}

// ---------- 🛠 Herramientas ----------
function diario(e: Fin, l: Fin, actual: string) {
  const def = l.diario, hoyD = delDia(e.dias, iso(), actual) as Fin, ayer = def.ayer && (delDia(e.dias, sumarDias(iso(), -1), actual) as Fin)[def.ayer[0]];
  return (
    <>
      {ayer ? <Caja titulo={def.ayer[1]}><Box sx={{ whiteSpace: 'pre-line' }}>{ayer}</Box></Caja> : null}
      {(def.campos as [string, string][]).map(([k, t]) => <CampoLargo key={k} etiqueta={t} filas={3} data-cambio="libro-dia" data-k={k} defaultValue={hoyD[k] || ''} />)}
    </>
  );
}
function fichas(l: Fin, tipo: string, ver: Fin) {
  const P = B.P(), def = l.fichas[tipo], lista = (P.fichas[tipo] || []) as Fin[];
  return (
    <>
      {def.lectura ? <Nota sx={{ m: 0 }}>De {l.unidad.toLowerCase()} {def.lectura}. <Enlace n={def.lectura}>Releer</Enlace></Nota> : null}
      <Button fullWidth data-accion="libro-nueva" data-t={tipo}>{def.nueva}</Button>
      {lista.map((x) => (
        <Abrible key={x.id} clave={x.id} abierto={ver.desplegados.has(x.id)} titulo={<span><b>{x[def.campos[0][0]] || '(sin escribir)'}</b> <Box component="small" sx={{ color: 'text.secondary' }}>{fechaCorta(x.fecha)}</Box></span>}>
          {(def.campos as [string, string, string?][]).map(([k, etiqueta, tipoCampo]) => tipoCampo === 'date'
            ? <Campo key={k} etiqueta={etiqueta} type="date" data-cambio="libro-ficha" data-t={tipo} data-id={x.id} data-k={k} defaultValue={x[k] || ''} />
            : <CampoLargo key={k} etiqueta={etiqueta} filas={2} data-cambio="libro-ficha" data-t={tipo} data-id={x.id} data-k={k} defaultValue={x[k] || ''} />)}
          <Button fullWidth data-accion="libro-borrar" data-t={tipo} data-id={x.id} sx={{ bgcolor: tokens.rojoFondo, color: tokens.peligroInk, '&:hover': { bgcolor: tokens.rojoFondo } }}>Borrar</Button>
        </Abrible>
      ))}
    </>
  );
}
function evaluacion(l: Fin, id: string) {
  const P = B.P(), ev = l.evaluaciones[id], est = (P.evaluaciones || {})[id] || {}, marcados = est.marcados || {}, r = resultadoEvaluacion(ev, marcados) as Fin;
  const n = ev.items.length, orden = (ev.items as Fin[]).map((_, i) => i);
  if (n % 7) orden.sort((a, b) => ((a * 7) % n) - ((b * 7) % n));
  const historial = ((est.historial || []) as Fin[]).slice(-6).reverse(), cat = ev.categorias;
  return (
    <>
      {ev.lectura ? <Nota sx={{ m: 0 }}>De {l.unidad.toLowerCase()} {ev.lectura}. <Enlace n={ev.lectura}>Releer</Enlace></Nota> : null}
      <Box component="p" sx={{ m: 0 }}>{ev.intro}</Box>
      <Pasos>{orden.map((i) => <Paso key={i} hecho={!!marcados[i]} datos={{ 'data-accion': 'libro-eval', 'data-ev': id, 'data-i': i }}>{ev.items[i][0]}</Paso>)}</Pasos>
      {r.principal ? (
        <div>
          <Sub>Tu resultado</Sub>
          {Object.entries(r.pct as Record<string, number>).map(([k, v]) => (
            <div key={k}>
              <Box sx={{ ...FILA, mb: '6px' }}><span>{cat[k].nombre}</span><b>{Math.round(v * 100)} %</b></Box>
              <Box sx={k === r.principal ? null : { '& [role=progressbar] > div': { opacity: 0.45 } }}><Avance parte={v} /></Box>
            </div>
          ))}
          <Caja titulo={'Estás sobre todo en: ' + cat[r.principal].nombre}><div>{cat[r.principal].consejo}</div></Caja>
          <Botones>
            <Button data-accion="libro-eval-guardar" data-ev={id}>💾 Guardar resultado de hoy</Button>
            <Button color="secondary" data-accion="libro-eval-limpiar" data-ev={id}>Empezar de nuevo</Button>
          </Botones>
        </div>
      ) : <Nota sx={{ m: 0 }}>Marca las frases para ver tu resultado.</Nota>}
      {historial.length ? <><Sub>Tu evolución</Sub><Puntos items={historial.map((h) => fechaCorta(h.fecha) + ': ' + ((cat[h.principal] || {}).nombre || h.principal))} /></> : null}
    </>
  );
}
function herramientas(e: Fin, l: Fin, ver: Fin) {
  const P = B.P(), D = ver.desplegados as Set<string>;
  const bloque = (id: string, titulo: string, contenido: ReactNode) => (
    <Abrible key={id} tarjeta clave={id} abierto={D.has(id)} titulo={<Box component="h2" sx={{ display: 'inline', m: 0, fontSize: 17 }}>{titulo}</Box>}>{contenido}</Abrible>
  );
  return (
    <>
      {Object.entries((l.evaluaciones || {}) as Record<string, Fin>).map(([k, ev]) => bloque(k, ev.icono + ' ' + ev.titulo, evaluacion(l, k)))}
      {l.diario ? bloque('diario', l.diario.titulo, diario(e, l, ver.actual)) : null}
      {Object.entries((l.fichas || {}) as Record<string, Fin>).map(([k, def]) => { const n = (P.fichas[k] || []).length; return bloque(k, def.icono + ' ' + def.titulo + (n ? ' (' + n + ')' : ''), fichas(l, k, ver)); })}
      {l.perfil ? bloque('perfil', l.perfil.titulo, (l.perfil.campos as [string, string][]).map(([k, t]) => <CampoLargo key={k} etiqueta={t} filas={3} data-cambio="libro-perfil" data-k={k} defaultValue={P.perfil[k] || ''} />)) : null}
      {(l.sesiones || []).length ? bloque('sesiones', '🧘 Sesiones guiadas', <Botones>{(l.sesiones as Fin[]).map((s) => <Sesion key={s.id} id={s.id} texto={'▶ ' + s.nombre} />)}</Botones>) : null}
    </>
  );
}

// ---------- La biblioteca ----------
function biblioteca() {
  return (
    <>
      <Button color="secondary" href="#estudiar" sx={{ mb: '8px' }}>← 🎓 Estudiar</Button>
      <TituloPantalla>📚 Libros</TituloPantalla>
      <Box component="p" sx={{ color: 'text.secondary', m: '-8px 0 12px' }}>Cada libro, una lectura por día. Para sumar uno, pásale el PDF a Claude con /agregar-libro.</Box>
      {(librosVisibles() as Fin[]).map((l) => {
        const p = B.progreso(l.id), n = leidas(l, p) as number, toca = lecturaQueToca(l, p), total = B.total(l);
        return (
          <Card key={l.id} component={ButtonBase} data-accion="libro-elegir" data-id={l.id}
            sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', textAlign: 'left', color: 'text.primary', font: 'inherit', mb: '14px' }}>
            <Box component="span" sx={{ fontSize: 32, lineHeight: 1 }}>{l.icono}</Box>
            <Box component="span" sx={{ flex: 1, display: 'grid', gap: '4px', '& small': { color: 'text.secondary', fontSize: 14 }, '& [role=progressbar]': { m: 0 } }}>
              <b>{l.titulo}</b><small>{l.autor} · {l.descripcion}</small>
              <small>{toca ? 'Toca: ' + l.unidad.toLowerCase() + ' ' + toca + ' · ' : '¡Completo! · '}{n}/{total}</small>
              <Avance parte={n / total} />
            </Box>
          </Card>
        );
      })}
    </>
  );
}

export default function Libros({ pestana }: { pestana?: string }) {
  // "#libros/fenix" abre ese libro (una sola vez, al abrir)
  useState(() => { if (pestana) accion('abrir-libros', { p: pestana }); return 0; });
  const e = usarEstado() as Fin, ver = B.ver(), l = B.L() as Fin;
  // Un libro que el admin escondió no se abre ni por enlace
  if (!l || !ve('curso', ver.actual)) return biblioteca();
  const tabs: [string, string][] = [['hoy', '📖 Hoy'], ['lecturas', '📚 ' + B.total(l) + ' lecturas'], ['preguntar', '💬 Preguntar'], ['herramientas', '🛠 Herramientas'], ['rutina', '🗓 Rutina']];
  if (l.conceptos) tabs.push(['conceptos', l.conceptos.icono + ' ' + l.conceptos.titulo]);
  const p = tabs.some(([k]) => k === ver.pestana) ? ver.pestana : 'hoy';
  return (
    <>
      {LIBROS.length > 1 ? <Button color="secondary" data-accion="libro-elegir" data-id="" sx={{ mb: '8px' }}>← Biblioteca</Button> : null}
      <TituloPantalla>{l.icono} {l.titulo}</TituloPantalla>
      <Box component="p" sx={{ color: 'text.secondary', m: '-8px 0 12px' }}>{l.autor} · {l.descripcion}</Box>
      <Opciones nombre="Pestañas del libro" activa={ver.pestana} opciones={tabs} datos={(k) => ({ 'data-accion': 'libro-pestana', 'data-p': k })} sx={{ '& .MuiChip-root': { fontSize: 15 } }} />
      {p === 'lecturas' ? lecturas(l) : p === 'preguntar' ? preguntar(l, ver) : p === 'herramientas' ? herramientas(e, l, ver) : p === 'rutina' ? rutina(l) : p === 'conceptos' ? conceptos(l) : hoy(e, l, ver)}
    </>
  );
}
