// 🌱 Mi vida: leer tu vida completa y mejorar 1 % al día. Lo de un vistazo, tu año en cuadritos, la curva del 1 %, tu vida
// en semanas, la rueda de la vida, qué te sube el ánimo, trabajo e ingresos, el diario de decisiones y la revisión con IA.
// React pinta; la lógica está en src/mivida.js y las acciones en src/vistas/mivida.js (animo…, rueda-…, decision-…, ia-…).
import { useState, type ReactNode } from 'react';
import { Box, Button, Chip, Link } from '@mui/material';
import { iso, fechaCorta, sumarDias } from '../../fechas.js';
import { rango } from '../../progreso.js';
import {
  resumenAnimo, resumenTrabajo, ACCIONES_INGRESO, META_TRABAJO, AREAS, IDEAS_AREA, ruedaActual, ruedaAnterior, ruedaToca, areaMasBaja, promedioRueda, CADA_RUEDA,
  decisiones, porRevisar, criterio, REVISAR_EN, anio, meses, vidaEnSemanas, ANIOS_VIDA, curvaUno, tuCurva, queTeSube, mejorasUno,
} from '../../mivida.js';
import { experimentoActivo } from '../../mejora.js';
import { piezasVida, revisionesIA } from '../../vistas/mivida.js';
import { claveIA, MODELO } from '../../ia';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo, CampoLista } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';
import { Opciones, Avance } from '../ui/Varios';
import { Barras, Calendario, Linea } from '../ui/Graficos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'vida';
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const NOM = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const f1 = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const miles = (n: number) => Math.round(n).toLocaleString('es-CO');
// Qué se ve en "Tu año": dura mientras la app esté abierta
let medidaElegida: 'puntaje' | 'animo' = 'puntaje';

const Plegable = ({ titulo, lado, children }: { titulo: string; lado?: ReactNode; children: ReactNode }) => (
  <TarjetaPlegable vista={VISTA} clave={titulo} titulo={titulo} lado={lado} sx={{ m: { md: 0 } }}>{children}</TarjetaPlegable>
);
const Lista = ({ children }: { children: ReactNode }) => <Box component="ul" sx={{ listStyle: 'none', m: '8px 0', p: 0, display: 'grid', gap: '8px', '& > li': { display: 'grid', gap: '2px', p: '8px 12px', borderRadius: '12px', bgcolor: tokens.surface2 } }}>{children}</Box>;
const Caja = ({ children, sx }: { children: ReactNode; sx?: object }) => <Box sx={{ display: 'grid', gap: '4px', p: '10px 12px', borderRadius: '12px', bgcolor: tokens.surface2, '& p': { m: 0 }, ...sx }}>{children}</Box>;

// ---------- De un vistazo ----------
function vistazo(e: Fin) {
  const sem = rango(7) as string[], a = resumenAnimo(sem, e) as Fin, t = resumenTrabajo(sem, e) as Fin, r = ruedaActual(e) as Fin, pend = (porRevisar(iso(), e) as Fin[]).length;
  const tiles: [string, ReactNode, string, string][] = [
    ['Ánimo 7 días', a.dias ? f1(a.animo) + '/5' : '—', a.dias ? (a.energia ? 'energía ' + f1(a.energia) + '/5' : a.dias + ' días') : 'anótalo en Hoy', '#hoy'],
    ['Trabajo profundo', f1(t.horas) + ' h', t.acciones + (t.acciones === 1 ? ' acción' : ' acciones') + ' hacia el ingreso', '#hoy'],
    ['Rueda de la vida', r && promedioRueda(r) != null ? f1(promedioRueda(r) as number) + '/10' : '—', r ? 'del ' + fechaCorta(r.fecha) : 'hazla abajo', '#vida'],
    ['Decisiones', String((decisiones(e) as Fin[]).length), pend ? pend + ' por revisar' : 'anotadas', '#vida'],
  ];
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', mb: '14px' }}>
      {tiles.map(([titulo, v, s, href]) => (
        <Box component="a" key={titulo} href={href} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: tokens.radio + 'px', p: '12px', display: 'grid', gap: '2px', textDecoration: 'none', color: 'text.primary', '&:hover, &:focus-visible': { borderColor: 'primary.main' } }}>
          <Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{titulo}</Box>
          <Box component="b" sx={{ fontSize: 26, fontVariantNumeric: 'tabular-nums' }}>{v}</Box>
          <Box component="span" sx={{ color: 'text.secondary', fontSize: 13 }}>{s}</Box>
        </Box>
      ))}
    </Box>
  );
}

