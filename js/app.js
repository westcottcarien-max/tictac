/* TictAC – app logic: state, UI wiring, canvas interaction, sharing & exports */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LOOP_MS = 4000, STORE_KEY = 'tictac.v1';
const STYLES = [['boxes', '🔲', 'Boxes'], ['rings', '⭕', 'Rings'], ['bigring', '🍩', 'Big Ring'], ['big', '🔢', 'Big Number'], ['bar', '📊', 'Progress Bar'], ['dots', '💗', 'Dot Calendar'], ['sentence', '💬', 'Sentence'], ['digital', '🔌', 'Neon Digital']];
const OCC_NAMES = { general: 'General', christian: 'Christian & faith', birthday: 'Birthday', wedding: 'Wedding & engagement', baby: 'Baby', christmas: 'Christmas', newyear: 'New Year', valentine: "Valentine's", easter: 'Easter', halloween: 'Halloween', thanksgiving: 'Thanksgiving', diwali: 'Diwali', eid: 'Eid & Ramadan', hanukkah: 'Hanukkah', chinese: 'Lunar New Year', vacation: 'Holiday & travel', graduation: 'Graduation', anniversary: 'Anniversary', school: 'School & exams', party: 'Party & events', sports: 'Sports', patriotic: 'National days', love: 'Love & family', work: 'Work & launch' };
const SCRIPTY = ['Great Vibes', 'Dancing Script', 'Pacifico', 'Lobster', 'Mountains of Christmas', 'Permanent Marker'];

const uid = () => Math.random().toString(36).slice(2, 9);
const iso = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const clone = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k[0] === '_' ? undefined : v)));
const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
function setPath(o, p, v) { const ks = p.split('.'); const l = ks.pop(); ks.reduce((a, k) => a[k], o)[l] = v; }
function mergeDeep(base, extra) {
  for (const k in extra) base[k] = extra[k] && typeof extra[k] === 'object' && !Array.isArray(extra[k]) && base[k] && typeof base[k] === 'object' ? mergeDeep(base[k], extra[k]) : extra[k];
  return base;
}

/* ---------- state ---------- */
function baseState() {
  const d = new Date(); d.setDate(d.getDate() + 30);
  return {
    id: uid(),
    event: { presetId: 'custom', emoji: '🎯', date: iso(d), time: '00:00', createdAt: new Date().toISOString() },
    timer: { style: 'boxes', units: 'dhms', lang: 'en', label: '', box: 'glass', boxOpacity: 0.18, dotShape: 'heart', glow: true, scale: 1, y: 0.5, doneText: '' },
    bg: { type: 'gradient', c1: '#8b5cf6', c2: '#14c9b8', angle: 135, photo: null, photoX: 0.5, photoY: 0.5, photoZoom: 1, photoFit: 'fill', dim: 0.3, blur: 0, pattern: 'none', patColor: '#ffffff', patOp: 0.14, particles: 'confetti', pCount: 36, vignette: 0.2 },
    text: { title: 'My Big Day', subtitle: '', footer: '', titleFont: 'Fredoka', numFont: 'Fredoka', color: '#ffffff', accent: '#ffe066', titleSize: 110, titleY: 0.17, showDate: true, titleOutline: false },
    frame: { style: 'none', color: '#ffffff' },
    size: 'square', logo: true, stickers: [],
  };
}
const ANIMS = ['bounce', 'wiggle', 'float', 'pulse'];
const SPOTS = [[0.12, 0.1], [0.88, 0.1], [0.1, 0.74], [0.9, 0.74]];
function wordingFor(occ, lang) {
  const list = PHRASES[occ] || PHRASES.general, af = lang === 'af' ? list.find((p) => p[1]) : null;
  return af ? af[1] : list[0][0];
}
function applyPreset(ev, withTheme) {
  const s = state;
  s.event.presetId = ev.id; s.event.emoji = ev.e; s.text.title = ev.name; s.event.createdAt = new Date().toISOString();
  const dt = nextOccurrence(ev); if (dt) { s.event.date = iso(dt); s.event.time = '00:00'; }
  if (!withTheme) return;
  Object.assign(s.bg, { type: 'gradient', c1: ev.b[0], c2: ev.b[1], angle: ev.b[2], pattern: ev.pa, particles: ev.pt, photo: null });
  s.text.color = ev.tc || '#ffffff'; s.text.accent = ev.ac; s.text.titleFont = ev.f;
  s.text.numFont = SCRIPTY.includes(ev.f) ? 'Fredoka' : ev.f;
  s.frame.style = ev.id === 'christmas' || ev.id === 'xmaseve' ? 'lights' : 'none';
  s.bg.patColor = ev.tc ? ev.tc : '#ffffff';
  s.stickers = ev.st.map((e, i) => ({ id: uid(), kind: 'emoji', v: e, x: SPOTS[i][0], y: SPOTS[i][1], size: 140, rot: i % 2 ? 10 : -10, anim: ANIMS[i % 4], flip: false }));
  s.stickers.push({ id: uid(), kind: 'text', v: wordingFor(ev.occ, s.timer.lang), style: 'ribbon', c1: ev.ac, c2: contrast(ev.ac), size: 64, x: 0.5, y: 0.76, rot: 0, anim: 'none' });
}
function firstRunState() { // start with the nearest upcoming holiday so the app opens looking great
  const keep = state, now = new Date(); let best = null, bd = 1e12;
  state = baseState();
  EVENTS.forEach((e) => { const d = nextOccurrence(e, now); if (d && d - now < bd) { bd = d - now; best = e; } });
  if (best) applyPreset(best, true);
  const s = state; state = keep; return s;
}

