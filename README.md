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
- **Hoy**: tablero con la mañana, las metas, el entrenamiento que toca (con calentamiento) y la semana. Los días de fútbol
  (mié y vie de noche, se cambian en Editar) muestran el partido: qué comer y cuándo, calentamiento fútbol y estirar después.
  Arriba va **Tu entrenador hoy** (`src/entrenador.js`): semáforo 🟢 sube · 🟡 mantén · 🔴 suave según el sueño, el partido de ayer,
  las molestias y la carga del fútbol (7 días contra el promedio de 28; sobre 1,3 avisa), lo único que mejorar hoy (lo más flojo de
  ayer) y las metas del próximo entreno.
- **Calendario**: mes gregoriano de lunes a domingo con los festivos de Colombia (Ley Emiliani, Pascua calculada), las fases reales
  de la luna con su hora, los equinoccios y solsticios, y el gym y el fútbol de cada día. Al tocar un día: luna (% iluminada), día del
  año, semana ISO y día juliano. Explica qué calendario rige el mundo y por qué el de 13 lunas de 28 días no sigue a la luna.
  Los cálculos (`src/calendario.js`, algoritmos de Meeus) van sin internet y `tests/calendario.test.mjs` los compara con los eclipses de 2026.
- **Progreso**: tablero con gráficos (7, 30 o 90 días): indicadores, constancia de 12 semanas, puntaje por día, peso con la meta,
  series del gym por semana, metas cumplidas, ingresos y gastos por mes y gasto por categoría. Incluye el **puntaje del día** (0–100:
  mañana, metas, gym si toca y dieta) y una **revisión semanal** automática con lo que mejoró y lo que falta.
