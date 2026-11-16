// 📈 Progreso: los indicadores, ¿voy mejor que hace un mes?, la revisión y el cierre de la semana, qué te funciona, los
// experimentos y los retos, y el tablero de gráficos (constancia, puntaje, peso, sueño, partidos, gym, fuerza, cardio,
// metas y plata). React pinta; los gráficos los dibuja graficos.js como SVG (puente HtmlViejo, igual que en Finanzas) y
// las reglas son las de siempre (prog-dias, cierre, reto-…).
import type { ReactNode } from 'react';
import { Box, Chip, Link } from '@mui/material';
import { avanceMetas, racha, semanaActual } from '../../estado.js';
import { visibles, METAS } from '../../orden.js';
import { iso, sumarDias, fechaCorta, diaSemana, lunesDe, semanaDe } from '../../fechas.js';
import { resumenSemana } from '../../gym.js';
import { pesos as pesosCorporales, tendencia } from '../../dieta.js';
import { resumenMes, mesDe, sumarMeses, pesos } from '../../finanzas.js';
import { puntajeDia, rango, revisionSemanal } from '../../progreso.js';
import { barras, barrasAgrupadas, linea, calendario, barrasH, tablaDatos } from '../../graficos.js';
import { horasSueno, partidos, energiaSegunPierna, semanaObjetivo } from '../../registro.js';
import { comparativa, queFunciona, experimentos } from '../../mejora.js';
import { TEMAS_RETOS, RETOS, retoActivo, hechoDe, cuantosHechos, avisoFutbol } from '../../retos.js';
import { libro } from '../../libros/index.js';
import { piezasProgreso } from '../../vistas/progreso.js';
import { piezasGym } from '../../vistas/gym.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo, CampoLista } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';
import { Opciones, Avance, HtmlViejo } from '../ui/Varios';
import { Sub, Puntos } from '../ui/Lectura';
import { BloqueReto, Aviso } from './HoyTarjetas';
import { fuerza } from './Gym';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'progreso';
const R = piezasProgreso as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const LETRA = ['', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
const NOM = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const corta = (f: string) => String(fechaCorta(f)).split(' ')[0] + '/' + Number(f.slice(5, 7));
const kg = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const millones = (n: number) => (n >= 1e6 ? (Math.round(n / 1e5) / 10).toLocaleString('es-CO') + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'k' : String(Math.round(n)));
const G = (html: string) => <HtmlViejo html={html} />;
const Lista = ({ children }: { children: ReactNode }) => <Box component="ul" sx={{ listStyle: 'none', m: '8px 0', p: 0, display: 'grid', gap: '8px', '& > li': { display: 'grid', gap: '2px', p: '8px 12px', borderRadius: '12px', bgcolor: tokens.surface2 } }}>{children}</Box>;
// La tarjeta de un gráfico: el título se pliega y la › lleva a la sección de donde salen los datos
function Grafica({ titulo, ir, nota, children }: { titulo: string; ir?: string; nota?: ReactNode; children: ReactNode }) {
  return (
    <TarjetaPlegable vista={VISTA} clave={titulo} titulo={titulo} sx={{ m: { md: 0 } }}
      lado={ir ? <Link href={ir} aria-label={'Ir a ' + titulo} sx={{ color: 'primary.main', fontSize: 22, lineHeight: 1, textDecoration: 'none', px: '6px' }}>›</Link> : undefined}>
      {nota ? <Nota sx={{ mt: 0 }}>{nota}</Nota> : null}
      {children}
    </TarjetaPlegable>
  );
}
const IrA = ({ href, children }: { href: string; children: ReactNode }) => <Link href={href}>{children}</Link>;

// ---------- Indicadores ----------
function indicadores(e: Fin) {
  const hoy = puntajeDia() as Fin, semana = (rango(7) as string[]).map(puntajeDia).filter(Boolean) as Fin[], prom = semana.length ? Math.round(semana.reduce((s, p) => s + p.total, 0) / semana.length) : null;
  const lista = e.dieta ? pesosCorporales(e.dias) as Fin[] : [], peso = tendencia(lista) as number | null, previo = tendencia(lista.filter((x) => x.fecha <= sumarDias(iso(), -7))) as number | null;
  const gym = resumenSemana(e.rutina, e.semanas[semanaActual()] || {}) as Fin, mes = e.finanzas ? resumenMes(e.finanzas, mesDe(iso())) as Fin : null, r = racha() as number;
  const tiles: [string, ReactNode, string, string][] = [
    ['Puntaje de hoy', hoy ? hoy.total : '—', '/100', '#hoy'], ['Promedio 7 días', prom ?? '—', prom != null ? '/100' : '', '#hoy'],
    ['Racha mañana', r + ' 🔥', r === 1 ? 'día' : 'días', '#manana'],
    ['Peso (prom. 7 d)', peso ? kg(peso) + ' kg' : '—', peso && previo ? (peso <= previo ? '▼ ' : '▲ ') + kg(Math.abs(peso - previo)) + ' en la semana' : 'anota tu peso', '#dieta/peso'],
    ['Gym semana ' + semanaActual(), gym.hechas + '/' + gym.plan, Math.round((gym.hechas / gym.plan) * 100) + ' % de las series', '#gym/resumen'],
  ];
  if (mes) tiles.push(['Ahorro del mes', mes.tasaAhorro == null ? '—' : Math.round(mes.tasaAhorro * 100) + ' %', mes.ingresos ? 'de lo que entró' : 'registra ingresos', mes.ingresos ? '#finanzas/mes' : '#finanzas/registrar']);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', mb: '14px' }}>
      {tiles.map(([t, v, s, href]) => (
        <Box component="a" key={t} href={href} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: tokens.radio + 'px', p: '12px', display: 'grid', gap: '2px', textDecoration: 'none', color: 'text.primary', '&:hover, &:focus-visible': { borderColor: 'primary.main' } }}>
          <Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{t} <Box component="span" aria-hidden="true" sx={{ color: 'primary.main' }}>›</Box></Box>
          <Box component="b" sx={{ fontSize: 26, fontVariantNumeric: 'tabular-nums' }}>{v}</Box>
          {s ? <Box component="span" sx={{ color: 'text.secondary', fontSize: 13 }}>{s}</Box> : null}
        </Box>
      ))}
    </Box>
  );
}

