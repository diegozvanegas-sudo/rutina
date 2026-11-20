// 🎯 Dieta → Peso: el camino a la meta (cuánto falta, ritmo, cuándo llegas, escenarios), la curva del promedio de 7 días,
// semana a semana, tu cuerpo en números (IMC, peso saludable, cintura, proteína), consejos según tus datos y lo que conviene
// saber. React pinta; los cálculos están en src/meta-peso.js
import type { ReactNode } from 'react';
import { Box, Card } from '@mui/material';
import { iso, fechaCorta, sumarDias } from '../../fechas.js';
import { pesos, medidasDe } from '../../dieta.js';
import { juegaEl } from '../../futbol.js';
import { caminoMeta, promedioMovil, semanas, proteinaDia, consejosMeta, RITMOS } from '../../meta-peso.js';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Desplegable } from '../ui/Desplegable';
import { Nota } from '../ui/Textos';
import { Avance, Cifras } from '../ui/Varios';
import { Linea } from '../ui/Graficos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'dieta';
const f1 = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const kg = (n: number) => f1(n) + ' kg';
const kg2 = (n: number) => (Math.round(n * 100) / 100).toLocaleString('es-CO') + ' kg';
const GRIS = { color: 'text.secondary', fontSize: 14 };
const semanasTexto = (s: number) => (s < 1.5 ? '1 semana' : Math.round(s) + ' semanas') + (s >= 8 ? ' (~' + f1(s / 4.345) + ' meses)' : '');
const fechaLarga = (f: string) => new Date(f + 'T12:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

function Fila({ izq, der, sub, color }: { izq: ReactNode; der: ReactNode; sub?: ReactNode; color?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', py: '7px', borderBottom: '1px solid', borderColor: 'divider', fontSize: 14 }}>
      <Box sx={{ minWidth: 0 }}>{izq}{sub ? <Box component="small" sx={{ display: 'block', color: 'text.secondary' }}>{sub}</Box> : null}</Box>
      <Box component="b" sx={{ flex: 'none', textAlign: 'right', color }}>{der}</Box>
    </Box>
  );
}

// ---------- 🎯 Camino a la meta ----------
function Camino({ c }: { c: Fin }) {
  const hacia = c.ritmo == null ? null : c.bajar ? c.ritmo < 0 : c.ritmo > 0;
  const ritmoTxt = c.ritmo == null ? 'Aún no hay datos para saber tu ritmo (hacen falta 2 semanas de pesajes).'
    : Math.abs(c.ritmo) < 0.05 ? 'Tu peso está quieto estas semanas.'
    : (c.ritmo < 0 ? 'Bajas ' : 'Subes ') + kg(Math.abs(c.ritmo)) + ' por semana' + (hacia ? ': vas hacia la meta.' : ': vas al revés de la meta.');
  return (
    <Card component="section" data-t="camino-meta" sx={{ mb: '14px', display: 'grid', gap: '10px' }}>
      <Box component="h2" sx={{ m: 0, fontSize: 18 }}>🎯 Camino a la meta</Box>
      <Cifras datos={[{ titulo: 'Empezaste', valor: kg(c.inicio) }, { titulo: 'Hoy (promedio 7 días)', valor: kg(c.ahora) }, { titulo: 'Meta', valor: kg(c.meta) }, { titulo: c.llego ? '¡Llegaste!' : 'Te falta', valor: c.llego ? '🏁' : kg(c.falta) }]} />
      {c.avance != null ? (
        <Box>
          <Avance parte={c.avance} />
          <Box sx={{ ...GRIS, mt: '4px' }}>{(c.bajar ? c.ahora > c.inicio : c.ahora < c.inicio) && Math.abs(c.ahora - c.inicio) >= 0.1
            ? <>Estás <b>{kg(Math.abs(c.ahora - c.inicio))} {c.bajar ? 'por encima' : 'por debajo'}</b> de donde empezaste: el camino ahora es de {kg(c.falta)}.</>
            : <>Llevas el <b>{Math.round(c.avance * 100)} %</b> del camino ({kg(Math.abs(c.inicio - c.ahora))} de {kg(Math.abs(c.inicio - c.meta))}).</>}</Box>
        </Box>
      ) : null}
      <Box sx={{ p: '8px 10px', borderRadius: '10px', bgcolor: hacia === false ? tokens.amarilloFondo : tokens.surface2, color: hacia === false ? 'warning.main' : 'text.primary', fontSize: 14 }}>
        {ritmoTxt}{c.real ? <> A ese ritmo llegas en <b>{semanasTexto(c.real.semanas)}</b>{c.real.fecha ? <>, hacia el <b>{fechaLarga(c.real.fecha)}</b></> : null}.</> : null}
      </Box>
      {!c.llego && c.escenarios.length ? (
        <Box>
          <Box component="b" sx={{ fontSize: 14 }}>¿Y si bajas a otro ritmo?</Box>
          {(c.escenarios as Fin[]).map((s) => (
            <Fila key={s.ritmo} izq={kg2(s.ritmo) + ' por semana' + (s.ritmo === 0.5 ? ' · el ideal' : s.ritmo === RITMOS[0] ? ' · suave' : ' · rápido')} sub={'Déficit de unas ' + s.kcalDia.toLocaleString('es-CO') + ' kcal al día'}
              der={<>{fechaLarga(s.fecha)}<Box component="small" sx={{ display: 'block', fontWeight: 400, color: 'text.secondary' }}>{semanasTexto(s.semanas)}</Box></>} />
          ))}
          <Nota>Entre 0,5 y 0,75 kg por semana se baja grasa sin perder músculo. Más rápido, el cuerpo empieza a quemar músculo y el rebote es casi seguro.</Nota>
        </Box>
      ) : null}
    </Card>
  );
}

// ---------- 📈 Promedio de 7 días ----------
function Curva({ lista, meta }: { lista: Fin[]; meta: number | null }) {
  const pm = (promedioMovil(lista) as Fin[]).slice(-60);
  if (pm.length < 3) return null;
  const puntos = pm.map((x, i) => ({ etiqueta: i === 0 || i === pm.length - 1 || i === Math.floor(pm.length / 2) ? fechaCorta(x.fecha) : '', v: Math.round(x.prom * 10) / 10,
    tip: fechaCorta(x.fecha) + ': promedio ' + kg(x.prom) + ' · ese día ' + kg(x.peso) }));
  const primero = pm[0].prom, ultimo = pm[pm.length - 1].prom, vals = pm.map((x) => x.prom);
  // La meta solo entra al gráfico si está cerca: lejos, aplasta la curva y no se ven los cambios de cada semana
  const metaCerca = meta != null && meta >= Math.min(...vals) - 3 && meta <= Math.max(...vals) + 3;
  return (
    <TarjetaPlegable vista={VISTA} clave="📈 Tu promedio de 7 días" titulo="📈 Tu promedio de 7 días">
      <Linea puntos={puntos} alto={130} formato={(n) => f1(n)} meta={metaCerca ? { v: meta as number, texto: 'Meta ' + f1(meta as number) } : undefined} />
      <Nota>Del {fechaCorta(pm[0].fecha)} al {fechaCorta(pm[pm.length - 1].fecha)}: <b>{ultimo <= primero ? '−' : '+'}{kg(Math.abs(ultimo - primero))}</b>.{meta != null && !metaCerca ? <> Tu meta ({kg(meta)}) está {kg(Math.abs(ultimo - meta))} {ultimo > meta ? 'por debajo' : 'por encima'} de la línea.</> : null} El peso de un día sube y baja hasta 1-2 kg por agua, sal y comida en el estómago: mira la línea, no el número del día. Pasa el dedo para ver cada día.</Nota>
    </TarjetaPlegable>
  );
}

// ---------- 📅 Semana a semana ----------
function Semanas({ lista, bajar }: { lista: Fin[]; bajar: boolean }) {
  const ss = (semanas(lista, 10) as Fin[]).reverse();
  if (ss.length < 2) return null;
  return (
    <TarjetaPlegable vista={VISTA} clave="📅 Semana a semana" titulo="📅 Semana a semana">
      {ss.map((s) => {
        const bien = s.cambio == null ? null : bajar ? s.cambio < -0.05 : s.cambio > 0.05, mal = s.cambio == null ? null : bajar ? s.cambio > 0.15 : s.cambio < -0.15;
        return <Fila key={s.lunes} izq={'Semana del ' + fechaCorta(s.lunes)} sub={s.veces + (s.veces === 1 ? ' pesaje' : ' pesajes') + (s.veces < 4 ? ' · pocos para confiar' : '')}
          der={<>{kg(s.prom)}<Box component="small" sx={{ display: 'block', fontWeight: 600, color: bien ? 'success.main' : mal ? 'warning.main' : 'text.secondary' }}>{s.cambio == null ? '—' : (s.cambio > 0 ? '+' : s.cambio < 0 ? '−' : '') + kg(Math.abs(s.cambio)) + (bien ? ' ✓' : mal ? ' ⚠' : '')}</Box></>} />;
      })}
    </TarjetaPlegable>
  );
}

// ---------- 🩺 Tu cuerpo en números ----------
function Cuerpo({ c, cintura, estatura }: { c: Fin; cintura: number | null; estatura: number | null }) {
  const p = proteinaDia(c.ahora, c.meta) as Fin;
  return (
    <TarjetaPlegable vista={VISTA} clave="🩺 Tu cuerpo en números" titulo="🩺 Tu cuerpo en números">
      {c.imc ? <Fila izq="IMC (índice de masa corporal)" sub={'Con la meta (' + kg(c.meta) + '): ' + (c.imcMeta ? f1(c.imcMeta.v) + ' · ' + c.imcMeta.cat : '—')} der={<>{f1(c.imc.v)}<Box component="small" sx={{ display: 'block', fontWeight: 600, color: c.imc.nivel === 0 ? 'success.main' : 'warning.main' }}>{c.imc.cat}</Box></>} />
        : <Fila izq="IMC" der="—" sub="Pon tu estatura en Datos y fórmula (abajo)" />}
      {c.saludable ? <Fila izq="Peso saludable para tu estatura" sub="IMC de 18,5 a 24,9. Con músculo de gym, unos kilos más arriba también está bien" der={kg(c.saludable.min) + ' a ' + kg(c.saludable.max)} /> : null}
      <Fila izq="Cintura / estatura" sub={estatura ? 'Menos de 0,5 = poco riesgo: tu cintura debería medir menos de ' + Math.round(estatura / 2) + ' cm' : 'Pon tu estatura'}
        der={cintura && estatura ? <>{(Math.round((cintura / estatura) * 100) / 100).toLocaleString('es-CO')}<Box component="small" sx={{ display: 'block', fontWeight: 600, color: cintura / estatura < 0.5 ? 'success.main' : 'warning.main' }}>{cintura / estatura < 0.5 ? 'Bien' : 'Alta'}</Box></> : 'Sin medir'} />
      <Fila izq="Proteína al día para no perder músculo" sub="1,8 a 2,2 g por kg. Repártela en 4 comidas: unos 30-40 g en cada una" der={p.min + '–' + p.max + ' g'} />
      <Fila izq="Agua al día" sub="35 ml por kg, más 500 ml por hora de entreno o partido" der={f1((c.ahora * 35) / 1000) + ' L'} />
      <Nota>Son guías generales, no un diagnóstico. Si tienes alguna condición de salud, revísalo con tu médico.</Nota>
    </TarjetaPlegable>
  );
}

// ---------- 💡 Consejos según tus datos ----------
function Consejos({ lista }: { lista: Fin[] }) {
  if (!lista.length) return null;
  return (
    <Card component="section" data-t="consejos-meta" sx={{ mb: '14px', display: 'grid', gap: '8px' }}>
      <Box component="h2" sx={{ m: 0, fontSize: 18 }}>💡 Lo que haría ahora</Box>
      {lista.slice(0, 5).map((x, i) => (
        <Box key={x.t} sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', p: '8px 10px', borderRadius: '10px', bgcolor: i === 0 ? tokens.subeFondo : tokens.surface2 }}>
          <Box component="span" aria-hidden="true" sx={{ fontSize: 20 }}>{x.ic}</Box>
          <Box sx={{ minWidth: 0 }}><b>{x.t}</b><Box sx={{ fontSize: 14, color: 'text.secondary', mt: '2px' }}>{x.d}</Box></Box>
        </Box>
      ))}
    </Card>
  );
}

// ---------- 📚 Para saber ----------
const SABER: [string, string[]][] = [
  ['⚖️ ¿Por qué el peso sube y baja de un día a otro?', [
    'Un día con más sal o carbos retiene 0,5 a 2 kg de agua: no es grasa.',
    'Después de entrenar pierna o jugar un partido, el músculo guarda agua para repararse: el peso sube 1-2 días.',
    'Para subir 1 kg de grasa hay que comer unas 7.700 kcal de más: no pasa en un día.',
    'Por eso la app usa el promedio de 7 días y lo compara semana a semana.',
  ]],
  ['💪 Bajar grasa sin perder músculo', [
    'Déficit moderado: 300 a 600 kcal menos de lo que gastas, no más.',
    'Proteína alta todos los días (la de la tarjeta de arriba), también los fines de semana.',
    'Sigue entrenando pesado: si dejas de pedirle fuerza al músculo, el cuerpo lo quema.',
    'Dormir 7 horas o más: con poco sueño baja más músculo y da más hambre.',
  ]],
  ['⏸ Si te estancas', [
    'Primero confirma: 3 semanas o más con el promedio quieto y la cintura igual.',
    'Revisa lo que no se ve: aceite al cocinar, salsas, bebidas, picadas, fines de semana.',
    'Muévete más antes de comer menos: 2.000 pasos más al día son unas 100 kcal.',
    'Si llevas más de 12 semanas en déficit, una o dos semanas comiendo lo que gastas ayudan a seguir.',
  ]],
  ['🍽️ Fines de semana y comer fuera', [
    'El fin de semana decide el mes: 2 días comiendo de más pueden borrar el déficit de 5.',
    'En restaurante: proteína a la plancha, ensalada o verduras, y un carbo (no tres). Salsas aparte.',
    'El alcohol suma calorías y baja el control: si tomas, elige y cuenta.',
    'Una comida libre a la semana está bien; un día libre completo, no.',
  ]],
  ['⚽ Fútbol y dieta', [
    'El día del partido come carbos 2-3 horas antes (arroz, papa, pasta, pan) y proteína después.',
    'Hidrátate antes, durante y después; con calor, agrega sal o una bebida con electrolitos.',
    'No llegues al partido en ayunas ni con déficit fuerte: rinde menos y se arriesgan lesiones.',
    'Recorta calorías los días de descanso, no los de partido ni los de pierna.',
  ]],
];
function Saber() {
  return (
    <TarjetaPlegable vista={VISTA} clave="📚 Para llegar a la meta" titulo="📚 Para llegar a la meta">
      {SABER.map(([t, puntos]) => (
        <Desplegable key={t} titulo={t} perezoso>
          <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '6px', fontSize: 14 }}>{puntos.map((p) => <li key={p}>{p}</li>)}</Box>
        </Desplegable>
      ))}
    </TarjetaPlegable>
  );
}

