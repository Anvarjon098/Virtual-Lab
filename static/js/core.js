'use strict';
/* =========================================================================
   Virtual laboratoriya — umumiy yadro: yordamchi funksiyalar, grafik,
   jurnal, test, press chizmasi va boshqalar.
   ========================================================================= */
const VL = { labs: [], token: 0 };

VL.register = lab => VL.labs.push(lab);
VL.get = id => VL.labs.find(l => l.id === id);

/* ---------- DOM ---------- */
VL.h = function (tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
};

VL.toast = function (msg, kind = 'ok') {
  const t = VL.h('div', { class: 'toast ' + kind }, msg);
  document.body.append(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2600);
};

/* ---------- Matematika ---------- */
VL.rand = (a, b) => a + Math.random() * (b - a);
VL.gauss = (m = 0, s = 1) => {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
VL.clamp = (x, a, b) => Math.min(b, Math.max(a, x));
VL.lerp = (a, b, t) => a + (b - a) * t;
VL.ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
VL.mean = a => a.reduce((s, x) => s + x, 0) / a.length;
VL.std = a => {
  if (a.length < 2) return 0;
  const m = VL.mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
};
VL.erf = x => {
  const s = Math.sign(x); x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
};
VL.Phi = z => 0.5 * (1 + VL.erf(z / Math.SQRT2));
VL.fmt = (v, d = 1) => (Number.isFinite(v) ? Number(v).toFixed(d) : '—').replace('.', ',');
VL.fmtTick = v => String(+v.toFixed(3)).replace('.', ',');
VL.niceStep = r => {
  const p = Math.pow(10, Math.floor(Math.log10(r)));
  const f = r / p;
  return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * p;
};

/* ---------- Canvas ---------- */
VL.fit = function (canvas) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 300, h = canvas.clientHeight || 200;
  const W = Math.round(w * dpr), H = Math.round(h * dpr);
  if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
};

/** Laboratoriya sahifasi ochiq ekan, har kadrda fn(dt, vaqt) chaqiriladi. */
VL.loop = function (fn) {
  const tok = VL.token;
  let last = performance.now();
  function frame(now) {
    if (tok !== VL.token) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    fn(dt, now / 1000);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};

VL.rrect = function (ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

VL.metal = function (ctx, x, y, w, h, horizontal, dark) {
  const g = horizontal ? ctx.createLinearGradient(x, y, x, y + h) : ctx.createLinearGradient(x, y, x + w, y);
  if (dark) {
    g.addColorStop(0, '#1e293b'); g.addColorStop(0.45, '#64748b'); g.addColorStop(1, '#0f172a');
  } else {
    g.addColorStop(0, '#64748b'); g.addColorStop(0.45, '#e2e8f0'); g.addColorStop(1, '#475569');
  }
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(15,23,42,.55)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
};

VL.sceneBg = function (ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#f8fafc'); g.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
};

/** Tasodifiy nuqtalar (beton/qum teksturasi uchun), koordinatalar 0..1 */
VL.speckles = function (n, colors, rmin = 0.6, rmax = 2.4) {
  return Array.from({ length: n }, () => ({
    x: Math.random(), y: Math.random(), r: VL.rand(rmin, rmax),
    c: colors[Math.floor(Math.random() * colors.length)],
  }));
};
VL.drawSpeckles = function (ctx, x, y, w, h, sp, scale = 1) {
  for (const p of sp) {
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.arc(x + p.x * w, y + p.y * h, p.r * scale, 0, 7);
    ctx.fill();
  }
};

/* ---------- Yoriqlar va zarrachalar ---------- */
VL.makeCracks = function (kind) {
  const lines = [], spalls = [];
  const J = s => VL.gauss(0, s);
  const path = (a, b, n, jit) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push([VL.lerp(a[0], b[0], t) + (i && i < n ? J(jit) : 0), VL.lerp(a[1], b[1], t) + (i && i < n ? J(jit) : 0)]);
    }
    return pts;
  };
  if (kind === 'cube') {
    const cx = 0.5 + J(0.04), cy = 0.5 + J(0.05);
    for (const c of [[0.02, 0.02], [0.98, 0.02], [0.02, 0.98], [0.98, 0.98]]) {
      const tx = cx + (c[0] < 0.5 ? -0.12 : 0.12), ty = cy + (c[1] < 0.5 ? -0.06 : 0.06);
      lines.push(path(c, [tx, ty], 6, 0.025));
    }
    lines.push(path([0.3 + J(0.04), 0], [0.27 + J(0.05), 0.42], 5, 0.02));
    lines.push(path([0.7 + J(0.04), 1], [0.72 + J(0.05), 0.58], 5, 0.02));
    lines.push(path([cx - 0.12, cy - 0.06], [cx + 0.12, cy + 0.06], 4, 0.03));
    spalls.push([[0, 0.25 + J(0.03)], [0.15 + J(0.03), 0.42], [0.18 + J(0.03), 0.6], [0, 0.76 + J(0.03)]]);
    spalls.push([[1, 0.22 + J(0.03)], [0.84 + J(0.03), 0.4], [0.86 + J(0.03), 0.62], [1, 0.74 + J(0.03)]]);
  } else {
    for (let i = 0; i < 3; i++) {
      const x = 0.22 + i * 0.28 + J(0.04);
      lines.push(path([x, 0], [x + J(0.06), 1], 9, 0.02));
    }
    spalls.push([[0, 0.8], [0.1 + J(0.02), 0.9], [0.06, 1], [0, 1]]);
    spalls.push([[1, 0], [0.9 + J(0.02), 0.07], [0.94, 0.16], [1, 0.2]]);
  }
  return { lines, spalls };
};

