// 🥗 Dieta: 🍽 Hoy (el plan que toca según el gym y el fútbol, las comidas para marcar y la proteína de la semana),
// 📋 Planes (recalcular y editar las comidas de cada plan), ⚖️ Peso (peso, medidas, señales, sugerencia, fórmula y la
// comida del plan de 12 semanas) y 🥚 Alimentos. React pinta; las reglas son las de src/vistas/dieta.js (dieta-…) y
// las de editar (ed, ed-mover, ed-borrar, ed-agregar). "＋ Agregar" de una comida lee el alimento elegido de su lado:
// por eso lleva data-accion y main.js lo despacha con el botón de verdad.
import { useState, type ReactNode } from 'react';
import { Box, Button, Card, IconButton, Link, NativeSelect, OutlinedInput } from '@mui/material';
import { tipoDieta, tipoDietaAuto, comidasDelDia, semanaActual } from '../../estado.js';
import { progresoMes } from '../../gym.js';
import { iso, hora, fechaCorta, diaSemana } from '../../fechas.js';
import { proteinaSemana } from '../../entrenador.js';
import { totalPlan, totalComida, valoresItem, objetivo, pesos, tendencia, revisionDieta, medidasDe } from '../../dieta.js';
import { plan12, SEMANAS_PLAN, semanaPlan, faseDe, gastoEstimado, kcalPromedioPlan, pesoEsperado, comoVaPeso } from '../../plan12.js';
import { miles } from '../../ui.js';
import { piezasDieta, pesoActual, TIPOS_PLAN } from '../../vistas/dieta.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLista, CampoSolo, DOS } from '../ui/Campo';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Opciones, Avance, Cifras } from '../ui/Varios';
import { Ajustar } from '../ui/Rapido';
import { Barras } from '../ui/Graficos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'dieta';
const D = piezasDieta as Fin;
const TIPOS = TIPOS_PLAN as Record<string, string>;
const PESTANAS: [string, string][] = [['hoy', '🍽 Hoy'], ['planes', '📋 Planes'], ['peso', '⚖️ Peso'], ['alimentos', '🥚 Alimentos']];
const GRUPOS: [string, string][] = [['proteina', 'Proteína'], ['carbo', 'Carbohidrato'], ['grasa', 'Grasa'], ['verdura', 'Verdura'], ['otro', 'Otro']];
const POR: [string, string][] = [['g', 'por 100 g'], ['u', 'por unidad'], ['libre', 'porción fija']];
const MEDIDAS: [string, string][] = [['cintura', 'Cintura'], ['pecho', 'Pecho'], ['brazo', 'Brazo'], ['muslo', 'Muslo']];
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const CELULAR = '@media (max-width: 480px)';
const r0 = (n: number) => Math.round(n || 0);
const f1 = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const coma = (n: number | string) => String(n).replace('.', ',');
const unidad = (a: Fin) => (!a ? '' : a.por === 'g' ? 'g' : a.por === 'u' ? 'u' : '');
const Corta = ({ children, sx }: { children: ReactNode; sx?: object }) => <Nota sx={{ m: 0, ...sx }}>{children}</Nota>;
const Enlace = ({ href, accion, datos, children }: { href: string; accion?: string; datos?: Record<string, string>; children: ReactNode }) => (
  <Link href={href} data-accion={accion} {...datos} sx={{ color: 'primary.main' }}>{children}</Link>
);
// "2.636 kcal · P 172 · G 50 · C 302" (el total de un plan o una comida)
export const Macros = ({ t, sx }: { t: Fin; sx?: object }) => (
  <Box component="span" sx={{ fontSize: 13, color: 'text.secondary', textAlign: 'right', '& b': { color: 'text.primary' }, ...sx }}><b>{miles(t.kcal)}</b> kcal · P {r0(t.p)} · G {r0(t.g)} · C {r0(t.c)}</Box>
);
// Subir, bajar y borrar (ed-mover y ed-borrar de siempre, con data-accion)
const ICONO = { minWidth: 44, minHeight: 44, bgcolor: tokens.surface2, border: '1px solid', borderColor: 'divider', fontSize: 18, '&.Mui-disabled': { opacity: 0.3, color: 'text.primary' } };
function Controles({ lista, i, total, nombre, borrar = 'Borrar' }: { lista: string; i: number; total: number; nombre: string; borrar?: string }) {
  return (
    <Box component="span" sx={{ display: 'flex', gap: '4px', flex: 'none' }}>
      <IconButton data-accion="ed-mover" data-lista={lista} data-i={i} data-n="-1" aria-label="Subir" disabled={i === 0} sx={ICONO}>↑</IconButton>
      <IconButton data-accion="ed-mover" data-lista={lista} data-i={i} data-n="1" aria-label="Bajar" disabled={i >= total - 1} sx={ICONO}>↓</IconButton>
      <IconButton data-accion="ed-borrar" data-lista={lista} data-i={i} data-nombre={nombre} aria-label={borrar} sx={{ ...ICONO, color: 'error.main' }}>🗑</IconButton>
    </Box>
  );
}
// Número que guarda al salir en su ruta (los campos de la fórmula y de los alimentos)
const Numero = ({ titulo, ruta, valor, paso = '1', solo }: { titulo: string; ruta: string; valor: Fin; paso?: string; solo?: string }) => (solo
  ? <CampoSolo noVaciar aria-label={solo} inputMode="decimal" min={0} step={paso} data-cambio="ed" data-tipo="num" data-ruta={ruta} defaultValue={valor ?? ''} sx={{ minHeight: 40, '& input': { height: 40, p: '6px 8px' } }} />
  : <Campo etiqueta={titulo} inputMode="decimal" min={0} step={paso} data-cambio="ed" data-tipo="num" data-ruta={ruta} defaultValue={valor ?? ''} />);
