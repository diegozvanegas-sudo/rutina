// 🛒 Compras: lista del próximo mercado (por categoría, con lo que más compras a un toque) y deseos (con prioridad y la regla de esperar 30 días)
import { Fragment, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Card, Chip, IconButton, Link, Typography } from '@mui/material';
import { guardar } from '../../estado.js';
import { iso, fechaCorta } from '../../fechas.js';
import { toast as avisar, copiarTexto } from '../../ui.js';
import {
  CATEGORIAS, PRIORIDADES, adivinarCategoria, precioDe, pendientes, comprados, total, sinPrecio, porCategoria, frecuentes, consejoDeseo, marcarComprado, textoLista, claveCompra,
} from '../../compras.js';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLista, DOS } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota, Detalle } from '../ui/Textos';

const VISTA = 'compras';
// El aviso de abajo, con su botón de deshacer cuando se le pasa cómo
const toast = avisar as (mensaje: string, deshacer?: (() => void) | null) => void;
type Tipo = 'mercado' | 'deseo';
type Item = { id: string; tipo: Tipo; nombre: string; creado: string; hecho: boolean; comprado?: string; cant?: string; cat?: string; prioridad?: string; enlace?: string; precio?: number; nota?: string };
type Compras = { lista: Item[]; veces: Record<string, unknown> };
type Campos = 'nombre' | 'cant' | 'cat' | 'prioridad' | 'enlace' | 'precio' | 'nota';

// Al salir de la pantalla y volver, sigue en la lista que se estaba viendo
const visto: { tab: Tipo } = { tab: 'mercado' };
const uid = () => 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const pesos = (n: number) => '$' + Math.round(n).toLocaleString('es-CO');
const OPC_CAT = CATEGORIAS as [string, string][], OPC_PRI = PRIORIDADES as [string, string][];
const FILA_BOTONES = { display: 'flex', gap: '8px', flexWrap: 'wrap', my: '8px' };
const CHIPS = { display: 'flex', flexWrap: 'wrap', gap: '6px', m: '6px 0 4px' };

// Une las partes con " · " (algunas son enlaces)
const conPuntos = (partes: ReactNode[]) => partes.map((x, i) => <Fragment key={i}>{i ? ' · ' : ''}{x}</Fragment>);

const Categoria = ({ children }: { children: ReactNode }) => <Typography component="h3" sx={{ m: '14px 0 4px', fontSize: 15, fontWeight: 700 }}>{children}</Typography>;
function Resumen({ items }: { items: Item[] }) {
  const t = total(items), sp = sinPrecio(items);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', mb: '4px' }}>
      <span>{items.length + (items.length === 1 ? ' cosa' : ' cosas') + (sp && t ? ' · ' + sp + ' sin precio' : '')}</span>
      {t ? <b>Total aprox. {pesos(t)}</b> : null}
    </Box>
  );
}
const Vacia = ({ children }: { children: ReactNode }) => <Card component="section" sx={{ mb: '14px' }}><Nota sx={{ textAlign: 'center' }}>{children}</Nota></Card>;