/* ---------- storage ---------- */
let store = { cur: null, items: {} }, state, sel = null, saveTimer = 0;
function loadStore() {
  try { const r = JSON.parse(localStorage.getItem(STORE_KEY)); if (r && r.items) store = r; } catch (e) { /* first run */ }
  if (!store.cur || !store.items[store.cur]) { const s = firstRunState(); store.items[s.id] = s; store.cur = s.id; }
  state = mergeDeep(baseState(), store.items[store.cur]);
}
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    store.items[state.id] = clone(state); store.cur = state.id;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { toast('Browser storage is full – your latest photo/image may not be saved.'); }
    fillMySel();
  }, 300);
}
function toast(msg, ms = 2600) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), ms); }

/* ---------- canvas ---------- */
const cv = $('#cv'), ctx = cv.getContext('2d');
const sizeOf = () => SIZES.find((x) => x.id === state.size) || SIZES[0];
function sizeCanvas() { const z = sizeOf(), k = Math.min(0.5, 1000 / Math.max(z.w, z.h)); cv.width = Math.round(z.w * k); cv.height = Math.round(z.h * k); }
function loop(ts) {
  const t = (ts % LOOP_MS) / LOOP_MS;
  render(ctx, cv.width, cv.height, state, t, { editing: true, sel, trash });
  requestAnimationFrame(loop);
}