const Barra = ({ parte }: { parte: number }) => <Avance parte={parte} />;

// ---------- 🍽 Hoy ----------
// compacta (Hoy): sin la lista de alimentos de cada comida
export function comidasHoy(e: Fin, compacta = false) {
  const d = e.dieta, tipo = tipoDieta() as string, plan = d.planes[tipo], hechas = (e.dias[iso()] || {}).comidas || {};
  const total = totalPlan(plan, d.alimentos) as Fin, comido = comidasDelDia() as Fin, alimento = (id: string) => d.alimentos.find((a: Fin) => a.id === id);
  const faltan = (plan.comidas as Fin[]).filter((_, i) => !hechas[tipo + ':' + i]).length;
  return (
    <>
      <Box sx={{ ...FILA, mb: '6px' }}><span>{TIPOS[tipo]}</span><span><b>{miles(comido.kcal)}</b> / {miles(total.kcal)} kcal</span></Box>
      <Barra parte={total.kcal ? comido.kcal / total.kcal : 0} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', m: '4px 0 6px', fontSize: 13, color: 'text.secondary', '& b': { color: 'text.primary', fontSize: 15 }, '& [role=progressbar]': { m: '4px 0 0', height: 6 } }}>
        {([['Proteína', 'p'], ['Carbos', 'c'], ['Grasa', 'g']] as [string, string][]).map(([t, k]) => (
          <div key={k}><Box component="small" sx={{ display: 'block' }}>{t}</Box><b>{r0(comido[k])}</b> / {r0(total[k])} g<Barra parte={total[k] ? comido[k] / total[k] : 0} /></div>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gap: '8px', mt: '8px' }}>
        {(plan.comidas as Fin[]).map((c, i) => {
          const t = totalComida(c, d.alimentos) as Fin, marca = hechas[tipo + ':' + i];
          const items = (c.items as Fin[]).map((it) => { const a = alimento(it.alimento); return (a ? a.nombre : it.alimento) + (a && a.por !== 'libre' ? ' ' + coma(it.cant) + ' ' + unidad(a) : ''); });
          const detalle = c.nombre + ' · ' + miles(t.kcal) + ' kcal\nProteína ' + r0(t.p) + ' g · Carbos ' + r0(t.c) + ' g · Grasa ' + r0(t.g) + ' g\n\n' + items.map((x) => '• ' + x).join('\n');
          return (
            <Box key={i} data-tip={detalle} sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start', p: compacta ? '6px 8px' : '10px', borderRadius: '12px', bgcolor: 'background.default', ...(compacta ? { '& .MuiIconButton-root': { width: 44, height: 44 } } : null) }}>
              <IconButton data-accion="dieta-comer" data-i={i} aria-pressed={!!marca} aria-label={c.nombre}
                sx={{ flex: 'none', width: 52, height: 52, borderRadius: '50%', border: '2px solid', fontSize: 20, fontWeight: 800, ...(marca ? { bgcolor: 'primary.main', borderColor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.main' } } : { bgcolor: tokens.surface2, borderColor: 'divider' }) }}>
                {marca ? '✓' : '🍽'}
              </IconButton>
              <Box sx={{ flex: 1, minWidth: 0, display: 'grid', gap: '4px', pt: '2px' }}>
                <Box sx={FILA}><Box component="b" sx={marca ? { color: 'text.secondary' } : null}>{c.nombre}</Box><Corta>{miles(t.kcal)} kcal · P {r0(t.p)}</Corta></Box>
                {marca ? <Corta>Comida a las {hora(marca.ts)}</Corta> : null}
                {compacta ? null : <Corta>{items.join(' · ')}</Corta>}
              </Box>
            </Box>
          );
        })}
      </Box>
      {faltan ? <Button fullWidth data-accion="dieta-comer-todo" sx={{ mt: '10px' }}>✓ Comí como el plan{faltan < plan.comidas.length ? ' (faltan ' + faltan + ')' : ''}</Button> : null}
    </>
  );
}
function proteina() {
  const s = proteinaSemana() as Fin;
  if (!s) return null;
  const letra = (f: string) => 'LMMJVSD'[(diaSemana(f) as number) - 1];
  const grafico = <Barras datos={s.dias.map((x: Fin) => ({ etiqueta: letra(x.fecha), v: x.parte * 100, tip: fechaCorta(x.fecha) + ': ' + r0(x.comido) + ' de ' + r0(x.meta) + ' g' }))}
    alto={90} max={Math.max(100, ...s.dias.map((x: Fin) => x.parte * 100))} formato={(n) => Math.round(n) + ' %'} meta={{ v: 90, texto: '90 %' }} />;
  return (
    <TarjetaPlegable vista={VISTA} clave="🍗 Proteína de la semana" titulo="🍗 Proteína de la semana" lado={<Box component="span" sx={{ fontSize: 22, fontWeight: 800 }}>{s.cumplidos}/7</Box>}>
      <Nota>Días que llegaste al 90 % de la proteína del plan. Promedio: <b>{r0(s.gramos)} g</b> al día ({Math.round(s.parte * 100)} % de la meta).</Nota>
      <Box>{grafico}</Box>
      <Nota>{s.cumplidos < 5 ? 'Para subir: proteína en cada comida (huevos, pollo, carne o el scoop) y no te saltes la última del día.' : '¡Bien! Así la fuerza tiene con qué subir.'}</Nota>
    </TarjetaPlegable>
  );
}
function hoyDieta(e: Fin) {
  const tipo = tipoDieta() as string, auto = tipoDietaAuto() as string, manual = (e.dias[iso()] || {}).dieta;
  return (
    <>
      <Opciones nombre="Plan de hoy" activa={tipo} opciones={Object.entries(TIPOS).map(([k, t]) => [k, t + (k === auto ? ' · hoy' : '')] as [string, string])} datos={(k) => ({ 'data-accion': 'dieta-tipo-hoy', 'data-tipo': k })} />
      {manual
        ? <Nota>Elegiste el plan a mano. <Enlace href="#dieta" accion="dieta-tipo-hoy" datos={{ 'data-tipo': auto }}>Volver al que toca hoy</Enlace></Nota>
        : <Nota>El plan sale del gym y del fútbol de hoy. Toca otro si hoy comes distinto.</Nota>}
      <Card component="section" sx={{ mb: '14px' }}>
        {comidasHoy(e)}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', mt: '10px' }}>
          <Button color="secondary" data-accion="dieta-copiar" aria-label="Copiar el plan para WhatsApp">📋 Copiar texto</Button>
          <Button color="secondary" data-accion="dieta-imagen" aria-label="Imagen del plan para WhatsApp">🖼️ Imagen</Button>
        </Box>
      </Card>
      {proteina()}
    </>
  );
}

// ---------- 📋 Planes ----------
// Las comidas de un plan, editables. ruta: "dieta.planes.superior" (o el plan de un cliente). Los alimentos son siempre los tuyos
export function EditorComidas({ e, ruta, plan }: { e: Fin; ruta: string; plan: Fin }) {
  const alimentos = e.dieta.alimentos as Fin[], alimento = (id: string) => alimentos.find((a) => a.id === id);
  return (
    <>
      {(plan.comidas as Fin[]).map((c, i) => {
        const rc = ruta + '.comidas.' + i;
        return (
          <Card component="section" key={i} sx={{ mb: '14px', display: 'grid', gap: '10px' }}>
            <Box sx={{ ...FILA, gap: '8px' }}>
              <CampoSolo noVaciar aria-label="Nombre de la comida" data-cambio="ed" data-ruta={rc + '.nombre'} defaultValue={c.nombre} sx={{ '& input': { fontWeight: 700, fontSize: 17 } }} />
              <Controles lista={ruta + '.comidas'} i={i} total={plan.comidas.length} nombre={c.nombre} borrar="Borrar comida" />
            </Box>
            <div>
              {(c.items as Fin[]).map((it, j) => {
                const a = alimento(it.alimento), v = valoresItem(it, alimentos) as Fin;
                return (
                  <Box key={j} sx={{ display: 'grid', gridTemplateColumns: '1fr 110px 90px 44px', gap: '8px', alignItems: 'center', p: '6px 0', borderBottom: '1px solid', borderColor: 'divider',
                    [CELULAR]: { gridTemplateColumns: '1fr 100px 40px', '& .kcal': { gridColumn: '1 / 3', textAlign: 'left', display: 'flex', gap: '8px' }, '& .quitar': { gridRow: 1, gridColumn: 3 } } }}>
                    <Box component="span" sx={{ fontWeight: 600, minWidth: 0 }}>{a ? a.nombre : it.alimento}</Box>
                    {a && a.por !== 'libre'
                      ? <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: '4px', '& > span': { color: 'text.secondary', fontSize: 13 } }}>
                          <CampoSolo noVaciar aria-label="Cantidad" inputMode="decimal" min={0} step={String(a.paso || (a.por === 'g' ? 5 : 1))} data-cambio="ed" data-tipo="num" data-ruta={rc + '.items.' + j + '.cant'} defaultValue={it.cant} sx={{ minHeight: 44, '& input': { height: 44, p: '8px' } }} />
                          <span>{unidad(a)}</span>
                        </Box>
                      : <Corta>libre</Corta>}
                    <Box component="span" className="kcal" sx={{ display: 'grid', fontSize: 14, textAlign: 'right', '& small': { color: 'text.secondary', fontSize: 12 } }}>{miles(v.kcal)} kcal<small>P {r0(v.p)} · C {r0(v.c)}</small></Box>
                    <IconButton className="quitar" data-accion="ed-borrar" data-lista={rc + '.items'} data-i={j} data-nombre={a ? a.nombre : ''} aria-label="Quitar" sx={{ minWidth: 40, minHeight: 40, color: 'error.main' }}>✕</IconButton>
                  </Box>
                );
              })}
            </div>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
              <NativeSelect defaultValue={alimentos[0] && alimentos[0].id} input={<OutlinedInput />} inputProps={{ 'aria-label': 'Alimento para agregar' }}>
                {alimentos.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
              </NativeSelect>
              <Button color="secondary" data-accion="dieta-item" data-ruta={rc}>＋ Agregar</Button>
            </Box>
            <Box sx={{ ...FILA, fontSize: 14, color: 'text.secondary' }}><span>Total</span><Macros t={totalComida(c, alimentos)} /></Box>
          </Card>
        );
      })}
      <Button fullWidth color="secondary" data-accion="ed-agregar" data-lista={ruta + '.comidas'} sx={{ minHeight: 56, fontSize: 17, mb: '14px' }}>＋ Comida</Button>
    </>
  );
}
function planes(e: Fin, vista: string | null) {
  const d = e.dieta;
  let tipo = vista;
  if (!tipo || !TIPOS[tipo]) { tipo = tipoDieta() as string; D.ponerPlan(tipo); }
  const plan = d.planes[tipo], total = totalPlan(plan, d.alimentos) as Fin, peso = pesoActual() as number, obj = objetivo(d.config, tipo, peso) as Fin;
  return (
    <>
      <Opciones nombre="Plan" activa={tipo} opciones={Object.entries(TIPOS)} datos={(k) => ({ 'data-accion': 'dieta-plan', 'data-tipo': k })} />
      <Card component="section" sx={{ mb: '14px' }}>
        <Box sx={{ ...FILA, mb: '6px' }}><b>{plan.nombre}</b><Macros t={total} /></Box>
        <Corta>Con <b>{coma(peso)} kg</b> el objetivo es <b>≈ {miles(obj.kcal)} kcal</b>: proteína <b>{obj.p} g</b>{obj.c != null ? <>, carbos <b>{obj.c} g</b>, grasa <b>{obj.g} g</b></> : null}. <Enlace href="#dieta/peso">Cambiar la fórmula</Enlace></Corta>
        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' }}>
          <Button data-accion="dieta-recalcular" data-tipo={tipo}>⚖️ Recalcular este plan</Button>
          <Button color="secondary" data-accion="dieta-recalcular" data-tipo="todos">Recalcular todos</Button>
          {d.anterior ? <Button color="secondary" data-accion="dieta-deshacer">↶ Deshacer recálculo</Button> : null}
        </Box>
      </Card>
      <EditorComidas e={e} ruta={'dieta.planes.' + tipo} plan={plan} />
    </>
  );
}

// ---------- ⚖️ Peso ----------
function grafico(meta: number | null, lista: Fin[]) {
  if (lista.length < 2) return null;
  const ult = lista.slice(-30), ps = ult.map((x) => x.peso), min = meta ? Math.min(...ps, meta) : Math.min(...ps), max = Math.max(...ps), W = 320, H = 90;
  const x = (i: number) => 6 + (i / (ult.length - 1)) * (W - 12), y = (p: number) => H - 8 - ((p - min) / (max - min || 1)) * (H - 16);
  return (
    <Box component="svg" viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" aria-hidden="true" sx={{ width: '100%', height: 90, color: tokens.azul, display: 'block' }}>
      {meta ? <line x1="0" x2={W} y1={y(meta)} y2={y(meta)} stroke={tokens.brand} strokeDasharray="4 4" strokeWidth="1.5" /> : null}
      <polyline fill="none" stroke="currentColor" strokeWidth="2.5" points={ult.map((p, i) => x(i) + ',' + y(p.peso)).join(' ')} />
    </Box>
  );
}
function escala(titulo: string, k: string, valor: number | undefined, ayuda: string) {
  return (
    <>
      <Corta><b>{titulo}</b> · {ayuda}</Corta>
      <Opciones nombre={titulo} activa={valor != null ? String(valor) : null} opciones={['1', '2', '3', '4', '5'].map((n) => [n, n] as [string, string])} datos={(n) => ({ 'data-accion': 'dieta-senal', 'data-k': k, 'data-n': n })} sx={{ pt: '6px' }} />
    </>
  );
}
function planDieta(e: Fin, hoy = iso()) {
  const p = plan12() as Fin, peso = (tendencia(pesos(e.dias)) as number | null) ?? e.dieta?.config?.pesoBase, estatura = e.dieta?.config?.estatura;
  const g = gastoEstimado({ peso, estatura, edad: Number(p.edad), sexo: p.sexo }) as Fin, kcal = kcalPromedioPlan(hoy) as number;
  const s = semanaPlan(p, hoy) as number | null, f = faseDe(s == null ? null : Math.min(s, SEMANAS_PLAN)) as Fin, meta = pesoEsperado(p.pesoInicio, SEMANAS_PLAN) as Fin, va = p.inicio ? comoVaPeso(p, hoy) as Fin : null;
  const deficit = g ? g.total - kcal : 0;
  return (
    <TarjetaPlegable vista={VISTA} clave="📆 Comida en el plan de 12 semanas" titulo="📆 Comida en el plan de 12 semanas">
      <Box sx={{ display: 'grid', gap: '10px', '& p': { m: 0 } }}>
        {g ? <>
          <Cifras datos={[{ titulo: 'Gastas, más o menos', valor: miles(g.total) + ' kcal' }, { titulo: 'Tus planes, promedio de 7 días', valor: miles(kcal) + ' kcal' }]} />
          <Corta>{(deficit >= 300 && deficit <= 800 ? 'Déficit de unas ' + miles(deficit) + ' kcal al día: bien para bajar grasa sin perder músculo.'
            : deficit > 800 ? 'Déficit de unas ' + miles(deficit) + ' kcal al día: es mucho para ganar músculo a la vez. Si la fuerza baja, come más (la revisión de arriba te lo dirá).'
            : 'Déficit de solo ' + miles(Math.max(0, deficit)) + ' kcal: así casi no se baja grasa. Mira la revisión de arriba antes de cambiar algo.') +
            ' El gasto es una estimación (' + (p.sexo === 'M' ? 'mujer' : 'hombre') + ', ' + p.edad + ' años, ' + estatura + ' cm, ' + f1(peso) + ' kg, 5 días de gym y fútbol): la báscula es la que manda.'}</Corta>
        </> : null}
        {f ? <p><b>Semana {s} · {f.nombre}:</b> {f.dieta}</p> : !p.inicio ? <Corta>Cuando empieces el plan en Gym → 📆 12 semanas, aquí verás qué hacer con la comida en cada fase.</Corta> : null}
        {meta ? <Corta>Meta realista a la semana 12: <b>{f1(meta.max)} a {f1(meta.min)} kg</b> (empezaste con {f1(p.pesoInicio)}). Más rápido que eso suele ser músculo y agua.</Corta> : null}
        {va && va.estado !== 'pronto' ? <Box component="p" sx={va.estado === 'bien' ? { fontSize: 17, fontWeight: 700 } : { color: 'warning.main' }}>
          {va.estado === 'bien' ? '✅ Vas en el rango esperado' : va.estado === 'lento' ? '🐢 Vas por encima del rango' : '⚡ Vas más rápido de lo sano'} ({f1(va.ahora)} kg; esperado {f1(va.esperado.max)} a {f1(va.esperado.min)}).
        </Box> : null}
      </Box>
    </TarjetaPlegable>
  );
}
function peso(e: Fin) {
  const d = e.dieta, c = d.config, lista = pesos(e.dias) as Fin[], hoyD = e.dias[iso()] || {}, hoy = hoyD.peso;
  const ultimo = lista.length ? lista[lista.length - 1].peso : null, prom = tendencia(lista) as number | null, ref = prom || ultimo || c.pesoBase;
  const inicio = c.pesoInicio || (lista.length ? lista[0].peso : null), avance = inicio && c.meta && inicio > c.meta ? (inicio - ref) / (inicio - c.meta) : 0;
  const medidas = medidasDe(e.dias) as Fin[], conCintura = medidas.filter((m) => m.cintura > 0), cintura = conCintura.length ? conCintura[conCintura.length - 1].cintura : null;
  const sug = (revisionDieta as Fin)({ lista, dias: e.dias, progreso: progresoMes(e.semanas, e.rutina, semanaActual()), ultimoAjuste: d.ultimoAjuste }, iso()) as Fin, sen = sug.senales;
  const conSigno = (n: number | null, u: string) => (n == null ? '—' : (n > 0 ? '+' : '') + f1(n) + u);
  return (
    <>
      <Card component="section" sx={{ mb: '14px' }}>
        {(() => {
          // − y + arrancan del último peso antes de hoy; "igual que la última" lo repite de un toque
          const antes = (lista.filter((x) => x.fecha < iso()).pop() || {}).peso as number | undefined;
          return <Ajustar etiqueta="Peso de hoy" valor={hoy > 0 ? hoy : null} base={antes || c.pesoBase} paso={0.1} decimales={1} min={20} max={300} unidad="kg" accion="dieta-peso"
            fichas={antes && hoy !== antes ? [[antes, 'Igual que la última · ' + f1(antes) + ' kg']] : []} />;
        })()}
        <Nota>Mejor en ayunas, después del baño. El promedio de 7 días es el que se usa para recalcular.</Nota>
      </Card>
      <Card component="section" sx={{ mb: '14px' }}>
        <Cifras datos={[
          { titulo: 'Promedio 7 días', valor: prom ? f1(prom) + ' kg' : '—' },
          { titulo: inicio ? 'Cambio desde ' + f1(inicio) : 'Cambio desde el inicio', valor: prom && inicio ? (prom - inicio > 0 ? '+' : '') + f1(prom - inicio) + ' kg' : '—' },
          { titulo: c.meta ? 'Falta para ' + f1(c.meta) : 'Falta para tu meta', valor: c.meta ? f1(Math.max(0, ref - c.meta)) + ' kg' : '—', nota: c.meta ? undefined : 'Ponla en Planes → ajustes' },
          { titulo: c.estatura ? 'Cintura (meta: menos de ' + f1(c.estatura / 2) + ')' : 'Cintura', valor: cintura ? f1(cintura) + ' cm' : '—' },
        ]} />
        <Barra parte={avance} />
        {grafico(c.meta || null, lista)}
        {prom && Math.abs(prom - c.pesoBase) >= 1 ? (
          <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, mb: 0 }}>
            Tu promedio cambió {f1(Math.abs(prom - c.pesoBase))} kg desde que se calcularon los planes ({f1(c.pesoBase)} kg). <Enlace href="#dieta" accion="dieta-ir-planes">Recalcular los planes con {f1(prom)} kg →</Enlace>
          </Box>) : null}
      </Card>
      <TarjetaPlegable vista={VISTA} clave="Cómo te sentiste hoy" titulo="Cómo te sentiste hoy">
        {escala('Energía', 'energia', hoyD.energia, '1 = sin energía · 5 = a tope')}
        {escala('Hambre', 'hambre', hoyD.hambre, '1 = nada · 5 = mucha')}
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="📏 Medidas" titulo="📏 Medidas" lado={<Button color="secondary" data-accion="sesion" data-sesion="medidas">¿Cómo me mido?</Button>}>
        <Nota>Una vez por semana, en cm. La cintura es la que más dice si estás perdiendo grasa.</Nota>
        <Box sx={DOS}>
          {MEDIDAS.map(([k, t]) => <Campo key={k} etiqueta={t} inputMode="decimal" min={0} step="0.1" data-cambio="dieta-medida" data-k={k} defaultValue={(hoyD.medidas || {})[k] ?? ''} />)}
        </Box>
        {medidas.length ? <Lista filas={medidas.slice(-6).reverse().map((m) => ({ k: m.fecha, izq: fechaCorta(m.fecha), der: <>{MEDIDAS.filter(([k]) => m[k] > 0).map(([k, t], n) => <span key={k}>{n ? ' · ' : ''}{t} <b>{f1(m[k])}</b></span>)}</> }))} /> : null}
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="💡 Sugerencia de la semana" titulo="💡 Sugerencia de la semana">
        <Cifras datos={[
          { titulo: 'Peso / semana', valor: conSigno(sen.peso, ' kg') }, { titulo: 'Cintura / 2 sem.', valor: conSigno(sen.cintura, ' cm') },
          { titulo: 'Fuerza / mes', valor: conSigno(sen.fuerza == null ? null : sen.fuerza * 100, ' %') },
          { titulo: 'Energía', valor: sen.energia == null ? '—' : f1(sen.energia) + ' / 5' }, { titulo: 'Hambre', valor: sen.hambre == null ? '—' : f1(sen.hambre) + ' / 5' },
        ]} />
        <Box component="p" sx={{ my: '8px' }}>{sug.texto}</Box>
        {sug.gramos ? <>
          <Button fullWidth data-accion="dieta-aplicar" data-g={sug.gramos}>{(sug.gramos > 0 ? 'Sumar ' : 'Quitar ') + Math.abs(sug.gramos) + ' g de carbos a los planes'}</Button>
          <Nota>Antes de cambiar te muestra cuánto queda, y lo puedes deshacer en Planes.</Nota>
        </> : null}
      </TarjetaPlegable>
      {lista.length ? (
        <TarjetaPlegable vista={VISTA} clave="Registros" titulo="Registros">
          <Lista filas={lista.slice(-14).reverse().map((x) => ({ k: x.fecha, izq: fechaCorta(x.fecha), der: <b>{f1(x.peso)} kg</b> }))} />
        </TarjetaPlegable>) : null}
      <TarjetaPlegable vista={VISTA} clave="Datos y fórmula" titulo="Datos y fórmula">
        <Box sx={{ display: 'grid', gap: '10px' }}>
          <Box sx={DOS}>
            <Numero titulo="Peso inicial (kg)" ruta="dieta.config.pesoInicio" valor={inicio} paso="0.1" />
            <Numero titulo="Meta (kg)" ruta="dieta.config.meta" valor={c.meta} paso="0.1" />
            <Numero titulo="Planes calculados con (kg)" ruta="dieta.config.pesoBase" valor={c.pesoBase} paso="0.1" />
            <Numero titulo="Estatura (cm)" ruta="dieta.config.estatura" valor={c.estatura} />
          </Box>
          <Numero titulo="Proteína fija (g al día; 0 = según el peso)" ruta="dieta.config.protFija" valor={c.protFija || 0} />
          <Corta>Por cada kg de peso, cada plan apunta a (gramos por kg):</Corta>
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, '& th, & td': { p: '6px 4px', textAlign: 'center' }, '& td': { minWidth: 76 }, '& tbody th': { textAlign: 'left', whiteSpace: 'nowrap', fontWeight: 600 } }}>
              <thead><tr><th></th><th>Proteína</th><th>Carbos</th><th>Grasa</th><th>≈ kcal / kg</th></tr></thead>
              <tbody>
                {Object.entries(TIPOS).map(([k, t]) => {
                  const kcal = (objetivo(c, k, ref) as Fin).kcal, kcalKg = kcal / ref;
                  return (
                    <tr key={k}>
                      <th>{t}</th>
                      <td>{c.protFija ? <b>{c.protFija} g</b> : <Numero titulo="" solo={'Proteína · ' + t} ruta={'dieta.config.protKg.' + k} valor={c.protKg[k]} paso="0.01" />}</td>
                      <td><Numero titulo="" solo={'Carbos · ' + t} ruta={'dieta.config.carbKg.' + k} valor={(c.carbKg || {})[k]} paso="0.01" /></td>
                      <td><Numero titulo="" solo={'Grasa · ' + t} ruta={'dieta.config.grasaKg.' + k} valor={(c.grasaKg || {})[k]} paso="0.01" /></td>
                      <Box component="td" sx={{ textAlign: 'left !important', '& small': { display: 'block', color: 'text.secondary', fontSize: 11 } }}><b>{(Math.round(kcalKg * 10) / 10).toLocaleString('es-CO')}</b><small>{miles(kcal)} kcal con {f1(ref)} kg</small></Box>
                    </tr>
                  );
                })}
              </tbody>
            </Box>
          </Box>
          <Corta>Las kcal salen de los macros: 4 por gramo de proteína y de carbos, 9 por gramo de grasa. Al recalcular se ajusta primero la proteína, después la grasa (contando la de huevos y carne) y al final los carbos.</Corta>
          <Corta>Es una regla simple para ajustar cantidades, no una indicación médica: si el peso se estanca o bajas muy rápido, ajústala con tu nutricionista.</Corta>
        </Box>
      </TarjetaPlegable>
      {planDieta(e)}
    </>
  );
}
const Lista = ({ filas }: { filas: { k: string; izq: ReactNode; der: ReactNode }[] }) => (
  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: '8px 0 0', display: 'grid', gap: '4px' }}>
    {filas.map((x) => <Box component="li" key={x.k} sx={{ ...FILA, p: '6px 0', borderBottom: '1px solid', borderColor: 'divider' }}><span>{x.izq}</span><span>{x.der}</span></Box>)}
  </Box>
);

