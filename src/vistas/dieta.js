// Dieta: plan del día (según el gym), comidas marcadas, planes editables, peso corporal y recálculo por peso
import { e, guardar, repintar, dia, tipoDieta, tipoDietaAuto, comidasDelDia } from '../estado.js';
import { iso, hora, fechaCorta } from '../fechas.js';
import { totalPlan, totalComida, valoresItem, objetivo, recalcular, pesos, tendencia, kcalDeMacros } from '../dieta.js';
import { esc, barra, registrar, toast, miles, subirBajar } from '../ui.js';

let pestana = 'hoy', planVista = null;
const TIPOS = { inferior: '🦵 Entreno inferior', superior: '💪 Entreno superior', futbol: '⚽ Fútbol', descanso: '😌 Descanso' };
const GRUPOS = { proteina: 'Proteína', carbo: 'Carbohidrato', grasa: 'Grasa', verdura: 'Verdura', otro: 'Otro' };
const POR = { g: 'por 100 g', u: 'por unidad', libre: 'porción fija' };
const r0 = (n) => Math.round(n || 0);
const d = () => e().dieta;
const alimento = (id) => d().alimentos.find((a) => a.id === id);
const unidad = (a) => (!a ? '' : a.por === 'g' ? 'g' : a.por === 'u' ? 'u' : '');
const macros = (t) => '<span class="macros"><b>' + miles(t.kcal) + '</b> kcal · P ' + r0(t.p) + ' · G ' + r0(t.g) + ' · C ' + r0(t.c) + '</span>';

// Peso para los cálculos: el promedio de los últimos 7 registros; si no hay, el de partida
export function pesoActual() {
  const lista = pesos(e().dias), t = tendencia(lista);
  return t ? Math.round(t * 10) / 10 : d().config.pesoBase;
}

// ---------- Hoy ----------
export function tarjetaComidasHoy(compacta = false) {
  const tipo = tipoDieta(), plan = d().planes[tipo], hechas = (e().dias[iso()] || {}).comidas || {};
  const total = totalPlan(plan, d().alimentos), comido = comidasDelDia();
  return '<div class="fila-resumen"><span>' + TIPOS[tipo] + '</span><span><b>' + miles(comido.kcal) + '</b> / ' + miles(total.kcal) + ' kcal</span></div>' +
    barra(total.kcal ? comido.kcal / total.kcal : 0) +
    '<div class="macros-hoy">' + [['Proteína', 'p'], ['Carbos', 'c'], ['Grasa', 'g']].map(([t, k]) =>
      '<div><small>' + t + '</small><b>' + r0(comido[k]) + '</b> / ' + r0(total[k]) + ' g' + barra(total[k] ? comido[k] / total[k] : 0) + '</div>').join('') + '</div>' +
    '<div class="comidas' + (compacta ? ' compactas' : '') + '">' + plan.comidas.map((c, i) => {
      const t = totalComida(c, d().alimentos), marca = hechas[tipo + ':' + i];
      return '<div class="comida' + (marca ? ' hecha' : '') + '">' +
        '<button type="button" class="check" data-accion="dieta-comer" data-i="' + i + '" aria-pressed="' + !!marca + '" aria-label="' + esc(c.nombre) + '">' + (marca ? '✓' : '🍽') + '</button>' +
        '<div class="info"><div class="fila-resumen"><b>' + esc(c.nombre) + '</b><span class="nota-corta">' + miles(t.kcal) + ' kcal · P ' + r0(t.p) + '</span></div>' +
        (marca ? '<div class="nota-corta">Comida a las ' + hora(marca.ts) + '</div>' : '') +
        (compacta ? '' : '<div class="nota-corta">' + c.items.map((it) => {
          const a = alimento(it.alimento);
          return esc(a ? a.nombre : it.alimento) + (a && a.por !== 'libre' ? ' ' + esc(String(it.cant).replace('.', ',')) + ' ' + unidad(a) : '');
        }).join(' · ') + '</div>') + '</div></div>';
    }).join('') + '</div>';
}

