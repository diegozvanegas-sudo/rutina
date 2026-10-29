// 🛡️ Administrar (solo admin): el rol de cada usuario, qué ve cada rol, excepciones por usuario, roles y "Ver como".
// Todo se guarda en Supabase (supabase/esquema.sql, funciones rutina_admin_*). El admin nunca ve los datos de los demás.
import { repintar } from '../estado.js';
import { esc, registrar, toast } from '../ui.js';
import { configurada, llamar, cargarPermisos } from '../nube.js';
import { esAdmin, catalogo, tiposCatalogo, TIPOS, SIEMPRE, reglaDe, permisosDe, ponerVerComo } from '../permisos.js';

let datos = null, cargando = false, error = '', pestana = 'usuarios';
const PESTANAS = { usuarios: '👥 Usuarios', permisos: '🔐 Permisos por rol', roles: '🏷️ Roles', ver: '👁 Ver como' };

async function cargar() {
  cargando = true; error = ''; repintar();
  try { datos = await llamar('rutina_admin_datos'); } catch (err) { error = err.message; }
  cargando = false; repintar();
}
// Guarda en Supabase, vuelve a leer todo y refresca los permisos propios (por si el admin se cambió algo)
async function cambiar(funcion, args, aviso) {
  try {
    await llamar(funcion, args);
    if (aviso) toast(aviso);
    await cargar();
    cargarPermisos();
  } catch (err) { toast('⚠️ ' + err.message); repintar(); }
}
// Para probar la pantalla sin Supabase
export function ponerDatosAdmin(d) { datos = d; error = ''; cargando = false; }

const rolesNoAdmin = () => datos.roles.filter((r) => r.id !== 'admin');
const nombreRol = (id) => (datos.roles.find((r) => r.id === id) || { nombre: id }).nombre;
const cuando = (ts) => (ts ? new Date(ts).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : 'nunca');
// Elementos que se pueden esconder, agrupados por tipo (sin los que siempre se ven)
const elementos = () => tiposCatalogo().map((tipo) => [tipo, Object.entries(catalogo(tipo)).filter(([id]) => !(SIEMPRE[tipo] || []).includes(id))]);

function usuarios() {
  return datos.usuarios.map((u) => {
    const admin = u.rol === 'admin', propias = datos.reglas.filter((r) => r.usuario === u.id).length;
    return '<section class="tarjeta adm-usuario"><div class="fila-resumen"><b>' + esc(u.correo) + '</b><span class="nota-corta">Última entrada: ' + cuando(u.ultima) + '</span></div>' +
      '<label class="campo">Rol<select data-cambio="adm-rol" data-u="' + u.id + '">' + datos.roles.map((r) =>
        '<option value="' + esc(r.id) + '"' + (r.id === u.rol ? ' selected' : '') + '>' + esc(r.nombre) + '</option>').join('') + '</select></label>' +
      (admin ? '<p class="nota-corta">El administrador ve todo.</p>' : '<details><summary>Excepciones de este usuario (' + propias + ')</summary>' +
        '<p class="nota-corta">Mandan sobre lo de su rol. "Como su rol" quita la excepción.</p>' +
        elementos().map(([tipo, lista]) => '<h3>' + TIPOS[tipo] + '</h3><div class="adm-reglas">' + lista.map(([id, nombre]) => {
          const v = reglaDe(datos, tipo, id, { usuario: u.id }), delRol = reglaDe(datos, tipo, id, { rol: u.rol }) !== false;
          return '<label class="campo">' + esc(nombre) + '<select data-cambio="adm-regla" data-tipo="' + tipo + '" data-id="' + esc(id) + '" data-u="' + u.id + '">' +
            '<option value=""' + (v === null ? ' selected' : '') + '>Como su rol (' + (delRol ? 've' : 'no ve') + ')</option>' +
            '<option value="1"' + (v === true ? ' selected' : '') + '>Ver</option><option value="0"' + (v === false ? ' selected' : '') + '>No ver</option></select></label>';
        }).join('') + '</div>').join('') + '</details>') + '</section>';
  }).join('') || '<p class="nota-corta">Aún no ha entrado nadie más. Cada persona aparece aquí la primera vez que entra a la app.</p>';
}

function permisos() {
  const roles = rolesNoAdmin();
  return '<p class="nota-corta">Marcado = lo ve. Lo nuevo que traiga la app aparece visible para todos hasta que lo quites. Hoy y Ajustes siempre se ven.</p>' +
    elementos().map(([tipo, lista]) => '<section class="tarjeta"><h2>' + TIPOS[tipo] + '</h2><div class="tabla-scroll"><table class="adm-tabla"><thead><tr><th></th>' +
      roles.map((r) => '<th>' + esc(r.nombre) + '</th>').join('') + '</tr></thead><tbody>' + lista.map(([id, nombre]) => '<tr><th>' + esc(nombre) + '</th>' + roles.map((r) => {
        const ve = reglaDe(datos, tipo, id, { rol: r.id }) !== false;
        return '<td><input type="checkbox" data-cambio="adm-regla-rol" data-tipo="' + tipo + '" data-id="' + esc(id) + '" data-rol="' + esc(r.id) + '"' + (ve ? ' checked' : '') +
          ' aria-label="' + esc(r.nombre) + ' ve ' + esc(nombre) + '"></td>';
      }).join('') + '</tr>').join('') + '</tbody></table></div></section>').join('');
}

