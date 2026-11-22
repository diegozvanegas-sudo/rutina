// 📅 Lo que viene: los próximos 30 días de pagos fijos, cuotas, ingresos y cobros cruzados con lo que hay en las cuentas.
// La cuenta está en src/flujo.js; los botones son las acciones de siempre (fin-pagar-fijo, fin-pagar-deuda, fin-cobrar).
import type { ReactNode } from 'react';
import { Box, Button, Card } from '@mui/material';
import { fechaCorta, sumarDias } from '../../fechas.js';
import { pesos } from '../../finanzas.js';
import { loQueViene, DIAS_VIENE } from '../../flujo.js';
import { Aviso, Chico, FILA } from './finanzasPiezas';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Desplegable } from '../ui/Desplegable';
import { Nota } from '../ui/Textos';
import { Cifras } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'finanzas';
const SEMANA = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const ICONO: Record<string, string> = { ingreso: '💰', fijo: '🔁', deuda: '💳', cobro: '🤝' };
const BOTON: Record<string, string> = { ingreso: 'Ya llegó', fijo: 'Registrar pago', deuda: 'Registrar pago', cobro: 'Me pagó' };
const ACCION: Record<string, string> = { ingreso: 'fin-pagar-fijo', fijo: 'fin-pagar-fijo', deuda: 'fin-pagar-deuda', cobro: 'fin-cobrar' };

const Rojo = ({ children }: { children: ReactNode }) => (
  <Box component="p" role="alert" sx={{ color: tokens.rojoSuave, bgcolor: tokens.rojoFondo, border: '1px solid', borderColor: tokens.rojo, borderRadius: '10px', p: '8px 10px', fontSize: 14, my: '8px' }}>{children}</Box>
);
const conSigno = (n: number) => (n < 0 ? '−' : '') + pesos(Math.abs(n));
const irA = (p: string) => () => accion('fin-pestana', { p });

function nombreDia(fecha: string, hoy: string) {
  if (fecha === hoy) return 'Hoy';
  if (fecha === sumarDias(hoy, 1)) return 'Mañana';
  const [a, m, d] = fecha.split('-').map(Number);
  return SEMANA[new Date(a, m - 1, d).getDay()] + ' ' + fechaCorta(fecha);
}

function evento(x: Fin) {
  const entra = x.signo > 0;
  return (
    <Box key={x.tipo + x.id + x.dia} data-t="viene-evento" sx={{ py: '8px', borderBottom: '1px solid', borderColor: 'divider', '&:last-of-type': { borderBottom: 0 } }}>
      <Box sx={FILA}>
        <span>{ICONO[x.tipo]} {x.tipo === 'cobro' ? 'Te paga ' + x.nombre : x.nombre}</span>
        <Box component="b" sx={{ color: entra ? 'success.main' : undefined, whiteSpace: 'nowrap' }}>{(entra ? '+' : '−') + pesos(x.monto)}</Box>
      </Box>
      <Box sx={{ display: 'grid', justifyItems: 'start', gap: '2px' }}>
        {x.vencido && <Chico>{entra ? 'Debía llegar el ' + fechaCorta(x.dia) + (x.tipo === 'ingreso' ? ': no se cuenta hasta que lo registres' : '') : 'Venció el ' + fechaCorta(x.dia) + ': se cuenta como si lo pagaras hoy'}</Chico>}
        {!x.vencido && x.tipo === 'cobro' && <Chico>Interés del mes. No se suma a tu saldo: depende de que te pague</Chico>}
        {x.tarjeta && <Chico>Lo que pagas de la tarjeta este mes (la cuota de 💳 Deudas)</Chico>}
        <Button size="small" color={entra ? 'secondary' : 'primary'} sx={{ mt: '6px' }} onClick={() => accion(ACCION[x.tipo], { id: x.id })}>{BOTON[x.tipo]}</Button>
      </Box>
    </Box>
  );
}

