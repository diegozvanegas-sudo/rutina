// 🗺️ Lugares: los lugares que visité y los que quiero visitar, en mapas SVG propios (sin internet): Mundo › Colombia o Brasil › Antioquia.
import { e, guardar, repintar } from '../estado.js';
import { iso } from '../fechas.js';
import { registrar, toast } from '../ui.js';
import { leerMonto } from '../finanzas.js';
import { nuevoMovimiento } from './finanzas.js';
import { ve } from '../permisos.js';
import { MAPAS, MAPA_INICIAL, cargarMapa } from '../mapas/index.js';
import { proyectar, desproyectar, piezaEn, cajaDe, piezaDelLugar, agregarVisita, sorprender, mapaHijo, migas, enlaceSeguro, quitarVisita, marcarPieza, desmarcarPieza } from '../lugares.js';

const lista = () => e().lugares.lista;
const buscar = (id) => lista().find((l) => l.id === id);
const nuevoId = () => 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

let mapa = null, errorMapa = false, animar = '', caja = null;
let piezaSel = null, abierto = null, borrador = null, ubicando = false, plan = null;
const filtro = { estado: '', pais: '', grupo: '', tipo: '', texto: '' };

function abrirMapa(id, sentido = 'mapa-entra') {
  errorMapa = false;
  return cargarMapa(id).then((m) => { mapa = m; caja = entero(); animar = sentido; repintar(); }).catch(() => { errorMapa = true; repintar(); });
}
function cambiarMapa(id, sentido) {
  piezaSel = null; abierto = null; borrador = null; ubicando = false; filtro.grupo = '';
  const tip = document.getElementById('tip');
  if (tip) tip.hidden = true;
  return abrirMapa(id, sentido);
}
const enElMapa = (l) => piezaDelLugar(l, mapa.id, MAPAS) != null;
const una = () => MAPAS[mapa.id].una;
const entero = () => ({ x: 0, y: 0, w: mapa.ancho, h: mapa.alto });
const piezaDe = (l) => (mapa ? mapa.piezas.find((p) => p.id === piezaDelLugar(l, mapa.id, MAPAS)) : null);
const grupoDe = (l) => { const p = piezaDe(l); return p ? p.grupo : ''; };
const dondeEs = (l) => { const p = piezaDe(l); return [l.municipio || (p && p.nombre), p && p.grupo].filter(Boolean).join(' · ') || [l.region, l.pais].filter(Boolean).join(' · '); };
const plural = (n, s, p = s + 's') => n + ' ' + (n === 1 ? s : p);
const horas = (n) => '≈ ' + String(n).replace('.', ',') + ' h desde Medellín';
const estrellas = (n) => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '');

function leerForm() {
  const caja = document.querySelector('[data-form-lugar]'), val = (n) => caja.querySelector('[name="' + n + '"]').value.trim();
  return { ...borrador, nombre: val('nombre'), emoji: val('emoji'), tipo: val('tipo'), estado: val('estado'), pieza: val('pieza'), prioridad: Number(val('prioridad')), epoca: val('epoca'), horas: Number(val('horas').replace(',', '.')) || 0, presupuesto: leerMonto(val('presupuesto')) || 0 };
}

// Lo que necesita la pantalla de React (src/react/pantallas/Lugares.tsx): el mapa abierto, lo seleccionado y las reglas de texto.
// animar ('mapa-entra' o 'mapa-sale') queda guardado: React lo usa al montar el mapa nuevo
let cargandoMapa = false;
export const piezasLugares = {
  ver: () => ({ mapa, errorMapa, animar, caja, piezaSel, abierto, borrador, ubicando, plan, filtro }),
  // Abre el mapa inicial la primera vez (antes lo hacía la pantalla al pintarse)
  pedir: () => { if (!mapa && !errorMapa && !cargandoMapa) { cargandoMapa = true; abrirMapa(MAPA_INICIAL).finally(() => { cargandoMapa = false; }); } },
  lista, buscar, enElMapa, una, piezaDe, grupoDe, dondeEs, plural, horas, estrellas,
};

