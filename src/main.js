import './estilos.css';
import { registerSW } from 'virtual:pwa-register';
import { e, cargar, esperarUsuario, alCambiar, guardar, habitosDe, hechosManana, fraccionManana, avanceMetas, segundosCrono } from './estado.js';
import { reloj } from './fechas.js';
import { ejecutar, registrar, prepararAudio, pct, claveDeDatos } from './ui.js';
import { revisar, sumar, detener } from './temporizador.js';
import { resumenSemana } from './gym.js';
import './vistas/hoy.js';
import { textoEspera, revisarCronos } from './vistas/manana.js';
import './vistas/metas.js';
import { vistaGym, semanaActual, claveGym } from './vistas/gym.js';
import './vistas/sesiones.js';
import { pantallaEntrar, pantallaBloqueo } from './vistas/ajustes.js';
import { bloqueo, bloqueada, desbloquear } from './bloqueo.js';
import './vistas/editar.js';
import './vistas/dieta.js';
import { vistaFinanzas, claveFinanzas } from './vistas/finanzas.js';
import { alertas, bannerDiarios } from './vistas/recordatorios.js';
import './vistas/progreso.js';
// Acciones que ya no importa ninguna pantalla de antes (las pantallas de React las usan con data-accion)
import './vistas/mejora.js';
import './vistas/retos.js';
import './vistas/libros.js';
import './vistas/estudiar.js';
import { montarReact, desmontarReact, montarFijo } from './react/montar.js';
import { ponerLateral } from './react/armazon.js';
import { refrescarReact } from './react/refrescar.js';
import { leerPlegadas, alternarPlegada, basePlegable } from './plegables.js';
import './vistas/lugares.js';
import './vistas/suplementos.js';
import './vistas/clientes.js';
import { tieneEntrenador } from './vistas/entrenador.js';
import { iniciarNube, nube, textoNube, configurada } from './nube.js';
import { iniciarHoja } from './hoja.js';
import { iniciarAvisos } from './avisos.js';
import { SECCIONES, FIJAS, visibles, enOrden, oculto, alternar, colocar, restablecer } from './orden.js';
import { ve, veRuta, esAdmin, viendoComo, ponerPermisos } from './permisos.js';
import { bannerVerComo, ponerDatosAdmin } from './vistas/administrar.js';

registerSW({ immediate: true });
// Con nube, los datos son del usuario que entre: hasta saber quién es no se lee ni se escribe nada suyo
if (configurada) esperarUsuario(); else cargar();
iniciarNube();
iniciarHoja();
iniciarAvisos();

const PANTALLAS = {
  finanzas: vistaFinanzas,
  gym: vistaGym,
};
// Pantallas ya migradas a React: se descargan al abrirlas y se montan dentro de #vista (ver react/montar.js)
const REACT = { calendario: () => import('./react/pantallas/Calendario.tsx'), compras: () => import('./react/pantallas/Compras.tsx'),
  ventas: () => import('./react/pantallas/Ventas.tsx'), recordatorios: () => import('./react/pantallas/Recordatorios.tsx'),
  dieta: () => import('./react/pantallas/Dieta.tsx'), administrar: () => import('./react/pantallas/Administrar.tsx'),
  libros: () => import('./react/pantallas/Libros.tsx'), lugares: () => import('./react/pantallas/Lugares.tsx'),
  metas: () => import('./react/pantallas/Metas.tsx'), suplementos: () => import('./react/pantallas/Suplementos.tsx'),
  manana: () => import('./react/pantallas/Manana.tsx'), estudiar: () => import('./react/pantallas/Estudiar.tsx'),
  sesiones: () => import('./react/pantallas/Sesiones.tsx'), hoy: () => import('./react/pantallas/Hoy.tsx'),
  progreso: () => import('./react/pantallas/Progreso.tsx'), editar: () => import('./react/pantallas/Editar.tsx'),
  clientes: () => import('./react/pantallas/Clientes.tsx'), ajustes: () => import('./react/pantallas/Ajustes.tsx'),
  entrenador: () => import('./react/pantallas/Entrenador.tsx') };
