import { registerSW } from 'virtual:pwa-register';
// Banderas (🇨🇴) en Chrome y Edge de Windows, que las muestran como letras ("CO"): solo ahí se carga una fuente con las
// banderas, guardada dentro de la app (funciona sin internet). En el celular no hace nada
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import fuenteBanderas from 'country-flag-emoji-polyfill/dist/TwemojiCountryFlags.woff2?url';
polyfillCountryFlagEmojis('Twemoji Country Flags', fuenteBanderas);
import { e, cargar, esperarUsuario, alCambiar, guardar, empezarDePrueba, habitosDe, hechosManana, fraccionManana, avanceMetas, segundosCrono } from './estado.js';
import { reloj } from './fechas.js';
import { ejecutar, registrar, prepararAudio, pct } from './ui.js';
import { revisar, sumar, detener } from './temporizador.js';
import { resumenSemana } from './gym.js';
import './vistas/hoy.js';
import { textoEspera, revisarCronos } from './vistas/manana.js';
import './vistas/metas.js';
import { semanaActual } from './vistas/gym.js';
import './vistas/sesiones.js';
import './vistas/ajustes.js';
import { bloqueo, bloqueada, desbloquear } from './bloqueo.js';
import './vistas/editar.js';
import './vistas/dieta.js';
import { PESTANAS_FINANZAS } from './vistas/finanzas.js';
import { alertas } from './vistas/recordatorios.js';
// Acciones que ya no importa ninguna pantalla de antes (las pantallas de React las usan con data-accion)
import './vistas/mejora.js';
import './vistas/retos.js';
import './vistas/mivida.js';
import './vistas/libros.js';
import './vistas/estudiar.js';
import { montarReact, desmontarReact, montarFijo } from './react/montar.js';
import { ponerLateral, ponerSesion, ponerBuscar } from './react/armazon.js';
import { idsAbajo, alternarAbajo } from './barra-abajo.js';
import { aplicarLetra, ponerTema, ponerLetra } from './apariencia.js';
import { cargarContenidos, alCargarContenidos } from './contenidos.js';
import { pedirQueNoSeBorre } from './almacen.js';
import { refrescarReact } from './react/refrescar.js';
import './vistas/lugares.js';
import './vistas/suplementos.js';
import './vistas/clientes.js';
import { tieneEntrenador } from './vistas/entrenador.js';
import { pestanaPanel, marca as miMarca } from './vistas/panel.js';
import { modoPortal, repartirMenu, MENU_NEGOCIO, iniciales, tintaSobre } from './marca.js';
import { marcaDeMiEntrenador } from './coach.js';
import { iniciarNube, nube, textoNube, configurada, sincronizar, nubeDePrueba } from './nube.js';
import { iniciarHoja } from './hoja.js';
import { iniciarAvisos } from './avisos.js';
import { SECCIONES, FIJAS, visibles, enOrden, oculto, alternar, colocar, restablecer, agrupar, grupoDe, moverAGrupo, GRUPOS, gruposAbiertos, alternarGrupo } from './orden.js';
import { ve, veRuta, esAdmin, viendoComo, ponerPermisos, rolVisto } from './permisos.js';
import { ponerDatosAdmin } from './vistas/administrar.js';

registerSW({ immediate: true });
// 🔠 El tamaño de letra de este equipo (Ajustes → 🎨 Cómo se ve), antes de pintar nada
aplicarLetra();
// Con nube, los datos son del usuario que entre: hasta saber quién es no se lee ni se escribe nada suyo
if (configurada) esperarUsuario(); else cargar();
// Los estilos de toda la app (armazón, lo general, gráficos y figuras): React, una sola vez y antes que cualquier pantalla.
// Hasta que llegan, index.html deja la página en el fondo de la app (sin el destello de una página sin estilos)
const estilos = document.createElement('div');
estilos.hidden = true;
document.body.appendChild(estilos);
montarFijo(estilos, () => import('./react/armazon/Estilos.tsx'));
// Cursos y libros: se descargan en paralelo, sin frenar el arranque; al llegar se repinta lo que los muestra (Estudio de hoy)
cargarContenidos().catch(() => {});
alCargarContenidos(() => { pedirPintar(); refrescarReact(); });
// 🛡️ Que el navegador no borre los datos de este equipo cuando le falte espacio (o tras días sin abrir, en el iPhone)
pedirQueNoSeBorre();
iniciarNube();
iniciarHoja();
iniciarAvisos();

