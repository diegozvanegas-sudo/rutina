// ⚙️ Ajustes: perfil, nube (copias y huella), avisos del día, Google Sheets, metas, pastilla → desayuno, sonido,
// copia de seguridad y empezar de cero. React pinta; las reglas son las de src/vistas/ajustes.js: los campos y casillas
// llevan data-cambio y los botones data-accion (main.js los despacha igual que antes).
// pantallaEntrar y pantallaBloqueo (vistas/ajustes.js) son del armazón de la app y se quedan allá.
import { useState, type ReactNode } from 'react';
import { Box, Button, Checkbox, Chip, Link } from '@mui/material';
import { semanaActual } from '../../estado.js';
import { hora, fechaLarga } from '../../fechas.js';
import { nube, configurada, textoNube } from '../../nube.js';
import { hoja, hojaLista } from '../../hoja.js';
import { AVISOS, HORAS_AVISOS, avisosDelDia } from '../../registro.js';
import { soportados, avisosActivos } from '../../avisos.js';
import { bloqueo, huellaActiva } from '../../bloqueo.js';
import { avisosDeSuplementos } from '../../vistas/suplementos.js';
import { piezasAjustes } from '../../vistas/ajustes.js';
import { tokens } from '../tema';
import { TEMAS, LETRAS, leerApariencia } from '../../apariencia.js';
import { datosLateral } from '../armazon.js';
import { MAX_ABAJO } from '../../barra-abajo.js';
import { almacen } from '../../almacen.js';
import { e, guardar } from '../../estado.js';
import { drive, probarDrive, sincronizar } from '../../imagenes-equipo.js';
import { urlDrive, idDeUrl, claveNueva, scriptConClave, problemaDrive, explicarError } from '../../imagenes.js';
import SCRIPT_DRIVE from '../../../apps_script/Imagenes.gs?raw';
import { Desplegable } from '../ui/Desplegable';
import { toast } from '../../ui.js';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, DOS } from '../ui/Campo';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'ajustes';
const A = piezasAjustes as Fin;
const N = nube as Fin;
const H = hoja as Fin;
const B = bloqueo as Fin;

const Botones = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', my: '8px' }}>{children}</Box>;
const Aviso = ({ children, alerta = false }: { children: ReactNode; alerta?: boolean }) => (
  <Box component="p" role={alerta ? 'alert' : undefined} sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, my: '8px' }}>{children}</Box>
);
const Subtitulo = ({ children }: { children: ReactNode }) => <Box component="h2" sx={{ fontSize: 18, fontWeight: 700, m: '14px 0 6px' }}>{children}</Box>;
// Casilla nativa con su data-cambio (se rehace con lo guardado cada vez que cambia)
const Interruptor = ({ marcado, datos, children }: { marcado: boolean; datos: Record<string, string>; children: ReactNode }) => (
  <Box component="label" sx={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', minHeight: 40 }}>
    <Checkbox key={String(marcado)} defaultChecked={marcado} slotProps={{ input: datos as object }} sx={{ p: '4px', ml: '-4px' }} />{children}
  </Box>
);
const numero = { type: 'number', inputMode: 'numeric' } as const;
const COLOR_NUBE: Record<string, string> = { 'al-dia': tokens.brand, error: tokens.rojo, pendiente: tokens.amarillo, sincronizando: tokens.amarillo };

// La meta de calorías la pone el plan de Dieta de cada día
const ETIQUETAS: [string, string][] = [['agua', 'Agua (ml)'], ['pasos', 'Pasos'], ['lectura', 'Lectura (min)'], ['pantalla', 'Pantalla máxima (min)']];
const ETIQUETAS_HORA: [string, string][] = [['pastilla', '💊 Pastilla'], ['partido', '⚽ Hora del partido'], ['dormir', '🌙 Prepararte para dormir'], ['revision', '📝 Cierre del domingo'], ['peso', '⚖️ Pesarte'], ['medidas', '📏 Medidas (domingo)']];

// Lo propio de cada usuario: cómo saludarlo y desde cuándo cuentan las semanas del gym
function Perfil({ c }: { c: Fin }) {
  return (
    <TarjetaPlegable vista={VISTA} clave="👤 Perfil" titulo="👤 Perfil">
      <Box sx={DOS}>
        <Campo etiqueta="Tu nombre (para el saludo)" data-cambio="conf-nombre" defaultValue={c.nombre || ''} autoComplete="given-name" />
        <Campo etiqueta="Semana 1 del gym empieza" type="date" data-cambio="conf-semana1" defaultValue={c.semana1} />
      </Box>
      <Nota>Las semanas van de lunes a domingo: la semana 1 es la del {fechaLarga(c.semana1)} y hoy vas en la semana {semanaActual()}. Si la cambias, los registros siguen con su número de semana.</Nota>
      <Nota>El orden del menú, las tarjetas de Hoy y las metas se cambian en <Link href="#editar/pantallas" sx={{ color: 'primary.main' }}>✏️ Editar → Pantallas</Link>.</Nota>
    </TarjetaPlegable>
  );
}

// Copias que guarda la nube (una cada 10 minutos de uso y antes de cualquier subida que quite datos)
function Copias() {
  const copias = A.copias() as Fin[] | null;
  return (
    <>
      <Subtitulo>🕘 Copias en la nube</Subtitulo>
      <Nota>La nube guarda versiones anteriores de tus datos. Si algo se borra, vuelve a una de ellas.</Nota>
      {copias ? (copias.length ? (
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: '4px' }}>
          {copias.slice(0, 30).map((x) => (
            <Box component="li" key={x.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', py: '6px', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box component="span" sx={{ flex: '1 1 12em', minWidth: 0 }}>{A.fechaCopia(x.guardado)} · {x.dias} días · {x.registros} registros gym</Box>
              <Button color="secondary" data-accion="nube-restaurar" data-id={x.id}>Restaurar</Button>
            </Box>
          ))}
        </Box>
      ) : <Nota>Aún no hay copias.</Nota>) : null}
      <Botones><Button color="secondary" data-accion="nube-copias" disabled={A.cargandoCopias()}>{copias ? '↻ Actualizar copias' : 'Ver copias'}</Button></Botones>
    </>
  );
}

