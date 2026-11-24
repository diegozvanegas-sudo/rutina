// 💰 Finanzas: ➕ Registrar (el formulario de gastos, ingresos, ahorro y transferencias, con la lista del mes) y 📊 Mes.
// Igual que el resto de Finanzas en React: aquí se pinta, y las reglas son las acciones de src/vistas/finanzas.js.
// El formulario vive en "form" (de ese archivo): se va llenando con cada toque y la acción "fin-guardar" lo lee.
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Chip, IconButton, Link, OutlinedInput, Typography } from '@mui/material';
import { Vacio } from '../ui/Vacio';
import { iso, fechaCorta, fechaLarga, sumarDias } from '../../fechas.js';
import {
  mesDe, sumarMeses, pesos, gastoDe, resumenMes, estadoFijo, tarjetaDe, subsDe, subDe, buscarCategorias, frecuentes, notasFrecuentes, pagosSinDeuda,
} from '../../finanzas.js';
import { piezasFinanzas } from '../../vistas/finanzas.js';
import { NombreMetodo } from '../ui/IconoMetodo';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoSolo, DOS } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import { Opciones, Cifras, Avance } from '../ui/Varios';

const VISTA = 'finanzas';
/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
type Par = { id: string; nombre: string; icono: string };
type Form = { tipo: string; categoria: string | null; sub: string | null; metodo: string | null; destino: string | null; monto: string; nota: string; fecha: string | null; editando: string | null; deuda: string | null };
const { cat, metodo, cuentas, pct, nombreMes, TIPOS, BOTON, editable, form, mesVista, filtro, quitarFiltro } = piezasFinanzas as {
  cat: (tipo: string, id: string | null) => Par & { presupuesto?: number }; metodo: (id: string) => Par; cuentas: () => Fin[]; pct: (x: number | null) => string; nombreMes: (mes: string) => string;
  TIPOS: Record<string, string>; BOTON: Record<string, string>; editable: (m: Fin) => boolean; form: Form; mesVista: () => string | null; filtro: () => string | null; quitarFiltro: () => void;
};
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', mb: '6px' };
const COLOR_MONTO: Record<string, string> = { gasto: tokens.rojo, ingreso: tokens.verde, retiro: tokens.verde, cobro: tokens.verde, ahorro: tokens.azul, transferencia: tokens.muted };
const CHIPS = { display: 'flex', flexWrap: 'wrap', gap: '8px', pb: '6px' };
const Titulo = ({ children }: { children: ReactNode }) => <Typography sx={{ m: '4px 0 6px', fontSize: 13, fontWeight: 700, color: 'text.secondary' }}>{children}</Typography>;
const Aviso = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, my: '8px' }}>{children}</Box>;
const Chico = ({ children, sx }: { children: ReactNode; sx?: object }) => <Box component="small" sx={{ color: 'text.secondary', fontSize: 13, ...sx }}>{children}</Box>;
const color = (c: string) => ({ rojo: 'error.main', verde: 'success.main', amarillo: 'warning.main' }[c]);
// A Deudas, con la acción de siempre (cambia de pestaña)
const ADeudas = () => <Link href="#finanzas/deudas" data-accion="fin-pestana" data-p="deudas">💳 Deudas</Link>;

