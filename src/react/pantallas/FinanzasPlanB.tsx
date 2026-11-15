// 💰 Finanzas → 🛟 Plan B: la ruta de Comfama. Aquí están el módulo 1 (los 7 puntos para afrontar el desempleo) y el
// módulo 2 (liderazgo emergente); los módulos 3, 4 y 5 están en FinanzasCreativo, FinanzasInnovacion y FinanzasPitch.
// React pinta; anotar, contar y marcar son las acciones de src/vistas/desempleo.js.
import type { ReactNode } from 'react';
import { Box, Button, Checkbox, Chip, FormControlLabel, IconButton } from '@mui/material';
import { semanaActual } from '../../estado.js';
import { iso, sumarDias, fechaCorta } from '../../fechas.js';
import { pesos } from '../../finanzas.js';
import { resumenSemana } from '../../gym.js';
import { horasSueno } from '../../registro.js';
import { miles } from '../../ui.js';
import {
  planDe, diaPlan, colchon, avanceBusqueda, diarioEmociones, RECURSOS, INGRESOS_ALT, EMOCIONES, BLOQUES, RED, CARACTERISTICAS, PLAZOS, liderDe, analisisLider, venceAccion, cambiosLider,
} from '../../desempleo.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLargo, CampoLista, DOS } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { Nota } from '../ui/Textos';
import { Opciones, Cifras, Avance, Marcable } from '../ui/Varios';
import { Aviso, Chico, FILA_BOTONES } from './finanzasPiezas';
import { VISTA, CAMPOS, Punto, Idea, Pie } from './planbPiezas';
import { creativo } from './FinanzasCreativo';
import { innovacion } from './FinanzasInnovacion';
import { pitch } from './FinanzasPitch';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
export const MODULOS: [string, string][] = [['desempleo', '🛟 Módulo 1 · Afrontar el desempleo'], ['lider', '🧭 Módulo 2 · Liderazgo emergente'], ['creativo', '💡 Módulo 3 · Despertar creativo'], ['innovacion', '🚀 Módulo 4 · Innovación'], ['pitch', '🎤 Módulo 5 · Pitch']];
const meses = (n: number | null) => { if (n == null) return '—'; if (n === Infinity) return 'sin límite'; const r = Math.round(n * 10) / 10; return r.toLocaleString('es-CO') + (r === 1 ? ' mes' : ' meses'); };

// ---------- Piezas ----------
// Botones que llevan a otra sección
const Enlaces = ({ a }: { a: [string, string][] }) => <Box sx={FILA_BOTONES}>{a.map(([href, t]) => <Button key={href} component="a" href={href} color="secondary">{t}</Button>)}</Box>;
const Monto = ({ grupo, k, titulo, valor }: { grupo: string; k: string; titulo: string; valor?: number }) => (
  <Campo etiqueta={titulo} inputMode="numeric" data-pesos="" data-cambio="pb-monto" data-grupo={grupo} data-k={k} defaultValue={valor ? miles(valor) : ''} placeholder="$ 0" />
);

