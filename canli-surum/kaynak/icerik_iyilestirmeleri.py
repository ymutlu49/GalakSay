#!/usr/bin/env python3
"""Canlı derlemede içerik iyileştirmeleri — 27 Eylül 2026.

Gerekçeler: docs/ICERIK_IYILESTIRME_PLANI.md (§3.1–3.5). madde_denetimi_duzeltmeleri.py'den sonra uygulanır.
Her değişiklik birebir metin eşleşmesiyle yapılır; beklenen eşleşme sayısı tutmazsa hiçbir dosya değişmez.
"""
import glob, sys
ROOT = sys.argv[1] if len(sys.argv) > 1 else 'canli-surum/site'
A = f'{ROOT}/oyna/assets/'
FILES = {'G': glob.glob(A + 'GalakSay-*.js')[0], 'C': glob.glob(A + 'ChildSelect-*.js')[0]}
R = []  # (dosya, eski, yeni, beklenen eşleşme sayısı)
def sub(old, new, n=1, f='G'): R.append((f, old, new, n))
def lit(old, new, n=1):  # tırnaklı metin
    sub('"' + old + '"', '"' + new + '"', n)

# ── §3.1 Geri bildirim dili: çocuğa uygun ve süreç odaklı ─────────────────────────────────────────
# (a) Kuram terimleri (kardinalite, cebirsel düşünce, üçlü kod …) çocuğun yaptığı işi anlatan cümlelerle
#     değiştirildi. Kuramsal açıklama öğretmen ekranlarında olduğu gibi kalır.
TR = {
    "Son söylediğin sayı toplam miktarı verir — kardinalite ilkesi!": "Saymayı bitirince söylediğin son sayı, kaç tane olduğunu gösterir!",
    "Sayma sırasını değiştirsen de sonuç aynıdır — sıra bağımsızlığı!": "Hangi taştan saymaya başlasan da sonuç aynı çıkar!",
    "Somuttan soyuta geçiş yapıyorsun — üçlü kod!": "Taşları saydın, rakamını buldun — ikisi aynı sayıyı anlatıyor!",
    "Parçalardan bütüne geçiş = kompozisyon becerisi!": "Onlukları ve birlikleri birleştirip sayıyı kurdun!",
    "Matematiksel bir yargıyı değerlendirdin — cebirsel düşünce!": "İki tarafı hesaplayıp karşılaştırdın — doğru karar!",
    "Cebirsel düşüncenin temeli: bilinmeyeni bulmak!": "Teraziyi dengeleyen gizli sayıyı buldun!",
    "Büyüyen desende her adımdaki farkı buldun — cebirsel düşünce!": "Her adımda ne kadar arttığını buldun — kuralı yakaladın!",
    "Temsiller arası çeviri, matematiksel soyutlamanın ilk adımı!": "Aynı deseni başka şekillerle de kurdun!",
    "Tekrar eden çekirdek kalıbı buldun — desenin DNA'sı!": "Tekrar eden parçayı buldun — desen hep onunla devam ediyor!",
    "Nicelik ilişkisini doğru algıladın — güçlü kavrama!": "Hangisinin daha çok olduğunu doğru buldun!",
    "Karşılaştırma sayı hissinin temelidir!": "İki grubu dikkatle karşılaştırdın!",
    "Karşılaştırma sayı hissinin temelidir — nicelik ilişkisini doğru algıladın!": "İki grubu karşılaştırdın ve daha çok olanı buldun!",
    "Sınır sayılarda bile hata yapmadın — güçlü sayı hissi!": "9'dan 10'a geçerken bile şaşırmadın!",
    "10'dan büyük sayıları anında görüyorsun — ileri düzey algılama!": "Dolu çerçeveyi 10 diye gördün, gerisini ekledin!",
    "10'luk çerçeveyle çalışmak sayı hissini geliştirir!": "Çerçevede boş kutulara bakıp hızlıca buldun!",
    "5'i referans noktası olarak kullanmak hesaplamayı hızlandırır!": "5'e göre düşündün — hızlı ve doğru!",
    "Bir elin parmak sayısı 5 — doğal bir referans noktası!": "Bir elin 5 parmak — 5'i hep yanında taşıyorsun!",
    "10'lu paketleme onluk sayı sisteminin temelidir!": "10 taşı bir paket yaptın — işte bir onluk!",
    "10'luk sistem tüm matematiğin temelidir — iki elin 10 parmak!": "İki elin 10 parmak — 10'u tamamlamak işini kolaylaştırır!",
    "Matematik beyin için jimnastik — sen güçleniyorsun!": "Çalıştıkça daha kolay geliyor — devam!",
    "Saymadan bir bakışta algıladın — bu süper bir beceri!": "Saymadan, bir bakışta gördün!",
    "Eşit gruplara ayırmak bölmenin temelidir!": "Her gruba aynı sayıda verdin — işte bölme!",
    "Eşit dağıtma = bölme — doğru strateji!": "Herkese eşit dağıttın — doğru yol!",
    "Geriye sayabilmek çıkarmanın temelidir!": "Geriye doğru saydın — çıkarmada da bunu kullanacaksın!",
    "Ritmik sayma çarpmanın temelidir — harika!": "Atlayarak saydın — çarpmada da böyle sayacaksın!",
    "Tekrarlı toplama çarpmanın temelidir — bunu görüyorsun!": "Aynı sayıyı tekrar tekrar topladın — işte çarpma!",
    "Diziyi döndürsen de sonuç aynı: değişme özelliği!": "Diziyi yan çevirsen de taş sayısı aynı kalır!",
    "Toplamayı değiştirebilirsin: 3+7 = 7+3 — değişme özelliği!": "Sayıların yerini değiştir: 3+7 ile 7+3 aynı sonucu verir!",
    "5'lik çerçeveyi doğru okudun — güçlü bir strateji!": "5'lik çerçeveyi doğru okudun!",
    "Büyük sayıdan başlayıp devam ederek saymak en verimli strateji!": "Büyük sayıdan başlayıp üstüne saydın — en kısa yol!",
    "İleriye sayarak da çıkarma yapabilirsin — süper strateji!": "İleriye sayarak da çıkarma yapabilirsin!",
    "Tekrar dene — bu sefer farklı bir strateji kullan!": "Tekrar dene — bu sefer başka bir yol dene!",
}
for o, n in TR.items(): lit(o, n, None)
KU = {
    "Hejmara dawî ku te got tevahiya hindebûnê dide — prensîba kardînalîteyê!": "Dema jimartin qediya, hejmara dawî ku te got nîşan dide ka çend heb hene!",
    "Te dîwaneke matematîkî nirxand — fikra cebrî!": "Te her du alî hesab kirin û berhev kirin — biryara rast!",
    "Bingeha fikra cebrî: dîtina ya nenas!": "Te hejmara veşartî ya ku mêzînê wekhev dike dît!",
    "Di şêweya mezinbûyî de te kemoka her gavê dît — fikra cebrî!": "Te dît ku her gav çiqas zêde dibe — te rêgez girt!",
    "Te şêweya bingehîn ya dubarebûyî dît — DNAya şêweyê!": "Te beşa ku dubare dibe dît — şêwe her bi wê didome!",
    "Berhevkirin bingeha hesta hejmaran e!": "Te her du kom bi baldarî berhev kirin!",
    "Te di hejmarên sînor de jî çewtî nekir — hesta hejmaran ya bi heybet!": "Dema ji 9an derbasî 10an bûyî jî tu şaş nebûyî!",
    "Xebata bi çarçoveya 10î hesta hejmaran pêş dixe!": "Te li qutiyên vala yên çarçoveyê nêrî û zû dît!",
    "Bikaranîna 5ê wek xala referansê hesabkirinê zû dike!": "Te li gorî 5an fikirî — zû û rast!",
    "Hejmara tilîyên destekî 5 e — xaleke referansê ya xwezayî!": "Destekî te 5 tilî ye — 5 her tim bi te re ye!",
    "Pakêtkirina bi 10î bingeha pergala hejmaran ya 10î ye!": "Te 10 kevir kirin pakêtek — ev dehek e!",
    "Pergala 10î bingeha hemû matematîkê ye — herdu dest 10 tilî ne!": "Herdu destên te 10 tilî ne — temamkirina 10an hêsan dike!",
    "Bê jimartin bi yek nêrînê te dît — ev stratejîyeke bi heybet e!": "Bê jimartin, bi yek nêrînê te dît!",
    "Veqetandina li komên wekhev bingeha parkirinê ye!": "Te li her komê heman hejmar da — ev parkirin e!",
    "Parvekirina wekhev bingeha parkirinê pêk tîne!": "Te bi wekhevî parve kir — ev parkirin e!",
    "Parkirina wekhev = parkirin — stratejîya rast!": "Te ji her kesî re wekhev parve kir — rêya rast!",
    "Karîna paşvejimartinê bingeha kemkirinê ye!": "Te ber bi paş jimart — di kemkirinê de jî vê bi kar tînî!",
    "Jimartina rîtmîk bingeha carkirinê ye — bi heybet!": "Te bi bazdanê jimart — di carkirinê de jî wisa dijmêrî!",
    "Zêdekirina dubare bingeha carkirinê ye — tu vê dibînî!": "Te heman hejmar dîsa û dîsa zêde kir — ev carkirin e!",
    "Te çarçoveya 5ê rast xwend — stratejîyeke bi heybet!": "Te çarçoveya 5ê rast xwend!",
    "Ji hejmara mezin dest pê kirin û bi domandinê jimartin stratejîya herî bibandor e!": "Te ji hejmara mezin dest pê kir û li ser jimart — rêya herî kurt!",
    "Bi pêşvejimartinê jî tu dikarî kêm bikî — stratejîyeke bi heybet!": "Bi pêşvejimartinê jî tu dikarî kêm bikî!",
    "Dîsa biceribîne — vê carê stratejîyeke cuda bi kar bîne!": "Dîsa biceribîne — vê carê rêyeke din biceribîne!",
    "Tu girêdana hejmar-tişt ava dikî — şehrezayîya bingehîn!": "Te tişt jimartin û hejmara wan dît!",
    "Zanîna cîranên hejmarê bingehek bi heybet e!": "Te cîranên hejmarê baş nas kirin!",
    "Zanîna rêza hejmaran bingeha hemû matematîkê ye!": "Te rêza hejmaran baş zanî!",
}
for o, n in KU.items(): lit(o, n, None)
EN = {
    "The last number you say tells the total — that's cardinality!": "When you finish counting, the last number you say tells how many there are!",
    "You found the change at each step of a growing pattern — algebraic thinking!": "You found how much it grows each step — you caught the rule!",
    "You found the repeating core — the DNA of the pattern!": "You found the part that repeats — the pattern keeps going with it!",
    "Turn the array and the answer stays the same: commutative property!": "Turn the array sideways and the number of stones stays the same!",
    "You can swap the order: 3 + 7 = 7 + 3 — that's the commutative property!": "Swap the numbers: 3 + 7 and 7 + 3 give the same answer!",
    "Translating between forms is the first step of mathematical abstraction!": "You built the same pattern with different shapes!",
    "Comparing is the base of number sense!": "You compared the two groups carefully!",
    "No mistakes at the boundary numbers — great number sense!": "Even going from 9 to 10 did not trick you!",
    "One hand has 5 fingers — a natural reference point!": "One hand has 5 fingers — you always carry 5 with you!",
    "Working with the tens frame builds number sense!": "You looked at the empty boxes in the frame and found it fast!",
    "Bundling by 10 is the foundation of our number system!": "You made a bundle of 10 stones — that's one ten!",
    "Fair sharing is the foundation of division!": "You gave each group the same number — that's division!",
    "Sharing equally = division — the right strategy!": "You shared equally with everyone — the right way!",
    "Starting from the bigger number and counting on is the smartest strategy!": "You started from the bigger number and counted on — the shortest way!",
    "Counting up also works for subtraction — a powerful strategy!": "You can subtract by counting up, too!",
    "Try again — use a different strategy this time!": "Try again — try a different way this time!",
    "You read the fives frame — a strong strategy!": "You read the fives frame correctly!",
    "You're moving from concrete to abstract!": "You counted the stones and found the numeral — both tell the same number!",
    "Seeing multiplication makes abstract multiplying easier!": "You saw the equal groups — that is multiplication!",
    "This kind of thinking makes algebra easier later!": "You found the hidden number that balances the scale!",
    "Knowing a number's neighbors is a strong foundation!": "You know the number's neighbors well!",
}
for o, n in EN.items(): lit(o, n, None)
# Şablon metinler (sayı içeren)
sub("Gizli sayı ${$} — denklemi bir terazi gibi düşündün! Cebirsel düşüncenin ilk adımı 🎯", "Gizli sayı ${$} — denklemi bir terazi gibi düşündün, iki taraf dengede! 🎯")
sub("— diziyi 90° döndürsen ${w.cols} × ${w.rows} olur ama sonuç aynı: değişme özelliği! 📐", "— diziyi yan çevirsen ${w.cols} × ${w.rows} olur ama taş sayısı aynı kalır! 📐")
sub("geriye atlıyorsun — geri sayım çıkarmanın temelidir! 🎵", "geriye atlıyorsun — geriye saymak çıkarmada da işine yarar! 🎵")
# Çocuğun yapmadığı bir işlemi ona mal eden övgü ("…tane saydın — verimli strateji") yol önerisine çevrildi.
sub('`${va(ie)} başlayıp ${ye} tane saydın — verimli strateji!`', '`${va(ie)} başlayıp ${ye} tane saymak en kısa yol!`')
# "Sıfırla çarpımın bölmeyle tersi yoktur" yanlış (0 × 2 = 0 ise 0 ÷ 2 = 0); çocuk diliyle doğru açıklama.
sub('"Multiplying by zero is always 0 — it has no division inverse!":"Sıfırla çarpım hep 0\'dır — bunun bölmeyle tersi yoktur!"',
    '"Multiplying by zero is always 0 — zero groups, or empty groups, give no stones!":"Sıfırla çarpım hep 0\'dır — hiç grup yoksa ya da gruplar boşsa taş da yoktur!"')
