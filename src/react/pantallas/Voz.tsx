// 🎙️ Audio a texto: dictar en vivo, pasar un audio (nota de voz de WhatsApp, mp3, una grabación) a texto con Whisper en el
// equipo, y tus notas en una lista de una fila que se abre al tocarla. La lógica está en src/voz.js.
import { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import { fechaCorta } from '../../fechas.js';
import { toast, copiarTexto } from '../../ui.js';
import { notasVoz, nuevaNota, cambiarNota, borrarNota, tituloNota, palabras, ORIGEN, MODELOS, modeloElegido, elegirModelo, modeloListo, Reconocedor, aMuestras, transcribir } from '../../voz.js';
import { claveIA, pedirRevisionIA } from '../../ia';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { CampoLargoSolo } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Opciones, Avance } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'voz';
const FILA = { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' };
const GRANDE = { minHeight: 48 };
const hora = (ts: number) => new Date(ts).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
const reloj = (s: number) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const AVISO = { color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, m: '8px 0 0' };
const SISTEMA_NOTA = 'Recibes la transcripción automática de un audio en español (puede tener errores de palabras y no tiene puntuación). ' +
  'Responde en español de Colombia, sin halagos ni introducciones, con: 1) "Texto limpio": la transcripción con puntuación y párrafos, corrigiendo ' +
  'solo errores evidentes, sin inventar. 2) "Resumen": 3 a 5 viñetas. 3) "Pendientes": las tareas o decisiones que aparecen, si hay. Si algo no se entiende, márcalo [¿?].';

// ---------- 🎤 Dictar ----------
function Dictar() {
  const [oyendo, ponerOyendo] = useState(false), [texto, ponerTexto] = useState(''), [parcial, ponerParcial] = useState(''), [error, ponerError] = useState('');
  const rec = useRef<Fin>(null), seguir = useRef(false), acumulado = useRef(''), esta = useRef('');
  const juntar = () => { acumulado.current = (acumulado.current + ' ' + esta.current).replace(/\s+/g, ' ').trim(); esta.current = ''; };
  useEffect(() => () => { seguir.current = false; rec.current?.abort?.(); }, []);
  if (!Reconocedor) return <Nota sx={{ m: 0 }}>Este navegador no tiene dictado. Usa Chrome o Edge (en celular o computador), o graba el audio abajo y pásalo a texto.</Nota>;
  const empezar = () => {
    ponerError('');
    const r = new Reconocedor();
    r.lang = 'es-CO'; r.continuous = true; r.interimResults = true;
    // Se arma de nuevo con todo lo que oyó en esta escucha (algunos celulares vuelven a mandar lo ya confirmado); lo de
    // escuchas anteriores (se reinicia sola tras un silencio) queda en acumulado
    r.onresult = (ev: Fin) => {
      let fin = '', p = '';
      for (let i = 0; i < ev.results.length; i++) { const t = ev.results[i][0].transcript; if (ev.results[i].isFinal) fin += ' ' + t; else p += ' ' + t; }
      esta.current = fin.replace(/\s+/g, ' ').trim();
      ponerTexto((acumulado.current + ' ' + esta.current).trim()); ponerParcial(p.trim());
    };
    r.onerror = (ev: Fin) => {
      if (ev.error === 'no-speech' || ev.error === 'aborted') return;
      seguir.current = false;
      ponerError(ev.error === 'not-allowed' || ev.error === 'service-not-allowed' ? 'Sin permiso para el micrófono. Actívalo en el candado de la barra de direcciones.' : ev.error === 'network' ? 'El dictado necesita internet. Sin señal, graba el audio abajo y pásalo a texto.' : 'El dictado se detuvo (' + ev.error + ').');
    };
    // En el celular se detiene solo tras un silencio: mientras no toques Parar, vuelve a escuchar
    r.onend = () => { juntar(); if (seguir.current) { try { r.start(); return; } catch (err) { /* ya estaba escuchando */ } } ponerOyendo(false); ponerParcial(''); };
    rec.current = r; seguir.current = true;
    try { r.start(); ponerOyendo(true); } catch (err) { ponerError('No se pudo empezar el dictado.'); }
  };
  const parar = () => { seguir.current = false; rec.current?.stop?.(); ponerOyendo(false); };
  const guardarlo = () => {
    const t = (acumulado.current + ' ' + esta.current + ' ' + parcial).replace(/\s+/g, ' ').trim();
    if (!t) return;
    parar();
    nuevaNota(t, 'dictado');
    acumulado.current = ''; esta.current = ''; ponerTexto(''); ponerParcial('');
    toast('✓ Nota guardada');
  };
  return (
    <Box sx={{ display: 'grid', gap: '8px' }}>
      <Box sx={FILA}>
        {oyendo
          ? <Button color="secondary" onClick={parar} sx={GRANDE}>⏹ Parar</Button>
          : <Button onClick={empezar} sx={GRANDE}>🎤 {texto ? 'Seguir dictando' : 'Empezar a dictar'}</Button>}
        {texto || parcial ? <Button onClick={guardarlo} sx={GRANDE}>✓ Guardar nota</Button> : null}
        {texto && !oyendo ? <Button color="secondary" onClick={() => { acumulado.current = ''; esta.current = ''; ponerTexto(''); }} sx={GRANDE}>Borrar</Button> : null}
      </Box>
      {oyendo || texto ? (
        <Box data-t="dictado" aria-live="polite" sx={{ minHeight: 72, p: '10px 12px', borderRadius: '12px', bgcolor: tokens.surface2, border: '1px solid', borderColor: oyendo ? 'primary.main' : 'divider', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
          {texto}{parcial ? <Box component="span" sx={{ color: 'text.secondary' }}> {parcial}</Box> : null}
          {!texto && !parcial ? <Box component="span" sx={{ color: 'text.secondary' }}>🔴 Escuchando… habla normal</Box> : null}
        </Box>
      ) : <Nota sx={{ m: 0 }}>Habla y se escribe al instante. Di «punto» o «coma» para la puntuación. Necesita internet (lo procesa Google).</Nota>}
      {error ? <Box component="p" role="alert" sx={AVISO}>{error}</Box> : null}
    </Box>
  );
}

// ---------- 🎧 Pasar un audio a texto (y grabar) ----------
type Trabajo = { nombre: string; fase: 'leyendo' | 'bajando' | 'escuchando'; avance: number; seg?: number };
function PasarAudio() {
  const [modelo, ponerModelo] = useState(modeloElegido()), [trabajo, ponerTrabajo] = useState<Trabajo | null>(null), [error, ponerError] = useState('');
  const [grabando, ponerGrabando] = useState(0), grabadora = useRef<Fin>(null), archivo = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!grabando) return undefined; const t = setInterval(() => ponerGrabando((s) => s + 1), 1000); return () => clearInterval(t); }, [grabando > 0]);
  useEffect(() => () => { grabadora.current?.stream?.getTracks().forEach((t: Fin) => t.stop()); }, []);
  const pasar = async (blob: Blob, nombre: string, origen: 'audio' | 'grabacion') => {
    ponerError(''); ponerTrabajo({ nombre, fase: 'leyendo', avance: 0 });
    try {
      const { muestras, seg } = await aMuestras(blob);
      if (seg < 1) throw new Error('El audio está vacío.');
      const archivos: Record<string, number> = {};
      ponerTrabajo({ nombre, fase: modeloListo(modelo) ? 'escuchando' : 'bajando', avance: 0, seg });
      const texto = await transcribir(muestras, modelo, (d: Fin) => {
        if (d.tipo === 'escuchando') { ponerTrabajo({ nombre, fase: 'escuchando', avance: 0, seg }); return; }
        if (d.p.status === 'progress' && d.p.file) {
          archivos[d.p.file] = d.p.progress || 0;
          const v = Object.values(archivos), prom = v.reduce((a, b) => a + b, 0) / v.length;
          ponerTrabajo({ nombre, fase: 'bajando', avance: prom / 100, seg });
        }
      });
      if (!texto) throw new Error('No se oyó nada que pasar a texto.');
      nuevaNota(texto, origen, { nombre, seg, modelo });
      toast('✓ Listo: ' + palabras(texto) + ' palabras');
    } catch (err: Fin) { ponerError(err.message || String(err)); }
    ponerTrabajo(null);
  };
  const grabar = async () => {
    ponerError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const g = new MediaRecorder(stream), partes: Blob[] = [];
      g.ondataavailable = (ev) => { if (ev.data.size) partes.push(ev.data); };
      g.onstop = () => { stream.getTracks().forEach((t) => t.stop()); pasar(new Blob(partes, { type: g.mimeType }), 'Grabación de las ' + hora(Date.now()), 'grabacion'); };
      g.start(); grabadora.current = g; ponerGrabando(1);
    } catch (err) { ponerError('Sin permiso para el micrófono (o el equipo no tiene). Actívalo en el candado de la barra de direcciones.'); }
  };
  const pararGrabacion = () => { grabadora.current?.stop(); grabadora.current = null; ponerGrabando(0); };
  const ocupado = !!trabajo || grabando > 0, m = MODELOS[modelo as keyof typeof MODELOS];
  return (
    <Box sx={{ display: 'grid', gap: '10px' }}>
      <Box sx={FILA}>
        <Button onClick={() => archivo.current?.click()} disabled={ocupado} sx={GRANDE}>📂 Elegir un audio</Button>
        {grabando ? <Button color="secondary" onClick={pararGrabacion} sx={GRANDE}>⏹ Parar ({reloj(grabando - 1)})</Button>
          : <Button color="secondary" onClick={grabar} disabled={ocupado} sx={GRANDE}>⏺ Grabar</Button>}
        <input ref={archivo} type="file" accept="audio/*,video/*,.ogg,.opus,.m4a,.mp3,.wav,.webm,.aac" hidden aria-label="Audio para pasar a texto"
          onChange={(ev) => { const f = ev.target.files && ev.target.files[0]; ev.target.value = ''; if (f) pasar(f, f.name, 'audio'); }} />
      </Box>
      {trabajo ? (
        <Box data-t="trabajo" role="status" sx={{ display: 'grid', gap: '6px', p: '10px 12px', borderRadius: '12px', bgcolor: tokens.surface2 }}>
          <Box component="b" sx={{ overflowWrap: 'anywhere' }}>{trabajo.nombre}{trabajo.seg ? ' · ' + reloj(trabajo.seg) : ''}</Box>
          <span>{trabajo.fase === 'leyendo' ? '⏳ Leyendo el audio…' : trabajo.fase === 'bajando' ? '⬇️ Bajando el modelo ' + m.nombre + ' (solo la primera vez, ' + m.peso + ')… ' + Math.round(trabajo.avance * 100) + ' %' : '👂 Escuchando y escribiendo… (un audio de 1 minuto tarda más o menos ' + (modelo === 'small' ? '1 minuto' : '20 segundos') + ')'}</span>
          {trabajo.fase === 'bajando' ? <Avance parte={trabajo.avance} /> : null}
        </Box>
      ) : null}
      {error ? <Box component="p" role="alert" sx={AVISO}>{error}</Box> : null}
      <Box>
        <Nota sx={{ m: '0 0 4px' }}>Calidad (se baja una vez y queda en este equipo; después funciona sin internet):</Nota>
        <Opciones nombre="Modelo" chica envolver activa={modelo} alElegir={(k) => { elegirModelo(k); ponerModelo(k); }}
          opciones={Object.entries(MODELOS).map(([k, x]) => [k, x.nombre + ' · ' + x.peso + (modeloListo(k) ? ' ✓' : '')]) as [string, string][]} />
        <Nota sx={{ m: '4px 0 0' }}>{m.nota}.</Nota>
      </Box>
      <Desplegable titulo="¿Cómo paso una nota de voz de WhatsApp?">
        <Box component="ol" sx={{ m: '4px 0', pl: '20px', display: 'grid', gap: '4px', fontSize: 14 }}>
          <li><b>Celular:</b> en el chat, mantén presionado el audio → ⋮ o Compartir → <b>Guardar en Archivos</b> (o «Descargar»). Luego aquí, 📂 Elegir un audio.</li>
          <li><b>Computador:</b> en WhatsApp Web, pasa el mouse sobre el audio → ⌄ → <b>Descargar</b>. Queda en Descargas como .ogg.</li>
          <li>El audio no sale de tu equipo: lo escucha el modelo aquí mismo. Solo se guarda el texto.</li>
        </Box>
      </Desplegable>
    </Box>
  );
}

