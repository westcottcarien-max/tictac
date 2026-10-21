/* TictAC – tiny animated-GIF encoder and ZIP writer (no dependencies) */

/* ---- GIF ---- */
function quantize(data, n) {
  // 15-bit histogram → median cut → palette (up to 256 colours)
  const hist = new Uint32Array(32768);
  for (let i = 0; i < n; i += 4) hist[((data[i] >> 3) << 10) | ((data[i + 1] >> 3) << 5) | (data[i + 2] >> 3)]++;
  const cols = [];
  for (let k = 0; k < 32768; k++) if (hist[k]) cols.push(k);
  const rgb = (k) => [(k >> 10) << 3 | 4, ((k >> 5) & 31) << 3 | 4, (k & 31) << 3 | 4];
  let boxes = [cols];
  while (boxes.length < 256) {
    let bi = -1, best = 1;
    boxes.forEach((b, i) => { if (b.length > best) { best = b.length; bi = i; } });
    if (bi < 0) break;
    const b = boxes[bi]; let mn = [255, 255, 255], mx = [0, 0, 0];
    b.forEach((k) => { const c = rgb(k); for (let j = 0; j < 3; j++) { if (c[j] < mn[j]) mn[j] = c[j]; if (c[j] > mx[j]) mx[j] = c[j]; } });
    const ch = [mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]].reduce((a, v, i, arr) => (v > arr[a] ? i : a), 0);
    b.sort((p, q) => rgb(p)[ch] - rgb(q)[ch]);
    // split by population median
    let tot = 0; b.forEach((k) => (tot += hist[k])); let acc = 0, cut = 1;
    for (let i = 0; i < b.length; i++) { acc += hist[b[i]]; if (acc >= tot / 2) { cut = Math.min(Math.max(1, i + 1), b.length - 1); break; } }
    boxes.splice(bi, 1, b.slice(0, cut), b.slice(cut));
  }
  const pal = new Uint8Array(768);
  boxes.forEach((b, i) => {
    let r = 0, g = 0, bl = 0, t = 0;
    b.forEach((k) => { const c = rgb(k), w = hist[k]; r += c[0] * w; g += c[1] * w; bl += c[2] * w; t += w; });
    pal[i * 3] = r / t; pal[i * 3 + 1] = g / t; pal[i * 3 + 2] = bl / t;
  });
  return { pal, count: boxes.length };
}
function indexFrame(data, w, h, q) {
  const out = new Uint8Array(w * h), cache = new Int16Array(32768).fill(-1), { pal, count } = q;
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], cl = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const dth = (bayer[((p / w | 0) & 3) * 4 + ((p % w) & 3)] - 7.5) * 1.1, r = cl(data[i] + dth), g = cl(data[i + 1] + dth), b = cl(data[i + 2] + dth);
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    let idx = cache[key];
    if (idx < 0) {
      let bd = 1e9;
      for (let j = 0; j < count; j++) { const d = (pal[j * 3] - r) ** 2 + (pal[j * 3 + 1] - g) ** 2 + (pal[j * 3 + 2] - b) ** 2; if (d < bd) { bd = d; idx = j; } }
      cache[key] = idx;
    }
    out[p] = idx;
  }
  return out;
}
function lzw(idx, out) {
  const init = 8, clear = 256, eoi = 257; let bits = init + 1, maxc = (1 << bits) - 1, free = eoi + 1, cur = 0, nb = 0, dict = new Map();
  const buf = [];
  const emit = (code) => {
    cur |= code << nb; nb += bits;
    while (nb >= 8) { buf.push(cur & 255); cur >>>= 8; nb -= 8; }
    if (free > maxc) { bits++; maxc = bits === 12 ? 4096 : (1 << bits) - 1; }
  };
  emit(clear);
  let prefix = idx[0];
  for (let i = 1; i < idx.length; i++) {
    const k = idx[i], key = (prefix << 8) | k, f = dict.get(key);
    if (f !== undefined) { prefix = f; continue; }
    emit(prefix);
    if (free < 4096) dict.set(key, free++);
    else { emit(clear); bits = init + 1; maxc = (1 << bits) - 1; free = eoi + 1; dict.clear(); }
    prefix = k;
  }
  emit(prefix); emit(eoi); if (nb > 0) buf.push(cur & 255);
  out.push(8);
  for (let i = 0; i < buf.length; i += 255) { const n = Math.min(255, buf.length - i); out.push(n); for (let j = 0; j < n; j++) out.push(buf[i + j]); }
  out.push(0);
}
class GifEncoder {
  constructor(w, h) {
    this.w = w; this.h = h; this.o = [];
    const o = this.o, s = (t) => { for (const ch of t) o.push(ch.charCodeAt(0)); }, w16 = (v) => o.push(v & 255, v >> 8);
    s('GIF89a'); w16(w); w16(h); o.push(0x70, 0, 0);
    o.push(0x21, 0xff, 11); s('NETSCAPE2.0'); o.push(3, 1, 0, 0, 0);
  }
  addFrame(rgba, delayMs) {
    const o = this.o, w16 = (v) => o.push(v & 255, v >> 8), q = quantize(rgba, rgba.length), idx = indexFrame(rgba, this.w, this.h, q);
    const d = Math.round(delayMs / 10);
    o.push(0x21, 0xf9, 4, 0x08, d & 255, d >> 8, 0, 0); // disposal 2, no transparency
    o.push(0x2c); w16(0); w16(0); w16(this.w); w16(this.h); o.push(0x87);
    for (let i = 0; i < 768; i++) o.push(q.pal[i] || 0);
    lzw(idx, o);
  }
  finish() { this.o.push(0x3b); return new Blob([new Uint8Array(this.o)], { type: 'image/gif' }); }
}

/* ---- ZIP (store) ---- */
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function makeZip(files) { // files: [{name, data:Uint8Array}]
  const enc = new TextEncoder(), parts = [], central = []; let offset = 0;
  const u16 = (v) => [v & 255, (v >> 8) & 255], u32 = (v) => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];
  for (const f of files) {
    const name = enc.encode(f.name), crc = crc32(f.data), sz = f.data.length;
    const head = new Uint8Array([0x50, 0x4b, 3, 4, 20, 0, 0, 8, 0, 0, 0, 0, 0x21, 0, ...u32(crc), ...u32(sz), ...u32(sz), ...u16(name.length), 0, 0]);
    parts.push(head, name, f.data);
    central.push(new Uint8Array([0x50, 0x4b, 1, 2, 20, 0, 20, 0, 0, 8, 0, 0, 0, 0, 0x21, 0, ...u32(crc), ...u32(sz), ...u32(sz), ...u16(name.length), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...u32(offset)]), name);
    offset += head.length + name.length + sz;
  }
  const csize = central.reduce((a, b) => a + b.length, 0);
  parts.push(...central, new Uint8Array([0x50, 0x4b, 5, 6, 0, 0, 0, 0, ...u16(files.length), ...u16(files.length), ...u32(csize), ...u32(offset), 0, 0]));
  return new Blob(parts, { type: 'application/zip' });
}