sub('`Somut: ${w.num1} yıldız taşı+ ${w.num2} yıldız taşı= ${$} yıldız taşı— birleştir ve say!`', '`Somut: ${w.num1} yıldız taşı + ${w.num2} yıldız taşı = ${$} yıldız taşı — birleştir ve say!`')
sub('`Toplama ile düşündün: ${w.num2} + ? = ${w.num1} → ${$}!`', '`Toplamayla da bulunur: ${w.num2} + ? = ${w.num1} → ${$}!`')
sub('`${va(w.num1)} ${w.num2} adım geriye saydın!`', '`${va(w.num1)} ${w.num2} adım geriye saymak da olur!`')
# Denklem Dedektifi etiketleri
lit("Değişme Özelliği", "Yer Değiştirme"); lit("Etkisiz Eleman", "Sıfır Eklemek")
lit("Taybetmendiya Guhertinê", "Cih Guhertin"); lit("Hêmana Bêbandor", "Zêdekirina Sifirê")
lit("Commutative Property", "Swapping Order"); lit("Identity Element", "Adding Zero")

# (b) Kişiye yönelik rastgele övgü ("Yıldız gibi parlıyorsun!") yerine yapılan işi öven cümleler.
sub('xg=["Harika, Kaşif! 🌟","Yıldız gibi parlıyorsun! ⭐","Galaksi aydınlanıyor! 💫","Uzay yolcusu oluyorsun! 🚀","Yıldız taşı parıldıyor! 💎","Mükemmel keşif! 🔭","Yörüngede ilerliyorsun! 🌍","Süper çözdün, Kaşif! ✨"]',
    'xg=["Doğru! Dikkatle baktın. 🌟","Doğru! Adım adım düşündün. ⭐","Buldun! Acele etmeden çözdün. 💫","Doğru! Bildiğini kullandın. 🚀","Doğru! Emek verdin, oldu. 💎","Buldun! İyi düşündün. 🔭","Doğru! Kendi yolunla buldun. 🌍","Doğru! Kontrol ettin, emin oldun. ✨"]')
