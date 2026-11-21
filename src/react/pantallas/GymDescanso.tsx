// 🛌 Días de descanso en el Gym: en cada día, descansarlo y pasar su entreno a otro día de la semana; arriba, los descansos
// de la semana y el aviso cuando llevas muchos días seguidos sin uno. La lógica está en src/descanso.js y src/estado.js
import { Box, Button, Chip } from '@mui/material';
import { descansaEl, movidoDe, semanaActual, hayFutbol } from '../../estado.js';
import { iso, sumarDias, diaSemana } from '../../fechas.js';
import { toast } from '../../ui.js';
import { fechaDeSesion, alternarDescanso, moverSesion, destinosPosibles, descansosSemana, sugerirDescanso } from '../../descanso.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { Desplegable } from '../ui/Desplegable';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const DIAS = ['', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
const nombreDia = (f: string) => DIAS[diaSemana(f) as number] + ' ' + Number(f.slice(8, 10));
const hoyOno = (f: string) => (f === iso() ? 'hoy' : f === sumarDias(iso(), 1) ? 'mañana' : 'el ' + nombreDia(f));
const MORADO = { m: '0 0 12px', p: '10px 12px', borderRadius: '10px', bgcolor: tokens.moradoFondo, fontSize: 14, display: 'grid', gap: '8px' };

// ---------- En el día: descansarlo y pasar su entreno ----------
export function DescansoDia({ d, sem }: { d: Fin; sem: number }) {
  usarEstado();
  const f = fechaDeSesion(d, sem) as string | null, hoy = iso();
  if (!f || d.id === 'core' || sem !== semanaActual()) return null;
  const rest = descansaEl(f), a = movidoDe(f) as string | null;
  if (!rest) return f >= hoy ? (
    <Button variant="text" color="secondary" data-t="descansar-dia" onClick={() => { alternarDescanso(f); toast('🛌 ' + d.nombre + ': ' + hoyOno(f) + ' descansas'); }}
      sx={{ minHeight: 40, mb: '8px', color: 'text.secondary', fontWeight: 400 }}>🛌 Descansar {hoyOno(f)}</Button>
  ) : null;
  const destinos = destinosPosibles(f, hoy) as string[];
  return (
    <Box data-t="dia-descansado" sx={MORADO}>
      <Box component="b" sx={{ color: tokens.moradoInk }}>🛌 {hoyOno(f)[0].toUpperCase() + hoyOno(f).slice(1)}: descanso{a ? ' · ' + d.nombre + ' pasa al ' + nombreDia(a) : ''}</Box>
      <span>{a ? <>Ese día haces <b>{d.nombre}</b> y cuenta en la semana como siempre.</> : <>Sin gym ese día: no cuenta como que faltaste y {hayFutbol(f) ? 'la comida queda en el plan de fútbol (el partido sigue)' : 'la comida pasa al plan de descanso'}. ¿Lo pasas a otro día de la semana?</>}</span>
      {destinos.length ? (
        <Box role="group" aria-label="Pasar el entreno a" sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {destinos.map((x) => { const si = a === x; return <Chip key={x} clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={'→ ' + nombreDia(x)} onClick={() => { moverSesion(f, si ? '' : x); toast(si ? d.nombre + ': sin mover' : '🔁 ' + d.nombre + ' pasa al ' + nombreDia(x)); }} sx={{ minHeight: 40 }} />; })}
        </Box>
      ) : <Box component="small" sx={{ color: 'text.secondary' }}>Ya no quedan días esta semana para pasarlo.</Box>}
      <Button color="secondary" onClick={() => { alternarDescanso(f); toast('Volvió ' + d.nombre + ' al ' + nombreDia(f)); }} sx={{ justifySelf: 'start', minHeight: 40 }}>Quitar el descanso</Button>
    </Box>
  );
}

// ---------- Arriba del Gym: los descansos de la semana y el aviso ----------
export function DescansosSemana({ sem }: { sem: number }) {
  usarEstado();
  const x = descansosSemana(sem) as Fin, sug = sem === semanaActual() ? sugerirDescanso() as Fin : null;
  const lista = (l: string[]) => l.map(nombreDia).join(', ');
  return (
    <>
      {sug ? (
        <Box data-t="sugerir-descanso" sx={MORADO}>
          <span><Box component="b" sx={{ color: tokens.moradoInk }}>🛌 Llevas {sug.dias} días seguidos con gym o fútbol.</Box> El músculo crece cuando descansas: 1 o 2 días libres por semana te hacen rendir más, sobre todo con 2 partidos.</span>
          <Button onClick={() => { alternarDescanso(sug.cuando); toast('🛌 ' + hoyOno(sug.cuando) + ' descansas'); }} sx={{ justifySelf: 'start', minHeight: 44 }}>🛌 Descansar {hoyOno(sug.cuando)}{sug.juegaEse ? ' (del gym; el partido sigue)' : ''}</Button>
        </Box>
      ) : null}
      <Desplegable titulo={<>🛌 <b>Descansos:</b> {x.descanso.length ? lista(x.descanso) : 'ninguno'}{x.futbol.length ? ' · ⚽ ' + lista(x.futbol) : ''}</>} sx={{ mb: '10px' }}>
        <Box sx={{ display: 'grid', gap: '6px', fontSize: 14 }}>
          <span>Esta semana tienes <b>{x.descanso.length}</b> {x.descanso.length === 1 ? 'día libre' : 'días libres'} sin gym ni fútbol{x.marcados.length ? ' (' + x.marcados.length + ' marcado' + (x.marcados.length > 1 ? 's' : '') + ' a mano)' : ''}.{x.descanso.length === 0 ? ' Busca al menos uno: sin descanso, la fatiga se acumula y rindes menos.' : ''}</span>
          <b>Qué hacer un día de descanso</b>
          <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '2px' }}>
            <li>Caminar 30-45 minutos: suma pasos y ayuda a recuperar las piernas del fútbol.</li>
            <li>10 minutos de movilidad o estiramientos (⚡ Energía tiene ideas).</li>
            <li>Come tu plan de descanso: la proteína igual, menos carbos.</li>
            <li>Duerme 7 horas o más: ahí se repara el músculo.</li>
          </Box>
          <Box component="small" sx={{ color: 'text.secondary' }}>Para descansar un día de gym, ábrelo y toca 🛌 Descansar: puedes pasar ese entreno a otro día de la semana.</Box>
        </Box>
      </Desplegable>
    </>
  );
}
