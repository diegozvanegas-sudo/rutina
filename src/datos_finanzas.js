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
  { nombre: 'Motilada', icono: '💈', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 21, categoria: 'otros', grupo: 'personal' },
  { nombre: 'Cepillo de dientes', icono: '🪥', vehiculo: '', cadaKm: 0, cadaMeses: 3, categoria: 'mercado', grupo: 'personal' },
  { nombre: 'Cuchillas de afeitar', icono: '🪒', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'mercado', grupo: 'personal' },
  { nombre: 'Ropa interior y medias', icono: '🩲', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'ropa', grupo: 'personal' },
  { nombre: 'Zapatos', icono: '👞', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'ropa', grupo: 'personal' },
  { nombre: 'Cumpleaños', icono: '🎂', vehiculo: '', cadaKm: 0, cadaMeses: 12, categoria: 'regalos', grupo: 'personal', nota: 'Cámbiale el nombre a "Cumpleaños de …" y pon la fecha de la última vez.' },
  { nombre: 'Llamar a la familia', icono: '📞', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 7, categoria: 'otros', grupo: 'personal' },
  { nombre: 'Otro', icono: '🔔', vehiculo: '', cadaKm: 0, cadaMeses: 0, cadaDias: 30, categoria: 'otros', grupo: 'personal' },
];
export const GRUPOS_PLANTILLA = { moto: '🏍️ Moto', papeles: '📄 Papeles', salud: '🩺 Salud', deporte: '⚽ Deporte', casa: '🏠 Casa', digital: '💻 Digital y dinero', personal: '🧍 Personal' };

export const RECORDATORIOS = () => ({
  vehiculos: [{ id: 'moto', nombre: 'Moto', icono: '🏍️', km: [] }],   // km: [{ fecha, km }] lecturas del odómetro
  lista: [{ id: 'aceite-moto', ...PLANTILLAS_RECORDATORIO[0], hechos: [] }], // hechos: [{ fecha, km, costo }]
});
