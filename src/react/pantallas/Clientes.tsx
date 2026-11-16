// 👥 Clientes: la lista (tu negocio, agregar, filtrar, plantillas) y cada cliente en pestañas: 📋 Datos, 💳 Pago,
// 🏋️ Rutina (tus días copiados y el mismo editor de ejercicios de Editar), 📆 Ciclo, 🥗 Comidas (el mismo editor de
// Dieta), 📈 Seguimiento, 🔗 App (la nube) y 📤 Compartir. React pinta; las reglas son las de src/vistas/clientes.js
// (cl-…), src/vistas/ciclo-cliente.js (cc-…) y las de Editar (ed, ed-borrar…). Los formularios de agregar (check-in,
// valoración, cliente nuevo, plantilla) se leen por id al tocar su botón: por eso los botones llevan data-accion.
import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, IconButton } from '@mui/material';
import { totalPlan } from '../../dieta.js';
import { OBJETIVOS_CLIENTE, PERIODOS, estadoCobro, resumenNegocio, semanasCiclo, tablaCiclo, semanaDeCiclo, MEDIDAS, PRUEBAS_CLIENTE,
  comparacionValoraciones, pesosCliente, objetivoCliente, textoCliente } from '../../clientes.js';
import { iso, fechaCorta } from '../../fechas.js';
import { pesos } from '../../finanzas.js';
import { linea } from '../../graficos.js';
import { configurada, nube } from '../../nube.js';
import { checkinsNuevos } from '../../coach.js';
import { volumenFase, TIPOS_CICLO } from '../../ciclo.js';
import { miles } from '../../ui.js';
import { piezasClientes } from '../../vistas/clientes.js';
import { TIPOS_PLAN } from '../../vistas/dieta.js';
import { tipoElegido } from '../../vistas/ciclo-cliente.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { accion } from '../acciones';
import { Campo, CampoLargo, CampoLista, DOS } from '../ui/Campo';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';
import { Opciones, Cifras, HtmlViejo, Avance } from '../ui/Varios';
import { Ordenable } from '../ui/Ordenable';
import { EditorEjercicios, Interruptor, Chips } from './Editar';
import { EditorComidas, Macros } from './Dieta';
import { ElegirTipo, CicloExperto, colorDe } from './ClientesCiclo';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const C = piezasClientes as Fin;
const kg = C.kg as (n: number) => string;
const PESTANAS: [string, string][] = [['datos', '📋 Datos'], ['cobro', '💳 Pago'], ['rutina', '🏋️ Rutina'], ['ciclo', '📆 Ciclo'], ['comidas', '🥗 Comidas'], ['seguimiento', '📈 Seguimiento'], ['app', '🔗 App'], ['compartir', '📤 Compartir']];
const PC = 'md'; // desde 900 px, como las filas de Recordatorios
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' };
const BOTONES = { display: 'flex', flexWrap: 'wrap', gap: '8px' };
const ICONO = { minWidth: 44, minHeight: 44, bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', fontSize: 18, '&.Mui-disabled': { opacity: 0.3, color: 'text.primary' } };

const Tarjeta = ({ children, sx }: { children: ReactNode; sx?: object }) => <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '10px', ...sx }}>{children}</Card>;
const H2 = ({ children }: { children: ReactNode }) => <Box component="h2" sx={{ m: 0, fontSize: 17 }}>{children}</Box>;
const H3 = ({ children }: { children: ReactNode }) => <Box component="h3" sx={{ m: '6px 0 0', fontSize: 15 }}>{children}</Box>;
const Corta = ({ children, sx }: { children: ReactNode; sx?: object }) => <Nota sx={{ m: 0, ...sx }}>{children}</Nota>;
const Aviso = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, m: 0 }}>{children}</Box>;
const Plegable = ({ titulo, children }: { titulo: ReactNode; children: ReactNode }) => (
  <Box component="details" sx={{ mb: '14px', '& > summary': { cursor: 'pointer', py: '8px', color: 'text.secondary' }, '& > :not(summary)': { mt: '8px' } }}><summary>{titulo}</summary>{children}</Box>
);
const Rojo = { color: 'error.main' };
// Renglones de "fecha · valor · 🗑"
const Lista = ({ filas }: { filas: { k: string | number; izq: ReactNode; der: ReactNode }[] }) => (
  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid' }}>
    {filas.map((x) => <Box component="li" key={x.k} sx={{ ...FILA, flexWrap: 'nowrap', p: '6px 0', borderBottom: '1px solid', borderColor: 'divider', '& small': { display: 'block', color: 'text.secondary' } }}><Box component="span" sx={{ minWidth: 0 }}>{x.izq}</Box><Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flex: 'none' }}>{x.der}</Box></Box>)}
  </Box>
);
const Borrar = ({ etiqueta, datos }: { etiqueta: string; datos: Record<string, string | number> }) => (
  <IconButton aria-label={etiqueta} {...datos} sx={{ minWidth: 40, minHeight: 40, color: 'error.main', fontSize: 16 }}>🗑</IconButton>
);
// Estado del cobro (etiqueta de color)
const COLOR: Record<string, object> = {
  'al-dia': { bgcolor: tokens.brandSoft, color: tokens.brand }, pronto: { bgcolor: tokens.amarilloFondo, color: tokens.amarillo },
  vencido: { bgcolor: tokens.rojoFondo, color: tokens.rojoSuave }, programado: { bgcolor: tokens.surface2, color: tokens.muted },
};
const BORDE: Record<string, string> = { 'al-dia': tokens.brand, pronto: tokens.amarillo, vencido: tokens.rojo, programado: tokens.azul };
const Estado = ({ clase, children }: { clase: string; children: ReactNode }) => (
  <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap', ...COLOR[clase] }}>{children}</Box>
);
// Campo de un formulario que se lee al tocar su botón (por id): queda vacío cuando la app guarda
const Suelto = ({ id, titulo, ph = '', modo = 'decimal', enter }: { id: string; titulo: string; ph?: string; modo?: string; enter?: string }) => (
  <Campo etiqueta={titulo} id={id} dePaso inputMode={modo as 'decimal'} placeholder={ph} enterKeyHint={enter ? 'done' : 'next'} data-enter={enter} />
);
const ENTRADA = {
  width: '100%', minWidth: 0, minHeight: 44, p: '8px 10px', font: 'inherit', fontSize: 16, color: 'text.primary', bgcolor: 'background.default',
  border: '1px solid', borderColor: 'divider', borderRadius: '10px', boxSizing: 'border-box', '&:focus': { outline: '2px solid', outlineColor: 'primary.main', borderColor: 'transparent' },
};

