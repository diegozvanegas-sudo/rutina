# Rutina diaria

App web (PWA, funciona sin internet) para la rutina del día: hábitos de la mañana, metas, gym y sesiones guiadas.
Misma base que microrrutas: Vite + vite-plugin-pwa, JavaScript sin framework. Los datos viven en el celular (localStorage).

```
npm install
npm run dev       # http://localhost:5173 (con --host también se abre desde el celular en la misma red)
npm test          # reglas del gym, semanas y sesiones
npm run build     # versión para publicar en dist/
```

## Pantallas
- **Hoy**: tablero con la mañana, las metas, el entrenamiento que toca (con calentamiento) y la semana.
- **Mañana**: checklist en orden con hora, espera pastilla → desayuno, colgarse 60 s, estiramiento guiado, gratitud, caminar 1 h y racha.
- **Metas**: agua, pasos, calorías y lectura, con historial de 7 y 30 días.
- **Gym**: semana actual primero (semana 1 = lunes 12 oct 2026), semanas pasadas en el selector. Contador de series, colores
  (amarillo faltan · verde completo · azul SUBE PESO), último registro, peso sugerido, descanso automático, notas y resumen por músculo.
- **Sesiones**: calentamientos por día, estiramientos y fortalecimiento de rodilla, en modo guiado.
- **Editar**: rutina (días, ejercicios, series × reps, descansos), hábitos de la mañana y sesiones: agregar, cambiar, reordenar y borrar.
- **Ajustes**: nube, Google Sheets, metas, espera de la pastilla, sonido, exportar/importar JSON y CSV.

Menú lateral a la derecha: en el celular se abre con ☰; en el computador (≥ 900 px) queda fijo, con un resumen del día y el estado de la nube.

## Datos (src/estado.js)
Un solo objeto guardado en `localStorage` (`rutina_v1`): `config`, `habitos`, `rutina` (días → ejercicios → filas Top/Back-off/Series),
`sesiones`, `dias` (por fecha: hábitos con hora, metas, cronómetros) y `semanas` (por número: peso, unidad y reps **como texto** de cada fila).

## Nube (Supabase)
Esquema `rutina` dentro del proyecto de Supabase de microrrutas (no ocupa otro proyecto del plan gratis).
- `supabase/esquema.sql`: tabla `rutina.estado` (un documento por usuario) y las funciones `public.rutina_leer()` / `public.rutina_guardar()`.
  El esquema no se expone a la API: solo se entra por esas funciones y cada usuario ve lo suyo.
- `npm run db:esquema` lo crea o actualiza (usa `DATABASE_URL` del `.env` de microrutas si esta carpeta no tiene uno).
- `.env.local` (no se sube a git): `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, los mismos de microrrutas.
- En la app: Ajustes > Guardar en la nube, con el usuario de microrrutas. El celular sigue siendo lo principal;
  los cambios se suben a los 3 segundos y al abrir la app se baja lo más reciente. Si cambiaron los dos lados, pregunta cuál dejar.

## Google Sheets
`apps_script/Codigo.gs` escribe en la hoja "Rutina Gym":
- Gym → pestaña "Rutina 2.0", columna "Sem N" de la fila 4 (peso y reps, reps como texto "10 · 9 · 8").
  Las filas se ubican por orden dentro de cada bloque (DÍA 1 … DÍA 5, CORE): si cambias el orden o agregas ejercicios en la app,
  hazlo también en la hoja (el mensaje de respuesta avisa si el número de filas no coincide).
- Días → pestaña "Diario App" (se crea sola), una fila por fecha.

Instalación (una vez):
1. Abre la hoja > Extensiones > Apps Script, pega `Codigo.gs` y cambia `CLAVE` por una clave tuya.
2. Implementar > Nueva implementación > tipo "Aplicación web" > Ejecutar como: yo · Quién tiene acceso: cualquier usuario > Implementar y autorizar.
3. Copia la URL que termina en `/exec` y pégala en la app (Ajustes > Google Sheets) junto con la misma clave.
4. "Enviar semana actual" para probar. Después se envía sola un minuto después de cada cambio.
