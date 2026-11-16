// Recorrido de 🔔 Recordatorios con clics y teclado reales: km de la moto, abrir una fila, "Otra fecha" con costo (va a
// Finanzas), historial y borrar, editar (nombre, frecuencia, nota, todos los días), cerrar con Escape y tocando afuera,
// "Hecho hoy" y deshacer, posibles para agregar (agregar, descartar, volver a ver, cambiar de grupo), filtros, agregar
// desde plantilla con el buscador, eventos (con y sin fecha, editar, borrar), círculo cercano y lecturas del odómetro.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/recordatorios.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

const masDias = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };

export default async (p) => {
  const a = ayudas(p, 'Recordatorios'), { paso, falla, tocarTexto, escribirCampo } = a;
  const r = async () => (await p.estado()).recordatorios;
  const aceite = async () => (await r()).lista.find((x) => x.id === 'aceite-moto');
  const abiertos = () => p.cuantos('#vista [data-accion=rec-abrir][aria-expanded=true]');

  await p.computador();
  await p.ir('recordatorios');
  await a.esperar('#vista h1');
  await paso('inicio');

  // ✓ en algo de km sin lectura del odómetro: abre "Otra fecha" y pide los km
  await p.tocar('#vista [data-accion=rec-hoy][data-id=aceite-moto]');
  falla((await a.aviso()).includes('Escribe los km de la moto'), 'no pidió los km');
  falla(await p.cuantos('#vista [data-rec=aceite-moto] [name=km]') === 1, 'no abrió el panel para escribir los km');
  await paso('pide km');
  await tocarTexto('Recordatorios', 'h1');
  falla(await abiertos() === 0, 'tocar afuera no cerró el panel');

  // Km del odómetro
  await escribirCampo('Km del odómetro hoy', '12000');
  falla((await r()).vehiculos[0].km.some((k) => k.km === 12000 && k.fecha === iso()), 'no guardó la lectura de km');
  falla((await a.aviso()).includes('12.000 km'), 'no avisó los km');
  await paso('km');

  // Abrir la fila y anotar otra fecha con costo
  await p.tocar('#vista [data-accion=rec-abrir][data-id=aceite-moto]');
  falla(await abiertos() === 1, 'no abrió la fila');
  await paso('detalle');
  await tocarTexto('📅 Otra fecha');
  falla(await a.valorCampo('Km de la moto') === '12000', 'el panel no trae los km actuales: ' + await a.valorCampo('Km de la moto'));
  await escribirCampo('Costo (opcional)', '45000');
  falla(await a.valorCampo('Costo (opcional)') === '45.000', 'el costo no quedó con puntos');
  await paso('otra fecha');
  await tocarTexto('Guardar');
  let x = await aceite();
  falla(x.hechos.length === 1 && x.hechos[0].km === 12000 && x.hechos[0].costo === 45000, 'no guardó el registro: ' + JSON.stringify(x.hechos));
  falla((await p.estado()).finanzas.movimientos.some((m) => m.monto === 45000 && m.nota === 'Cambio de aceite' && m.categoria === 'transporte'), 'el costo no quedó como gasto en Finanzas');
  falla(await abiertos() === 0, 'después de guardar la fila debía cerrarse');
  await paso('hecho con costo');

  // Historial: borrar lo anotado
  await p.tocar('#vista [data-accion=rec-abrir][data-id=aceite-moto]');
  await tocarTexto('🕘 Historial (1)');
  await paso('historial');
  await tocarTexto('Borrar registro del', 'button', false);
  falla((await aceite()).hechos.length === 0, 'no borró el registro');
  await paso('historial borrado');

  // Editar
  await tocarTexto('✏️ Editar');
  await paso('editar');
  await escribirCampo('Nombre', 'Aceite de la moto');
  await escribirCampo('Se repite cada (0 = sin fecha)', '3');
  x = await aceite();
  falla(x.nombre === 'Aceite de la moto' && x.cadaMeses === 3 && !x.cadaDias, 'no guardó nombre o frecuencia: ' + JSON.stringify([x.nombre, x.cadaMeses, x.cadaDias]));
  await p.poner('#vista [name=unidad]', 'dias');
  x = await aceite();
  falla(x.cadaDias === 3 && !x.cadaMeses, 'no cambió a días: ' + JSON.stringify([x.cadaMeses, x.cadaDias]));
  await escribirCampo('Cada cuántos km (0 = no)', '2500');
  await escribirCampo('Nota', 'Castrol 20W50');
  x = await aceite();
  falla(x.cadaKm === 2500 && x.nota === 'Castrol 20W50', 'no guardó km o nota');
  await p.tocar(await a.campo('📌 Todos los días'));
  falla((await aceite()).diario === true, 'no marcó "todos los días"');
  await paso('editado diario');
  await p.tocar(await a.campo('📌 Todos los días'));
  falla(!(await aceite()).diario, 'no desmarcó "todos los días"');
  await paso('editado');
  await a.tecla('Escape', 27);
  falla(await abiertos() === 0, 'Escape no cerró la fila');
  await paso('cerrado');

  // Hecho hoy y deshacer
  await p.tocar('#vista [data-accion=rec-hoy][data-id=aceite-moto]');
  x = await aceite();
  falla(x.hechos.length === 1 && x.hechos[0].fecha === iso() && x.hechos[0].km === 12000, 'no anotó hecho hoy: ' + JSON.stringify(x.hechos));
  falla((await a.aviso()).includes('· hoy'), 'no avisó hecho hoy');
  await paso('hecho hoy');
  await tocarTexto('Deshacer', '#toast button');
  falla((await aceite()).hechos.length === 0, 'deshacer no lo quitó');
  await paso('deshecho');

  // 💡 Posibles para agregar
  await tocarTexto('Agregar Anotar los gastos del día');
  falla((await r()).lista.length === 2, 'no agregó el sugerido');
  falla(await abiertos() === 1, 'el sugerido nuevo debía quedar abierto');
  await paso('sugerido agregado');
  await tocarTexto('Recordatorios', 'h1');
  await p.tocar('#vista [data-accion=rec-sug-quitar]');
  falla(((await r()).descartados || []).length === 1, 'no descartó');
  await paso('descartado');
  await tocarTexto('Ver otra vez los', 'button', false);
  falla(!(await r()).descartados, 'no volvió a mostrar los descartados');
  await p.tocar('#vista [data-accion=rec-sug-vista][data-v=mes]');
  await paso('sugeridos del mes');

  // Filtros
  await p.tocar('#vista [data-accion=rec-filtro][data-v=sin-dato]');
  await paso('filtro sin registro');
  await p.tocar('#vista [data-accion=rec-filtro][data-v=""]');
  await paso('filtro todos');

  // Agregar desde plantilla con el buscador
  await tocarTexto('＋ Agregar');
  falla(await p.ev(`document.activeElement && document.activeElement.getAttribute('aria-label')`) === 'Buscar plantilla', 'no dejó el cursor en el buscador');
  // La caja se abre con una animación: se espera a que termine y se confirma que lo escrito quedó en el buscador
  await a.dormir(500);
  await a.escribir('#vista [aria-label="Buscar plantilla"]', 'soat');
  if (await a.valor('#vista [aria-label="Buscar plantilla"]') !== 'soat') { await a.dormir(500); await a.escribir('#vista [aria-label="Buscar plantilla"]', 'soat'); }
  await a.dormir(200);
  const visibles = await p.ev(`[...document.querySelector('#vista [aria-label="Buscar plantilla"]').closest('details, [data-plantillas]').querySelectorAll('[data-accion=rec-agregar][data-k]')].filter(b=>b.checkVisibility()).map(b=>b.textContent.trim())`);
  falla(visibles.length >= 1 && visibles.every((t) => t.toLowerCase().includes('soat')), 'el buscador no filtró: ' + JSON.stringify(visibles));
  await p.tocar('#vista [data-accion=rec-agregar][data-k="' + (await p.ev(`[...document.querySelector('#vista [aria-label="Buscar plantilla"]').closest('details, [data-plantillas]').querySelectorAll('[data-accion=rec-agregar][data-k]')].find(b=>b.checkVisibility()).dataset.k`)) + '"]');
  falla((await r()).lista.some((y) => y.nombre === 'SOAT'), 'no agregó el SOAT');
  falla(await abiertos() === 1, 'el SOAT nuevo debía quedar abierto');
  await paso('plantilla agregada');
  await tocarTexto('Recordatorios', 'h1');

  // Eventos
  await a.escribir('#evento-nombre', 'Concierto de prueba');
  await p.poner('#evento-fecha', masDias(5));
  await p.poner('#evento-aviso', '3');
  await p.tocar('#vista [data-accion=evento-agregar]');
  let ev = (await r()).eventos;
  falla(ev.length === 1 && ev[0].nombre === 'Concierto de prueba' && ev[0].fecha === masDias(5) && ev[0].avisarDias === 3, 'no agregó el evento: ' + JSON.stringify(ev));
  await paso('evento agregado');
  await a.escribir('#evento-nombre', 'Final de la liga');
  await p.poner('#evento-fecha', '');
  await p.tocar('#vista [data-accion=evento-agregar]');
  ev = (await r()).eventos;
  falla(ev.length === 2 && !ev[1].fecha, 'no agregó el evento sin fecha: ' + JSON.stringify(ev));
  await paso('evento sin fecha');
  await p.tocar('#vista [data-accion=rec-abrir][data-id="' + ev[1].id + '"]');
  falla(await p.cuantos('#vista a[href*="google.com/search"]') === 1, 'no ofreció buscar la fecha');
  await paso('evento por confirmar');
  await p.tocar('#vista [data-accion=rec-abrir][data-id="' + ev[0].id + '"]');
  await paso('evento detalle');
  await tocarTexto('✏️ Editar');
  await escribirCampo('Lugar', 'Atanasio Girardot');
  falla((await r()).eventos[0].lugar === 'Atanasio Girardot', 'no guardó el lugar');
  await paso('evento editado');
  await tocarTexto('🗑 Borrar evento');
  falla((await r()).eventos.length === 1, 'no borró el evento');
  await paso('evento borrado');

  // 👥 Círculo cercano
  await a.escribir('#circulo-nombre', 'Mamá');
  await p.poner('#circulo-relacion', 'Familia');
  await p.tocar('#vista [data-accion=circulo-agregar]');
  let c = (await p.estado()).circulo;
  falla(c.length === 1 && c[0].nombre === 'Mamá' && c[0].cadaDias === 7, 'no agregó la persona: ' + JSON.stringify(c));
  await paso('persona');
  await a.escribir('#vista [aria-label="Nota del contacto"]', 'Hablamos del viaje');
  await tocarTexto('✓ Hablé hoy');
  c = (await p.estado()).circulo;
  falla(c[0].contactos.length === 1 && c[0].contactos[0].nota === 'Hablamos del viaje', 'no guardó el contacto: ' + JSON.stringify(c[0].contactos));
  await paso('hablé');
  await tocarTexto('Editar', 'summary, button, [role=button]');
  await escribirCampo('Cada cuántos días', '10');
  falla((await p.estado()).circulo[0].cadaDias === 10, 'no guardó cada cuántos días');
  await paso('persona editada');
  // La app vieja cerraba «Editar» al guardar un campo: se vuelve a abrir si hace falta
  if (!(await a.marcar('Borrar'))) await tocarTexto('Editar', 'summary, button, [role=button]');
  await tocarTexto('Borrar');
  falla((await p.estado()).circulo.length === 0, 'no borró la persona');

  // Lecturas del odómetro
  await tocarTexto('Editar vehículo', 'summary, button, [role=button]');
  await paso('vehículo');
  await tocarTexto('Borrar lectura del', 'button', false);
  falla((await r()).vehiculos[0].km.length === 0, 'no borró la lectura');
  await paso('lectura borrada');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('recordatorios-pc');
  await p.celular();
  await p.ir('recordatorios');
  await a.esperar('#vista h1');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.tocar('#vista [data-accion=rec-abrir][data-id=aceite-moto]');
  await p.foto('recordatorios-cel');
  await p.computador();
  console.log('✓ Recordatorios');
};
