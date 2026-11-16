// Recorrido de 🗺️ Lugares con clics y teclado reales: el mapa (tocar una pieza, ya estuve y quitar, acercar y ver todo),
// un lugar nuevo (nombre, pieza, guardar), su detalle (ya estuve, una visita con gasto que va a Finanzas, enlace de
// fotos, borrar la visita), editarlo, filtros, Sorpréndeme, ubicarlo tocando el mapa, entrar a un mapa de adentro y
// volver, y borrar el lugar.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/lugares.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Lugares'), { paso, falla, tocarTexto, escribirCampo } = a;
  const lista = async () => (((await p.estado()) || {}).lugares || {}).lista || [];
  const caja = () => p.ev(`document.querySelector('#vista svg[role=img]').getAttribute('viewBox')`);
  // Una pieza que no abre otro mapa (y otra que sí, si hay)
  const pieza = (hijo) => p.ev(`[...document.querySelectorAll('#vista [data-pieza]')].find(x=>x.dataset.tip.includes('toca para entrar')===${hijo})?.dataset.pieza`);

  await p.computador();
  await p.ir('lugares');
  await a.esperar('#vista [data-pieza]');
  await a.dormir(600);
  await paso('mapa');

  // Tocar una pieza: ya estuve y quitar
  const pz = await pieza(false);
  falla(pz, 'no hay piezas sin mapa adentro');
  await p.tocar('#vista [data-pieza="' + pz + '"]');
  await paso('pieza');
  await tocarTexto('✓ Ya estuve aquí');
  falla((await a.aviso()).includes('marcado como visitado'), 'no marcó la pieza');
  await paso('pieza visitada');
  await tocarTexto('↩ Quitar de visitados');
  falla((await a.aviso()).includes('Quitado de visitados'), 'no quitó la pieza');
  await tocarTexto('Cerrar');

  // Acercar y ver todo
  const c0 = await caja();
  await tocarTexto('Acercar');
  falla((await caja()) !== c0, 'no acercó');
  // Arrastrar el mapa acercado lo mueve (sin abrir nada)
  const c1 = await caja();
  await p.arrastrar('#vista svg[role=img]', -120, -60);
  falla((await caja()) !== c1, 'arrastrar no movió el mapa');
  falla(!(await a.texto()).includes('Agregar lugar aquí'), 'arrastrar abrió una pieza');
  await tocarTexto('Ver todo');
  await a.dormir(700);
  falla((await caja()) === c0, 'no volvió a ver todo: ' + await caja() + ' / ' + c0);

  // Lugar nuevo
  await tocarTexto('＋ Agregar lugar');
  await paso('formulario');
  await tocarTexto('Guardar');
  falla((await a.aviso()).includes('Escribe el nombre'), 'no pidió el nombre');
  await escribirCampo('Nombre', 'Lugar de prueba');
  await p.poner('#vista [data-form-lugar] [name=pieza]', pz);
  await escribirCampo('Horas desde Medellín', '2');
  await tocarTexto('Guardar');
  falla((await a.aviso()).includes('Guardado: Lugar de prueba'), 'no guardó el lugar');
  const nuevo = (await lista()).find((l) => l.nombre === 'Lugar de prueba');
  falla(nuevo && nuevo.horas === 2 && nuevo.estado === 'quiero', 'el lugar quedó mal: ' + JSON.stringify(nuevo));
  await paso('lugar nuevo');

  // Detalle: ya estuve y una visita con gasto
  await tocarTexto('✓ Ya estuve');
  falla((await lista()).find((l) => l.id === nuevo.id).estado === 'visitado', 'no pasó a visitado');
  await paso('visitado');
  await escribirCampo('Con quién', 'Ana');
  await p.poner('#vista [data-visita] [name=calificacion]', '5');
  await escribirCampo('Gasto', '50000');
  await tocarTexto('Guardar visita');
  falla((await a.aviso()).includes('Visita guardada y gasto en Finanzas'), 'no guardó la visita con gasto: ' + await a.aviso());
  let l = (await lista()).find((x) => x.id === nuevo.id);
  falla(l.visitas.length === 1 && l.visitas[0].con === 'Ana' && l.visitas[0].calificacion === 5 && l.visitas[0].gasto === 50000, 'la visita quedó mal: ' + JSON.stringify(l.visitas));
  falla((await p.estado()).finanzas.movimientos.some((m) => m.monto === 50000 && m.nota === 'Lugar de prueba'), 'el gasto no llegó a Finanzas');
  await paso('visita');
  await tocarTexto('🔗 Agregar enlace de fotos', 'summary, button, [role=button]');
  await a.escribir('#vista [aria-label="Enlace de las fotos"]', 'https://drive.google.com/prueba');
  await a.salir();
  falla((await lista()).find((x) => x.id === nuevo.id).visitas[0].enlace === 'https://drive.google.com/prueba', 'no guardó el enlace');
  await paso('enlace');
  await tocarTexto('Borrar visita');
  l = (await lista()).find((x) => x.id === nuevo.id);
  falla(!l.visitas.length, 'no borró la visita');

  // Editar
  await tocarTexto('✏️ Editar');
  await paso('editar');
  await escribirCampo('Nombre', 'Lugar editado');
  await tocarTexto('Guardar');
  falla((await lista()).some((x) => x.nombre === 'Lugar editado'), 'no guardó el cambio');
  await paso('editado');

  // Filtros
  await p.tocar('#vista [data-accion=lug-estado][data-v=quiero]');
  await a.escribir('#vista [aria-label="Buscar lugar"]', 'editado');
  await a.salir();
  await paso('filtros');
  await a.escribir('#vista [aria-label="Buscar lugar"]', '');
  await a.salir();
  await p.tocar('#vista [data-accion=lug-estado][data-v=""]');

  // Sorpréndeme
  await tocarTexto('Dame un plan');
  await paso('sorpresa');

  // Ubicar tocando el mapa
  await tocarTexto('＋ Agregar lugar');
  await tocarTexto('📍 Tocar el mapa para ubicarlo');
  falla((await a.texto()).includes('Toca el punto exacto en el mapa'), 'no pidió tocar el mapa');
  await p.tocar('#vista [data-pieza="' + pz + '"]');
  falla((await a.texto()).includes('Punto: '), 'no tomó el punto del mapa');
  await paso('ubicado');
  await tocarTexto('Cancelar');

  // Borrar el lugar
  await p.tocar('#vista [data-accion=lug-abrir][data-id="' + nuevo.id + '"]');
  await tocarTexto('🗑️ Borrar');
  falla(!(await lista()).some((x) => x.id === nuevo.id), 'no borró el lugar');
  await paso('borrado');

  // Un mapa de adentro y volver
  const hijo = await pieza(true);
  if (hijo) {
    await p.tocar('#vista [data-pieza="' + hijo + '"]');
    await a.dormir(1200);
    await a.esperar('#vista [data-accion=lug-mapa]');
    await paso('mapa de adentro');
    await p.tocar('#vista [data-accion=lug-mapa]');
    await a.dormir(1200);
    await paso('de vuelta');
  }

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.ev('window.scrollTo(0,0)');
  await p.foto('lugares-pc');
  await p.celular();
  await p.ir('lugares');
  await a.esperar('#vista [data-pieza]');
  await a.dormir(600);
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.foto('lugares-cel');
  await p.ev('window.scrollBy(0, 700)');
  await p.foto('lugares-cel-2');
  await p.computador();
  console.log('✓ Lugares');
};
