// Sin sesión no se ve la app: solo Entrar (correo y contraseña) o, con la huella activa, el candado. Al lado (computador)
// o debajo (celular) va la presentación de la app para quien llega por primera vez. Las reglas son las de
// vistas/ajustes.js: nube-entrar lee los campos por id (nube-correo, nube-clave); huella-abrir y huella-contrasena.
// Puente temporal: la presentación (vistas/presentacion.js) sigue en HTML con su CSS, y por eso la página y la tarjeta
// conservan sus clases entrar-pagina y entrar (de ellas cuelga la disposición junto a la presentación).
import type { ReactNode } from 'react';
import { Box, Button, Card } from '@mui/material';
import { nube } from '../../nube.js';
import { bloqueo } from '../../bloqueo.js';
import { presentacion } from '../../vistas/presentacion.js';
import { modoSesion, datosSesion } from '../armazon.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { Campo } from '../ui/Campo';
import { Nota } from '../ui/Textos';
import { HtmlViejo } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const N = nube as Fin, B = bloqueo as Fin;
const Aviso = ({ alerta = false, children }: { alerta?: boolean; children: ReactNode }) => (
  <Box component="p" role={alerta ? 'alert' : undefined} sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14, m: 0 }}>{children}</Box>
);
const TARJETA = { display: 'grid', gap: '12px', '& h2': { m: 0, fontSize: 22 } };
const GRANDE = { minHeight: 56, fontSize: 17, width: '100%' };
// El navegador que abre los enlaces dentro de WhatsApp, Instagram o Facebook: ahí la huella no funciona
const navegadorDeApp = () => typeof navigator !== 'undefined' && /WhatsApp|FBAN|FBAV|Instagram|Line\//i.test(navigator.userAgent || '');

function Entrar() {
  return (
    <Card component="section" className="entrar" aria-labelledby="entrar-titulo" sx={TARJETA}>
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
    <Card component="section" className="entrar" sx={TARJETA}>
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
    <div className="entrar-pagina">
      {modo === 'bloqueada' ? <Candado correo={d.correo} /> : <Entrar />}
      <HtmlViejo html={presentacion()} sx={{ display: 'contents' }} />
    </div>
  );
}
