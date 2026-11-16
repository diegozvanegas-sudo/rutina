// Sin sesión no se ve la app: solo Entrar (correo y contraseña) o, con la huella activa, el candado. Al lado (computador)
// o debajo (celular) va la presentación de la app para quien llega por primera vez. Las reglas son las de
// vistas/ajustes.js: nube-entrar lee los campos por id (nube-correo, nube-clave); huella-abrir y huella-contrasena.
// La presentación (Presentacion.tsx) pone el formulario después del titular; aquí está la cuadrícula de la página.
import type { ReactNode } from 'react';
import { Box, Button, Card } from '@mui/material';
import { nube } from '../../nube.js';
import { bloqueo } from '../../bloqueo.js';
import { modoSesion, datosSesion } from '../armazon.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { Campo } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import Presentacion from './Presentacion';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const N = nube as Fin, B = bloqueo as Fin;
const Aviso = ({ alerta = false, children }: { alerta?: boolean; children: ReactNode }) => (
  <Box component="p" role={alerta ? 'alert' : undefined} sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, m: 0 }}>{children}</Box>
);
// El formulario con un borde que brilla, para que se vea dónde entrar
const TARJETA = { display: 'grid', gap: '12px', width: '100%', borderColor: 'primary.main', boxShadow: `0 0 0 1px ${tokens.prBordeVerde}, 0 18px 40px ${tokens.prSombra}`, '& h2': { m: 0, fontSize: 22 } };
// Celular: una columna (titular, formulario, lo demás). Desde 900 px: la presentación a la izquierda y el formulario fijo
// a la derecha. Desde 1200 px: 12 columnas; cada parte de la presentación dice cuáles ocupa
const PAGINA = {
  display: 'grid', gap: '18px', maxWidth: 1120, m: '0 auto', p: '12px 0 40px', overflowX: 'clip',
  '@media (min-width: 900px)': { gridTemplateColumns: 'minmax(0, 1fr) 380px', alignItems: 'start', gap: '32px', pt: '32px' },
  '@media (min-width: 900px) and (max-width: 1199px)': { '& > *': { gridColumn: 1 }, '& > [data-formulario]': { gridColumn: 2, gridRow: '1 / span 9', position: 'sticky', top: 24 } },
  '@media (min-width: 1200px)': { maxWidth: 'min(1560px, 94vw)', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: '28px', pt: '40px',
    '& > [data-formulario]': { gridColumn: '9 / 13', gridRow: 1, alignSelf: 'center' } },
};
const GRANDE = { minHeight: 56, fontSize: 17, width: '100%' };
// El navegador que abre los enlaces dentro de WhatsApp, Instagram o Facebook: ahí la huella no funciona
const navegadorDeApp = () => typeof navigator !== 'undefined' && /WhatsApp|FBAN|FBAV|Instagram|Line\//i.test(navigator.userAgent || '');

function Entrar() {
  return (
    <Card component="section" data-formulario="" aria-labelledby="entrar-titulo" sx={TARJETA}>
      <h2 id="entrar-titulo">Entrar</h2>
      <Nota sx={{ m: 0 }}>Entra con tu usuario. Tus datos se guardan en la nube y pasan a otro celular o al computador.</Nota>
      <Campo etiqueta="Correo" id="nube-correo" type="email" autoComplete="username" inputMode="email" />
      <Campo etiqueta="Contraseña" id="nube-clave" type="password" autoComplete="current-password" />
      {N.estado === 'sin-sesion' && !navigator.onLine ? <Aviso>Sin conexión: conéctate para iniciar sesión.</Aviso> : null}
      {N.rechazo ? <Aviso alerta>🔒 {N.rechazo}</Aviso> : null}
      <Button data-accion="nube-entrar" sx={{ ...GRANDE, mt: '8px' }}>Entrar</Button>
      <Nota sx={{ m: 0 }}>¿No tienes usuario? Pídeselo a tu entrenador.</Nota>
    </Card>
  );
}

function Candado({ correo }: { correo: string }) {
  return (
    <Card component="section" data-formulario="" sx={TARJETA}>
      <h2>🔒 Desbloquear</h2>
      <Nota sx={{ m: 0 }}>{correo}</Nota>
      <Nota sx={{ m: 0 }}>Desbloquea con tu huella, tu cara o el PIN del celular.</Nota>
      {B.error ? <Aviso>{B.error}</Aviso> : null}
      {B.error || navegadorDeApp() ? <Nota sx={{ m: 0 }}>Si abriste el enlace desde WhatsApp u otra app, la huella puede no funcionar ahí: ábrelo en Safari o Chrome (menú ⋯ → Abrir en el navegador) o entra con tu contraseña.</Nota> : null}
      <Button data-accion="huella-abrir" disabled={!!B.intentando} sx={{ ...GRANDE, mt: '8px' }}>🔓 Desbloquear</Button>
      <Button color="secondary" data-accion="huella-contrasena" sx={{ width: '100%' }}>Entrar con contraseña</Button>
    </Card>
  );
}

export default function Sesion() {
  usarEstado();
  const modo = modoSesion(), d = datosSesion() as Fin;
  // Aún no se sabe si hay sesión guardada (Supabase la lee un instante después de abrir)
  if (modo === 'entrar' && !N.lista) return <Box component="section" sx={{ maxWidth: 420, m: '12vh auto 0' }}><Nota>Cargando…</Nota></Box>;
  if (!modo) return null;
  return (
    <Box sx={PAGINA}>
      <Presentacion formulario={modo === 'bloqueada' ? <Candado correo={d.correo} /> : <Entrar />} />
    </Box>
  );
}
