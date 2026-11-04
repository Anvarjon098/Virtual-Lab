'use strict';
/* Neft yo'l bitumi: penetratsiya va yumshash harorati (GOST 11501-78, GOST 11506-73, GOST 22245-90) */
(function () {
  const SAMPLES = {
    s1: { name: '1-namuna (partiya №1)', pen: 52, ts: 52.5 },
    s2: { name: '2-namuna (partiya №2)', pen: 76, ts: 48.5 },
    s3: { name: '3-namuna (partiya №3)', pen: 112, ts: 45 },
    s4: { name: '4-namuna (partiya №4)', pen: 165, ts: 41 },
    s5: { name: "5-namuna (omborda uzoq saqlangan)", pen: 33, ts: 59 },
  };
  const GRADES = [
    { n: 'БНД 40/60', p: [40, 60], t: 51 }, { n: 'БНД 60/90', p: [61, 90], t: 47 },
    { n: 'БНД 90/130', p: [91, 130], t: 43 }, { n: 'БНД 130/200', p: [131, 200], t: 39 },
  ];
  const REGIONS = {
    termiz: ['Surxondaryo (Termiz)', 'БНД 40/60', 'yozda havo +47 °C gacha, qoplama +70 °C gacha qiziydi'],
    qarshi: ['Qashqadaryo (Qarshi)', 'БНД 40/60', 'juda issiq, quruq iqlim'],
    buxoro: ['Buxoro, Navoiy', 'БНД 40/60', 'juda issiq cho\'l iqlimi'],
    nukus: ["Qoraqalpog'iston (Nukus), Xorazm", 'БНД 60/90', 'issiq yoz va sovuq qish (−25 °C gacha)'],
    toshkent: ['Toshkent, Sirdaryo, Jizzax', 'БНД 60/90', "mo'tadil-issiq iqlim"],
    fargona: ["Farg'ona vodiysi", 'БНД 60/90', "mo'tadil-issiq iqlim"],
    samarqand: ['Samarqand', 'БНД 60/90', "mo'tadil-issiq iqlim"],
    tog: ["Tog'li hududlar (Chimyon, Zomin)", 'БНД 90/130', 'sovuq qish, yozi salqin'],
  };

  VL.register({
    id: 'bitumen', icon: '🛣️', cat: 'yol',
    title: "Neft bitumining xossalari (penetratsiya, yumshash harorati)",
    standard: 'GOST 11501-78, GOST 11506-73, GOST 22245-90, GOST 33133-2014',
    short: "Bitumning igna botish chuqurligi va «halqa-shar» usulida yumshash haroratini aniqlab, markasini va hududga mosligini belgilash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Neft yo'l bitumining qovushqoqligini (penetratsiya) va issiqqa chidamliligini (yumshash harorati) aniqlash, markasini
      belgilash va O'zbekistonning turli iqlim hududlarida asfaltbeton uchun yaroqliligini baholash.</p>
      <h3>1. Penetratsiya (GOST 11501)</h3>
      <p>Penetrometr ignasi <b>100 g</b> yuk ostida <b>5 soniya</b> davomida <b>25 °C</b> haroratdagi bitumga botiriladi.
      Botish chuqurligi 0,1 mm birliklarda o'lchanadi. Namunaning turli nuqtalarida kamida <b>3 marta</b> o'lchanib, o'rtachasi olinadi.</p>
      <h3>2. Yumshash harorati — «halqa va shar» (GOST 11506)</h3>
      <p>Bitum bilan to'ldirilgan latun halqalar ustiga 3,5 g li po'lat sharlar qo'yiladi va suvli idishda <b>5 °C/daq</b> tezlikda qizdiriladi.
      Bitum yumshab, shar bilan birga 25 mm pastdagi plastinkaga tekkan paytdagi harorat — yumshash harorati.</p>
      <h3>Penetratsiya indeksi</h3>
      <div class="formula">A = (lg 800 − lg P) / (T<sub>yum</sub> − 25); &nbsp;&nbsp; PI = (20 − 500·A) / (1 + 50·A)</div>
      <p>Yo'l bitumlari uchun PI odatda −1,0 … +1,0 oralig'ida bo'ladi.</p>
      <h3>Markalar (GOST 22245-90)</h3>
      ${VL.table(['Marka', 'Penetratsiya 25 °C, 0,1 mm', 'Yumshash harorati, °C ≥'], GRADES.map(g => [g.n, `${g.p[0]}–${g.p[1]}`, g.t]))}
      <h3>O'zbekiston hududlari uchun tavsiya (o'quv)</h3>
      ${VL.table(['Hudud', 'Tavsiya etilgan marka', 'Iqlim'], Object.values(REGIONS).map(r => [r[0], r[1], r[2]]))}
      <p>Issiq hududlarda yumshoq bitum yozda asfaltda <b>izlar (koleya)</b> hosil bo'lishiga olib keladi; shuning uchun qattiqroq
      (kichik penetratsiyali) bitum tanlanadi.</p>`,
    quiz: [
      { q: 'Penetratsiya qanday sharoitda aniqlanadi?', o: ['0 °C, 200 g, 60 s', '25 °C, 100 g, 5 s', '50 °C, 50 g, 10 s', '100 °C, 100 g, 1 s'], a: 1 },
      { q: 'Yumshash haroratini aniqlashda qizdirish tezligi qancha?', o: ['1 °C/daq', '5 °C/daq', '20 °C/daq', 'Ixtiyoriy'], a: 1 },
      { q: 'Penetratsiyasi 75 ga teng bitum qaysi markaga kiradi?', o: ['БНД 40/60', 'БНД 60/90', 'БНД 90/130', 'БНД 130/200'], a: 1 },
      { q: 'Surxondaryo kabi juda issiq hududlarda qanday bitum tanlanadi?', o: ['Yumshoqroq (katta penetratsiyali)', 'Qattiqroq (kichik penetratsiyali)', 'Farqi yo\'q', 'Suyuq bitum'], a: 1 },
      { q: "Bitum uzoq saqlansa yoki qizdirilsa (eskirsa), qanday o'zgaradi?", o: ['Penetratsiya ortadi', 'Penetratsiya kamayadi, yumshash harorati ortadi', "O'zgarmaydi", "Yumshash harorati kamayadi"], a: 1 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fS = VL.field.select(P, 'Bitum namunasi (markasi noma\'lum)', Object.entries(SAMPLES).map(([k, s]) => [k, s.name]), 's2');
      const fR = VL.field.select(P, "Yo'l qurilish hududi", Object.entries(REGIONS).map(([k, r]) => [k, r[0]]), 'toshkent');
      const rStep = L.readout('Jarayon', ''), rT = L.readout('Harorat', '°C'), rV = L.readout("Ko'rsatkich", '');
      const chart = new VL.Chart(L.chart, { xLabel: 'Suv harorati, °C', yLabel: 'Sharning cho\'kishi, mm', xMin: 5, xMax: 70, yMax: 28 });
      let st;

      const steps = new VL.Steps(P, [
        { label: 'Namunani termostatda 25 °C da saqlash', run: thermostat },
        { label: 'Penetratsiyani 3 nuqtada o\'lchash', run: penetrate },
        { label: "Halqa va sharlarni o'rnatish (5 °C suvda)", run: done => { st.scene = 'ring'; st.temp = 5; rT.set(5, 1); rStep.set('Halqalar tayyor'); VL.tween(0.8, t => (st.ballIn = t), done); } },
        { label: 'Qizdirish 5 °C/daq — yumshash harorati', run: heat },
        { label: 'Natijalarni hisoblash', run: done => { st.calc = true; rStep.set('Hisoblandi'); renderResults(); done(); } },
      ], () => (bNew.disabled = false));
      const bNew = VL.field.button(P, '↻ Yangi sinov', fresh, 'primary');
      fS.addEventListener('change', fresh);
      fR.addEventListener('change', () => st.calc && renderResults());

      function fresh() {
        const s = SAMPLES[fS.value];
        st = {
          scene: 'pen', temp: 20, pens: [], cur: -1, needle: 0, dial: 0, sag: [0, 0], ballIn: 0, fallT: [null, null], calc: false, heatT: 0,
          pen: s.pen * (1 + VL.gauss(0, 0.025)), ts: [s.ts + VL.gauss(0, 0.3), 0],
        };
        st.ts[1] = st.ts[0] + VL.gauss(0, 0.35);
        steps.reset(); fS.disabled = false; bNew.disabled = true;
        rStep.set('Tayyor'); rT.set(20, 1); rV.set('—'); chart.reset();
        renderResults();
      }

      function thermostat(done) {
        fS.disabled = true; rStep.set('Termostat');
        VL.tween(1.5, t => { st.temp = 20 + 5 * VL.ease(t); rT.set(st.temp, 1); rV.set(`${Math.round(60 * t)} daq`); }, () => { st.temp = 25; done(); });
      }

      function penetrate(done) {
        rStep.set('Penetratsiya');
        VL.sequence([0, 1, 2], (i, _, next) => {
          st.cur = i;
          const p = Math.round(st.pen + VL.gauss(0, 1.3));
          VL.tween(1.5, t => {
            const k = Math.sqrt(t);  // igna avval tez, keyin sekin botadi
            st.needle = p * k; st.dial = p * k; rV.set(`${Math.round(p * k)} × 0,1 mm`);
          }, () => { st.pens.push(p); renderResults(); setTimeout(() => { st.needle = 0; next(); }, 400); });
        }, () => { st.cur = -1; rStep.set('O\'lchandi'); done(); });
      }

      function heat(done) {
        rStep.set('Qizdirilmoqda');
        const sA = chart.add({ color: '#2563eb', label: '1-halqa' }), sB = chart.add({ color: '#dc2626', label: '2-halqa' });
        const tEnd = Math.max(...st.ts) + 2, dur = 6;
        VL.tween(dur, t => {
          st.temp = 5 + (tEnd - 5) * t; rT.set(st.temp, 1); rV.set(`${VL.fmt((st.temp - 5) / 5, 1)} daq`);
          for (let i = 0; i < 2; i++) {
            const x = (st.temp - st.ts[i]) / 6;
            st.sag[i] = st.temp >= st.ts[i] ? 25 : 25 * Math.exp(4 * x) * VL.clamp((st.temp - 5) / 30, 0, 1) ** 2;
            st.sag[i] = Math.min(25, st.sag[i]);
            if (st.sag[i] >= 25 && st.fallT[i] == null) st.fallT[i] = Math.round(st.ts[i] * 2) / 2;
            (i ? sB : sA).data.push([st.temp, st.sag[i]]);
          }
        }, () => {
          chart.lines.push({ x0: 5, y0: 25, x1: 70, y1: 25, color: '#16a34a', label: '' });
          st.fallT.forEach((T, i) => chart.marks.push({ x: T, y: 25, color: i ? '#dc2626' : '#2563eb', label: `${VL.fmt(T, 1)} °C`, align: i ? 'left' : 'right' }));
          rStep.set('Shar tushdi'); renderResults(); done();
        });
      }

      VL.loop(frame);
      fresh();

      function frame(dt, time) { draw(time); chart.draw(); }

      function draw(time) {
        const { ctx, w, h } = VL.fit(L.scene);
        VL.sceneBg(ctx, w, h);
        const floorY = h - 20, cx = w / 2;
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, floorY, w, h);
        if (st.scene === 'pen') {
          const k = Math.min(1, h / 380, w / 420);
          // stol va ustun
          VL.metal(ctx, cx - 150 * k, floorY - 20 * k, 300 * k, 20 * k, true, true);
          VL.metal(ctx, cx - 130 * k, floorY - 330 * k, 20 * k, 310 * k, false, true);
          VL.metal(ctx, cx - 130 * k, floorY - 300 * k, 150 * k, 18 * k, true, true);
          // termostatik vanna va idishcha
          ctx.fillStyle = 'rgba(56,189,248,.3)'; ctx.fillRect(cx - 60 * k, floorY - 90 * k, 140 * k, 70 * k);
          ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(cx - 60 * k, floorY - 90 * k, 140 * k, 70 * k);
          ctx.fillStyle = '#111827'; ctx.fillRect(cx - 35 * k, floorY - 70 * k, 90 * k, 40 * k);
          ctx.strokeStyle = '#94a3b8'; ctx.strokeRect(cx - 35 * k, floorY - 70 * k, 90 * k, 40 * k);
          // izlar
          st.pens.forEach((_, i) => { ctx.fillStyle = '#6b7280'; ctx.beginPath(); ctx.arc(cx + (i - 1) * 25 * k + 10 * k, floorY - 70 * k, 2, 0, 7); ctx.fill(); });
          // igna va yuk
          const nx = cx + ((st.cur >= 0 ? st.cur : 1) - 1) * 25 * k + 10 * k;
          const surf = floorY - 70 * k, depth = st.needle * 0.1 * 1.2 * k;
          ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(nx, surf + depth); ctx.lineTo(nx, surf - 60 * k + depth); ctx.stroke();
          VL.metal(ctx, nx - 5 * k, surf - 200 * k + depth, 10 * k, 140 * k);
          VL.metal(ctx, nx - 20 * k, surf - 150 * k + depth, 40 * k, 30 * k, true);
          ctx.fillStyle = '#fff'; ctx.font = `${10 * k}px system-ui`; ctx.textAlign = 'center'; ctx.fillText('100 g', nx, surf - 131 * k + depth);
          // siferblat
          const dx = cx + 100 * k, dy = floorY - 250 * k, R = 45 * k;
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(dx, dy, R, 0, 7); ctx.fill(); ctx.strokeStyle = '#334155'; ctx.lineWidth = 3; ctx.stroke();
          ctx.lineWidth = 1;
          for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2 - Math.PI / 2; ctx.beginPath(); ctx.moveTo(dx + Math.cos(a) * R * 0.85, dy + Math.sin(a) * R * 0.85); ctx.lineTo(dx + Math.cos(a) * R * (i % 3 ? 0.92 : 0.78), dy + Math.sin(a) * R * (i % 3 ? 0.92 : 0.78)); ctx.stroke(); }
          const a = (st.dial % 360) / 360 * Math.PI * 2 - Math.PI / 2;
          ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + Math.cos(a) * R * 0.8, dy + Math.sin(a) * R * 0.8); ctx.stroke();
          ctx.fillStyle = '#0f172a'; ctx.font = `bold ${13 * k}px monospace`; ctx.fillText(String(Math.round(st.dial)), dx, dy + R * 0.5);
          ctx.fillStyle = '#334155'; ctx.font = '12px system-ui'; ctx.textAlign = 'left';
          ctx.fillText(`Penetrometr · ${VL.fmt(st.temp, 1)} °C`, 12, 20);
        } else {
          // halqa-shar apparati
          const k = Math.min(1, h / 380, w / 420);
          const bx = cx - 110 * k, bw = 220 * k, by = floorY - 300 * k, bh = 260 * k;
          // olov
          if (st.temp > 5.5 && st.fallT.some(v => v == null)) for (let i = 0; i < 5; i++) {
            ctx.fillStyle = `rgba(${i % 2 ? '59,130,246' : '249,115,22'},.7)`;
            ctx.beginPath(); const fx = cx + (i - 2) * 16 * k; ctx.moveTo(fx - 6 * k, floorY); ctx.quadraticCurveTo(fx, floorY - (18 + 8 * Math.sin(time * 9 + i)) * k * 1.6, fx + 6 * k, floorY); ctx.fill();
          }
          VL.metal(ctx, cx - 130 * k, floorY - 40 * k, 260 * k, 8 * k, true);
          ctx.fillStyle = `rgba(56,189,248,${0.2 + 0.2 * (st.temp - 5) / 60})`; ctx.fillRect(bx, by + 20 * k, bw, bh - 20 * k);
          ctx.strokeStyle = 'rgba(71,85,105,.8)'; ctx.lineWidth = 3; ctx.strokeRect(bx, by, bw, bh);
          // termometr
          const tx = bx + bw - 30 * k;
          ctx.fillStyle = '#fff'; ctx.fillRect(tx - 4 * k, by - 40 * k, 8 * k, 230 * k);
          ctx.fillStyle = '#ef4444'; const lvl = (st.temp - 0) / 80 * 210 * k; ctx.fillRect(tx - 2 * k, by + 190 * k - lvl, 4 * k, lvl);
          ctx.beginPath(); ctx.arc(tx, by + 194 * k, 7 * k, 0, 7); ctx.fill();
          // halqalar
          const ringY = by + 90 * k, plateY = ringY + 25 * 3.4 * k;
          VL.metal(ctx, bx + 20 * k, ringY - 8 * k, bw - 70 * k, 5 * k, true);
          VL.metal(ctx, bx + 20 * k, plateY, bw - 70 * k, 5 * k, true);
          [0, 1].forEach(i => {
            const rx = bx + (60 + i * 80) * k, sag = st.sag[i] * 3.4 * k;
            ctx.fillStyle = '#b45309'; ctx.fillRect(rx - 18 * k, ringY - 3 * k, 36 * k, 7 * k);
            ctx.fillStyle = '#111827';
            ctx.beginPath(); ctx.moveTo(rx - 15 * k, ringY + 4 * k);
            ctx.quadraticCurveTo(rx - 14 * k, ringY + 4 * k + sag, rx, ringY + 6 * k + sag);
            ctx.quadraticCurveTo(rx + 14 * k, ringY + 4 * k + sag, rx + 15 * k, ringY + 4 * k); ctx.fill();
            const ballY = ringY - 10 * k + sag - (1 - st.ballIn) * 60 * k;
            const gB = ctx.createRadialGradient(rx - 3, ballY - 3, 1, rx, ballY, 9 * k); gB.addColorStop(0, '#f8fafc'); gB.addColorStop(1, '#475569');
            ctx.fillStyle = gB; ctx.beginPath(); ctx.arc(rx, ballY, 8 * k, 0, 7); ctx.fill();
          });
          ctx.fillStyle = '#334155'; ctx.font = '12px system-ui'; ctx.textAlign = 'left';
          ctx.fillText(`«Halqa va shar» apparati · ${VL.fmt(st.temp, 1)} °C`, 12, 20);
          ctx.fillText('25 mm', bx + bw - 64 * k, ringY + 45 * k);
        }
      }

      function renderResults() {
        const pm = st.pens.length === 3 ? VL.mean(st.pens) : null;
        const tm = st.fallT.every(v => v != null) ? VL.mean(st.fallT) : null;
        let html = '<h3>Sinov natijalari</h3>' + VL.table(['Ko\'rsatkich', '1', '2', '3', "O'rtacha"], [
          ['Penetratsiya 25 °C, 0,1 mm', ...[0, 1, 2].map(i => st.pens[i] ?? '…'), pm != null ? `<b>${Math.round(pm)}</b>` : ''],
          ['Yumshash harorati, °C', ...st.fallT.map(v => (v != null ? VL.fmt(v, 1) : '…')), '—', tm != null ? `<b>${VL.fmt(tm, 1)}</b>` : ''],
        ]);
        let summary = '';
        if (st.calc && pm != null && tm != null) {
          const P = Math.round(pm), A = (Math.log10(800) - Math.log10(P)) / (tm - 25), PI = (20 - 500 * A) / (1 + 50 * A);
          const g = GRADES.find(g => P >= g.p[0] && P <= g.p[1]);
          const okT = g && tm >= g.t;
          const reg = REGIONS[fR.value], fits = g && okT && g.n === reg[1];
          summary = `P = ${P}, Tyum = ${VL.fmt(tm, 1)} °C → ${g && okT ? g.n : 'markaga mos emas'}`;
          html += `<div class="calc"><p>A = (lg 800 − lg ${P}) / (${VL.fmt(tm, 1)} − 25) = ${VL.fmt(A, 4)}; &nbsp; <b>PI = ${VL.fmt(PI, 2)}</b>
            ${PI < -1 ? '(harorat sezgirligi yuqori)' : PI > 1 ? '(oksidlangan / eskirgan bitum)' : "(yo'l bitumlari uchun me'yoriy)"}</p></div>
            <div class="verdict ${g && okT ? (fits ? 'ok' : 'bad') : 'bad'}"><b>Xulosa:</b> ${g && okT
              ? `Bitum <b>${g.n}</b> markasiga mos keladi (penetratsiya ${g.p[0]}–${g.p[1]}, yumshash harorati ≥ ${g.t} °C). `
              : g ? `Penetratsiya bo'yicha ${g.n} ga to'g'ri keladi, lekin yumshash harorati (${VL.fmt(tm, 1)} °C) talab etilgan ≥ ${g.t} °C dan past — <b>markaga mos emas</b>. `
                : `Penetratsiya (${P}) hech bir БНД markasi oralig'iga kirmaydi — bitum eskirgan (oksidlangan), yo'l qurilishiga <b>yaroqsiz</b>. `}
              ${g && okT ? (fits ? `${reg[0]} hududi uchun tavsiya etilgan marka (${reg[1]}) bilan <b>mos</b> — ishlatish mumkin.`
                : `${reg[0]} hududi uchun ${reg[1]} tavsiya etiladi (${reg[2]}); bu bitum ${P > (GRADES.find(x => x.n === reg[1]).p[1]) ? "juda yumshoq — yozda asfaltda izlar hosil bo'ladi" : "juda qattiq — qishda yoriqlar paydo bo'lishi mumkin"}.`) : ''}</div>`;
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
