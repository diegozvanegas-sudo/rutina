// Corre una prueba de la app en Chrome sin ventana, en modo "Sin nube" y con un perfil temporal: no hay login ni datos reales.
//   node .claude/skills/probar-rutina/scripts/probar.mjs <prueba.mjs> [carpeta de capturas]
// La prueba exporta: export default async (p) => { await p.ir('lugares'); await p.tocar('.algo'); await p.foto('nombre'); };
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , rutaPrueba, carpeta] = process.argv;
if (!rutaPrueba) { console.error('Uso: node probar.mjs <prueba.mjs> [carpeta de capturas]'); process.exit(2); }
const fotos = resolve(carpeta || join(tmpdir(), 'rutina-capturas'));
mkdirSync(fotos, { recursive: true });

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const puertoLibre = () => new Promise((r) => { const s = createServer().listen(0, () => { const { port } = s.address(); s.close(() => r(port)); }); });
const navegador = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if (!navegador) { console.error('No encontré Chrome ni Edge'); process.exit(2); }

const [web, depurar] = [await puertoLibre(), await puertoLibre()];
const perfil = mkdtempSync(join(tmpdir(), 'rutina-perfil-'));
// Sin las claves de Supabase la app arranca en modo "Sin nube"
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(web), '--strictPort'], { env: { ...process.env, VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' }, stdio: 'ignore' });
const chrome = spawn(navegador, ['--headless=new', '--remote-debugging-port=' + depurar, '--user-data-dir=' + perfil, '--no-first-run', 'about:blank'], { stdio: 'ignore' });

let codigo = 0;
const errores = [];
try {
  for (let i = 0; i < 60; i++) { try { await fetch('http://localhost:' + web + '/'); break; } catch { await dormir(250); } }
  let tabs;
  for (let i = 0; i < 60 && !tabs; i++) { await dormir(250); try { tabs = await (await fetch('http://127.0.0.1:' + depurar + '/json')).json(); } catch {} }
  const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => { ws.onopen = r; });
  let id = 0;
  const pendientes = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id) { pendientes.get(m.id)?.(m.result ?? m); return; }
    if (m.method === 'Runtime.exceptionThrown') errores.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errores.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
  };
  const cdp = (metodo, params = {}) => new Promise((r) => { const i = ++id; pendientes.set(i, r); ws.send(JSON.stringify({ id: i, method: metodo, params })); });
  const ev = async (x) => {
    const r = await cdp('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error('En la página: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result?.value;
  };
  const texto = JSON.stringify;
  // Punto de la pantalla donde el elemento recibe el toque de verdad (si algo lo tapa, se nota)
  const punto = async (s) => {
    const p = await ev(`(()=>{const el=document.querySelector(${texto(s)}); if(!el) return null; el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); for(let f=.5;f>.05;f-=.05)for(const [a,b] of [[.5,f],[f,.5],[1-f,.5],[.5,1-f]]){const x=r.x+r.width*a,y=r.y+r.height*b,t=document.elementFromPoint(x,y); if(t&&(t===el||el.contains(t))) return [x,y]} return 'tapado'})()`);
    if (!p) throw new Error('No existe: ' + s);
    if (p === 'tapado') throw new Error('Está tapado o no se ve: ' + s);
    await dormir(120);
    return p;
  };
  const raton = (type, x, y, extra = {}) => cdp('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1, ...extra });
  const p = {
    cdp, ev, dormir, errores,
    ir: async (seccion) => { await ev(`location.hash=${texto('#' + seccion)}`); await dormir(600); await ev('window.scrollTo(0,0)'); },
    pantalla: async (ancho, alto, movil = false) => { await cdp('Emulation.setDeviceMetricsOverride', { width: ancho, height: alto, deviceScaleFactor: 1, mobile: movil }); await cdp('Emulation.setTouchEmulationEnabled', { enabled: movil }); await dormir(200); },
    celular: () => p.pantalla(390, 844, true),
    computador: () => p.pantalla(1280, 950),
    // Clic real del mouse: falla si el botón no se ve. Úsalo por defecto
    tocar: async (s) => { const c = await punto(s); await raton('mouseMoved', ...c, { buttons: 0 }); await raton('mousePressed', ...c); await raton('mouseReleased', ...c); await dormir(450); },
    pasar: async (s) => { const c = await punto(s); await raton('mouseMoved', ...c, { buttons: 0 }); await dormir(150); },
    arrastrar: async (s, dx, dy) => { const c = await punto(s); await raton('mouseMoved', ...c, { buttons: 0 }); await raton('mousePressed', ...c); for (let i = 1; i <= 6; i++) await raton('mouseMoved', c[0] + dx * i / 6, c[1] + dy * i / 6); await raton('mouseReleased', c[0] + dx, c[1] + dy); await dormir(400); },
    dedo: async (s) => { const c = await punto(s); await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: c[0], y: c[1] }] }); await cdp('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await dormir(450); },
    poner: async (s, valor, evento = 'change') => { await ev(`(()=>{const c=document.querySelector(${texto(s)}); if(!c) throw new Error('No existe: '+${texto(s)}); c.value=${texto(valor)}; c.dispatchEvent(new Event(${texto(evento)},{bubbles:true}))})()`); await dormir(300); },
    leer: (s) => ev(`document.querySelector(${texto(s)})?.innerText?.replace(/\\s+/g,' ')`),
    cuantos: (s) => ev(`document.querySelectorAll(${texto(s)}).length`),
    foto: async (nombre) => { const r = await cdp('Page.captureScreenshot', { format: 'png' }); const f = join(fotos, nombre + '.png'); writeFileSync(f, Buffer.from(r.data, 'base64')); console.log('📷', f); },
    // Los datos guardados (null hasta la primera vez que la app guarda)
    estado: () => ev(`(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('rutina_v1'));return k?JSON.parse(localStorage[k]):null})()`),
    sinDesborde: () => ev('document.documentElement.scrollWidth<=innerWidth'),
    recargar: async () => { await cdp('Page.reload'); await dormir(1800); },
  };
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  // Los diálogos nativos bloquearían la prueba: se aceptan solos
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: 'window.confirm=()=>true;window.alert=()=>{};' });
  await p.computador();
  await cdp('Page.navigate', { url: 'http://localhost:' + web + '/' });
  await dormir(2000);
  await (await import(pathToFileURL(resolve(rutaPrueba)).href)).default(p);
  ws.close();
} catch (err) {
  console.error('❌', err.message);
  codigo = 1;
} finally {
  chrome.kill();
  vite.kill();
  await dormir(300);
  try { rmSync(perfil, { recursive: true, force: true, maxRetries: 3 }); } catch {}
}
console.log(errores.length ? '❌ Errores en consola:\n' + errores.join('\n') : '✓ Sin errores en consola');
process.exit(codigo || (errores.length ? 1 : 0));
