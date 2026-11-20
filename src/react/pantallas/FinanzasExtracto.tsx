// 🏦 Finanzas → Extracto: subes el extracto del banco (PDF o CSV) o pegas su texto, la app lee los movimientos, los clasifica y
// te dice qué encontró (cobros del banco, lo que se repite, cobros dobles, lo más grande); luego pasas a Finanzas los que elijas.
// React pinta; la lectura y el análisis están en src/extracto.js y las acciones en src/vistas/extracto.js
import type { ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Chip, NativeSelect, OutlinedInput } from '@mui/material';
import { fechaCorta } from '../../fechas.js';
import { pesos } from '../../finanzas.js';
import { analizar, consejos } from '../../extracto.js';
import { extracto, personas, compras, tasaTarjeta, nombreTarjeta } from '../../vistas/extracto.js';
import { detalleCompra, porPersona, quienDe, textoPersona } from '../../cuotas.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { CampoLargoSolo, CampoSolo } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import { Cifras, Avance } from '../ui/Varios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Fin = any;
const VISTA = 'finanzas-extracto';
const GRIS = { color: 'text.secondary', fontSize: 14 };
const nombreSub = (id: string) => id.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
const FILTROS: [string, string][] = [['todos', 'Todos'], ['pasar', 'Por pasar'], ['ya', 'Ya anotados'], ['no', 'No se pasan']];

// Las categorías del tipo, con la subcategoría que trae el movimiento (si tiene)
function opcionesCat(f: Fin, m: Fin): [string, string][] {
  const lista = (f.categorias[m.tipo === 'ingreso' ? 'ingreso' : 'gasto'] as Fin[]).map((c) => [c.id, c.icono + ' ' + c.nombre] as [string, string]);
  if (m.sub) { const c = lista.find(([id]) => id === m.categoria); lista.unshift([m.categoria + '/' + m.sub, (c ? c[1] : m.categoria) + ' · ' + nombreSub(m.sub)]); }
  return lista;
}
const catDe = (f: Fin, m: Fin) => (f.categorias[m.tipo === 'ingreso' ? 'ingreso' : 'gasto'] as Fin[]).find((c) => c.id === m.categoria) || { icono: '🏷️', nombre: m.categoria };

// ---------- Subir o pegar ----------
function Cargar({ f, x }: { f: Fin; x: Fin }) {
  const metodo = x.metodo || ((f.metodos as Fin[]).find((m) => m.id === 'debito') || f.metodos[0] || {}).id;
  return (
    <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '10px' }}>
      <Box component="h2" sx={{ m: 0, fontSize: 18 }}>🏦 Analizar el extracto del banco</Box>
      <Nota sx={{ m: 0 }}>Sube el extracto (PDF o CSV) o pega su texto. Leo cada movimiento, le pongo categoría y te digo qué encontré. El extracto se queda en tu equipo: solo se guardan los movimientos que decidas pasar.</Nota>
      <Box sx={{ display: 'grid', gap: '4px' }}>
        <Box component="label" htmlFor="ext-metodo" sx={GRIS}>¿De qué cuenta o tarjeta es?</Box>
        <NativeSelect key={metodo} defaultValue={metodo} input={<OutlinedInput />} inputProps={{ id: 'ext-metodo', 'data-cambio': 'ext-metodo' } as object}>
          {(f.metodos as Fin[]).map((m) => <option key={m.id} value={m.id}>{m.icono} {m.nombre}</option>)}
        </NativeSelect>
      </Box>
      <Button component="label" sx={{ minHeight: 48 }} disabled={x.leyendo}>
        {x.leyendo ? '⏳ Leyendo el PDF…' : '📄 Subir el extracto (PDF o CSV)'}
        <input hidden type="file" accept=".pdf,.csv,.txt,application/pdf,text/csv,text/plain" aria-label="Extracto del banco" data-cambio="ext-archivo" />
      </Button>
      {x.pideClave ? (
        <Box data-t="ext-clave" sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', p: '10px', borderRadius: '10px', bgcolor: tokens.surface2 }}>
          <Box sx={{ gridColumn: '1 / -1', fontSize: 14 }}>🔒 <b>{x.nombre || 'El PDF'}</b> tiene clave. Casi siempre es tu número de cédula.</Box>
          <CampoSolo aria-label="Clave del PDF" type="password" inputMode="numeric" autoComplete="off" enterKeyHint="go" placeholder="Clave del PDF" />
          <Button onClick={() => accion('ext-clave')} sx={{ minHeight: 44 }}>Abrir</Button>
          <Box component="small" sx={{ gridColumn: '1 / -1', color: 'text.secondary' }}>La clave solo se usa para abrir el archivo aquí: no se guarda.</Box>
        </Box>
      ) : null}
      <details>
        <Box component="summary" sx={{ cursor: 'pointer', minHeight: 32, fontSize: 14, color: 'text.secondary' }}>O pega el texto del extracto</Box>
        <Box sx={{ display: 'grid', gap: '8px', mt: '8px' }}>
          <CampoLargoSolo filas={5} aria-label="Texto del extracto" data-cambio="ext-texto" defaultValue={x.texto} placeholder={'02/11/2026 COMPRA EN D1 -85.400 4.414.600\n03/11/2026 PAGO NETFLIX -44.900 4.369.700'} />
          <Button color="secondary" onClick={() => accion('ext-leer')} sx={{ justifySelf: 'start', minHeight: 44 }}>Leer el texto</Button>
        </Box>
      </details>
      <Box component="small" sx={{ color: 'text.secondary' }}>Lo descargas en la app o la página de tu banco (Bancolombia, Davivienda, Nequi, BBVA…): «Extractos» o «Movimientos» → PDF o Excel/CSV. Si es de Excel, guárdalo como CSV.</Box>
    </Card>
  );
}

