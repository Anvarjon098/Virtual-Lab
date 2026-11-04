'use strict';
/* Sementning egilish va siqilishdagi mustahkamligi, markasi (GOST 310.4-81, GOST 10178-85) */
(function () {
  const CEM = {
    pc400: { name: 'ПЦ 400-Д20', Rc: 44, Rb: 6.3, slag: false },
    pc500: { name: 'ПЦ 500-Д0', Rc: 54, Rb: 7.0, slag: false },
    slag: { name: 'ШПЦ 400 (shlakoportlandsement)', Rc: 43, Rb: 6.1, slag: true },
    old: { name: 'ПЦ 400-Д20 (omborda 6 oy namlikda saqlangan)', Rc: 44 * 0.76, Rb: 6.3 * 0.85, slag: false },
  };
  const AGE = { 3: [0.5, 0.32], 7: [0.7, 0.55], 28: [1, 1] };
  const GRADES = [[600, 6.4, 58.8], [550, 6.1, 53.9], [500, 5.9, 49.0], [400, 5.4, 39.2], [300, 4.4, 29.4]];
  const KB = 1.5 * 100 / (40 * 40 * 40) * 1000;   // R_egil (MPa) = KB · F (kN)
  const AC = 2500;                                  // siqilish yuzasi, mm²

  VL.register({
    id: 'cement', icon: '🧊', cat: 'beton',
    title: 'Sementning mustahkamligi va markasi',
    standard: 'GOST 310.4-81, GOST 10178-85, GOST 30744-2001',
    short: "40×40×160 mm qorishma prizmalarini egilishga, so'ng yarimtalarini siqilishga sinab, sement markasini aniqlash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Sementning faolligini — standart qorishma prizmalarining egilish va siqilishdagi mustahkamligini aniqlash va GOST 10178 bo'yicha
      sement markasini belgilash.</p>
      <h3>Namunalar</h3>
      <p>Qorishma tarkibi — sement : standart qum = <b>1 : 3</b> (massa bo'yicha), S/S = 0,40. 40×40×160 mm o'lchamli
      3 ta prizma qoliplanadi, 1 sutka qolipda, so'ng 27 sutka (20 ± 2 °C) suvda saqlanadi.</p>
      <h3>Ish tartibi</h3>
      <ol><li>Har bir prizma ikki tayanchga (oraliq l = 100 mm) qo'yilib, o'rtasidan egilishga sinaladi (yuklash tezligi 50 ± 10 N/s).</li>
      <li>Hosil bo'lgan 6 ta yarim prizma 40×62,5 mm (A = 25 sm²) plastinkalar orasida siqilishga sinaladi (2 ± 0,5 MPa/s).</li></ol>
      <h3>Hisoblash</h3>
      <div class="formula">R<sub>egil</sub> = 3·F·l / (2·b·h²) = 0,00234 · F &nbsp;[F — N, R — MPa]</div>
      <div class="formula">R<sub>siq</sub> = F / A = F / 2500 &nbsp;[F — N]</div>
      <p>Egilish mustahkamligi — 3 ta natijadan <b>ikki eng kattasining</b> o'rtachasi; siqilish mustahkamligi — 6 ta natijadan
      <b>to'rt eng kattasining</b> o'rtachasi.</p>
      <h3>Sement markalari (GOST 10178, 28 sutka)</h3>
      ${VL.table(['Marka', 'R egilish, MPa ≥', 'R siqilish, MPa ≥'], GRADES.slice().reverse().map(([m, b, c]) => ['ПЦ ' + m, VL.fmt(b, 1), VL.fmt(c, 1)]))}
      <p>Sement namlikda saqlansa, havodagi namlik bilan reaksiyaga kirishib, faolligini yo'qotadi: 3 oyda 10–20%, 6 oyda 20–30% gacha.
      Shuning uchun omborda uzoq saqlangan sementni ishlatishdan oldin qayta sinash talab etiladi.</p>`,
    quiz: [
      { q: 'Sement sinashda prizma o\'lchamlari qanday?', o: ['40×40×160 mm', '70×70×70 mm', '100×100×400 mm', '150×150×150 mm'], a: 0 },
      { q: 'Standart qorishmadagi sement va qum nisbati qancha?', o: ['1 : 1', '1 : 2', '1 : 3', '1 : 6'], a: 2 },
      { q: 'Siqilish mustahkamligi qanday hisoblanadi?', o: ['6 ta natijaning o\'rtachasi', '4 ta eng katta natijaning o\'rtachasi', 'Eng kichik natija', 'Eng katta natija'], a: 1 },
      { q: 'ПЦ 400 markasi uchun siqilishdagi mustahkamlik kamida qancha?', o: ['29,4 MPa', '39,2 MPa', '40,0 MPa', '49,0 MPa'], a: 1 },
      { q: 'Uzoq vaqt namlikda saqlangan sement bilan nima sodir bo\'ladi?', o: ['Markasi oshadi', 'Faolligi kamayadi', "O'zgarmaydi", 'Tezroq qotadi va mustahkamlanadi'], a: 1 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fC = VL.field.select(P, 'Sement', Object.entries(CEM).map(([k, c]) => [k, c.name]), 'pc400');
      const fAge = VL.field.select(P, 'Namunalar yoshi', [[3, '3 sutka'], [7, '7 sutka'], [28, '28 sutka (marka uchun)']], 28);
      const fSpeed = VL.field.select(P, 'Simulyatsiya tezligi', [['1', '×1'], ['5', '×5'], ['15', '×15']], 15);
      const box = VL.h('div', { class: 'row' }); P.append(box);
      const bPrep = VL.field.button(box, 'Prizmalarni tayyorlash', prepare, 'primary');
      const bTest = VL.field.button(box, 'Sinash', start, 'accent');
      VL.field.button(box, 'Qayta boshlash', reset);

      const rN = L.readout('Sinov', ''), rF = L.readout('Yuk F', 'kN'), rR = L.readout('Kuchlanish', 'MPa'), rT = L.readout('Vaqt', 's');
      const chart = new VL.Chart(L.chart, { xLabel: 'Vaqt, s', yLabel: 'Yuk F, kN' });
      const parts = new VL.Particles();
      let st;

      function reset() {
        st = { phase: 'idle', mode: 'bend', bend: [], comp: [], i: 0, F: 0, t: 0, gap: 30, crackT: 0, failT: 0, cracks: null, series: null };
        chart.reset(); parts.clear(); fC.disabled = false; fAge.disabled = false;
        bPrep.disabled = false; bTest.disabled = true; bTest.textContent = 'Sinash';
        rN.set('—'); rF.set(0); rR.set(0); rT.set(0); L.note(''); renderResults();
      }

      function prepare() {
        const c = CEM[fC.value], a = AGE[+fAge.value][c.slag ? 1 : 0];
        const Rb = c.Rb * Math.pow(a, 0.7), Rc = c.Rc * a;
        st.bend = Array.from({ length: 3 }, () => ({ Fmax: Rb * (1 + VL.gauss(0, 0.06)) / KB }));
        st.comp = Array.from({ length: 6 }, () => ({ Fmax: Rc * (1 + VL.gauss(0, 0.045)) * AC / 1000 }));
        st.mode = 'bend'; st.i = 0; st.phase = 'ready';
        chart.o.yMax = Math.ceil(Math.max(...st.bend.map(s => s.Fmax)) * 1.3 * 2) / 2;
        fC.disabled = true; fAge.disabled = true; bPrep.disabled = true; bTest.disabled = false;
        bTest.textContent = '1-prizmani egish'; rN.set('Egilish 1/3');
        L.note("✔ 3 ta prizma tayyor (1 : 3, S/S = 0,40). Avval har birini egilishga sinang.", 'ok');
      }

      function start() {
        if (st.phase !== 'ready') return;
        VL.sfx.hum(true); st.phase = 'approach'; st.F = 0; st.t = 0; st.crackT = 0; st.failT = 0; parts.clear();
        st.cracks = st.mode === 'comp' ? VL.makeCracks('cube') : null;
        st.series = chart.add({ color: VL.COLORS[st.i % 6], label: `${st.mode === 'bend' ? 'P' : 'Y'}${st.i + 1}` });
        bTest.disabled = true;
        rN.set(st.mode === 'bend' ? `Egilish ${st.i + 1}/3` : `Siqilish ${st.i + 1}/6`);
      }

      VL.loop(frame);
      reset();

      function frame(dt) {
        const sp = +fSpeed.value, list = st.mode === 'bend' ? st.bend : st.comp, s = list[st.i];
        const rate = st.mode === 'bend' ? 0.05 : 2 * AC / 1000;   // kN/s
        if (st.phase === 'approach') {
          st.gap = Math.max(0, st.gap - 30 * dt / 0.8);
          if (!st.gap) st.phase = 'load';
        } else if (st.phase === 'load') {
          st.t += dt * sp;
          st.F = Math.min(s.Fmax, st.F + rate * dt * sp);
          st.series.data.push([st.t, st.F]);
          if (st.F >= s.Fmax) {
            st.phase = 'fail'; VL.sfx.hum(false); VL.sfx.play('crack');
            const w = L.scene.clientWidth, h = L.scene.clientHeight;
            parts.spawn(w / 2, h * 0.45, st.mode === 'bend' ? 12 : 40, '#a8a29e');
          }
        } else if (st.phase === 'fail') {
          st.crackT += dt * 3; st.failT += dt;
          st.F = Math.max(0, st.F - s.Fmax * dt * 4);
          if (st.failT > 0.9) next(list);
        }
        if (s && st.phase !== 'idle' && st.phase !== 'ready') {
          rF.set(st.F, 2); rR.set(st.mode === 'bend' ? st.F * KB : st.F * 1000 / AC, 2); rT.set(st.t, 0);
        }
        draw(dt); chart.draw();
      }

      function next(list) {
        const s = list[st.i];
        s.R = st.mode === 'bend' ? s.Fmax * KB : s.Fmax * 1000 / AC;
        chart.marks.push({ x: st.t, y: s.Fmax, color: VL.COLORS[st.i % 6], label: VL.fmt(s.Fmax, st.mode === 'bend' ? 2 : 1) });
        st.i++; st.gap = 30; st.phase = 'ready'; st.cracks = null; st.crackT = 0;
        if (st.mode === 'bend' && st.i === 3) {
          st.mode = 'comp'; st.i = 0;
          chart.reset(); chart.o.yMax = Math.ceil(Math.max(...st.comp.map(c => c.Fmax)) * 1.25 / 10) * 10;
          L.note("Egilish sinovi tugadi. Endi 6 ta yarim prizmani 25 sm² li plastinkalar orasida siqilishga sinang.", 'ok');
        }
        if (st.mode === 'comp' && st.i === 6) { st.phase = 'done'; bTest.textContent = 'Sinash'; }
        else { bTest.disabled = false; bTest.textContent = st.mode === 'bend' ? `${st.i + 1}-prizmani egish` : `${st.i + 1}-yarimtani siqish`; }
        renderResults();
      }

      function drawBend(ctx, x, y, w, h) {
        const r = w * 0.035, ph = w * 0.25, py = y + 2 * r;
        VL.metal(ctx, x + w / 2 - r, y, 2 * r, 2 * r, true);                     // yuklovchi rolik
        const tilt = st.phase === 'fail' && st.mode === 'bend' ? Math.min(1, st.crackT) * 0.06 : 0;
        const g = ctx.createLinearGradient(x, py, x, py + ph); g.addColorStop(0, '#d6d3d1'); g.addColorStop(1, '#a8a29e');
        for (const side of [-1, 1]) {
          ctx.save();
          ctx.translate(x + w / 2, py + ph);
          ctx.rotate(side * tilt);
          ctx.fillStyle = g;
          if (side < 0) ctx.fillRect(-w / 2, -ph, w / 2 - (tilt ? 1 : 0), ph); else ctx.fillRect(tilt ? 1 : 0, -ph, w / 2, ph);
          ctx.restore();
        }
        ctx.strokeStyle = '#57534e'; ctx.strokeRect(x + 0.5, py + 0.5, w - 1, ph - 1);
        if (tilt) { ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + w / 2, py + ph); ctx.lineTo(x + w / 2 + 2, py + ph * 0.4); ctx.lineTo(x + w / 2 - 1, py); ctx.stroke(); ctx.lineWidth = 1; }
        const sy = py + ph;
        for (const sx of [x + w / 2 - w * 0.3125, x + w / 2 + w * 0.3125]) {
          ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.arc(sx, sy + r, r, 0, 7); ctx.fill();
        }
        VL.metal(ctx, x + w * 0.1, sy + 2 * r, w * 0.8, h - (sy + 2 * r - y), true, true);
        ctx.fillStyle = '#475569'; ctx.font = '11px system-ui'; ctx.textAlign = 'center';
        ctx.fillText('l = 100 mm', x + w / 2, sy + 2 * r + 13);
      }

      function drawComp(ctx, x, y, w, h) {
        const pl = h * 0.12;
        VL.metal(ctx, x + w * 0.11, y, w * 0.78, pl, true);
        VL.metal(ctx, x + w * 0.11, y + h - pl, w * 0.78, pl, true);
        const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#d6d3d1'); g.addColorStop(1, '#a8a29e');
        ctx.fillStyle = g; ctx.fillRect(x, y + pl, w, h - 2 * pl);
        ctx.strokeStyle = '#57534e'; ctx.strokeRect(x + 0.5, y + pl + 0.5, w - 1, h - 2 * pl - 1);
        VL.drawCracks(ctx, x + w * 0.11, y + pl, w * 0.78, h - 2 * pl, st.cracks, st.crackT, '#78716c');
      }

      function draw(dt) {
        const { ctx, w, h } = VL.fit(L.scene);
        const avail = h - VL.PRESS_RESERVED;
        const show = st.phase !== 'idle';
        let specW, specH, fn;
        if (st.mode === 'bend') { specW = Math.min(w * 0.45, avail * 1.6); specH = specW * 0.5; fn = drawBend; }
        else { specW = Math.min(w * 0.3, avail * 1.2); specH = specW * 0.62; fn = drawComp; }
        const r = VL.drawPress(ctx, w, h, { specW, specH, gap: show ? st.gap : 30, squeeze: 0, drawSpec: show ? fn : null,
          loading: st.phase === 'load', title: st.mode === 'bend' ? 'MII-100 · egilish moslamasi' : 'PSU-10 · gidravlik press' });
        if (!show) { ctx.fillStyle = '#475569'; ctx.font = '13px system-ui'; ctx.textAlign = 'center'; ctx.fillText("«Prizmalarni tayyorlash» tugmasini bosing", w / 2, r.specY + specH / 2); }
        parts.update(dt, r.floorY); parts.draw(ctx);
      }

      function top(arr, n) { return arr.slice().sort((a, b) => b - a).slice(0, n); }

      function renderResults() {
        const bRows = st.bend.filter(s => s.R != null).map((s, i) => [`P${i + 1}`, VL.fmt(s.Fmax * 1000, 0), `<b>${VL.fmt(s.R, 2)}</b>`]);
        const cRows = st.comp.filter(s => s.R != null).map((s, i) => [`Y${i + 1}`, VL.fmt(s.Fmax, 1), `<b>${VL.fmt(s.R, 1)}</b>`]);
        let html = `<div class="two-col"><div><h3>Egilishga sinash</h3>${VL.table(['Prizma', 'F, N', 'R<sub>egil</sub>, MPa'], bRows.length ? bRows : [['—', '', '']])}</div>
          <div><h3>Siqilishga sinash</h3>${VL.table(['Yarimta', 'F, kN', 'R<sub>siq</sub>, MPa'], cRows.length ? cRows : [['—', '', '']])}</div></div>`;
        let summary = '';
        if (st.phase === 'done') {
          const Rb = VL.mean(top(st.bend.map(s => s.R), 2)), Rc = VL.mean(top(st.comp.map(s => s.R), 4));
          const age = +fAge.value, g = GRADES.find(([, b, c]) => Rb >= b && Rc >= c);
          summary = `R egil = ${VL.fmt(Rb, 2)} MPa, R siq = ${VL.fmt(Rc, 1)} MPa${age === 28 ? ' → ' + (g ? 'ПЦ ' + g[0] : 'markasiz') : ` (${age} sutka)`}`;
          html += `<div class="calc"><p>Egilish: R<sub>egil</sub> = (${top(st.bend.map(s => s.R), 2).map(v => VL.fmt(v, 2)).join(' + ')}) / 2 = <b>${VL.fmt(Rb, 2)} MPa</b></p>
            <p>Siqilish: R<sub>siq</sub> = (${top(st.comp.map(s => s.R), 4).map(v => VL.fmt(v, 1)).join(' + ')}) / 4 = <b>${VL.fmt(Rc, 1)} MPa</b></p></div>`;
          if (age === 28) {
            const decl = +CEM[fC.value].name.match(/\d{3}/)[0];
            const ok = g && g[0] >= decl;
            html += `<div class="verdict ${ok ? 'ok' : 'bad'}"><b>Xulosa:</b> Sinov natijalariga ko'ra sementning haqiqiy markasi — <b>${g ? 'ПЦ ' + g[0] : 'ПЦ 300 dan past'}</b>.
              Qadoqda ko'rsatilgan marka ПЦ ${decl}: ${ok ? "haqiqiy marka e'lon qilinganiga <b>mos keladi</b>."
                : "haqiqiy marka e'lon qilinganidan <b>past</b>. Beton tarkibini hisoblashda haqiqiy faollik qabul qilinishi yoki sement almashtirilishi kerak."}</div>`;
          } else {
            html += `<div class="verdict ok"><b>Xulosa:</b> ${age} sutkalik mustahkamlik aniqlandi. Sement markasi GOST 10178 bo'yicha faqat <b>28 sutkalik</b> namunalar bo'yicha belgilanadi;
              ${age} sutkalik natijalar qotish tezligini baholash uchun xizmat qiladi.</div>`;
          }
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
