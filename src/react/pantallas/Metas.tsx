// 🎯 Metas del día: agua, pasos, calorías, lectura y pantalla, con el historial de 7 y 30 días. React pinta; las reglas
// son las de src/vistas/metas.js (agua, meta, comida, crono-lectura, meta-pantalla, lectura-mas). La tarjeta HTML de cada
// meta (tarjetaMeta) sigue allá para Hoy hasta que Hoy se pase a React.
import { useEffect, useState } from 'react';
import { Box, Button, Card, Link } from '@mui/material';
import { avanceMetas, segundosCrono } from '../../estado.js';
import { iso, sumarDias, fechaCorta, reloj, diaSemana } from '../../fechas.js';
import { pct, miles } from '../../ui.js';
import { METAS as NOMBRES, visibles } from '../../orden.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, DOS } from '../ui/Campo';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';
import { Avance } from '../ui/Varios';
import { Ajustar } from '../ui/Rapido';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'metas';
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const UNIDAD: Record<string, string> = { agua: 'ml', pasos: '', calorias: 'kcal', lectura: 'min', pantalla: 'min' };
const formato = (k: string, v: number | null | undefined) => (k === 'pantalla' && v == null ? '—' : k === 'agua' ? ((v || 0) / 1000).toLocaleString('es-CO', { maximumFractionDigits: 2 }) + ' L' : miles(v) + (UNIDAD[k] ? ' ' + UNIDAD[k] : ''));
const nombres = NOMBRES as Record<string, string>;
const Grande = { minHeight: 56, fontSize: 17 };

// El cronómetro de lectura corre aquí mismo (su propio reloj, sin el data-crono de las pantallas de antes)
function Reloj({ c }: { c: Fin }) {
  const [, tic] = useState(0), corre = !!(c && c.inicio);
  useEffect(() => { if (!corre) return undefined; const t = setInterval(() => tic((n) => n + 1), 500); return () => clearInterval(t); }, [corre]);
  return <Box component="span" role="timer" sx={{ fontVariantNumeric: 'tabular-nums', fontSize: 22, fontWeight: 800, color: 'text.primary' }}>{reloj(segundosCrono(c))}</Box>;
}

function controles(e: Fin, k: string) {
  const m = ((e.dias[iso()] || {}).metas || {}) as Fin;
  if (k === 'agua') return (
    <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' }}>
      <Button color="secondary" data-accion="agua" data-ml="250" sx={{ ...Grande, flex: 1 }}>+250 ml</Button>
      <Button color="secondary" data-accion="agua" data-ml="500" sx={{ ...Grande, flex: 1 }}>+500 ml</Button>
      <Button color="secondary" data-accion="agua" data-ml="-250" aria-label="Quitar 250 ml" sx={{ minWidth: 56 }}>−</Button>
    </Box>
  );
  if (k === 'pasos') return <Ajustar etiqueta="Pasos de hoy" valor={m.pasos || null} base={0} paso={1000} max={100000} accion="meta" datos={{ k: 'pasos' }}
    fichas={[['+500', 500], ['+2.000', 2000], ['+5.000', 5000]].map(([t, n]) => [(m.pasos || 0) + (n as number), t] as [number, string])} />;
  if (k === 'calorias') return (
    <>
      <Box sx={DOS}>
        <Campo etiqueta="Fuera del plan" type="number" inputMode="numeric" min={0} data-cambio="meta" data-k="calorias" defaultValue={m.calorias || ''} placeholder="0" />
        <Campo etiqueta="Sumar comida" type="number" inputMode="numeric" min={0} data-cambio="comida" dePaso placeholder="kcal" />
      </Box>
      <Link href="#dieta" sx={{ display: 'block', mt: '6px', fontSize: 14, color: 'text.secondary' }}>Las comidas del plan se marcan en 🥗 Dieta y se suman solas.</Link>
    </>
  );
  if (k === 'pantalla') return (
    <>
      <Campo etiqueta="Minutos de redes y entretenimiento hoy" type="number" inputMode="numeric" min={0} data-cambio="meta-pantalla" defaultValue={m.pantalla ?? ''} placeholder="Ej.: 90" />
      <Nota>Míralo en Ajustes del celular → Bienestar digital (o Tiempo en pantalla). Anótalo en la noche: aquí menos es mejor.</Nota>
    </>
  );
  const c = ((e.dias[iso()] || {}).crono || {}).lectura, corre = c && c.inicio;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', color: 'text.secondary' }}>
      <Reloj c={c} />
      <Button color="secondary" data-accion="crono-lectura" sx={{ ...Grande, flex: 1 }}>{corre ? '⏸ Pausa' : '▶ Leer'}</Button>
      <Button color="secondary" data-accion="lectura-mas" title="Sumar 5 minutos leídos sin cronómetro">+5 min</Button>
    </Box>
  );
}

