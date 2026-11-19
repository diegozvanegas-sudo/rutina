// 🧑‍💼 Panel del entrenador: 🏠 Inicio (tu negocio y a quién atender hoy), 💳 Pagos y 📊 Valoraciones de todos tus clientes
// en una fila cada uno (al tocarla se abre ese cliente en su pestaña) y 🎨 Mi marca (nombre, color y logo, con la vista
// previa de cómo la ve tu cliente). React pinta; las reglas son las de src/vistas/panel.js y src/vistas/clientes.js
import { useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card } from '@mui/material';
import { estadoCobro, resumenNegocio, comparacionValoraciones, PERIODOS } from '../../clientes.js';
import { iso, fechaCorta, diasEntre } from '../../fechas.js';
import { pesos } from '../../finanzas.js';
import { planParaPublicar } from '../../coach.js';
import { COLORES_MARCA } from '../../marca.js';
import { pestanaPanel, marca as marcaActual } from '../../vistas/panel.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { accion } from '../acciones';
import { Campo } from '../ui/Campo';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Opciones, Cifras } from '../ui/Varios';
import { MarcaCabecera } from '../ui/Marca';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const PESTANAS: [string, string][] = [['inicio', '🏠 Inicio'], ['pagos', '💳 Pagos'], ['valoraciones', '📊 Valoraciones'], ['marca', '🎨 Mi marca']];
const COLOR: Record<string, object> = {
  'al-dia': { bgcolor: tokens.brandSoft, color: tokens.brand }, pronto: { bgcolor: tokens.amarilloFondo, color: tokens.amarillo },
  vencido: { bgcolor: tokens.rojoFondo, color: tokens.rojoSuave }, gris: { bgcolor: tokens.surface2, color: tokens.muted },
};
const BORDE: Record<string, string> = { 'al-dia': tokens.brand, pronto: tokens.amarillo, vencido: tokens.rojo, gris: tokens.line };
const TEXTO_COBRO: Record<string, [string, string]> = { 'sin-plan': ['gris', 'Sin cobro'], pausa: ['gris', 'En pausa'], 'al-dia': ['al-dia', 'Al día'], pronto: ['pronto', 'Paga pronto'], vencido: ['vencido', 'Vencido'] };
const ORDEN_COBRO = ['vencido', 'pronto', 'al-dia', 'pausa', 'sin-plan'];
const Etiqueta = ({ clase, children }: { clase: string; children: ReactNode }) => (
  <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap', ...COLOR[clase] }}>{children}</Box>
);
const Tarjeta = ({ children }: { children: ReactNode }) => <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '10px' }}>{children}</Card>;
const H2 = ({ children }: { children: ReactNode }) => <Box component="h2" sx={{ m: 0, fontSize: 17 }}>{children}</Box>;

// Una fila por cliente: nombre, detalle y etiqueta; al tocarla abre el cliente en la pestaña que toca
function Fila({ c, tab, clase, etiqueta, detalle }: { c: Fin; tab: string; clase: string; etiqueta: ReactNode; detalle: ReactNode }) {
  return (
    <ButtonBase component="a" href={'#clientes/' + c.id + ':' + tab} data-t="fila-panel"
      sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto 14px', alignItems: 'center', gap: '10px', width: '100%', minHeight: 56, p: '8px 12px', textAlign: 'left', font: 'inherit', color: 'text.primary', textDecoration: 'none',
        bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderLeft: '4px solid', borderLeftColor: BORDE[clase] || tokens.line, borderRadius: '12px',
        '&:hover': { bgcolor: tokens.surface2 }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
      <Box component="span" sx={{ display: 'grid', gap: '2px', minWidth: 0 }}>
        <b>{c.nombre}</b>
        <Box component="span" sx={{ color: 'text.secondary', fontSize: 14, overflowWrap: 'anywhere' }}>{detalle}</Box>
      </Box>
      <Etiqueta clase={clase}>{etiqueta}</Etiqueta>
      <Box component="span" aria-hidden="true" sx={{ color: 'text.secondary' }}>▸</Box>
    </ButtonBase>
  );
}
const Filas = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'grid', gap: '8px' }}>{children}</Box>;
const hace = (f: string, hoy: string) => { const n = diasEntre(f, hoy) as number; return n === 0 ? 'hoy' : n === 1 ? 'ayer' : 'hace ' + n + ' días'; };

