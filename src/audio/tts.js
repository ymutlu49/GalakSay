// ═══ TTS — Sesli Yönlendirme (Web Speech API) ══════════════════════════════
// Rapor §4.1: 4-5 yaş grubu için sesli okuma, Türkçe doğal ses
export const TTS = {
  supported: typeof window !== "undefined" && "speechSynthesis" in window,
  _lastText: "", _lastTime: 0,
  speak: (text, lang = "tr-TR", rate = 0.9) => {
    if (!TTS.supported || !text) return;
    // Debounce: aynı metin 1.5s içinde tekrar seslendirilmesin
    const now = Date.now();
    if (text === TTS._lastText && now - TTS._lastTime < 1500) return;
    TTS._lastText = text; TTS._lastTime = now;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = rate; u.pitch = 1.1; u.volume = 0.8;
      const voices = window.speechSynthesis.getVoices();
      const trVoice = voices.find(v => v.lang.startsWith("tr")) || voices.find(v => v.lang.startsWith(lang.split("-")[0]));
      if (trVoice) u.voice = trVoice;
      window.speechSynthesis.speak(u);
    } catch {}
  },
  stop: () => { try { window.speechSynthesis.cancel(); } catch {} },
  speakQuestion: (q, lang = "tr-TR") => {
    if (!q) return;
    const t = q.type;
    const texts = {
      // ── SAYMA ──
      counting: `Enerji kapsülünde kaç yıldız taşı var?`,
      quantityMatch: `Bu yıldız taşları hangi sayıyı gösteriyor?`,
      matching: `Yıldız taşlarını say ve doğru rakam kartını bul!`,
      buildNumber: `${q.target || ""} sayısı kadar yıldız taşı yerleştir!`,
      backwardCount: `${q.startNum || ""}'den ${q.stepsBack || ""} geriye doğru say!`,
      counterFromN: q.direction === "forward" ? `${q.start || ""}'dan ${q.steps || ""} adım ileriye say!` : `${q.start || ""}'dan ${q.steps || ""} adım geriye say!`,
      decadeCount: `${q.sequence ? q.sequence[0] : ""}'dan başlayarak say, onluk geçişine dikkat!`,
      skipCount: `${q.step || ""}'${({2:"şer",3:"er",4:"er",5:"er",6:"şar",7:"şer",8:"er",9:"ar",10:"ar"}[q.step] || "er")} atlayarak say, sıradaki ne?`,
      ordinalCount: q.fromRight ? `Sağdan saydığında kaçıncı sırada?` : `Soldan saydığında kaçıncı sırada?`,
      conservation: `Dizilim değişti ama sayı değişti mi?`,

      // ── SUBİTİZİNG ──
      subitizing: `Hızlı bak, kaç tane gördün?`,
      chipGuess: `Yıldız taşlarını hatırla, kaç taneydi?`,
      rodBack: `Gizlendi! Kaç yıldız taşı vardı?`,
      fivesFrame: `Beşlik çerçevede kaç yıldız taşı var?`,
      tensFrame: `Onluk çerçevede kaç yıldız taşı var?`,
      doubleTensFrame: `Çift onluk çerçevede toplam kaç yıldız taşı var?`,
      estimateCount: `Kaç tane var? Tahmin et!`,

      // ── KARŞILAŞTIRMA ──
      comparison: `Hangisi daha ${q.askMin ? "az" : "çok"}?`,
      lessMoreEqual: `Hangisi daha az, daha çok, yoksa eşit mi?`,
      ordering: q.descending ? `Sayıları büyükten küçüğe sırala!` : `Sayıları küçükten büyüğe sırala!`,
      beforeAfter: q.subType === "before" ? `${q.number || ""}'den önce ne gelir?` : q.subType === "after" ? `${q.number || ""}'den sonra ne gelir?` : `${q.low || ""} ile ${q.high || ""} arasında ne var?`,
      fiveMore: `Bu sayı 5'ten az mı, eşit mi, çok mu?`,
      numberLineEstimate: `Sayı doğrusunda bu işaret nereye düşüyor?`,
      nlPlacement: `${q.target || ""} sayısını sayı doğrusuna yerleştir!`,
      numberLine: `Hangi enerji kapsülünde ${q.target || ""} yıldız taşı var?`,
      lengthGuess: `Gizli enerji kapsülündeki yıldız taşlarını tahmin et!`,

      // ── SAYI BİLEŞİMİ ──
      makeFive: `Beşe tamamlamak için kaç tane daha lazım?`,
      makeTen: `Ona tamamlamak için kaç tane daha lazım?`,
      partWhole: `Bütünün eksik parçasını bul!`,
      numbersInNumbers: `${q.target || ""} sayısının parçalarını bul!`,
      spaceKitchen: `Hedef sayıyı oluşturmak için parçaları birleştir!`,
      rodSplit: `Enerji kapsülünü ikiye böl!`,

      // ── BASAMAK DEĞERİ ──
      composeNumber: `${q.tens || ""} onluk ve ${q.ones || ""} birlik, toplam kaç?`,
      expandForm: `${q.number || ""} sayısının açılımını bul!`,
      bundleTens: `10'arlı grupla! Kaç onluk, kaç birlik?`,
      placeValue: `${q.number || ""} sayısının ${q.askTens ? "onlar" : "birler"} basamağı kaç?`,

      // ── TOPLAMA / ÇIKARMA ──
      addition: `${q.num1 || ""} artı ${q.num2 || ""} kaç eder?`,
      subtraction: `${q.num1 || ""} eksi ${q.num2 || ""} kaç eder?`,
      addChips: `${q.start || ""} yıldız taşına ${q.toAdd || ""} tane daha ekle, toplam kaç?`,
      removeChips: `${q.start || ""} yıldız taşından ${q.toRemove || ""} tane çıkar, kaç kalır?`,
      countOnAdd: `${q.bigNum || ""}'den başla, ${q.addOn || ""} tane daha say!`,
      difference: `İki enerji kapsülü arasındaki fark kaç?`,
      inversePractice: q.direction === "addToSub" ? `Toplama biliyorsan çıkarmayı da bulabilirsin!` : `Çıkarma biliyorsan toplamayı da bulabilirsin!`,
      wpAdd: q.text || `Problemi dinle ve toplayarak çöz!`,
      wpSub: q.text || `Problemi dinle ve çıkararak çöz!`,
      wpCompare: q.text || `Problemi dinle ve karşılaştır!`,

      // ── ÇARPMA / BÖLME ──
      repeatAdd: `${q.groups || ""} grup, her grupta ${q.perGroup || ""}. Toplam kaç?`,
      multiplyVisual: `${q.a || ""} çarpı ${q.b || ""} kaç eder?`,
      arrayDots: `${q.rows || ""} satır, ${q.cols || ""} sütun, toplam kaç?`,
      timesTable: `${q.a || ""} çarpı ${q.b || ""} kaç eder?`,
      divisionBasic: `${q.a || ""} bölü ${q.b || ""} kaç eder?`,
      mulDivInverse: q.askPart === "product" ? `${q.factor1 || ""} çarpı ${q.factor2 || ""} kaç?` : q.askPart === "factor1" ? `${q.product || ""} bölü ${q.factor2 || ""} kaç?` : `${q.product || ""} bölü ${q.factor1 || ""} kaç?`,
      katConcept: q.direction === "findProduct" ? `${q.base || ""}'in ${q.multiplier || ""} katı kaç?` : `${q.product || ""}, ${q.base || ""}'in kaç katıdır?`,
      equalShare: `${q.total || ""} taneyi ${q.groups || ""} gruba eşit paylaştır, her grupta kaç?`,
      groupCount: `${q.total || ""} taneyi ${q.perGroup || ""}'${({2:"şer",3:"er",4:"er",5:"er",6:"şar",7:"şer",8:"er",9:"ar",10:"ar"}[q.perGroup] || "er")} gruplara ayır, kaç grup olur?`,
      halfDouble: q.subType === "half" ? `${q.number || ""}'nin yarısı kaç?` : `${q.number || ""}'nin iki katı kaç?`,
      wpMul: q.text || `Problemi dinle ve çarparak çöz!`,
      wpDiv: q.text || `Problemi dinle ve bölerek çöz!`,

      // ── ÖRÜNTÜ ──
      patternAB: `Tekrar eden desendeki eksik parçayı bul!`,
      growingPattern: q.isVariable ? `Sayı deseni, kuralı keşfet!` : (q.direction === "increasing" ? `Her adım ${q.step || ""} artıyor, sıradaki ne?` : `Her adım ${Math.abs(q.step || 0)} azalıyor, sıradaki ne?`),
      patternTranslate: q.subType === "coreUnit" ? `Bu desenin çekirdeği ne?` : `Bu deseni sayılara çevir!`,
      missingNumber: `Denklemdeki kayıp sayıyı bul!`,
      trueFalse: `${q.leftSide || ""} eşittir ${q.rightSide || ""}. Bu doğru mu?`,
      spaceBalance: `İki tarafı eşitle!`,
    };
    // Öncelik 1: Soru objesi üzerinde özel ttsText varsa onu oku (ekrandaki soru kökü)
    // Öncelik 2: Mod bazlı önceden tanımlı metin
    // Öncelik 3: Tanımsız modlarda sessiz kal
    const text = q.ttsText || texts[t];
    if (text) {
      TTS.speak(text, lang);
    }
  },

  // Konuşma bitmeden yeni konuşma başlatmayı önle
  speakAfterCurrent: (text, lang = "tr-TR", rate = 0.9) => {
    if (!TTS.supported || !text) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      // Mevcut konuşma bitene kadar bekle
      const checkDone = () => {
        if (!synth.speaking) {
          setTimeout(() => TTS.speak(text, lang, rate), 150);
        } else {
          setTimeout(checkDone, 100);
        }
      };
      checkDone();
    } else {
      TTS.speak(text, lang, rate);
    }
  },
};
