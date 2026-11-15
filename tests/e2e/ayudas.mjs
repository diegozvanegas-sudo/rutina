// Ayudas para los recorridos de punta a punta (tests/e2e/*.mjs). Buscan los elementos por lo que el usuario ve
// (texto, aria-label) o por atributos de datos, nunca por clases de estilo: así el mismo recorrido sirve antes y
// después de migrar una pantalla, y los textos que imprime ("§") se pueden comparar.
export function ayudas(p, pantalla) {
  const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
  // Lo que se ve, sin flechas de plegar, sin el relleno invisible de los campos y con los espacios juntos
  const texto = () => p.ev(`document.getElementById('vista').textContent.replace(/[▾▸▼▶\\u200b]/g,'').replace(/\\s+/g,' ').trim()`);
  const a = {
    dormir,
    texto,
    paso: async (nombre) => console.log('§ ' + nombre + ' :: ' + await texto()),
    falla: (cond, msg) => { if (!cond) throw new Error(pantalla + ': ' + msg); },
    // Espera a que exista algo (las pantallas migradas se descargan al abrirlas)
    esperar: async (selector, max = 8000) => {
      const t0 = Date.now();
      while (!(await p.cuantos(selector)) && Date.now() - t0 < max) await dormir(100);
      if (!(await p.cuantos(selector))) throw new Error(pantalla + ': no apareció ' + selector);
    },
    // Marca con data-e2e el elemento con ese texto (o aria-label) y lo deja a la vista. exacto=false: que empiece así
    marcar: (txt, selector = 'button, summary, a, [role=button]', exacto = true) => p.ev(`(()=>{
      document.querySelectorAll('[data-e2e]').forEach(x=>x.removeAttribute('data-e2e'));
      const n=s=>(s||'').replace(/[▾▸▼▶\\u200b]/g,'').replace(/\\s+/g,' ').trim(), t=${JSON.stringify(txt)};
      const todos=[...document.querySelectorAll(${JSON.stringify(selector)})].filter(x=>x.checkVisibility({visibilityProperty:true}));
      const vale=x=>{const v=[n(x.textContent),n(x.getAttribute('aria-label'))];return ${exacto} ? v.includes(t) : v.some(y=>y.startsWith(t))};
      const el=todos.find(vale);
      if(!el) return false;
      el.setAttribute('data-e2e','1'); el.scrollIntoView({block:'center'}); return true})()`),
    // Clic real en el botón, enlace o título con ese texto
    tocarTexto: async (txt, selector, exacto = true) => {
      if (!(await a.marcar(txt, selector, exacto))) throw new Error(pantalla + ': no encontré "' + txt + '"');
      await p.tocar('[data-e2e]');
    },
    // Escribe como el usuario: clic en el campo, reemplaza lo que había y teclea
    escribir: async (selector, valor) => {
      await p.ev(`document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'center'})`);
      await p.tocar(selector);
      await p.ev(`document.activeElement.select && document.activeElement.select()`);
      if (valor === '') await a.tecla('Backspace', 8); else await p.cdp('Input.insertText', { text: valor });
      await dormir(120);
    },
    // El campo (el n-ésimo) cuya etiqueta empieza con ese texto: lo marca con data-e2e-campo. Sirve con la etiqueta
    // envolviendo al campo (antes) y con la etiqueta enlazada por "for" (Material UI)
    campo: async (etiqueta, n = 0) => {
      const ok = await p.ev(`(()=>{
        document.querySelectorAll('[data-e2e-campo]').forEach(x=>x.removeAttribute('data-e2e-campo'));
        const t=${JSON.stringify(etiqueta)}, campos=[];
        for(const l of document.querySelectorAll('#vista label')){
          const propio=[...l.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent).join('').trim()||l.textContent.trim();
          if(!propio.startsWith(t)) continue;
          const c=l.querySelector('input,textarea,select')||(l.htmlFor&&document.getElementById(l.htmlFor));
          if(c&&c.checkVisibility({visibilityProperty:true})) campos.push(c);
        }
        const c=campos[${n}]; if(!c) return false; c.setAttribute('data-e2e-campo','1'); return true})()`);
      if (!ok) throw new Error(pantalla + ': no encontré el campo "' + etiqueta + '" (' + n + ')');
      return '[data-e2e-campo]';
    },
    escribirCampo: async (etiqueta, valor, n = 0) => { await a.escribir(await a.campo(etiqueta, n), valor); await a.salir(); },
    valorCampo: async (etiqueta, n = 0) => a.valor(await a.campo(etiqueta, n)),
    // Salir del campo (como tocar afuera): ahí es cuando los campos de edición guardan
    salir: async () => { await p.ev(`document.activeElement && document.activeElement.blur()`); await dormir(350); },
    tecla: async (key, codigo) => {
      const base = { key, code: key, windowsVirtualKeyCode: codigo, nativeVirtualKeyCode: codigo };
      await p.cdp('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...base });
      if (key === 'Enter') await p.cdp('Input.dispatchKeyEvent', { type: 'char', text: '\r', ...base });
      await p.cdp('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
      await dormir(350);
    },
    valor: (selector) => p.ev(`document.querySelector(${JSON.stringify(selector)})?.value`),
    aviso: () => p.ev(`(()=>{const t=document.getElementById('toast');return t&&!t.hidden?t.textContent:''})()`),
  };
  return a;
}
