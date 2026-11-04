'use strict';
/* =========================================================================
   Ovoz effektlari — Web Audio API orqali sintez qilinadi (tashqi fayl yo'q).
   VL.sfx.play(nom), VL.sfx.hum(true|false), VL.sfx.toggle()
   ========================================================================= */
VL.sfx = (function () {
  let ctx = null, master = null, humNode = null;
  let on = localStorage.getItem('vl_sound') !== 'off';

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // oddiy ton: chastota f (yoki [f0,f1] siljish), davomiyligi d, to'lqin turi
  function tone(f, d, type = 'sine', vol = 0.3, delay = 0) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    const [f0, f1] = Array.isArray(f) ? f : [f, f];
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + d + 0.02);
  }

  // shovqin portlashi: filtr turi va chastotasi bilan (yoriq, zarba, suv)
  function noise(d, ftype = 'bandpass', freq = 2000, vol = 0.4, delay = 0, q = 1) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + delay;
    const len = Math.ceil(c.sampleRate * d);
    const buf = c.createBuffer(1, len, c.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
    s.buffer = buf; fl.type = ftype; fl.frequency.value = freq; fl.Q.value = q;
    g.gain.value = vol;
    s.connect(fl).connect(g).connect(master);
    s.start(t);
  }

  const lib = {
    click: () => tone(1200, 0.04, 'square', 0.06),
    step: () => tone([500, 750], 0.09, 'triangle', 0.15),
    done: () => { tone(660, 0.12, 'sine', 0.2); tone(990, 0.18, 'sine', 0.2, 0.1); },
    ok: () => { tone(523, 0.12, 'sine', 0.22); tone(659, 0.12, 'sine', 0.22, 0.1); tone(784, 0.22, 'sine', 0.22, 0.2); },
    bad: () => { tone(330, 0.18, 'sawtooth', 0.12); tone(247, 0.3, 'sawtooth', 0.12, 0.16); },
    beep: () => tone(1500, 0.12, 'square', 0.08),
    // beton/g'isht yorilishi: bir necha qisqa chirsillash + gumburlash
    crack: () => {
      for (let i = 0; i < 6; i++) noise(0.06 + Math.random() * 0.08, 'highpass', 1800 + Math.random() * 2500, 0.5, i * 0.05 + Math.random() * 0.03);
      noise(0.5, 'lowpass', 300, 0.7, 0.05);
      tone([120, 45], 0.4, 'sine', 0.35, 0.03);
    },
    // po'lat namunaning uzilishi: keskin metall "chiq" + jarang
    snap: () => {
      noise(0.08, 'highpass', 4000, 0.8);
      tone([2400, 1800], 0.6, 'triangle', 0.12, 0.01);
      tone([3100, 2600], 0.5, 'sine', 0.08, 0.01);
      tone([90, 40], 0.3, 'sine', 0.4);
    },
    // sklerometr zarbasi
    hammer: () => { noise(0.05, 'bandpass', 2500, 0.7, 0, 2); tone([900, 300], 0.07, 'square', 0.1); },
    // suv quyish / shimdirish
    pour: () => { for (let i = 0; i < 10; i++) noise(0.12, 'bandpass', 600 + Math.random() * 900, 0.15, i * 0.08, 4); },
    // elak silkitish
    shake: () => { for (let i = 0; i < 8; i++) noise(0.07, 'highpass', 3000, 0.18, i * 0.11); },
    save: () => { tone(880, 0.08, 'sine', 0.18); tone(1320, 0.15, 'sine', 0.18, 0.08); },
  };

  // press / uzish mashinasining gidravlik motori (uzluksiz g'uvillash)
  function hum(start) {
    if (!start) {
      if (humNode) {
        const { g, nodes } = humNode, t = ctx.currentTime;
        g.gain.setTargetAtTime(0.0001, t, 0.08);
        nodes.forEach(n => n.stop(t + 0.4));
        humNode = null;
      }
      return;
    }
    if (!on || humNode) return;
    const c = ac(); if (!c) return;
    const g = c.createGain(), lp = c.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 420;
    g.gain.value = 0.0001;
    g.gain.setTargetAtTime(0.07, c.currentTime, 0.15);
    const o1 = c.createOscillator(), o2 = c.createOscillator();
    o1.type = 'sawtooth'; o1.frequency.value = 55;
    o2.type = 'square'; o2.frequency.value = 110.7;
    o1.connect(lp); o2.connect(lp); lp.connect(g).connect(master);
    o1.start(); o2.start();
    humNode = { g, nodes: [o1, o2] };
  }

  return {
    get on() { return on; },
    play(name) { if (on && lib[name]) try { lib[name](); } catch (e) { /* ovoz ixtiyoriy */ } },
    hum,
    toggle() {
      on = !on;
      localStorage.setItem('vl_sound', on ? 'on' : 'off');
      if (!on) hum(false); else lib.click();
      return on;
    },
  };
})();

/* Umumiy tovushlar: barcha tugmalar uchun bosish ovozi */
document.addEventListener('click', e => {
  const b = e.target.closest('button, .tabs button');
  if (b && !b.disabled && !b.classList.contains('step')) VL.sfx.play('click');
}, true);
