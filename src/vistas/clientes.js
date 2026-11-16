// 👥 Clientes: armas la rutina y el plan de comida de otra persona reutilizando tu Gym y tu Dieta, y se los compartes
// (texto para WhatsApp o imagen de la rutina). Los editores de ejercicios y de comidas son los mismos de Editar y de Dieta.
import { e, guardar, repintar } from '../estado.js';
import { registrar, toast, copiarTexto } from '../ui.js';
import { compartirRutina } from '../imagen-rutina.js';
import { semanaActual } from '../estado.js';
import { nuevoCliente, copiarRutina, copiarDieta, recalcularCliente, textoCliente, OBJETIVOS_CLIENTE, PLANES_CLIENTE, nuevoCiclo, preguntasCheckin, MEDIDAS, PRUEBAS_CLIENTE, plantillaDe, clienteDePlantilla, htmlPlan } from '../clientes.js';
import { iso, fechaCorta } from '../fechas.js';
import { pesos, leerMonto } from '../finanzas.js';
import { nuevoMovimiento } from './finanzas.js';
import { nube, llamar } from '../nube.js';
import { planParaPublicar, checkinsNuevos } from '../coach.js';
import { tipoElegido } from './ciclo-cliente.js';
import { fasesDeTipo, TIPOS_CICLO } from '../ciclo.js';

let abierto = null, pestana = 'datos', diaCl = 0, planCl = null, copiarDias = null, copiarPlanes = null;
const lista = () => (e().clientes ??= []);
const idx = () => lista().findIndex((c) => c.id === abierto);
const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const kg = (n) => String(Math.round(n * 10) / 10).replace('.', ',');
const series = (c) => c.rutina.reduce((s, d) => s + d.ejercicios.reduce((t, ej) => t + ej.filas.reduce((u, f) => u + f.series, 0), 0), 0);

const ESTADO_COBRO = { 'sin-plan': ['programado', 'Sin plan'], pausa: ['programado', 'En pausa'], 'al-dia': ['al-dia', 'Al día'], pronto: ['pronto', 'Paga pronto'], vencido: ['vencido', 'Vencido'] };
let filtroCl = '';
const plantillas = () => (e().plantillasCliente ??= []);

// ---------- 🔗 App: el cliente entra con su cuenta, recibe el plan que publicas y te comparte su avance ----------
let remotos = null, cargandoR = false, errorR = '';
async function cargarRemotos() {
  if (cargandoR) return;
  cargandoR = true; errorR = '';
  try { remotos = await llamar('rutina_coach_clientes'); } catch (err) { errorR = err.message; remotos = remotos || []; }
  cargandoR = false;
  repintar();
}
const enlaceInvitacion = (codigo) => location.origin + location.pathname + '#entrenador/' + codigo;
const textoInvitacion = (c, codigo) => 'Hola ' + c.nombre.split(' ')[0] + ' 👋 Te invito a la app Rutina: ahí vas a tener tu plan de entrenamiento y de comidas, y me compartes tu avance.\n\n' +
  '1. Abre este enlace: ' + enlaceInvitacion(codigo) + '\n2. Entra con tu usuario\n3. Toca «Unirme» (tu código es ' + codigo + ')';

// Lo que la pantalla de React (react/pantallas/Clientes.tsx) necesita de aquí: qué está abierto y elegido
export const piezasClientes = {
  ver: () => ({ abierto, pestana, filtro: filtroCl, remotos, cargando: cargandoR, error: errorR }),
  // El cliente abierto (si ya no existe, ninguno) y su posición
  abiertoK: () => { const k = idx(); if (k < 0) abierto = null; return k; },
  // El día y el plan que se están viendo (si ya no existen, el primero)
  diaElegido: (c) => { if (diaCl >= c.rutina.length) diaCl = 0; return diaCl; },
  planElegido: (c) => { const p = c.dieta.planes || {}; if (!p[planCl]) planCl = Object.keys(p)[0] || null; return planCl; },
  // Qué días y planes míos se copian (por defecto: todos los días menos el core y los planes de siempre)
  diasParaCopiar: () => (copiarDias ??= e().rutina.filter((d) => d.ejercicios.length && d.id !== 'core').map((d) => d.id)),
  planesParaCopiar: () => (copiarPlanes ??= [...PLANES_CLIENTE]),
  // Sus datos de la app (la nube): se piden una vez al abrir la pestaña
  pedirRemotos: () => { if (remotos == null && !cargandoR) cargarRemotos(); },
  kg, series, DIAS, ESTADO_COBRO,
};