// Secciones grandes que se migran pestaña por pestaña: las pestañas de "listas" ya son de React; las demás siguen como antes
const REACT_POR_PESTANA = {
  finanzas: { actual: claveFinanzas, listas: ['registrar', 'mes', 'resumen', 'presupuesto', 'fijos', 'ahorro', 'deudas', 'prestamos', 'calcular', 'esperas', 'planb:desempleo', 'planb:lider', 'planb:creativo', 'planb:innovacion', 'planb:pitch'], cargar: () => import('./react/pantallas/Finanzas.tsx') },
  gym: { actual: claveGym, listas: ['dia', 'resumen', 'plan12', 'casa'], cargar: () => import('./react/pantallas/Gym.tsx') },
};
const reactDe = (v) => REACT[v] || (REACT_POR_PESTANA[v] && REACT_POR_PESTANA[v].listas.includes(REACT_POR_PESTANA[v].actual()) ? REACT_POR_PESTANA[v].cargar : null);
// La pestaña de un enlace (#compras/deseos) hacia una pantalla de React: se le pasa al montarla
let pestanaReact = null;
// Icono, nombre y pantalla. El menú sigue el orden del usuario y no muestra las que escondió (aunque se pueden abrir por enlace)
const VISTAS = Object.fromEntries(Object.entries(SECCIONES).map(([k, [icono, nombre]]) => [k, [icono, nombre, PANTALLAS[k]]]));
// Administrar no está en el catálogo (ni se ordena ni se esconde): solo la ve el admin
VISTAS.administrar = ['🛡️', 'Administrar'];
// 💼 Ventas (vender los PDF): igual que Administrar, solo el admin y nunca en la vista previa de otro rol
VISTAS.ventas = ['💼', 'Ventas'];
const SOLO_ADMIN = ['administrar', 'ventas'];
// 📚 Libros es un área de 🎓 Estudiar: no sale en el menú, pero sus enlaces (#libros/fenix) siguen funcionando
VISTAS.libros = ['📚', 'Libros'];
const DENTRO = { libros: 'estudiar' };
const $ = (id) => document.getElementById(id);
// "#dieta/peso": sección y pestaña. La pestaña se le pasa a la sección ("abrir-dieta") y queda "#dieta".
// Lo que el admin escondió no se abre ni por enlace: se va a Hoy
const permitida = (v) => (SOLO_ADMIN.includes(v) ? esAdmin() && !viendoComo() : v === 'libros' ? veRuta([['seccion', 'estudiar'], ['area', 'libros']]) : ve('seccion', v));
const actual = () => { const v = location.hash.slice(1).split('/')[0]; return VISTAS[v] && permitida(v) ? v : 'hoy'; };
function abrirPestana() {
  const [v, sub] = location.hash.slice(1).split('/');
  if (!sub || !VISTAS[v] || !permitida(v)) return;
  if (REACT[v]) pestanaReact = decodeURIComponent(sub);
  else ejecutar('abrir-' + v, { dataset: { p: decodeURIComponent(sub) } });
  history.replaceState(null, '', '#' + v);
}

// Organizar el menú: arrastrar del asa ⠿ (o flechas ↑ ↓) para ordenar y 👁 para esconder. Las escondidas siguen ahí para volver a mostrarlas
let organizandoMenu = false;

// Cómo quiere cada usuario la barra: compacta, ancho, lado y resumen plegado (config.barra). En el celular solo aplica el resumen
const ANCHO_MIN = 200, ANCHO_MAX = 420;
const ajustesBarra = () => (e().config.barra ??= {});
function aplicarBarra() {
  const b = ajustesBarra();
  document.body.classList.toggle('barra-compacta', !!b.compacta);
  document.body.classList.toggle('barra-izquierda', b.lado === 'izquierda');
  document.documentElement.style.setProperty('--ancho-barra', (b.ancho || 260) + 'px');
}

