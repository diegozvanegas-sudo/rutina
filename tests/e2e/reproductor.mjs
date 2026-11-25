// Recorrido del reproductor de sesiones guiadas (pantalla completa, sobre cualquier sección) con clics reales:
// preparar, tiempo que corre solo, pausa y seguir, cambio de lado, anterior y saltar, saltar tocando la tira de figuras,
// repeticiones con "✓ Hecho", descanso entre series, sesión completa y, en una checklist, marcar hasta "¡Todo listo!".
// Usa dos sesiones de prueba con tiempos cortos, guardadas en este equipo.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/reproductor.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Reproductor'), { falla } = a;
  const R = '#reproductor ';
  const texto = () => p.ev(`(document.getElementById('reproductor').innerText||'').replace(/\\s+/g,' ').trim()`);
  const paso = async (nombre) => console.log('§ ' + nombre + ' :: ' + await texto());
  const abierto = () => p.ev(`(()=>{const r=document.getElementById('reproductor');return !r.hidden&&r.checkVisibility()})()`);
  const tiene = async (t) => (await texto()).toLowerCase().includes(t.toLowerCase()); // las fases van en mayúsculas (CSS)
  const esperarTexto = async (t, max = 8000) => {
    const t0 = Date.now();
    while (!(await tiene(t)) && Date.now() - t0 < max) await a.dormir(150);
    falla(await tiene(t), 'no apareció "' + t + '": ' + await texto());
  };
  const reloj = async () => { const m = (await texto()).match(/(\d+):(\d{2})/); return m ? Number(m[1]) * 60 + Number(m[2]) : -1; };
  // Abre una sesión como lo hacen los botones de la app (data-accion="sesion")
  const abrir = (id) => p.ev(`(()=>{const b=document.createElement('button');b.type='button';b.dataset.accion='sesion';b.dataset.sesion=${JSON.stringify(id)};document.getElementById('vista').append(b);b.click();b.remove()})()`);

  await p.computador();
  // En un equipo nuevo aún no hay nada guardado: se guarda algo antes (el sonido de Ajustes, dos veces)
  await p.ir('ajustes');
  // Ajustes empieza con cada tema cerrado: se abre «Avisos»
  await a.esperar('#vista [data-plegable="ajustes|Avisos"]');
  await p.ev(`document.querySelector('#vista [data-plegable="ajustes|Avisos"][data-estado=cerrada] [data-t=plegar]')?.click()`);
  await a.dormir(400);
  await a.esperar('#vista [data-cambio=conf-sonido]');
  await p.tocar('#vista [data-cambio=conf-sonido]');
  await p.tocar('#vista [data-cambio=conf-sonido]');
  const guiada = { id: 'prueba-rep', nombre: 'Prueba guiada', tipo: 'estiramiento', pasos: [
    { id: 'g1', nombre: 'Gato y vaca', seg: 3, lados: true, desc: 'Despacio, con la respiración' },
    { id: 'g2', nombre: 'Sentadilla', reps: 10, series: 2, descanso: 3, musculo: 'Piernas' },
    { id: 'g3', nombre: 'Plancha', seg: 3 },
  ] };
  const lista = { id: 'prueba-check', nombre: 'Prueba checklist', tipo: 'checklist', pasos: [{ id: 'c1', nombre: 'Cepillarme' }, { id: 'c2', nombre: 'Alistar la ropa', desc: 'la de mañana' }] };
  await p.ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1')),s=JSON.parse(localStorage[k]);s.sesiones=s.sesiones.filter(x=>!x.id.startsWith('prueba-')).concat(${JSON.stringify([guiada, lista])});localStorage[k]=JSON.stringify(s)})()`);
  await p.recargar();
  await p.ir('metas');
  await a.esperar('#vista button');
  falla(!(await abierto()), 'el reproductor se ve sin sesión');

  // Preparar (5 s) → saltar al tiempo
  await abrir('prueba-rep');
  falla(await abierto(), 'no abrió el reproductor');
  await esperarTexto('Prepárate');
  falla((await p.cuantos(R + '[data-accion=rep-paso]')) === 3, 'la tira no tiene las 3 figuras');
  falla((await p.ev(`document.querySelector('${R}[aria-current=step]')?.getAttribute('aria-label')`)) === '1. Gato y vaca', 'la tira no marca el paso 1');
  await paso('preparar');
  await p.foto('reproductor-pc');
  await p.tocar(R + '[aria-label=Saltar]');
  await esperarTexto('LADO IZQUIERDO');
  await paso('lado izquierdo');

  // Pausa: el reloj se queda quieto; seguir
  await p.tocar(R + '[data-accion=rep-pausa]');
  falla(await tiene('Seguir'), 'el botón no cambió a Seguir');
  const r1 = await reloj();
  await a.dormir(1300);
  falla((await reloj()) === r1, 'el reloj siguió en pausa');
  await p.tocar(R + '[data-accion=rep-pausa]');
  falla(await tiene('Pausa'), 'no volvió a correr');

  // Se pasa solo al cambio de lado; saltar y volver con Anterior
  await esperarTexto('CAMBIA DE LADO', 6000);
  await paso('cambio de lado');
  await p.tocar(R + '[aria-label=Saltar]');
  await esperarTexto('LADO DERECHO');
  await p.tocar(R + '[aria-label=Anterior]');
  await esperarTexto('CAMBIA DE LADO');

  // Tocar la figura 2 de la tira lleva a ese paso; reps con Hecho, descanso, serie 2
  await p.tocar(R + '[aria-label="2. Sentadilla"]');
  await esperarTexto('Prepárate');
  falla((await p.ev(`document.querySelector('${R}[aria-current=step]')?.getAttribute('aria-label')`)) === '2. Sentadilla', 'la tira no pasó al paso 2');
  await p.tocar(R + '[aria-label=Saltar]');
  await esperarTexto('SERIE 1 DE 2');
  falla(await tiene('reps') && await p.cuantos(R + '[data-accion=rep-mover][data-n="1"]:not([aria-label])'), 'no muestra las reps con "Hecho"');
  await paso('reps');
  await p.tocar(R + '[data-accion=rep-mover][data-n="1"]:not([aria-label])');
  await esperarTexto('DESCANSO');
  await paso('descanso');
  await p.tocar(R + '[aria-label=Saltar]');
  await esperarTexto('SERIE 2 DE 2');
  await p.tocar(R + '[data-accion=rep-mover][data-n="1"]:not([aria-label])');
  await esperarTexto('Plancha');
  await p.celular();
  falla(await p.sinDesborde(), 'el reproductor se sale de la pantalla en el celular');
  await p.foto('reproductor-cel');
  await p.computador();
  await p.tocar(R + '[aria-label=Saltar]');
  await p.tocar(R + '[aria-label=Saltar]');
  await esperarTexto('¡Sesión completa!');
  await paso('completa');
  await p.tocar(R + '[data-accion=rep-cerrar]');
  falla(!(await abierto()), 'Listo no cerró el reproductor');

  // Checklist: marcar los dos puntos
  await abrir('prueba-check');
  await esperarTexto('0 / 2');
  await paso('checklist');
  await p.tocar(R + '[data-accion=check-paso][data-paso=c1]');
  await esperarTexto('1 / 2');
  falla((await p.ev(`document.querySelector('${R}[data-paso=c1]').getAttribute('aria-pressed')`)) === 'true', 'el punto no quedó marcado');
  await p.tocar(R + '[data-accion=check-paso][data-paso=c2]');
  await esperarTexto('¡Todo listo!');
  await paso('checklist completa');
  await p.celular();
  falla(await p.sinDesborde(), 'la checklist se sale de la pantalla en el celular');
  await p.foto('reproductor-check-cel');
  await p.computador();
  await p.tocar(R + '[data-accion=rep-cerrar]');
  falla(!(await abierto()), 'no cerró la checklist');
  // La ✕ de arriba también cierra a la mitad
  await abrir('prueba-rep');
  await esperarTexto('Prepárate');
  await p.tocar(R + '[aria-label=Cerrar]');
  falla(!(await abierto()), '✕ no cerró el reproductor');
  console.log('✓ Reproductor');
};
