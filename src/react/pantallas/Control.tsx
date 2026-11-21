// ✅ Control del día (Hoy), 🗓️ revisión de la semana (Hoy el domingo y el lunes, y siempre en Progreso) y 🍽️ la comida que
// sabe del gym (Dieta y Hoy). React pinta con las acciones de siempre (dieta-peso, meta, dieta-comer-todo, dieta-tipo-hoy) y
// el descanso de src/descanso.js; los cálculos están en src/control.js
import type { ReactNode } from 'react';
import { Box, Button, Card, Link } from '@mui/material';
import { e } from '../../estado.js';
import { iso, fechaCorta } from '../../fechas.js';
import { toast } from '../../ui.js';
import { alternarDescanso } from '../../descanso.js';
import { controlDia, revisionSemana, sugerenciaComida, tocaRevision, semanaARevisar } from '../../control.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { Ajustar } from '../ui/Rapido';
import { Avance } from '../ui/Varios';
import { Nota } from '../ui/Textos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const f1 = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const Marca = ({ si }: { si: boolean }) => <Box component="span" aria-label={si ? 'Listo' : 'Falta'} sx={{ flex: 'none', width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14, bgcolor: si ? 'primary.main' : tokens.surface2, color: si ? 'primary.contrastText' : 'text.secondary' }}>{si ? '✓' : ''}</Box>;
function Fila({ si, titulo, detalle, children }: { si: boolean; titulo: string; detalle?: ReactNode; children?: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gap: '6px', py: '8px', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Marca si={si} /><Box sx={{ flex: 1, minWidth: 0 }}><b>{titulo}</b>{detalle ? <Box component="small" sx={{ display: 'block', color: 'text.secondary' }}>{detalle}</Box> : null}</Box></Box>
      {children ? <Box sx={{ pl: '36px' }}>{children}</Box> : null}
    </Box>
  );
}