// Barra lateral: fija a un lado en el computador; en el celular se abre con ☰ desde la derecha. Lo que se ve lo pinta
// React (react/armazon/Lateral.tsx) con estos datos; sin sesión o con la app bloqueada no se muestra
function datosLateral() {
  if ((configurada && !nube.usuario) || bloqueada()) return null;
  const c = e().config, b = ajustesBarra(), avisos = alertas().length, v = actual();
  if (b.compacta) organizandoMenu = false;
  // "Mi entrenador" sale en el menú solo a quien tiene entrenador (por enlace se abre siempre, para unirse con el código)
  const ids = visibles(c, 'menu').filter((k) => ve('seccion', k) && (k !== 'entrenador' || tieneEntrenador() || v === 'entrenador')).concat(SOLO_ADMIN.filter(permitida));
  const total = habitosDe().length, m = avanceMetas(), r = resumenSemana(e().rutina, e().semanas[semanaActual()] || {});
  return {
    compacta: !!b.compacta, lado: b.lado === 'izquierda' ? 'izquierda' : 'derecha', resumenAbierto: b.resumen !== false, organizando: organizandoMenu,
    enlaces: ids.map((k) => ({ k, icono: VISTAS[k][0], nombre: VISTAS[k][1], actual: k === (DENTRO[v] || v), insignia: k === 'recordatorios' ? avisos : 0 })),
    filas: enOrden(c, 'menu').filter((k) => ve('seccion', k)).map((k) => ({ k, icono: VISTAS[k][0], nombre: VISTAS[k][1], apagado: oculto(c, 'menu', k), fija: FIJAS.menu.includes(k) })),
    resumen: [
      ve('seccion', 'manana') && { href: '#manana', titulo: 'Ir a Mañana', texto: '☀️ Mañana', valor: hechosManana() + '/' + total, parte: fraccionManana() },
      ve('seccion', 'metas') && { href: '#metas', titulo: 'Ir a Metas', texto: '🎯 Metas', valor: pct(m.total), parte: m.total },
      ve('seccion', 'gym') && { href: '#gym', titulo: 'Ir a Gym', texto: '🏋️ Semana ' + semanaActual(), valor: r.hechas + '/' + r.plan, parte: r.plan ? r.hechas / r.plan : 0 },
    ].filter(Boolean),
    nube: { estado: nube.estado, texto: textoNube(), titulo: nube.error || textoNube() },
    correo: nube.usuario ? nube.usuario.correo : null,
  };
}
ponerLateral(datosLateral);
// El menú lateral, el cronómetro flotante y el reproductor de sesiones: se montan una vez (React) y se repintan solos
let armazonMontado = false;
function montarArmazon() {
  if (armazonMontado) return;
  armazonMontado = true;
  montarFijo($('lateral'), () => import('./react/armazon/Lateral.tsx'));
  montarFijo($('flotante'), () => import('./react/armazon/Flotante.tsx'));
  montarFijo($('reproductor'), () => import('./react/armazon/Reproductor.tsx'));
}