sub('jg=["Aferîn, Keşifger! 🌟","Mîna stêrkê dibiriqî! ⭐","Galaksî ronî dibe! 💫","Tu dibî gerokê fezayê! 🚀","Kevirê stêrkê dibiriqe! 💎","Keşfeke bêkêmasî! 🔭","Tu di gerîngehê de pêş dikevî! 🌍","Te super çareser kir, Keşifger! ✨"]',
    'jg=["Rast e! Te bi baldarî nêrî. 🌟","Rast e! Te gav bi gav fikirî. ⭐","Te dît! Te bê lez çareser kir. 💫","Rast e! Te tiştê ku dizanî bi kar anî. 🚀","Rast e! Te hewl da, çêbû. 💎","Te dît! Te baş fikirî. 🔭","Rast e! Te bi rêya xwe dît. 🌍","Rast e! Te kontrol kir û piştrast bûyî. ✨"]')
sub('Sg=["Amazing, Explorer! 🌟","You shine like a star! ⭐","The galaxy lights up! 💫","You\'re becoming a space traveler! 🚀","The star stone sparkles! 💎","A perfect discovery! 🔭","You\'re moving along the orbit! 🌍","Super solving, Explorer! ✨"]',
    'Sg=["Correct! You looked carefully. 🌟","Correct! You thought it through step by step. ⭐","You found it! You took your time. 💫","Correct! You used what you know. 🚀","Correct! Your effort paid off. 💎","You found it! Good thinking. 🔭","Correct! You found your own way. 🌍","Correct! You checked and made sure. ✨"]')