// ---------- La lista ----------
function ListaClientes({ e }: { e: Fin }) {
  const ls = (e.clientes || []) as Fin[], n = resumenNegocio(ls) as Fin, pls = (e.plantillasCliente || []) as Fin[], filtro = C.ver().filtro;
  const filas = ls.map((c) => ({ c, s: estadoCobro(c) as Fin })).filter(({ s }) => !filtro || s.estado === filtro || (filtro === 'cobrar' && ['vencido', 'pronto'].includes(s.estado)));
  return (
    <>
      <TituloPantalla>Clientes</TituloPantalla>
      {ls.length ? (
        <Tarjeta>
          <H2>📊 Tu negocio</H2>
          <Cifras datos={[
            { titulo: 'Activos', valor: n.activos, nota: 'de ' + n.clientes },
            { titulo: 'Cobrado este mes', valor: pesos(n.cobradoMes), color: tokens.verde },
            { titulo: 'Por cobrar', valor: pesos(n.porCobrar), color: n.vencidos ? tokens.rojo : undefined, nota: n.vencidos + ' vencidos · ' + n.pronto + ' esta semana' },
          ]} />
        </Tarjeta>
      ) : <Corta sx={{ mb: '12px' }}>Arma la rutina, el ciclo y el plan de comida de otras personas a partir de los tuyos, lleva sus check-ins y sus pagos, y compárteles el plan por WhatsApp o en PDF. Ellos no necesitan cuenta.</Corta>}
      <Tarjeta>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: pls.length ? 'minmax(0, 1fr) minmax(0, 220px) auto' : 'minmax(0, 1fr) auto' }, gap: '8px' }}>
          <Box component="input" type="text" id="cl-nombre" placeholder="Nombre del cliente" aria-label="Nombre del cliente nuevo" data-enter="cl-agregar" enterKeyHint="done" autoComplete="off" sx={ENTRADA} />
          {pls.length ? (
            <Box component="select" id="cl-plantilla" aria-label="Empezar desde" sx={ENTRADA}>
              <option value="">Empezar vacío</option>
              {pls.map((p) => <option key={p.id} value={p.id}>📚 {p.nombre}</option>)}
            </Box>
          ) : null}
          <Button data-accion="cl-agregar" sx={{ minHeight: 44 }}>＋ Cliente</Button>
        </Box>
      </Tarjeta>
      {ls.length > 1 ? (
        <Opciones nombre="Filtrar" activa={filtro} datos={(k) => ({ 'data-accion': 'cl-filtro', 'data-v': k })}
          opciones={[['', 'Todos (' + ls.length + ')'], ['cobrar', 'Por cobrar (' + (n.vencidos + n.pronto) + ')'], ['vencido', 'Vencidos (' + n.vencidos + ')'], ['al-dia', 'Al día']]} />
      ) : null}
      {ls.length ? (
        <Box sx={{ display: 'grid', gap: '8px', mb: '14px' }}>
          {filas.map(({ c, s }) => {
            const o = (OBJETIVOS_CLIENTE as Fin)[c.objetivo], w = semanaDeCiclo(c.ciclo) as Fin, [clase, texto] = C.ESTADO_COBRO[s.estado], ultimo = (c.checkins || []).slice(-1)[0];
            const cuando = [c.peso ? kg(c.peso) + ' kg' : 'sin peso', w && w.n ? 'semana ' + w.n + ' · ' + w.fase.nombre : w && w.antes ? 'empieza en ' + w.faltan + ' días' : '', ultimo ? 'check-in ' + fechaCorta(ultimo.fecha) : 'sin check-in'].filter(Boolean).join(' · ');
            return (
              <Box component="section" key={c.id} sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderLeft: '4px solid', borderLeftColor: BORDE[clase] || tokens.line, borderRadius: '12px', p: '6px 8px 6px 4px' }}>
                <ButtonBase data-accion="cl-abrir" data-id={c.id}
                  sx={{ display: 'grid', width: '100%', alignItems: 'center', justifyContent: 'stretch', textAlign: 'left', font: 'inherit', color: 'text.primary', minHeight: 48, p: '4px 6px', borderRadius: '8px', columnGap: { xs: '8px', [PC]: '12px' }, rowGap: '2px',
                    gridTemplateColumns: { xs: '30px auto minmax(0, 1fr) 14px', [PC]: '30px minmax(0, 1.2fr) minmax(0, 1.2fr) auto 14px' }, gridTemplateAreas: { xs: '"ic nombre nombre flecha" "ic estado cuando flecha"', [PC]: '"ic nombre cuando estado flecha"' },
                    '&:hover': { bgcolor: tokens.surface2 }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
                  <Box component="span" aria-hidden="true" sx={{ gridArea: 'ic', fontSize: 20, textAlign: 'center' }}>👤</Box>
                  <Box component="b" sx={{ gridArea: 'nombre', minWidth: 0, overflowWrap: 'anywhere' }}>{c.nombre} <Box component="small" sx={{ fontWeight: 400, color: 'text.secondary' }}>{o ? o[0] : ''}</Box></Box>
                  <Box component="span" sx={{ gridArea: 'estado', justifySelf: 'start' }}><Estado clase={clase}>{texto}{s.proximo && s.estado !== 'al-dia' ? ' · ' + fechaCorta(s.proximo) : ''}</Estado></Box>
                  <Box component="span" sx={{ gridArea: 'cuando', color: 'text.secondary', fontSize: 14, minWidth: 0, overflowWrap: 'break-word' }}>{cuando}</Box>
                  <Box component="span" aria-hidden="true" sx={{ gridArea: 'flecha', color: 'text.secondary' }}>▸</Box>
                </ButtonBase>
              </Box>
            );
          })}
        </Box>
      ) : <Corta sx={{ textAlign: 'center', my: '12px' }}>Aún no tienes clientes. Escribe un nombre arriba y empieza.</Corta>}
      {pls.length ? (
        <Card component="details" sx={{ mb: '14px', '& > summary': { cursor: 'pointer' } }}>
          <summary><Box component="h2" sx={{ display: 'inline', fontSize: 17 }}>📚 Plantillas ({pls.length})</Box></summary>
          <Box sx={{ mt: '8px' }}>
            <Lista filas={pls.map((p, i) => ({ k: p.id, izq: <>{p.nombre}<Box component="small" sx={{ display: 'inline !important' }}> · {p.rutina.length} días · {Object.keys(p.dieta.planes || {}).length} planes</Box></>,
              der: <Borrar etiqueta={'Borrar ' + p.nombre} datos={{ 'data-accion': 'ed-borrar', 'data-lista': 'plantillasCliente', 'data-i': i, 'data-nombre': p.nombre }} /> }))} />
          </Box>
        </Card>
      ) : null}
    </>
  );
}