// ---------- Lista de movimientos (la usan Registrar y Mes) ----------
function filaMovimiento(f: Fin, m: Fin) {
  const c: { icono: string; nombre: string } = m.tipo === 'ahorro' || m.tipo === 'retiro' ? { icono: '🐷', nombre: (f.metas.find((x: Fin) => x.id === m.meta) || {}).nombre || 'Ahorro' }
    : m.tipo === 'cobro' ? { icono: '🤝', nombre: 'Me pagaron' } : m.tipo === 'presto' ? { icono: '🤝', nombre: 'Presté' }
    : m.tipo === 'transferencia' ? { icono: '🔄', nombre: 'Transferencia' } : subDe(f, m.categoria, m.sub) || cat(m.tipo, m.categoria);
  const signo = m.tipo === 'transferencia' ? '' : ['ingreso', 'retiro', 'cobro'].includes(m.tipo) ? '+ ' : '− ';
  const detalle = [m.sub && cat(m.tipo, m.categoria).nombre, m.nota, m.tipo === 'transferencia' ? 'De ' + metodo(m.metodo).nombre + ' a ' + metodo(m.destino).nombre : metodo(m.metodo).nombre,
    (m.tipo === 'pago-tarjeta' || m.tipo === 'cobro' || m.deuda) && m.interes ? 'intereses ' + pesos(m.interes) : '', m.tipo === 'gasto' && m.deuda && m.abono ? 'abono ' + pesos(m.abono) : ''].filter(Boolean).join(' · ');
  // Se pueden corregir gastos, ingresos y aportes tocándolos; las cuotas de deudas y los retiros se borran y se registran de nuevo
  const corregible = editable(m);
  return (
    <Box component="li" key={m.id} title={corregible ? 'Tocar para corregir' : undefined} onClick={corregible ? () => accion('fin-editar-mov', { id: m.id }) : undefined}
      sx={{ display: 'grid', gridTemplateColumns: '32px 1fr auto 40px', gap: '8px', alignItems: 'center', py: '6px', borderBottom: '1px solid', borderColor: 'divider', cursor: corregible ? 'pointer' : undefined,
        '&:hover b': corregible ? { textDecoration: 'underline' } : undefined }}>
      <Box component="span" sx={{ fontSize: 20, textAlign: 'center' }}>{c.icono}</Box>
      <Box component="span" sx={{ display: 'grid', minWidth: 0 }}><b>{c.nombre}</b><Chico sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{detalle}</Chico></Box>
      <Box component="span" sx={{ fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: COLOR_MONTO[m.tipo] }}>{signo + pesos(m.monto)}</Box>
      <IconButton aria-label="Borrar movimiento" onClick={(ev) => { ev.stopPropagation(); accion('fin-borrar-mov', { id: m.id }); }} sx={{ fontSize: 18, minWidth: 40, color: 'error.main' }}>✕</IconButton>
    </Box>
  );
}
export function listaMovimientos(f: Fin, movs: Fin[]) {
  const porDia: Record<string, Fin[]> = {};
  for (const m of [...movs].sort((a, b) => b.fecha.localeCompare(a.fecha) || (b.id > a.id ? 1 : -1))) (porDia[m.fecha] ??= []).push(m);
  const dias = Object.entries(porDia);
  if (!dias.length) return <Vacio icono="💸" accion={<Button href="#finanzas/registrar" sx={{ minHeight: 44 }}>➕ Anotar un gasto o ingreso</Button>}>Todavía no hay movimientos este mes. Anotar cada gasto el mismo día toma un minuto y te dice a dónde se va la plata.</Vacio>;
  return dias.map(([fecha, lista]) => (
    <Box key={fecha}>
      <Typography component="h3" sx={{ fontSize: 13, color: 'text.secondary', textTransform: 'capitalize', m: '10px 0 2px', fontWeight: 700 }}>{fecha === iso() ? 'Hoy' : fecha === sumarDias(iso(), -1) ? 'Ayer' : fechaLarga(fecha)}</Typography>
      <Box component="ul" sx={{ listStyle: 'none', m: '0 0 6px', p: 0, display: 'grid', gap: '2px' }}>{lista.map((m) => filaMovimiento(f, m))}</Box>
    </Box>
  ));
}

// ---------- ➕ Registrar ----------
const conSubs = () => form.tipo === 'gasto' || form.tipo === 'ingreso';
// Chips de una sola elección que llaman a una acción con el id (métodos de pago, deudas, subcategorías)
const elegir = (nombre: string, lista: [string, ReactNode][], activa: string | null, accionDe: string, envolver = false) => (
  <Opciones nombre={nombre} envolver={envolver} activa={activa} opciones={lista} datos={(id) => ({ 'data-accion': accionDe, 'data-id': id })} sx={{ pb: envolver ? '6px' : '10px' }} />
);

