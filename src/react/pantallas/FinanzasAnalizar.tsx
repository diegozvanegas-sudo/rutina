// 🤖 Analizar: el prompt completo para la IA con los gastos del mes cruzados con el plan (🎯 Presupuesto, fijos, deudas y metas).
// Se copia o se comparte con un toque y, con la clave de 🌱 Mi vida → IA, se analiza aquí mismo. Desde la pestaña se gestiona:
// el mes, tus metas con la plata, qué datos van y las instrucciones (editables, con "Volver a las de siempre").
// El texto lo arma src/prompt-gastos.js; lo que eliges se guarda en finanzas.analisis.
import { useState } from 'react';
import { Box, Button, Card, Chip } from '@mui/material';
import { e, guardar } from '../../estado.js';
import { iso } from '../../fechas.js';
import { mesDe, sumarMeses } from '../../finanzas.js';
import { promptGastos, INSTRUCCIONES_GASTOS, instruccionesGastos, opcionesGastos, nombreMesLargo } from '../../prompt-gastos.js';
import { copiarTexto, toast } from '../../ui.js';
import { claveIA, pedirRevisionIA } from '../../ia';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Desplegable } from '../ui/Desplegable';
import { CampoLargo } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import { Opciones } from '../ui/Varios';
import { FILA } from './finanzasPiezas';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'finanzas';
const SISTEMA = 'Eres un asesor financiero personal. Respondes en español de Colombia, directo y honesto, sin halagos. Usa títulos cortos, tablas y listas. ' +
  'Haz las cuentas con los datos que te dan y no inventes ninguno.';
const TEXTO = { width: '100%', boxSizing: 'border-box', whiteSpace: 'pre-wrap', font: '13px/1.5 ui-monospace, Consolas, monospace', bgcolor: 'background.default', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: '10px', p: '10px' } as const;

const ajustes = (): Fin => (e().finanzas.analisis ??= {});
function poner(k: string, v: unknown) {
  const a = ajustes();
  if (v === '' || v == null) delete a[k]; else a[k] = v;
  guardar();
}

// Este mes y los 5 anteriores (los que tienen movimientos, más el actual)
function meses(f: Fin, hoy: string): [string, string][] {
  const lista: [string, string][] = [];
  for (let i = 0; i < 6; i++) {
    const m = mesDe(sumarMeses(hoy.slice(0, 8) + '01', -i));
    if (i === 0 || f.movimientos.some((x: Fin) => x.fecha.startsWith(m))) lista.push([m, i === 0 ? 'Este mes' : nombreMesLargo(m)]);
  }
  return lista;
}

export function analizar(f: Fin) {
  return <Analizar f={f} />;
}

