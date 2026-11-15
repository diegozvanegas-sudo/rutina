// Recorrido de 💰 Finanzas con clics y teclado reales. Por ahora cubre las pestañas ya migradas a React:
// ➕ Registrar (gasto, ingreso, transferencia, corregir, borrar, buscar categoría, filtrar), 📊 Mes (cambiar de mes),
// 💳 Deudas (agregar, editar, simular pagar más, pagar), 🤝 Me deben (agregar, cobrar, prestar más, saldar, reabrir),
// 🧮 Calcular (teclado, porcentajes, dividir la cuenta, crédito, llevar el valor a Registrar), ⏳ 72 h (esperar, descartar),
// 🛟 Plan B módulo 1 (emociones, plata, contadores, horario, red, textos) y módulo 2 (autoevaluación, plan de acción),
// 📈 Resumen (ajustar una cuenta), 🎯 Presupuesto (monto, grupo, agregar y mover categorías), 🔁 Fijos (agregar un ingreso,
// editarlo y registrarlo) y 🐷 Ahorro (aportar, no dejar sacar de más, agregar una meta de un toque).
//   node .claude/skills/probar-rutina/scripts/probar.mjs tests/e2e/finanzas.mjs <carpeta de capturas>
import { ayudas } from './ayudas.mjs';
import { PLANTILLAS_META } from '../../src/datos_finanzas.js';
import { EMOCIONES, BLOQUES, RED, RECURSOS, CARACTERISTICAS, PLAZOS } from '../../src/desempleo.js';

