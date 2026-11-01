// Brasil por estado: malha territorial 2024 del IBGE (BR_UF_2024.zip).
export default {
  id: 'brasil',
  nombre: 'Brasil',
  padre: 'mundo',
  pieza: 'BRA',
  fuente: 'IBGE, Malha Municipal 2024 (unidades da federação).',
  campoId: 'SIGLA_UF',
  campoNombre: 'NM_UF',
  nombreTal: true,
  simplificar: '1.5%',
  grupoDe: (p) => p.NM_REGIA,
  ordenGrupos: ['Norte', 'Nordeste', 'Centro-oeste', 'Sudeste', 'Sul'],
};
