// 🌅 Primera hora: el checklist de la mañana en orden (cada toque guarda la hora), la espera entre la pastilla y el
// desayuno, cuenta regresiva, cronómetro, hábitos con texto, las 3 prioridades y agregar un hábito. React pinta; las
// reglas son las de src/vistas/manana.js (marcar, marcar-minimo, cuenta, crono, habito-texto, prioridades, manana-…).
// CabeceraManana y ListaManana quedan listas para cuando Hoy se pase a React; mientras, Hoy usa las de HTML de allá.
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, NativeSelect, OutlinedInput } from '@mui/material';
import { dia, racha, habitosDe, hechosManana, fraccionManana, segundosCrono, textoHabito, pastillaDe, mananaCorta, prioridadesDe } from '../../estado.js';
import { iso, hora, reloj } from '../../fechas.js';
import { IDEAS_HABITOS } from '../../datos_iniciales.js';
import { textoEspera, piezasManana } from '../../vistas/manana.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { CampoLargo, CampoLargoSolo, CampoSolo } from '../ui/Campo';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Avance } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const M = piezasManana as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const Suave = ({ datos, children }: { datos: Record<string, string>; children: ReactNode }) => (
  <Button variant="text" {...datos} sx={{ justifySelf: 'start', minHeight: 44, p: '8px 6px', color: 'text.secondary', fontWeight: 400, fontSize: 14, textAlign: 'left', '&:hover': { bgcolor: tokens.surface2, color: 'text.primary' } }}>{children}</Button>
);
const Aviso = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14 }}>{children}</Box>;

// Se vuelve a pintar sola cada medio segundo mientras algo corre (la espera, un cronómetro)
function usarTic(activo: boolean) {
  const [, tic] = useState(0);
  useEffect(() => { if (!activo) return undefined; const t = setInterval(() => tic((n) => n + 1), 500); return () => clearInterval(t); }, [activo]);
}
const ESPERA: Record<string, object> = { esperar: { bgcolor: tokens.amarilloFondo, color: tokens.amarillo }, casi: { bgcolor: tokens.brandSoft, color: tokens.brandClaro }, listo: { bgcolor: tokens.brandSoft, color: tokens.brand } };
function Espera({ desde }: { desde: number }) {
  usarTic(true);
  const t = textoEspera(desde) as Fin;
  return <Box sx={{ fontWeight: 700, fontSize: 15, p: '8px 10px', borderRadius: '10px', ...ESPERA[t.clase] }}>{t.texto}</Box>;
}
function Cronometro({ h, c, fecha }: { h: Fin; c: Fin; fecha: string }) {
  const corre = !!(c && c.inicio);
  usarTic(corre);
  const s = segundosCrono(c) as number;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', color: 'text.secondary' }} data-f={fecha}>
      <Box component="span" role="timer" sx={{ fontVariantNumeric: 'tabular-nums', fontSize: 22, fontWeight: 800, color: 'text.primary' }}>{reloj(s)}</Box> / {reloj(h.segundos)}{' '}
      <Button color="secondary" data-accion="crono" data-id={h.id}>{corre ? '⏸ Pausa' : '▶ ' + (s ? 'Seguir' : 'Iniciar')}</Button>
    </Box>
  );
}

function extra(e: Fin, h: Fin, d: Fin, fecha: string) {
  const reg = d.habitos[h.id], pastilla = h.tipo === 'espera' && !reg && pastillaDe(d);
  if (pastilla) return <Espera desde={pastilla.ts} />;
  if (h.tipo === 'cuenta' && !reg) {
    const a = e.activo, corriendo = a && a.tipo === 'habito' && a.habito === h.id;
    return corriendo ? <Nota sx={{ m: 0 }}>Cronómetro en curso…</Nota> : <Button color="secondary" data-accion="cuenta" data-id={h.id} sx={{ justifySelf: 'start' }}>▶ {h.segundos} s</Button>;
  }
  if (h.tipo === 'sesion' && !reg) return <Button color="secondary" data-accion="sesion" data-sesion={h.sesion} data-habito={h.id} sx={{ justifySelf: 'start' }}>▶ Guiada</Button>;
  if (h.tipo === 'texto') return <CampoLargoSolo filas={2} data-cambio="habito-texto" data-id={h.id} placeholder={'1. …\n2. …'} aria-label={h.nombre} defaultValue={textoHabito(d, h)} />;
  if (h.tipo === 'cronometro') return <Cronometro h={h} c={d.crono[h.id]} fecha={fecha} />;
  return null;
}

// Día del partido y el siguiente: la caminata se acorta para llegar fresco y recuperar
const esCaminata = (h: Fin) => h.tipo === 'cronometro' && /camin/i.test(h.nombre);
const TIPOS_RAPIDOS: [string, string][] = [['check', 'Marcar'], ['texto', 'Con texto'], ['cuenta', 'Cuenta regresiva'], ['cronometro', 'Cronómetro']];

