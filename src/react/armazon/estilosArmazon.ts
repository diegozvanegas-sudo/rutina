// Estilos del armazón de la app y de lo que todavía es HTML en texto: lo que antes estaba en estilos.css y de verdad se
// usa (medido recorriendo toda la app en computador y celular). La estructura (la vista, la barra lateral y la de arriba en el
// celular, el velo del menú), lo general (letra, títulos, enlaces, campos), el cronómetro flotante, el reproductor, el aviso
// (toast), lo que pintan los HTML en texto (tablas del historial, la vista del PDF de Ventas, los puntos del plan) y la
// impresión del PDF del plan. Los colores salen del tema; las variables --x se dejan para el HTML en texto que las lea.
import { tokens as t } from '../tema';

export const ARMAZON = `:root {
  --bg: ${t.bg};
  --surface-2: ${t.surface2};
  --surface: ${t.surface};
  --line: ${t.line};
  --ink: ${t.ink};
  --muted: ${t.muted};
  --brand-ink: ${t.brandInk};
  --brand-soft: ${t.brandSoft};
  --brand: ${t.brand};
  --amarillo: ${t.amarillo};
  --verde: ${t.verde};
  --azul: ${t.azul};
  --rojo: ${t.rojo};
  --radio: ${t.radio}px;
  color-scheme: dark;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; background: transparent; }
body { visibility: visible; margin: 0; background: ${t.bg}; color: ${t.ink}; font: 16px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }
h1 { font-size: 26px; margin: 4px 0 12px; }
h2 { font-size: 17px; margin: 0 0 10px; }
h3 { font-size: 17px; margin: 0; }
a { color: ${t.brand}; }
small { color: ${t.muted}; }
.nota-corta { color: ${t.muted}; font-size: 14px; margin: 6px 0; }
.app { min-height: 100dvh; }
#vista { padding: 12px 16px calc(100px + env(safe-area-inset-bottom)); max-width: 760px; margin: 0 auto; }
.top-movil { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; justify-content: space-between; padding: calc(8px + env(safe-area-inset-top)) 16px 8px; background: ${t.barraArriba}; backdrop-filter: blur(8px); border-bottom: 1px solid ${t.line}; }
.marca { display: flex; align-items: center; gap: 8px; font-size: 18px; }
.logo { width: 34px; height: 34px; border-radius: 10px; background: ${t.brandSoft}; display: grid; place-items: center; font-size: 18px; }
.icono { min-width: 44px; min-height: 44px; display: grid; place-items: center; font-size: 20px; text-decoration: none; background: none; border: 0; color: ${t.ink}; border-radius: 10px; cursor: pointer; }
.menu { font-size: 26px; width: 52px; height: 52px; background: ${t.surface2}; }
#lateral { position: fixed; top: 0; right: 0; bottom: 0; z-index: 45; width: min(300px, 86vw); display: flex; flex-direction: column; gap: 18px; overflow-y: auto; padding: calc(20px + env(safe-area-inset-top)) 16px calc(20px + env(safe-area-inset-bottom)); background: ${t.surface}; border-left: 1px solid ${t.line}; transform: translateX(105%); transition: transform .22s ease; visibility: hidden; }
.menu-abierto #lateral { transform: none; visibility: visible; box-shadow: -12px 0 40px ${t.velo}; }
.velo { position: fixed; inset: 0; z-index: 44; background: ${t.velo}; }
.velo[hidden] { display: none; }
.sin-sesion #lateral, .sin-sesion .top-movil .menu, .sin-sesion #flotante, .sin-sesion #reproductor { display: none !important; }
@media (min-width: 900px) {
  .sin-sesion .app { display: block; }
}
.sin-sesion #vista { max-width: none; }
@media (min-width: 900px) {
  .app { display: grid; grid-template-columns: minmax(0, 1fr) var(--ancho-barra, 260px); }
  .barra-compacta { --ancho-barra: 76px; }
  .barra-izquierda .app { grid-template-columns: var(--ancho-barra, 260px) minmax(0, 1fr); }
  .barra-izquierda #lateral { order: -1; border-left: 0; border-right: 1px solid ${t.line}; }
  .barra-compacta .marca { justify-content: center; }
  .barra-compacta #lateral { padding-inline: 8px; align-items: center; }
  .barra-compacta .ocultable, .barra-compacta .marca b, .barra-compacta .marca .logo, .barra-compacta .barra-organizar, .barra-compacta .resumen-lateral, .barra-compacta .asa-barra { display: none; }
  .top-movil, .velo { display: none; }
  #vista { padding: 24px 32px 120px; max-width: 1100px; width: 100%; }
  #lateral { position: sticky; right: auto; bottom: auto; z-index: auto; width: auto; height: 100dvh; padding: 20px 16px; transform: none; visibility: visible; transition: none; box-shadow: none; }
}
@media (min-width: 1400px) {
  #vista[data-vista="hoy"] { max-width: 1640px; }
}
@media (min-width: 2000px) {
  #vista[data-vista="hoy"] { max-width: 2200px; }
}
input, select, textarea { font: inherit; color: ${t.ink}; background: ${t.bg}; border: 1px solid ${t.line}; border-radius: 10px; padding: 10px 12px; min-height: 48px; width: 100%; }
input:focus, select:focus, textarea:focus { outline: 2px solid ${t.brand}; outline-offset: 1px; }
textarea { resize: vertical; min-height: 60px; }
details summary { cursor: pointer; color: ${t.muted}; padding: 6px 0; }
@media (min-width: 900px) {
  #vista[data-vista="manana"] { max-width: 1640px; }
  #vista[data-vista="recordatorios"] { max-width: 1640px; }
}
.tabla-scroll { overflow-x: auto; }
.historial { width: 100%; border-collapse: collapse; font-size: 14px; }
.historial th, .historial td { padding: 6px 4px; text-align: center; }
.punto { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; font-size: 13px; font-weight: 800; color: ${t.brandInk}; background: color-mix(in srgb, ${t.verde} calc(var(--p) * 100%), ${t.surface2}); }
.musculo { color: ${t.muted}; font-size: 13px; white-space: nowrap; }
.esquema { font-weight: 700; }
.vt-papel { margin-top: 12px; padding: clamp(16px, 4vw, 40px); border-radius: 10px; background: ${t.papelFondo}; color: ${t.papelTinta}; font: 15px/1.5 system-ui, sans-serif; max-height: 80vh; overflow: auto; }
.vt-papel h1 { font-size: 26px; margin: 0; color: ${t.papelTinta}; }
.vt-papel h2 { font-size: 19px; margin: 22px 0 8px; color: ${t.papelTitulo}; }
.vt-papel h3 { font-size: 16px; margin: 14px 0 6px; color: ${t.papelTinta}; }
.vt-papel table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 13px; display: block; overflow-x: auto; }
.vt-papel th, .vt-papel td { border-bottom: 1px solid ${t.papelLinea}; padding: 5px 6px; text-align: left; vertical-align: top; }
.vt-papel th { background: ${t.papelCabeza}; }
.vt-papel small { color: ${t.papelGris}; }
.flotante { position: fixed; left: 12px; right: 12px; bottom: calc(12px + env(safe-area-inset-bottom)); z-index: 40; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 16px; background: ${t.flotanteFondo}; border: 1px solid ${t.brand}; box-shadow: 0 8px 30px ${t.velo}; overflow: hidden; }
.flotante[hidden] { display: none; }
.reproductor { position: fixed; inset: 0; z-index: 50; background: ${t.bg}; display: flex; flex-direction: column; padding: calc(10px + env(safe-area-inset-top)) 16px calc(16px + env(safe-area-inset-bottom)); }
.reproductor[hidden] { display: none; }
.toast { position: fixed; left: 50%; top: calc(16px + env(safe-area-inset-top)); transform: translateX(-50%); z-index: 60; background: ${t.ink}; color: ${t.bg}; padding: 12px 18px; border-radius: 12px; font-weight: 700; max-width: calc(100% - 32px); box-shadow: 0 8px 24px ${t.sombraAviso}; }
.toast[hidden] { display: none; }
@media (min-width: 900px) {
  .flotante { left: auto; right: calc(var(--ancho-barra, 260px) + 24px); width: 380px; bottom: 24px; }
  .barra-izquierda .flotante { right: 24px; }
}
#toast button { margin-left: 10px; min-height: 36px; padding: 0 10px; background: none; border: 1px solid currentColor; border-radius: 8px; color: inherit; font: inherit; font-weight: 800; cursor: pointer; pointer-events: auto; }
details > summary { min-height: 44px; padding-top: 10px; padding-bottom: 10px; box-sizing: border-box; }
#toast { width: max-content; max-width: min(92vw, 520px); }
#imprimir { display: none; }
@media print {
  body.imprimiendo > *:not(#imprimir) { display: none !important; }
`;
