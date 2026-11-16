// 🧑‍🏫 Mi entrenador (lado del cliente): unirse con el código, usar el plan que publica, mandarle el check-in y
// compartirle el avance. React pinta; las reglas son las de src/vistas/entrenador.js (ent-…): "Unirme" y el check-in
// leen sus campos por id (ent-codigo, mck-*) y los botones llevan data-accion. La carga desde la nube sigue allá.
import { useState, type ReactNode } from 'react';
import { Box, Button, Card, Link } from '@mui/material';
import { iso, fechaCorta } from '../../fechas.js';
import { configurada, nube } from '../../nube.js';
import { planNuevo } from '../../coach.js';
import { semanaDeCiclo, OBJETIVOS_CLIENTE, PREGUNTAS_CHECKIN } from '../../clientes.js';
import { piezasEntrenador } from '../../vistas/entrenador.js';
import { tokens } from '../tema';
import { accion } from '../acciones';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoSolo, DOS } from '../ui/Campo';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'entrenador';
const P = piezasEntrenador as Fin;
const N = nube as Fin;
const OBJ = OBJETIVOS_CLIENTE as Record<string, (string | number)[]>;
const cuantos = (n: number, uno: string, varios: string) => n + ' ' + (n === 1 ? uno : varios);
const fecha = (ms: unknown) => (ms ? fechaCorta(iso(new Date(Number(ms)))) : '');
const Aviso = ({ children }: { children: ReactNode }) => (
  <Box sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, my: '8px' }}>{children}</Box>
);
const Botones = ({ children }: { children: ReactNode }) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px', my: '8px' }}>{children}</Box>;

function Unirse() {
  return (
    <TarjetaPlegable vista={VISTA} clave="🔑 Unirme a mi entrenador" titulo="🔑 Unirme a mi entrenador">
      <Nota>Escribe el código que te mandó tu entrenador. Desde ese momento recibes su plan aquí y él ve un resumen de tu avance: series por semana, peso, sueño, fuerza y tus check-ins. El administrador de la app también puede verlo. <b>Nadie ve el resto de tus datos.</b> Puedes dejar de compartir cuando quieras.</Nota>
      {!configurada ? <Aviso>Esta versión de la app no tiene la nube configurada.</Aviso> : !N.usuario ? <Aviso>Inicia sesión primero (⚙️ Ajustes).</Aviso> : null}
      <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <CampoSolo id="ent-codigo" aria-label="Código del entrenador" noVaciar defaultValue={P.codigoLink()} placeholder="Ej.: F9110E" maxLength={10} autoCapitalize="characters" data-enter="ent-unirme" enterKeyHint="go" />
        <Button data-accion="ent-unirme" disabled={!N.usuario} sx={{ flex: 'none' }}>Unirme</Button>
      </Box>
    </TarjetaPlegable>
  );
}

function Plan({ e, a }: { e: Fin; a: Fin }) {
  const p = a.plan, m = P.mi(), nuevo = planNuevo(e, a), usado = (m.aplicado || {})[a.id], w = p && p.ciclo ? (semanaDeCiclo(p.ciclo) as Fin) : null, o = p && OBJ[p.objetivo];
  return (
    <TarjetaPlegable vista={VISTA} clave={'🧑‍🏫 ' + (a.entrenador || 'Tu entrenador')} titulo={'🧑‍🏫 ' + (a.entrenador || 'Tu entrenador')}>
      <Nota>Desde el {a.aceptado ? fechaCorta(String(a.aceptado).slice(0, 10)) : ''}{o ? ' · ' + o[0] : ''}</Nota>
      {!p ? <Nota>Aún no te ha mandado el plan. Te aparece aquí apenas lo publique.</Nota> : (
        <>
          {nuevo ? (
            <>
              <Aviso>📬 {usado ? 'Te mandó una versión nueva del plan' : 'Te mandó tu plan'} ({fecha(a.plan_version)}): {cuantos((p.rutina as Fin[]).filter((d) => d.id !== 'core' && d.ejercicios.length).length, 'día', 'días')} de gym · {cuantos(Object.keys((p.dieta && p.dieta.planes) || {}).length, 'plan', 'planes')} de comida.</Aviso>
              <Button fullWidth data-accion="ent-usar" data-id={a.id}>✓ Usar este plan</Button>
              <Nota>Reemplaza tu rutina del Gym y tus planes de comida (tu core se queda). Lo de ahora queda guardado para volver.</Nota>
            </>
          ) : <Parrafo>✓ Estás usando su plan del <b>{fecha(a.plan_version)}</b>. Míralo en 🏋️ Gym y 🥗 Dieta.</Parrafo>}
          {w && w.n ? <Nota>📆 Semana <b>{w.n}</b> del ciclo · fase <b>{w.fase.nombre}</b> (reps en reserva {w.fase.rir}): {w.fase.objetivo}</Nota>
            : w && w.antes ? <Nota>📆 Tu ciclo empieza el {fechaCorta(p.ciclo.inicio)}.</Nota> : null}
          {p.nota ? <Nota>📝 {p.nota}</Nota> : null}
        </>
      )}
      {m.antes ? <Link component="button" type="button" data-accion="ent-volver" sx={{ color: 'primary.main', textAlign: 'left', font: 'inherit', fontSize: 15, minHeight: 40 }}>↶ Volver a mi rutina y mis comidas de antes ({fechaCorta(m.antes.fecha)})</Link> : null}
    </TarjetaPlegable>
  );
}