// ---------- 🗓️ Tu año en cuadritos ----------
function TuAnio({ e }: { e: Fin }) {
  // En el celular el año se desliza: arranca mostrando las semanas de ahora (a la derecha)
  const alFinal = (el: HTMLDivElement | null) => { if (el && el.scrollWidth > el.clientWidth && !el.dataset.listo) { el.scrollLeft = el.scrollWidth; el.dataset.listo = '1'; } };
  const [medida, ponerMedida] = useState(medidaElegida), A = anio(medida, iso(), e) as Fin, M = meses(iso(), e) as Fin[];
  const titulos = (A.semanas as Fin[][]).map((s) => { const d = s.find(Boolean); return d && Number(d.f.slice(8, 10)) <= 7 ? NOM[Number(d.f.slice(5, 7)) - 1] : ''; });
  const orden = [...M].sort((a, b) => b.puntaje - a.puntaje), mejor = orden[0], peor = orden.length > 1 ? orden[orden.length - 1] : null;
  const nombreMes = (m: string) => NOM[Number(m.slice(5, 7)) - 1] + ' ' + m.slice(0, 4);
  return (
    <Plegable titulo="🗓️ Tu año en cuadritos">
      <Box sx={{ ...FILA, flexWrap: 'wrap' }}>
        <Nota sx={{ m: 0 }}>Un cuadro por día, las últimas 53 semanas. Toca uno para ver el día.</Nota>
        <Opciones nombre="Qué ver en el año" activa={medida} opciones={[['puntaje', '⭐ Puntaje'], ['animo', '😊 Ánimo']]} alElegir={(m) => { medidaElegida = m as 'puntaje' | 'animo'; ponerMedida(medidaElegida); }} chica />
      </Box>
      <Box data-anio="" ref={alFinal} sx={{ overflowX: 'auto', width: '100%', mt: '6px', '& svg': { minWidth: 640 } }}><Calendario semanas={A.semanas} titulos={titulos} /></Box>
      <Nota>{A.dias ? A.dias + (A.dias === 1 ? ' día anotado' : ' días anotados') + ' en el año' + (A.promedio != null ? ' · promedio ' + (medida === 'animo' ? f1(1 + A.promedio * 4) + '/5' : Math.round(A.promedio * 100) + '/100') : '') + '.'
        : medida === 'animo' ? 'Todavía no hay ánimo anotado. Anótalo cada día en 🏠 Hoy → 😊 Ánimo y energía.' : 'Todavía no hay días anotados.'}</Nota>
      {mejor && peor ? <Caja><p>🏆 Tu mejor mes: <b>{nombreMes(mejor.mes)}</b> ({Math.round(mejor.puntaje)}/100). El más flojo: <b>{nombreMes(peor.mes)}</b> ({Math.round(peor.puntaje)}/100).</p><Nota sx={{ m: 0 }}>¿Qué hacías distinto en tu mejor mes? Eso es lo que hay que repetir.</Nota></Caja> : null}
    </Plegable>
  );
}