function Huella() {
  if (huellaActiva()) {
    return (
      <>
        <Subtitulo>🔒 Bloqueo con huella</Subtitulo>
        <Nota>Activo en este equipo: al abrir la app, o al volver después de 5 minutos, se pide tu huella, tu cara o el PIN del celular.</Nota>
        <Botones><Button color="secondary" data-accion="huella-quitar">Quitar bloqueo</Button></Botones>
      </>
    );
  }
  if (!B.disponible) return null;
  return (
    <>
      <Subtitulo>🔒 Bloqueo con huella</Subtitulo>
      <Nota>La sesión sigue recordada, pero para abrir la app se pide tu huella, tu cara o el PIN del celular. Se activa en cada equipo.</Nota>
      <Botones><Button data-accion="huella-activar">Activar en este equipo</Button></Botones>
    </>
  );
}

function Nube() {
  if (!configurada || !N.usuario) return null;
  return (
    <TarjetaPlegable vista={VISTA} clave="☁️ Nube" titulo="☁️ Nube">
      <Parrafo>{N.usuario.correo}</Parrafo>
      <Box component="p" sx={{ fontSize: 13, color: COLOR_NUBE[N.estado] || 'text.secondary', my: '6px' }}>{textoNube()}{N.ultima ? ' · ' + hora(N.ultima) : ''}</Box>
      {N.error ? <Aviso>{N.error}</Aviso> : null}
      {N.proteccion ? (
        <>
          <Nota>Lo de este equipo tiene muchos menos datos que la nube. Si no los borraste a propósito, quédate con lo de la nube.</Nota>
          <Botones><Button data-accion="nube-usar">⬇ Usar lo de la nube</Button></Botones>
        </>
      ) : null}
      <Botones>
        <Button color="secondary" data-accion="nube-sync">↻ Sincronizar ahora</Button>
        <Button color="secondary" data-accion="nube-salir">Salir</Button>
      </Botones>
      <Copias />
      <Huella />
    </TarjetaPlegable>
  );
}

