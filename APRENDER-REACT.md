# Aprender React con la app Rutina

Guía para entender React, por qué se usa, y cómo está organizado en esta app. Los ejemplos salen del código real del repo, así que puedes abrir cada archivo y verlo funcionando.

Cómo leerla: las partes 1 a 4 son lo mínimo para entender cualquier pantalla. Las partes 5 a 9 son para tomar buenas decisiones. La parte 10 es el orden para estudiar.

---

## 1. Qué es React y por qué se usa

React es una biblioteca de JavaScript para construir pantallas. La creó Facebook en 2013 y hoy es la más usada del mundo para aplicaciones web.

### El problema que resuelve

Antes de React, esta app pintaba así (todavía lo hace en las pantallas sin migrar):

1. Cada pantalla arma un texto gigante de HTML.
2. `main.js` borra todo lo que hay y pone ese texto nuevo (`innerHTML`).
3. Como se borró todo, hay que **reparar a mano** lo que se perdió: lo que estabas escribiendo, dónde estaba el cursor, la posición de la pantalla, qué tarjetas estaban cerradas.

Esa reparación son unas 150 líneas en `src/main.js` (`recordarCampos`, `restaurarCampos`, `anclaDe`, `prepararPlegables`). Funciona, pero cada pantalla nueva puede romperla.

### La idea de React

Tú describes **cómo debe verse la pantalla según los datos**, y React se encarga de cambiar solo lo que cambió.

```
pantalla = f(datos)
```

Si cambia un dato, React vuelve a calcular la pantalla, la compara con la anterior y toca únicamente los elementos distintos. Por eso no se pierde el cursor ni el scroll: lo que no cambió, no se toca.

### Por qué React y no otra cosa

| Opción | A favor | En contra |
|---|---|---|
| **React** | La más usada: más empleo, más bibliotecas, más respuestas a cualquier duda | Hay que elegir tú mismo las piezas (rutas, datos, estilos) |
| Vue | Más fácil de empezar | Menos empleo y menos bibliotecas |
| Angular | Trae todo incluido; común en bancos y empresas grandes | Pesado y con mucha ceremonia |
| Svelte | Código muy corto y rápido | Comunidad pequeña |
| Sin framework (como estaba) | Cero dependencias | Tú mantienes todo lo que React ya resuelve |

Para esta app: React, porque es donde hay más gente, más componentes listos y más futuro si algún día entra otro programador.

### Dónde se usa

- **Páginas web**: React con Vite (lo que usamos) o con Next.js.
- **Celular nativo**: React Native (Android y iPhone con el mismo código).
- **Escritorio**: Electron o Tauri con React adentro.

Lo que aprendas aquí sirve en los tres.

---

## 2. Las piezas básicas

### 2.1 Componente

Un componente es una **función que devuelve lo que se ve**. Su nombre empieza con mayúscula.

Ejemplo real, de `src/react/pantallas/Calendario.tsx`:

```tsx
function Constancia({ mes }: { mes: string }) {
  const c = constanciaGym(mes);
  if (!c.plan && !c.racha) return null;          // no hay nada que mostrar
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>🔥 Racha: <b>{c.racha} entrenos</b> seguidos</span>
    </Box>
  );
}
```

Se usa como si fuera una etiqueta HTML: `<Constancia mes="2026-11" />`.

### 2.2 JSX

Eso que parece HTML dentro de JavaScript se llama JSX. Tres reglas:

- Lo que va entre llaves `{ }` es JavaScript: `{c.racha}`, `{a + b}`, `{condicion && <p>Hola</p>}`.
- Se escribe `className` en vez de `class`, y `onClick` en vez de `onclick`.
- Un componente devuelve **una sola raíz**. Si necesitas varias, se envuelven en `<> ... </>`.

React escapa el texto solo: ya no hace falta la función `esc()` de antes para evitar que un nombre con `<` rompa la pantalla.

### 2.3 Props

Las props son los **datos que el padre le pasa al hijo**. Son de solo lectura: el hijo no las cambia.

```tsx
<Celda f="2026-11-15" mes={mes} elegido={elegido} alElegir={(x) => ver(x)} />
```

Fíjate en `alElegir`: una prop también puede ser una **función**. Así el hijo le avisa al padre que pasó algo ("tocaron este día"), sin saber qué hará el padre con eso.

### 2.4 Estado (`useState`)

El estado es **lo que la pantalla recuerda y puede cambiar**. Cuando cambia, React vuelve a pintar el componente.