// Todas las pantallas son de React: se descargan al abrirlas y se montan dentro de #vista (ver react/montar.js)
const REACT = { calendario: () => import('./react/pantallas/Calendario.tsx'), compras: () => import('./react/pantallas/Compras.tsx'),
  ventas: () => import('./react/pantallas/Ventas.tsx'), recordatorios: () => import('./react/pantallas/Recordatorios.tsx'),
  dieta: () => import('./react/pantallas/Dieta.tsx'), administrar: () => cargarContenidos().then(() => import('./react/pantallas/Administrar.tsx')),
  libros: () => cargarContenidos().then(() => import('./react/pantallas/Libros.tsx')), lugares: () => import('./react/pantallas/Lugares.tsx'),
  metas: () => import('./react/pantallas/Metas.tsx'), suplementos: () => import('./react/pantallas/Suplementos.tsx'),
  manana: () => import('./react/pantallas/Manana.tsx'), estudiar: () => cargarContenidos().then(() => import('./react/pantallas/Estudiar.tsx')),
  sesiones: () => import('./react/pantallas/Sesiones.tsx'), hoy: () => import('./react/pantallas/Hoy.tsx'),
  progreso: () => import('./react/pantallas/Progreso.tsx'), editar: () => import('./react/pantallas/Editar.tsx'),
  clientes: () => import('./react/pantallas/Clientes.tsx'), ajustes: () => import('./react/pantallas/Ajustes.tsx'),
  entrenador: () => import('./react/pantallas/Entrenador.tsx'), finanzas: () => import('./react/pantallas/Finanzas.tsx'),
  gym: () => import('./react/pantallas/Gym.tsx'), vida: () => import('./react/pantallas/MiVida.tsx'), panel: () => import('./react/pantallas/Panel.tsx'),
  voz: () => import('./react/pantallas/Voz.tsx'), energia: () => import('./react/pantallas/Energia.tsx'),
  notas: () => import('./react/pantallas/Notas.tsx') };
// La pestaña de un enlace (#compras/deseos) hacia una pantalla de React: se le pasa al montarla
let pestanaReact = null;
// Icono y nombre. El menú sigue el orden del usuario y no muestra las que escondió (aunque se pueden abrir por enlace)
const VISTAS = Object.fromEntries(Object.entries(SECCIONES).map(([k, [icono, nombre]]) => [k, [icono, nombre]]));
// Administrar no está en el catálogo (ni se ordena ni se esconde): solo la ve el admin
VISTAS.administrar = ['🛡️', 'Administrar'];
// 💼 Ventas (vender los PDF): igual que Administrar, solo el admin y nunca en la vista previa de otro rol
VISTAS.ventas = ['💼', 'Ventas'];
const SOLO_ADMIN = ['administrar', 'ventas'];
// 📚 Libros es un área de 🎓 Estudiar: no sale en el menú, pero sus enlaces (#libros/fenix) siguen funcionando
VISTAS.libros = ['📚', 'Libros'];
const DENTRO = { libros: 'estudiar' };
// Subsecciones que se abren desde el menú (#seccion/pestaña): las pestañas de Finanzas, Dieta, Gym y Editar
const SUBSECCIONES = {
  finanzas: Object.entries(PESTANAS_FINANZAS),
  dieta: [['hoy', '🍽 Hoy'], ['planes', '📋 Planes'], ['peso', '⚖️ Peso'], ['alimentos', '🥚 Alimentos'], ['equivalencias', '🔄 Equivalencias'], ['corte', '🔥 Corte'], ['antojos', '🍟 Antojos']],
  gym: [['resumen', '📊 Resumen'], ['plan12', '📆 12 semanas'], ['casa', '🏠 En casa']],
  editar: [['rutina', '🏋️ Rutina'], ['habitos', '☀️ Hábitos'], ['sesiones', '🧘 Sesiones'], ['pantallas', '🧩 Pantallas']],
};
const $ = (id) => document.getElementById(id);
// "#dieta/peso": sección y pestaña. La pestaña se le pasa a la sección ("abrir-dieta") y queda "#dieta".
// Lo que el admin escondió no se abre ni por enlace: se va a Hoy
// 🧑‍💼 Panel: del entrenador y del admin; sin nube (sin roles), de quien ya tiene clientes
const entrena = () => { const r = rolVisto(); return r === 'admin' || r === 'entrenador' || (r == null && !!(e().clientes || []).length); };
const permitida = (v) => (SOLO_ADMIN.includes(v) ? esAdmin() && !viendoComo() : v === 'libros' ? veRuta([['seccion', 'estudiar'], ['area', 'libros']])
  : v === 'panel' ? entrena() && ve('seccion', v) : ve('seccion', v));