// 🎨 Cómo se ve: tema y letra (de este equipo, src/apariencia.js), la barra de abajo del celular y dónde esconder secciones
const Opcion = ({ activa, children, ...datos }: { activa: boolean; children: ReactNode; [k: string]: unknown }) => (
  <Chip clickable label={children} aria-pressed={activa} color={activa ? 'primary' : 'default'} variant={activa ? 'filled' : 'outlined'} {...datos} />
);
const Opciones = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', mb: '10px' }}>{children}</Box>;
function ComoSeVe() {
  const ap = leerApariencia(), d = datosLateral() as Fin;
  const enBarra = new Set(((d && d.abajo) || []).map((x: Fin) => x.k));
  return (
    <TarjetaPlegable vista={VISTA} clave="🎨 Cómo se ve" titulo="🎨 Cómo se ve">
      <Subtitulo>Colores</Subtitulo>
      <Opciones>{TEMAS.map(([k, t]) => <Opcion key={k} activa={ap.tema === k} data-accion="apariencia-tema" data-v={k} data-t="tema">{t}</Opcion>)}</Opciones>
      <Subtitulo>Tamaño de la letra</Subtitulo>
      <Opciones>{LETRAS.map(([k, t]) => <Opcion key={k} activa={ap.letra === k} data-accion="apariencia-letra" data-v={String(k)} data-t="letra">{t}</Opcion>)}</Opciones>
      <Nota>Colores y letra son de este equipo: el celular y el computador pueden ir distinto.</Nota>
      {d ? <>
        <Subtitulo>📱 Barra de abajo (celular)</Subtitulo>
        <Interruptor marcado={!d.sinAbajo} datos={{ 'data-cambio': 'barra-abajo' }}>Secciones abajo, al alcance del pulgar, con «☰ Más» para el resto</Interruptor>
        {!d.sinAbajo ? <>
          <Nota>Elige hasta {MAX_ABAJO} ({enBarra.size} de {MAX_ABAJO}). Si ya hay {MAX_ABAJO}, la nueva entra en lugar de la última.</Nota>
          <Opciones>
            {(d.abajoOpciones as Fin[]).map((x) => <Opcion key={x.k} activa={enBarra.has(x.k)} data-accion="barra-abajo-id" data-id={x.k} data-t="abajo-opcion">{x.icono} {x.nombre}</Opcion>)}
          </Opciones>
          <Botones><Button color="secondary" size="small" data-accion="barra-abajo-restablecer">↺ Las de siempre</Button></Botones>
        </> : null}
      </> : null}
      <Nota><Link href="#editar/pantallas" sx={{ color: 'primary.main' }}>🧩 Esconder u ordenar las secciones del menú y las tarjetas de Hoy</Link></Nota>
    </TarjetaPlegable>
  );
}

function AvisosDelDia({ c }: { c: Fin }) {
  const av = c.avisos || {}, horas = { ...HORAS_AVISOS, ...(av.horas || {}) } as Record<string, string>, apagados = av.apagados || {};
  const hoy = avisosDelDia(c) as Fin[], sups = avisosDeSuplementos() as Fin[];
  return (
    <TarjetaPlegable vista={VISTA} clave="🔔 Avisos del día" titulo="🔔 Avisos del día">
      <Nota>Para que te avise siempre, aunque la app esté cerrada, agrega los avisos al calendario del celular. Los avisos de la app solo llegan con la app abierta o recién cerrada (también el fin del descanso del gym).</Nota>
      <Box sx={{ ...DOS, mb: '6px' }}>
        {ETIQUETAS_HORA.map(([k, t]) => <Campo key={k} etiqueta={t} type="time" data-cambio="aviso-hora" data-k={k} defaultValue={horas[k]} />)}
      </Box>
      {Object.entries(AVISOS as Record<string, Fin>).map(([id, a]) => (
        <Interruptor key={id} marcado={!apagados[id]} datos={{ 'data-cambio': 'aviso-activo', 'data-id': id }}>{a.icono} {a.nombre}</Interruptor>
      ))}
      <Nota>Hoy: {hoy.length ? hoy.map((a) => a.hora + ' ' + a.icono).join(' · ') : 'ningún aviso'}</Nota>
      {sups.length ? <Nota>💊 Suplementos en el calendario: {sups.map((a) => a.hora + ' ' + a.nombre).join(' · ')} (cámbialos en <Link href="#suplementos" sx={{ color: 'primary.main' }}>💊 Suplementos</Link>).</Nota> : null}
      <Botones>
        <Button data-accion="aviso-calendario">📅 Agregar al calendario</Button>
        {soportados() ? (avisosActivos()
          ? <Button color="secondary" data-accion="aviso-desactivar">🔕 Quitar avisos de la app</Button>
          : <Button color="secondary" data-accion="aviso-activar">🔔 Activar avisos de la app</Button>) : null}
      </Botones>
      <Nota>Si cambias una hora, vuelve a agregar el calendario (el nuevo reemplaza al anterior en la mayoría de calendarios; si queda repetido, borra el viejo).</Nota>
    </TarjetaPlegable>
  );
}