/* ---------- UI building ---------- */
function fillSelect(el, items) { el.innerHTML = items.map(([v, l]) => `<option value="${v}">${l}</option>`).join(''); }
function chipGrid(el, items, key, labelFn = (x) => x) {
  el.innerHTML = ''; items.forEach((v) => { const b = document.createElement('button'); b.className = 'chip'; b.dataset.v = v; b.textContent = labelFn(v); b.onclick = () => { setPath(state, key, v); refreshUI(); save(); }; el.appendChild(b); });
}
function buildUI() {
  fillSelect($('#langSel'), Object.entries(LANGS).map(([k, v]) => [k, v.name]));
  fillSelect($('#fontTitle'), FONTS.map((f) => [f, f])); fillSelect($('#fontNum'), FONTS.map((f) => [f, f]));
  $('#fontTitle').style.fontFamily = 'inherit';
  // sizes
  const groups = {}; SIZES.forEach((z) => (groups[z.g] = groups[z.g] || []).push(z));
  $('#sizeSel').innerHTML = Object.entries(groups).map(([g, l]) => `<optgroup label="${g}">${l.map((z) => `<option value="${z.id}">${z.name} (${z.w}×${z.h})</option>`).join('')}</optgroup>`).join('');
  $('#sizeSel').onchange = (e) => { state.size = e.target.value; sizeCanvas(); refreshUI(); save(); };
  // timer styles
  $('#styleGrid').innerHTML = ''; STYLES.forEach(([id, ic, nm]) => { const b = document.createElement('button'); b.className = 'card'; b.dataset.v = id; b.innerHTML = `<span class="ic">${ic}</span>${nm}`; b.onclick = () => { state.timer.style = id; refreshUI(); save(); }; $('#styleGrid').appendChild(b); });
  // gradients
  $('#gradGrid').innerHTML = ''; GRADIENTS.forEach(([nm, c1, c2, a]) => { const b = document.createElement('button'); b.className = 'sw'; b.title = nm; b.style.background = `linear-gradient(${a}deg,${c1},${c2})`; b.onclick = () => { Object.assign(state.bg, { c1, c2, angle: a, type: 'gradient' }); refreshUI(); save(); }; $('#gradGrid').appendChild(b); });
  chipGrid($('#patGrid'), PATTERNS, 'bg.pattern'); chipGrid($('#partGrid'), PARTICLES, 'bg.particles'); chipGrid($('#frameGrid'), FRAMES, 'frame.style');
  // events
  buildEvents('');
  $('#evSearch').oninput = (e) => buildEvents(e.target.value);
  // stickers
  const cats = Object.keys(STICKERS); let cat = cats[0];
  const showCat = () => { $$('#stkCats .chip').forEach((c) => c.classList.toggle('on', c.dataset.v === cat)); $('#stkGrid').innerHTML = ''; STICKERS[cat].forEach((e) => { const b = document.createElement('button'); b.textContent = e; b.onclick = () => addSticker({ kind: 'emoji', v: e, size: 150, anim: 'bounce' }); $('#stkGrid').appendChild(b); }); };
  $('#stkCats').innerHTML = ''; cats.forEach((c) => { const b = document.createElement('button'); b.className = 'chip'; b.dataset.v = c; b.textContent = c; b.onclick = () => { cat = c; showCat(); }; $('#stkCats').appendChild(b); });
  showCat();
  fillSelect($('#phOcc'), Object.keys(PHRASES).map((k) => [k, OCC_NAMES[k] || k])); fillSelect($('#phStyle'), WSTYLES.map((k) => [k, k[0].toUpperCase() + k.slice(1)]));
  $('#phOcc').onchange = buildPhrases; buildPhrases();
  $('#phAdd').onclick = () => { const v = $('#phCustom').value.trim(); if (v) { addWord(v); $('#phCustom').value = ''; } };
  $('#phCustom').onkeydown = (e) => { if (e.key === 'Enter') $('#phAdd').click(); };
}
function buildEvents(q) {
  const el = $('#evList'); el.innerHTML = ''; q = q.trim().toLowerCase(); const cats = {};
  EVENTS.filter((e) => !q || e.name.toLowerCase().includes(q) || e.cat.toLowerCase().includes(q)).forEach((e) => (cats[e.cat] = cats[e.cat] || []).push(e));
  Object.entries(cats).forEach(([c, list]) => {
    el.insertAdjacentHTML('beforeend', `<div class="evcat">${c}</div>`);
    const w = document.createElement('div'); w.className = 'evwrap';
    list.forEach((e) => {
      const b = document.createElement('button'); b.className = 'ev' + (state.event.presetId === e.id ? ' on' : ''); b.dataset.id = e.id; b.textContent = `${e.e} ${e.name}`;
      b.onclick = () => { applyPreset(e, $('#applyTheme').checked); sel = null; refreshUI(); save(); toast(`${e.e} ${e.name} ready – tweak anything you like!`); };
      w.appendChild(b);
    });
    el.appendChild(w);
  });
  if (!el.children.length) el.innerHTML = '<p class="note">No match – just type your own event name above.</p>';
}
function buildPhrases() {
  const occ = $('#phOcc').value, el = $('#phList'); el.innerHTML = '';
  (PHRASES[occ] || []).forEach(([en, af]) => [en, af].filter(Boolean).forEach((p, i) => { const b = document.createElement('button'); b.textContent = (i ? '🇿🇦 ' : '') + p; b.onclick = () => addWord(p); el.appendChild(b); }));
}
function refreshUI() {
  $$('[data-k]').forEach((el) => {
    const v = getPath(state, el.dataset.k);
    if (el.type === 'checkbox') el.checked = !!v; else if (String(v ?? '') !== el.value) el.value = v ?? '';
  });
  $('#sizeSel').value = sizeOf().id; $('#sizeDim').textContent = `${sizeOf().w} × ${sizeOf().h} px`;
  $$('#styleGrid .card').forEach((b) => b.classList.toggle('on', b.dataset.v === state.timer.style));
  const on = (sel_, key) => $$(sel_ + ' .chip').forEach((b) => b.classList.toggle('on', b.dataset.v === getPath(state, key)));
  on('#patGrid', 'bg.pattern'); on('#partGrid', 'bg.particles'); on('#frameGrid', 'frame.style');
  $$('#bgType button').forEach((b) => b.classList.toggle('on', b.dataset.v === state.bg.type));
  $('#photoOpts').hidden = state.bg.type !== 'photo';
  $('#boxOpts').hidden = state.timer.style !== 'boxes';
  $$('#evList .ev').forEach((b) => b.classList.toggle('on', b.dataset.id === state.event.presetId));
  syncStickerPanel(); fillMySel(); updateCaptionLinks();
}
function fillMySel() {
  const el = $('#mySel'); const items = { ...store.items, [state.id]: state };
  el.innerHTML = Object.values(items).map((s) => `<option value="${s.id}">${s.event.emoji} ${(s.text.title || 'Countdown').slice(0, 28)} · ${s.event.date}</option>`).join('');
  el.value = state.id;
}

