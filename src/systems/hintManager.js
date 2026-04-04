// ═══════════════════════════════════════════════════════════════════════════════
// KADEMELİ İPUCU SİSTEMİ (HintManager) — 5 Kademe Pedagojik İpucu Mimarisi
// Clements & Sarama LT uyumlu | Üçlü kodlama (Somut→Görsel→Sembolik) entegre
// ═══════════════════════════════════════════════════════════════════════════════

// İpucu felsefesi: Cevabı VERMEZ, düşünmeyi yönlendirir.
// Her basış bir sonraki kademeyi açar. İpucu kullanmak puan kaybı yaratmaz.

// ── Kademe Tanımları ──────────────────────────────────────────────────────────
// 1: Yönlendirici Soru (minimal destek — ses + kısa yazı)
// 2: Görsel Vurgulama (dikkat yönlendirme — metin yok, sadece görsel)
// 3: Kısmi Animasyon (işlemin ilk 1-2 adımı gösterilir)
// 4: Tam Animasyon (adım adım çözüm, 3 temsil katmanı eşzamanlı)
// 5: Somut Deneyim Modu (tamamen yönlendirilmiş sürükle-bırak)

export const HINT_LEVELS = {
  QUESTION: 1,
  HIGHLIGHT: 2,
  PARTIAL_ANIM: 3,
  FULL_ANIM: 4,
  CONCRETE_EXP: 5,
};