VL.drawCracks = function (ctx, x, y, w, h, cr, t, inner = '#44403c') {
  if (!cr || t <= 0) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(28,25,23,.9)';
  ctx.lineWidth = 1.6;
  ctx.lineJoin = 'round';
  for (const ln of cr.lines) {
    const n = Math.max(1, Math.floor((ln.length - 1) * Math.min(1, t)));
    ctx.beginPath();
    ln.slice(0, n + 1).forEach(([a, b], i) => (i ? ctx.lineTo(x + a * w, y + b * h) : ctx.moveTo(x + a * w, y + b * h)));
    ctx.stroke();
  }
  if (t >= 1) {
    for (const sp of cr.spalls) {
      ctx.beginPath();
      sp.forEach(([a, b], i) => (i ? ctx.lineTo(x + a * w, y + b * h) : ctx.moveTo(x + a * w, y + b * h)));
      ctx.closePath();
      ctx.fillStyle = inner;
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.restore();
};

VL.Particles = class {
  constructor() { this.p = []; }
  spawn(x, y, n, color, spread = 120) {
    for (let i = 0; i < n; i++) {
      this.p.push({ x, y: y + VL.rand(-20, 20), vx: VL.gauss(0, spread), vy: VL.rand(-spread, spread * 0.2), r: VL.rand(1.2, 3.5), c: color, life: 2.5 });
    }
  }
  update(dt, floorY) {
    for (const q of this.p) {
      q.vy += 600 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.life -= dt;
      if (q.y > floorY) { q.y = floorY; q.vy *= -0.25; q.vx *= 0.6; }
    }
    this.p = this.p.filter(q => q.life > 0);
  }
  draw(ctx) {
    for (const q of this.p) {
      ctx.globalAlpha = Math.min(1, q.life);
      ctx.fillStyle = q.c;
      ctx.fillRect(q.x, q.y, q.r, q.r);
    }
    ctx.globalAlpha = 1;
  }
  clear() { this.p = []; }
};

/* ---------- Gidravlik press ---------- */
VL.PRESS_RESERVED = 230;   // namunadan tashqari vertikal joy, px
VL.drawPress = function (ctx, w, h, o) {
  VL.sceneBg(ctx, w, h);
  const cx = w / 2, floorY = h - 16, baseH = 48, baseTop = floorY - baseH;
  const frameW = Math.min(w - 40, o.specW * 2.3 + 90);
  const L = cx - frameW / 2, R = cx + frameW / 2;
  const topY = 14, headH = 42, platH = 14;
  const pw = o.specW * 1.25;

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, floorY, w, h - floorY);
  // ustunlar
  VL.metal(ctx, L + 4, topY + 10, 20, baseTop - topY - 10);
  VL.metal(ctx, R - 24, topY + 10, 20, baseTop - topY - 10);
  // yuqori traversa
  VL.metal(ctx, L - 12, topY, frameW + 24, headH, true, true);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 11px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText(o.title || 'PGM-1000 · gidravlik press', L + 34, topY + 26);
  ctx.fillStyle = o.loading ? '#ef4444' : '#22c55e';
  ctx.beginPath(); ctx.arc(R - 36, topY + 21, 6, 0, 7); ctx.fill();
  // sharsimon tayanch va yuqori plita
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath(); ctx.ellipse(cx, topY + headH, pw * 0.22, 7, 0, 0, Math.PI); ctx.fill();
  VL.metal(ctx, cx - pw / 2, topY + headH + 6, pw, platH, true);
  // namuna pastki plitada turadi; gap — yuqori plita bilan namuna orasidagi masofa
  const sy = topY + headH + 6 + platH + (o.gap || 0);
  const sh = o.specH - (o.squeeze || 0);
  if (o.drawSpec) o.drawSpec(ctx, cx - o.specW / 2, sy, o.specW, sh);
  // pastki plita va porshen
  const ly = sy + sh;
  VL.metal(ctx, cx - pw / 2, ly, pw, platH, true);
  const pistW = pw * 0.55;
  VL.metal(ctx, cx - pistW / 2, ly + platH, pistW, Math.max(4, baseTop - ly - platH));
  // asos
  VL.metal(ctx, L - 18, baseTop, frameW + 36, baseH, true, true);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('gidrosilindr', cx, baseTop + 29);
  return { floorY, specX: cx - o.specW / 2, specY: sy, specBottom: sy + sh };
};

/* ---------- Grafik ---------- */
VL.Chart = class {
  constructor(canvas, o) {
    this.c = canvas;
    this.o = Object.assign({ xMin: 0, yMin: 0, xLabel: '', yLabel: '' }, o);
    this.reset();
  }
  reset() { this.series = []; this.zones = []; this.marks = []; this.lines = []; }
  add(s) { const x = Object.assign({ color: '#2563eb', width: 2, data: [] }, s); this.series.push(x); return x; }
  _range(i) {
    const k = i ? 'y' : 'x', o = this.o;
    const min = o[k + 'Min'];
    let max = o[k + 'Max'];
    if (max == null) {
      max = -Infinity;
      for (const s of this.series) for (const p of s.data) max = Math.max(max, p[i]);
      for (const m of this.marks) max = Math.max(max, i ? m.y : m.x);
      max = !Number.isFinite(max) || max <= min ? min + 1 : min + (max - min) * 1.12;
    }
    return [min, max];
  }
  draw() {
    const { ctx, w, h } = VL.fit(this.c);
    const o = this.o, P = { l: 56, r: 14, t: o.title ? 30 : 14, b: 44 };
    const [x0, x1] = this._range(0), [y0, y1] = this._range(1);
    const X = v => P.l + (v - x0) / (x1 - x0) * (w - P.l - P.r);
    const Y = v => h - P.b - (v - y0) / (y1 - y0) * (h - P.t - P.b);
    const seg = (a, b, c, d) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); };
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);
    ctx.font = '11px system-ui';
    ctx.lineWidth = 1;
    // y to'r
    ctx.strokeStyle = '#e5e7eb'; ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    const ys = VL.niceStep((y1 - y0) / 6);
    for (let v = Math.ceil(y0 / ys) * ys; v <= y1 + 1e-9; v += ys) { const y = Y(v); seg(P.l, y, w - P.r, y); ctx.fillText(VL.fmtTick(v), P.l - 6, y); }
    // x to'r
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    if (o.xTicks) {
      for (const t of o.xTicks) { const x = X(t.v); seg(x, P.t, x, h - P.b); ctx.fillText(t.label, x, h - P.b + 6); }
    } else {
      const xs = VL.niceStep((x1 - x0) / 7);
      for (let v = Math.ceil(x0 / xs) * xs; v <= x1 + 1e-9; v += xs) { const x = X(v); seg(x, P.t, x, h - P.b); ctx.fillText(VL.fmtTick(v), x, h - P.b + 6); }
    }
    ctx.save();
    ctx.beginPath(); ctx.rect(P.l, P.t, w - P.l - P.r, h - P.t - P.b); ctx.clip();
    for (const z of this.zones) {
      ctx.beginPath();
      z.poly.forEach(([a, b], i) => (i ? ctx.lineTo(X(a), Y(b)) : ctx.moveTo(X(a), Y(b))));
      ctx.closePath();
      ctx.fillStyle = z.fill; ctx.fill();
      if (z.stroke) { ctx.strokeStyle = z.stroke; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]); }
    }
    for (const l of this.lines) {
      ctx.strokeStyle = l.color || '#94a3b8'; ctx.lineWidth = l.width || 1.2;
      ctx.setLineDash(l.dash || [5, 4]);
      seg(X(l.x0), Y(l.y0), X(l.x1), Y(l.y1));
      ctx.setLineDash([]);
      if (l.label) { ctx.fillStyle = l.color || '#64748b'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(l.label, X(l.x1) + 4, Y(l.y1) - 2); }
    }
    for (const s of this.series) {
      if (!s.data.length) continue;
      ctx.strokeStyle = s.color; ctx.lineWidth = s.width; ctx.lineJoin = 'round';
      ctx.setLineDash(s.dash || []);
      ctx.beginPath();
      s.data.forEach(([a, b], i) => (i ? ctx.lineTo(X(a), Y(b)) : ctx.moveTo(X(a), Y(b))));
      ctx.stroke();
      ctx.setLineDash([]);
      if (s.points) for (const [a, b] of s.data) {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(X(a), Y(b), 4, 0, 7); ctx.fill();
        ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.stroke();
      }
    }
    ctx.restore();
    for (const m of this.marks) {
      const x = X(m.x), y = Y(m.y);
      ctx.fillStyle = m.color || '#dc2626';
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 7); ctx.fill();
      if (m.label) {
        ctx.font = 'bold 11px system-ui'; ctx.textAlign = m.align || 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText(m.label, x + (m.align === 'right' ? -7 : 7), y - 4);
        ctx.font = '11px system-ui';
      }
    }
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.2;
    seg(P.l, P.t, P.l, h - P.b); seg(P.l, h - P.b, w - P.r, h - P.b);
    ctx.fillStyle = '#334155'; ctx.font = '12px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(o.xLabel, P.l + (w - P.l - P.r) / 2, h - 8);
    ctx.save(); ctx.translate(14, P.t + (h - P.t - P.b) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(o.yLabel, 0, 0); ctx.restore();
    if (o.title) { ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left'; ctx.fillText(o.title, P.l, 18); }
    const named = this.series.filter(s => s.label);
    if (named.length) {
      ctx.font = '11px system-ui';
      const lw = Math.max(...named.map(s => ctx.measureText(s.label).width)) + 34;
      const lx = w - P.r - lw - 6, ly = P.t + 6;
      ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(lx, ly, lw, named.length * 17 + 6);
      ctx.strokeStyle = '#e2e8f0'; ctx.strokeRect(lx, ly, lw, named.length * 17 + 6);
      named.forEach((s, i) => {
        const yy = ly + 12 + i * 17;
        ctx.strokeStyle = s.color; ctx.lineWidth = 3; seg(lx + 6, yy, lx + 22, yy);
        ctx.fillStyle = '#334155'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s.label, lx + 28, yy);
      });
    }
  }
};
VL.COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2'];

