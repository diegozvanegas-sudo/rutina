// Recorrido de 🛡️ Administrar (solo el admin) con datos de prueba: sin la nube, lo que guarda en Supabase avisa
// "Inicia sesión en la nube"; aquí se prueba lo que se ve en cada pestaña, que cada control llame a su acción
// y "Ver como" (entrar y volver). No se prueba guardar de verdad (necesita Supabase).
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/administrar.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

const DATOS = {
  roles: [{ id: 'admin', nombre: 'Administrador' }, { id: 'estudiante', nombre: 'Estudiante' }, { id: 'entrenador', nombre: 'Entrenador' }],
  usuarios: [
    { id: 'u1', correo: 'admin@prueba.co', rol: 'admin', ultima: '2026-11-10T15:00:00Z' },
    { id: 'u2', correo: 'ana@prueba.co', rol: 'estudiante', ultima: '2026-11-12T20:30:00Z' },
    { id: 'u3', correo: 'beto@prueba.co', rol: 'entrenador', ultima: null },
  ],
  reglas: [{ tipo: 'seccion', id: 'finanzas', rol: 'estudiante', visible: false }, { tipo: 'seccion', id: 'gym', usuario: 'u2', visible: false }],
};

export default async (p) => {
  const a = ayudas(p, 'Administrar'), { paso, falla, tocarTexto } = a;
  const aviso = async (t) => { await a.dormir(300); falla((await a.aviso()).includes(t), 'no avisó «' + t + '»: ' + await a.aviso()); };
  const pestana = async (k) => { await p.tocar('#vista [data-accion=adm-pestana][data-p=' + k + ']'); await a.dormir(300); };

  await p.computador();
  await p.ev(`window.rutinaPrueba.permisos({ rol: 'admin', reglas: [] })`);
  await p.ev(`window.rutinaPrueba.admin(${JSON.stringify(DATOS)})`);
  await p.ir('administrar');
  await a.esperar('#vista [data-accion=adm-pestana]');
  await paso('usuarios');

  // Excepciones de un usuario y cambiar su rol (sin nube avisa)
  await tocarTexto('Excepciones de este usuario (1)', 'summary, button, [role=button]');
  await paso('excepciones');
  await p.poner('#vista [data-cambio=adm-rol][data-u=u2]', 'entrenador');
  await aviso('Inicia sesión en la nube');
  await p.poner('#vista [data-cambio=adm-regla][data-u=u2][data-id=gym]', '');
  await aviso('Inicia sesión en la nube');

  await pestana('porUsuario');
  await paso('por usuario');
  await p.tocar('#vista [data-cambio=adm-regla-usuario][data-u=u2][data-id=finanzas]');
  await aviso('Inicia sesión en la nube');

  await pestana('permisos');
  await paso('por rol');
  await p.tocar('#vista [data-cambio=adm-regla-rol][data-rol=estudiante][data-id=finanzas]');
  await aviso('Inicia sesión en la nube');

  await pestana('roles');
  await paso('roles');
  await tocarTexto('Crear');
  await aviso('Escribe el nombre del rol');
  await a.escribir('#adm-rol-nuevo', 'Estudiante');
  await tocarTexto('Crear');
  await aviso('Ya hay un rol con ese nombre');
  await a.escribir('#adm-rol-nuevo', 'Amigos del gym');
  await tocarTexto('Crear');
  await aviso('Inicia sesión en la nube');
  await p.tocar('#vista [data-accion=adm-rol-borrar][data-rol=entrenador]');
  await aviso('Inicia sesión en la nube');

  await pestana('entrenadores');
  await a.dormir(500);
  await paso('entrenadores');

  // Ver como: entra a Hoy con el banner y vuelve
  await pestana('ver');
  await paso('ver como');
  await p.poner('#vista [data-cambio=adm-ver]', 'rol:estudiante');
  await a.dormir(600);
  falla((await a.texto()).includes('Estás viendo la app como Estudiante'), 'no entró a ver como Estudiante');
  await tocarTexto('Volver a mi vista');
  await a.dormir(600);
  await a.esperar('#vista [data-accion=adm-pestana]');
  await paso('de vuelta');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await pestana('usuarios');
  await p.foto('administrar-pc');
  await p.celular();
  for (const k of ['usuarios', 'porUsuario', 'roles']) { await pestana(k); falla(await p.sinDesborde(), 'se sale en el celular (' + k + ')'); await p.ev('window.scrollTo(0,0)'); await p.foto('administrar-cel-' + k); }
  await p.computador();
  console.log('✓ Administrar');
};
