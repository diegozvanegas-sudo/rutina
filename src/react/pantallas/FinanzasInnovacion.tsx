// 💰 Finanzas → 🛟 Plan B → 🚀 Módulo 4: Innovación. Siete pasos en tarjetas que se abren y cierran: tipos de innovación,
// escoger un problema con puntaje, hablar con 3 personas, ideas con SCAMPER y la matriz impacto/esfuerzo, propuesta de
// valor, prototipo y prueba barata, y conclusiones. React pinta; guardar y marcar son las acciones de src/vistas/innovacion.js (in-…).
import type { ReactNode } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { fechaCorta } from '../../fechas.js';
import { planDe } from '../../desempleo.js';
import { innovacionDe, puntaje, ranking, cuadrante, fraseValor, resultadoExperimento, avanceInnovacion, TIPOS_INNOVACION, CRITERIOS, SCAMPER, PROTOTIPOS, VEREDICTOS, pasosGuia, META_IDEAS } from '../../innovacion.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo, CampoLargoSolo, CampoSolo } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import { Cifras, Avance, Opciones } from '../ui/Varios';
import { Aviso } from './finanzasPiezas';
import { VISTA, Punto, Guia, Pasos, Vinetas, ChipSi, FilaChips, Caja, FilaCampo, Compartir } from './planbPiezas';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const T0 = '🚀 Módulo 4: Innovación', GUIA = '🧭 Explora la innovación en acción';
const LISTA = { display: 'grid', gap: '8px', my: '8px' };
const CHICO = { color: 'text.secondary', fontSize: 13 };
const Borrar = ({ nombre, alTocar }: { nombre: string; alTocar: () => void }) => <IconButton aria-label={nombre} onClick={alTocar} sx={{ fontSize: 18, color: 'error.main' }}>🗑</IconButton>;
const Estrella = ({ si, nombre, alTocar }: { si: boolean; nombre: string; alTocar: () => void }) => <IconButton aria-pressed={si} aria-label={nombre} onClick={alTocar} sx={{ fontSize: 20, color: si ? undefined : 'text.secondary' }}>{si ? '⭐' : '☆'}</IconButton>;
// Botón para agregar: verde mientras falta llegar a lo que se pide, gris después
const Agregar = ({ primario, nombre, children }: { primario: boolean; nombre: string; children: ReactNode }) => <Button color={primario ? 'primary' : 'secondary'} onClick={() => accion(nombre)} sx={{ my: '4px' }}>{children}</Button>;
const COLOR_Q: Record<string, string> = { ya: tokens.verde, plan: tokens.azul, rapida: tokens.amarillo, no: tokens.muted };

