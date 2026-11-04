'use strict';
/* 5-ish. G'ishtning siqilishdagi mustahkamligi va markasi (GOST 8462-85, GOST 530-2012) */
(function () {
  const GRADES = [[300, 30, 25], [250, 25, 20], [200, 20, 17.5], [175, 17.5, 15], [150, 15, 12.5], [125, 12.5, 10], [100, 10, 7.5], [75, 7.5, 5]];
  const TYPES = {
    solid: { name: "Keramik g'isht (to'liq)", R: 21, color: ['#c2410c', '#9a3412'], holes: false },
    hollow: { name: "Keramik g'isht (g'ovak)", R: 15.5, color: ['#ea580c', '#9a3412'], holes: true },
    silicate: { name: "Silikat g'isht", R: 17.5, color: ['#e7e5e4', '#a8a29e'], holes: false },
  };
  const QUAL = { good: ['Yaxshi pishirilgan / avtoklavlangan', 1.12], mid: ["O'rtacha", 1.0], bad: ['Chala pishgan (nuqsonli)', 0.6] };
  const N = 5;

  VL.register({
    id: 'brick', icon: '🧱', cat: 'devor',
    title: "G'ishtning siqilishdagi mustahkamligi va markasi",
    standard: 'GOST 8462-85, GOST 530-2012, GOST 379-2015',
    short: "Ikki yarim g'ishtdan iborat namunalarni pressda sindirib, g'ishtning mustahkamlik markasini (M75–M300) aniqlash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Keramik va silikat g'ishtning siqilishdagi mustahkamligini aniqlash va GOST 530-2012 bo'yicha uning markasini belgilash.</p>
      <h3>Namunalarni tayyorlash</h3>
      <p>Har bir namuna ikkita yarim g'ishtdan iborat bo'lib, ular sement qorishmasi (qalinligi ≤ 5 mm) bilan bir-birining ustiga
      yopishtiriladi. Tayanch yuzalari qorishma bilan tekislanadi. Sinov uchun partiyadan <b>5 ta namuna</b> olinadi.</p>
      <h3>Ish tartibi</h3>
      <ol><li>Namunaning tayanch yuzasi o'lchamlari 1 mm aniqlikda o'lchanadi, yuzasi A hisoblanadi.</li>
      <li>Namuna press plitasining markaziga o'rnatiladi.</li>
      <li>Yuk bir tekis, 20–60 soniyada buzilishga olib keladigan tezlikda (0,2–0,4 MPa/s) oshiriladi.</li>
      <li>Buzuvchi kuch F qayd etiladi.</li></ol>
      <h3>Hisoblash</h3>
      <div class="formula">R = F / A, &nbsp; MPa</div>
      <p>Marka 5 ta namunaning <b>o'rtacha</b> qiymati va <b>eng kichik</b> alohida qiymati bo'yicha belgilanadi — ikkala shart ham bajarilishi kerak.</p>
      <h3>Markalar (siqilish bo'yicha, GOST 530-2012)</h3>
      ${VL.table(['Marka', "O'rtacha R, MPa ≥", 'Eng kichik R, MPa ≥'], GRADES.map(([m, a, b]) => ['M' + m, VL.fmt(a, 1), VL.fmt(b, 1)]))}
      <p class="muted">Eslatma: to'liq marka egilishdagi mustahkamlikni ham hisobga oladi; bu ishda faqat siqilish ko'rib chiqiladi.</p>`,
    quiz: [
      { q: "G'isht markasini aniqlash uchun nechta namuna sinaladi?", o: ['1', '3', '5', '10'], a: 2 },
      { q: "G'isht namunasi siqilishga sinash uchun qanday tayyorlanadi?", o: ["Butun g'isht qirrasiga qo'yiladi", "Ikki yarim g'isht qorishma bilan ustma-ust yopishtiriladi", "G'isht kukunga aylantiriladi", "Kub kesib olinadi"], a: 1 },
      { q: "M150 markali g'isht uchun o'rtacha mustahkamlik kamida qancha bo'lishi kerak?", o: ['10 MPa', '12,5 MPa', '15 MPa', '150 MPa'], a: 2 },
      { q: "Marka qaysi ko'rsatkichlar bo'yicha belgilanadi?", o: ['Faqat maksimal qiymat', "O'rtacha va eng kichik qiymat", 'Faqat eng kichik qiymat', 'Faqat zichlik'], a: 1 },
      { q: "Chala pishgan keramik g'isht qanday xususiyatga ega?", o: ['Mustahkamligi yuqori', 'Mustahkamligi va sovuqqa chidamliligi past', "Suv shimmaydi", "Og'irligi ortadi"], a: 1 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fT = VL.field.select(P, "G'isht turi", Object.entries(TYPES).map(([k, t]) => [k, t.name]), 'solid');
      const fQ = VL.field.select(P, 'Ishlab chiqarish sifati', Object.entries(QUAL).map(([k, q]) => [k, q[0]]), 'mid');
      const fRate = VL.field.range(P, 'Yuklash tezligi, MPa/s:', { min: 0.1, max: 1, step: 0.05, value: 0.3, dec: 2 });
      const fSpeed = VL.field.select(P, 'Simulyatsiya tezligi', [['1', '×1'], ['4', '×4'], ['10', '×10']], 10);
      const box = VL.h('div', { class: 'row' }); P.append(box);
      const bPrep = VL.field.button(box, 'Namunalarni tayyorlash', prepare, 'primary');
      const bTest = VL.field.button(box, 'Sinovni boshlash', start, 'accent');
      VL.field.button(box, 'Qayta boshlash', reset);

      const rN = L.readout('Namuna', ''), rF = L.readout('Yuk F', 'kN'), rS = L.readout('Kuchlanish σ', 'MPa'), rT = L.readout('Vaqt', 's');
      const chart = new VL.Chart(L.chart, { xLabel: 'Namuna raqami', yLabel: 'Mustahkamlik R, MPa', xMin: 0.4, xMax: N + 0.6,
        xTicks: Array.from({ length: N }, (_, i) => ({ v: i + 1, label: String(i + 1) })), yMax: 35 });
      const parts = new VL.Particles();
      let st;

      function reset() {
        st = { phase: 'idle', samples: [], i: 0, sig: 0, t: 0, gap: 30, crackT: 0, cracks: null, failT: 0, results: [] };
        parts.clear(); VL.lock(P, false); bPrep.disabled = false; bTest.disabled = true; bTest.textContent = 'Sinovni boshlash';
        rN.set('—'); rF.set(0); rS.set(0); rT.set(0); L.note(''); renderResults();
      }

      function prepare() {
        const t = TYPES[fT.value], q = QUAL[fQ.value][1];
        const Rm = t.R * q;
        st.samples = Array.from({ length: N }, () => {
          const a = 120 + VL.gauss(0, 1), b = 125 + VL.gauss(0, 1.2);
          return { a, b, A: a * b, R: Math.max(2, Rm * (1 + VL.gauss(0, 0.11))) };
        });
        st.i = 0; st.phase = 'ready'; st.gap = 30;
        chart.o.yMax = Math.max(35, Math.ceil(Math.max(...st.samples.map(s => s.R)) * 1.2 / 5) * 5);
        VL.lock(P, true); fSpeed.disabled = false; bPrep.disabled = true; bTest.disabled = false; rN.set(`1 / ${N}`);
        const rate = +fRate.value;
        L.note(rate < 0.2 || rate > 0.4 ? "⚠ Yuklash tezligi tavsiya etilgan 0,2–0,4 MPa/s oralig'idan tashqarida." : `✔ ${N} ta namuna tayyor (2 × yarim g'isht, qorishma bilan tekislangan).`, rate < 0.2 || rate > 0.4 ? 'warn' : 'ok');
      }

      function start() {
        if (st.phase !== 'ready') return;
        VL.sfx.hum(true); st.phase = 'approach'; st.sig = 0; st.t = 0; st.crackT = 0; st.failT = 0;
        st.cracks = VL.makeCracks('brick'); parts.clear();
        bTest.disabled = true; rN.set(`${st.i + 1} / ${N}`);
      }

      VL.loop(frame);
      reset();

      function frame(dt) {
        const s = st.samples[st.i], sp = +fSpeed.value;
        if (st.phase === 'approach') {
          st.gap = Math.max(0, st.gap - 30 * dt / 1.0);
          if (!st.gap) st.phase = 'load';
        } else if (st.phase === 'load') {
          st.t += dt * sp;
          st.sig = Math.min(s.R, st.sig + +fRate.value * dt * sp);
          if (st.sig >= s.R) {
            st.phase = 'fail'; VL.sfx.hum(false); VL.sfx.play('crack');
            const w = L.scene.clientWidth, h = L.scene.clientHeight;
            parts.spawn(w / 2 - 30, h * 0.45, 45, TYPES[fT.value].color[1]);
            parts.spawn(w / 2 + 30, h * 0.45, 45, TYPES[fT.value].color[0]);
          }
        } else if (st.phase === 'fail') {
          st.crackT += dt * 3; st.failT += dt;
          if (st.failT > 1) {
            s.F = s.R * s.A / 1000;
            st.results.push(s); st.i++;
            if (st.i < N) { st.phase = 'ready'; st.gap = 30; st.cracks = null; st.crackT = 0; bTest.disabled = false; bTest.textContent = `${st.i + 1}-namunani sinash`; }
            else st.phase = 'done';
            renderResults();
          }
        }
        if (s && (st.phase === 'load' || st.phase === 'approach')) { rF.set(st.sig * s.A / 1000, 1); rS.set(st.sig, 2); rT.set(st.t, 0); }
        draw(dt); drawChart();
      }

      function drawSpec(ctx, x, y, w, h) {
        const t = TYPES[fT.value];
        const mort = Math.max(3, h * 0.05), hh = (h - mort) / 2;
        for (const yy of [y, y + hh + mort]) {
          const g = ctx.createLinearGradient(x, yy, x, yy + hh);
          g.addColorStop(0, t.color[0]); g.addColorStop(1, t.color[1]);
          ctx.fillStyle = g; ctx.fillRect(x, yy, w, hh);
          ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.strokeRect(x + 0.5, yy + 0.5, w - 1, hh - 1);
          if (t.holes) {
            ctx.fillStyle = 'rgba(0,0,0,.25)';
            for (let i = 1; i < 6; i++) ctx.fillRect(x + w * i / 6 - 2, yy + 4, 4, hh - 8);
          }
        }
        ctx.fillStyle = '#9ca3af'; ctx.fillRect(x - 1, y + hh, w + 2, mort);
        VL.drawCracks(ctx, x, y, w, h, st.cracks, st.crackT, '#57534e');
      }

      function draw(dt) {
        const w = L.scene.clientWidth, h = L.scene.clientHeight;
        const S = Math.max(40, Math.min(w * 0.3, (h - VL.PRESS_RESERVED) * 0.85 / (140 / 125)));
        const { ctx } = VL.fit(L.scene);
        const show = st.phase !== 'idle';
        const r = VL.drawPress(ctx, w, h, { specW: S, specH: S * 140 / 125, gap: show ? st.gap : 30, squeeze: st.sig / 30 * 3,
          drawSpec: show ? drawSpec : null, loading: st.phase === 'load', title: 'P-50 · gidravlik press' });
        if (!show) { ctx.fillStyle = '#475569'; ctx.font = '13px system-ui'; ctx.textAlign = 'center'; ctx.fillText("«Namunalarni tayyorlash» tugmasini bosing", w / 2, r.specY + S / 2); }
        parts.update(dt, r.floorY); parts.draw(ctx);
      }

      function drawChart() {
        chart.reset();
        const res = st.results;
        if (res.length) {
          chart.add({ data: res.map((s, i) => [i + 1, s.R]), color: '#c2410c', points: true, width: 1.5, label: 'Rᵢ' });
          const m = VL.mean(res.map(s => s.R));
          chart.lines.push({ x0: 0.4, y0: m, x1: N + 0.6, y1: m, color: '#2563eb', label: '' });
          chart.marks.push({ x: 0.6, y: m, color: '#2563eb', label: 'R̄ = ' + VL.fmt(m, 1) });
        }
        chart.draw();
      }

      function renderResults() {
        const rows = st.results.map((s, i) => [i + 1, `${VL.fmt(s.a, 0)} × ${VL.fmt(s.b, 0)}`, VL.fmt(s.A / 100, 1), VL.fmt(s.F, 1), `<b>${VL.fmt(s.R, 2)}</b>`]);
        let html = '<h3>Sinov natijalari</h3>' + VL.table(['№', "O'lchamlari a×b, mm", 'A, sm²', 'F, kN', 'R = F/A, MPa'], rows.length ? rows : [['—', '—', '—', '—', '—']]);
        let summary = '';
        if (st.results.length === N) {
          const Rs = st.results.map(s => s.R), Rm = VL.mean(Rs), Rmin = Math.min(...Rs);
          const g = GRADES.find(([, a, b]) => Rm >= a && Rmin >= b);
          summary = `R̄ = ${VL.fmt(Rm, 1)} MPa, Rmin = ${VL.fmt(Rmin, 1)} MPa → ${g ? 'M' + g[0] : 'markasiz'}`;
          html += `<div class="calc"><p>O'rtacha mustahkamlik: <b>R̄ = ${VL.fmt(Rm, 2)} MPa</b>; eng kichik qiymat: <b>R<sub>min</sub> = ${VL.fmt(Rmin, 2)} MPa</b>;
            variatsiya koeffitsiyenti v = ${VL.fmt(VL.std(Rs) / Rm * 100, 1)}%</p></div>
            <div class="verdict ${g && g[0] >= 100 ? 'ok' : 'bad'}"><b>Xulosa:</b> ${g
              ? `${TYPES[fT.value].name} siqilishdagi mustahkamlik bo'yicha <b>M${g[0]}</b> markasiga mos keladi (R̄ ≥ ${VL.fmt(g[1], 1)} MPa, R<sub>min</sub> ≥ ${VL.fmt(g[2], 1)} MPa). ${g[0] >= 100 ? "Yuk ko'taruvchi devorlar uchun yaroqli." : "Faqat yuk ko'tarmaydigan devorlar uchun."}`
              : "G'isht mustahkamligi eng past M75 markasi talablariga ham javob bermaydi — partiya <b>yaroqsiz</b>."}</div>`;
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