```tsx
const [mes, ponerMes] = useState('2026-11');
// mes       → el valor actual
// ponerMes  → la función para cambiarlo
ponerMes('2026-12');   // React repinta con diciembre
```

Regla de oro: **nunca cambies el estado directamente** (`mes = '2026-12'` no hace nada). Siempre con su función.

### 2.5 Listas y `key`

Para pintar una lista se usa `.map()`. Cada elemento necesita una `key` única y estable, para que React sepa cuál es cuál al comparar:

```tsx
{semanas.map((s) => (
  <div key={s[0]}>
    {s.map((f) => <Celda key={f} f={f} />)}
  </div>
))}
```

Usa un identificador real (la fecha, el id), no la posición en la lista, o React se confunde al reordenar.

### 2.6 Eventos

```tsx
<button onClick={() => ver(otroMes(mes, 1))}>›</button>
```

Antes la app usaba `data-accion="cal-mes"` y un diccionario global de 339 acciones. En React el botón llama directo a su función: se ve en el mismo sitio qué hace.

---

## 3. Hooks: las herramientas de un componente

Un hook es una función que empieza por `use` y le da una capacidad al componente. Dos reglas: se llaman **solo dentro de componentes** (o de otros hooks) y **siempre en el mismo orden** (nunca dentro de un `if`).

| Hook | Para qué | Cuándo |
|---|---|---|
| `useState` | Recordar un valor que cambia | Pestaña abierta, texto de un campo, mes visto |
| `useEffect` | Hacer algo **fuera** de React después de pintar | Un temporizador, escuchar el teclado, pedir datos |
| `useMemo` | No repetir un cálculo caro | Solo si mides que es lento |
| `useRef` | Guardar algo sin repintar, o tocar un elemento | Poner el foco en un campo |
| `useContext` | Leer un dato compartido sin pasarlo por props | El usuario actual, el tema |
| `useSyncExternalStore` | Conectar React con datos que viven fuera | Nuestro puente con `estado.js` |

### El error más común: abusar de `useEffect`

`useEffect` es para **sincronizar con algo externo**. No es para calcular.

```tsx
// ❌ Mal: un efecto para calcular algo que sale de otros datos
const [total, ponerTotal] = useState(0);
useEffect(() => { ponerTotal(a + b); }, [a, b]);

// ✅ Bien: se calcula mientras se pinta
const total = a + b;
```

Si algo se puede calcular a partir de props o estado, **no es estado**: se calcula.

### Hooks propios

Puedes crear los tuyos para reutilizar lógica. El de esta app es `src/react/usarEstado.ts`:

```ts
export function usarEstado() {
  useSyncExternalStore(suscribir, () => version);
  return e();
}
```

Cualquier pantalla que llame `usarEstado()` recibe los datos de la app y **se repinta sola** cuando algo se guarda o se sincroniza con la nube. Es el puente entre la app vieja y la nueva.

---

## 4. Cómo está montado React en esta app

No se reescribió la app: React vive **dentro** de la app actual y la reemplaza pantalla por pantalla.

```
index.html
└─ src/main.js                   ← la app de siempre: menú, rutas, temporizador
   ├─ pantallas viejas           → src/vistas/*.js   (texto HTML)
   └─ pantallas migradas         → src/react/pantallas/*.tsx
        montadas por             → src/react/montar.js
        con los datos de         → src/react/usarEstado.ts
```

| Archivo | Qué hace |
|---|---|
| `src/main.js` | Tiene el mapa `REACT` con las pantallas migradas. Si la pantalla está ahí, la monta con React; si no, la pinta como antes |
| `src/react/montar.js` | Descarga React y la pantalla **solo cuando se abre** (carga diferida) y la monta dentro de `#vista` |
| `src/react/usarEstado.ts` | El hook que conecta React con `src/estado.js` |
| `src/plegables.js` | Lógica compartida de las tarjetas que se cierran: la usan las pantallas viejas y las nuevas, con las mismas claves |
| `src/react/pantallas/Calendario.tsx` | La primera pantalla migrada |

Este método se llama **patrón estrangulador** (*strangler fig*): lo nuevo crece alrededor de lo viejo hasta reemplazarlo, y la app nunca deja de funcionar.

### Cómo se comprueba que una pantalla migrada quedó igual

