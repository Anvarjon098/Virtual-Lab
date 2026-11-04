'use strict';
/* Chuqurlashtirilgan nazariya: to'ldiruvchilar va devorbop materiallar */

/* ===================== 6. Qumning elak tahlili ===================== */
VL.deep.sieve = `
<h3>1. Qum betonda qanday vazifani bajaradi</h3>
<p>Mayda to'ldiruvchi (0,16–5 mm) beton hajmining 25–35% ini egallaydi. U yirik to'ldiruvchi donalari orasidagi bo'shliqlarni to'ldiradi,
sement toshining kirishishini kamaytiradi va qorishmaga bog'lanuvchanlik beradi. Qum donalarining yuzasi sement xamiri bilan qoplanishi
kerak, shuning uchun <b>solishtirma yuza</b> muhim: qum qancha mayda bo'lsa, umumiy yuza shuncha katta va sement xamiri sarfi ko'p.</p>
<div class="box">Masalan, qum yirikligi ikki marta kamaysa, donalarning umumiy yuzasi taxminan ikki marta oshadi — ularni namlash va qoplash uchun
ko'proq suv va sement kerak bo'ladi.</div>

<h3>2. Donadorlik tarkibi va bo'shliqlilik</h3>
<p>Ideal to'ldiruvchi — turli o'lchamdagi donalar shunday nisbatda bo'lsinki, kichik donalar kattalari orasidagi bo'shliqlarni ketma-ket to'ldirsin.
Bunda <b>bo'shliqlilik</b> minimal bo'ladi (bir o'lchamli qumda ~45–48%, yaxshi donadorlikda 35–38%), demak bo'shliqlarni to'ldiruvchi sement xamiri
ham kamroq kerak. Shuning uchun me'yorlar faqat o'rtacha yiriklikni (Mk) emas, balki to'liq qoldiqlar <b>egri chizig'ining ruxsat etilgan zona</b>
ichida bo'lishini ham talab qiladi.</p>
<h4>Asosiy ko'rsatkichlar</h4>
<ul>
<li><b>Xususiy qoldiq</b> a<sub>i</sub> = m<sub>i</sub> / m · 100% — aynan shu elakda qolgan qism.</li>
<li><b>To'liq qoldiq</b> A<sub>i</sub> = a<sub>2,5</sub> + … + a<sub>i</sub> — shu elak va undan yirik elaklardagi qoldiqlar yig'indisi.</li>
<li><b>Yiriklik moduli</b> Mk = (A<sub>2,5</sub> + A<sub>1,25</sub> + A<sub>0,63</sub> + A<sub>0,315</sub> + A<sub>0,16</sub>) / 100.</li>
</ul>
<p>Mk — bu aslida donadorlik egri chizig'i ostidagi yuzaga proporsional kattalik. Bir xil Mk ga ega ikki qum turli donadorlikka ega bo'lishi mumkin,
shu sababli grafik tahlili ham zarur.</p>

<h3>3. Hisoblash namunasi</h3>
<div class="calc-ex">
${VL.table(['Elak, mm', '2,5', '1,25', '0,63', '0,315', '0,16', '< 0,16'], [
  ['Qoldiq m<sub>i</sub>, g', '50', '100', '250', '300', '220', '80'],
  ['Xususiy a<sub>i</sub>, %', '5', '10', '25', '30', '22', '8'],
  ["To'liq A<sub>i</sub>, %", '5', '15', '40', '70', '92', '—'],
])}
<p>Mk = (5 + 15 + 40 + 70 + 92) / 100 = <b>2,22</b> → <b>o'rta</b> qum (2,0–2,5). A<sub>0,63</sub> = 40% — o'rta qum uchun me'yordagi 30–45% oralig'ida ✔.</p>
<p>Elaklardan o'tgan qism (8%) chang va gil zarralari bilan birga juda mayda donalarni ham o'z ichiga oladi; chang-gil zarralari miqdori alohida —
yuvish usuli bilan aniqlanadi.</p>
</div>

<h3>4. Zararli aralashmalar</h3>
${VL.table(['Aralashma', "Ta'siri", 'Aniqlash'], [
  ['Chang va gil zarralari', "Donalar sirtini qoplab, sement toshi bilan tishlashishni buzadi; suv talabini oshiradi", "Yuvish (cho'ktirish) usuli"],
  ['Gil bo\'laklari', 'Betonda zaif joylar hosil qiladi, namlanganda bo\'kadi', 'Ajratib olib tortish'],
  ['Organik aralashmalar (gumus)', "Sement gidratatsiyasini sekinlashtiradi", "NaOH eritmasi bilan rang (kolorimetrik) sinovi"],
  ['Sulfat va sulfidlar', "Sulfat korroziyasi (ettringit hosil bo'lishi)", 'Kimyoviy tahlil'],
  ['Amorf kremnezyom', "Ishqor-kremnezyom reaksiyasi — betonning ichdan yorilishi", 'Petrografik va kimyoviy tahlil'],
])}

<h3>5. Xatolik manbalari</h3>
<ul>
<li>Namunani to'liq quritmaslik — nam donalar bir-biriga yopishib, mayda qism yirik elaklarda qoladi.</li>
<li>Elash vaqti yetarli emas yoki elaklar haddan tashqari to'ldirilgan.</li>
<li>Elak to'rining yirtilishi yoki tiqilib qolishi — doimiy tekshirib turiladi.</li>
<li>Qoldiqlarni tortishda yo'qotishlar: qoldiqlar yig'indisi namuna massasidan ko'pi bilan 1% farq qilishi kerak.</li>
<li>Namuna vakil emas — qum uyumining turli joylaridan olingan namunalar aralashtirilib, kvartlash usulida qisqartiriladi.</li>
</ul>

<h3>6. O'zbekiston sharoitida</h3>
<div class="box uz">
<p>Respublika hududining katta qismini <b>Qizilqum</b> va <b>Mirzacho'l</b> kabi cho'llar egallaydi; barxan qumlari zaxirasi deyarli cheksiz, ammo ular
juda mayda (Mk ≈ 0,7–1,2), bir o'lchamli va donalari silliqlangan. Bunday qumda beton suvni va sementni ko'p talab qiladi.</p>
<p>Barxan qumidan foydalanish yo'llari: (1) <b>maydalangan qum</b> yoki tosh maydalash chiqindisi (otsev) bilan aralashtirib, Mk ni 1,8–2,2 gacha oshirish;
(2) <b>superplastifikator</b> qo'shib suv sarfini kamaytirish; (3) qorishmalar (suvoq, terish qorishmasi) va past sinfli betonlarda qo'llash.
Simulyatorda barxan va maydalangan qum natijalarini solishtirib ko'ring.</p>
<p>Daryo qumlari (Chirchiq, Zarafshon, Sirdaryo, Amudaryo havzalari) sifatliroq, ammo ularni qazib olish ekologik cheklovlarga ega — shu sababli
maydalangan qumga talab tobora oshmoqda.</p>
</div>

<h3>7. Nazorat savollari</h3>
<ol>
<li>Xususiy va to'liq qoldiqlar o'rtasidagi farq nima?</li>
<li>Bir xil Mk ga ega qumlar nega betonda turlicha natija berishi mumkin?</li>
<li>Juda mayda qum betonning qaysi xossalarini yomonlashtiradi va nega?</li>
<li>Chang-gil zarralari elak tahlilida qayerda qoladi va ular nega zararli?</li>
</ol>
<h3>8. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 8735-88. Песок для строительных работ. Методы испытаний.</li>
<li>GOST 8736-2014. Песок для строительных работ. Технические условия.</li>
<li>GOST 31424-2010. Материалы строительные нерудные от отсевов дробления.</li>
</ul>`;