- **Mañana**: checklist en orden con hora, espera pastilla → desayuno, colgarse 60 s, estiramiento guiado, gratitud, caminar 1 h y racha.
- **Metas**: agua, pasos, calorías y lectura, con historial de 7 y 30 días.
- **🎓 Estudiar**: 7 áreas con sus cursos (`src/cursos/index.js`); los que aún no tienen contenido salen como "Próximamente".
  "Hoy estudias…" arma el plan del día con tus minutos (`config.estudio.minutos`, 15 por defecto, se cambian aquí o en Ajustes):
  primero los repasos que tocan (~30 s por tarjeta) y luego tantas lecciones como quepan; si sobra poco tiempo, solo repaso.
  Cada lección (~10 min): idea, bloques, ejemplos, nota que matiza lo que se suele exagerar, **recordar sin mirar** (3-5 preguntas
  con la respuesta tapada), práctica, diario. Al terminarla, sus tarjetas entran al mazo y vuelven a 1, 3, 7, 16 y 35 días (fallar
  vuelve a empezar). Racha, cronómetro de estudio (suma a la meta de 📖 Lectura), proyecto final y fuentes por módulo.
  Lógica sin pantalla en `src/estudio.js`; progreso en `estudio` = `{ actual, cursos, tarjetas, dias }`. En Hoy, la tarjeta
  **🎓 Estudio de hoy** reemplaza a las de los libros. Áreas y cursos entran a los permisos de Administrar (`area` / `curso`).
  Cursos disponibles: **Aprender a aprender** (9 lecciones: recuperación activa, repaso espaciado, intercalado, elaboración,
  carga cognitiva, sueño y memoria), **Metacognición** (9 lecciones: calibración, ilusiones de saber, planear, vigilar, evaluar,
  errores, frenar el piloto automático y rutina semanal), **Toma de decisiones** (9 lecciones: decisión vs. resultado, marco y
  opciones, criterios con pesos, probabilidades y tasa base, valor esperado y riesgo, reversible o no, emociones, intuición,
  decidir en grupo y diario de decisiones), **Hábitos, productividad y organización personal** (9 lecciones: qué es un hábito,
  cuánto tarda, señales y planes si-entonces, empezar pequeño y el entorno, romper malos hábitos, registro y recompensas,
  metas y prioridades, trabajo profundo y sistema semanal), **Ciencia de la procrastinación** (9 lecciones: no es pereza, emociones,
  ecuación de la motivación y yo del futuro, tareas que repelen, perfeccionismo y autosabotaje, plazos, empezar sin ganas,
  autocompasión y plan con cuándo pedir ayuda), **Comunicación y oratoria** (4 módulos, 12 lecciones: idea principal, estructura,
  palabras simples e historias, escuchar, lo no verbal sin mitos, conversaciones difíciles, persuasión, influencia, cambiar
  opiniones, miedo escénico, preparar y ensayar, y voz, pausas y preguntas), **Inteligencia emocional** (9 lecciones: qué es y
  qué no, para qué sirven las emociones, nombrarlas, regulación, rabia y rumiación, cuerpo y escritura, empatía y compasión,
  contagio y buenas noticias, trabajo, familia y cuándo pedir ayuda), **Educación financiera** (4 módulos, 12 lecciones, para
  Colombia: presupuesto, fondo de emergencia, inflación e interés compuesto, deudas y usura, salir de deudas, centrales de
  riesgo, riesgo y diversificación, fondos indexados, estafas, pensión y cesantías, renta y vivienda, plata y bienestar), **Sesgos cognitivos** (9 lecciones: heurísticas, disponibilidad y representatividad, anclaje, confirmación, razonamiento motivado y punto ciego, juzgar a otros, memoria y supervivencia, azar y rachas, y cómo reducir sesgos), **Neuroplasticidad** (9 lecciones: qué es, el cerebro adulto que cambia, neuronas nuevas en debate, práctica deliberada, ejercicio, sueño, periodos sensibles, recuperación de lesiones y mitos del entrenamiento cerebral), **Neurociencia del desarrollo** (9 lecciones: antes de nacer, conexiones y poda, apego y estrés temprano, lenguaje, autocontrol, pantallas y juego, cerebro adolescente, sueño y sustancias, y envejecimiento), **Epigenética** (9 lecciones: genes y su uso, metilación e histonas, gemelos, nutrición y hambruna, estrés y cuidado, relojes epigenéticos, herencia entre generaciones, medicina y mitos), **Geopolítica** (4 módulos, 12 lecciones: qué es, escuelas, poder, energía y minerales, comercio y sanciones, clima y migración, EE. UU. y China, Ucrania, ONU y cortes, Colombia en el mapa, América Latina y cómo leer las noticias), **Gnosticismo** (9 lecciones: qué fue, Nag Hammadi, sus críticos, el mito del demiurgo, escuelas, evangelios de Tomás, María y Judas, maniqueos y cátaros, gnosis moderna y en Colombia, y el canon sin mitos), **Hermetismo** (9 lecciones: Hermes Trismegisto, el Corpus Hermeticum, la datación de Casaubon, microcosmos, Tabla Esmeralda, hermetismo técnico, Renacimiento, ciencia moderna y El Kybalión), **Numerología** (9 lecciones: Pitágoras, gematría, números de suerte, numerología moderna, efecto Forer, coincidencias, lotería, cómo influyen los números y la belleza real de las matemáticas), **Geometría sagrada** (9 lecciones: proporción áurea, Fibonacci en la naturaleza, sólidos platónicos, pirámides y Partenón, la proporción más bella, flor de la vida, catedrales, mosaicos islámicos y diseño moderno), **Masonería** (9 lecciones: de los canteros a las logias, 1717, leyendas de origen, grados y símbolos, ramas e ideales, la Iglesia, independencias, Colombia en el siglo XIX y teorías de conspiración), **Ciencias ocultas** (9 lecciones: historia de la astrología, sus pruebas, la precesión, qué buscaba la alquimia, de la alquimia a la química, la transmutación nuclear, magia y caza de brujas, ocultismo moderno y el negocio del tarot y los amarres). Formato en `src/cursos/aprender-a-aprender.js`, validado por
  `tests/cursos.test.mjs`. Para sumar el siguiente: `/agregar-curso` (`.claude/skills/agregar-curso/SKILL.md`), un curso por sesión.
