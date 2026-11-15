// Recorrido de 💼 Ventas (solo el superadmin) con clics y teclado reales: productos (editar, estado, nuevo, borrar y deshacer),
// página de venta, PDF, registro de ventas y lista para lanzar.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/ventas.mjs <carpeta de capturas>
// No se prueba: descargar la página ni imprimir (abren diálogos del navegador).
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Ventas'), { paso, falla, tocarTexto, escribirCampo } = a;
  const v = async () => (await p.estado())?.ventas;
  // En desarrollo, la app deja entrar como admin sin la nube (window.rutinaPrueba, ver el final de main.js)
  const admin = () => p.ev(`window.rutinaPrueba.permisos({ rol: 'admin', reglas: [] })`);
  const abrir = async () => { await admin(); await p.ir('ventas'); await a.esperar('#vista label'); };

  await abrir();
  await paso('productos');
  const antes = await p.cuantos('#vista label');

  // Editar el primer producto: cada campo guarda al salir de él
  await escribirCampo('Nombre', 'Guía de músculo');
  await escribirCampo('Precio', '45000');
  await escribirCampo('Garantía', '90');
  await escribirCampo('Qué incluye', 'Rutina de 12 semanas\nPlan de comida');
  await escribirCampo('Preguntas frecuentes', '¿Necesito gym? | No, trae versión en casa.');
  let d = await v(), p0 = d.productos[0];
  falla(p0.nombre === 'Guía de músculo' && p0.precio === 45000 && p0.garantia === 60, 'no guardó nombre, precio o garantía (máx. 60): ' + JSON.stringify([p0.nombre, p0.precio, p0.garantia]));
  falla(JSON.stringify(p0.incluye) === JSON.stringify(['Rutina de 12 semanas', 'Plan de comida']), 'no guardó los renglones: ' + JSON.stringify(p0.incluye));
  falla(JSON.stringify(p0.faq) === JSON.stringify([['¿Necesito gym?', 'No, trae versión en casa.']]), 'no guardó las preguntas: ' + JSON.stringify(p0.faq));
  falla(await a.valorCampo('Precio') === '45.000', 'el precio no quedó con puntos: ' + await a.valorCampo('Precio'));
  // El nombre no puede quedar vacío
  await escribirCampo('Nombre', '');
  falla((await v()).productos[0].nombre === 'Guía de músculo' && await a.valorCampo('Nombre') === 'Guía de músculo', 'dejó el nombre vacío');
  falla((await a.aviso()).includes('no puede quedar vacío'), 'no avisó del nombre vacío');

  // Estado: a "listo" siempre se puede; "a la venta" solo si no le falta nada
  await tocarTexto('✅ Listo para vender');
  falla((await v()).productos[0].estado === 'listo', 'no cambió el estado');
  await paso('producto editado');

  // Nuevo, borrar y deshacer
  const n = (await v()).productos.length;
  await tocarTexto('＋ Producto');
  falla((await v()).productos.length === n + 1 && await p.cuantos('#vista label') > antes, 'no agregó el producto');
  falla(await p.ev(`document.activeElement && document.activeElement.value`) === 'Producto nuevo', 'el nombre del producto nuevo debe quedar listo para escribir');
  await tocarTexto('🟢 A la venta', undefined, true);
  await tocarTexto('Borrar Producto nuevo');
  falla((await v()).productos.length === n, 'no borró');
  await tocarTexto('Deshacer', '#toast button');
  falla((await v()).productos.length === n + 1, 'deshacer no lo devolvió');
  await tocarTexto('Borrar Producto nuevo');

  // Página de venta del primero
  await tocarTexto('🛍️ Ver su página');
  await a.esperar('#vista iframe');
  await paso('página');
  falla((await p.ev(`document.querySelector('#vista iframe').getAttribute('srcdoc')`)).includes('Guía de músculo'), 'la vista previa no muestra el producto');
  await tocarTexto('🖥️ Computador');
  const anchoPc = await p.ev(`document.querySelector('#vista iframe').getBoundingClientRect().width`);
  await tocarTexto('📱 Celular');
  const anchoCel = await p.ev(`document.querySelector('#vista iframe').getBoundingClientRect().width`);
  falla(anchoCel < anchoPc && anchoCel <= 390, 'la vista de celular debe ser más angosta: ' + anchoCel + ' / ' + anchoPc);
  await escribirCampo('Nombre o marca', 'Diego Zapata');
  await escribirCampo('Tu historia', 'Empecé flaco y aprendí a entrenar con plan.');
  d = await v();
  falla(d.autor.nombre === 'Diego Zapata' && d.autor.historia.startsWith('Empecé'), 'no guardó quién vende');
  falla((await p.ev(`document.querySelector('#vista iframe').getAttribute('srcdoc')`)).includes('Diego Zapata'), 'la vista previa no se actualizó con el autor');

  // PDF
  await tocarTexto('📄 PDF');
  await paso('pdf');

  // Registro de ventas
  await tocarTexto('💰 Ventas');
  await paso('ventas sin datos');
  await a.escribir('#vt-v-monto', '50000');
  await tocarTexto('Registrar venta');
  falla((await v()).registro.length === 1 && (await v()).registro[0].monto === 50000, 'no registró la venta');
  // Vacío = el precio del producto
  await a.escribir('#vt-v-monto', '');
  await tocarTexto('Registrar venta');
  falla((await v()).registro.length === 2 && (await v()).registro[1].monto === 45000, 'vacío debe usar el precio del producto: ' + JSON.stringify((await v()).registro));
  await a.escribir('#vt-v-monto', '');
  await paso('dos ventas');
  falla(await p.cuantos('#vista svg rect') > 0, 'falta el gráfico de los meses');
  await tocarTexto('Borrar la venta');
  falla((await v()).registro.length === 1, 'no borró la venta');
  await tocarTexto('Deshacer', '#toast button');
  falla((await v()).registro.length === 2, 'deshacer no devolvió la venta');
  await p.foto('ventas-pc');

  // Lista para lanzar
  await tocarTexto('🚀 Lanzar');
  await paso('lanzar');
  await p.ev(`document.querySelector('#vista button[aria-pressed]').scrollIntoView({block:'center'})`);
  await p.tocar('#vista button[aria-pressed]');
  falla(Object.keys((await v()).lista).length === 1 && await p.cuantos('#vista button[aria-pressed=true]') === 1, 'no marcó el punto de la lista');
  await paso('un punto hecho');
  await p.tocar('#vista button[aria-pressed=true]');
  falla(Object.keys((await v()).lista).length === 0, 'no lo desmarcó');

  await p.celular();
  await tocarTexto('📦 Productos');
  falla(await p.sinDesborde(), 'productos se desborda en el celular');
  await p.foto('ventas-productos-cel');
  await tocarTexto('💰 Ventas');
  falla(await p.sinDesborde(), 'ventas se desborda en el celular');
  await p.foto('ventas-ventas-cel');
  await tocarTexto('🛍️ Página');
  falla(await p.sinDesborde(), 'la página se desborda en el celular');
  await p.foto('ventas-pagina-cel');
  await p.computador();
  // Quien no es admin no la ve: vuelve a Hoy
  await p.ev(`window.rutinaPrueba.permisos(null)`);
  await p.ir('hoy'); await p.ir('ventas');
  falla(await p.cuantos('#vista iframe') === 0 && (await a.texto()).indexOf('Solo la ves tú') < 0, 'alguien que no es admin vio Ventas');
  console.log('✓ Ventas');
};