// ---------- 📈 ¿Voy mejor que hace un mes? ----------
const valor = (x: Fin, n: number) => (x.unidad === '$' ? '$ ' + Math.round(n).toLocaleString('es-CO') : x.unidad === '%' ? Math.round(n) + ' %' : (Math.round(n * 10) / 10).toLocaleString('es-CO') + (x.unidad && x.unidad !== '/100' ? ' ' + x.unidad : ''));
const MARCA: Record<string, [string, string, string]> = { mejor: ['▲', 'Mejor', 'primary.main'], peor: ['▼', 'Bajó', 'warning.main'], igual: ['＝', 'Igual', 'text.secondary'] };
function mejora() {
  const filas = comparativa() as Fin[], con = filas.filter((x) => x.estado !== 'sin-datos'), faltan = filas.filter((x) => x.estado === 'sin-datos');
  return (
    <TarjetaPlegable vista={VISTA} clave="📈 ¿Voy mejor que hace un mes?" titulo="📈 ¿Voy mejor que hace un mes?">
      <Nota sx={{ mt: 0 }}>Últimos 7 días frente a las 4 semanas anteriores. Un día no dice nada; la tendencia, sí.</Nota>
      {con.length ? (
        <Box component="ul" sx={{ listStyle: 'none', m: '10px 0', p: 0, display: 'grid', gap: '6px', gridTemplateColumns: { md: '1fr 1fr' } }}>
          {con.map((x) => (
            <li key={x.nombre}>
              <Box component="a" href={x.ir} sx={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: 56, p: '8px 12px', borderRadius: '12px', bgcolor: tokens.surface2, color: 'text.primary', textDecoration: 'none', '& small': { color: 'text.secondary', fontSize: 13 } }}>
                <Box component="span" aria-hidden="true" sx={{ fontSize: 22 }}>{x.icono}</Box>
                <Box component="span" sx={{ flex: 1, minWidth: 0, display: 'grid' }}><b>{x.nombre}</b><small>Antes {valor(x, x.antes)}</small></Box>
                <Box component="span" sx={{ display: 'grid', textAlign: 'right' }}><b>{valor(x, x.ahora)}</b><Box component="small" sx={{ color: MARCA[x.estado][2] + ' !important', fontWeight: 800 }}>{MARCA[x.estado][0]} {MARCA[x.estado][1]}</Box></Box>
              </Box>
            </li>
          ))}
        </Box>
      ) : <Parrafo>Todavía no hay datos para comparar. Sigue anotando: con unas semanas aparece tu tendencia.</Parrafo>}
      {faltan.length && con.length ? <Nota>Aún sin datos para comparar: {faltan.map((x) => x.nombre).join(', ')}.</Nota> : null}
    </TarjetaPlegable>
  );
}