// ---------- 📈 La curva del 1 % ----------
function curva(e: Fin) {
  const c = tuCurva(iso(), e) as Fin, mu = mejorasUno(iso(), e) as Fin, puntos = Array.from({ length: 13 }, (_, i) => ({ etiqueta: i ? i + 'm' : 'hoy', v: Math.round(curvaUno(i * 30) * 100) / 100, tip: 'En ' + i * 30 + ' días: ' + f1(curvaUno(i * 30)) + ' veces' }));
  return (
    <Plegable titulo="📈 La curva del 1 %">
      <Box sx={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr' }}>
        <Caja><Box component="b" sx={{ fontSize: 26, color: 'primary.main' }}>{f1(curvaUno(365))}×</Box><Nota sx={{ m: 0 }}>1 % mejor cada día durante un año</Nota></Caja>
        <Caja><Box component="b" sx={{ fontSize: 26, color: 'warning.main' }}>{(curvaUno(365, -0.01)).toFixed(2).replace('.', ',')}×</Box><Nota sx={{ m: 0 }}>1 % peor cada día durante un año</Nota></Caja>
      </Box>
      <Linea puntos={puntos} formato={(n) => f1(n) + '×'} margenEje={0} />
      {c.listo ? <Caja>
        <p>Tu puntaje: <b>{Math.round(c.inicio)}/100</b> en tus primeros {c.n} días → <b>{Math.round(c.ahora)}/100</b> en los últimos {c.n} ({c.cambio >= 0 ? '+' : ''}{Math.round(c.cambio * 100)} %).</p>
        {c.diario != null ? <Nota sx={{ m: 0 }}>Eso es {c.diario >= 0 ? 'mejorar' : 'empeorar'} un <b>{f1(Math.abs(c.diario) * 100)} %</b> al día desde el {fechaCorta(c.desde)}. {c.diario >= 0.01 ? '¡Vas al ritmo del 1 %!' : c.diario > 0 ? 'Vas subiendo; el 1 % diario es la meta.' : 'Vas bajando: elige un solo cambio y pruébalo 7 días.'}</Nota> : null}
      </Caja> : <Nota>Con 20 días anotados te muestro tu propia curva (llevas {c.dias}).</Nota>}
      {mu.dias ? <Caja>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}><b>📈 Tus mejoras del 1 %</b><span><b>{mu.dias}</b> de {mu.de} días</span></Box>
        <Box component="ul" sx={{ m: 0, pl: '18px', display: 'grid', gap: '4px' }}>{(mu.lista as Fin[]).slice(0, 7).map((x) => <li key={x.fecha}><Box component="small" sx={{ color: 'text.secondary' }}>{fechaCorta(x.fecha)}:</Box> {x.texto}</li>)}</Box>
      </Caja> : <Nota>Cada noche, en 🌙 Cierre de la noche, anota tu mejora del 1 % de ese día y aquí verás todas juntas.</Nota>}
      <Nota>El 1 % no es hacer más: es hacer un poquito mejor lo de siempre, todos los días, y medirlo.</Nota>
    </Plegable>
  );
}

// ---------- ⏳ Tu vida en semanas ----------
function semanasVida(e: Fin) {
  const nac = (e.vida || {}).nacimiento || '', V = vidaEnSemanas(nac, iso()) as Fin;
  const c = 5, g = 1, cols = 52;
  return (
    <Plegable titulo="⏳ Tu vida en semanas">
      <Campo key={'nac' + nac} etiqueta="Fecha de nacimiento" type="date" max={sumarDias(iso(), -1)} data-cambio="vida-nacimiento" defaultValue={nac} />
      {V ? <>
        <Parrafo>Tienes <b>{V.edad} años</b>. Has vivido <b>{miles(V.vividas)}</b> semanas; si llegas a los {ANIOS_VIDA}, te quedan <b>{miles(V.quedan)}</b>.</Parrafo>
        <Avance parte={V.fraccion} />
        <Box data-vida-semanas="" sx={{ mt: '8px', maxWidth: 420, '& rect.v': { fill: tokens.brand }, '& rect.q': { fill: tokens.surface2 }, '& rect.h': { fill: tokens.dorado } }}>
          <svg viewBox={'0 0 ' + cols * (c + g) + ' ' + ANIOS_VIDA * (c + g)} role="img" aria-label={'Tu vida en semanas: ' + V.vividas + ' vividas de ' + V.total}>
            {Array.from({ length: ANIOS_VIDA * cols }, (_, i) => <rect key={i} className={i < V.vividas ? 'v' : i === V.vividas ? 'h' : 'q'} x={(i % cols) * (c + g)} y={Math.floor(i / cols) * (c + g)} width={c} height={c} rx={1} />)}
          </svg>
        </Box>
        <Nota>Cada fila es un año y cada cuadro una semana. El dorado es esta semana. No es para asustarte: es para no gastar las que quedan en lo que no importa.</Nota>
      </> : <Nota sx={{ m: 0 }}>Pon tu fecha de nacimiento y ves tu vida entera en una pantalla: una fila por año, un cuadro por semana. Se guarda solo en tus datos.</Nota>}
    </Plegable>
  );
}

