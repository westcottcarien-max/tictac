/* TictAC – canvas renderer. One function draws the whole card, used for preview, PNG, GIF and the daily pack. */

const TAU = Math.PI * 2;
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const fam = (n) => `"${n}",sans-serif`;
const pad2 = (n) => String(n).padStart(2, '0');

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath(); c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function rgba(hex, a) {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((x) => x + x).join('') : h;
  return `rgba(${parseInt(f.slice(0, 2), 16)},${parseInt(f.slice(2, 4), 16)},${parseInt(f.slice(4, 6), 16)},${a})`;
}
function contrast(hex) {
  const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.62 ? '#1b1b2f' : '#ffffff';
}
function starPath(c, x, y, r, pts = 5, inner = 0.5) {
  c.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const rad = i % 2 ? r * inner : r, a = (i * Math.PI) / pts - Math.PI / 2;
    c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  c.closePath();
}
function heartPath(c, x, y, s) {
  c.beginPath(); c.moveTo(x, y + s * 0.35);
  c.bezierCurveTo(x - s * 0.9, y - s * 0.2, x - s * 0.5, y - s * 0.85, x, y - s * 0.35);
  c.bezierCurveTo(x + s * 0.5, y - s * 0.85, x + s * 0.9, y - s * 0.2, x, y + s * 0.35); c.closePath();
}
function shapePath(c, shape, x, y, r) {
  if (shape === 'heart') heartPath(c, x, y, r * 1.15);
  else if (shape === 'star') starPath(c, x, y, r * 1.1);
  else if (shape === 'square') rr(c, x - r * 0.85, y - r * 0.85, r * 1.7, r * 1.7, r * 0.3);
  else { c.beginPath(); c.arc(x, y, r, 0, TAU); }
}
function txt(c, s, x, y, o) {
  c.save();
  c.font = `${o.weight || 700} ${o.size}px ${o.font}`;
  c.textAlign = o.align || 'center'; c.textBaseline = 'middle';
  if (o.glow) { c.shadowColor = o.glowColor || o.color; c.shadowBlur = o.glow; }
  else if (o.shadow !== false) { c.shadowColor = 'rgba(0,0,0,.28)'; c.shadowBlur = o.size * 0.1; c.shadowOffsetY = o.size * 0.04; }
  if (o.stroke) { c.lineWidth = o.size * 0.12; c.strokeStyle = o.stroke; c.lineJoin = 'round'; c.strokeText(s, x, y); }
  c.fillStyle = o.color; c.globalAlpha = o.alpha ?? 1; c.fillText(s, x, y);
  c.restore();
}
function fitSize(c, s, font, size, maxW, weight = 700) {
  c.font = `${weight} ${size}px ${font}`;
  const w = c.measureText(s).width;
  return w > maxW ? size * (maxW / w) : size;
}
function wrap(c, s, maxW) {
  const words = s.split(/\s+/), lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

/* ---------- images ---------- */
const IMGS = new Map();
function getImg(src) {
  let e = IMGS.get(src);
  if (!e) { const im = new Image(); e = { im, ok: false, p: null }; e.p = new Promise((res) => { im.onload = () => { e.ok = true; res(); }; im.onerror = () => res(); }); im.src = src; IMGS.set(src, e); }
  return e.ok ? e.im : null;
}
function preloadImg(src) { getImg(src); return IMGS.get(src).p; }

/* ---------- time maths ---------- */
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
function addMonths(d, n) {
  const r = new Date(d), day = r.getDate(); r.setDate(1); r.setMonth(r.getMonth() + n);
  r.setDate(Math.min(day, new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate())); return r;
}
function calc(st, now) {
  const T = LANGS[st.timer.lang] || LANGS.en, u = st.timer.units;
  const target = new Date(`${st.event.date}T${st.event.time || '00:00'}`);
  const created = new Date(st.event.createdAt || now);
  let diff = target - now; const done = !(diff > 0); if (done) diff = 0;
  const sec = Math.floor(diff / 1000);
  const calDays = Math.max(0, Math.round((startOfDay(target) - startOfDay(now)) / 864e5));
  const totalDays = Math.max(1, Math.round((startOfDay(target) - startOfDay(created)) / 864e5));
  const frac = Math.min(1, Math.max(0, 1 - diff / Math.max(1, target - created)));
  const dd = Math.floor(sec / 86400), hh = Math.floor((sec % 86400) / 3600), mm = Math.floor((sec % 3600) / 60), ss = sec % 60;
  let parts;
  if (u === 'd') parts = [['d', calDays]];
  else if (u === 'dhm') parts = [['d', dd], ['h', hh], ['m', mm]];
  else if (u === 'wd') parts = [['w', Math.floor(calDays / 7)], ['d', calDays % 7]];
  else if (u === 'mwd') {
    const a = startOfDay(now), b = startOfDay(target); let m = 0;
    if (!done) while (addMonths(a, m + 1) <= b) m++;
    const rest = Math.max(0, Math.round((b - addMonths(a, m)) / 864e5));
    parts = [['mo', m], ['w', Math.floor(rest / 7)], ['d', rest % 7]];
  } else if (u === 'hms') parts = [['h', Math.floor(sec / 3600)], ['m', mm], ['s', ss]];
  else parts = [['d', dd], ['h', hh], ['m', mm], ['s', ss]];
  const ringMax = { s: 60, m: 60, h: 24, d: (u === 'd' || u === 'dhm' || u === 'dhms') ? totalDays : 7, w: u === 'mwd' ? 5 : Math.ceil(totalDays / 7), mo: 12 };
  parts = parts.map(([k, v]) => ({ k, v, l: T[k], f: Math.min(1, v / ringMax[k]) }));
  const label = st.timer.label?.trim() || `${parts[0].l.toLowerCase()} ${T.togo}`;
  return { T, parts, done, calDays, totalDays, frac, label, target };
}

/* ---------- background ---------- */
function drawGradient(c, W, H, c1, c2, ang) {
  const a = (ang * Math.PI) / 180, dx = Math.sin(a), dy = -Math.cos(a), L = Math.abs(W * dx) + Math.abs(H * dy);
  const g = c.createLinearGradient(W / 2 - (dx * L) / 2, H / 2 - (dy * L) / 2, W / 2 + (dx * L) / 2, H / 2 + (dy * L) / 2);
  g.addColorStop(0, c1); g.addColorStop(1, c2); c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function drawBg(c, W, H, st, u) {
  const b = st.bg;
  drawGradient(c, W, H, b.c1, b.c2, b.angle);
  if (b.type === 'photo' && b.photo) {
    const im = getImg(b.photo);
    if (im) {
      const fit = b.photoFit === 'fit', z = b.photoZoom || 1, px = b.photoX ?? 0.5, py = b.photoY ?? 0.5;
      if (fit) { // blurred copy fills the gaps around the whole photo
        const kc = Math.max(W / im.width, H / im.height) * 1.12; c.save(); c.filter = `blur(${28 * u}px)`;
        c.drawImage(im, (W - im.width * kc) / 2, (H - im.height * kc) / 2, im.width * kc, im.height * kc); c.restore();
      }
      const k = (fit ? Math.min(W / im.width, H / im.height) : Math.max(W / im.width, H / im.height)) * z * (!fit && b.blur ? 1.06 : 1), w = im.width * k, h = im.height * k;
      const x = w > W ? -(w - W) * px : (W - w) / 2, y = h > H ? -(h - H) * py : (H - h) / 2;
      b._ov = [Math.max(0, w - W), Math.max(0, h - H)];
      c.save(); if (b.blur && !fit) c.filter = `blur(${b.blur * u}px)`; c.drawImage(im, x, y, w, h); c.restore();
    }
    if (b.dim > 0) { c.fillStyle = `rgba(0,0,0,${b.dim})`; c.fillRect(0, 0, W, H); }
  }
  if (b.pattern !== 'none') drawPattern(c, W, H, b.pattern, b.patColor, b.patOp, u);
}
function drawPattern(c, W, H, name, color, op, u) {
  c.save(); c.globalAlpha = op; c.fillStyle = color; c.strokeStyle = color;
  const r = rng(name.length * 131 + 7);
  switch (name) {
    case 'dots': { const s = 64 * u; for (let y = 0, j = 0; y < H + s; y += s, j++) for (let x = (j % 2) * s / 2; x < W + s; x += s) { c.beginPath(); c.arc(x, y, 8 * u, 0, TAU); c.fill(); } break; }
    case 'plus': { const s = 90 * u; c.lineWidth = 6 * u; c.lineCap = 'round'; for (let y = s / 2; y < H; y += s) for (let x = s / 2; x < W; x += s) { c.beginPath(); c.moveTo(x - 12 * u, y); c.lineTo(x + 12 * u, y); c.moveTo(x, y - 12 * u); c.lineTo(x, y + 12 * u); c.stroke(); } break; }
    case 'stripes': { c.lineWidth = 36 * u; for (let i = -H; i < W + H; i += 90 * u) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + H, H); c.stroke(); } break; }
    case 'checks': { const s = 90 * u; for (let y = 0, j = 0; y < H; y += s, j++) for (let x = (j % 2) * s; x < W; x += s * 2) c.fillRect(x, y, s, s); break; }
    case 'grid': { c.lineWidth = 2 * u; const s = 80 * u; for (let x = 0; x < W; x += s) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); } for (let y = 0; y < H; y += s) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); } break; }
    case 'rays': { const n = 24, R = Math.hypot(W, H); for (let i = 0; i < n; i += 2) { c.beginPath(); c.moveTo(W / 2, H / 2); c.arc(W / 2, H / 2, R, (i / n) * TAU, ((i + 1) / n) * TAU); c.closePath(); c.fill(); } break; }
    case 'stars': for (let i = 0; i < 70; i++) { starPath(c, r() * W, r() * H, (6 + r() * 16) * u, 5, 0.45); c.fill(); } break;
    case 'hearts': for (let i = 0; i < 45; i++) { heartPath(c, r() * W, r() * H, (10 + r() * 22) * u); c.fill(); } break;
    case 'waves': { c.lineWidth = 5 * u; for (let y = 40 * u; y < H + 60 * u; y += 70 * u) { c.beginPath(); for (let x = 0; x <= W; x += 10) c.lineTo(x, y + Math.sin(x / (60 * u)) * 18 * u); c.stroke(); } break; }
    case 'zigzag': { c.lineWidth = 6 * u; for (let y = 40 * u; y < H + 60 * u; y += 80 * u) { c.beginPath(); for (let x = 0, k = 0; x <= W + 40 * u; x += 40 * u, k++) c.lineTo(x, y + (k % 2 ? 20 * u : -20 * u)); c.stroke(); } break; }
    case 'confetti': { const cols = ['#ff4d6d', '#ffd23f', '#3bceac', '#4cc9f0', '#b388ff', '#ffffff']; for (let i = 0; i < 90; i++) { c.save(); c.translate(r() * W, r() * H); c.rotate(r() * TAU); c.fillStyle = cols[i % 6]; c.fillRect(-8 * u, -4 * u, 16 * u, 8 * u); c.restore(); } break; }
    case 'bokeh': for (let i = 0; i < 26; i++) { const x = r() * W, y = r() * H, rad = (30 + r() * 90) * u, g = c.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, color); g.addColorStop(1, 'rgba(255,255,255,0)'); c.globalAlpha = op * (0.4 + r() * 0.6); c.fillStyle = g; c.beginPath(); c.arc(x, y, rad, 0, TAU); c.fill(); } break;
  }
  c.restore();
}

