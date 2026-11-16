// Tarjetas del tablero de 🏠 Hoy que vienen de otras secciones: experimento, reto, entrenador (con el próximo entreno),
// foco de la semana, estudio de hoy, sueño y peso, el partido, mis estándares, la plata del mes, el cierre de la noche y la
// semana del gym. React pinta; las reglas son las de siempre (exp-…, reto-…, sueno…, partido…, estandar…, check-…).
// Progreso usa también el bloque del reto activo.
import type { ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Chip, Link } from '@mui/material';
import { hayFutbol, prioridadesDe, semanaActual } from '../../estado.js';
import { iso, sumarDias, fechaCorta, semanaDe, diaSemana } from '../../fechas.js';
import { horasSueno, promedioSueno, MOLESTIAS, hayPartido, semanaObjetivo, focoDe, horaCama, minutosTarde } from '../../registro.js';
import { rango } from '../../progreso.js';
import { ZONAS, zonasDeMolestias } from '../../banco.js';
import { experimentoActivo, estadoExperimento } from '../../mejora.js';
import { RETOS, retoPorId, retoActivo, cuantosHechos, estadoRacha } from '../../retos.js';
import { disposicion, unicoMejorar, textoCarga } from '../../entrenador.js';
import { resumenSemana, metaSesion, ultimoRegistro, varianteActual, nombreConVariante } from '../../gym.js';
import { deseosDelMes, pesos } from '../../finanzas.js';
import { cumplimientoEstandares, IDEAS_POR_TEMA } from '../../vida.js';
import { editandoLosEstandares } from '../../vistas/vida.js';
import { cierreDeHoy, piezasSesiones } from '../../vistas/sesiones.js';
import { piezasEstudio, librosVisibles } from '../../vistas/estudiar.js';
import { curso } from '../../cursos/index.js';
import { leccion } from '../../estudio.js';
import { lecturaQueToca } from '../../biblioteca.js';
import { rachaEstudio } from '../../estudio.js';
import { tokens } from '../tema';
import { Campo, CampoLargo, CampoSolo, DOS } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import { Avance, Opciones } from '../ui/Varios';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Paso, Pasos } from '../ui/Lectura';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const DIAS_CORTOS = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const f1 = (n: number) => String(n).replace('.', ',');
// Con título, la tarjeta se pliega tocándolo y se recuerda en este equipo (las mismas claves de la pantalla de antes)
export const Tarjeta = ({ children, sx, datos, titulo, lado }: { children: ReactNode; sx?: object; datos?: Record<string, string>; titulo?: string; lado?: ReactNode }) => (titulo
  ? <TarjetaPlegable vista="hoy" clave={titulo} titulo={titulo} lado={lado} sx={sx}><Box {...datos} sx={{ display: 'grid', gap: '8px', '& p': { m: 0 } }}>{children}</Box></TarjetaPlegable>
  : <Card component="section" {...datos} sx={{ mb: '14px', display: 'grid', gap: '8px', '& p': { m: 0 }, ...sx }}>{children}</Card>);