/* ---------- generic input binding ---------- */
$$('[data-k]').forEach((el) => el.addEventListener('input', () => {
  const v = el.type === 'checkbox' ? el.checked : el.type === 'range' || el.type === 'number' ? +el.value : el.value;
  setPath(state, el.dataset.k, v);
  if (el.dataset.k === 'event.date') state.event.createdAt = state.event.createdAt || new Date().toISOString();
  if (el.dataset.k.startsWith('text.') && /Font$/.test(el.dataset.k)) loadFont(v);
  if (el.dataset.k === 'text.title' || el.dataset.k === 'event.date') { state.event.presetId = state.event.presetId; }
  refreshUI(); save();
}));
$('#tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) switchTab(b.dataset.tab); });
function switchTab(id) { $$('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === id)); $$('.tab').forEach((t) => t.classList.toggle('on', t.id === 'tab-' + id)); if (id === 'share') updateCaption(); }
$('#bgType').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.v === 'photo' && !state.bg.photo) { $('#bgFile').click(); return; } state.bg.type = b.dataset.v; refreshUI(); save(); });
$('#stkMode').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; $$('#stkMode button').forEach((x) => x.classList.toggle('on', x === b)); ['emoji', 'words', 'img'].forEach((m) => ($('#stk-' + m).hidden = m !== b.dataset.v)); });
const FONT_LOADED = new Set();
function loadFont(f) { if (FONT_LOADED.has(f)) return Promise.resolve(); FONT_LOADED.add(f); return document.fonts.load(`700 40px "${f}"`).catch(() => {}); }

/* ---------- photo & image upload ---------- */
function readScaled(file, max, type) {
  return new Promise((res) => {
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL(type, 0.86)); }; im.onerror = () => res(null); im.src = fr.result; };
    fr.readAsDataURL(file);
  });
}
$('#bgFile').onchange = async (e) => { const f = e.target.files[0]; if (!f) return; const d = await readScaled(f, 1600, 'image/jpeg'); if (d) { state.bg.photo = d; state.bg.type = 'photo'; refreshUI(); save(); } e.target.value = ''; };
$('#imgFile').onchange = async (e) => {
  const shape = $('#imgShape').value, bc = $('#imgBorder').value;
  for (const f of [...e.target.files]) { const d = await readScaled(f, shape === 'none' ? 700 : 900, shape === 'none' ? 'image/png' : 'image/jpeg'); if (d) addSticker({ kind: 'image', src: d, size: 320, anim: 'none', shape, bc, rot: (Math.random() - 0.5) * 10 }); }
  e.target.value = '';
};
$('#ownBtn').onclick = () => $('#newBtn').click();

