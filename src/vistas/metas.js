// Metas del día: agua, pasos, calorías y lectura, con historial de 7 y 30 días
import { guardar, dia, alternarCrono } from '../estado.js';
import { iso } from '../fechas.js';
import { registrar } from '../ui.js';





registrar({
  agua({ ml }) { const m = dia().metas; m.agua = Math.max(0, (m.agua || 0) + Number(ml)); guardar(); },
  meta({ k }, el) { dia().metas[k] = Math.max(0, Number(el.value) || 0); guardar(); },
  comida(ds, el) {
    const n = Number(el.value) || 0;
    if (!n) return;
    const m = dia().metas;
    m.calorias = (m.calorias || 0) + n;
    guardar();
  },
  'crono-lectura'() { alternarCrono(iso(), 'lectura'); guardar(); },
  'meta-pantalla'(ds, el) { const m = dia().metas; if (el.value === '') delete m.pantalla; else m.pantalla = Math.max(0, Math.round(Number(el.value) || 0)); guardar(); },
  'lectura-mas'() { const m = dia().metas; m.lectura = (m.lectura || 0) + 5; guardar(); },
});
