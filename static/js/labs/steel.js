'use strict';
/* 4-ish. Armatura po'latini cho'zilishga sinash (GOST 12004-81, GOST 34028-2016) */
(function () {
  const E = 200000;   // MPa
  const CLS = {
    A240: { sy: 280, su: 420, esh: 0.025, eu: 0.17, ef: 0.29, plateau: true, norm: [240, 380, 25], prof: 'silliq' },
    A400: { sy: 450, su: 650, esh: 0.018, eu: 0.11, ef: 0.20, plateau: true, norm: [400, 590, 16], prof: 'davriy' },
    A500C: { sy: 560, su: 665, eu: 0.085, ef: 0.17, plateau: false, norm: [500, 600, 14], prof: 'davriy' },
    A600: { sy: 680, su: 820, eu: 0.07, ef: 0.135, plateau: false, norm: [600, 740, 12], prof: 'davriy' },
  };
  const N = 2;

  /** σ–ε egri chizig'ini yaratadi va yoy uzunligi bo'yicha bir tekis nuqtalarga ajratadi */
  function makeCurve(p) {
    const raw = [];
    if (p.plateau) {
      const up = p.sy * 1.035, ey = up / E;
      for (let i = 0; i <= 200; i++) raw.push([ey * i / 200, up * i / 200]);
      for (let i = 1; i <= 300; i++) {
        const t = i / 300, e = ey + (p.esh - ey) * t;
        const s = i < 15 ? VL.lerp(up, p.sy, i / 15) : p.sy * (1 + 0.006 * Math.sin(i * 0.9) + VL.gauss(0, 0.0025));
        raw.push([e, s]);
      }
      for (let i = 1; i <= 400; i++) {
        const e = p.esh + (p.eu - p.esh) * i / 400;
        raw.push([e, p.su + (p.sy - p.su) * Math.pow((p.eu - e) / (p.eu - p.esh), 3)]);
      }
    } else {
      // Ramberg–Osgood: ε = σ/E + 0,002·(σ/σ0,2)^n, egri (εu, σu) nuqtadan o'tadi
      const n = Math.log((p.eu - p.su / E) / 0.002) / Math.log(p.su / p.sy);
      for (let i = 0; i <= 1500; i++) {
        const s = p.su * i / 1500;
        raw.push([s / E + 0.002 * Math.pow(s / p.sy, n), s]);
      }
    }
    for (let i = 1; i <= 300; i++) {
      const t = i / 300;
      raw.push([p.eu + (p.ef - p.eu) * t, p.su * (1 - 0.2 * Math.pow(t, 2.2))]);
    }
    const out = [raw[0]];
    const sx = 1 / p.ef, sy = 1 / p.su;
    let acc = 0;
    for (let i = 1; i < raw.length; i++) {
      acc += Math.hypot((raw[i][0] - raw[i - 1][0]) * sx, (raw[i][1] - raw[i - 1][1]) * sy);
      if (acc >= 0.006) { out.push(raw[i]); acc = 0; }
    }
    out.push(raw.at(-1));
    return out;
  }

  VL.register({
    id: 'steel', icon: '🔩', cat: 'metal',
    title: "Armatura po'latini cho'zilishga sinash",
    standard: 'GOST 12004-81, GOST 34028-2016, GOST 5781-82 · ASTM A370',
    short: "Armatura sterjenini universal sinov mashinasida uzib, oquvchanlik chegarasi, vaqtinchalik qarshilik va nisbiy uzayishni aniqlash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Armatura po'latining mexanik xossalarini — oquvchanlik chegarasi σт (yoki shartli σ₀,₂), vaqtinchalik qarshilik σв
      va uzilgandan keyingi nisbiy uzayish δ₅ ni aniqlab, po'lat sinfiga muvofiqligini tekshirish.</p>
      <h3>Jihozlar</h3>
      <ul><li>Universal sinov mashinasi (UIM-500, 500 kN) — gidravlik qisqichlar bilan;</li>
      <li>Ekstensometr, shtangensirkul, belgilovchi asbob (kernlar).</li></ul>
      <h3>Ish tartibi</h3>
      <ol><li>Namunada hisobiy uzunlik <b>l₀ = 5d</b> belgilanadi.</li>
      <li>Namuna mashina qisqichlariga o'qdosh qilib mahkamlanadi.</li>
      <li>Namuna uzilguncha bir tekis tezlikda cho'ziladi, «kuch–uzayish» diagrammasi yozib olinadi.</li>
      <li>Uzilgan qismlar bir-biriga jips qo'yilib, hisobiy uzunlik l<sub>k</sub> o'lchanadi.</li></ol>
      <h3>Hisoblash formulalari</h3>
      <div class="formula">A₀ = π·d² / 4 &nbsp;&nbsp; σт = Fт / A₀ &nbsp;&nbsp; σв = F<sub>max</sub> / A₀ &nbsp;&nbsp; δ₅ = (l<sub>k</sub> − l₀) / l₀ · 100%</div>
      <p>Aniq oquvchanlik maydonchasi bo'lmagan po'latlar (A500C, A600) uchun <b>shartli oquvchanlik chegarasi σ₀,₂</b> aniqlanadi —
      bu qoldiq deformatsiya 0,2% ga yetgandagi kuchlanish. Grafikda u elastik qismga parallel, 0,2% dan o'tkazilgan chiziq yordamida topiladi.</p>
      <h3>Me'yoriy talablar</h3>
      ${VL.table(['Sinf', 'σт (σ₀,₂), MPa ≥', 'σв, MPa ≥', 'δ₅, % ≥', 'Profil'],
        Object.entries(CLS).map(([k, c]) => [k, c.norm[0], c.norm[1], c.norm[2], c.prof]))}`,
    quiz: [
      { q: "Qisqa namunaning hisobiy uzunligi qanday olinadi?", o: ['l₀ = 2d', 'l₀ = 5d', 'l₀ = 10d', 'l₀ = 100 mm'], a: 1 },
      { q: 'Shartli oquvchanlik chegarasi σ₀,₂ nima?', o: ['Uzilish kuchlanishi', "Qoldiq deformatsiya 0,2% bo'lgandagi kuchlanish", 'Elastiklik chegarasi', "Maksimal kuchning 20%i"], a: 1 },
      { q: "Diagrammaning qaysi qismida «bo'yin» (sheyka) hosil bo'ladi?", o: ['Elastik qismida', "Oquvchanlik maydonchasida", 'Maksimal kuchdan keyin', 'Sinov boshida'], a: 2 },
      { q: 'A400 sinfli armatura uchun minimal oquvchanlik chegarasi qancha?', o: ['240 MPa', '400 MPa', '500 MPa', '590 MPa'], a: 1 },
      { q: "Po'latning elastiklik moduli taxminan qancha?", o: ['20 GPa', '70 GPa', '200 GPa', '2000 GPa'], a: 2 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fCls = VL.field.select(P, "Armatura sinfi", Object.keys(CLS).map(k => [k, k + ' (' + CLS[k].prof + ' profil)']), 'A400');
      const fD = VL.field.select(P, 'Diametri d, mm', [10, 12, 16, 20, 25].map(d => [d, 'Ø' + d]), 16);
      const fQ = VL.field.select(P, "Partiya sifati", [['ok', 'Standart (zavod sertifikati bor)'], ['bad', "Shubhali (sertifikatsiz)"]], 'ok');
      const fSpeed = VL.field.select(P, 'Simulyatsiya tezligi', [['0.5', 'Sekin'], ['1', 'Oddiy'], ['2.5', 'Tez']], 1);
      const box = VL.h('div', { class: 'row' }); P.append(box);
      const bPrep = VL.field.button(box, 'Namunalarni tayyorlash', prepare, 'primary');
      const bTest = VL.field.button(box, 'Cho\'zishni boshlash', start, 'accent');
      VL.field.button(box, 'Qayta boshlash', reset);
      bTest.disabled = true;

      const rN = L.readout('Namuna', ''), rF = L.readout('Kuch F', 'kN'), rS = L.readout('Kuchlanish σ', 'MPa'),
        rE = L.readout('Uzayish ε', '%'), rDL = L.readout('Δl', 'mm');
      const chart = new VL.Chart(L.chart, { xLabel: 'Nisbiy uzayish ε, %', yLabel: 'Kuchlanish σ, MPa' });
      const sparks = new VL.Particles();
      let st;

      function reset() {
        st = { phase: 'idle', samples: [], i: 0, k: 0, pt: [0, 0], results: [], series: null, gapT: 0, neckX: 0.5 };
        chart.reset(); sparks.clear(); VL.lock(P, false); bPrep.disabled = false; bTest.disabled = true; bTest.textContent = "Cho'zishni boshlash";
        rN.set('—'); rF.set(0); rS.set(0); rE.set(0, 2); rDL.set(0, 2); L.note(''); renderResults();
      }

      function prepare() {
        const c = CLS[fCls.value], d = +fD.value, bad = fQ.value === 'bad';
        st.samples = Array.from({ length: N }, () => {
          const kq = bad ? VL.rand(0.8, 0.9) : 1;
          const p = {
            plateau: c.plateau, esh: c.esh,
            sy: c.sy * kq * (1 + VL.gauss(0, 0.025)), su: c.su * kq * (1 + VL.gauss(0, 0.02)),
            eu: c.eu * (1 + VL.gauss(0, 0.05)), ef: c.ef * (bad ? 0.72 : 1) * (1 + VL.gauss(0, 0.05)),
          };
          if (p.su < p.sy * 1.08) p.su = p.sy * 1.08;
          p.curve = makeCurve(p);
          return { d, A0: Math.PI * d * d / 4, l0: 5 * d, p, neck: VL.rand(0.38, 0.62) };
        });
        const maxE = Math.max(...st.samples.map(s => s.p.ef)), maxS = Math.max(...st.samples.map(s => s.p.su));
        chart.o.xMax = Math.ceil(maxE * 110 / 5) * 5; chart.o.yMax = Math.ceil(maxS * 1.15 / 100) * 100;
        st.i = 0; st.phase = 'ready'; VL.lock(P, true); fSpeed.disabled = false;
        bPrep.disabled = true; bTest.disabled = false; rN.set(`1 / ${N}`);
        L.note(`✔ ${N} ta namuna kesildi: Ø${d} mm, l₀ = 5d = ${5 * d} mm. Hisobiy uzunlik kern bilan belgilandi.`, 'ok');
      }

      function start() {
        if (st.phase !== 'ready') return;
        VL.sfx.hum(true); st.phase = 'pull'; st.k = 0; st.gapT = 0; sparks.clear();
        st.series = chart.add({ color: VL.COLORS[st.i], label: `${st.i + 1}-namuna` });
        bTest.disabled = true; rN.set(`${st.i + 1} / ${N}`);
      }

      VL.loop(frame);
      reset();

      function frame(dt) {
        const s = st.samples[st.i];
        if (st.phase === 'pull') {
          const c = s.p.curve;
          st.k = Math.min(c.length - 1, st.k + dt * +fSpeed.value * c.length / 16);
          const j = Math.floor(st.k);
          st.pt = c[j];
          st.series.data = c.slice(0, j + 1).map(([e, sg]) => [e * 100, sg]);
          if (j >= c.length - 1) {
            st.phase = 'broken'; VL.sfx.hum(false); VL.sfx.play('snap');
            const r = L.scene.getBoundingClientRect();
            sparks.spawn(r.width / 2, st.breakY || r.height / 2, 30, '#f59e0b', 90);
          }
        } else if (st.phase === 'broken') {
          st.gapT = Math.min(1, st.gapT + dt * 2);
          if (st.gapT >= 1) finish();
        }
        if (s && st.phase !== 'idle' && st.phase !== 'ready') {
          const [e, sg] = st.pt;
          const shown = st.phase === 'pull' ? sg : 0;
          rF.set(shown * s.A0 / 1000, 1); rS.set(shown, 0); rE.set(e * 100, 2); rDL.set(e * s.l0, 2);
        }
        draw(dt);
        chart.draw();
      }

      function finish() {
        const s = st.samples[st.i], p = s.p, c = p.curve;
        // σт yoki σ0,2
        let sy;
        if (p.plateau) {
          const plat = c.filter(([e]) => e > p.sy * 1.05 / E && e < p.esh);
          sy = Math.min(...plat.map(q => q[1]));
        } else {
          sy = (c.find(([e, sg]) => e - sg / E >= 0.002) || c[0])[1];
          chart.lines.push({ x0: 0.2, y0: 0, x1: 0.2 + sy / E * 100, y1: sy, color: VL.COLORS[st.i], label: 'σ₀,₂' });
        }
        const su = Math.max(...c.map(q => q[1]));
        const last = c.at(-1), delta = (last[0] - last[1] / E) * 100;
        const eu = c.find(q => q[1] === su)[0];
        Object.assign(s, { sy, su, delta, Fy: sy * s.A0 / 1000, Fu: su * s.A0 / 1000, lk: s.l0 * (1 + delta / 100) });
        chart.marks.push({ x: eu * 100, y: su, color: VL.COLORS[st.i], label: 'σв = ' + VL.fmt(su, 0) });
        if (p.plateau) chart.marks.push({ x: p.esh * 50, y: sy, color: VL.COLORS[st.i], label: 'σт = ' + VL.fmt(sy, 0), align: 'left' });
        st.results.push(s);
        st.i++;
        if (st.i < N) { st.phase = 'ready'; bTest.disabled = false; bTest.textContent = `${st.i + 1}-namunani cho'zish`; }
        else st.phase = 'done';
        renderResults();
      }

      function draw(dt) {
        const { ctx, w, h } = VL.fit(L.scene);
        VL.sceneBg(ctx, w, h);
        const cx = w / 2, floorY = h - 14, top = 14;
        const frameW = Math.min(w * 0.7, 300), Lc = cx - frameW / 2, Rc = cx + frameW / 2;
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, floorY, w, h - floorY);
        // ustunlar va traversalar
        VL.metal(ctx, Lc, top + 20, 18, floorY - top - 60);
        VL.metal(ctx, Rc - 18, top + 20, 18, floorY - top - 60);
        VL.metal(ctx, Lc - 14, top, frameW + 28, 40, true, true);
        VL.metal(ctx, Lc - 24, floorY - 50, frameW + 48, 50, true, true);
        ctx.fillStyle = '#e2e8f0'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
        ctx.fillText('UIM-500 · universal sinov mashinasi', cx, floorY - 20);

        const s = st.samples[Math.min(st.i, N - 1)] || null;
        const active = s && st.phase !== 'idle';
        const cur = st.phase === 'pull' || st.phase === 'broken' ? st.samples[st.i] : (st.phase === 'ready' || st.phase === 'idle') ? null : st.samples[N - 1];
        const showS = cur || (st.phase === 'ready' ? st.samples[st.i] : null);
        const e = cur ? st.pt[0] : 0;
        const gripH = 46, y0 = top + 40 + gripH;
        const L0px = (floorY - 50 - 20 - gripH - 26 - y0) / (1 + 0.35 * 1.5);
        const Lpx = L0px * (1 + e * 1.5);
        const bw = Math.max(8, (showS ? showS.d : 16) * 0.9);
        // pastki harakatlanuvchi traversa
        const ly = y0 + Lpx;
        VL.metal(ctx, Lc + 18, ly + gripH, frameW - 36, 26, true);
        // vint (plunjer)
        VL.metal(ctx, cx - 10, ly + gripH + 26, 20, Math.max(2, floorY - 50 - ly - gripH - 26));
        // namuna
        if (showS) {
          const neckT = cur ? VL.clamp((e - cur.p.eu) / (cur.p.ef - cur.p.eu), 0, 1) : 0;
          const neckY = y0 + Lpx * (cur ? cur.neck : 0.5);
          st.breakY = neckY;
          const gap = st.phase === 'broken' ? st.gapT * 14 : 0;
          const prof = CLS[fCls.value].prof === 'davriy';
          const drawBar = (ya, yb, shift) => {
            ctx.save();
            ctx.beginPath();
            const steps = 40;
            const half = y => {
              const z = (y - neckY) / (bw * 1.6);
              return bw / 2 * (1 - 0.48 * neckT * Math.exp(-z * z));
            };
            for (let i = 0; i <= steps; i++) { const y = ya + (yb - ya) * i / steps; ctx.lineTo(cx - half(y), y + shift); }
            for (let i = steps; i >= 0; i--) { const y = ya + (yb - ya) * i / steps; ctx.lineTo(cx + half(y), y + shift); }
            ctx.closePath();
            const g = ctx.createLinearGradient(cx - bw / 2, 0, cx + bw / 2, 0);
            g.addColorStop(0, '#374151'); g.addColorStop(0.4, '#9ca3af'); g.addColorStop(1, '#1f2937');
            ctx.fillStyle = g; ctx.fill();
            ctx.clip();
            if (prof) {
              ctx.strokeStyle = 'rgba(17,24,39,.55)'; ctx.lineWidth = 1.2;
              const pitch = Math.max(5, bw * 0.7) * (1 + e * 1.5);
              for (let y = ya - gripH; y < yb + gripH; y += pitch) { ctx.beginPath(); ctx.moveTo(cx - bw, y + shift - bw * 0.3); ctx.lineTo(cx + bw, y + shift + bw * 0.3); ctx.stroke(); }
            }
            ctx.restore();
          };
          if (st.phase === 'broken' || (st.phase !== 'pull' && cur)) {
            drawBar(y0 - gripH + 4, neckY, 0);
            drawBar(neckY, ly + gripH - 4, gap);
          } else drawBar(y0 - gripH + 4, ly + gripH - 4, 0);
          // hisobiy uzunlik belgilari
          const m1 = y0 + Lpx * 0.5 - Lpx * 0.36, m2 = y0 + Lpx * 0.5 + Lpx * 0.36;
          ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
          for (const m of [m1, m2]) { ctx.beginPath(); ctx.moveTo(cx - bw / 2 - 5, m + (m > neckY ? gap : 0)); ctx.lineTo(cx + bw / 2 + 5, m + (m > neckY ? gap : 0)); ctx.stroke(); }
          ctx.fillStyle = '#92400e'; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
          ctx.fillText(`l = ${VL.fmt(showS.l0 * (1 + e), 1)} mm`, cx + bw / 2 + 12, (m1 + m2) / 2);
          // ekstensometr
          if (st.phase === 'pull' && e < (cur ? cur.p.eu * 0.8 : 1)) {
            ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(cx - bw / 2 - 16, m1); ctx.lineTo(cx - bw / 2 - 16, m2); ctx.stroke();
            ctx.fillStyle = '#2563eb'; ctx.fillRect(cx - bw / 2 - 24, (m1 + m2) / 2 - 10, 10, 20);
          }
        }
        // qisqichlar
        const grip = (y, hgt) => { VL.metal(ctx, cx - 30, y, 60, hgt, false, true); ctx.fillStyle = '#334155'; ctx.fillRect(cx - bw / 2 - 2, y + 4, bw + 4, hgt - 8); };
        grip(top + 40, gripH - 2);
        const gapNow = st.phase === 'broken' ? st.gapT * 14 : 0;
        grip(ly + 2 + gapNow, gripH - 2);
        if (!active) {
          ctx.fillStyle = '#475569'; ctx.font = '13px system-ui'; ctx.textAlign = 'center';
          ctx.fillText("«Namunalarni tayyorlash» tugmasini bosing", cx, y0 + L0px / 2);
        }
        sparks.update(dt, floorY - 50); sparks.draw(ctx);
      }

      function renderResults() {
        const c = CLS[fCls.value], nm = c.norm;
        const lbl = c.plateau ? 'σт' : 'σ₀,₂';
        const rows = st.results.map((s, i) => [i + 1, s.d, VL.fmt(s.A0, 1), s.l0, VL.fmt(s.lk, 1), VL.fmt(s.Fy, 1), VL.fmt(s.Fu, 1),
          `<b>${VL.fmt(s.sy, 0)}</b>`, `<b>${VL.fmt(s.su, 0)}</b>`, `<b>${VL.fmt(s.delta, 1)}</b>`, VL.fmt(s.su / s.sy, 2)]);
        let html = '<h3>Sinov natijalari</h3>' + VL.table(['№', 'd, mm', 'A₀, mm²', 'l₀, mm', 'l<sub>k</sub>, mm', `F${c.plateau ? 'т' : '₀,₂'}, kN`, 'F<sub>max</sub>, kN', `${lbl}, MPa`, 'σв, MPa', 'δ₅, %', 'σв/' + lbl],
          rows.length ? rows : [['—', '', '', '', '', '', '', '', '', '', '']],
          [['', '', '', '', '', '', `<i>GOST talabi (${fCls.value})</i>`, `≥ ${nm[0]}`, `≥ ${nm[1]}`, `≥ ${nm[2]}`, '']]);
        let summary = '';
        if (st.results.length === N) {
          const minSy = Math.min(...st.results.map(s => s.sy)), minSu = Math.min(...st.results.map(s => s.su)), minD = Math.min(...st.results.map(s => s.delta));
          const checks = [[`${lbl} = ${VL.fmt(minSy, 0)} MPa ≥ ${nm[0]}`, minSy >= nm[0]], [`σв = ${VL.fmt(minSu, 0)} MPa ≥ ${nm[1]}`, minSu >= nm[1]], [`δ₅ = ${VL.fmt(minD, 1)}% ≥ ${nm[2]}`, minD >= nm[2]]];
          const ok = checks.every(x => x[1]);
          summary = `${fCls.value} Ø${st.results[0].d}: ${lbl}=${VL.fmt(minSy, 0)}, σв=${VL.fmt(minSu, 0)} MPa, δ₅=${VL.fmt(minD, 1)}% — ${ok ? 'mos' : 'mos emas'}`;
          html += `<div class="calc"><p>Hisoblash (1-namuna): A₀ = π·${st.results[0].d}²/4 = ${VL.fmt(st.results[0].A0, 1)} mm²;
            ${lbl} = ${VL.fmt(st.results[0].Fy * 1000, 0)} / ${VL.fmt(st.results[0].A0, 1)} = ${VL.fmt(st.results[0].sy, 0)} MPa;
            δ₅ = (${VL.fmt(st.results[0].lk, 1)} − ${st.results[0].l0}) / ${st.results[0].l0} · 100 = ${VL.fmt(st.results[0].delta, 1)}%</p>
            <ul class="checks">${checks.map(([t, g]) => `<li class="${g ? 'ok' : 'bad'}">${g ? '✔' : '✘'} ${t}</li>`).join('')}</ul></div>
            <div class="verdict ${ok ? 'ok' : 'bad'}"><b>Xulosa:</b> Sinalgan armatura partiyasi mexanik xossalari bo'yicha ${fCls.value} sinfi talablariga
            <b>${ok ? 'mos keladi' : 'mos kelmaydi'}</b>. ${ok ? 'Partiya qurilishda ishlatishga yaroqli.' : "Partiya ishlatishga ruxsat etilmaydi; takroriy sinov (ikki barobar ko'p namunada) o'tkazilishi kerak."}</div>`;
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
