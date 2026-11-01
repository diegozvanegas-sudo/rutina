// Colombia por departamento: se unen los municipios del MGN 2023 del DANE (MGN2023_MPIO_POLITICO.zip, capa MGN_ADM_MPIO_GRAFICO).
const REGIONES = {
  Andina: '05 11 15 17 25 41 54 63 66 68 73',
  Caribe: '08 13 20 23 44 47 70',
  Pacífica: '19 27 52 76',
  Orinoquía: '50 81 85 99',
  Amazonía: '18 86 91 94 95 97',
  Insular: '88',
};
const grupos = {};
for (const [g, ids] of Object.entries(REGIONES)) for (const id of ids.split(' ')) grupos[id] = g;

export default {
  id: 'colombia',
  nombre: 'Colombia',
  padre: 'mundo',
  pieza: 'COL',
  fuente: 'DANE, Marco Geoestadístico Nacional 2023 (municipios unidos por departamento).',
  disolver: 'dpto_ccdgo',
  campoId: 'dpto_ccdgo',
  campoNombre: 'dpto_cnmbr',
  simplificar: '1.5%',
  nombres: { 11: 'Bogotá', 63: 'Quindío', 88: 'San Andrés y Providencia', 44: 'La Guajira', 54: 'Norte de Santander', 76: 'Valle del Cauca' },
  grupos,
  ordenGrupos: Object.keys(REGIONES),
};