function problemas(x: Fin) {
  const top = ranking(x) as Fin[];
  return (
    <>
      <Guia>Una buena idea empieza por un <b>problema real</b>, no por un producto. Anota problemas que tú o la gente que conoces sufren (en tu barrio, en tu oficio, en tu trabajo anterior) y califica cada uno del 1 al 5.</Guia>
      <Box sx={LISTA}>
        {(x.problemas as Fin[]).map((pr, i) => {
          const p = puntaje(pr), elegido = x.elegido === pr.id;
          return (
            <Caja key={pr.id} marcado={elegido ? 'amarillo' : null}>
              <FilaCampo>
                <CampoSolo noVaciar aria-label={'Problema ' + (i + 1)} data-cambio="in-problema" data-i={i} defaultValue={pr.texto} placeholder="Ej.: no tengo tiempo para buscar empleo" />
                <Borrar nombre="Borrar el problema" alTocar={() => accion('in-problema-borrar', { i })} />
              </FilaCampo>
              {(CRITERIOS as [string, string][]).map(([k, t]) => (
                <Box key={k} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '4px 10px', alignItems: 'center' }}>
                  <Box component="small" sx={CHICO}>{t}</Box>
                  <Opciones nombre={t} chica activa={pr.notas[k] ? String(pr.notas[k]) : null} opciones={['1', '2', '3', '4', '5'].map((n) => [n, n] as [string, string])}
                    alElegir={(n) => accion('in-nota', { i, k, n })} sx={{ pb: 0 }} />
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <b>{p != null ? p + ' / 20' : 'Califica los 4'}</b>
                <ChipSi si={elegido} nombre="in-elegir" datos={{ id: pr.id }}>{elegido ? '⭐ El elegido' : 'Elegir este'}</ChipSi>
              </Box>
            </Caja>
          );
        })}
      </Box>
      <Agregar primario={!x.problemas.length} nombre="in-problema-nuevo">＋ Problema</Agregar>
      {top.length >= 2 && <Nota>🏆 El de más puntaje: <b>{top[0].texto || 'sin nombre'}</b> ({puntaje(top[0])}/20). Elige con la cabeza, pero también con el que te emocione resolver.</Nota>}
      <Nota>Lo ideal: que pase seguido, que duela, que paguen por resolverlo y que tú puedas hacerlo. Con 16 o más tienes un buen candidato.</Nota>
    </>
  );
}

function entrevistas(x: Fin) {
  const hechas = (x.entrevistas as Fin[]).filter((en) => en.aprendi && en.aprendi.trim()).length;
  return (
    <>
      <Guia>Antes de inventar, <b>pregunta</b>. Entrevista a 3 personas que tengan el problema o que <b>ya lo hayan solucionado</b>, y pregúntales por lo que <b>ya hicieron</b>, no por lo que harían:</Guia>
      <Vinetas items={['«Cuéntame la última vez que te pasó. ¿Qué hiciste?»', '«¿Cuánto te costó (plata o tiempo)?»', '«¿Qué has probado para resolverlo? ¿Por qué no te sirvió?»']} />
      <Nota>No les cuentes tu idea todavía: por amabilidad te van a decir que sí. Lo que hicieron vale más que lo que opinan.</Nota>
      <Box sx={LISTA}>
        {(x.entrevistas as Fin[]).map((en, i) => (
          <Caja key={en.id} marcado={en.aprendi ? 'verde' : null} sx={en.aprendi ? { bgcolor: 'color-mix(in srgb, ' + tokens.verde + ' 10%, ' + tokens.surface2 + ')' } : null}>
            <FilaCampo>
              <CampoSolo noVaciar aria-label={'Persona ' + (i + 1)} data-cambio="in-entrevista" data-i={i} data-k="quien" defaultValue={en.quien} placeholder="¿Con quién hablaste?" />
              <Borrar nombre="Borrar la conversación" alTocar={() => accion('in-entrevista-borrar', { i })} />
            </FilaCampo>
            <CampoLargoSolo aria-label={'Lo que aprendiste de la persona ' + (i + 1)} data-cambio="in-entrevista" data-i={i} data-k="aprendi" defaultValue={en.aprendi} placeholder="Lo que aprendiste (algo que no sabías)" />
            {en.fecha ? <Box component="small" sx={CHICO}>{fechaCorta(en.fecha)}</Box> : null}
          </Caja>
        ))}
      </Box>
      <Agregar primario={x.entrevistas.length < 3} nombre="in-entrevista-nueva">＋ Conversación</Agregar>
      <Nota>{hechas} de 3 conversaciones con aprendizaje.</Nota>
      <CampoLargo etiqueta="🔁 ¿Qué se repitió en las conversaciones?" filas={2} data-cambio="in-texto" data-k="patron" defaultValue={x.textos.patron || ''} placeholder="Ej.: a todos les preocupa más el tiempo que la plata" />
    </>
  );
}

// La matriz dibujada: cada idea en su cuadro
function matriz(x: Fin) {
  const con = (x.ideas as Fin[]).filter((i) => cuadrante(i));
  if (!con.length) return null;
  const caja = (k: string, t: string) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignContent: 'start', gap: '4px', minHeight: 76, p: '8px', borderRadius: '10px', bgcolor: tokens.surface2, border: '1px solid', borderColor: k === 'ya' ? 'success.main' : 'divider', opacity: k === 'no' ? 0.7 : 1 }}>
      <Box component="small" sx={{ width: '100%', fontWeight: 700, fontSize: 12, color: k === 'no' ? undefined : COLOR_Q[k] }}>{t}</Box>
      {con.filter((i) => (cuadrante(i) as string[])[0] === k).map((i) => (
        <Box component="span" key={i.id} sx={{ fontSize: 12, p: '2px 8px', borderRadius: 999, bgcolor: 'background.paper', outline: x.idea === i.id ? '1px solid ' + tokens.amarillo : 'none' }}>{i.texto || 'sin nombre'}</Box>
      ))}
    </Box>
  );
  const eje = { fontSize: 12, color: 'text.secondary' };
  return (
    <Box role="img" aria-label="Matriz de impacto y esfuerzo" sx={{ display: 'grid', gridTemplateColumns: '22px 1fr 1fr', gridTemplateRows: 'auto auto auto', gap: '6px', m: '12px 0 4px' }}>
      <Box component="span" sx={{ ...eje, gridColumn: 1, gridRow: '1 / 3', writingMode: 'vertical-rl', transform: 'rotate(180deg)', textAlign: 'center' }}>Impacto ↑</Box>
      {caja('ya', '🚀 Hazla ya')}{caja('plan', '🗺️ Planéala')}{caja('rapida', '🧩 Victoria pequeña')}{caja('no', '🗑️ Déjala')}
      <Box component="span" sx={{ ...eje, gridColumn: '2 / 4', textAlign: 'right' }}>Esfuerzo →</Box>
    </Box>
  );
}