/* ---------- Boshqaruv elementlari ---------- */
VL.field = {
  select(parent, label, options, value) {
    const s = VL.h('select', null, options.map(([v, t]) => VL.h('option', { value: v }, t)));
    s.value = String(value);
    parent.append(VL.h('label', { class: 'field' }, VL.h('span', null, label), s));
    return s;
  },
  range(parent, label, o) {
    const out = VL.h('b', null);
    const inp = VL.h('input', { type: 'range', min: o.min, max: o.max, step: o.step, value: o.value });
    const upd = () => (out.textContent = VL.fmt(+inp.value, o.dec ?? 0) + (o.unit ? ' ' + o.unit : ''));
    inp.addEventListener('input', upd); upd();
    parent.append(VL.h('label', { class: 'field' }, VL.h('span', null, label, ' ', out), inp));
    return inp;
  },
  button(parent, text, onclick, cls = '') {
    const b = VL.h('button', { class: 'btn ' + cls, onclick }, text);
    parent.append(b);
    return b;
  },
};
VL.lock = (root, on) => root.querySelectorAll('input, select').forEach(e => (e.disabled = on));

/** Ketma-ket bajariladigan bosqich tugmalari */
VL.Steps = class {
  constructor(parent, defs, onAllDone) {
    this.defs = defs; this.onAllDone = onAllDone;
    this.box = VL.h('div', { class: 'steps' });
    parent.append(VL.h('div', { class: 'steps-title' }, 'Ish bosqichlari'), this.box);
    this.btns = defs.map((d, i) => {
      const b = VL.h('button', { class: 'step', onclick: () => this.run(i) }, VL.h('i', null, String(i + 1)), d.label);
      this.box.append(b);
      return b;
    });
    this.reset();
  }
  reset() {
    this.i = 0; this.busy = false;
    this.btns.forEach((b, k) => { b.disabled = k !== 0; b.classList.remove('done', 'active'); });
  }
  run(i) {
    if (i !== this.i || this.busy) return;
    this.busy = true;
    VL.sfx.play('step');
    const b = this.btns[i];
    b.classList.add('active');
    this.defs[i].run(() => {
      b.classList.remove('active'); b.classList.add('done'); b.disabled = true;
      this.busy = false; this.i++;
      VL.sfx.play(this.btns[this.i] ? 'done' : 'ok');
      if (this.btns[this.i]) this.btns[this.i].disabled = false;
      else if (this.onAllDone) this.onAllDone();
    });
  }
};