// ---------- 🎡 Rueda de la vida ----------
function Radar({ r, antes }: { r: Fin; antes: Fin }) {
  const n = AREAS.length, cx = 110, cy = 110, R = 80;
  const punto = (i: number, v: number) => { const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + Math.cos(ang) * R * (v / 10), cy + Math.sin(ang) * R * (v / 10)]; };
  const forma = (x: Fin) => (AREAS as Fin[]).map(([k], i) => punto(i, x.notas[k] || 0).join(',')).join(' ');
  return (
    <Box sx={{ maxWidth: 300, mx: 'auto', '& .aro': { fill: 'none', stroke: tokens.line }, '& .antes': { fill: 'none', stroke: tokens.serie2, strokeDasharray: '4 3', strokeWidth: 1.5 }, '& .ahora': { fill: tokens.brandSoft, stroke: tokens.brand, strokeWidth: 2 }, '& text': { fontSize: 15, fill: 'currentColor' } }}>
      <svg viewBox="0 0 220 220" role="img" aria-label="Rueda de la vida">
        {[2.5, 5, 7.5, 10].map((v) => <polygon key={v} className="aro" points={(AREAS as Fin[]).map((_, i) => punto(i, v).join(',')).join(' ')} />)}
        {antes ? <polygon className="antes" points={forma(antes)} /> : null}
        <polygon className="ahora" points={forma(r)} />
        {(AREAS as Fin[]).map(([k, i], j) => { const [x, y] = punto(j, 12.4); return <text key={k} x={x} y={y + 5} textAnchor="middle">{i}</text>; })}
      </svg>
    </Box>
  );
}
function rueda(e: Fin) {
  const r = ruedaActual(e) as Fin, antes = ruedaAnterior(e) as Fin, toca = ruedaToca(iso(), e), hoy = iso();
  const editando = !r || r.fecha === hoy || toca, baja = areaMasBaja(r) as string | null, area = baja ? (AREAS as Fin[]).find(([k]) => k === baja) : null;
  const notas = editando && r && r.fecha === hoy ? r.notas : {};
  return (
    <Plegable titulo="🎡 Rueda de la vida" lado={r ? <Nota sx={{ m: 0 }}>{fechaCorta(r.fecha)}</Nota> : null}>
      <Nota sx={{ mt: 0 }}>Cada {CADA_RUEDA / 30} meses, del 1 al 10: ¿qué tan satisfecho estás en cada área? Sin pensarlo mucho. Lo que está más bajo es lo que más rinde mejorar.</Nota>
      {r && promedioRueda(r) != null ? <Radar r={r} antes={antes} /> : null}
      {antes && r ? <Nota sx={{ textAlign: 'center', m: 0 }}>Línea punteada: tu rueda del {fechaCorta(antes.fecha)}.</Nota> : null}
      {area && r ? <Caja sx={{ my: '8px' }}>
        <p>Tu área más baja: <b>{area[1]} {area[2]} ({r.notas[baja as string]}/10)</b>.</p>
        <p>Experimento de 7 días: <i>{(IDEAS_AREA as Record<string, string>)[baja as string]}</i></p>
        {experimentoActivo() ? <Nota sx={{ m: 0 }}>Ya tienes un experimento en curso (en 🏠 Hoy). Cuando lo termines, empieza este.</Nota>
          : <Button data-accion="rueda-experimento" data-k={baja} sx={{ justifySelf: 'start' }}>🧪 Empezar este experimento</Button>}
      </Caja> : null}
      {editando ? <>
        {r && r.fecha !== hoy ? <Box component="p" sx={{ fontWeight: 700 }}>Ya pasaron {CADA_RUEDA / 30} meses: toca hacer la rueda otra vez.</Box> : null}
        <Box sx={{ display: 'grid', gap: '10px' }}>
          {(AREAS as Fin[]).map(([k, i, n]) => (
            <Box key={k}>
              <Box sx={{ ...FILA, fontSize: 15 }}><span>{i} {n}</span>{antes && antes.notas[k] ? <Nota sx={{ m: 0 }}>antes {antes.notas[k]}</Nota> : null}</Box>
              <Opciones nombre={'Rueda: ' + n} activa={notas[k] ? String(notas[k]) : null} opciones={Array.from({ length: 10 }, (_, x) => [String(x + 1), String(x + 1)] as [string, string])} datos={(v) => ({ 'data-accion': 'rueda-nota', 'data-k': k, 'data-v': v })} chica envolver />
            </Box>
          ))}
        </Box>
      </> : <Nota>La próxima rueda toca el {fechaCorta(sumarDias(r.fecha, CADA_RUEDA))}.</Nota>}
    </Plegable>
  );
}