// 🖼️ Google Drive: el Apps Script de apps_script/Imagenes.gs guarda las imágenes en tu Drive (src/imagenes-equipo.js).
// En pasos: la app crea la clave y da el script con ella puesta, arregla la dirección si pegan el ID y explica cada error
const Paso = ({ n, listo, titulo, children }: { n: number; listo: boolean; titulo: ReactNode; children?: ReactNode }) => (
  <Box component="li" data-t={'drive-paso-' + n} sx={{ display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr)', gap: '10px', p: '10px 0', borderTop: n > 1 ? '1px solid' : 0, borderColor: 'divider' }}>
    <Box component="span" aria-label={listo ? 'Listo' : 'Paso ' + n} sx={{ width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14, bgcolor: listo ? 'primary.main' : tokens.surface2, color: listo ? 'primary.contrastText' : 'text.primary' }}>{listo ? '✓' : n}</Box>
    <Box sx={{ minWidth: 0, display: 'grid', gap: '8px' }}><Box component="b" sx={{ fontSize: 15 }}>{titulo}</Box>{children}</Box>
  </Box>
);
async function copiar(texto: string, aviso: string) {
  try { await navigator.clipboard.writeText(texto); toast('📋 ' + aviso); }
  catch (err) { const t = document.createElement('textarea'); t.value = texto; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); toast('📋 ' + aviso); }
}
function Drive({ c }: { c: Fin }) {
  const d = c.drive || {}, D = drive as Fin, [fallo, ponerFallo] = useState(''), [probando, ponerProbando] = useState(false);
  const cfg = () => (e().config.drive ??= {});
  const poner = (k: string, v: string) => { const x = cfg(), val = k === 'url' ? urlDrive(v) : v.trim(); if ((x[k] || '') === val) return; x[k] = val; delete x.probada; ponerFallo(''); guardar(); };
  const crearClave = () => { cfg().clave = claveNueva(); delete cfg().probada; ponerFallo(''); guardar(); };
  const probar = async () => {
    ponerProbando(true); ponerFallo('');
    try { await probarDrive(); cfg().probada = Date.now(); guardar(); toast('☁️ Drive conectado'); sincronizar({ traer: true }); }
    catch (err: any) { ponerFallo(explicarError(err && err.message || err)); }
    finally { ponerProbando(false); }
  };
  const problema = problemaDrive({ url: d.url || '', clave: d.clave || '' }) as string;
  const claveBuena = !!d.clave && d.clave !== idDeUrl(d.url), urlBuena = !!d.url && !/dirección/.test(problema);
  return (
    <TarjetaPlegable vista={VISTA} clave="🖼️ Google Drive" titulo={'🖼️ Google Drive' + (d.probada ? ' ✓' : '')}>
      <Nota>Las imágenes de <Link href="#imagenes" sx={{ color: 'primary.main' }}>🖼️ Imágenes</Link> se guardan en tu Drive, en la carpeta «Rutina · Imágenes» (una subcarpeta por álbum). Quedan privadas: solo tú las ves. Se hace una sola vez.</Nota>
      <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        <Paso n={1} listo={claveBuena} titulo="Tu clave y el script">
          {claveBuena ? <Box component="code" data-t="drive-clave-ver" sx={{ fontSize: 13, wordBreak: 'break-all', bgcolor: 'background.default', p: '6px 8px', borderRadius: '8px' }}>{d.clave}</Box>
            : <Nota sx={{ m: 0 }}>{d.clave ? '⚠️ Esa no sirve como clave (es el ID de implementación). ' : ''}La app crea una clave al azar y te da el script con ella ya puesta.</Nota>}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {claveBuena
              ? <Button data-t="drive-copiar-script" onClick={() => copiar(scriptConClave(SCRIPT_DRIVE, d.clave), 'Script copiado con tu clave: pégalo en script.google.com')}>📋 Copiar el script</Button>
              : <Button data-t="drive-crear-clave" onClick={crearClave}>🎲 Crear mi clave</Button>}
            {claveBuena ? <Button size="small" color="secondary" onClick={crearClave}>Otra clave</Button> : null}
          </Box>
        </Paso>
        <Paso n={2} listo={urlBuena} titulo="Pégalo en Google e impleméntalo">
          <Box component="ol" sx={{ m: 0, pl: '20px', fontSize: 14, color: 'text.secondary', display: 'grid', gap: '4px' }}>
            <li>Abre <Link href="https://script.google.com/home/start" target="_blank" rel="noopener" sx={{ color: 'primary.main' }}>script.google.com ↗</Link> → tu proyecto (o Nuevo proyecto). Borra todo, pega el script y guarda (💾).</li>
            <li><b>Implementar → Nueva implementación</b> → tipo <b>Aplicación web</b> · Ejecutar como: <b>yo</b> · Quién tiene acceso: <b>Cualquier usuario</b> → Implementar, y autoriza el acceso a Drive.</li>
            <li>Si ya lo habías implementado: <b>Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar</b>. La dirección no cambia.</li>
          </Box>
        </Paso>
        <Paso n={3} listo={urlBuena} titulo="La dirección de la aplicación web">
          <Campo key={'u' + (d.url || '')} etiqueta="La URL que te da Google (termina en /exec)" type="url" defaultValue={d.url || ''} placeholder="https://script.google.com/macros/s/…/exec" onBlur={(ev) => { poner('url', ev.target.value); ev.target.value = urlDrive(ev.target.value); }} data-t="drive-url" />
          {d.url && !urlBuena ? <Aviso>{problema}</Aviso> : null}
        </Paso>
        <Paso n={4} listo={!!d.probada} titulo="Probar">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <Button data-t="drive-probar" onClick={probar} disabled={!!problema || probando}>{probando ? 'Probando…' : '☁️ Probar conexión'}</Button>
            {d.probada && D.enlace ? <Link href={D.enlace} target="_blank" rel="noopener" sx={{ color: 'primary.main' }}>Abrir la carpeta ↗</Link> : null}
          </Box>
          {problema && urlBuena ? <Nota sx={{ m: 0 }}>{problema}</Nota> : null}
          {fallo ? <Aviso alerta>{fallo}</Aviso> : d.probada ? <Nota sx={{ m: 0 }}>✓ Conectado. Lo que agregues en 🖼️ Imágenes sube solo a tu Drive.</Nota> : null}
        </Paso>
      </Box>
      <Desplegable titulo="Clave a mano (si ya tienes una en el script)">
        <Campo key={'c' + (d.clave || '')} etiqueta="Lo que va en const CLAVE dentro del script" defaultValue={d.clave || ''} onBlur={(ev) => poner('clave', ev.target.value)} data-t="drive-clave" />
      </Desplegable>
    </TarjetaPlegable>
  );
}

