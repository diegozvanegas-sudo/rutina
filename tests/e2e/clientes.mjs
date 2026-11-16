// Recorrido de 👥 Clientes con clics y teclado reales: agregar un cliente, 📋 Datos (peso, estatura, objetivo, nota),
// 💳 Pago (precio, registrar y borrar un pago), 🏋️ Rutina (copiar mis días, editar el día y un ejercicio, agregar uno,
// ordenar con el teclado, mover, agregar y borrar un día), 📆 Ciclo (tipo, crear, fases, tiempo, cambiar el tipo),
// 🥗 Comidas (copiar planes, cambiar de plan, ajustar a su peso, una cantidad, quitar un plan), 📈 Seguimiento
// (check-in y valoración, borrar), 🔗 App (sin nube), 📤 Compartir (ver el texto, guardar plantilla), volver a la lista,
// duplicar, filtrar, agregar desde la plantilla y borrar.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/clientes.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Clientes'), { paso, falla, tocarTexto, escribirCampo } = a;
  const est = async () => (await p.estado()) || {};
  const cl = async (n = 0) => ((await est()).clientes || [])[n];
  const pestana = async (t) => { await p.tocar('#vista [data-accion=cl-pestana][data-p=' + t + ']'); await a.dormir(300); };
  const marcarN = (sel, n = 0) => p.ev(`(()=>{document.querySelectorAll('[data-e2e-n]').forEach(x=>x.removeAttribute('data-e2e-n'));const l=[...document.querySelectorAll(${JSON.stringify(sel)})].filter(x=>x.checkVisibility({visibilityProperty:true}));const c=l[${n}];if(!c)return false;c.setAttribute('data-e2e-n','1');c.scrollIntoView({block:'center'});return true})()`);
  const tocarN = async (sel, n = 0) => { falla(await marcarN(sel, n), 'no encontré ' + sel + ' (' + n + ')'); await p.tocar('[data-e2e-n]'); };
  const escribirN = async (sel, n, valor) => { falla(await marcarN(sel, n), 'no encontré ' + sel + ' (' + n + ')'); await a.escribir('[data-e2e-n]', valor); await a.salir(); };

  await p.computador();
  await p.ir('clientes');
  await a.esperar('#cl-nombre');
  await paso('vacío');

  // Agregar
  await a.escribir('#cl-nombre', 'Ana Pérez');
  await tocarTexto('＋ Cliente');
  falla((await cl())?.nombre === 'Ana Pérez', 'no agregó el cliente');
  await paso('datos');

  // 📋 Datos
  await escribirCampo('Peso (kg)', '62,5');
  await escribirCampo('Estatura (cm)', '165');
  let c = await cl();
  falla(c.peso === 62.5 && c.estatura === 165, 'no guardó peso y estatura: ' + c.peso + ' ' + c.estatura);
  await escribirCampo('Peso (kg)', '500');
  falla((await a.aviso()).includes('Revisa el peso'), 'no avisó del peso imposible');
  falla((await cl()).peso === 62.5, 'guardó un peso imposible');
  falla((await a.valorCampo('Peso (kg)')) === '62,5', 'el campo no volvió al peso guardado: ' + await a.valorCampo('Peso (kg)'));
  await p.tocar('#vista [data-accion=cl-objetivo][data-v=musculo]');
  c = await cl();
  falla(c.objetivo === 'musculo' && c.ajuste === 80, 'no puso el objetivo: ' + c.objetivo + ' ' + c.ajuste);
  falla((await a.valorCampo('Ajuste de comida (%)')) === '80', 'el ajuste no se actualizó en el campo');
  await escribirCampo('Nota (lesiones, horarios, gustos)', 'Rodilla izquierda');
  falla((await cl()).nota === 'Rodilla izquierda', 'no guardó la nota');
  await paso('datos llenos');

  // 💳 Pago
  await pestana('cobro');
  await paso('pago');
  await escribirCampo('Precio', '120000');
  falla((await cl()).cobro.precio === 120000, 'no guardó el precio: ' + (await cl()).cobro.precio);
  await p.poner('#vista [data-cambio=cl-cobro][data-k=cada]', 'quincena');
  falla((await cl()).cobro.cada === 'quincena', 'no cambió cada cuánto');
  const movs = (await est()).finanzas.movimientos.length;
  await tocarTexto('✓ Registrar pago de', 'button', false);
  falla((await cl()).cobro.pagos.length === 1, 'no registró el pago');
  falla((await est()).finanzas.movimientos.length === movs + 1, 'no lo anotó en Finanzas');
  await paso('pagado');
  await tocarN('#vista [data-accion=cl-pago-borrar]');
  falla(!(await cl()).cobro.pagos.length, 'no borró el pago');

  // 🏋️ Rutina
  await pestana('rutina');
  await paso('rutina vacía');
  await p.tocar('#vista [data-accion=cl-copiar-dia]');
  const elegidos = await p.cuantos('#vista [data-accion=cl-copiar-dia][aria-pressed=true]');
  await tocarTexto('📋 Copiar', 'button', false);
  falla((await cl()).rutina.length === elegidos, 'no copió los días: ' + (await cl()).rutina.length + ' de ' + elegidos);
  await paso('rutina copiada');
  await escribirCampo('Nombre', 'Día A');
  falla((await cl()).rutina[0].nombre === 'Día A', 'no cambió el nombre del día');
  await p.poner('#vista [data-cambio=ed][data-ruta="clientes.0.rutina.0.diaSemana"]', '1');
  falla((await cl()).rutina[0].diaSemana === 1, 'no asignó el lunes');
  await escribirCampo('Cardio', 'Bici 20 min');
  const ej0 = (await cl()).rutina[0].ejercicios[0].nombre;
  await escribirN('#vista [aria-label="Ejercicio 1"]', 0, ej0 + ' suave');
  falla((await cl()).rutina[0].ejercicios[0].nombre === ej0 + ' suave', 'no cambió el ejercicio');
  await a.escribir('#ed-nuevo-nombre', 'Plancha');
  await a.escribir('#ed-nuevo-musculo', 'Core');
  await a.escribir('#ed-nuevo-esquema', '3×30 s');
  await a.tecla('Enter', 13);
  falla((await cl()).rutina[0].ejercicios.at(-1).nombre === 'Plancha', 'Enter no agregó el ejercicio');
  await paso('ejercicio agregado');
  // Ordenar con el teclado
  const nombres = async () => (await cl()).rutina[0].ejercicios.map((x) => x.nombre);
  const antes = await nombres();
  await p.ev(`document.querySelector('[data-orden-lista="clientes.0.rutina.0.ejercicios"] > [data-orden-i] [aria-label^="Arrastrar"]').focus()`);
  await a.tecla('ArrowDown', 40);
  await a.dormir(300);
  falla((await nombres())[1] === antes[0], 'la flecha no bajó el ejercicio');
  // Mover el día, agregar y borrar
  const dias = (await cl()).rutina.length;
  if (dias > 1) {
    await p.tocar('#vista [data-accion=cl-mover-dia][data-n="1"]');
    falla((await cl()).rutina[1].nombre === 'Día A', 'no movió el día');
  }
  await tocarTexto('＋ Día');
  falla((await cl()).rutina.length === dias + 1, 'no agregó el día');
  await paso('día nuevo');
  await tocarN('#vista [data-accion=cl-borrar-dia]');
  falla((await cl()).rutina.length === dias, 'no borró el día');
  await p.tocar('#vista [data-accion=cl-dia][data-i="0"]');
  await paso('primer día');

  // 📆 Ciclo
  await pestana('ciclo');
  await paso('ciclo sin crear');
  await p.tocar('#vista [data-accion=cc-tipo][data-t=hipertrofia]');
  await tocarTexto('📆 Crear el ciclo', 'button', false);
  c = await cl();
  falla(c.ciclo && c.ciclo.fases.length > 0, 'no creó el ciclo');
  await paso('ciclo creado');
  await escribirN('#vista [aria-label="Nombre de la fase"]', 0, 'Base');
  falla((await cl()).ciclo.fases[0].nombre === 'Base', 'no cambió el nombre de la fase');
  await escribirN('#vista [aria-label^="Semanas de "]', 0, '3');
  falla((await cl()).ciclo.fases[0].semanas === 3, 'no cambió las semanas');
  const fases = (await cl()).ciclo.fases.length;
  await tocarTexto('＋ Fase');
  falla((await cl()).ciclo.fases.length === fases + 1, 'no agregó la fase');
  await tocarN('#vista [data-accion=cl-fase-borrar]', fases);
  falla((await cl()).ciclo.fases.length === fases, 'no borró la fase');
  await escribirN('#vista [data-cambio=cc-tiempo][data-campo=dias]', 0, '3');
  falla((await cl()).tiempo.dias === 3, 'no guardó los días por semana');
  await paso('ciclo editado');
  await tocarTexto('🔄 Cambiar el tipo de ciclo', 'summary');
  await tocarN('#vista [data-accion=cc-cambiar-tipo][data-t=fuerza]');
  falla((await a.aviso()).includes('Ciclo'), 'no cambió el tipo');

  // 🥗 Comidas
  await pestana('comidas');
  await paso('comidas vacías');
  await tocarTexto('📋 Copiar', 'button', false);
  c = await cl();
  const tipos = Object.keys(c.dieta.planes);
  falla(tipos.length === 3, 'no copió los planes: ' + tipos.join(','));
  await paso('planes copiados');
  await p.tocar('#vista [data-accion=cl-plan][data-t="' + tipos[1] + '"]');
  await tocarTexto('⚖️ Ajustar todo a su peso');
  falla((await a.aviso()).includes('ajustadas'), 'no ajustó a su peso');
  const rc = 'clientes.0.dieta.planes.' + tipos[1] + '.comidas.0.items.0.cant';
  if (await p.cuantos('#vista [data-ruta="' + rc + '"]')) {
    await a.escribir('#vista [data-ruta="' + rc + '"]', '150');
    await a.salir();
    falla((await cl()).dieta.planes[tipos[1]].comidas[0].items[0].cant === 150, 'no cambió la cantidad');
  }
  await paso('plan ajustado');
  await tocarTexto('Quitar este plan');
  falla(Object.keys((await cl()).dieta.planes).length === 2, 'no quitó el plan');

  // 📈 Seguimiento
  await pestana('seguimiento');
  await paso('seguimiento');
  await a.escribir('#ck-peso', '61,8');
  await a.escribir('#ck-sueno', '4');
  await a.escribir('#ck-nota', 'Bien, sin dolor');
  await tocarTexto('Guardar check-in');
  c = await cl();
  falla(c.checkins.length === 1 && c.peso === 61.8, 'no guardó el check-in');
  await a.escribir('#va-cintura', '74');
  await tocarTexto('Guardar valoración');
  falla((await cl()).valoraciones.length === 1, 'no guardó la valoración');
  await paso('con check-in');
  await tocarN('#vista [data-accion=cl-registro-borrar][data-lista=checkins]');
  falla(!(await cl()).checkins.length, 'no borró el check-in');

  // 🔗 App y 📤 Compartir
  await pestana('app');
  await paso('app');
  await pestana('compartir');
  await tocarTexto('Ver el texto', 'summary');
  falla((await a.texto()).includes('Ana'), 'no muestra el texto');
  await paso('compartir');
  await a.escribir('#cl-plantilla-nombre', 'Hipertrofia base');
  await tocarTexto('Guardar');
  falla(((await est()).plantillasCliente || []).length === 1, 'no guardó la plantilla');

  // De vuelta a la lista: duplicar, filtrar, plantilla y borrar
  await pestana('datos');
  await tocarTexto('⧉ Duplicar cliente');
  falla((await est()).clientes.length === 2, 'no duplicó');
  await tocarTexto('← Todos los clientes');
  await paso('lista');
  await p.tocar('#vista [data-accion=cl-filtro][data-v=vencido]');
  await paso('filtro vencidos');
  await p.tocar('#vista [data-accion=cl-filtro][data-v=""]');
  await a.escribir('#cl-nombre', 'Luis');
  await p.poner('#cl-plantilla', (await est()).plantillasCliente[0].id);
  await tocarTexto('＋ Cliente');
  c = await cl(2);
  falla(c && c.nombre === 'Luis' && c.rutina.length > 0, 'no agregó desde la plantilla');
  await paso('desde plantilla');
  await tocarTexto('🗑 Borrar cliente');
  falla((await est()).clientes.length === 2, 'no borró el cliente');
  await paso('borrado');

  // Enlace directo
  await p.ir('hoy');
  await p.ir('clientes/' + (await cl()).id);
  await a.esperar('#vista [data-accion=cl-pestana]');
  falla((await a.texto()).includes('Ana Pérez'), 'el enlace no abrió el cliente');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('clientes-pc');
  await p.celular();
  for (const t of ['datos', 'cobro', 'rutina', 'ciclo', 'comidas', 'seguimiento']) { await pestana(t); falla(await p.sinDesborde(), 'se sale en el celular (' + t + ')'); await p.ev('window.scrollTo(0,0)'); await p.foto('clientes-cel-' + t); }
  await tocarTexto('← Todos los clientes');
  await p.foto('clientes-cel-lista');
  await p.computador();
  console.log('✓ Clientes');
};
