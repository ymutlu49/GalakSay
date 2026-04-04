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
// ═══════════════════════════════════════════════════════════════════════════════
export const LT_TRAJECTORIES = {
  // ── COUNTING (Sayma Yörüngesi — 19 düzey) ────────────────────────────────
  counting:      { trajectory: "Counting",            level: "Counter (Small Numbers) → Counter (10)",    ltLevel: [5,6],  ageRange: "4-5", desc: "Nesneleri anlamlı şekilde sayar, kardinalite ilkesini kavrar" },
  quantityMatch: { trajectory: "Counting",            level: "Corresponder → Counter (Small Numbers)",   ltLevel: [4,5],  ageRange: "3-4", desc: "Sayı sözcükleri ile nesneler arasında bire-bir eşleme kurar" },
  buildNumber:   { trajectory: "Counting",            level: "Producer (Small Numbers)",                 ltLevel: 7,      ageRange: "4",   desc: "Belirli sayıda nesne oluşturur" },
  backwardCount: { trajectory: "Counting",            level: "Counter Backward from 10",                 ltLevel: 9,      ageRange: "5-6", desc: "10'dan geriye doğru sayar" },
  skipCount:     { trajectory: "Counting",            level: "Skip Counter by 10s → Skip Counter",       ltLevel: [11,14],ageRange: "6-7", desc: "2, 5, 10'ar ritmik sayar" },
  counterFromN:  { trajectory: "Counting",            level: "Counter from N (N+1, N-1)",                ltLevel: 10,     ageRange: "6",   desc: "Herhangi bir sayıdan ileriye-geriye doğru sayar (1'den başlamadan)" },
  ordinalCount:  { trajectory: "Counting",            level: "Ordinal Counter",                          ltLevel: [5,8],  ageRange: "3-5", desc: "Nesnelerin sıra pozisyonunu belirler (birinci, ikinci, üçüncü...)" },
  decadeCount:   { trajectory: "Counting",            level: "Counter to 100",                           ltLevel: 13,     ageRange: "6",   desc: "Onluk geçişlerini (29→30, 99→100) doğru yapar" },

  // ── SUBITIZING (Sanbil Yörüngesi — 12 düzey) ─────────────────────────────
  subitizing:    { trajectory: "Subitizing",           level: "Perceptual Subitizer → Conceptual Subitizer", ltLevel: [5,8], ageRange: "4-6", desc: "Saymadan anlık miktar algılama, alt-grup birleştirme" },
  fivesFrame:    { trajectory: "Subitizing",           level: "Perceptual Subitizer to 5",                ltLevel: 6,      ageRange: "4-5", desc: "5'lik çerçevede yapılandırılmış koleksiyon tanıma" },
  tensFrame:     { trajectory: "Subitizing",           level: "Conceptual Subitizer to 10",               ltLevel: 8,      ageRange: "5-6", desc: "10'luk çerçevede kavramsal sanbil" },
  doubleTensFrame:{ trajectory: "Subitizing",          level: "Conceptual Subitizer to 20",               ltLevel: 10,     ageRange: "6-7", desc: "Çift 10'luk çerçevede 10+n kavramsal sanbil" },
  chipGuess:     { trajectory: "Subitizing",           level: "Conceptual Subitizer to 10",               ltLevel: 8,      ageRange: "5-6", desc: "Yapılandırılmış diziyi bir bakışta görüp hatırlama" },
  rodBack:       { trajectory: "Subitizing",           level: "Conceptual Subitizer to 10",               ltLevel: 8,      ageRange: "5-6", desc: "Çeşitli yapılandırılmış temsilleri bir bakışta görüp hatırlama" },
  estimateCount: { trajectory: "Subitizing",           level: "Conceptual Subitizer to 20",               ltLevel: 9,      ageRange: "6-7", desc: "Yapılandırılmamış koleksiyonun büyüklüğünü tahmin etme" },

  // ── COMPARING AND ORDERING (Karşılaştırma ve Sıralama — 23 düzey) ────────
  comparison:    { trajectory: "Comparing/Ordering",   level: "Counting Comparer (5) → Counting Comparer (10)", ltLevel: [10,14], ageRange: "5-6", desc: "Çeşitli temsillerle iki çokluğu karşılaştırır" },
  lessMoreEqual: { trajectory: "Comparing/Ordering",   level: "Early Comparer → Matching Comparer",       ltLevel: [5,7],  ageRange: "4-5", desc: "Az-çok-eşit ilişkilerini belirler" },
  ordering:      { trajectory: "Comparing/Ordering",   level: "Serial Orderer to 5 → Serial Orderer to 6+", ltLevel: [12,16], ageRange: "5-6", desc: "Sayıları küçükten büyüğe sıralar" },
  beforeAfter:   { trajectory: "Comparing/Ordering",   level: "Counter (10) — immediately before/after",  ltLevel: 8,      ageRange: "4-5", desc: "Bir sayının hemen öncesini ve sonrasını bilir" },
  fiveMore:      { trajectory: "Comparing/Ordering",   level: "Mental Number Line to 5 → to 10 → to 20", ltLevel: [11,15],ageRange: "5-7", desc: "5/10 referans noktasına göre büyüklük yargısı" },
  numberLineEstimate: { trajectory: "Comparing/Ordering", level: "Mental Number Line to 10",              ltLevel: 15,     ageRange: "6-7", desc: "Sayı doğrusunda konumdan büyüklük tahmini" },
  nlPlacement:   { trajectory: "Comparing/Ordering",   level: "Mental Number Line to 10 → to 100",       ltLevel: [15,18],ageRange: "6-7", desc: "Sayıyı zihinsel sayı doğrusunda konumlandırır" },
  numberLine:    { trajectory: "Comparing/Ordering",   level: "Spatial Extent Estimator",                 ltLevel: 17,     ageRange: "6-7", desc: "Uzunluk/büyüklükten sayı çıkarımı" },
  lengthGuess:   { trajectory: "Comparing/Ordering",   level: "Spatial Extent Estimator",                 ltLevel: 17,     ageRange: "6-7", desc: "Uzunluğa dayalı büyüklük tahmini" },

  // ── ADDING / SUBTRACTING (Toplama-Çıkarma — 12 düzey) ────────────────────
  addChips:      { trajectory: "Adding/Subtracting",   level: "Find Result +/-",                         ltLevel: 4,      ageRange: "4-5", desc: "Nesneleri birleştirerek sonucu bulma (concrete)" },
  removeChips:   { trajectory: "Adding/Subtracting",   level: "Find Result +/-",                         ltLevel: 4,      ageRange: "4-5", desc: "Nesneleri ayırarak sonucu bulma (concrete)" },
  countOnAdd:    { trajectory: "Adding/Subtracting",   level: "Counting Strategies +/-",                  ltLevel: 7,      ageRange: "5-6", desc: "Büyük sayıdan üzerine sayarak toplama (counting on)" },
  addition:      { trajectory: "Adding/Subtracting",   level: "Counting Strategies +/- → Deriver +/-",   ltLevel: [7,10], ageRange: "5-7", desc: "Strateji tabanlı toplama: çiftler, 10'a tamamla, yakın çiftler" },
  subtraction:   { trajectory: "Adding/Subtracting",   level: "Counting Strategies +/- → Deriver +/-",   ltLevel: [7,10], ageRange: "5-7", desc: "Strateji tabanlı çıkarma: geri say, toplamadan düşün" },
  inversePractice:{ trajectory: "Adding/Subtracting",  level: "Part-Whole +/- → Numbers-in-Numbers +/-", ltLevel: [8,9],  ageRange: "6-7", desc: "Toplama↔çıkarma ters ilişki (inverse operations)" },
  wpAdd:         { trajectory: "Adding/Subtracting",   level: "Find Result +/- → Problem Solver +/-",    ltLevel: [4,11], ageRange: "4-7", desc: "Sözel toplama problemlerini çözme" },
  wpSub:         { trajectory: "Adding/Subtracting",   level: "Find Change +/- → Problem Solver +/-",    ltLevel: [6,11], ageRange: "5-7", desc: "Sözel çıkarma problemlerini çözme" },
  wpCompare:     { trajectory: "Adding/Subtracting",   level: "Part-Whole +/- → Problem Solver +/-",     ltLevel: [8,11], ageRange: "6-7", desc: "Karşılaştırmalı sözel problemleri çözme" },
  difference:    { trajectory: "Adding/Subtracting",   level: "Find Change +/-",                         ltLevel: 6,      ageRange: "5-6", desc: "İki çokluk arasındaki farkı bulma" },

  // ── COMPOSING NUMBERS (Sayı Oluşturma — 10 düzey) ────────────────────────
  makeFive:      { trajectory: "Composing Numbers",    level: "Composer to 4, then 5",                   ltLevel: 4,      ageRange: "4-5", desc: "5'in parça-bütün kombinasyonlarını bilir" },
  makeTen:       { trajectory: "Composing Numbers",    level: "Composer to 10",                           ltLevel: 6,      ageRange: "5-6", desc: "10'un parça-bütün kombinasyonlarını bilir" },
  partWhole:     { trajectory: "Composing Numbers",    level: "Composer to 7 → Composer to 10",           ltLevel: [5,6],  ageRange: "5-6", desc: "Bütünün parçalarını ve parçalardan bütünü bilir" },
  numbersInNumbers: { trajectory: "Composing Numbers", level: "Numbers-in-Numbers +/-",                   ltLevel: 9,      ageRange: "6-7", desc: "Bir sayının tüm parça kombinasyonlarını görür (7=3+4=5+2=6+1)" },
  composeNumber: { trajectory: "Composing Numbers",    level: "Composer with Tens and Ones",              ltLevel: 7,      ageRange: "7",   desc: "İki basamaklı sayıları onluk+birlik olarak oluşturur" },
  expandForm:    { trajectory: "Composing Numbers",    level: "Composer with Tens and Ones",              ltLevel: 7,      ageRange: "7",   desc: "Genişletilmiş gösterimle sayı yapısını çözümler" },

  // ── MULTIPLYING / DIVIDING (Çarpma-Bölme — 9 düzey) ──────────────────────
  repeatAdd:     { trajectory: "Multiplying/Dividing", level: "Beginning Grouper → Concrete Modeler ×/÷", ltLevel: [2,4], ageRange: "5-6", desc: "Eşit grupları tekrarlı toplamayla çarpmaya geçiş" },
  arrayDots:     { trajectory: "Multiplying/Dividing", level: "Skip Counter ×/÷ → Array Quantifier",     ltLevel: [6,8], ageRange: "6-7", desc: "Dizi modelinde satır×sütun çarpma" },
  multiplyVisual:{ trajectory: "Multiplying/Dividing", level: "Concrete Modeler ×/÷",                    ltLevel: 4,      ageRange: "6",   desc: "Eşit grup görsel çarpması" },
  timesTable:    { trajectory: "Multiplying/Dividing", level: "Deriver ×/÷",                             ltLevel: 7,      ageRange: "7",   desc: "Çarpma stratejileri: 0/1 etkisi, çiftler, ×5, ×9, kare" },
  equalShare:    { trajectory: "Multiplying/Dividing", level: "Grouper and Distributive Sharer",          ltLevel: 3,      ageRange: "5-6", desc: "Eşit dağıtma (partitive bölme)" },
  groupCount:    { trajectory: "Multiplying/Dividing", level: "Parts and Wholes ×/÷",                    ltLevel: 5,      ageRange: "6",   desc: "Eşit gruplara ayırma (quotitive bölme)" },
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
  patternAB:     { trajectory: "Patterning",           level: "Patterner AB → Patterner (4-unit cores L5+)",  ltLevel: [3,4],  ageRange: "3-5", desc: "Tekrar eden örüntüleri tanır, tamamlar ve genişletir; L5+ ABBC/AABB 4-elemanlı çekirdek" },
  growingPattern:{ trajectory: "Patterning",           level: "Numeric Patterner → Beg. Arithmetic Patterner", ltLevel: [6,7], ageRange: "5-7", desc: "Artan/azalan sayı örüntülerinde kural bulma; L5+ değişken adım (MAT.4.1.5)" },
  patternTranslate:{ trajectory: "Patterning",         level: "Pattern Translator & Unit Recognizer",     ltLevel: 5,      ageRange: "4-5", desc: "Örüntüyü farklı temsile çevirme ve çekirdek birim tanıma" },
  trueFalse:     { trajectory: "Patterning",           level: "Beginning Arithmetic Patterner → Relational Thinker +/-", ltLevel: [7,8], ageRange: "5-7", desc: "Eşitlik ilkeleri: değişme özelliği, etkisiz eleman, denge" },
  missingNumber: { trajectory: "Patterning",           level: "Relational Thinker +/-",                   ltLevel: 8,      ageRange: "6-7", desc: "Denklemde bilinmeyeni ilişkisel düşünerek bulur" },

  // ── NUMBER CONSERVATION (Sayı Korunumu — Counting yörüngesi) ─────────────
  conservation:  { trajectory: "Counting",             level: "Number Conserver",                          ltLevel: 18,     ageRange: "7",   desc: "Dizilim değişse de sayının korunduğunu bilir" },
  matching:      { trajectory: "Counting",             level: "Corresponder",                              ltLevel: 4,      ageRange: "3-4", desc: "Rakam-miktar eşleme (bire-bir)" },
};
