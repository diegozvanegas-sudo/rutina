// ⚡ Energía: 46 prácticas cortas para subir o bajar la energía según el momento del día (las 8 de un video de WhatsApp, con lo
// que sí se sabe, y 38 más). Una fila por práctica; al tocarla se abre con los pasos, por qué funciona, el "Ojo" cuando el video
// exagera, ✓ Lo hice hoy, ⭐ favorita y ⏱ empezar. React pinta; el contenido y lo guardado están en src/energia.js
import { useState } from 'react';
import { Box, Button, ButtonBase, Card, Chip } from '@mui/material';
import { iso } from '../../fechas.js';
import { toast } from '../../ui.js';
import { iniciar } from '../../temporizador.js';
import { PRACTICAS, MOMENTOS, hechosHoy, marcar, favoritos, alternarFavorito, racha, masHechas, unaParaAhora, momentoDe } from '../../energia.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { TituloPantalla, Nota } from '../ui/Textos';
import { Cifras } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'energia';
const FILTROS: [string, string][] = [['todas', 'Todas'], ['ahora', '🕐 Para ahora'], ...Object.entries(MOMENTOS), ['fav', '⭐ Favoritas'], ['video', '🎬 Las del video']];
const minutos = (m: number) => (m >= 60 ? Math.round(m / 60) + ' h' : m + ' min');

