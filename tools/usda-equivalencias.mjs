// Genera src/datos_equivalencias.js con los valores por 100 g de USDA FoodData Central (SR Legacy, abril 2018), sin escribir
// ningún número a mano: cada alimento sale de su fdc_id en el archivo oficial.
//   1. Baja https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_csv_2018-04.zip y descomprímelo.
//   2. node tools/usda-equivalencias.mjs <carpeta con food.csv y food_nutrient.csv>
// Para agregar un alimento: búscalo en food.csv, pon su fila en LISTA y vuelve a correr esto.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// [fdc_id, id, nombre en español, categoría, estado]
const LISTA = [
  // 🍚 Cereales, harinas y panes
  [169756, 'arroz-crudo', 'Arroz blanco', 'cereales', 'crudo'],
  [169757, 'arroz-cocido', 'Arroz blanco', 'cereales', 'cocido'],
  [169703, 'arroz-integral-crudo', 'Arroz integral', 'cereales', 'crudo'],
  [169704, 'arroz-integral-cocido', 'Arroz integral', 'cereales', 'cocido'],
  [173904, 'avena-cruda', 'Avena en hojuelas', 'cereales', 'cruda'],
  [173905, 'avena-cocida', 'Avena en hojuelas', 'cereales', 'cocida en agua'],
  [169736, 'pasta-cruda', 'Pasta', 'cereales', 'cruda'],
  [169737, 'pasta-cocida', 'Pasta', 'cereales', 'cocida'],
  [168874, 'quinua-cruda', 'Quinua', 'cereales', 'cruda'],
  [168917, 'quinua-cocida', 'Quinua', 'cereales', 'cocida'],
  [169696, 'harina-maiz', 'Harina de maíz (masa)', 'cereales', 'seca'],
  [168070, 'arepa', 'Arepa de maíz', 'cereales', 'lista'],
  [175036, 'tortilla-maiz', 'Tortilla de maíz', 'cereales', 'lista'],
  [173242, 'tortilla-harina', 'Tortilla de harina de trigo', 'cereales', 'lista'],
  [174924, 'pan-blanco', 'Pan blanco', 'cereales', 'horneado'],
  [172688, 'pan-integral', 'Pan integral', 'cereales', 'horneado'],
  [172793, 'pan-rollo', 'Pan de mesa (rollito)', 'cereales', 'horneado'],
  [172746, 'galletas-soda', 'Galletas de soda', 'cereales', 'horneado'],
  [170250, 'galletas-arroz', 'Galletas de arroz', 'cereales', 'listas'],
  [171646, 'granola', 'Granola casera', 'cereales', 'horneada'],
  [169998, 'mazorca-cruda', 'Maíz tierno (mazorca)', 'cereales', 'crudo'],
  [169999, 'mazorca-cocida', 'Maíz tierno (mazorca)', 'cereales', 'cocido'],
  // 🥔 Tubérculos y plátano
  [170026, 'papa-cruda', 'Papa con cáscara', 'tuberculos', 'cruda'],
  [170438, 'papa-cocida', 'Papa', 'tuberculos', 'cocida con cáscara'],
  [170093, 'papa-horneada', 'Papa con cáscara', 'tuberculos', 'horneada'],
  [168482, 'batata-cruda', 'Batata (camote)', 'tuberculos', 'cruda'],
  [168483, 'batata-horneada', 'Batata (camote)', 'tuberculos', 'horneada'],
  [169985, 'yuca-cruda', 'Yuca', 'tuberculos', 'cruda'],
  [170072, 'name-cocido', 'Ñame', 'tuberculos', 'cocido'],
  [168215, 'platano-verde-crudo', 'Plátano verde', 'tuberculos', 'crudo'],
  [168216, 'platano-verde-cocido', 'Plátano verde', 'tuberculos', 'cocido'],
  [168199, 'platano-verde-frito', 'Plátano verde (patacón)', 'tuberculos', 'frito'],
  [169130, 'platano-maduro-crudo', 'Plátano maduro', 'tuberculos', 'crudo'],
  [169295, 'ahuyama-cruda', 'Ahuyama', 'tuberculos', 'cruda'],
  [169296, 'ahuyama-horneada', 'Ahuyama', 'tuberculos', 'horneada'],
  // 🫘 Legumbres
  [175194, 'frijol-rojo-cocido', 'Fríjol rojo', 'legumbres', 'cocido'],
  [173735, 'frijol-negro-cocido', 'Fríjol negro', 'legumbres', 'cocido'],
  [172421, 'lentejas-cocidas', 'Lentejas', 'legumbres', 'cocidas'],
  [173757, 'garbanzos-cocidos', 'Garbanzos', 'legumbres', 'cocidos'],
  [170420, 'arveja-cocida', 'Arveja verde', 'legumbres', 'cocida'],
  [172475, 'tofu', 'Tofu firme', 'legumbres', 'crudo'],
  // 🍗 Carnes y pollo
  [171077, 'pechuga-cruda', 'Pechuga de pollo sin piel', 'carnes', 'cruda'],
  [171477, 'pechuga-asada', 'Pechuga de pollo sin piel', 'carnes', 'asada'],
  [172388, 'muslo-asado', 'Muslo de pollo sin piel', 'carnes', 'asado'],
  [171480, 'pavo-crudo', 'Pavo (carne)', 'carnes', 'crudo'],
  [171481, 'pavo-asado', 'Pavo (carne)', 'carnes', 'asado'],
  [171816, 'res-magra-cruda', 'Carne de res magra (bola, sin grasa)', 'carnes', 'cruda'],
  [171815, 'res-magra-asada', 'Carne de res magra (bola, sin grasa)', 'carnes', 'asada'],
  [168634, 'solomito-asado', 'Lomo de res (sin grasa)', 'carnes', 'asado'],
  [174030, 'molida-cruda', 'Carne molida 90/10', 'carnes', 'cruda'],
  [171794, 'molida-cocida', 'Carne molida 90/10', 'carnes', 'cocida en sartén'],
  [167818, 'cerdo-lomo-crudo', 'Lomo de cerdo', 'carnes', 'crudo'],
  [167821, 'cerdo-lomo-asado', 'Lomo de cerdo', 'carnes', 'asado'],
  [173863, 'jamon-magro', 'Jamón de pavo o cerdo (bajo en grasa)', 'carnes', 'listo'],
  // 🐟 Pescados y mariscos
  [175176, 'tilapia-cruda', 'Tilapia (mojarra)', 'pescados', 'cruda'],
  [175177, 'tilapia-asada', 'Tilapia (mojarra)', 'pescados', 'asada'],
  [175167, 'salmon-crudo', 'Salmón', 'pescados', 'crudo'],
  [175168, 'salmon-asado', 'Salmón', 'pescados', 'asado'],
  [171986, 'atun-agua', 'Atún en agua (escurrido)', 'pescados', 'enlatado'],
  [175139, 'sardinas-aceite', 'Sardinas en aceite (escurridas)', 'pescados', 'enlatado'],
  [175179, 'camaron-crudo', 'Camarón', 'pescados', 'crudo'],
  [175180, 'camaron-cocido', 'Camarón', 'pescados', 'cocido'],
  // 🥚 Huevos y lácteos
  [171287, 'huevo-crudo', 'Huevo entero', 'huevos-lacteos', 'crudo'],
  [173424, 'huevo-cocido', 'Huevo entero', 'huevos-lacteos', 'cocido'],
  [172183, 'clara', 'Clara de huevo', 'huevos-lacteos', 'cruda'],
  [171265, 'leche-entera', 'Leche entera', 'huevos-lacteos', 'líquida'],
  [171267, 'leche-semi', 'Leche semidescremada (2 %)', 'huevos-lacteos', 'líquida'],
  [171269, 'leche-descremada', 'Leche descremada', 'huevos-lacteos', 'líquida'],
  [171284, 'yogur-natural', 'Yogur natural entero', 'huevos-lacteos', 'listo'],
  [170894, 'yogur-griego-0', 'Yogur griego sin grasa', 'huevos-lacteos', 'listo'],
  [171304, 'yogur-griego', 'Yogur griego entero', 'huevos-lacteos', 'listo'],
  [172223, 'queso-fresco', 'Queso fresco (campesino)', 'huevos-lacteos', 'listo'],
  [172224, 'queso-blanco', 'Queso blanco', 'huevos-lacteos', 'listo'],
  [170847, 'mozzarella', 'Queso mozzarella semidescremado', 'huevos-lacteos', 'listo'],
  [172182, 'cottage', 'Queso cottage bajo en grasa', 'huevos-lacteos', 'listo'],
  [173180, 'proteina-whey', 'Proteína en polvo (whey)', 'huevos-lacteos', 'polvo'],
  // 🍌 Frutas
  [173944, 'banano', 'Banano', 'frutas', 'crudo'],
  [171688, 'manzana', 'Manzana con cáscara', 'frutas', 'cruda'],
  [169910, 'mango', 'Mango', 'frutas', 'crudo'],
  [169926, 'papaya', 'Papaya', 'frutas', 'cruda'],
  [169124, 'pina', 'Piña', 'frutas', 'cruda'],
  [169097, 'naranja', 'Naranja', 'frutas', 'cruda'],
  [167762, 'fresas', 'Fresas', 'frutas', 'crudas'],
  [173044, 'guayaba', 'Guayaba', 'frutas', 'cruda'],
  [167765, 'sandia', 'Sandía (patilla)', 'frutas', 'cruda'],
  [171711, 'arandanos', 'Arándanos', 'frutas', 'crudos'],
  [174683, 'uvas', 'Uvas', 'frutas', 'crudas'],
  [169118, 'pera', 'Pera', 'frutas', 'cruda'],
  [168153, 'kiwi', 'Kiwi', 'frutas', 'crudo'],
  [171705, 'aguacate', 'Aguacate', 'frutas', 'crudo'],
  [168191, 'datiles', 'Dátiles', 'frutas', 'secos'],
  [168165, 'uvas-pasas', 'Uvas pasas', 'frutas', 'secas'],
  // 🥦 Verduras
  [170379, 'brocoli-crudo', 'Brócoli', 'verduras', 'crudo'],
  [169967, 'brocoli-cocido', 'Brócoli', 'verduras', 'cocido'],
  [170393, 'zanahoria', 'Zanahoria', 'verduras', 'cruda'],
  [170457, 'tomate', 'Tomate', 'verduras', 'crudo'],
  [169248, 'lechuga', 'Lechuga', 'verduras', 'cruda'],
  [168462, 'espinaca', 'Espinaca', 'verduras', 'cruda'],
  [170000, 'cebolla', 'Cebolla', 'verduras', 'cruda'],
  [168409, 'pepino', 'Pepino con cáscara', 'verduras', 'crudo'],
  [169291, 'zucchini', 'Zucchini (calabacín)', 'verduras', 'crudo'],
  [169251, 'champinones', 'Champiñones', 'verduras', 'crudos'],
  [169961, 'habichuela', 'Habichuela', 'verduras', 'cruda'],
  [169975, 'repollo', 'Repollo', 'verduras', 'crudo'],
  [169986, 'coliflor', 'Coliflor', 'verduras', 'cruda'],
  [170108, 'pimenton', 'Pimentón rojo', 'verduras', 'crudo'],
  [169145, 'remolacha', 'Remolacha', 'verduras', 'cruda'],
  // 🥑 Grasas, frutos secos y semillas
  [170567, 'almendras', 'Almendras', 'grasas', 'crudas'],
  [170187, 'nueces', 'Nueces', 'grasas', 'crudas'],
  [172430, 'mani', 'Maní', 'grasas', 'crudo'],
  [172470, 'mantequilla-mani', 'Mantequilla de maní sin sal', 'grasas', 'lista'],
  [170554, 'chia', 'Semillas de chía', 'grasas', 'secas'],
  [169414, 'linaza', 'Linaza', 'grasas', 'seca'],
  [171413, 'aceite-oliva', 'Aceite de oliva', 'grasas', 'líquido'],
  [172336, 'aceite-canola', 'Aceite de canola', 'grasas', 'líquido'],
  [171412, 'aceite-coco', 'Aceite de coco', 'grasas', 'sólido'],
  [173430, 'mantequilla', 'Mantequilla sin sal', 'grasas', 'lista'],
  [173418, 'queso-crema', 'Queso crema', 'grasas', 'listo'],
  [170273, 'chocolate-oscuro', 'Chocolate oscuro 70-85 %', 'grasas', 'listo'],
  // 🍯 Azúcares
  [169640, 'miel', 'Miel de abejas', 'azucares', 'lista'],
  [168833, 'azucar-morena', 'Azúcar morena', 'azucares', 'seca'],
  [169655, 'azucar', 'Azúcar blanca', 'azucares', 'seca'],
  [169593, 'cacao-polvo', 'Cacao en polvo sin azúcar', 'azucares', 'polvo'],
];
const NUTRIENTES = { 1008: 'kcal', 1003: 'p', 1005: 'c', 1004: 'g', 1079: 'fibra' };

