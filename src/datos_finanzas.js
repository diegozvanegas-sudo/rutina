// Datos de partida de Finanzas y Recordatorios. Todo se puede editar desde la app.

// grupo (regla 50/30/20): necesidad (≤ 50 % del ingreso) · deseo (≤ 30 %) · el resto es ahorro (≥ 20 %)
export const CATEGORIAS_GASTO = [
  { id: 'vivienda', nombre: 'Vivienda', icono: '🏠', grupo: 'necesidad' },
  { id: 'servicios', nombre: 'Servicios', icono: '💡', grupo: 'necesidad' },
  { id: 'mercado', nombre: 'Mercado', icono: '🛒', grupo: 'necesidad' },
  { id: 'transporte', nombre: 'Moto y transporte', icono: '🏍️', grupo: 'necesidad' },
  { id: 'gasolina', nombre: 'Gasolina', icono: '⛽', grupo: 'necesidad' },
  { id: 'salud', nombre: 'Salud', icono: '💊', grupo: 'necesidad' },
  { id: 'celular', nombre: 'Celular e internet', icono: '📱', grupo: 'necesidad' },
  { id: 'deudas', nombre: 'Cuotas y deudas', icono: '💳', grupo: 'necesidad' },
  { id: 'educacion', nombre: 'Educación', icono: '📚', grupo: 'necesidad' },
  { id: 'comida', nombre: 'Comida fuera', icono: '🍔', grupo: 'deseo' },
  { id: 'gym', nombre: 'Gym y suplementos', icono: '🏋️', grupo: 'deseo' },
  { id: 'ocio', nombre: 'Salidas y ocio', icono: '🎬', grupo: 'deseo' },
  { id: 'ropa', nombre: 'Ropa', icono: '👕', grupo: 'deseo' },
  { id: 'suscripciones', nombre: 'Suscripciones', icono: '📺', grupo: 'deseo' },
  { id: 'regalos', nombre: 'Regalos', icono: '🎁', grupo: 'deseo' },
  { id: 'otros', nombre: 'Otros', icono: '🧾', grupo: 'deseo' },
  { id: 'familia', nombre: 'Familia', icono: '👨‍👩‍👧', grupo: 'necesidad' },
  { id: 'mascotas', nombre: 'Mascotas', icono: '🐾', grupo: 'necesidad' },
  { id: 'impuestos', nombre: 'Impuestos y trámites', icono: '🏛️', grupo: 'necesidad' },
  { id: 'cuidado', nombre: 'Cuidado personal', icono: '💈', grupo: 'deseo' },
  { id: 'tecnologia', nombre: 'Tecnología', icono: '💻', grupo: 'deseo' },
  { id: 'viajes', nombre: 'Viajes', icono: '✈️', grupo: 'deseo' },
];
export const CATEGORIAS_INGRESO = [
  { id: 'salario', nombre: 'Salario', icono: '💼' },
  { id: 'extra', nombre: 'Extra / freelance', icono: '🧑‍💻' },
  { id: 'reembolso', nombre: 'Reembolso', icono: '↩️' },
  { id: 'otro-ingreso', nombre: 'Otro', icono: '💸' },
  { id: 'prestaciones', nombre: 'Prima y cesantías', icono: '🏛️' },
  { id: 'ventas', nombre: 'Ventas', icono: '🛍️' },
  { id: 'arriendos', nombre: 'Arriendos que cobro', icono: '🏘️' },
  { id: 'rendimientos', nombre: 'Rendimientos', icono: '📈' },
];
// Categorías que llegaron después: se agregan una vez a los datos que ya están en el celular (las que borres no vuelven)
export const CATEGORIAS_NUEVAS_V2 = { gasto: ['familia', 'mascotas', 'impuestos', 'cuidado', 'tecnologia', 'viajes'], ingreso: ['prestaciones', 'ventas', 'arriendos', 'rendimientos'] };

