// 🔄 Dieta → Equivalencias: cuánto de un alimento equivale a otro (en calorías, carbohidratos, proteína o grasa), la
// comparación de lo demás y los sustitutos que más se parecen. Los cálculos están en src/equivalencias.js; los datos, en
// src/datos_equivalencias.js (USDA FoodData Central) más tus alimentos de 🥚 Alimentos.
import { useMemo, useRef, useState } from 'react';
import { Box, Button, Card } from '@mui/material';
import { ALIMENTOS_USDA, CATEGORIAS_EQUIV, FUENTE_USDA } from '../../datos_equivalencias.js';
import { ALIMENTOS_ETIQUETA } from '../../datos_etiquetas.js';
import * as Q from '../../equivalencias.js';
import { tipoDieta, planDieta } from '../../estado.js';
import { TIPOS_PLAN } from '../../vistas/dieta.js';
import { accion } from '../acciones';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Nota } from '../ui/Textos';
import { Opciones } from '../ui/Varios';
import { FichaEtiqueta } from './FichaEtiqueta';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'dieta';
const CAMPO = { font: 'inherit', fontSize: 16, color: 'text.primary', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '10px', p: '10px 12px', minHeight: 44, minWidth: 0, width: '100%', boxSizing: 'border-box' };
const FILA = { display: 'flex', alignItems: 'center', gap: '8px' };
const NOMBRE: Record<string, string> = Q.CRITERIOS;
const CRITERIOS = Object.entries(NOMBRE) as [string, string][];
const NOMBRE_CAT: Record<string, string> = Object.fromEntries([...CATEGORIAS_EQUIV, ['otros', '🍽 Otros']] as [string, string][]);
const ICONO_CAT: Record<string, string> = Object.fromEntries(Object.entries(NOMBRE_CAT).map(([k, v]) => [k, v.split(' ')[0]]));
const CANTIDADES = { g: [50, 100, 150, 200, 250], u: [1, 2, 3, 4, 6] } as Record<string, number[]>;
const numero = (n: number, dec = 0) => (n == null ? '—' : (Math.round(n * 10 ** dec) / 10 ** dec).toLocaleString('es-CO'));
const cant = (n: number, a: Fin) => numero(n, n < 10 ? 1 : 0) + ' ' + Q.unidadDe(a);
const base = (a: Fin) => (a.por === 'u' ? 'por unidad' : 'por 100 g');
const CORTO: Record<string, string> = { c: 'Carbos' };
const signo = (n: number, dec = 0) => (n > 0 ? '+' : n < 0 ? '−' : '') + numero(Math.abs(n), dec);

