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
// Lo que tiene id se reconoce por su id; lo demás, por su contenido (un registro { fecha, km }, un texto).
// Dos iguales en la misma lista siguen siendo dos (dos series o dos comidas idénticas)
const porClave = (lista) => {
  const vistas = new Map();
  return new Map(lista.map((x) => {
    if (esObjeto(x) && x.id != null) return ['id:' + x.id, x];
    const v = texto(x), n = vistas.get(v) || 0;
    vistas.set(v, n + 1);
    return ['v:' + n + ':' + v, x];
  }));
};

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
