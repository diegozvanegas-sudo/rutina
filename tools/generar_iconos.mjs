// Genera public/icons/icono-192.png e icono-512.png (PNG sin dependencias): fondo oscuro y una mancuerna verde.
// El dibujo queda dentro del 60 % central para que sirva también como ícono "maskable".
import fs from 'node:fs';
import zlib from 'node:zlib';

const FONDO = [0x10, 0x14, 0x18], VERDE = [0x3d, 0xd6, 0x8c], CLARO = [0xd8, 0xf7, 0xe8];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (const b of buf) {
    c = (crc ^ b) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function bloque(tipo, datos) {
  const t = Buffer.from(tipo), largo = Buffer.alloc(4), crc = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  crc.writeUInt32BE(crc32(Buffer.concat([t, datos])));
  return Buffer.concat([largo, t, datos, crc]);
}

function icono(n) {
  const u = n / 100; // el dibujo se define en una cuadrícula de 100 x 100
  const dentro = (x, y, x0, y0, x1, y1, r = 0) => {
    if (x < x0 || x > x1 || y < y0 || y > y1) return false;
    const cx = Math.min(Math.max(x, x0 + r), x1 - r), cy = Math.min(Math.max(y, y0 + r), y1 - r);
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  };
  const color = (px, py) => {
    const x = px / u, y = py / u;
    if (dentro(x, y, 24, 34, 32, 66, 3) || dentro(x, y, 68, 34, 76, 66, 3)) return VERDE;  // discos grandes
    if (dentro(x, y, 33, 40, 39, 60, 2) || dentro(x, y, 61, 40, 67, 60, 2)) return VERDE;  // discos pequeños
    if (dentro(x, y, 39, 47, 61, 53, 2)) return CLARO;                                      // barra
    return FONDO;
  };
  const filas = [];
  for (let y = 0; y < n; y++) {
    const fila = Buffer.alloc(1 + n * 3);
    for (let x = 0; x < n; x++) fila.set(color(x, y), 1 + x * 3);
    filas.push(fila);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(n, 0); ihdr.writeUInt32BE(n, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8 bits, RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloque('IHDR', ihdr), bloque('IDAT', zlib.deflateSync(Buffer.concat(filas))), bloque('IEND', Buffer.alloc(0)),
  ]);
}

const carpeta = new URL('../public/icons/', import.meta.url);
fs.mkdirSync(carpeta, { recursive: true });
for (const n of [192, 512]) fs.writeFileSync(new URL(`icono-${n}.png`, carpeta), icono(n));
console.log('Íconos en public/icons/');
