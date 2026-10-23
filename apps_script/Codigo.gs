/**
 * Recibe los datos de la app "Rutina" y los escribe en esta hoja de Google.
 *
 * Gym  → pestaña "Rutina 2.0": peso y reps en la columna "Sem N" (fila 4), igual que a mano.
 *        Cada día se busca por su nombre ("DÍA 3 · EMPUJE + BÍCEPS" ↔ "Empuje + Bíceps"); si no aparece, por su posición.
 *        Las filas se buscan por orden dentro de cada bloque (DÍA 1 … DÍA 5 y CORE): solo cuentan
 *        las filas de tipo "Top set", "Back-off" o "Series". Lo que la app tenga vacío no borra la hoja.
 * Días → pestaña "Diario App" (se crea sola): una fila por fecha con hábitos y metas.
 *
 * Instalación: Extensiones > Apps Script > pegar este archivo > cambiar CLAVE >
 * Implementar > Nueva implementación > Aplicación web > Ejecutar como: yo · Acceso: cualquier usuario.
 * La URL que entrega y la CLAVE van en la app: Ajustes > Google Sheets.
 */
const CLAVE = 'CAMBIA-ESTA-CLAVE';
const PESTANA_GYM = 'Rutina 2.0';
const PESTANA_DIAS = 'Diario App';
const TIPOS = ['Top set', 'Back-off', 'Series'];

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    if (datos.clave !== CLAVE) return salida({ ok: false, mensaje: 'Clave incorrecta' });
    const candado = LockService.getScriptLock();
    candado.waitLock(20000);
    try {
      const partes = [];
      if (datos.gym) partes.push(escribirGym(datos.gym));
      if (datos.dias && datos.dias.length) partes.push(escribirDias(datos.dias));
      return salida({ ok: true, mensaje: partes.join(' · ') || 'Nada que escribir' });
    } finally {
      candado.releaseLock();
    }
  } catch (err) {
    return salida({ ok: false, mensaje: String(err && err.message || err) });
  }
}

// Para probar que la implementación responde (abrir la URL en el navegador)
function doGet() {
  return salida({ ok: true, mensaje: 'Rutina: Apps Script activo' });
}

function salida(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function escribirGym(gym) {
  const hoja = SpreadsheetApp.getActive().getSheetByName(PESTANA_GYM);
  if (!hoja) throw new Error('No existe la pestaña "' + PESTANA_GYM + '"');
  const valores = hoja.getDataRange().getDisplayValues();

  // Columna de la semana: "Sem 2 · 19 oct" en la fila 4
  const patron = new RegExp('^Sem\\s*' + gym.semana + '(\\D|$)');
  const col = valores[3].findIndex(function (v) { return patron.test(String(v).trim()); });
  if (col < 0) throw new Error('No encontré "Sem ' + gym.semana + '" en la fila 4 de ' + PESTANA_GYM + '. Agrega la columna de esa semana.');

  // Bloques de la hoja en orden, con sus filas de series
  const bloques = [];
  let actual = null;
  for (let i = 5; i < valores.length; i++) {
    const a = String(valores[i][0]).trim();
    if (/^SERIES SEMANALES/i.test(a)) break;
    if (/^D[IÍ]A\s+\d+/i.test(a) || /^CORE/i.test(a)) { actual = { titulo: a, core: /^CORE/i.test(a), filas: [] }; bloques.push(actual); continue; }
    if (actual && TIPOS.indexOf(String(valores[i][2]).trim()) >= 0) actual.filas.push(i + 1);
  }
  const dias = bloques.filter(function (b) { return !b.core; }), core = bloques.filter(function (b) { return b.core; })[0];

  let escritas = 0;
  const avisos = [];
  const escribirBloque = function (deApp, deHoja) {
    if (!deApp || !deHoja) return;
    if (deApp.filas.length !== deHoja.filas.length) avisos.push(deHoja.titulo + ': la app tiene ' + deApp.filas.length + ' filas y la hoja ' + deHoja.filas.length);
    deApp.filas.forEach(function (f, k) {
      const fila = deHoja.filas[k];
      if (!fila || (!f.peso && !f.reps)) return;
      if (f.peso) {
        const celda = hoja.getRange(fila, col + 1);
        if (/^\d+([.,]\d+)?$/.test(f.peso)) celda.setValue(Number(String(f.peso).replace(',', '.')));
        else celda.setNumberFormat('@').setValue(f.peso);
      }
      // Reps siempre como texto ("10 · 9 · 8"), nunca fecha
      if (f.reps) hoja.getRange(fila, col + 2).setNumberFormat('@').setValue(f.reps);
      escritas++;
    });
  };
  const plano = function (s) { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, ''); };
  gym.bloques.forEach(function (b, k) {
    const porNombre = dias.filter(function (d) { return plano(d.titulo.split('·').slice(1).join('·')) === plano(b.nombre); })[0];
    escribirBloque(b, porNombre || dias[k]);
  });
  escribirBloque(gym.core, core);
  return 'Semana ' + gym.semana + ': ' + escritas + ' filas' + (avisos.length ? ' (revisar: ' + avisos.join('; ') + ')' : '');
}

function escribirDias(dias) {
  const libro = SpreadsheetApp.getActive();
  const hoja = libro.getSheetByName(PESTANA_DIAS) || libro.insertSheet(PESTANA_DIAS);
  const encabezado = ['Fecha'].concat(dias[0].habitos.map(function (h) { return h[0]; }),
    ['Gratitud', 'Agua (ml)', 'Pasos', 'Calorías', 'Lectura (min)', 'Metas %']);
  hoja.getRange(1, 1, 1, encabezado.length).setValues([encabezado]).setFontWeight('bold');
  hoja.setFrozenRows(1);

  const fechas = hoja.getLastRow() > 1 ? hoja.getRange(2, 1, hoja.getLastRow() - 1, 1).getDisplayValues().map(function (r) { return r[0]; }) : [];
  dias.forEach(function (d) {
    const fila = [d.fecha].concat(d.habitos.map(function (h) { return h[1]; }), [d.gratitud, d.agua, d.pasos, d.calorias, d.lectura, d.metas]);
    let n = fechas.indexOf(d.fecha);
    if (n < 0) { fechas.push(d.fecha); n = fechas.length - 1; }
    const rango = hoja.getRange(n + 2, 1, 1, fila.length);
    // Fecha, horas de los hábitos y gratitud como texto (que no se vuelvan fecha u hora de Sheets)
    hoja.getRange(n + 2, 1, 1, d.habitos.length + 2).setNumberFormat('@');
    rango.setValues([fila]);
  });
  return 'Diario: ' + dias.length + ' día(s)';
}
