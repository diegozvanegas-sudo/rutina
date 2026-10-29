# 🎓 Estudiar y ⚙️ Administrar: plan para construir con Claude Code

Primero el administrador (quién ve qué) y después la sección de estudio. Al final están los dos prompts, uno por fase.

## Decisiones tomadas
- **Primero el administrador**, luego los cursos.
- **Esconder basta:** ningún contenido tiene que ser privado de verdad. Los cursos van en el código de la app, como los libros,
  y el administrador decide qué se ve en el menú y en las pantallas.
- **📚 Libros pasa a ser un área de 🎓 Estudiar** (con los 4 libros que ya hay).
- **Minutos de estudio al día: los pone cada usuario** (en Ajustes y en la pantalla de Estudiar).

## Fase 1: ⚙️ Administrar (roles y permisos)

### Qué hace
- **Roles:** `admin`, `estudiante` y `familia` de entrada; el admin puede crear, renombrar y borrar roles (menos `admin`).
- **Qué se controla:** cada **sección** del menú (Hoy, Calendario, Gym, Finanzas…). El catálogo es genérico (`tipo` + `id`)
  para que en la fase 2 entren las **áreas** y los **cursos** sin cambiar nada.
- **Cómo se decide si alguien ve algo:** primero la regla del usuario, luego la de su rol y, si no hay ninguna, visible.
  Ocultar una sección esconde todo lo que tiene adentro. El admin siempre lo ve todo.
- **Editar → Pantallas sigue igual:** cada quien puede esconder lo que tiene permitido, pero no ver lo que el admin le quitó.
- **Privacidad:** el admin ve el correo, el rol y la última vez que entró cada usuario; **nunca** sus datos (gym, finanzas, diario…).
- **Sin nube configurada** (modo local) no hay restricciones. **Sin internet** se usan los últimos permisos descargados.

### Pantalla ⚙️ Administrar (solo para admin)
- **Usuarios:** correo, rol (se cambia ahí), última entrada y sus excepciones.
- **Permisos:** tabla de secciones contra roles, con interruptores. Por usuario: "como su rol", "ver" o "no ver".
- **Roles:** crear, renombrar y borrar.
- **Ver como:** vista previa del menú de un rol o de un usuario, sin cambiar de cuenta.

### Supabase (sumar a `supabase/esquema.sql`, mismo estilo: esquema `rutina` cerrado y funciones `security definer`)
- `rutina.roles (id, nombre)`
- `rutina.perfiles (usuario → auth.users, rol, creado)`: a quien entra por primera vez se le da `estudiante`.
- `rutina.permisos (tipo, id, rol, usuario, visible)`: cada regla es para un rol **o** para un usuario.
- `rutina_mis_permisos()`: rol y reglas que le aplican al usuario que entra.
- `rutina_admin_*()` para listar usuarios (correo y `last_sign_in_at` de `auth.users`), cambiar rol, guardar reglas y
  manejar roles. Todas fallan si quien llama no es admin.
- **El primer admin se pone a mano**, con una línea de SQL con tu correo de la app.
- Se aplica con `npm run db:esquema` (`tools/aplicar_esquema.mjs`).

## Fase 2: 🎓 Estudiar

### Áreas y cursos
| Área | Cursos |
|---|---|
| 📚 Libros | Seminario Fénix · Leyes del éxito · Crecimiento personal · Los cuatro acuerdos (los de hoy, con todo lo que ya tienen) |
| 🧠 Aprender y pensar | Aprender a aprender · Metacognición · Sesgos cognitivos · Toma de decisiones |
| 🧬 Cerebro y biología | Neuroplasticidad · Neurociencia del desarrollo · Epigenética |
| ⚡ Hábitos y productividad | Hábitos, productividad y organización personal · Ciencia de la procrastinación |
| 💬 Comunicación y emociones | Comunicación y oratoria (incluye hablar en público) · Inteligencia emocional |
| 🌍 Mundo y dinero | Geopolítica · Educación financiera |
| 🜂 Tradiciones esotéricas | Gnosticismo · Hermetismo · Numerología · Geometría sagrada · Masonería · Ciencias ocultas |

- **Orden recomendado:** primero *Aprender a aprender* y *Metacognición*, que enseñan a estudiar los demás.
- **Tradiciones esotéricas** se estudian como historia de las ideas: origen, textos, qué afirma, quiénes la practicaron e
  influencia. Cada lección separa **qué dice la tradición** de **qué muestra la evidencia**.

### Formato de un curso (`src/cursos/<id>.js`)
- **Ficha:** id, nombre, área, ícono, nivel y para qué sirve.
- **Módulos → lecciones de unos 10 minutos** (la unidad fija). Cada lección: idea central, bloques, ejemplos, práctica del
  día, pregunta del diario, nota (lo que conviene matizar) y sus minutos estimados.
- **Recordar sin mirar:** 3-5 preguntas por lección, que se responden antes de ver la respuesta.
- **Tarjetas de repaso** con repaso espaciado: vuelven a 1, 3, 7, 16 y 35 días; si fallas una, empieza de nuevo.
- **Proyecto final** práctico y **fuentes** reales por módulo.

### Minutos al día (los pone cada usuario)
- `config.estudio.minutos` (por defecto 15), editable en Ajustes y en Estudiar.
- Con ese tiempo, la app arma el plan del día: primero los repasos pendientes (unos 30 s por tarjeta) y luego tantas
  lecciones como quepan. Si sobra poco tiempo, solo repaso.