function Hoja({ c }: { c: Fin }) {
  const h = c.hoja || {}, lista = hojaLista();
  return (
    <TarjetaPlegable vista={VISTA} clave="📗 Google Sheets" titulo="📗 Google Sheets">
      <Nota>Escribe el gym en la pestaña "Rutina 2.0" (columna de cada semana) y los días en "Diario App". Instala antes el Apps Script de la carpeta apps_script (ver README).</Nota>
      <Box sx={{ display: 'grid', gap: '10px', mb: '4px' }}>
        <Campo etiqueta="Dirección de la aplicación web" type="url" data-cambio="conf-hoja" data-k="url" defaultValue={h.url || ''} placeholder="https://script.google.com/macros/s/…/exec" />
        <Campo etiqueta="Clave (la misma de CLAVE en el script)" data-cambio="conf-hoja" data-k="clave" defaultValue={h.clave || ''} />
      </Box>
      <Interruptor marcado={h.auto !== false} datos={{ 'data-cambio': 'conf-hoja-auto' }}>Enviar sola la semana actual un minuto después de cada cambio</Interruptor>
      {H.mensaje ? (H.estado === 'error' ? <Aviso>{H.mensaje}</Aviso>
        : <Nota>{H.ultima && H.estado === 'ok' ? hora(H.ultima) + ' · ' : ''}{H.mensaje}</Nota>) : null}
      <Botones>
        <Button data-accion="hoja-enviar" disabled={!lista}>📤 Enviar semana actual</Button>
        <Button color="secondary" data-accion="hoja-todas" disabled={!lista}>Enviar todas</Button>
      </Botones>
    </TarjetaPlegable>
  );
}

