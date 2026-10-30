---
name: agregar-curso
description: Escribe un curso completo de la sección 🎓 Estudiar de la app Rutina (src/cursos/<id>.js), con el formato de "Aprender a aprender", para estudiarlo sin internet y sin Claude. Úsalo cuando el usuario pida "el siguiente curso", "agrega el curso de …", "fase 3" o escriba /agregar-curso.
---

# Agregar un curso a 🎓 Estudiar

Cada curso es un archivo en `src/cursos/` con todo su contenido: la app lo enseña sola, sin internet y sin Claude, así que
**todo el conocimiento tiene que quedar escrito en el archivo**. Un curso por sesión.

El ejemplo de referencia es `src/cursos/aprender-a-aprender.js`: léelo antes de empezar y copia su nivel de detalle, su tono
y su rigor. Lee también `src/cursos/index.js` (el catálogo de áreas y cursos) y `docs/plan-estudiar.md`.

## 1. Elegir el curso
- Si el usuario no dice cuál, toma el siguiente del **orden recomendado** que aún no tenga archivo:
  1. Aprender y pensar: aprender-a-aprender ✓, metacognicion ✓, sesgos-cognitivos, toma-de-decisiones
  2. Hábitos y productividad: habitos-productividad, procrastinacion
  3. Comunicación y emociones: comunicacion-oratoria, inteligencia-emocional
  4. Cerebro y biología: neuroplasticidad, neurociencia-desarrollo, epigenetica
  5. Mundo y dinero: educacion-financiera, geopolitica
  6. Tradiciones esotéricas: gnosticismo, hermetismo, numerologia, geometria-sagrada, masoneria, ciencias-ocultas
- El `id`, el ícono y el área son los que ya tiene en `src/cursos/index.js`. No cambies ids: los usan el progreso y los permisos.
- Si el usuario pasa un PDF o un libro como base, léelo completo primero (como en `/agregar-libro`) y úsalo, pero el curso sigue
  este formato y se completa con la mejor evidencia disponible.

## 2. Reglas de contenido
- **Español de Colombia**, tuteando, claro y concreto. Ejemplos de la vida de un adulto colombiano (trabajo, plata, fútbol, gym,
  familia, estudio). Pesos colombianos cuando hay plata.
- **Rigor primero.** Cada afirmación importante tiene que poder rastrearse a una fuente real. Separa lo que tiene buena evidencia
  de lo que es una metáfora útil, de lo que es dudoso y de lo que es falso.
- **Nunca inventes una fuente, un año, una revista ni una cifra.** Si no estás seguro de un número, descríbelo sin número
  ("bastante más", "la mayoría"). Es mejor una cita menos que una cita falsa.
- **La `nota` de cada lección** ("💡 Para tener en cuenta") es para lo que se suele exagerar o malinterpretar: mitos, estudios que
  no se replicaron, cifras sacadas de contexto, metáforas que se toman como hechos. Di qué sí está respaldado.
- **Tradiciones esotéricas**: se enseñan como **historia de las ideas** (origen, textos, qué afirma, quiénes la practicaron, qué
  influencia tuvo). Cada lección separa con claridad **"Qué dice la tradición"** y **"Qué muestra la evidencia"** (usa esos títulos
  como bloques). Respeto sin dar por ciertas afirmaciones sin respaldo.
- **Salud, dinero y emociones**: cuando aplique, di cuándo buscar a un profesional. No reemplaza al médico, al psicólogo ni a un asesor.
- Conecta con la app cuando sirva (Gym, Dieta, Metas, Finanzas, Libros, el diario), sin forzarlo.

## 3. Escribir `src/cursos/<id>.js`
```js
const l = (titulo, minutos, datos) => ({ titulo, minutos, ejemplos: [], nota: '', ...datos });

const MODULO_1 = {
  titulo, objetivo,                       // objetivo: una frase con lo que vas a poder hacer al terminar el módulo
  fuentes: [['Cita completa con autores, año, título, revista o editorial.', 'Para qué sirve esta fuente.'], …], // 3 a 10, reales
  lecciones: [
    l('Título', 10, {
      idea,                               // la idea central en una o dos frases
      bloques: [['Subtítulo', ['punto', …]], …],   // 2 a 4 bloques, 3 a 6 puntos cada uno
      ejemplos: [ … ],                    // 2 ejemplos concretos de la vida real
      practica: [3 acciones],             // para hacer hoy, concretas
      pregunta,                           // pregunta del diario que obligue a aplicarlo a la propia vida
      nota,                               // lo que conviene matizar (ver reglas)
      recordar: [['pregunta', 'respuesta corta'], …],  // 3 a 5: "recordar sin mirar"
      tarjetas: [['frente', 'reverso'], …],            // 3: lo esencial para el repaso espaciado
    }),
  ],
};

export default {
  id, nombre, area, icono, nivel: 'Básico' | 'Intermedio' | 'Avanzado',
  paraQue,                                // para qué sirve el curso, en dos frases
  modulos: [MODULO_1, MODULO_2, MODULO_3],
  proyecto: { titulo, intro, pasos: [6 a 8 pasos] },  // proyecto final práctico, de 1 a 4 semanas
};
```
- **Tamaño:** 3 módulos de 3 lecciones (9 lecciones) es lo normal; temas grandes pueden llevar 4 módulos. Cada lección de **unos
  10 minutos** (`minutos` entre 8 y 12; la prueba acepta de 5 a 15). Una lección = una idea; si no cabe, divídela.
- **Recordar sin mirar:** preguntas que se respondan de memoria con lo de la lección; la respuesta, en una o dos frases.
- **Tarjetas:** las 3 ideas que más valen la pena retener meses después. Frente corto; reverso que se entienda solo, sin la lección.
- Las tarjetas se identifican por curso, número de lección y posición (`curso:n:i`): **no reordenes ni borres lecciones de un curso
  ya publicado**, porque cambiaría el repaso de quien ya lo empezó. Agregar lecciones al final sí se puede.

## 4. Registrar y comprobar
1. En `src/cursos/index.js`: `import nuevo from './<id>.js';` y súmalo a `CURSOS` (en el orden de las áreas). Deja de salir
   como "Próximamente" solo.
2. `npm test`: `tests/cursos.test.mjs` valida el formato de todos los cursos. Corrige hasta que pase.
3. Agrega en `tests/cursos.test.mjs` una prueba del curso nuevo: número de lecciones y 5-10 autores o conceptos clave que no pueden faltar.
4. `npm run build`.
5. Ábrelo en el navegador (`#estudiar/<id>`, con `npm run dev`): revisa una lección, "recordar sin mirar", la pestaña Fuentes y
   que el plan de 🎓 Estudiar lo proponga.
6. Actualiza el README (lista de cursos disponibles) y cuéntale al usuario cuántas lecciones y tarjetas quedaron, las fuentes
   principales y qué mitos o exageraciones corrigen las notas. No hagas commit sin que lo pida.