// Identidad de un campo para encontrarlo de nuevo después de repintar
function claveCampo(el) {
  // Los campos de un formulario que se guarda con un botón (check-in, valoración, agregar…) se reconocen por su id
  if (el.id && !el.dataset.cambio) return 'id:' + el.id;
  return claveDeDatos(el.dataset || {});
}
// Lo escrito y aún no guardado sobrevive al repintado (que también pasa solo: al sincronizar o al traer el plan del entrenador):
// las reps de la serie, el campo donde está el cursor y lo escrito en formularios que se guardan con un botón
function recordarCampos() {
  const activo = document.activeElement, valores = {};
  document.querySelectorAll('#vista [data-serie]').forEach((el) => { if (el.value) valores[claveCampo(el)] = el.value; });
  document.querySelectorAll('#vista input[id]:not([data-cambio]):not([type=file]):not([type=checkbox]), #vista textarea[id]:not([data-cambio]), #vista select[id]:not([data-cambio])')
    .forEach((el) => { if (el.value && el.value !== el.defaultValue) valores[claveCampo(el)] = el.value; });
  // Un campo de archivo no se puede volver a llenar por código
  const clave = activo && $('vista').contains(activo) && activo.type !== 'file' ? claveCampo(activo) : null;
  if (clave) valores[clave] = activo.value;
  return { clave, valores, cursor: clave && activo.selectionStart != null ? [activo.selectionStart, activo.selectionEnd] : null };
}
function restaurarCampos({ clave, valores, cursor }) {
  document.querySelectorAll('#vista input:not([type=file]), #vista textarea, #vista select[id]:not([data-cambio])').forEach((el) => {
    const k = claveCampo(el);
    if (k && k in valores) el.value = valores[k];
    if (k && k === clave) {
      el.focus({ preventScroll: true });
      try { if (cursor) el.setSelectionRange(cursor[0], cursor[1]); } catch (err) {}
    }
  });
}

// ---------- Tarjetas que se abren y cierran (toda la app) ----------
// Cualquier tarjeta con título (h2) se puede cerrar tocando el título o su flecha; queda solo el título.
// Cuáles están cerradas se recuerda en este equipo (no viaja a la nube: el celular y el computador pueden diferir)
function marcarPlegable(t, cerrada) {
  const b = t.querySelector('.plegar-t');
  t.classList.toggle('tarjeta-cerrada', cerrada);
  if (!b) return;
  b.textContent = cerrada ? '▸' : '▾';
  b.setAttribute('aria-expanded', String(!cerrada));
  b.setAttribute('aria-label', (cerrada ? 'Abrir ' : 'Cerrar ') + (b.dataset.titulo || 'la tarjeta'));
}
function prepararPlegables(v) {
  const vistos = {}, cerradas = leerPlegadas();
  document.querySelectorAll('#vista section.tarjeta, #vista article.tarjeta, #vista div.tarjeta').forEach((t) => {
    const cab = t.firstElementChild;
    if (!cab || t.children.length < 2) return;
    const h = cab.matches('h2') ? cab : cab.matches('.fila-resumen, .ed-cab, header, a.titulo-enlace') ? cab.querySelector('h2') : null;
    if (!h) return;
    // Sin números: "🔔 4 recordatorios" y "🔔 5 recordatorios" son la misma tarjeta
    const titulo = h.textContent.replace(/\s+/g, ' ').trim(), base = basePlegable(v, titulo);
    vistos[base] = (vistos[base] || 0) + 1;
    t.dataset.plegable = base + (vistos[base] > 1 ? '#' + vistos[base] : '');
    t.classList.add('plegable');
    cab.classList.add('t-cab');
    const b = document.createElement('span');
    b.className = 'plegar-t'; b.tabIndex = 0; b.setAttribute('role', 'button'); b.dataset.titulo = titulo;
    h.prepend(b);
    marcarPlegable(t, cerradas.has(t.dataset.plegable));
  });
}
// Filas de chips que se deslizan de lado: la activa queda a la vista y, si hay más a la derecha o a la izquierda, se nota
function marcarFila(c) {
  const izq = c.scrollLeft > 2, der = c.scrollLeft + c.clientWidth < c.scrollWidth - 2;
  c.classList.toggle('mas-der', der); c.classList.toggle('mas-izq', izq);
}
function prepararFilas() {
  document.querySelectorAll('#vista .chips').forEach((c) => {
    if (c.scrollWidth <= c.clientWidth + 2) return;
    const activo = c.querySelector('.chip.activo');
    if (activo) { const r = activo.getBoundingClientRect(), rc = c.getBoundingClientRect(); if (r.right > rc.right || r.left < rc.left) c.scrollLeft += r.left - rc.left - (rc.width - r.width) / 2; }
    marcarFila(c);
    c.addEventListener('scroll', () => marcarFila(c), { passive: true });
  });
}
// Al girar el celular o cambiar el tamaño de la ventana, cambia qué cabe
window.addEventListener('resize', () => document.querySelectorAll('#vista .chips').forEach(marcarFila), { passive: true });
function alternarPlegable(t) {
  marcarPlegable(t, alternarPlegada(t.dataset.plegable));
}
// La flecha siempre pliega; el título también, si no es un enlace ni tiene un control debajo del dedo
function plegableTocado(ev) {
  if (ev.target.closest && ev.target.closest('#raiz-react')) return null; // las de React se pliegan solas (react/Tarjeta.tsx)
  const el = ev.target.closest && (ev.target.closest('.plegar-t') || (!ev.target.closest('a, button, input, select, textarea, label, [data-accion]') && ev.target.closest('.plegable > h2.t-cab, .plegable > .t-cab h2')));
  return el ? el.closest('.plegable') : null;
}
document.addEventListener('keydown', (ev) => {
  if ((ev.key !== 'Enter' && ev.key !== ' ') || !ev.target.matches || !ev.target.matches('.plegar-t') || ev.target.closest('#raiz-react')) return;
  ev.preventDefault(); ev.stopPropagation();
  alternarPlegable(ev.target.closest('.plegable'));
}, true);