// Buscador de alimentos con sus resultados debajo (el elegido queda como una fila con "Cambiar")
function ElegirAlimento({ lista, valor, alElegir, etiqueta }: { lista: Fin[]; valor: Fin; alElegir: (a: Fin) => void; etiqueta: string }) {
  const [texto, ponerTexto] = useState(''), [abierto, ponerAbierto] = useState(!valor), [cat, ponerCat] = useState('');
  const campo = useRef<HTMLInputElement>(null);
  const res: Fin[] = useMemo(() => (texto.trim() || cat ? Q.buscar(lista, texto, { categoria: (cat || null) as Fin, max: cat && !texto.trim() ? 40 : 10 }) : []), [lista, texto, cat]);
  if (valor && !abierto) {
    return (
      <Box data-t={'elegido-' + etiqueta} sx={{ ...FILA, justifyContent: 'space-between', p: '8px 10px', borderRadius: '12px', bgcolor: tokens.surface2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box component="small" sx={{ display: 'block', color: 'text.secondary', fontSize: 12 }}>{etiqueta}</Box>
          <b>{ICONO_CAT[valor.categoria] || '🍽'} {Q.nombreCompleto(valor)}</b>
          <Box component="small" sx={{ display: 'block', color: 'text.secondary', fontSize: 12 }}>{numero(valor.kcal)} kcal · P {numero(valor.p, 1)} · C {numero(valor.c, 1)} · G {numero(valor.g, 1)} {base(valor)}{valor.propio ? ' · tus valores' : ''}</Box>
        </Box>
        <Button color="secondary" data-teclado="" onClick={() => { ponerAbierto(true); setTimeout(() => campo.current?.focus(), 0); }} sx={{ flex: 'none' }}>Cambiar</Button>
      </Box>
    );
  }
  return (
    <Box sx={{ display: 'grid', gap: '6px' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '6px' }}>
        <Box component="input" ref={campo} type="search" placeholder={'🔎 ' + etiqueta + ': arroz, pollo, papa…'} aria-label={'Buscar ' + etiqueta.toLowerCase()} value={texto}
          onChange={(ev: Fin) => ponerTexto(ev.target.value)} sx={CAMPO} />
        <Box component="select" aria-label={'Categoría de ' + etiqueta.toLowerCase()} value={cat} onChange={(ev: Fin) => ponerCat(ev.target.value)} sx={{ ...CAMPO, width: 'auto', maxWidth: '9.5em' }}>
          <option value="">Todas</option>
          {[...CATEGORIAS_EQUIV, ['otros', '🍽 Tuyos sin grupo']].map(([k, n]) => <option key={k} value={k}>{n}</option>)}
        </Box>
      </Box>
      {res.length ? (
        <Box component="ul" aria-label={'Resultados para ' + etiqueta.toLowerCase()} sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '4px', maxHeight: 320, overflowY: 'auto' }}>
          {res.map((a) => (
            <li key={a.id}>
              <Box component="button" type="button" data-alimento={a.id} onClick={() => { alElegir(a); ponerTexto(''); ponerAbierto(false); }}
                sx={{ all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', ...FILA, justifyContent: 'space-between', p: '8px 10px', minHeight: 44, borderRadius: '10px', bgcolor: tokens.surface2, '&:hover': { bgcolor: tokens.line }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
                <Box component="span" sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ICONO_CAT[a.categoria] || '🍽'} {Q.nombreCompleto(a)}{a.propio ? <Box component="small" sx={{ color: 'primary.main', ml: '6px' }}>tuyo</Box> : null}</Box>
                <Box component="small" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>{numero(a.kcal)} kcal {a.por === 'u' ? '/u' : '/100 g'}</Box>
              </Box>
            </li>
          ))}
        </Box>
      ) : texto.trim() ? <Nota sx={{ m: 0 }}>Nada con «{texto}». Prueba otra palabra (sirve sin tildes) o agrégalo en 🥚 Alimentos.</Nota> : null}
      {valor ? <Button color="secondary" onClick={() => { ponerAbierto(false); ponerTexto(''); }} sx={{ justifySelf: 'start' }}>Dejar {Q.nombreCompleto(valor)}</Button> : null}
    </Box>
  );
}

// Tabla: original contra sustituto, con la diferencia y el % (en ámbar lo que cambia 20 % o más)
function Tabla({ tabla, orig, sust }: { tabla: Fin[]; orig: Fin; sust: Fin }) {
  const celda = { p: '6px 3px', verticalAlign: 'top' as const, borderBottom: '1px solid', borderColor: 'divider', textAlign: 'right' as const, fontVariantNumeric: 'tabular-nums' };
  return (
    <Box component="table" data-t="comparacion" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, '@media (max-width: 480px)': { fontSize: 13 }, '& th': { ...celda, color: 'text.secondary', fontWeight: 600, fontSize: 12 }, '& td': celda, '& th:first-of-type, & td:first-of-type': { textAlign: 'left' } }}>
      <thead><tr><th>Nutriente</th><th title={Q.nombreCompleto(orig)}>Original</th><th title={Q.nombreCompleto(sust)}>Sustituto</th><th>Cambio</th></tr></thead>
      <tbody>
        {tabla.map((x) => {
          const dec = x.k === 'kcal' ? 0 : 1;
          // Lo que redondeado da 0 es "igual" (72 g de avena dan 272,9 kcal contra 273: no es una diferencia)
          const igual = x.diferencia != null && Math.round(Math.abs(x.diferencia) * 10 ** dec) === 0;
          const fuerte = !igual && (x.variacion != null ? Math.abs(x.variacion) >= 20 : x.diferencia != null && Math.abs(x.diferencia) >= 1);
          return (
            <tr key={x.k} data-k={x.k}>
              <td>{CORTO[x.k] || x.nombre}</td>
              <td>{x.original == null ? '—' : numero(x.original, dec) + ' ' + x.unidad}</td>
              <td>{x.sustituto == null ? 's/d' : numero(x.sustituto, dec) + ' ' + x.unidad}</td>
              <Box component="td" sx={{ color: fuerte ? tokens.amarillo : 'text.secondary', fontWeight: fuerte ? 700 : 400 }}>
                {x.diferencia == null ? '—' : igual ? '= igual' : <>{signo(x.diferencia, dec)}{x.variacion != null ? <Box component="small" sx={{ display: 'block', fontSize: 11, fontWeight: 400 }}>{signo(x.variacion) + ' %'}</Box> : null}</>}
              </Box>
            </tr>
          );
        })}
      </tbody>
    </Box>
  );
}