// Subcategorías opcionales de cada categoría: el presupuesto y la regla 50/30/20 siguen por categoría,
// la subcategoría solo dice en qué se fue la plata. Cada texto es "ícono nombre"; el id sale del nombre, así que no lo cambies.
const SUBS = {
  vivienda: '🔑 Arriendo|🏦 Cuota de vivienda|🏢 Administración|🔧 Reparaciones|🛠️ Mantenimiento|🧱 Remodelación|🛋️ Muebles|🧺 Electrodomésticos|🖼️ Decoración|🔩 Ferretería|🌱 Jardinería|🔒 Seguridad del hogar|📦 Mudanza|☂️ Seguro de vivienda|🍳 Utensilios de cocina',
  servicios: '⚡ Energía|🚰 Agua|🔥 Gas|🗑️ Aseo (recolección)',
  mercado: '🛒 Mercado general|🍎 Frutas|🥦 Verduras|🥩 Carnes|🍗 Pollo|🐟 Pescado|🥚 Huevos|🥛 Lácteos|🍞 Panadería|🌾 Granos y cereales|🥤 Bebidas|💧 Agua en botella|🧼 Aseo y limpieza|🧻 Papel y desechables',
  transporte: '🚇 Metro|🚌 Bus|🚕 Taxi|📱 Uber y plataformas|🚍 Intermunicipal|🔧 Mantenimiento de moto|🛢️ Cambio de aceite|🛞 Llantas|⚙️ Repuestos|🧽 Lavado|🅿️ Parqueadero|🛣️ Peajes|📄 SOAT|🔍 Tecnomecánica|🛡️ Seguro del vehículo|🪖 Accesorios de moto|🚨 Multas|🪪 Licencia de conducción|🚗 Mantenimiento de carro',
  gasolina: '⛽ Corriente|🔥 Extra|🛢️ ACPM',
  salud: '🏥 EPS|🩺 Prepagada|👨‍⚕️ Consulta médica|🦷 Odontología|👁️ Optometría|🩸 Exámenes|💊 Medicamentos|🧠 Psicología|💆 Fisioterapia|🚑 Urgencias|🏨 Hospitalización|🧴 Dermatología|🛡️ Seguro de salud|🧾 Seguridad social',
  celular: '📱 Plan del celular|📶 Recargas|🌐 Internet|📺 Televisión|☎️ Teléfono fijo',
  deudas: '💳 Tarjeta de crédito|📉 Intereses|🏦 Libre inversión|🏍️ Crédito de vehículo|🏡 Hipoteca|🤝 Préstamo personal|👨‍👩‍👧 Deuda familiar|🏧 Cuota de manejo|💸 Comisiones bancarias|🛡️ Seguro de la deuda',
  educacion: '🎓 Universidad|📝 Matrícula|💻 Curso virtual|🏫 Curso presencial|📜 Certificación|📚 Libros|🎧 Audiolibros|🎤 Seminario|🎓 Diplomado|🗣️ Idiomas|✏️ Papelería|📖 Material de estudio',
  comida: '🍽️ Restaurante|🛵 Domicilio|🍔 Comida rápida|☕ Cafetería|🍿 Snacks|🍬 Dulces|💼 Almuerzo de trabajo',
  gym: '🏋️ Mensualidad|🧑‍🏫 Entrenador|🥤 Proteína|⚡ Creatina|🔥 Preentreno|💊 Vitaminas y suplementos|👟 Ropa y calzado deportivo|🥊 Accesorios del gym|🏆 Competencias|⚽ Cancha y fútbol|🏊 Natación|🚴 Ciclismo|🏃 Running|💆 Masaje deportivo',
  ocio: '🎬 Cine|🎵 Conciertos|🎟️ Eventos|🍻 Bares|🪩 Discoteca|🚶 Salidas|🎲 Juegos|🎮 Videojuegos|🎨 Hobbies',
  ropa: '👕 Camisetas|👖 Pantalones y jeans|👔 Camisas|🧥 Chaquetas|🩲 Ropa interior|🧦 Medias|👞 Zapatos|👟 Tenis|🩴 Sandalias|⌚ Relojes|🕶️ Gafas|👜 Bolsos y carteras|💍 Joyas y accesorios|🧵 Arreglos|🧺 Lavandería',
  suscripciones: '🎞️ Netflix|🏰 Disney+|📦 Amazon Prime|🎭 HBO Max|🎧 Spotify|▶️ YouTube Premium|☁️ Nube|🧩 Software y licencias|🤖 Herramientas de IA|📰 Noticias y revistas',
  regalos: '🎂 Cumpleaños|🎄 Navidad|💝 Pareja|💒 Matrimonios|🎉 Celebraciones',
  otros: '📮 Envíos|📠 Fotocopias|🛍️ Compras por internet|💁 Propinas|❓ Imprevisto|🕳️ Plata perdida|💵 Efectivo sin anotar|🙏 Donaciones',
  familia: '🤲 Apoyo a mis padres|💑 Pareja|🧒 Hijos|💸 Ayuda económica|🏠 Reunión familiar',
  mascotas: '🦴 Comida|🩺 Veterinario|💉 Vacunas|🛁 Baño y peluquería|🧸 Accesorios',
  impuestos: '🧮 Declaración de renta|🏘️ Predial|🏍️ Impuesto vehicular|📑 Retención|🪪 Documentos|⚖️ Gastos legales|🏛️ Trámites',
  cuidado: '💈 Barbería|💇 Peluquería|🧴 Cuidado de la piel|🌸 Perfumería|🪒 Afeitado|🪥 Higiene',
  tecnologia: '📱 Celular|💻 Computador|📲 Tablet|🎧 Audífonos|⌚ Smartwatch|📺 Televisor|📷 Cámara|🖱️ Periféricos|🧩 Componentes de PC|🔌 Accesorios|🛠️ Reparación|🏠 Domótica|🧮 Aplicaciones',
  viajes: '✈️ Vuelos|🏨 Hotel|🚌 Transporte del viaje|🍽️ Comidas del viaje|🗺️ Tours|🧳 Equipaje',
  salario: '💼 Sueldo|⏱️ Horas extras|🌙 Recargos nocturnos|🎯 Bonificación|📊 Comisiones',
  extra: '🧑‍💻 Freelance|📄 Prestación de servicios|🏪 Negocio propio',
  prestaciones: '🎁 Prima|🏛️ Cesantías|💵 Intereses de cesantías|📑 Liquidación|🏖️ Vacaciones pagadas',
  ventas: '🌐 Venta por internet|🛍️ Venta ocasional|♻️ Algo usado',
  rendimientos: '🏦 Intereses de CDT|💳 Intereses de cuenta|📈 Dividendos|💹 Ganancia de inversión',
  reembolso: '↩️ Devolución de compra|💼 Gastos de trabajo|🏥 Reembolso de salud',
  'otro-ingreso': '🏆 Premio|🎁 Regalo recibido|📀 Regalías',
};
export const slug = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const SUBCATEGORIAS = Object.fromEntries(Object.entries(SUBS).map(([cat, txt]) => [cat, txt.split('|').map((x) => {
  const i = x.indexOf(' ');
  return { id: slug(x.slice(i + 1)), icono: x.slice(0, i), nombre: x.slice(i + 1) };
})]));

