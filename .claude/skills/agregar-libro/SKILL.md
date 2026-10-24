---
name: agregar-libro
description: Convierte un PDF (libro, curso, seminario, resumen) en un libro de la sección 📚 Libros de la app Rutina, con el mismo formato que el Seminario Fénix, para consultarlo sin Claude. Úsalo cuando el usuario pase un PDF y pida "agrégalo", "conviértelo", "otra sesión como Fénix" o escriba /agregar-libro.
---

# Agregar un libro desde un PDF

El usuario pasa un PDF y quiere tenerlo dentro de la app con todo lo que trae Fénix: lectura del día, práctica, diario,
"Preguntar" con consejos por situación, conceptos clave, rutina, herramientas y sesiones guiadas. Después la app
responde sola, sin internet y sin Claude, así que **todo el conocimiento tiene que quedar escrito en el archivo**.

El ejemplo de referencia es `src/libros/fenix.js`: léelo antes de empezar y copia su nivel de detalle y su tono.

## 1. Leer TODO el PDF
- Lee todas las páginas (en bloques de 20 si es largo). No resumas a partir de una parte.
- Anota la estructura real: módulos, capítulos, días o lecciones, y qué ejercicios, fórmulas, cifras, ejemplos y frases trae cada uno.
- Si el PDF no se puede leer o tiene páginas escaneadas sin texto, dilo antes de seguir.

## 2. Decidir con el usuario (solo si no es obvio)
Pregunta con AskUserQuestion únicamente lo que cambia el resultado:
- **Unidad y número de lecturas.** Si el PDF ya viene por días o módulos, se respeta (una lectura por cada uno).
  Si es un libro largo sin divisiones, propón un número de lecturas de 5 a 15 minutos cada una (por capítulo o subcapítulo).
- **Enfoque de los consejos** si el tema no es obvio (por ejemplo, un libro de finanzas: ¿ahorro, inversión, deudas?).
No preguntes lo demás: aplica este formato.

## 3. Escribir `src/libros/<id>.js`
`id` en minúsculas y con guiones (por ejemplo `habitos-atomicos`). Exporta por defecto un objeto con:

```js
export default {
  id, titulo, autor, icono,           // icono: un emoji
  descripcion,                        // una línea: "12 lecturas, una por día, para …"
  unidad: 'Día' | 'Capítulo' | 'Lección' | 'Módulo',
  lecturas: [ /* ver abajo */ ],
  conceptos: { titulo: 'Leyes' | 'Principios' | 'Ideas clave' | …, icono, lista: [{ nombre, texto, dias: [n…] }] },
  consejos: [ /* ver abajo */ ],
  grupos: [['🧠 Mente y emociones', [ids…]], …],   // cada consejo en exactamente un grupo
  rutina: [['☀️ Al despertar', [pasos…]], ['💼 Durante el día', […]], ['🌙 Antes de dormir', […]]],
  racha: { meta: 21, texto: 'Regla de los 21 días' }, // opcional: solo si el libro propone una cifra de constancia
  diario: { titulo, campos: [[clave, etiqueta]…], ayer: [clave, etiqueta] }, // opcional: lo que se escribe cada día
  fichas: { tipo: { icono, titulo, lectura: n, nueva: '+ Nueva …', campos: [[clave, etiqueta, 'date'?]…] } }, // opcional
  perfil: { titulo, campos: [[clave, etiqueta]…] },  // opcional: respuestas que se escriben una vez y se releen
  sesiones: [{ id, nombre, tipo: 'mente', pasos: [{ nombre, musculo, seg, lados: false, desc }] }], // opcional
};
```

### Cada lectura (lo más importante)
```js
{ n, titulo, temas: ['palabras', 'para buscar'], idea, intro, bloques: [['Subtítulo', ['punto', …]], …],
  formulas: [], nota: '', afirmacion, practica: [3 acciones], pregunta }
```
- **Todo el contenido, hasta lo más mínimo**: cada idea, lista, paso, cifra, ejemplo, tip, ejercicio y frase clave del PDF va en `bloques`,
  con sus propios subtítulos. Puedes reescribir para que se lea claro, pero no omitas nada. Una lectura suele tener 3 a 7 bloques.
