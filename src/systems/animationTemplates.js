// ═══════════════════════════════════════════════════════════════════════════════
// KATEGORİ BAZLI ANİMASYON ŞABLONLARI — Didaktik Animasyon Konfigürasyonu
// Her kavram için metin yerine kısa, adım adım kavram inşa eden animasyonlar
// ═══════════════════════════════════════════════════════════════════════════════

// Animasyon kontrolleri: Başlat / Duraklat / Yavaşlat / Tekrar İzle
// Animasyonlar otomatik başlamaz, çocuk tetikler.

// ── Ortak Animasyon Parametreleri ─────────────────────────────────────────────
export const ANIM_DEFAULTS = {
  stepDelay: 600,       // ms: adımlar arası bekleme
  objectAppear: 400,    // ms: nesne belirme süresi
  objectDisappear: 300, // ms: nesne kaybolma süresi
  highlightDur: 500,    // ms: vurgulama süresi
  transitionDur: 350,   // ms: konum değişim süresi
  countTickDelay: 500,  // ms: sayma tıklaması arası
  flashDur: 1500,       // ms: subitizing flash süresi (LT düzeyine göre ayarlanır)
  pauseForChild: true,  // Her adımda çocuğun "Sonraki" demesi beklenir mi
};

// ── LT Düzeyine Göre Animasyon Hız Ayarı ─────────────────────────────────────
export const getAnimSpeed = (ltLevel) => {
  if (ltLevel <= 5)  return { multiplier: 1.5, label: "Yavaş" };   // Düşük: bol zaman
  if (ltLevel <= 10) return { multiplier: 1.0, label: "Normal" };   // Orta
  return { multiplier: 0.7, label: "Hızlı" };                       // Yüksek: hızlı geçiş
};

