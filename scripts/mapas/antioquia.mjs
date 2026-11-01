// Antioquia por municipio: MGN 2023 del DANE (MGN2023_MPIO_POLITICO.zip, capa MGN_ADM_MPIO_GRAFICO).
const SUBREGIONES = {
  'Valle de Aburrá': '001 079 088 129 212 266 308 360 380 631',
  Oriente: '002 021 055 148 197 206 313 318 321 376 400 440 483 541 607 615 649 652 660 667 674 697 756',
  Suroeste: '030 034 036 091 093 101 145 209 282 353 364 368 390 467 576 642 679 789 792 809 847 856 861',
  Occidente: '004 042 044 059 113 125 138 234 240 284 306 347 411 501 543 628 656 761 842',
  Norte: '038 086 107 134 150 237 264 310 315 361 647 658 664 686 819 854 887',
  Nordeste: '031 040 190 604 670 690 736 858 885 890',
  'Magdalena Medio': '142 425 579 585 591 893',
  'Bajo Cauca': '120 154 250 495 790 895',
  Urabá: '045 051 147 172 475 480 490 659 665 837 873',
};
const grupos = {};
for (const [g, ids] of Object.entries(SUBREGIONES)) for (const id of ids.split(' ')) grupos['05' + id] = g;

export default {
  id: 'antioquia',
  nombre: 'Antioquia',
  padre: 'colombia',
  pieza: '05',
  fuente: 'DANE, Marco Geoestadístico Nacional 2023 (municipios).',
  filtro: "dpto_ccdgo === '05'",
  campoId: 'mpio_cdpmp',
  campoNombre: 'mpio_cnmbr',
  simplificar: '3%',
  nombres: { '05042': 'Santa Fe de Antioquia' },
  grupos,
  ordenGrupos: Object.keys(SUBREGIONES),
};