// ---------- ✅ Control del día ----------
export function ControlDia() {
  const est = usarEstado() as Fin, hoy = iso(), metaPasos = Number((est.config.metas || {}).pasos) || 8000, c = controlDia(hoy, est, metaPasos) as Fin;
  const ultimoPeso = Object.keys(est.dias).filter((f) => f < hoy).sort().reverse().map((f) => est.dias[f].peso).find((p: number) => p > 0) as number | undefined;
  const gymTxt: Record<string, string> = { hecho: 'Entrenaste hoy 💪', descanso: 'Hoy descansas 🛌', libre: 'Hoy no te toca gym', pendiente: 'Te falta el entreno de hoy' };
  return (
    <Card component="section" data-t="control-dia" sx={{ mb: '14px', display: 'grid', gap: '6px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
        <Box component="h2" sx={{ m: 0, fontSize: 18 }}>✅ Control del día</Box>
        <Box component="b" sx={{ fontSize: 20 }}>{c.listos}/4</Box>
      </Box>
      <Avance parte={c.listos / 4} />
      <Fila si={c.listo.peso} titulo={c.peso ? '⚖️ Peso: ' + f1(c.peso) + ' kg' : '⚖️ Pésate (en ayunas)'}>
        {c.peso ? null : <Ajustar etiqueta="Peso de hoy" valor={null} base={ultimoPeso || ((est.dieta || {}).config || {}).pesoBase} paso={0.1} decimales={1} min={20} max={300} unidad="kg" accion="dieta-peso"
          fichas={ultimoPeso ? [[ultimoPeso, 'Igual que la última · ' + f1(ultimoPeso) + ' kg']] : []} />}
      </Fila>
      <Fila si={c.listo.comidas} titulo={'🍽️ Comida del plan: ' + c.comidas.hechas + ' de ' + c.comidas.plan} detalle={c.listo.comidas ? 'Comiste como el plan' : 'Marca lo que vas comiendo en 🥗 Dieta, o todo de un toque si comiste como el plan'}>
        {c.listo.comidas || !c.comidas.plan ? null : <Button size="small" color="secondary" data-accion="dieta-comer-todo" sx={{ minHeight: 40 }}>✓ Comí como el plan</Button>}
      </Fila>
      <Fila si={c.listo.gym} titulo={'🏋️ ' + gymTxt[c.gym]}>
        {c.gym === 'pendiente' ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button size="small" href="#gym" sx={{ minHeight: 40 }}>Ir al gym →</Button>
            <Button size="small" color="secondary" onClick={() => { alternarDescanso(hoy); toast('🛌 Hoy descansas: no cuenta como que faltaste'); }} sx={{ minHeight: 40 }}>🛌 Hoy descanso</Button>
          </Box>
        ) : null}
      </Fila>
      <Fila si={c.listo.pasos} titulo={'👟 Pasos: ' + c.pasos.toLocaleString('es-CO') + ' de ' + metaPasos.toLocaleString('es-CO')}>
        {c.listo.pasos ? null : <Ajustar etiqueta="Pasos de hoy" valor={c.pasos || null} base={0} paso={1000} max={100000} accion="meta" datos={{ k: 'pasos' }}
          fichas={[['+2.000', 2000], ['+5.000', 5000]].map(([t, n]) => [c.pasos + (n as number), t] as [number, string])} />}
      </Fila>
      <Nota sx={{ m: 0 }}>{c.listos === 4 ? '🔥 Día completo: así se llega a la meta.' : 'Estas 4 cosas son las que más te acercan a la meta. Lo demás suma, esto decide.'}</Nota>
    </Card>
  );
}

// ---------- 🗓️ Revisión de la semana ----------
const ESTADO: Record<string, string> = { ideal: '✅ ritmo ideal', lento: '🐢 lento', quieto: '⏸ quieto', reves: '⚠️ al revés', rapido: '🏃 rápido', 'muy-rapido': '🐇 muy rápido' };
export function RevisionSemana({ sem, enHoy = false }: { sem?: number; enHoy?: boolean }) {
  usarEstado();
  if (enHoy && !tocaRevision()) return null;
  const x = revisionSemana(sem ?? (enHoy ? semanaARevisar() : undefined), e()) as Fin, rec = x.recomendacion;
  const fila = (k: string, t: string, v: ReactNode, mal?: boolean) => (
    <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', py: '6px', borderBottom: '1px solid', borderColor: 'divider', fontSize: 14 }}>
      <span>{t}</span><Box component="b" sx={{ textAlign: 'right', color: mal ? 'warning.main' : undefined }}>{v}</Box>
    </Box>
  );
  const pct = (v: number | null) => (v == null ? '—' : Math.round(v * 100) + ' %');
  return (
    <Card component="section" data-t="revision-semana" sx={{ mb: '14px', display: 'grid', gap: '6px' }}>
      <Box component="h2" sx={{ m: 0, fontSize: 18 }}>🗓️ Tu semana · {fechaCorta(x.lunes)} – {fechaCorta(x.domingo)}{x.descarga ? ' · 🔻 descarga' : ''}</Box>
      <Box data-t="recomendacion" sx={{ p: '10px 12px', borderRadius: '10px', bgcolor: tokens.subeFondo, display: 'grid', gap: '4px' }}>
        <b>{rec.ic} Para la semana que viene: {rec.t}</b>
        <Box component="span" sx={{ fontSize: 14 }}>{rec.d}</Box>
      </Box>
      <Box>
        {fila('peso', '⚖️ Peso (promedio)', x.peso == null ? '—' : <>{f1(x.peso)} kg{x.cambio != null ? ' · ' + (x.cambio > 0 ? '+' : '') + f1(x.cambio) + ' kg' : ''}{x.va ? ' · ' + ESTADO[x.va] : ''}</>, x.va === 'reves' || x.va === 'muy-rapido')}
        {x.ritmo && x.bajar ? fila('ritmo', '🎯 Tu ritmo ideal', '−' + (Math.round(x.ritmo.min * 100) / 100).toLocaleString('es-CO') + ' a −' + (Math.round(x.ritmo.max * 100) / 100).toLocaleString('es-CO') + ' kg') : null}
        {fila('pesajes', '📅 Pesajes', x.pesajes + ' de 7', x.pesajes < 4)}
        {fila('cintura', '📏 Cintura (2 semanas)', x.cintura == null ? 'sin medir' : (x.cintura > 0 ? '+' : '') + f1(x.cintura) + ' cm', x.cintura == null || x.cintura > 0)}
        {fila('fuerza', '💪 Fuerza del mes', x.fuerza == null ? '—' : (x.fuerza > 0 ? '+' : '') + Math.round(x.fuerza * 100) + ' %', x.fuerza != null && x.fuerza < -0.03)}
        {fila('comida', '🍽️ Comida del plan', pct(x.comida) + (x.comidas.plan ? ' (' + x.comidas.hechas + ' de ' + x.comidas.plan + ')' : ''), x.comida != null && x.comida < 0.7)}
        {fila('gym', '🏋️ Series del gym', x.gym.plan ? x.gym.hechas + ' de ' + x.gym.plan + ' (' + pct(x.gym.parte) + ')' : '—', !x.descarga && x.gym.parte != null && x.gym.parte < 0.7)}
        {fila('pasos', '👟 Pasos (promedio)', x.pasos == null ? '—' : Math.round(x.pasos).toLocaleString('es-CO'), x.pasos != null && x.pasos < 7000)}
        {fila('sueno', '😴 Sueño (promedio)', x.sueno == null ? '—' : f1(x.sueno) + ' h', x.sueno != null && x.sueno < 6.5)}
      </Box>
      <Nota sx={{ m: 0 }}>Una sola cosa para mejorar, la que más mueve la meta. Lo demás, igual. {enHoy ? <Link href="#progreso">Ver en Progreso →</Link> : null}</Nota>
    </Card>
  );
}

// ---------- 🍽️ La comida que sabe del gym ----------
export function SugerenciaComida() {
  usarEstado();
  const s = sugerenciaComida() as Fin;
  if (!s) return null;
  return (
    <Box data-t="sugerencia-comida" sx={{ m: '0 0 12px', p: '10px 12px', borderRadius: '10px', bgcolor: tokens.surface2, fontSize: 14, display: 'grid', gap: '8px' }}>
      <span>{s.tipo === 'partido-largo' ? '⚽ ' : '🛌 '}{s.texto}</span>
      {s.a ? <Button size="small" color="secondary" data-accion="dieta-tipo-hoy" data-tipo={s.a} sx={{ justifySelf: 'start', minHeight: 40 }}>Pasar a plan de descanso</Button> : null}
    </Box>
  );
}