// Lo último que se tocó: si está dentro de algo con data-ancla, ese bloque no se mueve al repintar.
// Se guardan todos los que lo envuelven, de adentro hacia afuera: si el de adentro ya no está después de repintar, vale el siguiente
let ultimoToque = null;
document.addEventListener('pointerdown', (ev) => { ultimoToque = ev.target; }, true);
function anclaDe() {
  const el = ultimoToque && ultimoToque.isConnected ? ultimoToque : document.activeElement;
  const lista = [];
  for (let a = el && el.closest ? el.closest('#vista [data-ancla]') : null; a; a = a.parentElement && a.parentElement.closest('#vista [data-ancla]')) lista.push({ k: a.dataset.ancla, top: a.getBoundingClientRect().top });
  return lista;
}
let ultimaVista = null;
function pintar() {
  // Sin sesión iniciada solo se ve la pantalla para entrar (lo escrito en correo/contraseña se conserva)
  const sinSesion = configurada && !nube.usuario, cerrada = !sinSesion && bloqueada();
  document.body.classList.toggle('sin-sesion', sinSesion || cerrada);
  if (cerrada) {
    menu(false);
    desmontarReact();
    $('vista').innerHTML = pantallaBloqueo();
    document.title = 'Bloqueada · Rutina';
    ultimaVista = null;
    if (bloqueo.auto) { bloqueo.auto = false; desbloquear(); }
    return;
  }
  if (sinSesion) {
    const correo = $('nube-correo'), clave = $('nube-clave');
    const antes = correo && { correo: correo.value, clave: clave.value, foco: document.activeElement && document.activeElement.id };
    menu(false);
    desmontarReact();
    $('vista').innerHTML = pantallaEntrar();
      document.title = 'Entrar · Rutina';
    if (antes && $('nube-correo')) {
      $('nube-correo').value = antes.correo; $('nube-clave').value = antes.clave;
      if (antes.foco && $(antes.foco)) $(antes.foco).focus();
    }
    ultimaVista = null;
    return;
  }
  const v = actual(), y = window.scrollY, campos = v === ultimaVista ? recordarCampos() : null, ancla = v === ultimaVista ? anclaDe() : null;
  $('vista').dataset.vista = v; // el CSS da más ancho a Hoy en pantallas grandes
  const cargarReact = reactDe(v);
  if (cargarReact) {
    // La pantalla de React se monta una vez y se repinta sola (con sus avisos de arriba)
    if (!$('raiz-react') || $('raiz-react').dataset.pantalla !== v || pestanaReact != null) {
      desmontarReact();
      $('vista').innerHTML = '<div id="raiz-react" data-pantalla="' + v + '"></div>';
      montarReact($('raiz-react'), cargarReact, pestanaReact != null ? { pestana: pestanaReact } : null);
      pestanaReact = null;
    }
  } else {
    desmontarReact();
    // Los avisos de arriba de las pantallas de React los pinta React (react/armazon/Avisos.tsx)
    $('vista').innerHTML = (viendoComo() ? bannerVerComo(viendoComo()) : '') + bannerDiarios() + VISTAS[v][2]();
    if (campos) restaurarCampos(campos);
    prepararPlegables(v);
    prepararFilas();
  }
  montarArmazon();
  aplicarBarra();
  document.title = VISTAS[v][1] + ' · Rutina';
  if (v === ultimaVista) {
    window.scrollTo(0, y);
    const nuevas = ancla && ancla.length ? [...document.querySelectorAll('#vista [data-ancla]')] : [];
    for (const a of ancla || []) {
      const el = nuevas.find((x) => x.dataset.ancla === a.k);
      if (!el) continue;
      const mueve = el.getBoundingClientRect().top - a.top;
      if (Math.abs(mueve) > 1) window.scrollTo(0, y + mueve);
      break;
    }
  } else window.scrollTo(0, 0);
  ultimaVista = v;
}

