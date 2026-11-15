// 💰 Finanzas en React. La sección es grande y se migra pestaña por pestaña: aquí están 📈 Resumen, 🎯 Presupuesto,
// 🔁 Fijos y 🐷 Ahorro; en FinanzasMovimientos.tsx ➕ Registrar y 📊 Mes; en FinanzasDeudas.tsx 💳 Deudas y 🤝 Me deben; en FinanzasCalculos.tsx 🧮 Calcular y ⏳ 72 h; en FinanzasPlanB.tsx 🛟 Plan B (módulos 1 y 2). Las demás pestañas siguen en src/vistas/finanzas.js hasta que les toque (main.js decide cuál pinta).
//
// React pinta; las reglas (guardar un monto, registrar un pago, aportar…) son las acciones de siempre, registradas en
// src/vistas/finanzas.js y src/vistas/editar.js. Se llaman de dos formas:
//  - botones: accion('nombre', datos);
//  - campos que guardan al salir: data-cambio="nombre" con sus data-* (los despacha main.js, igual que antes).
import type { ReactNode } from 'react';
import { Box, Button, Card, Chip } from '@mui/material';
import { iso, fechaCorta } from '../../fechas.js';
import {
  mesDe, sumarMeses, pesos, resumenMes, gastoPromedio, aportado, objetivoMeta, estadoFijo, planMeta, saldoCuenta, patrimonio, fijosPorRevisar, DIAS_REVISION, valorMeta,
} from '../../finanzas.js';
import { PLANTILLAS_META } from '../../datos_finanzas.js';
import * as graficos from '../../graficos.js';
import { pestanaFinanzas, moduloPlanB, PESTANAS_FINANZAS, piezasFinanzas } from '../../vistas/finanzas.js';
import { usarEstado } from '../usarEstado';
import { Registrar, mes } from './FinanzasMovimientos';
import { deudas, prestamos } from './FinanzasDeudas';
import { Calcular, esperas } from './FinanzasCalculos';
import { planb } from './FinanzasPlanB';
import { Aportar, Aviso, CampoFecha, CampoNumero, CampoPesos, CampoTexto, Chico, Controles, Estado, FILA, FILA_BOTONES, GRANDE, Item, Selector } from './finanzasPiezas';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { CampoSolo, DOS } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';
import { Opciones, HtmlViejo, Cifras, Avance } from '../ui/Varios';

const VISTA = 'finanzas';
// Los datos de finanzas todavía no tienen tipos (vienen de src/finanzas.js, en JavaScript)
/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
// Los gráficos devuelven HTML (ver HtmlViejo)
const { barrasAgrupadas, linea, tablaDatos } = graficos as unknown as Record<string, (...a: any[]) => string>;
const { cat, cuentas, pct, corto, nombreMes, millones, ESTADOS, ESTADOS_INGRESO } = piezasFinanzas as {
  cat: (tipo: string, id: string) => { nombre: string; icono: string }; cuentas: () => Fin[]; pct: (x: number | null) => string; corto: (mes: string) => string;
  nombreMes: (mes: string) => string; millones: (n: number) => string; ESTADOS: Record<string, string>; ESTADOS_INGRESO: Record<string, string>;
};
const PESTANAS = Object.entries(PESTANAS_FINANZAS) as [string, string][];