// ── Kategori Bazlı Yönlendirici Sorular (Kademe 1) ──────────────────────────
const GUIDING_QUESTIONS = {
  // Sayma
  counting:      ["Baştan saysan kaça ulaşırsın?", "Her nesneye bir kez dokun — kaç tane?"],
  quantityMatch: ["Kaç tane nesne var? Rakamla eşle!", "Parmağınla göster — kaç tane?"],
  buildNumber:   ["Kaç tane yıldız taşı lazım?", "Sayıyı oluşturmak için kaç nesne koymalısın?"],
  backwardCount: ["Sondan başa doğru say!", "Bir önceki sayı ne?"],
  counterFromN:  ["Bu sayıdan devam et — sonraki ne?", "Sayı komşularını düşün!"],
  decadeCount:   ["Onluk geçişine dikkat! Sonraki sayı ne?", "9'dan sonra ne gelir?"],
  skipCount:     ["Kaçar kaçar atlıyorsun?", "Bir sonraki atlama nereye düşer?"],
  ordinalCount:  ["Sırayla say — kaçıncı?", "Birinci, ikinci... sonra?"],
  conservation:  ["Nesneleri say — dizilim değişti mi sayı değişir mi?"],
  matching:      ["Rakamı bul — kaç nesne var?", "Nesneleri say, doğru rakamla eşle!"],

  // Subitizing
  subitizing:    ["Hızlıca bak — kaç tane gördün?", "Saymadan tahmin et!"],
  fivesFrame:    ["Beşlik kartta dolu kutu kaç?", "Boş kutuları say, 5'ten çıkar!"],
  tensFrame:     ["Onluk çerçevede kaçı dolu?", "Boşluklar sana ipucu veriyor!"],
  doubleTensFrame:["İlk çerçeve dolu mu? Kaç tane taşıyor?", "10 + kaç?"],
  chipGuess:     ["Gördüklerini hatırla — kaç taneydi?", "Grupları düşün!"],
  rodBack:       ["Ne gördün? Hatırla!", "Aklında tut — kaç taneydi?"],
  estimateCount: ["Referans grubuna bak — kaç tane grup var?", "Yaklaşık kaç tane?"],

  // Karşılaştırma
  comparison:    ["Hangisi daha çok?", "İkisini yan yana koy — hangisi uzun?"],
  lessMoreEqual: ["Hangisi daha az? Hangisi daha çok?", "Eşit mi, farklı mı?"],
  ordering:      ["En küçük hangisi?", "Küçükten büyüğe sırala!"],
  beforeAfter:   ["Bu sayının komşuları kim?", "Hemen önce ve sonra ne gelir?"],
  fiveMore:      ["5'e yakın mı, uzak mı?", "5'ten büyük mü küçük mü?"],
  numberLineEstimate: ["Sayı doğrusunda nereye düşer?", "Ortası nere?"],
  nlPlacement:   ["Bu sayı nereye ait?", "Sola mı sağa mı yakın?"],
  numberLine:    ["Konum neyi gösteriyor?", "Sayı doğrusunda neredeyiz?"],
  lengthGuess:   ["Uzunluk ne kadar?", "Referansa göre tahmin et!"],

  // Sayı Bileşimi
  makeFive:      ["5 yapmak için kaç tane daha lazım?", "Eline bak — kaç parmak katlı?"],
  makeTen:       ["10'a tamamlamak için ne eksik?", "İki elin = 10 parmak!"],
  partWhole:     ["Bu sayıyı iki parçaya nasıl bölersin?", "Bütünden bilinen parçayı çıkar!"],
  numbersInNumbers:["Bu sayı hangi parçalara ayrılır?", "Kaç farklı şekilde yazabilirsin?"],
  spaceKitchen:  ["Hedef sayıyı oluşturmak için hangi parçalar lazım?"],
  rodSplit:      ["Çubuğu nereden kesebilirsin?", "Kaç farklı şekilde bölebilirsin?"],

  // Basamak Değeri
  composeNumber: ["Kaç tane onluk var?", "Onluk + birlik = ?"],
  expandForm:    ["Bu sayıda kaç onluk, kaç birlik?", "Sayıyı aç: onluklar + birlikler!"],
  bundleTens:    ["10 taneyi bir araya getir!", "Kaç tane 10'luk grup yapabilirsin?"],
  placeValue:    ["Soldaki rakam ne değerinde?", "Onluk basamağı ne söylüyor?"],

  // Toplama/Çıkarma
  addChips:      ["İki grubu birleştir — toplam kaç?", "Hepsini say!"],
  countOnAdd:    ["Büyük sayıdan başlayıp saysan?", "Büyüğü bul, üzerine ekle!"],
  addition:      ["Toplamak = birleştirmek! Kaç olur?", "10'a tamamla stratejisini dene!"],
  subtraction:   ["Çıkarmak = ayırmak! Kaç kalır?", "Geriye doğru say!"],
  removeChips:   ["Kaç tane çıkarıyorsun? Kaç kalır?", "Çıkar ve kalanı say!"],
  difference:    ["İki grup arasındaki fark kaç?", "Eşleştir — fazla kalan kaç?"],
  inversePractice:["Toplama ile çıkarma birbirinin tersi!", "Bildiğin işlemi ters çevir!"],
  wpAdd:         ["Problemde ne birleşiyor?", "Toplam kaç olur?"],
  wpSub:         ["Problemde ne ayrılıyor?", "Kaç tane çıkarılıyor?"],
  wpCompare:     ["İkisi arasındaki fark ne?", "Hangisi daha çok ve ne kadar?"],

  // Çarpma/Bölme
  repeatAdd:     ["Kaç grup var? Her grupta kaç tane?", "Hepsini topla!"],
  multiplyVisual:["Kaç grup? Her grupta kaç?", "Grup sayısı × gruptaki = toplam!"],
  arrayDots:     ["Kaç satır? Her satırda kaç?", "Satır × sütun!"],
  timesTable:    ["Çarpım tablosunu hatırla!", "Ritmik say!"],
  katConcept:    ["Kaç katı?", "Kaç kere tekrarlanıyor?"],
  wpMul:         ["Eşit gruplar kaç kere?", "Her seferde kaç tane?"],
  equalShare:    ["Eşit paylaştır — herkes kaç alır?", "Birer birer dağıt!"],
  groupCount:    ["Kaçar kaçar grupluyorsun?", "Kaç grup oluşur?"],
  halfDouble:    ["Yarısı kaç? İki katı kaç?", "÷2 veya ×2!"],
  divisionBasic: ["Çarpmayı düşün — tersi ne?", "Kaça bölünüyor?"],
  mulDivInverse: ["Çarpma ile bölme birbirinin tersi!", "Bildiğin işlemi ters çevir!"],
  wpDiv:         ["Eşit paylaşınca herkes kaç alır?", "Toplam ÷ kişi sayısı!"],

  // Örüntü
  patternAB:     ["Tekrar eden kısım hangisi?", "Desende çekirdek kalıbı bul!"],
  growingPattern:["Her adımda kaç artıyor?", "Kuralı bul!"],
  patternTranslate:["Aynı desen, farklı nesneler!", "Çekirdeği bul, çevir!"],
  trueFalse:     ["İki taraf eşit mi?", "Terazi dengede mi?"],
  missingNumber: ["Eksik sayı ne olmalı?", "Denklemi dengele!"],
  spaceBalance:  ["İki tarafı eşitle!", "Toplam eşit olmalı!"],
};

