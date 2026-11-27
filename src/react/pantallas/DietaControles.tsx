// 🩺 Controles de composición (Dieta → Peso): anotas cada control de la nutricionista (peso, IMC, % grasa, % músculo,
// grasa visceral y cintura) y la app los compara como su "registro de evolución", con los kg reales de grasa y de músculo
// y una lectura honesta. Las reglas están en src/composicion.js; lo anotado va en dieta.controles.
import { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import { e as estado, guardar } from '../../estado.js';
import { iso, fechaCorta } from '../../fechas.js';
import { PARAMETROS, controlesDe, guardarControl, borrarControl, completar, comparar, conclusion, textoComparacion } from '../../composicion.js';
import { toast, copiarTexto } from '../../ui.js';
import { tokens } from '../tema';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, DOS } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import { Opciones } from '../ui/Varios';
import { Desplegable } from '../ui/Desplegable';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'dieta';
const n1 = (n: number) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
const n2 = (n: number) => (Math.round(n * 100) / 100).toLocaleString('es-CO');
const valor = (p: Fin, v: number) => (p.k.endsWith('Kg') ? n2(v) : n1(v)) + (p.u === '%' ? ' %' : p.u ? ' ' + p.u : '');
const VACIO = { fecha: '', peso: '', imc: '', grasa: '', musculo: '', visceral: '', cintura: '', quien: '', nota: '' };
const CORTO: Record<string, string> = { grasa: '% Grasa', musculo: '% Músculo', visceral: 'Grasa visceral', imc: 'IMC' };
const CELDA = { p: '6px 4px', fontSize: 14, textAlign: 'center' as const, fontVariantNumeric: 'tabular-nums', minWidth: 0 };

// La fila de la tabla: parámetro, antes, ahora y la variación en verde (para bien) o rojo (para mal)
function Fila({ p }: { p: Fin }) {
  const fondo = p.bien === true ? tokens.brandSoft : p.bien === false ? tokens.rojoFondo : tokens.surface2;
  const color = p.bien === true ? tokens.verde : p.bien === false ? tokens.rojoSuave : 'text.secondary';
  const dif = p.k.endsWith('Kg') ? n2(Math.abs(p.dif)) : n1(Math.abs(p.dif));
  return (
    <Box component="tr" data-t="control-fila" data-k={p.k} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box component="th" scope="row" sx={{ ...CELDA, textAlign: 'left', fontWeight: 600 }}><span aria-hidden>{p.ic} </span>{p.t}</Box>
      <Box component="td" sx={CELDA}>{valor(p, p.a)}</Box>
      <Box component="td" sx={{ ...CELDA, fontWeight: 700 }}>{valor(p, p.b)}</Box>
      <Box component="td" sx={CELDA}>
        <Box component="span" sx={{ display: 'inline-block', p: '2px 6px', borderRadius: '8px', bgcolor: fondo, color, fontWeight: 700, whiteSpace: 'nowrap' }}>
          {p.dif > 0 ? '▲ +' : p.dif < 0 ? '▼ −' : '= '}{dif}
        </Box>
      </Box>
    </Box>
  );
}

