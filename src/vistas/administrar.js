// 🛡️ Administrar (solo admin): el rol de cada usuario, qué ve cada rol, qué ve cada usuario, roles y "Ver como".
// Todo se guarda en Supabase (supabase/esquema.sql, funciones rutina_admin_*). El admin nunca ve los datos de los demás.
import { repintar } from '../estado.js';
import { registrar, toast } from '../ui.js';
import { configurada, llamar, cargarPermisos } from '../nube.js';
import { esAdmin, catalogo, tiposCatalogo, SIEMPRE, reglaDe, permisosDe, ponerVerComo } from '../permisos.js';

let datos = null, cargando = false, error = '', pestana = 'usuarios';
// vuelta: sube cada vez que se vuelve a leer o falla un cambio; las casillas de React se rehacen con lo guardado
let vuelta = 0;
const PESTANAS = { usuarios: '👥 Usuarios', entrenadores: '🧑‍🏫 Entrenadores', porUsuario: '🔐 Permisos por usuario', permisos: '🏷️ Permisos por rol', roles: '🏷️ Roles', ver: '👁 Ver como' };

async function cargar() {
  cargando = true; error = ''; repintar();
  try { datos = await llamar('rutina_admin_datos'); } catch (err) { error = err.message; }
  cargando = false; vuelta++; repintar();
}
// Guarda en Supabase, vuelve a leer todo y refresca los permisos propios (por si el admin se cambió algo)
async function cambiar(funcion, args, aviso) {
  try {
    await llamar(funcion, args);
    if (aviso) toast(aviso);
    await cargar();
    cargarPermisos();
  } catch (err) { toast('⚠️ ' + err.message); vuelta++; repintar(); }
}
// Para probar la pantalla sin Supabase
export function ponerDatosAdmin(d) { datos = d; error = ''; cargando = false; vuelta++; repintar(); }

const rolesNoAdmin = () => datos.roles.filter((r) => r.id !== 'admin');
const nombreRol = (id) => (datos.roles.find((r) => r.id === id) || { nombre: id }).nombre;
const cuando = (ts) => (ts ? new Date(ts).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : 'nunca');
// Elementos que se pueden esconder, agrupados por tipo (sin los que siempre se ven)
const elementos = () => tiposCatalogo().map((tipo) => [tipo, Object.entries(catalogo(tipo)).filter(([id]) => !(SIEMPRE[tipo] || []).includes(id))]);

// Lo que ve cada usuario: su excepción si la tiene; si no, lo de su rol
const veUsuario = (u, tipo, id) => { const v = reglaDe(datos, tipo, id, { usuario: u.id }); return v !== null ? v : reglaDe(datos, tipo, id, { rol: u.rol }) !== false; };
const corto = (correo) => String(correo || '').split('@')[0];

// 🧑‍🏫 Entrenadores: quién es cliente de quién (sin planes ni avance: eso solo lo ve cada entrenador)
let entrenadores = null, cargandoEnt = false, errorEnt = '';
async function cargarEntrenadores() {
  cargandoEnt = true; errorEnt = ''; repintar();
  try { entrenadores = await llamar('rutina_admin_entrenadores'); } catch (err) { errorEnt = err.message; }
  cargandoEnt = false; repintar();
}
const ESTADO_ASIG = { activo: ['al-dia', 'Activo'], invitado: ['pronto', 'Invitado'] };

// Lo que necesita la pantalla de React (src/react/pantallas/Administrar.tsx): lo cargado, la pestaña y las reglas de texto
export const piezasAdmin = {
  ver: () => ({ datos, cargando, error, pestana, entrenadores, cargandoEnt, errorEnt, vuelta }),
  // Pide los datos la primera vez que se abre (como hacía la pantalla de antes al pintarse)
  pedir: () => { if (configurada && esAdmin() && !datos && !cargando && !error) cargar(); },
  pedirEntrenadores: () => { if (entrenadores == null && !cargandoEnt && !errorEnt) cargarEntrenadores(); },
  PESTANAS, ESTADO_ASIG, rolesNoAdmin, nombreRol, cuando, elementos, veUsuario, corto,
};

// Banner mientras el admin mira la app como otro
const idDe = (nombre) => nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

registrar({
  'adm-pestana'({ p }) { pestana = p; repintar(); },
  'adm-recargar'() { cargar(); entrenadores = null; },
  'adm-entrenadores'() { cargarEntrenadores(); },
  'adm-rol'({ u }, el) { cambiar('rutina_admin_rol', { p_usuario: u, p_rol: el.value }, 'Rol cambiado a ' + nombreRol(el.value)); },
  // Excepción de un usuario: "" quita la regla, "1" ver, "0" no ver
  'adm-regla'({ tipo, id, u }, el) {
    cambiar('rutina_admin_permiso', { p_tipo: tipo, p_elemento: id, p_rol: null, p_usuario: u, p_visible: el.value === '' ? null : el.value === '1' });
  },
  // Casilla de un usuario: si queda igual a lo de su rol se quita la excepción
  'adm-regla-usuario'({ tipo, id, u }, el) {
    const usuario = datos.usuarios.find((x) => x.id === u), delRol = reglaDe(datos, tipo, id, { rol: usuario.rol }) !== false;
    cambiar('rutina_admin_permiso', { p_tipo: tipo, p_elemento: id, p_rol: null, p_usuario: u, p_visible: el.checked === delRol ? null : el.checked });
  },
  // Por rol: visible es lo de siempre, así que marcar quita la regla y desmarcar la pone en "no ver"
  'adm-regla-rol'({ tipo, id, rol }, el) {
    cambiar('rutina_admin_permiso', { p_tipo: tipo, p_elemento: id, p_rol: rol, p_usuario: null, p_visible: el.checked ? null : false });
  },
  'adm-rol-nombre'({ rol }, el) {
    if (!el.value.trim()) { toast('El rol necesita un nombre'); repintar(); return; }
    cambiar('rutina_admin_guardar_rol', { p_id: rol, p_nombre: el.value.trim() });
  },
  'adm-rol-crear'() {
    const campo = document.getElementById('adm-rol-nuevo'), nombre = campo.value.trim(), id = idDe(nombre);
    if (!id) { toast('Escribe el nombre del rol'); campo.focus(); return; }
    if (datos.roles.some((r) => r.id === id)) { toast('Ya hay un rol con ese nombre'); return; }
    campo.value = '';
    cambiar('rutina_admin_guardar_rol', { p_id: id, p_nombre: nombre }, '🏷️ Rol ' + nombre + ' creado');
  },
  'adm-rol-borrar'({ rol, nombre }) {
    if (!confirm('¿Borrar el rol "' + nombre + '"? Sus usuarios pasan a Estudiante y sus reglas se borran.')) return;
    cambiar('rutina_admin_borrar_rol', { p_id: rol }, 'Rol borrado');
  },
  'adm-ver'(ds, el) {
    const [tipo, id] = el.value.split(':');
    if (!id) return;
    const nombre = tipo === 'rol' ? nombreRol(id) : (datos.usuarios.find((u) => u.id === id) || {}).correo;
    ponerVerComo(nombre, permisosDe(datos, tipo === 'rol' ? { rol: id } : { usuario: id }));
    location.hash = '#hoy';
    repintar();
  },
  'adm-ver-salir'() { ponerVerComo(null); location.hash = '#administrar'; repintar(); },
});
