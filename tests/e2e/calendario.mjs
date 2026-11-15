// Recorrido de 📅 Calendario con clics reales. Fija lo que hace la pantalla para que una migración no lo cambie:
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/calendario.mjs <carpeta de capturas>
// Los elementos se buscan por data-t (no por clases de estilo), para que cambiar el diseño no rompa la prueba.
// Imprime lo que se ve en cada paso (líneas "§"): antes y después de migrar deben salir iguales.
export default async (p) => {
  const texto = () => p.ev(`document.getElementById('vista').textContent.replace(/[▾▸]/g,'').replace(/\\s+/g,' ').trim()`);
  const paso = async (nombre) => console.log('§ ' + nombre + ' :: ' + await texto());
  const marcar = (titulo) => p.ev(`(()=>{document.querySelectorAll('[data-e2e]').forEach(x=>x.removeAttribute('data-e2e'));const s=[...document.querySelectorAll('#vista [data-t=tarjeta]')].find(x=>x.querySelector('h2')?.textContent.includes(${JSON.stringify(titulo)}));s?.setAttribute('data-e2e','1');return !!s})()`);
  const falla = (cond, msg) => { if (!cond) throw new Error('Calendario: ' + msg); };

  // La pantalla se descarga al abrirla: se espera a que esté (máx. 8 s) y se anota cuánto tardó la primera vez
  const abrir = async () => {
    await p.ir('calendario');
    const t0 = Date.now();
    while (!(await p.cuantos('[data-t=dia]')) && Date.now() - t0 < 8000) await new Promise((r) => setTimeout(r, 100));
    return Date.now() - t0;
  };
  console.log('espera al abrir (ms):', await abrir());
  await paso('inicio');
  falla(await p.cuantos('[data-t=dia]') >= 28, 'faltan días en la rejilla');
  falla(await p.cuantos('[data-t=dia][data-hoy]') === 1 && await p.cuantos('[data-t=dia][aria-pressed=true]') === 1, 'hoy debe estar marcado y elegido');
  falla(await p.cuantos('[data-t=volver-hoy]') === 0, '"Volver a hoy" no sale estando en hoy');
  await p.foto('cal-pc');

  await p.tocar('[aria-label="Mes siguiente"]');
  await paso('mes siguiente');
  falla(await p.cuantos('[data-t=volver-hoy]') === 1, 'falta "Volver a hoy" en otro mes');
  await p.tocar('[data-t=rejilla] > :nth-child(4) > :nth-child(3)');
  await paso('día elegido');
  falla(await p.cuantos('[data-t=dia][aria-pressed=true]') === 1, 'un solo día elegido');

  // Salir y volver: se queda en el mes y el día que se estaban viendo
  await p.ir('metas');
  await abrir();
  await paso('al volver');

  await p.tocar('[aria-label="Mes anterior"]');
  await p.tocar('[aria-label="Mes anterior"]');
  await paso('dos meses atrás');
  await p.tocar('[data-t=volver-hoy]');
  await paso('volver a hoy');
  falla(await p.cuantos('[data-t=volver-hoy]') === 0, '"Volver a hoy" debe quitarse');

  // Tarjeta plegable: se cierra, lo recuerda al recargar y se vuelve a abrir
  falla(await marcar('Próximos festivos'), 'no está la tarjeta de festivos');
  await p.tocar('[data-e2e] [data-t=plegar]');
  await marcar('Próximos festivos');
  falla(await p.cuantos('[data-e2e][data-estado=cerrada]') === 1, 'la tarjeta no se cerró');
  falla(await p.ev(`document.querySelector('[data-e2e] [data-t=plegar]').getAttribute('aria-expanded')`) === 'false', 'aria-expanded');
  await p.recargar();
  await abrir();
  await marcar('Próximos festivos');
  falla(await p.cuantos('[data-e2e][data-estado=cerrada]') === 1, 'no recordó la tarjeta cerrada');
  await p.tocar('[data-e2e] h2');
  await marcar('Próximos festivos');
  falla(await p.cuantos('[data-e2e][data-estado=cerrada]') === 0, 'la tarjeta no se abrió tocando el título');
  console.log('§ plegables :: ' + await p.ev(`[...document.querySelectorAll('#vista [data-plegable]')].map(x=>x.dataset.plegable).join(' ; ')`));

  await p.celular();
  await abrir();
  falla(await p.sinDesborde(), 'se desborda en el celular');
  await paso('celular');
  await p.foto('cal-cel');
  await p.computador();
  console.log('✓ Calendario');
};