sub('correctReactions:["Harika keşif! 🌟","Galaksi seninle parlıyor! ⭐","Yıldız taşı parıldadı! 💎","Yıldız gibi çözdün! 🏆","Yörüngede ilerliyorsun! 🚀"]',
    'correctReactions:["Dikkatle baktın, buldun! 🌟","Adım adım düşündün! ⭐","Kontrol ettin, doğru çıktı! 💎","Kendi yolunla çözdün! 🏆","Emek verdin, oldu! 🚀"]')
sub('correctReactions:["Great discovery! 🌟","The galaxy shines with you! ⭐","The star stone sparkled! 💎","You solved it like a star! 🏆","You\'re moving along the orbit! 🚀"]',
    'correctReactions:["You looked carefully and found it! 🌟","You thought it through step by step! ⭐","You checked and it was right! 💎","You solved it your own way! 🏆","Your effort paid off! 🚀"]')

# (c) İpucu merdiveni: çocuğa "KADEME 1 — YÖNLENDİRİCİ SORU" yerine "İPUCU 1 — KENDİNE SOR".
sub('["","Pirsa Rêber","Alîkariya Dîtbarî","Ravekirina Berfireh","Piştgiriya Tam","Ezmûna Şênber"]', '["","Ji xwe bipirse","Li wêneyê binêre","Gav bi gav","Em bi hev re bikin","Bi tiştan biceribîne"]')
sub('["","Guiding Question","Visual Hint","Detailed Explanation","Full Support","Hands-On Experience"]', '["","Ask yourself","Look at the picture","Step by step","Let\'s do it together","Try with objects"]')
sub('["","Yönlendirici Soru","Görsel İpucu","Detaylı Açıklama","Tam Destek","Somut Deneyim"]', '["","Kendine sor","Resme bak","Adım adım","Birlikte yapalım","Nesnelerle dene"]')
sub('children:[t==="ku"?"Qonax":t==="en"?"Step":"Kademe"," 2 — ",h]', 'children:[t==="ku"?"Alîkarî":t==="en"?"Hint":"İpucu"," 2 — ",h]')
sub('N=a.kademe?`${t==="ku"?"Qonax":t==="en"?"Step":"Kademe"} ${a.kademe} — ${h}`', 'N=a.kademe?`${t==="ku"?"Alîkarî":t==="en"?"Hint":"İpucu"} ${a.kademe} — ${h}`')
sub('`${t==="ku"?"Qonax":t==="en"?"Step":"Kademe"} ${Na}/5`', '`${t==="ku"?"Alîkarî":t==="en"?"Hint":"İpucu"} ${Na}/5`')
sub('"aria-label":t==="ku"?`Alîkarî bigire (Qonax ${Na+1})`:t==="en"?`Get a hint (Step ${Na+1})`:`İpucu al (Kademe ${Na+1})`',
    '"aria-label":t==="ku"?`Alîkarî bigire (${Na+1})`:t==="en"?`Get a hint (${Na+1})`:`İpucu al (${Na+1})`')