function Agregar({ e }: { e: Fin }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', mt: '10px' }}>
      <Box sx={{ gridColumn: '1 / -1' }}>
        <CampoSolo data-cambio="manana-nuevo" list="ideas-habitos" placeholder="＋ Nuevo hábito (Enter para agregar)" aria-label="Nuevo hábito de la mañana" />
        <datalist id="ideas-habitos">{(IDEAS_HABITOS as Fin[]).filter((x) => !e.habitos.some((h: Fin) => h.nombre === x.nombre)).map((x) => <option key={x.nombre} value={x.nombre} />)}</datalist>
      </Box>
      <NativeSelect defaultValue={M.tipoNuevo()} input={<OutlinedInput />} inputProps={{ 'data-cambio': 'manana-tipo', 'aria-label': 'Tipo del nuevo hábito' } as object}>
        {TIPOS_RAPIDOS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </NativeSelect>
      <Button color="secondary" href="#editar/habitos">✏️ Editar</Button>
    </Box>
  );
}

export function CabeceraManana({ fecha = iso() }: { fecha?: string }) {
  const n = hechosManana(fecha) as number, total = habitosDe(fecha).length, r = racha(fecha) as number;
  if (!total) return null;
  return (
    <>
      <Box sx={{ ...FILA, mb: '6px' }}>
        <span><b>{n} / {total}</b> hechos</span>
        <Box component="span" title="Días con la mañana completa. Un día fallado no la corta; dos seguidos, sí." sx={{ fontWeight: 700, color: 'warning.main' }}>🔥 {r} día{r === 1 ? '' : 's'}</Box>
      </Box>
      <Avance parte={fraccionManana(fecha)} />
    </>
  );
}

export function ListaManana({ e, fecha = iso() }: { e: Fin; fecha?: string }) {
  const d = dia(fecha) as Fin;
  if (!e.habitos.length) return <><Nota>Aún no tienes hábitos de mañana. Agrega el primero aquí abajo.</Nota><Agregar e={e} /></>;
  const lista = habitosDe(fecha) as Fin[];
  if (!lista.length) return <><Nota>Hoy no tienes hábitos programados. Día libre 🙌</Nota><Agregar e={e} /></>;
  const corta = mananaCorta(fecha);
  return (
    <>
      {corta === 'hoy' ? <Aviso>⚽ Hoy juegas: con 20 min suaves de caminata basta, llega fresco al partido.</Aviso> : null}
      {corta === 'ayer' ? <Aviso>⚽ Ayer jugaste: hoy va la versión corta. Lo que no se negocia: pastilla, desayuno, estirar y tus 3 prioridades. La caminata con 20 min suaves basta.</Aviso> : null}
      <Box sx={{ mb: '10px' }}><CampoLargo etiqueta="🎯 Mis 3 prioridades de hoy" filas={3} data-cambio="prioridades" data-f={fecha} placeholder={'1. …\n2. …\n3. …'} defaultValue={prioridadesDe(fecha)} /></Box>
      <Box component="ol" sx={{ listStyle: 'none', m: '8px 0 0', p: 0, display: 'grid', gap: '8px' }}>
        {lista.map((h, i) => {
          const reg = d.habitos[h.id], partido = !reg && corta && esCaminata(h);
          return (
            <Box component="li" key={h.id} data-tip={reg && h.detalle ? h.nombre + '\n' + h.detalle : undefined} sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start', p: '10px', borderRadius: '12px', bgcolor: 'background.default' }}>
              <ButtonBase data-accion="marcar" data-id={h.id} aria-pressed={!!reg} aria-label={h.nombre}
                sx={{ flex: 'none', width: 52, height: 52, borderRadius: '50%', border: '2px solid', fontSize: 20, fontWeight: 800, ...(reg ? { bgcolor: 'primary.main', borderColor: 'primary.main', color: 'primary.contrastText' } : { bgcolor: tokens.surface2, borderColor: 'divider', color: 'text.secondary' }) }}>
                {reg ? '✓' : i + 1}
              </ButtonBase>
              <Box sx={{ flex: 1, minWidth: 0, display: 'grid', gap: '6px', pt: '4px' }}>
                <Box sx={{ fontWeight: 700, fontSize: 17, ...(reg ? { color: 'text.secondary', textDecoration: 'line-through', textDecorationColor: tokens.line } : null) }}>{h.nombre}</Box>
                <Box sx={{ color: 'text.secondary', fontSize: 14 }}>{reg ? (reg.minimo ? '🌱 Versión mínima a las ' : 'Hecho a las ') + hora(reg.ts) : h.detalle || ''}</Box>
                {extra(e, h, d, fecha)}
                {partido ? <Suave datos={{ 'data-accion': 'marcar-minimo', 'data-id': h.id }}>⚽ Versión partido: 20 min suaves</Suave> : null}
                {!partido && !reg && h.minimo ? <Suave datos={{ 'data-accion': 'marcar-minimo', 'data-id': h.id }}>🌱 Hoy solo el mínimo: {h.minimo}</Suave> : null}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Agregar e={e} />
    </>
  );
}

export default function Manana() {
  const e = usarEstado() as Fin;
  return (
    <>
      <TituloPantalla>Primera hora</TituloPantalla>
      <Card component="section" sx={{ mb: '14px' }}>
        <CabeceraManana />
        <ListaManana e={e} />
      </Card>
    </>
  );
}
