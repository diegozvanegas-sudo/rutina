// 🏋️ Gym → 📆 12 semanas y 🏠 En casa. React pinta; empezar, revisar, reiniciar y anotar son las acciones de
// src/vistas/plan12.js (p12-…, casa-…). Empezar y guardar la revisión leen sus campos de la pantalla (name=…): por eso esos
// botones llevan data-accion y los despacha main.js con el botón de verdad.
import { useEffect, type ReactNode } from 'react';
import { Box, Button, ButtonBase } from '@mui/material';
import { hayFutbol, semanaActual } from '../../estado.js';
import { iso, fechaCorta, sumarDias, diasEntre, lunesDe } from '../../fechas.js';
import { plan12 as datosPlan, FASES, FIJO, SEMANAS_PLAN, semanaPlan, faseDe, proximoLunes, REVISIONES, PRUEBAS, tocaRevision, pruebaDeSemana, avancePruebas, ultimaCintura,
  CASA, tipoCasaDe, sesionCasa, casaHecha, ultimoCasa, tocaSubir, nivelDe } from '../../plan12.js';
import { verCasa, enfocarSiguienteCasa } from '../../vistas/plan12.js';
import { tokens } from '../tema';
import { Campo, CampoLista } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { Nota } from '../ui/Textos';
import { Avance } from '../ui/Varios';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const f1 = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
// La tarjeta se abre y se cierra tocando el título, con la misma clave de antes (el título sin números)
const Tarjeta = ({ titulo, lado, children }: { titulo: string; lado?: ReactNode; children: ReactNode }) => (
  <TarjetaPlegable vista="gym" clave={titulo} titulo={titulo} lado={lado}><Box sx={{ display: 'grid', gap: '10px', '& p': { m: 0 } }}>{children}</Box></TarjetaPlegable>
);
const DOS = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };
const Suave = ({ accion, children }: { accion: string; children: ReactNode }) => (
  <Button variant="text" data-accion={accion} sx={{ minHeight: 44, p: '8px 6px', color: 'text.secondary', fontWeight: 400, fontSize: 14, '&:hover': { bgcolor: tokens.surface2, color: 'text.primary' } }}>{children}</Button>
);

// ---------- 📆 12 semanas ----------
function empezar() {
  const p = datosPlan() as Fin, lunes = proximoLunes();
  return (
    <Box data-plan12=""><Tarjeta titulo="📆 Plan de 12 semanas">
      <p>Bajar grasa y ganar músculo a la vez, con tu rutina del gym o con la versión en casa. No cambia tu rutina ni tu dieta: les pone fases, revisiones y una meta de peso realista.</p>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '8px' }}>
        {(FASES as Fin[]).map((f) => <Box component="li" key={f.id} sx={{ display: 'grid', gap: '2px', p: '8px 12px', borderRadius: '12px', bgcolor: tokens.surface2 }}><b>Semana {f.desde}{f.hasta > f.desde ? '-' + f.hasta : ''} · {f.nombre}</b><span>{f.gym}</span></Box>)}
      </Box>
      <Box sx={DOS}>
        <Campo etiqueta="Edad" type="number" inputMode="numeric" min={14} max={90} name="edad" defaultValue={p.edad} />
        <CampoLista etiqueta="Sexo" name="sexo" defaultValue={p.sexo !== 'M' ? 'H' : 'M'} opciones={[['H', 'Hombre'], ['M', 'Mujer']]} />
      </Box>
      <Campo etiqueta="Empieza el" type="date" name="inicio" defaultValue={lunes} />
      <Nota sx={{ m: 0 }}>Mejor un lunes. Ese día pésate y haz la prueba de la semana 1: es tu punto de partida.</Nota>
      <Button fullWidth data-accion="p12-empezar">Empezar el plan</Button>
    </Tarjeta></Box>
  );
}

