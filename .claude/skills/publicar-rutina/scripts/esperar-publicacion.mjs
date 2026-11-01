// Espera a que GitHub Pages termine de publicar el commit actual y comprueba que el sitio responda.
//   node .claude/skills/publicar-rutina/scripts/esperar-publicacion.mjs
import { execSync } from 'node:child_process';

const sh = (c) => execSync(c, { encoding: 'utf8' }).trim();
const sha = sh('git rev-parse HEAD');
const repo = sh('git remote get-url origin').replace(/^.*github\.com[/:]/, '').replace(/\.git$/, '');
const [dueno, nombre] = repo.split('/');
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

let run = null;
for (let i = 0; i < 40; i++) {
  const r = await fetch('https://api.github.com/repos/' + repo + '/actions/runs?head_sha=' + sha);
  if (r.ok) run = (await r.json()).workflow_runs?.[0] || null;
  if (run && run.status === 'completed') break;
  await dormir(10000);
}
console.log('Commit', sha.slice(0, 7));
if (!run || run.status !== 'completed') { console.error('❌ No terminó en el tiempo de espera:', run ? run.html_url : 'no apareció la publicación'); process.exit(1); }
if (run.conclusion !== 'success') { console.error('❌ La publicación falló (' + run.conclusion + '):', run.html_url); process.exit(1); }
const sitio = 'https://' + dueno.toLowerCase() + '.github.io/' + nombre + '/', web = await fetch(sitio);
console.log('✓ Publicado:', sitio, '· sitio responde', web.status);
process.exit(web.ok ? 0 : 1);