// ---------- 🔬 Qué te sube el ánimo ----------
function queSube(e: Fin) {
  const { frases, dias } = queTeSube(iso(), e) as Fin;
  return (
    <Plegable titulo="🔬 Qué te sube el ánimo">
      {frases.length ? <>
        <Lista>{(frases as Fin[]).map(({ titulo, medida, r }) => (
          <li key={titulo + medida}><b>{r.dif > 0 ? '▲ ' : '▼ '}{titulo}</b><span>{medida[0].toUpperCase() + medida.slice(1)} {f1(r.si)}/5 cuando sí ({r.nSi} días), frente a {f1(r.no)}/5 cuando no ({r.nNo} días).{r.nota ? '' : ' Casi sin diferencia.'}</span></li>
        ))}</Lista>
        <Nota>Es una relación en tus datos, no prueba la causa. Lo que más sube tu ánimo es lo primero que no se negocia.</Nota>
      </> : <Nota sx={{ mt: 0 }}>Anota tu ánimo cada día en 🏠 Hoy. Con 5 días de cada lado (por ejemplo, 5 durmiendo bien y 5 no) te digo qué te hace sentir mejor. Llevas {dias} {dias === 1 ? 'día' : 'días'} con ánimo.</Nota>}
    </Plegable>
  );
}

// ---------- 💼 Trabajo e ingresos ----------
function trabajo(e: Fin) {
  const datos = Array.from({ length: 8 }, (_, i) => {
    const hasta = sumarDias(iso(), -7 * (7 - i)), t = resumenTrabajo(rango(7, hasta), e) as Fin;
    return { etiqueta: i === 7 ? 'esta' : '−' + (7 - i), v: Math.round(t.horas * 10) / 10, tip: 'Semana hasta el ' + fechaCorta(hasta) + ': ' + f1(t.horas) + ' h y ' + t.acciones + ' acciones', t };
  });
  const ahora = datos[7].t, meta = (META_TRABAJO / 60) * 5;
  return (
    <Plegable titulo="💼 Trabajo e ingresos">
      <Nota sx={{ mt: 0 }}>Horas de trabajo profundo por semana (las últimas 8). Se anotan en 🏠 Hoy → 💼 Trabajo e ingresos.</Nota>
      {datos.some((d) => d.v) ? <Barras datos={datos} formato={(n) => f1(n)} meta={{ v: meta, texto: 'meta ' + meta + ' h' }} /> : null}
      <Caja>
        <p>Esta semana: <b>{f1(ahora.horas)} h</b> de trabajo profundo y <b>{ahora.acciones}</b> {ahora.acciones === 1 ? 'acción' : 'acciones'} hacia el ingreso.</p>
        {ahora.acciones ? <Nota sx={{ m: 0 }}>{(ACCIONES_INGRESO as Fin[]).filter(([k]) => ahora.porTipo[k]).map(([k, i, n]) => i + ' ' + n + ': ' + ahora.porTipo[k]).join(' · ')}</Nota> : null}
        {ahora.acciones < 5 ? <Nota sx={{ m: 0 }}>La plata llega por acciones, no por intenciones: apunta a 1 acción al día (5 a la semana).</Nota> : <Nota sx={{ m: 0 }}>Buen ritmo. Lo que se mide se repite.</Nota>}
      </Caja>
      <Link href="#finanzas/planb" sx={{ fontSize: 14, color: 'text.secondary', display: 'inline-block', mt: '8px' }}>Ir al Plan B de Finanzas →</Link>
    </Plegable>
  );
}