// compacta (Hoy): solo el agua lleva sus botones
export function meta(e: Fin, k: string, a: Fin, compacta = false) {
  const cumplida = a.partes[k] >= 1;
  return (
    <div key={k}>
      <Box sx={{ ...FILA, mb: '6px' }}><b>{nombres[k]}</b><span>{formato(k, a.valores[k])}{k === 'pantalla' ? ' / máx. ' : ' / '}{formato(k, a.meta[k])}</span></Box>
      <Avance parte={a.partes[k]} color={cumplida ? 'success.main' : 'info.main'} />
      {compacta && k !== 'agua' ? null : controles(e, k)}
    </div>
  );
}

function historial(e: Fin, dias: number) {
  const filas: { f: string; a: Fin }[] = [];
  for (let i = dias - 1; i >= 0; i--) { const f = sumarDias(iso(), -i) as string; filas.push({ f, a: e.dias[f] ? avanceMetas(f) : null }); }
  return filas;
}

export default function Metas() {
  const e = usarEstado() as Fin, hoy = avanceMetas() as Fin, semana = historial(e, 7), mes = historial(e, 30);
  const promedio = (k: string) => mes.reduce((s, x) => s + (x.a ? x.a.partes[k] : 0), 0) / mes.length;
  const cumplidos = (k: string) => mes.filter((x) => x.a && x.a.partes[k] >= 1).length;
  const letra = (f: string) => 'LMMJVSD'[(diaSemana(f) as number) - 1], ks = visibles(e.config, 'metas') as string[];
  if (!ks.length) return (
    <>
      <TituloPantalla>Metas del día</TituloPantalla>
      <Card component="section"><Parrafo>No tienes metas a la vista.</Parrafo><Button href="#editar/pantallas">Elegir metas →</Button></Card>
    </>
  );
  return (
    <>
      <TituloPantalla>Metas del día</TituloPantalla>
      <Card component="section" sx={{ mb: '14px' }}>
        <Box sx={{ ...FILA, mb: '6px' }}><b>Hoy</b><Box component="span" sx={{ fontSize: 22, fontWeight: 800 }}>{pct(hoy.total)}</Box></Box>
        <Avance parte={hoy.total} />
      </Card>
      <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '16px' }}>{ks.map((k) => meta(e, k, hoy))}</Card>
      <TarjetaPlegable vista={VISTA} clave="Últimos 7 días" titulo="Últimos 7 días">
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, '& th, & td': { p: '6px 4px', textAlign: 'center' }, '& tbody th': { textAlign: 'left', whiteSpace: 'nowrap', fontWeight: 600 }, '& thead small': { display: 'block' } }}>
            <thead><tr><th></th>{semana.map((x) => <th key={x.f} title={fechaCorta(x.f)}>{letra(x.f)}<small>{String(fechaCorta(x.f)).split(' ')[0]}</small></th>)}</tr></thead>
            <tbody>
              {ks.map((k) => (
                <tr key={k}>
                  <th>{nombres[k]}</th>
                  {semana.map((x) => {
                    const p = x.a ? x.a.partes[k] : 0;
                    return (
                      <td key={x.f}>
                        <Box component="span" title={pct(p)} sx={{ display: 'inline-grid', placeItems: 'center', width: 28, height: 28, borderRadius: '50%', fontSize: 13, fontWeight: 800, color: 'primary.contrastText',
                          bgcolor: 'color-mix(in srgb, ' + tokens.verde + ' ' + Math.min(1, p) * 100 + '%, ' + tokens.surface2 + ')' }}>{p >= 1 ? '✓' : ''}</Box>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="Últimos 30 días" titulo="Últimos 30 días">
        {ks.map((k) => (
          <div key={k}>
            <Box sx={{ ...FILA, mb: '6px' }}><span>{nombres[k]}</span><span>{cumplidos(k)} días cumplida · promedio {pct(promedio(k))}</span></Box>
            <Avance parte={promedio(k)} />
          </div>
        ))}
      </TarjetaPlegable>
    </>
  );
}
