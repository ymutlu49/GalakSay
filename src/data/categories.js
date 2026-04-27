// @ts-check
// GalakSay Pro — 8 Kategori × Clements & Sarama Öğrenme Yörüngeleri.
// Her kategori = 1 LT yörüngesi | Modlar ltLevel sırasında (gelişimsel ilerleme)
//
// NOT: src/theme/colors.js'teki C objesinin renkleri (örn. blue) GalakSay.jsx'in lokal C'sinden
// FARKLI tanımlanmış. Görsel regresyon olmaması için burada GalakSay.jsx ile birebir uyumlu
// renkler kullanılıyor. Tek-doğru-yer haline getirme ayrı bir refactor adımıdır.

const _C = {
  blue: "#3b82f6", red: "#dc2626", green: "#059669",
  yellow: "#eab308", orange: "#ea580c", purple: "#7c3aed",
  teal: "#0d9488", pink: "#db2777",
};

export const CATEGORIES = {
  // ── KAT1: SAYMA — Counting Trajectory (19 düzey) ──────────────────────────
  // ltLevel sırası: Corresponder(4) → Counter(5-6) → Producer(7) → Backward(9) → FromN(10) → Skip(11-14) → Conserver(18)
  level1: { name: "🌍 Sayalon", desc: "Sayma gezegenini keşfet!", learnKey: "level1", modes: {
    matching:      { n: "Yıldız Eşle!",    i: "🎯", d: "Rakamı doğru sayıdaki yıldız taşıyla eşle", c: _C.green },
    quantityMatch: { n: "Göktaşı Eşle!",  i: "🎲", d: "Göktaşlarını say, doğru rakamla eşle",       c: "#0891b2" },
    counting:      { n: "Göktaşı Say!",    i: "🔢", d: "Tek tek sayarak toplamı bul",                c: _C.blue },
    buildNumber:   { n: "Yıldız Taşı Diz!",    i: "🔨", d: "Söylenen sayı kadar yıldız taşı yerleştir", c: "#d97706" },
    ordinalCount:  { n: "Sıra Keşfi!",    i: "🏅", d: "Kaçıncı sırada? Birinci, ikinci, üçüncü...",  c: "#16a34a" },
    backwardCount: { n: "Geri Sayım!",     i: "⏪", d: "20'den geriye doğru say: 20, 19, 18...",      c: "#e11d48" },
    counterFromN:  { n: "Yörüngeden Say!", i: "🔁", d: "Herhangi bir sayıdan ileri veya geri say",   c: "#60a5fa" },
    decadeCount:   { n: "Onluk Geçidi!",   i: "🌉", d: "29'dan 30'a, 39'dan 40'a doğru sayabil",     c: "#9333ea" },
    skipCount:     { n: "Galaktik Ritim!", i: "🎵", d: "2'şer, 5'er, 10'ar ritmik say",              c: "#16a34a" },
    conservation:  { n: "Yanılsama mı?",   i: "🔄", d: "Yıldız taşları yer değişse sayı aynı kalır mı?", c: "#7e22ce" },
  }},

  // ── KAT2: SANBİL — Subitizing Trajectory (12 düzey) ──────────────────────
  // ltLevel sırası: Perceptual(5-6) → Conceptual(8) → Büyük Koleksiyon Tahmini(9)
  level2: { name: "⚡ Şimşeron", desc: "Bir bakışta gör, şimşek hızında!", learnKey: "level7", modes: {
    fivesFrame:    { n: "Beşli Radar!",    i: "5️⃣", d: "5'lik çerçevedeki taşları bir bakışta say",  c: "#4f46e5" },
    subitizing:    { n: "Işık Hızı!",      i: "⚡", d: "Saymadan bir bakışta kaç tane olduğunu söyle", c: "#7c3aed" },
    tensFrame:     { n: "Onlu Radar!",     i: "🔟", d: "10'luk çerçevedeki taşları bir bakışta say", c: "#7c3aed" },
    chipGuess:     { n: "Uzay Hafızası!",  i: "👀", d: "Yıldız taşlarına bak, sayısını hatırla",     c: "#7c3aed" },
    rodBack:       { n: "Hafıza Şimşeği!", i: "🔄", d: "Bir an gör, sonra ne olduğunu hatırla",      c: "#b45309" },
    doubleTensFrame:{ n: "Çift Onlu Radar!",i: "🔟🔟",d: "Çift 10'luk çerçevede 11-20 arası say",     c: "#6d28d9" },
    estimateCount: { n: "Galaktik Tahmin!", i: "🎯", d: "Sayma yerine kaç tane olduğunu tahmin et",  c: "#b45309" },
  }},

  // ── KAT3: KARŞILAŞTIRMA VE SIRALAMA — Comparing/Ordering Trajectory (23 düzey) ──
  // ltLevel sırası: Comparer(5-7) → Before/After(8) → Counting Comparer(10-14) → Mental NL(11-18) → Estimator(17)
  level3: { name: "⚖️ Terazya", desc: "Denge ve düzen gezegeni", learnKey: "level2", modes: {
    lessMoreEqual: { n: "Kozmik Terazi!",   i: "⚖️", d: "Hangi grupta daha çok yıldız taşı var?",     c: "#dc2626" },
    beforeAfter:   { n: "Yörünge Komşusu!", i: "↔️", d: "Bir sayının önceki ve sonraki komşusunu bul", c: "#0d9488" },
    comparison:    { n: "Gezegen Düellosu!", i: "🏆", d: "Hangi sayı daha büyük? Karşılaştır.",        c: _C.teal },
    fiveMore:      { n: "5 Yıldız Skalası!",i: "🖐️", d: "5'e veya 10'a göre yakın mı, uzak mı?",      c: "#7c3aed" },
    ordering:      { n: "Yörünge Sırala!", i: "📊", d: "Sayıları küçükten büyüğe sırala",            c: "#8b5cf6" },
    numberLineEstimate: { n: "Galaktik Konum!", i: "📍", d: "Sayı doğrusunda hangi sayıyı gösteriyor?", c: "#0f766e" },
    nlPlacement:   { n: "Yörüngeye Yerleştir!", i: "🎯", d: "Verilen sayıyı sayı doğrusunda doğru yere koy", c: "#6d28d9" },
    numberLine:    { n: "Kayıp Kapsül!",     i: "🔍", d: "Sayı doğrusunda kayıp kapsülü bul",          c: "#5b21b6" },
    lengthGuess:   { n: "Gizli Nebula!",    i: "📏", d: "Çubuğun uzunluğuna bakarak sayısını tahmin et", c: "#6d28d9" },
  }},

  // ── KAT4: SAYI BİLEŞİMİ — Composing Numbers Trajectory (10 düzey) ────────
  // ltLevel sırası: Composer to 5(4) → to 7-10(5-6) → Composer to 10(6) → Numbers-in-Numbers(9)
  level4: { name: "🧱 Bileşya", desc: "Sayı bağlarını keşfet!", learnKey: "level3", modes: {
    makeFive:         { n: "5 Yıldız Taşı Topla!",  i: "✋", d: "5 yapmak için kaç yıldız taşı daha lazım?", c: "#6d28d9" },
    partWhole:        { n: "Parça-Bütün Puzzle!", i: "🧩", d: "Bütünü tamamlamak için eksik parçayı bul", c: _C.purple },
    makeTen:          { n: "10 Yıldız Taşı Topla!", i: "🎯", d: "10 yapmak için kaç yıldız taşı daha lazım?", c: "#059669" },
    numbersInNumbers: { n: "Sayı Galaksisi!",   i: "🔢", d: "Bir sayıyı kaç farklı şekilde parçalara ayırabilirsin?", c: "#6d28d9" },
    spaceKitchen:     { n: "Uzay Mutfağı!",     i: "🧪", d: "Çubukları seç, hedef sayıyı oluştur — birden fazla yol var!", c: "#b45309" },
    rodSplit:         { n: "İkili Görev!",       i: "✂️", d: "Çubuğu kes, sayıyı bölmenin tüm yollarını bul!", c: "#7c2d12" },
  }},

  // ── KAT5: BASAMAK DEĞERİ — Place Value (Counting üst düzey + Composing Tens/Ones) ──
  // ltLevel sırası: Composer Tens/Ones(7) → Genişletilmiş(7) → Birimleştirme(16) → Basamak Tanıma(16)
  level8: { name: "🏛️ Basamara", desc: "Onluklar tapınağını keşfet!", learnKey: "level4", modes: {
    composeNumber: { n: "Gezegen Oluştur!", i: "🧱", d: "Onluklarla birlikleri birleştirip sayı yap", c: "#d97706" },
    expandForm:    { n: "Galaktik Açılım!", i: "🔭", d: "Sayıyı onluk ve birlik olarak yaz: 34 = 30 + 4", c: "#059669" },
    bundleTens:    { n: "Onluk Nebula!",    i: "📦", d: "10 birliği bir araya topla — onluk yap!",   c: "#5b21b6" },
    placeValue:    { n: "Katman Keşfet!",   i: "🏛️", d: "Bir rakam bulunduğu basamağa göre ne ifade eder?", c: "#7c3aed" },
  }},

  // ── KAT6: TOPLAMA VE ÇIKARMA — Adding/Subtracting Trajectory (12 düzey) ──
  // ltLevel sırası: Find Result(4) → Find Change(6) → Counting Strategies(7-8) → Problem Solver(4-11)
  level5: { name: "🌗 Toplarya", desc: "Toplama-çıkarma yörüngesi", subGroups: true, modes: {
    addChips:      { n: "Yıldız Taşı Birleştir!", i: "➕", d: "İki grubu birleştir, toplam kaç olur?", c: _C.teal,   grp: "toplama" },
    countOnAdd:    { n: "Büyükten Say!",     i: "🔢", d: "Büyük sayıdan başla, küçük sayı kadar üstüne say", c: "#0d9488", grp: "toplama" },

    addition:      { n: "Güç Birleştir!",    i: "🧮", d: "Toplama stratejileri: çiftler, 10'a tamamla", c: _C.orange, grp: "toplama" },
    wpAdd:         { n: "Toplama Problemi",  i: "📡", d: "Hikâye problemi: gruplar birleşir, toplamı bul", c: "#b45309", grp: "toplama" },
    removeChips:   { n: "Yıldız Taşı Ayır!",    i: "➖", d: "Bir gruptan ayır, geriye kaç kalır?",   c: _C.pink,   grp: "cikarma" },
    difference:    { n: "Mesafe Ölç!",       i: "🔍", d: "İki sayı arasındaki farkı bul",          c: "#5b21b6", grp: "cikarma" },
    subtraction:   { n: "Enerji Ayır!",     i: "🧮", d: "Çıkarma stratejileri: geri say, toplamadan düşün", c: _C.red,    grp: "cikarma" },
    inversePractice:{ n: "Ters Düşün!",     i: "🔄", d: "Toplama ile çıkarma birbirinin tersi",      c: "#7c3aed", grp: "ilişki" },
    wpSub:         { n: "Çıkarma Problemi",  i: "📡", d: "Hikâye problemi: ayrılır, geriye kaç kalır?", c: "#991b1b", grp: "cikarma" },
    wpCompare:     { n: "Karşılaştırma Problemi", i: "📡", d: "Hikâye problemi: hangisinde kaç fazla/eksik?", c: "#4338ca", grp: "cikarma" },
  }},

  // ── KAT7: ÇARPMA VE BÖLME — Multiplying/Dividing Trajectory (9 düzey) ────
  // ltLevel sırası: Sharer(3) → Grouper(2-4) → Concrete(4) → Parts/Wholes(5) → Skip(6) → Array/Deriver(6-8)
  level6: { name: "✖️ Çarpanya", desc: "Çarpma-bölme galaksisi", subGroups: true, modes: {
    repeatAdd:     { n: "Galaktik Tekrar!", i: "🔁", d: "Aynı sayıyı tekrar tekrar topla — bu çarpmadır!", c: "#ea580c", grp: "carpma" },
    multiplyVisual:{ n: "Çarpım Gücü!",     i: "✖️", d: "Eşit gruplardaki yıldız taşlarını çarp",       c: "#9333ea", grp: "carpma" },
    arrayDots:     { n: "Yıldız Dizisi!",   i: "📐", d: "Satır ve sütunlardaki yıldız taşlarını say",  c: "#3b82f6", grp: "carpma" },
    timesTable:    { n: "Strateji Ustası!", i: "🧠", d: "Çarpım tablosu kısayolları: çiftler, ×5, ×9", c: "#dc2626", grp: "carpma" },
    katConcept:    { n: "Kaç Kat?",         i: "🔢", d: "5'in 3 katı kaçtır? — kat kavramını öğren",   c: "#0d9488", grp: "carpma" },
    wpMul:         { n: "Çarpma Problemi", i: "📡", d: "Hikâye problemi: eşit gruplar, toplam kaç?",   c: "#7e22ce", grp: "carpma" },
    equalShare:    { n: "Galaktik Paylaşım!", i: "🍕", d: "Yıldız taşlarını eşit paylaştır",            c: "#0891b2", grp: "bolme" },
    groupCount:    { n: "Filo Grupla!",    i: "👥", d: "Eşit büyüklükte kaç grup oluşturabilirsin?",   c: "#7c3aed", grp: "bolme" },
    halfDouble:    { n: "Bölün-İkilen!",   i: "✂️", d: "Yarıya böl (÷2), ya da iki kat al (×2)",      c: "#be185d", grp: "bolme" },
    divisionBasic: { n: "Bölme Ustası!",   i: "➗", d: "Bölme kısayolları: 1'e bölme, kendine bölme",  c: "#b45309", grp: "bolme" },
    mulDivInverse: { n: "Ters Bağlantı!",  i: "🔄", d: "Çarpma ile bölme birbirinin tersi",           c: "#7c2d12", grp: "iliski" },
    wpDiv:         { n: "Bölme Problemi",  i: "📡", d: "Hikâye problemi: paylaştırma ve gruplama",     c: "#4338ca", grp: "bolme" },
  }},

  // ── KAT8: ÖRÜNTÜ VE CEBİRSEL DÜŞÜNME — Patterning Trajectory (11 düzey) ──
  // ltLevel sırası: Patterner AB(3-4) → Arithmetic Patterner(7) → Relational Thinker(8)
  level7: { name: "🧩 Örünya", desc: "Desenlerin gizli düzeni", learnKey: "level6", modes: {
    patternAB:        { n: "Galaktik Desen!", i: "🔄", d: "Tekrar eden deseni tamamla — sıradaki ne?",   c: "#7c3aed" },
    growingPattern:   { n: "Büyüyen Desen!", i: "📈", d: "Artan veya azalan sayı sırasını devam ettir", c: "#0d9488" },
    patternTranslate: { n: "Desen Çevirmen!", i: "🔀", d: "Aynı deseni farklı şekillerle göster",       c: "#6366f1" },
    trueFalse:        { n: "Denklem Dedektifi!", i: "⚖️", d: "Eşitlik doğru mu yanlış mı? — sen karar ver", c: "#0f766e" },
    missingNumber:    { n: "Kayıp Yıldız!",  i: "❓", d: "Eşitlikteki kayıp sayıyı bul",               c: _C.pink },
    spaceBalance:     { n: "Uzay Terazisi!",  i: "⚖️", d: "İki tarafı eşitle — terazi dengelensin",   c: "#0891b2" },
  }},
};

/** Mod ID'sinden bilgi nesnesini döndüren lookup. */
export const gmi = (id) => {
  for (const cat of Object.values(CATEGORIES)) if (cat.modes[id]) return cat.modes[id];
  return null;
};
