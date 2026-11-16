// 📆 Ciclo del cliente: lo que se agrega a la pestaña Ciclo (la lógica está en ../ciclo.js)
// - elegir el tipo de ciclo (fuerza + músculo, hipertrofia, fuerza, principiante, poco tiempo)
// - gráfico del ciclo en el tiempo: series por semana (barras), fatiga y rendimiento (líneas), la supercompensación en la
//   descarga, la semana de hoy y la energía de sus check-ins
// - tiempo disponible contra lo que dura cada día · series por músculo contra su rango · señales para adelantar la descarga
// Los textos van dentro de HTML (no dentro del SVG) para que se lean igual en el celular y en el computador.
import { e, guardar, repintar } from '../estado.js';
import { registrar, toast } from '../ui.js';
import { TIPOS_CICLO, fasesDeTipo } from '../ciclo.js';

let tipo = 'mixto';
export const tipoElegido = () => tipo;

const clienteK = (k) => (e().clientes || [])[Number(k)];
registrar({
  'cc-tipo'({ t }) { if (TIPOS_CICLO[t]) tipo = t; repintar(); },
  'cc-cambiar-tipo'({ t, k }) {
    const c = clienteK(k);
    if (!c || !c.ciclo || !TIPOS_CICLO[t]) return;
    const antes = c.ciclo.fases;
    c.ciclo.fases = fasesDeTipo(t); guardar();
    toast('📆 Ciclo ' + TIPOS_CICLO[t].nombre, () => { c.ciclo.fases = antes; guardar(); });
  },
  'cc-tiempo'({ campo, k }, el) {
    const c = clienteK(k), n = Math.round(Number(String(el.value).replace(',', '.')));
    if (!c) return;
    const [min, max] = campo === 'dias' ? [1, 7] : [15, 240];
    if (!(n >= min && n <= max)) { toast(campo === 'dias' ? 'Entre 1 y 7 días' : 'Entre 15 y 240 minutos'); guardar(); return; }
    (c.tiempo ??= {})[campo] = n; guardar();
  },
});
