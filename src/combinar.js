// Cuando dos equipos cambiaron algo desde la última sincronización, se combinan sus datos en vez de quedarse con uno solo.
// Se compara cada parte con la última copia sincronizada (base): lo que cambió un solo lado se respeta, también si lo borró.
// Si los dos cambiaron exactamente lo mismo, gana el que guardó de último.
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const esObjeto = (x) => !!x && typeof x === 'object' && !Array.isArray(x);
// Lo que tiene id se reconoce por su id; lo demás, por su contenido (un registro { fecha, km }, un texto)
const claveDe = (x) => (esObjeto(x) && x.id != null ? 'id:' + x.id : 'v:' + JSON.stringify(x));
const porClave = (lista) => new Map(lista.map((x) => [claveDe(x), x]));

function unirListas(base, local, remoto, ganaLocal) {
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