// ---------- 📋 Datos ----------
function Datos({ c, k }: { c: Fin; k: number }) {
  const r = 'clientes.' + k;
  return (
    <Tarjeta>
      <H2>📋 Datos</H2>
      <Box sx={{ ...DOS, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <Campo etiqueta="Nombre" data-cambio="ed" data-ruta={r + '.nombre'} defaultValue={c.nombre} />
        <Campo etiqueta="Peso (kg)" inputMode="decimal" data-cambio="cl-num" data-k="peso" defaultValue={c.peso ? kg(c.peso) : ''} placeholder="Ej.: 72,5" />
        <Campo etiqueta="Estatura (cm)" inputMode="numeric" data-cambio="cl-num" data-k="estatura" defaultValue={c.estatura || ''} placeholder="Ej.: 170" />
        <Campo etiqueta="Ajuste de comida (%)" inputMode="numeric" data-cambio="cl-num" data-k="ajuste" defaultValue={c.ajuste || 0} />
      </Box>
      <Corta>Objetivo:</Corta>
      <Opciones nombre="Objetivo" envolver activa={c.objetivo || null} datos={(v) => ({ 'data-accion': 'cl-objetivo', 'data-v': v })} sx={{ pb: 0 }}
        opciones={Object.entries(OBJETIVOS_CLIENTE as Fin as Record<string, [string, number]>).map(([id, [t]]) => [id, t] as [string, string])} />
      <Corta>El ajuste sube o baja los carbos y la grasa sobre tu fórmula (la proteína queda por kg de su peso). Tu fórmula es de déficit, así que al elegir el objetivo se pone uno de partida: 0 % para bajar grasa, +55 % para mantener y +80 % para ganar músculo. Es un punto de partida: si en 2 o 3 semanas su peso no va hacia donde quiere, sube o baja 10 %.</Corta>
      <CampoLargo etiqueta="Nota (lesiones, horarios, gustos)" filas={2} data-cambio="ed" data-ruta={r + '.nota'} defaultValue={c.nota || ''} />
      <Box sx={BOTONES}>
        <Button color="secondary" data-accion="cl-duplicar">⧉ Duplicar cliente</Button>
        <Button color="secondary" data-accion="cl-borrar" sx={Rojo}>🗑 Borrar cliente</Button>
      </Box>
    </Tarjeta>
  );
}

// ---------- 💳 Plan y pago ----------
function Cobro({ c }: { c: Fin }) {
  const kb = c.cobro || { precio: 0, cada: 'mes', inicio: iso(), pausa: false, pagos: [] }, s = estadoCobro(c) as Fin, [clase, texto] = C.ESTADO_COBRO[s.estado];
  const pagos = ((kb.pagos || []) as Fin[]).map((p, i) => [p, i] as [Fin, number]).sort((a, b) => b[0].fecha.localeCompare(a[0].fecha));
  const faltan = s.faltan;
  return (
    <Tarjeta>
      <H2>💳 Plan y pago</H2>
      <Box sx={FILA}>
        <Estado clase={clase}>{texto}</Estado>
        <span>{s.proximo ? <>Próximo cobro: <b>{fechaCorta(s.proximo)}</b>{faltan != null ? ' (' + (faltan < 0 ? 'hace ' + -faltan : faltan === 0 ? 'hoy' : 'en ' + faltan) + (Math.abs(faltan) === 1 ? ' día' : faltan === 0 ? '' : ' días') + ')' : ''}</> : s.ultimo ? 'Último pago: ' + fechaCorta(s.ultimo.fecha) : ''}</span>
      </Box>
      <Box sx={{ ...DOS, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <Campo etiqueta="Precio" inputMode="numeric" data-pesos="" data-cambio="cl-cobro" data-k="precio" defaultValue={kb.precio ? miles(kb.precio) : ''} placeholder="$ 0" />
        <CampoLista etiqueta="Cada cuánto" data-cambio="cl-cobro" data-k="cada" defaultValue={kb.cada} opciones={Object.entries(PERIODOS as Fin as Record<string, [string]>).map(([id, [t]]) => [id, t] as [string, string])} />
        <Campo etiqueta="Primer cobro" type="date" data-cambio="cl-cobro" data-k="inicio" defaultValue={kb.inicio || ''} />
      </Box>
      <Interruptor marcado={!!kb.pausa} datos={{ 'data-cambio': 'cl-cobro', 'data-k': 'pausa' }}>⏸ En pausa (no cuenta como activo ni avisa del cobro)</Interruptor>
      {kb.precio > 0 ? (
        <>
          <Box sx={BOTONES}><Button data-accion="cl-pagar">✓ Registrar pago de {pesos(kb.precio)} hoy</Button></Box>
          <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: 44, cursor: 'pointer' }}>
            <Box component="input" type="checkbox" id="cl-a-finanzas" defaultChecked sx={{ width: 22, height: 22, accentColor: tokens.brand }} /> También anotarlo como ingreso en 💰 Finanzas
          </Box>
        </>
      ) : <Corta>Pon el precio para llevar sus pagos.</Corta>}
      {pagos.length ? (
        <>
          <H3>Pagos</H3>
          <Lista filas={pagos.map(([p, i]) => ({ k: i, izq: fechaCorta(p.fecha), der: <>{pesos(p.monto)} <Borrar etiqueta={'Borrar el pago del ' + fechaCorta(p.fecha)} datos={{ 'data-accion': 'cl-pago-borrar', 'data-i': i }} /></> }))} />
        </>
      ) : null}
    </Tarjeta>
  );
}

// ---------- 🏋️ Rutina: tus días copiados y el mismo editor de ejercicios de Editar ----------
function Rutina({ e, c, k }: { e: Fin; c: Fin; k: number }) {
  const r = 'clientes.' + k + '.rutina', mios = (e.rutina as Fin[]).filter((d) => d.ejercicios.length), copiar = C.diasParaCopiar() as string[];
  const elegir = <Chips nombre="Días para copiar" envolver items={mios.map((d) => ({ id: d.id, texto: d.nombre, activo: copiar.includes(d.id), datos: { 'data-accion': 'cl-copiar-dia', 'data-id': d.id } }))} />;
  const cuantos = copiar.length + (copiar.length === 1 ? ' día' : ' días');
  if (!c.rutina.length) return (
    <Tarjeta>
      <H2>🏋️ Empezar la rutina</H2>
      <Corta>Copia tus días (sin tus registros) y después cámbialos para {c.nombre}. Elige cuáles:</Corta>
      {elegir}
      <Box sx={BOTONES}>
        <Button data-accion="cl-copiar-rutina">📋 Copiar {cuantos}</Button>
        <Button color="secondary" data-accion="cl-dia-nuevo">＋ Empezar con un día vacío</Button>
      </Box>
    </Tarjeta>
  );
  const dia = C.diaElegido(c) as number, d = c.rutina[dia], rd = r + '.' + dia, DIAS = C.DIAS as string[];
  return (
    <>
      <Box sx={{ mb: '12px' }}>
        <Chips nombre="Días de su rutina" items={[...(c.rutina as Fin[]).map((x, i) => ({ id: x.id + ':' + i, texto: (x.diaSemana ? DIAS[x.diaSemana].slice(0, 3) + ' · ' : '') + x.nombre, activo: i === dia, datos: { 'data-accion': 'cl-dia', 'data-i': String(i) } })),
          { id: '+', texto: '＋ Día', activo: false, datos: { 'data-accion': 'cl-dia-nuevo' } }]} />
      </Box>
      <Tarjeta key={d.id}>
        <Box sx={FILA}>
          <b>Día</b>
          <Box component="span" sx={{ display: 'flex', gap: '4px' }}>
            <IconButton data-accion="cl-mover-dia" data-n="-1" aria-label="Mover el día antes" disabled={dia === 0} sx={ICONO}>↑</IconButton>
            <IconButton data-accion="cl-mover-dia" data-n="1" aria-label="Mover el día después" disabled={dia === c.rutina.length - 1} sx={ICONO}>↓</IconButton>
            <IconButton data-accion="cl-borrar-dia" aria-label="Borrar el día" sx={{ ...ICONO, color: 'error.main' }}>🗑</IconButton>
          </Box>
        </Box>
        <Box sx={DOS}>
          <Campo etiqueta="Nombre" data-cambio="ed" data-ruta={rd + '.nombre'} defaultValue={d.nombre} />
          <CampoLista etiqueta="Día de la semana" data-cambio="ed" data-tipo="num" data-ruta={rd + '.diaSemana'} defaultValue={String(d.diaSemana || '')} opciones={DIAS.map((t, n) => [n ? String(n) : '', t || 'Sin asignar'] as [string, string])} />
        </Box>
        <Campo etiqueta="Cardio" data-cambio="ed" data-ruta={rd + '.cardio'} defaultValue={d.cardio || ''} placeholder="Ej.: cinta 25 min" />
      </Tarjeta>
      <EditorEjercicios e={e} lista={r} i={dia} key={'ej' + d.id} />
      <Plegable titulo="📋 Copiar otro día mío">
        {elegir}
        <Box><Button color="secondary" data-accion="cl-copiar-rutina" data-sumar="1">Agregar {cuantos}</Button></Box>
      </Plegable>
      <Corta>{c.rutina.length}{c.rutina.length === 1 ? ' día' : ' días'} · {C.series(c)} series a la semana.</Corta>
    </>
  );
}

// ---------- 📆 Ciclo: macrociclo → mesociclos (fases) → semanas ----------
const proximoLunes = () => { const d = new Date(), n = (8 - (d.getDay() || 7)) % 7; d.setDate(d.getDate() + n); return iso(d); };
const Mini = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <Box component="label" sx={{ display: 'grid', gap: '2px', fontSize: 12, color: 'text.secondary', '& input': { textAlign: 'center' } }}>{titulo}{children}</Box>
);
const Entrada = (props: Record<string, Fin>) => <Box component="input" type="text" autoComplete="off" key={String(props.defaultValue ?? '')} sx={ENTRADA} {...props} />;

function Ciclo({ e, c, k }: { e: Fin; c: Fin; k: number }) {
  if (!c.ciclo) return (
    <Tarjeta>
      <H2>📆 Ciclo de entrenamiento</H2>
      <Corta>Un macrociclo de 12 semanas por fases: cada fase sube la carga poco a poco y una descarga deja que el cuerpo asimile lo trabajado. Elige el tipo según su objetivo; después cambias las semanas, las reps y las series de cada fase.</Corta>
      <ElegirTipo k={k} />
      <Campo etiqueta="Empieza el (lunes)" type="date" id="cl-ciclo-inicio" defaultValue={proximoLunes()} />
      <Box><Button data-accion="cl-ciclo-crear">📆 Crear el ciclo {(TIPOS_CICLO as Fin)[tipoElegido()].nombre}</Button></Box>
    </Tarjeta>
  );
  const r = 'clientes.' + k + '.ciclo', t = tablaCiclo(c.ciclo) as Fin[], w = semanaDeCiclo(c.ciclo) as Fin, fases = c.ciclo.fases as Fin[];
  return (
    <>
      <Tarjeta>
        <H2>📆 Ciclo de {semanasCiclo(c.ciclo)} semanas</H2>
        <Corta>{w && w.n ? <>Va en la <b>semana {w.n}</b>: fase <b>{w.fase.nombre}</b> (reps en reserva {w.fase.rir}). {w.fase.objetivo}</> : w && w.antes ? 'Empieza el ' + fechaCorta(c.ciclo.inicio) + ' (en ' + w.faltan + ' días).' : w && w.terminado ? '✓ Terminó. Haz la valoración final y arma el siguiente ciclo.' : ''}</Corta>
        <Campo etiqueta="Empieza el" type="date" data-cambio="ed" data-ruta={r + '.inicio'} defaultValue={c.ciclo.inicio} />
        <Box role="list" aria-label="Semanas del ciclo" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(34px, 1fr))', gap: '4px' }}>
          {t.map((x) => (
            <Box component="span" role="listitem" key={x.n} title={'Semana ' + x.n + ': ' + x.fase.nombre + ', ' + fechaCorta(x.desde) + ' – ' + fechaCorta(x.hasta) + (x.revision ? ' · revisión' : '')}
              sx={{ position: 'relative', display: 'grid', placeItems: 'center', minHeight: 34, borderRadius: '8px', fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums', bgcolor: tokens.surface2,
                boxShadow: 'inset 0 -3px 0 ' + colorDe(fases, x.k), opacity: x.pasada ? 0.45 : 1, outline: x.actual ? '2px solid ' + tokens.ink : undefined }}>
              {x.n}{x.revision ? <Box component="i" aria-hidden="true" sx={{ position: 'absolute', top: 0, right: 4, fontStyle: 'normal', color: 'warning.main' }}>•</Box> : null}
            </Box>
          ))}
        </Box>
        <Corta>• = semana de revisión (la primera y la última de cada fase): pide valoración y check-in.</Corta>
      </Tarjeta>
      <Box component="h2" sx={{ m: '18px 0 8px', color: 'text.secondary', fontSize: 15, textTransform: 'uppercase', letterSpacing: '.04em' }}>Fases (mesociclos)</Box>
      <Ordenable n={fases.length} clave={(i) => fases[i].id || i} alSoltar={(orden) => accion('ed-ordenar', { lista: r + '.fases', orden: orden.join(',') })} datos={{ 'data-orden-lista': r + '.fases' }}>
        {(i, asa) => {
          const x = fases[i], rf = r + '.fases.' + i;
          return (
            <Card component="section" data-ed-item="" sx={{ mb: '14px', p: '10px', display: 'grid', gap: '8px', borderLeft: '4px solid ' + colorDe(fases, i) }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '34px minmax(0, 1fr) 72px 72px auto', gap: '6px', alignItems: 'end',
                '@media (max-width: 640px)': { gridTemplateColumns: '34px minmax(0, 1fr) minmax(0, 1fr) auto', gridTemplateAreas: '"asa nombre nombre borrar" ". sem rir ."',
                  '& > :nth-of-type(1)': { gridArea: 'asa' }, '& > input': { gridArea: 'nombre' }, '& > label:nth-of-type(1)': { gridArea: 'sem' }, '& > label:nth-of-type(2)': { gridArea: 'rir' }, '& > :last-child': { gridArea: 'borrar' } } }}>
                {asa(x.nombre)}
                <Entrada data-cambio="ed" data-ruta={rf + '.nombre'} defaultValue={x.nombre} aria-label="Nombre de la fase" style={{ fontWeight: 700 }} />
                <Mini titulo="Semanas"><Entrada inputMode="numeric" data-cambio="cl-fase-semanas" data-i={i} defaultValue={x.semanas} aria-label={'Semanas de ' + x.nombre} /></Mini>
                <Mini titulo="RIR"><Entrada data-cambio="ed" data-ruta={rf + '.rir'} defaultValue={x.rir} aria-label={'Reps en reserva de ' + x.nombre} /></Mini>
                <IconButton data-accion="cl-fase-borrar" data-i={i} aria-label={'Borrar la fase ' + x.nombre} sx={{ minWidth: 44, minHeight: 44, color: 'error.main', fontSize: 16 }}>🗑</IconButton>
              </Box>
              <Box sx={DOS}>
                <Mini titulo="Reps"><Entrada data-cambio="ed" data-ruta={rf + '.reps'} defaultValue={x.reps || ''} placeholder="Ej.: 8-12" aria-label={'Reps de ' + x.nombre} /></Mini>
                <Mini titulo="Series (% de su rutina)"><Entrada inputMode="numeric" data-cambio="ed" data-tipo="num" data-ruta={rf + '.volumen'} defaultValue={volumenFase(x)} aria-label={'Series de ' + x.nombre + ' en % de su rutina'} /></Mini>
              </Box>
              <Box component="textarea" rows={2} key={'o' + (x.objetivo || '')} data-cambio="ed" data-ruta={rf + '.objetivo'} defaultValue={x.objetivo || ''} aria-label={'Objetivo de ' + x.nombre} sx={{ ...ENTRADA, resize: 'vertical' }} />
            </Card>
          );
        }}
      </Ordenable>
      <Box sx={{ ...BOTONES, mb: '14px' }}>
        <Button color="secondary" data-accion="cl-fase-nueva">＋ Fase</Button>
        <Button color="secondary" data-accion="cl-ciclo-borrar" sx={Rojo}>Quitar el ciclo</Button>
      </Box>
      <CicloExperto c={c} k={k} objetivos={e.config.objetivos} />
    </>
  );
}

