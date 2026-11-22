// Recorrido de 🔄 Dieta → Equivalencias con clics y teclado reales, en computador y celular: el ejemplo del prompt (210 g de
// arroz cocido ≈ 72 g de avena cruda), otro criterio, un sustituto sin ese nutriente, cantidad inválida, un sugerido,
// ⭐ favorito, cambiar "solo hoy" desde 🍽 Hoy (con la comida marcada: lo que suma al día cambia y el plan no) y deshacer,
// y cambiar "en el plan" desde 📋 Planes. Los confirm se aceptan solos (no se revisa su texto).
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/equivalencias.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';

export default async (p) => {
  const a = ayudas(p, 'Equivalencias'), { falla } = a;
  const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
  const hasta = async (f, ms = 6000) => { for (let t = 0; t < ms; t += 200) { if (await f()) return true; await dormir(200); } return false; };
  const esperar = (sel) => hasta(async () => (await p.cuantos(sel)) > 0);
  // Escribir de verdad: se selecciona lo que había y se teclea encima
  const escribir = async (sel, t) => { await p.tocar(sel); await p.ev(`document.querySelector(${JSON.stringify(sel)}).select()`); await p.cdp('Input.insertText', { text: t }); await dormir(250); };
  const criterio = async (nombre) => { await p.ev(`[...document.querySelectorAll('[aria-label="Criterio de equivalencia"] .MuiChip-root')].find(x=>x.innerText.includes(${JSON.stringify(nombre)})).click()`); await dormir(300); };
  const hoy = await p.ev(`(()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')})()`);
  const paso = async (nombre) => console.log('§ ' + nombre + ' :: ' + ((await p.leer('[data-t=equivalencias]')) || '').slice(0, 400));

  for (const equipo of ['computador', 'celular']) {
    await p[equipo]();
    await p.ir('dieta/equivalencias');
    falla(await esperar('[data-t=equivalencias]'), 'no abrió la pestaña');
    falla(await p.cuantos('[data-sugerido]') > 5, 'sin sugeridos al abrir');

    // El ejemplo del prompt
    await p.tocar('[data-t="elegido-Lo que tienes en el plan"] button');
    await escribir('[aria-label="Buscar lo que tienes en el plan"]', 'arroz blanco cocido');
    await p.tocar('[data-alimento="usda:arroz-cocido"]');
    await escribir('#equiv-cant', '210');
    await criterio('Calorías');
    await escribir('[aria-label="Buscar por qué lo cambias"]', 'avena');
    await p.tocar('[data-alimento="usda:avena-cruda"]');
    falla(await esperar('[data-t=cantidad]'), 'no salió el resultado');
    falla((await p.leer('[data-t=cantidad]')).includes('72 g'), 'el ejemplo no da 72 g: ' + await p.leer('[data-t=cantidad]'));
    falla((await p.leer('[data-t=comparacion] [data-k=kcal]')).includes('igual'), 'las calorías no salen iguales en la tabla');
    falla((await p.leer('[data-t=resultado]')).includes('no iguala los demás'), 'falta la aclaración de los macros');
    await paso('arroz por avena ' + equipo);
    await p.foto('equivalencias-' + equipo);
    falla(await p.sinDesborde(), 'la pantalla se desborda en ' + equipo);
    falla(await p.ev(`document.querySelector('[data-t=comparacion]').getBoundingClientRect().right <= document.querySelector('[data-t=equivalencias]').getBoundingClientRect().right + 1`), 'la tabla se sale de la tarjeta en ' + equipo);

    // ⭐ Favorito y quitarlo
    await p.tocar('[aria-label="Guardar como favorito"]');
    falla(await hasta(async () => ((await p.estado())?.dieta.favoritosEquiv || []).some((f) => f.de === 'usda:arroz-cocido' && f.a === 'usda:avena-cruda' && f.criterio === 'kcal')), 'no guardó el favorito');
    falla(await esperar('[data-favorito="usda:arroz-cocido>usda:avena-cruda"]'), 'el favorito no sale en la lista');

    // Otro criterio, un sustituto sin ese nutriente y una cantidad inválida
    await criterio('Proteína');
    falla(/≈ \d+ g/.test(await p.leer('[data-t=cantidad]')), 'por proteína no dio cantidad');
    await criterio('Carbohidratos');
    await p.tocar('[data-t="elegido-Por qué lo cambias"] button');
    await escribir('[aria-label="Buscar por qué lo cambias"]', 'pechuga cruda');
    await p.tocar('[data-alimento="usda:pechuga-cruda"]');
    falla((await p.leer('[data-t=resultado]')).includes('no tiene carbohidratos'), 'no avisó que el sustituto no tiene carbohidratos');
    await escribir('#equiv-cant', '-5');
    falla((await a.texto()).includes('mayor que cero'), 'no avisó la cantidad inválida');
    await escribir('#equiv-cant', '200');
    // El favorito vuelve a armar arroz → avena por calorías
    await p.tocar('[data-favorito="usda:arroz-cocido>usda:avena-cruda"]');
    await dormir(300);
    falla((await p.leer('[data-t=cantidad]')).includes('69 g'), 'el favorito no aplicó: ' + await p.leer('[data-t=cantidad]'));
    await p.tocar('[aria-label="Quitar de favoritos"]');
    falla(await hasta(async () => !((await p.estado())?.dieta.favoritosEquiv || []).length), 'no quitó el favorito');
    // Un sugerido
    await p.tocar('[data-sugerido="usda:papa-cocida"]');
    await dormir(300);
    falla((await p.leer('[data-t=resultado]')).includes('Papa'), 'tocar un sugerido no lo eligió');

    // Solo hoy, desde 🍽 Hoy, con el almuerzo marcado
    await p.ir('dieta/hoy');
    falla(await esperar('[data-accion=dieta-equiv-abrir][data-origen=hoy]'), 'Hoy no tiene "Cambiar un alimento"');
    const marcada = await p.ev(`document.querySelector('[data-accion=dieta-comer][data-i="1"]').getAttribute('aria-pressed')`);
    if (marcada !== 'true') await p.tocar('[data-accion=dieta-comer][data-i="1"]');
    let est = await p.estado();
    const clave = Object.keys(est.dias[hoy].comidas).find((k) => k.endsWith(':1')), tipo = clave.split(':')[0], foto = est.dias[hoy].comidas[clave];
    const planAntes = JSON.stringify(est.dieta.planes[tipo].comidas[1].items);
    await p.tocar('[data-accion=dieta-equiv-abrir][data-i="1"][data-origen=hoy]');
    falla(await esperar('[data-t=cambiando]'), 'no se abrió con la comida');
    await p.ev(`[...document.querySelectorAll('[aria-label="Alimento de la comida"] button')].find(b=>!b.disabled).click()`);
    falla(await esperar('[data-sugerido]'), 'no salieron sugeridos para el alimento de la comida');
    await p.tocar('[data-sugerido]');
    falla(await esperar('[data-t=guardar-cambio]'), 'no salieron los botones para guardar');
    await p.ev(`[...document.querySelectorAll('[data-t=guardar-cambio] button')].find(b=>b.innerText.includes('Solo hoy')).click()`);
    falla(await esperar('[data-accion=dieta-equiv-deshacer]'), 'Hoy no dice que la comida se cambió');
    est = await p.estado();
    falla(est.dias[hoy].cambios && est.dias[hoy].cambios[clave], 'no guardó el cambio de hoy');
    falla(JSON.stringify(est.dieta.planes[tipo].comidas[1].items) === planAntes, 'solo hoy cambió el plan');
    falla(est.dias[hoy].comidas[clave].ts === foto.ts, 'la comida marcada perdió su hora');
    await p.foto('equivalencias-solo-hoy-' + equipo);
    await p.tocar('[data-accion=dieta-equiv-deshacer]');
    falla(await hasta(async () => !((await p.estado()).dias[hoy].cambios || {})[clave]), 'deshacer no quitó el cambio');

    // En el plan, desde 📋 Planes
    await p.ir('dieta/planes');
    falla(await esperar('[data-accion=dieta-equiv-abrir][data-origen=planes]'), 'Planes no tiene 🔄');
    const [pt, pi, pj] = (await p.ev(`(()=>{const b=document.querySelector('[data-accion=dieta-equiv-abrir][data-origen=planes]');return [b.dataset.tipo,b.dataset.i,b.dataset.j].join('|')})()`)).split('|');
    await p.tocar('[data-accion=dieta-equiv-abrir][data-origen=planes]');
    falla(await esperar('[data-sugerido]'), 'no salieron sugeridos desde Planes');
    const elegido = await p.ev(`document.querySelector('[data-sugerido]').dataset.sugerido`);
    await p.tocar('[data-sugerido]');
    falla(await esperar('[data-t=guardar-cambio]'), 'no salió "Cambiar en el plan"');
    await p.ev(`[...document.querySelectorAll('[data-t=guardar-cambio] button')].find(b=>b.innerText.includes('en el plan')).click()`);
    est = await p.estado();
    const nuevo = est.dieta.planes[pt].comidas[pi].items[pj];
    falla(nuevo && (nuevo.alimento === elegido.replace(/^tu:/, '') || nuevo.alimento === elegido.replace(/^usda:/, 'usda-')), 'el plan no cambió: ' + JSON.stringify(nuevo) + ' / ' + elegido);
    falla(est.dieta.alimentos.some((x) => x.id === nuevo.alimento), 'el alimento nuevo no está en 🥚 Alimentos');
    falla((await p.ev(`document.querySelector('[aria-label="Pestañas de Dieta"] [aria-pressed=true]')?.innerText`) || '').includes('Planes'), 'no volvió a Planes');
    falla(await p.sinDesborde(), 'Planes se desborda en ' + equipo);
  }
  console.log('✓ Equivalencias');
};