// ⚙️ Cuándo empieza el plan y tus datos: otra fecha, el lunes que viene, con la semana del gym o "voy en la semana N"
function Ajustes({ p, s }: { p: Fin; s: number | null }) {
  const lunes = proximoLunes() as string, gym = lunesDe(semanaActual()) as string;
  const chico = { minHeight: 44 };
  return (
    <Desplegable titulo="⚙️ Cuándo empieza y tus datos">
      <Box data-t="p12-ajustes" sx={{ display: 'grid', gap: '10px' }}>
        <Nota sx={{ m: 0 }}>Muévelo cuando quieras: no se borran tus revisiones ni lo anotado en casa. Empieza el <b>{fechaCorta(p.inicio)}</b>{s != null ? <> · hoy vas en la semana <b>{Math.min(s, SEMANAS_PLAN)}</b>{s > SEMANAS_PLAN ? ' (terminado)' : ''}</> : null}.</Nota>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Button color="secondary" data-accion="p12-inicio" data-cual="lunes" sx={chico}>Empezar el lunes que viene ({fechaCorta(lunes)})</Button>
          {gym !== p.inicio ? <Button color="secondary" data-accion="p12-inicio" data-cual="gym" sx={chico}>Con la semana {semanaActual()} del gym ({fechaCorta(gym)})</Button> : null}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'end' }}>
          <CampoLista etiqueta="Voy en la semana" name="vaEn" defaultValue={String(Math.max(1, Math.min(SEMANAS_PLAN, s || 1)))} opciones={Array.from({ length: SEMANAS_PLAN }, (_, i) => [String(i + 1), 'Semana ' + (i + 1) + ' · ' + (faseDe(i + 1) as Fin).nombre] as [string, string])} />
          <Button color="secondary" data-accion="p12-inicio" data-cual="semana" sx={chico}>Poner</Button>
        </Box>
        <Box sx={DOS}>
          <Campo etiqueta="Empieza el" type="date" name="inicio" defaultValue={p.inicio} />
          <Campo etiqueta="Peso al empezar (kg)" type="number" inputMode="decimal" step="0.1" name="pesoInicio" defaultValue={p.pesoInicio ?? ''} />
          <Campo etiqueta="Edad" type="number" inputMode="numeric" min={14} max={90} name="edad" defaultValue={p.edad} />
          <CampoLista etiqueta="Sexo" name="sexo" defaultValue={p.sexo !== 'M' ? 'H' : 'M'} opciones={[['H', 'Hombre'], ['M', 'Mujer']]} />
        </Box>
        <Button data-accion="p12-inicio" data-cual="datos" sx={chico}>Guardar fecha y datos</Button>
      </Box>
    </Desplegable>
  );
}

function formularioPrueba(semana: number) {
  const cintura = ultimaCintura();
  return (
    <Box data-prueba-plan="" sx={{ display: 'grid', gap: '8px' }}>
      <Desplegable titulo={'📝 Revisión de la semana ' + semana} abiertoAlInicio>
        <Box sx={{ display: 'grid', gap: '8px' }}>
          <Nota sx={{ m: 0 }}>Descansado y antes de entrenar. Cada prueba, hasta que la técnica se rompa. Tómate también una foto de frente y de lado con la misma luz.</Nota>
          <Box sx={DOS}>
            {(PRUEBAS as [string, string, string][]).map(([k, nombre, unidad]) => (
              <Campo key={k} etiqueta={nombre + ' (' + unidad + ')'} type="number" inputMode="decimal" min={0} step={unidad === 'cm' ? '0.5' : '1'} name={k} defaultValue={k === 'cintura' && cintura ? cintura : undefined} />
            ))}
          </Box>
          <Button fullWidth data-accion="p12-prueba" data-semana={semana}>Guardar revisión</Button>
        </Box>
      </Desplegable>
    </Box>
  );
}

