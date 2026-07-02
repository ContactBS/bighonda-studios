import { writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { mkdirSync } from "node:fs";
import zlib from "node:zlib";

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  typeBuf.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 8 + data.length);
  return out;
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function blend(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function noise(x, y, seed) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

function image(path, width, height, palette, mode = "field") {
  mkdirSync(dirname(path), { recursive: true });
  const raw = Buffer.alloc((width * 4 + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x += 1) {
      const nx = x / Math.max(width - 1, 1);
      const ny = y / Math.max(height - 1, 1);
      const radial = Math.min(1, Math.hypot(nx - 0.18, ny - 0.2));
      const stripe = mode === "chapel" ? Math.abs(Math.sin((nx - 0.5) * 8)) : Math.abs(Math.sin((nx + ny) * 5));
      const horizon = mode === "water" ? Math.max(0, 1 - Math.abs(ny - 0.58) * 7) : 0;
      const portrait = mode === "portrait" ? Math.max(0, 1 - Math.hypot(nx - 0.5, ny - 0.42) * 2.3) : 0;
      const t = Math.min(1, Math.max(0, ny * 0.72 + radial * 0.32 + stripe * 0.08));
      let color = blend(palette[0], palette[1], t);
      color = blend(color, palette[2], Math.max(horizon * 0.38, portrait * 0.32));
      const grain = (noise(x, y, width + height) - 0.5) * 20;
      const vignette = Math.max(0, Math.hypot(nx - 0.5, ny - 0.5) - 0.35) * 60;
      const idx = row + 1 + x * 4;
      raw[idx] = Math.max(0, Math.min(255, color[0] + grain - vignette));
      raw[idx + 1] = Math.max(0, Math.min(255, color[1] + grain - vignette));
      raw[idx + 2] = Math.max(0, Math.min(255, color[2] + grain - vignette));
      raw[idx + 3] = 255;
    }
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const png = Buffer.concat([header, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
  writeFileSync(path, png);
}

const charcoal = [25, 22, 19];
const paper = [247, 241, 232];
const bronze = [168, 121, 60];
const clay = [143, 95, 62];
const olive = [83, 97, 73];
const blueGray = [80, 92, 101];

image("public/images/brand/studio-hero.png", 1600, 1000, [charcoal, clay, bronze], "field");
image("public/images/brand/saul-portrait-placeholder.png", 1000, 1250, [charcoal, olive, paper], "portrait");
image("public/images/brand/podcast-cover.png", 1200, 1200, [charcoal, bronze, paper], "field");
image("public/images/books/what-if-you-were-wrong.png", 1200, 1800, [charcoal, bronze, paper], "chapel");
image("public/images/books/dear-son-welcome-to-life.png", 1200, 1800, [olive, clay, paper], "portrait");
image("public/images/books/letters-on-renewal.png", 1200, 1800, [blueGray, bronze, paper], "water");
image("public/images/photos/still-water-at-dawn.png", 1400, 1750, [blueGray, bronze, paper], "water");
image("public/images/photos/market-light.png", 1400, 1750, [charcoal, clay, bronze], "field");
image("public/images/photos/chapel-shadow.png", 1400, 1750, [charcoal, olive, bronze], "chapel");
image("public/images/photos/portrait-study.png", 1400, 1750, [charcoal, clay, paper], "portrait");
