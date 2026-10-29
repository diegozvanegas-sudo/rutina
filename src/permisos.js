// Quién ve qué (⚙️ Administrar). Las reglas vienen de Supabase (rutina_mis_permisos) y se guardan en el celular para
// cuando no haya internet. Solo esconden partes de la app: los datos de cada usuario siguen siendo solo suyos.
// Regla del usuario > regla de su rol > visible. El admin ve todo. Sin nube (o sin el esquema nuevo) no hay restricciones.
import { SECCIONES } from './orden.js';

// Lo que se puede esconder, por tipo: { tipo: { id: nombre } }. Las áreas y los cursos de Estudiar se suman con registrarCatalogo
const CATALOGO = { seccion: () => Object.fromEntries(Object.entries(SECCIONES).map(([k, [icono, nombre]]) => [k, icono + ' ' + nombre])) };
export const TIPOS = { seccion: 'Secciones del menú', area: 'Áreas de Estudiar', curso: 'Cursos' };
export function registrarCatalogo(tipo, f) { CATALOGO[tipo] = f; }
export const catalogo = (tipo) => (CATALOGO[tipo] ? CATALOGO[tipo]() : {});
export const tiposCatalogo = () => Object.keys(TIPOS).filter((t) => Object.keys(catalogo(t)).length);
// Siempre visibles: sin ellas no se puede cerrar sesión ni volver al inicio
export const SIEMPRE = { seccion: ['hoy', 'ajustes'] };

// p: { rol, reglas: [{ tipo, id, visible, usuario: true si es del usuario }] } o null (sin restricciones)
export function puedeVer(p, tipo, id) {
  if (!p || p.rol === 'admin' || (SIEMPRE[tipo] || []).includes(id)) return true;
  const de = (usuario) => (p.reglas || []).find((r) => r.tipo === tipo && r.id === id && !!r.usuario === usuario);
  const regla = de(true) || de(false);
  return regla ? regla.visible : true;
}
// Lo de adentro solo se ve si también se ve lo de afuera: [['seccion', 'estudiar'], ['area', 'x'], ['curso', 'y']]
export const puedeVerRuta = (p, ruta) => ruta.every(([tipo, id]) => puedeVer(p, tipo, id));

// Las reglas que le aplican a un rol o a un usuario, a partir de todo lo que ve el admin (para "Ver como")
export function permisosDe(datos, { rol, usuario }) {
  if (usuario) { const u = (datos.usuarios || []).find((x) => x.id === usuario); rol = u ? u.rol : 'estudiante'; }
  const reglas = (datos.reglas || []).filter((r) => (r.rol && r.rol === rol) || (usuario && r.usuario === usuario))
    .map((r) => ({ tipo: r.tipo, id: r.id, visible: r.visible, usuario: !!r.usuario }));
  return { rol, reglas };
}
// Regla de un rol o de un usuario para un elemento: true, false o null (sin regla)
export function reglaDe(datos, tipo, id, { rol, usuario }) {
  const r = (datos.reglas || []).find((x) => x.tipo === tipo && x.id === id && (usuario ? x.usuario === usuario : x.rol === rol && !x.usuario));
  return r ? r.visible : null;
}

// ---------- Los de quien está usando la app ----------
let actual = null, verComo = null;
const clave = (usuario) => 'rutina_permisos:' + usuario;
export function ponerPermisos(usuario, p) {
  actual = p || null;
  try { localStorage.setItem(clave(usuario), JSON.stringify(actual)); } catch (err) {}
}
// Los últimos descargados (para entrar sin internet)
export function permisosGuardados(usuario) {
  try { actual = JSON.parse(localStorage.getItem(clave(usuario))) || null; } catch (err) { actual = null; }
}
export function quitarPermisos() { actual = null; verComo = null; }
export const esAdmin = () => !!actual && actual.rol === 'admin';
export const miRol = () => (actual ? actual.rol : null);
// Vista previa del admin: la app como la ve un rol o un usuario
export function ponerVerComo(nombre, p) { verComo = p ? { nombre, p } : null; }
export const viendoComo = () => (verComo ? verComo.nombre : null);
const efectivos = () => (verComo ? verComo.p : actual);
export const ve = (tipo, id) => puedeVer(efectivos(), tipo, id);
export const veRuta = (ruta) => puedeVerRuta(efectivos(), ruta);