// ---------- 📝 Revisión y 🗓️ cierre de la semana ----------
function revision() {
  const filas = comparativa() as Fin[], mejor = filas.filter((x) => x.estado === 'mejor'), peor = filas.filter((x) => x.estado === 'peor');
  const pregunta = peor.length ? '¿Qué hizo más difícil «' + peor[0].nombre.toLowerCase() + '» y qué cambio pequeño lo arreglaría?' : mejor.length ? '¿Qué hiciste distinto en «' + mejor[0].nombre.toLowerCase() + '» y cómo lo repites la próxima semana?' : '';
  return (
    <TarjetaPlegable vista={VISTA} clave="📝 Revisión de la semana" titulo="📝 Revisión de la semana">
      {mejor.length || peor.length ? (
        <Box sx={{ display: 'grid', gap: '4px', mb: '10px', p: '10px 12px', borderRadius: '12px', bgcolor: tokens.surface2, '& p': { m: 0 } }}>
          {mejor.length ? <p>▲ <b>Mejoró:</b> {mejor.map((x) => x.nombre).join(', ')}</p> : null}
          {peor.length ? <p>▼ <b>Bajó:</b> {peor.map((x) => x.nombre).join(', ')}</p> : null}
          <Box component="p" sx={{ mt: '6px !important', fontWeight: 700 }}>🤔 {pregunta}</Box>
        </Box>
      ) : null}
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: '10px', '& li': { display: 'flex', gap: '10px', alignItems: 'flex-start', lineHeight: 1.4 } }}>
        {(revisionSemanal() as Fin[]).map((f, i) => {
          const cuerpo = <><Box component="span" sx={{ flex: 'none', fontSize: 18 }}>{f.icono}</Box><Box component="span" sx={{ flex: 1 }}>{f.texto}</Box>{f.ir ? <Box component="span" aria-hidden="true" sx={{ color: 'primary.main', fontSize: 20 }}>›</Box> : null}</>;
          return <li key={i}>{f.ir ? <Box component="a" href={f.ir} sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flex: 1, textDecoration: 'none', color: 'text.primary', p: '6px 8px', m: '-6px -8px', borderRadius: '10px', minHeight: 40, '&:hover': { bgcolor: tokens.surface2 } }}>{cuerpo}</Box> : cuerpo}</li>;
        })}
      </Box>
    </TarjetaPlegable>
  );
}
function cierreSemana(e: Fin, hoy = iso()) {
  const s = semanaObjetivo(hoy) as number, r = (e.revisiones || {})[s] || {}, lunes = lunesDe(s);
  const leyes = (() => { const l = libro('leyes') as Fin; return l ? (l.conceptos.lista as Fin[]).map((c) => c.nombre as string) : []; })();
  const anteriores = Object.entries(e.revisiones || {}).map(([n, x]) => [Number(n), x] as [number, Fin]).filter(([n, x]) => n !== s && x.foco).sort((a, b) => b[0] - a[0]).slice(0, 4);
  const campo = (k: string, etiqueta: string, ph: string) => <CampoLargo key={k + s} etiqueta={etiqueta} filas={2} data-cambio="cierre" data-s={s} data-k={k} placeholder={ph} defaultValue={r[k] || ''} />;
  return (
    <TarjetaPlegable vista={VISTA} clave="🗓️ Cierre de la semana" titulo="🗓️ Cierre de la semana">
      <Box sx={{ display: 'grid', gap: '10px' }}>
        <Nota sx={{ m: 0 }}>{s > semanaDe(hoy) ? 'Para la semana ' + s + ' (desde el ' + fechaCorta(lunes) + ').' : 'Semana ' + s + '. El sábado o el domingo se planea la siguiente.'} Mira la revisión de arriba y responde.</Nota>
        {campo('funciono', '✅ ¿Qué 20 % me dio el 80 % del avance?', 'Ej.: entrenar temprano, la comida preparada')}
        {campo('freno', '🧱 ¿Qué me frenó?', 'Ej.: me acosté tarde martes y jueves')}
        <CampoLista key={'ley' + s} etiqueta="⚖️ ¿Qué ley rompí o voy a trabajar?" data-cambio="cierre" data-s={s} data-k="ley" defaultValue={r.ley || ''} opciones={[['', 'Elige una ley…'], ...leyes.map((n) => [n, n] as [string, string])]} />
        {r.ley ? <Link href="#libros/leyes" sx={{ fontSize: 14, color: 'text.secondary' }}>Releer cómo usar esa ley →</Link> : null}
        <Campo key={'foco' + s} etiqueta="🎯 Mi foco de la semana (una sola cosa)" data-cambio="cierre" data-s={s} data-k="foco" defaultValue={r.foco || ''} placeholder="Ej.: dormir antes de las 11 de domingo a jueves" />
        {anteriores.length ? <><Sub>Focos anteriores</Sub><Puntos items={anteriores.map(([n, x]) => <>Semana {n}: {x.foco}{x.ley ? <> <small>({x.ley})</small></> : null}</>)} /></> : null}
      </Box>
    </TarjetaPlegable>
  );
}