export const H2 = ({ children }: { children: ReactNode }) => <Box component="h2" sx={{ m: 0, fontSize: 17, fontWeight: 700 }}>{children}</Box>;
export const Aviso = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14 }}>{children}</Box>;
const Titulo = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ fontSize: 17, fontWeight: 700, '& small': { fontSize: 14, fontWeight: 400 } }}>{children}</Box>;
const Suave = ({ datos, children }: { datos: Record<string, string>; children: ReactNode }) => (
  <Button variant="text" {...datos} sx={{ justifySelf: 'start', minHeight: 44, p: '8px 6px', color: 'text.secondary', fontWeight: 400, fontSize: 14, '&:hover': { bgcolor: tokens.surface2, color: 'text.primary' } }}>{children}</Button>
);
// Un enlace con forma de tarjeta (avisos, foco y estudio de hoy)
export const TarjetaEnlace = ({ href, children, dorada = false, tip }: { href: string; children: ReactNode; dorada?: boolean; tip?: string }) => (
  <Card component="a" href={href} data-tip={tip} sx={{ display: 'grid', gap: '4px', mb: '14px', textDecoration: 'none', color: 'text.primary', '& span': { color: 'text.secondary', fontSize: 14 }, ...(dorada ? { borderColor: tokens.dorado, bgcolor: tokens.amarilloFondo } : null) }}>{children}</Card>
);
// Una escala de 1 a n (sueño, esfuerzo, energía): la elegida en verde; tocarla otra vez la quita
const Escala = ({ n, valor, accion, datos, etiqueta }: { n: number; valor: Fin; accion: string; datos: Record<string, string>; etiqueta: string }) => (
  <Opciones nombre={etiqueta} activa={valor != null ? String(valor) : null} opciones={Array.from({ length: n }, (_, i) => [String(i + 1), String(i + 1)] as [string, string])} datos={(v) => ({ 'data-accion': accion, ...datos, 'data-v': v })} envolver sx={{ pb: '4px' }} />
);
const ICONO_SESION: Record<string, string> = { checklist: '✅', calentamiento: '🔥', estiramiento: '🧘', fortalecimiento: '🦵', mente: '🧠' };
export function BotonSesion({ e, id, primario = false, texto = '' }: { e: Fin; id: string; primario?: boolean; texto?: string }) {
  const s = (e.sesiones as Fin[]).find((x) => x.id === id);
  if (!s) return null;
  return <Button color={primario ? 'primary' : 'secondary'} data-accion="sesion" data-sesion={s.id} sx={{ minHeight: 56, fontSize: 17 }}>{(ICONO_SESION[s.tipo] || '▶') + ' ' + (texto || s.nombre)}</Button>;
}
export const Botones = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' }}>{children}</Box>;

// ---------- 🧪 Experimento de la semana ----------
export function Experimento({ hoy = iso() }: { hoy?: string }) {
  const x = experimentoActivo() as Fin;
  if (!x) return (
    <Tarjeta titulo="🧪 Experimento de la semana" datos={{ 'data-experimento': '' }}>
      <Nota sx={{ m: 0 }}>Un solo cambio pequeño, 7 días. Al final decides si se queda.</Nota>
      <Campo etiqueta="¿Qué vas a probar?" name="cambio" placeholder="Ej.: acostarme 30 minutos antes" />
      <Campo etiqueta="¿Cómo sabrás si funcionó?" name="medida" placeholder="Ej.: dormir 7 horas o más" />
      <Button fullWidth data-accion="exp-empezar">Empezar hoy</Button>
    </Tarjeta>
  );
  const s = estadoExperimento(x, hoy) as Fin;
  return (
    <Tarjeta titulo={'🧪 ' + x.cambio}>
      {x.medida ? <Nota sx={{ m: 0 }}>Lo mido con: {x.medida}</Nota> : null}
      {s.termino ? <>
        <Titulo>Lo cumpliste {s.cumplidos} de 7 días</Titulo>
        <Nota sx={{ m: 0 }}>¿Te sirvió?</Nota>
        <Botones><Button data-accion="exp-decidir" data-v="conservar">✅ Lo conservo</Button><Button color="secondary" data-accion="exp-decidir" data-v="descartar">❌ Lo descarto</Button></Botones>
      </> : <>
        <Titulo>Día {s.dia} de 7 <small>· {s.cumplidos} cumplidos</small></Titulo>
        <Avance parte={s.dia / 7} />
        <Button fullWidth color={s.hoyListo ? 'secondary' : 'primary'} data-accion="exp-hoy">{s.hoyListo ? '↩ Hoy no lo cumplí' : '✓ Hoy lo cumplí'}</Button>
        <Suave datos={{ 'data-accion': 'exp-cancelar' }}>Dejar este experimento</Suave>
      </>}
    </Tarjeta>
  );
}

