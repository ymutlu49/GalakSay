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
    matching:      { n: "Yıldız Eşle!",    i: "🎯", d: "Rakamı çoklukla eşle (bire-bir)",       c: _C.green },
    quantityMatch: { n: "Göktaşı Eşle!",  i: "🎲", d: "Rakamı doğru çoklukla eşle",             c: "#0891b2" },
    counting:      { n: "Göktaşı Say!",    i: "🔢", d: "Tek tek sayarak toplamı bul",             c: _C.blue },
    buildNumber:   { n: "Yıldız Taşı Diz!",    i: "🔨", d: "İstenen sayı kadar yıldız taşı yerleştir",        c: "#d97706" },
    ordinalCount:  { n: "Sıra Keşfi!",    i: "🏅", d: "Kaçıncı sırada? Sıra sayısını bul",       c: "#16a34a" },
    backwardCount: { n: "Geri Sayım!",     i: "⏪", d: "Geriye doğru ritmik say (20'ye kadar)",    c: "#e11d48" },
    counterFromN:  { n: "Yörüngeden Say!", i: "🔁", d: "Herhangi bir sayıdan ileriye-geriye say",   c: "#60a5fa" },
    decadeCount:   { n: "Onluk Geçidi!",   i: "🌉", d: "Onluk geçişlerini (29→30) doğru yap",    c: "#9333ea" },
    skipCount:     { n: "Galaktik Ritim!", i: "🎵", d: "2, 3, 4, 5, 10'ar ritmik say",           c: "#16a34a" },
    conservation:  { n: "Yanılsama mı?",   i: "🔄", d: "Dizilim değişse sayı değişir mi?",       c: "#7e22ce" },
  }},

  // ── KAT2: SANBİL — Subitizing Trajectory (12 düzey) ──────────────────────
  // ltLevel sırası: Perceptual(5-6) → Conceptual(8) → Büyük Koleksiyon Tahmini(9)
  level2: { name: "⚡ Şimşeron", desc: "Bir bakışta gör, şimşek hızında!", learnKey: "level7", modes: {
    fivesFrame:    { n: "Beşli Radar",     i: "5️⃣", d: "5'lik çerçevede miktarı bir bakışta söyle",  c: "#4f46e5" },
    subitizing:    { n: "Işık Hızı!",      i: "⚡", d: "Saymadan bir bakışta miktarı söyle",         c: "#7c3aed" },
    tensFrame:     { n: "Onlu Radar",      i: "🔟", d: "10'luk çerçevede miktarı bul",              c: "#7c3aed" },
    chipGuess:     { n: "Uzay Hafızası",   i: "👀", d: "Yıldız taşlarını bir bakışta gör ve hatırla",     c: "#7c3aed" },
    rodBack:       { n: "Hafıza Şimşeği",  i: "🔄", d: "Farklı gösterimleri bir bakışta gör ve hatırla",        c: "#b45309" },
    doubleTensFrame:{ n: "Çift Onlu Radar",i: "🔟🔟",d: "Çift 10'luk çerçevede 11-20 arası miktarı bul", c: "#6d28d9" },
    estimateCount: { n: "Galaktik Tahmin", i: "🎯", d: "Gruptaki nesne sayısını tahmin et",          c: "#b45309" },
  }},

  // ── KAT3: KARŞILAŞTIRMA VE SIRALAMA — Comparing/Ordering Trajectory (23 düzey) ──
  // ltLevel sırası: Comparer(5-7) → Before/After(8) → Counting Comparer(10-14) → Mental NL(11-18) → Estimator(17)
  level3: { name: "⚖️ Terazya", desc: "Denge ve düzen gezegeni", learnKey: "level2", modes: {
    lessMoreEqual: { n: "Kozmik Terazi",   i: "⚖️", d: "İki grubu karşılaştır",                 c: "#dc2626" },
    beforeAfter:   { n: "Yörünge Komşusu", i: "↔️", d: "Sayı komşusunu bul",                    c: "#0d9488" },
    comparison:    { n: "Gezegen Düellosu", i: "🏆", d: "Çeşitli gösterimlerle büyüklük karşılaştır", c: _C.teal },
    fiveMore:      { n: "5 Yıldız Skalası",i: "🖐️", d: "5 veya 10 referansına göre konumla",    c: "#7c3aed" },
    ordering:      { n: "Yörünge Sırala!", i: "📊", d: "Küçükten büyüğe veya büyükten küçüğe sırala", c: "#8b5cf6" },
    numberLineEstimate: { n: "Galaktik Konum", i: "📍", d: "Konumdan sayıyı tahmin",              c: "#0f766e" },
    nlPlacement:   { n: "Yörüngeye Yerleştir", i: "🎯", d: "Sayıyı doğru konuma koy",           c: "#6d28d9" },
    numberLine:    { n: "Kayıp Kapsül",     i: "🔍", d: "Doğru kapsülü bul",                      c: "#5b21b6" },
    lengthGuess:   { n: "Gizli Nebula",    i: "📏", d: "Uzunluktan tahmin et",                   c: "#6d28d9" },
  }},

  // ── KAT4: SAYI BİLEŞİMİ — Composing Numbers Trajectory (10 düzey) ────────
  // ltLevel sırası: Composer to 5(4) → to 7-10(5-6) → Composer to 10(6) → Numbers-in-Numbers(9)
  level4: { name: "🧱 Bileşya", desc: "Sayı bağlarını keşfet!", learnKey: "level3", modes: {
    makeFive:         { n: "5 Yıldız Taşı Topla!",  i: "✋", d: "5'in sayı bağını bul",                  c: "#6d28d9" },
    partWhole:        { n: "Parça-Bütün Puzzle", i: "🧩", d: "Eksik parçayı bul",                    c: _C.purple },
    makeTen:          { n: "10 Yıldız Taşı Topla!", i: "🎯", d: "10'un arkadaşını bul",                  c: "#059669" },
    numbersInNumbers: { n: "Sayı Galaksisi",    i: "🔢", d: "Bir sayının tüm parça kombinasyonlarını bul", c: "#6d28d9" },
    spaceKitchen:     { n: "Uzay Mutfağı",      i: "🧪", d: "Rod'ları sürükle, hedef sayıyı oluştur — birden fazla çözüm!", c: "#b45309" },
    rodSplit:         { n: "İkili Görev",        i: "✂️", d: "Rod'u kes, tüm dekompozisyonları keşfet!", c: "#7c2d12" },
  }},

  // ── KAT5: BASAMAK DEĞERİ — Place Value (Counting üst düzey + Composing Tens/Ones) ──
  // ltLevel sırası: Composer Tens/Ones(7) → Genişletilmiş(7) → Birimleştirme(16) → Basamak Tanıma(16)
  level8: { name: "🏛️ Basamara", desc: "Onluklar tapınağını keşfet!", learnKey: "level4", modes: {
    composeNumber: { n: "Gezegen Oluştur",  i: "🧱", d: "Onluk + birlik → sayı yap",             c: "#d97706" },
    expandForm:    { n: "Galaktik Açılım",  i: "🔭", d: "Genişletilmiş gösterimi bul",            c: "#059669" },
    bundleTens:    { n: "Onluk Nebula!",    i: "📦", d: "10 birliği bir araya topla — onluk yap!", c: "#5b21b6" },
    placeValue:    { n: "Katman Keşfet",    i: "🏛️", d: "Rakamın gerçek değerini bul",           c: "#7c3aed" },
  }},

  // ── KAT6: TOPLAMA VE ÇIKARMA — Adding/Subtracting Trajectory (12 düzey) ──
  // ltLevel sırası: Find Result(4) → Find Change(6) → Counting Strategies(7-8) → Problem Solver(4-11)
  level5: { name: "🌗 Toplarya", desc: "Toplama-çıkarma yörüngesi", subGroups: true, modes: {
    addChips:      { n: "Yıldız Taşı Birleştir!", i: "➕", d: "Birleştirerek topla",           c: _C.teal,   grp: "toplama" },
    countOnAdd:    { n: "Büyükten Say!",     i: "🔢", d: "Büyük sayıdan üzerine sayarak topla",   c: "#0d9488", grp: "toplama" },
    addition:      { n: "Güç Birleştir!",    i: "🧮", d: "Strateji: çiftler, 10'a tamamla, yakın çiftler", c: _C.orange, grp: "toplama" },
    wpAdd:         { n: "Toplama Problemi",  i: "📡", d: "Sözel problem: birleştir, parça-bütün", c: "#b45309", grp: "toplama" },
    removeChips:   { n: "Yıldız Taşı Ayır!",    i: "➖", d: "Ayırarak çıkar",                 c: _C.pink,   grp: "cikarma" },
    difference:    { n: "Mesafe Ölç!",       i: "🔍", d: "Aradaki farkı bul (eşleştir)",         c: "#5b21b6", grp: "cikarma" },
    subtraction:   { n: "Enerji Ayır!",     i: "🧮", d: "Strateji: geri say, toplamadan düşün",   c: _C.red,    grp: "cikarma" },
    inversePractice:{ n: "Ters Düşün!",     i: "🔄", d: "Toplama ↔ çıkarma ters ilişki",         c: "#7c3aed", grp: "ilişki" },
    wpSub:         { n: "Çıkarma Problemi",  i: "📡", d: "Sözel problem: ayır, karşılaştır",     c: "#991b1b", grp: "cikarma" },
    wpCompare:     { n: "Karşılaştırma Problemi", i: "📡", d: "Sözel problem: fark, karşılaştırma", c: "#4338ca", grp: "cikarma" },
  }},

  // ── KAT7: ÇARPMA VE BÖLME — Multiplying/Dividing Trajectory (9 düzey) ────
  // ltLevel sırası: Sharer(3) → Grouper(2-4) → Concrete(4) → Parts/Wholes(5) → Skip(6) → Array/Deriver(6-8)
  level6: { name: "✖️ Çarpanya", desc: "Çarpma-bölme galaksisi", subGroups: true, modes: {
    repeatAdd:     { n: "Galaktik Tekrar", i: "🔁", d: "Eşit grupları topla → çarpma keşfet",  c: "#ea580c", grp: "carpma" },
    multiplyVisual:{ n: "Çarpım Gücü!",   i: "✖️", d: "Eşit grup çarpması",                    c: "#9333ea", grp: "carpma" },
    arrayDots:     { n: "Yıldız Dizisi",   i: "📐", d: "Satır × sütun dizileri",  c: "#3b82f6", grp: "carpma" },
    timesTable:    { n: "Strateji Ustası!", i: "🧠", d: "0/1 etkisi, çiftler, ×5, ×9 stratejisi, kare", c: "#dc2626", grp: "carpma" },
    katConcept:    { n: "Kaç Kat?",        i: "🔢", d: "Kat kavramı: 5'in 3 katı → 5×3",       c: "#0d9488", grp: "carpma" },
    wpMul:         { n: "Çarpma Problemi", i: "📡", d: "Sözel problem: çarpma",                 c: "#7e22ce", grp: "carpma" },
    equalShare:    { n: "Galaktik Paylaşım!", i: "🍕", d: "Eşit paylaştır",             c: "#0891b2", grp: "bolme" },
    groupCount:    { n: "Filo Grupla!",    i: "👥", d: "Eşit gruplara ayır",                c: "#7c3aed", grp: "bolme" },
    halfDouble:    { n: "Bölün-İkilen!",   i: "✂️", d: "÷2 yarıla, ×2 ikile",                  c: "#be185d", grp: "bolme" },
    divisionBasic: { n: "Bölme Ustası!",   i: "➗", d: "n÷1=n, n÷n=1, çarpmayı düşün stratejisi", c: "#b45309", grp: "bolme" },
    mulDivInverse: { n: "Ters Bağlantı!",  i: "🔄", d: "Çarpma ↔ bölme ters ilişki",           c: "#7c2d12", grp: "iliski" },
    wpDiv:         { n: "Bölme Problemi",  i: "📡", d: "Sözel problem: bölme",                  c: "#4338ca", grp: "bolme" },
  }},

  // ── KAT8: ÖRÜNTÜ VE CEBİRSEL DÜŞÜNME — Patterning Trajectory (11 düzey) ──
  // ltLevel sırası: Patterner AB(3-4) → Arithmetic Patterner(7) → Relational Thinker(8)
  level7: { name: "🧩 Örünya", desc: "Desenlerin gizli düzeni", learnKey: "level6", modes: {
    patternAB:        { n: "Galaktik Desen!", i: "🔄", d: "Tekrar eden deseni tamamla (şekil + renk + 4-elemanlı çekirdek)",  c: "#7c3aed" },
    growingPattern:   { n: "Büyüyen Desen!", i: "📈", d: "Artan/azalan sayı örüntüsünü devam ettir + değişken adım",   c: "#0d9488" },
    patternTranslate: { n: "Desen Çevirmen!", i: "🔀", d: "Örüntüyü farklı temsile çevir, çekirdeği bul", c: "#6366f1" },
    trueFalse:        { n: "Denklem Dedektifi!", i: "⚖️", d: "Eşitlik ilkesi: değişme, etkisiz eleman, denge", c: "#0f766e" },
    missingNumber:    { n: "Kayıp Yıldız!",  i: "❓", d: "Kayıp sayıyı bul",                      c: _C.pink },
    spaceBalance:     { n: "Uzay Terazisi",   i: "⚖️", d: "İki tarafı dengele — eşitlik kavramını keşfet", c: "#0891b2" },
  }},
};

/** Mod ID'sinden bilgi nesnesini döndüren lookup. */
export const gmi = (id) => {
  for (const cat of Object.values(CATEGORIES)) if (cat.modes[id]) return cat.modes[id];
  return null;
};