function ideas(x: Fin) {
  const pr = (x.problemas as Fin[]).find((p) => p.id === x.elegido), con = (x.ideas as Fin[]).filter((i) => i.texto).length;
  return (
    <>
      {pr ? <Box component="p" sx={{ m: '0 0 10px', p: '10px 12px', borderRadius: '10px', bgcolor: tokens.surface2, fontSize: 14 }}>🧩 Problema: <b>{pr.texto}</b></Box> : <Aviso>Elige primero un problema en el punto 2.</Aviso>}
      <Guia><b>SCAMPER:</b> siete preguntas para sacar ideas de algo que ya existe. Responde las que te salgan, sin juzgar.</Guia>
      <Box sx={{ display: 'grid', gap: '6px', m: '6px 0 12px' }}>
        {(SCAMPER as [string, string, string][]).map(([k, n, q]) => (
          <Campo key={k} data-cambio="in-scamper" data-k={k} defaultValue={x.scamper[k] || ''}
            etiqueta={<span><Box component="b" sx={{ display: 'inline-grid', placeItems: 'center', width: 24, height: 24, borderRadius: '6px', bgcolor: tokens.rosa, color: tokens.rosaInk, fontSize: 13, mr: '4px' }}>{k.toUpperCase()}</Box> {n} <Box component="small" sx={{ display: 'block', color: 'text.secondary', fontSize: 12 }}>{q}</Box></span>} />
        ))}
      </Box>
      <Guia><b>10 ideas locas:</b> no te frenes: entre más raras, mejor (ej.: usar IA para crear un CV automatizado). Pueden salir del SCAMPER. Después ubícalas según su impacto y su esfuerzo y elige la mejor con la ⭐.</Guia>
      <Nota>💡 {con} de {META_IDEAS} ideas{con >= META_IDEAS ? ' ✓' : ''}</Nota>
      <Box sx={LISTA}>
        {(x.ideas as Fin[]).map((idea, i) => {
          const q = cuadrante(idea) as string[] | null, si = x.idea === idea.id;
          return (
            <Caja key={idea.id} marcado={si ? 'amarillo' : null}>
              <FilaCampo>
                <CampoSolo noVaciar aria-label={'Idea ' + (i + 1)} data-cambio="in-idea" data-i={i} defaultValue={idea.texto} placeholder={'Idea ' + (i + 1)} />
                <Estrella si={si} nombre={'Elegir la idea ' + (i + 1)} alTocar={() => accion('in-idea-elegir', { id: idea.id })} />
                <Borrar nombre="Borrar la idea" alTocar={() => accion('in-idea-borrar', { i })} />
              </FilaCampo>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', fontSize: 13, color: 'text.secondary' }}>
                {([['impacto', 'Impacto', ['alto', 'bajo']], ['esfuerzo', 'Esfuerzo', ['bajo', 'alto']]] as [string, string, string[]][]).map(([k, t, vs]) => (
                  <Box component="span" key={k} role="group" aria-label={t} sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', mr: '8px' }}>
                    <Box component="small" sx={{ minWidth: 58 }}>{t}</Box>
                    {vs.map((v) => <ChipSi key={v} si={idea[k] === v} nombre="in-idea-eje" datos={{ i, k, v }} sx={{ minWidth: 52 }}>{v}</ChipSi>)}
                  </Box>
                ))}
                {q ? <Box component="b" sx={{ fontSize: 13, p: '3px 8px', borderRadius: 999, bgcolor: 'background.paper', color: COLOR_Q[q[0]] }}>{q[1]}</Box> : null}
              </Box>
            </Caja>
          );
        })}
      </Box>
      <Agregar primario={x.ideas.length < META_IDEAS} nombre="in-idea-nueva">＋ Idea</Agregar>
      {matriz(x)}
    </>
  );
}

