// Recorrido de 🌅 Primera hora con clics y teclado reales: marcar y desmarcar un hábito, la versión mínima, las 3
// prioridades, un hábito con texto, el cronómetro, la cuenta regresiva y agregar un hábito nuevo.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/manana.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

export default async (p) => {
  const a = ayudas(p, 'Mañana'), { paso, falla, escribirCampo } = a;
  const d = async () => ((((await p.estado()) || {}).dias || {})[iso()]) || {};
  const habitos = async () => ((await p.estado()) || {}).habitos || [];
  const hay = (s) => p.cuantos('#vista ' + s);

  await p.computador();
  await p.ir('manana');
  await a.esperar('#vista h1');
  await paso('inicio');

  // Marcar y desmarcar el primero
  const id = await p.ev(`document.querySelector('#vista [data-accion=marcar]').dataset.id`);
  await p.tocar('#vista [data-accion=marcar][data-id="' + id + '"]');
  falla(((await d()).habitos || {})[id], 'no marcó el hábito');
  await paso('marcado');
  await p.tocar('#vista [data-accion=marcar][data-id="' + id + '"]');
  falla(!((await d()).habitos || {})[id], 'no desmarcó el hábito');

  // Versión mínima
  if (await hay('[data-accion=marcar-minimo]')) {
    const m = await p.ev(`document.querySelector('#vista [data-accion=marcar-minimo]').dataset.id`);
    await p.tocar('#vista [data-accion=marcar-minimo][data-id="' + m + '"]');
    falla(((await d()).habitos || {})[m]?.minimo, 'no marcó la versión mínima');
    await paso('mínimo');
  }

  // Las 3 prioridades
  await escribirCampo('🎯 Mis 3 prioridades de hoy', '1. Gym\n2. Estudiar\n3. Llamar a mamá');
  falla((await d()).prioridades === '1. Gym\n2. Estudiar\n3. Llamar a mamá', 'no guardó las prioridades: ' + JSON.stringify((await d()).prioridades));

  // Un hábito con texto
  if (await hay('[data-cambio=habito-texto]')) {
    await a.escribir('#vista [data-cambio=habito-texto]', 'Agradezco el día');
    await a.salir();
    await paso('texto');
  }

  // Cronómetro
  if (await hay('[data-accion=crono]')) {
    const c = await p.ev(`document.querySelector('#vista [data-accion=crono]').dataset.id`);
    await p.tocar('#vista [data-accion=crono][data-id="' + c + '"]');
    await a.dormir(1300);
    await p.tocar('#vista [data-accion=crono][data-id="' + c + '"]');
    const x = ((await d()).crono || {})[c];
    falla(x && !x.inicio && x.acumulado >= 1, 'el cronómetro no contó: ' + JSON.stringify(x));
    await paso('cronómetro');
  }

  // Cuenta regresiva: arranca el temporizador y se para
  if (await hay('[data-accion=cuenta]')) {
    await p.tocar('#vista [data-accion=cuenta]');
    falla((await a.texto()).includes('Cronómetro en curso'), 'no arrancó la cuenta regresiva');
    await paso('cuenta');
    await p.tocar('[data-accion=t-parar]');
  }

  // Hábito nuevo
  const n = (await habitos()).length;
  await p.poner('#vista [aria-label="Tipo del nuevo hábito"]', 'texto');
  await a.escribir('#vista [aria-label="Nuevo hábito de la mañana"]', 'Leer 10 páginas');
  await a.salir();
  const h = await habitos();
  falla(h.length === n + 1 && h[n].nombre === 'Leer 10 páginas' && h[n].tipo === 'texto', 'no agregó el hábito: ' + JSON.stringify(h[n]));
  falla((await a.aviso()).includes('Agregado: Leer 10 páginas'), 'no avisó');
  await paso('nuevo');

  falla(await p.sinDesborde(), 'se sale de la pantalla en el computador');
  await p.foto('manana-pc');
  await p.celular();
  await p.ir('manana');
  await a.esperar('#vista h1');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  await p.foto('manana-cel');
  await p.computador();
  console.log('✓ Mañana');
};
