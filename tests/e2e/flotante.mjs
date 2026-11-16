// Recorrido del cronómetro flotante (abajo, sobre cualquier pantalla): un tiempo de hábito desde ☀️ Mañana que corre y
// se termina con ✕, y un descanso del gym (guardado como lo deja el Gym) con "+30 s", que sigue al cambiar de pantalla.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/flotante.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Cronómetro'), { falla, tocarTexto } = a;
  const activo = async () => ((await p.estado()) || {}).activo || null;
  const visible = () => p.ev(`(()=>{const f=document.getElementById('flotante');return !!f&&!f.hidden&&f.checkVisibility()})()`);
  const reloj = () => p.ev(`document.querySelector('#flotante [role=timer], #flotante')?.innerText.match(/\\d+:\\d{2}/)?.[0] || ''`);
  const seg = (t) => { const [m, s] = t.split(':').map(Number); return m * 60 + s; };
  const paso = async (nombre) => console.log('§ ' + nombre + ' :: ' + await p.ev(`(document.getElementById('flotante').innerText||'').replace(/\\s+/g,' ').trim()`));

  await p.computador();
  await p.ir('manana');
  await a.esperar('#vista button');
  falla(!(await visible()), 'el cronómetro se ve sin nada en curso');

  // Un hábito con tiempo
  await tocarTexto('60 s');
  falla((await activo())?.tipo === 'habito', 'no empezó el tiempo del hábito: ' + JSON.stringify(await activo()));
  falla(await visible(), 'no apareció el cronómetro');
  const r1 = await reloj();
  await a.dormir(2200);
  const r2 = await reloj();
  falla(seg(r2) < seg(r1), 'el reloj no corre: ' + r1 + ' → ' + r2);
  falla((await p.ev(`[...document.querySelectorAll('#flotante *')].some(x=>x.getBoundingClientRect().height<=6&&x.getBoundingClientRect().width>0)`)), 'la barrita de avance no avanza');
  falla(!(await p.cuantos('#flotante [data-accion=t-sumar]')), 'un hábito no debería tener +30 s');
  await paso('hábito');
  await p.foto('flotante-pc');
  // Sigue al cambiar de pantalla
  await p.ir('metas');
  falla(await visible(), 'el cronómetro desapareció al cambiar de pantalla');
  await p.tocar('#flotante [aria-label="Terminar"]');
  falla(!(await activo()) && !(await visible()), '✕ no lo terminó');

  // Un descanso del gym (como lo guarda el Gym al anotar una serie)
  await p.ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1')),s=JSON.parse(localStorage[k]);s.activo={tipo:'descanso',nombre:'Press banca',total:90,fin:Date.now()+90000};localStorage[k]=JSON.stringify(s)})()`);
  await p.recargar();
  await p.ir('hoy');
  await a.esperar('#flotante [data-accion=t-sumar]');
  await paso('descanso');
  const total = (await activo()).total;
  await p.tocar('#flotante [data-accion=t-sumar]');
  falla((await activo()).total === total + 30, 'no sumó 30 s');
  falla(seg(await reloj()) > 100, 'el reloj no muestra los 30 s de más: ' + await reloj());
  await p.celular();
  falla(await visible(), 'no se ve en el celular');
  falla(await p.sinDesborde(), 'se sale de la pantalla en el celular');
  falla(await p.ev(`(()=>{const r=document.getElementById('flotante').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight})()`), 'el cronómetro no cabe en el celular');
  await p.foto('flotante-cel');
  await p.computador();
  await p.tocar('#flotante [aria-label="Terminar"]');
  falla(!(await activo()) && !(await visible()), '✕ no terminó el descanso');
  console.log('✓ Cronómetro');
};
