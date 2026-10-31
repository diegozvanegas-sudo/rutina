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
export const PLANTILLAS_RECORDATORIO = [
  { nombre: 'Cambio de aceite', icono: '🛢️', vehiculo: 'moto', cadaKm: 2000, cadaMeses: 0 },
  { nombre: 'Aceite de transmisión', icono: '⚙️', vehiculo: 'moto', cadaKm: 6000, cadaMeses: 0 },
  { nombre: 'Kit de arrastre (cadena)', icono: '⛓️', vehiculo: 'moto', cadaKm: 15000, cadaMeses: 0 },
  { nombre: 'Llantas', icono: '🛞', vehiculo: 'moto', cadaKm: 12000, cadaMeses: 0 },
  { nombre: 'Lubricar cadena', icono: '🧴', vehiculo: 'moto', cadaKm: 500, cadaMeses: 0 },
  { nombre: 'SOAT', icono: '📄', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12 },
  { nombre: 'Revisión técnico-mecánica', icono: '🔧', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12 },
  { nombre: 'Impuesto del vehículo', icono: '🏛️', vehiculo: 'moto', cadaKm: 0, cadaMeses: 12 },
  // Cosas personales que se repiten: queda la fecha de cada vez y avisa cuando toca otra (categoria: a dónde va el costo en Finanzas)
  { nombre: 'Motilada', icono: '💈', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 21, categoria: 'otros' },
  { nombre: 'Inyección', icono: '💉', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'salud', nota: 'Pon en Editar cada cuántos días te toca según la fórmula del médico.' },
  { nombre: 'Otro', icono: '🔔', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'otros' },
];

export const RECORDATORIOS = () => ({
  vehiculos: [{ id: 'moto', nombre: 'Moto', icono: '🏍️', km: [] }],   // km: [{ fecha, km }] lecturas del odómetro
  lista: [{ id: 'aceite-moto', ...PLANTILLAS_RECORDATORIO[0], hechos: [] }], // hechos: [{ fecha, km, costo }]
});