/** Vaqt bo'yicha animatsiya: dur soniya davomida fn(t∈0..1), so'ng done() */
VL.tween = function (dur, fn, done) {
  const tok = VL.token, t0 = performance.now();
  (function f(now) {
    if (tok !== VL.token) return;
    const t = Math.min(1, (now - t0) / 1000 / dur);
    fn(t);
    if (t < 1) requestAnimationFrame(f); else if (done) done();
  })(t0);
};
VL.sequence = function (items, each, done) {
  let i = 0;
  (function next() { if (i >= items.length) return done && done(); each(items[i], i++, next); })();
};

/* ---------- Jadval ---------- */
VL.table = function (head, rows, foot) {
  const tr = (cells, tag) => '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
  return `<table class="tbl"><thead>${tr(head, 'th')}</thead><tbody>${rows.map(r => tr(r, 'td')).join('')}</tbody>` +
    (foot ? `<tfoot>${foot.map(r => tr(r, 'td')).join('')}</tfoot>` : '') + '</table>';
};

/* ---------- Talaba va jurnal ---------- */
VL.student = () => localStorage.getItem('vl_student') || '';
VL.journal = {
  key: 'vl_journal_v1',
  all() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
  _set(a) { localStorage.setItem(this.key, JSON.stringify(a)); },
  add(e) {
    const a = this.all();
    a.unshift(Object.assign({ id: Date.now(), date: new Date().toLocaleString('ru-RU'), student: VL.student() || '—' }, e));
    this._set(a);
  },
  remove(id) { this._set(this.all().filter(e => e.id !== id)); },
  clear() { this._set([]); },
};
VL.save = function (lab, summary, html) {
  VL.journal.add({ lab: lab.id, title: lab.title, standard: lab.standard, summary, html });
  VL.sfx.play('save');
  VL.toast("Natija laboratoriya jurnaliga saqlandi");
};
/** Natijalar ostiga «Jurnalga saqlash» va «Chop etish» tugmalarini qo'shadi */
VL.resultActions = function (container, lab, summary, html) {
  container.append(VL.h('div', { class: 'row' },
    VL.h('button', { class: 'btn primary', onclick: () => VL.save(lab, summary, html) }, '💾 Jurnalga saqlash'),
    VL.h('button', {
      class: 'btn', onclick: () => VL.printHTML(VL.reportHTML({
        title: lab.title, standard: lab.standard, student: VL.student() || '—', date: new Date().toLocaleString('ru-RU'), html,
      })),
    }, '🖨 Hisobotni chop etish')));
};
VL.printHTML = function (html) {
  const area = document.getElementById('print-area');
  area.innerHTML = html;
  document.body.classList.add('printing');
  setTimeout(() => { window.print(); document.body.classList.remove('printing'); }, 50);
};
VL.reportHTML = function (e) {
  return `<div class="report">
    <div class="report-head"><h2>Laboratoriya ishi hisoboti</h2>
    <p><b>Ish:</b> ${e.title}<br><b>Me'yoriy hujjat:</b> ${e.standard}<br>
    <b>Bajaruvchi:</b> ${e.student}<br><b>Sana:</b> ${e.date}</p></div>
    ${e.html}
    <p class="sign">Bajaruvchi: ____________ &nbsp;&nbsp;&nbsp; Tekshirdi: ____________</p></div>`;
};

