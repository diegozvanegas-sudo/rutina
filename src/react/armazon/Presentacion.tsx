// Presentación de la app en la pantalla de entrar (lo primero que ve quien abre el enlace): qué es, para quién, cómo
// funciona y cómo pedir acceso. Las tres muestras se pueden tocar (anotar una serie con su descanso, ver a cada cliente,
// cambiar de ejercicio en el progreso), los pasos avanzan solos y cada extra dice qué hace. Todo lo que dice es lo que la
// app hace hoy: nada de cifras, precios ni testimonios inventados, y las muestras dicen que son un ejemplo.
// Disposición: celular, el titular, el formulario y lo demás debajo; desde 900 px, el formulario fijo a la derecha;
// desde 1200 px, una cuadrícula de 12 columnas a lo ancho.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, Button, ButtonBase, Chip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { unoRM } from '../../gym.js';
import { tokens } from '../tema';

// WhatsApp para pedir acceso (solo dígitos, con indicativo: 57…). Vacío = no se muestra el botón
export const CONTACTO_WHATSAPP = '';

type Sx = SxProps<Theme>;
const MEDIANA = '@media (min-width: 640px)', ANCHA = '@media (min-width: 900px)', GRANDE = '@media (min-width: 1200px)', ANGOSTA = '@media (max-width: 899px)';
const quieto = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const coma = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',');
const DEGRADADO = `linear-gradient(90deg, ${tokens.brand}, ${tokens.prAzul})`;
const lista = (sx?: Sx) => [{ listStyle: 'none', m: 0, p: 0 }, ...(Array.isArray(sx) ? sx : [sx])] as Sx;