/* ---------- stickers ---------- */
function addSticker(o) {
  const j = () => (Math.random() - 0.5) * 0.2;
  const s = { id: uid(), x: 0.5 + j(), y: 0.62 + j(), rot: 0, flip: false, anim: 'none', size: 150, ...o };
  state.stickers.push(s); sel = s; refreshUI(); save(); toast('Added! Drag it into place.', 1400);
}
function addWord(v) {
  const style = $('#phStyle').value, c1 = $('#phC1').value, c2 = $('#phC2').value;
  addSticker({ kind: 'text', v, style, c1, c2, size: 64, y: 0.74 });
}
function syncStickerPanel() {
  const box = $('#stkEdit'); box.hidden = !sel || !state.stickers.includes(sel);
  if (box.hidden) return;
  $('#sSize').value = sel.size; $('#sRot').value = sel.rot || 0; $('#sAnim').value = sel.anim || 'none';
  const t = sel.kind === 'text', im = sel.kind === 'image'; $('#sColors').hidden = !t; $('#sTextRow').hidden = !t; $('#sImg').hidden = !im;
  if (im) { $('#sShape').value = sel.shape || 'none'; $('#sBorder').value = sel.bc || '#ffffff'; }
  if (t) { $('#sC1').value = sel.c1; $('#sC2').value = sel.c2; if (document.activeElement !== $('#sText')) $('#sText').value = sel.v; }
}
$('#sSize').oninput = (e) => { sel.size = +e.target.value; save(); };
$('#sRot').oninput = (e) => { sel.rot = +e.target.value; save(); };
$('#sAnim').onchange = (e) => { sel.anim = e.target.value; save(); };
$('#sC1').oninput = (e) => { sel.c1 = e.target.value; save(); };
$('#sC2').oninput = (e) => { sel.c2 = e.target.value; save(); };
$('#sText').oninput = (e) => { sel.v = e.target.value; save(); };
$('#sShape').onchange = (e) => { sel.shape = e.target.value; save(); };
$('#sBorder').oninput = (e) => { sel.bc = e.target.value; save(); };
$('#sFlip').onclick = () => { sel.flip = !sel.flip; save(); };
$('#sDup').onclick = () => { const c = { ...clone(sel), id: uid(), x: Math.min(0.95, sel.x + 0.06), y: Math.min(0.95, sel.y + 0.06) }; state.stickers.push(c); sel = c; refreshUI(); save(); };
$('#sFront').onclick = () => { state.stickers = state.stickers.filter((s) => s !== sel).concat(sel); save(); };
$('#sDel').onclick = deleteSel;
function deleteSel() { if (!sel) return; state.stickers = state.stickers.filter((s) => s !== sel); sel = null; refreshUI(); save(); }
$('#clearStk').onclick = () => { if (!state.stickers.length || confirm('Remove all stickers from this countdown?')) { state.stickers = []; sel = null; refreshUI(); save(); } };
document.addEventListener('keydown', (e) => { if ((e.key === 'Delete' || e.key === 'Backspace') && sel && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); deleteSel(); } });