- Cronómetro de estudio que suma a la meta de 📖 Lectura de Metas.

### Pantallas
- **🎓 Estudiar:** "Hoy estudias…" (plan del día según tus minutos), repasos pendientes, racha y áreas con su avance.
- **Área** y **curso** (módulos, lección del día, recordar sin mirar, tarjetas, proyecto y fuentes).
- **📚 Libros** se ve como un área más: sus pantallas actuales se abren desde ahí (los enlaces viejos `#libros` siguen funcionando).
- **En Hoy:** la tarjeta "🎓 Estudio de hoy" reemplaza a las de lectura de los libros, escondible en Editar → Pantallas.
- **Permisos:** las áreas y los cursos entran al catálogo del administrador (`tipo: area` / `curso`).

## Fase 3: los cursos
Una skill `/agregar-curso` (como `/agregar-libro`) y un curso por sesión, en el orden recomendado. Son 20 cursos: cada uno
tiene que quedar completo en su archivo, porque la app funciona sin internet y sin Claude.

---

## Prompt de la fase 1 (Administrar)

```
Vamos a hacer la FASE 1 de docs/plan-estudiar.md: el administrador de roles y permisos de la app Rutina.
Lee primero ese plan, README.md, supabase/esquema.sql, src/nube.js, src/orden.js, src/main.js y src/vistas/editar.js
(pestaña Pantallas), para seguir el estilo y la forma de guardar de la app.

1. Supabase: suma a supabase/esquema.sql las tablas rutina.roles, rutina.perfiles y rutina.permisos, y las funciones
   rutina_mis_permisos() y rutina_admin_*() (security definer, search_path vacío, solo para authenticated; las de admin
   fallan si quien llama no es admin). Al entrar por primera vez, el usuario queda como "estudiante". Deja al final una
   línea comentada para nombrar al primer admin por correo. El admin nunca puede leer los datos de otro usuario.
2. Lógica sin pantalla (src/permisos.js) con pruebas: catálogo genérico (tipo + id; hoy las secciones de SECCIONES),
   regla de usuario > regla de rol > visible por defecto, el admin ve todo, sin nube no hay restricciones, y los
   permisos se guardan en el celular para cuando no haya internet.
3. Menú y pantallas filtrados por permisos (también los enlaces directos #seccion). Editar → Pantallas solo muestra lo permitido.
4. Pantalla ⚙️ Administrar (solo admin): usuarios (correo, rol, última entrada, excepciones), tabla de permisos por rol,
   roles (crear, renombrar, borrar menos admin) y "Ver como" un rol o un usuario.
5. Actualiza el README. Corre npm test y npm run build y pruébalo en el navegador (sin nube y con permisos de prueba).

No apliques el esquema en Supabase tú solo: dime qué comando correr y qué línea de SQL poner con mi correo.
```

## Prompt de la fase 2 (Estudiar)

```
Vamos a hacer la FASE 2 de docs/plan-estudiar.md: la sección 🎓 Estudiar de la app Rutina (la fase 1, el administrador,
ya está hecha). Lee primero ese plan, README.md, src/permisos.js, src/libros/index.js, src/libros/fenix.js,
src/vistas/libros.js y .claude/skills/agregar-libro/SKILL.md.

1. Sección 🎓 Estudiar con sus 7 áreas. 📚 Libros pasa a ser un área: sus pantallas actuales se abren desde ahí y #libros
   sigue funcionando. Los cursos sin contenido aparecen como "Próximamente".
2. Formato de curso en src/cursos/<id>.js, registrado en src/cursos/index.js, con una prueba que valide todos los cursos
   (como tests/libros.test.mjs): lecciones de unos 10 minutos con idea, bloques, ejemplos, práctica, pregunta del diario,
   nota y minutos; 3-5 preguntas de "recordar sin mirar"; tarjetas de repaso; proyecto final; fuentes.
3. Progreso por usuario: lección siguiente (si se salta un día, sigue donde quedó), respuestas, diario, racha y tarjetas
   con repaso espaciado (1, 3, 7, 16 y 35 días; si fallas, vuelve a empezar). Minutos al día en config.estudio.minutos
   (por defecto 15, editable en Ajustes y en Estudiar): el plan del día pone primero los repasos y luego las lecciones que
   quepan. Cronómetro de estudio que suma a la meta de Lectura. Lógica sin pantalla, con pruebas.
4. Pantallas: inicio de Estudiar, área y curso; tarjeta "🎓 Estudio de hoy" en Hoy (reemplaza las de los libros,
   escondible en Editar → Pantallas). Áreas y cursos entran al catálogo de permisos (tipo area / curso).
5. Curso piloto completo: "Aprender a aprender" (recuperación activa, repaso espaciado, intercalado, elaboración, carga
   cognitiva, sueño y memoria), con fuentes reales y notas donde un dato se suele exagerar.

Reglas: español de Colombia, rigor primero (separa lo que tiene evidencia de lo que no; en las tradiciones esotéricas,
historia de las ideas y "qué dice la tradición" frente a "qué muestra la evidencia"). Todo funciona sin internet.
Actualiza el README, corre npm test y npm run build, y pruébalo en el navegador antes de terminar.
```
