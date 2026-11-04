'use strict';
/* Chuqurlashtirilgan nazariya: metallar, yo'l materiallari, gruntlar */

/* ===================== 9. Armaturani cho'zilishga sinash ===================== */
VL.deep.steel = `
<h3>1. Po'latning ichki tuzilishi</h3>
<p>Armatura po'lati — temirning uglerod (0,1–0,4%), marganes, kremniy va boshqa elementlar bilan qotishmasi. Uning tuzilmasi
<b>ferrit</b> (yumshoq, plastik) va <b>perlit</b> (ferrit va sementit Fe₃C qatlamlari — qattiqroq) donalaridan iborat. Uglerod miqdori oshsa,
mustahkamlik ortadi, ammo plastiklik va payvandlanuvchanlik kamayadi.</p>
<p>Metallning plastik deformatsiyasi kristall panjaradagi nuqsonlar — <b>dislokatsiyalarning</b> siljishi orqali sodir bo'ladi. Dislokatsiyalar harakatini
qanchalik qiyinlashtirsak (mayda donalar, legirlash, sovuqlayin ishlov berish, termik puxtalash), po'lat shunchalik mustahkam bo'ladi.</p>

<h3>2. Cho'zilish diagrammasining bosqichlari</h3>
${VL.table(['Bosqich', "Nima sodir bo'ladi", 'Xarakterli kattalik'], [
  ['I. Elastik', "Atomlar orasidagi masofa qaytar o'zgaradi; yuk olinsa namuna asl holiga qaytadi. Guk qonuni: σ = E·ε", 'E ≈ 2·10⁵ MPa, proporsionallik chegarasi'],
  ['II. Oquvchanlik maydonchasi', "Dislokatsiyalar uglerod atomlari \"bulutidan\" uzilib, ommaviy siljiydi; yuk deyarli o'zgarmay deformatsiya oshadi (Lyuders chiziqlari)", 'σ<sub>t</sub> — fizik oquvchanlik chegarasi'],
  ['III. Puxtalanish', "Dislokatsiyalar ko'payib, bir-birini to'sadi — deformatsiya uchun ko'proq kuch kerak", 'σ<sub>v</sub> — vaqtinchalik qarshilik (eng katta kuch)'],
  ['IV. Bo\'yincha hosil bo\'lishi', "Deformatsiya bir joyda to'planadi, kesim keskin kichrayadi, kuch kamayadi", 'Bir tekis cho\'zilish δ<sub>p</sub>'],
  ['V. Uzilish', "Bo'yinchada mikrog'ovaklar birlashib, \"kosa-konus\" shaklidagi uzilish", 'δ, ψ — plastiklik ko\'rsatkichlari'],
])}
<div class="box">Issiqlayin prokat qilingan A240 va A400 po'latlarda oquvchanlik maydonchasi aniq ko'rinadi. Termomexanik puxtalangan A500C va A600
po'latlarda u yo'q — shuning uchun <b>shartli oquvchanlik chegarasi σ<sub>0,2</sub></b> ishlatiladi: qoldiq deformatsiya 0,2% ga yetgandagi kuchlanish
(grafikda elastik qismga parallel chiziq o'tkazib topiladi).</div>

<h3>3. Muhandislik va haqiqiy kuchlanish</h3>
<p>Standart sinovda kuchlanish <b>boshlang'ich</b> kesim yuzasi bo'yicha hisoblanadi: σ = F / A₀. Bo'yincha hosil bo'lgach haqiqiy kesim ancha kichik
bo'ladi, shuning uchun diagrammadagi kuchlanish pasaygandek ko'rinadi, ammo bo'yinchadagi haqiqiy kuchlanish uzilishgacha o'sib boradi.
Loyihalashda muhandislik qiymatlari ishlatiladi.</p>

<h3>4. Ko'rsatkichlar va ularning ma'nosi</h3>
${VL.table(['Ko\'rsatkich', 'Formula', 'Ahamiyati'], [
  ['Oquvchanlik chegarasi', 'σ<sub>t</sub> = F<sub>t</sub> / A₀', "Hisobiy qarshilikning asosi — konstruksiya shundan oshmasligi kerak"],
  ['Vaqtinchalik qarshilik', 'σ<sub>v</sub> = F<sub>max</sub> / A₀', "Mustahkamlik zaxirasi; σ<sub>v</sub>/σ<sub>t</sub> nisbati ≥ 1,05–1,25 bo'lishi zarur"],
  ['Nisbiy uzayish', 'δ₅ = (l₁ − l₀) / l₀ · 100%, l₀ = 5d', "Plastiklik — buzilishdan oldin \"ogohlantirish\" qobiliyati"],
  ['Nisbiy torayish', 'ψ = (A₀ − A₁) / A₀ · 100%', 'Bo\'yinchadagi plastiklik'],
])}

<h3>5. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>A400, d = 12 mm → A₀ = π·12² / 4 = 113,1 mm². F<sub>t</sub> = 48,5 kN, F<sub>max</sub> = 70,0 kN; l₀ = 5d = 60 mm, l₁ = 71,5 mm.</p>
<p>σ<sub>t</sub> = 48 500 / 113,1 = <b>429 MPa</b> (≥ 400 ✔); &nbsp; σ<sub>v</sub> = 70 000 / 113,1 = <b>619 MPa</b> (≥ 590 ✔).</p>
<p>δ₅ = (71,5 − 60) / 60 · 100 = <b>19,2%</b> (≥ 16 ✔); &nbsp; σ<sub>v</sub>/σ<sub>t</sub> = 1,44.</p>
<p>Xulosa: namuna A400 sinfi talablariga javob beradi.</p>
</div>

<h3>6. Plastiklik nega seysmik hududda hal qiluvchi</h3>
<p>Zilzila paytida konstruksiya elastik chegaradan chiqib, ko'p marta yo'nalishini o'zgartiruvchi deformatsiyalarni boshdan kechiradi. Plastik
armatura energiyani yutib, binoni qulashdan saqlaydi — "egiladi, ammo sinmaydi". Mo'rt armatura esa to'satdan uziladi. Shu sababli
seysmik hududlarda (ShNQ 2.01.03-19) <b>yetarli plastiklikka ega</b> (masalan, "C" — payvandlanuvchi, A500C kabi) armatura qo'llaniladi,
σ<sub>v</sub>/σ<sub>t</sub> nisbati va δ ga qo'shimcha talablar qo'yiladi. Payvandlash va sovuqlayin egish ham nazorat qilinadi — ular plastiklikni kamaytiradi.</p>

<h3>7. Xatolik manbalari</h3>
<ul>
<li>Namunaning qisqichlarda qiyshiq o'rnatilishi — egilish qo'shiladi, natija pasayadi.</li>
<li>Davriy profilli armaturada diametrni noto'g'ri olish — nominal diametr yoki massa bo'yicha hisoblangan yuza ishlatiladi.</li>
<li>Namuna qisqich ichida yoki uning yonida uzilsa — sinov haqiqiy emas (qayta sinaladi).</li>
<li>Yuklash tezligi juda yuqori — oquvchanlik chegarasi oshib ketadi.</li>
</ul>

<h3>8. O'zbekiston sharoitida</h3>
<div class="box uz">Respublikada armatura asosan Bekoboddagi O'zbekiston metallurgiya kombinatida va yangi xususiy zavodlarda ishlab chiqariladi, bir qismi
import qilinadi. Bozorda sertifikatsiz yoki "yengillashtirilgan" (diametri nominaldan kichik) armatura uchrashi mumkin. Shuning uchun har bir partiya
uchun sertifikat tekshiriladi, shubha bo'lsa — laboratoriyada cho'zilishga va sovuqlayin egishga sinaladi.</div>

<h3>9. Xavfsizlik</h3>
<div class="box safe">Uzilish paytida namuna uchlari katta tezlikda otilishi mumkin. Mashina himoya ekrani bilan ishlatiladi, sinov zonasida turish taqiqlanadi.</div>

<h3>10. Nazorat savollari</h3>
<ol>
<li>Nima uchun ba'zi po'latlarda oquvchanlik maydonchasi bo'ladi, ba'zilarida bo'lmaydi?</li>
<li>σ<sub>0,2</sub> grafikdan qanday aniqlanadi?</li>
<li>Bo'yincha hosil bo'lgach diagrammada kuchlanish nima uchun kamayadi?</li>
<li>Seysmik hududlarda armaturaning plastikligiga nega alohida talab qo'yiladi?</li>
</ol>
<h3>11. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 12004-81. Сталь арматурная. Методы испытания на растяжение.</li>
<li>GOST 34028-2016. Прокат арматурный для железобетонных конструкций. Технические условия.</li>
<li>GOST 1497-84. Металлы. Методы испытаний на растяжение.</li>
</ul>`;