# ── §3.2 Karşılaştırmada algısal ipucu ────────────────────────────────────────────────────────────
# "Boyut yanılsaması" maddeleri kodda vardı ama bayrak sabit kapalıydı: fazla olan grubun çubuğu/alanı her
# maddede büyüktü. 3. seviyeden sonra çubuk ve taş gösteriminde maddelerin ~%35'i uyumsuz: fazla olan
# grubun taşları küçük, az olanınki büyük. Uyumsuz maddeyi öne çıkaran turuncu çerçeve kaldırıldı.
sub('T={type:"comparison",num1:Ge,num2:ua,askMin:M,numDistance:Be,sizeIllusion:W,cmpDisplay:Z}',
    'T={type:"comparison",num1:Ge,num2:ua,askMin:M,numDistance:Be,sizeIllusion:R>=3&&(Z==="rod"||Z==="chips")&&Ge!==ua&&Math.random()<.35,cmpDisplay:Z}')
sub('border:V?"2px solid rgba(245,158,11,.3)":"1px solid rgba(148,163,184,.12)"', 'border:"1px solid rgba(148,163,184,.12)"')

# Gezegen Düellosu şıkları sayıyı yazıyordu ("A 14 on dört" / "B 12 on iki"): çocuk taşlara bakmadan rakamları
# karşılaştırabiliyordu (nicel karşılaştırma rakam karşılaştırmasına dönüşüyordu). Şıklarda yanıttan önce yalnız
# A / B görünür; sayı ve sözcüğü yanıttan sonra geri bildirim olarak çıkar.
sub('"aria-label":(t==="ku"?"Bersiv: ":t==="en"?"Answer: ":"Cevap: ")+d,onClick:()=>un(d),disabled:I,style:{padding:14,',
    '"aria-label":(t==="ku"?"Bersiv: ":t==="en"?"Answer: ":"Cevap: ")+(g===0?"A":"B"),onClick:()=>un(d),disabled:I,style:{padding:14,')