// ---------- Lo que encontré ----------
function Analisis({ f, movs }: { f: Fin; movs: Fin[] }) {
  const a = analizar(movs) as Fin, tips = consejos(a) as string[];
  const cats = Object.entries(a.porCategoria as Record<string, number>).sort((p, q) => q[1] - p[1]);
  const fila = (k: string, izq: ReactNode, der: ReactNode, extra?: ReactNode) => (
    <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', py: '6px', borderBottom: '1px solid', borderColor: 'divider', fontSize: 14 }}>
      <Box sx={{ minWidth: 0 }}>{izq}{extra ? <Box component="small" sx={{ display: 'block', color: 'text.secondary' }}>{extra}</Box> : null}</Box><Box component="b" sx={{ flex: 'none' }}>{der}</Box>
    </Box>
  );
  return (
    <>
      <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <Box component="h2" sx={{ m: 0, fontSize: 18 }}>📊 Lo que dice el extracto</Box>
          {a.desde ? <Box component="span" sx={GRIS}>{fechaCorta(a.desde)} – {fechaCorta(a.hasta)} · {movs.length} movimientos</Box> : null}
        </Box>
        <Cifras datos={[{ titulo: 'Salió', valor: pesos(a.gastos), color: tokens.rojoSuave }, { titulo: 'Entró', valor: pesos(a.ingresos) }, { titulo: 'Diferencia', valor: (a.neto < 0 ? '−' : '') + pesos(Math.abs(a.neto)), color: a.neto < 0 ? tokens.rojoSuave : undefined }]} />
        {tips.length ? (
          <Box data-t="ext-consejos" sx={{ display: 'grid', gap: '6px' }}>
            <b>💡 Lo que encontré</b>
            {tips.map((t) => <Box key={t} sx={{ p: '8px 10px', borderRadius: '10px', bgcolor: tokens.surface2, fontSize: 14 }}>{t}</Box>)}
          </Box>
        ) : <Nota sx={{ m: 0 }}>✅ No vi cobros raros, dobles ni del banco.</Nota>}
        {a.internos ? <Nota sx={{ m: 0 }}>{a.internos} {a.internos === 1 ? 'movimiento parece' : 'movimientos parecen'} entre tus cuentas o pago de tarjeta: no los cuento como gasto ni los paso (ábrelos abajo si no es así).</Nota> : null}
      </Card>
      {cats.length ? (
        <TarjetaPlegable vista={VISTA} clave="En qué se fue" titulo="🧾 En qué se fue">
          {cats.map(([id, v]) => { const c = catDe(f, { tipo: 'gasto', categoria: id }); return (
            <Box key={id} sx={{ py: '4px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}><span>{c.icono} {c.nombre}</span><b>{pesos(v)} · {Math.round(v / a.gastos * 100)} %</b></Box>
              <Avance parte={v / a.gastos} />
            </Box>
          ); })}
        </TarjetaPlegable>
      ) : null}
      {a.banco.lista.length ? (
        <TarjetaPlegable vista={VISTA} clave="Cobros del banco" titulo={'🏦 Cobros del banco · ' + pesos(a.banco.total)}>
          {(a.banco.lista as Fin[]).map((m) => fila(m.id, m.desc, pesos(m.monto), fechaCorta(m.fecha)))}
        </TarjetaPlegable>
      ) : null}
      {a.dobles.length ? (
        <TarjetaPlegable vista={VISTA} clave="Posibles cobros dobles" titulo="⚠️ Posibles cobros dobles">
          {(a.dobles as Fin[][]).map(([p, q]) => fila(p.id + q.id, p.desc, pesos(p.monto) + ' × 2', fechaCorta(p.fecha) + (p.fecha !== q.fecha ? ' y ' + fechaCorta(q.fecha) : ', el mismo día')))}
          <Nota>Si no hiciste las dos compras, llama al banco y pide el reverso del cobro repetido.</Nota>
        </TarjetaPlegable>
      ) : null}
      {a.repetidos.length ? (
        <TarjetaPlegable vista={VISTA} clave="Se repiten" titulo="🔁 Se repiten">
          {(a.repetidos as Fin[]).slice(0, 8).map((r) => fila(r.clave, r.desc, pesos(r.total), r.veces + ' veces' + (r.fijo ? ' · casi el mismo valor: ¿suscripción o fijo?' : '')))}
        </TarjetaPlegable>
      ) : null}
      {a.grandes.length ? (
        <TarjetaPlegable vista={VISTA} clave="Los más grandes" titulo="💸 Los más grandes">
          {(a.grandes as Fin[]).map((m) => fila(m.id, m.desc, pesos(m.monto), fechaCorta(m.fecha) + ' · ' + Math.round(m.monto / a.gastos * 100) + ' % de lo que salió'))}
        </TarjetaPlegable>
      ) : null}
    </>
  );
}

// ---------- Los movimientos: una fila cada uno; al tocarla se corrige ----------
function Movimiento({ f, m, abierto }: { f: Fin; m: Fin; abierto: boolean }) {
  const c = catDe(f, m), estado = m.ya === 'pasado' ? '✓ Pasado' : m.ya ? 'Ya anotado' : m.interno ? 'Entre cuentas' : null;
  return (
    <Box data-t="ext-mov" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: 52 }}>
        <ButtonBase aria-pressed={!!m.pasar} aria-label={(m.pasar ? 'No pasar ' : 'Pasar ') + m.desc} disabled={m.ya === 'pasado'} onClick={() => accion('ext-pasar', { id: m.id })}
          sx={{ flex: 'none', width: 44, height: 44, borderRadius: '10px', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
          <Box component="span" aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 24, height: 24, borderRadius: '6px', border: '2px solid', fontWeight: 800, borderColor: m.pasar ? 'primary.main' : 'divider', bgcolor: m.pasar ? 'primary.main' : 'transparent', color: 'primary.contrastText' }}>{m.pasar ? '✓' : ''}</Box>
        </ButtonBase>
        <ButtonBase aria-expanded={abierto} onClick={() => accion('ext-abrir', { id: m.id })}
          sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'space-between', gap: '8px', py: '6px', font: 'inherit', color: 'text.primary', textAlign: 'left', borderRadius: '8px', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.icono} {m.desc}</Box>
            <Box component="small" sx={{ color: 'text.secondary', fontSize: 12 }}>{fechaCorta(m.fecha)} · {c.nombre}{estado ? ' · ' + estado : ''}{m.banco ? ' · 🏦 del banco' : ''}</Box>
          </Box>
          <Box component="b" sx={{ flex: 'none', fontSize: 14, color: m.tipo === 'ingreso' ? 'primary.main' : 'text.primary' }}>{m.tipo === 'ingreso' ? '+' : '−'}{pesos(m.monto)}</Box>
        </ButtonBase>
      </Box>
      {abierto ? (
        <Box sx={{ display: 'grid', gap: '8px', p: '0 0 12px 52px' }}>
          <NativeSelect key={m.categoria + (m.sub || '')} defaultValue={m.sub ? m.categoria + '/' + m.sub : m.categoria} input={<OutlinedInput />} inputProps={{ 'aria-label': 'Categoría', 'data-cambio': 'ext-cat', 'data-id': m.id } as object}>
            {opcionesCat(f, m).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </NativeSelect>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <Button size="small" color="secondary" onClick={() => accion('ext-tipo', { id: m.id })} sx={{ minHeight: 40 }}>{m.tipo === 'gasto' ? '💰 Es un ingreso' : '💸 Es un gasto'}</Button>
            {m.saldo != null ? <Box component="span" sx={GRIS}>Saldo después: {pesos(m.saldo)}</Box> : null}
          </Box>
          {m.ya && m.ya !== 'pasado' ? <Box component="small" sx={{ color: 'text.secondary' }}>Ya tienes uno igual en Finanzas (mismo valor, a 3 días o menos). Márcalo solo si es otro.</Box> : null}
          {m.interno ? <Box component="small" sx={{ color: 'text.secondary' }}>Parece un pago de tarjeta o un paso entre tus cuentas: si lo pasas como gasto, se contaría dos veces.</Box> : null}
          <Box component="small" sx={{ color: 'text.secondary' }}>Si cambias la categoría, la próxima vez la pongo sola para este comercio.</Box>
        </Box>
      ) : null}
    </Box>
  );
}