// Lo que más anotas en la categoría elegida: un toque pone la nota, la subcategoría y (si falta) el monto de la última vez
function notasDeCategoria(f: Fin) {
  if (form.editando) return null;
  const notas = notasFrecuentes(f, form.tipo, form.categoria) as { nota: string; sub?: string; monto: number }[];
  if (!notas.length) return null;
  return (
    <>
      <Titulo>Lo que más anotas aquí</Titulo>
      <Box sx={CHIPS}>
        {notas.map((x) => {
          const activa = form.nota.trim().toLowerCase() === x.nota.toLowerCase();
          return <Chip key={x.nota} clickable color={activa ? 'primary' : 'default'} variant={activa ? 'filled' : 'outlined'} onClick={() => accion('fin-nota', { nota: x.nota, sub: x.sub || '', monto: x.monto })}
            label={<>{x.sub ? subDe(f, form.categoria, x.sub).icono + ' ' : ''}{x.nota} <Box component="small" sx={{ opacity: 0.75, fontWeight: 400 }}>{pesos(x.monto)}</Box></>} />;
        })}
      </Box>
    </>
  );
}
// En "Cuotas y deudas": ¿a cuál deuda va? Así solo el interés cuenta como gasto y el saldo baja
function elegirDeuda(f: Fin) {
  if (form.tipo !== 'gasto' || form.categoria !== 'deudas' || form.editando) return null;
  const ds: Fin[] = f.deudas.filter((d: Fin) => d.saldo > 0);
  if (!form.deuda && ds.length === 1) form.deuda = ds[0].id;
  if (!ds.some((d) => d.id === form.deuda) && form.deuda !== 'otra') form.deuda = null;
  if (!ds.length) return <Aviso>Si es el pago de una deuda, anótala primero en <ADeudas />: así solo cuenta el interés como gasto y el saldo baja. Si no, se guarda como gasto entero.</Aviso>;
  const d = ds.find((x) => x.id === form.deuda);
  return (
    <>
      <Titulo>¿A cuál deuda va el pago?</Titulo>
      {elegir('Deuda', [...ds.map((x) => [x.id, '💳 ' + x.nombre] as [string, string]), ['otra', 'Otra cosa']], form.deuda, 'fin-deuda', true)}
      {d ? <Nota>Primero paga el interés del mes ({pesos(Math.round(Math.max(0, d.saldo) * ((d.tasa || 0) / 100)))}, eso es gasto); lo demás baja el saldo de {pesos(d.saldo)}{d.metodo ? '. Las compras con la tarjeta ya se contaron como gasto.' : ' y no cuenta como gasto.'}</Nota>
        : form.deuda === 'otra' ? <Nota>Se guarda como gasto entero y no baja ningún saldo.</Nota> : <Aviso>Elige la deuda: si no, todo el pago cuenta como gasto y el saldo no baja.</Aviso>}
    </>
  );
}
// Cuánto lleva la categoría elegida este mes contra su presupuesto
function pistaPresupuesto(r: Fin) {
  if (form.tipo !== 'gasto' || !form.categoria) return null;
  const c = cat('gasto', form.categoria), lleva: number = r.porCategoria[c.id] || 0, tope = c.presupuesto;
  if (!tope) return <Nota sx={{ m: '-2px 0 10px' }}>{c.icono} {c.nombre}: llevas <b>{pesos(lleva)}</b> este mes.</Nota>;
  const quedan = tope - lleva;
  return (
    <Box sx={{ m: '-2px 0 10px' }}>
      <Box sx={{ ...FILA, color: 'text.secondary', fontSize: 14 }}>
        <span>{c.icono} {c.nombre}: {pesos(lleva)} de {pesos(tope)}</span>
        <Box component="b" sx={{ color: color(quedan < 0 ? 'rojo' : quedan < tope * 0.2 ? 'amarillo' : 'verde') }}>{quedan < 0 ? 'te pasaste ' + pesos(-quedan) : 'quedan ' + pesos(quedan)}</Box>
      </Box>
      <Avance parte={lleva / tope} rojo={quedan < 0} />
    </Box>
  );
}
// Lo de una transferencia: de qué cuenta sale y a cuál llega. No es gasto ni ingreso
function camposTransferencia() {
  const lista = cuentas();
  if (lista.length < 2) return <Aviso>Necesitas al menos dos cuentas para transferir.</Aviso>;
  if (!lista.some((m) => m.id === form.metodo)) form.metodo = lista[0].id;
  const destinos = lista.filter((m) => m.id !== form.metodo);
  if (!destinos.some((m) => m.id === form.destino)) form.destino = destinos[0].id;
  const pares = (l: Fin[]) => l.map((m) => [m.id, <NombreMetodo m={m} />] as [string, ReactNode]);
  return (
    <>
      <Titulo>Sale de</Titulo>{elegir('Sale de', pares(lista), form.metodo, 'fin-metodo')}
      <Titulo>Llega a</Titulo>{elegir('Llega a', pares(destinos), form.destino, 'fin-destino')}
      <Nota>Mover plata entre tus cuentas no cuenta como gasto ni como ingreso: solo cambia el saldo de cada una.</Nota>
    </>
  );
}
// Gasto del mes por categoría, de mayor a menor; tocar una deja solo sus movimientos en la lista
function resumenCategorias(r: Fin) {
  const filas = (Object.entries(r.porCategoria) as [string, number][]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  if (!filas.some(([id]) => id === filtro())) quitarFiltro();
  if (!filas.length) return null;
  const actual = filtro();
  return (
    <>
      <Box component="ul" sx={{ listStyle: 'none', m: '4px 0 10px', p: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '6px' }}>
        {filas.map(([id, v]) => {
          const c = cat('gasto', id), activo = id === actual;
          return (
            <li key={id}>
              <ButtonBase onClick={() => accion('fin-filtro-cat', { id })}
                sx={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: '0 6px', p: '8px 10px', borderRadius: '10px', border: '1px solid', borderColor: activo ? 'primary.main' : 'divider',
                  bgcolor: activo ? tokens.brandSoft : 'background.default', color: 'text.primary', font: 'inherit', fontSize: 13, textAlign: 'left' }}>
                <Box component="span" sx={{ gridColumn: '1 / -1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: activo ? 'primary.main' : 'text.secondary' }}>{c.icono} {c.nombre}</Box>
                <Box component="b" sx={{ fontVariantNumeric: 'tabular-nums' }}>{pesos(v)}</Box>
                <Chico sx={{ alignSelf: 'end' }}>{Math.round((v / r.gastos) * 100)} %</Chico>
              </ButtonBase>
            </li>
          );
        })}
      </Box>
      {actual && <Nota>Solo {cat('gasto', actual).nombre} · <Link href="#" onClick={(ev) => { ev.preventDefault(); accion('fin-filtro-cat', { id: '' }); }}>ver todo</Link></Nota>}
    </>
  );
}
const BOTON_CAT = { display: 'grid', justifyItems: 'center', gap: '4px', p: '10px 6px', minHeight: 72, borderRadius: '12px', border: '1px solid', font: 'inherit', fontSize: 13, fontWeight: 600, textAlign: 'center' };

export function Registrar({ f }: { f: Fin }) {
  // El buscador de categorías muestra resultados mientras se escribe
  const [busca, ponerBusca] = useState('');
  useEffect(() => { if (form.categoria || !conSubs()) ponerBusca(''); });

  const cats: Par[] = form.tipo === 'ahorro' ? f.metas.map((m: Fin) => ({ id: m.id, nombre: m.nombre, icono: m.icono || '🐷' })) : f.categorias[form.tipo === 'ingreso' ? 'ingreso' : 'gasto'];
  if (!cats.some((c) => c.id === form.categoria)) form.categoria = null;
  const subs: Par[] = conSubs() && form.categoria ? subsDe(f, form.categoria) : [];
  if (!subs.some((x) => x.id === form.sub)) form.sub = null;
  const frec: { categoria: string; sub?: string }[] = conSubs() && !form.categoria && !form.editando ? frecuentes(f, form.tipo) : [];
  const transf = form.tipo === 'transferencia';
  // Lo que entra o pasa a ahorro sale de una cuenta, no de la tarjeta de crédito
  const metodos: Fin[] = form.tipo === 'gasto' ? f.metodos : cuentas();
  const ultimoMetodo = [...f.movimientos].reverse().find((m: Fin) => metodos.some((x) => x.id === m.metodo));
  if (!metodos.some((m) => m.id === form.metodo)) form.metodo = ultimoMetodo ? ultimoMetodo.metodo : (metodos[0] || {}).id;
  const r = resumenMes(f, mesDe(iso())) as Fin;
  // Ingresos fijos que ya deberían haber llegado: un toque para registrarlos
  const porLlegar: Fin[] = form.editando ? [] : f.fijos.filter((x: Fin) => x.tipo === 'ingreso' && ['pronto', 'vencido'].includes(estadoFijo(f, x).estado));
  const tarjeta = form.tipo === 'gasto' && tarjetaDe(f, form.metodo);
  const elegida = conSubs() && form.categoria ? cat(form.tipo, form.categoria) : null;
  const nombreDe = (x: { categoria: string; sub?: string }) => (subDe(f, x.categoria, x.sub) || cat(form.tipo, x.categoria)) as Par;
  const resultados = busca.trim() ? buscarCategorias(f, form.tipo, busca) as { categoria: string; sub?: string; icono: string; nombre: string; cat?: string }[] : [];
  const mes = nombreMes(mesDe(iso())), actual = filtro();

  return (
    <>
      {porLlegar.map((x) => (
        <Card key={x.id} component="button" type="button" onClick={() => accion('fin-pagar-fijo', { id: x.id })}
          sx={{ mb: '14px', display: 'grid', gap: '4px', width: '100%', textAlign: 'left', font: 'inherit', color: 'text.primary', cursor: 'pointer', borderColor: 'warning.main', bgcolor: tokens.amarilloFondo }}>
          <b>{cat('ingreso', x.categoria).icono} ¿Llegó {x.nombre}?</b><Box component="span" sx={{ color: 'text.secondary', fontSize: 14 }}>Toca para registrar {pesos(x.monto)}</Box>
        </Card>
      ))}
      <Card component="section" sx={{ mb: '14px', borderColor: form.editando ? 'primary.main' : undefined }}>
        {form.editando && (
          <Box sx={FILA}><Typography component="h2" variant="h2" sx={{ m: 0 }}>✏️ Corrigiendo movimiento</Typography><Button color="secondary" onClick={() => accion('fin-cancelar-edicion')}>Cancelar</Button></Box>
        )}
        <Opciones nombre="Qué vas a registrar" envolver activa={form.tipo} opciones={Object.entries(TIPOS)} datos={(k) => ({ 'data-accion': 'fin-tipo', 'data-tipo': k })} />
        <CampoSolo id="fin-monto" inputMode="numeric" data-pesos="" data-cambio="fin-form" data-k="monto" defaultValue={form.monto} placeholder="$ 0" aria-label="Monto"
          sx={{ m: '4px 0 10px', minHeight: 68, '& input': { fontSize: 34, fontWeight: 800, textAlign: 'center', height: 66, fontVariantNumeric: 'tabular-nums' } }} />
        {transf ? camposTransferencia() : (
          <>
            {frec.length > 0 && (
              <><Titulo>Lo que más anotas</Titulo><Box sx={CHIPS}>{frec.map((x) => <Chip key={x.categoria + '/' + (x.sub || '')} variant="outlined" clickable label={nombreDe(x).icono + ' ' + nombreDe(x).nombre} onClick={() => accion('fin-elegir', { cat: x.categoria, sub: x.sub || '' })} />)}</Box></>
            )}
            {!elegida && (
              <>
                {conSubs() && (
                  <>
                    <OutlinedInput fullWidth value={busca} onChange={(ev) => ponerBusca(ev.target.value)} sx={{ mb: '8px' }} inputProps={{ type: 'search', placeholder: 'Buscar: gasolina, Netflix, barbería…', 'aria-label': 'Buscar categoría', autoComplete: 'off' }} />
                    {busca.trim() !== '' && (
                      <Box sx={{ display: 'grid', gap: '6px', mb: '8px' }}>
                        {resultados.length ? resultados.map((x) => (
                          <ButtonBase key={x.categoria + '/' + (x.sub || '')} onClick={() => accion('fin-elegir', { cat: x.categoria, sub: x.sub || '' })}
                            sx={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: '8px', minHeight: 44, p: '6px 10px', borderRadius: '10px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.default', font: 'inherit', fontSize: 14, textAlign: 'left' }}>
                            <Box component="span" sx={{ fontSize: 20, textAlign: 'center' }}>{x.icono}</Box><b>{x.nombre}</b><Chico sx={{ fontSize: 12 }}>{x.sub ? x.cat : 'categoría'}</Chico>
                          </ButtonBase>
                        )) : <Nota>Nada con «{busca.trim()}». Elige la categoría abajo y crea la subcategoría con «＋ Otra».</Nota>}
                      </Box>
                    )}
                  </>
                )}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '8px', mb: '10px' }}>
                  {cats.map((c) => {
                    const activo = c.id === form.categoria;
                    return (
                      <ButtonBase key={c.id} onClick={() => accion('fin-cat', { id: c.id })}
                        sx={{ ...BOTON_CAT, borderColor: activo ? 'primary.main' : 'divider', bgcolor: activo ? tokens.brandSoft : 'background.default', color: activo ? 'primary.main' : 'text.primary' }}>
                        <Box component="span" sx={{ fontSize: 24 }}>{c.icono}</Box>{c.nombre}
                      </ButtonBase>
                    );
                  })}
                </Box>
              </>
            )}
            {/* Elegida la categoría, la cuadrícula se recoge: queda la elegida y sus subcategorías a la vista */}
            {elegida && (
              <Box data-t="elegida" sx={{ m: '-2px 0 8px' }}>
                <ButtonBase onClick={() => accion('fin-cat', { id: '' })}
                  sx={{ width: '100%', display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: '8px', minHeight: 48, mb: '8px', p: '6px 12px', borderRadius: '12px', border: '1px solid', borderColor: 'primary.main',
                    bgcolor: tokens.brandSoft, color: 'primary.main', font: 'inherit', fontSize: 15, textAlign: 'left' }}>
                  <Box component="span" sx={{ fontSize: 22, textAlign: 'center' }}>{elegida.icono}</Box><b>{elegida.nombre}</b><Chico sx={{ textDecoration: 'underline' }}>Cambiar</Chico>
                </ButtonBase>
                <Titulo>¿En qué? <Box component="small" sx={{ fontWeight: 400 }}>(opcional)</Box></Titulo>
                <Box sx={CHIPS}>
                  {subs.map((x) => <Chip key={x.id} clickable color={x.id === form.sub ? 'primary' : 'default'} variant={x.id === form.sub ? 'filled' : 'outlined'} aria-pressed={x.id === form.sub} label={x.icono + ' ' + x.nombre} onClick={() => accion('fin-sub', { id: x.id })} />)}
                  <Chip variant="outlined" clickable label="＋ Otra" onClick={() => accion('fin-sub-nueva')} />
                </Box>
                {notasDeCategoria(f)}
              </Box>
            )}
            {elegirDeuda(f)}
            {pistaPresupuesto(r)}
            {elegir('Método de pago', metodos.map((m) => [m.id, <NombreMetodo m={m} />] as [string, ReactNode]), form.metodo, 'fin-metodo')}
          </>
        )}
        {tarjeta && <Nota>💳 Suma al saldo de <b>{tarjeta.nombre}</b> ({pesos(Math.max(0, tarjeta.saldo))} hoy).</Nota>}
        <Box sx={DOS}>
          <Campo etiqueta="Nota" data-cambio="fin-form" data-k="nota" defaultValue={form.nota} placeholder="Opcional" />
          <Campo etiqueta="Fecha" type="date" data-cambio="fin-form" data-k="fecha" defaultValue={form.fecha || iso()} max={iso()} />
        </Box>
        <Button fullWidth sx={{ minHeight: 56, fontSize: 17, mt: '8px' }} onClick={() => accion('fin-guardar')}>{form.editando ? 'Guardar cambios' : BOTON[form.tipo]}</Button>
      </Card>
      <TarjetaPlegable vista={VISTA} clave={mes} titulo={mes} lado={<span>Gastado <b>{pesos(r.gastos)}</b></span>}>
        {resumenCategorias(r)}
        <Nota>Toca un movimiento para corregirlo.</Nota>
        {listaMovimientos(f, actual ? r.movs.filter((m: Fin) => m.categoria === actual && gastoDe(m)) : r.movs)}
      </TarjetaPlegable>
    </>
  );
}

