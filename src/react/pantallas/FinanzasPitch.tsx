// 💰 Finanzas → 🛟 Plan B → 🎤 Módulo 5: Pitch. Armar el pitch de 1 minuto por bloques (con sugerencias del módulo 4),
// ver cuánto dura, ensayarlo con un cronómetro de 60 s y preparar las preguntas difíciles.
// React pinta; guardar y el cronómetro del ensayo son las acciones de src/vistas/pitch.js (pi-…).
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { fechaCorta } from '../../fechas.js';
import { planDe } from '../../desempleo.js';
import { innovacionDe } from '../../innovacion.js';
import { pitchDe, sugerencias, avancePitch, textoPitch, segundosDe, BLOQUES_PITCH, PREGUNTAS_DIFICILES, CONSEJOS, SEGUNDOS_PITCH } from '../../pitch.js';
import { ensayoPitch } from '../../vistas/pitch.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { CampoLargo, CampoLargoSolo } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { Nota } from '../ui/Textos';
import { Cifras, Avance } from '../ui/Varios';
import { VISTA, Punto, Guia, Pasos, Vinetas, Enlace, Compartir } from './planbPiezas';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const T0 = '🎤 Módulo 5: Pitch';

// Primer toque: arranca 60 s. Segundo toque: para y guarda el ensayo (lo hace la acción pi-ensayar). Aquí solo se cuenta
function Ensayar() {
  const inicio = (ensayoPitch as () => number)(), [, repintar] = useState(0);
  useEffect(() => {
    if (!inicio) return undefined;
    const t = setInterval(() => repintar((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [inicio]);
  const quedan = Math.max(0, SEGUNDOS_PITCH - Math.round((Date.now() - inicio) / 1000));
  return (
    <Button data-t="ensayar" onClick={() => { accion('pi-ensayar'); repintar((n) => n + 1); }}
      sx={[{ mb: '8px', fontVariantNumeric: 'tabular-nums' }, !!inicio && { bgcolor: 'warning.main', color: tokens.amarilloInk, '&:hover': { bgcolor: 'warning.main' } }]}>
      {inicio ? '⏹ Terminé · quedan ' + quedan + ' s' : '▶ Ensayar (60 s)'}
    </Button>
  );
}

export function pitch(estado: Fin) {
  const p = planDe(estado.finanzas), x = pitchDe(p) as Fin, av = avancePitch(x) as Fin, sug = sugerencias(innovacionDe(p)) as Record<string, string>, seg = av.segundos as number;
  const largo = seg > SEGUNDOS_PITCH + 5, completo = textoPitch(x) as string;
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave={T0} titulo={T0}>
        <Nota>Cuenta tu idea en 1 minuto para que alguien diga «sí»: un cliente, un aliado o quien te pueda financiar. Usa lo que trabajaste en el módulo 4.</Nota>
        <Cifras datos={[
          { titulo: 'Bloques', valor: av.llenos + ' / ' + BLOQUES_PITCH.length },
          { titulo: 'Dura', valor: seg ? '≈ ' + seg + ' s' : '—', color: largo ? tokens.rojo : seg ? tokens.verde : undefined },
          { titulo: 'Ensayos', valor: x.ensayos.length + ' / 3' },
        ]} />
        <Avance parte={av.hechos / av.total} />
        <Pasos pasos={av.pasos} />
      </TarjetaPlegable>

      <Punto n={1} titulo="Arma tu pitch de 1 minuto">
        <Guia>Seis bloques cortos, en este orden. {Object.keys(sug).length ? <>Donde veas <b>✨ Usar del módulo 4</b>, toca para empezar con lo que ya escribiste.</> : 'Si haces primero el módulo 4, aquí te salen sugerencias.'}</Guia>
        {(BLOQUES_PITCH as [string, string, string][]).map(([k, t, ayuda]) => {
          const v = x.bloques[k] || '';
          return (
            <Box key={k} sx={{ display: 'grid', gap: '4px', my: '8px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <b>{t}</b><Box component="small" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>{v ? '≈ ' + segundosDe(v) + ' s' : ''}</Box>
              </Box>
              <CampoLargoSolo aria-label={t} data-cambio="pi-bloque" data-k={k} defaultValue={v} placeholder={ayuda} />
              {sug[k] && !v.trim() ? <Enlace onClick={() => accion('pi-sugerencia', { k })} sx={{ fontSize: 13 }}>✨ Usar del módulo 4: «{sug[k].length > 70 ? sug[k].slice(0, 70) + '…' : sug[k]}»</Enlace> : null}
            </Box>
          );
        })}
        <Box sx={{ mt: '10px' }}>
          <Box sx={{ height: 12, borderRadius: 999, bgcolor: tokens.surface2, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', borderRadius: 999, width: Math.min(100, Math.round(seg / SEGUNDOS_PITCH * 100)) + '%', bgcolor: largo ? 'error.main' : 'success.main' }} />
          </Box>
          <Nota>
            {seg ? <>≈ <b>{seg} s</b> de {SEGUNDOS_PITCH} s{largo ? ': recorta. Quita adjetivos y deja un solo dato por bloque.' : ' ✓'}</> : 'Escribe los bloques para ver cuánto dura'} (hablando tranquilo, ≈ 150 palabras por minuto).
          </Nota>
        </Box>
        {completo ? <Desplegable titulo="📄 Ver el pitch completo"><Box component="p" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, m: 0 }}>{completo}</Box></Desplegable> : null}
      </Punto>

      <Punto n={2} titulo="Ensaya en voz alta">
        <Guia>Lee tu pitch en voz alta con el cronómetro. Ensáyalo <b>al menos 3 veces</b>, hasta decirlo sin leer.</Guia>
        <Ensayar />
        {x.ensayos.length ? <Nota>Ensayos: {(x.ensayos as Fin[]).slice(-5).map((en) => fechaCorta(en.fecha) + (en.segundos ? ' (' + en.segundos + ' s)' : '')).join(' · ')}</Nota> : null}
        <Vinetas items={CONSEJOS as string[]} />
      </Punto>

      <Punto n={3} titulo="Prepara las preguntas difíciles">
        <Guia>Después del pitch casi siempre preguntan esto. Tener la respuesta lista da confianza.</Guia>
        <Box sx={{ display: 'grid', gap: '8px' }}>
          {(PREGUNTAS_DIFICILES as [string, string][]).map(([k, q]) => <CampoLargo key={k} etiqueta={q} filas={2} data-cambio="pi-respuesta" data-k={k} defaultValue={x.respuestas[k] || ''} />)}
        </Box>
        <Compartir enviar="pi-enviar" copiar="pi-copiar" texto="📤 Compartir mi pitch" />
      </Punto>
    </>
  );
}
