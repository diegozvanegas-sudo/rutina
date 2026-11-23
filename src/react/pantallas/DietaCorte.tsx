// 🔥 Corte agresivo (Dieta): lo que pide cada día, cómo quedarían tus planes (antes → después) y, con confirmación, recalcula todos
// los planes. Mientras dura: semana, días que faltan, kg bajados, el ritmo real contra el 0,75-1 % por semana y "Terminar el corte"
// (vuelven tus macros de antes, recalculadas con tu peso de ese día). Las reglas están en src/corte.js.
import { useState, type ReactNode } from 'react';
import { Box, Button, Card } from '@mui/material';
import { e as estado, guardar } from '../../estado.js';
import { iso, fechaCorta } from '../../fechas.js';
import { totalPlan, pesos } from '../../dieta.js';
import { CORTE, planCorte, empezarCorte, terminarCorte, estadoCorte, promedioSemana } from '../../corte.js';
import { ritmoReal } from '../../meta-peso.js';
import { miles, toast } from '../../ui.js';
import { pesoActual, TIPOS_PLAN } from '../../vistas/dieta.js';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Nota } from '../ui/Textos';
import { Avance, Cifras } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'dieta';
const TIPOS = TIPOS_PLAN as Record<string, string>;
const r0 = (n: number) => Math.round(n || 0);
const f1 = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const Rojo = ({ children }: { children: ReactNode }) => (
  <Box component="p" role="alert" sx={{ color: tokens.rojoSuave, bgcolor: tokens.rojoFondo, border: '1px solid', borderColor: tokens.rojo, borderRadius: '10px', p: '8px 10px', fontSize: 14, my: '8px' }}>{children}</Box>
);

// Una fila por día: kcal de antes → después y los macros nuevos
function Tabla({ resultados }: { resultados: Fin[] }) {
  return (
    <Box component="ul" data-t="corte-tabla" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '6px' }}>
      {resultados.map(([t, r]: Fin) => (
        <Box component="li" key={t} sx={{ p: '8px 10px', borderRadius: '10px', bgcolor: tokens.surface2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <b>{TIPOS[t] || t}</b>
            <span>{r.antes ? <Box component="s" sx={{ color: 'text.secondary', mr: '6px' }}>{miles(r0(r.antes.kcal))}</Box> : null}<b>{miles(r0(r.despues.kcal))} kcal</b></span>
          </Box>
          <Box component="small" sx={{ color: 'text.secondary' }}>P {r0(r.despues.p)} g · C {r0(r.despues.c)} g · G {r0(r.despues.g)} g</Box>
        </Box>
      ))}
    </Box>
  );
}

function ritmoTexto(ritmo: number | null, peso: number) {
  if (ritmo == null) return { texto: 'Pésate al menos 4 días por semana: con 2 semanas de datos te digo si vas al ritmo.', rojo: false };
  const baja = -ritmo, pct = (baja / peso) * 100;
  const n = f1(baja) + ' kg por semana (' + f1(pct) + ' %)';
  if (pct > 1.1) return { texto: '🐇 Bajas ' + n + ': demasiado rápido, se va músculo. Suma 150-200 kcal de carbos alrededor del gym y del partido.', rojo: true };
  if (pct >= 0.6) return { texto: '✅ Bajas ' + n + ': es el ritmo de un corte agresivo.', rojo: false };
  if (baja > 0.1) return { texto: '🐢 Bajas ' + n + ': más lento de lo que pide el corte. Antes de recortar más, revisa que estés cumpliendo el plan (fines de semana, bebidas, picoteo).', rojo: false };
  return { texto: '⏸ El peso no baja (' + f1(-baja) + ' kg por semana). Casi siempre es comida que no se anota: 7 días anotando todo antes de tocar el plan.', rojo: true };
}

