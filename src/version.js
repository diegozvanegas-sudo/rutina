// Nivel de esta versión de la app para la nube (rutina.exigir_nivel en supabase/esquema.sql). Va con cada guardado.
// Súbelo en 1 cuando un arreglo del guardado haga peligrosas las versiones de antes (una que suba copias viejas encima de
// lo nuevo, como la pestaña vieja del 23 nov 2026). Después de publicar, `npm run db:nivel` le dice a la nube que no deje
// guardar a las de nivel menor: esas se actualizan solas (src/actualizar.js) y lo suyo sube al actualizarse.
// 1 = desde el freno a las copias viejas (0a79167) y la actualización sola.
export const NIVEL_APP = 1;