// Metas de ahorro e inversión para agregar con un toque. inversion: la plata cambia de valor, así que se anota cuánto vale hoy
export const PLANTILLAS_META = [
  { nombre: 'Vivienda', icono: '🏡' }, { nombre: 'Moto o carro', icono: '🏍️' }, { nombre: 'Viaje', icono: '✈️' }, { nombre: 'Estudios', icono: '🎓' },
  { nombre: 'Tecnología', icono: '💻' }, { nombre: 'Negocio', icono: '💼' }, { nombre: 'Impuestos del año', icono: '🧾' }, { nombre: 'Compra grande', icono: '🛋️' },
  { nombre: 'Pensión voluntaria', icono: '👴' },
  { nombre: 'CDT', icono: '🏦', inversion: true }, { nombre: 'Fondo de inversión', icono: '📊', inversion: true }, { nombre: 'Acciones y ETF', icono: '📈', inversion: true },
  { nombre: 'Dólares', icono: '💵', inversion: true }, { nombre: 'Cripto', icono: '🪙', inversion: true }, { nombre: 'Oro', icono: '🥇', inversion: true },
];
export const METODOS = [
  { id: 'efectivo', nombre: 'Efectivo', icono: '💵' },
  { id: 'debito', nombre: 'Débito', icono: '🏧' },
  { id: 'credito', nombre: 'Tarjeta de crédito', icono: '💳' },
  { id: 'nequi', nombre: 'Nequi', icono: '📲' },
  { id: 'daviplata', nombre: 'Daviplata', icono: '📲' },
  { id: 'transferencia', nombre: 'Transferencia', icono: '🏦' },
];