// Todo junto. Sin meta: solo la curva y lo que conviene saber
export function MetaPeso({ e }: { e: Fin }) {
  const hoy = iso(), c0 = e.dieta.config, lista = pesos(e.dias) as Fin[];
  if (!lista.length) return null;
  const cintura = ((medidasDe(e.dias) as Fin[]).filter((m) => m.cintura > 0).pop() || {}).cintura || null;
  const c = c0.meta ? caminoMeta({ lista, meta: c0.meta, inicio: c0.pesoInicio, estatura: c0.estatura, hoy }) as Fin : null;
  // Partidos a la semana (config.futbol) y pasos promedio de los últimos 7 días
  const partidos = Array.from({ length: 7 }, (_, i) => juegaEl(e.config, sumarDias(hoy, -i))).filter(Boolean).length;
  const ps = Object.keys(e.dias).filter((f) => f <= hoy).sort().slice(-7).map((f) => Number(((e.dias[f] || {}).metas || {}).pasos) || 0).filter((x) => x > 0);
  const pasos = ps.length >= 3 ? ps.reduce((a, b) => a + b, 0) / ps.length : null;
  const tips = c ? consejosMeta(c, { lista, hoy, cintura, estatura: c0.estatura, partidos, pasos } as Fin) as Fin[] : [];
  return (
    <>
      {c ? <Camino c={c} /> : <Card component="section" sx={{ mb: '14px' }}><Nota sx={{ m: 0 }}>🎯 Pon tu meta en <b>Datos y fórmula</b> (abajo) y aquí verás cuánto te falta, a qué ritmo vas y cuándo llegarías.</Nota></Card>}
      <Consejos lista={tips} />
      <Curva lista={lista} meta={c0.meta || null} />
      <Semanas lista={lista} bajar={c ? c.bajar : true} />
      {c ? <Cuerpo c={c} cintura={cintura} estatura={c0.estatura || null} /> : null}
      <Saber />
    </>
  );
}
