// Dieta de partida: los tres planes de la hoja (entreno inferior, entreno superior, descanso) con 87 kg, más el día de fútbol.
// Cada alimento guarda sus valores por 100 g (o por unidad) para poder recalcular cualquier cantidad.

// grupo: proteina | carbo | grasa | verdura | otro  →  al recalcular, la proteína sigue al peso y los carbos ajustan las calorías
// por: 'g' (valores por 100 g) · 'u' (por unidad) · 'libre' (cantidad fija, valores ya totales). paso: cómo se redondea al recalcular
export const ALIMENTOS = [
  { id: 'huevo', nombre: 'Huevos enteros', por: 'u', p: 6, g: 5, c: 0, kcal: 75, grupo: 'proteina' },
  { id: 'avena', nombre: 'Avena', por: 'g', p: 10, g: 6, c: 67, kcal: 376, grupo: 'carbo' },
  { id: 'cafe', nombre: 'Café', por: 'u', p: 0, g: 0, c: 0, kcal: 0, grupo: 'otro' },
  { id: 'arroz', nombre: 'Arroz (cocido)', por: 'g', p: 2.5, g: 0.5, c: 26, kcal: 120, grupo: 'carbo' },
  { id: 'carne', nombre: 'Carne magra', por: 'g', p: 24.4, g: 3.3, c: 0, kcal: 189, grupo: 'proteina' },
  { id: 'ensalada', nombre: 'Ensalada', por: 'libre', p: 1, g: 0, c: 5, kcal: 25, grupo: 'verdura' },
  { id: 'proteina', nombre: 'Proteína (scoop)', por: 'u', p: 25, g: 2, c: 3, kcal: 130, grupo: 'proteina', paso: 0.5 },
  { id: 'platano', nombre: 'Plátano', por: 'u', p: 1, g: 0, c: 25, kcal: 100, grupo: 'carbo', paso: 0.5 },
  { id: 'pollo', nombre: 'Pollo', por: 'g', p: 26, g: 3, c: 0, kcal: 140, grupo: 'proteina' },
  { id: 'verdura', nombre: 'Verdura', por: 'g', p: 2.5, g: 0, c: 3.5, kcal: 25, grupo: 'verdura' },
  { id: 'almendras', nombre: 'Almendras', por: 'g', p: 20, g: 50, c: 10, kcal: 600, grupo: 'grasa' },
];

const it = (alimento, cant) => ({ alimento, cant });
export const PLANES = {
  inferior: {
    nombre: 'Entreno inferior', detalle: 'Pierna · carbos altos', comidas: [
      { nombre: 'Desayuno', items: [it('huevo', 6), it('avena', 70), it('cafe', 1)] },
      { nombre: 'Almuerzo', items: [it('arroz', 250), it('carne', 180), it('ensalada', 1)] },
      { nombre: 'Pre-entreno', items: [it('proteina', 1), it('avena', 50), it('platano', 1)] },
      { nombre: 'Cena', items: [it('pollo', 200), it('arroz', 200), it('verdura', 200), it('almendras', 10)] },
    ],
  },
  superior: {
    nombre: 'Entreno superior', detalle: 'Torso, empuje o tirón · carbos moderados', comidas: [
      { nombre: 'Desayuno', items: [it('huevo', 6), it('avena', 70), it('cafe', 1)] },
      { nombre: 'Almuerzo', items: [it('arroz', 200), it('carne', 180), it('ensalada', 1)] },
      { nombre: 'Pre-entreno', items: [it('proteina', 1), it('platano', 1)] },
      { nombre: 'Cena', items: [it('pollo', 200), it('arroz', 150), it('verdura', 200), it('almendras', 10)] },
    ],
  },
  // Partido de noche: carbos altos repartidos en el día, comida baja en grasa y fibra 2-3 h antes y cena de recuperación
  futbol: {
    nombre: 'Fútbol', detalle: 'Partido en la noche · carbos altos', comidas: [
      { nombre: 'Desayuno', items: [it('huevo', 6), it('avena', 70), it('cafe', 1)] },
      { nombre: 'Almuerzo', items: [it('arroz', 250), it('carne', 180), it('ensalada', 1)] },
      { nombre: 'Pre-partido (2-3 h antes)', items: [it('arroz', 150), it('pollo', 120), it('platano', 1)] },
      { nombre: 'Antes de jugar (1 h)', items: [it('platano', 1)] },
      { nombre: 'Cena post-partido', items: [it('pollo', 180), it('arroz', 200), it('verdura', 150)] },
    ],
  },
  descanso: {
    nombre: 'Descanso', detalle: 'Carbos bajos, más grasa', comidas: [
      { nombre: 'Desayuno', items: [it('huevo', 6), it('almendras', 15), it('cafe', 1)] },
      { nombre: 'Almuerzo', items: [it('carne', 180), it('arroz', 100), it('verdura', 200), it('ensalada', 1)] },
      { nombre: 'Merienda', items: [it('proteina', 1), it('platano', 1)] },
      { nombre: 'Cena', items: [it('pollo', 200), it('verdura', 200), it('avena', 40)] },
    ],
  },
};

// pesoInicio: desde dónde se mide el avance · pesoBase: peso con el que están calculados los planes (cambia al recalcular).
// kcalKg y protKg salen de los planes con 87 kg (2.426 / 2.119 / 1.785 kcal; en la hoja el total de descanso decía ~1.985,
// pero sus filas suman 1.785): al cambiar el peso, cada plan se recalcula con estos factores.
export const CONFIG_DIETA = {
  pesoInicio: 87, pesoBase: 87, meta: 76, estatura: 168,
  kcalKg: { inferior: 27.9, superior: 24.4, descanso: 20.5, futbol: 28.2 },
  protKg: { inferior: 2.17, superior: 2.1, descanso: 2.06, futbol: 2.14 },
};