export const FINANZAS = () => ({
  movimientos: [],   // { id, fecha, tipo: gasto | ingreso | ahorro | transferencia, monto, categoria, sub?, metodo, destino? (transferencia), nota, fijo?, meta?, deuda? }
  categorias: { gasto: CATEGORIAS_GASTO.map((c) => ({ ...c, presupuesto: 0 })), ingreso: CATEGORIAS_INGRESO.map((c) => ({ ...c })) },
  subs: [],          // { id, cat, nombre, icono } subcategorías que agregaste tú
  metodos: METODOS.map((m) => ({ ...m })),
  fijos: [],         // { id, nombre, monto, categoria, metodo, dia }  pagos de cada mes
  metas: [{ id: 'emergencia', nombre: 'Fondo de emergencia', icono: '🛟', objetivo: 0, meses: 6 }],  // objetivo 0 = 6 meses de gastos
  deudas: [],        // { id, nombre, saldo, tasa (% mensual), cuota, dia }
  prestamos: [],     // { id, nombre, monto (lo que te deben), tasa (% mensual), dia (de cobro), limite?, nota, saldado? }  plata que prestaste
});

// Plantillas para agregar recordatorios con un toque. cadaKm / cadaMeses / cadaDias: lo que pase primero.
// grupo: bajo qué subtítulo sale el botón en "Agregar recordatorio".
export const PLANTILLAS_RECORDATORIO = [
  { nombre: 'Cambio de aceite', icono: '🛢️', vehiculo: 'moto', cadaKm: 2000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Aceite de transmisión', icono: '⚙️', vehiculo: 'moto', cadaKm: 6000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Kit de arrastre (cadena)', icono: '⛓️', vehiculo: 'moto', cadaKm: 15000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Llantas', icono: '🛞', vehiculo: 'moto', cadaKm: 12000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Lubricar cadena', icono: '🧴', vehiculo: 'moto', cadaKm: 500, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Filtro de aire', icono: '🌬️', vehiculo: 'moto', cadaKm: 6000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Bujía', icono: '⚡', vehiculo: 'moto', cadaKm: 8000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Pastillas de freno', icono: '🛑', vehiculo: 'moto', cadaKm: 10000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Mantenimiento general', icono: '🔩', vehiculo: 'moto', cadaKm: 5000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Líquido de frenos', icono: '💧', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12, grupo: 'moto' },
  { nombre: 'Revisar batería', icono: '🔋', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12, grupo: 'moto' },
  { nombre: 'Cambiar casco', icono: '🪖', vehiculo: 'moto', cadaKm: 0, cadaMeses: 60, grupo: 'moto', nota: 'Cámbialo antes si tuvo un golpe fuerte o una caída.' },
  { nombre: 'Tensionar cadena', icono: '🔗', vehiculo: 'moto', cadaKm: 1000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Filtro de gasolina', icono: '⛽', vehiculo: 'moto', cadaKm: 12000, cadaMeses: 0, grupo: 'moto' },
  { nombre: 'Guayas (clutch y acelerador)', icono: '🪢', vehiculo: 'moto', cadaKm: 5000, cadaMeses: 0, grupo: 'moto', nota: 'Lubricarlas y ajustarlas; cámbialas si están peladas.' },
  { nombre: 'Refrigerante', icono: '🧊', vehiculo: 'moto', cadaKm: 0, cadaMeses: 24, grupo: 'moto', nota: 'Solo si la moto es refrigerada por líquido.' },
  { nombre: 'Presión de llantas', icono: '🎈', vehiculo: 'moto', cadaKm: 0, cadaMeses: 0, cadaDias: 15, grupo: 'moto' },
  { nombre: 'Lavar la moto', icono: '🧽', vehiculo: 'moto', cadaKm: 0, cadaMeses: 0, cadaDias: 15, grupo: 'moto' },
  { nombre: 'Impermeable y guantes', icono: '🧤', vehiculo: '', cadaKm: 0, cadaMeses: 24, categoria: 'transporte', grupo: 'moto' },
  { nombre: 'SOAT', icono: '📄', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12, grupo: 'papeles' },
  { nombre: 'Revisión técnico-mecánica', icono: '🔧', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12, grupo: 'papeles' },
  { nombre: 'Impuesto del vehículo', icono: '🏛️', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12, grupo: 'papeles' },
  { nombre: 'Licencia de conducción', icono: '🪪', vehiculo: '', cadaKm: 0, cadaMeses: 120, categoria: 'transporte', grupo: 'papeles', nota: 'Pon en Editar los meses que le faltan según la fecha de vencimiento de la licencia.' },
  { nombre: 'Pasaporte', icono: '🛂', vehiculo: '', cadaKm: 0, cadaMeses: 120, categoria: 'otros', grupo: 'papeles', nota: 'Pon en Editar los meses que le faltan según la fecha de vencimiento del pasaporte.' },
  { nombre: 'Declaración de renta', icono: '🧮', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'otros', grupo: 'papeles', nota: 'La DIAN asigna la fecha según los dos últimos dígitos del NIT (agosto–octubre).' },
  { nombre: 'Certificados y extractos', icono: '🗂️', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'otros', grupo: 'papeles', nota: 'Certificado de ingresos y retenciones, extractos y certificados bancarios para la renta.' },
  { nombre: 'Seguro / póliza', icono: '🛡️', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'otros', grupo: 'papeles' },
  // Cosas personales que se repiten: queda la fecha de cada vez y avisa cuando toca otra (categoria: a dónde va el costo en Finanzas)
  { nombre: 'Inyección', icono: '💉', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'salud', grupo: 'salud', nota: 'Pon en Editar cada cuántos días te toca según la fórmula del médico.' },
  { nombre: 'Odontólogo', icono: '🦷', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Exámenes de sangre', icono: '🩸', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Optómetra', icono: '👁️', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Comprar suplementos', icono: '💊', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'gym', grupo: 'salud' },
  { nombre: 'Chequeo médico', icono: '🩺', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Limpieza dental', icono: '✨', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Vacuna de la influenza', icono: '🦠', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Dermatólogo', icono: '🌞', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Masaje / fisioterapia', icono: '💆', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Medirse y pesarse', icono: '⚖️', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'gym', grupo: 'salud', nota: 'Peso, cintura y una foto con la misma luz para ver el progreso.' },
  { nombre: 'Guayos / tenis', icono: '👟', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'ropa', grupo: 'deporte' },
  { nombre: 'Medias y canilleras', icono: '🧦', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'ropa', grupo: 'deporte' },
  { nombre: 'Camiseta y pantaloneta', icono: '🎽', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'ropa', grupo: 'deporte' },
  { nombre: 'Balón', icono: '⚽', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'ocio', grupo: 'deporte' },
  { nombre: 'Mensualidad del gym', icono: '🏋️', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'gym', grupo: 'deporte' },
  { nombre: 'Cancha / liga', icono: '🥅', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'ocio', grupo: 'deporte' },
  { nombre: 'Guantes y straps del gym', icono: '🥊', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'gym', grupo: 'deporte' },
  { nombre: 'Cambiar sábanas', icono: '🛏️', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 7, categoria: 'otros', grupo: 'casa' },
  { nombre: 'Lavar toallas', icono: '🧺', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 7, categoria: 'otros', grupo: 'casa' },
  { nombre: 'Filtro de agua', icono: '🚰', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'vivienda', grupo: 'casa' },
  { nombre: 'Cambiar esponjas', icono: '🫧', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 15, categoria: 'mercado', grupo: 'casa' },
  { nombre: 'Limpiar la nevera', icono: '❄️', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'otros', grupo: 'casa' },
  { nombre: 'Pipeta de gas', icono: '🔥', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 45, categoria: 'servicios', grupo: 'casa', nota: 'Ajusta los días según cuánto te dura.' },
  { nombre: 'Fumigar', icono: '🪳', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'vivienda', grupo: 'casa' },
  { nombre: 'Cambiar almohada', icono: '😴', vehiculo: '', cadaKm: 0, cadaMeses: 18, categoria: 'vivienda', grupo: 'casa' },
  { nombre: 'Limpieza profunda', icono: '🧹', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'otros', grupo: 'casa', nota: 'Debajo de la cama, ventanas, closet y lo que regalar o botar.' },
  { nombre: 'Plan del celular', icono: '📱', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'celular', grupo: 'digital' },
  { nombre: 'Copia de seguridad', icono: '💾', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'otros', grupo: 'digital', nota: 'Fotos del celular y el respaldo de esta app (Ajustes → Exportar).' },
  { nombre: 'Revisar suscripciones', icono: '📺', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'suscripciones', grupo: 'digital', nota: 'Cancela las que no usaste el último mes.' },
  { nombre: 'Cambiar contraseñas', icono: '🔑', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'otros', grupo: 'digital', nota: 'Correo y bancos primero; activa la verificación en dos pasos.' },
  { nombre: 'Revisar centrales de riesgo', icono: '📊', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'otros', grupo: 'digital', nota: 'Datacrédito y TransUnion: es gratis consultar tu historial.' },
  { nombre: 'Limpiar el computador', icono: '💻', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'otros', grupo: 'digital', nota: 'Polvo del ventilador, actualizaciones y archivos que sobran.' },
  { nombre: 'Pendiente de todos los días', icono: '📌', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 1, diario: true, categoria: 'otros', grupo: 'personal' },
  { nombre: 'Motilada', icono: '💈', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 21, categoria: 'cuidado', grupo: 'personal' },
  { nombre: 'Cepillo de dientes', icono: '🪥', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'mercado', grupo: 'personal' },
  { nombre: 'Cuchillas de afeitar', icono: '🪒', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'mercado', grupo: 'personal' },
  { nombre: 'Ropa interior y medias', icono: '🩲', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'ropa', grupo: 'personal' },
  { nombre: 'Zapatos', icono: '👞', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'ropa', grupo: 'personal' },
  { nombre: 'Cumpleaños', icono: '🎂', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'regalos', grupo: 'personal', nota: 'Cámbiale el nombre a "Cumpleaños de …" y pon la fecha de la última vez.' },
  { nombre: 'Llamar a la familia', icono: '📞', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 7, categoria: 'otros', grupo: 'personal' },
  { nombre: 'Pago de hipoteca', icono: '🏡', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'deudas', grupo: 'pagos', nota: 'Si también la tienes como deuda en Finanzas, te avisa dos veces: deja solo uno de los dos.' },
  { nombre: 'Abono a capital de la hipoteca', icono: '📉', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'deudas', grupo: 'pagos', nota: 'Pídele al banco que el abono reduzca el plazo o la cuota, y revisa cuál te conviene.' },
  { nombre: 'Arriendo', icono: '🔑', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'vivienda', grupo: 'pagos' },
  { nombre: 'Administración', icono: '🏢', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'vivienda', grupo: 'pagos' },
  { nombre: 'Impuesto predial', icono: '🏘️', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'vivienda', grupo: 'pagos', nota: 'Revisa las fechas y el descuento por pronto pago de tu municipio.' },
  { nombre: 'Seguro de hogar', icono: '☂️', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'vivienda', grupo: 'pagos' },
  { nombre: 'Servicios públicos', icono: '💡', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'servicios', grupo: 'pagos' },
  { nombre: 'Internet y TV', icono: '🌐', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'celular', grupo: 'pagos' },
  { nombre: 'Tarjeta de crédito', icono: '💳', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'deudas', grupo: 'pagos', nota: 'Paga el total si puedes, para no pagar intereses.' },
  { nombre: 'Cuota de crédito', icono: '🏦', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'deudas', grupo: 'pagos' },
  { nombre: 'Cuota de la moto', icono: '🛵', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'deudas', grupo: 'pagos' },
  { nombre: 'Seguridad social', icono: '🧾', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'salud', grupo: 'pagos', nota: 'Para independientes: salud, pensión y ARL.' },
  { nombre: 'Medicina prepagada', icono: '🏥', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'salud', grupo: 'pagos' },
  { nombre: 'Colegio o universidad', icono: '🎓', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'educacion', grupo: 'pagos', nota: 'Ajusta los días si pagas por semestre.' },
  { nombre: 'Ahorro del mes', icono: '🐷', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'otros', grupo: 'pagos', nota: 'Apenas te paguen, antes de gastar. Anótalo como aporte a una meta en Finanzas.' },
  { nombre: 'Revisar luces y pito', icono: '🔦', vehiculo: 'moto', cadaKm: 0, cadaMeses: 1, categoria: 'transporte', grupo: 'moto' },
  { nombre: 'Revisar suspensión', icono: '🔩', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12, categoria: 'transporte', grupo: 'moto' },
  { nombre: 'Consultar comparendos', icono: '🚦', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'otros', grupo: 'papeles', nota: 'Consúltalos en el SIMIT con tu cédula.' },
  { nombre: 'Actualizar el RUT', icono: '📇', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'otros', grupo: 'papeles', nota: 'Revisa que tu dirección y actividad sigan al día.' },
  { nombre: 'Revisar las cesantías', icono: '🏛️', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'otros', grupo: 'papeles', nota: 'Si eres empleado, confirma en febrero que te las consignaron en el fondo.' },
  { nombre: 'Actualizar la hoja de vida', icono: '📝', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'otros', grupo: 'papeles' },
  { nombre: 'Reclamar la fórmula médica', icono: '💊', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Control de tiroides', icono: '🧪', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'salud', grupo: 'salud', nota: 'Ajusta la frecuencia a lo que te indique tu médico.' },
  { nombre: 'Tomar la tensión', icono: '🩺', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Psicólogo', icono: '🧠', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Inscripción a torneo', icono: '🏆', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'ocio', grupo: 'deporte' },
  { nombre: 'Hacer mercado', icono: '🛒', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 7, categoria: 'mercado', grupo: 'casa' },
  { nombre: 'Limpiar el baño', icono: '🚿', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 7, categoria: 'otros', grupo: 'casa' },
  { nombre: 'Limpiar la lavadora', icono: '🧼', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'otros', grupo: 'casa' },
  { nombre: 'Regar las plantas', icono: '🌱', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 3, categoria: 'otros', grupo: 'casa' },
  { nombre: 'Mantenimiento del calentador', icono: '♨️', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'vivienda', grupo: 'casa' },
  { nombre: 'Revisión del gas', icono: '🔧', vehiculo: '', cadaKm: 0, cadaMeses: 60, categoria: 'servicios', grupo: 'casa', nota: 'Ajusta la fecha a la que indique tu factura de gas.' },
  { nombre: 'Pagar dominio o página web', icono: '🔗', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'suscripciones', grupo: 'digital' },
  { nombre: 'Actualizar el celular', icono: '📲', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'otros', grupo: 'digital' },
  { nombre: 'Organizar las fotos', icono: '📷', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'otros', grupo: 'digital' },
  { nombre: 'Revisar metas', icono: '🎯', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'otros', grupo: 'personal' },
  { nombre: 'Planear vacaciones', icono: '✈️', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'ocio', grupo: 'personal' },
  { nombre: 'Aniversario', icono: '💝', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'regalos', grupo: 'personal' },
  { nombre: 'Cortar las uñas', icono: '✂️', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 15, categoria: 'otros', grupo: 'personal' },
  { nombre: 'Vacuna de la mascota', icono: '💉', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'mascotas', grupo: 'mascota' },
  { nombre: 'Desparasitar la mascota', icono: '🐾', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'mascotas', grupo: 'mascota' },
  { nombre: 'Baño de la mascota', icono: '🛁', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'mascotas', grupo: 'mascota' },
  { nombre: 'Comida de la mascota', icono: '🦴', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'mascotas', grupo: 'mascota' },
  { nombre: 'Otro', icono: '🔔', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'otros', grupo: 'personal' },
];
export const GRUPOS_PLANTILLA = { pagos: '💳 Pagos', moto: '🏍️ Moto', papeles: '📄 Papeles', salud: '🩺 Salud', deporte: '⚽ Deporte', casa: '🏠 Casa', digital: '💻 Digital y dinero', personal: '🧍 Personal', mascota: '🐾 Mascota' };

export const RECORDATORIOS = () => ({
  vehiculos: [{ id: 'moto', nombre: 'Moto', icono: '🏍️', km: [] }],   // km: [{ fecha, km }] lecturas del odómetro
  lista: [{ id: 'aceite-moto', ...PLANTILLAS_RECORDATORIO[0], hechos: [] }], // hechos: [{ fecha, km, costo }]
  eventos: [],                                                          // ver eventos.js
});