// ---------- ⚖️ Diario de decisiones ----------
const SALIO: [string, string][] = [['si', '✅ Como esperaba'], ['parcial', '〰️ A medias'], ['no', '❌ No']];
function filaDecision(d: Fin, hoy: string) {
  const toca = !d.salio && d.revisar <= hoy;
  return (
    <Box component="li" key={d.id} data-decision={d.id} sx={toca ? { outline: '2px solid', outlineColor: tokens.dorado } : null}>
      <Desplegable abiertoAlInicio={toca} titulo={<>{d.salio ? SALIO.find(([k]) => k === d.salio)?.[1].split(' ')[0] + ' ' : toca ? '⏰ ' : ''}{d.texto} <Box component="small" sx={{ color: 'text.secondary', fontWeight: 400 }}>{fechaCorta(d.fecha)}</Box></>}>
        <Box sx={{ display: 'grid', gap: '6px', pt: '4px' }}>
          {d.espero ? <Nota sx={{ m: 0 }}>Esperaba: {d.espero} · confianza {d.confianza} %</Nota> : <Nota sx={{ m: 0 }}>Confianza {d.confianza} %</Nota>}
          <Nota sx={{ m: 0 }}>{d.salio ? 'Revisada el ' + fechaCorta(d.revisada || d.revisar) + '.' : toca ? 'Ya toca revisarla: ¿cómo salió?' : 'Se revisa el ' + fechaCorta(d.revisar) + '. Puedes revisarla antes.'}</Nota>
          <Opciones nombre={'Cómo salió: ' + d.texto} activa={d.salio || null} opciones={SALIO} datos={(v) => ({ 'data-accion': 'decision-salio', 'data-id': d.id, 'data-v': v })} chica envolver />
          <CampoLargo key={'res' + d.id} etiqueta="¿Qué pasó y qué aprendí?" filas={2} data-cambio="decision-resultado" data-id={d.id} defaultValue={d.resultado || ''} placeholder="Lo que salió, lo que no vi venir" />
          <Button variant="text" data-accion="decision-borrar" data-id={d.id} sx={{ justifySelf: 'start', color: 'text.secondary', fontWeight: 400, fontSize: 14 }}>🗑 Borrar</Button>
        </Box>
      </Desplegable>
    </Box>
  );
}
function diarioDecisiones(e: Fin) {
  const hoy = iso(), lista = [...(decisiones(e) as Fin[])].reverse(), pend = lista.filter((d) => !d.salio && d.revisar <= hoy), resto = lista.filter((d) => !pend.includes(d)), c = criterio(e) as Fin;
  return (
    <Plegable titulo="⚖️ Diario de decisiones" lado={pend.length ? <Chip size="small" label={pend.length + ' por revisar'} sx={{ bgcolor: tokens.amarilloFondo, color: 'warning.main', fontWeight: 700 }} /> : null}>
      <Nota sx={{ mt: 0 }}>Anota las decisiones importantes (trabajo, plata, relaciones, salud) y qué esperas que pase. A los {REVISAR_EN / 30} meses las revisas: así mejoras tu criterio, no solo tus hábitos.</Nota>
      {c ? <Caja sx={{ mb: '8px' }}>
        <p>De {c.revisadas} {c.revisadas === 1 ? 'decisión revisada' : 'decisiones revisadas'}, salieron como esperabas el <b>{Math.round(c.aciertos * 100)} %</b>, con una confianza promedio del {Math.round(c.confianza * 100)} %.</p>
        {c.sobre ? <Nota sx={{ m: 0 }}>Te tienes más confianza de la que aciertas: antes de decidir, busca la razón por la que podrías estar equivocado.</Nota> : c.bajo ? <Nota sx={{ m: 0 }}>Aciertas más de lo que crees: confía un poco más en tu juicio.</Nota> : <Nota sx={{ m: 0 }}>Tu confianza va con tus aciertos. Buen criterio.</Nota>}
      </Caja> : null}
      {lista.length ? <Lista>{[...pend, ...resto].map((d) => filaDecision(d, hoy))}</Lista> : null}
      <Box data-decision-nueva="" key={'nueva' + lista.length} sx={{ display: 'grid', gap: '8px', mt: '8px', p: '10px 12px', borderRadius: '12px', border: '1px dashed', borderColor: 'divider' }}>
        <Box component="b">＋ Nueva decisión</Box>
        <Campo etiqueta="¿Qué decidí?" name="texto" placeholder="Ej.: aceptar el trabajo de medio tiempo" />
        <Campo etiqueta="¿Qué espero que pase?" name="espero" placeholder="Ej.: en 3 meses gano 2 millones y me queda tiempo para estudiar" />
        <Box sx={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 1fr' }}>
          <CampoLista etiqueta="Confianza" name="confianza" defaultValue="70" opciones={[50, 60, 70, 80, 90].map((n) => [String(n), n + ' %'] as [string, string])} />
          <CampoLista etiqueta="Revisarla en" name="dias" defaultValue={String(REVISAR_EN)} opciones={[[30, '1 mes'], [90, '3 meses'], [180, '6 meses'], [365, '1 año']].map(([n, t]) => [String(n), String(t)] as [string, string])} />
        </Box>
        <Button data-accion="decision-agregar" sx={{ justifySelf: 'start' }}>Guardar decisión</Button>
      </Box>
    </Plegable>
  );
}

// ---------- 🤖 Revisión con IA ----------
function revisionIA() {
  const clave = claveIA(), ia = piezasVida.ia(), lista = [...(revisionesIA() as Fin[])].reverse(), ultima = lista[0];
  return (
    <Plegable titulo="🤖 Revisión de la semana con IA">
      <Nota sx={{ mt: 0 }}>Claude lee tu semana (gym, peso, comida, sueño, ánimo, trabajo, rueda y decisiones) y te responde aquí mismo. No lleva tu nombre ni tu correo.</Nota>
      {clave ? <>
        <Box sx={{ ...FILA, flexWrap: 'wrap' }}>
          <Button data-accion="ia-pedir" disabled={ia.pidiendo} sx={{ minHeight: 48 }}>{ia.pidiendo ? '⏳ Pensando… (puede tardar un minuto)' : '🤖 Pedir la revisión de esta semana'}</Button>
          <Nota sx={{ m: 0 }}>🔑 Clave guardada en este equipo</Nota>
        </Box>
        {ia.error ? <Box component="p" role="alert" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14 }}>{ia.error}</Box> : null}
      </> : null}
      {ultima ? (
        <Caja sx={{ mt: '10px' }}>
          <Box component="b">Revisión del {fechaCorta(ultima.fecha)}</Box>
          <Box data-revision-ia="" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 15 }}>{ultima.texto}</Box>
        </Caja>
      ) : null}
      {lista.length > 1 ? <Desplegable titulo={'Revisiones anteriores (' + (lista.length - 1) + ')'}>
        <Box sx={{ display: 'grid', gap: '8px' }}>{lista.slice(1).map((x, i) => <Desplegable key={i} titulo={'Revisión del ' + fechaCorta(x.fecha)}><Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 14 }}>{x.texto}</Box></Desplegable>)}</Box>
      </Desplegable> : null}
      <Desplegable abiertoAlInicio={!clave} titulo={clave ? '🔑 Cambiar o borrar la clave' : '🔑 Conectar tu clave de Anthropic'}>
        <Box sx={{ display: 'grid', gap: '6px', pt: '4px' }}>
          <Nota sx={{ m: 0 }}>1. Crea una clave en <Link href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</Link> (necesita saldo). 2. Pégala aquí. Se guarda <b>solo en este equipo</b>: no viaja a la nube ni a tus otros equipos.</Nota>
          <Campo key={'clave' + (clave ? 1 : 0)} etiqueta="Clave de la API" type="password" autoComplete="off" data-cambio="ia-clave" defaultValue={clave} placeholder="sk-ant-…" />
          <Nota sx={{ m: 0 }}>Usa {MODELO}. Cada revisión cuesta más o menos US$ 0,05 a 0,15 de tu saldo. Sin internet no funciona; puedes seguir copiando la revisión desde 📈 Progreso → 🔮 Predicciones.</Nota>
        </Box>
      </Desplegable>
    </Plegable>
  );
}

export default function MiVida() {
  const e = usarEstado() as Fin;
  return (
    <>
      <TituloPantalla>🌱 Mi vida</TituloPantalla>
      <Nota sx={{ mt: '-6px', mb: '12px' }}>Tu vida entera en una pantalla, para mejorar 1 % cada día.</Nota>
      {vistazo(e)}
      <Box sx={{ display: 'grid', gap: '14px', gridTemplateColumns: { md: '1fr 1fr' }, alignItems: 'start', '& > *': { minWidth: 0, mb: { md: '0 !important' } } }}>
        <Box sx={{ gridColumn: { md: '1 / -1' } }}><TuAnio e={e} /></Box>
        {queSube(e)}
        {rueda(e)}
        {trabajo(e)}
        {diarioDecisiones(e)}
        {curva(e)}
        {semanasVida(e)}
        <Box sx={{ gridColumn: { md: '1 / -1' } }}>{revisionIA()}</Box>
      </Box>
    </>
  );
}