export default async (p) => {
  const a = ayudas(p, 'Finanzas'), { paso, falla, tocarTexto, escribirCampo } = a;
  const fin = async () => (await p.estado())?.finanzas;
  const abrir = async (pestana, titulo) => { await p.ir('finanzas/' + pestana); await a.esperar('#vista h1'); await a.dormir(500); if (titulo) falla((await a.texto()).includes(titulo), 'no abrió ' + pestana + ' (falta "' + titulo + '")'); };

  // ---------- Resumen ----------
  await abrir('resumen', 'Patrimonio neto');
  await paso('resumen');
  await a.escribir('[data-saldo]', '150000');
  await tocarTexto('Ajustar');
  let f = await fin();
  falla(f.metodos.some((m) => m.ajuste && m.ajuste.monto === 150000), 'no ajustó la cuenta');
  falla(await a.valor('[data-saldo]') === '', 'el campo del saldo debe quedar vacío después de ajustar: ' + await a.valor('[data-saldo]'));
  await paso('cuenta ajustada');
  await tocarTexto('Ajustar');
  falla((await a.aviso()).includes('Escribe cuánto hay hoy'), 'no avisó del saldo vacío');

  // ---------- Presupuesto ----------
  await abrir('presupuesto', 'Cómo repartir');
  await paso('presupuesto');
  const primera = (await fin()).categorias.gasto[0].id, cuantas = (await fin()).categorias.gasto.length;
  await escribirCampo('Presupuesto del mes', '300000');
  await p.poner(await a.campo('Grupo'), 'deseo');
  f = await fin();
  falla(f.categorias.gasto[0].presupuesto === 300000 && f.categorias.gasto[0].grupo === 'deseo', 'no guardó presupuesto o grupo: ' + JSON.stringify(f.categorias.gasto[0]));
  falla(await a.valorCampo('Presupuesto del mes') === '300.000', 'el presupuesto no quedó con puntos');
  await tocarTexto('Bajar');
  f = await fin();
  falla(f.categorias.gasto[1].id === primera, 'no bajó la categoría');
  await tocarTexto('＋ Categoría');
  falla((await fin()).categorias.gasto.length === cuantas + 1, 'no agregó la categoría');
  await paso('presupuesto cambiado');

  // ---------- Fijos ----------
  await abrir('fijos', 'Ingresos de cada mes');
  await paso('fijos');
  const nFijos = (await fin()).fijos.length, nMovs = (await fin()).movimientos.length;
  await tocarTexto('＋ Ingreso fijo');
  f = await fin();
  falla(f.fijos.length === nFijos + 1 && f.fijos.at(-1).tipo === 'ingreso', 'no agregó el ingreso fijo');
  // En la app de antes, "Editar" se cerraba solo después de cada cambio (la de React lo deja abierto): se abre si hace falta
  const editar = async (campo, valor) => { try { await a.campo(campo); } catch (err) { await tocarTexto('Editar'); } await escribirCampo(campo, valor); };
  await editar('Monto', '2000000');
  await editar('Nombre', 'Sueldo');
  f = await fin();
  falla(f.fijos.at(-1).monto === 2000000 && f.fijos.at(-1).nombre === 'Sueldo', 'no guardó la edición del fijo: ' + JSON.stringify(f.fijos.at(-1)));
  // El nombre no puede quedar vacío
  await editar('Nombre', '');
  falla((await fin()).fijos.at(-1).nombre === 'Sueldo', 'dejó el nombre vacío');
  await paso('ingreso fijo agregado');
  await tocarTexto('Registrar ingreso de', undefined, false);
  f = await fin();
  falla(f.movimientos.length === nMovs + 1 && f.movimientos.some((m) => m.tipo === 'ingreso' && m.monto === 2000000 && m.fijo), 'no registró el ingreso');
  await paso('ingreso recibido');

  // ---------- Ahorro ----------
  await abrir('ahorro', 'Aportar');
  await paso('ahorro');
  await a.escribir('[data-aporte]', '50000');
  await tocarTexto('＋ Aportar');
  f = await fin();
  falla(f.movimientos.some((m) => m.tipo === 'ahorro' && m.monto === 50000), 'no registró el aporte');
  falla(await a.valor('[data-aporte]') === '', 'el campo del aporte debe quedar vacío');
  await a.escribir('[data-aporte]', '999999999');
  await tocarTexto('Sacar');
  falla((await a.aviso()).includes('No hay tanto ahorrado'), 'dejó sacar más de lo ahorrado');
  await a.escribir('[data-aporte]', '');
  const nMetas = (await fin()).metas.length, plantilla = PLANTILLAS_META[0];
  await tocarTexto('Agregar con un toque');
  await tocarTexto(plantilla.icono + ' ' + plantilla.nombre);
  falla((await fin()).metas.length === nMetas + 1, 'no agregó la meta de un toque');
  await paso('ahorro con aporte y meta nueva');

  // ---------- Registrar ----------
  await abrir('registrar', 'Guardar gasto');
  await paso('registrar');
  f = await fin();
  const c0 = f.categorias.gasto[0], m1 = f.metodos[1], antesMovs = f.movimientos.length;
  await a.escribir('#fin-monto', '25000');
  falla(await a.valor('#fin-monto') === '25.000', 'el monto no se formateó');
  await tocarTexto(c0.icono + c0.nombre);
  await paso('categoría elegida');
  await escribirCampo('Nota', 'almuerzo');
  await tocarTexto(m1.icono + ' ' + m1.nombre);
  await tocarTexto('Guardar gasto');
  f = await fin();
  let g = f.movimientos.at(-1);
  falla(f.movimientos.length === antesMovs + 1 && g.tipo === 'gasto' && g.monto === 25000 && g.categoria === c0.id && g.nota === 'almuerzo' && g.metodo === m1.id, 'no guardó el gasto: ' + JSON.stringify(g));
  falla(await a.valor('#fin-monto') === '', 'el monto debe quedar vacío después de guardar');
  await paso('gasto guardado');
  // Sin monto: avisa y no guarda
  await tocarTexto('Guardar gasto');
  falla((await fin()).movimientos.length === antesMovs + 1, 'guardó un gasto sin monto');
  // Ingreso
  await tocarTexto('💰 Ingreso');
  const i0 = (await fin()).categorias.ingreso[0];
  await a.escribir('#fin-monto', '100000');
  await tocarTexto(i0.icono + i0.nombre);
  await tocarTexto('Guardar ingreso');
  g = (await fin()).movimientos.at(-1);
  falla(g.tipo === 'ingreso' && g.monto === 100000 && g.categoria === i0.id, 'no guardó el ingreso: ' + JSON.stringify(g));
  // Transferencia entre cuentas
  await tocarTexto('🔄 Transferir');
  await paso('transferir');
  await a.escribir('#fin-monto', '10000');
  await tocarTexto('Guardar transferencia');
  g = (await fin()).movimientos.at(-1);
  falla(g.tipo === 'transferencia' && g.monto === 10000 && g.metodo && g.destino && g.metodo !== g.destino, 'no guardó la transferencia: ' + JSON.stringify(g));
  await tocarTexto('💸 Gasto');
  // Buscar una categoría escribiendo
  await a.escribir('[aria-label="Buscar categoría"]', c0.nombre.slice(0, 4));
  await paso('buscando');
  await a.escribir('[aria-label="Buscar categoría"]', '');
  // Corregir el gasto tocándolo en la lista
  const idGasto = (await fin()).movimientos.find((m) => m.nota === 'almuerzo').id;
  await p.ev(`document.querySelector('[title="Tocar para corregir"]').scrollIntoView({block:'center'})`);
  await a.marcar('almuerzo', '[title="Tocar para corregir"]', false);
  await p.ev(`(()=>{const el=[...document.querySelectorAll('[title="Tocar para corregir"]')].find(x=>x.textContent.includes('almuerzo'));document.querySelectorAll('[data-e2e]').forEach(x=>x.removeAttribute('data-e2e'));el.setAttribute('data-e2e','1');el.scrollIntoView({block:'center'})})()`);
  await p.tocar('[data-e2e] b');
  falla((await a.texto()).includes('Corrigiendo movimiento') && await a.valor('#fin-monto') === '25.000', 'no abrió el movimiento para corregir');
  await paso('corrigiendo');
  await a.escribir('#fin-monto', '30000');
  await tocarTexto('Guardar cambios');
  f = await fin();
  falla(f.movimientos.find((m) => m.id === idGasto).monto === 30000 && f.movimientos.length === antesMovs + 3, 'no guardó la corrección');
  // Filtrar la lista por una categoría y volver a ver todo
  await tocarTexto(c0.icono + ' ' + c0.nombre, 'button', false);
  falla((await a.texto()).includes('Solo ' + c0.nombre), 'no filtró por categoría');
  await paso('filtrado');
  await tocarTexto('ver todo');
  // Borrar un movimiento
  await tocarTexto('Borrar movimiento');
  falla((await fin()).movimientos.length === antesMovs + 2, 'no borró el movimiento');
  await paso('registrar al final');

  // ---------- Mes ----------
  await abrir('mes', 'Por categoría');
  await paso('mes');
  await tocarTexto('Mes anterior');
  await paso('mes anterior');
  await tocarTexto('Mes siguiente');
  falla((await a.texto()).includes('Por categoría'), 'no volvió al mes actual');

  // ---------- Deudas ----------
  // Abre la sección plegada (si la app la cerró) y escribe en el campo
  const editarEn = async (seccion, campo, valor) => { try { await a.campo(campo); } catch (err) { await tocarTexto(seccion); } await escribirCampo(campo, valor); };
  await abrir('deudas', 'Lo que debes');
  await paso('deudas');
  const nDeudas = (await fin()).deudas.length;
  await tocarTexto('＋ Deuda o tarjeta');
  falla((await fin()).deudas.length === nDeudas + 1, 'no agregó la deuda');
  // La nueva queda de última: se edita la última sección "Editar"
  const ultimoEditar = async () => p.ev(`(()=>{document.querySelectorAll('[data-e2e]').forEach(x=>x.removeAttribute('data-e2e'));const s=[...document.querySelectorAll('#vista summary, #vista button, #vista [role=button]')].filter(x=>x.textContent.replace(/[▾▸▼▶]/g,'').trim()==='Editar'&&x.checkVisibility({visibilityProperty:true}));const el=s.at(-1);el.setAttribute('data-e2e','1');el.scrollIntoView({block:'center'})})()`);
  const campoUltimo = async (etiqueta, valor) => {
    const marcar = () => p.ev(`(()=>{document.querySelectorAll('[data-e2e-campo]').forEach(x=>x.removeAttribute('data-e2e-campo'));const cs=[];for(const l of document.querySelectorAll('#vista label')){const propio=[...l.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent).join('').trim()||l.textContent.trim();if(!propio.startsWith(${JSON.stringify(etiqueta)}))continue;const c=l.querySelector('input,textarea,select')||(l.htmlFor&&document.getElementById(l.htmlFor));if(c&&c.checkVisibility({visibilityProperty:true}))cs.push(c)}const c=cs.at(-1);if(!c)return false;c.setAttribute('data-e2e-campo','1');return true})()`);
    if (!(await marcar())) { await ultimoEditar(); await p.tocar('[data-e2e]'); if (!(await marcar())) throw new Error('Finanzas: no encontré el campo ' + etiqueta); }
    await a.escribir('[data-e2e-campo]', valor); await a.salir();
  };
  await campoUltimo('Nombre', 'Tarjeta Visa');
  await campoUltimo('Saldo', '1000000');
  await campoUltimo('Cuota', '200000');
  await campoUltimo('Interés % mensual', '2');
  f = await fin();
  let d = f.deudas.at(-1);
  falla(d.nombre === 'Tarjeta Visa' && d.saldo === 1000000 && d.cuota === 200000 && d.tasa === 2, 'no guardó la deuda: ' + JSON.stringify(d));
  await paso('deuda agregada');
  await escribirCampo('¿Y si pagas más cada mes?', '100000');
  falla((await a.texto()).includes('más (') && (await a.texto()).includes('terminas en'), 'el simulador no mostró el resultado');
  await paso('simulando');
  const movsAntes = (await fin()).movimientos.length;
  await p.ev(`[...document.querySelectorAll('[data-pago]')].at(-1).setAttribute('data-e2e-pago','1')`);
  await a.escribir('[data-e2e-pago]', '200000');
  await p.ev(`(()=>{document.querySelectorAll('[data-e2e]').forEach(x=>x.removeAttribute('data-e2e'));const b=[...document.querySelectorAll('#vista button')].filter(x=>x.textContent.trim()==='Pagar').at(-1);b.setAttribute('data-e2e','1');b.scrollIntoView({block:'center'})})()`);
  await p.tocar('[data-e2e]');
  f = await fin(); d = f.deudas.at(-1);
  falla(f.movimientos.length === movsAntes + 1 && d.saldo === 820000, 'el pago no bajó el saldo como debía (interés 20.000, abono 180.000): ' + d.saldo);
  await paso('deuda pagada');

  // ---------- Me deben ----------
  await abrir('prestamos', 'Te deben');
  await paso('me deben');
  const nPrest = (await fin()).prestamos.length;
  await tocarTexto('＋ Préstamo o pendiente');
  falla((await fin()).prestamos.length === nPrest + 1, 'no agregó el préstamo');
  await editarEn('Editar datos del préstamo', 'Quién o qué', 'Juan');
  await editarEn('Editar datos del préstamo', 'Te debe', '500000');
  await editarEn('Editar datos del préstamo', 'Interés % mensual', '5');
  await editarEn('Editar datos del préstamo', 'Día de cobro', '15');
  let pr = (await fin()).prestamos.at(-1);
  falla(pr.nombre === 'Juan' && pr.monto === 500000 && pr.tasa === 5 && pr.dia === 15, 'no guardó el préstamo: ' + JSON.stringify(pr));
  await paso('préstamo agregado');
  await a.escribir('[data-cobro]', '25000');
  await tocarTexto('Me pagó');
  f = await fin();
  falla(f.movimientos.some((m) => m.tipo === 'cobro' && m.prestamo === pr.id && m.monto === 25000), 'no registró el cobro');
  await a.escribir('[data-cobro]', '100000');
  await tocarTexto('Le presté más');
  pr = (await fin()).prestamos.at(-1);
  falla(pr.monto === 600000, 'prestar más no subió lo que debe: ' + pr.monto);
  await paso('cobrado y prestado más');
  await tocarTexto('✓ Ya me pagó todo');
  falla(!!(await fin()).prestamos.at(-1).saldado, 'no lo marcó saldado');
  await paso('saldado');
  await tocarTexto('Ya saldados', undefined, false);
  await tocarTexto('Reabrir');
  falla(!(await fin()).prestamos.at(-1).saldado, 'no lo reabrió');

  // ---------- Calcular ----------
  await abrir('calcular', 'Calculadora');
  await paso('calcular');
  for (const tecla of ['7', '×', '8']) await tocarTexto(tecla);
  falla((await a.texto()).includes('= 56'), 'no mostró el resultado mientras se escribe');
  await tocarTexto('=');
  falla(await a.valor('#calc-expr') === '56', 'el igual no dejó el resultado: ' + await a.valor('#calc-expr'));
  await escribirCampo('Valor', '200000');
  await escribirCampo('Total', '90000');
  await escribirCampo('Propina %', '10');
  await escribirCampo('Te prestan', '1000000');
  await paso('calcular con datos');
  await p.poner(await a.campo('La tasa es'), 'anual');
  await paso('tasa anual');
  await escribirCampo('Monto que sale de la cuenta', '500000');
  await paso('4x1000');
  // El resultado de la calculadora pasa como monto a Registrar
  await tocarTexto('➕ Registrar este valor como gasto o ingreso');
  falla(await a.valor('#fin-monto') === '56', 'no llevó el valor a Registrar: ' + await a.valor('#fin-monto'));
  await a.escribir('#fin-monto', '');
  // Al volver, la calculadora recuerda lo escrito
  await abrir('calcular', 'Calculadora');
  falla(await a.valor('#calc-expr') === '56' && (await a.valorCampo('Te prestan')).split('.').join('') === '1000000', 'la calculadora olvidó lo escrito: ' + await a.valor('#calc-expr') + ' / ' + await a.valorCampo('Te prestan'));

  // ---------- 72 h ----------
  await abrir('esperas', 'Regla de las 72 horas');
  await paso('72 h');
  const nEsperas = ((await fin()).esperas || []).length;
  await a.escribir('#espera-nombre', 'Audífonos');
  await a.escribir('#espera-monto', '300000');
  await a.escribir('#espera-motivo', 'los míos fallan');
  await tocarTexto('⏳ Empezar a esperar 72 h');
  f = await fin();
  let esp = f.esperas.at(-1);
  falla(f.esperas.length === nEsperas + 1 && esp.nombre === 'Audífonos' && esp.monto === 300000 && esp.motivo === 'los míos fallan' && esp.estado === 'esperando', 'no guardó la espera: ' + JSON.stringify(esp));
  // La app de antes dejaba lo escrito en el formulario; la de React lo vacía. Se vacía a mano para que el recorrido sirva en las dos
  { const quedo = []; for (const s of ['#espera-nombre', '#espera-monto', '#espera-motivo']) { const v = await a.valor(s); if (v) { quedo.push(s); await a.escribir(s, ''); } } console.log('formulario de 72 h después de agregar:', quedo.length ? 'quedó ' + quedo.join(', ') : 'vacío'); }
  await paso('esperando');
  await tocarTexto('🙅 Ya no lo quiero');
  falla((await fin()).esperas.at(-1).estado === 'descartado', 'no la descartó');
  await paso('descartada');
  await tocarTexto('📈 Inversión / negocio');
  await paso('inversión');
  await tocarTexto('⏳ Empezar a esperar 72 h');
  falla((await a.aviso()).includes('Escribe qué es y cuánto cuesta'), 'no avisó del formulario vacío');
  await tocarTexto('🛍️ Compra');

  // ---------- Plan B · Módulo 1 ----------
  const planB = async () => JSON.stringify((await fin()).planB || (await fin()).desempleo || await fin());
  const abrirSeccion = async (titulo, campo) => { try { await a.campo(campo); } catch (err) { await tocarTexto(titulo); } };
  await abrir('planb', 'Plan B: si te quedas sin empleo');
  await paso('plan b');
  await tocarTexto(EMOCIONES[0]);
  await escribirCampo('Hoy siento', 'me siento tranquilo');
  falla((await planB()).includes('me siento tranquilo') && (await planB()).includes(JSON.stringify(EMOCIONES[0]).slice(1, -1)), 'no guardó la emoción o lo que siento');
  await abrirSeccion('💼 Con qué plata cuentas', RECURSOS[0][1]);
  await escribirCampo(RECURSOS[0][1], '5000000');
  falla((await planB()).includes('5000000'), 'no guardó con qué plata cuento');
  await abrirSeccion('✏️ Ajustar los gastos a mano', 'Gastos esenciales');
  await escribirCampo('Gastos esenciales', '1500000');
  falla((await planB()).includes('1500000'), 'no guardó los gastos a mano');
  await paso('plata anotada');
  await tocarTexto('＋ Hoja de vida');
  await tocarTexto('＋ Hoja de vida');
  await tocarTexto('Quitar una hoja de vida');
  await tocarTexto('＋ Contacto');
  await tocarTexto(BLOQUES[0][1]);
  await tocarTexto(RED[0][1]);
  await abrirSeccion('🎯 Cambiar las metas', 'Hojas de vida por día');
  await escribirCampo('Hojas de vida por día', '3');
  await escribirCampo('💪 Mis fortalezas', 'Constancia');
  await escribirCampo('🙏 Hoy agradezco', 'la salud');
  const pb = await planB();
  falla(pb.includes('Constancia') && pb.includes('la salud') && pb.includes('"hojasDia":3') && pb.includes('"hojas":1') && pb.includes('"contactos":1'), 'no guardó contadores, metas o textos del plan B: ' + pb.slice(0, 400));
  await paso('plan b lleno');

  // ---------- Plan B · Módulo 2: liderazgo ----------
  await tocarTexto('🧭 Módulo 2 · Liderazgo emergente');
  await paso('liderazgo');
  for (let i = 0; i < CARACTERISTICAS.length; i++) {
    const nota = i < 3 ? 5 : i < 6 ? 2 : 4;
    await p.ev(`(()=>{document.querySelectorAll('[data-e2e]').forEach(x=>x.removeAttribute('data-e2e'));const g=[...document.querySelectorAll('#vista [role=group]')].filter(x=>(x.getAttribute('aria-label')||'').includes('calificación del 1 al 5'))[${i}];const b=[...g.querySelectorAll('button,[role=button]')].find(x=>x.textContent.trim()==='${nota}');b.setAttribute('data-e2e','1');b.scrollIntoView({block:'center'})})()`);
    await p.tocar('[data-e2e]');
  }
  falla((await planB()).includes('"' + CARACTERISTICAS[0][0] + '":5'), 'no guardó las calificaciones');
  await paso('autoevaluación completa');
  await tocarTexto('＋ Una acción por cada área de mejora');
  await escribirCampo('Acción concreta', 'Meditar 10 minutos');
  await escribirCampo('Recursos necesarios', 'una app');
  await tocarTexto(PLAZOS[1][1]);
  await tocarTexto('Hecha');
  let pl = await planB();
  falla(pl.includes('Meditar 10 minutos') && pl.includes('una app') && pl.includes('"hecho":true') && pl.includes('"plazo":' + PLAZOS[1][0]), 'no guardó la acción del plan: ' + pl.slice(-500));
  await tocarTexto('Borrar esta acción');
  falla(!(await planB()).includes('Meditar 10 minutos'), 'no borró la acción');
  await tocarTexto('Deshacer', '#toast button');
  falla((await planB()).includes('Meditar 10 minutos'), 'deshacer no devolvió la acción');
  await tocarTexto('＋ Acción');
  await escribirCampo('¿Qué aprendí sobre mí', 'Soy constante');
  falla((await planB()).includes('Soy constante'), 'no guardó la reflexión');
  await paso('plan de liderazgo');
  await tocarTexto('🛟 Módulo 1 · Afrontar el desempleo');
  falla((await a.texto()).includes('Plan B: si te quedas sin empleo'), 'no volvió al módulo 1');

  // Recargar: sigue todo y el enlace directo abre la pestaña
  await p.recargar();
  await abrir('resumen', 'Patrimonio neto');
  await paso('resumen al final');
  await p.foto('finanzas-resumen-pc');

  await p.celular();
  for (const [pestana, titulo] of [['registrar', 'Guardar gasto'], ['mes', 'Por categoría'], ['resumen', 'Patrimonio neto'], ['presupuesto', 'Cómo repartir'], ['fijos', 'Ingresos de cada mes'], ['ahorro', 'Aportar'], ['deudas', 'Lo que debes'], ['prestamos', 'Te deben'], ['calcular', 'Calculadora'], ['esperas', 'Regla de las 72 horas'], ['planb', 'Plan B: si te quedas sin empleo']]) {
    await abrir(pestana, titulo);
    falla(await p.sinDesborde(), pestana + ' se desborda en el celular');
    await p.foto('finanzas-' + pestana + '-cel');
  }
  // Pasar a otro módulo de Plan B (el recorrido de los módulos 3, 4 y 5 está en planb.mjs) y a otra pestaña
  await tocarTexto('🛟 Plan B');
  await tocarTexto('💡 Módulo 3 · Despertar creativo');
  falla(!(await a.texto()).includes('Plan B: si te quedas sin empleo'), 'no abrió el módulo 3');
  await tocarTexto('🛟 Módulo 1 · Afrontar el desempleo');
  await tocarTexto('🐷 Ahorro');
  falla((await a.texto()).includes('Aportar'), 'no volvió a Ahorro');
  await p.computador();
  console.log('✓ Finanzas');
};
