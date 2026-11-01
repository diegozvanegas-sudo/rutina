---
name: completar-curso-mentor
description: Agrega los campos de mentor (ancla, principios, ochenta, diagnóstico, comprobación, feynman, reto) a un curso ya publicado de 🎓 Estudiar que no los tiene, uno por sesión. Úsala cuando pidan "completa el siguiente curso", "pasa otro curso al formato mentor" o escriban /completar-curso-mentor. Para un curso nuevo usa agregar-curso.
---

# Completar un curso viejo con el formato mentor

1. `node .claude/skills/completar-curso-mentor/scripts/faltan-mentor.mjs`: mira qué falta. Si no dicen cuál, toma el primero de la lista.
2. Lee ese curso completo, y la sección 2b de `.claude/skills/agregar-curso/SKILL.md`: ahí está qué debe llevar cada campo.
3. Agrega solo lo que falte, con el mismo tono y rigor del curso.
4. `npm test`, y vuelve a correr el script para confirmar que ese curso quedó completo.
5. Prueba una lección y la pestaña 🗺️ Mapa con la skill `probar-rutina`.
6. Actualiza la memoria "Cursos con mentor" con el curso terminado y resume qué agregaste. No hagas commit sin que lo pidan.

## Reglas
- **Un curso por sesión.**
- **No cambies, reordenes ni borres lecciones, tarjetas ni fuentes.** Las tarjetas se identifican por curso, lección y posición: moverlas daña el repaso de quien ya empezó.
- El `reto` y el `feynman` salen del contenido que ya tiene la lección: no agregues afirmaciones nuevas sin fuente, y nunca inventes una fuente o una cifra.
- En tradiciones esotéricas, los retos siguen separando lo que dice la tradición de lo que muestra la evidencia.

## Ejemplos
- ✅ Bien: un `reto` de Metacognición: "Antes de tu próximo examen o reunión, predice tu resultado de 0 a 100 y compáralo después."
- ✅ Bien: un `feynman` que prohíbe la jerga clave: "Explícale a un niño de 12 años por qué sentir que entiendes no es entender, sin usar 'metacognición' ni 'ilusión'."
- ❌ Mal: reescribir una lección porque "quedaría mejor" o agregar un dato con cifra nueva sin fuente.

## Si el usuario corrige algo de esta skill
Propón el cambio a este archivo como un diff, aplícalo solo con su visto bueno y anótalo en `CHANGELOG.md`.