// ---------- 🔥 Retos ----------
export function BloqueReto({ x, hoy = iso() }: { x: Fin; hoy?: string }) {
  const reto = retoPorId(x.reto) as Fin, s = estadoRacha(x, hoy) as Fin;
  if (!reto) return null;
  return (
    <Box sx={{ display: 'grid', gap: '8px', '& p': { m: 0 } }}>
      <Titulo>🔥 {reto.texto}</Titulo>
      <Nota sx={{ m: 0 }}>{s.rota ? 'Se rompió la racha: vuelve a empezar desde hoy.' : 'Día ' + s.racha + ' de ' + s.meta + (s.hoyListo ? ' · hoy ya cuenta' : ' · falta hoy')}</Nota>
      <Avance parte={s.fraccion} />
      <Button fullWidth color={s.hoyListo ? 'secondary' : 'primary'} data-accion="reto-hoy">{s.hoyListo ? '↩ Hoy no lo cumplí' : '✓ Hoy lo cumplí'}</Button>
      <Suave datos={{ 'data-accion': 'reto-dejar' }}>Dejar este reto</Suave>
    </Box>
  );
}
export function RetoHoy() {
  const x = retoActivo() as Fin;
  if (x) return <Tarjeta titulo="🔥 Reto activo"><BloqueReto x={x} /></Tarjeta>;
  return (
    <Tarjeta titulo="🔥 Retos">
      <Nota sx={{ m: 0 }}>Llevas {cuantosHechos()} de {(RETOS as Fin[]).length}. No se trata de tachar los 28: termina los 3 o 4 que más miedo te den.</Nota>
      <Button fullWidth color="secondary" href="#progreso">Elegir un reto →</Button>
    </Tarjeta>
  );
}

// ---------- 🧑‍🏫 Tu entrenador hoy ----------
export function ProximoEntreno({ e, max = Infinity }: { e: Fin; max?: number }) {
  const hoy = iso();
  for (let k = 0; k < 7; k++) {
    const f = sumarDias(hoy, k) as string, d = (e.rutina as Fin[]).find((x) => x.id !== 'core' && x.diaSemana === diaSemana(f));
    if (!d) continue;
    const sem = semanaActual() + (k && diaSemana(f) < diaSemana(hoy) ? 1 : 0);
    const metas = (d.ejercicios as Fin[]).map((ej) => ({ ej, m: metaSesion(ej.filas[0], (ultimoRegistro as Fin)(e.semanas, ej.filas[0], sem, { ej, v: varianteActual(ej) }, e.rutina)) as Fin })).filter((x) => x.m);
    if (!metas.length) return null;
    return (
      <>
        <Box component="h3" sx={{ m: '10px 0 6px', fontSize: 16 }}>🎯 Tu próximo entreno: {d.nombre} <Box component="small" sx={{ fontWeight: 400, color: 'text.secondary' }}>{k === 0 ? 'hoy' : k === 1 ? 'mañana' : DIAS_CORTOS[d.diaSemana].toLowerCase()}</Box></Box>
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '8px' }}>
          {metas.slice(0, max).map(({ ej, m }) => (
            <Box component="li" key={ej.id} sx={FILA}>
              <Box component="span" sx={{ display: 'grid', minWidth: 0 }}>{nombreConVariante(ej, varianteActual(ej))}<Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{m.motivo}</Box></Box>
              <Box component="b" sx={{ whiteSpace: 'nowrap', color: m.sube ? 'info.main' : undefined }}>{m.texto}{m.sube ? ' ⬆' : ''}</Box>
            </Box>
          ))}
        </Box>
        {metas.length > max ? <Button variant="text" data-accion="ir-dia" data-dia={d.id} sx={{ minHeight: 32, p: 0, color: 'info.main', fontWeight: 400, textDecoration: 'underline', justifySelf: 'start' }}>Ver las {metas.length} metas en el Gym →</Button> : null}
      </>
    );
  }
  return null;
}
const BORDE_ENTRENADOR: Record<string, string> = { verde: tokens.verde, amarillo: tokens.amarillo, rojo: tokens.rojo };
export function Entrenador({ e }: { e: Fin }) {
  if (!(e.rutina as Fin[]).some((x) => x.id !== 'core' && x.ejercicios.length)) {
    return (
      <Tarjeta titulo="🧑‍🏫 Tu entrenador hoy">
        <Nota sx={{ m: 0 }}>Cuando tengas tu rutina, aquí te digo cada día si subir el peso, mantener o bajar la carga, según cómo dormiste, el fútbol y tus molestias.</Nota>
        <Box component="a" href="#editar/rutina" sx={{ color: 'primary.main', fontWeight: 700 }}>Armar mi rutina →</Box>
      </Tarjeta>
    );
  }
  const d = disposicion() as Fin, u = unicoMejorar() as Fin, carga = d.carga && d.carga.ratio != null && d.carga.estado !== 'ok' ? textoCarga(d.carga) : '';
  return (
    <Tarjeta titulo="🧑‍🏫 Tu entrenador hoy" sx={{ borderColor: BORDE_ENTRENADOR[d.nivel] }}>
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start', '& small': { color: 'text.secondary', fontSize: 13 } }}>
        <Box component="span" aria-hidden="true" sx={{ fontSize: 34, lineHeight: 1 }}>{d.icono}</Box>
        <div><Box component="b" sx={{ fontSize: 20 }}>{d.titulo}</Box><Box component="p" sx={{ m: '4px 0' }}>{d.consejo}</Box>
          {d.razones.length ? <small>{(d.razones as string[]).join(' · ')}</small> : <small>{d.sinSueno ? 'Sin datos de sueño' : 'Sueño bien'}, sin partido ayer y sin molestias.</small>}</div>
      </Box>
      {d.sinSueno ? <Nota sx={{ m: 0 }}>Anota cómo dormiste en 🌙 Sueño y peso para que esto sea más preciso.</Nota> : null}
      {carga ? <Aviso>⚽ {carga}</Aviso> : null}
      <Box component="a" href={u.ir} sx={{ display: 'grid', gap: '2px', p: '10px 12px', borderRadius: '12px', bgcolor: tokens.brandSoft, color: 'text.primary', textDecoration: 'none', '& small': { color: 'text.secondary', fontSize: 13 } }}>
        <small>Lo único que mejorar hoy</small><span>{u.icono} {u.texto}</span>
      </Box>
      <ProximoEntreno e={e} max={4} />
    </Tarjeta>
  );
}

