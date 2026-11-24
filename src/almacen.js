// 🛡️ Lo guardado en este equipo. Sin permiso de "guardado permanente", el navegador puede borrar los datos de la app
// cuando le falta espacio, y el iPhone los borra si la página no se abre en 7 días (salvo que esté instalada en la
// pantalla de inicio). Se pide una vez al abrir; Ajustes → Copia de seguridad muestra cómo quedó.
export const almacen = { permanente: null }; // null = no se sabe (navegador sin esta función)

export async function pedirQueNoSeBorre() {
  try {
    if (!navigator.storage || !navigator.storage.persist) return;
    almacen.permanente = (await navigator.storage.persisted()) || (await navigator.storage.persist());
  } catch (err) { almacen.permanente = null; }
}