// Al salir de un campo (change) se repinta; si en ese momento el dedo está sobre un botón,
// se espera a que termine el toque para que el botón no desaparezca debajo del dedo.
let dedoAbajo = false, pendiente = false, soltar = null;
// Se repinta un instante después: al pasar con Tab (o "siguiente" en el teclado del celular) el cursor ya está
// en el campo nuevo, y así se puede dejar ahí después de repintar
let programado = false;
function pedirPintar() {
  if (dedoAbajo) { pendiente = true; return; }
  if (programado) return;
  programado = true;
  setTimeout(() => { programado = false; pintar(); }, 0);
}
function vaciar() { dedoAbajo = false; if (pendiente) { pendiente = false; pintar(); } }
document.addEventListener('pointerdown', () => { dedoAbajo = true; clearTimeout(soltar); prepararAudio(); }, true);
document.addEventListener('pointerup', () => { clearTimeout(soltar); soltar = setTimeout(vaciar, 400); }, true);
document.addEventListener('pointercancel', () => { clearTimeout(soltar); soltar = setTimeout(vaciar, 400); }, true);

document.addEventListener('click', (ev) => {
  const plegable = plegableTocado(ev), el = plegable ? null : ev.target.closest('[data-accion]');
  if (plegable) { ev.preventDefault(); alternarPlegable(plegable); }
  if (el) ejecutar(el.dataset.accion, el, ev);
  if (ev.target.closest('#lateral a')) menu(false); // tocar la sección en la que ya está también cierra el menú
  clearTimeout(soltar);
  vaciar();
});
document.addEventListener('change', (ev) => {
  const el = ev.target.closest('[data-cambio]');
  if (el) ejecutar(el.dataset.cambio, el, ev);
});
// Campos de dinero: los puntos de miles se ponen mientras se escribe ("100000" → "100.000").
// Con "k", "M" o coma decimal ("1,5M") se deja como está.
document.addEventListener('input', (ev) => {
  const el = ev.target;
  if (!el.matches || !el.matches('[data-pesos]') || /[kKmM,]/.test(el.value)) return;
  const v = el.value, cursor = el.selectionStart ?? v.length;
  const digitosAntes = v.slice(0, cursor).replace(/\D/g, '').length;
  const signo = /^\s*[-−]/.test(v) ? '−' : '', digitos = v.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  const nuevo = signo + digitos.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (nuevo === v) return;
  el.value = nuevo;
  // El cursor queda después del mismo número de dígitos
  let pos = signo.length;
  for (let n = 0; pos < nuevo.length && n < digitosAntes; pos++) if (/\d/.test(nuevo[pos])) n++;
  el.setSelectionRange(pos, pos);
});
// Solo números donde van números (campos de texto con teclado numérico; los de dinero tienen su propio formato).
// numeric: solo dígitos · decimal: dígitos, coma, punto y espacios (un drop set "91 59 72") · data-solo="reps": "10 9 8"
const PERMITIDO = { numeric: /[^\d]/g, decimal: /[^\d.,\s]/g, reps: /[^\d.,\s]/g };
document.addEventListener('input', (ev) => {
  const el = ev.target;
  if (!el.matches || el.type !== 'text' || el.matches('[data-pesos]')) return;
  const regla = PERMITIDO[el.dataset.solo || el.inputMode];
  if (!regla) return;
  const v = el.value, limpio = v.replace(regla, '');
  if (limpio === v) return;
  const cursor = (el.selectionStart ?? v.length) - (v.length - limpio.length);
  el.value = limpio;
  try { el.setSelectionRange(Math.max(0, cursor), Math.max(0, cursor)); } catch (err) {}
});
// Enter en el celular ("Ir" o "Siguiente") pasa al siguiente campo de la misma tarjeta, como Tab; en el último se cierra el teclado.
// data-sig: a dónde salta (selector dentro de la misma fila o tarjeta), para cuando lo siguiente no es lo de al lado
const campoSiguiente = (el) => {
  const sig = el.dataset.sig && el.closest('.fila-ej, .tarjeta, section');
  if (sig) { const x = sig.querySelector(el.dataset.sig); if (x) return x; }
  const caja = el.closest('.fila-ej, .ed-ej, .tarjeta, section, form, details');
  if (!caja) return null;
  const todos = [...caja.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=file]):not([type=date]):not([type=time]):not([readonly]):not([disabled]), textarea:not([readonly])')]
    .filter((x) => x.offsetParent !== null);
  return todos[todos.indexOf(el) + 1] || null;
};
// "Enter"/"Ir" en el teclado del celular guarda el campo
document.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Enter' || ev.target.tagName !== 'INPUT') return;
  const serie = ev.target.dataset.serie;
  if (serie) { ev.preventDefault(); const b = ev.target.parentNode.querySelector('[data-accion="serie"]'); if (b) b.click(); return; }
  if (ev.target.id === 'nube-clave') { ev.preventDefault(); ejecutar('nube-entrar', ev.target, ev); return; }
  // data-enter: Enter toca ese botón (agregar a la lista de compras sin soltar el teclado)
  if (ev.target.dataset.enter) { ev.preventDefault(); const b = document.querySelector('[data-accion="' + ev.target.dataset.enter + '"]'); if (b) b.click(); return; }
  const sig = campoSiguiente(ev.target);
  if (sig) { ev.preventDefault(); sig.focus({ preventScroll: true }); sig.scrollIntoView({ block: 'nearest' }); if (sig.select && sig.value) sig.select(); return; }
  ev.target.blur();
});

