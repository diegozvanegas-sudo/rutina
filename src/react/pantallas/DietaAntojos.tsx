// 🍟 Antojos (Dieta): "Tengo un antojo" paso a paso (cuál, por qué, qué hacer, 10 minutos y una versión que encaja, y qué
// decidiste), tus patrones del mes, por qué nos dan ganas de "pecar" y lo que has anotado. Las reglas y los textos están en
// src/antojos.js; lo anotado va en dieta.antojos.
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, Card, Chip } from '@mui/material';
import { e as estado, guardar, planDieta as planDelDia } from '../../estado.js';
import { iso, hora, fechaCorta } from '../../fechas.js';
import { totalPlan } from '../../dieta.js';
import { ANTOJOS, MOTIVOS, DECISIONES, ESPERA_MIN, POR_QUE, ESTRATEGIAS, antojoDe, motivoDe, anotarAntojo, borrarAntojo, patronesAntojos, pesoDelAntojo } from '../../antojos.js';
import { miles, toast } from '../../ui.js';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import { Avance } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'dieta';
const CAJA = { p: '10px 12px', borderRadius: '12px', bgcolor: tokens.surface2, display: 'grid', gap: '6px' } as const;
const chip = (si: boolean) => ({ clickable: true, 'aria-pressed': si, color: si ? 'primary' as const : 'default' as const, variant: si ? 'filled' as const : 'outlined' as const, sx: { minHeight: 40, fontSize: 15 } });
const Paso = ({ n, children }: { n: number; children: ReactNode }) => <Box component="h3" sx={{ m: '12px 0 6px', fontSize: 16 }}>{n}. {children}</Box>;

// Los 10 minutos: cuenta hacia atrás sin repintar toda la app
function Espera({ alTerminar }: { alTerminar: () => void }) {
  const [fin, ponerFin] = useState<number | null>(null), [ahora, ponerAhora] = useState(Date.now());
  useEffect(() => {
    if (!fin) return undefined;
    const t = setInterval(() => { const n = Date.now(); ponerAhora(n); if (n >= fin) { clearInterval(t); alTerminar(); } }, 1000);
    return () => clearInterval(t);
  }, [fin]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!fin) return <Button data-t="antojo-esperar" color="secondary" onClick={() => { ponerFin(Date.now() + ESPERA_MIN * 60000); ponerAhora(Date.now()); }}>⏳ Esperar {ESPERA_MIN} minutos</Button>;
  const quedan = Math.max(0, Math.round((fin - ahora) / 1000)), total = ESPERA_MIN * 60;
  return (
    <Box data-t="antojo-espera" sx={CAJA}>
      <b>⏳ {Math.floor(quedan / 60)}:{String(quedan % 60).padStart(2, '0')}</b>
      <Avance parte={1 - quedan / total} />
      <Nota sx={{ m: 0 }}>Tómate un vaso de agua o un café y haz otra cosa. Las ganas suben y bajan como una ola: casi siempre pasan antes de los {ESPERA_MIN} minutos.</Nota>
    </Box>
  );
}

