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
];
export const CATEGORIAS_INGRESO = [
  { id: 'salario', nombre: 'Salario', icono: '💼' },
  { id: 'extra', nombre: 'Extra / freelance', icono: '🧑‍💻' },
  { id: 'reembolso', nombre: 'Reembolso', icono: '↩️' },
  { id: 'otro-ingreso', nombre: 'Otro', icono: '💸' },
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
  movimientos: [],   // { id, fecha, tipo: gasto | ingreso | ahorro, monto, categoria, metodo, nota, fijo?, meta?, deuda? }
  categorias: { gasto: CATEGORIAS_GASTO.map((c) => ({ ...c, presupuesto: 0 })), ingreso: CATEGORIAS_INGRESO.map((c) => ({ ...c })) },
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
  { nombre: 'SOAT', icono: '📄', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12, grupo: 'papeles' },
  { nombre: 'Revisión técnico-mecánica', icono: '🔧', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12, grupo: 'papeles' },
  { nombre: 'Impuesto del vehículo', icono: '🏛️', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12, grupo: 'papeles' },
  { nombre: 'Licencia de conducción', icono: '🪪', vehiculo: '', cadaKm: 0, cadaMeses: 120, categoria: 'transporte', grupo: 'papeles', nota: 'Pon en Editar los meses que le faltan según la fecha de vencimiento de la licencia.' },
  { nombre: 'Pasaporte', icono: '🛂', vehiculo: '', cadaKm: 0, cadaMeses: 120, categoria: 'otros', grupo: 'papeles', nota: 'Pon en Editar los meses que le faltan según la fecha de vencimiento del pasaporte.' },
  // Cosas personales que se repiten: queda la fecha de cada vez y avisa cuando toca otra (categoria: a dónde va el costo en Finanzas)
  { nombre: 'Inyección', icono: '💉', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'salud', grupo: 'salud', nota: 'Pon en Editar cada cuántos días te toca según la fórmula del médico.' },
  { nombre: 'Odontólogo', icono: '🦷', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Exámenes de sangre', icono: '🩸', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Optómetra', icono: '👁️', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'salud', grupo: 'salud' },
  { nombre: 'Comprar suplementos', icono: '💊', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'gym', grupo: 'salud' },
  { nombre: 'Guayos / tenis', icono: '👟', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'ropa', grupo: 'deporte' },
  { nombre: 'Medias y canilleras', icono: '🧦', vehiculo: '', cadaKm: 0, cadaMeses: 6, categoria: 'ropa', grupo: 'deporte' },
  { nombre: 'Motilada', icono: '💈', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 21, categoria: 'otros', grupo: 'casa' },
  { nombre: 'Cepillo de dientes', icono: '🪥', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'mercado', grupo: 'casa' },
  { nombre: 'Cambiar sábanas', icono: '🛏️', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 7, categoria: 'otros', grupo: 'casa' },
  { nombre: 'Filtro de agua', icono: '🚰', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'vivienda', grupo: 'casa' },
  { nombre: 'Plan del celular', icono: '📱', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'celular', grupo: 'casa' },
  { nombre: 'Otro', icono: '🔔', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'otros', grupo: 'casa' },
];
export const GRUPOS_PLANTILLA = { moto: '🏍️ Moto', papeles: '📄 Papeles', salud: '🩺 Salud', deporte: '⚽ Deporte', casa: '🏠 Casa y personal' };

export const RECORDATORIOS = () => ({
  vehiculos: [{ id: 'moto', nombre: 'Moto', icono: '🏍️', km: [] }],   // km: [{ fecha, km }] lecturas del odómetro
  lista: [{ id: 'aceite-moto', ...PLANTILLAS_RECORDATORIO[0], hechos: [] }], // hechos: [{ fecha, km, costo }]
});