/* ---------- Bilim testi ---------- */
VL.quiz = function (parent, qs) {
  const form = VL.h('div', { class: 'quiz' });
  qs.forEach((q, i) => {
    form.append(VL.h('fieldset', { 'data-a': q.a },
      VL.h('legend', null, `${i + 1}. ${q.q}`),
      q.o.map((t, j) => VL.h('label', null, VL.h('input', { type: 'radio', name: 'q' + i, value: j }), ' ', t))));
  });
  const res = VL.h('div', { class: 'quiz-res' });
  form.append(VL.h('div', { class: 'row' },
    VL.h('button', { class: 'btn primary', onclick: check }, 'Tekshirish'),
    VL.h('button', { class: 'btn', onclick: reset }, 'Qaytadan')), res);
  parent.append(form);
  function check() {
    let ok = 0;
    form.querySelectorAll('fieldset').forEach(fs => {
      const a = +fs.dataset.a, sel = fs.querySelector('input:checked');
      fs.querySelectorAll('label').forEach((l, j) => l.classList.toggle('right', j === a));
      const good = sel && +sel.value === a;
      fs.classList.toggle('bad', !good); fs.classList.toggle('good', good);
      if (good) ok++;
    });
    const p = Math.round(ok / qs.length * 100);
    const grade = p >= 86 ? "a'lo (5)" : p >= 71 ? 'yaxshi (4)' : p >= 55 ? 'qoniqarli (3)' : 'qoniqarsiz (2)';
    VL.sfx.play(p >= 55 ? 'ok' : 'bad');
    res.innerHTML = `Natija: <b>${ok} / ${qs.length}</b> (${p}%) — baho: <b>${grade}</b>`;
  }
  function reset() {
    form.querySelectorAll('input').forEach(i => (i.checked = false));
    form.querySelectorAll('fieldset').forEach(f => f.classList.remove('bad', 'good'));
    form.querySelectorAll('label').forEach(l => l.classList.remove('right'));
    res.innerHTML = '';
  }
};