// ═══════════════════════════════════════════════════════════════════════════════
// KATEGORİ 1: SAYMA ANİMASYONLARI
// ═══════════════════════════════════════════════════════════════════════════════
export const COUNTING_ANIMS = {
  forward: {
    id: "count_forward",
    desc: "Nesneler tek tek belirir, her belirmede sayı etiketi güncellenir",
    steps: (count) => Array.from({ length: count }, (_, i) => ({
      action: "appear",
      objectIndex: i,
      label: i + 1,
      sound: "countTick",
      soundParam: i,
    })),
  },
  backward: {
    id: "count_backward",
    desc: "Nesneler tek tek söner, her sönmede sayı azalır",
    steps: (count) => Array.from({ length: count }, (_, i) => ({
      action: "disappear",
      objectIndex: count - 1 - i,
      label: count - i,
      sound: "countTick",
      soundParam: count - 1 - i,
    })),
  },
  rhythmic: {
    id: "count_rhythmic",
    desc: "Nesneler grup grup belirir, atlananlar soluk gösterilir",
    steps: (total, step) => {
      const result = [];
      for (let i = step; i <= total; i += step) {
        result.push({
          action: "appearGroup",
          fromIndex: i - step,
          toIndex: i - 1,
          label: i,
          highlight: true,  // sayılan sayılar parlak
          sound: "countTick",
        });
      }
      return result;
    },
  },
  fromN: {
    id: "count_from_n",
    desc: "Sayı doğrusunda roket belirlenen sayıya konumlanır, oradan devam eder",
    steps: (start, count, direction) => {
      const result = [{ action: "placeRocket", position: start, label: start }];
      for (let i = 1; i <= count; i++) {
        const pos = direction === "forward" ? start + i : start - i;
        result.push({
          action: "moveRocket",
          position: pos,
          label: pos,
          sound: "countTick",
        });
      }
      return result;
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// KATEGORİ 2: SUBİTİZİNG ANİMASYONLARI
// ═══════════════════════════════════════════════════════════════════════════════
export const SUBITIZING_ANIMS = {
  perceptual: {
    id: "subit_perceptual",
    desc: "Nokta kümesi kısa süre flash gösterilir → kaybolur → çocuk sayıyı seçer",
    getFlashDuration: (ltLevel) => {
      if (ltLevel <= 5) return 2500;  // L5: uzun
      if (ltLevel <= 7) return 1500;
      if (ltLevel <= 9) return 800;
      return 500;                      // L10: kısa
    },
    steps: (count, ltLevel) => [
      { action: "flash", objectCount: count, duration: SUBITIZING_ANIMS.perceptual.getFlashDuration(ltLevel) },
      { action: "hide" },
      { action: "prompt", text: "Kaç tane gördün?" },
    ],
  },
  conceptual: {
    id: "subit_conceptual",
    desc: "Büyük küme → alt gruplar renkle ayrışır → çocuk alt grupları toplar",
    steps: (count, subgroups) => [
      { action: "showAll", objectCount: count },
      { action: "colorSubgroups", groups: subgroups }, // e.g. [4, 3] for 7
      { action: "prompt", text: "Grupları topla!" },
    ],
  },
  patternRecognition: {
    id: "subit_pattern",
    desc: "Aynı sayının farklı düzenlerle gösterimi",
    steps: (count, patterns) => patterns.map((p, i) => ({
      action: "showPattern",
      pattern: p, // "dice" | "domino" | "random" | "tenFrame"
      objectCount: count,
      transition: i > 0 ? "morph" : "appear",
    })),
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// KATEGORİ 3: KARŞILAŞTIRMA VE SIRALAMA ANİMASYONLARI
// ═══════════════════════════════════════════════════════════════════════════════
export const COMPARING_ANIMS = {
  oneToOne: {
    id: "compare_1to1",
    desc: "İki sıra nesne üst üste hizalanır, eşleşen çiftler çizgiyle bağlanır",
    steps: (groupA, groupB) => {
      const min = Math.min(groupA, groupB);
      const result = [];
      for (let i = 0; i < min; i++) {
        result.push({ action: "connect", indexA: i, indexB: i, sound: "click" });
      }
      const extra = Math.max(groupA, groupB) - min;
      if (extra > 0) {
        result.push({
          action: "highlightExtra",
          side: groupA > groupB ? "A" : "B",
          count: extra,
        });
      }
      return result;
    },
  },
  barCompare: {
    id: "compare_bar",
    desc: "İki çubuk yan yana yükselir, uzun olan vurgulanır",
    steps: (valA, valB) => [
      { action: "growBar", side: "A", height: valA },
      { action: "growBar", side: "B", height: valB },
      { action: "highlightDiff", diff: Math.abs(valA - valB) },
      { action: "placeSymbol", symbol: valA > valB ? ">" : valA < valB ? "<" : "=" },
    ],
  },
  sorting: {
    id: "compare_sort",
    desc: "Nesneler rastgele dizilir → animasyon doğru sıralamayı adım adım gösterir",
    steps: (values) => {
      const sorted = [...values].sort((a, b) => a - b);
      return sorted.map((val, i) => ({
        action: "placeAt",
        value: val,
        targetIndex: i,
        sound: "click",
      }));
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// KATEGORİ 4: SAYI BİLEŞİMİ ANİMASYONLARI
// ═══════════════════════════════════════════════════════════════════════════════
export const COMPOSING_ANIMS = {
  decompose: {
    id: "compose_decompose",
    desc: "Bir bütün grup nesne ikiye bölünür — nesneler iki tarafa kayar",
    steps: (whole, partA, partB) => [
      { action: "showWhole", count: whole },
      { action: "split", leftCount: partA, rightCount: partB },
      { action: "showBond", whole, partA, partB }, // Number bond diyagramı
    ],
  },
  compose: {
    id: "compose_join",
    desc: "İki parçadaki nesneler ortaya doğru kayar, bütün oluşur",
    steps: (partA, partB) => [
      { action: "showParts", left: partA, right: partB },
      { action: "merge" },
      { action: "showTotal", total: partA + partB },
    ],
  },
  numberFamily: {
    id: "compose_family",
    desc: "Aynı sayının tüm ayrışma biçimleri sırayla gösterilir",
    steps: (whole) => {
      const pairs = [];
      for (let i = 0; i <= whole; i++) pairs.push([i, whole - i]);
      return pairs.map(([a, b]) => ({
        action: "showDecomposition",
        partA: a,
        partB: b,
        whole,
      }));
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// KATEGORİ 5: BASAMAK DEĞERİ ANİMASYONLARI
// ═══════════════════════════════════════════════════════════════════════════════
export const PLACEVALUE_ANIMS = {
  bundling: {
    id: "pv_bundle",
    desc: "10 birlik nesne titreşir → birleşir → tek bir onluk çubuğa dönüşür",
    steps: (ones) => {
      const result = [];
      const tens = Math.floor(ones / 10);
      for (let t = 0; t < tens; t++) {
        result.push({ action: "shake", fromIndex: t * 10, toIndex: t * 10 + 9 });
        result.push({ action: "merge10", groupIndex: t, sound: "crystalCollect" });
      }
      const rem = ones % 10;
      if (rem > 0) result.push({ action: "showRemaining", count: rem });
      return result;
    },
  },
  unbundling: {
    id: "pv_unbundle",
    desc: "Bir onluk çubuk dokunulduğunda 10 birliğe ayrışır",
    steps: () => [
      { action: "showTenBar" },
      { action: "explode", count: 10, sound: "reveal" },
    ],
  },
  compose: {
    id: "pv_compose",
    desc: "Çocuk onluk ve birlik sürükler → sayı canlı yazılır",
    steps: (tens, ones) => [
      { action: "placeTens", count: tens },
      { action: "placeOnes", count: ones },
      { action: "showNumber", number: tens * 10 + ones },
    ],
  },
  expandedForm: {
    id: "pv_expand",
    desc: "Sayı genişletilmiş forma ayrışır ve tekrar birleşir",
    steps: (number) => {
      const tens = Math.floor(number / 10);
      const ones = number % 10;
      return [
        { action: "showNumber", number },
        { action: "split", tensVal: tens * 10, onesVal: ones },
        { action: "merge", number },
      ];
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// KATEGORİ 6: TOPLAMA VE ÇIKARMA ANİMASYONLARI
// ═══════════════════════════════════════════════════════════════════════════════
export const ADDSUB_ANIMS = {
  join: {
    id: "addsub_join",
    desc: "İki grup nesne ekranın iki tarafından ortaya kayar → birleşir",
    steps: (a, b) => [
      { action: "showGroupLeft", count: a },
      { action: "showGroupRight", count: b },
      { action: "merge", sound: "correct" },
      { action: "showTotal", total: a + b },
    ],
  },
  separate: {
    id: "addsub_separate",
    desc: "Bir gruptan nesneler yukarı doğru uçar → kalan vurgulanır",
    steps: (total, remove) => [
      { action: "showAll", count: total },
      { action: "flyAway", count: remove, sound: "hide" },
      { action: "showRemaining", count: total - remove },
    ],
  },
  numberLineAdd: {
    id: "addsub_nl_add",
    desc: "Roket ilk sayıya konumlanır → ikinci sayı kadar ileri zıplar",
    steps: (a, b) => {
      const result = [{ action: "placeRocket", position: a }];
      for (let i = 1; i <= b; i++) {
        result.push({ action: "jump", to: a + i, sound: "countTick" });
      }
      result.push({ action: "showResult", total: a + b });
      return result;
    },
  },
  numberLineSub: {
    id: "addsub_nl_sub",
    desc: "Roket büyük sayıdan geriye zıplar",
    steps: (a, b) => {
      const result = [{ action: "placeRocket", position: a }];
      for (let i = 1; i <= b; i++) {
        result.push({ action: "jumpBack", to: a - i, sound: "countTick" });
      }
      result.push({ action: "showResult", total: a - b });
      return result;
    },
  },
  makeTen: {
    id: "addsub_maketen",
    desc: "8+5 → on-çerçevede 8 dolu → 2 eklenir (10) → kalan 3 ayrı → 10+3=13",
    steps: (a, b) => {
      const toTen = 10 - a;
      const remainder = b - toTen;
      return [
        { action: "fillFrame", count: a, frameSize: 10 },
        { action: "addToFrame", count: toTen, label: `${a}+${toTen}=10` },
        { action: "showRemainder", count: remainder },
        { action: "showResult", expression: `10+${remainder}=${a + b}` },
      ];
    },
  },
  inverse: {
    id: "addsub_inverse",
    desc: "Toplama yapılır → aynı nesnelerle çıkarma → ilişki vurgulanır",
    steps: (a, b) => [
      { action: "add", a, b, result: a + b },
      { action: "pause", text: "Şimdi ters işlem!" },
      { action: "subtract", total: a + b, remove: b, result: a },
      { action: "showRelation", text: `${a}+${b}=${a + b} ↔ ${a + b}-${b}=${a}` },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// KATEGORİ 7: ÇARPMA VE BÖLME ANİMASYONLARI
// ═══════════════════════════════════════════════════════════════════════════════
export const MULDIV_ANIMS = {
  equalGroups: {
    id: "mul_groups",
    desc: "Kutular tek tek belirir → her kutuya eşit sayıda nesne düşer",
    steps: (groups, perGroup) => {
      const result = [];
      for (let g = 0; g < groups; g++) {
        result.push({ action: "addGroup", groupIndex: g });
        result.push({
          action: "fillGroup",
          groupIndex: g,
          count: perGroup,
          runningTotal: (g + 1) * perGroup,
          sound: "countTick",
        });
      }
      result.push({ action: "showTotal", total: groups * perGroup });
      return result;
    },
  },
  repeatedAdd: {
    id: "mul_repeated",
    desc: "Sayı doğrusunda eşit zıplamalar",
    steps: (groups, perGroup) => {
      const result = [];
      for (let g = 1; g <= groups; g++) {
        result.push({
          action: "jump",
          to: g * perGroup,
          label: `${g}×${perGroup}=${g * perGroup}`,
          sound: "countTick",
        });
      }
      return result;
    },
  },
  array: {
    id: "mul_array",
    desc: "Satırlar tek tek oluşur, her satır eklendiğinde çarpım güncellenir",
    steps: (rows, cols) => {
      const result = [];
      for (let r = 0; r < rows; r++) {
        result.push({
          action: "addRow",
          rowIndex: r,
          cols,
          runningTotal: (r + 1) * cols,
          label: `${r + 1}×${cols}=${(r + 1) * cols}`,
        });
      }
      return result;
    },
  },
  partitiveDivision: {
    id: "div_share",
    desc: "Nesneler birer birer sırayla kutulara dağıtılır (dealing out)",
    steps: (total, groups) => {
      const perGroup = Math.floor(total / groups);
      const result = [];
      for (let round = 0; round < perGroup; round++) {
        for (let g = 0; g < groups; g++) {
          result.push({
            action: "dealOne",
            toGroup: g,
            remaining: total - (round * groups + g + 1),
            sound: "click",
          });
        }
      }
      result.push({ action: "showResult", perGroup, expression: `${total}÷${groups}=${perGroup}` });
      return result;
    },
  },
  groupingDivision: {
    id: "div_group",
    desc: "Nesneler belirli sayıda gruplar hâlinde ayrılır",
    steps: (total, groupSize) => {
      const groups = Math.floor(total / groupSize);
      const result = [];
      for (let g = 0; g < groups; g++) {
        result.push({
          action: "formGroup",
          groupIndex: g,
          size: groupSize,
          remaining: total - (g + 1) * groupSize,
        });
      }
      result.push({ action: "showResult", groups, expression: `${total}÷${groupSize}=${groups}` });
      return result;
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// KATEGORİ 8: ÖRÜNTÜ ANİMASYONLARI
// ═══════════════════════════════════════════════════════════════════════════════
export const PATTERN_ANIMS = {
  repeating: {
    id: "pattern_repeat",
    desc: "Desen sıralı belirir → tekrar eden birim vurgulanır → 'Sıradaki ne?'",
    steps: (sequence, coreLength) => {
      const result = [];
      sequence.forEach((item, i) => {
        result.push({ action: "appear", index: i, value: item });
      });
      // Çekirdek birimi çerçevele
      result.push({ action: "frameCore", from: 0, to: coreLength - 1 });
      result.push({ action: "prompt", text: "Sıradaki ne?" });
      return result;
    },
  },
  growing: {
    id: "pattern_growing",
    desc: "Her adımda bir nesne daha eklenir → artış gösterilir",
    steps: (values) => values.map((val, i) => ({
      action: "growStep",
      stepIndex: i,
      value: val,
      increase: i > 0 ? val - values[i - 1] : null,
    })),
  },
  translate: {
    id: "pattern_translate",
    desc: "Bir örüntü farklı nesnelerle yeniden oluşturulur",
    steps: (originalSeq, translatedSeq) => [
      { action: "showOriginal", sequence: originalSeq },
      { action: "transition" },
      { action: "showTranslated", sequence: translatedSeq },
      { action: "highlightMapping" },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOD → ANİMASYON HARİTALAMASI
// ═══════════════════════════════════════════════════════════════════════════════
export const MODE_ANIM_MAP = {
  // Sayma
  counting: COUNTING_ANIMS.forward,
  backwardCount: COUNTING_ANIMS.backward,
  skipCount: COUNTING_ANIMS.rhythmic,
  counterFromN: COUNTING_ANIMS.fromN,
  quantityMatch: COUNTING_ANIMS.forward,
  buildNumber: COUNTING_ANIMS.forward,
  ordinalCount: COUNTING_ANIMS.forward,
  decadeCount: COUNTING_ANIMS.fromN,
  matching: COUNTING_ANIMS.forward,
  conservation: COUNTING_ANIMS.forward,

  // Subitizing
  subitizing: SUBITIZING_ANIMS.perceptual,
  fivesFrame: SUBITIZING_ANIMS.perceptual,
  tensFrame: SUBITIZING_ANIMS.conceptual,
  doubleTensFrame: SUBITIZING_ANIMS.conceptual,
  chipGuess: SUBITIZING_ANIMS.perceptual,
  rodBack: SUBITIZING_ANIMS.perceptual,
  estimateCount: SUBITIZING_ANIMS.conceptual,

  // Karşılaştırma
  comparison: COMPARING_ANIMS.barCompare,
  lessMoreEqual: COMPARING_ANIMS.oneToOne,
  ordering: COMPARING_ANIMS.sorting,
  beforeAfter: COUNTING_ANIMS.fromN,
  fiveMore: COMPARING_ANIMS.barCompare,
  numberLineEstimate: COMPARING_ANIMS.barCompare,
  nlPlacement: COMPARING_ANIMS.barCompare,
  numberLine: COMPARING_ANIMS.barCompare,
  lengthGuess: COMPARING_ANIMS.barCompare,

  // Sayı Bileşimi
  makeFive: COMPOSING_ANIMS.decompose,
  makeTen: COMPOSING_ANIMS.decompose,
  partWhole: COMPOSING_ANIMS.decompose,
  numbersInNumbers: COMPOSING_ANIMS.numberFamily,
  spaceKitchen: COMPOSING_ANIMS.compose,
  rodSplit: COMPOSING_ANIMS.decompose,

  // Basamak Değeri
  composeNumber: PLACEVALUE_ANIMS.compose,
  expandForm: PLACEVALUE_ANIMS.expandedForm,
  bundleTens: PLACEVALUE_ANIMS.bundling,
  placeValue: PLACEVALUE_ANIMS.compose,

  // Toplama/Çıkarma
  addChips: ADDSUB_ANIMS.join,
  countOnAdd: ADDSUB_ANIMS.numberLineAdd,
  addition: ADDSUB_ANIMS.numberLineAdd,
  subtraction: ADDSUB_ANIMS.numberLineSub,
  removeChips: ADDSUB_ANIMS.separate,
  difference: COMPARING_ANIMS.oneToOne,
  inversePractice: ADDSUB_ANIMS.inverse,
  wpAdd: ADDSUB_ANIMS.join,
  wpSub: ADDSUB_ANIMS.separate,
  wpCompare: COMPARING_ANIMS.oneToOne,

  // Çarpma/Bölme
  repeatAdd: MULDIV_ANIMS.repeatedAdd,
  multiplyVisual: MULDIV_ANIMS.equalGroups,
  arrayDots: MULDIV_ANIMS.array,
  timesTable: MULDIV_ANIMS.repeatedAdd,
  katConcept: MULDIV_ANIMS.equalGroups,
  wpMul: MULDIV_ANIMS.equalGroups,
  equalShare: MULDIV_ANIMS.partitiveDivision,
  groupCount: MULDIV_ANIMS.groupingDivision,
  halfDouble: MULDIV_ANIMS.equalGroups,
  divisionBasic: MULDIV_ANIMS.partitiveDivision,
  mulDivInverse: MULDIV_ANIMS.equalGroups,
  wpDiv: MULDIV_ANIMS.partitiveDivision,

  // Örüntü
  patternAB: PATTERN_ANIMS.repeating,
  growingPattern: PATTERN_ANIMS.growing,
  patternTranslate: PATTERN_ANIMS.translate,
  trueFalse: COMPOSING_ANIMS.decompose,
  missingNumber: ADDSUB_ANIMS.numberLineAdd,
  spaceBalance: COMPARING_ANIMS.barCompare,
};

// ── Kategori Bazlı Görsel Model Tablosu ──────────────────────────────────────
export const CATEGORY_VISUAL_MODELS = {
  counting:    { primary: "numberLine", secondary: "numberStrip", label: "Sayı Doğrusu" },
  subitizing:  { primary: "dotPattern", secondary: "tenFrame",    label: "Nokta Düzeni" },
  comparing:   { primary: "barModel",   secondary: "numberLine",  label: "Çubuk Model" },
  composing:   { primary: "partWhole",  secondary: "numberBond",  label: "Parça-Bütün" },
  placeValue:  { primary: "placeTable", secondary: "numberLine",  label: "Basamak Tablosu" },
  addSub:      { primary: "numberLine", secondary: "tenFrame",    label: "Sayı Doğrusu" },
  mulDiv:      { primary: "array",      secondary: "skipLine",    label: "Dizi Model" },
  pattern:     { primary: "strip",      secondary: "grid",        label: "Desen Şeridi" },
};