const cliente = () => lista()[idx()];
registrar({
  'abrir-clientes'({ p }) { if (lista().some((c) => c.id === p)) { abierto = p; pestana = 'datos'; } },
  'cl-agregar'() {
    const campo = document.getElementById('cl-nombre'), nombre = campo ? campo.value.trim() : '';
    if (!nombre) { toast('Escribe el nombre del cliente'); if (campo) campo.focus(); return; }
    const sel = document.getElementById('cl-plantilla'), pl = sel && sel.value ? plantillas().find((x) => x.id === sel.value) : null;
    const c = pl ? clienteDePlantilla(pl, nombre) : nuevoCliente(nombre);
    lista().push(c);
    abierto = c.id; pestana = 'datos'; diaCl = 0; planCl = null;
    guardar();
    window.scrollTo(0, 0);
    toast('👤 ' + nombre + ' agregado' + (pl ? ' con la plantilla «' + pl.nombre + '»' : '') + ': pon su peso y su objetivo');
  },
  'cl-abrir'({ id }) { abierto = id; pestana = 'datos'; diaCl = 0; planCl = null; repintar(); window.scrollTo(0, 0); },
  'cl-cerrar'() { abierto = null; repintar(); window.scrollTo(0, 0); },
  'cl-filtro'({ v }) { filtroCl = v; repintar(); },
  // App del cliente
  'cl-remotos'() { cargarRemotos(); },
  async 'cl-invitar'() {
    const c = cliente();
    try { const r = await llamar('rutina_coach_invitar', { p_local: c.id }); await cargarRemotos(); toast('🔗 Código ' + r.codigo + ': mándale la invitación'); } catch (err) { toast('⚠️ ' + err.message); }
  },
  async 'cl-invitacion-enviar'({ codigo }) {
    const t = textoInvitacion(cliente(), codigo);
    if (navigator.share) { try { await navigator.share({ title: 'Invitación a Rutina', text: t }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(t, '📋 Invitación copiada: pégala en WhatsApp');
  },
  async 'cl-publicar'() {
    const c = cliente();
    if (!c.rutina.length && !Object.keys(c.dieta.planes || {}).length) { toast('Primero arma su rutina o sus comidas'); return; }
    try { await llamar('rutina_coach_publicar', { p_local: c.id, p_plan: planParaPublicar(c, e().dieta) }); await cargarRemotos(); toast('📲 Plan publicado: le llega a ' + c.nombre + ' al abrir la app'); } catch (err) { toast('⚠️ ' + err.message); }
  },
  async 'cl-terminar'() {
    const c = cliente();
    if (!confirm('¿Terminar la conexión con ' + c.nombre + '? Deja de recibir tus planes y tú dejas de ver su avance. Lo que tienes aquí de ' + c.nombre + ' se queda.')) return;
    try { await llamar('rutina_coach_terminar', { p_local: c.id }); await cargarRemotos(); toast('Conexión terminada'); } catch (err) { toast('⚠️ ' + err.message); }
  },
  'cl-traer-checkins'() {
    const c = cliente(), a = (remotos || []).find((x) => x.local === c.id), nuevos = checkinsNuevos(c, a && a.resumen);
    if (!nuevos.length) return;
    (c.checkins ||= []).push(...nuevos.map((x) => ({ ...x })));
    c.checkins.sort((x, y) => x.fecha.localeCompare(y.fecha));
    const conPeso = nuevos.filter((x) => x.peso > 0).pop();
    if (conPeso) c.peso = conPeso.peso;
    guardar();
    toast('📥 ' + nuevos.length + (nuevos.length === 1 ? ' check-in pasado' : ' check-ins pasados') + ' a Seguimiento');
  },
  // Cobro
  'cl-cobro'({ k }, el) {
    const kb = (cliente().cobro ??= { precio: 0, cada: 'mes', inicio: iso(), pagos: [] });
    if (k === 'precio') kb.precio = leerMonto(el.value) || 0;
    else if (k === 'pausa') kb.pausa = el.checked;
    else kb[k] = el.value;
    guardar();
  },
  'cl-pagar'() {
    const c = cliente(), kb = c.cobro, pago = { fecha: iso(), monto: kb.precio };
    (kb.pagos ??= []).push(pago);
    const aFin = document.getElementById('cl-a-finanzas');
    if (aFin && aFin.checked) {
      const cats = e().finanzas.categorias.ingreso, cat = (cats.find((x) => /freelance|extra/i.test(x.nombre)) || cats.find((x) => x.id === 'otro-ingreso') || cats[0]).id;
      nuevoMovimiento({ tipo: 'ingreso', monto: kb.precio, categoria: cat, metodo: 'transferencia', nota: 'Asesoría ' + c.nombre, fecha: pago.fecha });
    }
    guardar();
    toast('✓ Pago de ' + c.nombre + ': ' + pesos(kb.precio) + (aFin && aFin.checked ? ' (también en Finanzas)' : ''));
  },
  'cl-pago-borrar'({ i }) {
    const kb = cliente().cobro, p = kb.pagos[Number(i)];
    if (!p || !confirm('¿Borrar el pago del ' + fechaCorta(p.fecha) + '? Si lo anotaste en Finanzas, bórralo también allá.')) return;
    kb.pagos.splice(Number(i), 1);
    guardar();
  },
  // Ciclo
  'cl-ciclo-crear'() { const campo = document.getElementById('cl-ciclo-inicio'); const ciclo = nuevoCiclo(campo && campo.value ? campo.value : undefined); ciclo.fases = fasesDeTipo(tipoElegido()); cliente().ciclo = ciclo; guardar(); toast('📆 Ciclo ' + TIPOS_CICLO[tipoElegido()].nombre + ' listo: mira el gráfico y ajusta las fases'); },
  'cl-ciclo-borrar'() {
    const c = cliente(), antes = c.ciclo;
    if (!confirm('¿Quitar el ciclo de ' + c.nombre + '?')) return;
    c.ciclo = null; guardar();
    toast('Ciclo quitado', () => { c.ciclo = antes; guardar(); });
  },
  'cl-fase-semanas'({ i }, el) {
    const n = Math.round(Number(el.value));
    if (!(n >= 1 && n <= 20)) { toast('Entre 1 y 20 semanas'); repintar(); return; }
    cliente().ciclo.fases[Number(i)].semanas = n; guardar();
  },
  'cl-fase-nueva'() { cliente().ciclo.fases.push({ id: 'f' + Date.now().toString(36), nombre: 'Fase nueva', semanas: 2, rir: '2', objetivo: '' }); guardar(); },
  'cl-fase-borrar'({ i }) {
    const fases = cliente().ciclo.fases, k = Number(i), x = fases[k];
    if (fases.length < 2) { toast('El ciclo necesita al menos una fase'); return; }
    fases.splice(k, 1); guardar();
    toast('Fase ' + x.nombre + ' borrada', () => { fases.splice(k, 0, x); guardar(); });
  },
  // Seguimiento
  'cl-checkin-pedir'() {
    const c = cliente(), t = preguntasCheckin(c);
    if (navigator.share) { navigator.share({ text: t }).catch((err) => { if (err.name !== 'AbortError') copiarTexto(t, '📋 Preguntas copiadas: pégalas en WhatsApp'); }); return; }
    copiarTexto(t, '📋 Preguntas copiadas: pégalas en WhatsApp');
  },
  'cl-checkin'() {
    const c = cliente(), v = (id) => (document.getElementById(id) || { value: '' }).value.trim(), n = (id) => { const x = Number(v(id).replace(',', '.')); return v(id) && Number.isFinite(x) ? x : null; };
    const x = { id: 'ck' + Date.now().toString(36), fecha: iso(), peso: n('ck-peso'), sueno: n('ck-sueno'), energia: n('ck-energia'), entreno: n('ck-entreno'), comida: n('ck-comida'), nota: v('ck-nota') };
    if (x.peso != null && (x.peso < 25 || x.peso > 300)) { toast('Revisa el peso'); return; }
    if (x.comida != null && (x.comida < 0 || x.comida > 100)) { toast('El plan de comida va de 0 a 100 %'); return; }
    if ([x.sueno, x.energia].some((y) => y != null && (y < 1 || y > 5))) { toast('Sueño y energía van del 1 al 5'); return; }
    if ([x.peso, x.sueno, x.energia, x.entreno, x.comida].every((y) => y == null) && !x.nota) { toast('Escribe al menos una respuesta'); return; }
    (c.checkins ||= []).push(x);
    if (x.peso) c.peso = x.peso; // el peso del check-in pasa a ser su peso actual
    guardar();
    toast('✅ Check-in guardado' + (x.peso ? ' · su peso quedó en ' + kg(x.peso) + ' kg' : ''));
  },
  'cl-valoracion'() {
    const c = cliente(), x = { id: 'va' + Date.now().toString(36), fecha: iso() };
    for (const [id] of [...MEDIDAS, ...PRUEBAS_CLIENTE]) { const t = (document.getElementById('va-' + id) || { value: '' }).value.trim().replace(',', '.'), n = Number(t); if (t && Number.isFinite(n) && n > 0) x[id] = n; }
    if (Object.keys(x).length <= 2) { toast('Llena al menos una medida'); return; }
    if (x.peso && (x.peso < 25 || x.peso > 300)) { toast('Revisa el peso'); return; }
    (c.valoraciones ||= []).push(x);
    if (x.peso) c.peso = x.peso;
    guardar();
    toast('📏 Valoración guardada');
  },
  'cl-registro-borrar'({ lista: que, i }) {
    const arr = cliente()[que], k = Number(i), x = arr && arr[k];
    if (!x) return;
    arr.splice(k, 1); guardar();
    toast('Borrado el del ' + fechaCorta(x.fecha), () => { arr.splice(k, 0, x); guardar(); });
  },
  // Plantillas y PDF
  'cl-plantilla-guardar'() {
    const c = cliente(), campo = document.getElementById('cl-plantilla-nombre'), pl = plantillaDe(c, campo ? campo.value : '');
    if (!c.rutina.length && !Object.keys(c.dieta.planes || {}).length) { toast('Primero arma su rutina o sus comidas'); return; }
    plantillas().push(pl); guardar();
    toast('📚 Plantilla «' + pl.nombre + '» guardada');
  },
  'cl-pdf'() {
    const c = cliente();
    let caja = document.getElementById('imprimir');
    if (!caja) { caja = document.createElement('div'); caja.id = 'imprimir'; document.body.appendChild(caja); }
    caja.innerHTML = htmlPlan(c, e().dieta);
    document.body.classList.add('imprimiendo');
    const fin = () => { document.body.classList.remove('imprimiendo'); caja.innerHTML = ''; window.removeEventListener('afterprint', fin); };
    window.addEventListener('afterprint', fin);
    window.print();
  },
  'cl-pestana'({ p }) { pestana = p; repintar(); window.scrollTo(0, 0); },
  'cl-objetivo'({ v }) { const c = cliente(); c.objetivo = v; c.ajuste = OBJETIVOS_CLIENTE[v][1]; guardar(); },
  'cl-num'({ k }, el) {
    const c = cliente(), t = el.value.trim().replace(',', '.'), n = Number(t);
    if (t === '') c[k] = k === 'ajuste' ? 0 : null;
    else if (!Number.isFinite(n) || (k !== 'ajuste' && n <= 0)) { toast('Escribe un número'); repintar(); return; }
    // Un peso o una estatura imposibles dañan todo el plan de comida: se piden de nuevo
    else if (k === 'peso' && (n < 25 || n > 300)) { toast('Revisa el peso: ' + t.replace('.', ',') + ' kg no parece correcto'); repintar(); return; }
    else if (k === 'estatura' && (n < 100 || n > 250)) { toast('Revisa la estatura: va en centímetros (ej.: 170)'); repintar(); return; }
    else c[k] = k === 'ajuste' ? Math.max(-50, Math.min(100, Math.round(n))) : Math.round(n * 10) / 10;
    guardar();
  },
  'cl-borrar'() {
    const c = cliente();
    if (!confirm('¿Borrar a ' + c.nombre + ' con su rutina y su plan de comida?')) return;
    const i = idx(), quitado = lista().splice(i, 1)[0];
    abierto = null;
    guardar();
    toast('Borrado ' + quitado.nombre, () => { lista().splice(i, 0, quitado); guardar(); });
  },
  'cl-duplicar'() {
    const c = cliente(), copia = { ...JSON.parse(JSON.stringify(c)), ...nuevoCliente(c.nombre + ' (copia)') };
    Object.assign(copia, { objetivo: c.objetivo, peso: c.peso, estatura: c.estatura, ajuste: c.ajuste, nota: c.nota, rutina: copiarRutina(c.rutina, c.rutina.map((d) => d.id), { notas: true }), dieta: JSON.parse(JSON.stringify(c.dieta)) });
    lista().splice(idx() + 1, 0, copia);
    abierto = copia.id;
    guardar();
    toast('⧉ Copia lista: cámbiale el nombre');
  },
  // Rutina
  'cl-copiar-dia'({ id }) { const i = copiarDias.indexOf(id); if (i < 0) copiarDias.push(id); else copiarDias.splice(i, 1); repintar(); },
  'cl-copiar-rutina'({ sumar }) {
    if (!copiarDias.length) { toast('Elige al menos un día'); return; }
    const c = cliente(), nuevos = copiarRutina(e().rutina, copiarDias);
    // En el orden de tu semana
    nuevos.sort((a, b) => (a.diaSemana || 9) - (b.diaSemana || 9));
    if (sumar) { diaCl = c.rutina.length; c.rutina.push(...nuevos); } else { c.rutina = nuevos; diaCl = 0; }
    guardar();
    toast('📋 ' + nuevos.length + (nuevos.length === 1 ? ' día copiado' : ' días copiados') + ': ajústalos para ' + c.nombre);
  },
  'cl-dia-nuevo'() {
    const c = cliente(), id = 'cd' + Date.now().toString(36);
    c.rutina.push({ id, nombre: 'Día ' + (c.rutina.length + 1), diaSemana: null, calentamiento: '', cardio: '', ejercicios: [] });
    diaCl = c.rutina.length - 1;
    guardar();
    setTimeout(() => document.getElementById('ed-nuevo-nombre')?.focus({ preventScroll: true }), 80);
  },
  'cl-dia'({ i }) { diaCl = Number(i); repintar(); },
  'cl-mover-dia'({ n }) {
    const r = cliente().rutina, a = diaCl, b = a + Number(n);
    if (b < 0 || b >= r.length) return;
    [r[a], r[b]] = [r[b], r[a]]; diaCl = b;
    guardar();
  },
  'cl-borrar-dia'() {
    const c = cliente(), d = c.rutina[diaCl];
    if (!d || !confirm('¿Borrar el día "' + d.nombre + '" de ' + c.nombre + '?')) return;
    const i = diaCl, quitado = c.rutina.splice(i, 1)[0];
    diaCl = Math.max(0, i - 1);
    guardar();
    toast('Borrado ' + quitado.nombre, () => { c.rutina.splice(i, 0, quitado); diaCl = i; guardar(); });
  },
  // Comidas
  'cl-copiar-plan'({ t }) { const i = copiarPlanes.indexOf(t); if (i < 0) copiarPlanes.push(t); else copiarPlanes.splice(i, 1); repintar(); },
  'cl-copiar-dieta'({ sumar }) {
    if (!copiarPlanes.length) { toast('Elige al menos un plan'); return; }
    const c = cliente(), antes = { ...(c.dieta.planes || {}) };
    const tipos = sumar ? copiarPlanes.filter((t) => !antes[t]) : copiarPlanes;
    if (sumar && !tipos.length) { toast('Ya tiene esos planes'); return; }
    const tmp = { ...c };
    const ajustado = copiarDieta(e().dieta, tmp, tipos);
    c.dieta = { planes: sumar ? { ...antes, ...tmp.dieta.planes } : tmp.dieta.planes };
    planCl = tipos[0];
    guardar();
    toast('🥗 ' + tipos.length + (tipos.length === 1 ? ' plan copiado' : ' planes copiados') + (ajustado ? ' y ajustados a ' + kg(c.peso) + ' kg' : ': pon su peso para ajustarlos'));
  },
  'cl-plan'({ t }) { planCl = t; repintar(); },
  'cl-recalcular'() {
    const c = cliente(), antes = JSON.parse(JSON.stringify(c.dieta.planes));
    if (!recalcularCliente(e().dieta, c)) { toast('Pon su peso primero'); return; }
    guardar();
    toast('⚖️ Cantidades ajustadas a ' + kg(c.peso) + ' kg', () => { c.dieta.planes = antes; guardar(); });
  },
  'cl-quitar-plan'() {
    const c = cliente(), plan = c.dieta.planes[planCl];
    if (!plan || !confirm('¿Quitar el plan "' + plan.nombre + '" de ' + c.nombre + '?')) return;
    const t = planCl;
    delete c.dieta.planes[t];
    planCl = null;
    guardar();
    toast('Quitado ' + plan.nombre, () => { c.dieta.planes[t] = plan; planCl = t; guardar(); });
  },
  // Compartir
  'cl-copiar-texto'() { const c = cliente(); copiarTexto(textoCliente(c, e().dieta), '📋 Plan de ' + c.nombre + ' copiado: pégalo en WhatsApp'); },
  async 'cl-enviar'() {
    const c = cliente(), texto = textoCliente(c, e().dieta);
    if (navigator.share) { try { await navigator.share({ title: 'Plan de ' + c.nombre, text: texto }); return; } catch (err) { if (err.name === 'AbortError') return; } }
    copiarTexto(texto, '📋 Copiado: pégalo en WhatsApp');
  },
  async 'cl-imagen'() {
    const c = cliente();
    try {
      const r = await compartirRutina(semanaActual(), { rutina: c.rutina, sesiones: e().sesiones, semanas: {}, config: { futbol: [], sesionesPartido: [], sesionesDescanso: [], objetivos: e().config.objetivos } },
        { titulo: '🏋️ Rutina de ' + c.nombre, subtitulo: OBJETIVOS_CLIENTE[c.objetivo] ? OBJETIVOS_CLIENTE[c.objetivo][0] : '' });
      if (r === 'descargada') toast('🖼️ Imagen descargada');
    } catch (err) { toast('No se pudo crear la imagen'); }
  },
});