/* ===================== 10. Neft bitumi ===================== */
VL.deep.bitumen = `
<h3>1. Bitumning tarkibi va kolloid tuzilishi</h3>
<p>Neft bitumi — neftni qayta ishlashda (gudronni vakuumda haydash yoki havo bilan oksidlash) olinadigan og'ir uglevodorodlar aralashmasi.
Uning tarkibi SARA guruhlariga ajratiladi:</p>
${VL.table(['Guruh', 'Miqdori, %', 'Roli'], [
  ['Asfaltenlar', '10–25', "Qattiq, eng yirik molekulalar — bitumga qattiqlik va issiqqa chidamlilik beradi"],
  ['Smolalar', '20–40', "Asfaltenlarni o'rab, ularni moyda muallaq tutadi; yopishqoqlik va plastiklik beradi"],
  ['Moylar (aromatik va to\'yingan)', '40–60', 'Dispersion muhit — bitumni yumshoq va oquvchan qiladi'],
])}
<p>Bitum — <b>kolloid sistema</b>: smolalar bilan qoplangan asfalten mitsellalari moyda tarqalgan. Asfaltenlar kam bo'lsa — <b>zol</b> tuzilma
(yumshoq, haroratga sezgir), ko'p bo'lsa — <b>gel</b> tuzilma (qattiq, elastik), oraliq holat — <b>zol-gel</b> (yo'l bitumlari uchun eng yaxshisi).</p>

<h3>2. Bitum — termoplastik material</h3>
<p>Bitumning xossalari haroratga juda bog'liq: past haroratda u mo'rt shishasimon jism, o'rtacha haroratda qovushqoq-elastik, yuqorida —
suyuqlik. Yo'l qoplamasi uchun eng muhimi — bitum <b>keng harorat oralig'ida</b> ishchi holatda qolishi:</p>
<ul>
<li>yozda yumshab, g'ildirak izi (koleya) va to'lqin hosil qilmasligi — <b>yumshash harorati</b> (Halqa va Shar) yuqori bo'lishi;</li>
<li>qishda mo'rtlashib yorilmasligi — <b>mo'rtlik harorati</b> (Fraas usuli) past bo'lishi;</li>
<li>o'rtacha haroratda yetarli qattiqlik — <b>penetratsiya</b> (25 °C da igna botishi, 0,1 mm birlikda).</li>
</ul>
<p>Penetratsiya va yumshash harorati orasidagi bog'liqlik <b>penetratsiya indeksi PI</b> bilan ifodalanadi. Yumshash haroratida barcha
bitumlarning penetratsiyasi taxminan 800 birlik deb qabul qilinadi:</p>
<div class="formula">A = (lg 800 − lg P₂₅) / (T<sub>HSh</sub> − 25), &nbsp; PI = (20 − 500·A) / (1 + 50·A)</div>
${VL.table(['PI', 'Bitum turi', 'Xususiyati'], [
  ['< −2', 'Zol tuzilmali', "Haroratga o'ta sezgir — yozda yumshaydi, qishda mo'rt"],
  ['−1 … +1', 'Zol-gel (yo\'l bitumlari)', 'Optimal'],
  ['> +2', 'Gel tuzilmali (oksidlangan, qurilish bitumlari)', "Elastik, kam sezgir, ammo yopishqoqligi past"],
])}

<h3>3. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>Uch o'lchov: 70, 74, 72 → P₂₅ = 72 (0,1 mm); yumshash harorati T<sub>HSh</sub> = 49 °C.</p>
<p>A = (2,903 − 1,857) / (49 − 25) = 1,046 / 24 = 0,0436.</p>
<p>PI = (20 − 21,8) / (1 + 2,18) = <b>−0,56</b> → normal yo'l bitumi.</p>
<p>P = 72 → <b>БНД 60/90</b> (61–90), T<sub>HSh</sub> = 49 ≥ 47 ✔. Toshkent va Farg'ona vodiysi uchun mos.</p>
</div>

<h3>4. Bitumning eskirishi</h3>
<p>Asfaltbeton tayyorlash jarayonida (bitum 150–160 °C gacha qizdiriladi) va yo'lda yillar davomida bitum <b>oksidlanadi</b> va yengil
fraksiyalarni yo'qotadi: moylar smolaga, smolalar asfaltenlarga aylanadi. Natijada penetratsiya kamayadi, yumshash harorati oshadi,
bitum mo'rtlashadi va qoplama yoriladi. Ultrabinafsha nurlar bu jarayonni tezlashtiradi. Eskirishga chidamlilik qizdirishdan keyingi
ko'rsatkichlar o'zgarishi bo'yicha baholanadi.</p>

<h3>5. Xatolik manbalari</h3>
<ul>
<li>Namunani termostatda (25 ± 0,1 °C) yetarli vaqt saqlamaslik — penetratsiya haroratga juda sezgir, 1 °C farq natijani sezilarli o'zgartiradi.</li>
<li>Ignani avvalgi botgan joyga yoki idish devoriga yaqin tushirish.</li>
<li>Halqa va Shar sinovida qizdirish tezligi 5 °C/daq dan farq qilishi — tez qizdirilsa natija oshib ketadi.</li>
<li>Bitumni haddan tashqari qizdirib quyish — namuna qisman eskiradi.</li>
</ul>

<h3>6. O'zbekiston sharoitida</h3>
<div class="box uz">
<p>O'zbekiston keskin kontinental iqlimga ega: yozda janubiy hududlarda havo +45…+47 °C, asfalt yuzasi esa +65…+70 °C gacha qiziydi; qishda
shimolda harorat −20…−25 °C gacha tushadi. Bitta bitum ikkala talabga javob berishi qiyin: yumshoq bitum yozda koleya hosil qiladi,
qattiq bitum qishda yoriladi. Shu sababli bitum markasi <b>hudud iqlimiga qarab</b> tanlanadi (simulyatordagi jadvalga qarang).</p>
<p>Og'ir yuk mashinalari harakati ko'p bo'lgan magistral yo'llarda (masalan, Toshkent–Termiz) oddiy bitum yetarli emas — <b>polimer-bitum
bog'lovchilar</b> (SBS polimeri bilan modifikatsiyalangan) qo'llaniladi; ular harorat oralig'ini sezilarli kengaytiradi.</p>
<p>Respublikada yo'l bitumi Farg'ona neftni qayta ishlash zavodida ishlab chiqariladi, bir qismi import qilinadi — har bir partiya kiruvchi nazoratdan o'tkaziladi.</p>
</div>

<h3>7. Xavfsizlik</h3>
<div class="box safe">Qizdirilgan bitum og'ir kuyishlarga sabab bo'ladi va yonuvchan. Isitish tortish shkafi ostida, ochiq olovsiz bajariladi;
qo'lqop va ko'zoynak taqiladi. Bitumga suv tushishi qaynab otilib chiqishiga olib keladi.</div>

<h3>8. Nazorat savollari</h3>
<ol>
<li>Asfaltenlar, smolalar va moylar bitum xossalariga qanday ta'sir qiladi?</li>
<li>PI nimani ko'rsatadi va yo'l bitumi uchun qanday qiymatlar maqbul?</li>
<li>Termizda va Nukusda nega turli markadagi bitum tavsiya etiladi?</li>
<li>Bitumning eskirishi qanday sodir bo'ladi va u qoplamaga qanday ta'sir qiladi?</li>
</ol>
<h3>9. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 22245-90. Битумы нефтяные дорожные вязкие. Технические условия.</li>
<li>GOST 11501-78. Битумы нефтяные. Метод определения глубины проникания иглы.</li>
<li>GOST 11506-73. Битумы нефтяные. Метод определения температуры размягчения по кольцу и шару.</li>
<li>Gezentsvey L.B. va boshq. Дорожный асфальтовый бетон. — M.: Transport.</li>
</ul>`;

