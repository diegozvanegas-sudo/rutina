---
name: probar-rutina
description: Prueba un cambio de pantalla de la app Rutina en Chrome sin ventana, con clics reales, celular y computador, y revisa las capturas. Úsala después de cambiar algo visible en src/vistas o src/estilos.css, o cuando pidan "pruébalo" o "míralo en el navegador". No la uses para cambios de solo lógica (basta npm test) ni para probar la versión publicada.
---

# Probar Rutina en el navegador

1. Escribe una prueba corta en el scratchpad de la sesión, nunca en el repo:
   ```js
   export default async (p) => {
     await p.ir('recordatorios');
     await p.tocar('[data-accion=rec-abrir-agregar]');
     console.log(await p.cuantos('.rec'));
     await p.foto('rec-pc');
     await p.celular();
     console.log('sin desborde', await p.sinDesborde());
     await p.foto('rec-cel');
   };
   ```
2. Córrela: `node .claude/skills/probar-rutina/scripts/probar.mjs <prueba.mjs> <scratchpad>`. Levanta y apaga todo sola.
3. **Abre las capturas con Read.** Es obligatorio.
4. Reporta lo que viste, y también lo que no se probó.

Ayudas de `p`: `ir`, `tocar`, `pasar`, `arrastrar`, `dedo`, `poner`, `leer`, `cuantos`, `foto`, `estado`, `ev`, `cdp`, `celular`, `computador`, `sinDesborde`, `recargar`. Lee el script solo si necesitas algo más.

## Reglas
- Usa `tocar`, no `.click()` por código: el clic por código no nota un botón oculto o tapado. Así se escapó el botón « » del menú.
- Prueba el recorrido del usuario: abrir, cambiar, guardar y recargar. Comprueba lo guardado con `estado()`.
- Con `confirm` automático no se prueba el texto del diálogo: dilo si importa.
- `estado()` da null hasta el primer guardado: haz antes una acción que guarde.
- Lo que está en un desplegable cerrado tiene `innerText` vacío: usa `textContent`.
- Corre en modo "Sin nube", con datos de ejemplo. Nunca escribas la contraseña del usuario. Al reportar, di que no se probó con su cuenta, ni la nube, ni un celular físico.

## Ejemplos
- ✅ Bien: "Marqué Támesis con clic real, recargué, sigue en verde; vi la captura en celular y no hay desborde."
- ✅ Bien: "El script pasó, pero la captura muestra el botón cortado: lo corrijo antes de decir que está listo."
- ❌ Mal: "El script no dio errores, así que funciona", sin abrir las capturas.

## Si el usuario corrige algo de esta skill
Propón el cambio a este archivo como un diff, aplícalo solo con su visto bueno y anótalo en `CHANGELOG.md`.
