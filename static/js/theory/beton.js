'use strict';
/* Chuqurlashtirilgan nazariya: beton va sement bo'limi */

/* ===================== 1. Betonning siqilishdagi mustahkamligi ===================== */
VL.deep.concrete = `
<h3>1. Betonning tuzilishi va mustahkamlikning tabiati</h3>
<p>Beton — <b>kompozit material</b>: sement toshi (matritsa) ichida yirik va mayda to'ldiruvchi donalari joylashgan.
Uning mustahkamligi uchta "bo'g'in" bilan belgilanadi: sement toshining mustahkamligi, to'ldiruvchining mustahkamligi
va ular orasidagi <b>kontakt (o'tish) zonasi</b> — ITZ (Interfacial Transition Zone). Odatda eng zaif bo'g'in aynan kontakt
zonasidir: bu yerda suv-sement nisbati yuqoriroq, g'ovaklik ko'p, kalsiy gidroksidning yirik kristallari to'planadi.</p>
<h4>Sementning gidratatsiyasi</h4>
<p>Sement suv bilan aralashganda klinker minerallari gidratlanadi:</p>
<div class="formula">2C₃S + 6H → C₃S₂H₃ (C–S–H geli) + 3CH</div>
<p>Hosil bo'lgan <b>kalsiy gidrosilikatlari geli (C–S–H)</b> — sement toshining asosiy "yelimi". Gidratatsiya yillar davomida
davom etadi, ammo eng jadal birinchi 28 sutkada bo'ladi — shu sababli 28 sutka asosiy (loyihaviy) yosh hisoblanadi.</p>
<h4>Suv-sement nisbati qonuni</h4>
<p>Sementni to'liq gidratlash uchun kimyoviy jihatdan S/S ≈ 0,23–0,25 yetarli, gel g'ovaklaridagi suv bilan birga — taxminan 0,38–0,42.
Qorishmaning qulay joylanuvchanligi uchun undan ko'p suv qo'shiladi; ortiqcha suv bug'langach <b>kapillyar g'ovaklar</b> qoladi.
Shuning uchun S/S oshgani sari mustahkamlik keskin kamayadi (Abrams qonuni):</p>
<div class="formula">R = A / B<sup>S/S</sup></div>
<p>Amaliyotda chiziqli shakli — Skramtayev–Bolomey formulasi qo'llaniladi (asosiy qismdagi formulaga qarang). Ushbu simulyatorda ham
mustahkamlik aynan shu formula bo'yicha hisoblanadi, so'ng tasodifiy tarqoqlik qo'shiladi.</p>

<h3>2. Siqilishda buzilish mexanizmi</h3>
<p>Siqilayotgan kub nafaqat qisqaradi, balki yon tomonlarga kengayadi (Puasson effekti, ν ≈ 0,15–0,20). Buzilish uch bosqichda kechadi:</p>
<ol>
<li><b>Elastik bosqich</b> (≈ 0,3–0,4·R gacha) — kontakt zonasidagi mavjud mikroyoriqlar deyarli o'smaydi, σ–ε bog'liqligi chiziqliga yaqin.</li>
<li><b>Barqaror yoriq o'sishi</b> (≈ 0,4–0,8·R) — mikroyoriqlar kontakt zonasida kengayadi, egri chiziq egila boshlaydi.</li>
<li><b>Beqaror yoriq o'sishi</b> (> 0,8·R) — yoriqlar sement toshi orqali birlashib, yuk ko'tarish qobiliyati yo'qoladi.</li>
</ol>
<p>Press plitalari va namuna yuzasi orasidagi <b>ishqalanish</b> uchlarini kengayishdan ushlab qoladi, natijada kub odatda
<b>uchlari bilan biriktirilgan ikkita kesik piramida</b> ("qum soat") shaklida buziladi. Agar yuzalar moylansa, ishqalanish yo'qoladi va
namuna vertikal yoriqlar bilan, pastroq kuchda buziladi — shuning uchun standart sinovda moylash taqiqlanadi.</p>
<div class="box">Simulyator grafigidagi egri chiziq <b>Hognestad modeli</b> bilan chizilgan: σ = R·[2ε/ε₀ − (ε/ε₀)²], bu yerda ε₀ ≈ 0,002 — eng katta kuchlanishga mos deformatsiya.</div>

<h3>3. Natijaga ta'sir qiluvchi omillar</h3>
${VL.table(['Omil', "Ta'sir", 'Izoh'], [
  ['Suv-sement nisbati', 'S/S 0,1 ga oshsa, R ≈ 10–15% kamayadi', 'Eng muhim omil'],
  ['Sement aktivligi (markasi)', 'R taxminan Rс ga proporsional', 'Eski yoki nam saqlangan sement aktivligini yo\'qotadi'],
  ['To\'ldiruvchi sifati', 'Chaqiq toshda shag\'aldan 10–15% yuqori', 'Tishlashish (adgeziya) yaxshiroq'],
  ['Yosh va qotish sharoiti', 'Nam muhitda o\'sish davom etadi; quruqda to\'xtaydi', 'Issiq va quruq havoda ayniqsa muhim'],
  ['Namuna o\'lchami', 'Kichik kub kattasidan mustahkamroq ko\'rinadi', 'Masshtab koeffitsiyenti α bilan tuzatiladi'],
  ['Yuklash tezligi', 'Tez yuklashda R ortiqcha chiqadi', 'Standart: 0,6 ± 0,2 MPa/s'],
  ['Namuna geometriyasi', 'Qiyshiq yuza kuchlanishni notekis taqsimlaydi', 'Yuzalar tekisligi tekshiriladi'],
])}

<h3>4. Statistik baholash va mustahkamlik sinfi</h3>
<p>Beton bir jinsli emas — bir xil tarkibdan tayyorlangan kublar ham turlicha mustahkamlikka ega. Taqsimot normal deb qabul qilinadi.
<b>Mustahkamlik sinfi B</b> — 95% ta'minlanganlik bilan kafolatlangan mustahkamlik:</p>
<div class="formula">B = R̄ · (1 − t · v), &nbsp; t = 1,64 (95%)</div>
<p>Variatsiya koeffitsiyenti v = S / R̄ ishlab chiqarish sifatini ko'rsatadi: zavod sharoitida 8–10%, qurilish maydonida 13,5% va undan ko'p.
Normativ qiymat v = 13,5% da B ≈ 0,778·R̄ bo'ladi. Demak, B25 sinfini olish uchun o'rtacha mustahkamlik kamida
25 / 0,778 ≈ <b>32,1 MPa</b> bo'lishi kerak. Sifat yaxshi bo'lsa (v kichik), xuddi shu sinf uchun kamroq sement sarflanadi —
bu nazoratning iqtisodiy ma'nosi.</p>

<h3>5. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>150×150×150 mm o'lchamli uchta kub sinaldi: F₁ = 720 kN, F₂ = 690 kN, F₃ = 750 kN. A = 150·150 = 22 500 mm², α = 1,00.</p>
<p>R₁ = 720 000 / 22 500 = 32,0 MPa; &nbsp; R₂ = 30,7 MPa; &nbsp; R₃ = 33,3 MPa.</p>
<p>R̄ = (32,0 + 30,7 + 33,3) / 3 = <b>32,0 MPa</b>.</p>
<p>B = 0,778 · 32,0 = 24,9 MPa → bu B25 talabidan (25 MPa) biroz kam, demak beton <b>B22,5</b> sinfiga to'g'ri keladi.</p>
<p><i>Xulosa:</i> loyihada B25 talab qilingan bo'lsa, partiya talabga javob bermaydi — sabablari (S/S, qotish, sement) tahlil qilinadi.</p>
</div>

<h3>6. Xatolik manbalari va ularni kamaytirish</h3>
<ul>
<li><b>Namunani markazga qo'ymaslik</b> — ekssentrisitet egilish hosil qiladi va natijani pasaytiradi.</li>
<li><b>Qoliplangan yuzani press plitasiga qaratish</b> — yuqori yuza notekis, shuning uchun namuna yonboshlatib qo'yiladi.</li>
<li><b>Namunaning qurib qolishi</b> — kameradan olingan namuna darhol sinaladi; quruq namuna ho'lidan biroz yuqori natija beradi.</li>
<li><b>Press kalibrovkasi</b> — kuch o'lchagich davriy ravishda tekshirilishi (metrologik attestatsiya) shart.</li>
<li><b>Yuklash tezligi</b> — simulyatorda tezlikni o'zgartirib, natija qanday siljishini kuzating.</li>
</ul>

<h3>7. O'zbekiston sharoitida</h3>
<div class="box uz">
<p><b>Issiq iqlim.</b> Yozda havo harorati 40–45 °C ga, quyosh ostidagi beton yuzasi bundan ham yuqoriga yetadi. Suv tez bug'lanadi,
gidratatsiya to'xtaydi, plastik kirishish yoriqlari paydo bo'ladi. Shuning uchun betonni kamida 7 sutka nam holda saqlash
(namlash, plyonka, nam qum yoki brezent bilan yopish), beton qorishmasini kechqurun yoki tunda yotqizish tavsiya etiladi.
Simulyatorda "Quruq havoda" qotish sharoiti qanday ta'sir qilishini tekshirib ko'ring.</p>
<p><b>Sho'r gruntlar.</b> Xorazm, Qoraqalpog'iston, Buxoro viloyatlarida grunt va grunt suvlarida sulfat va xlorid tuzlari ko'p.
Sulfatlar sement toshida ettringit hosil qilib, betonni ichidan yemiradi. Bunday joylarda <b>sulfatga chidamli sement</b>,
past S/S va zich beton qo'llaniladi.</p>
<p><b>Seysmiklik.</b> Respublika hududining katta qismi 7–9 balli seysmik zonada joylashgan; ko'tarib turuvchi konstruksiyalar
betonining haqiqiy sinfi loyihadagidan kam bo'lmasligi hayotiy muhim (ShNQ 2.01.03-19).</p>
</div>

<h3>8. Xavfsizlik texnikasi</h3>
<div class="box safe">Press ishlayotganda himoya to'sig'i yopiq bo'lishi kerak — buzilish paytida beton bo'laklari otilib chiqishi mumkin.
Himoya ko'zoynagi taqiladi, namuna faqat press to'xtatilgandan va bosim tushirilgandan keyin olinadi.</div>

<h3>9. Nazorat savollari</h3>
<ol>
<li>Nima uchun kub "qum soat" shaklida buziladi va plitalarni moylash natijani qanday o'zgartiradi?</li>
<li>Kontakt zonasi (ITZ) nima va u nega eng zaif bo'g'in hisoblanadi?</li>
<li>O'rtacha mustahkamlik bir xil bo'lganda variatsiya koeffitsiyenti oshsa, sinf qanday o'zgaradi?</li>
<li>Nima uchun 100 mm li kub natijasi 0,95 ga ko'paytiriladi?</li>
<li>Issiq havoda qotgan beton mustahkamligi nega pastroq bo'ladi?</li>
</ol>
<h3>10. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 10180-2012. Бетоны. Методы определения прочности по контрольным образцам.</li>
<li>GOST 18105-2018. Бетоны. Правила контроля и оценки прочности.</li>
<li>Bajenov Yu.M. Технология бетона. — M.: ASV.</li>
<li>Neville A.M. Properties of Concrete. — Pearson.</li>
</ul>`;

