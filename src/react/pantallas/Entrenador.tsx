// 🧑‍🏫 Mi entrenador (lado del cliente): unirse con el código, usar el plan que publica, mandarle el check-in y
// compartirle el avance. React pinta; las reglas son las de src/vistas/entrenador.js (ent-…): "Unirme" y el check-in
// leen sus campos por id (ent-codigo, mck-*) y los botones llevan data-accion. La carga desde la nube sigue allá.
import { useState, type ReactNode } from 'react';
import { Box, Button, Card, Link } from '@mui/material';
import { iso, fechaCorta } from '../../fechas.js';
import { configurada, nube } from '../../nube.js';
import { planNuevo, marcaDeMiEntrenador } from '../../coach.js';
import { semanaDeCiclo, OBJETIVOS_CLIENTE, PREGUNTAS_CHECKIN, comparacionValoraciones, MEDIDAS, PRUEBAS_CLIENTE } from '../../clientes.js';
import { pesos } from '../../finanzas.js';
import { MarcaCabecera } from '../ui/Marca';
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
    <TarjetaPlegable vista={VISTA} clave={'🧑‍🏫 ' + (a.entrenador || 'Tu entrenador')} titulo={'🧑‍🏫 ' + ((p && p.marca && p.marca.negocio ? String(p.marca.negocio).slice(0, 40) : '') || a.entrenador || 'Tu entrenador')}>
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

// 🎨 Arriba: la marca de su entrenador (si la puso)
function Cabecera({ e }: { e: Fin }) {
  const m = marcaDeMiEntrenador(e) as Fin;
  if (!m || (!m.negocio && !m.logo)) return null;
  return (
    <Card component="section" sx={{ mb: '14px', borderLeft: '5px solid', borderLeftColor: m.color || tokens.brand }}>
      <MarcaCabecera marca={m} sub={'Tu entrenador · ' + (m.correo || '')} />
    </Card>
  );
}
const PERIODO: Record<string, string> = { mes: 'al mes', quincena: 'cada quincena', semana: 'a la semana', unico: 'pago único' };
const COBRO: Record<string, [string, string, string]> = {
  'al-dia': ['✓ Al día', tokens.brandSoft, tokens.brand], pronto: ['⏳ Te toca pronto', tokens.amarilloFondo, tokens.amarillo],
  vencido: ['⚠️ Pendiente', tokens.rojoFondo, tokens.rojoSuave], pausa: ['⏸ En pausa', tokens.surface2, tokens.muted],
};
// 💳 Lo que tu entrenador anotó de tus pagos (al día con la última vez que te publicó el plan o anotó un pago)
function MisPagos({ lista }: { lista: Fin[] }) {
  const con = lista.filter((a) => a.plan && a.plan.pagos);
  if (!con.length) return null;
  return (
    <TarjetaPlegable vista={VISTA} clave="💳 Mis pagos" titulo="💳 Mis pagos">
      {con.map((a) => {
        const p = a.plan.pagos, [texto, fondo, tinta] = COBRO[p.estado] || COBRO.pausa;
        return (
          <Box key={a.id} data-t="mis-pagos" sx={{ display: 'grid', gap: '6px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span><b>{pesos(p.precio)}</b> {PERIODO[p.cada] || ''}</span>
              <Box component="span" sx={{ fontSize: 13, fontWeight: 800, p: '2px 10px', borderRadius: 999, bgcolor: fondo, color: tinta }}>{texto}</Box>
            </Box>
            {p.proximo && p.estado !== 'pausa' ? <Nota sx={{ m: 0 }}>{p.estado === 'vencido' ? 'Tocaba el ' : 'Próximo pago: '}<b>{fechaCorta(p.proximo)}</b></Nota> : null}
            {p.pagos && p.pagos.length ? (
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
                {(p.pagos as Fin[]).map((x) => <Box component="li" key={x.fecha} sx={{ display: 'flex', justifyContent: 'space-between', p: '6px 0', borderBottom: '1px solid', borderColor: 'divider', fontSize: 14 }}><span>{fechaCorta(x.fecha)}</span><b>{pesos(x.monto)}</b></Box>)}
              </Box>
            ) : null}
            <Nota sx={{ m: 0 }}>Lo anota tu entrenador{p.actualizado ? ' (al día al ' + fechaCorta(p.actualizado) + ')' : ''}. Si ya pagaste y no aparece, avísale.</Nota>
          </Box>
        );
      })}
    </TarjetaPlegable>
  );
}
// 📊 Las valoraciones que te hizo tu entrenador: la primera contra la última
function MisValoraciones({ lista }: { lista: Fin[] }) {
  const vals = lista.flatMap((a) => (a.plan && a.plan.valoraciones) || []) as Fin[];
  if (!vals.length) return null;
  const cambios = comparacionValoraciones(vals) as Fin[], ult = vals.slice().sort((a, b) => a.fecha.localeCompare(b.fecha)).pop();
  const nombres = Object.fromEntries([...(MEDIDAS as Fin[]), ...(PRUEBAS_CLIENTE as Fin[])].map(([k, n, u]) => [k, [n, u]]));
  return (
    <TarjetaPlegable vista={VISTA} clave="📊 Mis valoraciones" titulo="📊 Mis valoraciones">
      <Nota>{cuantos(vals.length, 'valoración', 'valoraciones')} · la última el <b>{fechaCorta(ult.fecha)}</b></Nota>
      {cambios.length ? (
        <Box data-t="mis-valoraciones" component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {cambios.map((x) => (
            <Box component="li" key={x.k} sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px', p: '6px 0', borderBottom: '1px solid', borderColor: 'divider', fontSize: 14 }}>
              <span>{x.nombre}</span>
              <span>{String(x.antes).replace('.', ',')} → <b>{String(x.ahora).replace('.', ',')} {x.u}</b> <Box component="small" sx={{ color: 'text.secondary' }}>({x.cambio > 0 ? '+' : ''}{String(x.cambio).replace('.', ',')})</Box></span>
            </Box>
          ))}
        </Box>
      ) : (
        <Box data-t="mis-valoraciones" component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {Object.entries(ult).filter(([k]) => nombres[k]).map(([k, v]) => <Box component="li" key={k} sx={{ display: 'flex', justifyContent: 'space-between', p: '6px 0', borderBottom: '1px solid', borderColor: 'divider', fontSize: 14 }}><span>{nombres[k][0]}</span><b>{String(v).replace('.', ',')} {nombres[k][1]}</b></Box>)}
        </Box>
      )}
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
      <Cabecera e={e} />
      {(m.lista as Fin[]).map((a) => <Plan key={a.id} e={e} a={a} />)}
      <MisPagos lista={m.lista} />
      <MisValoraciones lista={m.lista} />
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
