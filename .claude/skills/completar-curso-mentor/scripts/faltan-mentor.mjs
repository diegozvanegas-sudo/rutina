// Lista qué campos de mentor le faltan a cada curso de 🎓 Estudiar.
//   node .claude/skills/completar-curso-mentor/scripts/faltan-mentor.mjs
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const { CURSOS } = await import(pathToFileURL(resolve('src/cursos/index.js')).href);
const lleno = (x) => (Array.isArray(x) ? x.length > 0 : !!String(x ?? '').trim());
let completos = 0;
for (const c of CURSOS) {
  const lecciones = c.modulos.flatMap((m) => m.lecciones), f = [];
  for (const k of ['ancla', 'principios', 'ochenta', 'diagnostico']) if (!lleno(c[k])) f.push(k);
  const sinComprobar = c.modulos.filter((m) => !lleno(m.comprobacion)).length;
  if (sinComprobar) f.push('comprobacion ' + sinComprobar + '/' + c.modulos.length);
  for (const k of ['feynman', 'reto']) { const n = lecciones.filter((l) => !lleno(l[k])).length; if (n) f.push(k + ' ' + n + '/' + lecciones.length); }
  if (f.length) console.log(c.id + ' (' + lecciones.length + ' lecciones): falta ' + f.join(', '));
  else completos++;
}
console.log('Completos: ' + completos + ' de ' + CURSOS.length);