function Tabla({ cmp }: { cmp: Fin }) {
  const cab = { ...CELDA, fontSize: 12, color: 'text.secondary', fontWeight: 600 };
  return (
    <Box component="table" data-t="control-tabla" sx={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', '& th:first-of-type': { width: '36%' } }}>
      <thead>
        <tr>
          <Box component="th" scope="col" sx={{ ...cab, textAlign: 'left' }}>Parámetro</Box>
          <Box component="th" scope="col" sx={cab}>{fechaCorta(cmp.a.fecha)}</Box>
          <Box component="th" scope="col" sx={cab}>{fechaCorta(cmp.b.fecha)}</Box>
          <Box component="th" scope="col" sx={cab}>Cambio</Box>
        </tr>
      </thead>
      <tbody>
        {cmp.filas.map((p: Fin) => <Fila key={p.k} p={p} />)}
        {cmp.derivados.length ? <tr><Box component="td" colSpan={4} sx={{ ...cab, textAlign: 'left', pt: '12px' }}>Lo que la app calcula (los kg de verdad)</Box></tr> : null}
        {cmp.derivados.map((p: Fin) => <Fila key={p.k} p={p} />)}
      </tbody>
    </Box>
  );
}

// Agregar o editar un control
function Formulario({ inicial, id, alTerminar }: { inicial: Fin; id: string | null; alTerminar: () => void }) {
  const [f, ponerF] = useState<Fin>({ ...VACIO, fecha: iso(), ...Object.fromEntries(Object.entries(inicial || {}).map(([k, v]) => [k, v == null ? '' : String(v).replace('.', ',')])) });
  const poner = (k: string) => (ev: Fin) => ponerF({ ...f, [k]: ev.currentTarget.value });
  const caja = useRef<HTMLDivElement>(null);
  useEffect(() => { if (id && caja.current) caja.current.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, [id]);
  const listo = () => {
    const x = (guardarControl as Fin)(estado().dieta, f, id);
    if (!x) { toast('Pon la fecha y al menos un dato'); return; }
    guardar(); toast(id ? '✓ Control actualizado' : '🩺 Control anotado'); alTerminar();
  };
  return (
    <Box ref={caja} data-t="control-form" sx={{ display: 'grid', gap: '10px', p: '10px 12px', borderRadius: '12px', bgcolor: tokens.surface2, mb: '10px' }}>
      <Box sx={DOS}>
        <Campo etiqueta="Fecha del control" type="date" value={f.fecha} max={iso()} onChange={poner('fecha')} data-t="control-fecha" />
        {PARAMETROS.map((p) => (
          <Campo key={p.k} etiqueta={(CORTO[p.k] || p.t) + (p.u && p.u !== '%' ? ' (' + p.u + ')' : '')} inputMode="decimal" value={f[p.k]} onChange={poner(p.k)} data-t={'control-' + p.k}
            placeholder={p.k === 'imc' ? 'Opcional' : undefined} />
        ))}
      </Box>
      <Campo etiqueta="Quién lo midió (opcional)" value={f.quien} maxLength={60} onChange={poner('quien')} placeholder="Ej.: nutricionista, gym" />
      <Campo etiqueta="Nota (opcional)" value={f.nota} maxLength={500} onChange={poner('nota')} placeholder="Ej.: en ayunas, 7 a. m." />
      <Box sx={{ display: 'flex', gap: '8px' }}>
        <Button variant="contained" sx={{ flex: 1 }} onClick={listo} data-t="control-guardar">{id ? 'Guardar cambios' : 'Anotar control'}</Button>
        <Button color="secondary" onClick={alTerminar}>Cancelar</Button>
      </Box>
    </Box>
  );
}

// Un control en una fila; al tocarlo se ve todo, con editar y borrar
function Control({ c, estatura, alEditar }: { c: Fin; estatura: number | null; alEditar: () => void }) {
  const x = completar(c, estatura) as Fin;
  const resumen = [x.peso ? n1(x.peso) + ' kg' : '', x.grasa ? n1(x.grasa) + ' % grasa' : '', x.musculo ? n1(x.musculo) + ' % músc.' : ''].filter(Boolean).join(' · ');
  return (
    <Desplegable titulo={<><b>{fechaCorta(c.fecha)} {c.fecha.slice(0, 4)}</b> · {resumen || 'sin datos'}</>} sx={{ bgcolor: tokens.surface2 }}>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '4px', fontSize: 14 }}>
        {[...PARAMETROS, { k: 'grasaKg', t: 'Grasa en kg', u: 'kg', ic: '🧈' }, { k: 'musculoKg', t: 'Músculo en kg', u: 'kg', ic: '💪' }].filter((p) => x[p.k] != null).map((p) => (
          <Box component="li" key={p.k} sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}><span>{p.ic} {p.t}{p.k === 'imc' && c.imc == null ? ' (con tu estatura)' : ''}</span><b>{valor(p, x[p.k])}</b></Box>
        ))}
      </Box>
      {c.quien || c.nota ? <Nota>{[c.quien, c.nota].filter(Boolean).join(' · ')}</Nota> : null}
      <Box sx={{ display: 'flex', gap: '8px', mt: '8px' }}>
        <Button size="small" color="secondary" onClick={alEditar}>Editar</Button>
        <Button size="small" color="secondary" onClick={() => { if (confirm('¿Borrar el control del ' + fechaCorta(c.fecha) + '?') && borrarControl(estado().dieta, c.id)) { guardar(); toast('Borrado'); } }}>Borrar</Button>
      </Box>
    </Desplegable>
  );
}