// ---------- Módulo 1: afrontar el desempleo ----------
function desempleo(estado: Fin) {
  const f = estado.finanzas, p = planDe(f), d = diaPlan(p), c = colchon(f) as Fin, b = avanceBusqueda(p) as Fin;
  const texto = (k: string, titulo: string, ayuda: string, filas = 3) => <CampoLargo etiqueta={titulo} filas={filas} data-cambio="pb-texto" data-k={k} defaultValue={p.textos[k] || ''} placeholder={ayuda} />;
  const textoDia = (k: string, titulo: string, ayuda: string, filas = 3) => <CampoLargo etiqueta={titulo} filas={filas} data-cambio="pb-dia" data-k={k} defaultValue={d[k] || ''} placeholder={ayuda} />;
  const contador = (k: 'hojas' | 'contactos', valor: number, meta: number, que: string) => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '8px', alignItems: 'center', my: '8px' }}>
      <Button color="secondary" disabled={!valor} aria-label={'Quitar un' + (k === 'hojas' ? 'a hoja de vida' : ' contacto')} onClick={() => accion('pb-contar', { k, n: -1 })} sx={{ minWidth: 56 }}>−</Button>
      <Box component="span" sx={{ display: 'grid', textAlign: 'center' }}><Box component="b" sx={{ fontSize: 20, color: valor >= meta ? 'success.main' : undefined }}>{valor} / {meta}</Box><Chico>{que}</Chico></Box>
      <Button onClick={() => accion('pb-contar', { k, n: 1 })}>＋ {k === 'hojas' ? 'Hoja de vida' : 'Contacto'}</Button>
    </Box>
  );
  const diario = (diarioEmociones(p) as Fin[]).filter((x) => x.fecha !== iso());
  const origen = p.esenciales != null || p.noEsenciales != null ? 'los que escribiste a mano' : c.auto.desde === 'movimientos' ? 'promedio de tus últimos ' + c.auto.meses + (c.auto.meses === 1 ? ' mes' : ' meses') + ' en Finanzas'
    : c.auto.desde === 'fijos' ? 'tus pagos fijos y cuotas (aún no hay meses completos anotados)' : 'escríbelos abajo: aún no hay gastos anotados';
  const filaTabla = (t: string, v: string, color?: string) => <tr><Box component="th" scope="row" sx={{ textAlign: 'left', fontWeight: 400, py: '6px', borderBottom: '1px solid', borderColor: 'divider' }}>{t}</Box><Box component="td" sx={{ textAlign: 'right', fontWeight: 700, py: '6px', borderBottom: '1px solid', borderColor: 'divider', color }}>{v}</Box></tr>;
  const hechosRed = (RED as [string, string][]).filter(([k]) => p.red[k]).length;
  // Autocuidado: lo que la app ya sabe de ti
  const g = resumenSemana(estado.rutina, estado.semanas[semanaActual()] || {}) as { hechas: number; plan: number };
  const hs = Array.from({ length: 7 }, (_, k) => horasSueno((estado.dias[sumarDias(iso(), -k)] || {}).sueno) as number | null).filter((h): h is number => h != null);
  const sueno = hs.length ? Math.round((hs.reduce((x, y) => x + y, 0) / hs.length) * 10) / 10 : null;
  const t0 = '🛟 Plan B: si te quedas sin empleo';
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave={t0} titulo={t0}>
        <Nota>Siete pasos para atravesar el desempleo sin perder el rumbo: emociones, plata, rutina, red de apoyo, habilidades, autocuidado y mentalidad. Abre y cierra cada uno tocando su título.</Nota>
        <Cifras datos={[
          { titulo: 'Te alcanza (todo)', valor: meses(c.mesesNormal) },
          { titulo: 'Solo lo esencial', valor: meses(c.mesesAustero), color: tokens.verde },
          { titulo: 'Hojas de vida hoy', valor: b.hojasHoy + ' / ' + b.metaHojas },
          { titulo: 'Contactos esta semana', valor: b.contactosSemana + ' / ' + b.metaContactos },
        ]} />
        {!c.disponible && <Aviso>Anota en el punto 2 con qué plata cuentas (liquidación, cesantías, ahorros) para saber cuántos meses te alcanza.</Aviso>}
      </TarjetaPlegable>

      <Punto n={1} titulo="Acepta y procesa tus emociones">
        <Idea titulo="Reconoce y valida lo que sientes:">permítete sentir tristeza, enojo o miedo sin juzgarte, y escríbelo.</Idea>
        <Box role="group" aria-label="Cómo te sientes hoy" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', pb: '8px' }}>
          {(EMOCIONES as string[]).map((x) => { const si = d.emociones.includes(x); return <Chip key={x} clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={x} onClick={() => accion('pb-emocion', { v: x })} />; })}
        </Box>
        {textoDia('siento', 'Hoy siento…', 'Sin filtro: nadie más lo lee. Escribir lo que sientes le baja el volumen.')}
        {diario.length > 0 && (
          <Desplegable titulo={'📓 Días anteriores (' + diario.length + ')'}>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: '6px', fontSize: 14 }}>
              {diario.map((x) => <li key={x.fecha}><b>{fechaCorta(x.fecha)}</b> {x.emociones.join(' ')}{x.siento ? <Box component="span" sx={{ display: 'block', color: 'text.secondary' }}>{x.siento}</Box> : null}</li>)}
            </Box>
          </Desplegable>
        )}
        <Idea titulo="Regula:">mindfulness, meditación y escribir un diario ayudan con el miedo y la incertidumbre.</Idea>
        <Enlaces a={[['#sesiones', '🧘 Sesiones guiadas'], ['#recordatorios', '👥 Mi círculo cercano']]} />
        <Idea titulo="Evita el aislamiento:">comparte lo que sientes con familia o amigos de confianza.</Idea>
      </Punto>

      <Punto n={2} titulo="Evalúa tu situación financiera">
        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, mb: '8px' }}>
          <thead><tr><Box component="th" scope="col" sx={{ textAlign: 'left', color: 'text.secondary', fontSize: 13, pb: '4px' }}>Categoría</Box><Box component="th" scope="col" sx={{ textAlign: 'right', color: 'text.secondary', fontSize: 13, pb: '4px' }}>Por mes</Box></tr></thead>
          <tbody>
            {filaTabla('Disponible (ahorros y recursos)', pesos(c.disponible))}
            {c.ingresos ? filaTabla('Ingresos alternativos', pesos(c.ingresos)) : null}
            {filaTabla('Gastos esenciales', pesos(c.esenciales))}
            {filaTabla('Gastos no esenciales', pesos(c.noEsenciales))}
            {filaTabla('Diferencia después de un mes', pesos(c.diferencia), c.diferencia < 0 ? tokens.rojo : tokens.verde)}
          </tbody>
        </Box>
        <Nota>Te alcanza para <b>{meses(c.mesesNormal)}</b> como vives hoy, y <b>{meses(c.mesesAustero)}</b> si recortas a lo esencial. Gastos: {origen}.</Nota>
        {c.disponible && c.esenciales ? <><Avance parte={Math.min(1, (c.mesesAustero === Infinity ? 12 : c.mesesAustero) / 6)} /><Nota>La barra llena son 6 meses de lo esencial: lo que se recomienda tener.</Nota></> : null}
        <Desplegable titulo="💼 Con qué plata cuentas" abiertoAlInicio={!c.recursos}>
          <FormControlLabel sx={{ mx: 0, mb: '8px', gap: '8px', alignItems: 'center' }} label={'Sumar lo que ya tengo en la app (ahorros y cuentas: ' + pesos(c.enApp) + ')'}
            control={<Checkbox defaultChecked={!p.sinApp} slotProps={{ input: { 'data-cambio': 'pb-sin-app' } as object }} sx={{ p: '4px' }} />} />
          <Box sx={DOS}>{(RECURSOS as [string, string][]).map(([k, t]) => <Monto key={k} grupo="recursos" k={k} titulo={t} valor={p.recursos[k]} />)}</Box>
          <Nota>Pregunta en tu caja de compensación por el subsidio al desempleo, y averigua qué entidades públicas y privadas dan apoyos o tienen redes de ayuda.</Nota>
        </Desplegable>
        <Desplegable titulo="➕ Ingresos alternativos (por mes)">
          <Box sx={DOS}>{(INGRESOS_ALT as [string, string][]).map(([k, t]) => <Monto key={k} grupo="ingresosAlt" k={k} titulo={t} valor={p.ingresosAlt[k]} />)}</Box>
        </Desplegable>
        <Desplegable titulo="✏️ Ajustar los gastos a mano">
          <Nota>Déjalos vacíos para usar lo calculado ({pesos(c.auto.esenciales)} y {pesos(c.auto.noEsenciales)}).</Nota>
          <Box sx={DOS}>
            <Campo etiqueta="Gastos esenciales" inputMode="numeric" data-pesos="" data-cambio="pb-gasto" data-k="esenciales" defaultValue={p.esenciales != null ? miles(p.esenciales) : ''} placeholder={miles(c.auto.esenciales)} />
            <Campo etiqueta="Gastos no esenciales" inputMode="numeric" data-pesos="" data-cambio="pb-gasto" data-k="noEsenciales" defaultValue={p.noEsenciales != null ? miles(p.noEsenciales) : ''} placeholder={miles(c.auto.noEsenciales)} />
          </Box>
        </Desplegable>
        <Idea titulo="Ajusta el presupuesto:">prioriza lo esencial y busca ahorro en energía, agua y combustible.</Idea>
        <Enlaces a={[['#finanzas/presupuesto', '🎯 Presupuesto'], ['#finanzas/fijos', '🔁 Pagos fijos']]} />
      </Punto>

      <Punto n={3} titulo="Establece una rutina estructurada">
        <Idea titulo="Metas pequeñas y alcanzables:">por ejemplo, {p.metas.hojasDia} hojas de vida al día y {p.metas.contactosSemana} contactos profesionales por semana.</Idea>
        {contador('hojas', b.hojasHoy, b.metaHojas, 'hojas de vida hoy')}
        {contador('contactos', d.contactos || 0, Math.max(1, b.metaContactos - (b.contactosSemana - (d.contactos || 0))), 'contactos hoy · ' + b.contactosSemana + ' de ' + b.metaContactos + ' en la semana')}
        <Nota>Esta semana: {b.hojasSemana} hojas de vida · {b.diasConMeta} de {b.diasSemana} días cumpliste la meta.</Nota>
        <Box component="h3" sx={{ fontSize: 17, m: '10px 0 8px' }}>Tu horario de hoy</Box>
        <div>{(BLOQUES as [string, string][]).map(([k, t]) => <Marcable key={k} hecho={!!d.bloques[k]} alTocar={() => accion('pb-bloque', { k })}>{t}</Marcable>)}</div>
        <Desplegable titulo="🎯 Cambiar las metas">
          <Box sx={DOS}>
            <Campo etiqueta="Hojas de vida por día" type="number" inputMode="numeric" min={0} max={50} data-cambio="pb-meta" data-k="hojasDia" defaultValue={p.metas.hojasDia} />
            <Campo etiqueta="Contactos por semana" type="number" inputMode="numeric" min={0} max={50} data-cambio="pb-meta" data-k="contactosSemana" defaultValue={p.metas.contactosSemana} />
          </Box>
        </Desplegable>
      </Punto>

      <Punto n={4} titulo="Fortalece tu red de apoyo">
        <Nota>{hechosRed} de {RED.length} hechos.</Nota>
        <div>{(RED as [string, string][]).map(([k, t]) => <Marcable key={k} hecho={!!p.red[k]} alTocar={() => accion('pb-red', { k })}>{t}</Marcable>)}</div>
        <Idea titulo="Redes profesionales:">búsqueda constante en LinkedIn, asociaciones del sector y eventos de networking.</Idea>
        <Idea titulo="Apoyo emocional:">si la tristeza o la ansiedad duran más de dos semanas, o te cuesta dormir, comer o levantarte, busca un psicólogo (tu EPS o tu caja de compensación tienen) o un grupo de apoyo. Pedir ayuda es parte del plan, no un fracaso.</Idea>
      </Punto>

      <Punto n={5} titulo="Reinvéntate y desarrolla habilidades">
        <Idea titulo="Autoevaluación:">lista tus fortalezas, lo que sabes hacer que sirve en otros trabajos y lo que debes mejorar.</Idea>
        <Box sx={CAMPOS}>
          <Box sx={DOS}>{texto('fortalezas', '💪 Mis fortalezas', 'Una por línea')}{texto('transferibles', '🔁 Habilidades transferibles', 'Asesorías, cursos, podcast, ventas, Excel…')}</Box>
          {texto('mejora', '📈 Áreas de mejora', '¿Qué te pide el mercado que aún no tienes?', 2)}
        </Box>
        <Idea titulo="Autoformación continua:">cursos en línea (ComfamaPro, Coursera, Udemy, YouTube) y certificaciones.</Idea>
        <Enlaces a={[['#estudiar', '🎓 Estudiar en la app']]} />
        <Idea titulo="Explora alternativas:">emprendimientos que has postergado, trabajar por encargo o sectores nuevos ligados a tus intereses.</Idea>
        {texto('alternativas', '🚀 Ideas que quiero explorar', 'Ej.: asesorías de…, vender…, freelance de…', 2)}
      </Punto>

      <Punto n={6} titulo="Garantiza el autocuidado integral">
        <Cifras datos={[
          { titulo: 'Gym esta semana', valor: g.hechas + ' / ' + g.plan, nota: 'series' },
          { titulo: 'Sueño (7 días)', valor: sueno != null ? String(sueno).replace('.', ',') + ' h' : '—', color: sueno != null && sueno < 7 ? tokens.rojo : undefined, nota: sueno != null ? 'promedio' : 'anótalo en Hoy' },
        ]} />
        <Idea titulo="Salud física:">ejercicio regular, comida balanceada y sueño suficiente (un podcast antes de dormir ayuda).</Idea>
        <Idea titulo="Salud mental:">meditación, arte, lectura o voluntariado para mantener la motivación.</Idea>
        <Enlaces a={[['#gym', '🏋️ Gym'], ['#dieta', '🥗 Dieta'], ['#estudiar', '📚 Leer']]} />
      </Punto>

      <Punto n={7} titulo="Replantea tu mentalidad para adaptarte">
        <Idea titulo="Enfócate en las oportunidades:">este tiempo sirve para redirigir tu carrera, estudiar y hacer lo que nunca podías por falta de tiempo.</Idea>
        {texto('oportunidades', '🌅 Lo que este momento me permite', 'Escribe todo lo que pienses o identifiques', 2)}
        <Idea titulo="Practica la gratitud:">valora lo que tienes, a nivel material y espiritual.</Idea>
        <Box sx={CAMPOS}>
          {textoDia('gratitud', '🙏 Hoy agradezco', '1 a 3 cosas', 2)}
          {texto('tengo', '🎒 Lo que tengo (material y espiritual)', 'Salud, familia, una moto, lo que sabes hacer…', 3)}
        </Box>
        <Idea titulo="Flexibilidad:">el camino cambió y seguirá cambiando; adaptarte a las opciones nuevas es el camino. Confía en lo que creas y escribe lo que quieres que pase.</Idea>
      </Punto>
      <Pie>Basado en la guía de Comfama para afrontar el desempleo.</Pie>
    </>
  );
}