/** Aparece suave al llegar a la pantalla (nada si el celular pide menos movimiento) */
function Aparece({ children, sx, component = 'section', retraso = 0, ...resto }: { children: ReactNode; sx?: Sx; component?: React.ElementType; retraso?: number; id?: string; 'aria-labelledby'?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [visto, setVisto] = useState(() => quieto() || typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (visto || !ref.current) return;
    const o = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setVisto(true); o.disconnect(); } }, { rootMargin: '0px 0px -8% 0px' });
    o.observe(ref.current);
    return () => o.disconnect();
  }, [visto]);
  return (
    <Box ref={ref} component={component} {...resto}
      sx={[{ opacity: visto ? 1 : 0, transform: visto ? 'none' : 'translateY(14px)', transition: `opacity .6s ease ${retraso}s, transform .6s ease ${retraso}s` }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
    </Box>
  );
}

// ---------- Las muestras ----------
const PANTALLA = {
  position: 'relative', display: 'grid', gap: '10px', alignContent: 'start', p: '14px', borderRadius: '18px', minHeight: 250,
  background: `linear-gradient(180deg, ${tokens.surface}, ${tokens.bg})`, border: 1, borderColor: 'divider',
  boxShadow: `0 18px 40px ${tokens.prSombraFuerte}, inset 0 1px 0 ${tokens.prBrilloInterno}`,
  [GRANDE]: { minHeight: 290 },
  '@media (prefers-reduced-motion: no-preference)': { transition: 'transform .25s ease', 'figure:hover > &': { transform: 'translateY(-4px)' } },
};
const CHIQUITO = { px: '8px', py: '2px', borderRadius: '999px', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' };

function Muestra({ titulo, nombre, extra = false, children }: { titulo: string; nombre: string; extra?: boolean; children: ReactNode }) {
  return (
    <Box component="figure" aria-label={nombre} sx={[{ m: 0, display: 'grid', gridTemplateRows: 'auto 1fr', gap: '8px' }, extra ? { '@media (min-width: 640px) and (max-width: 1199px)': { gridColumn: '1 / -1' } } : null]}>
      <Box component="figcaption" sx={{ color: 'text.secondary', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{titulo}</Box>
      <Box sx={PANTALLA}>{children}</Box>
    </Box>
  );
}
const Cabeza = ({ titulo, lado }: { titulo: ReactNode; lado: string }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}><b>{titulo}</b><Box component="span" sx={{ color: 'text.secondary', fontSize: 13 }}>{lado}</Box></Box>
);

// Gym: se escogen las reps, se anota la serie, corre el descanso y se ve si fue récord (con la fórmula del Gym)
const PESO = 62.5, RECORD = 72.5, DESCANSO = 150;
function MuestraGym() {
  const [reps, setReps] = useState(5);
  const [hecha, setHecha] = useState(false);
  const [falta, setFalta] = useState(DESCANSO);
  useEffect(() => {
    if (!hecha || falta <= 0) return;
    const t = setTimeout(() => setFalta((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [hecha, falta]);
  const fuerza = unoRM(PESO, reps) as number, record = fuerza > RECORD;
  const reloj = Math.floor(falta / 60) + ':' + String(falta % 60).padStart(2, '0');
  const cambiar = (d: number) => setReps((r) => Math.min(8, Math.max(3, r + d)));
  const paso = { minWidth: 34, minHeight: 42, borderRadius: '10px', fontSize: 20, color: 'text.primary' };
  return (
    <Muestra titulo="Así anotas en el gym · pruébalo" nombre="Ejemplo de la pantalla del Gym">
      <Cabeza titulo="Press plano" lado="Pecho" />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: 14 }}>
        <Box component="span" sx={{ ...CHIQUITO, borderRadius: '6px', bgcolor: tokens.topFondo, color: tokens.topInk }}>TOP</Box><span>1×4-7</span>
        <Box component="span" sx={{ ml: 'auto', px: '10px', py: '2px', borderRadius: '999px', bgcolor: hecha ? 'primary.main' : tokens.surface2, color: hecha ? 'primary.contrastText' : 'text.primary', transition: 'background-color .3s' }}>{hecha ? 1 : 0} / 1</Box>
      </Box>
      <Box component="p" sx={{ m: 0, fontSize: 14 }}>🎯 Hoy: <Box component="b" sx={{ color: tokens.prAzul }}>{coma(PESO)} kg × 5 ⬆</Box> <Box component="span" sx={{ color: 'text.secondary' }}>· último 60 kg · 7</Box></Box>
      {hecha ? (
        <Button onClick={() => { setHecha(false); setFalta(DESCANSO); }} color="secondary" sx={{ minHeight: 42, fontSize: 14 }}>✓ {reps} reps anotadas · otra vez</Button>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', gap: '8px' }}>
          <Box role="group" aria-label="Reps" sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: '10px' }}>
            <ButtonBase aria-label="Una rep menos" onClick={() => cambiar(-1)} sx={paso}>−</ButtonBase>
            <Box component="span" aria-live="polite" sx={{ minWidth: 44, textAlign: 'center', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{reps} <Box component="small" sx={{ color: 'text.secondary', fontWeight: 400 }}>reps</Box></Box>
            <ButtonBase aria-label="Una rep más" onClick={() => cambiar(1)} sx={paso}>＋</ButtonBase>
          </Box>
          <Button onClick={() => setHecha(true)} sx={{ minHeight: 42, fontSize: 14, fontWeight: 800 }}>＋ Serie 1 y descanso</Button>
        </Box>
      )}
      <Box component="p" aria-live="polite" sx={{ m: 0, color: hecha && record ? 'primary.main' : 'warning.main', fontWeight: 700, fontSize: 14 }}>
        {!hecha ? '🏆 Récord: fuerza estimada ' + coma(RECORD) + ' kg'
          : record ? '🏆 ¡Nuevo récord! Fuerza estimada ' + coma(fuerza) + ' kg (antes ' + coma(RECORD) + ')'
            : '💪 Fuerza estimada ' + coma(fuerza) + ' kg · tu récord sigue en ' + coma(RECORD)}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '8px 12px', borderRadius: '12px', bgcolor: tokens.prReloj, border: 1, borderColor: 'primary.main', opacity: hecha ? 1 : 0.6, transition: 'opacity .3s' }}>
        <Box component="span" sx={{ color: 'text.secondary', fontSize: 13 }}>{!hecha ? 'Descanso' : falta > 0 ? 'Descansando…' : '¡A la siguiente serie!'}</Box>
        <Box component="b" sx={{ color: 'primary.main', fontSize: 24, fontVariantNumeric: 'tabular-nums' }}>{reloj}</Box>
      </Box>
    </Muestra>
  );
}

// Entrenador: cada cliente muestra su constancia por semana
const CLIENTES: { n: string; s: string; e: string; pronto?: boolean; semanas: [string, number][] }[] = [
  { n: 'Ana', s: 'Semana 3 · Base', e: 'Al día', semanas: [['S1', 70], ['S2', 85], ['S3', 90]] },
  { n: 'Juan', s: 'Semana 6 · Progresión', e: 'Paga pronto', pronto: true, semanas: [['S2', 80], ['S3', 74], ['S4', 92], ['S5', 88], ['S6', 60]] },
  { n: 'Laura', s: 'Check-in nuevo 📥', e: 'Al día', semanas: [['S1', 62], ['S2', 80], ['S3', 74], ['S4', 92], ['S5', 88]] },
];
function MuestraCoach() {
  const [ver, setVer] = useState(0);
  const c = CLIENTES[ver];
  return (
    <Muestra titulo="Así ves a tus clientes · toca uno" nombre="Ejemplo del tablero del entrenador">
      <Cabeza titulo="Tus clientes" lado="ejemplo" />
      <Box role="group" aria-label="Clientes de ejemplo" sx={{ display: 'grid' }}>
        {CLIENTES.map((x, i) => (
          <ButtonBase key={x.n} aria-pressed={i === ver} onClick={() => setVer(i)}
            sx={{ display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) auto', gap: '10px', alignItems: 'center', textAlign: 'left', p: '6px', mx: '-6px', borderBottom: 1, borderColor: 'divider', borderRadius: '8px', transition: 'background-color .2s', bgcolor: i === ver ? tokens.surface2 : 'transparent', '&:hover': { bgcolor: tokens.surface2 } }}>
            <Box component="span" aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 32, height: 32, borderRadius: '50%', fontWeight: 800, background: `linear-gradient(135deg, ${tokens.prAvatarA}, ${tokens.prAvatarB})`, outline: i === ver ? `2px solid ${tokens.brand}` : 'none' }}>{x.n[0]}</Box>
            <span><b>{x.n}</b><Box component="small" sx={{ display: 'block', color: 'text.secondary', fontSize: 12 }}>{x.s}</Box></span>
            <Box component="span" sx={{ ...CHIQUITO, bgcolor: x.pronto ? tokens.amarilloFondo : tokens.brandSoft, color: x.pronto ? 'warning.main' : 'primary.main' }}>{x.e}</Box>
          </ButtonBase>
        ))}
      </Box>
      <Box component="p" aria-live="polite" sx={{ m: 0, fontSize: 13, color: 'text.secondary' }}>Constancia de <b>{c.n}</b> por semana</Box>
      <Box aria-hidden="true" sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', alignItems: 'end', height: 64, m: '0 0 14px' }}>
        {Array.from({ length: 5 }, (_, i) => c.semanas[i]).map((s, i) => (
          <Box key={i} sx={{ position: 'relative', height: s ? s[1] + '%' : '0%', borderRadius: '6px 6px 2px 2px', background: `linear-gradient(180deg, ${tokens.prAzul}, ${tokens.prAzulTenue})`, transition: 'height .45s ease' }}>
            {s ? <Box component="i" sx={{ position: 'absolute', bottom: -16, left: 0, right: 0, textAlign: 'center', fontStyle: 'normal', fontSize: 10, color: 'text.secondary' }}>{s[0]}</Box> : null}
          </Box>
        ))}
      </Box>
    </Muestra>
  );
}

// Progreso: tres líneas de ejemplo; se cambia de una a otra y cada punto dice su semana y su valor
const LINEAS: Record<string, { titulo: string; unidad: string; valores: number[]; consejo: [string, string] }> = {
  sentadilla: { titulo: 'Fuerza: sentadilla', unidad: 'kg', valores: [80, 82.5, 85, 90, 95, 100], consejo: ['⬆ Toca subir peso', 'en sentadilla la próxima semana'] },
  press: { titulo: 'Fuerza: press plano', unidad: 'kg', valores: [50, 52.5, 55, 55, 57.5, 62.5], consejo: ['⬆ Toca subir peso', 'en press plano la próxima semana'] },
  peso: { titulo: 'Tu peso', unidad: 'kg', valores: [78, 77.6, 77.1, 76.8, 76.2, 75.6], consejo: ['▼ Vas bajando a tu ritmo', 'sin perder fuerza'] },
};
const W = 240, ALTO = 90, X = (i: number) => 4 + i * ((W - 8) / 5);
function MuestraProgreso() {
  const [linea, setLinea] = useState('sentadilla');
  const [punto, setPunto] = useState(5);
  const l = LINEAS[linea], min = Math.min(...l.valores), max = Math.max(...l.valores);
  const Y = (v: number) => 76 - ((v - min) / (max - min || 1)) * 54;
  const pts = l.valores.map((v, i) => X(i) + ' ' + Y(v));
  const d = 'M' + pts.join(' L'), area = d + ` L${X(5)} 88 L4 88 Z`;
  const anim = { transition: 'd .5s ease, cx .5s ease, cy .5s ease' };
  return (
    <Muestra titulo="Así ves cómo mejoras · cambia de ejercicio" nombre="Ejemplo de la pantalla de progreso" extra>
      <Cabeza titulo={l.titulo} lado="ejemplo" />
      <Box role="group" aria-label="Qué ver" sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {([['sentadilla', 'Sentadilla'], ['press', 'Press plano'], ['peso', 'Peso']] as const).map(([id, t]) => (
          <Chip key={id} size="small" clickable label={t} aria-pressed={linea === id} color={linea === id ? 'primary' : 'default'} variant={linea === id ? 'filled' : 'outlined'} onClick={() => { setLinea(id); setPunto(5); }} />
        ))}
      </Box>
      <Box component="svg" viewBox={`0 0 ${W} ${ALTO}`} role="img" aria-label={l.titulo + ': de ' + coma(l.valores[0]) + ' a ' + coma(l.valores[5]) + ' ' + l.unidad + ' en 6 semanas'} sx={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        <defs><linearGradient id="pr-relleno" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={tokens.brand} stopOpacity=".35" /><stop offset="1" stopColor={tokens.brand} stopOpacity="0" /></linearGradient></defs>
        <Box component="path" d={area} fill="url(#pr-relleno)" sx={anim} />
        <Box component="path" d={d} fill="none" stroke={tokens.brand} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" sx={anim} />
        {l.valores.map((v, i) => (
          <g key={i} role="button" tabIndex={0} aria-label={'Semana ' + (i + 1) + ': ' + coma(v) + ' ' + l.unidad} aria-pressed={punto === i} style={{ cursor: 'pointer', outline: 'none' }}
            onClick={() => setPunto(i)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPunto(i); } }}>
            <circle cx={X(i)} cy={Y(v)} r={12} fill="transparent" />
            <Box component="circle" cx={X(i)} cy={Y(v)} r={punto === i ? 6 : 3.5} fill={punto === i ? tokens.brand : tokens.surface} stroke={tokens.brand} strokeWidth={2} sx={{ ...anim, transition: anim.transition + ', r .2s ease' }} />
          </g>
        ))}
      </Box>
      <Box component="p" aria-live="polite" sx={{ m: 0, fontSize: 13, color: 'text.secondary' }}>Semana {punto + 1}: <Box component="b" sx={{ color: 'text.primary' }}>{coma(l.valores[punto])} {l.unidad}</Box></Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {[['Peso (7 días)', '▼ 0,6 kg'], ['Récords del mes', '3 🏆'], ['Sueño', '7,4 h']].map(([t, v]) => (
          <Box key={t} sx={{ display: 'grid', gap: '2px', p: '8px', borderRadius: '10px', bgcolor: tokens.surface2 }}><Box component="small" sx={{ color: 'text.secondary', fontSize: 11 }}>{t}</Box><Box component="b" sx={{ fontSize: 15 }}>{v}</Box></Box>
        ))}
      </Box>
      <Box component="p" sx={{ m: 0, fontSize: 14 }}><Box component="b" sx={{ color: tokens.prAzul }}>{l.consejo[0]}</Box> <Box component="span" sx={{ color: 'text.secondary' }}>{l.consejo[1]}</Box></Box>
    </Muestra>
  );
}

// ---------- Los bloques ----------
const BLOQUE = {
  position: 'relative', bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: '18px', p: '20px', display: 'grid', gap: '12px', overflow: 'hidden',
  '& h2': { m: 0, fontSize: 'clamp(20px, 2.4vw, 26px)', lineHeight: 1.2, textWrap: 'balance' },
  '& p': { m: 0, color: 'text.secondary', lineHeight: 1.55 },
};
const Kicker = ({ children, color = tokens.brand }: { children: ReactNode; color?: string }) => (
  <Box component="p" sx={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: `${color} !important` }}>{children}</Box>
);
const SMALL = { display: 'block', color: 'text.secondary', fontSize: 14, lineHeight: 1.45, mt: '2px' };

