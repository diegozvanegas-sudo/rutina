// 💰 Finanzas: 🧮 Calcular (calculadora con teclado y las cuentas que salen seguido) y ⏳ 72 h (esperar antes de comprar).
// La calculadora no guarda nada en los datos: lo escrito vive en "calc" (src/vistas/calculadora.js) mientras la app está abierta.
import { useState, type FormEvent, type ReactNode } from 'react';
import { Box, Button } from '@mui/material';
import { fechaCorta } from '../../fechas.js';
import { pesos } from '../../finanzas.js';
import { leerNumero, numero, porcentajeDe, queTanto, conAumento, conDescuento, sinIncluido, dividir, cuotaCredito, mensualDeAnual, anualDeMensual, cuatroPorMil } from '../../calculadora.js';
import { estadoEspera, resumenEsperas } from '../../vida.js';
import { piezasCalculadora } from '../../vistas/calculadora.js';
import { piezasEsperas } from '../../vistas/vida.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLista, CampoSolo, DOS } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import { Opciones, Cifras } from '../ui/Varios';
import { ListaPares, type Par } from '../ui/ListaPares';
import { Aviso, Chico, FILA, FILA_BOTONES, Item } from './finanzasPiezas';

const VISTA = 'finanzas';
/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
type Calc = Record<'expr' | 'monto' | 'pct' | 'parte' | 'total' | 'cuenta' | 'personas' | 'propina' | 'credito' | 'tasa' | 'tipoTasa' | 'meses' | 'gmf', string>;
const { calc, resultadoCalc } = piezasCalculadora as { calc: Calc; resultadoCalc: () => string };
const { espera, SENALES } = piezasEsperas as { espera: { tipo: string }; SENALES: string[] };

// ---------- 🧮 Calcular ----------
const num = (k: keyof Calc) => { const n: number = leerNumero(calc[k]); return isFinite(n) ? n : 0; };
const TECLAS = ['C', '⌫', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '000', ',', '='];
const fila = (id: string, nombre: ReactNode, valor: ReactNode, color?: string): Par => ({ id, nombre, valor: <Box component="b" sx={{ textAlign: 'right', whiteSpace: 'nowrap', color }}>{valor}</Box> });
const Lista = ({ filas }: { filas: Par[] }) => <Box sx={{ mt: '10px' }}><ListaPares pares={filas} /></Box>;

function salidaPorcentaje() {
  const x = num('monto'), p = num('pct');
  if (!x || !p) return <Nota>Escribe un valor y un porcentaje.</Nota>;
  return <Lista filas={[
    fila('de', numero(p) + ' % de ' + pesos(x), pesos(porcentajeDe(p, x))),
    fila('mas', pesos(x) + ' + ' + numero(p) + ' %', pesos(conAumento(x, p))),
    fila('menos', pesos(x) + ' − ' + numero(p) + ' %', pesos(conDescuento(x, p))),
    fila('sin', 'Si ' + pesos(x) + ' ya incluye el ' + numero(p) + ' %, sin él era', <>{pesos(sinIncluido(x, p))} <Chico>(el {numero(p)} % era {pesos(x - sinIncluido(x, p))})</Chico></>),
  ]} />;
}
function salidaProporcion() {
  const a = num('parte'), b = num('total');
  return a && b ? <Lista filas={[fila('es', pesos(a) + ' es de ' + pesos(b), numero(queTanto(a, b), 1) + ' %')]} /> : null;
}
function salidaDividir() {
  const t = num('cuenta'), n = Math.max(1, Math.floor(num('personas') || 1)), d = dividir(t, n, num('propina')) as { propina: number; total: number; porPersona: number };
  if (!t) return <Nota>Escribe el total de la cuenta.</Nota>;
  return <Lista filas={[
    ...(d.propina ? [fila('propina', 'Propina', pesos(d.propina)), fila('total', 'Total con propina', pesos(d.total))] : []),
    fila('cada', 'Cada uno (' + n + ')', pesos(d.porPersona), tokens.verde),
  ]} />;
}
function salidaCredito() {
  const m = num('credito'), t = num('tasa'), mensual: number = calc.tipoTasa === 'anual' ? mensualDeAnual(t) : t;
  const c = cuotaCredito(m, mensual, num('meses')) as { cuota: number; total: number; intereses: number } | null;
  const equivale = t ? <Nota>{calc.tipoTasa === 'anual' ? numero(t) + ' % E.A. = ' + numero(mensual) + ' % mensual.' : numero(t) + ' % mensual = ' + numero(anualDeMensual(t)) + ' % E.A.'}</Nota> : null;
  if (!c) return <>{equivale}<Nota>Escribe cuánto te prestan y a cuántos meses.</Nota></>;
  return (
    <>
      {equivale}
      <Lista filas={[
        fila('cuota', 'Cuota fija al mes', pesos(c.cuota), tokens.verde),
        fila('total', 'Pagas en total', pesos(c.total)),
        fila('intereses', 'De eso son intereses', pesos(c.intereses), c.intereses > 0 ? tokens.rojo : undefined),
      ]} />
      <Nota>Sin seguros ni cuota de manejo: con ellos la cuota real sale más alta. Pregunta siempre la tasa E.A. y compárala.</Nota>
    </>
  );
}
function salidaGmf() {
  const m = num('gmf');
  if (!m) return <Nota>El 4x1000 es $ 4 por cada $ 1.000 que sale de una cuenta que no está marcada como exenta.</Nota>;
  return <Lista filas={[
    fila('gmf', '4x1000 de ' + pesos(m), pesos(cuatroPorMil(m))),
    fila('saca', 'Para que lleguen ' + pesos(m) + ' completos, saca', pesos(m / 0.996)),
  ]} />;
}