// ---------- 🥚 Alimentos ----------
function alimentos(e: Fin) {
  const lista = e.dieta.alimentos as Fin[];
  return (
    <>
      <Nota>Valores por 100 g, por unidad o por porción fija. Al recalcular, la proteína queda en su cantidad fija (o sigue al peso, si la pones en 0) y los carbohidratos ajustan las calorías.</Nota>
      {lista.map((a, i) => {
        const r = 'dieta.alimentos.' + i;
        return (
          <Card component="section" key={i} sx={{ mb: '14px', display: 'grid', gap: '10px' }}>
            <Box sx={{ ...FILA, gap: '8px' }}>
              <CampoSolo noVaciar aria-label="Nombre" data-cambio="ed" data-ruta={r + '.nombre'} defaultValue={a.nombre} sx={{ '& input': { fontWeight: 700, fontSize: 17 } }} />
              <Controles lista="dieta.alimentos" i={i} total={lista.length} nombre={a.nombre} />
            </Box>
            <Box sx={DOS}>
              <CampoLista etiqueta="Medida" data-cambio="ed" data-ruta={r + '.por'} defaultValue={a.por} opciones={POR} />
              <CampoLista etiqueta="Grupo" data-cambio="ed" data-ruta={r + '.grupo'} defaultValue={a.grupo} opciones={GRUPOS} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', [CELULAR]: { gridTemplateColumns: '1fr 1fr' } }}>
              <Numero titulo="kcal" ruta={r + '.kcal'} valor={a.kcal} />
              <Numero titulo="Proteína" ruta={r + '.p'} valor={a.p} paso="0.1" />
              <Numero titulo="Grasa" ruta={r + '.g'} valor={a.g} paso="0.1" />
              <Numero titulo="Carbos" ruta={r + '.c'} valor={a.c} paso="0.1" />
            </Box>
          </Card>
        );
      })}
      <Button fullWidth data-accion="ed-agregar" data-lista="dieta.alimentos" sx={{ minHeight: 56, fontSize: 17, mb: '14px' }}>＋ Alimento</Button>
    </>
  );
}