function Movimientos({ f, x }: { f: Fin; x: Fin }) {
  const movs = x.movs as Fin[], pasar = movs.filter((m) => m.pasar), cuenta = (v: string) => movs.filter((m) => (v === 'pasar' ? m.pasar : v === 'ya' ? m.ya : v === 'no' ? !m.pasar && !m.ya : true)).length;
  const vistos = movs.filter((m) => (x.filtro === 'pasar' ? m.pasar : x.filtro === 'ya' ? m.ya : x.filtro === 'no' ? !m.pasar && !m.ya : true));
  const total = pasar.reduce((s, m) => s + (m.tipo === 'gasto' ? m.monto : 0), 0);
  return (
    <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '8px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <Box component="h2" sx={{ m: 0, fontSize: 18 }}>📋 Movimientos</Box>
        <Box sx={{ display: 'flex', gap: '6px' }}>
          <Button size="small" variant="text" onClick={() => accion('ext-todos', { v: 'si' })} sx={{ minHeight: 40 }}>Marcar todos</Button>
          <Button size="small" variant="text" onClick={() => accion('ext-todos', { v: 'no' })} sx={{ minHeight: 40 }}>Ninguno</Button>
        </Box>
      </Box>
      <Box role="group" aria-label="Ver" sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {FILTROS.map(([v, t]) => { const si = x.filtro === v; return <Chip key={v} clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={t + ' · ' + cuenta(v)} onClick={() => accion('ext-filtro', { v })} sx={{ minHeight: 36 }} />; })}
      </Box>
      <Box>{vistos.map((m) => <Movimiento key={m.id} f={f} m={m} abierto={x.abierto === m.id} />)}</Box>
      {!vistos.length ? <Nota>Nada en esta lista.</Nota> : null}
      <Box sx={{ position: 'sticky', bottom: { xs: 72, md: 8 }, zIndex: 2, display: 'grid', gap: '6px', p: '10px', borderRadius: '12px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
        <Button data-t="ext-importar" onClick={() => accion('ext-importar')} disabled={!pasar.length} sx={{ minHeight: 52, fontSize: 16 }}>
          {pasar.length ? '✓ Pasar ' + pasar.length + ' a Finanzas' + (total ? ' · ' + pesos(total) + ' en gastos' : '') : 'Marca los que quieres pasar'}
        </Button>
        <Box component="small" sx={{ color: 'text.secondary', textAlign: 'center' }}>Quedan en la cuenta del extracto, con la descripción del banco como nota. Puedes deshacerlo en el aviso.</Box>
      </Box>
      <Button variant="text" color="secondary" onClick={() => accion('ext-limpiar')} sx={{ justifySelf: 'start', minHeight: 40 }}>Empezar con otro extracto</Button>
    </Card>
  );
}

// ---------- 💳 Cuotas y quién paga (src/cuotas.js) ----------
const numeroCorto = (n: number, d = 2) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString('es-CO');
function Personas({ lista }: { lista: string[] }) {
  return (
    <Box sx={{ display: 'grid', gap: '6px' }}>
      <Box component="span" sx={GRIS}>¿Quiénes usan la tarjeta?</Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {lista.map((p, i) => <Chip key={p} label={p + (i === 0 ? ' (tú)' : '')} onDelete={i ? () => accion('cu-persona-quitar', { p }) : undefined} sx={{ minHeight: 36 }} />)}
      </Box>
      <Box data-t="cu-persona" sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
        <CampoSolo aria-label="Nombre de otra persona" placeholder="Otra persona (ej.: Mamá)" enterKeyHint="done" maxLength={30} />
        <Button color="secondary" onClick={() => accion('cu-persona-nueva')} sx={{ minHeight: 44 }}>＋ Agregar</Button>
      </Box>
    </Box>
  );
}
function TasaTarjeta({ f, t }: { f: Fin; t: Fin }) {
  const id = x0().metodo, guardada = (f.tasasTarjeta || {})[id] || {};
  return (
    <Box data-t="cu-tasa" sx={{ display: 'grid', gap: '6px' }}>
      <Box component="span" sx={GRIS}>Tasa de la tarjeta (para las compras que no la traen en el extracto)</Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <CampoSolo key={'t' + (guardada.valor || '')} aria-label="Tasa de la tarjeta %" inputMode="decimal" data-cambio="cu-tasa" defaultValue={guardada.valor ? String(guardada.valor).replace('.', ',') : ''} placeholder={t ? numeroCorto(t.mensual, 4) + ' %' : 'Ej.: 1,89'} />
        <NativeSelect key={'s' + (guardada.tipo || '')} defaultValue={guardada.tipo || 'mensual'} input={<OutlinedInput />} inputProps={{ 'aria-label': 'La tasa es', 'data-cambio': 'cu-tasa' } as object}>
          <option value="mensual">% mensual</option><option value="ea">% E.A.</option>
        </NativeSelect>
      </Box>
      <Box component="small" sx={{ color: 'text.secondary' }}>{t ? 'Uso ' + numeroCorto(t.mensual, 4) + ' % mensual' + (t.de === 'deuda' ? ' (la de ' + t.deuda + ' en 💳 Deudas)' : '') + (t.tipo === 'ea' ? ' (' + numeroCorto(t.valor) + ' % E.A.)' : '') + '.' : 'Sin tasa: si el extracto trae el cargo del mes, la saco de ahí; si no, esas compras salen sin interés.'}</Box>
    </Box>
  );
}
const x0 = () => extracto() as Fin;
function Cifra({ t, v, color }: { t: string; v: ReactNode; color?: string }) {
  return <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: 14, py: '3px' }}><Box component="span" sx={{ color: 'text.secondary' }}>{t}</Box><Box component="b" sx={{ color, textAlign: 'right' }}>{v}</Box></Box>;
}
function Compra({ c, lista, abierta }: { c: Fin; lista: string[]; abierta: boolean }) {
  const d = detalleCompra(c) as Fin, quien = quienDe(c, lista) as string[];
  if (!d) return null;
  const campo = (k: string, et: string, v: string, modo = 'decimal') => (
    <Box sx={{ display: 'grid', gap: '2px' }}><Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>{et}</Box>
      <CampoSolo key={k + v} aria-label={et} inputMode={modo as 'decimal'} data-cambio="cu-campo" data-id={c.id} data-k={k} defaultValue={v} /></Box>
  );
  return (
    <Box data-t="cu-compra" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <ButtonBase aria-expanded={abierta} onClick={() => accion('cu-abrir', { id: c.id })}
        sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px', width: '100%', minHeight: 52, py: '6px', font: 'inherit', color: 'text.primary', textAlign: 'left', borderRadius: '8px', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.desc}</Box>
          <Box component="small" sx={{ color: 'text.secondary', fontSize: 12 }}>{fechaCorta(c.fecha)} · {d.n > 1 ? 'Cuota ' + d.k + ' de ' + d.n : '1 cuota'} · {quien.join(' + ')}</Box>
        </Box>
        <Box sx={{ flex: 'none', textAlign: 'right' }}>
          <Box component="b" sx={{ fontSize: 14 }}>{pesos(d.mes)}</Box>
          {d.interes > 0 ? <Box component="small" sx={{ display: 'block', fontSize: 12, color: tokens.rojoSuave }}>{pesos(d.interes)} interés</Box> : null}
        </Box>
      </ButtonBase>
      {abierta ? (
        <Box sx={{ display: 'grid', gap: '10px', pb: '12px' }}>
          <Box role="group" aria-label="Quién paga" sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            <Box component="span" sx={GRIS}>Quién paga:</Box>
            {lista.map((p) => { const si = quien.includes(p); return <Chip key={p} clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={p} onClick={() => accion('cu-quien', { id: c.id, p })} sx={{ minHeight: 36 }} />; })}
            {quien.length > 1 ? <Box component="small" sx={{ flexBasis: '100%', color: 'text.secondary' }}>Dividida en {quien.length}: a cada uno le toca {pesos(d.mes / quien.length)} este mes.</Box> : null}
          </Box>
          <Box sx={{ p: '8px 10px', borderRadius: '10px', bgcolor: tokens.surface2 }}>
            <Cifra t="Valor de la compra" v={pesos(c.original)} />
            {d.n > 1 ? <>
              <Cifra t={'Cuota ' + d.k + ' de ' + d.n + ': capital'} v={pesos(d.capital)} />
              <Cifra t={'Interés de este mes' + (d.tasa ? ' (' + numeroCorto(d.tasa, 2) + ' % mensual' + (d.tasaDe === 'cargo' ? ', sacada del cargo' : d.tasaDe === 'tarjeta' ? ', la de la tarjeta' : '') + ')' : '')} v={pesos(d.interes)} color={d.interes ? tokens.rojoSuave : undefined} />
            </> : null}
            <Cifra t={'Se paga este mes' + (d.delExtracto ? ' (según el extracto)' : '')} v={pesos(d.mes)} />
            {d.n > 1 ? <>
              <Cifra t={'Queda debiendo (' + d.cuotasFaltan + ' cuotas)'} v={pesos(d.saldo)} />
              <Cifra t="Intereses que faltan (aprox.)" v={pesos(d.interesesFaltan)} color={d.interesesFaltan ? tokens.rojoSuave : undefined} />
              <Cifra t="Falta por pagar en total" v={pesos(d.faltaPagar)} />
              <Cifra t="La compra termina costando" v={pesos(d.totalCompra) + ' (+' + pesos(d.interesesTotal) + ')'} />
            </> : null}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: '8px' }}>
            {campo('original', 'Valor original', Math.round(c.original).toLocaleString('es-CO'), 'numeric')}
            {campo('n', 'Cuotas', String(c.n), 'numeric')}
            {campo('k', 'Va en la cuota', String(d.k), 'numeric')}
            {campo('tasa', 'Tasa % mensual', c.tasa ? String(numeroCorto(c.tasa, 4)) : '')}
          </Box>
          <Box component="small" sx={{ color: 'text.secondary' }}>Corrige si algo se leyó mal: se recuerda para esta compra en los próximos extractos. Los bancos cobran el capital igual cada mes y el interés sobre lo que falta: el valor real puede variar un poco por días, seguros o cuota de manejo.</Box>
        </Box>
      ) : null}
    </Box>
  );
}
function Cuotas({ f, x }: { f: Fin; x: Fin }) {
  const lista = personas() as string[], cs = compras() as Fin[], pp = porPersona(cs, lista) as Fin[], t = tasaTarjeta() as Fin;
  if (!cs.length) return null;
  const total = pp.reduce((s, p) => s + p.mes, 0), falta = pp.reduce((s, p) => s + p.faltaPagar, 0), intereses = pp.reduce((s, p) => s + p.interes, 0);
  const orden = [...cs].sort((a, b) => (detalleCompra(b) as Fin).mes - (detalleCompra(a) as Fin).mes);
  return (
    <Card component="section" data-t="cuotas" sx={{ mb: '14px', display: 'grid', gap: '12px' }}>
      <Box component="h2" sx={{ m: 0, fontSize: 18 }}>💳 Cuotas y quién paga</Box>
      <Cifras datos={[{ titulo: 'Este mes', valor: pesos(total) }, { titulo: 'De eso, intereses', valor: pesos(intereses), color: intereses ? tokens.rojoSuave : undefined }, { titulo: 'Falta después', valor: pesos(falta) }]} />
      <Personas lista={lista} />
      <TasaTarjeta f={f} t={t} />
      {lista.length > 1 || pp[0].compras.length ? (
        <Box sx={{ display: 'grid', gap: '8px' }}>
          <b>👥 Lo de cada uno</b>
          {pp.filter((p) => p.compras.length).map((p) => (
            <Box key={p.nombre} data-t="cu-persona-resumen" sx={{ p: '10px', borderRadius: '10px', bgcolor: tokens.surface2, display: 'grid', gap: '4px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'baseline' }}><b>{p.nombre}</b><Box component="b" sx={{ fontSize: 17 }}>{pesos(p.mes)}</Box></Box>
              <Box component="small" sx={{ color: 'text.secondary' }}>{p.compras.length} {p.compras.length === 1 ? 'compra' : 'compras'} · {pesos(p.capital)} de capital + {pesos(p.interes)} de intereses{p.faltaPagar > 0 ? ' · después le falta ' + pesos(p.faltaPagar) + ' (' + pesos(p.interesesFaltan) + ' de intereses)' : ''}</Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mt: '4px' }}>
                <Button size="small" color="secondary" onClick={() => accion('cu-copiar', { p: p.nombre })} sx={{ minHeight: 40 }}>📋 Copiar su detalle</Button>
                <Button size="small" color="secondary" href={'https://wa.me/?text=' + encodeURIComponent(textoPersona(p, { tarjeta: nombreTarjeta() }) as string)} target="_blank" rel="noopener" sx={{ minHeight: 40 }}>💬 WhatsApp</Button>
              </Box>
            </Box>
          ))}
        </Box>
      ) : null}
      <Box>
        <b>🧾 Compras ({cs.length})</b>
        <Box sx={{ mt: '4px' }}>{orden.map((c) => <Compra key={c.id} c={c} lista={lista} abierta={x.compraAbierta === c.id} />)}</Box>
      </Box>
    </Card>
  );
}

export function extractoBanco(f: Fin) {
  const x = extracto() as Fin, conCuotas = x.movs && (x.tarjeta || (x.movs as Fin[]).some((m) => m.cuotas));
  return (
    <>
      <Cargar f={f} x={x} />
      {x.movs && x.movs.length ? <><Analisis f={f} movs={x.movs} />{conCuotas ? <Cuotas f={f} x={x} /> : null}<Movimientos f={f} x={x} /></> : null}
    </>
  );
}
