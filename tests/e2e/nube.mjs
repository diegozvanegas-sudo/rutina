// Sincronizar con la nube sin mover todo (nube.js con rutina_version y rutina_guardar_partes de supabase/esquema.sql), con
// una nube de mentira que hace lo mismo que esas funciones y cuenta los bytes de cada llamada. Cambios con clics reales:
// la primera subida va completa; un toque sube solo su parte; sin cambios solo se pregunta la versión; lo que cambió otro
// equipo baja; si los dos cambiaron se combinan; y con la nube de antes (sin las funciones nuevas) todo sigue igual.
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/nube.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { iso } from '../../src/fechas.js';

const NUBE = `(() => {
  const s = { fila: null, llamadas: [], vieja: false };
  const copia = (x) => JSON.parse(JSON.stringify(x));
  const guardar = (datos, version) => { if (!s.fila || s.fila.version <= version) s.fila = { datos: copia(datos), version }; return s.fila.version; };
  const rpc = async (nombre, args = {}) => {
    await new Promise((r) => setTimeout(r, 30));
    let data = null, error = null;
    if (s.vieja && (nombre === 'rutina_version' || nombre === 'rutina_guardar_partes')) error = { code: 'PGRST202', message: 'Could not find the function public.' + nombre };
    else if (nombre === 'rutina_version') data = s.fila ? s.fila.version : null;
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
  const nombres = (ls) => ls.map((x) => x.nombre).filter((n) => n !== 'rutina_mis_permisos').join(' ');
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
  falla(nombres(ls) === 'rutina_version rutina_leer', 'cambio en otro equipo: ' + nombres(ls));
  falla((await p.estado()).config.nombre === 'Desde el otro', 'no bajó el cambio del otro equipo');
  console.log('✓ lo de otro equipo baja');

  // 5. Los dos cambiaron: este equipo toca y el otro guarda antes de que suba → se combinan, nada se pierde
  await tocarTexto('+250 ml');
  await p.ev(`(() => { const f = window.__nube.s.fila; f.datos.config.otro = 'sí'; f.version += 1; f.datos.cambio = f.version; })()`);
  await esperarSubida();
  ls = await llamadas();
  falla(ls.some((x) => x.nombre === 'rutina_leer'), 'con los dos cambiados no bajó para combinar: ' + nombres(ls));
  const n = await enNube();
  falla(n.config.otro === 'sí' && n.dias[iso()].metas.agua === 500, 'se perdió algo al combinar: ' + JSON.stringify({ otro: n.config.otro, agua: n.dias[iso()].metas.agua }));
  falla((await p.estado()).config.otro === 'sí', 'este equipo no tiene lo del otro');
  console.log('✓ cambios de los dos lados se combinan: ' + nombres(ls));

  // 6. La nube de antes (sin las funciones nuevas): todo sigue funcionando como siempre
  await p.ev(`window.__nube.s.vieja = true`);
  await p.ev(`window.rutinaPrueba.nube(window.__nube.cliente, { id: 'u-prueba', correo: 'prueba@ejemplo.com' })`);
  await tocarTexto('+250 ml');
  await esperarSubida();
  ls = await llamadas();
  falla(nombres(ls).endsWith('rutina_leer rutina_guardar'), 'con la nube de antes: ' + nombres(ls));
  falla((await agua()) === 750, 'con la nube de antes no subió: ' + (await agua()));
  await sincronizar();
  ls = await llamadas();
  falla(nombres(ls) === 'rutina_leer', 'con la nube de antes, sin cambios: ' + nombres(ls));
  console.log('✓ con la nube de antes funciona como siempre');
  console.log('✓ Nube');
};