- **📚 Libros** (un área de Estudiar; `#libros` y `#libros/<id>` siguen funcionando): libros y cursos convertidos desde PDF, una lectura por día (si se salta una, al otro día sigue donde quedó):
  contenido completo, fórmulas, notas que matizan datos dudosos, afirmación, práctica del día, diario y racha.
  "Preguntar": buscador sobre todo el libro y consejos por situación (cuerpo, mente, espíritu, metas, relaciones).
  Conceptos clave (leyes, principios), rutina diaria, herramientas (diario, fichas paso a paso, perfil) y sesiones guiadas.
  Funciona sin internet. Libros: **Seminario Fénix** (Brian Tracy, 27 lecturas) y **Crecimiento personal** (10 lecturas:
  4 zonas del crecimiento, del sueño a la acción diaria, 20 activos, 9 disparadores para vender y 16 pasatiempos), con la
  evaluación "¿En qué zona estás?" (guarda la evolución), fichas de embudo de metas, retos, activos, publicaciones y pasatiempos.

### Agregar un libro desde un PDF
Pásale el PDF a Claude Code con `/agregar-libro` (`.claude/skills/agregar-libro/SKILL.md`): lo lee completo, escribe
`src/libros/<id>.js` con el formato de `src/libros/fenix.js`, lo registra en `src/libros/index.js` y comprueba con
`npm test` (`tests/libros.test.mjs` valida el formato de todos los libros). Después la app lo consulta sola, sin Claude.
- **Dieta**: plan del día según el gym y el fútbol (entreno inferior, superior, fútbol o descanso), comidas que se marcan y suman a las calorías,
  planes y alimentos editables, peso corporal con promedio de 7 días y recálculo de los planes por peso (proteína y carbos).
  Proteína de la semana: días que llegaste al 90 % de la del plan y el promedio en gramos.
- **Gym**: semana actual primero (semana 1 = lunes 12 oct 2026), semanas pasadas en el selector. Contador de series, colores
  (amarillo faltan · verde completo · azul SUBE PESO), último registro, peso sugerido, descanso automático, notas y resumen por músculo.
  El resumen del día se copia como texto o se comparte como imagen (PNG, para WhatsApp).
  **Biseries** (`ej.biserie`: va con el ejercicio siguiente del día): una tarjeta con A1 y A2, cada uno con su peso, y "＋ Ronda"
  que anota los dos (en la fila pendiente de cada uno: top, back-off…) y arranca un solo descanso. Un nombre "A / b" se separa
  en dos con un botón (lo anotado queda en el primero); dos ejercicios cualquiera se juntan en Editar.
  Cada ejercicio muestra la **meta de la sesión** (doble progresión) y pregunta cuántas reps quedaban en reserva (RIR 0-4+).
  Las series que se salen del esquema (muy pocas o más del doble de reps, o un peso que salta más de 40 %) salen con ⚠️ y se
  pueden marcar como incompletas (`incompletas`, no cuentan en la fuerza) o como bien anotadas (`revisadas`).
  La tarjeta de Fuerza suma la fuerza relativa (1RM / peso corporal), "¿Qué te hace rendir?" (cada sesión contra su propia
  tendencia, cruzada con sueño, calidad, partido del día antes y proteína) y el gráfico de un ejercicio. En el Calendario,
  los días de gym hechos, faltados y por hacer, con la racha.
- **Semana**: lun empuje, mar tirón, mié pierna A, vie torso A, sáb pierna B. Las dos piernas son la de Cbum: extensión, patrón de
  sentadilla, curl femoral sentado, peso muerto rodilla extendida, aductores, hip thrust (opcional) y pantorrilla, 2-3 series cada uno.
- **Sesiones**: calentamientos por día (y de fútbol), saltar lazo, prevención fútbol, estiramientos, fortalecimiento de rodilla y mente (respiración 4-4-8, relajación progresiva, visualización), en modo guiado.
  Cada ejercicio muestra cómo se hace con una figura animada (`src/figuras.js`, sin internet) y un botón para ver videos en YouTube;
  la respiración guía el ritmo 4-4-8 con un círculo y la relajación resalta la parte del cuerpo que se tensa.
  Mente incluye "Me hablo bien" (diálogo interno positivo).
