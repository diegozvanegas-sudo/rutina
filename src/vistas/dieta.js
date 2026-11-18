// Dieta: plan del día (según el gym), comidas marcadas, planes editables, peso corporal y recálculo por peso.
// La pantalla está en src/react/pantallas/Dieta.tsx; aquí quedan la pestaña y el plan que se ven, las acciones y las piezas
// que usan Clientes y Hoy (TIPOS_PLAN, pesoActual)
import { e, guardar, repintar, dia, tipoDieta, tipoDietaAuto } from '../estado.js';
import { iso } from '../fechas.js';
import { totalComida, objetivo, recalcular, pesos, tendencia, ajusteCarbos } from '../dieta.js';
import { registrar, toast, miles, copiarTexto } from '../ui.js';
import { resumenDieta, textoDieta, compartirDieta } from '../imagen-dieta.js';

let pestana = 'hoy', planVista = null;
const TIPOS = { inferior: '🦵 Entreno inferior', superior: '💪 Entreno superior', futbol: '⚽ Fútbol', recarga: '🍚 Recarga', descanso: '😌 Descanso' };
const r0 = (n) => Math.round(n || 0);
const d = () => e().dieta;
const alimento = (id) => d().alimentos.find((a) => a.id === id);
export const TIPOS_PLAN = TIPOS;
// Una comida marcada guarda sus calorías y macros del momento (si después cambia el plan, el día no cambia)
function marcaComida(c) {
  const t = totalComida(c, d().alimentos);
  return { ts: Date.now(), nombre: c.nombre, kcal: Math.round(t.kcal), p: Math.round(t.p), c: Math.round(t.c), g: Math.round(t.g) };
}
// El plan que toca hoy, listo para el texto y la imagen de WhatsApp (src/imagen-dieta.js)
function resumenDeHoy() {
  const tipo = tipoDieta(), hoy = iso();
  return resumenDieta({ plan: d().planes[tipo], alimentos: d().alimentos, hechas: (e().dias[hoy] || {}).comidas || {}, tipo, titulo: TIPOS[tipo], fecha: hoy });
}

// Peso para los cálculos: el promedio de los últimos 7 registros; si no hay, el de partida
export function pesoActual() {
  const lista = pesos(e().dias), t = tendencia(lista);
  return t ? Math.round(t * 10) / 10 : d().config.pesoBase;
}

function resumenCambio(tipo, r) {
  return TIPOS[tipo] + ': ' + miles(r.antes.kcal) + ' → ' + miles(r.despues.kcal) + ' kcal\n   P ' + r0(r.antes.p) + ' → ' + r0(r.despues.p) +
    ' · C ' + r0(r.antes.c) + ' → ' + r0(r.despues.c) + ' · G ' + r0(r.antes.g) + ' → ' + r0(r.despues.g) + ' g';
}

// Lo que necesita la pantalla de React: la pestaña y el plan que se están viendo
export const piezasDieta = {
  ver: () => ({ pestana, planVista }),
  ponerPestana: (p) => { pestana = p; },
  ponerPlan: (t) => { planVista = t; },
};