// ---------- 🔬 Qué te funciona y 🧪 experimentos ----------
function queTeFunciona() {
  const { frases, dias } = queFunciona() as Fin;
  return (
    <TarjetaPlegable vista={VISTA} clave="🔬 Qué te funciona a ti" titulo="🔬 Qué te funciona a ti">
      {frases.length ? <>
        <Lista>{(frases as Fin[]).map(({ titulo, medida, r }) => <li key={titulo}><b>{titulo}</b><span>{Math.round(r.si)} % {medida} cuando sí ({r.nSi} días), frente a {Math.round(r.no)} % cuando no ({r.nNo} días).{r.nota ? '' : ' Casi sin diferencia.'}</span></li>)}</Lista>
        <Nota>Es una relación en tus datos, no prueba la causa. Úsala para decidir qué probar.</Nota>
      </> : <Nota sx={{ mt: 0 }}>Necesita al menos 5 días de cada lado (por ejemplo, 5 durmiendo bien y 5 no). Llevas {dias} {dias === 1 ? 'día anotado' : 'días anotados'}.</Nota>}
    </TarjetaPlegable>
  );
}
function experimentosAnteriores() {
  const hechos = (experimentos() as Fin[]).filter((x) => x.decision && x.decision !== 'cancelado').reverse();
  if (!hechos.length) return null;
  return (
    <TarjetaPlegable vista={VISTA} clave="🧪 Experimentos anteriores" titulo="🧪 Experimentos anteriores">
      <Lista>{hechos.map((x, i) => <li key={i}><b>{(x.decision === 'conservar' ? '✅ ' : '❌ ') + x.cambio}</b><span>{fechaCorta(x.inicio)} · cumplido {Object.keys(x.dias || {}).length} de 7 días</span></li>)}</Lista>
    </TarjetaPlegable>
  );
}

// ---------- 🔥 Retos ----------
const duracion = (x: Fin) => (x.tipo === 'racha' ? x.dias + ' días seguidos' : 'Una vez');
function filaReto(reto: Fin, activo: Fin, hoy: string) {
  const hecho = hechoDe(reto.id) as Fin, aviso = avisoFutbol(reto, undefined, hoy) as string, esActivo = activo && activo.reto === reto.id;
  const suave = { justifySelf: 'start', minHeight: 44, p: '8px 6px', color: 'text.secondary', fontWeight: 400, fontSize: 14 };
  const acciones = hecho ? <>
    <CampoLargo key={hecho.id} etiqueta="¿Cómo te fue?" filas={2} data-cambio="reto-nota" data-id={hecho.id} placeholder="Qué sentiste, qué aprendiste" defaultValue={hecho.nota || ''} />
    <Box component="button" type="button" data-accion="reto-quitar" data-id={hecho.id} sx={{ ...suave, bgcolor: 'transparent', border: 0, font: 'inherit', cursor: 'pointer', borderRadius: '10px', '&:hover': { bgcolor: tokens.surface2 } }}>↩ No lo hice</Box>
  </> : esActivo ? <Nota sx={{ m: 0 }}>Es tu reto activo (arriba).</Nota>
    : reto.tipo === 'racha'
      ? (activo ? <Nota sx={{ m: 0 }}>Termina o deja el reto activo para empezar este.</Nota> : <Chip clickable variant="outlined" data-accion="reto-empezar" data-id={reto.id} label="▶ Empezar hoy" sx={{ justifySelf: 'start' }} />)
      : <Chip clickable variant="outlined" data-accion="reto-una" data-id={reto.id} label="✅ Lo hice" sx={{ justifySelf: 'start' }} />;
  return (
    <Box component="li" key={reto.id} sx={{ gap: '6px !important' }}>
      <Box component="b" sx={hecho ? { color: 'text.secondary' } : null}>{(hecho ? '✅ ' : esActivo ? '🔥 ' : '') + reto.texto}</Box>
      <Box component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>{duracion(reto)}{hecho ? ' · hecho el ' + fechaCorta(hecho.fin) : ''}</Box>
      {reto.nota ? <Box component="span" sx={{ color: 'text.secondary', fontSize: 13 }}>⚠️ {reto.nota}</Box> : null}
      {aviso && !hecho ? <Box component="span" sx={{ color: 'warning.main' }}>⚽ {aviso}</Box> : null}
      {reto.ir && !hecho ? <Link href={reto.ir} sx={{ fontSize: 14, color: 'text.secondary' }}>Ir a Finanzas →</Link> : null}
      {acciones}
    </Box>
  );
}
function retos(hoy = iso()) {
  const activo = retoActivo() as Fin, n = cuantosHechos() as number, total = (RETOS as Fin[]).length;
  return (
    <TarjetaPlegable vista={VISTA} clave="🔥 Retos" titulo="🔥 Retos" lado={<b>{n} / {total}</b>}>
      <Avance parte={n / total} />
      <Nota>Una racha a la vez. Si fallas un día, vuelve a 0. Lo que más vale son tus notas de cómo te fue.</Nota>
      {activo ? <BloqueReto x={activo} hoy={hoy} /> : null}
      {Object.entries(TEMAS_RETOS as Record<string, Fin[]>).map(([tema, lista]) => {
        const hechos = lista.filter((x) => hechoDe(x.id)).length, conActivo = !!(activo && lista.some((x) => x.id === activo.reto));
        return (
          <Box key={tema + (conActivo ? ':activo' : '')} data-reto-tema=""><Desplegable abiertoAlInicio={conActivo} titulo={<>{tema} <Box component="small" sx={{ color: 'text.secondary', fontWeight: 400 }}>{hechos} / {lista.length}</Box></>}>
            <Lista>{lista.map((x) => filaReto(x, activo, hoy))}</Lista>
          </Desplegable></Box>
        );
      })}
    </TarjetaPlegable>
  );
}