// ---------- 🏠 Inicio: a quién atender hoy ----------
function pendientes(e: Fin, hoy: string) {
  const out: { c: Fin; tab: string; clase: string; etiqueta: string; detalle: string; peso: number }[] = [];
  for (const c of (e.clientes || []) as Fin[]) {
    const s = estadoCobro(c, hoy) as Fin, ult = (c.checkins || []).slice(-1)[0];
    if (s.estado === 'vencido') out.push({ c, tab: 'cobro', clase: 'vencido', etiqueta: 'Vencido', detalle: '💳 Debía pagar el ' + fechaCorta(s.proximo) + ' · ' + pesos(c.cobro.precio), peso: 0 });
    else if (s.estado === 'pronto') out.push({ c, tab: 'cobro', clase: 'pronto', etiqueta: 'Paga pronto', detalle: '💳 Le toca el ' + fechaCorta(s.proximo) + ' · ' + pesos(c.cobro.precio), peso: 2 });
    const tieneRutina = (c.rutina || []).some((d: Fin) => d.ejercicios && d.ejercicios.length);
    if (c.publicado && planParaPublicar(c, e.dieta).firma !== c.publicado.firma) out.push({ c, tab: 'app', clase: 'pronto', etiqueta: 'Sin mandar', detalle: '📲 Cambiaste su plan y aún no se lo mandas (lo publicaste el ' + fechaCorta(c.publicado.fecha) + ')', peso: 1 });
    else if (!c.publicado && tieneRutina) out.push({ c, tab: 'app', clase: 'gris', etiqueta: 'Sin publicar', detalle: '📲 Tiene rutina, pero no la tiene en su app', peso: 4 });
    if (ult && diasEntre(ult.fecha, hoy) >= 10) out.push({ c, tab: 'seguimiento', clase: 'pronto', etiqueta: 'Sin check-in', detalle: '✅ Último check-in ' + hace(ult.fecha, hoy) + ': escríbele', peso: 3 });
  }
  return out.sort((a, b) => a.peso - b.peso);
}
function Inicio({ e }: { e: Fin }) {
  const ls = (e.clientes || []) as Fin[], hoy = iso(), n = resumenNegocio(ls, hoy) as Fin, p = pendientes(e, hoy), m = marcaActual() as Fin;
  if (!ls.length) return (
    <Tarjeta>
      <H2>👋 Empieza tu negocio</H2>
      <Nota sx={{ m: 0 }}>Agrega tu primer cliente en 👥 Clientes: le armas la rutina y las comidas a partir de las tuyas, lo invitas a la app y aquí ves sus pagos, check-ins y valoraciones.</Nota>
      <Button href="#clientes" sx={{ justifySelf: 'start' }}>👥 Ir a Clientes →</Button>
    </Tarjeta>
  );
  return (
    <>
      <Tarjeta>
        <H2>📊 Tu negocio</H2>
        <Cifras datos={[
          { titulo: 'Activos', valor: n.activos, nota: 'de ' + n.clientes },
          { titulo: 'Cobrado este mes', valor: pesos(n.cobradoMes), color: tokens.verde },
          { titulo: 'Por cobrar', valor: pesos(n.porCobrar), color: n.vencidos ? tokens.rojo : undefined, nota: n.vencidos + ' vencidos · ' + n.pronto + ' esta semana' },
        ]} />
      </Tarjeta>
      <Box component="h2" sx={{ fontSize: 17, m: '0 0 8px' }}>📌 Para hoy {p.length ? '(' + p.length + ')' : ''}</Box>
      {p.length ? <Filas>{p.map((x) => <Fila key={x.c.id + x.tab + x.etiqueta} c={x.c} tab={x.tab} clase={x.clase} etiqueta={x.etiqueta} detalle={x.detalle} />)}</Filas>
        : <Nota>✓ Todo al día: nadie debe, todos tienen su plan y te mandaron su check-in.</Nota>}
      {!m.negocio && !m.logo ? (
        <Box sx={{ mt: '14px' }}><Button color="secondary" data-accion="panel-pestana" data-p="marca">🎨 Ponle tu marca a la app de tus clientes →</Button></Box>
      ) : null}
    </>
  );
}