export default function Dieta({ pestana }: { pestana?: string }) {
  // El enlace (#dieta/peso) elige la pestaña una sola vez, al abrir
  useState(() => { if (pestana) D.ponerPestana(pestana); return 0; });
  const e = usarEstado() as Fin, ver = D.ver();
  return (
    <>
      <TituloPantalla>Dieta</TituloPantalla>
      {!e.dieta.config.pesoInicio && !(pesos(e.dias) as Fin[]).length ? (
        <Card component="section" sx={{ mb: '14px', borderColor: 'primary.main', display: 'grid', gap: '8px' }}>
          <Box component="h2" sx={{ m: 0, fontSize: 18 }}>🥗 Empieza por tu peso</Box>
          <Box component="ol" sx={{ m: 0, pl: '22px', display: 'grid', gap: '4px' }}>
            <li>En ⚖️ Peso anota tu peso de hoy: con él se calculan tus planes de comida (calorías y proteína a tu medida).</li>
            <li>En 📋 Planes → ajustes pon tu meta y tu estatura.</li>
            <li>Cada día marca en 🍽 Hoy lo que comiste; la app suma las calorías y la proteína.</li>
          </Box>
          <Nota sx={{ m: 0 }}>Mientras tanto, los planes que ves son un ejemplo.</Nota>
          {ver.pestana === 'peso' ? null : <Button data-accion="dieta-pestana" data-p="peso" sx={{ justifySelf: 'start' }}>Anotar mi peso →</Button>}
        </Card>
      ) : null}
      <Opciones nombre="Pestañas de Dieta" activa={ver.pestana} opciones={PESTANAS} datos={(k) => ({ 'data-accion': 'dieta-pestana', 'data-p': k })} sx={{ '& .MuiChip-root': { fontSize: 15 } }} />
      {ver.pestana === 'planes' ? planes(e, ver.planVista) : ver.pestana === 'peso' ? peso(e) : ver.pestana === 'alimentos' ? alimentos(e) : hoyDieta(e)}
    </>
  );
}