// ---------- 🥗 Comidas: tus planes ajustados a su peso, con el mismo editor de Dieta ----------
function Comidas({ e, c, k }: { e: Fin; c: Fin; k: number }) {
  const planes = c.dieta.planes || {}, tipos = Object.keys(planes), copiar = C.planesParaCopiar() as string[];
  const elegir = <Chips nombre="Planes para copiar" envolver items={Object.entries(TIPOS_PLAN as Record<string, string>).map(([t, nombre]) => ({ id: t, texto: nombre, activo: copiar.includes(t), datos: { 'data-accion': 'cl-copiar-plan', 'data-t': t } }))} />;
  const sinPeso = !(c.peso > 0) ? <Aviso>Pon su peso en 📋 Datos para ajustar las cantidades a lo que le toca.</Aviso> : null;
  if (!tipos.length) return (
    <Tarjeta>
      <H2>🥗 Empezar el plan de comida</H2>
      <Corta>Copia tus planes y se ajustan solos a su peso. Elige cuáles:</Corta>
      {elegir}
      {sinPeso}
      <Box><Button data-accion="cl-copiar-dieta">📋 Copiar {copiar.length}{copiar.length === 1 ? ' plan' : ' planes'}</Button></Box>
    </Tarjeta>
  );
  const elegido = C.planElegido(c) as string, plan = planes[elegido], total = totalPlan(plan, e.dieta.alimentos), obj = objetivoCliente(e.dieta.config, c, elegido) as Fin;
  return (
    <>
      <Opciones nombre="Planes" activa={elegido} datos={(t) => ({ 'data-accion': 'cl-plan', 'data-t': t })} opciones={tipos.map((t) => [t, (TIPOS_PLAN as Fin)[t] || t] as [string, string])} />
      <Tarjeta>
        <Box sx={FILA}><b>{plan.nombre}</b><Macros t={total} /></Box>
        {sinPeso}
        {obj ? <Corta>Con <b>{kg(c.peso)} kg</b> le toca <b>≈ {miles(obj.kcal)} kcal</b> ({kg(obj.kcal / c.peso)} kcal por kg): proteína <b>{obj.p} g</b>{obj.c != null ? <>, carbos <b>{obj.c} g</b>, grasa <b>{obj.g} g</b></> : null}. Ajuste: {(c.ajuste > 0 ? '+' : '') + (c.ajuste || 0)} % (en 📋 Datos).</Corta> : null}
        <Box sx={BOTONES}>
          {c.peso > 0 ? <Button data-accion="cl-recalcular">⚖️ Ajustar todo a su peso</Button> : null}
          <Button color="secondary" data-accion="cl-quitar-plan" sx={Rojo}>Quitar este plan</Button>
        </Box>
      </Tarjeta>
      <EditorComidas e={e} ruta={'clientes.' + k + '.dieta.planes.' + elegido} plan={plan} key={elegido} />
      <Plegable titulo="📋 Copiar más planes míos">
        {elegir}
        <Box><Button color="secondary" data-accion="cl-copiar-dieta" data-sumar="1">Agregar los que falten</Button></Box>
      </Plegable>
    </>
  );
}