function valor(x: Fin) {
  const v = x.valor, f = fraseValor(v) as string, idea = (x.ideas as Fin[]).find((i) => i.id === x.idea), pr = (x.problemas as Fin[]).find((p) => p.id === x.elegido);
  const campo = (k: string, t: string, ayuda: string) => <Campo key={k} etiqueta={t} data-cambio="in-valor" data-k={k} defaultValue={v[k] || ''} placeholder={ayuda} />;
  return (
    <>
      <Guia>Una frase que diga <b>para quién</b> es, <b>qué problema</b> resuelve y <b>por qué es mejor</b> que lo que ya usan. Será el centro de tu pitch.</Guia>
      <Box sx={{ display: 'grid', gap: '8px' }}>
        {campo('cliente', 'Para (¿quién?)', 'Ej.: mamás que trabajan en el centro')}
        {campo('problema', 'que (¿qué problema tienen?)', pr ? pr.texto : 'Ej.: no tienen tiempo de cocinar entre semana')}
        {campo('solucion', 'mi solución', idea ? idea.texto : 'Ej.: un menú semanal congelado')}
        {campo('beneficio', 'le permite (¿qué gana?)', 'Ej.: comer casero en 5 minutos')}
        {campo('alternativa', 'a diferencia de (¿qué usan hoy?)', 'Ej.: los domicilios caros y poco saludables')}
      </Box>
      {f
        ? <Box component="blockquote" sx={{ m: '10px 0 0', p: '12px 14px', borderLeft: '4px solid', borderColor: 'primary.main', borderRadius: '8px', bgcolor: tokens.brandSoft, fontSize: 16, lineHeight: 1.45 }}>💬 {f}</Box>
        : <Nota>Llena al menos «para» y «mi solución» y aquí sale tu frase.</Nota>}
    </>
  );
}

function prueba(x: Fin) {
  const ex = x.experimento, r = resultadoExperimento(ex) as Fin;
  const num = (k: string, t: string) => <Campo key={k} etiqueta={t} inputMode="numeric" data-cambio="in-exp" data-k={k} data-tipo="num" defaultValue={ex[k] ?? ''} />;
  return (
    <>
      <Guia>No gastes en grande antes de saber si funciona. Haz la versión <b>más barata y rápida</b> que deje a alguien decir «sí, lo quiero» (mejor si paga o aparta).</Guia>
      <FilaChips nombre="Tipo de prototipo">{(PROTOTIPOS as [string, string][]).map(([k, t]) => <ChipSi key={k} si={x.prototipo === k} nombre="in-prototipo" datos={{ v: k }}>{t}</ChipSi>)}</FilaChips>
      <Campo etiqueta="🔬 Creo que… (tu hipótesis)" data-cambio="in-exp" data-k="hipotesis" defaultValue={ex.hipotesis || ''} placeholder="Ej.: de 10 vecinos, al menos 3 apartan el menú pagando la mitad" />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px', mt: '8px', '& label': { fontSize: 13 } }}>
        {num('personas', 'Le mostré a')}{num('si', 'Dijeron que sí / pagaron')}{num('meta', 'Mi meta era')}
      </Box>
      {r && (
        <Box sx={{ mt: '8px' }}>
          <Avance parte={Math.min(100, r.pct) / 100} />
          <Box component="p" sx={{ m: 0 }}>
            <b>{r.si} de {r.personas}</b> ({r.pct} %)
            {r.logrado === true ? <> · <Box component="b" sx={{ color: 'primary.main' }}>✓ Lograste la meta</Box></> : r.logrado === false ? <> · <Box component="b" sx={{ color: 'error.main' }}>No llegó a la meta ({r.meta})</Box></> : null}
          </Box>
        </Box>
      )}
      <Guia><b>¿Qué decides?</b></Guia>
      <FilaChips nombre="Decisión">{(VEREDICTOS as [string, string][]).map(([k, t]) => <ChipSi key={k} si={ex.veredicto === k} nombre="in-veredicto" datos={{ v: k }}>{t}</ChipSi>)}</FilaChips>
      <Nota>Cambiar de idea no es fracasar: es lo que ahorra meses y plata. Casi ninguna idea sale bien en el primer intento.</Nota>
      <Guia><b>Preséntalo a tu red de apoyo</b> (opcional): muéstraselo a 2 o 3 personas de confianza y pídeles que te digan qué mejorarían.</Guia>
      <CampoLargo etiqueta="🗣️ El feedback que recibí" filas={3} data-cambio="in-texto" data-k="feedback" defaultValue={x.textos.feedback || ''} placeholder="Ej.: «el video es largo, di tu valor en los primeros 10 segundos»" />
    </>
  );
}

