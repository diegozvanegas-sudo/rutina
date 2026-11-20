// Aviso al abrir una sesión: recuerda la revisión por partes pendiente (memoria "revision-por-partes").
// Cuando la memoria diga "REVISION TERMINADA" deja de avisar. Solo local: no se sube a GitHub.
import { readFileSync } from 'node:fs';
const MEMORIA = 'C:/Users/diego/.claude/projects/c--Users-diego-OneDrive-Documentos-Envarias-Revisar-IA-reporte-Aplicaciones-modulos-rutina/memory/revision-por-partes.md';
let texto = '';
try { texto = readFileSync(MEMORIA, 'utf8'); } catch { process.exit(0); }
if (texto.includes('REVISION TERMINADA')) process.exit(0);
const hechas = (texto.match(/- Part (\d) reviewed/g) || []).map((l) => l.match(/\d/)[0]);
const siguiente = [1, 2, 3, 4, 5, 6].find((n) => !hechas.includes(String(n)));
const aviso = '📋 Revisión de la app pendiente: van ' + hechas.length + ' de 6 partes' + (siguiente ? ', sigue la Parte ' + siguiente : '') +
  '. Hay hallazgos de la Parte 1 sin corregir (el entrenador dice "sube peso" el día después del partido). Para seguir, di: "continúa la revisión".';
console.log(JSON.stringify({
  systemMessage: aviso,
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: 'Al empezar, en tu primera respuesta recuérdale a Diego (en español) la revisión por partes pendiente de la memoria revision-por-partes: cuántas partes van, cuál sigue y los hallazgos de la Parte 1 sin corregir, y pregúntale si sigue con la revisión o corrige primero los puntos 1 y 2.',
  },
}));