function vistaHoyDieta() {
  const tipo = tipoDieta(), auto = tipoDietaAuto(), manual = (e().dias[iso()] || {}).dieta;
  return '<nav class="chips">' + Object.entries(TIPOS).map(([k, t]) => '<button type="button" class="chip' + (k === tipo ? ' activo' : '') + '" data-accion="dieta-tipo-hoy" data-tipo="' + k + '">' + t +
    (k === auto ? ' · hoy' : '') + '</button>').join('') + '</nav>' +
    (manual ? '<p class="nota-corta">Elegiste el plan a mano. <a href="#dieta" data-accion="dieta-tipo-hoy" data-tipo="' + auto + '">Volver al que toca hoy</a></p>'
      : '<p class="nota-corta">El plan sale del gym y del fútbol de hoy. Toca otro si hoy comes distinto.</p>') +
    '<section class="tarjeta">' + tarjetaComidasHoy() + '</section>';
}

// ---------- Planes ----------
function vistaPlanes() {
  if (!TIPOS[planVista]) planVista = tipoDieta();
  const plan = d().planes[planVista], ruta = 'dieta.planes.' + planVista, total = totalPlan(plan, d().alimentos);
  const peso = pesoActual(), obj = objetivo(d().config, planVista, peso);
  const opciones = d().alimentos.map((a) => '<option value="' + esc(a.id) + '">' + esc(a.nombre) + '</option>').join('');
  return '<nav class="chips">' + Object.entries(TIPOS).map(([k, t]) => '<button type="button" class="chip' + (k === planVista ? ' activo' : '') + '" data-accion="dieta-plan" data-tipo="' + k + '">' + t + '</button>').join('') + '</nav>' +
    '<section class="tarjeta"><div class="fila-resumen"><b>' + esc(plan.nombre) + '</b>' + macros(total) + '</div>' +
    '<p class="nota-corta">Con <b>' + String(peso).replace('.', ',') + ' kg</b> el objetivo es <b>≈ ' + miles(obj.kcal) + ' kcal</b>: proteína <b>' + obj.p + ' g</b>' +
    (obj.c != null ? ', carbos <b>' + obj.c + ' g</b>, grasa <b>' + obj.g + ' g</b>' : '') + '. <a href="#dieta/peso">Cambiar la fórmula</a></p>' +
    '<div class="botones-rapidos"><button type="button" class="boton primario" data-accion="dieta-recalcular" data-tipo="' + planVista + '">⚖️ Recalcular este plan</button>' +
    '<button type="button" class="boton secundario" data-accion="dieta-recalcular" data-tipo="todos">Recalcular todos</button>' +
    (d().anterior ? '<button type="button" class="boton secundario" data-accion="dieta-deshacer">↶ Deshacer recálculo</button>' : '') + '</div></section>' +
    plan.comidas.map((c, i) => {
      const rc = ruta + '.comidas.' + i;
      return '<section class="tarjeta ed-item"><div class="ed-cab"><input class="titulo-comida" type="text" data-cambio="ed" data-ruta="' + rc + '.nombre" value="' + esc(c.nombre) + '" aria-label="Nombre de la comida">' +
        '<div class="ed-controles">' +
        '<button type="button" class="icono" data-accion="ed-mover" data-lista="' + ruta + '.comidas" data-i="' + i + '" data-n="-1" aria-label="Subir"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
        '<button type="button" class="icono" data-accion="ed-mover" data-lista="' + ruta + '.comidas" data-i="' + i + '" data-n="1" aria-label="Bajar"' + (i === plan.comidas.length - 1 ? ' disabled' : '') + '>↓</button>' +
        '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="' + ruta + '.comidas" data-i="' + i + '" data-nombre="' + esc(c.nombre) + '" aria-label="Borrar comida">🗑</button></div></div>' +
        '<div class="items">' + c.items.map((it, j) => {
          const a = alimento(it.alimento), v = valoresItem(it, d().alimentos);
          return '<div class="item"><span class="item-nombre">' + esc(a ? a.nombre : it.alimento) + '</span>' +
            (a && a.por !== 'libre' ? '<label class="item-cant"><input type="number" inputmode="decimal" min="0" step="' + (a.paso || (a.por === 'g' ? 5 : 1)) + '" data-cambio="ed" data-tipo="num" data-ruta="' + rc + '.items.' + j + '.cant" value="' + esc(it.cant) + '" aria-label="Cantidad"><span>' + unidad(a) + '</span></label>' : '<span class="item-cant nota-corta">libre</span>') +
            '<span class="item-kcal">' + miles(v.kcal) + ' kcal<small>P ' + r0(v.p) + ' · C ' + r0(v.c) + '</small></span>' +
            '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="' + rc + '.items" data-i="' + j + '" data-nombre="' + esc(a ? a.nombre : '') + '" aria-label="Quitar">✕</button></div>';
        }).join('') + '</div>' +
        '<div class="agregar-item"><select aria-label="Alimento para agregar">' + opciones + '</select><button type="button" class="boton secundario" data-accion="dieta-item" data-ruta="' + rc + '">＋ Agregar</button></div>' +
        '<div class="fila-resumen nota-corta"><span>Total</span>' + macros(totalComida(c, d().alimentos)) + '</div></section>';
    }).join('') +
    '<button type="button" class="boton secundario grande ancho" data-accion="ed-agregar" data-lista="' + ruta + '.comidas">＋ Comida</button>';
}

