// Datos traídos de la hoja "Rutina Gym" → pestaña "Rutina 2.0" (22 oct 2026):
// último registro, descanso de cada fila, notas y lo anotado en la semana 1. Reps con espacios en vez de "·".
// Por fila: [peso, unidad, reps, descanso (s), peso semana 1, reps semana 1]

export const HOJA = {
  'd1-1': { nota: 'Revisar: en la última semana se anotó "38kg" en Reps', filas: [['50', 'kg', '', 180, '50', ''], ['46', 'kg', '', 180]] },
  'd1-2': { filas: [['90', 'kg', '6', 240], ['3.5', 'discos', '10 9', 180]] },
  'd1-3': { filas: [['120', 'kg', '10', 180], ['107', 'kg', '10', 180]] },
  'd1-4': { filas: [['100', 'kg', '8 9 7', 180]] },
  'd1-5': { nota: 'Drop set con 3 pesos', filas: [['91 59 72', 'kg', '13', 90]] },
  'd1-6': { filas: [['91', 'kg', '9', 120], ['84', 'kg', '12 12', 120]] },
  'd1-7': { nota: 'Luego 66 kg × 4 y 50 kg × 10', filas: [['73', 'kg', '', 120]] },
  'd1-8': { filas: [['50', 'kg', '13 11 9', 120]] },

  'd2-1': { filas: [['134', 'kg', '5 6 6 5']] },
  'd2-2': { filas: [['91', 'kg', '12 12', 120], ['93', 'kg', '11 10', 120]] },
  'd2-3': { filas: [['100', 'kg', '7 7', 240], ['100', 'kg', '9', 240]] },
  'd2-4': { filas: [['5', 'discos', '7', 180], ['4', 'discos', '12', 180]] },
  'd2-5': { filas: [['91', 'kg', '10', 180], ['86', 'kg', '9', 120]] },
  'd2-6': { filas: [['91', 'kg', '12 10 10 10', 180]] },
  'd2-7': { filas: [['72', 'kg', '8', 120], ['66', 'kg', '10 9 8', 120]] },

  'd3-1': { nota: 'Última vez se anotó "máquina"', filas: [['100', 'kg', '12 10 9', 180, '100', '10'], ['95', 'kg', '8 8', 180, '100', '10 10']] },
  'd3-2': { filas: [['50', 'kg', '6 6 6', 180, '50', '5 5 5']] },
  'd3-3': { filas: [['91', 'kg', '12 11 10', 90, '91', '12 11 10 10']] },
  'd3-4': { filas: [['113', 'kg', '8', 180, '113', '9'], ['100', 'kg', '9 9', 180, '100', '12 12']] },
  'd3-5': { filas: [['14', 'kg', '15 12 10', 90]] },
  'd3-6': { nota: 'Movido desde el día de tirón', filas: [['64', 'kg', '4', 120, '57', '9'], ['50', 'kg', '10 8', 120, '57', '']] },
  'd3-7': { nota: 'Movido desde el día de tirón', filas: [['30', 'kg', '10 10 10', 120, '30', '12'], ['23', 'kg', '12', 120, '30', '12 11']] },
  'd3-8': { nota: 'Movido desde el día de tirón', filas: [['24', 'kg', '9', 120, '24', '7'], ['22', 'kg', '9 9', 120, '20', '10 10']] },

  'd5-1': { filas: [['91', 'kg', '10 9 9', 180, '107', '9'], ['91', 'kg', '9 8', 180, '93', '9 9']] },
  'd5-2': { filas: [['3.5', 'discos', '10 10 10', 180, '3.5', '10'], ['3.5', 'discos', '8 8', 180, '3.5', '9 9']] },
  'd5-3': { filas: [['77', 'kg', '8', 90], ['59', 'kg', '10 10 10', 90, '', '12 11 10']] },
  'd5-4': { filas: [['91', 'kg', '12 11 10', 180, '91', '12 11 10']] },
  'd5-5': { filas: [['73', 'kg', '9 9', 180]] },
  'd5-6': { filas: [['54', 'kg', '', 90]] },
  'd5-7': { nota: 'Movido desde el día de empuje', filas: [['91', 'kg', '10 10 10', 120, '91', '11'], ['77', 'kg', '', 120, '91', '10 9']] },
  'd5-8': { nota: 'Movido desde el día de empuje', filas: [['59', 'kg', '', 120, '57', '10'], ['50', 'kg', '12 12 12', 120, '57', '10']] },

  'd6-1': { filas: [['', '', '', 90]] },
  'd6-2': { filas: [['100', 'kg', '8 8 7', 120], ['93', 'kg', '9 8', 120]] },
  'd6-3': { filas: [['140', 'kg', '7', 180], ['120', 'kg', '9 9', 180]] },
  'd6-4': { filas: [['59', 'kg', '', 120], ['59', 'kg', '', 120]] },
  'd6-5': { filas: [['4', 'discos', '8 8 8 8', 180]] },
  'd6-6': { filas: [['6', 'discos', '10 8 8', 180], ['4', 'discos', '12', 180]] },
  'd6-7': { filas: [['77', 'kg', '', 120], ['77', 'kg', '', 120]] },
  'd6-8': { filas: [['91', 'kg', '', 120]] },
};

// Pasa los datos de la hoja a la rutina (último registro, descansos, notas) y a la semana 1, sin pisar lo que ya exista
export function aplicarHoja(estado) {
  const sem1 = (estado.semanas[1] ??= {});
  for (const d of estado.rutina) {
    for (const ej of d.ejercicios) {
      const h = HOJA[ej.id];
      if (!h) continue;
      if (h.nota && !ej.nota) ej.nota = h.nota;
      ej.filas.forEach((f, i) => {
        const [peso, unidad, reps, descanso, p1, r1] = h.filas[i] || [];
        if (peso || reps) f.ultimo ??= { peso, unidad: unidad || 'kg', reps };
        if (descanso) f.descanso = descanso;
        if ((p1 || r1) && !sem1[f.id]) sem1[f.id] = { peso: p1 || '', unidad: unidad || 'kg', reps: r1 || '' };
      });
    }
  }
}