function Analizar({ f }: { f: Fin }) {
  const hoy = iso(), [mes, ponerMes] = useState(mesDe(hoy)), op = opcionesGastos(f), propias = !!(f.analisis && f.analisis.instrucciones && f.analisis.instrucciones.trim());
  const r = promptGastos(f, mes, hoy, op) as Fin, clave = claveIA(), ultima = f.analisis && f.analisis.ultima;
  const [pidiendo, ponerPidiendo] = useState(false), [error, ponerError] = useState('');
  const copiar = () => copiarTexto(r.texto, 'Prompt copiado: pégalo en Claude o en la IA que uses');
  const compartir = async () => {
    if (navigator.share) { try { await navigator.share({ text: r.texto }); return; } catch (err: Fin) { if (err && err.name === 'AbortError') return; } }
    copiar();
  };
  const preguntar = async () => {
    ponerError(''); ponerPidiendo(true);
    try { poner('ultima', { mes, fecha: hoy, texto: await pedirRevisionIA(r.texto, clave, SISTEMA) }); toast('✓ Análisis listo'); } catch (err: Fin) { ponerError(err.message || String(err)); }
    ponerPidiendo(false);
  };
  const interruptor = (k: 'detalle' | 'notas', si: boolean, texto: string) => (
    <Chip clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={(si ? '✓ ' : '') + texto} data-t={'analizar-' + k}
      onClick={() => poner(k, si ? false : null)} sx={{ minHeight: 40 }} />
  );
  return (
    <>
      <Card component="section" data-t="analizar">
        <Box component="h2" sx={{ m: '0 0 4px', fontSize: 18 }}>🤖 Analizar tus gastos con IA</Box>
        <Nota>El prompt completo: tus gastos del mes contra tu plan (🎯 Presupuesto, fijos, deudas y metas), movimiento por movimiento, con las instrucciones para que la IA te diga en qué se va la plata y cómo mejorar. Sin tu nombre ni tu correo.</Nota>
        <Opciones nombre="Mes" opciones={meses(f, hoy)} activa={mes} alElegir={ponerMes} chica />
        <Nota sx={{ mt: 0 }}><b>{nombreMesLargo(mes)}</b> · {r.movimientos} movimientos · {r.texto.length.toLocaleString('es-CO')} caracteres</Nota>
        {r.sinDatos && <Nota sx={{ color: tokens.rojoSuave }}>Este mes no tiene movimientos: anota tus gastos en ➕ Registrar o súbelos en 🏦 Extracto para que el análisis sirva.</Nota>}
        <Box sx={{ display: 'grid', gap: '8px', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Button size="large" data-t="analizar-copiar" onClick={copiar}>📋 Copiar el prompt completo</Button>
          <Button size="large" color="secondary" onClick={compartir}>📤 Compartir</Button>
        </Box>
        <Desplegable perezoso titulo="👁 Ver el prompt completo">
          <Box component="textarea" data-t="analizar-texto" readOnly rows={14} value={r.texto} aria-label="Prompt completo" sx={TEXTO} />
        </Desplegable>
      </Card>

      <TarjetaPlegable vista={VISTA} clave="🤖 Gestionar el prompt" titulo="⚙️ Gestionar el prompt">
        <Nota sx={{ mt: 0 }}>Lo que cambies aquí queda guardado y va en el prompt de todos los meses.</Nota>
        <CampoLargo etiqueta="🎯 Tus metas con la plata (opcional)" filas={2} defaultValue={op.metas} placeholder="Ej.: salir de la tarjeta antes de junio, ahorrar $ 500.000 al mes"
          data-t="analizar-metas" onBlur={(ev) => { const v = ev.currentTarget.value.trim(); if (v !== op.metas) poner('metas', v); }} />
        <Box sx={{ ...FILA, justifyContent: 'flex-start', flexWrap: 'wrap', my: '10px' }}>
          {interruptor('detalle', op.detalle, 'Movimientos uno por uno')}
          {op.detalle && interruptor('notas', op.notas, 'Con sus notas')}
        </Box>
        <CampoLargo key={propias ? 'p' : 'd'} etiqueta={'📝 Instrucciones para la IA' + (propias ? ' (las tuyas)' : ' (las de siempre)')} filas={10} defaultValue={instruccionesGastos(f)}
          data-t="analizar-instrucciones"
          onBlur={(ev) => { const v = ev.currentTarget.value.trim(); if (v === INSTRUCCIONES_GASTOS.trim() || !v) { if (propias) { poner('instrucciones', null); toast('Instrucciones de siempre'); } } else if (v !== instruccionesGastos(f).trim()) { poner('instrucciones', v); toast('✓ Instrucciones guardadas'); } }} />
        {propias && <Button color="secondary" data-t="analizar-restablecer" sx={{ mt: '8px' }} onClick={() => { poner('instrucciones', null); toast('Instrucciones de siempre'); }}>↺ Volver a las de siempre</Button>}
      </TarjetaPlegable>

      <TarjetaPlegable vista={VISTA} clave="🤖 Analizar aquí" titulo="✨ Analizar aquí con Claude">
        {clave ? <>
          <Nota sx={{ mt: 0 }}>Manda el prompt de {nombreMesLargo(mes)} con tu clave de Anthropic (gasta saldo de tu cuenta) y guarda la respuesta aquí.</Nota>
          <Button size="large" disabled={pidiendo} data-t="analizar-ia" onClick={preguntar}>{pidiendo ? 'Analizando… (puede tardar un minuto)' : '✨ Analizar ' + nombreMesLargo(mes)}</Button>
        </> : <Nota sx={{ mt: 0 }}>Para analizarlo sin salir de la app, conecta tu clave en <a href="#vida">🌱 Mi vida</a> → 🤖 IA. Sin clave, copia el prompt y pégalo en Claude.</Nota>}
        {error && <Nota sx={{ color: tokens.rojoSuave }} >{error}</Nota>}
        {ultima && (
          <Box sx={{ mt: '10px' }}>
            <Nota><b>Último análisis:</b> {nombreMesLargo(ultima.mes)}, hecho el {ultima.fecha}</Nota>
            <Box data-t="analizar-respuesta" sx={{ ...TEXTO, font: '14px/1.55 inherit', maxHeight: 480, overflowY: 'auto' }}>{ultima.texto}</Box>
            <Box sx={{ ...FILA, justifyContent: 'flex-start', mt: '8px' }}>
              <Button color="secondary" onClick={() => copiarTexto(ultima.texto, 'Análisis copiado')}>📋 Copiar</Button>
              <Button color="secondary" onClick={() => poner('ultima', null)}>🗑 Borrar</Button>
            </Box>
          </Box>
        )}
      </TarjetaPlegable>
    </>
  );
}
