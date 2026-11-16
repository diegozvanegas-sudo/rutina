// Recorrido de las pantallas sin sesión, con el gancho de desarrollo rutinaPrueba.sesion (sin Supabase): Entrar
// (cargando, el formulario con la presentación al lado, lo escrito sobrevive al repintar, faltan datos, sin conexión,
// cuenta sin acceso) y el candado de la huella (correo, error, intentando). No se prueba entrar de verdad ni la huella.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/entrar.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Entrar'), { paso, falla, tocarTexto } = a;
  const sesion = async (o) => { await p.ev(`window.rutinaPrueba.sesion(${JSON.stringify(o)})`); await a.dormir(700); };
  const sinMenu = () => p.ev(`document.body.classList.contains('sin-sesion') && !document.getElementById('lateral').checkVisibility()`);

  await p.computador();
  await p.ir('hoy');
  await a.esperar('#vista button');

  // Cargando (aún no se sabe si hay sesión guardada)
  await sesion({ modo: 'entrar', cargando: true });
  falla((await a.texto()).includes('Cargando'), 'no dice Cargando');
  falla(await sinMenu(), 'se ve el menú sin sesión');
  await paso('cargando');

  // El formulario con la presentación
  await sesion({ modo: 'entrar' });
  await a.esperar('#vista #nube-correo');
  falla((await p.ev('document.title')) === 'Entrar · Rutina', 'el título no es Entrar: ' + await p.ev('document.title'));
  await paso('entrar');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('entrar-pc');

  // Faltan datos
  await tocarTexto('Entrar', 'button');
  falla((await a.aviso()).includes('Escribe correo y contraseña'), 'no pidió correo y contraseña: ' + await a.aviso());

  // Lo escrito sobrevive al repintar (la app se repinta sola al sincronizar)
  await a.escribir('#nube-correo', 'ana@ejemplo.com');
  await a.escribir('#nube-clave', 'secreta');
  await sesion({ modo: 'entrar' });
  falla((await a.valor('#nube-correo')) === 'ana@ejemplo.com' && (await a.valor('#nube-clave')) === 'secreta', 'se borró lo escrito al repintar');
  falla((await p.ev('document.activeElement.id')) === 'nube-clave', 'el cursor no siguió en la contraseña: ' + await p.ev('document.activeElement.id'));
  falla((await p.ev(`document.getElementById('nube-correo').type`)) === 'email' && (await p.ev(`document.getElementById('nube-clave').type`)) === 'password', 'los campos no son de correo y contraseña');
  falla((await p.ev(`document.getElementById('nube-correo').autocomplete`)) === 'username' && (await p.ev(`document.getElementById('nube-clave').autocomplete`)) === 'current-password', 'el celular no podrá ofrecer la contraseña guardada');

  // Sin conexión
  await p.cdp('Network.enable');
  await p.cdp('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
  await sesion({ modo: 'entrar' });
  falla((await a.texto()).includes('Sin conexión'), 'no avisó que no hay conexión');
  await paso('sin conexión');
  await p.cdp('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });

  // La cuenta existe pero no tiene acceso a Rutina
  await sesion({ modo: 'entrar', rechazo: 'Tu cuenta no tiene acceso a Rutina' });
  falla(await p.cuantos('#vista [role=alert]'), 'el rechazo no se anuncia');
  await paso('rechazo');

  // Celular: el formulario arriba, la presentación debajo
  await p.celular();
  await sesion({ modo: 'entrar' });
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  falla(await p.ev(`(()=>{const r=document.getElementById('nube-correo').getBoundingClientRect();return r.top>0&&r.bottom<innerHeight})()`), 'el correo no queda a la vista en el celular');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('entrar-cel');
  await p.ev('window.scrollBy(0, 900)');
  await p.foto('entrar-cel-2');
  await p.computador();

  // El candado
  await sesion({ modo: 'bloqueada', correo: 'ana@ejemplo.com' });
  await a.esperar('#vista [data-accion=huella-abrir]');
  falla((await p.ev('document.title')) === 'Bloqueada · Rutina', 'el título no es Bloqueada');
  falla(await sinMenu(), 'se ve el menú con la app bloqueada');
  await paso('bloqueada');
  await p.foto('bloqueo-pc');
  await sesion({ modo: 'bloqueada', correo: 'ana@ejemplo.com', error: 'No se comprobó. Toca Desbloquear para intentar de nuevo.' });
  await paso('bloqueada con error');
  await sesion({ modo: 'bloqueada', correo: 'ana@ejemplo.com', intentando: true });
  falla(await p.ev(`document.querySelector('#vista [data-accion=huella-abrir]').disabled`), 'Desbloquear no se apaga mientras intenta');
  await p.celular();
  falla(await p.sinDesborde(), 'el candado se sale de la pantalla en el celular');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('bloqueo-cel');
  await p.computador();

  // De vuelta a la app
  await sesion({ modo: null });
  await p.ir('metas');
  await a.esperar('#lateral nav a[href="#metas"]');
  falla(!(await p.ev(`document.body.classList.contains('sin-sesion')`)), 'no volvió a la app');
  console.log('✓ Entrar');
};