function resumenPruebas() {
  const p = datosPlan() as Fin, l = [...(p.pruebas || [])].sort((a: Fin, b: Fin) => a.semana - b.semana);
  if (!l.length) return null;
  const av = avancePruebas(p) as Fin[], celda = { p: '6px 8px', borderBottom: '1px solid', borderColor: 'divider', textAlign: 'left', whiteSpace: 'nowrap' };
  return (
    <>
      <Box component="h3" sx={{ m: 0, fontSize: 17 }}>Revisiones</Box>
      <Box sx={{ overflowX: 'auto' }}>
        <Box component="table" sx={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, '& td': { fontVariantNumeric: 'tabular-nums' } }}>
          <thead><tr><Box component="th" sx={celda}>Prueba</Box>{l.map((x: Fin) => <Box component="th" key={x.semana} sx={celda}>S{x.semana}</Box>)}</tr></thead>
          <tbody>
            {(PRUEBAS as [string, string, string][]).map(([k, nombre, unidad]) => (
              <tr key={k}><Box component="th" sx={celda}>{nombre}</Box>{l.map((x: Fin) => <Box component="td" key={x.semana} sx={celda}>{x[k] > 0 ? f1(x[k]) + (unidad === 'reps' ? '' : ' ' + unidad) : '—'}</Box>)}</tr>
            ))}
          </tbody>
        </Box>
      </Box>
      {av.length > 0 && <Nota sx={{ m: 0 }}>Desde la primera: {av.map((x) => x.nombre.toLowerCase() + ' ' + (x.dif > 0 ? '+' : '') + f1(x.dif) + (x.unidad === 'reps' ? '' : ' ' + x.unidad)).join(' · ')}.</Nota>}
    </>
  );
}

// estado: se pide para que la pantalla se repinte con cada cambio (los datos se leen de plan12.js)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function plan12(_estado: Fin, hoy = iso()) {
  const p = datosPlan() as Fin;
  if (!p.inicio) return empezar();
  const s = semanaPlan(p, hoy) as number | null;
  // Al lado del título, cuánto falta: se ve aunque la tarjeta esté plegada
  const faltan = s == null ? diasEntre(hoy, p.inicio) as number : 0;
  if (s == null) return (
    <Tarjeta titulo="📆 Plan de 12 semanas" lado={<Box component="small" sx={{ color: 'primary.main', fontWeight: 700, whiteSpace: 'nowrap' }}>{faltan <= 1 ? 'Empieza mañana' : 'Empieza en ' + faltan + ' días'}</Box>}>
      <p>Empieza el <b>{fechaCorta(p.inicio)}</b>. Ese día pésate y haz la revisión de la semana 1.</p>
      <Ajustes p={p} s={null} />
      <Suave accion="p12-reiniciar">Reiniciar el plan</Suave>
    </Tarjeta>
  );
  const fin = s > SEMANAS_PLAN, f = faseDe(Math.min(s, SEMANAS_PLAN)) as Fin, revision = !fin && tocaRevision(s) && !pruebaDeSemana(s), prox = (REVISIONES as number[]).find((n) => n >= s && !pruebaDeSemana(n));
  return (
    <Tarjeta titulo={'📆 ' + (fin ? 'Plan terminado' : 'Semana ' + s + ' de ' + SEMANAS_PLAN)} lado={f ? <b>{f.nombre}</b> : null}>
      <Box sx={{ '& [role=progressbar]': { m: 0 } }}><Avance parte={Math.min(1, s / SEMANAS_PLAN)} /></Box>
      <Box component="ol" aria-label="Semanas" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '4px' }}>
        {Array.from({ length: SEMANAS_PLAN }, (_, i) => {
          const n = i + 1, fa = faseDe(n) as Fin, actual = n === s;
          return (
            <Box component="li" key={n} title={fa.nombre} sx={{ position: 'relative', display: 'grid', placeItems: 'center', height: 34, borderRadius: '8px', fontSize: 13, fontWeight: 700, border: '1px solid',
              borderStyle: fa.id === 'descarga' ? 'dashed' : 'solid', borderColor: actual ? 'primary.main' : 'divider', color: actual ? 'text.primary' : 'text.secondary',
              bgcolor: n < s ? tokens.surface2 : 'transparent', boxShadow: actual ? 'inset 0 0 0 1px ' + tokens.brand : 'none' }}>
              {n}{(REVISIONES as number[]).includes(n) ? <Box component="small" sx={{ position: 'absolute', top: -8, right: -4, fontSize: 10 }}>📝</Box> : null}
            </Box>
          );
        })}
      </Box>
      {fin
        ? <><p>Terminaste las 12 semanas. Haz la última revisión si te falta y compárala con la primera: eso decide si repites con más carga o pasas a mantener.</p>{!pruebaDeSemana(12) ? formularioPrueba(12) : null}</>
        : <>
            <Box sx={{ display: 'grid', gap: '8px', p: '10px 12px', borderRadius: '12px', bgcolor: tokens.surface2 }}>
              <p><b>🏋️ Gym:</b> {f.gym} <Box component="small" sx={{ color: 'text.secondary' }}>(RIR {f.rir})</Box></p>
              <p><b>🏠 En casa:</b> {f.casa}</p>
              <p><b>🥗 Comida:</b> {f.dieta}</p>
            </Box>
            {revision ? formularioPrueba(s) : prox ? <Nota sx={{ m: 0 }}>Próxima revisión: semana {prox} ({fechaCorta(sumarDias(p.inicio, (prox - 1) * 7))}).</Nota> : null}
          </>}
      {resumenPruebas()}
      <Desplegable titulo="Lo que no cambia en las 12 semanas">
        <Box component="ul" sx={{ m: '0 0 8px', pl: '20px', display: 'grid', gap: '4px' }}>{(FIJO as string[]).map((t) => <li key={t}>{t}</li>)}</Box>
        <Nota>RIR = repeticiones que te guardas en la última serie. RIR 2: paras cuando todavía te salen 2 limpias.</Nota>
      </Desplegable>
      <Ajustes p={p} s={s} />
      <Nota sx={{ m: 0 }}>Empezó el {fechaCorta(p.inicio)}{p.pesoInicio ? ' con ' + f1(p.pesoInicio) + ' kg' : ''}. <Suave accion="p12-reiniciar">Reiniciar el plan</Suave></Nota>
    </Tarjeta>
  );
}