// ---------- Módulo 2: liderazgo emergente ----------
function liderazgo(estado: Fin) {
  const l = liderDe(planDe(estado.finanzas)) as Fin, a = analisisLider(l.notas) as Fin, cambios = cambiosLider(l) as Fin[];
  const textoL = (k: string, titulo: string, ayuda: string, filas = 3) => <CampoLargo etiqueta={titulo} filas={filas} data-cambio="pb-lider-texto" data-k={k} defaultValue={l.textos[k] || ''} placeholder={ayuda} />;
  const listaCar = (xs: Fin[]) => xs.map((x, i) => <span key={x.nombre}>{i ? ', ' : ''}<b>{x.nombre}</b> ({x.n})</span>);
  const areas = (CARACTERISTICAS as [string, string, string][]).map(([k, n]) => [k, n] as [string, string]);
  const sinAcciones = a.completo && !l.acciones.length, t0 = '🧭 Módulo 2: Liderazgo emergente';
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave={t0} titulo={t0}>
        <Nota>Califícate, mira tus fortalezas y lo que te falta, arma un plan con plazos y cierra con un compromiso.</Nota>
        <Cifras datos={[
          { titulo: 'Calificadas', valor: a.respondidas + ' / ' + a.total },
          { titulo: 'Promedio', valor: a.promedio != null ? String(a.promedio).replace('.', ',') + ' / 5' : '—' },
          { titulo: 'Acciones', valor: l.acciones.filter((x: Fin) => x.hecho).length + ' / ' + l.acciones.length, nota: 'hechas' },
        ]} />
        <Avance parte={a.respondidas / a.total} />
      </TarjetaPlegable>

      <Punto n={1} titulo="Autoevaluación: fortalezas y áreas de mejora">
        <Box component="p" sx={{ my: '10px' }}>Califícate del <b>1</b> (nada desarrollado) al <b>5</b> (altamente desarrollado). Si la pregunta no tiene nada que ver contigo, pon 1; si tiene mucho que ver, pon 5.</Box>
        <Box sx={{ display: 'grid', gap: '10px' }}>
          {(CARACTERISTICAS as [string, string, string][]).map(([k, nombre, pregunta]) => (
            <Box key={k} sx={{ display: 'grid', gap: '6px', pb: '10px', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'grid' }}><b>{nombre}</b><Chico>{pregunta}</Chico></Box>
              <Opciones nombre={nombre + ': calificación del 1 al 5'} chica activa={l.notas[k] ? String(l.notas[k]) : null} opciones={['1', '2', '3', '4', '5'].map((n) => [n, n] as [string, string])}
                alElegir={(n) => accion('pb-lider-nota', { k, n })} sx={{ pb: 0 }} />
            </Box>
          ))}
        </Box>
        {cambios.length > 0 && <Nota>Frente a tu evaluación del {fechaCorta(l.anterior.fecha)}: {cambios.map((x, i) => <span key={x.nombre}>{i ? ' · ' : ''}{x.nombre} {x.antes} → <Box component="b" sx={{ color: x.ahora > x.antes ? 'success.main' : 'error.main' }}>{x.ahora}</Box></span>)}</Nota>}
        {a.completo && <Button variant="text" onClick={() => accion('pb-lider-repetir')} sx={{ minHeight: 44, px: '4px', fontWeight: 400, textDecoration: 'underline', textAlign: 'left' }}>↻ Repetir la autoevaluación más adelante (guarda esta para comparar)</Button>}
      </Punto>

      <Punto n={2} titulo="Análisis de resultados: reconoce patrones">
        {a.completo
          ? <Box sx={{ bgcolor: 'background.default', borderRadius: '10px', p: '8px 12px', mb: '8px' }}><Box component="p" sx={{ my: '6px' }}>💪 <b>Tus 3 mayores fortalezas:</b> {listaCar(a.fuertes)}</Box><Box component="p" sx={{ my: '6px' }}>📈 <b>Tus 3 áreas de mejora:</b> {listaCar(a.mejora)}</Box></Box>
          : <Aviso>Califica las {a.total} características del punto 1 y aquí salen tus fortalezas y tus áreas de mejora ({a.respondidas} de {a.total}).</Aviso>}
        <Box sx={CAMPOS}>
          {textoL('fortalezas', '¿Cómo puedo aprovechar mejor mis fortalezas?', 'Ej.: "Mi empatía me ayuda a conectar con los demás. Puedo usarla para motivar a mi equipo en momentos difíciles".')}
          {textoL('mejora', '¿Por qué son importantes mis áreas de mejora para liderar?', 'Ej.: "Mi tolerancia a la frustración es baja, lo que puede afectar mi capacidad para liderar en situaciones de alta presión".')}
          {textoL('relacion', '¿Cómo se relacionan? ¿Cómo uso mis fortalezas para compensar mis debilidades?', 'Escribe cómo una fortaleza te ayuda con un área de mejora.', 2)}
        </Box>
      </Punto>

      <Punto n={3} titulo="Diseño de un plan de acción">
        <Box component="p" sx={{ my: '10px' }}>Por cada área de mejora: una acción concreta, un plazo y los recursos que necesitas.</Box>
        {l.acciones.length ? (
          <Box sx={{ display: 'grid', gap: '12px' }}>
            {(l.acciones as Fin[]).map((x, i) => (
              <Box key={x.id} data-t="accion-lider" sx={{ display: 'grid', gap: '8px', p: '10px', borderRadius: '12px', border: '1px solid', borderColor: x.hecho ? 'primary.main' : 'divider', bgcolor: 'background.default' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px', alignItems: 'end' }}>
                  <CampoLista etiqueta="Área de mejora" data-cambio="pb-accion" data-i={i} data-k="area" defaultValue={x.area} opciones={areas} />
                  <Box sx={{ width: 120, '& > button': { mb: 0 } }}><Marcable hecho={!!x.hecho} alTocar={() => accion('pb-accion-hecha', { i })}>Hecha</Marcable></Box>
                  <IconButton aria-label="Borrar esta acción" onClick={() => accion('pb-accion-borrar', { i })} sx={{ fontSize: 20, color: 'error.main', mb: '2px' }}>🗑</IconButton>
                </Box>
                <CampoLargo etiqueta="Acción concreta" filas={2} data-cambio="pb-accion" data-i={i} data-k="accion" defaultValue={x.accion || ''} placeholder="Ej.: practicar respiración profunda y meditación en situaciones difíciles" />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                  <span>Plazo:</span>
                  {(PLAZOS as [number, string][]).map(([n, t]) => { const si = (x.plazo || 1) === n; return <Chip key={n} size="small" clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={t} onClick={() => accion('pb-accion-plazo', { i, n })} />; })}
                  <Chico>vence {fechaCorta(venceAccion(x))}</Chico>
                </Box>
                <Campo etiqueta="Recursos necesarios" data-cambio="pb-accion" data-i={i} data-k="recursos" defaultValue={x.recursos || ''} placeholder="Ej.: app de mindfulness, un libro, un mentor" />
              </Box>
            ))}
          </Box>
        ) : <Nota>Aún no tienes acciones.{a.completo ? ' Empieza con tus 3 áreas de mejora:' : ''}</Nota>}
        <Box sx={FILA_BOTONES}>
          {sinAcciones && <Button onClick={() => accion('pb-accion-mejora')}>＋ Una acción por cada área de mejora</Button>}
          <Button color={sinAcciones ? 'secondary' : 'primary'} onClick={() => accion('pb-accion-nueva')}>＋ Acción</Button>
        </Box>
        <Desplegable titulo="💡 Consejos y ejemplo">
          <Box component="ul" sx={{ pl: '20px', m: 0 }}>
            <li>Sé realista con los plazos y que las acciones sean específicas y medibles.</li>
            <li>Busca recursos disponibles: libros, cursos, mentores (en 🎓 Estudiar tienes cursos sin internet).</li>
            <li>Comparte tu plan con alguien de confianza para recibir retroalimentación (botón de abajo).</li>
          </Box>
          <Nota><b>Ejemplo:</b> Tolerancia a la frustración → respiración y meditación en situaciones difíciles · 1 mes · apps de mindfulness. Pensamiento holístico → leer sobre sistemas complejos y analizar problemas desde varias perspectivas · 3 meses · libros, cursos, mentorías.</Nota>
        </Desplegable>
      </Punto>

      <Punto n={4} titulo="Reflexión final: compromiso personal">
        <Box sx={CAMPOS}>
          {textoL('aprendido', '¿Qué aprendí sobre mí con esta autoevaluación?', 'Ej.: "Identifiqué que soy empático, pero necesito trabajar mi mentalidad ágil".', 2)}
          {textoL('aplicar', '¿Cómo me imagino aplicando estas habilidades en mi vida personal, profesional o comunitaria?', 'Ej.: "En mi trabajo diario, respondiendo distinto al cambio".', 2)}
          {textoL('compromisos', '¿Qué compromisos específicos asumo para desarrollarme como líder?', 'Ej.: "Me comprometo a leer un libro sobre adaptabilidad y quiero ser un líder que inspire confianza".', 2)}
        </Box>
        <Box sx={FILA_BOTONES}>
          <Button onClick={() => accion('pb-lider-enviar')}>📤 Compartir con alguien de confianza</Button>
          <Button color="secondary" onClick={() => accion('pb-lider-copiar')}>📋 Copiar texto</Button>
        </Box>
      </Punto>
      <Pie>Basado en la guía de Comfama: Trabajo autónomo, módulo 2.</Pie>
    </>
  );
}

// Cada módulo con la nota de dónde sale
const MODULO: Record<string, (estado: Fin) => ReactNode> = {
  desempleo, lider: liderazgo,
  creativo: (estado) => <>{creativo(estado)}<Pie>Basado en la guía de Comfama: Trabajo autónomo, módulo 3.</Pie></>,
  innovacion: (estado) => <>{innovacion(estado)}<Pie>Basado en la guía de Comfama: Trabajo autónomo, módulo 4 (con ejercicios de apoyo propios).</Pie></>,
  pitch: (estado) => <>{pitch(estado)}<Pie>Inspirado en la ruta de trabajo autónomo de Comfama (módulo 5), con ejercicios propios.</Pie></>,
};

/** estado: todos los datos de la app (el punto 6 mira el gym y el sueño). modulo: cuál de los cinco se ve (lo recuerda src/vistas/desempleo.js) */
export function planb(estado: Fin, modulo: string) {
  return (
    <>
      <Opciones nombre="Módulo" activa={modulo} opciones={MODULOS} datos={(k) => ({ 'data-accion': 'pb-modulo', 'data-v': k })} />
      {MODULO[modulo] ? MODULO[modulo](estado) : null}
    </>
  );
}