registrar({
  'abrir-dieta'({ p }) { pestana = p; },
  'dieta-pestana'({ p }) { pestana = p; repintar(); },
  'dieta-plan'({ tipo }) { planVista = tipo; repintar(); },
  'dieta-ir-planes'(ds, el, ev) { ev.preventDefault(); pestana = 'planes'; repintar(); window.scrollTo(0, 0); },
  'dieta-tipo-hoy'({ tipo }, el, ev) {
    if (ev) ev.preventDefault();
    const hoy = dia();
    if (tipo === tipoDietaAuto()) delete hoy.dieta; else hoy.dieta = tipo;
    guardar();
  },
  // 📲 El plan de hoy para WhatsApp: como texto o como imagen
  'dieta-copiar'() { copiarTexto(textoDieta(resumenDeHoy()), 'Plan de comida copiado: pégalo en WhatsApp'); },
  async 'dieta-imagen'() {
    try {
      const r = await compartirDieta(resumenDeHoy(), iso());
      if (r === 'descargada') toast('🖼️ Imagen descargada');
    } catch (err) { toast('No se pudo crear la imagen'); }
  },
  'dieta-comer'({ i }) {
    const tipo = tipoDieta(), hoy = dia(), clave = tipo + ':' + i;
    hoy.comidas ??= {};
    if (hoy.comidas[clave]) { delete hoy.comidas[clave]; guardar(); return; }
    hoy.comidas[clave] = marcaComida(d().planes[tipo].comidas[Number(i)]);
    guardar();
  },
  // ✓ Comí como el plan: marca de un toque las comidas que faltan del plan de hoy (las ya marcadas no se tocan)
  'dieta-comer-todo'() {
    const tipo = tipoDieta(), hoy = dia(), comidas = (hoy.comidas ??= {});
    let n = 0;
    d().planes[tipo].comidas.forEach((c, i) => { if (!comidas[tipo + ':' + i]) { comidas[tipo + ':' + i] = marcaComida(c); n++; } });
    guardar();
    toast(n ? '✓ ' + n + (n === 1 ? ' comida marcada' : ' comidas marcadas') + ' como el plan' : 'Ya tenías todas marcadas');
  },
  'dieta-item'({ ruta }, el) {
    const id = el.parentNode.querySelector('select').value, a = alimento(id);
    const comida = ruta.split('.').reduce((o, k) => o[k], e());
    comida.items.push({ alimento: id, cant: a.por === 'g' ? 100 : 1 });
    guardar();
  },
  'dieta-peso'(ds, el) {
    const n = Number(String(el.value).replace(',', '.'));
    const hoy = dia();
    if (n > 0) hoy.peso = Math.round(n * 10) / 10; else delete hoy.peso;
    // El primer peso de una cuenta nueva es su peso de inicio, y los planes de comida (que eran de ejemplo) se calculan con él
    const c = d().config;
    if (n > 0 && !c.pesoInicio) {
      c.pesoInicio = hoy.peso;
      for (const t of Object.keys(TIPOS)) if (d().planes[t]) d().planes[t] = recalcular(d().planes[t], d().alimentos, objetivo(c, t, hoy.peso)).plan;
      c.pesoBase = hoy.peso;
      toast('🥗 Tus planes de comida quedaron calculados con ' + String(hoy.peso).replace('.', ',') + ' kg');
    }
    guardar();
  },
  'dieta-senal'({ k, n }) {
    const hoy = dia();
    if (hoy[k] === Number(n)) delete hoy[k]; else hoy[k] = Number(n);
    guardar();
  },
  'dieta-medida'({ k }, el) {
    const n = Number(String(el.value).replace(',', '.')), hoy = dia();
    hoy.medidas ??= {};
    if (n > 0) hoy.medidas[k] = Math.round(n * 10) / 10; else delete hoy.medidas[k];
    if (!Object.keys(hoy.medidas).length) delete hoy.medidas;
    guardar();
  },
  'dieta-aplicar'({ g }) {
    const gramos = Number(g), { carbKg, resultados } = ajusteCarbos(d(), gramos);
    if (!confirm((gramos > 0 ? 'Sumar ' : 'Quitar ') + Math.abs(gramos) + ' g de carbos al día:\n\n' + resultados.map(([t, r]) => resumenCambio(t, r)).join('\n') + '\n\nPuedes deshacerlo en Planes.')) return;
    d().anterior = JSON.parse(JSON.stringify(d().planes));
    d().carbAnterior = d().config.carbKg;
    d().config.carbKg = carbKg;
    for (const [t, r] of resultados) d().planes[t] = r.plan;
    d().ultimoAjuste = { fecha: iso(), gramos };
    guardar();
    toast('Planes ajustados');
  },
  'dieta-recalcular'({ tipo }) {
    const peso = pesoActual(), tipos = tipo === 'todos' ? Object.keys(TIPOS) : [tipo];
    const resultados = tipos.map((t) => [t, recalcular(d().planes[t], d().alimentos, objetivo(d().config, t, peso))]);
    if (!confirm('Recalcular con ' + String(peso).replace('.', ',') + ' kg:\n\n' + resultados.map(([t, r]) => resumenCambio(t, r)).join('\n') +
      '\n\nSe ajustan las cantidades de proteína, grasa y carbohidratos. Puedes deshacerlo.')) return;
    d().anterior = JSON.parse(JSON.stringify(d().planes));
    delete d().carbAnterior;
    for (const [t, r] of resultados) d().planes[t] = r.plan;
    if (tipos.length > 1) d().config.pesoBase = peso;
    guardar();
    toast('Planes recalculados con ' + String(peso).replace('.', ',') + ' kg');
  },
  'dieta-deshacer'() {
    if (!d().anterior) return;
    d().planes = d().anterior;
    d().anterior = null;
    // Si lo último fue un ajuste de carbos, también se deshace y se puede volver a sugerir
    if (d().carbAnterior) { d().config.carbKg = d().carbAnterior; delete d().carbAnterior; delete d().ultimoAjuste; }
    guardar();
    toast('Se volvió a los planes anteriores');
  },
});