/* ---------- Nazariya sahifasi: asosiy qism + chuqurlashtirilgan tahlil + mundarija ---------- */
VL.deep = {};
VL.theoryPage = function (sec, lab) {
  const deep = VL.deep[lab.id];
  const body = VL.h('div', { class: 'panel theory-body', html:
    "<h2 class='th-part'>I. Asosiy ma'lumotlar</h2>" + lab.theory +
    (deep ? '<h2 class="th-part">II. Chuqurlashtirilgan nazariy tahlil</h2>' + deep : '') });
  const toc = VL.h('nav', { class: 'th-toc' }, VL.h('b', null, 'Mundarija'));
  let n = 0;
  body.querySelectorAll('h2.th-part, h3').forEach(hd => {
    hd.id = 'th-' + lab.id + '-' + (++n);
    toc.append(VL.h('a', {
      class: hd.tagName === 'H2' ? 'lvl1' : 'lvl2', href: 'javascript:void 0',
      onclick: () => hd.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    }, hd.textContent));
  });
  toc.append(VL.h('button', {
    class: 'btn', onclick: () => VL.printHTML(`<div class="report"><div class="report-head"><h2>${lab.title}</h2>
      <p><b>Me'yoriy hujjat:</b> ${lab.standard}</p></div>${body.innerHTML}</div>`),
  }, '🖨 Nazariyani chop etish'));
  sec.append(VL.h('div', { class: 'theory-wrap' }, toc, body));
};