function Puntos({ items, suave }: { items: [string, string, string][]; suave: string }) {
  return (
    <Box component="ul" sx={lista({ display: 'grid', gap: '6px', [MEDIANA]: { gridTemplateColumns: '1fr 1fr' } })}>
      {items.map(([ic, t, x]) => (
        <Box component="li" key={t} sx={{ display: 'grid', gridTemplateColumns: '42px minmax(0, 1fr)', gap: '12px', alignItems: 'start', p: '10px', borderRadius: '12px', transition: 'background-color .15s', '&:hover': { bgcolor: tokens.surface2 }, '&:hover > span:first-of-type': { transform: 'scale(1.08) rotate(-4deg)' } }}>
          <Box component="span" aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 42, height: 42, borderRadius: '12px', bgcolor: suave, border: 1, borderColor: 'divider', fontSize: 20, transition: 'transform .2s ease' }}>{ic}</Box>
          <span><b style={{ display: 'block' }}>{t}</b><Box component="small" sx={SMALL}>{x}</Box></span>
        </Box>
      ))}
    </Box>
  );
}

const PASOS: [string, string][] = [
  ['Tu entrenador te arma el plan', 'Rutina, ciclo y comidas pensados para ti.'],
  ['Lo usas cada día', 'Entrenas, anotas y mandas tu check-in desde el celular.'],
  ['Él ve tu avance y lo ajusta', 'Sin mensajes perdidos ni planes en papel.'],
];
// Los pasos avanzan solos cada 4 s hasta que la persona toca uno (y nunca si pide menos movimiento)
function Pasos() {
  const [activo, setActivo] = useState(0);
  const [tocado, setTocado] = useState(() => quieto());
  useEffect(() => {
    if (tocado) return;
    const t = setInterval(() => setActivo((a) => (a + 1) % PASOS.length), 4000);
    return () => clearInterval(t);
  }, [tocado]);
  return (
    <Box component="ol" sx={lista({
      position: 'relative', display: 'grid', gap: '12px',
      [ANCHA]: { gridTemplateColumns: 'repeat(3, 1fr)', '&::before': { content: '""', position: 'absolute', top: 31, left: '16%', right: '16%', height: 2, background: DEGRADADO, opacity: 0.5 } },
      [GRANDE]: { '&::before': { top: 37 } },
    })}>
      {PASOS.map(([t, x], i) => (
        <li key={t} style={{ position: 'relative' }}>
          <ButtonBase aria-current={activo === i ? 'step' : undefined} onClick={() => { setActivo(i); setTocado(true); }}
            sx={{ width: '100%', height: '100%', display: 'block', textAlign: 'left', p: '14px', borderRadius: '14px', bgcolor: 'background.default', border: 1, borderColor: activo === i ? 'primary.main' : 'divider', transition: 'border-color .3s, transform .3s', transform: activo === i ? 'translateY(-2px)' : 'none', [GRANDE]: { p: '20px' } }}>
            <Box component="span" aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 34, height: 34, mb: '10px', borderRadius: '50%', fontWeight: 900, boxShadow: `0 0 0 4px ${tokens.bg}`, transition: 'all .3s',
              ...(activo === i ? { background: `linear-gradient(135deg, ${tokens.brand}, ${tokens.prAzul})`, color: tokens.azulInk } : { bgcolor: tokens.surface2, color: 'text.secondary' }) }}>{i + 1}</Box>
            <b style={{ display: 'block' }}>{t}</b><Box component="small" sx={SMALL}>{x}</Box>
          </ButtonBase>
        </li>
      ))}
    </Box>
  );
}