// ---------- 📈 Resumen ----------
function resumen(f: Fin) {
  const p = patrimonio(f), hoy = iso(), historial = f.historial || {};
  const meses = Array.from({ length: 6 }, (_, i) => mesDe(sumarMeses(hoy.slice(0, 8) + '01', i - 5)) as string);
  // Neto de cada mes: la foto guardada (la del mes en curso, en vivo)
  const puntos = meses.map((m) => {
    const h = m === mesDe(hoy) ? p : historial[m];
    const v = h ? h.ahorro + h.cuentas + (h.porCobrar || 0) - h.deudas : null;
    return { etiqueta: corto(m), v, tip: corto(m) + ': ' + (v == null ? 'sin datos' : pesos(v)) };
  });
  const res = meses.map((m) => [m, resumenMes(f, m)] as [string, Fin]);
  const hayMeses = res.some(([, r]) => r.ingresos || r.gastos);
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave="Patrimonio neto" titulo="Patrimonio neto" lado={<Box component="b" sx={{ color: p.neto >= 0 ? 'success.main' : 'error.main' }}>{pesos(p.neto)}</Box>}>
        <Nota>Lo que tienes (ahorros, cuentas y lo que te deben) menos lo que debes. Que suba mes a mes es la señal de que vas bien.</Nota>
        <Cifras datos={[
          { titulo: 'Ahorrado', valor: pesos(p.ahorro), color: tokens.azul },
          { titulo: 'En cuentas', valor: pesos(p.cuentas) },
          ...(p.porCobrar ? [{ titulo: 'Te deben', valor: pesos(p.porCobrar) }] : []),
          { titulo: 'Deudas', valor: pesos(p.deudas), color: tokens.rojo },
        ]} />
        {/* Los gráficos todavía los dibuja graficos.js (los usan las pantallas de antes) */}
        {puntos.filter((x) => x.v != null).length > 1
          ? <HtmlViejo html={linea(puntos, { formato: millones, margenEje: Math.max(1, Math.abs(p.neto) * 0.05) })} />
          : <Nota>El gráfico aparece desde el segundo mes.</Nota>}
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="Cuentas" titulo="Cuentas">
        <Nota>Anota cuánto hay hoy en cada una (míralo en el banco o la billetera). Desde ahí la app suma y resta lo que registres con ese método. Si no cuadra, vuelve a ajustar.</Nota>
        {cuentas().map((m) => {
          const s: number | null = saldoCuenta(f, m);
          return (
            <Box key={m.id} sx={{ py: '8px', borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
              <Box sx={{ ...FILA, mb: '6px' }}>
                <span>{m.icono} {m.nombre}{m.ajuste ? <> <Chico>ajustada el {fechaCorta(m.ajuste.fecha)}</Chico></> : null}</span>
                <Box component="b" sx={{ color: s != null && s < 0 ? 'error.main' : undefined }}>{s == null ? '—' : pesos(s)}</Box>
              </Box>
              <Aportar columnas="1fr auto">
                <CampoSolo inputMode="numeric" data-pesos="" placeholder="Saldo real hoy" aria-label={'Saldo de ' + m.nombre} data-saldo={m.id} />
                <Button color="secondary" onClick={() => accion('fin-ajustar', { id: m.id })}>Ajustar</Button>
              </Aportar>
            </Box>
          );
        })}
      </TarjetaPlegable>
      {hayMeses && (
        <TarjetaPlegable vista={VISTA} clave="Últimos 6 meses" titulo="Últimos 6 meses">
          <HtmlViejo html={'<div class="leyenda"><span><i class="serie-1"></i>Ingresos</span><span><i class="serie-2"></i>Gastos</span><span><i class="serie-3"></i>Ahorro</span></div>' +
            barrasAgrupadas(res.map(([m, r]) => ({ etiqueta: corto(m), valores: [r.ingresos, r.gastos, Math.max(0, r.ahorro)],
              tips: [corto(m) + ': ingresos ' + pesos(r.ingresos), corto(m) + ': gastos ' + pesos(r.gastos), corto(m) + ': ahorro ' + pesos(r.ahorro)] })),
            [{ nombre: 'Ingresos', clase: 'serie-1' }, { nombre: 'Gastos', clase: 'serie-2' }, { nombre: 'Ahorro', clase: 'serie-3' }], { formato: millones }) +
            tablaDatos(['Mes', 'Ingresos', 'Gastos', 'Ahorro', 'Tasa de ahorro'], res.map(([m, r]) => [nombreMes(m), pesos(r.ingresos), pesos(r.gastos), pesos(r.ahorro), pct(r.tasaAhorro)]))} />
        </TarjetaPlegable>
      )}
    </>
  );
}

// ---------- 🎯 Presupuesto ----------
function presupuesto(f: Fin) {
  const lista: Fin[] = f.categorias.gasto, hoy = iso();
  const ingresos = [1, 2, 3].map((i) => resumenMes(f, mesDe(sumarMeses(hoy.slice(0, 8) + '01', -i))).ingresos as number).filter(Boolean);
  const ingreso: number = ingresos.length ? ingresos.reduce((a, b) => a + b, 0) / ingresos.length : (resumenMes(f, mesDe(hoy)) as Fin).ingresoEsperado;
  const suma = (g: string) => lista.filter((c) => c.grupo === g).reduce((s, c) => s + (c.presupuesto || 0), 0);
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave="Cómo repartir" titulo="Cómo repartir">
        <Nota>Regla 50/30/20: hasta 50 % del ingreso en necesidades, hasta 30 % en deseos y al menos 20 % a ahorro o a pagar deudas.</Nota>
        {ingreso ? (
          <Cifras datos={[
            { titulo: 'Ingreso de referencia', valor: pesos(ingreso) },
            { titulo: 'Necesidades (50 %)', valor: pesos(ingreso * 0.5), nota: 'presupuestado ' + pesos(suma('necesidad')) },
            { titulo: 'Deseos (30 %)', valor: pesos(ingreso * 0.3), nota: 'presupuestado ' + pesos(suma('deseo')) },
            { titulo: 'Ahorro (20 %)', valor: pesos(ingreso * 0.2) },
          ]} />
        ) : <Aviso>Cuando registres ingresos, aquí aparece cuánto te toca por grupo.</Aviso>}
      </TarjetaPlegable>
      {lista.map((c, i) => {
        const r = 'finanzas.categorias.gasto.' + i;
        return (
          <Item key={c.id || i}>
            <Box sx={{ ...FILA, gap: '8px' }}><b>{c.icono} {c.nombre}</b><Controles lista="finanzas.categorias.gasto" i={i} nombre={c.nombre} total={lista.length} /></Box>
            <Box sx={DOS}>
              <CampoPesos titulo="Presupuesto del mes" ruta={r + '.presupuesto'} valor={c.presupuesto} />
              <Selector titulo="Grupo" ruta={r + '.grupo'} valor={c.grupo} opciones={[{ id: 'necesidad', nombre: 'Necesidad' }, { id: 'deseo', nombre: 'Deseo' }]} />
            </Box>
            <Desplegable titulo="Nombre e ícono">
              <Box sx={DOS}><CampoTexto titulo="Nombre" ruta={r + '.nombre'} valor={c.nombre} /><CampoTexto titulo="Ícono" ruta={r + '.icono'} valor={c.icono} max={4} /></Box>
            </Desplegable>
          </Item>
        );
      })}
      <Button fullWidth color="secondary" sx={GRANDE} onClick={() => accion('ed-agregar', { lista: 'finanzas.categorias.gasto' })}>＋ Categoría</Button>
    </>
  );
}