/* ===================== 2. Konus cho'kishi ===================== */
VL.deep.slump = `
<h3>1. Beton qorishmasining reologiyasi</h3>
<p>Yangi tayyorlangan beton qorishmasi suyuqlik ham, qattiq jism ham emas — u <b>qovushqoq-plastik (Bingham) jism</b> kabi o'zini tutadi:</p>
<div class="formula">τ = τ₀ + η<sub>pl</sub> · γ̇</div>
<p>bu yerda τ₀ — <b>oquvchanlik chegarasi</b> (qorishma oqa boshlashi uchun kerak bo'lgan minimal kuchlanish), η<sub>pl</sub> — plastik qovushqoqlik,
γ̇ — siljish tezligi. Konus ko'tarilganda qorishma o'z og'irligi ta'sirida cho'kadi va ichki kuchlanish τ₀ ga tenglashganda to'xtaydi.
Shuning uchun <b>konus cho'kishi asosan oquvchanlik chegarasi τ₀ ni aks ettiradi</b>: τ₀ qancha kichik bo'lsa, cho'kish shuncha katta.</p>
<p>Qovushqoqlikni esa cho'kish tezligi yoki maxsus asboblar (reometr, VeBe asbobi, yoyilish konusi) ko'rsatadi.</p>

<h3>2. Qulay joylanuvchanlik nimaga bog'liq</h3>
${VL.table(['Omil', "Ta'sir"], [
  ['Suv miqdori (1 m³ dagi suv, kg)', "Asosiy omil. \"Doimiy suv sarfi qoidasi\": muayyan to'ldiruvchilar uchun harakatchanlik asosan suv miqdoriga bog'liq, sement miqdori 100–150 kg/m³ oralig'ida o'zgarsa ham deyarli o'zgarmaydi"],
  ["To'ldiruvchi shakli va yirikligi", "Silliq shag'al va yirik donalar suvni kam talab qiladi; o'tkir qirrali chaqiq tosh va mayda qum — ko'p"],
  ["Qumning ulushi (r = Q/(Q+Ch))", 'Optimal qiymatdan kam yoki ko\'p bo\'lsa, harakatchanlik pasayadi yoki qatlamlanish yuzaga keladi'],
  ['Kimyoviy qo\'shimchalar', "Plastifikator va superplastifikatorlar (C-3, polikarboksilatlar) suv sarfini 15–30% kamaytirib, bir xil cho'kishni ta'minlaydi"],
  ['Harorat va vaqt', "Qorishma vaqt o'tishi bilan quyuqlashadi (cho'kish yo'qotilishi); issiqda bu jarayon tezroq"],
])}

<h3>3. Harakatchanlik markalari va qo'llanilishi</h3>
${VL.table(['Marka', "Cho'kish, sm", "Qo'llanilish sohasi"], [
  ['P1', '1–4', 'Vibropresslangan buyumlar, yo\'l qoplamalari, zich armaturalanmagan konstruksiyalar'],
  ['P2', '5–9', 'Poydevorlar, plitalar, ko\'p armaturasiz konstruksiyalar'],
  ['P3', '10–15', 'Armaturalangan devorlar, ustunlar, to\'sinlar'],
  ['P4', '16–20', 'Zich armaturalangan konstruksiyalar, nasos bilan uzatish'],
  ['P5', '≥ 21', 'O\'z-o\'zidan zichlanuvchi betonga yaqin, murakkab qoliplar'],
])}

<h3>4. Cho'kish shakllari</h3>
<ul>
<li><b>To'g'ri cho'kish</b> — qorishma simmetrik pasayadi, shakl saqlanadi. Natija hisobga olinadi.</li>
<li><b>Siljib cho'kish</b> — qorishmaning bir qismi yon tomonga siljiydi. Bu bog'lanuvchanlik yetishmasligini bildiradi; sinov takrorlanadi.</li>
<li><b>Yoyilib ketish</b> — qorishma butunlay tarqaladi (juda suyuq). Bu holda konus usuli yaroqsiz, yoyilish diametri o'lchanadi.</li>
</ul>
<p>Qorishma chetidan suv ajralib chiqsa (<b>suv ajralishi</b>) yoki yirik to'ldiruvchi pastga cho'kib qolsa (<b>qatlamlanish</b>),
cho'kish katta bo'lsa ham qorishma sifatsiz hisoblanadi.</p>

<h3>5. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>Konus balandligi H = 300 mm. Konus ko'tarilgandan keyin qorishma cho'qqisi balandligi h = 215 mm.</p>
<p>OK = H − h = 300 − 215 = 85 mm = <b>8,5 sm</b> → <b>P2</b> markasi.</p>
<p>Loyihada P3 (10–15 sm) talab qilingan. Suv sarfi qoidasiga ko'ra cho'kishni ~1 sm ga oshirish uchun taxminan 2–3 l/m³ suv kerak, ya'ni
~4–10 l/m³ qo'shish lozim. Ammo bunda S/S ham oshadi va mustahkamlik kamayadi! To'g'ri yechim — <b>suv bilan birga sementni ham
oshirish</b> (S/S doimiy saqlanadi) yoki plastifikator qo'shish.</p>
</div>

<h3>6. Xatolik manbalari</h3>
<ul>
<li>Konusni qiyshiq yoki silkitib ko'tarish — siljib cho'kishga olib keladi.</li>
<li>Konusni juda sekin (10 s dan ortiq) ko'tarish — qorishma devorga ishqalanib "osilib qoladi".</li>
<li>Qatlamlarni teng zichlamaslik — ichida bo'shliqlar qoladi.</li>
<li>Namuna olingandan keyin sinovni kechiktirish — cho'kish yo'qotilishi tufayli natija kamayadi.</li>
<li>Quruq konus va taglik — qorishma namligini shimib, ishqalanishni oshiradi.</li>
</ul>

<h3>7. O'zbekiston sharoitida</h3>
<div class="box uz">Yozgi issiqda (35–45 °C) beton qorishmasi zavoddan obyektgacha tashilguncha cho'kishining sezilarli qismini yo'qotishi mumkin.
Ko'pincha haydovchilar obyektda qorishmaga "ko'z bilan" suv qo'shadi — bu S/S ni oshirib, betonni bir-ikki sinfga pasaytiradi.
To'g'ri yo'l: qorishmani salqin suv bilan tayyorlash, sekinlashtiruvchi va plastifikatsiyalovchi qo'shimchalar qo'llash, tashish vaqtini qisqartirish
va qorishmani <b>obyektda qabul qilishda</b> cho'kishni majburiy tekshirish.</div>

<h3>8. Nazorat savollari</h3>
<ol>
<li>Konus cho'kishi qaysi reologik ko'rsatkich bilan bog'liq?</li>
<li>Nega obyektda qorishmaga suv qo'shish mumkin emas?</li>
<li>Siljib cho'kish nimadan dalolat beradi?</li>
<li>Cho'kishni mustahkamlikni pasaytirmasdan oshirishning qanday usullari bor?</li>
</ol>
<h3>9. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 10181-2014. Смеси бетонные. Методы испытаний.</li>
<li>GOST 7473-2010. Смеси бетонные. Технические условия.</li>
<li>Tattersall G.H., Banfill P.F.G. The Rheology of Fresh Concrete.</li>
</ul>`;