- **Finanzas**: registrar gastos, ingresos y ahorro (con método de pago: efectivo, débito, crédito, Nequi, Daviplata, transferencia),
  resumen del mes (tasa de ahorro, regla 50/30/20, por categoría y método, proyección), presupuesto por categoría, pagos fijos,
  metas de ahorro con fondo de emergencia (6 meses de gastos) y deudas (meses para pagar, estrategia avalancha).
- **Recordatorios**: mantenimiento de la moto por km o por meses (lo que pase primero) con odómetro y fecha estimada,
  plantillas (aceite, SOAT, tecnomecánica, cadena, llantas…) y los pagos fijos y cuotas de Finanzas, que aparecen solos.
- **Editar**: rutina (días, ejercicios, series × reps, descansos, nota), hábitos de la mañana y sesiones: agregar, cambiar, duplicar (⧉),
  reordenar (↑ ↓) y borrar. Un ejercicio se puede mover a otro día y sus registros se van con él. Cada día elige su calentamiento
  (cualquier sesión de tipo calentamiento), las sesiones que van junto a él y el plan de comida; también se eligen las sesiones del
  partido y de los días de descanso. Pestaña **Pantallas**: orden y qué se ve del menú, de las tarjetas de Hoy y de las metas
  (las metas escondidas no cuentan en el puntaje). Categorías, pagos fijos, metas y deudas de Finanzas y los alimentos también se reordenan.
  En las sesiones, cada ejercicio puede llevar figura animada, foto propia (se reduce a 480 px) y enlace de video.
- **Ajustes**: perfil (nombre del saludo y lunes de la semana 1 del gym), nube, Google Sheets, metas, espera de la pastilla, sonido, exportar/importar JSON y CSV.
- **🛡️ Administrar** (solo el admin, con nube): usuarios de Rutina (correo, rol, última entrada y excepciones), permisos por rol
  (qué secciones, áreas de Estudiar y cursos ve cada uno), roles (crear, renombrar, borrar; admin y estudiante no se borran) y "Ver como" un rol o un usuario.
  Solo esconde partes de la app: el admin nunca ve los datos de los demás. Regla del usuario > regla del rol > visible; Hoy y
  Ajustes siempre se ven; las tarjetas de Hoy de una sección escondida tampoco salen (`SECCION_TARJETA` en `src/orden.js`).
  Lógica en `src/permisos.js` (catálogo genérico tipo + id, para sumar áreas y cursos); las reglas vienen de
  `rutina_mis_permisos()` y se guardan en el celular (`rutina_permisos:<usuario>`) para entrar sin internet. Sin nube, o sin el
  esquema nuevo aplicado, no hay restricciones. En `npm run dev`, `rutinaPrueba.permisos({...})` y `rutinaPrueba.admin({...})`
  en la consola permiten probarlo sin Supabase.

Menú lateral a la derecha: en el celular se abre con ☰; en el computador (≥ 900 px) queda fijo, con un resumen del día y el estado de la nube.

## Datos (src/estado.js)
Un objeto por usuario guardado en `localStorage` (`rutina_v1:<id del usuario>`; sin nube configurada, `rutina_v1`). Mientras no se sabe
quién entra no se escribe nada. Los datos de antes (`rutina_v1`) pasan solos al usuario que los sincronizaba. Un usuario nuevo ve una
bienvenida en Hoy: empezar con el ejemplo o vacío (sin hábitos, rutina ni fútbol). Orden y visibilidad en `config.orden` / `config.ocultos`
(`src/orden.js`). Contiene: `config`, `habitos`, `rutina` (días → ejercicios → filas Top/Back-off/Series),
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

## Publicación
- GitHub: `github.com/diegozvanegas-sudo/rutina`. Para subir cambios: doble clic en `Subir_a_GitHub.bat`.
- Cada subida a `main` corre las pruebas y publica en GitHub Pages: https://diegozvanegas-sudo.github.io/rutina/
  (activar una vez: Settings → Pages → Source: "GitHub Actions").
- `.env.production` lleva la URL y la llave pública de Supabase (van dentro de la página de todas formas).