// Lo escrito se queda en los campos después de mandarlo (como antes)
function Checkin() {
  const m = P.mi(), ult = (m.checkins || []).slice(-1)[0];
  const num = (id: string, titulo: string, ph: string, modo: 'decimal' | 'numeric' = 'decimal') => (
    <Campo id={id} etiqueta={titulo} inputMode={modo} placeholder={ph} enterKeyHint="next" />
  );
  return (
    <TarjetaPlegable vista={VISTA} clave="✅ Check-in de la semana" titulo="✅ Check-in de la semana">
      {ult ? <Nota>El último lo mandaste el {fechaCorta(ult.fecha)}.</Nota> : null}
      <Box sx={{ ...DOS, mb: '10px' }}>
        {num('mck-peso', 'Peso en ayunas (kg)', 'Ej.: 72,5')}{num('mck-sueno', 'Sueño (1-5)', '1 a 5', 'numeric')}{num('mck-energia', 'Energía (1-5)', '1 a 5', 'numeric')}
        {num('mck-entreno', 'Entrenos hechos', 'Ej.: 4', 'numeric')}{num('mck-comida', 'Plan de comida (%)', 'Ej.: 80', 'numeric')}
      </Box>
      <Campo id="mck-nota" etiqueta={(PREGUNTAS_CHECKIN as [string, string][])[5][1].replace(/^📝 /, '')} data-enter="ent-checkin" enterKeyHint="send" />
      <Button fullWidth data-accion="ent-checkin" sx={{ mt: '12px' }}>📤 Mandar check-in</Button>
    </TarjetaPlegable>
  );
}

export default function Entrenador({ pestana }: { pestana?: string }) {
  const e = usarEstado() as Fin, m = P.mi();
  // Enlace con el código (#entrenador/F9110E): queda escrito en el campo
  useState(() => { if (pestana) accion('abrir-entrenador', { p: pestana }); return 0; });
  if (!m.lista.length) return <><TituloPantalla>Mi entrenador</TituloPantalla><Unirse /></>;
  return (
    <>
      <TituloPantalla>Mi entrenador</TituloPantalla>
      {(m.lista as Fin[]).map((a) => <Plan key={a.id} e={e} a={a} />)}
      <Checkin />
      <TarjetaPlegable vista={VISTA} clave="🔄 Lo que compartes" titulo="🔄 Lo que compartes">
        <Nota>Series por semana, peso, sueño promedio, cómo va tu fuerza y tus check-ins, con tu entrenador (y el administrador de la app). Se manda solo cada vez que abres la app{m.compartido ? ' (la última: ' + fechaCorta(iso(new Date(m.compartido))) + ')' : ''}.</Nota>
        <Botones>
          <Button color="secondary" data-accion="ent-compartir">🔄 Compartir ahora</Button>
          {(m.lista as Fin[]).map((a) => (
            <Button key={a.id} color="secondary" data-accion="ent-salir" data-id={a.id}>Dejar de compartir con {(a.entrenador || '').split('@')[0]}</Button>
          ))}
        </Botones>
      </TarjetaPlegable>
      <Unirse />
    </>
  );
}