// ---------- 🗓️ Foco de la semana ----------
export function Foco({ e, hoy = iso() }: { e: Fin; hoy?: string }) {
  const foco = focoDe(e, semanaDe(hoy)) as Fin, objetivo = semanaObjetivo(hoy), finde = objetivo > semanaDe(hoy), cerrada = focoDe(e, objetivo) as Fin;
  const recordar = finde && !(cerrada && cerrada.foco)
    ? <TarjetaEnlace href="#progreso" dorada><b>📝 Cierra tu semana</b><span>Revisa qué funcionó y elige el foco de la próxima (5 minutos).</span></TarjetaEnlace> : null;
  if (!foco || !foco.foco) return recordar;
  return (
    <>
      <Card component="a" href="#progreso" sx={{ display: 'grid', gap: '2px', mb: '14px', textDecoration: 'none', color: 'text.primary', borderColor: 'primary.main', '& small': { color: 'text.secondary' }, '& b': { fontSize: 18 } }}>
        <small>🎯 Foco de la semana{foco.ley ? ' · ⚖️ ' + foco.ley : ''}</small><b>{foco.foco}</b>
      </Card>
      {recordar}
    </>
  );
}

// ---------- 🎓 Estudio de hoy ----------
export function EstudioHoy({ e }: { e: Fin }) {
  const S = piezasEstudio as Fin, p = S.plan() as Fin, r = rachaEstudio(e.estudio.dias) as number, minutos = e.config.estudio.minutos;
  const nombre = (s: Fin) => { const c = curso(s.curso) as Fin, l = leccion(c, s.n) as Fin; return c.icono + ' ' + c.nombre + ' · lección ' + s.n + ': ' + l.titulo; };
  const libros = (librosVisibles() as Fin[]).filter((l) => e.libros[l.id] && lecturaQueToca(l, e.libros[l.id]));
  const lineas: string[] = [];
  if (p.repasos) lineas.push('🔁 ' + p.repasos + (p.repasos === 1 ? ' tarjeta' : ' tarjetas') + ' para repasar');
  for (const s of p.lecciones as Fin[]) lineas.push('📖 ' + nombre(s) + ' · ' + s.minutos + ' min');
  for (const l of libros) { const n = lecturaQueToca(l, e.libros[l.id]) as number; lineas.push(l.icono + ' ' + l.titulo + ': ' + l.unidad.toLowerCase() + ' ' + n + ', ' + l.lecturas[n - 1].titulo); }
  if (!lineas.length && !S.cursosVisibles().length) return null;
  return (
    <TarjetaEnlace href="#estudiar" dorada>
      <b>🎓 Estudio de hoy · {minutos} min{r ? ' · 🔥 ' + r : ''}</b>
      {lineas.length ? lineas.map((x, i) => <span key={i}>{x}</span>) : <span>✅ Listo por hoy. Mañana vuelven tus tarjetas.</span>}
    </TarjetaEnlace>
  );
}