// ---------- 📈 Seguimiento: check-ins y valoraciones ----------
const sube = (k: string, cambio: number) => cambio === 0 ? undefined : (cambio > 0) === !['peso', 'cintura', 'cadera'].includes(k) ? 'success.main' : 'error.main';
function Seguimiento({ c }: { c: Fin }) {
  const ck = (c.checkins || []) as Fin[], vs = (c.valoraciones || []) as Fin[], pesosC = pesosCliente(c) as Fin[], comp = comparacionValoraciones(vs) as Fin[];
  const medidas = [...(MEDIDAS as Fin[]), ...(PRUEBAS_CLIENTE as Fin[])] as [string, string, string][];
  const primero = pesosC[0], ultimo = pesosC[pesosC.length - 1];
  return (
    <>
      <Tarjeta>
        <H2>✅ Check-in de la semana</H2>
        <Box sx={BOTONES}><Button data-accion="cl-checkin-pedir">📤 Pedirle el check-in por WhatsApp</Button></Box>
        <Corta>Cuando te responda, anótalo aquí:</Corta>
        <Box sx={DOS}>
          <Suelto id="ck-peso" titulo="Peso (kg)" ph={c.peso ? kg(c.peso) : ''} />
          <Suelto id="ck-sueno" titulo="Sueño (1-5)" ph="1 a 5" modo="numeric" />
          <Suelto id="ck-energia" titulo="Energía (1-5)" ph="1 a 5" modo="numeric" />
          <Suelto id="ck-entreno" titulo="Entrenos hechos" ph="Ej.: 4" modo="numeric" />
          <Suelto id="ck-comida" titulo="Plan de comida (%)" ph="Ej.: 80" modo="numeric" />
        </Box>
        <Campo etiqueta="Nota" id="ck-nota" dePaso placeholder="Molestias, dudas, lo que te contó" data-enter="cl-checkin" />
        <Button fullWidth data-accion="cl-checkin">Guardar check-in</Button>
        {ck.length ? (
          <Lista filas={ck.map((x, i) => [x, i] as [Fin, number]).reverse().map(([x, i]) => ({ k: x.id || i,
            izq: <><b>{fechaCorta(x.fecha)}</b> {[x.peso ? kg(x.peso) + ' kg' : '', x.sueno ? '🌙 ' + x.sueno : '', x.energia ? '⚡ ' + x.energia : '', x.entreno != null && x.entreno !== '' ? '🏋️ ' + x.entreno : '', x.comida != null && x.comida !== '' ? '🥗 ' + x.comida + ' %' : ''].filter(Boolean).join(' · ')}{x.nota ? <small>{x.nota}</small> : null}</>,
            der: <Borrar etiqueta={'Borrar check-in del ' + fechaCorta(x.fecha)} datos={{ 'data-accion': 'cl-registro-borrar', 'data-lista': 'checkins', 'data-i': i }} /> }))} />
        ) : null}
      </Tarjeta>
      {pesosC.length >= 2 ? (
        <Tarjeta>
          <H2>⚖️ Peso</H2>
          <HtmlViejo html={linea(pesosC.map((x) => ({ etiqueta: fechaCorta(x.fecha), v: x.peso, tip: fechaCorta(x.fecha) + ': ' + kg(x.peso) + ' kg' })), { formato: kg })} />
          <Corta>{kg(primero.peso)} → <b>{kg(ultimo.peso)} kg</b> ({ultimo.peso >= primero.peso ? '+' : '−'}{kg(Math.abs(ultimo.peso - primero.peso))} kg desde el {fechaCorta(primero.fecha)})</Corta>
        </Tarjeta>
      ) : null}
      <Tarjeta>
        <H2>📏 Valoración</H2>
        <Corta>Al empezar y en cada semana de revisión del ciclo. Llena lo que midas.</Corta>
        <Box sx={DOS}>{medidas.map(([id, t, u]) => <Suelto key={id} id={'va-' + id} titulo={t + ' (' + u + ')'} />)}</Box>
        <Button fullWidth data-accion="cl-valoracion">Guardar valoración</Button>
        {comp.length ? (
          <>
            <H3>Cambio desde el {fechaCorta(comp[0].desde)}</H3>
            <Lista filas={comp.map((x) => ({ k: x.k, izq: x.nombre, der: <span>{kg(x.antes)} → <b>{kg(x.ahora)} {x.u}</b> <Box component="small" sx={{ display: 'inline !important', color: sube(x.k, x.cambio) + ' !important' }}>{(x.cambio > 0 ? '+' : '') + kg(x.cambio)}</Box></span> }))} />
          </>
        ) : null}
        {vs.length ? (
          <Plegable titulo={'Valoraciones (' + vs.length + ')'}>
            <Lista filas={vs.map((x, i) => [x, i] as [Fin, number]).reverse().map(([x, i]) => ({ k: x.id || i,
              izq: <>{fechaCorta(x.fecha)}<small>{medidas.filter(([id]) => x[id] > 0).map(([id, t, u]) => t + ' ' + kg(x[id]) + ' ' + u).join(' · ')}</small></>,
              der: <Borrar etiqueta={'Borrar valoración del ' + fechaCorta(x.fecha)} datos={{ 'data-accion': 'cl-registro-borrar', 'data-lista': 'valoraciones', 'data-i': i }} /> }))} />
          </Plegable>
        ) : null}
      </Tarjeta>
    </>
  );
}