1. **Antes** de migrar se graba un recorrido con clics reales (`tests/e2e/calendario.mjs`): qué texto se ve en cada paso.
2. Se migra la pantalla.
3. Se corre **el mismo** recorrido y se comparan los textos: deben salir idénticos. El recorrido busca los elementos por `data-t` y no por clases de estilo, así cambiar el diseño no lo rompe.
4. Se miran las capturas en celular y en computador.

```
npm test        # 331 pruebas de la lógica
npm run tipos   # TypeScript revisa los tipos
npm run humo    # abre todas las pantallas en PC y celular
npm run e2e -- <carpeta>   # el recorrido del Calendario
```

---

## 5. TypeScript: por qué los archivos son `.tsx`

TypeScript es JavaScript con **tipos**: le dices qué forma tiene cada dato y el editor te avisa antes de ejecutar.

```tsx
function Constancia({ mes }: { mes: string }) { ... }

<Constancia mes={2026} />   // ❌ el editor lo marca: se esperaba texto, no número
```

Qué ganas:

- Los errores de "esto era `undefined`" aparecen al escribir, no cuando el usuario toca el botón.
- El editor autocompleta las props de cada componente.
- Cambiar el nombre de algo se hace en todos lados con seguridad.

En esta app es **gradual**: el código viejo sigue en `.js` y solo lo nuevo de React es `.tsx`. La configuración está en `tsconfig.json`.

---

## 6. Las piezas que acompañan a React

React solo pinta. Para lo demás se eligen bibliotecas. Estas son las estándar y lo que haremos aquí:

| Necesidad | Biblioteca habitual | En esta app |
|---|---|---|
| Compilar y servir | **Vite** | Ya se usa |
| Rutas (`#dieta/peso`) | React Router | Por ahora las maneja `main.js`; se pasa al final |
| Datos del servidor | **TanStack Query** | Cuando el backend deje de ser un solo JSON |
| Estado global | Zustand, Redux, Context | `estado.js` con `usarEstado()`; no hace falta más todavía |
| Formularios | React Hook Form + Zod | Al migrar pantallas con formularios grandes (Editar, Finanzas) |
| Componentes visuales | shadcn/ui, Material UI, Mantine | Ver la sección 7 |
| Pruebas de componentes | Vitest + Testing Library | Pendiente de instalar |
| Pruebas de punta a punta | Playwright | Hoy se usa un script propio con Chrome |
| App instalable y sin señal | vite-plugin-pwa | Ya se usa |

### Estado: dónde vive cada cosa

La pregunta que más importa en React es **dónde poner cada dato**:

| Tipo de dato | Ejemplo | Dónde va |
|---|---|---|
| De una sola pantalla | Mes que estoy viendo | `useState` en el componente |
| Compartido por varias pantallas | Rutina, metas, días | El estado global (`estado.js`) |
| Viene del servidor | Lista de clientes del entrenador | TanStack Query (con caché) |
| Está en la dirección | Qué sección y pestaña | La ruta (`#finanzas/planb`) |
| Preferencia del equipo | Tarjetas cerradas | `localStorage` |

Regla: el estado va **lo más cerca posible** de quien lo usa. Se sube a global solo cuando dos pantallas lo necesitan.

---

## 7. Biblioteca de componentes: shadcn/ui o Material UI

Las dos son gratis y de código abierto (licencia MIT). **Se elige una**: mezclarlas duplica el peso, mete dos sistemas de estilos que se pisan y deja la app con dos aspectos distintos.

| | shadcn/ui | Material UI (MUI) |
|---|---|---|
| Qué es | Componentes que se **copian** a tu repo; quedan como código tuyo | Una biblioteca que se **instala** y se actualiza |
| Estilos | Tailwind (clases como `flex gap-2 rounded-lg`) | Su propio sistema (Emotion) y un tema central |
| Aspecto | Neutro y sobrio; se adapta fácil a un diseño propio | El estilo de Google/Android; reconocible |
| Componentes listos | Menos; los complejos los armas tú | Muchos: selector de fechas, tablas, autocompletar |
| Peso | Liviano (solo lo que copias) | Más pesado (alrededor de 80-100 KB comprimidos de base) |
| Riesgo para las pantallas viejas | Hay que aislar el CSS actual para que Tailwind no lo afecte | Bajo: no toca el CSS global |
| Para aprender | Aprendes también Tailwind y Radix | Documentación muy completa y con ejemplos |