// ---------- 🌙 Sueño y ⚖️ peso ----------
export function SuenoPeso({ e, fecha = iso() }: { e: Fin; fecha?: string }) {
  const d = e.dias[fecha] || {}, s = d.sueno || {}, h = horasSueno(s) as number | null, prom = promedioSueno(e.dias, rango(7, fecha)) as Fin;
  const ultimoPeso = Object.keys(e.dias).sort().reverse().map((f) => e.dias[f].peso).find((p) => p > 0);
  return (
    <Tarjeta titulo="🌙 Sueño y ⚖️ peso" lado={prom ? <Nota sx={{ m: 0 }}><span title="Promedio de las últimas noches anotadas">7 días: <b>{f1(prom.horas)} h</b></span></Nota> : null}>
      <Box sx={DOS}>
        <Campo etiqueta="Me acosté" type="time" data-cambio="sueno" data-f={fecha} data-k="acoste" defaultValue={s.acoste || ''} />
        <Campo etiqueta="Me levanté" type="time" data-cambio="sueno" data-f={fecha} data-k="levante" defaultValue={s.levante || ''} />
      </Box>
      {h != null ? (h < 7 ? <Aviso>Dormiste <b>{f1(h)} h</b>. Menos de 7 h frena la recuperación y la fuerza: hoy acuéstate más temprano.</Aviso> : <Nota sx={{ m: 0 }}>Dormiste <b>{f1(h)} h</b>. ¡Bien!</Nota>) : null}
      <Nota sx={{ m: 0 }}>¿Cómo dormiste? (1 = muy mal · 5 = excelente)</Nota>
      <Escala n={5} valor={s.calidad} accion="sueno-calidad" datos={{ 'data-f': fecha }} etiqueta="Calidad del sueño" />
      <Campo etiqueta="Peso en ayunas (kg)" inputMode="decimal" min={0} step="0.1" data-cambio="dieta-peso" defaultValue={d.peso || ''} placeholder={String(ultimoPeso || '')} />
      <Link href="#dieta/peso" sx={{ fontSize: 14, color: 'text.secondary' }}>Ver la tendencia del peso →</Link>
    </Tarjeta>
  );
}

