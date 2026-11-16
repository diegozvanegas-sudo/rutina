// ⚙️ Ajustes: perfil, nube (copias y huella), avisos del día, Google Sheets, metas, pastilla → desayuno, sonido,
// copia de seguridad y empezar de cero. React pinta; las reglas son las de src/vistas/ajustes.js: los campos y casillas
// llevan data-cambio y los botones data-accion (main.js los despacha igual que antes).
// pantallaEntrar y pantallaBloqueo (vistas/ajustes.js) son del armazón de la app y se quedan allá.
import type { ReactNode } from 'react';
import { Box, Button, Checkbox, Link } from '@mui/material';
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
const ETIQUETAS_HORA: [string, string][] = [['pastilla', '💊 Pastilla'], ['partido', '⚽ Hora del partido'], ['dormir', '🌙 Prepararte para dormir'], ['revision', '📝 Cierre del domingo']];

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
      <Nube />
      <AvisosDelDia c={c} />
      <Hoja c={c} />
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
