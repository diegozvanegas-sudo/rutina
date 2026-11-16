// "Primera hora": checklist en orden; cada toque guarda la hora
import { e, guardar, dia, alternarCrono, segundosCrono, ponerTextoHabito } from '../estado.js';
import { iso, hora, reloj } from '../fechas.js';
import { registrar, toast } from '../ui.js';
import { iniciar } from '../temporizador.js';
import { abrirSesion } from './sesiones.js';
import { IDEAS_HABITOS } from '../datos_iniciales.js';

// Texto de la espera entre la pastilla y el desayuno (lo actualiza el reloj de main.js)
export function textoEspera(desde) {
  const { minimo, ideal } = e().config.espera, min = (Date.now() - desde) / 60000;
  if (min < minimo) return { clase: 'esperar', texto: 'Espera ' + reloj((minimo - min) * 60) + ' para desayunar (mín. ' + minimo + ' min)' };
  if (min < ideal) return { clase: 'casi', texto: 'Ya puedes desayunar · ideal en ' + reloj((ideal - min) * 60) };
  return { clase: 'listo', texto: 'Listo para desayunar ✓' };
}

let tipoNuevo = 'check';
// Lo que necesita la pantalla de React (src/react/pantallas/Manana.tsx): el tipo elegido para el hábito nuevo
export const piezasManana = { tipoNuevo: () => tipoNuevo };

// Si el cronómetro de caminar llega a la hora, se marca solo
export function revisarCronos(fecha = iso()) {
  const d = e().dias[fecha];
  if (!d) return;
  for (const h of e().habitos) {
    if (h.tipo === 'cronometro' && !d.habitos[h.id] && segundosCrono(d.crono && d.crono[h.id]) >= h.segundos) {
      alternarCrono(fecha, h.id);
      d.habitos[h.id] = { ts: Date.now() };
      guardar();
    }
  }
}

registrar({
  'marcar-minimo'({ id }) { dia().habitos[id] = { ts: Date.now(), minimo: true }; guardar(); },
  marcar({ id }) {
    const h = dia().habitos;
    if (h[id]) { if (!confirm('¿Desmarcar este hábito?')) return; delete h[id]; } else h[id] = { ts: Date.now() };
    guardar();
  },
  cuenta({ id }) {
    const h = e().habitos.find((x) => x.id === id);
    iniciar('habito', h.segundos, h.nombre, { habito: id, fecha: iso() });
  },
  crono({ id }) { alternarCrono(iso(), id); guardar(); },
  'habito-texto'({ id }, el) {
    const h = e().habitos.find((x) => x.id === id);
    if (h) { ponerTextoHabito(dia(), h, el.value.trim()); guardar(false); }
  },
  prioridades({ f }, el) { dia(f).prioridades = el.value.trim(); guardar(false); },
  'manana-tipo'(ds, el) { tipoNuevo = el.value; },
  'manana-nuevo'(ds, el) {
    const nombre = el.value.trim();
    if (!nombre) return;
    // Si es una de las ideas, trae su tipo, detalle y tiempo
    const idea = IDEAS_HABITOS.find((x) => x.nombre.toLowerCase() === nombre.toLowerCase());
    const h = { id: 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ...(idea ? JSON.parse(JSON.stringify(idea)) : { nombre, tipo: tipoNuevo }) };
    if (h.tipo === 'cuenta') h.segundos ??= 60;
    if (h.tipo === 'cronometro') h.segundos ??= 1800;
    if (h.tipo === 'texto') h.detalle ??= 'Escribe aquí (opcional)';
    e().habitos.push(h);
    el.value = '';
    guardar();
    toast('Agregado: ' + h.nombre + (!idea && (h.tipo === 'cuenta' || h.tipo === 'cronometro') ? '. El tiempo se cambia en Editar.' : ''));
  },
  sesion({ sesion, habito }) { abrirSesion(sesion, habito ? () => { dia().habitos[habito] ??= { ts: Date.now() }; guardar(); } : null); },
});