// ---------- ⚽ ¿Cómo te fue? (el día del partido y, si no se anotó, al día siguiente) ----------
export function Partido({ e, fecha }: { e: Fin; fecha: string }) {
  const p = (e.dias[fecha] || {}).partido || {}, hecho = hayPartido(p), datos = { 'data-f': fecha };
  return (
    <Tarjeta titulo={'⚽ ¿Cómo te fue' + (fecha === iso() ? ' hoy' : ' ayer') + '?'} sx={hecho ? { borderColor: 'primary.main' } : undefined} lado={hecho ? <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, bgcolor: tokens.brandSoft, color: tokens.brand }}>✓ Anotado</Box> : null}>
      {fecha === iso() && !hecho ? <Nota sx={{ m: 0 }}>Anótalo después del partido (o mañana). Con esto se ve si la pierna te deja cansado para jugar.</Nota> : null}
      <Campo etiqueta="Minutos jugados" type="number" inputMode="numeric" min={0} max={200} data-cambio="partido" data-f={fecha} data-k="minutos" defaultValue={p.minutos || ''} placeholder="Ej.: 70" />
      <Nota sx={{ m: 0 }}>Esfuerzo (1 = suave · 10 = al máximo)</Nota>
      <Escala n={10} valor={p.rpe} accion="partido-punto" datos={{ ...datos, 'data-k': 'rpe' }} etiqueta="Esfuerzo del partido" />
      <Nota sx={{ m: 0 }}>Energía de las piernas (1 = sin piernas · 5 = volando)</Nota>
      <Escala n={5} valor={p.energia} accion="partido-punto" datos={{ ...datos, 'data-k': 'energia' }} etiqueta="Energía" />
      <Nota sx={{ m: 0 }}>Molestias</Nota>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {(MOLESTIAS as string[]).map((m) => { const activo = (p.molestias || []).includes(m); return <Chip key={m} clickable data-accion="partido-molestia" data-f={fecha} data-m={m} aria-pressed={activo} color={activo ? 'primary' : 'default'} variant={activo ? 'filled' : 'outlined'} label={m} />; })}
      </Box>
      <Campo etiqueta="Nota" data-cambio="partido" data-f={fecha} data-k="nota" defaultValue={p.nota || ''} placeholder="Ej.: gol, cancha mojada, me faltó aire…" />
      {(p.molestias || []).length ? <Aviso>Con molestias: hoy haz ejercicios suaves de {(zonasDeMolestias(p.molestias) as string[]).map((z, i) => <span key={z}>{i ? ' · ' : ''}<Link href={'#sesiones/banco-' + z}>{(ZONAS as Record<string, string>)[z]}</Link></span>)} o estira suave, y si el dolor sigue en 2-3 días o es punzante, consulta a un fisioterapeuta.</Aviso> : null}
      {hecho ? null : <Button variant="text" data-accion="futbol-pausar" sx={{ justifySelf: 'start', minHeight: 32, p: 0, color: 'info.main', fontWeight: 400, textDecoration: 'underline' }}>⏸ No estoy jugando por estos días</Button>}
    </Tarjeta>
  );
}

// ---------- 🧭 Mis estándares ----------
export function Estandares({ e, fecha = iso() }: { e: Fin; fecha?: string }) {
  const lista = (e.estandares ||= []) as Fin[], hechos = ((e.dias[fecha] || {}).estandares) || {}, perfil = (e.libros.fenix && e.libros.fenix.perfil) || {};
  const semana = cumplimientoEstandares(e, rango(7, fecha)) as Fin, n = lista.filter((s) => hechos[s.id]).length, editando = editandoLosEstandares() || !lista.length;
  const libre = (t: string) => !lista.some((s) => s.texto === t);
  return (
    <Tarjeta titulo="🧭 Mis estándares" lado={lista.length ? <b>{n}/{lista.length}</b> : null}>
      {perfil.proposito ? <Box component="p" sx={{ fontSize: 17, fontWeight: 600, borderLeft: '3px solid', borderColor: 'primary.main', pl: '10px' }}>{perfil.proposito}</Box>
        : <Nota sx={{ m: 0 }}><Link href="#libros/fenix">Escribe tu propósito</Link> en Libros → Fénix → Herramientas → Mi perfil Fénix, y aparecerá aquí.</Nota>}
      {lista.length ? <>
        <Nota sx={{ m: 0 }}>Lo que no negocias. Márcalos en la noche.</Nota>
        <Pasos>{lista.map((s) => <Paso key={s.id} hecho={!!hechos[s.id]} datos={{ 'data-accion': 'estandar', 'data-id': s.id, 'data-f': fecha }}>{s.texto}</Paso>)}</Pasos>
        {semana && semana.dias ? <><Box sx={{ ...FILA, color: 'text.secondary', fontSize: 14 }}><span>Últimos 7 días</span><b>{Math.round(semana.fraccion * 100)} %</b></Box><Avance parte={semana.fraccion} /></> : null}
      </> : <Nota sx={{ m: 0 }}>Elige 3 a 5 reglas que cumples pase lo que pase. Toca una idea o escribe la tuya.</Nota>}
      {editando ? <>
        {lista.length ? (
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '4px' }}>
            {lista.map((s) => <Box component="li" key={s.id} sx={{ ...FILA, p: '6px 0', borderBottom: '1px solid', borderColor: 'divider' }}><span>{s.texto}</span><Button variant="text" data-accion="estandar-quitar" data-id={s.id} aria-label="Quitar" sx={{ minWidth: 44, color: 'text.primary' }}>✕</Button></Box>)}
          </Box>
        ) : null}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
          <CampoSolo id="estandar-nuevo" placeholder="Mi regla: …" aria-label="Nuevo estándar" />
          <Button data-accion="estandar-agregar">＋</Button>
        </Box>
        {Object.entries(IDEAS_POR_TEMA as Record<string, string[]>).filter(([, ts]) => ts.some(libre)).map(([tema, ts]) => (
          <div key={tema}>
            <Box component="h3" sx={{ fontSize: 13, color: 'text.secondary', m: '12px 0 6px', fontWeight: 600 }}>{tema}</Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>{ts.filter(libre).map((t) => <Chip key={t} clickable size="small" variant="outlined" data-accion="estandar-agregar" data-t={t} label={t} sx={{ height: 'auto', minHeight: 36, '& .MuiChip-label': { whiteSpace: 'normal', py: '4px' } }} />)}</Box>
          </div>
        ))}
        {lista.length ? <Button fullWidth color="secondary" data-accion="estandares-editar">✓ Listo</Button> : null}
      </> : <Button fullWidth color="secondary" data-accion="estandares-editar">✏️ Editar estándares</Button>}
    </Tarjeta>
  );
}