// ---------- 💳 Pagos de todos ----------
function Pagos({ e }: { e: Fin }) {
  const hoy = iso(), ls = ((e.clientes || []) as Fin[]).map((c) => ({ c, s: estadoCobro(c, hoy) as Fin })).sort((a, b) => ORDEN_COBRO.indexOf(a.s.estado) - ORDEN_COBRO.indexOf(b.s.estado) || String(a.s.proximo || '').localeCompare(String(b.s.proximo || '')));
  const n = resumenNegocio(ls.map((x) => x.c), hoy) as Fin;
  if (!ls.length) return <Nota>Aún no tienes clientes.</Nota>;
  return (
    <>
      <Nota>Cobrado este mes <b>{pesos(n.cobradoMes)}</b> · por cobrar <b>{pesos(n.porCobrar)}</b>. Toca un cliente para anotar su pago.</Nota>
      <Filas>
        {ls.map(({ c, s }) => {
          const [clase, texto] = TEXTO_COBRO[s.estado], k = c.cobro;
          const detalle = !k || !(k.precio > 0) ? 'Ponle precio en 💳 Pago' : pesos(k.precio) + ' · ' + ((PERIODOS as Fin)[k.cada] || ['Mensual'])[0].toLowerCase() + (s.proximo ? ' · próximo ' + fechaCorta(s.proximo) : '') + (s.ultimo ? ' · último ' + fechaCorta(s.ultimo.fecha) : '');
          return <Fila key={c.id} c={c} tab="cobro" clase={clase} etiqueta={texto} detalle={detalle} />;
        })}
      </Filas>
    </>
  );
}

// ---------- 📊 Valoraciones de todos (cada 4 semanas) ----------
function Valoraciones({ e }: { e: Fin }) {
  const hoy = iso(), ls = ((e.clientes || []) as Fin[]).map((c) => {
    const vals = ((c.valoraciones || []) as Fin[]).slice().sort((a, b) => a.fecha.localeCompare(b.fecha)), ult = vals[vals.length - 1];
    return { c, ult, dias: ult ? (diasEntre(ult.fecha, hoy) as number) : null, cambio: (comparacionValoraciones(vals) as Fin[])[0] };
  }).sort((a, b) => (b.dias ?? 9999) - (a.dias ?? 9999));
  if (!ls.length) return <Nota>Aún no tienes clientes.</Nota>;
  return (
    <>
      <Nota>Una valoración cada 4 semanas: medidas y pruebas de fuerza. Les llega a su app (📊 Mis valoraciones) si ya les publicaste el plan.</Nota>
      <Filas>
        {ls.map(({ c, ult, dias, cambio }) => {
          const toca = dias == null || dias >= 28, clase = dias == null ? 'gris' : toca ? 'pronto' : 'al-dia';
          const detalle = ult ? 'Última ' + hace(ult.fecha, hoy) + (cambio ? ' · ' + cambio.nombre + ' ' + (cambio.cambio > 0 ? '+' : '') + String(cambio.cambio).replace('.', ',') + ' ' + cambio.u : '') : 'Sin valoraciones todavía';
          return <Fila key={c.id} c={c} tab="seguimiento" clase={clase} etiqueta={dias == null ? 'Nunca' : toca ? 'Toca' : 'Al día'} detalle={detalle} />;
        })}
      </Filas>
    </>
  );
}