function menu(abrir) {
  document.body.classList.toggle('menu-abierto', abrir);
  $('velo').hidden = !abrir;
  document.querySelectorAll('[aria-controls="lateral"]').forEach((b) => b.setAttribute('aria-expanded', abrir));
}
registrar({
  't-sumar'() { sumar(30); },
  't-parar'() { detener(); },
  menu() { menu(!document.body.classList.contains('menu-abierto')); },
  'menu-cerrar'() { menu(false); },
  'barra-organizar'() { organizandoMenu = !organizandoMenu; pedirPintar(); refrescarReact(); },
  // El arrastre del menú (React): poner la sección justo antes de otra (sin "antes", al final)
  'barra-colocar'({ id, antes }) { if (colocar(e().config, 'menu', id, antes || undefined)) guardar(); },
  'barra-ancho'({ ancho }) { ajustesBarra().ancho = Math.min(ANCHO_MAX, Math.max(ANCHO_MIN, Math.round(Number(ancho) || 260))); guardar(); },
  'barra-compacta'() { const b = ajustesBarra(); b.compacta = !b.compacta; guardar(); },
  'barra-resumen'() { const b = ajustesBarra(); b.resumen = b.resumen === false; guardar(); },
  'barra-lado'() { const b = ajustesBarra(); b.lado = b.lado === 'izquierda' ? 'derecha' : 'izquierda'; guardar(); },
  'barra-ver'({ id }) { if (alternar(e().config, 'menu', id)) guardar(); },
  'barra-restablecer'() { restablecer(e().config, 'menu'); guardar(); },
});

