// Dieta: plan del día (según el gym), comidas marcadas, planes editables, peso corporal y recálculo por peso.
// La pantalla está en src/react/pantallas/Dieta.tsx; aquí quedan la pestaña y el plan que se ven, las acciones y las piezas
// HTML que usan Hoy (tarjetaComidasHoy) y Clientes (editorComidas, macros, TIPOS_PLAN) hasta que esas se pasen a React
import { e, guardar, repintar, dia, tipoDieta, tipoDietaAuto } from '../estado.js';
import { iso } from '../fechas.js';
import { totalComida, valoresItem, objetivo, recalcular, pesos, tendencia, ajusteCarbos } from '../dieta.js';
import { esc, registrar, toast, miles } from '../ui.js';

let pestana = 'hoy', planVista = null;
const TIPOS = { inferior: '🦵 Entreno inferior', superior: '💪 Entreno superior', futbol: '⚽ Fútbol', recarga: '🍚 Recarga', descanso: '😌 Descanso' };
const r0 = (n) => Math.round(n || 0);
const d = () => e().dieta;
const alimento = (id) => d().alimentos.find((a) => a.id === id);
const unidad = (a) => (!a ? '' : a.por === 'g' ? 'g' : a.por === 'u' ? 'u' : '');
export const TIPOS_PLAN = TIPOS;
export const macros = (t) => '<span class="macros"><b>' + miles(t.kcal) + '</b> kcal · P ' + r0(t.p) + ' · G ' + r0(t.g) + ' · C ' + r0(t.c) + '</span>';

// Peso para los cálculos: el promedio de los últimos 7 registros; si no hay, el de partida
export function pesoActual() {
  const lista = pesos(e().dias), t = tendencia(lista);
  return t ? Math.round(t * 10) / 10 : d().config.pesoBase;
}

// Las comidas de un plan, editables (cantidades, agregar y quitar alimentos, ordenar). ruta: "dieta.planes.superior" o el
// plan de un cliente ("clientes.0.dieta.planes.superior"). Los alimentos son siempre los tuyos
export function editorComidas(ruta, plan) {
  const opciones = d().alimentos.map((a) => '<option value="' + esc(a.id) + '">' + esc(a.nombre) + '</option>').join('');
  return plan.comidas.map((c, i) => {
      const rc = ruta + '.comidas.' + i;
      return '<section class="tarjeta ed-item"><div class="ed-cab"><input class="titulo-comida" type="text" data-cambio="ed" data-ruta="' + rc + '.nombre" value="' + esc(c.nombre) + '" aria-label="Nombre de la comida">' +
        '<div class="ed-controles">' +
        '<button type="button" class="icono" data-accion="ed-mover" data-lista="' + ruta + '.comidas" data-i="' + i + '" data-n="-1" aria-label="Subir"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
        '<button type="button" class="icono" data-accion="ed-mover" data-lista="' + ruta + '.comidas" data-i="' + i + '" data-n="1" aria-label="Bajar"' + (i === plan.comidas.length - 1 ? ' disabled' : '') + '>↓</button>' +
        '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="' + ruta + '.comidas" data-i="' + i + '" data-nombre="' + esc(c.nombre) + '" aria-label="Borrar comida">🗑</button></div></div>' +
        '<div class="items">' + c.items.map((it, j) => {
          const a = alimento(it.alimento), v = valoresItem(it, d().alimentos);
          return '<div class="item"><span class="item-nombre">' + esc(a ? a.nombre : it.alimento) + '</span>' +
            (a && a.por !== 'libre' ? '<label class="item-cant"><input type="text" inputmode="decimal" autocomplete="off" min="0" step="' + (a.paso || (a.por === 'g' ? 5 : 1)) + '" data-cambio="ed" data-tipo="num" data-ruta="' + rc + '.items.' + j + '.cant" value="' + esc(it.cant) + '" aria-label="Cantidad"><span>' + unidad(a) + '</span></label>' : '<span class="item-cant nota-corta">libre</span>') +
            '<span class="item-kcal">' + miles(v.kcal) + ' kcal<small>P ' + r0(v.p) + ' · C ' + r0(v.c) + '</small></span>' +
            '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="' + rc + '.items" data-i="' + j + '" data-nombre="' + esc(a ? a.nombre : '') + '" aria-label="Quitar">✕</button></div>';
        }).join('') + '</div>' +
        '<div class="agregar-item"><select aria-label="Alimento para agregar">' + opciones + '</select><button type="button" class="boton secundario" data-accion="dieta-item" data-ruta="' + rc + '">＋ Agregar</button></div>' +
        '<div class="fila-resumen nota-corta"><span>Total</span>' + macros(totalComida(c, d().alimentos)) + '</div></section>';
    }).join('') +
    '<button type="button" class="boton secundario grande ancho" data-accion="ed-agregar" data-lista="' + ruta + '.comidas">＋ Comida</button>';
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
  'dieta-comer'({ i }) {
    const tipo = tipoDieta(), hoy = dia(), clave = tipo + ':' + i;
    hoy.comidas ??= {};
    if (hoy.comidas[clave]) { delete hoy.comidas[clave]; guardar(); return; }
    const c = d().planes[tipo].comidas[Number(i)], t = totalComida(c, d().alimentos);
    hoy.comidas[clave] = { ts: Date.now(), nombre: c.nombre, kcal: Math.round(t.kcal), p: Math.round(t.p), c: Math.round(t.c), g: Math.round(t.g) };
    guardar();
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
