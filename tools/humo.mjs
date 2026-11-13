// Prueba de humo de las pantallas: abre cada sección en computador y en celular y falla si alguna queda vacía,
// se sale de la pantalla hacia los lados o deja errores en la consola. No reemplaza probar a mano lo que se cambió.
//   npm run humo
const SECCIONES = ['hoy', 'calendario', 'progreso', 'manana', 'metas', 'estudiar', 'libros', 'dieta', 'suplementos', 'finanzas', 'compras', 'recordatorios', 'lugares', 'gym', 'clientes', 'entrenador', 'sesiones', 'editar', 'ajustes'];
// Pestañas dentro de una sección (se abren con su botón)
const PESTANAS = { finanzas: ['fin-pestana', ['registrar', 'calcular', 'mes', 'resumen', 'presupuesto', 'fijos', 'ahorro', 'deudas', 'prestamos', 'esperas', 'planb']], editar: ['ed-pestana', ['rutina', 'habitos', 'sesiones', 'pantallas']] };

export default async (p) => {
  const fallas = [];
  const revisar = async (donde, nombre) => {
    const largo = await p.ev(`document.getElementById('vista').innerText.trim().length`);
    if (largo < 20) fallas.push(donde + ' · ' + nombre + ': pantalla vacía');
    if (!(await p.sinDesborde())) fallas.push(donde + ' · ' + nombre + ': se sale de la pantalla hacia los lados');
    // En el celular, si algo no cabe el navegador agranda la página (innerWidth pasa de 390) en vez de desbordar: sinDesborde no lo ve
    if (donde === 'celular' && (await p.ev('innerWidth')) !== 390) fallas.push(donde + ' · ' + nombre + ': la página quedó más ancha que el celular (' + (await p.ev('innerWidth')) + ' px)');
  };
  for (const [donde, poner] of [['computador', p.computador], ['celular', p.celular]]) {
    await poner();
    for (const s of SECCIONES) {
      await p.ir(s);
      const en = await p.ev('location.hash.slice(1)');
      if (en !== s) fallas.push(donde + ' · ' + s + ': no abrió (quedó en "' + en + '")');
      await revisar(donde, s);
      if (PESTANAS[s]) for (const t of PESTANAS[s][1]) {
        await p.ev(`document.querySelector('[data-accion=${PESTANAS[s][0]}][data-p=${t}]').click()`);
        await p.dormir(250);
        await revisar(donde, s + '/' + t);
        // Plan B tiene un segundo módulo (liderazgo)
        if (t === 'planb') { await p.ev(`document.querySelector('[data-accion=pb-modulo][data-v=lider]').click()`); await p.dormir(250); await revisar(donde, 'finanzas/planb/liderazgo'); await p.ev(`document.querySelector('[data-accion=pb-modulo][data-v=desempleo]').click()`); }
      }
    }
    // Gym por dentro: un día de entreno (con una serie anotada y el historial abierto) y las pestañas
    await p.ir('gym');
    await p.tocar('nav.chips .chip');
    await p.dormir(700);
    await p.ev(`(()=>{const c=document.querySelector('.ejercicio.actual [data-serie]');c.focus({preventScroll:true});c.value='8'})()`);
    await p.tocar('.ejercicio.actual [data-accion=serie]');
    await p.dormir(500);
    if (!(await p.cuantos('[data-accion=gym-rir]'))) fallas.push(donde + ' · gym: la serie no quedó anotada');
    await revisar(donde, 'gym (día)');
    for (const dia of ['resumen', 'plan12', 'casa']) {
      await p.tocar('[data-accion=ir-dia][data-dia=' + dia + ']');
      await p.dormir(500);
      await revisar(donde, 'gym (' + dia + ')');
    }
  }
  if (fallas.length) throw new Error(fallas.length + ' falla(s):\n  ' + fallas.join('\n  '));
  console.log('✓ ' + SECCIONES.length + ' secciones y 4 vistas del Gym, en computador y celular');
};