- `idea`: la idea central en una frase. `intro`: el párrafo de entrada.
- `formulas`: las fórmulas o ecuaciones que trae ("A + B = C").
- `afirmacion`: en primera persona, presente y positiva. Usa la del PDF si la trae. Si el libro no es de desarrollo personal y
  una afirmación no tiene sentido, deja `afirmacion` vacía.
- `practica`: exactamente 3 acciones concretas para hacer ese día, sacadas de los ejercicios del PDF.
- `pregunta`: una pregunta de diario que obligue a aplicarlo a la propia vida.
- `temas`: 4 a 8 palabras con las que alguien buscaría esa lectura (sin tildes no hace falta: el buscador las quita).
- **Limpia los errores del PDF**: numeraciones rotas ("1. 1"), frases cortadas, textos sobrantes de otras herramientas
  ("Aquí tienes el resumen…"), nombres de archivo. Si quitas o arreglas algo importante, menciónalo en `nota`.
- `nota` (💡 "Para tener en cuenta"): tu aporte como experto. Úsala cuando un dato sea un mito, esté exagerado o mal atribuido
  (dilo con respeto y explica qué sí está respaldado), cuando algo de salud necesite "esto no reemplaza al médico",
  o cuando haya un complemento valioso (origen de una técnica, un estudio, una conexión con las secciones de la app: Gym, Dieta, Metas, Finanzas).
  No la pongas por ponerla.

### Consejos ("¿Qué te pasa hoy?")
Entre 20 y 40, en 4 a 6 grupos, que cubran cuerpo, mente, emociones, espíritu, relaciones y metas en lo que el libro permita:
```js
{ id, icono, texto: 'Estoy …' (en primera persona, como lo diría el usuario), claves: [sinónimos y palabras con las que lo escribiría],
  dias: [2-3 lecturas para releer], ahora: [3 pasos concretos para hacer ya], pregunta: 'para reflexionar',
  afirmacion, herramienta?: 'diario' | 'perfil' | tipo de ficha, sesion?: id de una sesión guiada }
```
- Los pasos de `ahora` salen del libro y se completan con lo mejor que se sabe del tema. Concretos (qué hacer en los próximos minutos), no frases motivacionales.
- En temas delicados (duelo, vacío, soledad, enfermedad, dinero grave) incluye cuándo buscar ayuda profesional.
- `claves` decide qué encuentra el buscador: pon las palabras reales que usaría una persona ("plata", "deudas", "no duermo").

### Conceptos, rutina, herramientas y sesiones
- `conceptos`: todas las leyes, principios o reglas con nombre que aparezcan, con todas las lecturas donde aparecen.
- `rutina`: el libro entero convertido en un día (mañana, durante el día, noche).
- `fichas`: convierte en formulario cada método paso a paso del libro (un plan, un análisis, un ejercicio de escritura largo).
- `diario`: lo que el libro pide escribir cada día (gratitud, tareas, registro…). `ayer` muestra hoy lo escrito ayer.
- `sesiones`: ejercicios guiados con tiempo (respiración, relajación, visualización, meditación). Los `id` no pueden repetir
  ninguno de `src/datos_iniciales.js` ni de otro libro. Cada paso necesita su figura en `POSES` de `src/figuras.js`
  (por nombre, sin tildes ni mayúsculas): reusa las de mente (`respira: true`, sentado o acostado con `resalta`) o dibuja
  las posiciones de un ejercicio físico como los que ya están. `tests/figuras.test.mjs` falla si falta alguna.

## 4. Registrar y comprobar
1. Agrégalo en `src/libros/index.js`: `import nuevo from './<id>.js';` y súmalo a `LIBROS`.
2. `npm test`: `tests/libros.test.mjs` valida el formato de todos los libros. Corrige hasta que pase.
3. Agrega 2-3 pruebas del buscador del libro nuevo en `tests/libros.test.mjs` (búsqueda → lectura y consejo esperados).
4. `npm run build`.
5. Ábrelo en el navegador (`#libros/<id>`): revisa una lectura, Preguntar con 2 búsquedas reales y Herramientas.
6. Cuéntale al usuario cuántas lecturas, consejos, conceptos y herramientas quedaron, y qué corregiste o agregaste en las notas.
   No hagas commit sin que lo pida.