/* ---------- Laboratoriya sahifasi maketi ---------- */
VL.layout = function (root, lab) {
  const tabsDef = [['exp', 'Tajriba'], ['theory', 'Nazariya'], ['quiz', 'Bilim testi']];
  const tabs = VL.h('div', { class: 'tabs' });
  const secs = {};
  for (const [k, t] of tabsDef) {
    tabs.append(VL.h('button', { 'data-k': k, onclick: () => show(k) }, t));
    secs[k] = VL.h('section', { class: 'tab-sec' });
  }
  function show(k) {
    tabs.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
    for (const s in secs) secs[s].hidden = s !== k;
  }
  const params = VL.h('div', { class: 'panel params' }, VL.h('h3', null, 'Sinov parametrlari'));
  const scene = VL.h('canvas', { class: 'scene' });
  const chart = VL.h('canvas', { class: 'chart' });
  const readouts = VL.h('div', { class: 'readouts' });
  const notice = VL.h('div', { class: 'notice', hidden: true });
  const results = VL.h('div', { class: 'panel results' });
  secs.exp.append(
    VL.h('div', { class: 'lab-grid' },
      params,
      VL.h('div', { class: 'panel stage' }, VL.h('h3', null, 'Laboratoriya qurilmasi'), scene, readouts, notice),
      VL.h('div', { class: 'panel graph' }, VL.h('h3', null, 'Sinov grafigi'), chart)),
    results);
  VL.theoryPage(secs.theory, lab);
  VL.quiz(secs.quiz, lab.quiz);
  root.append(
    VL.h('div', { class: 'lab-head' },
      VL.h('div', null, VL.h('h2', null, lab.icon + ' ' + lab.title), VL.h('div', { class: 'std' }, lab.standard)),
      tabs),
    secs.exp, secs.theory, secs.quiz);
  show('exp');
  const L = { params, scene, chart, readouts, results, notice };
  L.readout = (label, unit) => {
    const v = VL.h('b', null, '—');
    readouts.append(VL.h('div', { class: 'lcd' }, VL.h('span', null, label), v, VL.h('small', null, unit || '')));
    return { set: (x, d = 1) => (v.textContent = typeof x === 'number' ? VL.fmt(x, d) : x) };
  };
  L.note = (html, kind = 'warn') => {
    notice.hidden = !html; notice.className = 'notice ' + kind; notice.innerHTML = html || '';
  };
  return L;
};
