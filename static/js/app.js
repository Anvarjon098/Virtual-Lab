'use strict';
/* Marshrutlash: bosh sahifa, laboratoriya ishlari, jurnal */
(function () {
  const $ = s => document.querySelector(s);
  const main = $('#main'), nav = $('#lab-nav');

  const CATS = {
    beton: '🏗 Beton va sement',
    devor: "🧱 To'ldiruvchilar va devorbop materiallar",
    metal: '🔩 Metallar',
    yol: "🛣 Yo'l qurilish materiallari",
    grunt: '🏜 Gruntlar va zaminlar',
  };
  const groups = [];
  VL.labs.forEach((lab, i) => {
    lab.num = i + 1;
    let g = groups.find(x => x.cat === lab.cat);
    if (!g) groups.push(g = { cat: lab.cat, labs: [] });
    g.labs.push(lab);
  });

  // yon menyu
  for (const g of groups) {
    nav.append(VL.h('div', { class: 'nav-cat' }, CATS[g.cat] || g.cat));
    g.labs.forEach(lab => nav.append(VL.h('a', { href: '#/lab/' + lab.id, 'data-id': lab.id },
      VL.h('span', { class: 'num' }, String(lab.num)), VL.h('span', null, lab.title))));
  }

  // ovozni yoqish/o'chirish
  const snd = $('#sound');
  const sndUpd = () => { snd.textContent = VL.sfx.on ? '🔊' : '🔇'; snd.title = VL.sfx.on ? "Ovozni o'chirish" : 'Ovozni yoqish'; };
  snd.addEventListener('click', () => { VL.sfx.toggle(); sndUpd(); });
  sndUpd();

  // talaba ismi
  const stu = $('#student');
  stu.value = VL.student();
  stu.addEventListener('input', () => localStorage.setItem('vl_student', stu.value.trim()));

  function home() {
    main.append(VL.h('div', { class: 'hero' },
      VL.h('h1', null, 'Qurilish materiallari virtual laboratoriyasi'),
      VL.h('p', null, "O'zbekiston qurilish sohasi uchun qurilish materiallarini me'yoriy hujjatlar (GOST, ShNQ/KMK, ASTM) asosida " +
        "sinashning interaktiv simulyatori. Har bir laboratoriya ishi nazariy qism, real jihozlar modeli asosidagi tajriba, " +
        "avtomatik hisoblash, xulosa va bilim testidan iborat."),
      VL.h('div', { class: 'hero-stats' },
        VL.h('div', null, VL.h('b', null, String(VL.labs.length)), 'laboratoriya ishi'),
        VL.h('div', null, VL.h('b', null, String(groups.length)), "material bo'limi"),
        VL.h('div', null, VL.h('b', null, String(VL.labs.reduce((s, l) => s + l.quiz.length, 0))), 'test savoli'))));
    for (const g of groups) {
      main.append(VL.h('h2', { class: 'cat-title' }, CATS[g.cat] || g.cat));
      const grid = VL.h('div', { class: 'cards' });
      g.labs.forEach(lab => grid.append(VL.h('a', { class: 'card', href: '#/lab/' + lab.id },
        VL.h('div', { class: 'card-ico' }, lab.icon),
        VL.h('div', { class: 'card-n' }, `${lab.num}-laboratoriya ishi`),
        VL.h('h3', null, lab.title),
        VL.h('p', null, lab.short),
        VL.h('div', { class: 'std' }, lab.standard))));
      main.append(grid);
    }
    main.append(VL.h('div', { class: 'panel info', html: `
      <h3>Qanday ishlash kerak?</h3>
      <ol>
        <li>Yuqoridagi maydonga <b>F.I.Sh.</b> ingizni kiriting — u hisobotlarda ko'rsatiladi.</li>
        <li>Laboratoriya ishini tanlang va avval <b>«Nazariya»</b> bo'limini o'qing.</li>
        <li><b>«Tajriba»</b> bo'limida sinov parametrlarini tanlang va bosqichlarni ketma-ket bajaring.</li>
        <li>Natijalar jadvali, grafik va xulosani tahlil qiling, so'ng <b>«Jurnalga saqlash»</b> tugmasini bosing.</li>
        <li><b>«Bilim testi»</b> orqali o'zingizni tekshiring. Jurnaldan hisobotni chop etish (PDF) mumkin.</li>
      </ol>
      <h3>Ishlab chiqishda o'rganilgan virtual laboratoriyalar</h3>
      <ul>
        <li><a href="https://www.labster.com/simulations/concrete-materials-testing" target="_blank">Labster — Concrete Materials Testing</a> (elak tahlili, konus cho'kishi, siqilishga sinash)</li>
        <li><a href="https://www.nist.gov/system/files/documents/el/building_materials/VCCTLUserGuide.pdf" target="_blank">NIST VCCTL — Virtual Cement and Concrete Testing Laboratory</a></li>
        <li><a href="https://www.gcoej.ac.in/download/Second%20Year%20-%20Virtual%20Lab%20Experiment%20Links0.pdf" target="_blank">Virtual Labs (vlabs.ac.in) — po'latni cho'zilishga sinash, slump test</a></li>
      </ul>
      <p class="muted">Simulyatsiyalardagi bog'liqliklar (Skramtayev–Bolomey formulasi, Ramberg–Osgood modeli, lognormal donadorlik taqsimoti va h.k.) o'quv maqsadida soddalashtirilgan.
      Har bir sinovda namunalar tasodifiy tarqoqlik bilan yaratiladi — xuddi haqiqiy laboratoriyadagidek.</p>` }));
  }

  function journal() {
    const items = VL.journal.all();
    main.append(VL.h('div', { class: 'lab-head' }, VL.h('div', null, VL.h('h2', null, '📒 Laboratoriya jurnali'),
      VL.h('div', { class: 'std' }, `${items.length} ta yozuv`)),
      VL.h('div', { class: 'row' },
        VL.h('button', { class: 'btn primary', disabled: !items.length, onclick: () => VL.printHTML(items.map(VL.reportHTML).join('<div class="pb"></div>')) }, '🖨 Hammasini chop etish'),
        VL.h('button', { class: 'btn danger', disabled: !items.length, onclick: () => { if (confirm("Jurnaldagi barcha yozuvlar o'chirilsinmi?")) { VL.journal.clear(); route(); } } }, '🗑 Tozalash'))));
    if (!items.length) {
      main.append(VL.h('div', { class: 'panel empty' }, "Jurnal hozircha bo'sh. Laboratoriya ishini bajarib, natijani saqlang."));
      return;
    }
    for (const e of items) {
      const body = VL.h('div', { class: 'j-body', hidden: true, html: e.html });
      main.append(VL.h('div', { class: 'panel j-item' },
        VL.h('div', { class: 'j-head' },
          VL.h('div', null, VL.h('b', null, e.title), VL.h('div', { class: 'muted' }, `${e.date} · ${e.student}`), VL.h('div', { class: 'j-sum' }, e.summary)),
          VL.h('div', { class: 'row' },
            VL.h('button', { class: 'btn', onclick: () => (body.hidden = !body.hidden) }, "Ko'rish"),
            VL.h('button', { class: 'btn', onclick: () => VL.printHTML(VL.reportHTML(e)) }, '🖨'),
            VL.h('button', { class: 'btn danger', onclick: () => { VL.journal.remove(e.id); route(); } }, '✕'))),
        body));
    }
  }

  function route() {
    VL.token++;
    VL.sfx.hum(false);
    main.innerHTML = '';
    window.scrollTo(0, 0);
    const hash = location.hash || '#/';
    const m = hash.match(/^#\/lab\/(\w+)/);
    nav.querySelectorAll('a').forEach(a => a.classList.toggle('on', !!m && a.dataset.id === m[1]));
    $('#nav-home').classList.toggle('on', hash === '#/');
    $('#nav-journal').classList.toggle('on', hash === '#/journal');
    if (m && VL.get(m[1])) {
      const lab = VL.get(m[1]);
      const L = VL.layout(main, lab);
      lab.mount(L);
      document.title = lab.title + ' — Virtual laboratoriya';
    } else if (hash === '#/journal') {
      journal();
      document.title = 'Jurnal — Virtual laboratoriya';
    } else {
      home();
      document.title = 'Qurilish materiallari virtual laboratoriyasi';
    }
  }

  window.addEventListener('hashchange', route);
  route();
})();
