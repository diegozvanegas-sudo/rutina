// ⌨️ Que salga de una para escribir. El celular (sobre todo el iPhone) solo abre el teclado si el foco se pone en el mismo
// toque; las pantallas ponen el foco un instante después (cuando ya están pintadas) y ahí el teclado ya no sale.
// Arreglo: en el toque se enfoca un campo invisible (eso abre el teclado) y, cuando el campo de verdad aparece y se enfoca,
// el teclado sigue abierto y el invisible se quita.
// Uso: un botón con data-teclado lo hace solo. data-teclado="#fin-monto" además pone el foco en ese campo cuando aparece
// (sirve para enlaces que llevan a otra pantalla). Desde código: prepararTeclado('[data-t=buscar-campo]')
const ESPERA = 1500;
let puente = null, hasta = 0, vuelta = null;

function quitar() {
  if (puente) { puente.remove(); puente = null; }
}

const escribible = (el) => !!el && el !== puente && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

export function prepararTeclado(selector) {
  try {
    if (!puente) {
      puente = document.createElement('input');
      puente.setAttribute('aria-hidden', 'true');
      puente.tabIndex = -1;
      // 16 px para que el iPhone no haga zoom; fijo y transparente para que no mueva nada
      puente.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;border:0;padding:0;margin:0';
      document.body.appendChild(puente);
    }
    puente.focus({ preventScroll: true });
  } catch (err) { /* sin puente: el foco igual llega, solo que en el iPhone puede no salir el teclado */ }
  hasta = Date.now() + ESPERA;
  clearInterval(vuelta);
  let tocado = false;
  const alTocar = () => { tocado = true; };
  window.addEventListener('pointerdown', alTocar, { capture: true, once: true });
  vuelta = setInterval(() => {
    const ya = document.activeElement;
    // Si la persona toca otra cosa, se le deja en paz
    if (selector && !tocado) {
      const el = document.querySelector(selector);
      if (el && ya !== el && (!escribible(ya) || ya === puente || !ya.isConnected)) el.focus({ preventScroll: false });
    }
    if (escribible(document.activeElement)) quitar();
    if (Date.now() > hasta || tocado) {
      clearInterval(vuelta); vuelta = null; quitar();
      window.removeEventListener('pointerdown', alTocar, { capture: true });
    }
  }, 50);
}

// Cuando el foco llega a un campo de verdad, el invisible sobra
document.addEventListener('focusin', (ev) => { if (puente && escribible(ev.target)) quitar(); });

// Botones marcados con data-teclado: se prepara en el mismo toque (fase de captura, antes que la acción del botón)
document.addEventListener('click', (ev) => {
  const b = ev.target && ev.target.closest && ev.target.closest('[data-teclado]');
  if (b) prepararTeclado(b.getAttribute('data-teclado') || undefined);
}, true);