/* ---------- pointer interaction on the canvas ---------- */
let drag = null;
const trash = { show: false, hot: false }, ptrs = new Map();
const photoOn = () => state.bg.type === 'photo' && state.bg.photo;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
function syncPhotoSliders() { $$('[data-k^="bg.photo"]').forEach((el) => { const v = getPath(state, el.dataset.k); if (String(v) !== el.value) el.value = v; }); }
$('#photoReset').onclick = () => { Object.assign(state.bg, { photoX: 0.5, photoY: 0.5, photoZoom: 1 }); syncPhotoSliders(); save(); };
cv.addEventListener('wheel', (e) => { if (!photoOn()) return; e.preventDefault(); state.bg.photoZoom = Math.min(4, Math.max(1, (state.bg.photoZoom || 1) * (e.deltaY < 0 ? 1.06 : 0.94))); syncPhotoSliders(); save(); }, { passive: false });
const toCv = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) * cv.width) / r.width, ((e.clientY - r.top) * cv.height) / r.height]; };
function hitSticker(px, py) {
  for (let i = state.stickers.length - 1; i >= 0; i--) {
    const s = state.stickers[i], b = s._b; if (!b) continue;
    const dx = px - b.cx, dy = py - b.cy, c = Math.cos(-b.rot), si = Math.sin(-b.rot), lx = dx * c - dy * si, ly = dx * si + dy * c;
    if (Math.abs(lx) <= b.w / 2 + 8 && Math.abs(ly) <= b.h / 2 + 8) return s;
  }
  return null;
}
cv.addEventListener('pointerdown', (e) => {
  const [px, py] = toCv(e); ptrs.set(e.pointerId, [px, py]);
  if (ptrs.size === 2 && photoOn() && (!drag || drag.m === 'bg')) { const [a, b] = [...ptrs.values()]; drag = { m: 'pinch', d0: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, z0: state.bg.photoZoom || 1 }; sel = null; return; }
  if (sel && sel._b) {
    const b = sel._b, dc = Math.cos(b.rot), ds = Math.sin(b.rot), lx = -b.w / 2 - 6, ly = -b.h / 2 - 6;
    if (Math.hypot(px - (b.cx + lx * dc - ly * ds), py - (b.cy + lx * ds + ly * dc)) < 26) { deleteSel(); toast('Deleted 🗑️', 1200); return; }
  }
  if (sel && sel._b) {
    const b = sel._b, hx = b.w / 2 + 6, hy = b.h / 2 + 6, c = Math.cos(b.rot), si = Math.sin(b.rot), X = b.cx + hx * c - hy * si, Y = b.cy + hx * si + hy * c;
    if (Math.hypot(px - X, py - Y) < 26) { drag = { m: 'h', size: sel.size, rot: sel.rot || 0, d0: Math.hypot(px - b.cx, py - b.cy), a0: Math.atan2(py - b.cy, px - b.cx) }; cv.setPointerCapture(e.pointerId); return; }
  }
  const s = hitSticker(px, py);
  if (s) { sel = s; drag = { m: 'm', ox: px - s.x * cv.width, oy: py - s.y * cv.height }; cv.setPointerCapture(e.pointerId); switchTab('stickers'); }
  else { sel = null; if (photoOn()) { drag = { m: 'bg', x0: px, y0: py, bx: state.bg.photoX ?? 0.5, by: state.bg.photoY ?? 0.5 }; cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing'; } }
  refreshUI();
});
cv.addEventListener('pointermove', (e) => {
  const [px, py] = toCv(e); if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, [px, py]);
  if (drag && drag.m === 'pinch') { if (ptrs.size >= 2) { const [a, b] = [...ptrs.values()]; state.bg.photoZoom = Math.min(4, Math.max(1, drag.z0 * (Math.hypot(a[0] - b[0], a[1] - b[1]) / drag.d0))); syncPhotoSliders(); } return; }
  if (drag && drag.m === 'bg') { const ov = state.bg._ov || [0, 0]; if (ov[0] > 1) state.bg.photoX = clamp01(drag.bx - (px - drag.x0) / ov[0]); if (ov[1] > 1) state.bg.photoY = clamp01(drag.by - (py - drag.y0) / ov[1]); syncPhotoSliders(); return; }
  if (!drag || !sel) { cv.style.cursor = hitSticker(px, py) ? 'move' : 'default'; return; }
  if (drag.m === 'm') { trash.show = true; trash.hot = Math.hypot(px - cv.width / 2, py - (cv.height - 58)) < 70; sel.x = Math.min(1.05, Math.max(-0.05, (px - drag.ox) / cv.width)); sel.y = Math.min(1.05, Math.max(-0.05, (py - drag.oy) / cv.height)); }
  else { const b = sel._b, d = Math.hypot(px - b.cx, py - b.cy), a = Math.atan2(py - b.cy, px - b.cx); sel.size = Math.round(Math.min(700, Math.max(30, drag.size * (d / drag.d0)))); sel.rot = Math.round(drag.rot + ((a - drag.a0) * 180) / Math.PI); if (sel.rot > 180) sel.rot -= 360; if (sel.rot < -180) sel.rot += 360; syncStickerPanel(); }
});
const endDrag = (e) => {
  if (e && e.pointerId !== undefined) ptrs.delete(e.pointerId);
  if (drag && drag.m === 'pinch' && ptrs.size >= 1) return;
  if (drag) { const del = drag.m === 'm' && trash.hot; drag = null; trash.show = trash.hot = false; if (del) { deleteSel(); toast('Deleted 🗑️', 1200); } save(); }
};
cv.addEventListener('pointerup', endDrag); cv.addEventListener('pointercancel', endDrag);

/* ---------- my countdowns ---------- */
$('#mySel').onchange = (e) => { store.items[state.id] = clone(state); state = mergeDeep(baseState(), store.items[e.target.value]); store.cur = state.id; sel = null; sizeCanvas(); refreshUI(); save(); };
$('#newBtn').onclick = () => { store.items[state.id] = clone(state); state = baseState(); store.items[state.id] = clone(state); sel = null; sizeCanvas(); refreshUI(); save(); switchTab('event'); toast('New countdown – pick an occasion or type your own!'); };
$('#dupBtn').onclick = () => { store.items[state.id] = clone(state); state = { ...clone(state), id: uid() }; state.text.title += ' (copy)'; store.items[state.id] = clone(state); sel = null; refreshUI(); save(); };
$('#delBtn').onclick = () => {
  if (!confirm(`Delete “${state.text.title}”?`)) return;
  delete store.items[state.id]; const ids = Object.keys(store.items);
  if (ids.length) state = mergeDeep(baseState(), store.items[ids[0]]); else state = baseState();
  store.cur = state.id; store.items[state.id] = clone(state); sel = null; sizeCanvas(); refreshUI(); save();
};

/* ---------- export ---------- */
const slug = () => (state.text.title || 'countdown').normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'countdown';
async function ensureAssets() {
  await document.fonts.ready;
  const fonts = new Set([state.text.titleFont, state.text.numFont, 'Fredoka']);
  state.stickers.forEach((s) => s.kind === 'text' && fonts.add(WFONT[s.style]));
  await Promise.all([...fonts].map((f) => document.fonts.load(`700 40px "${f}"`).catch(() => {})));
  await Promise.all([state.bg.photo, 'logo-192.png', ...state.stickers.filter((s) => s.kind === 'image').map((s) => s.src)].filter(Boolean).map(preloadImg));
}
function offscreen(W, H) { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; }
const toBlob = (c, type = 'image/png') => new Promise((r) => c.toBlob(r, type));
async function makePng(now) {
  await ensureAssets(); const z = sizeOf(), c = offscreen(z.w, z.h);
  render(c.getContext('2d'), z.w, z.h, state, 0, { now: now || new Date() }); return toBlob(c);
}
function download(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }
const daysLeft = () => calc(state, new Date());
const fname = (ext) => `TictAC-${slug()}-${daysLeft().calDays}d.${ext}`;

$('#pngBtn').onclick = async () => { download(await makePng(), fname('png')); toast('Picture saved ✔'); };
$('#shareBtn').onclick = async () => {
  const blob = await makePng(), file = new File([blob], fname('png'), { type: 'image/png' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: state.text.title, text: $('#caption').value || undefined }); }
    else { download(blob, file.name); toast('Sharing isn’t available here – picture downloaded instead. Attach it in your app!'); }
  } catch (e) { if (e.name !== 'AbortError') { download(blob, file.name); toast('Picture downloaded instead.'); } }
};
$('#copyBtn').onclick = async () => {
  try { const blob = await makePng(); await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); toast('Image copied – paste it into your chat or post ✔'); }
  catch (e) { toast('Your browser can’t copy images – use Download instead.'); }
};

