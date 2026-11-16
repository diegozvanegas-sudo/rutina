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

  // La presentación se puede tocar: anotar una serie con su descanso, ver a otro cliente, cambiar de ejercicio, los extras
  await sesion({ modo: 'entrar' });
  const ve = async (t, msg) => falla((await a.texto()).includes(t), msg + ' (no dice "' + t + '")');
  await tocarTexto('Una rep menos');
  await tocarTexto('＋ Serie 1 y descanso');
  await ve('💪 Fuerza estimada 70,8 kg · tu récord sigue en 72,5', 'con 4 reps no calculó la fuerza');
  await a.dormir(2300);
  await ve('Descansando…', 'no arrancó el descanso');
  falla(!(await a.texto()).includes('2:30'), 'el descanso no corre');
  await tocarTexto('✓ 4 reps anotadas · otra vez');
  await tocarTexto('Una rep más');
  await tocarTexto('Una rep más');
  await tocarTexto('＋ Serie 1 y descanso');
  await ve('🏆 ¡Nuevo récord! Fuerza estimada 75 kg (antes 72,5)', 'con 6 reps no marcó el récord');
  await tocarTexto('JJuan', undefined, false);
  await ve('Constancia de Juan por semana', 'no cambió de cliente');
  falla(await p.cuantos('#vista [aria-pressed=true][aria-label], #vista button[aria-pressed=true]'), 'el cliente elegido no se marca');
  await tocarTexto('Press plano', '[role=button]');
  await ve('Fuerza: press plano', 'no cambió de ejercicio');
  await ve('Semana 6: 62,5 kg', 'no muestra el último punto');
  await tocarTexto('Semana 3: 55 kg', '[role=button]');
  await ve('Semana 3: 55 kg', 'no muestra el punto tocado');
  await tocarTexto('💰 Finanzas', '[role=button]');
  await ve('Ingresos, gastos, presupuesto y deudas del mes.', 'el extra no dice qué hace');
  await tocarTexto('2Lo usas cada día', 'button', false);
  falla(await p.ev(`[...document.querySelectorAll('#vista [aria-current=step]')].map(x=>x.textContent).join('').startsWith('2')`), 'el paso tocado no queda marcado');
  const antes = await p.ev('location.hash');
  await tocarTexto('Ver cómo funciona ↓');
  await a.dormir(900);
  falla((await p.ev('location.hash')) === antes, 'Ver cómo funciona cambió la dirección');
  falla(await p.ev(`(()=>{const r=document.getElementById('como-funciona').getBoundingClientRect();return r.top>=-2&&r.top<innerHeight/2})()`), 'Ver cómo funciona no bajó a los pasos');
  await paso('presentación tocada');
  await p.ev('window.scrollTo(0,0)');
  // Tamaño mediano (el formulario fijo a la derecha)
  await p.cdp('Emulation.setDeviceMetricsOverride', { width: 1000, height: 800, deviceScaleFactor: 1, mobile: false });
  await sesion({ modo: 'entrar' });
  falla(await p.sinDesborde(), 'se sale de la pantalla a 1000 px');
  falla(await p.ev(`(()=>{const f=document.querySelector('#vista [data-formulario]').getBoundingClientRect(),h=document.querySelector('#vista h1').getBoundingClientRect();return f.left>h.right-4&&f.top<300})()`), 'a 1000 px el formulario no va a la derecha del titular');
  await p.foto('entrar-mediana');
  await p.computador();

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