Con cualquiera de las dos, los colores y medidas salen de `src/estilos.css` (fondo `#101418`, verde `#3dd68c`, bordes de 14 px), para que el aspecto siga siendo el de tu app.

### La decisión en esta app: Material UI

Se eligió **Material UI** el 15 de noviembre de 2026, sobre todo porque no toca el CSS global: las pantallas viejas no corren riesgo mientras se migra. Así está montado:

| Archivo | Qué hace |
|---|---|
| `src/react/tema.ts` | El **tema**: colores, tipografía, radios y tamaños de botones, copiados de `src/estilos.css`. Cambiar un color aquí lo cambia en todas las pantallas de React |
| `src/react/Proveedor.tsx` | Envuelve cada pantalla con el tema (`ThemeProvider`) |
| `src/react/ui/` | Componentes propios hechos con piezas de Material UI: `TarjetaPlegable`, `ListaPares`, `Flecha` |

Tres cosas de Material UI que verás en todo el código:

- **Componentes listos**: `Card`, `Button`, `IconButton`, `Typography`, `Accordion`, `Collapse`. Se importan de `@mui/material`.
- **La prop `sx`**: estilos escritos como objeto, con acceso al tema. `sx={{ color: 'text.secondary', mt: '8px' }}` usa el gris del tema y 8 px de margen arriba.
- **La prop `component`**: cambia la etiqueta HTML sin cambiar el aspecto. `<Typography component="h2" variant="h2">` es un `<h2>` real para lectores de pantalla.

Regla de la casa: los colores **nunca** se escriben a mano en una pantalla; salen del tema (`'primary.main'`, `'divider'`) o de `tokens`.

---

## 8. Arquitectura: cómo se organiza una app grande

### 8.1 Carpetas por función, no por tipo

```
❌ Por tipo                      ✅ Por función
src/                            src/funciones/
  components/                     gym/
  hooks/                            dominio/    ← reglas puras (sin React ni red)
  utils/                            datos/      ← leer y guardar
  pages/                            pantalla/   ← componentes de React
                                  finanzas/
                                    dominio/ datos/ pantalla/
                                compartido/     ← botones, tarjetas, fechas
```

Con carpetas por función, todo lo de Gym está junto. Borrar o cambiar una función no obliga a buscar por toda la app.

### 8.2 Las tres capas

| Capa | Qué contiene | Qué **no** puede hacer |
|---|---|---|
| **Dominio** | Reglas del negocio: cuánto subir de peso, la carga del fútbol, la racha | Usar React, tocar el DOM, llamar a Supabase |
| **Datos** | Leer y guardar: `localStorage`, Supabase, sincronización | Decidir reglas del negocio |
| **Pantalla** | Componentes de React: mostrar y recibir toques | Calcular reglas o hablar directo con la base |

La dependencia va en **una sola dirección**: pantalla → dominio ← datos. El dominio no conoce a nadie.

Esta app ya tiene buena parte hecha: `src/entrenador.js`, `src/gym.js` o `src/calendario.js` son dominio puro, y por eso tienen 331 pruebas que corren en medio segundo sin navegador. Eso es lo que permitió migrar el Calendario sin tocar una sola regla.

### 8.3 Componentes: tontos y listos

- **De presentación ("tontos")**: reciben props y pintan. No saben de dónde vienen los datos. Ej.: `Celda`, `Constancia`.
- **Contenedores ("listos")**: traen los datos, tienen el estado y se los pasan a los tontos. Ej.: `Calendario`.

Mientras más componentes tontos, más fácil probar y reutilizar.

---

## 9. SOLID aplicado a React

SOLID son cinco principios para que el código aguante cambios. Nacieron para clases, pero aplican igual a componentes y funciones.

### S — Una sola responsabilidad

Cada pieza hace **una cosa** y tiene **un solo motivo para cambiar**.

En `Calendario.tsx`: `Celda` pinta un día, `Detalle` la tarjeta del día elegido, `Constancia` la racha, `Explicacion` el texto. Si mañana cambia cómo se ve un día, solo se toca `Celda`.

Señal de alarma: un componente de 400 líneas que pide datos, valida un formulario y pinta una tabla.

### O — Abierto para extender, cerrado para modificar

Se agrega comportamiento **sin editar** lo que ya funciona.

Una tarjeta recibe su contenido como `children`: sirve para la luna, los festivos y las estaciones sin cambiar la tarjeta. Si necesitara un `if` nuevo por cada uso, estaría violando este principio.