function Antojo({ kcalPlan }: { kcalPlan: number }) {
  const [antojo, ponerAntojo] = useState<string | null>(null), [otro, ponerOtro] = useState(''), [motivos, ponerMotivos] = useState<string[]>([]), [listaEspera, ponerListaEspera] = useState(false);
  const a = antojo ? antojoDe(antojo) : null, peso = antojo ? pesoDelAntojo(antojo, kcalPlan) as Fin : null;
  const alternar = (id: string) => ponerMotivos(motivos.includes(id) ? motivos.filter((x) => x !== id) : [...motivos, id]);
  const reiniciar = () => { ponerAntojo(null); ponerOtro(''); ponerMotivos([]); ponerListaEspera(false); };
  const decidir = (decision: string) => {
    anotarAntojo(estado().dieta, { antojo, otro, motivos, decision }, iso(), hora());
    guardar();
    toast(decision === 'comi' ? 'Anotado. Ahora la siguiente comida, normal: un antojo no arruina el plan' : decision === 'planeado' ? '📅 Anotado: disfrútalo ese día, sin culpa' : '💪 Bien: anotado');
    reiniciar(); window.scrollTo(0, 0);
  };
  return (
    <Card component="section" data-t="antojos" sx={{ mb: '14px' }}>
      <Box component="h2" sx={{ m: '0 0 4px', fontSize: 18 }}>🍟 Tengo un antojo</Box>
      <Nota sx={{ mt: 0 }}>Antes de decidir, 1 minuto: qué es, por qué llegó y qué te conviene hacer.</Nota>

      <Paso n={1}>¿Qué se te antoja?</Paso>
      <Box role="group" aria-label="Antojo" sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {ANTOJOS.map((x) => <Chip key={x.id} {...chip(antojo === x.id)} data-t="antojo-cual" data-id={x.id} label={x.icono + ' ' + x.nombre} onClick={() => ponerAntojo(antojo === x.id ? null : x.id)} />)}
      </Box>
      {antojo === 'otro' ? <Campo etiqueta="¿Qué es?" value={otro} maxLength={60} onChange={(ev) => ponerOtro(ev.currentTarget.value)} placeholder="Ej.: obleas, chorizo, arepa de huevo" /> : null}

      {a ? <>
        <Paso n={2}>¿Por qué crees que llegó? <Box component="small" sx={{ fontWeight: 400, color: 'text.secondary' }}>(uno o varios)</Box></Paso>
        <Nota sx={{ mt: 0 }}>Prueba rápida: ¿te comerías ahora un pollo con arroz? Si sí, es hambre. Si solo te sirve {a.id === 'otro' ? 'eso' : 'la ' + a.nombre.toLowerCase()}, es antojo.</Nota>
        <Box role="group" aria-label="Por qué" sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {MOTIVOS.map((m) => <Chip key={m.id} {...chip(motivos.includes(m.id))} data-t="antojo-motivo" data-id={m.id} label={m.icono + ' ' + m.nombre} onClick={() => alternar(m.id)} />)}
        </Box>
      </> : null}

      {a && motivos.length ? <>
        <Paso n={3}>Qué está pasando y qué hacer</Paso>
        <Box sx={{ display: 'grid', gap: '8px' }} data-t="antojo-consejo">
          {motivos.map((id) => { const m = motivoDe(id) as Fin; return (
            <Box key={id} sx={CAJA}>
              <b>{m.icono} {m.nombre}</b>
              <Nota sx={{ m: 0 }}><b>Por qué:</b> {m.porque}</Nota>
              <Box component="span" sx={{ fontSize: 15 }}><b>Haz esto:</b> {m.hacer}</Box>
            </Box>
          ); })}
          <Box sx={{ ...CAJA, border: '1px solid', borderColor: 'primary.main' }}>
            <b>🥗 Una versión que encaja{a.kcalVersion ? ' (~' + miles(a.kcalVersion) + ' kcal)' : ''}</b>
            <span>{a.version}</span>
            <Nota sx={{ m: 0 }}>💡 {a.truco}</Nota>
            {peso ? <Nota sx={{ m: 0 }}>{a.icono} {a.nombre} de la calle: <b>~{miles(peso.kcal)} kcal</b>, el {Math.round(peso.parte * 100)} % de tu plan de hoy ({miles(kcalPlan)} kcal). La versión que encaja te ahorra ~{miles(peso.ahorro)}.</Nota> : null}
          </Box>
          {listaEspera ? <Nota sx={{ color: 'success.main', fontWeight: 700 }}>✓ Pasaron los {ESPERA_MIN} minutos. ¿Cómo sigues?</Nota> : <Espera alTerminar={() => { ponerListaEspera(true); toast('⏳ Pasaron los ' + ESPERA_MIN + ' minutos: ¿todavía lo quieres?'); }} />}
        </Box>

        <Paso n={4}>¿Qué decidiste?</Paso>
        <Box sx={{ display: 'grid', gap: '8px', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {(['paso', 'version', 'planeado', 'comi'] as const).map((d) => (
            <Button key={d} data-t="antojo-decision" data-id={d} variant={d === 'paso' ? 'contained' : 'outlined'} onClick={() => decidir(d)}>{DECISIONES[d]}</Button>
          ))}
        </Box>
        <Nota>Si te lo comes: siéntate, sírvelo en un plato y disfrútalo despacio. Sin culpa: la culpa lleva al "ya qué" y al atracón. La siguiente comida, normal.{peso && peso.parte > 0.35 ? ' Si puedes, que reemplace una comida del plan (mejor el día de fútbol o de recarga), no que se sume.' : ''}</Nota>
      </> : null}
      {antojo ? <Button size="small" color="secondary" sx={{ mt: '8px' }} onClick={reiniciar}>Empezar de nuevo</Button> : null}
    </Card>
  );
}

function Patrones({ lista }: { lista: Fin[] }) {
  const p = patronesAntojos(lista, iso()) as Fin;
  if (p.total < 3) return <Nota sx={{ mt: 0 }}>{p.total ? 'Llevas ' + p.total + (p.total === 1 ? ' antojo anotado' : ' antojos anotados') + ' este mes. ' : ''}Con 3 o más te muestro cuándo y por qué te pasan más.</Nota>;
  const m = motivoDe(p.motivo?.id) as Fin, a = antojoDe(p.antojo?.id);
  return (
    <Box data-t="antojos-patrones" sx={{ display: 'grid', gap: '6px' }}>
      <Nota sx={{ mt: 0 }}>Últimos 30 días: <b>{p.total} antojos</b>, controlaste <b>{p.controlados}</b> ({Math.round(p.parte * 100)} %).</Nota>
      <Avance parte={p.parte} />
      <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '4px', fontSize: 15 }}>
        {m ? <li>El motivo que más se repite: <b>{m.icono} {m.nombre}</b> ({p.motivo.veces} veces). {m.hacer}</li> : null}
        {p.dia ? <li>El día: <b>{p.dia.nombre}</b> ({p.dia.veces}). Ese día deja planeada la comida o lleva el refrigerio.</li> : null}
        {p.franja ? <li>La hora: <b>{p.franja.nombre}</b> ({p.franja.veces}).</li> : null}
        <li>Lo que más pides: <b>{a.icono} {a.nombre}</b> ({p.antojo.veces}).</li>
      </Box>
    </Box>
  );
}