document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') menu(false); });

// Cuadro de los gráficos: al pasar el mouse, tocar o enfocar una marca con data-tip
function mostrarTip(el, x, y) {
  const t = $('tip'), texto = el && el.dataset.tip;
  if (!texto) { t.hidden = true; return; }
  t.textContent = texto;
  t.hidden = false;
  const r = t.getBoundingClientRect();
  clearTimeout(mostrarTip.t);
  t.style.left = Math.max(8, Math.min(window.innerWidth - r.width - 8, x - r.width / 2)) + 'px';
  t.style.top = Math.max(8, y - r.height - 14) + 'px';
}
document.addEventListener('pointermove', (ev) => {
  const el = ev.target.closest && ev.target.closest('[data-tip]');
  if (el) mostrarTip(el, ev.clientX, ev.clientY); else if (!$('tip').hidden) $('tip').hidden = true;
});
document.addEventListener('pointerdown', (ev) => {
  const el = ev.target.closest && ev.target.closest('[data-tip]');
  if (el) mostrarTip(el, ev.clientX, ev.clientY); else $('tip').hidden = true;
  // Con el dedo no hay "salir de encima": se quita solo después de leerlo
  if (el && ev.pointerType === 'touch') mostrarTip.t = setTimeout(() => { $('tip').hidden = true; }, 4000);
});
document.addEventListener('focusin', (ev) => {
  const el = ev.target.closest && ev.target.closest('[data-tip]');
  if (el) { const r = el.getBoundingClientRect(); mostrarTip(el, r.left + r.width / 2, r.top); }
});
window.addEventListener('scroll', () => { $('tip').hidden = true; }, { passive: true });

alCambiar(pedirPintar);
window.addEventListener('hashchange', () => { menu(false); abrirPestana(); pintar(); refrescarReact(); window.scrollTo(0, 0); });

// Reloj: temporizadores, cronómetros y la espera de la pastilla, sin repintar toda la pantalla
setInterval(() => {
  revisar();
  revisarCronos();
  document.querySelectorAll('[data-crono]').forEach((el) => {
    const [fecha, id] = el.dataset.crono.split('|'), d = e().dias[fecha];
    el.textContent = reloj(segundosCrono(d && d.crono[id]));
  });
  document.querySelectorAll('[data-espera]').forEach((el) => {
    const t = textoEspera(Number(el.dataset.espera));
    el.textContent = t.texto;
    el.className = 'espera ' + t.clase;
  });
}, 500);

// Al volver a la app después de medianoche, "Hoy" debe ser el día nuevo
let fechaPintada = new Date().toDateString();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && new Date().toDateString() !== fechaPintada) { fechaPintada = new Date().toDateString(); pintar(); refrescarReact(); }
});

// Solo en desarrollo (npm run dev): probar permisos y Administrar sin Supabase. No llega a la versión publicada.
if (import.meta.env.DEV) window.rutinaPrueba = { permisos: (p) => { ponerPermisos('prueba', p); pintar(); }, admin: (d) => { ponerDatosAdmin(d); pintar(); } };

abrirPestana();
pintar();