// ---------- 💰 Plata del mes ----------
export function PlataHoy({ e }: { e: Fin }) {
  if (!e.finanzas) return null;
  const d = deseosDelMes(e.finanzas) as Fin;
  return (
    <Tarjeta titulo="💰 Plata del mes" lado={<Link href="#finanzas/registrar" sx={{ fontSize: 14, color: 'text.secondary' }}>＋ Gasto</Link>}>
      {d ? <>
        {d.quedan >= 0
          ? <p>Te quedan <Box component="b" sx={{ color: 'success.main' }}>{pesos(d.quedan)}</Box> para deseos este mes: unos <b>{pesos(d.porDia)} por día</b> ({d.dias}{d.dias === 1 ? ' día' : ' días'}).</p>
          : <p>Te pasaste <Box component="b" sx={{ color: 'error.main' }}>{pesos(-d.quedan)}</Box> en deseos este mes. Lo que queda, solo necesidades.</p>}
        <Avance parte={d.gastado / d.tope} rojo={d.quedan < 0} />
        <Nota sx={{ m: 0 }}>{pesos(d.gastado)} de {pesos(d.tope)}{d.presupuestado ? ' presupuestados' : ' (30 % de lo que entra)'}</Nota>
      </> : <Nota sx={{ m: 0 }}><Link href="#finanzas/fijos">Agrega tu salario</Link> o registra un ingreso y aquí verás cuánto te queda para deseos.</Nota>}
    </Tarjeta>
  );
}