const EXTRAS: [string, string][] = [
  ['☀️ Hábitos de la mañana', 'Tu lista de cada mañana para marcar al despertar.'],
  ['🎯 Metas del día', 'Lo que quieres lograr hoy, para marcarlo al cumplirlo.'],
  ['💊 Suplementos', 'Qué tomas, cuándo, y si ya lo tomaste hoy.'],
  ['🔔 Recordatorios', 'Pagos, citas y el mantenimiento del carro o la moto.'],
  ['💰 Finanzas', 'Ingresos, gastos, presupuesto y deudas del mes.'],
  ['🎓 Cursos sin internet', 'Cursos completos para estudiar a tu ritmo, aunque no tengas señal.'],
];
function Extras() {
  const [ver, setVer] = useState<number | null>(null);
  return (
    <>
      <Box role="group" aria-label="Qué más trae" sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {EXTRAS.map(([t], i) => (
          <Chip key={t} clickable label={t} aria-pressed={ver === i} color={ver === i ? 'primary' : 'default'} variant={ver === i ? 'filled' : 'outlined'} onClick={() => setVer(ver === i ? null : i)} sx={{ fontSize: 14, height: 36 }} />
        ))}
      </Box>
      <Box component="p" aria-live="polite" sx={{ minHeight: '1.55em' }}>{ver === null ? 'Toca uno para ver qué hace.' : EXTRAS[ver][1]}</Box>
    </>
  );
}