// ---------- Gráficos ----------
function constancia() {
  const lunesHoy = sumarDias(iso(), 1 - (diaSemana() as number)) as string, semanas: Fin[] = [], titulos: string[] = [];
  for (let s = 11; s >= 0; s--) {
    const lunes = sumarDias(lunesHoy, -7 * s) as string;
    titulos.push(Number(lunes.slice(8, 10)) <= 7 ? NOM[Number(lunes.slice(5, 7)) - 1] : '');
    semanas.push(Array.from({ length: 7 }, (_, k) => {
      const f = sumarDias(lunes, k) as string;
      if (f > iso()) return null;
      const p = puntajeDia(f) as Fin;
      return { v: p ? p.total / 100 : null, tip: LETRA[k + 1] + ' ' + fechaCorta(f) + ': ' + (p ? p.total + '/100' : 'sin datos') };
    }));
  }
  return (
    <Grafica titulo="🗓️ Constancia" ir="#hoy" nota="Cada cuadro es un día: entre más claro, más alto el puntaje (mañana, metas, gym y dieta).">
      {G((calendario as Fin)(semanas, { titulos }))}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 12, color: 'text.secondary', mt: '6px', '& i': { width: 14, height: 14, borderRadius: '3px', display: 'inline-block' } }}>
        <span>Menos</span>{[tokens.surface2, tokens.rampa1, tokens.rampa2, tokens.rampa3, tokens.rampa4].map((c) => <Box component="i" key={c} sx={{ bgcolor: c }} />)}<span>Más</span>
      </Box>
    </Grafica>
  );
}
function puntajes(dias: number) {
  const ps = (rango(dias) as string[]).map((f) => ({ f, p: puntajeDia(f) as Fin }));
  const datos = ps.map(({ f, p }) => ({ etiqueta: corta(f), v: p ? p.total : null, tip: LETRA[diaSemana(f) as number] + ' ' + fechaCorta(f) + ': ' + (p ? p.total + '/100 · ' + (p.partes.manana != null ? 'mañana ' + Math.round(p.partes.manana * 100) + ' %, ' : '') + (p.partes.metas != null ? 'metas ' + Math.round(p.partes.metas * 100) + ' %' : '') +
    (p.partes.gym != null ? ', gym ' + Math.round(p.partes.gym * 100) + ' %' : '') + (p.partes.dieta != null ? ', dieta ' + Math.round(p.partes.dieta * 100) + ' %' : '') : 'sin datos') }));
  return <Grafica titulo="⭐ Puntaje por día" ir="#hoy">{G((barras as Fin)(datos, { max: 100, ref: { v: 80, texto: 'buen día: 80' } }) + (tablaDatos as Fin)(['Día', 'Puntaje'], ps.filter((x) => x.p).map(({ f, p }) => [fechaCorta(f), p.total])))}</Grafica>;
}
function peso(e: Fin, dias: number) {
  if (!e.dieta) return null;
  const lista = pesosCorporales(e.dias) as Fin[], meta = e.dieta.config.meta;
  if (!lista.length) return <Grafica titulo="⚖️ Peso" ir="#dieta/peso"><Nota sx={{ m: 0 }}><IrA href="#dieta/peso">Anota tu peso en 🥗 Dieta → Peso</IrA> para ver la línea.</Nota></Grafica>;
  const fs = rango(Math.max(dias, 14)) as string[], porFecha = Object.fromEntries(lista.map((x) => [x.fecha, x.peso]));
  const puntos = fs.map((f) => { const hasta = lista.filter((x) => x.fecha <= f), t = hasta.length && porFecha[f] != null ? tendencia(hasta) as number : null; return { etiqueta: corta(f), v: t, tip: fechaCorta(f) + (porFecha[f] != null ? ': ' + kg(porFecha[f]) + ' kg (promedio 7: ' + kg(t as number) + ')' : ': sin registro') }; });
  return (
    <Grafica titulo="⚖️ Peso (promedio de 7 registros)" ir="#dieta/peso" nota="La línea es el promedio para que un día con más agua no te engañe.">
      {G((linea as Fin)(puntos, { formato: kg, ref: puntos.some((p) => p.v != null && p.v - meta < 6) ? { v: meta, texto: 'meta ' + kg(meta) } : null }) + (tablaDatos as Fin)(['Fecha', 'Peso (kg)'], lista.slice(-dias).reverse().map((x) => [fechaCorta(x.fecha), kg(x.peso)])))}
    </Grafica>
  );
}
function gymSeries(e: Fin) {
  const actual = semanaActual(), datos: Fin[] = [];
  for (let s = Math.max(1, actual - 11); s <= actual; s++) { const r = resumenSemana(e.rutina, e.semanas[s] || {}) as Fin; datos.push({ etiqueta: 'S' + s, v: r.hechas, plan: r.plan, tip: 'Semana ' + s + ' (' + fechaCorta(lunesDe(s)) + '): ' + r.hechas + ' de ' + r.plan + ' series' }); }
  return <Grafica titulo="🏋️ Series por semana" ir="#gym/resumen">{G((barras as Fin)(datos, { ref: { v: datos[datos.length - 1].plan, texto: 'plan ' + datos[datos.length - 1].plan } }) + (tablaDatos as Fin)(['Semana', 'Series', 'Plan'], datos.map((d) => [d.etiqueta, d.v, d.plan])))}</Grafica>;
}
function cardio(e: Fin) {
  const actual = semanaActual(), datos: Fin[] = [];
  for (let s = Math.max(1, actual - 11); s <= actual; s++) {
    const regs = e.semanas[s] || {}, dias = Object.keys(regs).filter((k) => k.startsWith('cardio@') && regs[k].min > 0), min = dias.reduce((t, k) => t + regs[k].min, 0);
    datos.push({ etiqueta: 'S' + s, v: min, tip: 'Semana ' + s + ': ' + min + ' min de cardio en ' + dias.length + (dias.length === 1 ? ' día' : ' días') });
  }
  if (!datos.some((d) => d.v)) return null;
  // Plan: la suma del mínimo de cada día con cardio ("30-35 min" → 30)
  const plan = (e.rutina as Fin[]).reduce((t, d) => t + (Number(((d.cardio || '').match(/(\d+)/) || [])[1]) || 0), 0);
  return <Grafica titulo="🏃 Minutos de cardio por semana" ir="#gym">{G((barras as Fin)(datos, plan ? { ref: { v: plan, texto: 'plan ' + plan + ' min' } } : {}) + (tablaDatos as Fin)(['Semana', 'Minutos'], datos.map((d) => [d.etiqueta, d.v])))}</Grafica>;
}
function metas(e: Fin, dias: number) {
  const fs = rango(dias) as string[], nombres = Object.fromEntries((visibles(e.config, 'metas') as string[]).map((k) => [k, (METAS as Record<string, string>)[k]]));
  if (!Object.keys(nombres).length) return null;
  return (
    <Grafica titulo="🎯 Metas cumplidas" ir="#metas">
      <Nota sx={{ mt: 0 }}>Últimos {dias} días, de izquierda (antes) a derecha (hoy). Toca una barra para ver el día.</Nota>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {Object.entries(nombres).map(([k, t]) => {
          const datos = fs.map((f) => { const a = e.dias[f] ? avanceMetas(f) as Fin : null; return { etiqueta: corta(f), v: a ? Math.round(a.partes[k] * 100) : null, tip: fechaCorta(f) + ': ' + (a ? Math.round(a.partes[k] * 100) + ' % de la meta' : 'sin datos') }; });
          return <div key={k}><Box component="h3" sx={{ fontSize: 13, color: 'text.secondary', m: '0 0 2px', fontWeight: 600 }}>{t}</Box>{G((barras as Fin)(datos, { alto: 60, max: 100, formato: (n: number) => n + '%', sinEtiquetas: true }))}</div>;
        })}
      </Box>
    </Grafica>
  );
}
function plata(e: Fin) {
  if (!e.finanzas) return null;
  const meses = Array.from({ length: 6 }, (_, i) => mesDe(sumarMeses(iso().slice(0, 8) + '01', i - 5)) as string), res = meses.map((m) => [m, resumenMes(e.finanzas, m)] as [string, Fin]);
  if (!res.some(([, r]) => r.ingresos || r.gastos)) return <Grafica titulo="💰 Plata" ir="#finanzas/registrar"><Nota sx={{ m: 0 }}><IrA href="#finanzas/registrar">Registra gastos e ingresos en 💰 Finanzas</IrA> para ver los meses.</Nota></Grafica>;
  const grupos = res.map(([m, r]) => ({ etiqueta: NOM[Number(m.slice(5, 7)) - 1], valores: [r.ingresos, r.gastos], tips: [NOM[Number(m.slice(5, 7)) - 1] + ': ingresos ' + pesos(r.ingresos), NOM[Number(m.slice(5, 7)) - 1] + ': gastos ' + pesos(r.gastos)] }));
  const actual = res[res.length - 1][1], cats = e.finanzas.categorias.gasto as Fin[], porCat = Object.entries(actual.porCategoria as Record<string, number>).sort((a, b) => b[1] - a[1]);
  const top = porCat.slice(0, 6), resto = porCat.slice(6).reduce((s, [, v]) => s + v, 0);
  const filas = top.map(([id, v]) => { const c = cats.find((x) => x.id === id) || { nombre: id, icono: '' }; return { etiqueta: c.icono + ' ' + c.nombre, v, tip: c.nombre + ': ' + pesos(v) + ' (' + Math.round((v / actual.gastos) * 100) + ' %)' }; });
  if (resto) filas.push({ etiqueta: 'Otras', v: resto, tip: 'Otras categorías: ' + pesos(resto) });
  const serie = (c: string) => <Box component="i" sx={{ width: 12, height: 12, borderRadius: '3px', display: 'inline-block', bgcolor: c }} />;
  return (
    <>
      <Grafica titulo="💰 Ingresos y gastos por mes" ir="#finanzas/mes">
        <Box sx={{ display: 'flex', gap: '12px', fontSize: 13, color: 'text.secondary', '& span': { display: 'inline-flex', alignItems: 'center', gap: '4px' } }}><span>{serie(tokens.serie1)}Ingresos</span><span>{serie(tokens.serie2)}Gastos</span></Box>
        {G((barrasAgrupadas as Fin)(grupos, [{ nombre: 'Ingresos', clase: 'serie-1' }, { nombre: 'Gastos', clase: 'serie-2' }], { formato: millones }) +
          (tablaDatos as Fin)(['Mes', 'Ingresos', 'Gastos', 'Diferencia'], res.map(([m, r]) => [NOM[Number(m.slice(5, 7)) - 1] + ' ' + m.slice(0, 4), pesos(r.ingresos), pesos(r.gastos), pesos(r.ingresos - r.gastos)])))}
      </Grafica>
      {filas.length ? <Grafica titulo="🧾 En qué se va la plata este mes" ir="#finanzas/presupuesto">{G((barrasH as Fin)(filas, { formato: pesos }))}</Grafica> : null}
    </>
  );
}
function sueno(e: Fin, dias: number) {
  const fs = rango(dias) as string[], datos = fs.map((f) => { const s = e.dias[f] && e.dias[f].sueno, h = horasSueno(s) as number | null; return { etiqueta: corta(f), v: h, tip: fechaCorta(f) + ': ' + (h != null ? String(h).replace('.', ',') + ' h' + (s.calidad ? ' · calidad ' + s.calidad + '/5' : '') : 'sin registro') }; });
  if (!datos.some((d) => d.v != null)) return <Grafica titulo="🌙 Sueño" ir="#hoy"><Nota sx={{ m: 0 }}><IrA href="#hoy">Anota a qué hora te acostaste y te levantaste en 🏠 Hoy</IrA> para ver tus noches.</Nota></Grafica>;
  return (
    <Grafica titulo="🌙 Horas de sueño" ir="#hoy" nota="Para ganar músculo y rendir en el fútbol, 7 a 9 horas.">
      {G((barras as Fin)(datos, { formato: (n: number) => String(Math.round(n * 10) / 10).replace('.', ','), ref: { v: 7, texto: 'mínimo 7 h' } }) +
        (tablaDatos as Fin)(['Noche', 'Horas', 'Calidad'], fs.filter((f) => e.dias[f] && horasSueno(e.dias[f].sueno) != null).reverse().map((f) => [fechaCorta(f), String(horasSueno(e.dias[f].sueno)).replace('.', ','), e.dias[f].sueno.calidad ? e.dias[f].sueno.calidad + '/5' : '—'])))}
    </Grafica>
  );
}
function futbol(e: Fin) {
  const lista = (partidos(e) as Fin[]).slice(-12);
  if (!lista.length) return <Grafica titulo="⚽ Partidos" ir="#hoy"><Nota sx={{ m: 0 }}>Después de cada partido, anota en 🏠 Hoy los minutos, el esfuerzo, la energía y las molestias.</Nota></Grafica>;
  const datos = lista.map((p) => ({ etiqueta: corta(p.fecha), v: p.carga || null, tip: fechaCorta(p.fecha) + ': ' + (p.minutos || '?') + ' min × esfuerzo ' + (p.rpe || '?') + (p.energia ? ' · energía ' + p.energia + '/5' : '') + (p.pierna ? ' · con pierna el día antes' : '') }));
  const comp = energiaSegunPierna(lista) as Fin, mal = comp && comp.con < comp.sin - 0.4;
  const texto = comp ? <>Energía con pierna el día antes: <b>{String(comp.con).replace('.', ',')}/5</b> · sin pierna: <b>{String(comp.sin).replace('.', ',')}/5</b>{mal ? '. La pierna te está quitando piernas para jugar: muévela más lejos del partido o baja una serie.' : '.'}</> : null;
  return (
    <Grafica titulo="⚽ Carga de los partidos" ir="#hoy" nota="Carga = minutos × esfuerzo (1-10). Sirve para no juntar semanas muy pesadas.">
      {G((barras as Fin)(datos))}
      {comp ? (mal ? <Aviso>{texto}</Aviso> : <Nota>{texto}</Nota>) : null}
      {G((tablaDatos as Fin)(['Fecha', 'Min', 'Esfuerzo', 'Energía', 'Pierna antes', 'Molestias'], lista.slice().reverse().map((p) => [fechaCorta(p.fecha), p.minutos || '—', p.rpe || '—', p.energia ? p.energia + '/5' : '—', p.pierna ? 'Sí' : 'No', (p.molestias || []).join(', ') || '—'])))}
    </Grafica>
  );
}