// ---------- Zoom y arrastre ----------
// El mapa lo pinta React (data-mapa-svg); el arrastre y el zoom mueven su viewBox aquí sin repintar
const svg = () => document.querySelector('[data-mapa-svg]');
function aplicarCaja() {
  const s = svg();
  if (!s) return;
  s.setAttribute('viewBox', [caja.x, caja.y, caja.w, caja.h].join(' '));
  s.style.setProperty('--z', 1000 / caja.w);
  s.toggleAttribute('data-zoom', caja.w < mapa.ancho - 1);
}
function limitar(c) {
  const w = Math.max(mapa.ancho / 32, Math.min(mapa.ancho, c.w)), h = w * mapa.alto / mapa.ancho;
  return { x: Math.max(0, Math.min(mapa.ancho - w, c.x)), y: Math.max(0, Math.min(mapa.alto - h, c.y)), w, h };
}
function zoomEn(f, x, y) {
  const w = caja.w / f, r = limitar({ x: x - (x - caja.x) / f, y: y - (y - caja.y) / f, w });
  caja = r;
  aplicarCaja();
}
let animacion = null;
function irA(destino) {
  cancelAnimationFrame(animacion);
  const d = limitar(ajustar(destino)), o = { ...caja }, t0 = performance.now(), quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const paso = (t) => {
    const a = quieto ? 1 : Math.min(1, (t - t0) / 400), s = a * (2 - a);
    caja = { x: o.x + (d.x - o.x) * s, y: o.y + (d.y - o.y) * s, w: o.w + (d.w - o.w) * s, h: o.h + (d.h - o.h) * s };
    aplicarCaja();
    if (a < 1) animacion = requestAnimationFrame(paso);
  };
  animacion = requestAnimationFrame(paso);
}
// La caja conserva la forma del mapa y deja adentro todo lo pedido
function ajustar(c) {
  const r = mapa.alto / mapa.ancho, w = Math.max(c.w, c.h / r), h = w * r;
  return { x: c.x + c.w / 2 - w / 2, y: c.y + c.h / 2 - h / 2, w, h };
}
function aMapa(s, cx, cy) {
  const m = s.getScreenCTM();
  if (!m) return [0, 0];
  const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
  return [p.x, p.y];
}

const dedos = new Map();
let gesto = null;
function tocar(objetivo, x, y) {
  if (ubicando) {
    const [lat, lon] = desproyectar(mapa, x, y), p = piezaEn(mapa, x, y);
    if (!p) { toast('Ese punto queda fuera de ' + mapa.nombre); return; }
    const adentro = mapaHijo(MAPAS, mapa.id, p.id);
    if (adentro) { toast('Entra primero al mapa de ' + adentro.nombre + ' para ubicarlo'); return; }
    borrador = { ...borrador, lat, lon, pieza: p.id };
    ubicando = false;
    repintar();
    return;
  }
  const pt = objetivo.closest && objetivo.closest('[data-lugar]'), pz = objetivo.closest && objetivo.closest('[data-pieza]');
  if (pt) { abierto = pt.dataset.lugar; piezaSel = null; repintar(); return; }
  if (pz) {
    const hijo = mapaHijo(MAPAS, mapa.id, pz.dataset.pieza);
    if (hijo) { cambiarMapa(hijo.id); return; }
    piezaSel = pz.dataset.pieza === piezaSel ? null : pz.dataset.pieza; abierto = null; repintar();
  }
}
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', (ev) => {
    const s = ev.target.closest && ev.target.closest('[data-mapa-svg]');
    if (!s) return;
    dedos.set(ev.pointerId, [ev.clientX, ev.clientY]);
    gesto = dedos.size === 1 ? { objetivo: ev.target, x0: ev.clientX, y0: ev.clientY, movio: false } : { ...gesto, movio: true };
    cancelAnimationFrame(animacion);
  });
  document.addEventListener('pointermove', (ev) => {
    if (!dedos.has(ev.pointerId)) return;
    const s = svg();
    if (!s) return;
    const antes = dedos.get(ev.pointerId);
    if (dedos.size === 2) {
      const otro = [...dedos.entries()].find(([k]) => k !== ev.pointerId)[1];
      const d0 = Math.hypot(antes[0] - otro[0], antes[1] - otro[1]), d1 = Math.hypot(ev.clientX - otro[0], ev.clientY - otro[1]);
      if (d0 > 0) { const [x, y] = aMapa(s, (ev.clientX + otro[0]) / 2, (ev.clientY + otro[1]) / 2); zoomEn(d1 / d0, x, y); }
    } else if (dedos.size === 1 && gesto) {
      if (Math.hypot(ev.clientX - gesto.x0, ev.clientY - gesto.y0) > 6) gesto.movio = true;
      if (gesto.movio && caja.w < mapa.ancho) {
        const [ax, ay] = aMapa(s, antes[0], antes[1]), [bx, by] = aMapa(s, ev.clientX, ev.clientY);
        caja = limitar({ ...caja, x: caja.x + ax - bx, y: caja.y + ay - by });
        aplicarCaja();
      }
    }
    dedos.set(ev.pointerId, [ev.clientX, ev.clientY]);
  });
  const soltar = (ev) => {
    if (!dedos.delete(ev.pointerId)) return;
    if (ev.type === 'pointerup' && !dedos.size && gesto && !gesto.movio) {
      const s = svg();
      if (s) { const [x, y] = aMapa(s, ev.clientX, ev.clientY); tocar(gesto.objetivo, x, y); }
    }
    if (!dedos.size) gesto = null;
  };
  document.addEventListener('pointerup', soltar);
  document.addEventListener('pointercancel', soltar);
  document.addEventListener('wheel', (ev) => {
    const s = ev.target.closest && ev.target.closest('[data-mapa-svg]');
    if (!s) return;
    ev.preventDefault();
    const [x, y] = aMapa(s, ev.clientX, ev.clientY);
    zoomEn(ev.deltaY < 0 ? 1.25 : 0.8, x, y);
  }, { passive: false });
}