const actual = () => { const v = location.hash.slice(1).split('/')[0]; return VISTAS[v] && permitida(v) ? v : 'hoy'; };
const CON_ABRIR = ['finanzas', 'gym', 'panel'];
function abrirPestana() {
  const [v, sub] = location.hash.slice(1).split('/');
  if (!sub || !VISTAS[v] || !permitida(v)) return;
  // Finanzas y Gym guardan su pestaña en su archivo de vistas (abrir-finanzas, abrir-gym); las demás la reciben al montarse
  if (CON_ABRIR.includes(v)) ejecutar('abrir-' + v, { dataset: { p: decodeURIComponent(sub) } });
  else pestanaReact = decodeURIComponent(sub);
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
  // 📱 Celular: el menú sale del lado de tu mano y, con "una mano", ☰ abajo al alcance del pulgar
  document.body.classList.toggle('mano-izquierda', b.mano === 'izquierda');
  document.body.classList.toggle('una-mano', !!b.unaMano && !!b.sinAbajo);
  // 📱 La barra de abajo del celular (react/armazon/Abajo.tsx): encendida salvo que la apague en Ajustes
  document.body.classList.toggle('con-abajo', !b.sinAbajo);
  document.documentElement.style.setProperty('--ancho-barra', (b.ancho || 260) + 'px');
}