/* ===================== 7. G'isht markasi ===================== */
VL.deep.brick = `
<h3>1. Keramik g'ishtning olinishi va tuzilishi</h3>
<p>Keramik g'isht gil (yoki lyossimon suglinka) xom ashyosini qoliplash, quritish va <b>950–1050 °C</b> da pishirishdan olinadi. Pishirish jarayonida
quyidagilar sodir bo'ladi:</p>
${VL.table(['Harorat, °C', 'Jarayon'], [
  ['100–200', 'Fizik bog\'langan suvning chiqishi'],
  ['450–600', 'Gil minerallarining degidratatsiyasi (kristall panjaradagi suvning chiqishi)'],
  ['573', "Kvarsning modifikatsion o'zgarishi (hajm keskin o'zgaradi — tez qizdirilsa yoriq paydo bo'ladi)"],
  ['750–900', 'Karbonatlarning parchalanishi: CaCO₃ → CaO + CO₂'],
  ['900–1050', "Suyuq faza (eritma) hosil bo'lishi, zarralarning pishib birikishi (spekaniye)"],
])}
<p>Natijada g'isht sopol (keramik) toshga aylanadi: kristall faza, shishasimon faza va g'ovaklardan iborat tuzilma hosil bo'ladi.
Mustahkamlik asosan <b>shishasimon fazaning miqdori</b> va g'ovaklik bilan belgilanadi.</p>

<h3>2. Pishirish sifati va nuqsonlar</h3>
${VL.table(['Holat', 'Belgilari', 'Xossalari'], [
  ['Chala pishgan (nedojog)', "Och-qizg'ish rang, urilganda bo'g'iq tovush", 'Mustahkamlik past, suv shimuvchanlik yuqori, sovuqqa chidamsiz'],
  ['Normal pishgan', "Bir xil qizil rang, jarangli tovush", 'Talablarga javob beradi'],
  ['O\'ta pishgan (perejog)', "To'q, qoramtir rang, shishasimon yuza, qiyshiqlik", 'Mustahkam, ammo shakli buzilgan, qorishma bilan yomon tishlashadi'],
  ['Ohak qo\'shimchalari ("dutik")', "Yuzada ko'chib tushgan joylar", "CaO namlikda so'nib hajmi kattalashadi va g'ishtni yoradi"],
])}
<p>Ushbu simulyatorda partiyadagi tasodifiy nuqsonli namunalar shu sabablarni aks ettiradi.</p>

<h3>3. Nima uchun g'isht ikki yarim qilib sinaladi</h3>
<p>Terish ishida g'isht devorda qorishma qatlamlari orasida yotadi va yuklama yotiq yuzaga ta'sir qiladi. Standart sinovda g'isht ikkiga bo'linib,
yarimlari bir-birining ustiga sement qorishmasi bilan yopishtiriladi — balandligi kengligiga yaqin namuna hosil bo'ladi. Yuzalar tekislanadi,
shunda yuklama tekis taqsimlanadi. Yuza A = a·b (taxminan 120 × 125 mm) — yuqori va pastki yuzalarning o'rtachasi bo'yicha olinadi.</p>
<div class="box">G'isht markasini belgilash uchun siqilishdan tashqari <b>egilishdagi</b> mustahkamlik ham me'yorlanadi: devordagi notekis qorishma
qatlami g'ishtni egilishga ishlatadi. Ushbu laboratoriya ishida faqat siqilish o'rganiladi.</div>

<h3>4. Markani belgilash qoidasi</h3>
<p>Marka ikki shart birga bajarilganda beriladi: 5 namunaning <b>o'rtacha</b> mustahkamligi va <b>eng kichik</b> natija jadvaldagi qiymatlardan kam emas.
Ikkinchi shart muhim: o'rtachasi yuqori, lekin bitta namunasi juda zaif partiya devorda xavfli zaif nuqtalar hosil qiladi.</p>

<h3>5. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>5 ta namuna, A ≈ 120 × 125 = 15 000 mm². Buzuvchi kuchlar: 210, 195, 225, 180, 200 kN.</p>
<p>R = 14,0; 13,0; 15,0; 12,0; 13,3 MPa → R̄ = <b>13,5 MPa</b>, R<sub>min</sub> = <b>12,0 MPa</b>.</p>
<p>M150 uchun R̄ ≥ 15,0 kerak — bajarilmaydi. M125 uchun R̄ ≥ 12,5 ✔, R<sub>min</sub> ≥ 10,0 ✔ → <b>g'isht markasi M125</b>.</p>
</div>

<h3>6. Devor mustahkamligi g'isht mustahkamligidan nega kam</h3>
<p>Terim mustahkamligi g'isht mustahkamligining atigi 25–50% ini tashkil qiladi. Sabablari: qorishma qatlami notekis bo'lgani uchun g'isht
egilish va kesilishga ishlaydi; qorishma g'ishtdan yumshoq bo'lib, yon tomonga ko'proq kengayadi va g'ishtni cho'zadi; choklarning qalinligi
va to'liq to'ldirilmaganligi. Shuning uchun terim mustahkamligi g'isht markasi bilan birga <b>qorishma markasiga</b> ham bog'liq.</p>

<h3>7. O'zbekiston sharoitida</h3>
<div class="box uz">
<p>O'zbekistonda keramik g'isht asosan <b>lyoss va lyossimon suglinkalardan</b> ishlab chiqariladi — bu xom ashyo deyarli barcha viloyatlarda bor.
Ammo lyossda karbonatlar ko'p bo'lgani uchun "dutik" nuqsoni xavfi yuqori; xom ashyo yaxshi maydalanishi kerak.</p>
<p>Pishgan g'isht — milliy me'morchilikning asosiy materiali: Buxoro, Xiva, Samarqand obidalari ming yildan ortiq turibdi. Hozir esa ko'plab
kichik g'isht zavodlari mahsulotining sifati turlicha, shuning uchun partiyani qabul qilishda marka tekshiruvi zarur.</p>
<p><b>Seysmik hududlarda</b> (ShNQ 2.01.03-19) g'isht devorlar uchun g'isht va qorishma markasiga, shuningdek qorishmaning g'ishtga tishlashish
mustahkamligiga minimal talablar qo'yiladi; devorlar temir-beton belbog'lar va o'zaklar bilan kuchaytiriladi.</p>
</div>

<h3>8. Xavfsizlik</h3>
<div class="box safe">G'isht buzilganda o'tkir parchalar otilib chiqadi. Press himoya to'sig'i bilan ishlatiladi, ko'zoynak taqiladi.</div>

<h3>9. Nazorat savollari</h3>
<ol>
<li>Pishirish haroratining past yoki yuqori bo'lishi g'isht xossalariga qanday ta'sir qiladi?</li>
<li>Marka belgilashda nima uchun eng kichik natija ham hisobga olinadi?</li>
<li>"Dutik" nuqsoni qanday paydo bo'ladi?</li>
<li>Nega terim mustahkamligi g'isht mustahkamligidan ancha past?</li>
</ol>
<h3>10. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 530-2012. Кирпич и камень керамические. Общие технические условия.</li>
<li>GOST 8462-85. Материалы стеновые. Методы определения пределов прочности при сжатии и изгибе.</li>
<li>ShNQ 2.01.03-19. Seysmik hududlarda qurilish.</li>
</ul>`;