// ---------- 📝 Mis notas: una fila cada una; al tocarla se abre ----------
function NotaVoz({ n }: { n: Fin }) {
  const [abierta, ponerAbierta] = useState(false), [pidiendo, ponerPidiendo] = useState(false), [error, ponerError] = useState('');
  const clave = claveIA();
  const ordenar = async () => {
    ponerError(''); ponerPidiendo(true);
    try { cambiarNota(n.id, { ia: await pedirRevisionIA(n.texto, clave, SISTEMA_NOTA) }); toast('✓ Listo'); } catch (err: Fin) { ponerError(err.message || String(err)); }
    ponerPidiendo(false);
  };
  const compartir = async (t: string) => {
    if (navigator.share) { try { await navigator.share({ text: t }); return; } catch (err: Fin) { if (err && err.name === 'AbortError') return; } }
    copiarTexto(t, 'Copiado');
  };
  return (
    <Box component="li" data-nota={n.id} sx={{ borderRadius: '12px', bgcolor: tokens.surface2, overflow: 'hidden' }}>
      <Box component="button" type="button" aria-expanded={abierta} onClick={() => ponerAbierta(!abierta)}
        sx={{ all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '8px', p: '10px 12px', minHeight: 48, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
        <span aria-hidden>{ORIGEN[n.origen as keyof typeof ORIGEN] || '📝'}</span>
        <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tituloNota(n)}</Box>
        <Box component="small" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>{fechaCorta(new Date(n.fecha).toISOString().slice(0, 10))}</Box>
      </Box>
      {abierta ? (
        <Box sx={{ display: 'grid', gap: '8px', p: '0 12px 12px' }}>
          <Nota sx={{ m: 0 }}>{hora(n.fecha)} · {palabras(n.texto)} palabras{n.seg ? ' · audio de ' + reloj(n.seg) : ''}{n.nombre ? ' · ' + n.nombre : ''}</Nota>
          <CampoLargoSolo key={n.id + n.texto.length} aria-label="Texto de la nota" filas={Math.min(12, Math.max(3, Math.ceil(n.texto.length / 60)))} defaultValue={n.texto}
            onBlur={(ev) => { const t = ev.target.value.trim(); if (t && t !== n.texto) cambiarNota(n.id, { texto: t }); }} />
          <Box sx={FILA}>
            <Button color="secondary" onClick={() => copiarTexto(n.texto, 'Copiado')}>📋 Copiar</Button>
            <Button color="secondary" onClick={() => compartir(n.texto)}>📤 Compartir</Button>
            {clave ? <Button color="secondary" disabled={pidiendo} onClick={ordenar}>{pidiendo ? '⏳ Ordenando…' : '✨ Ordenar y resumir con Claude'}</Button> : null}
            <Button color="secondary" aria-label="Borrar la nota" onClick={() => { const deshacer = borrarNota(n.id); (toast as Fin)('Nota borrada', deshacer); }}>🗑</Button>
          </Box>
          {!clave ? <Nota sx={{ m: 0 }}>Para ordenar y resumir con Claude, conecta tu clave en 🌱 Mi vida → 🤖 Revisión con IA.</Nota> : null}
          {error ? <Box component="p" role="alert" sx={AVISO}>{error}</Box> : null}
          {n.ia ? (
            <Box sx={{ display: 'grid', gap: '6px', p: '10px 12px', borderRadius: '10px', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Box component="b">✨ Ordenado por Claude</Box>
              <Box data-ia="" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 15 }}>{n.ia}</Box>
              <Box sx={FILA}><Button color="secondary" onClick={() => copiarTexto(n.ia, 'Copiado')}>📋 Copiar</Button><Button color="secondary" onClick={() => compartir(n.ia)}>📤 Compartir</Button></Box>
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}

function MisNotas() {
  const [buscar, ponerBuscar] = useState(''), todas = notasVoz() as Fin[];
  const q = buscar.trim().toLowerCase(), lista = q ? todas.filter((n) => n.texto.toLowerCase().includes(q)) : todas;
  if (!todas.length) return <Nota sx={{ m: 0 }}>Aquí quedan tus notas. Se guardan en la nube con lo demás (solo el texto).</Nota>;
  return (
    <Box sx={{ display: 'grid', gap: '8px' }}>
      {todas.length > 5 ? <Box component="input" type="search" placeholder="🔎 Buscar en tus notas" aria-label="Buscar en tus notas" value={buscar} onChange={(ev: Fin) => ponerBuscar(ev.target.value)}
        sx={{ font: 'inherit', color: 'text.primary', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '10px', p: '10px 12px', minHeight: 44 }} /> : null}
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: '6px' }}>{lista.map((n) => <NotaVoz key={n.id} n={n} />)}</Box>
      {q && !lista.length ? <Nota sx={{ m: 0 }}>Ninguna nota dice «{buscar}».</Nota> : null}
    </Box>
  );
}

export default function Voz() {
  usarEstado();
  const n = (notasVoz() as Fin[]).length;
  return (
    <>
      <TituloPantalla>🎙️ Audio a texto</TituloPantalla>
      <Nota sx={{ mt: '-6px', mb: '12px' }}>Dicta, graba o pasa una nota de voz a texto. Gratis y en tu equipo.</Nota>
      <Box sx={{ display: 'grid', gap: '14px', gridTemplateColumns: { md: '1fr 1fr' }, alignItems: 'start', '& > *': { minWidth: 0, m: { md: '0 !important' } } }}>
        <TarjetaPlegable vista={VISTA} clave="dictar" titulo="🎤 Dictar">{<Dictar />}</TarjetaPlegable>
        <TarjetaPlegable vista={VISTA} clave="audio" titulo="🎧 Pasar un audio a texto">{<PasarAudio />}</TarjetaPlegable>
        <Box sx={{ gridColumn: { md: '1 / -1' } }}>
          <TarjetaPlegable vista={VISTA} clave="notas" titulo={'📝 Mis notas' + (n ? ' (' + n + ')' : '')}>{<MisNotas />}</TarjetaPlegable>
        </Box>
      </Box>
    </>
  );
}