export default function Ajustes() {
  const c = usarEstado().config as Fin;
  return (
    <>
      <TituloPantalla>Ajustes</TituloPantalla>
      <Perfil c={c} />
      <ComoSeVe />
      <Nube />
      <AvisosDelDia c={c} />
      <Hoja c={c} />
      <Drive c={c} />
      <TarjetaPlegable vista={VISTA} clave="Metas diarias" titulo="Metas diarias">
        <Box sx={DOS}>
          {ETIQUETAS.map(([k, t]) => <Campo key={k} etiqueta={t} {...numero} min={0} data-cambio="conf-meta" data-k={k} defaultValue={c.metas[k]} />)}
          {/* Lo guarda la acción de 🎓 Estudiar (vistas/estudiar.js) */}
          <Campo etiqueta="🎓 Estudio al día (min)" {...numero} min={5} max={240} step={5} data-cambio="estudio-minutos" defaultValue={c.estudio.minutos} />
        </Box>
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="Pastilla → desayuno" titulo="Pastilla → desayuno">
        <Nota>Ajústalo a lo que indique tu médico.</Nota>
        <Box sx={DOS}>
          <Campo etiqueta="Mínimo (min)" {...numero} min={0} data-cambio="conf-espera" data-k="minimo" defaultValue={c.espera.minimo} />
          <Campo etiqueta="Ideal (min)" {...numero} min={0} data-cambio="conf-espera" data-k="ideal" defaultValue={c.espera.ideal} />
        </Box>
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="Avisos" titulo="Avisos">
        <Interruptor marcado={!!c.sonido} datos={{ 'data-cambio': 'conf-sonido' }}>Sonido al terminar descansos y cambios de lado (la vibración siempre está activa)</Interruptor>
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="Copia de seguridad" titulo="Copia de seguridad">
        <Nota>Todo se guarda en este celular. Exporta una copia de vez en cuando o para pasarla a otro equipo.</Nota>
        {almacen.permanente === true ? <Nota data-t="permanente">🛡️ Guardado permanente: este navegador no borrará los datos de la app aunque le falte espacio.</Nota>
          : almacen.permanente === false ? <Nota data-t="permanente">⚠️ Este navegador podría borrar los datos de la app si le falta espacio (el iPhone, si no la abres en 7 días). Instálala en la pantalla de inicio para que queden fijos, y deja la nube activa.</Nota> : null}
        <Botones>
          <Button data-accion="exportar">⬇ Exportar (JSON)</Button>
          <Button component="label" color="secondary">⬆ Importar<input type="file" accept="application/json,.json" data-cambio="importar" hidden /></Button>
        </Botones>
        <Subtitulo>Exportar a Excel / Sheets (CSV)</Subtitulo>
        <Botones>
          <Button color="secondary" data-accion="csv" data-que="gym">🏋️ Gym por semana</Button>
          <Button color="secondary" data-accion="csv" data-que="dias">☀️ Hábitos y metas por día</Button>
        </Botones>
      </TarjetaPlegable>
      <TarjetaPlegable vista={VISTA} clave="Empezar de cero" titulo="Empezar de cero">
        <Botones><Button data-accion="reiniciar" sx={{ bgcolor: tokens.rojoFondo, color: tokens.peligroInk, '&:hover': { bgcolor: tokens.rojoFondo } }}>Borrar todos los datos</Button></Botones>
      </TarjetaPlegable>
    </>
  );
}