// ── Kategori Bazlı Görsel Vurgulama Talimatları (Kademe 2) ──────────────────
// highlight türleri: "blink" | "frame" | "arrow" | "enlarge" | "colorGroup"
const VISUAL_HIGHLIGHTS = {
  counting:      { type: "blink", target: "objects", desc: "Nesneler sırayla yanıp söner" },
  subitizing:    { type: "colorGroup", target: "subgroups", desc: "Alt gruplar renkle ayrışır" },
  fivesFrame:    { type: "frame", target: "emptySlots", desc: "Boş kutular vurgulanır" },
  tensFrame:     { type: "frame", target: "emptySlots", desc: "Boş kutular vurgulanır" },
  comparison:    { type: "enlarge", target: "biggerGroup", desc: "Büyük grup belirginleşir" },
  lessMoreEqual: { type: "arrow", target: "groups", desc: "İki grup arasında ok" },
  ordering:      { type: "blink", target: "smallest", desc: "En küçük eleman yanıp söner" },
  makeFive:      { type: "frame", target: "gap", desc: "Eksik parça vurgulanır" },
  makeTen:       { type: "frame", target: "gap", desc: "Eksik parça vurgulanır" },
  partWhole:     { type: "frame", target: "missingPart", desc: "Eksik parça vurgulanır" },
  addition:      { type: "arrow", target: "numberLine", desc: "Sayı doğrusunda başlangıç vurgulanır" },
  subtraction:   { type: "arrow", target: "numberLine", desc: "Sayı doğrusunda geriye ok" },
  addChips:      { type: "blink", target: "groups", desc: "İki grup sırayla yanıp söner" },
  removeChips:   { type: "blink", target: "removeTarget", desc: "Çıkarılacak nesneler yanıp söner" },
  composeNumber: { type: "frame", target: "tens", desc: "Onluklar kutusu vurgulanır" },
  bundleTens:    { type: "colorGroup", target: "tenGroup", desc: "10'luk grup çerçevelenir" },
  placeValue:    { type: "enlarge", target: "digit", desc: "Sorgulanan rakam büyür" },
  repeatAdd:     { type: "blink", target: "groups", desc: "Gruplar sırayla yanıp söner" },
  multiplyVisual:{ type: "blink", target: "groups", desc: "Eşit gruplar sırayla belirir" },
  arrayDots:     { type: "frame", target: "firstRow", desc: "İlk satır çerçevelenir" },
  equalShare:    { type: "arrow", target: "containers", desc: "Dağıtım kapları vurgulanır" },
  patternAB:     { type: "frame", target: "coreUnit", desc: "Tekrar eden birim altı çizilir" },
  growingPattern:{ type: "enlarge", target: "lastStep", desc: "Son adım ve artış vurgulanır" },
  missingNumber: { type: "frame", target: "unknown", desc: "Bilinmeyen kutu vurgulanır" },
  spaceBalance:  { type: "blink", target: "lighterSide", desc: "Hafif taraf yanıp söner" },

  // Ek modlar
  doubleTensFrame:{ type: "frame", target: "secondFrame", desc: "İkinci onluk çerçeve vurgulanır" },
  katConcept:    { type: "colorGroup", target: "groups", desc: "Kat grupları renkle ayrışır" },
  timesTable:    { type: "frame", target: "product", desc: "Çarpım sonucu vurgulanır" },
  divisionBasic: { type: "arrow", target: "groups", desc: "Eşit gruplara bölme oku" },
  countOnAdd:    { type: "enlarge", target: "bigNumber", desc: "Büyük sayı belirginleştirilir" },
  quantityMatch: { type: "blink", target: "objects", desc: "Nesneler sırayla yanıp söner" },
  buildNumber:   { type: "frame", target: "targetNumber", desc: "Hedef sayı vurgulanır" },
  backwardCount: { type: "arrow", target: "numberLine", desc: "Sayı doğrusunda geriye ok" },
  counterFromN:  { type: "enlarge", target: "startNumber", desc: "Başlangıç sayısı büyür" },
  decadeCount:   { type: "frame", target: "transition", desc: "Onluk geçişi vurgulanır" },
  skipCount:     { type: "arrow", target: "numberLine", desc: "Atlama adımları ok ile gösterilir" },
  ordinalCount:  { type: "blink", target: "ordinalTarget", desc: "Sıralı nesne yanıp söner" },
  conservation:  { type: "blink", target: "objects", desc: "Nesneler sırayla yanıp söner" },
  matching:      { type: "blink", target: "objects", desc: "Nesneler sırayla yanıp söner" },
  chipGuess:     { type: "colorGroup", target: "subgroups", desc: "Alt gruplar renkle ayrışır" },
  rodBack:       { type: "blink", target: "objects", desc: "Nesneler kısa süre görünür" },
  estimateCount: { type: "frame", target: "referenceGroup", desc: "Referans grubu vurgulanır" },
  beforeAfter:   { type: "frame", target: "neighbors", desc: "Komşu sayılar vurgulanır" },
  fiveMore:      { type: "frame", target: "fiveRef", desc: "5 referansı vurgulanır" },
  numberLineEstimate:{ type: "arrow", target: "midpoint", desc: "Orta nokta vurgulanır" },
  nlPlacement:   { type: "arrow", target: "numberLine", desc: "Hedef konum vurgulanır" },
  numberLine:    { type: "arrow", target: "position", desc: "Konum oku gösterilir" },
  lengthGuess:   { type: "frame", target: "reference", desc: "Referans uzunluk vurgulanır" },
  numbersInNumbers:{ type: "frame", target: "parts", desc: "Parçalar vurgulanır" },
  spaceKitchen:  { type: "blink", target: "ingredients", desc: "Parçalar sırayla yanıp söner" },
  rodSplit:      { type: "arrow", target: "splitPoint", desc: "Kesme noktası vurgulanır" },
  expandForm:    { type: "frame", target: "placeValues", desc: "Basamak değerleri vurgulanır" },
  difference:    { type: "enlarge", target: "excess", desc: "Fazla kısım belirginleştirilir" },
  inversePractice:{ type: "arrow", target: "operation", desc: "Ters işlem oku gösterilir" },
  wpAdd:         { type: "frame", target: "groups", desc: "Birleşen gruplar vurgulanır" },
  wpSub:         { type: "frame", target: "removeTarget", desc: "Çıkarılacak grup vurgulanır" },
  wpCompare:     { type: "enlarge", target: "biggerGroup", desc: "Büyük grup belirginleştirilir" },
  groupCount:    { type: "colorGroup", target: "groups", desc: "Gruplar renkle ayrışır" },
  halfDouble:    { type: "arrow", target: "splitLine", desc: "Yarılama çizgisi gösterilir" },
  mulDivInverse: { type: "arrow", target: "operation", desc: "Ters işlem oku gösterilir" },
  wpMul:         { type: "blink", target: "groups", desc: "Eşit gruplar sırayla yanıp söner" },
  wpDiv:         { type: "arrow", target: "containers", desc: "Dağıtım kapları vurgulanır" },
  patternTranslate:{ type: "frame", target: "coreUnit", desc: "Çekirdek birim vurgulanır" },
  trueFalse:     { type: "frame", target: "sides", desc: "İki taraf vurgulanır" },

  // Varsayılan
  default:       { type: "blink", target: "answer", desc: "Cevap alanı yanıp söner" },
};