sub('children:[e.jsx("div",{style:{fontSize:14,fontWeight:700,color:i.textSub},children:g===0?"A":"B"}),e.jsx("div",{style:{fontSize:22,fontWeight:900,color:B?"#6ee7b7":i.textHi,transition:"color .3s"},children:d}),e.jsx("div",{style:{fontSize:12,fontWeight:800,color:B?"#6ee7b7":"#c4b5fd"},children:Le(d,t)})]',
    'children:[e.jsx("div",{style:{fontSize:I?14:28,fontWeight:I?700:900,color:I?i.textSub:i.textHi},children:g===0?"A":"B"}),I&&e.jsx("div",{style:{fontSize:22,fontWeight:900,color:B?"#6ee7b7":i.textHi,transition:"color .3s"},children:d}),I&&e.jsx("div",{style:{fontSize:12,fontWeight:800,color:B?"#6ee7b7":"#c4b5fd"},children:Le(d,t)})]')

# ── §3.3 Yanıtı önceden veren strateji etiketleri ─────────────────────────────────────────────────
# Bölme Ustası: "n÷n=1 — Sayı kendisine bölünürse 1 olur!" kuralı soruyla birlikte görünüyordu (kural = yanıt).
# Kural artık ipucu istenince ya da yanıttan sonra görünür. Yıldız Dizisi: "= 3 × 4" işlemi de öyle.
sub('children:Y==="divByOne"?`${a.a} ÷ 1 = ? — ${oe.tip}`:Y==="divBySelf"?`${a.a} ÷ ${a.a} = ? — ${oe.tip}`:',
    'children:Y==="divByOne"?`${a.a} ÷ 1 = ?${I||Na>0?" — "+oe.tip:""}`:Y==="divBySelf"?`${a.a} ÷ ${a.a} = ?${I||Na>0?" — "+oe.tip:""}`:')