const CTA = { minHeight: 50, px: '22px', py: '12px', fontWeight: 800 };

/** La presentación con el formulario (Entrar o el candado) en su lugar: después del titular */
export default function Presentacion({ formulario }: { formulario: ReactNode }) {
  const wa = CONTACTO_WHATSAPP ? 'https://wa.me/' + CONTACTO_WHATSAPP + '?text=' + encodeURIComponent('Hola, quiero información de la app Rutina') : '';
  // El enlace no cambia la dirección (#como-funciona no es una sección de la app): solo baja hasta los pasos
  const verComo = () => { const el = document.getElementById('como-funciona'); if (el) el.scrollIntoView({ behavior: quieto() ? 'auto' : 'smooth', block: 'start' }); };
  return (
    <>
      <Aparece sx={{ position: 'relative', display: 'grid', gap: '14px', p: '22px 4px 8px', isolation: 'isolate',
        '&::before': { content: '""', position: 'absolute', inset: '-40px 0 auto', height: 360, zIndex: -1, pointerEvents: 'none',
          background: `radial-gradient(28% 38% at 30% 50%, ${tokens.prBrilloVerde}, transparent), radial-gradient(24% 34% at 74% 42%, ${tokens.prBrilloAzul}, transparent)` },
        [ANGOSTA]: { pb: 0 },
        [GRANDE]: { gridColumn: '1 / 8', gridRow: 1, alignSelf: 'center', py: '30px', px: 0, '&::before': { inset: '-60px -40px auto', height: 460 } } }}>
        <Box component="p" sx={{ m: 0, justifySelf: 'start', p: '6px 12px', borderRadius: '999px', border: 1, borderColor: 'divider', bgcolor: 'background.paper', fontSize: 14, fontWeight: 700 }}><span aria-hidden="true">🏋️</span> Rutina · gym, comida y progreso</Box>
        <Box component="h1" sx={{ m: 0, fontSize: 'clamp(32px, 5.2vw, 56px)', lineHeight: 1.04, letterSpacing: '-.02em', textWrap: 'balance', [GRANDE]: { fontSize: 'clamp(48px, 4.6vw, 76px)' } }}>
          Entrena con un plan.<br /><Box component="span" sx={{ background: DEGRADADO, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Mira cómo mejoras.</Box>
        </Box>
        <Box component="p" sx={{ m: 0, color: 'text.secondary', fontSize: 18, lineHeight: 1.55, maxWidth: '58ch', [GRANDE]: { fontSize: 20 } }}>Tu rutina, tu comida y tu progreso en un solo lugar, para ti y para el entrenador que te acompaña. Anotas cada serie en segundos y funciona sin señal en el gym.</Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {wa ? <Button href={wa} target="_blank" rel="noopener" sx={CTA}>💬 Quiero usarla</Button> : null}
          <Button color="secondary" onClick={verComo} sx={CTA}>Ver cómo funciona ↓</Button>
        </Box>
        <Box component="ul" sx={lista({ mt: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px 16px', color: 'text.secondary', fontSize: 14, [ANGOSTA]: { display: 'none' } })}>
          <li>📶 Funciona sin internet</li><li>📱 Celular y computador</li><li>🔒 Tus datos son tuyos</li>
        </Box>
      </Aparece>

      {formulario}

      <Aparece component="div" retraso={0.08} sx={{ display: 'grid', gap: '14px', [MEDIANA]: { gridTemplateColumns: '1fr 1fr' }, [GRANDE]: { gridColumn: '1 / -1', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px' } }}>
        <MuestraGym /><MuestraCoach /><MuestraProgreso />
      </Aparece>

      <Aparece sx={[BLOQUE, { borderTop: `3px solid ${tokens.brand}`, [GRANDE]: { gridColumn: '1 / 7' } }]}>
        <Kicker>Para quien entrena</Kicker><h2>Todo tu entreno, sin papel ni hojas de cálculo</h2>
        <Puntos suave={tokens.prVerdeSuave} items={[
          ['⏱️', 'Anota cada serie en segundos', 'Top set y back-off, descanso automático, reps en reserva y tu meta de hoy en cada ejercicio.'],
          ['🏆', 'Mira cómo mejoras', 'Récords, fuerza estimada semana a semana y aviso cuando toca subir el peso o cuando te estancas.'],
          ['🥗', 'Comida a tu medida', 'Planes por tipo de día (pierna, torso, descanso) que se ajustan a tu peso y tu objetivo.'],
          ['📆', 'Un ciclo con sentido', '12 semanas por fases: base, progresión, descarga e intensificación.'],
        ]} />
      </Aparece>

      <Aparece retraso={0.08} sx={[BLOQUE, { borderTop: `3px solid ${tokens.prAzul}`, [GRANDE]: { gridColumn: '7 / 13' } }]}>
        <Kicker color={tokens.prAzul}>Para entrenadores</Kicker><h2>Tus clientes, sus planes y sus pagos en un tablero</h2>
        <Puntos suave={tokens.prAzulSuave} items={[
          ['📚', 'Planes en minutos', 'Arma rutina, ciclo y comidas desde tus plantillas y ajústalos a cada persona.'],
          ['📲', 'El plan le llega a su app', 'Tu cliente lo usa en su Gym y su Dieta; tú ves su avance, su peso y sus check-ins.'],
          ['✅', 'Seguimiento semanal', 'Check-ins, medidas y pruebas de fuerza con su evolución.'],
          ['💳', 'Cobros al día', 'Precio, frecuencia y aviso de quién paga esta semana.'],
          ['📤', 'Comparte como quieras', 'Por WhatsApp, en PDF o como imagen, aunque tu cliente no use la app.'],
          ['👥', 'Todo a la vista', 'Quién está activo, quién te debe y en qué semana del ciclo va cada uno.'],
        ]} />
      </Aparece>

      <Aparece id="como-funciona" sx={[BLOQUE, { scrollMarginTop: '16px', [GRANDE]: { gridColumn: '1 / -1', p: '28px' } }]}>
        <Kicker>Cómo funciona</Kicker><h2>Tres pasos, cada semana</h2>
        <Pasos />
      </Aparece>

      <Aparece sx={[BLOQUE, { gridTemplateColumns: 'auto minmax(0, 1fr)', alignItems: 'start', borderColor: 'primary.main', background: `linear-gradient(135deg, ${tokens.prVerdeLeve}, ${tokens.surface} 60%)`, [GRANDE]: { gridColumn: '1 / 7' } }]}>
        <Box component="span" aria-hidden="true" sx={{ display: 'grid', placeItems: 'center', width: 52, height: 52, borderRadius: '16px', bgcolor: tokens.brandSoft, fontSize: 26 }}>🔒</Box>
        <Box sx={{ display: 'grid', gap: '6px' }}><h2>Tus datos son tuyos</h2><p>Cada persona ve solo lo suyo. Tu entrenador (y el administrador de la app) ve únicamente el resumen de avance que aceptas compartir, nunca el resto de tus datos, y puedes dejar de compartir cuando quieras.</p></Box>
      </Aparece>

      <Aparece retraso={0.08} sx={[BLOQUE, { [GRANDE]: { gridColumn: '7 / 13' } }]}>
        <Kicker>Y además</Kicker>
        <Extras />
      </Aparece>

      <Aparece sx={{ display: 'grid', gap: '10px', p: '26px 22px', borderRadius: '20px', background: `linear-gradient(135deg, ${tokens.prFinalA}, ${tokens.prFinalB})`, border: `1px solid ${tokens.prBordeClaro}`, boxShadow: `0 18px 40px ${tokens.prSombra}`,
        '& h2': { m: 0, fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.15 }, '& p': { m: 0, color: tokens.prClaroTexto, lineHeight: 1.55, maxWidth: '60ch' },
        [GRANDE]: { gridColumn: '1 / -1', justifyItems: 'center', textAlign: 'center', p: '48px 32px', '& p': { maxWidth: '70ch' } } }}>
        <h2>¿Listo para entrenar con un plan?</h2>
        {wa ? (<>
          <p>Escríbenos y te contamos cómo empezar, como persona o como entrenador.</p>
          <Button href={wa} target="_blank" rel="noopener" sx={{ ...CTA, justifySelf: 'start', bgcolor: tokens.prClaro, color: tokens.prClaroInk, '&:hover': { bgcolor: tokens.prClaro }, [GRANDE]: { justifySelf: 'center' } }}>💬 Escribir por WhatsApp</Button>
        </>) : <p>Pídele el acceso a tu entrenador. Si eres entrenador y quieres llevar a tus clientes aquí, pide tu cuenta a quien te compartió este enlace.</p>}
      </Aparece>
    </>
  );
}