// ---------- 🎨 Mi marca ----------
function Marca() {
  const m = marcaActual() as Fin;
  return (
    <>
      <Tarjeta>
        <H2>🎨 Tu marca</H2>
        <Nota sx={{ m: 0 }}>Tus clientes la ven arriba de su menú y en «Mi entrenador», en vez de la de Rutina. Solo ven tu nombre de negocio, tu color y tu logo.</Nota>
        <Campo etiqueta="Nombre de tu negocio" data-cambio="marca-negocio" defaultValue={m.negocio || ''} placeholder="Ej.: Fit Lab Coaching" maxLength={40} />
        <Box>
          <Box component="span" sx={{ display: 'block', fontSize: 14, color: 'text.secondary', mb: '6px' }}>Color</Box>
          <Box role="group" aria-label="Color de tu marca" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {(COLORES_MARCA as string[]).map((c) => (
              <ButtonBase key={c} aria-label={'Color ' + c} aria-pressed={m.color === c} onClick={() => accion('marca-color', { v: c })}
                sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: c, border: '3px solid', borderColor: m.color === c ? 'text.primary' : 'transparent', outline: '1px solid', outlineColor: 'divider', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }} />
            ))}
            <Box component="label" sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 14, color: 'text.secondary', minHeight: 44 }}>
              Otro <Box component="input" type="color" aria-label="Otro color" data-cambio="marca-color" defaultValue={m.color || '#3ddc84'} key={m.color || ''} sx={{ width: 44, height: 36, p: 0, border: 0, bgcolor: 'transparent' }} />
            </Box>
          </Box>
        </Box>
        <Box>
          <Box component="span" sx={{ display: 'block', fontSize: 14, color: 'text.secondary', mb: '6px' }}>Logo</Box>
          <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button component="label" color="secondary" sx={{ minHeight: 44 }}>
              {m.logo ? '🖼️ Cambiar logo' : '🖼️ Subir logo'}
              <input hidden type="file" accept="image/png,image/jpeg,image/webp" aria-label="Logo de tu negocio" data-cambio="marca-logo" />
            </Button>
            {m.logo ? <Button color="secondary" onClick={() => accion('marca-logo-quitar')} sx={{ minHeight: 44 }}>Quitar logo</Button> : null}
          </Box>
          <Nota sx={{ mb: 0 }}>PNG, JPG o WebP. Se achica solo a 160 px; cuadrado se ve mejor.</Nota>
        </Box>
      </Tarjeta>
      <Tarjeta>
        <H2>👀 Así lo ve tu cliente</H2>
        <Box data-t="vista-previa" sx={{ p: '12px', borderRadius: '12px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', display: 'grid', gap: '6px', maxWidth: 300 }}>
          <MarcaCabecera marca={m} sub="Tu entrenador" />
          <Box sx={{ height: 4, borderRadius: 999, bgcolor: m.color || tokens.brand, my: '4px' }} />
          {['🏠 Inicio', '🧑‍🏫 Mi entrenador', '🏋️ Mi entreno', '🥗 Nutrición'].map((t, i) => (
            <Box key={t} sx={{ p: '8px 10px', borderRadius: '10px', fontWeight: 600, fontSize: 15, ...(i === 0 ? { bgcolor: tokens.surface2, boxShadow: 'inset 3px 0 0 ' + (m.color || tokens.brand) } : null) }}>{t}</Box>
          ))}
        </Box>
        <Button data-accion="marca-mandar" sx={{ justifySelf: 'start' }}>📲 Mandarla a mis clientes</Button>
        <Nota sx={{ m: 0 }}>Les llega a los que ya tienen un plan tuyo publicado. A los demás, cuando les publiques el plan.</Nota>
      </Tarjeta>
    </>
  );
}

export default function Panel({ pestana }: { pestana?: string }) {
  const e = usarEstado() as Fin;
  useState(() => { if (pestana) accion('abrir-panel', { p: pestana }); return 0; });
  const p = pestanaPanel();
  return (
    <>
      <TituloPantalla>Panel</TituloPantalla>
      <Opciones nombre="Pestañas del panel" activa={p} opciones={PESTANAS} datos={(k) => ({ 'data-accion': 'panel-pestana', 'data-p': k })} sx={{ mb: '12px', '& .MuiChip-root': { fontSize: 15 } }} />
      {p === 'pagos' ? <Pagos e={e} /> : p === 'valoraciones' ? <Valoraciones e={e} /> : p === 'marca' ? <Marca /> : <Inicio e={e} />}
    </>
  );
}