const prog = (id, p, label) => { const el = $(id); el.hidden = p == null; if (p != null) { $('i', el).style.width = p * 100 + '%'; $('span', el).textContent = label; } };
const tick = () => new Promise((r) => setTimeout(r, 0));
let busy = false;
$('#gifBtn').onclick = async () => {
  if (busy) return; busy = true; $('#gifBtn').disabled = true;
  try {
    await ensureAssets(); const z = sizeOf(), q = +$('#gifQ').value, k = Math.min(q / Math.min(z.w, z.h), (q * 1.8) / Math.max(z.w, z.h), 1), w = Math.round(z.w * k), h = Math.round(z.h * k), N = 40, now = new Date();
    const c = offscreen(w, h), g = c.getContext('2d', { willReadFrequently: true }), enc = new GifEncoder(w, h);
    for (let i = 0; i < N; i++) { render(g, w, h, state, i / N, { now }); enc.addFrame(g.getImageData(0, 0, w, h).data, LOOP_MS / N); prog('#gifProg', (i + 1) / N, `Frame ${i + 1} / ${N}`); await tick(); }
    const blob = enc.finish(); download(blob, fname('gif')); toast(`GIF saved ✔ (${(blob.size / 1048576).toFixed(1)} MB)`);
  } catch (e) { console.error(e); toast('Could not make the GIF: ' + e.message); }
  prog('#gifProg', null); busy = false; $('#gifBtn').disabled = false;
};
$('#packBtn').onclick = async () => {
  if (busy) return; busy = true; $('#packBtn').disabled = true;
  try {
    await ensureAssets();
    const z = sizeOf(), [hh, mm] = ($('#packTime').value || '09:00').split(':').map(Number), tgt = new Date(`${state.event.date}T00:00`), today = startOfDay(new Date());
    const total = Math.min(400, Math.max(0, Math.round((tgt - today) / 864e5))), files = [], c = offscreen(z.w, z.h), g = c.getContext('2d'), folder = `TictAC-${slug()}`;
    for (let i = 0, d = total; d >= 0; d--, i++) {
      const now = new Date(tgt.getFullYear(), tgt.getMonth(), tgt.getDate() - d, hh, mm);
      render(g, z.w, z.h, state, 0, { now });
      const blob = await toBlob(c); files.push({ name: `${folder}/${String(i + 1).padStart(3, '0')}_${d}-days-to-go.png`, data: new Uint8Array(await blob.arrayBuffer()) });
      prog('#packProg', (i + 1) / (total + 1), `Picture ${i + 1} / ${total + 1}`); await tick();
    }
    download(makeZip(files), `${folder}-daily-pack.zip`); toast(`Daily pack saved ✔ (${files.length} pictures)`);
  } catch (e) { console.error(e); toast('Could not build the pack: ' + e.message); }
  prog('#packProg', null); busy = false; $('#packBtn').disabled = false;
};