/* ===================== 8. Zichlik, suv shimuvchanlik, g'ovaklik ===================== */
VL.deep.absorption = `
<h3>1. Material tuzilishi: qattiq skelet va g'ovaklar</h3>
<p>Har qanday qurilish materiali qattiq moddadan (skelet) va g'ovaklardan iborat. Shu sababli ikki xil zichlik farqlanadi:</p>
<ul>
<li><b>Haqiqiy zichlik ρ</b> — g'ovaklarsiz qattiq moddaning zichligi (kukun holiga keltirib, piknometrda aniqlanadi). Mineral materiallarda 2,5–2,8 g/sm³.</li>
<li><b>O'rtacha zichlik ρ₀</b> — materialning tabiiy holatdagi (g'ovaklar bilan birga) hajm birligi massasi: ρ₀ = m / V.</li>
</ul>
<div class="formula">P = (1 − ρ₀ / ρ) · 100%</div>
<p>G'ovaklik materialning deyarli barcha xossalarini belgilaydi: mustahkamlik, issiqlik o'tkazuvchanlik, suv shimuvchanlik, sovuqqa chidamlilik,
tovush yutish.</p>

<h3>2. Ochiq va yopiq g'ovaklar</h3>
<p>G'ovaklar <b>ochiq</b> (sirt bilan tutashgan, suv kira oladi) va <b>yopiq</b> (alohida, suv kirmaydi) bo'ladi. Suv shimuvchanlik faqat ochiq g'ovaklarni
ko'rsatadi. Hajm bo'yicha suv shimuvchanlik W<sub>v</sub> ochiq g'ovaklik ulushiga taxminan teng, shuning uchun:</p>
<div class="formula">K<sub>to'y</sub> = W<sub>v</sub> / P</div>
<p><b>To'yinish koeffitsiyenti</b> (0 dan 1 gacha) — g'ovaklarning qancha qismi suvga to'lishini ko'rsatadi. U <b>sovuqqa chidamlilik</b>ni bilvosita
baholashda ishlatiladi: suv muzlaganda hajmi ~9% ga ortadi; agar g'ovaklarda bo'sh joy (zaxira) bo'lsa, muz bosimi so'nadi. Odatda K<sub>to'y</sub> &lt; 0,8 bo'lsa,
material sovuqqa chidamliroq deb taxmin qilinadi.</p>

<h3>3. Suvning boshqa xossalarga ta'siri</h3>
<ul>
<li><b>Yumshash koeffitsiyenti</b> K<sub>yum</sub> = R<sub>to'y</sub> / R<sub>quruq</sub>. K<sub>yum</sub> ≥ 0,8 bo'lgan materiallar <b>suvga chidamli</b> deyiladi
va nam sharoitda ishlatilishi mumkin. Gips va ganchda K<sub>yum</sub> ≈ 0,3–0,45.</li>
<li><b>Issiqlik o'tkazuvchanlik</b> — suvning issiqlik o'tkazuvchanligi havodan ~25 marta yuqori, nam devor yomon issiqlik saqlaydi.</li>
<li><b>Massa va o'lcham o'zgarishi</b> — ba'zi materiallar namlanib bo'kadi, qurib kirishadi, natijada yoriqlar paydo bo'ladi.</li>
</ul>

<h3>4. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>Keramik g'isht: 250 × 120 × 65 mm → V = 1950 sm³. Quruq massa m₁ = 3510 g, suvga to'yingan massa m₂ = 3990 g, ρ = 2,62 g/sm³.</p>
<p>ρ₀ = 3510 / 1950 = <b>1,80 g/sm³</b> = 1800 kg/m³.</p>
<p>W<sub>m</sub> = (3990 − 3510) / 3510 · 100 = <b>13,7%</b>; &nbsp; W<sub>v</sub> = 13,7 · 1,80 = <b>24,6%</b>.</p>
<p>P = (1 − 1,80 / 2,62) · 100 = <b>31,3%</b>; &nbsp; K<sub>to'y</sub> = 24,6 / 31,3 = <b>0,79</b>.</p>
<p><i>Talqin:</i> g'ovaklarning ~79% i ochiq va suvga to'ladi, zaxira g'ovaklar kam — sovuqqa chidamlilikni bevosita sinash (muzlatish-eritish tsikllari) tavsiya etiladi.</p>
</div>

<h3>5. Xatolik manbalari</h3>
<ul>
<li>Namunani doimiy massagacha quritmaslik (ikki ketma-ket tortish farqi ≤ 0,1%).</li>
<li>To'yingan namuna yuzasidagi suvni artmaslik yoki aksincha, quruq latta bilan g'ovaklardan suvni shimib olish (nam latta ishlatiladi).</li>
<li>Noto'g'ri shaklli namunada hajmni o'lchash xatosi — bunday hollarda gidrostatik tortish usuli qo'llaniladi.</li>
<li>To'yintirish vaqti yetarli emas — yirik g'ovakli materiallarda suv sekin kiradi.</li>
</ul>

<h3>6. O'zbekiston sharoitida</h3>
<div class="box uz">
<p>Respublikaning ko'p hududlarida (ayniqsa Xorazm, Buxoro, Qoraqalpog'iston) grunt suvlari yuqori va sho'r. Suv kapillyarlar orqali devorga
ko'tariladi, bug'langach tuzlar g'ovaklarda kristallanadi va materialni yemiradi. Xiva va Buxoro obidalari poydevor qismidagi g'ishtlarning
yemirilishi aynan shu jarayon bilan bog'liq. Shuning uchun devorning pastki qismi uchun suv shimuvchanligi kam materiallar va
gidroizolyatsiya qatlami zarur.</p>
<p>Gazobeton O'zbekistonda zamonaviy uy-joy qurilishida keng ishlatilmoqda. Uning g'ovakligi ~80% gacha, issiqlik saqlashi a'lo, ammo suvni ko'p
shimadi — shu sababli tashqi yuzasi bug' o'tkazuvchan, lekin suv o'tkazmaydigan suvoq bilan himoyalanishi kerak.</p>
<p><b>Ganch</b> (mahalliy gips) bezak ishlarida keng qo'llaniladi; yumshash koeffitsiyenti past bo'lgani uchun u faqat quruq ichki xonalarda ishlatiladi.</p>
</div>

<h3>7. Nazorat savollari</h3>
<ol>
<li>Nima uchun hajm bo'yicha suv shimuvchanlik umumiy g'ovaklikdan katta bo'la olmaydi?</li>
<li>To'yinish koeffitsiyenti sovuqqa chidamlilik bilan qanday bog'liq?</li>
<li>Gazobetonning massa bo'yicha suv shimuvchanligi nega juda katta (30–40%) chiqadi?</li>
<li>Qaysi materiallar suvga chidamli hisoblanadi?</li>
</ol>
<h3>8. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 7025-91. Кирпич и камни керамические и силикатные. Методы определения водопоглощения, плотности и контроля морозостойкости.</li>
<li>GOST 12730.0…12730.3-2020. Бетоны. Методы определения плотности, влажности, водопоглощения.</li>
<li>Gorchakov G.I., Bajenov Yu.M. Строительные материалы. — M.: Stroyizdat.</li>
</ul>`;