// ---------- 🔗 App: el cliente entra con su cuenta, recibe el plan que publicas y te comparte su avance ----------
function App({ c }: { c: Fin }) {
  const ver = C.ver(), conNube = configurada && (nube as Fin).usuario;
  useEffect(() => { if (conNube) C.pedirRemotos(); });
  if (!configurada) return <Tarjeta><H2>🔗 App del cliente</H2><Aviso>Esta versión de la app no tiene la nube configurada.</Aviso></Tarjeta>;
  if (!(nube as Fin).usuario) return <Tarjeta><H2>🔗 App del cliente</H2><Aviso>Inicia sesión en la nube (⚙️ Ajustes) para invitar a tus clientes.</Aviso></Tarjeta>;
  const explicacion = <Corta>Con su cuenta, {c.nombre} ve su plan en su Gym y su Dieta, anota sus entrenos y te manda su check-in. Tú ves un resumen de su avance: series por semana, peso, sueño, fuerza y check-ins. No ves el resto de sus datos (el administrador de la app sí ve este resumen) y él puede cortar cuando quiera.</Corta>;
  if (ver.remotos == null) return <Tarjeta><H2>🔗 App del cliente</H2><Corta>Cargando…</Corta></Tarjeta>;
  const a = (ver.remotos as Fin[]).find((x) => x.local === c.id), r = a && a.resumen;
  if (!a) return (
    <Tarjeta>
      <H2>🔗 App del cliente</H2>
      {explicacion}
      {ver.error ? <Aviso>{ver.error}</Aviso> : null}
      <Box><Button data-accion="cl-invitar">🔗 Invitar a la app</Button></Box>
      <Corta>Necesita un usuario para entrar. La app aún no deja crear cuentas: créaselo tú en Supabase (Authentication → Add user) y mándale su correo y contraseña.</Corta>
    </Tarjeta>
  );
  if (a.estado === 'invitado') return (
    <Tarjeta>
      <H2>🔗 Invitación enviada</H2>
      <Parrafo sx={{ m: 0 }}>Código: <Box component="b" sx={{ fontSize: 26, letterSpacing: '.15em', fontVariantNumeric: 'tabular-nums' }}>{a.codigo}</Box></Parrafo>
      <Corta>Cuando lo acepte, aquí ves su correo y su avance.</Corta>
      <Box sx={BOTONES}>
        <Button data-accion="cl-invitacion-enviar" data-codigo={a.codigo}>📤 Mandarle la invitación</Button>
        <Button color="secondary" data-accion="cl-remotos">🔄 Revisar si ya aceptó</Button>
        <Button color="secondary" data-accion="cl-terminar" sx={Rojo}>Cancelar invitación</Button>
      </Box>
      {explicacion}
    </Tarjeta>
  );
  const nuevos = checkinsNuevos(c, r) as Fin[], sem = ((r && r.semanas) || []) as Fin[], ps = ((r && r.pesos) || []) as Fin[];
  return (
    <>
      <Tarjeta>
        <H2>🔗 Conectado</H2>
        <Corta>{(a.correo || '') + (a.aceptado ? ' · desde el ' + fechaCorta(String(a.aceptado).slice(0, 10)) : '')}</Corta>
        <Parrafo sx={{ m: 0 }}>{a.plan_version ? <>Plan publicado el <b>{fechaCorta(iso(new Date(Number(a.plan_version))))}</b>.</> : 'Aún no le has publicado el plan.'}</Parrafo>
        <Box sx={BOTONES}>
          <Button data-accion="cl-publicar">📲 {a.plan_version ? 'Publicar los cambios' : 'Publicar su plan'}</Button>
          <Button color="secondary" data-accion="cl-remotos">🔄 Actualizar</Button>
        </Box>
        <Corta>Le llega su rutina, su ciclo y sus comidas. Cada vez que cambies algo, publica de nuevo: él decide cuándo usarlo.</Corta>
      </Tarjeta>
      <Tarjeta>
        <H2>📊 Su avance</H2>
        {!r ? <Corta>Aún no ha compartido nada (se manda solo cuando abre la app).</Corta> : (
          <>
            <Corta>Actualizado el {fechaCorta(r.actualizado)} · semana {r.semana} de su Gym{r.sueno ? ' · duerme ' + String(r.sueno).replace('.', ',') + ' h en promedio' : ''}</Corta>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: '6px' }}>
              {sem.map((x) => (
                <Box key={x.n} sx={{ display: 'grid', gap: '2px', p: '6px 8px', borderRadius: '8px', bgcolor: 'background.default' }}>
                  <Box component="small" sx={{ color: 'text.secondary', fontSize: 12 }}>S{x.n}</Box><b>{x.hechas}/{x.plan}</b><Avance parte={x.plan ? x.hechas / x.plan : 0} />
                </Box>
              ))}
            </Box>
            {ps.length ? <Parrafo sx={{ m: 0 }}>⚖️ {kg(ps[0].peso)} → <b>{kg(ps[ps.length - 1].peso)} kg</b> <small>({fechaCorta(ps[0].fecha)} – {fechaCorta(ps[ps.length - 1].fecha)})</small></Parrafo> : null}
            {(r.fuerza || []).length ? (
              <>
                <H3>💪 Fuerza (4 semanas)</H3>
                <Lista filas={(r.fuerza as Fin[]).map((x) => ({ k: x.nombre, izq: <>{x.nombre}<small>{kg(x.de.peso)} × {x.de.reps} → {kg(x.a.peso)} × {x.a.reps} {x.a.unidad || ''}</small></>,
                  der: <Box component="b" sx={{ color: x.cambio > 0.005 ? 'success.main' : x.cambio < -0.005 ? 'error.main' : undefined }}>{(x.cambio >= 0 ? '+' : '') + Math.round(x.cambio * 1000) / 10} %</Box> }))} />
              </>
            ) : null}
            {nuevos.length ? (
              <>
                <Aviso>📥 {nuevos.length}{nuevos.length === 1 ? ' check-in nuevo' : ' check-ins nuevos'} (el último del {fechaCorta(nuevos[nuevos.length - 1].fecha)}).</Aviso>
                <Box><Button data-accion="cl-traer-checkins">Pasarlos a 📈 Seguimiento</Button></Box>
              </>
            ) : null}
          </>
        )}
      </Tarjeta>
      <Button variant="text" data-accion="cl-terminar" sx={{ ...Rojo, mb: '14px' }}>Terminar la conexión con {c.nombre}</Button>
    </>
  );
}

