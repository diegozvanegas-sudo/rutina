// 📊 Qué se usa de verdad: cuántas veces y cuándo fue la última vez que se abrió cada sección y cada pestaña, en este
// equipo (localStorage 'rutina.uso'; no va a la nube: el celular y el computador se usan distinto). Con eso el menú
// manda a "💤 Poco usado" lo que no se abre hace un mes, y Ajustes muestra lo que más se usa.
// { desde: 'aaaa-mm-dd', s: { seccion: { n, ultima } }, p: { 'seccion/pestaña': { n, ultima } } }
import { iso, sumarDias } from './fechas.js';

const CLAVE = 'rutina.uso';
// Días que se cuenta antes de mandar algo a Poco usado, y días sin abrir para que cuente como poco usado
export const DIAS_CONTANDO = 14, DIAS_SIN_ABRIR = 30;
// Nunca van a Poco usado: sin ellas no se vuelve a nada
const NUNCA = ['hoy', 'editar', 'ajustes'];

const vacio = (hoy = iso()) => ({ desde: hoy, s: {}, p: {} });
export function leerUso() {
  try { const u = JSON.parse(localStorage.getItem(CLAVE) || 'null'); return u && u.desde ? { s: {}, p: {}, ...u } : vacio(); } catch { return vacio(); }
}
function escribir(u) { try { localStorage.setItem(CLAVE, JSON.stringify(u)); } catch { /* sin almacenamiento: no se cuenta */ } }

// Suma una vez a la sección (y a la pestaña, si viene). Puro: devuelve el uso nuevo
export function sumar(u, seccion, pestana, hoy = iso()) {
  const r = { desde: u.desde || hoy, s: { ...u.s }, p: { ...u.p } };
  const uno = (m, k) => { m[k] = { n: ((m[k] || {}).n || 0) + 1, ultima: hoy }; };
  if (seccion) uno(r.s, seccion);
  if (seccion && pestana) uno(r.p, seccion + '/' + pestana);
  return r;
}
export function anotarUso(seccion, pestana) {
  if (!seccion) return;
  escribir(sumar(leerUso(), seccion, pestana));
}
// Una pestaña abierta dentro de la sección en la que ya se está (no vuelve a contar la sección)
export function anotarPestana(seccion, pestana) {
  if (!seccion || !pestana) return;
  const u = leerUso(), k = seccion + '/' + pestana, hoy = iso();
  u.p[k] = { n: ((u.p[k] || {}).n || 0) + 1, ultima: hoy };
  escribir(u);
}

// Ids que no se abren hace DIAS_SIN_ABRIR días (o nunca, desde que se cuenta). Antes de DIAS_CONTANDO días contando, ninguno
export function pocoUsadas(ids, u = leerUso(), hoy = iso()) {
  if (!u.desde || u.desde > sumarDias(hoy, -DIAS_CONTANDO)) return [];
  const limite = sumarDias(hoy, -DIAS_SIN_ABRIR);
  return ids.filter((k) => !NUNCA.includes(k) && !((u.s[k] || {}).ultima >= limite));
}

// Lo más usado, de mayor a menor: [[id, n, ultima]]
export const masUsadas = (u = leerUso(), tipo = 's') => Object.entries(u[tipo] || {}).map(([k, x]) => [k, x.n, x.ultima]).sort((a, b) => b[1] - a[1]);
export const diasContando = (u = leerUso(), hoy = iso()) => Math.max(0, Math.round((new Date(hoy + 'T12:00:00') - new Date(u.desde + 'T12:00:00')) / 864e5));
export function reiniciarUso() { escribir(vacio()); }