/* ===================== 3. Sklerometr ===================== */
VL.deep.schmidt = `
<h3>1. Buzmaydigan nazorat usullari tasnifi</h3>
<p>Konstruksiyadagi beton mustahkamligini namuna kesib olmasdan aniqlash usullari ikki guruhga bo'linadi:</p>
${VL.table(['Guruh', 'Usullar', 'Xususiyati'], [
  ['To\'g\'ridan-to\'g\'ri (mahalliy buzish)', 'Uzib olish, qovurg\'ani sindirish, ankerni sug\'urib olish', "Aniq, kalibrovka shart emas, ammo yuzani qisman shikastlaydi"],
  ['Bilvosita (buzmaydigan)', "Elastik qaytish (sklerometr), plastik deformatsiya, zarba impulsi, ultratovush", "Tez va arzon, lekin <b>kalibrovka bog'liqligi</b> talab qilinadi"],
])}
<p>Ushbu ishda <b>elastik qaytish usuli</b> (Shmidt bolg'asi) o'rganiladi.</p>

<h3>2. Usulning fizik asosi</h3>
<p>Prujinali bo'yoq massa (bolg'acha) betonga urilgan zarb uchiga ma'lum energiya bilan zarba beradi (N tipidagi asbobda ≈ 2,2 J).
Zarba energiyasining bir qismi beton yuzasining plastik deformatsiyasi va mikrobuzilishiga sarflanadi, qolgani bolg'achani orqaga qaytaradi.
<b>Qaytish soni Q</b> — qaytgan masofaning to'liq yo'lga nisbati (shkala bo'yicha 10–100).</p>
<p>Beton qanchalik qattiq va elastik bo'lsa (yuqori elastiklik moduli, kam g'ovaklik), energiya shunchalik kam yo'qoladi va Q katta bo'ladi.
Mustahkamlik ham shu xossalar bilan bog'liq bo'lgani uchun Q va R o'rtasida <b>korrelyatsion bog'liqlik</b> mavjud, ammo u funksional emas:
asbob faqat <b>yuzadagi ~30 mm qatlam</b> xossasini "ko'radi".</p>

<h3>3. Kalibrovka bog'liqligi</h3>
<p>GOST 22690 talabiga ko'ra har bir beton turi uchun alohida bog'liqlik tuziladi: bir xil tarkibli kamida 15 ta kub (yoki 30 ta uchastka)
avval sklerometr bilan, so'ng pressda sinaladi va eng kichik kvadratlar usuli bilan chiziqli tenglama topiladi:</p>
<div class="formula">R = a · Q + b</div>
<p>Bog'liqlikning sifati korrelyatsiya koeffitsiyenti va qoldiq o'rtacha kvadratik og'ish S<sub>T</sub> bilan baholanadi. Ushbu simulyatorda
o'quv maqsadida bitta bog'liqlik R = 1,25·Q − 23 qabul qilingan. Asbobdagi zavod jadvali (universal egri chiziq) faqat taxminiy baho beradi —
xatoligi ±25% gacha yetishi mumkin.</p>

<h3>4. O'lchash natijasiga ta'sir qiluvchi omillar</h3>
${VL.table(['Omil', "Q ga ta'sir", 'Nima qilish kerak'], [
  ['Karbonlashish (eski beton)', "Yuzada CaCO₃ qatlami qattiqroq → Q oshib ketadi", 'Yuzani 5–10 mm silliqlash yoki tuzatish koeffitsiyenti'],
  ['Namlik', "Nam beton yuzasi yumshoqroq → Q kamayadi", 'Quruq yuzada o\'lchash'],
  ['Zarba yo\'nalishi', "Pastga urilganda og'irlik kuchi yordam beradi, yuqoriga — qarshilik qiladi", 'Yo\'nalish bo\'yicha tuzatish'],
  ['Yuzaning notekisligi, suvoq', "Notekis yoki g'ovak yuza Q ni pasaytiradi", 'Abraziv tosh bilan tekislash, suvoqni olib tashlash'],
  ['Zarba nuqtasi ostidagi yirik to\'ldiruvchi yoki g\'ovak', 'Alohida qiymat juda katta yoki kichik chiqadi', "Chetga chiquvchi qiymatlarni chiqarib tashlash"],
  ['Element qalinligi va qirradan masofa', 'Yupqa element tebranib, Q ni pasaytiradi', "Qalinlik ≥ 100 mm, qirradan ≥ 50 mm"],
  ['Armatura ustidan urish', 'Q oshib ketadi', 'Armatura joyini aniqlab, undan uzoqroq urish'],
])}

<h3>5. Statistik ishlov berish</h3>
<p>Har bir uchastkada 9 ta (kamida 5 ta) zarba beriladi; zarba nuqtalari orasidagi masofa ≥ 25 mm. Medianadan ko'p og'ishgan qiymatlar
chiqarib tashlanadi, qolganlari o'rtachalanadi. Har bir uchastka uchun R topiladi, so'ng konstruksiya bo'yicha o'rtacha R̄ va variatsiya
koeffitsiyenti v hisoblanadi. Sinf GOST 18105 bo'yicha baholanadi; buzmaydigan usulda bog'liqlik xatoligi ham hisobga olinadi,
shuning uchun bu ishda v ning kichik qiymati 13,5% dan kam qabul qilinmaydi.</p>

<h3>6. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>Ustun yon yuzasi, zarba gorizontal. 1-uchastka qiymatlari: 38, 36, 37, 39, 35, 37, 52, 36, 38.</p>
<p>Mediana = 37. Qiymat 52 medianadan 15 birlikka farq qiladi → chiqarib tashlanadi.</p>
<p>Q̄ = (38+36+37+39+35+37+36+38) / 8 = 37,0 → R = 1,25·37,0 − 23 = <b>23,3 MPa</b>.</p>
<p>Uch uchastka: 23,3; 25,1; 21,9 MPa → R̄ = 23,4 MPa; v = 6,8% → hisobda 13,5% olinadi.</p>
<p>B = 23,4 · (1 − 1,64·0,135) = 18,2 MPa → beton haqiqiy sinfi <b>B15</b>. Loyihada B20 bo'lsa — konstruksiya qo'shimcha tekshiriladi
(kern olish, ultratovush) va zarurat bo'lsa kuchaytiriladi.</p>
</div>

<h3>7. O'zbekiston sharoitida</h3>
<div class="box uz">
<p>1966-yil 26-apreldagi Toshkent zilzilasidan so'ng respublikada binolarning seysmik chidamliligiga alohida e'tibor beriladi.
Bugungi kunda ko'plab eski (1960–1980-yillar) panel va karkas binolar rekonstruksiya qilinmoqda, qavat qo'shilmoqda yoki
funksiyasi o'zgartirilmoqda. Har bir bunday holatda <b>mavjud konstruksiyalar betonining haqiqiy mustahkamligini aniqlash</b>
majburiy — va birinchi navbatda sklerometr va ultratovush asboblaridan foydalaniladi.</p>
<p>Eski binolarda karbonlashish chuqurligi 10–20 mm va undan ortiq bo'lishi mumkin. Agar yuza tozalanmasa, asbob betonni
haqiqiyidan ancha mustahkam ko'rsatadi — bu xavfli xato. Simulyatorda "eski bino" rejimida buni tekshirib ko'ring.</p>
</div>

<h3>8. Nazorat savollari</h3>
<ol>
<li>Nima uchun sklerometr natijasi faqat kalibrovka bog'liqligi bilan ishonchli bo'ladi?</li>
<li>Karbonlashish Q ga qanday ta'sir qiladi va nega bu xavfli?</li>
<li>Pastga va yuqoriga urilganda tuzatishlar nima uchun turli ishorali?</li>
<li>Qaysi hollarda buzmaydigan usul o'rniga kern (namuna kesib olish) zarur?</li>
</ol>
<h3>9. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 22690-2015. Бетоны. Определение прочности механическими методами неразрушающего контроля.</li>
<li>GOST 18105-2018. Бетоны. Правила контроля и оценки прочности.</li>
<li>ShNQ 2.01.03-19. Seysmik hududlarda qurilish.</li>
<li>Malhotra V.M., Carino N.J. Handbook on Nondestructive Testing of Concrete.</li>
</ul>`;