/* ===================== 11. Lyoss gruntlari ===================== */
VL.deep.loess = `
<h3>1. Lyoss nima va u qanday hosil bo'lgan</h3>
<p>Lyoss — to'rtlamchi davrda asosan shamol (eol) va qisman suv-allyuvial jarayonlar natijasida to'plangan, och sarg'ish rangli,
qatlamlanmagan, <b>makrog'ovakli</b> chang grunti. Asosiy belgilari:</p>
<ul>
<li>chang fraksiyasi (0,05–0,005 mm) 50% dan ortiq, gil zarralari kam (10–20%);</li>
<li>ko'zga ko'rinadigan vertikal makrog'ovaklar (o'simlik ildizlari izlari) — umumiy g'ovaklik 45–55%;</li>
<li>tabiiy namligi past (5–15%), quruq zichligi kichik (1,3–1,6 g/sm³);</li>
<li>zarralar <b>kalsiy karbonati, gips va suvda eruvchan tuzlar</b> hamda gil plyonkalari bilan "tsementlangan".</li>
</ul>

<h3>2. Cho'kish mexanizmi</h3>
<p>Quruq holatda lyoss ancha mustahkam: tik qiyaliklar ko'p yil qulamasdan turadi. Uning mustahkamligi zarralarni bog'lab turuvchi
<b>struktura bog'lanishlariga</b> asoslangan. Suv kirganda:</p>
<ol>
<li>suvda eruvchan tuzlar va gips eriydi;</li>
<li>gil plyonkalar namlanib bo'kadi va bog'lovchilik xususiyatini yo'qotadi;</li>
<li>zarralar orasidagi kapillyar tortilish kuchlari yo'qoladi.</li>
</ol>
<p>Agar ayni paytda grunt <b>yuklama</b> ostida bo'lsa (o'z og'irligi yoki bino og'irligi), bo'shashgan tuzilma "yiqilib", zarralar makrog'ovaklarga
siljiydi va grunt keskin, tez cho'kadi. Bu oddiy zichlanishdan farqli — <b>to'satdan va katta miqdorda</b> sodir bo'ladigan cho'kishdir.</p>
<div class="box warn">Cho'kish uchun ikki shart bir vaqtda zarur: <b>namlanish</b> va <b>yetarli bosim</b> (p ≥ p<sub>sl</sub>). Shuning uchun quruq lyossda bino
yillab turishi, quvur yorilgach esa bir necha kunda yorilib ketishi mumkin.</div>

<h3>3. Ikki egri chiziq usulining ma'nosi</h3>
<p>Bir xil monolitdan olingan ikki namuna sinaladi: A — tabiiy namlikda, B — boshidanoq suvga to'yintirilgan holda. Har bir bosimda
ular balandliklari farqi namlanish ta'sirini ko'rsatadi:</p>
<div class="formula">ε<sub>sl</sub>(p) = (h<sub>n,p</sub> − h<sub>sat,p</sub>) / h<sub>n,g</sub></div>
<p>bu yerda h<sub>n,p</sub> va h<sub>sat,p</sub> — p bosimdagi tabiiy va to'yingan namuna balandligi, h<sub>n,g</sub> — tabiiy namlikdagi namunaning
qatlamning tabiiy (maishiy) bosimidagi balandligi. ε<sub>sl</sub> = 0,01 ga mos bosim — <b>boshlang'ich cho'kish bosimi p<sub>sl</sub></b>.
Bitta egri chiziq usulida esa bitta namuna kerakli bosimgacha yuklanib, so'ng suv beriladi — u tezroq, ammo faqat bitta bosim uchun natija beradi.</p>

<h3>4. Hisoblash namunasi</h3>
<div class="calc-ex">
<p>h₀ = 25 mm. Maishiy bosim 0,05 MPa da tabiiy namuna balandligi h<sub>n,g</sub> = 24,85 mm.</p>
<p>p = 0,2 MPa: h<sub>n,p</sub> = 24,42 mm, h<sub>sat,p</sub> = 23,60 mm.</p>
<p>ε<sub>sl</sub> = (24,42 − 23,60) / 24,85 = <b>0,033</b> → ≥ 0,01, grunt <b>cho'kuvchan</b> (simulyator shkalasi bo'yicha o'rtacha cho'kuvchan).</p>
<p>Taxminiy cho'kish: qalinligi 8 m bo'lgan qatlam uchun o'rtacha ε<sub>sl</sub> ≈ 0,03 bo'lsa,
s<sub>sl</sub> ≈ Σ ε<sub>sl,i</sub> · h<sub>i</sub> · k<sub>sl</sub> ≈ 0,03 · 8000 · 1,0 = <b>240 mm</b> — bino uchun bu halokatli qiymat (ruxsat etilgani odatda 80–150 mm).</p>
</div>

<h3>5. Cho'kuvchanlik turlari</h3>
${VL.table(['Tur', 'Tavsif', 'Xavfi'], [
  ['I tur', "Grunt o'z og'irligidan namlanganda cho'kmaydi yoki cho'kishi ≤ 5 sm; cho'kish asosan poydevor ostidagi bosimdan", "Poydevor ostidagi deformatsiya zonasi bilan cheklanadi"],
  ['II tur', "Grunt o'z og'irligidan ham 5 sm dan ortiq cho'kadi", "Butun qatlam cho'kadi, poydevor atrofidagi yer ham cho'kib, qo'shimcha ishqalanish (manfiy ishqalanish) paydo bo'ladi"],
])}

<h3>6. Muhandislik choralari (KMK 2.02.01-98)</h3>
${VL.table(['Guruh', 'Usullar'], [
  ["Cho'kuvchanlikni yo'qotish", "Og'ir shibbalagichlar bilan zichlash, grunt yostiqlari, grunt qoziqlari, oldindan namlash (shu jumladan chuqur portlatish bilan), silikatlash, termik mustahkamlash"],
  ["Qatlamni kesib o'tish", "Qoziqli poydevorlar — uchi cho'kmaydigan qatlamga tayanadi"],
  ['Konstruktiv choralar', "Temir-beton belbog'lar, bikr qutisimon poydevorlar, deformatsiya choklari, notekis cho'kishga moslashuvchan konstruksiyalar"],
  ['Suvdan himoya qilish', "Yer usti suvlarini burib yuborish, keng germetik otmostka, quvurlarni nazorat kanallari ichida yotqizish, kanal va ariqlarni betonlash"],
])}
<p>Odatda bu choralar <b>birgalikda</b> qo'llaniladi: faqat suvdan himoyaga tayanish xavfli — quvurlar vaqt o'tib baribir yoriladi.</p>

<h3>7. O'zbekiston sharoitida</h3>
<div class="box uz">
<p>Lyoss va lyossimon gruntlar O'zbekistonning tog' oldi tekisliklari va vodiylarining katta qismini qoplaydi: Toshkent, Samarqand, Jizzax,
Farg'ona vodiysining chekkalari, Mirzacho'l, Qashqadaryo. Qatlam qalinligi bir necha metrdan o'nlab metrgacha yetadi.</p>
<p><b>Mirzacho'l</b> (Golodnaya step) misoli darsliklarga kirgan: XX asrning 50–70-yillarida keng ko'lamli sug'orish boshlangach, kanallar va
ariqlar ostidagi lyoss cho'kib, sug'orish tarmoqlari, yo'llar va binolar jiddiy shikastlangan. Ba'zi joylarda o'z og'irligidan cho'kish
bir metrdan oshgan (II tur).</p>
<p>Shaharlarda asosiy xavf — <b>suv ta'minoti va kanalizatsiya quvurlaridan sizish</b>, hovlilarni sug'orish va yomg'ir suvining poydevor yonida
to'planishi. Lyossda qurilgan binolar yorilishining ko'p holatlari aynan shu bilan bog'liq. Bundan tashqari, lyoss namlanganda
<b>seysmik ta'sirga</b> ham ancha sezgir bo'lib qoladi — zilzila paytida suyulish va ko'chkilar kuzatilishi mumkin.</p>
</div>

<h3>8. Nazorat savollari</h3>
<ol>
<li>Lyossning cho'kuvchanligi qanday tuzilish xususiyatlari bilan bog'liq?</li>
<li>Cho'kish sodir bo'lishi uchun qanday ikki shart bajarilishi kerak?</li>
<li>I va II tur cho'kuvchanlik o'rtasidagi farq nima?</li>
<li>Nima uchun p<sub>sl</sub> qiymati poydevor loyihasida muhim?</li>
<li>Mirzacho'lda sug'orish boshlangach nima uchun katta deformatsiyalar yuz berdi?</li>
</ol>
<h3>9. Adabiyotlar</h3>
<ul class="lit">
<li>GOST 23161-2012. Грунты. Метод лабораторного определения характеристик просадочности.</li>
<li>GOST 25100-2020. Грунты. Классификация.</li>
<li>KMK 2.02.01-98. Bino va inshootlar zaminlari.</li>
<li>Abelev Yu.M., Abelev M.Yu. Основы проектирования и строительства на просадочных макропористых грунтах.</li>
</ul>`;