// "P +3 g · G +5 g": cómo cambian los otros macros, en una línea
const cambiosCortos = (tabla: Fin[], criterio: string) => tabla.filter((x) => ['p', 'c', 'g'].includes(x.k) && x.k !== criterio && x.diferencia != null && Math.abs(x.diferencia) >= 1)
  .map((x) => ({ p: 'P', c: 'C', g: 'G' } as Record<string, string>)[x.k] + ' ' + signo(x.diferencia) + ' g').join(' · ') || 'casi igual en lo demás';

// cambio: abierta desde una comida ({ tipo, i, j, origen }); entonces trae ese alimento y se puede guardar el cambio
export function Equivalencias({ e, cambio = null }: { e: Fin; cambio?: Fin }) {
  const lista: Fin[] = useMemo(() => Q.todos([...ALIMENTOS_USDA, ...ALIMENTOS_ETIQUETA], e.dieta.alimentos || []), [e.dieta.alimentos, (e.dieta.alimentos || []).length]);
  // Uno de USDA o de etiqueta que ya pasaste a 🥚 Alimentos se sigue encontrando (ahora como tuyo)
  const porId = (id: string) => lista.find((a) => a.id === id) || (id && id.startsWith('usda:') ? lista.find((a) => a.id === 'tu:usda-' + id.slice(5)) : null) || null;
  const comida: Fin = cambio ? (cambio.origen === 'hoy' && cambio.tipo === tipoDieta() ? planDieta() : e.dieta.planes[cambio.tipo])?.comidas?.[cambio.i] : null;
  const item: Fin = comida && cambio.j != null ? comida.items[cambio.j] : null;
  const [origId, ponerOrig] = useState<string>(() => (item ? 'tu:' + item.alimento : porId('tu:arroz') ? 'tu:arroz' : 'usda:arroz-cocido'));
  const [texto, ponerTexto] = useState(() => (item ? String(item.cant) : '200')), [sustId, ponerSust] = useState<string | null>(null);
  const [criterio, ponerCriterio] = useState('kcal'), [catSug, ponerCatSug] = useState('');
  const resultado = useRef<HTMLDivElement>(null);
  const orig = porId(origId), sust = sustId ? porId(sustId) : null, cantidad = Q.cantidadValida(texto);
  const r: Fin = orig && sust ? Q.equivalente(orig, texto, sust, criterio) : null;
  const sugeridas: Fin[] = useMemo(() => (orig && cantidad ? Q.sugerir(orig, cantidad, lista, { criterio, categoria: (catSug || null) as Fin, max: 15 }) : []), [orig, cantidad, lista, criterio, catSug]);
  const categoriasSug = useMemo(() => [...new Set(lista.map((a) => a.categoria))], [lista]);
  const elegirSust = (a: Fin) => { ponerSust(a.id); setTimeout(() => resultado.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 30); };
  const cambiarOrig = (a: Fin) => { ponerOrig(a.id); if (a.por !== orig?.por) ponerTexto(a.por === 'u' ? '1' : '100'); if (sustId === a.id) ponerSust(null); };
  const intercambiar = () => { if (!r || r.error || !sust) return; ponerOrig(sust.id); ponerSust(origId); ponerTexto(String(r.cantidad)); };
  const unidad = orig ? Q.unidadDe(orig) : 'g';
  // 📋 Producto de etiqueta: su ficha, y si todavía no está en 🥚 Alimentos, el botón para agregarlo
  const datosEtiqueta = (a: Fin) => (!a ? null : a.datosEtiqueta || (a.propio ? ALIMENTOS_ETIQUETA.find((x) => x.id === ((e.dieta.alimentos as Fin[]).find((y) => y.id === a.idPropio) || {}).etiquetaId) : null) || null);
  const ficha = (a: Fin) => {
    const d = datosEtiqueta(a);
    if (!d) return null;
    return <FichaEtiqueta key={'ficha-' + a.id} datos={d} abierta={!a.propio} agregar={a.propio ? null : () => accion('dieta-equiv-agregar', { nuevo: JSON.stringify(Q.paraDieta(a)) })} />;
  };
  // Lo que viaja a la acción: un alimento tuyo por su id; uno de USDA completo, para agregarlo a 🥚 Alimentos con su fuente
  const datosCambio = () => ({ alimento: sust.propio ? sust.idPropio : '', nuevo: sust.propio ? '' : JSON.stringify(Q.paraDieta(sust)), cant: r.cantidad });
  // ⭐ Favoritos: { de, a, criterio }. Un id de USDA que ya pasó a tus alimentos se busca también como tuyo
  const buscarId = (id: string) => porId(id) || (id.startsWith('usda:') ? porId('tu:usda-' + id.slice(5)) : null);
  const favoritos: Fin[] = ((e.dieta.favoritosEquiv || []) as Fin[]).map((f) => ({ ...f, de: buscarId(f.de), a: buscarId(f.a), clave: f })).filter((f) => f.de && f.a);
  const esFavorito = !!(orig && sust && favoritos.some((f) => f.de.id === orig.id && f.a.id === sust.id && f.criterio === criterio));
  const alternarFavorito = () => {
    const f = favoritos.find((x) => x.de.id === orig.id && x.a.id === sust.id && x.criterio === criterio);
    accion('dieta-equiv-fav', f ? f.clave : { de: orig.id, a: sust.id, criterio });
  };
  const usarFavorito = (f: Fin) => {
    if (f.de.id !== origId) { ponerOrig(f.de.id); if (f.de.por !== orig?.por) ponerTexto(f.de.por === 'u' ? '1' : '100'); }
    ponerCriterio(f.criterio); elegirSust(f.a);
  };
  // Abierta desde una comida, solo sirven los favoritos de ese alimento
  const favoritosVisibles = item ? favoritos.filter((f) => f.de.id === origId) : favoritos;

  return (
    <>
      <Card component="section" data-t="equivalencias" sx={{ mb: '14px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '10px' }}>
        <Box component="h2" sx={{ m: 0, fontSize: 18 }}>🔄 Cambiar un alimento por otro</Box>
        {cambio && comida ? (
          // Abierta desde una comida: cuál comida, qué alimento de ella y salir
          <Box data-t="cambiando" sx={{ display: 'grid', gap: '6px', p: '10px', borderRadius: '12px', border: '1px solid', borderColor: 'primary.main', bgcolor: tokens.brandSoft }}>
            <Box sx={{ ...FILA, justifyContent: 'space-between' }}>
              <span>Cambiando en <b>{comida.nombre}</b> · {(TIPOS_PLAN as Record<string, string>)[cambio.tipo] || cambio.tipo}</span>
              <Button size="small" color="secondary" onClick={() => accion('dieta-equiv-salir')} aria-label="Salir sin cambiar">✕</Button>
            </Box>
            <Box component="small" sx={{ color: 'text.secondary' }}>{item ? '¿Otro alimento de esta comida?' : '¿Qué alimento quieres cambiar?'}</Box>
            <Box role="group" aria-label="Alimento de la comida" sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(comida.items as Fin[]).map((x, j) => {
                const a = (e.dieta.alimentos as Fin[]).find((y) => y.id === x.alimento), sirve = a && a.por !== 'libre';
                return (
                  <Button key={j} size="small" color="secondary" disabled={!sirve} aria-pressed={cambio.j === j} onClick={() => accion('dieta-equiv-alimento', { j })}
                    sx={cambio.j === j ? { bgcolor: 'primary.main', color: tokens.brandInk, '&:hover': { bgcolor: 'primary.main' } } : undefined}>
                    {(a ? a.nombre : x.alimento) + (sirve ? ' ' + String(x.cant).replace('.', ',') + ' ' + Q.unidadDe(a) : '')}
                  </Button>
                );
              })}
            </Box>
          </Box>
        ) : null}
        {cambio && comida && !item ? null : <ElegirAlimento lista={lista} valor={orig} alElegir={cambiarOrig} etiqueta="Lo que tienes en el plan" />}
        {cambio && comida && !item ? null : ficha(orig)}
        <Box sx={{ display: 'grid', gap: '6px' }}>
          <Box sx={{ ...FILA, flexWrap: 'wrap' }}>
            <Box component="label" htmlFor="equiv-cant" sx={{ fontSize: 14, color: 'text.secondary' }}>Cantidad</Box>
            <Box sx={{ ...FILA, flex: '1 1 8em', maxWidth: '12em' }}>
              <Box component="input" id="equiv-cant" inputMode="decimal" value={texto} onChange={(ev: Fin) => ponerTexto(ev.target.value)} aria-invalid={!cantidad} sx={{ ...CAMPO, textAlign: 'right', fontWeight: 700, borderColor: cantidad ? 'divider' : tokens.rojo }} />
              <b>{unidad}</b>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {CANTIDADES[unidad].map((n) => <Button key={n} size="small" color="secondary" aria-pressed={cantidad === n} onClick={() => ponerTexto(String(n))} sx={{ minWidth: 52, ...(cantidad === n ? { bgcolor: tokens.brandSoft, color: 'primary.main' } : null) }}>{n} {unidad}</Button>)}
          </Box>
          {!cantidad ? <Box component="small" sx={{ color: tokens.rojo }}>Escribe una cantidad mayor que cero</Box> : null}
        </Box>
        <Box>
          <Box component="small" sx={{ display: 'block', color: 'text.secondary', mb: '4px' }}>Igualar en</Box>
          <Opciones nombre="Criterio de equivalencia" activa={criterio} opciones={CRITERIOS} alElegir={(k: string) => ponerCriterio(k)} />
        </Box>
        <ElegirAlimento key={sustId || 'nada'} lista={lista.filter((a) => a.id !== origId)} valor={sust} alElegir={elegirSust} etiqueta="Por qué lo cambias" />
        {ficha(sust)}

        {r ? (
          <Box ref={resultado} data-t="resultado" sx={{ minWidth: 0, overflowX: 'auto', display: 'grid', gap: '6px', p: '12px', borderRadius: '12px', border: '1px solid', borderColor: r.error ? tokens.rojo : 'primary.main', bgcolor: 'background.default' }}>
            {r.error ? <Box component="p" role="alert" sx={{ m: 0, color: tokens.rojoSuave }}>{r.error}</Box> : (
              <>
                <Box component="small" sx={{ color: 'text.secondary' }}>{cant(cantidad as number, orig)} de {Q.nombreCompleto(orig)} equivalen a</Box>
                <Box component="b" data-t="cantidad" sx={{ fontSize: 30, lineHeight: 1.1, color: 'primary.main' }}>≈ {cant(r.cantidad, sust)}</Box>
                <b>de {Q.nombreCompleto(sust)}</b>
                {sust.unidadG && r.unidad === 'g' ? <Box component="small" data-t="en-unidades" sx={{ color: 'text.secondary' }}>≈ {numero(r.cantidad / sust.unidadG, 1)} {r.cantidad / sust.unidadG >= 1.05 ? 'unidades' : 'unidad'} de {sust.unidadG} g (según la etiqueta)</Box> : null}
                <Box component="small" sx={{ color: 'text.secondary' }}>en {NOMBRE[criterio].toLowerCase()}: {numero(r.objetivo, criterio === 'kcal' ? 0 : 1)} {criterio === 'kcal' ? 'kcal' : 'g'}{r.cantidad !== Math.round(r.exacta * 10) / 10 ? ' (exacto: ' + cant(r.exacta, sust) + ')' : ''}</Box>
                {!r.practica.ok ? <Box component="p" data-t="poco-practica" sx={{ m: 0, color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14 }}>⚠ Porción poco práctica: {r.practica.motivo}. Mira los sugeridos de abajo.</Box> : null}
                <Nota sx={{ my: 0 }}>{Q.AVISO_MACROS}</Nota>
                <Tabla tabla={r.tabla} orig={orig} sust={sust} />
                <Box sx={{ ...FILA, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <Box component="small" sx={{ color: 'text.secondary', fontSize: 12 }}>Datos: {[orig, sust].map((a: Fin) => (a.propio ? 'tus valores' : a.deEtiqueta ? 'etiqueta del empaque' : 'USDA ' + a.fdc)).filter((x, i, l) => l.indexOf(x) === i).join(' · ')}</Box>
                  <Box sx={{ display: 'flex', gap: '6px' }}>
                    <Button size="small" color="secondary" onClick={alternarFavorito} aria-pressed={esFavorito} aria-label={esFavorito ? 'Quitar de favoritos' : 'Guardar como favorito'}>{esFavorito ? '★ Favorito' : '☆ Favorito'}</Button>
                    {item ? null : <Button size="small" color="secondary" onClick={intercambiar} aria-label="Intercambiar original y sustituto">⇄ Al revés</Button>}
                  </Box>
                </Box>
                {/* Guardar el cambio en la comida: cada botón pide confirmación antes de guardar */}
                {item && orig && orig.id === 'tu:' + item.alimento ? (
                  <Box data-t="guardar-cambio" sx={{ display: 'grid', gridTemplateColumns: cambio.tipo === tipoDieta() ? '1fr 1fr' : '1fr', gap: '8px', mt: '4px' }}>
                    {cambio.tipo === tipoDieta() ? <Button color="secondary" onClick={() => accion('dieta-equiv-hoy', datosCambio())}>Solo hoy</Button> : null}
                    <Button onClick={() => accion('dieta-equiv-plan', datosCambio())}>✓ Cambiar en el plan</Button>
                  </Box>
                ) : null}
              </>
            )}
          </Box>
        ) : null}
      </Card>

      {favoritosVisibles.length ? (
        <TarjetaPlegable vista={VISTA} clave="⭐ Favoritos de equivalencias" titulo={'⭐ Tus cambios favoritos (' + favoritosVisibles.length + ')'}>
          <Box component="ul" data-t="favoritos" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '4px' }}>
            {favoritosVisibles.map((f) => {
              const v: Fin = f.de.id === origId && cantidad ? Q.equivalente(f.de, cantidad, f.a, f.criterio) : null;
              return (
                <Box component="li" key={f.de.id + f.a.id + f.criterio} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '6px', alignItems: 'center' }}>
                  <Box component="button" type="button" data-favorito={f.de.id + '>' + f.a.id} onClick={() => usarFavorito(f)}
                    sx={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', minWidth: 0, p: '8px 10px', borderRadius: '10px', bgcolor: tokens.surface2, '&:hover': { bgcolor: tokens.line }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{Q.nombreCompleto(f.de)} → <b>{Q.nombreCompleto(f.a)}</b></Box>
                    <Box component="small" sx={{ color: 'text.secondary', fontSize: 12 }}>en {(NOMBRE[f.criterio] || '').toLowerCase()}{v && !v.error ? ' · ' + cant(cantidad as number, f.de) + ' → ' + cant(v.cantidad, f.a) : ''}</Box>
                  </Box>
                  <Button size="small" color="secondary" aria-label={'Quitar el favorito ' + f.de.nombre + ' por ' + f.a.nombre} onClick={() => accion('dieta-equiv-fav', f.clave)} sx={{ minWidth: 40 }}>✕</Button>
                </Box>
              );
            })}
          </Box>
        </TarjetaPlegable>
      ) : null}

      {orig && cantidad ? (
        <TarjetaPlegable vista={VISTA} clave="🔄 Sustitutos" titulo={'💡 Sustitutos para ' + cant(cantidad, orig) + ' de ' + orig.nombre}>
          <Nota sx={{ mt: 0 }}>Todos igualan {NOMBRE[criterio].toLowerCase()}. Arriba, los que más se parecen en lo demás. Toca uno para ver la comparación.</Nota>
          <Box sx={{ mb: '8px' }}>
            <Opciones nombre="Categoría de los sustitutos" activa={catSug} chica opciones={[['', 'Todas'], ...categoriasSug.map((k) => [k, NOMBRE_CAT[k] || k] as [string, string])]} alElegir={(k: string) => ponerCatSug(k)} />
          </Box>
          <Box component="ul" data-t="sugeridos" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '4px' }}>
            {sugeridas.map((s) => (
              <li key={s.alimento.id}>
                <Box component="button" type="button" data-sugerido={s.alimento.id} onClick={() => elegirSust(s.alimento)} aria-pressed={sustId === s.alimento.id}
                  sx={{ all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '2px 8px', p: '8px 10px', borderRadius: '10px',
                    bgcolor: sustId === s.alimento.id ? tokens.brandSoft : tokens.surface2, opacity: s.practica.ok ? 1 : 0.7, '&:hover': { bgcolor: tokens.line }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
                  <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ICONO_CAT[s.alimento.categoria] || '🍽'} {Q.nombreCompleto(s.alimento)}{s.alimento.propio ? <Box component="small" sx={{ color: 'primary.main', ml: '6px' }}>tuyo</Box> : null}</Box>
                  <Box component="b" sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{cant(s.cantidad, s.alimento)}</Box>
                  <Box component="small" sx={{ color: 'text.secondary', fontSize: 12, gridColumn: '1 / -1' }}>{s.practica.ok ? cambiosCortos(s.tabla, criterio) : '⚠ ' + s.practica.motivo}</Box>
                </Box>
              </li>
            ))}
          </Box>
          {!sugeridas.length ? <Nota>No hay sustitutos con {NOMBRE[criterio].toLowerCase()} en esa categoría.</Nota> : null}
        </TarjetaPlegable>
      ) : null}
      <Nota>Valores por 100 g de {FUENTE_USDA}, dominio público, de la etiqueta de algunos productos colombianos, más los tuyos de 🥚 Alimentos. Crudo y cocido son alimentos distintos: elige el que pesas. Las marcas pueden variar un poco.</Nota>
    </>
  );
}
