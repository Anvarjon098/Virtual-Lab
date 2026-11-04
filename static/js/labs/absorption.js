'use strict';
/* 6-ish. O'rtacha zichlik, suv shimuvchanlik va g'ovaklik (GOST 7025-91, GOST 12730.1/12730.3) */
(function () {
  const MATS = {
    ceramic: { name: "Keramik g'isht", dim: [250, 120, 65], rho0: 1.80, W: 10.5, rho: 2.62, color: '#c2410c', norm: [6, null], normTxt: 'GOST 530-2012: suv shimuvchanlik ≥ 6%' },
    silicate: { name: "Silikat g'isht", dim: [250, 120, 65], rho0: 1.86, W: 10, rho: 2.65, color: '#d6d3d1', norm: [6, null], normTxt: 'GOST 379-2015: suv shimuvchanlik ≥ 6%' },
    concrete: { name: "Og'ir beton (kub 100 mm)", dim: [100, 100, 100], rho0: 2.38, W: 4.2, rho: 2.65, color: '#9ca3af', norm: [null, 5.7], normTxt: 'W4 markali zich beton uchun Wm ≤ 5,7% (GOST 26633)' },
    aerated: { name: 'Gazobeton D500 (kub 100 mm)', dim: [100, 100, 100], rho0: 0.50, W: 38, rho: 2.5, color: '#f1f5f9', norm: [null, null], normTxt: "Zichlik markasi D500: ρ₀ = 451…550 kg/m³ (GOST 31359)" },
    stone: { name: "Chig'anoqtosh (kub 100 mm)", dim: [100, 100, 100], rho0: 1.55, W: 13, rho: 2.7, color: '#fde68a', norm: [null, null], normTxt: "Tabiiy tosh: ρ₀ va W bo'yicha guruhlanadi (GOST 4001)" },
  };
  const N = 3;

  VL.register({
    id: 'absorption', icon: '💧', cat: 'devor',
    title: "Materiallarning zichligi, suv shimuvchanligi va g'ovakligi",
    standard: 'GOST 7025-91, GOST 12730.1-2020, GOST 12730.3-2020',
    short: "Namunalarni o'lchash, quritish, tortish va suvga to'yintirish orqali o'rtacha zichlik, suv shimuvchanlik va g'ovaklikni aniqlash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Devorbop va konstruksion materiallarning o'rtacha zichligi ρ₀, massa va hajm bo'yicha suv shimuvchanligi (Wm, Wv) hamda
      g'ovakligini (P) aniqlash va ular orasidagi bog'liqlikni o'rganish.</p>
      <h3>Jihozlar</h3>
      <ul><li>Shtangensirkul (0,1 mm), metall chizg'ich;</li><li>Quritish shkafi (105 ± 5 °C);</li>
      <li>Texnik tarozi (0,1 g aniqlik);</li><li>Suvli vanna (20 ± 5 °C), nam latta.</li></ul>
      <h3>Ish tartibi</h3>
      <ol><li>Har bir namunaning uzunligi, eni va balandligi o'lchanadi, hajmi V hisoblanadi.</li>
      <li>Namunalar doimiy massagacha (105 ± 5 °C da) quritiladi va tortiladi — m₁.</li>
      <li>Namunalar suvga, suv sathi namunadan 2–10 sm baland bo'ladigan qilib, <b>48 soatga</b> solinadi.</li>
      <li>Suvdan olingan namunalar nam latta bilan artiladi va darhol tortiladi — m₂.</li></ol>
      <h3>Hisoblash formulalari</h3>
      <div class="formula">ρ₀ = m₁ / V · 1000, kg/m³</div>
      <div class="formula">Wm = (m₂ − m₁) / m₁ · 100% &nbsp;&nbsp;&nbsp; Wv = (m₂ − m₁) / V · 100%</div>
      <div class="formula">P = (1 − ρ₀ / ρ) · 100% &nbsp;&nbsp;&nbsp; P<sub>ochiq</sub> ≈ Wv &nbsp;&nbsp;&nbsp; P<sub>yopiq</sub> = P − P<sub>ochiq</sub></div>
      <p>bu yerda ρ — materialning haqiqiy zichligi (piknometr usulida aniqlanadi, bu ishda ma'lum deb olinadi).</p>
      <p>Suv shimuvchanlik materialning sovuqqa chidamliligi, issiqlik o'tkazuvchanligi va mustahkamligi bilan chambarchas bog'liq:
      ochiq g'ovaklik qancha katta bo'lsa, material shuncha ko'p suv shimadi.</p>`,
    quiz: [
      { q: 'Namunalar quritish shkafida qanday haroratda quritiladi?', o: ['60 °C', '105 ± 5 °C', '200 °C', '20 °C'], a: 1 },
      { q: 'Massa bo\'yicha suv shimuvchanlik qanday hisoblanadi?', o: ['(m₂ − m₁)/m₂', '(m₂ − m₁)/m₁ · 100%', 'm₁/V', 'm₂/m₁'], a: 1 },
      { q: "Qaysi materialning massa bo'yicha suv shimuvchanligi eng katta?", o: ["Og'ir beton", 'Granit', 'Gazobeton', "Po'lat"], a: 2 },
      { q: "To'yintirish uchun namunalar suvda qancha vaqt saqlanadi (GOST 7025)?", o: ['1 soat', '6 soat', '48 soat', '7 sutka'], a: 2 },
      { q: "O'rtacha zichlik 1800 kg/m³, haqiqiy zichlik 2600 kg/m³ bo'lsa, umumiy g'ovaklik qancha?", o: ['≈ 18%', '≈ 31%', '≈ 44%', '≈ 69%'], a: 1 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fM = VL.field.select(P, 'Material', Object.entries(MATS).map(([k, m]) => [k, m.name]), 'ceramic');
      const rStep = L.readout('Jarayon', ''), rVal = L.readout('Asbob', ''), rTemp = L.readout('Harorat', '°C'), rTime = L.readout('Vaqt', 'soat');
      const chart = new VL.Chart(L.chart, { xLabel: 'Namuna', yLabel: 'Massa, g', xMin: 0.4, xMax: N + 0.6, xTicks: [1, 2, 3].map(v => ({ v, label: v + '-namuna' })) });
      let st;

      const steps = new VL.Steps(P, [
        { label: "O'lchamlarini shtangensirkulda o'lchash", run: doMeasure },
        { label: 'Quritish shkafida quritish (105 °C)', run: doDry },
        { label: 'Quruq massani tortish (m₁)', run: done => doWeigh('m1', done) },
        { label: "Suvga to'yintirish (48 soat)", run: done => { VL.sfx.play('pour'); doSoak(done); } },
        { label: "Nam massani tortish (m₂)", run: done => doWeigh('m2', done) },
        { label: 'Natijalarni hisoblash', run: done => { st.calc = true; rStep.set('Hisoblandi'); renderResults(); done(); } },
      ], () => (bNew.disabled = false));
      const bNew = VL.field.button(P, '↻ Yangi sinov', fresh, 'primary');
      fM.addEventListener('change', fresh);

      function fresh() {
        const m = MATS[fM.value];
        st = {
          scene: 'table', cur: -1, temp: 20, hours: 0, water: 0, calc: false, cal: 0, bal: 0, onBal: -1,
          samples: Array.from({ length: N }, () => {
            const d = m.dim.map(x => x + VL.gauss(0, x * 0.006));
            const V = d[0] * d[1] * d[2] / 1000;   // sm³
            const rho0 = m.rho0 * (1 + VL.gauss(0, 0.015));
            const W = m.W * (1 + VL.gauss(0, 0.07));
            const m1 = rho0 * V, moist = VL.rand(1.5, 4) / 100;
            return { d, V, true1: m1, wet0: m1 * (1 + moist), true2: m1 * (1 + W / 100), shown: {} };
          }),
        };
        steps.reset(); fM.disabled = false; bNew.disabled = true;
        rStep.set('Tayyor'); rVal.set('—'); rTemp.set(20, 0); rTime.set(0, 0);
        renderResults();
      }

      function doMeasure(done) {
        fM.disabled = true; st.scene = 'caliper'; rStep.set("O'lchanmoqda");
        VL.sequence(st.samples, (s, i, next) => {
          st.cur = i;
          VL.sequence([0, 1, 2], (k, _, nx) => {
            st.calK = k;
            VL.tween(0.6, t => { st.cal = t; rVal.set(VL.fmt(s.d[k] * VL.ease(t), 1) + ' mm'); }, () => { s.shown['d' + k] = true; renderResults(); nx(); });
          }, next);
        }, () => { st.cur = -1; st.scene = 'table'; rStep.set("O'lchandi"); done(); });
      }

      function doDry(done) {
        st.scene = 'oven'; rStep.set('Quritilmoqda'); rVal.set('Quritish shkafi');
        VL.tween(4, t => {
          st.temp = 20 + 85 * Math.min(1, t * 4); st.hours = 24 * t;
          rTemp.set(st.temp, 0); rTime.set(st.hours, 1);
        }, () => {
          VL.tween(1, t => { st.temp = 105 - 85 * t; rTemp.set(st.temp, 0); }, () => { st.scene = 'table'; st.dried = true; rStep.set('Quritildi'); done(); });
        });
      }

      function doSoak(done) {
        st.scene = 'tank'; rStep.set("To'yintirilmoqda"); rVal.set('Suvli vanna'); rTemp.set(20, 0);
        VL.tween(4.5, t => { st.water = Math.min(1, t * 3); st.hours = 48 * t; rTime.set(st.hours, 1); }, () => { st.scene = 'table'; st.soaked = true; rStep.set("To'yintirildi"); done(); });
      }

      function doWeigh(key, done) {
        st.scene = 'balance'; rStep.set(key === 'm1' ? 'm₁ tortilmoqda' : 'm₂ tortilmoqda');
        VL.sequence(st.samples, (s, i, next) => {
          st.cur = i;
          const target = Math.round((key === 'm1' ? s.true1 : s.true2) * 10) / 10;
          VL.tween(1.0, t => { st.bal = target * VL.ease(t) + (t < 1 ? VL.rand(-1, 1) : 0); rVal.set(VL.fmt(st.bal, 1) + ' g'); }, () => {
            st.bal = target; s[key] = target; rVal.set(VL.fmt(target, 1) + ' g'); renderResults(); setTimeout(next, 300);
          });
        }, () => { st.cur = -1; st.bal = 0; st.scene = 'table'; done(); });
      }

      VL.loop(frame);
      fresh();

      function frame(dt, time) { draw(time); drawChart(); }

      function box(ctx, x, y, w, h, d, color, wet) {
        ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
        ctx.fillStyle = shade(color, 1.12); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + d, y - d * 0.6); ctx.lineTo(x + w + d, y - d * 0.6); ctx.lineTo(x + w, y); ctx.fill();
        ctx.fillStyle = shade(color, 0.8); ctx.beginPath(); ctx.moveTo(x + w, y); ctx.lineTo(x + w + d, y - d * 0.6); ctx.lineTo(x + w + d, y + h - d * 0.6); ctx.lineTo(x + w, y + h); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        if (wet) { ctx.fillStyle = 'rgba(30,64,175,.22)'; ctx.fillRect(x, y, w, h); }
      }
      function shade(hex, k) {
        const n = parseInt(hex.slice(1), 16);
        const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.min(255, Math.round(v * k)));
        return `rgb(${c.join(',')})`;
      }

      function sampleBox(i) {
        const m = MATS[fM.value], s = st.samples[i];
        const sc = m.dim[0] > 200 ? 0.42 : 0.7;
        return { w: s.d[0] * sc, h: s.d[2] * sc, d: s.d[1] * sc * 0.45 };
      }

      function draw(time) {
        const { ctx, w, h } = VL.fit(L.scene);
        VL.sceneBg(ctx, w, h);
        const m = MATS[fM.value], floorY = h - 30;
        const k = Math.min(1, w / 640, h / 380);
        ctx.save(); ctx.translate(w / 2, 0); ctx.scale(k, k); ctx.translate(-320, 0);
        const fy = floorY / k;
        ctx.fillStyle = '#d6d3d1'; ctx.fillRect(-1000, fy, 3000, 400);
        const wet = !!st.soaked;
        if (st.scene === 'table' || st.scene === 'caliper') {
          VL.metal(ctx, 40, fy - 14, 560, 14, true);
          st.samples.forEach((s, i) => {
            const b = sampleBox(i), x = 70 + i * 185;
            box(ctx, x, fy - 14 - b.h, b.w, b.h, b.d, m.color, wet && !st.calc ? true : wet);
            ctx.fillStyle = '#334155'; ctx.font = '13px system-ui'; ctx.textAlign = 'center';
            ctx.fillText(`${i + 1}`, x + b.w / 2, fy - 20 - b.h - b.d * 0.6 - 6);
            if (st.scene === 'caliper' && st.cur === i) drawCaliper(ctx, x, fy - 14 - b.h, b, st.calK, st.cal);
          });
        } else if (st.scene === 'oven') {
          VL.metal(ctx, 140, fy - 300, 360, 300, true, true);
          ctx.fillStyle = '#111827'; ctx.fillRect(165, fy - 270, 250, 240);
          ctx.fillStyle = `rgba(239,68,68,${0.15 + 0.35 * (st.temp - 20) / 85})`; ctx.fillRect(165, fy - 270, 250, 240);
          for (let r = 0; r < 2; r++) {
            ctx.fillStyle = '#9ca3af'; ctx.fillRect(170, fy - 160 + r * 105, 240, 4);
          }
          st.samples.forEach((s, i) => {
            const b = sampleBox(i), sc = 0.55;
            box(ctx, 178 + (i % 2) * 118, fy - 162 - b.h * sc + (i === 2 ? 105 : 0), b.w * sc, b.h * sc, b.d * sc, m.color);
          });
          ctx.fillStyle = '#0f172a'; ctx.fillRect(428, fy - 270, 60, 30);
          ctx.fillStyle = '#f87171'; ctx.font = 'bold 15px monospace'; ctx.textAlign = 'center'; ctx.fillText(VL.fmt(st.temp, 0) + '°', 458, fy - 249);
          ctx.fillStyle = '#e2e8f0'; ctx.font = '11px system-ui'; ctx.fillText('SNOL 58/350', 458, fy - 220);
          for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = `rgba(248,113,113,${0.5 * (st.temp - 20) / 85})`; ctx.lineWidth = 2;
            ctx.beginPath(); const xx = 200 + i * 55;
            for (let y = 0; y < 60; y += 4) ctx.lineTo(xx + Math.sin(y / 6 + time * 4 + i) * 5, fy - 40 - y);
            ctx.stroke();
          }
        } else if (st.scene === 'tank') {
          const tx = 90, tw = 460, th = 200, ty = fy - th;
          st.samples.forEach((s, i) => { const b = sampleBox(i), sc = 0.75; box(ctx, tx + 30 + i * 145, fy - 6 - b.h * sc, b.w * sc, b.h * sc, b.d * sc, m.color); });
          const wl = ty + th - (th - 20) * st.water;
          ctx.fillStyle = 'rgba(56,189,248,.35)'; ctx.fillRect(tx, wl, tw, fy - wl);
          ctx.strokeStyle = 'rgba(14,116,144,.6)'; ctx.beginPath(); ctx.moveTo(tx, wl); ctx.lineTo(tx + tw, wl); ctx.stroke();
          if (st.water > 0.5) for (let i = 0; i < 14; i++) {
            const bx = tx + 40 + (i * 37) % (tw - 60), by = fy - 10 - ((time * 40 + i * 47) % (fy - wl - 10));
            ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(bx, by, 2 + (i % 3), 0, 7); ctx.stroke();
          }
          ctx.strokeStyle = '#475569'; ctx.lineWidth = 4; ctx.strokeRect(tx, ty, tw, th);
          ctx.fillStyle = '#334155'; ctx.font = '13px system-ui'; ctx.textAlign = 'left';
          ctx.fillText('Suv sathi namunadan 2–10 sm yuqori, t = 20 ± 5 °C', tx, ty - 10);
        } else if (st.scene === 'balance') {
          const bx = 320;
          VL.metal(ctx, bx - 120, fy - 60, 240, 60, true, true);
          ctx.fillStyle = '#0f172a'; VL.rrect(ctx, bx - 80, fy - 46, 160, 32, 5); ctx.fill();
          ctx.fillStyle = '#4ade80'; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center';
          ctx.fillText(VL.fmt(st.bal, 1) + ' g', bx, fy - 22);
          VL.metal(ctx, bx - 100, fy - 72, 200, 12, true);
          if (st.cur >= 0) { const b = sampleBox(st.cur); box(ctx, bx - b.w / 2, fy - 72 - b.h, b.w, b.h, b.d, m.color, wet); }
          ctx.fillStyle = '#334155'; ctx.font = '13px system-ui';
          ctx.fillText(st.cur >= 0 ? `${st.cur + 1}-namuna${wet ? ' (nam latta bilan artilgan)' : ' (quritilgan)'}` : '', bx, fy - 72 - 150);
        }
        ctx.restore();
      }

      function drawCaliper(ctx, x, y, b, k, t) {
        // k: 0 — uzunlik, 1 — en, 2 — balandlik
        ctx.save();
        ctx.strokeStyle = '#1e3a8a'; ctx.fillStyle = 'rgba(148,163,184,.95)'; ctx.lineWidth = 2;
        if (k === 2) {
          const bx = x - 30, open = b.h * VL.ease(t);
          ctx.fillRect(bx - 6, y + b.h - 200, 10, 210);
          ctx.fillRect(bx - 6, y + b.h, 34, 6);
          ctx.fillRect(bx - 6, y + b.h - open - 6, 34, 6);
        } else {
          const len = k === 0 ? b.w : b.d * 2.2, yy = y - b.d * 0.6 - 26;
          ctx.fillRect(x - 10, yy, len + 80, 10);
          ctx.fillRect(x - 10, yy, 6, 34);
          ctx.fillRect(x - 10 + 6 + len * VL.ease(t), yy, 6, 34);
        }
        ctx.restore();
      }

      function calcRow(s) {
        const rho0 = s.m1 / s.V * 1000, Wm = (s.m2 - s.m1) / s.m1 * 100, Wv = (s.m2 - s.m1) / s.V * 100;
        const Ptot = (1 - rho0 / 1000 / MATS[fM.value].rho) * 100;
        return { rho0, Wm, Wv, Ptot, Pcl: Ptot - Wv };
      }

      function drawChart() {
        chart.reset();
        const m1 = st.samples.map((s, i) => [i + 1, s.m1]).filter(p => p[1] != null);
        const m2 = st.samples.map((s, i) => [i + 1, s.m2]).filter(p => p[1] != null);
        const mx = Math.max(...st.samples.map(s => s.true2));
        chart.o.yMax = Math.ceil(mx * 1.2 / 100) * 100;
        const bar = (x, v, c, off) => chart.zones.push({ poly: [[x + off - 0.16, 0], [x + off + 0.16, 0], [x + off + 0.16, v], [x + off - 0.16, v]], fill: c });
        m1.forEach(([x, v]) => bar(x, v, 'rgba(194,65,12,.75)', -0.18));
        m2.forEach(([x, v]) => bar(x, v, 'rgba(37,99,235,.75)', 0.18));
        if (m1.length) chart.marks.push({ x: 0.5, y: chart.o.yMax * 0.95, color: 'rgba(194,65,12,.9)', label: 'm₁ — quruq' });
        if (m2.length) chart.marks.push({ x: 2.1, y: chart.o.yMax * 0.95, color: 'rgba(37,99,235,.9)', label: "m₂ — suvga to'yingan" });
        chart.draw();
      }

      function renderResults() {
        const m = MATS[fM.value];
        const rows = st.samples.map((s, i) => {
          const c = st.calc ? calcRow(s) : null;
          return [i + 1, ...[0, 1, 2].map(k => (s.shown['d' + k] ? VL.fmt(s.d[k], 1) : '…')),
            s.shown.d2 ? VL.fmt(s.V, 1) : '', s.m1 != null ? VL.fmt(s.m1, 1) : '', s.m2 != null ? VL.fmt(s.m2, 1) : '',
            c ? `<b>${VL.fmt(c.rho0, 0)}</b>` : '', c ? `<b>${VL.fmt(c.Wm, 2)}</b>` : '', c ? VL.fmt(c.Wv, 2) : '', c ? VL.fmt(c.Ptot, 1) : ''];
        });
        let html = `<h3>Sinov natijalari — ${m.name}</h3>` + VL.table(['№', 'l, mm', 'b, mm', 'h, mm', 'V, sm³', 'm₁, g', 'm₂, g', 'ρ₀, kg/m³', 'Wm, %', 'Wv, %', 'P, %'], rows);
        let summary = '';
        if (st.calc) {
          const cs = st.samples.map(calcRow), avg = key => VL.mean(cs.map(c => c[key]));
          const rho0 = avg('rho0'), Wm = avg('Wm'), Wv = avg('Wv'), P = avg('Ptot'), Pcl = avg('Pcl');
          const [wmin, wmax] = m.norm;
          let ok = true, normRes = m.normTxt;
          if (wmin != null) ok = Wm >= wmin;
          if (wmax != null) ok = Wm <= wmax;
          if (fM.value === 'aerated') ok = rho0 > 450 && rho0 <= 550;
          const s0 = st.samples[0];
          summary = `ρ₀ = ${VL.fmt(rho0, 0)} kg/m³, Wm = ${VL.fmt(Wm, 1)}%, P = ${VL.fmt(P, 1)}%`;
          html += `<div class="calc">
            <p>1-namuna uchun: V = ${VL.fmt(s0.d[0], 1)}·${VL.fmt(s0.d[1], 1)}·${VL.fmt(s0.d[2], 1)} / 1000 = ${VL.fmt(s0.V, 1)} sm³;
            ρ₀ = ${VL.fmt(s0.m1, 1)} / ${VL.fmt(s0.V, 1)} · 1000 = ${VL.fmt(cs[0].rho0, 0)} kg/m³;
            Wm = (${VL.fmt(s0.m2, 1)} − ${VL.fmt(s0.m1, 1)}) / ${VL.fmt(s0.m1, 1)} · 100 = ${VL.fmt(cs[0].Wm, 2)}%</p>
            <p>O'rtacha qiymatlar: <b>ρ₀ = ${VL.fmt(rho0, 0)} kg/m³</b>, <b>Wm = ${VL.fmt(Wm, 2)}%</b>, Wv = ${VL.fmt(Wv, 2)}%</p>
            <p>Haqiqiy zichlik ρ = ${VL.fmt(m.rho * 1000, 0)} kg/m³ bo'yicha: umumiy g'ovaklik P = ${VL.fmt(P, 1)}%,
            ochiq g'ovaklik ≈ ${VL.fmt(Wv, 1)}%, yopiq g'ovaklik ≈ ${VL.fmt(Math.max(0, Pcl), 1)}%</p></div>
            <div class="verdict ${ok ? 'ok' : 'bad'}"><b>Xulosa:</b> ${m.name}: o'rtacha zichlik ${VL.fmt(rho0, 0)} kg/m³, massa bo'yicha suv shimuvchanlik ${VL.fmt(Wm, 1)}%.
            Me'yor: ${normRes} — <b>${ok ? 'talabga mos' : 'talabga mos emas'}</b>.
            Ochiq g'ovaklik ulushi ${VL.fmt(Wv / P * 100, 0)}% ni tashkil etadi; ${Wv / P > 0.6 ? "bu sovuqqa chidamlilikni pasaytirishi mumkin." : "yopiq g'ovaklar ko'pligi sovuqqa chidamlilik uchun qulay."}</div>`;
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