export function Antojos({ e }: { e: Fin }) {
  const lista = (e.dieta.antojos || []) as Fin[], plan = planDelDia() as Fin;
  const kcalPlan = plan ? Math.round(totalPlan(plan, e.dieta.alimentos).kcal) : 0;
  const recientes = [...lista].reverse().slice(0, 30);
  return (
    <>
      <Antojo kcalPlan={kcalPlan} />
      <TarjetaPlegable vista={VISTA} clave="🍟 Tus patrones" titulo="📊 Tus patrones">
        <Patrones lista={lista} />
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="🍟 Por qué" titulo="🧠 Por qué nos dan ganas de “pecar”">
        <Box sx={{ display: 'grid', gap: '8px' }}>
          {POR_QUE.map((x) => <Box key={x.t} sx={CAJA}><b>{x.t}</b><Nota sx={{ m: 0 }}>{x.d}</Nota></Box>)}
        </Box>
        <Box component="h3" sx={{ m: '14px 0 6px', fontSize: 16 }}>Lo que más ayuda</Box>
        <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '4px', fontSize: 15 }}>{ESTRATEGIAS.map((x) => <li key={x}>{x}</li>)}</Box>
      </TarjetaPlegable>
      {recientes.length ? (
        <TarjetaPlegable vista={VISTA} clave="🍟 Anotados" titulo={'📝 Anotados (' + lista.length + ')'}>
          <Box component="ul" data-t="antojos-lista" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '4px' }}>
            {recientes.map((x) => { const a = antojoDe(x.antojo); return (
              <Box component="li" key={x.id} sx={{ display: 'flex', alignItems: 'center', gap: '8px', p: '6px 8px', borderRadius: '10px', bgcolor: tokens.surface2, fontSize: 14 }}>
                <span aria-hidden>{a.icono}</span>
                <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <b>{x.otro || a.nombre}</b> · {fechaCorta(x.fecha)} {x.hora || ''} · {(x.motivos || []).map((id: string) => motivoDe(id)?.icono).join('')} · {(DECISIONES as Fin)[x.decision]}
                </Box>
                <Button size="small" color="secondary" aria-label={'Borrar ' + (x.otro || a.nombre) + ' del ' + fechaCorta(x.fecha)} sx={{ minWidth: 40 }}
                  onClick={() => { if (borrarAntojo(estado().dieta, x.id)) { guardar(); toast('Borrado'); } }}>✕</Button>
              </Box>
            ); })}
          </Box>
        </TarjetaPlegable>
      ) : null}
    </>
  );
}