const carpeta = process.argv[2];
if (!carpeta) { console.error('Uso: node tools/usda-equivalencias.mjs <carpeta con food.csv y food_nutrient.csv>'); process.exit(1); }
// Los CSV de USDA van con todas las columnas entre comillas
const columnas = (linea) => [...linea.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"'));
const ids = new Set(LISTA.map(([f]) => String(f)));
const nombresUsda = {};
for (const l of readFileSync(join(carpeta, 'food.csv'), 'utf8').split('\n').slice(1)) {
  const c = columnas(l);
  if (ids.has(c[0])) nombresUsda[c[0]] = c[2];
}
const valores = {};
for (const l of readFileSync(join(carpeta, 'food_nutrient.csv'), 'utf8').split('\n').slice(1)) {
  const c = columnas(l);
  if (!ids.has(c[1]) || !NUTRIENTES[c[2]]) continue;
  (valores[c[1]] ??= {})[NUTRIENTES[c[2]]] = Number(c[3]);
}
const faltan = [];
const filas = LISTA.map(([fdc, id, nombre, categoria, estado]) => {
  const v = valores[fdc] || {};
  for (const k of ['kcal', 'p', 'c', 'g']) if (v[k] == null) faltan.push(fdc + ' ' + id + ': ' + k);
  if (!nombresUsda[fdc]) faltan.push(fdc + ' ' + id + ': no está en food.csv');
  return { id, nombre, categoria, estado, kcal: v.kcal, p: v.p, c: v.c, g: v.g, fibra: v.fibra ?? 0, fdc, usda: nombresUsda[fdc] };
});
if (faltan.length) { console.error('Faltan datos:\n' + faltan.join('\n')); process.exit(1); }
const repetidos = filas.map((x) => x.id).filter((x, i, l) => l.indexOf(x) !== i);
if (repetidos.length) { console.error('ids repetidos: ' + repetidos.join(', ')); process.exit(1); }

const salida = `// GENERADO por tools/usda-equivalencias.mjs: no lo edites a mano (corre el script para cambiarlo).
// Valores por 100 g (parte comestible) de USDA FoodData Central, SR Legacy (abril 2018), dominio público.
// fdc: el código del alimento en https://fdc.nal.usda.gov/ (para revisar el dato); usda: su nombre allá.
// kcal · p (proteína g) · c (carbohidratos g, por diferencia) · g (grasa g) · fibra (g)
export const FUENTE_USDA = 'USDA FoodData Central (SR Legacy, 2018)';
export const CATEGORIAS_EQUIV = [
  ['cereales', '🍚 Cereales y panes'], ['tuberculos', '🥔 Tubérculos y plátano'], ['legumbres', '🫘 Legumbres'], ['carnes', '🍗 Carnes y pollo'],
  ['pescados', '🐟 Pescados'], ['huevos-lacteos', '🥚 Huevos y lácteos'], ['frutas', '🍌 Frutas'], ['verduras', '🥦 Verduras'], ['grasas', '🥑 Grasas y frutos secos'], ['azucares', '🍯 Azúcares'],
];
export const ALIMENTOS_USDA = [
${filas.map((x) => '  ' + JSON.stringify(x).replace(/"(\w+)":/g, '$1: ').replace(/,(\w+): /g, ', $1: ').replace(/^\{/, '{ ').replace(/\}$/, ' }')).join(',\n')},
];
`;
const destino = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'datos_equivalencias.js');
writeFileSync(destino, salida);
console.log('✓ ' + filas.length + ' alimentos → ' + destino);
