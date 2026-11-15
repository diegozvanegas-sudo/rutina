// 💰 Finanzas: 💳 Deudas (lo que debes, con simulador de pagar más) y 🤝 Me deben (plata prestada y pendientes).
// React pinta; pagar, cobrar, prestar y saldar son las acciones de src/vistas/finanzas.js.
import { Box, Button, Card } from '@mui/material';
import { iso, fechaCorta } from '../../fechas.js';
import { pesos, estadoDeuda, planPago, esCredito, tarjetaDe, interesPrestamo, estadoCobro, interesesCobrados } from '../../finanzas.js';
import { miles } from '../../ui.js';
import { piezasFinanzas } from '../../vistas/finanzas.js';
import { NombreMetodo } from '../ui/IconoMetodo';
import { accion } from '../acciones';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoSolo, DOS } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { Nota, Parrafo } from '../ui/Textos';
import { Cifras } from '../ui/Varios';
import { ListaPares } from '../ui/ListaPares';
import { listaMovimientos } from './FinanzasMovimientos';
import { Aportar, Aviso, CampoFecha, CampoNumero, CampoPesos, CampoTexto, Chico, Controles, Estado, FILA, GRANDE, Item, Selector } from './finanzasPiezas';

const VISTA = 'finanzas';
/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const { metodo, cuentas, ESTADOS, ESTADOS_COBRO, plazo, simula } = piezasFinanzas as {
  metodo: (id: string) => { nombre: string; icono: string }; cuentas: () => Fin[]; ESTADOS: Record<string, string>; ESTADOS_COBRO: Record<string, string>;
  plazo: (meses: number) => string; simula: Record<string, number>;
};
type Plan = { meses: number; intereses: number };

// ---------- 💳 Deudas ----------
function simulador(d: Fin, actual: Plan) {
  const extra = simula[d.id] || 0, otro = extra ? planPago(d.saldo, d.tasa, (d.cuota || 0) + extra) as Plan : null;
  return (
    <Box sx={{ my: '6px' }}>
      <Campo etiqueta="¿Y si pagas más cada mes?" inputMode="numeric" data-pesos="" placeholder="$ extra al mes" data-cambio="fin-simular" data-id={d.id} defaultValue={extra ? miles(extra) : ''} />
      {otro && (otro.meses === Infinity
        ? <Nota>Aun así no alcanza para el interés.</Nota>
        : <Nota>Con {pesos(extra)} más ({pesos((d.cuota || 0) + extra)} al mes) terminas en <b>{plazo(otro.meses)}</b>{actual.meses !== Infinity
          ? <>, <b>{actual.meses - otro.meses} meses antes</b>, y te ahorras <Box component="b" sx={{ color: 'success.main' }}>{pesos(actual.intereses - otro.intereses)}</Box> en intereses</> : null}.</Nota>)}
    </Box>
  );
}
export function deudas(f: Fin) {
  const lista: Fin[] = f.deudas, total = lista.reduce((s, d) => s + Math.max(0, d.saldo || 0), 0);
  const orden = [...lista].filter((d) => d.saldo > 0).sort((a, b) => (b.tasa || 0) - (a.tasa || 0));
  // Compras con crédito sin tarjeta vinculada: el saldo no sube solo y la cuota se contaría como gasto otra vez
  const sinVincular: Fin[] = f.metodos.filter((m: Fin) => esCredito(f, m.id) && !tarjetaDe(f, m.id) && f.movimientos.some((x: Fin) => x.metodo === m.id));
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave="Lo que debes" titulo="Lo que debes" lado={<Box component="b" sx={{ color: total ? 'error.main' : 'success.main' }}>{pesos(total)}</Box>}>
        {orden.length > 1 && <Nota>Estrategia avalancha: paga el mínimo en todas y lo que sobre a la de mayor interés: <b>{orden[0].nombre}</b> ({orden[0].tasa} % mensual).</Nota>}
        {sinVincular.length > 0 && <Aviso>Tienes compras con {sinVincular.map((m) => m.nombre).join(', ')}. Agrega la tarjeta aquí y en "Compras con" elige ese método: cada compra subirá su saldo y al pagarla solo contarán los intereses.</Aviso>}
      </TarjetaPlegable>
      {lista.map((d, i) => {
        const r = 'finanzas.deudas.' + i, s = d.dia ? estadoDeuda(f, d) as { estado: string } : null, saldo: number = d.saldo || 0;
        const actual = planPago(saldo, d.tasa, d.cuota) as Plan, interes = Math.max(0, saldo) * ((d.tasa || 0) / 100);
        return (
          <Item key={d.id}>
            <Box sx={{ ...FILA, gap: '8px' }}><b>💳 {d.nombre}</b>{s && saldo > 0 ? <Estado estado={s.estado}>{ESTADOS[s.estado]}</Estado> : null}</Box>
            {d.metodo && <Nota>Suben su saldo las compras con <NombreMetodo m={metodo(d.metodo)} />.</Nota>}
            <Cifras datos={[
              { titulo: 'Saldo', valor: saldo < 0 ? pesos(-saldo) + ' a favor' : pesos(saldo) },
              { titulo: 'Cuota', valor: pesos(d.cuota) },
              { titulo: 'Interés del mes', valor: pesos(interes) },
              { titulo: 'Terminas en', valor: saldo > 0 && !d.cuota ? '—' : plazo(actual.meses), nota: actual.intereses && actual.intereses !== Infinity ? 'pagando ' + pesos(actual.intereses) + ' de intereses' : undefined },
            ]} />
            {actual.meses === Infinity && saldo > 0 && d.cuota ? <Aviso>La cuota no alcanza ni para el interés: sube la cuota o refinancia.</Aviso> : null}
            {saldo > 0 && d.cuota && actual.meses !== Infinity ? simulador(d, actual) : null}
            {saldo > 0 && (
              <>
                <Aportar columnas="1fr auto">
                  <CampoSolo inputMode="numeric" data-pesos="" placeholder={d.cuota ? miles(d.cuota) : '$ 0'} aria-label="Monto a pagar" data-pago={d.id} />
                  <Button onClick={() => accion('fin-pagar-deuda', { id: d.id })}>Pagar</Button>
                </Aportar>
                <Nota>Vacío = la cuota de {pesos(d.cuota)}. Primero paga el interés del mes; lo demás baja el saldo.</Nota>
              </>
            )}
            <Desplegable titulo="Editar">
              <Box sx={{ ...DOS, mb: '8px' }}>
                <CampoTexto titulo="Nombre" ruta={r + '.nombre'} valor={d.nombre} />
                <CampoPesos titulo="Saldo" ruta={r + '.saldo'} valor={d.saldo} />
                <CampoPesos titulo="Cuota" ruta={r + '.cuota'} valor={d.cuota} />
                <CampoNumero titulo="Interés % mensual" ruta={r + '.tasa'} valor={d.tasa} />
                <CampoNumero titulo="Día de pago" ruta={r + '.dia'} valor={d.dia} />
                <Selector titulo="Compras con" ruta={r + '.metodo'} valor={d.metodo} opciones={[{ id: '', nombre: 'Ninguno (es un préstamo)' }, ...f.metodos.filter((m: Fin) => !tarjetaDe(f, m.id) || m.id === d.metodo)]} />
              </Box>
              <Controles lista="finanzas.deudas" i={i} nombre={d.nombre} total={lista.length} />
            </Desplegable>
          </Item>
        );
      })}
      <Button fullWidth color="secondary" sx={GRANDE} onClick={() => accion('ed-agregar', { lista: 'finanzas.deudas' })}>＋ Deuda o tarjeta</Button>
    </>
  );
}