// ---------- Peso ----------
function grafico(lista) {
  if (lista.length < 2) return '';
  const ult = lista.slice(-30), ps = ult.map((x) => x.peso), min = Math.min(...ps, d().config.meta), max = Math.max(...ps), W = 320, H = 90;
  const x = (i) => 6 + (i / (ult.length - 1)) * (W - 12), y = (p) => H - 8 - ((p - min) / (max - min || 1)) * (H - 16);
  return '<svg class="grafico-peso" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
    '<line x1="0" x2="' + W + '" y1="' + y(d().config.meta) + '" y2="' + y(d().config.meta) + '" class="linea-meta"/>' +
    '<polyline fill="none" stroke="currentColor" stroke-width="2.5" points="' + ult.map((p, i) => x(i) + ',' + y(p.peso)).join(' ') + '"/></svg>';
}

function vistaPeso() {
  const c = d().config, lista = pesos(e().dias), hoy = (e().dias[iso()] || {}).peso;
  const ultimo = lista.length ? lista[lista.length - 1].peso : null, prom = tendencia(lista), ref = prom || ultimo || c.pesoBase;
  const inicio = c.pesoInicio || c.pesoBase;
  const avance = inicio > c.meta ? (inicio - ref) / (inicio - c.meta) : 0, imc = ref / Math.pow(c.estatura / 100, 2);
  const f1 = (n) => (Math.round(n * 10) / 10).toLocaleString('es-CO');
  return '<section class="tarjeta"><label class="campo">Peso de hoy (kg)<input class="peso-grande" type="number" inputmode="decimal" step="0.1" min="0" data-cambio="dieta-peso" value="' + esc(hoy || '') + '" placeholder="' + esc(ultimo || c.pesoBase) + '"></label>' +
    '<p class="nota-corta">Mejor en ayunas, después del baño. El promedio de 7 días es el que se usa para recalcular.</p></section>' +
    '<section class="tarjeta"><div class="datos-peso">' +
    '<div><small>Promedio 7 días</small><b>' + (prom ? f1(prom) + ' kg' : '—') + '</b></div>' +
    '<div><small>Cambio desde ' + f1(inicio) + '</small><b>' + (prom ? (prom - inicio > 0 ? '+' : '') + f1(prom - inicio) + ' kg' : '—') + '</b></div>' +
    '<div><small>Falta para ' + f1(c.meta) + '</small><b>' + f1(Math.max(0, ref - c.meta)) + ' kg</b></div>' +
    '<div><small>IMC</small><b>' + f1(imc) + '</b></div></div>' + barra(avance) + grafico(lista) +
    (prom && Math.abs(prom - c.pesoBase) >= 1 ? '<p class="aviso">Tu promedio cambió ' + f1(Math.abs(prom - c.pesoBase)) + ' kg desde que se calcularon los planes (' + f1(c.pesoBase) + ' kg). ' +
      '<a href="#dieta" data-accion="dieta-ir-planes">Recalcular los planes con ' + f1(prom) + ' kg →</a></p>' : '') + '</section>' +
    (lista.length ? '<section class="tarjeta"><h2>Registros</h2><ul class="lista-pesos">' + lista.slice(-14).reverse().map((x) =>
      '<li><span>' + fechaCorta(x.fecha) + '</span><b>' + f1(x.peso) + ' kg</b></li>').join('') + '</ul></section>' : '') +
    '<section class="tarjeta"><h2>Datos y fórmula</h2><div class="dos">' +
    numero('Peso inicial (kg)', 'dieta.config.pesoInicio', inicio, '0.1') + numero('Meta (kg)', 'dieta.config.meta', c.meta, '0.1') +
    numero('Planes calculados con (kg)', 'dieta.config.pesoBase', c.pesoBase, '0.1') +
    numero('Estatura (cm)', 'dieta.config.estatura', c.estatura) + '</div>' +
    '<p class="nota-corta">Por cada kg de peso, cada plan apunta a (gramos por kg):</p><div class="tabla-scroll"><table class="historial formula"><thead><tr><th></th><th>Proteína</th><th>Carbos</th><th>Grasa</th><th>≈ kcal / kg</th></tr></thead><tbody>' +
    Object.entries(TIPOS).map(([k, t]) => {
      const kcalKg = kcalDeMacros(c.protKg[k] || 0, (c.carbKg || {})[k] || 0, (c.grasaKg || {})[k] || 0);
      return '<tr><th>' + t + '</th><td>' + numero('', 'dieta.config.protKg.' + k, c.protKg[k], '0.01') + '</td><td>' + numero('', 'dieta.config.carbKg.' + k, (c.carbKg || {})[k], '0.01') +
        '</td><td>' + numero('', 'dieta.config.grasaKg.' + k, (c.grasaKg || {})[k], '0.01') + '</td><td class="kcal-kg"><b>' + (Math.round(kcalKg * 10) / 10).toLocaleString('es-CO') + '</b><small>' + miles(kcalKg * ref) + ' kcal con ' + f1(ref) + ' kg</small></td></tr>';
    }).join('') +
    '</tbody></table></div><p class="nota-corta">Las kcal salen de los macros: 4 por gramo de proteína y de carbos, 9 por gramo de grasa. Al recalcular se ajusta primero la proteína, después la grasa (contando la de huevos y carne) y al final los carbos.</p><p class="nota-corta">Es una regla simple para ajustar cantidades, no una indicación médica: si el peso se estanca o bajas muy rápido, ajústala con tu nutricionista.</p></section>';
}
function numero(titulo, ruta, valor, paso = '1') {
  return '<label class="campo">' + titulo + '<input type="number" inputmode="decimal" min="0" step="' + paso + '" data-cambio="ed" data-tipo="num" data-ruta="' + ruta + '" value="' + esc(valor ?? '') + '"></label>';
}