export function Controles({ e }: { e: Fin }) {
  const lista = controlesDe(e.dieta) as Fin[], c = e.dieta.config || {}, estatura = c.estatura || null;
  const [contra, ponerContra] = useState<'primero' | 'anterior'>('primero');
  const [form, ponerForm] = useState<{ id: string | null; inicial: Fin } | null>(null);
  const a = lista.length >= 2 ? (contra === 'anterior' ? lista[lista.length - 2] : lista[0]) : null, b = lista[lista.length - 1];
  // Bajar de peso es para bien si tu meta está por debajo del control de partida (sin meta, se asume que bajas)
  const bajar = c.meta && a && a.peso ? c.meta < a.peso : true;
  const cmp = a ? comparar(a, b, { estatura, bajar }) as Fin : null, conclu = cmp ? conclusion(cmp, { estatura }) as Fin[] : [];
  const compartir = async () => {
    const t = textoComparacion(cmp, conclu);
    if (navigator.share) { try { await navigator.share({ text: t }); return; } catch (err: Fin) { if (err && err.name === 'AbortError') return; } }
    copiarTexto(t, '📋 Evolución copiada: pégala en WhatsApp');
  };
  return (
    <TarjetaPlegable vista={VISTA} clave="🩺 Controles" titulo={'🩺 Controles de composición' + (lista.length ? ' (' + lista.length + ')' : '')}
      lado={form ? null : <Button color="secondary" data-t="control-agregar" onClick={() => ponerForm({ id: null, inicial: null })}>＋ Agregar</Button>}>
      {form ? <Formulario key={form.id || 'nuevo'} id={form.id} inicial={form.inicial} alTerminar={() => ponerForm(null)} /> : null}
      {!lista.length && !form ? <Nota sx={{ mt: 0 }}>Anota aquí lo que te mide la nutricionista o la báscula del gym (peso, % grasa, % músculo, grasa visceral, cintura). Con dos controles ves la evolución, y en kg, que es lo que de verdad dice si ganas músculo.</Nota> : null}
      {lista.length === 1 && !form ? <Nota sx={{ mt: 0 }}>Con el próximo control (ideal en 4 a 8 semanas) ves cuánto cambió cada cosa.</Nota> : null}
      {cmp ? <Box data-t="control-comparacion">
        {lista.length > 2 ? <Opciones nombre="Comparar contra" opciones={[['primero', 'Contra el primero'], ['anterior', 'Contra el anterior']]} activa={contra} alElegir={ponerContra} chica /> : null}
        <Nota sx={{ mt: 0 }}><b>{fechaCorta(cmp.a.fecha)} → {fechaCorta(cmp.b.fecha)}</b> · {cmp.dias} días</Nota>
        <Tabla cmp={cmp} />
        <Box component="h3" sx={{ m: '14px 0 6px', fontSize: 16 }}>Qué dice de verdad</Box>
        <Box data-t="control-conclusion" sx={{ display: 'grid', gap: '6px' }}>
          {conclu.map((x, i) => (
            <Desplegable key={x.tipo + i} abiertoAlInicio={i === 0} titulo={<><span aria-hidden>{x.ic} </span><b>{x.t}</b></>} sx={{ bgcolor: tokens.surface2 }}>
              <Nota sx={{ m: 0 }}>{x.d}</Nota>
            </Desplegable>
          ))}
        </Box>
        <Button fullWidth color="secondary" sx={{ mt: '10px' }} onClick={compartir} data-t="control-compartir">📤 Compartir la evolución</Button>
      </Box> : null}
      {lista.length ? <>
        <Box component="h3" sx={{ m: '14px 0 6px', fontSize: 16 }}>Tus controles</Box>
        <Box sx={{ display: 'grid', gap: '6px' }}>
          {[...lista].reverse().map((x) => <Control key={x.id} c={x} estatura={estatura} alEditar={() => { ponerForm({ id: x.id, inicial: x }); }} />)}
        </Box>
      </> : null}
    </TarjetaPlegable>
  );
}