sub('e.jsx(N,{children:t==="en"?`${a.rows} rows × ${a.cols} columns = ${a.rows} × ${a.cols}`:`${a.rows} satır × ${a.cols} sütun = ${a.rows} × ${a.cols}`})',
    'e.jsx(N,{children:t==="en"?`${a.rows} rows × ${a.cols} columns${I||Na>0?` = ${a.rows} × ${a.cols}`:""}`:t==="ku"?`${a.rows} rêz × ${a.cols} stûn${I||Na>0?` = ${a.rows} × ${a.cols}`:""}`:`${a.rows} satır × ${a.cols} sütun${I||Na>0?` = ${a.rows} × ${a.cols}`:""}`})')

# ── §3.4 Sözel problemler: rakam, satır düzeni, şerit model ───────────────────────────────────────
# (a) Sayılar yazı yerine rakamla ("on iki fotoğraf" → "12 fotoğraf"); üç dilde. Ses yine sözcükle okur.
sub('text:O.text($,ee,H,w,ct)', 'text:O.text($,ee,H,w,String)')
sub('text:O.text($,ee,H,w,gr)', 'text:O.text($,ee,H,w,String)')
sub('text:O.text($,ee,H,w,Mg)', 'text:O.text($,ee,H,w,String)')
# "Anla" adımında verilen sayılar rakamla da bulunur; "7" sayısı "17"nin içinde eşleşmez (rakam sınırı,
# eski tarayıcılarda da çalışan dolgulu arama).
sub('re.forEach(function(Y){if(me[Le(Y,t).toLowerCase()]=Y,', 're.forEach(function(Y){if(me[String(Y)]=Y,me[Le(Y,t).toLowerCase()]=Y,')
sub('for(var J=Y.replace(/[.*+?^${}()|[\\]\\\\]/g,"\\\\$&"),oe=[', 'for(var J="[^0-9]"+Y.replace(/[.*+?^${}()|[\\]\\\\]/g,"\\\\$&"),oe=[')
sub('var pe=oe[se].exec(a.text.toLowerCase());if(pe){var $e=pe.index,Ie=$e+pe[0].length,', 'var pe=oe[se].exec((" "+a.text).toLowerCase());if(pe){var $e=pe.index,Ie=$e+pe[0].length-1,')
# Problem akışındaki "Verilen" satırı ve çubuk modeli etiketleri de rakamla ("dokuz ördek" → "9 ördek").
sub('G="",ae=function(Y){return Le(Y,t)};', 'G="",ae=function(Y){return String(Y)};')
# (b) Problem kartında her cümle ayrı satırda.
sub('Ce.createElement("p",{style:{fontSize:18,fontWeight:600,color:i.textBright,lineHeight:1.8,margin:0,textAlign:"center",wordBreak:"break-word",maxWidth:"100%"}},ce)',
    'Ce.createElement("p",{style:{fontSize:18,fontWeight:600,color:i.textBright,lineHeight:1.8,margin:0,textAlign:"center",wordBreak:"break-word",maxWidth:"100%",whiteSpace:"pre-line"}},String(ce).replace(/([.?!])\\s+/g,"$1\\n"))')