// ── Kısmi Animasyon Açıklamaları (Kademe 3) ─────────────────────────────────
const PARTIAL_ANIMATIONS = {
  counting:      { steps: 2, desc: "İlk 2-3 nesne sayılır, geri kalan çocuğa bırakılır" },
  addition:      { steps: 1, desc: "İlk sayı dizilir → 'Şimdi ikinci sayıyı ekle'" },
  subtraction:   { steps: 1, desc: "Tüm nesneler dizilir → 'Şimdi çıkar'" },
  makeTen:       { steps: 1, desc: "On-çerçevede mevcut sayı doldurulur → 'Kaç boş?'" },
  makeFive:      { steps: 1, desc: "5'lik çerçevede mevcut sayı doldurulur → 'Kaç boş?'" },
  partWhole:     { steps: 1, desc: "Bütün gösterilir, bir parça yerleştirilir → 'Diğer parça?'" },
  comparison:    { steps: 1, desc: "İki grup yan yana dizilir → 'Hangisi daha çok?'" },
  ordering:      { steps: 2, desc: "İlk iki eleman sıralanır → 'Devam et'" },
  repeatAdd:     { steps: 1, desc: "İlk grup gösterilir → 'Kaç grup daha lazım?'" },
  multiplyVisual:{ steps: 1, desc: "İlk grup gösterilir → 'Kaç grup daha lazım?'" },
  arrayDots:     { steps: 1, desc: "İlk satır oluşur → 'Kaç satır daha?'" },
  equalShare:    { steps: 2, desc: "İlk 2 nesne dağıtılır → 'Devam et'" },
  patternAB:     { steps: 1, desc: "Tekrar eden birimin ilk turu gösterilir → 'Sonra ne?'" },
  growingPattern:{ steps: 2, desc: "İlk iki adım gösterilir → 'Kural ne?'" },
  bundleTens:    { steps: 1, desc: "İlk 10'lu grup oluşturulur → 'Devam et'" },
  missingNumber: { steps: 1, desc: "Denklemin bilinen kısmı animasyonla yazılır" },
  default:       { steps: 1, desc: "İşlemin ilk adımı gösterilir" },
};

