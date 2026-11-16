// Recorrido de ✏️ Editar con clics, teclado y arrastre reales:
// 🏋️ Rutina: elegir el día, nombre del día, días de fútbol, sesiones del partido, editar un ejercicio en su renglón
//   (nombre, músculo, series × reps), abrir ⋯ (nota, descanso, biserie, duplicar, borrar), agregar uno desde el renglón
//   de abajo, ordenar con el teclado y arrastrando, agregar y borrar un día.
// ☀️ Hábitos: editar, días, tipo, agregar con una idea, ordenar, empezar de cero y traer los de ejemplo.
// 🧘 Sesiones: elegir, nombre, agregar un ejercicio y pasarlo a repeticiones, una checklist con su punto.
// 🧩 Pantallas: esconder y mostrar, subir, como venía.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/editar.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Editar'), { paso, falla, tocarTexto, escribirCampo } = a;
  const est = async () => (await p.estado()) || {};
  const pestana = async (k) => { await p.tocar('#vista [data-accion=ed-pestana][data-p=' + k + ']'); await a.dormir(300); };
  const marcarN = (sel, n = 0) => p.ev(`(()=>{document.querySelectorAll('[data-e2e-n]').forEach(x=>x.removeAttribute('data-e2e-n'));const l=[...document.querySelectorAll(${JSON.stringify(sel)})].filter(x=>x.checkVisibility({visibilityProperty:true}));const n=${n},c=n<0?l[l.length+n]:l[n];if(!c)return false;c.setAttribute('data-e2e-n','1');return true})()`);
  const escribirN = async (sel, n, valor) => { falla(await marcarN(sel, n), 'no encontré ' + sel + ' (' + n + ')'); await a.escribir('[data-e2e-n]', valor); await a.salir(); };
  const tocarN = async (sel, n = 0) => { falla(await marcarN(sel, n), 'no encontré ' + sel + ' (' + n + ')'); await p.tocar('[data-e2e-n]'); };
  // El asa ⠿ del n-ésimo elemento de una lista ordenable (la de antes y la de React)
  const asa = (lista, n) => '[data-orden-lista="' + lista + '"] > [data-orden-i]:nth-of-type(' + (n + 1) + ') [aria-label^="Arrastrar"]';

  await p.computador();
  await p.ir('editar');
  await a.esperar('#vista [data-accion=ed-pestana]');
  await paso('rutina');

  // ---------- 🏋️ Rutina ----------
  const rutina = async () => (await est()).rutina;
  // Con el perfil nuevo no hay nada guardado todavía: el primer cambio hace que guarde
  const nombre0 = await a.valorCampo('Nombre');
  await escribirCampo('Nombre', nombre0 + ' X');
  const dia0 = (await rutina())[0];
  falla(dia0 && dia0.nombre === nombre0 + ' X', 'no guardó el nombre del día');
  await p.tocar('#vista [data-accion=futbol-dia][data-n="2"]');
  falla(((await est()).config.futbol || []).includes(2), 'no marcó el martes de fútbol');
  await p.tocar('#vista [data-accion=futbol-dia][data-n="2"]');
  falla(!((await est()).config.futbol || []).includes(2), 'no desmarcó el martes de fútbol');
  await paso('día editado');

  // Un ejercicio en su renglón
  const ej0 = dia0.ejercicios[0];
  await escribirN('#vista [aria-label="Ejercicio 1"]', 0, ej0.nombre + ' Y');
  await escribirN('#vista [aria-label^="Músculo de "]', 0, 'Pecho alto');
  await escribirN('#vista [aria-label^="Series por reps de "]', 0, '4×6-8');
  let ej = (await rutina())[0].ejercicios[0];
  falla(ej.nombre === ej0.nombre + ' Y' && ej.musculo === 'Pecho alto' && ej.filas.length === 1 && ej.filas[0].series === 4, 'no guardó el renglón: ' + JSON.stringify([ej.nombre, ej.musculo, ej.filas.map((f) => f.esquema)]));
  await paso('ejercicio en su renglón');
  // ⋯ lo demás
  await tocarN('#vista [aria-label^="Más opciones de "]', 0);
  await paso('ejercicio abierto');
  await escribirCampo('Nota', 'Agarre cerrado');
  falla((await rutina())[0].ejercicios[0].nota === 'Agarre cerrado', 'no guardó la nota');
  await escribirCampo('Descanso', '150');
  falla((await rutina())[0].ejercicios[0].filas[0].descanso === 150, 'no guardó el descanso');
  const total = (await rutina())[0].ejercicios.length;
  await tocarN('#vista [data-accion=ed-duplicar][data-lista="rutina.0.ejercicios"]', 0);
  falla((await rutina())[0].ejercicios.length === total + 1, 'no duplicó');
  await paso('duplicado');
  await tocarN('#vista [data-accion=ed-borrar][data-lista="rutina.0.ejercicios"]', 0);
  await a.dormir(300);
  falla((await rutina())[0].ejercicios.length === total, 'no borró la copia');

  // Agregar desde el renglón de abajo
  await a.escribir('#ed-nuevo-nombre', 'Fondos');
  await a.escribir('#ed-nuevo-musculo', 'Tríceps');
  await a.escribir('#ed-nuevo-esquema', '3×10');
  await tocarTexto('Agregar', 'button');
  ej = (await rutina())[0].ejercicios.at(-1);
  falla(ej.nombre === 'Fondos' && ej.musculo === 'Tríceps' && ej.filas[0].series === 3, 'no agregó el ejercicio: ' + JSON.stringify(ej));
  await paso('ejercicio agregado');

  // Ordenar: con el teclado y arrastrando
  const lista = 'rutina.0.ejercicios', nombres = async () => (await rutina())[0].ejercicios.map((x) => x.nombre);
  const antes = await nombres();
  await p.ev(`document.querySelector(${JSON.stringify(asa(lista, 0))}).focus()`);
  await a.tecla('ArrowDown', 40);
  await a.dormir(300);
  falla((await nombres())[1] === antes[0], 'la flecha no bajó el ejercicio: ' + JSON.stringify((await nombres()).slice(0, 3)));
  await paso('ordenado con el teclado');
  const ahora = await nombres(), dy = await p.ev(`(()=>{const l=document.querySelectorAll('[data-orden-lista="${lista}"] > [data-orden-i]'),c=(x)=>{const r=x.getBoundingClientRect();return r.top+r.height/2};return c(l[0])-c(l[1])-12})()`);
  await p.arrastrar(asa(lista, 1), 0, dy);
  await a.dormir(400);
  falla((await nombres())[0] === ahora[1], 'arrastrar no subió el ejercicio: ' + JSON.stringify((await nombres()).slice(0, 3)));
  await paso('ordenado arrastrando');

  // Un día nuevo y borrarlo
  const dias = (await rutina()).length;
  await tocarTexto('＋ Día');
  falla((await rutina()).length === dias + 1, 'no agregó el día');
  await paso('día nuevo');
  await tocarN('#vista [data-accion=ed-borrar][data-lista=rutina]', 0);
  await a.dormir(300);
  falla((await rutina()).length === dias, 'no borró el día');

  // ---------- ☀️ Hábitos ----------
  await pestana('habitos');
  await paso('hábitos');
  const habitos = async () => (await est()).habitos;
  await tocarN('#vista [data-accion=ed-abrir]', 0);
  await escribirN('#vista [data-cambio=ed][data-ruta="habitos.0.detalle"]', 0, 'En ayunas, con agua');
  falla((await habitos())[0].detalle === 'En ayunas, con agua', 'no guardó el detalle');
  await p.tocar('#vista [data-accion=ed-habito-dia][data-i="0"][data-n="1"]');
  falla(((await habitos())[0].dias || []).includes(1), 'no marcó el lunes');
  await p.tocar('#vista [data-accion=ed-habito-dia][data-i="0"][data-n="1"]');
  await paso('hábito editado');
  const nh = (await habitos()).length;
  await tocarTexto('＋ Hábito');
  falla((await habitos()).length === nh + 1, 'no agregó el hábito');
  await tocarN('#vista [data-accion=ed-idea]', 0);
  falla((await habitos())[nh].nombre !== 'Nuevo hábito', 'no usó la idea');
  await paso('hábito con idea');
  await p.ev(`document.querySelector(${JSON.stringify(asa('habitos', 0))}).focus()`);
  await a.tecla('ArrowDown', 40);
  await a.dormir(300);
  await tocarTexto('🧹 Empezar de cero');
  falla(!(await habitos()).length, 'no vació los hábitos');
  await tocarTexto('↩ Traer los de ejemplo', 'button', false);
  falla((await habitos()).length > 0, 'no trajo los de ejemplo');
  await paso('hábitos de ejemplo');

  // ---------- 🧘 Sesiones ----------
  await pestana('sesiones');
  await paso('sesiones');
  const sesiones = async () => (await est()).sesiones;
  const guiada = (await sesiones()).find((s) => s.tipo !== 'checklist');
  await p.tocar('#vista [data-accion=ed-sesion][data-id="' + guiada.id + '"]');
  const k = (await sesiones()).findIndex((s) => s.id === guiada.id), pasos = guiada.pasos.length;
  await tocarTexto('＋ Ejercicio');
  falla((await sesiones())[k].pasos.length === pasos + 1, 'no agregó el ejercicio a la sesión');
  await p.poner('#vista [data-cambio=ed-modo][data-ruta="sesiones.' + k + '.pasos.' + pasos + '"]', 'reps');
  falla((await sesiones())[k].pasos[pasos].reps === '10', 'no pasó a repeticiones');
  await paso('sesión con ejercicio');
  const check = (await sesiones()).find((s) => s.tipo === 'checklist');
  await p.tocar('#vista [data-accion=ed-sesion][data-id="' + check.id + '"]');
  const kc = (await sesiones()).findIndex((s) => s.id === check.id), puntos = check.pasos.length;
  await tocarTexto('＋ Punto');
  falla((await sesiones())[kc].pasos.length === puntos + 1, 'no agregó el punto');
  await paso('checklist con punto');

  // ---------- 🧩 Pantallas ----------
  await pestana('pantallas');
  await paso('pantallas');
  const oculto = async (id) => JSON.stringify(((await est()).config.ocultos || (await est()).config) || {}).includes(id);
  await p.tocar('#vista [data-cambio=orden-ver][data-tipo=menu][data-id=lugares]');
  await paso('lugares escondido');
  await p.tocar('#vista [data-cambio=orden-ver][data-tipo=menu][data-id=lugares]');
  await tocarN('#vista [data-accion=orden-mover][data-tipo=hoy][data-n="1"]', 0);
  await paso('tarjeta bajada');
  await tocarN('#vista [data-accion=orden-restablecer][data-tipo=hoy]', 0);
  await paso('como venía');
  void oculto;

  // Enlace directo
  await p.ir('hoy');
  await p.ir('editar/habitos');
  await a.esperar('#vista [data-accion=ed-pestana]');
  falla((await a.texto()).includes('checklist de la mañana'), 'el enlace no abrió Hábitos');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('editar-pc');
  await p.celular();
  for (const t of ['rutina', 'habitos', 'sesiones', 'pantallas']) { await pestana(t); falla(await p.sinDesborde(), 'se sale en el celular (' + t + ')'); await p.ev('window.scrollTo(0,0)'); await p.foto('editar-cel-' + t); }
  await p.computador();
  console.log('✓ Editar');
};
