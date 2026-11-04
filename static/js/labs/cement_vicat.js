'use strict';
/* Sementning normal quyuqligi va qotish muddatlari — Vika asbobi (GOST 310.3-76) */
(function () {
  const CEM = {
    pc400: { name: 'ПЦ 400-Д20 (portlandsement)', nk: 26.5, ts: 165, te: 320 },
    pc500: { name: 'ПЦ 500-Д0 (qo\'shimchasiz)', nk: 25.5, ts: 140, te: 280 },
    slag: { name: 'ШПЦ 400 (shlakoportlandsement)', nk: 28.0, ts: 200, te: 390 },
    fast: { name: "Noma'lum partiya (gips kam qo'shilgan)", nk: 27.0, ts: 28, te: 70 },
  };
  const RING = 40;   // halqa balandligi, mm

  VL.register({
    id: 'vicat', icon: '🧪', cat: 'beton',
    title: 'Sementning normal quyuqligi va qotish muddatlari',
    standard: 'GOST 310.3-76, GOST 10178-85, GOST 31108-2020',
    short: "Vika asbobida sement xamirining normal quyuqligini topish, so'ng igna yordamida qotish boshlanishi va oxirini aniqlash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Sement xamirining normal quyuqligini (NQ) — standart pestik xamirga ma'lum chuqurlikkacha botadigan suv miqdorini — aniqlash
      va shu xamirda sementning qotish boshlanishi va oxiri muddatlarini topish.</p>
      <h3>Jihozlar</h3>
      <ul><li>Vika asbobi: harakatlanuvchi sterjen (massasi 300 ± 2 g), shkala 0–40 mm;</li>
      <li>Pestik (Ø 10 mm) — normal quyuqlik uchun, igna (Ø 1,1 mm) — qotish muddatlari uchun;</li>
      <li>Konussimon halqa (balandligi 40 mm) va shisha plastinka; 400 g sement, menzurka, kapcha.</li></ul>
      <h3>Normal quyuqlikni aniqlash</h3>
      <ol><li>400 g sement va taxminiy miqdordagi suv (odatda 24–28%) 5 daqiqa davomida aralashtiriladi.</li>
      <li>Xamir halqaga solinadi, 5–6 marta silkitiladi va tekislanadi.</li>
      <li>Pestik xamir yuzasiga tegizilib, bo'shatiladi; 30 soniyadan keyin botish chuqurligi o'lchanadi.</li>
      <li>Pestik plastinkaga <b>5–7 mm</b> yetmay to'xtasa, xamir normal quyuqlikka ega. Aks holda suv miqdori o'zgartirilib, sinov takrorlanadi.</li></ol>
      <div class="formula">NQ = m<sub>suv</sub> / m<sub>sement</sub> · 100%</div>
      <h3>Qotish muddatlari</h3>
      <p>Normal quyuqlikdagi xamirga igna har 10 daqiqada tushiriladi (birinchi marta — suv qo'shilgandan 30 daqiqa o'tib).</p>
      <ul><li><b>Qotish boshlanishi</b> — igna plastinkaga 2–4 mm yetmay to'xtagan vaqt;</li>
      <li><b>Qotish oxiri</b> — igna xamirga 1–2 mm dan ko'p botmaydigan vaqt.</li></ul>
      ${VL.table(['Ko\'rsatkich', 'Talab (GOST 10178)'], [['Qotish boshlanishi', '≥ 45 daqiqa'], ['Qotish oxiri', '≤ 10 soat']])}
      <p>Juda tez qotish (gips kam qo'shilganda) beton qorishmasini tashish va yotqizishni imkonsiz qiladi. O'zbekistonning issiq
      yozida (+40 °C dan yuqori) qotish yanada tezlashadi, shuning uchun qotish muddatini bilish ayniqsa muhim.</p>`,
    quiz: [
      { q: 'Normal quyuqlikda pestik plastinkaga qancha yetmay to\'xtashi kerak?', o: ['0–1 mm', '2–4 mm', '5–7 mm', '10–15 mm'], a: 2 },
      { q: 'Normal quyuqlikni aniqlash uchun qancha sement olinadi?', o: ['100 g', '400 g', '1000 g', '5 kg'], a: 1 },
      { q: 'Qotish boshlanishi GOST 10178 bo\'yicha kamida qancha bo\'lishi kerak?', o: ['10 daqiqa', '45 daqiqa', '3 soat', '10 soat'], a: 1 },
      { q: 'Qotish muddatlarini aniqlashda qaysi uchlik ishlatiladi?', o: ['Pestik', 'Igna', 'Konus', 'Shar'], a: 1 },
      { q: 'Sementga gips nima maqsadda qo\'shiladi?', o: ['Rangini o\'zgartirish', 'Qotish muddatini sekinlashtirish', 'Zichlikni oshirish', 'Suv sarfini oshirish'], a: 1 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fC = VL.field.select(P, 'Sement turi', Object.entries(CEM).map(([k, c]) => [k, c.name]), 'pc400');
      const fW = VL.field.range(P, 'Suv miqdori, % (400 g sementga):', { min: 22, max: 32, step: 0.25, value: 25, dec: 2, unit: '%' });
      const wInfo = VL.h('div', { class: 'hint' }); P.append(wInfo);
      const upd = () => (wInfo.textContent = `Suv: ${VL.fmt(4 * +fW.value, 0)} ml · Sement: 400 g`);
      fW.addEventListener('input', upd); upd();
      const box = VL.h('div', { class: 'row' }); P.append(box);
      const bNK = VL.field.button(box, 'Pestik bilan sinash', testNK, 'primary');
      const bSet = VL.field.button(box, 'Qotish muddatlarini aniqlash', testSet, 'accent');
      VL.field.button(box, 'Qayta boshlash', reset);

      const rMode = L.readout('Uchlik', ''), rGap = L.readout('Plastinkagacha', 'mm'), rClock = L.readout('Vaqt', 'daq');
      const chart = new VL.Chart(L.chart, { xLabel: 'Suv qo\'shilgandan keyingi vaqt, daq', yLabel: 'Igna va plastinka orasidagi masofa, mm', yMax: 42 });
      let st;

      function reset() {
        const c = CEM[fC.value];
        st = {
          nk: c.nk + VL.gauss(0, 0.3), ts: c.ts * (1 + VL.gauss(0, 0.06)), te: c.te * (1 + VL.gauss(0, 0.06)),
          trials: [], drops: [], tool: 'pestik', depth: 0, rodY: 0, busy: false, nkFound: null, start: null, end: null, clock: 0,
        };
        fC.disabled = false; fW.disabled = false; bNK.disabled = false; bSet.disabled = true;
        rMode.set('Pestik Ø10'); rGap.set('—'); rClock.set(0, 0);
        L.note("Suv miqdorini tanlab, «Pestik bilan sinash» tugmasini bosing. Pestik plastinkaga 5–7 mm yetmay to'xtashi kerak.", 'ok');
        chart.reset(); renderResults();
      }
      fC.addEventListener('change', reset);

      function gapNK(W) { return VL.clamp(6 + (st.nk - W) * 4.6 + VL.gauss(0, 0.25), 0, RING - 1); }

      function testNK() {
        if (st.busy) return;
        st.busy = true; fC.disabled = true; st.tool = 'pestik';
        const W = +fW.value, gap = Math.round(gapNK(W) * 2) / 2;
        st.paste = 1;
        VL.tween(1.6, t => { st.depth = (RING - gap) * VL.ease(t); rGap.set(RING - st.depth, 1); }, () => {
          st.trials.push({ W, gap });
          const ok = gap >= 5 && gap <= 7;
          if (ok) {
            st.nkFound = W; bNK.disabled = true; fW.disabled = true; bSet.disabled = false;
            L.note(`✔ Normal quyuqlik topildi: NQ = ${VL.fmt(W, 2)}% (pestik plastinkaga ${VL.fmt(gap, 1)} mm yetmadi). Endi qotish muddatlarini aniqlang.`, 'ok');
          } else {
            L.note(gap > 7 ? `Pestik ${VL.fmt(gap, 1)} mm yetmay to'xtadi — xamir quyuq. Suv miqdorini <b>oshiring</b>.`
              : `Pestik ${VL.fmt(gap, 1)} mm yetmay to'xtadi — xamir suyuq. Suv miqdorini <b>kamaytiring</b>.`, 'warn');
          }
          st.busy = false; renderResults();
        });
      }

      function gapSet(t) {
        const s = (st.te - st.ts) / (3.245 + 2.512), tm = st.ts + 2.512 * s;
        return VL.clamp(RING - RING / (1 + Math.exp((t - tm) / s)) + VL.gauss(0, 0.15), 0, RING);
      }

      function testSet() {
        if (st.busy || st.nkFound == null) return;
        st.busy = true; bSet.disabled = true; st.tool = 'igna'; rMode.set('Igna Ø1,1');
        const limit = Math.max(st.te + 40, 120);
        chart.o.xMax = Math.ceil(limit / 30) * 30;
        const series = chart.add({ color: '#7c3aed', points: false, width: 2, label: 'Igna botishi' });
        const times = [];
        for (let t = 30; ; t += 10) { times.push(t); if (t > st.te + 20 || t > 900) break; }
        VL.sequence(times, (t, i, next) => {
          const gap = Math.round(gapSet(t) * 2) / 2;
          st.clock = t; rClock.set(t, 0);
          st.shift = (i % 5) * 0.16 - 0.32;
          VL.tween(0.35, k => { st.depth = (RING - gap) * VL.ease(k); rGap.set(RING - st.depth, 1); }, () => {
            st.drops.push([t, gap]); series.data.push([t, gap]);
            if (st.start == null && gap >= 2) st.start = t;
            if (st.end == null && gap >= RING - 2) st.end = t;
            setTimeout(next, 60);
          });
        }, () => {
          chart.lines.push({ x0: 0, y0: 3, x1: chart.o.xMax, y1: 3, color: '#16a34a', label: '' });
          chart.lines.push({ x0: 0, y0: RING - 2, x1: chart.o.xMax, y1: RING - 2, color: '#dc2626', label: '' });
          if (st.start) chart.marks.push({ x: st.start, y: 3, color: '#16a34a', label: 'boshlanishi ' + hm(st.start) });
          if (st.end) chart.marks.push({ x: st.end, y: RING - 2, color: '#dc2626', label: 'oxiri ' + hm(st.end), align: 'right' });
          st.busy = false; renderResults();
        });
      }

      const hm = m => `${Math.floor(m / 60)} s ${String(Math.round(m % 60)).padStart(2, '0')} daq`;

      VL.loop(frame);
      reset();

      function frame() { draw(); chart.draw(); }

      function draw() {
        const { ctx, w, h } = VL.fit(L.scene);
        VL.sceneBg(ctx, w, h);
        const floorY = h - 20, k = Math.min((h - 60) / 300, w / 340);
        const cx = w / 2 + 30 * k;
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, floorY, w, h);
        // asos va ustun
        VL.metal(ctx, cx - 150 * k, floorY - 22 * k, 260 * k, 22 * k, true, true);
        VL.metal(ctx, cx - 130 * k, floorY - 280 * k, 26 * k, 258 * k, false, true);
        VL.metal(ctx, cx - 130 * k, floorY - 280 * k, 120 * k, 24 * k, true, true);
        VL.metal(ctx, cx - 130 * k, floorY - 170 * k, 120 * k, 18 * k, true, true);
        // shisha plastinka va halqa
        const plateY = floorY - 22 * k;
        ctx.fillStyle = 'rgba(186,230,253,.8)'; ctx.fillRect(cx - 60 * k, plateY - 5 * k, 120 * k, 5 * k);
        const ringTop = plateY - 5 * k - RING * 1.6 * k, ringBot = plateY - 5 * k;
        ctx.beginPath();
        ctx.moveTo(cx - 37 * k, ringBot); ctx.lineTo(cx - 32 * k, ringTop); ctx.lineTo(cx + 32 * k, ringTop); ctx.lineTo(cx + 37 * k, ringBot); ctx.closePath();
        ctx.fillStyle = st.tool === 'igna' && st.clock > st.ts ? '#78716c' : '#a8a29e'; ctx.fill();
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 3; ctx.stroke();
        // sterjen
        const mmPx = (ringBot - ringTop) / RING;
        const tipY = ringTop + st.depth * mmPx;
        const tipW = st.tool === 'pestik' ? 10 * k : 2;
        const tipX = cx + (st.tool === 'igna' ? (st.shift || 0) * 60 * k : 0);
        ctx.fillStyle = '#475569'; ctx.fillRect(tipX - tipW / 2, tipY - 50 * k, tipW, 50 * k);
        VL.metal(ctx, tipX - 6 * k, tipY - 210 * k, 12 * k, 160 * k);
        VL.metal(ctx, tipX - 14 * k, tipY - 120 * k, 28 * k, 14 * k, true);   // ko'rsatkich
        // shkala
        const scX = cx - 104 * k;
        ctx.fillStyle = '#fff'; ctx.fillRect(scX, ringTop - 150 * k, 22 * k, RING * mmPx);
        ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.font = `${Math.max(8, 9 * k)}px system-ui`; ctx.fillStyle = '#334155'; ctx.textAlign = 'right';
        for (let mm = 0; mm <= RING; mm += 5) {
          const y = ringTop - 150 * k + mm * mmPx;
          ctx.beginPath(); ctx.moveTo(scX + 22 * k, y); ctx.lineTo(scX + (mm % 10 ? 14 : 8) * k, y); ctx.stroke();
          if (mm % 10 === 0) ctx.fillText(String(RING - mm), scX - 3, y + 3);
        }
        const py = ringTop - 150 * k + st.depth * mmPx;
        ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.moveTo(scX + 24 * k, py); ctx.lineTo(scX + 34 * k, py - 5); ctx.lineTo(scX + 34 * k, py + 5); ctx.fill();
        ctx.fillStyle = '#334155'; ctx.textAlign = 'left'; ctx.font = '12px system-ui';
        ctx.fillText(st.tool === 'pestik' ? 'Pestik Ø10 mm' : 'Igna Ø1,1 mm', cx + 50 * k, ringTop + 10);
        ctx.fillText('Halqa h = 40 mm', cx + 50 * k, ringBot - 6);
        if (st.tool === 'igna') {
          ctx.font = 'bold 14px system-ui';
          ctx.fillText('⏱ ' + hm(st.clock), cx + 50 * k, 30);
        }
      }

      function renderResults() {
        const rows = st.trials.map((t, i) => [i + 1, VL.fmt(t.W, 2), VL.fmt(4 * t.W, 0), VL.fmt(t.gap, 1),
          t.gap >= 5 && t.gap <= 7 ? '<b style="color:#15803d">NQ ✔</b>' : t.gap > 7 ? 'quyuq' : 'suyuq']);
        let html = '<h3>1. Normal quyuqlikni aniqlash</h3>' + VL.table(['№', 'Suv, %', 'Suv, ml', 'Pestik plastinkagacha, mm', 'Baho'], rows.length ? rows : [['—', '', '', '', '']]);
        let summary = '';
        if (st.drops.length) {
          html += '<h3>2. Qotish muddatlari</h3>' + VL.table(['Vaqt, daq', ...st.drops.filter((_, i) => i % 2 === 0).slice(0, 16).map(d => d[0])],
            [['Masofa, mm', ...st.drops.filter((_, i) => i % 2 === 0).slice(0, 16).map(d => VL.fmt(d[1], 1))]]);
        }
        if (st.end != null) {
          const okS = st.start >= 45, okE = st.end <= 600, ok = okS && okE;
          summary = `NQ = ${VL.fmt(st.nkFound, 2)}%, qotish: ${hm(st.start)} – ${hm(st.end)}`;
          html += `<div class="calc"><p>Normal quyuqlik: <b>NQ = ${VL.fmt(4 * st.nkFound, 0)} / 400 · 100 = ${VL.fmt(st.nkFound, 2)}%</b></p>
            <ul class="checks"><li class="${okS ? 'ok' : 'bad'}">${okS ? '✔' : '✘'} Qotish boshlanishi: ${hm(st.start)} (talab ≥ 45 daq)</li>
            <li class="${okE ? 'ok' : 'bad'}">${okE ? '✔' : '✘'} Qotish oxiri: ${hm(st.end)} (talab ≤ 10 soat)</li></ul></div>
            <div class="verdict ${ok ? 'ok' : 'bad'}"><b>Xulosa:</b> ${CEM[fC.value].name}: normal quyuqlik ${VL.fmt(st.nkFound, 2)}%.
            ${ok ? "Qotish muddatlari GOST 10178 talablariga <b>mos keladi</b>; sement beton va qorishmalar uchun yaroqli."
              : "Sement juda tez qotadi — GOST 10178 talablariga <b>mos kelmaydi</b>. Bunday sement bilan qorishmani tashish va yotqizish mumkin emas (soxta qotish xavfi). Partiya qaytarilishi kerak."}</div>`;
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