// ── HintManager Ana Objesi ───────────────────────────────────────────────────
export const HintManager = {
  // Mevcut ipucu kademesini al (her soru için 1'den başlar)
  getHint(mode, level, question, correctAnswer) {
    const q = question || {};
    const ca = correctAnswer;

    switch (level) {
      case 1: return this._getGuidingQuestion(mode);
      case 2: return this._getVisualHighlight(mode);
      case 3: return this._getPartialAnimation(mode, q, ca);
      case 4: return this._getFullAnimation(mode, q, ca);
      case 5: return this._getConcreteExperience(mode, q, ca);
      default: return this._getGuidingQuestion(mode);
    }
  },

  // Kademe 1: Yönlendirici Soru
  _getGuidingQuestion(mode) {
    const pool = GUIDING_QUESTIONS[mode] || GUIDING_QUESTIONS.counting;
    const text = pool[Math.floor(Math.random() * pool.length)];
    return {
      level: 1,
      type: "question",
      text,
      speak: true,  // TTS ile oku
      visual: null,
    };
  },

  // Kademe 2: Görsel Vurgulama
  _getVisualHighlight(mode) {
    const hl = VISUAL_HIGHLIGHTS[mode] || VISUAL_HIGHLIGHTS.default;
    return {
      level: 2,
      type: "highlight",
      text: null,  // Metin yok
      speak: false,
      visual: {
        action: hl.type,    // "blink" | "frame" | "arrow" | "enlarge" | "colorGroup"
        target: hl.target,  // UI element identifier
        duration: 2000,
        pulseCount: 3,
      },
    };
  },

  // Kademe 3: Kısmi Animasyon
  _getPartialAnimation(mode, q, ca) {
    const pa = PARTIAL_ANIMATIONS[mode] || PARTIAL_ANIMATIONS.default;
    return {
      level: 3,
      type: "partialAnim",
      text: pa.desc,
      speak: true,
      visual: {
        action: "animate",
        steps: pa.steps,
        mode,
        question: q,
        correctAnswer: ca,
        partial: true,
      },
    };
  },

  // Kademe 4: Tam Animasyon
  _getFullAnimation(mode, q, ca) {
    return {
      level: 4,
      type: "fullAnim",
      text: "Adım adım izle, sonra kendin dene!",
      speak: true,
      visual: {
        action: "animate",
        mode,
        question: q,
        correctAnswer: ca,
        partial: false,
        showTripleCode: true, // Üç temsil eşzamanlı
        pauseAtSteps: true,   // Her adımda duraklama
      },
    };
  },

  // Kademe 5: Somut Deneyim Modu
  _getConcreteExperience(mode, q, ca) {
    return {
      level: 5,
      type: "concrete",
      text: "Nesneleri sürükleyerek çöz!",
      speak: true,
      visual: {
        action: "guided",
        mode,
        question: q,
        correctAnswer: ca,
        guidedSteps: true,  // Her adımda ok + sesli yönerge
        enlarged: true,      // Büyütülmüş materyal
      },
    };
  },

  // ── Loglama: İpucu kullanım verisini döndür ────────────────────────────────
  createLog(mode, hintLevel, questionId) {
    return {
      mode,
      hintLevel,
      questionId,
      timestamp: Date.now(),
    };
  },

  // ── Adaptif Davranış: Sürekli yüksek kademe → zorluk düşür ────────────────
  shouldReduceDifficulty(hintLogs, windowSize = 5) {
    if (!hintLogs || hintLogs.length < windowSize) return false;
    const recent = hintLogs.slice(-windowSize);
    const avgLevel = recent.reduce((s, l) => s + l.hintLevel, 0) / windowSize;
    return avgLevel >= 3.5; // Ortalama kademe 3.5+ → zorluk düşür
  },

  // ── Adaptif Davranış: Hiç ipucu kullanılmıyor + hızlı → zorluk artır ──────
  shouldIncreaseDifficulty(hintLogs, recentAccuracy, avgResponseTime, windowSize = 5) {
    if (!hintLogs) return recentAccuracy >= 90 && avgResponseTime < 4;
    const recent = hintLogs.slice(-windowSize);
    const noHints = recent.length === 0 || recent.every(l => l.hintLevel === 0);
    return noHints && recentAccuracy >= 90 && avgResponseTime < 4;
  },

  // Maksimum kademe
  MAX_LEVEL: 5,
};
