'use strict';
/* 3-ish. Qumning donadorlik tarkibi — elak tahlili (GOST 8735-88, GOST 8736-2014) */
(function () {
  const SIEVES = [2.5, 1.25, 0.63, 0.315, 0.16];
  const LABELS = ['2,5', '1,25', '0,63', '0,315', '0,16'];
  const ZONE_MIN = [0, 5, 20, 35, 80], ZONE_MAX = [20, 45, 70, 90, 100];   // tavsiya etilgan to'liq qoldiqlar, %
  const SANDS = {
    barkhan: { name: 'Barxan (cho\'l) qumi', mk: 1.15, color: '#f5d48b' },
    quarry: { name: 'Karyer qumi (mayda)', mk: 1.8, color: '#e5b467' },
    river: { name: 'Daryo qumi (o\'rta)', mk: 2.35, color: '#c9a063' },
    crushed: { name: 'Maydalangan qum (yirik)', mk: 2.9, color: '#a8876a' },
  };

  function sandClass(mk) {
    if (mk > 3.5) return 'juda yirik';
    if (mk > 3.0) return 'yirikligi oshirilgan';
    if (mk > 2.5) return 'yirik';
    if (mk > 2.0) return "o'rta";
    if (mk > 1.5) return 'mayda';
    if (mk > 1.0) return 'juda mayda';
    if (mk > 0.7) return 'ingichka';
    return 'juda ingichka';
  }

  /** Lognormal taqsimot bo'yicha berilgan Mk ga yaqin qum namunasi */
  function makeSand(mkTarget) {
    const sigma = VL.rand(0.6, 0.75), target = mkTarget + VL.gauss(0, 0.06);
    const Acum = mu => SIEVES.map(d => 100 * (1 - VL.Phi((Math.log(d) - mu) / sigma)));
    let lo = -4, hi = 2;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2, mk = Acum(mid).reduce((a, b) => a + b, 0) / 100;
      if (mk > target) hi = mid; else lo = mid;
    }
    const A = Acum((lo + hi) / 2);
    const part = A.map((v, i) => v - (i ? A[i - 1] : 0));
    part.push(100 - A.at(-1));                       // tagdon
    const loss = VL.rand(0.15, 0.6) / 100;          // elashdagi yo'qotish
    return part.map(p => Math.round(p * 10 * (1 - loss) * 10) / 10);
  }

  VL.register({
    id: 'sieve', icon: '⏳', cat: 'devor',
    title: "Qumning donadorlik tarkibi (elak tahlili)",
    standard: 'GOST 8735-88, GOST 8736-2014 · ASTM C136',
    short: "Qum namunasini standart elaklar to'plamida elab, xususiy va to'liq qoldiqlarni, yiriklik modulini aniqlash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Qurilish qumining donadorlik tarkibini aniqlash, yiriklik modulini (Mk) hisoblash, qum guruhini belgilash
      va uning beton uchun yaroqliligini baholash.</p>
      <h3>Jihozlar</h3>
      <ul><li>Standart elaklar to'plami: 2,5; 1,25; 0,63; 0,315; 0,16 mm va tagdon;</li>
      <li>Texnik tarozi (aniqligi 0,1 g);</li><li>Quritish shkafi (105 ± 5 °C);</li><li>Elash mashinasi (vibroelak).</li></ul>
      <h3>Ish tartibi</h3>
      <ol><li>Doimiy massagacha quritilgan, 5 mm li elakdan o'tkazilgan 1000 g qum namunasi tortiladi.</li>
      <li>Namuna eng yirik elak yuqorida bo'lgan elaklar to'plamiga solinadi.</li>
      <li>Elaklar mexanik yoki qo'lda (10–15 daqiqa) silkitiladi.</li>
      <li>Har bir elakdagi qoldiq 0,1 g aniqlikda tortiladi.</li></ol>
      <h3>Hisoblash formulalari</h3>
      <div class="formula">aᵢ = mᵢ / m · 100%</div>
      <p>— xususiy qoldiq (mᵢ — elakdagi qoldiq massasi, m — namuna massasi).</p>
      <div class="formula">Aᵢ = a₂,₅ + a₁,₂₅ + … + aᵢ</div>
      <p>— to'liq qoldiq (berilgan elak va undan yirik barcha elaklardagi xususiy qoldiqlar yig'indisi).</p>
      <div class="formula">Mk = (A₂,₅ + A₁,₂₅ + A₀,₆₃ + A₀,₃₁₅ + A₀,₁₆) / 100</div>
      <h3>Qum guruhlari (GOST 8736-2014)</h3>
      ${VL.table(['Guruh', 'Yirikligi oshirilgan', 'Yirik', "O'rta", 'Mayda', 'Juda mayda', 'Ingichka'],
        [['Mk', '3,0–3,5', '2,5–3,0', '2,0–2,5', '1,5–2,0', '1,0–1,5', '0,7–1,0']])}
      <p>Grafikdagi yashil soha — og'ir beton uchun tavsiya etilgan donadorlik zonasi. Agar egri chiziq zonadan tashqariga chiqsa,
      qumni boyitish (yirik qum qo'shish yoki mayda zarralarni yuvish) talab etiladi.</p>`,
    quiz: [
      { q: 'Elak tahlili uchun qum namunasining massasi qancha olinadi?', o: ['100 g', '500 g', '1000 g', '5000 g'], a: 2 },
      { q: "To'liq qoldiq Aᵢ qanday aniqlanadi?", o: ["Faqat shu elakdagi qoldiq", "Shu elak va undan yirik elaklardagi xususiy qoldiqlar yig'indisi", 'Tagdondagi qoldiq', "Elakdan o'tgan qism"], a: 1 },
      { q: 'Yiriklik moduli Mk = 2,3 bo\'lgan qum qaysi guruhga kiradi?', o: ['Yirik', "O'rta", 'Mayda', 'Juda mayda'], a: 1 },
      { q: 'Mk ni hisoblashda qaysi elakdagi qoldiq hisobga olinmaydi?', o: ['2,5 mm', '0,63 mm', '0,16 mm', 'Tagdon (< 0,16 mm)'], a: 3 },
      { q: "O'zbekistondagi barxan qumlari odatda qanday bo'ladi?", o: ['Juda yirik', "O'rta", 'Juda mayda', 'Shag\'alsimon'], a: 2 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fSand = VL.field.select(P, 'Qum turi', Object.entries(SANDS).map(([k, s]) => [k, s.name]), 'river');
      const rStep = L.readout('Jarayon', ''), rBal = L.readout('Tarozi', 'g'), rTime = L.readout('Elash vaqti', 'daq');
      const setBal = v => { st.bal = v; rBal.set(v, 1); };
      const chart = new VL.Chart(L.chart, { xLabel: "Elak teshiklari o'lchami, mm", yLabel: "To'liq qoldiq A, %", xMin: -0.3, xMax: 4.3, yMax: 100,
        xTicks: LABELS.map((l, i) => ({ v: i, label: l })) });
      let st;

      const steps = new VL.Steps(P, [
        { label: 'Quritilgan namunani tortish (1000 g)', run: weighSample },
        { label: "Namunani elaklar to'plamiga solish", run: done => { VL.sfx.play('pour'); rStep.set('Solinmoqda'); VL.tween(1.0, t => { st.pour = t; st.onBal = 1 - t; setBal(1000 * (1 - t), 1); }, () => { st.onBal = 0; setBal(0, 1); done(); }); } },
        { label: 'Elash mashinasida silkitish (10 daq)', run: done => { VL.sfx.play('shake'); shake(done); } },
        { label: 'Har bir elakdagi qoldiqni tortish', run: weighAll },
        { label: 'Natijalarni hisoblash', run: done => { st.calc = true; renderResults(); rStep.set('Hisoblandi'); done(); } },
      ], () => (bNew.disabled = false));
      const bNew = VL.field.button(P, '↻ Yangi namuna', fresh, 'primary');

      function fresh() {
        const s = SANDS[fSand.value];
        st = { masses: makeSand(s.mk), color: s.color, pour: 0, dist: 0, shakeT: 0, onBal: 0, weighed: [], cur: -1, calc: false };
        steps.reset(); fSand.disabled = false; bNew.disabled = true;
        rStep.set('Tayyor'); setBal(0, 1); rTime.set(0, 0);
        renderResults();
      }
      fSand.addEventListener('change', fresh);

      function weighSample(done) {
        fSand.disabled = true; rStep.set('Tortilmoqda');
        VL.tween(1.2, t => { st.onBal = 1; setBal(1000 * VL.ease(t) + (t < 1 ? VL.rand(-3, 3) : 0), 1); }, () => { setBal(1000, 1); done(); });
      }
      function shake(done) {
        rStep.set('Silkitilmoqda');
        VL.tween(4, t => { st.shakeT = t; st.dist = VL.ease(t); rTime.set(10 * t, 1); }, () => { st.shakeT = 0; rStep.set('Elandi'); done(); });
      }
      function weighAll(done) {
        VL.sequence([0, 1, 2, 3, 4, 5], (i, _, next) => {
          st.cur = i; rStep.set(i < 5 ? `${LABELS[i]} mm elak` : 'Tagdon');
          const m = st.masses[i];
          VL.tween(0.9, t => setBal(m * VL.ease(t) + (t < 1 ? VL.rand(-0.5, 0.5) : 0), 1), () => {
            setBal(m, 1); st.weighed.push(m); renderResults(); setTimeout(next, 250);
          });
        }, () => { st.cur = -1; rStep.set('Tortildi'); done(); });
      }

      function calc() {
        const m = 1000, a = st.masses.slice(0, 5).map(x => x / m * 100);
        const A = a.map((_, i) => a.slice(0, i + 1).reduce((s, x) => s + x, 0));
        const Mk = A.reduce((s, x) => s + x, 0) / 100;
        const lost = m - st.masses.reduce((s, x) => s + x, 0);
        return { a, A, Mk, lost, pan: st.masses[5] / m * 100 };
      }

      VL.loop(frame);
      fresh();

      function frame() { draw(); drawChart(); }

      function draw() {
        const { ctx, w, h } = VL.fit(L.scene);
        VL.sceneBg(ctx, w, h);
        const n = 6, sw = Math.min(w * 0.42, 240), sh = Math.min(34, (h - 110) / (n + 1));
        const cx = w * 0.33 + (st.shakeT > 0 ? Math.sin(st.shakeT * 90) * 4 : 0);
        const top = 26 + sh * 0.6, floorY = top + sh * 0.6 + n * sh + 36;
        // elash mashinasi asosi
        VL.metal(ctx, w * 0.33 - sw * 0.65, floorY - 30, sw * 1.3, 30, true, true);
        ctx.fillStyle = '#e2e8f0'; ctx.font = '10px system-ui'; ctx.textAlign = 'center';
        ctx.fillText('VIBROELAK  ·  50 Hz', w * 0.33, floorY - 11);
        ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, floorY, w, h - floorY);
        // qopqoq
        VL.metal(ctx, cx - sw / 2 - 3, top - sh * 0.6, sw + 6, sh * 0.6, true);
        const total = 1000;
        for (let i = 0; i < n; i++) {
          const y = top + i * sh, isPan = i === 5;
          {
            // elak gardishi
            const g = ctx.createLinearGradient(cx - sw / 2, 0, cx + sw / 2, 0);
            g.addColorStop(0, '#a16207'); g.addColorStop(0.5, '#fde68a'); g.addColorStop(1, '#a16207');
            ctx.fillStyle = isPan ? '#94a3b8' : g;
            ctx.fillRect(cx - sw / 2, y, sw, sh - 2);
            ctx.strokeStyle = '#78350f'; ctx.strokeRect(cx - sw / 2 + 0.5, y + 0.5, sw - 1, sh - 3);
            // to'r
            if (!isPan) { ctx.strokeStyle = 'rgba(30,41,59,.6)'; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(cx - sw / 2 + 4, y + sh - 5); ctx.lineTo(cx + sw / 2 - 4, y + sh - 5); ctx.stroke(); ctx.setLineDash([]); }
            // qum uyumi
            let m = 0;
            if (i === 0) m = total * st.pour * (1 - st.dist) + st.masses[0] * st.dist;
            else m = st.masses[i] * st.dist;
            if (st.cur === i || st.weighed[i] != null) m = 0;
            if (m > 0.5) drawPile(ctx, cx, y + sh - 5, sw * 0.8, Math.min(sh - 8, 4 + (sh - 8) * m / 450), i);
          }
          ctx.fillStyle = st.cur === i ? '#dc2626' : '#1e293b'; ctx.font = (st.cur === i ? 'bold ' : '') + '12px system-ui'; ctx.textAlign = 'left';
          ctx.fillText(isPan ? 'tagdon' : LABELS[i] + ' mm', cx + sw / 2 + 10, y + sh / 2 + 4);
          if (st.weighed[i] != null) { ctx.fillStyle = '#16a34a'; ctx.fillText(`✔ ${VL.fmt(st.weighed[i], 1)} g`, cx + sw / 2 + 66, y + sh / 2 + 4); }
        }
        // tarozi
        const bx = w * 0.82, by = floorY - 40, bw = Math.min(150, w * 0.26);
        VL.metal(ctx, bx - bw / 2, by, bw, 40, true, true);
        ctx.fillStyle = '#0f172a'; VL.rrect(ctx, bx - bw * 0.38, by + 9, bw * 0.76, 22, 4); ctx.fill();
        const val = st.bal || 0;
        ctx.fillStyle = '#4ade80'; ctx.font = 'bold 15px monospace'; ctx.textAlign = 'center';
        ctx.fillText(VL.fmt(val, 1).padStart(7, ' ') + ' g', bx, by + 25);
        VL.metal(ctx, bx - bw * 0.42, by - 8, bw * 0.84, 8, true);
        if (st.onBal > 0 || st.cur >= 0) {
          ctx.fillStyle = '#e2e8f0'; ctx.beginPath(); ctx.ellipse(bx, by - 16, bw * 0.34, 12, 0, 0, Math.PI); ctx.fill();
          ctx.strokeStyle = '#94a3b8'; ctx.stroke();
          const m = st.onBal ? 1000 * st.onBal : st.masses[st.cur];
          if (m > 0.5) drawPile(ctx, bx, by - 14, bw * 0.55, Math.min(24, 3 + m / 40), st.cur >= 0 ? st.cur : 2);
        }
        ctx.fillStyle = '#475569'; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
        ctx.fillText('Texnik tarozi (0,1 g)', bx, floorY + 14);
      }

      function drawPile(ctx, x, yb, w, hgt, i) {
        const shade = ['#8b5e34', '#a87444', '#c08b52', '#d4a463', '#e3bb7a', '#efd29b'][i] || st.color;
        ctx.fillStyle = shade;
        ctx.beginPath(); ctx.moveTo(x - w / 2, yb); ctx.quadraticCurveTo(x, yb - hgt * 2, x + w / 2, yb); ctx.closePath(); ctx.fill();
      }

      function drawChart() {
        chart.reset();
        const lo = ZONE_MIN.map((v, i) => [i, v]), hi = ZONE_MAX.map((v, i) => [i, v]).reverse();
        chart.zones.push({ poly: [...lo, ...hi], fill: 'rgba(22,163,74,.12)', stroke: 'rgba(22,163,74,.6)' });
        if (st.calc) {
          const r = calc();
          chart.add({ data: r.A.map((v, i) => [i, v]), color: '#b45309', width: 2.5, points: true, label: `Mk = ${VL.fmt(r.Mk, 2)}` });
        }
        chart.draw();
      }

      function renderResults() {
        const r = calc();
        const rows = [];
        for (let i = 0; i < 6; i++) {
          const has = st.weighed[i] != null, show = has && st.calc;
          rows.push([i < 5 ? LABELS[i] : '< 0,16 (tagdon)', has ? VL.fmt(st.masses[i], 1) : '…',
            show ? VL.fmt(i < 5 ? r.a[i] : r.pan, 2) : '', show && i < 5 ? `<b>${VL.fmt(r.A[i], 2)}</b>` : '']);
        }
        let html = '<h3>Elak tahlili natijalari</h3>' + VL.table(["Elak teshigi, mm", 'Qoldiq massasi mᵢ, g', 'Xususiy qoldiq aᵢ, %', "To'liq qoldiq Aᵢ, %"], rows);
        let summary = '';
        const selfCheck = VL.h('div', { class: 'selfcheck' });
        if (st.weighed.length === 6 && !st.calc) {
          const inp = VL.h('input', { type: 'number', step: '0.01', placeholder: 'masalan 2,35' });
          const out = VL.h('span');
          selfCheck.append(VL.h('b', null, "O'zingizni tekshiring: "), "jadvaldagi massalar bo'yicha Mk ni hisoblang: Mk = ", inp,
            VL.h('button', { class: 'btn', onclick: () => {
              const v = parseFloat(String(inp.value).replace(',', '.'));
              const ok = Math.abs(v - r.Mk) <= 0.02;
              out.innerHTML = ok ? ' ✔ <b style="color:#16a34a">To\'g\'ri!</b>' : " ✘ <b style='color:#dc2626'>Noto'g'ri</b>, qayta hisoblang (Aᵢ ni yig'ing).";
            } }, 'Tekshirish'), out);
        }
        if (st.calc) {
          const cls = sandClass(r.Mk), inZone = r.A.every((v, i) => v >= ZONE_MIN[i] - 0.01 && v <= ZONE_MAX[i] + 0.01);
          const okBeton = r.Mk >= 1.5 && inZone;
          summary = `Mk = ${VL.fmt(r.Mk, 2)}, qum ${cls}`;
          html += `<div class="calc">
            <p>Yiriklik moduli: <b>Mk = (${r.A.map(v => VL.fmt(v, 2)).join(' + ')}) / 100 = ${VL.fmt(r.Mk, 2)}</b></p>
            <p>Elashdagi yo'qotish: ${VL.fmt(r.lost, 1)} g (${VL.fmt(r.lost / 10, 2)}%) — ${r.lost <= 10 ? "ruxsat etilgan (≤ 1%)" : "me'yordan ortiq, sinovni takrorlang"}</p>
            <p>0,63 mm elakdagi to'liq qoldiq: A₀,₆₃ = ${VL.fmt(r.A[2], 1)}%</p></div>
            <div class="verdict ${okBeton ? 'ok' : 'bad'}"><b>Xulosa:</b> Sinalgan qum yiriklik moduli bo'yicha <b>${cls}</b> guruhiga kiradi (GOST 8736-2014).
            ${okBeton ? "Donadorlik egri chizig'i tavsiya etilgan zonada joylashgan — qum og'ir beton va qorishmalar uchun <b>yaroqli</b>."
              : r.Mk < 1.5 ? "Qum juda mayda: beton uchun sement sarfi ortadi. Yirik (maydalangan) qum bilan boyitish tavsiya etiladi."
              : "Donadorlik egri chizig'i tavsiya etilgan zonadan chiqadi — qumni fraksiyalarga ajratib, boyitish tavsiya etiladi."}</div>`;
        }
        L.results.innerHTML = html;
        L.results.append(selfCheck);
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
