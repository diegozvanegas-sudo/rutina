// Alimentos con marca, copiados de la tabla nutricional de su empaque (Colombia). Valores por 100 g, como los de USDA
// (src/datos_equivalencias.js), para que salgan en 🔄 Equivalencias y se puedan pasar a 🥚 Alimentos.
// Para agregar uno: copia la columna «Por 100 g» tal cual. unidadG: lo que pesa una unidad (la porción de la etiqueta).
// Opcionales (salen en la ficha 📋, src/etiqueta-info.js): sodio (mg), azucares, azucaresAnadidos, grasaSat, grasaTrans (g),
// ingredientes, preparacion, conservacion
export const ALIMENTOS_ETIQUETA = [
  { id: 'arepa-el-carbon', nombre: 'Arepa El Carbón (tela blanca)', categoria: 'cereales', estado: 'lista', kcal: 152, p: 2.5, c: 40, g: 0.2, fibra: 4,
    sodio: 7.4, azucares: 2.1, azucaresAnadidos: 0, grasaSat: 0, grasaTrans: 0,
    marca: 'Alimentos La Abundancia', unidadG: 88, empaque: '5 unidades · 440 g',
    etiqueta: '1 unidad = 88 g · 134 kcal · 35 g carbos · 2,2 g proteína · sin azúcar añadida · sodio 6,5 mg',
    ingredientes: 'Maíz precocido y conservantes (ácido sórbico, propionato de calcio)',
    preparacion: 'En la parrilla a 250 °C, 2 a 3 minutos por cada lado, hasta que esté asada a tu gusto',
    conservacion: 'Refrigerada, entre 0 °C y 4 °C' },
];
