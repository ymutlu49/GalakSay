// ═══════════════════════════════════════════════════════════════════════════
// MATEMATİK KAYGISI TAKİP SİSTEMİ
// Uzman Konsensüsü: 2/6 uzman — Ashcraft & Moore (2009), Dowker et al. (2016)
// Davranışsal göstergeler ile kaygı tahmini (self-report mümkün değil 5-8 yaş)
// ═══════════════════════════════════════════════════════════════════════════
export const AnxietyTracker = {
  // Davranışsal göstergeler
  indicators: {
    // Yanıt süresi tutarsızlığı (yüksek varyans = kararsızlık/kaygı)
    responseTimeVariance: (times) => {
      if (!times || times.length < 5) return 0;
      const avg = times.reduce((s, t) => s + t, 0) / times.length;
      const variance = times.reduce((s, t) => s + Math.pow(t - avg, 2), 0) / times.length;
      return Math.sqrt(variance); // standart sapma
    },

    // Kaçınma davranışı: belirli modlarda çok düşük oyun sayısı
    avoidancePattern: (modeStats) => {
      const entries = Object.entries(modeStats || {});
      if (entries.length < 3) return [];
      const avgGames = entries.reduce((s, [_, d]) => s + (d.games || 0), 0) / entries.length;
      return entries
        .filter(([_, d]) => (d.games || 0) > 0 && d.total > 0 && (d.correct / d.total) < 0.4)
        .map(([mode]) => mode);
    },

    // Hız bazlı tıklama (rastgele seçim — cognitive avoidance)
    rapidGuessing: (responseTimes) => {
      if (!responseTimes || responseTimes.length < 3) return false;
      const recent = responseTimes.slice(-5);
      const fastClicks = recent.filter(t => t < 1.2).length;
      return fastClicks >= 3; // 5 soruda 3+ çok hızlı yanıt
    },
  },

  // Kaygı seviyesi hesaplama (0-3: düşük, orta, yüksek, kritik)
  calcLevel: (responseTimes, modeStats, consecutiveWrongs) => {
    let score = 0;
    const rtVar = AnxietyTracker.indicators.responseTimeVariance(responseTimes);
    if (rtVar > 8) score += 2;
    else if (rtVar > 5) score += 1;

    if (AnxietyTracker.indicators.rapidGuessing(responseTimes)) score += 2;

    const avoidedModes = AnxietyTracker.indicators.avoidancePattern(modeStats);
    if (avoidedModes.length >= 3) score += 1;

    if (consecutiveWrongs >= 4) score += 1;

    return Math.min(Math.floor(score / 2), 3);
  },

  // Ebeveyn/öğretmen için gösterge
  getReport: (responseTimes, modeStats, consecutiveWrongs) => {
    const level = AnxietyTracker.calcLevel(responseTimes, modeStats, consecutiveWrongs);
    const avoided = AnxietyTracker.indicators.avoidancePattern(modeStats);
    const rapid = AnxietyTracker.indicators.rapidGuessing(responseTimes);

    const labels = ["Düşük 🟢", "Hafif 🟡", "Orta 🟠", "Yüksek 🔴"];
    return {
      level,
      label: labels[level],
      isRapidGuessing: rapid,
      avoidedModes: avoided,
      suggestion: level >= 2
        ? "Çocuğunuz bazı konularda kaygı belirtileri gösteriyor. Daha kolay modlarla başlayıp başarı deneyimi yaşamasını sağlayın. Fiziksel materyallerle pratik yapması faydalı olabilir."
        : level === 1
        ? "Hafif tereddüt gözleniyor. Bu normaldir. Destekleyici ve sabırlı bir tutum sürdürün."
        : "Sağlıklı öğrenme örüntüsü gözleniyor.",
    };
  },
};
