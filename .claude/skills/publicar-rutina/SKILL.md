---
name: publicar-rutina
description: Publica los cambios de la app Rutina: pruebas, build, commit de los archivos de la tarea, subida a main y confirmación de GitHub Pages. Úsala solo cuando el usuario diga "sube", "publica", "súbelo", responda sí a "¿Lo subo?" o escriba /publicar-rutina. No la uses solo por terminar un cambio.
---

# Publicar Rutina

Subir a `main` publica la app en GitHub Pages. Solo se hace cuando el usuario lo pide.

1. `git status --short`: mira qué cambió.
2. `npm test` y `npm run build`. Si algo falla, **para**, muestra el error y no subas.
3. `git add` con **los nombres de los archivos de la tarea**. Nunca `git add .` ni `-A`.
4. Commit con un mensaje en español, al estilo del repo ("Sección: qué cambió"), con la atribución que indique la sesión. Revisa primero `git log -5 --format=%s`.
5. `git push origin main`.
6. `node .claude/skills/publicar-rutina/scripts/esperar-publicacion.mjs`.
7. Responde corto: el commit, si quedó publicado, cómo verlo y qué no se probó.

## Reglas
- Nunca subas `botn8n.txt`, `sesionmapas.txt`, `promptskills.txt` ni nada que no sea de la tarea. Si hay un archivo desconocido, déjalo y dilo.
- Un archivo con pinta de secreto (`.env`, llaves) no se sube: avisa.
- No uses `--force` ni `--no-verify`. Si el push falla, muestra el error.
- Un "sí" autoriza esa subida, no las siguientes.
- Di "publicado" solo si el script lo confirma.

## Ejemplos
- ✅ Bien: "Publicado (`f85f1b6`). Recarga la app; si sigue igual, ciérrala y ábrela. No lo probé con tu cuenta."
- ✅ Bien: "No lo subí: fallaron 2 pruebas de finanzas. Aquí está el error."
- ❌ Mal: `git add -A` y decir "listo" apenas termina el push, sin esperar la publicación.

## Si el usuario corrige algo de esta skill
Propón el cambio a este archivo como un diff, aplícalo solo con su visto bueno y anótalo en `CHANGELOG.md`.
