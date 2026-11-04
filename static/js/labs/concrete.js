'use strict';
/* 1-ish. Betonning siqilishdagi mustahkamligi (GOST 10180-2012) */
(function () {
  const CLASSES = [7.5, 10, 12.5, 15, 20, 22.5, 25, 27.5, 30, 35, 40, 45, 50, 55, 60];
  const MARK = { 7.5: 'M100', 10: 'M150', 12.5: 'M150', 15: 'M200', 20: 'M250', 22.5: 'M300', 25: 'M350', 27.5: 'M350', 30: 'M400', 35: 'M450', 40: 'M550', 45: 'M600', 50: 'M700', 55: 'M750', 60: 'M800' };
  const ALPHA = { 100: 0.95, 150: 1.0, 200: 1.05 };
  const KT = 0.778;   // B = R·(1 − 1,64·0,135)
  const N = 3;

  VL.register({
    id: 'concrete', icon: '⬛', cat: 'beton',
    title: "Betonning siqilishdagi mustahkamligi",
    standard: 'GOST 10180-2012, GOST 18105-2018 · ASTM C39',
    short: "Beton kub namunalarini gidravlik pressda sindirib, siqilishdagi mustahkamlik va B sinfini aniqlash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Og'ir beton namunalarining siqilishdagi mustahkamligini aniqlash va betonning mustahkamlik sinfini (B) belgilash.</p>
      <h3>Jihozlar</h3>
      <ul><li>Gidravlik press (PGM-1000, 1000 kN), aniqlik sinfi 1;</li>
      <li>Kub shaklidagi qoliplar 100, 150, 200 mm;</li><li>Shtangensirkul, chizg'ich;</li><li>Normal qotish kamerasi (20±2 °C, namlik ≥ 95%).</li></ul>
      <h3>Ish tartibi</h3>
      <ol><li>Bir xil tarkibli betondan kamida 3 ta namunadan iborat seriya tayyorlanadi.</li>
      <li>Namunalar belgilangan muddatgacha (odatda 28 sutka) qotiriladi.</li>
      <li>Ishchi yuzalarining o'lchamlari 1 mm aniqlikda o'lchanadi.</li>
      <li>Namuna press plitasining markaziga qoliplash tomoni yon tomonga qaratib o'rnatiladi.</li>
      <li>Namuna buzilguncha <b>0,6 ± 0,2 MPa/s</b> tezlikda uzluksiz yuklanadi va buzuvchi kuch F aniqlanadi.</li></ol>
      <h3>Hisoblash formulalari</h3>
      <div class="formula">R = α · F / A</div>
      <p>bu yerda F — buzuvchi kuch, N; A — ishchi kesim yuzasi, mm²; α — asosiy o'lchamdagi (150 mm) namunaga o'tkazish masshtab koeffitsiyenti.</p>
      <div class="formula">B = R̄ · (1 − 1,64 · v) ≈ 0,778 · R̄ &nbsp; (v = 13,5%)</div>
      <p>Betonning taxminiy mustahkamligi Skramtayev–Bolomey formulasi bilan:
      <span class="formula inline">R₂₈ = A · Rс · (S/S⁻¹ − 0,5)</span>, vaqt bo'yicha o'sishi:
      <span class="formula inline">Rₙ = R₂₈ · lg n / lg 28</span>.</p>
      <h3>Masshtab koeffitsiyentlari (GOST 10180)</h3>
      ${VL.table(['Kub qirrasi, mm', '100', '150', '200'], [['α', '0,95', '1,00', '1,05']])}
      <h3>Sinf va marka muvofiqligi</h3>
      ${VL.table(['Sinf', 'B15', 'B20', 'B22,5', 'B25', 'B30', 'B35', 'B40'], [['Marka', 'M200', 'M250', 'M300', 'M350', 'M400', 'M450', 'M550']])}`,
    quiz: [
      { q: "GOST 10180 bo'yicha siqilishga sinashda yuklash tezligi qancha bo'lishi kerak?", o: ['0,05 MPa/s', '0,6 ± 0,2 MPa/s', '5 MPa/s', 'Tezlik ahamiyatsiz'], a: 1 },
      { q: "Asosiy (bazaviy) namuna o'lchami qaysi?", o: ['100×100×100 mm', '150×150×150 mm', '200×200×200 mm', 'Ø100×200 silindr'], a: 1 },
      { q: "Suv-sement nisbati (S/S) oshirilsa, beton mustahkamligi qanday o'zgaradi?", o: ['Ortadi', "O'zgarmaydi", 'Kamayadi', 'Avval ortib, keyin kamayadi'], a: 2 },
      { q: "100 mm li kub uchun masshtab koeffitsiyenti α nechaga teng?", o: ['0,85', '0,95', '1,00', '1,05'], a: 1 },
      { q: "Beton sinfi B25 nimani bildiradi?", o: ["O'rtacha mustahkamlik 25 MPa", "95% ta'minlanganlik bilan kafolatlangan mustahkamlik 25 MPa", '25 sutkalik mustahkamlik', 'Zichlik 2500 kg/m³'], a: 1 },
    ],

    mount(L) {
      const P = L.params;
      const fCem = VL.field.select(P, 'Sement markasi', [['30', 'M300 (Rс = 30 MPa)'], ['40', 'M400 (Rс = 40 MPa)'], ['50', 'M500 (Rс = 50 MPa)']], 40);
      const fWC = VL.field.range(P, 'Suv-sement nisbati S/S:', { min: 0.35, max: 0.75, step: 0.01, value: 0.5, dec: 2 });
      const fAgg = VL.field.select(P, "To'ldiruvchi sifati", [['hi', 'Yuqori sifatli (A = 0,65)'], ['mid', 'Oddiy (A = 0,60)'], ['lo', 'Past sifatli (A = 0,55)']], 'mid');
      const fAge = VL.field.select(P, 'Namuna yoshi', [3, 7, 14, 28, 90].map(v => [v, v + ' sutka']), 28);
      const fCure = VL.field.select(P, 'Qotish sharoiti', [['norm', 'Normal (20 °C, 95% namlik)'], ['dry', 'Quruq havoda'], ['steam', "Bug'lab ishlov berilgan"]], 'norm');
      const fSize = VL.field.select(P, "Kub o'lchami", [['100', '100×100×100 mm'], ['150', '150×150×150 mm'], ['200', '200×200×200 mm']], 150);
      const fRate = VL.field.range(P, 'Yuklash tezligi, MPa/s:', { min: 0.2, max: 1.5, step: 0.05, value: 0.6, dec: 2 });
      const fTarget = VL.field.select(P, 'Loyihaviy sinf', [15, 20, 22.5, 25, 30, 35, 40].map(b => [b, 'B' + VL.fmtTick(b)]), 25);
      const fSpeed = VL.field.select(P, 'Simulyatsiya tezligi', [['1', '×1 (real vaqt)'], ['5', '×5'], ['15', '×15']], 5);
      const box = VL.h('div', { class: 'row' }); P.append(box);
      const bPrep = VL.field.button(box, 'Namunalarni tayyorlash', prepare, 'primary');
      const bTest = VL.field.button(box, 'Sinovni boshlash', startTest, 'accent');
      const bReset = VL.field.button(box, 'Qayta boshlash', reset);
      bTest.disabled = true;

      const rN = L.readout('Namuna', ''), rF = L.readout('Yuk F', 'kN'), rS = L.readout('Kuchlanish σ', 'MPa'),
        rE = L.readout('Deformatsiya ε', '‰'), rT = L.readout('Vaqt', 's');
      const chart = new VL.Chart(L.chart, { xLabel: 'Nisbiy deformatsiya ε, ‰', yLabel: 'Kuchlanish σ, MPa', xMax: 4, yMax: 50 });
      const parts = new VL.Particles();
      let st;

      function reset() {
        VL.token++; const tok = VL.token;   // eski animatsiyalarni to'xtatmaslik uchun loop qayta ishga tushiriladi
        st = { phase: 'idle', samples: [], i: 0, sig: 0, eps: 0, t: 0, gap: 30, crackT: 0, cracks: null, failT: 0, results: [], series: null };
        parts.clear(); chart.reset(); VL.lock(P, false);
        bPrep.disabled = false; bTest.disabled = true;
        L.note(''); renderResults();
        rN.set('—'); rF.set(0); rS.set(0); rE.set(0, 2); rT.set(0);
        VL.loop(frame);
        return tok;
      }

      function baseStrength() {
        const Rc = +fCem.value, cw = 1 / +fWC.value;
        const A = { hi: 0.65, mid: 0.6, lo: 0.55 }[fAgg.value], A1 = { hi: 0.43, mid: 0.4, lo: 0.37 }[fAgg.value];
        const R28 = cw <= 2.5 ? A * Rc * (cw - 0.5) : A1 * Rc * (cw + 0.5);
        let k = Math.log10(+fAge.value) / Math.log10(28);
        if (fCure.value === 'dry') k *= 0.82;
        if (fCure.value === 'steam') k = Math.max(k, 0.72) * 0.93;
        return Math.max(3, R28 * k);
      }

      function prepare() {
        const a = +fSize.value, alpha = ALPHA[a], rate = +fRate.value;
        const rateK = 1 + 0.05 * Math.log2(rate / 0.6);
        const R = baseStrength();
        st.samples = Array.from({ length: N }, () => {
          const a1 = a + VL.gauss(0, 0.4), a2 = a + VL.gauss(0, 0.4);
          const Rraw = R * (1 + VL.gauss(0, 0.055)) * rateK / alpha;   // namunaning haqiqiy (o'lchamga bog'liq) mustahkamligi
          return { a1, a2, A: a1 * a2, Rraw, speck: VL.speckles(160, ['#57534e', '#78716c', '#a8a29e', '#d6d3d1', '#44403c']) };
        });
        st.i = 0; st.phase = 'ready'; st.gap = 30;
        chart.o.yMax = Math.ceil(Math.max(...st.samples.map(s => s.Rraw)) * 1.25 / 10) * 10;
        VL.lock(P, true); fSpeed.disabled = false;
        bPrep.disabled = true; bTest.disabled = false;
        rN.set(`1 / ${N}`);
        L.note(rate < 0.4 || rate > 0.8
          ? '⚠ Yuklash tezligi GOST 10180 talabidan (0,6 ± 0,2 MPa/s) tashqarida — natija ishonchsiz bo\'ladi!'
          : `✔ ${N} ta namuna tayyor. Har bir namunani navbat bilan sinang.`, rate < 0.4 || rate > 0.8 ? 'warn' : 'ok');
      }

      function startTest() {
        if (st.phase !== 'ready') return;
        const s = st.samples[st.i];
        VL.sfx.hum(true); st.phase = 'approach'; st.sig = 0; st.eps = 0; st.t = 0; st.crackT = 0; st.failT = 0;
        st.cracks = VL.makeCracks('cube'); parts.clear();
        st.series = chart.add({ color: VL.COLORS[st.i], label: `${st.i + 1}-namuna` });
        bTest.disabled = true;
        rN.set(`${st.i + 1} / ${N}`);
        s.Fmax = 0;
      }

      function frame(dt) {
        const sp = +fSpeed.value, rate = +fRate.value, s = st.samples[st.i];
        if (st.phase === 'approach') {
          st.gap = Math.max(0, st.gap - 30 * dt / 1.2);
          if (st.gap <= 0) st.phase = 'load';
        } else if (st.phase === 'load') {
          st.t += dt * sp;
          st.sig = Math.min(s.Rraw, st.sig + rate * dt * sp);
          const x = 1 - Math.sqrt(Math.max(0, 1 - st.sig / s.Rraw));
          st.eps = x * 0.002;
          if (st.sig >= s.Rraw) st.phase = 'post';
          push();
        } else if (st.phase === 'post') {
          st.t += dt * sp;
          st.eps += 0.0015 / 1.2 * dt;
          st.sig = s.Rraw * (1 - 0.15 * (st.eps - 0.002) / 0.0015);
          push();
          if (st.eps >= 0.0035) {
            st.phase = 'fail'; VL.sfx.hum(false); VL.sfx.play('crack');
            const sx = L.scene.clientWidth / 2;
            parts.spawn(sx - 40, L.scene.clientHeight * 0.45, 40, '#57534e');
            parts.spawn(sx + 40, L.scene.clientHeight * 0.45, 40, '#78716c');
          }
        } else if (st.phase === 'fail') {
          st.crackT += dt * 2.5; st.failT += dt;
          st.sig = Math.max(0, st.sig - s.Rraw * dt * 3);
          if (st.failT > 1.1) finishSample();
        }
        if (s && st.phase !== 'idle') {
          rF.set(st.sig * s.A / 1000, 1); rS.set(st.sig, 2); rE.set(st.eps * 1000, 2); rT.set(st.t, 0);
        }
        draw(dt);
        chart.draw();
      }

      function push() {
        const d = st.series.data, s = st.samples[st.i];
        d.push([st.eps * 1000, st.sig]);
        s.Fmax = Math.max(s.Fmax, st.sig * s.A / 1000);
      }

      function finishSample() {
        const s = st.samples[st.i], alpha = ALPHA[+fSize.value];
        s.R = alpha * s.Fmax * 1000 / s.A;
        chart.marks.push({ x: 2, y: s.Rraw, color: VL.COLORS[st.i], label: VL.fmt(s.Fmax, 0) + ' kN', align: st.i % 2 ? 'left' : 'right' });
        st.results.push(s);
        st.i++;
        if (st.i < N) { st.phase = 'ready'; st.gap = 30; st.cracks = null; st.crackT = 0; bTest.disabled = false; bTest.textContent = `${st.i + 1}-namunani sinash`; }
        else { st.phase = 'done'; bTest.textContent = 'Sinovni boshlash'; }
        renderResults();
      }

      function drawCube(ctx, x, y, w, h) {
        const s = st.samples[st.i] || st.samples[st.i - 1];
        const g = ctx.createLinearGradient(x, y, x + w, y + h);
        g.addColorStop(0, '#a8a29e'); g.addColorStop(1, '#78716c');
        ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
        if (s) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); VL.drawSpeckles(ctx, x, y, w, h, s.speck, w / 150); ctx.restore(); }
        ctx.strokeStyle = '#44403c'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        VL.drawCracks(ctx, x, y, w, h, st.cracks, st.crackT);
      }

      function draw(dt) {
        const w = L.scene.clientWidth, h = L.scene.clientHeight;
        const k = { 100: 0.8, 150: 1, 200: 1.15 }[+fSize.value];
        const S = Math.max(40, Math.min(w * 0.3, (h - VL.PRESS_RESERVED) * 0.9) * k);
        const { ctx } = VL.fit(L.scene);
        const show = st.phase !== 'idle';
        const r = VL.drawPress(ctx, w, h, {
          specW: S, specH: S, gap: show ? st.gap : 30, squeeze: st.eps * S * 8,
          drawSpec: show ? drawCube : null, loading: st.phase === 'load' || st.phase === 'post',
        });
        if (!show) {
          ctx.fillStyle = '#475569'; ctx.font = '13px system-ui'; ctx.textAlign = 'center';
          ctx.fillText("«Namunalarni tayyorlash» tugmasini bosing", w / 2, r.specY + S / 2);
        }
        parts.update(dt, r.floorY); parts.draw(ctx);
      }

      function renderResults() {
        const a = +fSize.value, alpha = ALPHA[a];
        const rows = st.results.map((s, i) => [i + 1, `${VL.fmt(s.a1, 1)} × ${VL.fmt(s.a2, 1)}`, VL.fmt(s.A, 0), VL.fmt(s.Fmax, 1),
          VL.fmt(s.Fmax * 1000 / s.A, 2), VL.fmt(alpha, 2), `<b>${VL.fmt(s.R, 2)}</b>`]);
        let html = `<h3>Sinov natijalari</h3>` + VL.table(['№', "O'lchamlari, mm", 'A, mm²', 'F<sub>max</sub>, kN', 'F/A, MPa', 'α', 'R, MPa'],
          rows.length ? rows : [['—', '—', '—', '—', '—', '—', '—']]);
        let summary = '';
        if (st.results.length === N) {
          const Rs = st.results.map(s => s.R), Rm = VL.mean(Rs), Sm = VL.std(Rs), v = Sm / Rm * 100;
          const B = Rm * KT, cls = [...CLASSES].reverse().find(c => c <= B);
          const target = +fTarget.value, Rt = target / KT, ok = Rm >= Rt;
          const rate = +fRate.value, rateBad = rate < 0.4 || rate > 0.8;
          summary = `R̄ = ${VL.fmt(Rm, 1)} MPa, B${cls ? VL.fmtTick(cls) : '<7,5'} — ${ok ? 'loyihaga mos' : 'loyihaga mos emas'}`;
          html += `<div class="calc">
            <p>Seriyaning o'rtacha mustahkamligi: <b>R̄ = (${Rs.map(r => VL.fmt(r, 2)).join(' + ')}) / ${N} = ${VL.fmt(Rm, 2)} MPa</b></p>
            <p>O'rtacha kvadratik og'ish: S = ${VL.fmt(Sm, 2)} MPa; variatsiya koeffitsiyenti: v = ${VL.fmt(v, 1)}%</p>
            <p>Haqiqiy sinf (v = 13,5%): B = 0,778 · R̄ = <b>${VL.fmt(B, 1)} MPa → B${cls ? VL.fmtTick(cls) : ' < 7,5'}</b> ${cls ? '(≈ ' + MARK[cls] + ')' : ''}</p>
            <p>Loyihaviy sinf B${VL.fmtTick(target)} uchun talab etiladigan mustahkamlik: Rт = B / 0,778 = ${VL.fmt(Rt, 1)} MPa</p></div>
            <div class="verdict ${ok && !rateBad ? 'ok' : 'bad'}"><b>Xulosa:</b> ${ok
              ? `Betonning o'rtacha mustahkamligi ${VL.fmt(Rm, 1)} MPa talab etilganidan (${VL.fmt(Rt, 1)} MPa) yuqori. Beton loyihaviy B${VL.fmtTick(target)} sinfiga <b>mos keladi</b>.`
              : `Betonning o'rtacha mustahkamligi ${VL.fmt(Rm, 1)} MPa talab etilganidan (${VL.fmt(Rt, 1)} MPa) past. Beton loyihaviy B${VL.fmtTick(target)} sinfiga <b>mos kelmaydi</b>. S/S ni kamaytirish yoki yuqori markali sement ishlatish tavsiya etiladi.`}
              ${rateBad ? '<br>⚠ Yuklash tezligi me\'yordan tashqarida bo\'lgani uchun sinov GOST 10180 talablariga javob bermaydi va takrorlanishi kerak.' : ''}</div>
            <p class="muted">Sinov sharoiti: sement Rс = ${fCem.value} MPa, S/S = ${VL.fmt(+fWC.value, 2)}, yoshi ${fAge.value} sutka, ${fCure.options[fCure.selectedIndex].text.toLowerCase()}, kub ${a} mm, yuklash tezligi ${VL.fmt(rate, 2)} MPa/s.</p>`;
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }

      const lab = this;
      reset();
    },
  });
})();
