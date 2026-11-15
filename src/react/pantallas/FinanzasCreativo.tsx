// 💰 Finanzas → 🛟 Plan B → 💡 Módulo 3: Despertar creativo. Los puntos de la guía de Comfama, cada uno en una tarjeta que
// se abre y cierra: responder, el reto de 3 días, el cronómetro de 7 segundos para dibujar y las soluciones simples.
// React pinta; guardar y marcar son las acciones de src/vistas/creativo.js (cr-…).
import { useEffect, useRef, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { iso, fechaCorta } from '../../fechas.js';
import { toast as avisar } from '../../ui.js';
import { planDe } from '../../desempleo.js';
import { creativoDe, avanceReto, avanceCreativo, PREGUNTAS_RUTINA, IDEAS_RETO, HERRAMIENTAS_NINO, NORMAS_EJEMPLO, CONCLUSIONES } from '../../creativo.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo, CampoSolo } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { Nota } from '../ui/Textos';
import { Cifras, Avance, Marcable } from '../ui/Varios';
import { VISTA, Punto, Guia, Pasos, Vinetas, Caja, Enlace, Compartir, Sub, Etiquetas } from './planbPiezas';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const toast = avisar as (mensaje: string) => void;
const T0 = '💡 Módulo 3: Despertar creativo';

// 7 segundos para dibujar: cuenta en el mismo botón (no guarda nada)
function Siete() {
  const [n, poner] = useState<number | null>(null), [fin, ponerFin] = useState<'' | 'tiempo' | 'otra'>('');
  const reloj = useRef<ReturnType<typeof setInterval> | null>(null), espera = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (reloj.current) clearInterval(reloj.current); if (espera.current) clearTimeout(espera.current); }, []);
  const empezar = () => {
    if (reloj.current) return;
    let k = 7;
    poner(k); ponerFin('');
    reloj.current = setInterval(() => {
      k--; poner(k);
      if (k > 0) return;
      clearInterval(reloj.current!); reloj.current = null;
      poner(null); ponerFin('tiempo');
      if (navigator.vibrate) try { navigator.vibrate(200); } catch (err) { /* sin vibración */ }
      toast('⏱️ ¡Tiempo! Ahora escribe qué sentiste');
      espera.current = setTimeout(() => ponerFin('otra'), 2500);
    }, 1000);
  };
  const corriendo = n != null && n > 0;
  return (
    <Button data-t="siete" onClick={empezar} sx={[{ m: '4px 0 10px', fontVariantNumeric: 'tabular-nums' }, corriendo && { bgcolor: 'warning.main', color: tokens.amarilloInk, '&:hover': { bgcolor: 'warning.main' } }]}>
      {corriendo ? '✏️ ¡Dibuja! ' + n : fin === 'tiempo' ? '✓ ¡Tiempo!' : fin === 'otra' ? '⏱️ Otra vez los 7 segundos' : '⏱️ Empezar los 7 segundos'}
    </Button>
  );
}

