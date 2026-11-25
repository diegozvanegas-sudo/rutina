// ＋ Anotar rápido: desde cualquier pantalla, el botón redondo de abajo abre esta hoja con lo que más se anota en el día
// (peso, pasos, agua, comida del plan, un gasto, una nota) sin buscar la sección. Cada cosa usa la misma acción de su
// sección (dieta-peso, meta, dieta-comer-todo), así que se guarda igual que allá. main.js la abre con "rutina:anotar".
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, Drawer } from '@mui/material';
import { iso } from '../../fechas.js';
import { ve } from '../../permisos.js';
import { comidasDelDia } from '../../control.js';
import { usarEstado } from '../usarEstado';
import { Ajustar } from '../ui/Rapido';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const f1 = (n: number) => n.toLocaleString('es-CO', { maximumFractionDigits: 1 });

function Fila({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gap: '6px', py: '10px', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box component="b" sx={{ fontSize: 16 }}>{titulo}</Box>
      {children}
    </Box>
  );
}

export default function Anotar() {
  const est = usarEstado() as Fin, [abierto, poner] = useState(false);
  useEffect(() => {
    const abrir = () => poner(true), cerrar = () => poner(false);
    window.addEventListener('rutina:anotar', abrir);
    window.addEventListener('hashchange', cerrar);
    return () => { window.removeEventListener('rutina:anotar', abrir); window.removeEventListener('hashchange', cerrar); };
  }, []);
  const hoy = iso(), d = (est.dias || {})[hoy] || {}, m = d.metas || {}, metas = est.config.metas || {};
  const ultimoPeso = Object.keys(est.dias || {}).filter((f) => f < hoy).sort().reverse().map((f) => est.dias[f].peso).find((p: number) => p > 0) as number | undefined;
  const comidas = ve('seccion', 'dieta') ? comidasDelDia(hoy, est) as Fin : null;
  const pasos = Number(m.pasos) || 0, agua = Number(m.agua) || 0;
  return (
    <Drawer anchor="bottom" open={abierto} onClose={() => poner(false)}
      slotProps={{ paper: { 'aria-label': 'Anotar rápido', sx: { maxWidth: 560, mx: 'auto', borderRadius: '18px 18px 0 0', p: '6px 16px calc(16px + env(safe-area-inset-bottom))', maxHeight: '88vh' } } as object }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', pt: '6px' }}>
        <Box component="h2" sx={{ m: 0, fontSize: 20 }}>＋ Anotar rápido</Box>
        <Button color="secondary" aria-label="Cerrar" onClick={() => poner(false)} sx={{ minWidth: 44 }}>✕</Button>
      </Box>
      {ve('seccion', 'dieta') ? (
        <Fila titulo={d.peso ? '⚖️ Peso de hoy: ' + f1(d.peso) + ' kg' : '⚖️ Peso de hoy'}>
          <Ajustar etiqueta="Peso de hoy" valor={d.peso || null} base={ultimoPeso || ((est.dieta || {}).config || {}).pesoBase} paso={0.1} decimales={1} min={20} max={300} unidad="kg" accion="dieta-peso"
            fichas={ultimoPeso && !d.peso ? [[ultimoPeso, 'Igual que la última · ' + f1(ultimoPeso) + ' kg']] : []} />
        </Fila>
      ) : null}
      {comidas && comidas.plan ? (
        <Fila titulo={'🍽️ Comida del plan: ' + comidas.hechas + ' de ' + comidas.plan}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {comidas.hechas < comidas.plan ? <Button color="secondary" data-accion="dieta-comer-todo">✓ Comí como el plan</Button> : null}
            <Button color="secondary" href="#dieta">Marcar una por una →</Button>
          </Box>
        </Fila>
      ) : null}
      {ve('seccion', 'metas') ? (
        <>
          <Fila titulo={'👟 Pasos: ' + pasos.toLocaleString('es-CO') + (metas.pasos ? ' de ' + Number(metas.pasos).toLocaleString('es-CO') : '')}>
            <Ajustar etiqueta="Pasos de hoy" valor={pasos || null} base={0} paso={1000} max={100000} accion="meta" datos={{ k: 'pasos' }}
              fichas={[['+2.000', 2000], ['+5.000', 5000]].map(([t, n]) => [pasos + (n as number), t] as [number, string])} />
          </Fila>
          <Fila titulo={'💧 Agua: ' + agua.toLocaleString('es-CO') + ' ml' + (metas.agua ? ' de ' + Number(metas.agua).toLocaleString('es-CO') : '')}>
            <Ajustar etiqueta="Agua de hoy" valor={agua || null} base={0} paso={250} max={10000} unidad="ml" accion="meta" datos={{ k: 'agua' }}
              fichas={[['+250 ml', 250], ['+500 ml', 500]].map(([t, n]) => [agua + (n as number), t] as [number, string])} />
          </Fila>
        </>
      ) : null}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', pt: '12px' }}>
        {ve('seccion', 'finanzas') ? <Button color="secondary" href="#finanzas/registrar" data-t="anotar-gasto">💸 Un gasto</Button> : null}
        {ve('seccion', 'notas') ? <Button color="secondary" href="#notas" data-t="anotar-nota">📝 Notas</Button> : null}
      </Box>
    </Drawer>
  );
}