export default function Progreso() {
  const e = usarEstado() as Fin, dias = R.dias() as number, actual = semanaActual(), fuerzaEj = (piezasGym as Fin).ver().fuerzaEj;
  return (
    <>
      <Box sx={{ ...FILA, flexWrap: 'wrap' }}>
        <TituloPantalla>Progreso</TituloPantalla>
        <Opciones nombre="Rango" activa={String(dias)} opciones={['7', '30', '90'].map((n) => [n, n + ' días'] as [string, string])} datos={(n) => ({ 'data-accion': 'prog-dias', 'data-n': n })} chica />
      </Box>
      {indicadores(e)}
      {mejora()}
      {revision()}
      {cierreSemana(e)}
      {queTeFunciona()}
      {experimentosAnteriores()}
      {retos()}
      <Box sx={{ display: 'grid', gap: '14px', gridTemplateColumns: { md: '1fr 1fr' }, alignItems: 'start', '& > *': { mb: { md: '0 !important' } } }}>
        {constancia()}
        {puntajes(dias)}
        {peso(e, dias)}
        {sueno(e, dias)}
        {futbol(e)}
        {gymSeries(e)}
        <Grafica titulo="💪 Fuerza" ir="#gym/resumen" nota="1RM estimado del top set: compara peso y reps en un solo número.">{fuerza(e, actual, actual, fuerzaEj)}</Grafica>
        {cardio(e)}
        {metas(e, dias)}
        {plata(e)}
      </Box>
    </>
  );
}