// ---------- 📤 Compartir ----------
function Compartir({ e, c }: { e: Fin; c: Fin }) {
  const texto = textoCliente(c, e.dieta) as string;
  return (
    <>
      <Tarjeta>
        <H2>📤 Compartir con {c.nombre}</H2>
        <Box sx={BOTONES}>
          <Button data-accion="cl-enviar">📤 Enviar (WhatsApp u otra app)</Button>
          <Button color="secondary" data-accion="cl-copiar-texto">📋 Copiar texto</Button>
          <Button color="secondary" data-accion="cl-pdf">🖨️ PDF del plan</Button>
          {(c.rutina as Fin[]).some((d) => d.ejercicios.length && d.diaSemana) ? <Button color="secondary" data-accion="cl-imagen">🖼️ Imagen de la rutina</Button> : null}
        </Box>
        <Corta>En 🖨️ PDF elige "Guardar como PDF" y mándaselo.</Corta>
        {(c.rutina as Fin[]).some((d) => d.ejercicios.length && !d.diaSemana) ? <Corta>La imagen muestra solo los días con día de la semana asignado (en 🏋️ Rutina).</Corta> : null}
        <Box component="details" sx={{ '& > summary': { cursor: 'pointer', py: '8px', color: 'text.secondary' } }}>
          <summary>Ver el texto</summary>
          <Box component="pre" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontFamily: 'inherit', fontSize: 14, bgcolor: 'background.default', p: '10px', borderRadius: '10px', m: '8px 0 0' }}>{texto}</Box>
        </Box>
      </Tarjeta>
      <Tarjeta>
        <H2>📚 Guardar como plantilla</H2>
        <Corta>Guarda la rutina, las comidas y el ciclo de {c.nombre} para empezar otro cliente igual (al agregarlo, elige la plantilla).</Corta>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' }, gap: '8px' }}>
          <Box component="input" type="text" id="cl-plantilla-nombre" placeholder="Ej.: Hipertrofia 4 días" aria-label="Nombre de la plantilla" autoComplete="off" data-enter="cl-plantilla-guardar" sx={ENTRADA} />
          <Button color="secondary" data-accion="cl-plantilla-guardar">Guardar</Button>
        </Box>
      </Tarjeta>
    </>
  );
}