export function Calcular() {
  // Todo se recalcula mientras se escribe: cada tecla vuelve a pintar los resultados (los campos no se tocan, así no se pierde el cursor)
  const [, pintar] = useState(0), repintar = () => pintar((n) => n + 1);
  const alEscribir = (ev: FormEvent<HTMLElement>) => {
    const el = ev.target as HTMLInputElement | HTMLSelectElement, k = el.dataset && el.dataset.calc as keyof Calc | undefined;
    if (k) { calc[k] = el.value; repintar(); }
  };
  const campo = (titulo: string, k: keyof Calc, dinero = true) => (
    <Campo etiqueta={titulo} inputMode={dinero ? 'numeric' : 'decimal'} {...(dinero ? { 'data-pesos': '' } : null)} data-calc={k} defaultValue={calc[k]} />
  );
  return (
    <Box onInput={alEscribir} onChange={alEscribir}>
      <TarjetaPlegable vista={VISTA} clave="🧮 Calculadora" titulo="🧮 Calculadora">
        {/* Enter = resultado y Escape = borrar los atiende src/vistas/calculadora.js; al soltar la tecla se pinta el resultado */}
        <CampoSolo id="calc-expr" inputMode="none" data-calc="expr" defaultValue={calc.expr} placeholder="0" aria-label="Cuenta" onKeyUp={repintar} noVaciar
          sx={{ mt: '8px', '& input': { fontSize: 26, textAlign: 'right', fontVariantNumeric: 'tabular-nums' } }} />
        <Box component="p" aria-live="polite" sx={{ textAlign: 'right', fontSize: 22, fontWeight: 700, color: 'success.main', m: '6px 4px 10px', minHeight: '1.4em', fontVariantNumeric: 'tabular-nums', overflowWrap: 'anywhere' }}>{resultadoCalc()}</Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {TECLAS.map((t) => {
            const numeroOComa = /\d/.test(t) || t === ',';
            return <Button key={t} color={t === '=' ? 'primary' : 'secondary'} onClick={() => { accion('calc-tecla', { t }); repintar(); }}
              sx={{ minHeight: 56, fontSize: 22, p: '6px', minWidth: 0, color: t === '=' || numeroOComa ? undefined : 'primary.main' }}>{t}</Button>;
          })}
        </Box>
        <Button fullWidth color="secondary" sx={{ mt: '8px' }} onClick={() => accion('calc-usar')}>➕ Registrar este valor como gasto o ingreso</Button>
        <Nota>"200.000 + 19 %" suma el 19 % · "80.000 − 10 %" descuenta · también sirven 25k y 1,5M. En el computador puedes escribir con el teclado, con paréntesis.</Nota>
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="％ Porcentajes" titulo="％ Porcentajes">
        <Box sx={DOS}>{campo('Valor', 'monto')}{campo('Porcentaje %', 'pct', false)}</Box>
        {salidaPorcentaje()}
        <Box component="h3" sx={{ mt: '14px', mb: '6px', fontSize: 17 }}>¿Qué porcentaje es?</Box>
        <Box sx={DOS}>{campo('Esto', 'parte')}{campo('De esto', 'total')}</Box>
        {salidaProporcion()}
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="🍽️ Dividir la cuenta" titulo="🍽️ Dividir la cuenta">
        <Box sx={{ display: 'grid', gap: '8px' }}>
          <Box sx={DOS}>{campo('Total', 'cuenta')}{campo('Personas', 'personas', false)}</Box>
          {campo('Propina %', 'propina', false)}
        </Box>
        {salidaDividir()}
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="🏦 Cuota de un crédito" titulo="🏦 Cuota de un crédito">
        <Box sx={DOS}>
          {campo('Te prestan', 'credito')}{campo('Meses', 'meses', false)}{campo('Tasa %', 'tasa', false)}
          <CampoLista etiqueta="La tasa es" data-calc="tipoTasa" defaultValue={calc.tipoTasa} opciones={[['mensual', 'Mensual (M.V.)'], ['anual', 'Anual (E.A.)']]} />
        </Box>
        {salidaCredito()}
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="🧾 4x1000" titulo="🧾 4x1000">
        {campo('Monto que sale de la cuenta', 'gmf')}
        {salidaGmf()}
      </TarjetaPlegable>
    </Box>
  );
}