// ---------- 🔁 Fijos: ingresos y pagos de cada mes ----------
function tarjetaFijo(f: Fin, x: Fin, i: number) {
  const s = estadoFijo(f, x) as { estado: string; fecha: string }, r = 'finanzas.fijos.' + i, ingreso = x.tipo === 'ingreso';
  return (
    <Item key={x.id}>
      <Box sx={{ ...FILA, gap: '8px' }}><b>{cat(ingreso ? 'ingreso' : 'gasto', x.categoria).icono} {x.nombre}</b><Estado estado={s.estado}>{(ingreso ? ESTADOS_INGRESO : ESTADOS)[s.estado]}</Estado></Box>
      <Box sx={{ ...FILA, color: 'text.secondary', fontSize: 14 }}><span>Día {x.dia} de cada mes · {fechaCorta(s.fecha)}</span><Box component="b" sx={{ color: ingreso ? 'success.main' : 'text.primary' }}>{pesos(x.monto)}</Box></Box>
      {s.estado !== 'pagado' && <Button fullWidth onClick={() => accion('fin-pagar-fijo', { id: x.id })}>{(ingreso ? 'Registrar ingreso de ' : 'Registrar pago de ') + pesos(x.monto)}</Button>}
      <Desplegable titulo="Editar">
        <Box sx={{ ...DOS, mb: '8px' }}>
          <CampoTexto titulo="Nombre" ruta={r + '.nombre'} valor={x.nombre} />
          <CampoPesos titulo="Monto" ruta={r + '.monto'} valor={x.monto} />
          <CampoNumero titulo={'Día ' + (ingreso ? 'en que llega' : 'de pago')} ruta={r + '.dia'} valor={x.dia} />
          <Selector titulo="Categoría" ruta={r + '.categoria'} valor={x.categoria} opciones={f.categorias[ingreso ? 'ingreso' : 'gasto']} />
          <Selector titulo={ingreso ? 'Llega a' : 'Método'} ruta={r + '.metodo'} valor={x.metodo} opciones={ingreso ? cuentas() : f.metodos} />
        </Box>
        <Controles lista="finanzas.fijos" i={i} nombre={x.nombre} total={f.fijos.length} />
      </Desplegable>
    </Item>
  );
}
function fijos(f: Fin) {
  const todos = (f.fijos as Fin[]).map((x, i) => [x, i] as [Fin, number]), ingresos = todos.filter(([x]) => x.tipo === 'ingreso'), pagos = todos.filter(([x]) => x.tipo !== 'ingreso');
  const total = (l: [Fin, number][]) => l.reduce((s, [x]) => s + (x.monto || 0), 0);
  // Suscripciones y demás deseos fijos: cuánto suman al año y cuáles toca revisar
  const grupo: Record<string, string> = Object.fromEntries((f.categorias.gasto as Fin[]).map((c) => [c.id, c.grupo]));
  const deseos = pagos.filter(([x]) => grupo[x.categoria] === 'deseo'), revisar = fijosPorRevisar(f) as Fin[];
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave="Ingresos de cada mes" titulo="Ingresos de cada mes" lado={<Box component="b" sx={{ color: 'success.main' }}>{pesos(total(ingresos))}</Box>}>
        <Nota>Salario, arriendos que cobras… Cuentan para la regla 50/30/20 desde el día 1, y cuando llega el día te pregunta si ya llegó.</Nota>
      </TarjetaPlegable>
      {ingresos.map(([x, i]) => tarjetaFijo(f, x, i))}
      <Button fullWidth color="secondary" sx={GRANDE} onClick={() => accion('fin-agregar-ingreso-fijo')}>＋ Ingreso fijo</Button>
      <TarjetaPlegable vista={VISTA} clave="Pagos de cada mes" titulo="Pagos de cada mes" lado={<b>{pesos(total(pagos))}</b>}>
        <Nota>Arriendo, servicios, celular, suscripciones, cuotas… Aparecen solos en 🔔 Recordatorios cuando se acerca el día.</Nota>
      </TarjetaPlegable>
      {deseos.length > 0 && (
        <TarjetaPlegable vista={VISTA} clave="🔍 Deseos fijos" titulo="🔍 Deseos fijos" lado={<b>{pesos(total(deseos) * 12)} al año</b>}>
          {revisar.length ? (
            <>
              <Nota>Cada {DIAS_REVISION} días pregúntate si los sigues usando. Lo que cancelas cuenta como ahorro en ⏳ 72 h.</Nota>
              {revisar.map((x) => (
                <Box key={x.id} sx={{ py: '8px', borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
                  <Box sx={FILA}><span>{cat('gasto', x.categoria).icono} {x.nombre}</span><span>{pesos(x.monto)} <Chico>· {pesos(x.monto * 12)}/año</Chico></span></Box>
                  <Box sx={FILA_BOTONES}>
                    <Button color="secondary" onClick={() => accion('fin-cancelar-fijo', { id: x.id })}>✕ La cancelo</Button>
                    <Button onClick={() => accion('fin-revisar-fijo', { id: x.id })}>✓ La sigo usando</Button>
                  </Box>
                </Box>
              ))}
            </>
          ) : <Nota>✓ Todos revisados. Te vuelve a preguntar en {DIAS_REVISION} días.</Nota>}
        </TarjetaPlegable>
      )}
      {pagos.map(([x, i]) => tarjetaFijo(f, x, i))}
      <Button fullWidth sx={GRANDE} onClick={() => accion('ed-agregar', { lista: 'finanzas.fijos' })}>＋ Pago fijo</Button>
    </>
  );
}

// ---------- 🐷 Ahorro ----------
function ahorro(f: Fin) {
  const prom: number = gastoPromedio(f), metas: Fin[] = f.metas;
  return (
    <>
      {metas.map((m, i) => {
        const r = 'finanzas.metas.' + i, obj: number = objetivoMeta(f, m), lleva: number = valorMeta(f, m), puesto: number = aportado(f, m.id);
        const plan = obj && !m.inversion ? planMeta(f, m) as { falta: number; vencida: boolean; porMes: number; meses: number } : null;
        const gana = m.inversion && m.valor ? lleva - puesto : null, emergencia = m.id === 'emergencia';
        return (
          <Item key={m.id}>
            <Box sx={{ ...FILA, gap: '8px' }}><b>{m.icono || '🐷'} {m.nombre}</b>{!emergencia && <Controles lista="finanzas.metas" i={i} nombre={m.nombre} total={metas.length} />}</Box>
            {m.inversion ? (
              <>
                <Cifras datos={[
                  { titulo: 'Vale hoy', valor: pesos(lleva), nota: m.valor ? 'anotado el ' + fechaCorta(m.valor.fecha) : 'anota el valor abajo' },
                  { titulo: 'Le has puesto', valor: pesos(puesto) },
                  ...(gana != null ? [{ titulo: gana >= 0 ? 'Ganancia' : 'Pérdida', valor: pesos(Math.abs(gana)), color: gana >= 0 ? tokens.verde : tokens.rojo, nota: puesto > 0 ? pct(gana / puesto) : undefined }] : []),
                ]} />
                <Aportar columnas="1fr auto">
                  <CampoSolo inputMode="numeric" data-pesos="" placeholder="Valor hoy" aria-label={'Valor de hoy de ' + m.nombre} data-valor-meta={m.id} />
                  <Button color="secondary" onClick={() => accion('fin-valor-meta', { id: m.id })}>Anotar valor</Button>
                </Aportar>
                {obj ? <><Box sx={FILA}><span>Meta {pesos(obj)}</span><b>{pct(lleva / obj)}</b></Box><Avance parte={lleva / obj} /></> : null}
              </>
            ) : (
              <>
                <Box sx={FILA}><span><b>{pesos(lleva)}</b> de {obj ? pesos(obj) : '—'}</span><b>{obj ? pct(lleva / obj) : ''}</b></Box>
                <Avance parte={obj ? lleva / obj : 0} />
              </>
            )}
            {plan && (plan.falta
              ? (plan.vencida
                ? <Aviso>La fecha ({fechaCorta(m.fecha)}) ya pasó y faltan {pesos(plan.falta)}. Pon una fecha nueva.</Aviso>
                : <Nota>Para el {fechaCorta(m.fecha)} te faltan {pesos(plan.falta)}: aparta <b>{pesos(plan.porMes)} al mes</b>{plan.meses > 1 ? ' durante ' + plan.meses + ' meses' : ''}.</Nota>)
              : <Nota sx={{ color: 'success.main' }}>🎉 ¡Meta cumplida!</Nota>)}
            {emergencia && <Nota>Para imprevistos (salud, moto, quedarte sin ingreso). La meta es {m.meses || 6} meses de gastos{prom ? ' (gastas en promedio ' + pesos(prom) + ' al mes)' : '; registra tus gastos y se calcula sola'}. Guárdalo aparte, en una cuenta que puedas sacar rápido.</Nota>}
            <Aportar>
              <CampoSolo inputMode="numeric" data-pesos="" placeholder="$ 0" aria-label="Monto" data-aporte={m.id} />
              <Button onClick={() => accion('fin-aportar', { id: m.id })}>＋ Aportar</Button>
              <Button color="secondary" onClick={() => accion('fin-retirar', { id: m.id })}>Sacar</Button>
            </Aportar>
            <Desplegable titulo="Editar meta">
              <Box sx={DOS}>
                <CampoTexto titulo="Nombre" ruta={r + '.nombre'} valor={m.nombre} />
                <CampoTexto titulo="Ícono" ruta={r + '.icono'} valor={m.icono} max={4} />
                {emergencia
                  ? <CampoNumero titulo="Meses de gastos" ruta={r + '.meses'} valor={m.meses || 6} />
                  : <Selector titulo="Tipo" ruta={r + '.inversion'} valor={m.inversion ? 'si' : ''} opciones={[{ id: '', nombre: 'Ahorro' }, { id: 'si', nombre: 'Inversión (cambia de valor)' }]} />}
                <CampoPesos titulo={emergencia ? 'Meta fija (opcional)' : 'Meta'} ruta={r + '.objetivo'} valor={m.objetivo} />
                <CampoFecha titulo="Para cuándo (opcional)" ruta={r + '.fecha'} valor={m.fecha} min={iso()} />
              </Box>
            </Desplegable>
          </Item>
        );
      })}
      <Button fullWidth color="secondary" sx={GRANDE} onClick={() => accion('ed-agregar', { lista: 'finanzas.metas' })}>＋ Meta de ahorro</Button>
      <Card component="section" sx={{ mb: '14px', py: '4px' }}>
        <Desplegable titulo="Agregar con un toque">
          {([['Ahorro', (x: Fin) => !x.inversion], ['Inversión', (x: Fin) => x.inversion]] as [string, (x: Fin) => boolean][]).map(([t, filtro]) => (
            <Box key={t}>
              <Parrafo sx={{ fontSize: 14, color: 'text.secondary', my: '6px' }}>{t}</Parrafo>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', pb: '8px' }}>
                {(PLANTILLAS_META as Fin[]).filter(filtro).map((x) => <Chip key={x.nombre} variant="outlined" clickable label={x.icono + ' ' + x.nombre} onClick={() => accion('fin-meta-plantilla', { nombre: x.nombre })} />)}
              </Box>
            </Box>
          ))}
          <Nota>En una inversión anota de vez en cuando cuánto vale. Tu patrimonio usa ese valor, no solo lo que le pusiste.</Nota>
        </Desplegable>
      </Card>
    </>
  );
}

const PESTANA: Record<string, (f: Fin) => ReactNode> = { mes, resumen, presupuesto, fijos, ahorro, deudas, prestamos, esperas };

export default function Finanzas() {
  const estado: Fin = usarEstado(), f: Fin = estado.finanzas, pestana: string = pestanaFinanzas();
  return (
    <>
      <TituloPantalla>Finanzas</TituloPantalla>
      {/* Tocar una pestaña es la acción de siempre: si esa pestaña aún no es de React, main.js pinta la pantalla de antes */}
      <Opciones nombre="Secciones de Finanzas" activa={pestana} datos={(p) => ({ 'data-accion': 'fin-pestana', 'data-p': p })} opciones={PESTANAS}
        sx={{ flexWrap: { md: 'wrap' }, overflowX: { md: 'visible' } }} />
      {/* Registrar es un componente (recuerda lo que se escribe en el buscador); las demás pestañas solo pintan */}
      {pestana === 'registrar' ? <Registrar f={f} /> : pestana === 'calcular' ? <Calcular /> : pestana === 'planb' ? planb(estado, moduloPlanB()) : PESTANA[pestana] ? PESTANA[pestana](f) : null}
    </>
  );
}