function Cliente({ e, c, k }: { e: Fin; c: Fin; k: number }) {
  const p = C.ver().pestana;
  const cuerpo = p === 'cobro' ? <Cobro c={c} /> : p === 'rutina' ? <Rutina e={e} c={c} k={k} /> : p === 'ciclo' ? <Ciclo e={e} c={c} k={k} /> : p === 'comidas' ? <Comidas e={e} c={c} k={k} />
    : p === 'seguimiento' ? <Seguimiento c={c} /> : p === 'app' ? <App c={c} /> : p === 'compartir' ? <Compartir e={e} c={c} /> : <Datos c={c} k={k} />;
  return (
    <>
      <Button variant="text" data-accion="cl-cerrar" sx={{ p: '4px 0', minHeight: 36, mb: '4px', color: 'primary.main' }}>← Todos los clientes</Button>
      <TituloPantalla>{c.nombre}</TituloPantalla>
      <Opciones nombre="Secciones del cliente" activa={p} datos={(t) => ({ 'data-accion': 'cl-pestana', 'data-p': t })} opciones={PESTANAS} />
      <Box key={c.id + ':' + p}>{cuerpo}</Box>
    </>
  );
}

export default function Clientes({ pestana }: { pestana?: string }) {
  // El enlace (#clientes/<id>) abre ese cliente una sola vez, al abrir
  useState(() => { if (pestana) accion('abrir-clientes', { p: pestana }); return 0; });
  const e = usarEstado() as Fin, k = C.abiertoK() as number, c = k >= 0 ? e.clientes[k] : null;
  return c ? <Cliente e={e} c={c} k={k} /> : <ListaClientes e={e} />;
}