/* ===================== 4. Vika asbobi ===================== */
VL.deep.vicat = `
<h3>1. Portlandsement tarkibi</h3>
<p>Portlandsement — klinker (ohaktosh va gil aralashmasini ~1450 °C da pishirib olingan mahsulot) va 3–5% gipsni birga maydalashdan olinadi.
Klinkerning asosiy minerallari:</p>
${VL.table(['Mineral', 'Formula (qisqa)', 'Miqdori, %', 'Xususiyati'], [
  ['Alit', 'C₃S', '45–65', 'Tez qotadi, dastlabki va asosiy mustahkamlikni beradi'],
  ['Belit', 'C₂S', '15–30', 'Sekin qotadi, kech mustahkamlik, kam issiqlik'],
  ['Uch kalsiyli aluminat', 'C₃A', '4–12', "Juda tez reaksiya, ko'p issiqlik, sulfatlarga chidamsiz"],
  ['To\'rt kalsiyli alyumoferrit', 'C₄AF', '10–20', "O'rtacha tezlik, sulfatlarga chidamliroq"],
])}

<h3>2. Qotish jarayoni va gipsning roli</h3>
<p>Sement suv bilan aralashgach, birinchi daqiqalarda C₃A eng faol reaksiyaga kirishadi. Gips bo'lmasa, u bir zumda gidroaluminatlar hosil qilib,
xamirni darhol "qotirib qo'yadi" — <b>tezkor (chaqmoq) qotish</b>. Gips C₃A bilan <b>ettringit</b> (kalsiy gidrosulfoaluminati) hosil qiladi;
ettringit qobig'i C₃A zarralarini o'rab, reaksiyani sekinlashtiradi. Natijada xamir 1–3 soat davomida plastik holda qoladi va uni tashish,
yotqizish, zichlash mumkin bo'ladi.</p>
<p>Keyin C₃S ning faol gidratatsiyasi boshlanadi: C–S–H geli zarralar orasidagi bo'shliqni to'ldirib, ularni tutashtiradi —
<b>qotish boshlanishi</b>. Tuzilma tobora zichlashib, xamir plastikligini butunlay yo'qotadi — <b>qotish oxiri</b>. Shundan so'ng
mustahkamlik yig'ilishi (qattiqlashish) boshlanadi.</p>
<div class="box warn"><b>Soxta qotish</b> — maydalash tegirmonida harorat yuqori bo'lsa, gips suvsizlanib yarim gidrat (alebastr)ga aylanadi.
Suv qo'shilgach u tez kristallanib, xamirni bir necha daqiqada quyuqlashtiradi. Qayta aralashtirilsa, plastiklik tiklanadi — haqiqiy
qotishdan farqi shunda.</div>

<h3>3. Nima uchun aynan "normal quyuqlik"?</h3>
<p>Qotish muddatlari xamirdagi suv miqdoriga kuchli bog'liq: suv ko'p bo'lsa, zarralar uzoqroq joylashadi va qotish kech boshlanadi.
Turli sementlarni solishtirish uchun ular <b>bir xil konsistensiyada</b> — normal quyuqlikda sinalishi kerak. Normal quyuqlik (NQ)
pestik (Ø10 mm, umumiy massasi 300 g) xamirga botib, taglikdan 5–7 mm masofada to'xtaydigan suv miqdori bilan aniqlanadi.
Oddiy portlandsement uchun NQ = 24–28%; mineral qo'shimchali sementlarda (masalan, puzzolanli) — 30% va undan ko'p.</p>
<p>NQ sementning <b>suv talabchanligini</b> ko'rsatadi: u qancha yuqori bo'lsa, bir xil harakatchanlikdagi betonga ko'proq suv kerak,
demak S/S oshib, mustahkamlik kamayadi.</p>

<h3>4. Qotish muddatlari talablari</h3>
${VL.table(['Ko\'rsatkich', 'Talab (GOST 10178)', 'Ahamiyati'], [
  ['Qotish boshlanishi', '≥ 45 daqiqa', 'Qorishmani tayyorlash, tashish va yotqizishga vaqt yetishi'],
  ['Qotish oxiri', '≤ 10 soat', 'Qoliplarni tez aylantirish, ish sur\'ati'],
])}
<p>Qotish boshlanishi igna (Ø1,1 mm) taglikka 1–2 mm yetmay to'xtagan vaqt, oxiri — igna xamirga 1–2 mm dan ortiq botmay qolgan vaqt
bilan belgilanadi (vaqt sement va suv aralashgan paytdan hisoblanadi).</p>

<h3>5. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>Sement massasi 400 g. 1-urinish: 100 g suv (25,0%) → pestik taglikdan 11 mm da to'xtadi (quyuq).</p>
<p>2-urinish: 108 g suv (27,0%) → 4 mm (suyuq). 3-urinish: 106 g suv (26,5%) → 6 mm ✔.</p>
<p><b>NQ = 106 / 400 · 100 = 26,5%</b>.</p>
<p>Sement suvga qo'shilgan vaqt 9:00; igna taglikka 2 mm yetmay to'xtadi 11:40 da → qotish boshlanishi <b>2 soat 40 daqiqa</b> (≥ 45 daq ✔);
igna 1 mm botdi 14:00 da → qotish oxiri <b>5 soat</b> (≤ 10 soat ✔).</p>
</div>

<h3>6. Xatolik manbalari</h3>
<ul>
<li>Xamirni aralashtirish vaqti va usuli standartdan farqli — konsistensiya o'zgaradi.</li>
<li>Igna yoki pestikning ifloslanishi, egilishi — botish chuqurligi noto'g'ri.</li>
<li>Ignani bir joyga qayta tushirish yoki halqa chetiga yaqin tushirish.</li>
<li>Xona harorati va namligi standartdan (20 ± 2 °C) farq qilishi — issiqda qotish tezlashadi.</li>
</ul>

<h3>7. O'zbekiston sharoitida</h3>
<div class="box uz">
<p>Respublikada sementni "Ohangaronsement", "Bekobodsement", "Qizilqumsement", "Quvasoysement" kabi yirik zavodlar va ko'plab yangi korxonalar
ishlab chiqaradi. Bozorga turli manbalardan sement kelgani uchun <b>kiruvchi nazorat</b> — har bir partiyaning NQ va qotish muddatlarini
tekshirish muhim.</p>
<p>Yozda 35–40 °C haroratda qotish boshlanishi laboratoriyadagidan ancha erta keladi. Beton qorishmasi uzoq masofaga tashilsa
yoki ko'p qatlamli quyish rejalashtirilsa, <b>sekinlashtiruvchi qo'shimchalar</b> va qotishi kech boshlanadigan sement tanlanadi.
Aks holda "sovuq choklar" (qatlamlar orasida ajralish) paydo bo'ladi.</p>
</div>

<h3>8. Nazorat savollari</h3>
<ol>
<li>Sementga gips nima uchun qo'shiladi? Gipssiz sement qanday qotadi?</li>
<li>Soxta qotishni haqiqiy qotishdan qanday farqlash mumkin?</li>
<li>Nima uchun qotish muddatlari normal quyuqlikdagi xamirda aniqlanadi?</li>
<li>Issiq havoda qotish boshlanishi erta kelishi qurilishda qanday muammolarga olib keladi?</li>
</ol>
<h3>9. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 310.3-76. Цементы. Методы определения нормальной густоты, сроков схватывания и равномерности изменения объема.</li>
<li>GOST 10178-85. Портландцемент и шлакопортландцемент. Технические условия.</li>
<li>Taylor H.F.W. Cement Chemistry. — Thomas Telford.</li>
</ul>`;