function roles() {
  const usan = (id) => datos.usuarios.filter((u) => u.rol === id).length;
  return '<section class="tarjeta">' + datos.roles.map((r) => '<div class="adm-rol">' +
      '<label class="campo">' + (r.id === 'admin' ? 'Administrador (ve todo)' : 'Nombre') + '<input type="text" data-cambio="adm-rol-nombre" data-rol="' + esc(r.id) + '" value="' + esc(r.nombre) + '"></label>' +
      '<span class="nota-corta">' + usan(r.id) + (usan(r.id) === 1 ? ' usuario' : ' usuarios') + '</span>' +
      (['admin', 'estudiante'].includes(r.id) ? '' : '<button type="button" class="icono borrar" data-accion="adm-rol-borrar" data-rol="' + esc(r.id) + '" data-nombre="' + esc(r.nombre) + '" aria-label="Borrar ' + esc(r.nombre) + '">🗑</button>') +
      '</div>').join('') + '</section>' +
    '<section class="tarjeta"><h2>＋ Nuevo rol</h2><div class="serie-rapida"><input type="text" id="adm-rol-nuevo" placeholder="Ej.: Amigos del gym" aria-label="Nombre del rol nuevo">' +
    '<button type="button" class="boton primario" data-accion="adm-rol-crear">Crear</button></div>' +
    '<p class="nota-corta">Al borrar un rol, sus usuarios pasan a Estudiante. Administrador y Estudiante no se pueden borrar.</p></section>';
}

function verComo() {
  return '<section class="tarjeta"><p>Mira la app como la ve un rol o una persona, sin cambiar de cuenta. Tus datos siguen siendo los tuyos: solo cambia lo que se ve.</p>' +
    '<label class="campo">Ver como<select data-cambio="adm-ver"><option value="">Elige…</option><optgroup label="Roles">' +
    rolesNoAdmin().map((r) => '<option value="rol:' + esc(r.id) + '">' + esc(r.nombre) + '</option>').join('') + '</optgroup><optgroup label="Usuarios">' +
    datos.usuarios.filter((u) => u.rol !== 'admin').map((u) => '<option value="u:' + u.id + '">' + esc(u.correo) + '</option>').join('') + '</optgroup></select></label></section>';
}

export function vistaAdministrar() {
  const titulo = '<div class="cab-vista"><h1>Administrar</h1>' + (datos ? '<button type="button" class="boton secundario" data-accion="adm-recargar">↻ Actualizar</button>' : '') + '</div>';
  if (!configurada && !datos) return titulo + '<section class="tarjeta"><p>Administrar necesita la nube (Supabase): sin ella cada quien ve toda la app.</p></section>';
  if (!esAdmin()) return titulo + '<section class="tarjeta"><p>Solo el administrador puede entrar aquí.</p></section>';
  if (!datos && !cargando && !error) queueMicrotask(cargar);
  if (error) return titulo + '<section class="tarjeta"><p class="aviso">No se pudo cargar: ' + esc(error) + '</p>' +
    '<p class="nota-corta">Si dice que la función no existe, falta aplicar el esquema nuevo (npm run db:esquema).</p>' +
    '<button type="button" class="boton primario" data-accion="adm-recargar">Reintentar</button></section>';
  if (!datos) return titulo + '<p class="nota-corta">Cargando…</p>';
  return titulo + '<nav class="chips pestanas">' + Object.entries(PESTANAS).map(([k, t]) =>
    '<button type="button" class="chip' + (k === pestana ? ' activo' : '') + '" data-accion="adm-pestana" data-p="' + k + '">' + t + '</button>').join('') + '</nav>' +
    { usuarios, permisos, roles, ver: verComo }[pestana]();
}

// Banner mientras el admin mira la app como otro
export const bannerVerComo = (nombre) => '<div class="ver-como">👁 Estás viendo la app como <b>' + esc(nombre) + '</b>' +
  '<button type="button" class="boton secundario" data-accion="adm-ver-salir">Volver a mi vista</button></div>';

const idDe = (nombre) => nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

registrar({
  'adm-pestana'({ p }) { pestana = p; repintar(); },
  'adm-recargar'() { cargar(); },
  'adm-rol'({ u }, el) { cambiar('rutina_admin_rol', { p_usuario: u, p_rol: el.value }, 'Rol cambiado a ' + nombreRol(el.value)); },
  // Excepción de un usuario: "" quita la regla, "1" ver, "0" no ver
  'adm-regla'({ tipo, id, u }, el) {
    cambiar('rutina_admin_permiso', { p_tipo: tipo, p_elemento: id, p_rol: null, p_usuario: u, p_visible: el.value === '' ? null : el.value === '1' });
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
