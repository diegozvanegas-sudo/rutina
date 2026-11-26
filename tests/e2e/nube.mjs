// Sincronizar con la nube sin mover todo (nube.js con rutina_version y rutina_guardar_partes de supabase/esquema.sql), con
// una nube de mentira que hace lo mismo que esas funciones y cuenta los bytes de cada llamada. Cambios con clics reales:
// la primera subida va completa; un toque sube solo su parte; sin cambios solo se pregunta la versión; lo que cambió otro
// equipo baja; si los dos cambiaron se combinan; y con la nube de antes (sin las funciones nuevas) todo sigue igual.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/nube.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

const NUBE = `(() => {
  // versiones: lo que había en cada versión guardada, para responder rutina_cambios (lo que cambió desde una versión)
  const s = { fila: null, llamadas: [], vieja: false, versiones: {} };
  const copia = (x) => JSON.parse(JSON.stringify(x));
  const guardar = (datos, version) => { if (!s.fila || s.fila.version <= version) { s.fila = { datos: copia(datos), version }; s.versiones[version] = copia(datos); } return s.fila.version; };
  const rpc = async (nombre, args = {}) => {
    await new Promise((r) => setTimeout(r, 30));
    let data = null, error = null;
    // Como rutina.exigir_nivel: con nivel mínimo, no deja guardar a una versión de la app de nivel menor
    if (s.minimo && (nombre === 'rutina_guardar' || nombre === 'rutina_guardar_partes') && (args.p_app || 0) < s.minimo) error = { message: 'Versión vieja de la app: cierra la app y ábrela otra vez para actualizarla.' };
    else if (s.vieja && (nombre === 'rutina_version' || nombre === 'rutina_guardar_partes' || nombre === 'rutina_cambios')) error = { code: 'PGRST202', message: 'Could not find the function public.' + nombre };
    else if (nombre === 'rutina_version') data = s.fila ? s.fila.version : null;
    else if (nombre === 'rutina_cambios') {
      const antes = s.versiones[args.p_desde];
      data = s.fila && antes ? { version: s.fila.version, ...(await import('/src/combinar.js')).cambiosParaNube(antes, s.fila.datos) } : null;
    }
    else if (nombre === 'rutina_leer') data = s.fila ? [copia(s.fila)] : [];
    else if (nombre === 'rutina_guardar') data = guardar(args.p_datos, args.p_version);
    else if (nombre === 'rutina_guardar_partes') {
      if (!s.fila || s.fila.version !== args.p_base) data = s.fila ? s.fila.version : 0;
      else {
        const d = copia(s.fila.datos);
        for (const [a, b] of args.p_quitar) { if (b == null) delete d[a]; else if (d[a] && typeof d[a] === 'object') delete d[a][b]; }
        for (const { ruta: [a, b], valor } of args.p_partes) { if (b == null) d[a] = valor; else { if (!d[a] || typeof d[a] !== 'object' || Array.isArray(d[a])) d[a] = {}; d[a][b] = valor; } }
        data = guardar(d, args.p_version);
      }
    }
    s.llamadas.push({ nombre, sube: JSON.stringify(args).length, baja: JSON.stringify(data).length });
    return { data, error };
  };
  return { s, cliente: { rpc } };
})()`;