export function Corte({ e }: { e: Fin }) {
  const dt = e.dieta, hoy = iso(), peso = pesoActual() as number, [confirmar, ponerConfirmar] = useState(false);
  const lista = pesos(e.dias) as Fin[], ultimo = lista.length ? lista[lista.length - 1].peso : null;
  const st = estadoCorte(dt, hoy, ultimo) as Fin;

  if (st) {
    const k = dt.corte, r = ritmoTexto(ritmoReal(lista, hoy), peso);
    const actuales = Object.keys(CORTE.kcalKg).filter((t) => dt.planes[t]).map((t) => [t, { despues: totalPlan(dt.planes[t], dt.alimentos) }]);
    const terminar = () => {
      const x = terminarCorte(estado().dieta, peso) as Fin;
      guardar(); ponerConfirmar(false);
      toast('Corte terminado: tus planes volvieron a tus macros, con ' + f1(peso) + ' kg');
      return x;
    };
    return (
      <>
        <Card component="section" data-t="corte-activo" sx={{ mb: '14px', borderColor: st.vencido ? tokens.rojo : 'primary.main' }}>
          <Box component="h2" sx={{ m: '0 0 6px', fontSize: 18 }}>🔥 Corte agresivo · semana {st.semana} de {st.semanas}</Box>
          <Avance parte={st.parte} rojo={st.vencido} />
          <Cifras datos={[
            { titulo: 'Empezaste', valor: f1(k.peso) + ' kg', nota: fechaCorta(k.inicio) },
            { titulo: 'Bajado', valor: st.bajado == null ? '—' : f1(st.bajado) + ' kg', nota: ultimo ? 'hoy ' + f1(ultimo) + ' kg' : 'anota tu peso' },
            { titulo: st.vencido ? 'Terminó' : 'Faltan', valor: st.vencido ? fechaCorta(k.fin) : st.faltan + ' días', nota: 'hasta el ' + fechaCorta(k.fin) },
          ]} />
          {st.vencido ? <Rojo>Ya van {CORTE.semanas} semanas. Más tiempo en corte agresivo baja la fuerza, el rendimiento en el fútbol y el músculo: termínalo, come 1-2 semanas en mantenimiento y, si quieres, empieza otro.</Rojo> : null}
          {r.rojo ? <Rojo>{r.texto}</Rojo> : <Nota>{r.texto}</Nota>}
          <Box sx={{ display: 'grid', gap: '8px', mt: '8px' }}>
            {confirmar ? (
              <Box sx={{ display: 'grid', gap: '8px', p: '10px', borderRadius: '12px', bgcolor: tokens.surface2 }}>
                <Nota sx={{ m: 0 }}>Vuelven tus macros de antes del corte y los planes se recalculan con <b>{f1(peso)} kg</b>.</Nota>
                <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Button data-t="corte-terminar-si" onClick={terminar}>Sí, terminar el corte</Button>
                  <Button color="secondary" onClick={() => ponerConfirmar(false)}>Cancelar</Button>
                </Box>
              </Box>
            ) : <Button color={st.vencido ? 'primary' : 'secondary'} data-t="corte-terminar" onClick={() => ponerConfirmar(true)}>⏹ Terminar el corte</Button>}
          </Box>
        </Card>
        <TarjetaPlegable vista={VISTA} clave="🔥 Tus planes en el corte" titulo="📋 Tus planes en el corte">
          <Tabla resultados={actuales} />
          <Nota>Promedio de una semana (2 de pierna, 2 de torso, 2 de fútbol, 1 de descanso): <b>{miles(promedioSemana(dt.planes, dt.alimentos))} kcal</b>. La recarga no cambia. Puedes editar las comidas en 📋 Planes.</Nota>
        </TarjetaPlegable>
      </>
    );
  }

  const p = planCorte(dt, peso) as Fin, antes = promedioSemana(dt.planes, dt.alimentos);
  const despuesPlanes = { ...dt.planes, ...Object.fromEntries(p.resultados.map(([t, r]: Fin) => [t, r.plan])) }, despues = promedioSemana(despuesPlanes, dt.alimentos);
  const empezar = () => {
    empezarCorte(estado().dieta, peso, hoy);
    guardar(); ponerConfirmar(false); window.scrollTo(0, 0);
    toast('🔥 Corte empezado: todos tus planes quedaron recalculados');
  };
  return (
    <>
      <Card component="section" data-t="corte" sx={{ mb: '14px' }}>
        <Box component="h2" sx={{ m: '0 0 4px', fontSize: 18 }}>🔥 Corte agresivo</Box>
        <Nota>{CORTE.semanas} semanas comiendo ~25 % menos que tu mantenimiento: unos {f1(peso * 0.0075)}-{f1(peso * 0.01)} kg por semana. Con tu peso de <b>{f1(peso)} kg</b>:</Nota>
        <Box component="ul" sx={{ m: '0 0 8px', pl: '20px', display: 'grid', gap: '4px', fontSize: 15 }}>
          <li><b>Proteína ~{r0(p.objetivos.descanso.p)} g</b> todos los días ({f1(p.objetivos.descanso.p / peso)} g/kg): es lo que protege el músculo.</li>
          <li><b>Grasa ~{r0(p.objetivos.descanso.g)} g</b> (mínimo para las hormonas). La de los huevos y la carne a veces no deja bajar más: entonces se quita de los carbos.</li>
          <li><b>Carbos</b>: lo que sobra de las calorías de cada día. El fútbol come más y la recarga no se toca.</li>
        </Box>
        <Tabla resultados={p.resultados} />
        <Cifras datos={[{ titulo: 'Semana hoy', valor: miles(antes) + ' kcal', nota: 'promedio por día' }, { titulo: 'En el corte', valor: miles(despues) + ' kcal', nota: (antes ? '−' + miles(antes - despues) : '') + ' al día' }]} />
        {antes - despues < 150 ? <Nota sx={{ color: tokens.rojoSuave }}>Tus planes ya están cerca de un corte. Si tu peso no baja, lo más probable es que no estés cumpliendo el plan, no que el plan se quede corto.</Nota> : null}
        {confirmar ? (
          <Box data-t="corte-confirmar" sx={{ display: 'grid', gap: '8px', p: '10px', mt: '8px', borderRadius: '12px', bgcolor: tokens.surface2 }}>
            <Nota sx={{ m: 0 }}>Se recalculan <b>todos tus planes</b> ({p.resultados.map(([t]: Fin) => TIPOS[t]).join(', ')}) y lo que suma cada día en 🍽 Hoy. Tus macros de ahora quedan guardados: al terminar el corte vuelven.</Nota>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button size="large" data-t="corte-si" onClick={empezar}>🔥 Sí, empezar el corte</Button>
              <Button color="secondary" onClick={() => ponerConfirmar(false)}>Cancelar</Button>
            </Box>
          </Box>
        ) : <Button size="large" data-t="corte-empezar" sx={{ mt: '8px' }} onClick={() => ponerConfirmar(true)}>🔥 Empezar el corte agresivo</Button>}
      </Card>
      <TarjetaPlegable vista={VISTA} clave="🔥 Antes de empezar" titulo="⚠️ Antes de empezar">
        <Box component="ul" sx={{ m: 0, pl: '20px', display: 'grid', gap: '6px', fontSize: 15 }}>
          <li>Máximo {CORTE.semanas} semanas seguidas; después, 1-2 semanas en mantenimiento.</li>
          <li>Pésate todos los días en ayunas: la app mira el promedio y te avisa si bajas más del 1 % por semana (se va músculo) o si no bajas.</li>
          <li>Mantén las cargas del gym: si la fuerza cae más del 3 % en el mes, sube 100-200 kcal de carbos antes de entrenar.</li>
          <li>Duerme 7 horas o más: con menos sueño da más hambre y se pierde más músculo.</li>
          <li>No es para ti si tienes o tuviste un trastorno de la alimentación, diabetes con medicamento o estás en recuperación de una lesión: consúltalo antes.</li>
        </Box>
      </TarjetaPlegable>
    </>
  );
}
