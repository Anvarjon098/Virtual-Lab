'use strict';
/* Lyoss gruntlarining cho'kuvchanligi — ikki egri chiziq usuli (GOST 23161-2012, GOST 25100-2020) */
(function () {
  const SOILS = {
    tashkent: { name: "Lyossimon suglinok (Toshkent tipidagi)", c1: 0.022, sl: 0.05, p0: 0.12, rho: 1.52, w: 9 },
    samarkand: { name: 'Lyoss supes (Samarqand tipidagi)', c1: 0.018, sl: 0.032, p0: 0.16, rho: 1.58, w: 7 },
    mirzachul: { name: "Yuqori g'ovakli lyoss (Mirzacho'l tipidagi)", c1: 0.03, sl: 0.1, p0: 0.08, rho: 1.38, w: 5 },
    improved: { name: 'Zichlangan lyoss (texnik melioratsiyadan keyin)', c1: 0.012, sl: 0.006, p0: 0.3, rho: 1.75, w: 14 },
  };
  const PRESS = [0.025, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3];   // MPa
  const H0 = 25;                                           // namuna balandligi, mm

  function cls(e) {
    if (e < 0.01) return ["cho'kmaydigan", 'ok'];
    if (e < 0.03) return ["kuchsiz cho'kuvchan", 'bad'];
    if (e < 0.07) return ["o'rtacha cho'kuvchan", 'bad'];
    if (e < 0.12) return ["kuchli cho'kuvchan", 'bad'];
    return ["o'ta kuchli cho'kuvchan", 'bad'];
  }

  VL.register({
    id: 'loess', icon: '🏜️', cat: 'grunt',
    title: "Lyoss gruntlarining cho'kuvchanligi",
    standard: 'GOST 23161-2012, GOST 25100-2020, KMK 2.02.01-98',
    short: "Kompression asbobda (odometr) lyoss namunalarini tabiiy va suvga to'yingan holatda sinab, nisbiy cho'kuvchanlikni aniqlash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Lyoss va lyossimon gruntlarning <b>nisbiy cho'kuvchanligini</b> ε<sub>sl</sub> va <b>boshlang'ich cho'kish bosimini</b> p<sub>sl</sub>
      aniqlash. O'zbekiston hududining katta qismi (Toshkent, Samarqand, Farg'ona vodiysi, Mirzacho'l) lyoss gruntlaridan iborat:
      ular quruq holatda mustahkam, ammo namlanganda tuzilishi buzilib, keskin cho'kadi. Bu binolarda yoriqlar va avariyalarga sabab bo'ladi.</p>
      <h3>Jihozlar</h3>
      <ul><li>Kompression asbob (odometr), halqa: diametri 71,4 mm, balandligi <b>25 mm</b>;</li>
      <li>Richagli yuklash qurilmasi, soat tipidagi indikator (0,01 mm);</li><li>Suv berish tizimi, filtr qog'ozi, g'ovak toshlar.</li></ul>
      <h3>Ikki egri chiziq usuli</h3>
      <ol><li>Bir monolitdan ikkita namuna halqaga kesib olinadi.</li>
      <li><b>A namuna</b> tabiiy namlikda bosqichma-bosqich yuklanadi.</li>
      <li><b>B namuna</b> avval suvga to'yintiriladi, so'ng xuddi shunday bosqichlarda yuklanadi.</li>
      <li>Har bir bosqichda deformatsiya shartli stabillashguncha (0,01 mm / 3 soat) kutiladi va indikator ko'rsatkichi yoziladi.</li></ol>
      <h3>Hisoblash</h3>
      <div class="formula">ε = Δh / h₀ &nbsp;&nbsp;&nbsp; ε<sub>sl</sub>(p) = (h<sub>A</sub>(p) − h<sub>B</sub>(p)) / h₀ = ε<sub>B</sub>(p) − ε<sub>A</sub>(p)</div>
      <p>Grunt <b>ε<sub>sl</sub> ≥ 0,01</b> bo'lganda cho'kuvchan hisoblanadi. ε<sub>sl</sub> = 0,01 ga mos keluvchi bosim — boshlang'ich cho'kish bosimi p<sub>sl</sub>.</p>
      ${VL.table(['ε<sub>sl</sub>', '< 0,01', '0,01–0,03', '0,03–0,07', '0,07–0,12', '> 0,12'],
        [['Tasnif', "cho'kmaydigan", 'kuchsiz', "o'rtacha", 'kuchli', "o'ta kuchli"]])}
      <h3>Cho'kuvchanlikka qarshi choralar (KMK 2.02.01-98)</h3>
      <ul><li>Gruntni og'ir shibbalar bilan zichlash yoki grunt yostiqlar barpo etish;</li>
      <li>Oldindan namlash (shu jumladan chuqur portlatish bilan);</li><li>Kimyoviy mustahkamlash (silikatlash), termik mustahkamlash;</li>
      <li>Cho'kuvchan qatlamni kesib o'tuvchi qoziqli poydevorlar;</li><li>Bino atrofida suv o'tkazmaydigan otmostka va kommunikatsiyalar germetikligi.</li></ul>`,
    quiz: [
      { q: "Grunt qachon cho'kuvchan hisoblanadi?", o: ['ε_sl ≥ 0,01', 'ε_sl ≥ 0,1', 'Namligi 20% dan katta bo\'lsa', 'Zichligi 2 g/sm³ dan katta bo\'lsa'], a: 0 },
      { q: "Ikki egri chiziq usulida B namuna qanday sinaladi?", o: ['Quritilib', 'Avval suvga to\'yintirilib', 'Muzlatilib', 'Yuklanmasdan'], a: 1 },
      { q: 'Kompression asbob halqasining balandligi qancha?', o: ['10 mm', '25 mm', '50 mm', '100 mm'], a: 1 },
      { q: "Lyoss gruntlari asosan qachon cho'kadi?", o: ["Quriganda", 'Namlanganda', 'Muzlaganda', 'Yuk olinganda'], a: 1 },
      { q: "Quyidagilardan qaysi biri cho'kuvchanlikni bartaraf etish usuli emas?", o: ['Zichlash', 'Silikatlash', 'Qoziqli poydevor', "Bino atrofiga ko'proq suv berish"], a: 3 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fS = VL.field.select(P, 'Grunt namunasi', Object.entries(SOILS).map(([k, s]) => [k, s.name]), 'tashkent');
      const fP = VL.field.select(P, 'Poydevor tagidagi loyihaviy bosim', [[0.15, '0,15 MPa'], [0.2, '0,20 MPa'], [0.3, '0,30 MPa']], 0.2);
      const rStep = L.readout('Jarayon', ''), rP = L.readout('Bosim p', 'MPa'), rA = L.readout('Indikator A', 'mm'), rB = L.readout('Indikator B', 'mm');
      const chart = new VL.Chart(L.chart, { xLabel: 'Bosim p, MPa', yLabel: 'Nisbiy deformatsiya ε, %', xMax: 0.32, yMax: 12 });
      let st;

      const steps = new VL.Steps(P, [
        { label: 'Monolitdan 2 ta namunani halqaga kesib olish', run: done => { fS.disabled = true; rStep.set('Namunalar olindi'); VL.tween(1, t => (st.cut = t), done); } },
        { label: "B namunani suvga to'yintirish", run: done => { rStep.set("To'yintirilmoqda"); VL.tween(2, t => (st.waterB = t), done); } },
        { label: 'Bosqichma-bosqich yuklash (7 bosqich)', run: load },
        { label: 'Natijalarni hisoblash', run: done => { st.calc = true; rStep.set('Hisoblandi'); renderResults(); done(); } },
      ], () => (bNew.disabled = false));
      const bNew = VL.field.button(P, '↻ Yangi sinov', fresh, 'primary');
      fS.addEventListener('change', fresh);
      fP.addEventListener('change', () => st.calc && renderResults());

      function fresh() {
        const s = SOILS[fS.value];
        const jit = 1 + VL.gauss(0, 0.06);
        st = { cut: 0, waterB: 0, p: 0, eA: 0, eB: 0, rows: [], calc: false, weights: 0,
          epsA: p => s.c1 * Math.pow(p / 0.3, 0.75),
          epsB: p => s.c1 * 1.25 * Math.pow(p / 0.3, 0.75) + s.sl * jit * (1 - Math.exp(-Math.pow(p / s.p0, 1.6))) };
        chart.o.yMax = Math.ceil(st.epsB(0.3) * 100 * 1.15 + 0.5);
        steps.reset(); fS.disabled = false; bNew.disabled = true;
        rStep.set('Tayyor'); rP.set(0, 3); rA.set(0, 2); rB.set(0, 2); chart.reset();
        renderResults();
      }

      function load(done) {
        rStep.set('Yuklanmoqda');
        const sA = chart.add({ color: '#b45309', points: true, label: 'A — tabiiy namlik' });
        const sB = chart.add({ color: '#2563eb', points: true, label: "B — suvga to'yingan" });
        sA.data.push([0, 0]); sB.data.push([0, 0]);
        let prev = 0;
        VL.sequence(PRESS, (p, i, next) => {
          rP.set(p, 3); st.weights = i + 1;
          const a0 = st.eA, b0 = st.eB, a1 = st.epsA(p) + VL.gauss(0, 0.0003), b1 = st.epsB(p) + VL.gauss(0, 0.0004);
          VL.tween(1.0, t => {
            const k = 1 - Math.exp(-5 * t);
            st.eA = a0 + (a1 - a0) * k; st.eB = b0 + (b1 - b0) * k; st.p = prev + (p - prev) * Math.min(1, t * 4);
            rA.set(st.eA * H0, 2); rB.set(st.eB * H0, 2);
          }, () => {
            const hA = Math.round(a1 * H0 * 100) / 100, hB = Math.round(b1 * H0 * 100) / 100;
            st.eA = hA / H0; st.eB = hB / H0; prev = p;
            st.rows.push({ p, hA, hB });
            sA.data.push([p, hA / H0 * 100]); sB.data.push([p, hB / H0 * 100]);
            renderResults(); setTimeout(next, 200);
          });
        }, () => { rStep.set('Yuklandi'); done(); });
      }

      VL.loop(frame);
      fresh();

      function frame(dt, time) { draw(time); drawChart(); }

      function odometer(ctx, x, floorY, k, eps, wet, label, time) {
        const w = 120 * k;
        VL.metal(ctx, x - w * 0.8, floorY - 16 * k, w * 1.6, 16 * k, true, true);
        // suv vannasi
        if (wet > 0) { ctx.fillStyle = `rgba(56,189,248,${0.35 * wet})`; ctx.fillRect(x - w * 0.62, floorY - 16 * k - 60 * k * wet, w * 1.24, 60 * k * wet); }
        ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(x - w * 0.62, floorY - 76 * k, w * 1.24, 60 * k);
        // halqa va grunt
        const ringH = 50 * k, ringY = floorY - 16 * k - 6 * k - ringH, sq = eps * ringH * 4;   // deformatsiya ko'rinishi uchun ×4
        VL.metal(ctx, x - w / 2 - 6 * k, ringY, 6 * k, ringH, false);
        VL.metal(ctx, x + w / 2, ringY, 6 * k, ringH, false);
        const g = ctx.createLinearGradient(0, ringY, 0, ringY + ringH);
        g.addColorStop(0, wet > 0.5 ? '#a16207' : '#d6b370'); g.addColorStop(1, wet > 0.5 ? '#854d0e' : '#c49a52');
        ctx.fillStyle = g; ctx.fillRect(x - w / 2, ringY + sq, w, ringH - sq);
        ctx.fillStyle = 'rgba(120,53,15,.35)';
        for (let i = 0; i < 18; i++) { ctx.fillRect(x - w / 2 + ((i * 37) % 110) * k, ringY + sq + ((i * 23) % 44) * k * (1 - eps * 4), 2, 2); }
        // shtamp va sterjen
        VL.metal(ctx, x - w / 2 + 2, ringY + sq - 10 * k, w - 4, 10 * k, true);
        VL.metal(ctx, x - 6 * k, ringY + sq - 150 * k, 12 * k, 140 * k);
        // richag va yuklar
        const ly = ringY + sq - 150 * k;
        VL.metal(ctx, x - 20 * k, ly - 8 * k, 160 * k, 8 * k, true, true);
        for (let i = 0; i < st.weights; i++) VL.metal(ctx, x + 112 * k, ly + 2 * k + i * 9 * k, 30 * k, 8 * k, true, true);
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 127 * k, ly); ctx.lineTo(x + 127 * k, ly + 2 * k); ctx.stroke();
        // indikator
        const ix = x - 55 * k, iy = ly + 10 * k, R = 22 * k;
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ix, iy, R, 0, 7); ctx.fill(); ctx.strokeStyle = '#334155'; ctx.lineWidth = 2; ctx.stroke();
        const ang = (eps * H0 * 100 % 100) / 100 * Math.PI * 2 - Math.PI / 2;
        ctx.strokeStyle = '#dc2626'; ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ix + Math.cos(ang) * R * 0.85, iy + Math.sin(ang) * R * 0.85); ctx.stroke();
        ctx.fillStyle = '#0f172a'; ctx.font = `bold ${Math.max(9, 10 * k)}px monospace`; ctx.textAlign = 'center';
        ctx.fillText(VL.fmt(eps * H0, 2), ix, iy + R + 12 * k);
        ctx.font = `bold ${Math.max(11, 13 * k)}px system-ui`; ctx.fillStyle = '#1e293b';
        ctx.fillText(label, x + 20 * k, floorY + 14);
      }

      function draw(time) {
        const { ctx, w, h } = VL.fit(L.scene);
        VL.sceneBg(ctx, w, h);
        const floorY = h - 26, k = Math.min(1, w / 560, (h - 40) / 300);
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, floorY, w, h);
        if (st.cut < 1) {
          // grunt monoliti
          const mx = w / 2, mw = 200 * k, mh = 160 * k;
          ctx.fillStyle = '#d6b370'; ctx.fillRect(mx - mw / 2, floorY - mh, mw, mh);
          ctx.fillStyle = 'rgba(120,53,15,.35)';
          for (let i = 0; i < 80; i++) ctx.fillRect(mx - mw / 2 + ((i * 53) % 197) * k, floorY - mh + ((i * 31) % 157) * k, 2, 3);
          ctx.strokeStyle = 'rgba(120,53,15,.4)';
          for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(mx - mw / 2 + (20 + i * 32) * k, floorY - mh); ctx.lineTo(mx - mw / 2 + (24 + i * 32) * k, floorY); ctx.stroke(); }
          ctx.fillStyle = '#334155'; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
          ctx.fillText(`Grunt monoliti: ρ = ${VL.fmt(SOILS[fS.value].rho, 2)} g/sm³, w = ${SOILS[fS.value].w}%`, mx, floorY - mh - 12);
          if (st.cut > 0) { ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 3; ctx.strokeRect(mx - 40 * k, floorY - mh + 20 * k - st.cut * 40 * k, 80 * k, 40 * k); }
          return;
        }
        odometer(ctx, w * 0.27, floorY, k, st.eA, 0, 'A — tabiiy namlik', time);
        odometer(ctx, w * 0.72, floorY, k, st.eB, st.waterB, "B — suvga to'yingan", time);
        ctx.fillStyle = '#334155'; ctx.font = '12px system-ui'; ctx.textAlign = 'left';
        ctx.fillText(`p = ${VL.fmt(st.p, 3)} MPa`, 10, 18);
      }

      function epsSl() { return st.rows.map(r => [r.p, (r.hB - r.hA) / H0]); }

      function pSl() {
        const d = [[0, 0], ...epsSl()];
        for (let i = 1; i < d.length; i++) if (d[i][1] >= 0.01) {
          const [p0, e0] = d[i - 1], [p1, e1] = d[i];
          return p0 + (0.01 - e0) / (e1 - e0) * (p1 - p0);
        }
        return null;
      }

      function drawChart() {
        chart.series = chart.series.filter(s => !s.sl); chart.lines = []; chart.marks = [];
        if (st.rows.length) {
          chart.add({ data: [[0, 0], ...epsSl().map(([p, e]) => [p, e * 100])], color: '#16a34a', dash: [6, 3], label: "ε_sl — cho'kuvchanlik", sl: true });
          chart.lines.push({ x0: 0, y0: 1, x1: 0.32, y1: 1, color: '#dc2626', label: '' });
          if (st.calc) {
            const ps = pSl();
            if (ps != null) chart.marks.push({ x: ps, y: 1, color: '#dc2626', label: `p_sl = ${VL.fmt(ps, 3)} MPa` });
          }
        }
        chart.draw();
      }

      function renderResults() {
        const rows = st.rows.map(r => {
          const e = (r.hB - r.hA) / H0;
          return [VL.fmt(r.p, 3), VL.fmt(r.hA, 2), VL.fmt(r.hB, 2), VL.fmt(r.hA / H0, 4), VL.fmt(r.hB / H0, 4), `<b>${VL.fmt(e, 4)}</b>`];
        });
        let html = `<h3>Kompression sinov natijalari — ${SOILS[fS.value].name}</h3>` +
          VL.table(['p, MPa', 'Δh<sub>A</sub>, mm', 'Δh<sub>B</sub>, mm', 'ε<sub>A</sub>', 'ε<sub>B</sub>', 'ε<sub>sl</sub>'], rows.length ? rows : [['—', '', '', '', '', '']]);
        let summary = '';
        if (st.calc) {
          const pd = +fP.value, r = st.rows.find(x => Math.abs(x.p - pd) < 1e-9), e = (r.hB - r.hA) / H0;
          const [name, kind] = cls(e), ps = pSl();
          summary = `ε_sl(${VL.fmt(pd, 2)} MPa) = ${VL.fmt(e, 4)} — ${name}`;
          html += `<div class="calc"><p>Loyihaviy bosim p = ${VL.fmt(pd, 2)} MPa da: ε<sub>sl</sub> = (${VL.fmt(r.hB, 2)} − ${VL.fmt(r.hA, 2)}) / ${H0} = <b>${VL.fmt(e, 4)}</b></p>
            <p>Boshlang'ich cho'kish bosimi: <b>p<sub>sl</sub> = ${ps != null ? VL.fmt(ps, 3) + ' MPa' : '> 0,3 MPa'}</b></p></div>
            <div class="verdict ${kind}"><b>Xulosa:</b> Grunt loyihaviy bosimda <b>${name}</b> (ε<sub>sl</sub> = ${VL.fmt(e, 3)}).
            ${e < 0.01 ? "Poydevorni oddiy sharoitdagidek loyihalash mumkin."
              : `Namlanganda 1 m qalinlikdagi qatlam taxminan ${VL.fmt(e * 1000, 0)} mm ga cho'kishi mumkin. ${ps != null && ps < pd ? `Poydevor tagidagi bosim p<sub>sl</sub> = ${VL.fmt(ps, 3)} MPa dan katta — ` : ''}KMK 2.02.01-98 bo'yicha choralar talab etiladi: zichlash, grunt yostiq, silikatlash yoki qoziqli poydevor, hamda bino atrofida suv to'planishiga yo'l qo'ymaslik.`}</div>`;
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