// ---------- ⏳ 72 h ----------
export function esperas(f: Fin) {
  const lista: Fin[] = (f.esperas ||= []), r = resumenEsperas(lista) as { ahorrado: number; descartadas: number; decididas: number; esperando: number };
  const activas = lista.filter((x) => x.estado === 'esperando'), viejas = lista.filter((x) => x.estado !== 'esperando').slice(-10).reverse();
  const inversion = espera.tipo === 'inversion';
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave="⏳ Regla de las 72 horas" titulo="⏳ Regla de las 72 horas">
        <Nota>Antes de una compra grande o de meter plata en algo que promete mucho, anótalo aquí y espera 3 días. Si después de 72 horas lo sigues queriendo, cómpralo tranquilo. Las decisiones con prisa son las que más cuestan.</Nota>
        <Cifras datos={[
          { titulo: 'Te ahorraste', valor: pesos(r.ahorrado) },
          { titulo: 'Descartaste', valor: r.descartadas + ' de ' + r.decididas },
          { titulo: 'En espera', valor: pesos(r.esperando) },
        ]} />
      </TarjetaPlegable>
      {activas.map((x) => {
        const s = estadoEspera(x) as { lista: boolean; horas: number };
        return (
          <Item key={x.id}>
            <Box sx={{ ...FILA, gap: '8px' }}><b>{x.tipo === 'inversion' ? '📈 ' : '🛍️ '}{x.nombre}</b><b>{pesos(x.monto)}</b></Box>
            {x.motivo && <Nota>Por qué lo quiero: {x.motivo}</Nota>}
            {s.lista ? <Aviso>Ya pasaron las 72 horas. ¿Lo sigues queriendo igual?</Aviso> : <Nota>Faltan {s.horas} horas (desde el {fechaCorta(x.fecha)}).</Nota>}
            <Box sx={FILA_BOTONES}>
              <Button color="secondary" onClick={() => accion('espera-decidir', { id: x.id, e: 'descartado' })}>🙅 Ya no lo quiero</Button>
              {s.lista && <Button onClick={() => accion('espera-decidir', { id: x.id, e: 'comprado' })}>✓ Lo compro</Button>}
            </Box>
          </Item>
        );
      })}
      <TarjetaPlegable vista={VISTA} clave="＋ Algo que quiero comprar" titulo="＋ Algo que quiero comprar">
        <Opciones nombre="Qué es" activa={espera.tipo} opciones={[['compra', '🛍️ Compra'], ['inversion', '📈 Inversión / negocio']]} datos={(k) => ({ 'data-accion': 'espera-tipo', 'data-t': k })} />
        <Box sx={{ display: 'grid', gap: '8px' }}>
          <Box sx={DOS}>
            <Campo dePaso etiqueta="Qué es" id="espera-nombre" placeholder={inversion ? 'Ej.: plataforma de cripto de un amigo' : 'Ej.: audífonos nuevos'} />
            <Campo dePaso etiqueta="Cuánto" id="espera-monto" inputMode="numeric" data-pesos="" placeholder="$ 0" />
          </Box>
          <Campo dePaso etiqueta="Por qué lo quiero" id="espera-motivo" placeholder="Ej.: los míos ya fallan / me prometen el 10 % mensual" />
        </Box>
        {inversion && (
          <Box sx={{ mt: '10px', p: '10px 12px', borderRadius: '10px', borderLeft: '3px solid', borderColor: 'warning.main', bgcolor: 'background.default', fontSize: 14, display: 'grid', gap: '4px' }}>
            <b>🚩 Señales de alerta</b>
            <div>Si se cumple una sola, no metas plata:</div>
            <Box component="ul" sx={{ pl: '20px', m: 0 }}>{SENALES.map((t) => <li key={t}>{t}</li>)}</Box>
            <div>Antes de invertir, verifica que la entidad esté vigilada por la Superintendencia Financiera.</div>
          </Box>
        )}
        <Button fullWidth sx={{ mt: '8px' }} onClick={() => accion('espera-agregar')}>⏳ Empezar a esperar 72 h</Button>
      </TarjetaPlegable>
      {viejas.length > 0 && (
        <TarjetaPlegable vista={VISTA} clave="Decisiones" titulo="Decisiones">
          <ListaPares pares={viejas.map((x) => ({ id: x.id, nombre: <>{x.estado === 'descartado' ? '🙅 ' : '✓ '}{x.nombre} <Chico>{fechaCorta(x.decidido || x.fecha)}</Chico></>, valor: <span>{pesos(x.monto)}</span> }))} />
        </TarjetaPlegable>
      )}
    </>
  );
}
