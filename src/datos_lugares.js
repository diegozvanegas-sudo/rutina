// Lista inicial de 🗺️ Lugares: todos en "quiero ir", para marcar los que ya se conocen. Se copia una vez al estado y después se edita.
// Coordenadas aproximadas del sitio o del casco urbano; horas: viaje aproximado por carretera desde Medellín.
export const TIPOS_LUGAR = {
  pueblo: '🏘️ Pueblo', ciudad: '🏙️ Ciudad', naturaleza: '🌿 Naturaleza', playa: '🏖️ Playa', agua: '💧 Cascada o río', mirador: '⛰️ Mirador',
  comida: '🍽️ Comida', historia: '🏛️ Historia', aventura: '🧗 Deporte o aventura',
};

// [id, nombre, id de la pieza, tipo, emoji, lat, lon, horas, prioridad (1 alta a 3 baja)]
const A = [
  ['penol', 'Piedra del Peñol', '05321', 'mirador', '🪨', 6.2208, -75.1792, 2, 1],
  ['guatape', 'Guatapé y sus zócalos', '05321', 'pueblo', '🎨', 6.2339, -75.1586, 2, 1],
  ['jardin', 'Jardín', '05364', 'pueblo', '🌺', 5.5986, -75.8197, 3.5, 1],
  ['esplendor', 'Cueva del Esplendor', '05364', 'agua', '💧', 5.5400, -75.8300, 4, 2],
  ['jerico', 'Jericó', '05368', 'pueblo', '⛪', 5.7917, -75.7856, 3.5, 1],
  ['tamesis', 'Támesis', '05789', 'pueblo', '🌄', 5.6647, -75.7150, 3.5, 2],
  ['andes', 'Andes', '05034', 'pueblo', '☕', 5.6569, -75.8789, 3.5, 3],
  ['bolivar', 'Ciudad Bolívar', '05101', 'pueblo', '☕', 5.8539, -76.0225, 3, 3],
  ['tusa', 'Cerro Tusa', '05861', 'mirador', '🔺', 5.9700, -75.7300, 2.5, 2],
  ['fredonia', 'Fredonia', '05282', 'pueblo', '🏘️', 5.9261, -75.6747, 1.5, 3],
  ['titiribi', 'Titiribí', '05809', 'pueblo', '⛏️', 6.0636, -75.7931, 1.5, 3],
  ['santafe', 'Santa Fe de Antioquia', '05042', 'historia', '🏛️', 6.5567, -75.8275, 1.5, 1],
  ['occidente', 'Puente de Occidente', '05501', 'historia', '🌉', 6.5960, -75.8020, 1.5, 1],
  ['sopetran', 'Sopetrán', '05761', 'pueblo', '🥭', 6.5017, -75.7425, 1.5, 3],
  ['jeronimo', 'San Jerónimo', '05656', 'pueblo', '🏊', 6.4425, -75.7272, 1, 3],
  ['urrao', 'Urrao', '05847', 'naturaleza', '🏔️', 6.3172, -76.1339, 4, 2],
  ['arvi', 'Parque Arví', '05001', 'naturaleza', '🌲', 6.2753, -75.5017, 1, 2],
  ['comuna13', 'Comuna 13', '05001', 'ciudad', '🎭', 6.2553, -75.6178, 0.5, 2],
  ['nutibara', 'Pueblito Paisa', '05001', 'mirador', '🏘️', 6.2356, -75.5797, 0.5, 3],
  ['botanico', 'Jardín Botánico de Medellín', '05001', 'naturaleza', '🌳', 6.2711, -75.5644, 0.5, 3],
  ['claro', 'Río Claro', '05652', 'agua', '🏞️', 5.9000, -74.8600, 3, 1],
  ['napoles', 'Hacienda Nápoles', '05591', 'aventura', '🦛', 5.9117, -74.7325, 3.5, 2],
  ['cocorna', 'Cocorná', '05197', 'agua', '💦', 6.0575, -75.1867, 2, 2],
  ['rafael', 'San Rafael', '05667', 'agua', '🏊', 6.2947, -75.0283, 3, 2],
  ['carlos', 'San Carlos', '05649', 'agua', '🌊', 6.1875, -74.9958, 3.5, 2],
  ['alejandria', 'Alejandría', '05021', 'pueblo', '🏘️', 6.3761, -75.1408, 2.5, 3],
  ['sonson', 'Sonsón', '05756', 'pueblo', '🏔️', 5.7114, -75.3094, 3, 2],
  ['abejorral', 'Abejorral', '05002', 'pueblo', '🏘️', 5.7908, -75.4281, 2.5, 3],
  ['carmen', 'El Carmen de Viboral', '05148', 'comida', '🏺', 6.0828, -75.3369, 1.5, 2],
  ['retiro', 'El Retiro', '05607', 'pueblo', '🌲', 6.0594, -75.5017, 1, 3],
  ['rionegro', 'Rionegro histórico', '05615', 'historia', '🏛️', 6.1550, -75.3742, 1, 3],
  ['marinilla', 'Marinilla', '05440', 'pueblo', '🎸', 6.1739, -75.3350, 1.5, 3],
  ['barbosa', 'Barbosa', '05079', 'agua', '🍍', 6.4392, -75.3317, 1, 3],
  ['belmira', 'Belmira', '05086', 'naturaleza', '🌫️', 6.6056, -75.6667, 2, 2],
  ['santarosa', 'Santa Rosa de Osos', '05686', 'pueblo', '⛪', 6.6461, -75.4606, 1.5, 3],
  ['yarumal', 'Yarumal', '05887', 'pueblo', '🌳', 6.9631, -75.4175, 3, 3],
  ['necocli', 'Necoclí', '05490', 'playa', '🏖️', 8.4261, -76.7839, 8, 2],
  ['arboletes', 'Volcán de lodo de Arboletes', '05051', 'playa', '🌋', 8.8560, -76.4260, 9, 2],
  ['sanjuan', 'San Juan de Urabá', '05659', 'playa', '🏖️', 8.7594, -76.5286, 9, 3],
  ['turbo', 'Turbo', '05837', 'ciudad', '⛴️', 8.0950, -76.7286, 7.5, 3],
];

export const LUGARES_INICIALES = () => A.map(([id, nombre, pieza, tipo, emoji, lat, lon, horas, prioridad]) => ({
  id: 'ini-' + id, nombre, pais: 'Colombia', region: 'Antioquia', municipio: '', mapa: 'antioquia', pieza, tipo, emoji, lat, lon,
  estado: 'quiero', prioridad, epoca: '', horas, presupuesto: 0, visitas: [],
}));