export function creativo(estado: Fin) {
  const c = creativoDe(planDe(estado.finanzas)) as Fin, av = avanceCreativo(c) as Fin, ar = avanceReto(c) as Fin, hoy = iso();
  const texto = (k: string, titulo: string, ayuda: string, filas = 3) => <CampoLargo key={k} etiqueta={titulo} filas={filas} data-cambio="cr-texto" data-k={k} defaultValue={c.textos[k] || ''} placeholder={ayuda} />;
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave={T0} titulo={T0}>
        <Nota>Rompe la rutina, juega como un niño, cuestiona lo de siempre y simplifica. Cada punto se abre y cierra tocando su título.</Nota>
        <Cifras datos={[{ titulo: 'Puntos hechos', valor: av.hechos + ' / ' + av.total }, { titulo: 'Reto de 3 días', valor: ar.hechos + ' / 3' }]} />
        <Avance parte={av.hechos / av.total} />
        <Pasos pasos={av.pasos} />
      </TarjetaPlegable>

      <Punto n={1} titulo="Reflexiona sobre tu rutina">
        <Guia>Tu vida está llena de <b>hábitos</b> y <b>patrones</b> que has construido con el tiempo. Las rutinas te dan estabilidad y comodidad, pero también pueden volverse límites invisibles que reducen tu experiencia.</Guia>
        <Guia><b>Pregúntate:</b></Guia>
        <Box sx={{ display: 'grid', gap: '8px' }}>{(PREGUNTAS_RUTINA as [string, string][]).map(([k, p]) => texto(k, p, 'Tu respuesta', 1))}</Box>
        <Guia><b>El reto:</b> durante los próximos 3 días, haz al menos <b>una actividad diferente cada día</b>. Toca una idea o escribe la tuya, y márcala cuando la hagas.</Guia>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '8px', my: '8px' }}>
          {(c.reto as Fin[]).map((d, i) => (
            <Caja key={i} marcado={d.fecha ? 'verde' : null} sx={d.fecha ? { bgcolor: 'color-mix(in srgb, ' + tokens.verde + ' 10%, ' + tokens.surface2 + ')' } : null}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b>Día {i + 1}</b>
                {d.fecha ? <Box component="small" sx={{ color: 'success.main', fontWeight: 700 }}>✓ {d.fecha === hoy ? 'hoy' : fechaCorta(d.fecha)}</Box> : null}
              </Box>
              <CampoSolo noVaciar aria-label={'Actividad del día ' + (i + 1)} data-cambio="cr-reto" data-i={i} defaultValue={d.actividad || ''} placeholder="¿Qué vas a hacer distinto?" />
              {d.actividad || d.fecha ? null : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {(IDEAS_RETO as string[]).filter((x) => !c.reto.some((o: Fin) => o.actividad === x)).slice(0, 4).map((x) => (
                    <Button key={x} size="small" color="secondary" onClick={() => accion('cr-idea', { i, v: x })}
                      sx={{ minHeight: 32, p: '4px 10px', borderRadius: 999, fontWeight: 400, fontSize: 13, lineHeight: 1.3, textAlign: 'left', justifyContent: 'flex-start' }}>{x}</Button>
                  ))}
                </Box>
              )}
              <Box sx={{ '& > button': { mb: 0 } }}><Marcable hecho={!!d.fecha} alTocar={() => accion('cr-hecho', { i })}>Lo hice</Marcable></Box>
            </Caja>
          ))}
        </Box>
        <Nota>{ar.hechos} de 3 días{ar.mismoDia ? ' · ⚠️ dos quedaron el mismo día: la idea es uno distinto cada día' : ''}</Nota>
        {ar.completo ? null : <Desplegable titulo="💡 Más ideas"><Nota>{(IDEAS_RETO as string[]).join(' · ')}</Nota></Desplegable>}
        {texto('reto', '✍️ Al final de los 3 días: ¿cómo afectaron estas pequeñas acciones tu forma de pensar o de ver el mundo?', 'Un párrafo: qué notaste, qué te sorprendió, qué te costó…', 4)}
      </Punto>

      <Punto n={2} titulo="Potencia tu creatividad">
        <Sub n="2.1">Ejercicio de imaginación infantil</Sub>
        <Guia><b>Reflexiona</b> sobre las herramientas que los niños usan naturalmente:</Guia>
        <Etiquetas items={HERRAMIENTAS_NINO as string[]} />
        <Guia><b>Cierra los ojos</b> e imagina que eres un niño de 5 años. Piensa en algo que te parezca mágico o increíble (pilotear una nave espacial, montar un unicornio, alimentar un dinosaurio).</Guia>
        {texto('magico', '🦄 Lo que imaginé', 'Ej.: alimentar un dinosaurio en el patio de mi casa', 1)}
        <Guia><b>Dibuja</b> esa idea en una hoja de papel en 7 segundos. No te preocupes por hacerlo perfecto: el objetivo es expresarte sin restricciones.</Guia>
        <Siete />
        {texto('sentir', '✍️ ¿Qué sentiste? ¿Te resultó fácil o difícil? ¿Qué aprendiste sobre tu creatividad?', 'Escribe brevemente', 3)}
        <Sub n="2.2">Aceptación de la diversidad de pensamiento</Sub>
        <Guia>Cuestionar el <i>statu quo</i> abre nuevas posibilidades. Piensa (solo o en grupo) en una <b>idea innovadora que desafíe una norma común</b>. Por ejemplo:</Guia>
        <Vinetas items={NORMAS_EJEMPLO as string[]} />
        {texto('norma', '💭 Mi idea que desafía una norma', 'Ej.: ¿cómo sería un banco donde los intereses los pusiera el cliente?', 3)}
        <Nota>Si la discutes con otros, acepta sus opiniones sin juzgarlas. Recuerda: «Si no tienes nada bueno que decir de una idea, es mejor que no digas nada».</Nota>
        {texto('perspectiva', '✍️ ¿Cómo te ayudó esta actividad a ver las cosas desde otra perspectiva? ¿Qué aprendiste de las ideas de los demás?', 'Un párrafo', 3)}
        <Sub n="2.3">Simplificación creativa</Sub>
        <Guia>Muchas soluciones creativas vienen de <b>simplificar problemas complejos</b> (una caja para organizar cables en vez de organizadores costosos, un horario semanal para no olvidar tareas).</Guia>
        <Campo etiqueta="🧩 Un problema cotidiano que enfrentas" data-cambio="cr-texto" data-k="problema" defaultValue={c.textos.problema || ''} placeholder="Ej.: se me va el tiempo en tareas de la casa" />
        <Guia>Propón al menos <b>3 soluciones simples</b> y elige una con la ⭐:</Guia>
        <Box sx={{ display: 'grid', gap: '6px', my: '6px' }}>
          {(c.soluciones as string[]).map((s, i) => {
            const si = c.elegida === i;
            return (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: '30px minmax(0, 1fr) 44px', gap: '6px', alignItems: 'center' }}>
                <Box component="span" sx={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: '50%', bgcolor: tokens.surface2, fontWeight: 700, fontSize: 13 }}>{i + 1}</Box>
                <CampoSolo noVaciar aria-label={'Solución ' + (i + 1)} data-cambio="cr-sol" data-i={i} defaultValue={s || ''} placeholder={'Solución ' + (i + 1)}
                  sx={si ? { '& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'warning.main' } } : undefined} />
                <IconButton aria-pressed={si} aria-label={'Elegir la solución ' + (i + 1)} onClick={() => accion('cr-elegir', { i })} sx={{ fontSize: 20, color: si ? undefined : 'text.secondary' }}>{si ? '⭐' : '☆'}</IconButton>
              </Box>
            );
          })}
        </Box>
        <Enlace onClick={() => accion('cr-sol-mas')}>＋ Otra solución</Enlace>
        <Box sx={{ display: 'grid', gap: '8px', mt: '8px' }}>
          {texto('porque', '✅ ¿Por qué crees que la elegida es efectiva?', 'Explica en pocas líneas', 2)}
          {texto('ayudo', '✍️ ¿Cómo te ayudó el proceso de simplificar a ser más creativo?', 'Un párrafo', 2)}
        </Box>
      </Punto>

      <Punto n={3} titulo="Conclusiones">
        <Guia>Responde en un párrafo:</Guia>
        <Box sx={{ display: 'grid', gap: '8px' }}>{(CONCLUSIONES as [string, string][]).map(([k, p]) => texto(k, p, 'Tu respuesta', 3))}</Box>
        <Compartir enviar="cr-enviar" copiar="cr-copiar" />
      </Punto>
    </>
  );
}
