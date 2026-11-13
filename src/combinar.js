// Cuando dos equipos cambiaron algo desde la última sincronización, se combinan sus datos en vez de quedarse con uno solo.
// Se compara cada parte con la última copia sincronizada (base): lo que cambió un solo lado se respeta, también si lo borró.
// Si los dos cambiaron exactamente lo mismo, gana el que guardó de último.
const esObjeto = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
// El contenido sin importar el orden de las llaves: la nube (jsonb) las devuelve en otro orden que el celular
const texto = (x) => {
  if (Array.isArray(x)) return '[' + x.map(texto).join(',') + ']';
  if (esObjeto(x)) return '{' + Object.keys(x).sort().map((k) => JSON.stringify(k) + ':' + texto(x[k])).join(',') + '}';
  return JSON.stringify(x);
};
const igual = (a, b) => texto(a) === texto(b);
// Lo que tiene id se reconoce por su id; lo demás, por su contenido (un registro { fecha, km }, un texto)
const claveDe = (x) => (esObjeto(x) && x.id != null ? 'id:' + x.id : 'v:' + texto(x));
const porClave = (lista) => new Map(lista.map((x) => [claveDe(x), x]));
// Solo se unen elemento por elemento las listas donde cada uno se reconoce solo: con id, con fecha o un texto.
// Las demás (comidas, sus alimentos, pasos, rangos de números) van enteras: unirlas repetiría lo que se editó
const sePuedeUnir = (x) => typeof x === 'string' || (esObjeto(x) && (x.id != null || x.fecha != null));

function unirListas(base, local, remoto, ganaLocal) {
  if (![...local, ...remoto].every(sePuedeUnir)) return ganaLocal ? local : remoto;
  const b = porClave(Array.isArray(base) ? base : []), l = porClave(local), r = porClave(remoto), salida = [];
  for (const [k, x] of l) {
    if (r.has(k)) salida.push(unir(b.get(k), x, r.get(k), ganaLocal));
    // Lo borraron allá: se va, salvo que aquí lo hayan cambiado
    else if (!b.has(k) || !igual(b.get(k), x)) salida.push(x);
  }
  for (const [k, x] of r) {
    if (!l.has(k) && (!b.has(k) || !igual(b.get(k), x))) salida.push(x);
  }
  return salida;
}

export function unir(base, local, remoto, ganaLocal) {
  if (igual(local, remoto)) return local;
  if (igual(base, local)) return remoto;
  if (igual(base, remoto)) return local;
  if (esObjeto(local) && esObjeto(remoto)) {
    const salida = {}, b = esObjeto(base) ? base : {};
    for (const k of new Set([...Object.keys(local), ...Object.keys(remoto)])) {
      const v = unir(b[k], local[k], remoto[k], ganaLocal);
      if (v !== undefined) salida[k] = v;
    }
    return salida;
  }
  if (Array.isArray(local) && Array.isArray(remoto)) return unirListas(base, local, remoto, ganaLocal);
  return ganaLocal ? local : remoto;
}

// Los datos completos. Las listas con fecha vuelven a quedar en orden, porque el último registro es el que cuenta
export function combinarEstado(base, local, remoto, ganaLocal) {
  const sinCambio = ({ cambio, ...resto }) => resto;
  const r = unir(sinCambio(base || {}), sinCambio(local), sinCambio(remoto), ganaLocal);
  const porFecha = (a, b) => String(a.fecha).localeCompare(String(b.fecha));
  for (const x of r.recordatorios?.lista || []) x.hechos?.sort(porFecha);
  for (const v of r.recordatorios?.vehiculos || []) v.km?.sort(porFecha);
  return r;
}

// Red de seguridad: los datos de este equipo no son los últimos que se subieron (sin contar la hora del cambio ni el orden
// de las llaves). Atrapa lo que se cambió sin pasar por guardar(), para que igual llegue a la nube
// ¿Este equipo tiene algo anotado de verdad? Solo cuenta lo que la persona escribió: al pintar Hoy o el Gym la app crea
// días y semanas vacíos ({ habitos: {}, metas: { agua: 0 } }), y contarlos hacía que un celular recién estrenado mezclara
// su rutina de ejemplo con la de la nube (días repetidos) en vez de solo bajarla
const lleno = (x) => (x == null ? false : typeof x === 'object' ? Object.values(x).some(lleno) : x !== 0 && x !== '' && x !== false);
export function tieneDatosPropios(est) {
  return Object.values(est.dias || {}).some(lleno) || Object.values(est.semanas || {}).some(lleno)
    || ((est.finanzas && est.finanzas.movimientos) || []).length > 0 || (est.clientes || []).length > 0
    || ((est.miEntrenador && est.miEntrenador.checkins) || []).length > 0;
}

export function difiereDeLaNube(datos, base) {
  if (!base) return false;
  const sinCambio = ({ cambio, ...resto }) => resto;
  return !igual(sinCambio(datos), sinCambio(base));
}

// Arregla lo que dejó el orden de las llaves: listas sin id que quedaron repetidas enteras (A B A B) y registros con fecha idénticos
export function limpiarRepetidos(x) {
  if (esObjeto(x)) { for (const v of Object.values(x)) limpiarRepetidos(v); return x; }
  if (!Array.isArray(x)) return x;
  x.forEach(limpiarRepetidos);
  if (!x.length || !x.every((v) => esObjeto(v) && v.id == null)) return x;
  const textos = x.map(texto);
  if (x.every((v) => v.fecha != null)) {
    const unicos = x.filter((v, i) => textos.indexOf(textos[i]) === i);
    x.splice(0, x.length, ...unicos);
    return x;
  }
  for (let p = 1; p <= x.length / 2; p++) {
    if (x.length % p === 0 && textos.every((t, i) => t === textos[i % p])) { x.length = p; break; }
  }
  return x;
}