// ---------- Alimentos ----------
function vistaAlimentos() {
  const lista = d().alimentos;
  return '<p class="nota-corta">Valores por 100 g, por unidad o por porción fija. Al recalcular, la proteína sigue al peso y los carbohidratos ajustan las calorías.</p>' +
    lista.map((a, i) => {
      const r = 'dieta.alimentos.' + i;
      const sel = (campo, opciones) => '<select data-cambio="ed" data-ruta="' + r + '.' + campo + '">' + Object.entries(opciones).map(([v, t]) => '<option value="' + v + '"' + (a[campo] === v ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>';
      return '<section class="tarjeta ed-item"><div class="ed-cab"><input class="titulo-comida" type="text" data-cambio="ed" data-ruta="' + r + '.nombre" value="' + esc(a.nombre) + '" aria-label="Nombre">' +
        '<span class="ed-controles">' + subirBajar('dieta.alimentos', i) + '<button type="button" class="icono borrar" data-accion="ed-borrar" data-lista="dieta.alimentos" data-i="' + i + '" data-nombre="' + esc(a.nombre) + '" aria-label="Borrar">🗑</button></span></div>' +
        '<div class="dos"><label class="campo">Medida' + sel('por', POR) + '</label><label class="campo">Grupo' + sel('grupo', GRUPOS) + '</label></div>' +
        '<div class="macros-ed">' + numero('kcal', r + '.kcal', a.kcal) + numero('Proteína', r + '.p', a.p, '0.1') + numero('Grasa', r + '.g', a.g, '0.1') + numero('Carbos', r + '.c', a.c, '0.1') + '</div></section>';
    }).join('') +
    '<button type="button" class="boton primario grande ancho" data-accion="ed-agregar" data-lista="dieta.alimentos">＋ Alimento</button>';
}

export function vistaDieta() {
  const tabs = { hoy: '🍽 Hoy', planes: '📋 Planes', peso: '⚖️ Peso', alimentos: '🥚 Alimentos' };
  return '<h1>Dieta</h1><nav class="chips pestanas">' + Object.entries(tabs).map(([k, t]) =>
    '<button type="button" class="chip' + (k === pestana ? ' activo' : '') + '" data-accion="dieta-pestana" data-p="' + k + '">' + t + '</button>').join('') + '</nav>' +
    (pestana === 'planes' ? vistaPlanes() : pestana === 'peso' ? vistaPeso() : pestana === 'alimentos' ? vistaAlimentos() : vistaHoyDieta());
}

function resumenCambio(tipo, r) {
  return TIPOS[tipo] + ': ' + miles(r.antes.kcal) + ' → ' + miles(r.despues.kcal) + ' kcal\n   P ' + r0(r.antes.p) + ' → ' + r0(r.despues.p) +
    ' · C ' + r0(r.antes.c) + ' → ' + r0(r.despues.c) + ' · G ' + r0(r.antes.g) + ' → ' + r0(r.despues.g) + ' g';
}

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
  'dieta-recalcular'({ tipo }) {
    const peso = pesoActual(), tipos = tipo === 'todos' ? Object.keys(TIPOS) : [tipo];
    const resultados = tipos.map((t) => [t, recalcular(d().planes[t], d().alimentos, objetivo(d().config, t, peso))]);
    if (!confirm('Recalcular con ' + String(peso).replace('.', ',') + ' kg:\n\n' + resultados.map(([t, r]) => resumenCambio(t, r)).join('\n') +
      '\n\nSe ajustan las cantidades de proteína, grasa y carbohidratos. Puedes deshacerlo.')) return;
    d().anterior = JSON.parse(JSON.stringify(d().planes));
    for (const [t, r] of resultados) d().planes[t] = r.plan;
    if (tipos.length > 1) d().config.pesoBase = peso;
    guardar();
    toast('Planes recalculados con ' + String(peso).replace('.', ',') + ' kg');
  },
  'dieta-deshacer'() {
    if (!d().anterior) return;
    d().planes = d().anterior;
    d().anterior = null;
    guardar();
    toast('Se volvió a los planes anteriores');
  },
});