// Barra lateral: fija a un lado en el computador; en el celular se abre con ☰ desde la derecha. Lo que se ve lo pinta
// React (react/armazon/Lateral.tsx) con estos datos; sin sesión o con la app bloqueada no se muestra
function datosLateral() {
  if (modoSesion()) return null;
  const c = e().config, b = ajustesBarra(), avisos = alertas().length, v = actual();
  if (b.compacta) organizandoMenu = false;
  // "Mi entrenador" sale en el menú solo a quien tiene entrenador (por enlace se abre siempre, para unirse con el código)
  // 📝 Notas no va en la lista: tiene su botón siempre a la vista (#boton-notas)
  const ids = visibles(c, 'menu').filter((k) => k !== 'notas' && ve('seccion', k) && (k !== 'entrenador' || tieneEntrenador() || v === 'entrenador') && (k !== 'panel' || permitida('panel'))).concat(SOLO_ADMIN.filter(permitida));
  // 📱 Barra de abajo: de lo que puede abrir (también 📝 Notas), las que eligió o las de siempre
  const disponibles = ids.includes('notas') || !permitida('notas') ? ids : ids.concat('notas');
  const enlaceDe = (k) => ({ k, icono: VISTAS[k][0], nombre: VISTAS[k][1], actual: k === (DENTRO[v] || v), insignia: k === 'recordatorios' ? avisos : 0 });
  const abajo = idsAbajo(b, disponibles).map(enlaceDe), abajoOpciones = disponibles.map(enlaceDe);
  const total = habitosDe().length, m = avanceMetas(), r = resumenSemana(e().rutina, e().semanas[semanaActual()] || {});
  const enlaces = ids.map((k) => ({ k, icono: VISTAS[k][0], nombre: VISTAS[k][1], actual: k === (DENTRO[v] || v), insignia: k === 'recordatorios' ? avisos : 0 }));
  // 🎨 Cada lado ve su portal (src/marca.js): el cliente, lo suyo primero con la marca de su entrenador y lo demás en "Más";
  // el entrenador, su negocio arriba (Panel, Pagos, Valoraciones, Clientes) con su marca. El admin, como siempre
  const modo = modoPortal({ rol: rolVisto(), tieneEntrenador: tieneEntrenador() }), menu = repartirMenu(enlaces, modo);
  const actualNegocio = (ruta) => (ruta.startsWith('panel') ? v === 'panel' && (ruta.split('/')[1] || 'inicio') === pestanaPanel() : ruta === v);
  const negocio = modo === 'entrenador' ? MENU_NEGOCIO.filter(([ruta]) => permitida(ruta.split('/')[0])).map(([ruta, icono, nombre]) => ({ k: ruta, icono, nombre, actual: actualNegocio(ruta) })) : [];
  const enNegocio = new Set(negocio.map((x) => x.k.split('/')[0]));
  const propia = miMarca(), marcaVista = modo === 'cliente' ? marcaDeMiEntrenador(e()) : propia.negocio || propia.logo ? { ...propia } : null;
  return {
    compacta: !!b.compacta, lado: b.lado === 'izquierda' ? 'izquierda' : 'derecha', resumenAbierto: b.resumen !== false, organizando: organizandoMenu,
    // Por área de vida (el cliente de un entrenador ve su menú propio, sin grupos); cerrados: los grupos plegados
    grupos: modo === 'cliente' ? null : agrupar(c, menu.principales.filter((x) => !enNegocio.has(x.k))), abiertos: gruposAbiertos(b), subs: SUBSECCIONES,
    mano: b.mano === 'izquierda' ? 'izquierda' : 'derecha', unaMano: !!b.unaMano, listaGrupos: GRUPOS,
    modo, marca: marcaVista, negocio, mas: menu.mas,
    enlaces: menu.principales.filter((x) => !enNegocio.has(x.k)),
    filas: enOrden(c, 'menu').filter((k) => k !== 'notas' && ve('seccion', k)).map((k) => ({ k, icono: VISTAS[k][0], nombre: VISTAS[k][1], apagado: oculto(c, 'menu', k), fija: FIJAS.menu.includes(k), grupo: grupoDe(c, k) })),
    resumen: [
      ve('seccion', 'manana') && { href: '#manana', titulo: 'Ir a Mañana', texto: '☀️ Mañana', valor: hechosManana() + '/' + total, parte: fraccionManana() },
      ve('seccion', 'metas') && { href: '#metas', titulo: 'Ir a Metas', texto: '🎯 Metas', valor: pct(m.total), parte: m.total },
      ve('seccion', 'gym') && { href: '#gym', titulo: 'Ir a Gym', texto: '🏋️ Semana ' + semanaActual(), valor: r.hechas + '/' + r.plan, parte: r.plan ? r.hechas / r.plan : 0 },
    ].filter(Boolean),
    nube: { estado: nube.estado, texto: textoNube(), titulo: nube.error || textoNube() },
    correo: nube.usuario ? nube.usuario.correo : null,
    abajo, abajoOpciones, sinAbajo: !!b.sinAbajo, avisos,
  };
}
ponerLateral(datosLateral);
// 🔎 Buscar: todas las secciones que puede abrir (también las que escondió del menú), sus pestañas y los hábitos
ponerBuscar(() => ({
  secciones: Object.keys(VISTAS).filter((k) => permitida(k) && k !== 'libros').map((k) => ({ k, icono: VISTAS[k][0], nombre: VISTAS[k][1] })),
  subs: SUBSECCIONES, habitos: e().habitos || [],
}));
const abrirBuscar = () => { menu(false); window.dispatchEvent(new Event('rutina:buscar')); };
// 🎨 La barra de arriba del celular lleva la misma marca que el menú (la del entrenador del cliente o la tuya); sin marca, Rutina.
// Se arma con nodos (nunca HTML con lo que escribió el entrenador)
let marcaPintada = '';
function marcaArriba() {
  const caja = document.querySelector('.top-movil .marca'), d = datosLateral(), m = d && d.marca;
  const firma = m ? [m.negocio, m.color, (m.logo || '').length].join('|') : '';
  if (!caja || firma === marcaPintada) return;
  marcaPintada = firma;
  const logo = document.createElement(m && m.logo ? 'img' : 'span');
  logo.className = 'logo';
  logo.setAttribute('aria-hidden', 'true');
  if (m && m.logo) { logo.src = m.logo; logo.alt = ''; logo.style.objectFit = 'contain'; logo.style.background = '#fff'; }
  else if (m) { logo.textContent = iniciales(m.negocio); if (m.color) { logo.style.background = m.color; logo.style.color = tintaSobre(m.color); logo.style.fontWeight = '800'; logo.style.fontSize = '14px'; } }
  else logo.textContent = '🏋️';
  const nombre = document.createElement('b');
  nombre.textContent = (m && m.negocio) || 'Rutina';
  caja.replaceChildren(logo, nombre);
}
// El menú lateral, el cronómetro flotante y el reproductor de sesiones: se montan una vez (React) y se repintan solos
let armazonMontado = false;
function montarArmazon() {
  if (armazonMontado) return;
  armazonMontado = true;
  montarFijo($('lateral'), () => import('./react/armazon/Lateral.tsx'));
  montarFijo($('flotante'), () => import('./react/armazon/Flotante.tsx'));
  montarFijo($('reproductor'), () => import('./react/armazon/Reproductor.tsx'));
  montarFijo($('arriba'), () => import('./react/armazon/Arriba.tsx'));
  montarFijo($('abajo'), () => import('./react/armazon/Abajo.tsx'));
  montarFijo($('buscar'), () => import('./react/armazon/Buscar.tsx'));
}

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
// Sin sesión iniciada solo se ve Entrar; con la huella activa, el candado (rutinaPrueba.sesion lo simula en desarrollo)
const prueba = { modo: null };
function modoSesion() {
  if (prueba.modo === 'entrar' || (configurada && !nube.usuario)) return 'entrar';
  return prueba.modo === 'bloqueada' || bloqueada() ? 'bloqueada' : null;
}
ponerSesion(() => ({ modo: modoSesion(), correo: nube.usuario ? nube.usuario.correo : '' }));
// 🔔 Lo pendiente en el ícono de la app instalada (donde el celular o el computador lo permitan)
let insigniaPuesta = -1;
function ponerInsignia(n) {
  if (n === insigniaPuesta || !('setAppBadge' in navigator)) return;
  insigniaPuesta = n;
  (n ? navigator.setAppBadge(n) : navigator.clearAppBadge()).catch(() => {});
}
function pintar() {
  // Entrar o el candado (React conserva lo escrito en correo y contraseña cuando se repinta)
  const modo = modoSesion();
  document.body.classList.toggle('sin-sesion', !!modo);
  if (modo) {
    menu(false);
    if (!$('raiz-react') || $('raiz-react').dataset.pantalla !== 'sesion') {
      desmontarReact();
      $('vista').innerHTML = '<div id="raiz-react" data-pantalla="sesion"></div>';
      montarReact($('raiz-react'), () => import('./react/armazon/Sesion.tsx'));
    }
    document.title = modo === 'bloqueada' ? 'Bloqueada · Rutina' : 'Entrar · Rutina';
    ultimaVista = null;
    if (modo === 'bloqueada' && bloqueo.auto) { bloqueo.auto = false; desbloquear(); }
    return;
  }
  marcaArriba();
  // 📝 El botón de Notas: en todas las pantallas menos en la misma Notas, y solo si la puede abrir
  const v0 = actual();
  if ($('boton-notas')) $('boton-notas').hidden = v0 === 'notas' || !permitida('notas');
  const v = v0, y = window.scrollY, ancla = v === ultimaVista ? anclaDe() : null;
  $('vista').dataset.vista = v; // el CSS da más ancho a Hoy en pantallas grandes
  // La pantalla se monta una vez y se repinta sola (con sus avisos de arriba)
  if (!$('raiz-react') || $('raiz-react').dataset.pantalla !== v || pestanaReact != null) {
    desmontarReact();
    $('vista').innerHTML = '<div id="raiz-react" data-pantalla="' + v + '"></div>';
    montarReact($('raiz-react'), REACT[v], pestanaReact != null ? { pestana: pestanaReact } : null);
    pestanaReact = null;
  }
  montarArmazon();
  aplicarBarra();
  const pendientes = ve('seccion', 'recordatorios') ? alertas().length : 0;
  document.title = (pendientes ? '(' + pendientes + ') ' : '') + VISTAS[v][1] + ' · Rutina';
  ponerInsignia(pendientes);
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
  const el = ev.target.closest('[data-accion]');
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
  // Con "una mano", el menú abre mostrando lo de abajo (las secciones, donde llega el pulgar)
  if (abrir && document.body.classList.contains('una-mano')) requestAnimationFrame(() => { const l = $('lateral'); l.scrollTop = l.scrollHeight; });
}
// 📱 Deslizar el menú hacia su borde (a la derecha; zurdo, a la izquierda) lo cierra: sigue al dedo y, al soltar
// pasado un tercio (o con un tirón rápido), se cierra; si no, vuelve. Un gesto vertical sigue siendo desplazar la lista
(() => {
  let ini = null;
  const lat = () => $('lateral');
  const signo = () => (document.body.classList.contains('mano-izquierda') ? -1 : 1);
  document.addEventListener('touchstart', (ev) => {
    ini = null;
    if (!document.body.classList.contains('menu-abierto') || organizandoMenu || ev.touches.length !== 1) return;
    const t = ev.target;
    if (!(t.closest && (t.closest('#lateral') || t.closest('#velo')))) return;
    if (t.closest('input, textarea, select, [data-ordenable], [draggable="true"]')) return;
    ini = { x: ev.touches[0].clientX, y: ev.touches[0].clientY, t: Date.now(), dx: 0, horiz: null };
  }, { passive: true });
  document.addEventListener('touchmove', (ev) => {
    if (!ini) return;
    const dx = (ev.touches[0].clientX - ini.x) * signo(), dy = ev.touches[0].clientY - ini.y;
    if (ini.horiz === null) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      ini.horiz = Math.abs(dx) > Math.abs(dy) * 1.2;
      if (!ini.horiz) { ini = null; return; }
    }
    ini.dx = Math.max(0, dx);
    const l = lat();
    l.style.transition = 'none';
    l.style.transform = 'translateX(' + ini.dx * signo() + 'px)';
  }, { passive: true });
  const soltarMenu = () => {
    if (!ini || !ini.horiz) { ini = null; return; }
    const l = lat(), rapido = ini.dx > 40 && ini.dx / Math.max(1, Date.now() - ini.t) > 0.5;
    const cerrar = rapido || ini.dx > l.offsetWidth / 3;
    l.style.transition = ''; l.style.transform = '';
    ini = null;
    if (cerrar) menu(false);
  };
  document.addEventListener('touchend', soltarMenu);
  document.addEventListener('touchcancel', soltarMenu);
})();
// 📱 Deslizar una fila con el dedo: a la derecha toca su botón de hecho (data-deslizar = selector dentro de la fila) y a la
// izquierda el de abrir o editar (data-deslizar-izq). La fila sigue al dedo; pasado el umbral se pinta y, al soltar, se toca
// el botón (la misma acción de siempre, con su deshacer). Un gesto vertical sigue siendo desplazar la pantalla
(() => {
  const UMBRAL = 80;
  let d = null;
  const limpiar = (el) => { el.style.transition = 'transform .15s'; el.style.transform = ''; el.removeAttribute('data-deslizando'); setTimeout(() => { el.style.transition = ''; }, 160); };
  document.addEventListener('touchstart', (ev) => {
    d = null;
    if (ev.touches.length !== 1 || document.body.classList.contains('menu-abierto')) return;
    const t = ev.target, el = t.closest && t.closest('[data-deslizar], [data-deslizar-izq]');
    if (!el || t.closest('input, textarea, select, [contenteditable="true"], [draggable="true"], [data-ordenable]')) return;
    d = { el, x: ev.touches[0].clientX, y: ev.touches[0].clientY, dx: 0, horiz: null };
  }, { passive: true });
  document.addEventListener('touchmove', (ev) => {
    if (!d) return;
    const dx = ev.touches[0].clientX - d.x, dy = ev.touches[0].clientY - d.y;
    if (d.horiz === null) {
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
      d.horiz = Math.abs(dx) > Math.abs(dy) * 1.5;
      if (!d.horiz) { d = null; return; }
    }
    const sel = dx > 0 ? d.el.dataset.deslizar : d.el.dataset.deslizarIzq;
    d.boton = sel ? d.el.querySelector(sel) : null;
    d.dx = d.boton ? Math.max(-140, Math.min(140, dx)) : dx / 6; // sin botón para ese lado: apenas se mueve
    d.el.style.transition = 'none';
    d.el.style.transform = 'translateX(' + d.dx + 'px)';
    if (d.boton && Math.abs(d.dx) >= UMBRAL) d.el.setAttribute('data-deslizando', d.dx > 0 ? 'hecho' : 'abrir');
    else d.el.removeAttribute('data-deslizando');
  }, { passive: true });
  const soltarFila = () => {
    if (!d) return;
    const { el, boton, dx } = d;
    d = null;
    limpiar(el);
    if (boton && Math.abs(dx) >= UMBRAL && boton.isConnected) { if (navigator.vibrate) navigator.vibrate(15); boton.click(); }
  };
  document.addEventListener('touchend', soltarFila);
  document.addEventListener('touchcancel', () => { if (d) { limpiar(d.el); d = null; } });
})();

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
  'barra-restablecer'() { restablecer(e().config, 'menu'); const b = ajustesBarra(); delete b.abiertos; delete b.cerrados; guardar(); },
  // Grupos del menú: abrir o cerrar uno, y pasar una sección a otro (al arrastrarla debajo de su título)
  'barra-grupo'({ g }) { if (alternarGrupo(ajustesBarra(), g)) guardar(); },
  'barra-mover-grupo'({ id, g }) { if (moverAGrupo(e().config, id, g)) guardar(); },
  'barra-mano'({ v }) { ajustesBarra().mano = v === 'izquierda' ? 'izquierda' : 'derecha'; guardar(); },
  'barra-una-mano'() { const b = ajustesBarra(); b.unaMano = !b.unaMano; guardar(); },
  // 📱 Barra de abajo: encender o apagar, y poner o quitar una sección (máximo 4)
  'barra-abajo'() { const b = ajustesBarra(); b.sinAbajo = !b.sinAbajo; guardar(); },
  'barra-abajo-id'({ id }) { const d = datosLateral(); if (d) { alternarAbajo(ajustesBarra(), d.abajoOpciones.map((x) => x.k), id); guardar(); } },
  'barra-abajo-restablecer'() { delete ajustesBarra().abajo; guardar(); },
  // 🎨 Tema y letra de este equipo (src/apariencia.js)
  'apariencia-tema'({ v }) { ponerTema(v); refrescarReact(); },
  'apariencia-letra'({ v }) { ponerLetra(v); refrescarReact(); },
  buscar() { abrirBuscar(); },
});
// 🔎 Ctrl+K (⌘K en Mac) o "/" fuera de un campo abren el buscador
document.addEventListener('keydown', (ev) => {
  if (modoSesion()) return;
  const escribiendo = ev.target.closest && ev.target.closest('input, textarea, select, [contenteditable="true"]');
  if (((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') || (ev.key === '/' && !escribiendo && !ev.ctrlKey && !ev.metaKey && !ev.altKey)) { ev.preventDefault(); abrirBuscar(); }
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
if (import.meta.env.DEV) {
  const nubeAntes = { estado: nube.estado, lista: nube.lista };
  window.rutinaPrueba = {
    permisos: (p) => { ponerPermisos('prueba', p); pintar(); }, admin: (d) => { ponerDatosAdmin(d); pintar(); },
    // Empezar como una cuenta nueva (vacía) o con los datos de ejemplo (así arrancan los recorridos de prueba)
    nuevo: () => empezarDePrueba(false), ejemplo: () => empezarDePrueba(true),
    // Sincronizar con una nube de mentira (tests/e2e/nube.mjs): cliente = { rpc(nombre, args) }
    nube: (cliente, usuario) => nubeDePrueba(cliente, usuario), sincronizar: () => sincronizar(), estadoNube: () => ({ ...nube }),
    // modo: 'entrar' | 'bloqueada' | null (volver). cargando, rechazo: la pantalla de entrar; correo, error, intentando: el candado
    sesion: (o = {}) => {
      prueba.modo = o.modo || null;
      nube.usuario = prueba.modo === 'bloqueada' ? { id: 'prueba', correo: o.correo || 'prueba@ejemplo.com' } : null;
      nube.estado = prueba.modo === 'entrar' ? 'sin-sesion' : nubeAntes.estado;
      nube.lista = prueba.modo === 'entrar' ? !o.cargando : nubeAntes.lista;
      nube.rechazo = o.rechazo || '';
      bloqueo.error = o.error || ''; bloqueo.intentando = !!o.intentando; bloqueo.auto = false;
      pintar(); refrescarReact();
    },
  };
}

abrirPestana();
pintar();
