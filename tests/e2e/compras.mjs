// Recorrido de 🛒 Compras con clics y teclado reales: agregar (botón y Enter), repetido, marcar comprado, editar,
// quitar y deshacer, deseos, enlaces directos, recargar y limpiar lo comprado.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/compras.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Compras'), { paso, falla, escribir, tocarTexto } = a;
  const lista = async () => ((await p.estado())?.compras?.lista || []);
  const abrir = async (ruta = 'compras') => { await p.ir(ruta); await a.esperar('#compra-nombre'); };

  // La app de antes dejaba lo escrito en el formulario después de agregar (el siguiente producto heredaba cantidad y precio).
  // La de React lo vacía. Para que el recorrido sirva en las dos, se vacía a mano y se anota qué había quedado
  const vaciar = async () => {
    const quedo = [];
    for (const s of ['#compra-nombre', '#compra-cant', '#compra-precio', '#compra-enlace']) if (await p.cuantos(s)) { const v = await a.valor(s); if (v) { quedo.push(s + '=' + v); await escribir(s, ''); } }
    console.log('formulario después de agregar:', quedo.length ? 'quedó ' + quedo.join(', ') : 'vacío');
  };

  await abrir();
  await paso('vacía');

  // Agregar con el botón: nombre, cantidad y precio (los puntos de miles se ponen solos)
  await escribir('#compra-nombre', 'Avena');
  await escribir('#compra-cant', '2 kg');
  await escribir('#compra-precio', '12000');
  falla(await a.valor('#compra-precio') === '12.000', 'el precio no se formateó: ' + await a.valor('#compra-precio'));
  await tocarTexto('Agregar');
  await paso('una cosa');
  let l = await lista();
  falla(l.length === 1 && l[0].nombre === 'Avena' && l[0].cant === '2 kg' && l[0].precio === 12000 && l[0].tipo === 'mercado' && !!l[0].cat, 'no guardó bien: ' + JSON.stringify(l));
  await vaciar();

  // Agregar con Enter
  await escribir('#compra-nombre', 'Pechuga');
  await a.tecla('Enter', 13);
  falla((await lista()).length === 2, 'Enter no agregó');
  await vaciar();

  // Repetido (aunque cambien las mayúsculas): no se agrega y avisa
  await escribir('#compra-nombre', 'avena');
  await tocarTexto('Agregar');
  falla((await lista()).length === 2, 'agregó un repetido');
  falla((await a.aviso()).includes('ya está en la lista'), 'no avisó del repetido: ' + await a.aviso());
  await vaciar();
  await paso('dos cosas');

  // Marcar comprado
  await tocarTexto('Comprado: Avena');
  falla((await lista()).find((x) => x.nombre === 'Avena').hecho === true, 'no marcó comprado');
  await paso('avena comprada');

  // Editar: la nota se guarda al salir del campo; la categoría, al elegirla
  await tocarTexto('Editar Pechuga');
  await escribir('[data-k=nota]', 'sin piel');
  await a.salir();
  await p.poner('[data-k=cat]', 'otros');
  await escribir('[data-k=precio]', '18500');
  await a.salir();
  l = await lista();
  const pechuga = l.find((x) => x.nombre === 'Pechuga');
  falla(pechuga.nota === 'sin piel' && pechuga.cat === 'otros' && pechuga.precio === 18500, 'no guardó la edición: ' + JSON.stringify(pechuga));
  // El nombre no puede quedar vacío: vuelve al que tenía
  await escribir('[data-k=nombre]', '');
  await a.salir();
  falla((await lista()).some((x) => x.nombre === 'Pechuga') && await a.valor('[data-k=nombre]') === 'Pechuga', 'dejó el nombre vacío');
  await paso('editando');
  await tocarTexto('✓ Listo');
  await paso('editada');

  // Quitar y deshacer
  await tocarTexto('Editar Pechuga');
  await tocarTexto('🗑 Quitar');
  falla((await lista()).length === 1, 'no quitó');
  await tocarTexto('Deshacer', '#toast button');
  falla((await lista()).length === 2 && (await lista())[1].nombre === 'Pechuga', 'deshacer no la devolvió a su lugar');

  // Deseos
  await tocarTexto('✨ Deseos', undefined, false);
  await paso('deseos vacía');
  await escribir('#compra-nombre', 'Audífonos');
  await p.poner('#compra-pri', 'necesito');
  await escribir('#compra-precio', '250000');
  await escribir('#compra-enlace', 'https://ejemplo.com/audifonos');
  await tocarTexto('Agregar');
  const deseo = (await lista()).find((x) => x.tipo === 'deseo');
  falla(deseo && deseo.prioridad === 'necesito' && deseo.precio === 250000 && deseo.enlace === 'https://ejemplo.com/audifonos', 'no guardó el deseo: ' + JSON.stringify(deseo));
  await vaciar();
  await paso('un deseo');
  falla(await p.cuantos('#vista a[href="https://ejemplo.com/audifonos"][target=_blank]') === 1, 'falta el enlace "Ver"');

  // Enlaces directos a cada lista
  await abrir('compras/mercado');
  await paso('enlace a mercado');
  await abrir('compras/deseos');
  await paso('enlace a deseos');

  // Recargar: todo sigue ahí
  await p.recargar();
  await abrir('compras/mercado');
  await paso('después de recargar');

  // Lo comprado: se abre, se limpia y se puede deshacer
  await tocarTexto('✓ Comprado (1)', undefined, false);
  await tocarTexto('Quitar lo comprado de la lista');
  falla(!(await lista()).some((x) => x.nombre === 'Avena'), 'no limpió lo comprado');
  await paso('limpia');
  // Lo comprado queda en "Lo que más compras": un toque lo vuelve a agregar
  await tocarTexto('＋ Avena');
  falla((await lista()).some((x) => x.nombre === 'Avena' && !x.hecho), 'el toque rápido no agregó');
  await paso('avena otra vez');
  await p.foto('compras-pc');

  await p.celular();
  await abrir('compras/mercado');
  falla(await p.sinDesborde(), 'se desborda en el celular');
  await p.foto('compras-cel');
  await tocarTexto('Editar Avena');
  falla(await p.sinDesborde(), 'se desborda al editar en el celular');
  await p.foto('compras-editar-cel');
  await p.computador();
  console.log('✓ Compras');
};
