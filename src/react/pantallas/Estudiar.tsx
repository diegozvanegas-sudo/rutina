// 🎓 Estudiar: el plan del día según los minutos (repasos y lecciones), el cronómetro, las áreas y sus cursos, cada curso
// con su lección (recordar sin mirar, explícalo simple, escucha y repite, práctica, diario), lecciones, mapa, proyecto y
// fuentes, y el repaso de tarjetas. 📚 Libros es un área más (sus libros se abren en #libros/<id>). React pinta; las reglas
// son las de src/vistas/estudiar.js (estudio-…) y, en Inglés B2, las horas de src/vistas/mejora.js (ing-…).
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, Card, Chip, IconButton, Link } from '@mui/material';
import { segundosCrono } from '../../estado.js';
import { iso, reloj, fechaCorta } from '../../fechas.js';
import { CURSOS, curso, area } from '../../cursos/index.js';
import { LIBROS } from '../../libros/index.js';
import { lecturaQueToca, leidas } from '../../biblioteca.js';
import { lecciones, leccion, leccionQueToca, hechas, avance, tarjeta, dominada, rachaEstudio, INTERVALOS } from '../../estudio.js';
import { ve } from '../../permisos.js';
import { promptMentor } from '../../mentor.js';
import { ingles, resumenIngles } from '../../mejora.js';
import { piezasEstudio } from '../../vistas/estudiar.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo, CampoLista, DOS } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';
import { Avance } from '../ui/Varios';
import { Sub, Puntos, Caja, Paso, Pasos, Dia, TituloLectura, Idea, ListaNumerada, FilaNumerada, TarjetaLibro } from '../ui/Lectura';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'estudiar';
const S = piezasEstudio as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const Tarjeta = ({ children, sx, component = 'section' }: { children: ReactNode; sx?: object; component?: string }) => <Card component={component as 'section'} sx={{ mb: '14px', ...sx }}>{children}</Card>;
const Botones = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' }}>{children}</Box>;
const Grande = { minHeight: 56, fontSize: 17 };
const Bajada = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ color: 'text.secondary', m: '-8px 0 12px' }}>{children}</Box>;
const Volver = ({ datos, children }: { datos: Record<string, string>; children: ReactNode }) => <Button color="secondary" {...datos} sx={{ mb: '8px' }}>{children}</Button>;
const Respuesta = ({ children, sx }: { children: ReactNode; sx?: object }) => <Box sx={{ bgcolor: tokens.surface2, borderLeft: '3px solid', borderColor: 'primary.main', borderRadius: '8px', p: '8px 10px', lineHeight: 1.5, ...sx }}>{children}</Box>;
const Recordar = ({ children }: { children: ReactNode }) => <Box component="ol" sx={{ m: 0, pl: '20px', display: 'grid', gap: '12px', '& > li': { display: 'grid', gap: '6px', justifyItems: 'start' } }}>{children}</Box>;
const TituloGrupo = ({ children }: { children: ReactNode }) => <Box component="h2" sx={{ m: '18px 0 8px', color: 'text.secondary', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{children}</Box>;
const nombreLeccion = (s: Fin) => { const c = curso(s.curso) as Fin, l = leccion(c, s.n) as Fin; return c.icono + ' ' + c.nombre + ' · lección ' + s.n + ': ' + l.titulo; };

// El cronómetro de estudio corre aquí mismo (su propio reloj, sin el data-crono de las pantallas de antes)
function Cronometro({ c }: { c: Fin }) {
  const [, tic] = useState(0), corre = !!(c && c.inicio);
  useEffect(() => { if (!corre) return undefined; const t = setInterval(() => tic((n) => n + 1), 500); return () => clearInterval(t); }, [corre]);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', color: 'text.secondary', alignSelf: 'end' }}>
      <Box component="span" role="timer" sx={{ fontVariantNumeric: 'tabular-nums', fontSize: 22, fontWeight: 800, color: 'text.primary' }}>{reloj(segundosCrono(c))}</Box>
      <Button color="secondary" data-accion="estudio-crono">{corre ? '⏸ Pausa' : '▶ Estudiar'}</Button>
      <Box component="small" sx={{ fontSize: 14 }}>Suma a tu meta de 📖 Lectura</Box>
    </Box>
  );
}

// ---------- Inicio ----------
function tarjetaPlan(e: Fin) {
  const p = S.plan() as Fin, E = e.estudio, r = rachaEstudio(E.dias) as number, h = E.dias[iso()], minutos = e.config.estudio.minutos;
  let cuerpo: ReactNode;
  if (!S.cursosVisibles().length) cuerpo = <Parrafo>Aún no hay cursos disponibles para ti.</Parrafo>;
  else if (p.listo) cuerpo = <>
    <Box component="p" sx={{ fontSize: 20, m: '4px 0 12px' }}>✅ Listo por hoy</Box>
    <Nota>{h && (h.lecciones || h.repasos) ? 'Hoy: ' + (h.lecciones || 0) + ' lección(es) y ' + (h.repasos || 0) + ' repaso(s). Mañana vuelven tus tarjetas.' : 'No hay nada pendiente.'}</Nota>
  </>;
  else cuerpo = <>
    <Box component="ol" sx={{ listStyle: 'none', m: '0 0 8px', p: 0, display: 'grid', gap: '8px', '& .MuiButton-root': { justifyContent: 'flex-start', textAlign: 'left' } }}>
      {p.repasos ? <li><Button fullWidth data-accion="estudio-repasar">🔁 Repasar {p.repasos}{p.repasos === 1 ? ' tarjeta' : ' tarjetas'} (~{Math.max(1, Math.round(p.repasos / 2))} min)</Button></li> : null}
      {(p.lecciones as Fin[]).map((s) => <li key={s.curso + s.n}><Button fullWidth color={p.repasos ? 'secondary' : 'primary'} data-accion="estudio-leccion" data-c={s.curso} data-n={s.n}>📖 {nombreLeccion(s)} ({s.minutos} min)</Button></li>)}
    </Box>
    {p.quedanRepasos ? <Nota>Quedan {p.quedanRepasos} tarjetas para mañana: hoy no caben en tus {minutos} minutos.</Nota> : null}
    {p.excede ? <Nota>La lección dura más que tus minutos de hoy: hazla completa o por partes.</Nota> : null}
    {p.repasos && !p.lecciones.length && !p.quedanRepasos ? <Nota>Hoy solo repaso: no alcanza el tiempo para una lección nueva.</Nota> : null}
  </>;
  return (
    <TarjetaPlegable vista={VISTA} clave="📅 Hoy estudias…" titulo="📅 Hoy estudias…" lado={<span>🔥 {r}{r === 1 ? ' día' : ' días'}</span>}>
      {cuerpo}
      <Box sx={DOS}>
        <Box sx={{ maxWidth: 260 }}><Campo etiqueta="Minutos de estudio al día" type="number" inputMode="numeric" min={5} max={240} step={5} data-cambio="estudio-minutos" defaultValue={minutos} /></Box>
        <Cronometro c={((e.dias[iso()] || {}).crono || {}).estudio} />
      </Box>
    </TarjetaPlegable>
  );
}
function inicio(e: Fin) {
  const E = e.estudio, total = Object.keys(E.tarjetas).length, dom = (Object.values(E.tarjetas) as Fin[]).filter(dominada).length;
  return (
    <>
      <TituloPantalla>🎓 Estudiar</TituloPantalla>
      <Bajada>Pocos minutos todos los días: primero repasas lo que toca y luego aprendes algo nuevo.</Bajada>
      {tarjetaPlan(e)}
      {total ? <Nota>🃏 {total} tarjetas en tu mazo · {dom} dominadas (aciertos a {(INTERVALOS as number[]).join(', ')} días)</Nota> : null}
      <TituloGrupo>Áreas</TituloGrupo>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', columnGap: '14px' }}>
        {(S.areasVisibles() as Fin[]).map((a) => {
          const con = (a.cursos as Fin[]).filter((x) => x.libro || curso(x.id)).length;
          return <TarjetaLibro key={a.id} icono={a.icono} titulo={a.nombre} datos={{ 'data-accion': 'estudio-area', 'data-a': a.id }} avance={S.avanceArea(a)}
            lineas={[a.descripcion, a.cursos.length + (a.cursos.length === 1 ? ' curso' : ' cursos') + (con < a.cursos.length ? ' · ' + con + ' disponibles' : '')]} />;
        })}
      </Box>
    </>
  );
}

// ---------- Área ----------
function vistaArea(e: Fin, id: string) {
  const a = area(id) as Fin;
  return (
    <>
      <Volver datos={{ 'data-accion': 'estudio-area', 'data-a': '' }}>← Estudiar</Volver>
      <TituloPantalla>{a.icono} {a.nombre}</TituloPantalla>
      <Bajada>{a.descripcion}</Bajada>
      {(a.cursos as Fin[]).filter((x) => S.veCurso(a, x)).map((x) => {
        if (x.libro) {
          const l = (LIBROS as Fin[]).find((y) => y.id === x.id), pl = e.libros[l.id] || { leidos: {} }, toca = lecturaQueToca(l, pl), n = leidas(l, pl) as number;
          return <TarjetaLibro key={x.id} icono={l.icono} titulo={l.titulo} href={'#libros/' + l.id} avance={n / l.lecturas.length}
            lineas={[l.autor + ' · ' + l.descripcion, (toca ? 'Toca: ' + l.unidad.toLowerCase() + ' ' + toca + ' · ' : '¡Completo! · ') + n + '/' + l.lecturas.length]} />;
        }
        const c = curso(x.id) as Fin;
        if (!c) return <TarjetaLibro key={x.id} apagada icono={x.icono} titulo={x.nombre} lineas={[x.descripcion, '⏳ Próximamente']} />;
        const p = S.progreso(c.id), toca = leccionQueToca(c, p);
        return <TarjetaLibro key={x.id} icono={c.icono} titulo={c.nombre} datos={{ 'data-accion': 'estudio-curso', 'data-c': c.id }} avance={avance(c, p)}
          lineas={[c.nivel + ' · ' + x.descripcion, (toca ? 'Toca: lección ' + toca + ' · ' : '¡Completo! · ') + hechas(c, p) + '/' + lecciones(c).length + ' lecciones']} />;
      })}
    </>
  );
}

// ---------- Curso ----------
function recordarSinMirar(ver: Fin, l: Fin) {
  const r = S.P().recordar[l.n] || {};
  return (
    <>
      <Sub>🧠 Recordar sin mirar</Sub>
      <Nota>Responde en tu cabeza o en un papel antes de ver la respuesta. El esfuerzo es lo que enseña.</Nota>
      <Recordar>
        {(l.recordar as [string, string][]).map(([q, a], i) => {
          const clave = ver.cursoAbierto + ':' + l.n + ':' + i, visto = ver.vistas.has(clave) || i in r;
          const ok = (v: boolean, t: string) => <Chip clickable data-accion="estudio-recordar" data-n={l.n} data-i={i} data-ok={v ? '1' : ''} color={r[i] === v ? 'primary' : 'default'} variant={r[i] === v ? 'filled' : 'outlined'} label={t} />;
          return (
            <li key={i}>
              <b>{q}</b>
              {visto ? <><Respuesta>{a}</Respuesta><Botones>{ok(true, '✓ La sabía')}{ok(false, '✗ No la sabía')}</Botones></>
                : <Button color="secondary" data-accion="estudio-ver" data-k={clave}>Ver respuesta</Button>}
            </li>
          );
        })}
      </Recordar>
    </>
  );
}
// Escuchar (cursos de idiomas): la voz del dispositivo lee cada frase; "sombra" deja tiempo para repetirla
function escuchar(ver: Fin, c: Fin, l: Fin) {
  if (!l.escuchar) return null;
  return (
    <>
      <Sub>🎧 Escucha y repite</Sub>
      <Nota>Escucha, repite en voz alta imitando el ritmo y la entonación, y después tapa el español y di qué significa. 🐢 = más lento.</Nota>
      <Button fullWidth color="secondary" data-accion="estudio-sombra" data-n={l.n}>{ver.sombra ? '⏹ Parar' : '🔁 Sombra: todas, con pausa para repetir'}</Button>
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: '8px 0 0', display: 'grid', gap: '6px' }}>
        {(l.escuchar as [string, string][]).map(([en, es], i) => (
          <Box component="li" key={i} sx={{ ...FILA, gap: '8px', p: '8px 10px', bgcolor: 'background.default', borderRadius: '10px' }}>
            <Box component="span" sx={{ display: 'grid', gap: '2px', minWidth: 0 }}><b lang={c.idioma || 'en'}>{en}</b><Box component="small" sx={{ color: 'text.secondary' }}>{es}</Box></Box>
            <Box component="span" sx={{ display: 'flex', gap: '4px', flex: 'none' }}>
              <IconButton data-accion="estudio-hablar" data-n={l.n} data-i={i} aria-label="Escuchar" sx={{ fontSize: 20 }}>🔊</IconButton>
              <IconButton data-accion="estudio-hablar" data-n={l.n} data-i={i} data-lento="1" aria-label="Escuchar lento" sx={{ fontSize: 20 }}>🐢</IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}
function vistaLeccion(ver: Fin, n: number) {
  const c = S.C(), l = leccion(c, n) as Fin, p = S.P(), hecha = p.hechas[n], pr = p.practica[n] || {}, total = lecciones(c).length, m = c.modulos[l.modulo - 1];
  return (
    <Tarjeta component="article" sx={{ '& p': { lineHeight: 1.55 } }}>
      <Box sx={FILA}><Dia>LECCIÓN {String(n).padStart(2, '0')} DE {total} · {l.minutos} MIN</Dia>{hecha ? <Nota sx={{ m: 0 }}>✓ el {fechaCorta(hecha)}</Nota> : null}</Box>
      <Nota>Módulo {l.modulo}: {m.titulo}</Nota>
      <TituloLectura>{l.titulo}</TituloLectura>
      <Idea>{l.idea}</Idea>
      {(l.bloques as [string, string[]][]).map(([t, ps], i) => <div key={i}><Sub>{t}</Sub><Puntos items={ps} /></div>)}
      <Sub>🔎 Ejemplos</Sub><Puntos items={l.ejemplos} />
      <Caja titulo="💡 Para tener en cuenta"><div>{l.nota}</div></Caja>
      {recordarSinMirar(ver, l)}
      {/* Opcionales (cursos nuevos): explicarlo simple con palabras propias y un reto un poco por encima del nivel */}
      {l.feynman ? <>
        <Sub>🧒 Explícalo simple</Sub>
        <CampoLargo key={'f' + n} etiqueta={l.feynman} filas={3} data-cambio="estudio-diario" data-c={c.id} data-n={'f' + n} defaultValue={p.diario['f' + n] || ''} />
        <Nota>Sin mirar la lección. Donde te trabes o uses palabras vagas, ahí está lo que no entiendes: vuelve a leer esa parte.</Nota>
      </> : null}
      {l.reto ? <Caja titulo="🏋️ Reto"><div>{l.reto}</div></Caja> : null}
      {escuchar(ver, c, l)}
      <Sub>✅ Práctica</Sub>
      <Pasos>{(l.practica as string[]).map((x, i) => <Paso key={i} hecho={!!pr[i]} datos={{ 'data-accion': 'estudio-practica', 'data-n': n, 'data-i': i }}>{x}</Paso>)}</Pasos>
      <Sub>✍️ Diario</Sub>
      <CampoLargo key={n} etiqueta={l.pregunta} filas={3} data-cambio="estudio-diario" data-c={c.id} data-n={n} defaultValue={p.diario[n] || ''} />
      <Nota>🃏 Al terminar, {l.tarjetas.length} tarjetas de esta lección entran a tus repasos (vuelven mañana).</Nota>
      <Button fullWidth color={hecha ? 'secondary' : 'primary'} data-accion="estudio-hecha" data-n={n} sx={Grande}>{hecha ? '↩ Marcar como no terminada' : '✓ Terminé la lección'}</Button>
      <Botones>
        {n > 1 ? <Button color="secondary" data-accion="estudio-abrir" data-n={n - 1} sx={Grande}>← Lección {n - 1}</Button> : null}
        {n < total ? <Button color="secondary" data-accion="estudio-abrir" data-n={n + 1} sx={Grande}>Lección {n + 1} →</Button> : null}
      </Botones>
    </Tarjeta>
  );
}
function pestanaHoy(ver: Fin) {
  const c = S.C(), toca = leccionQueToca(c, S.P()), n = ver.abierta || toca;
  if (!n) return (
    <TarjetaPlegable vista={VISTA} clave={'🎉 ¡Terminaste las ' + lecciones(c).length + ' lecciones!'} titulo={'🎉 ¡Terminaste las ' + lecciones(c).length + ' lecciones!'}>
      <Parrafo>Tus tarjetas siguen volviendo para que no se olvide. Ahora haz el proyecto final.</Parrafo>
      <Button fullWidth data-accion="estudio-pestana" data-p="proyecto" sx={Grande}>🎯 Proyecto final</Button>
    </TarjetaPlegable>
  );
  return (
    <>
      {ver.abierta && toca && ver.abierta !== toca ? <Nota>Estás viendo la lección {ver.abierta}. <Link href="#estudiar" data-accion="estudio-abrir" data-n={0} sx={{ color: 'primary.main' }}>Volver a la de hoy ({toca})</Link></Nota> : null}
      {vistaLeccion(ver, n)}
    </>
  );
}
function pestanaLecciones() {
  const c = S.C(), p = S.P(), toca = leccionQueToca(c, p), ls = lecciones(c) as Fin[];
  return (c.modulos as Fin[]).map((m, im) => (
    <TarjetaPlegable key={im} vista={VISTA} clave={'Módulo ' + (im + 1) + ': ' + m.titulo} titulo={'Módulo ' + (im + 1) + ': ' + m.titulo}>
      <Nota>{m.objetivo}</Nota>
      {m.comprobacion ? <Nota>✔️ <b>Lo dominas si…</b> {m.comprobacion}</Nota> : null}
      <ListaNumerada>
        {ls.filter((l) => l.modulo === im + 1).map((l) => (
          <FilaNumerada key={l.n} n={l.n} hecha={!!p.hechas[l.n]} toca={l.n === toca} datos={{ 'data-accion': 'estudio-abrir', 'data-n': l.n }}>
            <b>{l.titulo}</b><small>{l.idea}</small>
            <small>{l.minutos} min{Object.keys(p.practica[l.n] || {}).length ? ' · práctica ' + Object.keys(p.practica[l.n]).length + '/3' : ''}{p.diario[l.n] ? ' · con diario' : ''}</small>
          </FilaNumerada>
        ))}
      </ListaNumerada>
    </TarjetaPlegable>
  ));
}
function pestanaProyecto() {
  const c = S.C(), pr = c.proyecto, hechos = S.P().proyecto;
  return (
    <TarjetaPlegable vista={VISTA} clave={'🎯 ' + pr.titulo} titulo={'🎯 ' + pr.titulo}>
      <Parrafo>{pr.intro}</Parrafo>
      <Pasos>{(pr.pasos as string[]).map((x, i) => <Paso key={i} hecho={!!hechos[i]} marca={i + 1} datos={{ 'data-accion': 'estudio-proyecto', 'data-i': i }}>{x}</Paso>)}</Pasos>
      <Box sx={{ mt: '10px' }}><CampoLargo etiqueta="Notas del proyecto" filas={4} data-cambio="estudio-diario" data-c={c.id} data-n="proyecto" defaultValue={S.P().diario.proyecto || ''} /></Box>
    </TarjetaPlegable>
  );
}
// Mapa: la analogía ancla, los primeros principios, el 80/20, el diagnóstico y el prompt para estudiar con un mentor IA
function pestanaMapa(e: Fin, ver: Fin) {
  const c = S.C();
  return (
    <>
      {c.ancla ? <TarjetaPlegable vista={VISTA} clave="⚓ La idea ancla" titulo="⚓ La idea ancla"><Parrafo>{c.ancla}</Parrafo></TarjetaPlegable> : null}
      {c.principios ? (
        <TarjetaPlegable vista={VISTA} clave="🧱 Primeros principios" titulo="🧱 Primeros principios">
          <Nota>Lo fundamental: todo el curso se deriva de estas ideas.</Nota>
          <Puntos items={c.principios} ordenada />
          {c.ochenta ? <Caja titulo="🎯 El 20% que más rinde"><div>{c.ochenta}</div></Caja> : null}
        </TarjetaPlegable>
      ) : null}
      {c.diagnostico ? (
        <TarjetaPlegable vista={VISTA} clave="🩺 ¿Cuánto sabes ya?" titulo="🩺 ¿Cuánto sabes ya?">
          <Nota>Tres preguntas de menos a más difícil. Respóndelas antes de empezar y vuelve a hacerlo al terminar: la diferencia es lo que aprendiste.</Nota>
          <Recordar>
            {(c.diagnostico as [string, string][]).map(([q, a], i) => {
              const clave = c.id + ':diag:' + i;
              return <li key={i}><b>{q}</b>{ver.vistas.has(clave) ? <Respuesta>{a}</Respuesta> : <Button color="secondary" data-accion="estudio-ver" data-k={clave}>Ver respuesta</Button>}</li>;
            })}
          </Recordar>
        </TarjetaPlegable>
      ) : null}
      <TarjetaPlegable vista={VISTA} clave="🤖 Estudiar con un mentor IA" titulo="🤖 Estudiar con un mentor IA">
        <Nota>Copia este prompt y pégalo en Claude (u otra IA). Va con el curso, tus minutos y lo que llevas, y te hace un diagnóstico, preguntas una por una y repasos.</Nota>
        <Button fullWidth data-accion="estudio-copiar-mentor">📋 Copiar prompt</Button>
        <Desplegable titulo={<Box component="span" sx={{ fontWeight: 400 }}>Ver el prompt</Box>}>
          <Box component="textarea" id="prompt-mentor" rows={12} readOnly value={promptMentor(c, S.P(), { minutos: e.config.estudio.minutos })}
            sx={{ width: '100%', boxSizing: 'border-box', font: '13px/1.5 ui-monospace, Consolas, monospace', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: '10px', p: '10px' }} />
        </Desplegable>
      </TarjetaPlegable>
    </>
  );
}
const pestanaFuentes = () => (
  <>
    <Nota>Las investigaciones y libros de donde sale cada módulo. Las notas "Para tener en cuenta" separan lo que tiene evidencia de lo que se suele exagerar.</Nota>
    {(S.C().modulos as Fin[]).map((m, im) => (
      <TarjetaPlegable key={im} vista={VISTA} clave={'Módulo ' + (im + 1) + ': ' + m.titulo} titulo={'Módulo ' + (im + 1) + ': ' + m.titulo}>
        <Puntos items={(m.fuentes as [string, string][]).map(([cita]) => cita)} chicos={(m.fuentes as [string, string][]).map(([, para]) => para)} />
      </TarjetaPlegable>
    ))}
  </>
);

// 🇬🇧 Mis horas de inglés (curso Inglés B2): sumar minutos, la meta y la prueba del mes
function tarjetaIngles(hoy = iso()) {
  const i = ingles() as Fin, r = resumenIngles(i, hoy) as Fin, num = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
  const nivel = (n: string, t: string) => <CampoLista etiqueta={t} name={n} defaultValue="3" opciones={['1', '2', '3', '4', '5'].map((v) => [v, v] as [string, string])} />;
  return (
    <TarjetaPlegable vista={VISTA} clave="🇬🇧 Mis horas de inglés" titulo="🇬🇧 Mis horas de inglés" lado={<b>{num(r.horas)} / {r.meta} h</b>}>
      <Avance parte={r.fraccion} />
      <Nota>{num(r.semanaHoras)} h en los últimos 7 días. Suma lo que hagas fuera de las lecciones: escuchar, hablar, leer.</Nota>
      <Botones>{[15, 30, 60, 90].map((m) => <Button key={m} color="secondary" data-accion="ing-sumar" data-m={m}>+{m} min</Button>)}</Botones>
      <Campo etiqueta="Mi meta (horas)" type="number" inputMode="numeric" min={1} data-cambio="ing-meta" defaultValue={r.meta} />
      {r.tocaPrueba ? (
        <Desplegable abiertoAlInicio titulo="📝 Prueba del mes" sx={{ mt: '10px' }}>
          <Box data-prueba-ingles="" sx={{ display: 'grid', gap: '10px' }}>
            <Nota sx={{ m: 0 }}>Graba 2 minutos hablando sin parar y mira 5 minutos de una serie sin subtítulos. Califícate de 1 (casi nada) a 5 (fluido).</Nota>
            <Box sx={DOS} data-prueba="">{nivel('escucha', 'Escucha')}{nivel('habla', 'Habla')}</Box>
            <Button fullWidth data-accion="ing-prueba">Guardar prueba</Button>
          </Box>
        </Desplegable>
      ) : <Nota>Última prueba, {fechaCorta(r.ultima.fecha)}: escucha {r.ultima.escucha}/5, habla {r.ultima.habla}/5. La próxima, a los 30 días.</Nota>}
      {i.pruebas.length > 1 ? (
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: '8px 0 0', display: 'grid', gap: '4px' }}>
          {[...i.pruebas].reverse().map((p: Fin, k: number) => <Box component="li" key={k} sx={{ ...FILA, p: '6px 0', borderBottom: '1px solid', borderColor: 'divider' }}><span>{fechaCorta(p.fecha)}</span><span>Escucha {p.escucha} · Habla {p.habla}</span></Box>)}
        </Box>
      ) : null}
    </TarjetaPlegable>
  );
}

function vistaCurso(e: Fin, ver: Fin) {
  const c = S.C(), a = area(c.area) as Fin, p = S.P(), n = hechas(c, p) as number, total = lecciones(c).length;
  const tabs: [string, string][] = [['hoy', '📖 Hoy'], ['lecciones', '📚 ' + total + ' lecciones'], ['mapa', '🗺️ Mapa'], ['proyecto', '🎯 Proyecto'], ['fuentes', '📎 Fuentes']];
  const t = ver.pestana;
  return (
    <>
      <Volver datos={{ 'data-accion': 'estudio-area', 'data-a': a.id }}>← {a.icono} {a.nombre}</Volver>
      <TituloPantalla>{c.icono} {c.nombre}</TituloPantalla>
      <Bajada>{c.nivel} · {c.paraQue}</Bajada>
      <Tarjeta>
        <Box sx={{ ...FILA, mb: '6px' }}><b>📖 {n} de {total} lecciones</b><span>🔥 {rachaEstudio(e.estudio.dias)} días</span></Box>
        <Avance parte={n / total} />
      </Tarjeta>
      {c.id === 'ingles-b2' ? tarjetaIngles() : null}
      <Box role="group" aria-label="Pestañas del curso" sx={{ display: 'flex', gap: '8px', p: '2px 0 12px', overflowX: 'auto', scrollbarWidth: 'none', flexWrap: { md: 'wrap' } }}>
        {tabs.map(([k, txt]) => <Chip key={k} clickable data-accion="estudio-pestana" data-p={k} aria-pressed={t === k} color={t === k ? 'primary' : 'default'} variant={t === k ? 'filled' : 'outlined'} label={txt} sx={{ flex: 'none', fontSize: 15 }} />)}
      </Box>
      {t === 'lecciones' ? pestanaLecciones() : t === 'mapa' ? pestanaMapa(e, ver) : t === 'proyecto' ? pestanaProyecto() : t === 'fuentes' ? pestanaFuentes() : pestanaHoy(ver)}
    </>
  );
}

// ---------- Repaso de tarjetas ----------
function vistaRepaso(e: Fin, repaso: Fin) {
  const id = repaso.ids[repaso.i];
  if (!id) return (
    <TarjetaPlegable vista={VISTA} clave="✅ Repaso terminado" titulo="✅ Repaso terminado">
      <Parrafo>{repaso.bien} de {repaso.ids.length} las sabías. Las que fallaste vuelven mañana; las demás, más adelante.</Parrafo>
      <Button fullWidth data-accion="estudio-fin-repaso" sx={Grande}>Seguir con el plan →</Button>
    </TarjetaPlegable>
  );
  const t = tarjeta(CURSOS, id) as Fin, x = e.estudio.tarjetas[id], I = INTERVALOS as number[];
  return (
    <>
      <Volver datos={{ 'data-accion': 'estudio-fin-repaso' }}>← Salir del repaso</Volver>
      <TituloPantalla>🔁 Repaso</TituloPantalla>
      <Bajada>Tarjeta {repaso.i + 1} de {repaso.ids.length} · {t.curso.icono} {t.curso.nombre}, lección {t.leccion.n}</Bajada>
      <Avance parte={repaso.i / repaso.ids.length} />
      <Tarjeta sx={{ display: 'grid', gap: '12px', mt: '14px' }}>
        <Box component="p" sx={{ fontSize: 20, fontWeight: 700, m: '6px 0', lineHeight: 1.4 }}>{t.frente}</Box>
        {repaso.volteada ? <>
          <Respuesta sx={{ fontSize: 17 }}>{t.reverso}</Respuesta>
          <Botones>
            <Button data-accion="estudio-responder" data-ok="" sx={{ ...Grande, bgcolor: tokens.rojoFondo, color: tokens.peligroInk, '&:hover': { bgcolor: tokens.rojoFondo } }}>✗ No la sabía</Button>
            <Button data-accion="estudio-responder" data-ok="1" sx={Grande}>✓ La sabía</Button>
          </Botones>
          <Nota sx={{ m: 0 }}>Si la sabes vuelve en {x.paso + 1 >= I.length ? '… ¡queda dominada!' : I[x.paso + 1] + ' días'}; si no, mañana.</Nota>
        </> : <>
          <Nota sx={{ m: 0 }}>Respóndela en tu cabeza o en voz alta antes de voltearla.</Nota>
          <Button fullWidth data-accion="estudio-voltear" sx={Grande}>Ver respuesta</Button>
        </>}
      </Tarjeta>
    </>
  );
}

export default function Estudiar({ pestana }: { pestana?: string }) {
  // "#estudiar/aprender" abre el área; "#estudiar/aprender-a-aprender" el curso (una sola vez, al abrir)
  useState(() => { if (pestana) S.abrir(pestana); return 0; });
  const e = usarEstado() as Fin, ver = S.ver();
  if (ver.repaso) return vistaRepaso(e, ver.repaso);
  const c = ver.cursoAbierto && S.C();
  if (c && ve('curso', ver.cursoAbierto) && S.veArea(area(c.area))) return vistaCurso(e, ver);
  if (ver.areaAbierta && area(ver.areaAbierta) && S.veArea(area(ver.areaAbierta))) return vistaArea(e, ver.areaAbierta);
  return inicio(e);
}