# (c) İşlem seçme adımına şerit (bar) model: üstte bütün, altta iki parça; bilinmeyen "?". Toplama/çıkarma
#     türlerinde (birleştirme, ayırma, parça-bütün, karşılaştırma) denklemden kurulur.
BAR = ('(function(){try{var gsE=String(a.equation||"").split(" ");if(gsE.length!==5||(gsE[1]!=="+"&&gsE[1]!=="−"))return null;'
       'var gsU=gsE.indexOf("?");if(gsU<0)gsU=4;var gsN=gsE.map(function(x){return x==="?"?a.answer:+x});'
       'var gsP=gsE[1]==="+"?[4,0,2]:[0,4,2],gsW=gsN[gsP[0]],gsA=gsN[gsP[1]],gsB=gsN[gsP[2]];if(!(gsW>0&&gsA>=0&&gsB>=0))return null;'
       'var gsL=function(k,v){return k===gsU?"?":String(v)},gsBox=function(w,lab,bg,brd){return Ce.createElement("div",{style:{flex:w+" 1 0",minWidth:30,padding:"6px 0",borderRadius:8,background:bg,border:"2px solid "+brd,fontWeight:900,fontSize:16,color:i.textBright,textAlign:"center"}},lab)};'
       'return Ce.createElement("div",{role:"img","aria-label":(t==="ku"?"Modela şerîdê: ":t==="en"?"Bar model: ":"Şerit model: ")+gsL(gsP[0],gsW)+" = "+gsL(gsP[1],gsA)+" + "+gsL(gsP[2],gsB),style:{maxWidth:340,margin:"0 auto 12px",display:"flex",flexDirection:"column",gap:4}},'
       'Ce.createElement("div",{style:{fontSize:11,fontWeight:800,color:i.textSub,textAlign:"left"}},t==="ku"?"📊 Modela şerîdê — tevahî û perçe":t==="en"?"📊 Bar model — whole and parts":"📊 Şerit model — bütün ve parçalar"),'
       'Ce.createElement("div",{style:{display:"flex"}},gsBox(1,gsL(gsP[0],gsW),"rgba(99,102,241,.14)","#818cf8")),'
       'Ce.createElement("div",{style:{display:"flex",gap:4}},gsBox(Math.max(gsA,.6),gsL(gsP[1],gsA),"rgba(5,150,105,.14)","#34d399"),gsBox(Math.max(gsB,.6),gsL(gsP[2],gsB),"rgba(245,158,11,.16)","#f59e0b")))}catch(gsX){return null}})()')
sub('G)),Ce.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:10,maxWidth:300',
    'G)),' + BAR + ',Ce.createElement("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, minmax(0, 1fr))",gap:10,maxWidth:300')

# ── §3.5 Sesli yönergeler (okumayan çocuk) ────────────────────────────────────────────────────────
# Yetişkin panelindeki çocuk formunda destek bayraklarına "Sesli yönergeler" eklendi (flags.autoRead).
# Bu bayrak ya da "Okuma güçlüğü" açıksa oyna/galaksay-ek.js konuşmayı kendiliğinden çalıştırır.
sub('"Reports include a recommendation for adult-supported sessions")}]',
    '"Reports include a recommendation for adult-supported sessions")},{key:"autoRead",icon:"🔊",label:a("Sesli yönergeler (henüz okumuyor)","Rêwerzên bi deng (hîn naxwîne)","Spoken instructions (not reading yet)"),desc:a("Sorular ve yönergeler kendiliğinden sesli okunur; kapalıyken yalnız 🗣️ ile","Pirs û rêwerz bixweber bi deng tên xwendin; dema girtî be tenê bi 🗣️","Questions and instructions are read aloud automatically; when off, only with 🗣️")}]', f='C')

# ── Uygula ────────────────────────────────────────────────────────────────────────────────────────
src = {k: open(p, encoding='utf-8').read() for k, p in FILES.items()}
errors = 0
for f, old, new, n in R:
    c = src[f].count(old)
    if (n is None and c < 1) or (n is not None and c != n):
        print(f'EŞLEŞME {c} (beklenen {n or "≥1"}): {old[:100]}'); errors += 1
if errors:
    sys.exit(f'{errors} değişiklik uygulanamadı; dosyalar değiştirilmedi.')
for f, old, new, n in R:
    src[f] = src[f].replace(old, new)
for k, p in FILES.items():
    open(p, 'w', encoding='utf-8').write(src[k])
print(f'{len(R)} değişiklik uygulandı.')