function dia(d: Fin, hoy: string, conSaldo: boolean) {
  const neto = d.entra - d.sale, uno = d.eventos.length === 1 ? d.eventos[0] : null, rojo = conSaldo && d.saldo < 0;
  const titulo = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', width: '100%', minWidth: 0 }}>
      <Box sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <b>{nombreDia(d.fecha, hoy)}</b> <Chico>· {uno ? (uno.tipo === 'cobro' ? 'te paga ' + uno.nombre : uno.nombre) : d.eventos.length + ' movimientos'}</Chico>
      </Box>
      <Box sx={{ textAlign: 'right', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
        <Box component="b" sx={{ display: 'block', color: neto > 0 ? 'success.main' : undefined }}>{neto ? (neto > 0 ? '+' : '−') + pesos(Math.abs(neto)) : d.teDeben ? '+' + pesos(d.teDeben) + '?' : '—'}</Box>
        {conSaldo && <Box component="small" sx={{ fontSize: 12, color: rojo ? tokens.rojo : 'text.secondary', fontWeight: rojo ? 800 : undefined }}>quedan {conSigno(d.saldo)}</Box>}
      </Box>
    </Box>
  );
  return (
    <Box key={d.fecha} data-t="viene-dia" data-rojo={rojo ? 'si' : undefined} sx={rojo ? { borderLeft: '3px solid', borderColor: tokens.rojo, pl: '4px' } : undefined}>
      {/* El renglón ocupa todo el ancho: el monto y lo que queda pegados a la derecha */}
      <Desplegable titulo={titulo} sx={{ '& .MuiAccordionSummary-content > span:last-of-type': { flex: 1, minWidth: 0 } }}>{d.eventos.map(evento)}</Desplegable>
    </Box>
  );
}

export function viene(f: Fin) {
  const r = loQueViene(f) as Fin, hoy: string = r.hoy, conSaldo = r.inicial != null;
  const libres: number | null = r.libres, rojoLibres = libres != null && libres < 0;
  return (
    <>
      <Card component="section" data-t="viene-resumen" sx={{ mb: '14px', display: 'grid', gap: '6px' }}>
        {conSaldo ? (
          <>
            <Box component="small" sx={{ color: 'text.secondary', fontSize: 14 }}>
              {r.pago ? <>Te quedan libres hasta el día de pago ({r.pago.fecha === hoy ? 'hoy' : nombreDia(r.pago.fecha, hoy).toLowerCase()})</> : <>Te quedarían al final de los próximos {DIAS_VIENE} días</>}
            </Box>
            <Box component="b" data-t="viene-libres" sx={{ fontSize: 34, lineHeight: 1.1, color: rojoLibres ? tokens.rojo : 'success.main' }}>{conSigno(libres as number)}</Box>
            {r.pago && !rojoLibres && (
              <Nota sx={{ my: 0 }}>Son <b>{pesos(r.porDiaLibre)} por día</b> durante {r.diasHasta} {r.diasHasta === 1 ? 'día' : 'días'} para comida, transporte y lo demás
                {r.variable ? <>. Normalmente gastas {pesos(r.variable)} al día{r.porDiaLibre < r.variable ? ', así que este mes toca apretarse' : ''}.</> : '.'}
              </Nota>
            )}
            {!r.pago && <Nota sx={{ my: 0 }}>Para saber cuánto te queda hasta el día de pago, agrega tu salario en <Button size="small" variant="text" sx={{ p: 0, minWidth: 0, verticalAlign: 'baseline' }} onClick={irA('fijos')}>🔁 Fijos</Button>.</Nota>}
            <Chico>Contando {conSigno(r.inicial)} que hay hoy en {r.cuentas === 1 ? 'tu cuenta' : 'tus ' + r.cuentas + ' cuentas'} y los pagos de abajo. No cuenta lo que gastes en el día a día.</Chico>
          </>
        ) : (
          <>
            <b>¿Cuánta plata tienes hoy?</b>
            <Nota sx={{ my: 0 }}>Anota el saldo real de tus cuentas y aquí sale cuánto te queda libre hasta el día de pago y si algún día quedas en negativo. Mientras tanto ves lo que tienes que pagar.</Nota>
            <Button fullWidth onClick={irA('resumen')}>Anotar saldos en 📈 Resumen</Button>
          </>
        )}
        {r.negativo && (
          r.negativo.fecha === hoy
            ? <Rojo>⚠ <b>Hoy ya estás en {conSigno(r.negativo.saldo)}</b> contando lo vencido. Si el saldo de tus cuentas no es ese, ajústalo en 📈 Resumen; si lo es, pasa plata de tu ahorro o pide plazo para no pagar intereses de mora.</Rojo>
            : <Rojo>⚠ <b>El {nombreDia(r.negativo.fecha, hoy).toLowerCase()} quedarías en {conSigno(r.negativo.saldo)}</b> con los pagos que tienes. Antes de esa fecha: mueve un pago, pide plazo o pasa plata de tu ahorro, para no caer en sobregiro ni pagar intereses de mora.</Rojo>
        )}
        {!r.negativo && r.seAcaba && (
          <Aviso>Gastando lo de siempre ({pesos(r.variable)} al día), la plata alcanza hasta el <b>{nombreDia(r.seAcaba.fecha, hoy).toLowerCase()}</b>{r.pago && r.seAcaba.fecha < r.pago.fecha ? ', antes de que llegue el pago' : ''}.</Aviso>
        )}
        {r.vencidos.some((x: Fin) => x.signo < 0) && <Aviso>Tienes {r.vencidos.filter((x: Fin) => x.signo < 0).length} {r.vencidos.filter((x: Fin) => x.signo < 0).length === 1 ? 'pago vencido' : 'pagos vencidos'}. Si ya lo pagaste, regístralo abajo para que no se cuente.</Aviso>}
      </Card>

      {r.eventos.length > 0 && (
        <Cifras datos={[
          { titulo: 'Sale', valor: pesos(r.sale) },
          { titulo: 'Entra', valor: pesos(r.entra), color: tokens.verde },
          ...(r.teDeben ? [{ titulo: 'Te deben', valor: pesos(r.teDeben), nota: 'no se cuenta' }] : []),
        ]} />
      )}

      <TarjetaPlegable vista={VISTA} clave="📅 Día por día" titulo={'📅 Próximos ' + DIAS_VIENE + ' días'}>
        {r.porDia.length ? (
          <Box data-t="viene-lista">{r.porDia.map((d: Fin) => dia(d, hoy, conSaldo))}</Box>
        ) : (
          <Nota>No hay pagos ni ingresos con fecha en los próximos {DIAS_VIENE} días. Agrega tus pagos de cada mes en 🔁 Fijos y las cuotas en 💳 Deudas.</Nota>
        )}
        <Nota>Toca un día para ver qué pagas y registrarlo. Salen los 🔁 fijos, las cuotas de 💳 deudas y tarjetas, tus ingresos fijos y lo que te deben.</Nota>
      </TarjetaPlegable>

      {(r.faltan.length > 0 || r.sinAjustar.length > 0) && (
        <TarjetaPlegable vista={VISTA} clave="📅 No se cuenta" titulo="Lo que no se está contando">
          {r.sinAjustar.length > 0 && <Nota>Cuentas sin saldo anotado (su plata no se suma): <b>{r.sinAjustar.map((m: Fin) => m.nombre).join(', ')}</b>. Anótalo en 📈 Resumen → Cuentas.</Nota>}
          {r.faltan.map((x: Fin) => (
            <Box key={x.tipo + x.nombre} sx={{ ...FILA, py: '6px' }}>
              <span>{ICONO[x.tipo]} {x.nombre} <Chico>· le falta {x.falta}</Chico></span>
              <Button size="small" color="secondary" onClick={irA(x.tipo === 'deuda' ? 'deudas' : 'fijos')}>Completar</Button>
            </Box>
          ))}
        </TarjetaPlegable>
      )}
    </>
  );
}