function Practica({ x, abierta, hecha, fav, alTocar }: { x: Fin; abierta: boolean; hecha: boolean; fav: boolean; alTocar: () => void }) {
  return (
    <Box data-t="practica" data-id={x.id} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <ButtonBase aria-expanded={abierta} onClick={alTocar}
        sx={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', minHeight: 56, py: '8px', font: 'inherit', color: 'text.primary', textAlign: 'left', borderRadius: '8px', '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
        <Box component="span" aria-hidden="true" sx={{ flex: 'none', width: 32, fontSize: 22, textAlign: 'center' }}>{x.ic}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{x.t}</Box>
          <Box component="small" sx={{ color: 'text.secondary', fontSize: 12 }}>{minutos(x.min)} · {(x.m as string[]).map((m) => (MOMENTOS as Fin)[m].split(' ')[0]).join(' ')}{x.video ? ' · 🎬 del video' : ''}{fav ? ' · ⭐' : ''}</Box>
        </Box>
        {hecha ? <Box component="span" aria-label="Hecha hoy" sx={{ flex: 'none', fontWeight: 800, color: 'success.main' }}>✓</Box> : null}
      </ButtonBase>
      {abierta ? (
        <Box sx={{ display: 'grid', gap: '10px', p: '0 0 14px 42px' }}>
          <Box component="ol" sx={{ m: 0, pl: '20px', display: 'grid', gap: '4px', fontSize: 14 }}>{(x.pasos as string[]).map((s) => <li key={s}>{s}</li>)}</Box>
          <Box sx={{ p: '8px 10px', borderRadius: '10px', bgcolor: tokens.surface2, fontSize: 14 }}><b>Por qué funciona:</b> {x.porque}</Box>
          {x.ojo ? <Box data-t="ojo" sx={{ p: '8px 10px', borderRadius: '10px', bgcolor: tokens.amarilloFondo, color: 'warning.main', fontSize: 14 }}>⚠️ <b>Ojo:</b> {x.ojo}</Box> : null}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button data-t="hecha" color={hecha ? 'secondary' : 'primary'} onClick={() => { const si = marcar(x.id); toast(si ? '✓ ' + x.t + ': hecha hoy' : 'Desmarcada'); }} sx={{ minHeight: 44 }}>{hecha ? '↺ Desmarcar' : '✓ Lo hice hoy'}</Button>
            <Button color="secondary" onClick={() => { iniciar('energia', x.min * 60, x.ic + ' ' + x.t); toast('⏱ ' + minutos(x.min) + ': ' + x.t); }} sx={{ minHeight: 44 }}>⏱ Empezar ({minutos(x.min)})</Button>
            <Button color="secondary" aria-pressed={fav} onClick={() => alternarFavorito(x.id)} sx={{ minHeight: 44 }}>{fav ? '★ Quitar de favoritas' : '☆ Favorita'}</Button>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}

export default function Energia() {
  const estado = usarEstado() as Fin, hoy = iso(), hechas = hechosHoy(hoy, estado) as string[], favs = favoritos(estado) as string[];
  const [filtro, ponerFiltro] = useState('ahora'), [abierta, ponerAbierta] = useState<string | null>(null), [azar, ponerAzar] = useState(Math.random());
  const hora = new Date().getHours(), momento = momentoDe(hora), sugerida = unaParaAhora(hora, hechas, azar) as Fin;
  const lista = (PRACTICAS as Fin[]).filter((x) => (filtro === 'todas' ? true : filtro === 'ahora' ? x.m.includes(momento) : filtro === 'fav' ? favs.includes(x.id) : filtro === 'video' ? x.video : x.m.includes(filtro)))
    .sort((a, b) => (filtro === 'video' ? a.video - b.video : 0));
  const top = masHechas(hoy, estado) as Fin[], r = racha(hoy, estado) as number;
  return (
    <>
      <TituloPantalla>Energía</TituloPantalla>
      <Card component="section" sx={{ mb: '14px', display: 'grid', gap: '10px' }}>
        <Cifras datos={[{ titulo: 'Hechas hoy', valor: String(hechas.length) }, { titulo: 'Días seguidos', valor: String(r) }, { titulo: 'Prácticas', valor: String(PRACTICAS.length) }]} />
        <Box data-t="sugerida" sx={{ p: '10px 12px', borderRadius: '10px', bgcolor: tokens.subeFondo, display: 'grid', gap: '8px' }}>
          <Box sx={{ fontSize: 14, color: 'text.secondary' }}>Para ahora ({(MOMENTOS as Fin)[momento]}):</Box>
          <Box sx={{ fontSize: 16, fontWeight: 700 }}>{sugerida.ic} {sugerida.t} · {minutos(sugerida.min)}</Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Button onClick={() => { ponerFiltro('todas'); ponerAbierta(sugerida.id); setTimeout(() => document.querySelector('[data-id="' + sugerida.id + '"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50); }} sx={{ minHeight: 44 }}>Ver cómo se hace</Button>
            <Button color="secondary" onClick={() => ponerAzar(Math.random())} sx={{ minHeight: 44 }}>🎲 Otra</Button>
          </Box>
        </Box>
        {top.length ? <Nota sx={{ m: 0 }}>Las que más haces: {top.map((x) => x.ic + ' ' + x.t + ' (' + x.veces + ')').join(' · ')}</Nota> : null}
      </Card>

      <Box role="group" aria-label="Ver" sx={{ display: 'flex', gap: '6px', flexWrap: { xs: 'nowrap', md: 'wrap' }, overflowX: { xs: 'auto', md: 'visible' }, pb: '8px', mb: '6px' }}>
        {FILTROS.map(([v, t]) => { const si = filtro === v; return <Chip key={v} clickable aria-pressed={si} color={si ? 'primary' : 'default'} variant={si ? 'filled' : 'outlined'} label={t} onClick={() => { ponerFiltro(v); ponerAbierta(null); }} sx={{ minHeight: 36, flex: 'none' }} />; })}
      </Box>

      <Card component="section" data-t="practicas" sx={{ mb: '14px', py: '4px' }}>
        {filtro === 'ahora' ? <Nota sx={{ mt: '8px' }}>Las de este momento del día: {(MOMENTOS as Fin)[momento]}.</Nota> : null}
        {lista.map((x) => <Practica key={x.id} x={x} abierta={abierta === x.id} hecha={hechas.includes(x.id)} fav={favs.includes(x.id)} alTocar={() => ponerAbierta(abierta === x.id ? null : x.id)} />)}
        {!lista.length ? <Nota>{filtro === 'fav' ? 'Aún no tienes favoritas: abre una práctica y toca ☆ Favorita.' : 'Nada aquí.'}</Nota> : null}
      </Card>

      <TarjetaPlegable vista={VISTA} clave="🎬 Lo del video, sin filtro" titulo="🎬 Lo del video, sin filtro">
        <Box sx={{ display: 'grid', gap: '8px', fontSize: 14 }}>
          <span>El video habla de "subir tu frecuencia". Lo que sí existe es el <b>estado de tu sistema nervioso</b>: activado (alerta, tenso, con prisa) o en calma. No resuena con "la suerte", pero sí cambia cómo duermes, cuánta energía tienes, cómo decides y cómo rindes en el gym y en la cancha.</span>
          <span>✅ <b>Funcionan</b>: tararear (exhalar largo), la gratitud diaria, ir más despacio, ensayar en la mente lo que vas a hacer y escribir al despertar.</span>
          <span>⚠️ <b>Exageran</b>: la luz no "activa la pineal" con los ojos cerrados (lo útil es la luz de la mañana con los ojos abiertos), y el cerebro sí distingue lo imaginado de lo real.</span>
          <span>❌ <b>Al revés</b>: golpear y gritarle a una almohada no libera la rabia, la alimenta. Muévete y ponle nombre.</span>
          <span>Lo que dice al final sí es cierto: <b>ninguno funciona una sola vez</b>. Elige 2 o 3, márcalos aquí cada día y mira la racha.</span>
          <Nota sx={{ m: 0 }}>Son hábitos de bienestar, no un tratamiento. Si llevas semanas sin energía, con ansiedad o triste la mayor parte del día, habla con un médico o un psicólogo.</Nota>
        </Box>
      </TarjetaPlegable>
    </>
  );
}
