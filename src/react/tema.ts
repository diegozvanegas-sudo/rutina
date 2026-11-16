// Tema de Material UI con los colores y las medidas de la app (los mismos de :root en src/estilos.css):
// oscuro, compacto y con botones cómodos para el dedo. Todas las pantallas de React salen de aquí
import { createTheme } from '@mui/material/styles';

// Los mismos valores de src/estilos.css
export const tokens = {
  bg: '#101418', surface: '#181e24', surface2: '#212932', line: '#2c3640',
  ink: '#e9eef2', muted: '#93a1ad',
  brand: '#3dd68c', brandInk: '#062b18', brandSoft: '#173a2a',
  amarillo: '#f5c542', verde: '#3dd68c', azul: '#5aa9ff', rojo: '#ff6b6b',
  // Texto sobre amarillo (botón que cuenta) y el rosa de los módulos creativos de Plan B, con su texto encima
  amarilloInk: '#2b2100', rosa: '#f472b6', rosaInk: '#2a0a1a',
  // Colores de las billeteras en los iconos de los métodos de pago (ui/IconoMetodo.tsx)
  nequi: '#d6006f', nequiInk: '#ffffff', daviplata: '#e3262f',
  // Fondos oscuros de las etiquetas amarilla (Bajo, aviso) y azul (Alto)
  amarilloFondo: '#3a2d10', azulFondo: '#1f2a3d',
  // Etiqueta y texto de lo vencido (Recordatorios)
  rojoFondo: '#4a1d1d', rojoSuave: '#ffb3b3', peligroInk: '#ffd0d0',
  // 📚 Libros: el dorado de la lectura del día, la afirmación y la caja de nota
  dorado: '#e0a84a', doradoSuave: '#f3d9a4', notaFondo: '#1d2733', notaBorde: '#2f4257',
  // 📈 Gráficos: series (ingresos, gastos, otra) y la rampa de la constancia, de menos a más (los de graficos.js)
  serie1: '#3987e5', serie2: '#d95926', serie3: '#2fa37a', rampa1: '#184f95', rampa2: '#256abf', rampa3: '#3987e5', rampa4: '#86b6ef',
  // 🌅 Mañana: "ya puedes desayunar" (verde claro sobre verde oscuro)
  brandClaro: '#a9f0c9',
  // 🗺️ Lugares: relleno de lo visitado (menos a más) y de lo que quiero visitar
  mapaVisto1: 'rgba(61, 214, 140, .5)', mapaVisto2: 'rgba(61, 214, 140, .75)', mapaQuiero: 'rgba(245, 197, 66, .16)',
  // Gym: etiqueta Top y Back-off, fila "sube peso" y el texto sobre azul
  topFondo: '#3d2a12', topInk: '#ffc27a', backoffInk: '#9cc3ff', subeFondo: '#12233a', azulInk: '#04162b',
  radio: 14,
};
const FUENTE = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const tema = createTheme({
  palette: {
    mode: 'dark',
    background: { default: tokens.bg, paper: tokens.surface },
    primary: { main: tokens.brand, contrastText: tokens.brandInk },
    secondary: { main: tokens.surface2, contrastText: tokens.ink },
    error: { main: tokens.rojo },
    warning: { main: tokens.amarillo },
    info: { main: tokens.azul },
    success: { main: tokens.verde },
    text: { primary: tokens.ink, secondary: tokens.muted },
    divider: tokens.line,
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: FUENTE,
    fontSize: 16,
    h1: { fontSize: 26, fontWeight: 700, lineHeight: 1.25 },
    h2: { fontSize: 17, fontWeight: 700, lineHeight: 1.4 },
    h3: { fontSize: 17, fontWeight: 700, lineHeight: 1.4 },
    body1: { fontSize: 16, lineHeight: 1.4 },
    body2: { fontSize: 14, lineHeight: 1.4 },
    caption: { fontSize: 12, lineHeight: 1.3 },
    button: { textTransform: 'none', fontWeight: 700, fontSize: 16 },
  },
  components: {
    // Tarjetas con borde, sin sombra ni degradado (como .tarjeta)
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { padding: 14, borderRadius: tokens.radio, borderColor: tokens.line, backgroundColor: tokens.surface, backgroundImage: 'none' } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    // Botones cómodos para el dedo: 48 px de alto (36 px los pequeños)
    MuiButton: {
      defaultProps: { disableElevation: true, variant: 'contained' },
      styleOverrides: {
        root: {
          minHeight: 48, padding: '10px 16px', borderRadius: 12,
          variants: [
            // El botón "secundario" de la app: gris con borde
            { props: { variant: 'contained', color: 'secondary' }, style: { border: '1px solid ' + tokens.line, '&:hover': { backgroundColor: '#2a3440' } } },
            { props: { size: 'small' }, style: { minHeight: 36, padding: '4px 12px', fontSize: 13, borderRadius: 999 } },
          ],
        },
      },
    },
    // Campos: fondo oscuro, 48 px de alto y el borde verde al escribir (como los input de antes).
    // minHeight, boxSizing y outline se fijan aquí porque el CSS de antes le pone estilos a todo <input> y <select>
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.bg, borderRadius: 10, minHeight: 48,
          // Texto largo: el alto lo dan los renglones
          '&.MuiInputBase-multiline': { padding: '10px 12px', '& textarea': { height: 'auto', minHeight: 0, padding: 0, border: 0, borderRadius: 0, resize: 'vertical' } },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: tokens.line },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: tokens.muted },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: tokens.brand, borderWidth: 2 },
        },
        input: {
          boxSizing: 'border-box', height: 46, minHeight: 0, padding: '10px 12px', border: 0, borderRadius: 'inherit', background: 'none',
          '&:focus': { outline: 'none' },
          '&::placeholder': { color: tokens.muted, opacity: 0.7 },
        },
      },
    },
    MuiNativeSelect: {
      styleOverrides: {
        select: {
          boxSizing: 'border-box', height: 46, minHeight: 0, padding: '10px 32px 10px 12px', border: 0, borderRadius: 'inherit', background: 'none',
          '&:focus': { outline: 'none', background: 'none', borderRadius: 'inherit' },
        },
      },
    },
    MuiFormLabel: { styleOverrides: { root: { fontSize: 14, color: tokens.muted, lineHeight: 1.4, '&.Mui-focused': { color: tokens.muted } } } },
    // Chips de pestañas y de un toque: 44 px (36 px las pequeñas), con borde; la activa en verde
    MuiChip: {
      styleOverrides: {
        root: {
          height: 44, borderRadius: 999, fontSize: 14, fontWeight: 600, fontFamily: FUENTE,
          variants: [
            { props: { size: 'small' }, style: { height: 36, fontSize: 13, '& .MuiChip-label': { paddingLeft: 10, paddingRight: 10 } } },
            { props: { variant: 'outlined' }, style: { borderColor: tokens.line, backgroundColor: tokens.surface, color: tokens.ink } },
          ],
        },
        label: { paddingLeft: 14, paddingRight: 14 },
      },
    },
    MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44, borderRadius: 10, color: tokens.ink } } },
    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0, square: true },
      styleOverrides: { root: { backgroundColor: 'transparent', backgroundImage: 'none', '&::before': { display: 'none' } } },
    },
    MuiAccordionSummary: { styleOverrides: { root: { minHeight: 44, padding: 0, font: 'inherit', fontWeight: 700 }, content: { margin: 0 } } },
    MuiAccordionDetails: { styleOverrides: { root: { padding: '0 0 8px' } } },
  },
});