```tsx
<TarjetaPlegable titulo="🇨🇴 Próximos festivos">
  <ListaPares pares={...} />       {/* cualquier contenido */}
</TarjetaPlegable>
```

### L — Sustitución (Liskov)

Si algo dice ser un botón, debe **comportarse como un botón**: aceptar `onClick`, `disabled`, foco con teclado.

Un `<BotonPrimario>` que ignora `disabled` rompe la promesa: quien lo use en lugar de un `<button>` se llevará una sorpresa.

### I — Interfaces pequeñas

Un componente recibe **solo lo que necesita**.

```tsx
// ❌ Recibe todo el estado de la app para leer un dato
<Constancia estado={estado} />

// ✅ Recibe lo justo
<Constancia mes={mes} />
```

Con props pequeñas el componente se puede probar y reutilizar sin armar toda la app alrededor.

### D — Depender de abstracciones, no de detalles

La pantalla no debe saber **cómo** se guardan los datos, solo **qué** puede pedir.

Hoy las pantallas leen con `usarEstado()` sin saber si los datos vienen de `localStorage` o de la nube. El día que el backend pase de un JSON único a tablas, se cambia la capa de datos y **las pantallas no se tocan**. Ese es el principio que más importa para llegar a muchos usuarios.

---

## 10. Lo que hace falta para muchos usuarios

React no es lo que limita la escala. Estos son los puntos reales, en orden de importancia:

1. **Backend**: hoy todo lo de un usuario es un solo JSON que se guarda entero en cada cambio. Para crecer: tablas por función, permisos por fila (RLS), índices y sincronizar solo lo que cambió.
2. **Guardado en el equipo**: `localStorage` tiene un tope cercano a 5 MB. Se pasa a IndexedDB con una cola de cambios pendientes.
3. **Peso inicial**: el paquete principal pesa 1 MB. Cada pantalla debe descargarse al abrirla (`import()`), como ya hace el Calendario.
4. **Observabilidad**: registro de errores (por ejemplo Sentry) para enterarte de un fallo antes de que te escriba el usuario.
5. **Pruebas automáticas en cada subida** (CI): si falla una prueba, no se publica.
6. **Accesibilidad**: teclado, foco visible, contraste y nombres para lectores de pantalla.

---

## 11. Orden para aprender

| Etapa | Qué estudiar | Práctica en este repo |
|---|---|---|
| 1 | JavaScript moderno: `const`, flechas, `map`/`filter`, desestructurar, módulos, promesas | Lee `src/fechas.js` y `src/calendario.js` |
| 2 | Componentes, JSX, props | Lee `Calendario.tsx` de arriba abajo |
| 3 | `useState` y eventos | Cambia el texto de "Volver a hoy" y mira qué pasa con `npm run dev` |
| 4 | Listas, condiciones, formularios | Sigue la migración de una pantalla con campos |
| 5 | `useEffect` y cuándo **no** usarlo | Lee "You Might Not Need an Effect" en react.dev |
| 6 | Hooks propios | Entiende `usarEstado.ts` línea por línea |
| 7 | TypeScript básico | Pasa el cursor sobre las variables en VS Code y mira sus tipos |
| 8 | Pruebas | Lee `tests/entrenador.test.mjs` y `tests/e2e/calendario.mjs` |
| 9 | Arquitectura y SOLID | Vuelve a las secciones 8 y 9 con una pantalla grande en mente |

### Dónde estudiar

- **react.dev/learn**: el tutorial oficial, gratis y en español. Es la mejor fuente; empieza por "Inicio rápido" y "Pensar en React".
- **typescriptlang.org/docs/handbook**: el manual de TypeScript.
- **La documentación de la biblioteca visual que elijas** (ui.shadcn.com o mui.com): ambas traen ejemplos para copiar.

### Glosario

| Término | Significado |
|---|---|
| Componente | Función que devuelve lo que se ve |
| Props | Datos que el padre le pasa al hijo |
| Estado | Lo que el componente recuerda y puede cambiar |
| Hook | Función `use...` que da una capacidad al componente |
| Render (pintar) | Cuando React llama al componente para saber qué mostrar |
| Montar / desmontar | Cuando un componente aparece o desaparece de la pantalla |
| JSX | La sintaxis parecida a HTML dentro de JavaScript |
| Carga diferida | Descargar una pantalla solo cuando se abre |
| RLS | Permisos por fila en la base de datos: cada usuario solo ve lo suyo |
