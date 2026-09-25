// ═══════════════════════════════════════════════════════════════════════════════
// ÖĞRENME YÖRÜNGELERİ HARİTALAMASI (§10) — Clements & Sarama [LT]² Entegrasyonu
// Kaynak: LearningTrajectories.org (Clements, D.H. & Sarama, J., 2017/2019)
// Marsico Institute, University of Denver — IES / Gates Foundation / Heising-Simons
//
// Her mod → { trajectory, level, ltLevel, ageRange, description }
// trajectory: LT yörünge adı (18 yörüngeden biri)
// level: Gelişimsel düzey adı (Clements & Sarama terminolojisi)
// ltLevel: Yörünge içi sıra numarası
// ageRange: Tipik yaş aralığı (alt sınır; eğitimle aşılabilir)
// primary (opsiyonel): aralıklı ltLevel içinde asıl hedef düzey
// secondary (opsiyonel): ikincil yörünge etiketi { trajectory, level, ltLevel }
// ═══════════════════════════════════════════════════════════════════════════════
export const LT_TRAJECTORIES = {
  // ── COUNTING (Sayma Yörüngesi — 19 düzey) ────────────────────────────────
  counting:      { trajectory: "Counting",            level: "Counter (Small Numbers) → Counter (10)",    ltLevel: [5,6],  ageRange: "4-5", desc: "Nesneleri anlamlı şekilde sayar, kardinalite ilkesini kavrar" },
  quantityMatch: { trajectory: "Counting",            level: "Counter (Small Numbers) → Counter and Producer (10+)", ltLevel: [5,8], ageRange: "3-4", desc: "Nesneleri sayıp kardinal değere uygun rakamı seçer (≤5 → 10 → 20)" }, // GS-M21
  buildNumber:   { trajectory: "Counting",            level: "Producer (Small Numbers) → Counter and Producer (10+)", ltLevel: [7,8], ageRange: "4",   desc: "Belirli sayıda nesne oluşturur (≤5 → 12'ye kadar)" }, // GS-M22
  backwardCount: { trajectory: "Counting",            level: "Counter Backward from 10 → Counter On Keeping Track", ltLevel: [9,15], ageRange: "5-6", desc: "20'ye kadar bir sayıdan geriye sayar, geri adım sayısını takip eder (onluk geçişi L4+)" }, // GS-M23
  skipCount:     { trajectory: "Counting",            level: "Skip Counter by 10s → Skip Counter",       ltLevel: [11,14],ageRange: "6-7", desc: "2, 5, 10'ar ritmik sayar" },
  counterFromN:  { trajectory: "Counting",            level: "Counter from N (N+1, N-1)",                ltLevel: 10,     ageRange: "6",   desc: "Herhangi bir sayıdan ileriye-geriye doğru sayar (1'den başlamadan)" },
  ordinalCount:  { trajectory: "Comparing/Ordering",  level: "First-Second Ordinal Counter → Ordinal Counter", ltLevel: [4,13], primary: 13, ageRange: "3-5", desc: "Nesnelerin sıra pozisyonunu belirler (birinci, ikinci, üçüncü...)" }, // GS-M01 — Sayalon kategorisinde kalır; yalnız yörünge etiketi değişti
  decadeCount:   { trajectory: "Counting",            level: "Counter to 100",                           ltLevel: 12,     ageRange: "6",   desc: "Onluk geçişlerini (29→30, 99→100) doğru yapar" }, // GS-M02

  // ── SUBITIZING (Anlık Algılama Yörüngesi — 12 düzey) ─────────────────────────────
  subitizing:    { trajectory: "Subitizing",           level: "Perceptual Subitizer to 4 → Conceptual Subitizer to 10", ltLevel: [5,9], ageRange: "4-6", desc: "Saymadan anlık miktar algılama, alt-grup birleştirme" }, // GS-M16
  fivesFrame:    { trajectory: "Subitizing",           level: "Perceptual Subitizer to 5",                ltLevel: 6,      ageRange: "4-5", desc: "5'lik çerçevede yapılandırılmış koleksiyon tanıma" },
  tensFrame:     { trajectory: "Subitizing",           level: "Conceptual Subitizer to 5 → Conceptual Subitizer to 10", ltLevel: [8,9], primary: 9, ageRange: "5-6", desc: "10'luk çerçevede kavramsal anlık algılama" }, // GS-M03
  doubleTensFrame:{ trajectory: "Subitizing",          level: "Conceptual Subitizer to 20",               ltLevel: 10,     ageRange: "6-7", desc: "Çift 10'luk çerçevede 10+n kavramsal anlık algılama" },
  chipGuess:     { trajectory: "Subitizing",           level: "Conceptual Subitizer to 5 → Conceptual Subitizer to 10", ltLevel: [8,9], ageRange: "5-6", desc: "Yapılandırılmış diziyi bir bakışta görüp hatırlama" }, // GS-M04
  rodBack:       { trajectory: "Subitizing",           level: "Conceptual Subitizer to 5 → Conceptual Subitizer to 10", ltLevel: [8,9], ageRange: "5-6", desc: "Çeşitli yapılandırılmış temsilleri bir bakışta görüp hatırlama" }, // GS-M05
  // GS-M06: estimateCount anlık algılama DEĞİL, karşılaştırma yörüngesinin tahmin kolu. Çapraz-kategori etiketi:
  // categories.js onu Şimşeron (anlık algılama) gezegenine, AnalyticsBridge MODE_TO_CATEGORY 'sayma'ya koyar; ikisi de yörüngeyle örtüşmez.
  estimateCount: { trajectory: "Comparing/Ordering",   level: "Spatial Extent Estimator → Benchmarks Estimator", ltLevel: [17,22], ageRange: "6-7", desc: "Yapılandırılmamış koleksiyonun büyüklüğünü tahmin etme (5/10 referans küme)" }, // GS-M06

  // ── COMPARING AND ORDERING (Karşılaştırma ve Sıralama — 23 düzey) ────────
  comparison:    { trajectory: "Comparing/Ordering",   level: "Counting Comparer (5) → Counting Comparer (10)", ltLevel: [10,14], ageRange: "5-6", desc: "Çeşitli temsillerle iki çokluğu karşılaştırır" },
  lessMoreEqual: { trajectory: "Comparing/Ordering",   level: "Perceptual Comparer → Matching Comparer",       ltLevel: [5,7],  ageRange: "4-5", desc: "Az-çok-eşit ilişkilerini belirler" },
  ordering:      { trajectory: "Comparing/Ordering",   level: "Counting Comparer (10) → Serial Orderer to 6+", ltLevel: [12,16], ageRange: "5-6", desc: "Sayıları küçükten büyüğe sıralar" },
  beforeAfter:   { trajectory: "Counting",            level: "Counter (10) → Counter from N (N + 1, N − 1)", ltLevel: [6,10], primary: 10, ageRange: "4-5", desc: "Bir sayının hemen öncesini ve sonrasını bilir" }, // GS-M07 — Terazya kategorisinde kalır; yörünge etiketi Counting
  fiveMore:      { trajectory: "Comparing/Ordering",   level: "Counting Comparer (5) → Mental Number Line to 10", ltLevel: [11,15], ageRange: "5-7", desc: "5/10 referans noktasına göre büyüklük yargısı" }, // GS-M08
  numberLineEstimate: { trajectory: "Comparing/Ordering", level: "Mental Number Line to 10",              ltLevel: 15,     ageRange: "6-7", desc: "Sayı doğrusunda konumdan büyüklük tahmini" },
  nlPlacement:   { trajectory: "Comparing/Ordering",   level: "Mental Number Line to 10 → Mental Number Line to 100 (partial, ≤40)", ltLevel: [15,19], ageRange: "6-7", desc: "Sayıyı zihinsel sayı doğrusunda konumlandırır" }, // GS-M09 — nlRange yaş uyumu için bilinçli olarak ≤40; 100'e genişletilmedi
  numberLine:    { trajectory: "Counting",            level: "Counter (10) → Counter from N (N + 1, N − 1)", ltLevel: [6,10], primary: 10, ageRange: "6-7", desc: "Etiketli ardışık sayı doğrusunda eksik (ara) sayıyı bulur" }, // GS-M10 — counterFromN ile örtüşür
  lengthGuess:   { trajectory: "Comparing/Ordering",   level: "Spatial Extent Estimator",                 ltLevel: 17,     ageRange: "6-7", desc: "Uzunluğa dayalı büyüklük tahmini" },

  // ── ADDING / SUBTRACTING (Toplama-Çıkarma — 12 düzey) ────────────────────
  addChips:      { trajectory: "Adding/Subtracting",   level: "Find Result +/-",                         ltLevel: 4,      ageRange: "4-5", desc: "Nesneleri birleştirerek sonucu bulma (concrete)" },
  removeChips:   { trajectory: "Adding/Subtracting",   level: "Find Result +/-",                         ltLevel: 4,      ageRange: "4-5", desc: "Nesneleri ayırarak sonucu bulma (concrete)" },
  countOnAdd:    { trajectory: "Adding/Subtracting",   level: "Counting Strategies +/-",                  ltLevel: 7,      ageRange: "5-6", desc: "Büyük sayıdan üzerine sayarak toplama (counting on)" },
  addition:      { trajectory: "Adding/Subtracting",   level: "Counting Strategies +/- → Deriver +/-",   ltLevel: [7,10], ageRange: "5-7", desc: "Strateji tabanlı toplama: çiftler, 10'a tamamla, yakın çiftler" },
  subtraction:   { trajectory: "Adding/Subtracting",   level: "Counting Strategies +/- → Deriver +/-",   ltLevel: [7,10], ageRange: "5-7", desc: "Strateji tabanlı çıkarma: geri say, toplamadan düşün" },
  inversePractice:{ trajectory: "Adding/Subtracting",  level: "Part-Whole +/- → Numbers-in-Numbers +/-", ltLevel: [8,9],  ageRange: "6-7", desc: "Toplama↔çıkarma ters ilişki (inverse operations)" },
  wpAdd:         { trajectory: "Adding/Subtracting",   level: "Find Result +/- → Problem Solver +/-",    ltLevel: [4,11], ageRange: "4-7", desc: "Sözel toplama problemlerini çözme" },
  wpSub:         { trajectory: "Adding/Subtracting",   level: "Find Result +/- → Problem Solver +/-",    ltLevel: [4,11], ageRange: "5-7", desc: "Sözel çıkarma problemlerini çözme" }, // GS-M14
  wpCompare:     { trajectory: "Adding/Subtracting",   level: "Find Change +/- → Problem Solver +/-",    ltLevel: [6,11], ageRange: "6-7", desc: "Karşılaştırmalı sözel problemleri çözme" }, // GS-M15
  difference:    { trajectory: "Adding/Subtracting",   level: "Find Change +/-",                         ltLevel: 6,      ageRange: "5-6", desc: "İki çokluk arasındaki farkı bulma" },

  // ── COMPOSING NUMBERS (Sayı Oluşturma — 10 düzey) ────────────────────────
  makeFive:      { trajectory: "Composing Numbers",    level: "Composer to 4, then 5",                   ltLevel: 4,      ageRange: "4-5", desc: "5'in parça-bütün kombinasyonlarını bilir" },
  makeTen:       { trajectory: "Composing Numbers",    level: "Composer to 10",                           ltLevel: 6,      ageRange: "5-6", desc: "10'un parça-bütün kombinasyonlarını bilir" },
  partWhole:     { trajectory: "Composing Numbers",    level: "Composer to 7 → Composer to 10",           ltLevel: [5,6],  ageRange: "5-6", desc: "Bütünün parçalarını ve parçalardan bütünü bilir" },
  numbersInNumbers: { trajectory: "Composing Numbers", level: "Composer to 4, then 5 → Composer to 10",  ltLevel: [4,6],  ageRange: "6-7", desc: "Bir sayının tüm parça kombinasyonlarını görür (7=3+4=5+2=6+1)" }, // GS-M11
  composeNumber: { trajectory: "Composing Numbers",    level: "Composer with Tens and Ones",             ltLevel: 7,      ageRange: "7",   desc: "İki basamaklı sayıları onluk+birlik olarak oluşturur", secondary: { trajectory: "Counting", level: "Counter of Quantitative Units/Place Value", ltLevel: 16 } }, // GS-M12 — ikincil etiket: oyun L5 yüzlükleri (100-399)
  expandForm:    { trajectory: "Composing Numbers",    level: "Composer with Tens and Ones",             ltLevel: 7,      ageRange: "7",   desc: "Genişletilmiş gösterimle sayı yapısını çözümler" }, // GS-M12

  // ── MULTIPLYING / DIVIDING (Çarpma-Bölme — 9 düzey) ──────────────────────
  repeatAdd:     { trajectory: "Multiplying/Dividing", level: "Concrete Modeler ×/÷ → Skip Counter ×/÷",  ltLevel: [4,6],  ageRange: "5-6", desc: "Eşit grupları tekrarlı toplamayla çarpmaya geçiş" }, // GS-M17
  arrayDots:     { trajectory: "Multiplying/Dividing", level: "Skip Counter ×/÷ → Array Quantifier",     ltLevel: [6,8], ageRange: "6-7", desc: "Dizi modelinde satır×sütun çarpma" },
  multiplyVisual:{ trajectory: "Multiplying/Dividing", level: "Concrete Modeler ×/÷",                    ltLevel: 4,      ageRange: "6",   desc: "Eşit grup görsel çarpması" },
  timesTable:    { trajectory: "Multiplying/Dividing", level: "Deriver ×/÷",                             ltLevel: 7,      ageRange: "7",   desc: "Çarpma stratejileri: 0/1 etkisi, çiftler, ×5, ×9, kare" },
  equalShare:    { trajectory: "Multiplying/Dividing", level: "Grouper and Distributive Sharer",          ltLevel: 3,      ageRange: "5-6", desc: "Eşit dağıtma (partitive bölme)" },
  groupCount:    { trajectory: "Multiplying/Dividing", level: "Concrete Modeler ×/÷ → Skip Counter ×/÷",  ltLevel: [4,6],  ageRange: "6",   desc: "Eşit gruplara ayırma (quotitive / ölçme bölmesi)" }, // GS-M18
  halfDouble:    { trajectory: "Multiplying/Dividing", level: "Skip Counter ×/÷",                        ltLevel: 6,      ageRange: "6-7", desc: "×2 ikileme ve ÷2 yarılama" },
  divisionBasic: { trajectory: "Multiplying/Dividing", level: "Deriver ×/÷",                             ltLevel: 7,      ageRange: "7",   desc: "Bölme stratejileri: n÷1, n÷n, çarpmayı düşün" },
  mulDivInverse: { trajectory: "Multiplying/Dividing", level: "Parts and Wholes ×/÷ → Deriver ×/÷",     ltLevel: [5,7],  ageRange: "6-7", desc: "Çarpma ↔ bölme ters ilişki" },
  katConcept:    { trajectory: "Multiplying/Dividing", level: "Skip Counter ×/÷ → Deriver ×/÷",         ltLevel: [6,7],  ageRange: "7",   desc: "Kat kavramı: çarpımsal karşılaştırma" },
  wpMul:         { trajectory: "Multiplying/Dividing", level: "Concrete Modeler ×/÷ → Array Quantifier", ltLevel: [4,8],  ageRange: "6-7", desc: "Sözel çarpma problemleri" },
  wpDiv:         { trajectory: "Multiplying/Dividing", level: "Partitive Divisor",                       ltLevel: 9,      ageRange: "7",   desc: "Sözel bölme problemleri" },

  // ── PLACE VALUE (Basamak Değeri — Counting yörüngesinin üst düzeyleri) ────
  bundleTens:    { trajectory: "Counting",             level: "Counter of Quantitative Units/Place Value", ltLevel: 16,    ageRange: "6-7", desc: "10'lu gruplara ayırarak sayma (birimleştirme)" },
  placeValue:    { trajectory: "Counting",             level: "Counter of Quantitative Units/Place Value", ltLevel: 16,    ageRange: "6-7", desc: "Basamak değerini anlama" },

  // ── PATTERNS & ALGEBRAIC THINKING (Örüntü — 11 düzey) ────────────────────
  patternAB:     { trajectory: "Patterning",           level: "Pattern Duplicator AB → Pattern Extender",  ltLevel: [3,4],  ageRange: "3-5", desc: "Tekrar eden örüntüleri tanır, tamamlar ve genişletir; L5+ ABBC/AABB 4-elemanlı çekirdek" },
  growingPattern:{ trajectory: "Patterning",           level: "Numeric Patterner → Beginning Arithmetic Patterner", ltLevel: [6,7], ageRange: "5-7", desc: "Artan/azalan sayı örüntülerinde kural bulma; L5+ değişken adım (uzatma)" },
  patternTranslate:{ trajectory: "Patterning",         level: "Pattern Unit Recognizer",     ltLevel: 5,      ageRange: "4-5", desc: "Örüntüyü farklı temsile çevirme ve çekirdek birim tanıma" },
  trueFalse:     { trajectory: "Patterning",           level: "Numeric Patterner → Beginning Arithmetic Patterner", ltLevel: [7,8], ageRange: "5-7", desc: "Eşitlik ilkeleri: değişme özelliği, etkisiz eleman, denge" },
  missingNumber: { trajectory: "Adding/Subtracting",   level: "Find Result +/- → Numbers-in-Numbers +/-", ltLevel: [4,9], primary: 6, ageRange: "6-7", desc: "Denklemde bilinmeyen terimi bulur (sonuç/değişim/başlangıç bilinmeyen)", secondary: { trajectory: "Patterning", level: "Beginning Arithmetic Patterner", ltLevel: 7 } }, // GS-M19 — ikincil: ters biçim (c = a+b), eşittir işaretinin anlamı

  // ── NUMBER CONSERVATION (Sayı Korunumu — Counting yörüngesi) ─────────────
  conservation:  { trajectory: "Counting",             level: "Number Conserver",                          ltLevel: 18,     ageRange: "7",   desc: "Dizilim değişse de sayının korunduğunu bilir" },
  matching:      { trajectory: "Counting",             level: "Counter (Small Numbers) → Counter and Producer (10+)", ltLevel: [5,8], ageRange: "3-4", desc: "Rakamı okuyup o kardinal değerdeki kümeyi seçer" }, // GS-M20

  // ── FRACTIONS (Kesirler — 11 düzey) ──────────────────────────────────────
  fracCompare:   { trajectory: "Fractions",            level: "Fraction Maker from Units → Fraction Maker", ltLevel: [6,7], ageRange: "7-9", desc: "İki basit kesri görsel temsille (bar) karşılaştırır" }, // GS-M13 — NOT: fcBar bütün genişliği sabit değil (oyun kodu, ayrı düzeltme)
};