/* ---------- animated particles (loop over t = 0..1) ---------- */
const EMO = { hearts: ['❤️', '💕', '💖', '💗'], petals: ['🌸', '🌺', '🌼'], leaves: ['🍂', '🍁'], balloons: ['🎈'], spooky: ['🦇', '👻', '🎃', '🕷️'], lanterns: ['🏮'], easter: ['🥚', '🐣', '🌷'], clover: ['☘️', '🍀'], flakes: ['❄️'], sparkles: ['✨', '⭐', '💫'], gifts: ['🎁', '🎄', '🔔', '⭐'], party: ['🎉', '🎊', '🎈'] };
const EMO_DIR = { hearts: 'up', balloons: 'up', lanterns: 'up', spooky: 'up', sparkles: 'tw', petals: 'down', leaves: 'down', easter: 'down', clover: 'down', flakes: 'down', gifts: 'down', party: 'down' };
const CONF = ['#ff4d6d', '#ffd23f', '#3bceac', '#4cc9f0', '#b388ff', '#ffffff'];

function drawParticles(c, W, H, b, t, u) {
  const kind = b.particles; if (!kind || kind === 'none') return;
  const n = EMO[kind] ? Math.ceil(b.pCount * 0.45) : b.pCount, r = rng(kind.length * 977 + 13);
  c.save();
  if (kind === 'fireworks') {
    for (let k = 0; k < 4; k++) {
      const bx = (0.15 + r() * 0.7) * W, by = (0.12 + r() * 0.5) * H, ph = k / 4, p = (((t - ph) % 1) + 1) % 1;
      const col = [CONF[(k * 2) % 6], '#ffd23f', '#ff7ad9', '#7af0ff'][k];
      if (p < 0.55) {
        const q = p / 0.55, rad = q * 190 * u, al = 1 - q * q;
        for (let i = 0; i < 20; i++) {
          const a = (i / 20) * TAU; c.globalAlpha = al; c.fillStyle = i % 2 ? col : '#fff'; c.shadowColor = col; c.shadowBlur = 10 * u;
          c.beginPath(); c.arc(bx + Math.cos(a) * rad, by + Math.sin(a) * rad + q * q * 30 * u, (6 - q * 3) * u, 0, TAU); c.fill();
        }
      }
    }
    c.restore(); return;
  }
  for (let i = 0; i < n; i++) {
    const x0 = r(), y0 = r(), sz = 0.6 + r() * 0.9, k = r() < 0.5 ? 1 : 2, ph = r(), sw = 1 + ((r() * 2) | 0), m = 70 * u, span = H + 2 * m;
    const fall = ((y0 + t * k) % 1) * span - m, rise = H + m - ((y0 + t * k) % 1) * span;
    const x = x0 * W + Math.sin(TAU * (t * sw + ph)) * 26 * u;
    if (kind === 'confetti') {
      c.save(); c.translate(x, fall); c.rotate(TAU * (ph + t * sw)); c.fillStyle = CONF[i % 6]; c.fillRect(-9 * u * sz, -5 * u * sz, 18 * u * sz, 10 * u * sz * Math.abs(Math.cos(TAU * (t * 2 + ph)) * 0.6 + 0.4)); c.restore();
    } else if (kind === 'snow') {
      c.globalAlpha = 0.55 + sz * 0.3; c.fillStyle = '#fff'; c.beginPath(); c.arc(x, ((y0 + t) % 1) * span - m, (4 + 6 * sz) * u, 0, TAU); c.fill();
    } else if (kind === 'rain') {
      const y = ((y0 + t * 2) % 1) * span - m; c.globalAlpha = 0.45; c.strokeStyle = '#cfe8ff'; c.lineWidth = 3 * u; c.beginPath(); c.moveTo(x0 * W, y); c.lineTo(x0 * W - 12 * u, y + 36 * u); c.stroke();
    } else if (kind === 'bubbles') {
      const y = H + m - ((y0 + t) % 1) * span, rad = (14 + 30 * sz) * u; c.globalAlpha = 0.6; c.strokeStyle = '#fff'; c.lineWidth = 3 * u; c.beginPath(); c.arc(x, y, rad, 0, TAU); c.stroke();
      c.globalAlpha = 0.35; c.fillStyle = '#fff'; c.beginPath(); c.arc(x - rad * 0.35, y - rad * 0.35, rad * 0.18, 0, TAU); c.fill();
    } else if (kind === 'stars') {
      const tw = 0.55 + 0.45 * Math.sin(TAU * (t * k + ph)); c.globalAlpha = tw; c.fillStyle = i % 3 ? '#fff' : '#ffe066'; starPath(c, x0 * W, y0 * H, (8 + 14 * sz) * u * tw, 4, 0.35); c.fill();
    } else if (kind === 'fireflies') {
      const fx = x0 * W + Math.sin(TAU * (t + ph)) * 40 * u, fy = y0 * H + Math.cos(TAU * (t * 2 + ph)) * 30 * u, tw = 0.4 + 0.6 * Math.abs(Math.sin(TAU * (t * k + ph)));
      c.globalAlpha = tw; c.fillStyle = '#fff6a8'; c.shadowColor = '#ffe566'; c.shadowBlur = 22 * u; c.beginPath(); c.arc(fx, fy, (4 + 4 * sz) * u, 0, TAU); c.fill();
    } else if (EMO[kind]) {
      const set = EMO[kind], dir = EMO_DIR[kind], e = set[i % set.length], size = (34 + 38 * sz) * u;
      c.font = `${size}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      if (dir === 'tw') { const tw = 0.5 + 0.5 * Math.sin(TAU * (t * k + ph)); c.globalAlpha = 0.3 + 0.7 * tw; c.font = `${size * (0.6 + 0.5 * tw)}px ${EMOJI_FONT}`; c.fillText(e, x0 * W, y0 * H); }
      else { c.save(); c.translate(x, dir === 'up' ? rise : fall); c.rotate(Math.sin(TAU * (t * sw + ph)) * 0.4); c.globalAlpha = 0.95; c.fillText(e, 0, 0); c.restore(); }
    }
  }
  c.restore();
}

/* ---------- timer styles ---------- */
function secondary(P) { return P.slice(1).map((p) => `${pad2(p.v)} ${p.l.toLowerCase()}`).join('  •  '); }
function numStr(p) { return p.k === 'd' || p.k === 'w' || p.k === 'mo' ? String(p.v) : pad2(p.v); }

/* very wide banners (Facebook cover, X header, LinkedIn banner): title on the left, timer on the right */
function layoutOf(W, H) { const b = W / H > 2.2; return b ? { banner: true, tx: W * 0.26, mw: W * 0.44, cx: W * 0.72, aw: W * 0.52 } : { banner: false, tx: W / 2, mw: W * 0.88, cx: W / 2, aw: W * 0.9 }; }

function drawTimer(c, W, H, st, info, u, t) {
  const L = layoutOf(W, H), tm = st.timer, sc = tm.scale, cx = L.cx, cy = H * tm.y, aw = L.aw, P = info.parts, n = P.length;
  const tc = st.text.color, ac = st.text.accent, nf = fam(st.text.numFont), glow = tm.glow;
  const numO = (size, color = tc) => ({ font: nf, size, color, glow: glow ? size * 0.3 : 0, glowColor: ac });
  const lab = (s, x, y, size, a = 0.85, color = tc) => txt(c, s, x, y, { font: fam('Fredoka'), size, color, alpha: a, weight: 600, shadow: false });

  if (info.done) {
    const size = fitSize(c, tm.doneText || info.T.done, nf, 190 * u * sc, aw, 700);
    c.save(); const s = 1 + 0.04 * Math.sin(TAU * t); c.translate(cx, cy); c.scale(s, s);
    txt(c, tm.doneText || info.T.done, 0, 0, numO(size, ac)); c.restore(); return;
  }

  const style = tm.style;
  if (style === 'boxes' || style === 'rings') {
    const gap = 26 * u * sc, cap = (n === 1 ? 360 : 300) * u;
    let d = Math.min((aw - gap * (n - 1)) / n, cap) * sc; const tot = n * d + gap * (n - 1); if (tot > aw * 1.06) d *= (aw * 1.06) / tot;
    const x0 = cx - (n * d + gap * (n - 1)) / 2;
    P.forEach((p, i) => {
      const x = x0 + i * (d + gap), mx = x + d / 2;
      if (style === 'boxes') {
        const bh = d * 1.2, y = cy - bh / 2, kind = tm.box; let numC = tc;
        c.save();
        if (kind === 'solid') { rr(c, x, y, d, bh, d * 0.16); c.fillStyle = ac; c.fill(); numC = contrast(ac); }
        else if (kind === 'flip') { rr(c, x, y, d, bh, d * 0.12); c.fillStyle = 'rgba(24,24,40,.93)'; c.fill(); numC = '#fff'; }
        else if (kind === 'outline') { rr(c, x, y, d, bh, d * 0.16); c.lineWidth = 6 * u; c.strokeStyle = ac; c.stroke(); }
        else { rr(c, x, y, d, bh, kind === 'round' ? d / 2 : d * 0.16); c.fillStyle = `rgba(255,255,255,${tm.boxOpacity})`; c.fill(); c.lineWidth = 3 * u; c.strokeStyle = 'rgba(255,255,255,.45)'; c.stroke(); }
        c.restore();
        const s = String(numStr(p)), size = fitSize(c, s, nf, d * 0.52, d * 0.84);
        txt(c, s, mx, cy - bh * 0.06, { ...numO(size, numC), glow: kind === 'flip' ? 0 : numO(size).glow });
        if (kind === 'flip') { c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(x, cy - bh * 0.06 - 2 * u, d, 4 * u); c.fillStyle = '#fff'; c.beginPath(); c.arc(x + 2, cy - bh * 0.06, 6 * u, 0, TAU); c.arc(x + d - 2, cy - bh * 0.06, 6 * u, 0, TAU); c.fill(); }
        lab(p.l.toUpperCase(), mx, cy + bh * 0.34, d * 0.125, kind === 'solid' ? 1 : 0.85, numC);
      } else {
        const lw = d * 0.1, rad = (d - lw) / 2;
        c.save(); c.lineWidth = lw; c.strokeStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.arc(mx, cy, rad, 0, TAU); c.stroke();
        c.lineCap = 'round'; c.strokeStyle = ac; if (glow) { c.shadowColor = ac; c.shadowBlur = lw * 1.4; }
        c.beginPath(); c.arc(mx, cy, rad, -Math.PI / 2, -Math.PI / 2 + TAU * Math.max(0.02, p.f)); c.stroke(); c.restore();
        const s = numStr(p), size = fitSize(c, s, nf, d * 0.34, d * 0.62);
        txt(c, s, mx, cy - d * 0.05, { ...numO(size), glow: 0 });
        lab(p.l.toUpperCase(), mx, cy + d * 0.22, d * 0.1);
      }
    });
    return;
  }

  if (style === 'bigring') {
    const D = Math.min(W * 0.8, H * 0.46, 520 * u) * sc, lw = D * 0.075, rad = (D - lw) / 2, p0 = P[0], hasSec = n > 1;
    const ry = hasSec ? cy - D * 0.05 : cy;
    c.save(); c.lineWidth = lw; c.strokeStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.arc(cx, ry, rad, 0, TAU); c.stroke();
    c.lineCap = 'round'; c.strokeStyle = ac; if (glow) { c.shadowColor = ac; c.shadowBlur = lw * 1.4; }
    c.beginPath(); c.arc(cx, ry, rad, -Math.PI / 2, -Math.PI / 2 + TAU * Math.max(0.02, info.frac)); c.stroke(); c.restore();
    const s = numStr(p0), size = fitSize(c, s, nf, D * 0.42, D * 0.62);
    txt(c, s, cx, ry - D * 0.05, numO(size));
    lab(info.label, cx, ry + D * 0.2, fitSize(c, info.label, fam('Fredoka'), D * 0.085, D * 0.6, 600));
    if (hasSec) lab(secondary(P), cx, ry + D / 2 + 46 * u * sc, fitSize(c, secondary(P), fam('Fredoka'), 44 * u * sc, aw, 600), 0.95);
    return;
  }

  if (style === 'big' || style === 'bar') {
    const hasSec = n > 1, s = numStr(P[0]), isBar = style === 'bar';
    const N = fitSize(c, s, nf, (isBar ? 220 : 300) * u * sc, aw * 0.95), L = Math.min(N * 0.19, 74 * u * sc), S = Math.min(N * 0.12, 46 * u * sc);
    const barH = 46 * u * sc, totalH = N * 0.85 + L * 1.5 + (hasSec ? S * 1.8 : 0) + (isBar ? barH * 1.9 : 0), y0 = cy - totalH / 2;
    txt(c, s, cx, y0 + N * 0.45, numO(N));
    let y = y0 + N * 0.9 + L * 0.7;
    lab(info.label, cx, y, fitSize(c, info.label, fam('Fredoka'), L, aw, 600)); y += L * 0.7 + S;
    if (hasSec) { lab(secondary(P), cx, y, fitSize(c, secondary(P), fam('Fredoka'), S, aw, 600), 0.95); y += S * 0.9; }
    if (isBar) {
      const bw = aw * 0.84, bx = cx - bw / 2, by = y + barH * 0.7;
      rr(c, bx, by, bw, barH, barH / 2); c.fillStyle = 'rgba(255,255,255,.22)'; c.fill();
      const fw = Math.max(barH, bw * info.frac); c.save(); if (glow) { c.shadowColor = ac; c.shadowBlur = 24 * u; } rr(c, bx, by, fw, barH, barH / 2); c.fillStyle = ac; c.fill(); c.restore();
      const pct = `${Math.round(info.frac * 100)}%`; txt(c, pct, bx + fw - barH * 0.2, by + barH / 2, { font: fam('Fredoka'), size: barH * 0.55, color: contrast(ac), align: 'right', shadow: false });
    }
    return;
  }

  if (style === 'dots') {
    const nH = 150 * u * sc, gridH = Math.min(H * 0.26, 250 * u) * sc, gridW = aw, step = Math.max(1, Math.ceil(info.totalDays / 366));
    const total = Math.ceil(info.totalDays / step), elapsed = Math.min(total, Math.floor((info.totalDays - info.calDays) / step));
    const cols = Math.max(1, Math.ceil(Math.sqrt(total * (gridW / gridH)))), rows = Math.ceil(total / cols), cell = Math.min(gridW / cols, gridH / rows);
    const totalH = nH + 30 * u + rows * cell, y0 = cy - totalH / 2, s = numStr(P[0]);
    const size = fitSize(c, s, nf, 140 * u * sc, aw * 0.6);
    txt(c, s, cx, y0 + nH * 0.4, numO(size));
    lab(info.label, cx, y0 + nH * 0.4 + size * 0.62, Math.min(48 * u * sc, size * 0.22), 0.95);
    const gx = cx - (cols * cell) / 2, gy = y0 + nH + 30 * u;
    for (let i = 0; i < total; i++) {
      const x = gx + (i % cols) * cell + cell / 2, y = gy + Math.floor(i / cols) * cell + cell / 2;
      let r = cell * 0.36; c.save();
      if (i < elapsed) { c.globalAlpha = 0.3; c.fillStyle = '#fff'; }
      else { c.fillStyle = ac; if (i === elapsed) { r *= 1 + 0.18 * Math.sin(TAU * t); c.shadowColor = ac; c.shadowBlur = 16 * u; } }
      shapePath(c, tm.dotShape, x, y, r); c.fill(); c.restore();
    }
    return;
  }

  if (style === 'sentence') {
    const s = numStr(P[0]), l1 = `${info.T.only} `, fs = Math.min(150 * u * sc, 1e9);
    const f1 = fitSize(c, l1 + s, nf, fs, aw * 0.96), lh = f1 * 1.15;
    c.font = `700 ${f1}px ${nf}`; const w1 = c.measureText(l1).width, w2 = c.measureText(s).width, x0 = cx - (w1 + w2) / 2;
    const f2 = fitSize(c, info.label + (n > 1 ? '' : '!'), nf, f1 * 0.78, aw * 0.96), by = cy - (lh + f2 * 1.1) / 2 + f1 * 0.5;
    txt(c, l1, x0, by, { ...numO(f1), align: 'left' });
    txt(c, s, x0 + w1, by, { ...numO(f1, ac), align: 'left' });
    txt(c, info.label + '!', cx, by + lh * 0.95, numO(f2));
    if (n > 1) lab(secondary(P), cx, by + lh * 0.95 + f2 * 0.95, fitSize(c, secondary(P), fam('Fredoka'), f2 * 0.5, aw, 600), 0.95);
    return;
  }

  if (style === 'digital') {
    const strs = P.map(numStr); let S = 260 * u * sc;
    const meas = (sz) => { c.font = `700 ${sz}px ${nf}`; return strs.map((s) => c.measureText(s).width); };
    let ws = meas(S), tot = ws.reduce((a, b) => a + b, 0) + (n - 1) * S * 0.5; if (tot > aw) { S *= aw / tot; ws = meas(S); tot = ws.reduce((a, b) => a + b, 0) + (n - 1) * S * 0.5; }
    let x = cx - tot / 2;
    P.forEach((p, i) => {
      txt(c, strs[i], x + ws[i] / 2, cy - S * 0.05, numO(S, tc));
      lab(p.l.toUpperCase(), x + ws[i] / 2, cy + S * 0.5, Math.max(S * 0.14, 16 * u));
      x += ws[i];
      if (i < n - 1) { txt(c, ':', x + S * 0.25, cy - S * 0.1, { ...numO(S, ac), alpha: 0.5 + 0.5 * Math.abs(Math.sin(TAU * t * 2)) }); x += S * 0.5; }
    });
  }
}

/* ---------- text, frame, logo ---------- */
function drawTexts(c, W, H, st, info, u) {
  const L = layoutOf(W, H), x = st.text, cx = L.tx, mw = L.mw, ff = fam(x.titleFont);
  let title = x.title || '';
  if (title) {
    let size = x.titleSize * u; c.font = `700 ${size}px ${ff}`;
    let lines = wrap(c, title, mw);
    while (lines.length > 2 && size > 30 * u) { size *= 0.92; c.font = `700 ${size}px ${ff}`; lines = wrap(c, title, mw); }
    size = Math.min(size, ...lines.map((l) => fitSize(c, l, ff, size, mw)));
    const lh = size * 1.08, y0 = H * (L.banner ? x.titleY + 0.2 : x.titleY) - ((lines.length - 1) * lh) / 2;
    lines.forEach((l, i) => txt(c, l, cx, y0 + i * lh, { font: ff, size, color: x.color, glow: 0, stroke: x.titleOutline ? rgba('#000000', 0.55) : '' }));
    let sub = x.subtitle;
    if (!sub && x.showDate) {
      try { sub = info.target.toLocaleDateString((info.T || LANGS.en).tag, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { sub = st.event.date; }
    }
    if (sub) { const ss = fitSize(c, sub, fam('Fredoka'), 52 * u, mw, 600); txt(c, sub, cx, y0 + (lines.length - 1) * lh + size * 0.72 + ss * 0.55, { font: fam('Fredoka'), size: ss, color: x.color, alpha: 0.92, weight: 600 }); }
  }
  if (x.footer) { const fs = fitSize(c, x.footer, fam('Fredoka'), 56 * u, mw, 600); txt(c, x.footer, cx, H * (L.banner ? 0.84 : 0.9), { font: fam('Fredoka'), size: fs, color: x.color, weight: 600 }); }
}
function drawFrame(c, W, H, st, u, t) {
  const f = st.frame; if (f.style === 'none') return;
  c.save(); c.strokeStyle = f.color; c.fillStyle = f.color;
  if (f.style === 'line') { c.lineWidth = 8 * u; rr(c, 32 * u, 32 * u, W - 64 * u, H - 64 * u, 24 * u); c.stroke(); }
  else if (f.style === 'double') { c.lineWidth = 8 * u; rr(c, 28 * u, 28 * u, W - 56 * u, H - 56 * u, 20 * u); c.stroke(); c.lineWidth = 3 * u; rr(c, 52 * u, 52 * u, W - 104 * u, H - 104 * u, 12 * u); c.stroke(); }
  else if (f.style === 'dashed') { c.lineWidth = 8 * u; c.setLineDash([26 * u, 18 * u]); c.lineCap = 'round'; rr(c, 36 * u, 36 * u, W - 72 * u, H - 72 * u, 30 * u); c.stroke(); }
  else if (f.style === 'white') { c.beginPath(); c.rect(0, 0, W, H); const m = 40 * u, r = 40 * u; c.moveTo(m + r, m); c.arcTo(W - m, m, W - m, H - m, r); c.arcTo(W - m, H - m, m, H - m, r); c.arcTo(m, H - m, m, m, r); c.arcTo(m, m, W - m, m, r); c.closePath(); c.fill('evenodd'); }
  else if (f.style === 'scallop') { const r = 30 * u; for (let x = r; x < W + r; x += r * 1.7) { c.beginPath(); c.arc(x, 0, r, 0, TAU); c.fill(); c.beginPath(); c.arc(x, H, r, 0, TAU); c.fill(); } for (let y = r; y < H + r; y += r * 1.7) { c.beginPath(); c.arc(0, y, r, 0, TAU); c.fill(); c.beginPath(); c.arc(W, y, r, 0, TAU); c.fill(); } }
  else if (f.style === 'lights') {
    const cols = ['#ff4d6d', '#ffd23f', '#3bceac', '#4cc9f0', '#b388ff'], m = 34 * u, step = 62 * u, pts = [];
    for (let x = m; x < W - m + 1; x += step) pts.push([x, m]); for (let y = m + step; y < H - m + 1; y += step) pts.push([W - m, y]);
    for (let x = W - m - step; x > m - 1; x -= step) pts.push([x, H - m]); for (let y = H - m - step; y > m; y -= step) pts.push([m, y]);
    c.lineWidth = 3 * u; c.strokeStyle = 'rgba(0,0,0,.4)'; rr(c, m, m, W - 2 * m, H - 2 * m, 4); c.stroke();
    pts.forEach(([x, y], i) => { const on = 0.55 + 0.45 * Math.sin(TAU * (t * 2 + i * 0.25)); c.globalAlpha = on; c.fillStyle = cols[i % 5]; c.shadowColor = cols[i % 5]; c.shadowBlur = 22 * u; c.beginPath(); c.arc(x, y, 13 * u, 0, TAU); c.fill(); });
  }
  c.restore();
}
function drawLogo(c, W, H, u) {
  const im = getImg('logo-192.png'); if (!im) return;
  const s = 150 * u, m = 34 * u, x = W - s - m, y = H - s - m;
  c.save(); c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = 16 * u; rr(c, x, y, s, s, s * 0.28); c.fillStyle = 'rgba(255,255,255,.92)'; c.fill(); c.restore();
  c.drawImage(im, x + s * 0.06, y + s * 0.06, s * 0.88, s * 0.88);
}

/* ---------- stickers ---------- */
const WFONT = { bubble: 'Fredoka', ribbon: 'Lobster', badge: 'Bangers', neon: 'Righteous', comic: 'Bangers', script: 'Pacifico', tape: 'Caveat', stamp: 'Anton' };
const WSTYLES = Object.keys(WFONT);

function drawWording(c, s, u) {
  const fs = s.size * u, font = fam(WFONT[s.style] || 'Fredoka');
  c.font = `700 ${fs}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle';
  const tw = c.measureText(s.v).width; let w = tw, h = fs;
  c.save();
  switch (s.style) {
    case 'bubble': { w = tw + fs * 1.4; h = fs * 1.7; c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = fs * 0.3; c.shadowOffsetY = fs * 0.1; rr(c, -w / 2, -h / 2, w, h, h / 2); c.fillStyle = s.c2; c.fill(); c.shadowColor = 'transparent'; c.fillStyle = s.c1; c.fillText(s.v, 0, fs * 0.03); break; }
    case 'ribbon': {
      w = tw + fs * 1.6; h = fs * 1.55; const t = fs * 0.7, tail = h * 0.22;
      c.fillStyle = 'rgba(0,0,0,.28)';
      [-1, 1].forEach((d) => { c.beginPath(); c.moveTo(d * (w / 2 - 4), -h / 2 + tail); c.lineTo(d * (w / 2 + t), -h / 2 + tail); c.lineTo(d * (w / 2 + t - fs * 0.3), tail); c.lineTo(d * (w / 2 + t), h / 2 + tail); c.lineTo(d * (w / 2 - 4), h / 2 + tail); c.closePath(); c.fill(); });
      c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = fs * 0.2; c.fillStyle = s.c1; c.fillRect(-w / 2, -h / 2, w, h); c.shadowColor = 'transparent';
      c.strokeStyle = rgba('#ffffff', 0.5); c.lineWidth = fs * 0.04; c.strokeRect(-w / 2 + fs * 0.12, -h / 2 + fs * 0.12, w - fs * 0.24, h - fs * 0.24);
      c.fillStyle = s.c2; c.fillText(s.v, 0, fs * 0.03); w += t * 2; break;
    }
    case 'badge': {
      const rx = tw / 2 + fs * 0.9, ry = fs * 1.0, N = 18; c.beginPath();
      for (let i = 0; i < N * 2; i++) { const a = (i / (N * 2)) * TAU, k = i % 2 ? 0.86 : 1; c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * rx * k, Math.sin(a) * ry * k); }
      c.closePath(); c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = fs * 0.25; c.fillStyle = s.c1; c.fill(); c.shadowColor = 'transparent'; c.lineWidth = fs * 0.07; c.strokeStyle = '#fff'; c.stroke();
      c.fillStyle = s.c2; c.fillText(s.v, 0, fs * 0.05); w = rx * 2; h = ry * 2; break;
    }
    case 'neon': { w = tw + fs * 0.6; h = fs * 1.3; c.shadowColor = s.c1; c.shadowBlur = fs * 0.6; c.lineWidth = fs * 0.07; c.strokeStyle = s.c1; c.strokeText(s.v, 0, 0); c.strokeText(s.v, 0, 0); c.fillStyle = s.c2; c.fillText(s.v, 0, 0); break; }
    case 'comic': { w = tw + fs * 0.5; h = fs * 1.3; c.transform(1, 0, -0.12, 1, 0, 0); c.lineJoin = 'round'; c.lineWidth = fs * 0.24; c.strokeStyle = s.c2; c.strokeText(s.v, 0, 0); c.fillStyle = s.c1; c.fillText(s.v, 0, 0); break; }
    case 'script': { w = tw + fs * 0.6; h = fs * 1.5; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = fs * 0.15; c.shadowOffsetY = fs * 0.06; c.fillStyle = s.c1; c.fillText(s.v, 0, 0); break; }
    case 'tape': {
      w = tw + fs * 1.2; h = fs * 1.35; c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = fs * 0.15; c.fillStyle = rgba(s.c1, 0.9); c.beginPath();
      const z = fs * 0.12; c.moveTo(-w / 2, -h / 2); c.lineTo(w / 2, -h / 2); for (let y = -h / 2; y < h / 2; y += z * 2) { c.lineTo(w / 2 - z, y + z); c.lineTo(w / 2, y + z * 2); } c.lineTo(-w / 2, h / 2);
      for (let y = h / 2; y > -h / 2; y -= z * 2) { c.lineTo(-w / 2 + z, y - z); c.lineTo(-w / 2, y - z * 2); } c.closePath(); c.fill(); c.shadowColor = 'transparent';
      c.fillStyle = s.c2; c.fillText(s.v, 0, fs * 0.04); break;
    }
    case 'stamp': { w = tw + fs * 1.2; h = fs * 1.6; c.globalAlpha = 0.95; c.strokeStyle = s.c1; c.lineWidth = fs * 0.1; rr(c, -w / 2, -h / 2, w, h, fs * 0.25); c.stroke(); c.lineWidth = fs * 0.035; rr(c, -w / 2 + fs * 0.16, -h / 2 + fs * 0.16, w - fs * 0.32, h - fs * 0.32, fs * 0.15); c.stroke(); c.fillStyle = s.c1; c.fillText(s.v.toUpperCase(), 0, fs * 0.04); break; }
    default: c.fillStyle = s.c1; c.fillText(s.v, 0, 0);
  }
  c.restore();
  return { w, h };
}

function animXf(a, t, u) {
  const sn = Math.sin(TAU * t);
  switch (a) {
    case 'bounce': return { dy: -Math.abs(sn) * 36 * u, sx: 1 + 0.06 * (1 - Math.abs(sn)) , sy: 1 - 0.06 * (1 - Math.abs(sn)) };
    case 'pulse': return { s: 1 + 0.14 * sn };
    case 'heartbeat': return { s: 1 + 0.18 * Math.max(0, Math.sin(TAU * t * 2)) };
    case 'spin': return { r: TAU * t };
    case 'wiggle': return { r: 0.28 * Math.sin(TAU * t * 2) };
    case 'float': return { dy: sn * 22 * u, dx: Math.cos(TAU * t) * 8 * u };
    case 'twinkle': return { s: 0.85 + 0.2 * sn, a: 0.65 + 0.35 * Math.abs(sn) };
    case 'swing': return { r: 0.35 * sn };
    default: return {};
  }
}
function drawSticker(c, s, W, H, u, t) {
  const a = animXf(s.anim, t, u);
  c.save();
  c.translate(s.x * W + (a.dx || 0), s.y * H + (a.dy || 0)); c.rotate((s.rot || 0) * Math.PI / 180 + (a.r || 0));
  const k = a.s || 1; c.scale(k * (a.sx || 1) * (s.flip ? -1 : 1), k * (a.sy || 1));
  if (a.a !== undefined) c.globalAlpha = a.a;
  let w, h;
  if (s.kind === 'emoji') {
    const size = s.size * u; c.font = `${size}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = 12 * u; c.shadowOffsetY = 6 * u; c.fillText(s.v, 0, size * 0.06); w = h = size * 1.15;
  } else if (s.kind === 'image') {
    const im = getImg(s.src), sh = s.shape || 'none'; w = s.size * u; h = w;
    if (im) {
      c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 14 * u; c.shadowOffsetY = 6 * u;
      const cover = (x, y, bw, bh) => { const k = Math.max(bw / im.width, bh / im.height); c.drawImage(im, x + (bw - im.width * k) / 2, y + (bh - im.height * k) / 2, im.width * k, im.height * k); };
      if (sh === 'none') { h = w * (im.height / im.width); c.drawImage(im, -w / 2, -h / 2, w, h); }
      else if (sh === 'polaroid') {
        h = w * 1.2; const pad = w * 0.06; rr(c, -w / 2, -h / 2, w, h, w * 0.02); c.fillStyle = s.bc || '#fff'; c.fill(); c.shadowColor = 'transparent';
        c.save(); c.beginPath(); c.rect(-w / 2 + pad, -h / 2 + pad, w - 2 * pad, w - 2 * pad); c.clip(); cover(-w / 2 + pad, -h / 2 + pad, w - 2 * pad, w - 2 * pad); c.restore();
      } else {
        const path = () => { if (sh === 'circle') { c.beginPath(); c.arc(0, 0, w / 2, 0, TAU); } else if (sh === 'heart') heartPath(c, 0, w * 0.06, w * 0.56); else rr(c, -w / 2, -w / 2, w, w, w * 0.14); };
        path(); c.fillStyle = s.bc || '#fff'; c.fill(); c.shadowColor = 'transparent';
        c.save(); path(); c.clip(); cover(-w / 2, -w / 2, w, w); c.restore();
        path(); c.lineWidth = w * 0.045; c.strokeStyle = s.bc || '#fff'; c.stroke();
      }
    }
  } else { ({ w, h } = drawWording(c, s, u)); }
  c.restore();
  s._b = { cx: s.x * W, cy: s.y * H, w: w * k, h: h * k, rot: (s.rot || 0) * Math.PI / 180 };
}
function drawSelection(c, s, u) {
  const b = s._b; if (!b) return;
  c.save(); c.translate(b.cx, b.cy); c.rotate(b.rot);
  c.setLineDash([10, 8]); c.lineWidth = 3; c.strokeStyle = '#ffffff'; c.shadowColor = 'rgba(0,0,0,.7)'; c.shadowBlur = 4;
  c.strokeRect(-b.w / 2 - 6, -b.h / 2 - 6, b.w + 12, b.h + 12); c.setLineDash([]);
  c.beginPath(); c.arc(b.w / 2 + 6, b.h / 2 + 6, 13, 0, TAU); c.fillStyle = '#8b5cf6'; c.fill(); c.lineWidth = 3; c.stroke();
  // delete button (top-left corner)
  c.shadowBlur = 0; c.beginPath(); c.arc(-b.w / 2 - 6, -b.h / 2 - 6, 15, 0, TAU); c.fillStyle = '#e5484d'; c.fill(); c.stroke();
  c.font = `15px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText('🗑️', -b.w / 2 - 6, -b.h / 2 - 5);
  c.restore();
}
function drawTrash(c, W, H, hot) {
  const x = W / 2, y = H - 58, r = hot ? 46 : 36;
  c.save(); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14;
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fillStyle = hot ? '#e5484d' : 'rgba(30,30,50,.85)'; c.fill();
  c.shadowBlur = 0; c.lineWidth = 3; c.strokeStyle = '#fff'; c.stroke();
  c.font = `${r * 0.95}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('🗑️', x, y + 2);
  c.font = '600 13px Fredoka, sans-serif'; c.fillStyle = '#fff'; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 4;
  c.fillText(hot ? 'Release to delete' : 'Drag here to delete', x, y - r - 12);
  c.restore();
}

/* ---------- main ---------- */
function render(c, W, H, st, t, opts = {}) {
  const u = Math.min(W, H) / 1080, now = opts.now || new Date(), info = calc(st, now);
  c.save(); c.clearRect(0, 0, W, H);
  drawBg(c, W, H, st, u);
  drawParticles(c, W, H, st.bg, t, u);
  if (st.bg.vignette > 0) { const g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.hypot(W, H) / 2); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${st.bg.vignette})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  drawTexts(c, W, H, st, info, u);
  drawTimer(c, W, H, st, info, u, t);
  drawFrame(c, W, H, st, u, t);
  st.stickers.forEach((s) => drawSticker(c, s, W, H, u, t));
  if (st.logo) drawLogo(c, W, H, u);
  if (opts.editing && opts.sel) drawSelection(c, opts.sel, u);
  if (opts.editing && opts.trash && opts.trash.show) drawTrash(c, W, H, opts.trash.hot);
  c.restore();
  return info;
}