/* ---------- caption & links ---------- */
function updateCaption() {
  const i = daysLeft(), tag = slug().replace(/-/g, '');
  $('#caption').value = i.done ? `${state.event.emoji} ${state.text.title} is here! 🎉 #${tag} #TictAC`
    : `${state.event.emoji} ${i.parts[0].v} ${i.label} – ${state.text.title}! ✨ #countdown #${tag} #TictAC`;
  updateCaptionLinks();
}
function updateCaptionLinks() {
  const t = encodeURIComponent($('#caption').value), u = /^https?:/.test(location.href) ? encodeURIComponent(location.origin) : '';
  $('#waLink').href = `https://wa.me/?text=${t}`; $('#tgLink').href = `https://t.me/share/url?url=${u || 'https%3A%2F%2Ft.me'}&text=${t}`; $('#xLink').href = `https://twitter.com/intent/tweet?text=${t}`;
}
$('#capBtn').onclick = updateCaption; $('#caption').oninput = updateCaptionLinks;
$('#capCopy').onclick = async () => { try { await navigator.clipboard.writeText($('#caption').value); toast('Caption copied ✔'); } catch (e) { $('#caption').select(); toast('Press Ctrl+C to copy'); } };

/* ---------- start ---------- */
loadStore(); buildUI(); sizeCanvas(); refreshUI(); updateCaption();
[state.text.titleFont, state.text.numFont, 'Fredoka', 'Lobster', 'Bangers', 'Pacifico', 'Righteous', 'Caveat', 'Anton'].forEach(loadFont);
preloadImg('logo-192.png');
requestAnimationFrame(loop);
const APP_VERSION = '2026-10-21-5';
if (/^https?:/.test(location.protocol)) {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').then((r) => r.update()).catch(() => {});
  const checkUpdate = () => fetch('version.json?' + Date.now(), { cache: 'no-store' }).then((r) => r.json()).then((j) => { if (j.v && j.v !== APP_VERSION) $('#updateBar').hidden = false; }).catch(() => {});
  setTimeout(checkUpdate, 2500); setInterval(checkUpdate, 120000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkUpdate(); });
  $('#reloadBtn').onclick = async () => { try { const ks = await caches.keys(); await Promise.all(ks.map((k) => caches.delete(k))); } catch (e) { /* ignore */ } location.reload(); };
}