// ---------- 📊 Mes ----------
// Gastos anotados a mano en "Cuotas y deudas": decir de cuál deuda fueron (o dejarlos como gasto)
function avisoPagosSinDeuda(f: Fin, mes: string) {
  const movs: Fin[] = pagosSinDeuda(f, mes), ds: Fin[] = f.deudas;
  if (!movs.length) return null;
  const total = movs.reduce((s, m) => s + m.monto, 0), titulo = '⚠ Revisa ' + pesos(total) + ' en Cuotas y deudas';
  return (
    <TarjetaPlegable vista={VISTA} clave={titulo} titulo={titulo} sx={{ borderColor: 'warning.main' }}>
      <Nota>Están anotados como gasto entero y no bajaron ninguna deuda. Si fueron pagos de una deuda, di de cuál: solo el interés queda como gasto y el saldo baja. Si pagaste la tarjeta, sus compras ya se contaron: así no se cuentan dos veces.</Nota>
      {!ds.length && <Aviso>No tienes deudas anotadas. Agrégalas en <ADeudas /> con el saldo de antes de estos pagos.</Aviso>}
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: '8px 0 0', display: 'grid', gap: '10px' }}>
        {movs.sort((a, b) => b.monto - a.monto).map((m) => (
          <Box component="li" key={m.id} sx={{ borderTop: '1px solid', borderColor: 'divider', pt: '8px', display: 'grid', gap: '6px' }}>
            <Box sx={FILA}><span>{fechaCorta(m.fecha)}{m.nota ? ' · ' + m.nota : ''} <Chico>{metodo(m.metodo).nombre}</Chico></span><b>{pesos(m.monto)}</b></Box>
            <Box sx={CHIPS}>
              {ds.map((d) => <Chip key={d.id} variant="outlined" clickable label={'💳 ' + d.nombre} onClick={() => accion('fin-convertir', { id: m.id, deuda: d.id })} />)}
              <Chip variant="outlined" clickable label="Es un gasto, déjalo" onClick={() => accion('fin-no-es-deuda', { id: m.id })} />
            </Box>
          </Box>
        ))}
      </Box>
    </TarjetaPlegable>
  );
}
export function mes(f: Fin) {
  const m = mesVista() || mesDe(iso()) as string, r = resumenMes(f, m) as Fin, ing: number = r.ingresos;
  const antes = resumenMes(f, mesDe(sumarMeses(m + '-01', -1))) as Fin;
  // La regla 50/30/20 se mide contra lo que entra en el mes, contando el ingreso fijo que aún no llega
  const base = Math.max(ing, r.ingresoEsperado || 0), esperado = base > ing;
  const cats: Fin[] = f.categorias.gasto.filter((c: Fin) => r.porCategoria[c.id] || c.presupuesto).sort((a: Fin, b: Fin) => (r.porCategoria[b.id] || 0) - (r.porCategoria[a.id] || 0));
  const reglas: [string, string, number, number, string][] = [['necesidad', 'Necesidades', r.porGrupo.necesidad, 0.5, 'máx.'], ['deseo', 'Deseos', r.porGrupo.deseo, 0.3, 'máx.'], ['ahorro', 'Ahorro', Math.max(0, base - r.gastos), 0.2, 'mín.']];
  // Comparación con el mes anterior (solo si ese mes tuvo gasto en la categoría)
  const vs = (id: string, v: number) => {
    const a = antes.porCategoria[id];
    if (!a) return null;
    const d = Math.round(((v - a) / a) * 100);
    return d ? <> <Chico sx={{ color: d > 0 ? 'error.main' : 'success.main' }}>{(d > 0 ? '↑ ' : '↓ ') + Math.abs(d)} %</Chico></> : null;
  };
  const metodosMes = (Object.entries(r.porMetodo) as [string, number][]).sort((a, b) => b[1] - a[1]);
  const BOTON_MES = { bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', fontSize: 24, '&.Mui-disabled': { opacity: 0.3, color: 'text.primary' } };
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', mb: '10px' }}>
        <IconButton aria-label="Mes anterior" onClick={() => accion('fin-mes', { n: -1 })} sx={BOTON_MES}>‹</IconButton>
        <Typography component="h2" variant="h2" sx={{ m: 0 }}>{nombreMes(m)}</Typography>
        <IconButton aria-label="Mes siguiente" disabled={m >= mesDe(iso())} onClick={() => accion('fin-mes', { n: 1 })} sx={BOTON_MES}>›</IconButton>
      </Box>
      <Card component="section" sx={{ mb: '14px' }}>
        <Cifras datos={[
          { titulo: 'Ingresos', valor: pesos(ing), color: tokens.verde, nota: esperado ? '+ ' + pesos(base - ing) + ' por llegar' : undefined },
          { titulo: 'Gastos', valor: pesos(r.gastos), color: tokens.rojo },
          { titulo: 'A ahorro', valor: pesos(r.ahorro), color: tokens.azul },
          { titulo: 'Disponible', valor: pesos(r.balance) },
        ]} />
        <Box sx={FILA}><span>Tasa de ahorro</span><Box component="b" sx={{ color: color(r.tasaAhorro >= 0.2 ? 'verde' : r.tasaAhorro > 0 ? 'amarillo' : 'rojo') }}>{pct(r.tasaAhorro)}</Box></Box>
        {r.proyeccion ? <Nota>A este ritmo terminarías el mes gastando <b>{pesos(r.proyeccion)}</b>{base ? ' (' + pct(r.proyeccion / base) + ' de lo que entra)' : ''}{r.pendientes ? '. Faltan ' + pesos(r.pendientes) + ' de pagos fijos y cuotas' : ''}.</Nota> : null}
        {r.balance < 0 && <Aviso>Salió {pesos(-r.balance)} más de lo que entró este mes. Esa plata vino de algún lado: si fue de tus ahorros, anótalo con "Sacar" en 🐷 Ahorro; si fue un préstamo o un avance, agrégalo en 💳 Deudas. Mientras no esté anotado, la tasa de ahorro se ve mejor de lo que es.</Aviso>}
        {r.abonoDeudas ? <Nota>🏦 Bajaste {pesos(r.abonoDeudas)} de tus deudas: no es gasto (cuenta en el 20 %), pero sí sale de lo disponible.</Nota> : null}
        {r.pagosTarjeta ? <Nota>💳 Abonaste {pesos(r.pagosTarjeta)} a tarjetas: no cuenta como gasto porque las compras ya se contaron.</Nota> : null}
      </Card>
      {avisoPagosSinDeuda(f, m)}
      {base ? (
        <TarjetaPlegable vista={VISTA} clave="Regla 50 / 30 / 20" titulo="Regla 50 / 30 / 20">
          {esperado && <Nota>Cuenta el ingreso fijo que aún no llega.</Nota>}
          {reglas.map(([k, t, v, obj, tope]) => {
            const p = v / base, mal = k === 'ahorro' ? p < obj : p > obj;
            return (
              <Box key={k}>
                <Box sx={FILA}><span>{t} <Chico>({tope} {obj * 100} %)</Chico></span><span><Box component="b" sx={{ color: mal ? 'error.main' : 'success.main' }}>{pct(p)}</Box> · {pesos(v)}</span></Box>
                <Avance parte={p / obj} rojo={mal} />
              </Box>
            );
          })}
        </TarjetaPlegable>
      ) : <Aviso>Registra tus ingresos del mes (o tu salario en 🔁 Fijos) para ver la regla 50/30/20 y la tasa de ahorro.</Aviso>}
      <TarjetaPlegable vista={VISTA} clave="Por categoría" titulo="Por categoría">
        {cats.length ? (
          <>
            <Nota>Las flechas comparan con {nombreMes(mesDe(sumarMeses(m + '-01', -1)))}.</Nota>
            {cats.map((c) => {
              const v: number = r.porCategoria[c.id] || 0, tope: number = c.presupuesto, pasado = !!tope && v > tope;
              const subs = (Object.entries(r.porSub[c.id] || {}) as [string, number][]).sort((a, b) => b[1] - a[1]), sinDetalle = v - subs.reduce((a, [, x]) => a + x, 0);
              return (
                <Box key={c.id}>
                  <Box sx={FILA}><span>{c.icono} {c.nombre}{vs(c.id, v)}</span><span><Box component="b" sx={{ color: pasado ? 'error.main' : undefined }}>{pesos(v)}</Box>{tope ? ' / ' + pesos(tope) : ''}</span></Box>
                  <Avance parte={tope ? v / tope : r.gastos ? v / r.gastos : 0} rojo={pasado} />
                  {subs.length > 0 && <Nota sx={{ m: '2px 0 10px' }}>{subs.map(([id, x]) => { const sb = subDe(f, c.id, id); return sb.icono + ' ' + sb.nombre + ' ' + pesos(x); }).join(' · ') + (sinDetalle > 0 ? ' · sin detalle ' + pesos(sinDetalle) : '')}</Nota>}
                </Box>
              );
            })}
          </>
        ) : <Nota>Sin gastos este mes.</Nota>}
      </TarjetaPlegable>
      {metodosMes.length > 0 && (
        <TarjetaPlegable vista={VISTA} clave="Por método de pago" titulo="Por método de pago">
          {metodosMes.map(([id, v]) => <Box key={id} sx={FILA}><NombreMetodo m={metodo(id)} /><b>{pesos(v)}</b></Box>)}
          {r.porMetodo.credito ? <Nota>💳 Con tarjeta de crédito: {pesos(r.porMetodo.credito)}. Págala completa antes de la fecha límite para no pagar intereses.</Nota> : null}
        </TarjetaPlegable>
      )}
      <TarjetaPlegable vista={VISTA} clave="Movimientos" titulo="Movimientos">{listaMovimientos(f, r.movs)}</TarjetaPlegable>
    </>
  );
}