// ---------- 🏠 En casa ----------
// Después de anotar, el cursor queda en el siguiente ejercicio (lo pide plan12.js)
function Enfocar() { useEffect(() => { enfocarSiguienteCasa(); }); return null; }

function ejerciciosCasa(fecha: string, tipo: string) {
  const ses = sesionCasa(fecha) as Fin, dia = (CASA as Fin)[tipo], toca = ((dia.ejercicios as Fin[]).find((x) => !ses[x.id]) || {}).id, { manualCasa } = verCasa() as Fin;
  return (
    <>
      <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '6px' }}>
        {(dia.ejercicios as Fin[]).map((x) => {
          const n = nivelDe(x) as number, ult = ultimoCasa(x.id, fecha) as Fin, reps = ses[x.id] || '', sube = tocaSubir(x, reps) || (!reps && ult && tocaSubir(x, ult.reps));
          const abierto = x.id in manualCasa ? manualCasa[x.id] : x.id === toca, subeYa = sube && n < x.escalera.length - 1;
          const fila = (
            <ButtonBase data-accion="casa-abrir" data-id={x.id} aria-expanded={abierto}
              sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto 14px', alignItems: 'center', gap: '10px', width: '100%', minHeight: abierto ? 40 : 52, p: abierto ? 0 : '6px 10px', borderRadius: '10px', color: 'text.primary', font: 'inherit', textAlign: 'left',
                '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
              <Box component="span" sx={{ display: 'grid', gap: '2px', minWidth: 0 }}><b>{x.nombre}</b><Box component="small" sx={{ color: 'text.secondary', fontSize: 13 }}>{(n + 1) + '. ' + x.escalera[n]}{reps ? '' : ult ? ' · la vez pasada ' + ult.reps : ''}</Box></Box>
              <Box component="span" sx={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', color: reps ? 'primary.main' : 'text.secondary' }}>{reps ? '✓ ' + reps : x.series + ' × ' + x.reps}</Box>
              <Box component="span" aria-hidden="true" sx={{ color: 'text.secondary' }}>{abierto ? '▾' : '▸'}</Box>
            </ButtonBase>
          );
          const borde = !abierto ? (reps ? tokens.brand : subeYa ? tokens.azul : tokens.line) : x.id === toca ? tokens.amarillo : tokens.line;
          return (
            <Box component="li" key={x.id} data-ancla={'casa-' + x.id}
              sx={{ display: 'grid', gap: '6px', p: abierto ? '10px 12px' : 0, borderRadius: '12px', bgcolor: tokens.surface2, borderLeft: '4px solid', borderLeftColor: borde, boxShadow: abierto && x.id === toca ? '0 0 0 1px ' + tokens.brand : 'none' }}>
              {fila}
              {abierto && <>
                <CampoLista etiqueta="Variante" data-cambio="casa-nivel" data-id={x.id} defaultValue={String(n)} opciones={(x.escalera as string[]).map((v, i) => [String(i), (i + 1) + '. ' + v])} />
                {x.nota ? <Nota sx={{ m: 0 }}>{x.nota}</Nota> : null}
                <Campo etiqueta="Reps de cada serie" data-solo="reps" enterKeyHint="done" data-cambio="casa-reps" data-id={x.id} defaultValue={reps} placeholder={ult ? ult.reps : 'Ej.: 10 9 8'} />
                {ult ? <Nota sx={{ m: 0 }}>La vez pasada ({fechaCorta(ult.fecha)}): {ult.reps}</Nota> : null}
                {subeYa ? <Box component="p" sx={{ color: 'warning.main', m: 0 }}>⬆️ Llegaste al tope en todas las series: la próxima, «{x.escalera[n + 1]}».</Box> : null}
              </>}
            </Box>
          );
        })}
      </Box>
      {casaHecha(fecha)
        ? <Box component="p" sx={{ fontSize: 20, fontWeight: 700, m: 0 }}>✅ Sesión en casa anotada: cuenta como día de gym.</Box>
        : <Nota sx={{ m: 0 }}>Anota las reps al terminar cada ejercicio. Con una sola anotada, el día cuenta como entrenado.</Nota>}
      <Enfocar />
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function casa(_estado: Fin, fecha = iso()) {
  const { tipoVista } = verCasa() as Fin, deHoy = tipoCasaDe(fecha) as string | null, tipo: string = tipoVista || (sesionCasa(fecha) as Fin).tipo || deHoy || 'torso';
  const f = faseDe(Math.min((semanaPlan() as number) || 1, SEMANAS_PLAN)) as Fin, futbol = hayFutbol(fecha) ? 'Hoy' : hayFutbol(sumarDias(fecha, 1)) ? 'Mañana' : '';
  return (
    <Tarjeta titulo="🏠 Entreno en casa">
      <Nota sx={{ m: 0 }}>Solo barra, paralelas y piso. Mismo día que el gym, con peso corporal. {deHoy ? <>Hoy en el gym tocaba <b>{(CASA as Fin)[deHoy].nombre.toLowerCase()}</b>.</> : 'Hoy no toca gym: si entrenas, que sea torso o pierna suave.'}</Nota>
      <Box role="group" aria-label="Día en casa" sx={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', pb: '2px' }}>
        {Object.entries(CASA as Fin).map(([k, x]: [string, Fin]) => {
          const si = k === tipo;
          return <Button key={k} data-accion="casa-tipo" data-t={k} aria-pressed={si} color={si ? 'primary' : 'secondary'} sx={{ flex: 'none', borderRadius: 999, minHeight: 40, p: '6px 14px', fontSize: 14 }}>{x.nombre.split(' (')[0]}</Button>;
        })}
      </Box>
      {f ? <Nota sx={{ m: 0 }}><b>{f.nombre} (RIR {f.rir}):</b> {f.casa}</Nota> : null}
      {futbol && tipo === 'pierna' ? <Box component="p" sx={{ color: 'warning.main', m: 0 }}>⚽ {futbol} juegas fútbol: 3 series en vez de 4 y deja 2-3 reps en reserva. Las piernas tienen que llegar frescas a la cancha.</Box> : null}
      {ejerciciosCasa(fecha, tipo)}
    </Tarjeta>
  );
}