export default function Compras({ pestana }: { pestana?: string }) {
  const estado = usarEstado();
  // Enlaces directos: #compras/deseos y #compras/mercado
  const [tab, ponerTab] = useState<Tipo>(() => {
    if (pestana === 'deseos' || pestana === 'deseo') visto.tab = 'deseo'; else if (pestana === 'mercado') visto.tab = 'mercado';
    return visto.tab;
  });
  const [editando, ponerEditando] = useState<string | null>(null);
  const datos: Compras = (estado.compras ??= { lista: [], veces: {} });
  const mercado = tab === 'mercado';
  const nombre = useRef<HTMLInputElement>(null), cant = useRef<HTMLInputElement>(null), precio = useRef<HTMLInputElement>(null),
    enlace = useRef<HTMLInputElement>(null), prioridad = useRef<HTMLSelectElement>(null);

  const cambiarTab = (t: Tipo) => { visto.tab = t; ponerTab(t); ponerEditando(null); };

  // ---------- Acciones (las mismas reglas de siempre) ----------
  function agregar(texto: string, extra: Partial<Item> = {}) {
    const n = String(texto || '').trim();
    if (!n) return null;
    const ya = (pendientes(datos.lista, tab) as Item[]).find((x) => claveCompra(x.nombre) === claveCompra(n));
    if (ya) { toast('"' + ya.nombre + '" ya está en la lista'); return null; }
    const item: Item = { id: uid(), tipo: tab, nombre: n, creado: iso(), hecho: false, ...extra };
    if (mercado) item.cat ??= adivinarCategoria(n); else item.prioridad ??= 'quiero';
    for (const k of Object.keys(item) as (keyof Item)[]) if (item[k] === '' || item[k] == null) delete item[k];
    datos.lista.push(item);
    return item;
  }
  function agregarDelFormulario() {
    const v = (r: { current: HTMLInputElement | HTMLSelectElement | null }) => (r.current ? r.current.value.trim() : '');
    const n = v(nombre);
    if (!n) { toast('Escribe qué vas a comprar'); nombre.current?.focus(); return; }
    const extra: Partial<Item> = { precio: precioDe(v(precio)) || undefined };
    if (mercado) extra.cant = v(cant); else { extra.prioridad = v(prioridad) || 'quiero'; extra.enlace = v(enlace); }
    if (!agregar(n, extra)) return;
    // El formulario queda limpio para el siguiente (antes el siguiente producto heredaba la cantidad y el precio)
    for (const r of [nombre, cant, precio, enlace]) if (r.current) r.current.value = '';
    guardar();
    toast('＋ ' + n);
    setTimeout(() => nombre.current?.focus(), 80);
  }
  const conEnter = (ev: KeyboardEvent) => { if (ev.key === 'Enter') { ev.preventDefault(); ev.stopPropagation(); agregarDelFormulario(); } };
  const rapida = (n: string, cat?: string) => { if (agregar(n, cat ? { cat } : {})) { guardar(); toast('＋ ' + n); } };
  const marcar = (x: Item) => { marcarComprado(datos, x, iso(), !x.hecho); guardar(); };
  // Un campo de la edición: se guarda al salir de él (o al elegir, en las listas)
  function guardarCampo(x: Item, k: Campos, el: HTMLInputElement | HTMLSelectElement) {
    const val = el.value.trim();
    if (k === 'nombre' && !val) { el.value = x.nombre; return; }
    if (k === 'precio') {
      const n = precioDe(val);
      if ((n || undefined) === (x.precio || undefined)) return;
      if (n) x.precio = n; else delete x.precio;
    } else {
      if ((x[k] || '') === val) return;
      if (val) x[k] = val; else delete x[k];
    }
    guardar();
  }
  function borrar(x: Item) {
    const i = datos.lista.indexOf(x);
    if (i < 0) return;
    datos.lista.splice(i, 1);
    ponerEditando(null);
    guardar();
    toast('Quitado: ' + x.nombre, () => { datos.lista.splice(i, 0, x); guardar(); });
  }
  function limpiar() {
    const antes = datos.lista.slice();
    datos.lista = datos.lista.filter((x) => !(x.tipo === tab && x.hecho));
    guardar();
    toast('Lista limpia', () => { datos.lista = antes; guardar(); });
  }
  const copiar = () => { const t = textoLista(datos, tab); if (t) copiarTexto(t, '📋 Lista copiada'); };

  // ---------- Piezas ----------
  const chipRapido = (n: string, cat?: string) => <Chip key={n} size="small" variant="outlined" clickable label={'＋ ' + n} onClick={() => rapida(n, cat)} />;
  // Alimentos de la dieta que no están pendientes: para armar el mercado con lo que comes
  function rapidos() {
    const fr = frecuentes(datos) as { nombre: string; cat?: string }[];
    const enLista = new Set((pendientes(datos.lista, 'mercado') as Item[]).map((x) => claveCompra(x.nombre)));
    const dieta = ((estado.dieta?.alimentos || []) as { id: string; nombre: string }[]).filter((x) => x.nombre && x.id !== 'cafe' && !enLista.has(claveCompra(x.nombre))).map((x) => x.nombre).slice(0, 12);
    return (
      <>
        {fr.length > 0 && <><Nota>Lo que más compras:</Nota><Box sx={CHIPS}>{fr.map((x) => chipRapido(x.nombre, x.cat))}</Box></>}
        {dieta.length > 0 && <Desplegable titulo="🥗 De tu dieta"><Box sx={CHIPS}>{dieta.map((n) => chipRapido(n))}</Box></Desplegable>}
      </>
    );
  }

  // Se llaman como funciones (no como componentes) para que React no vuelva a crear los campos en cada pintada
  function fila(x: Item) {
    const esMercado = x.tipo === 'mercado';
    if (editando === x.id) {
      const campo = (k: Campos, etiqueta: string, extra: object = {}) => (
        <Campo etiqueta={etiqueta} data-k={k} defaultValue={k === 'precio' ? (Number(x.precio) > 0 ? Math.round(x.precio!).toLocaleString('es-CO') : '') : (x[k] as string) || ''}
          onBlur={(ev) => guardarCampo(x, k, ev.currentTarget)} {...extra} />
      );
      const elegir = (k: Campos, etiqueta: string, opciones: [string, string][], actual: string) => (
        <CampoLista etiqueta={etiqueta} opciones={opciones} data-k={k} defaultValue={actual} onChange={(ev) => guardarCampo(x, k, ev.currentTarget)} />
      );
      return (
        <Box component="li" key={x.id} sx={{ py: '8px', borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 }, display: 'grid', gap: '8px' }}>
          {campo('nombre', 'Nombre')}
          <Box sx={DOS}>
            {esMercado
              ? <>{campo('cant', 'Cantidad')}{elegir('cat', 'Categoría', OPC_CAT, x.cat || 'otros')}</>
              : <>{elegir('prioridad', 'Prioridad', OPC_PRI, x.prioridad || 'quiero')}{campo('enlace', 'Enlace o tienda')}</>}
          </Box>
          <Box sx={DOS}>{campo('precio', 'Precio aprox.', { inputMode: 'numeric', 'data-pesos': '' })}{campo('nota', 'Nota')}</Box>
          <Box sx={FILA_BOTONES}>
            <Button onClick={() => ponerEditando(null)}>✓ Listo</Button>
            <Button color="secondary" onClick={() => borrar(x)}>🗑 Quitar</Button>
          </Box>
        </Box>
      );
    }
    const ver = x.enlace && /^https?:\/\//i.test(x.enlace) ? <Link href={x.enlace} target="_blank" rel="noopener">Ver ↗</Link> : x.enlace || '';
    const extra = [x.cant, Number(x.precio) > 0 && pesos(x.precio!), !esMercado && ver, x.nota].filter(Boolean) as ReactNode[];
    const consejo: string = !esMercado && !x.hecho ? consejoDeseo(x, iso()) : '';
    return (
      // 📱 Deslizar a la derecha marca comprado; a la izquierda, editar (main.js, data-deslizar)
      <Box component="li" key={x.id} data-deslizar={x.hecho ? undefined : '[data-t=marcar-compra]'} data-deslizar-izq={x.hecho ? undefined : '[data-t=editar-compra]'} sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px', py: '8px', borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
        <ButtonBase data-t="marcar-compra" aria-pressed={!!x.hecho} aria-label={(x.hecho ? 'Desmarcar ' : 'Comprado: ') + x.nombre} onClick={() => marcar(x)}
          sx={{ flex: 'none', width: 32, height: 32, mt: '2px', borderRadius: '50%', border: '2px solid', borderColor: x.hecho ? 'primary.main' : 'text.secondary',
            bgcolor: x.hecho ? 'primary.main' : 'transparent', color: 'primary.contrastText', fontWeight: 700, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }}>
          {x.hecho ? '✓' : ''}
        </ButtonBase>
        <Box component="span" sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px', overflowWrap: 'anywhere', pt: '6px' }}>
          <Box component="b" sx={x.hecho ? { textDecoration: 'line-through', opacity: 0.6 } : null}>{x.nombre}</Box>
          {extra.length > 0 && <Detalle>{conPuntos(extra)}</Detalle>}
          {x.hecho && x.comprado && <Detalle>Comprado el {fechaCorta(x.comprado)}</Detalle>}
          {consejo && <Detalle sx={{ color: 'warning.main' }}>⏳ {consejo}</Detalle>}
        </Box>
        {!x.hecho && <IconButton data-t="editar-compra" aria-label={'Editar ' + x.nombre} onClick={() => ponerEditando(x.id)} sx={{ fontSize: 20 }}>✏️</IconButton>}
      </Box>
    );
  }
  const lista = (items: Item[]) => <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>{items.map(fila)}</Box>;


  function listaMercado() {
    const items = pendientes(datos.lista, 'mercado') as Item[];
    if (!items.length) return <Vacia>🛒 La lista del mercado está vacía. Agrega lo que te falta o toca lo que más compras.</Vacia>;
    return (
      <Card component="section" sx={{ mb: '14px' }}>
        <Resumen items={items} />
        {(porCategoria(items) as { nombre: string; items: Item[] }[]).map((g) => <Fragment key={g.nombre}><Categoria>{g.nombre}</Categoria>{lista(g.items)}</Fragment>)}
        <Button fullWidth color="secondary" sx={{ mt: '8px' }} onClick={copiar}>📋 Copiar la lista (WhatsApp)</Button>
      </Card>
    );
  }
  function listaDeseos() {
    const items = pendientes(datos.lista, 'deseo') as Item[];
    if (!items.length) return <Vacia>✨ Anota aquí lo que quieres comprar. Si no lo necesitas, espera 30 días: si lo sigues queriendo, no es un impulso.</Vacia>;
    const grupos = OPC_PRI.map(([id, n]) => ({ id, nombre: n, xs: items.filter((x) => (x.prioridad || 'quiero') === id) })).filter((g) => g.xs.length);
    return (
      <Card component="section" sx={{ mb: '14px' }}>
        <Resumen items={items} />
        {grupos.map((g) => (
          <Fragment key={g.id}>
            <Categoria>{g.nombre}{total(g.xs) ? <> <Box component="small" sx={{ fontWeight: 400, color: 'text.secondary', fontSize: 13 }}>{pesos(total(g.xs))}</Box></> : null}</Categoria>
            {lista(g.xs)}
          </Fragment>
        ))}
        <Nota>Antes de comprar un deseo, revisa en 💰 Finanzas que te alcance sin tocar el ahorro.</Nota>
        <Button fullWidth color="secondary" sx={{ mt: '8px' }} onClick={copiar}>📋 Copiar la lista</Button>
      </Card>
    );
  }
  function hechos() {
    const xs = comprados(datos.lista, tab) as Item[];
    if (!xs.length) return null;
    return (
      <Card component="section" sx={{ mb: '14px', py: '4px' }}>
        <Desplegable titulo={'✓ Comprado (' + xs.length + ')'}>
          {lista(xs)}
          <Button fullWidth color="secondary" sx={{ mt: '8px' }} onClick={limpiar}>Quitar lo comprado de la lista</Button>
          {mercado && <Nota>Lo que compras queda en "Lo que más compras" para el próximo mercado.</Nota>}
        </Desplegable>
      </Card>
    );
  }

  const cuantos = (t: Tipo) => pendientes(datos.lista, t).length;
  const tituloForm = mercado ? '＋ Agregar al mercado' : '＋ Agregar un deseo';
  return (
    <>
      <TituloPantalla>Compras</TituloPantalla>
      <Box component="nav" aria-label="Lista" sx={{ display: 'flex', gap: '8px', overflowX: 'auto', p: '2px 0 12px', scrollbarWidth: 'none' }}>
        {([['mercado', '🛒 Mercado'], ['deseo', '✨ Deseos']] as [Tipo, string][]).map(([id, t]) => (
          <Chip key={id} clickable aria-pressed={tab === id} color={tab === id ? 'primary' : 'default'} variant={tab === id ? 'filled' : 'outlined'}
            label={t + (cuantos(id) ? ' · ' + cuantos(id) : '')} onClick={() => cambiarTab(id)} />
        ))}
      </Box>
      <TarjetaPlegable key={tab} vista={VISTA} clave={tituloForm} titulo={tituloForm}>
        <Box sx={{ display: 'grid', gap: '8px' }}>
          <Campo etiqueta={mercado ? 'Producto' : '¿Qué quieres comprar?'} id="compra-nombre" referencia={nombre} onKeyDown={conEnter} placeholder={mercado ? 'Ej.: pechuga, avena, bananos' : 'Ej.: tenis de fútbol, audífonos'} />
          <Box sx={DOS}>
            {mercado
              ? <Campo etiqueta="Cantidad" id="compra-cant" referencia={cant} onKeyDown={conEnter} placeholder="Ej.: 2 kg, 30 u" />
              : <CampoLista etiqueta="Prioridad" id="compra-pri" referencia={prioridad} opciones={OPC_PRI} defaultValue="quiero" />}
            <Campo etiqueta="Precio aprox. (opcional)" id="compra-precio" referencia={precio} onKeyDown={conEnter} inputMode="numeric" data-pesos="" placeholder="$" />
          </Box>
          {!mercado && <Campo etiqueta="Enlace o tienda (opcional)" id="compra-enlace" referencia={enlace} onKeyDown={conEnter} placeholder="https://… o el nombre de la tienda" />}
        </Box>
        <Button fullWidth sx={{ mt: '8px' }} onClick={agregarDelFormulario}>Agregar</Button>
        {mercado && rapidos()}
      </TarjetaPlegable>
      {mercado ? listaMercado() : listaDeseos()}
      {hechos()}
    </>
  );
}