/* ===================== 5. Sement markasi ===================== */
VL.deep.cement = `
<h3>1. Sement aktivligi va markasi tushunchasi</h3>
<p><b>Sement aktivligi</b> — standart sharoitda tayyorlangan va 28 sutka qotgan sement-qum qorishmasi namunalarining siqilishdagi mustahkamligi.
<b>Marka</b> — aktivlikning yaxlitlangan, kafolatlangan qiymati (kgs/sm² da): ПЦ 400 — siqilishda kamida 400 kgs/sm² ≈ 39,2 MPa.
Sementni sof xamirda emas, <b>1:3 nisbatli standart qum bilan</b> sinashning sababi — qorishma betonga yaqin ishlaydi va natija takrorlanuvchan bo'ladi.</p>

<h3>2. Standart sinov sharoitlari</h3>
${VL.table(['Parametr', 'Qiymati', 'Nima uchun'], [
  ['Sement : qum', '1 : 3 (massa bo\'yicha)', 'Qumning donadorligi standartlashtirilgan (monofraksiyali, kvars)'],
  ['Suv-sement nisbati', '0,40 (qorishma yoyilishi 106–115 mm)', 'Turli sementlarni bir xil sharoitda solishtirish'],
  ['Namuna', '40 × 40 × 160 mm prizma, 3 tadan', 'Bir namunada ham egilish, ham siqilish sinovi'],
  ['Qotish', '1 sutka qolipda nam havoda, so\'ng 27 sutka suvda, 20 ± 2 °C', 'Gidratatsiyaning to\'liq va bir xil kechishi'],
])}
<div class="box">Yevropa usuli (EN 196-1, GOST 30744) S/S = 0,50 va boshqacha qumdan foydalanadi, natijalar <b>sinflarda</b> (CEM 32,5; 42,5; 52,5 MPa)
ifodalanadi. Ikki tizim natijalarini to'g'ridan-to'g'ri tenglashtirib bo'lmaydi.</div>

<h3>3. Egilishga sinash nazariyasi</h3>
<p>Prizma ikki tayanchga (oraliq l = 100 mm) qo'yilib, o'rtasidan yuklanadi. Eng katta eguvchi moment va qarshilik momenti:</p>
<div class="formula">M = F·l / 4, &nbsp; W = b³ / 6 &nbsp; ⇒ &nbsp; R<sub>eg</sub> = M / W = 1,5 · F · l / b³</div>
<p>b = 40 mm bo'lganda R<sub>eg</sub> = 1,5 · F · 100 / 64 000 = <b>0,00234 · F</b> (F — N da, R — MPa da). Egilishda pastki tola cho'ziladi,
shuning uchun bu sinov aslida <b>cho'zilishdagi mustahkamlikni</b> bilvosita baholaydi. Sement toshi cho'zilishga siqilishdagidan
8–12 marta kam qarshilik ko'rsatadi.</p>

<h3>4. Siqilishga sinash</h3>
<p>Egilishdan qolgan 6 ta yarim prizma 40 × 62,5 mm o'lchamli metall plastinkalar orasida siqiladi. Plastinka yuzasi A = 2500 mm² = 25 sm²,
shuning uchun R<sub>siq</sub> = F / 2500 (F — N da). Plastinkalar yuklamani aniq ma'lum yuzaga taqsimlaydi; yarim prizmaning qolgan qismi
qo'shimcha "obyoma" (cheklov) hosil qiladi.</p>
<p>Natija: egilishda — 3 ta natijadan <b>eng kattalari 2 tasining o'rtachasi</b>, siqilishda — 6 tadan <b>eng kattalari 4 tasining o'rtachasi</b>
(GOST 310.4). Kichik qiymatlar namunadagi tasodifiy nuqsonlar (havo pufagi, qolip nuqsoni) bilan izohlanadi.</p>

<h3>5. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>Egilish: F = 2,45; 2,60; 2,30 kN → R = 5,74; 6,09; 5,39 MPa. Eng kattalari: (6,09 + 5,74)/2 = <b>5,9 MPa</b>.</p>
<p>Siqilish: F = 112, 108, 104, 115, 99, 110 kN → R = 44,8; 43,2; 41,6; 46,0; 39,6; 44,0 MPa.</p>
<p>Eng katta 4 tasi: (46,0 + 44,8 + 44,0 + 43,2)/4 = <b>44,5 MPa</b>.</p>
<p>Jadvalga ko'ra: siqilish 44,5 ≥ 39,2 va egilish 5,9 ≥ 5,4 → <b>ПЦ 400</b> (ПЦ 500 uchun 49,0 MPa kerak — yetmaydi).</p>
</div>

<h3>6. Mustahkamlikning yosh bo'yicha o'sishi</h3>
${VL.table(['Yosh, sutka', '3', '7', '28', '90'], [['R / R₂₈ (oddiy portlandsement), taxminan', '0,40–0,50', '0,60–0,70', '1,00', '1,10–1,20']])}
<p>Tez qotuvchi (ПЦ-Б) sementlarda 3 sutkalik mustahkamlik ham me'yorlanadi. Erta sinov (3, 7 sutka) bilan 28 sutkalik markani
taxminan bashorat qilish mumkin — ishlab chiqarishda bu tezkor nazorat uchun ishlatiladi.</p>

<h3>7. Sement nega aktivligini yo'qotadi</h3>
<p>Sement havodagi namlik va CO₂ ni yutadi: zarralar yuzasi gidratlanib, karbonlashib, "qobiq" hosil qiladi. Taxminan:</p>
${VL.table(['Saqlash muddati (oddiy qopda)', '3 oy', '6 oy', '12 oy'], [["Aktivlik yo'qolishi", '10–20%', '20–30%', '30–40%']])}
<p>Shuning uchun sement quruq, yopiq omborda, poldan ko'tarilgan taglikda saqlanadi; uzoq saqlangan sement qayta sinalib,
haqiqiy markasi bo'yicha ishlatiladi.</p>

<h3>8. O'zbekiston sharoitida</h3>
<div class="box uz">Bozorlarda qopdagi yozuv (masalan, "M400") va haqiqiy marka mos kelmasligi holatlari uchrab turadi. Qishloq joylarda
sement ko'pincha ochiq ayvonda, nam havoda uzoq saqlanadi. Mas'uliyatli inshootlar (ko'p qavatli uylar, ko'priklar, maktablar)
uchun sement partiyasi albatta akkreditatsiyalangan laboratoriyada sinalishi kerak. Simulyatordagi "omborda uzoq saqlangan sement"
varianti shu holatni ko'rsatadi.</div>

<h3>9. Xavfsizlik</h3>
<div class="box safe">Sement changi ko'z va nafas yo'llarini qitiqlaydi, nam sement kuchli ishqoriy (pH ≈ 12–13) — teriga kuyish yetkazishi mumkin.
Respirator, ko'zoynak va qo'lqop bilan ishlanadi.</div>

<h3>10. Nazorat savollari</h3>
<ol>
<li>Nega sement sof holda emas, standart qum bilan sinaladi?</li>
<li>Egilishdagi mustahkamlik formulasini keltirib chiqaring.</li>
<li>Natijalarni hisoblashda nima uchun eng kichik qiymatlar tashlab yuboriladi?</li>
<li>Marka va sinf tushunchalarining farqi nimada?</li>
<li>6 oy nam omborda saqlangan ПЦ 500 sementni qaysi marka sifatida ishlatish mumkin?</li>
</ol>
<h3>11. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 310.4-81. Цементы. Методы определения предела прочности при изгибе и сжатии.</li>
<li>GOST 10178-85. Портландцемент и шлакопортландцемент. Технические условия.</li>
<li>GOST 30744-2001. Цементы. Методы испытаний с использованием полифракционного песка.</li>
</ul>`;