// ---------- 🤝 Me deben ----------
function tarjetaPrestamo(f: Fin, p: Fin, i: number) {
  const r = 'finanzas.prestamos.' + i, monto: number = p.monto || 0, int: number = interesPrestamo(p), cobrado: number = interesesCobrados(f, p.id);
  const s = monto > 0 && p.tasa && p.dia ? estadoCobro(f, p) as { estado: string } : null, nuevo = p.nombre === 'Nuevo préstamo' && !monto;
  const movs: Fin[] = f.movimientos.filter((m: Fin) => m.prestamo === p.id), debe = monto > 0;
  return (
    <Item key={p.id}>
      <Box sx={{ ...FILA, gap: '8px' }}><b>🤝 {p.nombre}</b>{s ? <Estado estado={s.estado}>{ESTADOS_COBRO[s.estado]}</Estado> : null}</Box>
      {debe ? (
        <Cifras datos={[
          { titulo: 'Te debe', valor: pesos(monto) },
          ...(p.tasa ? [{ titulo: 'Interés al mes (' + p.tasa + ' %)', valor: pesos(int), color: 'success.main', nota: p.dia ? 'el día ' + p.dia : undefined }] : []),
          ...(cobrado ? [{ titulo: 'Te ha pagado de intereses', valor: pesos(cobrado) }] : []),
        ]} />
      ) : <Nota>Pendiente{nuevo ? '' : ' sin monto'}. Si sabes cuánto es, anótalo abajo con "Le presté".</Nota>}
      {p.nota && <Nota>{p.nota}</Nota>}
      {p.limite && (p.limite < iso() ? <Aviso>Quedó de pagarte el {fechaCorta(p.limite)} y ya pasó: recuérdale.</Aviso> : <Nota>Quedó de pagarte el {fechaCorta(p.limite)}.</Nota>)}
      <Box sx={{ display: 'grid', gap: '8px' }}>
        <b>Anotar un movimiento</b>
        <Box sx={DOS}>
          <Campo dePaso etiqueta="Cuánto" inputMode="numeric" data-pesos="" placeholder={int && debe ? miles(int) : '$ 0'} data-cobro={p.id} />
          <Campo dePaso etiqueta="Fecha" type="date" data-cobro-fecha={p.id} defaultValue={iso()} max={iso()} />
        </Box>
        <Campo dePaso etiqueta="Nota (opcional)" data-cobro-nota={p.id} />
        <Box sx={debe ? DOS : undefined}>
          {debe && <Button onClick={() => accion('fin-cobrar', { id: p.id })}>Me pagó</Button>}
          <Button color="secondary" fullWidth={!debe} onClick={() => accion('fin-prestar', { id: p.id })}>Le presté{debe ? ' más' : ''}</Button>
        </Box>
        {debe && <Nota>{int ? 'Si pagó y dejas Cuánto vacío, cuenta el interés del mes (' + pesos(int) + '). ' : ''}De un pago, primero se cuenta el interés (eso es ingreso); lo demás baja lo que te debe.</Nota>}
      </Box>
      {movs.length > 0 && <Desplegable titulo={'Movimientos (' + movs.length + ')'}>{listaMovimientos(f, movs)}</Desplegable>}
      {debe && <Button fullWidth color="secondary" onClick={() => accion('fin-saldar', { id: p.id })}>✓ Ya me pagó todo</Button>}
      <Desplegable titulo="Editar datos del préstamo" abiertoAlInicio={nuevo}>
        <Box sx={{ ...DOS, mb: '8px' }}>
          <CampoTexto titulo="Quién o qué" ruta={r + '.nombre'} valor={p.nombre} />
          <CampoPesos titulo="Te debe" ruta={r + '.monto'} valor={p.monto} />
          <CampoNumero titulo="Interés % mensual" ruta={r + '.tasa'} valor={p.tasa} />
          <CampoNumero titulo="Día de cobro" ruta={r + '.dia'} valor={p.dia} />
          <CampoFecha titulo="Quedó de pagarte (opcional)" ruta={r + '.limite'} valor={p.limite} />
          <Selector titulo="Cuenta de los movimientos" ruta={r + '.metodo'} valor={p.metodo || 'transferencia'} opciones={cuentas()} />
        </Box>
        <Box sx={{ mb: '8px' }}><CampoTexto titulo="Nota" ruta={r + '.nota'} valor={p.nota} /></Box>
        <Controles lista="finanzas.prestamos" i={i} nombre={p.nombre} total={f.prestamos.length} />
      </Desplegable>
    </Item>
  );
}
export function prestamos(f: Fin) {
  const todos = (f.prestamos as Fin[]).map((p, i) => ({ p, i })), activos = todos.filter(({ p }) => !p.saldado), saldados = todos.filter(({ p }) => p.saldado);
  const total = activos.reduce((s, { p }) => s + Math.max(0, p.monto || 0), 0), alMes = activos.reduce((s, { p }) => s + interesPrestamo(p), 0);
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave="Te deben" titulo="Te deben" lado={<b>{pesos(total)}</b>}>
        {alMes ? <Parrafo>Intereses al mes: <Box component="b" sx={{ color: 'success.main' }}>{pesos(alMes)}</Box></Parrafo> : null}
        <Nota>Plata que prestaste y cosas pendientes (la moto, la natillera…). El día de cobro sale en Recordatorios. Lo que te deben suma en tu patrimonio.</Nota>
      </TarjetaPlegable>
      {activos.map(({ p, i }) => tarjetaPrestamo(f, p, i))}
      <Button fullWidth color="secondary" sx={GRANDE} onClick={() => accion('ed-agregar', { lista: 'finanzas.prestamos' })}>＋ Préstamo o pendiente</Button>
      {saldados.length > 0 && (
        <Card component="section" sx={{ mb: '14px', py: '4px' }}>
          <Desplegable titulo={'Ya saldados (' + saldados.length + ')'}>
            <ListaPares pares={saldados.map(({ p, i }) => ({
              id: p.id, nombre: <>{p.nombre} <Chico>· {fechaCorta(p.saldado)}</Chico></>,
              valor: <Box component="span" sx={{ display: 'flex', gap: '6px', alignItems: 'center', fontWeight: 400 }}><Button color="secondary" onClick={() => accion('fin-reabrir', { id: p.id })}>Reabrir</Button><Controles lista="finanzas.prestamos" i={i} nombre={p.nombre} total={f.prestamos.length} /></Box>,
            }))} />
          </Desplegable>
        </Card>
      )}
    </>
  );
}