export function innovacion(estado: Fin) {
  const x = innovacionDe(planDe(estado.finanzas)) as Fin, av = avanceInnovacion(x) as Fin;
  const area = (k: string, titulo: string, ayuda: string, filas = 3) => <CampoLargo etiqueta={titulo} filas={filas} data-cambio="in-texto" data-k={k} defaultValue={x.textos[k] || ''} placeholder={ayuda} />;
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave={T0} titulo={T0}>
        <Nota>De un problema real a una idea probada con gente de verdad, lista para tu pitch del módulo 5. Cada paso se abre y cierra tocando su título.</Nota>
        <Cifras datos={[
          { titulo: 'Pasos hechos', valor: av.hechos + ' / ' + av.total }, { titulo: 'Problemas', valor: x.problemas.length },
          { titulo: 'Conversaciones', valor: (x.entrevistas as Fin[]).filter((en) => en.aprendi).length + ' / 3' }, { titulo: 'Ideas', valor: x.ideas.length },
        ]} />
        <Avance parte={av.hechos / av.total} />
        <Pasos pasos={av.pasos} />
      </TarjetaPlegable>

      <TarjetaPlegable vista={VISTA} clave={GUIA} titulo={GUIA}>
        <Guia>Enfrentar un problema es la oportunidad perfecta para desafiar lo establecido y descubrir nuevas soluciones. En este ejercicio pondrás en práctica el proceso de innovación para abordar un desafío real, transformando ideas en propuestas concretas. <b>¡Es momento de crear!</b></Guia>
        <Box component="ol" sx={{ listStyle: 'none', m: '8px 0 0', p: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '8px' }}>
          {(pasosGuia(x) as Fin[]).map((p) => (
            <Box component="li" key={p.n} sx={{ display: 'grid', gap: '4px', p: '10px 12px', borderRadius: '12px', bgcolor: tokens.surface2, borderLeft: '4px solid', borderLeftColor: p.hecho ? tokens.verde : tokens.rosa }}>
              <Box component="b" sx={p.hecho ? { color: 'success.main' } : null}>{p.hecho ? '✓ ' : ''}Paso {p.n}: {p.titulo}</Box>
              <Box component="small" sx={CHICO}>{p.ejemplo} → se hace en el punto {p.tarjeta}.</Box>
            </Box>
          ))}
        </Box>
      </TarjetaPlegable>

      <Punto n={1} titulo="Qué es innovar">
        <Guia>Innovar no es inventar algo que nadie ha visto: es <b>resolver mejor un problema</b> y que alguien lo use (o pague). Casi siempre es una mejora pequeña sobre algo que ya existe.</Guia>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '8px', m: '8px 0 12px' }}>
          {(TIPOS_INNOVACION as [string, string][]).map(([t, d]) => <Box key={t} sx={{ display: 'grid', gap: '4px', p: '10px', borderRadius: '12px', bgcolor: tokens.surface2 }}><b>{t}</b><Box component="small" sx={CHICO}>{d}</Box></Box>)}
        </Box>
        {area('tipo', '🔎 Piensa en un negocio que admiras: ¿qué innovó y de qué tipo fue?', 'Ej.: Rappi innovó en servicio: te llevan cualquier cosa, no solo comida', 2)}
      </Punto>
      <Punto n={2} titulo="Encuentra un problema que valga la pena">{problemas(x)}</Punto>
      <Punto n={3} titulo="Habla con 3 personas">{entrevistas(x)}</Punto>
      <Punto n={4} titulo="Genera ideas y elige una">{ideas(x)}</Punto>
      <Punto n={5} titulo="Tu propuesta de valor">{valor(x)}</Punto>
      <Punto n={6} titulo="Prototipa y prueba barato">{prueba(x)}</Punto>
      <Punto n={7} titulo="Conclusiones">
        <Box sx={{ display: 'grid', gap: '8px' }}>
          {area('aprendi', '¿Qué aprendiste de innovar con gente de verdad?', 'Ej.: lo que yo creía importante no era lo que a ellos les importaba', 3)}
          {area('siguiente', '¿Cuál es tu siguiente paso concreto (y cuándo)?', 'Ej.: el sábado vendo 5 menús a los vecinos del edificio', 2)}
        </Box>
        <Compartir enviar="in-enviar" copiar="in-copiar" />
      </Punto>
    </>
  );
}