// ---------- 🌙 Cierre de la noche (desde las 7 p. m.) ----------
export function CierreHoy({ e, ahora = new Date() }: { e: Fin; ahora?: Date }) {
  const s = cierreDeHoy(ahora) as Fin;
  if (!s) return null;
  const S = piezasSesiones as Fin, marcas = S.marcasDe(s.id), a = S.avanceChecklist(s, marcas) as Fin, hoy = iso(ahora);
  const cama = horaCama(e.config) as string, acoste = ((e.dias[hoy] || {}).sueno || {}).acoste, tarde = minutosTarde(acoste, cama) as number, manana = sumarDias(hoy, 1) as string;
  return (
    <Tarjeta>
      <Box sx={FILA}><b>🌙 {s.nombre}</b><Box component="span" sx={a.completa ? { color: 'success.main' } : null}>{a.completa ? '✓ Lista' : a.hechos + ' / ' + a.total + ' hoy'}</Box></Box>
      <Avance parte={a.total ? a.hechos / a.total : 0} />
      <Box sx={{ display: 'grid', gap: '8px' }}>
        <Box component="p" sx={{ fontSize: 16 }}>🛏️ A la cama a las <b>{cama}</b>{acoste ? <Box component="small" sx={{ color: 'text.secondary' }}> · anoche {acoste}{tarde > 10 ? ', ' + tarde + ' min tarde' : ' ✓'}</Box> : null} <Link href="#ajustes" sx={{ fontSize: 14, color: 'text.secondary' }}>cambiar</Link></Box>
        {hayFutbol(hoy) ? <Aviso>⚽ Noche de partido: al llegar, ducha, cena de recuperación y cero pantallas. Mañana va la versión corta.</Aviso> : null}
        <CampoLargo etiqueta="🎯 Mis 3 prioridades de mañana" filas={3} data-cambio="prioridades" data-f={manana} placeholder={'1. …\n2. …\n3. …'} defaultValue={prioridadesDe(manana)} />
      </Box>
      {s.pasos.length ? (
        <Pasos>{(s.pasos as Fin[]).map((p, i) => { const id = S.idPaso(p, i); return <Paso key={id} hecho={!!marcas[id]} datos={{ 'data-accion': 'check-paso', 'data-sesion': s.id, 'data-paso': id }}>{p.nombre}{p.desc ? <Box component="small" sx={{ color: 'text.secondary', fontSize: 14 }}> · {p.desc}</Box> : null}</Paso>; })}</Pasos>
      ) : <Nota sx={{ m: 0 }}>Sin puntos todavía: agrégalos en ✏️ Editar → Sesiones.</Nota>}
      {a.hechos ? <Button fullWidth color="secondary" data-accion="check-limpiar" data-sesion={s.id}>↺ Desmarcar todo</Button> : null}
    </Tarjeta>
  );
}

// ---------- 📅 La semana del gym (los días con su avance; tocar uno abre ese día) ----------
export function SemanaGym({ e, sem = semanaActual() }: { e: Fin; sem?: number }) {
  const r = resumenSemana(e.rutina, e.semanas[sem] || {}, e.config.objetivos) as Fin;
  const pos = (id: string) => { const d = (e.rutina as Fin[]).find((x) => x.id === id); return id === 'core' ? 100 : (d && d.diaSemana) || 99; };
  r.dias.sort((a: Fin, b: Fin) => pos(a.id) - pos(b.id));
  const tip = (id: string) => { const d = (e.rutina as Fin[]).find((x) => x.id === id); return d && d.ejercicios.length ? d.nombre + '\n\n' + (d.ejercicios as Fin[]).map((ej) => '• ' + ej.nombre).join('\n') : undefined; };
  const MINI = { textAlign: 'left', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', borderRadius: '12px', p: '10px', color: 'text.primary', font: 'inherit', fontSize: 14, display: 'grid', gap: '4px', justifyContent: 'stretch', '& [role=progressbar]': { m: 0 } };
  return (
    <>
      <Box sx={{ ...FILA, mb: '6px' }}><b>Semana {sem}</b><span>{r.hechas} / {r.plan} series</span></Box>
      <Avance parte={r.plan ? r.hechas / r.plan : 0} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
        {(r.dias as Fin[]).map((d) => {
          const cuerpo = <><span>{DIAS_CORTOS[pos(d.id)] ? DIAS_CORTOS[pos(d.id)] + ' · ' : ''}{d.nombre}</span><b>{d.hechas}/{d.plan}</b><Avance parte={d.plan ? d.hechas / d.plan : 0} /></>;
          return d.id === 'core' ? <Box key={d.id} sx={MINI}>{cuerpo}</Box> : <ButtonBase key={d.id} data-accion="ir-dia" data-dia={d.id} data-tip={tip(d.id)} sx={MINI}>{cuerpo}</ButtonBase>;
        })}
      </Box>
    </>
  );
}
