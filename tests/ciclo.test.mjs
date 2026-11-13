import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RUTINA } from '../src/datos_iniciales.js';
import { nuevoCiclo, semanasCiclo } from '../src/clientes.js';
import { TIPOS_CICLO, fasesDeTipo, volumenFase, rirSemana, colorFase, semanasCarga, supercompensacion, volumenMusculos, seriesRutina, minutosDia, tiempoCliente, senalesSobrecarga } from '../src/ciclo.js';

test('ciclo: todos los tipos duran 12 semanas y tienen al menos una descarga', () => {
  for (const [id, t] of Object.entries(TIPOS_CICLO)) {
    const fases = fasesDeTipo(id);
    assert.equal(semanasCiclo({ fases }), 12, id);
    assert.ok(fases.some((f) => /descarga/i.test(f.nombre)), id);
    assert.equal(new Set(fases.map((f) => f.id)).size, fases.length, id + ': ids únicos');
    assert.ok(t.nombre && t.corto);
  }
});

test('ciclo: volumen y RIR de los ciclos de antes (sin volumen) y de los nuevos', () => {
  const viejo = nuevoCiclo('2026-11-16');
  assert.deepEqual(viejo.fases.map(volumenFase), [100, 100, 50, 90]);
  assert.equal(volumenFase({ nombre: 'X', volumen: 115 }), 115);
  // "2-1" en 4 semanas: de 2 a 1
  const f = { nombre: 'Progresión', semanas: 4, rir: '2-1' };
  assert.deepEqual([1, 2, 3, 4].map((i) => rirSemana(f, i)), [2, 1.7, 1.3, 1]);
  assert.equal(rirSemana({ nombre: 'Descarga', semanas: 1, rir: '3-4' }, 1), 4);
  assert.equal(rirSemana({ nombre: 'Base', semanas: 1, rir: '' }, 1), 2);
});

test('ciclo: la descarga siempre morada y las demás no repiten color seguido', () => {
  const fases = fasesDeTipo('hipertrofia');
  assert.deepEqual(fases.map((_, k) => colorFase(fases, k)), [0, 1, 2, 3, 2]);
});

test('ciclo: en la descarga baja la fatiga y sube el rendimiento (supercompensación)', () => {
  for (const id of Object.keys(TIPOS_CICLO)) {
    const sem = semanasCarga({ inicio: '2026-11-16', fases: fasesDeTipo(id) }, 60, '2026-11-20');
    assert.equal(sem.length, 12);
    assert.equal(sem[0].actual, true);
    const i = sem.findIndex((w) => w.descarga);
    assert.ok(sem[i].fatiga < sem[i - 1].fatiga, id + ': fatiga baja');
    assert.ok(sem[i].rendimiento > sem[i - 1].rendimiento, id + ': rendimiento sube');
    assert.equal(sem[i].series, 30); // la mitad de 60
    assert.ok(supercompensacion(sem).n > 1);
  }
});

test('ciclo: series por músculo y minutos de cada día', () => {
  const r = JSON.parse(JSON.stringify(RUTINA));
  const m = volumenMusculos(r);
  assert.ok(m.length > 3);
  assert.equal(m.reduce((s, x) => s + x.series, 0), seriesRutina(r));
  assert.ok(m.every((x) => ['bajo', 'ok', 'alto'].includes(x.estado)));
  // Un día de 2 ejercicios de 3 series con 2 min de descanso: 8 + 6 × (40 + 120) s = 24 min
  const dia = { ejercicios: [0, 1].map(() => ({ musculo: 'Pecho', filas: [{ series: 3, descanso: 120 }] })) };
  assert.equal(minutosDia(dia), 24);
  dia.ejercicios[0].biserie = true; // en biserie el descanso se comparte
  assert.equal(minutosDia(dia), 18); // 8 + 6 × 40 s + 6 × 60 s
  const t = tiempoCliente({ rutina: [dia, dia], tiempo: { dias: 4, minutos: 12 } }); // 18 min no caben en 12 (+5 de margen)
  assert.equal(t.largo.length, 2);
  assert.match(t.division, /Torso/);
  assert.equal(t.sobranDias, false);
});

test('ciclo: señales de sobrecarga en los check-ins', () => {
  assert.deepEqual(senalesSobrecarga({}), []);
  const s = senalesSobrecarga({ checkins: [{ fecha: '2026-11-01', sueno: 2, energia: 5 }, { fecha: '2026-11-08', sueno: 2, energia: 2, nota: 'me duele la rodilla' }] });
  assert.equal(s.length, 4);
  assert.match(s[0], /dos semanas seguidas/);
  assert.equal(senalesSobrecarga({ checkins: [{ fecha: '2026-11-08', sueno: 4, energia: 4 }] }).length, 0);
});