export default async (p) => {
  const a = ayudas(p, 'Nube'), { falla, tocarTexto } = a;
  const llamadas = async () => p.ev(`window.__nube.s.llamadas.splice(0)`);
  const nombres = (ls) => ls.map((x) => x.nombre).filter((n) => n !== 'rutina_mis_permisos' && n !== 'rutina_error_anotar').join(' ');
  const enNube = () => p.ev(`window.__nube.s.fila && window.__nube.s.fila.datos`);
  const sincronizar = () => p.ev(`window.rutinaPrueba.sincronizar()`);
  // Espera a que la subida programada (3 s después de un cambio) termine
  const esperarSubida = async () => { await a.dormir(3600); for (let i = 0; i < 30 && (await p.ev(`window.rutinaPrueba.estadoNube().estado`)) !== 'al-dia'; i++) await a.dormir(200); };
  const agua = async () => (((await enNube()) || {}).dias || {})[iso()]?.metas?.agua;

  await p.computador();
  await p.ev(`window.__nube = ${NUBE}; window.rutinaPrueba.nube(window.__nube.cliente, { id: 'u-prueba', correo: 'prueba@ejemplo.com' })`);
  await p.ev(`window.rutinaPrueba.ejemplo()`);
  await a.dormir(300);

  // 1. Primera vez: no hay nada en la nube → se sube todo
  await sincronizar();
  let ls = await llamadas();
  falla(nombres(ls) === 'rutina_version rutina_guardar', 'primera vez: ' + nombres(ls));
  const todo = ls.find((x) => x.nombre === 'rutina_guardar').sube;
  console.log('✓ primera subida completa: ' + Math.round(todo / 1024) + ' kB');

  // 2. Un toque real: sube solo el día de hoy
  await p.ir('metas'); await a.esperar('#vista h1');
  await tocarTexto('+250 ml');
  await esperarSubida();
  ls = await llamadas();
  falla(nombres(ls) === 'rutina_version rutina_guardar_partes', 'después de un toque: ' + nombres(ls));
  const parte = ls.find((x) => x.nombre === 'rutina_guardar_partes').sube;
  falla(parte * 10 < todo, 'la subida por partes pesó ' + parte + ' de ' + todo + ' bytes');
  falla((await agua()) === 250, 'la nube no tiene el agua: ' + (await agua()));
  falla(JSON.stringify(await enNube()) === JSON.stringify(await p.ev(`(async () => (await import('/src/estado.js')).datosParaNube())()`)), 'la nube quedó distinta de este equipo');
  console.log('✓ un toque sube ' + parte + ' bytes (antes ' + Math.round(todo / 1024) + ' kB) y la nube queda igual al equipo');

  // 3. Sin cambios: solo se pregunta la versión, no se baja nada
  await sincronizar(); await sincronizar();
  ls = await llamadas();
  falla(nombres(ls) === 'rutina_version rutina_version', 'sin cambios: ' + nombres(ls));
  console.log('✓ sin cambios baja ' + ls.reduce((s, x) => s + x.baja, 0) + ' bytes en 2 revisiones (antes ' + Math.round(todo / 1024) + ' kB cada una)');

  // 4. Otro equipo cambió algo → se baja y se ve aquí
  await p.ev(`(() => { const f = window.__nube.s.fila; f.datos.config.nombre = 'Desde el otro'; f.version += 5000; f.datos.cambio = f.version; })()`);
  await sincronizar();
  ls = await llamadas();
  // Baja solo lo que cambió (rutina_cambios), no todo
  falla(nombres(ls) === 'rutina_version rutina_cambios', 'cambio en otro equipo: ' + nombres(ls));
  falla((await p.estado()).config.nombre === 'Desde el otro', 'no bajó el cambio del otro equipo');
  const bajo = ls.find((x) => x.nombre === 'rutina_cambios').baja;
  falla(bajo * 10 < todo, 'lo que cambió en el otro equipo pesó ' + bajo + ' de ' + todo + ' bytes');
  falla(JSON.stringify(await enNube()) === JSON.stringify(await p.ev(`(async () => (await import('/src/estado.js')).datosParaNube())()`)), 'este equipo quedó distinto de la nube');
  console.log('✓ lo de otro equipo baja: ' + bajo + ' bytes (antes ' + Math.round(todo / 1024) + ' kB)');

  // 5. Los dos cambiaron: este equipo toca y el otro guarda antes de que suba → se combinan, nada se pierde
  await tocarTexto('+250 ml');
  await p.ev(`(() => { const f = window.__nube.s.fila; f.datos.config.otro = 'sí'; f.version += 1; f.datos.cambio = f.version; })()`);
  await esperarSubida();
  ls = await llamadas();
  falla(ls.some((x) => x.nombre === 'rutina_cambios'), 'con los dos cambiados no bajó para combinar: ' + nombres(ls));
  const n = await enNube();
  falla(n.config.otro === 'sí' && n.dias[iso()].metas.agua === 500, 'se perdió algo al combinar: ' + JSON.stringify({ otro: n.config.otro, agua: n.dias[iso()].metas.agua }));
  falla((await p.estado()).config.otro === 'sí', 'este equipo no tiene lo del otro');
  console.log('✓ cambios de los dos lados se combinan: ' + nombres(ls));

  // 6. Copia vieja (23 nov 2026: una pestaña vieja subió su copia y borró días, movimientos y recordatorios): otro equipo
  // anotó 8 movimientos y la copia de base de este quedó con lo nuevo pero con la versión de lo viejo. Al tocar algo aquí,
  // nada de lo del otro se borra de la nube (el freno junta en vez de borrar) y lo de aquí también sube
  await p.ev(`(() => { const f = window.__nube.s.fila, ms = f.datos.finanzas.movimientos;
    for (let i = 0; i < 8; i++) ms.push({ id: 'otro-' + i, tipo: 'gasto', monto: 1000 + i, categoria: 'otros', fecha: '2026-11-20', nota: 'del otro equipo' });
    f.version += 10; f.datos.cambio = f.version; window.__nube.s.versiones[f.version] = JSON.parse(JSON.stringify(f.datos)); })()`);
  await p.ev(`(async () => { const est = await import('/src/estado.js'); const f = window.__nube.s.fila;
    localStorage.setItem(est.claveActual() + ':base', JSON.stringify({ baseV2: true, version: est.e().nube.base, datos: f.datos })); })()`);
  await tocarTexto('+250 ml');
  await esperarSubida(); await sincronizar();
  ls = await llamadas();
  const n6 = await enNube(), otros = n6.finanzas.movimientos.filter((m) => /^otro-/.test(m.id)).length;
  falla(otros === 8, 'la copia vieja borró movimientos del otro equipo: quedaron ' + otros + ' de 8 (' + nombres(ls) + ')');
  falla(n6.dias[iso()].metas.agua === 750, 'lo de este equipo no subió: agua ' + n6.dias[iso()].metas.agua);
  falla((await p.estado()).finanzas.movimientos.filter((m) => /^otro-/.test(m.id)).length === 8, 'este equipo no quedó con lo del otro');
  console.log('✓ una copia vieja no borra nada de la nube: los 8 movimientos del otro equipo siguen y lo de aquí subió');

  // 6b. Versión vieja (rutina.exigir_nivel): cada guardado lleva el nivel de la app; si la nube pide uno mayor, no se
  // guarda nada, no se insiste cada 20 s y lo de aquí queda en el equipo hasta que la app se actualice
  await p.ev(`window.__nube.s.minimo = 99`);
  const aguaAntes = await agua();
  await tocarTexto('+250 ml');
  await a.dormir(3800);
  ls = await llamadas();
  const estadoVieja = await p.ev(`window.rutinaPrueba.estadoNube()`);
  falla(estadoVieja.vieja === true, 'la nube dijo versión vieja y la app no se enteró: ' + JSON.stringify(estadoVieja));
  falla((await agua()) === aguaAntes, 'con versión vieja la nube cambió: ' + aguaAntes + ' → ' + (await agua()));
  falla((await p.estado()).dias[iso()].metas.agua === aguaAntes + 250, 'lo de este equipo se perdió');
  await sincronizar();
  ls = await llamadas();
  falla(!nombres(ls), 'con versión vieja siguió insistiendo: ' + nombres(ls));
  console.log('✓ versión vieja: la nube no deja guardar, la app no insiste y lo de aquí queda en el equipo');
  // Al actualizarse (aquí: otra vez la nube sin mínimo y la app «nueva»), lo de este equipo sube
  await p.ev(`window.__nube.s.minimo = 0`);
  await p.ev(`window.rutinaPrueba.nube(window.__nube.cliente, { id: 'u-prueba', correo: 'prueba@ejemplo.com' })`);
  await sincronizar(); await esperarSubida();
  falla((await agua()) === aguaAntes + 250, 'después de actualizar no subió lo de este equipo: ' + (await agua()));
  await llamadas();
  console.log('✓ al actualizarse, lo que quedó en el equipo sube');

  // 7. La nube de antes (sin las funciones nuevas): todo sigue funcionando como siempre
  await p.ev(`window.__nube.s.vieja = true`);
  await p.ev(`window.rutinaPrueba.nube(window.__nube.cliente, { id: 'u-prueba', correo: 'prueba@ejemplo.com' })`);
  const agua7 = await agua();
  await tocarTexto('+250 ml');
  await esperarSubida();
  ls = await llamadas();
  falla(/rutina_leer rutina_guardar$/.test(nombres(ls)), 'con la nube de antes: ' + nombres(ls));
  falla((await agua()) === agua7 + 250, 'con la nube de antes no subió: ' + (await agua()));
  await sincronizar();
  ls = await llamadas();
  falla(nombres(ls) === 'rutina_leer', 'con la nube de antes, sin cambios: ' + nombres(ls));
  console.log('✓ con la nube de antes funciona como siempre');
  console.log('✓ Nube');
};
