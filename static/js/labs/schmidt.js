'use strict';
/* Betonni buzmasdan sinash — sklerometr (Shmidt bolg'achasi), GOST 22690-2015 */
(function () {
  const ELEM = {
    column: { name: 'Monolit ustun (gorizontal zarba)', dir: 0, dirName: 'gorizontal' },
    slab: { name: "Orayopma plitasi, pastdan (yuqoriga zarba)", dir: -3, dirName: 'pastdan yuqoriga' },
    found: { name: 'Poydevor plitasi, ustidan (pastga zarba)', dir: 2.5, dirName: 'yuqoridan pastga' },
  };
  const QUAL = { good: ['Sifatli bajarilgan', 1.12], mid: ['Oddiy sifat', 1.0], bad: ['Sifatsiz (qishda quyilgan, parvarishsiz)', 0.7] };
  const AGE = { new: ['Yangi bino (28–90 sutka)', 0], old: ['Eski bino (20+ yil, karbonlashgan)', 5] };
  const N_SEC = 3, N_PTS = 9;
  const calib = Q => 1.25 * Q - 23;   // asbob pasportidagi bog'liqlik R = f(Q)

  VL.register({
    id: 'schmidt', icon: '🔨', cat: 'beton',
    title: "Betonni buzmasdan sinash (sklerometr)",
    standard: "GOST 22690-2015, GOST 18105-2018 · EN 12504-2, ShNQ 2.01.03-19",
    short: "Mavjud bino konstruksiyasida Shmidt bolg'achasi bilan qaytish ko'rsatkichini o'lchab, beton mustahkamligi va sinfini baholash.",
    theory: `
      <h3>Ishning maqsadi</h3>
      <p>Mavjud bino va inshootlar konstruksiyalaridagi beton mustahkamligini <b>buzmasdan</b> — elastik qaytish usulida
      (Shmidt sklerometri) aniqlash. O'zbekiston seysmik faol hudud bo'lgani uchun eski binolarni qayta tiklash, rekonstruksiya qilish
      va texnik ko'rikdan o'tkazishda bu usul eng ko'p qo'llaniladi.</p>
      <h3>Usul mohiyati</h3>
      <p>Prujinali zarbdor beton yuzasiga uriladi va qaytish balandligi (Q, shartli birliklarda) shkalada o'qiladi. Beton qancha
      qattiq va mustahkam bo'lsa, qaytish shuncha katta bo'ladi. Mustahkamlik oldindan tuzilgan darajalash bog'liqligi
      <span class="formula inline">R = f(Q)</span> orqali topiladi.</p>
      <h3>Ish tartibi</h3>
      <ol><li>Konstruksiyada kamida 3 ta sinov uchastkasi tanlanadi; yuza tozalanadi va silliqlanadi.</li>
      <li>Karbonlashgan qatlam (eski betonda 5–20 mm) jilvir tosh bilan olib tashlanadi — aks holda natija oshib ketadi.</li>
      <li>Har bir uchastkada bir-biridan kamida 30 mm masofada <b>9 ta zarba</b> beriladi.</li>
      <li>O'rtachadan keskin farq qiluvchi qiymatlar (yirik to'ldiruvchi yoki g'ovakka tushgan zarbalar) chiqarib tashlanadi.</li>
      <li>Zarba yo'nalishi bo'yicha tuzatma kiritiladi: yuqoriga urilganda qaytish kamayadi, pastga urilganda ortadi.</li></ol>
      <h3>Hisoblash</h3>
      <div class="formula">Q̄ = ΣQᵢ / n &nbsp;&nbsp; Q<sub>tuz</sub> = Q̄ − ΔQ<sub>yo'n</sub> &nbsp;&nbsp; R = 1,25 · Q<sub>tuz</sub> − 23</div>
      <div class="formula">B<sub>haq</sub> = R̄ · (1 − 1,64 · v), &nbsp; v ≥ 13,5%</div>
      ${VL.table(["Zarba yo'nalishi", 'Gorizontal', 'Pastdan yuqoriga', 'Yuqoridan pastga'], [['ΔQ', '0', '−3', '+2,5']])}
      <p class="muted">Eslatma: darajalash bog'liqligi har bir asbob va beton turi uchun alohida tuziladi; bu ishda o'quv maqsadida bitta chiziqli bog'liqlik qabul qilingan.</p>`,
    quiz: [
      { q: 'Sklerometr usulining asosiy afzalligi nimada?', o: ['Eng aniq usul', 'Konstruksiyani buzmasdan sinash mumkin', 'Laboratoriya talab qilmaydi va har doim aniq', "Betonni sindirib ko'radi"], a: 1 },
      { q: 'Bitta uchastkada nechta zarba beriladi?', o: ['1', '3', '9', '50'], a: 2 },
      { q: "Eski betonda karbonlashgan qatlam olib tashlanmasa, natija qanday bo'ladi?", o: ['Kamayadi', 'Oshib ketadi', "O'zgarmaydi", 'Sinov mumkin emas'], a: 1 },
      { q: "Pastdan yuqoriga urilganda qaytish ko'rsatkichi qanday o'zgaradi?", o: ['Ortadi', 'Kamayadi', "O'zgarmaydi", 'Ikki barobar ortadi'], a: 1 },
      { q: "Zarba nuqtalari orasidagi masofa kamida qancha bo'lishi kerak?", o: ['5 mm', '30 mm', '300 mm', '1 m'], a: 1 },
    ],

    mount(L) {
      const lab = this, P = L.params;
      const fE = VL.field.select(P, 'Konstruksiya elementi', Object.entries(ELEM).map(([k, e]) => [k, e.name]), 'column');
      const fB = VL.field.select(P, 'Loyihaviy beton sinfi', [15, 20, 25, 30, 35].map(b => [b, 'B' + b]), 25);
      const fQ = VL.field.select(P, 'Qurilish sifati (noma\'lum, sinov ko\'rsatadi)', Object.entries(QUAL).map(([k, q]) => [k, q[0]]), 'mid');
      const fA = VL.field.select(P, 'Bino yoshi', Object.entries(AGE).map(([k, a]) => [k, a[0]]), 'new');
      const cbWrap = VL.h('label', { class: 'field chk' });
      const fClean = VL.h('input', { type: 'checkbox' });
      cbWrap.append(fClean, " Karbonlashgan qatlamni jilvirlab olib tashlash");
      P.append(cbWrap);
      const box = VL.h('div', { class: 'row' }); P.append(box);
      const bStart = VL.field.button(box, 'Sinovni boshlash', begin, 'primary');
      const bAuto = VL.field.button(box, 'Uchastkani avtomatik o\'lchash', autoStrike, 'accent');
      VL.field.button(box, 'Qayta boshlash', reset);
      const help = VL.h('div', { class: 'hint' }, "Sahnadagi nuqtalarni sichqoncha bilan bosib zarba bering"); P.append(help);

      const rSec = L.readout('Uchastka', ''), rQ = L.readout('Qaytish Q', 'birl.'), rCnt = L.readout('Zarbalar', '');
      const chart = new VL.Chart(L.chart, { xLabel: "Qaytish ko'rsatkichi Q", yLabel: 'Mustahkamlik R, MPa', xMin: 15, xMax: 60, yMax: 55 });
      let st, pts = [];

      function reset() {
        st = { phase: 'idle', sec: 0, data: [], needle: 0, needleTarget: 0, hammerT: 0, secs: [] };
        [fE, fB, fQ, fA, fClean].forEach(e => (e.disabled = false));
        bStart.disabled = false; bAuto.disabled = true;
        rSec.set('—'); rQ.set('—'); rCnt.set('—'); L.note(''); renderResults();
      }

      function begin() {
        const Rdesign = +fB.value / 0.778, k = QUAL[fQ.value][1];
        const carb = fA.value === 'old' && !fClean.checked ? AGE.old[1] : 0;
        const dir = ELEM[fE.value].dir;
        st.secs = Array.from({ length: N_SEC }, () => {
          const R = Rdesign * k * (1 + VL.gauss(0, 0.07));
          const Q = (R + 23) / 1.25;
          return { Rtrue: R, Qtrue: Q, vals: Array(N_PTS).fill(null), make: () => Math.round(Q + dir + carb + VL.gauss(0, 1.6) + (Math.random() < 0.1 ? (Math.random() < 0.5 ? -9 : 8) : 0)) };
        });
        st.phase = 'run'; st.sec = 0; st.carb = carb;
        [fE, fB, fQ, fA, fClean].forEach(e => (e.disabled = true));
        bStart.disabled = true; bAuto.disabled = false;
        rSec.set(`1 / ${N_SEC}`); rCnt.set(`0 / ${N_PTS}`);
        L.note(fA.value === 'old' && !fClean.checked ? "⚠ Eski betonning karbonlashgan qatlami olib tashlanmadi — natija oshirib ko'rsatilishi mumkin!" : "✔ Yuza tayyorlandi. 1-uchastkada 9 ta zarba bering.", fA.value === 'old' && !fClean.checked ? 'warn' : 'ok');
      }

      function strike(j) {
        if (st.phase !== 'run' || st.busy) return;
        const s = st.secs[st.sec];
        if (s.vals[j] != null) return;
        st.busy = true; st.hit = j;
        const q = s.make();
        setTimeout(() => VL.sfx.play('hammer'), 180);
        VL.tween(0.45, t => { st.hammerT = t; st.needle = q * Math.sin(Math.min(1, t * 1.6) * Math.PI / 2); }, () => {
          s.vals[j] = q; st.needle = q; st.hammerT = 0; st.busy = false;
          rQ.set(String(q)); const n = s.vals.filter(v => v != null).length; rCnt.set(`${n} / ${N_PTS}`);
          if (n === N_PTS) finishSection();
          renderResults();
        });
      }

      function autoStrike() {
        if (st.phase !== 'run') return;
        bAuto.disabled = true;
        const free = st.secs[st.sec].vals.map((v, j) => (v == null ? j : -1)).filter(j => j >= 0);
        VL.sequence(free, (j, _, next) => { strike(j); const wait = () => (st.busy ? setTimeout(wait, 50) : setTimeout(next, 120)); wait(); }, () => { if (st.phase === 'run') bAuto.disabled = false; });
      }

      function process(s) {
        const sorted = s.vals.slice().sort((a, b) => a - b), med = sorted[4];
        const kept = s.vals.filter(v => Math.abs(v - med) <= 6), Qm = VL.mean(kept);
        const Qc = Qm - ELEM[fE.value].dir;
        return { med, kept, Qm, Qc, R: calib(Qc), out: s.vals.filter(v => Math.abs(v - med) > 6) };
      }

      function finishSection() {
        const s = st.secs[st.sec];
        Object.assign(s, process(s));
        chart.marks.push({ x: s.Qc, y: s.R, color: VL.COLORS[st.sec], label: `${st.sec + 1}-uch.: ${VL.fmt(s.R, 1)}` });
        st.sec++;
        if (st.sec < N_SEC) { rSec.set(`${st.sec + 1} / ${N_SEC}`); rCnt.set(`0 / ${N_PTS}`); L.note(`✔ ${st.sec}-uchastka tugadi. ${st.sec + 1}-uchastkaga o'ting.`, 'ok'); }
        else { st.phase = 'done'; bAuto.disabled = true; L.note('✔ Barcha uchastkalar o\'lchandi.', 'ok'); }
      }

      L.scene.addEventListener('click', ev => {
        const r = L.scene.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
        const p = pts.find(p => Math.hypot(p.x - x, p.y - y) < 12);
        if (p) strike(p.j);
      });
      L.scene.style.cursor = 'crosshair';

      VL.loop(frame);
      reset();
      const speck = VL.speckles(500, ['#78716c', '#a8a29e', '#57534e', '#d6d3d1'], 0.6, 2.2);

      function frame() { draw(); drawChart(); }

      function draw() {
        const { ctx, w, h } = VL.fit(L.scene);
        VL.sceneBg(ctx, w, h);
        // beton yuzasi
        const sw = w * 0.6, sx = 12, sy = 12, sh = h - 24;
        const g = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh); g.addColorStop(0, '#b8b4ae'); g.addColorStop(1, '#8f8a84');
        ctx.fillStyle = g; ctx.fillRect(sx, sy, sw, sh);
        VL.drawSpeckles(ctx, sx, sy, sw, sh, speck, 1);
        if (st.carb === 0 && fA.value === 'old' && st.phase !== 'idle') { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(sx, sy, sw, sh); }
        pts = [];
        const bh = (sh - 40) / N_SEC;
        for (let s = 0; s < N_SEC; s++) {
          const by = sy + 10 + s * (bh + 10), bx = sx + 30, bw = sw - 60;
          const cur = st.phase === 'run' && s === st.sec;
          ctx.strokeStyle = cur ? '#2563eb' : 'rgba(30,41,59,.5)'; ctx.lineWidth = cur ? 3 : 1.5;
          ctx.setLineDash(cur ? [] : [5, 4]); ctx.strokeRect(bx, by, bw, bh); ctx.setLineDash([]);
          ctx.fillStyle = '#1e293b'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
          ctx.fillText(`${s + 1}-uchastka`, bx + 6, by + 15);
          const sec = st.secs[s];
          for (let j = 0; j < N_PTS; j++) {
            const px = bx + bw * (0.25 + 0.25 * (j % 3)), py = by + bh * (0.3 + 0.25 * Math.floor(j / 3)) + 4;
            if (cur) pts.push({ x: px, y: py, j });
            const v = sec ? sec.vals[j] : null;
            ctx.beginPath(); ctx.arc(px, py, 6, 0, 7);
            ctx.fillStyle = v != null ? (sec.out && sec.out.includes(v) && Math.abs(v - sec.med) > 6 ? '#dc2626' : '#16a34a') : cur ? '#fff' : 'rgba(255,255,255,.4)';
            ctx.fill(); ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1; ctx.stroke();
            if (v != null) { ctx.fillStyle = '#0f172a'; ctx.font = 'bold 11px system-ui'; ctx.fillText(String(v), px + 9, py + 4); }
          }
        }
        // sklerometr yon ko'rinishi
        const hx = sx + sw + 20, hw = w - hx - 12, hy = h * 0.2;
        const len = Math.min(hw * 0.95, 260), thick = Math.min(46, h * 0.12);
        const recoil = st.hammerT > 0 ? Math.sin(st.hammerT * Math.PI) * 8 : 0;
        ctx.save(); ctx.translate(hx + recoil, hy);
        VL.metal(ctx, 0, 0, len * 0.8, thick, true);
        VL.metal(ctx, len * 0.8, thick * 0.3, len * 0.2, thick * 0.4, true);          // plunjer
        ctx.fillStyle = '#fff'; ctx.fillRect(len * 0.12, thick * 0.22, len * 0.5, thick * 0.56);
        ctx.strokeStyle = '#334155'; ctx.strokeRect(len * 0.12, thick * 0.22, len * 0.5, thick * 0.56);
        ctx.fillStyle = '#334155'; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
        for (let q = 10; q <= 100; q += 10) {
          const x = len * 0.12 + len * 0.5 * (q - 10) / 90;
          ctx.beginPath(); ctx.moveTo(x, thick * 0.22); ctx.lineTo(x, thick * 0.4); ctx.stroke();
          if (q % 20 === 0) ctx.fillText(String(q), x, thick * 0.7);
        }
        const nx = len * 0.12 + len * 0.5 * VL.clamp((st.needle - 10) / 90, 0, 1);
        ctx.fillStyle = '#dc2626'; ctx.fillRect(nx - 1.5, thick * 0.18, 3, thick * 0.64);
        ctx.restore();
        ctx.fillStyle = '#334155'; ctx.font = '12px system-ui'; ctx.textAlign = 'left';
        ctx.fillText("Shmidt sklerometri (N tip)", hx, hy - 10);
        ctx.fillText(`Zarba yo'nalishi: ${ELEM[fE.value].dirName}`, hx, hy + thick + 22);
        ctx.font = 'bold 26px system-ui'; ctx.fillStyle = '#0f172a';
        ctx.fillText(st.needle ? `Q = ${Math.round(st.needle)}` : 'Q = —', hx, hy + thick + 60);
      }

      function drawChart() {
        chart.reset();
        chart.add({ data: [[15, calib(15)], [60, calib(60)]], color: '#64748b', width: 1.5, dash: [6, 4], label: 'R = 1,25·Q − 23' });
        st.secs.forEach((s, i) => { if (s.R != null) chart.marks.push({ x: s.Qc, y: s.R, color: VL.COLORS[i], label: `${i + 1}: ${VL.fmt(s.R, 1)} MPa` }); });
        chart.draw();
      }

      function renderResults() {
        const rows = st.secs.map((s, i) => {
          const vals = s.vals.map(v => v == null ? '·' : (s.med != null && Math.abs(v - s.med) > 6 ? `<s style="color:#dc2626">${v}</s>` : v)).join(' ');
          return [i + 1, vals, s.Qm != null ? VL.fmt(s.Qm, 1) : '', s.Qc != null ? VL.fmt(s.Qc, 1) : '', s.R != null ? `<b>${VL.fmt(s.R, 1)}</b>` : ''];
        });
        let html = '<h3>O\'lchash natijalari</h3>' + VL.table(['Uchastka', "Qaytish qiymatlari Qᵢ (chizilganlari chiqarib tashlangan)", 'Q̄', 'Q<sub>tuz</sub>', 'R, MPa'], rows.length ? rows : [['—', '', '', '', '']]);
        let summary = '';
        if (st.phase === 'done') {
          const Rs = st.secs.map(s => s.R), Rm = VL.mean(Rs), v = Math.max(0.135, VL.std(Rs) / Rm), B = Rm * (1 - 1.64 * v);
          const Bd = +fB.value, ok = B >= Bd;
          const classes = [7.5, 10, 12.5, 15, 20, 22.5, 25, 30, 35, 40, 45];
          const cls = [...classes].reverse().find(c => c <= B);
          const fooled = st.carb > 0;
          summary = `R̄ = ${VL.fmt(Rm, 1)} MPa, B haq = ${VL.fmt(B, 1)} (B${cls || '<7,5'}) — loyiha B${Bd} ${ok ? 'ta\'minlangan' : 'ta\'minlanmagan'}`;
          html += `<div class="calc"><p>O'rtacha mustahkamlik: <b>R̄ = ${VL.fmt(Rm, 1)} MPa</b>; variatsiya koeffitsiyenti v = ${VL.fmt(VL.std(Rs) / Rm * 100, 1)}% (hisobda ${VL.fmt(v * 100, 1)}%)</p>
            <p>Haqiqiy sinf: B = ${VL.fmt(Rm, 1)} · (1 − 1,64 · ${VL.fmt(v, 3)}) = <b>${VL.fmt(B, 1)} MPa → B${cls ? VL.fmtTick(cls) : ' < 7,5'}</b></p></div>
            <div class="verdict ${ok && !fooled ? 'ok' : 'bad'}"><b>Xulosa:</b> ${ELEM[fE.value].name.split('(')[0].trim()} betonining haqiqiy sinfi <b>B${cls ? VL.fmtTick(cls) : ' < 7,5'}</b>,
            loyihaviy sinf B${Bd} — ${ok ? "<b>ta'minlangan</b>." : "<b>ta'minlanmagan</b>. Konstruksiyani kuchaytirish loyihasi va kern namunalarini olib laboratoriyada qo'shimcha sinash tavsiya etiladi."}
            ${fooled ? "<br>⚠ Karbonlashgan qatlam olib tashlanmagan — haqiqiy mustahkamlik ko'rsatilganidan past bo'lishi mumkin! Sinovni qatlamni jilvirlab takrorlang." : ''}
            ${!ok || B < 15 ? '<br>Seysmik hududlarda (ShNQ 2.01.03-19) bunday element mustahkamligi seysmik bardoshlilikni qayta hisoblashni talab qiladi.' : ''}</div>`;
        }
        L.results.innerHTML = html;
        if (summary) VL.resultActions(L.results, lab, summary, html);
      }
    },
  });
})();
