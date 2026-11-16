// 🛡️ Administrar (solo el admin): usuarios y su rol, entrenadores y sus clientes, permisos por usuario y por rol,
// roles y "Ver como". Todo se guarda en Supabase con las acciones de siempre (src/vistas/administrar.js, adm-…): los
// campos y casillas llevan data-cambio, y "Crear" lee su campo por id (por eso lleva data-accion).
import { useEffect, type ReactNode } from 'react';
import { Box, Button, Card, FormControl, FormLabel, IconButton, NativeSelect, OutlinedInput } from '@mui/material';
import { configurada } from '../../nube.js';
import { esAdmin, TIPOS, reglaDe } from '../../permisos.js';
import { piezasAdmin } from '../../vistas/administrar.js';
import { tokens } from '../tema';
import { usarEstado } from '../usarEstado';
import { TarjetaPlegable } from '../ui/TarjetaPlegable';
import { Campo, CampoLista, CampoSolo } from '../ui/Campo';
import { Desplegable } from '../ui/Desplegable';
import { TituloPantalla, Nota, Parrafo } from '../ui/Textos';
import { Opciones } from '../ui/Varios';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Fin = any;
const VISTA = 'administrar';
const A = piezasAdmin as Fin;
const regla = reglaDe as Fin;
const FILA = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' };
const Tarjeta = ({ children, sx }: { children: ReactNode; sx?: object }) => <Card component="section" sx={{ mb: '14px', ...sx }}>{children}</Card>;
const Aviso = ({ children }: { children: ReactNode }) => <Box component="p" sx={{ color: 'warning.main', bgcolor: tokens.amarilloFondo, borderRadius: '10px', p: '8px 10px', fontSize: 14 }}>{children}</Box>;
const COLOR: Record<string, object> = { 'al-dia': { bgcolor: tokens.brandSoft, color: tokens.brand }, pronto: { bgcolor: tokens.amarilloFondo, color: tokens.amarillo } };
const Estado = ({ clase, children }: { clase: string; children: ReactNode }) => (
  <Box component="span" sx={{ fontSize: 12, fontWeight: 800, p: '2px 8px', borderRadius: 999, ml: '6px', whiteSpace: 'nowrap', bgcolor: tokens.surface2, color: tokens.muted, ...COLOR[clase] }}>{children}</Box>
);
const SIN_NADIE = 'Aún no ha entrado nadie más. Cada persona aparece aquí la primera vez que entra a la app.';
// Casilla nativa (marcado = lo ve). Se rehace con lo guardado cada vez que se vuelve a leer o falla un cambio
const Casilla = ({ ve, vuelta, datos }: { ve: boolean; vuelta: number; datos: Record<string, string> }) => (
  <Box component="input" type="checkbox" key={vuelta + ':' + ve} defaultChecked={ve} {...datos} sx={{ width: 22, height: 22, accentColor: tokens.brand, cursor: 'pointer' }} />
);
const TABLA = { width: '100%', borderCollapse: 'collapse', fontSize: 14, '& th, & td': { p: '8px 6px', borderBottom: '1px solid', borderColor: 'divider', textAlign: 'center' }, '& tbody th': { textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap' } };

function usuarios(d: Fin, vuelta: number) {
  if (!d.usuarios.length) return <Nota>{SIN_NADIE}</Nota>;
  return (d.usuarios as Fin[]).map((u) => {
    const admin = u.rol === 'admin', propias = (d.reglas as Fin[]).filter((r) => r.usuario === u.id).length;
    return (
      <Tarjeta key={u.id} sx={{ display: 'grid', gap: '10px' }}>
        <Box sx={{ ...FILA, flexWrap: 'wrap' }}><Box component="b" sx={{ wordBreak: 'break-all' }}>{u.correo}</Box><Nota sx={{ m: 0 }}>Última entrada: {A.cuando(u.ultima)}</Nota></Box>
        <CampoLista etiqueta="Rol" data-cambio="adm-rol" data-u={u.id} defaultValue={u.rol} opciones={(d.roles as Fin[]).map((r) => [r.id, r.nombre] as [string, string])} />
        {admin ? <Nota sx={{ m: 0 }}>El administrador ve todo.</Nota> : (
          <Desplegable titulo={<Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>Excepciones de este usuario ({propias})</Box>}>
            <Nota>Mandan sobre lo de su rol. "Como su rol" quita la excepción.</Nota>
            {(A.elementos() as [string, [string, string][]][]).map(([tipo, lista]) => (
              <div key={tipo}>
                <Box component="h3" sx={{ fontSize: 15, m: '12px 0 6px' }}>{(TIPOS as Record<string, string>)[tipo]}</Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                  {lista.map(([id, nombre]) => {
                    const v = regla(d, tipo, id, { usuario: u.id }), delRol = regla(d, tipo, id, { rol: u.rol }) !== false;
                    return <CampoLista key={id + vuelta} etiqueta={nombre} data-cambio="adm-regla" data-tipo={tipo} data-id={id} data-u={u.id} defaultValue={v === null ? '' : v ? '1' : '0'}
                      opciones={[['', 'Como su rol (' + (delRol ? 've' : 'no ve') + ')'], ['1', 'Ver'], ['0', 'No ver']]} />;
                  })}
                </Box>
              </div>
            ))}
          </Desplegable>
        )}
      </Tarjeta>
    );
  });
}

function porUsuario(d: Fin, vuelta: number) {
  const lista = (d.usuarios as Fin[]).filter((u) => u.rol !== 'admin');
  if (!lista.length) return <Nota>{SIN_NADIE}</Nota>;
  return (
    <>
      <Nota>Marcado = lo ve. Cada persona empieza con lo de su rol; lo que cambies aquí es solo para ella y queda resaltado. Si lo vuelves a dejar como su rol, sigue otra vez al rol. Hoy y Ajustes siempre se ven.</Nota>
      {(A.elementos() as [string, [string, string][]][]).map(([tipo, filas]) => (
        <TarjetaPlegable key={tipo} vista={VISTA} clave={(TIPOS as Record<string, string>)[tipo]} titulo={(TIPOS as Record<string, string>)[tipo]}>
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={TABLA}>
              <thead><tr><th></th>{lista.map((u) => <th key={u.id} title={u.correo}>{A.corto(u.correo)}<br /><small>{A.nombreRol(u.rol)}</small></th>)}</tr></thead>
              <tbody>
                {filas.map(([id, nombre]) => (
                  <tr key={id}>
                    <th>{nombre}</th>
                    {lista.map((u) => {
                      const propia = regla(d, tipo, id, { usuario: u.id }) !== null, delRol = regla(d, tipo, id, { rol: u.rol }) !== false;
                      return (
                        <Box component="td" key={u.id} title={propia ? 'Solo para ' + A.corto(u.correo) + ' (su rol ' + (delRol ? 'lo ve' : 'no lo ve') + ')' : undefined} sx={propia ? { bgcolor: tokens.amarilloFondo } : null}>
                          <Casilla ve={A.veUsuario(u, tipo, id)} vuelta={vuelta} datos={{ 'data-cambio': 'adm-regla-usuario', 'data-tipo': tipo, 'data-id': id, 'data-u': u.id, 'aria-label': A.corto(u.correo) + ' ve ' + nombre }} />
                        </Box>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </TarjetaPlegable>
      ))}
    </>
  );
}

function permisos(d: Fin, vuelta: number) {
  const roles = A.rolesNoAdmin() as Fin[];
  return (
    <>
      <Nota>Marcado = lo ve. Lo nuevo que traiga la app aparece visible para todos hasta que lo quites. Hoy y Ajustes siempre se ven.</Nota>
      {(A.elementos() as [string, [string, string][]][]).map(([tipo, lista]) => (
        <TarjetaPlegable key={tipo} vista={VISTA} clave={(TIPOS as Record<string, string>)[tipo]} titulo={(TIPOS as Record<string, string>)[tipo]}>
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={TABLA}>
              <thead><tr><th></th>{roles.map((r) => <th key={r.id}>{r.nombre}</th>)}</tr></thead>
              <tbody>
                {lista.map(([id, nombre]) => (
                  <tr key={id}>
                    <th>{nombre}</th>
                    {roles.map((r) => <td key={r.id}><Casilla ve={regla(d, tipo, id, { rol: r.id }) !== false} vuelta={vuelta} datos={{ 'data-cambio': 'adm-regla-rol', 'data-tipo': tipo, 'data-id': id, 'data-rol': r.id, 'aria-label': r.nombre + ' ve ' + nombre }} /></td>)}
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </TarjetaPlegable>
      ))}
    </>
  );
}

function roles(d: Fin) {
  const usan = (id: string) => (d.usuarios as Fin[]).filter((u) => u.rol === id).length;
  return (
    <>
      <Tarjeta>
        {(d.roles as Fin[]).map((r) => (
          <Box key={r.id} sx={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '10px', alignItems: 'end', p: '6px 0', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Campo etiqueta={r.id === 'admin' ? 'Administrador (ve todo)' : 'Nombre'} data-cambio="adm-rol-nombre" data-rol={r.id} defaultValue={r.nombre} />
            <Nota sx={{ m: 0, pb: '12px' }}>{usan(r.id)}{usan(r.id) === 1 ? ' usuario' : ' usuarios'}</Nota>
            {['admin', 'estudiante'].includes(r.id) ? <span /> : <IconButton data-accion="adm-rol-borrar" data-rol={r.id} data-nombre={r.nombre} aria-label={'Borrar ' + r.nombre} sx={{ color: 'error.main' }}>🗑</IconButton>}
          </Box>
        ))}
      </Tarjeta>
      <TarjetaPlegable vista={VISTA} clave="＋ Nuevo rol" titulo="＋ Nuevo rol">
        {/* Antes el campo medía 90 px y no se veía lo escrito; ahora ocupa el ancho */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
          <CampoSolo id="adm-rol-nuevo" placeholder="Ej.: Amigos del gym" aria-label="Nombre del rol nuevo" noVaciar />
          <Button data-accion="adm-rol-crear">Crear</Button>
        </Box>
        <Nota>Al borrar un rol, sus usuarios pasan a Estudiante. Administrador y Estudiante no se pueden borrar.</Nota>
      </TarjetaPlegable>
    </>
  );
}

function verComo(d: Fin) {
  return (
    <Tarjeta>
      <Parrafo sx={{ mt: 0 }}>Mira la app como la ve un rol o una persona, sin cambiar de cuenta. Tus datos siguen siendo los tuyos: solo cambia lo que se ve.</Parrafo>
      <FormControl fullWidth sx={{ display: 'grid', gap: '4px' }}>
        <FormLabel htmlFor="adm-ver">Ver como</FormLabel>
        <NativeSelect defaultValue="" input={<OutlinedInput fullWidth />} inputProps={{ id: 'adm-ver', 'data-cambio': 'adm-ver' } as object}>
          <option value="">Elige…</option>
          <optgroup label="Roles">{(A.rolesNoAdmin() as Fin[]).map((r) => <option key={r.id} value={'rol:' + r.id}>{r.nombre}</option>)}</optgroup>
          <optgroup label="Usuarios">{(d.usuarios as Fin[]).filter((u) => u.rol !== 'admin').map((u) => <option key={u.id} value={'u:' + u.id}>{u.correo}</option>)}</optgroup>
        </NativeSelect>
      </FormControl>
    </Tarjeta>
  );
}

function entrenadores(ver: Fin) {
  if (ver.errorEnt) return <Tarjeta><Aviso>No se pudo cargar: {ver.errorEnt}</Aviso><Button data-accion="adm-entrenadores">Reintentar</Button></Tarjeta>;
  if (ver.entrenadores == null) return <Nota>Cargando…</Nota>;
  const lista = ver.entrenadores as Fin[], total = lista.reduce((t, x) => t + x.clientes.filter((c: Fin) => c.estado === 'activo').length, 0);
  return (
    <>
      <TarjetaPlegable vista={VISTA} clave="🧑‍🏫 Entrenadores y sus clientes" titulo="🧑‍🏫 Entrenadores y sus clientes">
        <Nota>{lista.length}{lista.length === 1 ? ' entrenador' : ' entrenadores'} · {total}{total === 1 ? ' cliente activo' : ' clientes activos'}. Como superadmin ves todo: quién es cliente de quién, cuándo se le publicó el plan y el avance que le comparte a su entrenador. Cada entrenador ve solo los suyos y cada cliente solo lo suyo. Para que alguien pueda invitar clientes, dale el rol «Entrenador» en 👥 Usuarios.</Nota>
        <Button color="secondary" data-accion="adm-entrenadores">↻ Actualizar</Button>
      </TarjetaPlegable>
      {lista.map((x, k) => (
        <Tarjeta key={k}>
          <Box sx={{ ...FILA, mb: '6px' }}><b>{x.entrenador}</b><Estado clase="programado">{A.nombreRol(x.rol)}</Estado></Box>
          {x.clientes.length ? (
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: '4px' }}>
              {(x.clientes as Fin[]).map((c, j) => {
                const [clase, t] = A.ESTADO_ASIG[c.estado] || ['programado', c.estado], r = c.resumen, sem = r && r.semanas ? r.semanas[r.semanas.length - 1] : null, ps = (r && r.pesos) || [];
                const avance = r ? [sem ? 'semana ' + sem.n + ': ' + sem.hechas + '/' + sem.plan + ' series' : '', ps.length ? 'peso ' + String(ps[ps.length - 1].peso).replace('.', ',') + ' kg' : '', (r.checkins || []).length ? r.checkins.length + ' check-ins' : '', 'al ' + A.cuando(c.resumen_actualizado)].filter(Boolean).join(' · ') : 'sin avance compartido';
                return (
                  <Box component="li" key={j} sx={{ ...FILA, p: '6px 0', borderBottom: '1px solid', borderColor: 'divider', '& small': { display: 'block', color: 'text.secondary', fontSize: 13 } }}>
                    <span>{c.correo ? c.correo : <i>sin aceptar aún</i>}<small> · {c.aceptado ? 'desde el ' + A.cuando(c.aceptado) : 'invitado el ' + A.cuando(c.creado)} · {c.plan_version ? 'plan «' + ((c.plan && c.plan.nombre) || '') + '» publicado' : 'sin plan publicado'}</small><small>📊 {avance}</small></span>
                    <Estado clase={clase}>{t}</Estado>
                  </Box>
                );
              })}
            </Box>
          ) : <Nota>Sin clientes todavía.</Nota>}
        </Tarjeta>
      ))}
    </>
  );
}

export default function Administrar() {
  usarEstado();
  const ver = A.ver(), d = ver.datos;
  useEffect(() => { A.pedir(); if (d && ver.pestana === 'entrenadores') A.pedirEntrenadores(); });
  const titulo = (
    <Box sx={{ ...FILA, flexWrap: 'wrap' }}>
      <TituloPantalla>Administrar</TituloPantalla>
      {d ? <Button color="secondary" data-accion="adm-recargar">↻ Actualizar</Button> : null}
    </Box>
  );
  if (!configurada && !d) return <>{titulo}<Tarjeta><Parrafo>Administrar necesita la nube (Supabase): sin ella cada quien ve toda la app.</Parrafo></Tarjeta></>;
  if (!esAdmin()) return <>{titulo}<Tarjeta><Parrafo>Solo el administrador puede entrar aquí.</Parrafo></Tarjeta></>;
  if (ver.error) return (
    <>{titulo}<Tarjeta>
      <Aviso>No se pudo cargar: {ver.error}</Aviso>
      <Nota>Si dice que la función no existe, falta aplicar el esquema nuevo (npm run db:esquema).</Nota>
      <Button data-accion="adm-recargar">Reintentar</Button>
    </Tarjeta></>
  );
  if (!d) return <>{titulo}<Nota>Cargando…</Nota></>;
  const p = ver.pestana as string;
  return (
    <>
      {titulo}
      <Opciones nombre="Pestañas de Administrar" activa={p} opciones={Object.entries(A.PESTANAS as Record<string, string>)} datos={(k) => ({ 'data-accion': 'adm-pestana', 'data-p': k })} sx={{ '& .MuiChip-root': { fontSize: 15 } }} />
      {p === 'entrenadores' ? entrenadores(ver) : p === 'porUsuario' ? porUsuario(d, ver.vuelta) : p === 'permisos' ? permisos(d, ver.vuelta) : p === 'roles' ? roles(d) : p === 'ver' ? verComo(d) : usuarios(d, ver.vuelta)}
    </>
  );
}
