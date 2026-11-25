// 🏠 Hoy en "lo de ahora": de todas las tarjetas, se ven solo las que tocan a esta hora; lo ya hecho queda en una línea
// "✓" y el resto detrás de "Ver todo el día" (config.hoyTodo = true muestra todo, como antes). Sin pantalla ni estado:
// recibe la hora y lo hecho, para poder probarlo.

// 'ahora' (se ve), 'hecho' (una ficha ✓) o 'luego' (detrás de Ver todo el día).
// c = { hora, dia (0 domingo … 6 sábado), hecho: { k: true }, gymHoy (toca gym o fútbol hoy),
//       invita: { k: true } (la tarjeta solo invita a empezar algo: sin experimento, sin reto, sin suplementos) }
export function momento(k, c) {
  if (c.hecho && c.hecho[k]) return 'hecho';
  if (c.invita && c.invita[k]) return 'luego';
  const h = c.hora, semana = c.dia >= 1 && c.dia <= 5;
  switch (k) {
    // Lo que manda en el día: siempre a la vista mientras falte
    case 'control': case 'revision': case 'entrenador': case 'experimento': case 'retos': case 'suplementos': case 'cierre': return 'ahora';
    case 'manana': return h < 13 ? 'ahora' : 'luego';
    case 'suenoPeso': return h < 11 ? 'ahora' : 'luego';
    case 'gym': return c.gymHoy ? 'ahora' : 'luego';
    case 'foco': case 'estudio': return h >= 6 && h < 19 ? 'ahora' : 'luego';
    case 'trabajo': return semana && h >= 8 && h < 18 ? 'ahora' : 'luego';
    case 'animo': return h >= 18 ? 'ahora' : 'luego';
    // De consulta (las fichas de arriba y el Control ya dicen cómo van)
    case 'metas': case 'dieta': case 'estandares': case 'semana': case 'plata': return 'luego';
    // Una tarjeta nueva que esta lista no conoce se ve, para que nadie la pierda
    default: return 'ahora';
  }
}

// Reparte los ids en los tres grupos, en el orden del usuario
export function repartirAhora(ids, c) {
  const r = { ahora: [], hecho: [], luego: [] };
  for (const k of ids) r[momento(k, c)].push(k);
  return r;
}
