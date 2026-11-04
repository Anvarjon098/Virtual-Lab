'use strict';
/* 2-ish. Beton qorishmasining harakatchanligi — konus cho'kishi (GOST 10181-2014) */
(function () {
  const CONE = { rb: 100, rt: 50, H: 300 };   // mm

  function markOf(cm) {
    if (cm < 1) return ['Ж', "qattiq qorishma — Vebe usulida sinash kerak"];
    if (cm < 5) return ['P1', "yig'ma temir-beton buyumlar, vibrozichlash"];
    if (cm < 10) return ['P2', 'poydevorlar, massiv konstruksiyalar'];
    if (cm < 16) return ['P3', 'monolit devor, ustun, plitalar'];
    if (cm < 21) return ['P4', 'zich armaturalangan konstruksiyalar, nasos bilan quyish'];
    return ['P5', 'quyma (o\'zi zichlanuvchi) beton, nasos bilan uzatish'];
  }

  VL.register({
    id: 'slump', icon: '🔺', cat: 'beton',
    title: "Beton qorishmasining harakatchanligi (konus cho'kishi)",
    standard: 'GOST 10181-2014, GOST 7473-2010 · ASTM C143',
    short: "Abrams konusi yordamida beton qorishmasining cho'kishini o'lchab, harakatchanlik markasini (P1–P5) aniqlash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Beton qorishmasining qulay yotqizuvchanligini (harakatchanligini) standart konus cho'kishi bo'yicha aniqlash
      va suv miqdori, plastifikator hamda yirik to'ldiruvchi o'lchamining unga ta'sirini o'rganish.</p>
      <h3>Jihozlar</h3>
      <ul><li>Standart konus (Abrams konusi): pastki diametri 200 mm, yuqori diametri 100 mm, balandligi 300 mm;</li>
      <li>Zichlash sterjeni Ø16 mm, uzunligi 600 mm;</li><li>Metall taglik (700×700 mm), chizg'ich, kapcha.</li></ul>
      <h3>Ish tartibi</h3>
      <ol><li>Konus va taglikning ichki yuzasi nam latta bilan namlanadi, konus taglikka o'rnatilib, oyoqlari bilan bosib turiladi.</li>
      <li>Konus qorishma bilan <b>uch qatlamda</b> to'ldiriladi, har bir qatlam sterjen bilan <b>25 marta</b> sanchib zichlanadi.</li>
      <li>Ortiqcha qorishma konus chetlari bo'yicha kesib tashlanadi va tekislanadi.</li>
      <li>Konus <b>5–10 soniya</b> ichida vertikal ravishda ehtiyotkorlik bilan ko'tariladi va yoniga qo'yiladi.</li>
      <li>Konus balandligi bilan cho'kkan qorishma balandligi orasidagi farq 0,5 sm aniqlikda o'lchanadi.</li></ol>
      <h3>Harakatchanlik markalari (GOST 7473)</h3>
      ${VL.table(['Marka', 'P1', 'P2', 'P3', 'P4', 'P5'], [["Cho'kish, sm", '1–4', '5–9', '10–15', '16–20', '≥ 21']])}
      <p>Cho'kish 1 sm dan kam bo'lsa, qorishma qattiq hisoblanadi va uning qattiqligi Vebe asbobida aniqlanadi.</p>
      <h3>Ta'sir etuvchi omillar</h3>
      <p>Suv miqdorining 1 litrga (1 m³ ga) oshishi cho'kishni sezilarli oshiradi, ammo S/S ni ham oshirib, mustahkamlikni pasaytiradi.
      Plastifikatorlar (S-3, polikarboksilatlar) suvni ko'paytirmasdan harakatchanlikni oshiradi. Yirik to'ldiruvchining maksimal o'lchami
      oshgani sari qorishmaning suvga talabi kamayadi.</p>`,
    quiz: [
      { q: 'Standart konusning balandligi qancha?', o: ['200 mm', '250 mm', '300 mm', '400 mm'], a: 2 },
      { q: "Konus nechta qatlamda to'ldiriladi va har biri necha marta zichlanadi?", o: ['2 qatlam × 10', '3 qatlam × 25', '4 qatlam × 15', '1 qatlam × 50'], a: 1 },
      { q: "Cho'kish 12 sm bo'lsa, qorishma qaysi markaga kiradi?", o: ['P1', 'P2', 'P3', 'P4'], a: 2 },
      { q: "Konus qancha vaqt ichida ko'tarilishi kerak?", o: ['1–2 s', '5–10 s', '30 s', '1 daqiqa'], a: 1 },
      { q: "Mustahkamlikni pasaytirmasdan harakatchanlikni oshirishning to'g'ri yo'li qaysi?", o: ["Suv qo'shish", "Plastifikator qo'shish", "Qum miqdorini kamaytirish", 'Konusni tezroq ko\'tarish'], a: 1 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fC = VL.field.range(P, 'Sement miqdori, kg/m³:', { min: 250, max: 500, step: 10, value: 350 });
      const fW = VL.field.range(P, 'Suv miqdori, l/m³:', { min: 140, max: 240, step: 1, value: 185 });
      const fPl = VL.field.select(P, "Qo'shimcha", [['0', "Qo'shimchasiz"], ['0.08', 'Plastifikator S-3 (0,5%)'], ['0.2', 'Superplastifikator (PCE, 1%)']], '0');
      const fD = VL.field.select(P, "Yirik to'ldiruvchi Dmax", [['10', '5–10 mm'], ['20', '5–20 mm'], ['40', '5–40 mm']], 20);
      const wcOut = VL.h('div', { class: 'hint' }); P.append(wcOut);
      const updWC = () => (wcOut.innerHTML = `S/S = ${VL.fmt(+fW.value / +fC.value, 2)}`);
      [fC, fW].forEach(e => e.addEventListener('input', updWC)); updWC();

      const rStep = L.readout('Bosqich', ''), rLayer = L.readout('Qatlam', ''), rHits = L.readout('Zarbalar', ''), rS = L.readout("Cho'kish", 'sm');
      const chart = new VL.Chart(L.chart, { xLabel: 'Suv miqdori, l/m³', yLabel: "Cho'kish, sm", xMin: 140, xMax: 240, yMax: 28 });
      const trials = [];
      let st;

      const steps = new VL.Steps(P, [
        { label: "Konus va taglikni namlab o'rnatish", run: done => { lockAll(true); compute(); st.coneLift = 120; VL.tween(1.0, t => (st.coneLift = 120 * (1 - VL.ease(t))), () => { st.wet = 1; rStep.set("O'rnatildi"); done(); }); } },
        { label: "3 qatlamda to'ldirish, har birini 25 marta zichlash", run: done => { VL.sfx.play('pour'); fillLayers(done); } },
        { label: 'Ortiqchasini kesib tekislash', run: done => { st.strike = 0; VL.tween(1.2, t => { st.strike = t; st.fill = 315 - 15 * t; }, () => { st.strike = -1; st.fill = 300; rStep.set('Tekislandi'); done(); }); } },
        { label: "Konusni vertikal ko'tarish (5–10 s)", run: liftCone },
        { label: "Cho'kishni o'lchash", run: measure },
      ], () => { bNew.disabled = false; });
      const bNew = VL.field.button(P, '↻ Yangi sinov (parametrlarni o\'zgartirib)', newTrial, 'primary');

      function lockAll(on) { [fC, fW, fPl, fD].forEach(e => (e.disabled = on)); }

      function newTrial() {
        st = { fill: 0, coneLift: 120, coneDX: 0, lifted: false, t: 0, rod: null, strike: -1, measure: 0, wet: 0, s: 0,
          speck: VL.speckles(420, ['#57534e', '#78716c', '#a8a29e', '#44403c', '#d6d3d1'], 0.8, 3) };
        steps.reset(); lockAll(false); bNew.disabled = true;
        rStep.set('Tayyor'); rLayer.set('0 / 3'); rHits.set('0'); rS.set('—');
        L.note('');
      }

      function compute() {
        const C = +fC.value, W = +fW.value, pl = +fPl.value, D = +fD.value;
        const W0 = { 10: 175, 20: 165, 40: 150 }[D] + Math.max(0, C - 400) * 0.06;
        st.s = VL.clamp((W * (1 + pl) - W0) * 2.5 + VL.gauss(0, 5), 0, 265);   // mm
        st.wc = W / C;
      }

      function fillLayers(done) {
        VL.sequence([0, 1, 2], (layer, i, next) => {
          rLayer.set(`${layer + 1} / 3`); rStep.set("To'ldirish");
          const from = layer * 100, to = layer === 2 ? 315 : (layer + 1) * 100;
          VL.tween(0.8, t => (st.fill = from + (to - from) * t), () => {
            rStep.set('Zichlash');
            let hits = 0;
            st.rod = { phase: 0, x: 0, depth: layer === 0 ? 100 : 100 + 20 };
            VL.tween(3.0, t => {
              const n = Math.min(25, Math.floor(t * 25) + 1);
              if (n !== hits) { hits = n; rHits.set(`${n} / 25`); st.rod.x = VL.rand(-0.7, 0.7); }
              st.rod.phase = (t * 25) % 1;
            }, () => { st.rod = null; next(); });
          });
        }, () => { rStep.set("To'ldirildi"); done(); });
      }

      function liftCone(done) {
        rStep.set("Ko'tarilmoqda");
        st.lifted = true;
        VL.tween(2.2, t => { st.coneLift = 380 * VL.ease(t); st.t = VL.ease(VL.clamp(t * 1.3 - 0.15, 0, 1)); }, () => {
          const off = -(Math.max(CONE.rb + st.s * 0.75, 130) + 140);
          VL.tween(1.2, t => { st.coneDX = off * VL.ease(t); st.coneLift = 380 * (1 - VL.ease(t)); }, () => { rStep.set("Cho'kdi"); done(); });
        });
      }

      function measure(done) {
        rStep.set("O'lchanmoqda");
        VL.tween(1.5, t => (st.measure = t), () => {
          const cm = Math.round(st.s / 5) / 2;   // 0,5 sm aniqlikda
          const [mk, use] = markOf(cm);
          rS.set(cm, 1); rStep.set('Tayyor');
          trials.push({ C: +fC.value, W: +fW.value, wc: st.wc, pl: fPl.options[fPl.selectedIndex].text, D: fD.options[fD.selectedIndex].text, cm, mk, use, pln: +fPl.value });
          if (st.s > 200 && st.wc > 0.62) L.note("⚠ Qorishmadan suv ajralib chiqmoqda (sedimentatsiya) — suv miqdori haddan tashqari ko'p.", 'warn');
          else if (cm < 1) L.note('Qorishma qattiq: konus cho\'kishi < 1 sm. Vebe usulida sinash tavsiya etiladi.', 'warn');
          else L.note(`✔ Cho'kish ${VL.fmt(cm, 1)} sm — harakatchanlik markasi <b>${mk}</b>.`, 'ok');
          renderResults(); done();
        });
      }

      VL.loop(frame);
      newTrial();
      renderResults();

      function frame() { draw(); drawChart(); }

      function draw() {
        const { ctx, w, h } = VL.fit(L.scene);
        VL.sceneBg(ctx, w, h);
        const k = Math.min((h - 60) / 700, (w - 30) / 1000);
        const cx = w / 2 + 120 * k, base = h - 34;
        const X = mm => cx + mm * k, Y = mm => base - mm * k;
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, base + 8, w, h);
        VL.metal(ctx, X(-350), base, 700 * k, 8, true);
        if (st.wet) { ctx.fillStyle = 'rgba(59,130,246,.15)'; ctx.fillRect(X(-350), base - 1, 700 * k, 2); }

        // beton qorishma
        if (st.fill > 0) {
          ctx.save();
          ctx.beginPath();
          if (!st.lifted) {
            const lv = Math.min(st.fill, 315), rAt = y => CONE.rb - (CONE.rb - CONE.rt) * Math.min(y, 300) / 300;
            ctx.moveTo(X(-CONE.rb), Y(0)); ctx.lineTo(X(-rAt(lv)), Y(lv));
            if (lv > 300) ctx.quadraticCurveTo(X(0), Y(lv + 18), X(rAt(lv)), Y(lv)); else ctx.lineTo(X(rAt(lv)), Y(lv));
            ctx.lineTo(X(CONE.rb), Y(0));
          } else {
            const s = st.s * st.t, H = 300 - s, rt = CONE.rt + s * 0.45, rb = CONE.rb + s * 0.75, bulge = 8 + s * 0.12;
            ctx.moveTo(X(-rb), Y(0));
            ctx.quadraticCurveTo(X(-(rb + rt) / 2 - bulge), Y(H * 0.45), X(-rt), Y(H));
            ctx.quadraticCurveTo(X(0), Y(H + 8), X(rt), Y(H));
            ctx.quadraticCurveTo(X((rb + rt) / 2 + bulge), Y(H * 0.45), X(rb), Y(0));
            if (st.s > 200 && st.wc > 0.62 && st.t > 0.9) {
              ctx.save(); ctx.fillStyle = 'rgba(56,189,248,.35)';
              ctx.beginPath(); ctx.ellipse(cx, base - 1, (rb + 50) * k, 5, 0, 0, 7); ctx.fill(); ctx.restore();
            }
          }
          ctx.closePath();
          const g = ctx.createLinearGradient(0, Y(320), 0, base);
          g.addColorStop(0, '#9ca3af'); g.addColorStop(1, '#6b7280');
          ctx.fillStyle = g; ctx.fill();
          ctx.clip();
          VL.drawSpeckles(ctx, X(-400), Y(330), 800 * k, 330 * k, st.speck, k * 2.2);
          ctx.restore();
          ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1; ctx.stroke();
          // qatlam chegaralari
          if (!st.lifted) {
            ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255,255,255,.5)';
            for (const lv of [100, 200]) if (st.fill > lv) { ctx.beginPath(); ctx.moveTo(X(-90), Y(lv)); ctx.lineTo(X(90), Y(lv)); ctx.stroke(); }
            ctx.setLineDash([]);
          }
        }

        // konus
        const ox = st.coneDX, oy = st.coneLift;
        const cX = mm => X(mm + ox), cY = mm => Y(mm + oy);
        ctx.lineWidth = 3; ctx.strokeStyle = '#334155';
        ctx.beginPath(); ctx.moveTo(cX(-CONE.rb), cY(0)); ctx.lineTo(cX(-CONE.rt), cY(300)); ctx.moveTo(cX(CONE.rb), cY(0)); ctx.lineTo(cX(CONE.rt), cY(300)); ctx.stroke();
        ctx.fillStyle = st.fill > 0 && !st.lifted ? 'rgba(148,163,184,.25)' : 'rgba(203,213,225,.55)';
        ctx.beginPath(); ctx.moveTo(cX(-CONE.rb), cY(0)); ctx.lineTo(cX(-CONE.rt), cY(300)); ctx.lineTo(cX(CONE.rt), cY(300)); ctx.lineTo(cX(CONE.rb), cY(0)); ctx.closePath(); ctx.fill();
        ctx.lineWidth = 4;
        for (const sgn of [-1, 1]) {
          ctx.beginPath(); ctx.moveTo(cX(sgn * CONE.rb), cY(2)); ctx.lineTo(cX(sgn * (CONE.rb + 40)), cY(2)); ctx.stroke();       // oyoqlari
          ctx.beginPath(); ctx.arc(cX(sgn * 78), cY(200), 18 * k, sgn < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, sgn < 0 ? Math.PI * 1.5 : Math.PI * 0.5); ctx.stroke(); // tutqichlar
        }

        // zichlash sterjeni
        if (st.rod) {
          const lv = Math.min(st.fill, 300), depth = st.rod.depth * Math.sin(st.rod.phase * Math.PI);
          const rx = X(st.rod.x * 40), tip = Y(lv - depth);
          ctx.strokeStyle = '#1e293b'; ctx.lineWidth = Math.max(3, 16 * k);
          ctx.beginPath(); ctx.moveTo(rx, tip); ctx.lineTo(rx, tip - 600 * k); ctx.stroke();
        }
        if (st.strike >= 0) {
          const sx = X(-140 + 280 * st.strike);
          ctx.strokeStyle = '#1e293b'; ctx.lineWidth = Math.max(3, 16 * k);
          ctx.beginPath(); ctx.moveTo(sx - 60 * k, Y(302)); ctx.lineTo(sx + 300 * k, Y(330)); ctx.stroke();
        }

        // o'lchash
        if (st.measure > 0) {
          const H = 300 - st.s, t = st.measure;
          ctx.strokeStyle = '#b45309'; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(X(ox - CONE.rt), Y(300)); ctx.lineTo(X(ox - CONE.rt + (Math.abs(ox) + 160) * Math.min(1, t * 1.6)), Y(300)); ctx.stroke();
          if (t > 0.6) {
            const tt = (t - 0.6) / 0.4;
            ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2; ctx.fillStyle = '#dc2626';
            const yTop = Y(300), yBot = Y(300 - st.s * tt);
            ctx.beginPath(); ctx.moveTo(X(0), yTop); ctx.lineTo(X(0), yBot); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(X(0) - 5, yBot - 7); ctx.lineTo(X(0) + 5, yBot - 7); ctx.lineTo(X(0), yBot); ctx.fill();
            if (tt >= 1) {
              ctx.font = 'bold 15px system-ui'; ctx.textAlign = 'left';
              ctx.fillText(`s = ${VL.fmt(Math.round(st.s / 5) / 2, 1)} sm`, X(0) + 10, (yTop + Y(H)) / 2 + 5);
            }
          }
        }
        ctx.fillStyle = '#475569'; ctx.font = '11px system-ui'; ctx.textAlign = 'left';
        ctx.fillText('Taglik 700×700 mm · Konus 100/200×300 mm', 10, 18);
      }

      function drawChart() {
        chart.reset();
        const groups = {};
        for (const t of trials) (groups[t.pl] = groups[t.pl] || []).push([t.W, t.cm]);
        Object.entries(groups).forEach(([k, d], i) => chart.add({ data: d.sort((a, b) => a[0] - b[0]), color: VL.COLORS[i], label: k, points: true, width: 1.5 }));
        const bands = [[1, 4, 'P1'], [5, 9, 'P2'], [10, 15, 'P3'], [16, 20, 'P4'], [21, 28, 'P5']];
        bands.forEach(([a, b], i) => chart.zones.push({ poly: [[140, a], [240, a], [240, b + 0.99], [140, b + 0.99]], fill: i % 2 ? 'rgba(37,99,235,.06)' : 'rgba(22,163,74,.06)' }));
        bands.forEach(([a, , n]) => chart.lines.push({ x0: 140, y0: a, x1: 140, y1: a, label: n, color: '#64748b' }));
        chart.draw();
      }

      function renderResults() {
        const rows = trials.map((t, i) => [i + 1, t.C, t.W, VL.fmt(t.wc, 2), t.pl, t.D, `<b>${VL.fmt(t.cm, 1)}</b>`, `<b>${t.mk}</b>`, t.use]);
        let html = '<h3>Sinovlar jadvali</h3>' + VL.table(['№', 'S, kg/m³', 'Suv, l/m³', 'S/S', "Qo'shimcha", 'Dmax', "Cho'kish, sm", 'Marka', "Qo'llanish sohasi"],
          rows.length ? rows : [['—', '—', '—', '—', '—', '—', '—', '—', "Bosqichlarni ketma-ket bajaring"]]);
        let summary = '';
        if (trials.length) {
          const last = trials.at(-1);
          summary = `Cho'kish ${VL.fmt(last.cm, 1)} sm, marka ${last.mk} (${trials.length} ta sinov)`;
          html += `<div class="verdict ok"><b>Xulosa:</b> Oxirgi sinovda beton qorishmasining konus cho'kishi <b>${VL.fmt(last.cm, 1)} sm</b>,
            harakatchanlik markasi <b>${last.mk}</b> (GOST 7473). Tavsiya etilgan qo'llanish: ${last.use}.
            ${trials.length > 1 ? "Grafikdan ko'rinib turibdiki, suv miqdori oshgani sari cho'kish ortadi; plastifikator esa xuddi shu suv miqdorida cho'kishni oshiradi." : "Turli suv miqdori va qo'shimchalar bilan bir nechta sinov o'tkazib, bog'liqlik grafigini quring."}</div>`;
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