// País, región y municipio de un lugar según la pieza donde queda y el mapa abierto
function lugarDePieza(pz) {
  const info = MAPAS[mapa.id];
  return { pais: info.pais || pz.nombre, region: !info.padre ? '' : info.unidad === 'municipios' ? mapa.nombre : pz.nombre, municipio: info.unidad === 'municipios' ? pz.nombre : '', pieza: pz.id };
}

// ---------- Acciones ----------
registrar({
  'lug-reintentar'() { abrirMapa(MAPA_INICIAL); repintar(); },
  'lug-mapa'({ id }) { cambiarMapa(id, migas(MAPAS, mapa.id).some((m) => m.id === id) ? 'mapa-sale' : 'mapa-entra'); },
  'lug-zoom'({ f }) { zoomEn(Number(f), caja.x + caja.w / 2, caja.y + caja.h / 2); },
  'lug-grupo'({ g }) { irA(g ? cajaDe(mapa.piezas.filter((p) => p.grupo === g)) : entero()); },
  'lug-cerrar-pieza'() { piezaSel = null; repintar(); },
  'lug-cerrar'() { abierto = null; repintar(); },
  'lug-estado'({ v }) { filtro.estado = v; repintar(); },
  'lug-filtro'({ k }, el) { filtro[k] = el.value; repintar(); },
  async 'lug-abrir'({ id }) {
    const l = buscar(id);
    // Si su punto no se ve en este mapa, se abre el mapa donde está
    if (l && l.mapa !== mapa.id && (!enElMapa(l) || l.estado !== 'visitado')) await cambiarMapa(l.mapa);
    abierto = id; piezaSel = null;
    repintar();
    if (l && l.lat != null) {
      const [x, y] = proyectar(mapa, l.lat, l.lon);
      setTimeout(() => { irA({ x: x - mapa.ancho / 8, y: y - mapa.alto / 8, w: mapa.ancho / 4, h: mapa.alto / 4 }); document.querySelector('.tarjeta-mapa')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30);
    }
  },
  'lug-ya-estuve'({ p }) {
    const pz = mapa.piezas.find((x) => x.id === p);
    const [lat, lon] = desproyectar(mapa, ...pz.centro);
    if (!marcarPieza(lista().filter((l) => l.mapa === mapa.id), pz)) lista().push({ id: nuevoId(), nombre: pz.nombre, ...lugarDePieza(pz), mapa: mapa.id, tipo: 'pueblo', emoji: '📍', lat, lon, estado: 'visitado', visitas: [], marcaEntera: true });
    guardar();
    toast('✓ ' + pz.nombre + ' marcado como visitado');
  },
  'lug-quitar-pieza'({ p }) {
    desmarcarPieza(lista(), mapa.id, p, MAPAS);
    guardar();
    toast('Quitado de visitados');
  },
  'lug-nuevo'({ p }) { borrador = { tipo: 'pueblo', estado: 'quiero', pieza: p || '', prioridad: 2 }; abierto = null; repintar(); setTimeout(() => document.querySelector('[data-form-lugar]')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30); },
  async 'lug-editar'({ id }) {
    const l = buscar(id);
    if (l.mapa !== mapa.id) await cambiarMapa(l.mapa);
    borrador = { ...l };
    repintar(); setTimeout(() => document.querySelector('[data-form-lugar]')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
  },
  'lug-cancelar'() { borrador = null; ubicando = false; repintar(); },
  'lug-ubicar'() { borrador = leerForm(); ubicando = true; repintar(); setTimeout(() => document.querySelector('.tarjeta-mapa')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30); },
  'lug-no-ubicar'() { ubicando = false; repintar(); },
  'lug-guardar'() {
    const b = leerForm();
    if (!b.nombre) { toast('Escribe el nombre'); return; }
    const pz = mapa.piezas.find((x) => x.id === b.pieza);
    if (!pz) { toast('Escoge ' + una().toLowerCase() + ' o toca el mapa'); return; }
    // Si cambió de municipio sin tocar el mapa, el punto pasa al centro del municipio nuevo
    const antes = b.id && buscar(b.id), moverCentro = b.lat == null || (antes && antes.pieza !== b.pieza && antes.lat === b.lat);
    if (moverCentro) [b.lat, b.lon] = desproyectar(mapa, ...pz.centro);
    Object.assign(b, lugarDePieza(pz), { mapa: mapa.id, visitas: b.visitas || [] });
    if (antes) Object.assign(antes, b); else { b.id = nuevoId(); lista().push(b); }
    abierto = b.id; borrador = null; piezaSel = null;
    guardar();
    toast('Guardado: ' + b.nombre);
  },
  'lug-cambiar-estado'({ id }) {
    const l = buscar(id);
    l.estado = l.estado === 'visitado' ? 'quiero' : 'visitado';
    guardar();
  },
  'lug-borrar'({ id }) {
    const l = buscar(id);
    if (!l || !confirm('¿Borrar ' + l.nombre + ' y sus visitas? Los gastos que estén en Finanzas se quedan allá.')) return;
    lista().splice(lista().indexOf(l), 1);
    abierto = null;
    guardar();
  },
  'lug-guardar-visita'({ id }) {
    const l = buscar(id), caja = document.querySelector('[data-visita="' + id + '"]');
    const val = (n) => { const c = caja.querySelector('[name="' + n + '"]'); return c ? c.value.trim() : ''; };
    const fecha = val('fecha') || iso(), gasto = leerMonto(val('gasto')) || 0, enFinanzas = caja.querySelector('[name="finanzas"]')?.checked;
    const enlace = enlaceSeguro(val('enlace'));
    if (val('enlace') && !enlace) { toast('Ese enlace no es válido: debe empezar por https://'); return; }
    agregarVisita(l, { fecha, con: val('con'), calificacion: Number(val('calificacion')) || 0, nota: val('nota'), gasto, enlace });
    if (gasto && enFinanzas) nuevoMovimiento({ tipo: 'gasto', monto: gasto, categoria: 'ocio', metodo: 'efectivo', nota: l.nombre, fecha });
    guardar();
    toast('✓ Visita guardada' + (gasto && enFinanzas ? ' y gasto en Finanzas' : ''));
  },
  'lug-enlace'({ id, i }, el) {
    const v = buscar(id).visitas[Number(i)], enlace = enlaceSeguro(el.value);
    if (el.value.trim() && !enlace) { toast('Ese enlace no es válido: debe empezar por https://'); return; }
    v.enlace = enlace;
    guardar();
  },
  'lug-borrar-visita'({ id, i }) {
    const l = buscar(id), v = l && l.visitas[Number(i)];
    const ultima = l && l.visitas.length === 1;
    if (!v || !confirm('¿Borrar esta visita?' + (ultima ? ' Como es la única, el lugar vuelve a "quiero ir".' : '') + (v.gasto ? ' El gasto en Finanzas se queda allá.' : ''))) return;
    quitarVisita(l, Number(i));
    guardar();
  },
  'lug-sorpresa'() {
    const s = sorprender(lista());
    plan = s ? { principal: s.principal.id, cercanos: s.cercanos.map((x) => x.id), dias: s.dias } : { principal: null, cercanos: [] };
    repintar();
  },
});
