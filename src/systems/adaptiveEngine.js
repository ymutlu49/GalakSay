// ═══ ADAPTIVE ENGINE — Uyarlanabilir Zorluk Motoru ═══════════════════════════
import { NumapProfile } from "./numapProfile.js";

export const AdaptiveEngine = {
  // Her mod için performansı değerlendir → önerilen seviye döndür
  // numapProfile parametresi opsiyonel — varsa NuMap kalibrasyonu da dikkate alınır
  suggestLevel: (modeStats, currentLevel, numapProfileData = null) => {
    // NuMap profili varsa ve oyun verisi azsa, NuMap kalibrasyonu kullan
    if (numapProfileData && (!modeStats || modeStats.played < 2)) {
      return NumapProfile.calibrateDifficulty(numapProfileData, modeStats, currentLevel);
    }
    if (!modeStats || modeStats.played < 2) return currentLevel;
    const recentAcc = modeStats.recentAcc || 0;
    const avgTime = modeStats.avgTime || 5;
    // Çok başarılı + hızlı → seviye artır
    if (recentAcc >= 85 && avgTime < 5 && currentLevel < 7) return currentLevel + 1;
    // Zorlanıyor → seviye düşür
    if (recentAcc < 45 && currentLevel > 1) return currentLevel - 1;
    return currentLevel;
  },
  // Soru içi mikro-adaptasyon: üst üste hata → daha kolay seçenek oluştur
  // NuMap yüksek riskli çocuklar için eşik daha düşük
  shouldSimplify: (sessionErrors, numapRisk = null) => {
    const threshold = numapRisk === "high" ? 1 : 2;
    return sessionErrors >= threshold;
  },
  shouldChallenge: (sessionCorrect, numapRisk = null) => {
    const threshold = numapRisk === "low" ? 2 : 3;
    return sessionCorrect >= threshold;
  },
  // Performans verisi güncelle
  updateModePerf: (existing, result) => {
    const prev = existing || { played: 0, totalCorrect: 0, totalQ: 0, recentAcc: 50, avgTime: 5, recentResults: [] };
    const recent = [...(prev.recentResults || []).slice(-9), result.acc];
    const recentAcc = recent.reduce((a, b) => a + b, 0) / recent.length;
    return {
      played: prev.played + 1,
      totalCorrect: prev.totalCorrect + result.correct,
      totalQ: prev.totalQ + result.total,
      recentAcc: Math.round(recentAcc),
      avgTime: result.avgTime ? Math.round((prev.avgTime * 0.7 + result.avgTime * 0.3) * 10) / 10 : prev.avgTime,
      recentResults: recent,
      lastPlayed: Date.now(),
      lastLevel: result.level,
    };
  },
  // Modlar arası bilgi haritası — hangi modlar prerequisite
  prerequisites: {
    addition: ["counting"],
    subtraction: ["addition"],
    partWhole: ["addition", "makeFive"],
    trueFalse: ["partWhole", "missingNumber"],
    growingPattern: ["patternAB", "counting"],
    patternTranslate: ["patternAB"],
    wpAdd: ["addition"],
    wpSub: ["subtraction"],
    wpCompare: ["wpAdd", "wpSub", "difference"],
    wpMul: ["repeatAdd", "multiplyVisual"],
    wpDiv: ["equalShare", "divisionBasic"],
    makeTen: ["makeFive"],
    repeatAdd: ["addition"],
    skipCount: ["repeatAdd"],
    timesTable: ["repeatAdd", "skipCount"],
    equalShare: ["repeatAdd"],
    divisionBasic: ["equalShare"],
    mulDivInverse: ["timesTable", "divisionBasic"],
    katConcept: ["multiplyVisual", "timesTable"],
    placeValue: ["bundleTens"],
    expandForm: ["placeValue"],
    composeNumber: ["placeValue"],
  },
  // Öğrencinin hazır olduğu modları belirle
  getReadyModes: (modePerf) => {
    const ready = new Set();
    Object.entries(modePerf).forEach(([mode, data]) => {
      if (data.recentAcc >= 60) ready.add(mode);
    });
    return ready;
  },
};
